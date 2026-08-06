import { Metadata } from 'next';
import { ArticlesClient } from '@/components/ArticlesClient';
import { sql } from '@vercel/postgres';

export const metadata: Metadata = {
  title: "Articles",
  description: "Read articles on civic education, American values, and principled decision-making. Stay informed on issues affecting our nation.",
  openGraph: {
    title: "Articles | America First",
    description: "Read articles on civic education, American values, and principled decision-making.",
  },
};

interface Article {
  id: number;
  title: string;
  excerpt: string;
  cover_image: string | null;
  published_at: string;
  author_name: string | null;
}

// Revalidate every 60 seconds for fresh content
export const revalidate = 60;

async function getArticles(): Promise<Article[]> {
  try {
    // Query database directly instead of making API call
    // This is much faster during server-side rendering
    const result = await sql`
      SELECT a.*, u.name as author_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.status = 'published'
      ORDER BY a.published_at DESC
    `;

    return result.rows as Article[];
  } catch (error) {
    console.error('Error fetching articles:', error);
    // Return empty array on error so page still renders
    return [];
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles();
  return <ArticlesClient articles={articles} />;
}
