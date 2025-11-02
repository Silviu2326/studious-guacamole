import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Modal } from '../../../components/componentsreutilizables';
import {
  UtensilsCrossed,
  BarChart3,
  Package,
} from 'lucide-react';
import {
  DietasList,
  AsignacionDieta,
  PlanesNutricion,
  SeguimientoMacros,
  FotosComida,
  AnalyticsNutricion,
  PacksSemanales,
} from '../components';
import {
  getDietas,
  eliminarDieta,
  asignarDieta,
  getPlanes,
  getAnalyticsNutricion,
  getPacksSemanal,
  getSeguimientoMacros,
} from '../api';
import {
  Dieta,
  PlanNutricional,
  PackSemanal,
  FiltrosDietas,
  DatosAsignacion,
  AnalyticsNutricion as AnalyticsNutricionType,
  SeguimientoMacros as SeguimientoMacrosType,
} from '../types';

export default function DietasAsignadasPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';

  const [dietas, setDietas] = useState<Dieta[]>([]);
  const [planes, setPlanes] = useState<PlanNutricional[]>([]);
  const [packs, setPacks] = useState<PackSemanal[]>([]);
  const [dietaSeleccionada, setDietaSeleccionada] = useState<Dieta | null>(null);
  const [planSeleccionado, setPlanSeleccionado] = useState<PlanNutricional | null>(null);
  const [filtros, setFiltros] = useState<FiltrosDietas>({});
  const [cargando, setCargando] = useState(false);
  const [tabActiva, setTabActiva] = useState<string>(esEntrenador ? 'dietas' : 'planes');
  const [mostrarAsignar, setMostrarAsignar] = useState(false);
  const [mostrarVerDieta, setMostrarVerDieta] = useState(false);
  const [mostrarVerPlan, setMostrarVerPlan] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsNutricionType | null>(null);
  const [seguimientoMacros, setSeguimientoMacros] = useState<SeguimientoMacrosType | null>(null);

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
  }, [filtros, tabActiva]);

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

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'dietas':
        return (
          <div className="space-y-6">
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
              }}
              onEditar={esEntrenador ? undefined : (dieta) => {
                setDietaSeleccionada(dieta);
                // TODO: Implementar edición
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
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
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
          }}
          title={dietaSeleccionada.nombre}
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
    </div>
  );
}

