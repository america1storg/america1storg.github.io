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
  slug?: string;
}

export function ArticleClient({ article }: { article: Article }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen" style={{ background: isDark ? '#000a2e' : '#f8f9fa', color: isDark ? '#fff' : '#000', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
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

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 leading-snug" style={{ color: isDark ? '#fff' : '#000' }}>
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
              url={`https://america1stusa.vercel.app/articles/${article.slug || article.id}`}
              title={article.title}
              description={article.content.replace(/<[^>]*>/g, '').substring(0, 160)}
            />
          </div>

          <div
            className="prose prose-lg max-w-none article-content"
            style={{
              color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
              fontSize: '1.125rem',
              lineHeight: '1.75',
            }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          <style jsx global>{`
            .article-content p {
              margin-bottom: 1.5em;
              line-height: 1.75;
            }
            .article-content p:last-child {
              margin-bottom: 0;
            }
            .article-content h2 {
              font-size: 1.75rem;
              font-weight: 700;
              margin-top: 2em;
              margin-bottom: 1em;
              line-height: 1.3;
            }
            .article-content h3 {
              font-size: 1.5rem;
              font-weight: 600;
              margin-top: 1.75em;
              margin-bottom: 0.75em;
              line-height: 1.4;
            }
            .article-content ul, .article-content ol {
              margin-bottom: 1.5em;
              padding-left: 1.5em;
            }
            .article-content li {
              margin-bottom: 0.5em;
            }
            .article-content blockquote {
              border-left: 4px solid rgba(59, 130, 246, 0.5);
              padding-left: 1.5em;
              margin: 1.5em 0;
              font-style: italic;
              opacity: 0.9;
            }
            .article-content a {
              color: #3b82f6;
              text-decoration: underline;
            }
            .article-content a:hover {
              color: #2563eb;
            }
            .article-content code {
              background: rgba(0, 0, 0, 0.1);
              padding: 0.2em 0.4em;
              border-radius: 0.25em;
              font-size: 0.9em;
            }
            .article-content pre {
              background: rgba(0, 0, 0, 0.05);
              padding: 1em;
              border-radius: 0.5em;
              overflow-x: auto;
              margin: 1.5em 0;
            }
            .article-content img {
              max-width: 100%;
              height: auto;
              border-radius: 0.5em;
              margin: 1.5em 0;
            }
          `}</style>
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
