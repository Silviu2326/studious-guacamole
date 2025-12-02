import React, { useState, useEffect } from 'react';
import { Card, Button, MetricCards, MetricCardData } from '../../../components/componentsreutilizables';
import { CampaignCreatorWizard } from './CampaignCreatorWizard';
import {
  getCampaigns,
  getPerformance,
  Campaign,
  PerformanceMetrics
} from '../api/campaigns';
import {
  Plus,
  Play,
  Pause,
  Filter,
  Search,
  Facebook,
  Globe,
  AlertCircle,
  Package,
  Loader2
} from 'lucide-react';

export const CampaignsDashboardContainer: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [campaignsData, performanceData] = await Promise.all([
        getCampaigns(),
        getPerformance('2024-01-01', '2024-01-31')
      ]);

      setCampaigns(campaignsData);
      setPerformanceMetrics(performanceData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCampaignCreated = () => {
    loadDashboardData();
    setIsWizardOpen(false);
  };

  const handlePauseCampaign = async (id: string) => {
    try {
      // Aquí iría la llamada a updateCampaign
      setCampaigns(prev =>
        prev.map(camp =>
          camp.id === id ? { ...camp, status: 'paused' as const } : camp
        )
      );
    } catch (err: any) {
      alert('Error al pausar la campaña: ' + err.message);
    }
  };

  const handleResumeCampaign = async (id: string) => {
    try {
      setCampaigns(prev =>
        prev.map(camp =>
          camp.id === id ? { ...camp, status: 'active' as const } : camp
        )
      );
    } catch (err: any) {
      alert('Error al reanudar la campaña: ' + err.message);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (selectedPlatform !== 'all' && campaign.platform !== selectedPlatform) {
      return false;
    }
    if (selectedStatus !== 'all' && campaign.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: Campaign['status']) => {
    const statusConfig = {
      active: { label: 'Activa', color: 'bg-green-100 text-green-800' },
      paused: { label: 'Pausada', color: 'bg-yellow-100 text-yellow-800' },
      pending_review: { label: 'En Revisión', color: 'bg-blue-100 text-blue-800' },
      error: { label: 'Error', color: 'bg-red-100 text-red-800' }
    };
    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPlatformIcon = (platform: string) => {
    return platform === 'meta' ? (
      <Facebook className="w-5 h-5 text-blue-600" />
    ) : (
      <Globe className="w-5 h-5 text-red-600" />
    );
  };

  if (error) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadDashboardData}>
          Reintentar
        </Button>
      </Card>
    );
  }

  const metricCardsData: MetricCardData[] = performanceMetrics
    ? [
        {
          id: 'spend',
          title: 'Gasto Total',
          value: `€${performanceMetrics.total.spend.toFixed(2)}`,
          color: 'info',
        },
        {
          id: 'cpl',
          title: 'Coste por Lead (CPL)',
          value: `€${performanceMetrics.total.cpl.toFixed(2)}`,
          color: 'info',
        },
        {
          id: 'roas',
          title: 'Retorno (ROAS)',
          value: `${performanceMetrics.total.roas.toFixed(1)}:1`,
          color: 'success',
        },
        {
          id: 'conversions',
          title: 'Conversiones',
          value: performanceMetrics.total.conversions.toString(),
          color: 'success',
        },
        {
          id: 'ctr',
          title: 'Tasa de Clics (CTR)',
          value: performanceMetrics.total.ctr,
          color: 'info',
        },
        {
          id: 'clicks',
          title: 'Total Clics',
          value: (performanceMetrics.total.clicks || 0).toString(),
          color: 'info',
        },
      ]
    : [
        {
          id: 'spend',
          title: 'Gasto Total',
          value: '€0.00',
          color: 'info',
          loading: isLoading,
        },
        {
          id: 'cpl',
          title: 'Coste por Lead (CPL)',
          value: '€0.00',
          color: 'info',
          loading: isLoading,
        },
        {
          id: 'roas',
          title: 'Retorno (ROAS)',
          value: '0:1',
          color: 'success',
          loading: isLoading,
        },
        {
          id: 'conversions',
          title: 'Conversiones',
          value: '0',
          color: 'success',
          loading: isLoading,
        },
        {
          id: 'ctr',
          title: 'Tasa de Clics (CTR)',
          value: '0%',
          color: 'info',
          loading: isLoading,
        },
        {
          id: 'clicks',
          title: 'Total Clics',
          value: '0',
          color: 'info',
          loading: isLoading,
        },
      ];

  return (
    <div className="space-y-6">
      {/* Métricas de Rendimiento */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Métricas de Rendimiento</h2>
        </div>
        <MetricCards data={metricCardsData} columns={3} />
      </div>

      {/* Lista de Campañas */}
      <div>
        {/* Toolbar superior */}
        <div className="flex items-center justify-end mb-6">
          <Button onClick={() => setIsWizardOpen(true)} leftIcon={<Plus size={20} />}>
            Nueva Campaña
          </Button>
        </div>

        {/* Filtros */}
        <Card className="mb-6 bg-white shadow-sm">
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Buscar campañas..."
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-600" />
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  >
                    <option value="all">Todas las plataformas</option>
                    <option value="meta">Meta</option>
                    <option value="google">Google</option>
                  </select>
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activas</option>
                  <option value="paused">Pausadas</option>
                  <option value="pending_review">En Revisión</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
              <span>{filteredCampaigns.length} resultados encontrados</span>
              <span>{[selectedPlatform, selectedStatus].filter(f => f !== 'all').length} filtros aplicados</span>
            </div>
          </div>
        </Card>

        {/* Grid de Campañas */}
        {isLoading ? (
          <Card className="p-8 text-center bg-white shadow-sm">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando...</p>
          </Card>
        ) : filteredCampaigns.length === 0 ? (
          <Card className="p-8 text-center bg-white shadow-sm">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay campañas aún
            </h3>
            <p className="text-gray-600 mb-4">
              Crea tu primera campaña publicitaria para empezar a captar clientes
            </p>
            <Button onClick={() => setIsWizardOpen(true)}>
              Crear Campaña
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCampaigns.map((campaign) => (
              <Card
                key={campaign.id}
                variant="hover"
                className="h-full flex flex-col transition-shadow overflow-hidden bg-white shadow-sm"
              >
                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(campaign.platform)}
                      <div>
                        <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {campaign.platform}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(campaign.status)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Gasto</span>
                      <span className="font-semibold text-gray-900">
                        €{campaign.summary.spend.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">CPL</span>
                      <span className="font-semibold text-gray-900">
                        €{campaign.summary.cpl.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Conversiones</span>
                      <span className="font-semibold text-green-600">
                        {campaign.summary.conversions}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100 px-4 pb-4">
                  {campaign.status === 'active' ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePauseCampaign(campaign.id)}
                      className="text-yellow-700 hover:bg-yellow-50"
                    >
                      <Pause size={16} className="mr-1" />
                      Pausar
                    </Button>
                  ) : campaign.status === 'paused' ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResumeCampaign(campaign.id)}
                      className="text-green-700 hover:bg-green-50"
                    >
                      <Play size={16} className="mr-1" />
                      Reanudar
                    </Button>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Wizard de Creación */}
      <CampaignCreatorWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onCampaignCreated={handleCampaignCreated}
      />
    </div>
  );
};

