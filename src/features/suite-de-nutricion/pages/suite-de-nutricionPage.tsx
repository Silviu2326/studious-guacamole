import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards, Button, Modal } from '../../../components/componentsreutilizables';
import { 
  UtensilsCrossed, 
  Edit, 
  FileText, 
  BarChart3, 
  Package,
  Calculator,
  Calendar,
  Clock,
  RefreshCcw,
  CheckCircle2,
  ShoppingCart,
  Plus,
  Eye,
  Copy,
  Trash2,
  Share2,
  History,
  Loader2,
  BookOpen,
  Heart,
  FolderOpen
} from 'lucide-react';

// Imports de Dietas Asignadas
import {
  DietasList,
  AsignacionDieta,
  PlanesNutricion,
  SeguimientoMacros,
  FotosComida,
  AnalyticsNutricion,
  PacksSemanales,
} from '../../dietas-asignadas/components';
import {
  getDietas as getDietasAsignadas,
  eliminarDieta as eliminarDietaAsignada,
  asignarDieta,
  getPlanes,
  getAnalyticsNutricion,
  getPacksSemanal,
  getSeguimientoMacros,
} from '../../dietas-asignadas/api';
import {
  Dieta as DietaAsignada,
  PlanNutricional,
  PackSemanal,
  FiltrosDietas,
  DatosAsignacion,
  AnalyticsNutricion as AnalyticsNutricionType,
  SeguimientoMacros as SeguimientoMacrosType,
} from '../../dietas-asignadas/types';

// Imports de Editor de Dieta
import {
  EditorDieta,
  CalculadoraMacros,
  PlanificadorComidas,
  HorariosComida,
  GestorSustituciones,
  ValidadorNutricional,
  GeneradorListaCompra,
} from '../../editor-de-dieta-meal-planner/components';
import { type Dieta as DietaEditor, getDietas as getDietasEditor, eliminarDieta as eliminarDietaEditor } from '../../editor-de-dieta-meal-planner/api/editor';
import { useNavigate } from 'react-router-dom';

// Imports de Plantillas de Dieta
import {
  PlantillasDieta,
  BuscadorPlantillas,
  VisorPlantilla,
  CreadorPlantilla,
  DuplicadorPlan,
  GestorVersiones,
  AnalyticsPlantillas,
} from '../../plantillas-de-dieta/components';
import {
  getPlantillas,
  eliminarPlantilla,
  duplicarPlantilla,
  compartirPlantilla,
  crearPlantilla,
  actualizarPlantilla,
} from '../../plantillas-de-dieta/api/plantillas';
import { getEstadisticasPlantillas } from '../../plantillas-de-dieta/api/analytics';
import { PlantillaDieta as PlantillaDietaType, FiltrosPlantillas, DatosDuplicacion, EstadisticasPlantillas } from '../../plantillas-de-dieta/types';

// Imports de Recetario
import {
  RecetarioList,
  VisorReceta,
  BuscadorRecetas,
  FavoritosComida,
  CreadorReceta,
  CategorizadorRecetas,
  GeneradorListaCompra as GeneradorListaCompraRecetario,
} from '../../recetario-comidas-guardadas/components';
import {
  getRecetas,
  eliminarReceta,
  compartirReceta,
  crearReceta,
  actualizarReceta,
} from '../../recetario-comidas-guardadas/api/recetas';
import { toggleFavorito } from '../../recetario-comidas-guardadas/api/favoritos';
import { Receta, FiltrosRecetas } from '../../recetario-comidas-guardadas/types';

