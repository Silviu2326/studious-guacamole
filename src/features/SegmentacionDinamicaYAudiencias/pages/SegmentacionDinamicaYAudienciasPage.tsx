import React, { useState, useEffect } from 'react';
import { Layout } from '../../../components/layout';
import { AudienceCard } from '../components/AudienceCard';
import {
  getAudiences,
  createAudience,
  updateAudience,
  deleteAudience,
  getAudienceStats,
  Audience,
  AudienceStats
} from '../api/audiences';
import { Plus, AlertCircle, Users, TrendingUp } from 'lucide-react';

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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Segmentación Dinámica & Audiencias
            </h1>
            <p className="text-gray-600 mt-2">
              Crea audiencias dinámicas para personalizar tu marketing y comunicación
            </p>
          </div>
          <button
            onClick={handleCreateAudience}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <Plus className="w-5 h-5" />
            Nueva Audiencia
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {/* Stats Dashboard */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-medium text-gray-600">Total Audiencias</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalAudiences}</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-medium text-gray-600">Total Miembros</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalMembers}</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="text-sm font-medium text-gray-600">Tamaño Promedio</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.averageAudienceSize.toFixed(0)}</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Tasa Segmentación</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.segmentationRate.toFixed(1)}%</p>
            </div>
          </div>
        ) : null}

        {/* Top Audiences */}
        {stats && stats.topAudiencesBySize.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Audiencias Más Grandes</h3>
            <div className="space-y-3">
              {stats.topAudiencesBySize.map((audience, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-700 rounded-full font-bold text-sm">
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
        )}

        {/* Audiences List */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : audiences.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay audiencias</h3>
            <p className="text-gray-600 mb-6">Crea tu primera audiencia para empezar a segmentar clientes</p>
            <button
              onClick={handleCreateAudience}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <Plus className="w-5 h-5" />
              Crear Primera Audiencia
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                ¿Qué son las audiencias dinámicas?
              </h3>
              <p className="text-gray-700">
                Las audiencias dinámicas se actualizan automáticamente en tiempo real basándose en las reglas que definas. 
                Un cliente puede entrar y salir de una audiencia automáticamente cuando cumpla o deje de cumplir las condiciones. 
                Utiliza estas audiencias para campañas de email, SMS, retargeting y automatizaciones personalizadas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

