import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Input, Select, Badge } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Segment } from '../types';
import { getSegments, refreshSegment, deleteSegment } from '../api/segments';
import { Users, RefreshCw, Trash2, Search, Filter, Plus, Zap } from 'lucide-react';

export const SegmentationEngine: React.FC = () => {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadSegments();
  }, [filterType, filterStatus]);

  const loadSegments = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (filterType !== 'all') filters.type = filterType;
      if (filterStatus !== 'all') filters.status = filterStatus;
      if (searchTerm) filters.search = searchTerm;
      
      const data = await getSegments(filters);
      setSegments(data);
    } catch (error) {
      console.error('Error cargando segmentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (id: string) => {
    try {
      await refreshSegment(id);
      loadSegments();
    } catch (error) {
      console.error('Error refrescando segmento:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este segmento?')) {
      try {
        await deleteSegment(id);
        loadSegments();
      } catch (error) {
        console.error('Error eliminando segmento:', error);
      }
    }
  };

  const filteredSegments = segments.filter(segment => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return segment.name.toLowerCase().includes(term) ||
           segment.description?.toLowerCase().includes(term);
  });

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
      render: (value: string, row: Segment) => (
        <div>
          <div className="font-semibold">{value}</div>
          {row.description && (
            <div className="text-sm text-gray-500 mt-1">{row.description}</div>
          )}
        </div>
      )
    },
    {
      key: 'type',
      label: 'Tipo',
      sortable: true,
      render: (value: string) => {
        const typeLabels = {
          automatic: 'Automático',
          manual: 'Manual',
          smart: 'Inteligente'
        };
        const typeColors = {
          automatic: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          manual: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
          smart: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
        };
        return (
          <Badge className={typeColors[value as keyof typeof typeColors]}>
            {typeLabels[value as keyof typeof typeLabels]}
          </Badge>
        );
      }
    },
    {
      key: 'memberCount',
      label: 'Miembros',
      sortable: true,
      align: 'center' as const,
      render: (value: number) => (
        <div className="flex items-center justify-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="font-semibold">{value.toLocaleString()}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (value: string) => {
        const statusLabels = {
          active: 'Activo',
          inactive: 'Inactivo',
          archived: 'Archivado'
        };
        const statusColors = {
          active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          inactive: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          archived: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
        };
        return (
          <Badge className={statusColors[value as keyof typeof statusColors]}>
            {statusLabels[value as keyof typeof statusLabels]}
          </Badge>
        );
      }
    },
    {
      key: 'lastRefreshed',
      label: 'Última Actualización',
      sortable: true,
      render: (value: string | undefined) => {
        if (!value) return '-';
        const date = new Date(value);
        return (
          <div className="text-sm">
            {date.toLocaleDateString('es-ES', { 
              day: '2-digit', 
              month: 'short', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        );
      }
    },
    {
      key: 'actions',
      label: 'Acciones',
      align: 'right' as const,
      render: (_: any, row: Segment) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRefresh(row.id)}
            title="Refrescar segmento"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.id)}
            title="Eliminar segmento"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <Card padding="md">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Buscar segmentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2">
            <Select
              options={[
                { value: 'all', label: 'Todos los tipos' },
                { value: 'automatic', label: 'Automático' },
                { value: 'manual', label: 'Manual' },
                { value: 'smart', label: 'Inteligente' }
              ]}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-48"
            />
            <Select
              options={[
                { value: 'all', label: 'Todos los estados' },
                { value: 'active', label: 'Activo' },
                { value: 'inactive', label: 'Inactivo' },
                { value: 'archived', label: 'Archivado' }
              ]}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-48"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Segmentos ({filteredSegments.length})
            </h3>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-1`}>
              Motor de segmentación automática e inteligente
            </p>
          </div>
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Segmento
          </Button>
        </div>

        <Table
          data={filteredSegments}
          columns={columns}
          loading={loading}
          emptyMessage="No se encontraron segmentos"
        />
      </Card>
    </div>
  );
};

