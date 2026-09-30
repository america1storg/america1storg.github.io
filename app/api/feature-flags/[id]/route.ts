import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sql } from '@vercel/postgres';

// PUT - Update feature flag
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const { name, flag_key, description, component_name, status, pages } = await request.json();

    // Validate flag_key format if provided
    if (flag_key && !/^AF_[a-zA-Z0-9_]+$/.test(flag_key)) {
      return NextResponse.json(
        { error: 'Flag key must start with AF_ and contain only letters, numbers, and underscores' },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE feature_flags
      SET
        name = COALESCE(${name}, name),
        flag_key = COALESCE(${flag_key}, flag_key),
        description = COALESCE(${description}, description),
        component_name = COALESCE(${component_name}, component_name),
        status = COALESCE(${status}, status),
        pages = COALESCE(${pages}, pages),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Flag not found' }, { status: 404 });
    }

    return NextResponse.json({ flag: result.rows[0] });
  } catch (error: any) {
    console.error('Error updating feature flag:', error);

    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Flag key already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update feature flag' },
      { status: 500 }
    );
  }
}

// DELETE - Delete feature flag
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    const result = await sql`
      DELETE FROM feature_flags
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Flag not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, flag: result.rows[0] });
  } catch (error) {
    console.error('Error deleting feature flag:', error);
    return NextResponse.json(
      { error: 'Failed to delete feature flag' },
      { status: 500 }
    );
  }
}
