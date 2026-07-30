'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalAdmins: number;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalAdmins: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Welcome, {session?.user?.name || session?.user?.email}!
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">
            Total Articles
          </div>
          <div className="text-3xl font-bold text-blue-900">
            {loading ? '...' : stats.totalArticles}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">
            Published
          </div>
          <div className="text-3xl font-bold text-green-600">
            {loading ? '...' : stats.publishedArticles}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Drafts</div>
          <div className="text-3xl font-bold text-yellow-600">
            {loading ? '...' : stats.draftArticles}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">
            Admin Users
          </div>
          <div className="text-3xl font-bold text-purple-600">
            {loading ? '...' : stats.totalAdmins}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/articles/new"
            className="block p-4 border-2 border-blue-900 rounded-lg hover:bg-blue-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">✏️</div>
            <div className="font-semibold text-blue-900">New Article</div>
          </Link>

          <Link
            href="/admin/articles"
            className="block p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">📄</div>
            <div className="font-semibold text-gray-700">View Articles</div>
          </Link>

          {session?.user?.isSuperAdmin && (
            <Link
              href="/admin/users"
              className="block p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <div className="text-2xl mb-2">👥</div>
              <div className="font-semibold text-gray-700">Manage Users</div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
