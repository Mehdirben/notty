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
  Check
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
  
  const { currentNote, getNote, updateNote, deleteNote, toggleFavorite, togglePin, isSaving } = useNoteStore();

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
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-20 bg-dark-950/80 backdrop-blur-lg border-b border-dark-800"
        >
          <div className="flex items-center justify-between px-6 py-3">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
              
              {currentNote.notebook && (
                <div className="hidden sm:flex items-center gap-2 text-dark-400">
                  <span>{currentNote.notebook.icon || '📓'}</span>
                  <span>{currentNote.notebook.title}</span>
                </div>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Save Status */}
              <div className="flex items-center gap-2 text-sm text-dark-400 mr-2">
                {isSaving ? (
                  <>
                    <div className="w-3 h-3 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : hasChanges ? (
                  <>
                    <Clock className="w-3 h-3" />
                    <span>Unsaved</span>
                  </>
                ) : lastSaved ? (
                  <>
                    <Check className="w-3 h-3 text-green-400" />
                    <span className="hidden sm:inline">Saved</span>
                  </>
                ) : null}
              </div>

              {/* Save Button */}
              <button
                onClick={handleManualSave}
                disabled={!hasChanges || isSaving}
                className="p-2 hover:bg-dark-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Save (⌘S)"
              >
                <Save className="w-4 h-4" />
              </button>

              {/* Favorite */}
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-lg transition-colors ${
                  currentNote.isFavorite 
                    ? 'bg-yellow-500/20 text-yellow-400' 
                    : 'hover:bg-dark-800 text-dark-400'
                }`}
              >
                <Star className={`w-4 h-4 ${currentNote.isFavorite ? 'fill-yellow-400' : ''}`} />
              </button>

              {/* Pin */}
              <button
                onClick={handleTogglePin}
                className={`p-2 rounded-lg transition-colors ${
                  currentNote.isPinned 
                    ? 'bg-primary-500/20 text-primary-400' 
                    : 'hover:bg-dark-800 text-dark-400'
                }`}
              >
                <Pin className="w-4 h-4" />
              </button>

              {/* Delete */}
              <button
                onClick={handleDelete}
                className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors text-dark-400"
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
          className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full"
        >
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled"
            className="w-full text-3xl md:text-4xl font-bold bg-transparent border-none outline-none mb-6 placeholder:text-dark-600"
          />

          {/* Tags */}
          {currentNote.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {currentNote.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-dark-800 rounded-full text-sm text-dark-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Editor */}
          <RichTextEditor
            content={content}
            onChange={handleContentChange}
            placeholder="Start writing your note..."
          />

          {/* Metadata */}
          <div className="mt-8 pt-6 border-t border-dark-800 text-sm text-dark-500">
            <p>Created: {new Date(currentNote.createdAt).toLocaleString()}</p>
            <p>Last updated: {new Date(currentNote.updatedAt).toLocaleString()}</p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default NotePage;
