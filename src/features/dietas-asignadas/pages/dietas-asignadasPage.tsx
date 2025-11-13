import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Modal } from '../../../components/componentsreutilizables';
import {
  UtensilsCrossed,
  BarChart3,
  Package,
  Search,
  FileSpreadsheet,
  Settings,
  History,
  LayoutGrid,
  Bell,
  ShoppingCart,
} from 'lucide-react';
import {
  DietasList,
  AsignacionDieta,
  PlanesNutricion,
  SeguimientoMacros,
  FotosComida,
  AnalyticsNutricion,
  PacksSemanales,
  MetricasDieta,
  ConfiguracionMetricas,
  BuscadorUnificado,
  SugerenciasInteligentes,
  FeedbackClienteComida,
  AlertasSobrecarga,
  CuestionarioMetodologia,
  VistaExcelConfigurada,
  DashboardCompacto,
  AsistenteInteligentePanel,
  ProximaComidaPanel,
  AccionesRapidasContextuales,
  TimelineHitos,
  PlanesContingencia,
  InsightsSaludGlobal,
  ContenidoEducativoPanel,
  BalanceoMacrosIA,
  GestorReglasPersonalizadas,
  GestorAutomatizacionesEventos,
  GestorConexionesExternas,
  GeneradorPlanesAlternativos,
  GeneradorReportes,
  GestorVersiones,
  GestorEncuestasRapidas,
  GestorPermisosColaboradores,
  HistorialBloque,
  ConfiguracionTemaFuente,
  ConfiguracionDensidadLayout,
  ConfiguracionNotificaciones,
  ImportadorDatosSeguimiento,
  GestorCalendarioCliente,
  GestorExportacionDashboards,
  NotificacionesSincronizacionDatos,
} from '../components';
import {
  getDietas,
  eliminarDieta,
  asignarDieta,
  getPlanes,
  getAnalyticsNutricion,
  getPacksSemanal,
  getSeguimientoMacros,
  getCuestionarioMetodologia,
  getPreferenciasTemaFuente,
  aplicarPreferenciasTemaFuente,
  getPreferenciasDensidadLayout,
  aplicarPreferenciasDensidadLayout,
} from '../api';
import {
  Dieta,
  PlanNutricional,
  PackSemanal,
  FiltrosDietas,
  DatosAsignacion,
  AnalyticsNutricion as AnalyticsNutricionType,
  SeguimientoMacros as SeguimientoMacrosType,
  PreferenciasMetricas,
  RespuestaCuestionarioMetodologia,
  ResultadoActualizacionValores,
  PlanAlternativo,
} from '../types';
import { useNavigate } from 'react-router-dom';

