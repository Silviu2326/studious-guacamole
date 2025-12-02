import React from 'react';
import { Card } from '../../../../components/componentsreutilizables';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
    stats?: { label: string; value: string | number }[];
    color?: 'indigo' | 'purple' | 'sky' | 'emerald' | 'orange' | 'rose';
    className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
    title,
    description,
    icon,
    onClick,
    stats = [],
    color = 'indigo',
    className = '',
}) => {
    const colorStyles = {
        indigo: 'from-indigo-500 to-blue-600',
        purple: 'from-purple-500 to-indigo-600',
        sky: 'from-sky-500 to-blue-500',
        emerald: 'from-emerald-500 to-teal-600',
        orange: 'from-orange-500 to-amber-600',
        rose: 'from-rose-500 to-pink-600',
    };

    const bgStyles = {
        indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
        purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
        sky: 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400',
        emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
        orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
        rose: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
    };

    return (
        <div
            onClick={onClick}
            className={`group cursor-pointer transition-all duration-300 hover:-translate-y-1 ${className}`}
        >
            <Card className="h-full border-slate-200 dark:border-slate-800 hover:shadow-xl dark:hover:shadow-slate-900/50 overflow-hidden relative">
                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${colorStyles[color]}`} />

                <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-xl ${bgStyles[color]} transition-colors`}>
                            {icon}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2">
                            <div className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                <ArrowRight size={20} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {stats.length > 0 && (
                        <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
                            {stats.map((stat, index) => (
                                <div key={index}>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                                        {stat.label}
                                    </p>
                                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-200">
                                        {stat.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};
