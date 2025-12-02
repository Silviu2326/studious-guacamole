import React, { useState } from 'react';
import { Card, Button, Input, Modal } from '../../../components/componentsreutilizables';
import { PlantillaFactura } from '../types';
import { Plus, Edit, Trash2, CheckCircle } from 'lucide-react';

export const PlantillasFactura: React.FC = () => {
  const [plantillas, setPlantillas] = useState<PlantillaFactura[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [plantillaActual, setPlantillaActual] = useState<Partial<PlantillaFactura>>({});

  // Mock de plantillas
  const plantillasMock: PlantillaFactura[] = [
    {
      id: '1',
      nombre: 'Plantilla Estándar',
      descripcion: 'Plantilla básica para facturación',
      colorPrincipal: '#3B82F6',
      colorSecundario: '#1E40AF',
      activa: true,
      fechaCreacion: new Date('2024-01-01')
    },
    {
      id: '2',
      nombre: 'Plantilla Premium',
      descripcion: 'Plantilla con branding personalizado',
      colorPrincipal: '#8B5CF6',
      colorSecundario: '#6D28D9',
      activa: false,
      fechaCreacion: new Date('2024-01-15')
    }
  ];

  React.useEffect(() => {
    setPlantillas(plantillasMock);
  }, []);

  const abrirModalCrear = () => {
    setPlantillaActual({});
    setMostrarModal(true);
  };

  const abrirModalEditar = (plantilla: PlantillaFactura) => {
    setPlantillaActual(plantilla);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setPlantillaActual({});
  };

  const handleGuardar = () => {
    // TODO: Implementar guardado de plantilla
    alert('Funcionalidad de guardado de plantillas próximamente disponible');
    cerrarModal();
  };

  const handleActivar = (id: string) => {
    setPlantillas(plantillas.map(p => ({
      ...p,
      activa: p.id === id
    })));
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-end">
        <Button variant="primary" onClick={abrirModalCrear}>
          <Plus size={20} className="mr-2" />
          Nueva Plantilla
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plantillas.map(plantilla => (
          <Card key={plantilla.id} variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
            <div className="p-4 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {plantilla.nombre}
                  </h4>
                  {plantilla.descripcion && (
                    <p className="text-sm text-gray-600 mt-1">
                      {plantilla.descripcion}
                    </p>
                  )}
                </div>
                {plantilla.activa && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
              
              {plantilla.colorPrincipal && (
                <div className="flex gap-2 mb-4">
                  <div
                    className="w-12 h-12 rounded-lg"
                    style={{ backgroundColor: plantilla.colorPrincipal }}
                  />
                  {plantilla.colorSecundario && (
                    <div
                      className="w-12 h-12 rounded-lg"
                      style={{ backgroundColor: plantilla.colorSecundario }}
                    />
                  )}
                </div>
              )}

              <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => abrirModalEditar(plantilla)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                {!plantilla.activa && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleActivar(plantilla.id)}
                  >
                    Activar
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de creación/edición */}
      {mostrarModal && (
        <Modal
          isOpen={true}
          onClose={cerrarModal}
          title={plantillaActual.id ? 'Editar Plantilla' : 'Nueva Plantilla'}
          size="lg"
          footer={
            <div className="flex gap-3">
              <Button variant="secondary" onClick={cerrarModal}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleGuardar}>
                Guardar
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Nombre de la Plantilla"
              value={plantillaActual.nombre || ''}
              onChange={(e) => setPlantillaActual({ ...plantillaActual, nombre: e.target.value })}
              required
            />
            <Input
              label="Descripción"
              value={plantillaActual.descripcion || ''}
              onChange={(e) => setPlantillaActual({ ...plantillaActual, descripcion: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Color Principal"
                type="color"
                value={plantillaActual.colorPrincipal || '#3B82F6'}
                onChange={(e) => setPlantillaActual({ ...plantillaActual, colorPrincipal: e.target.value })}
              />
              <Input
                label="Color Secundario"
                type="color"
                value={plantillaActual.colorSecundario || '#1E40AF'}
                onChange={(e) => setPlantillaActual({ ...plantillaActual, colorSecundario: e.target.value })}
              />
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                La personalización avanzada de plantillas (logos, encabezados, pies de página) estará disponible próximamente.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

