import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Layout from '../components/Layout';
import NoteCard from '../components/NoteCard';
import useNoteStore from '../store/noteStore';
import toast from 'react-hot-toast';

const FavoritesPage = () => {
  const { notes, fetchNotes, toggleFavorite, togglePin, deleteNote } = useNoteStore();

  useEffect(() => {
    fetchNotes({ favorite: 'true' });
  }, [fetchNotes]);

  const handleDeleteNote = async (id) => {
    if (window.confirm('Delete this note?')) {
      const result = await deleteNote(id);
      if (result.success) {
        toast.success('Note deleted');
        fetchNotes({ favorite: 'true' });
      } else {
        toast.error(result.error);
      }
    }
  };

  const handleToggleFavorite = async (id) => {
    await toggleFavorite(id);
    fetchNotes({ favorite: 'true' });
  };

  return (
    <Layout>
      <div className="min-h-screen p-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500/20 rounded-xl">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </div>
            <h1 className="text-3xl font-bold">Favorites</h1>
          </div>
          <p className="text-dark-400">Your starred notes for quick access.</p>
        </motion.div>

        {/* Notes Grid */}
        {notes.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {notes.map((note, index) => (
              <NoteCard
                key={note._id}
                note={note}
                index={index}
                onToggleFavorite={handleToggleFavorite}
                onTogglePin={togglePin}
                onDelete={handleDeleteNote}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-dark-800 flex items-center justify-center">
              <Star className="w-8 h-8 text-dark-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
            <p className="text-dark-400">
              Star notes to add them to your favorites for quick access.
            </p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default FavoritesPage;
