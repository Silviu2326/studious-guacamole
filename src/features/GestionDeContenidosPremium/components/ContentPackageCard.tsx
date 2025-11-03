import React from 'react';
import { ContentPackage } from '../api/contentPackages';
import { 
  Edit, 
  BarChart3, 
  Eye, 
  Users, 
  DollarSign, 
  Lock, 
  Unlock,
  Copy,
  Trash2
} from 'lucide-react';

interface ContentPackageCardProps {
  packageData: ContentPackage;
  onEdit: (id: string) => void;
  onAnalytics: (id: string) => void;
  onPreview?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

/**
 * Tarjeta visual que representa un único paquete de contenido.
 */
export const ContentPackageCard: React.FC<ContentPackageCardProps> = ({
  packageData,
  onEdit,
  onAnalytics,
  onPreview,
  onDuplicate,
  onDelete
}) => {
  const getAccessTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'one-time': 'Pago Único',
      'subscription': 'Suscripción',
      'free': 'Gratuito',
      'custom': 'Personalizado'
    };
    return labels[type] || type;
  };

  const getAccessTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'one-time': 'bg-green-100 text-green-800',
      'subscription': 'bg-blue-100 text-blue-800',
      'free': 'bg-gray-100 text-gray-800',
      'custom': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Imagen de portada */}
      {packageData.imageUrl && (
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img
            src={packageData.imageUrl}
            alt={packageData.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Contenido */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{packageData.title}</h3>
            {packageData.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{packageData.description}</p>
            )}
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ml-2 ${getAccessTypeColor(packageData.accessType)}`}>
            {getAccessTypeLabel(packageData.accessType)}
          </span>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-gray-500" />
            <div>
              <p className="font-semibold text-gray-900">{packageData.enrolledClients}</p>
              <p className="text-xs text-gray-500">Inscritos</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <div>
              <p className="font-semibold text-gray-900">
                {packageData.price > 0 ? `${packageData.price.toFixed(2)}${packageData.currency || '€'}` : 'Gratis'}
              </p>
              {packageData.totalRevenue && packageData.totalRevenue > 0 && (
                <p className="text-xs text-gray-500">
                  {packageData.totalRevenue.toFixed(2)}€ total
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Módulos */}
        <div className="mb-4">
          <p className="text-xs text-gray-600 mb-1">
            {packageData.modules.length} {packageData.modules.length === 1 ? 'módulo' : 'módulos'}
            {packageData.isDripEnabled && ' • Drip Content activado'}
          </p>
          <div className="flex items-center gap-2">
            {packageData.isPublished ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                <Unlock className="w-3 h-3" />
                Publicado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                <Lock className="w-3 h-3" />
                Borrador
              </span>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={() => onEdit(packageData.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button>
          
          {packageData.enrolledClients > 0 && (
            <button
              onClick={() => onAnalytics(packageData.id)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
              title="Analytics"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          )}
          
          {onPreview && (
            <button
              onClick={() => onPreview(packageData.id)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
              title="Vista Previa"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          
          {onDuplicate && (
            <button
              onClick={() => onDuplicate(packageData.id)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
              title="Duplicar"
            >
              <Copy className="w-4 h-4" />
            </button>
          )}
          
          {onDelete && (
            <button
              onClick={() => {
                if (window.confirm('¿Estás seguro de que quieres eliminar este paquete?')) {
                  onDelete(packageData.id);
                }
              }}
              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


