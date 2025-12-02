import { useEffect, useMemo, useState } from 'react';
import { FilePlus, Filter, Globe, Layers, MousePointer2, Search, Share2, Sparkles } from 'lucide-react';
import { Button, Card, Input, MetricCards } from '../../../components/componentsreutilizables';
import {
  LandingTemplate,
  LeadMetric,
  fetchLandingTemplates,
  fetchLeadMetrics,
} from '../api';
import { CrmSyncPanel, LeadCapturePreview, TemplatePicker } from '../components';

export function LandingPagesSimplesPage() {
  const [templates, setTemplates] = useState<LandingTemplate[]>([]);
  const [metrics, setMetrics] = useState<LeadMetric[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>();
  const [templateSearch, setTemplateSearch] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const [templatesData, metricsData] = await Promise.all([fetchLandingTemplates(), fetchLeadMetrics()]);
      setTemplates(templatesData);
      setMetrics(metricsData);
      if (templatesData.length > 0) {
        setSelectedTemplateId(templatesData[0].id);
      }
    };

    void loadData();
  }, []);

  const selectedTemplate = useMemo(
    () => templates.find(template => template.id === selectedTemplateId),
    [templates, selectedTemplateId],
  );

  const templateMetrics = useMemo(() => {
    const totalTemplates = templates.length;
    const leadsCaptured = metrics.find(metric => metric.id === 'leads-captured')?.value ?? '—';
    const conversionRate = metrics.find(metric => metric.id === 'conversion-rate')?.value ?? '—';
    const pipeline = metrics.find(metric => metric.id === 'crm-pipeline')?.value ?? '—';

    return [
      {
        id: 'templates',
        title: 'Plantillas disponibles',
        value: totalTemplates,
        subtitle: 'Listas para activar campañas tácticas',
        color: 'info' as const,
        icon: <Layers size={18} />,
      },
      {
        id: 'leads-captured',
        title: 'Leads captados',
        value: leadsCaptured,
        subtitle: 'Sincronizados en el CRM',
        color: 'success' as const,
        icon: <Share2 size={18} />,
      },
      {
        id: 'conversion-rate',
        title: 'Conversión formulario',
        value: conversionRate,
        subtitle: 'Tasa promedio últimos 30 días',
        color: 'primary' as const,
        icon: <MousePointer2 size={18} />,
      },
      {
        id: 'crm-pipeline',
        title: 'En pipeline del CRM',
        value: pipeline,
        subtitle: 'Leads en etapa de calificación',
        color: 'warning' as const,
        icon: <Globe size={18} />,
      },
      {
        id: 'selected-template',
        title: 'Plantilla activa',
        value: selectedTemplate?.name ?? 'Selecciona una plantilla',
        subtitle: selectedTemplate ? selectedTemplate.goal : 'Elige una plantilla para editar',
        color: 'info' as const,
        icon: <Sparkles size={18} />,
      },
    ];
  }, [templates, metrics, selectedTemplate]);

  const filteredTemplates = useMemo(() => {
    const term = templateSearch.trim().toLowerCase();
    if (!term) {
      return templates;
    }

    return templates.filter(template => {
      return (
        template.name.toLowerCase().includes(term) ||
        template.headline.toLowerCase().includes(term) ||
        template.goal.toLowerCase().includes(term) ||
        template.description.toLowerCase().includes(term)
      );
    });
  }, [templates, templateSearch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <header className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="mr-4 rounded-xl bg-blue-100 p-2 ring-1 ring-blue-200/70">
                <FilePlus size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
                  Landing pages simples
                </h1>
                <p className="text-gray-600">
                  Lanza landings tácticas en minutos: elige una plantilla, personaliza formularios y sincroniza leads con tu CRM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-6">
        <div className="space-y-6">
          <div className="flex items-center justify-end">
            <Button variant="secondary" leftIcon={<Sparkles size={18} />}>
              Crear landing desde cero
            </Button>
          </div>

          <MetricCards data={templateMetrics} columns={5} />

          <Card className="bg-white shadow-sm ring-1 ring-slate-200" padding="md">
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                  <Input
                    value={templateSearch}
                    onChange={event => setTemplateSearch(event.target.value)}
                    placeholder="Buscar plantillas por nombre, objetivo o descripción..."
                    leftIcon={<Search size={18} />}
                    aria-label="Buscar plantillas de landing"
                  />
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Button variant="secondary" leftIcon={<Filter size={18} />} className="whitespace-nowrap">
                      Filtros avanzados
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setTemplateSearch('')}
                      disabled={templateSearch.length === 0}
                      className="whitespace-nowrap text-sm"
                    >
                      Limpiar búsqueda
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-600">
                <span>{filteredTemplates.length} plantillas coinciden con la búsqueda</span>
                <span>{templates.length} plantillas en total</span>
              </div>
            </div>
          </Card>

          <TemplatePicker
            templates={filteredTemplates}
            selectedTemplateId={selectedTemplateId}
            onSelectTemplate={setSelectedTemplateId}
          />

          <LeadCapturePreview template={selectedTemplate} />

          <CrmSyncPanel metrics={metrics} />

          <Card padding="lg" className="bg-white text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-lg font-semibold text-gray-900">Próximamente</p>
            <p className="mt-2 text-gray-600">
              Editor visual de bloques, integraciones con anuncios y pruebas A/B listas para lanzar en un clic.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
