import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Moon, Sun, LogOut, Shield, Bell } from 'lucide-react';
import Layout from '../components/Layout';
import useAuthStore from '../store/authStore';
import useUIStore from '../store/uiStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const { user, updateProfile, logout } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await updateProfile({ name, email });
    
    if (result.success) {
      toast.success('Profile updated!');
    } else {
      toast.error(result.error);
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Layout>
      <div className="min-h-screen p-8 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-100 dark:bg-dark-800 rounded-xl">
              <Settings className="w-6 h-6 text-gray-500 dark:text-dark-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          </div>
          <p className="text-gray-500 dark:text-dark-400">Manage your account and preferences.</p>
        </motion.div>

        {/* Profile Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="p-6 bg-white dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-sm dark:shadow-none">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-primary-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-gray-500 dark:text-dark-400 text-sm">{user?.email}</p>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-xl focus:outline-none focus:border-primary-500 transition-colors text-gray-900 dark:text-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-xl focus:outline-none focus:border-primary-500 transition-colors text-gray-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl font-medium text-white hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Appearance Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="p-6 bg-white dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-sm dark:shadow-none">
            <div className="flex items-center gap-3 mb-6">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-primary-500" />
              ) : (
                <Sun className="w-5 h-5 text-primary-500" />
              )}
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-900 rounded-xl">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                <p className="text-gray-500 dark:text-dark-400 text-sm">
                  {theme === 'dark' ? 'Dark mode is enabled' : 'Light mode is enabled'}
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  theme === 'dark' ? 'bg-primary-600' : 'bg-gray-300 dark:bg-dark-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                    theme === 'dark' ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Security Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="p-6 bg-white dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-sm dark:shadow-none">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-primary-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h2>
            </div>

            <button className="w-full p-4 bg-gray-50 dark:bg-dark-900 rounded-xl text-left hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors">
              <p className="font-medium text-gray-900 dark:text-white">Change Password</p>
              <p className="text-gray-500 dark:text-dark-400 text-sm">Update your password to keep your account secure</p>
            </button>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <LogOut className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold text-red-500">Danger Zone</h2>
            </div>

            <button
              onClick={handleLogout}
              className="w-full p-4 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-left transition-colors"
            >
              <p className="font-medium text-red-500">Log Out</p>
              <p className="text-red-500/70 text-sm">Sign out of your account</p>
            </button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
