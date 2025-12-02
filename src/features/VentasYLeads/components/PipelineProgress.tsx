import { useMemo } from 'react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import type { LeadOpportunity, PipelineStage } from '../api';
import { CalendarClock, MessageCircle, Phone, Users2 } from 'lucide-react';

interface PipelineProgressProps {
  stages: PipelineStage[];
  leads: LeadOpportunity[];
}

const statusOrder: PipelineStage['status'][] = [
  'nuevo',
  'contactado',
  'cita_agendada',
  'no_presentado',
  'visita_realizada',
  'en_prueba',
  'cerrado_ganado',
  'cerrado_perdido',
];

const statusTitle: Record<PipelineStage['status'], string> = {
  nuevo: 'Nuevo',
  contactado: 'Contactado',
  cita_agendada: 'Cita agendada',
  visita_realizada: 'Visitó el centro',
  en_prueba: 'En prueba (7 días)',
  cerrado_ganado: 'Cerrado ganado',
  cerrado_perdido: 'Cerrado perdido',
  no_presentado: 'No presentado',
};

const columnAccent: Record<PipelineStage['status'], string> = {
  nuevo: 'from-sky-100 to-sky-200/80 border-sky-200',
  contactado: 'from-indigo-100 to-indigo-200/80 border-indigo-200',
  cita_agendada: 'from-amber-100 to-amber-200/80 border-amber-200',
  visita_realizada: 'from-purple-100 to-purple-200/80 border-purple-200',
  en_prueba: 'from-emerald-100 to-emerald-200/80 border-emerald-200',
  cerrado_ganado: 'from-green-100 to-green-200/80 border-green-200',
  cerrado_perdido: 'from-slate-200 to-slate-300/70 border-slate-300',
  no_presentado: 'from-rose-100 to-rose-200/80 border-rose-200',
};

const getStageSummary = (stage: PipelineStage | undefined, leadsInStage: LeadOpportunity[]) => {
  const value = stage?.potentialValue ?? leadsInStage.reduce((acc, lead) => acc + lead.potentialValue, 0);
  const total = stage?.leads ?? leadsInStage.length;
  const conversion = stage?.conversionFromPrevious ?? 0;

  return {
    value,
    total,
    conversion,
  };
};

const getLastInteraction = (lead: LeadOpportunity) => {
  const last = lead.lastContact;
  if (!last) return 'Sin contacto';
  const date = new Date(last.date);
  return `${date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
  })} · ${date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

export function PipelineProgress({ stages, leads }: PipelineProgressProps) {
  const leadsByStatus = useMemo(() => {
    return statusOrder.reduce<Record<string, LeadOpportunity[]>>((acc, status) => {
      acc[status] = leads.filter(lead => lead.status === status);
      return acc;
    }, {});
  }, [leads]);

  const conversionGlobal =
    Math.round(
      ((stages.find(stage => stage.status === 'cerrado_ganado')?.leads ?? 0) /
        Math.max(stages[0]?.leads ?? leads.length, 1)) *
        100
    ) || 0;

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-slate-700/40">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Pipeline comercial en tiempo real
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Visualiza estados, valor potencial y velocidad para intervenir donde el funnel pierde ritmo.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="purple" size="md">
              Conversión global {conversionGlobal}%
            </Badge>
            <Badge variant="blue" size="md">
              Valor pipeline{' '}
              {stages
                .reduce((acc, stage) => acc + stage.potentialValue, 0)
                .toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 0,
                })}
            </Badge>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
        {statusOrder.map(status => {
          const stage = stages.find(st => st.status === status);
          const columnsLeads = leadsByStatus[status] ?? [];
          const summary = getStageSummary(stage, columnsLeads);

          return (
            <div
              key={status}
              className={`flex h-full flex-col rounded-2xl border bg-gradient-to-b p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/40 ${columnAccent[status] ?? 'from-slate-100 to-white border-slate-200'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    {statusTitle[status] ?? status}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                    {summary.total}
                  </p>
                </div>
            <Badge variant="secondary" size="sm" className="bg-white/80 text-slate-700 dark:bg-slate-800">
                  {Math.round(summary.conversion * 100)}% conv.
                </Badge>
              </div>
              <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                {summary.value.toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 0,
                })}{' '}
                potencial
              </div>

              <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
                {columnsLeads.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/70 bg-white/40 px-3 py-4 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
                    Sin leads en esta fase
                  </div>
                ) : (
                  columnsLeads.map(lead => (
                    <div
                      key={lead.id}
                      className="rounded-2xl border border-white/40 bg-white/90 p-3 shadow-sm transition hover:border-indigo-200 hover:shadow-md dark:border-slate-700/80 dark:bg-slate-950/60"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {lead.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {lead.source} · {lead.sede}
                          </p>
                        </div>
                        <Badge variant="secondary" size="sm" className="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                          {Math.round(lead.probability * 100)}%
                        </Badge>
                      </div>

                      <div className="mt-3 grid gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <Users2 className="h-4 w-4 text-slate-400" />
                          <span>{lead.owner}</span>
                          <span className="h-1 w-1 rounded-full bg-slate-200" />
                          <span>
                            {lead.ownerRole === 'comercial' ? 'Comercial' : 'Entrenador'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarClock className="h-4 w-4 text-slate-400" />
                          <span>{lead.nextAction?.label ?? 'Plan sin definir'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <span>{getLastInteraction(lead)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-100">
                          <MessageCircle className="h-4 w-4 text-emerald-500" />
                          <span>
                            {lead.potentialValue.toLocaleString('es-ES', {
                              style: 'currency',
                              currency: 'EUR',
                              maximumFractionDigits: 0,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
