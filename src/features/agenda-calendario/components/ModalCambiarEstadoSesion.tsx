import React, { useState } from 'react';
import { X, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { Modal, Button, Select, Textarea } from '../../../components/componentsreutilizables';
import { Cita, EstadoCita } from '../types';
import { actualizarCita } from '../api/calendario';
import { useAuth } from '../../../context/AuthContext';
import { ModalFacturacionAutomatica } from '../../facturacin-cobros/components/ModalFacturacionAutomatica';

interface ModalCambiarEstadoSesionProps {
  isOpen: boolean;
  onClose: () => void;
  cita: Cita | null;
  onEstadoCambiado?: (cita: Cita) => void;
}

export const ModalCambiarEstadoSesion: React.FC<ModalCambiarEstadoSesionProps> = ({
  isOpen,
  onClose,
  cita,
  onEstadoCambiado,
}) => {
  const { user } = useAuth();
  const [nuevoEstado, setNuevoEstado] = useState<EstadoCita>(cita?.estado || 'pendiente');
  const [notaEstado, setNotaEstado] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarModalFacturacion, setMostrarModalFacturacion] = useState(false);
  const [citaActualizada, setCitaActualizada] = useState<Cita | null>(null);

  React.useEffect(() => {
    if (cita) {
      setNuevoEstado(cita.estado);
      setNotaEstado('');
    }
  }, [cita]);

  const getEstadoLabel = (estado: EstadoCita): string => {
    const labels: Record<EstadoCita, string> = {
      'pendiente': 'Pendiente',
      'confirmada': 'Confirmada',
      'en-curso': 'En Curso',
      'completada': 'Completada',
      'cancelada': 'Cancelada',
      'no-show': 'No Show',
    };
    return labels[estado] || estado;
  };

  const getEstadoColor = (estado: EstadoCita): string => {
    const colores: Record<EstadoCita, string> = {
      'pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'confirmada': 'bg-blue-100 text-blue-800 border-blue-300',
      'en-curso': 'bg-purple-100 text-purple-800 border-purple-300',
      'completada': 'bg-green-100 text-green-800 border-green-300',
      'cancelada': 'bg-orange-100 text-orange-800 border-orange-300',
      'no-show': 'bg-red-100 text-red-800 border-red-300',
    };
    return colores[estado] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getEstadoIcon = (estado: EstadoCita) => {
    switch (estado) {
      case 'completada':
        return <CheckCircle className="w-5 h-5" />;
      case 'no-show':
        return <XCircle className="w-5 h-5" />;
      case 'cancelada':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const handleCambiarEstado = async () => {
    if (!cita) return;

    setLoading(true);
    try {
      const citaActualizada = await actualizarCita(
        cita.id,
        {
          estado: nuevoEstado,
          notas: notaEstado
            ? `${cita.notas || ''}\n\n[${new Date().toLocaleString('es-ES')}] Estado cambiado a ${getEstadoLabel(nuevoEstado)}: ${notaEstado}`.trim()
            : cita.notas,
          // Si se marca como no-show, actualizar asistencia
          asistencia: nuevoEstado === 'no-show' ? 'falto' : nuevoEstado === 'completada' ? 'asistio' : nuevoEstado === 'cancelada' ? 'cancelado' : cita.asistencia,
        },
        cita,
        user?.id
      );

      setCitaActualizada(citaActualizada);

      // Si se marca como completada, mostrar modal de facturación automática
      if (nuevoEstado === 'completada' && cita.estado !== 'completada') {
        setLoading(false);
        setMostrarModalFacturacion(true);
      } else {
        // Para otros estados, cerrar normalmente
        if (onEstadoCambiado) {
          onEstadoCambiado(citaActualizada);
        }
        onClose();
      }
    } catch (error) {
      console.error('Error cambiando estado:', error);
      alert('Error al cambiar el estado de la sesión. Por favor, intenta de nuevo.');
      setLoading(false);
    }
  };

  const handleFacturaGenerada = () => {
    // Cerrar modal de facturación y actualizar estado
    setMostrarModalFacturacion(false);
    if (citaActualizada && onEstadoCambiado) {
      onEstadoCambiado(citaActualizada);
    }
    onClose();
  };

  const handleCancelarFacturacion = () => {
    // Si cancela la facturación, cerrar el modal pero mantener el estado actualizado
    setMostrarModalFacturacion(false);
    if (citaActualizada && onEstadoCambiado) {
      onEstadoCambiado(citaActualizada);
    }
    onClose();
  };

  if (!cita) return null;

  const estadosDisponibles: { value: EstadoCita; label: string }[] = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'confirmada', label: 'Confirmada' },
    { value: 'en-curso', label: 'En Curso' },
    { value: 'completada', label: 'Completada' },
    { value: 'no-show', label: 'No Show' },
    { value: 'cancelada', label: 'Cancelada' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cambiar Estado de Sesión"
      size="md"
      footer={
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCambiarEstado} disabled={loading}>
            {loading ? 'Cambiando...' : 'Cambiar Estado'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Información de la sesión */}
        <div className="p-4 bg-slate-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">{cita.titulo}</h3>
          <p className="text-sm text-gray-600">
            {cita.clienteNombre && `Cliente: ${cita.clienteNombre}`}
          </p>
          <p className="text-sm text-gray-600">
            {new Date(cita.fechaInicio).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Estado actual */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Estado Actual</label>
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${getEstadoColor(cita.estado)}`}>
            {getEstadoIcon(cita.estado)}
            <span className="font-medium">{getEstadoLabel(cita.estado)}</span>
          </div>
        </div>

        {/* Nuevo estado */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Nuevo Estado</label>
          <Select
            value={nuevoEstado}
            onChange={(e) => setNuevoEstado(e.target.value as EstadoCita)}
            options={estadosDisponibles.map(e => ({
              value: e.value,
              label: e.label,
            }))}
          />
          {nuevoEstado !== cita.estado && (
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border mt-2 ${getEstadoColor(nuevoEstado)}`}>
              {getEstadoIcon(nuevoEstado)}
              <span className="font-medium">{getEstadoLabel(nuevoEstado)}</span>
            </div>
          )}
        </div>

        {/* Nota opcional */}
        <div className="space-y-2">
          <Textarea
            label="Nota (opcional)"
            value={notaEstado}
            onChange={(e) => setNotaEstado(e.target.value)}
            placeholder="Agrega una nota sobre el cambio de estado..."
            rows={3}
          />
        </div>

        {/* Advertencia para no-show */}
        {nuevoEstado === 'no-show' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Advertencia: No Show</p>
                <p className="text-sm text-red-700 mt-1">
                  Al marcar esta sesión como "No Show", se registrará que el cliente no asistió. 
                  Esto afectará las estadísticas de asistencia del cliente.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de facturación automática */}
      {mostrarModalFacturacion && citaActualizada && (
        <ModalFacturacionAutomatica
          isOpen={mostrarModalFacturacion}
          onClose={handleCancelarFacturacion}
          cita={citaActualizada}
          onFacturaGenerada={handleFacturaGenerada}
          onCancelar={handleCancelarFacturacion}
        />
      )}
    </Modal>
  );
};

