import { Badge, Card } from '../../../components/componentsreutilizables';
import type { ClientPortalSettings } from '../api';

interface PortalClientPanelProps {
  settings?: ClientPortalSettings | null;
}

export function PortalClientPanel({ settings }: PortalClientPanelProps) {
  if (!settings) {
    return (
      <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Selecciona un cliente con acceso al portal para ver la configuración detallada.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Estado del portal</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Controla permisos, accesos móviles y checklist de onboarding digital.
            </p>
          </div>
          <Badge variant={settings.selfServiceEnabled ? 'green' : 'orange'} size="md">
            {settings.selfServiceEnabled ? 'Autoservicio activo' : 'Autoservicio desactivado'}
          </Badge>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/60">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Acceso en app
            </dt>
            <dd className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
              {settings.appAccess === 'full' ? 'Acceso completo' : 'Acceso limitado'}
            </dd>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Último acceso:{' '}
              {new Date(settings.lastLogin).toLocaleString('es-ES', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/60">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Próximos pasos
            </dt>
            <dd className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {settings.nextSteps.map(step => (
                <p key={step} className="rounded-lg bg-white p-2 shadow-sm dark:bg-slate-800">
                  {step}
                </p>
              ))}
            </dd>
          </div>
        </dl>
      </Card>

      <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Checklist de onboarding digital
        </h4>
        <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
          {settings.checklist.map(item => (
            <li
              key={item.id}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                item.completed
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-900/30 dark:text-emerald-200'
                  : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/40'
              }`}
            >
              <span>{item.label}</span>
              <Badge variant={item.completed ? 'success' : 'outline'} size="sm">
                {item.completed ? 'Completo' : 'Pendiente'}
              </Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}










