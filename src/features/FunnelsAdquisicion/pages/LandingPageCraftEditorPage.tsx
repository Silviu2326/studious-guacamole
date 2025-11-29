import { useMemo, useState } from 'react';
import { Editor, Element, Frame, useEditor, useNode } from '@craftjs/core';
import { ArrowLeft, LayoutTemplate, Palette, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Card, Tabs, Textarea, Input } from '../../../components/componentsreutilizables';

type DeviceName = 'Desktop' | 'Tablet' | 'Mobile';
type LandingEditorTabId = 'estructura' | 'componentes' | 'seo';

const DEVICE_CANVAS_CONFIG: Record<DeviceName, { width: string; bodyPadding: string }> = {
  Desktop: { width: '1120px', bodyPadding: '48px 0' },
  Tablet: { width: '820px', bodyPadding: '42px 0' },
  Mobile: { width: '420px', bodyPadding: '36px 0' },
};

type SectionProps = {
  title?: string;
  padY?: string;
  background?: string;
  rounded?: string;
  children?: React.ReactNode;
};

const SectionWrapper = ({
  padY = 'py-16',
  background = 'bg-white',
  rounded = 'rounded-[36px]',
  children,
}: SectionProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <section
      ref={(ref) => ref && connect(drag(ref))}
      className={`${padY} ${background} ${rounded} border border-slate-200/70 shadow-[0_28px_68px_-42px_rgba(15,23,42,0.45)] transition-all hover:-translate-y-1`}
    >
      {children}
    </section>
  );
};

SectionWrapper.craft = {
  displayName: 'Sección base',
  props: {
    padY: 'py-16',
    background: 'bg-white',
    rounded: 'rounded-[36px]',
  },
};

const CanvasMain = ({ children }: { children?: React.ReactNode }) => {
  const {
    connectors: { connect },
  } = useNode();
  return (
    <main ref={(ref) => ref && connect(ref)} className="space-y-8">
      {children}
    </main>
  );
};

CanvasMain.craft = {
  displayName: 'Lienzo landing',
  props: {},
  rules: {
    canMoveIn: () => true,
  },
};

const HeroSection = () => (
  <SectionWrapper>
    <div className="mx-auto max-w-5xl px-6 text-center">
      <span className="mb-4 block text-sm font-semibold uppercase tracking-[0.35em] text-indigo-500">
        Landing IA
      </span>
      <h1 className="mb-4 text-4xl font-bold leading-tight text-slate-900">
        Prototipo listo: Landing page con bloques inteligentes
      </h1>
      <p className="mb-8 text-lg text-slate-600">
        Itera más rápido, conecta funnels y optimiza conversiones con recomendaciones IA a cada paso.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <a className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-indigo-500" href="#">
          Generar experiencias
        </a>
        <a
          className="rounded-xl border border-indigo-200 px-6 py-3 font-semibold text-indigo-600 transition hover:border-indigo-300"
          href="#"
        >
          Compartir preview
        </a>
      </div>
    </div>
  </SectionWrapper>
);

HeroSection.craft = {
  displayName: 'Hero',
  props: {},
};

