import { useEffect } from 'react';

/**
 * Hook to lock body scroll when a modal is open
 * Simplified approach that works better on iOS without shifting fixed elements
 */
const useBodyScrollLock = (isLocked) => {
    useEffect(() => {
        if (!isLocked) return;

        // Simple overflow hidden approach - doesn't shift fixed elements
        const originalOverflow = document.body.style.overflow;
        const originalTouchAction = document.body.style.touchAction;

        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';

        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.touchAction = originalTouchAction;
        };
    }, [isLocked]);
};

export default useBodyScrollLock;
