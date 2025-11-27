import { create } from 'zustand';

// Check if we're on mobile
const isMobile = () => window.innerWidth < 1024;

const useUIStore = create((set) => ({
  sidebarOpen: !isMobile(), // Closed by default on mobile
  isMobile: isMobile(),
  theme: localStorage.getItem('notty_theme') || 'dark',
  searchQuery: '',
  isSearchOpen: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setIsMobile: (mobile) => set({ isMobile: mobile }),
  
  setTheme: (theme) => {
    localStorage.setItem('notty_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },
  
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('notty_theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { theme: newTheme };
    });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  setSearchOpen: (open) => set({ isSearchOpen: open })
}));

// Initialize theme on load
const initTheme = () => {
  const theme = localStorage.getItem('notty_theme') || 'dark';
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  }
};
initTheme();

export default useUIStore;
