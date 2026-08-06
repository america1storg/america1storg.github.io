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
          status: 'draft',
          author_id: session.user.id,
        }),
      });

      if (response.ok) {
        showToast('Article saved as draft successfully!', 'success');
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

  const handleSubmit = async (
    title: string,
    content: string,
    coverImage: string
  ) => {
    if (!session?.user) {
      showToast('You must be logged in to create an article', 'error');
      return;
    }

    setIsSaving(true);
    showToast('Submitting article...', 'info');

    try {
      // First, create the article as draft
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          cover_image: coverImage,
          status: 'draft',
          author_id: session.user.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const articleId = data.article.id;

        // Then submit it for approval
        const submitResponse = await fetch(`/api/articles/${articleId}/submit`, {
          method: 'POST',
        });

        if (submitResponse.ok) {
          showToast('Article submitted for approval!', 'success');
          setTimeout(() => router.push('/admin/articles'), 1000);
        } else {
          showToast('Article saved as draft, but submission failed', 'warning');
          setTimeout(() => router.push('/admin/articles'), 1000);
        }
      } else {
        const error = await response.json();
        showToast(error.message || 'Failed to save article', 'error');
      }
    } catch (error) {
      console.error('Error submitting article:', error);
      showToast('Failed to submit article', 'error');
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

      <ArticleEditor
        onSave={handleSave}
        onSubmit={handleSubmit}
        isSaving={isSaving}
        showSubmitButton={true}
      />
    </div>
  );
}
