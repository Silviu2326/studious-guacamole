import { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards, Button } from '../../../components/componentsreutilizables';
import {
  ReservasOnline,
  HistorialReservas,
  Cancelaciones,
  ListaEspera,
  RecordatoriosReserva,
  RecordatoriosEntrenador,
  RecordatoriosPagoPendiente,
  AnalyticsReservas,
  ConfiguracionHorarios,
  GestionPlantillasSesion,
  GestionEnlacePublico,
  ConfiguracionVideollamada,
  CalendarioReservas,
  NotasCliente,
  GestionPaquetesSesiones,
  ConfiguracionPoliticasCancelacion,
  EstadisticasAsistenciaClientes,
  IngresosPorHorario,
  IngresosPorCliente,
  GestionReservasRecurrentes,
  ListaSesionesDia,
  ConfiguracionAprobacionReservas,
  ConfiguracionBufferTimeYTiempoMinimo,
  ConfiguracionDiasMaximosReserva,
  NotificacionesNuevasReservasProvider,
} from '../components';
import type { LucideIcon } from 'lucide-react';
import { Calendar, Clock, DollarSign, TrendingUp, Users, Bell, XCircle, BarChart3, FileText, Link2, Settings, CalendarDays, Video, StickyNote, AlertCircle, Package, Shield, Activity, Timer, Award, RefreshCw, List, CheckCircle, Ban, Loader2 } from 'lucide-react';
import { Reserva } from '../types';
import { getReservas } from '../api';

/**
 * Página principal de Reservas Online
 * 
 * Adaptada según el rol del usuario:
 * - Entrenadores: Sesiones 1 a 1, reservas directas con clientes según horarios disponibles
 * - Gimnasios: Clases grupales, reservas de plazas en spinning, boxeo, HIIT, fisio, nutrición, masaje
 * 
 * Gestión de estados:
 * - Loading global: Carga inicial de datos básicos (reservas para métricas)
 * - Error global: Muestra mensaje con botón "Reintentar" cuando falla la carga crítica
 * - Errores parciales: Los sub-componentes manejan sus propios errores localmente
 */
