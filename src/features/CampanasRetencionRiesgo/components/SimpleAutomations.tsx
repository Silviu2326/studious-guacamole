import { ReactNode } from 'react';
import { MessageCircleMore, PhoneCall, Sparkles, Wand2 } from 'lucide-react';
import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import { SimpleAutomation } from '../api';

interface SimpleAutomationsProps {
  automations: SimpleAutomation[];
  onActivate: (automationId: string) => void;
}

const TYPE_CONFIG: Record<SimpleAutomation['type'], { label: string; variant: 'blue' | 'green' | 'yellow'; icon: ReactNode }> = {
  recordatorio: { label: 'Recordatorio', variant: 'blue', icon: <Sparkles size={16} /> },
  oferta: { label: 'Oferta inteligente', variant: 'green', icon: <Wand2 size={16} /> },
  contacto: { label: 'Contacto humano', variant: 'yellow', icon: <PhoneCall size={16} /> },
};

const CHANNEL_ICONS: Record<SimpleAutomation['channel'], ReactNode> = {
  email: <MessageCircleMore size={14} />,
  sms: <MessageCircleMore size={14} />,
  whatsapp: <MessageCircleMore size={14} />,
  llamada: <PhoneCall size={14} />,
};

export function SimpleAutomations({ automations, onActivate }: SimpleAutomationsProps) {
  return (
    <Card padding="none" className="bg-white shadow-sm ring-1 ring-slate-200">
      <div className="px-6 py-5">
        <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Automatizaciones simples</h2>
            <p className="text-sm text-slate-600">
              Configura acciones listas para usar: recordatorios, ofertas inteligentes y contacto humano.
            </p>
          </div>
          <Badge variant="blue" size="sm">
            {automations.length} plantillas listas
          </Badge>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {automations.map(automation => {
            const config = TYPE_CONFIG[automation.type];
            const channelIcon = CHANNEL_ICONS[automation.channel];

            return (
              <Card
                key={automation.id}
                variant="hover"
                className="flex h-full flex-col gap-4 bg-slate-50 ring-1 ring-slate-200"
                padding="lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{automation.title}</h3>
                    <p className="text-xs text-slate-500">ID: {automation.id}</p>
                  </div>
                  <Badge variant={config.variant} size="sm" leftIcon={config.icon}>
                    {config.label}
                  </Badge>
                </div>
                <p className="flex-1 text-sm text-slate-600">{automation.description}</p>
                <div className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-500">
                      {channelIcon}
                      Canal recomendado
                    </span>
                    <span className="text-slate-700">{automation.channel.toUpperCase()}</span>
                  </div>
                  <div>Disparador: {automation.recommendedTrigger}</div>
                </div>
                <Button variant="primary" size="sm" onClick={() => onActivate(automation.id)}>
                  Activar
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

