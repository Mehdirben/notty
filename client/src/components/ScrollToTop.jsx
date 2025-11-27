import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      // Scroll window
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      // Also scroll document element and body
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      // Scroll any overflow containers
      const scrollableElements = document.querySelectorAll('[class*="overflow"]');
      scrollableElements.forEach(el => {
        el.scrollTop = 0;
      });
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
