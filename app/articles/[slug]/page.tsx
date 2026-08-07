import { notFound } from 'next/navigation';
import { ArticleClient } from '@/components/ArticleClient';
import type { Metadata } from 'next';
import { getIdFromSlug } from '@/lib/slug';

interface Article {
  id: number;
  title: string;
  content: string;
  cover_image: string | null;
  published_at: string;
  author_name: string | null;
  slug: string;
}

// Revalidate once per day instead of every 60 seconds
export const revalidate = 86400; // 24 hours

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // Try to get article by slug first
    let response = await fetch(`${baseUrl}/api/articles?slug=${slug}`, {
      cache: 'force-cache', // Use static cache, rely on page-level revalidation
    });

    if (response.ok) {
      const data = await response.json();
      if (data.article) {
        return data.article;
      }
    }

    // Fallback: try to extract ID from slug for backward compatibility
    const id = getIdFromSlug(slug);
    if (id) {
      response = await fetch(`${baseUrl}/api/articles/${id}`, {
        cache: 'force-cache',
      });

      if (response.ok) {
        const data = await response.json();
        return data.article;
      }
    }

    // Final fallback: check if slug is actually just an ID (old URLs)
    if (/^\d+$/.test(slug)) {
      response = await fetch(`${baseUrl}/api/articles/${slug}`, {
        cache: 'force-cache',
      });

      if (response.ok) {
        const data = await response.json();
        return data.article;
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
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
  const baseUrl = 'https://america1stusa.vercel.app';
  const articleUrl = `${baseUrl}/articles/${article.slug || article.id}`;

  // Use cover image if available, otherwise use opengraph-image route
  const ogImageUrl = article.cover_image
    ? (article.cover_image.startsWith('http') ? article.cover_image : `${baseUrl}${article.cover_image}`)
    : `${articleUrl}/opengraph-image`;

  return {
    alternates: {
      canonical: articleUrl,
    },
    title: article.title,
    description: excerpt,
    authors: article.author_name ? [{ name: article.author_name }] : undefined,
    openGraph: {
      type: 'article',
      title: article.title,
      description: excerpt,
      url: articleUrl,
      siteName: 'America First',
      publishedTime: article.published_at,
      authors: article.author_name ? [article.author_name] : ['America First Team'],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: excerpt,
      images: [ogImageUrl],
    },
  };
}

export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/articles`, {
      cache: 'force-cache', // Static generation, no revalidation during build
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const articles = data.articles || [];

    return articles.map((article: { id: number; slug?: string }) => ({
      slug: article.slug || article.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
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
