import { useEffect } from 'react';

/**
 * Hook to lock body scroll when a modal is open
 * Particularly important for iOS Safari where touch events can pass through modals
 */
const useBodyScrollLock = (isLocked) => {
    useEffect(() => {
        if (!isLocked) return;

        // Store original values
        const originalStyle = window.getComputedStyle(document.body);
        const originalOverflow = originalStyle.overflow;
        const originalPosition = originalStyle.position;
        const originalTop = originalStyle.top;
        const originalWidth = originalStyle.width;
        const scrollY = window.scrollY;

        // Lock body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.touchAction = 'none';

        // Prevent touchmove on body
        const preventTouchMove = (e) => {
            // Allow scrolling inside the modal content
            if (e.target.closest('.modal-scroll-content')) {
                return;
            }
            e.preventDefault();
        };

        document.body.addEventListener('touchmove', preventTouchMove, { passive: false });

        return () => {
            // Restore original styles
            document.body.style.overflow = originalOverflow;
            document.body.style.position = originalPosition;
            document.body.style.top = originalTop;
            document.body.style.width = originalWidth;
            document.body.style.touchAction = '';

            // Remove event listener
            document.body.removeEventListener('touchmove', preventTouchMove);

            // Restore scroll position
            window.scrollTo(0, scrollY);
        };
    }, [isLocked]);
};

export default useBodyScrollLock;
