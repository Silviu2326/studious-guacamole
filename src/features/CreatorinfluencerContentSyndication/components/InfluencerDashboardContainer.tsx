import React, { useState, useEffect } from 'react';
import { InfluencerListTable } from './InfluencerListTable';
import { CampaignFormModal } from './CampaignFormModal';
import { 
  getInfluencers, 
  getCampaigns, 
  createInfluencer, 
  deleteInfluencer,
  Influencer, 
  Campaign 
} from '../api/influencers';
import { Plus, Filter, Search, X, Users, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';
import { Card } from '../../../components/componentsreutilizables';
import { MetricCards } from '../../../components/componentsreutilizables';

interface InfluencerDashboardContainerProps {
  userId: string;
}

/**
 * Componente principal que obtiene los datos de todos los influencers y campañas.
 * Maneja el estado general de la página, filtros y la apertura de modales.
 */
export const InfluencerDashboardContainer: React.FC<InfluencerDashboardContainerProps> = ({
  userId
}) => {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<{ niche: string; status: string }>({
    niche: '',
    status: ''
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState<boolean>(false);
  const [isInfluencerModalOpen, setIsInfluencerModalOpen] = useState<boolean>(false);
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, [activeFilters]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [influencersData, campaignsData] = await Promise.all([
        getInfluencers({
          filterByNiche: activeFilters.niche || undefined
        }),
        getCampaigns({
          status: activeFilters.status || undefined
        })
      ]);
      
      setInfluencers(influencersData);
      setCampaigns(campaignsData);
    } catch (err) {
      setError('Error al cargar los datos. Por favor, intenta nuevamente.');
      console.error('Error cargando datos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectInfluencer = (influencerId: string) => {
    setSelectedInfluencerId(influencerId);
    // TODO: Mostrar detalles del influencer
  };

  const handleAddNewCampaign = (influencerId: string) => {
    setSelectedInfluencerId(influencerId);
    setIsCampaignModalOpen(true);
  };

  const handleCreateCampaign = async (campaignData: any) => {
    try {
      // La creación de la campaña se manejará en la página principal
      await loadData();
    } catch (error) {
      console.error('Error creando campaña:', error);
    }
  };

  const handleDeleteInfluencer = async (influencerId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este influencer?')) return;
    
    try {
      await deleteInfluencer(influencerId);
      await loadData();
    } catch (error) {
      console.error('Error eliminando influencer:', error);
      alert('Error al eliminar el influencer. Por favor, intenta nuevamente.');
    }
  };

  const filteredInfluencers = influencers.filter(inf => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        inf.name.toLowerCase().includes(query) ||
        inf.niche.toLowerCase().includes(query) ||
        inf.email?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const niches = Array.from(new Set(influencers.map(inf => inf.niche)));

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button onClick={() => setIsInfluencerModalOpen(true)} leftIcon={<Plus size={20} />}>
          Agregar Influencer
        </Button>
      </div>

      {/* Métricas/KPIs */}
      <MetricCards
        data={[
          {
            id: 'total-influencers',
            title: 'Total Influencers',
            value: influencers.length,
            color: 'info',
            icon: <Users size={20} />
          },
          {
            id: 'active-campaigns',
            title: 'Campañas Activas',
            value: campaigns.filter(c => c.status === 'active').length,
            color: 'success',
            icon: <TrendingUp size={20} />
          },
          {
            id: 'total-campaigns',
            title: 'Total Campañas',
            value: campaigns.length,
            color: 'info',
            icon: <Users size={20} />
          }
        ]}
        columns={3}
      />

      {/* Sistema de Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              {/* Input de búsqueda */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, nicho o email..."
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>

              {/* Botón de filtros */}
              <Button
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              >
                Filtros
                {(activeFilters.niche || activeFilters.status) && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                    {(activeFilters.niche ? 1 : 0) + (activeFilters.status ? 1 : 0)}
                  </span>
                )}
              </Button>

              {/* Botón limpiar */}
              {(activeFilters.niche || activeFilters.status || searchQuery) && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setActiveFilters({ niche: '', status: '' });
                    setSearchQuery('');
                  }}
                  leftIcon={<X size={18} />}
                >
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Panel de filtros avanzados */}
          {showFilters && (
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filtro de nicho */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Filter size={16} className="inline mr-1" />
                    Nicho
                  </label>
                  <select
                    value={activeFilters.niche}
                    onChange={(e) => setActiveFilters(prev => ({ ...prev, niche: e.target.value }))}
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  >
                    <option value="">Todos los nichos</option>
                    {niches.map(niche => (
                      <option key={niche} value={niche}>{niche}</option>
                    ))}
                  </select>
                </div>

                {/* Filtro de estado */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Filter size={16} className="inline mr-1" />
                    Estado
                  </label>
                  <select
                    value={activeFilters.status}
                    onChange={(e) => setActiveFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  >
                    <option value="">Todos los estados</option>
                    <option value="active">Activa</option>
                    <option value="completed">Completada</option>
                    <option value="pending">Pendiente</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Resumen de resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{filteredInfluencers.length} {filteredInfluencers.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}</span>
            <span>
              {((activeFilters.niche ? 1 : 0) + (activeFilters.status ? 1 : 0) + (searchQuery ? 1 : 0))} {((activeFilters.niche ? 1 : 0) + (activeFilters.status ? 1 : 0) + (searchQuery ? 1 : 0)) === 1 ? 'filtro aplicado' : 'filtros aplicados'}
            </span>
          </div>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center gap-3 text-red-600">
            <X size={20} />
            <p>{error}</p>
          </div>
        </Card>
      )}

      {/* Tabla de influencers */}
      {isLoading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </Card>
      ) : (
        <InfluencerListTable
          influencers={filteredInfluencers}
          onSelectInfluencer={handleSelectInfluencer}
          onAddNewCampaign={handleAddNewCampaign}
          onDelete={handleDeleteInfluencer}
        />
      )}

      {/* Modal para crear campaña */}
      <CampaignFormModal
        isOpen={isCampaignModalOpen}
        onClose={() => {
          setIsCampaignModalOpen(false);
          setSelectedInfluencerId(null);
        }}
        onSubmit={handleCreateCampaign}
        influencerId={selectedInfluencerId || undefined}
      />

      {/* Modal para agregar influencer (simplificado) */}
      {isInfluencerModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Agregar Nuevo Influencer
            </h3>
            <p className="text-gray-600 mb-4">
              Esta funcionalidad será implementada con un formulario completo en una versión futura.
            </p>
            <Button 
              onClick={() => setIsInfluencerModalOpen(false)}
              fullWidth
            >
              Cerrar
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};


