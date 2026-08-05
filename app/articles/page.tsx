import { ArticlesClient } from '@/components/ArticlesClient';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  cover_image: string | null;
  published_at: string;
  author_name: string | null;
}

// Revalidate once per day instead of every 60 seconds
export const revalidate = 86400; // 24 hours

async function getArticles(): Promise<Article[]> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/articles`, {
      cache: 'force-cache', // Use static cache, rely on page-level revalidation
    });

    if (!response.ok) {
      throw new Error('Failed to fetch articles');
    }

    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles();
  return <ArticlesClient articles={articles} />;
}
