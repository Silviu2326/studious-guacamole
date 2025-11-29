import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HeartHandshake, Users, RefreshCw, Sparkles, Flame, Activity, MessageCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Badge, Button, Tabs } from '../../../components/componentsreutilizables';
import { AdvocacyPrograms, FeedbackInsightsBoard, PulseOverview, TestimonialsShowcase, TestimonialInputManager, TestimonialRequestsTracking, IdealTestimonialMoments, PostSessionSurveyAutomation, SurveyTemplatesLibrary, NegativeFeedbackAlerts, PromoterClientsList, ReferralProgramManager, MetricsDashboard, SocialPlatformsIntegration, MonthlyReportManager, CommunityVoiceConfig, CustomerSegmentation, WowMomentsCapture, TestimonialScriptGenerator, BestReviewsAutoPublish, ProgressBasedTestimonialMoments, AIReferralProgramManager, PromoterMissionsManager, ReferralImpactReports, AIAdaptedSurveys, SuccessStoriesManager, AIPlaybook, AutomatedComplianceMessages, ClientJourneyView, CommunityActivityCorrelation, CommunityHealthRadar, CommunityManagerTemplates, ApprovalManager, InitiativePrioritizationAI, CommunityGamification, ContentRecommendations } from '../components';
import { CommunityFidelizacionService } from '../services/communityFidelizacionService';
import { CommunityFidelizacionSnapshot } from '../types';

const PERIOD_LABEL: Record<CommunityFidelizacionSnapshot['period'], string> = {
  '30d': 'Últimos 30 días',
  '90d': 'Últimos 90 días',
  '12m': 'Últimos 12 meses',
};

type SectionTab = 'dashboard' | 'reviews' | 'feedback';

