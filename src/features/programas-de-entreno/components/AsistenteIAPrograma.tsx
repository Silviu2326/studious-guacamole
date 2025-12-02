import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Button, Tabs } from '../../../components/componentsreutilizables';
import {
  Brain,
  Send,
  Loader2,
  Sparkles,
  MessageSquare,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Plus,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Save,
  Bookmark,
  BarChart3,
  Info,
  Copy,
} from 'lucide-react';
import type { DayPlan, DaySession, ContextoCliente, ResumenObjetivosProgreso, TimelineSesiones } from '../types';

type DayKey = string;

interface RazonamientoSugerencia {
  metricas?: {
    nombre: string;
    valor: string | number;
    unidad?: string;
    tendencia?: 'up' | 'down' | 'neutral';
  }[];
  razonamiento?: string;
  factoresConsiderados?: string[];
  confianza?: number; // 0-100
}

interface Mensaje {
  id: string;
  tipo: 'usuario' | 'asistente';
  contenido: string;
  timestamp: Date;
  bloquesGenerados?: BloqueGenerado[];
  razonamiento?: RazonamientoSugerencia;
  guardado?: boolean;
}

interface BloqueGenerado {
  id: string;
  block: string;
  duration: string;
  modality: string;
  intensity: string;
  time?: string;
  notes?: string;
}

interface AsistenteIAProgramaProps {
  weeklyPlan: Record<DayKey, DayPlan>;
  selectedDay: DayKey;
  selectedDayPlan: DayPlan;
  clientInfo?: {
    nombre: string;
    objetivos: string[];
    restricciones: string[];
    notas?: string;
  };
  weeklyTargets?: {
    sessions: number;
    duration: number;
    calories: number;
  };
  contextoCliente?: ContextoCliente;
  objetivosProgreso?: ResumenObjetivosProgreso;
  timelineSesiones?: TimelineSesiones;
  onAddBlock?: (block: DaySession) => void;
}

type ModoAsistente = 'asistente' | 'chat';

interface MetricasSemanales {
  totalSessions: number;
  totalDuration: number;
  promedioDiario: number;
  dailyStats: {
    day: DayKey;
    sessions: number;
    duration: number;
  }[];
  modalityDistribution: Record<string, number>;
  intensidadPromedio: number;
  intensidadMax: number;
  intensidadMin: number;
  diasDescanso: number;
  diasAltaDensidad: { day: DayKey; sessions: number; duration: number }[];
  movilidadSemanal: number;
  acuteLoad: number;
  chronicLoad: number;
  loadRatio: number;
}

interface InsightProactivo {
  id: string;
  titulo: string;
  descripcion: string;
  severidad: 'info' | 'warning' | 'critical';
  accionLabel?: string;
}

interface AlertaRapida {
  id: string;
  label: string;
  detail: string;
  tone: 'positive' | 'warning' | 'critical';
}

interface RespuestaIntencion {
  respuesta: string;
  razonamiento?: RazonamientoSugerencia;
}

type IntencionConsulta =
  | 'intensidad'
  | 'volumen'
  | 'duracion'
  | 'carga'
  | 'modalidades'
  | 'sugerencias'
  | 'restricciones'
  | 'dia'
  | 'resumen'
  | 'objetivos'
  | 'ajustes';

const INTENT_PATTERNS: Record<IntencionConsulta, RegExp[]> = {
  intensidad: [/intensidad/, /rpe/, /esfuerzo/],
  volumen: [/volumen/, /serie/, /repeticion/, /cantidad/],
  duracion: [/duraci[oó]n/, /tiempo/, /minuto/, /horario/],
  carga: [/carga/, /fatiga/, /load/],
  modalidades: [/modalidad/, /balance/, /equilibrio/, /variedad/],
  sugerencias: [/sugerencia/, /mejor(a|ar)/, /optimizar/, /idea/],
  restricciones: [/restricci[oó]n/, /lesi[oó]n/, /limitaci[oó]n/, /dolor/],
  dia: [/d[ií]a/, /semana/, /distribuci[oó]n/, /agenda/],
  resumen: [/resumen/, /resume/],
  objetivos: [/objetivo/, /meta/, /prop[oó]sito/],
  ajustes: [/ajustar/, /cambiar/, /modificar/, /retocar/],
};

