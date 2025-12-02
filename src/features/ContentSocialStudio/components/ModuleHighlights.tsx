import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import type { ModuleQuickAction } from '../types';
import { ICON_MAP } from './iconMap';

const pillToneClasses: Record<
  NonNullable<ModuleQuickAction['pill']>['tone'],
  string
> = {
  info: 'bg-blue-100 text-blue-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-rose-100 text-rose-700',
  neutral: 'bg-slate-100 text-slate-700',
};

interface ModuleHighlightsProps {
  modules: ModuleQuickAction[];
  loading?: boolean;
}

export function ModuleHighlights({ modules, loading }: ModuleHighlightsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-10 w-10 rounded-xl bg-slate-200" />
              <div className="h-5 bg-slate-200 rounded w-1/2" />
              <div className="h-4 bg-slate-100 rounded w-3/4" />
              <div className="h-4 bg-slate-100 rounded w-2/3" />
              <div className="h-9 bg-slate-200 rounded-lg w-32" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {modules.map((module) => {
        const Icon = ICON_MAP[module.icon];

        return (
          <Card
            key={module.id}
            className="p-6 bg-white shadow-sm border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all rounded-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    {Icon ? <Icon className="w-6 h-6" /> : null}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{module.title}</h3>
                    <p className="text-sm text-slate-500">{module.description}</p>
                  </div>
                </div>

                {module.highlight || module.pill ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {module.highlight ? (
                      <Badge variant="blue" size="sm">
                        {module.highlight}
                      </Badge>
                    ) : null}
                    {module.pill ? (
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          pillToneClasses[module.pill.tone ?? 'neutral']
                        }`}
                      >
                        {module.pill.label}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <Button
                asChild
                variant="ghost"
                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
              >
                <a href={module.href}>Abrir</a>
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

