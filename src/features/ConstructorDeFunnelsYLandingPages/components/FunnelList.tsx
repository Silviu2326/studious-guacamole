import React from 'react';
import { Funnel } from '../api/funnels';
import { Globe, Edit, Trash2, BarChart3, Eye } from 'lucide-react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';

interface FunnelListProps {
  funnels: Funnel[];
  onEdit: (funnelId: string) => void;
  onDelete: (funnelId: string) => void;
  onViewAnalytics: (funnelId: string) => void;
  onViewLive: (funnelId: string) => void;
}

export const FunnelList: React.FC<FunnelListProps> = ({
  funnels,
  onEdit,
  onDelete,
  onViewAnalytics,
  onViewLive
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {funnels.map((funnel) => (
        <Card
          key={funnel.funnelId}
          variant="hover"
          className="h-full flex flex-col transition-shadow overflow-hidden"
          padding="md"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{funnel.name}</h3>
              <p className="text-sm text-gray-600">
                {funnel.steps.length} {funnel.steps.length === 1 ? 'página' : 'páginas'}
              </p>
            </div>
            <Badge
              variant={
                funnel.status === 'published'
                  ? 'green'
                  : funnel.status === 'draft'
                  ? 'yellow'
                  : 'gray'
              }
              size="sm"
            >
              {funnel.status === 'published' ? 'Publicado' : funnel.status === 'draft' ? 'Borrador' : 'Archivado'}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {funnel.steps.map((step) => (
              <Badge key={step.pageId} variant="gray" size="sm">
                {step.name}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(funnel.funnelId)}
              leftIcon={<Edit size={16} />}
            >
              Editar
            </Button>
            {funnel.status === 'published' && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewLive(funnel.funnelId)}
                  leftIcon={<Eye size={16} />}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  Ver
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewAnalytics(funnel.funnelId)}
                  leftIcon={<BarChart3 size={16} />}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  Analytics
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(funnel.funnelId)}
              className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-50"
              leftIcon={<Trash2 size={16} />}
            >
              Eliminar
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};


