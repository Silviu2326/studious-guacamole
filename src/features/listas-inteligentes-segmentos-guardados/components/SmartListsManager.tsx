import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Badge, MetricCards } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { SmartList } from '../types';
import { getSmartLists, refreshSmartList, deleteSmartList } from '../api/smart-lists';
import { List, RefreshCw, Trash2, Clock, Users, Zap } from 'lucide-react';

export const SmartListsManager: React.FC = () => {
  const [smartLists, setSmartLists] = useState<SmartList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSmartLists();
  }, []);

  const loadSmartLists = async () => {
    setLoading(true);
    try {
      const data = await getSmartLists();
      setSmartLists(data);
    } catch (error) {
      console.error('Error cargando listas inteligentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (id: string) => {
    try {
      await refreshSmartList(id);
      loadSmartLists();
    } catch (error) {
      console.error('Error refrescando lista:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta lista inteligente?')) {
      try {
        await deleteSmartList(id);
        loadSmartLists();
      } catch (error) {
        console.error('Error eliminando lista:', error);
      }
    }
  };

  const getFrequencyLabel = (freq: string) => {
    const labels = {
      realtime: 'Tiempo Real',
      hourly: 'Cada Hora',
      daily: 'Diario',
      weekly: 'Semanal',
      manual: 'Manual'
    };
    return labels[freq as keyof typeof labels] || freq;
  };

  const totalMembers = smartLists.reduce((sum, list) => sum + list.memberCount, 0);
  const activeLists = smartLists.filter(list => list.status === 'active').length;

  const metrics = [
    {
      id: 'total-lists',
      title: 'Listas Inteligentes',
      value: smartLists.length,
      subtitle: `${activeLists} activas`,
      icon: <List className="w-5 h-5" />,
      color: 'primary' as const
    },
    {
      id: 'total-members',
      title: 'Total Miembros',
      value: totalMembers.toLocaleString(),
      subtitle: 'En todas las listas',
      icon: <Users className="w-5 h-5" />,
      color: 'info' as const
    },
    {
      id: 'realtime-updates',
      title: 'Actualización',
      value: smartLists.filter(l => l.refreshFrequency === 'realtime').length,
      subtitle: 'Listas en tiempo real',
      icon: <Zap className="w-5 h-5" />,
      color: 'success' as const
    }
  ];

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
      render: (value: string, row: SmartList) => (
        <div>
          <div className="font-semibold">{value}</div>
          {row.description && (
            <div className="text-sm text-gray-500 mt-1">{row.description}</div>
          )}
        </div>
      )
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
      key: 'refreshFrequency',
      label: 'Frecuencia',
      sortable: true,
      render: (value: string) => (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {getFrequencyLabel(value)}
        </Badge>
      )
    },
    {
      key: 'lastRefreshed',
      label: 'Última Actualización',
      sortable: true,
      render: (value: string) => {
        const date = new Date(value);
        return (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
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
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (value: string) => {
        const statusColors = {
          active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
        };
        return (
          <Badge className={statusColors[value as keyof typeof statusColors]}>
            {value === 'active' ? 'Activa' : 'Inactiva'}
          </Badge>
        );
      }
    },
    {
      key: 'actions',
      label: 'Acciones',
      align: 'right' as const,
      render: (_: any, row: SmartList) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRefresh(row.id)}
            title="Refrescar lista"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.id)}
            title="Eliminar lista"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <MetricCards data={metrics} columns={3} />

      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Listas Inteligentes
            </h3>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-1`}>
              Segmentos dinámicos que se actualizan automáticamente
            </p>
          </div>
          <Button variant="primary" size="md">
            <List className="w-4 h-4 mr-2" />
            Nueva Lista
          </Button>
        </div>

        <Table
          data={smartLists}
          columns={columns}
          loading={loading}
          emptyMessage="No se encontraron listas inteligentes"
        />
      </Card>
    </div>
  );
};

