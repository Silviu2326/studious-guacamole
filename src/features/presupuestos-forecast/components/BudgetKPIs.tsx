import React from 'react';
import { MetricCards, MetricCardData } from '../../../components/componentsreutilizables';
import { TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle } from 'lucide-react';
import { BudgetKPIs as BudgetKPIsType } from '../types';

interface BudgetKPIsProps {
  kpis: BudgetKPIsType;
  loading?: boolean;
}

export const BudgetKPIs: React.FC<BudgetKPIsProps> = ({
  kpis,
  loading = false
}) => {
  const metrics: MetricCardData[] = [
    {
      id: 'deviation',
      title: 'Desviación Total',
      value: `${kpis.totalDeviationPercentage > 0 ? '+' : ''}${kpis.totalDeviationPercentage.toFixed(1)}%`,
      subtitle: 'vs Presupuesto',
      trend: {
        value: Math.abs(kpis.totalDeviationPercentage),
        direction: kpis.totalDeviationPercentage >= 0 ? 'up' : 'down',
        label: kpis.totalDeviationPercentage >= 0 ? 'Por encima' : 'Por debajo'
      },
      icon: kpis.totalDeviationPercentage >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />,
      color: kpis.totalDeviationPercentage >= 0 ? 'success' : 'error',
      loading
    },
    {
      id: 'income',
      title: 'Ingresos Reales',
      value: `€${kpis.incomeDeviation >= 0 ? '+' : ''}${Math.abs(kpis.incomeDeviation).toLocaleString('es-ES')}`,
      subtitle: 'vs Presupuestado',
      icon: <DollarSign className="w-5 h-5" />,
      color: kpis.incomeDeviation >= 0 ? 'success' : 'warning',
      loading
    },
    {
      id: 'expenses',
      title: 'Gastos Reales',
      value: `€${kpis.expenseDeviation >= 0 ? '-' : '+'}${Math.abs(kpis.expenseDeviation).toLocaleString('es-ES')}`,
      subtitle: 'vs Presupuestado',
      icon: <AlertTriangle className="w-5 h-5" />,
      color: kpis.expenseDeviation <= 0 ? 'success' : 'error',
      loading
    },
    {
      id: 'profit',
      title: 'Beneficio Proyectado',
      value: `€${kpis.netProfitProjected.toLocaleString('es-ES')}`,
      subtitle: 'Año completo',
      trend: kpis.netProfitProjected >= 0 ? {
        value: 100,
        direction: 'up',
      } : {
        value: 100,
        direction: 'down',
      },
      icon: <Target className="w-5 h-5" />,
      color: kpis.netProfitProjected >= 0 ? 'success' : 'error',
      loading
    }
  ];

  return (
    <MetricCards data={metrics} columns={4} />
  );
};

