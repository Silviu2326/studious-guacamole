import React from 'react';
import { BarChart2, Lightbulb, Settings, FileText, FlaskConical } from 'lucide-react';
import { ScrollableTabsLayout } from '../components/shared/ScrollableTabsLayout';
import { useFeatureFlags } from '../../../config/featureFlags';
import {
    SummaryGrid,
    ActionableKPIs,
    MessageStatisticsDashboard,
    WeeklyAIInsights,
    AutomationsCentralPanel,
    MessageSaturationDetector,
    ReportExporter,
    ExperimentsDashboard
} from '../components';

import type {
    MissionControlSummary,
    ActionableKPIDashboard,
    MessageStatisticsDashboard as MessageStatisticsDashboardType,
    WeeklyAIInsightsDashboard,
    CentralAutomationsPanel,
    MessageSaturationDashboard,
    ExportReport,
    ExperimentsDashboard as ExperimentsDashboardType
} from '../types';

interface InsightsPageProps {
    loading: boolean;
    summary: MissionControlSummary[];
    actionableKPIs?: ActionableKPIDashboard;
    messageStatisticsDashboard: MessageStatisticsDashboardType | null;
    weeklyAIInsights?: WeeklyAIInsightsDashboard;
    centralAutomationsPanel?: CentralAutomationsPanel;
    messageSaturationDashboard?: MessageSaturationDashboard;
    exportReports: ExportReport[];
    experimentsDashboard?: ExperimentsDashboardType;
    onBack: () => void;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({
    loading,
    summary,
    actionableKPIs,
    messageStatisticsDashboard,
    weeklyAIInsights,
    centralAutomationsPanel,
    messageSaturationDashboard,
    exportReports,
    experimentsDashboard,
    onBack,
}) => {
    const featureFlags = useFeatureFlags();

    const tabs = [
        { id: 'metricas', label: 'Métricas Clave', icon: BarChart2, anchor: '#metricas' },
        { id: 'insights', label: 'Insights Semanales', icon: Lightbulb, anchor: '#insights' },
        { id: 'control', label: 'Control Central', icon: Settings, anchor: '#control' },
        { id: 'reportes', label: 'Reportes', icon: FileText, anchor: '#reportes' },
    ];

    if (featureFlags.ab_testing) {
        tabs.push({ id: 'experimentos', label: 'Experimentos', icon: FlaskConical, anchor: '#experimentos' });
    }

    return (
        <ScrollableTabsLayout
            tabs={tabs}
            title="Insights & Control"
            description="Analiza el rendimiento de tus campañas, obtén recomendaciones inteligentes y mantén el control total."
            onBack={onBack}
        >
            {/* Sección Métricas */}
            <section id="metricas" className="space-y-8 scroll-mt-24">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <BarChart2 className="text-indigo-500" />
                        Métricas Clave
                    </h2>
                    <div className="space-y-6">
                        <SummaryGrid summary={summary} loading={loading} />

                        {actionableKPIs && (
                            <ActionableKPIs
                                dashboard={actionableKPIs}
                                loading={loading}
                                className="w-full"
                                onPeriodChange={() => { }}
                                onViewDetails={() => { }}
                                onViewCampaign={() => { }}
                            />
                        )}

                        {messageStatisticsDashboard ? (
                            <MessageStatisticsDashboard
                                dashboard={messageStatisticsDashboard}
                                loading={loading}
                                className="w-full"
                            />
                        ) : (
                            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                <p className="text-slate-500 dark:text-slate-400">No hay estadísticas disponibles</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Sección Insights */}
            <section id="insights" className="space-y-8 scroll-mt-24">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Lightbulb className="text-indigo-500" />
                        Insights Semanales
                    </h2>
                    <div className="space-y-6">
                        {weeklyAIInsights && (
                            <WeeklyAIInsights
                                dashboard={weeklyAIInsights}
                                loading={loading}
                                className="w-full"
                                onImprovementApply={() => { }}
                                onImprovementDismiss={() => { }}
                                onImprovementView={() => { }}
                                onGenerateInsights={() => { }}
                            />
                        )}
                    </div>
                </div>
            </section>

            {/* Sección Control */}
            <section id="control" className="space-y-8 scroll-mt-24">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Settings className="text-indigo-500" />
                        Control Central
                    </h2>
                    <div className="space-y-6">
                        <AutomationsCentralPanel
                            panel={centralAutomationsPanel}
                            loading={loading}
                            className="w-full"
                            onAutomationPause={() => { }}
                            onAutomationResume={() => { }}
                            onAutomationEdit={() => { }}
                            onAutomationDelete={() => { }}
                            onViewDetails={() => { }}
                        />

                        {messageSaturationDashboard && (
                            <MessageSaturationDetector
                                dashboard={messageSaturationDashboard}
                                loading={loading}
                                className="w-full"
                                onApplyPause={() => { }}
                                onDismissAlert={() => { }}
                                onSettingsEdit={() => { }}
                            />
                        )}
                    </div>
                </div>
            </section>

            {/* Sección Reportes */}
            <section id="reportes" className="space-y-8 scroll-mt-24">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <FileText className="text-indigo-500" />
                        Reportes
                    </h2>
                    <div className="space-y-6">
                        <ReportExporter
                            reports={exportReports}
                            loading={loading}
                            className="w-full"
                            onGenerateReport={() => { }}
                            onDownload={() => { }}
                        />
                    </div>
                </div>
            </section>

            {/* Feature Flag: Experiments */}
            {featureFlags.ab_testing && experimentsDashboard && (
                <section id="experimentos" className="space-y-8 scroll-mt-24">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <FlaskConical className="text-indigo-500" />
                            Experimentos A/B
                        </h2>
                        <div className="space-y-6">
                            <ExperimentsDashboard
                                dashboard={experimentsDashboard}
                                loading={loading}
                                className="w-full"
                                onExperimentCreate={() => { }}
                                onExperimentEdit={() => { }}
                                onExperimentView={() => { }}
                                onExperimentToggle={() => { }}
                            />
                        </div>
                    </div>
                </section>
            )}
        </ScrollableTabsLayout >
    );
};
