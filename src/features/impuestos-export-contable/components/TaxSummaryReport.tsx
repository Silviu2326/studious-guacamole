import React from 'react';
import { MetricCards, MetricCardData } from '../../../components/componentsreutilizables';
import { TaxSummary } from '../api/types';
import { DollarSign, TrendingUp, Receipt, FileText } from 'lucide-react';

interface TaxSummaryReportProps {
  summaryData: TaxSummary;
  isLoading?: boolean;
}

export const TaxSummaryReport: React.FC<TaxSummaryReportProps> = ({
  summaryData,
  isLoading = false
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: summaryData.currency
    }).format(amount);
  };

  const metrics: MetricCardData[] = [
    {
      id: 'totalGross',
      title: 'Total Ingresos Brutos',
      value: formatCurrency(summaryData.totalGross),
      subtitle: 'Antes de impuestos',
      icon: <DollarSign />,
      color: 'primary',
      loading: isLoading
    },
    {
      id: 'totalNet',
      title: 'Base Imponible',
      value: formatCurrency(summaryData.totalNet),
      subtitle: 'Después de IVA',
      icon: <TrendingUp />,
      color: 'success',
      loading: isLoading
    },
    {
      id: 'totalVat',
      title: 'IVA Repercutido',
      value: formatCurrency(summaryData.totalVat),
      subtitle: 'Total cobrado a clientes',
      icon: <Receipt />,
      color: 'info',
      loading: isLoading
    },
    {
      id: 'transactions',
      title: 'Transacciones',
      value: summaryData.transactionCount.toLocaleString('es-ES'),
      subtitle: 'Total en el periodo',
      icon: <FileText />,
      color: 'warning',
      loading: isLoading
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Resumen Fiscal del Periodo
        </h3>
        <p className="text-sm text-gray-600">
          Métricas fiscales agregadas para el periodo seleccionado
        </p>
      </div>
      <MetricCards data={metrics} columns={4} />
    </div>
  );
};

