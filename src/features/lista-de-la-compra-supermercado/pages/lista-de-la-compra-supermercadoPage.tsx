import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards, Button } from '../../../components/componentsreutilizables';
import {
  ShoppingCart,
  Sparkles,
  LayoutGrid,
  Calculator,
  Download,
  Settings,
  MapPin,
  Bell,
  FileText,
} from 'lucide-react';
import {
  ListaCompra,
  GeneradorLista,
  OrganizadorSecciones,
  CalculadoraCantidades,
  ExportLista,
  PersonalizadorLista,
  OptimizadorCompras,
  RecordatoriosLista,
} from '../components';
import { type ListaCompra as ListaCompraType, getListasCompra } from '../api';

export default function ListaDeLaCompraSupermercadoPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const [tabActiva, setTabActiva] = useState<string>('lista');
  const [listas, setListas] = useState<ListaCompraType[]>([]);
  const [listaSeleccionada, setListaSeleccionada] = useState<ListaCompraType | undefined>();
  const [mostrarGenerador, setMostrarGenerador] = useState(false);
  const [cargando, setCargando] = useState(false);

  React.useEffect(() => {
    if (!esEntrenador) return;
    cargarListas();
  }, [esEntrenador]);

  const cargarListas = async () => {
    setCargando(true);
    try {
      const data = await getListasCompra();
      setListas(data);
    } catch (error) {
      console.error('Error cargando listas:', error);
    } finally {
      setCargando(false);
    }
  };

  const tabs = [
    {
      id: 'lista',
      label: 'Listas de Compra',
      icon: ShoppingCart,
    },
    {
      id: 'generador',
      label: 'Generar',
      icon: Sparkles,
    },
    {
      id: 'organizador',
      label: 'Organizar',
      icon: LayoutGrid,
    },
    {
      id: 'calculadora',
      label: 'Calculadora',
      icon: Calculator,
    },
    {
      id: 'exportar',
      label: 'Exportar',
      icon: Download,
    },
    {
      id: 'personalizar',
      label: 'Personalizar',
      icon: Settings,
    },
    {
      id: 'optimizar',
      label: 'Optimizar',
      icon: MapPin,
    },
    {
      id: 'recordatorios',
      label: 'Recordatorios',
      icon: Bell,
    },
  ];

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'lista':
        return (
          <ListaCompra
            onGenerarNueva={() => {
              setTabActiva('generador');
              setMostrarGenerador(true);
            }}
            onEditar={(lista) => {
              setListaSeleccionada(lista);
              setTabActiva('organizador');
            }}
          />
        );
      case 'generador':
        return (
          <GeneradorLista
            onListaGenerada={(lista) => {
              setListaSeleccionada(lista);
              cargarListas();
              setTabActiva('organizador');
            }}
          />
        );
      case 'organizador':
        return listaSeleccionada ? (
          <OrganizadorSecciones
            lista={listaSeleccionada}
            onToggleMarcado={async (ingredienteId) => {
              if (listaSeleccionada) {
                const nuevosIngredientes = listaSeleccionada.ingredientes.map((ing) =>
                  ing.id === ingredienteId ? { ...ing, marcado: !ing.marcado } : ing
                );
                setListaSeleccionada({
                  ...listaSeleccionada,
                  ingredientes: nuevosIngredientes,
                });
              }
            }}
          />
        ) : (
          <Card className="p-8 text-center bg-white shadow-sm">
            <LayoutGrid size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Organizar por Secciones</h3>
            <p className="text-gray-600 mb-4">
              Selecciona una lista de compra para organizarla por secciones.
            </p>
          </Card>
        );
      case 'calculadora':
        return listaSeleccionada ? (
          <CalculadoraCantidades
            ingredientes={listaSeleccionada.ingredientes}
            numeroPersonasBase={listaSeleccionada.numeroPersonas}
            onCantidadesCalculadas={(ingredientes) => {
              if (listaSeleccionada) {
                setListaSeleccionada({
                  ...listaSeleccionada,
                  ingredientes,
                });
              }
            }}
          />
        ) : (
          <Card className="p-8 text-center bg-white shadow-sm">
            <Calculator size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Calculadora de Cantidades</h3>
            <p className="text-gray-600 mb-4">
              Selecciona una lista para calcular las cantidades.
            </p>
          </Card>
        );
      case 'exportar':
        return listaSeleccionada ? (
          <ExportLista
            lista={listaSeleccionada}
            onExportado={() => {
              alert('Lista exportada correctamente');
            }}
          />
        ) : (
          <Card className="p-8 text-center bg-white shadow-sm">
            <Download size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Exportar Lista</h3>
            <p className="text-gray-600 mb-4">
              Selecciona una lista para exportarla.
            </p>
          </Card>
        );
      case 'personalizar':
        return listaSeleccionada ? (
          <PersonalizadorLista
            lista={listaSeleccionada}
            onPersonalizada={(lista) => {
              setListaSeleccionada(lista);
              cargarListas();
            }}
          />
        ) : (
          <Card className="p-8 text-center bg-white shadow-sm">
            <Settings size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalizar Lista</h3>
            <p className="text-gray-600 mb-4">
              Selecciona una lista para personalizarla.
            </p>
          </Card>
        );
      case 'optimizar':
        return listaSeleccionada ? (
          <OptimizadorCompras lista={listaSeleccionada} />
        ) : (
          <Card className="p-8 text-center bg-white shadow-sm">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Optimizar Compras</h3>
            <p className="text-gray-600 mb-4">
              Selecciona una lista para optimizar las compras.
            </p>
          </Card>
        );
      case 'recordatorios':
        return listaSeleccionada ? (
          <RecordatoriosLista
            lista={listaSeleccionada}
            onRecordatorioConfigurado={() => {
              cargarListas();
            }}
          />
        ) : (
          <Card className="p-8 text-center bg-white shadow-sm">
            <Bell size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Recordatorios</h3>
            <p className="text-gray-600 mb-4">
              Selecciona una lista para configurar recordatorios.
            </p>
          </Card>
        );
      default:
        return null;
    }
  };

  const metricas = [
    {
      title: 'Total Listas',
      value: listas.length.toString(),
      icon: <FileText className="w-5 h-5" />,
      trend: 'up' as const,
      trendValue: '+0%',
      color: 'blue' as const,
    },
    {
      title: 'Listas Activas',
      value: listas.filter((l) => l.recordatoriosActivos).length.toString(),
      icon: <ShoppingCart className="w-5 h-5" />,
      trend: 'neutral' as const,
      trendValue: '0%',
      color: 'green' as const,
    },
    {
      title: 'Total Ingredientes',
      value: listas.reduce((total, l) => total + l.ingredientes.length, 0).toString(),
      icon: <LayoutGrid className="w-5 h-5" />,
      trend: 'up' as const,
      trendValue: '+0%',
      color: 'purple' as const,
    },
    {
      title: 'Clientes Activos',
      value: new Set(listas.map((l) => l.clienteId)).size.toString(),
      icon: <FileText className="w-5 h-5" />,
      trend: 'up' as const,
      trendValue: '+0%',
      color: 'orange' as const,
    },
  ];

  if (!esEntrenador) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <Card className="p-8 text-center bg-white shadow-sm">
            <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Acceso Restringido</h3>
            <p className="text-gray-600 mb-4">
              Este módulo está disponible solo para entrenadores personales.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <ShoppingCart size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Lista de la Compra / Supermercado
                </h1>
                <p className="text-gray-600">
                  Genera listas de compra personalizadas cliente a cliente basadas en sus dietas asignadas.
                  Organiza por secciones del supermercado para facilitar la adherencia nutricional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* KPIs de métricas */}
          <MetricCards data={metricas} />

          {/* Sistema de Tabs */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {tabs.map(({ id, label, icon: Icon }) => {
                  const activo = tabActiva === id;
                  return (
                    <button
                      key={id}
                      role="tab"
                      aria-selected={activo}
                      onClick={() => setTabActiva(id)}
                      className={[
                        'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                        activo
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      ].join(' ')}
                    >
                      <Icon
                        size={18}
                        className={activo ? 'opacity-100' : 'opacity-70'}
                      />
                      <span>{label}</span>
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

          {/* Card informativo */}
          <Card className="p-4 bg-blue-50 border-blue-200 shadow-sm">
            <div className="flex items-start space-x-3">
              <ShoppingCart size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2 text-lg">
                  Lista de Compra Personalizada
                </h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>
                    • <strong>Generación Automática:</strong> Extrae ingredientes de las dietas asignadas
                    y calcula cantidades según número de personas
                  </p>
                  <p>
                    • <strong>Organización por Secciones:</strong> Agrupa ingredientes por áreas del
                    supermercado para compra eficiente
                  </p>
                  <p>
                    • <strong>Personalización:</strong> Añade ingredientes base de despensa y ajusta
                    según preferencias del cliente
                  </p>
                  <p>
                    • <strong>Exportación Múltiple:</strong> PDF, email, app móvil o impresión
                  </p>
                  <p>
                    • <strong>Recordatorios Automáticos:</strong> Notificaciones programadas para
                    facilitar la adherencia nutricional
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

