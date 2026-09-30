'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import Image from 'next/image';
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

interface Volunteer {
  id: number;
  title: string;
  url: string;
  description: string;
  domain: string;
  category: string;
  image_url: string;
  display_order?: number;
  created_at: string;
  updated_at: string;
}

function SortableVolunteerCard({ volunteer, onEdit, onDelete, isDark }: {
  volunteer: Volunteer;
  onEdit: (v: Volunteer) => void;
  onDelete: (id: number) => void;
  isDark: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: volunteer.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-2xl overflow-hidden"
      style={{
        ...style,
        background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="relative h-48">
        <Image
          src={volunteer.image_url}
          alt={volunteer.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="mb-2 cursor-grab active:cursor-grabbing flex items-center gap-2 text-sm"
          style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 5h6M9 12h6M9 19h6" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Drag to reorder</span>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{
              background: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
              color: '#3b82f6',
            }}
          >
            {volunteer.category}
          </span>
        </div>
        <h3 className="text-lg font-bold mb-2">{volunteer.title}</h3>
        <p
          className="text-sm mb-4 line-clamp-3"
          style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}
        >
          {volunteer.description}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(volunteer)}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: '#3b82f6',
              color: '#fff',
            }}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(volunteer.id)}
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
  );
}

export default function AdminVolunteersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [reordering, setReordering] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    domain: '',
    category: 'Civic Leadership',
    image_url: '',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Fetch volunteers
  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const response = await fetch('/api/volunteers');
      const data = await response.json();
      setVolunteers(data);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = volunteers.findIndex((v) => v.id === active.id);
      const newIndex = volunteers.findIndex((v) => v.id === over.id);

      const newOrder = arrayMove(volunteers, oldIndex, newIndex);
      setVolunteers(newOrder);

      // Save new order to backend
      setReordering(true);
      try {
        const orderedIds = newOrder.map((v) => v.id);
        await fetch('/api/volunteers/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderedIds }),
        });
      } catch (error) {
        console.error('Error saving order:', error);
        // Revert on error
        await fetchVolunteers();
      } finally {
        setReordering(false);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/volunteers/upload-image', {
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
      const url = editingId ? `/api/volunteers/${editingId}` : '/api/volunteers';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save volunteer');

      await fetchVolunteers();
      resetForm();
    } catch (error) {
      console.error('Error saving volunteer:', error);
      alert('Failed to save volunteer opportunity');
    }
  };

  const handleEdit = (volunteer: Volunteer) => {
    setFormData({
      title: volunteer.title,
      url: volunteer.url,
      description: volunteer.description,
      domain: volunteer.domain,
      category: volunteer.category,
      image_url: volunteer.image_url,
    });
    setEditingId(volunteer.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this volunteer opportunity?')) return;

    try {
      const response = await fetch(`/api/volunteers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete volunteer');

      await fetchVolunteers();
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      alert('Failed to delete volunteer opportunity');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      url: '',
      description: '',
      domain: '',
      category: 'Civic Leadership',
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
            <h1 className="text-4xl font-bold mb-2">Manage Volunteer Opportunities</h1>
            <p style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
              Add, edit, or reorder volunteer opportunity cards
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
            {showForm ? 'Cancel' : '+ Add New Opportunity'}
          </button>
        </div>

        {reordering && (
          <div className="mb-4 p-4 bg-blue-500 text-white rounded-lg">
            Saving new order...
          </div>
        )}

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
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Opportunity' : 'Add New Opportunity'}</h2>

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
                  placeholder="example.org"
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
                  <option value="Civic Leadership">Civic Leadership</option>
                  <option value="Local Service">Local Service</option>
                  <option value="National Nonprofit">National Nonprofit</option>
                  <option value="National Service">National Service</option>
                  <option value="Federal Programs">Federal Programs</option>
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
                <label className="block mb-2 font-medium">Image (1200x520px) *</label>
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
                  <div className="mt-4 relative w-full max-w-2xl h-48">
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
                {editingId ? 'Update Opportunity' : 'Create Opportunity'}
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

        {/* Volunteers Grid with Drag and Drop */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={volunteers.map((v) => v.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {volunteers.map((volunteer) => (
                <SortableVolunteerCard
                  key={volunteer.id}
                  volunteer={volunteer}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isDark={isDark}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {volunteers.length === 0 && !loading && (
          <div className="text-center py-12">
            <p style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>
              No volunteer opportunities yet. Click "Add New Opportunity" to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
