import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateSlug } from '@/lib/slug';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    console.log('Adding slug column to articles table...');

    // Add slug column if it doesn't exist
    await sql`
      ALTER TABLE articles
      ADD COLUMN IF NOT EXISTS slug VARCHAR(200) UNIQUE
    `;

    console.log('Generating slugs for existing articles...');

    // Get all articles without slugs
    const articles = await sql`
      SELECT id, title FROM articles WHERE slug IS NULL
    `;

    // Generate and update slugs
    for (const article of articles.rows) {
      const slug = generateSlug(article.title, article.id);
      await sql`
        UPDATE articles
        SET slug = ${slug}
        WHERE id = ${article.id}
      `;
      console.log(`Generated slug for article ${article.id}: ${slug}`);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully added slug column and generated slugs for ${articles.rows.length} articles`,
    });
  } catch (error) {
    console.error('Error migrating slugs:', error);
    return NextResponse.json(
      { error: 'Failed to migrate', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
