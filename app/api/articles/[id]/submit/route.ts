import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sql } from '@vercel/postgres';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id: articleId } = await params;

    // Get article to verify ownership
    const article = await sql`
      SELECT author_id, status FROM articles WHERE id = ${articleId}
    `;

    if (article.rows.length === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Verify the user is the author or has elevated permissions
    const isAuthor = article.rows[0].author_id === session.user.id;
    const canSubmit = isAuthor || ['god_mode', 'king', 'captain'].includes(session.user.role);

    if (!canSubmit) {
      return NextResponse.json(
        { error: 'Only the author can submit their article for approval' },
        { status: 403 }
      );
    }

    // Update article status to submitted
    const result = await sql`
      UPDATE articles
      SET
        status = 'submitted',
        submitted_at = CURRENT_TIMESTAMP,
        rejected_at = NULL,
        rejection_reason = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${articleId}
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      article: result.rows[0],
      message: 'Article submitted for approval',
    });
  } catch (error) {
    console.error('Error submitting article:', error);
    return NextResponse.json(
      { error: 'Failed to submit article' },
      { status: 500 }
    );
  }
}
