import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CalendarDays, Plus, X, Clock, Zap, Users, Shield, BarChart3, Filter, Info, ChevronDown, Menu, WifiOff, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Modal, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { useIsMobile } from '../hooks/useIsMobile';
import { RangoFechas, ContextoMetricas } from '../types';
import {
  AgendaCalendar,
  VistaPersonal,
  VistaCentro,
  VistaDiaCompleto,
  GestorHorarios,
  ConfiguradorHorariosTrabajo,
  BloqueosAgenda,
  RecordatoriosAutomaticos,
  ConfiguracionResumenDiario,
  VistaResumenDiario,
  AnalyticsOcupacion,
  ConfiguracionTiempoDescanso,
  EstadisticasConfirmacion,
  SincronizacionCalendario,
  GestorEnlacesReserva,
  HistorialCliente,
  ClienteAutocomplete,
  EstadisticasNoShows,
  ConfiguracionPoliticaCancelacion,
  EstadisticasCumplimientoPolitica,
  DashboardMetricasSesiones,
  MapaCalorHorarios,
  DashboardFinanciero,
  GestorListaEspera,
  HistorialBasicoSesiones,
  ModalRapidoCrearSesion,
  ModalEditarSesion,
  ModalDetalleSesion,
} from '../components';
import { getCitas, crearCita, updateCita } from '../api/calendario';
import { Cita } from '../types';
import { isOnline, onOnlineStatusChange } from '../services/offlineStorage';

type TabPrincipal = 'calendario' | 'disponibilidad' | 'automatizaciones' | 'clientes' | 'politicas' | 'analitica';
type VistaCalendario = 'calendario' | 'personal' | 'centro' | 'dia-completo';

// Componente para el tab de Analítica
const AnaliticaTab: React.FC<{ esEntrenador: boolean; userId?: string; role: 'entrenador' | 'gimnasio' }> = ({ 
  esEntrenador, 
  userId, 
  role 
}) => {
  const isMobile = useIsMobile();
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [fechaInicio, setFechaInicio] = useState<string>(() => {
    const fecha = new Date();
    fecha.setDate(1); // Primer día del mes
    return fecha.toISOString().split('T')[0];
  });
  const [fechaFin, setFechaFin] = useState<string>(() => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() + 1);
    fecha.setDate(0); // Último día del mes actual
    return fecha.toISOString().split('T')[0];
  });

  const rangoFechas: RangoFechas = {
    fechaInicio: new Date(fechaInicio),
    fechaFin: (() => {
      const fin = new Date(fechaFin);
      fin.setHours(23, 59, 59, 999);
      return fin;
    })(),
  };

  const contexto: ContextoMetricas = {
    userId,
    role,
  };

  return (
    <div className="space-y-6">
      {/* Texto Introductorio */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-blue-900 mb-2">
                Cómo usar la Analítica de Agenda
              </h3>
              <p className="text-blue-800 mb-3">
                Esta sección te proporciona datos clave para <strong>mejorar la ocupación</strong> de tu agenda y 
                <strong> optimizar la planificación de horarios</strong>. Utiliza estos insights para tomar decisiones informadas.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white/70 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">📊 Analytics de Ocupación</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Identifica franjas horarias con mayor demanda</li>
                    <li>• Detecta días de la semana más ocupados</li>
                    <li>• Analiza qué tipos de sesión son más populares</li>
                    <li>• Compara períodos para identificar tendencias</li>
                  </ul>
                </div>
                <div className="bg-white/70 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">💰 Dashboard Financiero</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Monitorea ingresos por sesión y ticket medio</li>
                    <li>• Evalúa el impacto económico de cancelaciones</li>
                    <li>• Analiza pérdidas por no-shows</li>
                    <li>• Identifica oportunidades de optimización</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Filtros Comunes - Colapsable en móvil */}
      <Card className="bg-white shadow-sm">
        <div className={isMobile ? 'p-4' : 'p-6'}>
          <div className={`flex items-center justify-between ${isMobile ? 'mb-3' : 'mb-4'}`}>
            <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-900`}>Filtros</h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className={isMobile ? '!px-3 !py-1.5 text-xs' : ''}
            >
              <Filter className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} mr-2`} />
              {isMobile ? (mostrarFiltros ? 'Ocultar' : 'Filtros') : (mostrarFiltros ? 'Ocultar' : 'Mostrar') + ' Filtros'}
            </Button>
          </div>
          {mostrarFiltros && (
            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Inicio
                </label>
                <Input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Fin
                </label>
                <Input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Analytics de Ocupación */}
      <AnalyticsOcupacion rangoFechas={rangoFechas} contexto={contexto} />

      {/* Dashboard Financiero */}
      <DashboardFinanciero rangoFechas={rangoFechas} contexto={contexto} />

      {/* Componentes adicionales para entrenadores */}
      {esEntrenador && (
        <>
          <EstadisticasConfirmacion />
          <EstadisticasNoShows />
          <EstadisticasCumplimientoPolitica />
          <DashboardMetricasSesiones />
          <MapaCalorHorarios />
        </>
      )}
    </div>
  );
};

