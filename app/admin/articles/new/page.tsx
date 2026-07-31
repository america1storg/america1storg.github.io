'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ArticleEditor from '@/components/ArticleEditor';

export default function NewArticle() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (
    title: string,
    content: string,
    coverImage: string,
    status: 'draft' | 'published'
  ) => {
    if (!session?.user) {
      alert('You must be logged in to create an article');
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
        alert(
          `Article ${status === 'published' ? 'published' : 'saved as draft'} successfully!`
        );
        router.push('/admin/articles');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save article');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Failed to save article');
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
