import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards, Button } from '../../../components/componentsreutilizables';
import {
  SuscripcionesManager,
  GestorCuotas,
  UpgradeDowngrade,
  FreezeSuscripcion,
  Multisesion,
  RenovacionesAutomaticas,
  AnalyticsSuscripciones,
  GestionSesiones,
  VisualizacionUsoSesiones,
  CambioPlanPT,
  CrearSuscripcionPrueba,
  AlertasSesionesPorCaducar,
  GestionPagosFallidos,
  RecordatoriosRenovacion,
  DescuentosPersonalizados,
  HistorialCambiosSuscripcion,
  CancelarSuscripcion,
  MetricasCompromiso,
  SuscripcionesGrupales,
  VistaClienteSuscripcion,
  PropuestaCambioRenovacion,
  TransferenciaSesiones,
  ResumenActividadSuscripciones,
  ProyeccionesIngresosRetencion,
  ExportarDatos,
} from '../components';
import {
  getSuscripciones,
  updateSuscripcion,
  cancelarSuscripcion,
  verificarReanudacionesAutomaticas,
  verificarDescuentosExpirados,
} from '../api/suscripciones';
import { verificarYEnviarRecordatorios } from '../api/recordatoriosRenovacion';
import {
  CreditCard,
  Calendar,
  TrendingUp,
  RefreshCw,
  Pause,
  Activity,
  ArrowRightLeft,
  Sparkles,
  History,
  Eye,
  XCircle,
  BarChart3,
  TrendingDown,
  ChevronDown,
} from 'lucide-react';
import { Suscripcion } from '../types';

/**
 * Página principal de Suscripciones & Cuotas Recurrentes
 * 
 * Adaptada según el rol del usuario:
 * - Entrenadores: Paquetes mensuales PT (4/8/12 sesiones/mes), pagos recurrentes 1 a 1
 * - Gimnasios: Cuotas de socios, freeze, upgrade/downgrade, multisesión
 */
export default function SuscripcionesCuotasRecurrentesPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const role = esEntrenador ? 'entrenador' : 'gimnasio';

  const [tabActiva, setTabActiva] = useState<string>('activas');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([]);
  const [, setLoading] = useState(true);
  const [suscripcionSeleccionada, setSuscripcionSeleccionada] = useState<Suscripcion | null>(null);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [mostrarCancelar, setMostrarCancelar] = useState(false);
  const [suscripcionParaCancelar, setSuscripcionParaCancelar] = useState<Suscripcion | null>(null);

  useEffect(() => {
    loadSuscripciones();
  }, [role, user?.id]);

  // Verificar reanudaciones automáticas periódicamente
  useEffect(() => {
    const verificarReanudaciones = async () => {
      try {
        const reanudadas = await verificarReanudacionesAutomaticas();
        if (reanudadas.length > 0) {
          await loadSuscripciones();
        }
      } catch (error) {
        console.error('Error verificando reanudaciones automáticas:', error);
      }
    };

    // Verificar cada 5 minutos
    const interval = setInterval(verificarReanudaciones, 5 * 60 * 1000);
    
    // Verificar al cargar
    verificarReanudaciones();

    return () => clearInterval(interval);
  }, []);

  // Verificar y enviar recordatorios de renovación periódicamente (solo para entrenadores)
  useEffect(() => {
    if (!esEntrenador) return;

    const verificarRecordatorios = async () => {
      try {
        await verificarYEnviarRecordatorios(user?.id);
      } catch (error) {
        console.error('Error verificando recordatorios de renovación:', error);
      }
    };

    // Verificar cada hora
    const interval = setInterval(verificarRecordatorios, 60 * 60 * 1000);
    
    // Verificar al cargar
    verificarRecordatorios();

    return () => clearInterval(interval);
  }, [esEntrenador, user?.id]);

  // Verificar descuentos expirados periódicamente
  useEffect(() => {
    const verificarDescuentos = async () => {
      try {
        const expirados = await verificarDescuentosExpirados();
        if (expirados.length > 0) {
          await loadSuscripciones();
        }
      } catch (error) {
        console.error('Error verificando descuentos expirados:', error);
      }
    };

    // Verificar diariamente
    const interval = setInterval(verificarDescuentos, 24 * 60 * 60 * 1000);
    
    // Verificar al cargar
    verificarDescuentos();

    return () => clearInterval(interval);
  }, []);

  const loadSuscripciones = async () => {
    setLoading(true);
    try {
      const data = await getSuscripciones(role, user?.id);
      setSuscripciones(data);
    } catch (error) {
      console.error('Error cargando suscripciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSuscripcion = async (id: string, data: any) => {
    try {
      await updateSuscripcion(id, data);
      await loadSuscripciones();
    } catch (error) {
      console.error('Error actualizando suscripción:', error);
    }
  };

  const handleCancelSuscripcion = async (id: string) => {
    const suscripcion = suscripciones.find(s => s.id === id);
    if (suscripcion) {
      setSuscripcionParaCancelar(suscripcion);
      setMostrarCancelar(true);
    }
  };

  const handleConfirmarCancelacion = async (request: { suscripcionId: string; motivo: string; comentariosAdicionales?: string }) => {
    try {
      await cancelarSuscripcion(request);
      await loadSuscripciones();
      setMostrarCancelar(false);
      setSuscripcionParaCancelar(null);
    } catch (error) {
      console.error('Error cancelando suscripción:', error);
      throw error; // Re-throw para que el componente maneje el error
    }
  };

  const handleVerHistorial = (suscripcion: Suscripcion) => {
    setSuscripcionSeleccionada(suscripcion);
    setMostrarHistorial(true);
  };

  // Métricas adaptadas según el rol
  const metricas = useMemo(() => {
    const activas = suscripciones.filter(s => s.estado === 'activa').length;
    const pausadas = suscripciones.filter(s => s.estado === 'pausada').length;
    const ingresosRecurrentes = suscripciones
      .filter(s => s.estado === 'activa')
      .reduce((sum, s) => sum + s.precio, 0);
    
    const sesionesDisponibles = esEntrenador
      ? suscripciones.reduce((sum, s) => sum + (s.sesionesDisponibles || 0), 0)
      : 0;

    return [
      {
        id: 'activas',
        title: esEntrenador ? 'Suscripciones PT' : 'Membresías Activas',
        value: activas.toString(),
        subtitle: `${suscripciones.length} total`,
        icon: <CreditCard className="w-5 h-5" />,
        color: 'success' as const,
      },
      {
        id: 'ingresos',
        title: 'Ingresos Recurrentes',
        value: `${ingresosRecurrentes.toFixed(0)} €`,
        subtitle: 'Mensual',
        icon: <TrendingUp className="w-5 h-5" />,
        color: 'primary' as const,
      },
      ...(esEntrenador
        ? [
            {
              id: 'sesiones',
              title: 'Sesiones Disponibles',
              value: sesionesDisponibles.toString(),
              subtitle: 'Total clientes',
              icon: <Calendar className="w-5 h-5" />,
              color: 'info' as const,
            },
          ]
        : [
            {
              id: 'freeze',
              title: 'En Freeze',
              value: pausadas.toString(),
              subtitle: pausadas > 0 ? 'Pausadas' : 'Todas activas',
              icon: <Pause className="w-5 h-5" />,
              color: pausadas > 0 ? ('warning' as const) : ('success' as const),
            },
          ]),
      {
        id: 'renovaciones',
        title: 'Próximas Renovaciones',
        value: suscripciones.filter(s => {
          if (!s.proximaRenovacion) return false;
          const fecha = new Date(s.proximaRenovacion);
          const hoy = new Date();
          const diffDias = (fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
          return diffDias <= 7 && diffDias >= 0;
        }).length.toString(),
        subtitle: 'Esta semana',
        icon: <RefreshCw className="w-5 h-5" />,
        color: 'info' as const,
      },
    ];
  }, [suscripciones, esEntrenador]);

  // Tabs adaptadas según el rol - Estructura base solicitada
  const tabs = useMemo(() => {
    const baseTabs = [
      {
        id: 'activas',
        label: esEntrenador ? 'Suscripciones Activas' : 'Membresías Activas',
        icon: <CreditCard className="w-4 h-4" />,
        description: esEntrenador 
          ? 'Gestiona los paquetes mensuales PT activos de tus clientes'
          : 'Gestiona las membresías activas de tus socios',
      },
      {
        id: 'renovaciones',
        label: 'Renovaciones',
        icon: <RefreshCw className="w-4 h-4" />,
        description: esEntrenador
          ? 'Próximas renovaciones y recordatorios automáticos'
          : 'Próximas renovaciones y gestión de cuotas recurrentes',
      },
      {
        id: 'sesiones',
        label: esEntrenador ? 'Sesiones' : 'Uso y Sesiones',
        icon: <Activity className="w-4 h-4" />,
        description: esEntrenador
          ? 'Gestión de sesiones disponibles, uso y transferencias'
          : 'Multisesión y uso compartido de servicios',
      },
      {
        id: 'pagos-fallidos',
        label: 'Pagos Fallidos',
        icon: <XCircle className="w-4 h-4" />,
        description: esEntrenador
          ? 'Gestiona los pagos fallidos y actualiza métodos de pago'
          : 'Gestiona los pagos fallidos y morosidad',
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: <BarChart3 className="w-4 h-4" />,
        description: esEntrenador
          ? 'Métricas de compromiso, retención y análisis de suscripciones'
          : 'Análisis de membresías, retención y métricas financieras',
      },
      {
        id: 'proyecciones',
        label: 'Proyecciones',
        icon: <TrendingDown className="w-4 h-4" />,
        description: esEntrenador
          ? 'Proyecciones de ingresos recurrentes y análisis de retención'
          : 'Proyecciones financieras y análisis de retención de socios',
      },
    ];

    return baseTabs;
  }, [esEntrenador]);

  const renderSeleccionSuscripcion = (descripcion: string) => (
    <div className="space-y-4">
      {suscripcionSeleccionada ? (
        <Card className="bg-white shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Suscripción seleccionada: {suscripcionSeleccionada.clienteNombre}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setSuscripcionSeleccionada(null)}>
              Cambiar
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <Card className="bg-white shadow-sm p-6">
            <p className="text-base text-gray-600">{descripcion}</p>
          </Card>
          <SuscripcionesManager
            suscripciones={suscripciones}
            userType={role}
            onUpdate={handleUpdateSuscripcion}
            onCancel={handleCancelSuscripcion}
            onSelect={setSuscripcionSeleccionada}
          />
        </>
      )}
    </div>
  );

  // Manejo de navegación por teclado
  const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setTabActiva(tabId);
      setMobileMenuOpen(false);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const currentIndex = tabs.findIndex(tab => tab.id === tabActiva);
      const nextIndex = e.key === 'ArrowRight' 
        ? (currentIndex + 1) % tabs.length
        : (currentIndex - 1 + tabs.length) % tabs.length;
      setTabActiva(tabs[nextIndex].id);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setTabActiva(tabs[0].id);
    } else if (e.key === 'End') {
      e.preventDefault();
      setTabActiva(tabs[tabs.length - 1].id);
    }
  };

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'activas':
        return (
          <>
            {/* Resumen de actividad como cabecera de contexto */}
            {esEntrenador && (
              <ResumenActividadSuscripciones
                entrenadorId={user?.id}
                onRefresh={loadSuscripciones}
              />
            )}
            <SuscripcionesManager
              suscripciones={suscripciones.filter(s => s.estado === 'activa')}
              userType={role}
              onUpdate={handleUpdateSuscripcion}
              onCancel={handleCancelSuscripcion}
              onSelect={handleVerHistorial}
            />
            {suscripcionSeleccionada && (
              <div className="mt-4 flex justify-end">
                <Button
                  variant="secondary"
                  onClick={() => handleVerHistorial(suscripcionSeleccionada)}
                >
                  <History className="w-4 h-4 mr-2" />
                  Ver Historial de Cambios
                </Button>
              </div>
            )}
          </>
        );
      case 'renovaciones':
        return (
          <div className="space-y-6">
            <RenovacionesAutomaticas />
            {esEntrenador && (
              <RecordatoriosRenovacion />
            )}
            <SuscripcionesManager
              suscripciones={suscripciones.filter(s => {
                if (!s.proximaRenovacion) return false;
                const fecha = new Date(s.proximaRenovacion);
                const hoy = new Date();
                const diffDias = (fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
                return diffDias <= 30 && diffDias >= 0;
              })}
              userType={role}
              onUpdate={handleUpdateSuscripcion}
              onCancel={handleCancelSuscripcion}
              onSelect={setSuscripcionSeleccionada}
            />
          </div>
        );
      case 'sesiones':
        return (
          <div className="space-y-6">
            {esEntrenador && (
              <>
                <AlertasSesionesPorCaducar
                  diasAnticipacion={7}
                  onContactarCliente={(sesion) => {
                    console.log('Contactar cliente:', sesion);
                  }}
                />
                <VisualizacionUsoSesiones
                  suscripciones={suscripciones}
                  onContactar={(suscripcion) => {
                    console.log('Contactar cliente:', suscripcion);
                  }}
                />
                {renderSeleccionSuscripcion(
                  'Selecciona una suscripción para gestionar las sesiones del paquete o ajustes de uso.'
                )}
                {suscripcionSeleccionada && (
                  <div className="space-y-6">
                    <GestionSesiones
                      suscripcion={suscripcionSeleccionada}
                      onSuccess={loadSuscripciones}
                    />
                    <TransferenciaSesiones
                      suscripcion={suscripcionSeleccionada}
                      onSuccess={loadSuscripciones}
                    />
                  </div>
                )}
              </>
            )}
            {!esEntrenador && (
              <>
                {renderSeleccionSuscripcion(
                  'Selecciona una suscripción para gestionar multisesión y uso compartido.'
                )}
                {suscripcionSeleccionada && (
                  <Multisesion
                    suscripcion={suscripcionSeleccionada}
                    onSuccess={loadSuscripciones}
                  />
                )}
              </>
            )}
          </div>
        );
      case 'pagos-fallidos':
        return (
          <div className="space-y-6">
            <GestionPagosFallidos
              onSuccess={loadSuscripciones}
            />
            <GestorCuotas 
              soloFallidasVencidas={true}
              mostrarFiltros={true}
            />
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <AnalyticsSuscripciones
              suscripciones={suscripciones}
              userType={role}
            />
            {esEntrenador && (
              <>
                <MetricasCompromiso
                  entrenadorId={user?.id}
                  onVerCliente={(clienteId) => {
                    console.log('Ver cliente:', clienteId);
                  }}
                />
                <ResumenActividadSuscripciones
                  entrenadorId={user?.id}
                  onRefresh={loadSuscripciones}
                />
              </>
            )}
            <ExportarDatos
              entrenadorId={user?.id}
            />
          </div>
        );
      case 'proyecciones':
        return (
          <div className="space-y-6">
            {esEntrenador && (
              <ProyeccionesIngresosRetencion
                entrenadorId={user?.id}
              />
            )}
            {!esEntrenador && (
              <ProyeccionesIngresosRetencion />
            )}
            <ExportarDatos
              entrenadorId={user?.id}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header con icono y título */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <CreditCard size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  {esEntrenador ? 'Suscripciones PT & Cuotas Recurrentes' : 'Suscripciones & Cuotas Recurrentes'}
                </h1>
                <p className="text-gray-600">
                  {esEntrenador
                    ? 'Gestiona los paquetes mensuales PT de tus clientes (4/8/12 sesiones/mes) y automatiza los pagos recurrentes 1 a 1.'
                    : 'Gestiona las cuotas de socios, freeze de membresías, upgrades/downgrades y multisesión. Automatiza completamente la gestión de membresías.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Métricas */}
          <MetricCards data={metricas} columns={4} />

          {/* Sistema de Tabs - Accesible y Responsive */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              {/* Desktop: mostrar todos los tabs */}
              <div
                role="tablist"
                aria-label={esEntrenador ? "Secciones de suscripciones PT" : "Secciones de membresías"}
                className="hidden md:flex items-center gap-2 rounded-2xl bg-slate-100 p-1 overflow-x-auto"
              >
                {tabs.map((tab) => {
                  const isActive = tabActiva === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setTabActiva(tab.id)}
                      onKeyDown={(e) => handleKeyDown(e, tab.id)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
                      }`}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`tabpanel-${tab.id}`}
                      id={`tab-${tab.id}`}
                      tabIndex={isActive ? 0 : -1}
                    >
                      <span className={isActive ? "opacity-100" : "opacity-70"}>
                        {tab.icon}
                      </span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Mobile: dropdown con scroll horizontal */}
              <div className="md:hidden relative">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="w-full flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                  aria-expanded={mobileMenuOpen}
                  aria-haspopup="true"
                  aria-label="Seleccionar sección"
                >
                  <div className="flex items-center gap-2">
                    {tabs.find(t => t.id === tabActiva)?.icon}
                    <span>{tabs.find(t => t.id === tabActiva)?.label}</span>
                  </div>
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {mobileMenuOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg ring-1 ring-slate-200 overflow-hidden">
                    {tabs.map((tab) => {
                      const isActive = tabActiva === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setTabActiva(tab.id);
                            setMobileMenuOpen(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setTabActiva(tab.id);
                              setMobileMenuOpen(false);
                            }
                          }}
                          className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-left transition-colors ${
                            isActive
                              ? "bg-blue-50 text-blue-700"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                          role="menuitem"
                        >
                          <span className={isActive ? "opacity-100" : "opacity-70"}>
                            {tab.icon}
                          </span>
                          <div className="flex-1">
                            <div>{tab.label}</div>
                            {tab.description && (
                              <div className="text-xs text-slate-500 mt-0.5">
                                {tab.description}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Mobile: scroll horizontal alternativo */}
              <div className="md:hidden mt-3 overflow-x-auto -mx-4 px-4 scrollbar-hide">
                <div className="flex items-center gap-2 min-w-max">
                  {tabs.map((tab) => {
                    const isActive = tabActiva === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setTabActiva(tab.id)}
                        onKeyDown={(e) => handleKeyDown(e, tab.id)}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                          isActive
                            ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                            : "text-slate-600 hover:text-slate-900 hover:bg-white/70 bg-slate-50"
                        }`}
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`tabpanel-${tab.id}`}
                        id={`tab-mobile-${tab.id}`}
                        tabIndex={isActive ? 0 : -1}
                      >
                        <span className={isActive ? "opacity-100" : "opacity-70"}>
                          {tab.icon}
                        </span>
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div 
              className="mt-6 px-4 pb-4"
              role="tabpanel"
              id={`tabpanel-${tabActiva}`}
              aria-labelledby={`tab-${tabActiva}`}
            >
              {renderTabContent()}
            </div>
          </Card>
        </div>
      </div>

      {/* Modales */}
      {suscripcionSeleccionada && (
        <HistorialCambiosSuscripcion
          suscripcion={suscripcionSeleccionada}
          isOpen={mostrarHistorial}
          onClose={() => {
            setMostrarHistorial(false);
            setSuscripcionSeleccionada(null);
          }}
        />
      )}

      {suscripcionParaCancelar && (
        <CancelarSuscripcion
          suscripcion={suscripcionParaCancelar}
          isOpen={mostrarCancelar}
          onClose={() => {
            setMostrarCancelar(false);
            setSuscripcionParaCancelar(null);
          }}
          onConfirm={handleConfirmarCancelacion}
        />
      )}
    </div>
  );
}

