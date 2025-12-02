import React, { useState } from 'react';
import { ContenidoMotivacional as ContenidoMotivacionalType } from '../types';
import { Card, Button, Input, Select, Textarea, Modal } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { ds } from '../../adherencia/ui/ds';
import { MessageSquare, Video, Image, FileText, Plus, Edit, Trash2 } from 'lucide-react';

interface ContenidoMotivacionalProps {
  contenido: ContenidoMotivacionalType[];
  onAgregar?: (contenido: Omit<ContenidoMotivacionalType, 'id' | 'fechaPublicacion'>) => void;
  onEditar?: (id: string, contenido: Partial<ContenidoMotivacionalType>) => void;
  onEliminar?: (id: string) => void;
}

export const ContenidoMotivacional: React.FC<ContenidoMotivacionalProps> = ({
  contenido,
  onAgregar,
  onEditar,
  onEliminar,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    tipo: 'mensaje' as 'mensaje' | 'video' | 'imagen' | 'articulo',
    titulo: '',
    contenido: '',
    url: '',
  });

  const getIcono = (tipo: string) => {
    switch (tipo) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'imagen':
        return <Image className="w-5 h-5" />;
      case 'articulo':
        return <FileText className="w-5 h-5" />;
      default:
        return <MessageSquare className="w-5 h-5" />;
    }
  };

  const handleSubmit = () => {
    if (!formData.titulo.trim() || !formData.contenido.trim()) {
      return;
    }

    if (onAgregar) {
      onAgregar({
        tipo: formData.tipo,
        titulo: formData.titulo.trim(),
        contenido: formData.contenido.trim(),
        url: formData.url || undefined,
      });
    }

    setFormData({
      tipo: 'mensaje',
      titulo: '',
      contenido: '',
      url: '',
    });
    setShowModal(false);
  };

  const formatFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Card className="bg-white shadow-sm">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-gray-500" />
              <h3 className="text-xl font-bold text-gray-900">
                Contenido Motivacional
              </h3>
            </div>
            {onAgregar && (
              <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
                <Plus size={20} className="mr-2" />
                Agregar Contenido
              </Button>
            )}
          </div>

          {contenido.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay contenido motivacional aún</h3>
              <p className="text-gray-600 mb-4">
                Agrega mensajes, videos o artículos para motivar a los participantes
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {contenido.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="mt-1">
                        {getIcono(item.tipo)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                            {item.titulo}
                          </h4>
                          <Badge variant="outline">
                            {item.tipo}
                          </Badge>
                        </div>
                        <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
                          {item.contenido}
                        </p>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${ds.typography.caption} text-blue-600 dark:text-blue-400 hover:underline`}
                          >
                            Ver contenido →
                          </a>
                        )}
                        <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mt-2`}>
                          {formatFecha(item.fechaPublicacion)}
                        </p>
                      </div>
                    </div>
                    {(onEditar || onEliminar) && (
                      <div className="flex items-center space-x-2 ml-4">
                        {onEditar && (
                          <Button variant="ghost" size="sm" onClick={() => {}}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {onEliminar && (
                          <Button variant="ghost" size="sm" onClick={() => onEliminar(item.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Agregar Contenido Motivacional"
        size="lg"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Agregar
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Select
            label="Tipo de Contenido"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
            options={[
              { value: 'mensaje', label: 'Mensaje' },
              { value: 'video', label: 'Video' },
              { value: 'imagen', label: 'Imagen' },
              { value: 'articulo', label: 'Artículo' },
            ]}
          />

          <Input
            label="Título"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            placeholder="Título del contenido"
          />

          <Textarea
            label="Contenido"
            value={formData.contenido}
            onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
            rows={4}
            placeholder="Descripción o mensaje..."
          />

          {(formData.tipo === 'video' || formData.tipo === 'imagen' || formData.tipo === 'articulo') && (
            <Input
              label="URL"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="URL del contenido (opcional)"
            />
          )}
        </div>
      </Modal>
    </>
  );
};

