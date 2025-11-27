import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Home, 
  BookOpen, 
  Star, 
  Settings, 
  LogOut, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
  Moon,
  Sun
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import useNotebookStore from '../store/notebookStore';
import useUIStore from '../store/uiStore';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { notebooks } = useNotebookStore();
  const { sidebarOpen, toggleSidebar, theme, toggleTheme, setSearchOpen } = useUIStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Star className="w-5 h-5" />, label: 'Favorites', path: '/favorites' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarOpen ? 280 : 80,
          x: 0
        }}
        className={`fixed left-0 top-0 h-full bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-800 z-50 flex flex-col transition-all duration-300 ${
          !sidebarOpen ? 'items-center' : ''
        }`}
      >
        {/* Header */}
        <div className={`p-4 flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {sidebarOpen && (
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold gradient-text">Notty</span>
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-dark-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500 dark:text-dark-400" />
            )}
          </button>
        </div>

        {/* Search Button */}
        <div className={`px-4 mb-4 ${!sidebarOpen && 'px-2'}`}>
          <button
            onClick={() => setSearchOpen(true)}
            className={`flex items-center gap-3 w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 rounded-xl text-gray-500 dark:text-dark-400 transition-colors ${
              !sidebarOpen && 'justify-center px-2'
            }`}
          >
            <Search className="w-5 h-5" />
            {sidebarOpen && <span>Search notes...</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav className={`px-4 space-y-1 ${!sidebarOpen && 'px-2'}`}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary-500/20 text-primary-500' 
                    : 'text-gray-500 dark:text-dark-400 hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-gray-900 dark:hover:text-white'
                } ${!sidebarOpen && 'justify-center px-2'}`}
              >
                {item.icon}
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Notebooks Section */}
        {sidebarOpen && (
          <div className="flex-1 px-4 mt-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 dark:text-dark-500 uppercase tracking-wider">
                Notebooks
              </span>
              <Link
                to="/dashboard"
                className="p-1 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-500 dark:text-dark-400" />
              </Link>
            </div>
            <div className="space-y-1">
              {notebooks.slice(0, 8).map((notebook) => (
                <Link
                  key={notebook._id}
                  to={`/notebook/${notebook._id}`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    location.pathname === `/notebook/${notebook._id}`
                      ? 'bg-gray-100 dark:bg-dark-800 text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-dark-400 hover:bg-gray-100 dark:hover:bg-dark-800/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <span>{notebook.icon || '📓'}</span>
                  <span className="truncate text-sm">{notebook.title}</span>
                  <span className="ml-auto text-xs text-gray-400 dark:text-dark-500">{notebook.noteCount}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className={`p-4 border-t border-gray-200 dark:border-dark-800 ${!sidebarOpen && 'px-2'}`}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-3 w-full px-4 py-2.5 text-gray-500 dark:text-dark-400 hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-gray-900 dark:hover:text-white rounded-xl transition-colors mb-2 ${
              !sidebarOpen && 'justify-center px-2'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {sidebarOpen && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          {/* User Profile */}
          {sidebarOpen && (
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-sm font-semibold text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-dark-500 truncate">{user?.email}</p>
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-4 py-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors ${
              !sidebarOpen && 'justify-center px-2'
            }`}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
