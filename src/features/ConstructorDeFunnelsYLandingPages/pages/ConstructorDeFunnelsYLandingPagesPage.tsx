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
  Lightbulb,
  Loader2 
} from 'lucide-react';
import { Button, Card, Modal, Input } from '../../../components/componentsreutilizables';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  leftIcon={<ArrowLeft size={20} />}
                  className="mr-4"
                >
                  Volver a Funnels
                </Button>
                <h2 className="text-xl font-bold text-gray-900">
                  Editor de Funnel
                </h2>
              </div>
            </div>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="p-2"
                  >
                    <ArrowLeft size={20} />
                  </Button>
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                      <BarChart3 size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                        Analíticas del Funnel
                      </h1>
                      <p className="text-gray-600">
                        Métricas y rendimiento del embudo de conversión
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          {analyticsLoading ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando analíticas...</p>
            </Card>
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
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Globe size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Constructor de Funnels & Landing Pages
                  </h1>
                  <p className="text-gray-600">
                    Crea páginas de aterrizaje y embudos de conversión para captar más clientes
                  </p>
                </div>
              </div>
              
              <Button
                onClick={() => setShowCreateModal(true)}
                leftIcon={<Plus size={20} />}
              >
                Crear Nuevo Funnel
              </Button>
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
          <Card className="p-8 text-center bg-white shadow-sm">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando...</p>
          </Card>
        ) : funnels.length > 0 ? (
          <FunnelList
            funnels={funnels}
            onEdit={handleEditFunnel}
            onDelete={handleDeleteFunnel}
            onViewAnalytics={handleViewAnalytics}
            onViewLive={handleViewLive}
          />
        ) : (
          <Card className="p-8 text-center bg-white shadow-sm">
            <Globe size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tienes funnels creados todavía
            </h3>
            <p className="text-gray-600 mb-4">
              Crea tu primer funnel para empezar a captar leads y convertir visitantes en clientes
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              leftIcon={<Plus size={20} />}
            >
              Crear Primer Funnel
            </Button>
          </Card>
        )}
      </div>

      {/* Modal de Crear Funnel */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setNewFunnelName('');
        }}
        title="Crear Nuevo Funnel"
        size="md"
        footer={
          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setShowCreateModal(false);
                setNewFunnelName('');
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateFunnel}
              disabled={!newFunnelName.trim()}
            >
              Crear
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            type="text"
            label="Nombre del Funnel"
            value={newFunnelName}
            onChange={(e) => setNewFunnelName(e.target.value)}
            placeholder="Ej: Reto Verano 2024"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateFunnel();
              }
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ConstructorDeFunnelsYLandingPagesPage;

