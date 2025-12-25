import { useEffect } from 'react';
import Sidebar from './Sidebar';
import SearchModal from './SearchModal';
import MobileNav from './MobileNav';
import useNotebookStore from '../store/notebookStore';
import useUIStore from '../store/uiStore';

const Layout = ({ children }) => {
  const { fetchNotebooks } = useNotebookStore();
  const { sidebarOpen, setIsMobile, setSidebarOpen } = useUIStore();

  useEffect(() => {
    fetchNotebooks();
  }, [fetchNotebooks]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile, setSidebarOpen]);

  return (
    <div className="h-screen overflow-hidden bg-gray-50 dark:bg-dark-950 text-gray-900 dark:text-white transition-colors duration-300 pt-safe flex flex-col" style={{ height: '100dvh' }}>
      <Sidebar />
      <SearchModal />
      <main
        className={`flex-1 overflow-hidden transition-all duration-300 pb-nav-safe lg:pb-0 ${sidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-[72px]'
          } ml-0`}
      >
        {children}
      </main>
      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};

export default Layout;
