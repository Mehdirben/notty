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
      set({ error: error.response?.data?.message || 'Failed to fetch note', isLoading: false });
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
    if (note) {
      return get().updateNote(id, { isFavorite: !note.isFavorite });
    }
  },

  togglePin: async (id) => {
    const note = get().notes.find((n) => n._id === id) || get().currentNote;
    if (note) {
      return get().updateNote(id, { isPinned: !note.isPinned });
    }
  },

  setCurrentNote: (note) => set({ currentNote: note }),
  clearCurrentNote: () => set({ currentNote: null }),
  clearError: () => set({ error: null })
}));

export default useNoteStore;
