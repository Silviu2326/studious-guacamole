import React, { useState, useEffect, useMemo } from 'react';
import { Objective, GlobalFilters } from '../types';
import { getObjectives } from '../api/objectives';
import { Card, Badge, Button } from '../../../components/componentsreutilizables';
import { Target, CheckCircle, AlertCircle, XCircle, Clock, Loader2, Calendar, TrendingUp, BarChart3, Award, Milestone, Filter } from 'lucide-react';

interface GoalTrackerProps {
  role: 'entrenador' | 'gimnasio';
  globalFilters?: GlobalFilters;
  periodo?: 'semana' | 'mes' | 'trimestre';
}

interface Milestone {
  id: string;
  objectiveId: string;
  name: string;
  targetValue: number;
  achieved: boolean;
  achievedAt?: string;
}

export const GoalTracker: React.FC<GoalTrackerProps> = ({ role, globalFilters, periodo }) => {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'cards' | 'analysis'>('cards');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadObjectives();
  }, [role]);

  const loadObjectives = async () => {
    setLoading(true);
    try {
      const data = await getObjectives(undefined, role);
      setObjectives(data);
    } catch (error) {
      console.error('Error loading objectives:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar objetivos
  const filteredObjectives = useMemo(() => {
    if (filterStatus === 'all') return objectives;
    return objectives.filter(obj => obj.status === filterStatus);
  }, [objectives, filterStatus]);

  // Generar milestones/hitos para un objetivo
  const generateMilestones = (objective: Objective): Milestone[] => {
    const milestones: Milestone[] = [];
    const totalSteps = 4;
    for (let i = 1; i <= totalSteps; i++) {
      const milestoneValue = (objective.targetValue / totalSteps) * i;
      milestones.push({
        id: `${objective.id}-milestone-${i}`,
        objectiveId: objective.id,
        name: `Hito ${i}/${totalSteps}`,
        targetValue: milestoneValue,
        achieved: objective.currentValue >= milestoneValue,
        achievedAt: objective.currentValue >= milestoneValue ? new Date().toISOString() : undefined,
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

    return { total, avgProgress, onTrack };
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
            
            return (
              <Card key={objective.id} className="p-6 bg-white shadow-sm">
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
                        <span className="text-xs text-gray-500">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          Vence: {new Date(objective.deadline).toLocaleDateString('es-ES')}
                        </span>
                        {projection.daysRemaining > 0 && (
                          <span className={`text-xs font-medium ${
                            projection.onTrack ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {projection.daysRemaining} días restantes
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline de milestones */}
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div className="space-y-4 relative">
                    {milestones.map((milestone, index) => (
                      <div key={milestone.id} className="flex items-start gap-4 relative">
                        <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                          milestone.achieved ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                          {milestone.achieved ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="text-sm font-semibold text-gray-900">{milestone.name}</h5>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                {milestone.targetValue.toFixed(0)} {objective.unit}
                              </span>
                              {milestone.achieved && (
                                <Badge variant="green">Alcanzado</Badge>
                              )}
                            </div>
                          </div>
                          {milestone.achievedAt && (
                            <p className="text-xs text-gray-500">
                              Alcanzado el {new Date(milestone.achievedAt).toLocaleDateString('es-ES')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progreso general */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">
                      Progreso: {objective.progress.toFixed(0)}%
                    </span>
                    <span className="text-gray-600">
                      {objective.currentValue} / {objective.targetValue} {objective.unit}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        objective.progress >= 100 ? 'bg-green-600' :
                        objective.progress >= 75 ? 'bg-blue-600' :
                        objective.progress >= 50 ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}
                      style={{ width: `${Math.min(objective.progress, 100)}%` }}
                    />
                  </div>
                  {projection.daysRemaining > 0 && (
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        Proyección: {projection.projectedProgress.toFixed(0)}%
                      </span>
                      <span className={`font-medium ${
                        projection.onTrack ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {projection.onTrack ? '✓ En buen camino' : '⚠ Requiere atención'}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Vista de Análisis */}
      {viewMode === 'analysis' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Análisis de progreso por objetivo */}
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Velocidad de Progreso</h3>
            </div>
            <div className="space-y-4">
              {filteredObjectives
                .filter(o => o.status === 'in_progress' || o.status === 'at_risk')
                .map((objective) => {
                  const projection = calculateProjection(objective);
                  return (
                    <div key={objective.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-900">{objective.title}</h4>
                        <Badge variant={projection.onTrack ? 'green' : 'yellow'}>
                          {projection.onTrack ? 'En camino' : 'Atrasado'}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Progreso actual</span>
                          <span className="font-semibold">{objective.progress.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              projection.onTrack ? 'bg-green-600' : 'bg-yellow-600'
                            }`}
                            style={{ width: `${Math.min(objective.progress, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">
                            {projection.daysElapsed} días transcurridos
                          </span>
                          <span className="text-gray-500">
                            {projection.daysRemaining} días restantes
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Velocidad: {projection.progressPerDay.toFixed(2)}% por día
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Card>

          {/* Distribución por estado */}
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Distribución por Estado</h3>
            </div>
            <div className="space-y-4">
              {['not_started', 'in_progress', 'at_risk', 'achieved', 'failed'].map((status) => {
                const count = filteredObjectives.filter(o => o.status === status).length;
                const percentage = filteredObjectives.length > 0 ? (count / filteredObjectives.length) * 100 : 0;
                
                return (
                  <div key={status} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 capitalize">
                        {status === 'not_started' ? 'No Iniciado' :
                         status === 'in_progress' ? 'En Progreso' :
                         status === 'at_risk' ? 'En Riesgo' :
                         status === 'achieved' ? 'Alcanzado' : 'Fallido'}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
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
        </div>
      )}

      {/* Vista de Tarjetas (por defecto) */}
      {viewMode === 'cards' && (
        <div className="space-y-4">
          {filteredObjectives.map((objective) => {
            const projection = calculateProjection(objective);
            
            return (
              <Card
                key={objective.id}
                variant="hover"
                className="h-full flex flex-col transition-shadow overflow-hidden"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getStatusIcon(objective.status)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-900 mb-1">
                        {objective.title}
                      </h4>
                      {objective.description && (
                        <p className="text-sm text-gray-500 mb-2">
                          {objective.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 flex-wrap">
                        {getStatusBadge(objective.status)}
                        <span className="text-xs text-gray-500">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          Vence: {new Date(objective.deadline).toLocaleDateString('es-ES')}
                        </span>
                        {projection.daysRemaining > 0 && (
                          <span className={`text-xs font-medium ${
                            projection.onTrack ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {projection.daysRemaining} días restantes
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Progreso: {objective.progress.toFixed(0)}%
                    </span>
                    <span className="text-gray-600">
                      {objective.currentValue} / {objective.targetValue} {objective.unit}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        objective.progress >= 100 ? 'bg-green-600' :
                        objective.progress >= 75 ? 'bg-blue-600' :
                        objective.progress >= 50 ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}
                      style={{ width: `${Math.min(objective.progress, 100)}%` }}
                    />
                  </div>
                  {projection.daysRemaining > 0 && (
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Proyección de finalización</span>
                        <span className={`font-semibold ${
                          projection.onTrack ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {projection.projectedProgress.toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {projection.onTrack ? (
                          <>
                            <TrendingUp className="w-3 h-3 text-green-600" />
                            <span>El objetivo está en buen camino</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 text-yellow-600" />
                            <span>Se requiere acelerar el progreso</span>
                          </>
                        )}
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

