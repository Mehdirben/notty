import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, BookOpen } from 'lucide-react';
import useUIStore from '../store/uiStore';
import useNoteStore from '../store/noteStore';
import useBodyScrollLock from '../hooks/useBodyScrollLock';

const SearchModal = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const { isSearchOpen, setSearchOpen } = useUIStore();
  const { notes, fetchNotes } = useNoteStore();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Lock body scroll when modal is open (fixes iOS touch passthrough)
  useBodyScrollLock(isSearchOpen);

  useEffect(() => {
    if (isSearchOpen) {
      fetchNotes();
      inputRef.current?.focus();
    }
  }, [isSearchOpen, fetchNotes]);

  useEffect(() => {
    if (query.trim()) {
      const filtered = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(query.toLowerCase()) ||
          note.content?.toLowerCase().includes(query.toLowerCase()) ||
          note.tags?.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setResults(filtered.slice(0, 10));
    } else {
      setResults([]);
    }
  }, [query, notes]);

  const handleSelect = (note) => {
    navigate(`/note/${note._id}`);
    setSearchOpen(false);
    setQuery('');
  };

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.preventDefault()}
            onTouchEnd={(e) => e.stopPropagation()}
            className="modal-backdrop fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="modal-backdrop fixed inset-x-0 top-0 z-50 flex items-start justify-center pt-safe px-3 sm:px-4 pb-safe"
            style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)' }}
            onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
            onTouchStart={(e) => e.target === e.currentTarget && e.stopPropagation()}
            onTouchMove={(e) => e.target === e.currentTarget && e.preventDefault()}
          >
            <div className="modal-scroll-content bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl max-h-[85vh] sm:max-h-[70vh] flex flex-col">
              {/* Search Input */}
              <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 border-b border-gray-200 dark:border-dark-700 shrink-0">
                <Search className="w-5 h-5 text-gray-400 dark:text-dark-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search notes..."
                  className="flex-1 bg-transparent outline-none text-base sm:text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-400"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors shrink-0"
                >
                  <X className="w-5 h-5 text-gray-400 dark:text-dark-400" />
                </button>
              </div>

              {/* Results */}
              <div className="flex-1 overflow-y-auto">
                {results.length > 0 ? (
                  <div className="p-2">
                    {results.map((note) => (
                      <button
                        key={note._id}
                        onClick={() => handleSelect(note)}
                        className="w-full flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 hover:bg-gray-100 dark:hover:bg-dark-800 active:bg-gray-200 dark:active:bg-dark-700 rounded-xl transition-colors text-left"
                      >
                        <div className="p-1.5 sm:p-2 bg-gray-100 dark:bg-dark-800 rounded-lg shrink-0">
                          <FileText className="w-4 h-4 text-primary-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-sm sm:text-base text-gray-900 dark:text-white">{note.title}</p>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-dark-400">
                            <BookOpen className="w-3 h-3 shrink-0" />
                            <span className="truncate">{note.notebook?.title}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : query.trim() ? (
                  <div className="p-6 sm:p-8 text-center text-gray-500 dark:text-dark-400">
                    <p className="text-sm sm:text-base">No notes found for "{query}"</p>
                  </div>
                ) : (
                  <div className="p-6 sm:p-8 text-center text-gray-500 dark:text-dark-400">
                    <p className="text-sm sm:text-base">Start typing to search your notes</p>
                    <p className="text-xs sm:text-sm mt-2 hidden sm:block">
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-dark-800 rounded text-xs text-gray-700 dark:text-white">⌘</kbd>
                      {' + '}
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-dark-800 rounded text-xs text-gray-700 dark:text-white">K</kbd>
                      {' to open search'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
