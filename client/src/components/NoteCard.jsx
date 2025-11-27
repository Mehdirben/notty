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
      className="note-item relative group"
    >
      <Link
        to={`/note/${note._id}`}
        className="block p-4 bg-white dark:bg-dark-800/30 border border-gray-200 dark:border-dark-700/50 rounded-xl hover:border-gray-300 dark:hover:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-all shadow-sm dark:shadow-none"
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {note.isPinned && (
                <Pin className="w-3 h-3 text-primary-500" />
              )}
              <h3 className="font-semibold truncate text-gray-900 dark:text-white">{note.title}</h3>
            </div>
            {note.notebook && (
              <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-dark-500 mt-1">
                <span>{note.notebook.icon || '📓'}</span>
                <span className="truncate">{note.notebook.title}</span>
              </div>
            )}
          </div>
          {note.isFavorite && (
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
          )}
        </div>

        {/* Preview */}
        <p className="text-gray-500 dark:text-dark-400 text-sm line-clamp-2 mb-3">
          {getPreviewText(note.content) || 'Empty note...'}
        </p>

        {/* Tags */}
        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {note.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-gray-100 dark:bg-dark-700 rounded-full text-xs text-gray-600 dark:text-dark-300"
              >
                #{tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs text-gray-400 dark:text-dark-500">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-dark-500">
          <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
        </div>
      </Link>

      {/* Quick Actions */}
      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite?.(note._id);
          }}
          className={`p-1.5 rounded-lg transition-colors ${
            note.isFavorite 
              ? 'bg-yellow-500/20 text-yellow-500' 
              : 'bg-gray-100 dark:bg-dark-700/80 hover:bg-gray-200 dark:hover:bg-dark-600 text-gray-400 dark:text-dark-400'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${note.isFavorite ? 'fill-yellow-400' : ''}`} />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            onTogglePin?.(note._id);
          }}
          className={`p-1.5 rounded-lg transition-colors ${
            note.isPinned 
              ? 'bg-primary-500/20 text-primary-500' 
              : 'bg-gray-100 dark:bg-dark-700/80 hover:bg-gray-200 dark:hover:bg-dark-600 text-gray-400 dark:text-dark-400'
          }`}
        >
          <Pin className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowMenu(!showMenu);
          }}
          className="p-1.5 bg-gray-100 dark:bg-dark-700/80 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg text-gray-400 dark:text-dark-400 transition-colors"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowMenu(false)} 
            />
            <div className="absolute right-0 top-8 w-40 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl shadow-xl z-20 overflow-hidden">
              <button
                onClick={() => {
                  onDelete?.(note._id);
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-red-500/10 text-red-500 transition-colors text-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default NoteCard;
