import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { fiscalCalendarApi } from '../api';
import { FiscalCalendar, TaxDeadline } from '../api/types';
import { Calendar, Clock, AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { format } from 'date-fns';

interface FiscalCalendarProps {
  userId: string;
  onReminderClick?: (deadline: TaxDeadline) => void;
}

export const FiscalCalendarComponent: React.FC<FiscalCalendarProps> = ({ 
  userId, 
  onReminderClick 
}) => {
  const [calendar, setCalendar] = useState<FiscalCalendar | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [reminders, setReminders] = useState<any[]>([]);

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

  const getStatusBadge = (deadline: TaxDeadline) => {
    if (deadline.status === 'completed') {
      return <Badge variant="success">Completado</Badge>;
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

  const getModelColor = (model: TaxDeadline['model']) => {
    switch (model) {
      case '130':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case '303':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getQuarterName = (quarter: number) => {
    switch (quarter) {
      case 1:
        return '1T (Ene-Mar)';
      case 2:
        return '2T (Abr-Jun)';
      case 3:
        return '3T (Jul-Sep)';
      case 4:
        return '4T (Oct-Dic)';
      default:
        return `Q${quarter}`;
    }
  };

  const groupedDeadlines = calendar?.deadlines.reduce((acc, deadline) => {
    const key = `${deadline.quarter}-${deadline.year}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(deadline);
    return acc;
  }, {} as Record<string, TaxDeadline[]>) || {};

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Calendario Fiscal</h2>
            <p className="text-sm text-gray-600">
              Fechas de vencimiento trimestrales de impuestos (Modelo 130, 303)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentYear(currentYear - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="px-4 py-2 font-semibold text-gray-900">{currentYear}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentYear(currentYear + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Recordatorios activos */}
      {reminders.length > 0 && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 mb-2">
                Recordatorios Activos ({reminders.length})
              </h3>
              <div className="space-y-2">
                {reminders.slice(0, 3).map((reminder) => (
                  <div key={reminder.id} className="text-sm text-yellow-800">
                    <strong>{reminder.title}</strong> - {reminder.message}
                  </div>
                ))}
                {reminders.length > 3 && (
                  <div className="text-sm text-yellow-700 font-medium">
                    Y {reminders.length - 3} recordatorio(s) más...
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Calendario por trimestres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(groupedDeadlines)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([key, deadlines]) => {
            const quarter = deadlines[0].quarter;
            return (
              <Card key={key} className="p-5">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {getQuarterName(quarter)} {currentYear}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {quarter === 1 && 'Enero - Marzo'}
                    {quarter === 2 && 'Abril - Junio'}
                    {quarter === 3 && 'Julio - Septiembre'}
                    {quarter === 4 && 'Octubre - Diciembre'}
                  </p>
                </div>

                <div className="space-y-3">
                  {deadlines.map((deadline) => {
                    const daysUntil = Math.ceil(
                      (deadline.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    );
                    const hasReminder = reminders.some(r => r.deadlineId === deadline.id);
                    
                    return (
                      <div
                        key={deadline.id}
                        className={`p-4 rounded-lg border-2 ${
                          deadline.status === 'overdue'
                            ? 'border-red-200 bg-red-50'
                            : deadline.status === 'completed'
                            ? 'border-green-200 bg-green-50'
                            : daysUntil <= 7
                            ? 'border-yellow-200 bg-yellow-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold border ${getModelColor(
                                deadline.model
                              )}`}
                            >
                              {deadline.modelName}
                            </span>
                            {hasReminder && (
                              <Bell className="w-4 h-4 text-yellow-600" />
                            )}
                          </div>
                          {getStatusBadge(deadline)}
                        </div>

                        <p className="text-sm text-gray-700 mb-3">{deadline.description}</p>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>
                              Vence: {format(deadline.deadline, 'dd/MM/yyyy')}
                            </span>
                          </div>
                          {deadline.status !== 'completed' && (
                            <div className="flex items-center gap-2">
                              {daysUntil > 0 && (
                                <span
                                  className={`text-xs font-medium ${
                                    daysUntil <= 3
                                      ? 'text-red-600'
                                      : daysUntil <= 7
                                      ? 'text-yellow-600'
                                      : 'text-gray-600'
                                  }`}
                                >
                                  {daysUntil} día{daysUntil !== 1 ? 's' : ''}
                                </span>
                              )}
                              {deadline.status === 'overdue' && (
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                          )}
                        </div>

                        {deadline.status === 'pending' && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkAsComplete(deadline.id)}
                              className="w-full"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Marcar como completado
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
      </div>

      {/* Información adicional */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-900">
            <strong>Recordatorios automáticos:</strong> Recibirás notificaciones 15 días antes de cada
            vencimiento trimestral. Asegúrate de presentar tus declaraciones a tiempo para evitar multas.
          </div>
        </div>
      </Card>
    </div>
  );
};

