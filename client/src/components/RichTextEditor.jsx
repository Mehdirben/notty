import { useCallback, useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  List, 
  ListOrdered, 
  CheckSquare,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Link as LinkIcon,
  Undo,
  Redo,
  Code2,
  ExternalLink,
  FileText,
  X
} from 'lucide-react';
import api from '../api/axios';

const lowlight = createLowlight(common);

const MenuButton = ({ onClick, isActive, disabled, children, title }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg transition-colors ${
      isActive 
        ? 'bg-primary-500/20 text-primary-500' 
        : 'text-gray-500 dark:text-dark-400 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-white'
    } disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {children}
  </button>
);

const RichTextEditor = ({ content, onChange, placeholder = "Start writing..." }) => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkType, setLinkType] = useState('external'); // 'external' or 'internal'

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full',
        },
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-primary-400 underline',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-full h-full',
      },
    },
  });

  // Sync editor content when the content prop changes (e.g., when loading a note)
  useEffect(() => {
    if (editor && content !== undefined && editor.getHTML() !== content) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  const addImage = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('image', file);

      try {
        const { data } = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        editor?.chain().focus().setImage({ src: data.url }).run();
      } catch (error) {
        // Fallback to base64 if upload fails
        const reader = new FileReader();
        reader.onload = () => {
          editor?.chain().focus().setImage({ src: reader.result }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    if (previousUrl) {
      setLinkUrl(previousUrl);
      // Determine if it's external or internal based on URL pattern
      setLinkType(previousUrl.startsWith('http') ? 'external' : 'internal');
    } else {
      setLinkUrl('');
      setLinkType('external');
    }
    setShowLinkModal(true);
  }, [editor]);

  const handleLinkSubmit = useCallback(() => {
    if (!linkUrl.trim()) {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      setShowLinkModal(false);
      return;
    }

    let finalUrl = linkUrl.trim();
    
    // Add https:// for external links if not present
    if (linkType === 'external' && !finalUrl.startsWith('http')) {
      finalUrl = `https://${finalUrl}`;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: finalUrl }).run();
    setShowLinkModal(false);
    setLinkUrl('');
  }, [editor, linkUrl, linkType]);

  const handleRemoveLink = useCallback(() => {
    editor?.chain().focus().extendMarkRange('link').unsetLink().run();
    setShowLinkModal(false);
    setLinkUrl('');
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Link</h3>
              <button
                onClick={() => setShowLinkModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              {/* Link Type Selection */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setLinkType('external')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    linkType === 'external'
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-600'
                  }`}
                >
                  <ExternalLink className="w-4 h-4" />
                  External Link
                </button>
                <button
                  onClick={() => setLinkType('internal')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    linkType === 'internal'
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-600'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Internal Note
                </button>
              </div>

              {/* URL Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {linkType === 'external' ? 'External URL' : 'Note Path'}
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder={
                    linkType === 'external' 
                      ? 'example.com' 
                      : '/note/note-id'
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleLinkSubmit();
                    }
                  }}
                />
                {linkType === 'external' && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    HTTPS will be added automatically if not provided
                  </p>
                )}
                {linkType === 'internal' && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Enter the path to an internal note (e.g., /note/123)
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleLinkSubmit}
                  className="flex-1 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Add Link
                </button>
                <button
                  onClick={handleRemoveLink}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
                >
                  Remove
                </button>
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar - Scrollable on mobile */}
      <div className="flex items-center gap-1 px-2 sm:px-4 py-2 border-b border-gray-200 dark:border-dark-800 bg-gray-50/80 dark:bg-dark-900/80 backdrop-blur-sm overflow-x-auto scrollbar-hide shrink-0">
        {/* Text Formatting */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold (⌘B)"
          >
            <Bold className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic (⌘I)"
          >
            <Italic className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </MenuButton>
        </div>

        <div className="w-px h-6 bg-gray-200 dark:bg-dark-600 mx-0.5 sm:mx-1 shrink-0" />

        {/* Headings */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </MenuButton>
        </div>

        <div className="w-px h-6 bg-gray-200 dark:bg-dark-600 mx-0.5 sm:mx-1 shrink-0" />

        {/* Lists */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive('taskList')}
            title="Task List"
          >
            <CheckSquare className="w-4 h-4" />
          </MenuButton>
        </div>

        <div className="w-px h-6 bg-gray-200 dark:bg-dark-600 mx-0.5 sm:mx-1 shrink-0" />

        {/* Blocks */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            title="Code Block"
          >
            <Code2 className="w-4 h-4" />
          </MenuButton>
        </div>

        <div className="w-px h-6 bg-gray-200 dark:bg-dark-600 mx-0.5 sm:mx-1 shrink-0" />

        {/* Media */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <MenuButton onClick={addImage} title="Add Image">
            <ImageIcon className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={setLink}
            isActive={editor.isActive('link')}
            title="Add Link"
          >
            <LinkIcon className="w-4 h-4" />
          </MenuButton>
        </div>

        <div className="flex-1 min-w-2" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (⌘Z)"
          >
            <Undo className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (⌘⇧Z)"
          >
            <Redo className="w-4 h-4" />
          </MenuButton>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto pt-4 sm:pt-6">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
};

export default RichTextEditor;
