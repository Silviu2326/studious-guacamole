import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, AlertCircle, BarChart3, ArrowLeft } from 'lucide-react';
import { Select, Button } from '../../../components/componentsreutilizables';
import type {
  ContentStudioPeriod,
  PlannerUpcomingPost,
  CalendarGap,
  CalendarGapAlert,
  PlannerAISuggestion,
} from '../types';
import {
  PlannerSchedulePreview,
  WeeklyAICalendarComponent,
  CalendarGapAlerts,
  ContentLeadAnalytics,
  ScrollAnchorTabs,
  BackToTopButton,
} from '../components';
import { getSocialPosts } from '../../PlannerDeRedesSociales/api/social';
import type { SocialPost } from '../../PlannerDeRedesSociales/api/social';
import { detectCalendarGaps, generateGapAlerts } from '../api/calendarGaps';

export default function PlannerAndSocialPage() {
  const [period, setPeriod] = useState<ContentStudioPeriod>('30d');
  const [loading, setLoading] = useState(true);

  // Estado del calendario
  const [upcomingPosts, setUpcomingPosts] = useState<PlannerUpcomingPost[]>([]);
  const [calendarGaps, setCalendarGaps] = useState<CalendarGap[]>([]);
  const [gapAlerts, setGapAlerts] = useState<CalendarGapAlert[]>([]);

  // Estado para PlannerSchedulePreview
  const [plannerData, setPlannerData] = useState<{
    upcoming: PlannerUpcomingPost[];
    aiSuggestions: PlannerAISuggestion[];
    coverageDays: number;
    backlogCount: number;
  }>({
    upcoming: [],
    aiSuggestions: [],
    coverageDays: 0,
    backlogCount: 0,
  });

  // Mapear SocialPost a PlannerUpcomingPost
  const mapPostsToUpcoming = useCallback((posts: SocialPost[]): PlannerUpcomingPost[] => {
    return posts
      .filter((post) => post.scheduledAt)
      .sort((a, b) => {
        if (!a.scheduledAt || !b.scheduledAt) return 0;
        return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
      })
      .map((post) => ({
        id: post.id,
        title: post.content.length > 90 ? `${post.content.slice(0, 90)}…` : post.content,
        scheduledAt: post.scheduledAt!,
        platform: post.platform,
        status: post.status,
        contentType: post.mediaUrls.length > 1 ? 'carousel' : post.mediaUrls.length === 0 ? 'post' : 'reel',
        campaign: post.profileName,
        aiGenerated: Boolean(post.hashtags && post.hashtags.length > 0),
      }));
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Calcular rango de fechas según el periodo
      const endDate = new Date();
      const startDate = new Date();
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      startDate.setDate(startDate.getDate() - days);

      // Cargar posts programados desde la API específica
      const socialPosts = await getSocialPosts(
        startDate.toISOString(),
        endDate.toISOString()
      );

      // Mapear a PlannerUpcomingPost
      const upcoming = mapPostsToUpcoming(socialPosts);

      // Detectar gaps en el calendario
      const gaps = await detectCalendarGaps(upcoming);
      const alerts = await generateGapAlerts(gaps, upcoming);

      setCalendarGaps(gaps);
      setGapAlerts(alerts);
      setUpcomingPosts(upcoming);

      // Calcular días de cobertura
      const coverageDays = (() => {
        if (upcoming.length === 0) return 0;
        const last = upcoming[upcoming.length - 1];
        return Math.max(
          0,
          Math.ceil((new Date(last.scheduledAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        );
      })();

      // Preparar datos para PlannerSchedulePreview
      setPlannerData({
        upcoming,
        aiSuggestions: [], // Las sugerencias se cargan internamente por PlannerSchedulePreview si es necesario
        coverageDays,
        backlogCount: socialPosts.filter((post) => post.status === 'draft').length,
      });
    } catch (error) {
      console.error('Error loading planner data:', error);
    } finally {
      setLoading(false);
    }
  }, [period, mapPostsToUpcoming]);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleGapFilled = useCallback((post: PlannerUpcomingPost) => {
    setUpcomingPosts((prev) => [...prev, post]);
    setPlannerData((prev) => {
      const newUpcoming = [...prev.upcoming, post];
      const coverageDays = (() => {
        if (newUpcoming.length === 0) return 0;
        const last = newUpcoming[newUpcoming.length - 1];
        return Math.max(
          0,
          Math.ceil((new Date(last.scheduledAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        );
      })();
      return {
        ...prev,
        upcoming: newUpcoming,
        coverageDays,
      };
    });
    // Recargar gaps después de llenar uno
    loadData();
  }, [loadData]);

  const handleGapsFilled = useCallback((posts: PlannerUpcomingPost[]) => {
    setUpcomingPosts((prev) => [...prev, ...posts]);
    setPlannerData((prev) => {
      const newUpcoming = [...prev.upcoming, ...posts];
      const coverageDays = (() => {
        if (newUpcoming.length === 0) return 0;
        const last = newUpcoming[newUpcoming.length - 1];
        return Math.max(
          0,
          Math.ceil((new Date(last.scheduledAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        );
      })();
      return {
        ...prev,
        upcoming: newUpcoming,
        coverageDays,
      };
    });
    // Recargar gaps después de llenar varios
    loadData();
  }, [loadData]);

  const periodOptions = [
    { value: '7d', label: 'Últimos 7 días' },
    { value: '30d', label: 'Últimos 30 días' },
    { value: '90d', label: 'Últimos 90 días' },
  ];

  const tabs = [
    { id: 'calendar', label: 'Estado del calendario' },
    { id: 'ai-calendar', label: 'Calendario IA semanal' },
    { id: 'performance', label: 'Rendimiento social & leads' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-500" />
                Planner & Social
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/dashboard/content/social-studio">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver
                </Button>
              </Link>
              <Select
                value={period}
                onChange={(e) => setPeriod(e.target.value as ContentStudioPeriod)}
                options={periodOptions}
                className="min-w-[180px]"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => loadData()}
                disabled={loading}
              >
                Actualizar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ScrollAnchorTabs tabs={tabs} />

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8 space-y-12">
        {/* Sección 1: Estado del calendario */}
        <section id="calendar" className="scroll-mt-32">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Estado del calendario
            </h2>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* PlannerSchedulePreview - Ocupa 2 columnas */}
            <div className="xl:col-span-2">
              <PlannerSchedulePreview
                planner={plannerData}
                loading={loading}
              />
            </div>

            {/* CalendarGapAlerts - Ocupa 1 columna */}
            <div>
              <CalendarGapAlerts
                posts={upcomingPosts}
                loading={loading}
                onGapFilled={handleGapFilled}
                onGapsFilled={handleGapsFilled}
              />
            </div>
          </div>
        </section>

        {/* Sección 2: Calendario IA semanal */}
        <section id="ai-calendar" className="scroll-mt-32">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-indigo-500" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Calendario IA semanal
            </h2>
          </div>

          <WeeklyAICalendarComponent loading={loading} />
        </section>

        {/* Sección 3: Rendimiento social & leads */}
        <section id="performance" className="scroll-mt-32">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Rendimiento social & leads
            </h2>
          </div>

          <ContentLeadAnalytics loading={loading} period={period} />
        </section>
      </div>

      <BackToTopButton />
    </div>
  );
}
