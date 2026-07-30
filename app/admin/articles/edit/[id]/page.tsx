'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ArticleEditor from '@/components/ArticleEditor';

interface Article {
  id: number;
  title: string;
  content: string;
  status: 'draft' | 'published';
}

export default function EditArticle() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchArticle();
    }
  }, [params.id]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/articles/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data.article);
      } else {
        alert('Article not found');
        router.push('/admin/articles');
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      alert('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (
    title: string,
    content: string,
    status: 'draft' | 'published'
  ) => {
    if (!session?.user || !article) {
      alert('Unable to save article');
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/articles/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          status,
        }),
      });

      if (response.ok) {
        alert(
          `Article ${status === 'published' ? 'published' : 'saved'} successfully!`
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl text-gray-600">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl text-gray-600">Article not found</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
        <p className="text-gray-600 mt-2">
          Make changes to your article and save or publish
        </p>
      </div>

      <ArticleEditor
        initialTitle={article.title}
        initialContent={article.content}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
}
