import Link from 'next/link';
import Image from 'next/image';
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
      <div className="min-h-screen" style={{ background: '#020208', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50" style={{
          background: 'rgba(2, 2, 8, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
        }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/logo-icon.png" alt="America First" width={32} height={32} className="w-8 h-8" />
                <span className="text-xl font-bold">America First</span>
              </Link>
              <div className="flex gap-6 items-center">
                <Link href="/articles" className="text-blue-400">Articles</Link>
                <Link href="/about" className="hover:text-blue-400 transition-colors">About</Link>
                <Link href="/admin" className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all text-sm font-semibold border border-white/10">
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Article Content */}
        <article className="pt-32 px-[6vw] max-w-[900px] mx-auto pb-24">
          <Link href="/articles" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-blue-400 transition-colors mb-8">
            ← Back to Articles
          </Link>

          <div
            className="p-12 rounded-3xl mb-12"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-8 leading-tight">
              {article.title}
            </h1>

            <div className="flex items-center gap-4 pb-8 mb-8 border-b border-white/10">
              <span className="text-lg font-medium text-white/70">
                {article.author_name || 'America First Team'}
              </span>
              <span className="text-white/30">·</span>
              <time className="text-lg text-white/50">
                {new Date(article.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>

            <div
              className="prose prose-lg prose-invert max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-3xl prose-h3:mt-10 prose-h3:mb-4
                prose-p:text-white/80 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6
                prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-strong:font-semibold
                prose-ul:my-6 prose-ol:my-6
                prose-li:text-white/80 prose-li:text-lg prose-li:my-2
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500
                prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-white/70
                prose-img:rounded-2xl prose-img:shadow-2xl prose-img:my-8"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Back to Articles */}
          <div className="text-center">
            <Link
              href="/articles"
              className="inline-block px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all border border-white/10 font-semibold"
            >
              ← Back to All Articles
            </Link>
          </div>
        </article>

        {/* Footer */}
        <footer className="px-[6vw] py-12 max-w-[1400px] mx-auto flex justify-between items-center flex-wrap gap-6 text-white/20 text-sm border-t border-white/4">
          <span>© 2025 <strong className="text-white/50">America First</strong></span>
          <span>Truth · Data · Constitution</span>
        </footer>
      </div>
  );
}
