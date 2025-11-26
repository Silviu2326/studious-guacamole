import React from 'react';
import { Users, Clock, Brain } from 'lucide-react';
import { ScrollableTabsLayout } from '../components/shared/ScrollableTabsLayout';
import { useFeatureFlags } from '../../../config/featureFlags';
import {
    ClientSegmentation,
    IntelligentSegmentBuilder,
    PreferredSendingSchedules,
    AIHeatMapSendingSchedules
} from '../components';

import type {
    ClientSegment,
    BulkMessage,
    PreferredSendingSchedulesDashboard,
    AIHeatMapSendingSchedulesDashboard
} from '../types';

interface AudiencePageProps {
    loading: boolean;
    clientSegments: ClientSegment[];
    bulkMessages: BulkMessage[];
    preferredSendingSchedulesDashboard?: PreferredSendingSchedulesDashboard;
    aiHeatMapSendingSchedules?: AIHeatMapSendingSchedulesDashboard;
    onBack: () => void;
}

export const AudiencePage: React.FC<AudiencePageProps> = ({
    loading,
    clientSegments,
    bulkMessages,
    preferredSendingSchedulesDashboard,
    aiHeatMapSendingSchedules,
    onBack,
}) => {
    const featureFlags = useFeatureFlags();
    const [isIntelligentBuilderOpen, setIsIntelligentBuilderOpen] = React.useState(false);

    const tabs = [
        { id: 'segmentos', label: 'Segmentación', icon: Users, anchor: '#segmentos' },
        { id: 'horarios', label: 'Horarios Preferidos', icon: Clock, anchor: '#horarios' },
    ];

    return (
        <ScrollableTabsLayout
            tabs={tabs}
            title="Audiencia & Timing"
            description="Segmenta a tus clientes con precisión y optimiza los momentos de envío para máxima conversión."
            onBack={onBack}
        >
            {/* Sección Segmentación */}
            <section id="segmentos" className="space-y-8 scroll-mt-24">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Users className="text-indigo-500" />
                        Segmentación de Clientes
                    </h2>
                    <div className="space-y-6">
                        <ClientSegmentation
                            segments={clientSegments}
                            bulkMessages={bulkMessages}
                            loading={loading}
                            className="w-full"
                            onSegmentCreate={() => {
                                if (featureFlags.advanced_segmentation) {
                                    setIsIntelligentBuilderOpen(true);
                                } else {
                                    // Fallback to basic creation logic or console log
                                    console.log('Crear segmento básico');
                                }
                            }}
                            onSegmentEdit={() => { }}
                            onSegmentDelete={() => { }}
                            onSegmentRefresh={() => { }}
                            onBulkMessageCreate={() => { }}
                            onBulkMessageEdit={() => { }}
                            onBulkMessageDelete={() => { }}
                            onBulkMessageSend={() => { }}
                        />

                        {/* Feature Flag: Intelligent Segment Builder */}
                        {featureFlags.advanced_segmentation && (
                            <>
                                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Brain className="text-indigo-600 dark:text-indigo-400" />
                                        <div>
                                            <h4 className="font-medium text-slate-900 dark:text-white">Constructor Inteligente</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Crea segmentos basados en comportamiento, adherencia y predicciones de IA.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsIntelligentBuilderOpen(true)}
                                        className="px-4 py-2 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors"
                                    >
                                        Abrir Constructor
                                    </button>
                                </div>

                                <IntelligentSegmentBuilder
                                    isOpen={isIntelligentBuilderOpen}
                                    onClose={() => setIsIntelligentBuilderOpen(false)}
                                    onSave={() => setIsIntelligentBuilderOpen(false)}
                                />
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Sección Horarios */}
            <section id="horarios" className="space-y-8 scroll-mt-24">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Clock className="text-indigo-500" />
                        Horarios Preferidos
                    </h2>
                    <div className="space-y-6">
                        {aiHeatMapSendingSchedules && (
                            <AIHeatMapSendingSchedules
                                dashboard={aiHeatMapSendingSchedules}
                                loading={loading}
                                className="w-full"
                                onPeriodChange={() => { }}
                                onApplyRecommendations={() => { }}
                            />
                        )}

                        {preferredSendingSchedulesDashboard ? (
                            <PreferredSendingSchedules
                                dashboard={preferredSendingSchedulesDashboard}
                                loading={loading}
                                className="w-full"
                                onClientScheduleCreate={() => { }}
                                onClientScheduleEdit={() => { }}
                                onClientScheduleDelete={() => { }}
                                onGroupScheduleCreate={() => { }}
                                onGroupScheduleEdit={() => { }}
                                onGroupScheduleDelete={() => { }}
                                onRuleCreate={() => { }}
                                onRuleEdit={() => { }}
                                onRuleDelete={() => { }}
                                onRuleToggle={() => { }}
                            />
                        ) : (
                            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                <p className="text-slate-500 dark:text-slate-400">No hay datos de horarios preferidos disponibles</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </ScrollableTabsLayout>
    );
};
