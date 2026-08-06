import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sql } from '@vercel/postgres';
import { canManageUsers } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !canManageUsers(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const result = await sql`
      SELECT id, email, name, is_super_admin, role, created_at
      FROM users
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ users: result.rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !canManageUsers(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { email, name, role } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const userRole = role || 'soldier';

    const result = await sql`
      INSERT INTO users (email, name, is_super_admin, role)
      VALUES (${email}, ${name || null}, FALSE, ${userRole})
      RETURNING id, email, name, is_super_admin, role, created_at
    `;

    return NextResponse.json({ user: result.rows[0] });
  } catch (error: any) {
    console.error('Error adding user:', error);

    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to add user' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !canManageUsers(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'User ID and role are required' },
        { status: 400 }
      );
    }

    // Check if trying to modify God Mode user
    const userCheck = await sql`
      SELECT email, role FROM users WHERE id = ${userId}
    `;

    if (userCheck.rows[0]?.email === 'americafirstusateam@gmail.com') {
      return NextResponse.json(
        { error: 'Cannot modify God Mode user' },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE users
      SET role = ${role}
      WHERE id = ${userId}
      RETURNING id, email, name, is_super_admin, role, created_at
    `;

    return NextResponse.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !canManageUsers(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user is God Mode
    const userCheck = await sql`
      SELECT email, role FROM users WHERE id = ${userId}
    `;

    if (userCheck.rows[0]?.email === 'americafirstusateam@gmail.com' || userCheck.rows[0]?.role === 'god_mode') {
      return NextResponse.json(
        { error: 'Cannot delete God Mode user' },
        { status: 400 }
      );
    }

    await sql`
      DELETE FROM users WHERE id = ${userId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
