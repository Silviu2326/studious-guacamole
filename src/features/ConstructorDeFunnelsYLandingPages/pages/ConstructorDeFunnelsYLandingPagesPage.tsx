import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { FunnelBuilderContainer } from '../components/FunnelBuilderContainer';
import { FunnelList } from '../components/FunnelList';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { useFunnelAnalytics } from '../hooks/useFunnelAnalytics';
import { 
  getFunnels, 
  createFunnel, 
  deleteFunnel, 
  Funnel 
} from '../api/funnels';
import { 
  Plus, 
  Globe, 
  BarChart3, 
  ArrowLeft,
  Lightbulb 
} from 'lucide-react';

type ViewMode = 'list' | 'builder' | 'analytics';

/**
 * Página principal del Constructor de Funnels & Landing Pages
 * 
 * Permite a los entrenadores crear, editar y analizar embudos de conversión
 * y páginas de aterrizaje optimizadas para captar leads y convertir clientes.
 */
export const ConstructorDeFunnelsYLandingPagesPage: React.FC = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [selectedFunnelId, setSelectedFunnelId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newFunnelName, setNewFunnelName] = useState<string>('');

  // Hook para analíticas (solo cuando se visualiza el dashboard de analytics)
  const dateRange = {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Últimos 30 días
    endDate: new Date()
  };
  const { data: analytics, isLoading: analyticsLoading } = useFunnelAnalytics({
    funnelId: viewMode === 'analytics' && selectedFunnelId ? selectedFunnelId : '',
    dateRange
  });

  useEffect(() => {
    loadFunnels();
  }, []);

  const loadFunnels = async () => {
    setIsLoading(true);
    try {
      const data = await getFunnels();
      setFunnels(data);
    } catch (error) {
      console.error('Error cargando funnels:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFunnel = async () => {
    if (!newFunnelName.trim()) return;

    try {
      const newFunnel = await createFunnel(newFunnelName.trim());
      setFunnels([...funnels, newFunnel]);
      setNewFunnelName('');
      setShowCreateModal(false);
      setSelectedFunnelId(newFunnel.funnelId);
      setViewMode('builder');
    } catch (error) {
      console.error('Error creando funnel:', error);
    }
  };

  const handleEditFunnel = (funnelId: string) => {
    setSelectedFunnelId(funnelId);
    setViewMode('builder');
  };

  const handleDeleteFunnel = async (funnelId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este funnel?')) return;

    try {
      await deleteFunnel(funnelId);
      setFunnels(funnels.filter(f => f.funnelId !== funnelId));
      if (selectedFunnelId === funnelId) {
        setSelectedFunnelId(null);
        setViewMode('list');
      }
    } catch (error) {
      console.error('Error eliminando funnel:', error);
    }
  };

  const handleViewAnalytics = (funnelId: string) => {
    setSelectedFunnelId(funnelId);
    setViewMode('analytics');
  };

  const handleViewLive = (funnelId: string) => {
    // En producción, esto abriría la landing page en una nueva pestaña
    window.open(`/public/funnel/${funnelId}`, '_blank');
  };

  if (viewMode === 'builder') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setViewMode('list')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver a Funnels
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              Editor de Funnel
            </h2>
            <div className="w-32" /> {/* Spacer para centrar */}
          </div>
        </div>
        <FunnelBuilderContainer
          funnelId={selectedFunnelId}
          onSave={(funnel) => {
            // Actualizar la lista cuando se guarda
            setFunnels(funnels.map(f => f.funnelId === funnel.funnelId ? funnel : f));
          }}
        />
      </div>
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
                    onClick={() => setViewMode('list')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                      Analíticas del Funnel
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Métricas y rendimiento del embudo de conversión
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          {analyticsLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Cargando analíticas...</p>
            </div>
          ) : (
            <AnalyticsDashboard analytics={analytics} />
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
                  <Globe size={24} className="text-purple-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Constructor de Funnels & Landing Pages
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Crea páginas de aterrizaje y embudos de conversión para captar más clientes
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Crear Nuevo Funnel
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
                ¿Qué son los Funnels y Landing Pages?
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Los funnels de conversión son secuencias de páginas diseñadas para guiar a los visitantes 
                desde el primer contacto hasta convertirse en clientes. Crea landing pages optimizadas 
                con nuestro editor visual de arrastrar y soltar, específicamente diseñadas para el sector 
                del fitness. Captura leads automáticamente, integra con tu CRM y optimiza tus conversiones 
                con tests A/B.
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Funnels */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando funnels...</p>
          </div>
        ) : funnels.length > 0 ? (
          <FunnelList
            funnels={funnels}
            onEdit={handleEditFunnel}
            onDelete={handleDeleteFunnel}
            onViewAnalytics={handleViewAnalytics}
            onViewLive={handleViewLive}
          />
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tienes funnels creados todavía
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tu primer funnel para empezar a captar leads y convertir visitantes en clientes
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Crear Primer Funnel
            </button>
          </div>
        )}
      </div>

      {/* Modal de Crear Funnel */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Crear Nuevo Funnel
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Funnel
                </label>
                <input
                  type="text"
                  value={newFunnelName}
                  onChange={(e) => setNewFunnelName(e.target.value)}
                  placeholder="Ej: Reto Verano 2024"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateFunnel();
                    }
                  }}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewFunnelName('');
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateFunnel}
                  disabled={!newFunnelName.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConstructorDeFunnelsYLandingPagesPage;

