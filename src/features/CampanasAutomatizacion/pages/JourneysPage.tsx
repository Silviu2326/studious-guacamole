import React from 'react';
import { Workflow, MessageSquare, Clock, Bell, Link, Activity } from 'lucide-react';
import { ScrollableTabsLayout } from '../components/shared/ScrollableTabsLayout';
import { useFeatureFlags } from '../../../config/featureFlags';
import {
    WelcomeSequences,
    LifecycleSequences,
    MultiStepSequenceBuilder,
    MessagingAutomations,
    ClientActionTriggers,
    InactivityAutomations,
    AbsenceAutomations,
    AfterHoursAutoReplyComponent,
    SessionReminders,
    AIReminderAutomationComponent,
    PaymentReminderAutomations,
    ImportantDateAutomations,
    ReservationsIntegration,
    AutomationRoadmap,
    ChannelHealth,
    MessageAlerts,
    JourneyGapDetector,
    ChannelRecommendations
} from '../components';

import type {
    WelcomeSequence,
    LifecycleSequence,
    PostLeadMagnetSequence,
    LeadMagnetFunnel,
    MultiStepSequence,
    MessagingAutomation,
    ClientActionTriggersDashboard,
    InactivityAutomation,
    AbsenceAutomation,
    AfterHoursAutoReply,
    SessionReminderTemplate,
    ClientReminderSettings,
    SessionReminder,
    AIReminderAutomationDashboard,
    PaymentReminderAutomation,
    ImportantDateAutomation,
    ReservationsIntegration as ReservationsIntegrationType,
    AutomationRoadmapItem,
    ChannelHealthMetric,
    MessageAlertsDashboard,
    JourneyGapDetectorDashboard,
    ChannelRecommendationsDashboard
} from '../types';

interface JourneysPageProps {
    loading: boolean;
    welcomeSequences: WelcomeSequence[];
    sequences: LifecycleSequence[];
    postLeadMagnetSequences: PostLeadMagnetSequence[];
    leadMagnetFunnels: LeadMagnetFunnel[];
    multiStepSequences: MultiStepSequence[];
    automations: MessagingAutomation[];
    clientActionTriggers?: ClientActionTriggersDashboard;
    inactivityAutomations: InactivityAutomation[];
    absenceAutomations: AbsenceAutomation[];
    afterHoursAutoReplies: AfterHoursAutoReply[];
    reminderTemplates: SessionReminderTemplate[];
    clientReminderSettings: ClientReminderSettings[];
    upcomingReminders: SessionReminder[];
    aiReminderAutomation?: AIReminderAutomationDashboard;
    paymentReminderAutomations: PaymentReminderAutomation[];
    importantDateAutomations: ImportantDateAutomation[];
    reservationsIntegration?: ReservationsIntegrationType;
    roadmap: AutomationRoadmapItem[];
    health: ChannelHealthMetric[];
    messageAlertsDashboard?: MessageAlertsDashboard;
    journeyGapDetectorDashboard?: JourneyGapDetectorDashboard;
    channelRecommendationsDashboard?: ChannelRecommendationsDashboard;
    onBack: () => void;
}

