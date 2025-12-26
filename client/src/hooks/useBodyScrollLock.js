import { useEffect } from 'react';

/**
 * Hook to lock body scroll when a modal is open
 * Uses CSS class-based approach for iOS Safari compatibility
 */
const useBodyScrollLock = (isLocked) => {
    useEffect(() => {
        if (!isLocked) return;

        // Store scroll position
        const scrollY = window.scrollY;

        // Add class to body to lock scroll
        document.body.classList.add('modal-open');
        document.body.style.top = `-${scrollY}px`;

        return () => {
            // Remove class and restore scroll position
            document.body.classList.remove('modal-open');
            document.body.style.top = '';
            window.scrollTo(0, scrollY);
        };
    }, [isLocked]);
};

export default useBodyScrollLock;
