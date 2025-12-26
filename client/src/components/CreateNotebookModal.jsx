import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import useNotebookStore from '../store/notebookStore';

const ICONS = ['📓', '📕', '📗', '📘', '📙', '💼', '💡', '🎯', '🚀', '✨', '📝', '🎨', '🔬', '📊', '🎵', '❤️'];
const COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e', '#ef4444', '#f97316', '#eab308', '#84cc16',
  '#22c55e', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6'
];

const CreateNotebookModal = ({ isOpen, onClose, notebook = null }) => {
  const isEditMode = !!notebook;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📓');
  const [color, setColor] = useState('#6366f1');
  const { createNotebook, updateNotebook, isLoading } = useNotebookStore();

  useEffect(() => {
    if (notebook) {
      setTitle(notebook.title || '');
      setDescription(notebook.description || '');
      setIcon(notebook.icon || '📓');
      setColor(notebook.color || '#6366f1');
    } else {
      setTitle('');
      setDescription('');
      setIcon('📓');
      setColor('#6366f1');
    }
  }, [notebook, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const data = { title, description, icon, color };
    const result = isEditMode
      ? await updateNotebook(notebook._id, data)
      : await createNotebook(data);

    if (result.success) {
      toast.success(isEditMode ? 'Notebook updated!' : 'Notebook created!');
      onClose();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 pb-20 sm:pb-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-2xl overflow-hidden w-full sm:max-w-md max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-dark-700">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-primary-500/20 rounded-lg">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400" />
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{isEditMode ? 'Edit Notebook' : 'Create Notebook'}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-dark-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                {/* Preview */}
                <div className="flex items-center justify-center">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-4xl"
                    style={{ backgroundColor: `${color}20`, borderColor: color, borderWidth: 2 }}
                  >
                    {icon}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-200">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="My Notebook"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl focus:outline-none focus:border-primary-500 transition-colors text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-dark-400"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-200">Description (optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's this notebook about?"
                    rows={2}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl focus:outline-none focus:border-primary-500 transition-colors resize-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-dark-400"
                  />
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-200">Icon</label>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {ICONS.map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setIcon(i)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-lg sm:text-xl transition-all ${icon === i
                          ? 'bg-primary-500/20 ring-2 ring-primary-500'
                          : 'bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 active:scale-95'
                          }`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-200">Color</label>
                  <div className="flex flex-wrap gap-2 sm:gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all active:scale-90 ${color === c ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-white dark:ring-offset-dark-900' : ''
                          }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-primary-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                  ) : (
                    isEditMode ? 'Update Notebook' : 'Create Notebook'
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateNotebookModal;
