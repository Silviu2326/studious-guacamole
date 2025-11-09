import { CalendarRange, Loader2, Sparkles } from 'lucide-react';
import { Badge, Button, Card, Tooltip } from '../../../components/componentsreutilizables';
import type { ContentSocialSnapshot } from '../types';

type PlannerPlatform = ContentSocialSnapshot['planner']['upcoming'][number]['platform'];

const platformStyles: Record<PlannerPlatform, { label: string; className: string }> = {
  instagram: { label: 'Instagram', className: 'bg-gradient-to-r from-pink-500 to-yellow-500 text-white' },
  facebook: { label: 'Facebook', className: 'bg-blue-100 text-blue-700' },
  tiktok: { label: 'TikTok', className: 'bg-slate-900 text-white' },
  linkedin: { label: 'LinkedIn', className: 'bg-sky-100 text-sky-700' },
};

const statusStyles: Record<
  ContentSocialSnapshot['planner']['upcoming'][number]['status'],
  { label: string; className: string }
> = {
  scheduled: { label: 'Programado', className: 'bg-blue-100 text-blue-700' },
  published: { label: 'Publicado', className: 'bg-emerald-100 text-emerald-700' },
  draft: { label: 'Borrador', className: 'bg-slate-100 text-slate-600' },
  failed: { label: 'Error', className: 'bg-rose-100 text-rose-700' },
};

const priorityStyles: Record<'high' | 'medium' | 'low', string> = {
  high: 'bg-rose-100 text-rose-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-slate-100 text-slate-600',
};

interface PlannerSchedulePreviewProps {
  planner: ContentSocialSnapshot['planner'];
  loading?: boolean;
}

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

export function PlannerSchedulePreview({ planner, loading }: PlannerSchedulePreviewProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="p-6 xl:col-span-2">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <Card className="p-0 xl:col-span-2 shadow-sm border border-slate-100">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <CalendarRange className="w-5 h-5 text-indigo-500" />
              Próximos contenidos
            </h2>
            <p className="text-sm text-slate-500">
              Cobertura de {planner.coverageDays} días · {planner.backlogCount} borradores listos
            </p>
          </div>
          <Button variant="secondary" size="sm">
            Abrir Planner
          </Button>
        </div>

        {planner.upcoming.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-500">
            No hay publicaciones programadas. Genera ideas con IA y añádelas al calendario.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {planner.upcoming.map((item) => {
              const platform = platformStyles[item.platform] ?? {
                label: item.platform ? item.platform.toUpperCase() : 'OTRO',
                className: 'bg-slate-100 text-slate-600',
              };
              const status = statusStyles[item.status] ?? {
                label: item.status ?? 'Sin estado',
                className: 'bg-slate-100 text-slate-600',
              };

              return (
                <li key={item.id} className="px-6 py-4 flex flex-wrap md:flex-nowrap gap-4 items-start">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${platform.className}`}>
                        {platform.label}
                      </span>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${status.className}`}>
                        {status.label}
                      </span>
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-50 text-indigo-600">
                        {item.contentType === 'reel'
                          ? 'Reel'
                          : item.contentType === 'carousel'
                          ? 'Carrusel'
                          : 'Post'}
                      </span>
                      {item.aiGenerated ? (
                        <Tooltip content="Copy enriquecido con IA">
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-violet-100 text-violet-600">
                            <Sparkles className="w-3 h-3" />
                            IA
                          </span>
                        </Tooltip>
                      ) : null}
                    </div>
                    <p className="text-sm text-slate-500">
                      {formatDateTime(item.scheduledAt)}
                      {item.campaign ? <span className="text-slate-400"> · {item.campaign}</span> : null}
                    </p>
                    <p className="text-base font-medium text-slate-900">{item.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
                      Ver
                    </Button>
                    <Button variant="secondary" size="sm" className="text-indigo-600">
                      Editar
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card className="p-0 shadow-sm border border-slate-100">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-500" />
              Sugerencias IA
            </h3>
            <p className="text-sm text-slate-500">Ideas accionables para cubrir huecos del calendario</p>
          </div>
          <Badge variant="purple" size="sm">
            {planner.aiSuggestions.length} ideas
          </Badge>
        </div>

        <div className="p-6 space-y-4">
          {planner.aiSuggestions.length === 0 ? (
            <p className="text-sm text-slate-500">
              Lanza el Generador de Ideas para obtener recomendaciones personalizadas.
            </p>
          ) : (
            planner.aiSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="rounded-2xl border border-slate-100 p-4 bg-slate-50">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {(() => {
                        const platformStyle =
                          platformStyles[suggestion.platform] ?? {
                            label: suggestion.platform ? suggestion.platform.toUpperCase() : 'OTRO',
                            className: 'bg-slate-100 text-slate-600',
                          };
                        return (
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${platformStyle.className}`}
                      >
                        {platformStyle.label}
                      </span>
                        );
                      })()}
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          priorityStyles[suggestion.priority]
                        }`}
                      >
                        Prioridad {suggestion.priority === 'high' ? 'alta' : suggestion.priority === 'medium' ? 'media' : 'baja'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{suggestion.title}</p>
                    <p className="text-sm text-slate-500">{suggestion.description}</p>
                    <p className="text-xs text-slate-400">
                      Recomendado para {formatDateTime(suggestion.scheduledFor)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex gap-3">
                  <Button variant="secondary" size="sm">
                    Insertar en Planner
                  </Button>
                  <Button variant="ghost" size="sm">
                    Ver detalles
                  </Button>
                </div>
                <p className="text-xs text-slate-400 mt-3">{suggestion.reason}</p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

