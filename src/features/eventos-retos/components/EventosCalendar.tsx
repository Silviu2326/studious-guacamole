import React, { useState, useMemo, useCallback } from 'react';
import { Calendar, ChevronLeft, ChevronRight, MapPin, Video, Target, Filter, X } from 'lucide-react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Evento, TipoEvento } from '../api/events';

interface EventosCalendarProps {
  eventos: Evento[];
  onEventoClick: (evento: Evento) => void;
  onEventoMove?: (eventoId: string, nuevaFecha: Date) => void;
  tipoFiltro?: TipoEvento | 'todos';
  onTipoFiltroChange?: (tipo: TipoEvento | 'todos') => void;
}

type VistaCalendario = 'mes' | 'semana';

export const EventosCalendar: React.FC<EventosCalendarProps> = ({
  eventos,
  onEventoClick,
  onEventoMove,
  tipoFiltro = 'todos',
  onTipoFiltroChange,
}) => {
  const [fechaActual, setFechaActual] = useState(new Date());
  const [vista, setVista] = useState<VistaCalendario>('mes');
  const [eventoArrastrando, setEventoArrastrando] = useState<string | null>(null);
  const [diaHover, setDiaHover] = useState<Date | null>(null);

  // Filtrar eventos según tipo y estado
  const eventosFiltrados = useMemo(() => {
    return eventos.filter(evento => {
      // Filtrar por tipo
      if (tipoFiltro !== 'todos' && evento.tipo !== tipoFiltro) {
        return false;
      }
      // No mostrar eventos archivados en el calendario principal
      if (evento.archivado) {
        return false;
      }
      return true;
    });
  }, [eventos, tipoFiltro]);

  // Obtener días del mes
  const getDiasMes = useCallback(() => {
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
  }, [fechaActual]);

  // Obtener días de la semana
  const getDiasSemana = useCallback(() => {
    const fecha = new Date(fechaActual);
    const dia = fecha.getDay();
    const diff = dia === 0 ? -6 : 1 - dia;
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
  }, [fechaActual]);

  // Obtener eventos de un día
  const getEventosDelDia = useCallback((fecha: Date | null): Evento[] => {
    if (!fecha) return [];
    return eventosFiltrados.filter(evento => {
      const fechaEvento = new Date(evento.fechaInicio);
      return (
        fechaEvento.getDate() === fecha.getDate() &&
        fechaEvento.getMonth() === fecha.getMonth() &&
        fechaEvento.getFullYear() === fecha.getFullYear()
      );
    });
  }, [eventosFiltrados]);

  // Obtener color por tipo de evento
  const getColorPorTipo = (tipo: TipoEvento): string => {
    const colores: Record<TipoEvento, string> = {
      presencial: 'bg-blue-500 border-blue-600',
      reto: 'bg-green-500 border-green-600',
      virtual: 'bg-purple-500 border-purple-600',
    };
    return colores[tipo] || 'bg-gray-500 border-gray-600';
  };

  // Navegación
  const cambiarMes = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setMonth(fechaActual.getMonth() + (direccion === 'siguiente' ? 1 : -1));
    setFechaActual(nuevaFecha);
  };

  const cambiarSemana = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setDate(fechaActual.getDate() + (direccion === 'siguiente' ? 7 : -7));
    setFechaActual(nuevaFecha);
  };

  const irAHoy = () => {
    setFechaActual(new Date());
  };

  // Drag & Drop
  const handleDragStart = (e: React.DragEvent, evento: Evento) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', evento.id);
    setEventoArrastrando(evento.id);
  };

  const handleDragEnd = () => {
    setEventoArrastrando(null);
    setDiaHover(null);
  };

  const handleDragOver = (e: React.DragEvent, fecha: Date) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDiaHover(fecha);
  };

  const handleDragLeave = () => {
    setDiaHover(null);
  };

  const handleDrop = (e: React.DragEvent, fecha: Date) => {
    e.preventDefault();
    const eventoId = e.dataTransfer.getData('text/plain');
    const evento = eventos.find(e => e.id === eventoId);
    
    if (evento && onEventoMove) {
      const nuevaFecha = new Date(fecha);
      nuevaFecha.setHours(
        evento.fechaInicio.getHours(),
        evento.fechaInicio.getMinutes(),
        0,
        0
      );
      onEventoMove(eventoId, nuevaFecha);
    }
    
    setEventoArrastrando(null);
    setDiaHover(null);
  };

  // Verificar si es hoy
  const esHoy = (fecha: Date | null): boolean => {
    if (!fecha) return false;
    const hoy = new Date();
    return (
      fecha.getDate() === hoy.getDate() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear()
    );
  };

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const diasSemanaCompletos = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  return (
    <Card className="bg-white shadow-sm">
      {/* NOTA: Primera capa de responsive - Secciones principales se adaptan a una columna en pantallas pequeñas,
           sin scroll horizontal. Se puede mejorar más adelante con mejor UX móvil. */}
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              {vista === 'mes' 
                ? `${meses[fechaActual.getMonth()]} ${fechaActual.getFullYear()}`
                : `Semana del ${getDiasSemana()[0].getDate()} de ${meses[getDiasSemana()[0].getMonth()]}`}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVista('mes')}
              className={vista === 'mes' ? 'bg-slate-100 text-slate-900' : ''}
            >
              Mes
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVista('semana')}
              className={vista === 'semana' ? 'bg-slate-100 text-slate-900' : ''}
            >
              Semana
            </Button>
          </div>
        </div>

        {/* Filtros por tipo - Scrollables en móvil */}
        {onTipoFiltroChange && (
          <div className="mb-4 flex items-center gap-2 flex-wrap overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtrar por tipo:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTipoFiltroChange('todos')}
              className={tipoFiltro === 'todos' ? 'bg-blue-100 text-blue-900' : ''}
            >
              Todos
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTipoFiltroChange('presencial')}
              className={tipoFiltro === 'presencial' ? 'bg-blue-100 text-blue-900' : ''}
              leftIcon={<MapPin className="w-4 h-4" />}
            >
              Presencial
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTipoFiltroChange('reto')}
              className={tipoFiltro === 'reto' ? 'bg-green-100 text-green-900' : ''}
              leftIcon={<Target className="w-4 h-4" />}
            >
              Reto
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTipoFiltroChange('virtual')}
              className={tipoFiltro === 'virtual' ? 'bg-purple-100 text-purple-900' : ''}
              leftIcon={<Video className="w-4 h-4" />}
            >
              Virtual
            </Button>
          </div>
        )}

        {/* Controles de navegación */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => vista === 'mes' ? cambiarMes('anterior') : cambiarSemana('anterior')}
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
              onClick={() => vista === 'mes' ? cambiarMes('siguiente') : cambiarSemana('siguiente')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Leyenda de colores */}
        <div className="mb-4 flex items-center gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 border border-blue-600 rounded"></div>
            <span className="text-gray-600">Presencial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 border border-green-600 rounded"></div>
            <span className="text-gray-600">Reto</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 border border-purple-600 rounded"></div>
            <span className="text-gray-600">Virtual</span>
          </div>
        </div>

        {/* Vista Mensual - Responsive: una columna en móvil muy pequeño, 7 columnas en pantallas normales */}
        {vista === 'mes' && (
          <div className="grid grid-cols-7 gap-1 sm:gap-2 overflow-x-auto">
            {diasSemana.map((dia) => (
              <div
                key={dia}
                className="text-sm font-semibold text-slate-600 text-center py-2"
              >
                {dia}
              </div>
            ))}
            {getDiasMes().map((fecha, index) => {
              const eventosDelDia = getEventosDelDia(fecha);
              const esHoyDia = esHoy(fecha);
              const esHover = diaHover && fecha && 
                diaHover.getTime() === fecha.getTime();

              return (
                <div
                  key={index}
                  className={`
                    bg-white rounded-xl border-2 p-1 sm:p-2 min-h-[80px] sm:min-h-[100px]
                    ${fecha ? 'cursor-pointer hover:bg-slate-50 transition-colors' : ''}
                    ${esHoyDia ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                    ${esHover ? 'ring-2 ring-green-500 bg-green-50' : ''}
                    ${!fecha ? 'border-transparent' : 'border-slate-200'}
                  `}
                  onDragOver={fecha ? (e) => handleDragOver(e, fecha) : undefined}
                  onDragLeave={handleDragLeave}
                  onDrop={fecha ? (e) => handleDrop(e, fecha) : undefined}
                  onClick={fecha ? () => {
                    if (eventosDelDia.length > 0) {
                      onEventoClick(eventosDelDia[0]);
                    }
                  } : undefined}
                >
                  {fecha && (
                    <>
                      <div className={`text-sm font-semibold mb-1 ${esHoyDia ? 'text-blue-600' : 'text-gray-900'}`}>
                        {fecha.getDate()}
                      </div>
                      <div className="space-y-1">
                        {eventosDelDia.slice(0, 3).map((evento) => (
                          <div
                            key={evento.id}
                            draggable={!!onEventoMove}
                            onDragStart={(e) => onEventoMove && handleDragStart(e, evento)}
                            onDragEnd={handleDragEnd}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEventoClick(evento);
                            }}
                            className={`
                              ${getColorPorTipo(evento.tipo)} text-white text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-90
                              ${eventoArrastrando === evento.id ? 'opacity-50' : ''}
                            `}
                            title={evento.nombre}
                          >
                            {evento.nombre}
                          </div>
                        ))}
                        {eventosDelDia.length > 3 && (
                          <div className="text-xs text-slate-500">
                            +{eventosDelDia.length - 3} más
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

        {/* Vista Semanal */}
        {vista === 'semana' && (
          <div className="space-y-4">
            {getDiasSemana().map((fecha, index) => {
              const eventosDelDia = getEventosDelDia(fecha);
              const esHoyDia = esHoy(fecha);
              const esHover = diaHover && diaHover.getTime() === fecha.getTime();

              return (
                <div
                  key={index}
                  className={`
                    border-2 rounded-lg p-4
                    ${esHoyDia ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' : 'border-slate-200'}
                    ${esHover ? 'ring-2 ring-green-500 bg-green-50' : ''}
                  `}
                  onDragOver={(e) => handleDragOver(e, fecha)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, fecha)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-sm font-medium text-gray-600">
                        {diasSemanaCompletos[fecha.getDay()]}
                      </div>
                      <div className={`text-lg font-bold ${esHoyDia ? 'text-blue-600' : 'text-gray-900'}`}>
                        {fecha.getDate()} de {meses[fecha.getMonth()]}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {eventosDelDia.length} {eventosDelDia.length === 1 ? 'evento' : 'eventos'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {eventosDelDia.length === 0 ? (
                      <div className="text-sm text-gray-400 text-center py-4">
                        No hay eventos este día
                      </div>
                    ) : (
                      eventosDelDia.map((evento) => (
                        <div
                          key={evento.id}
                          draggable={!!onEventoMove}
                          onDragStart={(e) => onEventoMove && handleDragStart(e, evento)}
                          onDragEnd={handleDragEnd}
                          onClick={() => onEventoClick(evento)}
                          className={`
                            ${getColorPorTipo(evento.tipo)} text-white p-3 rounded-lg cursor-pointer hover:opacity-90
                            ${eventoArrastrando === evento.id ? 'opacity-50' : ''}
                          `}
                        >
                          <div className="font-semibold">{evento.nombre}</div>
                          <div className="text-xs opacity-90 mt-1">
                            {evento.fechaInicio.toLocaleTimeString('es-ES', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                            {evento.ubicacion && ` • ${evento.ubicacion}`}
                            {evento.plataforma && ` • ${evento.plataforma}`}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};


