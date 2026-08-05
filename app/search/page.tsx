'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

interface SearchResult {
  id: string | number;
  title: string;
  excerpt: string;
  url: string;
  type: 'article' | 'resource' | 'volunteer' | 'page';
  date?: string;
}

export default function SearchPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q');

  const [query, setQuery] = useState(queryParam || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (queryParam) {
      performSearch(queryParam);
    }
  }, [queryParam]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Search failed');
      }

      setResults(data.results || []);
    } catch (err) {
      console.error('Search failed:', err);
      setError(err instanceof Error ? err.message : 'Search failed. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(query)}`);
      performSearch(query);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'article': return 'Article';
      case 'resource': return 'Resource';
      case 'volunteer': return 'Volunteer';
      case 'page': return 'Page';
      default: return 'Result';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return '#3b82f6';
      case 'resource': return '#8b5cf6';
      case 'volunteer': return '#ef4444';
      case 'page': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: isDark ? '#000a2e' : '#f8f9fa',
        color: isDark ? '#fff' : '#000',
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <Navigation />

      {/* Header */}
      <header className="pt-32 pb-16 px-[6vw] max-w-[1400px] mx-auto">
        <p
          className="text-xs tracking-[0.4em] uppercase font-medium mb-4"
          style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}
        >
          Search
        </p>
        <h1
          className="text-6xl md:text-8xl font-extrabold leading-[1.0] tracking-tight mb-8"
          style={{ textShadow: isDark ? '0 0 80px rgba(0, 0, 0, 0.8)' : '0 0 80px rgba(255, 255, 255, 0.8)' }}
        >
          <span style={{ color: isDark ? '#fff' : '#000' }}>Find What You</span>
          <br />
          <span style={{ color: '#3b82f6' }}>Need</span>
        </h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-[700px]">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, resources, volunteer opportunities..."
              className="w-full px-6 py-4 rounded-xl text-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
                color: isDark ? '#fff' : '#000',
              }}
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </header>

      {/* Results */}
      <main className="px-[6vw] max-w-[1400px] mx-auto pb-24">
        {loading && (
          <div className="text-center py-12">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
              style={{ color: '#3b82f6' }}
            />
            <p className="mt-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
              Searching...
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-4"
              style={{ color: '#ef4444' }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h2 className="text-2xl font-bold mb-2" style={{ color: isDark ? '#fff' : '#000' }}>
              Search Error
            </h2>
            <p className="mb-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
              {error}
            </p>
            <button
              onClick={() => performSearch(query)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && searched && results.length === 0 && (
          <div className="text-center py-12">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-4"
              style={{ color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <h2 className="text-2xl font-bold mb-2" style={{ color: isDark ? '#fff' : '#000' }}>
              No results found
            </h2>
            <p style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
              Try different keywords or check your spelling
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <p className="mb-6" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
              Found <strong style={{ color: isDark ? '#fff' : '#000' }}>{results.length}</strong> result{results.length !== 1 ? 's' : ''} for "{queryParam}"
            </p>

            <div className="space-y-6">
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.url}
                  className="block rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
                  style={{
                    background: isDark
                      ? 'linear-gradient(135deg, rgba(0, 10, 35, 0.85) 0%, rgba(0, 15, 50, 0.9) 100%)'
                      : 'rgba(255, 255, 255, 0.9)',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: isDark
                      ? '0 4px 16px rgba(0, 0, 0, 0.4)'
                      : '0 4px 16px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {/* Type Badge */}
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
                    style={{
                      background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                      color: getTypeColor(result.type),
                    }}
                  >
                    {getTypeLabel(result.type)}
                  </span>

                  {/* Title */}
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: isDark ? '#fff' : '#000' }}
                  >
                    {result.title}
                  </h3>

                  {/* Excerpt */}
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: isDark ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.7)' }}
                  >
                    {result.excerpt}
                  </p>

                  {/* URL */}
                  <p
                    className="text-sm mt-3"
                    style={{ color: '#3b82f6' }}
                  >
                    {result.url}
                  </p>
                </Link>
              ))}
            </div>
          </>
        )}

        {!loading && !searched && (
          <div className="text-center py-12">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-4"
              style={{ color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <h2 className="text-2xl font-bold mb-2" style={{ color: isDark ? '#fff' : '#000' }}>
              Start Searching
            </h2>
            <p style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
              Enter a keyword to search across articles, resources, and volunteer opportunities
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