const WEEK_DAYS: DayKey[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const CHAT_HISTORY_STORAGE_KEY = 'asistenteIA_chatHistory';
const CHAT_SUMMARY_STORAGE_KEY = 'asistenteIA_chatSummary';
const CHAT_NOTES_STORAGE_KEY = 'asistenteIA_chatNotes';
const MAX_CHAT_HISTORY = 14;
const PROMPT_TEMPLATES_STORAGE_KEY = 'asistenteIA_promptTemplates';
const MAX_PROMPT_TEMPLATES = 6;
const QUICK_PROMPTS = [
  { id: 'intensidad', label: 'Intensidad', prompt: 'Analiza la intensidad del programa y dame ajustes puntuales.' },
  { id: 'volumen', label: 'Volumen', prompt: 'Revisa el volumen semanal y sugiere equilibrios o recortes.' },
  { id: 'restricciones', label: 'Restricciones', prompt: 'Propón adaptaciones considerando las lesiones y limitaciones del cliente.' },
  { id: 'bloques', label: 'Bloques IA', prompt: 'Genera un bloque de movilidad de 15 min y otro de fuerza de 30 min adaptado al contexto.' },
];
const DEFAULT_PROMPT_TEMPLATES = [
  { id: 'template-intensidad', label: 'Semana de descarga', prompt: 'Diseña una semana de descarga reduciendo volumen 30%.' },
  { id: 'template-cardio', label: 'Cardio Z2', prompt: 'Añade un bloque de cardio zona 2 de 25 min para compensar sedentarismo.' },
];

const detectarIntencionConsulta = (consulta: string): IntencionConsulta[] => {
  const halladas: IntencionConsulta[] = [];
  (Object.entries(INTENT_PATTERNS) as [IntencionConsulta, RegExp[]][]).forEach(([intencion, patrones]) => {
    if (patrones.some((pattern) => pattern.test(consulta))) {
      if (!halladas.includes(intencion)) {
        halladas.push(intencion);
      }
    }
  });
  return halladas;
};

interface BuildRespuestaContext {
  consulta: string;
  metricas: MetricasSemanales;
  selectedDay: DayKey;
  selectedDayPlan: DayPlan;
  clientInfo?: AsistenteIAProgramaProps['clientInfo'];
  weeklyTargets?: AsistenteIAProgramaProps['weeklyTargets'];
  contextoCliente?: ContextoCliente;
  chatSummary?: string;
}

const buildRespuestaPersonalizada = ({
  consulta,
  metricas,
  selectedDay,
  selectedDayPlan,
  clientInfo,
  weeklyTargets,
  contextoCliente,
  chatSummary,
}: BuildRespuestaContext): string => {
  let respuesta = `He revisado tu consulta sobre "${consulta}".\n\n`;
  respuesta += `Esta semana tienes ${metricas.totalSessions} sesiones (${metricas.totalDuration} min) con un ratio agudo/crónico de ${metricas.loadRatio}. `;
  respuesta += `Hoy (${selectedDay}) el foco es ${selectedDayPlan.focus} con ${selectedDayPlan.sessions.length} sesión(es) y ${selectedDayPlan.intensity}.\n\n`;

  if (clientInfo?.objetivos?.length) {
    respuesta += `🎯 Objetivos del cliente: ${clientInfo.objetivos.join(', ')}.\n`;
  }
  if (contextoCliente?.lesiones?.some((l) => l.estado === 'activa')) {
    const lesionesActivas = contextoCliente.lesiones.filter((l) => l.estado === 'activa').map((l) => l.nombre).join(', ');
    respuesta += `⚕️ Lesiones a considerar: ${lesionesActivas}.\n`;
  }
  if (weeklyTargets) {
    respuesta += `📌 Objetivo semanal: ${weeklyTargets.sessions} sesiones · ${weeklyTargets.duration} min · ${weeklyTargets.calories} kcal.\n`;
  }
  if (chatSummary) {
    respuesta += `📝 Contexto reciente: ${chatSummary}\n`;
  }

  respuesta += `\nPuedo ayudarte a ajustar intensidad, volumen, modalidades, restricciones o generar bloques específicos. Indícame qué aspecto quieres modificar y te propongo opciones concretas.`;
  return respuesta;
};

const generarResumenConversacion = (mensajes: Mensaje[]): string => {
  if (mensajes.length === 0) return '';
  const ultimos = mensajes.slice(-4);
  const partes = ultimos.map((mensaje) => {
    const emisor = mensaje.tipo === 'usuario' ? 'Cliente' : 'Asistente';
    const contenido = mensaje.contenido.replace(/\s+/g, ' ').trim();
    return `${emisor}: ${contenido.substring(0, 160)}${contenido.length > 160 ? '…' : ''}`;
  });
  return partes.join(' | ');
};

const generarNotasConversacion = (mensajes: Mensaje[]): string[] => {
  const asistenteMsgs = mensajes.filter((m) => m.tipo === 'asistente').slice(-3);
  if (asistenteMsgs.length === 0) return [];
  return asistenteMsgs.map((msg) => {
    if (msg.razonamiento?.metricas && msg.razonamiento.metricas.length > 0) {
      const metricaPrincipal = msg.razonamiento.metricas[0];
      return `${msg.razonamiento?.razonamiento?.split('.')[0] ?? 'Insight'} (${metricaPrincipal.nombre}: ${metricaPrincipal.valor}${metricaPrincipal.unidad ?? ''})`;
    }
    const texto = msg.contenido.replace(/\s+/g, ' ').trim();
    return texto.substring(0, 140);
  });
};

const obtenerEtiquetaMensaje = (
  mensaje: Mensaje,
): { label: string; className: string } | null => {
  if (mensaje.bloquesGenerados && mensaje.bloquesGenerados.length > 0) {
    return {
      label: 'Bloques',
      className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/20 dark:text-emerald-100',
    };
  }
  if (mensaje.razonamiento) {
    return {
      label: 'Análisis',
      className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-400/20 dark:text-indigo-100',
    };
  }
  if (mensaje.contenido.toLowerCase().includes('error')) {
    return {
      label: 'Alerta',
      className: 'bg-rose-100 text-rose-800 dark:bg-rose-400/20 dark:text-rose-100',
    };
  }
  return null;
};

const extraerMinutos = (duracion?: string) => {
  if (!duracion) return 0;
  const match = duracion.match(/\d+/);
  return match ? Number(match[0]) : 0;
};

const calcularMetricasSemanales = (
  weeklyPlan: Record<DayKey, DayPlan>,
  weeklyTargets?: { sessions: number; duration: number; calories: number }
): MetricasSemanales => {
  let totalSessions = 0;
  let totalDuration = 0;
  const modalityDistribution: Record<string, number> = {};
  const intensidades: number[] = [];
  let movilidadSemanal = 0;

  const dailyStats = WEEK_DAYS.map((day) => {
    const plan = weeklyPlan[day];
    const sessions = plan?.sessions ?? [];
    const duration = sessions.reduce((sum, session) => sum + extraerMinutos(session.duration), 0);

    sessions.forEach((session) => {
      modalityDistribution[session.modality] = (modalityDistribution[session.modality] || 0) + 1;
      if (session.modality === 'Mobility' || session.modality === 'Recovery') {
        movilidadSemanal += 1;
      }
      if (session.intensity) {
        const match = session.intensity.match(/RPE\s*(\d+\.?\d*)/i);
        if (match) {
          intensidades.push(parseFloat(match[1]));
        }
      }
    });

    totalSessions += sessions.length;
    totalDuration += duration;

    return {
      day,
      sessions: sessions.length,
      duration,
    };
  });

  const diasDescanso = dailyStats.filter((stat) => stat.sessions === 0).length;
  const diasAltaDensidad = dailyStats.filter((stat) => stat.duration > 90 || stat.sessions > 3);
  const intensidadPromedio = intensidades.length > 0 ? intensidades.reduce((a, b) => a + b, 0) / intensidades.length : 0;
  const intensidadMax = intensidades.length > 0 ? Math.max(...intensidades) : 0;
  const intensidadMin = intensidades.length > 0 ? Math.min(...intensidades) : 0;
  const acuteLoad = totalDuration;
  const chronicLoad = weeklyTargets?.duration ?? totalDuration;
  const loadRatio = chronicLoad > 0 ? Number((acuteLoad / chronicLoad).toFixed(2)) : 1;

  return {
    totalSessions,
    totalDuration,
    promedioDiario: Math.round(totalDuration / WEEK_DAYS.length),
    dailyStats,
    modalityDistribution,
    intensidadPromedio,
    intensidadMax,
    intensidadMin,
    diasDescanso,
    diasAltaDensidad,
    movilidadSemanal,
    acuteLoad,
    chronicLoad,
    loadRatio,
  };
};

const generarInsightsProactivos = (
  metricas: MetricasSemanales,
  selectedDayPlan: DayPlan,
  contextoCliente?: ContextoCliente,
  objetivosProgreso?: ResumenObjetivosProgreso
): InsightProactivo[] => {
  const insights: InsightProactivo[] = [];

  if (metricas.loadRatio > 1.25) {
    insights.push({
      id: 'carga-alta',
      titulo: 'Carga aguda superior al plan',
      descripcion: `La carga semanal actual es ${Math.round((metricas.loadRatio - 1) * 100)}% mayor que la crónica prevista. Considera añadir recuperación.`,
      severidad: 'warning',
      accionLabel: 'Rebalancear semana',
    });
  } else if (metricas.loadRatio < 0.85 && metricas.chronicLoad > 0) {
    insights.push({
      id: 'carga-baja',
      titulo: 'Carga por debajo del objetivo',
      descripcion: 'El volumen semanal está muy por debajo del objetivo. Evalúa añadir sesiones específicas.',
      severidad: 'info',
      accionLabel: 'Añadir bloque',
    });
  }

  if (metricas.diasDescanso < 2) {
    insights.push({
      id: 'descanso',
      titulo: 'Descanso insuficiente',
      descripcion: 'Solo hay un día (o ninguno) sin sesiones. Esto puede limitar la supercompensación.',
      severidad: 'warning',
      accionLabel: 'Insertar descanso',
    });
  }

  if (metricas.movilidadSemanal === 0) {
    insights.push({
      id: 'movilidad',
      titulo: 'Falta de movilidad/recuperación',
      descripcion: 'No se detectan bloques de movilidad o recuperación esta semana.',
      severidad: 'info',
      accionLabel: 'Crear bloque Mobility',
    });
  }

  if (selectedDayPlan.sessions.length > 4 || selectedDayPlan.sessions.some((s) => extraerMinutos(s.duration) > 60)) {
    insights.push({
      id: 'sobrecarga-dia',
      titulo: 'Día con alto volumen',
      descripcion: `El día ${selectedDayPlan.focus} supera los 60 minutos por sesión o más de 4 bloques.`,
      severidad: 'warning',
      accionLabel: 'Dividir sesión',
    });
  }

  const lesionesActivas = contextoCliente?.lesiones?.filter((l) => l.estado === 'activa') ?? [];
  if (lesionesActivas.length > 0 && metricas.intensidadPromedio > 7.5) {
    insights.push({
      id: 'lesiones-intensidad',
      titulo: 'Intensidad elevada con lesiones activas',
      descripcion: 'Revisa que los ejercicios respeten las restricciones actuales del cliente.',
      severidad: 'critical',
      accionLabel: 'Aplicar adaptaciones',
    });
  }

  const objetivosActivos = objetivosProgreso?.objetivos.filter((o) => o.estado === 'in_progress') ?? [];
  if (objetivosActivos.length > 0 && metricas.modalityDistribution['Strength'] && metricas.modalityDistribution['Strength'] < objetivosActivos.length) {
    insights.push({
      id: 'objetivos-fuerza',
      titulo: 'Objetivos de fuerza con poco estímulo',
      descripcion: 'Los bloques de fuerza son limitados respecto a los objetivos activos. Evalúa redistribuir el estímulo.',
      severidad: 'info',
      accionLabel: 'Añadir fuerza',
    });
  }

  return insights;
};

export const AsistenteIAPrograma: React.FC<AsistenteIAProgramaProps> = ({
  weeklyPlan,
  selectedDay,
  selectedDayPlan,
  clientInfo,
  weeklyTargets,
  contextoCliente,
  objetivosProgreso,
  timelineSesiones,
  onAddBlock,
}) => {
  const [modo, setModo] = useState<ModoAsistente>('asistente');
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [inputMensaje, setInputMensaje] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [razonamientoExpandido, setRazonamientoExpandido] = useState<Set<string>>(() => new Set());
  const [bloquesAplicados, setBloquesAplicados] = useState<Set<string>>(() => new Set());
  const [chatSummary, setChatSummary] = useState('');
  const [chatHighlights, setChatHighlights] = useState<string[]>([]);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [promptTemplates, setPromptTemplates] = useState(DEFAULT_PROMPT_TEMPLATES);
  const mensajesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyLoadedRef = useRef(false);
  const metricasSemanales = useMemo(() => calcularMetricasSemanales(weeklyPlan, weeklyTargets), [weeklyPlan, weeklyTargets]);
  const insightsProactivos = useMemo(
    () => generarInsightsProactivos(metricasSemanales, selectedDayPlan, contextoCliente, objetivosProgreso),
    [metricasSemanales, selectedDayPlan, contextoCliente, objetivosProgreso]
  );
  const alertasRapidas = useMemo<AlertaRapida[]>(() => {
    const alertas: AlertaRapida[] = [];

    if (metricasSemanales.diasAltaDensidad.length > 0) {
      alertas.push({
        id: 'alta-densidad',
        label: 'Días exigentes',
        detail: `${metricasSemanales.diasAltaDensidad.length} día(s) superan 90 min o 3 sesiones`,
        tone: 'warning',
      });
    }

    if (metricasSemanales.intensidadPromedio > 7.5) {
      alertas.push({
        id: 'rpe-alto',
        label: 'RPE elevado',
        detail: `Promedio semanal ${metricasSemanales.intensidadPromedio.toFixed(1)}`,
        tone: 'warning',
      });
    }

    if (metricasSemanales.diasDescanso === 0) {
      alertas.push({
        id: 'sin-descanso',
        label: 'Sin días libres',
        detail: 'Añade al menos un día de descarga',
        tone: 'critical',
      });
    }

    if (alertas.length === 0) {
      alertas.push({
        id: 'balanceado',
        label: 'Semana equilibrada',
        detail: 'La carga y las intensidades están dentro de parámetros saludables',
        tone: 'positive',
      });
    }

    return alertas;
  }, [metricasSemanales]);
  const maxDuracionDia = useMemo(() => {
    const valores = metricasSemanales.dailyStats.map((stat) => stat.duration || 0);
    return Math.max(...valores, 1);
  }, [metricasSemanales]);

  const persistConversation = useCallback((historial: Mensaje[], resumen: string, notas: string[]) => {
    try {
      const serializable = historial.map((mensaje) => ({
        ...mensaje,
        timestamp: mensaje.timestamp instanceof Date ? mensaje.timestamp.toISOString() : mensaje.timestamp,
      }));
      localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(serializable));
      localStorage.setItem(CHAT_SUMMARY_STORAGE_KEY, resumen);
      localStorage.setItem(CHAT_NOTES_STORAGE_KEY, JSON.stringify(notas));
    } catch (error) {
      console.error('Error al persistir historial del chat', error);
    }
  }, []);

  const persistPromptTemplates = useCallback((templates: typeof DEFAULT_PROMPT_TEMPLATES) => {
    try {
      localStorage.setItem(PROMPT_TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error('Error al guardar plantillas rápidas', error);
    }
  }, []);

  const sincronizarMemoriaConversacion = useCallback(
    (historial: Mensaje[]) => {
      const resumen = generarResumenConversacion(historial);
      const notas = generarNotasConversacion(historial);
      setChatSummary(resumen);
      setChatHighlights(notas);
      persistConversation(historial, resumen, notas);
    },
    [persistConversation]
  );

  const appendMensaje = useCallback(
    (mensaje: Mensaje) => {
      setMensajes((prev) => {
        const actualizado = [...prev, mensaje].slice(-MAX_CHAT_HISTORY);
        sincronizarMemoriaConversacion(actualizado);
        return actualizado;
      });
    },
    [sincronizarMemoriaConversacion]
  );

  useEffect(() => {
    if (historyLoadedRef.current) return;
    historyLoadedRef.current = true;
    try {
      const storedHistory = localStorage.getItem(CHAT_HISTORY_STORAGE_KEY);
      if (storedHistory) {
        const parsed: Mensaje[] = (JSON.parse(storedHistory) as Mensaje[]).map((mensaje) => ({
          ...mensaje,
          timestamp: mensaje.timestamp ? new Date(mensaje.timestamp) : new Date(),
        }));
        setMensajes(parsed);
        sincronizarMemoriaConversacion(parsed);
      } else {
        const storedSummary = localStorage.getItem(CHAT_SUMMARY_STORAGE_KEY);
        if (storedSummary) setChatSummary(storedSummary);
        const storedNotes = localStorage.getItem(CHAT_NOTES_STORAGE_KEY);
        if (storedNotes) setChatHighlights(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.error('Error al cargar historial del chat', error);
    }
  }, [sincronizarMemoriaConversacion]);

  useEffect(() => {
    try {
      const storedTemplates = localStorage.getItem(PROMPT_TEMPLATES_STORAGE_KEY);
      if (storedTemplates) {
        const parsed = JSON.parse(storedTemplates) as typeof DEFAULT_PROMPT_TEMPLATES;
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPromptTemplates(parsed);
        }
      }
    } catch (error) {
      console.error('Error al cargar plantillas rápidas', error);
    }
  }, []);

  // Inicializar mensaje de bienvenida cuando se cambia a modo chat
  useEffect(() => {
    if (modo === 'chat' && mensajes.length === 0) {
      const mensajeBienvenida: Mensaje = {
        id: 'bienvenida',
        tipo: 'asistente',
        contenido: `¡Hola! Soy tu asistente de entrenamiento. Puedo ayudarte con ajustes y sugerencias sobre el programa actual.\n\nPuedes preguntarme sobre:\n• Ajustes de intensidad o volumen\n• Sugerencias de ejercicios\n• Optimización del plan semanal\n• Análisis de carga de trabajo\n• Adaptaciones por restricciones\n\n¿En qué puedo ayudarte?`,
        timestamp: new Date(),
      };
      const historial = [mensajeBienvenida];
      setMensajes(historial);
      sincronizarMemoriaConversacion(historial);
    }
  }, [modo, sincronizarMemoriaConversacion, mensajes.length]);

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  useEffect(() => {
    if (modo === 'chat') {
      inputRef.current?.focus();
    }
  }, [modo]);

  const procesarConsulta = async (consulta: string): Promise<{ respuesta: string; bloques?: BloqueGenerado[] }> => {
    // Simular procesamiento (en producción sería una llamada a API de IA)
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const consultaLower = consulta.toLowerCase();

    // Análisis del programa actual
    const weekDays: DayKey[] = WEEK_DAYS;
    const metricasActuales = calcularMetricasSemanales(weeklyPlan, weeklyTargets);
    const totalDuration = metricasActuales.totalDuration;

    // Detectar si la consulta solicita generar bloques específicos
    const patronesBloques = [
      { pattern: /añade?\s+(?:un\s+)?calentamiento\s+(?:de\s+)?(\d+)\s*min/i, tipo: 'calentamiento' },
      { pattern: /añade?\s+(?:un\s+)?enfriamiento\s+(?:de\s+)?(\d+)\s*min/i, tipo: 'enfriamiento' },
      { pattern: /añade?\s+(?:un\s+)?bloque\s+(?:de\s+)?(fuerza|cardio|mobility|core|metcon|recuperación|recovery)\s+(?:de\s+)?(\d+)\s*min/i, tipo: 'bloque' },
      { pattern: /crea?\s+(?:un\s+)?(?:bloque\s+)?(?:de\s+)?(calentamiento|enfriamiento|fuerza|cardio|mobility|core|metcon|recuperación|recovery)\s+(?:de\s+)?(\d+)\s*min/i, tipo: 'bloque' },
      { pattern: /genera?\s+(?:un\s+)?(?:bloque\s+)?(?:de\s+)?(calentamiento|enfriamiento|fuerza|cardio|mobility|core|metcon|recuperación|recovery)\s+(?:de\s+)?(\d+)\s*min/i, tipo: 'bloque' },
    ];

    for (const { pattern, tipo } of patronesBloques) {
      const match = consulta.match(pattern);
      if (match) {
        const bloques = generarBloquesDesdeConsulta(consulta, match, tipo, contextoCliente, objetivosProgreso);
        if (bloques && bloques.length > 0) {
          const razonamiento = generarRazonamientoBloques(bloques, contextoCliente, objetivosProgreso);
          return {
            respuesta: `He generado ${bloques.length} bloque(s) listo(s) para añadir al plan. Puedes arrastrarlos al día correspondiente.`,
            bloques,
            razonamiento,
          };
        }
      }
    }

    const intencionesDetectadas = detectarIntencionConsulta(consultaLower);

    const resolverIntencion = (intencion: IntencionConsulta): RespuestaIntencion | null => {
      switch (intencion) {
        case 'intensidad': {
          const respuesta = analizarIntensidad(weeklyPlan, weekDays, selectedDayPlan, contextoCliente, objetivosProgreso);
          const razonamiento = generarRazonamientoIntensidad(weeklyPlan, weekDays, selectedDayPlan, contextoCliente, objetivosProgreso);
          return { respuesta, razonamiento };
        }
        case 'volumen': {
          const respuesta = analizarVolumen(weeklyPlan, weekDays, selectedDayPlan, contextoCliente);
          const razonamiento = generarRazonamientoVolumen(weeklyPlan, weekDays, selectedDayPlan, contextoCliente);
          return { respuesta, razonamiento };
        }
        case 'duracion': {
          const respuesta = analizarDuracion(weeklyPlan, weekDays, selectedDayPlan, totalDuration, contextoCliente);
          const razonamiento = generarRazonamientoDuracion(weeklyPlan, weekDays, selectedDayPlan, totalDuration, weeklyTargets);
          return { respuesta, razonamiento };
        }
        case 'carga': {
          const respuesta = analizarCarga(metricasActuales, contextoCliente);
          const razonamiento = generarRazonamientoCarga(metricasActuales);
          return { respuesta, razonamiento };
        }
        case 'modalidades': {
          const respuesta = analizarModalidades(metricasActuales, selectedDayPlan);
          const razonamiento = generarRazonamientoModalidades(metricasActuales);
          return { respuesta, razonamiento };
        }
        case 'sugerencias': {
          const respuesta = generarSugerencias(selectedDayPlan, clientInfo, weeklyTargets, contextoCliente, objetivosProgreso, timelineSesiones);
          const razonamiento = generarRazonamientoSugerencias(selectedDayPlan, clientInfo, weeklyTargets, contextoCliente, objetivosProgreso);
          return { respuesta, razonamiento };
        }
        case 'restricciones': {
          const respuesta = analizarRestricciones(weeklyPlan, weekDays, clientInfo, contextoCliente);
          const razonamiento = generarRazonamientoRestricciones(clientInfo, contextoCliente);
          return { respuesta, razonamiento };
        }
        case 'dia':
          return { respuesta: analizarDistribucionSemanal(weeklyPlan, weekDays, contextoCliente) };
        case 'resumen':
          return { respuesta: generarResumenEstructurado(weeklyPlan, weekDays, selectedDayPlan, weeklyTargets, contextoCliente, objetivosProgreso) };
        case 'objetivos':
          return { respuesta: analizarObjetivos(selectedDayPlan, clientInfo, weeklyTargets, objetivosProgreso) };
        case 'ajustes': {
          const respuesta = generarSugerenciasAjuste(selectedDayPlan, clientInfo, contextoCliente);
          const razonamiento = generarRazonamientoAjustes(selectedDayPlan, clientInfo, contextoCliente);
          return { respuesta, razonamiento };
        }
        default:
          return null;
      }
    };

    if (intencionesDetectadas.length > 0) {
      const respuestasIntencion = intencionesDetectadas
        .slice(0, 2)
        .map(resolverIntencion)
        .filter((resp): resp is RespuestaIntencion => Boolean(resp));

      if (respuestasIntencion.length > 0) {
        const respuestaTexto = respuestasIntencion
          .map((resp, idx) => (respuestasIntencion.length > 1 ? `${idx + 1}. ${resp.respuesta}` : resp.respuesta))
          .join('\n\n');
        const razonamientoPrincipal = respuestasIntencion.find((resp) => resp.razonamiento)?.razonamiento;
        return { respuesta: respuestaTexto, razonamiento: razonamientoPrincipal };
      }
    }

    // Respuesta por defecto
    return {
      respuesta: buildRespuestaPersonalizada({
        consulta,
        metricas: metricasActuales,
        selectedDay,
        selectedDayPlan,
        clientInfo,
        weeklyTargets,
        contextoCliente,
        chatSummary,
      }),
    };
  };

  // Función para generar bloques desde consultas específicas
  const generarBloquesDesdeConsulta = (
    consulta: string,
    match: RegExpMatchArray,
    tipo: string,
    contextoCliente?: ContextoCliente,
    objetivosProgreso?: ResumenObjetivosProgreso
  ): BloqueGenerado[] => {
    const bloques: BloqueGenerado[] = [];
    const duracion = parseInt(match[1] || match[2] || '10', 10);
    const tipoBloque = match[2] || match[1] || tipo;

    // Considerar restricciones del cliente al generar bloques
    const tieneLesionRodilla = contextoCliente?.lesiones?.some(
      (l) => l.estado === 'activa' && (l.ubicacion.toLowerCase().includes('rodilla') || l.nombre.toLowerCase().includes('rodilla'))
    );
    const tieneLesionLumbar = contextoCliente?.lesiones?.some(
      (l) => l.estado === 'activa' && (l.ubicacion.toLowerCase().includes('lumbar') || l.ubicacion.toLowerCase().includes('espalda'))
    );

    if (tipo === 'calentamiento' || tipoBloque.toLowerCase().includes('calentamiento')) {
      const ejercicios = tieneLesionRodilla
        ? 'Movilidad articular + activación sin impacto'
        : tieneLesionLumbar
        ? 'Movilidad torácica + activación core'
        : 'Movilidad dinámica completa';
      
      bloques.push({
        id: `block-${Date.now()}-1`,
        block: 'Calentamiento dinámico',
        duration: `${duracion} min`,
        modality: 'Mobility',
        intensity: 'Ligera',
        time: '08:00',
        notes: ejercicios,
      });
    } else if (tipo === 'enfriamiento' || tipoBloque.toLowerCase().includes('enfriamiento')) {
      bloques.push({
        id: `block-${Date.now()}-1`,
        block: 'Enfriamiento y estiramiento',
        duration: `${duracion} min`,
        modality: 'Recovery',
        intensity: 'Ligera',
        time: '18:00',
        notes: 'Estiramientos estáticos + respiración',
      });
    } else if (tipoBloque.toLowerCase().includes('fuerza') || tipoBloque.toLowerCase().includes('strength')) {
      const ejercicios = tieneLesionRodilla
        ? 'Ejercicios de tren superior + trabajo unilateral tren inferior'
        : tieneLesionLumbar
        ? 'Ejercicios de fuerza con foco en estabilidad core'
        : 'Bloque de fuerza completo';
      
      bloques.push({
        id: `block-${Date.now()}-1`,
        block: 'Bloque de fuerza',
        duration: `${duracion} min`,
        modality: 'Strength',
        intensity: 'RPE 7',
        time: '10:00',
        notes: ejercicios,
      });
    } else if (tipoBloque.toLowerCase().includes('cardio')) {
      const ejercicios = tieneLesionRodilla
        ? 'Cardio de bajo impacto (bike, elíptica)'
        : 'Cardio zona 2-3';
      
      bloques.push({
        id: `block-${Date.now()}-1`,
        block: 'Bloque de cardio',
        duration: `${duracion} min`,
        modality: 'Cardio',
        intensity: 'Moderada',
        time: '12:00',
        notes: ejercicios,
      });
    } else if (tipoBloque.toLowerCase().includes('mobility')) {
      bloques.push({
        id: `block-${Date.now()}-1`,
        block: 'Movilidad y flexibilidad',
        duration: `${duracion} min`,
        modality: 'Mobility',
        intensity: 'Ligera',
        time: '09:00',
        notes: 'Movilidad articular + estiramientos dinámicos',
      });
    } else if (tipoBloque.toLowerCase().includes('core')) {
      bloques.push({
        id: `block-${Date.now()}-1`,
        block: 'Core y estabilidad',
        duration: `${duracion} min`,
        modality: 'Core',
        intensity: 'Moderada',
        time: '11:00',
        notes: 'Trabajo de core funcional y estabilidad',
      });
    } else if (tipoBloque.toLowerCase().includes('metcon')) {
      const ejercicios = tieneLesionRodilla
        ? 'MetCon de bajo impacto'
        : 'MetCon de alta intensidad';
      
      bloques.push({
        id: `block-${Date.now()}-1`,
        block: 'MetCon',
        duration: `${duracion} min`,
        modality: 'MetCon',
        intensity: 'Alta',
        time: '18:00',
        notes: ejercicios,
      });
    } else if (tipoBloque.toLowerCase().includes('recuperación') || tipoBloque.toLowerCase().includes('recovery')) {
      bloques.push({
        id: `block-${Date.now()}-1`,
        block: 'Recuperación activa',
        duration: `${duracion} min`,
        modality: 'Recovery',
        intensity: 'Ligera',
        time: '19:00',
        notes: 'Movilidad suave + respiración',
      });
    }

    return bloques;
  };

  const analizarIntensidad = (
    weeklyPlan: Record<DayKey, DayPlan>,
    weekDays: DayKey[],
    selectedDayPlan: DayPlan,
    contextoCliente?: ContextoCliente,
    objetivosProgreso?: ResumenObjetivosProgreso
  ): string => {
    const intensidades: string[] = [];
    weekDays.forEach((day) => {
      weeklyPlan[day].sessions.forEach((session) => {
        if (session.intensity) {
          intensidades.push(session.intensity);
        }
      });
    });

    const rpeValues = intensidades
      .map((i) => {
        const match = i.match(/RPE\s*(\d+\.?\d*)/i);
        return match ? parseFloat(match[1]) : null;
      })
      .filter((v): v is number => v !== null);

    const promedioRPE = rpeValues.length > 0 ? rpeValues.reduce((a, b) => a + b, 0) / rpeValues.length : 0;

    let respuesta = `📊 **Análisis de intensidad:**\n\n`;
    if (contextoCliente) {
      respuesta += `**Cliente:** ${contextoCliente.clienteNombre}\n`;
      if (contextoCliente?.lesiones?.some((l) => l.estado === 'activa')) {
        respuesta += `⚠️ **Atención:** Cliente con lesiones activas. Considera intensidades moderadas.\n\n`;
      }
    }
    respuesta += `• Intensidad del día actual (${selectedDay}): ${selectedDayPlan.intensity}\n`;
    respuesta += `• Promedio RPE semanal: ${promedioRPE > 0 ? promedioRPE.toFixed(1) : 'N/A'}\n\n`;

    if (promedioRPE > 8) {
      respuesta += `⚠️ **Observación:** El RPE promedio es alto (${promedioRPE.toFixed(1)}). Considera incluir días de recuperación activa.\n\n`;
    } else if (promedioRPE < 6) {
      respuesta += `💡 **Sugerencia:** El RPE promedio es moderado. Podrías aumentar la intensidad en días clave para mayor estímulo.\n\n`;
    }
    
    if (objetivosProgreso) {
      const objetivosFuerza = objetivosProgreso.objetivos.filter((o) => o.categoria === 'fuerza');
      if (objetivosFuerza.length > 0 && promedioRPE < 7) {
        respuesta += `💪 **Nota:** Tienes objetivos de fuerza activos. Considera aumentar la intensidad en días de fuerza.\n\n`;
      }
    }

    respuesta += `📈 **Distribución de intensidades:**\n`;
    const intensidadCounts: Record<string, number> = {};
    intensidades.forEach((i) => {
      intensidadCounts[i] = (intensidadCounts[i] || 0) + 1;
    });
    Object.entries(intensidadCounts).forEach(([intensidad, count]) => {
      respuesta += `• ${intensidad}: ${count} sesión(es)\n`;
    });

    return respuesta;
  };

const analizarCarga = (metricas: MetricasSemanales, contextoCliente?: ContextoCliente): string => {
  let respuesta = `⚖️ **Balance de carga semanal**\n\n`;
  respuesta += `• Sesiones totales: ${metricas.totalSessions}\n`;
  respuesta += `• Duración total: ${metricas.totalDuration} min\n`;
  respuesta += `• Carga aguda: ${metricas.acuteLoad} min\n`;
  respuesta += `• Carga crónica estimada: ${metricas.chronicLoad} min\n`;
  respuesta += `• Ratio agudo/crónico: ${metricas.loadRatio}\n\n`;

  if (metricas.loadRatio > 1.3) {
    respuesta += `⚠️ La carga aguda supera ampliamente la crónica. Considera añadir sesiones de baja intensidad o descanso.\n\n`;
  } else if (metricas.loadRatio < 0.8) {
    respuesta += `ℹ️ Estás por debajo del objetivo semanal. Puedes sumar volumen específico según los objetivos.\n\n`;
  } else {
    respuesta += `✅ La relación de carga está dentro de un rango saludable.\n\n`;
  }

  if (metricas.diasDescanso < 2) {
    respuesta += `• Solo ${metricas.diasDescanso} día(s) de descanso. Podrías reservar más tiempo para recuperación.\n`;
  }

  if (contextoCliente?.lesiones?.some((l) => l.estado === 'activa')) {
    respuesta += `• Considera la progresión gradual por las lesiones activas del cliente.\n`;
  }

  return respuesta;
};

const generarRazonamientoCarga = (metricas: MetricasSemanales): RazonamientoSugerencia => {
  return {
    metricas: [
      { nombre: 'Sesiones Totales', valor: metricas.totalSessions, unidad: 'sesiones' },
      { nombre: 'Duración Total', valor: metricas.totalDuration, unidad: 'min' },
      { nombre: 'Ratio Agudo/Crónico', valor: metricas.loadRatio, unidad: 'ratio', tendencia: metricas.loadRatio > 1 ? 'up' : metricas.loadRatio < 1 ? 'down' : 'neutral' },
    ],
    razonamiento: `El análisis compara la carga semanal actual (${metricas.acuteLoad} min) contra la crónica prevista (${metricas.chronicLoad} min) para detectar sobrecargas o déficits.`,
    factoresConsiderados: [
      'Duración acumulada de la semana',
      'Objetivo crónico estimado',
      metricas.diasDescanso < 2 ? 'Número reducido de días de descanso' : undefined,
    ].filter(Boolean) as string[],
    confianza: 87,
  };
};

const analizarModalidades = (metricas: MetricasSemanales, selectedDayPlan: DayPlan): string => {
  const totalModalidades = Object.entries(metricas.modalityDistribution)
    .map(([modality, count]) => `• ${modality}: ${count} bloque(s)`)
    .join('\n');

  let respuesta = `🧱 **Balance de modalidades**\n\n${totalModalidades || 'No hay sesiones registradas esta semana.'}\n\n`;
  respuesta += `Día actual (${selectedDayPlan.focus}): ${selectedDayPlan.sessions.length} bloque(s) · ${selectedDayPlan.intensity}\n\n`;

  if (!metricas.modalityDistribution['Mobility'] && !metricas.modalityDistribution['Recovery']) {
    respuesta += `ℹ️ No se detectan bloques de movilidad o recuperación. Añade al menos uno para mejorar la disponibilidad física.\n`;
  }

  if ((metricas.modalityDistribution['Strength'] || 0) > (metricas.modalityDistribution['Cardio'] || 0) * 2) {
    respuesta += `⚖️ Predomina la fuerza sobre el trabajo aeróbico. Evalúa equilibrar según objetivos.\n`;
  }

  return respuesta;
};

const generarRazonamientoModalidades = (metricas: MetricasSemanales): RazonamientoSugerencia => {
  return {
    metricas: [
      { nombre: 'Modalidades Totales', valor: Object.keys(metricas.modalityDistribution).length, unidad: 'tipos' },
      { nombre: 'Bloques Mobility/Recovery', valor: metricas.movilidadSemanal, unidad: 'bloques' },
      { nombre: 'Días Alta Densidad', valor: metricas.diasAltaDensidad.length, unidad: 'días', tendencia: metricas.diasAltaDensidad.length > 1 ? 'up' : 'neutral' },
    ],
    razonamiento: 'Se revisó la cantidad de bloques por modalidad y la presencia de movilidad/recuperación para garantizar equilibrio semanal.',
    factoresConsiderados: [
      'Distribución de modalidades',
      metricas.movilidadSemanal === 0 ? 'Ausencia de movilidad' : undefined,
      metricas.diasAltaDensidad.length > 0 ? 'Días de alta densidad' : undefined,
    ].filter(Boolean) as string[],
    confianza: 83,
  };
};
  const analizarVolumen = (
    weeklyPlan: Record<DayKey, DayPlan>,
    weekDays: DayKey[],
    selectedDayPlan: DayPlan,
    contextoCliente?: ContextoCliente
  ): string => {
    const volumenes: string[] = [];
    weekDays.forEach((day) => {
      if (weeklyPlan[day].volume) {
        volumenes.push(weeklyPlan[day].volume);
      }
    });

    let respuesta = `📊 **Análisis de volumen:**\n\n`;
    if (contextoCliente) {
      respuesta += `**Cliente:** ${contextoCliente.clienteNombre}\n`;
      const habitosRutina = contextoCliente.habitos.find((h) => h.tipo === 'rutina-semanal');
      if (habitosRutina) {
        respuesta += `• Objetivo de sesiones semanales del cliente: ${habitosRutina.objetivo} sesiones\n`;
        respuesta += `• Cumplimiento actual: ${habitosRutina.cumplimiento}%\n\n`;
      }
    }
    respuesta += `• Volumen del día actual (${selectedDay}): ${selectedDayPlan.volume}\n`;
    respuesta += `• Sesiones del día: ${selectedDayPlan.sessions.length}\n\n`;

    respuesta += `📈 **Volumen por día:**\n`;
    weekDays.forEach((day) => {
      const plan = weeklyPlan[day];
      if (plan.volume) {
        respuesta += `• ${day}: ${plan.volume} (${plan.sessions.length} sesiones)\n`;
      }
    });

    const totalSessions = weekDays.reduce((acc, day) => acc + weeklyPlan[day].sessions.length, 0);
    respuesta += `\n• Total semanal: ${totalSessions} sesiones\n`;

    return respuesta;
  };

  const analizarDuracion = (
    weeklyPlan: Record<DayKey, DayPlan>,
    weekDays: DayKey[],
    selectedDayPlan: DayPlan,
    totalDuration: number,
    contextoCliente?: ContextoCliente
  ): string => {
    const duracionesPorDia: Record<string, number> = {};
    weekDays.forEach((day) => {
      const duracionDia = weeklyPlan[day].sessions.reduce((sum, session) => {
        const match = session.duration.match(/\d+/);
        return sum + (match ? Number(match[0]) : 0);
      }, 0);
      duracionesPorDia[day] = duracionDia;
    });

    const duracionDiaActual = duracionesPorDia[selectedDay];

    let respuesta = `⏱️ **Análisis de duración:**\n\n`;
    if (contextoCliente) {
      respuesta += `**Cliente:** ${contextoCliente.clienteNombre}\n`;
      if (contextoCliente.cronotipo === 'matutino') {
        respuesta += `🌅 Cliente matutino - Mejor rendimiento en las primeras horas del día\n\n`;
      } else if (contextoCliente.cronotipo === 'vespertino') {
        respuesta += `🌙 Cliente vespertino - Mejor rendimiento en la tarde/noche\n\n`;
      }
    }
    respuesta += `• Duración del día actual (${selectedDay}): ${duracionDiaActual} min\n`;
    respuesta += `• Duración total semanal: ${totalDuration} min\n`;
    respuesta += `• Promedio diario: ${Math.round(totalDuration / 7)} min\n\n`;

    if (weeklyTargets) {
      const diferencia = totalDuration - weeklyTargets.duration;
      respuesta += `• Objetivo semanal: ${weeklyTargets.duration} min\n`;
      respuesta += `• Diferencia: ${diferencia > 0 ? '+' : ''}${diferencia} min\n\n`;
    }

    respuesta += `📈 **Duración por día:**\n`;
    weekDays.forEach((day) => {
      respuesta += `• ${day}: ${duracionesPorDia[day]} min\n`;
    });

    return respuesta;
  };

  const generarSugerencias = (
    selectedDayPlan: DayPlan,
    clientInfo?: AsistenteIAProgramaProps['clientInfo'],
    weeklyTargets?: AsistenteIAProgramaProps['weeklyTargets'],
    contextoCliente?: ContextoCliente,
    objetivosProgreso?: ResumenObjetivosProgreso,
    timelineSesiones?: TimelineSesiones
  ): string => {
    let respuesta = `💡 **Sugerencias para optimizar el programa:**\n\n`;

    const totalMin = selectedDayPlan.sessions.reduce((acc, s) => {
      const match = s.duration.match(/\d+/);
      return acc + (match ? Number(match[0]) : 0);
    }, 0);

    if (totalMin > 60) {
      respuesta += `• ⚠️ La duración del día es alta (${totalMin} min). Considera dividir en dos sesiones o reducir tiempos.\n\n`;
    }

    if (selectedDayPlan.sessions.length > 3) {
      respuesta += `• 💪 Tienes ${selectedDayPlan.sessions.length} sesiones en el día. Asegúrate de tener suficiente recuperación entre ellas.\n\n`;
    }

    const modalities = selectedDayPlan.sessions.map((s) => s.modality);
    if (!modalities.includes('Mobility') && !modalities.includes('Recovery')) {
      respuesta += `• 🧘 Considera añadir un bloque de movilidad o recuperación para completar el día.\n\n`;
    }

    if (contextoCliente) {
      respuesta += `**Contexto del cliente (${contextoCliente.clienteNombre}):**\n`;
      if (contextoCliente?.lesiones?.some((l) => l.estado === 'activa')) {
        const lesionesActivas = contextoCliente?.lesiones?.filter((l) => l.estado === 'activa') ?? [];
        respuesta += `• ⚠️ Lesiones activas: ${lesionesActivas.map((l) => l.nombre).join(', ')}\n`;
        lesionesActivas.forEach((l) => {
          if (l.restricciones.length > 0) {
            respuesta += `  - ${l.nombre}: ${l.restricciones.join(', ')}\n`;
          }
        });
        respuesta += `\n`;
      }
      if (contextoCliente.disponibilidadMaterial.length > 0) {
        const materialDisponible = contextoCliente.disponibilidadMaterial.filter((m) => m.disponible);
        respuesta += `• 💪 Material disponible: ${materialDisponible.map((m) => m.material).join(', ')}\n\n`;
      }
    }

    if (objetivosProgreso) {
      const objetivosActivos = objetivosProgreso.objetivos.filter((o) => o.estado === 'in_progress');
      if (objetivosActivos.length > 0) {
        respuesta += `**Objetivos activos del cliente:**\n`;
        objetivosActivos.slice(0, 3).forEach((obj) => {
          respuesta += `• ${obj.titulo}: ${obj.progreso}% completado\n`;
        });
        respuesta += `\n`;
      }
    }

    if (timelineSesiones) {
      const patrones = timelineSesiones.resumen.patronesDetectados;
      if (patrones.length > 0) {
        respuesta += `**Patrones detectados:**\n`;
        patrones.forEach((p) => {
          respuesta += `• ${p.tipo}: ${p.descripcion} (${p.severidad})\n`;
        });
        respuesta += `\n`;
      }
    }

    if (clientInfo?.restricciones && clientInfo.restricciones.length > 0) {
      respuesta += `• ⚠️ Restricciones: ${clientInfo.restricciones.join(', ')}\n\n`;
    }

    if (weeklyTargets) {
      respuesta += `• 🎯 Objetivos semanales: ${weeklyTargets.sessions} sesiones, ${weeklyTargets.duration} min, ${weeklyTargets.calories} kcal\n\n`;
    }

    respuesta += `• 📊 Revisa la distribución de intensidades. Alterna días pesados con días ligeros.`;

    return respuesta;
  };

  const analizarRestricciones = (
    weeklyPlan: Record<DayKey, DayPlan>,
    weekDays: DayKey[],
    clientInfo?: AsistenteIAProgramaProps['clientInfo']
  ): string => {
    if (!clientInfo?.restricciones || clientInfo.restricciones.length === 0) {
      return `✅ No hay restricciones registradas para este cliente.`;
    }

    let respuesta = `⚠️ **Análisis de restricciones:**\n\n`;
    respuesta += `**Restricciones del cliente:**\n`;
    clientInfo.restricciones.forEach((r) => {
      respuesta += `• ${r}\n`;
    });

    respuesta += `\n**Recomendaciones:**\n`;
    if (clientInfo.restricciones.some((r) => r.toLowerCase().includes('rodilla') || r.toLowerCase().includes('rotuliana'))) {
      respuesta += `• Evita ejercicios de impacto alto (saltos, sentadillas profundas)\n`;
      respuesta += `• Sustituye por ejercicios de bajo impacto (bike erg, sled push)\n`;
    }
    if (clientInfo.restricciones.some((r) => r.toLowerCase().includes('lumbar') || r.toLowerCase().includes('espalda'))) {
      respuesta += `• Evita hiperextensión lumbar\n`;
      respuesta += `• Enfócate en core estabilidad y movilidad torácica\n`;
    }

    return respuesta;
  };

  const analizarDistribucionSemanal = (weeklyPlan: Record<DayKey, DayPlan>, weekDays: DayKey[]): string => {
    let respuesta = `📅 **Distribución semanal:**\n\n`;

    weekDays.forEach((day) => {
      const plan = weeklyPlan[day];
      const totalMin = plan.sessions.reduce((acc, s) => {
        const match = s.duration.match(/\d+/);
        return acc + (match ? Number(match[0]) : 0);
      }, 0);

      respuesta += `**${day}:**\n`;
      respuesta += `• Foco: ${plan.focus}\n`;
      respuesta += `• Sesiones: ${plan.sessions.length}\n`;
      respuesta += `• Duración: ${totalMin} min\n`;
      respuesta += `• Intensidad: ${plan.intensity}\n\n`;
    });

    return respuesta;
  };

  const generarResumenEstructurado = (
    weeklyPlan: Record<DayKey, DayPlan>,
    weekDays: DayKey[],
    selectedDayPlan: DayPlan,
    weeklyTargets?: AsistenteIAProgramaProps['weeklyTargets']
  ): string => {
    const totalSessions = weekDays.reduce(
      (acc, day) => acc + (weeklyPlan[day]?.sessions?.length ?? 0),
      0,
    );
    const totalDuration = weekDays.reduce((acc, day) => {
      const daySessions = weeklyPlan[day]?.sessions ?? [];
      return (
        acc +
        daySessions.reduce((sum, session) => {
          const match = session.duration?.match(/\d+/);
          return sum + (match ? Number(match[0]) : 0);
        }, 0)
      );
    }, 0);

    let respuesta = `📊 **Resumen estructurado del programa:**\n\n`;
    respuesta += `**Día actual (${selectedDay}):**\n`;
    respuesta += `• Foco: ${selectedDayPlan.focus}\n`;
    respuesta += `• Volumen: ${selectedDayPlan.volume}\n`;
    respuesta += `• Intensidad: ${selectedDayPlan.intensity}\n`;
    respuesta += `• Sesiones: ${selectedDayPlan.sessions.length}\n\n`;

    respuesta += `**Resumen semanal:**\n`;
    respuesta += `• Total de sesiones: ${totalSessions}\n`;
    respuesta += `• Duración total: ${totalDuration} min\n`;
    respuesta += `• Promedio diario: ${Math.round(totalDuration / 7)} min\n\n`;

    if (weeklyTargets) {
      respuesta += `**Objetivos semanales:**\n`;
      respuesta += `• Sesiones: ${weeklyTargets.sessions} (actual: ${totalSessions})\n`;
      respuesta += `• Duración: ${weeklyTargets.duration} min (actual: ${totalDuration} min)\n`;
      respuesta += `• Calorías: ${weeklyTargets.calories} kcal\n`;
    }

    return respuesta;
  };

  const analizarObjetivos = (
    selectedDayPlan: DayPlan,
    clientInfo?: AsistenteIAProgramaProps['clientInfo'],
    weeklyTargets?: AsistenteIAProgramaProps['weeklyTargets']
  ): string => {
    let respuesta = `🎯 **Análisis de objetivos:**\n\n`;

    if (clientInfo?.objetivos && clientInfo.objetivos.length > 0) {
      respuesta += `**Objetivos del cliente:**\n`;
      clientInfo.objetivos.forEach((obj) => {
        respuesta += `• ${obj}\n`;
      });
      respuesta += `\n`;
    }

    if (weeklyTargets) {
      respuesta += `**Objetivos semanales del programa:**\n`;
      respuesta += `• Sesiones: ${weeklyTargets.sessions}\n`;
      respuesta += `• Duración: ${weeklyTargets.duration} min\n`;
      respuesta += `• Calorías: ${weeklyTargets.calories} kcal\n\n`;
    }

    respuesta += `**Objetivo del día actual:**\n`;
    respuesta += `• Foco: ${selectedDayPlan.focus}\n`;
    respuesta += `• Microciclo: ${selectedDayPlan.microCycle}\n`;

    return respuesta;
  };

  const generarSugerenciasAjuste = (
    selectedDayPlan: DayPlan,
    clientInfo?: AsistenteIAProgramaProps['clientInfo']
  ): string => {
    let respuesta = `🔧 **Sugerencias de ajuste:**\n\n`;

    const totalMin = selectedDayPlan.sessions.reduce((acc, s) => {
      const match = s.duration.match(/\d+/);
      return acc + (match ? Number(match[0]) : 0);
    }, 0);

    if (totalMin > 60) {
      respuesta += `• Reduce la duración de algunos bloques para mantener el día en ~50-55 min\n`;
    }

    if (selectedDayPlan.sessions.filter((s) => s.modality === 'Strength').length > 2) {
      respuesta += `• Considera redistribuir los bloques de fuerza para evitar fatiga acumulada\n`;
    }

    if (clientInfo?.restricciones && clientInfo.restricciones.length > 0) {
      respuesta += `• Revisa que todos los ejercicios sean compatibles con las restricciones del cliente\n`;
    }

    respuesta += `• Asegúrate de incluir calentamiento y enfriamiento adecuados\n`;
    respuesta += `• Mantén un equilibrio entre intensidad y volumen`;

    return respuesta;
  };

  // Funciones para generar razonamiento/métricas
  const generarRazonamientoIntensidad = (
    weeklyPlan: Record<DayKey, DayPlan>,
    weekDays: DayKey[],
    selectedDayPlan: DayPlan,
    contextoCliente?: ContextoCliente,
    objetivosProgreso?: ResumenObjetivosProgreso
  ): RazonamientoSugerencia => {
    const intensidades: string[] = [];
    weekDays.forEach((day) => {
      weeklyPlan[day].sessions.forEach((session) => {
        if (session.intensity) intensidades.push(session.intensity);
      });
    });

    const rpeValues = intensidades
      .map((i) => {
        const match = i.match(/RPE\s*(\d+\.?\d*)/i);
        return match ? parseFloat(match[1]) : null;
      })
      .filter((v): v is number => v !== null);

    const promedioRPE = rpeValues.length > 0 ? rpeValues.reduce((a, b) => a + b, 0) / rpeValues.length : 0;
    const maxRPE = rpeValues.length > 0 ? Math.max(...rpeValues) : 0;
    const minRPE = rpeValues.length > 0 ? Math.min(...rpeValues) : 0;

    return {
      metricas: [
        { nombre: 'RPE Promedio Semanal', valor: promedioRPE.toFixed(1), unidad: '/10', tendencia: promedioRPE > 7.5 ? 'up' : promedioRPE < 6 ? 'down' : 'neutral' },
        { nombre: 'RPE Máximo', valor: maxRPE.toFixed(1), unidad: '/10' },
        { nombre: 'RPE Mínimo', valor: minRPE.toFixed(1), unidad: '/10' },
        { nombre: 'Sesiones Analizadas', valor: intensidades.length, unidad: 'sesiones' },
      ],
      razonamiento: `El análisis se basa en ${intensidades.length} sesiones de la semana. El RPE promedio de ${promedioRPE.toFixed(1)} indica ${promedioRPE > 8 ? 'una carga de alta intensidad que requiere días de recuperación' : promedioRPE < 6 ? 'una carga moderada con margen para aumentar intensidad' : 'una distribución equilibrada de intensidades'}.`,
      factoresConsiderados: [
        'Distribución de RPE en todas las sesiones semanales',
        contextoCliente?.lesiones?.some((l) => l.estado === 'activa') ? 'Lesiones activas del cliente' : undefined,
        objetivosProgreso?.objetivos.some((o) => o.categoria === 'fuerza') ? 'Objetivos de fuerza activos' : undefined,
      ].filter(Boolean) as string[],
      confianza: 85,
    };
  };

  const generarRazonamientoVolumen = (
    weeklyPlan: Record<DayKey, DayPlan>,
    weekDays: DayKey[],
    selectedDayPlan: DayPlan,
    contextoCliente?: ContextoCliente
  ): RazonamientoSugerencia => {
    const totalSessions = weekDays.reduce((acc, day) => acc + weeklyPlan[day].sessions.length, 0);
    const habitosRutina = contextoCliente?.habitos.find((h) => h.tipo === 'rutina-semanal');

    return {
      metricas: [
        { nombre: 'Sesiones Totales Semanales', valor: totalSessions, unidad: 'sesiones' },
        { nombre: 'Sesiones del Día Actual', valor: selectedDayPlan.sessions.length, unidad: 'sesiones' },
        habitosRutina ? { nombre: 'Cumplimiento Objetivo Cliente', valor: habitosRutina.cumplimiento, unidad: '%', tendencia: habitosRutina.cumplimiento > 80 ? 'up' : 'down' } : undefined,
      ].filter(Boolean) as RazonamientoSugerencia['metricas'],
      razonamiento: `El volumen semanal de ${totalSessions} sesiones ${habitosRutina ? `representa un ${habitosRutina.cumplimiento}% del objetivo del cliente (${habitosRutina.objetivo} sesiones)` : 'está distribuido a lo largo de la semana'}.`,
      factoresConsiderados: [
        'Número total de sesiones programadas',
        habitosRutina ? 'Objetivo de sesiones del cliente' : undefined,
        'Distribución por día de la semana',
      ].filter(Boolean) as string[],
      confianza: 90,
    };
  };

  const generarRazonamientoDuracion = (
    weeklyPlan: Record<DayKey, DayPlan>,
    weekDays: DayKey[],
    selectedDayPlan: DayPlan,
    totalDuration: number,
    weeklyTargets?: { sessions: number; duration: number; calories: number }
  ): RazonamientoSugerencia => {
    const duracionDiaActual = selectedDayPlan.sessions.reduce((sum, session) => {
      const match = session.duration.match(/\d+/);
      return sum + (match ? Number(match[0]) : 0);
    }, 0);
    const diferencia = weeklyTargets ? totalDuration - weeklyTargets.duration : 0;

    return {
      metricas: [
        { nombre: 'Duración Total Semanal', valor: totalDuration, unidad: 'min' },
        { nombre: 'Duración Día Actual', valor: duracionDiaActual, unidad: 'min' },
        { nombre: 'Promedio Diario', valor: Math.round(totalDuration / 7), unidad: 'min' },
        weeklyTargets ? { nombre: 'Diferencia vs Objetivo', valor: diferencia, unidad: 'min', tendencia: diferencia > 0 ? 'up' : diferencia < 0 ? 'down' : 'neutral' } : undefined,
      ].filter(Boolean) as RazonamientoSugerencia['metricas'],
      razonamiento: `La duración total semanal de ${totalDuration} minutos ${weeklyTargets ? `está ${diferencia > 0 ? `${diferencia} minutos por encima` : diferencia < 0 ? `${Math.abs(diferencia)} minutos por debajo` : 'exactamente en'} del objetivo de ${weeklyTargets.duration} minutos` : 'está distribuida a lo largo de la semana'}.`,
      factoresConsiderados: [
        'Duración acumulada de todas las sesiones',
        weeklyTargets ? 'Objetivo semanal de duración' : undefined,
        'Distribución temporal por día',
      ].filter(Boolean) as string[],
      confianza: 88,
    };
  };

  const generarRazonamientoSugerencias = (
    selectedDayPlan: DayPlan,
    clientInfo?: AsistenteIAProgramaProps['clientInfo'],
    weeklyTargets?: AsistenteIAProgramaProps['weeklyTargets'],
    contextoCliente?: ContextoCliente,
    objetivosProgreso?: ResumenObjetivosProgreso
  ): RazonamientoSugerencia => {
    const totalMin = selectedDayPlan.sessions.reduce((acc, s) => {
      const match = s.duration.match(/\d+/);
      return acc + (match ? Number(match[0]) : 0);
    }, 0);
    const lesionesActivas = contextoCliente?.lesiones?.filter((l) => l.estado === 'activa') || [];
    const objetivosActivos = objetivosProgreso?.objetivos.filter((o) => o.estado === 'in_progress') || [];

    return {
      metricas: [
        { nombre: 'Duración Total del Día', valor: totalMin, unidad: 'min', tendencia: totalMin > 60 ? 'up' : 'neutral' },
        { nombre: 'Número de Sesiones', valor: selectedDayPlan.sessions.length, unidad: 'sesiones' },
        lesionesActivas.length > 0 ? { nombre: 'Lesiones Activas', valor: lesionesActivas.length, unidad: 'lesiones' } : undefined,
        objetivosActivos.length > 0 ? { nombre: 'Objetivos Activos', valor: objetivosActivos.length, unidad: 'objetivos' } : undefined,
      ].filter(Boolean) as RazonamientoSugerencia['metricas'],
      razonamiento: `Las sugerencias consideran ${totalMin > 60 ? 'la alta duración del día que puede beneficiarse de división' : 'la duración actual del día'}, ${lesionesActivas.length > 0 ? `${lesionesActivas.length} lesión(es) activa(s) que requieren adaptaciones` : 'sin lesiones activas'}, y ${objetivosActivos.length > 0 ? `${objetivosActivos.length} objetivo(s) en progreso` : 'los objetivos del programa'}.`,
      factoresConsiderados: [
        'Duración y número de sesiones del día',
        lesionesActivas.length > 0 ? 'Restricciones por lesiones activas' : undefined,
        objetivosActivos.length > 0 ? 'Objetivos del cliente en progreso' : undefined,
        weeklyTargets ? 'Objetivos semanales del programa' : undefined,
        'Distribución de modalidades',
      ].filter(Boolean) as string[],
      confianza: 82,
    };
  };

  const generarRazonamientoRestricciones = (
    clientInfo?: AsistenteIAProgramaProps['clientInfo'],
    contextoCliente?: ContextoCliente
  ): RazonamientoSugerencia => {
    const lesionesActivas = contextoCliente?.lesiones?.filter((l) => l.estado === 'activa') || [];
    const restriccionesGenerales = clientInfo?.restricciones || [];
    const todasLasRestricciones = [
      ...restriccionesGenerales,
      ...lesionesActivas.flatMap((l) => l.restricciones),
    ];

    return {
      metricas: [
        { nombre: 'Lesiones Activas', valor: lesionesActivas.length, unidad: 'lesiones' },
        { nombre: 'Restricciones Totales', valor: todasLasRestricciones.length, unidad: 'restricciones' },
      ],
      razonamiento: `Se identificaron ${lesionesActivas.length} lesión(es) activa(s) y ${todasLasRestricciones.length} restricción(es) total(es) que deben considerarse al diseñar el programa de entrenamiento.`,
      factoresConsiderados: [
        'Lesiones activas del cliente',
        'Restricciones generales',
        'Severidad de las lesiones',
        'Recomendaciones médicas o de fisioterapia',
      ],
      confianza: 95,
    };
  };

  const generarRazonamientoAjustes = (
    selectedDayPlan: DayPlan,
    clientInfo?: AsistenteIAProgramaProps['clientInfo'],
    contextoCliente?: ContextoCliente
  ): RazonamientoSugerencia => {
    const totalMin = selectedDayPlan.sessions.reduce((acc, s) => {
      const match = s.duration.match(/\d+/);
      return acc + (match ? Number(match[0]) : 0);
    }, 0);
    const bloquesFuerza = selectedDayPlan.sessions.filter((s) => s.modality === 'Strength').length;

    return {
      metricas: [
        { nombre: 'Duración Total', valor: totalMin, unidad: 'min', tendencia: totalMin > 60 ? 'up' : 'neutral' },
        { nombre: 'Bloques de Fuerza', valor: bloquesFuerza, unidad: 'bloques', tendencia: bloquesFuerza > 2 ? 'up' : 'neutral' },
      ],
      razonamiento: `Los ajustes sugeridos se basan en ${totalMin > 60 ? 'la duración elevada del día' : 'la duración actual'}, ${bloquesFuerza > 2 ? 'la presencia de múltiples bloques de fuerza que pueden causar fatiga' : 'la distribución de modalidades'}, y las restricciones del cliente.`,
      factoresConsiderados: [
        'Duración total del día',
        'Número de bloques por modalidad',
        clientInfo?.restricciones && clientInfo.restricciones.length > 0 ? 'Restricciones del cliente' : undefined,
        'Equilibrio entre intensidad y volumen',
      ].filter(Boolean) as string[],
      confianza: 80,
    };
  };

  const generarRazonamientoBloques = (
    bloques: BloqueGenerado[],
    contextoCliente?: ContextoCliente,
    objetivosProgreso?: ResumenObjetivosProgreso
  ): RazonamientoSugerencia => {
    const lesionesActivas = contextoCliente?.lesiones?.filter((l) => l.estado === 'activa') || [];
    const totalDuracion = bloques.reduce((acc, b) => {
      const match = b.duration.match(/\d+/);
      return acc + (match ? Number(match[0]) : 0);
    }, 0);

    return {
      metricas: [
        { nombre: 'Bloques Generados', valor: bloques.length, unidad: 'bloques' },
        { nombre: 'Duración Total', valor: totalDuracion, unidad: 'min' },
        lesionesActivas.length > 0 ? { nombre: 'Adaptaciones por Lesiones', valor: lesionesActivas.length, unidad: 'lesiones' } : undefined,
      ].filter(Boolean) as RazonamientoSugerencia['metricas'],
      razonamiento: `Se generaron ${bloques.length} bloque(s) con una duración total de ${totalDuracion} minutos. ${lesionesActivas.length > 0 ? `Los bloques han sido adaptados considerando ${lesionesActivas.length} lesión(es) activa(s).` : 'Los bloques están optimizados para el programa actual.'}`,
      factoresConsiderados: [
        'Tipo de bloque solicitado',
        lesionesActivas.length > 0 ? 'Restricciones por lesiones' : undefined,
        objetivosProgreso ? 'Objetivos del cliente' : undefined,
        'Duración solicitada',
      ].filter(Boolean) as string[],
      confianza: 88,
    };
  };

  // Función para guardar conversación
  const guardarConversacion = (mensajeId: string) => {
    const mensaje = mensajes.find((m) => m.id === mensajeId);
    if (!mensaje || mensaje.tipo !== 'asistente') return;

    const conversacionGuardada = {
      id: `saved-${Date.now()}`,
      clienteId: clientInfo?.nombre || 'Sin cliente',
      clienteNombre: clientInfo?.nombre || 'Sin cliente',
      mensaje: mensaje.contenido,
      razonamiento: mensaje.razonamiento,
      timestamp: mensaje.timestamp.toISOString(),
      fechaGuardado: new Date().toISOString(),
      tipo: 'conversacion' as const,
    };

    try {
      const guardadas = JSON.parse(localStorage.getItem('conversacionesGuardadas') || '[]');
      guardadas.push(conversacionGuardada);
      localStorage.setItem('conversacionesGuardadas', JSON.stringify(guardadas));
      
      // Marcar mensaje como guardado
      setMensajes((prev) => {
        const actualizados = prev.map((m) => (m.id === mensajeId ? { ...m, guardado: true } : m));
        sincronizarMemoriaConversacion(actualizados);
        return actualizados;
      });
    } catch (error) {
      console.error('Error al guardar conversación:', error);
    }
  };

  const toggleRazonamiento = (mensajeId: string) => {
    setRazonamientoExpandido((prev) => {
      const nuevo = new Set(prev);
      if (nuevo.has(mensajeId)) {
        nuevo.delete(mensajeId);
      } else {
        nuevo.add(mensajeId);
      }
      return nuevo;
    });
  };

  const handleEnviar = async (mensajeManual?: string) => {
    const contenidoPlano = (mensajeManual ?? inputMensaje).trim();
    if (!contenidoPlano || procesando) return;

    const mensajeUsuario: Mensaje = {
      id: `msg-${Date.now()}`,
      tipo: 'usuario',
      contenido: contenidoPlano,
      timestamp: new Date(),
    };

    appendMensaje(mensajeUsuario);
    setInputMensaje('');
    setProcesando(true);

    try {
      const resultado = await procesarConsulta(contenidoPlano);
      const mensajeAsistente: Mensaje = {
        id: `msg-${Date.now() + 1}`,
        tipo: 'asistente',
        contenido: resultado.respuesta,
        timestamp: new Date(),
        bloquesGenerados: resultado.bloques,
        razonamiento: resultado.razonamiento,
      };
      appendMensaje(mensajeAsistente);
    } catch (error) {
      const mensajeError: Mensaje = {
        id: `msg-${Date.now() + 1}`,
        tipo: 'asistente',
        contenido: 'Lo siento, hubo un error al procesar tu consulta. Por favor, intenta de nuevo.',
        timestamp: new Date(),
      };
      appendMensaje(mensajeError);
    } finally {
      setProcesando(false);
    }
  };

  const handleAplicarBloque = (bloque: BloqueGenerado) => {
    if (!onAddBlock) return;
    const session: DaySession = {
      id: bloque.id,
      block: bloque.block,
      duration: bloque.duration,
      modality: bloque.modality as DaySession['modality'],
      intensity: bloque.intensity,
      time: bloque.time ?? 'Sin hora',
      notes: bloque.notes,
    };
    onAddBlock(session);
    setBloquesAplicados((prev) => {
      const next = new Set(prev);
      next.add(bloque.id);
      return next;
    });
  };

  const handleQuickPrompt = (prompt: string) => {
    handleEnviar(prompt);
  };

  const handleCopyMensaje = async (mensaje: Mensaje) => {
    try {
      await navigator.clipboard.writeText(mensaje.contenido);
      setCopiedMessageId(mensaje.id);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('No se pudo copiar el mensaje', error);
    }
  };

  const handleSavePromptTemplate = () => {
    const texto = inputMensaje.trim();
    if (!texto) return;
    const nombre = window.prompt('Nombre para la plantilla', `Plantilla ${promptTemplates.length + 1}`);
    if (!nombre) return;
    const nuevaPlantilla = { id: `template-${Date.now()}`, label: nombre.trim(), prompt: texto };
    setPromptTemplates((prev) => {
      const sinDuplicados = prev.filter((tpl) => tpl.prompt !== texto);
      const actualizadas = [...sinDuplicados, nuevaPlantilla].slice(-MAX_PROMPT_TEMPLATES);
      persistPromptTemplates(actualizadas);
      return actualizadas;
    });
    setInputMensaje('');
  };

  const handleRemovePromptTemplate = (templateId: string) => {
    setPromptTemplates((prev) => {
      const actualizadas = prev.filter((tpl) => tpl.id !== templateId);
      persistPromptTemplates(actualizadas);
      return actualizadas.length > 0 ? actualizadas : [];
    });
  };

  const handleUsePromptTemplate = (prompt: string) => {
    handleEnviar(prompt);
  };

  const handleAplicarSugerencia = (mensaje: Mensaje) => {
    setInputMensaje(mensaje.contenido);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  // Generar resumen estructurado para modo Asistente
  const generarResumenModoAsistente = (): string => {
    const totalSessions = metricasSemanales.totalSessions;
    const totalDuration = metricasSemanales.totalDuration;
    let resumen = `📊 **Resumen del programa - ${selectedDay}**\n\n`;
    resumen += `**Día actual:**\n`;
    resumen += `• Foco: ${selectedDayPlan?.focus ?? 'Sin definir'}\n`;
    resumen += `• Microciclo: ${selectedDayPlan?.microCycle ?? 'Sin definir'}\n`;
    resumen += `• Volumen: ${selectedDayPlan?.volume ?? 'Sin definir'}\n`;
    resumen += `• Intensidad: ${selectedDayPlan?.intensity ?? 'Sin definir'}\n`;
    resumen += `• Sesiones: ${selectedDayPlan?.sessions?.length ?? 0}\n\n`;

    resumen += `**Resumen semanal:**\n`;
    resumen += `• Total de sesiones: ${totalSessions}\n`;
    resumen += `• Duración total: ${totalDuration} min\n`;
    resumen += `• Promedio diario: ${metricasSemanales.promedioDiario} min\n`;
    resumen += `• Ratio carga aguda/crónica: ${metricasSemanales.loadRatio}\n\n`;

    if (weeklyTargets) {
      resumen += `**Objetivos:**\n`;
      resumen += `• Sesiones: ${weeklyTargets.sessions} (${totalSessions} actuales)\n`;
      resumen += `• Duración: ${weeklyTargets.duration} min (${totalDuration} actuales)\n`;
      resumen += `• Calorías: ${weeklyTargets.calories} kcal\n\n`;
    }

    resumen += `**Sesiones del día:**\n`;
    (selectedDayPlan?.sessions ?? []).forEach((session, idx) => {
      resumen += `${idx + 1}. ${session.block} (${session.time}) - ${session.duration} - ${session.modality} - ${session.intensity}\n`;
    });

    resumen += `\n**Distribución semanal:**\n`;
    metricasSemanales.dailyStats.forEach((stat) => {
      resumen += `• ${stat.day}: ${stat.sessions} sesiones · ${stat.duration} min\n`;
    });

    return resumen;
  };

  return (
    <div className="space-y-4">
      {/* Selector de modo */}
      <div className="flex items-center justify-center">
        <Tabs
          items={[
            {
              id: 'asistente',
              label: 'Asistente',
              icon: <FileText className="h-4 w-4" />,
            },
            {
              id: 'chat',
              label: 'Chat',
              icon: <MessageSquare className="h-4 w-4" />,
            },
          ]}
          activeTab={modo}
          onTabChange={(tabId) => {
            setModo(tabId as ModoAsistente);
            if (tabId === 'chat' && mensajes.length === 0) {
              // El useEffect se encargará de añadir el mensaje de bienvenida
            }
          }}
          variant="pills"
          size="sm"
        />
      </div>

      {/* Contenido según el modo */}
      {modo === 'asistente' ? (
        <div className="grid gap-4 xl:grid-cols-5">
          <div className="space-y-4 xl:col-span-3">
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/40">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase text-slate-500 tracking-wide">Plan del día</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {selectedDay} · {selectedDayPlan.focus}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedDayPlan.volume} · {selectedDayPlan.intensity}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                    Ratio carga: {metricasSemanales.loadRatio}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                    {metricasSemanales.totalSessions} sesiones
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-950/60">
                <p className="text-xs text-slate-500 uppercase">Duración total</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{metricasSemanales.totalDuration} min</p>
                <p className="text-xs text-slate-500">Promedio {metricasSemanales.promedioDiario} min/día</p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-950/60">
                <p className="text-xs text-slate-500 uppercase">Intensidad</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  {metricasSemanales.intensidadPromedio > 0 ? metricasSemanales.intensidadPromedio.toFixed(1) : 'N/A'} RPE
                </p>
                <p className="text-xs text-slate-500">Rango {metricasSemanales.intensidadMin}-{metricasSemanales.intensidadMax}</p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-950/60">
                <p className="text-xs text-slate-500 uppercase">Descansos</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{metricasSemanales.diasDescanso}</p>
                <p className="text-xs text-slate-500">{metricasSemanales.diasAltaDensidad.length} día(s) de alta densidad</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-white/95 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/60">
              <div className="flex items-start gap-3 mb-4">
                <Sparkles className="h-5 w-5 text-indigo-500 mt-0.5" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Resumen estructurado</h3>
              </div>
              <div className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                {generarResumenModoAsistente()}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-white/95 p-6 dark:border-slate-800/70 dark:bg-slate-950/60">
              <div className="flex items-start gap-3 mb-4">
                <BarChart3 className="h-5 w-5 text-indigo-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Distribución diaria</h3>
                  <p className="text-xs text-slate-500">Sesiones y minutos por día</p>
                </div>
              </div>
              <div className="space-y-3">
                {metricasSemanales.dailyStats.map((stat) => (
                  <div key={stat.day}>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>{stat.day}</span>
                      <span>{stat.sessions} sesiones · {stat.duration} min</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                      <div
                        className="h-2 rounded-full bg-indigo-500 dark:bg-indigo-400"
                        style={{ width: `${Math.min(100, (stat.duration / maxDuracionDia) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 xl:col-span-2">
            <div className="rounded-2xl border border-slate-200/70 bg-white/95 p-6 dark:border-slate-800/70 dark:bg-slate-950/60">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Insights proactivos</h3>
              </div>
              {insightsProactivos.length === 0 ? (
                <p className="text-sm text-slate-500">Todo en orden. No se detectan riesgos relevantes esta semana.</p>
              ) : (
                <div className="space-y-3">
                  {insightsProactivos.map((insight) => {
                    const colorMap: Record<InsightProactivo['severidad'], string> = {
                      info: 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900/40 dark:bg-sky-900/30 dark:text-sky-100',
                      warning: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/30 dark:text-amber-100',
                      critical: 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-100',
                    };
                    return (
                      <div key={insight.id} className={`rounded-xl border px-3 py-2 text-sm ${colorMap[insight.severidad]}`}>
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold">{insight.titulo}</p>
                          {insight.accionLabel && (
                            <span className="text-xs uppercase tracking-wide">{insight.accionLabel}</span>
                          )}
                        </div>
                        <p className="mt-1 text-xs opacity-80">{insight.descripcion}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-white/95 p-5 dark:border-slate-800/70 dark:bg-slate-950/60">
              <div className="flex items-start gap-3 mb-3">
                <TrendingUp className="h-5 w-5 text-indigo-500 mt-0.5" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Alertas rápidas</h3>
              </div>
              <div className="space-y-2">
                {alertasRapidas.map((alerta) => {
                  const toneClasses: Record<AlertaRapida['tone'], string> = {
                    positive: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-100 dark:border-emerald-900/40',
                    warning: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-100 dark:border-amber-900/40',
                    critical: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-900/20 dark:text-rose-100 dark:border-rose-900/40',
                  };
                  return (
                    <div key={alerta.id} className={`rounded-xl border px-3 py-2 text-xs ${toneClasses[alerta.tone]}`}>
                      <p className="font-semibold">{alerta.label}</p>
                      <p className="opacity-80">{alerta.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-white/95 p-5 dark:border-slate-800/70 dark:bg-slate-950/60">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Acciones rápidas</h3>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={() => setModo('chat')} leftIcon={<MessageSquare className="h-4 w-4" />}>
                  Abrir chat inteligente
                </Button>
                {onAddBlock && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      handleAplicarBloque({
                        id: `quick-mobility-${Date.now()}`,
                        block: 'Movilidad restaurativa',
                        duration: '12 min',
                        modality: 'Mobility',
                        intensity: 'Ligera',
                        time: '09:00',
                        notes: 'Articulaciones + respiración diafragmática',
                      })
                    }
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Insertar bloque Mobility
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-[600px] border border-slate-200/70 rounded-2xl bg-white/95 dark:border-slate-800/70 dark:bg-slate-950/60 overflow-hidden">
          {/* Header del chat */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-200/70 dark:border-slate-800/70">
            <div className="p-2 bg-indigo-100 rounded-lg dark:bg-indigo-500/20">
              <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Asistente de IA</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Conversación sobre ajustes del programa</p>
            </div>
          </div>

          {(chatSummary || chatHighlights.length > 0) && (
            <div className="border-b border-slate-200/70 bg-slate-50/70 px-4 py-3 text-xs text-slate-600 dark:border-slate-800/70 dark:bg-slate-900/50 dark:text-slate-300">
              {chatSummary && (
                <div className="mb-2">
                  <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1 text-xs">Contexto reciente</p>
                  <p className="line-clamp-2">{chatSummary}</p>
                </div>
              )}
              {chatHighlights.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {chatHighlights.map((nota, index) => (
                    <span
                      key={`${nota}-${index}`}
                      className="rounded-full bg-white px-2 py-1 text-[11px] text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-200"
                    >
                      {nota}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="border-b border-slate-200/70 bg-white/80 px-4 py-2 text-xs dark:border-slate-800/70 dark:bg-slate-950/50">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400">Atajos:</span>
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt.id}
                  type="button"
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                  disabled={procesando}
                  className="rounded-full border border-slate-200/70 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-indigo-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>

          {promptTemplates.length > 0 && (
            <div className="border-b border-slate-200/70 bg-slate-50/70 px-4 py-2 text-xs dark:border-slate-800/70 dark:bg-slate-900/40">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400">Plantillas:</span>
                {promptTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center gap-1 rounded-full border border-slate-200/70 bg-white px-3 py-1 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <button
                      type="button"
                      onClick={() => handleUsePromptTemplate(template.prompt)}
                      className="text-xs font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-300"
                    >
                      {template.label}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemovePromptTemplate(template.id)}
                      className="text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mensajes.map((mensaje) => {
              const etiquetaMensaje = obtenerEtiquetaMensaje(mensaje);
              return (
                <div
                key={mensaje.id}
                className={`flex ${mensaje.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    mensaje.tipo === 'usuario'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-900 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  {mensaje.tipo === 'asistente' && (
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xs font-medium">Asistente</span>
                        {etiquetaMensaje && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${etiquetaMensaje.className}`}>
                            {etiquetaMensaje.label}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleCopyMensaje(mensaje)}
                          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
                        >
                          <Copy className="w-3 h-3" />
                          {copiedMessageId === mensaje.id ? 'Copiado' : 'Copiar'}
                        </button>
                        {!mensaje.bloquesGenerados?.length && (
                          <button
                            onClick={() => handleAplicarSugerencia(mensaje)}
                            className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                          >
                            <Sparkles className="w-3 h-3" />
                            Aplicar ajuste
                          </button>
                        )}
                        {mensaje.razonamiento && (
                          <button
                            onClick={() => toggleRazonamiento(mensaje.id)}
                            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            <BarChart3 className="w-3 h-3" />
                            {razonamientoExpandido.has(mensaje.id) ? 'Ocultar métricas' : 'Ver métricas'}
                            {razonamientoExpandido.has(mensaje.id) ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>
                        )}
                        {!mensaje.guardado && (
                          <button
                            onClick={() => guardarConversacion(mensaje.id)}
                            className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                            title="Guardar como nota o plantilla"
                          >
                            <Bookmark className="w-3 h-3" />
                            Guardar
                          </button>
                        )}
                        {mensaje.guardado && (
                          <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            Guardado
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-sm">{mensaje.contenido}</div>
                  
                  {/* Razonamiento expandido */}
                  {mensaje.tipo === 'asistente' && mensaje.razonamiento && razonamientoExpandido.has(mensaje.id) && (
                    <div className="mt-3 pt-3 border-t border-gray-300 dark:border-slate-600">
                      <div className="space-y-3">
                        {mensaje.razonamiento.metricas && mensaje.razonamiento.metricas.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                              <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">Métricas clave</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {mensaje.razonamiento.metricas.map((metrica, idx) => (
                                <div
                                  key={idx}
                                  className="rounded-lg bg-indigo-50 dark:bg-indigo-500/10 p-2"
                                >
                                  <div className="text-xs text-gray-600 dark:text-slate-400">{metrica.nombre}</div>
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                                      {metrica.valor}
                                    </span>
                                    {metrica.unidad && (
                                      <span className="text-xs text-gray-500 dark:text-slate-400">{metrica.unidad}</span>
                                    )}
                                    {metrica.tendencia && (
                                      <TrendingUp
                                        className={`w-3 h-3 ${
                                          metrica.tendencia === 'up'
                                            ? 'text-red-500'
                                            : metrica.tendencia === 'down'
                                            ? 'text-green-500'
                                            : 'text-gray-400'
                                        }`}
                                      />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {mensaje.razonamiento.razonamiento && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                              <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">Razonamiento</span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                              {mensaje.razonamiento.razonamiento}
                            </p>
                          </div>
                        )}
                        
                        {mensaje.razonamiento.factoresConsiderados && mensaje.razonamiento.factoresConsiderados.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                              <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">Factores considerados</span>
                            </div>
                            <ul className="space-y-1">
                              {mensaje.razonamiento.factoresConsiderados.map((factor, idx) => (
                                <li key={idx} className="text-xs text-gray-600 dark:text-slate-400 flex items-start gap-2">
                                  <span className="text-indigo-500 mt-0.5">•</span>
                                  <span>{factor}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {mensaje.razonamiento.confianza !== undefined && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-600 dark:text-slate-400">Confianza:</span>
                            <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-indigo-500 h-2 rounded-full"
                                style={{ width: `${mensaje.razonamiento.confianza}%` }}
                              />
                            </div>
                            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                              {mensaje.razonamiento.confianza}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {mensaje.bloquesGenerados && mensaje.bloquesGenerados.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {mensaje.bloquesGenerados.map((bloque) => (
                        <div
                          key={bloque.id}
                          className="rounded-xl border border-indigo-200 bg-white/90 p-3 text-xs text-slate-700 dark:border-indigo-500/40 dark:bg-slate-900/60 dark:text-slate-200"
                          draggable
                          onDragStart={(event) => {
                            event.dataTransfer.setData('application/json', JSON.stringify(bloque));
                            event.dataTransfer.effectAllowed = 'copy';
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                                <GripVertical className="h-3 w-3 text-slate-400" />
                                {bloque.block}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{bloque.modality} · {bloque.duration} · {bloque.intensity}</p>
                              {bloque.notes && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{bloque.notes}</p>}
                            </div>
                            {onAddBlock && (
                              <Button
                                size="xs"
                                variant="primary"
                                onClick={() => handleAplicarBloque(bloque)}
                                disabled={bloquesAplicados.has(bloque.id)}
                              >
                                {bloquesAplicados.has(bloque.id) ? 'Añadido' : 'Añadir'}
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div
                    className={`text-xs mt-2 ${
                      mensaje.tipo === 'usuario' ? 'text-indigo-200' : 'text-gray-500 dark:text-slate-400'
                    }`}
                  >
                    {mensaje.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                </div>
              );
            })}
            {procesando && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 dark:bg-slate-800">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            )}
            <div ref={mensajesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200/70 dark:border-slate-800/70">
            <div className="flex flex-wrap gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMensaje}
                onChange={(e) => setInputMensaje(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Pregunta sobre ajustes del programa..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                disabled={procesando}
              />
              <Button
                variant="primary"
                onClick={() => handleEnviar()}
                disabled={!inputMensaje.trim() || procesando}
                leftIcon={procesando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              >
                Enviar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSavePromptTemplate}
                disabled={!inputMensaje.trim()}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Guardar plantilla
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
              Ejemplos: "¿Cómo ajustar la intensidad?", "Sugerencias para optimizar el volumen", "Análisis de restricciones"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

