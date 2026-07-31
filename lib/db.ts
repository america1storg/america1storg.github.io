import { sql } from '@vercel/postgres';

export async function initializeDatabase() {
  try {
    // Create NextAuth tables (required for email adapter)
    await sql`
      CREATE TABLE IF NOT EXISTS verification_token (
        identifier TEXT NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        token TEXT NOT NULL,
        PRIMARY KEY (identifier, token)
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL,
        "userId" INTEGER NOT NULL,
        type VARCHAR(255) NOT NULL,
        provider VARCHAR(255) NOT NULL,
        "providerAccountId" VARCHAR(255) NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at BIGINT,
        id_token TEXT,
        scope TEXT,
        session_state TEXT,
        token_type TEXT,
        PRIMARY KEY (id)
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL,
        "userId" INTEGER NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        "sessionToken" VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
      )
    `;

    // Create users table (admins)
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        is_super_admin BOOLEAN DEFAULT FALSE,
        "emailVerified" TIMESTAMPTZ,
        image TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Add emailVerified and image columns if they don't exist (for existing tables)
    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS image TEXT
    `;

    // Create articles table
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        cover_image VARCHAR(1000),
        author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
        published_at TIMESTAMP WITH TIME ZONE,
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

    // Insert super admin if doesn't exist
    await sql`
      INSERT INTO users (email, name, is_super_admin)
      VALUES ('americafirstusateam@gmail.com', 'America First Team', TRUE)
      ON CONFLICT (email) DO NOTHING
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
