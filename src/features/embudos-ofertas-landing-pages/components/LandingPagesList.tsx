import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, ConfirmModal, MetricCards } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { 
  getLandingPages, 
  deleteLandingPage, 
  publishLandingPage, 
  unpublishLandingPage,
  duplicateLandingPage 
} from '../api/landingPages';
import type { LandingPage } from '../types';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  Globe, 
  Lock,
  ExternalLink,
  BarChart3,
  Users,
  Target
} from 'lucide-react';

interface LandingPagesListProps {
  onCreateNew: () => void;
  onEdit: (pageId: string) => void;
  onViewAnalytics: (pageId: string) => void;
  role?: 'entrenador' | 'gimnasio';
}

export const LandingPagesList: React.FC<LandingPagesListProps> = ({
  onCreateNew,
  onEdit,
  onViewAnalytics,
  role = 'gimnasio',
}) => {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadPages();
  }, [currentPage]);

  const loadPages = async () => {
    try {
      setLoading(true);
      const response = await getLandingPages(currentPage, 10);
      setPages(response.data);
      setTotalPages(Math.ceil(response.pagination.total / response.pagination.limit));
    } catch (error) {
      console.error('Error loading landing pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!pageToDelete) return;
    try {
      await deleteLandingPage(pageToDelete);
      await loadPages();
      setDeleteModalOpen(false);
      setPageToDelete(null);
    } catch (error) {
      console.error('Error deleting landing page:', error);
    }
  };

  const handlePublish = async (pageId: string) => {
    try {
      await publishLandingPage(pageId);
      await loadPages();
    } catch (error) {
      console.error('Error publishing landing page:', error);
    }
  };

  const handleUnpublish = async (pageId: string) => {
    try {
      await unpublishLandingPage(pageId);
      await loadPages();
    } catch (error) {
      console.error('Error unpublishing landing page:', error);
    }
  };

  const handleDuplicate = async (pageId: string, name: string) => {
    try {
      await duplicateLandingPage(pageId, `${name} (Copia)`);
      await loadPages();
    } catch (error) {
      console.error('Error duplicating landing page:', error);
    }
  };

  const getStatusBadge = (status: LandingPage['status']) => {
    const statusConfig = {
      published: { label: 'Publicada', color: 'success' as const },
      draft: { label: 'Borrador', color: 'warning' as const },
      archived: { label: 'Archivada', color: 'secondary' as const },
    };
    const config = statusConfig[status];
    return <Badge variant={config.color}>{config.label}</Badge>;
  };

  const formatConversionRate = (rate?: number) => {
    if (!rate && rate !== 0) return 'N/A';
    return `${rate.toFixed(1)}%`;
  };

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      render: (value: string, row: LandingPage) => (
        <div>
          <div className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            {value}
          </div>
          {row.url && (
            <a
              href={row.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} ${ds.color.primaryHover} flex items-center gap-1 mt-1`}
            >
              <ExternalLink className="w-3 h-3" />
              Ver página
            </a>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (_: any, row: LandingPage) => getStatusBadge(row.status),
    },
    {
      key: 'stats',
      label: 'Visitas',
      render: (_: any, row: LandingPage) => (
        <div className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
          {row.stats?.visits?.toLocaleString() || '0'}
        </div>
      ),
    },
    {
      key: 'stats',
      label: 'Leads',
      render: (_: any, row: LandingPage) => (
        <div className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
          {row.stats?.leads?.toLocaleString() || '0'}
        </div>
      ),
    },
    {
      key: 'stats',
      label: 'Conversión',
      render: (_: any, row: LandingPage) => (
        <div className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
          {formatConversionRate(row.stats?.conversionRate)}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: LandingPage) => (
        <div className="flex items-center gap-2">
          {row.status === 'published' ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUnpublish(row.pageId)}
              title="Despublicar"
            >
              <Lock size={16} />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePublish(row.pageId)}
              title="Publicar"
            >
              <Globe size={16} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(row.pageId)}
            title="Editar"
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewAnalytics(row.pageId)}
            title="Analíticas"
          >
            <BarChart3 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDuplicate(row.pageId, row.name)}
            title="Duplicar"
          >
            <Copy size={16} />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setPageToDelete(row.pageId);
              setDeleteModalOpen(true);
            }}
            title="Eliminar"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  // Calcular métricas totales
  const totalVisits = pages.reduce((sum, page) => sum + (page.stats?.visits || 0), 0);
  const totalLeads = pages.reduce((sum, page) => sum + (page.stats?.leads || 0), 0);
  const avgConversion = pages.length > 0 && totalVisits > 0
    ? (totalLeads / totalVisits) * 100
    : 0;
  const publishedCount = pages.filter(p => p.status === 'published').length;

  const metricCards = [
    {
      id: 'published',
      title: 'Páginas Publicadas',
      value: publishedCount,
      color: 'info' as const,
    },
    {
      id: 'visits',
      title: 'Total Visitas',
      value: totalVisits.toLocaleString(),
      color: 'info' as const,
    },
    {
      id: 'leads',
      title: 'Total Leads',
      value: totalLeads.toLocaleString(),
      color: 'success' as const,
    },
    {
      id: 'conversion',
      title: 'Tasa Conversión',
      value: `${avgConversion.toFixed(1)}%`,
      color: 'warning' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Métricas rápidas */}
      <MetricCards data={metricCards} columns={4} />

      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button variant="primary" size="md" onClick={onCreateNew}>
          <Plus size={20} className="mr-2" />
          Crear Landing Page
        </Button>
      </div>

      {/* Lista de páginas */}
      <Card className={ds.card}>
        <div className="p-6">
          <Table
            data={pages}
            columns={columns}
            loading={loading}
            emptyMessage="No hay landing pages. Crea una nueva para comenzar."
          />
          
          {/* Paginación */}
          {totalPages > 1 && (
            <Card className={`${ds.card} mt-4`}>
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  Anterior
                </Button>
                <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} px-4`}>
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </Card>
          )}
        </div>
      </Card>

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setPageToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Eliminar Landing Page"
        message="¿Estás seguro de que deseas eliminar esta landing page? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        variant="destructive"
      />
    </div>
  );
};

