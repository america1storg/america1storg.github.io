import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// Public endpoint to check if an article is actually visible on the public site
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params;

    // Check if article is published and publicly accessible
    const result = await sql`
      SELECT id, slug, status, published_at
      FROM articles
      WHERE id = ${articleId} AND status = 'published'
    `;

    const isPublished = result.rows.length > 0;

    return NextResponse.json({
      isPublished,
      article: isPublished ? result.rows[0] : null,
    });
  } catch (error) {
    console.error('Error verifying publication:', error);
    return NextResponse.json(
      { error: 'Failed to verify publication' },
      { status: 500 }
    );
  }
}
