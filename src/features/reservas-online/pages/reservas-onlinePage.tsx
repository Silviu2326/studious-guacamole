import { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
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
  ConfiguracionAprobacionReservas,
  ConfiguracionBufferTimeYTiempoMinimo,
  ConfiguracionVideollamada,
  CalendarioReservas,
  NotasCliente,
  GestionPaquetesSesiones,
  ConfiguracionPoliticasCancelacion,
  EstadisticasAsistenciaClientes,
  IngresosPorHorario,
  IngresosPorCliente,
  ConfiguracionDiasMaximosReserva,
  GestionReservasRecurrentes,
  ListaSesionesDia,
} from '../components';
import type { LucideIcon } from 'lucide-react';
import { Calendar, Clock, DollarSign, TrendingUp, Users, Bell, XCircle, BarChart3, FileText, Link2, Settings, CalendarDays, Video, StickyNote, AlertCircle, Package, Shield, Activity, Timer, Award, RefreshCw, List } from 'lucide-react';
import { Reserva } from '../types';
import { getReservas } from '../api';

/**
 * Página principal de Reservas Online
 * 
 * Adaptada según el rol del usuario:
 * - Entrenadores: Sesiones 1 a 1, reservas directas con clientes según horarios disponibles
 * - Gimnasios: Clases grupales, reservas de plazas en spinning, boxeo, HIIT, fisio, nutrición, masaje
 */
