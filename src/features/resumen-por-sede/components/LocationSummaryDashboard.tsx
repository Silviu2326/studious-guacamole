import React, { useState } from 'react';
import { useLocationAnalytics } from '../hooks/useLocationAnalytics';
import { DateRangeFilter } from './DateRangeFilter';
import { LocationKPITable } from './LocationKPITable';
import { KPIComparisonChart } from './KPIComparisonChart';
import { Button } from '../../../components/componentsreutilizables';
import { Card } from '../../../components/componentsreutilizables';
import { FileDown, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { startOfMonth, endOfMonth } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { LocationSummary, SortKey } from '../types';

export const LocationSummaryDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedKPI, setSelectedKPI] = useState<keyof LocationSummary>('totalRevenue');
  
  const initialDateRange = {
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
  };

  const {
    data,
    loading,
    error,
    dateRange,
    sortColumn,
    sortDirection,
    loadData,
    handleSort,
    exportData,
    clearError,
  } = useLocationAnalytics(initialDateRange);

  const handleDateRangeApply = async () => {
    // Los datos ya se actualizan automáticamente cuando cambia dateRange
    // Este método puede ser usado para forzar una recarga si es necesario
    await loadData(dateRange);
  };

  const handleRowClick = (locationId: string) => {
    // Navegar al dashboard detallado de la sede
    // Asumiendo que existe una ruta como /analytics/locations/:locationId
    navigate(`/analytics/locations/${locationId}`);
  };

  const handleExportCSV = async () => {
    try {
      await exportData('csv');
    } catch (err) {
      console.error('Error al exportar CSV:', err);
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportData('pdf');
    } catch (err) {
      console.error('Error al exportar PDF:', err);
    }
  };

  const kpiOptions = [
    { value: 'totalRevenue', label: 'Ingresos Totales' },
    { value: 'newMembers', label: 'Nuevos Miembros' },
    { value: 'churnRate', label: 'Tasa de Abandono' },
    { value: 'activeMembers', label: 'Miembros Activos' },
    { value: 'avgClassAttendance', label: 'Asistencia Promedio' },
    { value: 'arpu', label: 'Ingreso Promedio por Miembro (ARPU)' },
  ];

  return (
    <div className="space-y-6">
      {/* Filtros de Fecha */}
      <DateRangeFilter
        dateRange={dateRange}
        onDateRangeChange={(range) => {
          // Actualizar el estado del hook cuando cambian las fechas
          loadData(range);
        }}
        onApply={handleDateRangeApply}
        loading={loading}
      />

      {/* Errores */}
      {error && (
        <Card className="p-8 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={clearError}>Reintentar</Button>
        </Card>
      )}

      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleExportCSV}
            disabled={loading || data.length === 0}
            leftIcon={<FileSpreadsheet size={20} className="mr-2" />}
          >
            Exportar CSV
          </Button>
          <Button
            variant="secondary"
            onClick={handleExportPDF}
            disabled={loading || data.length === 0}
            leftIcon={<FileDown size={20} className="mr-2" />}
          >
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Tabla de KPIs */}
      <LocationKPITable
        data={data}
        onSortChange={(column: SortKey) => handleSort(column)}
        onRowClick={handleRowClick}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        loading={loading}
      />

      {/* Gráfico Comparativo */}
      {data.length > 0 && (
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Seleccionar KPI para comparación:</span>
            </div>
            <select
              value={selectedKPI}
              onChange={(e) => setSelectedKPI(e.target.value as keyof LocationSummary)}
              className="rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
            >
              {kpiOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <KPIComparisonChart
            data={data}
            kpiKey={selectedKPI}
            chartTitle={kpiOptions.find(opt => opt.value === selectedKPI)?.label || 'Comparación de KPI'}
          />
        </Card>
      )}
    </div>
  );
};

