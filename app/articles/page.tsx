import { Metadata } from 'next';
import { ArticlesClient } from '@/components/ArticlesClient';
import { sql } from '@vercel/postgres';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://america1stusa.vercel.app/articles',
  },
  title: "Articles",
  description: "Read articles on civic education, American values, and principled decision-making. Stay informed on issues affecting our nation.",
  openGraph: {
    title: "Articles | America First",
    description: "Read articles on civic education, American values, and principled decision-making.",
    url: "https://america1stusa.vercel.app/articles",
    images: [
      {
        url: "https://america1stusa.vercel.app/logo-full-transparent.png",
        width: 1200,
        height: 630,
        alt: "America First Articles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Articles | America First",
    description: "Read articles on civic education, American values, and principled decision-making.",
    images: ["https://america1stusa.vercel.app/logo-full-transparent.png"],
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
  // In production or with valid DB connection, query directly for speed
  // In development without DB, fall back to API route
  if (process.env.POSTGRES_URL && !process.env.POSTGRES_URL.includes('your-postgres')) {
    try {
      const result = await sql`
        SELECT a.*, u.name as author_name
        FROM articles a
        LEFT JOIN users u ON a.author_id = u.id
        WHERE a.status = 'published'
        ORDER BY a.published_at DESC
      `;
      return result.rows as Article[];
    } catch (error) {
      console.error('Error fetching articles from database:', error);
      // Fall through to API route
    }
  }

  // Fallback: use API route (works in dev without DB)
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/articles?status=published`, {
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      return data.articles || [];
    }
  } catch (error) {
    console.error('Error fetching articles from API:', error);
  }

  return [];
}

export default async function ArticlesPage() {
  const articles = await getArticles();
  return <ArticlesClient articles={articles} />;
}
