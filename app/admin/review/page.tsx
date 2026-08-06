'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ToastProvider';
import PublishingModal from '@/components/PublishingModal';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  cover_image: string | null;
  status: 'draft' | 'submitted' | 'needs_re_edit' | 'approved' | 'published';
  created_at: string;
  submitted_at: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  author_name: string | null;
}

export default function ReviewDashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'submitted' | 'needs_re_edit' | 'approved' | 'all'>('submitted');
  const [publishingArticleId, setPublishingArticleId] = useState<number | null>(null);
  const [rejectingArticleId, setRejectingArticleId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

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
      showToast('Failed to fetch articles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`/api/articles/${id}/approve`, {
        method: 'POST',
      });

      if (response.ok) {
        showToast('Article approved successfully', 'success');
        fetchArticles();
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to approve article', 'error');
      }
    } catch (error) {
      console.error('Error approving article:', error);
      showToast('Failed to approve article', 'error');
    }
  };

  const handleReject = async (id: number) => {
    if (!rejectionReason.trim()) {
      showToast('Please provide a reason for rejection', 'warning');
      return;
    }

    try {
      const response = await fetch(`/api/articles/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      if (response.ok) {
        showToast('Article marked as needs re-edit', 'success');
        setRejectingArticleId(null);
        setRejectionReason('');
        fetchArticles();
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to reject article', 'error');
      }
    } catch (error) {
      console.error('Error rejecting article:', error);
      showToast('Failed to reject article', 'error');
    }
  };

  const handlePublish = (id: number) => {
    setPublishingArticleId(id);
  };

  const handlePublishComplete = (success: boolean, message: string) => {
    setPublishingArticleId(null);
    if (success) {
      showToast(message, 'success');
      fetchArticles();
    } else {
      showToast(message, 'error');
    }
  };

  const filteredArticles = articles.filter((article) => {
    if (filter === 'all') {
      return ['submitted', 'needs_re_edit', 'approved'].includes(article.status);
    }
    return article.status === filter;
  });

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
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${badges[status as keyof typeof badges] || badges.draft}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  // Check if user has review permissions
  const canReview = session?.user?.role && ['god_mode', 'king', 'captain'].includes(session.user.role);

  if (!canReview) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">You do not have permission to access the review dashboard.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Article Review Dashboard</h1>
        <p className="text-gray-600 mt-2">Review and manage article submissions</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
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
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-blue-900 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          All Pending ({filteredArticles.length})
        </button>
      </div>

      {/* Articles Grid */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-600">Loading articles...</div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            No articles found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 p-6">
            {filteredArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex gap-6">
                  {/* Cover Image Thumbnail */}
                  {article.cover_image ? (
                    <img
                      src={article.cover_image}
                      alt={article.title}
                      className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-4xl">📄</span>
                    </div>
                  )}

                  {/* Article Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{article.title}</h3>
                      {getStatusBadge(article.status)}
                    </div>

                    {article.excerpt && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                    )}

                    <div className="text-xs text-gray-500 mb-4 space-y-1">
                      <div>By {article.author_name || 'Unknown'}</div>
                      {article.submitted_at && (
                        <div>Submitted: {new Date(article.submitted_at).toLocaleString()}</div>
                      )}
                      {article.rejection_reason && (
                        <div className="text-red-600 font-semibold mt-2">
                          Rejection reason: {article.rejection_reason}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => router.push(`/admin/articles/edit/${article.id}`)}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded transition-colors border border-gray-300"
                      >
                        View/Edit
                      </button>

                      {article.status === 'submitted' && (
                        <>
                          <button
                            onClick={() => handleApprove(article.id)}
                            className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => setRejectingArticleId(article.id)}
                            className="px-4 py-2 text-sm font-semibold text-white bg-yellow-600 hover:bg-yellow-700 rounded transition-colors"
                          >
                            ↻ Request Re-edit
                          </button>
                        </>
                      )}

                      {article.status === 'approved' && (
                        <button
                          onClick={() => handlePublish(article.id)}
                          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                        >
                          🚀 Publish
                        </button>
                      )}

                      {article.status === 'needs_re_edit' && (
                        <button
                          onClick={() => handleApprove(article.id)}
                          className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
                        >
                          ✓ Approve Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {rejectingArticleId && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl max-w-lg w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Request Re-edit</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for requesting revisions. This will help the author understand what needs to be changed.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-black bg-white placeholder-gray-400 mb-4"
              rows={4}
              placeholder="Explain what needs to be revised..."
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setRejectingArticleId(null);
                  setRejectionReason('');
                }}
                className="px-6 py-2 border-2 border-gray-400 rounded-lg hover:bg-gray-100 font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(rejectingArticleId)}
                className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-semibold"
              >
                Request Re-edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publishing Modal */}
      {publishingArticleId && (
        <PublishingModal
          articleId={publishingArticleId}
          onComplete={handlePublishComplete}
        />
      )}
    </div>
  );
}
