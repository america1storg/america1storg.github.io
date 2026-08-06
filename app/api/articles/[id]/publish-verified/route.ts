import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sql } from '@vercel/postgres';
import { canPublishArticles } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if user has permission to publish
    if (!canPublishArticles(session.user.role)) {
      return NextResponse.json(
        { error: 'You do not have permission to publish articles' },
        { status: 403 }
      );
    }

    const { id: articleId } = await params;

    // Get current article
    const currentArticle = await sql`
      SELECT status, published_at, slug FROM articles WHERE id = ${articleId}
    `;

    if (currentArticle.rows.length === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const wasPublished = currentArticle.rows[0]?.published_at !== null;

    // Update article status to published
    const result = await sql`
      UPDATE articles
      SET
        status = 'published',
        published_at = ${wasPublished ? currentArticle.rows[0].published_at : new Date().toISOString()},
        approved_at = ${currentArticle.rows[0].approved_at || new Date().toISOString()},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${articleId}
      RETURNING *
    `;

    const article = result.rows[0];

    // Trigger revalidation
    revalidatePath('/articles');
    if (article.slug) {
      revalidatePath(`/articles/${article.slug}`);
    }

    return NextResponse.json({
      success: true,
      article,
      message: 'Article published successfully',
    });
  } catch (error) {
    console.error('Error publishing article:', error);
    return NextResponse.json(
      { error: 'Failed to publish article' },
      { status: 500 }
    );
  }
}
