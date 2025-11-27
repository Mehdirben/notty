import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, ArrowLeft, Edit2, Trash2, Settings } from 'lucide-react';
import Layout from '../components/Layout';
import NoteCard from '../components/NoteCard';
import useNotebookStore from '../store/notebookStore';
import useNoteStore from '../store/noteStore';
import toast from 'react-hot-toast';

const NotebookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  
  const { currentNotebook, getNotebook, deleteNotebook } = useNotebookStore();
  const { notes, fetchNotes, createNote, toggleFavorite, togglePin, deleteNote, isLoading } = useNoteStore();

  useEffect(() => {
    if (id) {
      getNotebook(id);
      fetchNotes({ notebook: id });
    }
  }, [id, getNotebook, fetchNotes]);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    
    if (!newNoteTitle.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const result = await createNote({
      title: newNoteTitle,
      notebook: id,
      content: ''
    });

    if (result.success) {
      toast.success('Note created!');
      setNewNoteTitle('');
      setIsCreating(false);
      navigate(`/note/${result.note._id}`);
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Delete this note?')) {
      const result = await deleteNote(noteId);
      if (result.success) {
        toast.success('Note deleted');
      } else {
        toast.error(result.error);
      }
    }
  };

  const handleDeleteNotebook = async () => {
    if (window.confirm(`Delete "${currentNotebook?.title}" and all its notes? This cannot be undone.`)) {
      const result = await deleteNotebook(id);
      if (result.success) {
        toast.success('Notebook deleted');
        navigate('/dashboard');
      } else {
        toast.error(result.error);
      }
    }
  };

  if (!currentNotebook) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const pinnedNotes = notes.filter(n => n.isPinned);
  const regularNotes = notes.filter(n => !n.isPinned);

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Header */}
        <div 
          className="relative h-48 md:h-56"
          style={{ 
            background: `linear-gradient(135deg, ${currentNotebook.color}40, ${currentNotebook.color}10)` 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 dark:to-dark-950" />
          
          <div className="relative z-10 h-full px-8 flex flex-col justify-end pb-6">
            {/* Back Button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="absolute top-6 left-8 flex items-center gap-2 text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {/* Actions */}
            <div className="absolute top-6 right-8 flex items-center gap-2">
              <button
                onClick={handleDeleteNotebook}
                className="p-2 bg-white/80 dark:bg-dark-800/80 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-colors text-gray-600 dark:text-white"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Notebook Info */}
            <div className="flex items-end gap-4">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shrink-0"
                style={{ 
                  backgroundColor: `${currentNotebook.color}30`,
                  borderColor: currentNotebook.color,
                  borderWidth: 2
                }}
              >
                {currentNotebook.icon || '📓'}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">{currentNotebook.title}</h1>
                <p className="text-gray-600 dark:text-dark-400">
                  {currentNotebook.description || 'No description'} • {notes.length} notes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Create Note Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {isCreating ? (
              <form onSubmit={handleCreateNote} className="flex gap-3">
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="Note title..."
                  autoFocus
                  className="flex-1 px-4 py-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl focus:outline-none focus:border-primary-500 transition-colors text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-400"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl font-medium text-white hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-50"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewNoteTitle('');
                  }}
                  className="px-6 py-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl font-medium text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl font-medium text-white hover:shadow-lg hover:shadow-primary-500/30 transition-all"
              >
                <Plus className="w-5 h-5" />
                New Note
              </button>
            )}
          </motion.div>

          {/* Pinned Notes */}
          {pinnedNotes.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                📌 Pinned
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pinnedNotes.map((note, index) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    index={index}
                    onToggleFavorite={toggleFavorite}
                    onTogglePin={togglePin}
                    onDelete={handleDeleteNote}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* All Notes */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {regularNotes.length > 0 ? (
              <>
                {pinnedNotes.length > 0 && (
                  <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">All Notes</h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regularNotes.map((note, index) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      index={index}
                      onToggleFavorite={toggleFavorite}
                      onTogglePin={togglePin}
                      onDelete={handleDeleteNote}
                    />
                  ))}
                </div>
              </>
            ) : pinnedNotes.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-dark-800 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-gray-400 dark:text-dark-500" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">No notes yet</h3>
                <p className="text-gray-500 dark:text-dark-400 mb-4">Create your first note in this notebook</p>
                <button
                  onClick={() => setIsCreating(true)}
                  className="px-6 py-2 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl font-medium text-white hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                >
                  Create Note
                </button>
              </div>
            ) : null}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default NotebookPage;
