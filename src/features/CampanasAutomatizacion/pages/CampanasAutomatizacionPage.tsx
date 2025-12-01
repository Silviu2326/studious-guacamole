import { useCallback, useEffect, useState } from 'react';
import { CampanasAutomatizacionService } from '../services/campanasAutomatizacionService';
import { CampanasAutomatizacionDashboard } from './CampanasAutomatizacionDashboard';
import { CampaignsPage } from './CampaignsPage';
import { JourneysPage } from './JourneysPage';
import { ContentPage } from './ContentPage';
import { AudiencePage } from './AudiencePage';
import { InsightsPage } from './InsightsPage';

// Types
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
  JourneyGapDetectorDashboard,
  ChannelRecommendationsDashboard,
} from '../types';

type ViewState = 'dashboard' | 'campaigns' | 'journeys' | 'content' | 'audience' | 'insights';

export default function CampanasAutomatizacionPage() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [loading, setLoading] = useState(true);

  // State Definitions
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
  const [messageStatisticsDashboard, setMessageStatisticsDashboard] = useState<MessageStatisticsDashboard | null>(null);
  const [clientSegments, setClientSegments] = useState<ClientSegment[]>([]);
  const [bulkMessages, setBulkMessages] = useState<BulkMessage[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [newsletterTemplates, setNewsletterTemplates] = useState<NewsletterTemplate[]>([]);
  const [afterHoursAutoReplies, setAfterHoursAutoReplies] = useState<AfterHoursAutoReply[]>([]);
  const [promotionalCampaigns, setPromotionalCampaigns] = useState<PromotionalCampaign[]>([]);
  const [reservationsIntegration, setReservationsIntegration] = useState<ReservationsIntegration | undefined>(undefined);
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

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  const handleBackToDashboard = () => setCurrentView('dashboard');

  if (currentView === 'dashboard') {
    return (
      <CampanasAutomatizacionDashboard
        summary={summary}
        onNavigate={setCurrentView}
      />
    );
  }

  if (currentView === 'campaigns') {
    return (
      <CampaignsPage
        loading={loading}
        campaigns={campaigns}
        emails={emails}
        newsletters={newsletters}
        newsletterTemplates={newsletterTemplates}
        scheduledMessages={scheduledMessages}
        promotionalCampaigns={promotionalCampaigns}
        quickWhatsAppPromptsLibrary={quickWhatsAppPromptsLibrary}
        mobileCampaignApprovalDashboard={mobileCampaignApprovalDashboard}
        successfulCampaignsRecommenderDashboard={successfulCampaignsRecommenderDashboard}
        weeklyHighlightsNewsletterGenerator={weeklyHighlightsNewsletterGenerator}
        teamTasks={teamTasks}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (currentView === 'journeys') {
    return (
      <JourneysPage
        loading={loading}
        welcomeSequences={welcomeSequences}
        sequences={sequences}
        postLeadMagnetSequences={postLeadMagnetSequences}
        leadMagnetFunnels={leadMagnetFunnels}
        multiStepSequences={multiStepSequences}
        automations={automations}
        clientActionTriggers={clientActionTriggers}
        inactivityAutomations={inactivityAutomations}
        absenceAutomations={absenceAutomations}
        afterHoursAutoReplies={afterHoursAutoReplies}
        reminderTemplates={reminderTemplates}
        clientReminderSettings={clientReminderSettings}
        upcomingReminders={upcomingReminders}
        aiReminderAutomation={aiReminderAutomation}
        paymentReminderAutomations={paymentReminderAutomations}
        importantDateAutomations={importantDateAutomations}
        reservationsIntegration={reservationsIntegration}
        roadmap={roadmap}
        health={health}
        messageAlertsDashboard={messageAlertsDashboard}
        journeyGapDetectorDashboard={journeyGapDetectorDashboard}
        channelRecommendationsDashboard={channelRecommendationsDashboard}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (currentView === 'content') {
    return (
      <ContentPage
        loading={loading}
        messageTemplates={messageTemplates}
        aiMessageLibrary={aiMessageLibrary}
        aiPlaybooks={aiPlaybooks}
        campaigns={campaigns}
        specializedTemplates={specializedTemplates}
        sequences={sequences}
        postLeadMagnetSequences={postLeadMagnetSequences}
        playbookExports={playbookExports}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (currentView === 'audience') {
    return (
      <AudiencePage
        loading={loading}
        clientSegments={clientSegments}
        bulkMessages={bulkMessages}
        preferredSendingSchedulesDashboard={preferredSendingSchedulesDashboard}
        aiHeatMapSendingSchedules={aiHeatMapSendingSchedules}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (currentView === 'insights') {
    return (
      <InsightsPage
        loading={loading}
        summary={summary}
        actionableKPIs={actionableKPIs}
        messageStatisticsDashboard={messageStatisticsDashboard}
        weeklyAIInsights={weeklyAIInsights}
        centralAutomationsPanel={centralAutomationsPanel}
        messageSaturationDashboard={messageSaturationDashboard}
        exportReports={exportReports}
        experimentsDashboard={experimentsDashboard}
        onBack={handleBackToDashboard}
      />
    );
  }

  return null;
}
