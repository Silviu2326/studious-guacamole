import { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Rocket, Users, Filter, X } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';
import { Button } from '../../../components/componentsreutilizables';
import { FunnelsAdquisicionService } from '../services/funnelsAdquisicionService';
import {
  FunnelCalendarEvent,
  FunnelCalendarRequest,
  FunnelCalendarResponse,
  FunnelPhaseType,
} from '../types';

interface FunnelLaunchCalendarProps {
  funnelIds?: string[];
  onEventClick?: (event: FunnelCalendarEvent) => void;
}

const phaseColors: Record<FunnelPhaseType, string> = {
  lanzamiento: 'bg-blue-500',
  captacion: 'bg-green-500',
  cualificacion: 'bg-yellow-500',
  nurturing: 'bg-purple-500',
  conversion: 'bg-orange-500',
  onboarding: 'bg-pink-500',
  retencion: 'bg-indigo-500',
  cierre_campana: 'bg-red-500',
};

const phaseLabels: Record<FunnelPhaseType, string> = {
  lanzamiento: 'Lanzamiento',
  captacion: 'Captación',
  cualificacion: 'Cualificación',
  nurturing: 'Nurturing',
  conversion: 'Conversión',
  onboarding: 'Onboarding',
  retencion: 'Retención',
  cierre_campana: 'Cierre Campaña',
};

