import React from 'react';
import { DetailViewLayout } from './DetailViewLayout';
import { Target, Calendar, BarChart3, Layers } from 'lucide-react';
import {
    AIOverviewSection,
    AIPrioritizationSection,
    QuarterlyPlanSection,
    MonthlyRetrospectiveSection,
    IntegratedAIPatternsSection,
} from '../components';

interface StrategyViewProps {
    onBack: () => void;
    trainerId?: string;
}

export const StrategyView: React.FC<StrategyViewProps> = ({ onBack, trainerId }) => {
    const [aiOverviewPeriod, setAiOverviewPeriod] = React.useState<'7d' | '30d' | '90d'>('30d');
    const [aiPrioritizationPeriod, setAiPrioritizationPeriod] = React.useState<'7d' | '30d' | '90d'>('30d');
    const [integratedAIViewPeriod, setIntegratedAIViewPeriod] = React.useState<'7d' | '30d' | '90d'>('30d');

    const tabs = [
        { id: 'ai-overview', label: 'Overview IA', icon: <BarChart3 size={16} /> },
        { id: 'ai-prioritization', label: 'Priorización', icon: <Target size={16} /> },
        { id: 'quarterly-plan', label: 'Plan Trimestral', icon: <Calendar size={16} /> },
        { id: 'monthly-retrospective', label: 'Retrospectiva', icon: <Calendar size={16} /> },
        { id: 'integrated-ai-view', label: 'Patrones IA', icon: <Layers size={16} /> },
    ];

    return (
        <DetailViewLayout
            title="Estrategia y Planificación"
            description="Define el rumbo de tu negocio con ayuda de la IA"
            icon={<Target size={24} />}
            tabs={tabs}
            onBack={onBack}
        >
            <div id="ai-overview">
                <AIOverviewSection
                    period={aiOverviewPeriod}
                    onPeriodChange={setAiOverviewPeriod}
                />
            </div>
            <div id="ai-prioritization">
                <AIPrioritizationSection
                    period={aiPrioritizationPeriod}
                    onPeriodChange={setAiPrioritizationPeriod}
                    trainerId={trainerId}
                />
            </div>
            <div id="quarterly-plan">
                <QuarterlyPlanSection trainerId={trainerId} />
            </div>
            <div id="monthly-retrospective">
                <MonthlyRetrospectiveSection trainerId={trainerId} />
            </div>
            <div id="integrated-ai-view">
                <IntegratedAIPatternsSection
                    period={integratedAIViewPeriod}
                    onPeriodChange={setIntegratedAIViewPeriod}
                    trainerId={trainerId}
                />
            </div>
        </DetailViewLayout>
    );
};
