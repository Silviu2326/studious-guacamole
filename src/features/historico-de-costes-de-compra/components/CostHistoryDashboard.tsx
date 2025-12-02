import React, { useState, useEffect } from 'react';
import { Card, MetricCards, Button } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { CostFilterControls } from './CostFilterControls';
import { PriceEvolutionChart } from './PriceEvolutionChart';
import { CostDataTable } from './CostDataTable';
import { usePurchaseData } from '../hooks/usePurchaseData';
import { getSuppliers, getProductCategories } from '../api';
import { Supplier, ProductCategory } from '../types';
import { Download, TrendingUp, DollarSign, Package } from 'lucide-react';

export const CostHistoryDashboard: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [filters, setFilters] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
    supplierIds: [] as string[],
    categoryIds: [] as string[],
    productId: undefined as string | undefined,
  });
  const [sortColumn, setSortColumn] = useState<string>('productName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const { data, loading, error } = usePurchaseData(filters);

  useEffect(() => {
    const loadFiltersData = async () => {
      try {
        const [suppliersData, categoriesData] = await Promise.all([
          getSuppliers(),
          getProductCategories(),
        ]);
        setSuppliers(suppliersData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error loading filters data:', err);
      }
    };

    loadFiltersData();
  }, []);

  const handleFiltersChange = (newFilters: any) => {
    setFilters(prev => ({
      ...prev,
      from: new Date(newFilters.dateFrom || prev.from),
      to: new Date(newFilters.dateTo || prev.to),
      supplierIds: newFilters.supplierIds || [],
      categoryIds: newFilters.categoryIds || [],
    }));
  };

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleExportCSV = () => {
    if (!data || !data.tableData) return;

    const headers = ['Producto', 'Categoría', 'Proveedor', 'Último Precio', 'Precio Promedio', 'Precio Más Bajo', 'Variación'];
    const csvContent = [
      headers.join(','),
      ...data.tableData.map(row => [
        row.productName,
        row.category,
        row.supplier,
        row.lastPrice.toFixed(2),
        row.avgPrice.toFixed(2),
        row.lowestPrice.toFixed(2),
        row.priceVariation ? `${row.priceVariation.toFixed(1)}%` : '-',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `historico-costes-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const metrics = data ? [
    {
      id: 'total-spend',
      title: 'Gasto Total',
      value: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(data.kpis.totalSpend),
      subtitle: 'En el período seleccionado',
      icon: <DollarSign />,
      color: 'primary' as const,
    },
    {
      id: 'avg-cost',
      title: 'Coste Promedio',
      value: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.kpis.averageItemCost),
      subtitle: 'Por artículo',
      icon: <Package />,
      color: 'info' as const,
    },
    {
      id: 'price-change',
      title: 'Variación de Precio',
      value: `${data.kpis.priceChangePercentage.toFixed(1)}%`,
      subtitle: 'vs. período anterior',
      trend: {
        value: Math.abs(data.kpis.priceChangePercentage),
        direction: data.kpis.priceChangePercentage > 0 ? 'up' as const : 'down' as const,
      },
      icon: <TrendingUp />,
      color: (data.kpis.priceChangePercentage > 0 ? 'warning' : 'success') as const,
    },
  ] : [];

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <p className={`${ds.typography.bodyLarge} ${ds.color.error}`}>
            Error al cargar los datos: {error}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <CostFilterControls
        suppliers={suppliers}
        categories={categories}
        onFiltersChange={handleFiltersChange}
      />

      {/* KPIs */}
      {data && <MetricCards data={metrics} columns={3} />}

      {/* Gráfico */}
      <PriceEvolutionChart
        data={data?.chartData || []}
        isLoading={loading}
      />

      {/* Tabla de datos */}
      <div className="flex items-center justify-between">
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} font-semibold`}>
          Análisis Detallado de Productos
        </h3>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleExportCSV}
          disabled={!data || data.tableData.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      <CostDataTable
        data={data?.tableData || []}
        loading={loading}
        onSort={handleSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
      />
    </div>
  );
};

