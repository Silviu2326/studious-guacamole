import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutTemplate, Palette, Sparkles, Zap } from 'lucide-react';
import { saveAs } from 'file-saver';
import { Badge, Button, Card, Input, Tabs, Textarea } from '../../../components/componentsreutilizables';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';

type DeviceName = 'Desktop' | 'Tablet' | 'Mobile';

type LandingEditorTabId = 'estructura' | 'componentes' | 'seo';

const DEVICE_CANVAS_CONFIG: Record<DeviceName, { width: string; bodyPadding: string }> = {
  Desktop: { width: '1120px', bodyPadding: '48px 0' },
  Tablet: { width: '820px', bodyPadding: '42px 0' },
  Mobile: { width: '420px', bodyPadding: '36px 0' },
};

export default function LandingPageEditorPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<LandingEditorTabId>('estructura');
  const [activeDevice, setActiveDevice] = useState<DeviceName>('Desktop');
  const [editorReady, setEditorReady] = useState(false);

  const editorRef = useRef<any>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const blockManagerRef = useRef<HTMLDivElement | null>(null);
  const layersManagerRef = useRef<HTMLDivElement | null>(null);
  const styleManagerRef = useRef<HTMLDivElement | null>(null);

  const editorTabs = useMemo(
    () => [
      {
        id: 'estructura' as LandingEditorTabId,
        label: 'Estructura & layout',
        icon: <LayoutTemplate className="h-4 w-4" />,
      },
      {
        id: 'componentes' as LandingEditorTabId,
        label: 'Componentes dinámicos',
        icon: <Zap className="h-4 w-4" />,
      },
      {
        id: 'seo' as LandingEditorTabId,
        label: 'SEO & performance',
        icon: <Sparkles className="h-4 w-4" />,
      },
    ],
    [],
  );

  useEffect(() => {
    if (
      editorRef.current ||
      !editorContainerRef.current ||
      !blockManagerRef.current ||
      !layersManagerRef.current ||
      !styleManagerRef.current
    ) {
      return;
    }

    const themeStylesId = 'grapesjs-landing-theme';
    const themeCss = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

      #gjs, .gjs-editor-cont, .gjs-pn-panel {
        font-family: 'Inter', sans-serif;
        color: #0f172a;
      }

      .gjs-blocks-c {
        display: grid !important;
        gap: 14px;
      }

      .gjs-block-category {
        background: transparent !important;
        border: none !important;
        margin-bottom: 1.25rem;
        box-shadow: none !important;
      }

      .gjs-block-category .gjs-title {
        font-size: 0.7rem;
        letter-spacing: 0.35em;
        text-transform: uppercase;
        font-weight: 600;
        color: #6366f1;
        padding: 0.5rem 0 0.75rem;
        background: transparent;
        border: none;
      }

      .gjs-block {
        border-radius: 18px !important;
        border: 1px solid transparent !important;
        background: linear-gradient(140deg, rgba(99,102,241,0.12), rgba(236,72,153,0.12)) !important;
        color: #0f172a !important;
        box-shadow: 0 24px 38px -24px rgba(79,70,229,0.55);
        min-height: 96px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.85rem;
        font-weight: 600;
        text-align: center;
        transition: transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease;
      }

      .gjs-block:hover {
        transform: translateY(-4px);
        box-shadow: 0 26px 40px -22px rgba(99,102,241,0.65);
        border-color: rgba(99,102,241,0.4) !important;
      }

      .gjs-block svg {
        display: none;
      }

      .gjs-layer-item {
        border-radius: 14px !important;
        margin-bottom: 8px !important;
        padding: 10px 12px !important;
        background: rgba(15,23,42,0.06) !important;
        border: 1px solid transparent !important;
        color: #0f172a !important;
        transition: all 0.2s ease;
      }

      .gjs-layer-item:hover {
        border-color: rgba(99,102,241,0.25) !important;
        background: rgba(99,102,241,0.1) !important;
      }

      .gjs-layer-item.gjs-selected {
        border-color: rgba(99,102,241,0.55) !important;
        background: rgba(99,102,241,0.18) !important;
      }

      .gjs-layer-title {
        font-size: 0.8rem !important;
        font-weight: 600 !important;
      }

      .gjs-sm-sector {
        border: none !important;
        margin-bottom: 14px !important;
      }

      .gjs-sm-sector-title {
        background: transparent !important;
        color: #0f172a !important;
        font-weight: 700 !important;
        font-size: 0.75rem !important;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      .gjs-sm-properties {
        border: none !important;
        padding-top: 8px !important;
      }

      .gjs-sm-property {
        border-radius: 14px !important;
        background: rgba(148,163,184,0.18) !important;
        padding: 12px 14px !important;
        border: none !important;
        margin-bottom: 12px !important;
      }

      .gjs-field,
      .gjs-input-holder input,
      .gjs-input-holder select {
        border-radius: 12px !important;
        border: 1px solid rgba(148,163,184,0.4) !important;
        background: rgba(255,255,255,0.9) !important;
        font-family: 'Inter', sans-serif !important;
        font-weight: 500 !important;
      }

      .gjs-sm-unit,
      .gjs-clm-tag,
      .gjs-clm-tags .gjs-label {
        border-radius: 999px !important;
        border: none !important;
        background: rgba(148,163,184,0.25) !important;
        color: #0f172a !important;
        font-weight: 600;
      }

      .gjs-toolbar {
        background: rgba(15,23,42,0.92) !important;
        border-radius: 999px !important;
        padding: 4px 8px !important;
        box-shadow: 0 12px 32px -18px rgba(15,23,42,0.6);
        border: none !important;
      }

      .gjs-toolbar-item {
        color: #e2e8f0 !important;
      }

      .gjs-toolbar-item:hover {
        color: #ffffff !important;
      }

      .gjs-cv-canvas {
        background: linear-gradient(135deg, rgba(244,247,254,0.9), rgba(240,249,255,0.8)) !important;
      }

      .gjs-highlighter,
      .gjs-box-shadow-comp {
        outline: 2px solid rgba(99,102,241,0.55) !important;
      }

      .gjs-resizer-h {
        border-color: rgba(99,102,241,0.85) !important;
      }
    `;

    let themeEl: HTMLStyleElement | null = null;
    if (!document.getElementById(themeStylesId)) {
      themeEl = document.createElement('style');
      themeEl.id = themeStylesId;
      themeEl.innerHTML = themeCss;
      document.head.appendChild(themeEl);
    }

    const editor = grapesjs.init({
      container: editorContainerRef.current,
      height: '100%',
      width: 'auto',
      storageManager: false,
      blockManager: {
        appendTo: blockManagerRef.current,
      },
      layerManager: {
        appendTo: layersManagerRef.current,
      },
      styleManager: {
        appendTo: styleManagerRef.current,
      },
      deviceManager: {
        devices: [
          { name: 'Desktop', width: '' },
          { name: 'Tablet', width: '768px' },
          { name: 'Mobile', width: '375px' },
        ],
      },
      selectorManager: {
        componentFirst: true,
      },
    });

    editor.Panels.getPanels().reset([]);

    editor.BlockManager.add('section-hero', {
      id: 'section-hero',
      label: 'Hero',
      category: 'Secciones',
      content: `
            <section class="py-16 bg-white">
              <div class="max-w-5xl mx-auto px-6 text-center">
                <span class="text-sm font-semibold tracking-[0.35em] uppercase text-indigo-500 mb-4 block">Growth playbook</span>
                <h1 class="text-4xl font-bold text-slate-900 leading-tight mb-4">
                  Construye landing pages que convierten en menos de 15 minutos
                </h1>
                <p class="text-lg text-slate-600 mb-8">
                  Lanza variantes para campañas evergreen, promociones flash y funnels IA sin depender de desarrolladores.
                </p>
                <div class="flex flex-wrap justify-center gap-3">
                  <a href="#" class="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-500 transition">
                    Lanzar versión IA
                  </a>
                  <a href="#" class="px-6 py-3 rounded-xl border border-indigo-200 text-indigo-600 font-semibold hover:border-indigo-300 transition">
                    Ver demo en vivo
                  </a>
                </div>
              </div>
            </section>
          `,
    });

    editor.BlockManager.add('feature-grid', {
      id: 'feature-grid',
      label: 'Beneficios',
      category: 'Secciones',
      content: `
            <section class="py-14 bg-slate-50">
              <div class="max-w-6xl mx-auto px-6">
                <div class="grid gap-6 md:grid-cols-3">
                  <div class="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
                    <h3 class="text-lg font-semibold text-slate-900 mb-2">Bloques modulares</h3>
                    <p class="text-sm text-slate-600">Elige entre decenas de secciones diseñadas con mejores prácticas de conversión.</p>
                  </div>
                  <div class="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
                    <h3 class="text-lg font-semibold text-slate-900 mb-2">Automatiza experiments</h3>
                    <p class="text-sm text-slate-600">Crea variantes y envía tráfico desde Ads sin depender de desarrollo.</p>
                  </div>
                  <div class="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
                    <h3 class="text-lg font-semibold text-slate-900 mb-2">Integrado con funnels</h3>
                    <p class="text-sm text-slate-600">Sincroniza audiencias, nurturing IA y medición de KPIs en tiempo real.</p>
                  </div>
                </div>
              </div>
            </section>
          `,
    });

    editor.BlockManager.add('cta', {
      id: 'cta',
      label: 'CTA',
      category: 'Componentes',
      content: `
            <section class="py-12 bg-indigo-600 text-white text-center rounded-3xl shadow-lg">
              <div class="max-w-4xl mx-auto px-6">
                <h2 class="text-3xl font-semibold mb-4">Activa tu landing IA en minutos</h2>
                <p class="text-base text-indigo-100 mb-6">
                  Orquesta tráfico, personaliza contenido y mide conversiones desde un mismo panel.
                </p>
                <a href="#" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-indigo-600 font-semibold shadow hover:bg-indigo-50 transition">
                  <span>Comenzar ahora</span>
                </a>
              </div>
            </section>
          `,
    });

    const initialHtml = `
          <main>
            <section class="py-16 bg-white">
              <div class="max-w-5xl mx-auto px-6 text-center">
                <span class="text-sm font-semibold tracking-[0.35em] uppercase text-indigo-500 mb-4 block">Landing IA</span>
                <h1 class="text-4xl font-bold text-slate-900 leading-tight mb-4">
                  Prototipo listo: Landing page con bloques inteligentes
                </h1>
                <p class="text-lg text-slate-600 mb-8">
                  Itera más rápido, conecta funnels y optimiza conversiones con recomendaciones IA a cada paso.
                </p>
                <div class="flex flex-wrap justify-center gap-3">
                  <a href="#" class="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-500 transition">
                    Generar experiencias
                  </a>
                  <a href="#" class="px-6 py-3 rounded-xl border border-indigo-200 text-indigo-600 font-semibold hover:border-indigo-300 transition">
                    Compartir preview
                  </a>
                </div>
              </div>
            </section>
          </main>
        `;

    const initialCss = `
          body { font-family: 'Inter', sans-serif; color: #0f172a; }
          a { text-decoration: none; }
          section { transition: box-shadow 0.2s ease, transform 0.2s ease; }
          section:hover { transform: translateY(-2px); }
        `;

    editor.setComponents(initialHtml);
    editor.setStyle(initialCss);
    editor.setDevice('Desktop');

    editor.on('load', () => {
      const frameDoc = editor.Canvas.getDocument();
      if (!frameDoc) return;

      if (!frameDoc.getElementById('landing-tailwind')) {
        const tailwindLink = frameDoc.createElement('link');
        tailwindLink.id = 'landing-tailwind';
        tailwindLink.rel = 'stylesheet';
        tailwindLink.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@3.4.3/dist/tailwind.min.css';
        frameDoc.head.appendChild(tailwindLink);
      }

      if (!frameDoc.getElementById('landing-canvas-theme')) {
        const canvasTheme = frameDoc.createElement('style');
        canvasTheme.id = 'landing-canvas-theme';
        canvasTheme.innerHTML = `
          body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(140deg, rgba(248,250,252,0.96), rgba(238,242,255,0.92));
            color: #0f172a;
            transition: padding 0.2s ease, background 0.2s ease;
          }

          body[data-device="Desktop"] main { max-width: ${DEVICE_CANVAS_CONFIG.Desktop.width}; }
          body[data-device="Desktop"] { padding: ${DEVICE_CANVAS_CONFIG.Desktop.bodyPadding}; }

          body[data-device="Tablet"] main { max-width: ${DEVICE_CANVAS_CONFIG.Tablet.width}; }
          body[data-device="Tablet"] { padding: ${DEVICE_CANVAS_CONFIG.Tablet.bodyPadding}; }

          body[data-device="Mobile"] main { max-width: ${DEVICE_CANVAS_CONFIG.Mobile.width}; }
          body[data-device="Mobile"] { padding: ${DEVICE_CANVAS_CONFIG.Mobile.bodyPadding}; }

          section {
            border-radius: 36px;
            margin-bottom: 32px;
            box-shadow: 0 28px 68px -42px rgba(15,23,42,0.45);
            overflow: hidden;
            border: 1px solid rgba(148,163,184,0.12);
            background: rgba(255,255,255,0.9);
          }

          section:hover {
            transform: translateY(-3px);
            box-shadow: 0 36px 88px -48px rgba(15,23,42,0.55);
          }

          p {
            color: #475569;
          }

          a {
            font-weight: 600;
          }
        `;
        frameDoc.head.appendChild(canvasTheme);
      }

      applyDeviceStyles(editor.getDevice() as DeviceName);
    });

    const applyDeviceStyles = (device: DeviceName) => {
      const frameDoc = editor.Canvas.getDocument();
      if (!frameDoc) return;
      frameDoc.body.setAttribute('data-device', device);
      const mainEl = frameDoc.querySelector('main') as HTMLElement | null;
      if (mainEl) {
        mainEl.style.maxWidth = DEVICE_CANVAS_CONFIG[device].width;
        mainEl.style.margin = '0 auto';
        mainEl.style.transition = 'max-width 0.2s ease';
      }
    };

    const handleEditorDeviceChange = () => {
      const currentDevice = editor.getDevice() as DeviceName;
      applyDeviceStyles(currentDevice);
      setActiveDevice(currentDevice);
    };

    editor.on('change:device', handleEditorDeviceChange);
    applyDeviceStyles('Desktop');

    const cleanup = () => {
      editor.off('change:device', handleEditorDeviceChange);
    };

    editorRef.current = editor;
    setEditorReady(true);

    return () => {
      cleanup();
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
      if (themeEl && document.head.contains(themeEl)) {
        document.head.removeChild(themeEl);
      }
    };
  }, []);

  const handleDeviceButtonClick = (device: DeviceName) => {
    if (!editorRef.current) return;
    editorRef.current.setDevice(device);
  };

  const handleExport = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.getHtml();
    const css = editorRef.current.getCss();
    const output = `<style>${css}</style>\n${html}`;
    const blob = new Blob([output], { type: 'text/html;charset=utf-8' });
    saveAs(blob, 'landing-prototipo.html');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-indigo-50/40 dark:from-[#0b0f1f] dark:via-[#101936] dark:to-[#111827]">
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
            <Badge variant="blue" size="md" className="uppercase tracking-[0.2em]">
              Website Proto
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-300">
            <Palette className="h-4 w-4" />
            <span>Componentes IA-driven listos para personalización.</span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
            Editor rápido de landing pages
          </h1>
          <p className="mt-2 max-w-2xl text-base text-slate-600 dark:text-slate-400">
            Define layout, assets y optimizaciones técnicas. El sistema sugiere mejoras responsive, SEO y
            performance en tiempo real.
          </p>
        </div>

        <Card className="bg-white/90 shadow-xl dark:bg-slate-900/60">
          <Tabs
            items={editorTabs}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as LandingEditorTabId)}
            variant="pills"
            size="sm"
            className="mb-6"
          />

          {activeTab === 'estructura' && (
          <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)_280px]">
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800/60 dark:bg-slate-900/40">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Bloques IA
                  </h3>
                  <span className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                    Drag & drop
                  </span>
                </div>
                <div
                  ref={blockManagerRef}
                  className="mt-4 max-h-[70vh] overflow-y-auto pr-1 text-sm [&_.gjs-block]:rounded-xl [&_.gjs-block]:border-none [&_.gjs-block]:bg-white [&_.gjs-block]:shadow-sm dark:[&_.gjs-block]:bg-slate-950/60"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex rounded-2xl bg-slate-100 p-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {(['Desktop', 'Tablet', 'Mobile'] as DeviceName[]).map((device) => (
                    <button
                      key={device}
                      onClick={() => handleDeviceButtonClick(device)}
                      className={[
                        'px-4 py-2 rounded-xl transition-all',
                        activeDevice === device
                          ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                          : 'hover:text-slate-900 dark:hover:text-white',
                      ].join(' ')}
                      type="button"
                    >
                      {device}
                    </button>
                  ))}
                </div>
                <Button variant="secondary" size="sm" onClick={handleExport} className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Exportar HTML
                </Button>
              </div>

              <div className="relative min-h-[640px] rounded-2xl border border-slate-200/80 bg-white shadow-inner dark:border-slate-800/60 dark:bg-slate-950/40">
                {!editorReady && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/80 text-sm font-medium text-slate-500 dark:bg-slate-950/80 dark:text-slate-300">
                    Cargando editor visual...
                  </div>
                )}
                <div ref={editorContainerRef} className="absolute inset-0 [&_.gjs-cv-canvas__frames]:rounded-2xl" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-slate-800/70 dark:bg-slate-900/40">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Capas</h3>
                <div
                  ref={layersManagerRef}
                  className="mt-3 max-h-[240px] overflow-y-auto pr-1 text-sm [&_.gjs-layer-title]:text-slate-600 dark:[&_.gjs-layer-title]:text-slate-200"
                />
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-slate-800/70 dark:bg-slate-900/40">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Estilos</h3>
                <div
                  ref={styleManagerRef}
                  className="mt-3 max-h-[360px] overflow-y-auto pr-1 text-sm [&_.gjs-sm-sector-title]:text-slate-700 dark:[&_.gjs-sm-sector-title]:text-slate-100"
                />
              </div>
            </div>
          </div>
          )}

          {activeTab === 'componentes' && (
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-5">
                <div className="rounded-2xl border border-dashed border-slate-300/80 p-5 dark:border-slate-700/70">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Componentes activos
                  </p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {['Timeline', 'Comparativa', 'Testimonios', 'Pricing tiers', 'FAQ', 'Footer sticky'].map(
                      (component) => (
                        <span
                          key={component}
                          className="rounded-lg bg-white/80 px-3 py-2 text-sm text-slate-700 shadow-sm dark:bg-slate-950/60 dark:text-slate-200"
                        >
                          {component}
                        </span>
                      ),
                    )}
                  </div>
                </div>
                <Textarea
                  label="Brief para sección hero"
                  helperText="Describe visuales, mensajes y assets deseados. La IA generará la sección completa."
                  rows={4}
                />
                <Textarea
                  label="Brief sección prueba social"
                  helperText="Incluye logos, métricas y frases destacadas."
                  rows={4}
                />
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-6 dark:border-slate-800/70 dark:bg-slate-900/40">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-slate-600 dark:text-slate-200" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Assets sugeridos
                  </h3>
                </div>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <li>• Hero video loop de 12s con UI del producto.</li>
                  <li>• Mockups personalizados (desktop + mobile).</li>
                  <li>• Testimonios con métricas cuantificadas.</li>
                  <li>• CTA flotante en mobile con icono Spark.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-6">
                <Input label="Meta title" placeholder="Funnels IA que convierten en menos de 15 minutos" />
                <Textarea
                  label="Meta description"
                  rows={3}
                  placeholder="Activa una landing optimizada por IA para captar leads cualificados con funnels multicanal sin esfuerzo."
                />
                <Input label="URL slug" placeholder="funnels-ia-landing" />
                <Textarea
                  label="Schema markup"
                  rows={4}
                  placeholder="<script type='application/ld+json'>{ ... }</script>"
                />
                <div className="rounded-xl border border-dashed border-emerald-300/80 bg-emerald-50/60 p-4 dark:border-emerald-500/40 dark:bg-emerald-500/10">
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-200">
                    Score técnico estimado: 94/100
                  </p>
                  <p className="mt-2 text-sm text-emerald-700/90 dark:text-emerald-200/80">
                    Core Web Vitals en verde. Agrega un preload para la fuente principal para sumar +2 puntos.
                  </p>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-6 dark:border-slate-800/70 dark:bg-slate-900/40">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-slate-600 dark:text-slate-200" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Checklist IA
                  </h3>
                </div>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <li>• Añade etiqueta Open Graph para imagen destacada.</li>
                  <li>• Incluye bloque FAQ con schema `FAQPage`.</li>
                  <li>• Configura experimentos A/B en hero cuando haya tráfico.</li>
                  <li>• Vincula a Google Tag Manager para disparos server-side.</li>
                </ul>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

