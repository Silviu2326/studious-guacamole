import { Mail, MessageCircleCode } from 'lucide-react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { CampaignTemplate } from '../api';

interface EmailSmsBasicsProps {
  templates: CampaignTemplate[];
  onSelectTemplate: (templateId: string) => void;
  selectedTemplateId?: string;
}

export function EmailSmsBasics({ templates, onSelectTemplate, selectedTemplateId }: EmailSmsBasicsProps) {
  return (
    <Card padding="none" className="bg-white shadow-sm ring-1 ring-slate-200">
      <div className="px-6 py-5">
        <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Email/SMS básicos</h2>
            <p className="text-sm text-slate-600">
              Elige plantillas preconfiguradas y personaliza el mensaje para tu segmento activo.
            </p>
          </div>
          <Badge variant="blue" size="sm">
            {templates.length} plantillas disponibles
          </Badge>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {templates.map(template => {
            const isSelected = selectedTemplateId === template.id;
            const channelIcon = template.channel === 'email' ? <Mail size={14} /> : <MessageCircleCode size={14} />;

            return (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template.id)}
                className={`group flex h-full flex-col justify-between rounded-2xl border text-left transition-all ring-1 ring-slate-200 ${
                  isSelected
                    ? 'border-purple-400 bg-purple-50 shadow-md'
                    : 'border-transparent bg-slate-50 hover:-translate-y-0.5 hover:shadow-md'
                }`}
              >
                <div className="space-y-3 rounded-2xl p-5">
                  <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide">
                    <Badge variant="secondary" size="sm" leftIcon={channelIcon}>
                      {template.channel === 'email' ? 'Email' : 'SMS'}
                    </Badge>
                    {template.preset && (
                      <Badge variant="purple" size="sm">
                        Plantilla
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{template.title}</h3>
                  <p className="text-sm text-slate-600">{template.description}</p>
                </div>
                <div
                  className={`rounded-b-2xl px-5 py-3 text-xs font-semibold uppercase tracking-wide transition-colors ${
                    isSelected ? 'bg-white text-purple-600' : 'bg-white text-slate-400 group-hover:text-purple-600'
                  }`}
                >
                  {isSelected ? 'Plantilla seleccionada' : 'Seleccionar'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

