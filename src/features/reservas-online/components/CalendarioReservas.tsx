import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Video, MapPin, Link2, AlertCircle, CheckCircle } from 'lucide-react';
import { Reserva } from '../types';
import { getReservas, reprogramarReserva, ReprogramacionReserva } from '../api';

interface CalendarioReservasProps {
  role: 'entrenador' | 'gimnasio';
  entrenadorId?: string;
}

type VistaCalendario = 'semana' | 'mes';

interface DropTarget {
  fecha: Date;
  hora: number;
  minuto: number;
}

export const CalendarioReservas: React.FC<CalendarioReservasProps> = ({ role, entrenadorId }) => {
  const [fechaActual, setFechaActual] = useState(new Date());
  const [vista, setVista] = useState<VistaCalendario>('semana');
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);
  const [errorReprogramacion, setErrorReprogramacion] = useState<string | null>(null);
  const [exitoReprogramacion, setExitoReprogramacion] = useState(false);
  const [procesandoReprogramacion, setProcesandoReprogramacion] = useState(false);

  // Cargar reservas cuando cambia la vista o la fecha
  useEffect(() => {
    const cargarReservas = async () => {
      setLoading(true);
      let fechaInicio: Date;
      let fechaFin: Date;

      if (vista === 'semana') {
        const diasSemana = getDiasSemana();
        fechaInicio = new Date(diasSemana[0]);
        fechaInicio.setHours(0, 0, 0, 0);
        fechaFin = new Date(diasSemana[6]);
        fechaFin.setHours(23, 59, 59, 999);
      } else {
        // Vista mes
        fechaInicio = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
        fechaInicio.setHours(0, 0, 0, 0);
        fechaFin = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
        fechaFin.setHours(23, 59, 59, 999);
      }

      try {
        const datos = await getReservas(fechaInicio, fechaFin, role);
        setReservas(datos);
      } catch (error) {
        console.error('Error cargando reservas:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarReservas();
  }, [fechaActual, vista, role]);

  // Obtener días de la semana (lunes a domingo)
  const getDiasSemana = (): Date[] => {
    const fecha = new Date(fechaActual);
    const dia = fecha.getDay(); // 0 = domingo, 1 = lunes, etc.
    // Calcular el lunes de esta semana
    const diff = dia === 0 ? -6 : 1 - dia; // Si es domingo, retroceder 6 días; si no, calcular diferencia hasta lunes
    const lunes = new Date(fecha);
    lunes.setDate(fecha.getDate() + diff);
    lunes.setHours(0, 0, 0, 0);
    
    const dias: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(lunes);
      dia.setDate(lunes.getDate() + i);
      dias.push(dia);
    }
    return dias;
  };

  // Obtener días del mes
  const getDiasMes = (): (Date | null)[] => {
    const primerDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    const ultimoDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaInicioSemana = primerDia.getDay();

    const dias: (Date | null)[] = [];
    // Días vacíos al inicio
    for (let i = 0; i < diaInicioSemana; i++) {
      dias.push(null);
    }
    // Días del mes
    for (let dia = 1; dia <= diasEnMes; dia++) {
      dias.push(new Date(fechaActual.getFullYear(), fechaActual.getMonth(), dia));
    }
    return dias;
  };

  // Obtener reservas de un día específico
  const getReservasDelDia = (fecha: Date | null): Reserva[] => {
    if (!fecha) return [];
    return reservas.filter(reserva => {
      const fechaReserva = new Date(reserva.fecha);
      return fechaReserva.getDate() === fecha.getDate() &&
        fechaReserva.getMonth() === fecha.getMonth() &&
        fechaReserva.getFullYear() === fecha.getFullYear();
    }).sort((a, b) => {
      const horaA = a.horaInicio.split(':').map(Number);
      const horaB = b.horaInicio.split(':').map(Number);
      const tiempoA = horaA[0] * 60 + horaA[1];
      const tiempoB = horaB[0] * 60 + horaB[1];
      return tiempoA - tiempoB;
    });
  };

  // Navegación
  const cambiarSemana = useCallback((direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setDate(fechaActual.getDate() + (direccion === 'siguiente' ? 7 : -7));
    setFechaActual(nuevaFecha);
  }, [fechaActual]);

  const cambiarMes = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setMonth(fechaActual.getMonth() + (direccion === 'siguiente' ? 1 : -1));
    setFechaActual(nuevaFecha);
  };

  const irAHoy = () => {
    setFechaActual(new Date());
  };

  // Obtener color por estado (mantenido para referencia, pero ya no se usa como color principal)
  const getColorPorEstado = (estado: Reserva['estado']): string => {
    const colores: Record<string, string> = {
      'confirmada': 'bg-blue-500 border-blue-600',
      'pendiente': 'bg-yellow-500 border-yellow-600',
      'cancelada': 'bg-red-500 border-red-600',
      'completada': 'bg-green-500 border-green-600',
      'no-show': 'bg-gray-500 border-gray-600',
    };
    return colores[estado] || 'bg-gray-500 border-gray-600';
  };

  // Obtener color por tipo de sesión (color principal para identificar visualmente el tipo de entrenamiento)
  const getColorPorTipo = (tipo: Reserva['tipo']): { bg: string; border: string; nombre: string } => {
    const colores: Record<string, { bg: string; border: string; nombre: string }> = {
      'sesion-1-1': { bg: 'bg-blue-500', border: 'border-blue-600', nombre: 'Sesión 1-1' },
      'clase-grupal': { bg: 'bg-purple-500', border: 'border-purple-600', nombre: 'Clase Grupal' },
      'fisio': { bg: 'bg-pink-500', border: 'border-pink-600', nombre: 'Fisioterapia' },
      'nutricion': { bg: 'bg-green-500', border: 'border-green-600', nombre: 'Nutrición' },
      'masaje': { bg: 'bg-orange-500', border: 'border-orange-600', nombre: 'Masaje' },
    };
    return colores[tipo] || { bg: 'bg-gray-500', border: 'border-gray-600', nombre: 'Otro' };
  };

  // Obtener estilo adicional basado en el estado (opacidad, borde, etc.)
  const getEstiloPorEstado = (estado: Reserva['estado']): string => {
    const estilos: Record<string, string> = {
      'confirmada': 'opacity-100',
      'pendiente': 'opacity-90 border-dashed',
      'cancelada': 'opacity-50 line-through',
      'completada': 'opacity-100',
      'no-show': 'opacity-60',
    };
    return estilos[estado] || 'opacity-100';
  };

  // Formato de fecha
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const diasSemanaNombres = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const diasSemanaCompletos = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const getFormatoSemana = () => {
    const dias = getDiasSemana();
    const inicio = dias[0];
    const fin = dias[6];
    if (inicio.getMonth() === fin.getMonth()) {
      return `${inicio.getDate()} - ${fin.getDate()} de ${meses[inicio.getMonth()]} ${inicio.getFullYear()}`;
    } else {
      return `${inicio.getDate()} ${meses[inicio.getMonth()]} - ${fin.getDate()} ${meses[fin.getMonth()]} ${inicio.getFullYear()}`;
    }
  };

  // Calcular estadísticas de la semana
  const calcularEstadisticasSemana = () => {
    const diasSemana = getDiasSemana();
    let totalReservas = 0;
    let reservasConfirmadas = 0;
    let ingresosEstimados = 0;

    diasSemana.forEach(dia => {
      const reservasDia = getReservasDelDia(dia);
      totalReservas += reservasDia.length;
      reservasConfirmadas += reservasDia.filter(r => r.estado === 'confirmada' || r.estado === 'completada').length;
      ingresosEstimados += reservasDia.filter(r => r.pagado).reduce((sum, r) => sum + r.precio, 0);
    });

    return { totalReservas, reservasConfirmadas, ingresosEstimados };
  };

  // Calcular estadísticas del mes
  const calcularEstadisticasMes = () => {
    const diasMes = getDiasMes().filter(d => d !== null) as Date[];
    let totalReservas = 0;
    let reservasConfirmadas = 0;
    let ingresosEstimados = 0;

    diasMes.forEach(dia => {
      const reservasDia = getReservasDelDia(dia);
      totalReservas += reservasDia.length;
      reservasConfirmadas += reservasDia.filter(r => r.estado === 'confirmada' || r.estado === 'completada').length;
      ingresosEstimados += reservasDia.filter(r => r.pagado).reduce((sum, r) => sum + r.precio, 0);
    });

    return { totalReservas, reservasConfirmadas, ingresosEstimados };
  };

  const estadisticas = vista === 'semana' ? calcularEstadisticasSemana() : calcularEstadisticasMes();

  // Funciones de drag & drop (solo para entrenadores y vista semana)
  const handleDragStart = (e: React.DragEvent, reserva: Reserva) => {
    if (role !== 'entrenador' || vista !== 'semana' || reserva.estado === 'cancelada' || reserva.estado === 'completada') {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', reserva.id);
    setErrorReprogramacion(null);
    setExitoReprogramacion(false);
  };

  const handleDragEnd = () => {
    setDropTarget(null);
  };

  const handleDragOver = (e: React.DragEvent, fecha: Date, hora: number, minuto: number) => {
    if (role !== 'entrenador' || vista !== 'semana') return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget({ fecha, hora, minuto });
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = async (e: React.DragEvent, fecha: Date, hora: number, minuto: number) => {
    if (role !== 'entrenador' || vista !== 'semana') return;
    
    e.preventDefault();
    const reservaId = e.dataTransfer.getData('text/plain');
    const reserva = reservas.find(r => r.id === reservaId);

    if (!reserva) {
      setDropTarget(null);
      return;
    }

    // Calcular nueva hora de inicio y fin
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setHours(hora, minuto, 0, 0);

    // Calcular duración de la reserva original
    const [horaInicioOriginal, minutoInicioOriginal] = reserva.horaInicio.split(':').map(Number);
    const [horaFinOriginal, minutoFinOriginal] = reserva.horaFin.split(':').map(Number);
    const inicioOriginalMinutos = horaInicioOriginal * 60 + minutoInicioOriginal;
    const finOriginalMinutos = horaFinOriginal * 60 + minutoFinOriginal;
    const duracionMinutos = finOriginalMinutos - inicioOriginalMinutos;

    // Calcular nueva hora de fin
    const nuevaFechaFin = new Date(nuevaFecha);
    nuevaFechaFin.setMinutes(nuevaFechaFin.getMinutes() + duracionMinutos);

    const nuevaHoraInicio = `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
    const nuevaHoraFin = `${String(nuevaFechaFin.getHours()).padStart(2, '0')}:${String(nuevaFechaFin.getMinutes()).padStart(2, '0')}`;

    setDropTarget(null);
    setProcesandoReprogramacion(true);
    setErrorReprogramacion(null);
    setExitoReprogramacion(false);

    try {
      const reprogramacion: ReprogramacionReserva = {
        fecha: nuevaFecha,
        horaInicio: nuevaHoraInicio,
        horaFin: nuevaHoraFin,
        motivo: 'Reprogramada por drag and drop',
      };

      const reservaActualizada = await reprogramarReserva(
        reserva.id,
        reprogramacion,
        entrenadorId,
        reserva
      );

      // Actualizar la reserva en el estado local
      setReservas(prevReservas =>
        prevReservas.map(r => (r.id === reserva.id ? reservaActualizada : r))
      );

      setExitoReprogramacion(true);
      setTimeout(() => {
        setExitoReprogramacion(false);
      }, 3000);
    } catch (error) {
      console.error('Error al reprogramar reserva:', error);
      setErrorReprogramacion(error instanceof Error ? error.message : 'Error al reprogramar la reserva');
      setTimeout(() => {
        setErrorReprogramacion(null);
      }, 5000);
    } finally {
      setProcesandoReprogramacion(false);
    }
  };

  // Calcular minutos desde las 6:00 para un slot de hora/minuto
  const calcularPosicionSlot = (hora: number, minuto: number): number => {
    const minutosDesdeInicio = (hora - 6) * 60 + minuto;
    return (minutosDesdeInicio / 60) * 64; // 64px por hora
  };

  // Obtener hora y minuto desde posición en píxeles
  const obtenerHoraDesdePosicion = (y: number): { hora: number; minuto: number } => {
    const horasDesdeInicio = y / 64;
    const minutosDesdeInicio = horasDesdeInicio * 60;
    const hora = Math.floor(minutosDesdeInicio / 60) + 6;
    const minuto = Math.floor(minutosDesdeInicio % 60);
    return { hora: Math.max(6, Math.min(22, hora)), minuto: Math.floor(minuto / 15) * 15 }; // Redondear a intervalos de 15 minutos
  };

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <CalendarIcon className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {vista === 'semana' ? getFormatoSemana() : `${meses[fechaActual.getMonth()]} ${fechaActual.getFullYear()}`}
              </h2>
              <p className="text-sm text-gray-600">
                {vista === 'semana' 
                  ? 'Vista semanal de reservas' 
                  : 'Vista mensual de reservas'}
              </p>
            </div>
          </div>

          {/* Controles de vista */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVista('semana')}
              className={vista === 'semana' ? 'bg-slate-100 text-slate-900' : ''}
            >
              Semana
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVista('mes')}
              className={vista === 'mes' ? 'bg-slate-100 text-slate-900' : ''}
            >
              Mes
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-blue-600 font-medium">Total Reservas</div>
            <div className="text-2xl font-bold text-blue-900">{estadisticas.totalReservas}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-sm text-green-600 font-medium">Confirmadas</div>
            <div className="text-2xl font-bold text-green-900">{estadisticas.reservasConfirmadas}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-sm text-purple-600 font-medium">Ingresos</div>
            <div className="text-2xl font-bold text-purple-900">€{estadisticas.ingresosEstimados}</div>
          </div>
        </div>

        {/* Controles de navegación */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => vista === 'semana' ? cambiarSemana('anterior') : cambiarMes('anterior')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={irAHoy}
            >
              Hoy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => vista === 'semana' ? cambiarSemana('siguiente') : cambiarMes('siguiente')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Vista Semana */}
        {vista === 'semana' && (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-8 border border-slate-200 rounded-lg overflow-hidden min-w-[800px]">
              {/* Columna de horas */}
              <div className="border-r border-slate-200 bg-slate-50 sticky left-0 z-10">
                <div className="h-16 border-b border-slate-200"></div>
                {Array.from({ length: 17 }, (_, i) => {
                  const hora = 6 + i; // Empezar desde las 6:00
                  return (
                    <div
                      key={hora}
                      className="h-16 border-b border-slate-100 text-xs px-2 py-1 text-slate-500"
                    >
                      {hora.toString().padStart(2, '0')}:00
                    </div>
                  );
                })}
              </div>

              {/* Columnas de días */}
              {getDiasSemana().map((fecha, diaIndex) => {
                const reservasDelDia = getReservasDelDia(fecha);
                const esHoy = fecha.getDate() === new Date().getDate() &&
                  fecha.getMonth() === new Date().getMonth() &&
                  fecha.getFullYear() === new Date().getFullYear();

                return (
                  <div
                    key={diaIndex}
                    className={`border-r border-slate-200 last:border-r-0 ${
                      esHoy ? 'bg-blue-50' : 'bg-white'
                    }`}
                  >
                    {/* Header del día */}
                    <div className={`h-16 border-b border-slate-200 text-center py-2 ${
                      esHoy ? 'bg-blue-100' : 'bg-slate-50'
                    }`}>
                      <div className="text-xs font-medium text-slate-600">
                        {diasSemanaNombres[diaIndex]}
                      </div>
                      <div className={`text-lg font-bold ${esHoy ? 'text-blue-600' : 'text-gray-900'}`}>
                        {fecha.getDate()}
                      </div>
                    </div>

                    {/* Slots de tiempo */}
                    <div 
                      className="relative" 
                      style={{ height: '1088px' }}
                      onDragOver={(e) => {
                        if (role === 'entrenador' && vista === 'semana') {
                          e.preventDefault();
                          const rect = e.currentTarget.getBoundingClientRect();
                          const y = e.clientY - rect.top;
                          const { hora, minuto } = obtenerHoraDesdePosicion(y);
                          handleDragOver(e, fecha, hora, minuto);
                        }
                      }}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => {
                        if (role === 'entrenador' && vista === 'semana') {
                          e.preventDefault();
                          const rect = e.currentTarget.getBoundingClientRect();
                          const y = e.clientY - rect.top;
                          const { hora, minuto } = obtenerHoraDesdePosicion(y);
                          handleDrop(e, fecha, hora, minuto);
                        }
                      }}
                    >
                      {Array.from({ length: 17 }, (_, horaIndex) => {
                        const hora = 6 + horaIndex; // Empezar desde las 6:00
                        const esDropTargetHora = dropTarget?.fecha.getTime() === fecha.getTime() &&
                          dropTarget.hora === hora &&
                          dropTarget.minuto === 0;
                        
                        return (
                          <div
                            key={hora}
                            className={`h-16 border-b ${
                              esDropTargetHora ? 'bg-blue-100 ring-2 ring-blue-400 z-20 border-blue-300' : 'border-slate-100'
                            } ${role === 'entrenador' && vista === 'semana' ? 'cursor-pointer hover:bg-slate-50' : ''}`}
                            style={{
                              position: 'relative',
                            }}
                          />
                        );
                      })}
                      
                      {/* Indicador visual del drop target */}
                      {dropTarget && dropTarget.fecha.getTime() === fecha.getTime() && (
                        <div
                          className="absolute left-0 right-0 bg-blue-200 border-2 border-blue-400 rounded z-30 pointer-events-none"
                          style={{
                            top: `${calcularPosicionSlot(dropTarget.hora, dropTarget.minuto)}px`,
                            height: '64px',
                            opacity: 0.5,
                          }}
                        >
                          <div className="text-xs text-blue-700 font-semibold p-1">
                            Soltar aquí
                          </div>
                        </div>
                      )}

                      {/* Renderizar reservas */}
                      {reservasDelDia
                        .filter(reserva => {
                          const [horaInicio] = reserva.horaInicio.split(':').map(Number);
                          // Solo mostrar reservas entre las 6:00 y 22:00
                          return horaInicio >= 6 && horaInicio < 23;
                        })
                        .map((reserva) => {
                          const [horaInicio, minutoInicio] = reserva.horaInicio.split(':').map(Number);
                          const [horaFin, minutoFin] = reserva.horaFin.split(':').map(Number);
                          
                          const inicioMinutos = horaInicio * 60 + minutoInicio;
                          const finMinutos = horaFin * 60 + minutoFin;
                          const duracionMinutos = finMinutos - inicioMinutos;
                          
                          // Calcular posición relativa a las 6:00 (inicio del calendario)
                          const minutosDesdeInicio = inicioMinutos - (6 * 60);
                          const top = (minutosDesdeInicio / 60) * 64; // 64px por hora (h-16 = 64px)
                          const height = (duracionMinutos / 60) * 64;

                          const puedeArrastrar = role === 'entrenador' && vista === 'semana' && 
                            reserva.estado !== 'cancelada' && reserva.estado !== 'completada';
                          
                          const colorTipo = getColorPorTipo(reserva.tipo);
                          const estiloEstado = getEstiloPorEstado(reserva.estado);
                          
                          return (
                            <div
                              key={reserva.id}
                              className={`absolute left-1 right-1 ${colorTipo.bg} ${colorTipo.border} border-2 ${estiloEstado} text-white text-xs p-1.5 rounded shadow-md z-10 ${
                                puedeArrastrar ? 'cursor-move hover:shadow-lg transition-shadow' : 'cursor-default'
                              }`}
                              style={{
                                top: `${Math.max(0, top)}px`,
                                height: `${Math.max(40, height)}px`,
                                minHeight: '40px',
                              }}
                              title={`${reserva.clienteNombre} - ${reserva.horaInicio} a ${reserva.horaFin} - ${colorTipo.nombre}${reserva.enlaceVideollamada ? '\nEnlace: ' + reserva.enlaceVideollamada : ''}`}
                              draggable={puedeArrastrar}
                              onDragStart={(e) => puedeArrastrar && handleDragStart(e, reserva)}
                              onDragEnd={handleDragEnd}
                            >
                              <div className="font-semibold truncate">{reserva.clienteNombre}</div>
                              <div className="text-xs opacity-90">
                                {reserva.horaInicio} - {reserva.horaFin}
                              </div>
                              <div className="flex items-center gap-1 mt-1 flex-wrap">
                                {reserva.tipoSesion === 'videollamada' ? (
                                  <>
                                    <Video className="w-3 h-3" />
                                    <span className="text-xs">Online</span>
                                    {reserva.enlaceVideollamada && (
                                      <Link2 
                                        className="w-3 h-3 ml-auto" 
                                        title="Enlace de videollamada disponible"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          window.open(reserva.enlaceVideollamada, '_blank');
                                        }}
                                      />
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <MapPin className="w-3 h-3" />
                                    <span className="text-xs">Presencial</span>
                                  </>
                                )}
                              </div>
                              {puedeArrastrar && (
                                <div className="text-xs opacity-75 mt-1">
                                  Arrastra para reprogramar
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Vista Mes */}
        {vista === 'mes' && (
          <div className="grid grid-cols-7 gap-2">
            {/* Headers de días de la semana */}
            {diasSemanaCompletos.map((dia) => (
              <div
                key={dia}
                className="text-sm font-semibold text-slate-600 text-center py-2"
              >
                {dia.substring(0, 3)}
              </div>
            ))}

            {/* Días del mes */}
            {getDiasMes().map((fecha, index) => {
              const reservasDelDia = getReservasDelDia(fecha);
              const esHoy = fecha && 
                fecha.getDate() === new Date().getDate() &&
                fecha.getMonth() === new Date().getMonth() &&
                fecha.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={index}
                  className={`
                    bg-white rounded-xl border border-slate-200 p-2 min-h-[120px]
                    ${fecha ? 'cursor-pointer hover:bg-slate-50 transition-colors' : ''}
                    ${esHoy ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                  `}
                >
                  {fecha && (
                    <>
                      <div className={`text-sm font-semibold mb-2 ${esHoy ? 'text-blue-600' : 'text-gray-900'}`}>
                        {fecha.getDate()}
                      </div>
                      <div className="space-y-1">
                        {reservasDelDia.slice(0, 3).map((reserva) => {
                          const colorTipo = getColorPorTipo(reserva.tipo);
                          const estiloEstado = getEstiloPorEstado(reserva.estado);
                          return (
                            <div
                              key={reserva.id}
                              className={`${colorTipo.bg} ${colorTipo.border} border-2 ${estiloEstado} text-white text-xs px-2 py-1 rounded truncate`}
                              title={`${reserva.clienteNombre} - ${reserva.horaInicio} - ${colorTipo.nombre}`}
                            >
                              <div className="font-medium truncate">{reserva.clienteNombre}</div>
                              <div className="text-xs opacity-90">{reserva.horaInicio}</div>
                            </div>
                          );
                        })}
                        {reservasDelDia.length > 3 && (
                          <div className="text-xs text-slate-500 font-medium">
                            +{reservasDelDia.length - 3} más
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="text-gray-600">Cargando reservas...</div>
          </div>
        )}

        {/* Mensajes de error y éxito */}
        {errorReprogramacion && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">Error al reprogramar</p>
              <p className="text-sm text-red-700">{errorReprogramacion}</p>
            </div>
          </div>
        )}

        {exitoReprogramacion && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">¡Reserva reprogramada!</p>
              <p className="text-sm text-green-700">La reserva ha sido actualizada exitosamente.</p>
            </div>
          </div>
        )}

        {procesandoReprogramacion && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-sm text-blue-700">Reprogramando reserva...</p>
          </div>
        )}

        {/* Instrucciones de drag and drop */}
        {role === 'entrenador' && vista === 'semana' && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Arrastra las reservas a diferentes horarios para reprogramarlas rápidamente.
            </p>
          </div>
        )}

        {/* Leyenda - Tipos de Sesión */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Tipos de Sesión</h3>
          <div className="flex items-center gap-6 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 border-2 border-blue-600 rounded"></div>
              <span className="text-gray-600">Sesión 1-1</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 border-2 border-purple-600 rounded"></div>
              <span className="text-gray-600">Clase Grupal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-pink-500 border-2 border-pink-600 rounded"></div>
              <span className="text-gray-600">Fisioterapia</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 border-2 border-green-600 rounded"></div>
              <span className="text-gray-600">Nutrición</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 border-2 border-orange-600 rounded"></div>
              <span className="text-gray-600">Masaje</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Estados</h3>
            <div className="flex items-center gap-6 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 border-2 border-gray-400 rounded opacity-100"></div>
                <span className="text-gray-600">Confirmada/Completada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 border-2 border-dashed border-gray-400 rounded opacity-90"></div>
                <span className="text-gray-600">Pendiente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 border-2 border-gray-400 rounded opacity-50 line-through"></div>
                <span className="text-gray-600">Cancelada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 border-2 border-gray-400 rounded opacity-60"></div>
                <span className="text-gray-600">No Show</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

