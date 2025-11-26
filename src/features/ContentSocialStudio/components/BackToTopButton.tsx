import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';

export const BackToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div
            className={`fixed bottom-8 right-8 z-50 transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
                }`}
        >
            <Button
                onClick={scrollToTop}
                variant="primary"
                size="sm"
                className="rounded-full shadow-lg hover:shadow-xl bg-indigo-600 hover:bg-indigo-700 text-white"
            >
                <ArrowUp className="w-5 h-5" />
            </Button>
        </div>
    );
};
