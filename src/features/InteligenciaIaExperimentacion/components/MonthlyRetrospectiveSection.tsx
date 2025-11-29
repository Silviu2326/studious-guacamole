import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Select } from '../../../components/componentsreutilizables';
import {
  MonthlyRetrospective,
  MonthlyAchievement,
  NextFocus,
} from '../types';
import {
  getMonthlyRetrospectiveService,
  generateMonthlyRetrospectiveService,
  getMonthlyRetrospectivesHistoryService,
} from '../services/intelligenceService';
import {
  Trophy,
  Target,
  TrendingUp,
  Sparkles,
  Loader2,
  RefreshCw,
  Calendar,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Rocket,
  Award,
  Zap,
  BarChart3,
  MessageSquareHeart,
} from 'lucide-react';

interface MonthlyRetrospectiveSectionProps {
  trainerId?: string;
}

const categoryIcons = {
  marketing: BarChart3,
  ventas: TrendingUp,
  comunidad: MessageSquareHeart,
  experimentacion: Sparkles,
  personalizacion: Zap,
  retencion: Award,
  otro: Lightbulb,
};

const categoryColors = {
  marketing: 'text-blue-600 bg-blue-50 border-blue-200',
  ventas: 'text-green-600 bg-green-50 border-green-200',
  comunidad: 'text-purple-600 bg-purple-50 border-purple-200',
  experimentacion: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  personalizacion: 'text-amber-600 bg-amber-50 border-amber-200',
  retencion: 'text-rose-600 bg-rose-50 border-rose-200',
  otro: 'text-slate-600 bg-slate-50 border-slate-200',
};

const impactColors = {
  high: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  medium: 'text-amber-600 bg-amber-50 border-amber-200',
  low: 'text-slate-600 bg-slate-50 border-slate-200',
};

const priorityColors = {
  high: 'text-red-600 bg-red-50 border-red-200',
  medium: 'text-amber-600 bg-amber-50 border-amber-200',
  low: 'text-slate-600 bg-slate-50 border-slate-200',
};

const performanceColors = {
  excellent: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  good: 'text-blue-600 bg-blue-50 border-blue-200',
  average: 'text-amber-600 bg-amber-50 border-amber-200',
  'needs-improvement': 'text-red-600 bg-red-50 border-red-200',
};

