import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Layers, Megaphone, Sparkles } from 'lucide-react';
import { Badge, Button, Card, Input, Select, Tabs, Textarea } from '../../../components/componentsreutilizables';

type LeadMagnetTabId = 'concepto' | 'contenido' | 'distribucion';

export default function FunnelsLeadMagnetFactoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<LeadMagnetTabId>('concepto');

  const editorTabs = useMemo(
    () => [
      { id: 'concepto' as LeadMagnetTabId, label: 'Concepto & promesa', icon: <Layers className="h-4 w-4" /> },
      { id: 'contenido' as LeadMagnetTabId, label: 'Contenido', icon: <FileText className="h-4 w-4" /> },
      { id: 'distribucion' as LeadMagnetTabId, label: 'Distribución', icon: <Megaphone className="h-4 w-4" /> },
    ],
    [],
  );

  const formatOptions = useMemo(
    () => [
      { value: 'pdf', label: 'PDF interactivo' },
      { value: 'notion', label: 'Plantilla Notion' },
      { value: 'email-series', label: 'Secuencia Email' },
      { value: 'video', label: 'Mini-curso vídeo' },
    ],
    [],
  );

  const channelOptions = useMemo(
    () => [
      { value: 'meta', label: 'Ads Meta' },
      { value: 'google', label: 'Ads Google' },
      { value: 'email', label: 'Email marketing' },
      { value: 'whatsapp', label: 'WhatsApp automation' },
      { value: 'partners', label: 'Partners & afiliados' },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50/60 dark:from-[#0d0b1d] dark:via-[#111936] dark:to-[#07101f]">
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
              Lead Magnet Lab
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-300">
            <Sparkles className="h-4 w-4" />
            <span>Generador asistido por IA listo para sincronizar con funnels.</span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
            Crea tu lead magnet irresistible
          </h1>
          <p className="mt-2 max-w-2xl text-base text-slate-600 dark:text-slate-400">
            Conceptualiza la promesa, desarrolla el contenido y activa la distribución multicanal en un solo
            espacio.
          </p>
        </div>

        <Card className="bg-white/90 shadow-xl dark:bg-slate-900/60">
          <Tabs
            items={editorTabs}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as LeadMagnetTabId)}
            variant="pills"
            size="sm"
            className="mb-6"
          />

          {activeTab === 'concepto' && (
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-6">
                <Input label="Nombre del recurso" placeholder="Toolkit de automatización 2025" />
                <Select
                  label="Formato"
                  options={formatOptions}
                  placeholder="Selecciona formato"
                  defaultValue=""
                />
                <Textarea
                  label="Promesa central"
                  placeholder="Ej. Acelera tu adquisición con campañas automatizadas listas para lanzar."
                  rows={4}
                />
                <Textarea
                  label="Resultados que obtendrá el lead"
                  rows={4}
                  placeholder="Describe quick wins, frameworks, plantillas incluidas..."
                />
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary">Guardar idea</Button>
                  <Button variant="primary" className="inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Generar guion IA
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-200/70 bg-indigo-50/70 p-6 dark:border-indigo-500/30 dark:bg-indigo-500/10">
                <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-100">
                  Sugerencia IA
                </p>
                <p className="mt-3 text-sm text-indigo-900/80 dark:text-indigo-100/80">
                  Conecta este recurso al funnel Evergreen y activa nurtures que alternen insight, caso real y
                  CTA de demo. Incluye versión express (1 página) para mobile-first.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'contenido' && (
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-6">
                <Textarea
                  label="Outline del recurso"
                  placeholder="1. Introducción\n2. Framework paso a paso\n3. Checklist operativo..."
                  rows={6}
                />
                <Textarea
                  label="Call to action final"
                  placeholder="Reserva una sesión estratégica de 15 minutos..."
                  rows={3}
                />
                <Textarea
                  label="Mensajes de seguimiento (email/SMS)"
                  helperText="Escribe variantes. La IA ajustará tono y timing."
                  rows={4}
                />
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-6 dark:border-slate-800/70 dark:bg-slate-900/40">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Recursos incluidos
                </p>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <li>• Guía PDF 18 páginas con checklists accionables.</li>
                  <li>• Plantilla Notion clonable.</li>
                  <li>• Google Sheets con métricas y fórmulas preconfiguradas.</li>
                  <li>• Slides para webinar + script IA.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'distribucion' && (
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-6">
                <Select
                  label="Canales de distribución"
                  options={channelOptions}
                  multiple
                  placeholder="Selecciona canales claves"
                  defaultValue=""
                />
                <Textarea
                  label="Secuencia de lanzamiento"
                  placeholder="Día 0: Email lista principal...\nDía 1: Ads remarketing..."
                  rows={5}
                />
                <Textarea
                  label="KPIs a monitorear"
                  rows={3}
                  placeholder="CPL, tasa de descarga, tasa de demo agendada..."
                />
                <div className="flex flex-wrap gap-3">
                  <Button variant="ghost">Exportar en Notion</Button>
                  <Button variant="primary" className="inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Activar en funnels
                  </Button>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-emerald-200/70 bg-emerald-50/70 p-6 dark:border-emerald-500/30 dark:bg-emerald-500/10">
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-100">
                  Playbook IA listo
                </p>
                <ul className="space-y-3 text-sm text-emerald-700/80 dark:text-emerald-100/80">
                  <li>• Activar nurture 3 emails + 1 WhatsApp tras descarga.</li>
                  <li>• Enviar oferta limitada 48h después sin abrir / sin clic.</li>
                  <li>• Sincronizar con audiencias lookalike 3% en Meta.</li>
                  <li>• Medir SQLs generadas a los 7 y 14 días.</li>
                </ul>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

