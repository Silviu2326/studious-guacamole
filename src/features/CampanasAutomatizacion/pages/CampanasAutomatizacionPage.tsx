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
  MessageSquare,
  Plus,
  RefreshCcw,
  Rocket,
  ShieldCheck,
  Target,
  Upload,
  Workflow,
  Newspaper,
  Timer,
  Gift,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Badge, Button, Card, MetricCards } from '../../../components/componentsreutilizables';
import type { MetricCardData } from '../../../components/componentsreutilizables';
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
  MessageStatisticsDashboard,
  MessageTemplatesLibrary,
  MessagingAutomations,
  MultiChannelCampaigns,
  NewsletterEditor,
  PaymentReminderAutomations,
  PromotionalCampaigns,
  ScheduledMessages,
  SessionReminders,
  SummaryGrid,
  WelcomeSequences,
  ReservationsIntegration,
  AutomationsCentralPanel,
  MessageAlerts,
  PreferredSendingSchedules,
  MultiStepSequenceBuilder,
  ReportExporter,
} from '../components';
import { CampanasAutomatizacionService } from '../services/campanasAutomatizacionService';
import {
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
} from '../types';

type TabId = 'overview' | 'campaigns' | 'email' | 'lifecycle' | 'automation' | 'reminders' | 'templates' | 'scheduled' | 'operations' | 'payments' | 'statistics' | 'segmentation' | 'newsletters' | 'after-hours' | 'promotional' | 'reservations-integration' | 'central-panel' | 'message-alerts' | 'preferred-schedules' | 'multi-step-sequences' | 'reports';

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
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const tabItems: TabItem[] = useMemo(
    () => [
      { id: 'overview', label: 'Mission Overview', icon: LayoutDashboard },
      { id: 'campaigns', label: 'Campañas Omnicanal', icon: Layers3 },
      { id: 'email', label: 'Email & Newsletters', icon: Mail },
      { id: 'lifecycle', label: 'Lifecycle Sequences', icon: Workflow },
      { id: 'automation', label: 'SMS / WhatsApp Ops', icon: MessageSquare },
      { id: 'reminders', label: 'Recordatorios Sesiones', icon: Clock },
      { id: 'payments', label: 'Recordatorios Pagos', icon: DollarSign },
      { id: 'templates', label: 'Biblioteca Plantillas', icon: FileText },
      { id: 'scheduled', label: 'Mensajes Programados', icon: Calendar },
      { id: 'segmentation', label: 'Segmentación', icon: Target },
      { id: 'newsletters', label: 'Editor Newsletters', icon: Newspaper },
      { id: 'statistics', label: 'Estadísticas', icon: Target },
      { id: 'after-hours', label: 'Respuestas Fuera Horario', icon: Timer },
      { id: 'promotional', label: 'Campañas Promocionales', icon: Gift },
      { id: 'reservations-integration', label: 'Integración Reservas', icon: Calendar },
      { id: 'central-panel', label: 'Panel Centralizado', icon: LayoutDashboard },
      { id: 'message-alerts', label: 'Alertas Mensajes', icon: AlertCircle },
      { id: 'preferred-schedules', label: 'Horarios Preferidos', icon: Clock },
      { id: 'multi-step-sequences', label: 'Secuencias Multi-Paso', icon: Workflow },
      { id: 'reports', label: 'Reportes', icon: FileText },
      { id: 'operations', label: 'Health & Roadmap', icon: ShieldCheck },
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
    } catch (error) {
      console.error('[CampanasAutomatizacion] Error cargando snapshot', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  const missionTagline = useMemo(
    () =>
      user?.name
        ? `Coordinando automatizaciones para ${user.name.split(' ')[0]}`
        : 'Mission Control de campañas & automatización',
    [user],
  );

  const metricCardsData = useMemo<MetricCardData[]>(() => {
    const iconMapper: Record<string, ReactNode> = {
      target: <Target className="w-5 h-5 text-white" />,
      workflow: <Workflow className="w-5 h-5 text-white" />,
      clock: <Clock className="w-5 h-5 text-white" />,
      currency: <DollarSign className="w-5 h-5 text-white" />,
    };

    if (loading && summary.length === 0) {
      return Array.from({ length: 4 }).map((_, index) => ({
        id: `loading-${index}`,
        title: 'Cargando',
        value: '...',
        loading: true,
      }));
    }

    return summary.map((item) => ({
      id: item.id,
      title: item.label,
      value:
        item.id === 'client-response-rate'
          ? `${item.value}%`
          : item.id === 'messages-sent' || item.id === 'active-reminders' || item.id === 'pending-communication'
          ? item.value.toString()
          : item.value,
      subtitle: item.description,
      icon: iconMapper[item.icon] ?? iconMapper.target,
      color: item.trend === 'down' ? 'error' : item.trend === 'up' ? 'success' : 'info',
      trend: {
        value: Math.abs(item.changePercentage),
        direction: item.trend,
        label: 'vs. periodo anterior',
      },
    }));
  }, [loading, summary]);

  const showMetricCards = metricCardsData.length > 0;

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
      case 'campaigns':
        return (
          <div className="space-y-6">
            <MultiChannelCampaigns campaigns={campaigns} loading={loading} className="w-full" />
            <ChannelHealth metrics={health} loading={loading} className="w-full" />
            {missionCta}
          </div>
        );
      case 'email':
        return (
          <div className="space-y-6">
            <EmailPrograms programs={emails} loading={loading} className="w-full" />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <LifecycleSequences sequences={sequences} loading={loading} className="xl:col-span-2" />
              <AutomationRoadmap items={roadmap} loading={loading} className="xl:col-span-1" />
            </div>
            {missionCta}
          </div>
        );
      case 'lifecycle':
        return (
          <div className="space-y-6">
            <WelcomeSequences sequences={welcomeSequences} loading={loading} className="w-full" />
            <LifecycleSequences sequences={sequences} loading={loading} className="w-full" />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <MessagingAutomations automations={automations} loading={loading} className="xl:col-span-2" />
              <AutomationRoadmap items={roadmap} loading={loading} className="xl:col-span-1" />
            </div>
          </div>
        );
      case 'automation':
        return (
          <div className="space-y-6">
            <InactivityAutomations automations={inactivityAutomations} loading={loading} className="w-full" />
            <AbsenceAutomations automations={absenceAutomations} loading={loading} className="w-full" />
            <MessagingAutomations automations={automations} loading={loading} className="w-full" />
            <ChannelHealth metrics={health} loading={loading} className="w-full" />
            {missionCta}
          </div>
        );
      case 'reminders':
        return (
          <div className="space-y-6">
            <SessionReminders
              templates={reminderTemplates}
              clientSettings={clientReminderSettings}
              upcomingReminders={upcomingReminders}
              loading={loading}
              className="w-full"
              onTemplateCreate={() => console.log('Crear plantilla')}
              onTemplateEdit={(template) => console.log('Editar plantilla', template)}
              onTemplateDelete={(templateId) => console.log('Eliminar plantilla', templateId)}
              onTemplateToggle={(templateId, isActive) => console.log('Toggle plantilla', templateId, isActive)}
              onClientToggle={(clientId, templateId, isEnabled) => console.log('Toggle cliente', clientId, templateId, isEnabled)}
            />
          </div>
        );
      case 'templates':
        return (
          <div className="space-y-6">
            <MessageTemplatesLibrary
              templates={messageTemplates}
              loading={loading}
              className="w-full"
              onTemplateCreate={() => console.log('Crear plantilla')}
              onTemplateEdit={(template) => console.log('Editar plantilla', template)}
              onTemplateDelete={(templateId) => console.log('Eliminar plantilla', templateId)}
              onTemplateUse={(template) => console.log('Usar plantilla', template)}
              onTemplateSendBulk={(template) => console.log('Enviar en masa', template)}
              onTemplateToggleFavorite={(templateId, isFavorite) => console.log('Toggle favorito', templateId, isFavorite)}
            />
          </div>
        );
      case 'scheduled':
        return (
          <div className="space-y-6">
            <ScheduledMessages
              messages={scheduledMessages}
              loading={loading}
              className="w-full"
              onMessageCreate={() => console.log('Crear mensaje programado')}
              onMessageEdit={(message) => console.log('Editar mensaje', message)}
              onMessageDelete={(messageId) => console.log('Eliminar mensaje', messageId)}
              onMessageToggle={(messageId, isActive) => console.log('Toggle mensaje', messageId, isActive)}
            />
          </div>
        );
      case 'payments':
        return (
          <div className="space-y-6">
            <PaymentReminderAutomations automations={paymentReminderAutomations} loading={loading} className="w-full" />
          </div>
        );
      case 'segmentation':
        return (
          <div className="space-y-6">
            <ClientSegmentation
              segments={clientSegments}
              bulkMessages={bulkMessages}
              loading={loading}
              className="w-full"
              onSegmentCreate={() => console.log('Crear segmento')}
              onSegmentEdit={(segment) => console.log('Editar segmento', segment)}
              onSegmentDelete={(segmentId) => console.log('Eliminar segmento', segmentId)}
              onSegmentRefresh={(segmentId) => console.log('Actualizar segmento', segmentId)}
              onBulkMessageCreate={(segmentId) => console.log('Crear mensaje masivo', segmentId)}
              onBulkMessageEdit={(message) => console.log('Editar mensaje masivo', message)}
              onBulkMessageDelete={(messageId) => console.log('Eliminar mensaje masivo', messageId)}
              onBulkMessageSend={(messageId) => console.log('Enviar mensaje masivo', messageId)}
            />
          </div>
        );
      case 'newsletters':
        return (
          <div className="space-y-6">
            <NewsletterEditor
              newsletters={newsletters}
              templates={newsletterTemplates}
              loading={loading}
              className="w-full"
              onNewsletterCreate={() => console.log('Crear newsletter')}
              onNewsletterEdit={(newsletter) => console.log('Editar newsletter', newsletter)}
              onNewsletterDelete={(newsletterId) => console.log('Eliminar newsletter', newsletterId)}
              onNewsletterSend={(newsletterId) => console.log('Enviar newsletter', newsletterId)}
              onNewsletterSchedule={(newsletterId) => console.log('Programar newsletter', newsletterId)}
              onNewsletterPause={(newsletterId) => console.log('Pausar newsletter', newsletterId)}
              onNewsletterResume={(newsletterId) => console.log('Reanudar newsletter', newsletterId)}
              onTemplateCreate={() => console.log('Crear plantilla newsletter')}
              onTemplateEdit={(template) => console.log('Editar plantilla newsletter', template)}
              onTemplateDelete={(templateId) => console.log('Eliminar plantilla newsletter', templateId)}
              onViewTracking={(newsletterId) => console.log('Ver tracking newsletter', newsletterId)}
            />
          </div>
        );
      case 'statistics':
        return (
          <div className="space-y-6">
            {messageStatisticsDashboard ? (
              <MessageStatisticsDashboard dashboard={messageStatisticsDashboard} loading={loading} className="w-full" />
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500 dark:text-slate-400">No hay estadísticas disponibles</p>
              </div>
            )}
          </div>
        );
      case 'after-hours':
        return (
          <div className="space-y-6">
            <AfterHoursAutoReplyComponent
              autoReplies={afterHoursAutoReplies}
              loading={loading}
              className="w-full"
              onAutoReplyCreate={() => console.log('Crear respuesta automática')}
              onAutoReplyEdit={(autoReply) => console.log('Editar respuesta automática', autoReply)}
              onAutoReplyDelete={(autoReplyId) => console.log('Eliminar respuesta automática', autoReplyId)}
              onAutoReplyToggle={(autoReplyId, isActive) => console.log('Toggle respuesta automática', autoReplyId, isActive)}
            />
          </div>
        );
      case 'promotional':
        return (
          <div className="space-y-6">
            <PromotionalCampaigns
              campaigns={promotionalCampaigns}
              loading={loading}
              className="w-full"
              onCampaignCreate={() => console.log('Crear campaña promocional')}
              onCampaignEdit={(campaign) => console.log('Editar campaña promocional', campaign)}
              onCampaignDelete={(campaignId) => console.log('Eliminar campaña promocional', campaignId)}
              onCampaignSend={(campaignId) => console.log('Enviar campaña promocional', campaignId)}
              onCampaignSchedule={(campaignId) => console.log('Programar campaña promocional', campaignId)}
              onViewResults={(campaignId) => console.log('Ver resultados campaña promocional', campaignId)}
            />
          </div>
        );
      case 'reservations-integration':
        return (
          <div className="space-y-6">
            <ReservationsIntegration
              integration={reservationsIntegration}
              loading={loading}
              className="w-full"
              onRuleCreate={() => console.log('Crear regla de integración')}
              onRuleEdit={(rule) => console.log('Editar regla', rule)}
              onRuleDelete={(ruleId) => console.log('Eliminar regla', ruleId)}
              onRuleToggle={(ruleId, isActive) => console.log('Toggle regla', ruleId, isActive)}
              onIntegrationToggle={(isEnabled) => console.log('Toggle integración', isEnabled)}
              onSync={() => console.log('Sincronizar con reservas')}
            />
          </div>
        );
      case 'central-panel':
        return (
          <div className="space-y-6">
            <AutomationsCentralPanel
              panel={centralAutomationsPanel}
              loading={loading}
              className="w-full"
              onAutomationPause={(automationId) => console.log('Pausar automatización', automationId)}
              onAutomationResume={(automationId) => console.log('Reanudar automatización', automationId)}
              onAutomationEdit={(automation) => console.log('Editar automatización', automation)}
              onAutomationDelete={(automationId) => console.log('Eliminar automatización', automationId)}
              onViewDetails={(automationId) => console.log('Ver detalles', automationId)}
            />
          </div>
        );
      case 'message-alerts':
        return (
          <div className="space-y-6">
            {messageAlertsDashboard ? (
              <MessageAlerts
                dashboard={messageAlertsDashboard}
                loading={loading}
                className="w-full"
                onAlertAcknowledge={(alertId) => console.log('Reconocer alerta', alertId)}
                onAlertResolve={(alertId) => console.log('Resolver alerta', alertId)}
                onAlertDismiss={(alertId) => console.log('Descartar alerta', alertId)}
                onAlertView={(alert) => console.log('Ver alerta', alert)}
                onSettingsEdit={() => console.log('Editar configuración de alertas')}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500 dark:text-slate-400">No hay datos de alertas disponibles</p>
              </div>
            )}
          </div>
        );
      case 'preferred-schedules':
        return (
          <div className="space-y-6">
            {preferredSendingSchedulesDashboard ? (
              <PreferredSendingSchedules
                dashboard={preferredSendingSchedulesDashboard}
                loading={loading}
                className="w-full"
                onClientScheduleCreate={() => console.log('Crear horario de cliente')}
                onClientScheduleEdit={(schedule) => console.log('Editar horario de cliente', schedule)}
                onClientScheduleDelete={(scheduleId) => console.log('Eliminar horario de cliente', scheduleId)}
                onGroupScheduleCreate={() => console.log('Crear horario de grupo')}
                onGroupScheduleEdit={(schedule) => console.log('Editar horario de grupo', schedule)}
                onGroupScheduleDelete={(scheduleId) => console.log('Eliminar horario de grupo', scheduleId)}
                onRuleCreate={() => console.log('Crear regla de horario')}
                onRuleEdit={(rule) => console.log('Editar regla', rule)}
                onRuleDelete={(ruleId) => console.log('Eliminar regla', ruleId)}
                onRuleToggle={(ruleId, isActive) => console.log('Toggle regla', ruleId, isActive)}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500 dark:text-slate-400">No hay datos de horarios preferidos disponibles</p>
              </div>
            )}
          </div>
        );
      case 'multi-step-sequences':
        return (
          <div className="space-y-6">
            <MultiStepSequenceBuilder
              sequences={multiStepSequences}
              loading={loading}
              className="w-full"
              onCreateNew={() => console.log('Crear nueva secuencia multi-paso')}
              onEdit={(sequenceId) => console.log('Editar secuencia', sequenceId)}
              onPause={(sequenceId) => console.log('Pausar secuencia', sequenceId)}
              onResume={(sequenceId) => console.log('Reanudar secuencia', sequenceId)}
            />
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-6">
            <ReportExporter
              reports={exportReports}
              loading={loading}
              className="w-full"
              onGenerateReport={(config) => console.log('Generar reporte', config)}
              onDownload={(reportId) => console.log('Descargar reporte', reportId)}
            />
          </div>
        );
      case 'operations':
        return (
          <div className="space-y-6">
            <SummaryGrid summary={summary} loading={loading} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <ChannelHealth metrics={health} loading={loading} className="xl:col-span-2" />
              <AutomationRoadmap items={roadmap} loading={loading} className="xl:col-span-1" />
            </div>
          </div>
        );
      case 'overview':
      default:
        return (
          <div className="space-y-8">
            <SummaryGrid summary={summary} loading={loading} />
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <MultiChannelCampaigns campaigns={campaigns} loading={loading} className="xl:col-span-2" />
              <EmailPrograms programs={emails} loading={loading} className="xl:col-span-2" />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <WelcomeSequences sequences={welcomeSequences} loading={loading} className="w-full" />
              <AbsenceAutomations automations={absenceAutomations} loading={loading} className="w-full" />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <InactivityAutomations automations={inactivityAutomations} loading={loading} className="w-full" />
              <ImportantDateAutomations automations={importantDateAutomations} loading={loading} className="w-full" />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <PaymentReminderAutomations automations={paymentReminderAutomations} loading={loading} className="w-full" />
              {messageStatisticsDashboard && (
                <MessageStatisticsDashboard dashboard={messageStatisticsDashboard} loading={loading} className="w-full" />
              )}
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <AfterHoursAutoReplyComponent
                autoReplies={afterHoursAutoReplies}
                loading={loading}
                className="w-full"
                onAutoReplyCreate={() => console.log('Crear respuesta automática')}
                onAutoReplyEdit={(autoReply) => console.log('Editar respuesta automática', autoReply)}
                onAutoReplyDelete={(autoReplyId) => console.log('Eliminar respuesta automática', autoReplyId)}
                onAutoReplyToggle={(autoReplyId, isActive) => console.log('Toggle respuesta automática', autoReplyId, isActive)}
              />
              <PromotionalCampaigns
                campaigns={promotionalCampaigns}
                loading={loading}
                className="w-full"
                onCampaignCreate={() => console.log('Crear campaña promocional')}
                onCampaignEdit={(campaign) => console.log('Editar campaña promocional', campaign)}
                onCampaignDelete={(campaignId) => console.log('Eliminar campaña promocional', campaignId)}
                onCampaignSend={(campaignId) => console.log('Enviar campaña promocional', campaignId)}
                onCampaignSchedule={(campaignId) => console.log('Programar campaña promocional', campaignId)}
                onViewResults={(campaignId) => console.log('Ver resultados campaña promocional', campaignId)}
              />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <ClientSegmentation
                segments={clientSegments}
                bulkMessages={bulkMessages}
                loading={loading}
                className="w-full"
                onSegmentCreate={() => console.log('Crear segmento')}
                onSegmentEdit={(segment) => console.log('Editar segmento', segment)}
                onSegmentDelete={(segmentId) => console.log('Eliminar segmento', segmentId)}
                onSegmentRefresh={(segmentId) => console.log('Actualizar segmento', segmentId)}
                onBulkMessageCreate={(segmentId) => console.log('Crear mensaje masivo', segmentId)}
                onBulkMessageEdit={(message) => console.log('Editar mensaje masivo', message)}
                onBulkMessageDelete={(messageId) => console.log('Eliminar mensaje masivo', messageId)}
                onBulkMessageSend={(messageId) => console.log('Enviar mensaje masivo', messageId)}
              />
              <NewsletterEditor
                newsletters={newsletters}
                templates={newsletterTemplates}
                loading={loading}
                className="w-full"
                onNewsletterCreate={() => console.log('Crear newsletter')}
                onNewsletterEdit={(newsletter) => console.log('Editar newsletter', newsletter)}
                onNewsletterDelete={(newsletterId) => console.log('Eliminar newsletter', newsletterId)}
                onNewsletterSend={(newsletterId) => console.log('Enviar newsletter', newsletterId)}
                onNewsletterSchedule={(newsletterId) => console.log('Programar newsletter', newsletterId)}
                onNewsletterPause={(newsletterId) => console.log('Pausar newsletter', newsletterId)}
                onNewsletterResume={(newsletterId) => console.log('Reanudar newsletter', newsletterId)}
                onTemplateCreate={() => console.log('Crear plantilla newsletter')}
                onTemplateEdit={(template) => console.log('Editar plantilla newsletter', template)}
                onTemplateDelete={(templateId) => console.log('Eliminar plantilla newsletter', templateId)}
                onViewTracking={(newsletterId) => console.log('Ver tracking newsletter', newsletterId)}
              />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <MessageTemplatesLibrary
                templates={messageTemplates}
                loading={loading}
                className="w-full"
                onTemplateCreate={() => console.log('Crear plantilla')}
                onTemplateEdit={(template) => console.log('Editar plantilla', template)}
                onTemplateDelete={(templateId) => console.log('Eliminar plantilla', templateId)}
                onTemplateUse={(template) => console.log('Usar plantilla', template)}
                onTemplateSendBulk={(template) => console.log('Enviar en masa', template)}
                onTemplateToggleFavorite={(templateId, isFavorite) => console.log('Toggle favorito', templateId, isFavorite)}
              />
              <ScheduledMessages
                messages={scheduledMessages}
                loading={loading}
                className="w-full"
                onMessageCreate={() => console.log('Crear mensaje programado')}
                onMessageEdit={(message) => console.log('Editar mensaje', message)}
                onMessageDelete={(messageId) => console.log('Eliminar mensaje', messageId)}
                onMessageToggle={(messageId, isActive) => console.log('Toggle mensaje', messageId, isActive)}
              />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <LifecycleSequences sequences={sequences} loading={loading} className="xl:col-span-2" />
              <MessagingAutomations automations={automations} loading={loading} className="xl:col-span-2" />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <ChannelHealth metrics={health} loading={loading} className="xl:col-span-2" />
              <AutomationRoadmap items={roadmap} loading={loading} className="xl:col-span-1" />
            </div>
            {missionCta}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#050b16] dark:via-[#091020] dark:to-[#030712]">
      <header className="border-b border-slate-200/70 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-slate-800/60 dark:bg-[#050b16]/80">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
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
                <Button size="sm" leftIcon={<Plus size={16} />}>
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

      <main className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {showMetricCards && <MetricCards data={metricCardsData} columns={4} />}

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
    </div>
  );
}


