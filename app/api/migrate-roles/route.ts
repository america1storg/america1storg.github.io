import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    // Add role column if it doesn't exist
    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'soldier'
      CHECK (role IN ('god_mode', 'king', 'captain', 'soldier'))
    `;

    // Update God Mode user
    await sql`
      UPDATE users
      SET role = 'god_mode'
      WHERE email = 'americafirstusateam@gmail.com'
    `;

    // Set role based on is_super_admin for existing users
    await sql`
      UPDATE users
      SET role = CASE
        WHEN is_super_admin = TRUE THEN 'king'
        ELSE 'soldier'
      END
      WHERE role IS NULL OR role = 'soldier'
    `;

    // Update articles table to add new workflow fields
    await sql`
      ALTER TABLE articles
      ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE
    `;

    await sql`
      ALTER TABLE articles
      ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE
    `;

    await sql`
      ALTER TABLE articles
      ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP WITH TIME ZONE
    `;

    await sql`
      ALTER TABLE articles
      ADD COLUMN IF NOT EXISTS rejection_reason TEXT
    `;

    // Update status column to support new values
    await sql`
      ALTER TABLE articles
      DROP CONSTRAINT IF EXISTS articles_status_check
    `;

    await sql`
      ALTER TABLE articles
      ADD CONSTRAINT articles_status_check
      CHECK (status IN ('draft', 'submitted', 'needs_re_edit', 'approved', 'published'))
    `;

    // Modify status column length
    await sql`
      ALTER TABLE articles
      ALTER COLUMN status TYPE VARCHAR(30)
    `;

    return NextResponse.json({
      success: true,
      message: 'Database migrated successfully to support user roles and article workflow',
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Failed to migrate database', details: error },
      { status: 500 }
    );
  }
}
