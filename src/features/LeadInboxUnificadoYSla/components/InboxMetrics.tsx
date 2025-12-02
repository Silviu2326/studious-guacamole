import React from 'react';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import { 
  Inbox, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  MessageSquare,
  Users,
  Zap
} from 'lucide-react';

interface InboxMetricsProps {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  convertedLeads: number;
  onTimeSLA: number;
  atRiskSLA: number;
  overdueSLA: number;
  avgResponseTime: number;
  conversionRate: number;
}

export const InboxMetrics: React.FC<InboxMetricsProps> = ({
  totalLeads,
  newLeads,
  contactedLeads,
  convertedLeads,
  onTimeSLA,
  atRiskSLA,
  overdueSLA,
  avgResponseTime,
  conversionRate
}) => {
  const metrics = [
    {
      id: 'total-leads',
      title: 'Total Leads',
      value: totalLeads.toString(),
      icon: <Inbox className="w-5 h-5" />,
      color: 'info' as const,
      subtitle: `${newLeads} nuevos`
    },
    {
      id: 'sla-on-time',
      title: 'SLA a Tiempo',
      value: `${onTimeSLA}%`,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'success' as const,
      subtitle: `${atRiskSLA + overdueSLA} en riesgo`
    },
    {
      id: 'avg-response',
      title: 'Tiempo Promedio',
      value: `${avgResponseTime}m`,
      icon: <Clock className="w-5 h-5" />,
      color: 'info' as const,
      subtitle: 'Tiempo de respuesta'
    },
    {
      id: 'conversion-rate',
      title: 'Tasa Conversión',
      value: `${conversionRate}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'primary' as const,
      subtitle: `${convertedLeads} convertidos`
    }
  ];

  return (
    <div className="space-y-4">
      <MetricCards data={metrics} columns={4} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Nuevos</span>
              <MessageSquare className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{newLeads}</p>
            <p className="text-xs text-gray-500 mt-1">Sin contactar</p>
          </div>
        </Card>

        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Contactados</span>
              <Users className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{contactedLeads}</p>
            <p className="text-xs text-gray-500 mt-1">En proceso</p>
          </div>
        </Card>

        <Card className="bg-white shadow-sm border-l-4 border-orange-400">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">En Riesgo</span>
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{atRiskSLA + overdueSLA}</p>
            <p className="text-xs text-gray-500 mt-1">SLA próximo a vencer</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

