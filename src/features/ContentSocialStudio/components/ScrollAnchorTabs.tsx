import { useEffect, useState } from 'react';

interface Tab {
    id: string;
    label: string;
}

interface ScrollAnchorTabsProps {
    tabs: Tab[];
    className?: string;
    offset?: number;
}

export const ScrollAnchorTabs = ({
    tabs,
    className,
    offset = 100, // Default offset for sticky headers
}: ScrollAnchorTabsProps) => {
    const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id);

    const handleTabClick = (tabId: string) => {
        const element = document.getElementById(tabId);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
            setActiveTab(tabId);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + offset + 50; // Add some buffer

            for (const tab of tabs) {
                const element = document.getElementById(tab.id);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (
                        scrollPosition >= offsetTop &&
                        scrollPosition < offsetTop + offsetHeight
                    ) {
                        setActiveTab(tab.id);
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [tabs, offset]);

    return (
        <div className={`sticky top-[73px] z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 transition-all duration-200 ${className || ''}`}>
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="-mb-px flex space-x-8 overflow-x-auto no-scrollbar" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id
                                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
};

