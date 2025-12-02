import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { financialDashboardApi, fiscalCalendarApi, accountingExportApi, resumenFiscalApi } from '../api/api';
import type { FinancialDashboard as FinancialDashboardData, FinancialAlert, TaxDeadline, AccountingExport } from '../api/types';
import { IncomeExpensesChart } from './IncomeExpensesChart';
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
  Percent,
  Calendar,
  FileDown,
  Download,
  Clock
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { format } from 'date-fns';

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
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<TaxDeadline[]>([]);
  const [lastExport, setLastExport] = useState<AccountingExport | null>(null);
  const [fiscalSummary, setFiscalSummary] = useState<any>(null);

  useEffect(() => {
    loadDashboard();
    loadUpcomingDeadlines();
    loadLastExport();
    loadFiscalSummary();
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

  const loadUpcomingDeadlines = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const calendar = await fiscalCalendarApi.getCalendar(currentYear);
      const today = new Date();
      
      // Obtener próximas obligaciones (pendientes y próximas 60 días)
      const upcoming = calendar.deadlines
        .filter(deadline => {
          const deadlineDate = new Date(deadline.deadline);
          const daysUntil = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          return deadline.status === 'pending' && daysUntil >= 0 && daysUntil <= 60;
        })
        .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
        .slice(0, 3); // Solo las 3 próximas
      
      setUpcomingDeadlines(upcoming);
    } catch (error) {
      console.error('Error loading upcoming deadlines:', error);
    }
  };

  const loadLastExport = async () => {
    try {
      const response = await accountingExportApi.getHistory(1, 1);
      if (response.data && response.data.length > 0) {
        setLastExport(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading last export:', error);
    }
  };

  const loadFiscalSummary = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const summary = await resumenFiscalApi.getResumenFiscalAnual(currentYear);
      setFiscalSummary(summary);
    } catch (error) {
      console.error('Error loading fiscal summary:', error);
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

  const formatDate = (date: Date): string => {
    return format(date, 'dd/MM/yyyy');
  };

  const getDaysUntilDeadline = (deadline: Date): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    return Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
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

  const handleNavigateToExport = () => {
    if (onNavigate) {
      onNavigate('exportar');
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

  // Calcular IVA neto y IRPF estimado
  const vatNet = dashboard.taxCalculation?.vatNet || 0;
  const irpfEstimated = dashboard.taxCalculation?.irpfAmount || 0;
  const estimatedProfit = dashboard.grossProfit;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <Card className="p-4 md:p-6 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
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
            className="text-sm w-full sm:w-auto"
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

      {/* Tarjetas de Resumen - Ingresos, Gastos, Beneficio, IVA Neto, IRPF Estimado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Ingresos del Período */}
        <Card className="p-4 md:p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-200 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-700" />
            </div>
          </div>
          <div className="mb-1">
            <p className="text-xs md:text-sm text-gray-600">Ingresos del Período</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl md:text-3xl font-bold text-green-700">
              {formatCurrency(dashboard.monthlyIncome)}
            </p>
          </div>
        </Card>

        {/* Gastos del Período */}
        <Card className="p-4 md:p-6 bg-gradient-to-br from-red-50 to-red-100 border border-red-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-red-200 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-700" />
            </div>
          </div>
          <div className="mb-1">
            <p className="text-xs md:text-sm text-gray-600">Gastos del Período</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl md:text-3xl font-bold text-red-700">
              {formatCurrency(dashboard.monthlyExpenses)}
            </p>
          </div>
        </Card>

        {/* Beneficio Estimado */}
        <Card className="p-4 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-200 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-700" />
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded ${
              estimatedProfit >= 0 
                ? 'bg-green-200 text-green-800' 
                : 'bg-red-200 text-red-800'
            }`}>
              {estimatedProfit >= 0 ? 'Positivo' : 'Negativo'}
            </span>
          </div>
          <div className="mb-1">
            <p className="text-xs md:text-sm text-gray-600">Beneficio Estimado</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className={`text-2xl md:text-3xl font-bold ${
              estimatedProfit >= 0 ? 'text-blue-700' : 'text-red-700'
            }`}>
              {formatCurrency(estimatedProfit)}
            </p>
          </div>
        </Card>

        {/* IVA Neto */}
        <Card className="p-4 md:p-6 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-200 rounded-lg">
              <Percent className="w-5 h-5 text-orange-700" />
            </div>
          </div>
          <div className="mb-1">
            <p className="text-xs md:text-sm text-gray-600">IVA Neto</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className={`text-2xl md:text-3xl font-bold ${
              vatNet >= 0 ? 'text-orange-700' : 'text-green-700'
            }`}>
              {vatNet >= 0 ? '+' : ''}{formatCurrency(Math.abs(vatNet))}
            </p>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {vatNet >= 0 ? 'A pagar' : 'A devolver'}
          </p>
        </Card>

        {/* IRPF Estimado */}
        <Card className="p-4 md:p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-200 rounded-lg">
              <Percent className="w-5 h-5 text-purple-700" />
            </div>
          </div>
          <div className="mb-1">
            <p className="text-xs md:text-sm text-gray-600">IRPF Estimado</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl md:text-3xl font-bold text-purple-700">
              {formatCurrency(irpfEstimated)}
            </p>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Estimación mensual
          </p>
        </Card>
      </div>

      {/* Gráfico de Ingresos vs Gastos */}
      <Card className="p-4 md:p-6 bg-white shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">
            Evolución: Ingresos vs Gastos
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Comparativa mensual del período
          </p>
        </div>
        <div className="w-full">
          <IncomeExpensesChart userId={user?.id} />
        </div>
      </Card>

      {/* Próximas Obligaciones Fiscales y Estado de Exportaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Próximas Obligaciones Fiscales */}
        <Card className="p-4 md:p-6 bg-white shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Próximas Obligaciones Fiscales
              </h3>
              <p className="text-sm text-gray-600">
                Fechas de vencimiento próximas
              </p>
            </div>
          </div>
          
          {upcomingDeadlines.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p className="text-sm">No hay obligaciones próximas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline) => {
                const daysUntil = getDaysUntilDeadline(deadline.deadline);
                const isUrgent = daysUntil <= 7;
                
                return (
                  <div
                    key={deadline.id}
                    className={`p-3 rounded-lg border ${
                      isUrgent 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium px-2 py-1 rounded ${
                            deadline.model === '130' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {deadline.modelName}
                          </span>
                          {isUrgent && (
                            <Badge variant="error" className="text-xs">
                              Urgente
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {deadline.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>
                            {formatDate(deadline.deadline)} 
                            {daysUntil >= 0 && ` (${daysUntil} ${daysUntil === 1 ? 'día' : 'días'})`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {upcomingDeadlines.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              onClick={() => onNavigate?.('calendario')}
            >
              Ver calendario completo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </Card>

        {/* Estado de Exportaciones */}
        <Card className="p-4 md:p-6 bg-white shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileDown className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Estado de Exportaciones
              </h3>
              <p className="text-sm text-gray-600">
                Última exportación realizada
              </p>
            </div>
          </div>
          
          {!lastExport ? (
            <div className="text-center py-8 text-gray-500">
              <FileDown className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm mb-3">No hay exportaciones realizadas</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNavigateToExport}
              >
                Crear primera exportación
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={lastExport.status === 'completed' ? 'success' : 'warning'}
                      className="text-xs"
                    >
                      {lastExport.status === 'completed' ? 'Completada' : 'Pendiente'}
                    </Badge>
                    <span className="text-xs font-medium text-gray-600 uppercase">
                      {lastExport.format}
                    </span>
                  </div>
                  {lastExport.downloadUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(lastExport.downloadUrl, '_blank')}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {lastExport.dateRange}
                </p>
                <p className="text-xs text-gray-600">
                  {format(new Date(lastExport.createdAt), "dd/MM/yyyy 'a las' HH:mm")}
                </p>
              </div>
              
              <Button
                variant="default"
                className="w-full"
                onClick={handleNavigateToExport}
              >
                <FileDown className="w-4 h-4 mr-2" />
                Ir a Exportar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Alertas */}
      {visibleAlerts.length > 0 && (
        <Card className="p-4 md:p-6 bg-white shadow-sm">
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
    </div>
  );
};

