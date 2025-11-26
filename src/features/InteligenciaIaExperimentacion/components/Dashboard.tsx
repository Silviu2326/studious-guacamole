import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import {
    Target,
    BookOpen,
    FlaskConical,
    ArrowRight,
} from 'lucide-react';

export type DashboardViewType =
    | 'dashboard'
    | 'strategy'
    | 'playbooks'
    | 'growth-lab'
    | 'client-experience'
    | 'operations';

interface DashboardProps {
    onNavigate: (view: DashboardViewType) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const cards = [
        {
            id: 'strategy',
            title: 'Estrategia y Planificación',
            description: 'Define objetivos, prioriza iniciativas y visualiza el plan trimestral.',
            icon: <Target className="text-indigo-600" size={32} />,
            color: 'bg-indigo-50 border-indigo-100',
            hoverColor: 'hover:border-indigo-300',
        },
        {
            id: 'playbooks',
            title: 'Biblioteca de Playbooks',
            description: 'Accede a tus estrategias probadas y aprende de los resultados.',
            icon: <BookOpen className="text-emerald-600" size={32} />,
            color: 'bg-emerald-50 border-emerald-100',
            hoverColor: 'hover:border-emerald-300',
        },
        {
            id: 'growth-lab',
            title: 'Laboratorio de Crecimiento',
            description: 'Experimenta con nuevas ideas, analiza insights y tendencias.',
            icon: <FlaskConical className="text-amber-600" size={32} />,
            color: 'bg-amber-50 border-amber-100',
            hoverColor: 'hover:border-amber-300',
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12 text-center">
                <h1 className="text-3xl font-bold text-slate-900">Centro de Inteligencia</h1>
                <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                    Gestiona tu estrategia, experimentos y operaciones desde un solo lugar.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cards.map((card) => (
                    <Card
                        key={card.id}
                        className={`p-8 cursor-pointer transition-all duration-300 hover:shadow-lg group ${card.color} ${card.hoverColor} border-2`}
                        onClick={() => onNavigate(card.id as DashboardViewType)}
                    >
                        <div className="flex flex-col h-full">
                            <div className="mb-6 p-4 bg-white rounded-2xl w-fit shadow-sm group-hover:scale-110 transition-transform duration-300">
                                {card.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
                            <p className="text-slate-600 mb-8 flex-grow leading-relaxed">
                                {card.description}
                            </p>
                            <div className="flex items-center text-sm font-semibold text-slate-900 group-hover:translate-x-2 transition-transform duration-300">
                                Explorar sección <ArrowRight size={16} className="ml-2" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
