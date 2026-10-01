import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { neon } from '@neondatabase/serverless';

const getSql = () => neon(process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL!);

// GET user preferences
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sql = getSql();
    const users = await sql`
      SELECT
        id,
        email,
        name,
        display_name,
        display_name_type,
        sidebar_order,
        quick_actions,
        preferences,
        is_super_admin,
        role
      FROM users
      WHERE email = ${session.user.email}
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(users[0]);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

// PUT update user preferences
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      display_name,
      display_name_type,
      sidebar_order,
      quick_actions,
      preferences,
    } = body;

    const sql = getSql();

    // Direct update - simplified and faster
    const result = await sql`
      UPDATE users
      SET
        display_name = ${display_name || null},
        display_name_type = ${display_name_type || 'email'},
        sidebar_order = ${sidebar_order ? JSON.stringify(sidebar_order) : '[]'},
        quick_actions = ${quick_actions ? JSON.stringify(quick_actions) : '[]'},
        preferences = ${preferences ? JSON.stringify(preferences || {}) : '{}'},
        updated_at = NOW()
      WHERE email = ${session.user.email}
      RETURNING id, email, name, display_name, display_name_type, sidebar_order, quick_actions, preferences, is_super_admin, role
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
