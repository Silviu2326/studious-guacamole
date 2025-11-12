import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { Badge, Button, Card, MetricCards, Tabs } from '../../../components/componentsreutilizables';
import { useAuth } from '../../../context/AuthContext';
import type { MetricCardData } from '../../../components/componentsreutilizables/MetricCards';
import type { ContentSocialSnapshot, ContentStudioPeriod } from '../types';
import { getContentSocialStudioSnapshot } from '../api';
import {
  AIContentWorkbench,
  BrandProfileConfig,
  ClipperHighlights,
  ClientTransformationPostGenerator,
  ContentLeadAnalytics,
  FAQContentGenerator,
  InternalContentIdeasGenerator,
  ICON_MAP,
  ModuleHighlights,
  PlannerSchedulePreview,
  PromotionalContentTemplates,
  SyndicationOverview,
  VideoStudioSpotlight,
} from '../components';

const sectionTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'planner', label: 'Planner RRSS' },
  { id: 'video', label: 'Video Studio' },
  { id: 'clipper', label: 'Biblioteca' },
  { id: 'syndication', label: 'Creator Syndication' },
  { id: 'ai', label: 'IA Creativa' },
  { id: 'brand-profile', label: 'Perfil de Marca' },
  { id: 'promotional', label: 'Contenido Promocional' },
  { id: 'transformations', label: 'Transformaciones' },
  { id: 'faq-content', label: 'Contenido FAQ' },
  { id: 'lead-analytics', label: 'Analytics de Leads' },
  { id: 'internal-content', label: 'Contenido Interno' },
] as const;

type SectionTabId = typeof sectionTabs[number]['id'];

const emptySnapshot: ContentSocialSnapshot = {
  metrics: [],
  modules: [],
  planner: { backlogCount: 0, coverageDays: 0, upcoming: [], aiSuggestions: [] },
  video: { projects: [], automationPlaybooks: 0, readyToPublish: 0, libraryAssets: 0 },
  clipper: { totalClips: 0, newThisWeek: 0, categories: [], featured: [], trendingTags: [] },
  syndication: { activeCampaigns: 0, creatorsNetwork: 0, pipeline: [] },
  ai: { assistants: [], quickIdeas: [], lastUpdated: new Date().toISOString() },
  clientTransformations: { availableClients: [], generatedPosts: [], templates: [] },
  faqContent: { topQuestions: [], contentIdeas: [] },
  promotionalContent: { templates: [], availablePlans: [], activeOffers: [], generatedContent: [] },
};

