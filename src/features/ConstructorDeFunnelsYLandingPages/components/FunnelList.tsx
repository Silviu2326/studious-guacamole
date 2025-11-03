import React from 'react';
import { Funnel } from '../api/funnels';
import { Globe, Edit, Trash2, BarChart3, Eye } from 'lucide-react';

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {funnels.map((funnel) => (
        <div
          key={funnel.funnelId}
          className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{funnel.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {funnel.steps.length} {funnel.steps.length === 1 ? 'página' : 'páginas'}
              </p>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${
                funnel.status === 'published'
                  ? 'bg-green-100 text-green-800'
                  : funnel.status === 'draft'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {funnel.status === 'published' ? 'Publicado' : funnel.status === 'draft' ? 'Borrador' : 'Archivado'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {funnel.steps.map((step) => (
              <span
                key={step.pageId}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {step.name}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
            <button
              onClick={() => onEdit(funnel.funnelId)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition"
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>
            {funnel.status === 'published' && (
              <>
                <button
                  onClick={() => onViewLive(funnel.funnelId)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded transition"
                >
                  <Eye className="w-4 h-4" />
                  Ver
                </button>
                <button
                  onClick={() => onViewAnalytics(funnel.funnelId)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded transition"
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </button>
              </>
            )}
            <button
              onClick={() => onDelete(funnel.funnelId)}
              className="ml-auto flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};


