import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share, Plus } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export default function InstallPrompt() {
  const { isInstallable, isInstalled, installApp, showIOSInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  // Don't show if already installed or dismissed
  if (isInstalled || dismissed) return null;

  // Don't show if not installable and not iOS
  if (!isInstallable && !showIOSInstall) return null;

  const handleInstall = async () => {
    if (showIOSInstall) {
      setShowIOSInstructions(true);
    } else {
      const installed = await installApp();
      if (installed) {
        setDismissed(true);
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-80 z-50"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Install Notty
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  Add to your home screen for a better experience
                </p>
              </div>
              <button
                onClick={() => setDismissed(true)}
                className="flex-shrink-0 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setDismissed(true)}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Not now
              </button>
              <button
                onClick={handleInstall}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-xl transition-colors"
              >
                Install
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* iOS Instructions Modal */}
      <AnimatePresence>
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
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Install on iOS
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                    <Share className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      1. Tap the Share button
                    </p>
                    <p className="text-xs text-slate-500">
                      In Safari's toolbar at the bottom
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                    <Plus className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      2. Tap "Add to Home Screen"
                    </p>
                    <p className="text-xs text-slate-500">
                      Scroll down in the share menu
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="mt-6 w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