export default function DietasAsignadasPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const navigate = useNavigate();

  const [dietas, setDietas] = useState<Dieta[]>([]);
  const [planes, setPlanes] = useState<PlanNutricional[]>([]);
  const [packs, setPacks] = useState<PackSemanal[]>([]);
  const [dietaSeleccionada, setDietaSeleccionada] = useState<Dieta | null>(null);
  const [planSeleccionado, setPlanSeleccionado] = useState<PlanNutricional | null>(null);
  const [filtros] = useState<FiltrosDietas>({});
  const [cargando, setCargando] = useState(false);
  const [tabActiva, setTabActiva] = useState<string>(esEntrenador ? 'dietas' : 'planes');
  const [mostrarAsignar, setMostrarAsignar] = useState(false);
  const [mostrarVerDieta, setMostrarVerDieta] = useState(false);
  const [mostrarVerPlan, setMostrarVerPlan] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsNutricionType | null>(null);
  const [seguimientoMacros, setSeguimientoMacros] = useState<SeguimientoMacrosType | null>(null);
  const [preferenciasMetricas, setPreferenciasMetricas] = useState<PreferenciasMetricas | null>(null);
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [clienteIdSeleccionado, setClienteIdSeleccionado] = useState<string | undefined>(undefined);
  const [mostrarCuestionario, setMostrarCuestionario] = useState(false);
  const [modoReaperturaCuestionario, setModoReaperturaCuestionario] = useState(false);
  const [cuestionarioMetodologia, setCuestionarioMetodologia] = useState<RespuestaCuestionarioMetodologia | null>(null);
  const [mostrarVistaExcel, setMostrarVistaExcel] = useState(false);
  const [mostrarConfiguracionTema, setMostrarConfiguracionTema] = useState(false);
  const [mostrarHistorialBloque, setMostrarHistorialBloque] = useState(false);
  const [bloqueSeleccionadoHistorial, setBloqueSeleccionadoHistorial] = useState<{ id: string; nombre?: string } | null>(null);
  const [mostrarConfiguracionDensidad, setMostrarConfiguracionDensidad] = useState(false);
  const [mostrarConfiguracionNotificaciones, setMostrarConfiguracionNotificaciones] = useState(false);

  // Datos mock para clientes - en producción vendría de la API
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

  useEffect(() => {
    cargarDatos();
    // Cargar cuestionario de metodología si existe
    if (user?.id) {
      getCuestionarioMetodologia(user.id).then((cuestionario) => {
        if (cuestionario) {
          setCuestionarioMetodologia(cuestionario);
        }
      });
      // Cargar y aplicar preferencias de tema y fuente
      getPreferenciasTemaFuente(user.id).then((prefs) => {
        aplicarPreferenciasTemaFuente(prefs);
      });
      // Cargar y aplicar preferencias de densidad de layout
      getPreferenciasDensidadLayout(user.id).then((prefs) => {
        aplicarPreferenciasDensidadLayout(prefs);
      });
    }
  }, [filtros, tabActiva, user?.id]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      if (tabActiva === 'dietas') {
        const dataDietas = await getDietas(filtros);
        setDietas(dataDietas);
      } else if (tabActiva === 'planes') {
        const dataPlanes = await getPlanes(undefined, true);
        setPlanes(dataPlanes);
      } else if (tabActiva === 'analytics') {
        const dataAnalytics = await getAnalyticsNutricion();
        setAnalytics(dataAnalytics);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleAsignar = async (datos: DatosAsignacion) => {
    try {
      await asignarDieta(datos);
      setMostrarAsignar(false);
      cargarDatos();
    } catch (error) {
      console.error('Error asignando dieta:', error);
    }
  };

  const handleEliminar = async (dieta: Dieta) => {
    if (confirm(`¿Eliminar la dieta "${dieta.nombre}"?`)) {
      const eliminada = await eliminarDieta(dieta.id);
      if (eliminada) {
        cargarDatos();
      }
    }
  };

  const handleVerPlan = (plan: PlanNutricional) => {
    setPlanSeleccionado(plan);
    setMostrarVerPlan(true);
    // Cargar packs del plan
    getPacksSemanal(plan.id).then(setPacks).catch(console.error);
  };

  const tabs = esEntrenador
    ? [
        {
          id: 'dietas',
          label: 'Mis Dietas',
          icon: <UtensilsCrossed size={18} />,
        },
        {
          id: 'lista-compra',
          label: 'Lista de Compra',
          icon: <ShoppingCart size={18} />,
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
          id: 'lista-compra',
          label: 'Lista de Compra',
          icon: <ShoppingCart size={18} />,
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: <BarChart3 size={18} />,
        },
      ];

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'dietas':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div />
              <ConfiguracionMetricas
                onSave={(prefs) => {
                  setPreferenciasMetricas(prefs);
                }}
              />
            </div>
            <DietasList
              dietas={dietas}
              cargando={cargando}
              esEntrenador={esEntrenador}
              onVer={async (dieta) => {
                const { getDieta } = await import('../api');
                const dietaCompleta = await getDieta(dieta.id);
                setDietaSeleccionada(dietaCompleta || dieta);
                setMostrarVerDieta(true);
                // Cargar seguimiento de macros si está disponible
                if (dieta.clienteId) {
                  const seguimiento = await getSeguimientoMacros(dieta.clienteId);
                  if (seguimiento) {
                    setSeguimientoMacros(seguimiento);
                  }
                }
                // Cargar preferencias de métricas si están disponibles
                const { getPreferenciasMetricas } = await import('../utils/preferenciasMetricas');
                const prefs = getPreferenciasMetricas(dieta.clienteId);
                if (prefs) {
                  setPreferenciasMetricas(prefs);
                }
              }}
              onEditar={(dieta) => {
                navigate(`/dietas-asignadas/editor/${dieta.id}`);
              }}
              onEliminar={handleEliminar}
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

      case 'lista-compra':
        return (
          <div className="space-y-6">
            <GeneradorListaCompra
              clienteId={clienteIdSeleccionado}
              dietaId={dietaSeleccionada?.id}
              onListaGenerada={(lista) => {
                console.log('Lista generada:', lista);
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
        ) : analytics ? (
          <AnalyticsNutricion analytics={analytics} />
        ) : (
          <Card className="p-8 text-center bg-white shadow-sm">
            <p className="text-gray-600">No hay datos de analytics disponibles</p>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <UtensilsCrossed size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    {esEntrenador ? 'Dietas Asignadas' : 'Gestión de Dietas y Planes'}
                  </h1>
                  <p className="text-gray-600">
                    {esEntrenador
                      ? 'Gestiona las dietas individuales de tus clientes'
                      : 'Administra planes nutricionales y dietas asignadas a socios'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* User Story 1: Conectar con apps externas */}
                <GestorConexionesExternas
                  dieta={dietaSeleccionada || undefined}
                  onValoresActualizados={(resultado) => {
                    console.log('Valores actualizados:', resultado);
                    // Recargar dieta si está seleccionada
                    if (dietaSeleccionada) {
                      const { getDieta } = require('../api');
                      getDieta(dietaSeleccionada.id).then((dieta: Dieta | null) => {
                        if (dieta) {
                          setDietaSeleccionada(dieta);
                          // Actualizar en la lista también
                          setDietas((prev) =>
                            prev.map((d) => (d.id === dieta.id ? dieta : d))
                          );
                        }
                      });
                    }
                  }}
                />
                
                {/* User Story 1: Exportar a dashboards externos */}
                {dietaSeleccionada && (
                  <GestorExportacionDashboards
                    dieta={dietaSeleccionada}
                    onExportacionExitosa={(resultado) => {
                      console.log('Exportación exitosa:', resultado);
                    }}
                  />
                )}
                
                {/* User Story 2: Notificaciones de sincronización de datos */}
                {dietaSeleccionada && (
                  <NotificacionesSincronizacionDatos
                    dieta={dietaSeleccionada}
                    onDatosVinculados={(datosId) => {
                      console.log('Datos vinculados al plan:', datosId);
                      // Recargar dieta
                      if (dietaSeleccionada) {
                        const { getDieta } = require('../api');
                        getDieta(dietaSeleccionada.id).then((dieta: Dieta | null) => {
                          if (dieta) {
                            setDietaSeleccionada(dieta);
                            setDietas((prev) =>
                              prev.map((d) => (d.id === dieta.id ? dieta : d))
                            );
                          }
                        });
                      }
                    }}
                  />
                )}
                
                {/* User Story 2: Generar planes alternativos */}
                {dietaSeleccionada && (
                  <GeneradorPlanesAlternativos
                    dieta={dietaSeleccionada}
                    onPlanAplicado={(plan) => {
                      console.log('Plan alternativo aplicado:', plan);
                      // Recargar dieta
                      const { getDieta } = require('../api');
                      getDieta(dietaSeleccionada.id).then((dieta: Dieta | null) => {
                        if (dieta) {
                          setDietaSeleccionada(dieta);
                          setDietas((prev) =>
                            prev.map((d) => (d.id === dieta.id ? dieta : d))
                          );
                        }
                      });
                    }}
                  />
                )}
                
                {cuestionarioMetodologia && (
                  <button
                    onClick={() => {
                      setModoReaperturaCuestionario(true);
                      setMostrarCuestionario(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    title="Reabrir cuestionario de metodología"
                  >
                    <Settings size={18} />
                    <span className="hidden sm:inline">Reabrir Cuestionario</span>
                  </button>
                )}
                {!cuestionarioMetodologia && (
                  <button
                    onClick={() => {
                      setModoReaperturaCuestionario(false);
                      setMostrarCuestionario(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    title="Configurar vista Excel"
                  >
                    <FileSpreadsheet size={18} />
                    <span className="hidden sm:inline">Configurar Vista Excel</span>
                  </button>
                )}
                {/* User Story 1: Configuración de densidad de layout */}
                <button
                  onClick={() => setMostrarConfiguracionDensidad(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  title="Personalizar densidad del layout"
                >
                  <LayoutGrid size={18} />
                  <span className="hidden sm:inline">Densidad</span>
                </button>
                {/* User Story 2: Configuración de notificaciones */}
                <button
                  onClick={() => setMostrarConfiguracionNotificaciones(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  title="Configurar notificaciones"
                >
                  <Bell size={18} />
                  <span className="hidden sm:inline">Notificaciones</span>
                </button>
                {/* User Story 2: Configuración de tema y fuente */}
                <button
                  onClick={() => setMostrarConfiguracionTema(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  title="Configurar tema y tamaño de fuente"
                >
                  <Settings size={18} />
                  <span className="hidden sm:inline">Tema</span>
                </button>
                <button
                  onClick={() => setMostrarBuscador(!mostrarBuscador)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Búsqueda unificada"
                >
                  <Search size={18} />
                  <span className="hidden sm:inline">Búsqueda Unificada</span>
                </button>
              </div>
            </div>
            
            {/* Buscador Unificado */}
            {mostrarBuscador && (
              <div className="mt-4">
                <BuscadorUnificado
                  onSeleccionar={(resultado) => {
                    console.log('Recurso seleccionado:', resultado);
                    // Aquí puedes manejar la selección del recurso
                    // Por ejemplo, abrir un modal, navegar a una página, etc.
                    alert(`Has seleccionado: ${resultado.titulo} (${resultado.tipo})`);
                  }}
                  placeholder="Buscar plantillas, recetas, alimentos, bloques y snacks..."
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Sugerencias Inteligentes */}
        <div className="mb-6">
          <SugerenciasInteligentes
            clienteId={clienteIdSeleccionado}
            onSeleccionarRecurso={(recurso) => {
              console.log('Recurso seleccionado desde sugerencias:', recurso);
              // Aquí puedes navegar a la receta o abrir un modal
              alert(`Has seleccionado: ${recurso.nombre}`);
            }}
            onPreferenciaGuardada={() => {
              // Recargar sugerencias después de guardar preferencia
              console.log('Preferencia guardada, el asistente aprenderá de esta acción');
            }}
          />
        </div>

        <Card className="p-0 bg-white shadow-sm">
          {/* Sistema de Tabs */}
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
            >
              {tabs.map((tab) => {
                const activo = tabActiva === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activo}
                    onClick={() => setTabActiva(tab.id)}
                    className={[
                      'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                      activo
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    ].join(' ')}
                  >
                    {React.cloneElement(tab.icon, {
                      size: 18,
                      className: activo ? 'opacity-100' : 'opacity-70'
                    })}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Contenido de la pestaña activa */}
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>

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

      {mostrarVerDieta && dietaSeleccionada && (
        <Modal
          isOpen={mostrarVerDieta}
          onClose={() => {
            setMostrarVerDieta(false);
            setDietaSeleccionada(null);
            setPreferenciasMetricas(null);
          }}
          title={dietaSeleccionada.nombre}
          size="xl"
        >
          <div className="space-y-6">
            {/* Configuración de métricas */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ConfiguracionMetricas
                  clienteId={dietaSeleccionada.clienteId}
                  clienteNombre={dietaSeleccionada.clienteNombre}
                  onSave={(prefs) => {
                    setPreferenciasMetricas(prefs);
                  }}
                />
              </div>
            </div>

            {/* Acciones Rápidas Contextuales (User Story 2) */}
            <div className="mb-6">
              <AccionesRapidasContextuales
                dieta={dietaSeleccionada}
                onAccionCompletada={() => {
                  // Recargar datos después de completar una acción
                  cargarDatos();
                }}
              />
            </div>

            {/* Próxima Comida Relevante (User Story 2) */}
            <div className="mb-6">
              <ProximaComidaPanel
                dieta={dietaSeleccionada}
                clienteId={dietaSeleccionada.clienteId}
              />
            </div>

            {/* Timeline de Hitos y Tareas Pendientes (User Story 1) */}
            <div className="mb-6">
              <TimelineHitos
                dietaId={dietaSeleccionada.id}
                clienteId={dietaSeleccionada.clienteId}
                onHitoClick={(hito) => {
                  console.log('Hito clickeado:', hito);
                  // Aquí se puede abrir un modal o navegar a detalles del hito
                }}
                onTareaCompletada={(tarea) => {
                  console.log('Tarea completada:', tarea);
                  // Recargar datos si es necesario
                }}
              />
            </div>

            {/* Planes de Contingencia (User Story 2) */}
            <div className="mb-6">
              <PlanesContingencia
                dietaId={dietaSeleccionada.id}
                clienteId={dietaSeleccionada.clienteId}
                onPlanAplicado={(plan) => {
                  console.log('Plan de contingencia aplicado:', plan);
                  // Recargar dieta después de aplicar plan
                  cargarDatos();
                }}
              />
            </div>

            {/* User Story 1: Importador de Datos de Seguimiento */}
            <div className="mb-6">
              <ImportadorDatosSeguimiento
                dieta={dietaSeleccionada}
                clienteId={dietaSeleccionada.clienteId}
                onDatosImportados={() => {
                  cargarDatos();
                }}
              />
            </div>

            {/* User Story 2: Gestor de Calendario del Cliente */}
            <div className="mb-6">
              <GestorCalendarioCliente
                dieta={dietaSeleccionada}
                clienteId={dietaSeleccionada.clienteId}
                onRecordatoriosActualizados={() => {
                  cargarDatos();
                }}
              />
            </div>

            {/* Dashboard Compacto y Asistente Inteligente - Layout de dos columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Dashboard Compacto - 2 columnas */}
              <div className="lg:col-span-2">
                <DashboardCompacto dieta={dietaSeleccionada} />
              </div>

              {/* Asistente Inteligente Panel - 1 columna */}
              <div className="lg:col-span-1">
                <AsistenteInteligentePanel
                  dieta={dietaSeleccionada}
                  onAccion={(insightId, accion) => {
                    console.log('Acción del insight:', insightId, accion);
                    // Aquí se pueden implementar las acciones específicas
                    alert(`Acción: ${accion} para insight ${insightId}`);
                  }}
                />
              </div>
            </div>

            {/* Métricas clave de la dieta */}
            <MetricasDieta 
              dieta={dietaSeleccionada}
              preferencias={preferenciasMetricas || undefined}
            />

            {/* Insights de Salud Global (User Story 1) */}
            <div className="mb-6">
              <InsightsSaludGlobal dieta={dietaSeleccionada} />
            </div>

            {/* Contenido Educativo Sugerido (User Story 2) */}
            <div className="mb-6">
              <ContenidoEducativoPanel dieta={dietaSeleccionada} />
            </div>

            <Card className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-1">
                    Cliente
                  </div>
                  <div className="text-base font-semibold text-gray-900">
                    {dietaSeleccionada.clienteNombre || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-1">
                    Adherencia
                  </div>
                  <div className="text-base font-semibold text-gray-900">
                    {dietaSeleccionada.adherencia !== undefined ? `${dietaSeleccionada.adherencia}%` : 'N/A'}
                  </div>
                </div>
              </div>
            </Card>

            {dietaSeleccionada.fotosComida && dietaSeleccionada.fotosComida.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Fotos de Comida
                </h3>
                <FotosComida
                  fotos={dietaSeleccionada.fotosComida}
                  onValidar={(fotoId, validada) => {
                    console.log('Validar foto:', fotoId, validada);
                    // TODO: Implementar validación
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

            {/* User Story 1: Encuestas Rápidas */}
            <div className="mb-6">
              <GestorEncuestasRapidas
                dietaId={dietaSeleccionada.id}
                clienteId={dietaSeleccionada.clienteId}
                clienteNombre={dietaSeleccionada.clienteNombre}
                onEncuestaCreada={() => {
                  cargarDatos();
                }}
              />
            </div>

            {/* User Story 2: Permisos de Colaboradores */}
            <div className="mb-6">
              <GestorPermisosColaboradores
                dietaId={dietaSeleccionada.id}
                dietaNombre={dietaSeleccionada.nombre}
                onPermisoAsignado={() => {
                  cargarDatos();
                }}
              />
            </div>

            {/* Alertas de Sobrecarga (User Story 2) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Alertas de Sobrecarga
              </h3>
              <AlertasSobrecarga
                dieta={dietaSeleccionada}
                onBloqueAplicado={() => {
                  // Recargar dieta después de aplicar bloque
                  cargarDatos();
                }}
              />
            </div>

            {/* Balanceo Automático de Macros con IA (User Story 1) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Balanceo Automático de Macros
              </h3>
              <BalanceoMacrosIA
                dieta={dietaSeleccionada}
                onDietaActualizada={(dietaActualizada) => {
                  setDietaSeleccionada(dietaActualizada);
                  cargarDatos();
                }}
              />
            </div>

            {/* Generador de Reportes (User Story 1) */}
            <div className="mb-6">
              <GeneradorReportes
                dieta={dietaSeleccionada}
              />
            </div>

            {/* Gestor de Versiones (User Story 2) */}
            <div className="mb-6">
              <GestorVersiones
                dieta={dietaSeleccionada}
                onVersionRecuperada={() => {
                  // Recargar dieta después de recuperar versión
                  cargarDatos();
                }}
              />
            </div>

            {/* Reglas Personalizadas (User Story 2) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Reglas Personalizadas
              </h3>
              <GestorReglasPersonalizadas
                dietaId={dietaSeleccionada.id}
                onReglaEjecutada={() => {
                  // Recargar dieta después de ejecutar regla
                  cargarDatos();
                }}
              />
            </div>

            {/* USER STORY 2: Automatizaciones Activadas por Eventos */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Automatizaciones Activadas por Eventos
              </h3>
              <GestorAutomatizacionesEventos
                dietaId={dietaSeleccionada.id}
                clienteId={dietaSeleccionada.clienteId}
                onReglaCreada={() => {
                  // Recargar datos después de crear regla
                  cargarDatos();
                }}
                onReglaActualizada={() => {
                  // Recargar datos después de actualizar regla
                  cargarDatos();
                }}
              />
            </div>

            {/* Feedback del Cliente por Comida (User Story 1) */}
            {dietaSeleccionada.comidas && dietaSeleccionada.comidas.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Feedback del Cliente por Comida
                </h3>
                <div className="space-y-4">
                  {dietaSeleccionada.comidas.slice(0, 5).map((comida) => (
                    <div key={comida.id}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {comida.nombre} ({comida.tipo})
                        </span>
                        {/* User Story 1: Botón para ver historial del bloque */}
                        <button
                          onClick={() => {
                            setBloqueSeleccionadoHistorial({ id: comida.id, nombre: comida.nombre });
                            setMostrarHistorialBloque(true);
                          }}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                          title="Ver historial de este bloque"
                        >
                          <History className="w-3 h-3" />
                          Historial
                        </button>
                      </div>
                      <FeedbackClienteComida
                        comida={comida}
                        dietaId={dietaSeleccionada.id}
                        clienteId={dietaSeleccionada.clienteId}
                        onAjusteAplicado={() => {
                          // Recargar dieta después de aplicar ajuste
                          cargarDatos();
                        }}
                      />
                    </div>
                  ))}
                </div>
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
                    // TODO: Implementar visualización de pack
                  }}
                />
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Cuestionario de Metodología */}
      {mostrarCuestionario && user?.id && (
        <CuestionarioMetodologia
          dietistaId={user.id}
          modoReapertura={modoReaperturaCuestionario}
          onCompletado={(cuestionario) => {
            setCuestionarioMetodologia(cuestionario);
            setMostrarCuestionario(false);
            setModoReaperturaCuestionario(false);
            // Si hay una dieta seleccionada, mostrar la vista Excel
            if (dietaSeleccionada) {
              setMostrarVistaExcel(true);
            }
          }}
          onCancelar={() => {
            setMostrarCuestionario(false);
            setModoReaperturaCuestionario(false);
          }}
        />
      )}

      {/* Vista Excel Configurada */}
      {mostrarVistaExcel && dietaSeleccionada && cuestionarioMetodologia && (
        <Modal
          isOpen={mostrarVistaExcel}
          onClose={() => setMostrarVistaExcel(false)}
          title="Vista Excel Configurada"
          size="xl"
        >
          <VistaExcelConfigurada
            dieta={dietaSeleccionada}
            configuracion={cuestionarioMetodologia}
            dietistaId={user?.id}
            onReabrirCuestionario={() => {
              setMostrarVistaExcel(false);
              setModoReaperturaCuestionario(true);
              setMostrarCuestionario(true);
            }}
            onConfiguracionCambiada={(nuevaConfiguracion) => {
              setCuestionarioMetodologia(nuevaConfiguracion);
            }}
          />
        </Modal>
      )}

      {/* User Story 1: Modal de Configuración de Densidad de Layout */}
      {mostrarConfiguracionDensidad && (
        <Modal
          isOpen={mostrarConfiguracionDensidad}
          onClose={() => setMostrarConfiguracionDensidad(false)}
          title="Personalizar Densidad del Layout"
          size="lg"
        >
          <ConfiguracionDensidadLayout
            onClose={() => setMostrarConfiguracionDensidad(false)}
          />
        </Modal>
      )}

      {/* User Story 2: Modal de Configuración de Notificaciones */}
      {mostrarConfiguracionNotificaciones && (
        <Modal
          isOpen={mostrarConfiguracionNotificaciones}
          onClose={() => setMostrarConfiguracionNotificaciones(false)}
          title="Configuración de Notificaciones"
          size="lg"
        >
          <ConfiguracionNotificaciones
            onClose={() => setMostrarConfiguracionNotificaciones(false)}
          />
        </Modal>
      )}

      {/* User Story 2: Modal de Configuración de Tema y Fuente */}
      {mostrarConfiguracionTema && (
        <Modal
          isOpen={mostrarConfiguracionTema}
          onClose={() => setMostrarConfiguracionTema(false)}
          title="Configuración de Tema y Fuente"
          size="lg"
        >
          <ConfiguracionTemaFuente
            onClose={() => setMostrarConfiguracionTema(false)}
          />
        </Modal>
      )}

      {/* User Story 1: Modal de Historial de Bloque */}
      {mostrarHistorialBloque && bloqueSeleccionadoHistorial && dietaSeleccionada && (
        <Modal
          isOpen={mostrarHistorialBloque}
          onClose={() => {
            setMostrarHistorialBloque(false);
            setBloqueSeleccionadoHistorial(null);
          }}
          title={`Historial: ${bloqueSeleccionadoHistorial.nombre || 'Bloque'}`}
          size="xl"
        >
          <HistorialBloque
            bloqueId={bloqueSeleccionadoHistorial.id}
            bloqueNombre={bloqueSeleccionadoHistorial.nombre}
            dietaId={dietaSeleccionada.id}
            onClose={() => {
              setMostrarHistorialBloque(false);
              setBloqueSeleccionadoHistorial(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}

