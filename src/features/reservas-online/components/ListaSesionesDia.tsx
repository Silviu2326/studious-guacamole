import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Reserva } from '../types';
import { getReservas, cancelarReserva } from '../api';
import { ReprogramarReserva } from './ReprogramarReserva';
import { AgregarNotaSesion } from './AgregarNotaSesion';
import { useAuth } from '../../../context/AuthContext';
import { Calendar, Clock, User, Video, MapPin, CheckCircle, AlertCircle, Eye, RefreshCw, X, Filter, FileText } from 'lucide-react';
import { getNotaPorReserva } from '../api/notasSesion';

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
  const [reservasFiltradas, setReservasFiltradas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [fechaActual, setFechaActual] = useState<Date>(fecha || new Date());
  const [filtroEstado, setFiltroEstado] = useState<Reserva['estado'] | 'todos'>('todos');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [mostrarReprogramar, setMostrarReprogramar] = useState(false);
  const [mostrarCancelar, setMostrarCancelar] = useState(false);
  const [mostrarNota, setMostrarNota] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [reservasConNota, setReservasConNota] = useState<Set<string>>(new Set());

  useEffect(() => {
    const cargarReservas = async () => {
      setLoading(true);
      try {
        // Obtener reservas del día seleccionado
        const fechaInicio = new Date(fechaActual);
        fechaInicio.setHours(0, 0, 0, 0);
        
        const fechaFin = new Date(fechaActual);
        fechaFin.setHours(23, 59, 59, 999);
        
        const todasReservas = await getReservas({ fechaInicio, fechaFin, entrenadorId }, 'entrenador');
        
        // Filtrar reservas del día específico y que estén confirmadas o pendientes
        const reservasDelDia = todasReservas.filter(reserva => {
          const reservaFecha = new Date(reserva.fecha);
          reservaFecha.setHours(0, 0, 0, 0);
          const fechaComparar = new Date(fechaActual);
          fechaComparar.setHours(0, 0, 0, 0);
          
          return reservaFecha.getTime() === fechaComparar.getTime();
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
        
        // Verificar qué reservas tienen notas
        const notasSet = new Set<string>();
        for (const reserva of reservasDelDia) {
          try {
            const nota = await getNotaPorReserva(reserva.id);
            if (nota) {
              notasSet.add(reserva.id);
            }
          } catch (error) {
            // Ignorar errores al verificar notas
          }
        }
        setReservasConNota(notasSet);
      } catch (error) {
        console.error('Error cargando reservas del día:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarReservas();
  }, [fechaActual, fecha, entrenadorId]);

  // Actualizar fecha cuando cambia la prop
  useEffect(() => {
    if (fecha) {
      setFechaActual(fecha);
    }
  }, [fecha]);

  // Aplicar filtros
  useEffect(() => {
    let filtradas = [...reservas];

    // Filtrar por estado
    if (filtroEstado !== 'todos') {
      filtradas = filtradas.filter(r => r.estado === filtroEstado);
    }

    // Filtrar por tipo
    if (filtroTipo !== 'todos') {
      filtradas = filtradas.filter(r => r.tipo === filtroTipo);
    }

    setReservasFiltradas(filtradas);
  }, [reservas, filtroEstado, filtroTipo]);

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

  const handleVerDetalle = (reserva: Reserva) => {
    setReservaSeleccionada(reserva);
    setMostrarDetalle(true);
  };

  const handleReprogramar = (reserva: Reserva) => {
    setReservaSeleccionada(reserva);
    setMostrarReprogramar(true);
  };

  const handleCancelar = (reserva: Reserva) => {
    setReservaSeleccionada(reserva);
    setMostrarCancelar(true);
  };

  const handleAgregarNota = (reserva: Reserva) => {
    setReservaSeleccionada(reserva);
    setMostrarNota(true);
  };

  const handleNotaGuardada = () => {
    if (reservaSeleccionada) {
      setReservasConNota(new Set([...reservasConNota, reservaSeleccionada.id]));
    }
    setMostrarNota(false);
    setReservaSeleccionada(null);
  };

  const ejecutarCancelacion = async () => {
    if (!reservaSeleccionada) return;

    setProcesando(true);
    try {
      await cancelarReserva(reservaSeleccionada.id, 'Cancelada desde lista del día', entrenadorId);
      // Recargar reservas
      const fechaInicio = new Date(fechaActual);
      fechaInicio.setHours(0, 0, 0, 0);
      const fechaFin = new Date(fechaActual);
      fechaFin.setHours(23, 59, 59, 999);
      const todasReservas = await getReservas({ fechaInicio, fechaFin, entrenadorId }, 'entrenador');
      const reservasDelDia = todasReservas.filter(reserva => {
        const reservaFecha = new Date(reserva.fecha);
        reservaFecha.setHours(0, 0, 0, 0);
        const fechaComparar = new Date(fechaActual);
        fechaComparar.setHours(0, 0, 0, 0);
        return reservaFecha.getTime() === fechaComparar.getTime();
      });
      reservasDelDia.sort((a, b) => {
        const horaA = a.horaInicio?.split(':').map(Number) || [0, 0];
        const horaB = b.horaInicio?.split(':').map(Number) || [0, 0];
        const minutosA = horaA[0] * 60 + horaA[1];
        const minutosB = horaB[0] * 60 + horaB[1];
        return minutosA - minutosB;
      });
      setReservas(reservasDelDia);
      setMostrarCancelar(false);
      setReservaSeleccionada(null);
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      alert('Error al cancelar la reserva. Por favor, inténtalo de nuevo.');
    } finally {
      setProcesando(false);
    }
  };

  const handleReprogramarCompletado = async (reservaActualizada: Reserva) => {
    // Recargar reservas después de reprogramar
    const fechaInicio = new Date(fechaActual);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date(fechaActual);
    fechaFin.setHours(23, 59, 59, 999);
    const todasReservas = await getReservas({ fechaInicio, fechaFin, entrenadorId }, 'entrenador');
    const reservasDelDia = todasReservas.filter(reserva => {
      const reservaFecha = new Date(reserva.fecha);
      reservaFecha.setHours(0, 0, 0, 0);
      const fechaComparar = new Date(fechaActual);
      fechaComparar.setHours(0, 0, 0, 0);
      return reservaFecha.getTime() === fechaComparar.getTime();
    });
    reservasDelDia.sort((a, b) => {
      const horaA = a.horaInicio?.split(':').map(Number) || [0, 0];
      const horaB = b.horaInicio?.split(':').map(Number) || [0, 0];
      const minutosA = horaA[0] * 60 + horaA[1];
      const minutosB = horaB[0] * 60 + horaB[1];
      return minutosA - minutosB;
    });
    setReservas(reservasDelDia);
    setMostrarReprogramar(false);
    setReservaSeleccionada(null);
  };

  const tiposDisponibles = Array.from(new Set(reservas.map(r => r.tipo).filter(Boolean)));
  const estadosDisponibles: Reserva['estado'][] = ['confirmada', 'pendiente', 'completada', 'canceladaCliente', 'canceladaCentro', 'noShow'];

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
      <div className="p-4 sm:p-6 space-y-4">
        {/* Header con navegación de fechas */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                Sesiones del Día
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                {formatearFecha(fechaActual)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => cambiarFecha(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label="Día anterior"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setFechaActual(new Date())}
              className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={esHoy()}
            >
              Hoy
            </button>
            <button
              onClick={() => cambiarFecha(1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label="Día siguiente"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filtros */}
        {reservas.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>
            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              <label className="text-sm text-gray-600 whitespace-nowrap">Estado:</label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value as Reserva['estado'] | 'todos')}
                className="flex-1 sm:flex-initial px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos</option>
                {estadosDisponibles.map(estado => (
                  <option key={estado} value={estado}>
                    {estado === 'confirmada' ? 'Confirmada' :
                     estado === 'pendiente' ? 'Pendiente' :
                     estado === 'completada' ? 'Completada' :
                     estado === 'canceladaCliente' ? 'Cancelada (Cliente)' :
                     estado === 'canceladaCentro' ? 'Cancelada (Centro)' :
                     estado === 'noShow' ? 'No Show' : estado}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              <label className="text-sm text-gray-600 whitespace-nowrap">Tipo:</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="flex-1 sm:flex-initial px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos</option>
                {tiposDisponibles.map(tipo => (
                  <option key={tipo} value={tipo}>{getTipoTexto(tipo)}</option>
                ))}
              </select>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left sm:ml-auto">
              Mostrando {reservasFiltradas.length} de {reservas.length} sesiones
            </div>
          </div>
        )}

        {/* Lista de sesiones */}
        {reservasFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">
              {reservas.length === 0 
                ? 'No hay sesiones programadas para este día'
                : 'No hay sesiones que coincidan con los filtros seleccionados'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {reservas.length === 0 
                ? (esHoy() ? 'No tienes sesiones hoy' : 'No hay sesiones programadas para esta fecha')
                : 'Intenta cambiar los filtros para ver más resultados'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reservasFiltradas.map((reserva) => (
              <div
                key={reserva.id}
                className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Hora y tipo */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                      <div className="flex items-center gap-1.5 text-base sm:text-lg font-semibold text-gray-900">
                        <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        {reserva.horaInicio} - {reserva.horaFin}
                      </div>
                      {getEstadoBadge(reserva.estado)}
                    </div>

                    {/* Cliente */}
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="font-medium text-gray-900 truncate">{reserva.clienteNombre}</span>
                    </div>

                    {/* Tipo de sesión */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
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
                        <p className="text-xs sm:text-sm text-gray-600 italic break-words">{reserva.observaciones}</p>
                      </div>
                    )}
                  </div>

                  {/* Precio y acciones */}
                  <div className="flex sm:flex-col sm:items-end gap-3 sm:gap-2">
                    <div className="flex flex-col items-end">
                      <div className="text-base sm:text-lg font-bold text-gray-900">
                        €{reserva.precio?.toFixed(2) || '0.00'}
                      </div>
                      {reserva.pagado && (
                        <div className="text-xs text-green-600">Pagado</div>
                      )}
                    </div>
                    
                    {/* Acciones rápidas */}
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVerDetalle(reserva)}
                        className="text-xs px-2"
                      >
                        <Eye className="w-3 h-3 sm:mr-1" />
                        <span className="hidden sm:inline">Ver</span>
                      </Button>
                      {/* Botón rápido de nota - visible para sesiones completadas o del día */}
                      {(reserva.estado === 'completada' || 
                        (reserva.estado === 'confirmada' && new Date(reserva.fecha) <= new Date())) && (
                        <Button
                          variant={reservasConNota.has(reserva.id) ? "primary" : "ghost"}
                          size="sm"
                          onClick={() => handleAgregarNota(reserva)}
                          className="text-xs px-2"
                          title={reservasConNota.has(reserva.id) ? "Ver/Editar nota" : "Agregar nota"}
                        >
                          <FileText className="w-3 h-3 sm:mr-1" />
                          <span className="hidden sm:inline">Nota</span>
                        </Button>
                      )}
                      {reserva.estado !== 'canceladaCliente' && reserva.estado !== 'canceladaCentro' && reserva.estado !== 'completada' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReprogramar(reserva)}
                            className="text-xs px-2"
                          >
                            <RefreshCw className="w-3 h-3 sm:mr-1" />
                            <span className="hidden sm:inline">Reprogramar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelar(reserva)}
                            className="text-xs text-red-600 hover:text-red-700 px-2"
                          >
                            <X className="w-3 h-3 sm:mr-1" />
                            <span className="hidden sm:inline">Cancelar</span>
                          </Button>
                        </>
                      )}
                    </div>
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
                €{reservas.reduce((sum, r) => sum + (r.precio || 0), 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Modal de detalle */}
        {mostrarDetalle && reservaSeleccionada && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Detalle de Reserva</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Cliente:</strong> {reservaSeleccionada.clienteNombre}</div>
                <div><strong>Fecha:</strong> {formatearFecha(reservaSeleccionada.fecha)}</div>
                <div><strong>Hora:</strong> {reservaSeleccionada.horaInicio} - {reservaSeleccionada.horaFin}</div>
                <div><strong>Tipo:</strong> {getTipoTexto(reservaSeleccionada.tipo || '')}</div>
                <div><strong>Modalidad:</strong> {reservaSeleccionada.tipoSesion === 'videollamada' ? 'Videollamada' : 'Presencial'}</div>
                <div><strong>Estado:</strong> {getEstadoBadge(reservaSeleccionada.estado)}</div>
                <div><strong>Precio:</strong> €{reservaSeleccionada.precio?.toFixed(2) || '0.00'}</div>
                {reservaSeleccionada.observaciones && (
                  <div><strong>Observaciones:</strong> {reservaSeleccionada.observaciones}</div>
                )}
                {reservaSeleccionada.enlaceVideollamada && (
                  <div>
                    <strong>Enlace:</strong>{' '}
                    <a href={reservaSeleccionada.enlaceVideollamada} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                      {reservaSeleccionada.enlaceVideollamada}
                    </a>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => { setMostrarDetalle(false); setReservaSeleccionada(null); }}>
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de reprogramar usando componente ReprogramarReserva */}
        {mostrarReprogramar && reservaSeleccionada && (
          <ReprogramarReserva
            reserva={reservaSeleccionada}
            isOpen={mostrarReprogramar}
            onClose={() => {
              setMostrarReprogramar(false);
              setReservaSeleccionada(null);
            }}
            onReprogramar={handleReprogramarCompletado}
            entrenadorId={entrenadorId}
            role="entrenador"
          />
        )}

        {/* Modal de cancelar */}
        {mostrarCancelar && reservaSeleccionada && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Cancelar Reserva</h3>
              <p className="text-sm text-gray-600 mb-4">
                ¿Estás seguro de que deseas cancelar la reserva de <strong>{reservaSeleccionada.clienteNombre}</strong> el {formatearFecha(reservaSeleccionada.fecha)} a las {reservaSeleccionada.horaInicio}?
              </p>
              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => { setMostrarCancelar(false); setReservaSeleccionada(null); }}
                  className="w-full sm:w-auto"
                >
                  No, mantener
                </Button>
                <Button
                  variant="ghost"
                  onClick={ejecutarCancelacion}
                  disabled={procesando}
                  className="text-red-600 hover:text-red-700 w-full sm:w-auto"
                >
                  {procesando ? 'Cancelando...' : 'Sí, cancelar'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de agregar nota */}
        {mostrarNota && reservaSeleccionada && (
          <AgregarNotaSesion
            reserva={reservaSeleccionada}
            isOpen={mostrarNota}
            onClose={() => {
              setMostrarNota(false);
              setReservaSeleccionada(null);
            }}
            onNotaGuardada={handleNotaGuardada}
          />
        )}
      </div>
    </Card>
  );
};


