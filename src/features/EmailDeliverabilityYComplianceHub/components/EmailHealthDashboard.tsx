import React, { useState } from 'react';
import { useEmailComplianceAPI } from '../hooks/useEmailComplianceAPI';
import { KpiCard } from './KpiCard';
import { Card } from '../../../components/componentsreutilizables';
import { 
  Mail, 
  AlertTriangle, 
  XCircle, 
  UserMinus, 
  TrendingUp,
  Shield,
  Activity,
  Loader2
} from 'lucide-react';

interface EmailHealthDashboardProps {
  trainerId: string;
}

/**
 * Componente principal que obtiene y muestra las métricas de salud de email.
 */
export const EmailHealthDashboard: React.FC<EmailHealthDashboardProps> = ({
  trainerId
}) => {
  const [dateRange, setDateRange] = useState<'last7days' | 'last30days' | 'last90days'>('last30days');
  
  const {
    stats,
    isLoading,
    error,
    refreshStats
  } = useEmailComplianceAPI({ trainerId, dateRange });

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 80) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
        <p className="text-gray-600 mb-4">Error: {error.message}</p>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Mail size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos disponibles</h3>
        <p className="text-gray-600">No se encontraron métricas para mostrar.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selector de rango de fechas */}
      <div className="flex items-center justify-end">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as any)}
          className="rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 text-sm font-medium"
        >
          <option value="last7days">Últimos 7 días</option>
          <option value="last30days">Últimos 30 días</option>
          <option value="last90days">Últimos 90 días</option>
        </select>
      </div>

      {/* Health Score Principal */}
      <Card className="p-6 bg-white shadow-sm">
        <div className={`${getHealthScoreBg(stats.healthScore)} rounded-lg p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-1">Email Health Score</h3>
              <p className={`text-4xl font-bold ${getHealthScoreColor(stats.healthScore)}`}>
                {stats.healthScore}/100
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {stats.healthScore >= 90 
                  ? 'Excelente - Tu reputación de email está en muy buen estado' 
                  : stats.healthScore >= 80
                  ? 'Bueno - Monitorea las métricas para mantener tu reputación'
                  : 'Atención necesaria - Revisa las métricas para mejorar'}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <Shield className={`w-12 h-12 ${getHealthScoreColor(stats.healthScore)}`} />
            </div>
          </div>
        </div>
      </Card>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Tasa de Rebote Total"
          value={`${stats.bounceRate.total.toFixed(2)}%`}
          trend={stats.bounceRate.total > 2 ? 'down' : stats.bounceRate.total < 1 ? 'up' : 'neutral'}
          tooltipText={`Hard: ${stats.bounceRate.hard}% | Soft: ${stats.bounceRate.soft}%`}
          icon={<Mail className="w-6 h-6 text-blue-600" />}
          bgColor="bg-blue-100"
          textColor="text-blue-600"
        />
        
        <KpiCard
          title="Rebotes Hard"
          value={`${stats.bounceRate.hard.toFixed(2)}%`}
          trend={stats.bounceRate.hard > 0.5 ? 'down' : 'up'}
          tooltipText="Emails a direcciones inexistentes. Debe estar < 0.5%"
          icon={<XCircle className="w-6 h-6 text-red-600" />}
          bgColor="bg-red-100"
          textColor="text-red-600"
        />
        
        <KpiCard
          title="Quejas de Spam"
          value={`${stats.spamComplaintRate.toFixed(2)}%`}
          trend={stats.spamComplaintRate > 0.1 ? 'down' : 'up'}
          tooltipText="Debe estar < 0.1% para evitar bloqueos"
          icon={<AlertTriangle className="w-6 h-6 text-orange-600" />}
          bgColor="bg-orange-100"
          textColor="text-orange-600"
        />
        
        <KpiCard
          title="Tasa de Bajas"
          value={`${stats.unsubscribeRate.toFixed(2)}%`}
          trend="neutral"
          tooltipText="Usuarios que cancelaron su suscripción"
          icon={<UserMinus className="w-6 h-6 text-gray-600" />}
          bgColor="bg-gray-100"
          textColor="text-gray-600"
        />
      </div>

      {/* Tasa de Apertura si está disponible */}
      {stats.openRate !== undefined && (
        <Card className="p-4 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Tasa de Apertura Promedio</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.openRate.toFixed(1)}%</p>
                </div>
              </div>
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      )}

      {/* Gráfico de historial simple */}
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Eventos</h3>
        <div className="space-y-2">
          {stats.history.slice(-7).map((point, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-600">
                {new Date(point.date).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short'
                })}
              </span>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-red-600">Rebotes: {point.bounces}</span>
                <span className="text-orange-600">Quejas: {point.complaints}</span>
                {point.unsubscribes !== undefined && (
                  <span className="text-gray-600">Bajas: {point.unsubscribes}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};


