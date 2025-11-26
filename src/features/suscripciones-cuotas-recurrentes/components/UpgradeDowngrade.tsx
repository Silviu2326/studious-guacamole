import React, { useState } from 'react';
import { Suscripcion } from '../types';
import { Card, Button, Modal, Select } from '../../../components/componentsreutilizables';
import { upgradePlan, downgradePlan } from '../api/suscripciones';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface UpgradeDowngradeProps {
  suscripcion: Suscripcion;
  onSuccess?: () => void;
}

export const UpgradeDowngrade: React.FC<UpgradeDowngradeProps> = ({
  suscripcion,
  onSuccess,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [tipoCambio, setTipoCambio] = useState<'upgrade' | 'downgrade'>('upgrade');
  const [nuevoPlan, setNuevoPlan] = useState<string>('');

  const planesDisponibles = [
    { value: 'basico', label: 'Básico', precio: 50 },
    { value: 'premium', label: 'Premium', precio: 80 },
    { value: 'vip', label: 'VIP', precio: 120 },
  ];

  const handleCambioPlan = async () => {
    try {
      const planSeleccionado = planesDisponibles.find(p => p.value === nuevoPlan);
      if (!planSeleccionado) return;

      if (tipoCambio === 'upgrade') {
        await upgradePlan(suscripcion.id, nuevoPlan, planSeleccionado.precio);
      } else {
        await downgradePlan(suscripcion.id, nuevoPlan, planSeleccionado.precio);
      }
      
      setModalOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error cambiando plan:', error);
      alert('Error al cambiar el plan');
    }
  };

  return (
    <>
      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Cambio de Plan
            </h3>
            <p className="text-base text-gray-600">
              Plan actual: {suscripcion.planNombre} ({suscripcion.precio} €/mes)
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={() => {
                setTipoCambio('upgrade');
                setModalOpen(true);
              }}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Upgrade
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setTipoCambio('downgrade');
                setModalOpen(true);
              }}
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              Downgrade
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={tipoCambio === 'upgrade' ? 'Upgrade de Plan' : 'Downgrade de Plan'}
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="Seleccionar Nuevo Plan"
            value={nuevoPlan}
            onChange={(e) => setNuevoPlan(e.target.value)}
            options={planesDisponibles
              .filter(p => 
                tipoCambio === 'upgrade' 
                  ? p.precio > suscripcion.precio 
                  : p.precio < suscripcion.precio
              )
              .map(p => ({
                value: p.value,
                label: `${p.label} - ${p.precio} €/mes`,
              }))}
          />
          
          {nuevoPlan && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">
                Diferencia de precio:
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {(() => {
                  const planSeleccionado = planesDisponibles.find(p => p.value === nuevoPlan);
                  if (!planSeleccionado) return '0 €';
                  const diferencia = planSeleccionado.precio - suscripcion.precio;
                  return `${diferencia > 0 ? '+' : ''}${diferencia} €/mes`;
                })()}
              </p>
            </div>
          )}
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleCambioPlan}
              disabled={!nuevoPlan}
            >
              Confirmar Cambio
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