export const MonthlyRetrospectiveSection: React.FC<MonthlyRetrospectiveSectionProps> = ({
  trainerId,
}) => {
  const [retrospective, setRetrospective] = useState<MonthlyRetrospective | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    loadRetrospective();
  }, [selectedMonth, selectedYear, trainerId]);

  const loadRetrospective = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const response = await getMonthlyRetrospectiveService({
        month: selectedMonth,
        year: selectedYear,
        trainerId,
        generateIfNotExists: false,
      });
      setRetrospective(response.retrospective);
    } catch (error) {
      console.error('Error cargando retrospectiva mensual', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setHasError(false);
      const response = await generateMonthlyRetrospectiveService({
        month: selectedMonth,
        year: selectedYear,
        trainerId,
        includeAchievements: true,
        includeNextFoci: true,
      });
      setRetrospective(response.retrospective);
    } catch (error) {
      console.error('Error generando retrospectiva', error);
      setHasError(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getMonthOptions = () => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months.map((month, index) => ({
      value: (index + 1).toString(),
      label: month,
    }));
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 2; i--) {
      years.push({ value: i.toString(), label: i.toString() });
    }
    return years;
  };

  if (isLoading) {
    return (
      <Card className="p-12 flex items-center justify-center bg-white shadow-sm border border-slate-200/70">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="animate-spin" size={20} />
          Cargando retrospectiva mensual...
        </div>
      </Card>
    );
  }

  if (hasError) {
    return (
      <Card className="p-8 bg-white shadow-sm border border-red-200">
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">Error al cargar la retrospectiva</p>
        </div>
        <Button onClick={loadRetrospective} variant="secondary" size="sm">
          Reintentar
        </Button>
      </Card>
    );
  }

  if (!retrospective) {
    return (
      <Card className="p-8 bg-white shadow-sm border border-slate-200/70">
        <div className="text-center">
          <Calendar className="mx-auto mb-4 text-slate-400" size={48} />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No hay retrospectiva para este período
          </h3>
          <p className="text-sm text-slate-600 mb-6">
            Genera una retrospectiva mensual para ver tus logros y próximos focos.
          </p>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Generando...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generar Retrospectiva
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Retrospectiva Mensual</h2>
          <p className="text-sm text-slate-600 mt-1">
            Celebra tus logros y marca tus próximos focos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={selectedMonth.toString()}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            options={getMonthOptions()}
            className="w-32"
          />
          <Select
            value={selectedYear.toString()}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            options={getYearOptions()}
            className="w-24"
          />
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            variant="secondary"
            size="sm"
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={14} />
                Generando...
              </>
            ) : (
              <>
                <RefreshCw size={14} />
                Regenerar
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Resumen general */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200/50 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {retrospective.month}
            </h3>
            <p className="text-sm text-slate-600">
              {formatDate(retrospective.period.startDate)} - {formatDate(retrospective.period.endDate)}
            </p>
          </div>
          <Badge
            className={performanceColors[retrospective.summary.overallPerformance]}
          >
            {retrospective.summary.overallPerformance === 'excellent' ? 'Excelente' :
             retrospective.summary.overallPerformance === 'good' ? 'Bueno' :
             retrospective.summary.overallPerformance === 'average' ? 'Promedio' : 'Mejorable'}
          </Badge>
        </div>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="text-amber-500" size={20} />
            <span className="text-sm font-medium text-slate-700">Puntuación de Rendimiento</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold text-slate-900">
              {retrospective.summary.performanceScore}
            </div>
            <div className="text-sm text-slate-600">/ 100</div>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-base text-slate-700 leading-relaxed">
            {retrospective.summary.motivationalMessage}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {retrospective.metrics.totalAchievements}
            </div>
            <div className="text-xs text-slate-600">Logros</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600">
              {retrospective.metrics.highImpactAchievements}
            </div>
            <div className="text-xs text-slate-600">Alto Impacto</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {retrospective.metrics.totalFoci}
            </div>
            <div className="text-xs text-slate-600">Próximos Focos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {retrospective.metrics.highPriorityFoci}
            </div>
            <div className="text-xs text-slate-600">Alta Prioridad</div>
          </div>
        </div>
      </Card>

      {/* Logros */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="text-amber-500" size={20} />
          <h3 className="text-lg font-semibold text-slate-900">Logros del Mes</h3>
          <Badge variant="secondary" className="ml-2">
            {retrospective.achievements.length}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {retrospective.achievements.map((achievement) => {
            const CategoryIcon = categoryIcons[achievement.category] || categoryIcons.otro;
            return (
              <Card
                key={achievement.id}
                className="p-5 bg-white border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${categoryColors[achievement.category]}`}>
                    <CategoryIcon size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900">{achievement.title}</h4>
                      <Badge className={impactColors[achievement.impact]}>
                        {achievement.impact === 'high' ? 'Alto' :
                         achievement.impact === 'medium' ? 'Medio' : 'Bajo'}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{achievement.description}</p>
                  </div>
                </div>
                {achievement.metric && (
                  <div className="mb-3 p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-slate-900">
                        {achievement.metric.value}
                      </span>
                      {achievement.metric.unit && (
                        <span className="text-sm text-slate-600">{achievement.metric.unit}</span>
                      )}
                      {achievement.metric.change !== undefined && (
                        <span className={`text-sm font-medium ${
                          achievement.metric.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {achievement.metric.change >= 0 ? '+' : ''}{achievement.metric.change}%
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">{achievement.metric.name}</div>
                  </div>
                )}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-900">{achievement.celebrationMessage}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Próximos Focos */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="text-indigo-500" size={20} />
          <h3 className="text-lg font-semibold text-slate-900">Próximos Focos</h3>
          <Badge variant="secondary" className="ml-2">
            {retrospective.nextFoci.length}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {retrospective.nextFoci.map((focus) => {
            const CategoryIcon = categoryIcons[focus.category] || categoryIcons.otro;
            return (
              <Card
                key={focus.id}
                className="p-5 bg-white border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${categoryColors[focus.category]}`}>
                    <CategoryIcon size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900">{focus.title}</h4>
                      <Badge className={priorityColors[focus.priority]}>
                        {focus.priority === 'high' ? 'Alta' :
                         focus.priority === 'medium' ? 'Media' : 'Baja'}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{focus.description}</p>
                  </div>
                </div>
                <div className="mb-3 p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm font-medium text-slate-700 mb-1">Por qué es importante:</p>
                  <p className="text-sm text-slate-600">{focus.rationale}</p>
                </div>
                <div className="mb-3">
                  <p className="text-xs font-medium text-slate-700 mb-2">Acciones sugeridas:</p>
                  <ul className="space-y-1">
                    {focus.suggestedActions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Rocket size={14} className="text-indigo-600" />
                    <span className="text-xs font-medium text-indigo-900">Impacto Esperado</span>
                  </div>
                  <p className="text-sm text-indigo-700">
                    {focus.expectedImpact.metric}: +{focus.expectedImpact.expectedImprovement}% en {focus.expectedImpact.timeframe}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Insights y Recomendaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 bg-white border border-slate-200/70 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="text-amber-500" size={18} />
            <h3 className="font-semibold text-slate-900">Insights Clave</h3>
          </div>
          <ul className="space-y-2">
            {retrospective.insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5 bg-white border border-slate-200/70 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-indigo-500" size={18} />
            <h3 className="font-semibold text-slate-900">Recomendaciones</h3>
          </div>
          <ul className="space-y-2">
            {retrospective.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                <ArrowRight size={14} className="text-indigo-500 mt-1 flex-shrink-0" />
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

