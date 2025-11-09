import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Sparkles, Target, Users, Workflow } from 'lucide-react';
import { Badge, Button, Card, Input, Select, Tabs, Textarea } from '../../../components/componentsreutilizables';

type FunnelEditorTabId = 'estructura' | 'audiencias' | 'automatizaciones';

export default function FunnelsEditorPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FunnelEditorTabId>('estructura');

  const editorTabs = useMemo(
    () => [
      {
        id: 'estructura' as FunnelEditorTabId,
        label: 'Arquitectura del funnel',
        icon: <Workflow className="h-4 w-4" />,
      },
      {
        id: 'audiencias' as FunnelEditorTabId,
        label: 'Audiencias & mensajes',
        icon: <Users className="h-4 w-4" />,
      },
      {
        id: 'automatizaciones' as FunnelEditorTabId,
        label: 'Automatizaciones IA',
        icon: <Sparkles className="h-4 w-4" />,
      },
    ],
    [],
  );

  const objectiveOptions = useMemo(
    () => [
      { value: 'demos', label: 'Reservar demos' },
      { value: 'ventas', label: 'Venta directa' },
      { value: 'webinar', label: 'Registrar webinar/curso' },
      { value: 'lead-magnet', label: 'Descarga lead magnet' },
    ],
    [],
  );

  const audienceOptions = useMemo(
    () => [
      { value: 'decision-makers', label: 'Directores & decision makers' },
      { value: 'marketers', label: 'Equipos de marketing' },
      { value: 'members', label: 'Clientes actuales' },
      { value: 'retargeting', label: 'Audiencias retargeting' },
    ],
    [],
  );

  const automationIdeas = useMemo(
    () => [
      {
        id: 'auto-1',
        title: 'Secuencia nurture 5 días',
        description: 'Email + WhatsApp + retargeting dinámico alineado con el stage MOFU.',
        impact: 'Alta conversión TOFU → MOFU',
      },
      {
        id: 'auto-2',
        title: 'Score predictivo IA',
        description: 'Prioriza leads según intención y asigna tareas automáticas al equipo comercial.',
        impact: 'Reduce 32% el tiempo de respuesta',
      },
      {
        id: 'auto-3',
        title: 'Experimento A/B creativo',
        description: 'Duplica la landing con variación hero y CTA. IA orquesta tráfico dividido 50/50.',
        impact: 'Optimiza CTR +12%',
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/80 dark:from-[#050815] dark:via-[#0b1120] dark:to-[#020617]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <Badge variant="purple" size="md" className="uppercase tracking-[0.2em]">
              Prototipo
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-300">
            <Sparkles className="h-4 w-4" />
            <span>Builder asistido por IA — cambios en tiempo real.</span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
            Editor de funnels multietapa
          </h1>
          <p className="mt-2 max-w-2xl text-base text-slate-600 dark:text-slate-400">
            Define estructura, audiencias y automatizaciones. El sistema sugiere assets y experimentos para
            desplegar una versión lista en minutos.
          </p>
        </div>

        <Card className="bg-white/90 shadow-xl dark:bg-slate-900/60">
          <Tabs
            items={editorTabs}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as FunnelEditorTabId)}
            variant="pills"
            size="sm"
            className="mb-6"
          />

          {activeTab === 'estructura' && (
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-6">
                <Input label="Nombre del funnel" placeholder="Funnel Evergreen · Paid + Email" />
                <Select
                  label="Objetivo principal"
                  options={objectiveOptions}
                  placeholder="Selecciona un objetivo"
                  defaultValue=""
                />
                <Textarea
                  label="Mensaje y promesa central"
                  placeholder="Define el core message que se repetirá en anuncios, landing y nurturing."
                  rows={4}
                />
                <div className="grid gap-6 md:grid-cols-2">
                  <Input label="KPI North Star" placeholder="Ej. MQLs mensuales" />
                  <Input label="Revenue target asociado (€)" type="number" placeholder="15000" />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary">Guardar borrador</Button>
                  <Button variant="primary" className="inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Lanzar iteración IA
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-200/70 bg-indigo-50/60 p-6 dark:border-indigo-500/30 dark:bg-indigo-500/10">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-indigo-500 dark:text-indigo-200" />
                  <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-100">
                    Blueprint sugerido
                  </h3>
                </div>
                <ul className="mt-4 space-y-4 text-sm text-indigo-900/90 dark:text-indigo-100/80">
                  <li>
                    • Top of funnel: Ads Meta + Google con creatividad dinámica según segmento.
                  </li>
                  <li>
                    • Landing modular con bloques IA (hero, prueba social, CTA flotante).
                  </li>
                  <li>
                    • Secuencia 3 correos + WhatsApp alerta 24h tras visita crítica.
                  </li>
                  <li>
                    • Sincroniza lead scoring con CRM para handoff al minuto 5.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'audiencias' && (
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-6">
                <Select
                  label="Audiencia principal"
                  options={audienceOptions}
                  placeholder="Selecciona audiencia objetivo"
                  defaultValue=""
                />
                <Textarea
                  label="Insight clave / Pain Point"
                  placeholder="Describe el dolor o trigger que activa esta audiencia."
                  rows={4}
                />
                <Textarea
                  label="Mensaje personalizado"
                  placeholder="Craft copy principal + CTA para la audiencia seleccionada."
                  rows={4}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Oferta/Lead magnet asociado" placeholder="Toolkit de automatización 2025" />
                  <Input label="Segmento retargeting" placeholder="Visitantes landing + abandono checkout" />
                </div>
                <div className="rounded-xl border border-dashed border-slate-300/80 p-4 dark:border-slate-700/80">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Recomendación IA
                  </p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Activa mensajes dinámicos según etapa: dolor → solución → prueba social → CTA. Añade
                    SMS 18h después del primer correo si no hay clic.
                  </p>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-6 dark:border-slate-800/70 dark:bg-slate-900/40">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-slate-600 dark:text-slate-200" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Buyer personas priorizadas
                  </h3>
                </div>
                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <div className="rounded-lg bg-white/70 p-3 shadow-sm dark:bg-slate-950/50">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">C-Level Growth</p>
                    <p>Busca ROI inmediato y reporting diario. Prefiere demos rápidas.</p>
                  </div>
                  <div className="rounded-lg bg-white/70 p-3 shadow-sm dark:bg-slate-950/50">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">Marketing Ops</p>
                    <p>Valora automatizaciones listas y plantillas reutilizables.</p>
                  </div>
                  <div className="rounded-lg bg-white/70 p-3 shadow-sm dark:bg-slate-950/50">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">Consultores externos</p>
                    <p>Necesitan duplicar funnels rápido para múltiples clientes.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'automatizaciones' && (
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-4">
                {automationIdeas.map((automation) => (
                  <div
                    key={automation.id}
                    className="rounded-2xl border border-indigo-200/70 bg-white/80 p-5 shadow-sm dark:border-indigo-500/30 dark:bg-slate-950/40"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-indigo-700 dark:text-indigo-100">
                          {automation.title}
                        </h3>
                        <p className="mt-1 text-sm text-indigo-900/70 dark:text-indigo-100/80">
                          {automation.description}
                        </p>
                      </div>
                      <Badge variant="purple" size="sm">
                        {automation.impact}
                      </Badge>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <Button variant="ghost" size="sm" className="inline-flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Ver detalle
                      </Button>
                      <Button variant="primary" size="sm" className="inline-flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Activar flujo
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-6 dark:border-slate-800/70 dark:bg-slate-900/40">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-slate-600 dark:text-slate-200" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Métricas previstas
                  </h3>
                </div>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <li>• CPL objetivo: 18,5 € (-22% vs. benchmark actual).</li>
                  <li>• Win rate esperado BOFU: 31% (+9pp).</li>
                  <li>• Tiempo medio a demo: 3h tras registro.</li>
                  <li>• IA readiness: listo para lanzamiento piloto hoy.</li>
                </ul>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

