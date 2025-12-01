import React from 'react';
import { DetailViewLayout } from './DetailViewLayout';
import { BookOpen, Sparkles } from 'lucide-react';
import { PlaybookLibrary, PlaybookLearningInsights } from '../components';
import { IntelligenceOverviewResponse } from '../types';

interface PlaybooksViewProps {
    onBack: () => void;
    overview: IntelligenceOverviewResponse | null;
    trainerId?: string;
    onPlaybookCreated: () => void;
}

export const PlaybooksView: React.FC<PlaybooksViewProps> = ({
    onBack,
    overview,
    trainerId,
    onPlaybookCreated,
}) => {
    const tabs = [
        { id: 'library', label: 'Biblioteca', icon: <BookOpen size={16} /> },
        { id: 'learning', label: 'Aprendizaje IA', icon: <Sparkles size={16} /> },
    ];

    return (
        <DetailViewLayout
            title="Biblioteca de Playbooks"
            description="Gestiona y optimiza tus estrategias probadas"
            icon={<BookOpen size={24} />}
            tabs={tabs}
            onBack={onBack}
        >
            <div id="library">
                {overview && (
                    <PlaybookLibrary
                        playbooks={overview.playbooks}
                        onPlaybookCreated={onPlaybookCreated}
                    />
                )}
            </div>
            <div id="learning">
                <PlaybookLearningInsights trainerId={trainerId} />
            </div>
        </DetailViewLayout>
    );
};
