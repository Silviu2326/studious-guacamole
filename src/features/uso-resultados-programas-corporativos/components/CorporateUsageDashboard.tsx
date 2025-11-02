import React, { useState, useEffect } from 'react';
import { Card, Select, Button, Modal, MetricCards } from '../../../components/componentsreutilizables';
import type { MetricCardData } from '../../../components/componentsreutilizables';
import { UsageTrendChart } from './UsageTrendChart';
import { useCorporateAnalytics, useCorporateClients } from '../api/useCorporateAnalytics';
import { DateRange, ActivityData } from '../types';
import { generateReport } from '../api';
import {
  TrendingUp,
  Users,
  Activity,
  UserCheck,
  Calendar,
  Download,
  FileText,
  FileSpreadsheet,
  Building2,
  Loader2,
  Package,
} from 'lucide-react';

export const CorporateUsageDashboard: React.FC = () => {
  const { clients, isLoading: loadingClients } = useCorporateClients();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });
  const [activitiesData, setActivitiesData] = useState<ActivityData[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv'>('pdf');

  const { usageData, timeSeriesData, isLoading, error } = useCorporateAnalytics(
    selectedClientId,
    dateRange
  );

  // Simular datos de actividades populares
  useEffect(() => {
    if (usageData) {
      setActivitiesData([
        { name: 'Yoga', checkIns: 234, percentage: 35 },
        { name: 'HIIT', checkIns: 189, percentage: 28 },
        { name: 'Pilates', checkIns: 156, percentage: 23 },
        { name: 'Gimnasio Libre', checkIns: 92, percentage: 14 },
      ]);
    }
  }, [usageData]);

  const handleDateRangeChange = (range: '30d' | '90d' | 'year' | 'custom') => {
    const today = new Date();
    switch (range) {
      case '30d':
        setDateRange({
          startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
          endDate: today,
        });
        break;
      case '90d':
        setDateRange({
          startDate: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000),
          endDate: today,
        });
        break;
      case 'year':
        setDateRange({
          startDate: new Date(today.getFullYear(), 0, 1),
          endDate: today,
        });
        break;
      default:
        break;
    }
  };

  const handleExportReport = async () => {
    if (!selectedClientId) {
      alert('Por favor selecciona un cliente corporativo');
      return;
    }

    try {
      const result = await generateReport({
        clientId: selectedClientId,
        format: exportFormat,
        dateRange,
        metrics: ['activationRate', 'totalCheckIns', 'averageVisitsPerUser'],
      });
      alert('Reporte generado exitosamente. ID: ' + result.reportId);
      setShowExportModal(false);
    } catch (error) {
      console.error('Error generando reporte:', error);
      alert('Error al generar el reporte');
    }
  };

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  // Preparar datos de métricas
  const metricsData: MetricCardData[] = usageData
    ? [
        {
          id: 'activation-rate',
          title: 'Tasa de Activación',
          value: `${(usageData.activationRate * 100).toFixed(1)}%`,
          trend: { value: 5, direction: 'up', label: 'vs mes anterior' },
          icon: <UserCheck size={20} />,
          color: 'success',
        },
        {
          id: 'total-checkins',
          title: 'Visitas Totales',
          value: usageData.totalCheckIns,
          trend: { value: 10, direction: 'up', label: 'vs trimestre anterior' },
          icon: <Activity size={20} />,
          color: 'primary',
        },
        {
          id: 'avg-visits',
          title: 'Visitas Promedio',
          value: usageData.averageVisitsPerUser.toFixed(1),
          trend: { value: 0, direction: 'neutral' },
          icon: <TrendingUp size={20} />,
          color: 'info',
        },
        {
          id: 'active-users',
          title: 'Usuarios Activos',
          value: `${usageData.activeUsers} / ${usageData.totalEnrolled}`,
          trend: { value: 15, direction: 'up', label: 'nuevos usuarios' },
          icon: <Users size={20} />,
          color: 'warning',
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Header con selectores */}
      <Card className="bg-white shadow-sm">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Cliente Corporativo"
              options={[
                { value: '', label: 'Selecciona un cliente', disabled: true },
                ...clients.map((c) => ({ value: c.id, label: c.name })),
              ]}
              value={selectedClientId || ''}
              onChange={(e) => setSelectedClientId(e.target.value || null)}
              placeholder="Selecciona un cliente"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Rango de Fechas
              </label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={
                    dateRange.endDate.getTime() === new Date().getTime() &&
                    dateRange.startDate.getTime() >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getTime()
                      ? 'primary'
                      : 'secondary'
                  }
                  onClick={() => handleDateRangeChange('30d')}
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  30 días
                </Button>
                <Button size="sm" variant="secondary" onClick={() => handleDateRangeChange('90d')}>
                  90 días
                </Button>
                <Button size="sm" variant="secondary" onClick={() => handleDateRangeChange('year')}>
                  Año
                </Button>
              </div>
            </div>
          </div>

          {selectedClient && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg ring-1 ring-blue-100">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedClient.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {dateRange.startDate.toLocaleDateString('es-ES')} - {dateRange.endDate.toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
              <Button variant="primary" onClick={() => setShowExportModal(true)}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          )}
        </div>
      </Card>

      {error && (
        <Card className="bg-white shadow-sm">
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600">{error.message}</p>
          </div>
        </Card>
      )}

      {!selectedClientId ? (
        <Card className="bg-white shadow-sm">
          <div className="p-12 text-center">
            <Package className="w-20 h-20 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona un Cliente Corporativo</h3>
            <p className="text-gray-600">
              Por favor elige un cliente de la lista para ver sus métricas de uso y resultados
            </p>
          </div>
        </Card>
      ) : isLoading ? (
        <MetricCards data={metricsData.map(m => ({ ...m, loading: true }))} columns={4} />
      ) : (
        <>
          {/* KPIs principales */}
          <MetricCards data={metricsData} columns={4} />

          {/* Gráfico de tendencias */}
          <UsageTrendChart
            data={timeSeriesData}
            timeUnit="day"
            chartType="bar"
            title="Evolución de Check-ins"
            isLoading={isLoading}
          />

          {/* Actividades más populares */}
          <Card className="bg-white shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Actividades más Populares
              </h3>

              <div className="space-y-4">
                {activitiesData.map((activity, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {activity.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-gray-900">
                          {activity.checkIns}
                        </span>
                        <span className="text-xs text-gray-600">
                          ({activity.percentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${activity.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Modal de exportación */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Exportar Informe"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Formato
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setExportFormat('pdf')}
                className={`p-4 border-2 rounded-xl transition-all ${
                  exportFormat === 'pdf'
                    ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FileText className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <span className="text-sm font-medium">PDF</span>
              </button>
              <button
                onClick={() => setExportFormat('csv')}
                className={`p-4 border-2 rounded-xl transition-all ${
                  exportFormat === 'csv'
                    ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FileSpreadsheet className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <span className="text-sm font-medium">CSV</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={() => setShowExportModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleExportReport}>
              Exportar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

