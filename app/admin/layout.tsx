'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ToastProvider } from '@/components/ToastProvider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const canReview = session?.user?.role && ['god_mode', 'king', 'captain'].includes(session.user.role);
  const canManageUsers = session?.user?.role && ['god_mode', 'king'].includes(session.user.role);

  const navigation = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Articles', href: '/admin/articles' },
    { name: 'New Article', href: '/admin/articles/new' },
    ...(canReview ? [{ name: 'Review Queue', href: '/admin/review' }] : []),
    ...(canManageUsers ? [{ name: 'Manage Users', href: '/admin/users' }] : []),
  ];

  return (
    <ToastProvider>
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-blue-900 text-white shadow-lg">
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

      {/* Side Navigation */}
      <div className="flex">
        <aside className="w-64 bg-white shadow-md min-h-screen">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
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

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
    </ToastProvider>
  );
}
