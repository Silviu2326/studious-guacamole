import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Edit2 } from 'lucide-react';
import { Modal, Button, Input, Select, Textarea, Switch } from '../../../components/componentsreutilizables';
import { ClienteAutocomplete } from './ClienteAutocomplete';
import { Cita, TipoCita } from '../types';
import { actualizarCita } from '../api/calendario';
import { useAuth } from '../../../context/AuthContext';
import { getPrimeraConexionActiva } from '../api/sincronizacionCalendario';

interface ModalEditarSesionProps {
  isOpen: boolean;
  onClose: () => void;
  cita: Cita | null;
  onSesionActualizada: (cita: Cita) => void;
  role?: 'entrenador' | 'gimnasio';
  userId?: string;
  editarSerie?: boolean; // Si es true, edita toda la serie de sesiones recurrentes
}

const TIPOS_SESION: Array<{ value: TipoCita; label: string }> = [
  { value: 'sesion-1-1', label: 'Sesión 1:1' },
  { value: 'videollamada', label: 'Videollamada' },
  { value: 'evaluacion', label: 'Evaluación' },
  { value: 'fisioterapia', label: 'Fisioterapia' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'otro', label: 'Otro' },
];

const DURACIONES = [
  { value: '30', label: '30 min' },
  { value: '45', label: '45 min' },
  { value: '60', label: '60 min' },
  { value: '90', label: '90 min' },
  { value: '120', label: '120 min' },
];

