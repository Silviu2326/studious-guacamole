import React, { useState, useEffect } from 'react';
import { Card, MetricCards, Button } from '../../../components/componentsreutilizables';
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
  Package,
  AlertCircle,
  Loader2,
  Search,
  X
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
      <Card className="p-8 text-center bg-white shadow-sm">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadContent}>
          Reintentar
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <MetricCards
          data={[
            {
              id: 'pending',
              title: 'Pendiente Moderación',
              value: stats.pendingModeration,
              color: 'warning',
              icon: <Clock size={20} />
            },
            {
              id: 'approved',
              title: 'Contenido Aprobado',
              value: stats.totalApproved,
              color: 'success',
              icon: <CheckCircle2 size={20} />
            },
            {
              id: 'approval-rate',
              title: 'Tasa Aceptación',
              value: `${stats.consentApprovalRate}%`,
              color: 'info',
              icon: <BarChart3 size={20} />
            },
            {
              id: 'mentions',
              title: 'Menciones Recientes',
              value: stats.recentMentions,
              color: 'primary',
              icon: <TagIcon size={20} />
            }
          ]}
          columns={4}
        />
      )}

      {/* Top Tags */}
      {stats?.topTags && stats.topTags.length > 0 && (
        <Card padding="md" className="bg-white shadow-sm">
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
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                  activeFilters.tags.includes(tagData.tag)
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <TagIcon className="w-4 h-4" />
                <span className="text-sm font-medium">{tagData.tag}</span>
                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                  {tagData.count}
                </span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Toolbar Superior */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSyncSocial}
            disabled={isSyncing}
            loading={isSyncing}
            leftIcon={<RefreshCw size={20} />}
          >
            Sincronizar
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={20} />}
          >
            Subir Manual
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-0 bg-white shadow-sm">
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-[200px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                placeholder="Buscar contenido..."
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="opacity-70" />
              <select
                value={activeFilters.status}
                onChange={(e) => setActiveFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                className="px-3 py-2 rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              >
                <option value="all">Todos los estados</option>
                <option value="pending_moderation">Pendiente</option>
                <option value="approved">Aprobado</option>
                <option value="rejected">Rechazado</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={activeFilters.consentStatus}
                onChange={(e) => setActiveFilters(prev => ({ ...prev, consentStatus: e.target.value, page: 1 }))}
                className="px-3 py-2 rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              >
                <option value="all">Todos los consentimientos</option>
                <option value="not_requested">No solicitado</option>
                <option value="pending_response">Esperando respuesta</option>
                <option value="granted">Otorgado</option>
                <option value="denied">Denegado</option>
              </select>
            </div>
            {activeFilters.tags.length > 0 && (
              <button
                onClick={() => setActiveFilters(prev => ({ ...prev, tags: [], page: 1 }))}
                className="px-3 py-2 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <X size={16} />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Content Grid */}
      {isLoading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </Card>
      ) : contentItems.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay contenido disponible
          </h3>
          <p className="text-gray-600 mb-4">
            {activeFilters.status !== 'all' || activeFilters.consentStatus !== 'all' || activeFilters.tags.length > 0
              ? 'No se encontró contenido con los filtros seleccionados'
              : 'Empieza por conectar tus redes sociales o subir contenido manualmente'
            }
          </p>
          {activeFilters.status === 'all' && activeFilters.consentStatus === 'all' && activeFilters.tags.length === 0 && (
            <Button>Conectar Redes Sociales</Button>
          )}
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            <Card className="p-4 bg-white shadow-sm">
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-600">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </Card>
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

