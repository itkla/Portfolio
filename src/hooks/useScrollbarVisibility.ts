import { useEffect, useRef } from 'react';

export function useScrollbarVisibility() {
    const scrollableRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const element = scrollableRef.current;
        if (!element) return;

        const handleScroll = () => {
            element.classList.add('scrolling');
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                element.classList.remove('scrolling');
            }, 1000);
        };

        element.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            element.removeEventListener('scroll', handleScroll);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return scrollableRef;
}
