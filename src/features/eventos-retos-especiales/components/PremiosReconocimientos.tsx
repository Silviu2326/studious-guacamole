import React, { useState } from 'react';
import { Premio, TipoPremio } from '../types';
import { Card, Button, Input, Select, Textarea, Modal } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Award, Plus, Edit, Trash2, Gift } from 'lucide-react';

interface PremiosReconocimientosProps {
  premios: Premio[];
  onAgregar?: (premio: Omit<Premio, 'id'>) => void;
  onEditar?: (id: string, premio: Partial<Premio>) => void;
  onEliminar?: (id: string) => void;
}

export const PremiosReconocimientos: React.FC<PremiosReconocimientosProps> = ({
  premios,
  onAgregar,
  onEditar,
  onEliminar,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    tipo: 'medalla' as TipoPremio,
    nombre: '',
    descripcion: '',
    imagen: '',
    requisito: '',
  });

  const getIconoTipo = (tipo: TipoPremio) => {
    switch (tipo) {
      case 'medalla':
        return <Award className="w-5 h-5 text-yellow-500" />;
      case 'certificado':
        return <Gift className="w-5 h-5 text-blue-500" />;
      case 'descuento':
        return <Gift className="w-5 h-5 text-green-500" />;
      case 'producto':
        return <Gift className="w-5 h-5 text-purple-500" />;
      case 'experiencia':
        return <Gift className="w-5 h-5 text-pink-500" />;
    }
  };

  const handleSubmit = () => {
    if (!formData.nombre.trim() || !formData.descripcion.trim() || !formData.requisito.trim()) {
      return;
    }

    if (onAgregar) {
      onAgregar({
        tipo: formData.tipo,
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        imagen: formData.imagen || undefined,
        requisito: formData.requisito.trim(),
      });
    }

    setFormData({
      tipo: 'medalla',
      nombre: '',
      descripcion: '',
      imagen: '',
      requisito: '',
    });
    setShowModal(false);
  };

  return (
    <>
      <Card className="bg-white shadow-sm">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-gray-500" />
              <h3 className="text-xl font-bold text-gray-900">
                Premios y Reconocimientos
              </h3>
            </div>
            {onAgregar && (
              <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
                <Plus size={20} className="mr-2" />
                Agregar Premio
              </Button>
            )}
          </div>

          {premios.length === 0 ? (
            <div className="p-8 text-center">
              <Award size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay premios configurados</h3>
              <p className="text-gray-600 mb-4">
                Agrega premios para motivar a los participantes
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {premios.map((premio) => (
                <div
                  key={premio.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getIconoTipo(premio.tipo)}
                      <h4 className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {premio.nombre}
                      </h4>
                    </div>
                    {(onEditar || onEliminar) && (
                      <div className="flex items-center space-x-1">
                        {onEditar && (
                          <Button variant="ghost" size="sm" onClick={() => {}}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {onEliminar && (
                          <Button variant="ghost" size="sm" onClick={() => onEliminar(premio.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-3`}>
                    {premio.descripcion}
                  </p>
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                    <p className={`${ds.typography.caption} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      Requisito:
                    </p>
                    <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                      {premio.requisito}
                    </p>
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
        title="Agregar Premio"
        size="md"
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
            label="Tipo de Premio"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoPremio })}
            options={[
              { value: 'medalla', label: 'Medalla' },
              { value: 'certificado', label: 'Certificado' },
              { value: 'descuento', label: 'Descuento' },
              { value: 'producto', label: 'Producto' },
              { value: 'experiencia', label: 'Experiencia' },
            ]}
          />

          <Input
            label="Nombre del Premio"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej: Medalla Completador"
          />

          <Textarea
            label="Descripción"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            rows={3}
            placeholder="Describe el premio..."
          />

          <Input
            label="Requisito para Obtener"
            value={formData.requisito}
            onChange={(e) => setFormData({ ...formData, requisito: e.target.value })}
            placeholder="Ej: 100% de adherencia"
          />

          <Input
            label="URL de Imagen (opcional)"
            value={formData.imagen}
            onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </Modal>
    </>
  );
};

