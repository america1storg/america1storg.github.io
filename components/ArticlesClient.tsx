'use client';

import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { ShareButton } from './ShareButton';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  cover_image: string | null;
  published_at: string;
  author_name: string | null;
  slug?: string;
}

export function ArticlesClient({ articles }: { articles: Article[] }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen" style={{ background: isDark ? '#000a2e' : '#f8f9fa', color: isDark ? '#fff' : '#000', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
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

      {/* Disclaimer */}
      <div className="px-[6vw] max-w-[1400px] mx-auto pb-8">
        <div
          className="p-4 rounded-xl text-center text-xs"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
            color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
          }}
        >
          Content reflects the views of America First on how current events align with America-First principles.
          It is for educational and advocacy purposes and does not constitute legal or tax advice.
        </div>
      </div>

      {/* Articles Grid */}
      <main className="px-[6vw] max-w-[1400px] mx-auto pb-24">
        {articles.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-2xl mb-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)' }}>No articles published yet.</p>
            <p style={{ color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' }}>Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug || article.id}`}
                className="group"
              >
                <article
                  className="h-full rounded-3xl overflow-hidden transition-all hover:-translate-y-2"
                  style={{
                    background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                    backdropFilter: 'blur(12px)',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
                  }}
                >
                  {/* Cover Image */}
                  {article.cover_image ? (
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={article.cover_image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-white text-gray-900 shadow-lg uppercase">
                          Article
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="h-48 w-full flex items-center justify-center"
                      style={{
                        background: isDark
                          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%)'
                          : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)'
                      }}
                    >
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-white text-gray-900 shadow-lg uppercase">
                          Article
                        </span>
                      </div>
                      <span className="text-6xl opacity-30">📄</span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors line-clamp-2" style={{ color: isDark ? '#fff' : '#000' }}>
                      {article.title}
                    </h2>
                    <p className="text-base mb-4 leading-relaxed line-clamp-3" style={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}>
                      {article.excerpt}
                    </p>
                    <div className="flex items-center text-sm gap-3 mb-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.5)' }}>
                      <span className="font-medium" style={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.7)' }}>
                        {article.author_name || 'America First Team'}
                      </span>
                      <span>·</span>
                      <time>
                        {new Date(article.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                    <div className="flex items-center justify-between">
                      <div onClick={(e) => e.preventDefault()}>
                        <ShareButton
                          url={`https://america1stusa.vercel.app/articles/${article.slug || article.id}`}
                          title={article.title}
                          description={article.excerpt}
                        />
                      </div>
                      <span className="text-blue-400 font-semibold group-hover:underline uppercase text-sm tracking-wide">
                        Read more →
                      </span>
                    </div>
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
