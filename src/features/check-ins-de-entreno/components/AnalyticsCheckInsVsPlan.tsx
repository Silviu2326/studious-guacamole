import React, { useMemo } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { TrendingUp, Target, Activity } from 'lucide-react';

interface AnalyticsCheckInsVsPlanProps {
  clienteId: string;
  analytics: {
    totalCheckIns: number;
    promedioSemaforo: number;
    dolorLumbarCount: number;
    promedioRPE: number;
    tendencias: Array<{ fecha: string; verde: number; amarillo: number; rojo: number }>;
    distribucionSemaforos: { verde: number; amarillo: number; rojo: number };
    evolucionRPE: Array<{ fecha: string; promedio: number; maximo: number; minimo: number }>;
    frecuenciaDolor: number;
    tendenciaGeneral: 'mejora' | 'estable' | 'empeora';
  } | null;
  objetivos: {
    sesionesObjetivo: number;
    duracionMinutosObjetivo: number;
    rpePromedioObjetivo: number;
  } | null;
}

export const AnalyticsCheckInsVsPlan: React.FC<AnalyticsCheckInsVsPlanProps> = ({ analytics, objetivos }) => {
  const resumen = useMemo(() => {
    const sesionesRealizadas = analytics?.tendencias?.reduce((sum, t) => sum + t.verde + t.amarillo + t.rojo, 0) ?? 0;
    // Duración real es desconocida en check-ins → estimación: 40 min por sesión
    const duracionEstimada = sesionesRealizadas * 40;
    const rpePromedioReal = analytics?.promedioRPE ?? 0;
    const adherenciaSesiones = objetivos && objetivos.sesionesObjetivo > 0
      ? Math.min(100, Math.round((sesionesRealizadas / objetivos.sesionesObjetivo) * 100))
      : 0;
    const adherenciaDuracion = objetivos && objetivos.duracionMinutosObjetivo > 0
      ? Math.min(100, Math.round((duracionEstimada / objetivos.duracionMinutosObjetivo) * 100))
      : 0;
    const deltaRpe = objetivos ? Math.round((rpePromedioReal - objetivos.rpePromedioObjetivo) * 10) / 10 : 0;
    return {
      sesionesRealizadas,
      duracionEstimada,
      rpePromedioReal,
      adherenciaSesiones,
      adherenciaDuracion,
      deltaRpe,
    };
  }, [analytics, objetivos]);

  if (!analytics || !objetivos) {
    return (
      <Card className="p-8 bg-white shadow-sm">
        <div className="text-center text-slate-600">Sin datos suficientes para analytics</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-900">Comparativa Check-ins vs Objetivos</h3>
          </div>
          <div className="text-xs text-slate-500">Últimos 7 días</div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white p-4 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Sesiones</span>
              <Target className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div className="text-2xl font-bold text-slate-900">{resumen.sesionesRealizadas}</div>
              <div className="text-sm text-slate-500">Objetivo: {objetivos.sesionesObjetivo}</div>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: `${resumen.adherenciaSesiones}%` }} />
            </div>
          </div>
          <div className="rounded-xl bg-white p-4 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Duración estimada</span>
              <Activity className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div className="text-2xl font-bold text-slate-900">{resumen.duracionEstimada} min</div>
              <div className="text-sm text-slate-500">Objetivo: {objetivos.duracionMinutosObjetivo} min</div>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400" style={{ width: `${resumen.adherenciaDuracion}%` }} />
            </div>
          </div>
          <div className="rounded-xl bg-white p-4 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>RPE promedio</span>
              <Activity className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div className="text-2xl font-bold text-slate-900">{resumen.rpePromedioReal.toFixed(1)}</div>
              <div className="text-sm text-slate-500">Objetivo: {objetivos.rpePromedioObjetivo.toFixed(1)}</div>
            </div>
            <div className={`mt-2 text-sm ${resumen.deltaRpe > 0.3 ? 'text-amber-600' : resumen.deltaRpe < -0.3 ? 'text-blue-600' : 'text-slate-600'}`}>
              Δ RPE: {resumen.deltaRpe > 0 ? '+' : ''}{resumen.deltaRpe}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white shadow-sm">
        <h4 className="text-sm font-semibold text-slate-900 mb-4">Distribución semáforos (calidad de sesiones)</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-center">
            <div className="text-2xl font-bold text-green-600">{analytics.distribucionSemaforos.verde}</div>
            <div className="text-xs text-slate-600">Verde</div>
          </div>
          <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-center">
            <div className="text-2xl font-bold text-yellow-600">{analytics.distribucionSemaforos.amarillo}</div>
            <div className="text-xs text-slate-600">Amarillo</div>
          </div>
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-center">
            <div className="text-2xl font-bold text-red-600">{analytics.distribucionSemaforos.rojo}</div>
            <div className="text-xs text-slate-600">Rojo</div>
          </div>
        </div>
        <div className="mt-4 text-xs text-slate-600">
          Tendencia general: <span className="font-semibold">{analytics.tendenciaGeneral}</span>
        </div>
      </Card>
    </div>
  );
};


