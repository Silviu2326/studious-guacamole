import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Clock, AlertTriangle, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

interface SLAMonitoringPanelProps {
  totalLeads: number;
  onTime: number;
  atRisk: number;
  overdue: number;
  avgResponseTime: number;
  slaTarget: number; // en minutos
}

export const SLAMonitoringPanel: React.FC<SLAMonitoringPanelProps> = ({
  totalLeads,
  onTime,
  atRisk,
  overdue,
  avgResponseTime,
  slaTarget
}) => {
  const complianceRate = totalLeads > 0 ? ((onTime / totalLeads) * 100).toFixed(1) : '0';
  const riskRate = totalLeads > 0 ? (((atRisk + overdue) / totalLeads) * 100).toFixed(1) : '0';

  const getStatusColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="bg-white shadow-sm" padding="md">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Monitoreo SLA</h3>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Objetivo: {slaTarget} minutos</span>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Tiempo promedio de respuesta: <strong>{avgResponseTime} minutos</strong>
        </p>
      </div>

      {/* Barra de progreso de cumplimiento */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Tasa de Cumplimiento</span>
          <span className={`text-sm font-bold ${getStatusColor(parseFloat(complianceRate))}`}>
            {complianceRate}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all ${
              parseFloat(complianceRate) >= 90
                ? 'bg-green-500'
                : parseFloat(complianceRate) >= 75
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${complianceRate}%` }}
          />
        </div>
      </div>

      {/* Estadísticas por estado */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
          <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-green-700">{onTime}</p>
          <p className="text-xs text-green-600 mt-1">A tiempo</p>
        </div>

        <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
          <AlertTriangle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-orange-700">{atRisk}</p>
          <p className="text-xs text-orange-600 mt-1">En riesgo</p>
        </div>

        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
          <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-red-700">{overdue}</p>
          <p className="text-xs text-red-600 mt-1">Vencidos</p>
        </div>
      </div>

      {/* Alerta si hay leads en riesgo */}
      {(atRisk > 0 || overdue > 0) && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-900">
                {atRisk + overdue} leads requieren atención inmediata
              </p>
              <p className="text-xs text-orange-700 mt-1">
                {atRisk > 0 && `${atRisk} se acercan al límite de SLA`}
                {atRisk > 0 && overdue > 0 && ' y '}
                {overdue > 0 && `${overdue} han excedido el tiempo límite`}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

