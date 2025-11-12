import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables/Card';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { getTemplateAnalytics } from '../api';
import { Template } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  Award, 
  Loader2,
  AlertCircle,
  PieChart,
} from 'lucide-react';

export const TemplateAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTemplateAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError('Error al cargar las estadísticas');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando estadísticas...</p>
      </Card>
    );
  }

  if (error || !analytics) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
        <p className="text-gray-600 mb-4">{error || 'No se pudieron cargar las estadísticas'}</p>
      </Card>
    );
  }

  // Calcular el máximo para normalizar las barras
  const maxAssignments = Math.max(...analytics.monthlyTrends.map((t: any) => t.assignments));

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Plantillas</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalTemplates}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Asignaciones</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalAssignments}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Promedio por Plantilla</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.avgAssignments}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Top Plantilla</p>
              <p className="text-lg font-semibold text-gray-900 truncate max-w-[150px]">
                {analytics.topTemplates[0]?.name || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                {analytics.topTemplates[0]?.assignmentCount || 0} asignaciones
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendencias mensuales */}
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tendencias Mensuales</h3>
              <p className="text-sm text-gray-600">Evolución de asignaciones</p>
            </div>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {analytics.monthlyTrends.map((trend: any, index: number) => {
              const percentage = (trend.assignments / maxAssignments) * 100;
              const isIncreasing = index > 0 && trend.assignments > analytics.monthlyTrends[index - 1].assignments;
              
              return (
                <div key={trend.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{trend.month}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600">{trend.assignments} asignaciones</span>
                      {isIncreasing && (
                        <span className="text-green-600 text-xs flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          ↑
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Distribución por duración */}
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Distribución por Duración</h3>
              <p className="text-sm text-gray-600">Plantillas por semanas</p>
            </div>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {Object.entries(analytics.durationDistribution).map(([duration, count]: [string, any]) => {
              const percentage = (count / analytics.totalTemplates) * 100;
              
              return (
                <div key={duration} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{duration}</span>
                    <span className="text-gray-600">{count} plantillas ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Top plantillas más asignadas */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Plantillas Más Asignadas</h3>
            <p className="text-sm text-gray-600">Top 5 plantillas por asignaciones</p>
          </div>
          <Award className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="space-y-4">
          {analytics.topTemplates.map((template: Template, index: number) => (
            <div
              key={template.id}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{template.name}</h4>
                  {template.description && (
                    <p className="text-sm text-gray-600 line-clamp-1">{template.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="blue" size="sm">
                      {template.durationWeeks} semanas
                    </Badge>
                    {template.tags.slice(0, 2).map((tag, i) => (
                      <Badge key={i} variant="outline" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{template.assignmentCount || 0}</p>
                  <p className="text-xs text-gray-600">asignaciones</p>
                </div>
                {index === 0 && (
                  <Award className="w-6 h-6 text-yellow-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Estadísticas por tags */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Popularidad por Categoría</h3>
            <p className="text-sm text-gray-600">Asignaciones por etiqueta</p>
          </div>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(analytics.tagStats)
            .sort(([, a]: [string, any], [, b]: [string, any]) => b - a)
            .map(([tag, count]: [string, any]) => {
              const maxTagCount = Math.max(...Object.values(analytics.tagStats));
              const percentage = (count / maxTagCount) * 100;
              
              return (
                <div key={tag} className="p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="blue" size="sm" className="capitalize">
                      {tag}
                    </Badge>
                    <span className="text-lg font-bold text-gray-900">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </Card>
    </div>
  );
};





















