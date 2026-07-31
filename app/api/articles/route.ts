import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sql } from '@vercel/postgres';
import { generateSlug } from '@/lib/slug';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const slug = searchParams.get('slug');
    const session = await getServerSession(authOptions);

    // If slug is provided, return single article
    if (slug) {
      const result = await sql`
        SELECT a.*, u.name as author_name
        FROM articles a
        LEFT JOIN users u ON a.author_id = u.id
        WHERE a.slug = ${slug}
      `;

      if (result.rows.length === 0) {
        return NextResponse.json({ article: null }, { status: 404 });
      }

      return NextResponse.json({ article: result.rows[0] });
    }

    let query;
    if (session?.user) {
      // Admin view: show all articles
      if (status) {
        query = sql`
          SELECT a.*, u.name as author_name
          FROM articles a
          LEFT JOIN users u ON a.author_id = u.id
          WHERE a.status = ${status}
          ORDER BY a.created_at DESC
        `;
      } else {
        query = sql`
          SELECT a.*, u.name as author_name
          FROM articles a
          LEFT JOIN users u ON a.author_id = u.id
          ORDER BY a.created_at DESC
        `;
      }
    } else {
      // Public view: only show published articles
      query = sql`
        SELECT a.*, u.name as author_name
        FROM articles a
        LEFT JOIN users u ON a.author_id = u.id
        WHERE a.status = 'published'
        ORDER BY a.published_at DESC
      `;
    }

    const result = await query;
    return NextResponse.json({ articles: result.rows });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { title, content, cover_image, status, author_id } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate excerpt from content (first 200 characters of plain text)
    const tempDiv = content.replace(/<[^>]*>/g, '');
    const excerpt = tempDiv.substring(0, 200) + (tempDiv.length > 200 ? '...' : '');

    // Insert article first to get ID
    const result = await sql`
      INSERT INTO articles (title, content, excerpt, cover_image, status, author_id, published_at)
      VALUES (
        ${title},
        ${content},
        ${excerpt},
        ${cover_image || null},
        ${status},
        ${author_id},
        ${status === 'published' ? new Date().toISOString() : null}
      )
      RETURNING *
    `;

    const article = result.rows[0];

    // Generate and update slug
    const slug = generateSlug(article.title, article.id);
    await sql`
      UPDATE articles
      SET slug = ${slug}
      WHERE id = ${article.id}
    `;

    article.slug = slug;

    return NextResponse.json({ article });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
