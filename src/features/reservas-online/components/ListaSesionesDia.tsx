import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Reserva } from '../types';
import { getReservas } from '../api';
import { useAuth } from '../../../context/AuthContext';
import { Calendar, Clock, User, Video, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

interface ListaSesionesDiaProps {
  entrenadorId?: string;
  fecha?: Date;
}

export const ListaSesionesDia: React.FC<ListaSesionesDiaProps> = ({
  entrenadorId,
  fecha,
}) => {
  const { user } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [fechaActual, setFechaActual] = useState<Date>(fecha || new Date());

  useEffect(() => {
    const cargarReservas = async () => {
      setLoading(true);
      try {
        // Obtener reservas del día seleccionado
        const fechaInicio = new Date(fechaActual);
        fechaInicio.setHours(0, 0, 0, 0);
        
        const fechaFin = new Date(fechaActual);
        fechaFin.setHours(23, 59, 59, 999);
        
        const todasReservas = await getReservas(fechaInicio, fechaFin, 'entrenador');
        
        // Filtrar reservas del día específico y que estén confirmadas o pendientes
        const reservasDelDia = todasReservas.filter(reserva => {
          const reservaFecha = new Date(reserva.fecha);
          reservaFecha.setHours(0, 0, 0, 0);
          const fechaComparar = new Date(fechaActual);
          fechaComparar.setHours(0, 0, 0, 0);
          
          return reservaFecha.getTime() === fechaComparar.getTime() && 
                 (reserva.estado === 'confirmada' || reserva.estado === 'pendiente');
        });
        
        // Ordenar por hora de inicio
        reservasDelDia.sort((a, b) => {
          const horaA = a.horaInicio.split(':').map(Number);
          const horaB = b.horaInicio.split(':').map(Number);
          const minutosA = horaA[0] * 60 + horaA[1];
          const minutosB = horaB[0] * 60 + horaB[1];
          return minutosA - minutosB;
        });
        
        setReservas(reservasDelDia);
      } catch (error) {
        console.error('Error cargando reservas del día:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarReservas();
  }, [fechaActual]);

  const cambiarFecha = (dias: number) => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    setFechaActual(nuevaFecha);
  };

  const esHoy = () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaComparar = new Date(fechaActual);
    fechaComparar.setHours(0, 0, 0, 0);
    return hoy.getTime() === fechaComparar.getTime();
  };

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

  const formatearFecha = (fecha: Date): string => {
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando sesiones...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6 space-y-4">
        {/* Header con navegación de fechas */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Sesiones del Día
              </h3>
              <p className="text-sm text-gray-600">
                {formatearFecha(fechaActual)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => cambiarFecha(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Día anterior"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setFechaActual(new Date())}
              className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              disabled={esHoy()}
            >
              Hoy
            </button>
            <button
              onClick={() => cambiarFecha(1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Día siguiente"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Lista de sesiones */}
        {reservas.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No hay sesiones programadas para este día</p>
            <p className="text-sm text-gray-500 mt-1">
              {esHoy() ? 'No tienes sesiones hoy' : 'No hay sesiones programadas para esta fecha'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reservas.map((reserva) => (
              <div
                key={reserva.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Hora y tipo */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1.5 text-lg font-semibold text-gray-900">
                        <Clock className="w-4 h-4 text-blue-600" />
                        {reserva.horaInicio} - {reserva.horaFin}
                      </div>
                      {getEstadoBadge(reserva.estado)}
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

                    {/* Observaciones si existen */}
                    {reserva.observaciones && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-600 italic">{reserva.observaciones}</p>
                      </div>
                    )}
                  </div>

                  {/* Precio */}
                  <div className="ml-4 text-right">
                    <div className="text-lg font-bold text-gray-900">
                      €{reserva.precio.toFixed(2)}
                    </div>
                    {reserva.pagado && (
                      <div className="text-xs text-green-600 mt-1">Pagado</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resumen del día */}
        {reservas.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total de sesiones:</span>
              <span className="font-semibold text-gray-900">{reservas.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Ingresos del día:</span>
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


