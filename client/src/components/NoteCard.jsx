import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Pin, MoreHorizontal, Edit2, Trash2, Archive, Copy } from 'lucide-react';
import { useState } from 'react';

const NoteCard = ({ note, onToggleFavorite, onTogglePin, onDelete, index = 0 }) => {
  const [showMenu, setShowMenu] = useState(false);

  // Strip HTML tags for preview
  const getPreviewText = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html || '';
    const text = div.textContent || div.innerText || '';
    return text.slice(0, 150) + (text.length > 150 ? '...' : '');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.98 }}
      className={`note-item relative group ${showMenu ? 'menu-open' : ''}`}
    >
      <Link
        to={`/note/${note._id}`}
        className="note-card-link block p-4 sm:p-5 bg-gradient-to-br from-white to-gray-50/80 dark:from-dark-800/60 dark:to-dark-900/40 border border-gray-200/60 dark:border-dark-700/40 rounded-2xl transition-all duration-300 shadow-sm dark:shadow-lg dark:shadow-black/10"
      >
        {/* Header */}
        <div className="flex items-start gap-2 sm:gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {note.isPinned && (
                <Pin className="w-3 h-3 text-primary-500 shrink-0" />
              )}
              <h3 className="font-semibold truncate text-sm sm:text-base text-gray-900 dark:text-white">{note.title}</h3>
            </div>
            {note.notebook && (
              <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400 dark:text-dark-500 mt-1">
                <span>{note.notebook.icon || '📓'}</span>
                <span className="truncate">{note.notebook.title}</span>
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <p className="text-gray-500 dark:text-dark-400 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3">
          {getPreviewText(note.content) || 'Empty note...'}
        </p>

        {/* Tags */}
        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
            {note.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-1.5 sm:px-2 py-0.5 bg-gray-100 dark:bg-dark-700 rounded-full text-[10px] sm:text-xs text-gray-600 dark:text-dark-300"
              >
                #{tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs text-gray-400 dark:text-dark-500">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-400 dark:text-dark-500">
          <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
        </div>
      </Link>

      {/* Quick Actions */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite?.(note._id);
          }}
          className={`p-1.5 rounded-lg backdrop-blur-sm transition-all duration-200 ${note.isFavorite
            ? 'bg-yellow-500/20 text-yellow-500 shadow-sm shadow-yellow-500/20'
            : 'bg-white/80 dark:bg-dark-700/80 hover:bg-white dark:hover:bg-dark-600 text-gray-500 dark:text-dark-400 hover:text-yellow-500 shadow-sm'
            }`}
        >
          <Star className={`w-3.5 h-3.5 ${note.isFavorite ? 'fill-yellow-400' : ''}`} />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onTogglePin?.(note._id);
          }}
          className={`p-1.5 rounded-lg backdrop-blur-sm transition-all duration-200 ${note.isPinned
            ? 'bg-primary-500/20 text-primary-500 shadow-sm shadow-primary-500/20'
            : 'bg-white/80 dark:bg-dark-700/80 hover:bg-white dark:hover:bg-dark-600 text-gray-500 dark:text-dark-400 hover:text-primary-500 shadow-sm'
            }`}
        >
          <Pin className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className={`p-1.5 rounded-lg backdrop-blur-sm transition-all duration-200 shadow-sm ${showMenu
            ? 'bg-primary-500/20 text-primary-500'
            : 'bg-white/80 dark:bg-dark-700/80 hover:bg-white dark:hover:bg-dark-600 text-gray-500 dark:text-dark-400'
            }`}
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Dropdown Menu - Outside the hover group */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowMenu(false);
            }}
            onMouseOver={(e) => e.stopPropagation()}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-3 top-12 w-44 bg-white/95 dark:bg-dark-800/95 backdrop-blur-xl border border-gray-200/80 dark:border-dark-600/50 rounded-xl shadow-xl shadow-black/10 dark:shadow-black/30 z-50 overflow-hidden"
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete?.(note._id);
                setShowMenu(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-500/10 text-red-500 transition-colors text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Note</span>
            </button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default NoteCard;
