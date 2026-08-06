import { Metadata } from 'next';
import { ArticlesClient } from '@/components/ArticlesClient';

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
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${baseUrl}/api/articles`, {
      cache: 'force-cache', // Use static cache, rely on page-level revalidation
      signal: controller.signal,
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('Articles API returned error:', response.status);
      throw new Error('Failed to fetch articles');
    }

    const data = await response.json();
    return data.articles || [];
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
