import React, { useState, useEffect, useMemo } from 'react';
import { Objective } from '../types';
import { getObjectives } from '../api/objectives';
import { Card, Badge, Button } from '../../../components/componentsreutilizables';
import { Target, CheckCircle, AlertCircle, XCircle, Clock, Loader2, Calendar, TrendingUp, BarChart3, Award, Milestone, Filter, PieChart, Activity, Zap } from 'lucide-react';

interface GoalTrackerProps {
  role: 'entrenador' | 'gimnasio';
  compact?: boolean; // Para versión reducida en Dashboard
  category?: string; // Categoría opcional para filtrar objetivos
  onError?: (errorMessage: string) => void;
}

interface Milestone {
  id: string;
  objectiveId: string;
  name: string;
  targetValue: number;
  achieved: boolean;
  achievedAt?: string;
  date?: string;
}

export const GoalTracker: React.FC<GoalTrackerProps> = ({ role, compact = false, category, onError }) => {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'cards' | 'analysis'>('cards');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadObjectives();
  }, [role, category]);

  const loadObjectives = async () => {
    setLoading(true);
    try {
      // Si hay una categoría, filtrar por ella
      const filters = category && category !== 'all' 
        ? { tipo: category, category: category } 
        : undefined;
      const data = await getObjectives(filters, role);
      setObjectives(data);
    } catch (error) {
      console.error('Error loading objectives:', error);
      const errorMessage = error instanceof Error ? error.message : 'No se pudieron cargar los objetivos';
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filtrar objetivos
  const filteredObjectives = useMemo(() => {
    let filtered = objectives;
    
    // Filtrar por estado
    if (filterStatus !== 'all') {
      filtered = filtered.filter(obj => obj.status === filterStatus);
    }
    
    // Filtrar por categoría si se proporciona
    if (category && category !== 'all') {
      filtered = filtered.filter(obj => 
        obj.tipo === category || 
        obj.category === category || 
        obj.metric === category
      );
    }
    
    return filtered;
  }, [objectives, filterStatus, category]);

  // Generar milestones/hitos para un objetivo con fechas distribuidas
  const generateMilestones = (objective: Objective): Milestone[] => {
    const milestones: Milestone[] = [];
    const totalSteps = 4;
    const startDate = new Date(objective.fechaInicio || objective.createdAt);
    const endDate = new Date(objective.deadline);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 1; i <= totalSteps; i++) {
      const milestoneValue = (objective.targetValue / totalSteps) * i;
      const milestoneDate = new Date(startDate);
      milestoneDate.setDate(startDate.getDate() + Math.floor((totalDays / totalSteps) * i));
      
      milestones.push({
        id: `${objective.id}-milestone-${i}`,
        objectiveId: objective.id,
        name: `Hito ${i}/${totalSteps}`,
        targetValue: milestoneValue,
        achieved: objective.currentValue >= milestoneValue,
        achievedAt: objective.currentValue >= milestoneValue ? new Date().toISOString() : undefined,
        date: milestoneDate.toISOString(),
      });
    }
    return milestones;
  };

  // Calcular proyección de finalización (función auxiliar, no hook)
  const calculateProjection = (objective: Objective) => {
    const now = new Date();
    const deadline = new Date(objective.deadline);
    const daysElapsed = Math.max(1, Math.floor((now.getTime() - new Date(objective.createdAt).getTime()) / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    const progressPerDay = objective.progress / daysElapsed;
    const projectedProgress = progressPerDay * (daysElapsed + daysRemaining);
    
    return {
      daysElapsed,
      daysRemaining,
      progressPerDay,
      projectedProgress: Math.min(projectedProgress, 100),
      onTrack: projectedProgress >= 100,
    };
  };

  // Estadísticas globales (hook - debe ir antes del return condicional)
  const stats = useMemo(() => {
    const total = filteredObjectives.length;
    const avgProgress = total > 0
      ? filteredObjectives.reduce((acc, o) => acc + o.progress, 0) / total
      : 0;
    const onTrack = filteredObjectives.filter(o => {
      const proj = calculateProjection(o);
      return proj.onTrack && o.status !== 'achieved' && o.status !== 'failed';
    }).length;

    // Calcular tiempo restante medio
    const now = new Date();
    const activeObjectives = filteredObjectives.filter(
      o => o.status !== 'achieved' && o.status !== 'completed' && o.status !== 'failed'
    );
    const avgDaysRemaining = activeObjectives.length > 0
      ? activeObjectives.reduce((acc, o) => {
          const deadline = new Date(o.deadline);
          const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return acc + Math.max(0, daysRemaining);
        }, 0) / activeObjectives.length
      : 0;

    // Distribución por estado
    const statusDistribution = {
      not_started: filteredObjectives.filter(o => o.status === 'not_started').length,
      in_progress: filteredObjectives.filter(o => o.status === 'in_progress' || o.status === 'on_track').length,
      at_risk: filteredObjectives.filter(o => o.status === 'at_risk').length,
      achieved: filteredObjectives.filter(o => o.status === 'achieved' || o.status === 'completed').length,
      failed: filteredObjectives.filter(o => o.status === 'failed').length,
    };

    return { total, avgProgress, onTrack, avgDaysRemaining, statusDistribution };
  }, [filteredObjectives]);

  const getStatusIcon = (status: Objective['status']) => {
    switch (status) {
      case 'achieved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'at_risk':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Target className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: Objective['status']) => {
    const statusConfig = {
      not_started: { label: 'No iniciado', variant: 'blue' as const },
      in_progress: { label: 'En progreso', variant: 'purple' as const },
      achieved: { label: 'Alcanzado', variant: 'green' as const },
      at_risk: { label: 'En riesgo', variant: 'yellow' as const },
      failed: { label: 'Fallido', variant: 'red' as const },
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Return condicional DESPUÉS de todos los hooks
  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  const selectedObjectiveData = selectedObjective 
    ? filteredObjectives.find(o => o.id === selectedObjective)
    : null;

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Seguimiento de Objetivos</h2>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-1.5 text-sm"
          >
            <option value="all">Todos</option>
            <option value="not_started">No iniciado</option>
            <option value="in_progress">En progreso</option>
            <option value="at_risk">En riesgo</option>
            <option value="achieved">Alcanzado</option>
            <option value="failed">Fallido</option>
          </select>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-white shadow-sm border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Objetivos Activos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">En Buena Vía</p>
              <p className="text-2xl font-bold text-green-600">{stats.onTrack}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Progreso Promedio</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgProgress.toFixed(0)}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Selector de vista */}
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Vista:</span>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'cards' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tarjetas
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'timeline' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Milestone className="w-4 h-4 inline mr-1" />
              Timeline
            </button>
            <button
              onClick={() => setViewMode('analysis')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'analysis' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-1" />
              Análisis
            </button>
          </div>
        </div>
      </Card>

      {/* Vista Timeline */}
      {viewMode === 'timeline' && (
        <div className="space-y-6">
          {filteredObjectives.map((objective) => {
            const milestones = generateMilestones(objective);
            const projection = calculateProjection(objective);
            const allMilestones = [
              {
                id: `${objective.id}-start`,
                name: 'Inicio',
                date: objective.fechaInicio || objective.createdAt,
                achieved: true,
                type: 'start' as const,
              },
              ...milestones.map(m => ({
                ...m,
                type: 'milestone' as const,
              })),
              {
                id: `${objective.id}-end`,
                name: 'Finalización',
                date: objective.deadline,
                achieved: objective.progress >= 100,
                type: 'end' as const,
                targetValue: objective.targetValue,
              },
            ].sort((a, b) => new Date(a.date || '').getTime() - new Date(b.date || '').getTime());
            
            return (
              <Card key={objective.id} className="p-6 bg-white shadow-sm border-l-4 border-l-blue-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getStatusIcon(objective.status)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        {objective.title}
                      </h4>
                      {objective.description && (
                        <p className="text-sm text-gray-500 mb-2">
                          {objective.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 flex-wrap">
                        {getStatusBadge(objective.status)}
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Inicio: {new Date(objective.fechaInicio || objective.createdAt).toLocaleDateString('es-ES')}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Vence: {new Date(objective.deadline).toLocaleDateString('es-ES')}
                        </span>
                        {projection.daysRemaining > 0 && (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                            projection.onTrack ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {projection.daysRemaining} días restantes
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline de milestones mejorada */}
                <div className="relative pl-8">
                  {/* Línea vertical de la timeline */}
                  <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-500 rounded-full"></div>
                  
                  <div className="space-y-6 relative">
                    {allMilestones.map((milestone, index) => {
                      const isAchieved = milestone.achieved;
                      const milestoneDate = milestone.date ? new Date(milestone.date) : null;
                      const isPast = milestoneDate ? milestoneDate < new Date() : false;
                      
                      return (
                        <div key={milestone.id} className="flex items-start gap-4 relative">
                          {/* Punto en la timeline */}
                          <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                            milestone.type === 'start' 
                              ? 'bg-blue-500 border-blue-600' 
                              : milestone.type === 'end'
                              ? 'bg-purple-500 border-purple-600'
                              : isAchieved
                              ? 'bg-green-500 border-green-600 shadow-lg'
                              : isPast
                              ? 'bg-yellow-500 border-yellow-600'
                              : 'bg-gray-300 border-gray-400'
                          }`}>
                            {milestone.type === 'start' ? (
                              <Zap className="w-4 h-4 text-white" />
                            ) : milestone.type === 'end' ? (
                              <Target className="w-4 h-4 text-white" />
                            ) : isAchieved ? (
                              <CheckCircle className="w-5 h-5 text-white" />
                            ) : (
                              <div className="w-3 h-3 bg-white rounded-full"></div>
                            )}
                          </div>
                          
                          {/* Contenido del milestone */}
                          <div className="flex-1 pt-1 pb-4">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h5 className="text-sm font-semibold text-gray-900">
                                  {milestone.name}
                                </h5>
                                {milestoneDate && (
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {milestoneDate.toLocaleDateString('es-ES', { 
                                      day: 'numeric', 
                                      month: 'short', 
                                      year: 'numeric' 
                                    })}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {milestone.type === 'milestone' && (
                                  <span className="text-xs text-gray-600 font-medium">
                                    {milestone.targetValue?.toFixed(0)} {objective.unit}
                                  </span>
                                )}
                                {isAchieved && (
                                  <Badge variant="green" className="text-xs">Alcanzado</Badge>
                                )}
                                {!isAchieved && isPast && milestone.type === 'milestone' && (
                                  <Badge variant="yellow" className="text-xs">Pendiente</Badge>
                                )}
                              </div>
                            </div>
                            
                            {/* Barra de progreso para milestones */}
                            {milestone.type === 'milestone' && (
                              <div className="mt-2">
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                  <div
                                    className={`h-1.5 rounded-full transition-all ${
                                      isAchieved ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                                    style={{ 
                                      width: `${Math.min(
                                        ((objective.currentValue / (milestone.targetValue || 1)) * 100), 
                                        100
                                      )}%` 
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Resumen de progreso general */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm mb-3">
                    <span className="text-gray-700 font-medium">
                      Progreso General
                    </span>
                    <span className="text-gray-600">
                      {objective.currentValue} / {objective.targetValue} {objective.unit}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-4 rounded-full transition-all duration-500 ${
                        objective.progress >= 100 ? 'bg-green-600' :
                        objective.progress >= 75 ? 'bg-blue-600' :
                        objective.progress >= 50 ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}
                      style={{ width: `${Math.min(objective.progress, 100)}%` }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      Proyección: {projection.projectedProgress.toFixed(0)}%
                    </span>
                    <span className={`font-medium flex items-center gap-1 ${
                      projection.onTrack ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {projection.onTrack ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          En buen camino
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3" />
                          Requiere atención
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Vista de Análisis */}
      {viewMode === 'analysis' && (
        <div className="space-y-6">
          {/* Resumen de métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-white shadow-sm border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Objetivos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4 bg-white shadow-sm border-l-4 border-l-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Progreso Promedio</p>
                  <p className="text-2xl font-bold text-green-600">{stats.avgProgress.toFixed(1)}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4 bg-white shadow-sm border-l-4 border-l-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tiempo Restante Medio</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.avgDaysRemaining > 0 ? Math.round(stats.avgDaysRemaining) : 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">días</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </Card>
            <Card className="p-4 bg-white shadow-sm border-l-4 border-l-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">En Buena Vía</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.onTrack}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-500" />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribución por Estado */}
            <Card className="p-6 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Distribución por Estado</h3>
              </div>
              <div className="space-y-4">
                {Object.entries(stats.statusDistribution).map(([status, count]) => {
                  const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  const statusLabels: Record<string, string> = {
                    not_started: 'No Iniciado',
                    in_progress: 'En Progreso',
                    at_risk: 'En Riesgo',
                    achieved: 'Alcanzado',
                    failed: 'Fallido',
                  };
                  
                  return (
                    <div key={status} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-700 font-medium">
                          {statusLabels[status] || status}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {count}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            status === 'achieved' ? 'bg-green-600' :
                            status === 'in_progress' ? 'bg-blue-600' :
                            status === 'at_risk' ? 'bg-yellow-600' :
                            status === 'failed' ? 'bg-red-600' :
                            'bg-gray-400'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Distribución por Tipo */}
            <Card className="p-6 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Distribución por Tipo</h3>
              </div>
              <div className="space-y-4">
                {(() => {
                  const typeCounts: Record<string, number> = {};
                  filteredObjectives.forEach(obj => {
                    const type = obj.tipo || obj.metric || obj.category || 'General';
                    typeCounts[type] = (typeCounts[type] || 0) + 1;
                  });
                  
                  return Object.entries(typeCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([type, count]) => {
                      const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-700 font-medium capitalize">
                              {type}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">
                                {count}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({percentage.toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className="h-3 rounded-full bg-indigo-600 transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    });
                })()}
              </div>
            </Card>

            {/* Velocidad de Progreso */}
            <Card className="p-6 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Velocidad de Progreso</h3>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredObjectives
                  .filter(o => o.status === 'in_progress' || o.status === 'at_risk' || o.status === 'on_track')
                  .map((objective) => {
                    const projection = calculateProjection(objective);
                    return (
                      <div key={objective.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-900">{objective.title}</h4>
                          <Badge variant={projection.onTrack ? 'green' : 'yellow'}>
                            {projection.onTrack ? 'En camino' : 'Atrasado'}
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Progreso actual</span>
                            <span className="font-semibold">{objective.progress.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full transition-all ${
                                projection.onTrack ? 'bg-green-600' : 'bg-yellow-600'
                              }`}
                              style={{ width: `${Math.min(objective.progress, 100)}%` }}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-white p-2 rounded">
                              <div className="text-gray-500">Transcurridos</div>
                              <div className="font-semibold text-gray-900">{projection.daysElapsed} días</div>
                            </div>
                            <div className="bg-white p-2 rounded">
                              <div className="text-gray-500">Restantes</div>
                              <div className="font-semibold text-gray-900">{projection.daysRemaining} días</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-200">
                            <span className="text-gray-500">Velocidad promedio</span>
                            <span className="font-semibold text-blue-600">
                              {projection.progressPerDay.toFixed(2)}% por día
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Proyección final</span>
                            <span className={`font-semibold ${
                              projection.onTrack ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {projection.projectedProgress.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {filteredObjectives.filter(o => o.status === 'in_progress' || o.status === 'at_risk' || o.status === 'on_track').length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No hay objetivos en progreso para analizar
                  </div>
                )}
              </div>
            </Card>

            {/* Insights Adicionales */}
            <Card className="p-6 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Insights Clave</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-blue-900 mb-1">Objetivos en Buen Camino</h4>
                      <p className="text-xs text-blue-700">
                        {stats.onTrack} de {stats.total} objetivos están avanzando según lo esperado
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-yellow-900 mb-1">Objetivos en Riesgo</h4>
                      <p className="text-xs text-yellow-700">
                        {stats.statusDistribution.at_risk} objetivos requieren atención inmediata
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-green-900 mb-1">Objetivos Completados</h4>
                      <p className="text-xs text-green-700">
                        {stats.statusDistribution.achieved} objetivos han sido alcanzados exitosamente
                      </p>
                    </div>
                  </div>
                </div>
                
                {stats.avgDaysRemaining > 0 && (
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-purple-900 mb-1">Tiempo Promedio Restante</h4>
                        <p className="text-xs text-purple-700">
                          Los objetivos activos tienen un promedio de {Math.round(stats.avgDaysRemaining)} días restantes
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Vista de Tarjetas (por defecto) */}
      {viewMode === 'cards' && (
        <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {filteredObjectives.map((objective) => {
            const projection = calculateProjection(objective);
            const progressColor = 
              objective.progress >= 100 ? 'text-green-600' :
              objective.progress >= 75 ? 'text-blue-600' :
              objective.progress >= 50 ? 'text-yellow-600' :
              'text-red-600';
            
            const statusColorClass = 
              objective.status === 'achieved' || objective.status === 'completed' ? 'border-l-green-500 bg-green-50/30' :
              objective.status === 'at_risk' ? 'border-l-yellow-500 bg-yellow-50/30' :
              objective.status === 'failed' ? 'border-l-red-500 bg-red-50/30' :
              objective.status === 'in_progress' || objective.status === 'on_track' ? 'border-l-blue-500 bg-blue-50/30' :
              'border-l-gray-500 bg-gray-50/30';
            
            return (
              <Card
                key={objective.id}
                variant="hover"
                className={`h-full flex flex-col transition-all overflow-hidden border-l-4 ${statusColorClass}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1 flex-shrink-0">
                      {getStatusIcon(objective.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-gray-900 mb-1 truncate">
                        {objective.title}
                      </h4>
                      {objective.description && !compact && (
                        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                          {objective.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        {getStatusBadge(objective.status)}
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(objective.deadline).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progreso visual mejorado */}
                <div className="mt-4 space-y-3">
                  {/* Barra de progreso principal */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 font-medium">
                        Progreso
                      </span>
                      <span className={`font-bold ${progressColor}`}>
                        {objective.progress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          objective.progress >= 100 ? 'bg-green-600' :
                          objective.progress >= 75 ? 'bg-blue-600' :
                          objective.progress >= 50 ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${Math.min(objective.progress, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{objective.currentValue} {objective.unit}</span>
                      <span>{objective.targetValue} {objective.unit}</span>
                    </div>
                  </div>

                  {/* Indicador circular de progreso (opcional, solo si no es compact) */}
                  {!compact && (
                    <div className="flex items-center justify-center pt-2">
                      <div className="relative w-16 h-16">
                        <svg className="transform -rotate-90 w-16 h-16">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-gray-200"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 28}`}
                            strokeDashoffset={`${2 * Math.PI * 28 * (1 - objective.progress / 100)}`}
                            className={`transition-all duration-300 ${
                              objective.progress >= 100 ? 'text-green-600' :
                              objective.progress >= 75 ? 'text-blue-600' :
                              objective.progress >= 50 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-xs font-bold ${progressColor}`}>
                            {objective.progress.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tipo de objetivo */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Tipo:</span>
                      <span className="font-medium text-gray-700">
                        {objective.tipo || objective.metric || objective.category || 'General'}
                      </span>
                    </div>
                  </div>

                  {/* Proyección y estado */}
                  {projection.daysRemaining > 0 && (
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex justify-between items-center text-xs mb-2">
                        <span className="text-gray-500">Proyección</span>
                        <span className={`font-semibold ${
                          projection.onTrack ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {projection.projectedProgress.toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {projection.onTrack ? (
                          <>
                            <TrendingUp className="w-3 h-3 text-green-600" />
                            <span className="text-green-600">En buen camino</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 text-yellow-600" />
                            <span className="text-yellow-600">Requiere atención</span>
                          </>
                        )}
                        <span className="text-gray-400 ml-auto">
                          {projection.daysRemaining} días restantes
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {filteredObjectives.length === 0 && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Target size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay objetivos registrados</h3>
          <p className="text-gray-600">No se encontraron objetivos para mostrar.</p>
        </Card>
      )}
    </div>
  );
};

