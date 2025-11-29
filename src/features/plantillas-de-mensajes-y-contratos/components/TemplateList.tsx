import React from 'react';
import { Table, Badge } from '../../../components/componentsreutilizables';
import { Template } from '../types';
import { Mail, MessageSquare, FileText, Edit, Copy, Trash2, Eye } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';

interface TemplateListProps {
  templates: Template[];
  onEdit: (templateId: string) => void;
  onDelete: (templateId: string) => void;
  onDuplicate: (templateId: string) => void;
  onPreview: (templateId: string) => void;
}

const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  onEdit,
  onDelete,
  onDuplicate,
  onPreview,
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'EMAIL':
        return <Mail className="w-4 h-4" />;
      case 'SMS':
        return <MessageSquare className="w-4 h-4" />;
      case 'CONTRACT':
        return <FileText className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'EMAIL':
        return 'Email';
      case 'SMS':
        return 'SMS';
      case 'CONTRACT':
        return 'Contrato';
      default:
        return type;
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      render: (_: any, row: Template) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            {getTypeIcon(row.type)}
          </div>
          <div>
            <p className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {row.name}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (_: any, row: Template) => (
        <Badge variant={row.type === 'EMAIL' ? 'blue' : row.type === 'SMS' ? 'green' : 'purple'}>
          {getTypeLabel(row.type)}
        </Badge>
      ),
    },
    {
      key: 'isActive',
      label: 'Estado',
      render: (_: any, row: Template) => (
        <Badge variant={row.isActive ? 'green' : 'gray'}>
          {row.isActive ? 'Activa' : 'Inactiva'}
        </Badge>
      ),
    },
    {
      key: 'requiresSignature',
      label: 'Requiere Firma',
      render: (_: any, row: Template) => (
        row.requiresSignature && (
          <Badge variant="orange">
            Sí
          </Badge>
        )
      ),
    },
    {
      key: 'createdAt',
      label: 'Creada',
      render: (_: any, row: Template) => (
        <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
          {new Date(row.createdAt).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: Template) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPreview(row.id)}
            className="p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            title="Previsualizar"
          >
            <Eye className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={() => onEdit(row.id)}
            className="p-2 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4 text-purple-600" />
          </button>
          <button
            onClick={() => onDuplicate(row.id)}
            className="p-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/20 dark:hover:bg-gray-900/30 rounded-lg transition-colors"
            title="Duplicar"
          >
            <Copy className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(row.id)}
            className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      data={templates}
      columns={columns}
      emptyMessage="No hay plantillas creadas. Crea tu primera plantilla para comenzar."
    />
  );
};

export default TemplateList;

