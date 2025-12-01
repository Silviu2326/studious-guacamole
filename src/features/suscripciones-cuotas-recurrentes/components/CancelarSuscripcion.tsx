import React, { useState, useMemo } from 'react';
import { Suscripcion, CancelarSuscripcionRequest } from '../types';
import { Modal, Button, Input } from '../../../components/componentsreutilizables';
import { XCircle, AlertTriangle, Calendar, TrendingDown, Users } from 'lucide-react';

interface CancelarSuscripcionProps {
  suscripcion: Suscripcion;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (request: CancelarSuscripcionRequest) => Promise<void>;
}

const motivosCancelacion = [
  { value: 'precio', label: 'Precio demasiado alto' },
  { value: 'no_uso', label: 'No estoy usando el servicio' },
  { value: 'insatisfecho', label: 'No estoy satisfecho con el servicio' },
  { value: 'cambio_entrenador', label: 'Cambio de entrenador' },
  { value: 'problemas_tecnicos', label: 'Problemas técnicos' },
  { value: 'falta_tiempo', label: 'Falta de tiempo' },
  { value: 'objetivos_cumplidos', label: 'Objetivos cumplidos' },
  { value: 'otro', label: 'Otro motivo' },
];

export const CancelarSuscripcion: React.FC<CancelarSuscripcionProps> = ({
  suscripcion,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [motivo, setMotivo] = useState<string>('');
  const [motivoOtro, setMotivoOtro] = useState<string>('');
  const [comentariosAdicionales, setComentariosAdicionales] = useState<string>('');
  const [cancelacionInmediata, setCancelacionInmediata] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Calcular impacto de la cancelación
  const impactoCancelacion = useMemo(() => {
    const fechaVencimiento = new Date(suscripcion.fechaVencimiento);
    const hoy = new Date();
    const diasRestantes = Math.ceil((fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calcular sesiones restantes (si aplica)
    const sesionesRestantes = suscripcion.sesionesDisponibles || 0;
    
    // Calcular cuotas futuras que se perderán
    const cuotasFuturas = cancelacionInmediata ? 0 : 1; // Si no es inmediata, se pierde la cuota actual
    
    return {
      diasRestantes: Math.max(0, diasRestantes),
      sesionesRestantes,
      cuotasFuturas,
      fechaVencimiento: fechaVencimiento.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
    };
  }, [suscripcion, cancelacionInmediata]);

  const handleSubmit = async () => {
    setError('');

    // Validar que se haya seleccionado un motivo
    if (!motivo) {
      setError('Por favor, selecciona un motivo de cancelación');
      return;
    }

    // Si es "otro", validar que se haya proporcionado el motivo
    if (motivo === 'otro' && !motivoOtro.trim()) {
      setError('Por favor, especifica el motivo de cancelación');
      return;
    }

    try {
      setLoading(true);
      
      const motivoFinal = motivo === 'otro' ? motivoOtro : motivosCancelacion.find(m => m.value === motivo)?.label || motivo;
      
      await onConfirm({
        suscripcionId: suscripcion.id,
        motivo: motivoFinal,
        comentariosAdicionales: comentariosAdicionales.trim() || undefined,
        cancelacionInmediata,
      });

      // Reset form
      setMotivo('');
      setMotivoOtro('');
      setComentariosAdicionales('');
      setCancelacionInmediata(false);
      setError('');
      onClose();
    } catch (err) {
      setError('Error al cancelar la suscripción. Por favor, intenta de nuevo.');
      console.error('Error cancelando suscripción:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setMotivo('');
      setMotivoOtro('');
      setComentariosAdicionales('');
      setCancelacionInmediata(false);
      setError('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Cancelar Suscripción"
      size="lg"
      showCloseButton={!loading}
      closeOnOverlayClick={!loading}
      closeOnEscape={!loading}
    >
      <div className="space-y-6">
        {/* Advertencia */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                ¿Estás seguro de que quieres cancelar esta suscripción?
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Esta acción cancelará la suscripción de <strong>{suscripcion.clienteNombre}</strong> 
                {' '}del plan <strong>{suscripcion.planNombre}</strong>. 
                La suscripción no se renovará automáticamente.
              </p>
            </div>
          </div>
        </div>

        {/* Información de la suscripción */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Detalles de la suscripción
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Cliente:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{suscripcion.clienteNombre}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Plan:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{suscripcion.planNombre}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Precio:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{suscripcion.precio} €</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Estado:</span>
              <span className="ml-2 text-gray-900 dark:text-white capitalize">{suscripcion.estado}</span>
            </div>
            {suscripcion.sesionesDisponibles !== undefined && (
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Sesiones disponibles:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{suscripcion.sesionesDisponibles}</span>
              </div>
            )}
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Vence el:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{impactoCancelacion.fechaVencimiento}</span>
            </div>
          </div>
        </div>

        {/* Tipo de cancelación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Tipo de cancelación <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            <label
              className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                !cancelacionInmediata
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <input
                type="radio"
                name="tipoCancelacion"
                checked={!cancelacionInmediata}
                onChange={() => setCancelacionInmediata(false)}
                disabled={loading}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-1"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  Al final del período actual
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  La suscripción permanecerá activa hasta {impactoCancelacion.fechaVencimiento}. 
                  El cliente podrá seguir usando el servicio hasta entonces.
                </div>
              </div>
            </label>
            <label
              className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                cancelacionInmediata
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <input
                type="radio"
                name="tipoCancelacion"
                checked={cancelacionInmediata}
                onChange={() => setCancelacionInmediata(true)}
                disabled={loading}
                className="w-4 h-4 text-red-600 focus:ring-red-500 mt-1"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  Cancelación inmediata
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  La suscripción se cancelará de inmediato. El acceso al servicio se desactivará ahora.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Resumen de impacto */}
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <TrendingDown className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">
                Resumen del Impacto
              </h4>
              <div className="space-y-2 text-sm">
                {suscripcion.sesionesDisponibles !== undefined && impactoCancelacion.sesionesRestantes > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-orange-700 dark:text-orange-400">
                      <strong>{impactoCancelacion.sesionesRestantes}</strong> sesión{impactoCancelacion.sesionesRestantes !== 1 ? 'es' : ''} restante{impactoCancelacion.sesionesRestantes !== 1 ? 's' : ''} que se perderán
                    </span>
                  </div>
                )}
                {!cancelacionInmediata && impactoCancelacion.diasRestantes > 0 && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-orange-700 dark:text-orange-400">
                      La suscripción permanecerá activa por <strong>{impactoCancelacion.diasRestantes}</strong> día{impactoCancelacion.diasRestantes !== 1 ? 's' : ''} más
                    </span>
                  </div>
                )}
                {cancelacionInmediata && (
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-orange-700 dark:text-orange-400">
                      El acceso se desactivará <strong>inmediatamente</strong>
                    </span>
                  </div>
                )}
                {impactoCancelacion.cuotasFuturas > 0 && (
                  <div className="pt-2 border-t border-orange-200 dark:border-orange-700">
                    <span className="text-orange-700 dark:text-orange-400">
                      Se perderán <strong>{impactoCancelacion.cuotasFuturas}</strong> cuota{impactoCancelacion.cuotasFuturas !== 1 ? 's' : ''} futura{impactoCancelacion.cuotasFuturas !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Motivo de cancelación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Motivo de cancelación <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {motivosCancelacion.map((opcion) => (
              <label
                key={opcion.value}
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <input
                  type="radio"
                  name="motivo"
                  value={opcion.value}
                  checked={motivo === opcion.value}
                  onChange={(e) => setMotivo(e.target.value)}
                  disabled={loading}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {opcion.label}
                </span>
              </label>
            ))}
          </div>

          {/* Campo para "otro motivo" */}
          {motivo === 'otro' && (
            <div className="mt-3">
              <Input
                label="Especifica el motivo"
                placeholder="Describe el motivo de cancelación..."
                value={motivoOtro}
                onChange={(e) => setMotivoOtro(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          )}
        </div>

        {/* Comentarios adicionales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Comentarios adicionales (opcional)
          </label>
          <textarea
            value={comentariosAdicionales}
            onChange={(e) => setComentariosAdicionales(e.target.value)}
            disabled={loading}
            placeholder="¿Hay algo más que nos gustaría saber? Tu feedback nos ayuda a mejorar..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Footer buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={loading || !motivo || (motivo === 'otro' && !motivoOtro.trim())}
            loading={loading}
          >
            <XCircle className="w-4 h-4 mr-2" />
            {cancelacionInmediata ? 'Cancelar Inmediatamente' : 'Confirmar Cancelación'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

