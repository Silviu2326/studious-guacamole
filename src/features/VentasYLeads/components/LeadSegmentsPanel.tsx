import { useMemo, useState } from 'react';
import { Briefcase, ChevronRight, Users, Wallet } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  Tabs,
  type TabItem,
} from '../../../components/componentsreutilizables';
import type { LeadSegment } from '../api';

interface LeadSegmentsPanelProps {
  segments: LeadSegment[];
}

const getIconForSegment = (segmentId: string) => {
  switch (segmentId) {
    case 'corporate':
      return <Briefcase className="h-5 w-5" />;
    case 'high-value':
      return <Wallet className="h-5 w-5" />;
    case 'referrals':
      return <Users className="h-5 w-5" />;
    default:
      return <Users className="h-5 w-5" />;
  }
};

export function LeadSegmentsPanel({ segments }: LeadSegmentsPanelProps) {
  const [activeSegmentId, setActiveSegmentId] = useState<string>(
    segments[0]?.id ?? ''
  );

  const tabs: TabItem[] = useMemo(
    () =>
      segments.map(segment => ({
        id: segment.id,
        label: segment.label,
        icon: getIconForSegment(segment.id),
      })),
    [segments]
  );

  const activeSegment = useMemo(
    () => segments.find(segment => segment.id === activeSegmentId),
    [segments, activeSegmentId]
  );

  if (segments.length === 0 || !activeSegment) {
    return null;
  }

  return (
    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Segmentos prioritarios
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Personaliza playbooks y mensajes por cohortes con alto potencial de cierre.
            </p>
          </div>
          <Button variant="secondary" className="self-start">
            <span className="mr-2">Ver scoring avanzado</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Tabs
          items={tabs}
          activeTab={activeSegmentId}
          onTabChange={setActiveSegmentId}
          variant="pills"
          fullWidth
        />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6 dark:border-slate-700/40 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                    Leads activos
                  </p>
                  <p className="mt-2 text-4xl font-black text-slate-900 dark:text-white">
                    {activeSegment.totalLeads}
                  </p>
                </div>
                <Badge variant="purple" size="md">
                  {(activeSegment.conversionRate * 100).toFixed(0)}% conversión
                </Badge>
              </div>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                {activeSegment.description}
              </p>
            </div>

            <div className="rounded-2xl border border-dashed border-indigo-200 p-4 text-sm text-indigo-700 dark:border-indigo-500/60 dark:text-indigo-200">
              <p className="font-semibold">Recomendación</p>
              <p className="mt-1">
                Crea una secuencia de nurturing específica con automatizaciones y
                landing page dedicada para este segmento.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-900">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Valor promedio
              </h4>
              <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                {activeSegment.averageValue.toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Ticket medio por cliente adquirido en este segmento.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-6 dark:border-slate-700/50 dark:bg-slate-800/60">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                Próximas acciones sugeridas
              </h4>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
                <li>Actualiza mensajes y ofertas personalizadas.</li>
                <li>Sincroniza audiencias con campañas pagadas.</li>
                <li>Activa alertas cuando un lead de este segmento entra en riesgo.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

