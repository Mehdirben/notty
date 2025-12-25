import { useState, useEffect } from 'react';

// Store the deferred prompt globally so it persists across component mounts
// The beforeinstallprompt event only fires once on page load, so we need to
// capture it globally and share it across all hook instances
let globalDeferredPrompt = null;

// Set up the global listener immediately when the module loads
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    globalDeferredPrompt = e;
  });

  window.addEventListener('appinstalled', () => {
    globalDeferredPrompt = null;
  });
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(globalDeferredPrompt);
  const [isInstallable, setIsInstallable] = useState(!!globalDeferredPrompt);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if running as installed PWA on iOS
    if (window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Check if we already have a deferred prompt from before this component mounted
    if (globalDeferredPrompt) {
      setDeferredPrompt(globalDeferredPrompt);
      setIsInstallable(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      globalDeferredPrompt = e;
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      globalDeferredPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return false;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setIsInstallable(false);

    return outcome === 'accepted';
  };

  // Check if it's iOS (Safari doesn't support beforeinstallprompt)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const showIOSInstall = isIOS && isSafari && !isInstalled;

  return {
    isInstallable,
    isInstalled,
    installApp,
    showIOSInstall
  };
}
