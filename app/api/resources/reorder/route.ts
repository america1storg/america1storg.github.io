import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { neon } from '@neondatabase/serverless';

const getSql = () => neon(process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL!);

// POST update display order (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderedIds } = await request.json();

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json(
        { error: 'orderedIds must be an array' },
        { status: 400 }
      );
    }

    const sql = getSql();

    // Update each resource's display_order based on position in array
    for (let i = 0; i < orderedIds.length; i++) {
      await sql`
        UPDATE resources
        SET display_order = ${i}
        WHERE id = ${orderedIds[i]}
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering resources:', error);
    return NextResponse.json(
      { error: 'Failed to reorder resources' },
      { status: 500 }
    );
  }
}