export default function ReservasOnlinePage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const role: 'entrenador' | 'gimnasio' = esEntrenador ? 'entrenador' : 'gimnasio';
  
  // Estados globales de carga y error
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<{ main: string; sub: string }>({
    main: 'gestion',
    sub: 'nueva-reserva',
  });
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(undefined);

  /**
   * Carga inicial de datos básicos del módulo
   * - Reservas para calcular métricas principales
   * - Esta carga es crítica para el funcionamiento del módulo
   * 
   * NOTA: Los sub-componentes (HistorialReservas, AnalyticsReservas, etc.)
   * manejan sus propios estados de carga y error localmente.
   */
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setGlobalError(null);
      
      const fechaInicio = new Date();
      fechaInicio.setMonth(fechaInicio.getMonth() - 1);
      const fechaFin = new Date();
      fechaFin.setMonth(fechaFin.getMonth() + 1);
      
      const datos = await getReservas(fechaInicio, fechaFin, role);
      setReservas(datos);
    } catch (error) {
      console.error('Error cargando datos iniciales de reservas:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'No se pudieron cargar los datos de reservas. Por favor, intenta de nuevo.';
      setGlobalError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  type RoleValue = 'entrenador' | 'gimnasio';

  interface SubTabDefinition {
    id: string;
    label: string;
    icon: LucideIcon;
    roles?: RoleValue[];
  }

  interface TabGroupDefinition {
    id: string;
    label: string;
    icon: LucideIcon;
    roles?: RoleValue[];
    subTabs: SubTabDefinition[];
  }

  const tabGroups = useMemo(() => {
    // Definir grupos base según especificación
    const baseGroups: TabGroupDefinition[] = [
      {
        id: 'gestion',
        label: 'Gestión',
        icon: Calendar,
        subTabs: [
          { id: 'nueva-reserva', label: 'Nueva reserva', icon: Calendar },
          { id: 'lista-dia', label: 'Lista del día', icon: List },
          { id: 'calendario', label: 'Calendario', icon: CalendarDays },
          { id: 'reservas-recurrentes', label: 'Reservas recurrentes', icon: RefreshCw },
        ],
      },
      {
        id: 'seguimiento',
        label: 'Seguimiento',
        icon: Clock,
        subTabs: [
          { id: 'historial', label: 'Historial', icon: Clock },
          { id: 'cancelaciones', label: 'Cancelaciones', icon: XCircle },
          { id: 'lista-espera', label: 'Lista de espera', icon: Users },
        ],
      },
      {
        id: 'clientes',
        label: 'Clientes',
        icon: Users,
        subTabs: [
          { id: 'recordatorios', label: 'Recordatorios', icon: Bell },
          { id: 'recordatorios-pago', label: 'Recordatorios de pago', icon: AlertCircle },
          { id: 'notas-cliente', label: 'Notas de clientes', icon: StickyNote },
        ],
      },
      {
        id: 'insights',
        label: 'Insights',
        icon: BarChart3,
        subTabs: [
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          { id: 'estadisticas-asistencia', label: 'Asistencia', icon: Activity },
          { id: 'ingresos-horario', label: 'Ingresos por Horario', icon: Timer },
          { id: 'ingresos-cliente', label: 'Ingresos por Cliente', icon: Award },
        ],
      },
      {
        id: 'configuracion',
        label: 'Configuración',
        icon: Settings,
        subTabs: [
          { id: 'plantillas', label: 'Plantillas', icon: FileText },
          { id: 'horarios', label: 'Horarios', icon: Clock },
          { id: 'enlace-publico', label: 'Enlace público', icon: Link2 },
          { id: 'paquetes-sesiones', label: 'Paquetes', icon: Package },
          { id: 'config-videollamada', label: 'Videollamada', icon: Video },
          { id: 'aprobacion-reservas', label: 'Aprobación', icon: CheckCircle },
          { id: 'buffer-tiempo', label: 'Buffer y Tiempo', icon: Timer },
          { id: 'dias-maximos', label: 'Días Máximos', icon: CalendarDays },
          { id: 'politicas-cancelacion', label: 'Políticas', icon: Shield },
        ],
      },
    ];

    // Filtrar tabs según rol y aplicar restricciones de visibilidad
    const filteredGroups = baseGroups
      .map((group) => ({
        ...group,
        subTabs: group.subTabs.filter((subTab) => {
          // Aplicar filtros de rol específicos
          if (subTab.id === 'lista-dia' && role === 'gimnasio') return false;
          if (subTab.id === 'calendario' && role === 'gimnasio') return false;
          if (subTab.id === 'reservas-recurrentes' && role === 'gimnasio') return false;
          if (subTab.id === 'lista-espera' && role === 'entrenador') return false;
          if (subTab.id === 'recordatorios-pago' && role === 'gimnasio') return false;
          if (subTab.id === 'notas-cliente' && role === 'gimnasio') return false;
          if (subTab.id === 'estadisticas-asistencia' && role === 'gimnasio') return false;
          if (subTab.id === 'ingresos-horario' && role === 'gimnasio') return false;
          if (subTab.id === 'ingresos-cliente' && role === 'gimnasio') return false;
          if (subTab.id === 'plantillas' && role === 'gimnasio') return false;
          if (subTab.id === 'horarios' && role === 'gimnasio') return false;
          if (subTab.id === 'enlace-publico' && role === 'gimnasio') return false;
          if (subTab.id === 'paquetes-sesiones' && role === 'gimnasio') return false;
          if (subTab.id === 'config-videollamada' && role === 'gimnasio') return false;
          if (subTab.id === 'aprobacion-reservas' && role === 'gimnasio') return false;
          if (subTab.id === 'buffer-tiempo' && role === 'gimnasio') return false;
          if (subTab.id === 'dias-maximos' && role === 'gimnasio') return false;
          if (subTab.id === 'politicas-cancelacion' && role === 'gimnasio') return false;
          return true;
        }),
      }))
      .filter((group) => group.subTabs.length > 0);

    // Reordenar grupos según rol: entrenadores priorizan Gestión y Clientes, gimnasios priorizan Insights y Configuración
    if (role === 'entrenador') {
      // Orden para entrenadores: Gestión, Clientes, Seguimiento, Insights, Configuración
      const order = ['gestion', 'clientes', 'seguimiento', 'insights', 'configuracion'];
      return order
        .map((id) => filteredGroups.find((g) => g.id === id))
        .filter((g): g is TabGroupDefinition => g !== undefined);
    } else {
      // Orden para gimnasios: Insights, Configuración, Gestión, Seguimiento, Clientes
      const order = ['insights', 'configuracion', 'gestion', 'seguimiento', 'clientes'];
      return order
        .map((id) => filteredGroups.find((g) => g.id === id))
        .filter((g): g is TabGroupDefinition => g !== undefined);
    }
  }, [role]);

  useEffect(() => {
    if (tabGroups.length === 0) {
      return;
    }

    const currentGroup = tabGroups.find((group) => group.id === activeTab.main);

    if (!currentGroup) {
      const [firstGroup] = tabGroups;
      setActiveTab({
        main: firstGroup.id,
        sub: firstGroup.subTabs[0]?.id ?? '',
      });
      return;
    }

    const hasCurrentSub = currentGroup.subTabs.some((sub) => sub.id === activeTab.sub);
    if (!hasCurrentSub) {
      setActiveTab((prev) => ({
        ...prev,
        sub: currentGroup.subTabs[0]?.id ?? prev.sub,
      }));
    }
  }, [tabGroups, activeTab.main, activeTab.sub]);

  const selectSubTab = useCallback(
    (subTabId: string) => {
      const group = tabGroups.find((tabGroup) =>
        tabGroup.subTabs.some((subTab) => subTab.id === subTabId),
      );

      if (group) {
        setActiveTab({
          main: group.id,
          sub: subTabId,
        });
      }
    },
    [tabGroups],
  );

  const handleReservaCreada = (reserva: Reserva) => {
    setReservas([...reservas, reserva]);
    selectSubTab('historial');
  };

  const handleCancelar = (reservaId: string) => {
    setReservas(reservas.map((r) => (r.id === reservaId ? { ...r, estado: 'cancelada' } : r)));
  };

  const reservasConfirmadas = reservas.filter((r) => r.estado === 'confirmada').length;
  const ingresosTotales = reservas.filter((r) => r.pagado).reduce((sum, r) => sum + r.precio, 0);
  const tasaOcupacion = reservas.length > 0 
    ? Math.round((reservasConfirmadas / reservas.length) * 100) 
    : 0;

  const metrics = [
    {
      id: 'reservas-totales',
      title: 'Reservas Totales',
      value: reservas.length.toString(),
      icon: <Calendar className="w-6 h-6" />,
      color: 'info' as const,
      trend: {
        value: 12,
        direction: 'up' as const,
      },
    },
    {
      id: 'confirmadas',
      title: 'Confirmadas',
      value: reservasConfirmadas.toString(),
      icon: <Clock className="w-6 h-6" />,
      color: 'success' as const,
      trend: {
        value: 8,
        direction: 'up' as const,
      },
    },
    {
      id: 'ingresos',
      title: 'Ingresos',
      value: `€${ingresosTotales.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'primary' as const,
      trend: {
        value: 15,
        direction: 'up' as const,
      },
    },
    {
      id: 'tasa-ocupacion',
      title: 'Tasa Ocupación',
      value: `${tasaOcupacion}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'warning' as const,
      trend: {
        value: 5,
        direction: 'up' as const,
      },
    },
  ];

  const activeGroup = useMemo(
    () => tabGroups.find((group) => group.id === activeTab.main),
    [tabGroups, activeTab.main],
  );

  const handleMainTabClick = useCallback(
    (groupId: string) => {
      if (groupId === activeTab.main) {
        return;
      }
      const group = tabGroups.find((tabGroup) => tabGroup.id === groupId);
      if (group && group.subTabs.length > 0) {
        setActiveTab({
          main: groupId,
          sub: group.subTabs[0].id,
        });
      }
    },
    [activeTab.main, tabGroups],
  );

  const handleSubTabClick = useCallback(
    (subTabId: string) => {
      setActiveTab((prev) => (prev.sub === subTabId ? prev : { ...prev, sub: subTabId }));
    },
    [],
  );

  /**
   * Renderiza el contenido de la pestaña activa
   * 
   * NOTA: Cada sub-componente maneja sus propios estados de carga y error.
   * Los errores específicos de funcionalidades individuales (ej: crear reserva,
   * cargar analytics, etc.) se muestran dentro del componente correspondiente.
   */
  const renderTabContent = () => {
    switch (activeTab.sub) {
      case 'nueva-reserva':
        return <ReservasOnline role={role} onReservaCreada={handleReservaCreada} entrenadorId={esEntrenador ? user?.id : undefined} />;
      case 'lista-dia':
        return role === 'entrenador' && user?.id ? (
          <ListaSesionesDia entrenadorId={user.id} fecha={fechaSeleccionada} />
        ) : null;
      case 'calendario':
        return role === 'entrenador' ? (
          <div className="space-y-6">
            <CalendarioReservas 
              role={role} 
              entrenadorId={user?.id}
              onSelectDia={(fecha) => {
                setFechaSeleccionada(fecha);
              }}
            />
            {fechaSeleccionada && (
              <ListaSesionesDia 
                entrenadorId={user?.id} 
                fecha={fechaSeleccionada}
              />
            )}
          </div>
        ) : null;
      case 'reservas-recurrentes':
        return role === 'entrenador' && user?.id ? (
          <GestionReservasRecurrentes entrenadorId={user.id} />
        ) : null;
      case 'historial':
        return <HistorialReservas role={role} />;
      case 'cancelaciones':
        return <Cancelaciones reservas={reservas} role={role} onCancelar={handleCancelar} />;
      case 'lista-espera':
        return role === 'gimnasio' ? (
          <ListaEspera role={role} />
        ) : null;
      case 'recordatorios':
        return role === 'entrenador' && user?.id ? (
          <RecordatoriosEntrenador entrenadorId={user.id} />
        ) : (
          <RecordatoriosReserva reservas={reservas} role={role} />
        );
      case 'analytics':
        return <AnalyticsReservas role={role} />;
      case 'plantillas':
        return role === 'entrenador' && user?.id ? (
          <GestionPlantillasSesion entrenadorId={user.id} />
        ) : null;
      case 'horarios':
        return role === 'entrenador' && user?.id ? (
          <ConfiguracionHorarios entrenadorId={user.id} />
        ) : null;
      case 'enlace-publico':
        return role === 'entrenador' && user?.id ? (
          <GestionEnlacePublico entrenadorId={user.id} />
        ) : null;
      case 'paquetes-sesiones':
        return role === 'entrenador' && user?.id ? (
          <GestionPaquetesSesiones entrenadorId={user.id} />
        ) : null;
      case 'config-videollamada':
        return role === 'entrenador' && user?.id ? (
          <ConfiguracionVideollamada entrenadorId={user.id} />
        ) : null;
      case 'aprobacion-reservas':
        return role === 'entrenador' && user?.id ? (
          <ConfiguracionAprobacionReservas entrenadorId={user.id} />
        ) : null;
      case 'buffer-tiempo':
        return role === 'entrenador' && user?.id ? (
          <ConfiguracionBufferTimeYTiempoMinimo entrenadorId={user.id} />
        ) : null;
      case 'dias-maximos':
        return role === 'entrenador' && user?.id ? (
          <ConfiguracionDiasMaximosReserva entrenadorId={user.id} />
        ) : null;
      case 'politicas-cancelacion':
        return role === 'entrenador' && user?.id ? (
          <ConfiguracionPoliticasCancelacion entrenadorId={user.id} />
        ) : null;
      case 'notas-cliente':
        return role === 'entrenador' && user?.id ? (
          <NotasCliente entrenadorId={user.id} />
        ) : null;
      case 'recordatorios-pago':
        return role === 'entrenador' ? (
          <RecordatoriosPagoPendiente role={role} />
        ) : null;
      case 'estadisticas-asistencia':
        return role === 'entrenador' && user?.id ? (
          <EstadisticasAsistenciaClientes entrenadorId={user.id} />
        ) : null;
      case 'ingresos-horario':
        return role === 'entrenador' && user?.id ? (
          <IngresosPorHorario entrenadorId={user.id} />
        ) : null;
      case 'ingresos-cliente':
        return role === 'entrenador' && user?.id ? (
          <IngresosPorCliente entrenadorId={user.id} />
        ) : null;
      default:
        return null;
    }
  };

  /**
   * Componente de skeleton para estado de carga inicial
   * Muestra un esqueleto general mientras se cargan los datos básicos
   */
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {/* Skeleton para métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
      
      {/* Skeleton para tabs y contenido */}
      <Card className="p-0 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="h-12 bg-gray-200 rounded-xl animate-pulse mb-3" />
          <div className="h-10 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </Card>
      
      {/* Skeleton para contenido de la pestaña */}
      <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  );

  /**
   * Componente de error global
   * Se muestra cuando falla la carga crítica de datos básicos
   * Patrón visual consistente con otros módulos (Agenda, Objetivos)
   */
  const GlobalErrorDisplay = () => (
    <Card className="p-6 bg-white shadow-sm border-l-4 border-l-red-500">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Error al cargar datos de reservas
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {globalError || 'Ocurrió un error inesperado. Por favor, intenta de nuevo.'}
          </p>
          <Button 
            variant="primary" 
            size="sm"
            onClick={loadInitialData}
            className="bg-red-600 hover:bg-red-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <NotificacionesNuevasReservasProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-4 sm:py-6">
              <div className="flex items-start sm:items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-3 sm:mr-4 ring-1 ring-blue-200/70 flex-shrink-0">
                  <Calendar size={20} className="sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Reservas Online
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    {esEntrenador
                      ? 'Gestiona las reservas de sesiones 1 a 1 con tus clientes. Organiza tu agenda, crea nuevas reservas y mantén un seguimiento completo de tus sesiones.'
                      : 'Gestiona las reservas de clases grupales y servicios del centro. Analiza el rendimiento, configura horarios y optimiza la ocupación de tus instalaciones.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-4 sm:py-8">
          {/* Estado de carga inicial - Muestra skeleton mientras se cargan datos básicos */}
          {loading && !reservas.length && !globalError ? (
            <LoadingSkeleton />
          ) : (
            <div className="space-y-6">
              {/* Error global - Solo se muestra si falla la carga crítica */}
              {globalError && <GlobalErrorDisplay />}

              {/* Métricas - Solo se muestran si hay datos o no hay error crítico */}
              {!globalError && <MetricCards data={metrics} />}

              {/* Sistema de Tabs */}
              {!globalError && (
                <Card className="p-0 bg-white shadow-sm">
                  <div className="px-2 sm:px-4 py-3">
                    {/* Navegación principal - Dropdown en móvil, tabs en desktop */}
                    <div className="md:hidden mb-3">
                      <select
                        value={activeTab.main}
                        onChange={(e) => handleMainTabClick(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm font-medium rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        aria-label="Seleccionar sección principal"
                      >
                        {tabGroups.map(({ id, label }) => (
                          <option key={id} value={id}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <nav 
                      aria-label="Secciones principales reservas" 
                      className="hidden md:flex flex-wrap items-center gap-2 rounded-2xl bg-slate-100 p-1"
                    >
                      {tabGroups.map(({ id, label, icon: Icon }) => {
                        const isActive = activeTab.main === id;
                        return (
                          <button
                            key={id}
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => handleMainTabClick(id)}
                            className={[
                              'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                              isActive
                                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70',
                            ].join(' ')}
                          >
                            <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
                            <span>{label}</span>
                          </button>
                        );
                      })}
                    </nav>
                    {activeGroup && (
                      <div
                        role="tablist"
                        aria-label={`Subsecciones ${activeGroup.label.toLowerCase()}`}
                        className="mt-3 overflow-x-auto -mx-2 sm:mx-0"
                      >
                        <div className="flex items-center gap-2 px-2 sm:px-0 min-w-max sm:min-w-0 sm:flex-wrap">
                          {activeGroup.subTabs.map(({ id, label, icon: Icon }) => {
                            const isActive = activeTab.sub === id;
                            return (
                              <button
                                key={id}
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => handleSubTabClick(id)}
                                className={[
                                  'inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm transition-all whitespace-nowrap flex-shrink-0',
                                  isActive
                                    ? 'border-slate-200 bg-slate-900 text-white shadow-sm'
                                    : 'border-transparent bg-white text-slate-600 hover:border-slate-200 hover:text-slate-900',
                                ].join(' ')}
                              >
                                <Icon size={16} className={isActive ? 'opacity-100' : 'opacity-70'} />
                                <span>{label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Contenido de la pestaña activa */}
              {/* NOTA: Los sub-componentes manejan sus propios estados de carga y error */}
              {!globalError && (
                <div className="mt-4 sm:mt-6">
                  {renderTabContent()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </NotificacionesNuevasReservasProvider>
  );
}
