import { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards, Button } from '../../../components/componentsreutilizables';
import {
  ReservasOnline,
  RecordatoriosReserva,
  RecordatoriosEntrenador,
  RecordatoriosPagoPendiente,
  CalendarioReservas,
  NotasCliente,
  GestionReservasRecurrentes,
  ListaSesionesDia,
  NotificacionesNuevasReservasProvider,
} from '../components';
import type { LucideIcon } from 'lucide-react';
import { Calendar, Clock, DollarSign, TrendingUp, Users, Bell, CalendarDays, StickyNote, AlertCircle, RefreshCw, List, ArrowLeft, AlertCircle as AlertCircleIcon } from 'lucide-react';
import { Reserva } from '../types';
import { getReservas } from '../api';
import { FeatureCard } from '../../CampanasAutomatizacion/components/shared/FeatureCard';

export default function ReservasOnlinePage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const role: 'entrenador' | 'gimnasio' = esEntrenador ? 'entrenador' : 'gimnasio';

  // Estados globales de carga y error
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Estado de navegación principal (Menu por defecto)
  const [currentView, setCurrentView] = useState<string>('menu');

  const [activeTab, setActiveTab] = useState<{ main: string; sub: string }>({
    main: 'gestion',
    sub: 'nueva-reserva',
  });
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(undefined);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setGlobalError(null);

      const fechaInicio = new Date();
      fechaInicio.setMonth(fechaInicio.getMonth() - 1);
      const fechaFin = new Date();
      fechaFin.setMonth(fechaFin.getMonth() + 1);

      const datos = await getReservas({ fechaInicio, fechaFin }, role);
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
        id: 'clientes',
        label: 'Clientes',
        icon: Users,
        subTabs: [
          { id: 'recordatorios', label: 'Recordatorios', icon: Bell },
          { id: 'recordatorios-pago', label: 'Recordatorios de pago', icon: AlertCircle },
          { id: 'notas-cliente', label: 'Notas de clientes', icon: StickyNote },
        ],
      },
    ];

    return baseGroups
      .map((group) => ({
        ...group,
        subTabs: group.subTabs.filter((subTab) => {
          if (subTab.id === 'lista-dia' && role === 'gimnasio') return false;
          if (subTab.id === 'calendario' && role === 'gimnasio') return false;
          if (subTab.id === 'reservas-recurrentes' && role === 'gimnasio') return false;
          if (subTab.id === 'recordatorios-pago' && role === 'gimnasio') return false;
          if (subTab.id === 'notas-cliente' && role === 'gimnasio') return false;
          return true;
        }),
      }))
      .filter((group) => group.subTabs.length > 0);
  }, [role]);

  // Efecto para asegurar que activeTab.sub sea válido cuando cambia activeTab.main o tabGroups
  useEffect(() => {
    // Si estamos en el menú, no necesitamos validar subtabs todavía
    if (currentView === 'menu') return;

    // Encontrar el grupo actual basado en activeTab.main
    // Nota: activeTab.main ahora se corresponde con 'gestion' o 'clientes' que seteamos al hacer click en la card
    const currentGroup = tabGroups.find((group) => group.id === activeTab.main);

    if (!currentGroup) {
      // Si el grupo actual no existe (ej: cambio de rol), volver al primer grupo disponible o al menú
      if (tabGroups.length > 0) {
        setActiveTab({
          main: tabGroups[0].id,
          sub: tabGroups[0].subTabs[0]?.id ?? '',
        });
      } else {
        setCurrentView('menu');
      }
      return;
    }

    // Verificar si la subtab actual es válida para el grupo actual
    const hasCurrentSub = currentGroup.subTabs.some((sub) => sub.id === activeTab.sub);

    if (!hasCurrentSub) {
      // Si no es válida, seleccionar la primera subtab del grupo
      setActiveTab((prev) => ({
        ...prev,
        sub: currentGroup.subTabs[0]?.id ?? prev.sub,
      }));
    }
  }, [tabGroups, activeTab.main, currentView]); // Agregamos currentView a dependencias

  const handleReservaCreada = (reserva: Reserva) => {
    setReservas([...reservas, reserva]);
    // Navegar a historial o lista del día? 
    // Como historial ya no está en el menú simplificado, quizás lista del día o calendario
    // O simplemente notificar. Por ahora lo dejamos así, el usuario no especificó.
  };

  const reservasConfirmadas = reservas.filter((r) => r.estado === 'confirmada').length;
  const ingresosTotales = reservas.filter((r) => r.pagado).reduce((sum, r) => sum + (r.precio || 0), 0);
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
      trend: { value: 12, direction: 'up' as const },
    },
    {
      id: 'confirmadas',
      title: 'Confirmadas',
      value: reservasConfirmadas.toString(),
      icon: <Clock className="w-6 h-6" />,
      color: 'success' as const,
      trend: { value: 8, direction: 'up' as const },
    },
    {
      id: 'ingresos',
      title: 'Ingresos',
      value: `€${ingresosTotales.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'primary' as const,
      trend: { value: 15, direction: 'up' as const },
    },
    {
      id: 'tasa-ocupacion',
      title: 'Tasa Ocupación',
      value: `${tasaOcupacion}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'warning' as const,
      trend: { value: 5, direction: 'up' as const },
    },
  ];

  const activeGroup = useMemo(
    () => tabGroups.find((group) => group.id === activeTab.main),
    [tabGroups, activeTab.main],
  );

  const handleSubTabClick = useCallback(
    (subTabId: string) => {
      setActiveTab((prev) => (prev.sub === subTabId ? prev : { ...prev, sub: subTabId }));
    },
    [],
  );

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
      case 'recordatorios':
        return role === 'entrenador' && user?.id ? (
          <RecordatoriosEntrenador entrenadorId={user.id} />
        ) : (
          <RecordatoriosReserva reservas={reservas} role={role} />
        );
      case 'recordatorios-pago':
        return role === 'entrenador' ? (
          <RecordatoriosPagoPendiente role={role} />
        ) : null;
      case 'notas-cliente':
        return role === 'entrenador' && user?.id ? (
          <NotasCliente entrenadorId={user.id} />
        ) : null;
      default:
        return null;
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
      <Card className="p-0 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="h-12 bg-gray-200 rounded-xl animate-pulse mb-3" />
          <div className="h-10 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </Card>
      <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  );

  const GlobalErrorDisplay = () => (
    <Card className="p-6 bg-white shadow-sm border-l-4 border-l-red-500">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertCircleIcon className="w-6 h-6 text-red-600" />
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

  const renderMenu = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* 1. Gestión */}
      <FeatureCard
        title="Gestión"
        description="Nueva reserva, calendario y gestión diaria."
        icon={<Calendar size={24} />}
        color="indigo"
        onClick={() => {
          setCurrentView('gestion');
          setActiveTab({ main: 'gestion', sub: 'nueva-reserva' });
        }}
        stats={[
          { label: 'Reservas', value: reservas.length },
          { label: 'Hoy', value: 'Ver' }
        ]}
      />

      {/* 2. Clientes */}
      <FeatureCard
        title="Clientes"
        description="Recordatorios, pagos y notas de clientes."
        icon={<Users size={24} />}
        color="sky"
        onClick={() => {
          setCurrentView('clientes');
          setActiveTab({ main: 'clientes', sub: 'recordatorios' });
        }}
        stats={[
          { label: 'Recordatorios', value: 'Activos' },
          { label: 'Pagos', value: 'Pendientes' }
        ]}
      />
    </div>
  );

  return (
    <NotificacionesNuevasReservasProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-4 sm:py-6">
              <div className="flex items-start sm:items-center">
                {/* Back Button if not in menu */}
                {currentView !== 'menu' && (
                  <button
                    onClick={() => setCurrentView('menu')}
                    className="mr-3 sm:mr-4 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                  >
                    <ArrowLeft size={24} />
                  </button>
                )}

                <div className="p-2 bg-blue-100 rounded-xl mr-3 sm:mr-4 ring-1 ring-blue-200/70 flex-shrink-0">
                  <Calendar size={20} className="sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Reservas Online
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    {esEntrenador
                      ? 'Gestiona las reservas de sesiones 1 a 1 con tus clientes.'
                      : 'Gestiona las reservas de clases grupales y servicios del centro.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-4 sm:py-8">
          {loading && !reservas.length && !globalError ? (
            <LoadingSkeleton />
          ) : (
            <div className="space-y-6">
              {globalError && <GlobalErrorDisplay />}

              {!globalError && (
                <>
                  {currentView === 'menu' ? (
                    <>
                      <MetricCards data={metrics} />
                      <div className="mt-6">
                        {renderMenu()}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-6">
                      {/* Sub-tabs para la vista activa */}
                      {activeGroup && (
                        <Card className="p-0 bg-white shadow-sm">
                          <div className="px-2 sm:px-4 py-3">
                            <div className="flex items-center gap-2 px-2 sm:px-0 min-w-max sm:min-w-0 sm:flex-wrap overflow-x-auto">
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
                        </Card>
                      )}

                      {/* Contenido de la sub-pestaña activa */}
                      <div className="mt-4 sm:mt-6">
                        {renderTabContent()}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </NotificacionesNuevasReservasProvider>
  );
}
