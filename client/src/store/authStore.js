import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('notty_user')) || null,
  token: localStorage.getItem('notty_token') || null,
  isAuthenticated: !!localStorage.getItem('notty_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('notty_token', data.token);
      localStorage.setItem('notty_user', JSON.stringify(data));
      set({ user: data, token: data.token, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('notty_token', data.token);
      localStorage.setItem('notty_user', JSON.stringify(data));
      set({ user: data, token: data.token, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  logout: () => {
    localStorage.removeItem('notty_token');
    localStorage.removeItem('notty_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateProfile: async (updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.put('/auth/profile', updates);
      localStorage.setItem('notty_user', JSON.stringify(data));
      set({ user: data, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  clearError: () => set({ error: null })
}));

export default useAuthStore;
