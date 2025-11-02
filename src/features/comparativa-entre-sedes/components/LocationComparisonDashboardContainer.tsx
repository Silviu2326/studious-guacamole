import React, { useState } from 'react';
import { useComparisonApi } from '../hooks/useComparisonApi';
import { MultiLocationSelector } from './MultiLocationSelector';
import { ComparisonChart } from './ComparisonChart';
import { Button, Select, Card } from '../../../components/componentsreutilizables';
import { ComparisonFilters, KPI, KPI_DEFINITIONS } from '../types';
import { Calendar, Download, Filter, BarChart3, X, Loader2, AlertCircle, LineChart } from 'lucide-react';
import { generateReport } from '../api';

export const LocationComparisonDashboardContainer: React.FC = () => {
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Últimos 30 días
    endDate: new Date(),
  });
  const [selectedKpis, setSelectedKpis] = useState<KPI[]>(['totalRevenue']);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [selectedKpiForChart, setSelectedKpiForChart] = useState<KPI>('totalRevenue');
  const [showKpiSelector, setShowKpiSelector] = useState(false);
  const [exportingReport, setExportingReport] = useState<'csv' | 'pdf' | null>(null);

  const filters: ComparisonFilters = {
    locationIds: selectedLocationIds,
    dateRange,
    kpis: selectedKpis,
  };

  const { comparisonData, locations, isLoading, error, refetch } = useComparisonApi(filters);

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    const date = new Date(value);
    if (type === 'start') {
      setDateRange({ ...dateRange, startDate: date });
    } else {
      setDateRange({ ...dateRange, endDate: date });
    }
  };

  const handleKpiToggle = (kpiId: KPI) => {
    if (selectedKpis.includes(kpiId)) {
      const newKpis = selectedKpis.filter((id) => id !== kpiId);
      setSelectedKpis(newKpis);
      // Si el KPI eliminado era el seleccionado para el gráfico, cambiar a otro
      if (selectedKpiForChart === kpiId && newKpis.length > 0) {
        setSelectedKpiForChart(newKpis[0]);
      }
    } else {
      setSelectedKpis([...selectedKpis, kpiId]);
    }
  };

  const handleExportReport = async (format: 'csv' | 'pdf') => {
    if (selectedLocationIds.length === 0 || selectedKpis.length === 0) {
      alert('Por favor seleccione al menos una sede y un KPI antes de exportar.');
      return;
    }

    setExportingReport(format);
    try {
      const result = await generateReport(filters, format);
      alert(`Reporte ${format.toUpperCase()} generado con éxito. ID: ${result.reportId}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al generar el reporte.';
      alert(errorMessage);
    } finally {
      setExportingReport(null);
    }
  };

  const kpiOptionsForChart = selectedKpis.map((kpiId) => {
    const kpi = KPI_DEFINITIONS.find((k) => k.id === kpiId);
    return {
      value: kpiId,
      label: kpi?.label || kpiId,
    };
  });

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Selector de Sedes */}
              <div className="lg:col-span-1">
                <MultiLocationSelector
                  locations={locations}
                  selectedIds={selectedLocationIds}
                  onSelectionChange={setSelectedLocationIds}
                />
              </div>

              {/* Selector de Fechas */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={dateRange.startDate.toISOString().split('T')[0]}
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={dateRange.endDate.toISOString().split('T')[0]}
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Panel de Filtros Avanzados - KPIs */}
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700">
                <Filter size={16} className="inline mr-1" />
                KPIs Seleccionados ({selectedKpis.length})
              </label>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowKpiSelector(!showKpiSelector)}
              >
                {showKpiSelector ? <X size={16} className="mr-2" /> : <Filter size={16} className="mr-2" />}
                {showKpiSelector ? 'Ocultar' : 'Seleccionar KPIs'}
              </Button>
            </div>

            {showKpiSelector && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {KPI_DEFINITIONS.map((kpi) => (
                  <label
                    key={kpi.id}
                    className="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-slate-50 transition border border-transparent hover:border-slate-200"
                  >
                    <input
                      type="checkbox"
                      checked={selectedKpis.includes(kpi.id)}
                      onChange={() => handleKpiToggle(kpi.id)}
                      className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900">
                        {kpi.label}
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        {kpi.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {selectedKpis.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedKpis.map((kpiId) => {
                  const kpi = KPI_DEFINITIONS.find((k) => k.id === kpiId);
                  return (
                    <span
                      key={kpiId}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {kpi?.label}
                      <button
                        onClick={() => handleKpiToggle(kpiId)}
                        className="hover:text-blue-900"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Toolbar superior */}
          <div className="flex items-center justify-end">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => handleExportReport('pdf')}
                loading={exportingReport === 'pdf'}
                disabled={selectedLocationIds.length === 0 || selectedKpis.length === 0}
              >
                <Download size={20} className="mr-2" />
                Exportar PDF
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleExportReport('csv')}
                loading={exportingReport === 'csv'}
                disabled={selectedLocationIds.length === 0 || selectedKpis.length === 0}
              >
                <Download size={20} className="mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>

          {/* Resumen de resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>
              {selectedLocationIds.length > 0 && selectedKpis.length > 0 
                ? `${selectedLocationIds.length} ${selectedLocationIds.length === 1 ? 'sede' : 'sedes'} seleccionada${selectedLocationIds.length > 1 ? 's' : ''}`
                : 'No hay selección'}
            </span>
            <span>
              {selectedKpis.length > 0 ? `${selectedKpis.length} KPI${selectedKpis.length > 1 ? 's' : ''} seleccionado${selectedKpis.length > 1 ? 's' : ''}` : ''}
            </span>
          </div>
        </div>
      </Card>

      {/* Estado de error */}
      {error && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refetch}>Reintentar</Button>
        </Card>
      )}

      {/* Estado vacío - Sin sedes seleccionadas */}
      {!error && selectedLocationIds.length === 0 && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Seleccione Sedes</h3>
          <p className="text-gray-600 mb-4">
            Seleccione al menos una sede para comenzar la comparativa
          </p>
        </Card>
      )}

      {/* Estado vacío - Sin KPIs seleccionados */}
      {!error && selectedLocationIds.length > 0 && selectedKpis.length === 0 && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Filter size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Seleccione KPIs</h3>
          <p className="text-gray-600 mb-4">
            Seleccione al menos un KPI para visualizar los datos
          </p>
        </Card>
      )}

      {/* Gráficos de comparación */}
      {!error && comparisonData && selectedKpis.length > 0 && selectedLocationIds.length > 0 && (
        <div className="space-y-6">
          {/* Controles de vista y ordenamiento */}
          <Card className="p-4 bg-white shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Vista:</span>
                <div className="flex border rounded-lg overflow-hidden">
                  <Button 
                    variant={chartType === 'bar' ? 'primary' : 'ghost'} 
                    size="sm"
                    onClick={() => setChartType('bar')}
                  >
                    <BarChart3 size={16} />
                  </Button>
                  <Button 
                    variant={chartType === 'line' ? 'primary' : 'ghost'} 
                    size="sm"
                    onClick={() => setChartType('line')}
                  >
                    <LineChart size={16} />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">KPI a Visualizar:</span>
                <Select
                  options={kpiOptionsForChart}
                  value={selectedKpiForChart}
                  onChange={(value) => {
                    if (typeof value === 'string') {
                      setSelectedKpiForChart(value as KPI);
                    }
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Gráfico principal */}
          {comparisonData.data[selectedKpiForChart] && (
            <ComparisonChart
              data={comparisonData.data[selectedKpiForChart]}
              kpiLabel={KPI_DEFINITIONS.find((k) => k.id === selectedKpiForChart)?.label || selectedKpiForChart}
              kpiId={selectedKpiForChart}
              chartType={chartType}
            />
          )}

          {/* Gráficos para todos los KPIs seleccionados */}
          {selectedKpis.length > 1 && (
            <div className="mt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Comparativa Completa
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {selectedKpis
                  .filter((kpiId) => kpiId !== selectedKpiForChart && comparisonData.data[kpiId])
                  .map((kpiId) => (
                    <ComparisonChart
                      key={kpiId}
                      data={comparisonData.data[kpiId]}
                      kpiLabel={KPI_DEFINITIONS.find((k) => k.id === kpiId)?.label || kpiId}
                      kpiId={kpiId}
                      chartType={chartType}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Estado de carga */}
      {isLoading && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </Card>
      )}
    </div>
  );
};

