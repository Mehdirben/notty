import { create } from 'zustand';
import api from '../api/axios';

const useNotebookStore = create((set, get) => ({
  notebooks: [],
  currentNotebook: null,
  isLoading: false,
  error: null,

  fetchNotebooks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/notebooks');
      set({ notebooks: data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch notebooks', isLoading: false });
    }
  },

  getNotebook: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/notebooks/${id}`);
      set({ currentNotebook: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch notebook', isLoading: false });
      return null;
    }
  },

  createNotebook: async (notebookData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/notebooks', notebookData);
      set((state) => ({ 
        notebooks: [{ ...data, noteCount: 0 }, ...state.notebooks], 
        isLoading: false 
      }));
      return { success: true, notebook: data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create notebook';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  updateNotebook: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.put(`/notebooks/${id}`, updates);
      set((state) => ({
        notebooks: state.notebooks.map((nb) => 
          nb._id === id ? { ...data, noteCount: nb.noteCount } : nb
        ),
        currentNotebook: state.currentNotebook?._id === id ? data : state.currentNotebook,
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update notebook';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  deleteNotebook: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/notebooks/${id}`);
      set((state) => ({
        notebooks: state.notebooks.filter((nb) => nb._id !== id),
        currentNotebook: state.currentNotebook?._id === id ? null : state.currentNotebook,
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete notebook';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  setCurrentNotebook: (notebook) => set({ currentNotebook: notebook }),
  clearError: () => set({ error: null })
}));

export default useNotebookStore;