export function FunnelLaunchCalendar({ funnelIds, onEventClick }: FunnelLaunchCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [loading, setLoading] = useState(false);
  const [calendarData, setCalendarData] = useState<FunnelCalendarResponse | null>(null);
  const [selectedPhaseTypes, setSelectedPhaseTypes] = useState<FunnelPhaseType[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const startDate = useMemo(() => {
    const date = new Date(currentDate);
    if (viewMode === 'month') {
      date.setDate(1);
    } else {
      const dayOfWeek = date.getDay();
      const diff = date.getDate() - dayOfWeek;
      date.setDate(diff);
    }
    date.setHours(0, 0, 0, 0);
    return date;
  }, [currentDate, viewMode]);

  const endDate = useMemo(() => {
    const date = new Date(startDate);
    if (viewMode === 'month') {
      date.setMonth(date.getMonth() + 1);
      date.setDate(0);
    } else {
      date.setDate(date.getDate() + 6);
    }
    date.setHours(23, 59, 59, 999);
    return date;
  }, [startDate, viewMode]);

  const loadCalendarData = useCallback(async () => {
    setLoading(true);
    try {
      const request: FunnelCalendarRequest = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        funnelIds: funnelIds?.length ? funnelIds : undefined,
        phaseTypes: selectedPhaseTypes.length ? selectedPhaseTypes : undefined,
      };
      const data = await FunnelsAdquisicionService.getFunnelCalendar(request);
      setCalendarData(data);
    } catch (error) {
      console.error('[FunnelLaunchCalendar] Error cargando calendario:', error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, funnelIds, selectedPhaseTypes]);

  useEffect(() => {
    loadCalendarData();
  }, [loadCalendarData]);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDaysInView = () => {
    const days: Date[] = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    if (!calendarData) return [];
    const dateStr = date.toISOString().split('T')[0];
    return calendarData.events.filter((event) => {
      const eventStart = new Date(event.startDate).toISOString().split('T')[0];
      const eventEnd = event.endDate
        ? new Date(event.endDate).toISOString().split('T')[0]
        : eventStart;
      return dateStr >= eventStart && dateStr <= eventEnd;
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric',
    });
  };

  const formatWeekRange = (start: Date, end: Date) => {
    const startStr = start.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    const endStr = end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  const togglePhaseFilter = (phaseType: FunnelPhaseType) => {
    setSelectedPhaseTypes((prev) =>
      prev.includes(phaseType) ? prev.filter((p) => p !== phaseType) : [...prev, phaseType]
    );
  };

  const clearFilters = () => {
    setSelectedPhaseTypes([]);
  };

  const days = getDaysInView();
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <Card className="p-6 bg-white shadow-sm dark:bg-slate-900/60">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-indigo-900/40 dark:to-purple-900/30 rounded-xl ring-1 ring-indigo-200/70">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              Calendario de Lanzamientos y Fases
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Visualiza y coordina lanzamientos y fases del funnel con tu equipo
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <div className="flex items-center gap-1 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                viewMode === 'week'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                viewMode === 'month'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              Mes
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Filtrar por fase</h4>
            {selectedPhaseTypes.length > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(phaseLabels) as FunnelPhaseType[]).map((phaseType) => {
              const isSelected = selectedPhaseTypes.includes(phaseType);
              return (
                <button
                  key={phaseType}
                  onClick={() => togglePhaseFilter(phaseType)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? `${phaseColors[phaseType]} text-white`
                      : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600'
                  }`}
                >
                  {phaseLabels[phaseType]}
                  {isSelected && <X className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-slate-400" />
          </button>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100 min-w-[200px] text-center">
            {viewMode === 'month'
              ? formatDate(currentDate)
              : formatWeekRange(startDate, endDate)}
          </h4>
          <button
            onClick={() => navigateDate('next')}
            className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-slate-400" />
          </button>
        </div>
        <Button variant="ghost" size="sm" onClick={goToToday}>
          Hoy
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {viewMode === 'month' ? (
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-xs font-semibold text-gray-500 dark:text-slate-400"
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: startDate.getDay() }).map((_, index) => (
                <div key={`empty-${index}`} className="p-2 min-h-[80px]"></div>
              ))}
              {days.map((day, index) => {
                const events = getEventsForDate(day);
                const isToday = day.toDateString() === new Date().toDateString();
                return (
                  <div
                    key={index}
                    className={`p-2 min-h-[80px] border border-gray-100 dark:border-slate-800 ${
                      isToday ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-white dark:bg-slate-900/40'
                    }`}
                  >
                    <div
                      className={`text-sm font-medium mb-1 ${
                        isToday
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-700 dark:text-slate-300'
                      }`}
                    >
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {events.slice(0, 3).map((event) => (
                        <button
                          key={event.id}
                          onClick={() => onEventClick?.(event)}
                          className={`w-full text-left px-2 py-1 rounded text-xs font-medium truncate ${
                            event.phaseType
                              ? `${phaseColors[event.phaseType]} text-white`
                              : 'bg-gray-500 text-white'
                          } hover:opacity-80 transition-opacity`}
                          title={event.title}
                        >
                          {event.title}
                        </button>
                      ))}
                      {events.length > 3 && (
                        <div className="text-xs text-gray-500 dark:text-slate-400 px-2">
                          +{events.length - 3} más
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, dayIndex) => {
                const dayDate = days[dayIndex];
                const events = dayDate ? getEventsForDate(dayDate) : [];
                const isToday = dayDate?.toDateString() === new Date().toDateString();
                return (
                  <div
                    key={dayIndex}
                    className={`p-3 border rounded-lg ${
                      isToday
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800'
                        : 'bg-white dark:bg-slate-900/40 border-gray-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="mb-2">
                      <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">{day}</div>
                      <div
                        className={`text-lg font-semibold ${
                          isToday
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-gray-900 dark:text-slate-100'
                        }`}
                      >
                        {dayDate?.getDate()}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {events.map((event) => (
                        <button
                          key={event.id}
                          onClick={() => onEventClick?.(event)}
                          className={`w-full text-left px-2 py-1.5 rounded text-xs font-medium ${
                            event.phaseType
                              ? `${phaseColors[event.phaseType]} text-white`
                              : 'bg-gray-500 text-white'
                          } hover:opacity-80 transition-opacity`}
                          title={event.description || event.title}
                        >
                          <div className="truncate">{event.title}</div>
                          {event.teamMembers && event.teamMembers.length > 0 && (
                            <div className="flex items-center gap-1 mt-1 opacity-90">
                              <Users className="w-3 h-3" />
                              <span className="text-xs">{event.teamMembers.length}</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {calendarData && calendarData.events.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500 dark:text-slate-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No hay eventos programados para este período</p>
        </div>
      )}

      {calendarData && calendarData.events.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">Leyenda</h4>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(phaseLabels) as FunnelPhaseType[]).map((phaseType) => (
              <div key={phaseType} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${phaseColors[phaseType]}`}></div>
                <span className="text-sm text-gray-600 dark:text-slate-400">{phaseLabels[phaseType]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

