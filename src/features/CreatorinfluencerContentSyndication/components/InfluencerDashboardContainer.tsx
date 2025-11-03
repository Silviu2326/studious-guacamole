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
import { Plus, Filter, Search, X, Users, TrendingUp } from 'lucide-react';

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
      {/* Header con acciones */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Influencers & Colaboraciones</h2>
          <p className="text-gray-600 mt-1">
            {influencers.length} {influencers.length === 1 ? 'influencer registrado' : 'influencers registrados'}
          </p>
        </div>
        <button
          onClick={() => setIsInfluencerModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Agregar Influencer
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, nicho o email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Filtro de nicho */}
          <div className="w-full md:w-48">
            <select
              value={activeFilters.niche}
              onChange={(e) => setActiveFilters(prev => ({ ...prev, niche: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Todos los nichos</option>
              {niches.map(niche => (
                <option key={niche} value={niche}>{niche}</option>
              ))}
            </select>
          </div>

          {/* Botón limpiar filtros */}
          {(activeFilters.niche || searchQuery) && (
            <button
              onClick={() => {
                setActiveFilters({ niche: '', status: '' });
                setSearchQuery('');
              }}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-4 h-4" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Influencers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{influencers.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Campañas Activas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {campaigns.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Campañas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{campaigns.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {/* Tabla de influencers */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
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
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Agregar Nuevo Influencer
            </h3>
            <p className="text-gray-600 mb-4">
              Esta funcionalidad será implementada con un formulario completo en una versión futura.
            </p>
            <button
              onClick={() => setIsInfluencerModalOpen(false)}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