const BenefitsSection = () => (
  <SectionWrapper padY="py-14" background="bg-slate-50" rounded="rounded-[32px]">
    <div className="mx-auto max-w-6xl px-6">
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'Bloques modulares',
            description: 'Elige entre decenas de secciones diseñadas con mejores prácticas de conversión.',
          },
          {
            title: 'Automatiza experiments',
            description: 'Crea variantes y envía tráfico desde Ads sin depender de desarrollo.',
          },
          {
            title: 'Integrado con funnels',
            description: 'Sincroniza audiencias, nurturing IA y medición de KPIs en tiempo real.',
          },
        ].map((benefit) => (
          <div key={benefit.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">{benefit.title}</h3>
            <p className="text-sm text-slate-600">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  </SectionWrapper>
);

BenefitsSection.craft = {
  displayName: 'Beneficios',
  props: {},
};

const CTASection = () => (
  <SectionWrapper padY="py-12" background="bg-indigo-600 text-white" rounded="rounded-[32px]">
    <div className="mx-auto max-w-4xl px-6 text-center">
      <h2 className="mb-4 text-3xl font-semibold">Activa tu landing IA en minutos</h2>
      <p className="mb-6 text-base text-indigo-100">
        Orquesta tráfico, personaliza contenido y mide conversiones desde un mismo panel.
      </p>
      <a
        className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-indigo-600 shadow transition hover:bg-indigo-50"
        href="#"
      >
        Comenzar ahora
      </a>
    </div>
  </SectionWrapper>
);

CTASection.craft = {
  displayName: 'CTA',
  props: {},
};

type BlockPaletteItem = {
  id: string;
  label: string;
  description: string;
  element: JSX.Element;
};

const paletteItems: BlockPaletteItem[] = [
  {
    id: 'hero-block',
    label: 'Hero',
    description: 'Titular, subtítulo y llamados a la acción.',
    element: (
      <Element is={SectionWrapper} canvas>
        <HeroSection />
      </Element>
    ),
  },
  {
    id: 'benefits-grid',
    label: 'Beneficios',
    description: 'Cuadrícula de argumentos con diseño limpio.',
    element: (
      <Element is={SectionWrapper} canvas>
        <BenefitsSection />
      </Element>
    ),
  },
  {
    id: 'cta-block',
    label: 'CTA',
    description: 'Sección de cierre con llamado principal.',
    element: (
      <Element is={SectionWrapper} canvas>
        <CTASection />
      </Element>
    ),
  },
];

const PaletteCard = ({ item }: { item: BlockPaletteItem }) => {
  const { connectors } = useEditor();
  return (
    <button
      type="button"
      ref={(ref) => ref && connectors.create(ref, item.element)}
      className="w-full rounded-2xl border border-indigo-100/70 bg-white/95 p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-indigo-200/40 dark:border-indigo-500/20 dark:bg-slate-900/70"
    >
      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.label}</h4>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-indigo-500">
        Arrastrar
      </span>
    </button>
  );
};

const LayersPanel = () => {
  const { nodes, events, actions, options } = useEditor((editorState) => ({
    nodes: editorState.nodes,
    events: editorState.events,
    actions: editorState.actions,
    options: editorState.options,
  }));

  const renderNode = (id: string, depth = 0): React.ReactNode => {
    const node = nodes[id];
    if (!node || id === 'ROOT') return null;
    const children = node.data.nodes || [];
    const isCanvas = node.data.isCanvas;
    const selectedIds = Array.isArray(events.selected) ? events.selected : [];
    const isSelected = selectedIds.includes(id);
    const label = node.data.custom?.displayName || node.data.displayName || id;

    return (
      <div key={id} className="space-y-2">
        <div
          role="button"
          tabIndex={0}
          onClick={() => actions.selectNode(id)}
          onKeyDown={(ev) => {
            if (ev.key === 'Enter' || ev.key === ' ') {
              ev.preventDefault();
              actions.selectNode(id);
            }
          }}
          className={[
            'flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition',
            isSelected
              ? 'border-indigo-400 bg-indigo-100/70 text-indigo-900 dark:border-indigo-500/50 dark:bg-indigo-500/20 dark:text-indigo-100'
              : 'border-slate-200/70 bg-white/80 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/60 dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-200',
          ].join(' ')}
          style={{ marginLeft: depth * 14 }}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
            {isCanvas ? 'Canvas' : 'Node'}
          </span>
          <span className="font-medium">{label}</span>
        </div>
        {isCanvas && children.length > 0 && (
          <div className="space-y-2">{children.map((childId) => renderNode(childId, depth + 1))}</div>
        )}
      </div>
    );
  };

  const rootId = options.rootNodeId || 'ROOT';
  const rootNode = nodes[rootId];
  const rootChildren = rootNode?.data.nodes || [];

  return <div className="space-y-2">{rootChildren.map((childId) => renderNode(childId))}</div>;
};

const StyleInfoPanel = () => {
  const { selectedNodes, selectedNodeData } = useEditor((editorState) => {
    const selected = editorState.events.selected;
    const currentNodeId = selected[selected.length - 1];
    const node = currentNodeId ? editorState.nodes[currentNodeId] : undefined;
    return {
      selectedNodes: selected,
      selectedNodeData: node?.data,
    };
  });

  if (selectedNodes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300/70 bg-slate-50/60 p-4 text-sm text-slate-500 dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-300">
        Selecciona un bloque para ver detalles y sugerencias de estilos.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/60">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">Nodo seleccionado</p>
        <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
          {selectedNodeData?.custom?.displayName || selectedNodeData?.displayName || 'Elemento'}
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Ajusta clases Tailwind o props en el componente para personalizarlo.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 text-sm dark:border-slate-800/70 dark:bg-slate-900/60">
        <ul className="space-y-2 text-slate-600 dark:text-slate-300">
          <li>• Usa `rounded-3xl` para secciones hero minimalistas.</li>
          <li>• Aumenta `gap-y-10` en layouts densos.</li>
          <li>• Cambia `bg-` para alternar paletas y contrastes.</li>
          <li>• Añade gradientes con `bg-gradient-to-r` si buscas impacto.</li>
        </ul>
      </div>
    </div>
  );
};

const CraftCanvas = ({ activeDevice }: { activeDevice: DeviceName }) => {
  const config = DEVICE_CANVAS_CONFIG[activeDevice];
  return (
    <div className="relative min-h-[640px] rounded-2xl border border-slate-200/80 bg-white shadow-inner dark:border-slate-800/60 dark:bg-slate-950/40">
      <div
        className="absolute inset-0 flex justify-center overflow-auto rounded-2xl p-0"
        style={{
          padding: config.bodyPadding,
        }}
      >
        <Frame>
          <Element is={CanvasMain} canvas>
            <Element is={SectionWrapper} canvas>
              <HeroSection />
            </Element>
          </Element>
        </Frame>
      </div>
    </div>
  );
};

export default function LandingPageCraftEditorPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<LandingEditorTabId>('estructura');
  const [activeDevice, setActiveDevice] = useState<DeviceName>('Desktop');

  const resolver = useMemo(
    () => ({
      CanvasMain,
      SectionWrapper,
      HeroSection,
      BenefitsSection,
      CTASection,
    }),
    [],
  );

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
            <span>Craft.js editor en modo colaborativo.</span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
            Editor modular con Craft.js
          </h1>
          <p className="mt-2 max-w-2xl text-base text-slate-600 dark:text-slate-400">
            Construye secciones arrastrando componentes inteligentes. Ajusta su jerarquía y estilos con una interfaz
            cuidada.
          </p>
        </div>

        <Card className="bg-gradient-to-br from-white/95 via-white/90 to-indigo-50/40 shadow-xl backdrop-blur dark:from-slate-900/70 dark:via-slate-900/60 dark:to-indigo-900/30">
          <Tabs
            items={editorTabs}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as LandingEditorTabId)}
            variant="pills"
            size="sm"
            className="mb-6"
          />

          {activeTab === 'estructura' && (
            <Editor resolver={resolver} enabled>
              <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)_280px]">
                <div className="space-y-4">
                  <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm ring-1 ring-transparent transition dark:border-slate-800/70 dark:bg-slate-900/60">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Bloques IA</h3>
                      <span className="rounded-full bg-indigo-50/80 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-200">
                        Drag & drop
                      </span>
                    </div>
                    <div className="mt-5 max-h-[70vh] space-y-3 overflow-y-auto pr-1 text-sm">
                      {paletteItems.map((item) => (
                        <PaletteCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex rounded-2xl bg-slate-100/80 p-1 text-xs font-semibold text-slate-600 shadow-inner shadow-indigo-500/10 ring-1 ring-slate-200/70 dark:bg-slate-800/70 dark:text-slate-300 dark:ring-slate-700/70">
                      {(['Desktop', 'Tablet', 'Mobile'] as DeviceName[]).map((device) => (
                        <button
                          key={device}
                          onClick={() => setActiveDevice(device)}
                          className={[
                            'relative rounded-xl border border-transparent px-4 py-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 dark:focus-visible:ring-indigo-500',
                            activeDevice === device
                              ? 'bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-lg shadow-indigo-500/30 dark:from-indigo-500 dark:to-purple-500'
                              : 'text-slate-600 hover:bg-white/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white',
                          ].join(' ')}
                          type="button"
                        >
                          {device}
                        </button>
                      ))}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-indigo-500/50"
                    >
                      <Sparkles className="h-4 w-4" />
                      Guardar versión
                    </Button>
                  </div>

                  <CraftCanvas activeDevice={activeDevice} />
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm transition dark:border-slate-800/70 dark:bg-slate-900/60">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Capas</h3>
                      <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                        Structure
                      </span>
                    </div>
                    <div className="mt-3 max-h-[240px] overflow-y-auto pr-1 text-sm">
                      <LayersPanel />
                    </div>
                  </div>
                  <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm transition dark:border-slate-800/70 dark:bg-slate-900/60">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Estilos</h3>
                      <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                        Design
                      </span>
                    </div>
                    <div className="mt-3 max-h-[360px] overflow-y-auto pr-1 text-sm">
                      <StyleInfoPanel />
                    </div>
                  </div>
                </div>
              </div>
            </Editor>
          )}

          {activeTab === 'componentes' && (
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-5">
                <div className="rounded-2xl border border-dashed border-slate-300/80 p-5 dark:border-slate-700/70">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Componentes activos</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {['Hero', 'Beneficios', 'CTA', 'Timeline', 'Testimonios', 'FAQ'].map((component) => (
                      <span
                        key={component}
                        className="rounded-lg bg-white/80 px-3 py-2 text-sm text-slate-700 shadow-sm dark:bg-slate-950/60 dark:text-slate-200"
                      >
                        {component}
                      </span>
                    ))}
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
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Assets sugeridos</h3>
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
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-200">Score técnico estimado: 94/100</p>
                  <p className="mt-2 text-sm text-emerald-700/90 dark:text-emerald-200/80">
                    Core Web Vitals en verde. Agrega un preload para la fuente principal para sumar +2 puntos.
                  </p>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-6 dark:border-slate-800/70 dark:bg-slate-900/40">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-slate-600 dark:text-slate-200" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Checklist IA</h3>
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


