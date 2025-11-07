import React, { useState } from 'react';
import { Suscripcion } from '../types';
import { Card, Button, Modal, Select } from '../../../components/componentsreutilizables';
import { activarMultisesion, desactivarMultisesion } from '../api/suscripciones';
import { Layers } from 'lucide-react';

interface MultisesionProps {
  suscripcion: Suscripcion;
  onSuccess?: () => void;
}

const serviciosDisponibles = [
  'gimnasio',
  'spa',
  'piscina',
  'clases-grupales',
  'crossfit',
  'yoga',
  'pilates',
  'fisioterapia',
];

export const Multisesion: React.FC<MultisesionProps> = ({
  suscripcion,
  onSuccess,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<string[]>(
    suscripcion.serviciosMultisesion || []
  );

  const handleActivarMultisesion = async () => {
    try {
      await activarMultisesion({
        suscripcionId: suscripcion.id,
        servicios: serviciosSeleccionados,
      });
      
      setModalOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error activando multisesión:', error);
      alert('Error al activar multisesión');
    }
  };

  const handleDesactivarMultisesion = async () => {
    try {
      await desactivarMultisesion(suscripcion.id);
      onSuccess?.();
    } catch (error) {
      console.error('Error desactivando multisesión:', error);
      alert('Error al desactivar multisesión');
    }
  };

  const toggleServicio = (servicio: string) => {
    setServiciosSeleccionados(prev => {
      if (prev.includes(servicio)) {
        return prev.filter(s => s !== servicio);
      } else {
        return [...prev, servicio];
      }
    });
  };

  if (!suscripcion.permiteMultisesion) {
    return null;
  }

  return (
    <>
      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Multisesión
            </h3>
            {suscripcion.multisesionActivo ? (
              <div className="space-y-2">
                <p className="text-base text-gray-600">
                  Servicios activos: {suscripcion.serviciosMultisesion?.length || 0}
                </p>
                <div className="flex flex-wrap gap-2">
                  {suscripcion.serviciosMultisesion?.map(servicio => (
                    <span
                      key={servicio}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm"
                    >
                      {servicio}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-base text-gray-600">
                Acceso a múltiples servicios con una sola membresía
              </p>
            )}
          </div>
          {suscripcion.multisesionActivo ? (
            <Button
              variant="secondary"
              onClick={handleDesactivarMultisesion}
            >
              Desactivar
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => setModalOpen(true)}
            >
              <Layers className="w-4 h-4 mr-2" />
              Activar Multisesión
            </Button>
          )}
        </div>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Activar Multisesión"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-base text-gray-600">
            Selecciona los servicios a los que quieres tener acceso:
          </p>
          
          <div className="space-y-2">
            {serviciosDisponibles.map(servicio => (
              <label
                key={servicio}
                className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={serviciosSeleccionados.includes(servicio)}
                  onChange={() => toggleServicio(servicio)}
                  className="w-4 h-4"
                />
                <span className="text-base text-gray-900">
                  {servicio.charAt(0).toUpperCase() + servicio.slice(1).replace('-', ' ')}
                </span>
              </label>
            ))}
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleActivarMultisesion}
              disabled={serviciosSeleccionados.length === 0}
            >
              Activar Multisesión
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

