import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { financialDashboardApi } from '../api/api';
import type { FinancialDashboard as FinancialDashboardData, FinancialAlert } from '../api/types';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  Info,
  X,
  RefreshCw,
  ArrowRight,
  Percent
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface FinancialDashboardProps {
  onNavigate?: (tab: string) => void;
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ 
  onNavigate 
}) => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<FinancialDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await financialDashboardApi.getDashboard(user?.id);
      setDashboard(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: dashboard?.currency || 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getAlertIcon = (type: FinancialAlert['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  const getAlertColor = (type: FinancialAlert['type']) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  const handleDismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => new Set(prev).add(alertId));
  };

  const handleAlertAction = (alert: FinancialAlert) => {
    if (alert.actionUrl && onNavigate) {
      const tab = alert.actionUrl.replace('#', '');
      onNavigate(tab);
    }
  };

  const visibleAlerts = dashboard?.alerts.filter(
    alert => !dismissedAlerts.has(alert.id)
  ) || [];

  if (loading) {
    return (
      <Card className="p-6 bg-white shadow-sm">
        <div className="text-center text-gray-500">Cargando dashboard...</div>
      </Card>
    );
  }

  if (!dashboard) {
    return (
      <Card className="p-6 bg-white shadow-sm">
        <div className="text-center text-gray-500">No hay datos disponibles</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Dashboard Financiero
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Vista general de tu situación financiera
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={loadDashboard}
            className="text-sm"
          >
            <RefreshCw size={16} className="mr-2" />
            Actualizar
          </Button>
        </div>
        <div className="text-xs text-gray-500">
          Período: {dashboard.period.from.toLocaleDateString('es-ES', { 
            month: 'long', 
            year: 'numeric' 
          })}
        </div>
      </Card>

      {/* Alertas */}
      {visibleAlerts.length > 0 && (
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Alertas y Notificaciones
          </h3>
          <div className="space-y-3">
            {visibleAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${getAlertColor(alert.type)} flex items-start gap-3`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{alert.title}</h4>
                      <p className="text-sm opacity-90">{alert.message}</p>
                    </div>
                    <button
                      onClick={() => handleDismissAlert(alert.id)}
                      className="flex-shrink-0 p-1 hover:bg-black/10 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  {alert.actionUrl && alert.actionLabel && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAlertAction(alert)}
                      className="mt-2 text-sm"
                    >
                      {alert.actionLabel}
                      <ArrowRight size={14} className="ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Beneficio Neto Mensual */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-200 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-700" />
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded ${
              dashboard.monthlyNetProfit >= 0 
                ? 'bg-green-200 text-green-800' 
                : 'bg-red-200 text-red-800'
            }`}>
              {dashboard.monthlyNetProfit >= 0 ? 'Positivo' : 'Negativo'}
            </span>
          </div>
          <div className="mb-1">
            <p className="text-sm text-gray-600">Beneficio Neto Mensual</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className={`text-3xl font-bold ${
              dashboard.monthlyNetProfit >= 0 ? 'text-green-700' : 'text-red-700'
            }`}>
              {formatCurrency(dashboard.monthlyNetProfit)}
            </p>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Después de impuestos
          </p>
        </Card>

        {/* Margen de Beneficio */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-200 rounded-lg">
              <Percent className="w-5 h-5 text-blue-700" />
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded ${
              dashboard.profitMargin >= 20 
                ? 'bg-green-200 text-green-800' 
                : dashboard.profitMargin >= 10
                ? 'bg-yellow-200 text-yellow-800'
                : 'bg-red-200 text-red-800'
            }`}>
              {dashboard.profitMargin >= 20 ? 'Bueno' : dashboard.profitMargin >= 10 ? 'Regular' : 'Bajo'}
            </span>
          </div>
          <div className="mb-1">
            <p className="text-sm text-gray-600">Margen de Beneficio</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-blue-700">
              {dashboard.profitMargin.toFixed(1)}%
            </p>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {formatCurrency(dashboard.grossProfit)} de {formatCurrency(dashboard.monthlyIncome)}
          </p>
        </Card>

        {/* Impuestos Pendientes */}
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-200 rounded-lg">
              <DollarSign className="w-5 h-5 text-orange-700" />
            </div>
          </div>
          <div className="mb-1">
            <p className="text-sm text-gray-600">Impuestos Pendientes</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-orange-700">
              {formatCurrency(dashboard.estimatedPendingTaxes)}
            </p>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Estimado para este mes
          </p>
        </Card>

        {/* Dinero Disponible */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-purple-700" />
            </div>
          </div>
          <div className="mb-1">
            <p className="text-sm text-gray-600">Disponible después de Impuestos</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className={`text-3xl font-bold ${
              dashboard.availableAfterTaxes >= 0 ? 'text-purple-700' : 'text-red-700'
            }`}>
              {formatCurrency(dashboard.availableAfterTaxes)}
            </p>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Listo para usar
          </p>
        </Card>
      </div>

      {/* Resumen de Ingresos y Gastos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Ingresos</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ingresos brutos:</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(dashboard.monthlyIncome)}
              </span>
            </div>
            {dashboard.taxCalculation && (
              <>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">IVA a pagar:</span>
                  <span className="text-red-600">
                    -{formatCurrency(dashboard.taxCalculation.vatNet)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">IRPF estimado:</span>
                  <span className="text-red-600">
                    -{formatCurrency(dashboard.taxCalculation.irpfAmount)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total impuestos:</span>
                  <span className="text-lg font-bold text-red-600">
                    -{formatCurrency(dashboard.taxCalculation.totalTaxes)}
                  </span>
                </div>
              </>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Gastos</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Gastos del mes:</span>
              <span className="text-lg font-semibold text-red-600">
                {formatCurrency(dashboard.monthlyExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Beneficio bruto:</span>
              <span className={`font-medium ${
                dashboard.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(dashboard.grossProfit)}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Margen:</span>
              <span className={`text-lg font-bold ${
                dashboard.profitMargin >= 20 ? 'text-green-600' : 
                dashboard.profitMargin >= 10 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {dashboard.profitMargin.toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Información adicional */}
      {dashboard.taxCalculation && (
        <Card className="p-6 bg-gray-50 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Detalles Fiscales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-1">Régimen Fiscal:</p>
              <p className="font-medium text-gray-900">
                {dashboard.taxCalculation.settings.taxRegime}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">IVA ({dashboard.taxCalculation.settings.vatRate}%):</p>
              <p className="font-medium text-gray-900">
                {dashboard.taxCalculation.settings.vatEnabled 
                  ? formatCurrency(dashboard.taxCalculation.vatNet) 
                  : 'No aplicable'}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">IRPF ({dashboard.taxCalculation.settings.irpfRate}%):</p>
              <p className="font-medium text-gray-900">
                {dashboard.taxCalculation.settings.irpfEnabled 
                  ? formatCurrency(dashboard.taxCalculation.irpfAmount) 
                  : 'No aplicable'}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

