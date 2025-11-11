import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import type { ContentSocialSnapshot } from '../types';
import { ICON_MAP } from './iconMap';

interface ClipperHighlightsProps {
  clipper: ContentSocialSnapshot['clipper'];
  loading?: boolean;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
  });

export function ClipperHighlights({ clipper, loading }: ClipperHighlightsProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-slate-200 rounded" />
          <div className="h-20 bg-slate-100 rounded-2xl" />
          <div className="h-20 bg-slate-100 rounded-2xl" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 shadow-sm border border-slate-100">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            {ICON_MAP.scissors ? <ICON_MAP.scissors className="w-5 h-5 text-indigo-500" /> : null}
            Content Clipper
          </h2>
          <p className="text-sm text-slate-500">
            {clipper.totalClips} activos guardados · {clipper.newThisWeek} nuevos esta semana
          </p>
        </div>
        <Button variant="secondary" size="sm">
          Abrir biblioteca
        </Button>
      </div>

      <div className="px-6 py-5 grid grid-cols-1 lg:grid-cols-3 gap-4 border-b border-slate-100">
        <div className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Categorías Top</h3>
          <div className="flex flex-wrap gap-2">
            {clipper.categories.slice(0, 6).map((category) => (
              <span
                key={category.id}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600"
                style={{ borderColor: category.color ?? undefined, borderWidth: category.color ? 1 : 0 }}
              >
                {category.name} · {category.count}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Tags en tendencia</h3>
          <div className="flex flex-wrap gap-2">
            {clipper.trendingTags.map((tag) => (
              <Badge key={tag} variant="gray" size="sm">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700">Clips destacados</h3>

        {clipper.featured.length === 0 ? (
          <p className="text-sm text-slate-500">
            Guarda ideas desde artículos, vídeos o redes sociales para reutilizarlas en tus campañas.
          </p>
        ) : (
          clipper.featured.map((clip) => (
            <div
              key={clip.id}
              className="border border-slate-100 rounded-2xl p-4 bg-white hover:border-indigo-200 transition"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {clip.category ? (
                      <Badge variant="purple" size="sm">
                        {clip.category}
                      </Badge>
                    ) : null}
                    <span className="text-xs text-slate-400">{formatDate(clip.savedAt)}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{clip.title}</p>
                  {clip.source ? <p className="text-xs text-slate-400">Fuente: {clip.source}</p> : null}
                  {clip.impact ? <p className="text-sm text-slate-500">{clip.impact}</p> : null}
                  <div className="flex flex-wrap gap-2">
                    {clip.tags.map((tag) => (
                      <span key={tag} className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Reutilizar
                </Button>
              </div>
              <p className="text-xs text-slate-400 mt-3">
                usado {clip.usageCount} veces · ideal para {clip.category ?? 'campañas sociales'}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}








