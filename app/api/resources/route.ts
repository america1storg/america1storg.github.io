import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { neon } from '@neondatabase/serverless';

// Lazy initialization - only create connection when needed
const getSql = () => neon(process.env.DATABASE_URL!);

// GET all resources (public)
export async function GET() {
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT * FROM resources
      ORDER BY created_at DESC
    `;

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching resources:', error);
    // Return detailed error for debugging
    return NextResponse.json(
      {
        error: 'Failed to fetch resources',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : '') : undefined
      },
      { status: 500 }
    );
  }
}

// POST new resource (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, url, description, domain, category, image_url } = await request.json();

    // Validate required fields
    if (!title || !url || !description || !domain || !category || !image_url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const sql = getSql();
    const rows = await sql`
      INSERT INTO resources (title, url, description, domain, category, image_url)
      VALUES (${title}, ${url}, ${description}, ${domain}, ${category}, ${image_url})
      RETURNING *
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}