export default function ContentSocialStudioPage() {
  const { user } = useAuth();
  const period: ContentStudioPeriod = '30d';
  const [snapshot, setSnapshot] = useState<ContentSocialSnapshot>(emptySnapshot);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sectionTab, setSectionTab] = useState<SectionTabId>('overview');

  const loadSnapshot = useCallback(
    async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getContentSocialStudioSnapshot(period);
        setSnapshot(data);
      } catch (err) {
        console.error('[ContentSocialStudio] Error loading snapshot', err);
        setError('No pudimos cargar los datos. Intenta nuevamente en unos segundos.');
        setSnapshot(emptySnapshot);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  const metricCardsData: MetricCardData[] = useMemo(() => {
    if (loading && snapshot.metrics.length === 0) {
      return Array.from({ length: 4 }).map((_, index) => ({
        id: `metric-loading-${index}`,
        title: '',
        value: '',
        loading: true,
      }));
    }

    return snapshot.metrics.map((metric) => {
      const Icon = metric.icon ? ICON_MAP[metric.icon] : undefined;
      return {
        id: metric.id,
        title: metric.title,
        value: metric.value,
        subtitle: metric.subtitle,
        trend: metric.trend,
        color: metric.color,
        icon: Icon ? <Icon className="w-5 h-5" /> : undefined,
      };
    });
  }, [snapshot.metrics, loading]);

  const handleRefresh = () => {
    loadSnapshot();
  };

  const renderSectionContent = () => {
    switch (sectionTab) {
      case 'planner':
        return <PlannerSchedulePreview planner={snapshot.planner} loading={loading} />;
      case 'video':
        return <VideoStudioSpotlight video={snapshot.video} loading={loading} />;
      case 'clipper':
        return <ClipperHighlights clipper={snapshot.clipper} loading={loading} />;
      case 'syndication':
        return <SyndicationOverview syndication={snapshot.syndication} loading={loading} />;
      case 'ai':
        return <AIContentWorkbench ai={snapshot.ai} loading={loading} />;
      case 'transformations':
        return <ClientTransformationPostGenerator loading={loading} />;
      case 'faq-content':
        return <FAQContentGenerator loading={loading} />;
      case 'brand-profile':
        return <BrandProfileConfig loading={loading} />;
      case 'promotional':
        return <PromotionalContentTemplates loading={loading} />;
      case 'lead-analytics':
        return <ContentLeadAnalytics loading={loading} period={period} />;
      case 'internal-content':
        return <InternalContentIdeasGenerator loading={loading} />;
      case 'overview':
      default:
        return (
          <div className="space-y-6">
            <ModuleHighlights modules={snapshot.modules} loading={loading && snapshot.modules.length === 0} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <PlannerSchedulePreview planner={snapshot.planner} loading={loading} />
              </div>
              <div className="xl:col-span-1">
                <SyndicationOverview syndication={snapshot.syndication} loading={loading} />
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <VideoStudioSpotlight video={snapshot.video} loading={loading} />
              <ClipperHighlights clipper={snapshot.clipper} loading={loading} />
            </div>
            <AIContentWorkbench ai={snapshot.ai} loading={loading} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <BrandProfileConfig loading={loading} />
              <PromotionalContentTemplates loading={loading} />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <ClientTransformationPostGenerator loading={loading} />
              <FAQContentGenerator loading={loading} />
            </div>
            <ContentLeadAnalytics loading={loading} period={period} />
            <InternalContentIdeasGenerator loading={loading} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-[#0b1120] dark:via-[#0f172a] dark:to-[#020617]">
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800/60 dark:bg-[#0b1120]/80">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-gradient-to-br from-violet-100 to-rose-200 dark:from-violet-900/40 dark:to-rose-900/30 rounded-2xl shadow-inner">
                  <Sparkles className="w-6 h-6 text-violet-600 dark:text-violet-300" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-slate-100">
                    Content & Social Studio
                  </h1>
                  <p className="text-gray-600 dark:text-slate-400 max-w-2xl">
                    Coordina planificación, video, biblioteca, creadores e IA creativa para activar distribución
                    orgánica coherente en todos tus canales.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="purple" size="md" className="shadow">
                  Suite IA Creativa
                </Badge>
                <Button
                  variant="secondary"
                  onClick={handleRefresh}
                  className="inline-flex items-center gap-2"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Actualizar
                </Button>
                <Button variant="primary" className="inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Crear contenido IA
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-300">
          <Sparkles className="w-4 h-4" />
          <span>
            {user?.name ? `${user.name.split(' ')[0]}, ` : ''}los datos son simulados según actividad orgánica
          </span>
        </div>

        {error ? (
          <Card className="p-6 border border-rose-200 bg-rose-50 text-rose-700">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{error}</span>
              <Button variant="ghost" size="sm" onClick={handleRefresh}>
                Reintentar
              </Button>
            </div>
          </Card>
        ) : null}

        <MetricCards data={metricCardsData} columns={4} />

        <Card className="p-0 bg-white shadow-sm">
          <div className="px-4 py-3 border-b border-slate-200">
            <Tabs
              items={sectionTabs.map((tab) => ({ id: tab.id, label: tab.label }))}
              activeTab={sectionTab}
              onTabChange={(tabId) => setSectionTab(tabId as SectionTabId)}
              variant="underline"
              size="md"
            />
          </div>
          <div className="p-6 space-y-6">{renderSectionContent()}</div>
        </Card>
      </div>
    </div>
  );
}