export const ModalEditarSesion: React.FC<ModalEditarSesionProps> = ({
  isOpen,
  onClose,
  cita,
  onSesionActualizada,
  role = 'entrenador',
  userId: propUserId,
  editarSerie = false,
}) => {
  const { user } = useAuth();
  const userId = propUserId || user?.id;
  const [clienteId, setClienteId] = useState('');
  const [clienteNombre, setClienteNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [tipo, setTipo] = useState<TipoCita>('sesion-1-1');
  const [duracion, setDuracion] = useState('60');
  const [notas, setNotas] = useState('');
  const [sincronizarCalendario, setSincronizarCalendario] = useState(true);
  const [tieneConexionActiva, setTieneConexionActiva] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && cita) {
      setClienteId(cita.clienteId || '');
      setClienteNombre(cita.clienteNombre || '');
      setTipo(cita.tipo);
      setNotas(cita.notas || '');
      setSincronizarCalendario(cita.sincronizarCalendario !== false);

      // Formatear fecha y hora
      const fechaInicio = new Date(cita.fechaInicio);
      const fechaStr = fechaInicio.toISOString().split('T')[0];
      const horaStr = `${fechaInicio.getHours().toString().padStart(2, '0')}:${fechaInicio.getMinutes().toString().padStart(2, '0')}`;
      setFecha(fechaStr);
      setHora(horaStr);

      // Calcular duración
      const duracionMs = new Date(cita.fechaFin).getTime() - new Date(cita.fechaInicio).getTime();
      const duracionMinutos = Math.round(duracionMs / (1000 * 60));
      setDuracion(duracionMinutos.toString());
      
      // Verificar conexión de calendario
      verificarConexionCalendario();
    }
  }, [isOpen, cita, userId]);

  const verificarConexionCalendario = async () => {
    try {
      const conexion = await getPrimeraConexionActiva(userId);
      setTieneConexionActiva(!!conexion);
    } catch (error) {
      console.error('Error verificando conexión de calendario:', error);
      setTieneConexionActiva(false);
    }
  };

  const validarFormulario = (): boolean => {
    if (!clienteId) {
      setError('Selecciona un cliente');
      return false;
    }
    if (!fecha) {
      setError('Selecciona una fecha');
      return false;
    }
    if (!hora) {
      setError('Selecciona una hora');
      return false;
    }
    if (!tipo) {
      setError('Selecciona un tipo de sesión');
      return false;
    }
    if (!duracion) {
      setError('Selecciona una duración');
      return false;
    }
    setError(null);
    return true;
  };

  const handleGuardar = async () => {
    if (!validarFormulario() || !cita) return;

    setLoading(true);
    setError(null);

    try {
      const [ano, mes, dia] = fecha.split('-').map(Number);
      const [horaNum, minutoNum] = hora.split(':').map(Number);

      const nuevaFechaInicio = new Date(ano, mes - 1, dia, horaNum, minutoNum);
      const nuevaFechaFin = new Date(nuevaFechaInicio);
      nuevaFechaFin.setMinutes(nuevaFechaFin.getMinutes() + parseInt(duracion));

      // Preparar cambios para el historial
      const cambios = [];
      if (new Date(cita.fechaInicio).getTime() !== nuevaFechaInicio.getTime()) {
        cambios.push({
          campo: 'fechaInicio',
          valorAnterior: cita.fechaInicio,
          valorNuevo: nuevaFechaInicio,
        });
      }
      if (cita.clienteId !== clienteId) {
        cambios.push({
          campo: 'clienteId',
          valorAnterior: cita.clienteId,
          valorNuevo: clienteId,
        });
        cambios.push({
          campo: 'clienteNombre',
          valorAnterior: cita.clienteNombre,
          valorNuevo: clienteNombre,
        });
      }

      // Actualizar cita
      const citaActualizada = await actualizarCita(
        cita.id,
        {
          fechaInicio: nuevaFechaInicio,
          fechaFin: nuevaFechaFin,
          clienteId,
          clienteNombre,
          tipo,
          notas: notas || undefined,
          sincronizarCalendario,
          historial: [
            ...(cita.historial || []),
            {
              id: `hist-${Date.now()}`,
              fecha: new Date(),
              tipo: 'editada' as const,
              cambios,
              usuarioId: userId,
            },
          ],
        },
        cita,
        userId
      );

      onSesionActualizada(citaActualizada);

      // Notificar al cliente (mock)
      await enviarNotificacionCliente(cita, nuevaFechaInicio);

      onClose();
    } catch (err) {
      console.error('Error actualizando sesión:', err);
      setError('Error al actualizar la sesión. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const enviarNotificacionCliente = async (cita: Cita, nuevaFecha: Date): Promise<void> => {
    // Mock de notificación
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Notificación enviada a ${cita.clienteNombre || 'cliente'}:`);
        console.log(`Tu sesión "${cita.titulo}" ha sido actualizada. Nueva fecha: ${nuevaFecha.toLocaleString('es-ES')}`);
        resolve();
      }, 300);
    });
  };

  if (!cita) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editarSerie ? 'Editar Serie de Sesiones' : 'Editar Sesión'}
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleGuardar}
            loading={loading}
          >
            Guardar cambios
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {editarSerie && cita.recurrencia && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
            <strong>Editando serie completa:</strong> Los cambios se aplicarán a todas las sesiones de esta serie recurrente.
          </div>
        )}

        {/* Cliente */}
        <ClienteAutocomplete
          value={clienteId}
          onChange={(id, nombre) => {
            setClienteId(id);
            setClienteNombre(nombre);
          }}
          label="Cliente *"
          placeholder="Buscar cliente..."
          role={role}
          userId={userId}
          error={error && !clienteId ? error : undefined}
        />

        {/* Fecha y Hora */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              type="date"
              label="Fecha *"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              leftIcon={<Calendar className="w-4 h-4" />}
              error={error && !fecha ? error : undefined}
            />
          </div>
          <div>
            <Input
              type="time"
              label="Hora *"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              leftIcon={<Clock className="w-4 h-4" />}
              error={error && !hora ? error : undefined}
            />
          </div>
        </div>

        {/* Tipo y Duración */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Tipo de sesión *"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoCita)}
            options={TIPOS_SESION}
            error={error && !tipo ? error : undefined}
          />
          <Select
            label="Duración *"
            value={duracion}
            onChange={(e) => setDuracion(e.target.value)}
            options={DURACIONES}
            error={error && !duracion ? error : undefined}
          />
        </div>

        {/* Notas */}
        <Textarea
          label="Notas"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Notas adicionales..."
          rows={3}
        />

        {/* Sincronización con calendario externo */}
        {tieneConexionActiva && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sincronizar con calendario externo
                </label>
                <p className="text-xs text-gray-500">
                  Actualizar automáticamente el evento en tu calendario personal
                </p>
              </div>
              <Switch
                checked={sincronizarCalendario}
                onChange={setSincronizarCalendario}
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

