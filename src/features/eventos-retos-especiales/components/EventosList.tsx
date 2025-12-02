import React from 'react';
import { EventoReto } from '../types';
import { Table, Card, Button } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { ds } from '../../adherencia/ui/ds';
import { Calendar, Users, Target, Eye, Edit, Trash2, Play, CheckCircle } from 'lucide-react';

interface EventosListProps {
  eventos: EventoReto[];
  loading?: boolean;
  onView?: (evento: EventoReto) => void;
  onEdit?: (evento: EventoReto) => void;
  onDelete?: (evento: EventoReto) => void;
  onPublish?: (evento: EventoReto) => void;
  esEntrenador?: boolean;
}

export const EventosList: React.FC<EventosListProps> = ({
  eventos,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onPublish,
  esEntrenador = false,
}) => {
  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { color: 'primary' | 'success' | 'warning' | 'error' | 'info'; label: string }> = {
      borrador: { color: 'info', label: 'Borrador' },
      publicado: { color: 'primary', label: 'Publicado' },
      en_curso: { color: 'success', label: 'En Curso' },
      finalizado: { color: 'info', label: 'Finalizado' },
      cancelado: { color: 'error', label: 'Cancelado' },
    };
    return estados[estado] || estados.borrador;
  };

  const formatFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const columns = [
    {
      key: 'titulo',
      label: 'Título',
      render: (value: string, row: EventoReto) => (
        <div className="flex items-center space-x-3">
          <div>
            <p className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {value}
            </p>
            <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-1`}>
              {row.descripcion.substring(0, 60)}...
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value: string, row: EventoReto) => (
        <div className="flex items-center space-x-2">
          <Badge variant={row.tipo === 'reto' ? 'purple' : 'green'}>
            {row.tipo === 'reto' ? 'Reto' : 'Evento'}
          </Badge>
          {row.tipoReto && (
            <Badge variant="outline">
              {row.tipoReto === 'personal' ? 'Personal' : 'Grupal'}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: string) => {
        const estadoInfo = getEstadoBadge(value);
        const variantMap: Record<string, 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'purple'> = {
          primary: 'blue',
          success: 'green',
          warning: 'yellow',
          error: 'red',
          info: 'purple',
        };
        return <Badge variant={variantMap[estadoInfo.color] || 'gray'}>{estadoInfo.label}</Badge>;
      },
    },
    {
      key: 'fechaInicio',
      label: 'Fecha Inicio',
      render: (value: Date) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className={ds.typography.bodySmall}>{formatFecha(value)}</span>
        </div>
      ),
    },
    {
      key: 'participantes',
      label: 'Participantes',
      render: (value: any[], row: EventoReto) => (
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span className={ds.typography.bodySmall}>
            {value.length} {row.capacidadMaxima ? `/ ${row.capacidadMaxima}` : ''}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (value: any, row: EventoReto) => (
        <div className="flex items-center space-x-2">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(row)}
              title="Ver detalles"
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(row)}
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {onPublish && row.estado === 'borrador' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPublish(row)}
              title="Publicar"
            >
              <Play className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(row)}
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <p className="text-gray-600 mt-4">Cargando...</p>
      </Card>
    );
  }

  if (eventos.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Target size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay eventos o retos disponibles</h3>
        <p className="text-gray-600 mb-4">
          {esEntrenador 
            ? 'Crea tu primer reto personal para tus clientes'
            : 'Crea tu primer evento o reto para tu comunidad'
          }
        </p>
      </Card>
    );
  }

  return (
    <Table
      data={eventos}
      columns={columns}
      loading={loading}
      emptyMessage="No hay eventos o retos disponibles"
    />
  );
};

