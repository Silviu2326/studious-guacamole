import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import { Dumbbell, FileStack, FileText, List, Plus, Target, Search, Heart } from 'lucide-react';
import { ProgramasList, EditorPrograma } from '../../programas-de-entreno/components';
import { TemplateLibraryContainer, TemplateEditorModal } from '../../plantillas-de-entrenamiento/components';
import { Template } from '../../plantillas-de-entrenamiento/types';
import { createTemplate, updateTemplate } from '../../plantillas-de-entrenamiento/api';
import { BibliotecaEjercicios } from '../../biblioteca-de-ejercicios/components';
import { getCategorias } from '../../biblioteca-de-ejercicios/api/categorias';
import { getFavoritos } from '../../biblioteca-de-ejercicios/api/favoritos';
import { getAnalyticsEjercicios } from '../../biblioteca-de-ejercicios/api/ejercicios';
import { Categoria } from '../../biblioteca-de-ejercicios/types';

// Wrapper para ProgramasList que intercepta los clicks
function ProgramasListWrapper({ onProgramaClick, onNuevoPrograma }: { 
  onProgramaClick: (id: string) => void;
  onNuevoPrograma: () => void;
}) {
  useEffect(() => {
    // Interceptar clicks en botones de editar y nuevo programa
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button');
      
      if (button) {
        // Interceptar botón "Nuevo Programa"
        if (button.textContent?.includes('Nuevo Programa') || button.getAttribute('href') === '#editor') {
          e.preventDefault();
          e.stopPropagation();
          onNuevoPrograma();
          return;
        }
        
        // Interceptar botones de editar
        if (button.textContent?.includes('Editar')) {
          const href = (button as any).href || button.getAttribute('onclick');
          if (href && href.includes('id=')) {
            e.preventDefault();
            e.stopPropagation();
            const match = href.match(/id=([^&]+)/);
            if (match && match[1]) {
              onProgramaClick(match[1]);
            }
          }
        }
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [onProgramaClick, onNuevoPrograma]);

  return <ProgramasList />;
}

export default function SuiteDeEntrenoPage() {
  const { user } = useAuth();
  const isEntrenador = user?.role === 'entrenador';
  const [tabActiva, setTabActiva] = useState<string>('programas');
  const [programaEditando, setProgramaEditando] = useState<string | null>(null);
  const [mostrarEditorPlantilla, setMostrarEditorPlantilla] = useState(false);
  const [plantillaEditando, setPlantillaEditando] = useState<Template | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Estado para Biblioteca de Ejercicios
  const [bibliotecaTabActiva, setBibliotecaTabActiva] = useState<string>('biblioteca');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const [metricasBiblioteca, setMetricasBiblioteca] = useState([
    {
      id: 'total-ejercicios',
      title: 'Total Ejercicios',
      value: '0',
      color: 'info' as const,
    },
    {
      id: 'favoritos',
      title: 'Favoritos',
      value: '0',
      color: 'error' as const,
    },
    {
      id: 'categorias',
      title: 'Categorías',
      value: '0',
      color: 'success' as const,
    },
    {
      id: 'ejercicios-usados',
      title: 'Ejercicios Usados',
      value: '0',
      color: 'info' as const,
    },
  ]);

  const tabs = useMemo(
    () => [
      {
        id: 'programas',
        label: 'Programas',
        icon: <List size={18} />,
      },
      {
        id: 'plantillas',
        label: 'Plantillas',
        icon: <FileStack size={18} />,
      },
      {
        id: 'biblioteca',
        label: 'Biblioteca de Ejercicios',
        icon: <Dumbbell size={18} />,
      },
    ],
    []
  );

  // Tabs para la sección de Biblioteca de Ejercicios
  const bibliotecaTabs = useMemo(
    () => [
      {
        id: 'biblioteca',
        label: 'Biblioteca',
        icon: <Dumbbell size={18} />,
      },
      {
        id: 'favoritos',
        label: 'Favoritos',
        icon: <Heart size={18} />,
      },
      {
        id: 'categorias',
        label: 'Categorías',
        icon: <Target size={18} />,
      },
      {
        id: 'busqueda',
        label: 'Búsqueda Avanzada',
        icon: <Search size={18} />,
      },
    ],
    []
  );

  // Cargar datos de biblioteca de ejercicios
  useEffect(() => {
    if (tabActiva === 'biblioteca') {
      cargarCategorias();
      cargarMetricasBiblioteca();
      
      // Escuchar cambios en favoritos para actualizar métricas
      const handleFavoritosCambiados = () => {
        cargarMetricasBiblioteca();
      };
      
      window.addEventListener('favoritos-cambiados', handleFavoritosCambiados);
      return () => window.removeEventListener('favoritos-cambiados', handleFavoritosCambiados);
    }
  }, [tabActiva]);

  const cargarCategorias = async () => {
    const cats = await getCategorias();
    setCategorias(cats);
  };

  const cargarMetricasBiblioteca = async () => {
    try {
      const analytics = await getAnalyticsEjercicios();
      const favoritos = await getFavoritos();
      const cats = await getCategorias();
      
      setMetricasBiblioteca([
        {
          id: 'total-ejercicios',
          title: 'Total Ejercicios',
          value: analytics.totalEjercicios.toString(),
          color: 'info' as const,
        },
        {
          id: 'favoritos',
          title: 'Favoritos',
          value: favoritos.length.toString(),
          color: 'error' as const,
        },
        {
          id: 'categorias',
          title: 'Categorías',
          value: cats.length > 0 ? cats.length.toString() : '9',
          color: 'success' as const,
        },
        {
          id: 'ejercicios-usados',
          title: 'Ejercicios Usados',
          value: analytics.ejerciciosMasUsados.length.toString(),
          color: 'info' as const,
        },
      ]);
    } catch (error) {
      console.error('Error cargando métricas de biblioteca:', error);
    }
  };

  const metricas = useMemo(
    () => [
      {
        id: 'programas-activos',
        title: 'Programas Activos',
        value: '0',
        icon: <List className="w-5 h-5" />,
        trend: {
          value: 0,
          direction: 'up' as const,
        },
        color: 'primary' as const,
      },
      {
        id: 'asignaciones',
        title: isEntrenador ? 'Asignados a Clientes' : 'Asignaciones',
        value: '0',
        icon: <Dumbbell className="w-5 h-5" />,
        trend: {
          value: 0,
          direction: 'neutral' as const,
        },
        color: 'success' as const,
      },
      {
        id: 'plantillas',
        title: 'Plantillas Disponibles',
        value: '0',
        icon: <FileStack className="w-5 h-5" />,
        trend: {
          value: 0,
          direction: 'up' as const,
        },
        color: 'primary' as const,
      },
      {
        id: 'total-ejercicios-main',
        title: 'Total Ejercicios',
        value: '0',
        icon: <FileText className="w-5 h-5" />,
        trend: {
          value: 0,
          direction: 'neutral' as const,
        },
        color: 'warning' as const,
      },
    ],
    [isEntrenador]
  );

  const handleProgramaClick = (programaId: string) => {
    setProgramaEditando(programaId);
    setTabActiva('programas');
  };

  const handleCrearPlantilla = () => {
    setPlantillaEditando(null);
    setMostrarEditorPlantilla(true);
  };

  const handleEditarPlantilla = (plantilla: Template) => {
    setPlantillaEditando(plantilla);
    setMostrarEditorPlantilla(true);
  };

  const handleGuardarPlantilla = async (
    templateData: Omit<Template, 'id' | 'assignmentCount' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      if (plantillaEditando) {
        await updateTemplate(plantillaEditando.id, templateData);
      } else {
        await createTemplate(templateData);
      }
      setMostrarEditorPlantilla(false);
      setPlantillaEditando(null);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error guardando plantilla:', error);
      alert('Error al guardar la plantilla');
    }
  };

  const renderBibliotecaTabContent = () => {
    switch (bibliotecaTabActiva) {
      case 'biblioteca':
        return <BibliotecaEjercicios mostrarFiltros={true} mostrarFavoritos={true} categoriaSeleccionada={categoriaSeleccionada || undefined} />;
      case 'favoritos':
        return (
          <BibliotecaEjercicios
            mostrarFiltros={false}
            mostrarFavoritos={true}
            soloFavoritos={true}
          />
        );
      case 'categorias':
        if (categoriaSeleccionada) {
          return <BibliotecaEjercicios mostrarFiltros={true} mostrarFavoritos={true} categoriaSeleccionada={categoriaSeleccionada} />;
        }
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-white shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Selecciona una Categoría</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorias.map((categoria) => (
                  <Card
                    key={categoria.id}
                    variant="hover"
                    className="p-6 cursor-pointer transition-all hover:shadow-md"
                    onClick={() => setCategoriaSeleccionada(categoria.grupoMuscular || '')}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{categoria.icono}</div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          {categoria.nombre}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {categoria.descripcion}
                        </p>
                        <div className="text-sm font-medium text-blue-600">
                          {categoria.cantidadEjercicios || 0} ejercicios
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              {categoriaSeleccionada && (
                <div className="mt-4">
                  <button
                    onClick={() => setCategoriaSeleccionada(null)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    ← Volver a categorías
                  </button>
                </div>
              )}
            </Card>
          </div>
        );
      case 'busqueda':
        return <BibliotecaEjercicios mostrarFiltros={true} mostrarFavoritos={true} />;
      default:
        return <BibliotecaEjercicios mostrarFiltros={true} mostrarFavoritos={true} />;
    }
  };

  const renderTabContent = () => {
    if (tabActiva === 'programas') {
      return (
        <div className="space-y-6">
          {programaEditando ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setProgramaEditando(null)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ← Volver a Programas
                </button>
                <h2 className="text-xl font-semibold">
                  {programaEditando === 'new' ? 'Nuevo Programa' : 'Editando Programa'}
                </h2>
              </div>
              <EditorPrograma />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Lista de Programas</h2>
                <button
                  onClick={() => setProgramaEditando('new')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={18} />
                  Nuevo Programa
                </button>
              </div>
              <ProgramasListWrapper 
                onProgramaClick={handleProgramaClick}
                onNuevoPrograma={() => setProgramaEditando('new')}
              />
            </div>
          )}
        </div>
      );
    }

    if (tabActiva === 'plantillas') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Biblioteca de Plantillas</h2>
            <button
              onClick={handleCrearPlantilla}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus size={18} />
              Nueva Plantilla
            </button>
          </div>
          <TemplateLibraryContainer
            key={refreshKey}
            onEdit={handleEditarPlantilla}
            onCreate={handleCrearPlantilla}
          />
        </div>
      );
    }

    if (tabActiva === 'biblioteca') {
      return (
        <div className="space-y-6">
          {/* KPIs y Estadísticas de Biblioteca */}
          <div className="space-y-4">
            <MetricCards data={metricasBiblioteca} />
            
            {/* Estadísticas Adicionales */}
            {metricasBiblioteca[0]?.value !== '0' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-700 font-medium mb-1">Ejercicios Disponibles</p>
                      <p className="text-2xl font-bold text-blue-900">{metricasBiblioteca[0]?.value}</p>
                    </div>
                    <Dumbbell className="w-10 h-10 text-blue-600 opacity-50" />
                  </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-700 font-medium mb-1">En Favoritos</p>
                      <p className="text-2xl font-bold text-red-900">{metricasBiblioteca[1]?.value}</p>
                    </div>
                    <Heart className="w-10 h-10 text-red-600 opacity-50" />
                  </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-700 font-medium mb-1">Categorías</p>
                      <p className="text-2xl font-bold text-green-900">{metricasBiblioteca[2]?.value}</p>
                    </div>
                    <Target className="w-10 h-10 text-green-600 opacity-50" />
                  </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-700 font-medium mb-1">Más Usados</p>
                      <p className="text-2xl font-bold text-purple-900">{metricasBiblioteca[3]?.value}</p>
                    </div>
                    <Search className="w-10 h-10 text-purple-600 opacity-50" />
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Botón para volver cuando hay categoría seleccionada */}
          {categoriaSeleccionada && bibliotecaTabActiva === 'categorias' && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <button
                onClick={() => setCategoriaSeleccionada(null)}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
              >
                ← Volver a todas las categorías
              </button>
            </Card>
          )}

          {/* Sistema de Tabs para Biblioteca */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones de Biblioteca"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {bibliotecaTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setBibliotecaTabActiva(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      bibliotecaTabActiva === tab.id
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <span className={bibliotecaTabActiva === tab.id ? 'opacity-100' : 'opacity-70'}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Contenido de la pestaña activa de biblioteca */}
          <div className="mt-6">
            {renderBibliotecaTabContent()}
          </div>

          {/* Información adicional */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <Dumbbell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2 text-lg">
                  Catálogo Completo de Ejercicios
                </h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• <strong>Vídeos de Ejecución:</strong> Visualiza la técnica correcta de cada ejercicio</p>
                  <p>• <strong>Instrucciones Detalladas:</strong> Guía paso a paso para una ejecución segura</p>
                  <p>• <strong>Advertencias de Lesión:</strong> Precauciones y contraindicaciones específicas</p>
                  <p>• <strong>Búsqueda Avanzada:</strong> Filtros por grupos musculares, equipamiento y dificultad</p>
                </div>
              </div>
            </div>
          </Card>
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
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Dumbbell size={24} className="text-blue-600" />
              </div>

              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Suite de Entreno
                </h1>
                <p className="text-gray-600">
                  {isEntrenador
                    ? 'Gestiona programas y plantillas de entrenamiento. Crea rutinas personalizadas para tus clientes.'
                    : 'Gestiona programas y plantillas de entrenamiento para tu gimnasio.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Métricas principales */}
          <MetricCards data={metricas} />

          {/* Sistema de Tabs */}
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
                      onClick={() => {
                        setTabActiva(tab.id);
                        setProgramaEditando(null);
                        if (tab.id === 'biblioteca') {
                          setCategoriaSeleccionada(null);
                          setBibliotecaTabActiva('biblioteca');
                        }
                      }}
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

      {/* Modal de Editor de Plantilla */}
      <TemplateEditorModal
        isOpen={mostrarEditorPlantilla}
        initialData={plantillaEditando}
        onClose={() => {
          setMostrarEditorPlantilla(false);
          setPlantillaEditando(null);
        }}
        onSave={handleGuardarPlantilla}
      />
    </div>
  );
}

