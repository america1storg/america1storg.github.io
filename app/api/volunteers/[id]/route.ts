import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { neon } from '@neondatabase/serverless';

// Lazy initialization - only create connection when needed
// Neon integration provides POSTGRES_PRISMA_URL
const getSql = () => neon(process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL!);

// PUT update volunteer (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, url, description, domain, category, image_url } = await request.json();
    const { id } = await params;

    // Validate required fields
    if (!title || !url || !description || !domain || !category || !image_url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const sql = getSql();
    const rows = await sql`
      UPDATE volunteers
      SET
        title = ${title},
        url = ${url},
        description = ${description},
        domain = ${domain},
        category = ${category},
        image_url = ${image_url},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error updating volunteer:', error);
    return NextResponse.json(
      { error: 'Failed to update volunteer' },
      { status: 500 }
    );
  }
}

// DELETE volunteer (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const sql = getSql();
    const rows = await sql`
      DELETE FROM volunteers
      WHERE id = ${id}
      RETURNING *
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deleted: rows[0] });
  } catch (error) {
    console.error('Error deleting volunteer:', error);
    return NextResponse.json(
      { error: 'Failed to delete volunteer' },
      { status: 500 }
    );
  }
}
