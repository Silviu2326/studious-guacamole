import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, AlertCircle, Calendar, ChevronDown, ChevronUp, Plus, Menu, Download, Sun } from 'lucide-react';
import { Card, Button, ConfirmModal } from '../../../components/componentsreutilizables';
import { Cita, VistaCalendario, BloqueoAgenda, ConfiguracionTiempoDescanso } from '../types';
import { getCitas, updateCita } from '../api/calendario';
import { getBloqueos } from '../api/disponibilidad';
import { getHorarioTrabajoActual, esHorarioDisponible } from '../api/horariosTrabajo';
import { getConfiguracionTiempoDescanso } from '../api/configuracion';
import { HorarioTrabajoSemanal } from '../types';
import { ModalRapidoCrearSesion } from './ModalRapidoCrearSesion';
import { ModalEditarSesion } from './ModalEditarSesion';
import { ModalCancelarSesion } from './ModalCancelarSesion';
import { ModalDetalleSesion } from './ModalDetalleSesion';
import { MenuContextualSesion, BotonAccionesRapidas } from './MenuContextualSesion';
import { NotificacionesSesion } from './NotificacionesSesion';
import { AccionesRapidasMobile } from './AccionesRapidasMobile';
import { ModalExportarAgenda } from './ModalExportarAgenda';
import { VistaDiaCompleto } from './VistaDiaCompleto';
import { useAuth } from '../../../context/AuthContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { useSwipe } from '../hooks/useSwipe';
import { initOfflineStorage, saveCitasOffline, getCitasOffline, isOnline, onOnlineStatusChange, addPendingChange } from '../services/offlineStorage';

interface AgendaCalendarProps {
  role: 'entrenador' | 'gimnasio';
  citasAdicionales?: Cita[];
  /** Callback cuando se selecciona una cita */
  onSelectCita?: (cita: Cita) => void;
  /** Callback cuando se selecciona un slot de tiempo */
  onSelectSlot?: (fecha: Date, hora: number, minuto: number) => void;
  /** Callback para crear sesión rápida */
  onCreateSesionRapida?: (fecha?: Date, hora?: number, minuto?: number) => void;
}

interface DropTarget {
  fecha: Date;
  hora: number;
  minuto: number;
}

