import React, { useState, useMemo } from 'react';
import { Suscripcion } from '../types';
import { Card, Button, Modal, Input } from '../../../components/componentsreutilizables';
import { freezeSuscripcion, unfreezeSuscripcion } from '../api/suscripciones';
import { Pause, Play, Calendar, Info } from 'lucide-react';

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
  const [notasInternas, setNotasInternas] = useState<string>('');

  const calcularDias = () => {
    if (!fechaInicio || !fechaFin) return 0;
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diffTime = Math.abs(fin.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calcular nueva fecha de vencimiento después del freeze
  const nuevaFechaVencimiento = useMemo(() => {
    if (!fechaInicio || !fechaFin || !suscripcion.fechaVencimiento) return null;
    const diasFreeze = calcularDias();
    if (diasFreeze === 0) return null;
    
    const fechaVencimientoOriginal = new Date(suscripcion.fechaVencimiento);
    const nuevaFecha = new Date(fechaVencimientoOriginal);
    nuevaFecha.setDate(nuevaFecha.getDate() + diasFreeze);
    
    return nuevaFecha;
  }, [fechaInicio, fechaFin, suscripcion.fechaVencimiento]);

  const handleFreeze = async () => {
    try {
      const diasTotales = calcularDias();
      await freezeSuscripcion({
        suscripcionId: suscripcion.id,
        fechaInicio,
        fechaFin,
        motivo: motivo || undefined,
        notasInternas: notasInternas || undefined,
        diasTotales,
      });
      
      setModalOpen(false);
      setFechaInicio('');
      setFechaFin('');
      setMotivo('');
      setNotasInternas('');
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
        onClose={() => {
          setModalOpen(false);
          setFechaInicio('');
          setFechaFin('');
          setMotivo('');
          setNotasInternas('');
        }}
        title="Congelar Suscripción (Freeze)"
        size="lg"
      >
        <div className="space-y-6">
          {/* Información de la suscripción actual */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Información de la Suscripción
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <span className="font-medium">Cliente:</span> {suscripcion.clienteNombre}
              </div>
              <div>
                <span className="font-medium">Plan:</span> {suscripcion.planNombre}
              </div>
              <div>
                <span className="font-medium">Fecha de vencimiento actual:</span>
              </div>
              <div className="font-medium text-gray-900 dark:text-white">
                {new Date(suscripcion.fechaVencimiento).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Selección de fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Fecha de Inicio del Freeze"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            
            <Input
              label="Fecha de Fin del Freeze"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              min={fechaInicio || new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          {/* Resumen del impacto */}
          {fechaInicio && fechaFin && calcularDias() > 0 && nuevaFechaVencimiento && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    Impacto del Freeze
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700 dark:text-blue-400">Días de congelación:</span>
                      <span className="font-semibold text-blue-900 dark:text-blue-200">
                        {calcularDias()} días
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700 dark:text-blue-400">Fecha de vencimiento actual:</span>
                      <span className="text-blue-900 dark:text-blue-200">
                        {new Date(suscripcion.fechaVencimiento).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-blue-200 dark:border-blue-700">
                      <span className="font-medium text-blue-900 dark:text-blue-200">
                        Nueva fecha de vencimiento:
                      </span>
                      <span className="font-bold text-blue-900 dark:text-blue-100">
                        {nuevaFechaVencimiento.toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 italic">
                      La suscripción se extenderá automáticamente por los días de congelación
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Motivo (opcional, visible para el cliente) */}
          <Input
            label="Motivo (opcional)"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ej: Viaje, lesión, etc."
          />

          {/* Notas internas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notas Internas (opcional)
            </label>
            <textarea
              value={notasInternas}
              onChange={(e) => setNotasInternas(e.target.value)}
              placeholder="Notas internas sobre esta congelación (no visibles para el cliente)..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Estas notas son solo para uso interno y no serán visibles para el cliente
            </p>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="secondary"
              onClick={() => {
                setModalOpen(false);
                setFechaInicio('');
                setFechaFin('');
                setMotivo('');
                setNotasInternas('');
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleFreeze}
              disabled={!fechaInicio || !fechaFin || calcularDias() <= 0}
            >
              <Pause className="w-4 h-4 mr-2" />
              Confirmar Congelación
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

