import React from 'react';
import { Layers3, Mail, Calendar, MessageCircle, Plus } from 'lucide-react';
import { ScrollableTabsLayout } from '../components/shared/ScrollableTabsLayout';
import { Button } from '../../../components/componentsreutilizables';
import { useFeatureFlags } from '../../../config/featureFlags';
import {
    MultiChannelCampaigns,
    SuccessfulCampaignsRecommender,
    MobileCampaignApproval,
    EmailPrograms,
    NewsletterEditor,
    WeeklyHighlightsNewsletterGenerator,
    ScheduledMessages,
    PromotionalCampaigns,
    QuickWhatsAppPrompts,
    TeamTaskAssignment
} from '../components';

// Tipos importados (simplificado, idealmente importar de types/index.ts)
import type {
    MultiChannelCampaign,
    EmailProgram,
    Newsletter,
    NewsletterTemplate,
    ScheduledMessage,
    PromotionalCampaign,
    QuickWhatsAppPromptsLibrary,
    MobileCampaignApprovalDashboard,
    SuccessfulCampaignsRecommenderDashboard,
    WeeklyHighlightsNewsletterGenerator as WeeklyHighlightsNewsletterGeneratorType,
    TeamTask
} from '../types';

interface CampaignsPageProps {
    loading: boolean;
    campaigns: MultiChannelCampaign[];
    emails: EmailProgram[];
    newsletters: Newsletter[];
    newsletterTemplates: NewsletterTemplate[];
    scheduledMessages: ScheduledMessage[];
    promotionalCampaigns: PromotionalCampaign[];
    quickWhatsAppPromptsLibrary?: QuickWhatsAppPromptsLibrary;
    mobileCampaignApprovalDashboard?: MobileCampaignApprovalDashboard;
    successfulCampaignsRecommenderDashboard?: SuccessfulCampaignsRecommenderDashboard;
    weeklyHighlightsNewsletterGenerator?: WeeklyHighlightsNewsletterGeneratorType;
    teamTasks?: TeamTask[];
    onBack: () => void;
}

