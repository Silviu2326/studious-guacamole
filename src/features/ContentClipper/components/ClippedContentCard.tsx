import React from 'react';
import { ClippedContent } from '../api/clips';
import { Edit, Trash2, ExternalLink, Tag as TagIcon } from 'lucide-react';

interface ClippedContentCardProps {
  clip: ClippedContent;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Muestra una tarjeta individual para un contenido guardado.
 * Muestra la imagen, título, fuente, etiquetas y botones de acción.
 */
export const ClippedContentCard: React.FC<ClippedContentCardProps> = ({
  clip,
  onEdit,
  onDelete
}) => {
  const handleOpenLink = () => {
    window.open(clip.originalUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Imagen de vista previa */}
      {clip.thumbnailUrl && (
        <div className="aspect-video w-full bg-gray-100 overflow-hidden">
          <img
            src={clip.thumbnailUrl}
            alt={clip.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      {/* Contenido */}
      <div className="p-4">
        {/* Categoría */}
        {clip.category && (
          <div className="mb-2">
            <span
              className="inline-block px-2 py-1 text-xs font-medium rounded-full"
              style={{
                backgroundColor: clip.category.color ? `${clip.category.color}20` : '#F3F4F620',
                color: clip.category.color || '#6B7280'
              }}
            >
              {clip.category.name}
            </span>
          </div>
        )}
        
        {/* Título */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {clip.title}
        </h3>
        
        {/* Descripción */}
        {clip.scrapedDescription && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {clip.scrapedDescription}
          </p>
        )}
        
        {/* Notas personales */}
        {clip.personalNotes && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-100 rounded text-sm text-blue-900">
            <span className="font-medium">Nota:</span> {clip.personalNotes}
          </div>
        )}
        
        {/* Tags */}
        {clip.tags && clip.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {clip.tags.map(tag => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                <TagIcon className="w-3 h-3" />
                {tag.name}
              </span>
            ))}
          </div>
        )}
        
        {/* Fuente y fecha */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>{clip.source || 'Fuente desconocida'}</span>
          <span>
            {new Date(clip.createdAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short'
            })}
          </span>
        </div>
        
        {/* Acciones */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
          <button
            onClick={handleOpenLink}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition"
          >
            <ExternalLink className="w-4 h-4" />
            Abrir
          </button>
          <button
            onClick={() => onEdit(clip.id)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded transition"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button>
          <button
            onClick={() => onDelete(clip.id)}
            className="ml-auto flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};


