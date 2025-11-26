import { useState, useEffect, useCallback } from 'react';

export function useScrollAnchor(anchors: string[], offset: number = 100) {
    const [activeAnchor, setActiveAnchor] = useState<string>(anchors[0]);
    const [isScrolling, setIsScrolling] = useState(false);

    const scrollToAnchor = useCallback((anchorId: string) => {
        const element = document.getElementById(anchorId.replace('#', ''));
        if (element) {
            setIsScrolling(true);
            setActiveAnchor(anchorId);

            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Reset scrolling state after animation
            setTimeout(() => setIsScrolling(false), 1000);
        }
    }, [offset]);

    useEffect(() => {
        const handleScroll = () => {
            if (isScrolling) return;

            const scrollPosition = window.scrollY + offset + 50; // Add buffer

            // Find the current section
            for (const anchor of anchors) {
                const element = document.getElementById(anchor.replace('#', ''));
                if (element) {
                    const { top, bottom } = element.getBoundingClientRect();
                    const elementTop = top + window.pageYOffset;
                    const elementBottom = bottom + window.pageYOffset;

                    if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
                        setActiveAnchor(anchor);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [anchors, offset, isScrolling]);

    return { activeAnchor, scrollToAnchor };
}
