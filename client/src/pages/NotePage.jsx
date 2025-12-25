import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  Pin,
  MoreHorizontal,
  Trash2,
  Clock,
  Save,
  Check,
  Search
} from 'lucide-react';
import Layout from '../components/Layout';
import RichTextEditor from '../components/RichTextEditor';
import useNoteStore from '../store/noteStore';
import toast from 'react-hot-toast';

const NotePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const { currentNote, getNote, updateNote, deleteNote, toggleFavorite, togglePin, isSaving, isLoading, error } = useNoteStore();

  useEffect(() => {
    if (id) {
      getNote(id);
    }
  }, [id, getNote]);

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content || '');
      setLastSaved(new Date(currentNote.updatedAt));
    }
  }, [currentNote]);

  // Auto-save with debounce
  const saveNote = useCallback(async () => {
    if (!hasChanges || !id) return;

    const result = await updateNote(id, { title, content });
    if (result.success) {
      setHasChanges(false);
      setLastSaved(new Date());
    }
  }, [id, title, content, hasChanges, updateNote]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasChanges) {
        saveNote();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [title, content, hasChanges, saveNote]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setHasChanges(true);
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
    setHasChanges(true);
  };

  const handleManualSave = async () => {
    await saveNote();
    toast.success('Note saved!');
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this note?')) {
      const result = await deleteNote(id);
      if (result.success) {
        toast.success('Note deleted');
        navigate(-1);
      } else {
        toast.error(result.error);
      }
    }
  };

  const handleToggleFavorite = async () => {
    await toggleFavorite(id);
  };

  const handleTogglePin = async () => {
    await togglePin(id);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleManualSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [title, content, hasChanges]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error || (!currentNote && !isLoading)) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="max-w-lg w-full text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 sm:mb-8 lg:mb-10"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-8 shadow-xl lg:shadow-2xl">
                <Search className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-gray-400 dark:text-gray-500" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 lg:mb-6 px-2">
                Note Not Found
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 lg:mb-10 leading-relaxed max-w-md mx-auto px-4 sm:px-6">
                The note you're looking for doesn't exist or has been deleted. It might have been moved or the link could be broken.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0"
            >
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-base sm:text-lg"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 font-medium text-base sm:text-lg"
              >
                Go Back
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 sm:mt-8 text-center px-4 sm:px-6"
            >
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Need help? Try searching for your note or check your recent activity.
              </p>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentNote) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-20 bg-white/80 dark:bg-dark-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-dark-800 shrink-0"
        >
          <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3">
            {/* Left Side */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 sm:gap-2 text-gray-500 dark:text-dark-400 hover:text-gray-900 dark:hover:text-white transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>

              {currentNote.notebook && (
                <div className="hidden md:flex items-center gap-2 text-gray-500 dark:text-dark-400 truncate">
                  <span>{currentNote.notebook.icon || '📓'}</span>
                  <span className="truncate">{currentNote.notebook.title}</span>
                </div>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Save Status */}
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-dark-400 mr-1 sm:mr-2">
                {isSaving ? (
                  <>
                    <div className="w-3 h-3 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                    <span className="hidden sm:inline">Saving...</span>
                  </>
                ) : hasChanges ? (
                  <>
                    <Clock className="w-3 h-3" />
                    <span className="hidden sm:inline">Unsaved</span>
                  </>
                ) : lastSaved ? (
                  <>
                    <Check className="w-3 h-3 text-green-500" />
                    <span className="hidden sm:inline">Saved</span>
                  </>
                ) : null}
              </div>

              {/* Save Button */}
              <button
                onClick={handleManualSave}
                disabled={!hasChanges || isSaving}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-500 dark:text-dark-400"
                title="Save (⌘S)"
              >
                <Save className="w-4 h-4" />
              </button>

              {/* Favorite */}
              <button
                onClick={handleToggleFavorite}
                className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg transition-colors ${currentNote.isFavorite
                  ? 'bg-yellow-500/20 text-yellow-500'
                  : 'hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-500 dark:text-dark-400'
                  }`}
              >
                <Star className={`w-4 h-4 ${currentNote.isFavorite ? 'fill-yellow-400' : ''}`} />
              </button>

              {/* Pin */}
              <button
                onClick={handleTogglePin}
                className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg transition-colors ${currentNote.isPinned
                  ? 'bg-primary-500/20 text-primary-500'
                  : 'hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-500 dark:text-dark-400'
                  }`}
              >
                <Pin className="w-4 h-4" />
              </button>

              {/* Delete */}
              <button
                onClick={handleDelete}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-colors text-gray-500 dark:text-dark-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1 flex flex-col overflow-y-auto"
        >
          {/* Title */}
          <div className="px-3 sm:px-6 md:px-8 lg:px-12 pt-4 sm:pt-6 shrink-0">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Untitled"
              className="w-full text-2xl sm:text-3xl md:text-4xl font-bold bg-transparent border-none outline-none placeholder:text-gray-400 dark:placeholder:text-dark-600 text-gray-900 dark:text-white"
            />

            {/* Tags */}
            {currentNote.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
                {currentNote.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-dark-800 rounded-full text-sm text-gray-600 dark:text-dark-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Editor */}
          <div className="flex-1 min-h-0 px-3 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-4">
            <RichTextEditor
              content={content}
              onChange={handleContentChange}
              placeholder="Start writing your note..."
            />
          </div>
        </motion.div>

        {/* Metadata - Outside scrollable area, always visible above navbar */}
        <div className="shrink-0 px-3 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-3 border-t border-gray-200 dark:border-dark-800 bg-white dark:bg-dark-950 flex items-center justify-between text-xs text-gray-500 dark:text-dark-500">
          <span>Created: {new Date(currentNote.createdAt).toLocaleDateString()}</span>
          <span>Edited: {new Date(currentNote.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Layout>
  );
};

export default NotePage;
