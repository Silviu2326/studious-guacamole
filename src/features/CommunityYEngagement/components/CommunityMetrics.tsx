import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import {
    MessageSquare,
    TrendingUp,
    Star,
    Users,
    Clock,
    BarChart3
} from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    icon: React.ReactNode;
    color: 'blue' | 'purple' | 'green' | 'indigo' | 'orange';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, icon, color }) => {
    const colorStyles = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
        green: 'bg-green-50 text-green-600 border-green-100',
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        orange: 'bg-orange-50 text-orange-600 border-orange-100',
    };

    return (
        <Card className="p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trend.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {trend.isPositive ? '+' : '-'}{trend.value}%
                        <TrendingUp size={12} className={trend.isPositive ? '' : 'rotate-180'} />
                    </div>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
        </Card>
    );
};

export const CommunityMetrics: React.FC = () => {
    // Mock data - en el futuro vendrá de la API
    const metrics = [
        {
            title: 'Testimonios Recibidos',
            value: '24',
            trend: { value: 12, isPositive: true },
            icon: <Star size={20} />,
            color: 'purple' as const
        },
        {
            title: 'Encuestas Activas',
            value: '3',
            icon: <BarChart3 size={20} />,
            color: 'blue' as const
        },
        {
            title: 'Tasa de Respuesta',
            value: '68%',
            trend: { value: 5, isPositive: true },
            icon: <Users size={20} />,
            color: 'indigo' as const
        },
        {
            title: 'Tiempo Respuesta',
            value: '2.4h',
            trend: { value: 15, isPositive: true }, // Positivo porque mejoró (bajó) o subió? Asumimos mejora en contexto de UI verde
            icon: <Clock size={20} />,
            color: 'orange' as const
        },
        {
            title: 'Engagement Score',
            value: '8.5',
            trend: { value: 3, isPositive: true },
            icon: <MessageSquare size={20} />,
            color: 'green' as const
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {metrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
            ))}
        </div>
    );
};
