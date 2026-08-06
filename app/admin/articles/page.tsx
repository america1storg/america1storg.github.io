'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ToastProvider';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  cover_image: string | null;
  status: 'draft' | 'submitted' | 'needs_re_edit' | 'approved' | 'published';
  created_at: string;
  published_at: string | null;
  author_name: string | null;
  author_id: number;
}

export default function ArticlesList() {
  const router = useRouter();
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'draft' | 'submitted' | 'needs_re_edit' | 'approved' | 'published'>('all');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchArticles();
        showToast('Article deleted successfully!', 'success');
      } else {
        showToast('Failed to delete article', 'error');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      showToast('Failed to delete article', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      needs_re_edit: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      published: 'bg-purple-100 text-purple-800',
    };
    const labels = {
      draft: 'Draft',
      submitted: 'Pending Review',
      needs_re_edit: 'Needs Re-edit',
      approved: 'Approved',
      published: 'Published',
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${badges[status as keyof typeof badges] || badges.draft}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const filteredArticles = articles.filter((article) => {
    if (filter === 'all') return true;
    return article.status === filter;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          + New Article
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-blue-900 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          All ({articles.length})
        </button>
        <button
          onClick={() => setFilter('draft')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'draft'
              ? 'bg-blue-900 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Drafts ({articles.filter((a) => a.status === 'draft').length})
        </button>
        <button
          onClick={() => setFilter('submitted')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'submitted'
              ? 'bg-blue-900 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Pending Review ({articles.filter((a) => a.status === 'submitted').length})
        </button>
        <button
          onClick={() => setFilter('needs_re_edit')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'needs_re_edit'
              ? 'bg-blue-900 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Needs Re-edit ({articles.filter((a) => a.status === 'needs_re_edit').length})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'approved'
              ? 'bg-blue-900 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Approved ({articles.filter((a) => a.status === 'approved').length})
        </button>
        <button
          onClick={() => setFilter('published')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'published'
              ? 'bg-blue-900 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Published ({articles.filter((a) => a.status === 'published').length})
        </button>
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-600">Loading articles...</div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            No articles found.{' '}
            <Link href="/admin/articles/new" className="text-blue-600 hover:underline">
              Create your first article
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                {/* Cover Image */}
                {article.cover_image ? (
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={article.cover_image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 text-xs font-bold rounded bg-white text-gray-900 shadow-md uppercase">
                        Article
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 text-xs font-bold rounded bg-white text-gray-900 shadow-md uppercase">
                        Article
                      </span>
                    </div>
                    <span className="text-white text-6xl">📄</span>
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1">
                      {article.title}
                    </h3>
                    {getStatusBadge(article.status)}
                  </div>

                  {article.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                  )}

                  <div className="text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">By {article.author_name || 'Unknown'}</span>
                      <span className="text-xs text-gray-400">(Public: America First Team)</span>
                    </div>
                    <div>
                      {article.status === 'published' && article.published_at
                        ? `Published ${new Date(article.published_at).toLocaleDateString()}`
                        : `Created ${new Date(article.created_at).toLocaleDateString()}`}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {/* Soldiers can only edit their own drafts or needs_re_edit articles */}
                    {/* God/King/Captain can edit any article */}
                    {((['god_mode', 'king', 'captain'].includes(session?.user?.role || '')) ||
                      (session?.user?.role === 'soldier' &&
                       article.author_id === session?.user?.id &&
                       ['draft', 'needs_re_edit'].includes(article.status))) && (
                      <button
                        onClick={() => router.push(`/admin/articles/edit/${article.id}`)}
                        className="flex-1 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded transition-colors border border-blue-200"
                      >
                        {['draft', 'needs_re_edit'].includes(article.status) ? 'Edit' : 'View/Edit'}
                      </button>
                    )}

                    {/* Only God/King/Captain can delete articles */}
                    {['god_mode', 'king', 'captain'].includes(session?.user?.role || '') && (
                      <button
                        onClick={() => handleDelete(article.id, article.title)}
                        className="flex-1 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded transition-colors border border-red-200"
                      >
                        Delete
                      </button>
                    )}

                    {/* Soldiers can view articles but show read-only button */}
                    {session?.user?.role === 'soldier' &&
                     (article.author_id !== session?.user?.id ||
                      !['draft', 'needs_re_edit'].includes(article.status)) && (
                      <button
                        onClick={() => router.push(`/admin/articles/edit/${article.id}`)}
                        className="flex-1 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded transition-colors border border-gray-200"
                      >
                        View
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
