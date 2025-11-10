import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import type { ContentSocialSnapshot, VideoProjectSummary } from '../types';
import { ICON_MAP } from './iconMap';

const statusClasses: Record<
  VideoProjectSummary['status'],
  { label: string; className: string }
> = {
  ideation: { label: 'Ideación', className: 'bg-slate-100 text-slate-600' },
  editing: { label: 'En edición', className: 'bg-amber-100 text-amber-700' },
  rendering: { label: 'Renderizando', className: 'bg-indigo-100 text-indigo-700' },
  scheduled: { label: 'Programado', className: 'bg-blue-100 text-blue-700' },
  published: { label: 'Publicado', className: 'bg-emerald-100 text-emerald-700' },
};

const automationClasses: Record<
  VideoProjectSummary['automationLevel'],
  { label: string; className: string }
> = {
  manual: { label: 'Manual', className: 'bg-slate-100 text-slate-600' },
  assisted: { label: 'Asistido IA', className: 'bg-violet-100 text-violet-700' },
  automated: { label: 'Automatizado', className: 'bg-emerald-100 text-emerald-700' },
};

interface VideoStudioSpotlightProps {
  video: ContentSocialSnapshot['video'];
  loading?: boolean;
}

const formatPublishDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Sin fecha';

export function VideoStudioSpotlight({ video, loading }: VideoStudioSpotlightProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-2/3 bg-slate-200 rounded" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-slate-100 rounded-2xl" />
            <div className="h-20 bg-slate-100 rounded-2xl" />
          </div>
          <div className="space-y-3">
            <div className="h-16 bg-slate-100 rounded-2xl" />
            <div className="h-16 bg-slate-100 rounded-2xl" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 shadow-sm border border-slate-100">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            {ICON_MAP.film ? <ICON_MAP.film className="w-5 h-5 text-indigo-500" /> : null}
            Video Studio Pipeline
          </h2>
          <p className="text-sm text-slate-500">
            {video.readyToPublish} videos listos · {video.automationPlaybooks} playbooks activos
          </p>
        </div>
        <Button variant="secondary" size="sm">
          Abrir Video Studio
        </Button>
      </div>

      <div className="px-6 py-4 grid grid-cols-3 gap-3 border-b border-slate-100">
        <div className="rounded-2xl bg-indigo-50 text-indigo-700 p-4">
          <p className="text-xs uppercase tracking-wide font-semibold opacity-70">Listos para publicar</p>
          <p className="text-2xl font-bold">{video.readyToPublish}</p>
        </div>
        <div className="rounded-2xl bg-violet-50 text-violet-700 p-4">
          <p className="text-xs uppercase tracking-wide font-semibold opacity-70">Playbooks IA</p>
          <p className="text-2xl font-bold">{video.automationPlaybooks}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 text-emerald-700 p-4">
          <p className="text-xs uppercase tracking-wide font-semibold opacity-70">Activos en biblioteca</p>
          <p className="text-2xl font-bold">{video.libraryAssets}</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {video.projects.map((project) => {
          const status = statusClasses[project.status];
          const automation = automationClasses[project.automationLevel];

          return (
            <div
              key={project.id}
              className="border border-slate-100 rounded-2xl p-4 bg-white hover:border-indigo-200 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="blue" size="sm">
                      {project.platform.toUpperCase()}
                    </Badge>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.className}`}>
                      {status.label}
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${automation.className}`}>
                      {automation.label}
                    </span>
                  </div>
                  <p className="text-base font-semibold text-slate-900">{project.title}</p>
                  <p className="text-sm text-slate-500">
                    Duración {project.duration ?? '—'} · Publicación {formatPublishDate(project.publishDate)}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  Abrir
                </Button>
              </div>
              {typeof project.performanceScore === 'number' ? (
                <div className="mt-4">
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      style={{ width: `${project.performanceScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Score estimado {project.performanceScore}/100 basado en campañas previas
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500">
            ¿Necesitas ideas? Lanza el generador de guiones y envía al Video Studio en un clic.
          </div>
          <Button variant="primary" size="sm">
            Nuevo guion con IA
          </Button>
        </div>
      </div>
    </Card>
  );
}



