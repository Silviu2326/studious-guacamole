import React, { useEffect, useMemo, useState, createContext, useContext, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Tabs, Badge, MetricCards } from '../../../components/componentsreutilizables';
import type { MetricCardData, TabItem } from '../../../components/componentsreutilizables';
import { getDieta } from '../api';
import type { Dieta, Comida } from '../types';
import {
  ArrowLeft, Sparkles, Save, Target, Flame, Apple, Droplets, TrendingUp, Brain, Calendar,
  CalendarRange, CalendarCheck, Copy, Shuffle, RefreshCcw, CheckCircle2, ShoppingCart,
  AlertTriangle, BarChart3, Filter, Search, SlidersHorizontal, ChefHat, Clock, UtensilsCrossed,
  FileSpreadsheet, ChevronLeft, ChevronRight, Library, PlusCircle, Edit, Menu, MoreHorizontal,
  Trash2, GripVertical, Check, Info, MessageSquare
} from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  DragEndEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter
} from '@dnd-kit/core';

// --- Tipos & Contexto ---

interface MacroNutrients {
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
}

interface FoodItem {
  id: string;
  nombre: string;
  cantidad: number; // en gramos o unidades
  unidad: string;
  macros: MacroNutrients;
  tipo: 'receta' | 'alimento' | 'bloque';
  imagen?: string;
}

interface MealBlock {
  id: string;
  nombre: string;
  descripcion: string;
  icono: React.ReactNode;
  items: FoodItem[];
  macrosObjetivo?: MacroNutrients;
}

interface DietDay {
  id: string; // 'lunes', 'martes', etc.
  nombre: string;
  fecha?: string;
  bloques: Record<string, MealBlock>; // 'desayuno': { ... }
}

interface DietEditorState {
  dias: Record<string, DietDay>; // 'lunes': { ... }
  objetivosGlobales: MacroNutrients;
  isDragging: boolean;
  activeDragItem: any | null;
}

interface DietEditorContextType extends DietEditorState {
  addItemToMeal: (dayId: string, blockId: string, item: FoodItem) => void;
  removeItemFromMeal: (dayId: string, blockId: string, itemId: string) => void;
  updateGlobalTargets: (targets: Partial<MacroNutrients>) => void;
  setActiveDragItem: (item: any | null) => void;
}

const DietContext = createContext<DietEditorContextType | undefined>(undefined);

const useDietEditor = () => {
  const context = useContext(DietContext);
  if (!context) throw new Error('useDietEditor must be used within DietProvider');
  return context;
};

// --- Constantes ---

const BLOCKS_CONFIG = [
  { id: 'desayuno', nombre: 'Desayuno', descripcion: 'Inicio energético', icono: <ChefHat className="w-4 h-4 text-amber-500" /> },
  { id: 'media-manana', nombre: 'Snack AM', descripcion: 'Energía estable', icono: <Clock className="w-4 h-4 text-sky-500" /> },
  { id: 'almuerzo', nombre: 'Comida', descripcion: 'Bloque principal', icono: <UtensilsCrossed className="w-4 h-4 text-emerald-500" /> },
  { id: 'merienda', nombre: 'Snack PM', descripcion: 'Recuperación', icono: <Apple className="w-4 h-4 text-rose-500" /> },
  { id: 'cena', nombre: 'Cena', descripcion: 'Cierre ligero', icono: <Flame className="w-4 h-4 text-indigo-500" /> },
];

const DIAS_SEMANA = [
  { id: 'lunes', label: 'L', nombre: 'Lunes' },
  { id: 'martes', label: 'M', nombre: 'Martes' },
  { id: 'miercoles', label: 'X', nombre: 'Miércoles' },
  { id: 'jueves', label: 'J', nombre: 'Jueves' },
  { id: 'viernes', label: 'V', nombre: 'Viernes' },
  { id: 'sabado', label: 'S', nombre: 'Sábado' },
  { id: 'domingo', label: 'D', nombre: 'Domingo' },
] as const;

// --- Mock Data Library ---

