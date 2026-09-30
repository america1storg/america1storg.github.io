'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import Image from 'next/image';

interface Resource {
  id: number;
  title: string;
  url: string;
  description: string;
  domain: string;
  category: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export default function AdminResourcesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    domain: '',
    category: 'Executive',
    image_url: '',
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Fetch resources
  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources');
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/resources/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setFormData((prev) => ({ ...prev, image_url: data.url }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/resources/${editingId}` : '/api/resources';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save resource');

      await fetchResources();
      resetForm();
    } catch (error) {
      console.error('Error saving resource:', error);
      alert('Failed to save resource');
    }
  };

  const handleEdit = (resource: Resource) => {
    setFormData({
      title: resource.title,
      url: resource.url,
      description: resource.description,
      domain: resource.domain,
      category: resource.category,
      image_url: resource.image_url,
    });
    setEditingId(resource.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete resource');

      await fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Failed to delete resource');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      url: '',
      description: '',
      domain: '',
      category: 'Executive',
      image_url: '',
    });
    setEditingId(null);
    setShowForm(false);
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Manage Resources</h1>
            <p style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
              Add, edit, or remove civic resource cards
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="px-6 py-3 rounded-lg font-semibold transition-all"
            style={{
              background: '#3b82f6',
              color: '#fff',
            }}
          >
            {showForm ? 'Cancel' : '+ Add New Resource'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl p-6 mb-8"
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Resource' : 'Add New Resource'}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#fff',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)',
                    color: isDark ? '#fff' : '#000',
                  }}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Domain *</label>
                <input
                  type="text"
                  required
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  placeholder="example.gov"
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#fff',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)',
                    color: isDark ? '#fff' : '#000',
                  }}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">URL *</label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#fff',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)',
                    color: isDark ? '#fff' : '#000',
                  }}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#fff',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)',
                    color: isDark ? '#fff' : '#000',
                  }}
                >
                  <option value="Executive">Executive</option>
                  <option value="Legislative">Legislative</option>
                  <option value="Elections">Elections</option>
                  <option value="Education">Education</option>
                  <option value="Government">Government</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 font-medium">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#fff',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)',
                    color: isDark ? '#fff' : '#000',
                  }}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 font-medium">Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#fff',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)',
                    color: isDark ? '#fff' : '#000',
                  }}
                />
                {uploading && <p className="mt-2 text-blue-500">Uploading...</p>}
                {formData.image_url && (
                  <div className="mt-4 relative w-64 h-32">
                    <Image
                      src={formData.image_url}
                      alt="Preview"
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                disabled={!formData.image_url || uploading}
                className="px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                style={{
                  background: '#3b82f6',
                  color: '#fff',
                }}
              >
                {editingId ? 'Update Resource' : 'Create Resource'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 rounded-lg font-semibold transition-all"
                style={{
                  background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="rounded-2xl overflow-hidden"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="relative h-48">
                <Image
                  src={resource.image_url}
                  alt={resource.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{
                      background: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                      color: '#3b82f6',
                    }}
                  >
                    {resource.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2">{resource.title}</h3>
                <p
                  className="text-sm mb-4 line-clamp-3"
                  style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}
                >
                  {resource.description}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(resource)}
                    className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                    style={{
                      background: '#3b82f6',
                      color: '#fff',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(resource.id)}
                    className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                    style={{
                      background: '#ef4444',
                      color: '#fff',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {resources.length === 0 && !loading && (
          <div className="text-center py-12">
            <p style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>
              No resources yet. Click "Add New Resource" to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
