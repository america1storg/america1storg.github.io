'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastProvider';

interface FeatureFlag {
  id: number;
  name: string;
  flag_key: string;
  description: string | null;
  component_name: string | null;
  status: 'draft' | 'available' | 'permanent';
  pages: string[];
  created_at: string;
  updated_at: string;
}

export default function FlagsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    flag_key: '',
    description: '',
    component_name: '',
    status: 'draft' as 'draft' | 'available' | 'permanent',
    pages: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchFlags();
    }
  }, [status, router]);

  const fetchFlags = async () => {
    try {
      const response = await fetch('/api/feature-flags');
      if (response.ok) {
        const data = await response.json();
        setFlags(data.flags);
      }
    } catch (error) {
      console.error('Error fetching flags:', error);
      showToast('Failed to load feature flags', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/feature-flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pages: formData.pages ? formData.pages.split(',').map(p => p.trim()) : [],
        }),
      });

      if (response.ok) {
        showToast('Feature flag created successfully!', 'success');
        setShowCreateModal(false);
        resetForm();
        fetchFlags();
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to create flag', 'error');
      }
    } catch (error) {
      console.error('Error creating flag:', error);
      showToast('Failed to create flag', 'error');
    }
  };

  const handleUpdate = async () => {
    if (!editingFlag) return;

    try {
      const response = await fetch(`/api/feature-flags/${editingFlag.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pages: formData.pages ? formData.pages.split(',').map(p => p.trim()) : [],
        }),
      });

      if (response.ok) {
        showToast('Feature flag updated successfully!', 'success');
        setEditingFlag(null);
        resetForm();
        fetchFlags();
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to update flag', 'error');
      }
    } catch (error) {
      console.error('Error updating flag:', error);
      showToast('Failed to update flag', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this feature flag?')) {
      return;
    }

    try {
      const response = await fetch(`/api/feature-flags/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast('Feature flag deleted successfully', 'success');
        fetchFlags();
      } else {
        showToast('Failed to delete flag', 'error');
      }
    } catch (error) {
      console.error('Error deleting flag:', error);
      showToast('Failed to delete flag', 'error');
    }
  };

  const startEdit = (flag: FeatureFlag) => {
    setEditingFlag(flag);
    setFormData({
      name: flag.name,
      flag_key: flag.flag_key,
      description: flag.description || '',
      component_name: flag.component_name || '',
      status: flag.status,
      pages: flag.pages?.join(', ') || '',
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      flag_key: '',
      description: '',
      component_name: '',
      status: 'draft',
      pages: '',
    });
  };

  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feature Flags</h1>
          <p className="text-gray-600 mt-2">
            Manage feature flags for component testing and deployment
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
        >
          + Create Flag
        </button>
      </div>

      {/* Flags List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Flag Key</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Component</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {flags.map(flag => (
              <tr key={flag.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <code className="text-sm font-mono font-bold text-blue-600">{flag.flag_key}</code>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{flag.name}</p>
                    {flag.description && (
                      <p className="text-xs text-gray-500 mt-1">{flag.description}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {flag.component_name ? (
                    <code className="text-xs font-mono text-gray-600">{flag.component_name}</code>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      flag.status === 'permanent'
                        ? 'bg-green-100 text-green-800'
                        : flag.status === 'available'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {flag.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(flag)}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(flag.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {flags.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No feature flags yet. Create one to get started!</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingFlag) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingFlag ? 'Edit Feature Flag' : 'Create Feature Flag'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Flag Key (must start with AF_)
                </label>
                <input
                  type="text"
                  value={formData.flag_key}
                  onChange={e => setFormData({ ...formData, flag_key: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 font-mono"
                  placeholder="AF_carousel"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                  placeholder="Homepage Carousel"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                  rows={3}
                  placeholder="Rotating carousel on homepage..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Component Name</label>
                <input
                  type="text"
                  value={formData.component_name}
                  onChange={e => setFormData({ ...formData, component_name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 font-mono"
                  placeholder="HomeCarousel"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                >
                  <option value="draft">Draft (Hidden from debugger)</option>
                  <option value="available">Available (Visible in debugger)</option>
                  <option value="permanent">Permanent (Always on for public)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Pages (comma-separated, e.g., /, /articles)
                </label>
                <input
                  type="text"
                  value={formData.pages}
                  onChange={e => setFormData({ ...formData, pages: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 font-mono"
                  placeholder="/, /articles, /about"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingFlag(null);
                  resetForm();
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingFlag ? handleUpdate : handleCreate}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                {editingFlag ? 'Update Flag' : 'Create Flag'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
