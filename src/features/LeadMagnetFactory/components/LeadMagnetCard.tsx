import React from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { LeadMagnet } from '../api/leadMagnets';
import { FileText, Calculator, CheckSquare, Edit, Trash2, Eye, BarChart3 } from 'lucide-react';

interface LeadMagnetCardProps {
  magnet: LeadMagnet;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewStats: (id: string) => void;
}

export const LeadMagnetCard: React.FC<LeadMagnetCardProps> = ({
  magnet,
  onEdit,
  onDelete,
  onViewStats
}) => {
  const getTypeIcon = (type: LeadMagnet['type']) => {
    const icons = {
      PDF_EDITOR: FileText,
      CALCULATOR: Calculator,
      CHECKLIST: CheckSquare,
      QUIZ: BarChart3
    };
    return icons[type];
  };

  const getStatusBadge = () => {
    const statusConfig = {
      DRAFT: { label: 'Borrador', className: 'bg-gray-100 text-gray-800' },
      PUBLISHED: { label: 'Publicado', className: 'bg-green-100 text-green-800' },
      ARCHIVED: { label: 'Archivado', className: 'bg-yellow-100 text-yellow-800' }
    };
    const config = statusConfig[magnet.status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const TypeIcon = getTypeIcon(magnet.type);

  return (
    <Card variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
      {/* Header con imagen de fondo */}
      <div 
        className="h-48 bg-gradient-to-br p-4 text-white"
        style={{ backgroundColor: magnet.config.backgroundColor || '#6366F1' }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur px-3 py-1 rounded-lg">
            <TypeIcon className="w-5 h-5" />
            <span className="text-sm font-medium">{magnet.type.replace('_', ' ')}</span>
          </div>
          {getStatusBadge()}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{magnet.name}</h3>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Visualizaciones</p>
            <p className="text-lg font-bold text-gray-900">{magnet.stats.views.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Leads</p>
            <p className="text-lg font-bold text-blue-600">{magnet.stats.leads.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Conversión</p>
            <p className="text-lg font-bold text-green-600">{(magnet.stats.conversionRate * 100).toFixed(0)}%</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewStats(magnet.id)}
            className="flex-1"
            leftIcon={<BarChart3 size={16} />}
          >
            Estadísticas
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(magnet.id)}
            leftIcon={<Edit size={16} />}
          >
            <span className="sr-only">Editar</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(magnet.id)}
            leftIcon={<Trash2 size={16} />}
          >
            <span className="sr-only">Eliminar</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