const LIBRARY_ITEMS: FoodItem[] = [
  { id: 'r1', nombre: 'Bowl de Avena & Frutos Rojos', cantidad: 1, unidad: 'ración', tipo: 'receta', macros: { calorias: 420, proteinas: 22, carbohidratos: 52, grasas: 12 } },
  { id: 'r2', nombre: 'Pollo Teriyaki con Quinoa', cantidad: 1, unidad: 'ración', tipo: 'receta', macros: { calorias: 520, proteinas: 45, carbohidratos: 50, grasas: 18 } },
  { id: 'r3', nombre: 'Salmón al Horno con Espárragos', cantidad: 1, unidad: 'ración', tipo: 'receta', macros: { calorias: 480, proteinas: 40, carbohidratos: 12, grasas: 28 } },
  { id: 'a1', nombre: 'Huevo Cocido', cantidad: 1, unidad: 'unidad', tipo: 'alimento', macros: { calorias: 70, proteinas: 6, carbohidratos: 0.5, grasas: 5 } },
  { id: 'a2', nombre: 'Plátano', cantidad: 1, unidad: 'unidad', tipo: 'alimento', macros: { calorias: 105, proteinas: 1.3, carbohidratos: 27, grasas: 0.3 } },
  { id: 'a3', nombre: 'Proteína Whey (30g)', cantidad: 1, unidad: 'scoop', tipo: 'alimento', macros: { calorias: 120, proteinas: 24, carbohidratos: 2, grasas: 1 } },
];

