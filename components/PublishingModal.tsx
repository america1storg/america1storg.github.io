'use client';

import { useEffect, useState } from 'react';

interface PublishingModalProps {
  articleId: number;
  onComplete: (success: boolean, message: string) => void;
}

export default function PublishingModal({ articleId, onComplete }: PublishingModalProps) {
  const [status, setStatus] = useState<'publishing' | 'propagating' | 'verifying' | 'success' | 'error'>('publishing');
  const [message, setMessage] = useState('Publishing your article...');
  const [attempt, setAttempt] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const publishArticle = async () => {
      try {
        // Step 1: Publish the article to database
        setStatus('publishing');
        setMessage('Updating database...');
        setProgress(20);

        const publishResponse = await fetch(`/api/articles/${articleId}/publish-verified`, {
          method: 'POST',
        });

        if (!publishResponse.ok) {
          const errorData = await publishResponse.json();
          throw new Error(errorData.error || 'Failed to publish article');
        }

        setProgress(40);

        // Step 2: Wait for ISR propagation
        setStatus('propagating');
        setMessage('Propagating to public site...');
        setProgress(50);

        // Give ISR a moment to start revalidation
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setProgress(60);

        // Step 3: Verify it's actually published and accessible
        setStatus('verifying');
        setMessage('Verifying public accessibility...');

        // Poll to verify the article is publicly accessible
        const maxAttempts = 15; // Increased from 10
        let isPublished = false;

        for (let i = 0; i < maxAttempts && !isPublished; i++) {
          setAttempt(i + 1);
          setProgress(60 + (i / maxAttempts) * 35); // Progress from 60% to 95%

          const verifyResponse = await fetch(`/api/articles/${articleId}/verify-published`, {
            cache: 'no-store',
          });
          const verifyData = await verifyResponse.json();

          if (verifyData.isPublished) {
            isPublished = true;
            break;
          }

          // If still propagating, show helpful message
          if (verifyData.propagating) {
            setMessage(`Waiting for site propagation... (${i + 1}/${maxAttempts})`);
          } else if (verifyData.reason) {
            setMessage(verifyData.reason);
          }

          // Wait longer between attempts (2 seconds)
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        if (isPublished) {
          setStatus('success');
          setProgress(100);
          setMessage('✨ Article is now live on the public site!');
          setTimeout(() => onComplete(true, 'Article published successfully!'), 2000);
        } else {
          // Article is published in DB but we couldn't verify it's on public site yet
          setStatus('success');
          setProgress(95);
          setMessage('Article published! It may take a few moments to appear on the site.');
          setTimeout(() => onComplete(true, 'Article published (propagation may be in progress)'), 3000);
        }
      } catch (error) {
        console.error('Publishing error:', error);
        setStatus('error');
        setProgress(0);
        setMessage(error instanceof Error ? error.message : 'Failed to publish article');
        setTimeout(() => onComplete(false, 'Failed to publish article'), 3000);
      }
    };

    publishArticle();
  }, [articleId, onComplete]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-lg w-full shadow-2xl">
        <div className="text-center">
          {/* Icon */}
          <div className="mb-6">
            {(status === 'publishing' || status === 'propagating' || status === 'verifying') && (
              <div className="inline-block relative">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-blue-600"></div>
                {status === 'verifying' && (
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">
                    🔍
                  </div>
                )}
              </div>
            )}
            {status === 'success' && (
              <div className="text-7xl animate-bounce">✅</div>
            )}
            {status === 'error' && (
              <div className="text-7xl">❌</div>
            )}
          </div>

          {/* Status Title */}
          <h3 className="text-2xl font-bold mb-2 text-gray-900">
            {status === 'publishing' && 'Publishing Article'}
            {status === 'propagating' && 'Propagating to Site'}
            {status === 'verifying' && 'Verifying Publication'}
            {status === 'success' && '🎉 Published!'}
            {status === 'error' && 'Publication Failed'}
          </h3>

          {/* Message */}
          <p className="text-gray-600 mb-6 text-sm">{message}</p>

          {/* Progress Bar */}
          {status !== 'error' && (
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
              <div
                className="h-3 rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-blue-500 to-green-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {/* Progress Percentage */}
          {status !== 'error' && (
            <p className="text-sm text-gray-500 font-medium">{Math.round(progress)}%</p>
          )}

          {/* Additional Info */}
          {status === 'verifying' && attempt > 0 && (
            <p className="text-xs text-gray-400 mt-4">
              This may take 10-30 seconds due to site caching...
            </p>
          )}

          {status === 'success' && progress >= 100 && (
            <p className="text-sm text-green-600 mt-4 font-semibold">
              Your article is now visible to the public!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
