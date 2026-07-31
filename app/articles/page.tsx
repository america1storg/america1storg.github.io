import { ArticlesClient } from '@/components/ArticlesClient';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  cover_image: string | null;
  published_at: string;
  author_name: string | null;
}

async function getArticles(): Promise<Article[]> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/articles`, {
      cache: 'no-store',
    });
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
