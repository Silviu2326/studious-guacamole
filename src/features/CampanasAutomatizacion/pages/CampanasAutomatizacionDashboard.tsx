import React from 'react';
import { Layers3, Workflow, FileText, Users, BarChart2 } from 'lucide-react';
import { FeatureCard } from '../components/shared/FeatureCard';
import { MissionControlSummary } from '../types';

interface CampanasAutomatizacionDashboardProps {
    summary: MissionControlSummary[];
    onNavigate: (view: 'campaigns' | 'journeys' | 'content' | 'audience' | 'insights') => void;
}

export const CampanasAutomatizacionDashboard: React.FC<CampanasAutomatizacionDashboardProps> = ({
    summary,
    onNavigate,
}) => {
    // Helper to get stats from summary if available
    // Assuming summary has some structure, but for now we'll mock or extract if possible
    // The original summary type is MissionControlSummary[].

    const getStat = (label: string) => {
        // Placeholder logic - in real implementation we'd parse summary
        return '0';
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050b16] p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Campañas & Automatización
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-3xl text-lg">
                        Gestiona todo el ciclo de vida de tus clientes, desde la captación hasta la fidelización,
                        con herramientas potentes de automatización y análisis.
                    </p>
                </div>

                {/* Grid de Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* 1. Campañas & Envíos */}
                    <FeatureCard
                        title="Campañas & Envíos"
                        description="Gestiona emails, mensajes programados y campañas multicanal."
                        icon={<Layers3 size={24} />}
                        color="indigo"
                        onClick={() => onNavigate('campaigns')}
                        stats={[
                            { label: 'Activas', value: '3' }, // Placeholder
                            { label: 'Programadas', value: '5' }
                        ]}
                    />

                    {/* 2. Journeys & Automatizaciones */}
                    <FeatureCard
                        title="Journeys & Auto"
                        description="Diseña secuencias automáticas y flujos de vida del cliente."
                        icon={<Workflow size={24} />}
                        color="purple"
                        onClick={() => onNavigate('journeys')}
                        stats={[
                            { label: 'Activos', value: '8' },
                            { label: 'Triggers', value: '12' }
                        ]}
                    />

                    {/* 3. Contenido & Assets */}
                    <FeatureCard
                        title="Contenido & Assets"
                        description="Biblioteca de plantillas, generador IA y recursos creativos."
                        icon={<FileText size={24} />}
                        color="sky"
                        onClick={() => onNavigate('content')}
                        stats={[
                            { label: 'Plantillas', value: '24' },
                            { label: 'Assets', value: '156' }
                        ]}
                    />

                    {/* 4. Audiencia & Timing */}
                    <FeatureCard
                        title="Audiencia & Timing"
                        description="Segmentación inteligente y optimización de horarios de envío."
                        icon={<Users size={24} />}
                        color="emerald"
                        onClick={() => onNavigate('audience')}
                        stats={[
                            { label: 'Segmentos', value: '6' },
                            { label: 'Total', value: '1.2k' }
                        ]}
                    />

                    {/* 5. Insights & Control */}
                    <FeatureCard
                        title="Insights & Control"
                        description="Métricas clave, reportes y panel de control centralizado."
                        icon={<BarChart2 size={24} />}
                        color="orange"
                        onClick={() => onNavigate('insights')}
                        stats={[
                            { label: 'Open Rate', value: '24%' },
                            { label: 'ROI', value: '3.5x' }
                        ]}
                    />

                </div>

                {/* Quick Actions (Optional, as per plan) */}
                <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                        Acceso Rápido
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            + Nueva Campaña
                        </button>
                        <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            + Nuevo Journey
                        </button>
                        <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            Ver Reporte Semanal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
