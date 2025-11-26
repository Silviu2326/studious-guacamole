import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Tabs, Badge, MetricCards } from '../../../components/componentsreutilizables';
import type { MetricCardData, TabItem } from '../../../components/componentsreutilizables';
import { getDieta } from '../api';
import type { Dieta, Comida } from '../types';
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

type VistaActiva = 'semanal' | 'diaria' | 'excel';
type BibliotecaTab = 'plantillas' | 'recetas' | 'alimentos' | 'bloques';

const tabsVista = [
  { id: 'semanal', label: 'Vista semanal', icon: <CalendarRange className="h-4 w-4 text-indigo-500" /> },
  { id: 'diaria', label: 'Vista diaria', icon: <CalendarCheck className="h-4 w-4 text-emerald-500" /> },
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

  useEffect(() => {
    let isMounted = true;
    const cargarDieta = async () => {
      if (!dietaId) return;
      setCargando(true);
      try {
        const data = await getDieta(dietaId);
        if (isMounted) {
          setDieta(data);
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

  const renderBloqueComida = (bloqueId: string) => {
    const comidas = comidasPorTipo[bloqueId] || [];
    if (comidas.length === 0) {
      return (
        <div className="border border-dashed border-slate-300 rounded-lg bg-white/40 text-center py-6">
          <p className="text-sm text-slate-500">Arrastra recetas o bloques aquí</p>
          <p className="text-xs text-slate-400 mt-1">Mantén las macros dentro del objetivo</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {comidas.map((comida) => (
          <Card key={comida.id} className="bg-white border border-slate-200 shadow-sm">
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{comida.nombre}</h4>
                  <p className="text-xs text-slate-500">
                    {comida.horario ? `${comida.horario} · ` : ''}
                    {comida.calorias} kcal · P {comida.proteinas}g · H {comida.carbohidratos}g · G {comida.grasas}g
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex h-8 w-8 items-center justify-center rounded-full p-0"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar comida</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex h-8 w-8 items-center justify-center rounded-full p-0"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Duplicar comida</span>
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>IA Sugerida · Alta adherencia</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const diaActualIndex = diasSemana.findIndex((dia) => dia.id === diaSeleccionado);

  const irAlDia = (direccion: -1 | 1) => {
    const nextIndex = (diaActualIndex + direccion + diasSemana.length) % diasSemana.length;
    setDiaSeleccionado(diasSemana[nextIndex].id);
  };

  const renderVistaSemanal = () => (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span>Semana 1 · {dieta?.objetivo ? dieta.objetivo.replace('-', ' ') : 'Objetivo personalizado'} · {dieta?.macros.calorias} kcal</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7 overflow-x-auto pb-4">
        <div className="flex gap-4 2xl:min-w-full w-max">
        {diasSemana.map((dia) => (
          <div key={dia.id} className="rounded-3xl bg-gradient-to-br from-white via-white to-blue-50 border border-slate-200 shadow-sm p-4 space-y-4 min-w-[260px]">
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

                  {renderBloqueComida(bloque.id)}
                </div>
              ))}
            </div>

            <Card className="bg-white/80 border border-slate-200 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Total del día</span>
                  <span className="font-semibold text-slate-900">{dieta?.macros.calorias ?? 0} / {dieta?.macros.calorias ?? 0} kcal</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-blue-50 text-blue-700 rounded-lg px-3 py-2">
                    <span className="font-semibold">{dieta?.macros.proteinas ?? 0} g</span>
                    <p className="text-[11px]">Proteína</p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 rounded-lg px-3 py-2">
                    <span className="font-semibold">{dieta?.macros.carbohidratos ?? 0} g</span>
                    <p className="text-[11px]">Carbohidratos</p>
                  </div>
                  <div className="bg-amber-50 text-amber-700 rounded-lg px-3 py-2">
                    <span className="font-semibold">{dieta?.macros.grasas ?? 0} g</span>
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
        ))}
        </div>
      </div>
    </div>
  );

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

                  {renderBloqueComida(bloque.id)}

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/80 py-8">
      <div className="mx-auto flex w-full flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-slate-200/70 bg-white/90 px-6 py-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/70">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate(-1)}>
              Volver
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
              <Button
                variant="ghost"
                size="sm"
                className="flex h-9 w-9 items-center justify-center p-0"
              >
                <Sparkles className="h-4 w-4" />
                <span className="sr-only">Sugerir con IA</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="flex h-9 w-9 items-center justify-center p-0"
              >
                <Save className="h-4 w-4" />
                <span className="sr-only">Guardar borrador</span>
              </Button>
              <Badge className="bg-blue-100 text-blue-800 text-xs py-2 px-3 rounded-xl">
                Semana 1 · {dieta?.objetivo.replace('-', ' ') ?? 'Objetivo'} · {dieta?.macros.calorias ?? 0} kcal
              </Badge>
            </div>
          </div>
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

        <div className="flex flex-col gap-6 lg:flex-row">
          <aside
            className={`relative flex w-full flex-col gap-4 transition-all duration-300 lg:flex-shrink-0 ${
              leftCollapsed ? 'lg:w-16' : 'lg:w-[320px]'
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

                  <div className="mt-4 flex flex-wrap gap-2">
                    <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-600">
                      <Search className="h-4 w-4" />
                      Buscar recursos
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-600">
                      <Filter className="h-4 w-4" />
                      Filtros avanzados
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-600">
                      <SlidersHorizontal className="h-4 w-4" />
                      {filtrosDisponibles.length} filtros activos
                    </div>
                  </div>

                  <div className="mt-4">
                    <Tabs
                      items={tabsBiblioteca}
                      activeTab={tabBiblioteca}
                      onTabChange={(tabId) => setTabBiblioteca(tabId as BibliotecaTab)}
                      variant="pills"
                      size="sm"
                    />
                  </div>

                  <div className="mt-4 max-h-[520px] space-y-3 overflow-y-auto pr-1">
                    {renderBiblioteca()}
                  </div>
                </Card>

                <Card className="border border-slate-200/70 bg-white/95 p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900">Acciones rápidas</h3>
                  <div className="mt-4 space-y-3">
                    <Button fullWidth variant="secondary" size="sm" leftIcon={<PlusCircle className="h-4 w-4" />}>
                      Crear bloque desde cero
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
            <aside className="w-full flex-shrink-0 lg:w-[340px] xl:w-[360px]">
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
      </div>
    </div>
  );
}


