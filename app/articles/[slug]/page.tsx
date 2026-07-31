import { notFound } from 'next/navigation';
import { ArticleClient } from '@/components/ArticleClient';
import type { Metadata } from 'next';

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
      next: { revalidate: 60 }, // Cache for 60 seconds
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

export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/articles`, {
      next: { revalidate: 3600 }, // Revalidate article list every hour
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const articles = data.articles || [];

    return articles.map((article: { id: number }) => ({
      slug: article.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const excerpt = article.content.replace(/<[^>]*>/g, '').substring(0, 160);
  const baseUrl = process.env.NEXTAUTH_URL || 'https://america1stusa.vercel.app';

  return {
    title: `${article.title} | America First`,
    description: excerpt,
    openGraph: {
      title: article.title,
      description: excerpt,
      url: `${baseUrl}/articles/${article.id}`,
      siteName: 'America First',
      images: article.cover_image
        ? [
            {
              url: article.cover_image,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ]
        : [],
      type: 'article',
      publishedTime: article.published_at,
      authors: [article.author_name || 'America First Team'],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: excerpt,
      images: article.cover_image ? [article.cover_image] : [],
    },
  };
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
