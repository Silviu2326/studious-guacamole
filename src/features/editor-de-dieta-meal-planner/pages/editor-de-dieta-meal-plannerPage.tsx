import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Tabs, MetricCards, Button, Modal } from '../../../components/componentsreutilizables';
import { 
  Edit, 
  Calculator, 
  Calendar, 
  Clock, 
  RefreshCcw, 
  CheckCircle2, 
  ShoppingCart,
  Plus,
  FileText,
  Loader2
} from 'lucide-react';
import {
  EditorDieta,
  CalculadoraMacros,
  PlanificadorComidas,
  HorariosComida,
  GestorSustituciones,
  ValidadorNutricional,
  GeneradorListaCompra,
} from '../components';
import { type Dieta, getDietas, eliminarDieta } from '../api/editor';
import { ds } from '../../adherencia/ui/ds';

export default function EditorDietaMealPlannerPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const [tabActiva, setTabActiva] = useState<string>('editor');
  const [dietas, setDietas] = useState<Dieta[]>([]);
  const [dietaSeleccionada, setDietaSeleccionada] = useState<Dieta | undefined>();
  const [mostrarEditor, setMostrarEditor] = useState(false);
  const [cargando, setCargando] = useState(false);

  React.useEffect(() => {
    cargarDietas();
  }, []);

  const cargarDietas = async () => {
    setCargando(true);
    try {
      const data = await getDietas();
      setDietas(data);
    } catch (error) {
      console.error('Error cargando dietas:', error);
    } finally {
      setCargando(false);
    }
  };

  const tabs = [
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

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'editor':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Dietas {esEntrenador ? 'Personalizadas' : 'Estandarizadas'}
              </h3>
              <Button onClick={() => { setDietaSeleccionada(undefined); setMostrarEditor(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Dieta
              </Button>
            </div>

            {cargando ? (
              <Card className="p-8 text-center bg-white shadow-sm">
                <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
                <p className="text-gray-600">Cargando...</p>
              </Card>
            ) : dietas.length === 0 ? (
              <Card className="p-8 text-center bg-white shadow-sm">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay dietas creadas</h3>
                <p className="text-gray-600 mb-4">
                  Comienza creando una nueva dieta para tus clientes o planes grupales.
                </p>
                <Button onClick={() => { setDietaSeleccionada(undefined); setMostrarEditor(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Dieta
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {dietas.map((dieta) => (
                  <Card key={dieta.id} variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden bg-white shadow-sm">
                    <div className="p-4 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {dieta.nombre}
                        </h4>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={async () => {
                            if (confirm('¿Eliminar esta dieta?')) {
                              const eliminada = await eliminarDieta(dieta.id);
                              if (eliminada) {
                                cargarDietas();
                              }
                            }
                          }}
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
                            setDietaSeleccionada(dieta);
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
        return dietaSeleccionada ? (
          <PlanificadorComidas dieta={dietaSeleccionada} />
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
        return dietaSeleccionada ? (
          <HorariosComida
            comidas={dietaSeleccionada.comidas}
            horarios={dietaSeleccionada.horarios}
            onHorarioAgregado={(horario) => {
              if (dietaSeleccionada) {
                setDietaSeleccionada({
                  ...dietaSeleccionada,
                  horarios: [...dietaSeleccionada.horarios, horario],
                });
              }
            }}
            onHorarioEliminado={(id) => {
              if (dietaSeleccionada) {
                setDietaSeleccionada({
                  ...dietaSeleccionada,
                  horarios: dietaSeleccionada.horarios.filter((h) => h.id !== id),
                });
              }
            }}
            onHorarioActualizado={(id, horario) => {
              if (dietaSeleccionada) {
                setDietaSeleccionada({
                  ...dietaSeleccionada,
                  horarios: dietaSeleccionada.horarios.map((h) =>
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
        return dietaSeleccionada ? (
          <GestorSustituciones
            alimentos={[]} // TODO: cargar alimentos
            sustituciones={dietaSeleccionada.sustituciones}
            onSustitucionAgregada={(sustitucion) => {
              if (dietaSeleccionada) {
                setDietaSeleccionada({
                  ...dietaSeleccionada,
                  sustituciones: [...dietaSeleccionada.sustituciones, sustitucion],
                });
              }
            }}
            onSustitucionEliminada={(id) => {
              if (dietaSeleccionada) {
                setDietaSeleccionada({
                  ...dietaSeleccionada,
                  sustituciones: dietaSeleccionada.sustituciones.filter((s) => s.id !== id),
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
        return dietaSeleccionada ? (
          <ValidadorNutricional dieta={dietaSeleccionada} />
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
        return dietaSeleccionada ? (
          <GeneradorListaCompra dieta={dietaSeleccionada} />
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

  const metricas = [
    {
      title: 'Total Dietas',
      value: dietas.length.toString(),
      icon: <FileText className="w-5 h-5" />,
      trend: 'up' as const,
      trendValue: '+0%',
      color: 'blue' as const,
    },
    {
      title: 'Dietas Activas',
      value: dietas.filter((d) => !d.esPlantilla).length.toString(),
      icon: <Edit className="w-5 h-5" />,
      trend: 'neutral' as const,
      trendValue: '0%',
      color: 'green' as const,
    },
    {
      title: 'Plantillas',
      value: dietas.filter((d) => d.esPlantilla).length.toString(),
      icon: <FileText className="w-5 h-5" />,
      trend: 'up' as const,
      trendValue: '+0%',
      color: 'purple' as const,
    },
    {
      title: 'Comidas Totales',
      value: dietas.reduce((total, d) => total + d.comidas.length, 0).toString(),
      icon: <Calendar className="w-5 h-5" />,
      trend: 'up' as const,
      trendValue: '+0%',
      color: 'orange' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Edit size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Editor de Dieta y Meal Planner
                </h1>
                <p className="text-gray-600">
                  {esEntrenador
                    ? 'Crea dietas personalizadas con macros específicos y planificación nutricional completa para tus clientes'
                    : 'Herramienta universal para crear dietas estandarizadas con planificación nutricional para planes grupales'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          <MetricCards data={metricas} />

          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1 overflow-x-auto"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTabActiva(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      tabActiva === tab.id
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <span className={tabActiva === tab.id ? 'opacity-100' : 'opacity-70'}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <div className="mt-6">{renderTabContent()}</div>

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
      </div>

      <Modal
        isOpen={mostrarEditor}
        onClose={() => setMostrarEditor(false)}
        title={dietaSeleccionada ? 'Editar Dieta' : 'Nueva Dieta'}
        size="xl"
      >
        <EditorDieta
          dieta={dietaSeleccionada}
          onGuardar={(dieta) => {
            setMostrarEditor(false);
            cargarDietas();
            if (!dietaSeleccionada) {
              setDietaSeleccionada(dieta);
            }
          }}
          onCancelar={() => setMostrarEditor(false)}
        />
      </Modal>
    </div>
  );
}

