import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BadgeCheck,
  Brain,
  ClipboardList,
  CloudCog,
  Clock,
  Cpu,
  Flag,
  LineChart,
  ListTree,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Workflow,
  Send,
} from 'lucide-react';
import {
  ReactFlow,
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  Handle,
  MiniMap,
  Node,
  NodeChange,
  Node as FlowNode,
  Position,
  ReactFlowInstance,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Badge, Button, Card, Input, Select, Tabs, Textarea } from '../../../components/componentsreutilizables';
import { BuyerPersonasEditor } from '../components/BuyerPersonasEditor';
import { ToneAndCTAPresets } from '../components/ToneAndCTAPresets';
import { FunnelToCampaignsExporter } from '../components/FunnelToCampaignsExporter';
import { adaptFunnelCopy } from '../api';
import { BuyerPersona, PainPoint, ToneAndCTAPreset, FavoriteToneConfig, FavoriteCTAConfig } from '../types';

type FunnelViewId = 'funnel' | 'metrics' | 'list';
type StageCategory =
  | 'Captación'
  | 'Cualificación'
  | 'Nurturing'
  | 'Conversión'
  | 'Onboarding'
  | 'Retención';

type StageNodeData = {
  title: string;
  stageType: StageCategory;
  description: string;
  objective?: string;
  action?: string;
  conditions?: string;
  delay?: string;
  messaging?: string;
  labels?: string;
  insights?: string;
  metrics?: {
    volumeIn: number;
    volumeOut: number;
    conversion: number;
    avgTime?: string;
  };
};

type StageTemplate = {
  title: string;
  stageType: StageCategory;
  description: string;
  objective?: string;
  action?: string;
  messaging?: string;
  insights?: string;
};

const statusOptions = [
  { value: 'borrador', label: 'Borrador' },
  { value: 'activo', label: 'Activo' },
  { value: 'pausado', label: 'Pausado' },
];

const categoryStyles: Record<
  StageCategory,
  { badge: string; ring: string; accentClass: string; miniMap: string }
> = {
  Captación: {
    badge: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-600/20 dark:text-indigo-200',
    ring: 'ring-indigo-200 dark:ring-indigo-500/30',
    accentClass: 'text-indigo-500',
    miniMap: '#6366f1',
  },
  Cualificación: {
    badge: 'bg-teal-100 text-teal-600 dark:bg-teal-600/20 dark:text-teal-200',
    ring: 'ring-teal-200 dark:ring-teal-500/30',
    accentClass: 'text-teal-500',
    miniMap: '#14b8a6',
  },
  Nurturing: {
    badge: 'bg-amber-100 text-amber-600 dark:bg-amber-600/20 dark:text-amber-200',
    ring: 'ring-amber-200 dark:ring-amber-500/30',
    accentClass: 'text-amber-500',
    miniMap: '#f59e0b',
  },
  Conversión: {
    badge: 'bg-rose-100 text-rose-600 dark:bg-rose-600/20 dark:text-rose-200',
    ring: 'ring-rose-200 dark:ring-rose-500/30',
    accentClass: 'text-rose-500',
    miniMap: '#f43f5e',
  },
  Onboarding: {
    badge: 'bg-sky-100 text-sky-600 dark:bg-sky-600/20 dark:text-sky-200',
    ring: 'ring-sky-200 dark:ring-sky-500/30',
    accentClass: 'text-sky-500',
    miniMap: '#0ea5e9',
  },
  Retención: {
    badge: 'bg-purple-100 text-purple-600 dark:bg-purple-600/20 dark:text-purple-200',
    ring: 'ring-purple-200 dark:ring-purple-500/30',
    accentClass: 'text-purple-500',
    miniMap: '#8b5cf6',
  },
};

