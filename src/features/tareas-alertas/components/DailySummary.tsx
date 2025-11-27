import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Badge, Button } from '../../../components/componentsreutilizables';
import { Task, Alert, Notification } from '../types';
import { 
  getHighPriorityTasksForToday,
  getTodayCriticalAlerts,
  getUpcomingReminders,
  getPriorityColor, 
  getPriorityLabel,
  getTaskPriorityCardStyles 
} from '../api';
import { AlertsPanel } from './AlertsPanel';
import { 
  Calendar, 
  CheckSquare, 
  Bell, 
  AlertCircle, 
  Clock, 
  Loader2,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface DailySummaryProps {
  role: 'entrenador' | 'gimnasio';
  onNavigateToTab?: (tabId: string) => void;
}

export const DailySummary: React.FC<DailySummaryProps> = ({ role, onNavigateToTab }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState<Alert[]>([]);
  const [highPriorityTasks, setHighPriorityTasks] = useState<Task[]>([]);
  const [upcomingReminders, setUpcomingReminders] = useState<Notification[]>([]);

  useEffect(() => {
    loadDailyData();
  }, [role, user?.id]);

  const loadDailyData = async () => {
    setLoading(true);
    try {
      // Cargar alertas críticas del día (3-5)
      const alerts = await getTodayCriticalAlerts(role, 5);
      setCriticalAlerts(alerts);

      // Cargar tareas de alta prioridad para hoy (3-5)
      const tasks = await getHighPriorityTasksForToday(role, user?.id, 5);
      setHighPriorityTasks(tasks);

      // Cargar próximos recordatorios (1-3)
      const reminders = await getUpcomingReminders(3);
      setUpcomingReminders(reminders);
    } catch (error) {
      console.error('Error cargando resumen diario:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando resumen del día...</p>
      </Card>
    );
  }

  const totalItems = criticalAlerts.length + highPriorityTasks.length + upcomingReminders.length;

  return (
    <div className="space-y-6">
      {/* Header con fecha */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Resumen de Hoy</h2>
              <p className="text-sm text-gray-600">
                {new Date().toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          {totalItems > 0 && (
            <Badge className="bg-red-100 text-red-800 border-red-200 text-lg px-4 py-2">
              {totalItems} pendiente{totalItems !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </Card>

      {/* Sección de Alertas Críticas del Día */}
      <Card className="bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Alertas Críticas del Día</h3>
            {criticalAlerts.length > 0 && (
              <Badge className="bg-red-100 text-red-800 border-red-200">
                {criticalAlerts.length}
              </Badge>
            )}
          </div>
        </div>
        
        {criticalAlerts.length === 0 ? (
          <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No hay alertas críticas para hoy</p>
          </div>
        ) : (
          <>
            <AlertsPanel 
              role={role} 
              maxVisible={5}
              compact={true}
              showHeader={false}
              showMarkAllAsRead={false}
              alerts={criticalAlerts}
            />
            {onNavigateToTab && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigateToTab('centro-notificaciones')}
                  className="w-full flex items-center justify-center gap-2 min-h-[44px]"
                >
                  Ver todas las alertas
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Sección de Tareas de Alta Prioridad */}
      <Card className="bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Tareas de Alta Prioridad</h3>
            {highPriorityTasks.length > 0 && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                {highPriorityTasks.length}
              </Badge>
            )}
          </div>
        </div>

        {highPriorityTasks.length === 0 ? (
          <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No hay tareas de alta prioridad para hoy</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {highPriorityTasks.map((task) => {
                const cardStyles = getTaskPriorityCardStyles(task.priority);
                return (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg relative ${
                      cardStyles.border
                    } ${cardStyles.background} ${cardStyles.borderColor}`}
                  >
                  {/* Badge en esquina superior derecha */}
                  <div className="absolute top-2 right-2">
                    <Badge className={getPriorityColor(task.priority)}>
                      {getPriorityLabel(task.priority)}
                    </Badge>
                  </div>
                  <div className="flex items-start justify-between pr-16">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 line-clamp-1">{task.title}</span>
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(task.dueDate).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
            {onNavigateToTab && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigateToTab('tareas')}
                  className="w-full flex items-center justify-center gap-2 min-h-[44px]"
                >
                  Ver todas las tareas
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Sección de Próximos Recordatorios/Citas */}
      {upcomingReminders.length > 0 && (
        <Card className="bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">Próximos Recordatorios</h3>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              {upcomingReminders.length}
            </Badge>
          </div>
          <div className="space-y-3">
            {upcomingReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="p-3 rounded-lg border bg-yellow-50 border-yellow-200"
              >
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{reminder.title}</span>
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                        Recordatorio
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{reminder.message}</p>
                    {reminder.scheduledFor && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(reminder.scheduledFor).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                  {reminder.actionUrl && (
                    <a
                      href={reminder.actionUrl}
                      className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Estado vacío */}
      {totalItems === 0 && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <TrendingUp size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ¡Todo al día!
          </h3>
          <p className="text-gray-600">
            No hay alertas críticas, tareas de alta prioridad o recordatorios pendientes para hoy.
          </p>
        </Card>
      )}
    </div>
  );
};

