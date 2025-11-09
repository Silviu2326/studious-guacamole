import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import type { ContentSocialSnapshot } from '../types';
import { ICON_MAP } from './iconMap';

interface AIContentWorkbenchProps {
  ai: ContentSocialSnapshot['ai'];
  loading?: boolean;
}

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

export function AIContentWorkbench({ ai, loading }: AIContentWorkbenchProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-slate-200 rounded" />
          <div className="h-24 bg-slate-100 rounded-2xl" />
          <div className="h-24 bg-slate-100 rounded-2xl" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 shadow-sm border border-slate-100">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            {ICON_MAP.brain ? <ICON_MAP.brain className="w-5 h-5 text-indigo-500" /> : null}
            Content AI Workbench
          </h2>
          <p className="text-sm text-slate-500">
            Actualizado {formatDateTime(ai.lastUpdated)} · Ideas listas para usar
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            Generar copy largo
          </Button>
          <Button variant="primary" size="sm">
            Generar ideas
          </Button>
        </div>
      </div>

      <div className="px-6 py-5 grid grid-cols-1 lg:grid-cols-3 gap-6 border-b border-slate-100">
        <div className="lg:col-span-1">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Voz de marca</h3>
          <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50">
            {ai.brandProfile ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-600">{ai.brandProfile.toneOfVoice}</p>
                {ai.brandProfile.targetAudience ? (
                  <p className="text-xs text-slate-500">
                    Target: {ai.brandProfile.targetAudience}
                  </p>
                ) : null}
                {ai.brandProfile.keywords ? (
                  <div className="flex flex-wrap gap-2">
                    {ai.brandProfile.keywords.map((keyword) => (
                      <span key={keyword} className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-600">
                        #{keyword}
                      </span>
                    ))}
                  </div>
                ) : null}
                <Button variant="ghost" size="sm" className="mt-2 text-indigo-600">
                  Ajustar voz de marca
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-slate-600">
                  Define una voz de marca para personalizar las salidas de IA a tus mensajes clave.
                </p>
                <Button variant="primary" size="sm">
                  Configurar voz
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Asistentes IA</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ai.assistants.map((assistant) => {
              const Icon = assistant.icon ? ICON_MAP[assistant.icon] : ICON_MAP.sparkles;

              return (
                <div key={assistant.id} className="border border-slate-100 rounded-2xl p-4 bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center">
                      {Icon ? <Icon className="w-5 h-5" /> : null}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{assistant.title}</p>
                      <p className="text-xs text-slate-500">{assistant.relatedModule}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{assistant.description}</p>
                  <ul className="mt-3 space-y-1 text-xs text-slate-500">
                    {assistant.useCases.map((useCase) => (
                      <li key={useCase}>• {useCase}</li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-center justify-between">
                    <Button variant="ghost" size="sm">
                      Abrir asistente
                    </Button>
                    {assistant.lastRun ? (
                      <span className="text-xs text-slate-400">Último uso {formatDateTime(assistant.lastRun)}</span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Ideas rápidas</h3>
        {ai.quickIdeas.length === 0 ? (
          <p className="text-sm text-slate-500">
            Lanza el Generador de Ideas para recibir propuestas segmentadas por objetivo y formato.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {ai.quickIdeas.map((idea) => (
              <div key={idea.id} className="border border-slate-100 rounded-2xl p-4 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="blue" size="sm">
                    {idea.format.toUpperCase()}
                  </Badge>
                  <Badge variant="purple" size="sm">
                    {idea.channel.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm font-semibold text-slate-900">{idea.title}</p>
                <p className="text-sm text-slate-600 mt-2">{idea.hook}</p>
                <p className="text-xs text-slate-400 mt-2">CTA: {idea.callToAction}</p>
                <div className="mt-3 flex items-center justify-between">
                  <Button variant="ghost" size="sm">
                    Agregar al Planner
                  </Button>
                  <Button variant="secondary" size="sm">
                    Guardar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}


