import React, { useEffect, useState } from 'react';
import { Button } from '../../../components/componentsreutilizables';
import { ArrowLeft } from 'lucide-react';

// Simple utility for class names since lib/utils is missing
function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

interface TabItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
}

interface DetailViewLayoutProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    tabs: TabItem[];
    activeTabId?: string;
    onBack: () => void;
    children: React.ReactNode;
}

export const DetailViewLayout: React.FC<DetailViewLayoutProps> = ({
    title,
    description,
    icon,
    tabs,
    onBack,
    children,
}) => {
    const [activeSection, setActiveSection] = useState<string>(tabs[0]?.id || '');

    // Handle scroll to update active tab
    useEffect(() => {
        const handleScroll = () => {
            const sections = tabs.map((tab) => document.getElementById(tab.id));
            const scrollPosition = window.scrollY + 200; // Offset for sticky header

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(tabs[i].id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [tabs]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Header height
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
            setActiveSection(id);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onBack}
                                className="text-slate-500 hover:text-slate-900 -ml-2"
                            >
                                <ArrowLeft size={20} />
                                <span className="sr-only">Volver</span>
                            </Button>
                            <div className="h-6 w-px bg-slate-200" />
                            <div className="flex items-center gap-3">
                                {icon && <div className="text-indigo-600">{icon}</div>}
                                <div>
                                    <h1 className="text-lg font-semibold text-slate-900 leading-none">{title}</h1>
                                    {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5 -mx-4 px-4 sm:mx-0 sm:px-0">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => scrollToSection(tab.id)}
                                className={cn(
                                    'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                                    activeSection === tab.id
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                )}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-12">
                    {React.Children.map(children, (child) => {
                        if (React.isValidElement(child) && child.props.id) {
                            return (
                                <section id={child.props.id} className="scroll-mt-32">
                                    {child}
                                </section>
                            );
                        }
                        return child;
                    })}
                </div>
            </div>
        </div>
    );
};
