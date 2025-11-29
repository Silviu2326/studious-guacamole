import React, { useState, useEffect } from 'react';
import { Card, Button, Select } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { Reserva } from '../types';
import { Bell, Mail, Phone, Smartphone, MessageCircle, Send, Clock, Calendar, User, Video, Link2, ExternalLink, CheckCircle, AlertCircle, PhoneCall, MessageSquare, TrendingUp, Target } from 'lucide-react';
import { enviarRecordatorioEntrenador, getReservasDelDiaEntrenador } from '../api/notificacionesReserva';
import { useAuth } from '../../../context/AuthContext';
import { getNotasPorCliente } from '../api/notasSesion';

interface RecordatoriosEntrenadorProps {
  entrenadorId: string;
}

interface RecordatorioEnviado {
  id: string;
  fecha: Date;
  totalSesiones: number;
  enviado: boolean;
  fechaEnvio: Date;
  canal: 'email' | 'sms' | 'push' | 'whatsapp' | 'todos';
}

interface TareaSeguimiento {
  id: string;
  tipo: 'llamada' | 'seguimiento' | 'nota-pendiente';
  clienteId: string;
  clienteNombre: string;
  reservaId?: string;
  prioridad: 'alta' | 'media' | 'baja';
  descripcion: string;
  fechaLimite?: Date;
}