export default function ComunidadYFidelizacionPage() {
  const { user } = useAuth();
  const period: CommunityFidelizacionSnapshot['period'] = '30d';
  const [snapshot, setSnapshot] = useState<CommunityFidelizacionSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<SectionTab>('dashboard');
  const anchorRef = useRef<string | null>(null);

  const scrollToAnchor = useCallback((anchorId?: string) => {
    if (!anchorId || typeof document === 'undefined') return;
    requestAnimationFrame(() => {
      const element = document.getElementById(anchorId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }, []);

  const navigateToSection = useCallback(
    (target: SectionTab, anchorId?: string) => {
      if (section === target) {
        scrollToAnchor(anchorId);
        return;
      }

      if (anchorId) {
        anchorRef.current = anchorId;
      } else {
        anchorRef.current = null;
      }

      setSection(target);
    },
    [section, scrollToAnchor],
  );

  useEffect(() => {
    if (anchorRef.current) {
      const pendingAnchor = anchorRef.current;
      anchorRef.current = null;
      scrollToAnchor(pendingAnchor);
    }
  }, [section, scrollToAnchor]);

  const loadSnapshot = useCallback(async () => {
    setLoading(true);
    try {
      const data = await CommunityFidelizacionService.getSnapshot(period);
      setSnapshot(data);
    } catch (error) {
      console.error('[ComunidadYFidelizacion] Error cargando snapshot', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  const sectionTabs = useMemo(
    () => [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <Activity className="w-4 h-4" />,
      },
      {
        id: 'reviews',
        label: 'Review & Testimonial Engine',
        icon: <HeartHandshake className="w-4 h-4" />,
      },
      {
        id: 'feedback',
        label: 'Feedback Loop & Encuestas Inteligentes',
        icon: <MessageCircle className="w-4 h-4" />,
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-[#0b1120] dark:via-[#0f172a] dark:to-[#020617]">
      <header className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800/60 dark:bg-[#0b1120]/80">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-indigo-900/40 dark:to-purple-900/30 rounded-2xl shadow-inner">
                  <HeartHandshake className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-slate-100">
                    Comunidad &amp; Fidelización
                  </h1>
                  <p className="text-gray-600 dark:text-slate-400 max-w-2xl">
                    Conecta la voz del cliente, la prueba social y tus programas de advocacy en un Engagement
                    Hub listo para activar crecimiento orgánico.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="blue" size="md" className="shadow">
                  {user?.name ? `Hola, ${user.name.split(' ')[0]}` : 'Modo fidelización'}
                </Badge>
                <Button variant="secondary" onClick={loadSnapshot} className="inline-flex items-center gap-2">
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Actualizar datos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        <section className="flex items-center gap-2 mb-6 text-sm text-indigo-600 dark:text-indigo-300">
          <Sparkles className="w-4 h-4" />
          <span>Datos simulados combinando motor de reseñas y feedback loop inteligente.</span>
        </section>

        <section className="mb-8">
          <Tabs
            items={sectionTabs}
            activeTab={section}
            onTabChange={(tabId) => setSection(tabId as SectionTab)}
            variant="pills"
            size="sm"
            className="bg-slate-100/70 dark:bg-slate-900/60"
          />
        </section>

        {snapshot && (
          <>
            {section === 'dashboard' && (
              <section className="space-y-10">
                {/* US-CF-01: Configuración de Voz de Comunidad */}
                <CommunityVoiceConfig loading={loading} />
                
                <MetricsDashboard
                  summary={snapshot.summary}
                  pulseMetrics={snapshot.pulseMetrics}
                  testimonials={snapshot.testimonials}
                  insights={snapshot.insights}
                  promoterClients={snapshot.promoterClients}
                  negativeFeedbackAlerts={snapshot.negativeFeedbackAlerts}
                  loading={loading}
                  periodLabel={PERIOD_LABEL[period]}
                  onViewDetails={(metricId) => {
                    console.log('Ver detalles de métrica:', metricId);
                    // TODO: Implementar navegación a detalles de métrica
                  }}
                />
                <PulseOverview
                  summary={snapshot.summary}
                  pulseMetrics={snapshot.pulseMetrics}
                  testimonials={snapshot.testimonials}
                  insights={snapshot.insights}
                  automations={snapshot.automations}
                  loading={loading}
                  periodLabel={PERIOD_LABEL[period]}
                  onNavigateToReviews={(anchorId) => navigateToSection('reviews', anchorId)}
                  onNavigateToFeedback={(anchorId) => navigateToSection('feedback', anchorId)}
                  onNavigateToAutomations={() => navigateToSection('feedback', 'automations-board')}
                />
                {/* US-CF-02: Segmentación de Clientes con IA */}
                <CustomerSegmentation
                  segments={snapshot.customerSegments || []}
                  summary={snapshot.segmentSummary}
                  loading={loading}
                  onSegmentClick={(segment) => {
                    console.log('Ver detalles de segmento:', segment);
                    // TODO: Implementar navegación a detalles del cliente
                  }}
                />
                <MonthlyReportManager
                  reports={snapshot.monthlyReports}
                  config={snapshot.monthlyReportConfig}
                  loading={loading}
                  onGenerateReport={(month) => {
                    console.log('Generar reporte:', month);
                    // TODO: Implementar lógica de generación de reporte
                  }}
                  onDownloadReport={(reportId) => {
                    console.log('Descargar reporte:', reportId);
                    // TODO: Implementar lógica de descarga
                  }}
                  onSendReport={(reportId) => {
                    console.log('Enviar reporte:', reportId);
                    // TODO: Implementar lógica de envío
                  }}
                  onUpdateConfig={(config) => {
                    console.log('Actualizar configuración:', config);
                    // TODO: Implementar lógica de actualización de configuración
                  }}
                />
                {/* US-CF-16: Journey completo del cliente */}
                <ClientJourneyView
                  journeys={snapshot.clientJourneys}
                  loading={loading}
                  onSelectClient={(clientId) => {
                    console.log('Seleccionar cliente:', clientId);
                    // TODO: Implementar lógica de selección
                  }}
                  onViewClientDetails={(clientId) => {
                    console.log('Ver detalles del cliente:', clientId);
                    // TODO: Implementar navegación a detalles del cliente
                  }}
                  onExecuteRecommendation={(recommendationId, clientId) => {
                    console.log('Ejecutar recomendación:', recommendationId, 'para cliente:', clientId);
                    // TODO: Implementar lógica de ejecución de recomendación
                  }}
                />
                {/* US-CF-22: IA que aprende qué iniciativas generan mayor retención y referidos */}
                <div className="mt-10">
                  <InitiativePrioritizationAI
                    prioritization={snapshot.initiativePrioritization}
                    loading={loading}
                    onRefresh={loadSnapshot}
                    onGenerateReport={async (period) => {
                      await CommunityFidelizacionService.generateInitiativePrioritization(period);
                      await loadSnapshot();
                    }}
                  />
                </div>
                {/* User Story: Correlación de actividades de comunidad con retención e ingresos */}
                <div className="mt-10">
                  <CommunityActivityCorrelation
                    report={snapshot.activityCorrelationReport}
                    loading={loading}
                    onGenerateReport={async (period) => {
                      console.log('Generar reporte de correlación:', period);
                      await loadSnapshot();
                    }}
                    onRefresh={loadSnapshot}
                  />
                </div>
                {/* User Story: Radar IA de salud comunitaria */}
                <div className="mt-10">
                  <CommunityHealthRadar
                    radar={snapshot.communityHealthRadar}
                    loading={loading}
                    onRefresh={loadSnapshot}
                  />
                </div>
                {/* User Story: Gamificación de la comunidad con IA (badges, retos, reconocimientos) adaptados a valores del entrenador */}
                <div className="mt-10">
                  <CommunityGamification
                    config={snapshot.communityGamificationConfig}
                    badges={snapshot.communityBadges}
                    clientBadges={snapshot.clientBadges}
                    challenges={snapshot.communityChallenges}
                    recognitions={snapshot.recognitions}
                    loading={loading}
                    onRefresh={loadSnapshot}
                  />
                </div>
                {/* User Story: Recomendaciones de contenido/comunicaciones basadas en feedback reciente */}
                <div className="mt-10">
                  <ContentRecommendations
                    config={snapshot.contentRecommendationsConfig}
                    feedbackAnalysis={snapshot.feedbackAnalysis}
                    contentRecommendations={snapshot.contentRecommendations}
                    communicationRecommendations={snapshot.communicationRecommendations}
                    loading={loading}
                    onRefresh={loadSnapshot}
                  />
                </div>
              </section>
            )}

            {section === 'reviews' && (
              <section>
                <div id="reviews-testimonials" className="space-y-10">
                  <TestimonialInputManager />
                  {/* US-CF-04: Generador de Guiones IA para Testimonios */}
                  <TestimonialScriptGenerator
                    testimonialScripts={snapshot.testimonialScripts}
                    loading={loading}
                    onScriptGenerated={loadSnapshot}
                  />
                  <TestimonialsShowcase testimonials={snapshot.testimonials} loading={loading} />
                </div>
                {/* User Story: Historias de éxito para contenido y funnels */}
                <div className="mt-10">
                  <SuccessStoriesManager
                    testimonials={snapshot.testimonials}
                    successStories={snapshot.successStories}
                    loading={loading}
                    onStoryCreated={(story) => {
                      console.log('Historia de éxito creada:', story);
                      loadSnapshot();
                    }}
                    onStoryUpdated={(story) => {
                      console.log('Historia de éxito actualizada:', story);
                      loadSnapshot();
                    }}
                  />
                </div>
                <div className="mt-10">
                  <SocialPlatformsIntegration
                    connections={snapshot.socialPlatformConnections}
                    reviewRequests={snapshot.reviewRequests}
                    loading={loading}
                    onConnect={(platform) => {
                      console.log('Conectar plataforma:', platform);
                      // TODO: Implementar lógica de conexión
                    }}
                    onDisconnect={(connectionId) => {
                      console.log('Desconectar:', connectionId);
                      // TODO: Implementar lógica de desconexión
                    }}
                    onSync={(connectionId) => {
                      console.log('Sincronizar:', connectionId);
                      // TODO: Implementar lógica de sincronización
                    }}
                    onUpdateSyncFrequency={(connectionId, frequency) => {
                      console.log('Actualizar frecuencia:', connectionId, frequency);
                      // TODO: Implementar lógica de actualización
                    }}
                    onRequestReview={(clientId, platform) => {
                      console.log('Solicitar reseña:', clientId, platform);
                      // TODO: Implementar lógica de solicitud de reseña
                    }}
                  />
                </div>
                <div className="mt-10">
                  <BestReviewsAutoPublish
                    testimonials={snapshot.testimonials}
                    loading={loading}
                  />
                </div>
                <div className="mt-10">
                  <ProgressBasedTestimonialMoments
                    loading={loading}
                    onSendReminder={(momentId, channel) => {
                      console.log('Enviar recordatorio:', momentId, channel);
                      // TODO: Implementar lógica de envío de recordatorio
                    }}
                    onDismiss={(momentId) => {
                      console.log('Descartar momento:', momentId);
                      // TODO: Implementar lógica de descartar
                    }}
                    onRequestTestimonial={(momentId) => {
                      console.log('Solicitar testimonio:', momentId);
                      // TODO: Implementar lógica de solicitar testimonio
                    }}
                  />
                </div>
                <div className="mt-10">
                  <IdealTestimonialMoments
                    moments={snapshot.idealTestimonialMoments}
                    loading={loading}
                    onSendReminder={(momentId, channel) => {
                      console.log('Enviar recordatorio:', momentId, channel);
                      // TODO: Implementar lógica de envío de recordatorio
                    }}
                    onDismiss={(momentId) => {
                      console.log('Descartar momento:', momentId);
                      // TODO: Implementar lógica de descartar
                    }}
                    onRequestTestimonial={(momentId) => {
                      console.log('Solicitar testimonio:', momentId);
                      // TODO: Implementar lógica de solicitar testimonio
                    }}
                  />
                </div>
                <div className="mt-10">
                  <TestimonialRequestsTracking
                    onNotificationReceived={(request) => {
                      console.log('Nueva respuesta recibida:', request);
                      // TODO: Mostrar notificación toast o banner
                    }}
                  />
                </div>
                {/* US-CF-21: Aprobación de testimonios y mensajes antes de publicar */}
                <div className="mt-10">
                  <ApprovalManager
                    pendingApprovals={snapshot.pendingApprovals}
                    config={snapshot.approvalConfig}
                    loading={loading}
                    onApprove={async (approvalId) => {
                      if (user?.id) {
                        await CommunityFidelizacionService.approveRequest(approvalId, user.id);
                        await loadSnapshot();
                      }
                    }}
                    onReject={async (approvalId, reason) => {
                      if (user?.id) {
                        await CommunityFidelizacionService.rejectRequest(approvalId, reason, user.id);
                        await loadSnapshot();
                      }
                    }}
                    onConfigUpdate={async (config) => {
                      await CommunityFidelizacionService.updateApprovalConfig(config);
                      await loadSnapshot();
                    }}
                    onRefresh={loadSnapshot}
                  />
                </div>
                <div className="mt-10">
                  <AdvocacyPrograms
                    programs={snapshot.programs}
                    advocacyMoments={snapshot.advocacyMoments}
                    loading={loading}
                    onProgramUpdate={(updatedProgram) => {
                      // Actualizar el programa en el snapshot
                      const updatedPrograms = snapshot.programs.map((p) =>
                        p.id === updatedProgram.id ? updatedProgram : p
                      );
                      setSnapshot({ ...snapshot, programs: updatedPrograms });
                    }}
                  />
                </div>
                {/* US-CF-20: Plantillas IA con guidelines para community managers */}
                <div className="mt-10">
                  <CommunityManagerTemplates
                    loading={loading}
                    onRefresh={loadSnapshot}
                  />
                </div>
                {/* US-CF-03: Captura de Momentos Wow */}
                <div className="mt-10">
                  <WowMomentsCapture
                    wowMoments={snapshot.wowMoments}
                    loading={loading}
                    onMomentCaptured={loadSnapshot}
                  />
                </div>
                <div className="mt-10">
                  <PromoterClientsList
                    promoters={snapshot.promoterClients || []}
                    loading={loading}
                    onRequestReferral={(clientId) => {
                      console.log('Solicitar referido para cliente:', clientId);
                      // TODO: Implementar lógica de solicitar referido
                    }}
                    onRequestTestimonial={(clientId) => {
                      console.log('Solicitar testimonio para cliente:', clientId);
                      // TODO: Implementar lógica de solicitar testimonio
                    }}
                    onContactClient={(clientId, type) => {
                      console.log('Contactar cliente:', clientId, 'tipo:', type);
                      // TODO: Implementar lógica de contacto
                    }}
                  />
                </div>
                <div className="mt-10">
                  <ReferralProgramManager
                    program={snapshot.referralProgram}
                    referrals={snapshot.referrals || []}
                    stats={snapshot.referralStats}
                    loading={loading}
                    onCreateProgram={() => {
                      console.log('Crear programa de referidos');
                      // TODO: Implementar lógica de crear programa
                    }}
                    onEditProgram={(programId) => {
                      console.log('Editar programa:', programId);
                      // TODO: Implementar lógica de editar programa
                    }}
                    onGenerateLink={(clientId) => {
                      console.log('Generar link para cliente:', clientId);
                      // TODO: Implementar lógica de generar link
                    }}
                    onManageReward={(referralId) => {
                      console.log('Gestionar recompensa para referido:', referralId);
                      // TODO: Implementar lógica de gestionar recompensa
                    }}
                    onViewReferral={(referralId) => {
                      console.log('Ver referido:', referralId);
                      // TODO: Implementar lógica de ver referido
                    }}
                  />
                </div>
                {/* US-CF-09: Reportes IA de Impacto de Referidos */}
                <div className="mt-10">
                  <ReferralImpactReports
                    report={snapshot.referralROIReport}
                    loading={loading}
                    onGenerateReport={(period) => {
                      console.log('Generar reporte de impacto:', period);
                      loadSnapshot();
                    }}
                    onRefresh={loadSnapshot}
                  />
                </div>
                {/* US-CF-07: Programas de Referidos IA con adaptación por segmentos */}
                <div className="mt-10">
                  <AIReferralProgramManager
                    program={snapshot.aiReferralProgram}
                    stats={snapshot.referralStats}
                    customerSegments={snapshot.segmentSummary?.map((s) => ({
                      segmentType: s.segmentType,
                      count: s.count,
                    }))}
                    loading={loading}
                    onCreateProgram={async () => {
                      console.log('Crear programa de referidos IA');
                      // TODO: Implementar lógica de crear programa
                      await loadSnapshot();
                    }}
                    onEditProgram={(programId) => {
                      console.log('Editar programa IA:', programId);
                      // TODO: Implementar lógica de editar programa
                    }}
                    onEnableAI={async (programId) => {
                      console.log('Activar IA para programa:', programId);
                      // TODO: Implementar lógica de activar IA
                      await loadSnapshot();
                    }}
                    onGenerateSegmentRewards={async (programId) => {
                      console.log('Generar recompensas por segmento:', programId);
                      // TODO: Implementar lógica de generar recompensas
                      await loadSnapshot();
                    }}
                    onUpdateSegmentReward={async (programId, segmentReward) => {
                      console.log('Actualizar recompensa de segmento:', programId, segmentReward);
                      // TODO: Implementar lógica de actualizar recompensa
                      await loadSnapshot();
                    }}
                    onAnalyzeWithAI={async (programId) => {
                      console.log('Analizar con IA:', programId);
                      // TODO: Implementar lógica de análisis IA
                      await loadSnapshot();
                    }}
                  />
                </div>
                {/* US-CF-08: Misiones personalizadas para promotores */}
                <div className="mt-10">
                  <PromoterMissionsManager
                    promoterBrandings={snapshot.promoterBrandings}
                    missions={snapshot.promoterMissions}
                    loading={loading}
                    onCreateMission={async (promoterId, missionType) => {
                      console.log('Crear misión:', promoterId, missionType);
                      // TODO: Implementar lógica de crear misión
                      await loadSnapshot();
                    }}
                    onAssignMission={async (missionId, promoterId) => {
                      console.log('Asignar misión:', missionId, promoterId);
                      // TODO: Implementar lógica de asignar misión
                      await loadSnapshot();
                    }}
                    onUpdateMissionStatus={async (missionId, status) => {
                      console.log('Actualizar estado de misión:', missionId, status);
                      // TODO: Implementar lógica de actualizar estado
                      await loadSnapshot();
                    }}
                    onReviewMission={async (missionId, approved, feedback) => {
                      console.log('Revisar misión:', missionId, approved, feedback);
                      // TODO: Implementar lógica de revisar misión
                      await loadSnapshot();
                    }}
                    onBrandPromoter={async (promoterId) => {
                      console.log('Configurar branding de promotor:', promoterId);
                      // TODO: Implementar lógica de branding
                      await loadSnapshot();
                    }}
                    onViewMission={(missionId) => {
                      console.log('Ver misión:', missionId);
                      // TODO: Implementar lógica de ver misión
                    }}
                  />
                </div>
              </section>
            )}

            {section === 'feedback' && (
              <section className="space-y-10">
                <NegativeFeedbackAlerts
                  alerts={snapshot.negativeFeedbackAlerts || []}
                  loading={loading}
                  onContactClient={(clientId, channel) => {
                    console.log('Contactar cliente:', clientId, channel);
                    // TODO: Implementar lógica de contacto
                  }}
                  onResolveAlert={(alertId) => {
                    console.log('Resolver alerta:', alertId);
                    // TODO: Implementar lógica de resolución
                  }}
                  onViewClientHistory={(clientId) => {
                    console.log('Ver historial del cliente:', clientId);
                    // TODO: Implementar lógica de ver historial
                  }}
                />
                <SurveyTemplatesLibrary
                  templates={snapshot.surveyTemplates || []}
                  clients={[
                    { id: 'cliente_001', name: 'Laura Méndez', email: 'laura@example.com' },
                    { id: 'cliente_002', name: 'Carlos Ortega', email: 'carlos@example.com' },
                    { id: 'cliente_003', name: 'María González', email: 'maria@example.com' },
                    { id: 'cliente_004', name: 'Pedro Sánchez', email: 'pedro@example.com' },
                    { id: 'cliente_005', name: 'Ana Martínez', email: 'ana@example.com' },
                  ]}
                  loading={loading}
                  onSendSurvey={(survey) => {
                    console.log('Enviar encuesta:', survey);
                    // TODO: Implementar lógica de envío
                  }}
                />
                <FeedbackInsightsBoard
                  insights={snapshot.insights}
                  automations={snapshot.automations}
                  loading={loading}
                />
                <PostSessionSurveyAutomation
                  surveys={snapshot.postSessionSurveys}
                  config={snapshot.postSessionSurveyConfig}
                  loading={loading}
                  onUpdateConfig={(config) => {
                    console.log('Actualizar configuración:', config);
                    // TODO: Implementar lógica de actualización de configuración
                  }}
                  onViewSurvey={(surveyId) => {
                    console.log('Ver encuesta:', surveyId);
                    // TODO: Implementar lógica de ver encuesta
                  }}
                />
                {/* US-CF-10: Encuestas IA Adaptadas por Experiencia */}
                <div className="mt-10">
                  <AIAdaptedSurveys
                    surveys={snapshot.aiAdaptedSurveys || []}
                    templates={snapshot.aiAdaptedSurveyTemplates || []}
                    stats={snapshot.aiAdaptedSurveyStats || []}
                    loading={loading}
                    onGenerateSurvey={(templateId, clientId, experienceId, experienceType) => {
                      console.log('Generar encuesta IA:', templateId, clientId, experienceId, experienceType);
                      loadSnapshot();
                    }}
                    onSendSurvey={(surveyId) => {
                      console.log('Enviar encuesta:', surveyId);
                      loadSnapshot();
                    }}
                    onRefresh={loadSnapshot}
                  />
                </div>
                {/* User Story: AI Playbook - Retos y eventos basados en estilo y calendario */}
                <div className="mt-10">
                  <AIPlaybook
                    playbook={snapshot.aiPlaybook}
                    suggestions={snapshot.aiPlaybookSuggestions || []}
                    loading={loading}
                    onRefresh={loadSnapshot}
                  />
                </div>
                {/* User Story: Mensajes automatizados de cumplimiento */}
                <div className="mt-10">
                  <AutomatedComplianceMessages
                    messages={snapshot.automatedComplianceMessages || []}
                    config={snapshot.complianceMessageConfig}
                    loading={loading}
                    onRefresh={loadSnapshot}
                  />
                </div>
              </section>
            )}
          </>
        )}

        {!snapshot && loading && (
          <div className="mt-20 flex flex-col items-center gap-4 text-center">
            <div className="h-14 w-14 border-4 border-indigo-500/40 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Estamos activando tu Engagement Hub. Dame unos segundos.
            </p>
          </div>
        )}

        <footer className="mt-12 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6 shadow-lg flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6" />
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] opacity-80">Movimiento de la semana</p>
              <h3 className="text-lg font-semibold">
                Lanza un reto comunitario en tu Engagement Hub y pide 3 testimonios en vivo durante la transmisión.
              </h3>
            </div>
          </div>
          <Button variant="ghost" className="bg-white/10 hover:bg-white/20 text-white inline-flex items-center gap-2">
            <Flame className="w-4 h-4" />
            Ver playbook recomendado
          </Button>
        </footer>
      </main>
    </div>
  );
}

