import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import { BarChart3, Building2, Globe2, Plus, Radio } from 'lucide-react';
import type { CorporatePlan } from '../api';

interface CorporatePlansPanelProps {
  corporatePlans: CorporatePlan[];
}

export function CorporatePlansPanel({ corporatePlans }: CorporatePlansPanelProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/60 dark:ring-slate-700/40" padding="lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Planes corporate & multisede</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Diseña propuestas por volumen, gestiona empresas activas y controla la facturación multi-sede.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm" leftIcon={<Plus size={14} />}>
              Crear plan corporate
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Building2 size={14} />}>
              Vincular empresa
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<BarChart3 size={14} />}>
              Ver facturación
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {corporatePlans.map(plan => (
          <Card key={plan.id} className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/60 dark:ring-slate-700/40" padding="lg">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{plan.name}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">{plan.description}</p>
              </div>
              <Badge variant="outline" size="sm" className="!text-[11px] !px-2 !py-0.5">
                {plan.minEmployees}+ empleados
              </Badge>
            </div>

            <div className="mt-4 grid gap-3">
              <div className="rounded-lg border border-slate-200/70 bg-slate-50 px-4 py-3 dark:border-slate-700/40 dark:bg-slate-900/40">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Precio por empleado</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {plan.pricePerEmployee.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200/70 bg-slate-50 px-4 py-3 dark:border-slate-700/40 dark:bg-slate-900/40">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">MRR empresas</p>
                <p className="text-xl font-semibold text-indigo-700 dark:text-indigo-200">
                  {plan.monthlyRevenue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Perks clave</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {plan.perks.map(perk => (
                  <Badge key={perk} variant="outline" size="sm" className="!text-[11px] !px-2 !py-0.5">
                    {perk}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 dark:bg-slate-900/70">
                <Radio size={12} />
                Empresas activas: {plan.activeCompanies}
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 dark:bg-slate-900/70">
                <Globe2 size={12} />
                Multi-sede: {plan.multiSite ? 'Sí' : 'No'}
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 dark:bg-slate-900/70">
                Plazas incluidas: {plan.seatsIncluded}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="primary" size="sm" className="!px-3 !py-1 text-xs">
                Ver empleados activos
              </Button>
              <Button variant="ghost" size="sm" className="!px-3 !py-1 text-xs">
                Configurar multisede
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

