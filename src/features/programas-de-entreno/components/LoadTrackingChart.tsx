import { memo, useMemo } from 'react';
import { AlertTriangle, Target, TrendingUp } from 'lucide-react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import type { DayPlan } from '../types';

type LoadTrackingChartProps = {
  weekDays: readonly string[];
  weeklyPlan: Record<string, DayPlan>;
  weeklyTargets?: {
    duration: number;
    calories: number;
  };
  dailyTargets?: Record<string, { duration?: number; calories?: number }>;
};

const parseFirstNumber = (value: string) => {
  const match = value.match(/\d+(?:[.,]\d+)?/);
  return match ? Number(match[0].replace(',', '.')) : null;
};

function LoadTrackingChartComponent({
  weekDays,
  weeklyPlan,
  weeklyTargets,
  dailyTargets,
}: LoadTrackingChartProps) {
  // Calcular datos diarios
  const dailyData = useMemo(() => {
    return weekDays.map((day) => {
      const plan = weeklyPlan[day];
      const totalMinutes = plan?.sessions.reduce((total, session) => total + (parseFirstNumber(session.duration) ?? 0), 0) ?? 0;
      const calories = Math.round(totalMinutes * 8);
      
      const dayTarget = dailyTargets?.[day];
      const targetDuration = dayTarget?.duration ?? (weeklyTargets ? weeklyTargets.duration / 7 : null);
      const targetCalories = dayTarget?.calories ?? (weeklyTargets ? weeklyTargets.calories / 7 : null);
      
      return {
        day,
        duration: totalMinutes,
        calories,
        targetDuration,
        targetCalories,
        exceedsDuration: targetDuration ? totalMinutes > targetDuration : false,
        exceedsCalories: targetCalories ? calories > targetCalories : false,
      };
    });
  }, [weekDays, weeklyPlan, weeklyTargets, dailyTargets]);

  // Calcular totales semanales
  const weeklyTotals = useMemo(() => {
    const totalDuration = dailyData.reduce((sum, d) => sum + d.duration, 0);
    const totalCalories = dailyData.reduce((sum, d) => sum + d.calories, 0);
    
    return {
      duration: totalDuration,
      calories: totalCalories,
      exceedsDuration: weeklyTargets ? totalDuration > weeklyTargets.duration : false,
      exceedsCalories: weeklyTargets ? totalCalories > weeklyTargets.calories : false,
    };
  }, [dailyData, weeklyTargets]);

  // Encontrar el máximo para escalar el gráfico
  const maxDuration = useMemo(() => {
    const maxDaily = Math.max(...dailyData.map(d => d.duration), 0);
    const maxTarget = Math.max(...dailyData.map(d => d.targetDuration ?? 0), weeklyTargets?.duration ?? 0);
    return Math.max(maxDaily, maxTarget) * 1.1;
  }, [dailyData, weeklyTargets]);

  const maxCalories = useMemo(() => {
    const maxDaily = Math.max(...dailyData.map(d => d.calories), 0);
    const maxTarget = Math.max(...dailyData.map(d => d.targetCalories ?? 0), weeklyTargets?.calories ?? 0);
    return Math.max(maxDaily, maxTarget) * 1.1;
  }, [dailyData, weeklyTargets]);

  if (!weeklyTargets) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Seguimiento de Carga
          </h3>
        </div>
        {(weeklyTotals.exceedsDuration || weeklyTotals.exceedsCalories) && (
          <Badge variant="destructive" size="sm">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Sobrecarga detectada
          </Badge>
        )}
      </div>

      {/* Gráfico de Duración Diaria */}
      <Card className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Duración Diaria (minutos)
          </h4>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-indigo-500" />
              <span>Objetivo diario: {Math.round((weeklyTargets.duration / 7) * 10) / 10} min</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-indigo-200" />
              <span>Objetivo semanal: {weeklyTargets.duration} min</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {dailyData.map((data) => {
            const barHeight = maxDuration > 0 ? (data.duration / maxDuration) * 100 : 0;
            const targetLineHeight = maxDuration > 0 && data.targetDuration ? (data.targetDuration / maxDuration) * 100 : 0;
            const weeklyTargetLineHeight = maxDuration > 0 ? (weeklyTargets.duration / 7 / maxDuration) * 100 : 0;
            
            return (
              <div key={data.day} className="relative">
                <div className="flex items-center gap-2">
                  <div className="w-16 text-xs font-medium text-slate-600 dark:text-slate-400">
                    {data.day.substring(0, 3)}
                  </div>
                  <div className="flex-1 relative h-8 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
                    {/* Línea de referencia objetivo semanal (promedio diario) */}
                    {weeklyTargetLineHeight > 0 && (
                      <div
                        className="absolute left-0 right-0 border-t-2 border-dashed border-indigo-300 dark:border-indigo-600 z-10"
                        style={{ bottom: `${weeklyTargetLineHeight}%` }}
                        title={`Objetivo diario: ${Math.round((weeklyTargets.duration / 7) * 10) / 10} min`}
                      />
                    )}
                    {/* Línea de referencia objetivo diario específico */}
                    {targetLineHeight > 0 && targetLineHeight !== weeklyTargetLineHeight && (
                      <div
                        className="absolute left-0 right-0 border-t-2 border-dashed border-indigo-500 dark:border-indigo-400 z-20"
                        style={{ bottom: `${targetLineHeight}%` }}
                        title={`Objetivo específico: ${data.targetDuration} min`}
                      />
                    )}
                    {/* Barra de duración actual */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 rounded transition-all ${
                        data.exceedsDuration
                          ? 'bg-red-500 dark:bg-red-600'
                          : 'bg-emerald-500 dark:bg-emerald-600'
                      }`}
                      style={{ height: `${barHeight}%` }}
                      title={`${data.duration} min${data.exceedsDuration ? ' (excede objetivo)' : ''}`}
                    />
                  </div>
                  <div className="w-12 text-right text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {data.duration}
                  </div>
                  {data.exceedsDuration && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* Resumen semanal */}
        <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-900/50 p-3">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Total semanal:
          </span>
          <div className="flex items-center gap-4">
            <span className={`text-sm font-semibold ${weeklyTotals.exceedsDuration ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-slate-100'}`}>
              {weeklyTotals.duration} min
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Objetivo: {weeklyTargets.duration} min
            </span>
            {weeklyTotals.exceedsDuration && (
              <Badge variant="destructive" size="xs">
                +{weeklyTotals.duration - weeklyTargets.duration} min
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Gráfico de Calorías Diarias */}
      <Card className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Calorías Diarias (kcal)
          </h4>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-amber-500" />
              <span>Objetivo diario: {Math.round((weeklyTargets.calories / 7) * 10) / 10} kcal</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-amber-200" />
              <span>Objetivo semanal: {weeklyTargets.calories} kcal</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {dailyData.map((data) => {
            const barHeight = maxCalories > 0 ? (data.calories / maxCalories) * 100 : 0;
            const targetLineHeight = maxCalories > 0 && data.targetCalories ? (data.targetCalories / maxCalories) * 100 : 0;
            const weeklyTargetLineHeight = maxCalories > 0 ? (weeklyTargets.calories / 7 / maxCalories) * 100 : 0;
            
            return (
              <div key={data.day} className="relative">
                <div className="flex items-center gap-2">
                  <div className="w-16 text-xs font-medium text-slate-600 dark:text-slate-400">
                    {data.day.substring(0, 3)}
                  </div>
                  <div className="flex-1 relative h-8 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
                    {/* Línea de referencia objetivo semanal (promedio diario) */}
                    {weeklyTargetLineHeight > 0 && (
                      <div
                        className="absolute left-0 right-0 border-t-2 border-dashed border-amber-300 dark:border-amber-600 z-10"
                        style={{ bottom: `${weeklyTargetLineHeight}%` }}
                        title={`Objetivo diario: ${Math.round((weeklyTargets.calories / 7) * 10) / 10} kcal`}
                      />
                    )}
                    {/* Línea de referencia objetivo diario específico */}
                    {targetLineHeight > 0 && targetLineHeight !== weeklyTargetLineHeight && (
                      <div
                        className="absolute left-0 right-0 border-t-2 border-dashed border-amber-500 dark:border-amber-400 z-20"
                        style={{ bottom: `${targetLineHeight}%` }}
                        title={`Objetivo específico: ${data.targetCalories} kcal`}
                      />
                    )}
                    {/* Barra de calorías actual */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 rounded transition-all ${
                        data.exceedsCalories
                          ? 'bg-red-500 dark:bg-red-600'
                          : 'bg-amber-500 dark:bg-amber-600'
                      }`}
                      style={{ height: `${barHeight}%` }}
                      title={`${data.calories} kcal${data.exceedsCalories ? ' (excede objetivo)' : ''}`}
                    />
                  </div>
                  <div className="w-12 text-right text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {data.calories}
                  </div>
                  {data.exceedsCalories && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* Resumen semanal */}
        <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-900/50 p-3">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Total semanal:
          </span>
          <div className="flex items-center gap-4">
            <span className={`text-sm font-semibold ${weeklyTotals.exceedsCalories ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-slate-100'}`}>
              {weeklyTotals.calories} kcal
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Objetivo: {weeklyTargets.calories} kcal
            </span>
            {weeklyTotals.exceedsCalories && (
              <Badge variant="destructive" size="xs">
                +{weeklyTotals.calories - weeklyTargets.calories} kcal
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export const LoadTrackingChart = memo(LoadTrackingChartComponent);