export default function ReservasOnlinePage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const role: 'entrenador' | 'gimnasio' = esEntrenador ? 'entrenador' : 'gimnasio';
  
  const [activeTab, setActiveTab] = useState<{ main: string; sub: string }>({
    main: 'gestion-reservas',
    sub: 'nueva-reserva',
  });
  const [reservas, setReservas] = useState<Reserva[]>([]);

  useEffect(() => {
    const cargarReservas = async () => {
      const fechaInicio = new Date();
      fechaInicio.setMonth(fechaInicio.getMonth() - 1);
      const fechaFin = new Date();
      fechaFin.setMonth(fechaFin.getMonth() + 1);
      
      const datos = await getReservas(fechaInicio, fechaFin, role);
      setReservas(datos);
    };
    cargarReservas();
  }, [role]);

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
    const groups: TabGroupDefinition[] = [
      {
        id: 'gestion-reservas',
        label: 'Gestión',
        icon: Calendar,
        subTabs: [
          { id: 'nueva-reserva', label: 'Nueva Reserva', icon: Calendar },
          { id: 'lista-dia', label: 'Lista del Día', icon: List, roles: ['entrenador'] },
          { id: 'calendario', label: 'Calendario', icon: CalendarDays, roles: ['entrenador'] },
          { id: 'reservas-recurrentes', label: 'Reservas Recurrentes', icon: RefreshCw, roles: ['entrenador'] },
        ],
      },
      {
        id: 'seguimiento',
        label: 'Seguimiento',
        icon: Clock,
        subTabs: [
          { id: 'historial', label: 'Historial', icon: Clock },
          { id: 'cancelaciones', label: 'Cancelaciones', icon: XCircle },
          { id: 'lista-espera', label: 'Lista de Espera', icon: Users, roles: ['gimnasio'] },
        ],
      },
      {
        id: 'clientes',
        label: 'Clientes',
        icon: Users,
        subTabs: [
          { id: 'recordatorios', label: 'Recordatorios', icon: Bell },
          { id: 'recordatorios-pago', label: 'Recordatorios de Pago', icon: AlertCircle, roles: ['entrenador'] },
          { id: 'notas-cliente', label: 'Notas de Clientes', icon: StickyNote, roles: ['entrenador'] },
        ],
      },
      {
        id: 'insights',
        label: 'Insights',
        icon: BarChart3,
        subTabs: [
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          { id: 'estadisticas-asistencia', label: 'Asistencia', icon: Activity, roles: ['entrenador'] },
          { id: 'ingresos-horario', label: 'Ingresos por Horario', icon: Timer, roles: ['entrenador'] },
          { id: 'ingresos-cliente', label: 'Ingresos por Cliente', icon: Award, roles: ['entrenador'] },
        ],
      },
      {
        id: 'configuracion',
        label: 'Configuración',
        icon: Settings,
        subTabs: [
          { id: 'plantillas', label: 'Plantillas de Sesión', icon: FileText, roles: ['entrenador'] },
          { id: 'horarios', label: 'Horarios Disponibles', icon: Clock, roles: ['entrenador'] },
          { id: 'enlace-publico', label: 'Enlace Público', icon: Link2, roles: ['entrenador'] },
          { id: 'paquetes-sesiones', label: 'Paquetes de Sesiones', icon: Package, roles: ['entrenador'] },
          { id: 'config-videollamada', label: 'Videollamada', icon: Video, roles: ['entrenador'] },
          { id: 'config-aprobacion', label: 'Aprobación de Reservas', icon: Settings, roles: ['entrenador'] },
          { id: 'config-buffer-tiempo', label: 'Buffer & Anticipación', icon: Clock, roles: ['entrenador'] },
          { id: 'config-dias-maximos', label: 'Días Máximos', icon: CalendarDays, roles: ['entrenador'] },
          { id: 'politicas-cancelacion', label: 'Políticas de Cancelación', icon: Shield, roles: ['entrenador'] },
        ],
      },
    ];

    return groups
      .filter((group) => !group.roles || group.roles.includes(role))
      .map((group) => ({
        ...group,
        subTabs: group.subTabs.filter((subTab) => !subTab.roles || subTab.roles.includes(role)),
      }))
      .filter((group) => group.subTabs.length > 0);
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

  const renderTabContent = () => {
    switch (activeTab.sub) {
      case 'nueva-reserva':
        return <ReservasOnline role={role} onReservaCreada={handleReservaCreada} entrenadorId={esEntrenador ? user?.id : undefined} />;
      case 'lista-dia':
        return esEntrenador && user?.id ? (
          <ListaSesionesDia entrenadorId={user.id} />
        ) : null;
      case 'calendario':
        return esEntrenador ? (
          <CalendarioReservas role={role} entrenadorId={user?.id} />
        ) : null;
      case 'reservas-recurrentes':
        return esEntrenador && user?.id ? (
          <GestionReservasRecurrentes entrenadorId={user.id} />
        ) : null;
      case 'historial':
        return <HistorialReservas role={role} />;
      case 'cancelaciones':
        return <Cancelaciones reservas={reservas} role={role} onCancelar={handleCancelar} />;
      case 'lista-espera':
        return <ListaEspera role={role} />;
      case 'recordatorios':
        return esEntrenador && user?.id ? (
          <RecordatoriosEntrenador entrenadorId={user.id} />
        ) : (
          <RecordatoriosReserva reservas={reservas} role={role} />
        );
      case 'analytics':
        return <AnalyticsReservas role={role} />;
      case 'plantillas':
        return esEntrenador && user?.id ? (
          <GestionPlantillasSesion entrenadorId={user.id} />
        ) : null;
      case 'horarios':
        return esEntrenador && user?.id ? (
          <ConfiguracionHorarios entrenadorId={user.id} />
        ) : null;
      case 'enlace-publico':
        return esEntrenador && user?.id ? (
          <GestionEnlacePublico entrenadorId={user.id} />
        ) : null;
      case 'paquetes-sesiones':
        return esEntrenador && user?.id ? (
          <GestionPaquetesSesiones entrenadorId={user.id} />
        ) : null;
      case 'config-videollamada':
        return esEntrenador && user?.id ? (
          <ConfiguracionVideollamada entrenadorId={user.id} />
        ) : null;
      case 'config-aprobacion':
        return esEntrenador && user?.id ? (
          <ConfiguracionAprobacionReservas entrenadorId={user.id} />
        ) : null;
      case 'config-buffer-tiempo':
        return esEntrenador && user?.id ? (
          <ConfiguracionBufferTimeYTiempoMinimo entrenadorId={user.id} />
        ) : null;
      case 'config-dias-maximos':
        return esEntrenador && user?.id ? (
          <ConfiguracionDiasMaximosReserva entrenadorId={user.id} />
        ) : null;
      case 'politicas-cancelacion':
        return esEntrenador && user?.id ? (
          <ConfiguracionPoliticasCancelacion entrenadorId={user.id} />
        ) : null;
      case 'notas-cliente':
        return esEntrenador && user?.id ? (
          <NotasCliente entrenadorId={user.id} />
        ) : null;
      case 'recordatorios-pago':
        return esEntrenador ? (
          <RecordatoriosPagoPendiente role={role} />
        ) : null;
      case 'estadisticas-asistencia':
        return esEntrenador && user?.id ? (
          <EstadisticasAsistenciaClientes entrenadorId={user.id} />
        ) : null;
      case 'ingresos-horario':
        return esEntrenador && user?.id ? (
          <IngresosPorHorario entrenadorId={user.id} />
        ) : null;
      case 'ingresos-cliente':
        return esEntrenador && user?.id ? (
          <IngresosPorCliente entrenadorId={user.id} />
        ) : null;
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
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Calendar size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Reservas Online
                </h1>
                <p className="text-gray-600">
                  {esEntrenador
                    ? 'Gestiona las reservas de sesiones 1 a 1 con tus clientes'
                    : 'Gestiona las reservas de clases grupales y servicios del centro'
                  }
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
          <MetricCards data={metrics} />

          {/* Sistema de Tabs */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <nav aria-label="Secciones principales reservas" className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-100 p-1">
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
                  className="mt-3 flex flex-wrap items-center gap-2"
                >
                  {activeGroup.subTabs.map(({ id, label, icon: Icon }) => {
                    const isActive = activeTab.sub === id;
                    return (
                      <button
                        key={id}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => handleSubTabClick(id)}
                        className={[
                          'inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm transition-all',
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
              )}
            </div>
          </Card>

          {/* Contenido de la pestaña activa */}
          <div className="mt-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
