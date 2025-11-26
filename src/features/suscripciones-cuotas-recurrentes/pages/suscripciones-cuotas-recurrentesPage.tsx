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

  const [tabActiva, setTabActiva] = useState<string>('resumen');
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

  // Tabs adaptadas según el rol
  const tabs = useMemo(() => {
    const items = [
      {
        id: 'resumen',
        label: 'Resumen',
        icon: <CreditCard className="w-4 h-4" />,
      },
      {
        id: 'pagos-automatizacion',
        label: 'Pagos & Automatización',
        icon: <RefreshCw className="w-4 h-4" />,
      },
      {
        id: 'planes-cambios',
        label: 'Planes & Cambios',
        icon: <ArrowRightLeft className="w-4 h-4" />,
      },
      {
        id: 'sesiones-uso',
        label: 'Sesiones & Uso',
        icon: <Activity className="w-4 h-4" />,
      },
      {
        id: 'retencion-freeze',
        label: 'Retención & Freeze',
        icon: <Pause className="w-4 h-4" />,
      },
      {
        id: 'analytics-reportes',
        label: 'Analytics & Reportes',
        icon: <TrendingUp className="w-4 h-4" />,
      },
    ];

    if (esEntrenador) {
      items.splice(5, 0, {
        id: 'captacion-promos',
        label: 'Captación & Promos',
        icon: <Sparkles className="w-4 h-4" />,
      });
      items.push({
        id: 'experiencia-cliente',
        label: 'Experiencia Cliente',
        icon: <Eye className="w-4 h-4" />,
      });
    }

    return items;
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

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'resumen':
        return (
          <>
            <SuscripcionesManager
              suscripciones={suscripciones}
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
      case 'pagos-automatizacion':
        return (
          <div className="space-y-6">
            <GestorCuotas />
            {esEntrenador && (
              <GestionPagosFallidos
                onSuccess={loadSuscripciones}
              />
            )}
            <RenovacionesAutomaticas />
          </div>
        );
      case 'planes-cambios':
        return (
          <div className="space-y-6">
            {renderSeleccionSuscripcion(
              'Selecciona una suscripción para gestionar cambios de plan, transferencias o ajustes individuales.'
            )}
            {suscripcionSeleccionada && (
              <div className="space-y-6">
                {esEntrenador && (
                  <>
                    <CambioPlanPT
                      suscripcion={suscripcionSeleccionada}
                      onSuccess={loadSuscripciones}
                    />
                    <TransferenciaSesiones
                      suscripcion={suscripcionSeleccionada}
                      onSuccess={loadSuscripciones}
                    />
                  </>
                )}
                {!esEntrenador && (
                  <UpgradeDowngrade
                    suscripcion={suscripcionSeleccionada}
                    onSuccess={loadSuscripciones}
                  />
                )}
              </div>
            )}
            {esEntrenador && (
              <>
                <SuscripcionesGrupales
                  entrenadorId={user?.id}
                  onRefresh={loadSuscripciones}
                />
                <PropuestaCambioRenovacion
                  onSuccess={loadSuscripciones}
                />
              </>
            )}
          </div>
        );
      case 'sesiones-uso':
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
              </>
            )}
            {renderSeleccionSuscripcion(
              esEntrenador
                ? 'Selecciona una suscripción para gestionar las sesiones del paquete o ajustes de uso.'
                : 'Selecciona una suscripción para gestionar multisesión y uso compartido.'
            )}
            {suscripcionSeleccionada && (
              <div className="space-y-6">
                {esEntrenador && (
                  <GestionSesiones
                    suscripcion={suscripcionSeleccionada}
                    onSuccess={loadSuscripciones}
                  />
                )}
                {!esEntrenador && (
                  <Multisesion
                    suscripcion={suscripcionSeleccionada}
                    onSuccess={loadSuscripciones}
                  />
                )}
              </div>
            )}
          </div>
        );
      case 'retencion-freeze':
        return (
          <div className="space-y-6">
            {renderSeleccionSuscripcion(
              esEntrenador
                ? 'Selecciona una suscripción para pausar, reanudar o gestionar estrategias de retención.'
                : 'Selecciona una suscripción para gestionar el freeze de la membresía.'
            )}
            {suscripcionSeleccionada && (
              <FreezeSuscripcion
                suscripcion={suscripcionSeleccionada}
                onSuccess={loadSuscripciones}
              />
            )}
            {esEntrenador && <RecordatoriosRenovacion />}
          </div>
        );
      case 'captacion-promos':
        if (!esEntrenador) return null;
        return (
          <div className="space-y-6">
            <CrearSuscripcionPrueba onSuccess={loadSuscripciones} />
            <DescuentosPersonalizados />
          </div>
        );
      case 'analytics-reportes':
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
                <ProyeccionesIngresosRetencion
                  entrenadorId={user?.id}
                />
                <ExportarDatos
                  entrenadorId={user?.id}
                />
              </>
            )}
          </div>
        );
      case 'experiencia-cliente':
        if (!esEntrenador) return null;
        return (
          <div className="space-y-6">
            {renderSeleccionSuscripcion(
              'Selecciona una suscripción para revisar la experiencia y vista del cliente.'
            )}
            {suscripcionSeleccionada && (
              <VistaClienteSuscripcion
                suscripcion={suscripcionSeleccionada}
              />
            )}
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

          {/* Sistema de Tabs */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTabActiva(tab.id)}
                    className={
                      tabActiva === tab.id
                        ? "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                        : "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70"
                    }
                  >
                    <span className={tabActiva === tab.id ? "opacity-100" : "opacity-70"}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6 px-4 pb-4">
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

