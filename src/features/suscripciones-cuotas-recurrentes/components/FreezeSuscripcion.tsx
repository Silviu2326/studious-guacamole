import React, { useState } from 'react';
import { Suscripcion } from '../types';
import { Card, Button, Modal, Input } from '../../../components/componentsreutilizables';
import { freezeSuscripcion, unfreezeSuscripcion } from '../api/suscripciones';
import { Pause, Play } from 'lucide-react';

interface FreezeSuscripcionProps {
  suscripcion: Suscripcion;
  onSuccess?: () => void;
}

export const FreezeSuscripcion: React.FC<FreezeSuscripcionProps> = ({
  suscripcion,
  onSuccess,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  const [motivo, setMotivo] = useState<string>('');

  const calcularDias = () => {
    if (!fechaInicio || !fechaFin) return 0;
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diffTime = Math.abs(fin.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleFreeze = async () => {
    try {
      const diasTotales = calcularDias();
      await freezeSuscripcion({
        suscripcionId: suscripcion.id,
        fechaInicio,
        fechaFin,
        motivo,
        diasTotales,
      });
      
      setModalOpen(false);
      setFechaInicio('');
      setFechaFin('');
      setMotivo('');
      onSuccess?.();
    } catch (error) {
      console.error('Error haciendo freeze:', error);
      alert('Error al pausar la suscripción');
    }
  };

  const handleUnfreeze = async () => {
    try {
      await unfreezeSuscripcion(suscripcion.id);
      onSuccess?.();
    } catch (error) {
      console.error('Error desactivando freeze:', error);
      alert('Error al reactivar la suscripción');
    }
  };

  // Permitir freeze para suscripciones PT o gimnasios que lo permitan
  const puedeFreeze = suscripcion.tipo === 'pt-mensual' || suscripcion.permiteFreeze;
  
  if (!puedeFreeze) {
    return null;
  }

  return (
    <>
      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Freeze de Suscripción
            </h3>
            {suscripcion.freezeActivo ? (
              <div className="space-y-2">
                <p className="text-base text-gray-600">
                  Freeze activo hasta: {suscripcion.fechaFreezeFin ? new Date(suscripcion.fechaFreezeFin).toLocaleDateString('es-ES') : '-'}
                </p>
                <p className="text-sm text-gray-600">
                  Días restantes: {suscripcion.diasFreezeRestantes}
                </p>
                {suscripcion.reanudacionAutomatica && (
                  <p className="text-sm text-green-600 font-medium">
                    ✓ Reanudación automática activada
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-base text-gray-600">
                  Pausa temporal de la suscripción sin perder los días restantes
                </p>
                <p className="text-sm text-gray-500">
                  La suscripción se reanudará automáticamente después del período de pausa
                </p>
              </div>
            )}
          </div>
          {suscripcion.freezeActivo ? (
            <Button
              variant="primary"
              onClick={handleUnfreeze}
            >
              <Play className="w-4 h-4 mr-2" />
              Reactivar
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={() => setModalOpen(true)}
            >
              <Pause className="w-4 h-4 mr-2" />
              Pausar Suscripción
            </Button>
          )}
        </div>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Pausar Suscripción (Freeze)"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Fecha de Inicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
          
          <Input
            label="Fecha de Fin"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
          
          {fechaInicio && fechaFin && calcularDias() > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">
                Días de freeze:
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {calcularDias()} días
              </p>
            </div>
          )}
          
          <Input
            label="Motivo (opcional)"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ej: Viaje, lesión, etc."
          />
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleFreeze}
              disabled={!fechaInicio || !fechaFin}
            >
              Confirmar Freeze
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