export const AgendaCalendar: React.FC<AgendaCalendarProps> = ({ 
  role, 
  citasAdicionales = [],
  onSelectCita,
  onSelectSlot,
  onCreateSesionRapida,
}) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [fechaActual, setFechaActual] = useState(new Date());
  const [vista, setVista] = useState<VistaCalendario>(isMobile ? 'semana' : 'semana'); // Semana por defecto, especialmente en móvil
  
  // En móvil, forzar vista semana o día (no mes)
  const cambiarVista = (nuevaVista: VistaCalendario) => {
    if (isMobile && nuevaVista === 'mes') {
      // En móvil, no permitir vista mes, usar semana como alternativa
      setVista('semana');
    } else {
      setVista(nuevaVista);
    }
  };
  const [citas, setCitas] = useState<Cita[]>([]);
  const [bloqueos, setBloqueos] = useState<BloqueoAgenda[]>([]);
  const [horarioTrabajo, setHorarioTrabajo] = useState<HorarioTrabajoSemanal | null>(null);
  const [configuracionTiempoDescanso, setConfiguracionTiempoDescanso] = useState<ConfiguracionTiempoDescanso | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; cita: Cita | null; nuevaFecha: Date | null; overrideDescanso?: boolean }>({
    isOpen: false,
    cita: null,
    nuevaFecha: null,
  });
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [mostrarMiniCalendario, setMostrarMiniCalendario] = useState(false);
  const [proximosSlots, setProximosSlots] = useState<Array<{ fecha: Date; hora: number; minuto: number }>>([]);
  const [mostrarModalRapido, setMostrarModalRapido] = useState(false);
  const [slotSeleccionado, setSlotSeleccionado] = useState<{ fecha: Date; hora: number; minuto: number } | null>(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalCancelar, setMostrarModalCancelar] = useState(false);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [editarSerie, setEditarSerie] = useState(false);
  const [cancelarSerie, setCancelarSerie] = useState(false);
  const [menuContextual, setMenuContextual] = useState<{ cita: Cita; position: { x: number; y: number } } | null>(null);
  const [mostrarMenuVistas, setMostrarMenuVistas] = useState(false);
  const [mostrarModalExportar, setMostrarModalExportar] = useState(false);
  const [vistaDiaCompleto, setVistaDiaCompleto] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const semanaRef = useRef<HTMLDivElement>(null);

  // Configurar gestos swipe para cambiar semanas/días en móvil
  const diaRef = useRef<HTMLDivElement>(null);
  
  useSwipe(
    {
      onSwipeLeft: () => {
        if (isMobile) {
          if (vista === 'semana') {
            cambiarSemana('siguiente');
          } else if (vista === 'dia') {
            cambiarDia('siguiente');
          }
        }
      },
      onSwipeRight: () => {
        if (isMobile) {
          if (vista === 'semana') {
            cambiarSemana('anterior');
          } else if (vista === 'dia') {
            cambiarDia('anterior');
          }
        }
      },
    },
    { threshold: 50, preventDefault: false, elementRef: vista === 'semana' ? semanaRef : vista === 'dia' ? diaRef : undefined }
  );
  
  // Configuración de horas (6:00 a 22:00)
  const horaInicio = 6;
  const horaFin = 22;
  const slotMinutos = 30;

  // Modificado para mostrar Lunes a Domingo
  const getDiasSemana = (): Date[] => {
    const fecha = new Date(fechaActual);
    const dia = fecha.getDay(); // 0 = domingo, 1 = lunes, etc.
    // Calcular el lunes de esta semana
    const diff = dia === 0 ? -6 : 1 - dia; // Si es domingo, retroceder 6 días; si no, calcular diferencia hasta lunes
    const lunes = new Date(fecha);
    lunes.setDate(fecha.getDate() + diff);
    lunes.setHours(0, 0, 0, 0);
    
    const dias: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(lunes);
      dia.setDate(lunes.getDate() + i);
      dias.push(dia);
    }
    return dias;
  };

  // Cargar bloqueos de agenda
  const cargarBloqueos = async () => {
    let inicio: Date;
    let fin: Date;

    if (vista === 'semana') {
      const diasSemana = getDiasSemana();
      inicio = new Date(diasSemana[0]);
      inicio.setHours(0, 0, 0, 0);
      fin = new Date(diasSemana[6]);
      fin.setHours(23, 59, 59, 999);
    } else if (vista === 'dia') {
      inicio = new Date(fechaActual);
      inicio.setHours(0, 0, 0, 0);
      fin = new Date(fechaActual);
      fin.setHours(23, 59, 59, 999);
    } else {
      inicio = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
      fin = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
    }

    const bloqueosData = await getBloqueos(inicio, fin);
    setBloqueos(bloqueosData);
  };

  // Inicializar almacenamiento offline
  useEffect(() => {
    initOfflineStorage().catch((error) => {
      console.error('Error inicializando almacenamiento offline:', error);
    });

    // Listener de estado de conexión
    const unsubscribe = onOnlineStatusChange((online) => {
      if (online) {
        // Sincronizar cuando vuelva la conexión
        cargarCitas();
        cargarBloqueos();
      } else {
        // Cargar desde cache offline
        getCitasOffline().then((citasOffline) => {
          if (citasOffline.length > 0) {
            setCitas(citasOffline);
          }
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log('[AgendaCalendar] useEffect ejecutado, role:', role);
    if (isOnline()) {
      cargarCitas();
      cargarBloqueos();
    } else {
      // Cargar desde cache offline
      getCitasOffline().then((citasOffline) => {
        if (citasOffline.length > 0) {
          setCitas(citasOffline);
        }
      });
    }
    if (role === 'entrenador') {
      cargarHorarioTrabajo();
      cargarConfiguracionTiempoDescanso();
    }
  }, [fechaActual, role, vista]);

  const cargarConfiguracionTiempoDescanso = async () => {
    try {
      const config = await getConfiguracionTiempoDescanso(user?.id);
      setConfiguracionTiempoDescanso(config);
    } catch (error) {
      console.error('Error cargando configuración de tiempo de descanso:', error);
    }
  };

  const cargarHorarioTrabajo = async () => {
    try {
      const horario = await getHorarioTrabajoActual();
      setHorarioTrabajo(horario);
    } catch (error) {
      console.error('Error cargando horario de trabajo:', error);
    }
  };

  useEffect(() => {
    if (citasAdicionales.length > 0) {
      setCitas(prevCitas => {
        // Combinar citas existentes con las adicionales, evitando duplicados por ID
        const citasMap = new Map(prevCitas.map(c => [c.id, c]));
        citasAdicionales.forEach(c => citasMap.set(c.id, c));
        return Array.from(citasMap.values());
      });
    }
  }, [citasAdicionales]);

  // Calcular próximos slots disponibles - se ejecutará después de cargar citas y bloqueos
  useEffect(() => {
    // Esta función necesita acceso a getEstadoSlot, pero getEstadoSlot depende de citas y bloqueos
    // Por lo tanto, movemos la lógica directamente aquí
    const calcularSlots = () => {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const slotsDisponibles: Array<{ fecha: Date; hora: number; minuto: number }> = [];
      const slots = generarSlots();

      // Buscar en los próximos 14 días
      for (let dia = 0; dia < 14; dia++) {
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() + dia);

        for (const slot of slots) {
          const estado = getEstadoSlot(fecha, slot.hora, slot.minuto);
          if (estado === 'libre') {
            const slotFecha = new Date(fecha);
            slotFecha.setHours(slot.hora, slot.minuto, 0, 0);
            // Solo agregar slots futuros
            if (slotFecha > new Date()) {
              slotsDisponibles.push({ fecha, hora: slot.hora, minuto: slot.minuto });
            }
          }
          // Limitar a los primeros 5 slots disponibles
          if (slotsDisponibles.length >= 5) {
            break;
          }
        }
        if (slotsDisponibles.length >= 5) {
          break;
        }
      }

      setProximosSlots(slotsDisponibles);
    };

    const timer = setTimeout(calcularSlots, 200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [citas, bloqueos]);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Solo activar si no estamos escribiendo en un input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ctrl/Cmd + flecha izquierda: semana anterior
      if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowLeft') {
        e.preventDefault();
        cambiarSemana('anterior');
      }
      // Ctrl/Cmd + flecha derecha: semana siguiente
      else if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowRight') {
        e.preventDefault();
        cambiarSemana('siguiente');
      }
      // Ctrl/Cmd + T: ir a hoy
      else if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        setFechaActual(new Date());
      }
      // Escape: cerrar mini calendario
      else if (e.key === 'Escape' && mostrarMiniCalendario) {
        setMostrarMiniCalendario(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mostrarMiniCalendario]);

  // Cerrar mini calendario al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setMostrarMiniCalendario(false);
      }
    };

    if (mostrarMiniCalendario) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [mostrarMiniCalendario]);

  const cargarCitas = async () => {
    console.log('[AgendaCalendar] cargarCitas ejecutado');
    setLoading(true);
    let inicio: Date;
    let fin: Date;

    if (vista === 'semana') {
      const diasSemana = getDiasSemana();
      inicio = new Date(diasSemana[0]);
      inicio.setHours(0, 0, 0, 0);
      fin = new Date(diasSemana[6]);
      fin.setHours(23, 59, 59, 999);
    } else if (vista === 'dia') {
      inicio = new Date(fechaActual);
      inicio.setHours(0, 0, 0, 0);
      fin = new Date(fechaActual);
      fin.setHours(23, 59, 59, 999);
    } else {
      inicio = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
      fin = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
    }

    try {
      const citasData = await getCitas(inicio, fin, role);
      console.log('[AgendaCalendar] Citas recibidas:', citasData);
      console.log('[AgendaCalendar] Total citas:', citasData.length);
      setCitas(citasData);
      
      // Guardar en cache offline
      if (isOnline()) {
        await saveCitasOffline(citasData);
      }
    } catch (error) {
      console.error('Error cargando citas:', error);
      // Intentar cargar desde cache offline
      const citasOffline = await getCitasOffline();
      if (citasOffline.length > 0) {
        setCitas(citasOffline);
      }
    } finally {
      setLoading(false);
    }
  };

  const cambiarMes = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setMonth(fechaActual.getMonth() + (direccion === 'siguiente' ? 1 : -1));
    setFechaActual(nuevaFecha);
  };

  const cambiarSemana = useCallback((direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setDate(fechaActual.getDate() + (direccion === 'siguiente' ? 7 : -7));
    setFechaActual(nuevaFecha);
  }, [fechaActual]);

  const cambiarDia = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setDate(fechaActual.getDate() + (direccion === 'siguiente' ? 1 : -1));
    setFechaActual(nuevaFecha);
  };

  const irAHoy = () => {
    setFechaActual(new Date());
    setMostrarMiniCalendario(false);
  };

  const seleccionarFecha = (fecha: Date) => {
    setFechaActual(fecha);
    setMostrarMiniCalendario(false);
  };

  const getDiasMes = () => {
    const primerDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    const ultimoDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaInicioSemana = primerDia.getDay();

    const dias: (Date | null)[] = [];
    // Días vacíos al inicio
    for (let i = 0; i < diaInicioSemana; i++) {
      dias.push(null);
    }
    // Días del mes
    for (let dia = 1; dia <= diasEnMes; dia++) {
      dias.push(new Date(fechaActual.getFullYear(), fechaActual.getMonth(), dia));
    }
    return dias;
  };

  const getCitasDelDia = (fecha: Date | null): Cita[] => {
    if (!fecha) return [];
    const filtered = citas.filter(cita => {
      const fechaCita = new Date(cita.fechaInicio);
      return fechaCita.getDate() === fecha.getDate() &&
        fechaCita.getMonth() === fecha.getMonth() &&
        fechaCita.getFullYear() === fecha.getFullYear();
    });
    return filtered.sort((a, b) => 
      new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
    );
  };

  const getCitaEnSlot = (fecha: Date, hora: number, minuto: number): Cita | null => {
    const slotInicio = new Date(fecha);
    slotInicio.setHours(hora, minuto, 0, 0);
    const slotFin = new Date(slotInicio);
    slotFin.setMinutes(slotFin.getMinutes() + slotMinutos);

    return citas.find(cita => {
      const citaInicio = new Date(cita.fechaInicio);
      const citaFin = new Date(cita.fechaFin);
      // Verificar si la cita se solapa con el slot
      return citaInicio < slotFin && citaFin > slotInicio &&
        citaInicio.getDate() === fecha.getDate() &&
        citaInicio.getMonth() === fecha.getMonth() &&
        citaInicio.getFullYear() === fecha.getFullYear();
    }) || null;
  };

  // Determinar si un slot está bloqueado
  const esSlotBloqueado = (fecha: Date, hora: number, minuto: number): boolean => {
    const slotInicio = new Date(fecha);
    slotInicio.setHours(hora, minuto, 0, 0);
    const slotFin = new Date(slotInicio);
    slotFin.setMinutes(slotFin.getMinutes() + slotMinutos);

    return bloqueos.some(bloqueo => {
      // Si es bloqueo completo, verificar si el slot está en el rango de fechas
      if (bloqueo.bloqueoCompleto) {
        const bloqueoInicio = new Date(bloqueo.fechaInicio);
        bloqueoInicio.setHours(0, 0, 0, 0);
        const bloqueoFin = new Date(bloqueo.fechaFin);
        bloqueoFin.setHours(23, 59, 59, 999);
        
        const slotFecha = new Date(fecha);
        slotFecha.setHours(0, 0, 0, 0);
        
        return slotFecha >= bloqueoInicio && slotFecha <= bloqueoFin;
      } else {
        // Si es bloqueo parcial, verificar si el slot está en el rango de horas
        const bloqueoInicio = new Date(bloqueo.fechaInicio);
        const bloqueoFin = new Date(bloqueo.fechaFin);
        
        // Verificar que sea el mismo día
        const mismoDia = bloqueoInicio.getDate() === fecha.getDate() &&
          bloqueoInicio.getMonth() === fecha.getMonth() &&
          bloqueoInicio.getFullYear() === fecha.getFullYear();
        
        if (!mismoDia) return false;
        
        // Verificar si el slot se solapa con el rango de horas bloqueado
        return bloqueoInicio < slotFin && bloqueoFin > slotInicio;
      }
    });
  };

  // Determinar el estado de un slot (libre, ocupado, bloqueado, fuera-horario)
  type EstadoSlot = 'libre' | 'ocupado' | 'bloqueado' | 'fuera-horario';
  const getEstadoSlot = (fecha: Date, hora: number, minuto: number): EstadoSlot => {
    if (esSlotBloqueado(fecha, hora, minuto)) {
      return 'bloqueado';
    }
    if (getCitaEnSlot(fecha, hora, minuto)) {
      return 'ocupado';
    }
    // Si es entrenador, verificar que el horario esté dentro del horario de trabajo
    if (role === 'entrenador' && horarioTrabajo) {
      if (!esHorarioDisponible(horarioTrabajo, fecha, hora, minuto)) {
        return 'fuera-horario';
      }
    }
    return 'libre';
  };

  // Obtener color del slot según su estado
  const getColorSlot = (estado: EstadoSlot): string => {
    switch (estado) {
      case 'libre':
        return 'bg-green-50 hover:bg-green-100 border-green-200';
      case 'ocupado':
        return 'bg-blue-50 hover:bg-blue-100 border-blue-200';
      case 'bloqueado':
        return 'bg-gray-100 hover:bg-gray-200 border-gray-300 opacity-60 cursor-not-allowed';
      case 'fuera-horario':
        return 'bg-orange-50 hover:bg-orange-100 border-orange-200 opacity-50 cursor-not-allowed';
      default:
        return 'bg-white hover:bg-slate-50 border-slate-100';
    }
  };

  // Calcular disponibilidad porcentual por día
  const calcularDisponibilidadDia = (fecha: Date): number => {
    const slots = generarSlots();
    let slotsLibres = 0;
    let slotsTotales = slots.length;

    slots.forEach(slot => {
      const estado = getEstadoSlot(fecha, slot.hora, slot.minuto);
      if (estado === 'libre') {
        slotsLibres++;
      }
    });

    return Math.round((slotsLibres / slotsTotales) * 100);
  };


  const getColorPorTipo = (tipo: string) => {
    const colores: Record<string, string> = {
      'sesion-1-1': 'bg-blue-500',
      'videollamada': 'bg-purple-500',
      'evaluacion': 'bg-orange-500',
      'clase-colectiva': 'bg-green-500',
      'fisioterapia': 'bg-pink-500',
      'mantenimiento': 'bg-gray-500',
      'otro': 'bg-indigo-500',
    };
    return colores[tipo] || 'bg-gray-500';
  };

  // Obtener color por estado de sesión (para user story 2)
  const getColorPorEstado = (estado: string): string => {
    const colores: Record<string, string> = {
      'completada': 'bg-green-500 border-green-600', // Verde para completada
      'no-show': 'bg-red-500 border-red-600', // Rojo para no-show
      'cancelada': 'bg-yellow-500 border-yellow-600', // Amarillo para cancelada
      'pendiente': 'bg-gray-400 border-gray-500',
      'confirmada': 'bg-blue-500 border-blue-600',
      'en-curso': 'bg-purple-500 border-purple-600',
    };
    return colores[estado] || 'bg-gray-500 border-gray-600';
  };

  // Combinar color por tipo y estado (prioridad al estado)
  const getColorCita = (cita: Cita): string => {
    // Si la sesión está completada, no-show o cancelada, usar color por estado
    if (cita.estado === 'completada' || cita.estado === 'no-show' || cita.estado === 'cancelada') {
      return getColorPorEstado(cita.estado);
    }
    // Sino, usar color por tipo
    return getColorPorTipo(cita.tipo);
  };

  // Generar slots de tiempo
  const generarSlots = () => {
    const slots: { hora: number; minuto: number }[] = [];
    for (let hora = horaInicio; hora < horaFin; hora++) {
      slots.push({ hora, minuto: 0 });
      slots.push({ hora, minuto: 30 });
    }
    return slots;
  };

  const slots = generarSlots();

  // Funciones de drag & drop
  const handleDragStart = (e: React.DragEvent, cita: Cita) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', cita.id);
    setConflictError(null);
  };

  const handleDragEnd = () => {
    setDropTarget(null);
  };

  const handleDragOver = (e: React.DragEvent, fecha: Date, hora: number, minuto: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget({ fecha, hora, minuto });
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const validarConflicto = (cita: Cita, nuevaFecha: Date, nuevaHora: number, nuevoMinuto: number, overrideDescanso: boolean = false): { error: string | null; requiereOverride: boolean } => {
    const nuevaFechaInicio = new Date(nuevaFecha);
    nuevaFechaInicio.setHours(nuevaHora, nuevoMinuto, 0, 0);
    
    const duracion = new Date(cita.fechaFin).getTime() - new Date(cita.fechaInicio).getTime();
    const nuevaFechaFin = new Date(nuevaFechaInicio.getTime() + duracion);

    // Verificar conflictos con otras citas (excluyendo la cita que se está moviendo)
    const tieneConflicto = citas.some(otraCita => {
      if (otraCita.id === cita.id) return false;
      
      const otraInicio = new Date(otraCita.fechaInicio);
      const otraFin = new Date(otraCita.fechaFin);
      
      // Verificar solapamiento
      return nuevaFechaInicio < otraFin && nuevaFechaFin > otraInicio;
    });

    if (tieneConflicto) {
      return { error: 'Ya existe una cita en este horario. Por favor, elige otro horario.', requiereOverride: false };
    }

    // Verificar que esté dentro del rango de horas configurado
    if (nuevaHora < horaInicio || (nuevaHora >= horaFin && nuevoMinuto > 0)) {
      return { error: `Las horas deben estar entre ${horaInicio}:00 y ${horaFin}:00`, requiereOverride: false };
    }

    // Si es entrenador, verificar que el horario esté dentro del horario de trabajo configurado
    if (role === 'entrenador' && horarioTrabajo) {
      if (!esHorarioDisponible(horarioTrabajo, nuevaFecha, nuevaHora, nuevoMinuto)) {
        return { error: 'Este horario está fuera de tu horario de trabajo configurado. Por favor, elige otro horario.', requiereOverride: false };
      }
    }

    // Verificar tiempo de descanso si está activo
    if (role === 'entrenador' && configuracionTiempoDescanso?.activo && !overrideDescanso) {
      const tiempoMinimoMs = configuracionTiempoDescanso.tiempoMinimoMinutos * 60 * 1000;
      
      // Verificar citas anteriores (debe haber tiempo de descanso después de la cita anterior)
      const citaAnterior = citas
        .filter(c => c.id !== cita.id)
        .filter(c => {
          const cInicio = new Date(c.fechaInicio);
          return cInicio < nuevaFechaInicio;
        })
        .sort((a, b) => new Date(b.fechaFin).getTime() - new Date(a.fechaFin).getTime())[0];
      
      if (citaAnterior) {
        const finAnterior = new Date(citaAnterior.fechaFin);
        const tiempoEntreSesiones = nuevaFechaInicio.getTime() - finAnterior.getTime();
        
        if (tiempoEntreSesiones < tiempoMinimoMs) {
          const minutosFaltantes = Math.ceil((tiempoMinimoMs - tiempoEntreSesiones) / (60 * 1000));
          if (configuracionTiempoDescanso.permitirOverride) {
            return { 
              error: `Se requiere un tiempo mínimo de descanso de ${configuracionTiempoDescanso.tiempoMinimoMinutos} minutos entre sesiones. Faltan ${minutosFaltantes} minutos.`, 
              requiereOverride: true 
            };
          } else {
            return { 
              error: `Se requiere un tiempo mínimo de descanso de ${configuracionTiempoDescanso.tiempoMinimoMinutos} minutos entre sesiones. Faltan ${minutosFaltantes} minutos.`, 
              requiereOverride: false 
            };
          }
        }
      }
      
      // Verificar citas siguientes (debe haber tiempo de descanso antes de la cita siguiente)
      const citaSiguiente = citas
        .filter(c => c.id !== cita.id)
        .filter(c => {
          const cInicio = new Date(c.fechaInicio);
          return cInicio > nuevaFechaFin;
        })
        .sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime())[0];
      
      if (citaSiguiente) {
        const inicioSiguiente = new Date(citaSiguiente.fechaInicio);
        const tiempoEntreSesiones = inicioSiguiente.getTime() - nuevaFechaFin.getTime();
        
        if (tiempoEntreSesiones < tiempoMinimoMs) {
          const minutosFaltantes = Math.ceil((tiempoMinimoMs - tiempoEntreSesiones) / (60 * 1000));
          if (configuracionTiempoDescanso.permitirOverride) {
            return { 
              error: `Se requiere un tiempo mínimo de descanso de ${configuracionTiempoDescanso.tiempoMinimoMinutos} minutos entre sesiones. Faltan ${minutosFaltantes} minutos.`, 
              requiereOverride: true 
            };
          } else {
            return { 
              error: `Se requiere un tiempo mínimo de descanso de ${configuracionTiempoDescanso.tiempoMinimoMinutos} minutos entre sesiones. Faltan ${minutosFaltantes} minutos.`, 
              requiereOverride: false 
            };
          }
        }
      }
    }

    return { error: null, requiereOverride: false };
  };

  const handleDrop = (e: React.DragEvent, fecha: Date, hora: number, minuto: number) => {
    e.preventDefault();
    const citaId = e.dataTransfer.getData('text/plain');
    const cita = citas.find(c => c.id === citaId);

    if (!cita) {
      setDropTarget(null);
      return;
    }

    const nuevaFecha = new Date(fecha);
    nuevaFecha.setHours(hora, minuto, 0, 0);

    const validacion = validarConflicto(cita, fecha, hora, minuto);
    if (validacion.error) {
      if (validacion.requiereOverride) {
        // Si requiere override, mostrar modal de confirmación con opción de override
        setConfirmModal({
          isOpen: true,
          cita,
          nuevaFecha,
          overrideDescanso: false,
        });
      } else {
        setConflictError(validacion.error);
        setDropTarget(null);
        setTimeout(() => setConflictError(null), 5000);
        return;
      }
    } else {
      // Mostrar modal de confirmación normal
      setConfirmModal({
        isOpen: true,
        cita,
        nuevaFecha,
        overrideDescanso: false,
      });
    }
    setDropTarget(null);
  };

  const handleConfirmMove = async () => {
    if (!confirmModal.cita || !confirmModal.nuevaFecha) return;

    const cita = confirmModal.cita;
    const nuevaFechaInicio = new Date(confirmModal.nuevaFecha);
    const duracion = new Date(cita.fechaFin).getTime() - new Date(cita.fechaInicio).getTime();
    const nuevaFechaFin = new Date(nuevaFechaInicio.getTime() + duracion);

    // Validar nuevamente con override si fue seleccionado
    const overrideDescanso = confirmModal.overrideDescanso || false;
    const validacion = validarConflicto(cita, nuevaFechaInicio, nuevaFechaInicio.getHours(), nuevaFechaInicio.getMinutes(), overrideDescanso);
    
    if (validacion.error && !overrideDescanso) {
      setConflictError(validacion.error);
      return;
    }

    try {
      // Actualizar cita en el backend (pasando la cita original para preservar todos los datos)
      const citaActualizada = await updateCita(cita.id, {
        fechaInicio: nuevaFechaInicio,
        fechaFin: nuevaFechaFin,
      }, cita, user?.id);

      // Actualizar estado local
      setCitas(prevCitas =>
        prevCitas.map(c => (c.id === cita.id ? citaActualizada : c))
      );

      // Enviar notificación al cliente (mock)
      await enviarNotificacionCliente(cita, nuevaFechaInicio);

      setConfirmModal({ isOpen: false, cita: null, nuevaFecha: null });
      setConflictError(null);
    } catch (error) {
      console.error('Error al mover cita:', error);
      setConflictError('Error al mover la cita. Por favor, intenta de nuevo.');
      setConfirmModal({ isOpen: false, cita: null, nuevaFecha: null });
    }
  };

  const handleCitaCreada = (nuevaCita: Cita) => {
    setCitas(prevCitas => [...prevCitas, nuevaCita]);
    cargarCitas(); // Recargar para asegurar sincronización
  };

  const handleCitaActualizada = (citaActualizada: Cita) => {
    setCitas(prevCitas =>
      prevCitas.map(c => (c.id === citaActualizada.id ? citaActualizada : c))
    );
    cargarCitas(); // Recargar para asegurar sincronización
  };

  const handleCitaCancelada = (citaCancelada: Cita) => {
    setCitas(prevCitas =>
      prevCitas.map(c => (c.id === citaCancelada.id ? citaCancelada : c))
    );
    cargarCitas(); // Recargar para asegurar sincronización
  };

  const handleClickDerecho = (e: React.MouseEvent, cita: Cita) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuContextual({
      cita,
      position: { x: e.clientX, y: e.clientY },
    });
  };

  const handleEditarSesion = (cita: Cita, editarSerie: boolean) => {
    setCitaSeleccionada(cita);
    setEditarSerie(editarSerie);
    setMostrarModalEditar(true);
    setMenuContextual(null);
  };

  const handleCancelarSesion = (cita: Cita, cancelarSerie: boolean) => {
    setCitaSeleccionada(cita);
    setCancelarSerie(cancelarSerie);
    setMostrarModalCancelar(true);
    setMenuContextual(null);
  };

  const handleClickSesion = (cita: Cita) => {
    setCitaSeleccionada(cita);
    setMostrarModalDetalle(true);
    // Llamar callback externo si existe
    if (onSelectCita) {
      onSelectCita(cita);
    }
  };

  const abrirModalRapido = (fecha?: Date, hora?: number, minuto?: number) => {
    if (fecha && hora !== undefined && minuto !== undefined) {
      setSlotSeleccionado({ fecha, hora, minuto });
      // Llamar callback externo si existe
      if (onSelectSlot) {
        onSelectSlot(fecha, hora, minuto);
      }
    } else {
      setSlotSeleccionado(null);
    }
    
    // Llamar callback externo para crear sesión rápida
    if (onCreateSesionRapida) {
      onCreateSesionRapida(fecha, hora, minuto);
    } else {
      // Si no hay callback externo, usar el modal interno
      setMostrarModalRapido(true);
    }
  };

  const cerrarModalRapido = () => {
    setMostrarModalRapido(false);
    setSlotSeleccionado(null);
  };

  const enviarNotificacionCliente = async (cita: Cita, nuevaFecha: Date): Promise<void> => {
    // Mock de notificación - En producción, esto enviaría un email/SMS real
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Notificación enviada a ${cita.clienteNombre || 'cliente'}:`);
        console.log(`Tu cita "${cita.titulo}" ha sido reprogramada para ${nuevaFecha.toLocaleString('es-ES')}`);
        resolve();
      }, 300);
    });
  };

  const diasSemanaNombres = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getFormatoSemana = () => {
    const dias = getDiasSemana();
    const inicio = dias[0];
    const fin = dias[6];
    if (inicio.getMonth() === fin.getMonth()) {
      return `${inicio.getDate()} - ${fin.getDate()} de ${meses[inicio.getMonth()]} ${inicio.getFullYear()}`;
    } else {
      return `${inicio.getDate()} ${meses[inicio.getMonth()]} - ${fin.getDate()} ${meses[fin.getMonth()]} ${inicio.getFullYear()}`;
    }
  };

  const calcularAlturaCita = (cita: Cita): number => {
    const duracion = new Date(cita.fechaFin).getTime() - new Date(cita.fechaInicio).getTime();
    const minutos = duracion / (1000 * 60);
    return (minutos / slotMinutos) * 60; // 60px por slot de 30 minutos
  };

  // Efecto para forzar vista semana/día en móvil (no mes)
  useEffect(() => {
    if (isMobile && vista === 'mes') {
      setVista('semana');
    }
  }, [isMobile, vista]);

  return (
    <>
      <Card className="bg-white shadow-sm">
        <div className={`${isMobile ? 'p-3' : 'p-6'}`}>
          {/* Header responsive */}
          <div className={`flex ${isMobile ? 'flex-col' : 'items-center justify-between'} gap-3 mb-4 ${isMobile ? 'mb-4' : 'mb-6'}`}>
            <div className={`flex items-center ${isMobile ? 'justify-between w-full' : 'space-x-4'}`}>
              <div className="flex items-center space-x-2">
                <CalendarDays className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-blue-600`} />
                <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-900`}>
                  {vista === 'semana' ? getFormatoSemana() : 
                   vista === 'dia' ? `${fechaActual.getDate()} de ${meses[fechaActual.getMonth()]} ${fechaActual.getFullYear()}` :
                   `${meses[fechaActual.getMonth()]} ${fechaActual.getFullYear()}`}
                </h2>
              </div>
              {isMobile && role === 'entrenador' && (
                <div className="flex items-center gap-2">
                  <NotificacionesSesion
                    onVerDetalleSesion={(citaId) => {
                      const cita = citas.find(c => c.id === citaId);
                      if (cita) {
                        handleClickSesion(cita);
                      }
                    }}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => abrirModalRapido()}
                    className="!p-2"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            
            {/* Controles de vista y navegación - responsive */}
            <div className={`flex items-center ${isMobile ? 'justify-between w-full' : 'space-x-2'}`}>
              {!isMobile && role === 'entrenador' && (
                <>
                  <NotificacionesSesion
                    onVerDetalleSesion={(citaId) => {
                      const cita = citas.find(c => c.id === citaId);
                      if (cita) {
                        handleClickSesion(cita);
                      }
                    }}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => abrirModalRapido()}
                    className="mr-2"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Nueva Sesión
                  </Button>
                </>
              )}
              
              {/* Botones de vista - en móvil solo semana/día, en desktop todas */}
              {!isMobile ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => cambiarVista('mes')}
                    className={vista === 'mes' ? 'bg-slate-100 text-slate-900' : ''}
                  >
                    Mes
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => cambiarVista('semana')}
                    className={vista === 'semana' ? 'bg-slate-100 text-slate-900' : ''}
                  >
                    Semana
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => cambiarVista('dia')}
                    className={vista === 'dia' ? 'bg-slate-100 text-slate-900' : ''}
                  >
                    Día
                  </Button>
                  {role === 'entrenador' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setVistaDiaCompleto(!vistaDiaCompleto)}
                        className={vistaDiaCompleto ? 'bg-blue-100 text-blue-900' : ''}
                        leftIcon={<Sun className="w-4 h-4" />}
                      >
                        Día Completo
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMostrarModalExportar(true)}
                        leftIcon={<Download className="w-4 h-4" />}
                      >
                        Exportar
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  {/* En móvil, mostrar controles de vista semana/día */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => cambiarVista('semana')}
                    className={vista === 'semana' ? 'bg-slate-100 text-slate-900' : ''}
                    title="Vista Semana"
                  >
                    Semana
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => cambiarVista('dia')}
                    className={vista === 'dia' ? 'bg-slate-100 text-slate-900' : ''}
                    title="Vista Día"
                  >
                    Día
                  </Button>
                  {role === 'entrenador' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setVistaDiaCompleto(!vistaDiaCompleto)}
                        className={vistaDiaCompleto ? 'bg-blue-100 text-blue-900' : ''}
                        title="Vista Día Completo"
                      >
                        <Sun className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMostrarModalExportar(true)}
                        title="Exportar"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <div className="text-xs text-gray-500">
                    {vista === 'semana' ? 'Desliza para cambiar semana' : 'Desliza para cambiar día'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Vista rápida de próximos slots disponibles - solo en desktop o colapsable en móvil */}
          {proximosSlots.length > 0 && !isMobile && (
            <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Próximos slots disponibles:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {proximosSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => seleccionarFecha(slot.fecha)}
                    className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-md hover:bg-green-200 transition-colors"
                  >
                    {slot.fecha.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })} {slot.hora.toString().padStart(2, '0')}:{slot.minuto.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Leyenda de colores - simplificada en móvil */}
          {!isMobile && (
            <div className="mb-4 flex items-center gap-4 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                <span className="text-gray-600">Libre</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
                <span className="text-gray-600">Ocupado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded opacity-70"></div>
                <span className="text-gray-600">Bloqueado</span>
              </div>
              {role === 'entrenador' && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-100 border border-orange-200 rounded opacity-50"></div>
                  <span className="text-gray-600">Fuera de horario de trabajo</span>
                </div>
              )}
            </div>
          )}

          {conflictError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{conflictError}</span>
            </div>
          )}

          {/* Controles de navegación - responsive */}
          <div className={`flex items-center ${isMobile ? 'justify-between' : 'justify-between'} mb-4`}>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (vista === 'mes') {
                    cambiarMes('anterior');
                  } else if (vista === 'semana') {
                    cambiarSemana('anterior');
                  } else {
                    cambiarDia('anterior');
                  }
                }}
                title="Anterior"
                className={isMobile ? '!p-2' : ''}
              >
                <ChevronLeft className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={irAHoy}
                title="Ir a hoy"
                className={isMobile ? 'px-3 text-xs' : 'px-4'}
              >
                Hoy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (vista === 'mes') {
                    cambiarMes('siguiente');
                  } else if (vista === 'semana') {
                    cambiarSemana('siguiente');
                  } else {
                    cambiarDia('siguiente');
                  }
                }}
                title="Siguiente"
                className={isMobile ? '!p-2' : ''}
              >
                <ChevronRight className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
              </Button>
            </div>
            {!isMobile && (
              <div className="relative" ref={calendarRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMostrarMiniCalendario(!mostrarMiniCalendario)}
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Calendario</span>
                  {mostrarMiniCalendario ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
                {mostrarMiniCalendario && (
                  <div className="absolute right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 p-4 w-64">
                    <MiniCalendario
                      fechaSeleccionada={fechaActual}
                      onSeleccionarFecha={seleccionarFecha}
                      onCerrar={() => setMostrarMiniCalendario(false)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Vista Día Completo */}
          {vistaDiaCompleto && role === 'entrenador' ? (
            <VistaDiaCompleto
              citas={citas}
              fecha={new Date()}
              onEditarSesion={(cita) => {
                setCitaSeleccionada(cita);
                setEditarSerie(false);
                setMostrarModalEditar(true);
              }}
              onCancelarSesion={(cita) => {
                setCitaSeleccionada(cita);
                setCancelarSerie(false);
                setMostrarModalCancelar(true);
              }}
              onVerDetalle={(cita) => {
                setCitaSeleccionada(cita);
                setMostrarModalDetalle(true);
              }}
            />
          ) : (
            <>
          {vista === 'mes' && (
            <div className="grid grid-cols-7 gap-2">
              {diasSemana.map((dia) => (
                <div
                  key={dia}
                  className="text-sm font-semibold text-slate-600 text-center py-2"
                >
                  {dia}
                </div>
              ))}
              {getDiasMes().map((fecha, index) => {
                const citasDelDia = getCitasDelDia(fecha);
                const esHoy = fecha && 
                  fecha.getDate() === new Date().getDate() &&
                  fecha.getMonth() === new Date().getMonth() &&
                  fecha.getFullYear() === new Date().getFullYear();

                return (
                  <div
                    key={index}
                    className={`
                      bg-white rounded-xl border border-slate-200 p-2
                      ${fecha ? 'cursor-pointer hover:bg-slate-50 transition-colors' : ''}
                      ${esHoy ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                      min-h-[100px]
                    `}
                  >
                    {fecha && (
                      <>
                        <div className={`text-sm font-semibold mb-1 ${esHoy ? 'text-blue-600' : 'text-gray-900'}`}>
                          {fecha.getDate()}
                        </div>
                        <div className="space-y-1">
                          {citasDelDia.slice(0, 3).map((cita) => (
                            <div
                              key={cita.id}
                              className={`${getColorCita(cita)} text-white text-xs px-2 py-1 rounded truncate`}
                              title={cita.titulo}
                            >
                              {cita.titulo}
                            </div>
                          ))}
                          {citasDelDia.length > 3 && (
                            <div className="text-xs text-slate-500">
                              +{citasDelDia.length - 3} más
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {vista === 'semana' && (
            <div 
              ref={semanaRef}
              className={`overflow-x-auto ${isMobile ? 'touch-pan-x' : ''} -mx-3 ${isMobile ? 'px-3' : ''}`}
              style={isMobile ? { WebkitOverflowScrolling: 'touch' } : {}}
            >
              <div className={`inline-block ${isMobile ? 'min-w-full' : 'min-w-full'}`}>
                <div className={`grid ${isMobile ? 'grid-cols-8' : 'grid-cols-8'} border border-slate-200 rounded-lg overflow-hidden ${isMobile ? 'text-xs' : ''}`}>
                  {/* Columna de horas - más compacta en móvil */}
                  <div className={`border-r border-slate-200 bg-slate-50 ${isMobile ? 'sticky left-0 z-10' : ''}`}>
                    <div className={`${isMobile ? 'h-10' : 'h-12'} border-b border-slate-200`}></div>
                    {slots.map((slot, index) => (
                      <div
                        key={index}
                        className={`${isMobile ? 'h-[50px] text-[10px] px-1' : 'h-[60px] text-xs px-2'} border-b border-slate-100 text-slate-500 py-1`}
                      >
                        {slot.hora.toString().padStart(2, '0')}:{slot.minuto.toString().padStart(2, '0')}
                      </div>
                    ))}
                  </div>

                  {/* Columnas de días - scroll horizontal en móvil */}
                  {getDiasSemana().map((fecha, diaIndex) => {
                    const citasDelDia = getCitasDelDia(fecha);
                    const esHoy = fecha.getDate() === new Date().getDate() &&
                      fecha.getMonth() === new Date().getMonth() &&
                      fecha.getFullYear() === new Date().getFullYear();

                    return (
                      <div
                        key={diaIndex}
                        className={`border-r border-slate-200 last:border-r-0 ${
                          esHoy ? 'bg-blue-50' : 'bg-white'
                        } ${isMobile ? 'min-w-[80px]' : ''}`}
                      >
                        {/* Header del día - más compacto en móvil */}
                        <div className={`${isMobile ? 'h-14 py-1' : 'h-16 py-2'} border-b border-slate-200 text-center ${
                          esHoy ? 'bg-blue-100' : 'bg-slate-50'
                        }`}>
                          <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-medium text-slate-600`}>
                            {diasSemanaNombres[diaIndex]}
                          </div>
                          <div className={`${isMobile ? 'text-base' : 'text-lg'} font-bold ${esHoy ? 'text-blue-600' : 'text-gray-900'}`}>
                            {fecha.getDate()}
                          </div>
                          {/* Indicador de disponibilidad porcentual - oculto en móvil para ahorrar espacio */}
                          {!isMobile && (
                            <div className="text-xs mt-1">
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white">
                                <span className="text-gray-600">{calcularDisponibilidadDia(fecha)}%</span>
                                <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-green-500 transition-all"
                                    style={{ width: `${calcularDisponibilidadDia(fecha)}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Slots de tiempo - altura reducida en móvil */}
                        <div className="relative" style={{ height: `${slots.length * (isMobile ? 50 : 60)}px` }}>
                          {/* Renderizar slots de tiempo como áreas de drop */}
                          {slots.map((slot, slotIndex) => {
                            const esDropTarget = dropTarget?.fecha.getTime() === fecha.getTime() &&
                              dropTarget.hora === slot.hora &&
                              dropTarget.minuto === slot.minuto;
                            const estadoSlot = getEstadoSlot(fecha, slot.hora, slot.minuto);
                            const colorSlot = getColorSlot(estadoSlot);

                            return (
                              <div
                                key={slotIndex}
                                className={`${isMobile ? 'h-[50px]' : 'h-[60px]'} border-b border-slate-100 transition-colors ${colorSlot} ${
                                  esDropTarget ? 'bg-blue-100 ring-2 ring-blue-400' : ''
                                } ${estadoSlot === 'libre' && role === 'entrenador' ? 'cursor-pointer touch-manipulation' : ''}`}
                                onDragOver={(e) => {
                                  if (!isMobile && estadoSlot !== 'bloqueado') {
                                    handleDragOver(e, fecha, slot.hora, slot.minuto);
                                  }
                                }}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => {
                                  if (!isMobile && estadoSlot !== 'bloqueado') {
                                    handleDrop(e, fecha, slot.hora, slot.minuto);
                                  }
                                }}
                                onClick={() => {
                                  if (estadoSlot === 'libre') {
                                    if (onSelectSlot) {
                                      onSelectSlot(fecha, slot.hora, slot.minuto);
                                    }
                                    if (role === 'entrenador') {
                                      abrirModalRapido(fecha, slot.hora, slot.minuto);
                                    }
                                  }
                                }}
                                onTouchStart={(e) => {
                                  // En móvil, permitir toque para seleccionar slot
                                  if (estadoSlot === 'libre') {
                                    e.preventDefault();
                                    if (onSelectSlot) {
                                      onSelectSlot(fecha, slot.hora, slot.minuto);
                                    }
                                    if (role === 'entrenador') {
                                      abrirModalRapido(fecha, slot.hora, slot.minuto);
                                    }
                                  }
                                }}
                                title={
                                  estadoSlot === 'libre' && role === 'entrenador' 
                                    ? 'Toca para crear sesión' :
                                  estadoSlot === 'libre' ? 'Libre' :
                                  estadoSlot === 'ocupado' ? 'Ocupado' :
                                  estadoSlot === 'fuera-horario' ? 'Fuera de horario de trabajo' :
                                  'Bloqueado'
                                }
                              />
                            );
                          })}
                          
                          {/* Renderizar citas absolutamente posicionadas */}
                          {citasDelDia.map((cita) => {
                            const citaInicio = new Date(cita.fechaInicio);
                            const citaFin = new Date(cita.fechaFin);
                            
                            // Verificar que la cita pertenece a este día
                            if (
                              citaInicio.getDate() !== fecha.getDate() ||
                              citaInicio.getMonth() !== fecha.getMonth() ||
                              citaInicio.getFullYear() !== fecha.getFullYear()
                            ) {
                              return null;
                            }

                            // Calcular posición y altura
                            const horaInicio = citaInicio.getHours();
                            const minutoInicio = citaInicio.getMinutes();
                            
                            // Encontrar el slot que corresponde al inicio de la cita
                            // Redondear hacia abajo al slot más cercano (cada 30 minutos)
                            const minutosTotalesInicio = horaInicio * 60 + minutoInicio;
                            const minutosTotalesSlotInicio = Math.floor(minutosTotalesInicio / slotMinutos) * slotMinutos;
                            const horaSlot = Math.floor(minutosTotalesSlotInicio / 60);
                            const minutoSlot = minutosTotalesSlotInicio % 60;
                            
                            let slotIndexInicio = slots.findIndex(
                              s => s.hora === horaSlot && s.minuto === minutoSlot
                            );
                            
                            // Si no encuentra el slot (fuera del rango), ajustar
                            if (slotIndexInicio === -1) {
                              // Si la cita está antes del primer slot, usar el primer slot
                              const primerSlotMinutos = slots[0].hora * 60 + slots[0].minuto;
                              if (minutosTotalesSlotInicio < primerSlotMinutos) {
                                slotIndexInicio = 0;
                              } else {
                                // Si está después del último slot, no mostrar (o usar el último)
                                const ultimoSlotMinutos = slots[slots.length - 1].hora * 60 + slots[slots.length - 1].minuto;
                                if (minutosTotalesSlotInicio > ultimoSlotMinutos) {
                                  return null; // No mostrar citas fuera del rango visible
                                }
                                slotIndexInicio = slots.length - 1;
                              }
                            }
                            
                            // Calcular offset si la cita no comienza exactamente al inicio del slot
                            const offsetMinutos = minutosTotalesInicio - minutosTotalesSlotInicio;
                            const offsetPixels = (offsetMinutos / slotMinutos) * (isMobile ? 50 : 60);
                            
                            const top = slotIndexInicio * (isMobile ? 50 : 60) + offsetPixels;
                            const altura = calcularAlturaCita(cita);

                            return (
                              <div
                                key={cita.id}
                                draggable={!isMobile}
                                onDragStart={(e) => !isMobile && handleDragStart(e, cita)}
                                onDragEnd={handleDragEnd}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (role === 'entrenador') {
                                    handleClickSesion(cita);
                                  }
                                }}
                                onTouchStart={(e) => {
                                  // En móvil, toque directo abre detalles
                                  if (role === 'entrenador') {
                                    e.stopPropagation();
                                    handleClickSesion(cita);
                                  }
                                }}
                                onContextMenu={(e) => {
                                  if (role === 'entrenador' && !isMobile) {
                                    handleClickDerecho(e, cita);
                                  }
                                }}
                                className={`${getColorCita(cita)} text-white ${isMobile ? 'text-[10px] p-1' : 'text-xs p-1.5'} rounded shadow-md cursor-pointer hover:shadow-lg transition-shadow m-1 z-10 absolute left-0 right-0 group touch-manipulation`}
                                style={{
                                  top: `${Math.max(0, top)}px`,
                                  height: `${Math.max(isMobile ? 30 : 40, altura)}px`,
                                  minHeight: isMobile ? '30px' : '40px',
                                }}
                                title={`Toca para ver detalles: ${cita.titulo}`}
                              >
                                <div className="flex items-start justify-between h-full">
                                  <div className="flex-1 min-w-0">
                                    <div className={`${isMobile ? 'font-medium' : 'font-semibold'} truncate`}>
                                      {isMobile ? (cita.titulo.length > 15 ? cita.titulo.substring(0, 15) + '...' : cita.titulo) : cita.titulo}
                                    </div>
                                    {!isMobile && (
                                      <>
                                        <div className="text-xs mt-0.5 opacity-90">
                                          {citaInicio.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - {citaFin.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        {cita.clienteNombre && (
                                          <div className="text-xs mt-0.5 opacity-90 truncate">
                                            {cita.clienteNombre}
                                          </div>
                                        )}
                                      </>
                                    )}
                                    {cita.confirmacionCliente && !isMobile && (
                                      <div className="text-xs mt-0.5 flex items-center gap-1">
                                        {cita.confirmacionCliente === 'confirmada' && (
                                          <span className="text-green-400">✓ Confirmada</span>
                                        )}
                                        {cita.confirmacionCliente === 'cancelada' && (
                                          <span className="text-red-400">✗ Cancelada</span>
                                        )}
                                        {cita.confirmacionCliente === 'pendiente' && (
                                          <span className="text-yellow-400">⏳ Pendiente</span>
                                        )}
                                        {cita.confirmacionCliente === 'reprogramacion-solicitada' && (
                                          <span className="text-orange-400">🔄 Reprogramación</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  {role === 'entrenador' && !isMobile && (
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                      <BotonAccionesRapidas
                                        cita={cita}
                                        onEditar={handleEditarSesion}
                                        onCancelar={handleCancelarSesion}
                                      />
                                    </div>
                                  )}
                                </div>
                                {cita.recurrencia && !isMobile && (
                                  <div className="text-xs mt-1 opacity-75 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Recurrente
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {vista === 'dia' && (
            <div 
              ref={diaRef}
              className="space-y-4"
            >
              {getCitasDelDia(fechaActual).map((cita) => (
                <div
                  key={cita.id}
                  onClick={() => {
                    if (role === 'entrenador') {
                      handleClickSesion(cita);
                    }
                  }}
                  onContextMenu={(e) => {
                    if (role === 'entrenador') {
                      handleClickDerecho(e, cita);
                    }
                  }}
                  className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                >
                  <div className={`flex-shrink-0 w-16 h-16 ${getColorCita(cita)} rounded-lg flex items-center justify-center text-white font-bold`}>
                    {new Date(cita.fechaInicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{cita.titulo}</h3>
                    {cita.clienteNombre && (
                      <p className="text-sm text-gray-600 mb-1">Cliente: {cita.clienteNombre}</p>
                    )}
                    {cita.instructorNombre && (
                      <p className="text-sm text-gray-600 mb-1">Instructor: {cita.instructorNombre}</p>
                    )}
                    {cita.capacidadMaxima && (
                      <p className="text-sm text-gray-600 mb-1">
                        Inscritos: {cita.inscritos}/{cita.capacidadMaxima}
                      </p>
                    )}
                    {cita.notas && (
                      <p className="text-sm text-gray-500 italic">{cita.notas}</p>
                    )}
                    {cita.recurrencia && (
                      <p className="text-xs text-blue-600 mt-1 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Sesión recurrente
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2">
                    {role === 'entrenador' && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <BotonAccionesRapidas
                          cita={cita}
                          onEditar={handleEditarSesion}
                          onCancelar={handleCancelarSesion}
                        />
                      </div>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      cita.estado === 'completada' ? 'bg-green-100 text-green-800' :
                      cita.estado === 'no-show' ? 'bg-red-100 text-red-800' :
                      cita.estado === 'cancelada' ? 'bg-yellow-100 text-yellow-800' :
                      cita.estado === 'confirmada' ? 'bg-blue-100 text-blue-800' :
                      cita.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      cita.estado === 'en-curso' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {cita.estado === 'no-show' ? 'No Show' : 
                       cita.estado === 'completada' ? 'Completada' :
                       cita.estado === 'cancelada' ? 'Cancelada' :
                       cita.estado === 'confirmada' ? 'Confirmada' :
                       cita.estado === 'pendiente' ? 'Pendiente' :
                       cita.estado === 'en-curso' ? 'En Curso' :
                       cita.estado}
                    </span>
                  </div>
                </div>
              ))}
              {getCitasDelDia(fechaActual).length === 0 && (
                <div className="text-center py-12">
                  <Clock className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500 text-lg">No hay citas programadas para este día</p>
                </div>
              )}
            </div>
          )}

          {loading && citas.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-sm text-gray-600">Cargando citas...</p>
            </div>
          )}
            </>
          )}
        </div>
      </Card>

      {/* Modal de confirmación */}
      {confirmModal.isOpen && confirmModal.cita && confirmModal.nuevaFecha && (() => {
        const validacion = validarConflicto(
          confirmModal.cita!,
          confirmModal.nuevaFecha!,
          confirmModal.nuevaFecha!.getHours(),
          confirmModal.nuevaFecha!.getMinutes(),
          confirmModal.overrideDescanso || false
        );
        const requiereOverride = validacion.requiereOverride && !confirmModal.overrideDescanso;
        const mensajeAdvertencia = requiereOverride && configuracionTiempoDescanso
          ? `\n\n⚠️ Advertencia: Esta cita viola el tiempo mínimo de descanso de ${configuracionTiempoDescanso.tiempoMinimoMinutos} minutos entre sesiones.`
          : '';
        
        return (
          <ConfirmModal
            isOpen={confirmModal.isOpen}
            onClose={() => setConfirmModal({ isOpen: false, cita: null, nuevaFecha: null })}
            onConfirm={handleConfirmMove}
            title={requiereOverride ? "Confirmar cambio (con override)" : "Confirmar cambio de horario"}
            message={
              `¿Estás seguro de que quieres mover la cita "${confirmModal.cita.titulo}" al ${confirmModal.nuevaFecha.toLocaleString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}? Se enviará una notificación automática al cliente.${mensajeAdvertencia}`
            }
            confirmText={requiereOverride ? "Confirmar (Override)" : "Confirmar"}
            cancelText="Cancelar"
            variant={requiereOverride ? "warning" : "primary"}
          />
        );
      })()}

      {/* Modal rápido de creación de sesión */}
      {role === 'entrenador' && (
        <ModalRapidoCrearSesion
          isOpen={mostrarModalRapido}
          onClose={cerrarModalRapido}
          onCitaCreada={handleCitaCreada}
          fechaInicial={slotSeleccionado?.fecha}
          horaInicial={slotSeleccionado ? { hora: slotSeleccionado.hora, minuto: slotSeleccionado.minuto } : undefined}
          role={role}
        />
      )}

      {/* Modal de edición de sesión */}
      {role === 'entrenador' && (
        <ModalEditarSesion
          isOpen={mostrarModalEditar}
          onClose={() => {
            setMostrarModalEditar(false);
            setCitaSeleccionada(null);
            setEditarSerie(false);
          }}
          cita={citaSeleccionada}
          onSesionActualizada={handleCitaActualizada}
          role={role}
          editarSerie={editarSerie}
          userId={user?.id}
        />
      )}

      {/* Modal de cancelación de sesión */}
      {role === 'entrenador' && (
        <ModalCancelarSesion
          isOpen={mostrarModalCancelar}
          onClose={() => {
            setMostrarModalCancelar(false);
            setCitaSeleccionada(null);
            setCancelarSerie(false);
          }}
          cita={citaSeleccionada}
          onSesionCancelada={handleCitaCancelada}
          cancelarSerie={cancelarSerie}
          userId={user?.id}
        />
      )}

      {/* Modal de detalle de sesión */}
      {role === 'entrenador' && (
        <ModalDetalleSesion
          isOpen={mostrarModalDetalle}
          onClose={() => {
            setMostrarModalDetalle(false);
            setCitaSeleccionada(null);
          }}
          cita={citaSeleccionada}
        />
      )}

      {/* Menú contextual (click derecho) */}
      {menuContextual && (
        <MenuContextualSesion
          cita={menuContextual.cita}
          position={menuContextual.position}
          onClose={() => setMenuContextual(null)}
          onEditar={handleEditarSesion}
          onCancelar={handleCancelarSesion}
        />
      )}

      {/* Botón de acciones rápidas en móvil */}
      {isMobile && role === 'entrenador' && (
        <AccionesRapidasMobile
          onCrearSesion={() => abrirModalRapido()}
          onVerHoy={irAHoy}
        />
      )}

      {/* Modal de exportar agenda */}
      {role === 'entrenador' && (
        <ModalExportarAgenda
          isOpen={mostrarModalExportar}
          onClose={() => setMostrarModalExportar(false)}
          citas={citas}
          nombreEntrenador={user?.name || user?.email}
        />
      )}
    </>
  );
};

// Componente MiniCalendario
interface MiniCalendarioProps {
  fechaSeleccionada: Date;
  onSeleccionarFecha: (fecha: Date) => void;
  onCerrar: () => void;
}

const MiniCalendario: React.FC<MiniCalendarioProps> = ({ fechaSeleccionada, onSeleccionarFecha, onCerrar }) => {
  const [mesActual, setMesActual] = useState(new Date(fechaSeleccionada));
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const diasSemana = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

  const getDiasMes = () => {
    const primerDia = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1);
    const ultimoDia = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaInicioSemana = primerDia.getDay();

    const dias: (Date | null)[] = [];
    // Días vacíos al inicio
    for (let i = 0; i < diaInicioSemana; i++) {
      dias.push(null);
    }
    // Días del mes
    for (let dia = 1; dia <= diasEnMes; dia++) {
      dias.push(new Date(mesActual.getFullYear(), mesActual.getMonth(), dia));
    }
    return dias;
  };

  const cambiarMes = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(mesActual);
    nuevaFecha.setMonth(mesActual.getMonth() + (direccion === 'siguiente' ? 1 : -1));
    setMesActual(nuevaFecha);
  };

  const esHoy = (fecha: Date | null): boolean => {
    if (!fecha) return false;
    const hoy = new Date();
    return fecha.getDate() === hoy.getDate() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear();
  };

  const esSeleccionada = (fecha: Date | null): boolean => {
    if (!fecha) return false;
    return fecha.getDate() === fechaSeleccionada.getDate() &&
      fecha.getMonth() === fechaSeleccionada.getMonth() &&
      fecha.getFullYear() === fechaSeleccionada.getFullYear();
  };

  return (
    <div className="mini-calendario">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => cambiarMes('anterior')}
          className="p-1"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-sm font-semibold text-gray-900">
          {meses[mesActual.getMonth()]} {mesActual.getFullYear()}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => cambiarMes('siguiente')}
          className="p-1"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {diasSemana.map((dia) => (
          <div key={dia} className="text-xs font-medium text-gray-500 text-center py-1">
            {dia}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {getDiasMes().map((fecha, index) => {
          if (!fecha) {
            return <div key={index} className="h-8" />;
          }
          const hoy = esHoy(fecha);
          const seleccionada = esSeleccionada(fecha);
          return (
            <button
              key={index}
              onClick={() => onSeleccionarFecha(fecha)}
              className={`
                h-8 text-sm rounded transition-colors
                ${seleccionada ? 'bg-blue-600 text-white font-bold' : ''}
                ${hoy && !seleccionada ? 'bg-blue-100 text-blue-600 font-semibold' : ''}
                ${!seleccionada && !hoy ? 'text-gray-700 hover:bg-gray-100' : ''}
              `}
            >
              {fecha.getDate()}
            </button>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const hoy = new Date();
            onSeleccionarFecha(hoy);
            setMesActual(hoy);
          }}
          className="w-full text-sm"
        >
          Ir a hoy
        </Button>
      </div>
    </div>
  );
};




