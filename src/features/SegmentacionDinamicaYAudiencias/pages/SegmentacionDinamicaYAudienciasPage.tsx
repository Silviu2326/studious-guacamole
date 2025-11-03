import React, { useState, useEffect } from 'react';
import { AudienceCard } from '../components/AudienceCard';
import { Card, MetricCards, Button } from '../../../components/componentsreutilizables';
import {
  getAudiences,
  createAudience,
  updateAudience,
  deleteAudience,
  getAudienceStats,
  Audience,
  AudienceStats
} from '../api/audiences';
import { Plus, AlertCircle, Users, TrendingUp, Loader2, Package } from 'lucide-react';

export default function SegmentacionDinamicaYAudienciasPage() {
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [stats, setStats] = useState<AudienceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [audiencesResponse, statsData] = await Promise.all([
        getAudiences(),
        getAudienceStats()
      ]);

      setAudiences(audiencesResponse.data);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las audiencias');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAudience = async () => {
    // En producción, abrir modal de creación
    alert('Funcionalidad de creación de audiencia en desarrollo');
  };

  const handleEditAudience = async (audienceId: string) => {
    console.log('Editar audiencia:', audienceId);
    alert('Funcionalidad de edición en desarrollo');
  };

  const handleDeleteAudience = async (audienceId: string) => {
    try {
      await deleteAudience(audienceId);
      await loadData();
    } catch (err: any) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const handleViewMembers = async (audienceId: string) => {
    console.log('Ver miembros de:', audienceId);
    alert('Funcionalidad de ver miembros en desarrollo');
  };

  const handleDuplicate = async (audience: Audience) => {
    try {
      await createAudience({
        name: `${audience.name} (Copia)`,
        rules: audience.rules
      });
      await loadData();
    } catch (err: any) {
      alert('Error al duplicar: ' + err.message);
    }
  };

  // Preparar métricas para MetricCards
  const metricas = stats ? [
    {
      id: 'total-audiences',
      title: 'Total Audiencias',
      value: stats.totalAudiences.toString(),
      icon: <Users className="w-5 h-5" />,
      color: 'info' as const,
    },
    {
      id: 'total-members',
      title: 'Total Miembros',
      value: stats.totalMembers.toString(),
      icon: <Users className="w-5 h-5" />,
      color: 'primary' as const,
    },
    {
      id: 'average-size',
      title: 'Tamaño Promedio',
      value: stats.averageAudienceSize.toFixed(0),
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'success' as const,
    },
    {
      id: 'segmentation-rate',
      title: 'Tasa Segmentación',
      value: `${stats.segmentationRate.toFixed(1)}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'warning' as const,
    }
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Users size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Segmentación Dinámica & Audiencias
                  </h1>
                  <p className="text-gray-600">
                    Crea audiencias dinámicas para personalizar tu marketing y comunicación
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="space-y-6">
            {/* Toolbar superior */}
            <div className="flex items-center justify-end">
              <Button variant="primary" onClick={handleCreateAudience} leftIcon={<Plus size={20} />}>
                Nueva Audiencia
              </Button>
            </div>

            {/* Error Banner */}
            {error && (
              <Card className="p-4 bg-white shadow-sm">
                <div className="flex items-center gap-3">
                  <AlertCircle size={20} className="text-red-500" />
                  <div>
                    <strong className="font-bold text-red-700">Error:</strong>
                    <span className="ml-2 text-red-600">{error}</span>
                  </div>
                </div>
              </Card>
            )}

            {/* Métricas */}
            {isLoading ? (
              <MetricCards 
                data={[
                  { id: '1', title: '', value: '', loading: true },
                  { id: '2', title: '', value: '', loading: true },
                  { id: '3', title: '', value: '', loading: true },
                  { id: '4', title: '', value: '', loading: true },
                ]} 
                columns={4} 
              />
            ) : stats ? (
              <MetricCards data={metricas} columns={4} />
            ) : null}

            {/* Top Audiences */}
            {stats && stats.topAudiencesBySize.length > 0 && (
              <Card className="bg-white shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Audiencias Más Grandes</h3>
                  <div className="space-y-3">
                    {stats.topAudiencesBySize.map((audience, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-bold text-sm">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{audience.name}</div>
                            <div className="text-sm text-gray-600">{audience.memberCount} miembros</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Audiences List */}
            {isLoading ? (
              <Card className="p-8 text-center bg-white shadow-sm">
                <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
                <p className="text-gray-600">Cargando audiencias...</p>
              </Card>
            ) : audiences.length === 0 ? (
              <Card className="p-8 text-center bg-white shadow-sm">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay audiencias</h3>
                <p className="text-gray-600 mb-4">Crea tu primera audiencia para empezar a segmentar clientes</p>
                <Button variant="primary" onClick={handleCreateAudience} leftIcon={<Plus size={20} />}>
                  Crear Primera Audiencia
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {audiences.map((audience) => (
                  <AudienceCard
                    key={audience.id}
                    audience={audience}
                    onEdit={handleEditAudience}
                    onDelete={handleDeleteAudience}
                    onViewMembers={handleViewMembers}
                    onDuplicate={handleDuplicate}
                  />
                ))}
              </div>
            )}

            {/* Info Card */}
            <Card className="bg-white shadow-sm">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      ¿Qué son las audiencias dinámicas?
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Las audiencias dinámicas se actualizan automáticamente en tiempo real basándose en las reglas que definas. 
                      Un cliente puede entrar y salir de una audiencia automáticamente cuando cumpla o deje de cumplir las condiciones. 
                      Utiliza estas audiencias para campañas de email, SMS, retargeting y automatizaciones personalizadas.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
  );
}

