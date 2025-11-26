import React from 'react';
import { useScrollAnchor } from './useScrollAnchor';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../../components/componentsreutilizables';

interface ScrollableTabsLayoutProps {
    tabs: {
        id: string;
        label: string;
        icon?: React.ElementType;
        anchor: string;
    }[];
    children: React.ReactNode;
    title: string;
    description?: string;
    onBack: () => void;
    actions?: React.ReactNode;
}

export const ScrollableTabsLayout: React.FC<ScrollableTabsLayoutProps> = ({
    tabs,
    children,
    title,
    description,
    onBack,
    actions,
}) => {
    const anchors = tabs.map(t => t.anchor);
    const { activeAnchor, scrollToAnchor } = useScrollAnchor(anchors, 180);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050b16] pb-20">
            {/* Header Sticky */}
            <div className="sticky top-0 z-40 bg-white/90 dark:bg-[#050b16]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-4">
                        <div className="flex items-center gap-4 mb-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onBack}
                                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                            >
                                <ArrowLeft size={18} className="mr-2" />
                                Volver
                            </Button>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
                                {description && (
                                    <p className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
                                        {description}
                                    </p>
                                )}
                            </div>
                            {actions && <div className="flex items-center gap-2">{actions}</div>}
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
                            {tabs.map((tab) => {
                                const isActive = activeAnchor === tab.anchor;
                                const Icon = tab.icon;

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => scrollToAnchor(tab.anchor)}
                                        className={`
                      flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                      ${isActive
                                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 ring-1 ring-indigo-200 dark:ring-indigo-700'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800'
                                            }
                    `}
                                    >
                                        {Icon && <Icon size={16} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'opacity-70'} />}
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-12">
                    {children}
                </div>
            </div>
        </div>
    );
};
