// US-19: Dashboard de métricas de conversión

import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Sale, BusinessType } from '../types';
import { getPipeline } from '../api';
import { 
  TrendingUp, 
  Users, 
  UserCheck, 
  Target, 
  ArrowUp, 
  ArrowDown,
  BarChart3,
  Settings
} from 'lucide-react';

interface ConversionDashboardProps {
  businessType: BusinessType;
  userId?: string;
  targetConversion?: number; // Objetivo de conversión configurable
}

interface ConversionMetrics {
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  previousMonthLeads: number;
  previousMonthConverted: number;
  previousMonthRate: number;
  trend: number; // Porcentaje de cambio
  monthlyTrend: MonthlyData[];
}

interface MonthlyData {
  month: string;
  leads: number;
  converted: number;
  rate: number;
}

export const ConversionDashboard: React.FC<ConversionDashboardProps> = ({
  businessType,
  userId,
  targetConversion = 30, // 30% por defecto
}) => {
  const [metrics, setMetrics] = useState<ConversionMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(targetConversion);
  const [showTargetConfig, setShowTargetConfig] = useState(false);

  useEffect(() => {
    loadMetrics();
  }, [businessType, userId]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const columns = await getPipeline(businessType, userId);
      const allSales = columns.flatMap(col => col.sales);

      // Calcular métricas actuales
      const totalLeads = allSales.length;
      const convertedLeads = allSales.filter(sale => 
        sale.phase === 'cliente' || sale.phase === 'alta_cerrada'
      ).length;
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

      // Simular datos del mes anterior (en producción, se obtendrían de la API)
      const previousMonthLeads = Math.round(totalLeads * 0.85);
      const previousMonthConverted = Math.round(convertedLeads * 0.9);
      const previousMonthRate = previousMonthLeads > 0 
        ? (previousMonthConverted / previousMonthLeads) * 100 
        : 0;

      const trend = previousMonthRate > 0 
        ? ((conversionRate - previousMonthRate) / previousMonthRate) * 100 
        : 0;

      // Simular datos mensuales (en producción, se obtendrían de la API)
      const monthlyTrend: MonthlyData[] = [
        { month: 'Ene', leads: 12, converted: 3, rate: 25 },
        { month: 'Feb', leads: 15, converted: 4, rate: 27 },
        { month: 'Mar', leads: 18, converted: 5, rate: 28 },
        { month: 'Abr', leads: previousMonthLeads, converted: previousMonthConverted, rate: previousMonthRate },
        { month: 'May', leads: totalLeads, converted: convertedLeads, rate: conversionRate },
      ];

      setMetrics({
        totalLeads,
        convertedLeads,
        conversionRate,
        previousMonthLeads,
        previousMonthConverted,
        previousMonthRate,
        trend,
        monthlyTrend,
      });
    } catch (error) {
      console.error('Error cargando métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !metrics) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <p className="text-gray-600">Cargando métricas...</p>
      </Card>
    );
  }

  const meetsTarget = metrics.conversionRate >= target;
  const isImproving = metrics.trend > 0;

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Leads */}
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Leads</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{metrics.totalLeads}</p>
            <p className="text-xs text-gray-500 mt-1">
              Mes anterior: {metrics.previousMonthLeads}
            </p>
          </div>
        </Card>

        {/* Leads Convertidos */}
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Clientes</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{metrics.convertedLeads}</p>
            <p className="text-xs text-gray-500 mt-1">
              Mes anterior: {metrics.previousMonthConverted}
            </p>
          </div>
        </Card>

        {/* Tasa de Conversión */}
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <button
              onClick={() => setShowTargetConfig(!showTargetConfig)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Tasa de Conversión</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {metrics.conversionRate.toFixed(1)}%
            </p>
            <div className="flex items-center gap-2 mt-2">
              {isImproving ? (
                <ArrowUp className="w-4 h-4 text-green-600" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-600" />
              )}
              <p className={`text-xs font-medium ${isImproving ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(metrics.trend).toFixed(1)}% vs mes anterior
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Configurar objetivo */}
      {showTargetConfig && (
        <Card className="p-4 bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Objetivo de conversión (%):
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={target}
              onChange={(e) => setTarget(parseFloat(e.target.value) || 0)}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => setShowTargetConfig(false)}
              className="text-sm text-gray-600 hover:text-gray-700"
            >
              Guardar
            </button>
          </div>
        </Card>
      )}

      {/* Progreso hacia objetivo */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Progreso hacia el objetivo</h3>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Meta: {target}%</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Conversión actual</span>
            <span className={`font-semibold ${meetsTarget ? 'text-green-600' : 'text-gray-900'}`}>
              {metrics.conversionRate.toFixed(1)}%
            </span>
          </div>
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                meetsTarget ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{
                width: `${Math.min((metrics.conversionRate / target) * 100, 100)}%`
              }}
            />
          </div>
          <p className="text-xs text-gray-500">
            {meetsTarget 
              ? `¡Excelente! Has superado tu objetivo por ${(metrics.conversionRate - target).toFixed(1)}%`
              : `Te faltan ${(target - metrics.conversionRate).toFixed(1)}% para alcanzar tu objetivo`
            }
          </p>
        </div>
      </Card>

      {/* Gráfico de tendencia */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Tendencias mensuales
          </h3>
        </div>
        <div className="space-y-4">
          {metrics.monthlyTrend.map((month, index) => {
            const maxRate = Math.max(...metrics.monthlyTrend.map(m => m.rate));
            const barWidth = (month.rate / maxRate) * 100;

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-700 w-12">{month.month}</span>
                    <span className="text-gray-600 text-xs">
                      {month.leads} leads → {month.converted} clientes
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900">{month.rate.toFixed(1)}%</span>
                </div>
                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Resumen */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Resumen</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {metrics.totalLeads} leads → {metrics.convertedLeads} clientes = {metrics.conversionRate.toFixed(1)}% conversión
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {isImproving ? '📈 Mejorando' : '📉 Necesita atención'} - 
              {Math.abs(metrics.trend).toFixed(1)}% {isImproving ? 'mejor' : 'peor'} que el mes anterior
            </p>
          </div>
          <div className="p-4 bg-white rounded-full shadow-lg">
            <TrendingUp className={`w-8 h-8 ${isImproving ? 'text-green-600' : 'text-red-600'}`} />
          </div>
        </div>
      </Card>
    </div>
  );
};

