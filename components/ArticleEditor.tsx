'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useState } from 'react';

interface ArticleEditorProps {
  initialContent?: string;
  initialTitle?: string;
  onSave: (title: string, content: string, status: 'draft' | 'published') => Promise<void>;
  isSaving: boolean;
}

export default function ArticleEditor({
  initialContent = '',
  initialTitle = '',
  onSave,
  isSaving,
}: ArticleEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [coverImage, setCoverImage] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');

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
        placeholder: 'Write your article content here...',
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          'prose prose-lg max-w-none focus:outline-none min-h-[500px] px-8 py-6 text-gray-900',
      },
    },
  });

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

  const handleSave = async (status: 'draft' | 'published') => {
    if (!editor) return;
    const content = editor.getHTML();
    await onSave(title, content, status);
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
      {/* Cover Image Area */}
      <div
        className="relative h-64 bg-gray-100 rounded-t-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
        onClick={() => setShowCoverModal(true)}
        style={coverImage ? {
          backgroundImage: `url(${coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        {!coverImage && (
          <div className="text-center">
            <div className="text-6xl mb-2">📷</div>
            <p className="text-gray-600 font-medium">Add a cover image or video to your article</p>
            <p className="text-sm text-gray-500 mt-1">Click to upload</p>
          </div>
        )}
        {coverImage && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCoverImage('');
            }}
            className="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-100"
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
          placeholder="Write here. You can also include @mentions."
          className="w-full text-xl focus:outline-none text-gray-900 placeholder-gray-400"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 px-8 py-4 border-b bg-gray-50">
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

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Action Buttons */}
      <div className="px-8 py-6 border-t bg-white flex justify-between items-center rounded-b-lg">
        <p className="text-sm text-gray-500">
          {title ? `Title: ${title.length} characters` : 'Add a title to continue'}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => handleSave('draft')}
            disabled={isSaving || !title}
            className="px-6 py-2.5 border-2 border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={isSaving || !title}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isSaving ? 'Publishing...' : 'Publish Now'}
          </button>
        </div>
      </div>

      {/* Cover Image Modal */}
      {showCoverModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add Cover Image</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/cover.jpg"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowCoverModal(false);
                    setImageUrl('');
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
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
                  className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50"
                >
                  Add Cover
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Insert Image</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Alt Text (Optional)
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Description of the image"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowImageModal(false);
                    setImageUrl('');
                    setImageAlt('');
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={addImage}
                  disabled={!imageUrl}
                  className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50"
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
