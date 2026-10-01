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

interface QuickAction {
  name: string;
  href: string;
  icon: string;
  emoji: string;
}

const QUICK_ACTION_MAP: Record<string, QuickAction> = {
  'New Article': { name: 'New Article', href: '/admin/articles/new', icon: '✏️', emoji: '✏️' },
  'View Articles': { name: 'View Articles', href: '/admin/articles', icon: '📄', emoji: '📄' },
  'Manage Users': { name: 'Manage Users', href: '/admin/users', icon: '👥', emoji: '👥' },
  'Resources': { name: 'Resources', href: '/admin/resources', icon: '📚', emoji: '📚' },
  'Volunteers': { name: 'Volunteers', href: '/admin/volunteers', icon: '🤝', emoji: '🤝' },
};

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalAdmins: 0,
  });
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [quickActions, setQuickActions] = useState<QuickAction[]>([
    QUICK_ACTION_MAP['New Article'],
    QUICK_ACTION_MAP['View Articles'],
    QUICK_ACTION_MAP['Manage Users'],
  ]);

  useEffect(() => {
    if (session) {
      fetchStats();
      fetchPreferences();
    }
  }, [session]);

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

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/user/preferences');
      if (response.ok) {
        const data = await response.json();
        // Determine display name based on preferences
        if (data.display_name_type === 'email') {
          setDisplayName(data.email);
        } else if (data.display_name_type === 'name') {
          setDisplayName(data.name || data.email);
        } else if (data.display_name_type === 'custom') {
          setDisplayName(data.display_name || data.email);
        } else {
          setDisplayName(session?.user?.name || session?.user?.email || '');
        }

        // Load quick actions from preferences
        if (data.quick_actions && data.quick_actions.length > 0) {
          const actions = data.quick_actions
            .map((name: string) => QUICK_ACTION_MAP[name])
            .filter(Boolean);
          setQuickActions(actions);
        }
      } else {
        // Fallback to session data
        setDisplayName(session?.user?.name || session?.user?.email || '');
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      setDisplayName(session?.user?.name || session?.user?.email || '');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Welcome, {displayName || session?.user?.name || session?.user?.email}!
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
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="block p-4 border-2 border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-900 transition-colors text-center"
            >
              <div className="text-2xl mb-2">{action.emoji}</div>
              <div className="font-semibold text-gray-700">{action.name}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Dashboard Settings</h2>
        <p className="text-gray-600 mb-4">
          Customize your admin dashboard experience, change your display name, and reorder navigation items.
        </p>
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6m9.22-9.22l-4.24 4.24m-5.96 0L6.78 9.78M23 12h-6m-6 0H1m20.22 2.22l-4.24-4.24m-5.96 0L6.78 14.22"/>
          </svg>
          Open Settings
        </Link>
      </div>
    </div>
  );
}
