import React from 'react';
import { ClippedContent } from '../api/clips';
import { Card, Badge, Button } from '../../../components/componentsreutilizables';
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
    <Card variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
      {/* Imagen de vista previa */}
      {clip.thumbnailUrl && (
        <div className="h-48 bg-gray-100 overflow-hidden">
          <img
            src={clip.thumbnailUrl}
            alt={clip.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      {/* Contenido */}
      <div className="p-4 flex flex-col flex-1">
        <div className="space-y-2 mb-4">
          {/* Categoría */}
          {clip.category && (
            <Badge 
              variant="blue" 
              leftIcon={<TagIcon size={12} />}
            >
              {clip.category.name}
            </Badge>
          )}
          
          {/* Título */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {clip.title}
          </h3>
          
          {/* Descripción */}
          {clip.scrapedDescription && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {clip.scrapedDescription}
            </p>
          )}
          
          {/* Notas personales */}
          {clip.personalNotes && (
            <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-900">
              <span className="font-medium">Nota:</span> {clip.personalNotes}
            </div>
          )}
          
          {/* Tags */}
          {clip.tags && clip.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {clip.tags.map(tag => (
                <Badge 
                  key={tag.id}
                  variant="gray"
                  size="sm"
                  leftIcon={<TagIcon size={12} />}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        {/* Fuente y fecha */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>{clip.source || 'Fuente desconocida'}</span>
          <span>
            {new Date(clip.createdAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short'
            })}
          </span>
        </div>
        
        {/* Acciones */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenLink}
            leftIcon={<ExternalLink size={16} />}
          >
            Abrir
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(clip.id)}
            leftIcon={<Edit size={16} />}
          >
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(clip.id)}
            className="ml-auto"
            leftIcon={<Trash2 size={16} />}
          >
          </Button>
        </div>
      </div>
    </Card>
  );
};


