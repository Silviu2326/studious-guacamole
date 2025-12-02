import React from 'react';
import { DetailViewLayout } from './DetailViewLayout';
import { FlaskConical, Radar, BarChart, Bell, BarChart3 } from 'lucide-react';
import {
    ExperimentationSection,
    InsightsSection,
    ChannelInsightsSection,
    MarketTrendsAlertsSection,
    InitiativeImpactEvaluation,
} from '../components';
import { IntelligenceOverviewResponse } from '../types';

interface GrowthLabViewProps {
    onBack: () => void;
    overview: IntelligenceOverviewResponse | null;
    trainerId?: string;
    onExperimentCreated: () => void;
    onPlaybookCreated: () => void;
}

export const GrowthLabView: React.FC<GrowthLabViewProps> = ({
    onBack,
    overview,
    trainerId,
    onExperimentCreated,
    onPlaybookCreated,
}) => {
    const [channelInsightsPeriod, setChannelInsightsPeriod] = React.useState<'7d' | '30d' | '90d'>('30d');
    const [marketTrendsPeriod, setMarketTrendsPeriod] = React.useState<'7d' | '30d' | '90d'>('30d');

    const tabs = [
        { id: 'experiments', label: 'Experimentos', icon: <FlaskConical size={16} /> },
        { id: 'insights', label: 'Insights', icon: <Radar size={16} /> },
        { id: 'channels', label: 'Canales', icon: <BarChart size={16} /> },
        { id: 'market', label: 'Mercado', icon: <Bell size={16} /> },
        { id: 'impact', label: 'Impacto', icon: <BarChart3 size={16} /> },
    ];

    return (
        <DetailViewLayout
            title="Laboratorio de Crecimiento"
            description="Experimenta, mide y descubre nuevas oportunidades"
            icon={<FlaskConical size={24} />}
            tabs={tabs}
            onBack={onBack}
        >
            <div id="experiments">
                {overview && (
                    <ExperimentationSection
                        experiments={overview.experiments}
                        trainerId={trainerId}
                        onExperimentCreated={onExperimentCreated}
                    />
                )}
            </div>
            <div id="insights">
                {overview && (
                    <InsightsSection
                        insights={overview.insights}
                        onPlaybookCreated={onPlaybookCreated}
                    />
                )}
            </div>
            <div id="channels">
                <ChannelInsightsSection
                    period={channelInsightsPeriod}
                    onPeriodChange={setChannelInsightsPeriod}
                    trainerId={trainerId}
                />
            </div>
            <div id="market">
                <MarketTrendsAlertsSection
                    period={marketTrendsPeriod}
                    onPeriodChange={setMarketTrendsPeriod}
                    trainerId={trainerId}
                />
            </div>
            <div id="impact">
                <InitiativeImpactEvaluation trainerId={trainerId} />
            </div>
        </DetailViewLayout>
    );
};
