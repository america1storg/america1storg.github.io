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
  const [showImageModal, setShowImageModal] = useState(false);
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
        placeholder: 'Start writing your article...',
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6',
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
    <div className="bg-white rounded-lg shadow-lg">
      {/* Title Input */}
      <div className="p-6 border-b">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article Title"
          className="w-full text-4xl font-bold focus:outline-none"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-4 border-b bg-gray-50">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded transition-colors ${
            editor.isActive('bold')
              ? 'bg-blue-900 text-white'
              : 'bg-white hover:bg-gray-100'
          }`}
        >
          <strong>B</strong>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded transition-colors ${
            editor.isActive('italic')
              ? 'bg-blue-900 text-white'
              : 'bg-white hover:bg-gray-100'
          }`}
        >
          <em>I</em>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-blue-900 text-white'
              : 'bg-white hover:bg-gray-100'
          }`}
        >
          H2
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 rounded transition-colors ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-blue-900 text-white'
              : 'bg-white hover:bg-gray-100'
          }`}
        >
          H3
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-blue-900 text-white'
              : 'bg-white hover:bg-gray-100'
          }`}
        >
          • List
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-blue-900 text-white'
              : 'bg-white hover:bg-gray-100'
          }`}
        >
          1. List
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded transition-colors ${
            editor.isActive('blockquote')
              ? 'bg-blue-900 text-white'
              : 'bg-white hover:bg-gray-100'
          }`}
        >
          &ldquo; Quote
        </button>

        <button
          onClick={setLink}
          className={`px-3 py-1 rounded transition-colors ${
            editor.isActive('link')
              ? 'bg-blue-900 text-white'
              : 'bg-white hover:bg-gray-100'
          }`}
        >
          🔗 Link
        </button>

        <button
          onClick={() => setShowImageModal(true)}
          className="px-3 py-1 rounded bg-white hover:bg-gray-100 transition-colors"
        >
          🖼️ Image
        </button>

        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-3 py-1 rounded bg-white hover:bg-gray-100 transition-colors"
        >
          ― HR
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Action Buttons */}
      <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
        <button
          onClick={() => handleSave('draft')}
          disabled={isSaving || !title}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save as Draft'}
        </button>
        <button
          onClick={() => handleSave('published')}
          disabled={isSaving || !title}
          className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Publishing...' : 'Publish'}
        </button>
      </div>

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
  );
}
