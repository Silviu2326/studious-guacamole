import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { fiscalCalendarApi } from '../api';
import { FiscalCalendar, TaxDeadline, TaxObligationType } from '../api/types';
import { Calendar, Clock, AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Bell, Filter, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

interface FiscalCalendarProps {
  userId: string;
  onReminderClick?: (deadline: TaxDeadline) => void;
}

type ViewMode = 'month' | 'year';
type CalendarView = 'monthly' | 'annual';

const DAYS_OF_WEEK = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export const FiscalCalendarComponent: React.FC<FiscalCalendarProps> = ({ 
  userId, 
  onReminderClick 
}) => {
  const [calendar, setCalendar] = useState<FiscalCalendar | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarView>('monthly');
  const [selectedObligationType, setSelectedObligationType] = useState<TaxObligationType | 'all'>('all');
  const [reminders, setReminders] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tooltipDeadline, setTooltipDeadline] = useState<TaxDeadline | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    loadCalendar();
    loadReminders();
  }, [currentYear, userId]);

  const loadCalendar = async () => {
    setLoading(true);
    try {
      const data = await fiscalCalendarApi.getCalendar(currentYear);
      setCalendar(data);
    } catch (error) {
      console.error('Error loading fiscal calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReminders = async () => {
    try {
      const data = await fiscalCalendarApi.getReminders(userId);
      setReminders(data);
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const handleMarkAsComplete = async (deadlineId: string) => {
    try {
      await fiscalCalendarApi.markDeadlineAsComplete(deadlineId);
      await loadCalendar();
      await loadReminders();
    } catch (error) {
      console.error('Error marking deadline as complete:', error);
    }
  };

  // Filtrar deadlines según el tipo seleccionado
  const filteredDeadlines = useMemo(() => {
    if (!calendar) return [];
    if (selectedObligationType === 'all') return calendar.deadlines;
    return calendar.deadlines.filter(d => d.obligationType === selectedObligationType);
  }, [calendar, selectedObligationType]);

  // Agrupar deadlines por fecha para el calendario mensual
  const deadlinesByDate = useMemo(() => {
    const map = new Map<string, TaxDeadline[]>();
    filteredDeadlines.forEach(deadline => {
      const dateKey = format(deadline.deadline, 'yyyy-MM-dd');
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(deadline);
    });
    return map;
  }, [filteredDeadlines]);

  // Generar matriz de días del mes
  const monthMatrix = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    
    const firstDayOfWeek = getDay(start) === 0 ? 6 : getDay(start) - 1; // Lunes = 0
    const matrix: (Date | null)[][] = [];
    let week: (Date | null)[] = [];
    
    // Días vacíos al inicio
    for (let i = 0; i < firstDayOfWeek; i++) {
      week.push(null);
    }
    
    // Días del mes
    days.forEach(day => {
      week.push(day);
      if (week.length === 7) {
        matrix.push(week);
        week = [];
      }
    });
    
    // Días vacíos al final
    while (week.length < 7) {
      week.push(null);
    }
    if (week.length > 0) {
      matrix.push(week);
    }
    
    return matrix;
  }, [currentMonth]);

  const getStatusBadge = (deadline: TaxDeadline) => {
    if (deadline.status === 'completed' || deadline.isSubmitted) {
      return <Badge variant="success">Presentado</Badge>;
    }
    if (deadline.status === 'overdue') {
      return <Badge variant="error">Vencido</Badge>;
    }
    const today = new Date();
    const daysUntil = Math.ceil((deadline.deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 7) {
      return <Badge variant="warning">Próximo</Badge>;
    }
    return <Badge variant="info">Pendiente</Badge>;
  };

  const getModelColor = (deadline: TaxDeadline) => {
    if (deadline.status === 'completed' || deadline.isSubmitted) {
      return 'bg-green-100 text-green-800 border-green-300';
    }
    if (deadline.status === 'overdue') {
      return 'bg-red-100 text-red-800 border-red-300';
    }
    const today = new Date();
    const daysUntil = Math.ceil((deadline.deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 7) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
    
    switch (deadline.model) {
      case '130':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case '303':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case '100':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getObligationTypeLabel = (type: TaxObligationType) => {
    switch (type) {
      case 'iva_trimestral':
        return 'IVA Trimestral';
      case 'irpf_trimestral':
        return 'IRPF Trimestral';
      case 'declaracion_anual':
        return 'Declaración Anual';
      case 'pago_fraccionado':
        return 'Pago Fraccionado';
      default:
        return type;
    }
  };

  const handleDateClick = (date: Date, event: React.MouseEvent) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const deadlines = deadlinesByDate.get(dateKey);
    
    if (deadlines && deadlines.length > 0) {
      setSelectedDate(date);
      setTooltipDeadline(deadlines[0]); // Mostrar el primero si hay varios
      setTooltipPosition({ x: event.clientX, y: event.clientY });
      
      if (onReminderClick && deadlines[0]) {
        onReminderClick(deadlines[0]);
      }
    }
  };

  const handleMouseEnter = (date: Date, event: React.MouseEvent, deadline: TaxDeadline) => {
    setTooltipDeadline(deadline);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setTooltipDeadline(null);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">Cargando calendario fiscal...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Calendario Fiscal</h2>
            <p className="text-sm text-gray-600">
              Fechas clave de obligaciones fiscales
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Selector de vista */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                viewMode === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setViewMode('annual')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                viewMode === 'annual'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Anual
            </button>
          </div>
        </div>
      </div>

      {/* Filtros por tipo de obligación */}
      <Card className="p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtrar por tipo:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedObligationType('all')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                selectedObligationType === 'all'
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            {(['iva_trimestral', 'irpf_trimestral', 'declaracion_anual', 'pago_fraccionado'] as TaxObligationType[]).map(type => (
              <button
                key={type}
                onClick={() => setSelectedObligationType(type)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                  selectedObligationType === type
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getObligationTypeLabel(type)}
              </button>
            ))}
          </div>
          {selectedObligationType !== 'all' && (
            <button
              onClick={() => setSelectedObligationType('all')}
              className="ml-auto text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Limpiar filtro
            </button>
          )}
        </div>
      </Card>

      {viewMode === 'monthly' ? (
        /* Vista Mensual */
        <Card className="p-6">
          {/* Navegación de mes */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900">
                {format(currentMonth, 'MMMM yyyy', { locale: es })}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(new Date())}
                className="text-sm text-gray-500 mt-1"
              >
                Hoy
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Calendario mensual */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {DAYS_OF_WEEK.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {monthMatrix.map((week, weekIndex) =>
              week.map((day, dayIndex) => {
                if (!day) {
                  return <div key={`${weekIndex}-${dayIndex}`} className="aspect-square" />;
                }

                const dateKey = format(day, 'yyyy-MM-dd');
                const dayDeadlines = deadlinesByDate.get(dateKey) || [];
                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = isSameMonth(day, currentMonth);

                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`aspect-square border rounded-lg p-1 relative cursor-pointer transition-all ${
                      isToday
                        ? 'border-blue-500 bg-blue-50'
                        : dayDeadlines.length > 0
                        ? 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${!isCurrentMonth ? 'opacity-40' : ''}`}
                    onClick={(e) => handleDateClick(day, e)}
                    onMouseEnter={(e) => {
                      if (dayDeadlines.length > 0) {
                        handleMouseEnter(day, e, dayDeadlines[0]);
                      }
                    }}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className={`text-xs font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                      {format(day, 'd')}
                    </div>
                    {dayDeadlines.length > 0 && (
                      <div className="space-y-0.5">
                        {dayDeadlines.slice(0, 2).map((deadline, idx) => (
                          <div
                            key={deadline.id}
                            className={`text-[10px] px-1 py-0.5 rounded truncate ${getModelColor(deadline)}`}
                            title={deadline.modelName}
                          >
                            {deadline.model}
                          </div>
                        ))}
                        {dayDeadlines.length > 2 && (
                          <div className="text-[10px] text-gray-500">+{dayDeadlines.length - 2}</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Leyenda */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
                <span>Presentado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-100 border border-red-300"></div>
                <span>Vencido</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300"></div>
                <span>Próximo (≤7 días)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></div>
                <span>IRPF (Modelo 130)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-100 border border-purple-300"></div>
                <span>IVA (Modelo 303)</span>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        /* Vista Anual */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MONTHS.map((month, monthIndex) => {
            const monthDate = new Date(currentYear, monthIndex, 1);
            const monthDeadlines = filteredDeadlines.filter(d => {
              const deadlineMonth = d.deadline.getMonth();
              const deadlineYear = d.deadline.getFullYear();
              return deadlineMonth === monthIndex && deadlineYear === currentYear;
            });

            return (
              <Card key={month} className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{month}</h3>
                {monthDeadlines.length > 0 ? (
                  <div className="space-y-2">
                    {monthDeadlines.map(deadline => {
                      const daysUntil = Math.ceil(
                        (deadline.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                      );
                      const hasReminder = reminders.some(r => r.deadlineId === deadline.id);

                      return (
                        <div
                          key={deadline.id}
                          className={`p-3 rounded-lg border-2 ${getModelColor(deadline)}`}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold">
                                {deadline.modelName}
                              </span>
                              {hasReminder && <Bell className="w-3 h-3" />}
                            </div>
                            {getStatusBadge(deadline)}
                          </div>
                          <p className="text-xs mb-2">{deadline.description}</p>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{format(deadline.deadline, 'dd/MM/yyyy')}</span>
                            </div>
                            {deadline.status !== 'completed' && !deadline.isSubmitted && daysUntil > 0 && (
                              <span className={daysUntil <= 7 ? 'text-yellow-600 font-medium' : 'text-gray-600'}>
                                {daysUntil}d
                              </span>
                            )}
                          </div>
                          {deadline.status === 'pending' && !deadline.isSubmitted && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkAsComplete(deadline.id)}
                              className="w-full mt-2 text-xs"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Marcar completado
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">Sin obligaciones este mes</p>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Tooltip flotante */}
      {tooltipDeadline && (
        <div
          className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y + 10}px`,
            pointerEvents: 'none'
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold border ${getModelColor(tooltipDeadline)}`}>
              {tooltipDeadline.modelName}
            </span>
            {getStatusBadge(tooltipDeadline)}
          </div>
          <p className="text-sm text-gray-700 mb-2">{tooltipDeadline.description}</p>
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
            <Clock className="w-3 h-3" />
            <span>Vence: {format(tooltipDeadline.deadline, 'dd/MM/yyyy')}</span>
          </div>
          <div className="text-xs text-gray-500">
            Tipo: {getObligationTypeLabel(tooltipDeadline.obligationType)}
          </div>
        </div>
      )}

      {/* Información adicional */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-900">
            <strong>Recordatorios automáticos:</strong> Recibirás notificaciones 15 días antes de cada
            vencimiento. Asegúrate de presentar tus declaraciones a tiempo para evitar multas.
          </div>
        </div>
      </Card>
    </div>
  );
};
