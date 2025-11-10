import React from 'react';
import { MetricCards, MetricCardData, Tooltip } from '../../../components/componentsreutilizables';
import { TaxSummary } from '../api/types';
import { DollarSign, TrendingUp, Receipt, FileText, TrendingDown, Calculator, Info } from 'lucide-react';

interface TaxSummaryReportProps {
  summaryData: TaxSummary;
  isLoading?: boolean;
}

// Componente helper para términos con tooltip y lenguaje claro
interface TermWithTooltipProps {
  simpleTerm: string;
  technicalTerm?: string;
  tooltip: string;
}

const TermWithTooltip: React.FC<TermWithTooltipProps> = ({
  simpleTerm,
  technicalTerm,
  tooltip
}) => {
  return (
    <div className="flex items-center gap-1.5">
      <span>{simpleTerm}</span>
      {technicalTerm && (
        <span className="text-xs text-gray-500 font-normal">({technicalTerm})</span>
      )}
      <Tooltip content={tooltip} position="top">
        <Info size={12} className="text-gray-400 hover:text-gray-600 cursor-help" />
      </Tooltip>
    </div>
  );
};

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
      title: (
        <TermWithTooltip
          simpleTerm="Total de Ingresos"
          technicalTerm="Ingresos Brutos"
          tooltip="Total de dinero que has recibido por tus servicios antes de descontar gastos e impuestos. Es la suma de todas tus ventas o facturas."
        />
      ),
      value: formatCurrency(summaryData.totalGross),
      subtitle: 'Antes de gastos e impuestos',
      icon: <DollarSign />,
      color: 'primary',
      loading: isLoading
    },
    {
      id: 'totalExpenses',
      title: (
        <TermWithTooltip
          simpleTerm="Total de Gastos"
          technicalTerm="Gastos Deducibles"
          tooltip="Gastos relacionados con tu actividad profesional que puedes descontar de tus ingresos para reducir el pago de impuestos. Ejemplos: material, desplazamientos, formación, etc."
        />
      ),
      value: formatCurrency(summaryData.totalExpenses),
      subtitle: 'Gastos que puedes descontar',
      icon: <TrendingDown />,
      color: 'warning',
      loading: isLoading
    },
    {
      id: 'netProfit',
      title: (
        <TermWithTooltip
          simpleTerm="Ganancia Neta"
          technicalTerm="Beneficio Neto"
          tooltip="Lo que realmente has ganado: ingresos menos gastos. Esta es la cantidad sobre la que se calcularán los impuestos."
        />
      ),
      value: formatCurrency(summaryData.netProfit),
      subtitle: summaryData.netProfit >= 0 ? 'Ingresos menos gastos' : 'Pérdida',
      icon: <Calculator />,
      color: summaryData.netProfit >= 0 ? 'success' : 'error',
      loading: isLoading
    },
    {
      id: 'totalNet',
      title: (
        <TermWithTooltip
          simpleTerm="Base para Calcular Impuestos"
          technicalTerm="Base Imponible"
          tooltip="Cantidad sobre la que se calculan los impuestos (IRPF). Normalmente son tus ingresos menos tus gastos. En algunos regímenes fiscales se aplican coeficientes reductores."
        />
      ),
      value: formatCurrency(summaryData.totalNet),
      subtitle: 'Después de descontar IVA',
      icon: <TrendingUp />,
      color: 'info',
      loading: isLoading
    },
    {
      id: 'totalVat',
      title: (
        <TermWithTooltip
          simpleTerm="IVA que Cobraste"
          technicalTerm="IVA Repercutido"
          tooltip="IVA que has incluido en tus facturas y que has cobrado a tus clientes. Este dinero debes ingresarlo a Hacienda, pero puedes descontar el IVA que has pagado en tus gastos."
        />
      ),
      value: formatCurrency(summaryData.totalVat),
      subtitle: 'IVA cobrado a clientes',
      icon: <Receipt />,
      color: 'info',
      loading: isLoading
    },
    {
      id: 'transactions',
      title: (
        <TermWithTooltip
          simpleTerm="Número de Transacciones"
          tooltip="Cantidad total de operaciones (ventas, pagos, etc.) realizadas en el periodo seleccionado."
        />
      ),
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
          Resumen de Ingresos y Gastos
        </h3>
        <p className="text-sm text-gray-600">
          Resumen de tus ingresos, gastos y datos fiscales para el periodo seleccionado. 
          Pasa el cursor sobre los términos para ver más información.
        </p>
      </div>
      <MetricCards data={metrics} columns={3} />
    </div>
  );
};

