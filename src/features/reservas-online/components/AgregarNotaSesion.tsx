import React, { useState, useEffect } from 'react';
import { Modal, Button, Textarea } from '../../../components/componentsreutilizables';
import { Reserva, NotaDeSesion } from '../types';
import { crearNotaSesion, actualizarNotaSesion, getNotaPorReserva } from '../api/notasSesion';
import { useAuth } from '../../../context/AuthContext';
import { FileText, Save, X } from 'lucide-react';

interface AgregarNotaSesionProps {
  reserva: Reserva;
  isOpen: boolean;
  onClose: () => void;
  onNotaGuardada?: (nota: NotaDeSesion) => void;
}

export const AgregarNotaSesion: React.FC<AgregarNotaSesionProps> = ({
  reserva,
  isOpen,
  onClose,
  onNotaGuardada,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notaExistente, setNotaExistente] = useState<NotaDeSesion | null>(null);
  const [formData, setFormData] = useState({
    queTrabajamos: '',
    rendimiento: '',
    observaciones: '',
  });
  const [errors, setErrors] = useState<{
    queTrabajamos?: string;
    rendimiento?: string;
    observaciones?: string;
  }>({});

  // Cargar nota existente si existe
  useEffect(() => {
    if (isOpen && reserva.id) {
      const cargarNotaExistente = async () => {
        try {
          const nota = await getNotaPorReserva(reserva.id);
          if (nota) {
            setNotaExistente(nota);
            setFormData({
              queTrabajamos: nota.queTrabajamos,
              rendimiento: nota.rendimiento,
              observaciones: nota.observaciones,
            });
          } else {
            setNotaExistente(null);
            setFormData({
              queTrabajamos: '',
              rendimiento: '',
              observaciones: '',
            });
          }
        } catch (error) {
          console.error('Error cargando nota existente:', error);
        }
      };
      cargarNotaExistente();
    }
  }, [isOpen, reserva.id]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.queTrabajamos.trim()) {
      newErrors.queTrabajamos = 'Este campo es obligatorio';
    }

    if (!formData.rendimiento.trim()) {
      newErrors.rendimiento = 'Este campo es obligatorio';
    }

    if (!formData.observaciones.trim()) {
      newErrors.observaciones = 'Este campo es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (!user?.id) {
      console.error('Usuario no autenticado');
      return;
    }

    setLoading(true);

    try {
      if (notaExistente) {
        // Actualizar nota existente
        const notaActualizada = await actualizarNotaSesion(notaExistente.id, {
          queTrabajamos: formData.queTrabajamos.trim(),
          rendimiento: formData.rendimiento.trim(),
          observaciones: formData.observaciones.trim(),
        });
        onNotaGuardada?.(notaActualizada);
      } else {
        // Crear nueva nota
        const nuevaNota = await crearNotaSesion({
          reservaId: reserva.id,
          entrenadorId: user.id,
          clienteId: reserva.clienteId,
          clienteNombre: reserva.clienteNombre,
          fechaSesion: reserva.fecha,
          horaInicio: reserva.horaInicio,
          horaFin: reserva.horaFin,
          queTrabajamos: formData.queTrabajamos.trim(),
          rendimiento: formData.rendimiento.trim(),
          observaciones: formData.observaciones.trim(),
        });
        onNotaGuardada?.(nuevaNota);
      }

      onClose();
      // Resetear formulario
      setFormData({
        queTrabajamos: '',
        rendimiento: '',
        observaciones: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Error guardando nota:', error);
      alert('Error al guardar la nota. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      queTrabajamos: '',
      rendimiento: '',
      observaciones: '',
    });
    setErrors({});
    setNotaExistente(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={notaExistente ? 'Editar Nota de Sesión' : 'Añadir Nota de Sesión'}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
            leftIcon={<X className="w-4 h-4" />}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {loading ? 'Guardando...' : notaExistente ? 'Actualizar Nota' : 'Guardar Nota'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información de la sesión */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Información de la Sesión
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700 dark:text-blue-300 font-medium">Cliente:</span>
              <span className="ml-2 text-blue-900 dark:text-blue-100">{reserva.clienteNombre}</span>
            </div>
            <div>
              <span className="text-blue-700 dark:text-blue-300 font-medium">Fecha:</span>
              <span className="ml-2 text-blue-900 dark:text-blue-100">
                {reserva.fecha.toLocaleDateString('es-ES')}
              </span>
            </div>
            <div>
              <span className="text-blue-700 dark:text-blue-300 font-medium">Hora:</span>
              <span className="ml-2 text-blue-900 dark:text-blue-100">
                {reserva.horaInicio} - {reserva.horaFin}
              </span>
            </div>
            <div>
              <span className="text-blue-700 dark:text-blue-300 font-medium">Tipo:</span>
              <span className="ml-2 text-blue-900 dark:text-blue-100">
                {reserva.tipoSesion === 'videollamada' ? 'Videollamada' : 'Presencial'}
              </span>
            </div>
          </div>
        </div>

        {/* Qué trabajamos */}
        <Textarea
          label="¿Qué trabajamos en esta sesión? *"
          placeholder="Describe los ejercicios, rutinas o actividades que realizaron en la sesión..."
          value={formData.queTrabajamos}
          onChange={(e) => handleChange('queTrabajamos', e.target.value)}
          error={errors.queTrabajamos}
          helperText="Detalla qué se trabajó durante la sesión (ejercicios, músculos trabajados, rutina, etc.)"
          rows={4}
          maxLength={1000}
          showCount
        />

        {/* Rendimiento */}
        <Textarea
          label="Rendimiento del cliente *"
          placeholder="Describe cómo fue el rendimiento del cliente durante la sesión..."
          value={formData.rendimiento}
          onChange={(e) => handleChange('rendimiento', e.target.value)}
          error={errors.rendimiento}
          helperText="Evalúa el rendimiento, motivación, técnica y progreso del cliente"
          rows={4}
          maxLength={1000}
          showCount
        />

        {/* Observaciones */}
        <Textarea
          label="Observaciones *"
          placeholder="Añade observaciones adicionales, mejoras notadas, áreas a trabajar, etc..."
          value={formData.observaciones}
          onChange={(e) => handleChange('observaciones', e.target.value)}
          error={errors.observaciones}
          helperText="Notas adicionales sobre la sesión, progreso, mejoras, áreas de mejora, etc."
          rows={4}
          maxLength={1000}
          showCount
        />

        {notaExistente && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Última actualización: {notaExistente.updatedAt.toLocaleString('es-ES')}
          </div>
        )}
      </form>
    </Modal>
  );
};

