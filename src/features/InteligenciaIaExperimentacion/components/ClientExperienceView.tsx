import React from 'react';
import { DetailViewLayout } from './DetailViewLayout';
import { Sparkles, MessageSquare, TrendingUp } from 'lucide-react';
import {
    PersonalizationEngineSection,
    FeedbackLoopSection,
    PersonalizationImpactSection,
} from '../components';
import { IntelligenceOverviewResponse } from '../types';

interface ClientExperienceViewProps {
    onBack: () => void;
    overview: IntelligenceOverviewResponse | null;
    trainerId?: string;
}

export const ClientExperienceView: React.FC<ClientExperienceViewProps> = ({
    onBack,
    overview,
    trainerId,
}) => {
    const [personalizationImpactPeriod, setPersonalizationImpactPeriod] = React.useState<
        '7d' | '30d' | '90d' | '180d' | '365d'
    >('30d');

    const tabs = [
        { id: 'personalization', label: 'Personalización', icon: <Sparkles size={16} /> },
        { id: 'feedback', label: 'Feedback', icon: <MessageSquare size={16} /> },
        { id: 'impact', label: 'Impacto', icon: <TrendingUp size={16} /> },
    ];

    return (
        <DetailViewLayout
            title="Experiencia del Cliente"
            description="Personaliza y mejora la relación con tus clientes"
            icon={<Sparkles size={24} />}
            tabs={tabs}
            onBack={onBack}
        >
            <div id="personalization">
                <PersonalizationEngineSection />
            </div>
            <div id="feedback">
                {overview && (
                    <FeedbackLoopSection feedbackLoops={overview.feedbackLoops} trainerId={trainerId} />
                )}
            </div>
            <div id="impact">
                <PersonalizationImpactSection
                    period={personalizationImpactPeriod}
                    onPeriodChange={setPersonalizationImpactPeriod}
                    trainerId={trainerId}
                />
            </div>
        </DetailViewLayout>
    );
};
