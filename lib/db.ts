import { sql } from '@vercel/postgres';

export async function initializeDatabase() {
  try {
    // Create verification_token table (required for magic link emails)
    await sql`
      CREATE TABLE IF NOT EXISTS verification_token (
        identifier TEXT NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        token TEXT NOT NULL,
        PRIMARY KEY (identifier, token)
      )
    `;

    // Create users table (admins) - simple schema without NextAuth fields
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        is_super_admin BOOLEAN DEFAULT FALSE,
        role VARCHAR(20) DEFAULT 'soldier' CHECK (role IN ('god_mode', 'king', 'captain', 'soldier')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create articles table
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        cover_image TEXT,
        author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        status VARCHAR(30) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'needs_re_edit', 'approved', 'published')),
        published_at TIMESTAMP WITH TIME ZONE,
        submitted_at TIMESTAMP WITH TIME ZONE,
        approved_at TIMESTAMP WITH TIME ZONE,
        rejected_at TIMESTAMP WITH TIME ZONE,
        rejection_reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create article_images table (for images within articles)
    await sql`
      CREATE TABLE IF NOT EXISTS article_images (
        id SERIAL PRIMARY KEY,
        article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
        image_url VARCHAR(1000) NOT NULL,
        alt_text VARCHAR(500),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Insert super admin (God Mode) if doesn't exist
    await sql`
      INSERT INTO users (email, name, is_super_admin, role)
      VALUES ('americafirstusateam@gmail.com', 'America First Team', TRUE, 'god_mode')
      ON CONFLICT (email) DO UPDATE SET role = 'god_mode', is_super_admin = TRUE
    `;

    console.log('Database initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Helper function to check if user is admin
export async function isUserAdmin(email: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// Helper function to get user by email
export async function getUserByEmail(email: string) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// Role-based permission helpers
export type UserRole = 'god_mode' | 'king' | 'captain' | 'soldier';

export function canManageUsers(role: UserRole): boolean {
  return role === 'god_mode' || role === 'king';
}

export function canApproveArticles(role: UserRole): boolean {
  return role === 'god_mode' || role === 'king' || role === 'captain';
}

export function canPublishArticles(role: UserRole): boolean {
  return role === 'god_mode' || role === 'king' || role === 'captain';
}

export function canEditAnyArticle(role: UserRole): boolean {
  return role === 'god_mode' || role === 'king' || role === 'captain';
}

export function canDeleteUsers(role: UserRole, targetEmail: string): boolean {
  // God Mode cannot be deleted by anyone
  if (targetEmail === 'americafirstusateam@gmail.com') {
    return false;
  }
  // Only God Mode and Kings can delete users
  return role === 'god_mode' || role === 'king';
}

export function canEditArticle(
  userRole: UserRole,
  articleStatus: string,
  isAuthor: boolean
): boolean {
  // God, King, Captain can edit any article
  if (canEditAnyArticle(userRole)) {
    return true;
  }

  // Soldiers can only edit their own articles when status is draft or needs_re_edit
  if (userRole === 'soldier' && isAuthor) {
    return articleStatus === 'draft' || articleStatus === 'needs_re_edit';
  }

  return false;
}
