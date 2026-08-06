'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ArticleEditor from '@/components/ArticleEditor';
import { useToast } from '@/components/ToastProvider';

export default function NewArticle() {
  const router = useRouter();
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (
    title: string,
    content: string,
    coverImage: string,
    status: 'draft' | 'published'
  ) => {
    if (!session?.user) {
      showToast('You must be logged in to create an article', 'error');
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          cover_image: coverImage,
          status,
          author_id: session.user.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        showToast(
          `Article ${status === 'published' ? 'published' : 'saved as draft'} successfully!`,
          'success'
        );
        setTimeout(() => router.push('/admin/articles'), 1000);
      } else {
        const error = await response.json();
        showToast(error.message || 'Failed to save article', 'error');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      showToast('Failed to save article', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Article</h1>
        <p className="text-gray-600 mt-2">
          Write and publish articles for the America First community
        </p>
      </div>

      <ArticleEditor onSave={handleSave} isSaving={isSaving} />
    </div>
  );
}
