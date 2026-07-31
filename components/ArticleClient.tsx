'use client';

import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { ShareButton } from './ShareButton';

interface Article {
  id: number;
  title: string;
  content: string;
  cover_image: string | null;
  published_at: string;
  author_name: string | null;
}

export function ArticleClient({ article }: { article: Article }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen" style={{ background: isDark ? '#020208' : '#f8f9fa', color: isDark ? '#fff' : '#000', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      {/* Navigation */}
      <Navigation />

      {/* Article Content */}
      <article className="pt-32 px-[6vw] max-w-[900px] mx-auto pb-24">
        <Link href="/articles" className="inline-flex items-center gap-2 text-sm hover:text-blue-400 transition-colors mb-8" style={{ color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.5)' }}>
          ← Back to Articles
        </Link>

        <div
          className="p-12 rounded-3xl mb-12"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(12px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          {/* Cover Image */}
          {article.cover_image && (
            <div className="mb-8 -mt-12 -mx-12 rounded-t-3xl overflow-hidden">
              <img
                src={article.cover_image}
                alt={article.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          <h1 className="text-5xl md:text-6xl font-extrabold mb-8 leading-tight" style={{ color: isDark ? '#fff' : '#000' }}>
            {article.title}
          </h1>

          <div className="flex items-center justify-between pb-8 mb-8 border-b" style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}>
            <div className="flex items-center gap-4">
              <span className="text-lg font-medium" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
                {article.author_name || 'America First Team'}
              </span>
              <span style={{ color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' }}>·</span>
              <time className="text-lg" style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>
                {new Date(article.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            <ShareButton
              url={`https://america1stusa.vercel.app/articles/${article.id}`}
              title={article.title}
              description={article.content.replace(/<[^>]*>/g, '').substring(0, 160)}
            />
          </div>

          <div
            className="prose prose-lg max-w-none"
            style={{
              color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
            }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Back to Articles */}
        <div className="text-center">
          <Link
            href="/articles"
            className="inline-block px-8 py-4 backdrop-blur-sm rounded-lg hover:scale-105 transition-all font-semibold"
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              color: isDark ? '#fff' : '#000',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
            }}
          >
            ← Back to All Articles
          </Link>
        </div>
      </article>

      {/* Footer */}
      <Footer />
    </div>
  );
}