export default function AgendaCalendarioPage() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const esEntrenador = user?.role === 'entrenador';
  const role = esEntrenador ? 'entrenador' : 'gimnasio';
  const [activeTab, setActiveTab] = useState<TabPrincipal>('calendario');
  const [mostrarMenuTabs, setMostrarMenuTabs] = useState(false);
  const menuTabsRef = useRef<HTMLDivElement>(null);
  const [vistaCalendario, setVistaCalendario] = useState<VistaCalendario>(
    esEntrenador ? 'personal' : 'centro'
  );
  const [citas, setCitas] = React.useState<Cita[]>([]);
  const [isOffline, setIsOffline] = React.useState(!isOnline());
  
  // Estados globales de carga y error
  const [loadingInicial, setLoadingInicial] = React.useState(true);
  const [globalError, setGlobalError] = React.useState<string | null>(null);
  
  // Cerrar menú de tabs al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuTabsRef.current && !menuTabsRef.current.contains(event.target as Node)) {
        setMostrarMenuTabs(false);
      }
    };

    if (mostrarMenuTabs) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [mostrarMenuTabs]);

  // Listener para cambios de estado de conexión
  useEffect(() => {
    // Verificar estado inicial
    setIsOffline(!isOnline());

    // Registrar listener para cambios de conexión
    const unsubscribe = onOnlineStatusChange((online) => {
      setIsOffline(!online);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  const [mostrarModalCita, setMostrarModalCita] = React.useState(false);
  const [clienteSeleccionadoHistorial, setClienteSeleccionadoHistorial] = React.useState<{ id: string; nombre: string } | null>(null);
  
  // Estados para modales de gestión de citas
  const [mostrarModalRapidoCrear, setMostrarModalRapidoCrear] = React.useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = React.useState(false);
  const [mostrarModalDetalle, setMostrarModalDetalle] = React.useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = React.useState<Cita | null>(null);
  const [slotSeleccionado, setSlotSeleccionado] = React.useState<{ fecha: Date; hora: number; minuto: number } | null>(null);
  const [formCita, setFormCita] = React.useState(() => ({
    titulo: '',
    tipo: esEntrenador ? 'sesion-1-1' : 'clase-colectiva',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    clienteNombre: '',
    instructorNombre: '',
    capacidadMaxima: '20',
    inscritos: '0',
    notas: '',
  }));

  // Cargar datos iniciales críticos
  React.useEffect(() => {
    const cargarDatosIniciales = async () => {
      setLoadingInicial(true);
      setGlobalError(null);
      
      try {
        // Cargar citas iniciales (crítico para el módulo)
        const fechaInicio = new Date();
        const fechaFin = new Date();
        fechaFin.setMonth(fechaFin.getMonth() + 1);
        const citasData = await getCitas(fechaInicio, fechaFin, role);
        setCitas(citasData);
        
        // Si todo carga correctamente, limpiar errores
        setGlobalError(null);
      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
        setGlobalError('No se pudieron cargar los datos principales. Por favor, intenta de nuevo.');
      } finally {
        setLoadingInicial(false);
      }
    };
    
    cargarDatosIniciales();
  }, [role]);
  
  // Función para reintentar carga de datos
  const handleReintentar = React.useCallback(() => {
    setGlobalError(null);
    setLoadingInicial(true);
    
    const cargarDatosIniciales = async () => {
      try {
        const fechaInicio = new Date();
        const fechaFin = new Date();
        fechaFin.setMonth(fechaFin.getMonth() + 1);
        const citasData = await getCitas(fechaInicio, fechaFin, role);
        setCitas(citasData);
        setGlobalError(null);
      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
        setGlobalError('No se pudieron cargar los datos principales. Por favor, intenta de nuevo.');
      } finally {
        setLoadingInicial(false);
      }
    };
    
    cargarDatosIniciales();
  }, [role]);

  // Definir tabs principales según rol
  // Para entrenadores: priorizar Calendario y Disponibilidad
  // Para gimnasios: incluir Analítica de forma destacada
  const tabsPrincipales = useMemo(() => {
    const allTabs: Array<{ id: TabPrincipal; label: string; icon: React.ReactNode }> = [
      {
        id: 'calendario',
        label: 'Calendario',
        icon: <CalendarDays className="w-4 h-4" />,
      },
      {
        id: 'disponibilidad',
        label: 'Disponibilidad',
        icon: <Clock className="w-4 h-4" />,
      },
      {
        id: 'automatizaciones',
        label: 'Automatizaciones',
        icon: <Zap className="w-4 h-4" />,
      },
      {
        id: 'clientes',
        label: 'Clientes',
        icon: <Users className="w-4 h-4" />,
      },
      {
        id: 'politicas',
        label: 'Políticas',
        icon: <Shield className="w-4 h-4" />,
      },
      {
        id: 'analitica',
        label: 'Analítica',
        icon: <BarChart3 className="w-4 h-4" />,
      },
    ];

    // Filtrar y ordenar tabs según rol
    const filteredTabs = allTabs.filter((tab) => {
      if (tab.id === 'clientes' && !esEntrenador) return false;
      if (tab.id === 'politicas' && !esEntrenador) return false;
      return true;
    });

    // Ordenar según prioridad por rol
    if (esEntrenador) {
      // Para entrenadores: Calendario y Disponibilidad primero
      return filteredTabs.sort((a, b) => {
        const order: TabPrincipal[] = ['calendario', 'disponibilidad', 'automatizaciones', 'clientes', 'politicas', 'analitica'];
        return order.indexOf(a.id) - order.indexOf(b.id);
      });
    } else {
      // Para gimnasios: mantener orden pero destacar Analítica
      return filteredTabs.sort((a, b) => {
        const order: TabPrincipal[] = ['calendario', 'disponibilidad', 'automatizaciones', 'analitica'];
        return order.indexOf(a.id) - order.indexOf(b.id);
      });
    }
  }, [esEntrenador]);

  const handleCrearCita = async () => {
    const fechaCompleta = new Date(`${formCita.fecha}T${formCita.horaInicio}`);
    const fechaFin = new Date(`${formCita.fecha}T${formCita.horaFin}`);
    
    const nuevaCita = {
      titulo: formCita.titulo,
      tipo: formCita.tipo as any,
      estado: 'confirmada' as any,
      fechaInicio: fechaCompleta,
      fechaFin: fechaFin,
      ...(esEntrenador 
        ? { clienteNombre: formCita.clienteNombre }
        : { 
            instructorNombre: formCita.instructorNombre,
            capacidadMaxima: parseInt(formCita.capacidadMaxima),
            inscritos: parseInt(formCita.inscritos),
          }
      ),
      notas: formCita.notas || undefined,
    };
    
    const citaCreada = await crearCita(nuevaCita);
    setCitas([...citas, citaCreada]);
    setMostrarModalCita(false);
    setFormCita(() => ({
      titulo: '',
      tipo: esEntrenador ? 'sesion-1-1' : 'clase-colectiva',
      fecha: '',
      horaInicio: '',
      horaFin: '',
      clienteNombre: '',
      instructorNombre: '',
      capacidadMaxima: '20',
      inscritos: '0',
      notas: '',
    }));
  };

  // Handlers para gestión de citas desde el calendario
  const handleSelectSlot = (fecha: Date, hora: number, minuto: number) => {
    setSlotSeleccionado({ fecha, hora, minuto });
    setMostrarModalRapidoCrear(true);
  };

  const handleSelectCita = (cita: Cita) => {
    setCitaSeleccionada(cita);
    setMostrarModalDetalle(true);
  };

  const handleCitaCreada = (cita: Cita) => {
    setCitas(prev => [...prev, cita]);
    setMostrarModalRapidoCrear(false);
    setSlotSeleccionado(null);
  };

  const handleCitaActualizada = (cita: Cita) => {
    setCitas(prev => prev.map(c => (c.id === cita.id ? cita : c)));
    setMostrarModalEditar(false);
    setCitaSeleccionada(null);
  };

  const handleEditarSesion = (cita: Cita) => {
    setCitaSeleccionada(cita);
    setMostrarModalEditar(true);
  };

  const handleCancelarSesion = (cita: Cita) => {
    // Abrir modal de cancelación o actualizar estado directamente
    updateCita(cita.id, { estado: 'cancelada' }, cita, user?.id).then(citaCancelada => {
      setCitas(prev => prev.map(c => (c.id === citaCancelada.id ? citaCancelada : c)));
    });
  };

  const handleReprogramarSesion = (cita: Cita) => {
    // Abrir modal de edición para reprogramar
    setCitaSeleccionada(cita);
    setMostrarModalEditar(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'calendario':
        return (
          <div className="space-y-6">
            {/* Selector de vistas dentro del tab Calendario - Adaptado para móvil */}
            <Card className="p-0 bg-white shadow-sm">
              <div className={`${isMobile ? 'px-3 py-2' : 'px-4 py-3'} border-b border-gray-200`}>
                <div className={`flex items-center ${isMobile ? 'flex-col gap-3' : 'justify-between'}`}>
                  <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900 ${isMobile ? 'w-full' : ''}`}>
                    {isMobile ? 'Vista' : 'Vista de Calendario'}
                  </h3>
                  <div className={`flex items-center ${isMobile ? 'w-full justify-between gap-1' : 'gap-2'}`}>
                    {esEntrenador ? (
                      <>
                        <Button
                          variant="ghost"
                          size={isMobile ? 'sm' : 'sm'}
                          onClick={() => setVistaCalendario('calendario')}
                          className={`${vistaCalendario === 'calendario' ? 'bg-blue-100 text-blue-900' : ''} ${isMobile ? '!px-2 !py-1 text-xs flex-1' : ''}`}
                        >
                          {isMobile ? 'Cal.' : 'Calendario'}
                        </Button>
                        <Button
                          variant="ghost"
                          size={isMobile ? 'sm' : 'sm'}
                          onClick={() => setVistaCalendario('personal')}
                          className={`${vistaCalendario === 'personal' ? 'bg-blue-100 text-blue-900' : ''} ${isMobile ? '!px-2 !py-1 text-xs flex-1' : ''}`}
                        >
                          Personal
                        </Button>
                        <Button
                          variant="ghost"
                          size={isMobile ? 'sm' : 'sm'}
                          onClick={() => setVistaCalendario('dia-completo')}
                          className={`${vistaCalendario === 'dia-completo' ? 'bg-blue-100 text-blue-900' : ''} ${isMobile ? '!px-2 !py-1 text-xs flex-1' : ''}`}
                        >
                          {isMobile ? 'Día' : 'Día Completo'}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size={isMobile ? 'sm' : 'sm'}
                          onClick={() => setVistaCalendario('calendario')}
                          className={`${vistaCalendario === 'calendario' ? 'bg-blue-100 text-blue-900' : ''} ${isMobile ? '!px-2 !py-1 text-xs flex-1' : ''}`}
                        >
                          {isMobile ? 'Cal.' : 'Calendario'}
                        </Button>
                        <Button
                          variant="ghost"
                          size={isMobile ? 'sm' : 'sm'}
                          onClick={() => setVistaCalendario('centro')}
                          className={`${vistaCalendario === 'centro' ? 'bg-blue-100 text-blue-900' : ''} ${isMobile ? '!px-2 !py-1 text-xs flex-1' : ''}`}
                        >
                          Centro
                        </Button>
                        <Button
                          variant="ghost"
                          size={isMobile ? 'sm' : 'sm'}
                          onClick={() => setVistaCalendario('dia-completo')}
                          className={`${vistaCalendario === 'dia-completo' ? 'bg-blue-100 text-blue-900' : ''} ${isMobile ? '!px-2 !py-1 text-xs flex-1' : ''}`}
                        >
                          {isMobile ? 'Día' : 'Día Completo'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Renderizar vista seleccionada */}
            {vistaCalendario === 'calendario' && (
              <AgendaCalendar 
                role={role} 
                citasAdicionales={citas}
                onSelectSlot={handleSelectSlot}
                onSelectCita={handleSelectCita}
              />
            )}
            
            {vistaCalendario === 'personal' && esEntrenador && (
              <VistaPersonal 
                citas={citas} 
                entrenadorId={user?.id}
              />
            )}
            
            {vistaCalendario === 'centro' && !esEntrenador && (
              <VistaCentro citas={citas} />
            )}
            
            {vistaCalendario === 'dia-completo' && (
              <VistaDiaCompleto
                citas={citas}
                fecha={new Date()}
                onEditarSesion={(cita) => {
                  // Aquí se puede abrir un modal de edición si es necesario
                  console.log('Editar sesión:', cita);
                }}
                onCancelarSesion={(cita) => {
                  // Aquí se puede abrir un modal de cancelación si es necesario
                  console.log('Cancelar sesión:', cita);
                }}
                onVerDetalle={(cita) => {
                  // Aquí se puede abrir un modal de detalle si es necesario
                  console.log('Ver detalle:', cita);
                }}
              />
            )}
          </div>
        );

      case 'disponibilidad':
        return (
          <div className="space-y-6">
            {/* Bloque de Horarios */}
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <h2 className="text-2xl font-bold text-gray-900">Horarios de Trabajo</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {esEntrenador 
                    ? 'Configura tus horarios de disponibilidad semanal y gestiona plantillas'
                    : 'Gestiona los horarios de trabajo por entrenador, sala o tipo de servicio'}
                </p>
              </div>
              {esEntrenador ? (
                <ConfiguradorHorariosTrabajo />
              ) : (
                <GestorHorarios />
              )}
            </div>

            {/* Bloque de Bloqueos */}
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <h2 className="text-2xl font-bold text-gray-900">Bloqueos de Agenda</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Bloquea días completos o rangos de horas para evitar agendamiento
                </p>
              </div>
              <BloqueosAgenda />
            </div>

            {/* Configuraciones adicionales para entrenadores */}
            {esEntrenador && (
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-2">
                  <h2 className="text-2xl font-bold text-gray-900">Configuraciones Adicionales</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Ajustes adicionales para optimizar tu disponibilidad
                  </p>
                </div>
                <div className="space-y-6">
                  <ConfiguracionTiempoDescanso />
                  <SincronizacionCalendario />
                  <GestorEnlacesReserva />
                </div>
              </div>
            )}
          </div>
        );

      case 'automatizaciones':
        return (
          <div className="space-y-6">
            <RecordatoriosAutomaticos />
            {esEntrenador && (
              <>
                <ConfiguracionResumenDiario />
                <VistaResumenDiario />
              </>
            )}
          </div>
        );

      case 'clientes':
        if (!esEntrenador) return null;
        return (
          <div className="space-y-8">
            {/* Bloque: Lista de Espera */}
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <h2 className="text-2xl font-bold text-gray-900">Lista de Espera</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Gestiona los clientes que están esperando un hueco disponible
                </p>
              </div>
              
              {/* Mensaje explicativo sobre uso de lista de espera */}
              <Card className="bg-blue-50 border-blue-200 shadow-sm">
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900 mb-1">¿Cómo usar la Lista de Espera?</h3>
                      <p className="text-sm text-blue-800">
                        La lista de espera te ayuda a <strong>reducir pérdidas de ingresos</strong> cuando se liberan huecos en tu agenda. 
                        Cuando un cliente cancela una sesión o queda un hueco libre, puedes asignarlo rápidamente a un cliente de la lista 
                        de espera. Esto te permite mantener tu agenda llena y maximizar tus ingresos.
                      </p>
                      <ul className="text-sm text-blue-800 mt-2 ml-4 list-disc space-y-1">
                        <li>Agrega clientes que buscan sesiones en horarios específicos</li>
                        <li>Cuando se libere un hueco, usa el botón "Asignar hueco" para llenarlo rápidamente</li>
                        <li>Los clientes se ordenan por prioridad (los más antiguos primero)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              <GestorListaEspera />
            </div>

            {/* Bloque: Historial */}
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <h2 className="text-2xl font-bold text-gray-900">Historial de Sesiones</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Revisa las últimas sesiones completadas con tus clientes
                </p>
              </div>
              
              <HistorialBasicoSesiones />
              
              {/* Historial detallado por cliente (opcional) */}
              <Card className="bg-white shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial Detallado por Cliente</h3>
                  <ClienteAutocomplete
                    value={clienteSeleccionadoHistorial?.id || ''}
                    onChange={(id, nombre) => {
                      setClienteSeleccionadoHistorial(id ? { id, nombre } : null);
                    }}
                    label="Buscar cliente"
                    placeholder="Selecciona un cliente para ver su historial completo..."
                    role="entrenador"
                    userId={user?.id}
                  />
                </div>
              </Card>
              {clienteSeleccionadoHistorial && (
                <HistorialCliente
                  clienteId={clienteSeleccionadoHistorial.id}
                  clienteNombre={clienteSeleccionadoHistorial.nombre}
                />
              )}
            </div>
          </div>
        );

      case 'politicas':
        if (!esEntrenador) return null;
        return (
          <div className="space-y-6">
            <ConfiguracionPoliticaCancelacion />
          </div>
        );

      case 'analitica':
        return (
          <AnaliticaTab 
            esEntrenador={esEntrenador}
            userId={user?.id}
            role={role}
          />
        );

      default:
        return null;
    }
  };

  // Componente de skeleton para carga inicial
  const AgendaSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Skeleton del header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-6">
          <div className="animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-10 bg-gray-200 rounded-lg w-1/3 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded-lg w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Skeleton de tabs */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div className="animate-pulse flex flex-wrap gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded-xl w-24"></div>
                ))}
              </div>
            </div>
          </Card>

          {/* Skeleton del contenido principal */}
          <Card className="bg-white shadow-sm">
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded-lg w-1/4"></div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </Card>

          {/* Skeleton de métricas/tarjetas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-white shadow-sm">
                <div className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Componente de error global
  const ErrorGlobal = () => (
    <Card className="bg-white shadow-sm border-red-200">
      <div className="p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-red-900 mb-1">
              Error al cargar la agenda
            </h3>
            <p className="text-sm text-red-700 mb-4">
              {globalError || 'Ocurrió un error inesperado al cargar los datos principales. Por favor, intenta de nuevo.'}
            </p>
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleReintentar}
              className="bg-red-600 hover:bg-red-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  // Mostrar skeleton durante carga inicial
  if (loadingInicial && citas.length === 0 && !globalError) {
    return <AgendaSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header - Simplificado en móvil */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className={isMobile ? 'py-4' : 'py-6'}>
            <div className={`flex ${isMobile ? 'flex-col' : 'items-center justify-between'} gap-4`}>
              <div className={`flex items-center ${isMobile ? 'w-full justify-between' : ''}`}>
                <div className={`flex items-center ${isMobile ? 'flex-1' : ''}`}>
                  <div className={`${isMobile ? 'p-1.5' : 'p-2'} bg-blue-100 rounded-xl ${isMobile ? 'mr-3' : 'mr-4'} ring-1 ring-blue-200/70`}>
                    <CalendarDays size={isMobile ? 20 : 24} className="text-blue-600" />
                  </div>
                  <div>
                    <h1 className={`${isMobile ? 'text-xl' : 'text-3xl md:text-4xl'} font-extrabold tracking-tight text-gray-900`}>
                      {isMobile ? 'Agenda' : 'Agenda y Calendario'}
                    </h1>
                    {!isMobile && (
                      <p className="text-gray-600">
                        {esEntrenador 
                          ? 'Gestiona tu agenda personal con sesiones 1 a 1 y optimiza tu disponibilidad'
                          : 'Gestiona la agenda completa del centro con clases y servicios, y analiza el rendimiento'
                        }
                      </p>
                    )}
                  </div>
                </div>
                {isMobile && (
                  <div className="flex items-center gap-2">
                    {esEntrenador && (
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => setMostrarModalCita(true)}
                        className="!p-2"
                      >
                        <Plus size={18} />
                      </Button>
                    )}
                    {!esEntrenador && (
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => setMostrarModalCita(true)}
                        className="!p-2"
                      >
                        <Plus size={18} />
                      </Button>
                    )}
                  </div>
                )}
              </div>
              {!isMobile && (
                <div className="flex items-center gap-3">
                  {esEntrenador && (
                    <Button variant="primary" onClick={() => setMostrarModalCita(true)}>
                      <Plus size={20} className="mr-2" />
                      Nueva Cita 1:1
                    </Button>
                  )}
                  {!esEntrenador && (
                    <Button variant="primary" onClick={() => setMostrarModalCita(true)}>
                      <Plus size={20} className="mr-2" />
                      Publicar Nueva Clase
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className={`mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 ${isMobile ? 'py-4' : 'py-8'}`}>
        <div className="space-y-6">
          {/* Error Global - Mostrar solo si hay error crítico */}
          {globalError && <ErrorGlobal />}
          
          {/* Aviso de Modo Offline */}
          {isOffline && !globalError && (
            <Card className="bg-amber-50 border-amber-200 shadow-sm">
              <div className={`${isMobile ? 'p-3' : 'p-4'} flex items-start gap-3`}>
                <div className={`${isMobile ? 'p-1.5' : 'p-2'} bg-amber-100 rounded-lg flex-shrink-0`}>
                  <WifiOff className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-amber-600`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-amber-900 mb-1`}>
                    Modo Offline
                  </h3>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-amber-800`}>
                    Estás trabajando sin conexión. Los cambios que realices se guardarán localmente y se sincronizarán automáticamente cuando vuelva la conexión.
                  </p>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-amber-700 mt-1 italic`}>
                    Nota: Esta es una funcionalidad mock para pruebas de UX. La sincronización real se implementaría más adelante.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Sistema de Tabs Principales - Adaptado para móvil */}
          <Card className="p-0 bg-white shadow-sm">
            {isMobile ? (
              /* En móvil: Selector deslizable o menú dropdown */
              <div className="relative" ref={menuTabsRef}>
                <button
                  onClick={() => setMostrarMenuTabs(!mostrarMenuTabs)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                  aria-label="Seleccionar sección"
                >
                  <div className="flex items-center gap-2">
                    <span className={activeTab ? 'opacity-100' : 'opacity-70'}>
                      {tabsPrincipales.find(t => t.id === activeTab)?.icon}
                    </span>
                    <span className="font-medium text-gray-900">
                      {tabsPrincipales.find(t => t.id === activeTab)?.label}
                    </span>
                  </div>
                  <ChevronDown 
                    className={`w-4 h-4 text-gray-500 transition-transform ${mostrarMenuTabs ? 'rotate-180' : ''}`} 
                  />
                </button>
                {mostrarMenuTabs && (
                  <div className="border-t border-gray-200 bg-white">
                    <div className="max-h-64 overflow-y-auto">
                      {tabsPrincipales.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id);
                            setMostrarMenuTabs(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            activeTab === tab.id
                              ? 'bg-blue-50 text-blue-900 font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          role="tab"
                          aria-selected={activeTab === tab.id}
                        >
                          <span className={activeTab === tab.id ? 'opacity-100' : 'opacity-70'}>
                            {tab.icon}
                          </span>
                          <span>{tab.label}</span>
                          {activeTab === tab.id && (
                            <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* En desktop: Tabs horizontales */
              <div className="px-4 py-3">
                <div
                  role="tablist"
                  aria-label="Secciones principales"
                  className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-100 p-1"
                >
                  {tabsPrincipales.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      }`}
                      role="tab"
                      aria-selected={activeTab === tab.id}
                    >
                      <span className={activeTab === tab.id ? 'opacity-100' : 'opacity-70'}>
                        {tab.icon}
                      </span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Contenido de la Tab Activa */}
          <div className="mt-6">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Modal para Nueva Cita */}
      <Modal
        isOpen={mostrarModalCita}
        onClose={() => setMostrarModalCita(false)}
        title={esEntrenador ? 'Nueva Cita 1:1' : 'Publicar Nueva Clase'}
        size="lg"
        footer={
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={() => setMostrarModalCita(false)}>
              <X size={20} className="mr-2" />
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCrearCita}>
              <Plus size={20} className="mr-2" />
              {esEntrenador ? 'Crear Cita' : 'Publicar Clase'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Título"
            value={formCita.titulo}
            onChange={(e) => setFormCita({ ...formCita, titulo: e.target.value })}
            placeholder={esEntrenador ? 'Sesión PT con...' : 'Yoga Matutino'}
            required
          />

          <Select
            label="Tipo"
            value={formCita.tipo}
            onChange={(e) => setFormCita({ ...formCita, tipo: e.target.value })}
            options={
              esEntrenador
                ? [
                    { value: 'sesion-1-1', label: 'Sesión 1:1' },
                    { value: 'videollamada', label: 'Videollamada' },
                    { value: 'evaluacion', label: 'Evaluación' },
                  ]
                : [
                    { value: 'clase-colectiva', label: 'Clase Colectiva' },
                    { value: 'fisioterapia', label: 'Fisioterapia' },
                  ]
            }
          />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Input
                label="Fecha"
                type="date"
                value={formCita.fecha}
                onChange={(e) => setFormCita({ ...formCita, fecha: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                label="Hora Inicio"
                type="time"
                value={formCita.horaInicio}
                onChange={(e) => setFormCita({ ...formCita, horaInicio: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                label="Hora Fin"
                type="time"
                value={formCita.horaFin}
                onChange={(e) => setFormCita({ ...formCita, horaFin: e.target.value })}
                required
              />
            </div>
          </div>

          {esEntrenador ? (
            <Input
              label="Cliente"
              value={formCita.clienteNombre}
              onChange={(e) => setFormCita({ ...formCita, clienteNombre: e.target.value })}
              placeholder="Nombre del cliente"
              required
            />
          ) : (
            <>
              <Input
                label="Instructor"
                value={formCita.instructorNombre}
                onChange={(e) => setFormCita({ ...formCita, instructorNombre: e.target.value })}
                placeholder="Nombre del instructor"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Capacidad Máxima"
                  type="number"
                  value={formCita.capacidadMaxima}
                  onChange={(e) => setFormCita({ ...formCita, capacidadMaxima: e.target.value })}
                  required
                />
                <Input
                  label="Inscritos"
                  type="number"
                  value={formCita.inscritos}
                  onChange={(e) => setFormCita({ ...formCita, inscritos: e.target.value })}
                />
              </div>
            </>
          )}

          <Textarea
            label="Notas (opcional)"
            value={formCita.notas}
            onChange={(e) => setFormCita({ ...formCita, notas: e.target.value })}
            placeholder="Información adicional sobre la cita..."
            rows={3}
          />
        </div>
      </Modal>

      {/* Modal rápido crear sesión */}
      {esEntrenador && (
        <ModalRapidoCrearSesion
          isOpen={mostrarModalRapidoCrear}
          onClose={() => {
            setMostrarModalRapidoCrear(false);
            setSlotSeleccionado(null);
          }}
          onCitaCreada={handleCitaCreada}
          fechaInicial={slotSeleccionado?.fecha}
          horaInicial={slotSeleccionado ? { hora: slotSeleccionado.hora, minuto: slotSeleccionado.minuto } : undefined}
          role={role}
          userId={user?.id}
        />
      )}

      {/* Modal editar sesión */}
      {esEntrenador && (
        <ModalEditarSesion
          isOpen={mostrarModalEditar}
          onClose={() => {
            setMostrarModalEditar(false);
            setCitaSeleccionada(null);
          }}
          cita={citaSeleccionada}
          onSesionActualizada={handleCitaActualizada}
          role={role}
          userId={user?.id}
        />
      )}

      {/* Modal detalle sesión */}
      {esEntrenador && (
        <ModalDetalleSesion
          isOpen={mostrarModalDetalle}
          onClose={() => {
            setMostrarModalDetalle(false);
            setCitaSeleccionada(null);
          }}
          cita={citaSeleccionada}
          onEditarSesion={handleEditarSesion}
          onCancelarSesion={handleCancelarSesion}
          onReprogramarSesion={handleReprogramarSesion}
        />
      )}
    </div>
  );
}

