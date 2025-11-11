import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Tabs, MetricCards, Button } from '../../../components/componentsreutilizables';
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
  deleteSuscripcion,
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
  ArrowUpDown,
  Pause,
  Layers,
  Activity,
  ArrowRightLeft,
  Sparkles,
  AlertTriangle,
  XCircle,
  Bell,
  Percent,
  History,
  Users,
  Eye,
  Send,
  ArrowRight,
  BarChart3,
  Download,
  LineChart,
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

  const [tabActiva, setTabActiva] = useState<string>('suscripciones');
  const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([]);
  const [loading, setLoading] = useState(true);
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
    const comunes = [
      {
        id: 'suscripciones',
        label: esEntrenador ? 'Mis Suscripciones PT' : 'Suscripciones',
        icon: <CreditCard className="w-4 h-4" />,
      },
      {
        id: 'cuotas',
        label: 'Cuotas Recurrentes',
        icon: <CreditCard className="w-4 h-4" />,
      },
      {
        id: 'renovaciones',
        label: 'Renovaciones',
        icon: <RefreshCw className="w-4 h-4" />,
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: <TrendingUp className="w-4 h-4" />,
      },
    ];

    // Para entrenadores: añadir tabs de suscripciones de prueba, freeze, gestión de sesiones, visualización de uso y cambio de plan
    if (esEntrenador) {
      comunes.splice(1, 0, {
        id: 'crear-prueba',
        label: 'Suscripciones de Prueba',
        icon: <Sparkles className="w-4 h-4" />,
      });
      comunes.splice(2, 0, {
        id: 'alertas-sesiones',
        label: 'Alertas Sesiones',
        icon: <AlertTriangle className="w-4 h-4" />,
      });
      comunes.splice(3, 0, {
        id: 'pagos-fallidos',
        label: 'Pagos Fallidos',
        icon: <XCircle className="w-4 h-4" />,
      });
      comunes.splice(4, 0, {
        id: 'visualizacion-uso',
        label: 'Uso de Sesiones',
        icon: <Activity className="w-4 h-4" />,
      });
      comunes.splice(5, 0, {
        id: 'cambio-plan',
        label: 'Cambiar Plan',
        icon: <ArrowRightLeft className="w-4 h-4" />,
      });
      comunes.splice(6, 0, {
        id: 'freeze',
        label: 'Pausar Suscripción',
        icon: <Pause className="w-4 h-4" />,
      });
      comunes.splice(7, 0, {
        id: 'gestion-sesiones',
        label: 'Gestión de Sesiones',
        icon: <Layers className="w-4 h-4" />,
      });
      comunes.splice(8, 0, {
        id: 'recordatorios-renovacion',
        label: 'Recordatorios Renovación',
        icon: <Bell className="w-4 h-4" />,
      });
      comunes.splice(9, 0, {
        id: 'descuentos',
        label: 'Descuentos Personalizados',
        icon: <Percent className="w-4 h-4" />,
      });
      comunes.splice(10, 0, {
        id: 'metricas-compromiso',
        label: 'Métricas de Compromiso',
        icon: <Activity className="w-4 h-4" />,
      });
      comunes.splice(11, 0, {
        id: 'suscripciones-grupales',
        label: 'Suscripciones Grupales',
        icon: <Users className="w-4 h-4" />,
      });
      comunes.splice(12, 0, {
        id: 'vista-cliente',
        label: 'Vista Cliente',
        icon: <Eye className="w-4 h-4" />,
      });
      comunes.splice(13, 0, {
        id: 'propuestas-cambio',
        label: 'Propuestas de Cambio',
        icon: <Send className="w-4 h-4" />,
      });
      comunes.splice(14, 0, {
        id: 'transferencia-sesiones',
        label: 'Transferencia de Sesiones',
        icon: <ArrowRight className="w-4 h-4" />,
      });
      comunes.splice(15, 0, {
        id: 'resumen-actividad',
        label: 'Resumen de Actividad',
        icon: <BarChart3 className="w-4 h-4" />,
      });
      comunes.splice(16, 0, {
        id: 'proyecciones-retencion',
        label: 'Proyecciones y Retención',
        icon: <LineChart className="w-4 h-4" />,
      });
      comunes.splice(17, 0, {
        id: 'exportar-datos',
        label: 'Exportar Datos',
        icon: <Download className="w-4 h-4" />,
      });
    } else {
      // Solo para gimnasios
      comunes.splice(2, 0, {
        id: 'freeze',
        label: 'Freeze',
        icon: <Pause className="w-4 h-4" />,
      });
      comunes.splice(3, 0, {
        id: 'multisesion',
        label: 'Multisesión',
        icon: <Layers className="w-4 h-4" />,
      });
      comunes.splice(4, 0, {
        id: 'upgrade-downgrade',
        label: 'Upgrade/Downgrade',
        icon: <ArrowUpDown className="w-4 h-4" />,
      });
    }

    return comunes;
  }, [esEntrenador]);

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'suscripciones':
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
      case 'crear-prueba':
        if (esEntrenador) {
          return (
            <CrearSuscripcionPrueba
              onSuccess={loadSuscripciones}
            />
          );
        }
        return null;
      case 'alertas-sesiones':
        if (esEntrenador) {
          return (
            <AlertasSesionesPorCaducar
              diasAnticipacion={7}
              onContactarCliente={(sesion) => {
                console.log('Contactar cliente:', sesion);
              }}
            />
          );
        }
        return null;
      case 'pagos-fallidos':
        if (esEntrenador) {
          return (
            <GestionPagosFallidos
              onSuccess={loadSuscripciones}
            />
          );
        }
        return null;
      case 'cuotas':
        return <GestorCuotas />;
      case 'renovaciones':
        return <RenovacionesAutomaticas />;
      case 'analytics':
        return (
          <AnalyticsSuscripciones
            suscripciones={suscripciones}
            userType={role}
          />
        );
      case 'visualizacion-uso':
        if (esEntrenador) {
          return (
            <VisualizacionUsoSesiones
              suscripciones={suscripciones}
              onContactar={(suscripcion) => {
                // Aquí se puede implementar lógica de contacto
                console.log('Contactar cliente:', suscripcion);
              }}
            />
          );
        }
        return null;
      case 'cambio-plan':
        if (esEntrenador) {
          return (
            <div className="space-y-4">
              {suscripcionSeleccionada ? (
                <>
                  <Card className="bg-white shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Suscripción seleccionada: {suscripcionSeleccionada.clienteNombre}
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setSuscripcionSeleccionada(null)}>
                        Cambiar
                      </Button>
                    </div>
                  </Card>
                  <CambioPlanPT
                    suscripcion={suscripcionSeleccionada}
                    onSuccess={loadSuscripciones}
                  />
                </>
              ) : (
                <>
                  <Card className="bg-white shadow-sm p-6">
                    <p className="text-base text-gray-600 mb-4">
                      Selecciona una suscripción de la lista para cambiar el plan del cliente
                    </p>
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
        }
        return null;
      case 'freeze':
        return (
          <div className="space-y-4">
            {suscripcionSeleccionada ? (
              <>
                <Card className="bg-white shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Suscripción seleccionada: {suscripcionSeleccionada.clienteNombre}
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setSuscripcionSeleccionada(null)}>
                      Cambiar
                    </Button>
                  </div>
                </Card>
                <FreezeSuscripcion
                  suscripcion={suscripcionSeleccionada}
                  onSuccess={loadSuscripciones}
                />
              </>
            ) : (
              <>
                <Card className="bg-white shadow-sm p-6">
                  <p className="text-base text-gray-600 mb-4">
                    Selecciona una suscripción de la lista para {esEntrenador ? 'pausar o reanudar' : 'gestionar el freeze'}
                  </p>
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
      case 'gestion-sesiones':
        if (esEntrenador) {
          return (
            <div className="space-y-4">
              {suscripcionSeleccionada ? (
                <>
                  <Card className="bg-white shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Suscripción seleccionada: {suscripcionSeleccionada.clienteNombre}
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setSuscripcionSeleccionada(null)}>
                        Cambiar
                      </Button>
                    </div>
                  </Card>
                  <GestionSesiones
                    suscripcion={suscripcionSeleccionada}
                    onSuccess={loadSuscripciones}
                  />
                </>
              ) : (
                <>
                  <Card className="bg-white shadow-sm p-6">
                    <p className="text-base text-gray-600 mb-4">
                      Selecciona una suscripción de la lista para gestionar las sesiones del paquete
                    </p>
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
        }
        return null;
      case 'multisesion':
        if (!esEntrenador) {
          return (
            <div className="space-y-4">
              {suscripcionSeleccionada ? (
                <>
                  <Card className="bg-white shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Suscripción seleccionada: {suscripcionSeleccionada.clienteNombre}
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setSuscripcionSeleccionada(null)}>
                        Cambiar
                      </Button>
                    </div>
                  </Card>
                  <Multisesion
                    suscripcion={suscripcionSeleccionada}
                    onSuccess={loadSuscripciones}
                  />
                </>
              ) : (
                <>
                  <Card className="bg-white shadow-sm p-6">
                    <p className="text-base text-gray-600 mb-4">
                      Selecciona una suscripción de la lista para gestionar multisesión
                    </p>
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
        }
        return null;
      case 'recordatorios-renovacion':
        if (esEntrenador) {
          return <RecordatoriosRenovacion />;
        }
        return null;
      case 'descuentos':
        if (esEntrenador) {
          return <DescuentosPersonalizados />;
        }
        return null;
      case 'metricas-compromiso':
        if (esEntrenador) {
          return (
            <MetricasCompromiso
              entrenadorId={user?.id}
              onVerCliente={(clienteId) => {
                console.log('Ver cliente:', clienteId);
                // Aquí se puede navegar al perfil del cliente
              }}
            />
          );
        }
        return null;
      case 'suscripciones-grupales':
        if (esEntrenador) {
          return (
            <SuscripcionesGrupales
              entrenadorId={user?.id}
              onRefresh={loadSuscripciones}
            />
          );
        }
        return null;
      case 'vista-cliente':
        if (esEntrenador) {
          return (
            <div className="space-y-4">
              {suscripcionSeleccionada ? (
                <>
                  <Card className="bg-white shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Vista del Cliente - {suscripcionSeleccionada.clienteNombre}
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setSuscripcionSeleccionada(null)}>
                        Cambiar
                      </Button>
                    </div>
                  </Card>
                  <VistaClienteSuscripcion
                    suscripcion={suscripcionSeleccionada}
                  />
                </>
              ) : (
                <>
                  <Card className="bg-white shadow-sm p-6">
                    <p className="text-base text-gray-600 mb-4">
                      Selecciona una suscripción de la lista para ver cómo se muestra la información desde la perspectiva del cliente
                    </p>
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
        }
        return null;
      case 'propuestas-cambio':
        if (esEntrenador) {
          return (
            <PropuestaCambioRenovacion
              onSuccess={loadSuscripciones}
            />
          );
        }
        return null;
      case 'transferencia-sesiones':
        if (esEntrenador) {
          return (
            <div className="space-y-4">
              {suscripcionSeleccionada ? (
                <>
                  <Card className="bg-white shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Suscripción seleccionada: {suscripcionSeleccionada.clienteNombre}
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setSuscripcionSeleccionada(null)}>
                        Cambiar
                      </Button>
                    </div>
                  </Card>
                  <TransferenciaSesiones
                    suscripcion={suscripcionSeleccionada}
                    onSuccess={loadSuscripciones}
                  />
                </>
              ) : (
                <>
                  <Card className="bg-white shadow-sm p-6">
                    <p className="text-base text-gray-600 mb-4">
                      Selecciona una suscripción de la lista para gestionar la transferencia de sesiones no usadas
                    </p>
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
        }
        return null;
      case 'resumen-actividad':
        if (esEntrenador) {
          return (
            <ResumenActividadSuscripciones
              entrenadorId={user?.id}
              onRefresh={loadSuscripciones}
            />
          );
        }
        return null;
      case 'proyecciones-retencion':
        if (esEntrenador) {
          return (
            <ProyeccionesIngresosRetencion
              entrenadorId={user?.id}
            />
          );
        }
        return null;
      case 'exportar-datos':
        if (esEntrenador) {
          return (
            <ExportarDatos
              entrenadorId={user?.id}
            />
          );
        }
        return null;
      case 'upgrade-downgrade':
        if (!esEntrenador) {
          return (
            <div className="space-y-4">
              {suscripcionSeleccionada ? (
                <>
                  <Card className="bg-white shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Suscripción seleccionada: {suscripcionSeleccionada.clienteNombre}
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setSuscripcionSeleccionada(null)}>
                        Cambiar
                      </Button>
                    </div>
                  </Card>
                  <UpgradeDowngrade
                    suscripcion={suscripcionSeleccionada}
                    onSuccess={loadSuscripciones}
                  />
                </>
              ) : (
                <>
                  <Card className="bg-white shadow-sm p-6">
                    <p className="text-base text-gray-600 mb-4">
                      Selecciona una suscripción de la lista para cambiar de plan
                    </p>
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
        }
        return null;
      default:
        return (
          <SuscripcionesManager
            suscripciones={suscripciones}
            userType={role}
            onUpdate={handleUpdateSuscripcion}
            onCancel={handleCancelSuscripcion}
          />
        );
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

