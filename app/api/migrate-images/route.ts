import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes for migration

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only god_mode can run migrations
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userResult = await sql`
      SELECT role FROM users WHERE email = ${session.user.email}
    `;

    if (!userResult.rows[0] || userResult.rows[0].role !== 'god_mode') {
      return NextResponse.json({ error: 'Only god_mode can run migrations' }, { status: 403 });
    }

    // Get all articles with base64 cover images
    const articles = await sql`
      SELECT id, title, cover_image
      FROM articles
      WHERE cover_image IS NOT NULL
        AND cover_image LIKE 'data:image%'
    `;

    const results = {
      total: articles.rows.length,
      migrated: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const article of articles.rows) {
      try {
        const base64Data = article.cover_image as string;

        // Extract mime type and base64 data
        const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/);
        if (!matches) {
          results.failed++;
          results.errors.push(`Article ${article.id}: Invalid base64 format`);
          continue;
        }

        const mimeType = matches[1];
        const base64Content = matches[2];

        // Convert base64 to buffer
        const buffer = Buffer.from(base64Content, 'base64');

        // Determine file extension
        const extension = mimeType.split('/')[1] || 'jpg';

        // Generate filename
        const filename = `articles/migrated-${article.id}-${Date.now()}.${extension}`;

        // Upload to Vercel Blob
        const blob = await put(filename, buffer, {
          access: 'public',
          contentType: mimeType,
        });

        // Update article with new blob URL
        await sql`
          UPDATE articles
          SET cover_image = ${blob.url}
          WHERE id = ${article.id}
        `;

        results.migrated++;
        console.log(`Migrated article ${article.id}: ${article.title}`);
      } catch (error) {
        results.failed++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.errors.push(`Article ${article.id}: ${errorMessage}`);
        console.error(`Failed to migrate article ${article.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
