import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Star, Search, Settings, Plus, Menu } from 'lucide-react';
import useUIStore from '../store/uiStore';

const MobileNav = () => {
  const location = useLocation();
  const { setSearchOpen, toggleSidebar } = useUIStore();

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Star, label: 'Favorites', path: '/favorites' },
    { icon: Search, label: 'Search', action: () => setSearchOpen(true) },
    { icon: Menu, label: 'Menu', action: () => toggleSidebar() },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      {/* Safe area padding for iOS */}
      <div className="bg-white/90 dark:bg-dark-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-dark-800 pb-safe">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive = item.path && location.pathname === item.path;
            const Icon = item.icon;
            
            if (item.action) {
              return (
                <motion.button
                  key={item.label}
                  onClick={item.action}
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-colors text-gray-500 dark:text-dark-400 active:bg-gray-100 dark:active:bg-dark-800"
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </motion.button>
              );
            }
            
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-colors ${
                    isActive 
                      ? 'text-primary-500 bg-primary-500/10' 
                      : 'text-gray-500 dark:text-dark-400 active:bg-gray-100 dark:active:bg-dark-800'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'text-primary-500' : ''}`} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MobileNav;
