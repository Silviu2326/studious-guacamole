import { ComponentType, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Clock,
  DollarSign,
  Download,
  FileText,
  LayoutDashboard,
  Layers3,
  Mail,
  Plus,
  RefreshCcw,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Upload,
  Workflow,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Badge, Button, Card, Modal } from '../../../components/componentsreutilizables';
import { MarketingOverviewService } from '../../OverviewMarketing/services/marketingOverviewService';
import type { StrategicProfile } from '../../OverviewMarketing/types';
import {
  AbsenceAutomations,
  AfterHoursAutoReplyComponent,
  AutomationRoadmap,
  ChannelHealth,
  ClientSegmentation,
  EmailPrograms,
  ImportantDateAutomations,
  InactivityAutomations,
  LifecycleSequences,
  MessageStatisticsDashboard as MessageStatisticsDashboardComponent,
  MessageTemplatesLibrary,
  MessagingAutomations,
  MessagingAutomationDetail,
  MultiChannelCampaigns,
  NewsletterEditor,
  PaymentReminderAutomations,
  PromotionalCampaigns,
  ScheduledMessages,
  SessionReminders,
  SummaryGrid,
  WelcomeSequences,
  ReservationsIntegration as ReservationsIntegrationComponent,
  AutomationsCentralPanel,
  MessageAlerts,
  PreferredSendingSchedules,
  MultiStepSequenceBuilder,
  ReportExporter,
  CampaignObjectiveSelector,
  Campaign360AIGenerator,
  ClientActionTriggers,
  AIReminderAutomationComponent,
  MessageSaturationDetector,
  AIMessageLibrary,
  WeeklyHighlightsNewsletterGenerator,
  QuickWhatsAppPrompts,
  AIHeatMapSendingSchedules,
  ActionableKPIs,
  ExperimentsDashboard,
  WeeklyAIInsights,
  TeamTaskAssignment,
  AIPlaybookExporter,
  MobileCampaignApproval,
  SuccessfulCampaignsRecommender,
  JourneyGapDetector,
  ChannelRecommendations,
} from '../components';
import { CampanasAutomatizacionService } from '../services/campanasAutomatizacionService';
import type {
  AbsenceAutomation,
  AfterHoursAutoReply,
  AutomationRoadmapItem,
  BulkMessage,
  ChannelHealthMetric,
  ClientReminderSettings,
  ClientSegment,
  EmailProgram,
  ImportantDateAutomation,
  InactivityAutomation,
  LifecycleSequence,
  MessageStatisticsDashboard,
  MessageTemplate,
  MessagingAutomation,
  MissionControlSummary,
  MultiChannelCampaign,
  Newsletter,
  NewsletterTemplate,
  PaymentReminderAutomation,
  PromotionalCampaign,
  ScheduledMessage,
  SessionReminder,
  SessionReminderTemplate,
  WelcomeSequence,
  ReservationsIntegration,
  CentralAutomationsPanel,
  MessageAlertsDashboard,
  PreferredSendingSchedulesDashboard,
  MultiStepSequence,
  ExportReport,
  CampaignObjectiveSuggestions,
  Campaign360Review,
  SpecializedTemplate,
  PostLeadMagnetSequence,
  LeadMagnetFunnel,
  ClientActionTriggersDashboard,
  AIReminderAutomationDashboard,
  MessageSaturationDashboard,
  AIMessageLibrary as AIMessageLibraryType,
  WeeklyHighlightsNewsletterGenerator as WeeklyHighlightsNewsletterGeneratorType,
  QuickWhatsAppPromptsLibrary,
  AIHeatMapSendingSchedulesDashboard,
  ActionableKPIDashboard,
  ExperimentsDashboard as ExperimentsDashboardType,
  WeeklyAIInsightsDashboard,
  TeamTask,
  AIPlaybook,
  PlaybookExport,
  MobileCampaignApprovalDashboard,
  SuccessfulCampaignsRecommenderDashboard,
  CampaignApproval,
  CampaignRecommendation,
  JourneyGapDetectorDashboard,
  ChannelRecommendationsDashboard,
} from '../types';

