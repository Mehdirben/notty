import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MoreHorizontal, Edit2, Trash2, Archive } from 'lucide-react';
import { useState } from 'react';

const NotebookCard = ({ notebook, onEdit, onDelete, onArchive }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="notebook-card relative group"
    >
      <Link
        to={`/notebook/${notebook._id}`}
        className="block p-6 bg-dark-800/50 border border-dark-700 rounded-2xl hover:border-dark-600 transition-all"
      >
        {/* Icon & Color Accent */}
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4"
          style={{ 
            backgroundColor: `${notebook.color}20`,
            borderColor: notebook.color,
            borderWidth: 2
          }}
        >
          {notebook.icon || '📓'}
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-semibold mb-1 truncate">{notebook.title}</h3>
        <p className="text-dark-400 text-sm line-clamp-2 mb-4">
          {notebook.description || 'No description'}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-dark-500">
          <span>{notebook.noteCount || 0} notes</span>
          <span>•</span>
          <span>{new Date(notebook.updatedAt).toLocaleDateString()}</span>
        </div>

        {/* Color Bar */}
        <div 
          className="absolute bottom-0 left-4 right-4 h-1 rounded-full"
          style={{ backgroundColor: notebook.color }}
        />
      </Link>

      {/* Menu Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowMenu(!showMenu);
          }}
          className="p-2 bg-dark-700/80 hover:bg-dark-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowMenu(false)} 
            />
            <div className="absolute right-0 top-12 w-48 bg-dark-800 border border-dark-700 rounded-xl shadow-xl z-20 overflow-hidden">
              <button
                onClick={() => {
                  onEdit?.(notebook);
                  setShowMenu(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-dark-700 transition-colors"
              >
                <Edit2 className="w-4 h-4 text-dark-400" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  onArchive?.(notebook);
                  setShowMenu(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-dark-700 transition-colors"
              >
                <Archive className="w-4 h-4 text-dark-400" />
                <span>Archive</span>
              </button>
              <button
                onClick={() => {
                  onDelete?.(notebook);
                  setShowMenu(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-500/10 text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default NotebookCard;
