import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import { Boxes, Link, PlugZap, Plus, Users } from 'lucide-react';
import type { AddOn } from '../api';

interface AddOnsGridProps {
  addOns: AddOn[];
}

const typeLabels: Record<AddOn['type'], string> = {
  recurrente: 'Add-on recurrente',
  paquete: 'Pack de sesiones',
  unico: 'Servicio único',
};

const statusVariant: Record<AddOn['status'], 'green' | 'orange'> = {
  activo: 'green',
  inactivo: 'orange',
};

export function AddOnsGrid({ addOns }: AddOnsGridProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/60 dark:ring-slate-700/40" padding="lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Add-ons, packs & extras</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Sube el ARPU sin tocar la cuota base: add-ons recurrentes, packs de sesiones y servicios premium.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm" leftIcon={<Plus size={14} />}>
              Crear add-on
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Users size={14} />}>
              Asignar a clientes
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<Link size={14} />}>
              Incluir en combos
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        {addOns.map(addOn => (
          <Card
            key={addOn.id}
            className={`shadow-sm ring-1 ${
              addOn.highlight ? 'ring-indigo-200 dark:ring-indigo-500/30' : 'ring-slate-200/70 dark:ring-slate-700/40'
            } bg-white dark:bg-slate-900/60`}
            padding="lg"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{addOn.name}</h4>
                  {addOn.highlight && (
                    <Badge variant="purple" size="sm" className="!text-[11px] !px-2 !py-0.5">
                      Recomendado
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{typeLabels[addOn.type]}</p>
              </div>
              <Badge variant={statusVariant[addOn.status]} size="sm">
                {addOn.status === 'activo' ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                {addOn.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
              </p>
              <Badge variant="outline" size="sm" className="!text-[11px] !px-2 !py-0.5">
                {addOn.frequency}
              </Badge>
            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {addOn.conditions.map(condition => (
                <p key={condition}>• {condition}</p>
              ))}
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Compatible con
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {addOn.compatiblePlans.map(plan => (
                  <Badge key={plan} variant="outline" size="sm" className="!text-[11px] !px-2 !py-0.5">
                    {plan}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="primary" size="sm" className="!px-3 !py-1 text-xs" leftIcon={<PlugZap size={12} />}>
                Activar
              </Button>
              <Button variant="ghost" size="sm" className="!px-3 !py-1 text-xs">
                Ver clientes
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