type TabId = 'campanas' | 'automatizaciones';

interface TabItem {
  id: TabId;
  label: string;
  icon: ComponentType<{ className?: string; size?: number | string }>;
}

export default function CampanasAutomatizacionPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<MissionControlSummary[]>([]);
  const [campaigns, setCampaigns] = useState<MultiChannelCampaign[]>([]);
  const [emails, setEmails] = useState<EmailProgram[]>([]);
  const [sequences, setSequences] = useState<LifecycleSequence[]>([]);
  const [automations, setAutomations] = useState<MessagingAutomation[]>([]);
  const [health, setHealth] = useState<ChannelHealthMetric[]>([]);
  const [roadmap, setRoadmap] = useState<AutomationRoadmapItem[]>([]);
  const [reminderTemplates, setReminderTemplates] = useState<SessionReminderTemplate[]>([]);
  const [clientReminderSettings, setClientReminderSettings] = useState<ClientReminderSettings[]>([]);
  const [upcomingReminders, setUpcomingReminders] = useState<SessionReminder[]>([]);
  const [welcomeSequences, setWelcomeSequences] = useState<WelcomeSequence[]>([]);
  const [absenceAutomations, setAbsenceAutomations] = useState<AbsenceAutomation[]>([]);
  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>([]);
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
  const [inactivityAutomations, setInactivityAutomations] = useState<InactivityAutomation[]>([]);
  const [importantDateAutomations, setImportantDateAutomations] = useState<ImportantDateAutomation[]>([]);
  const [paymentReminderAutomations, setPaymentReminderAutomations] = useState<PaymentReminderAutomation[]>([]);
  const [messageStatisticsDashboard, setMessageStatisticsDashboard] =
    useState<MessageStatisticsDashboard | null>(null);
  const [clientSegments, setClientSegments] = useState<ClientSegment[]>([]);
  const [bulkMessages, setBulkMessages] = useState<BulkMessage[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [newsletterTemplates, setNewsletterTemplates] = useState<NewsletterTemplate[]>([]);
  const [afterHoursAutoReplies, setAfterHoursAutoReplies] = useState<AfterHoursAutoReply[]>([]);
  const [promotionalCampaigns, setPromotionalCampaigns] = useState<PromotionalCampaign[]>([]);
  const [reservationsIntegration, setReservationsIntegration] = useState<ReservationsIntegration | undefined>(
    undefined,
  );
  const [centralAutomationsPanel, setCentralAutomationsPanel] = useState<CentralAutomationsPanel | undefined>(undefined);
  const [messageAlertsDashboard, setMessageAlertsDashboard] = useState<MessageAlertsDashboard | undefined>(undefined);
  const [preferredSendingSchedulesDashboard, setPreferredSendingSchedulesDashboard] = useState<PreferredSendingSchedulesDashboard | undefined>(undefined);
  const [multiStepSequences, setMultiStepSequences] = useState<MultiStepSequence[]>([]);
  const [exportReports, setExportReports] = useState<ExportReport[]>([]);
  const [specializedTemplates, setSpecializedTemplates] = useState<SpecializedTemplate[]>([]);
  const [postLeadMagnetSequences, setPostLeadMagnetSequences] = useState<PostLeadMagnetSequence[]>([]);
  const [leadMagnetFunnels, setLeadMagnetFunnels] = useState<LeadMagnetFunnel[]>([]);
  const [clientActionTriggers, setClientActionTriggers] = useState<ClientActionTriggersDashboard | undefined>(undefined);
  const [aiReminderAutomation, setAiReminderAutomation] = useState<AIReminderAutomationDashboard | undefined>(undefined);
  const [messageSaturationDashboard, setMessageSaturationDashboard] = useState<MessageSaturationDashboard | undefined>(undefined);
  const [aiMessageLibrary, setAiMessageLibrary] = useState<AIMessageLibraryType | undefined>(undefined);
  const [weeklyHighlightsNewsletterGenerator, setWeeklyHighlightsNewsletterGenerator] = useState<WeeklyHighlightsNewsletterGeneratorType | undefined>(undefined);
  const [quickWhatsAppPromptsLibrary, setQuickWhatsAppPromptsLibrary] = useState<QuickWhatsAppPromptsLibrary | undefined>(undefined);
  const [aiHeatMapSendingSchedules, setAiHeatMapSendingSchedules] = useState<AIHeatMapSendingSchedulesDashboard | undefined>(undefined);
  const [actionableKPIs, setActionableKPIs] = useState<ActionableKPIDashboard | undefined>(undefined);
  const [experimentsDashboard, setExperimentsDashboard] = useState<ExperimentsDashboardType | undefined>(undefined);
  const [weeklyAIInsights, setWeeklyAIInsights] = useState<WeeklyAIInsightsDashboard | undefined>(undefined);
  const [teamTasks, setTeamTasks] = useState<TeamTask[]>([]);
  const [aiPlaybooks, setAiPlaybooks] = useState<AIPlaybook[]>([]);
  const [playbookExports, setPlaybookExports] = useState<PlaybookExport[]>([]);
  const [mobileCampaignApprovalDashboard, setMobileCampaignApprovalDashboard] = useState<MobileCampaignApprovalDashboard | undefined>(undefined);
  const [successfulCampaignsRecommenderDashboard, setSuccessfulCampaignsRecommenderDashboard] = useState<SuccessfulCampaignsRecommenderDashboard | undefined>(undefined);
  const [journeyGapDetectorDashboard, setJourneyGapDetectorDashboard] = useState<JourneyGapDetectorDashboard | undefined>(undefined);
  const [channelRecommendationsDashboard, setChannelRecommendationsDashboard] = useState<ChannelRecommendationsDashboard | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<TabId>('campanas');
  const [isCampaign360ModalOpen, setIsCampaign360ModalOpen] = useState(false);
  const [selectedNewsletterProgram, setSelectedNewsletterProgram] = useState<EmailProgram | null>(null);
  const [isNewsletterEditorOpen, setIsNewsletterEditorOpen] = useState(false);
  const [selectedSequenceId, setSelectedSequenceId] = useState<string | null>(null);
  const [selectedAutomationId, setSelectedAutomationId] = useState<string | null>(null);

  const tabItems: TabItem[] = useMemo(
    () => [
      { id: 'campanas', label: 'Campañas', icon: Layers3 },
      { id: 'automatizaciones', label: 'Automatizaciones', icon: Workflow },
    ],
    [],
  );

  const loadSnapshot = useCallback(async () => {
    setLoading(true);
    try {
      const snapshot = await CampanasAutomatizacionService.getSnapshot();
      setSummary(snapshot.summary);
      setCampaigns(snapshot.campaigns);
      setEmails(snapshot.emailPrograms);
      setSequences(snapshot.lifecycleSequences);
      setAutomations(snapshot.messagingAutomations);
      setHealth(snapshot.channelHealth);
      setRoadmap(snapshot.roadmap);
      setReminderTemplates(snapshot.sessionReminderTemplates || []);
      setClientReminderSettings(snapshot.clientReminderSettings || []);
      setUpcomingReminders(snapshot.upcomingReminders || []);
      setWelcomeSequences(snapshot.welcomeSequences || []);
      setAbsenceAutomations(snapshot.absenceAutomations || []);
      setMessageTemplates(snapshot.messageTemplates || []);
      setScheduledMessages(snapshot.scheduledMessages || []);
      setInactivityAutomations(snapshot.inactivityAutomations || []);
      setImportantDateAutomations(snapshot.importantDateAutomations || []);
      setPaymentReminderAutomations(snapshot.paymentReminderAutomations || []);
      setMessageStatisticsDashboard(snapshot.messageStatisticsDashboard || null);
      setClientSegments(snapshot.clientSegments || []);
      setBulkMessages(snapshot.bulkMessages || []);
      setNewsletters(snapshot.newsletters || []);
      setNewsletterTemplates(snapshot.newsletterTemplates || []);
      setAfterHoursAutoReplies(snapshot.afterHoursAutoReplies || []);
      setPromotionalCampaigns(snapshot.promotionalCampaigns || []);
      setReservationsIntegration(snapshot.reservationsIntegration);
      setCentralAutomationsPanel(snapshot.centralAutomationsPanel);
      setMessageAlertsDashboard(snapshot.messageAlertsDashboard);
      setPreferredSendingSchedulesDashboard(snapshot.preferredSendingSchedulesDashboard);
      setMultiStepSequences(snapshot.multiStepSequences || []);
      setExportReports(snapshot.exportReports || []);
      setSpecializedTemplates(snapshot.specializedTemplates || []);
      setPostLeadMagnetSequences(snapshot.postLeadMagnetSequences || []);
      setLeadMagnetFunnels(snapshot.leadMagnetFunnels || []);
      setClientActionTriggers(snapshot.clientActionTriggers);
      setAiReminderAutomation(snapshot.aiReminderAutomation);
      setMessageSaturationDashboard(snapshot.messageSaturationDashboard);
      setAiMessageLibrary(snapshot.aiMessageLibrary);
      setWeeklyHighlightsNewsletterGenerator(snapshot.weeklyHighlightsNewsletterGenerator);
      setQuickWhatsAppPromptsLibrary(snapshot.quickWhatsAppPromptsLibrary);
      setAiHeatMapSendingSchedules(snapshot.aiHeatMapSendingSchedules);
      setActionableKPIs(snapshot.actionableKPIs);
      setExperimentsDashboard(snapshot.experimentsDashboard);
      setWeeklyAIInsights(snapshot.weeklyAIInsights);
      setMobileCampaignApprovalDashboard(snapshot.mobileCampaignApprovalDashboard);
      setSuccessfulCampaignsRecommenderDashboard(snapshot.successfulCampaignsRecommenderDashboard);
      setJourneyGapDetectorDashboard(snapshot.journeyGapDetectorDashboard);
      setChannelRecommendationsDashboard(snapshot.channelRecommendationsDashboard);
    } catch (error) {
      console.error('[CampanasAutomatizacion] Error cargando snapshot', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // const loadStrategicProfile = useCallback(async () => {
  //   setLoadingProfile(true);
  //   try {
  //     const profile = await MarketingOverviewService.getStrategicProfile();
  //     setStrategicProfile(profile);
  //   } catch (error) {
  //     console.error('[CampanasAutomatizacion] Error cargando perfil estratégico:', error);
  //   } finally {
  //     setLoadingProfile(false);
  //   }
  // }, []);

  useEffect(() => {
    loadSnapshot();
    // loadStrategicProfile();
  }, [loadSnapshot]);

  const missionTagline = useMemo(
    () =>
      user?.name
        ? `Coordinando automatizaciones para ${user.name.split(' ')[0]}`
        : 'Mission Control de campañas & automatización',
    [user],
  );


  const missionCta = (
    <section className="rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 text-white p-6 shadow-lg flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Rocket className="w-6 h-6" />
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] opacity-70">Modo pro</p>
          <h3 className="text-lg font-semibold">
            Activa el Playbook “Churn Shield” en 3 clics y sincroniza mensajes en email + WhatsApp automáticamente.
          </h3>
        </div>
      </div>
      <Button variant="ghost" className="bg-white/15 hover:bg-white/25 text-white border border-white/20">
        Ver playbooks recomendados
      </Button>
    </section>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'campanas':
        return (
          <div className="space-y-8">
            {/* Bloque: Campañas & Broadcasts */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Layers3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Campañas & Broadcasts
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <MultiChannelCampaigns campaigns={campaigns} loading={loading} />
                <PromotionalCampaigns
                  campaigns={promotionalCampaigns}
                  specializedTemplates={specializedTemplates}
                  loading={loading}
                />
              </div>
            </div>

            {/* Bloque: Programas de Email & Newsletters */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Programas de Email & Newsletters
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <EmailPrograms
                  programs={emails}
                  loading={loading}
                  onNewsletterEdit={(program) => {
                    // Buscar el newsletter correspondiente
                    const newsletter = newsletters.find((n) => n.id === program.id);
                    if (newsletter) {
                      setSelectedNewsletterProgram(program);
                      setIsNewsletterEditorOpen(true);
                    }
                  }}
                />
              </div>
            </div>

            {/* Bloque: Mensajes Programados */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Mensajes Programados
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <ScheduledMessages messages={scheduledMessages} loading={loading} />
              </div>
            </div>

            {/* Bloque: Highlights Semanales */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Highlights Semanales
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <WeeklyHighlightsNewsletterGenerator
                  generator={weeklyHighlightsNewsletterGenerator}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        );
      case 'automatizaciones':
        return (
          <div className="space-y-8">
            {/* Bloque: Journeys & Sequences */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Workflow className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Journeys & Sequences
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {selectedSequenceId ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Editando secuencia
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSequenceId(null)}
                      >
                        Volver a la lista
                      </Button>
                    </div>
                    <MultiStepSequenceBuilder 
                      sequences={multiStepSequences} 
                      loading={loading}
                      sequenceId={selectedSequenceId}
                    />
                  </div>
                ) : (
                  <>
                    <LifecycleSequences
                      sequences={sequences}
                      postLeadMagnetSequences={postLeadMagnetSequences}
                      leadMagnetFunnels={leadMagnetFunnels}
                      loading={loading}
                      onSelectSequence={setSelectedSequenceId}
                    />
                    <WelcomeSequences sequences={welcomeSequences} loading={loading} />
                    <MultiStepSequenceBuilder sequences={multiStepSequences} loading={loading} />
                  </>
                )}
              </div>
            </div>

            {/* Bloque: Automatizaciones por Trigger */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Automatizaciones por Trigger
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {selectedAutomationId ? (
                  (() => {
                    const selectedAutomation = automations.find(a => a.id === selectedAutomationId);
                    return selectedAutomation ? (
                      <MessagingAutomationDetail
                        automation={selectedAutomation}
                        onBack={() => setSelectedAutomationId(null)}
                      />
                    ) : (
                      <div>
                        <p>Automatización no encontrada</p>
                        <Button onClick={() => setSelectedAutomationId(null)}>Volver</Button>
                      </div>
                    );
                  })()
                ) : (
                  <>
                    <MessagingAutomations 
                      automations={automations} 
                      loading={loading}
                      onSelectAutomation={setSelectedAutomationId}
                    />
                    <AutomationsCentralPanel panel={centralAutomationsPanel} loading={loading} />
                  </>
                )}
              </div>
            </div>

            {/* Bloque: Recordatorios & Fechas */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Recordatorios & Fechas
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <SessionReminders
                  templates={reminderTemplates}
                  clientSettings={clientReminderSettings}
                  upcomingReminders={upcomingReminders}
                  loading={loading}
                />
                <AIReminderAutomationComponent dashboard={aiReminderAutomation} loading={loading} />
                <AbsenceAutomations automations={absenceAutomations} loading={loading} />
                <InactivityAutomations automations={inactivityAutomations} loading={loading} />
                <ImportantDateAutomations automations={importantDateAutomations} loading={loading} />
                <PaymentReminderAutomations automations={paymentReminderAutomations} loading={loading} />
              </div>
            </div>

            {/* Bloque: Gaps & After Hours */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-red-600 dark:text-red-400" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Gaps & After Hours
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <AfterHoursAutoReplyComponent autoReplies={afterHoursAutoReplies} loading={loading} />
                {journeyGapDetectorDashboard && (
                  <JourneyGapDetector dashboard={journeyGapDetectorDashboard} loading={loading} />
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#050b16] dark:via-[#091020] dark:to-[#030712]">
      <header className="border-b border-slate-200/70 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-slate-800/60 dark:bg-[#050b16]/80">
        <div className="w-full px-4 sm:px-6">
          <div className="py-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-200 via-purple-200 to-sky-200 dark:from-indigo-900/50 dark:via-purple-900/40 dark:to-sky-900/30 shadow-inner">
                  <Workflow className="w-7 h-7 text-indigo-700 dark:text-indigo-200" />
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                      Campañas & Automatización
                    </h1>
                    <Badge variant="purple" size="md">
                      {missionTagline}
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
                    Mission Control para todo lo que dispara mensajes: campañas multicanal, email marketing, secuencias de
                    lifecycle y automatizaciones de SMS/WhatsApp en un único panel operativo.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="sm"
                  leftIcon={<Plus size={16} />}
                  onClick={() => setIsCampaign360ModalOpen(true)}
                >
                  Generar campaña 360 con IA
                </Button>
                <Button size="sm" variant="secondary" leftIcon={<Plus size={16} />}>
                  Nueva campaña
                </Button>
                <Button size="sm" variant="secondary" leftIcon={<Download size={16} />}>
                  Exportar reportes
                </Button>
                <Button size="sm" variant="ghost" leftIcon={<Upload size={16} />}>
                  Importar flujos
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />}
                  onClick={loadSnapshot}
                  disabled={loading}
                >
                  Actualizar datos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full px-4 sm:px-6 py-8 space-y-8">
        {actionableKPIs && (
          <ActionableKPIs
            dashboard={actionableKPIs}
            loading={loading}
            onPeriodChange={(period) => {
              // TODO: Implementar cambio de período
              console.log('Cambio de período:', period);
            }}
            onViewDetails={(messageId) => {
              // TODO: Implementar vista de detalles
              console.log('Ver detalles de mensaje:', messageId);
            }}
            onViewCampaign={(campaignId) => {
              // TODO: Implementar vista de campaña
              console.log('Ver campaña:', campaignId);
            }}
          />
        )}

        <Card padding="none" className="bg-white/90 shadow-sm dark:bg-[#050b16]/80">
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones campañas y automatización"
              className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800/50"
            >
              {tabItems.map(({ id, label, icon: Icon }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveTab(id)}
                    className={[
                      'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                      active
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 dark:bg-[#0f172a] dark:text-white dark:ring-slate-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700/60',
                    ].join(' ')}
                  >
                    <Icon
                      size={18}
                      className={active ? 'opacity-100' : 'opacity-70'}
                    />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        <div className="space-y-8">{renderTabContent()}</div>
      </main>

      <Campaign360AIGenerator
        isOpen={isCampaign360ModalOpen}
        onClose={() => setIsCampaign360ModalOpen(false)}
        onCampaignGenerated={(campaign) => {
          console.log('Campaña 360 generada:', campaign);
          // Aquí se podría agregar la lógica para guardar la campaña
          setIsCampaign360ModalOpen(false);
        }}
      />

      {/* Newsletter Editor Modal - Se abre cuando se edita un programa tipo newsletter */}
      <Modal
        isOpen={isNewsletterEditorOpen}
        onClose={() => {
          setIsNewsletterEditorOpen(false);
          setSelectedNewsletterProgram(null);
        }}
        title={selectedNewsletterProgram ? `Editor de Newsletter: ${selectedNewsletterProgram.name}` : 'Editor de Newsletter'}
        size="xl"
      >
        {selectedNewsletterProgram && (
          <NewsletterEditor
            newsletters={newsletters.filter((n) => n.id === selectedNewsletterProgram.id)}
            templates={newsletterTemplates}
            loading={loading}
            onNewsletterCreate={() => {
              // Lógica para crear nuevo newsletter
            }}
            onNewsletterEdit={(newsletter) => {
              // Lógica para editar newsletter
            }}
            onNewsletterDelete={(id) => {
              // Lógica para eliminar newsletter
            }}
            onNewsletterSend={(id) => {
              // Lógica para enviar newsletter
            }}
            onNewsletterSchedule={(id) => {
              // Lógica para programar newsletter
            }}
            onNewsletterPause={(id) => {
              // Lógica para pausar newsletter
            }}
            onNewsletterResume={(id) => {
              // Lógica para reanudar newsletter
            }}
            onTemplateCreate={() => {
              // Lógica para crear plantilla
            }}
            onTemplateEdit={(template) => {
              // Lógica para editar plantilla
            }}
            onTemplateDelete={(id) => {
              // Lógica para eliminar plantilla
            }}
            onViewTracking={(id) => {
              // Lógica para ver tracking
            }}
          />
        )}
      </Modal>
    </div>
  );
}


