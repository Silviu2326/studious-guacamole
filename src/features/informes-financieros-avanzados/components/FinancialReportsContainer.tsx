import React, { useState, useEffect } from 'react';
import { MetricCards } from '../../../components/componentsreutilizables';
import { Card, Table, Button } from '../../../components/componentsreutilizables';
import { AdvancedFilters } from './AdvancedFilters';
import { TimeSeriesChart } from './TimeSeriesChart';
import { Filters, Location, KPISummary, MRREvolutionData, ServiceProfitability } from '../types';
import { locationsApi, kpiSummaryApi, mrrEvolutionApi, serviceProfitabilityApi } from '../api';
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Users,
  Percent,
  Download,
} from 'lucide-react';
import type { MetricCardData } from '../../../components/componentsreutilizables';

export const FinancialReportsContainer: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filters, setFilters] = useState<Filters>({
    dateRange: {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    },
    locationIds: [],
  });
  const [kpis, setKpis] = useState<KPISummary | null>(null);
  const [mrrEvolution, setMrrEvolution] = useState<MRREvolutionData[]>([]);
  const [serviceProfitability, setServiceProfitability] = useState<ServiceProfitability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingKPIs, setIsLoadingKPIs] = useState(true);
  const [isLoadingMRR, setIsLoadingMRR] = useState(true);
  const [isLoadingProfitability, setIsLoadingProfitability] = useState(true);

  // Cargar sedes al inicio
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const data = await locationsApi.obtenerTodasLasSedes();
        setLocations(data);
      } catch (error) {
        console.error('Error al cargar sedes:', error);
      }
    };
    loadLocations();
  }, []);

  // Cargar datos cuando cambian los filtros
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setIsLoadingKPIs(true);
      setIsLoadingMRR(true);
      setIsLoadingProfitability(true);

      try {
        // Cargar KPIs
        const kpiData = await kpiSummaryApi.obtenerKPISummary(
          filters.dateRange.startDate,
          filters.dateRange.endDate,
          filters.locationIds.length > 0 ? filters.locationIds : undefined
        );
        setKpis(kpiData);
        setIsLoadingKPIs(false);

        // Cargar evolución MRR
        const mrrData = await mrrEvolutionApi.obtenerEvolucionMRR(
          filters.dateRange.startDate,
          filters.dateRange.endDate,
          'monthly',
          filters.locationIds.length > 0 ? filters.locationIds : undefined
        );
        setMrrEvolution(mrrData);
        setIsLoadingMRR(false);

        // Cargar rentabilidad por servicio
        const profitabilityData = await serviceProfitabilityApi.obtenerRentabilidadPorServicio(
          filters.dateRange.startDate,
          filters.dateRange.endDate,
          filters.locationIds.length > 0 ? filters.locationIds : undefined
        );
        setServiceProfitability(profitabilityData);
        setIsLoadingProfitability(false);
      } catch (error) {
        console.error('Error al cargar datos financieros:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [filters]);

  const formatCurrency = (value: number): string => {
    return `€${value.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getKPIMetrics = (): MetricCardData[] => {
    if (!kpis) return [];

    return [
      {
        id: 'mrr',
        title: 'Ingreso Mensual Recurrente (MRR)',
        value: formatCurrency(kpis.mrr.current),
        trend: {
          value: Math.abs(kpis.mrr.change),
          direction: kpis.mrr.change >= 0 ? 'up' : 'down',
          label: 'vs período anterior',
        },
        icon: <DollarSign className="w-5 h-5" />,
        color: 'primary',
        loading: isLoadingKPIs,
      },
      {
        id: 'churn',
        title: 'Tasa de Churn de Ingresos',
        value: `${kpis.revenueChurnRate.current.toFixed(1)}%`,
        trend: {
          value: Math.abs(kpis.revenueChurnRate.change),
          direction: kpis.revenueChurnRate.change >= 0 ? 'up' : 'down',
          label: 'vs período anterior',
        },
        icon: <TrendingDown className="w-5 h-5" />,
        color: kpis.revenueChurnRate.change >= 0 ? 'error' : 'success',
        loading: isLoadingKPIs,
      },
      {
        id: 'ltv',
        title: 'Valor de Vida del Cliente (LTV)',
        value: formatCurrency(kpis.ltv.current),
        trend: {
          value: Math.abs(kpis.ltv.change),
          direction: kpis.ltv.change >= 0 ? 'up' : 'down',
          label: 'vs período anterior',
        },
        icon: <Users className="w-5 h-5" />,
        color: 'info',
        loading: isLoadingKPIs,
      },
      {
        id: 'cac',
        title: 'Costo de Adquisición (CAC)',
        value: formatCurrency(kpis.cac.current),
        trend: {
          value: Math.abs(kpis.cac.change),
          direction: kpis.cac.change >= 0 ? 'up' : 'down',
          label: 'vs período anterior',
        },
        icon: <DollarSign className="w-5 h-5" />,
        color: 'warning',
        loading: isLoadingKPIs,
      },
      ...(kpis.averageTicketPerMember
        ? [
            {
              id: 'ticket-member',
              title: 'Ticket Medio por Miembro',
              value: formatCurrency(kpis.averageTicketPerMember.current),
              trend: {
                value: Math.abs(kpis.averageTicketPerMember.change),
                direction: kpis.averageTicketPerMember.change >= 0 ? 'up' : 'down',
                label: 'vs período anterior',
              },
              icon: <Users className="w-5 h-5" />,
              color: 'info' as const,
              loading: isLoadingKPIs,
            },
          ]
        : []),
      ...(kpis.grossMargin
        ? [
            {
              id: 'margin',
              title: 'Margen Bruto',
              value: `${(kpis.grossMargin.current * 100).toFixed(1)}%`,
              trend: {
                value: Math.abs(kpis.grossMargin.change),
                direction: kpis.grossMargin.change >= 0 ? 'up' : 'down',
                label: 'vs período anterior',
              },
              icon: <Percent className="w-5 h-5" />,
              color: 'success' as const,
              loading: isLoadingKPIs,
            },
          ]
        : []),
    ];
  };

  const handleExportCSV = () => {
    if (!serviceProfitability || serviceProfitability.length === 0) return;

    const headers = ['Servicio', 'Ingresos Totales', 'Costos Directos', 'Margen Bruto', 'Margen %'];
    const rows = serviceProfitability.map((service) => [
      service.serviceName,
      formatCurrency(service.totalRevenue),
      formatCurrency(service.directCosts),
      formatCurrency(service.totalRevenue - service.directCosts),
      `${(service.grossMargin * 100).toFixed(1)}%`,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rentabilidad-servicios-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <AdvancedFilters
        locations={locations}
        onFiltersChange={setFilters}
        initialFilters={filters}
      />

      {/* KPIs */}
      <div>
        <MetricCards data={getKPIMetrics()} columns={4} />
      </div>

      {/* Evolución MRR */}
      <TimeSeriesChart
        data={mrrEvolution}
        dataKey="mrr"
        title="Evolución del MRR"
        isLoading={isLoadingMRR}
        formatValue={(value) => formatCurrency(value)}
      />

      {/* Rentabilidad por Servicio */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Rentabilidad por Servicio
            </h3>
          </div>
          <Button onClick={handleExportCSV} variant="primary" size="sm">
            <Download size={16} className="mr-2" />
            Exportar CSV
          </Button>
        </div>

        <Table
          data={serviceProfitability}
          columns={[
            {
              key: 'serviceName',
              label: 'Servicio',
              sortable: true,
            },
            {
              key: 'totalRevenue',
              label: 'Ingresos Totales',
              sortable: true,
              align: 'right',
              render: (value) => formatCurrency(value as number),
            },
            {
              key: 'directCosts',
              label: 'Costos Directos',
              sortable: true,
              align: 'right',
              render: (value) => formatCurrency(value as number),
            },
            {
              key: 'grossMargin',
              label: 'Margen Bruto',
              sortable: true,
              align: 'right',
              render: (_, row) => {
                const margin = row.totalRevenue - row.directCosts;
                return formatCurrency(margin);
              },
            },
            {
              key: 'grossMargin',
              label: 'Margen %',
              sortable: true,
              align: 'right',
              render: (value) => `${((value as number) * 100).toFixed(1)}%`,
            },
          ]}
          loading={isLoadingProfitability}
          emptyMessage="No hay datos de rentabilidad disponibles"
        />
      </Card>
    </div>
  );
};

