import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Reserva } from '../types';
import { getReservasProximas24Horas } from '../api';
import { Clock, User, Video, MapPin, CheckCircle, AlertCircle, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ResumenSesiones24HorasProps {
  entrenadorId?: string;
}

export const ResumenSesiones24Horas: React.FC<ResumenSesiones24HorasProps> = ({
  entrenadorId,
}) => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarReservas = async () => {
      setLoading(true);
      try {
        const reservas24h = await getReservasProximas24Horas(entrenadorId);
        setReservas(reservas24h);
      } catch (error) {
        console.error('Error cargando reservas de 24 horas:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarReservas();

    // Actualizar cada minuto para mantener los datos actualizados
    const interval = setInterval(cargarReservas, 60000);

    return () => clearInterval(interval);
  }, [entrenadorId]);

  const getTipoTexto = (tipo: string): string => {
    const tipos: Record<string, string> = {
      'sesion-1-1': 'Sesión 1 a 1',
      'fisio': 'Fisioterapia',
      'nutricion': 'Nutrición',
      'masaje': 'Masaje',
      'clase-grupal': 'Clase Grupal',
    };
    return tipos[tipo] || tipo;
  };

  const getEstadoBadge = (estado: Reserva['estado']) => {
    switch (estado) {
      case 'confirmada':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" />
            Confirmada
          </span>
        );
      case 'pendiente':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3" />
            Pendiente
          </span>
        );
      default:
        return null;
    }
  };

  const formatearTiempoRestante = (fecha: Date, horaInicio: string): string => {
    const ahora = new Date();
    const fechaHoraInicio = new Date(fecha);
    const [hora, minuto] = horaInicio.split(':').map(Number);
    fechaHoraInicio.setHours(hora, minuto, 0, 0);

    const diffMs = fechaHoraInicio.getTime() - ahora.getTime();
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHoras < 0) {
      return 'En curso';
    } else if (diffHoras === 0) {
      return `En ${diffMinutos} min`;
    } else if (diffHoras < 24) {
      return `En ${diffHoras}h ${diffMinutos > 0 ? `${diffMinutos}m` : ''}`;
    } else {
      return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    }
  };

  const formatearFechaHora = (fecha: Date, horaInicio: string): string => {
    const ahora = new Date();
    const fechaHoraInicio = new Date(fecha);
    const [hora, minuto] = horaInicio.split(':').map(Number);
    fechaHoraInicio.setHours(hora, minuto, 0, 0);

    const esHoy = fechaHoraInicio.toDateString() === ahora.toDateString();
    
    if (esHoy) {
      return `Hoy a las ${horaInicio}`;
    } else {
      const esManana = new Date(ahora);
      esManana.setDate(esManana.getDate() + 1);
      const esMananaDate = esManana.toDateString() === fechaHoraInicio.toDateString();
      
      if (esMananaDate) {
        return `Mañana a las ${horaInicio}`;
      } else {
        return fecha.toLocaleDateString('es-ES', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }) + ` a las ${horaInicio}`;
      }
    }
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Próximas 24 horas</h3>
              <p className="text-sm text-gray-600">Cargando sesiones...</p>
            </div>
          </div>
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Próximas 24 horas</h3>
              <p className="text-sm text-gray-600">
                {reservas.length === 0 
                  ? 'No hay sesiones programadas'
                  : `${reservas.length} sesión${reservas.length !== 1 ? 'es' : ''} programada${reservas.length !== 1 ? 's' : ''}`
                }
              </p>
            </div>
          </div>
          {reservas.length > 0 && (
            <button
              onClick={() => navigate('/reservas-online')}
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Ver todas
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Lista de sesiones */}
        {reservas.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No tienes sesiones en las próximas 24 horas</p>
            <p className="text-sm text-gray-500 mt-1">Tu día está libre</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reservas.slice(0, 5).map((reserva) => (
              <div
                key={reserva.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all bg-gradient-to-r from-white to-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Hora y tiempo restante */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-gray-900">
                          {formatearFechaHora(reserva.fecha, reserva.horaInicio)}
                        </span>
                      </div>
                      {getEstadoBadge(reserva.estado)}
                    </div>

                    {/* Tiempo restante destacado */}
                    <div className="mb-2">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700">
                        {formatearTiempoRestante(reserva.fecha, reserva.horaInicio)}
                      </span>
                    </div>

                    {/* Cliente */}
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{reserva.clienteNombre}</span>
                    </div>

                    {/* Tipo de sesión */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">{getTipoTexto(reserva.tipo)}</span>
                      </div>
                      {reserva.tipoSesion && (
                        <div className="flex items-center gap-1.5">
                          {reserva.tipoSesion === 'videollamada' ? (
                            <>
                              <Video className="w-4 h-4" />
                              <span>Videollamada</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="w-4 h-4" />
                              <span>Presencial</span>
                            </>
                          )}
                        </div>
                      )}
                      {reserva.duracionMinutos && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>{reserva.duracionMinutos} min</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Precio */}
                  <div className="ml-4 text-right">
                    <div className="text-lg font-bold text-gray-900">
                      €{reserva.precio.toFixed(2)}
                    </div>
                    {reserva.pagado ? (
                      <div className="text-xs text-green-600 mt-1">Pagado</div>
                    ) : (
                      <div className="text-xs text-yellow-600 mt-1">Pendiente</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {reservas.length > 5 && (
              <div className="text-center pt-2">
                <button
                  onClick={() => navigate('/reservas-online')}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Ver {reservas.length - 5} sesión{reservas.length - 5 !== 1 ? 'es' : ''} más
                </button>
              </div>
            )}
          </div>
        )}

        {/* Resumen rápido */}
        {reservas.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total sesiones:</span>
              <span className="font-semibold text-gray-900">{reservas.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Ingresos estimados:</span>
              <span className="font-semibold text-gray-900">
                €{reservas.reduce((sum, r) => sum + r.precio, 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};


