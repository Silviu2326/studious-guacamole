import React, { useState } from 'react';
import { ClientTransformation } from '../api/social';
import { Card, Button, Modal } from '../../../components/componentsreutilizables';
import { User, Award, Calendar, MessageSquare, Share2, Plus } from 'lucide-react';

interface ClientTransformationsProps {
  transformations: ClientTransformation[];
  onTransformToPost?: (transformation: ClientTransformation) => void;
  onCreateTransformation?: () => void;
}

export const ClientTransformations: React.FC<ClientTransformationsProps> = ({
  transformations,
  onTransformToPost,
  onCreateTransformation
}) => {
  const [selectedTransformation, setSelectedTransformation] = useState<ClientTransformation | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award size={20} className="text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Transformaciones de Clientes</h3>
        </div>
        <Button
          onClick={onCreateTransformation}
          size="sm"
          leftIcon={<Plus size={18} />}
        >
          Nueva Transformación
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {transformations.map((transformation) => (
          <Card
            key={transformation.id}
            className="p-5 bg-white shadow-sm ring-1 ring-gray-200 hover:ring-purple-400 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <User size={18} className="text-purple-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">{transformation.clientName}</h4>
                  <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                    <Calendar size={12} />
                    <span>{transformation.duration}</span>
                  </div>
                </div>
              </div>
              {transformation.socialPostId && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Publicado
                </span>
              )}
            </div>

            {/* Imágenes antes/después */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="relative">
                <img
                  src={transformation.beforeImage}
                  alt="Antes"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Antes
                </div>
              </div>
              <div className="relative">
                <img
                  src={transformation.afterImage}
                  alt="Después"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Después
                </div>
              </div>
            </div>

            {/* Resultados */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">Resultados:</p>
              <div className="flex flex-wrap gap-2">
                {transformation.results.map((result, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                  >
                    {result}
                  </span>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            {transformation.testimonial && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <MessageSquare size={14} className="text-gray-400 mt-0.5" />
                  <p className="text-xs text-gray-700 italic">"{transformation.testimonial}"</p>
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="flex gap-2 pt-3 border-t border-gray-200">
              {!transformation.socialPostId && (
                <Button
                  onClick={() => onTransformToPost?.(transformation)}
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  leftIcon={<Share2 size={16} />}
                >
                  Crear Post
                </Button>
              )}
              <Button
                onClick={() => setSelectedTransformation(transformation)}
                variant="ghost"
                size="sm"
              >
                Ver Detalles
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {transformations.length === 0 && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Award size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay transformaciones</h3>
          <p className="text-gray-600 mb-4">Guarda las transformaciones de tus clientes para crear contenido impactante</p>
          <Button onClick={onCreateTransformation} leftIcon={<Plus size={18} />}>
            Agregar Transformación
          </Button>
        </Card>
      )}

      {/* Modal de detalles */}
      {selectedTransformation && (
        <Modal
          isOpen={!!selectedTransformation}
          onClose={() => setSelectedTransformation(null)}
          title={`Transformación - ${selectedTransformation.clientName}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <img
                  src={selectedTransformation.beforeImage}
                  alt="Antes"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <p className="text-center text-sm font-medium text-gray-700 mt-2">Antes</p>
              </div>
              <div>
                <img
                  src={selectedTransformation.afterImage}
                  alt="Después"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <p className="text-center text-sm font-medium text-gray-700 mt-2">Después</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Duración:</p>
              <p className="text-gray-900">{selectedTransformation.duration}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Resultados:</p>
              <div className="flex flex-wrap gap-2">
                {selectedTransformation.results.map((result, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {result}
                  </span>
                ))}
              </div>
            </div>

            {selectedTransformation.testimonial && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Testimonial:</p>
                <p className="text-gray-900 italic">"{selectedTransformation.testimonial}"</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

