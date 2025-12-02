import { Fragment } from 'react';
import {
  Badge,
  Button,
  Card,
} from '../../../components/componentsreutilizables';
import { CheckCircle, Clock, Plus, Power, ShieldAlert, Wand2 } from 'lucide-react';
import type { RuleCategory, RuleItem } from '../api';

interface RulesConditionsBoardProps {
  categories: RuleCategory[];
}

const statusVariant: Record<RuleItem['status'], { label: string; variant: 'green' | 'orange' | 'red' }> = {
  activa: { label: 'Activa', variant: 'green' },
  en_test: { label: 'En test', variant: 'orange' },
  inactiva: { label: 'Inactiva', variant: 'red' },
};

export function RulesConditionsBoard({ categories }: RulesConditionsBoardProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/60 dark:ring-slate-700/40" padding="lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Centro de reglas & condiciones</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Todas las políticas globales que afectan al acceso, cancelaciones y upgrades en un solo panel cerebro.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm" leftIcon={<Plus size={14} />}>
              Nueva regla
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Power size={14} />}>
              Activar / desactivar
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<Wand2 size={14} />}>
              Testear reglas
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {categories.map(category => (
          <Card
            key={category.id}
            className="bg-white shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900/60 dark:ring-slate-700/40"
            padding="lg"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-base font-semibold text-slate-900 dark:text-white">{category.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{category.description}</p>
              </div>
              <Badge variant="outline" size="sm" className="!text-[11px] !px-2 !py-0.5">
                {category.rules.length} reglas
              </Badge>
            </div>
            <div className="mt-4 space-y-4">
              {category.rules.map((rule, index) => (
                <Fragment key={rule.id}>
                  <div className="rounded-xl border border-slate-200/70 bg-slate-50 p-4 text-sm dark:border-slate-700/40 dark:bg-slate-900/40">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{rule.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{rule.appliesTo}</p>
                        </div>
                        <Badge variant={statusVariant[rule.status].variant} size="sm" className="!text-[11px] !px-2 !py-0.5">
                          {statusVariant[rule.status].label}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{rule.summary}</p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 shadow-sm dark:bg-slate-900/80">
                          <Clock size={12} />
                          Actualizado {rule.lastUpdated}
                        </span>
                        {rule.impact && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-1 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                            <CheckCircle size={12} />
                            Impacto: {rule.impact}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="ghost" size="sm" className="!px-3 !py-1 text-xs">
                          Editar
                        </Button>
                        <Button variant="ghost" size="sm" className="!px-3 !py-1 text-xs">
                          Aplicar a planes
                        </Button>
                      </div>
                    </div>
                  </div>
                  {index !== category.rules.length - 1 && <div className="h-px w-full bg-slate-200/70 dark:bg-slate-700/40" />}
                </Fragment>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-900 text-slate-100 shadow-sm ring-1 ring-indigo-500/40" padding="lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h4 className="text-lg font-semibold">Sandbox de políticas inteligentes</h4>
            <p className="text-sm text-slate-300">
              Simula qué pasaría con tus membresías si cambias una regla antes de publicarla en producción.
            </p>
          </div>
          <Button variant="primary" size="sm" leftIcon={<ShieldAlert size={14} />}>
            Abrir simulador de reglas
          </Button>
        </div>
      </Card>
    </div>
  );
}

