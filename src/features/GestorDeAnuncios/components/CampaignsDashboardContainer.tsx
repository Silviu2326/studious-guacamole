import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { PerformanceMetricsGrid } from './PerformanceMetricsGrid';
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
  MoreVertical,
  Filter,
  Search,
  Facebook,
  Globe,
  AlertCircle
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={loadDashboardData}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const summaryMetrics = performanceMetrics
    ? {
        cpl: performanceMetrics.total.cpl,
        roas: performanceMetrics.total.roas,
        ctr: performanceMetrics.total.ctr,
        spend: performanceMetrics.total.spend,
        conversions: performanceMetrics.total.conversions,
        clicks: performanceMetrics.total.clicks
      }
    : {
        cpl: 0,
        roas: 0,
        ctr: '0%',
        spend: 0,
        conversions: 0,
        clicks: 0
      };

  return (
    <div className="space-y-6">
      {/* Métricas de Rendimiento */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Métricas de Rendimiento</h2>
        </div>
        <PerformanceMetricsGrid metrics={summaryMetrics} isLoading={isLoading} />
      </div>

      {/* Lista de Campañas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Tus Campañas</h2>
          <button
            onClick={() => setIsWizardOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <Plus className="w-5 h-5" />
            Nueva Campaña
          </button>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todas las plataformas</option>
              <option value="meta">Meta</option>
              <option value="google">Google</option>
            </select>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="paused">Pausadas</option>
            <option value="pending_review">En Revisión</option>
          </select>
        </div>

        {/* Grid de Campañas */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay campañas aún
              </h3>
              <p className="text-gray-600 mb-6">
                Crea tu primera campaña publicitaria para empezar a captar clientes
              </p>
              <button
                onClick={() => setIsWizardOpen(true)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Crear Campaña
              </button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCampaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
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

                <div className="space-y-3 mb-4">
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

                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                  {campaign.status === 'active' ? (
                    <button
                      onClick={() => handlePauseCampaign(campaign.id)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-yellow-700 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition"
                    >
                      <Pause className="w-4 h-4" />
                      Pausar
                    </button>
                  ) : campaign.status === 'paused' ? (
                    <button
                      onClick={() => handleResumeCampaign(campaign.id)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition"
                    >
                      <Play className="w-4 h-4" />
                      Reanudar
                    </button>
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

