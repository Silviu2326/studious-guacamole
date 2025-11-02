import React from 'react';
import { MetricCards } from '../../../components/componentsreutilizables';
import { ClientKPIs } from '../types';
import { TrendingUp, DollarSign, Clock, Calendar, Target, Activity } from 'lucide-react';

interface KpiDashboardProps {
  kpis: ClientKPIs;
}

export const KpiDashboard: React.FC<KpiDashboardProps> = ({ kpis }) => {
  const metrics = [
    {
      id: 'ltv',
      title: 'Lifetime Value',
      value: `€${kpis.ltv.toFixed(2)}`,
      color: 'info' as const,
    },
    {
      id: 'attendance',
      title: 'Asistencia (30d)',
      value: `${kpis.attendanceRate30d}%`,
      color: 'success' as const,
    },
    {
      id: 'lastVisit',
      title: 'Última visita',
      value: `${kpis.daysSinceLastVisit} ${kpis.daysSinceLastVisit === 1 ? 'día' : 'días'}`,
      color: kpis.daysSinceLastVisit > 7 ? 'warning' as const : 'info' as const,
    },
    {
      id: 'balance',
      title: 'Saldo pendiente',
      value: `€${kpis.outstandingBalance.toFixed(2)}`,
      color: kpis.outstandingBalance > 0 ? 'danger' as const : 'success' as const,
    },
    {
      id: 'sessions',
      title: 'Total sesiones',
      value: kpis.totalSessions?.toString() || '0',
      color: 'info' as const,
    },
    {
      id: 'adherence',
      title: 'Adherencia',
      value: `${kpis.adherenceRate || 0}%`,
      color: (kpis.adherenceRate || 0) >= 80 ? 'success' as const : 
             (kpis.adherenceRate || 0) >= 60 ? 'warning' as const : 'danger' as const,
    },
  ];

  return <MetricCards data={metrics} />;
};

