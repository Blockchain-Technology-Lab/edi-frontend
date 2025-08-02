import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Try to find the main scrollable element
            const mainElement = document.querySelector('main[class*="overflow-y-auto"]') ||
                document.querySelector('main') ||
                document.querySelector('.overflow-y-auto') ||
                document.documentElement;

            if (mainElement) {
                const scrollTop = mainElement.scrollTop || window.pageYOffset;
                setIsVisible(scrollTop > 300);
            }
        };

        // Try to attach to the correct element
        const mainElement = document.querySelector('main[class*="overflow-y-auto"]') ||
            document.querySelector('main') ||
            document.querySelector('.overflow-y-auto');

        if (mainElement) {
            mainElement.addEventListener('scroll', toggleVisibility);
            toggleVisibility(); // Check initial state

            return () => {
                mainElement.removeEventListener('scroll', toggleVisibility);
            };
        } else {
            // Fallback to window scroll
            window.addEventListener('scroll', toggleVisibility);
            toggleVisibility();

            return () => {
                window.removeEventListener('scroll', toggleVisibility);
            };
        }
    }, []);

    const scrollToTop = () => {
        // Same robust approach as Footer
        const possibleSelectors = [
            'main[class*="overflow-y-auto"]',
            'main',
            '[class*="overflow-y-auto"]',
            '.overflow-y-auto'
        ];

        let scrollableElement = null;

        for (const selector of possibleSelectors) {
            const element = document.querySelector(selector);
            if (element && element.scrollTop !== undefined) {
                scrollableElement = element;
                break;
            }
        }

        if (scrollableElement) {
            scrollableElement.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    return (
        <button
            onClick={scrollToTop}
            className={`
                fixed bottom-20 right-6 z-50 btn btn-circle btn-primary shadow-lg
                transition-all duration-300 ease-in-out
                ${isVisible
                    ? 'opacity-90 translate-y-0 hover:opacity-100 hover:scale-110'
                    : 'opacity-0 translate-y-16 pointer-events-none'
                }
            `}
            aria-label="Back to top"
            title="Back to top (Ctrl + Home)"
        >
            <ArrowUp size={20} />
        </button>
    );
}