export const CampaignsPage: React.FC<CampaignsPageProps> = ({
    loading,
    campaigns,
    emails,
    newsletters,
    newsletterTemplates,
    scheduledMessages,
    promotionalCampaigns,
    quickWhatsAppPromptsLibrary,
    mobileCampaignApprovalDashboard,
    successfulCampaignsRecommenderDashboard,
    weeklyHighlightsNewsletterGenerator,
    teamTasks = [],
    onBack,
}) => {
    const featureFlags = useFeatureFlags();

    const tabs = [
        { id: 'multicanal', label: 'Campañas Multicanal', icon: Layers3, anchor: '#multicanal' },
        { id: 'email', label: 'Email Marketing', icon: Mail, anchor: '#email' },
        { id: 'programados', label: 'Mensajes Programados', icon: Calendar, anchor: '#programados' },
        { id: 'whatsapp', label: 'WhatsApp Rápido', icon: MessageCircle, anchor: '#whatsapp' },
    ];

    return (
        <ScrollableTabsLayout
            tabs={tabs}
            title="Campañas & Envíos"
            description="Gestiona todas tus comunicaciones salientes, desde campañas masivas hasta mensajes directos."
            onBack={onBack}
            actions={
                <Button size="sm" leftIcon={<Plus size={16} />}>
                    Nueva Campaña
                </Button>
            }
        >
            {/* Sección Multicanal */}
            <section id="multicanal" className="space-y-8 scroll-mt-24">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Layers3 className="text-indigo-500" />
                        Campañas Multicanal
                    </h2>
                    <div className="space-y-6">
                        <MultiChannelCampaigns campaigns={campaigns} loading={loading} className="w-full" />

                        {successfulCampaignsRecommenderDashboard && (
                            <SuccessfulCampaignsRecommender
                                dashboard={successfulCampaignsRecommenderDashboard}
                                loading={loading}
                                className="w-full"
                                onRecommendationAccept={() => { }}
                                onRecommendationReject={() => { }}
                                onRecommendationClone={() => { }}
                                onRecommendationRepeat={() => { }}
                                onRecommendationAdapt={() => { }}
                                onRecommendationView={() => { }}
                                onViewCampaignDetails={() => { }}
                            />
                        )}

                        {mobileCampaignApprovalDashboard && (
                            <MobileCampaignApproval
                                dashboard={mobileCampaignApprovalDashboard}
                                loading={loading}
                                className="w-full"
                                onApprovalApprove={() => { }}
                                onApprovalReject={() => { }}
                                onApprovalRequestChanges={() => { }}
                                onApprovalView={() => { }}
                            />
                        )}

                        {/* Componente oculto con feature flag */}
                        {featureFlags.team_collaboration && campaigns.length > 0 && (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {campaigns.slice(0, 2).map((campaign) => (
                                    <TeamTaskAssignment
                                        key={campaign.id}
                                        campaign={campaign}
                                        tasks={teamTasks.filter((task) => task.campaignId === campaign.id)}
                                        loading={loading}
                                        className="w-full"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Sección Email */}
            <section id="email" className="space-y-8 scroll-mt-24">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Mail className="text-indigo-500" />
                        Programas de Email
                    </h2>
                    <div className="space-y-6">
                        <EmailPrograms programs={emails} loading={loading} className="w-full" />

                        <NewsletterEditor
                            newsletters={newsletters}
                            templates={newsletterTemplates}
                            loading={loading}
                            className="w-full"
                            onNewsletterCreate={() => { }}
                            onNewsletterEdit={() => { }}
                            onNewsletterDelete={() => { }}
                            onNewsletterSend={() => { }}
                            onNewsletterSchedule={() => { }}
                            onNewsletterPause={() => { }}
                            onNewsletterResume={() => { }}
                            onTemplateCreate={() => { }}
                            onTemplateEdit={() => { }}
                            onTemplateDelete={() => { }}
                            onViewTracking={() => { }}
                        />

                        {weeklyHighlightsNewsletterGenerator && (
                            <WeeklyHighlightsNewsletterGenerator
                                generator={weeklyHighlightsNewsletterGenerator}
                                loading={loading}
                                className="w-full"
                                onGenerateNewsletter={() => { }}
                                onEditNewsletter={() => { }}
                                onDeleteNewsletter={() => { }}
                                onSendNewsletter={() => { }}
                                onViewNewsletter={() => { }}
                                onSettingsEdit={() => { }}
                            />
                        )}
                    </div>
                </div>
            </section>

            {/* Sección Programados */}
            <section id="programados" className="space-y-8 scroll-mt-24">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Calendar className="text-indigo-500" />
                        Mensajes Programados
                    </h2>
                    <div className="space-y-6">
                        <ScheduledMessages
                            messages={scheduledMessages}
                            loading={loading}
                            className="w-full"
                            onMessageCreate={() => { }}
                            onMessageEdit={() => { }}
                            onMessageDelete={() => { }}
                            onMessageToggle={() => { }}
                        />

                        <PromotionalCampaigns
                            campaigns={promotionalCampaigns}
                            specializedTemplates={[]}
                            loading={loading}
                            className="w-full"
                            onCampaignCreate={() => { }}
                            onCampaignEdit={() => { }}
                            onCampaignDelete={() => { }}
                            onCampaignSend={() => { }}
                            onCampaignSchedule={() => { }}
                            onViewResults={() => { }}
                            onTemplateUse={() => { }}
                            onTemplatePreview={() => { }}
                        />
                    </div>
                </div>
            </section>

            {/* Sección WhatsApp */}
            <section id="whatsapp" className="space-y-8 scroll-mt-24">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <MessageCircle className="text-indigo-500" />
                        WhatsApp Rápido
                    </h2>
                    <div className="space-y-6">
                        {quickWhatsAppPromptsLibrary && (
                            <QuickWhatsAppPrompts
                                library={quickWhatsAppPromptsLibrary}
                                loading={loading}
                                className="w-full"
                                onPromptCreate={() => { }}
                                onPromptEdit={() => { }}
                                onPromptDelete={() => { }}
                                onPromptUse={() => { }}
                                onPromptCopy={() => { }}
                                onPromptToggleFavorite={() => { }}
                                onVoiceNoteGenerate={() => { }}
                                onSettingsEdit={() => { }}
                            />
                        )}
                    </div>
                </div>
            </section>
        </ScrollableTabsLayout>
    );
};
