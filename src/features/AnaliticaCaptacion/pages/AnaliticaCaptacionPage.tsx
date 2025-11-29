import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Download,
  Filter,
  LineChart,
  Search,
  Target,
  Users,
} from 'lucide-react';
import { Button, Card, Input, MetricCards } from '../../../components/componentsreutilizables';
import {
  CampaignPerformance,
  FunnelStage,
  LeadSourceStat,
  fetchCampaignPerformance,
  fetchFunnelStages,
  fetchLeadSourceStats,
} from '../api';
import { CampaignPerformanceTable, FunnelOverview, LeadSourcesBreakdown } from '../components';

export function AnaliticaCaptacionPage() {
  const [sources, setSources] = useState<LeadSourceStat[]>([]);
  const [stages, setStages] = useState<FunnelStage[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignPerformance[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const [sourceStats, funnelStages, campaignStats] = await Promise.all([
        fetchLeadSourceStats(),
        fetchFunnelStages(),
        fetchCampaignPerformance(),
      ]);
      setSources(sourceStats);
      setStages(funnelStages);
      setCampaigns(campaignStats);
    };

    void loadData();
  }, []);

  const metrics = useMemo(() => {
    const totalLeads = sources.reduce((sum, source) => sum + source.leads, 0);
    const visitStage = stages.find(stage => stage.stage === 'visita');
    const altaStage = stages.find(stage => stage.stage === 'alta');
    const averageLeadToMemberRate =
      campaigns.length > 0
        ? campaigns.reduce((sum, campaign) => sum + campaign.leadToMemberRate, 0) / campaigns.length
        : 0;

    return [
      {
        id: 'total-leads',
        title: 'Leads captados',
        value: totalLeads,
        subtitle: 'Últimos 30 días',
        color: 'info' as const,
        icon: <Users size={18} />,
      },
      {
        id: 'visits',
        title: 'Visitas agendadas',
        value: visitStage?.count ?? 0,
        subtitle: `Conversión lead → visita ${(visitStage?.conversionRateToNext ?? 0) * 100}%`,
        color: 'success' as const,
        icon: <Target size={18} />,
      },
      {
        id: 'memberships',
        title: 'Altas logradas',
        value: altaStage?.count ?? 0,
        subtitle: 'Membresías confirmadas',
        color: 'primary' as const,
        icon: <BarChart3 size={18} />,
      },
      {
        id: 'lead-to-member-rate',
        title: 'Lead → Alta promedio',
        value: `${Math.round(averageLeadToMemberRate * 100)}%`,
        subtitle: 'Promedio ponderado por campaña',
        color: 'warning' as const,
        icon: <LineChart size={18} />,
      },
    ];
  }, [sources, stages, campaigns]);

  const filteredCampaigns = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return campaigns;
    }

    return campaigns.filter(campaign => {
      return (
        campaign.name.toLowerCase().includes(term) ||
        campaign.channel.toLowerCase().includes(term)
      );
    });
  }, [campaigns, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <header className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="mr-4 rounded-xl bg-blue-100 p-2 ring-1 ring-blue-200/70">
                <LineChart size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
                  Analítica de captación
                </h1>
                <p className="text-gray-600">
                  Observa el rendimiento de tus campañas, identifica los canales con mayor impacto y optimiza el embudo lead → visita → alta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-6">
        <div className="space-y-6">
          <div className="flex items-center justify-end">
            <Button variant="secondary" leftIcon={<Download size={18} />}>
              Exportar reporte
            </Button>
          </div>

          <MetricCards data={metrics} columns={4} />

          <Card className="bg-white shadow-sm ring-1 ring-slate-200" padding="md">
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                  <Input
                    value={searchTerm}
                    onChange={event => setSearchTerm(event.target.value)}
                    placeholder="Buscar campañas por nombre o canal..."
                    leftIcon={<Search size={18} />}
                    aria-label="Buscar campañas"
                  />
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Button variant="secondary" leftIcon={<Filter size={18} />} className="whitespace-nowrap">
                      Filtros avanzados
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setSearchTerm('')}
                      disabled={searchTerm.length === 0}
                      className="whitespace-nowrap text-sm"
                    >
                      Limpiar búsqueda
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-600">
                <span>{sources.length} canales activos analizados</span>
                <span>{filteredCampaigns.length} campañas coinciden con los filtros</span>
              </div>
            </div>
          </Card>

          <LeadSourcesBreakdown sources={sources} />
          <FunnelOverview stages={stages} />
          <CampaignPerformanceTable campaigns={filteredCampaigns} />

          <Card padding="lg" className="bg-white text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-lg font-semibold text-gray-900">Próximamente</p>
            <p className="mt-2 text-gray-600">
              Filtros por rango de fechas, comparativas por sede y atribución multicanal avanzada.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}

