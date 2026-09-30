import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { neon } from '@neondatabase/serverless';

// Lazy initialization - only create connection when needed
// Neon integration provides POSTGRES_PRISMA_URL
const getSql = () => neon(process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL!);

// GET all volunteers (public)
export async function GET() {
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT * FROM volunteers
      ORDER BY created_at DESC
    `;

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch volunteers',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST new volunteer (admin only)
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
      INSERT INTO volunteers (title, url, description, domain, category, image_url)
      VALUES (${title}, ${url}, ${description}, ${domain}, ${category}, ${image_url})
      RETURNING *
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating volunteer:', error);
    return NextResponse.json(
      { error: 'Failed to create volunteer' },
      { status: 500 }
    );
  }
}
