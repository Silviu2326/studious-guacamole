import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Users, Bell, Clock, CheckCircle, UserPlus } from 'lucide-react';
import { Modal, Button, Select, Textarea, Badge } from '../../../components/componentsreutilizables';
import { Cita, MotivoCancelacion, EntradaListaEspera, NotificacionSlotLiberado } from '../types';
import { actualizarCita } from '../api/calendario';
import { 
  notificarSlotLiberado, 
  getListaEspera, 
  asignarSlotListaEspera,
  getConfiguracionListaEspera,
  getNotificacionesSlotsLiberados,
} from '../api/listaEspera';
import { useAuth } from '../../../context/AuthContext';

interface ModalCancelarSesionProps {
  isOpen: boolean;
  onClose: () => void;
  cita: Cita | null;
  onSesionCancelada: (cita: Cita) => void;
  userId?: string;
  cancelarSerie?: boolean; // Si es true, cancela toda la serie de sesiones recurrentes
}

const MOTIVOS_CANCELACION: Array<{ value: MotivoCancelacion; label: string }> = [
  { value: 'cliente', label: 'Cliente' },
  { value: 'entrenador', label: 'Entrenador' },
  { value: 'otro', label: 'Otro' },
];

export const ModalCancelarSesion: React.FC<ModalCancelarSesionProps> = ({
  isOpen,
  onClose,
  cita,
  onSesionCancelada,
  userId: propUserId,
  cancelarSerie = false,
}) => {
  const { user } = useAuth();
  const userId = propUserId || user?.id;
  const [motivo, setMotivo] = useState<MotivoCancelacion>('cliente');
  const [motivoDetalle, setMotivoDetalle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listaEspera, setListaEspera] = useState<EntradaListaEspera[]>([]);
  const [cargandoListaEspera, setCargandoListaEspera] = useState(false);
  const [notificacionesEnviadas, setNotificacionesEnviadas] = useState<NotificacionSlotLiberado[]>([]);
  const [configuracionListaEspera, setConfiguracionListaEspera] = useState<any>(null);
  const [asignando, setAsignando] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && cita) {
      // Resetear formulario
      setMotivo('cliente');
      setMotivoDetalle('');
      setError(null);
      cargarListaEspera();
    }
  }, [isOpen, cita]);

  const cargarListaEspera = async () => {
    if (!cita || !userId) return;
    
    setCargandoListaEspera(true);
    try {
      // Obtener configuración de lista de espera
      const config = await getConfiguracionListaEspera(userId);
      setConfiguracionListaEspera(config);

      if (!config.activo) {
        setCargandoListaEspera(false);
        return;
      }

      // Obtener fecha y hora de la cita
      const fechaSlot = new Date(cita.fechaInicio);
      const diaSemana = fechaSlot.getDay();
      const horaInicio = fechaSlot.getHours().toString().padStart(2, '0') + ':' + 
                        fechaSlot.getMinutes().toString().padStart(2, '0');
      const fechaFin = new Date(cita.fechaFin);
      const horaFin = fechaFin.getHours().toString().padStart(2, '0') + ':' + 
                     fechaFin.getMinutes().toString().padStart(2, '0');

      // Obtener lista de espera activa
      const lista = await getListaEspera(userId, 'activa');
      
      // Filtrar por horario similar (mismo día de semana y rango de horas similar)
      const listaRelevante = lista.filter(entrada =>
        entrada.diaSemana === diaSemana &&
        entrada.horaInicio === horaInicio &&
        entrada.horaFin === horaFin
      );

      setListaEspera(listaRelevante);
    } catch (error) {
      console.error('Error cargando lista de espera:', error);
    } finally {
      setCargandoListaEspera(false);
    }
  };

  const handleNotificarListaEspera = async () => {
    if (!cita || !userId) return;

    setLoading(true);
    try {
      const notificaciones = await notificarSlotLiberado(cita, userId);
      setNotificacionesEnviadas(notificaciones);
      
      // Recargar lista de espera para actualizar estados
      await cargarListaEspera();
      
      alert(`Notificaciones enviadas a ${notificaciones.length} cliente(s) en lista de espera`);
    } catch (error) {
      console.error('Error notificando lista de espera:', error);
      alert('Error al notificar clientes en lista de espera');
    } finally {
      setLoading(false);
    }
  };

  const handleAsignarCliente = async (entradaId: string) => {
    if (!cita || !userId) return;

    setAsignando(entradaId);
    try {
      const fechaSlot = new Date(cita.fechaInicio);
      await asignarSlotListaEspera(entradaId, fechaSlot, userId);
      
      // Recargar lista de espera
      await cargarListaEspera();
      
      alert('Cliente asignado exitosamente');
      
      // Cerrar modal después de asignar
      onClose();
      
      // Recargar citas en el componente padre
      onSesionCancelada(cita);
    } catch (error) {
      console.error('Error asignando cliente:', error);
      alert('Error al asignar cliente. Por favor, intenta de nuevo.');
    } finally {
      setAsignando(null);
    }
  };

  const validarFormulario = (): boolean => {
    if (!motivo) {
      setError('Selecciona un motivo de cancelación');
      return false;
    }
    if (motivo === 'otro' && !motivoDetalle.trim()) {
      setError('Por favor, proporciona más detalles sobre el motivo');
      return false;
    }
    setError(null);
    return true;
  };

  const handleCancelar = async () => {
    if (!validarFormulario() || !cita) return;

    setLoading(true);
    setError(null);

    try {
      // Actualizar cita con estado cancelado
      const citaCancelada = await actualizarCita(
        cita.id,
        {
          estado: 'cancelada' as const,
          motivoCancelacion: motivo,
          motivoCancelacionDetalle: motivoDetalle || undefined,
          historial: [
            ...(cita.historial || []),
            {
              id: `hist-${Date.now()}`,
              fecha: new Date(),
              tipo: 'cancelada' as const,
              motivo,
              motivoDetalle: motivoDetalle || undefined,
              usuarioId: userId,
            },
          ],
        },
        cita,
        userId
      );

      onSesionCancelada(citaCancelada);

      // Notificar al cliente (mock)
      await enviarNotificacionCancelacion(cita, motivo);

      // Registrar cancelación tardía si aplica (User Story 1)
      try {
        const { registrarCancelacionTardia } = await import('../api/metricasNoShows');
        await registrarCancelacionTardia(citaCancelada, motivo, motivoDetalle, userId);
      } catch (error) {
        // No fallar la cancelación si hay error registrando
        console.error('Error registrando cancelación tardía:', error);
      }

      onClose();
    } catch (err) {
      console.error('Error cancelando sesión:', err);
      setError('Error al cancelar la sesión. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const enviarNotificacionCancelacion = async (cita: Cita, motivo: MotivoCancelacion): Promise<void> => {
    // Mock de notificación
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Notificación enviada a ${cita.clienteNombre || 'cliente'}:`);
        console.log(`Tu sesión "${cita.titulo}" ha sido cancelada. Motivo: ${motivo}`);
        resolve();
      }, 300);
    });
  };

  if (!cita) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={cancelarSerie ? 'Cancelar Serie de Sesiones' : 'Cancelar Sesión'}
      size="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            No cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancelar}
            loading={loading}
          >
            Confirmar cancelación
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {cancelarSerie && cita.recurrencia && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
            <strong>Cancelando serie completa:</strong> Se cancelarán todas las sesiones futuras de esta serie recurrente.
          </div>
        )}

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-1">Sesión a cancelar:</p>
          <p className="text-lg font-semibold text-gray-900">{cita.titulo}</p>
          <p className="text-sm text-gray-600 mt-1">
            {new Date(cita.fechaInicio).toLocaleString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          {cita.clienteNombre && (
            <p className="text-sm text-gray-600">Cliente: {cita.clienteNombre}</p>
          )}
        </div>

        <Select
          label="Motivo de cancelación *"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value as MotivoCancelacion)}
          options={MOTIVOS_CANCELACION}
          error={error && !motivo ? error : undefined}
        />

        {(motivo === 'otro' || motivo === 'cliente' || motivo === 'entrenador') && (
          <Textarea
            label={motivo === 'otro' ? 'Detalles adicionales *' : 'Detalles (opcional)'}
            value={motivoDetalle}
            onChange={(e) => setMotivoDetalle(e.target.value)}
            placeholder={
              motivo === 'cliente'
                ? 'Ej: El cliente solicitó cancelar por problemas personales...'
                : motivo === 'entrenador'
                ? 'Ej: No disponible por emergencia médica...'
                : 'Describe el motivo de la cancelación...'
            }
            rows={4}
            error={motivo === 'otro' && !motivoDetalle.trim() && error ? error : undefined}
          />
        )}

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
          <strong>Nota:</strong> Se enviará una notificación automática al cliente sobre la cancelación.
        </div>

        {/* Lista de Espera para este horario (User Story 2) */}
        {configuracionListaEspera?.activo && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-green-600" />
              <h3 className="text-sm font-semibold text-gray-900">Lista de Espera para este Horario</h3>
            </div>
            
            {cargandoListaEspera ? (
              <p className="text-sm text-gray-600">Cargando lista de espera...</p>
            ) : listaEspera.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-600">
                    {listaEspera.length} cliente(s) en lista de espera para este horario
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleNotificarListaEspera}
                    disabled={loading || notificacionesEnviadas.length > 0}
                  >
                    <Bell className="w-4 h-4 mr-1" />
                    Notificar Automáticamente
                  </Button>
                </div>

                {configuracionListaEspera?.tiempoRespuestaHoras && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                    <Clock className="w-3 h-3" />
                    <span>Tiempo límite de respuesta: {configuracionListaEspera.tiempoRespuestaHoras} horas</span>
                  </div>
                )}

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {listaEspera.map((entrada) => {
                    const notificacion = notificacionesEnviadas.find(n => n.entradaListaEsperaId === entrada.id);
                    const tiempoRestante = notificacion 
                      ? Math.max(0, (new Date(notificacion.fechaExpiracion).getTime() - Date.now()) / (1000 * 60 * 60))
                      : null;

                    return (
                      <div
                        key={entrada.id}
                        className="p-3 bg-white rounded-lg border border-gray-200 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              {entrada.clienteNombre}
                            </span>
                            <Badge variant="secondary">#{entrada.prioridad}</Badge>
                            {notificacion && (
                              <Badge variant={notificacion.confirmada ? 'success' : 'warning'}>
                                {notificacion.confirmada ? 'Confirmada' : 'Pendiente'}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Solicitado: {new Date(entrada.fechaSolicitud).toLocaleDateString('es-ES')}
                          </p>
                          {notificacion && tiempoRestante !== null && (
                            <p className="text-xs text-gray-500 mt-1">
                              Tiempo restante: {Math.round(tiempoRestante)} horas
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {!notificacion && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleAsignarCliente(entrada.id)}
                              disabled={asignando === entrada.id || loading}
                              loading={asignando === entrada.id}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Asignar
                            </Button>
                          )}
                          {notificacion && !notificacion.confirmada && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleAsignarCliente(entrada.id)}
                              disabled={asignando === entrada.id || loading}
                              loading={asignando === entrada.id}
                            >
                              <UserPlus className="w-4 h-4 mr-1" />
                              Asignar Ahora
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {notificacionesEnviadas.length > 0 && (
                  <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                    <p className="text-xs text-blue-800">
                      ✓ Notificaciones enviadas a {notificacionesEnviadas.length} cliente(s). 
                      Si nadie acepta en {configuracionListaEspera?.tiempoRespuestaHoras || 24} horas, 
                      se pasará al siguiente cliente automáticamente.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                No hay clientes en lista de espera para este horario.
              </p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

