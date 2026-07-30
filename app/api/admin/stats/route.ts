import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const [articlesStats, adminsCount] = await Promise.all([
      sql`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'published') as published,
          COUNT(*) FILTER (WHERE status = 'draft') as drafts
        FROM articles
      `,
      sql`SELECT COUNT(*) as count FROM users`,
    ]);

    return NextResponse.json({
      totalArticles: parseInt(articlesStats.rows[0].total),
      publishedArticles: parseInt(articlesStats.rows[0].published),
      draftArticles: parseInt(articlesStats.rows[0].drafts),
      totalAdmins: parseInt(adminsCount.rows[0].count),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
