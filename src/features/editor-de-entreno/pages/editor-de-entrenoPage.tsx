import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Tabs, MetricCards, Table, Button, Modal } from '../../../components/componentsreutilizables';
import { EditorEntreno, EditorAvanzado } from '../components';
import { SesionEntrenamiento, getSesiones, eliminarSesion, getPlantillas } from '../api';
import { Dumbbell, Target, Plus, FileText, Trash2, Edit, Copy, Calendar } from 'lucide-react';

export default function EditorDeEntrenoPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const [tabActiva, setTabActiva] = useState<string>('editor');
  const [sesiones, setSesiones] = useState<SesionEntrenamiento[]>([]);
  const [plantillas, setPlantillas] = useState<SesionEntrenamiento[]>([]);
  const [sesionEditando, setSesionEditando] = useState<SesionEntrenamiento | null>(null);
  const [mostrarEditor, setMostrarEditor] = useState(false);
  const [sesionAEliminar, setSesionAEliminar] = useState<string | null>(null);

  // Cargar datos cuando cambiamos a tabs que los necesitan
  React.useEffect(() => {
    if (tabActiva === 'sesiones' || tabActiva === 'plantillas') {
      if (tabActiva === 'sesiones') {
        cargarSesiones();
      }
      if (tabActiva === 'plantillas') {
        cargarPlantillas();
      }
    }
  }, [tabActiva]);

  // Cargar datos iniciales solo si no estamos en el editor
  React.useEffect(() => {
    if (tabActiva !== 'editor') {
      cargarSesiones();
      cargarPlantillas();
    }
  }, []);

  const cargarSesiones = async () => {
    try {
      const data = await getSesiones();
      setSesiones(data || []);
    } catch (error) {
      console.warn('Error al cargar sesiones:', error);
      setSesiones([]);
    }
  };

  const cargarPlantillas = async () => {
    try {
      const data = await getPlantillas();
      setPlantillas(data || []);
    } catch (error) {
      console.warn('Error al cargar plantillas:', error);
      setPlantillas([]);
    }
  };

  const tabs = useMemo(
    () => [
      {
        id: 'editor',
        label: 'Editor',
        icon: <FileText className="w-4 h-4" />,
      },
      {
        id: 'sesiones',
        label: 'Mis Sesiones',
        icon: <Dumbbell className="w-4 h-4" />,
      },
      {
        id: 'plantillas',
        label: 'Plantillas',
        icon: <Target className="w-4 h-4" />,
      },
    ],
    []
  );

  const metricas = useMemo(() => [
    {
      title: 'Total Sesiones',
      value: sesiones.length.toString(),
      icon: <Dumbbell className="w-5 h-5" />,
      trend: 'up' as const,
      trendValue: '0%',
      color: 'blue' as const,
    },
    {
      title: 'Plantillas',
      value: plantillas.length.toString(),
      icon: <FileText className="w-5 h-5" />,
      trend: 'neutral' as const,
      trendValue: '0%',
      color: 'purple' as const,
    },
    {
      title: 'Sesiones Activas',
      value: sesiones.filter((s) => !s.plantilla).length.toString(),
      icon: <Target className="w-5 h-5" />,
      trend: 'up' as const,
      trendValue: '0%',
      color: 'green' as const,
    },
    {
      title: 'Ejercicios Totales',
      value: sesiones.reduce((acc, s) => acc + (s.ejercicios?.length || 0), 0).toString(),
      icon: <Calendar className="w-5 h-5" />,
      trend: 'up' as const,
      trendValue: '0%',
      color: 'yellow' as const,
    },
  ], [sesiones, plantillas]);

  const columnasSesiones = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'ejercicios', label: 'Ejercicios' },
    { key: 'duracion', label: 'Duración' },
    { key: 'acciones', label: 'Acciones' },
  ];

  const datosSesiones = sesiones.map((sesion) => ({
    nombre: sesion.nombre,
    tipo: sesion.tipo,
    ejercicios: sesion.ejercicios?.length || 0,
    duracion: sesion.duracion ? `${sesion.duracion} min` : '-',
    acciones: (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setSesionEditando(sesion);
            setMostrarEditor(true);
          }}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setSesionAEliminar(sesion.id || '')}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
  }));

  const handleGuardarSesion = (sesion: SesionEntrenamiento) => {
    cargarSesiones();
    setMostrarEditor(false);
    setSesionEditando(null);
  };

  const handleEliminar = async () => {
    if (sesionAEliminar) {
      await eliminarSesion(sesionAEliminar);
      cargarSesiones();
      setSesionAEliminar(null);
    }
  };

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'editor':
        return (
          <div>
            <Card className="p-8 text-center bg-white shadow-sm">
              <Dumbbell size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Crear Nueva Sesión de Entrenamiento
              </h3>
              <p className="text-gray-600 mb-4">
                {esEntrenador
                  ? 'Crea sesiones personalizadas para tus clientes'
                  : 'Crea sesiones para grupos, clases y programas estándar'}
              </p>
              <Button onClick={() => setMostrarEditor(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Sesión
              </Button>
            </Card>
          </div>
        );
      case 'sesiones':
        return (
          <Card className="bg-white shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Mis Sesiones
                </h3>
                <Button onClick={() => { setTabActiva('editor'); setMostrarEditor(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Sesión
                </Button>
              </div>
            </div>
            <div className="p-4">
              <Table columns={columnasSesiones} data={datosSesiones} />
            </div>
          </Card>
        );
      case 'plantillas':
        return (
          <Card className="bg-white shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Plantillas Disponibles
              </h3>
            </div>
            <div className="p-4">
              {plantillas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No hay plantillas disponibles</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plantillas.map((plantilla) => (
                    <Card key={plantilla.id} className="bg-white shadow-sm h-full flex flex-col transition-shadow overflow-hidden">
                      <div className="p-4 flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{plantilla.nombre}</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          {plantilla.ejercicios?.length || 0} ejercicios
                        </p>
                      </div>
                      <div className="px-4 pb-4">
                        <Button
                          size="sm"
                          variant="secondary"
                          fullWidth
                          onClick={() => {
                            setSesionEditando({ ...plantilla, id: undefined, nombre: `${plantilla.nombre} (Copia)` });
                            setTabActiva('editor');
                            setMostrarEditor(true);
                          }}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Usar Plantilla
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>
        );
      default:
        return null;
    }
  };

  // Si el editor avanzado está abierto, mostrar solo el editor (con su TopBar)
  if (mostrarEditor) {
    return (
      <>
        <EditorAvanzado
          sesionInicial={sesionEditando || undefined}
          clientePerfil={{
            id: user?.id || '',
            nombre: 'Cliente Ejemplo',
            tiempoSemana: 180,
            materialDisponible: ['mancuernas', 'barra', 'banco'],
            lesiones: [],
            preferencias: ['fuerza'],
            cronotipo: 'matutino',
          }}
          estadoCliente={{
            adherenciaSemana: 85,
            fatigaReportada: 'media',
            dolorActual: {
              intensidad: 'verde',
            },
          }}
          onGuardar={(sesion) => {
            handleGuardarSesion(sesion);
            setMostrarEditor(false);
          }}
          onGuardarYProgramar={(planificacion) => {
            console.log('Guardar y programar', planificacion);
            // TODO: Implementar guardado de planificación
            setMostrarEditor(false);
          }}
          onClose={() => {
            setMostrarEditor(false);
            setSesionEditando(null);
          }}
        />
        <Modal
          isOpen={!!sesionAEliminar}
          onClose={() => setSesionAEliminar(null)}
          title="Confirmar Eliminación"
          footer={
            <>
              <Button variant="secondary" onClick={() => setSesionAEliminar(null)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleEliminar}>
                Eliminar
              </Button>
            </>
          }
        >
          <p>¿Estás seguro de que deseas eliminar esta sesión?</p>
        </Modal>
      </>
    );
  }

  // Vista normal de la página (con header, métricas, tabs)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Dumbbell size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Editor de Entrenamiento
                </h1>
                <p className="text-gray-600">
                  {esEntrenador
                    ? 'Crea y gestiona sesiones de entrenamiento personalizadas para tus clientes'
                    : 'Crea sesiones para grupos, clases y programas estándar del gimnasio'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          <MetricCards data={metricas} />

          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <Tabs items={tabs} activeTab={tabActiva} onTabChange={setTabActiva} variant="pills" />
            </div>
          </Card>

          {renderTabContent()}
        </div>
      </div>

      <Modal
        isOpen={!!sesionAEliminar}
        onClose={() => setSesionAEliminar(null)}
        title="Confirmar Eliminación"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSesionAEliminar(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleEliminar}>
              Eliminar
            </Button>
          </>
        }
      >
        <p>¿Estás seguro de que deseas eliminar esta sesión?</p>
      </Modal>
    </div>
  );
}

