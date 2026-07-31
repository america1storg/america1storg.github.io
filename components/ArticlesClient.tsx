'use client';

import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  published_at: string;
  author_name: string | null;
}

export function ArticlesClient({ articles }: { articles: Article[] }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen" style={{ background: isDark ? '#020208' : '#f8f9fa', color: isDark ? '#fff' : '#000', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      {/* Navigation */}
      <Navigation />

      {/* Header */}
      <header className="pt-32 pb-16 px-[6vw] max-w-[1400px] mx-auto">
        <p className="text-xs tracking-[0.4em] uppercase font-medium mb-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.4)' }}>Knowledge Center</p>
        <h1 className="text-6xl md:text-8xl font-extrabold leading-[1.0] tracking-tight mb-6" style={{ textShadow: isDark ? '0 0 80px rgba(0, 0, 0, 0.8)' : '0 0 80px rgba(255, 255, 255, 0.8)', color: isDark ? '#fff' : '#000' }}>
          <span>Articles</span>
        </h1>
        <p className="text-lg md:text-2xl max-w-[650px]" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
          Insights on <strong style={{ color: isDark ? '#fff' : '#000' }} className="font-semibold">civic education</strong>,{' '}
          <strong style={{ color: isDark ? '#fff' : '#000' }} className="font-semibold">constitutional principles</strong>, and{' '}
          <strong style={{ color: isDark ? '#fff' : '#000' }} className="font-semibold">American values</strong>.
        </p>
      </header>

      {/* Articles Grid */}
      <main className="px-[6vw] max-w-[1400px] mx-auto pb-24">
        {articles.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-2xl mb-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)' }}>No articles published yet.</p>
            <p style={{ color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' }}>Check back soon for new content!</p>
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
                    background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                    backdropFilter: 'blur(12px)',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <h2 className="text-3xl font-bold mb-4 group-hover:text-blue-400 transition-colors" style={{ color: isDark ? '#fff' : '#000' }}>
                    {article.title}
                  </h2>
                  <p className="text-lg mb-6 leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}>
                    {article.excerpt}
                  </p>
                  <div className="flex items-center text-sm gap-3" style={{ color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.5)' }}>
                    <span className="font-medium" style={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.7)' }}>
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
      <Footer />
    </div>
  );
}
