'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface MigrationResult {
  total: number;
  migrated: number;
  failed: number;
  errors: string[];
}

export default function MigrateImagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const runMigration = async () => {
    if (!confirm('This will migrate all base64 images to Vercel Blob. Continue?')) {
      return;
    }

    setIsRunning(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/migrate-images', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Migration failed');
      }

      const data = await response.json();
      setResult(data.results);
    } catch (err) {
      console.error('Migration error:', err);
      setError(err instanceof Error ? err.message : 'Migration failed');
    } finally {
      setIsRunning(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Migrate Images to Vercel Blob</h1>
        <p className="text-gray-600">
          This tool will migrate all existing base64 cover images from the database to Vercel Blob (CDN storage).
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-bold text-blue-900 mb-3">What this does:</h2>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">✓</span>
            <span>Finds all articles with base64-encoded cover images</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">✓</span>
            <span>Uploads each image to Vercel Blob (CDN)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">✓</span>
            <span>Updates article records with new CDN URLs</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">✓</span>
            <span>Fixes bandwidth consumption issues permanently</span>
          </li>
        </ul>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-bold text-yellow-900 mb-3">⚠️ Important:</h2>
        <ul className="space-y-2 text-yellow-800">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>
              <strong>Environment Variable Required:</strong> Make sure{' '}
              <code className="bg-yellow-200 px-2 py-1 rounded">BLOB_READ_WRITE_TOKEN</code> is set in Vercel
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>
              <strong>One-time operation:</strong> Run this only once after deploying Blob storage
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>
              <strong>Can take a few minutes:</strong> Depends on how many images need migration
            </span>
          </li>
        </ul>
      </div>

      {/* Action Button */}
      <div className="mb-8">
        <button
          onClick={runMigration}
          disabled={isRunning}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            isRunning
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {isRunning ? '🔄 Migrating Images...' : '🚀 Start Migration'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-red-900 mb-2">❌ Migration Failed</h3>
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Success Display */}
      {result && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">✅ Migration Complete</h3>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{result.total}</div>
              <div className="text-sm text-blue-800 mt-1">Total Found</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{result.migrated}</div>
              <div className="text-sm text-green-800 mt-1">Migrated</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-600">{result.failed}</div>
              <div className="text-sm text-red-800 mt-1">Failed</div>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-bold text-red-900 mb-2">Errors:</h4>
              <ul className="space-y-1">
                {result.errors.map((error, index) => (
                  <li key={index} className="text-sm text-red-800">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.migrated === result.total && result.failed === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-800 font-semibold">
                🎉 All images successfully migrated to Vercel Blob!
              </p>
              <p className="text-green-700 text-sm mt-2">
                Your articles now use CDN-hosted images. Bandwidth issues are fixed!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Next Steps */}
      {result && result.migrated > 0 && (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 mt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">✨ Next Steps:</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">1.</span>
              <span>Visit your articles page to verify images load correctly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">2.</span>
              <span>Create new articles - images will automatically upload to Blob</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">3.</span>
              <span>Monitor your Vercel dashboard - bandwidth should stay low</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
