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

        {/* Header */}
        <header className="pt-32 pb-16 px-[6vw] max-w-[1400px] mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase text-white/25 font-medium mb-4">Knowledge Center</p>
          <h1 className="text-6xl md:text-8xl font-extrabold leading-[1.0] tracking-tight mb-6" style={{ textShadow: '0 0 80px rgba(0, 0, 0, 0.8)' }}>
            <span className="text-white">Articles</span>
          </h1>
          <p className="text-lg md:text-2xl text-white/70 max-w-[650px]">
            Insights on <strong className="text-white font-semibold">civic education</strong>,{' '}
            <strong className="text-white font-semibold">constitutional principles</strong>, and{' '}
            <strong className="text-white font-semibold">American values</strong>.
          </p>
        </header>

        {/* Articles Grid */}
        <main className="px-[6vw] max-w-[1400px] mx-auto pb-24">
          {articles.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-2xl text-white/40 mb-4">No articles published yet.</p>
              <p className="text-white/30">Check back soon for new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="group"
                >
                  <article
                    className="h-full p-8 rounded-3xl transition-all hover:-translate-y-2"
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                  >
                    <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-lg text-white/60 mb-6 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center text-sm text-white/40 gap-3">
                      <span className="font-medium text-white/60">
                        {article.author_name || 'America First Team'}
                      </span>
                      <span>·</span>
                      <time>
                        {new Date(article.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                    <div className="mt-6">
                      <span className="text-blue-400 font-semibold group-hover:underline">
                        Read more →
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="px-[6vw] py-12 max-w-[1400px] mx-auto flex justify-between items-center flex-wrap gap-6 text-white/20 text-sm border-t border-white/4">
          <span>© 2025 <strong className="text-white/50">America First</strong></span>
          <span>Truth · Data · Constitution</span>
        </footer>
      </div>
  );
}
