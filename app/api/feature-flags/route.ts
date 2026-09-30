import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sql } from '@vercel/postgres';

// GET - List all feature flags
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const publicOnly = searchParams.get('public') === 'true';

    let query;

    if (publicOnly || !session?.user) {
      // Public view: only show permanent flags
      query = sql`
        SELECT id, name, flag_key, description, component_name, pages
        FROM feature_flags
        WHERE status = 'permanent'
        ORDER BY created_at DESC
      `;
    } else {
      // Admin view: show all flags
      query = sql`
        SELECT *
        FROM feature_flags
        ORDER BY created_at DESC
      `;
    }

    const result = await query;
    return NextResponse.json({ flags: result.rows });
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feature flags' },
      { status: 500 }
    );
  }
}

// POST - Create new feature flag
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can create flags
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { name, flag_key, description, component_name, status, pages } = await request.json();

    if (!name || !flag_key) {
      return NextResponse.json(
        { error: 'Name and flag key are required' },
        { status: 400 }
      );
    }

    // Validate flag_key format (should be like AF_carousel)
    if (!/^AF_[a-zA-Z0-9_]+$/.test(flag_key)) {
      return NextResponse.json(
        { error: 'Flag key must start with AF_ and contain only letters, numbers, and underscores' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO feature_flags (name, flag_key, description, component_name, status, pages)
      VALUES (
        ${name},
        ${flag_key},
        ${description || null},
        ${component_name || null},
        ${status || 'draft'},
        ${pages || []}
      )
      RETURNING *
    `;

    return NextResponse.json({ flag: result.rows[0] });
  } catch (error: any) {
    console.error('Error creating feature flag:', error);

    if (error.code === '23505') { // Unique constraint violation
      return NextResponse.json(
        { error: 'Flag key already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create feature flag' },
      { status: 500 }
    );
  }
}
