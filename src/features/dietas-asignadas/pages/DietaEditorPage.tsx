import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Tabs, Badge, MetricCards } from '../../../components/componentsreutilizables';
import type { MetricCardData, TabItem } from '../../../components/componentsreutilizables';
import { getDieta, guardarComoBorrador, publicarDieta, duplicarDieta, registrarCambioDieta, type VariacionDieta } from '../api';
import { getBloquesPersonalizados } from '../api/recursos';
import type { Dieta, Comida, TipoAccionRapida, RecursoBiblioteca, FiltrosBiblioteca, DragData, DropTarget, TipoComida, ObjetivoNutricional, Alimento, MetadatosDia, VariacionAutomatica } from '../types';
import { SaveButton, AIAssistant, HistorialCambios, AtajosRapidos, useAtajosRapidos, BibliotecaRecursos, AlertasTopbar, EditorBloquePersonalizado, TagsComentariosDia, ConfiguracionVariaciones, VistaTimeline, SustitutosComida } from '../components';
import type { Inconsistencia } from '../utils/detectarInconsistencias';
import { useIsTablet } from '../hooks/useIsTablet';
import {
  ArrowLeft,
  Sparkles,
  Save,
  Target,
  Flame,
  Apple,
  Droplets,
  TrendingUp,
  Brain,
  Calendar,
  CalendarRange,
  CalendarCheck,
  Copy,
  Shuffle,
  RefreshCcw,
  CheckCircle2,
  ShoppingCart,
  AlertTriangle,
  BarChart3,
  Filter,
  Search,
  SlidersHorizontal,
  ChefHat,
  Clock,
  UtensilsCrossed,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Library,
  PlusCircle,
  Edit,
  Copy as CopyIcon,
  ChevronDown,
  History,
  Coffee,
  ArrowDown,
  ArrowUp,
  X,
  Check,
  LayoutGrid,
  List,
  Lock,
  Unlock,
  RotateCcw,
  Clock as ClockIcon,
} from 'lucide-react';

const diasSemana = [
  { id: 'lunes', label: 'L', nombre: 'Lunes' },
  { id: 'martes', label: 'M', nombre: 'Martes' },
  { id: 'miercoles', label: 'X', nombre: 'Miércoles' },
  { id: 'jueves', label: 'J', nombre: 'Jueves' },
  { id: 'viernes', label: 'V', nombre: 'Viernes' },
  { id: 'sabado', label: 'S', nombre: 'Sábado' },
  { id: 'domingo', label: 'D', nombre: 'Domingo' },
] as const;

const bloquesComida = [
  { id: 'desayuno', nombre: 'Desayuno', descripcion: 'Inicio energético del día', icono: <ChefHat className="w-4 h-4 text-amber-500" /> },
  { id: 'media-manana', nombre: 'Snack mañana', descripcion: 'Mantén estables tus niveles de energía', icono: <Clock className="w-4 h-4 text-sky-500" /> },
  { id: 'almuerzo', nombre: 'Comida', descripcion: 'Bloque principal del día', icono: <UtensilsCrossed className="w-4 h-4 text-emerald-500" /> },
  { id: 'merienda', nombre: 'Snack tarde', descripcion: 'Recuperación ligera', icono: <Apple className="w-4 h-4 text-rose-500" /> },
  { id: 'cena', nombre: 'Cena', descripcion: 'Cierre ligero y reparador', icono: <Flame className="w-4 h-4 text-indigo-500" /> },
  { id: 'post-entreno', nombre: 'Extra opcional', descripcion: 'Post-entreno o antojo controlado', icono: <TrendingUp className="w-4 h-4 text-purple-500" /> },
];

// Funciones auxiliares para colores e iconos según tipo de comida y objetivo
const getTipoComidaColor = (tipo: TipoComida): string => {
  switch (tipo) {
    case 'desayuno':
      return 'bg-amber-50 border-amber-200 text-amber-900';
    case 'media-manana':
    case 'merienda':
      return 'bg-sky-50 border-sky-200 text-sky-900';
    case 'almuerzo':
      return 'bg-emerald-50 border-emerald-200 text-emerald-900';
    case 'cena':
      return 'bg-indigo-50 border-indigo-200 text-indigo-900';
    case 'post-entreno':
      return 'bg-purple-50 border-purple-200 text-purple-900';
    default:
      return 'bg-slate-50 border-slate-200 text-slate-900';
  }
};

const getTipoComidaIcon = (tipo: TipoComida): React.ReactElement => {
  switch (tipo) {
    case 'desayuno':
      return <Coffee className="w-4 h-4 text-amber-600" />;
    case 'media-manana':
    case 'merienda':
      return <Apple className="w-4 h-4 text-sky-600" />;
    case 'almuerzo':
      return <UtensilsCrossed className="w-4 h-4 text-emerald-600" />;
    case 'cena':
      return <Flame className="w-4 h-4 text-indigo-600" />;
    case 'post-entreno':
      return <TrendingUp className="w-4 h-4 text-purple-600" />;
    default:
      return <ChefHat className="w-4 h-4 text-slate-600" />;
  }
};

const getObjetivoColor = (objetivo: ObjetivoNutricional): string => {
  // Objetivos de déficit (pérdida de peso/grasa)
  if (objetivo === 'perdida-peso' || objetivo === 'perdida-grasa' || objetivo === 'deficit-suave') {
    return 'border-red-300 bg-red-50';
  }
  // Objetivos de hipertrofia (ganancia muscular)
  if (objetivo === 'ganancia-muscular' || objetivo === 'superavit-calorico') {
    return 'border-blue-300 bg-blue-50';
  }
  // Otros objetivos (mantenimiento, rendimiento, salud general)
  return 'border-slate-300 bg-slate-50';
};

const getObjetivoIcon = (objetivo: ObjetivoNutricional): React.ReactElement => {
  // Objetivos de déficit
  if (objetivo === 'perdida-peso' || objetivo === 'perdida-grasa' || objetivo === 'deficit-suave') {
    return <ArrowDown className="w-3 h-3 text-red-600" />;
  }
  // Objetivos de hipertrofia
  if (objetivo === 'ganancia-muscular' || objetivo === 'superavit-calorico') {
    return <ArrowUp className="w-3 h-3 text-blue-600" />;
  }
  // Otros objetivos
  return <Target className="w-3 h-3 text-slate-600" />;
};

const isObjetivoDeficit = (objetivo: ObjetivoNutricional): boolean => {
  return objetivo === 'perdida-peso' || objetivo === 'perdida-grasa' || objetivo === 'deficit-suave';
};

const isObjetivoHipertrofia = (objetivo: ObjetivoNutricional): boolean => {
  return objetivo === 'ganancia-muscular' || objetivo === 'superavit-calorico';
};

type VistaActiva = 'semanal' | 'diaria' | 'excel' | 'timeline';
type BibliotecaTab = 'plantillas' | 'recetas' | 'alimentos' | 'bloques';

const tabsVista = [
  { id: 'semanal', label: 'Vista semanal', icon: <CalendarRange className="h-4 w-4 text-indigo-500" /> },
  { id: 'diaria', label: 'Vista diaria', icon: <CalendarCheck className="h-4 w-4 text-emerald-500" /> },
  { id: 'timeline', label: 'Timeline', icon: <ClockIcon className="h-4 w-4 text-purple-500" /> },
  { id: 'excel', label: 'Vista Excel', icon: <FileSpreadsheet className="h-4 w-4 text-slate-500" /> },
] satisfies TabItem[];

const tabsBiblioteca: TabItem[] = [
  { id: 'plantillas', label: 'Plantillas' },
  { id: 'recetas', label: 'Recetas' },
  { id: 'alimentos', label: 'Alimentos' },
  { id: 'bloques', label: 'Bloques' },
];

const recetasDestacadas = [
  {
    id: 'receta-1',
    nombre: 'Bowl de avena con frutos rojos',
    tiempo: '10 min',
    calorias: 420,
    proteinas: 22,
    carbohidratos: 52,
    grasas: 12,
    tags: ['Alto en proteína', 'Vegetariano'],
  },
  {
    id: 'receta-2',
    nombre: 'Salteado de pollo y quinoa',
    tiempo: '18 min',
    calorias: 520,
    proteinas: 45,
    carbohidratos: 50,
    grasas: 18,
    tags: ['Low-carb', 'Meal-prep'],
  },
  {
    id: 'receta-3',
    nombre: 'Tofu teriyaki con verduras',
    tiempo: '15 min',
    calorias: 390,
    proteinas: 28,
    carbohidratos: 35,
    grasas: 14,
    tags: ['Vegano', 'Sin gluten'],
  },
];

const plantillasDestacadas = [
  {
    id: 'plan-1800',
    nombre: 'Plan 1800 kcal · Definición',
    descripcion: 'Distribución 40/30/30 con énfasis en proteína magra',
    calorias: 1800,
    proteinas: 140,
    carbohidratos: 150,
    grasas: 60,
  },
  {
    id: 'plan-2200',
    nombre: 'Plan 2200 kcal · Volumen limpio',
    descripcion: 'Superávit controlado con 5 ingestas diarias',
    calorias: 2200,
    proteinas: 160,
    carbohidratos: 220,
    grasas: 70,
  },
  {
    id: 'plan-keto',
    nombre: 'Plan keto ciclado',
    descripcion: 'Alterna días bajos y moderados en carbohidratos',
    calorias: 2000,
    proteinas: 140,
    carbohidratos: 50,
    grasas: 140,
  },
];

const bloquesRapidos = [
  { id: 'bloque-1', nombre: 'Desayuno rápido 400 kcal', descripcion: 'Avena + proteína + fruta' },
  { id: 'bloque-2', nombre: 'Comida alta en proteína', descripcion: 'Pollo, quinoa, verduras' },
  { id: 'bloque-3', nombre: 'Cena ligera', descripcion: 'Pescado blanco + ensalada' },
  { id: 'bloque-4', nombre: 'Snack post-entreno', descripcion: 'Batido whey + plátano' },
];

const filtrosDisponibles = [
  { id: 'filtro-kcal', label: 'Rango kcal' },
  { id: 'filtro-proteina', label: 'Proteína mínima' },
  { id: 'filtro-tipo', label: 'Tipo de dieta' },
  { id: 'filtro-restricciones', label: 'Restricciones' },
];

