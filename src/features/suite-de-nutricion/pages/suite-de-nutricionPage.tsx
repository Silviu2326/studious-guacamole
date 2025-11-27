import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Modal, Button } from '../../../components/componentsreutilizables';
import {    UtensilsCrossed, 
  BarChart3, 
  Package,
  Plus
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
  getDieta,
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

import { useNavigate } from 'react-router-dom';

export default function SuiteDeNutricionPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const navigate = useNavigate();
  
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

  // Cargar datos según la tab activa
  useEffect(() => {
    cargarDatosDietas();
  }, [filtrosDietas, tabActivaDietas]);

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
                    Suite de Nutrición
                  </h1>
                  <p className="text-gray-600">
                    {esEntrenador
                      ? 'Gestiona dietas y crea planes nutricionales personalizados para tus clientes'
                      : 'Gestiona dietas y planes nutricionales para tu gimnasio.'}
                  </p>
                </div>
              </div>
              <Button onClick={() => setMostrarAsignar(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Dieta
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          
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
    </div>
  );
}