import { notFound } from 'next/navigation';
import { ArticleClient } from '@/components/ArticleClient';

interface Article {
  id: number;
  title: string;
  content: string;
  cover_image: string | null;
  published_at: string;
  author_name: string | null;
}

async function getArticle(id: string): Promise<Article | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/articles/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.article;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return <ArticleClient article={article} />;
}
