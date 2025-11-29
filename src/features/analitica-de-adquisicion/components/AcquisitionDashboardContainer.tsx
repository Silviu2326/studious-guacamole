import React, { useState } from 'react';
import { useAcquisitionApi } from '../hooks/useAcquisitionApi';
import { MetricCards } from '../../../components/componentsreutilizables';
import { AcquisitionChannelChart } from './AcquisitionChannelChart';
import { CampaignsTable } from './CampaignsTable';
import { Button, Modal } from '../../../components/componentsreutilizables';
import { AcquisitionFilters } from '../types';
import { Calendar, Download, Filter, Plus, BarChart3, PieChart as PieChartIcon, TrendingUp, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';

interface AcquisitionDashboardContainerProps {
  isEntrenador: boolean;
}

export const AcquisitionDashboardContainer: React.FC<AcquisitionDashboardContainerProps> = ({
  isEntrenador,
}) => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Últimos 30 días
    endDate: new Date(),
  });
  
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');
  const [chartMetric, setChartMetric] = useState<'leads' | 'conversions' | 'cpa' | 'revenue'>('leads');
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelSource, setNewChannelSource] = useState('');
  const [newChannelMedium, setNewChannelMedium] = useState('');

  const filters: AcquisitionFilters = {
    dateRange,
    channel: selectedChannel || undefined,
  };

  const { summary, channels, campaigns, isLoading, error, refetch } = useAcquisitionApi(
    filters,
    isEntrenador
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return { value: 0, direction: 'neutral' as const };
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change),
      direction: change > 0 ? ('up' as const) : change < 0 ? ('down' as const) : ('neutral' as const),
      label: 'vs período anterior',
    };
  };

  const getMetricCards = () => {
    if (!summary) return [];

    const metrics = [
      {
        id: 'total-leads',
        title: 'Total de Leads',
        value: summary.totalLeads.current.toString(),
        subtitle: `${summary.totalLeads.previous} en el período anterior`,
        trend: calculateTrend(summary.totalLeads.current, summary.totalLeads.previous),
        icon: <TrendingUp className="w-6 h-6" />,
        color: 'primary' as const,
      },
      {
        id: 'conversions',
        title: 'Conversiones',
        value: summary.totalConversions.current.toString(),
        subtitle: `${summary.totalConversions.previous} en el período anterior`,
        trend: calculateTrend(summary.totalConversions.current, summary.totalConversions.previous),
        icon: <BarChart3 className="w-6 h-6" />,
        color: 'success' as const,
      },
      {
        id: 'conversion-rate',
        title: 'Tasa de Conversión',
        value: formatPercentage(summary.conversionRate.current),
        subtitle: formatPercentage(summary.conversionRate.previous) + ' en el período anterior',
        trend: calculateTrend(
          summary.conversionRate.current,
          summary.conversionRate.previous
        ),
        icon: <PieChartIcon className="w-6 h-6" />,
        color: 'info' as const,
      },
      {
        id: 'cpa',
        title: 'Costo por Adquisición (CPA)',
        value: formatCurrency(summary.cpa.current),
        subtitle: formatCurrency(summary.cpa.previous) + ' en el período anterior',
        trend: calculateTrend(summary.cpa.current, summary.cpa.previous),
        icon: <Calendar className="w-6 h-6" />,
        color: summary.cpa.current < summary.cpa.previous ? ('success' as const) : ('warning' as const),
      },
    ];

    if (!isEntrenador && summary.roas) {
      metrics.push({
        id: 'roas',
        title: 'ROAS',
        value: summary.roas.current.toFixed(2) + 'x',
        subtitle: summary.roas.previous.toFixed(2) + 'x en el período anterior',
        trend: calculateTrend(summary.roas.current, summary.roas.previous),
        icon: <TrendingUp className="w-6 h-6" />,
        color: summary.roas.current > summary.roas.previous ? ('success' as const) : ('warning' as const),
      });
    }

    if (!isEntrenador && summary.ltv) {
      metrics.push({
        id: 'ltv',
        title: 'LTV Promedio',
        value: formatCurrency(summary.ltv.current),
        subtitle: formatCurrency(summary.ltv.previous) + ' en el período anterior',
        trend: calculateTrend(summary.ltv.current, summary.ltv.previous),
        icon: <TrendingUp className="w-6 h-6" />,
        color: 'primary' as const,
      });
    }

    return metrics;
  };

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    const date = new Date(value);
    if (type === 'start') {
      setDateRange({ ...dateRange, startDate: date });
    } else {
      setDateRange({ ...dateRange, endDate: date });
    }
  };

  const handleExportPDF = () => {
    // Simular exportación a PDF
    alert('Funcionalidad de exportación a PDF próximamente');
  };

  const handleExportCSV = () => {
    // Simular exportación a CSV
    alert('Funcionalidad de exportación a CSV próximamente');
  };

  const handleCreateChannel = () => {
    // Aquí se implementaría la creación del canal
    setShowChannelModal(false);
    setNewChannelName('');
    setNewChannelSource('');
    setNewChannelMedium('');
    refetch();
  };

  if (error) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <div className="text-center py-12">
          <p className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refetch}>Reintentar</Button>
        </div>
      </Card>
    );
  }

  const channelOptions = channels
    ? [
        { value: '', label: 'Todos los canales' },
        ...channels.map((ch) => ({
          value: ch.channel,
          label: ch.channel,
        })),
      ]
    : [{ value: '', label: 'Todos los canales' }];

  const filtrosActivos = (selectedChannel ? 1 : 0);
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        {!isEntrenador && (
          <Button onClick={() => setShowChannelModal(true)}>
            <Plus size={20} className="mr-2" />
            Nuevo Canal
          </Button>
        )}
        <Button variant="secondary" onClick={handleExportPDF} className="ml-2">
          <Download size={20} className="mr-2" />
          Exportar PDF
        </Button>
        <Button variant="secondary" onClick={handleExportCSV} className="ml-2">
          <Download size={20} className="mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={dateRange.startDate.toISOString().split('T')[0]}
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-3 pr-3 py-2.5"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={dateRange.endDate.toISOString().split('T')[0]}
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-3 pr-3 py-2.5"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Filter size={16} className="inline mr-1" />
                    Canal
                  </label>
                  <div className="relative">
                    <select
                      value={selectedChannel}
                      onChange={(e) => setSelectedChannel(e.target.value)}
                      className="w-full appearance-none rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 py-2.5 pl-3 pr-9"
                    >
                      {channelOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="flex items-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
                  className="flex items-center gap-2 bg-white text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50 shadow-sm"
                >
                  <Filter size={16} />
                  Filtros
                  {filtrosActivos > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center shadow-sm">
                      {filtrosActivos}
                    </span>
                  )}
                  {mostrarFiltrosAvanzados ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Button>

                {filtrosActivos > 0 && (
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedChannel('')}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    <X size={16} className="mr-1" />
                    Limpiar
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Resumen de resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{campaigns?.data?.length || 0} resultados encontrados</span>
            <span>{filtrosActivos} filtro{filtrosActivos !== 1 ? 's' : ''} aplicado{filtrosActivos !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </Card>

      {/* KPIs */}
      {isLoading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600">Cargando métricas...</p>
          </div>
        </Card>
      ) : (
        <MetricCards data={getMetricCards()} columns={isEntrenador ? 4 : 6} />
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card className="p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Configuración del Gráfico
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Gráfico
                </label>
                <div className="relative">
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value as 'bar' | 'pie' | 'line')}
                    className="w-full appearance-none rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 py-2.5 pl-3 pr-9"
                  >
                    <option value="bar">Barras</option>
                    <option value="pie">Circular</option>
                    <option value="line">Líneas</option>
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Métrica
                </label>
                <div className="relative">
                  <select
                    value={chartMetric}
                    onChange={(e) => setChartMetric(e.target.value as 'leads' | 'conversions' | 'cpa' | 'revenue')}
                    className="w-full appearance-none rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 py-2.5 pl-3 pr-9"
                  >
                    <option value="leads">Leads</option>
                    <option value="conversions">Conversiones</option>
                    <option value="cpa">CPA</option>
                    {!isEntrenador && <option value="revenue">Ingresos</option>}
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>
          </Card>
        </div>
        <AcquisitionChannelChart
          data={channels || []}
          chartType={chartType}
          title="Rendimiento por Canal"
          metric={chartMetric}
        />
      </div>

      {/* Tabla de Campañas */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Detalle de Campañas
        </h3>
        <CampaignsTable
          data={campaigns?.data || []}
          loading={isLoading}
        />
      </div>

      {/* Modal para crear canal personalizado */}
      <Modal
        isOpen={showChannelModal}
        onClose={() => {
          setShowChannelModal(false);
          setNewChannelName('');
          setNewChannelSource('');
          setNewChannelMedium('');
        }}
        title="Crear Canal Personalizado"
        size="md"
        footer={
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={() => setShowChannelModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateChannel}>
              Crear Canal
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nombre del Canal
            </label>
            <input
              type="text"
              placeholder="Ej: Flyers Centro Comercial"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-3 pr-3 py-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Fuente (Source)
            </label>
            <input
              type="text"
              placeholder="Ej: flyers"
              value={newChannelSource}
              onChange={(e) => setNewChannelSource(e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-3 pr-3 py-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Medio (Medium)
            </label>
            <input
              type="text"
              placeholder="Ej: offline"
              value={newChannelMedium}
              onChange={(e) => setNewChannelMedium(e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-3 pr-3 py-2.5"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

