import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { CampaignList } from '../components/CampaignList';
import { CampaignBuilderContainer } from '../components/CampaignBuilderContainer';
import { CampaignAnalyticsDashboard } from '../components/CampaignAnalyticsDashboard';
import { useCampaignAnalytics } from '../hooks/useCampaignAnalytics';
import {
  getCampaigns,
  deleteCampaign,
  EmailCampaign
} from '../api/campaigns';
import {
  Mail,
  Plus,
  Filter,
  Loader2,
  Lightbulb,
  BarChart3,
  X
} from 'lucide-react';

type ViewMode = 'list' | 'builder' | 'analytics';

/**
 * Página principal de Email Marketing & Newsletters
 * 
 * Permite a los entrenadores crear, programar y analizar campañas de email
 * integradas con su CRM y segmentación avanzada.
 */
export const EmailMarketingYNewslettersPage: React.FC = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const {
    analytics,
    isLoading: analyticsLoading
  } = useCampaignAnalytics({
    campaignId: viewMode === 'analytics' && selectedCampaignId ? selectedCampaignId : ''
  });

  React.useEffect(() => {
    loadCampaigns();
  }, [statusFilter]);

  const loadCampaigns = async () => {
    setIsLoading(true);
    try {
      const response = await getCampaigns({
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error cargando campañas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCampaign = () => {
    setSelectedCampaignId(null);
    setViewMode('builder');
  };

  const handleEditCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setViewMode('builder');
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta campaña?')) return;

    try {
      await deleteCampaign(campaignId);
      await loadCampaigns();
    } catch (error) {
      console.error('Error eliminando campaña:', error);
      alert('Error al eliminar la campaña. Por favor, intenta nuevamente.');
    }
  };

  const handleViewAnalytics = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setViewMode('analytics');
  };

  const handleView = (campaignId: string) => {
    // TODO: Implementar vista previa
    console.log('Ver campaña:', campaignId);
  };

  const handleSaveCampaign = (campaign: EmailCampaign) => {
    loadCampaigns();
    setViewMode('list');
    setSelectedCampaignId(null);
  };

  if (viewMode === 'builder') {
    return (
      <CampaignBuilderContainer
        campaignId={selectedCampaignId}
        onSave={handleSaveCampaign}
        onCancel={() => {
          setViewMode('list');
          setSelectedCampaignId(null);
        }}
      />
    );
  }

  if (viewMode === 'analytics' && analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setViewMode('list');
                      setSelectedCampaignId(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                      Analíticas de Campaña
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Métricas y rendimiento de la campaña de email
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          {analyticsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : (
            <CampaignAnalyticsDashboard analytics={analytics} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-purple-100 rounded-xl mr-4 ring-1 ring-purple-200/70">
                  <Mail size={24} className="text-purple-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Email Marketing & Newsletters
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Crea, programa y analiza campañas de email integradas con tu CRM
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleCreateCampaign}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Nueva Campaña
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Información educativa */}
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Lightbulb className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Qué es Email Marketing & Newsletters?
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Esta herramienta reemplaza herramientas externas como Mailchimp, integrando el email marketing 
                directamente con tu CRM de TrainerERP. Crea campañas visualmente atractivas con plantillas 
                específicas para fitness, segmenta tu audiencia basándote en el comportamiento de tus clientes, 
                y analiza el rendimiento con métricas detalladas. Todo integrado para maximizar la retención y 
                generar nuevas ventas.
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todas las campañas</option>
              <option value="draft">Borradores</option>
              <option value="scheduled">Programadas</option>
              <option value="sent">Enviadas</option>
            </select>
          </div>
        </div>

        {/* Lista de campañas */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : (
          <CampaignList
            campaigns={campaigns}
            onView={handleView}
            onEdit={handleEditCampaign}
            onDelete={handleDeleteCampaign}
            onViewAnalytics={handleViewAnalytics}
          />
        )}
      </div>
    </div>
  );
};

export default EmailMarketingYNewslettersPage;


