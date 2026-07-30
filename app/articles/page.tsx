import Link from 'next/link';
import Image from 'next/image';

interface Article {
  id: number;
  title: string;
  excerpt: string;
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-red-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="flex items-center gap-2 text-sm hover:underline mb-6 inline-flex">
            <Image
              src="/logo-icon.png"
              alt="America First"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold mb-4">Articles</h1>
          <p className="text-xl text-gray-200">
            Insights on civic education, constitutional principles, and American values
          </p>
        </div>
      </header>

      {/* Articles Grid */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {articles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No articles published yet.</p>
            <p className="text-gray-500 mt-2">Check back soon for new content!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <Link href={`/articles/${article.id}`} className="block p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3 hover:text-blue-900 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium">
                      {article.author_name || 'America First Team'}
                    </span>
                    <span className="mx-2">•</span>
                    <time>
                      {new Date(article.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                  <div className="mt-4">
                    <span className="text-blue-900 font-semibold hover:underline">
                      Read more →
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