export const RecordatoriosEntrenador: React.FC<RecordatoriosEntrenadorProps> = ({
  entrenadorId,
}) => {
  const { user } = useAuth();
  const [reservasHoy, setReservasHoy] = useState<Reserva[]>([]);
  const [reservasManana, setReservasManana] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [enviandoRecordatorio, setEnviandoRecordatorio] = useState<string | null>(null);
  const [canalSeleccionado, setCanalSeleccionado] = useState<'email' | 'sms' | 'push' | 'whatsapp' | 'todos'>('email');
  const [recordatoriosEnviados, setRecordatoriosEnviados] = useState<RecordatorioEnviado[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [tareasSeguimiento, setTareasSeguimiento] = useState<TareaSeguimiento[]>([]);
  const [cargandoTareas, setCargandoTareas] = useState(true);

  useEffect(() => {
    const cargarReservas = async () => {
      setLoading(true);
      try {
        const hoy = new Date();
        const manana = new Date(hoy);
        manana.setDate(manana.getDate() + 1);

        const [reservasHoyData, reservasMananaData] = await Promise.all([
          getReservasDelDiaEntrenador(hoy, entrenadorId),
          getReservasDelDiaEntrenador(manana, entrenadorId),
        ]);

        setReservasHoy(reservasHoyData);
        setReservasManana(reservasMananaData);
      } catch (error) {
        console.error('Error cargando reservas:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarReservas();
    
    // Recargar cada hora para mantener actualizado
    const interval = setInterval(cargarReservas, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [entrenadorId]);

  // Cargar tareas de seguimiento basadas en reservas
  useEffect(() => {
    const cargarTareasSeguimiento = async () => {
      if (reservasHoy.length === 0) {
        setTareasSeguimiento([]);
        setCargandoTareas(false);
        return;
      }

      setCargandoTareas(true);
      try {
        const tareas: TareaSeguimiento[] = [];
        
        // Analizar reservas de hoy para generar tareas
        const reservasCompletadasHoy = reservasHoy.filter(r => r.estado === 'completada');
        const reservasPendientesHoy = reservasHoy.filter(r => r.estado === 'pendiente');
        
        // Tareas: Notas pendientes para sesiones completadas
        for (const reserva of reservasCompletadasHoy) {
          try {
            const notas = await getNotasPorCliente(reserva.clienteId, entrenadorId);
            const tieneNota = notas.some(n => n.reservaId === reserva.id);
            
            if (!tieneNota) {
              tareas.push({
                id: `nota-${reserva.id}`,
                tipo: 'nota-pendiente',
                clienteId: reserva.clienteId,
                clienteNombre: reserva.clienteNombre || 'Cliente',
                reservaId: reserva.id,
                prioridad: 'alta',
                descripcion: `Agregar nota de sesión completada`,
                fechaLimite: new Date(),
              });
            }
          } catch (error) {
            console.error('Error verificando notas:', error);
          }
        }
        
        // Tareas: Seguimiento para clientes con reservas pendientes
        for (const reserva of reservasPendientesHoy) {
          tareas.push({
            id: `seguimiento-${reserva.id}`,
            tipo: 'seguimiento',
            clienteId: reserva.clienteId,
            clienteNombre: reserva.clienteNombre || 'Cliente',
            reservaId: reserva.id,
            prioridad: 'media',
            descripcion: `Seguimiento post-sesión`,
            fechaLimite: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas después
          });
        }
        
        // Tareas: Llamadas para clientes que no han confirmado
        const ahora = new Date();
        const reservasSinConfirmar = reservasHoy.filter(r => {
          if (r.estado !== 'pendiente') return false;
          const fechaReserva = new Date(r.fecha);
          const fechaHoraReserva = new Date(fechaReserva);
          const [hora, minuto] = (r.horaInicio || '00:00').split(':').map(Number);
          fechaHoraReserva.setHours(hora, minuto, 0, 0);
          const diffHoras = (fechaHoraReserva.getTime() - ahora.getTime()) / (1000 * 60 * 60);
          return diffHoras > 0 && diffHoras <= 2; // Próximas 2 horas
        });
        
        for (const reserva of reservasSinConfirmar) {
          tareas.push({
            id: `llamada-${reserva.id}`,
            tipo: 'llamada',
            clienteId: reserva.clienteId,
            clienteNombre: reserva.clienteNombre || 'Cliente',
            reservaId: reserva.id,
            prioridad: 'alta',
            descripcion: `Llamar para confirmar asistencia`,
            fechaLimite: new Date(reserva.fecha),
          });
        }
        
        setTareasSeguimiento(tareas);
      } catch (error) {
        console.error('Error cargando tareas de seguimiento:', error);
        setTareasSeguimiento([]);
      } finally {
        setCargandoTareas(false);
      }
    };
    
    cargarTareasSeguimiento();
  }, [reservasHoy, entrenadorId]);

  const handleEnviarRecordatorio = async (fecha: Date, tipo: 'hoy' | 'manana') => {
    const reservas = tipo === 'hoy' ? reservasHoy : reservasManana;
    if (reservas.length === 0) {
      alert('No hay sesiones programadas para esta fecha.');
      return;
    }

    const fechaKey = `${fecha.toDateString()}-${tipo}`;
    setEnviandoRecordatorio(fechaKey);
    try {
      const resultado = await enviarRecordatorioEntrenador(
        reservas,
        fecha,
        entrenadorId,
        user?.email,
        undefined, // En producción, obtener teléfono del usuario
        canalSeleccionado
      );

      // Agregar a la lista de recordatorios enviados
      const recordatorio: RecordatorioEnviado = {
        id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        fecha,
        totalSesiones: resultado.totalSesiones,
        enviado: true,
        fechaEnvio: resultado.fechaEnvio,
        canal: resultado.canal,
      };

      setRecordatoriosEnviados(prev => [recordatorio, ...prev]);
      alert(`Recordatorio enviado correctamente por ${canalSeleccionado}.`);
    } catch (error) {
      console.error('Error enviando recordatorio:', error);
      alert('Error al enviar el recordatorio. Por favor, inténtalo de nuevo.');
    } finally {
      setEnviandoRecordatorio(null);
    }
  };

  const getTipoIcon = (tipo: 'email' | 'sms' | 'push' | 'whatsapp' | 'todos') => {
    switch (tipo) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <Phone className="w-4 h-4" />;
      case 'push':
        return <Smartphone className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4" />;
      case 'todos':
        return <Bell className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const renderReservasDelDia = (reservas: Reserva[], fecha: Date, tipo: 'hoy' | 'manana') => {
    const fechaKey = `${fecha.toDateString()}-${tipo}`;
    const estaEnviando = enviandoRecordatorio === fechaKey;
    const fechaStr = fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h4 className="text-lg font-semibold text-gray-900">
              {tipo === 'hoy' ? 'Hoy' : 'Mañana'} - {fechaStr}
            </h4>
            <Badge variant={reservas.length > 0 ? 'blue' : 'gray'}>
              {reservas.length} sesión{reservas.length !== 1 ? 'es' : ''}
            </Badge>
          </div>
          {reservas.length > 0 && (
            <div className="flex items-center gap-2">
              <Select
                value={canalSeleccionado}
                onChange={(e) => setCanalSeleccionado(e.target.value as 'email' | 'sms' | 'push' | 'whatsapp' | 'todos')}
                options={[
                  { value: 'email', label: 'Email' },
                  { value: 'whatsapp', label: 'WhatsApp' },
                  { value: 'sms', label: 'SMS' },
                  { value: 'push', label: 'Push' },
                  { value: 'todos', label: 'Todos' },
                ]}
                className="w-40"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleEnviarRecordatorio(fecha, tipo)}
                disabled={estaEnviando}
                loading={estaEnviando}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Enviar Recordatorio
              </Button>
            </div>
          )}
        </div>

        {reservas.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">No hay sesiones programadas para {tipo === 'hoy' ? 'hoy' : 'mañana'}.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reservas.map((reserva) => (
              <div
                key={reserva.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold text-gray-900">{reserva.clienteNombre}</span>
                      <Badge
                        variant={reserva.estado === 'confirmada' ? 'green' : 'yellow'}
                        leftIcon={reserva.estado === 'confirmada' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      >
                        {reserva.estado === 'confirmada' ? 'Confirmada' : 'Pendiente'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{reserva.horaInicio} - {reserva.horaFin}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {reserva.tipoSesion === 'videollamada' ? (
                          <>
                            <Video className="w-4 h-4 text-blue-600" />
                            <span>Videollamada</span>
                            {reserva.enlaceVideollamada && (
                              <a
                                href={reserva.enlaceVideollamada}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Link2 className="w-3 h-3" />
                                Enlace
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </>
                        ) : (
                          <>
                            <Calendar className="w-4 h-4" />
                            <span>Presencial</span>
                          </>
                        )}
                      </div>
                    </div>
                    {reserva.observaciones && (
                      <div className="mt-2 text-sm text-gray-500">
                        <span className="font-medium">Notas: </span>
                        {reserva.observaciones}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">
            Mis Recordatorios de Sesiones
          </h3>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg ring-1 ring-blue-200">
          <p className="text-sm text-gray-600 mb-2">
            Recibe recordatorios de tus sesiones programadas para el día. Los recordatorios te ayudan a estar preparado y no olvidar ninguna cita.
          </p>
          <p className="text-sm text-blue-800 font-medium">
            💡 Puedes enviar recordatorios manualmente en cualquier momento o configurar recordatorios automáticos.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando sesiones...</p>
          </div>
        ) : (
          <>
            {/* Sección: Qué hacer hoy */}
            {tareasSeguimiento.length > 0 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-900">Qué hacer hoy</h4>
                  <Badge variant="blue">{tareasSeguimiento.length} tarea{tareasSeguimiento.length !== 1 ? 's' : ''}</Badge>
                </div>
                <div className="space-y-2">
                  {tareasSeguimiento
                    .sort((a, b) => {
                      const prioridadOrder = { alta: 0, media: 1, baja: 2 };
                      return prioridadOrder[a.prioridad] - prioridadOrder[b.prioridad];
                    })
                    .map(tarea => (
                      <div
                        key={tarea.id}
                        className={`flex items-center justify-between p-3 bg-white rounded-lg border ${
                          tarea.prioridad === 'alta' ? 'border-red-200 bg-red-50' :
                          tarea.prioridad === 'media' ? 'border-yellow-200 bg-yellow-50' :
                          'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {tarea.tipo === 'llamada' && <PhoneCall className="w-4 h-4 text-blue-600" />}
                          {tarea.tipo === 'seguimiento' && <MessageSquare className="w-4 h-4 text-green-600" />}
                          {tarea.tipo === 'nota-pendiente' && <TrendingUp className="w-4 h-4 text-orange-600" />}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{tarea.clienteNombre}</p>
                            <p className="text-sm text-gray-600">{tarea.descripcion}</p>
                            {tarea.fechaLimite && (
                              <p className="text-xs text-gray-500 mt-1">
                                {tarea.fechaLimite.toLocaleDateString('es-ES')} {tarea.fechaLimite.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            )}
                          </div>
                          <Badge
                            variant={
                              tarea.prioridad === 'alta' ? 'red' :
                              tarea.prioridad === 'media' ? 'yellow' :
                              'gray'
                            }
                          >
                            {tarea.prioridad}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {renderReservasDelDia(reservasHoy, new Date(), 'hoy')}
            {renderReservasDelDia(reservasManana, (() => {
              const manana = new Date();
              manana.setDate(manana.getDate() + 1);
              return manana;
            })(), 'manana')}
          </>
        )}

        {recordatoriosEnviados.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Recordatorios Enviados Recientemente
            </h4>
            <div className="space-y-2">
              {recordatoriosEnviados.slice(0, 5).map((recordatorio) => (
                <div
                  key={recordatorio.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    {getTipoIcon(recordatorio.canal)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {recordatorio.fecha.toLocaleDateString('es-ES')} - {recordatorio.totalSesiones} sesión{recordatorio.totalSesiones !== 1 ? 'es' : ''}
                      </p>
                      <p className="text-xs text-gray-500">
                        Enviado: {recordatorio.fechaEnvio.toLocaleString('es-ES')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="green" leftIcon={<CheckCircle className="w-3 h-3" />}>
                    Enviado
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};


