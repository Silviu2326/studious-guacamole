import { Activity, TrendingDown, TrendingUp } from 'lucide-react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { LeadMetric } from '../api';

interface CrmSyncPanelProps {
  metrics: LeadMetric[];
}

const TREND_CONFIG: Record<NonNullable<LeadMetric['trend']>, { label: string; icon: JSX.Element; badge: 'green' | 'red' | 'gray' }> = {
  up: { label: 'Tendencia positiva', icon: <TrendingUp size={14} />, badge: 'green' },
  down: { label: 'Tendencia a la baja', icon: <TrendingDown size={14} />, badge: 'red' },
  stable: { label: 'Tendencia estable', icon: <Activity size={14} />, badge: 'gray' },
};

export function CrmSyncPanel({ metrics }: CrmSyncPanelProps) {
  return (
    <Card padding="none" className="bg-white shadow-sm ring-1 ring-slate-200">
      <div className="px-6 py-5">
        <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Seguimiento en CRM</h2>
            <p className="text-sm text-slate-600">
              Visualiza el impacto directo en tu pipeline. Los leads pasan a «Leads → Calificación» listos para gestión comercial.
            </p>
          </div>
          <Badge variant="blue" size="sm">
            Integración activa
          </Badge>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {metrics.map(metric => {
            const trend = metric.trend ? TREND_CONFIG[metric.trend] : null;

            return (
              <Card
                key={metric.id}
                className="bg-slate-50 ring-1 ring-slate-200"
                padding="lg"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{metric.label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{metric.value}</p>
                {trend && (
                  <Badge variant={trend.badge} size="sm" className="mt-3 flex items-center gap-1">
                    {trend.icon}
                    {trend.label}
                  </Badge>
                )}
              </Card>
            );
          })}
        </div>

        <Card className="mt-6 bg-blue-50 text-blue-900 ring-1 ring-blue-200" padding="lg">
          <p className="text-sm font-semibold uppercase tracking-wide">Automatizaciones activas</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Etiqueta «Landing - {new Date().getFullYear()}» aplicada a cada lead entrante.</li>
            <li>Notificación en tiempo real al equipo de CRM con detalles de campaña.</li>
            <li>Secuencia inicial de email/SMS disparada automáticamente (beta).</li>
          </ul>
        </Card>
      </div>
    </Card>
  );
}

