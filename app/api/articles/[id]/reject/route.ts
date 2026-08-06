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

    // Check if user has permission to reject
    if (!canApproveArticles(session.user.role)) {
      return NextResponse.json(
        { error: 'You do not have permission to reject articles' },
        { status: 403 }
      );
    }

    const { id: articleId } = await params;
    const { reason } = await request.json();

    // Update article status to needs_re_edit
    const result = await sql`
      UPDATE articles
      SET
        status = 'needs_re_edit',
        rejected_at = CURRENT_TIMESTAMP,
        rejection_reason = ${reason || 'Article needs revision'},
        approved_at = NULL,
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
      message: 'Article marked as needs re-edit',
    });
  } catch (error) {
    console.error('Error rejecting article:', error);
    return NextResponse.json(
      { error: 'Failed to reject article' },
      { status: 500 }
    );
  }
}
