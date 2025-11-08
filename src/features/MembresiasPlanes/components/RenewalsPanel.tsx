import {
  AlertTriangle,
  BadgeCheck,
  CalendarClock,
  ClipboardList,
  Headset,
  Shield,
} from 'lucide-react';
import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import type { RenewalInsight } from '../api';

interface RenewalsPanelProps {
  renewals: RenewalInsight[];
}

const riskVariant: Record<RenewalInsight['churnRisk'], 'red' | 'orange' | 'green'> = {
  alto: 'red',
  medio: 'orange',
  bajo: 'green',
};

const riskLabel: Record<RenewalInsight['churnRisk'], string> = {
  alto: 'Alto riesgo',
  medio: 'Riesgo medio',
  bajo: 'Riesgo bajo',
};

export function RenewalsPanel({ renewals }: RenewalsPanelProps) {
  if (renewals.length === 0) {
    return (
      <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          No hay renovaciones programadas en las próximas semanas.
        </p>
      </Card>
    );
  }

  const highRisk = renewals.filter(item => item.churnRisk === 'alto').length;
  const mediumRisk = renewals.filter(item => item.churnRisk === 'medio').length;

  return (
    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/60 dark:ring-slate-700/40" padding="lg">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Renovaciones & bajas</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Prioriza clientes en riesgo, asigna responsables y dispara playbooks de retención.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="purple" size="md">
              {renewals.length} renovaciones próximas
            </Badge>
            <Badge variant="red" size="md">
              {highRisk} alto riesgo
            </Badge>
            <Badge variant="orange" size="md">
              {mediumRisk} riesgo medio
            </Badge>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-rose-200/80 bg-rose-50/60 px-4 py-3 dark:border-rose-400/30 dark:bg-rose-500/10">
            <div className="flex items-center gap-2 text-sm font-semibold text-rose-800 dark:text-rose-300">
              <AlertTriangle size={16} />
              Riesgos críticos
            </div>
            <p className="mt-1 text-xs text-rose-700/80 dark:text-rose-200/80">
              Ejecuta playbook de retención personalizada en 24h.
            </p>
          </div>
          <div className="rounded-xl border border-indigo-200/80 bg-indigo-50/60 px-4 py-3 dark:border-indigo-400/30 dark:bg-indigo-500/10">
            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-800 dark:text-indigo-200">
              <ClipboardList size={16} />
              Playbooks asignados
            </div>
            <p className="mt-1 text-xs text-indigo-700/80 dark:text-indigo-300/80">
              Activos: Recuperar morosos, Upgrade digital, Corporate renewal.
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/60 px-4 py-3 dark:border-emerald-400/30 dark:bg-emerald-500/10">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-200">
              <BadgeCheck size={16} />
              Cierres asegurados
            </div>
            <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-300/80">
              Clientes VIP con engagement alto y renovación confirmada.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {renewals.map(renewal => (
            <div
              key={renewal.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-slate-50 p-5 shadow-sm transition hover:border-indigo-200 hover:bg-white dark:border-slate-700/40 dark:bg-slate-900/40 dark:hover:border-indigo-500/30 dark:hover:bg-slate-900/60"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{renewal.memberName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{renewal.planName}</p>
                </div>
                <Badge variant={riskVariant[renewal.churnRisk]} size="sm">
                  {riskLabel[renewal.churnRisk]}
                </Badge>
              </div>

              <div className="grid gap-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CalendarClock size={14} className="text-indigo-500" />
                  <span>
                    Renovación:{' '}
                    {new Date(renewal.renewalDate).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-slate-500" />
                  <span>Playbook: {renewal.playbook}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headset size={14} className="text-slate-500" />
                  <span>Responsable: {renewal.owner}</span>
                </div>
              </div>

              <div className="rounded-lg border border-indigo-100/70 bg-white p-3 text-sm dark:border-indigo-500/20 dark:bg-indigo-500/5">
                <p className="font-medium text-slate-800 dark:text-slate-100">{renewal.nextAction}</p>
                {renewal.reason && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Motivo: {renewal.reason}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="primary" size="sm" className="!px-3 !py-1 text-xs">
                  Ejecutar acción
                </Button>
                <Button variant="ghost" size="sm" className="!px-3 !py-1 text-xs">
                  Reasignar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
