import { useEffect } from 'react';
import Sidebar from './Sidebar';
import SearchModal from './SearchModal';
import useNotebookStore from '../store/notebookStore';
import useUIStore from '../store/uiStore';

const Layout = ({ children }) => {
  const { fetchNotebooks } = useNotebookStore();
  const { sidebarOpen } = useUIStore();

  useEffect(() => {
    fetchNotebooks();
  }, [fetchNotebooks]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 text-gray-900 dark:text-white transition-colors duration-300">
      <Sidebar />
      <SearchModal />
      <main 
        className={`min-h-screen transition-all duration-300 ${
          sidebarOpen ? 'ml-[280px]' : 'ml-[72px]'
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
