'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useState } from 'react';
import { useToast } from './ToastProvider';
import PublishingModal from './PublishingModal';

interface ArticleEditorWorkflowProps {
  articleId?: number;
  initialContent?: string;
  initialTitle?: string;
  initialCoverImage?: string;
  initialStatus?: 'draft' | 'submitted' | 'needs_re_edit' | 'approved' | 'published';
  rejectionReason?: string | null;
  userRole: 'god_mode' | 'king' | 'captain' | 'soldier';
  isAuthor: boolean;
  onSave: (title: string, content: string, coverImage: string, status: string) => Promise<void>;
  isSaving: boolean;
}

export default function ArticleEditorWorkflow({
  articleId,
  initialContent = '',
  initialTitle = '',
  initialCoverImage = '',
  initialStatus = 'draft',
  rejectionReason,
  userRole,
  isAuthor,
  onSave,
  isSaving,
}: ArticleEditorWorkflowProps) {
  const { showToast } = useToast();
  const [title, setTitle] = useState(initialTitle);
  const [coverImage, setCoverImage] = useState(initialCoverImage);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [publishingArticleId, setPublishingArticleId] = useState<number | null>(null);

  const [editorKey, setEditorKey] = useState(0);

  // Determine if editing is allowed
  const canEdit =
    ['god_mode', 'king', 'captain'].includes(userRole) ||
    (userRole === 'soldier' && isAuthor && ['draft', 'needs_re_edit'].includes(initialStatus));

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Placeholder.configure({
        placeholder: canEdit ? 'Write your article content here...' : 'This article is locked for editing',
      }),
    ],
    content: initialContent,
    editable: canEdit,
    editorProps: {
      attributes: {
        class: `prose prose-lg max-w-none focus:outline-none min-h-[500px] px-8 py-6 text-gray-900 ${!canEdit ? 'opacity-60' : ''}`,
      },
    },
    onUpdate: () => {
      setEditorKey(prev => prev + 1);
    },
    onSelectionUpdate: () => {
      setEditorKey(prev => prev + 1);
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (isCover) {
        setCoverImage(base64String);
        setShowCoverModal(false);
      } else {
        setImageUrl(base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  const addImage = () => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run();
      setImageUrl('');
      setImageAlt('');
      setShowImageModal(false);
    }
  };

  const setLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleSaveDraft = async () => {
    if (!editor) return;
    const content = editor.getHTML();
    await onSave(title, content, coverImage, 'draft');
  };

  const handleSubmitForApproval = async () => {
    if (!editor || !articleId) return;

    showToast('Submitting article...', 'info');

    try {
      const response = await fetch(`/api/articles/${articleId}/submit`, {
        method: 'POST',
      });

      if (response.ok) {
        // Wait a moment for database to update
        await new Promise(resolve => setTimeout(resolve, 500));
        showToast('Article submitted for approval!', 'success');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to submit article', 'error');
      }
    } catch (error) {
      console.error('Error submitting article:', error);
      showToast('Failed to submit article', 'error');
    }
  };

  const handlePublish = () => {
    if (articleId) {
      setPublishingArticleId(articleId);
    }
  };

  const handlePublishComplete = (success: boolean, message: string) => {
    setPublishingArticleId(null);
    if (success) {
      showToast(message, 'success');
      setTimeout(() => window.location.reload(), 1500);
    } else {
      showToast(message, 'error');
    }
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <>
      <style jsx global>{`
        .ProseMirror {
          color: #111827 !important;
        }
        .ProseMirror p {
          color: #111827 !important;
        }
        .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
          color: #111827 !important;
        }
        .ProseMirror .is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
      <div className="bg-white rounded-lg shadow-lg max-w-5xl mx-auto">
        {/* Status Banner */}
        {rejectionReason && initialStatus === 'needs_re_edit' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-t-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-bold text-yellow-800">Revision Requested</h3>
                <p className="text-sm text-yellow-700 mt-1">{rejectionReason}</p>
              </div>
            </div>
          </div>
        )}

        {!canEdit && (
          <div className="bg-gray-100 border-l-4 border-gray-500 p-4 rounded-t-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-2xl">🔒</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-bold text-gray-800">Article Locked</h3>
                <p className="text-sm text-gray-700 mt-1">
                  This article is currently {initialStatus === 'submitted' ? 'under review' : initialStatus} and cannot be edited.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cover Image Area */}
        <div
          className={`relative h-64 bg-gray-100 ${!canEdit ? '' : 'cursor-pointer hover:bg-gray-200 transition-colors'} ${rejectionReason || !canEdit ? '' : 'rounded-t-lg'}`}
          onClick={canEdit ? () => setShowCoverModal(true) : undefined}
          style={coverImage ? {
            backgroundImage: `url(${coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : {}}
        >
          {!coverImage && (
            <div className="text-center flex items-center justify-center h-full">
              <div>
                <div className="text-6xl mb-2">📷</div>
                <p className="text-gray-600 font-medium">
                  {canEdit ? 'Add a cover image or video to your article' : 'No cover image'}
                </p>
                {canEdit && <p className="text-sm text-gray-500 mt-1">Click to upload</p>}
              </div>
            </div>
          )}
          {coverImage && canEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCoverImage('');
              }}
              className="absolute top-4 right-4 bg-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 font-bold text-black text-base border-2 border-gray-300"
            >
              Remove cover
            </button>
          )}
        </div>

        {/* Title Input */}
        <div className="p-8 border-b bg-white">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Title</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your article title here..."
            disabled={!canEdit}
            className={`w-full text-xl focus:outline-none text-black placeholder-gray-400 bg-white ${!canEdit ? 'opacity-60' : ''}`}
          />
        </div>

        {/* Toolbar */}
        {canEdit && (
          <div className="flex flex-wrap gap-2 px-8 py-4 border-b bg-gray-50" key={editorKey}>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`px-4 py-2 rounded font-bold text-base transition-colors ${
                editor.isActive('bold')
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
              title="Bold"
            >
              <strong className="text-base">B</strong>
            </button>

            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`px-4 py-2 rounded text-base transition-colors ${
                editor.isActive('italic')
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
              title="Italic"
            >
              <em className="text-base">I</em>
            </button>

            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`px-4 py-2 rounded font-semibold text-base transition-colors ${
                editor.isActive('heading', { level: 2 })
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
              title="Heading 2"
            >
              H2
            </button>

            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`px-4 py-2 rounded font-semibold text-base transition-colors ${
                editor.isActive('heading', { level: 3 })
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
              title="Heading 3"
            >
              H3
            </button>

            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`px-4 py-2 rounded text-base transition-colors ${
                editor.isActive('bulletList')
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
              title="Bullet List"
            >
              <span className="text-base">• List</span>
            </button>

            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`px-4 py-2 rounded text-base transition-colors ${
                editor.isActive('orderedList')
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
              title="Numbered List"
            >
              <span className="text-base">1. List</span>
            </button>

            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`px-4 py-2 rounded text-base transition-colors ${
                editor.isActive('blockquote')
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
              title="Quote"
            >
              <span className="text-base">&ldquo; Quote</span>
            </button>

            <button
              onClick={setLink}
              className={`px-4 py-2 rounded text-base transition-colors ${
                editor.isActive('link')
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
              title="Add Link"
            >
              <span className="text-base">🔗 Link</span>
            </button>

            <button
              onClick={() => setShowImageModal(true)}
              className="px-4 py-2 rounded text-base bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors"
              title="Insert Image"
            >
              <span className="text-base">🖼️ Image</span>
            </button>

            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`px-4 py-2 rounded text-base transition-colors ${
                editor.isActive('codeBlock')
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
              title="Code Block"
            >
              <span className="text-base">{'<>'} Code</span>
            </button>

            <button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="px-4 py-2 rounded text-base bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors"
              title="Horizontal Divider"
            >
              <span className="text-base">― Divider</span>
            </button>
          </div>
        )}

        {/* Editor Content */}
        <EditorContent editor={editor} />

        {/* Action Buttons */}
        <div className="px-8 py-6 border-t bg-white flex justify-between items-center rounded-b-lg">
          <p className="text-base text-gray-700 font-semibold">
            {title ? `Title: ${title.length} characters` : 'Add a title to continue'}
          </p>
          <div className="flex gap-3">
            {canEdit && ['draft', 'needs_re_edit'].includes(initialStatus) && (
              <>
                <button
                  onClick={handleSaveDraft}
                  disabled={isSaving || !title}
                  className="px-8 py-3 border-3 border-gray-400 rounded-full font-bold text-black text-base hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-md"
                >
                  {isSaving ? 'Saving...' : 'Save as Draft'}
                </button>
                {articleId && userRole === 'soldier' && (
                  <button
                    onClick={handleSubmitForApproval}
                    disabled={isSaving || !title}
                    className="px-8 py-3 bg-green-600 text-white rounded-full font-bold text-base hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    Submit for Approval
                  </button>
                )}
              </>
            )}

            {['god_mode', 'king', 'captain'].includes(userRole) && articleId && (
              <button
                onClick={handlePublish}
                disabled={isSaving || !title}
                className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold text-base hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Publish Now
              </button>
            )}
          </div>
        </div>

        {/* Cover Image Modal */}
        {showCoverModal && canEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-xl max-w-lg w-full shadow-2xl border-4 border-gray-200">
              <h3 className="text-3xl font-extrabold mb-8 text-black">Add Cover Image</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-bold mb-3 text-black">
                    Upload from Computer
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, true)}
                    className="w-full px-5 py-4 border-4 border-gray-400 rounded-lg focus:outline-none focus:border-blue-600 text-black text-base font-medium bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 border-t-2 border-gray-300"></div>
                  <span className="text-gray-500 font-bold">OR</span>
                  <div className="flex-1 border-t-2 border-gray-300"></div>
                </div>

                <div>
                  <label className="block text-lg font-bold mb-3 text-black">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-5 py-4 border-4 border-gray-400 rounded-lg focus:outline-none focus:border-blue-600 text-black text-lg font-medium bg-white placeholder-gray-500"
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={() => {
                      setShowCoverModal(false);
                      setImageUrl('');
                    }}
                    className="px-8 py-4 border-3 border-gray-400 rounded-lg hover:bg-gray-200 font-bold text-black text-lg bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (imageUrl) {
                        setCoverImage(imageUrl);
                        setImageUrl('');
                        setShowCoverModal(false);
                      }
                    }}
                    disabled={!imageUrl}
                    className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg"
                  >
                    Add Cover
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {showImageModal && canEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-xl max-w-lg w-full shadow-2xl border-4 border-gray-200">
              <h3 className="text-3xl font-extrabold mb-8 text-black">Insert Image</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-bold mb-3 text-black">
                    Upload from Computer
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, false)}
                    className="w-full px-5 py-4 border-4 border-gray-400 rounded-lg focus:outline-none focus:border-blue-600 text-black text-base font-medium bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 border-t-2 border-gray-300"></div>
                  <span className="text-gray-500 font-bold">OR</span>
                  <div className="flex-1 border-t-2 border-gray-300"></div>
                </div>

                <div>
                  <label className="block text-lg font-bold mb-3 text-black">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-5 py-4 border-4 border-gray-400 rounded-lg focus:outline-none focus:border-blue-600 text-black text-lg font-medium bg-white placeholder-gray-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold mb-3 text-black">
                    Alt Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    className="w-full px-5 py-4 border-4 border-gray-400 rounded-lg focus:outline-none focus:border-blue-600 text-black text-lg font-medium bg-white placeholder-gray-500"
                    placeholder="Description of the image"
                  />
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={() => {
                      setShowImageModal(false);
                      setImageUrl('');
                      setImageAlt('');
                    }}
                    className="px-8 py-4 border-3 border-gray-400 rounded-lg hover:bg-gray-200 font-bold text-black text-lg bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addImage}
                    disabled={!imageUrl}
                    className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg"
                  >
                    Insert
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Publishing Modal */}
      {publishingArticleId && (
        <PublishingModal
          articleId={publishingArticleId}
          onComplete={handlePublishComplete}
        />
      )}
    </>
  );
}
