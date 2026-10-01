'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ToastProvider } from '@/components/ToastProvider';

// Reorderable navigation items (Dashboard is always fixed at top)
const REORDERABLE_NAVIGATION = [
  { name: 'Articles', href: '/admin/articles' },
  { name: 'New Article', href: '/admin/articles/new' },
  { name: 'Resources', href: '/admin/resources' },
  { name: 'Volunteers', href: '/admin/volunteers' },
  { name: 'Review Queue', href: '/admin/review' },
  { name: 'Manage Users', href: '/admin/users' },
  { name: 'Feature Flags', href: '/admin/flags' },
  { name: 'Settings', href: '/admin/settings' },
];

// Dashboard is always first
const FIXED_DASHBOARD = { name: 'Dashboard', href: '/admin' };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [reorderableItems, setReorderableItems] = useState(REORDERABLE_NAVIGATION);

  const canReview = session?.user?.role && ['god_mode', 'king', 'captain'].includes(session.user.role);
  const canManageUsers = session?.user?.role && ['god_mode', 'king'].includes(session.user.role);

  useEffect(() => {
    if (session) {
      fetchNavigationOrder();
    }
  }, [session]);

  const fetchNavigationOrder = async () => {
    try {
      const response = await fetch('/api/user/preferences');
      if (response.ok) {
        const data = await response.json();
        if (data.sidebar_order && data.sidebar_order.length > 0) {
          // Map saved order to navigation items (excluding Dashboard which is always first)
          const orderedNav = data.sidebar_order
            .map((name: string) => REORDERABLE_NAVIGATION.find(item => item.name === name))
            .filter(Boolean);
          setReorderableItems(orderedNav as typeof REORDERABLE_NAVIGATION);
        }
      }
    } catch (error) {
      console.error('Error fetching navigation order:', error);
    }
  };

  // Filter reorderable items based on permissions
  const filteredReorderable = reorderableItems.filter(item => {
    if (item.name === 'Review Queue' && !canReview) return false;
    if ((item.name === 'Manage Users' || item.name === 'Feature Flags') && !canManageUsers) return false;
    return true;
  });

  // Final navigation: Dashboard always first, then filtered reorderable items
  const finalNavigation = [FIXED_DASHBOARD, ...filteredReorderable];

  return (
    <ToastProvider>
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-blue-900 text-white shadow-lg flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo-icon.png"
                  alt="America First"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="text-xl font-bold">America First</span>
              </Link>
              <span className="ml-2 text-sm text-blue-200">Admin Panel</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm">{session?.user?.email}</div>
                {session?.user?.role && (
                  <div className="text-xs text-blue-200 capitalize">
                    {session.user.role.replace('_', ' ')}
                  </div>
                )}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content Area with Independent Scrolling */}
      <div className="flex flex-1 overflow-hidden">
        {/* Side Navigation - Fixed, independently scrollable */}
        <aside className="w-64 bg-white shadow-md flex-shrink-0 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {finalNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2 rounded transition-colors ${
                    isActive
                      ? 'bg-blue-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content - Independently scrollable */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
    </ToastProvider>
  );
}
