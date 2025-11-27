import { useState } from 'react';
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

const CreateNotebookModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📓');
  const [color, setColor] = useState('#6366f1');
  const { createNotebook, isLoading } = useNotebookStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const result = await createNotebook({ title, description, icon, color });
    
    if (result.success) {
      toast.success('Notebook created!');
      onClose();
      setTitle('');
      setDescription('');
      setIcon('📓');
      setColor('#6366f1');
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-2xl overflow-hidden w-full max-w-md">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-dark-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-500/20 rounded-lg">
                    <BookOpen className="w-5 h-5 text-primary-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create Notebook</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-dark-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Preview */}
                <div className="flex items-center justify-center">
                  <div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                    style={{ backgroundColor: `${color}20`, borderColor: color, borderWidth: 2 }}
                  >
                    {icon}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="My Notebook"
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl focus:outline-none focus:border-primary-500 transition-colors text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-dark-400"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Description (optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's this notebook about?"
                    rows={2}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl focus:outline-none focus:border-primary-500 transition-colors resize-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-dark-400"
                  />
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {ICONS.map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setIcon(i)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                          icon === i 
                            ? 'bg-primary-500/20 ring-2 ring-primary-500' 
                            : 'bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700'
                        }`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-full transition-all ${
                          color === c ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-white dark:ring-offset-dark-900' : ''
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
                  className="w-full py-3 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                  ) : (
                    'Create Notebook'
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
