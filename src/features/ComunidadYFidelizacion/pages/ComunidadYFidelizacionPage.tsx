import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HeartHandshake, Users, RefreshCw, Sparkles, Flame, Activity, MessageCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Badge, Button, Tabs } from '../../../components/componentsreutilizables';
import { AdvocacyPrograms, FeedbackInsightsBoard, PulseOverview, TestimonialsShowcase, TestimonialInputManager, TestimonialRequestsTracking, IdealTestimonialMoments, PostSessionSurveyAutomation, SurveyTemplatesLibrary, NegativeFeedbackAlerts, PromoterClientsList, ReferralProgramManager, MetricsDashboard, SocialPlatformsIntegration, MonthlyReportManager } from '../components';
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
              </section>
            )}

            {section === 'reviews' && (
              <section>
                <div id="reviews-testimonials" className="space-y-10">
                  <TestimonialInputManager />
                  <TestimonialsShowcase testimonials={snapshot.testimonials} loading={loading} />
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
                <div className="mt-10">
                  <AdvocacyPrograms
                    programs={snapshot.programs}
                    advocacyMoments={snapshot.advocacyMoments}
                    loading={loading}
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