export const JourneysPage: React.FC<JourneysPageProps> = ({
    loading,
    welcomeSequences,
    sequences,
    postLeadMagnetSequences,
    leadMagnetFunnels,
    multiStepSequences,
    automations,
    clientActionTriggers,
    inactivityAutomations,
    absenceAutomations,
    afterHoursAutoReplies,
    reminderTemplates,
    clientReminderSettings,
    upcomingReminders,
    aiReminderAutomation,
    paymentReminderAutomations,
    importantDateAutomations,
    reservationsIntegration,
    roadmap,
    health,
    messageAlertsDashboard,
    journeyGapDetectorDashboard,
    channelRecommendationsDashboard,
    onBack,
}) => {
    const featureFlags = useFeatureFlags();

    const tabs = [
        { id: 'lifecycle', label: 'Lifecycle', icon: Workflow, anchor: '#lifecycle' },
        { id: 'messaging', label: 'Mensajería', icon: MessageSquare, anchor: '#messaging' },
        { id: 'contexto', label: 'Contexto', icon: Clock, anchor: '#contexto' },
        { id: 'recordatorios', label: 'Recordatorios', icon: Bell, anchor: '#recordatorios' },
        { id: 'integraciones', label: 'Integraciones', icon: Link, anchor: '#integraciones' },
        { id: 'monitoreo', label: 'Monitoreo', icon: Activity, anchor: '#monitoreo' },
    ];

    return (
        <ScrollableTabsLayout
            tabs={tabs}
            title="Journeys & Automatizaciones"
            description="Diseña y supervisa el viaje del cliente con secuencias automatizadas y respuestas inteligentes."
            onBack={onBack}
        >
            {/* Sección Lifecycle */}
            <section id="lifecycle" className="space-y-8 scroll-mt-24">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Workflow className="text-indigo-500" />
                        Secuencias de Lifecycle
                    </h2>
                    <div className="space-y-6">
                        {/* Feature Flag: Journey Gap Detector */}
                        {featureFlags.journey_gaps && journeyGapDetectorDashboard && (
                            <JourneyGapDetector
                                dashboard={journeyGapDetectorDashboard}
                                loading={loading}
                                className="w-full"
                                onGapAccept={() => { }}
                                onGapReject={() => { }}
                                onGapAutoFill={() => { }}
                                onGapDismiss={() => { }}
                                onViewGap={() => { }}
                                onSettingsEdit={() => { }}
                            />
                        )}

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <WelcomeSequences sequences={welcomeSequences} loading={loading} className="w-full" />
                            <LifecycleSequences
                                sequences={sequences}
                                postLeadMagnetSequences={postLeadMagnetSequences}
                                leadMagnetFunnels={leadMagnetFunnels}
                                loading={loading}
                                className="w-full"
                                onGeneratePostLeadMagnetSequence={() => { }}
                                onEditPostLeadMagnetSequence={() => { }}
                                onViewPostLeadMagnetSequence={() => { }}
                            />
                        </div>

                        <MultiStepSequenceBuilder
                            sequences={multiStepSequences}
                            loading={loading}
                            className="w-full"
                            onCreateNew={() => { }}
                            onEdit={() => { }}
                            onPause={() => { }}
                            onResume={() => { }}
                        />
                    </div>
                </div>
            </section>

            {/* Sección Mensajería */}
            <section id="messaging" className="space-y-8 scroll-mt-24">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <MessageSquare className="text-indigo-500" />
                        Automatizaciones de Mensajería
                    </h2>
                    <div className="space-y-6">
                        <MessagingAutomations automations={automations} loading={loading} className="w-full" />

                        <ClientActionTriggers
                            dashboard={clientActionTriggers}
                            loading={loading}
                            className="w-full"
                            onTriggerCreate={() => { }}
                            onTriggerEdit={() => { }}
                            onTriggerDelete={() => { }}
                            onTriggerToggle={() => { }}
                            onViewEvent={() => { }}
                        />

                        {/* Feature Flag: Channel Recommendations */}
                        {featureFlags.channel_recommendations && channelRecommendationsDashboard && (
                            <ChannelRecommendations
                                dashboard={channelRecommendationsDashboard}
                                loading={loading}
                                className="w-full"
                                onRecommendationAccept={() => { }}
                                onRecommendationReject={() => { }}
                                onRecommendationDismiss={() => { }}
                                onViewRecommendation={() => { }}
                                onStartImplementation={() => { }}
                                onSettingsEdit={() => { }}
                            />
                        )}
                    </div>
                </div>
            </section>

            {/* Sección Contexto */}
            <section id="contexto" className="space-y-8 scroll-mt-24">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Clock className="text-indigo-500" />
                        Automatizaciones de Contexto
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <InactivityAutomations automations={inactivityAutomations} loading={loading} className="w-full" />
                        <AbsenceAutomations automations={absenceAutomations} loading={loading} className="w-full" />
                        <AfterHoursAutoReplyComponent
                            autoReplies={afterHoursAutoReplies}
                            loading={loading}
                            className="w-full"
                            onAutoReplyCreate={() => { }}
                            onAutoReplyEdit={() => { }}
                            onAutoReplyDelete={() => { }}
                            onAutoReplyToggle={() => { }}
                        />
                    </div>
                </div>
            </section>

            {/* Sección Recordatorios */}
            <section id="recordatorios" className="space-y-8 scroll-mt-24">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Bell className="text-indigo-500" />
                        Recordatorios
                    </h2>
                    <div className="space-y-6">
                        <SessionReminders
                            templates={reminderTemplates}
                            clientSettings={clientReminderSettings}
                            upcomingReminders={upcomingReminders}
                            loading={loading}
                            className="w-full"
                            onTemplateCreate={() => { }}
                            onTemplateEdit={() => { }}
                            onTemplateDelete={() => { }}
                            onTemplateToggle={() => { }}
                            onClientToggle={() => { }}
                        />

                        <AIReminderAutomationComponent
                            dashboard={aiReminderAutomation}
                            loading={loading}
                            className="w-full"
                            onAutomationCreate={() => { }}
                            onAutomationEdit={() => { }}
                            onAutomationDelete={() => { }}
                            onAutomationToggle={() => { }}
                            onViewReminder={() => { }}
                        />

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <PaymentReminderAutomations automations={paymentReminderAutomations} loading={loading} className="w-full" />
                            <ImportantDateAutomations automations={importantDateAutomations} loading={loading} className="w-full" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección Integraciones */}
            <section id="integraciones" className="space-y-8 scroll-mt-24">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Link className="text-indigo-500" />
                        Integraciones
                    </h2>
                    <div className="space-y-6">
                        <ReservationsIntegration
                            integration={reservationsIntegration}
                            loading={loading}
                            className="w-full"
                            onRuleCreate={() => { }}
                            onRuleEdit={() => { }}
                            onRuleDelete={() => { }}
                            onRuleToggle={() => { }}
                            onIntegrationToggle={() => { }}
                            onSync={() => { }}
                        />
                    </div>
                </div>
            </section>

            {/* Sección Monitoreo */}
            <section id="monitoreo" className="space-y-8 scroll-mt-24">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Activity className="text-indigo-500" />
                        Monitoreo
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <AutomationRoadmap items={roadmap} loading={loading} className="w-full" />
                        <ChannelHealth metrics={health} loading={loading} className="w-full" />
                    </div>

                    <div className="mt-6">
                        {messageAlertsDashboard ? (
                            <MessageAlerts
                                dashboard={messageAlertsDashboard}
                                loading={loading}
                                className="w-full"
                                onAlertAcknowledge={() => { }}
                                onAlertResolve={() => { }}
                                onAlertDismiss={() => { }}
                                onAlertView={() => { }}
                                onSettingsEdit={() => { }}
                            />
                        ) : (
                            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                <p className="text-slate-500 dark:text-slate-400">No hay datos de alertas disponibles</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </ScrollableTabsLayout>
    );
};
