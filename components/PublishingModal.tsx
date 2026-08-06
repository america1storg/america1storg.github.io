'use client';

import { useEffect, useState } from 'react';

interface PublishingModalProps {
  articleId: number;
  onComplete: (success: boolean, message: string) => void;
}

export default function PublishingModal({ articleId, onComplete }: PublishingModalProps) {
  const [status, setStatus] = useState<'publishing' | 'verifying' | 'success' | 'error'>('publishing');
  const [message, setMessage] = useState('Publishing your article...');

  useEffect(() => {
    const publishArticle = async () => {
      try {
        // Step 1: Publish the article
        setStatus('publishing');
        setMessage('Publishing your article...');

        const publishResponse = await fetch(`/api/articles/${articleId}/publish-verified`, {
          method: 'POST',
        });

        if (!publishResponse.ok) {
          throw new Error('Failed to publish article');
        }

        // Step 2: Verify it's actually published
        setStatus('verifying');
        setMessage('Verifying publication...');

        // Poll to verify the article is publicly accessible
        let attempts = 0;
        const maxAttempts = 10;
        let isPublished = false;

        while (attempts < maxAttempts && !isPublished) {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second between attempts

          const verifyResponse = await fetch(`/api/articles/${articleId}/verify-published`);
          const verifyData = await verifyResponse.json();

          if (verifyData.isPublished) {
            isPublished = true;
            break;
          }

          attempts++;
        }

        if (isPublished) {
          setStatus('success');
          setMessage('Article published successfully!');
          setTimeout(() => onComplete(true, 'Article published successfully!'), 1500);
        } else {
          setStatus('error');
          setMessage('Article published but verification timed out. Please refresh to confirm.');
          setTimeout(() => onComplete(false, 'Publication verification timed out'), 3000);
        }
      } catch (error) {
        console.error('Publishing error:', error);
        setStatus('error');
        setMessage('Failed to publish article');
        setTimeout(() => onComplete(false, 'Failed to publish article'), 2000);
      }
    };

    publishArticle();
  }, [articleId, onComplete]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center">
          {/* Icon */}
          <div className="mb-6">
            {status === 'publishing' && (
              <div className="inline-block">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
              </div>
            )}
            {status === 'verifying' && (
              <div className="inline-block">
                <div className="animate-pulse text-6xl">🔍</div>
              </div>
            )}
            {status === 'success' && (
              <div className="text-6xl text-green-600 animate-bounce">✓</div>
            )}
            {status === 'error' && (
              <div className="text-6xl text-red-600">✕</div>
            )}
          </div>

          {/* Message */}
          <h3 className="text-2xl font-bold mb-2 text-gray-900">
            {status === 'publishing' && 'Publishing...'}
            {status === 'verifying' && 'Verifying...'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Error'}
          </h3>
          <p className="text-gray-600">{message}</p>

          {/* Progress Indicator */}
          {(status === 'publishing' || status === 'verifying') && (
            <div className="mt-6 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  status === 'publishing' ? 'bg-blue-600 w-1/2' : 'bg-green-600 w-full'
                }`}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
