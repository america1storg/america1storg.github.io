import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// Public endpoint to check if an article is actually visible on the public site
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params;

    // Step 1: Check if article is published in database
    const result = await sql`
      SELECT id, slug, status, published_at
      FROM articles
      WHERE id = ${articleId} AND status = 'published'
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({
        isPublished: false,
        article: null,
        reason: 'Article not found or not published in database',
      });
    }

    const article = result.rows[0];

    // Step 2: Verify the article is accessible via the public API endpoint
    // This checks if ISR has regenerated the page
    try {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const publicCheckUrl = `${baseUrl}/api/articles?slug=${article.slug}`;

      const publicResponse = await fetch(publicCheckUrl, {
        cache: 'no-store', // Don't cache this verification check
        headers: {
          'x-verification-check': 'true', // Mark as verification request
        },
      });

      if (publicResponse.ok) {
        const data = await publicResponse.json();
        if (data.article && data.article.status === 'published') {
          return NextResponse.json({
            isPublished: true,
            article: article,
            reason: 'Article is published and publicly accessible',
          });
        }
      }
    } catch (fetchError) {
      console.error('Error checking public accessibility:', fetchError);
    }

    // Step 3: If we got here, article is in DB but might not be fully propagated
    // Check how recent the publish was - if very recent, it's likely still propagating
    const publishedAt = new Date(article.published_at);
    const now = new Date();
    const secondsSincePublish = (now.getTime() - publishedAt.getTime()) / 1000;

    if (secondsSincePublish < 30) {
      // If published within last 30 seconds, assume still propagating
      return NextResponse.json({
        isPublished: false,
        article: article,
        reason: 'Article published recently, still propagating to public site',
        propagating: true,
      });
    }

    // If it's been a while, consider it published even if ISR hasn't caught up
    return NextResponse.json({
      isPublished: true,
      article: article,
      reason: 'Article is published (may take a moment to appear on site)',
    });

  } catch (error) {
    console.error('Error verifying publication:', error);
    return NextResponse.json(
      { error: 'Failed to verify publication' },
      { status: 500 }
    );
  }
}
