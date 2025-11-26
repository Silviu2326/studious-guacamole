import React, { useEffect, useState } from 'react';
import { MarketingOverviewService } from '../services/marketingOverviewService';
import {
  KPICards,
  TopFunnels,
  ActiveCampaigns,
  AutomationRadar,
  ChannelHealthWidget,
  SatisfactionPulse,
  RecentWinsWidget,
  CustomerAttentionWidget,
  ContentCalendarWidget,
  TopContentWidget,
  AISuggestions,
  WeeklyAIStrategyComponent,
  ExperimentsTracker,
  PlaybooksProgressWidget,
  KPIAlerts,
  HotLeads,
  ForecastLeadsIngresos
} from '../components';
import { 
  MarketingKPI, 
  CampaignPerformance, 
  FunnelPerformance, 
  AISuggestion,
  WeeklyAIStrategy,
  KPIAlert,
  HotLeadsSnapshot,
  ForecastSnapshot
} from '../types';
import { ds } from '../../adherencia/ui/ds';
import { Calendar, Filter, Settings, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';

export default function MarketingOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<MarketingKPI[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignPerformance[]>([]);
  const [funnels, setFunnels] = useState<FunnelPerformance[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [weeklyStrategy, setWeeklyStrategy] = useState<WeeklyAIStrategy | null>(null);
  const [alerts, setAlerts] = useState<KPIAlert[]>([]);
  const [hotLeads, setHotLeads] = useState<HotLeadsSnapshot | null>(null);
  const [forecast, setForecast] = useState<ForecastSnapshot | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Parallel fetching
        const [
          fetchedKpis,
          fetchedCampaigns,
          fetchedFunnels,
          fetchedSuggestions,
          fetchedStrategy,
          fetchedHotLeads,
          fetchedForecast
        ] = await Promise.all([
          MarketingOverviewService.getKPIs('30d'),
          MarketingOverviewService.getCampaigns(),
          MarketingOverviewService.getFunnels('30d'),
          MarketingOverviewService.getSuggestions(),
          MarketingOverviewService.getWeeklyAIStrategy(),
          MarketingOverviewService.getHotLeads(),
          MarketingOverviewService.getForecast('30d')
        ]);

        setKpis(fetchedKpis);
        setCampaigns(fetchedCampaigns);
        setFunnels(fetchedFunnels);
        setAiSuggestions(fetchedSuggestions);
        setWeeklyStrategy(fetchedStrategy);
        setHotLeads(fetchedHotLeads);
        setForecast(fetchedForecast);

        // Generate alerts from KPIs
        const generatedAlerts = await MarketingOverviewService.getKPIAlerts(fetchedKpis);
        setAlerts(generatedAlerts);

      } catch (error) {
        console.error('Error loading marketing overview:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0b1120] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={`${ds.typography.h1} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
            Marketing Overview
          </h1>
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Visión 360° de tu negocio digital
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="secondary" size="sm" className="hidden sm:flex items-center gap-2">
             <Filter className="w-4 h-4" /> Filtros
           </Button>
           <Button variant="secondary" size="sm" className="hidden sm:flex items-center gap-2">
             <Calendar className="w-4 h-4" /> Noviembre 2025
           </Button>
           <Button variant="ghost" size="icon">
             <Settings className="w-5 h-5" />
           </Button>
        </div>
      </div>

      {/* Top Row: Alertas Urgentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
         {/* Columna 1: Hot Leads (Alta Prioridad) */}
         <div className="lg:col-span-2">
            <HotLeads snapshot={hotLeads} loading={loading} />
         </div>
         {/* Columna 2: Alertas de KPIs */}
         <div>
            <KPIAlerts alerts={alerts} />
         </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* A. Funnels & Adquisición */}
        <div className="lg:col-span-2 space-y-6">
           <KPICards kpis={kpis.filter(k => ['leads', 'funnel-revenue'].includes(k.id))} loading={loading} />
           <ForecastLeadsIngresos forecast={forecast} loading={loading} />
           <TopFunnels funnels={funnels} loading={loading} />
        </div>

        {/* B. Campañas & Automatización */}
        <div className="lg:col-span-1 space-y-6">
           <AutomationRadar />
           <ActiveCampaigns campaigns={campaigns} loading={loading} className="col-span-1" />
           <ChannelHealthWidget />
        </div>

        {/* C. Comunidad & Engagement */}
        <div className="lg:col-span-1 space-y-6">
           <SatisfactionPulse />
           <CustomerAttentionWidget />
           <RecentWinsWidget />
        </div>
      </div>

      {/* Sección Inferior: Contenido e IA (Full Width Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* D. Content Studio */}
         <div className="space-y-6">
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} mb-4`}>Content Studio</h3>
            <div className="grid grid-cols-2 gap-4">
               <TopContentWidget className="col-span-1 h-40" />
               <ContentCalendarWidget className="col-span-1 h-40" />
            </div>
            {/* Reusing AISuggestions for Content Ideas specifically if filtered, or general */}
            <AISuggestions suggestions={aiSuggestions.slice(0, 2)} loading={loading} className="col-span-2" />
         </div>

         {/* E. Inteligencia IA */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className={`${ds.typography.h3} ${ds.color.textPrimary}`}>Estrategia & IA</h3>
               <Button variant="ghost" size="sm" className="text-indigo-600">Ver Lab <RefreshCw className="w-3 h-3 ml-1"/></Button>
            </div>
            
            <WeeklyAIStrategyComponent strategy={weeklyStrategy} loading={loading} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <ExperimentsTracker snapshot={null} loading={false} /> {/* Snapshot mocked inside or null */}
               <PlaybooksProgressWidget />
            </div>
         </div>

      </div>
    </div>
  );
}
