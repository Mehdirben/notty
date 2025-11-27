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
  Search,
  Moon,
  Sun,
  MoreHorizontal
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import useNotebookStore from '../store/notebookStore';
import useUIStore from '../store/uiStore';

// Tooltip component for collapsed state
const Tooltip = ({ children, label, show }) => (
  <div className="relative group">
    {children}
    {show && (
      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 dark:bg-dark-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg">
        {label}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-dark-700" />
      </div>
    )}
  </div>
);

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
            transition={{ duration: 0.2 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarOpen ? 280 : 72,
          x: sidebarOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -280 : 0)
        }}
        transition={{ 
          duration: 0.3, 
          ease: [0.4, 0, 0.2, 1]
        }}
        className="fixed left-0 top-0 h-full bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-800 z-50 flex flex-col lg:translate-x-0 -translate-x-full data-[open=true]:translate-x-0"
        data-open={sidebarOpen}
      >
        {/* Header */}
        <div className={`flex items-center h-16 ${sidebarOpen ? 'px-4 justify-between' : 'px-0 justify-center'}`}>
          <Link to="/dashboard" className={`flex items-center ${sidebarOpen ? '' : 'justify-center'}`}>
            <motion.div 
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-primary-500/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            <AnimatePresence mode="wait">
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="text-xl font-bold gradient-text ml-3 whitespace-nowrap"
                >
                  Notty
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-5 h-5 text-gray-400 dark:text-dark-500" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Expand button when collapsed - shown below logo */}
        <AnimatePresence mode="wait">
          {!sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center pb-2"
            >
              <motion.button
                onClick={toggleSidebar}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-4 h-4 text-gray-400 dark:text-dark-500 rotate-180" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className={`mx-3 mb-3 border-t border-gray-100 dark:border-dark-800`} />

        {/* Search Button */}
        <div className={`mb-3 ${sidebarOpen ? 'px-3' : 'px-2'}`}>
          <Tooltip label="Search notes" show={!sidebarOpen}>
            <motion.button
              onClick={() => setSearchOpen(true)}
              className={`flex items-center w-full bg-gray-50 dark:bg-dark-800/50 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-xl text-gray-500 dark:text-dark-400 transition-all ${
                sidebarOpen ? 'px-3 py-2.5' : 'p-3 justify-center'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Search className={`flex-shrink-0 ${sidebarOpen ? 'w-5 h-5' : 'w-5 h-5'}`} />
              <AnimatePresence mode="wait">
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-3 whitespace-nowrap overflow-hidden text-sm"
                  >
                    Search notes...
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </Tooltip>
        </div>

        {/* Navigation */}
        <nav className={`space-y-1 ${sidebarOpen ? 'px-3' : 'px-2'}`}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Tooltip key={item.path} label={item.label} show={!sidebarOpen}>
                <Link
                  to={item.path}
                  className={`flex items-center rounded-xl transition-all ${
                    sidebarOpen ? 'px-3 py-2.5' : 'p-3 justify-center'
                  } ${
                    isActive 
                      ? 'bg-primary-500/10 text-primary-500 shadow-sm' 
                      : 'text-gray-500 dark:text-dark-400 hover:bg-gray-50 dark:hover:bg-dark-800/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <AnimatePresence mode="wait">
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-3 font-medium whitespace-nowrap overflow-hidden text-sm"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </Tooltip>
            );
          })}
        </nav>

        {/* Notebooks Section */}
        <div className="flex-1 mt-4 overflow-hidden">
          {/* Collapsed: Show notebook icons */}
          <AnimatePresence mode="wait">
            {!sidebarOpen && notebooks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-2 space-y-1"
              >
                <div className="flex justify-center py-2">
                  <span className="text-[10px] font-semibold text-gray-400 dark:text-dark-600 uppercase tracking-wider">
                    Books
                  </span>
                </div>
                {notebooks.slice(0, 5).map((notebook) => {
                  const isActive = location.pathname === `/notebook/${notebook._id}`;
                  return (
                    <Tooltip key={notebook._id} label={notebook.title} show={true}>
                      <Link
                        to={`/notebook/${notebook._id}`}
                        className={`flex items-center justify-center p-2.5 rounded-xl transition-all ${
                          isActive
                            ? 'bg-gray-100 dark:bg-dark-800'
                            : 'hover:bg-gray-50 dark:hover:bg-dark-800/50'
                        }`}
                      >
                        <span className="text-lg">{notebook.icon || '📓'}</span>
                      </Link>
                    </Tooltip>
                  );
                })}
                {notebooks.length > 5 && (
                  <Tooltip label={`${notebooks.length - 5} more notebooks`} show={true}>
                    <Link
                      to="/dashboard"
                      className="flex items-center justify-center p-2.5 rounded-xl text-gray-400 dark:text-dark-500 hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-all"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </Link>
                  </Tooltip>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expanded: Full notebook list */}
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-3 h-full overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-xs font-semibold text-gray-400 dark:text-dark-500 uppercase tracking-wider">
                    Notebooks
                  </span>
                  <Link
                    to="/dashboard"
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-400 dark:text-dark-500" />
                  </Link>
                </div>
                <div className="space-y-0.5">
                  {notebooks.slice(0, 8).map((notebook, index) => (
                    <motion.div
                      key={notebook._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15, delay: index * 0.02 }}
                    >
                      <Link
                        to={`/notebook/${notebook._id}`}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                          location.pathname === `/notebook/${notebook._id}`
                            ? 'bg-gray-100 dark:bg-dark-800 text-gray-900 dark:text-white'
                            : 'text-gray-600 dark:text-dark-400 hover:bg-gray-50 dark:hover:bg-dark-800/50 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        <span className="flex-shrink-0 text-base">{notebook.icon || '📓'}</span>
                        <span className="truncate text-sm flex-1">{notebook.title}</span>
                        <span className="text-xs text-gray-400 dark:text-dark-600 flex-shrink-0 tabular-nums">{notebook.noteCount}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-gray-100 dark:border-dark-800">
          {/* User Profile - Only when expanded */}
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="px-3 pt-3 overflow-hidden"
              >
                <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-gray-50 dark:bg-dark-800/50">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-sm font-semibold text-white flex-shrink-0 shadow-md shadow-primary-500/20">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-dark-500 truncate">{user?.email}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapsed: User avatar */}
          <AnimatePresence mode="wait">
            {!sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center pt-3"
              >
                <Tooltip label={user?.name} show={true}>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-sm font-semibold text-white shadow-md shadow-primary-500/20">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </Tooltip>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className={`p-2 space-y-1 ${!sidebarOpen && 'flex flex-col items-center'}`}>
            {/* Theme Toggle */}
            <Tooltip label={theme === 'dark' ? 'Light Mode' : 'Dark Mode'} show={!sidebarOpen}>
              <motion.button
                onClick={toggleTheme}
                className={`flex items-center text-gray-500 dark:text-dark-400 hover:bg-gray-50 dark:hover:bg-dark-800/50 hover:text-gray-900 dark:hover:text-white rounded-xl transition-all ${
                  sidebarOpen ? 'w-full px-3 py-2.5' : 'p-3 justify-center'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: theme === 'dark' ? 0 : 360 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="flex-shrink-0"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.div>
                <AnimatePresence mode="wait">
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-3 whitespace-nowrap overflow-hidden text-sm"
                    >
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </Tooltip>

            {/* Logout */}
            <Tooltip label="Logout" show={!sidebarOpen}>
              <motion.button
                onClick={handleLogout}
                className={`flex items-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all ${
                  sidebarOpen ? 'w-full px-3 py-2.5' : 'p-3 justify-center'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence mode="wait">
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-3 whitespace-nowrap overflow-hidden text-sm"
                    >
                      Logout
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </Tooltip>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
