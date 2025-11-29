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
  X,
  Search
} from 'lucide-react';
import { Card, Button } from '../../../components/componentsreutilizables';

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
              <div className="flex items-center">
                <button
                  onClick={() => {
                    setViewMode('list');
                    setSelectedCampaignId(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition mr-4"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <BarChart3 size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Analíticas de Campaña
                  </h1>
                  <p className="text-gray-600">
                    Métricas y rendimiento de la campaña de email
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          {analyticsLoading ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando...</p>
            </Card>
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
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Mail size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Email Marketing & Newsletters
                  </h1>
                  <p className="text-gray-600">
                    Crea, programa y analiza campañas de email integradas con tu CRM
                  </p>
                </div>
              </div>
              
              <Button onClick={handleCreateCampaign}>
                <Plus size={20} className="mr-2" />
                Nueva Campaña
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Información educativa */}
          <Card className="bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Lightbulb className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
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
          </Card>

          {/* Filtros */}
          <Card className="bg-white shadow-sm">
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                    >
                      <option value="all">Todas las campañas</option>
                      <option value="draft">Borradores</option>
                      <option value="scheduled">Programadas</option>
                      <option value="sent">Enviadas</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Lista de campañas */}
          {isLoading ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando...</p>
            </Card>
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
    </div>
  );
};

export default EmailMarketingYNewslettersPage;


