import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { ContentCard } from './ContentCard';
import { ConsentRequestModal } from './ConsentRequestModal';
import {
  getUgcContent,
  getUgcStats,
  updateContentStatus,
  syncSocialMedia,
  UgcContent
} from '../api/ugc';
import {
  Filter,
  RefreshCw,
  Plus,
  Image as ImageIcon,
  BarChart3,
  Clock,
  CheckCircle2,
  Tag as TagIcon,
  Download
} from 'lucide-react';

interface UgcHubContainerProps {
  trainerId: string;
}

export const UgcHubContainer: React.FC<UgcHubContainerProps> = ({ trainerId }) => {
  const [contentItems, setContentItems] = useState<UgcContent[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros y paginación
  const [activeFilters, setActiveFilters] = useState({
    status: 'all',
    consentStatus: 'all',
    tags: [] as string[]
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  
  // Modal state
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<UgcContent | null>(null);
  
  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadContent();
    loadStats();
  }, [activeFilters, pagination.page]);

  const loadContent = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getUgcContent(
        pagination.page,
        pagination.limit,
        {
          status: activeFilters.status !== 'all' ? activeFilters.status : undefined,
          consentStatus: activeFilters.consentStatus !== 'all' ? activeFilters.consentStatus : undefined,
          tags: activeFilters.tags.length > 0 ? activeFilters.tags : undefined
        }
      );

      setContentItems(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages
      }));
    } catch (err: any) {
      setError(err.message || 'Error al cargar el contenido');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await getUgcStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateContentStatus(id, 'approved');
      loadContent();
      loadStats();
    } catch (err: any) {
      alert('Error al aprobar el contenido: ' + err.message);
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres rechazar este contenido?')) {
      return;
    }
    
    try {
      await updateContentStatus(id, 'rejected');
      loadContent();
      loadStats();
    } catch (err: any) {
      alert('Error al rechazar el contenido: ' + err.message);
    }
  };

  const handleRequestConsent = (id: string) => {
    const content = contentItems.find(item => item.id === id);
    if (content) {
      setSelectedContent(content);
      setIsConsentModalOpen(true);
    }
  };

  const handleConsentSent = () => {
    loadContent();
    loadStats();
  };

  const handleSyncSocial = async () => {
    setIsSyncing(true);
    try {
      await syncSocialMedia();
      setTimeout(() => {
        loadContent();
        loadStats();
        setIsSyncing(false);
      }, 2000);
    } catch (err: any) {
      alert('Error al sincronizar: ' + err.message);
      setIsSyncing(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={loadContent}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Pendiente Moderación
            </h3>
            <p className="text-3xl font-bold text-gray-900">{stats.pendingModeration}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Contenido Aprobado
            </h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalApproved}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Tasa Aceptación
            </h3>
            <p className="text-3xl font-bold text-gray-900">{stats.consentApprovalRate}%</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TagIcon className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Menciones Recientes
            </h3>
            <p className="text-3xl font-bold text-gray-900">{stats.recentMentions}</p>
          </Card>
        </div>
      )}

      {/* Top Tags */}
      {stats?.topTags && stats.topTags.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Etiquetas Más Populares</h3>
          <div className="flex flex-wrap gap-2">
            {stats.topTags.map((tagData: any, index: number) => (
              <button
                key={index}
                onClick={() => {
                  const isSelected = activeFilters.tags.includes(tagData.tag);
                  setActiveFilters(prev => ({
                    ...prev,
                    tags: isSelected
                      ? prev.tags.filter(t => t !== tagData.tag)
                      : [...prev.tags, tagData.tag]
                  }));
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                  activeFilters.tags.includes(tagData.tag)
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <TagIcon className="w-4 h-4" />
                <span className="font-medium">{tagData.tag}</span>
                <span className="text-sm bg-gray-200 px-2 py-0.5 rounded">
                  {tagData.count}
                </span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Biblioteca de Contenido</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncSocial}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            <Plus className="w-4 h-4" />
            Subir Manual
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={activeFilters.status}
            onChange={(e) => setActiveFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Todos los estados</option>
            <option value="pending_moderation">Pendiente</option>
            <option value="approved">Aprobado</option>
            <option value="rejected">Rechazado</option>
          </select>
        </div>
        <select
          value={activeFilters.consentStatus}
          onChange={(e) => setActiveFilters(prev => ({ ...prev, consentStatus: e.target.value, page: 1 }))}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">Todos los consentimientos</option>
          <option value="not_requested">No solicitado</option>
          <option value="pending_response">Esperando respuesta</option>
          <option value="granted">Otorgado</option>
          <option value="denied">Denegado</option>
        </select>
        {activeFilters.tags.length > 0 && (
          <button
            onClick={() => setActiveFilters(prev => ({ ...prev, tags: [], page: 1 }))}
            className="px-3 py-2 text-sm text-purple-600 hover:text-purple-700"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
              <div className="aspect-video bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : contentItems.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay contenido disponible
            </h3>
            <p className="text-gray-600 mb-6">
              {activeFilters.status !== 'all' || activeFilters.consentStatus !== 'all' || activeFilters.tags.length > 0
                ? 'No se encontró contenido con los filtros seleccionados'
                : 'Empieza por conectar tus redes sociales o subir contenido manualmente'
              }
            </p>
            {activeFilters.status === 'all' && activeFilters.consentStatus === 'all' && activeFilters.tags.length === 0 && (
              <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                Conectar Redes Sociales
              </button>
            )}
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {contentItems.map((item) => (
              <ContentCard
                key={item.id}
                content={item}
                onApprove={handleApprove}
                onReject={handleReject}
                onRequestConsent={handleRequestConsent}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-600">
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      {/* Consent Modal */}
      {selectedContent && (
        <ConsentRequestModal
          isOpen={isConsentModalOpen}
          onClose={() => {
            setIsConsentModalOpen(false);
            setSelectedContent(null);
          }}
          contentId={selectedContent.id}
          clientInfo={{
            name: selectedContent.client.name,
            email: selectedContent.client.email || ''
          }}
        />
      )}
    </div>
  );
};

