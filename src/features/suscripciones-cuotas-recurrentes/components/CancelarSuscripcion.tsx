import React, { useState } from 'react';
import { Suscripcion, CancelarSuscripcionRequest } from '../types';
import { Modal, Button, Input } from '../../../components/componentsreutilizables';
import { XCircle, AlertTriangle } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

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
      });

      // Reset form
      setMotivo('');
      setMotivoOtro('');
      setComentariosAdicionales('');
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
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Detalles de la suscripción
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <span className="font-medium">Cliente:</span> {suscripcion.clienteNombre}
            </div>
            <div>
              <span className="font-medium">Plan:</span> {suscripcion.planNombre}
            </div>
            <div>
              <span className="font-medium">Precio:</span> {suscripcion.precio} €
            </div>
            <div>
              <span className="font-medium">Estado:</span> {suscripcion.estado}
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
            Confirmar Cancelación
          </Button>
        </div>
      </div>
    </Modal>
  );
};

