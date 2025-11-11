import { useCallback, useEffect, useState } from 'react';
import { BarChart3, Megaphone, RefreshCw, Sparkles } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Badge, Button, Tabs } from '../../../components/componentsreutilizables';
import {
  ActiveCampaigns,
  AISuggestions,
  KPICards,
  SocialGrowth,
  TopFunnels,
  UpcomingEvents,
} from '../components';
import { MarketingOverviewService } from '../services/marketingOverviewService';
import {
  AISuggestion,
  CampaignPerformance,
  FunnelPerformance,
  MarketingKPI,
  MarketingOverviewPeriod,
  SocialGrowthMetric,
  UpcomingEvent,
} from '../types';

const periodTabs = [
  { id: '7d', label: 'Últimos 7 días' },
  { id: '30d', label: 'Últimos 30 días' },
  { id: '90d', label: 'Últimos 90 días' },
] as const;

export default function OverviewMarketingPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<MarketingOverviewPeriod>('30d');
  const [loadingSnapshot, setLoadingSnapshot] = useState(true);
  const [kpis, setKpis] = useState<MarketingKPI[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignPerformance[]>([]);
  const [funnels, setFunnels] = useState<FunnelPerformance[]>([]);
  const [socialGrowth, setSocialGrowth] = useState<SocialGrowthMetric[]>([]);
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);

  const loadSnapshot = useCallback(async () => {
    setLoadingSnapshot(true);
    try {
      const snapshot = await MarketingOverviewService.getSnapshot(period);
      setKpis(snapshot.kpis);
      setCampaigns(snapshot.campaigns);
      setFunnels(snapshot.funnels);
      setSocialGrowth(snapshot.socialGrowth);
      setEvents(snapshot.events);
      setSuggestions(snapshot.aiSuggestions);
    } catch (error) {
      console.error('[OverviewMarketingPage] Error cargando datos:', error);
    } finally {
      setLoadingSnapshot(false);
    }
  }, [period]);

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  const handleRefresh = () => {
    loadSnapshot();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-[#0b1120] dark:via-[#0f172a] dark:to-[#020617]">
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800/60 dark:bg-[#0b1120]/80">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-indigo-900/40 dark:to-purple-900/30 rounded-2xl shadow-inner">
                  <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-slate-100">
                    Overview marketing
                  </h1>
                  <p className="text-gray-600 dark:text-slate-400 max-w-2xl">
                    Controla tus KPIs clave, funnels y activaciones de marketing en un solo dashboard y ejecuta la
                    siguiente mejor acción recomendada por IA.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="blue" size="md" className="shadow">
                  {user?.name ? `Hola, ${user.name.split(' ')[0]}` : 'Modo estratégico'}
                </Badge>
                <Button variant="secondary" onClick={handleRefresh} className="inline-flex items-center gap-2">
                  <RefreshCw className={`w-4 h-4 ${loadingSnapshot ? 'animate-spin' : ''}`} />
                  Actualizar datos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Tabs
            items={periodTabs.map((tab) => ({ id: tab.id, label: tab.label }))}
            activeTab={period}
            onTabChange={(tabId) => setPeriod(tabId as MarketingOverviewPeriod)}
            variant="pills"
            size="sm"
          />
          <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-300">
            <Sparkles className="w-4 h-4" />
            <span>Datos simulados a partir de campañas y funnels activos.</span>
          </div>
        </div>

        <div className="mb-8">
          <KPICards kpis={kpis} loading={loadingSnapshot} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <ActiveCampaigns campaigns={campaigns} loading={loadingSnapshot} className="xl:col-span-2" />
          <TopFunnels funnels={funnels} loading={loadingSnapshot} className="xl:col-span-2" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mt-6">
          <SocialGrowth networks={socialGrowth} loading={loadingSnapshot} className="xl:col-span-2" />
          <UpcomingEvents events={events} loading={loadingSnapshot} className="xl:col-span-2" />
        </div>

        <div className="mt-6">
          <AISuggestions suggestions={suggestions} loading={loadingSnapshot} className="xl:col-span-4" />
        </div>

        <div className="mt-10 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6 shadow-lg flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Megaphone className="w-6 h-6" />
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] opacity-80">Tip del día</p>
              <h3 className="text-lg font-semibold">
                Lanza hoy mismo una secuencia para leads que visitaron pricing en los últimos 3 días.
              </h3>
            </div>
          </div>
          <Button variant="ghost" className="bg-white/10 hover:bg-white/20 text-white">
            Ver flujo recomendado
          </Button>
        </div>
      </div>
    </div>
  );
}