export default function SuiteDeNutricionPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const navigate = useNavigate();
  const [tabActiva, setTabActiva] = useState<string>('dietas');
  
  // Estado para Dietas Asignadas
  const [dietasAsignadas, setDietasAsignadas] = useState<DietaAsignada[]>([]);
  const [planes, setPlanes] = useState<PlanNutricional[]>([]);
  const [packs, setPacks] = useState<PackSemanal[]>([]);
  const [dietaSeleccionadaAsignada, setDietaSeleccionadaAsignada] = useState<DietaAsignada | null>(null);
  const [planSeleccionado, setPlanSeleccionado] = useState<PlanNutricional | null>(null);
  const [filtrosDietas, setFiltrosDietas] = useState<FiltrosDietas>({});
  const [tabActivaDietas, setTabActivaDietas] = useState<string>(esEntrenador ? 'dietas' : 'planes');
  const [mostrarAsignar, setMostrarAsignar] = useState(false);
  const [mostrarVerDieta, setMostrarVerDieta] = useState(false);
  const [mostrarVerPlan, setMostrarVerPlan] = useState(false);
  const [analyticsNutricion, setAnalyticsNutricion] = useState<AnalyticsNutricionType | null>(null);
  const [seguimientoMacros, setSeguimientoMacros] = useState<SeguimientoMacrosType | null>(null);
  
  // Estado para Editor de Dieta
  const [dietasEditor, setDietasEditor] = useState<DietaEditor[]>([]);
  const [dietaSeleccionadaEditor, setDietaSeleccionadaEditor] = useState<DietaEditor | undefined>();
  const [mostrarEditor, setMostrarEditor] = useState(false);
  const [tabActivaEditor, setTabActivaEditor] = useState<string>('editor');
  
  // Estado para Plantillas de Dieta
  const [plantillas, setPlantillas] = useState<PlantillaDietaType[]>([]);
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<PlantillaDietaType | null>(null);
  const [filtrosPlantillas, setFiltrosPlantillas] = useState<FiltrosPlantillas>({});
  const [tabActivaPlantillas, setTabActivaPlantillas] = useState<string>('catalogo');
  const [mostrarCrearPlantilla, setMostrarCrearPlantilla] = useState(false);
  const [mostrarVerPlantilla, setMostrarVerPlantilla] = useState(false);
  const [mostrarDuplicarPlantilla, setMostrarDuplicarPlantilla] = useState(false);
  const [mostrarEditarPlantilla, setMostrarEditarPlantilla] = useState(false);
  const [estadisticasPlantillas, setEstadisticasPlantillas] = useState<EstadisticasPlantillas>({
    totalPlantillas: 0,
    plantillasPublicadas: 0,
    plantillasPrivadas: 0,
    usoTotal: 0,
    plantillaMasUsada: null,
    categoriaMasPopular: null,
    efectividadPromedio: 0,
  });
  
  // Estado para Recetario
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState<Receta | null>(null);
  const [filtrosRecetas, setFiltrosRecetas] = useState<FiltrosRecetas>({});
  const [tabActivaRecetario, setTabActivaRecetario] = useState<string>('catalogo');
  const [mostrarCrearReceta, setMostrarCrearReceta] = useState(false);
  const [mostrarVerReceta, setMostrarVerReceta] = useState(false);
  const [mostrarEditarReceta, setMostrarEditarReceta] = useState(false);
  const [recetasSeleccionadasLista, setRecetasSeleccionadasLista] = useState<Receta[]>([]);
  
  const [cargando, setCargando] = useState(false);

  // Datos mock para clientes
  const clientesMock = [
    { id: '1', nombre: 'María Pérez' },
    { id: '2', nombre: 'Carlos Ruiz' },
    { id: '3', nombre: 'Ana Martínez' },
    { id: '4', nombre: 'Luis García' },
    { id: '5', nombre: 'Sofia López' },
    { id: '6', nombre: 'Diego Fernández' },
    { id: '7', nombre: 'Elena Sánchez' },
    { id: '8', nombre: 'Roberto Martín' },
    { id: '9', nombre: 'Laura Torres' },
    { id: '10', nombre: 'Miguel Vargas' },
  ];

  // Tabs principales
  const tabs = useMemo(
    () => [
      {
        id: 'dietas',
        label: 'Dietas',
        icon: <UtensilsCrossed size={18} />,
      },
      {
        id: 'editor',
        label: 'Editor de Dieta',
        icon: <Edit size={18} />,
      },
      {
        id: 'plantillas',
        label: 'Plantillas',
        icon: <FileText size={18} />,
      },
      {
        id: 'recetario',
        label: 'Recetario',
        icon: <BookOpen size={18} />,
      },
    ],
    []
  );

  // Cargar datos según la tab activa
  useEffect(() => {
    if (tabActiva === 'dietas') {
      cargarDatosDietas();
    } else if (tabActiva === 'editor') {
      cargarDietasEditor();
    } else if (tabActiva === 'plantillas') {
      cargarPlantillas();
      cargarEstadisticasPlantillas();
    } else if (tabActiva === 'recetario') {
      cargarRecetas();
    }
  }, [tabActiva, filtrosDietas, filtrosPlantillas, filtrosRecetas, tabActivaDietas]);

  const cargarDatosDietas = async () => {
    setCargando(true);
    try {
      if (tabActivaDietas === 'dietas') {
        const dataDietas = await getDietasAsignadas(filtrosDietas);
        setDietasAsignadas(dataDietas);
      } else if (tabActivaDietas === 'planes') {
        const dataPlanes = await getPlanes(undefined, true);
        setPlanes(dataPlanes);
      } else if (tabActivaDietas === 'analytics') {
        const dataAnalytics = await getAnalyticsNutricion();
        setAnalyticsNutricion(dataAnalytics);
      }
    } catch (error) {
      console.error('Error cargando datos de dietas:', error);
    } finally {
      setCargando(false);
    }
  };

  const cargarDietasEditor = async () => {
    setCargando(true);
    try {
      const data = await getDietasEditor();
      setDietasEditor(data);
    } catch (error) {
      console.error('Error cargando dietas del editor:', error);
    } finally {
      setCargando(false);
    }
  };

  const cargarPlantillas = async () => {
    setCargando(true);
    try {
      const data = await getPlantillas(filtrosPlantillas);
      setPlantillas(data);
    } catch (error) {
      console.error('Error cargando plantillas:', error);
    } finally {
      setCargando(false);
    }
  };

  const cargarEstadisticasPlantillas = async () => {
    try {
      const data = await getEstadisticasPlantillas();
      setEstadisticasPlantillas(data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const cargarRecetas = async () => {
    setCargando(true);
    try {
      const data = await getRecetas(filtrosRecetas);
      setRecetas(data);
    } catch (error) {
      console.error('Error cargando recetas:', error);
    } finally {
      setCargando(false);
    }
  };

  // Handlers para Dietas Asignadas
  const handleAsignar = async (datos: DatosAsignacion) => {
    try {
      await asignarDieta(datos);
      setMostrarAsignar(false);
      cargarDatosDietas();
    } catch (error) {
      console.error('Error asignando dieta:', error);
    }
  };

  const handleEliminarDietaAsignada = async (dieta: DietaAsignada) => {
    if (confirm(`¿Eliminar la dieta "${dieta.nombre}"?`)) {
      const eliminada = await eliminarDietaAsignada(dieta.id);
      if (eliminada) {
        cargarDatosDietas();
      }
    }
  };

  const handleVerPlan = (plan: PlanNutricional) => {
    setPlanSeleccionado(plan);
    setMostrarVerPlan(true);
    getPacksSemanal(plan.id).then(setPacks).catch(console.error);
  };

  // Handlers para Editor de Dieta
  const handleEliminarDietaEditor = async (dieta: DietaEditor) => {
    if (confirm('¿Eliminar esta dieta?')) {
      const eliminada = await eliminarDietaEditor(dieta.id);
      if (eliminada) {
        cargarDietasEditor();
      }
    }
  };

  // Handlers para Plantillas
  const handleEliminarPlantilla = async (plantilla: PlantillaDietaType) => {
    if (confirm(`¿Eliminar la plantilla "${plantilla.nombre}"?`)) {
      const eliminada = await eliminarPlantilla(plantilla.id);
      if (eliminada) {
        cargarPlantillas();
        cargarEstadisticasPlantillas();
      }
    }
  };

  const handleDuplicarPlantilla = async (plantilla: PlantillaDietaType, datos: DatosDuplicacion) => {
    try {
      await duplicarPlantilla(plantilla.id, datos);
      setMostrarDuplicarPlantilla(false);
      cargarPlantillas();
      cargarEstadisticasPlantillas();
    } catch (error) {
      console.error('Error duplicando plantilla:', error);
    }
  };

  const handleCompartirPlantilla = async (plantilla: PlantillaDietaType) => {
    const usuariosIds: string[] = [];
    const compartida = await compartirPlantilla(plantilla.id, usuariosIds);
    if (compartida) {
      alert('Plantilla compartida exitosamente');
    }
  };

  const handleGuardarPlantilla = async (plantilla: Omit<PlantillaDietaType, 'id' | 'creadoEn' | 'actualizadoEn' | 'version' | 'usoCount'>) => {
    try {
      if (plantillaSeleccionada) {
        await actualizarPlantilla(plantillaSeleccionada.id, plantilla);
      } else {
        await crearPlantilla(plantilla);
      }
      setMostrarCrearPlantilla(false);
      setMostrarEditarPlantilla(false);
      setPlantillaSeleccionada(null);
      cargarPlantillas();
      cargarEstadisticasPlantillas();
    } catch (error) {
      console.error('Error guardando plantilla:', error);
    }
  };

  // Handlers para Recetario
  const handleEliminarReceta = async (receta: Receta) => {
    if (confirm(`¿Eliminar la receta "${receta.nombre}"?`)) {
      const eliminada = await eliminarReceta(receta.id);
      if (eliminada) {
        cargarRecetas();
      }
    }
  };

  const handleToggleFavoritoReceta = async (receta: Receta) => {
    await toggleFavorito(receta.id);
    await cargarRecetas();
    if (recetaSeleccionada?.id === receta.id) {
      const actualizada = await getRecetas({});
      const encontrada = actualizada.find(r => r.id === receta.id);
      if (encontrada) {
        setRecetaSeleccionada(encontrada);
      }
    }
  };

  const handleCompartirReceta = async (receta: Receta) => {
    const usuariosIds: string[] = [];
    const compartida = await compartirReceta(receta.id, usuariosIds);
    if (compartida) {
      alert('Receta compartida exitosamente');
    }
  };

  const handleGuardarReceta = async (receta: Omit<Receta, 'id' | 'creadoEn' | 'actualizadoEn' | 'usoCount'>) => {
    try {
      if (recetaSeleccionada) {
        await actualizarReceta(recetaSeleccionada.id, receta);
      } else {
        await crearReceta(receta);
      }
      setMostrarCrearReceta(false);
      setMostrarEditarReceta(false);
      setRecetaSeleccionada(null);
      cargarRecetas();
    } catch (error) {
      console.error('Error guardando receta:', error);
    }
  };

  const handleCategoriaSeleccionadaReceta = (categoria: string) => {
    setFiltrosRecetas({ ...filtrosRecetas, categoria: categoria as any });
    setTabActivaRecetario('catalogo');
  };

  // Tabs para Dietas Asignadas
  const tabsDietas = esEntrenador
    ? [
        {
          id: 'dietas',
          label: 'Mis Dietas',
          icon: <UtensilsCrossed size={18} />,
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: <BarChart3 size={18} />,
        },
      ]
    : [
        {
          id: 'planes',
          label: 'Planes Nutricionales',
          icon: <Package size={18} />,
        },
        {
          id: 'dietas',
          label: 'Dietas Asignadas',
          icon: <UtensilsCrossed size={18} />,
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: <BarChart3 size={18} />,
        },
      ];

  // Tabs para Editor de Dieta
  const tabsEditor = [
    {
      id: 'editor',
      label: 'Editor',
      icon: <Edit size={18} />,
    },
    {
      id: 'calculadora',
      label: 'Calculadora',
      icon: <Calculator size={18} />,
    },
    {
      id: 'planificador',
      label: 'Planificador',
      icon: <Calendar size={18} />,
    },
    {
      id: 'horarios',
      label: 'Horarios',
      icon: <Clock size={18} />,
    },
    {
      id: 'sustituciones',
      label: 'Sustituciones',
      icon: <RefreshCcw size={18} />,
    },
    {
      id: 'validador',
      label: 'Validador',
      icon: <CheckCircle2 size={18} />,
    },
    {
      id: 'lista-compra',
      label: 'Lista Compra',
      icon: <ShoppingCart size={18} />,
    },
  ];

  // Renderizado de contenido de Dietas Asignadas
  const renderDietasContent = () => {
    switch (tabActivaDietas) {
      case 'dietas':
        return (
          <div className="space-y-6">
            <DietasList
              dietas={dietasAsignadas}
              cargando={cargando}
              esEntrenador={esEntrenador}
              onVer={async (dieta) => {
                const { getDieta } = await import('../../dietas-asignadas/api');
                const dietaCompleta = await getDieta(dieta.id);
                setDietaSeleccionadaAsignada(dietaCompleta || dieta);
                setMostrarVerDieta(true);
                if (dieta.clienteId) {
                  const seguimiento = await getSeguimientoMacros(dieta.clienteId);
                  if (seguimiento) {
                    setSeguimientoMacros(seguimiento);
                  }
                }
              }}
              onEditar={(dieta) => {
                navigate(`/dietas-asignadas/editor/${dieta.id}`);
              }}
              onEliminar={handleEliminarDietaAsignada}
              onCrear={() => setMostrarAsignar(true)}
            />
          </div>
        );

      case 'planes':
        return (
          <div className="space-y-6">
            <PlanesNutricion
              planes={planes}
              cargando={cargando}
              onVer={handleVerPlan}
              onAsignar={(plan) => {
                setPlanSeleccionado(plan);
                setMostrarAsignar(true);
              }}
            />
          </div>
        );

      case 'analytics':
        return cargando ? (
          <Card className="p-8 text-center bg-white shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando analytics...</p>
          </Card>
        ) : analyticsNutricion ? (
          <AnalyticsNutricion analytics={analyticsNutricion} />
        ) : (
          <Card className="p-8 text-center bg-white shadow-sm">
            <p className="text-gray-600">No hay datos de analytics disponibles</p>
          </Card>
        );

      default:
        return null;
    }
  };

  // Renderizado de contenido de Editor de Dieta
  const renderEditorContent = () => {
    switch (tabActivaEditor) {
      case 'editor':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Dietas {esEntrenador ? 'Personalizadas' : 'Estandarizadas'}
              </h3>
              <Button onClick={() => { setDietaSeleccionadaEditor(undefined); setMostrarEditor(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Dieta
              </Button>
            </div>

            {cargando ? (
              <Card className="p-8 text-center bg-white shadow-sm">
                <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
                <p className="text-gray-600">Cargando...</p>
              </Card>
            ) : dietasEditor.length === 0 ? (
              <Card className="p-8 text-center bg-white shadow-sm">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay dietas creadas</h3>
                <p className="text-gray-600 mb-4">
                  Comienza creando una nueva dieta para tus clientes o planes grupales.
                </p>
                <Button onClick={() => { setDietaSeleccionadaEditor(undefined); setMostrarEditor(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Dieta
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {dietasEditor.map((dieta) => (
                  <Card key={dieta.id} variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden bg-white shadow-sm">
                    <div className="p-4 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {dieta.nombre}
                        </h4>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEliminarDietaEditor(dieta)}
                        >
                          Eliminar
                        </Button>
                      </div>
                      {dieta.descripcion && (
                        <p className="text-sm text-gray-600 mb-2">{dieta.descripcion}</p>
                      )}
                      <div className="text-xs text-gray-500 mb-3">
                        {dieta.comidas.length} comidas | Objetivo: {dieta.objetivo}
                      </div>
                      {dieta.macros && (
                        <div className="text-xs text-gray-600 space-y-1 mb-4">
                          <div>{dieta.macros.calorias} kcal</div>
                          <div>P: {dieta.macros.proteinas}g | C: {dieta.macros.carbohidratos}g | G: {dieta.macros.grasas}g</div>
                        </div>
                      )}
                      <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                        <Button
                          size="sm"
                          variant="secondary"
                          fullWidth
                          onClick={() => {
                            setDietaSeleccionadaEditor(dieta);
                            setMostrarEditor(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      case 'calculadora':
        return <CalculadoraMacros />;
      case 'planificador':
        return dietaSeleccionadaEditor ? (
          <PlanificadorComidas dieta={dietaSeleccionadaEditor} />
        ) : (
          <Card className="p-8 text-center bg-white shadow-sm">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona una dieta</h3>
            <p className="text-gray-600 mb-4">
              Selecciona una dieta para planificar las comidas semanales.
            </p>
          </Card>
        );
      case 'horarios':
        return dietaSeleccionadaEditor ? (
          <HorariosComida
            comidas={dietaSeleccionadaEditor.comidas}
            horarios={dietaSeleccionadaEditor.horarios}
            onHorarioAgregado={(horario) => {
              if (dietaSeleccionadaEditor) {
                setDietaSeleccionadaEditor({
                  ...dietaSeleccionadaEditor,
                  horarios: [...dietaSeleccionadaEditor.horarios, horario],
                });
              }
            }}
            onHorarioEliminado={(id) => {
              if (dietaSeleccionadaEditor) {
                setDietaSeleccionadaEditor({
                  ...dietaSeleccionadaEditor,
                  horarios: dietaSeleccionadaEditor.horarios.filter((h) => h.id !== id),
                });
              }
            }}
            onHorarioActualizado={(id, horario) => {
              if (dietaSeleccionadaEditor) {
                setDietaSeleccionadaEditor({
                  ...dietaSeleccionadaEditor,
                  horarios: dietaSeleccionadaEditor.horarios.map((h) =>
                    h.id === id ? { ...h, ...horario } : h
                  ),
                });
              }
            }}
          />
        ) : (
          <Card className="p-8 text-center bg-white shadow-sm">
            <Clock size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona una dieta</h3>
            <p className="text-gray-600 mb-4">
              Selecciona una dieta para configurar los horarios de comidas.
            </p>
          </Card>
        );
      case 'sustituciones':
        return dietaSeleccionadaEditor ? (
          <GestorSustituciones
            alimentos={[]}
            sustituciones={dietaSeleccionadaEditor.sustituciones}
            onSustitucionAgregada={(sustitucion) => {
              if (dietaSeleccionadaEditor) {
                setDietaSeleccionadaEditor({
                  ...dietaSeleccionadaEditor,
                  sustituciones: [...dietaSeleccionadaEditor.sustituciones, sustitucion],
                });
              }
            }}
            onSustitucionEliminada={(id) => {
              if (dietaSeleccionadaEditor) {
                setDietaSeleccionadaEditor({
                  ...dietaSeleccionadaEditor,
                  sustituciones: dietaSeleccionadaEditor.sustituciones.filter((s) => s.id !== id),
                });
              }
            }}
          />
        ) : (
          <Card className="p-8 text-center bg-white shadow-sm">
            <RefreshCcw size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona una dieta</h3>
            <p className="text-gray-600 mb-4">
              Selecciona una dieta para gestionar las sustituciones de alimentos.
            </p>
          </Card>
        );
      case 'validador':
        return dietaSeleccionadaEditor ? (
          <ValidadorNutricional dieta={dietaSeleccionadaEditor} />
        ) : (
          <Card className="p-8 text-center bg-white shadow-sm">
            <CheckCircle2 size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona una dieta</h3>
            <p className="text-gray-600 mb-4">
              Selecciona una dieta para validar su balance nutricional.
            </p>
          </Card>
        );
      case 'lista-compra':
        return dietaSeleccionadaEditor ? (
          <GeneradorListaCompra dieta={dietaSeleccionadaEditor} />
        ) : (
          <Card className="p-8 text-center bg-white shadow-sm">
            <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona una dieta</h3>
            <p className="text-gray-600 mb-4">
              Selecciona una dieta para generar la lista de compra.
            </p>
          </Card>
        );
      default:
        return null;
    }
  };

  // Renderizado de contenido de Plantillas
  const renderPlantillasContent = () => {
    switch (tabActivaPlantillas) {
      case 'catalogo':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-end">
              <Button onClick={() => { setPlantillaSeleccionada(null); setMostrarCrearPlantilla(true); }}>
                <Plus size={20} className="mr-2" />
                Nueva Plantilla
              </Button>
            </div>

            <BuscadorPlantillas filtros={filtrosPlantillas} onFiltrosChange={setFiltrosPlantillas} />

            <Card className="p-4 bg-white shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {plantillas.length} plantillas encontradas
                </span>
              </div>
            </Card>

            <PlantillasDieta
              plantillas={plantillas}
              cargando={cargando}
              onVer={(plantilla) => {
                setPlantillaSeleccionada(plantilla);
                setMostrarVerPlantilla(true);
              }}
              onEditar={(plantilla) => {
                setPlantillaSeleccionada(plantilla);
                setMostrarEditarPlantilla(true);
              }}
              onDuplicar={(plantilla) => {
                setPlantillaSeleccionada(plantilla);
                setMostrarDuplicarPlantilla(true);
              }}
              onEliminar={handleEliminarPlantilla}
            />
          </div>
        );
      case 'analytics':
        return <AnalyticsPlantillas estadisticas={estadisticasPlantillas} />;
      default:
        return null;
    }
  };

  // Renderizado principal
  const renderTabContent = () => {
    if (tabActiva === 'dietas') {
      return (
        <div className="space-y-6">
          {/* Sistema de Tabs para Dietas */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones de Dietas"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {tabsDietas.map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={tabActivaDietas === tab.id}
                    onClick={() => setTabActivaDietas(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      tabActivaDietas === tab.id
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <span className={tabActivaDietas === tab.id ? 'opacity-100' : 'opacity-70'}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <div className="mt-6">
            {renderDietasContent()}
          </div>
        </div>
      );
    }

    if (tabActiva === 'editor') {
      // Métricas para Editor
      const metricasEditor = [
        {
          id: 'total-dietas',
          title: 'Total Dietas',
          value: dietasEditor.length.toString(),
          icon: <FileText className="w-5 h-5" />,
          trend: {
            value: 0,
            direction: 'up' as const,
          },
          color: 'primary' as const,
        },
        {
          id: 'dietas-activas',
          title: 'Dietas Activas',
          value: dietasEditor.filter((d) => !d.esPlantilla).length.toString(),
          icon: <Edit className="w-5 h-5" />,
          trend: {
            value: 0,
            direction: 'neutral' as const,
          },
          color: 'success' as const,
        },
        {
          id: 'plantillas-editor',
          title: 'Plantillas',
          value: dietasEditor.filter((d) => d.esPlantilla).length.toString(),
          icon: <FileText className="w-5 h-5" />,
          trend: {
            value: 0,
            direction: 'up' as const,
          },
          color: 'primary' as const,
        },
        {
          id: 'comidas-totales',
          title: 'Comidas Totales',
          value: dietasEditor.reduce((total, d) => total + d.comidas.length, 0).toString(),
          icon: <Calendar className="w-5 h-5" />,
          trend: {
            value: 0,
            direction: 'up' as const,
          },
          color: 'warning' as const,
        },
      ];

      return (
        <div className="space-y-6">
          <MetricCards data={metricasEditor} />

          {/* Sistema de Tabs para Editor */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones del Editor"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1 overflow-x-auto"
              >
                {tabsEditor.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTabActivaEditor(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      tabActivaEditor === tab.id
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <span className={tabActivaEditor === tab.id ? 'opacity-100' : 'opacity-70'}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <div className="mt-6">
            {renderEditorContent()}
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200 shadow-sm">
            <div className="flex items-start space-x-3">
              <Edit className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2 text-lg">
                  Editor Universal de Dietas
                </h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• <strong>Calculadora de Macros:</strong> Cálculo automático basado en objetivos y características personales</p>
                  <p>• <strong>Planificador de Comidas:</strong> Organización temporal de comidas semanales</p>
                  <p>• <strong>Gestor de Horarios:</strong> Programación de comidas según preferencias</p>
                  <p>• <strong>Sustituciones:</strong> Alternativas de alimentos para flexibilidad</p>
                  <p>• <strong>Validador Nutricional:</strong> Verificación automática de balance nutricional</p>
                  <p>• <strong>Lista de Compra:</strong> Generación automática de lista de ingredientes</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    if (tabActiva === 'plantillas') {
      // Métricas para Plantillas
      const metricasPlantillas = [
        {
          id: 'total-plantillas',
          title: 'Total Plantillas',
          value: estadisticasPlantillas.totalPlantillas.toString(),
          icon: <FileText className="w-5 h-5" />,
          trend: {
            value: 0,
            direction: 'up' as const,
          },
          color: 'primary' as const,
        },
        {
          id: 'plantillas-publicas',
          title: 'Plantillas Públicas',
          value: estadisticasPlantillas.plantillasPublicadas.toString(),
          icon: <Share2 className="w-5 h-5" />,
          trend: {
            value: 0,
            direction: 'up' as const,
          },
          color: 'warning' as const,
        },
        {
          id: 'uso-total',
          title: 'Uso Total',
          value: estadisticasPlantillas.usoTotal.toString(),
          icon: <Eye className="w-5 h-5" />,
          trend: {
            value: 0,
            direction: 'up' as const,
          },
          color: 'success' as const,
        },
        {
          id: 'efectividad',
          title: 'Efectividad',
          value: `${estadisticasPlantillas.efectividadPromedio}%`,
          icon: <BarChart3 className="w-5 h-5" />,
          trend: {
            value: 0,
            direction: 'up' as const,
          },
          color: 'primary' as const,
        },
      ];

      return (
        <div className="space-y-6">
          <MetricCards data={metricasPlantillas} />

          {/* Sistema de Tabs para Plantillas */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones de Plantillas"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                <button
                  onClick={() => setTabActivaPlantillas('catalogo')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    tabActivaPlantillas === 'catalogo'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <FileText size={18} className={tabActivaPlantillas === 'catalogo' ? 'opacity-100' : 'opacity-70'} />
                  <span>Catálogo</span>
                </button>
                <button
                  onClick={() => setTabActivaPlantillas('analytics')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    tabActivaPlantillas === 'analytics'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <BarChart3 size={18} className={tabActivaPlantillas === 'analytics' ? 'opacity-100' : 'opacity-70'} />
                  <span>Analytics</span>
                </button>
              </div>
            </div>
          </Card>

          <div className="mt-6">
            {renderPlantillasContent()}
          </div>
        </div>
      );
    }

    if (tabActiva === 'recetario') {
      // Tabs para Recetario
      const tabsRecetario = [
        {
          id: 'catalogo',
          label: 'Catálogo',
          icon: <BookOpen size={18} />,
        },
        {
          id: 'favoritos',
          label: 'Favoritas',
          icon: <Heart size={18} />,
        },
        {
          id: 'categorias',
          label: 'Categorías',
          icon: <FolderOpen size={18} />,
        },
        {
          id: 'lista-compra',
          label: 'Lista de Compra',
          icon: <ShoppingCart size={18} />,
        },
      ];

      // Métricas para Recetario
      const recetasFavoritas = recetas.filter(r => r.esFavorita).length;
      const metricasRecetario = [
        {
          id: 'total-recetas',
          title: 'Total Recetas',
          value: recetas.length.toString(),
          icon: <BookOpen className="w-5 h-5" />,
          trend: {
            value: 0,
            direction: 'up' as const,
          },
          color: 'primary' as const,
        },
        {
          id: 'recetas-favoritas',
          title: 'Recetas Favoritas',
          value: recetasFavoritas.toString(),
          icon: <Heart className="w-5 h-5" />,
          trend: {
            value: 0,
            direction: 'up' as const,
          },
          color: 'error' as const,
        },
        {
          id: 'tiempo-promedio',
          title: 'Tiempo Promedio',
          value: recetas.length > 0
            ? Math.round(recetas.reduce((acc, r) => acc + r.tiempoPreparacion, 0) / recetas.length).toString()
            : '0',
          icon: <Calculator className="w-5 h-5" />,
          trend: {
            value: 0,
            direction: 'up' as const,
          },
          color: 'primary' as const,
        },
        {
          id: 'calorias-promedio',
          title: 'Calorías Promedio',
          value: recetas.length > 0
            ? Math.round(recetas.reduce((acc, r) => acc + r.caloriasPorPorcion, 0) / recetas.length).toString()
            : '0',
          icon: <Calculator className="w-5 h-5" />,
          trend: {
            value: 0,
            direction: 'up' as const,
          },
          color: 'success' as const,
        },
      ];

      // Renderizado de contenido del Recetario
      const renderRecetarioContent = () => {
        switch (tabActivaRecetario) {
          case 'catalogo':
            return (
              <div className="space-y-6">
                <BuscadorRecetas filtros={filtrosRecetas} onFiltrosChange={setFiltrosRecetas} />
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {recetas.length} recetas encontradas
                  </h3>
                  <Button onClick={() => { setRecetaSeleccionada(null); setMostrarCrearReceta(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Receta
                  </Button>
                </div>
                <RecetarioList
                  recetas={recetas}
                  cargando={cargando}
                  onVer={(receta) => {
                    setRecetaSeleccionada(receta);
                    setMostrarVerReceta(true);
                  }}
                  onEditar={(receta) => {
                    setRecetaSeleccionada(receta);
                    setMostrarEditarReceta(true);
                  }}
                  onEliminar={handleEliminarReceta}
                  onToggleFavorito={handleToggleFavoritoReceta}
                />
              </div>
            );
          case 'favoritos':
            return (
              <FavoritosComida
                onVerReceta={(receta) => {
                  setRecetaSeleccionada(receta);
                  setMostrarVerReceta(true);
                }}
                onEditarReceta={(receta) => {
                  setRecetaSeleccionada(receta);
                  setMostrarEditarReceta(true);
                }}
                onEliminarReceta={handleEliminarReceta}
                onToggleFavorito={handleToggleFavoritoReceta}
              />
            );
          case 'categorias':
            return <CategorizadorRecetas onCategoriaSeleccionada={handleCategoriaSeleccionadaReceta} />;
          case 'lista-compra':
            return (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Seleccionar Recetas
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Haz clic en las recetas para agregarlas a tu lista de compra
                  </p>
                </div>
                <RecetarioList
                  recetas={recetas}
                  cargando={cargando}
                  onVer={(receta) => {
                    setRecetaSeleccionada(receta);
                    setMostrarVerReceta(true);
                  }}
                  onToggleFavorito={(receta) => {
                    // Alternar selección en lista de compra
                    if (recetasSeleccionadasLista.some(r => r.id === receta.id)) {
                      setRecetasSeleccionadasLista(recetasSeleccionadasLista.filter(r => r.id !== receta.id));
                    } else {
                      setRecetasSeleccionadasLista([...recetasSeleccionadasLista, receta]);
                    }
                  }}
                />
                {recetasSeleccionadasLista.length > 0 && (
                  <Card className="p-4 bg-white shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recetas Seleccionadas ({recetasSeleccionadasLista.length})
                    </h3>
                    <div className="space-y-2 mb-4">
                      {recetasSeleccionadasLista.map((receta) => (
                        <div
                          key={receta.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="text-base text-gray-900">{receta.nombre}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setRecetasSeleccionadasLista(
                                recetasSeleccionadasLista.filter((r) => r.id !== receta.id)
                              )
                            }
                          >
                            Quitar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
                <GeneradorListaCompraRecetario
                  recetasSeleccionadas={recetasSeleccionadasLista}
                  onGenerar={() => {
                    alert('Lista de compra generada exitosamente');
                  }}
                />
              </div>
            );
          default:
            return null;
        }
      };

      return (
        <div className="space-y-6">
          <MetricCards data={metricasRecetario} />

          {/* Sistema de Tabs para Recetario */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones del Recetario"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {tabsRecetario.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTabActivaRecetario(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      tabActivaRecetario === tab.id
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <span className={tabActivaRecetario === tab.id ? 'opacity-100' : 'opacity-70'}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <div className="mt-6">
            {renderRecetarioContent()}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <UtensilsCrossed size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Suite de Nutrición
                </h1>
                <p className="text-gray-600">
                  {esEntrenador
                    ? 'Gestiona dietas, crea planes nutricionales personalizados, administra plantillas y recetas para tus clientes'
                    : 'Gestiona dietas, planes nutricionales, plantillas y recetas para tu gimnasio.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Sistema de Tabs Principal */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {tabs.map((tab) => {
                  const isActive = tabActiva === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setTabActiva(tab.id)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      }`}
                      aria-selected={isActive}
                      role="tab"
                    >
                      <span className={isActive ? 'opacity-100' : 'opacity-70'}>
                        {tab.icon}
                      </span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Contenido de la pestaña activa */}
          <div className="mt-6">{renderTabContent()}</div>
        </div>
      </div>

      {/* Modales para Dietas Asignadas */}
      {mostrarAsignar && (
        <AsignacionDieta
          clientes={clientesMock}
          planes={planes}
          esEntrenador={esEntrenador}
          onSubmit={handleAsignar}
          onCancel={() => {
            setMostrarAsignar(false);
            setPlanSeleccionado(null);
          }}
        />
      )}

      {mostrarVerDieta && dietaSeleccionadaAsignada && (
        <Modal
          isOpen={mostrarVerDieta}
          onClose={() => {
            setMostrarVerDieta(false);
            setDietaSeleccionadaAsignada(null);
          }}
          title={dietaSeleccionadaAsignada.nombre}
          size="lg"
        >
          <div className="space-y-6">
            <Card className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-1">
                    Cliente
                  </div>
                  <div className="text-base font-semibold text-gray-900">
                    {dietaSeleccionadaAsignada.clienteNombre || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-1">
                    Adherencia
                  </div>
                  <div className="text-base font-semibold text-gray-900">
                    {dietaSeleccionadaAsignada.adherencia !== undefined ? `${dietaSeleccionadaAsignada.adherencia}%` : 'N/A'}
                  </div>
                </div>
              </div>
            </Card>

            {dietaSeleccionadaAsignada.fotosComida && dietaSeleccionadaAsignada.fotosComida.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Fotos de Comida
                </h3>
                <FotosComida
                  fotos={dietaSeleccionadaAsignada.fotosComida}
                  onValidar={(fotoId, validada) => {
                    console.log('Validar foto:', fotoId, validada);
                  }}
                />
              </div>
            )}

            {seguimientoMacros && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Seguimiento de Macros
                </h3>
                <SeguimientoMacros seguimiento={seguimientoMacros} />
              </div>
            )}
          </div>
        </Modal>
      )}

      {mostrarVerPlan && planSeleccionado && (
        <Modal
          isOpen={mostrarVerPlan}
          onClose={() => {
            setMostrarVerPlan(false);
            setPlanSeleccionado(null);
          }}
          title={planSeleccionado.nombre}
          size="lg"
        >
          <div className="space-y-6">
            <Card className="p-4">
              <div className="text-base text-gray-600 mb-4">
                {planSeleccionado.descripcion}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-1">
                    Nivel
                  </div>
                  <div className="text-base font-semibold text-gray-900">
                    {planSeleccionado.nivel}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-1">
                    Calorías
                  </div>
                  <div className="text-base font-semibold text-gray-900">
                    {planSeleccionado.macros.calorias} kcal
                  </div>
                </div>
              </div>
            </Card>

            {packs.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Packs Semanales
                </h3>
                <PacksSemanales
                  packs={packs}
                  onVer={(pack) => {
                    console.log('Ver pack:', pack);
                  }}
                />
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal para Editor de Dieta */}
      <Modal
        isOpen={mostrarEditor}
        onClose={() => setMostrarEditor(false)}
        title={dietaSeleccionadaEditor ? 'Editar Dieta' : 'Nueva Dieta'}
        size="xl"
      >
        <EditorDieta
          dieta={dietaSeleccionadaEditor}
          onGuardar={(dieta) => {
            setMostrarEditor(false);
            cargarDietasEditor();
            if (!dietaSeleccionadaEditor) {
              setDietaSeleccionadaEditor(dieta);
            }
          }}
          onCancelar={() => setMostrarEditor(false)}
        />
      </Modal>

      {/* Modales para Plantillas */}
      <Modal
        isOpen={mostrarCrearPlantilla}
        onClose={() => {
          setMostrarCrearPlantilla(false);
          setPlantillaSeleccionada(null);
        }}
        title="Nueva Plantilla"
        size="xl"
      >
        <CreadorPlantilla
          onGuardar={handleGuardarPlantilla}
          onCancelar={() => {
            setMostrarCrearPlantilla(false);
            setPlantillaSeleccionada(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={mostrarEditarPlantilla}
        onClose={() => {
          setMostrarEditarPlantilla(false);
          setPlantillaSeleccionada(null);
        }}
        title="Editar Plantilla"
        size="xl"
      >
        {plantillaSeleccionada && (
          <CreadorPlantilla
            plantilla={plantillaSeleccionada}
            onGuardar={handleGuardarPlantilla}
            onCancelar={() => {
              setMostrarEditarPlantilla(false);
              setPlantillaSeleccionada(null);
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={mostrarVerPlantilla}
        onClose={() => {
          setMostrarVerPlantilla(false);
          setPlantillaSeleccionada(null);
        }}
        title={plantillaSeleccionada?.nombre || 'Ver Plantilla'}
        size="xl"
      >
        {plantillaSeleccionada && (
          <VisorPlantilla
            plantilla={plantillaSeleccionada}
            onDuplicar={() => {
              setMostrarVerPlantilla(false);
              setMostrarDuplicarPlantilla(true);
            }}
            onCompartir={() => handleCompartirPlantilla(plantillaSeleccionada)}
            onEditar={() => {
              setMostrarVerPlantilla(false);
              setMostrarEditarPlantilla(true);
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={mostrarDuplicarPlantilla}
        onClose={() => {
          setMostrarDuplicarPlantilla(false);
          setPlantillaSeleccionada(null);
        }}
        title="Duplicar Plantilla"
        size="lg"
      >
        {plantillaSeleccionada && (
          <DuplicadorPlan
            plantilla={plantillaSeleccionada}
            onDuplicar={(datos) => handleDuplicarPlantilla(plantillaSeleccionada, datos)}
            onCancelar={() => {
              setMostrarDuplicarPlantilla(false);
              setPlantillaSeleccionada(null);
            }}
          />
        )}
      </Modal>

      {/* Modales para Recetario */}
      <Modal
        isOpen={mostrarCrearReceta}
        onClose={() => {
          setMostrarCrearReceta(false);
          setRecetaSeleccionada(null);
        }}
        title="Nueva Receta"
        size="xl"
      >
        <CreadorReceta
          onGuardar={handleGuardarReceta}
          onCancelar={() => {
            setMostrarCrearReceta(false);
            setRecetaSeleccionada(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={mostrarEditarReceta}
        onClose={() => {
          setMostrarEditarReceta(false);
          setRecetaSeleccionada(null);
        }}
        title="Editar Receta"
        size="xl"
      >
        {recetaSeleccionada && (
          <CreadorReceta
            receta={recetaSeleccionada}
            onGuardar={handleGuardarReceta}
            onCancelar={() => {
              setMostrarEditarReceta(false);
              setRecetaSeleccionada(null);
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={mostrarVerReceta}
        onClose={() => {
          setMostrarVerReceta(false);
          setRecetaSeleccionada(null);
        }}
        title={recetaSeleccionada?.nombre || 'Ver Receta'}
        size="xl"
      >
        {recetaSeleccionada && (
          <VisorReceta
            receta={recetaSeleccionada}
            onEditar={() => {
              setMostrarVerReceta(false);
              setMostrarEditarReceta(true);
            }}
            onCompartir={() => handleCompartirReceta(recetaSeleccionada)}
            onToggleFavorito={() => handleToggleFavoritoReceta(recetaSeleccionada)}
          />
        )}
      </Modal>
    </div>
  );
}

