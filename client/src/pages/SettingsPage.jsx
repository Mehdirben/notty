import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Moon, Sun, LogOut, Shield, Bell, Download, Smartphone, Share, Plus, Lock, Eye, EyeOff } from 'lucide-react';
import Layout from '../components/Layout';
import useAuthStore from '../store/authStore';
import useUIStore from '../store/uiStore';
import { usePWAInstall } from '../hooks/usePWAInstall';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const { user, updateProfile, logout } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const { isInstallable, isInstalled, installApp, showIOSInstall } = usePWAInstall();
  const navigate = useNavigate();
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);

  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const handleInstallApp = async () => {
    if (showIOSInstall) {
      setShowIOSInstructions(true);
    } else if (isInstallable) {
      const installed = await installApp();
      if (installed) {
        toast.success('App installed successfully!');
      }
    }
  };

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

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsPasswordLoading(true);

    const result = await updateProfile({ password: newPassword });

    if (result.success) {
      toast.success('Password updated successfully!');
      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast.error(result.error);
    }

    setIsPasswordLoading(false);
  };

  return (
    <Layout>
      <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 lg:mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-100 dark:bg-dark-800 rounded-xl">
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-dark-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-500 dark:text-dark-400">Manage your account and preferences.</p>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 lg:mb-8"
        >
          <div className="p-4 sm:p-6 bg-white dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700 rounded-xl sm:rounded-2xl shadow-sm dark:shadow-none">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <User className="w-5 h-5 text-primary-500" />
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-xl sm:text-2xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-gray-500 dark:text-dark-400 text-xs sm:text-sm truncate">{user?.email}</p>
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
                className={`relative w-11 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-primary-600' : 'bg-gray-300 dark:bg-dark-600'
                  }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-200 ease-in-out ${theme === 'dark' ? 'left-[22px]' : 'left-0.5'
                    }`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Install App Section */}
        {(isInstallable || showIOSInstall || isInstalled) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8"
          >
            <div className="p-6 bg-white dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-sm dark:shadow-none">
              <div className="flex items-center gap-3 mb-6">
                <Smartphone className="w-5 h-5 text-primary-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Install App</h2>
              </div>

              {isInstalled ? (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <p className="font-medium text-green-600 dark:text-green-400">✓ App Installed</p>
                  <p className="text-green-600/70 dark:text-green-400/70 text-sm">Notty is installed on your device</p>
                </div>
              ) : (
                <button
                  onClick={handleInstallApp}
                  className="w-full p-4 bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-500/20 rounded-xl text-left hover:from-primary-500/20 hover:to-purple-500/20 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg">
                      <Download className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Install Notty</p>
                      <p className="text-gray-500 dark:text-dark-400 text-sm">Add to your home screen for quick access</p>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </motion.div>
        )}

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

            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full p-4 bg-gray-50 dark:bg-dark-900 rounded-xl text-left hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
            >
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

        {/* iOS Instructions Modal */}
        {showIOSInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowIOSInstructions(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Install Notty
              </h3>

              {/* iOS Safari */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-primary-500 uppercase tracking-wide mb-2">iOS (Safari)</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-sm font-bold text-primary-500">1</div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">Tap the <Share className="w-4 h-4 inline text-primary-500" /> Share button</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-sm font-bold text-primary-500">2</div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">Tap "Add to Home Screen"</p>
                  </div>
                </div>
              </div>

              {/* Android Chrome */}
              <div className="mb-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs font-semibold text-primary-500 uppercase tracking-wide mb-2">Android (Chrome)</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-sm font-bold text-primary-500">1</div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">Tap the ⋮ menu button</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-sm font-bold text-primary-500">2</div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">Tap "Install app" or "Add to Home Screen"</p>
                  </div>
                </div>
              </div>

              {/* Desktop */}
              <div className="mb-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs font-semibold text-primary-500 uppercase tracking-wide mb-2">Desktop (Chrome/Edge)</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-sm font-bold text-primary-500">1</div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">Click the install icon <Plus className="w-4 h-4 inline text-primary-500" /> in the address bar</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-sm font-bold text-primary-500">2</div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">Click "Install" in the popup</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSInstructions(false)}
                className="mt-4 w-full px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Change Password Modal */}
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-dark-800 rounded-2xl p-6 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary-500/10 rounded-lg">
                  <Lock className="w-5 h-5 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Change Password
                </h3>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-xl focus:outline-none focus:border-primary-500 transition-colors text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-500"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-xl focus:outline-none focus:border-primary-500 transition-colors text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-500"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-dark-400">
                  Password must be at least 6 characters long
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 rounded-xl hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPasswordLoading}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-50"
                  >
                    {isPasswordLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default SettingsPage;
