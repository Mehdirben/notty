import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, BookOpen, FileText, TrendingUp } from 'lucide-react';
import Layout from '../components/Layout';
import NotebookCard from '../components/NotebookCard';
import NoteCard from '../components/NoteCard';
import CreateNotebookModal from '../components/CreateNotebookModal';
import useAuthStore from '../store/authStore';
import useNotebookStore from '../store/notebookStore';
import useNoteStore from '../store/noteStore';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuthStore();
  const { notebooks, fetchNotebooks, deleteNotebook, updateNotebook } = useNotebookStore();
  const { notes, fetchNotes, toggleFavorite, togglePin, deleteNote } = useNoteStore();

  useEffect(() => {
    fetchNotebooks();
    fetchNotes();
  }, [fetchNotebooks, fetchNotes]);

  const handleDeleteNotebook = async (notebook) => {
    if (window.confirm(`Delete "${notebook.title}" and all its notes?`)) {
      const result = await deleteNotebook(notebook._id);
      if (result.success) {
        toast.success('Notebook deleted');
      } else {
        toast.error(result.error);
      }
    }
  };

  const handleArchiveNotebook = async (notebook) => {
    const result = await updateNotebook(notebook._id, { isArchived: true });
    if (result.success) {
      toast.success('Notebook archived');
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm('Delete this note?')) {
      const result = await deleteNote(id);
      if (result.success) {
        toast.success('Note deleted');
      } else {
        toast.error(result.error);
      }
    }
  };

  const recentNotes = notes.slice(0, 6);
  const totalNotes = notes.length;
  const favoriteNotes = notes.filter(n => n.isFavorite).length;

  return (
    <Layout>
      <div className="min-h-screen p-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-gray-500 dark:text-dark-400">Here's an overview of your notes and notebooks.</p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="p-6 bg-white dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-sm dark:shadow-none">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-500/20 rounded-xl">
                <BookOpen className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{notebooks.length}</p>
                <p className="text-gray-500 dark:text-dark-400 text-sm">Notebooks</p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-sm dark:shadow-none">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <FileText className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalNotes}</p>
                <p className="text-gray-500 dark:text-dark-400 text-sm">Total Notes</p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-sm dark:shadow-none">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{favoriteNotes}</p>
                <p className="text-gray-500 dark:text-dark-400 text-sm">Favorites</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notebooks Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Notebooks</h2>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl font-medium text-white hover:shadow-lg hover:shadow-primary-500/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              New Notebook
            </button>
          </div>

          {notebooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {notebooks.map((notebook) => (
                <NotebookCard
                  key={notebook._id}
                  notebook={notebook}
                  onDelete={handleDeleteNotebook}
                  onArchive={handleArchiveNotebook}
                />
              ))}
              {/* Create New Card */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setIsCreateModalOpen(true)}
                className="p-6 border-2 border-dashed border-gray-300 dark:border-dark-700 rounded-2xl hover:border-primary-500/50 hover:bg-gray-50 dark:hover:bg-dark-800/30 transition-all flex flex-col items-center justify-center gap-3 min-h-[200px]"
              >
                <div className="p-3 bg-gray-100 dark:bg-dark-800 rounded-xl">
                  <Plus className="w-6 h-6 text-gray-400 dark:text-dark-400" />
                </div>
                <span className="text-gray-500 dark:text-dark-400 font-medium">Create Notebook</span>
              </motion.button>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-dark-800 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-gray-400 dark:text-dark-500" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">No notebooks yet</h3>
              <p className="text-gray-500 dark:text-dark-400 mb-4">Create your first notebook to get started</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl font-medium text-white hover:shadow-lg hover:shadow-primary-500/30 transition-all"
              >
                Create Notebook
              </button>
            </div>
          )}
        </motion.div>

        {/* Recent Notes Section */}
        {recentNotes.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Notes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentNotes.map((note, index) => (
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

        {/* Create Notebook Modal */}
        <CreateNotebookModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;