// Recursos de biblioteca de ejemplo (estáticos)
const recursosBibliotecaEstaticos: RecursoBiblioteca[] = [
  // Recetas
  {
    id: 'receta-1',
    tipo: 'receta',
    nombre: 'Bowl de avena con frutos rojos',
    descripcion: 'Desayuno nutritivo con avena, frutos rojos y proteína',
    macros: { calorias: 420, proteinas: 22, carbohidratos: 52, grasas: 12 },
    fibra: 8,
    sodio: 120,
    tiempoPreparacion: 10,
    estiloCulinario: ['vegetariano', 'alto-proteina'],
    tags: ['Alto en proteína', 'Vegetariano', 'Desayuno'],
  },
  {
    id: 'receta-2',
    tipo: 'receta',
    nombre: 'Salteado de pollo y quinoa',
    descripcion: 'Plato completo con pollo, quinoa y verduras',
    macros: { calorias: 520, proteinas: 45, carbohidratos: 50, grasas: 18 },
    fibra: 6,
    sodio: 350,
    tiempoPreparacion: 18,
    estiloCulinario: ['low-carb', 'alto-proteina'],
    tags: ['Low-carb', 'Meal-prep', 'Almuerzo'],
  },
  {
    id: 'receta-3',
    tipo: 'receta',
    nombre: 'Tofu teriyaki con verduras',
    descripcion: 'Plato vegano con tofu y verduras al estilo teriyaki',
    macros: { calorias: 390, proteinas: 28, carbohidratos: 35, grasas: 14 },
    fibra: 5,
    sodio: 280,
    tiempoPreparacion: 15,
    estiloCulinario: ['vegano', 'asiatico'],
    restricciones: ['sin-gluten'],
    tags: ['Vegano', 'Sin gluten', 'Cena'],
  },
  // Plantillas
  {
    id: 'plan-1800',
    tipo: 'plantilla',
    nombre: 'Plan 1800 kcal · Definición',
    descripcion: 'Distribución 40/30/30 con énfasis en proteína magra',
    macros: { calorias: 1800, proteinas: 140, carbohidratos: 150, grasas: 60 },
    fibra: 25,
    sodio: 2000,
    estiloCulinario: ['mediterraneo', 'alto-proteina'],
    tags: ['Definición', '1800 kcal'],
  },
  {
    id: 'plan-2200',
    tipo: 'plantilla',
    nombre: 'Plan 2200 kcal · Volumen limpio',
    descripcion: 'Superávit controlado con 5 ingestas diarias',
    macros: { calorias: 2200, proteinas: 160, carbohidratos: 220, grasas: 70 },
    fibra: 30,
    sodio: 2200,
    estiloCulinario: ['mediterraneo'],
    tags: ['Volumen', '2200 kcal'],
  },
  {
    id: 'plan-keto',
    tipo: 'plantilla',
    nombre: 'Plan keto ciclado',
    descripcion: 'Alterna días bajos y moderados en carbohidratos',
    macros: { calorias: 2000, proteinas: 140, carbohidratos: 50, grasas: 140 },
    fibra: 20,
    sodio: 2500,
    estiloCulinario: ['keto', 'low-carb'],
    tags: ['Keto', 'Low-carb'],
  },
  // Bloques
  {
    id: 'bloque-1',
    tipo: 'bloque',
    nombre: 'Desayuno rápido 400 kcal',
    descripcion: 'Avena + proteína + fruta',
    macros: { calorias: 400, proteinas: 25, carbohidratos: 45, grasas: 12 },
    fibra: 6,
    sodio: 150,
    tiempoPreparacion: 5,
    estiloCulinario: ['alto-proteina'],
    tags: ['Desayuno', 'Rápido'],
  },
  {
    id: 'bloque-2',
    tipo: 'bloque',
    nombre: 'Comida alta en proteína',
    descripcion: 'Pollo, quinoa, verduras',
    macros: { calorias: 480, proteinas: 42, carbohidratos: 48, grasas: 16 },
    fibra: 5,
    sodio: 320,
    tiempoPreparacion: 20,
    estiloCulinario: ['alto-proteina'],
    tags: ['Almuerzo', 'Alto proteína'],
  },
  {
    id: 'bloque-3',
    tipo: 'bloque',
    nombre: 'Cena ligera',
    descripcion: 'Pescado blanco + ensalada',
    macros: { calorias: 320, proteinas: 35, carbohidratos: 20, grasas: 10 },
    fibra: 4,
    sodio: 280,
    tiempoPreparacion: 15,
    estiloCulinario: ['mediterraneo'],
    tags: ['Cena', 'Ligera'],
  },
  {
    id: 'bloque-4',
    tipo: 'bloque',
    nombre: 'Snack post-entreno',
    descripcion: 'Batido whey + plátano',
    macros: { calorias: 280, proteinas: 30, carbohidratos: 35, grasas: 4 },
    fibra: 3,
    sodio: 80,
    tiempoPreparacion: 3,
    estiloCulinario: ['alto-proteina'],
    tags: ['Post-entreno', 'Snack'],
  },
  // Alimentos
  {
    id: 'alimento-1',
    tipo: 'alimento',
    nombre: 'Arándanos',
    descripcion: 'Fruta rica en antioxidantes',
    macros: { calorias: 57, proteinas: 0.7, carbohidratos: 14, grasas: 0.3 },
    fibra: 2.4,
    sodio: 1,
    tags: ['Fruta', 'Antioxidantes'],
  },
  {
    id: 'alimento-2',
    tipo: 'alimento',
    nombre: 'Almendras',
    descripcion: 'Fruto seco rico en proteína y grasas saludables',
    macros: { calorias: 579, proteinas: 21, carbohidratos: 22, grasas: 50 },
    fibra: 12,
    sodio: 1,
    tags: ['Frutos secos', 'Proteína'],
  },
  {
    id: 'alimento-3',
    tipo: 'alimento',
    nombre: 'Proteína whey',
    descripcion: 'Suplemento de proteína en polvo',
    macros: { calorias: 120, proteinas: 25, carbohidratos: 3, grasas: 1 },
    sodio: 50,
    tags: ['Suplemento', 'Proteína'],
  },
  {
    id: 'alimento-4',
    tipo: 'alimento',
    nombre: 'Tofu firme',
    descripcion: 'Proteína vegetal de soja',
    macros: { calorias: 76, proteinas: 8, carbohidratos: 2, grasas: 4 },
    fibra: 0.3,
    sodio: 7,
    estiloCulinario: ['vegano'],
    tags: ['Vegano', 'Proteína'],
  },
  {
    id: 'alimento-5',
    tipo: 'alimento',
    nombre: 'Salmón',
    descripcion: 'Pescado rico en omega-3',
    macros: { calorias: 208, proteinas: 20, carbohidratos: 0, grasas: 12 },
    sodio: 44,
    tags: ['Pescado', 'Omega-3'],
  },
];