const tabsBiblioteca: TabItem[] = [
  { id: 'plantillas', label: 'Plantillas' },
  { id: 'recetas', label: 'Recetas' },
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

// --- Componentes ---

const DraggableLibraryItem: React.FC<{ item: FoodItem }> = ({ item }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `lib-${item.id}`,
    data: { type: 'library-item', item },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`bg-white border rounded-lg p-3 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-grab active:cursor-grabbing group ${isDragging ? 'opacity-50 ring-2 ring-blue-400' : 'border-slate-200'
        }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm font-medium text-slate-900 group-hover:text-blue-600 truncate max-w-[180px]">{item.nombre}</h4>
          <p className="text-xs text-slate-500 mt-0.5 capitalize">{item.tipo}</p>
        </div>
        <div className="p-1 rounded-full hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
          <PlusCircle size={16} />
        </div>
      </div>
      <div className="mt-2 grid grid-cols-4 gap-1 text-[10px] text-slate-500 font-medium">
        <span className="bg-slate-50 px-1.5 py-0.5 rounded text-slate-600">{item.macros.calorias} kcal</span>
        <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">P: {item.macros.proteinas}</span>
        <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">C: {item.macros.carbohidratos}</span>
        <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">G: {item.macros.grasas}</span>
      </div>
    </div>
  );
};

const DroppableMealBlock: React.FC<{
  dayId: string;
  blockConfig: typeof BLOCKS_CONFIG[number];
  data: MealBlock;
}> = ({ dayId, blockConfig, data }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${dayId}-${blockConfig.id}`,
    data: { type: 'meal-block', dayId, blockId: blockConfig.id },
  });

  const { removeItemFromMeal } = useDietEditor();

  // Calcular totales del bloque
  const totalMacros = useMemo(() => {
    return data.items.reduce((acc, item) => ({
      calorias: acc.calorias + item.macros.calorias,
      proteinas: acc.proteinas + item.macros.proteinas,
      carbohidratos: acc.carbohidratos + item.macros.carbohidratos,
      grasas: acc.grasas + item.macros.grasas,
    }), { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 });
  }, [data.items]);

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border transition-all duration-200 flex flex-col gap-2 p-3 ${isOver
          ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-200'
          : 'bg-white/60 border-slate-200 hover:border-slate-300'
        }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-100">
            {blockConfig.icono}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800">{blockConfig.nombre}</h4>
            <p className="text-[10px] text-slate-500">{blockConfig.descripcion}</p>
          </div>
        </div>
        {data.items.length > 0 && (
          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
            {totalMacros.calorias} kcal
          </span>
        )}
      </div>

      <div className="space-y-2 min-h-[40px]">
        {data.items.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-2 text-center transition-colors hover:border-blue-300 hover:bg-blue-50/50 group cursor-default">
            <span className="text-xs text-slate-400 group-hover:text-blue-500 font-medium flex items-center justify-center gap-1">
              <PlusCircle size={12} /> Arrastra aquí
            </span>
          </div>
        ) : (
          data.items.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="group bg-white border border-slate-100 rounded-lg p-2 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex justify-between items-center animate-in fade-in zoom-in-95 duration-200">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-800 truncate">{item.nombre}</span>
                  {item.tipo === 'receta' && <Badge size="sm" className="text-[9px] px-1 py-0 h-4 bg-purple-50 text-purple-700 border-none">R</Badge>}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                  <span className="font-semibold text-slate-700">{item.macros.calorias} kcal</span>
                  <span>· P {item.macros.proteinas}</span>
                  <span>· C {item.macros.carbohidratos}</span>
                  <span>· G {item.macros.grasas}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => removeItemFromMeal(dayId, blockConfig.id, item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md cursor-grab">
                  <GripVertical size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- Paneles ---

const TopBar: React.FC<{
  dieta: Dieta | null;
  onNavigateBack: () => void;
  globalMacros: MacroNutrients;
  isFitCoachOpen: boolean;
  onToggleFitCoach: () => void;
}> = ({ dieta, onNavigateBack, globalMacros, isFitCoachOpen, onToggleFitCoach }) => {
  return (
    <header className="h-16 flex-shrink-0 bg-white border-b border-gray-200 px-4 lg:px-6 flex items-center justify-between shadow-sm z-30">
      <div className="flex justify-start items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onNavigateBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl flex items-center justify-center shadow-md ring-2 ring-emerald-100">
            <Apple className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 hidden lg:block tracking-tight leading-tight">
              Editor Nutricional
            </h1>
            <p className="text-xs text-slate-500 font-medium hidden lg:block">
              {dieta?.objetivo ? dieta.objetivo.replace('-', ' ') : 'Plan Personalizado'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="hidden xl:flex items-center gap-6 px-6 py-2 bg-slate-50 rounded-xl border border-slate-100 mx-4">
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Energía</span>
          <span className="text-sm font-bold text-slate-700">{globalMacros.calorias} <span className="text-slate-400 font-normal">/ {dieta?.macros.calorias}</span></span>
        </div>
        <div className="w-px h-8 bg-slate-200"></div>
        <div className="flex gap-4">
          <div className="flex flex-col items-center w-12">
            <span className="text-[10px] font-bold text-blue-600">PROT</span>
            <div className="w-full h-1.5 bg-blue-100 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((globalMacros.proteinas / (dieta?.macros.proteinas || 1)) * 100, 100)}%` }}></div>
            </div>
            <span className="text-[10px] text-slate-600 mt-0.5">{globalMacros.proteinas}g</span>
          </div>
          <div className="flex flex-col items-center w-12">
            <span className="text-[10px] font-bold text-emerald-600">CARB</span>
            <div className="w-full h-1.5 bg-emerald-100 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min((globalMacros.carbohidratos / (dieta?.macros.carbohidratos || 1)) * 100, 100)}%` }}></div>
            </div>
            <span className="text-[10px] text-slate-600 mt-0.5">{globalMacros.carbohidratos}g</span>
          </div>
          <div className="flex flex-col items-center w-12">
            <span className="text-[10px] font-bold text-amber-600">GRAS</span>
            <div className="w-full h-1.5 bg-amber-100 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min((globalMacros.grasas / (dieta?.macros.grasas || 1)) * 100, 100)}%` }}></div>
            </div>
            <span className="text-[10px] text-slate-600 mt-0.5">{globalMacros.grasas}g</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleFitCoach}
          className={`
            relative hidden sm:flex items-center justify-center sm:justify-start gap-2 rounded-full transition-all border
            p-2 sm:px-3 sm:py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500
            ${isFitCoachOpen 
              ? 'bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }
          `}
          title="FitCoach Nutrición"
        >
          <Sparkles className={`w-4 h-4 ${isFitCoachOpen ? 'fill-indigo-700' : ''}`} aria-hidden="true" />
          <span className="hidden lg:inline font-medium text-sm">FitCoach</span>
        </button>

        <Button variant="primary" size="sm" className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200">
          <Save className="w-4 h-4" />
          <span className="hidden md:inline">Guardar Cambios</span>
        </Button>
      </div>
    </header>
  );
};

const LibraryPanel: React.FC<{
  collapsed: boolean;
  onToggle: () => void;
  activeTab: BibliotecaTab;
  onTabChange: (tab: BibliotecaTab) => void;
}> = ({ collapsed, onToggle, activeTab, onTabChange }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return LIBRARY_ITEMS.filter(item =>
      item.nombre.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (activeTab === 'recetas' ? item.tipo === 'receta' : activeTab === 'alimentos' ? item.tipo === 'alimento' : true)
    );
  }, [searchQuery, activeTab]);

  return (
    <aside
      className={`relative border-r border-gray-200 bg-white flex flex-col h-full transition-all duration-300 z-20 ${collapsed ? 'w-14' : 'w-[320px]'
        }`}
    >
      {/* Header Panel */}
      <div className="h-12 border-b border-gray-100 flex items-center justify-between px-3 bg-white">
        {!collapsed && <span className="font-bold text-slate-800 text-sm tracking-tight flex items-center gap-2"><Library size={16} className="text-blue-600" /> Biblioteca</span>}
        <button
          onClick={onToggle}
          className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {!collapsed && (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
          {/* Search & Tabs */}
          <div className="p-3 border-b border-gray-200 bg-white space-y-3 shadow-sm z-10">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar ingredientes, recetas..."
                className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-gray-200 bg-slate-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex p-1 bg-slate-100 rounded-lg">
              {tabsBiblioteca.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id as BibliotecaTab)}
                  className={`flex-1 py-1.5 text-[10px] font-semibold rounded-md transition-all ${activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {activeTab === 'plantillas' ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileSpreadsheet className="text-blue-400" size={24} />
                </div>
                <p className="text-xs text-slate-500 font-medium">Plantillas predefinidas</p>
                <p className="text-[10px] text-slate-400 mt-1">Arrastra para aplicar semana completa</p>
              </div>
            ) : filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <DraggableLibraryItem key={item.id} item={item} />
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No se encontraron resultados
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collapsed State */}
      {collapsed && (
        <div className="flex flex-col items-center py-4 gap-4">
          <button onClick={onToggle} className="w-9 h-9 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 rounded-lg text-slate-400 transition-colors" title="Expandir">
            <Search size={20} />
          </button>
          <div className="w-8 h-px bg-slate-100"></div>
          {tabsBiblioteca.map(t => (
            <button
              key={t.id}
              onClick={() => { onTabChange(t.id as BibliotecaTab); onToggle(); }}
              className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${activeTab === t.id ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
              title={t.label}
            >
              <span className="text-[10px] font-bold uppercase">{t.label.charAt(0)}</span>
            </button>
          ))}
        </div>
      )}
    </aside>
  );
};

const EditorCanvas: React.FC<{
  loading: boolean;
}> = ({ loading }) => {
  const { dias } = useDietEditor();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-400 text-xs font-medium animate-pulse">Cargando lienzo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-100/50 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-20">
        {DIAS_SEMANA.map((diaInfo) => {
          const dayData = dias[diaInfo.id];
          // Calcular totales del día
          const dayTotal = Object.values(dayData.bloques).reduce((acc, block) => {
            block.items.forEach(item => {
              acc.kcal += item.macros.calorias;
              acc.p += item.macros.proteinas;
              acc.c += item.macros.carbohidratos;
              acc.f += item.macros.grasas;
            });
            return acc;
          }, { kcal: 0, p: 0, c: 0, f: 0 });

          const progress = Math.min((dayTotal.kcal / 2500) * 100, 100); // Mock target 2500

          return (
            <div key={diaInfo.id} className="flex flex-col gap-3 min-w-[280px]">
              {/* Day Header Card */}
              <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-4 sticky top-0 z-10 backdrop-blur-md bg-white/90">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold uppercase">{diaInfo.label}</span>
                    <span className="font-bold text-slate-800">{diaInfo.nombre}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-700">{dayTotal.kcal}</span>
                    <span className="text-[10px] text-slate-400">/ 2500</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${progress > 100 ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Macros Mini Summary */}
                <div className="flex justify-between text-[10px] text-slate-500 font-medium px-1">
                  <span>P: {dayTotal.p.toFixed(0)}g</span>
                  <span>C: {dayTotal.c.toFixed(0)}g</span>
                  <span>G: {dayTotal.f.toFixed(0)}g</span>
                </div>
              </div>

              {/* Meal Blocks */}
              <div className="flex flex-col gap-3">
                {BLOCKS_CONFIG.map(blockConfig => (
                  <DroppableMealBlock
                    key={blockConfig.id}
                    dayId={diaInfo.id}
                    blockConfig={blockConfig}
                    data={dayData.bloques[blockConfig.id] || { id: blockConfig.id, items: [] }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RightPanel: React.FC<{
  collapsed: boolean;
  onToggle: () => void;
  dieta: Dieta | null;
  globalMacros: MacroNutrients;
}> = ({ collapsed, onToggle, dieta, globalMacros }) => {
  const [activeTab, setActiveTab] = useState('Chat');
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock Messages for Diet Context
  const [messages, setMessages] = useState([
    { id: 1, text: '¡Hola! Soy tu asistente de nutrición. Analizo el plan actual. ¿En qué puedo ayudarte?', isUser: false },
    { id: 2, text: 'Revisa el balance de proteínas', isUser: true },
    { 
      id: 3, 
      text: 'El plan actual tiene un buen aporte proteico (2.2g/kg), pero la cena del Jueves es baja en proteínas. Sugiero añadir un postre lácteo o aumentar la ración principal.', 
      isUser: false,
      actionCard: {
        title: 'Mejora de Proteína',
        description: 'Añadir 150g de Queso Batido 0% a la cena del Jueves.',
        actions: [{ label: 'Aplicar cambio', onClick: () => console.log('Applied'), type: 'primary' }]
      }
    },
  ]);

  const [alerts, setAlerts] = useState([
    {
      id: '1',
      level: 'warning',
      title: 'Déficit de Fibra',
      message: 'La ingesta de fibra es baja (<25g) los Lunes y Martes. Considera añadir legumbres o frutas.',
      action: { label: 'Corregir auto', handler: () => console.log('Fix fiber') }
    },
    {
      id: '2',
      level: 'info',
      title: 'Variedad Baja',
      message: 'Estás repitiendo la misma fuente de proteína 4 días seguidos en el almuerzo.',
      action: { label: 'Sugerir alternativas', handler: () => console.log('Suggest alts') }
    }
  ]);

  const tabs = [
    { id: 'Chat', label: 'Chat', icon: MessageSquare },
    { id: 'Insights', label: 'Insights', icon: Brain },
    { id: 'Alertas', label: 'Alertas', icon: AlertTriangle, count: alerts.length },
    { id: 'Metricas', label: 'Métricas', icon: BarChart3 },
  ];

  const handleSendMessage = (text: string = inputMessage) => {
    if (!text.trim()) return;
    const newMessage = { id: Date.now(), text, isUser: true };
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    
    // Simulate bot response
    setTimeout(() => {
        setMessages(prev => [...prev, { 
            id: Date.now() + 1, 
            text: 'Entendido, estoy analizando esa solicitud...', 
            isUser: false 
        }]);
    }, 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const ActionCard = ({ title, description, actions }: any) => (
    <div className="card bg-white border border-gray-200 p-3 rounded-lg shadow-sm mt-2 mb-1">
      <h4 className="font-bold text-sm text-gray-800 flex items-center gap-2">
        <Sparkles size={14} className="text-purple-500" />
        {title}
      </h4>
      <p className="text-xs text-gray-600 mb-3 mt-1">{description}</p>
      <div className="flex gap-2">
        {actions.map((action: any, idx: number) => (
          <button
            key={idx}
            onClick={action.onClick}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${action.type === 'primary'
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );

  const MessageBubble = ({ message }: { message: any }) => (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!message.isUser && (
        <div className="flex-shrink-0 mr-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <Brain size={18} />
          </div>
        </div>
      )}
      <div className="flex flex-col max-w-[85%]">
        <div
          className={`
              p-3 text-sm shadow-sm
              ${message.isUser
              ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-none'
              : 'bg-gray-100 text-gray-900 rounded-2xl rounded-tl-none border border-gray-200'}
            `}
        >
          {message.text}
        </div>
        {message.actionCard && (
          <ActionCard
            title={message.actionCard.title}
            description={message.actionCard.description}
            actions={message.actionCard.actions}
          />
        )}
      </div>
    </div>
  );

  return (
    <aside
      className={`relative border-l border-gray-200 bg-white flex flex-col h-full transition-all duration-300 z-20 ${collapsed ? 'w-14' : 'w-[360px]'
        }`}
    >
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 p-4 bg-white">
        <div className="flex justify-between items-center">
          {!collapsed && <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Sparkles size={16} className="text-purple-500" /> FitCoach Nutrición</h3>}
          <button
            onClick={onToggle}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
          >
            {collapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex-shrink-0 ${collapsed ? 'flex flex-col gap-2 p-2' : 'grid grid-cols-4 gap-0.5 p-1'} border-b border-gray-200 bg-white`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (collapsed) onToggle();
              }}
              className={`
                ${collapsed ? 'p-2 rounded-lg' : 'flex flex-col items-center justify-center py-2 px-1 rounded'}
                text-xs font-medium transition-all relative
                ${activeTab === tab.id
                  ? 'text-indigo-700 bg-indigo-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
              `}
              title={tab.label}
            >
              <div className="relative">
                <Icon size={collapsed ? 20 : 16} />
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center">
                    {tab.count}
                  </span>
                )}
              </div>
              {!collapsed && <span className="mt-1">{tab.label}</span>}
            </button>
          );
        })}
      </div>

      {!collapsed && (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/30">
          
          {/* CHAT TAB */}
          {activeTab === 'Chat' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                    {['Sugerir cena ligera', 'Revisar macros', 'Lista de compra'].map(s => (
                        <button key={s} onClick={() => handleSendMessage(s)} className="whitespace-nowrap px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 border border-gray-200 transition-colors">
                            {s}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Pregunta a FitCoach..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button onClick={() => handleSendMessage()} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    <ArrowLeft size={18} className="rotate-180" /> {/* Send icon proxy */}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* INSIGHTS TAB */}
          {activeTab === 'Insights' && (
             <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="text-xs font-bold uppercase text-gray-500 mb-4 tracking-wider">Distribución de Macros</h4>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Proteínas</span>
                                <span className="font-bold text-gray-900">{globalMacros.proteinas}g <span className="text-gray-400 font-normal">/ {dieta?.macros.proteinas}g</span></span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: `${Math.min((globalMacros.proteinas / (dieta?.macros.proteinas || 1)) * 100, 100)}%` }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Carbohidratos</span>
                                <span className="font-bold text-gray-900">{globalMacros.carbohidratos}g <span className="text-gray-400 font-normal">/ {dieta?.macros.carbohidratos}g</span></span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: `${Math.min((globalMacros.carbohidratos / (dieta?.macros.carbohidratos || 1)) * 100, 100)}%` }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Grasas</span>
                                <span className="font-bold text-gray-900">{globalMacros.grasas}g <span className="text-gray-400 font-normal">/ {dieta?.macros.grasas}g</span></span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500" style={{ width: `${Math.min((globalMacros.grasas / (dieta?.macros.grasas || 1)) * 100, 100)}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                    <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2 mb-2">
                        <Info size={16} /> Consejo de Balance
                    </h4>
                    <p className="text-xs text-blue-800 leading-relaxed">
                        Tu ingesta de grasas está ligeramente por encima del objetivo los fines de semana. Intenta reducir aceites en la cena.
                    </p>
                </div>
             </div>
          )}

          {/* ALERTAS TAB */}
          {activeTab === 'Alertas' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {alerts.map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-lg border shadow-sm ${alert.level === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>
                        <div className="flex items-start gap-3">
                            {alert.level === 'warning' ? <AlertTriangle className="text-amber-600 shrink-0" size={18} /> : <Info className="text-blue-600 shrink-0" size={18} />}
                            <div>
                                <h5 className={`text-sm font-bold mb-1 ${alert.level === 'warning' ? 'text-amber-900' : 'text-blue-900'}`}>{alert.title}</h5>
                                <p className={`text-xs mb-3 ${alert.level === 'warning' ? 'text-amber-800' : 'text-blue-800'}`}>{alert.message}</p>
                                <button 
                                    onClick={alert.action.handler}
                                    className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
                                >
                                    {alert.action.label}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          )}

          {/* METRICAS TAB */}
          {activeTab === 'Metricas' && (
             <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm text-center">
                        <p className="text-[10px] uppercase text-gray-500 font-bold">Kcal Semanal</p>
                        <p className="text-xl font-bold text-gray-900 mt-1">14,500</p>
                        <p className="text-xs text-green-600 font-medium">En objetivo</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm text-center">
                        <p className="text-[10px] uppercase text-gray-500 font-bold">Adherencia Est.</p>
                        <p className="text-xl font-bold text-gray-900 mt-1">92%</p>
                        <p className="text-xs text-blue-600 font-medium">Alta</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Distribución Energética</h4>
                    <div className="space-y-3 text-xs text-gray-600">
                        <div className="flex justify-between">
                            <span>Desayuno</span>
                            <span className="font-semibold">20%</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Almuerzo</span>
                            <span className="font-semibold">35%</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Cena</span>
                            <span className="font-semibold">25%</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Snacks</span>
                            <span className="font-semibold">20%</span>
                        </div>
                    </div>
                </div>
             </div>
          )}

        </div>
      )}
    </aside>
  );
};

