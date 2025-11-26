import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Modal, MetricCards } from '../../../components/componentsreutilizables';
import {
  FileText,
  Plus,
  Eye,
  Edit,
  Copy,
  Trash2,
  Share2,
  BarChart3,
  History,
} from 'lucide-react';
import {
  PlantillasDieta,
  BuscadorPlantillas,
  VisorPlantilla,
  CreadorPlantilla,
  DuplicadorPlan,
  GestorVersiones,
  AnalyticsPlantillas,
} from '../components';
import {
  getPlantillas,
  eliminarPlantilla,
  duplicarPlantilla,
  compartirPlantilla,
  crearPlantilla,
  actualizarPlantilla,
} from '../api/plantillas';
import { getEstadisticasPlantillas } from '../api/analytics';
import { PlantillaDieta as PlantillaDietaType, FiltrosPlantillas, DatosDuplicacion, EstadisticasPlantillas } from '../types';

export default function PlantillasDeDietaPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const [plantillas, setPlantillas] = useState<PlantillaDietaType[]>([]);
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<PlantillaDietaType | null>(null);
  const [filtros, setFiltros] = useState<FiltrosPlantillas>({});
  const [cargando, setCargando] = useState(false);
  const [tabActiva, setTabActiva] = useState<string>('catalogo');
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarVer, setMostrarVer] = useState(false);
  const [mostrarDuplicar, setMostrarDuplicar] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [estadisticas, setEstadisticas] = useState<EstadisticasPlantillas>({
    totalPlantillas: 0,
    plantillasPublicadas: 0,
    plantillasPrivadas: 0,
    usoTotal: 0,
    plantillaMasUsada: null,
    categoriaMasPopular: null,
    efectividadPromedio: 0,
  });

  useEffect(() => {
    cargarPlantillas();
    cargarEstadisticas();
  }, [filtros]);

  const cargarPlantillas = async () => {
    setCargando(true);
    try {
      const data = await getPlantillas(filtros);
      setPlantillas(data);
    } catch (error) {
      console.error('Error cargando plantillas:', error);
    } finally {
      setCargando(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const data = await getEstadisticasPlantillas();
      setEstadisticas(data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const handleEliminar = async (plantilla: PlantillaDietaType) => {
    if (confirm(`¿Eliminar la plantilla "${plantilla.nombre}"?`)) {
      const eliminada = await eliminarPlantilla(plantilla.id);
      if (eliminada) {
        cargarPlantillas();
        cargarEstadisticas();
      }
    }
  };

  const handleDuplicar = async (plantilla: PlantillaDietaType, datos: DatosDuplicacion) => {
    try {
      await duplicarPlantilla(plantilla.id, datos);
      setMostrarDuplicar(false);
      cargarPlantillas();
      cargarEstadisticas();
    } catch (error) {
      console.error('Error duplicando plantilla:', error);
    }
  };

  const handleCompartir = async (plantilla: PlantillaDietaType) => {
    // TODO: Implementar selector de usuarios
    const usuariosIds: string[] = [];
    const compartida = await compartirPlantilla(plantilla.id, usuariosIds);
    if (compartida) {
      alert('Plantilla compartida exitosamente');
    }
  };

  const handleGuardar = async (plantilla: Omit<PlantillaDietaType, 'id' | 'creadoEn' | 'actualizadoEn' | 'version' | 'usoCount'>) => {
    try {
      if (plantillaSeleccionada) {
        await actualizarPlantilla(plantillaSeleccionada.id, plantilla);
      } else {
        await crearPlantilla(plantilla);
      }
      setMostrarCrear(false);
      setMostrarEditar(false);
      setPlantillaSeleccionada(null);
      cargarPlantillas();
      cargarEstadisticas();
    } catch (error) {
      console.error('Error guardando plantilla:', error);
    }
  };


  const renderTabContent = () => {
    switch (tabActiva) {
      case 'catalogo':
        return (
          <div className="space-y-6">
            {/* Toolbar Superior */}
            <div className="flex items-center justify-end">
              <Button onClick={() => { setPlantillaSeleccionada(null); setMostrarCrear(true); }}>
                <Plus size={20} className="mr-2" />
                Nueva Plantilla
              </Button>
            </div>

            {/* Sistema de Filtros */}
            <BuscadorPlantillas filtros={filtros} onFiltrosChange={setFiltros} />

            {/* Controles de Vista */}
            <Card className="p-4 bg-white shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {plantillas.length} plantillas encontradas
                </span>
              </div>
            </Card>

            {/* Grid de Plantillas */}
            <PlantillasDieta
              plantillas={plantillas}
              cargando={cargando}
              onVer={(plantilla) => {
                setPlantillaSeleccionada(plantilla);
                setMostrarVer(true);
              }}
              onEditar={(plantilla) => {
                setPlantillaSeleccionada(plantilla);
                setMostrarEditar(true);
              }}
              onDuplicar={(plantilla) => {
                setPlantillaSeleccionada(plantilla);
                setMostrarDuplicar(true);
              }}
              onEliminar={handleEliminar}
            />
          </div>
        );
      case 'analytics':
        return <AnalyticsPlantillas estadisticas={estadisticas} />;
      default:
        return null;
    }
  };

  const metricas = [
    {
      title: 'Total Plantillas',
      value: estadisticas.totalPlantillas.toString(),
      icon: <FileText className="w-5 h-5" />,
      trend: 'up' as const,
      trendValue: '+0%',
      color: 'blue' as const,
    },
    {
      title: 'Plantillas Públicas',
      value: estadisticas.plantillasPublicadas.toString(),
      icon: <Share2 className="w-5 h-5" />,
      trend: 'up' as const,
      trendValue: '+0%',
      color: 'yellow' as const,
    },
    {
      title: 'Uso Total',
      value: estadisticas.usoTotal.toString(),
      icon: <Eye className="w-5 h-5" />,
      trend: 'up' as const,
      trendValue: '+0%',
      color: 'green' as const,
    },
    {
      title: 'Efectividad',
      value: `${estadisticas.efectividadPromedio}%`,
      icon: <BarChart3 className="w-5 h-5" />,
      trend: 'up' as const,
      trendValue: '+0%',
      color: 'purple' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <FileText size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Plantillas de Dieta
                </h1>
                <p className="text-gray-600">
                  Sistema de plantillas nutricionales reutilizables para estandarizar y escalar planes de alimentación
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* KPIs/Métricas */}
          <MetricCards data={metricas} />

          {/* Sistema de Tabs */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                <button
                  onClick={() => setTabActiva('catalogo')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    tabActiva === 'catalogo'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <FileText size={18} className={tabActiva === 'catalogo' ? 'opacity-100' : 'opacity-70'} />
                  <span>Catálogo</span>
                </button>
                <button
                  onClick={() => setTabActiva('analytics')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    tabActiva === 'analytics'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <BarChart3 size={18} className={tabActiva === 'analytics' ? 'opacity-100' : 'opacity-70'} />
                  <span>Analytics</span>
                </button>
              </div>
            </div>
          </Card>

          {/* Contenido de la sección activa */}
          <div className="mt-6">{renderTabContent()}</div>
        </div>
      </div>

      <Modal
        isOpen={mostrarCrear}
        onClose={() => {
          setMostrarCrear(false);
          setPlantillaSeleccionada(null);
        }}
        title="Nueva Plantilla"
        size="xl"
      >
        <CreadorPlantilla
          onGuardar={handleGuardar}
          onCancelar={() => {
            setMostrarCrear(false);
            setPlantillaSeleccionada(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={mostrarEditar}
        onClose={() => {
          setMostrarEditar(false);
          setPlantillaSeleccionada(null);
        }}
        title="Editar Plantilla"
        size="xl"
      >
        {plantillaSeleccionada && (
          <CreadorPlantilla
            plantilla={plantillaSeleccionada}
            onGuardar={handleGuardar}
            onCancelar={() => {
              setMostrarEditar(false);
              setPlantillaSeleccionada(null);
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={mostrarVer}
        onClose={() => {
          setMostrarVer(false);
          setPlantillaSeleccionada(null);
        }}
        title={plantillaSeleccionada?.nombre || 'Ver Plantilla'}
        size="xl"
      >
        {plantillaSeleccionada && (
          <VisorPlantilla
            plantilla={plantillaSeleccionada}
            onDuplicar={() => {
              setMostrarVer(false);
              setMostrarDuplicar(true);
            }}
            onCompartir={() => handleCompartir(plantillaSeleccionada)}
            onEditar={() => {
              setMostrarVer(false);
              setMostrarEditar(true);
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={mostrarDuplicar}
        onClose={() => {
          setMostrarDuplicar(false);
          setPlantillaSeleccionada(null);
        }}
        title="Duplicar Plantilla"
        size="lg"
      >
        {plantillaSeleccionada && (
          <DuplicadorPlan
            plantilla={plantillaSeleccionada}
            onDuplicar={(datos) => handleDuplicar(plantillaSeleccionada, datos)}
            onCancelar={() => {
              setMostrarDuplicar(false);
              setPlantillaSeleccionada(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

