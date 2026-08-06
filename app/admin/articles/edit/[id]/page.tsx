'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ArticleEditorWorkflow from '@/components/ArticleEditorWorkflow';
import { useToast } from '@/components/ToastProvider';

interface Article {
  id: number;
  title: string;
  content: string;
  cover_image: string | null;
  status: 'draft' | 'submitted' | 'needs_re_edit' | 'approved' | 'published';
  author_id: number;
  rejection_reason: string | null;
}

export default function EditArticle() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const { showToast } = useToast();
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
        showToast('Article not found', 'error');
        router.push('/admin/articles');
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      showToast('Failed to load article', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (
    title: string,
    content: string,
    coverImage: string,
    status: string
  ) => {
    if (!session?.user || !article) {
      showToast('Unable to save article', 'error');
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
          cover_image: coverImage,
          status,
        }),
      });

      if (response.ok) {
        showToast('Article saved successfully!', 'success');
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

      <ArticleEditorWorkflow
        articleId={article.id}
        initialTitle={article.title}
        initialContent={article.content}
        initialCoverImage={article.cover_image || ''}
        initialStatus={article.status}
        rejectionReason={article.rejection_reason}
        userRole={session?.user?.role || 'soldier'}
        isAuthor={article.author_id === session?.user?.id}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
}
