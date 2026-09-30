'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface UserPreferences {
  id: number;
  email: string;
  name: string | null;
  display_name: string | null;
  display_name_type: 'email' | 'name' | 'custom';
  sidebar_order: string[];
  quick_actions: string[];
  is_super_admin: boolean;
  role: string | null;
}

const DEFAULT_SIDEBAR_ITEMS = [
  'Dashboard',
  'Articles',
  'New Article',
  'Resources',
  'Volunteers',
  'Review Queue',
  'Manage Users',
  'Feature Flags',
];

const DEFAULT_QUICK_ACTIONS = [
  'New Article',
  'View Articles',
  'Manage Users',
  'Resources',
  'Volunteers',
];

function SortableItem({ id }: { id: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="p-4 mb-2 rounded-lg cursor-grab active:cursor-grabbing flex items-center gap-3"
      style={{
        ...style,
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M9 5h6M9 12h6M9 19h6" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="font-medium">{id}</span>
    </div>
  );
}

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [displayNameType, setDisplayNameType] = useState<'email' | 'name' | 'custom'>('email');
  const [customDisplayName, setCustomDisplayName] = useState('');
  const [sidebarOrder, setSidebarOrder] = useState<string[]>(DEFAULT_SIDEBAR_ITEMS);
  const [quickActions, setQuickActions] = useState<string[]>(DEFAULT_QUICK_ACTIONS);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchPreferences();
    }
  }, [status, router]);

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/user/preferences');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
        setDisplayNameType(data.display_name_type || 'email');
        setCustomDisplayName(data.display_name || '');
        setSidebarOrder(data.sidebar_order?.length > 0 ? data.sidebar_order : DEFAULT_SIDEBAR_ITEMS);
        setQuickActions(data.quick_actions?.length > 0 ? data.quick_actions : DEFAULT_QUICK_ACTIONS);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: customDisplayName,
          display_name_type: displayNameType,
          sidebar_order: sidebarOrder,
          quick_actions: quickActions,
        }),
      });

      if (response.ok) {
        alert('Settings saved successfully!');
        await fetchPreferences();
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSidebarDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSidebarOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleQuickActionsDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setQuickActions((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: isDark ? '#000a2e' : '#f8f9fa' }}>
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent mb-4" />
          <p style={{ color: isDark ? '#fff' : '#000' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div
      className="min-h-screen p-8"
      style={{
        background: isDark ? '#000a2e' : '#f8f9fa',
        color: isDark ? '#fff' : '#000',
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Admin Settings</h1>
        <p className="mb-8" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
          Customize your admin dashboard experience
        </p>

        {/* User Info */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
                Email
              </label>
              <p className="font-medium">{preferences?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
                Name
              </label>
              <p className="font-medium">{preferences?.name || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
                Role
              </label>
              <p className="font-medium capitalize">{preferences?.role || 'Admin'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
                Super Admin
              </label>
              <p className="font-medium">{preferences?.is_super_admin ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>

        {/* Display Name Settings */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Display Name</h2>
          <p className="mb-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
            Choose what appears in the "Welcome" message on the dashboard
          </p>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                value="email"
                checked={displayNameType === 'email'}
                onChange={(e) => setDisplayNameType(e.target.value as 'email')}
                className="w-4 h-4"
              />
              <span>Use email: <strong>{preferences?.email}</strong></span>
            </label>

            {preferences?.name && (
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  value="name"
                  checked={displayNameType === 'name'}
                  onChange={(e) => setDisplayNameType(e.target.value as 'name')}
                  className="w-4 h-4"
                />
                <span>Use name: <strong>{preferences.name}</strong></span>
              </label>
            )}

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                value="custom"
                checked={displayNameType === 'custom'}
                onChange={(e) => setDisplayNameType(e.target.value as 'custom')}
                className="w-4 h-4"
              />
              <span>Use custom name:</span>
            </label>

            {displayNameType === 'custom' && (
              <input
                type="text"
                value={customDisplayName}
                onChange={(e) => setCustomDisplayName(e.target.value)}
                placeholder="Enter custom display name"
                className="w-full px-4 py-2 rounded-lg"
                style={{
                  background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#fff',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)',
                  color: isDark ? '#fff' : '#000',
                }}
              />
            )}
          </div>

          <div className="mt-4 p-4 rounded-lg" style={{ background: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)' }}>
            <p className="text-sm font-medium mb-1">Preview:</p>
            <p className="text-lg">
              Welcome,{' '}
              <strong>
                {displayNameType === 'email' && preferences?.email}
                {displayNameType === 'name' && preferences?.name}
                {displayNameType === 'custom' && (customDisplayName || 'Custom Name')}
              </strong>!
            </p>
          </div>
        </div>

        {/* Sidebar Order */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Sidebar Order</h2>
          <p className="mb-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
            Drag and drop to reorder sidebar navigation items
          </p>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleSidebarDragEnd}
          >
            <SortableContext items={sidebarOrder} strategy={verticalListSortingStrategy}>
              {sidebarOrder.map((item) => (
                <SortableItem key={item} id={item} />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        {/* Quick Actions */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <p className="mb-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
            Drag and drop to reorder quick action buttons on the dashboard
          </p>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleQuickActionsDragEnd}
          >
            <SortableContext items={quickActions} strategy={verticalListSortingStrategy}>
              {quickActions.map((action) => (
                <SortableItem key={action} id={action} />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-4 rounded-lg font-semibold text-lg transition-all disabled:opacity-50"
            style={{
              background: '#3b82f6',
              color: '#fff',
            }}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          <button
            onClick={() => router.push('/admin')}
            className="px-8 py-4 rounded-lg font-semibold text-lg transition-all"
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
