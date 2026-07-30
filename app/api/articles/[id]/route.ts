import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sql } from '@vercel/postgres';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id: articleId } = await params;

    let query;
    if (session?.user) {
      // Admin can see any article
      query = sql`
        SELECT a.*, u.name as author_name, u.email as author_email
        FROM articles a
        LEFT JOIN users u ON a.author_id = u.id
        WHERE a.id = ${articleId}
      `;
    } else {
      // Public can only see published articles
      query = sql`
        SELECT a.*, u.name as author_name
        FROM articles a
        LEFT JOIN users u ON a.author_id = u.id
        WHERE a.id = ${articleId} AND a.status = 'published'
      `;
    }

    const result = await query;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ article: result.rows[0] });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id: articleId } = await params;
    const { title, content, status } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate excerpt from content
    const tempDiv = content.replace(/<[^>]*>/g, '');
    const excerpt = tempDiv.substring(0, 200) + (tempDiv.length > 200 ? '...' : '');

    // Get current article to check if status is changing to published
    const currentArticle = await sql`
      SELECT status, published_at FROM articles WHERE id = ${articleId}
    `;

    const wasPublished = currentArticle.rows[0]?.published_at !== null;
    const shouldPublish = status === 'published' && !wasPublished;

    const result = await sql`
      UPDATE articles
      SET
        title = ${title},
        content = ${content},
        excerpt = ${excerpt},
        status = ${status},
        published_at = ${shouldPublish ? new Date().toISOString() : currentArticle.rows[0]?.published_at || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${articleId}
      RETURNING *
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ article: result.rows[0] });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id: articleId } = await params;

    await sql`
      DELETE FROM articles WHERE id = ${articleId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
