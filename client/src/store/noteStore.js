import { create } from 'zustand';
import api from '../api/axios';

const useNoteStore = create((set, get) => ({
  notes: [],
  currentNote: null,
  isLoading: false,
  isSaving: false,
  error: null,

  fetchNotes: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const queryParams = new URLSearchParams(params).toString();
      const { data } = await api.get(`/notes?${queryParams}`);
      set({ notes: data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch notes', isLoading: false });
    }
  },

  getNote: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/notes/${id}`);
      set({ currentNote: data, isLoading: false });
      return data;
    } catch (error) {
      let errorMessage = 'Failed to fetch note';
      if (error.response?.status === 400 && error.response?.data?.message?.includes('Invalid note ID format')) {
        errorMessage = 'Invalid note link. The note ID format is incorrect.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Note not found. It may have been deleted or the link is incorrect.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },

  createNote: async (noteData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/notes', noteData);
      set((state) => ({
        notes: [data, ...state.notes],
        currentNote: data,
        isLoading: false
      }));
      return { success: true, note: data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create note';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  updateNote: async (id, updates) => {
    set({ isSaving: true, error: null });
    try {
      const { data } = await api.put(`/notes/${id}`, updates);
      set((state) => ({
        notes: state.notes.map((note) => note._id === id ? data : note),
        currentNote: state.currentNote?._id === id ? data : state.currentNote,
        isSaving: false
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update note';
      set({ error: message, isSaving: false });
      return { success: false, error: message };
    }
  },

  deleteNote: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/notes/${id}`);
      set((state) => ({
        notes: state.notes.filter((note) => note._id !== id),
        currentNote: state.currentNote?._id === id ? null : state.currentNote,
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete note';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  toggleFavorite: async (id) => {
    const note = get().notes.find((n) => n._id === id) || get().currentNote;
    if (!note) return;

    const newValue = !note.isFavorite;

    // Optimistic update - update UI immediately
    set((state) => ({
      notes: state.notes.map((n) =>
        n._id === id ? { ...n, isFavorite: newValue } : n
      ),
      currentNote: state.currentNote?._id === id
        ? { ...state.currentNote, isFavorite: newValue }
        : state.currentNote
    }));

    // Sync with server in background
    try {
      await api.put(`/notes/${id}`, { isFavorite: newValue });
      return { success: true };
    } catch (error) {
      // Rollback on failure
      set((state) => ({
        notes: state.notes.map((n) =>
          n._id === id ? { ...n, isFavorite: !newValue } : n
        ),
        currentNote: state.currentNote?._id === id
          ? { ...state.currentNote, isFavorite: !newValue }
          : state.currentNote,
        error: error.response?.data?.message || 'Failed to update favorite'
      }));
      return { success: false, error: error.response?.data?.message };
    }
  },

  togglePin: async (id) => {
    const note = get().notes.find((n) => n._id === id) || get().currentNote;
    if (!note) return;

    const newValue = !note.isPinned;

    // Optimistic update - update UI immediately
    set((state) => ({
      notes: state.notes.map((n) =>
        n._id === id ? { ...n, isPinned: newValue } : n
      ),
      currentNote: state.currentNote?._id === id
        ? { ...state.currentNote, isPinned: newValue }
        : state.currentNote
    }));

    // Sync with server in background
    try {
      await api.put(`/notes/${id}`, { isPinned: newValue });
      return { success: true };
    } catch (error) {
      // Rollback on failure
      set((state) => ({
        notes: state.notes.map((n) =>
          n._id === id ? { ...n, isPinned: !newValue } : n
        ),
        currentNote: state.currentNote?._id === id
          ? { ...state.currentNote, isPinned: !newValue }
          : state.currentNote,
        error: error.response?.data?.message || 'Failed to update pin'
      }));
      return { success: false, error: error.response?.data?.message };
    }
  },

  setCurrentNote: (note) => set({ currentNote: note }),
  clearCurrentNote: () => set({ currentNote: null }),
  clearError: () => set({ error: null })
}));

export default useNoteStore;
