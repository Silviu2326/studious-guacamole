import { Palette, Target, Wand2 } from 'lucide-react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { LandingTemplate } from '../api';

interface TemplatePickerProps {
  templates: LandingTemplate[];
  selectedTemplateId?: string;
  onSelectTemplate: (id: string) => void;
}

export function TemplatePicker({ templates, selectedTemplateId, onSelectTemplate }: TemplatePickerProps) {
  return (
    <Card padding="none" className="bg-white shadow-sm ring-1 ring-slate-200">
      <div className="px-6 py-5">
        <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Plantillas listas para publicar</h2>
            <p className="text-sm text-slate-600">
              Elige una base y adapta bloques hero, beneficios, testimonios y formularios en minutos.
            </p>
          </div>
          <Badge variant="blue" size="sm" leftIcon={<Palette size={14} />}>
            {templates.length} opciones disponibles
          </Badge>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {templates.map(template => {
            const isSelected = template.id === selectedTemplateId;

            return (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template.id)}
                className={`group flex h-full flex-col gap-4 rounded-2xl border text-left transition-all ring-1 ring-slate-200 ${
                  isSelected ? 'border-blue-400 bg-blue-50 shadow-md' : 'border-transparent bg-slate-50 hover:-translate-y-0.5 hover:shadow-md'
                }`}
              >
                <div className="space-y-3 rounded-2xl p-5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary" size="sm" leftIcon={<Wand2 size={14} />}>
                      {template.name}
                    </Badge>
                    <Badge variant="purple" size="sm" leftIcon={<Target size={14} />}>
                      {template.goal}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{template.headline}</h3>
                  <p className="text-sm text-slate-600">{template.description}</p>
                  <span className="text-sm font-semibold text-blue-600">{template.cta}</span>
                </div>
                <div
                  className={`rounded-b-2xl px-5 py-3 text-xs font-semibold uppercase tracking-wide transition-colors ${
                    isSelected ? 'bg-white text-blue-600' : 'bg-white text-slate-400 group-hover:text-blue-600'
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