export default function DietaEditorPage() {
  const { dietaId } = useParams<{ dietaId: string }>();
  const navigate = useNavigate();
  const [dieta, setDieta] = useState<Dieta | null>(null);
  const [cargando, setCargando] = useState(true);
  const [vistaActiva, setVistaActiva] = useState<VistaActiva>('semanal');
  const [tabBiblioteca, setTabBiblioteca] = useState<BibliotecaTab>('plantillas');
  const [diaSeleccionado, setDiaSeleccionado] = useState<(typeof diasSemana)[number]['id']>('lunes');
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [publicando, setPublicando] = useState(false);
  const [mostrarAIAssistant, setMostrarAIAssistant] = useState(false);
  const [mostrarMenuDuplicar, setMostrarMenuDuplicar] = useState(false);
  const [duplicando, setDuplicando] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const { acciones, togglePin } = useAtajosRapidos(dietaId);
  const [inconsistencias, setInconsistencias] = useState<Inconsistencia[]>([]);
  const [inconsistenciasDismissed, setInconsistenciasDismissed] = useState<Set<string>>(new Set());
  const autosaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const ultimaModificacionRef = useRef<string>('');
  const dietaRef = useRef<Dieta | null>(null);
  const menuDuplicarRef = useRef<HTMLDivElement>(null);
  const [filtrosBiblioteca, setFiltrosBiblioteca] = useState<FiltrosBiblioteca>({});
  const [recursoArrastrado, setRecursoArrastrado] = useState<RecursoBiblioteca | null>(null);
  const [mostrarEditorBloque, setMostrarEditorBloque] = useState(false);
  const [bloqueEditando, setBloqueEditando] = useState<RecursoBiblioteca | null>(null);
  const [bloquesPersonalizados, setBloquesPersonalizados] = useState<RecursoBiblioteca[]>([]);
  const [comidaEditando, setComidaEditando] = useState<string | null>(null);
  const [comidaEditandoData, setComidaEditandoData] = useState<Partial<Comida> | null>(null);
  const [vistaSemanalTipo, setVistaSemanalTipo] = useState<'board' | 'agenda'>('board');
  const [variaciones, setVariaciones] = useState<VariacionAutomatica[]>([]);
  const [mostrarConfigVariaciones, setMostrarConfigVariaciones] = useState(false);
  const [comidaArrastrada, setComidaArrastrada] = useState<{ comida: Comida; diaOrigen: string; tipoComidaOrigen: TipoComida } | null>(null);
  const [comidaSeleccionada, setComidaSeleccionada] = useState<string | null>(null);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<{ dia: string; tipoComida: TipoComida } | null>(null);
  const isTablet = useIsTablet();

  // Colapsar paneles por defecto en tablets
  useEffect(() => {
    if (isTablet) {
      setLeftCollapsed(true);
      setRightCollapsed(true);
    }
  }, [isTablet]);

  useEffect(() => {
    let isMounted = true;
    const cargarDieta = async () => {
      if (!dietaId) return;
      setCargando(true);
      try {
        const data = await getDieta(dietaId);
        if (isMounted) {
          setDieta(data);
          dietaRef.current = data;
          ultimaModificacionRef.current = data?.actualizadoEn || new Date().toISOString();
        }
      } catch (error) {
        console.error('Error cargando dieta', error);
      } finally {
        if (isMounted) {
          setCargando(false);
        }
      }
    };

    cargarDieta();

    return () => {
      isMounted = false;
    };
  }, [dietaId]);

  // Actualizar ref cuando dieta cambia
  useEffect(() => {
    dietaRef.current = dieta;
  }, [dieta]);

  // Cargar bloques personalizados
  useEffect(() => {
    const cargarBloques = async () => {
      try {
        const bloques = await getBloquesPersonalizados();
        setBloquesPersonalizados(bloques);
      } catch (error) {
        console.error('Error cargando bloques personalizados:', error);
      }
    };

    cargarBloques();
  }, []);

  // Combinar recursos estáticos con bloques personalizados
  const recursosBiblioteca = useMemo(() => {
    const recursos = [...recursosBibliotecaEstaticos];
    // Filtrar bloques estáticos y agregar bloques personalizados
    const recursosSinBloques = recursos.filter(r => r.tipo !== 'bloque');
    const bloquesPersonalizadosLista = bloquesPersonalizados;
    return [...recursosSinBloques, ...bloquesPersonalizadosLista];
  }, [bloquesPersonalizados]);

  // Handler para guardar bloque personalizado
  const handleGuardarBloque = useCallback(async (bloque: RecursoBiblioteca) => {
    try {
      // Recargar bloques personalizados
      const bloques = await getBloquesPersonalizados();
      setBloquesPersonalizados(bloques);
      setMostrarEditorBloque(false);
      setBloqueEditando(null);
    } catch (error) {
      console.error('Error guardando bloque:', error);
    }
  }, []);

  // Autosave automático cada 30 segundos
  useEffect(() => {
    if (!dietaId) return;

    // Iniciar autosave automático
    autosaveIntervalRef.current = setInterval(async () => {
      const dietaActual = dietaRef.current;
      if (!dietaActual) return;

      try {
        const ahora = new Date().toISOString();
        await guardarComoBorrador(dietaId, {
          ...dietaActual,
          ultimoAutosave: ahora,
        });
        // Actualizar estado solo si la dieta sigue siendo la misma
        setDieta(prev => {
          if (prev && prev.id === dietaActual.id) {
            return {
              ...prev,
              ultimoAutosave: ahora,
              estadoPublicacion: prev.estadoPublicacion || 'borrador',
            };
          }
          return prev;
        });
      } catch (error) {
        console.error('Error en autosave:', error);
      }
    }, 30000); // 30 segundos

    return () => {
      if (autosaveIntervalRef.current) {
        clearInterval(autosaveIntervalRef.current);
      }
    };
  }, [dietaId]);

  // Función para guardar como borrador
  const handleGuardarBorrador = useCallback(async () => {
    if (!dieta || !dietaId) return;
    
    setGuardando(true);
    try {
      const ahora = new Date().toISOString();
      const dietaAnterior = dietaRef.current;
      const exito = await guardarComoBorrador(dietaId, {
        ...dieta,
        ultimoAutosave: ahora,
      });
      
      if (exito) {
        const dietaActualizada = {
          ...dieta,
          estadoPublicacion: 'borrador' as const,
          ultimoAutosave: ahora,
          actualizadoEn: ahora,
        };
        
        // Registrar cambio en historial
        if (dietaAnterior) {
          const cambios: any[] = [];
          if (JSON.stringify(dietaAnterior.macros) !== JSON.stringify(dieta.macros)) {
            cambios.push({
              campo: 'macros',
              valorAnterior: dietaAnterior.macros,
              valorNuevo: dieta.macros,
            });
          }
          if (JSON.stringify(dietaAnterior.comidas) !== JSON.stringify(dieta.comidas)) {
            cambios.push({
              campo: 'comidas',
              descripcion: `${dieta.comidas.length} comidas`,
            });
          }
          
          if (cambios.length > 0) {
            registrarCambioDieta(
              dietaId,
              'guardado_borrador',
              'Guardado como borrador',
              cambios,
              dietaActualizada
            );
          }
        }
        
        setDieta(dietaActualizada);
        dietaRef.current = dietaActualizada;
        ultimaModificacionRef.current = ahora;
      }
    } catch (error) {
      console.error('Error guardando borrador:', error);
    } finally {
      setGuardando(false);
    }
  }, [dieta, dietaId]);

  // Función para publicar
  const handlePublicar = useCallback(async () => {
    if (!dieta || !dietaId) return;
    
    setPublicando(true);
    try {
      const ahora = new Date().toISOString();
      const dietaAnterior = dietaRef.current;
      const exito = await publicarDieta(dietaId, {
        ...dieta,
        publicadoEn: ahora,
        ultimoAutosave: ahora,
      });
      
      if (exito) {
        const dietaActualizada = {
          ...dieta,
          estadoPublicacion: 'publicado' as const,
          publicadoEn: ahora,
          ultimoAutosave: ahora,
          actualizadoEn: ahora,
        };
        
        // Registrar cambio en historial
        registrarCambioDieta(
          dietaId,
          'publicacion',
          'Dieta publicada',
          [{ campo: 'estadoPublicacion', valorAnterior: dietaAnterior?.estadoPublicacion, valorNuevo: 'publicado' }],
          dietaActualizada
        );
        
        setDieta(dietaActualizada);
        dietaRef.current = dietaActualizada;
        ultimaModificacionRef.current = ahora;
      }
    } catch (error) {
      console.error('Error publicando dieta:', error);
    } finally {
      setPublicando(false);
    }
  }, [dieta, dietaId]);

  // Función para aplicar sugerencia de IA
  const handleAplicarSugerencia = useCallback((sugerencia: any) => {
    // Aquí se implementaría la lógica para aplicar la sugerencia
    console.log('Aplicar sugerencia:', sugerencia);
    // Por ejemplo, ajustar macros, añadir comidas, etc.
  }, []);

  // Función para duplicar dieta con variación
  const handleDuplicarDieta = useCallback(async (variacion?: VariacionDieta) => {
    if (!dieta || !dietaId) return;
    
    setDuplicando(true);
    setMostrarMenuDuplicar(false);
    try {
      const nuevaDieta = await duplicarDieta(dietaId, variacion);
      if (nuevaDieta) {
        // Navegar a la nueva dieta duplicada
        navigate(`/dietas-asignadas/editor/${nuevaDieta.id}`);
      }
    } catch (error) {
      console.error('Error duplicando dieta:', error);
      alert('Error al duplicar la dieta. Por favor, intenta de nuevo.');
    } finally {
      setDuplicando(false);
    }
  }, [dieta, dietaId, navigate]);

  // Función para manejar acciones rápidas
  const handleAccionRapida = useCallback(async (accionId: TipoAccionRapida) => {
    if (!dieta || !dietaId) return;

    switch (accionId) {
      case 'duplicar_semana':
        // Duplicar la semana actual
        if (confirm('¿Duplicar la semana actual a la siguiente semana?')) {
          // Aquí implementarías la lógica de duplicación de semana
          alert('Funcionalidad de duplicar semana en desarrollo');
          registrarCambioDieta(
            dietaId,
            'duplicacion_semana',
            'Semana duplicada',
            [{ campo: 'semana', descripcion: 'Semana duplicada' }],
            dieta
          );
        }
        break;

      case 'generar_lista_compra':
        // Generar lista de compra
        alert('Generando lista de compra...');
        // Aquí implementarías la lógica de generación de lista
        break;

      case 'equilibrar_macros_ia':
        // Equilibrar macros con IA
        setMostrarAIAssistant(true);
        break;

      case 'variar_recetas':
        // Variar recetas
        alert('Funcionalidad de variar recetas en desarrollo');
        break;

      case 'exportar_excel':
        // Exportar a Excel
        alert('Exportando a Excel...');
        break;

      case 'optimizar_semana_ia':
        // Optimizar semana con IA
        setMostrarAIAssistant(true);
        break;

      default:
        break;
    }
  }, [dieta, dietaId, setMostrarAIAssistant]);

  // Función para revertir desde historial
  const handleRevertirCambio = useCallback((dietaRestaurada: Dieta) => {
    setDieta(dietaRestaurada);
    dietaRef.current = dietaRestaurada;
    ultimaModificacionRef.current = dietaRestaurada.actualizadoEn;
  }, []);

  // Funciones para drag and drop
  const handleRecursoDragStart = useCallback((recurso: RecursoBiblioteca, event: React.DragEvent) => {
    setRecursoArrastrado(recurso);
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.classList.add('bg-blue-50', 'border-blue-300');
    }
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.classList.remove('bg-blue-50', 'border-blue-300');
    }
  }, []);

  const handleDrop = useCallback(
    async (event: React.DragEvent, tipoComida: TipoComida, dia?: string) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.currentTarget instanceof HTMLElement) {
        event.currentTarget.classList.remove('bg-blue-50', 'border-blue-300');
      }

      try {
        // Intentar obtener los datos del drag
        let dragData: DragData | null = null;
        try {
          const dataStr = event.dataTransfer.getData('application/json');
          if (dataStr) {
            dragData = JSON.parse(dataStr);
          }
        } catch (e) {
          console.error('Error parsing drag data:', e);
        }

        // Si no hay datos, intentar con el recurso arrastrado del estado
        const recurso = dragData?.recurso || recursoArrastrado;
        if (!recurso || !dieta) {
          return;
        }

        // Convertir recurso a comida
        const nuevaComida: Comida = {
          id: `comida-${Date.now()}`,
          nombre: recurso.nombre,
          tipo: tipoComida,
          alimentos: recurso.alimentos || [],
          calorias: recurso.macros.calorias,
          proteinas: recurso.macros.proteinas,
          carbohidratos: recurso.macros.carbohidratos,
          grasas: recurso.macros.grasas,
          notas: recurso.descripcion,
          horario: undefined,
        };

        // Actualizar la dieta con la nueva comida
        const comidasActualizadas = [...dieta.comidas, nuevaComida];
        const dietaActualizada: Dieta = {
          ...dieta,
          comidas: comidasActualizadas,
          actualizadoEn: new Date().toISOString(),
        };

        setDieta(dietaActualizada);
        dietaRef.current = dietaActualizada;

        // Registrar cambio en historial
        if (dietaId) {
          registrarCambioDieta(
            dietaId,
            'actualizacion_comidas',
            `Añadida ${recurso.nombre} a ${tipoComida}${dia ? ` (${dia})` : ''}`,
            [
              {
                campo: 'comidas',
                descripcion: `Nueva comida: ${recurso.nombre}`,
              },
            ],
            dietaActualizada
          );
        }

        // Limpiar estado de arrastre
        setRecursoArrastrado(null);
      } catch (error) {
        console.error('Error al agregar recurso:', error);
      }
    },
    [dieta, dietaId, recursoArrastrado]
  );

  const handleDragEnd = useCallback(() => {
    setRecursoArrastrado(null);
  }, []);
  // Funciones para drag and drop de comidas entre días
  const handleComidaDragStart = useCallback((comida: Comida, diaOrigen: string, tipoComidaOrigen: TipoComida, event: React.DragEvent) => {
    setComidaArrastrada({ comida, diaOrigen, tipoComidaOrigen });
    event.dataTransfer.setData('application/json', JSON.stringify({ tipo: 'comida', comidaId: comida.id }));
    event.dataTransfer.effectAllowed = 'move';
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.style.opacity = '0.5';
    }
  }, []);

  const handleComidaDragEnd = useCallback((event: React.DragEvent) => {
    setComidaArrastrada(null);
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.style.opacity = '1';
    }
  }, []);

  const handleComidaDrop = useCallback(
    async (event: React.DragEvent, tipoComidaDestino: TipoComida, diaDestino: string) => {
      event.preventDefault();
      event.stopPropagation();

      if (!comidaArrastrada || !dieta || !dietaId) return;

      // Si es el mismo día y tipo, no hacer nada
      if (comidaArrastrada.diaOrigen === diaDestino && comidaArrastrada.tipoComidaOrigen === tipoComidaDestino) {
        setComidaArrastrada(null);
        return;
      }

      try {
        // Crear una copia de la comida para el nuevo día/tipo
        const nuevaComida: Comida = {
          ...comidaArrastrada.comida,
          id: `comida-${Date.now()}`,
          tipo: tipoComidaDestino,
          dia: diaDestino,
        };

        // Agregar la nueva comida
        const comidasActualizadas = [...dieta.comidas, nuevaComida];
        const dietaActualizada: Dieta = {
          ...dieta,
          comidas: comidasActualizadas,
          actualizadoEn: new Date().toISOString(),
        };

        setDieta(dietaActualizada);
        dietaRef.current = dietaActualizada;

        // Guardar cambios
        await guardarComoBorrador(dietaId, dietaActualizada);

        // Registrar cambio en historial
        registrarCambioDieta(
          dietaId,
          'actualizacion_comidas',
          `Comida duplicada: ${comidaArrastrada.comida.nombre} a ${diaDestino}`,
          [
            {
              campo: 'comidas',
              descripcion: `Comida duplicada de ${comidaArrastrada.diaOrigen} a ${diaDestino}`,
            },
          ],
          dietaActualizada
        );

        setComidaArrastrada(null);
      } catch (error) {
        console.error('Error al duplicar comida:', error);
      }
    },
    [comidaArrastrada, dieta, dietaId]
  );

  // Función para duplicar comida con atajo de teclado
  const handleDuplicarComida = useCallback(
    async (comidaId: string, diaDestino?: string, tipoComidaDestino?: TipoComida) => {
      if (!dieta || !dietaId) return;

      const comida = dieta.comidas.find((c) => c.id === comidaId);
      if (!comida) return;

      const dia = diaDestino || comida.dia || 'lunes';
      const tipo = tipoComidaDestino || comida.tipo;

      const nuevaComida: Comida = {
        ...comida,
        id: `comida-${Date.now()}`,
        tipo,
        dia,
      };

      const comidasActualizadas = [...dieta.comidas, nuevaComida];
      const dietaActualizada: Dieta = {
        ...dieta,
        comidas: comidasActualizadas,
        actualizadoEn: new Date().toISOString(),
      };

      setDieta(dietaActualizada);
      dietaRef.current = dietaActualizada;

      try {
        await guardarComoBorrador(dietaId, dietaActualizada);
        registrarCambioDieta(
          dietaId,
          'actualizacion_comidas',
          `Comida duplicada: ${comida.nombre}`,
          [{ campo: 'comidas', descripcion: `Comida duplicada` }],
          dietaActualizada
        );
      } catch (error) {
        console.error('Error al duplicar comida:', error);
      }
    },
    [dieta, dietaId]
  );

  // Función para duplicar bloque completo
  const handleDuplicarBloque = useCallback(
    async (diaOrigen: string, tipoComida: TipoComida, diaDestino?: string) => {
      if (!dieta || !dietaId) return;

      const dia = diaDestino || diaSeleccionado;
      const comidasDelBloque = dieta.comidas.filter(
        (c) => c.dia === diaOrigen && c.tipo === tipoComida
      );

      if (comidasDelBloque.length === 0) return;

      const nuevasComidas = comidasDelBloque.map((comida) => ({
        ...comida,
        id: `comida-${Date.now()}-${Math.random()}`,
        dia,
      }));

      const comidasActualizadas = [...dieta.comidas, ...nuevasComidas];
      const dietaActualizada: Dieta = {
        ...dieta,
        comidas: comidasActualizadas,
        actualizadoEn: new Date().toISOString(),
      };

      setDieta(dietaActualizada);
      dietaRef.current = dietaActualizada;

      try {
        await guardarComoBorrador(dietaId, dietaActualizada);
        registrarCambioDieta(
          dietaId,
          'actualizacion_comidas',
          `Bloque ${tipoComida} duplicado de ${diaOrigen} a ${dia}`,
          [{ campo: 'comidas', descripcion: `Bloque duplicado` }],
          dietaActualizada
        );
      } catch (error) {
        console.error('Error al duplicar bloque:', error);
      }
    },
    [dieta, dietaId, diaSeleccionado]
  );

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Solo activar si no estamos escribiendo en un input o textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target instanceof HTMLElement && event.target.isContentEditable)
      ) {
        return;
      }

      // Ctrl/Cmd + K: Abrir panel IA
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setMostrarAIAssistant(true);
        return;
      }

      // Flechas izquierda/derecha: Cambiar de día (solo en vista diaria o semanal)
      if (vistaActiva === 'diaria' || vistaActiva === 'semanal') {
        if (event.key === 'ArrowLeft' && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
          event.preventDefault();
          irAlDia(-1);
          return;
        }
        if (event.key === 'ArrowRight' && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
          event.preventDefault();
          irAlDia(1);
          return;
        }
      }

      // Ctrl/Cmd + D: Duplicar
      if ((event.ctrlKey || event.metaKey) && event.key === 'd' && !event.shiftKey) {
        event.preventDefault();
        // Si hay una comida seleccionada, duplicarla
        if (comidaSeleccionada) {
          handleDuplicarComida(comidaSeleccionada);
          return;
        }
        // Si hay un bloque seleccionado, duplicarlo
        if (bloqueSeleccionado) {
          handleDuplicarBloque(bloqueSeleccionado.dia, bloqueSeleccionado.tipoComida);
          return;
        }
        // Si estamos en vista diaria, duplicar el día completo
        if (vistaActiva === 'diaria' && dieta) {
          const comidasDelDia = dieta.comidas.filter((c) => c.dia === diaSeleccionado);
          if (comidasDelDia.length > 0) {
            // Encontrar el siguiente día
            const diaActualIndex = diasSemana.findIndex((d) => d.id === diaSeleccionado);
            const siguienteDiaIndex = (diaActualIndex + 1) % diasSemana.length;
            const siguienteDia = diasSemana[siguienteDiaIndex].id;
            
            // Duplicar todas las comidas del día
            const nuevasComidas = comidasDelDia.map((comida) => ({
              ...comida,
              id: `comida-${Date.now()}-${Math.random()}`,
              dia: siguienteDia,
            }));

            const comidasActualizadas = [...dieta.comidas, ...nuevasComidas];
            const dietaActualizada: Dieta = {
              ...dieta,
              comidas: comidasActualizadas,
              actualizadoEn: new Date().toISOString(),
            };

            setDieta(dietaActualizada);
            dietaRef.current = dietaActualizada;

            guardarComoBorrador(dietaId!, dietaActualizada).catch((error) => {
              console.error('Error al duplicar día:', error);
            });
          }
        }
        return;
      }

      // Escape: Deseleccionar
      if (event.key === 'Escape') {
        setComidaSeleccionada(null);
        setBloqueSeleccionado(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [comidaSeleccionada, bloqueSeleccionado, handleDuplicarComida, handleDuplicarBloque, vistaActiva, diaSeleccionado, dieta, dietaId]);


  // Función para descartar inconsistencias
  const handleDismissInconsistencia = useCallback((inconsistenciaId: string) => {
    setInconsistenciasDismissed((prev) => new Set([...prev, inconsistenciaId]));
    setInconsistencias((prev) => prev.filter((inc) => inc.id !== inconsistenciaId));
  }, []);

  // Cerrar menú de duplicar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuDuplicarRef.current && !menuDuplicarRef.current.contains(event.target as Node)) {
        setMostrarMenuDuplicar(false);
      }
    };

    if (mostrarMenuDuplicar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mostrarMenuDuplicar]);

  const metricasCabecera: MetricCardData[] = useMemo(() => {
    if (!dieta) return [];
    return [
      {
        id: 'calorias',
        title: 'Objetivo diario kcal',
        value: `${dieta.macros.calorias} kcal`,
        icon: <Flame size={24} />,
        color: 'primary',
      },
      {
        id: 'proteinas',
        title: 'Proteínas objetivo',
        value: `${dieta.macros.proteinas} g`,
        icon: <Target size={24} />,
        color: 'success',
      },
      {
        id: 'carbohidratos',
        title: 'Carbohidratos objetivo',
        value: `${dieta.macros.carbohidratos} g`,
        icon: <Apple size={24} />,
        color: 'info',
      },
      {
        id: 'grasas',
        title: 'Grasas objetivo',
        value: `${dieta.macros.grasas} g`,
        icon: <Droplets size={24} />,
        color: 'warning',
      },
    ];
  }, [dieta]);

  const comidasPorTipo = useMemo(() => {
    const resultado: Record<string, Comida[]> = {};
    if (!dieta?.comidas) return resultado;
    dieta.comidas.forEach((comida) => {
      if (!resultado[comida.tipo]) {
        resultado[comida.tipo] = [];
      }
      resultado[comida.tipo].push(comida);
    });
    return resultado;
  }, [dieta]);

  // Handler para actualizar una comida
  const handleActualizarComida = useCallback(async (comidaId: string, datosActualizados: Partial<Comida>) => {
    if (!dieta || !dietaId) return;

    const comidasActualizadas = dieta.comidas.map((comida) => {
      if (comida.id === comidaId) {
        return { ...comida, ...datosActualizados };
      }
      return comida;
    });

    const dietaActualizada: Dieta = {
      ...dieta,
      comidas: comidasActualizadas,
      actualizadoEn: new Date().toISOString(),
    };

    setDieta(dietaActualizada);
    dietaRef.current = dietaActualizada;

    // Guardar cambios
    try {
      await guardarComoBorrador(dietaId, dietaActualizada);
      
      // Registrar cambio en historial
      registrarCambioDieta(
        dietaId,
        'actualizacion_comidas',
        `Actualizada comida: ${datosActualizados.nombre || comidaId}`,
        [
          {
            campo: 'comida',
            descripcion: `Comida actualizada: ${comidaId}`,
          },
        ],
        dietaActualizada
      );
    } catch (error) {
      console.error('Error actualizando comida:', error);
    }

    setComidaEditando(null);
    setComidaEditandoData(null);
  }, [dieta, dietaId]);

  // Handler para iniciar edición inline
  const handleIniciarEdicion = useCallback((comida: Comida) => {
    setComidaEditando(comida.id);
    setComidaEditandoData({
      calorias: comida.calorias,
      proteinas: comida.proteinas,
      carbohidratos: comida.carbohidratos,
      grasas: comida.grasas,
      notas: comida.notas || '',
    });
  }, []);

  // Handler para cancelar edición
  const handleCancelarEdicion = useCallback(() => {
    setComidaEditando(null);
    setComidaEditandoData(null);
  }, []);

  // Handler para guardar edición
  const handleGuardarEdicion = useCallback(() => {
    if (!comidaEditando || !comidaEditandoData) return;
    handleActualizarComida(comidaEditando, comidaEditandoData);
  }, [comidaEditando, comidaEditandoData, handleActualizarComida]);

  const renderBiblioteca = () => {
    switch (tabBiblioteca) {
      case 'plantillas':
        return (
          <div className="space-y-4">
            {plantillasDestacadas.map((plantilla) => (
              <Card key={plantilla.id} className="bg-white/80 border border-slate-200 shadow-sm">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{plantilla.nombre}</h4>
                      <p className="text-xs text-slate-500">{plantilla.descripcion}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-sm" onClick={() => console.log('Aplicar plantilla', plantilla.id)}>
                      Aplicar
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs text-slate-600">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-500 uppercase tracking-wide text-[10px]">Kcal</span>
                      <span>{plantilla.calorias}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-500 uppercase tracking-wide text-[10px]">P</span>
                      <span>{plantilla.proteinas} g</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-500 uppercase tracking-wide text-[10px]">H</span>
                      <span>{plantilla.carbohidratos} g</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-500 uppercase tracking-wide text-[10px]">G</span>
                      <span>{plantilla.grasas} g</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );
      case 'recetas':
        return (
          <div className="space-y-4">
            {recetasDestacadas.map((receta) => (
              <Card key={receta.id} className="bg-white/80 border border-slate-200 hover:border-blue-300 shadow-sm transition-all">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{receta.nombre}</h4>
                      <p className="text-xs text-slate-500">Tiempo: {receta.tiempo}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-sm" onClick={() => console.log('Añadir receta', receta.id)}>
                      Añadir
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs text-slate-600">
                    <div>Kcal: <span className="font-semibold text-slate-900">{receta.calorias}</span></div>
                    <div>P: <span className="font-semibold text-slate-900">{receta.proteinas}g</span></div>
                    <div>H: <span className="font-semibold text-slate-900">{receta.carbohidratos}g</span></div>
                    <div>G: <span className="font-semibold text-slate-900">{receta.grasas}g</span></div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {receta.tags.map((tag) => (
                      <Badge key={tag} className="bg-blue-50 text-blue-600 text-[11px] py-1 px-2 rounded-full">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );
      case 'alimentos':
        return (
          <div className="space-y-3">
            {['Arándanos', 'Almendras', 'Proteína whey', 'Tofu firme', 'Tempeh', 'Salmón'].map((alimento) => (
              <Card key={alimento} className="bg-white/80 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-sm text-slate-700">
                  <span>{alimento}</span>
                  <Button variant="ghost" size="sm" onClick={() => console.log('Añadir alimento', alimento)}>
                    Añadir
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        );
      case 'bloques':
        return (
          <div className="space-y-3">
            {bloquesRapidos.map((bloque) => (
              <Card key={bloque.id} className="bg-white/80 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{bloque.nombre}</h4>
                    <p className="text-xs text-slate-500">{bloque.descripcion}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => console.log('Usar bloque', bloque.id)}>
                    Usar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const renderBloqueComida = (tipoComida: TipoComida, objetivo?: ObjetivoNutricional, dia?: string, handleDrop?: (event: React.DragEvent, tipoComida: TipoComida, dia?: string) => void) => {
    // Usar comidasPorDiaYTipo si hay día (vista semanal), sino comidasPorTipo (vista diaria)
    const comidas = dia && vistaActiva === 'semanal' && comidasPorDiaYTipo[dia]?.[tipoComida] 
      ? comidasPorDiaYTipo[dia][tipoComida] 
      : comidasPorTipo[tipoComida] || [];
    const objetivoActual = objetivo || dieta?.objetivo || 'mantenimiento';
    const tipoComidaColor = getTipoComidaColor(tipoComida);
    const tipoComidaIcon = getTipoComidaIcon(tipoComida);
    const objetivoColor = getObjetivoColor(objetivoActual);
    const objetivoIcon = getObjetivoIcon(objetivoActual);

    if (comidas.length === 0) {
      return (
        <div 
          className="border border-dashed border-slate-300 rounded-lg bg-white/40 text-center py-6"
          onDragOver={handleDrop ? (e) => {
            e.preventDefault();
            e.currentTarget.classList.add('bg-blue-50', 'border-blue-300');
          } : undefined}
          onDragLeave={handleDrop ? (e) => {
            e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300');
          } : undefined}
          onDrop={handleDrop ? (e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300');
            handleDrop(e, tipoComida, dia);
          } : undefined}
        >
          <p className="text-sm text-slate-500">Arrastra recetas o bloques aquí</p>
          <p className="text-xs text-slate-400 mt-1">Mantén las macros dentro del objetivo</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {comidas.map((comida) => {
          const isEditando = comidaEditando === comida.id;
          const datosEdicion = isEditando && comidaEditandoData ? comidaEditandoData : comida;
          
          return (
            <Card 
              key={comida.id} 
              className={`border-2 shadow-sm transition-all cursor-pointer draggable={!isEditando} onDragStart={!isEditando && dia ? (e) => handleComidaDragStart(comida, dia, tipoComida, e) : undefined} onDragEnd={handleComidaDragEnd} onClick={() => !isEditando && setComidaSeleccionada(comida.id)} ${
                isEditando 
                  ? 'border-blue-400 bg-blue-50' 
                  : `${tipoComidaColor} ${objetivoColor}`
              }`}
            >
              <div 
                onDoubleClick={() => !isEditando && handleIniciarEdicion(comida)}
              >
              <div className="flex flex-col gap-3">
                {/* Header con iconos de tipo y objetivo */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <div className={`p-1.5 rounded-lg ${tipoComidaColor.split(' ')[0]}`}>
                      {tipoComidaIcon}
                    </div>
                    <div className="flex-1">
                      {isEditando ? (
                        <input
                          type="text"
                          value={datosEdicion.nombre || comida.nombre}
                          onChange={(e) => setComidaEditandoData({ ...datosEdicion, nombre: e.target.value })}
                          className="text-sm font-semibold bg-white border border-blue-300 rounded px-2 py-1 w-full"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleGuardarEdicion();
                            } else if (e.key === 'Escape') {
                              handleCancelarEdicion();
                            }
                          }}
                        />
                      ) : (
                        <h4 className="text-sm font-semibold text-slate-900">{comida.nombre}</h4>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        {isEditando ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <input
                              type="number"
                              value={datosEdicion.calorias || 0}
                              onChange={(e) => setComidaEditandoData({ ...datosEdicion, calorias: parseFloat(e.target.value) || 0 })}
                              className="text-xs bg-white border border-blue-300 rounded px-2 py-1 w-20"
                              placeholder="kcal"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleGuardarEdicion();
                                } else if (e.key === 'Escape') {
                                  handleCancelarEdicion();
                                }
                              }}
                            />
                            <span className="text-xs text-slate-500">kcal</span>
                            <input
                              type="number"
                              value={datosEdicion.proteinas || 0}
                              onChange={(e) => setComidaEditandoData({ ...datosEdicion, proteinas: parseFloat(e.target.value) || 0 })}
                              className="text-xs bg-white border border-blue-300 rounded px-2 py-1 w-16"
                              placeholder="P"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleGuardarEdicion();
                                } else if (e.key === 'Escape') {
                                  handleCancelarEdicion();
                                }
                              }}
                            />
                            <span className="text-xs text-slate-500">P</span>
                            <input
                              type="number"
                              value={datosEdicion.carbohidratos || 0}
                              onChange={(e) => setComidaEditandoData({ ...datosEdicion, carbohidratos: parseFloat(e.target.value) || 0 })}
                              className="text-xs bg-white border border-blue-300 rounded px-2 py-1 w-16"
                              placeholder="H"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleGuardarEdicion();
                                } else if (e.key === 'Escape') {
                                  handleCancelarEdicion();
                                }
                              }}
                            />
                            <span className="text-xs text-slate-500">H</span>
                            <input
                              type="number"
                              value={datosEdicion.grasas || 0}
                              onChange={(e) => setComidaEditandoData({ ...datosEdicion, grasas: parseFloat(e.target.value) || 0 })}
                              className="text-xs bg-white border border-blue-300 rounded px-2 py-1 w-16"
                              placeholder="G"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleGuardarEdicion();
                                } else if (e.key === 'Escape') {
                                  handleCancelarEdicion();
                                }
                              }}
                            />
                            <span className="text-xs text-slate-500">G</span>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500">
                            {comida.horario ? `${comida.horario} · ` : ''}
                            {comida.calorias} kcal · P {comida.proteinas}g · H {comida.carbohidratos}g · G {comida.grasas}g
                          </p>
                        )}
                      </div>
                      {/* Notas */}
                      {isEditando ? (
                        <textarea
                          value={datosEdicion.notas || ''}
                          onChange={(e) => setComidaEditandoData({ ...datosEdicion, notas: e.target.value })}
                          className="text-xs bg-white border border-blue-300 rounded px-2 py-1 w-full mt-2"
                          placeholder="Notas..."
                          rows={2}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey) {
                              handleGuardarEdicion();
                            } else if (e.key === 'Escape') {
                              handleCancelarEdicion();
                            }
                          }}
                        />
                      ) : comida.notas ? (
                        <p className="text-xs text-slate-400 mt-1 italic">{comida.notas}</p>
                      ) : null}
                    </div>
                    {/* Icono de objetivo */}
                    <div className={`p-1.5 rounded-lg ${objetivoColor.split(' ')[0]}`} title={
                      isObjetivoDeficit(objetivoActual) ? 'Déficit calórico' :
                      isObjetivoHipertrofia(objetivoActual) ? 'Hipertrofia' :
                      'Otro objetivo'
                    }>
                      {objetivoIcon}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditando ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex h-8 w-8 items-center justify-center rounded-full p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={handleGuardarEdicion}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Guardar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex h-8 w-8 items-center justify-center rounded-full p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={handleCancelarEdicion}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Cancelar</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex h-8 w-8 items-center justify-center rounded-full p-0"
                          onClick={() => handleIniciarEdicion(comida)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar comida</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex h-8 w-8 items-center justify-center rounded-full p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicarComida(comida.id, dia);
                          }}
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Duplicar comida</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                {/* Footer con información adicional */}
                {!isEditando && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>IA Sugerida · Alta adherencia</span>
                  </div>
                )}
                {isEditando && (
                  <div className="flex items-center gap-2 text-xs text-blue-600">
                    <span>Presiona Enter para guardar, Esc para cancelar</span>
                  </div>
                )}
                {/* Sustitutos sugeridos */}
                {!isEditando && comida.sustitutos && comida.sustitutos.length > 0 && (
                  <SustitutosComida
                    sustitutos={comida.sustitutos}
                    modoEdicion={false}
                    soloLectura={true}
                  />
                )}
                {isEditando && (
                  <SustitutosComida
                    sustitutos={comida.sustitutos || []}
                    onSustitutosChange={(sustitutos) => {
                      setComidaEditandoData({ ...datosEdicion, sustitutos });
                    }}
                    modoEdicion={true}
                    soloLectura={false}
                  />
                )}
              </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  const diaActualIndex = diasSemana.findIndex((dia) => dia.id === diaSeleccionado);

  const irAlDia = (direccion: -1 | 1) => {
    const nextIndex = (diaActualIndex + direccion + diasSemana.length) % diasSemana.length;
    setDiaSeleccionado(diasSemana[nextIndex].id);
  };

  // Calcular número de semana desde fechaInicio
  const calcularSemana = (): number => {
    if (!dieta?.fechaInicio) return 1;
    const fechaInicio = new Date(dieta.fechaInicio);
    const hoy = new Date();
    const diffTime = Math.abs(hoy.getTime() - fechaInicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7) + 1;
  };

  const semanaActual = calcularSemana();

  // Función para obtener el label del estado
  const getEstadoLabel = (estado: string): string => {
    switch (estado) {
      case 'activa':
        return 'Activa';
      case 'pausada':
        return 'Pausada';
      case 'finalizada':
        return 'Finalizada';
      default:
        return estado;
    }
  };

  // Función para obtener el color del estado
  const getEstadoColor = (estado: string): string => {
    switch (estado) {
      case 'activa':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pausada':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'finalizada':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderVistaSemanal = () => {
    // Si la vista es agenda, renderizar componente VistaAgenda
    if (vistaSemanalTipo === 'agenda' && dieta) {
      return (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Semana 1 · {dieta?.objetivo ? dieta.objetivo.replace('-', ' ') : 'Objetivo personalizado'} · {dieta?.macros.calorias} kcal</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={vistaSemanalTipo === 'board' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setVistaSemanalTipo('board')}
                leftIcon={<LayoutGrid className="w-4 h-4" />}
                title="Vista tablero (7 columnas)"
              >
                Tablero
              </Button>
              <Button
                variant={vistaSemanalTipo === 'agenda' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setVistaSemanalTipo('agenda')}
                leftIcon={<List className="w-4 h-4" />}
                title="Vista agenda expandible"
              >
                Agenda
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<Copy className="w-4 h-4" />}>
                Copiar día
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<RefreshCcw className="w-4 h-4" />}>
                Equilibrar macros con IA
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<Shuffle className="w-4 h-4" />}>
                Variar recetas
              </Button>
            </div>
          </div>
          <VistaAgenda
            dieta={dieta}
            onComidaClick={(comida) => {
              console.log('Comida clickeada:', comida);
            }}
            onComidaEdit={(comida) => {
              console.log('Editar comida:', comida);
            }}
            onComidaDuplicate={(comida) => {
              console.log('Duplicar comida:', comida);
            }}
          />
        </div>
      );
    }

    // Vista board (7 columnas) - por defecto
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Semana 1 · {dieta?.objetivo ? dieta.objetivo.replace('-', ' ') : 'Objetivo personalizado'} · {dieta?.macros.calorias} kcal</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={vistaSemanalTipo === 'board' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setVistaSemanalTipo('board')}
              leftIcon={<LayoutGrid className="w-4 h-4" />}
              title="Vista tablero (7 columnas)"
            >
              Tablero
            </Button>
            <Button
              variant={vistaSemanalTipo === 'agenda' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setVistaSemanalTipo('agenda')}
              leftIcon={<List className="w-4 h-4" />}
              title="Vista agenda expandible"
            >
              Agenda
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Copy className="w-4 h-4" />}>
              Copiar día
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<RefreshCcw className="w-4 h-4" />}>
              Equilibrar macros con IA
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Shuffle className="w-4 h-4" />}>
              Variar recetas
            </Button>
          </div>
        </div>

      <div className={`grid gap-4 ${isTablet ? 'grid-cols-1 md:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7'} overflow-x-auto pb-4`}>
        <div className={`flex gap-4 ${isTablet ? 'flex-col md:flex-row' : '2xl:min-w-full'} w-max`}>
        {diasSemana.map((dia) => (
          <div key={dia.id} className={`rounded-3xl bg-gradient-to-br from-white via-white to-blue-50 border border-slate-200 shadow-sm p-4 space-y-4 ${isTablet ? 'w-full md:min-w-[280px]' : 'min-w-[260px]'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">{dia.label}</Badge>
                  <h3 className="text-sm font-semibold text-slate-900">{dia.nombre}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">Objetivo: {dieta?.macros.calorias ?? 0} kcal</p>
              </div>
              <span className="text-xs text-emerald-600 font-semibold">2100/2200 kcal</span>
            </div>

            <div className="space-y-3">
              {bloquesComida.map((bloque) => (
                <div key={bloque.id} className="rounded-2xl bg-white/70 border border-slate-200 shadow-xs p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        {bloque.icono}
                        <h4 className="text-sm font-semibold text-slate-900">{bloque.nombre}</h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{bloque.descripcion}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex h-8 w-8 items-center justify-center rounded-full p-0"
                      >
                        <RefreshCcw className="h-4 w-4" />
                        <span className="sr-only">Sustituir bloque</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex h-8 w-8 items-center justify-center rounded-full p-0"
                      >
                        <PlusCircle className="h-4 w-4" />
                        <span className="sr-only">Añadir recurso</span>
                      </Button>
                    </div>
                  </div>

                  {renderBloqueComida(bloque.id as TipoComida, dieta?.objetivo, dia.id, handleDrop)}
                </div>
              ))}
            </div>

                <Card className="bg-white/80 border border-slate-200 shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Total del día</span>
                      <span className={`font-semibold ${colorCalorias}`}>
                        {macrosDia.calorias} / {objetivoCalorias} kcal
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className={`rounded-lg px-3 py-2 ${
                        macrosDia.proteinas >= (dieta?.macros.proteinas ?? 0) * 0.9 && macrosDia.proteinas <= (dieta?.macros.proteinas ?? 0) * 1.1
                          ? 'bg-emerald-50 text-emerald-700'
                          : macrosDia.proteinas < (dieta?.macros.proteinas ?? 0) * 0.9
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        <span className="font-semibold">{Math.round(macrosDia.proteinas)} g</span>
                        <p className="text-[11px]">Proteína</p>
                      </div>
                      <div className={`rounded-lg px-3 py-2 ${
                        macrosDia.carbohidratos >= (dieta?.macros.carbohidratos ?? 0) * 0.9 && macrosDia.carbohidratos <= (dieta?.macros.carbohidratos ?? 0) * 1.1
                          ? 'bg-emerald-50 text-emerald-700'
                          : macrosDia.carbohidratos < (dieta?.macros.carbohidratos ?? 0) * 0.9
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        <span className="font-semibold">{Math.round(macrosDia.carbohidratos)} g</span>
                        <p className="text-[11px]">Carbohidratos</p>
                      </div>
                      <div className={`rounded-lg px-3 py-2 ${
                        macrosDia.grasas >= (dieta?.macros.grasas ?? 0) * 0.9 && macrosDia.grasas <= (dieta?.macros.grasas ?? 0) * 1.1
                          ? 'bg-emerald-50 text-emerald-700'
                          : macrosDia.grasas < (dieta?.macros.grasas ?? 0) * 0.9
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        <span className="font-semibold">{Math.round(macrosDia.grasas)} g</span>
                        <p className="text-[11px]">Grasas</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button variant="secondary" size="sm" className="text-xs" leftIcon={<Brain className="w-4 h-4" />}>
                        Optimizar día con IA
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Generar lista compra
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    );
  };

  const renderVistaDiaria = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Tabs
          items={diasSemana.map(({ id, nombre }) => ({ id, label: nombre }))}
          activeTab={diaSeleccionado}
          onTabChange={(tabId) => setDiaSeleccionado(tabId as (typeof diasSemana)[number]['id'])}
          variant="pills"
          size="sm"
        />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => irAlDia(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm" leftIcon={<Brain className="w-4 h-4" />}>
            Re-equilibrar día con IA
          </Button>
          <Button variant="ghost" size="sm">
            Guardar como plantilla
          </Button>
          <Button variant="ghost" size="sm" onClick={() => irAlDia(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-white via-white to-blue-50 border border-slate-200">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 capitalize">{diaSeleccionado}</h2>
              <p className="text-sm text-slate-500">Semana 1 · {dieta?.objetivo.replace('-', ' ') ?? 'Objetivo personalizado'}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-100 text-blue-700">Objetivo kcal: {dieta?.macros.calorias ?? 0}</Badge>
              <Badge className="bg-emerald-100 text-emerald-700">Ratio proteína: 2.0 g/kg</Badge>
              <Badge className="bg-amber-100 text-amber-700">Restricciones: {dieta?.restricciones?.join(', ') || 'Sin restricciones'}</Badge>
            </div>
          </div>

          <div className="space-y-4">
            {bloquesComida.map((bloque) => (
              <Card key={`${diaSeleccionado}-${bloque.id}`} className="bg-white border border-slate-200 shadow-sm">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        {bloque.icono}
                        <h3 className="text-base font-semibold text-slate-900">{bloque.nombre}</h3>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{bloque.descripcion}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>Hora recomendada: 08:00</span>
                    </div>
                  </div>

                  {renderBloqueComida(bloque.id as TipoComida, dieta?.objetivo, dia.id, handleDrop)}

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <span>Objetivo comida: {(dieta?.macros.calorias ?? 0) / 5 | 0} kcal</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex h-8 w-8 items-center justify-center rounded-full p-0"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span className="sr-only">Sugerir con IA</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex h-8 w-8 items-center justify-center rounded-full p-0"
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Duplicar bloque</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex h-8 w-8 items-center justify-center rounded-full p-0"
                      >
                        <Save className="h-4 w-4" />
                        <span className="sr-only">Guardar bloque</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderVistaExcel = () => (
    <Card className="bg-white border border-slate-200 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
          <span>Formato tipo Excel preparado para exportación</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" leftIcon={<FileSpreadsheet className="w-4 h-4" />}>
            Exportar .xlsx
          </Button>
          <Button variant="ghost" size="sm">Importar .xlsx</Button>
          <Button variant="ghost" size="sm" leftIcon={<Brain className="w-4 h-4" />}>
            Autoajustar objetivos
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Día</th>
              <th className="px-4 py-3">Comida</th>
              <th className="px-4 py-3">Receta</th>
              <th className="px-4 py-3">Raciones</th>
              <th className="px-4 py-3">Kcal</th>
              <th className="px-4 py-3">Proteínas</th>
              <th className="px-4 py-3">Hidratos</th>
              <th className="px-4 py-3">Grasas</th>
              <th className="px-4 py-3">Fibra</th>
              <th className="px-4 py-3">Azúcares</th>
              <th className="px-4 py-3">Comentarios</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {diasSemana.map((dia) =>
              bloquesComida.map((bloque) => {
                const comidas = comidasPorTipo[bloque.id] ?? [];
                const comida = comidas[0];
                return (
                  <tr key={`${dia.id}-${bloque.id}`} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-700">{dia.nombre}</td>
                    <td className="px-4 py-3 text-slate-600">{bloque.nombre}</td>
                    <td className="px-4 py-3 text-slate-700">{comida?.nombre ?? 'Pendiente de asignar'}</td>
                    <td className="px-4 py-3 text-slate-600">1</td>
                    <td className="px-4 py-3 text-slate-700">{comida?.calorias ?? '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{comida?.proteinas ?? '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{comida?.carbohidratos ?? '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{comida?.grasas ?? '-'}</td>
                    <td className="px-4 py-3 text-slate-600">-</td>
                    <td className="px-4 py-3 text-slate-600">-</td>
                    <td className="px-4 py-3 text-slate-500">Añadir comentarios</td>
                  </tr>
                );
              }),
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const renderContenidoVista = () => {
  const renderVistaTimeline = () => {
    if (!dieta) return null;
    return (
      <VistaTimeline
        dieta={dieta}
        onComidaClick={(comida) => {
          console.log('Comida clickeada:', comida);
        }}
        onComidaEdit={(comida) => {
          handleIniciarEdicion(comida);
        }}
      />
    );
  };

    if (vistaActiva === 'diaria') return renderVistaDiaria();
    if (vistaActiva === 'excel') return renderVistaExcel();
    return renderVistaSemanal();
  };

  const renderCanvas = () => {
    if (cargando) {
      return (
        <Card className="border border-slate-200/70 bg-white/95 px-6 py-16 text-center text-slate-500 shadow-sm">
          Cargando editor...
        </Card>
      );
    }

    return renderContenidoVista();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/80">
      {/* Topbar de alertas */}
      {inconsistencias.length > 0 && (
        <AlertasTopbar
          inconsistencias={inconsistencias}
          onDismiss={handleDismissInconsistencia}
          onVerDetalles={() => {
            // Scroll a la sección de alertas o mostrar modal
            console.log('Ver detalles de inconsistencias');
          }}
        />
      )}
      <div className="py-8">
        <div className="mx-auto flex w-full flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <header className="rounded-3xl border border-slate-200/70 bg-white/90 px-6 py-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/70">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Button 
              variant="secondary" 
              size="md" 
              leftIcon={<ArrowLeft className="h-4 w-4" />} 
              onClick={() => navigate('/dietas-asignadas')}
              className="font-medium"
            >
              Volver al listado
            </Button>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-slate-900">Editor de dieta</h1>
              <p className="text-xs text-slate-500">Diseña menús, recetas y planificaciones semanales con IA asistida</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {rightCollapsed && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRightCollapsed(false)}
                  className="flex h-9 w-9 items-center justify-center p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Restaurar panel</span>
                </Button>
              )}
              {dieta && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMostrarHistorial(true)}
                  className="flex items-center gap-2"
                  leftIcon={<History className="h-4 w-4" />}
                >
                  <span className="hidden sm:inline">Historial</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMostrarAIAssistant(true)}
                className="flex items-center gap-2"
                leftIcon={<Brain className="h-4 w-4" />}
              >
                <span className="hidden sm:inline">Asistente IA</span>
              </Button>
              {dieta && (
                <SaveButton
                  ultimoAutosave={dieta.ultimoAutosave}
                  estadoPublicacion={dieta.estadoPublicacion}
                  onGuardarBorrador={handleGuardarBorrador}
                  onPublicar={handlePublicar}
                  guardando={guardando}
                  publicando={publicando}
                />
              )}
            </div>
          </div>
          {/* Topbar con información de semana, objetivo calórico y estado */}
          {dieta && (
            <div className="mt-4 pt-4 border-t border-slate-200/70">
              <div className="flex flex-wrap items-center justify-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Semana {semanaActual}</span>
                </div>
                <div className="h-4 w-px bg-slate-300" />
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium text-slate-700">Objetivo: {dieta.macros.calorias} kcal</span>
                </div>
                <div className="h-4 w-px bg-slate-300" />
                <div className="flex items-center gap-2">
                  <Badge className={`${getEstadoColor(dieta.estado)} text-xs py-1 px-3 rounded-full border font-medium`}>
                    {getEstadoLabel(dieta.estado)}
                  </Badge>
                </div>
              </div>
              {/* Atajos rápidos */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-slate-200/50">
                <AtajosRapidos
                  acciones={acciones}
                  onAccion={handleAccionRapida}
                  onTogglePin={togglePin}
                  mostrarConfigurar={true}
                />
              </div>
            </div>
          )}
        </header>

        {dieta && metricasCabecera.length > 0 && (
          <MetricCards data={metricasCabecera} columns={4} />
        )}

        <Card className="border border-slate-200/70 bg-white/90 px-6 py-4 shadow-sm">
          <Tabs
            items={tabsVista}
            activeTab={vistaActiva}
            onTabChange={(tabId) => setVistaActiva(tabId as VistaActiva)}
            variant="pills"
            size="sm"
            className="justify-center"
          />
        </Card>

        <div className={`flex flex-col gap-6 ${isTablet ? 'md:flex-row' : 'lg:flex-row'}`}>
          <aside
            className={`relative flex w-full flex-col gap-4 transition-all duration-300 ${isTablet ? 'md:flex-shrink-0' : 'lg:flex-shrink-0'} ${
              leftCollapsed ? `${isTablet ? 'md:w-16' : 'lg:w-16'}` : `${isTablet ? 'md:w-[280px]' : 'lg:w-[320px]'}`
            }`}
          >
            <button
              type="button"
              onClick={() => setLeftCollapsed((prev) => !prev)}
              className="absolute -right-3 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-300 hover:text-indigo-500"
            >
              {leftCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>

            {leftCollapsed ? (
              <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200/70 bg-white/95 p-3 text-center shadow-sm">
                <Library className="h-5 w-5 text-indigo-500" />
                <PlusCircle className="h-5 w-5 text-slate-400" />
                <span className="text-[11px] font-medium text-slate-500">Biblioteca</span>
              </div>
            ) : (
              <>
                <Card className="border border-slate-200/70 bg-white/95 p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Library className="h-5 w-5 text-indigo-500" />
                      <h2 className="text-sm font-semibold text-slate-900">Biblioteca & bloques</h2>
                    </div>
                    <Button variant="ghost" size="sm">
                      Nueva receta
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Arrastra plantillas, recetas y bloques sobre tu plan semanal.
                  </p>

                  <div className="mt-4 max-h-[520px] overflow-y-auto pr-1">
                    <BibliotecaRecursos
                      recursos={recursosBiblioteca}
                      filtros={filtrosBiblioteca}
                      onFiltrosChange={setFiltrosBiblioteca}
                      onRecursoDragStart={handleRecursoDragStart}
                      tipoActivo={tabBiblioteca as TipoRecurso}
                      onTipoChange={(tipo) => setTabBiblioteca(tipo as BibliotecaTab)}
                      cargando={false}
                    />
                  </div>
                </Card>

                <Card className="border border-slate-200/70 bg-white/95 p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900">Acciones rápidas</h3>
                  <div className="mt-4 space-y-3">
                    <Button 
                      fullWidth 
                      variant="secondary" 
                      size="sm" 
                      leftIcon={<PlusCircle className="h-4 w-4" />}
                      onClick={() => {
                        setBloqueEditando(null);
                        setMostrarEditorBloque(true);
                      }}
                    >
                      Crear bloque personalizado
                    </Button>
                    <Button fullWidth variant="ghost" size="sm" leftIcon={<Brain className="h-4 w-4 text-indigo-500" />}>
                      Equilibrar semana con IA
                    </Button>
                    <Button fullWidth variant="ghost" size="sm" leftIcon={<Shuffle className="h-4 w-4 text-amber-500" />}>
                      Variar recetas
                    </Button>
                  </div>
                </Card>
              </>
            )}
          </aside>

          <main className="flex-1 space-y-4">{renderCanvas()}</main>

          {!rightCollapsed && (
            <aside className={`w-full flex-shrink-0 ${isTablet ? 'md:w-[300px]' : 'lg:w-[340px] xl:w-[360px]'}`}>
              <Card className="space-y-6 border border-slate-200/70 bg-white/95 p-6 shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Resumen</p>
                    <h3 className="mt-1 text-sm font-semibold text-slate-900">Hoy</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRightCollapsed(true)}
                    className="rounded-full border border-slate-200 p-2 text-slate-400 transition hover:border-indigo-300 hover:text-indigo-500"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                  <div className="space-y-2 text-sm text-slate-600">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">Próxima comida</p>
                    <p className="text-base font-semibold text-slate-900">Snack tarde</p>
                    <p>170 kcal · Alto en proteína</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Macros del día</p>
                  <div className="mt-3 space-y-3 text-sm text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Calorías</span>
                      <span className="font-semibold text-indigo-600">{dieta?.macros.calorias ?? 0} / {dieta?.macros.calorias ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Proteínas</span>
                      <span className="font-semibold text-indigo-600">{dieta?.macros.proteinas ?? 0} g</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Hidratos</span>
                      <span className="font-semibold text-indigo-600">{dieta?.macros.carbohidratos ?? 0} g</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Grasas</span>
                      <span className="font-semibold text-indigo-600">{dieta?.macros.grasas ?? 0} g</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Esta semana</p>
                  <div className="mt-3 space-y-4 text-sm text-slate-600">
                    <div>
                      <div className="flex items-center justify-between">
                        <span>Kcal medias/día</span>
                        <span className="font-semibold text-emerald-600">2100 / 2200</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-100">
                        <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span>Proteínas medias</span>
                        <span className="font-semibold text-emerald-600">150 g / 170 g</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-100">
                        <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span>% días en rango</span>
                        <span className="font-semibold text-amber-600">5 / 7</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-100">
                        <div className="h-full w-[74%] rounded-full bg-gradient-to-r from-amber-500 to-orange-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Alertas inteligentes</p>
                  <div className="mt-3 space-y-3 text-sm">
                    <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      <div>
                        <p className="font-semibold text-amber-900">Proteína baja 3 días seguidos</p>
                        <Button variant="ghost" size="sm" className="mt-2 h-auto px-3 py-1 text-xs text-amber-600 hover:text-amber-700">
                          Añadir bloque rico en proteína
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                      <Brain className="h-5 w-5 text-indigo-500" />
                      <div>
                        <p className="font-semibold text-indigo-900">IA sugiere lista de compra</p>
                        <Button variant="ghost" size="sm" className="mt-2 h-auto px-3 py-1 text-xs text-indigo-600 hover:text-indigo-700">
                          Generar lista
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button fullWidth variant="secondary" size="sm" leftIcon={<Brain className="h-4 w-4" />}>
                    Optimizar semana
                  </Button>
                  <Button fullWidth variant="ghost" size="sm" leftIcon={<ShoppingCart className="h-4 w-4" />}>
                    Generar lista compra
                  </Button>
                </div>
              </Card>
            </aside>
          )}
        </div>

        {/* AI Assistant Modal */}
        {dieta && (
          <AIAssistant
            dieta={dieta}
            isOpen={mostrarAIAssistant}
            onClose={() => setMostrarAIAssistant(false)}
            onAplicarSugerencia={handleAplicarSugerencia}
          />
        )}

        {/* Historial de Cambios Modal */}
        {dieta && (
          <HistorialCambios
            dieta={dieta}
            isOpen={mostrarHistorial}
            onClose={() => setMostrarHistorial(false)}
            onRevertir={handleRevertirCambio}
          />
        )}
      </div>
    </div>
  );
}



            size="sm"
            className="justify-center"
          />
        </Card>

        <div className={`flex flex-col gap-6 ${isTablet ? 'md:flex-row' : 'lg:flex-row'}`}>
          <aside
            className={`relative flex w-full flex-col gap-4 transition-all duration-300 ${isTablet ? 'md:flex-shrink-0' : 'lg:flex-shrink-0'} ${
              leftCollapsed ? `${isTablet ? 'md:w-16' : 'lg:w-16'}` : `${isTablet ? 'md:w-[280px]' : 'lg:w-[320px]'}`
            }`}
          >
            <button
              type="button"
              onClick={() => setLeftCollapsed((prev) => !prev)}
              className="absolute -right-3 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-300 hover:text-indigo-500"
            >
              {leftCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>

            {leftCollapsed ? (
              <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200/70 bg-white/95 p-3 text-center shadow-sm">
                <Library className="h-5 w-5 text-indigo-500" />
                <PlusCircle className="h-5 w-5 text-slate-400" />
                <span className="text-[11px] font-medium text-slate-500">Biblioteca</span>
              </div>
            ) : (
              <>
                <Card className="border border-slate-200/70 bg-white/95 p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Library className="h-5 w-5 text-indigo-500" />
                      <h2 className="text-sm font-semibold text-slate-900">Biblioteca & bloques</h2>
                    </div>
                    <Button variant="ghost" size="sm">
                      Nueva receta
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Arrastra plantillas, recetas y bloques sobre tu plan semanal.
                  </p>

                  <div className="mt-4 max-h-[520px] overflow-y-auto pr-1">
                    <BibliotecaRecursos
                      recursos={recursosBiblioteca}
                      filtros={filtrosBiblioteca}
                      onFiltrosChange={setFiltrosBiblioteca}
                      onRecursoDragStart={handleRecursoDragStart}
                      tipoActivo={tabBiblioteca as TipoRecurso}
                      onTipoChange={(tipo) => setTabBiblioteca(tipo as BibliotecaTab)}
                      cargando={false}
                    />
                  </div>
                </Card>

                <Card className="border border-slate-200/70 bg-white/95 p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900">Acciones rápidas</h3>
                  <div className="mt-4 space-y-3">
                    <Button 
                      fullWidth 
                      variant="secondary" 
                      size="sm" 
                      leftIcon={<PlusCircle className="h-4 w-4" />}
                      onClick={() => {
                        setBloqueEditando(null);
                        setMostrarEditorBloque(true);
                      }}
                    >
                      Crear bloque personalizado
                    </Button>
                    <Button fullWidth variant="ghost" size="sm" leftIcon={<Brain className="h-4 w-4 text-indigo-500" />}>
                      Equilibrar semana con IA
                    </Button>
                    <Button fullWidth variant="ghost" size="sm" leftIcon={<Shuffle className="h-4 w-4 text-amber-500" />}>
                      Variar recetas
                    </Button>
                  </div>
                </Card>
              </>
            )}
          </aside>

          <main className="flex-1 space-y-4">{renderCanvas()}</main>

          {!rightCollapsed && (
            <aside className={`w-full flex-shrink-0 ${isTablet ? 'md:w-[300px]' : 'lg:w-[340px] xl:w-[360px]'}`}>
              <Card className="space-y-6 border border-slate-200/70 bg-white/95 p-6 shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Resumen</p>
                    <h3 className="mt-1 text-sm font-semibold text-slate-900">Hoy</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRightCollapsed(true)}
                    className="rounded-full border border-slate-200 p-2 text-slate-400 transition hover:border-indigo-300 hover:text-indigo-500"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                  <div className="space-y-2 text-sm text-slate-600">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">Próxima comida</p>
                    <p className="text-base font-semibold text-slate-900">Snack tarde</p>
                    <p>170 kcal · Alto en proteína</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Macros del día</p>
                  <div className="mt-3 space-y-3 text-sm text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Calorías</span>
                      <span className="font-semibold text-indigo-600">{dieta?.macros.calorias ?? 0} / {dieta?.macros.calorias ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Proteínas</span>
                      <span className="font-semibold text-indigo-600">{dieta?.macros.proteinas ?? 0} g</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Hidratos</span>
                      <span className="font-semibold text-indigo-600">{dieta?.macros.carbohidratos ?? 0} g</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Grasas</span>
                      <span className="font-semibold text-indigo-600">{dieta?.macros.grasas ?? 0} g</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Esta semana</p>
                  <div className="mt-3 space-y-4 text-sm text-slate-600">
                    <div>
                      <div className="flex items-center justify-between">
                        <span>Kcal medias/día</span>
                        <span className="font-semibold text-emerald-600">2100 / 2200</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-100">
                        <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span>Proteínas medias</span>
                        <span className="font-semibold text-emerald-600">150 g / 170 g</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-100">
                        <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span>% días en rango</span>
                        <span className="font-semibold text-amber-600">5 / 7</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-100">
                        <div className="h-full w-[74%] rounded-full bg-gradient-to-r from-amber-500 to-orange-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Alertas inteligentes</p>
                  <div className="mt-3 space-y-3 text-sm">
                    <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      <div>
                        <p className="font-semibold text-amber-900">Proteína baja 3 días seguidos</p>
                        <Button variant="ghost" size="sm" className="mt-2 h-auto px-3 py-1 text-xs text-amber-600 hover:text-amber-700">
                          Añadir bloque rico en proteína
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                      <Brain className="h-5 w-5 text-indigo-500" />
                      <div>
                        <p className="font-semibold text-indigo-900">IA sugiere lista de compra</p>
                        <Button variant="ghost" size="sm" className="mt-2 h-auto px-3 py-1 text-xs text-indigo-600 hover:text-indigo-700">
                          Generar lista
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button fullWidth variant="secondary" size="sm" leftIcon={<Brain className="h-4 w-4" />}>
                    Optimizar semana
                  </Button>
                  <Button fullWidth variant="ghost" size="sm" leftIcon={<ShoppingCart className="h-4 w-4" />}>
                    Generar lista compra
                  </Button>
                </div>
              </Card>
            </aside>
          )}
        </div>

        {/* AI Assistant Modal */}
        {dieta && (
          <AIAssistant
            dieta={dieta}
            isOpen={mostrarAIAssistant}
            onClose={() => setMostrarAIAssistant(false)}
            onAplicarSugerencia={handleAplicarSugerencia}
          />
        )}

        {/* Editor de Bloque Personalizado */}
        <EditorBloquePersonalizado
          isOpen={mostrarEditorBloque}
          onClose={() => {
            setMostrarEditorBloque(false);
            setBloqueEditando(null);
          }}
          bloqueExistente={bloqueEditando || undefined}
          onGuardar={handleGuardarBloque}
        />
      </div>
    </div>
  );
}


