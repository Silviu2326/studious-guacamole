import { ClipboardList, GitBranch, Rocket } from 'lucide-react';
import { Badge, Button, Card, Input } from '../../../components/componentsreutilizables';
import { LandingTemplate } from '../api';

interface LeadCapturePreviewProps {
  template?: LandingTemplate;
}

export function LeadCapturePreview({ template }: LeadCapturePreviewProps) {
  if (!template) {
    return null;
  }

  return (
    <Card padding="lg" className="grid gap-6 bg-white shadow-sm ring-1 ring-slate-200 md:grid-cols-[minmax(0,1fr),minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-slate-900">Vista previa del formulario</h2>
          <p className="text-sm text-slate-600">
            Visualiza el bloque principal de la landing. Puedes personalizar textos, imágenes y campos antes de publicar.
          </p>
        </div>

        <Card className="bg-slate-50 ring-1 ring-slate-200" padding="lg">
          <div className="space-y-1">
            <Badge variant="purple" size="sm">
              {template.goal}
            </Badge>
            <h3 className="text-2xl font-semibold text-slate-900">{template.headline}</h3>
            <p className="text-sm text-slate-600">{template.description}</p>
          </div>

          <form className="mt-6 space-y-4">
            <Input placeholder="Nombre completo" aria-label="Nombre completo" />
            <Input placeholder="Correo electrónico" type="email" aria-label="Correo electrónico" />
            <Input placeholder="Teléfono móvil" type="tel" aria-label="Teléfono móvil" />
            <Button type="button" fullWidth>
              {template.cta}
            </Button>
          </form>
        </Card>
      </div>

      <Card className="flex flex-col gap-4 bg-blue-50 ring-1 ring-blue-200" padding="lg">
        <header className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
            <GitBranch size={16} />
            Flujo hacia CRM
          </div>
          <h3 className="text-lg font-semibold text-blue-900">Sincronización automática</h3>
          <p className="text-sm text-blue-800">
            Cada lead se envía al CRM como nuevo contacto y se asigna al pipeline «Leads» con etiqueta de campaña.
          </p>
        </header>

        <ol className="space-y-3 text-sm text-blue-900">
          <li className="flex gap-3">
            <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold shadow">
              1
            </span>
            <div>
              <p className="font-semibold">Formulario enviado</p>
              <p className="text-blue-800/80">El lead confirma sus datos básicos y acepta comunicaciones.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold shadow">
              2
            </span>
            <div>
              <p className="font-semibold">Lead creado en CRM</p>
              <p className="text-blue-800/80">Se registra con etiqueta de campaña y origen de landing.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold shadow">
              3
            </span>
            <div>
              <p className="font-semibold">Asignación automática</p>
              <p className="text-blue-800/80">Se notifica al equipo comercial y se inicia secuencia de seguimiento.</p>
            </div>
          </li>
        </ol>

        <Card className="bg-white ring-1 ring-blue-100" padding="md">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
            <Rocket size={14} />
            Próximos pasos sugeridos
          </div>
          <ul className="mt-2 space-y-1 text-sm text-blue-800">
            <li>Activar automatización de emails de bienvenida.</li>
            <li>Sincronizar audiencias con Meta y Google Ads.</li>
            <li>Publicar testimonios dinámicos en la landing.</li>
          </ul>
        </Card>
      </Card>
    </Card>
  );
}

