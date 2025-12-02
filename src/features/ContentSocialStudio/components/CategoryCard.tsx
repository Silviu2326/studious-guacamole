import React from 'react';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { Card, Badge } from '../../../components/componentsreutilizables';

interface Metric {
    label: string;
    value: string | number;
}

interface CategoryCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    metrics: Metric[];
    gradient: string;
    onClick: () => void;
    badge?: string;
    className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
    title,
    description,
    icon: Icon,
    metrics,
    gradient,
    onClick,
    badge,
    className = '',
}) => {
    return (
        <Card
            className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border-0 ${className}`}
            onClick={onClick}
        >
            {/* Background Gradient */}
            <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity ${gradient}`} />

            <div className="relative p-6 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-xl ${gradient} bg-opacity-20 text-slate-700 dark:text-slate-200`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    {badge && (
                        <Badge variant="default" className="bg-rose-500 text-white border-0">
                            {badge}
                        </Badge>
                    )}
                </div>

                {/* Content */}
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                        {description}
                    </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {metrics.map((metric, index) => (
                        <div key={index} className="text-center">
                            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                {metric.value}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-500 truncate">
                                {metric.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action */}
                <div className="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Explorar
                    <ArrowRight className="w-4 h-4 ml-1" />
                </div>
            </div>
        </Card>
    );
};
