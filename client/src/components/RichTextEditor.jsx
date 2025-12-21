import { useCallback, useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { common, createLowlight } from 'lowlight';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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
  X,
  Youtube
} from 'lucide-react';

const lowlight = createLowlight(common);

// Custom Link Extension with intelligent click handling
const CustomLink = Link.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      target: {
        default: null,
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'a',
      HTMLAttributes,
      0,
    ];
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setLink:
        (attributes) =>
        ({ chain }) => {
          return chain()
            .setMark(this.name, attributes)
            .run();
        },
    };
  },
}).configure({
  openOnClick: false, // We'll handle clicks manually
  HTMLAttributes: {
    class: 'text-primary-400 underline cursor-pointer',
  },
});

// YouTube Component for React Node View
const YouTubeComponent = ({ node, updateAttributes }) => {
  const { videoId, width, height } = node.attrs;
  
  return (
    <NodeViewWrapper className="youtube-wrapper my-4">
      <div className="relative">
        <iframe
          width={width || 560}
          height={height || 315}
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg shadow-lg"
          style={{ maxWidth: '100%' }}
        />
      </div>
    </NodeViewWrapper>
  );
};

// YouTube Extension for TipTap
const YouTube = Node.create({
  name: 'youtube',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      videoId: {
        default: null,
      },
      width: {
        default: 560,
      },
      height: {
        default: 315,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-youtube-video]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-youtube-video': '' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(YouTubeComponent);
  },

  addCommands() {
    return {
      setYouTube: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },
});

// Function to extract YouTube video ID from URL
const extractYouTubeId = (url) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

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
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const navigate = useNavigate();

  // Handle link clicks intelligently
  const handleLinkClick = useCallback((event) => {
    const target = event.target;
    if (target.tagName === 'A' && target.href) {
      event.preventDefault();
      
      const url = target.href;
      const currentOrigin = window.location.origin;
      
      // Check if it's an internal link
      if (url.startsWith(currentOrigin) || url.startsWith('/')) {
        // Internal link - navigate within the same tab
        const pathname = url.startsWith(currentOrigin)
          ? url.replace(currentOrigin, '')
          : url;
        navigate(pathname);
      } else if (url.startsWith('http://') || url.startsWith('https://')) {
        // External link - open in new tab
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        // Malformed URL (like "www.google.com" without protocol)
        // Try to fix it by adding https://
        const fixedUrl = url.startsWith('www.') ? `https://${url}` : url;
        if (fixedUrl.startsWith('http')) {
          window.open(fixedUrl, '_blank', 'noopener,noreferrer');
        } else {
          // If we can't fix it, show an error
          toast.error('Invalid link format. Please use a complete URL (e.g., https://example.com)');
        }
      }
    }
  }, [navigate]);

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
      CustomLink,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      YouTube,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-full h-full',
      },
      handleDOMEvents: {
        click: (view, event) => {
          handleLinkClick(event);
          return false; // Don't prevent default here, let our handler decide
        },
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

      // Convert image directly to Base64 - no server upload
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result;
        editor?.chain().focus().setImage({ src: base64String }).run();
      };
      reader.onerror = () => {
        console.error('Error reading file');
      };
      reader.readAsDataURL(file);
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
    
    // Validate and format URLs based on type
    if (linkType === 'external') {
      // Add https:// for external links if not present
      if (!finalUrl.startsWith('http')) {
        finalUrl = `https://${finalUrl}`;
      }
      
      // Basic URL validation for external links
      try {
        new URL(finalUrl);
      } catch (e) {
        toast.error('Please enter a valid URL (e.g., https://example.com)');
        return;
      }
    } else if (linkType === 'internal') {
      // Validate internal note paths
      if (!finalUrl.startsWith('/')) {
        toast.error('Internal links must start with / (e.g., /note/123)');
        return;
      }
      
      // Check if it's a valid internal path format
      const validInternalPaths = ['/note/', '/notebook/', '/dashboard', '/favorites'];
      const isValidInternal = validInternalPaths.some(path => finalUrl.startsWith(path));
      
      if (!isValidInternal && finalUrl !== '/dashboard' && finalUrl !== '/favorites') {
        toast.error('Invalid internal path. Use formats like /note/123 or /notebook/456');
        return;
      }
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

  const addYouTube = useCallback(() => {
    setYoutubeUrl('');
    setShowYouTubeModal(true);
  }, []);

  const handleYouTubeSubmit = useCallback(() => {
    if (!youtubeUrl.trim()) {
      setShowYouTubeModal(false);
      return;
    }

    const videoId = extractYouTubeId(youtubeUrl.trim());
    if (!videoId) {
      alert('Invalid YouTube URL. Please enter a valid YouTube video URL.');
      return;
    }

    editor?.chain().focus().setYouTube({ videoId }).run();
    setShowYouTubeModal(false);
    setYoutubeUrl('');
  }, [editor, youtubeUrl]);

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

      {/* YouTube Modal */}
      {showYouTubeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add YouTube Video</h3>
              <button
                onClick={() => setShowYouTubeModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              {/* URL Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  YouTube URL
                </label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleYouTubeSubmit();
                    }
                  }}
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Paste any YouTube video URL (youtube.com, youtu.be, etc.)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleYouTubeSubmit}
                  className="flex-1 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Add Video
                </button>
                <button
                  onClick={() => setShowYouTubeModal(false)}
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
          <MenuButton onClick={addYouTube} title="Add YouTube Video">
            <Youtube className="w-4 h-4" />
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
