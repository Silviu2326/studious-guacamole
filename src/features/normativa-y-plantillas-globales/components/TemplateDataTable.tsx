// TemplateDataTable - Presentational
import React from 'react';
import { GlobalTemplate, TemplateType } from '../types';
import { Table, Badge } from '../../../components/componentsreutilizables';
import { Edit, Trash2, Eye, Send, CheckCircle2 } from 'lucide-react';

interface TemplateDataTableProps {
  templates: GlobalTemplate[];
  onEdit: (templateId: string) => void;
  onDelete: (templateId: string) => void;
  onView: (templateId: string) => void;
  onPublish?: (templateId: string) => void;
  loading?: boolean;
}

export const TemplateDataTable: React.FC<TemplateDataTableProps> = ({
  templates,
  onEdit,
  onDelete,
  onView,
  onPublish,
  loading = false
}) => {
  const getTypeLabel = (type: TemplateType): string => {
    const labels: Record<TemplateType, string> = {
      'CONTRACT': 'Contrato',
      'POLICY': 'Política',
      'WORKOUT_PLAN': 'Plan Entrenamiento',
      'NUTRITION_GUIDE': 'Guía Nutricional',
      'EMAIL': 'Email',
      'PROTOCOL': 'Protocolo',
      'REGULATION': 'Reglamento'
    };
    return labels[type];
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'green' | 'gray' | 'red'> = {
      'PUBLISHED': 'green',
      'DRAFT': 'gray',
      'ARCHIVED': 'red'
    };
    return variants[status] || 'gray';
  };

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (value: TemplateType) => (
        <span className="text-sm text-slate-700">{getTypeLabel(value)}</span>
      )
    },
    {
      key: 'version',
      label: 'Versión',
      render: (value: number) => `v${value}`
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value: string) => (
        <Badge variant={getStatusBadge(value)}>
          {value}
        </Badge>
      )
    },
    {
      key: 'isMandatory',
      label: 'Obligatoria',
      render: (value: boolean) => (
        value ? (
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        ) : (
          <span className="text-slate-400">—</span>
        )
      )
    },
    {
      key: 'lastModified',
      label: 'Última Modificación',
      render: (value: string) => (
        <span className="text-sm text-slate-700">
          {new Date(value).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: GlobalTemplate) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(row.templateId)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            title="Ver detalles"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(row.templateId)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          {row.status === 'DRAFT' && onPublish && (
            <button
              onClick={() => onPublish(row.templateId)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-all"
              title="Publicar"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
          {row.status !== 'ARCHIVED' && (
            <button
              onClick={() => onDelete(row.templateId)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
              title="Archivar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <Table
      data={templates}
      columns={columns}
      loading={loading}
      emptyMessage="No hay plantillas disponibles"
    />
  );
};

