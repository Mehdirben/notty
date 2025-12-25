import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const NotebookCard = ({ notebook, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showMenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="notebook-card relative group"
    >
      <Link
        to={`/notebook/${notebook._id}`}
        className="block p-4 sm:p-6 bg-white dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700 rounded-xl sm:rounded-2xl hover:border-gray-300 dark:hover:border-dark-600 active:bg-gray-50 dark:active:bg-dark-800 transition-all shadow-sm dark:shadow-none"
      >
        {/* Icon & Color Accent */}
        <div
          className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center text-2xl sm:text-3xl mb-3 sm:mb-4"
          style={{
            backgroundColor: `${notebook.color}20`,
            borderColor: notebook.color,
            borderWidth: 2
          }}
        >
          {notebook.icon || '📓'}
        </div>

        {/* Title & Description */}
        <h3 className="text-base sm:text-lg font-semibold mb-1 truncate text-gray-900 dark:text-white">{notebook.title}</h3>
        <p className="text-gray-500 dark:text-dark-400 text-xs sm:text-sm line-clamp-2 mb-3 sm:mb-4">
          {notebook.description || 'No description'}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 dark:text-dark-500">
          <span>{notebook.noteCount || 0} notes</span>
          <span>•</span>
          <span>{new Date(notebook.updatedAt).toLocaleDateString()}</span>
        </div>

        {/* Color Bar */}
        <div
          className="absolute bottom-0 left-3 right-3 sm:left-4 sm:right-4 h-1 rounded-full"
          style={{ backgroundColor: notebook.color }}
        />
      </Link>

      {/* Menu Button */}
      <div className="absolute top-4 right-4">
        <button
          ref={buttonRef}
          onClick={(e) => {
            e.preventDefault();
            setShowMenu(!showMenu);
          }}
          className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-dark-700/80 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-all"
        >
          <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-white" />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div
            ref={menuRef}
            className="absolute right-0 top-12 w-48 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl shadow-xl z-20 overflow-hidden"
          >
            <button
              onClick={() => {
                onEdit?.(notebook);
                setShowMenu(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            >
              <Edit2 className="w-4 h-4 text-gray-400 dark:text-dark-400" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => {
                onDelete?.(notebook);
                setShowMenu(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-500/10 text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NotebookCard;