const StageNode = ({ data }: { data: StageNodeData }) => {
  const styles = categoryStyles[data.stageType];

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-white !bg-slate-400 dark:!border-slate-900 dark:!bg-slate-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-white !bg-indigo-400 dark:!border-slate-900 dark:!bg-indigo-500"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2.5 !w-2.5 !border-2 !border-white !bg-slate-300 dark:!border-slate-900 dark:!bg-slate-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2.5 !w-2.5 !border-2 !border-white !bg-indigo-300 dark:!border-slate-900 dark:!bg-indigo-400"
      />
      <div
        className={`rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm transition-all duration-200 hover:shadow-lg dark:border-slate-700/70 dark:bg-slate-950/50 ${styles.ring}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge size="sm" className={`capitalize ${styles.badge}`}>
            {data.stageType}
          </Badge>
          {data.metrics ? (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-300">
              {data.metrics.conversion}% conv.
            </span>
          ) : null}
        </div>
        <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{data.title}</h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{data.description}</p>
        {data.objective ? (
          <div className="mt-3 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
            <Target className={`h-3.5 w-3.5 ${styles.accentClass}`} />
            <span>{data.objective}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const nodeTypes = { stage: StageNode };

const initialNodes: Node<StageNodeData>[] = [
  {
    id: 'stage-traffic',
    type: 'stage',
    position: { x: -280, y: 40 },
    data: {
      title: 'IG + TikTok Ads',
      stageType: 'Captación',
      description: 'Campañas UGC con CTA a reto 7 días',
      objective: 'Generar leads fríos',
      metrics: { volumeIn: 3500, volumeOut: 1800, conversion: 51, avgTime: '2 días' },
      action: 'Optimizar creatividades cada 48h',
      messaging: 'Historias de clientes + CTA directo a landing con countdown',
      insights: 'Cambia hook cada lunes, mejor CTR en vertical coaching',
    },
  },
  {
    id: 'stage-landing',
    type: 'stage',
    position: { x: -20, y: 0 },
    data: {
      title: 'Landing Reto 7 días',
      stageType: 'Captación',
      description: 'Página modular con hero, prueba social y CTA flotante',
      objective: 'Capturar registros cualificados',
      metrics: { volumeIn: 1800, volumeOut: 950, conversion: 53, avgTime: '6 min' },
      action: 'Test A/B de titular semanal',
      messaging: 'CTA: “Únete gratis al reto” + temporizador dinámico',
      insights: 'Mayor conversión cuando se muestra caso de éxito masculino.',
    },
  },
  {
    id: 'stage-quiz',
    type: 'stage',
    position: { x: 260, y: 0 },
    data: {
      title: 'Quiz diagnóstico',
      stageType: 'Cualificación',
      description: 'Segmenta por objetivo, tiempo disponible y presupuesto',
      objective: 'Asignar etiquetas automáticas',
      metrics: { volumeIn: 950, volumeOut: 720, conversion: 76, avgTime: '4 min' },
      action: 'Actualizar puntuación según nuevas respuestas',
      conditions: 'Si presupuesto >150€/mes → etiqueta High Ticket',
      messaging: 'Preguntas dinámicas si se detecta falta de adherencia previa',
    },
  },
  {
    id: 'stage-nurture',
    type: 'stage',
    position: { x: 540, y: -80 },
    data: {
      title: 'Secuencia email autoridad',
      stageType: 'Nurturing',
      description: '3 correos + caso de éxito + CTA demo',
      objective: 'Mover leads tibios a agenda',
      metrics: { volumeIn: 720, volumeOut: 310, conversion: 43, avgTime: '2 días' },
      action: 'Personalizar contenido según objetivo declarado',
      delay: 'Enviar cada 24h entre lunes-jueves',
      messaging: 'Email #2 con tabla de resultados y CTA a Whatsapp',
      insights: 'Mayor respuesta en leads etiquetados como “Quiero perder 10kg”.',
    },
  },
  {
    id: 'stage-whatsapp',
    type: 'stage',
    position: { x: 540, y: 140 },
    data: {
      title: 'Automation WhatsApp',
      stageType: 'Nurturing',
      description: 'Plantilla semi-automática + enlaces a testimonios',
      objective: 'Cerrar duda rápida y agendar llamada',
      metrics: { volumeIn: 310, volumeOut: 240, conversion: 77, avgTime: '3 h' },
      action: 'Mensaje manual si no responde en 2h hábiles',
      delay: 'Trigger 18h después de email sin clic',
      messaging: 'Script: “¿Te acompaño en la planificación de tus 12 semanas?”',
    },
  },
  {
    id: 'stage-agenda',
    type: 'stage',
    position: { x: 820, y: 20 },
    data: {
      title: 'Agenda estratégica',
      stageType: 'Conversión',
      description: 'Integración con módulo de reservas + recordatorios IA',
      objective: 'Conseguir llamadas show-up',
      metrics: { volumeIn: 240, volumeOut: 130, conversion: 54, avgTime: '18 h' },
      action: 'Recordatorio 2h antes vía WhatsApp + email',
      conditions: 'Si no agenda en 48h → reenviar oferta demo grabada',
      labels: 'Lead caliente, Recordatorio manual',
    },
  },
  {
    id: 'stage-checkout',
    type: 'stage',
    position: { x: 1080, y: 20 },
    data: {
      title: 'Checkout High Ticket',
      stageType: 'Conversión',
      description: 'Planes mensual, 12 semanas y VIP. Split pago habilitado',
      objective: 'Cerrar venta high ticket',
      metrics: { volumeIn: 130, volumeOut: 78, conversion: 60, avgTime: '4 h' },
      action: 'Verificar intento fallido → enviar secuencia recuperación',
      conditions: 'Si pago fallido → activar retención financiera',
    },
  },
  {
    id: 'stage-onboarding',
    type: 'stage',
    position: { x: 1340, y: -40 },
    data: {
      title: 'Onboarding cliente',
      stageType: 'Onboarding',
      description: 'Entrega cuestionario salud + crear rutina inicial',
      objective: 'Activar experiencia premium',
      metrics: { volumeIn: 78, volumeOut: 72, conversion: 92, avgTime: '6 h' },
      action: 'Generar tareas: dieta base, rutina semana 1',
      messaging: 'Email bienvenida + acceso Portal Cliente',
      insights: 'Automatizar contrato y cobro recurrente con módulo Finanzas',
    },
  },
  {
    id: 'stage-retencion',
    type: 'stage',
    position: { x: 1340, y: 180 },
    data: {
      title: 'Retención & reactivación',
      stageType: 'Retención',
      description: 'Alertas adhesión <60%, secuencia recuperación pagos',
      objective: 'Mantener clientes 90 días+',
      metrics: { volumeIn: 72, volumeOut: 64, conversion: 89, avgTime: '14 días' },
      action: 'Trigger DM manual si 2 check-ins perdidos',
      conditions: 'Si cancela → funnel reactivación a 30/60/90 días',
      messaging: 'Campañas win-back personalizadas según motivo baja',
      labels: 'Clientes riesgo, Requiere seguimiento entrenador',
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1', source: 'stage-traffic', target: 'stage-landing' },
  { id: 'e2', source: 'stage-landing', target: 'stage-quiz' },
  { id: 'e3', source: 'stage-quiz', target: 'stage-nurture' },
  { id: 'e4', source: 'stage-quiz', target: 'stage-whatsapp' },
  { id: 'e5', source: 'stage-nurture', target: 'stage-agenda' },
  { id: 'e6', source: 'stage-whatsapp', target: 'stage-agenda' },
  { id: 'e7', source: 'stage-agenda', target: 'stage-checkout' },
  { id: 'e8', source: 'stage-checkout', target: 'stage-onboarding' },
  { id: 'e9', source: 'stage-checkout', target: 'stage-retencion' },
  { id: 'e10', source: 'stage-onboarding', target: 'stage-retencion' },
];

const stageLibrary: Array<{
  title: string;
  icon: JSX.Element;
  description: string;
  templates: StageTemplate[];
}> = [
  {
    title: 'Captación',
    icon: <Workflow className="h-4 w-4 text-indigo-500" />,
    description: 'Bloques TOFU listos con tracking y recursos conectados.',
    templates: [
      {
        title: 'Ads Meta + TikTok',
        stageType: 'Captación',
        description: 'Campañas UGC + targeting intereses fitness',
        objective: 'Atraer leads fríos',
        insights: 'Duplicar creatividad si CTR <1.2%',
      },
      {
        title: 'Landing modular',
        stageType: 'Captación',
        description: 'Hero IA, prueba social dinámica, CTA sticky',
        objective: 'Registrar leads con 35% conv.',
        messaging: 'CTA: Reserva gratis sesión estratégica',
      },
      {
        title: 'Lead magnet Quiz',
        stageType: 'Captación',
        description: 'Quiz interactivo que segmenta objetivos',
        objective: 'Generar lead magnet personalizado',
      },
    ],
  },
  {
    title: 'Cualificación & Nurturing',
    icon: <Users className="h-4 w-4 text-teal-500" />,
    description: 'Secuencias multicanal para calentar y segmentar.',
    templates: [
      {
        title: 'Score IA + etiquetas',
        stageType: 'Cualificación',
        description: 'Puntuación automática según respuestas',
        objective: 'Detectar High Ticket rápido',
        insights: 'Aplica etiqueta “Alto compromiso” si responde todo.',
      },
      {
        title: 'Secuencia email 5 días',
        stageType: 'Nurturing',
        description: 'Contenido autoridad + testimonios + CTA demo',
        messaging: 'Storytelling + pregunta abierta día 3',
      },
      {
        title: 'WhatsApp Smart follow-up',
        stageType: 'Nurturing',
        description: 'Plantilla semi-automática con lógica de ramas',
        objective: 'Resolver objeciones y agendar',
      },
    ],
  },
  {
    title: 'Conversión & Retención',
    icon: <Target className="h-4 w-4 text-rose-500" />,
    description: 'Automatiza cierre, onboarding y recuperación.',
    templates: [
      {
        title: 'Agenda estratégica',
        stageType: 'Conversión',
        description: 'Reserva asistida con recordatorios inteligentes',
        objective: 'Aumentar show-up 25%',
      },
      {
        title: 'Checkout high ticket',
        stageType: 'Conversión',
        description: 'Planes 12 semanas + split payment',
        insights: 'Enviar video caso éxito tras intento fallido.',
      },
      {
        title: 'Retención proactiva',
        stageType: 'Retención',
        description: 'Alertas adherencia + secuencia win-back',
        objective: 'Reducir churn 18%',
      },
    ],
  },
];

const viewTabs = [
  {
    id: 'funnel',
    label: 'Vista Funnel',
    icon: <Brain className="h-4 w-4 text-indigo-500" />,
  },
  {
    id: 'metrics',
    label: 'Vista Métricas',
    icon: <LineChart className="h-4 w-4 text-emerald-500" />,
  },
  {
    id: 'list',
    label: 'Vista Lista',
    icon: <ListTree className="h-4 w-4 text-slate-500" />,
  },
];

export default function FunnelsEditorPage() {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [viewMode, setViewMode] = useState<FunnelViewId>('funnel');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [funnelName, setFunnelName] = useState('Reto 7 días · High Ticket Coaching');
  const [status, setStatus] = useState('borrador');
  const [buyerPersonas, setBuyerPersonas] = useState<BuyerPersona[]>([]);
  const [painPoints, setPainPoints] = useState<PainPoint[]>([]);
  const [adaptingCopy, setAdaptingCopy] = useState(false);
  const [showExporter, setShowExporter] = useState(false);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const handleConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
    [],
  );

  const handleSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: FlowNode[]; edges: Edge[] }) => {
      setSelectedNodeId(selectedNodes[0]?.id ?? null);
    },
    [],
  );

  const onDragStart = useCallback(
    (event: React.DragEvent, template: StageTemplate) => {
      event.dataTransfer.setData('application/reactflow', JSON.stringify(template));
      event.dataTransfer.effectAllowed = 'move';
    },
    [],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!flowInstance) return;

      const raw = event.dataTransfer.getData('application/reactflow');
      if (!raw) return;

      const template: StageTemplate = JSON.parse(raw);
      const position = flowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY - 120,
      });

      const newNode: Node<StageNodeData> = {
        id: `stage-${Date.now()}`,
        type: 'stage',
        position,
        data: {
          title: template.title,
          stageType: template.stageType,
          description: template.description,
          objective: template.objective,
          action: template.action,
          messaging: template.messaging,
          insights: template.insights,
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setSelectedNodeId(newNode.id);
    },
    [flowInstance],
  );

  const updateSelectedNodeData = useCallback(
    (key: keyof StageNodeData, value: string) => {
      if (!selectedNodeId) {
        return;
      }

      setNodes((current) =>
        current.map((node) =>
          node.id === selectedNodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  [key]: value,
                },
              }
            : node,
        ),
      );
    },
    [selectedNodeId],
  );

  const metricsSummary = useMemo(() => {
    const totals = nodes.reduce(
      (acc, node) => {
        if (!node.data.metrics) return acc;
        acc.volumeIn += node.data.metrics.volumeIn ?? 0;
        acc.volumeOut += node.data.metrics.volumeOut ?? 0;
        acc.count += 1;
        acc.conversion += node.data.metrics.conversion ?? 0;
        return acc;
      },
      { volumeIn: 0, volumeOut: 0, conversion: 0, count: 0 },
    );

    const avgConversion = totals.count ? Math.round(totals.conversion / totals.count) : 0;

    return {
      totalLeads: totals.volumeIn,
      qualified: totals.volumeOut,
      avgConversion,
      pipelineValue: 45800,
    };
  }, [nodes]);

  const listViewData = useMemo(
    () =>
      nodes.map((node) => ({
        id: node.id,
        title: node.data.title,
        stage: node.data.stageType,
        action: node.data.action ?? '—',
        conditions: node.data.conditions ?? '—',
        objective: node.data.objective ?? '—',
        conversion: node.data.metrics ? `${node.data.metrics.conversion}%` : '—',
      })),
    [nodes],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/80 dark:from-[#050815] dark:via-[#0b1120] dark:to-[#020617]">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
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
              Builder IA
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-300">
            <Sparkles className="h-4 w-4" />
            <span>Canvas IA — drag & drop, versiones y simulación en vivo.</span>
          </div>
        </div>

        <Card className="overflow-hidden bg-white/95 shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900/70">
          <div className="border-b border-slate-200/70 bg-slate-50/60 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="grid gap-3 sm:grid-cols-[minmax(240px,1fr)_180px] sm:items-end">
                <Input
                  label="Nombre del funnel"
                  value={funnelName}
                  onChange={(event) => setFunnelName(event.target.value)}
                />
                <Select
                  label="Estado"
                  options={statusOptions}
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="ghost" size="sm" className="inline-flex items-center gap-2">
                  <CloudCog className="h-4 w-4" />
                  Guardar versión
                </Button>
                <Button variant="ghost" size="sm" className="inline-flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Duplicar funnel
                </Button>
                <Button variant="ghost" size="sm" className="inline-flex items-center gap-2">
                  <PlayCircle className="h-4 w-4" />
                  Simular recorrido
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowExporter(true)}
                  className="inline-flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Enviar a Campañas
                </Button>
                <Button variant="primary" size="sm" className="inline-flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4" />
                  Publicar funnel
                </Button>
              </div>
            </div>
          </div>

          <div className="px-6 pt-5">
            <Tabs
              items={viewTabs}
              activeTab={viewMode}
              onTabChange={(tabId) => setViewMode(tabId as FunnelViewId)}
              variant="pills"
              size="sm"
            />
          </div>

          {viewMode === 'funnel' ? (
            <div className="px-6 pb-6 space-y-6">
              {/* US-FA-015: Buyer Personas y Dolores Principales */}
              <BuyerPersonasEditor
                funnelId="current-funnel"
                onPersonasChange={setBuyerPersonas}
                onPainPointsChange={setPainPoints}
                onCopyAdapt={(stageId, adaptedCopy) => {
                  if (selectedNodeId === stageId) {
                    updateSelectedNodeData('messaging', adaptedCopy);
                  }
                }}
              />
              
              {/* US-FA-03: Configuraciones de Tono y CTA Favoritos */}
              <ToneAndCTAPresets
                onSelectPreset={(preset) => {
                  if (selectedNodeId) {
                    // Aplicar el preset al nodo seleccionado
                    const toneExample = preset.toneConfig.examples?.[0] || '';
                    const ctaText = preset.ctaConfig.ctaText;
                    updateSelectedNodeData('messaging', `${toneExample} ${ctaText}`);
                  }
                }}
                onSelectTone={(tone) => {
                  if (selectedNodeId && tone.examples && tone.examples.length > 0) {
                    const currentMessaging = selectedNode?.data.messaging || '';
                    updateSelectedNodeData('messaging', `${tone.examples[0]} ${currentMessaging}`);
                  }
                }}
                onSelectCTA={(cta) => {
                  if (selectedNodeId) {
                    const currentMessaging = selectedNode?.data.messaging || '';
                    updateSelectedNodeData('messaging', `${currentMessaging} ${cta.ctaText}`);
                  }
                }}
              />
              
              <div className="grid gap-6 lg:grid-cols-[280px,1fr,320px]">
              <aside className="hidden space-y-6 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-slate-800/60 dark:bg-slate-900/40 lg:block">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-100">
                    <Workflow className="h-4 w-4 text-indigo-500" />
                    Biblioteca de bloques
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                    Arrastra y suelta nodos predefinidos. Cada bloque ya incluye lógica y copy sugerido para entrenadores.
                  </p>
                </div>

                {stageLibrary.map((category) => (
                  <div
                    key={category.title}
                    className="rounded-xl border border-slate-200/60 bg-white/80 p-4 dark:border-slate-800/60 dark:bg-slate-950/50"
                  >
                    <div className="flex items-center gap-2">
                      {category.icon}
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{category.title}</h3>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{category.description}</p>
                    <div className="mt-4 space-y-3">
                      {category.templates.map((template) => (
                        <button
                          key={template.title}
                          onDragStart={(event) => onDragStart(event, template)}
                          draggable
                          type="button"
                          className="w-full rounded-lg border border-dashed border-slate-300/70 p-3 text-left transition hover:border-indigo-400 hover:bg-indigo-50/70 dark:border-slate-700/70 dark:hover:border-indigo-500/60 dark:hover:bg-indigo-500/10"
                        >
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{template.title}</p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{template.description}</p>
                          <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">Drag & Drop → lienzo</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </aside>

              <div className="relative rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 shadow-inner dark:border-slate-800/80 dark:from-slate-950 dark:via-slate-950/60 dark:to-slate-900/40">
                <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-3 rounded-full border border-indigo-200/70 bg-white/80 px-4 py-2 text-xs font-medium text-indigo-600 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200">
                  <Cpu className="h-3.5 w-3.5" />
                  IA sugiere rutas óptimas y experimentos según métricas en vivo
                </div>
                <div className="h-[620px] rounded-3xl">
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={handleNodesChange}
                    onEdgesChange={handleEdgesChange}
                    onConnect={handleConnect}
                    nodeTypes={nodeTypes}
                    fitView
                    onInit={setFlowInstance}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    proOptions={{ hideAttribution: true }}
                    panOnScroll
                    selectionOnDrag
                    onSelectionChange={handleSelectionChange}
                    className="[&_.react-flow__node]:!rounded-2xl"
                  >
                    <Background gap={24} size={1} color="#CBD5F5" className="dark:opacity-30" />
                    <MiniMap
                      className="!bottom-16 !left-4 h-32 w-40 rounded-xl border border-slate-200/70 bg-white/90 shadow dark:border-slate-700/70 dark:bg-slate-900/80"
                      nodeColor={(node) => {
                        const style = categoryStyles[node.data.stageType as StageCategory];
                        return style?.miniMap ?? '#6366f1';
                      }}
                    />
                    <Controls
                      className="!bottom-16 !right-4 rounded-xl border border-slate-200/70 bg-white/90 shadow dark:border-slate-700/70 dark:bg-slate-900/80"
                      showInteractive={false}
                    />
                  </ReactFlow>
                </div>
              </div>

              <aside className="space-y-5 rounded-2xl border border-slate-200/70 bg-white/80 p-5 dark:border-slate-800/70 dark:bg-slate-950/60">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  <LineChart className="h-4 w-4 text-indigo-500" />
                  Configuración del nodo
                </div>
                {selectedNode ? (
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        Nodo seleccionado
                      </p>
                      <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">{selectedNode.data.title}</h3>
                      <Badge size="sm" className={`mt-1 ${categoryStyles[selectedNode.data.stageType].badge}`}>
                        {selectedNode.data.stageType}
                      </Badge>
                    </div>

                    <Textarea
                      label="Descripción"
                      value={selectedNode.data.description}
                      rows={3}
                      onChange={(event) => updateSelectedNodeData('description', event.target.value)}
                    />
                    <Input
                      label="Objetivo"
                      value={selectedNode.data.objective ?? ''}
                      onChange={(event) => updateSelectedNodeData('objective', event.target.value)}
                      placeholder="Ej. Cerrar sesión estratégica / Mantener retención"
                    />
                    <Input
                      label="Acción principal"
                      value={selectedNode.data.action ?? ''}
                      onChange={(event) => updateSelectedNodeData('action', event.target.value)}
                      placeholder="Enviar email, Crear tarea, Aplicar etiqueta..."
                    />
                    <Textarea
                      label="Condiciones / IF"
                      value={selectedNode.data.conditions ?? ''}
                      rows={2}
                      onChange={(event) => updateSelectedNodeData('conditions', event.target.value)}
                      placeholder="Si pago fallido → activar recuperación"
                    />
                    <Input
                      label="Delay / Timing"
                      value={selectedNode.data.delay ?? ''}
                      onChange={(event) => updateSelectedNodeData('delay', event.target.value)}
                      placeholder="Ej. 18h después, solo lunes-jueves"
                    />
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                          Mensaje / Script
                        </label>
                        {buyerPersonas.length > 0 && painPoints.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              if (!selectedNodeId || !selectedNode.data.messaging) return;
                              setAdaptingCopy(true);
                              try {
                                const personaId = buyerPersonas[0]?.id || '';
                                const painPointIds = painPoints.map((p) => p.id);
                                const adaptation = await adaptFunnelCopy(
                                  'current-funnel',
                                  selectedNodeId,
                                  selectedNode.data.messaging,
                                  personaId,
                                  painPointIds,
                                );
                                updateSelectedNodeData('messaging', adaptation.adaptedCopy);
                              } catch (error) {
                                console.error('Error adaptando copy:', error);
                              } finally {
                                setAdaptingCopy(false);
                              }
                            }}
                            disabled={adaptingCopy || !selectedNode.data.messaging}
                            className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
                          >
                            {adaptingCopy ? (
                              <>
                                <Sparkles className="mr-1 h-3 w-3 animate-spin" />
                                Adaptando...
                              </>
                            ) : (
                              <>
                                <Sparkles className="mr-1 h-3 w-3" />
                                Adaptar con IA
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                      <Textarea
                        value={selectedNode.data.messaging ?? ''}
                        rows={3}
                        onChange={(event) => updateSelectedNodeData('messaging', event.target.value)}
                        placeholder="Copy principal de email/WhatsApp/DM"
                      />
                    </div>
                    <Textarea
                      label="Etiquetas a aplicar"
                      value={selectedNode.data.labels ?? ''}
                      rows={2}
                      onChange={(event) => updateSelectedNodeData('labels', event.target.value)}
                      placeholder="Lead hot, Cliente riesgo..."
                    />
                    <Textarea
                      label="Insights IA"
                      value={selectedNode.data.insights ?? ''}
                      rows={2}
                      onChange={(event) => updateSelectedNodeData('insights', event.target.value)}
                      placeholder="Consejos de la IA según métricas"
                    />

                    {selectedNode.data.metrics ? (
                      <div className="rounded-xl border border-indigo-200/50 bg-indigo-50/50 p-3 text-xs dark:border-indigo-500/30 dark:bg-indigo-500/10">
                        <p className="font-semibold text-indigo-700 dark:text-indigo-200">Métricas nodo</p>
                        <ul className="mt-2 space-y-1 text-indigo-900/80 dark:text-indigo-100/80">
                          <li>Entradas: {selectedNode.data.metrics.volumeIn}</li>
                          <li>Salida: {selectedNode.data.metrics.volumeOut}</li>
                          <li>Conversión: {selectedNode.data.metrics.conversion}%</li>
                          {selectedNode.data.metrics.avgTime ? (
                            <li>Tiempo medio: {selectedNode.data.metrics.avgTime}</li>
                          ) : null}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300/70 bg-slate-50/60 p-4 text-center text-sm text-slate-500 dark:border-slate-700/70 dark:bg-slate-900/40 dark:text-slate-300">
                    <Flag className="h-5 w-5 text-indigo-400" />
                    <p>Selecciona un nodo del canvas para editar copy, delays, etiquetas y condiciones.</p>
                    <p className="text-xs">
                      Tip: Arrastra desde la biblioteca de la izquierda para añadir bloques preconfigurados.
                    </p>
                  </div>
                )}

                <div className="space-y-3 rounded-xl border border-slate-200/70 bg-slate-50/70 p-4 text-xs dark:border-slate-800/70 dark:bg-slate-900/50">
                  <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    Triggers del motor
                  </div>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                    <li>• Nuevo lead / Lead actualiza objetivo</li>
                    <li>• Reserva o falta a una cita</li>
                    <li>• Pago fallido o cancelación</li>
                    <li>• Falta de check-ins entrenamiento/nutrición</li>
                  </ul>
                </div>
              </aside>
              </div>
            </div>
          ) : null}

          {viewMode === 'metrics' ? (
            <div className="px-6 pb-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <Card className="border border-indigo-200/70 bg-gradient-to-br from-indigo-500/10 via-white to-indigo-500/10 p-6 dark:border-indigo-500/40 dark:from-indigo-500/10 dark:via-slate-900 dark:to-indigo-500/20">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-700 dark:text-indigo-200">Leads totales</p>
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                  </div>
                  <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">
                    {metricsSummary.totalLeads.toLocaleString('es-ES')}
                  </p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">
                    Promedio diario: {Math.round(metricsSummary.totalLeads / 30)} leads
                  </p>
                </Card>
                <Card className="border border-emerald-200/70 bg-gradient-to-br from-emerald-500/10 via-white to-emerald-500/10 p-6 dark:border-emerald-500/40 dark:from-emerald-500/10 dark:via-slate-900 dark:to-emerald-500/20">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-200">Leads cualificados</p>
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  </div>
                  <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">
                    {metricsSummary.qualified.toLocaleString('es-ES')}
                  </p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">
                    72% con etiqueta “Preparado High Ticket”
                  </p>
                </Card>
                <Card className="border border-amber-200/70 bg-gradient-to-br from-amber-500/10 via-white to-amber-500/10 p-6 dark:border-amber-500/40 dark:from-amber-500/10 dark:via-slate-900 dark:to-amber-500/20">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-200">Conversión media</p>
                    <Target className="h-4 w-4 text-amber-500" />
                  </div>
                  <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">
                    {metricsSummary.avgConversion}%
                  </p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">
                    Valor pipeline estimado: €{metricsSummary.pipelineValue.toLocaleString('es-ES')}
                  </p>
                </Card>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr,1fr]">
                <Card className="border border-slate-200/70 bg-white/90 p-6 dark:border-slate-800/70 dark:bg-slate-950/50">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                    <LineChart className="h-4 w-4 text-indigo-500" />
                    Conversión por etapa
                  </div>
                  <div className="mt-4 space-y-4">
                    {nodes.map((node) => (
                      <div key={node.id} className="rounded-xl border border-slate-200/60 p-4 dark:border-slate-800/60">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{node.data.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{node.data.stageType}</p>
                          </div>
                          <Badge variant="purple" size="sm">
                            {node.data.metrics ? `${node.data.metrics.conversion}%` : '—'}
                          </Badge>
                        </div>
                        {node.data.metrics ? (
                          <div className="mt-3 grid gap-3 sm:grid-cols-3 text-xs text-slate-500 dark:text-slate-300">
                            <div>
                              <p className="font-semibold text-slate-600 dark:text-slate-200">Entradas</p>
                              <p>{node.data.metrics.volumeIn.toLocaleString('es-ES')}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-600 dark:text-slate-200">Salidas</p>
                              <p>{node.data.metrics.volumeOut.toLocaleString('es-ES')}</p>
                            </div>
                            {node.data.metrics.avgTime ? (
                              <div>
                                <p className="font-semibold text-slate-600 dark:text-slate-200">Tiempo medio</p>
                                <p>{node.data.metrics.avgTime}</p>
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="border border-slate-200/70 bg-white/90 p-6 dark:border-slate-800/70 dark:bg-slate-950/50">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                    <Cpu className="h-4 w-4 text-indigo-500" />
                    Alertas inteligentes
                  </div>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    <li>• El paso “Landing” bajó 6 puntos de conversión esta semana. Revisa copy del hero.</li>
                    <li>• Leads etiquetados “Muy justo de dinero” convierten 12% con plan split payment.</li>
                    <li>• WhatsApp Automation genera 22% más demos cuando se envía audio personalizado.</li>
                    <li>• 18 leads en “Retención” sin seguimiento &gt;3 días. Dispara tareas manuales.</li>
                  </ul>
                </Card>
              </div>
            </div>
          ) : null}

          {viewMode === 'list' ? (
            <div className="px-6 pb-6 space-y-6">
              {/* US-FA-015: Buyer Personas y Dolores Principales */}
              <BuyerPersonasEditor
                funnelId="current-funnel"
                onPersonasChange={setBuyerPersonas}
                onPainPointsChange={setPainPoints}
                onCopyAdapt={(stageId, adaptedCopy) => {
                  updateSelectedNodeData('messaging', adaptedCopy);
                }}
              />
              
              <Card className="overflow-hidden border border-slate-200/70 bg-white/90 dark:border-slate-800/70 dark:bg-slate-950/60">
                <div className="border-b border-slate-200/70 bg-slate-50/70 px-6 py-3 text-sm font-semibold text-slate-700 dark:border-slate-800/70 dark:bg-slate-900/60 dark:text-slate-200">
                  Tabla editable por etapas
                </div>
                <div className="divide-y divide-slate-200/70 text-sm dark:divide-slate-800/70">
                  <div className="grid grid-cols-[220px_120px_1fr_1fr_1fr_90px] gap-4 bg-slate-50/50 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:bg-slate-900/50 dark:text-slate-500">
                    <span>Etapa</span>
                    <span>Tipo</span>
                    <span>Acción principal</span>
                    <span>Condiciones</span>
                    <span>Objetivo</span>
                    <span>Conv.</span>
                  </div>
                  {listViewData.map((row) => (
                    <div
                      key={row.id}
                      className="grid grid-cols-[220px_120px_1fr_1fr_1fr_90px] items-center gap-4 px-6 py-4 text-slate-600 dark:text-slate-300"
                    >
                      <span className="font-semibold text-slate-800 dark:text-slate-100">{row.title}</span>
                      <span>{row.stage}</span>
                      <span>{row.action}</span>
                      <span>{row.conditions}</span>
                      <span>{row.objective}</span>
                      <span>{row.conversion}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : null}
        </Card>
      </div>

      {/* US-FA-017: Modal para exportar funnel a Campañas & Automatización */}
      {showExporter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                  Exportar Funnel a Campañas & Automatización
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowExporter(false)}>
                  ×
                </Button>
              </div>
              <FunnelToCampaignsExporter
                funnelId="current-funnel"
                funnelName={funnelName}
                onExportComplete={() => {
                  setShowExporter(false);
                }}
              />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}