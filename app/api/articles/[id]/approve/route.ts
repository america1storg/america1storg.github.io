import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sql } from '@vercel/postgres';
import { canApproveArticles } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if user has permission to approve
    if (!canApproveArticles(session.user.role)) {
      return NextResponse.json(
        { error: 'You do not have permission to approve articles' },
        { status: 403 }
      );
    }

    const { id: articleId } = await params;

    // Update article status to approved
    const result = await sql`
      UPDATE articles
      SET
        status = 'approved',
        approved_at = CURRENT_TIMESTAMP,
        rejected_at = NULL,
        rejection_reason = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${articleId}
      RETURNING *
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      article: result.rows[0],
      message: 'Article approved successfully',
    });
  } catch (error) {
    console.error('Error approving article:', error);
    return NextResponse.json(
      { error: 'Failed to approve article' },
      { status: 500 }
    );
  }
}
