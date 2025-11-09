import { useCallback, useEffect, useMemo, useState } from 'react';
import { HeartHandshake, Users, RefreshCw, Sparkles, Flame, Activity, MessageCircle, Rocket } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Badge, Button, Tabs } from '../../../components/componentsreutilizables';
import { AdvocacyPrograms, FeedbackInsightsBoard, PulseOverview, TestimonialsShowcase } from '../components';
import { CommunityFidelizacionService } from '../services/communityFidelizacionService';
import { CommunityFidelizacionSnapshot } from '../types';

const periodTabs: CommunityFidelizacionSnapshot['period'][] = ['30d', '90d', '12m'];

const PERIOD_LABEL: Record<CommunityFidelizacionSnapshot['period'], string> = {
  '30d': 'Últimos 30 días',
  '90d': 'Últimos 90 días',
  '12m': 'Últimos 12 meses',
};

type SectionTab = 'overview' | 'feedback' | 'engagement';

export default function ComunidadYFidelizacionPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<CommunityFidelizacionSnapshot['period']>('30d');
  const [snapshot, setSnapshot] = useState<CommunityFidelizacionSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<SectionTab>('overview');

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
  }, [period]);

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  const tabs = useMemo(
    () =>
      periodTabs.map((tab) => ({
        id: tab,
        label: PERIOD_LABEL[tab],
      })),
    [],
  );

  const sectionTabs = useMemo(
    () => [
      {
        id: 'overview',
        label: 'Radar comunidad',
        icon: <Activity className="w-4 h-4" />,
      },
      {
        id: 'feedback',
        label: 'Feedback inteligente',
        icon: <MessageCircle className="w-4 h-4" />,
      },
      {
        id: 'engagement',
        label: 'Engagement Hub',
        icon: <Rocket className="w-4 h-4" />,
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
        <section className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Tabs
            items={tabs}
            activeTab={period}
            onTabChange={(tabId) => setPeriod(tabId as CommunityFidelizacionSnapshot['period'])}
            variant="pills"
            size="sm"
          />
          <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-300">
            <Sparkles className="w-4 h-4" />
            <span>Datos simulados combinando motor de reseñas y feedback loop inteligente.</span>
          </div>
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
            {section === 'overview' && (
              <section className="space-y-10">
                <PulseOverview
                  summary={snapshot.summary}
                  pulseMetrics={snapshot.pulseMetrics}
                  loading={loading}
                  periodLabel={PERIOD_LABEL[period]}
                />

                <TestimonialsShowcase testimonials={snapshot.testimonials} loading={loading} />
              </section>
            )}

            {section === 'feedback' && (
              <section>
                <FeedbackInsightsBoard
                  insights={snapshot.insights}
                  automations={snapshot.automations}
                  loading={loading}
                />
              </section>
            )}

            {section === 'engagement' && (
              <section>
                <AdvocacyPrograms
                  programs={snapshot.programs}
                  advocacyMoments={snapshot.advocacyMoments}
                  loading={loading}
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