// --- Main Page Component ---

export default function DietaEditorPage() {
  const { dietaId } = useParams<{ dietaId: string }>();
  const navigate = useNavigate();
  const [dieta, setDieta] = useState<Dieta | null>(null);
  const [cargando, setCargando] = useState(true);

  // Initial State Logic
  const initialDays: Record<string, DietDay> = useMemo(() => {
    const days: Record<string, DietDay> = {};
    DIAS_SEMANA.forEach(dia => {
      days[dia.id] = {
        id: dia.id,
        nombre: dia.nombre,
        bloques: {}
      };
    });
    return days;
  }, []);

  const [dietState, setDietState] = useState<DietEditorState>({
    dias: initialDays,
    objetivosGlobales: { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 },
    isDragging: false,
    activeDragItem: null
  });

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<BibliotecaTab>('recetas');

  // --- Logic & Handlers ---

  const updateGlobalTargets = useCallback((targets: Partial<MacroNutrients>) => {
    // Logic to update global targets if needed (usually derived from data)
  }, []);

  const addItemToMeal = useCallback((dayId: string, blockId: string, item: FoodItem) => {
    setDietState(prev => {
      const newDays = { ...prev.dias };
      const day = { ...newDays[dayId] };
      
      // Ensure block exists
      if (!day.bloques[blockId]) {
        const config = BLOCKS_CONFIG.find(b => b.id === blockId);
        day.bloques[blockId] = {
          id: blockId,
          nombre: config?.nombre || blockId,
          descripcion: config?.descripcion || '',
          icono: config?.icono,
          items: []
        };
      }

      const block = { ...day.bloques[blockId] };
      // Add unique ID for the instance
      const newItem = { ...item, id: `${item.id}-${Date.now()}` };
      block.items = [...block.items, newItem];
      
      day.bloques[blockId] = block;
      newDays[dayId] = day;

      return { ...prev, dias: newDays };
    });
  }, []);

  const removeItemFromMeal = useCallback((dayId: string, blockId: string, itemId: string) => {
    setDietState(prev => {
      const newDays = { ...prev.dias };
      const day = newDays[dayId];
      if (!day || !day.bloques[blockId]) return prev;

      const block = { ...day.bloques[blockId] };
      block.items = block.items.filter(i => i.id !== itemId);
      
      day.bloques[blockId] = block;
      newDays[dayId] = day;
      
      return { ...prev, dias: newDays };
    });
  }, []);

  const setActiveDragItem = (item: any | null) => {
    setDietState(prev => ({ ...prev, activeDragItem: item, isDragging: !!item }));
  };

  // DnD Handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current;
    if (data?.type === 'library-item') {
      setActiveDragItem(data.item);
    } else if (data?.type === 'meal-item') {
      setActiveDragItem(data.item);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragItem(null);

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Library -> Meal Block
    if (activeData?.type === 'library-item' && overData?.type === 'meal-block') {
      const { dayId, blockId } = overData;
      addItemToMeal(dayId, blockId, activeData.item);
    }
  };

  // Sensors for DnD
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Load Data Effect
  useEffect(() => {
    const cargarDieta = async () => {
      if (!dietaId) return;
      setCargando(true);
      try {
        const data = await getDieta(dietaId);
        setDieta(data);
        // Here we would hydrate dietState with data.comidas
        // For mock purposes, we keep initial empty state or hydrate if needed
      } catch (error) {
        console.error('Error cargando dieta', error);
      } finally {
        setCargando(false);
      }
    };
    cargarDieta();
  }, [dietaId]);

  // Derived Stats for Right Panel
  const globalMacros = useMemo(() => {
    let totalKcal = 0, totalP = 0, totalC = 0, totalG = 0;
    let daysCount = 0;

    Object.values(dietState.dias).forEach(day => {
      let dayKcal = 0;
      Object.values(day.bloques).forEach(block => {
        block.items.forEach(item => {
          totalKcal += item.macros.calorias;
          totalP += item.macros.proteinas;
          totalC += item.macros.carbohidratos;
          totalG += item.macros.grasas;
        });
      });
      if (dayKcal > 0) daysCount++;
    });

    // Averaging over 7 days for now
    return {
      calorias: Math.round(totalKcal / 7),
      proteinas: Math.round(totalP / 7),
      carbohidratos: Math.round(totalC / 7),
      grasas: Math.round(totalG / 7)
    };
  }, [dietState.dias]);

  const contextValue: DietEditorContextType = {
    ...dietState,
    addItemToMeal,
    removeItemFromMeal,
    updateGlobalTargets,
    setActiveDragItem
  };

  return (
    <DietContext.Provider value={contextValue}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
          <TopBar
            dieta={dieta}
            onNavigateBack={() => navigate(-1)}
            globalMacros={globalMacros}
            isFitCoachOpen={!rightCollapsed}
            onToggleFitCoach={() => setRightCollapsed(!rightCollapsed)}
          />

          <div className="flex-1 flex overflow-hidden">
            <LibraryPanel
              collapsed={leftCollapsed}
              onToggle={() => setLeftCollapsed(!leftCollapsed)}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <EditorCanvas loading={cargando} />

            <RightPanel
              collapsed={rightCollapsed}
              onToggle={() => setRightCollapsed(!rightCollapsed)}
              dieta={dieta}
              globalMacros={globalMacros}
            />
          </div>

          <DragOverlay>
            {dietState.activeDragItem ? (
              <div className="bg-white p-3 rounded-lg shadow-xl border border-blue-500 opacity-90 w-64 rotate-3 cursor-grabbing">
                <h4 className="text-sm font-bold text-gray-900">{dietState.activeDragItem.nombre}</h4>
                <p className="text-xs text-gray-500">{dietState.activeDragItem.macros.calorias} kcal</p>
              </div>
            ) : null}
          </DragOverlay>
        </div>
      </DndContext>
    </DietContext.Provider>
  );
}