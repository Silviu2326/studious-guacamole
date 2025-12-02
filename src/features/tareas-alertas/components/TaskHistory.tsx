import React, { useState, useEffect } from 'react';
import { Card, Table, Badge } from '../../../components/componentsreutilizables';
import { Task, TaskFilters, TaskStatus, TaskHistoryStats } from '../types';
import { getTasks, getPriorityColor, getPriorityLabel, getTaskHistoryStats } from '../api';
import { CheckCircle2, Calendar, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface TaskHistoryProps {
  role: 'entrenador' | 'gimnasio';
}

/**
 * Componente de Historial de Tareas
 * Muestra tareas completadas y canceladas ordenadas cronológicamente
 * 
 * FASE FUTURA - Estadísticas de Productividad:
 * Este componente se expandirá para incluir:
 * - Métricas de productividad: tareas completadas por día/semana/mes
 * - Tiempo promedio de completación por prioridad
 * - Gráficos de tendencias de productividad
 * - Análisis de patrones: días más productivos, horas pico, etc.
 * - Comparativas de rendimiento entre períodos
 * - Exportación de reportes de productividad
 */
export const TaskHistory: React.FC<TaskHistoryProps> = ({ role }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TaskHistoryStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
    loadStats();
  }, [role]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      // Mostrar tareas completadas y canceladas juntas
      const filters: TaskFilters = {
        role,
        status: ['completada', 'cancelada'],
      };
      const data = await getTasks(filters);
      // Ordenar por fecha de completado o actualización (más recientes primero)
      const sorted = data.sort((a, b) => {
        const dateA = a.completedAt || a.updatedAt;
        const dateB = b.completedAt || b.updatedAt;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
      setTasks(sorted);
    } catch (error) {
      console.error('Error cargando historial:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const statistics = await getTaskHistoryStats(role);
      setStats(statistics);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setStatsLoading(false);
    }
  };


  const columns = [
    {
      key: 'title',
      label: 'Tarea',
      render: (value: string, row: Task) => (
        <div className="flex flex-col">
          <span className="font-semibold">{value}</span>
          {row.description && (
            <span className="text-sm text-gray-500 mt-1">{row.description}</span>
          )}
        </div>
      ),
    },
    {
      key: 'priority',
      label: 'Prioridad',
      render: (value: Task['priority']) => (
        <Badge className={getPriorityColor(value)}>
          {getPriorityLabel(value)}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value: TaskStatus) => {
        const statusConfig = {
          'pendiente': { label: 'Pendiente', color: 'text-yellow-600' },
          'en-progreso': { label: 'En Progreso', color: 'text-blue-600' },
          'completada': { label: 'Completada', color: 'text-green-600' },
          'cancelada': { label: 'Cancelada', color: 'text-gray-600' },
        };
        const config = statusConfig[value] || statusConfig['pendiente'];
        return <span className={config.color}>{config.label}</span>;
      },
    },
    {
      key: 'completedAt',
      label: 'Fecha de Finalización',
      render: (value: Date | string | undefined, row: Task) => {
        const date = value || row.updatedAt;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>
              {new Date(date).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Creada',
      render: (value: Date | string) => (
        <span className="text-sm text-gray-500">
          {new Date(value).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
  ];

  const weekComparison = stats 
    ? stats.completedThisWeek - stats.completedPreviousWeek 
    : 0;
  const weekTrend = weekComparison > 0 ? 'up' : weekComparison < 0 ? 'down' : 'neutral';

  return (
    <Card className="bg-white shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Historial de Tareas
        </h2>
        <p className="text-gray-600">
          Registro de todas las tareas y alertas resueltas
        </p>
      </div>

      {/* Bloque de Estadísticas */}
      {!statsLoading && stats && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Estadísticas semanales */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Esta semana
                </span>
                {weekTrend === 'up' && (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                )}
                {weekTrend === 'down' && (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.completedThisWeek}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                vs {stats.completedPreviousWeek} semana anterior
              </p>
            </div>

            {/* Porcentaje completadas */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-600 block mb-2">
                Completadas
              </span>
              <p className="text-2xl font-bold text-green-600">
                {stats.completedPercentage}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.completedCount} tareas
              </p>
            </div>

            {/* Porcentaje canceladas */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-600 block mb-2">
                Canceladas
              </span>
              <p className="text-2xl font-bold text-gray-600">
                {stats.cancelledPercentage}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.cancelledCount} tareas
              </p>
            </div>
          </div>

          {/* Placeholder para gráfico futuro */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 border-dashed">
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm font-medium">
                Gráfico de productividad por día (próximamente)
              </span>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              Aquí se mostrará un gráfico simple con la evolución diaria de tareas completadas
            </p>
          </div>
        </div>
      )}

      {/* Listado de tareas */}
      <Table
        data={tasks}
        columns={columns}
        loading={loading}
        emptyMessage={
          <div className="text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">
              No hay tareas resueltas aún
            </p>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Aquí aparecerán las tareas y alertas que hayas completado o cancelado, 
              ordenadas de más reciente a más antigua. Una vez que resuelvas algunas tareas, 
              podrás ver tu historial y estadísticas de productividad aquí.
            </p>
          </div>
        }
      />
    </Card>
  );
};

