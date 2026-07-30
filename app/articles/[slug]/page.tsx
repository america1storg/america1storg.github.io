import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Article {
  id: number;
  title: string;
  content: string;
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-red-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/articles" className="text-sm hover:underline mb-4 inline-block">
            ← Back to Articles
          </Link>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {article.title}
          </h1>

          <div className="flex items-center text-gray-600 mb-8 pb-8 border-b">
            <span className="font-medium text-lg">
              {article.author_name || 'America First Team'}
            </span>
            <span className="mx-3">•</span>
            <time className="text-lg">
              {new Date(article.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>

          <div
            className="prose prose-lg max-w-none
              prose-headings:text-gray-900
              prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-2xl prose-h3:font-bold prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-blue-600 prose-a:underline
              prose-strong:text-gray-900
              prose-ul:my-4 prose-ol:my-4
              prose-li:text-gray-700
              prose-blockquote:border-l-4 prose-blockquote:border-blue-900
              prose-blockquote:pl-4 prose-blockquote:italic
              prose-img:rounded-lg prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Back to Articles */}
        <div className="mt-8 text-center">
          <Link
            href="/articles"
            className="inline-block px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            ← Back to All Articles
          </Link>
        </div>
      </article>
    </div>
  );
}
