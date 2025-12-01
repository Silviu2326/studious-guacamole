import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, Table, Button, Modal, Select } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { Reserva, NotaDeSesion } from '../types';
import { getReservas, marcarReservaComoPagada, marcarReservaComoNoShow, marcarReservaComoCompletada, verificarYMarcarCompletadasAutomaticamente, FiltrosReservas } from '../api';
import { ReprogramarReserva } from './ReprogramarReserva';
import { AgregarNotaSesion } from './AgregarNotaSesion';
import { getNotaPorReserva } from '../api/notasSesion';
import { Calendar, Clock, User, DollarSign, CheckCircle, XCircle, AlertCircle, CalendarClock, Video, Link2, FileText, CreditCard, Banknote, UserX, CheckCircle2, Filter, Download, CalendarRange } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import * as XLSX from 'xlsx';

interface HistorialReservasProps {
  role: 'entrenador' | 'gimnasio';
}

export const HistorialReservas: React.FC<HistorialReservasProps> = ({ role }) => {
  const { user } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<'todas' | 'completadas' | 'pendientes' | 'confirmadas' | 'canceladas' | 'no-show'>('todas');
  const [filtroCliente, setFiltroCliente] = useState<string>('todos');
  const [filtroTipoSesion, setFiltroTipoSesion] = useState<'todos' | 'presencial' | 'videollamada'>('todos');
  const [reservaReprogramar, setReservaReprogramar] = useState<Reserva | null>(null);
  const [reservaNota, setReservaNota] = useState<Reserva | null>(null);
  const [reservaMarcarPago, setReservaMarcarPago] = useState<Reserva | null>(null);
  const [reservaMarcarNoShow, setReservaMarcarNoShow] = useState<Reserva | null>(null);
  const [reservaMarcarCompletada, setReservaMarcarCompletada] = useState<Reserva | null>(null);
  const [marcandoPago, setMarcandoPago] = useState(false);
  const [marcandoNoShow, setMarcandoNoShow] = useState(false);
  const [marcandoCompletada, setMarcandoCompletada] = useState(false);
  const [notasExistentes, setNotasExistentes] = useState<Map<string, NotaDeSesion>>(new Map());
  
  // Estados para filtro por rango de fechas
  const [fechaInicio, setFechaInicio] = useState<string>(() => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() - 1);
    return fecha.toISOString().split('T')[0];
  });
  const [fechaFin, setFechaFin] = useState<string>(() => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() + 1);
    return fecha.toISOString().split('T')[0];
  });
  const [usarFiltroFechas, setUsarFiltroFechas] = useState(false);

  const cargarReservas = useCallback(async (fechaInicioFiltro?: Date, fechaFinFiltro?: Date) => {
    setLoading(true);
    
    // Usar fechas del filtro si están activas, sino usar las fechas por defecto
    let fechaInicioCarga: Date;
    let fechaFinCarga: Date;
    
    if (usarFiltroFechas && fechaInicioFiltro && fechaFinFiltro) {
      fechaInicioCarga = new Date(fechaInicioFiltro);
      fechaInicioCarga.setHours(0, 0, 0, 0);
      fechaFinCarga = new Date(fechaFinFiltro);
      fechaFinCarga.setHours(23, 59, 59, 999);
    } else {
      fechaInicioCarga = new Date();
      fechaInicioCarga.setMonth(fechaInicioCarga.getMonth() - 1);
      fechaFinCarga = new Date();
      fechaFinCarga.setMonth(fechaFinCarga.getMonth() + 1);
    }
    
    // Construir filtros para getReservas
    const filtros: FiltrosReservas = {
      fechaInicio: fechaInicioCarga,
      fechaFin: fechaFinCarga,
    };
    
    // Aplicar filtro de tipo de sesión si está activo
    if (filtroTipoSesion !== 'todos') {
      filtros.tipoSesion = filtroTipoSesion;
    }
    
    let datos = await getReservas(filtros, role);
    
    // Verificar y marcar automáticamente las reservas que deben completarse (solo para entrenadores)
    if (role === 'entrenador' && user?.id) {
      datos = await verificarYMarcarCompletadasAutomaticamente(datos, user.id);
    }
    
    setReservas(datos);
    setLoading(false);

    // Cargar notas existentes para las reservas (solo para entrenadores)
    if (role === 'entrenador') {
      const notasMap = new Map<string, NotaDeSesion>();
      await Promise.all(
        datos.map(async (reserva) => {
          try {
            const nota = await getNotaPorReserva(reserva.id);
            if (nota) {
              notasMap.set(reserva.id, nota);
            }
          } catch (error) {
            // Ignorar errores al cargar notas
          }
        })
      );
      setNotasExistentes(notasMap);
    }
  }, [role, user?.id, usarFiltroFechas, filtroTipoSesion]);

  // Cargar reservas al montar el componente o cuando cambia el rol/usuario
  useEffect(() => {
    cargarReservas();
  }, [role, user?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Configurar intervalo para verificar automáticamente cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      if (role === 'entrenador' && user?.id) {
        if (usarFiltroFechas) {
          const fechaInicioDate = new Date(fechaInicio);
          const fechaFinDate = new Date(fechaFin);
          if (fechaInicioDate <= fechaFinDate) {
            cargarReservas(fechaInicioDate, fechaFinDate);
          }
        } else {
          cargarReservas();
        }
      }
    }, 5 * 60 * 1000); // 5 minutos
    
    return () => clearInterval(interval);
  }, [role, user?.id, usarFiltroFechas, fechaInicio, fechaFin, cargarReservas]);

  const getEstadoBadge = (estado: Reserva['estado']) => {
    const estados = {
      pendiente: { color: 'yellow' as const, icon: AlertCircle, label: 'Pendiente' },
      confirmada: { color: 'green' as const, icon: CheckCircle, label: 'Confirmada' },
      cancelada: { color: 'red' as const, icon: XCircle, label: 'Cancelada' },
      completada: { color: 'blue' as const, icon: CheckCircle2, label: 'Completada' },
      'no-show': { color: 'gray' as const, icon: XCircle, label: 'No Show' },
    };
    
    const estadoInfo = estados[estado];
    const Icon = estadoInfo.icon;
    
    return (
      <Badge variant={estadoInfo.color} leftIcon={<Icon className="w-3 h-3" />}>
        {estadoInfo.label}
      </Badge>
    );
  };

  // Obtener lista única de clientes para el filtro
  const clientesUnicos = useMemo(() => {
    const clientesMap = new Map<string, { id: string; nombre: string }>();
    reservas.forEach((reserva) => {
      if (!clientesMap.has(reserva.clienteId)) {
        clientesMap.set(reserva.clienteId, {
          id: reserva.clienteId,
          nombre: reserva.clienteNombre,
        });
      }
    });
    return Array.from(clientesMap.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [reservas]);

  // Filtrar reservas según los filtros seleccionados
  const reservasFiltradas = useMemo(() => {
    return reservas.filter((reserva) => {
      // Filtro por estado
      if (filtroEstado !== 'todas') {
        if (filtroEstado === 'completadas' && reserva.estado !== 'completada') return false;
        if (filtroEstado === 'pendientes' && reserva.estado !== 'pendiente') return false;
        if (filtroEstado === 'confirmadas' && reserva.estado !== 'confirmada') return false;
        if (filtroEstado === 'canceladas' && reserva.estado !== 'cancelada') return false;
        if (filtroEstado === 'no-show' && reserva.estado !== 'no-show') return false;
      }

      // Filtro por cliente
      if (filtroCliente !== 'todos' && reserva.clienteId !== filtroCliente) {
        return false;
      }

      // Filtro por tipo de sesión
      if (filtroTipoSesion !== 'todos' && reserva.tipoSesion !== filtroTipoSesion) {
        return false;
      }

      // Filtro por rango de fechas (si está activo, ya se aplica en la carga, pero por seguridad lo validamos aquí también)
      if (usarFiltroFechas) {
        const fechaReserva = new Date(reserva.fecha);
        fechaReserva.setHours(0, 0, 0, 0);
        const fechaInicioFiltro = new Date(fechaInicio);
        fechaInicioFiltro.setHours(0, 0, 0, 0);
        const fechaFinFiltro = new Date(fechaFin);
        fechaFinFiltro.setHours(23, 59, 59, 999);
        
        if (fechaReserva < fechaInicioFiltro || fechaReserva > fechaFinFiltro) {
          return false;
        }
      }

      return true;
    });
  }, [reservas, filtroEstado, filtroCliente, filtroTipoSesion, usarFiltroFechas, fechaInicio, fechaFin]);

  // Ordenar reservas: completadas primero, luego por fecha descendente
  const reservasOrdenadas = useMemo(() => {
    return [...reservasFiltradas].sort((a, b) => {
      // Primero ordenar por estado: completadas primero
      if (a.estado === 'completada' && b.estado !== 'completada') return -1;
      if (a.estado !== 'completada' && b.estado === 'completada') return 1;
      // Luego por fecha descendente (más recientes primero)
      return b.fecha.getTime() - a.fecha.getTime();
    });
  }, [reservasFiltradas]);

  const columns = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value: Date) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-600" />
          <span>{value.toLocaleDateString('es-ES')}</span>
        </div>
      ),
    },
    {
      key: 'horaInicio',
      label: 'Hora',
      render: (_: any, row: Reserva) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-600" />
          <span>{row.horaInicio} - {row.horaFin}</span>
        </div>
      ),
    },
    {
      key: 'clienteNombre',
      label: role === 'entrenador' ? 'Cliente' : 'Socio',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-600" />
          <span>{value}</span>
        </div>
      ),
    },
    ...(role === 'gimnasio' ? [{
      key: 'claseNombre',
      label: 'Clase',
      render: (value: string) => value || '-',
    }] : []),
    {
      key: 'tipoSesion',
      label: 'Tipo',
      render: (value: string, row: Reserva) => {
        if (role === 'entrenador' && row.tipoSesion) {
          return (
            <div className="flex items-center gap-2">
              {row.tipoSesion === 'videollamada' ? (
                <>
                  <Video className="w-4 h-4 text-blue-600" />
                  <span>Videollamada</span>
                  {row.enlaceVideollamada && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(row.enlaceVideollamada, '_blank');
                      }}
                      leftIcon={<Link2 className="w-3 h-3" />}
                      className="ml-2"
                      title="Abrir enlace de videollamada"
                    >
                      Enlace
                    </Button>
                  )}
                </>
              ) : (
                <span>Presencial</span>
              )}
            </div>
          );
        }
        return row.tipo === 'clase-grupal' ? 'Clase Grupal' : row.tipo;
      },
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: Reserva['estado']) => getEstadoBadge(value),
    },
    {
      key: 'precio',
      label: 'Precio',
      render: (value: number, row: Reserva) => (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-slate-600" />
          <span className={row.pagado ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
            €{value.toFixed(2)}
          </span>
          {row.pagado ? (
            <Badge variant="green" leftIcon={<CheckCircle className="w-3 h-3" />}>
              Pagado
            </Badge>
          ) : (
            <Badge variant="red" leftIcon={<AlertCircle className="w-3 h-3" />}>
              Pendiente
            </Badge>
          )}
        </div>
      ),
      align: 'right' as const,
    },
    ...(role === 'entrenador' ? [{
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: Reserva) => {
        const tieneNota = notasExistentes.has(row.id);
        const puedeAgregarNota = row.estado === 'confirmada' || row.estado === 'completada';
        const puedeMarcarPago = !row.pagado && (row.estado === 'confirmada' || row.estado === 'pendiente');
        // Se puede marcar como no-show si está confirmada o pendiente y no es no-show ya
        const puedeMarcarNoShow = (row.estado === 'confirmada' || row.estado === 'pendiente') && row.estado !== 'no-show';
        // Solo se puede marcar no-show si la fecha ya pasó o es hoy
        const fechaReserva = new Date(row.fecha);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        fechaReserva.setHours(0, 0, 0, 0);
        const puedeMarcarNoShowPorFecha = fechaReserva <= hoy;
        // Se puede marcar como completada si está confirmada o pendiente y no está completada, cancelada o no-show
        const puedeMarcarCompletada = (row.estado === 'confirmada' || row.estado === 'pendiente') && 
          row.estado !== 'completada' && row.estado !== 'cancelada' && row.estado !== 'no-show';
        
        return (
          <div className="flex items-center gap-2 flex-wrap">
            {puedeMarcarPago && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setReservaMarcarPago(row)}
                leftIcon={<CreditCard className="w-4 h-4" />}
              >
                Marcar Pagado
              </Button>
            )}
            {puedeMarcarNoShow && puedeMarcarNoShowPorFecha && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setReservaMarcarNoShow(row)}
                leftIcon={<UserX className="w-4 h-4" />}
              >
                Marcar No Show
              </Button>
            )}
            {row.estado === 'confirmada' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setReservaReprogramar(row)}
                leftIcon={<CalendarClock className="w-4 h-4" />}
              >
                Reprogramar
              </Button>
            )}
            {puedeAgregarNota && (
              <Button
                variant={tieneNota ? "primary" : "secondary"}
                size="sm"
                onClick={() => setReservaNota(row)}
                leftIcon={<FileText className="w-4 h-4" />}
              >
                {tieneNota ? 'Ver/Editar Nota' : 'Añadir Nota'}
              </Button>
            )}
            {puedeMarcarCompletada && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setReservaMarcarCompletada(row)}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Marcar Completada
              </Button>
            )}
          </div>
        );
      },
    }] : []),
  ];

  const handleReprogramar = async (reservaActualizada: Reserva) => {
    setReservas(reservas.map(r => r.id === reservaActualizada.id ? reservaActualizada : r));
    setReservaReprogramar(null);
    
    // Recargar reservas para obtener datos actualizados
    if (usarFiltroFechas) {
      const fechaInicioDate = new Date(fechaInicio);
      const fechaFinDate = new Date(fechaFin);
      await cargarReservas(fechaInicioDate, fechaFinDate);
    } else {
      await cargarReservas();
    }
  };

  const handleNotaGuardada = async (nota: NotaDeSesion) => {
    // Actualizar el mapa de notas existentes
    setNotasExistentes(prev => {
      const nuevo = new Map(prev);
      nuevo.set(nota.reservaId, nota);
      return nuevo;
    });
    
    // Recargar la nota para asegurar que tenemos los datos más recientes
    try {
      const notaActualizada = await getNotaPorReserva(nota.reservaId);
      if (notaActualizada) {
        setNotasExistentes(prev => {
          const nuevo = new Map(prev);
          nuevo.set(nota.reservaId, notaActualizada);
          return nuevo;
        });
      }
    } catch (error) {
      console.error('Error recargando nota:', error);
    }
  };

  const handleMarcarComoPagado = async (metodoPago: 'efectivo' | 'transferencia') => {
    if (!reservaMarcarPago) return;
    
    setMarcandoPago(true);
    try {
      const reservaActualizada = await marcarReservaComoPagada(
        reservaMarcarPago.id,
        metodoPago,
        user?.id
      );
      
      // Actualizar la reserva en la lista
      setReservas(reservas.map(r => r.id === reservaActualizada.id ? reservaActualizada : r));
      setReservaMarcarPago(null);
      
      // Recargar reservas para obtener datos actualizados
      if (usarFiltroFechas) {
        const fechaInicioDate = new Date(fechaInicio);
        const fechaFinDate = new Date(fechaFin);
        await cargarReservas(fechaInicioDate, fechaFinDate);
      } else {
        await cargarReservas();
      }
    } catch (error) {
      console.error('Error marcando reserva como pagada:', error);
      alert('Error al marcar la reserva como pagada. Por favor, inténtalo de nuevo.');
    } finally {
      setMarcandoPago(false);
    }
  };

  const handleMarcarComoNoShow = async (aplicarPenalizacion: boolean = false) => {
    if (!reservaMarcarNoShow) return;
    
    setMarcandoNoShow(true);
    try {
      const reservaActualizada = await marcarReservaComoNoShow(
        reservaMarcarNoShow.id,
        user?.id,
        aplicarPenalizacion
      );
      
      // Actualizar la reserva en la lista
      setReservas(reservas.map(r => r.id === reservaActualizada.id ? reservaActualizada : r));
      setReservaMarcarNoShow(null);
      
      // Recargar reservas para obtener datos actualizados
      if (usarFiltroFechas) {
        const fechaInicioDate = new Date(fechaInicio);
        const fechaFinDate = new Date(fechaFin);
        await cargarReservas(fechaInicioDate, fechaFinDate);
      } else {
        await cargarReservas();
      }
      
      alert('Reserva marcada como no-show correctamente.');
    } catch (error) {
      console.error('Error marcando reserva como no-show:', error);
      alert(error instanceof Error ? error.message : 'Error al marcar la reserva como no-show. Por favor, inténtalo de nuevo.');
    } finally {
      setMarcandoNoShow(false);
    }
  };

  const handleMarcarComoCompletada = async (notasCompletacion?: string) => {
    if (!reservaMarcarCompletada) return;
    
    setMarcandoCompletada(true);
    try {
      const reservaActualizada = await marcarReservaComoCompletada(
        reservaMarcarCompletada.id,
        user?.id,
        notasCompletacion
      );
      
      // Actualizar la reserva en la lista
      setReservas(reservas.map(r => r.id === reservaActualizada.id ? reservaActualizada : r));
      setReservaMarcarCompletada(null);
      
      // Recargar reservas para obtener datos actualizados
      if (usarFiltroFechas) {
        const fechaInicioDate = new Date(fechaInicio);
        const fechaFinDate = new Date(fechaFin);
        await cargarReservas(fechaInicioDate, fechaFinDate);
      } else {
        await cargarReservas();
      }
      
      alert('Reserva marcada como completada correctamente.');
    } catch (error) {
      console.error('Error marcando reserva como completada:', error);
      alert(error instanceof Error ? error.message : 'Error al marcar la reserva como completada. Por favor, inténtalo de nuevo.');
    } finally {
      setMarcandoCompletada(false);
    }
  };

  // Función para aplicar el filtro de fechas
  const handleAplicarFiltroFechas = () => {
    if (fechaInicio && fechaFin) {
      const fechaInicioDate = new Date(fechaInicio);
      const fechaFinDate = new Date(fechaFin);
      
      if (fechaInicioDate > fechaFinDate) {
        alert('La fecha de inicio no puede ser posterior a la fecha de fin');
        return;
      }
      
      setUsarFiltroFechas(true);
      // La recarga se hará automáticamente cuando usarFiltroFechas cambie a true
      // pero también la llamamos explícitamente para tener control inmediato
      cargarReservas(fechaInicioDate, fechaFinDate);
    }
  };

  // Función para limpiar el filtro de fechas
  const handleLimpiarFiltroFechas = () => {
    setUsarFiltroFechas(false);
    const fechaInicioDefecto = new Date();
    fechaInicioDefecto.setMonth(fechaInicioDefecto.getMonth() - 1);
    const fechaFinDefecto = new Date();
    fechaFinDefecto.setMonth(fechaFinDefecto.getMonth() + 1);
    setFechaInicio(fechaInicioDefecto.toISOString().split('T')[0]);
    setFechaFin(fechaFinDefecto.toISOString().split('T')[0]);
    cargarReservas();
  };

  // Función para exportar a Excel
  const handleExportarAExcel = () => {
    if (reservasOrdenadas.length === 0) {
      alert('No hay reservas para exportar');
      return;
    }

    // Preparar datos para Excel
    const datos = reservasOrdenadas.map((reserva) => {
      const nota = notasExistentes.get(reserva.id);
      return {
        'Fecha': reserva.fecha.toLocaleDateString('es-ES'),
        'Hora Inicio': reserva.horaInicio,
        'Hora Fin': reserva.horaFin,
        'Cliente': reserva.clienteNombre,
        ...(role === 'gimnasio' && reserva.claseNombre ? { 'Clase': reserva.claseNombre } : {}),
        'Tipo Sesión': reserva.tipoSesion === 'videollamada' ? 'Videollamada' : reserva.tipoSesion === 'presencial' ? 'Presencial' : reserva.tipo === 'clase-grupal' ? 'Clase Grupal' : reserva.tipo,
        'Estado': reserva.estado === 'completada' ? 'Completada' : 
                  reserva.estado === 'confirmada' ? 'Confirmada' : 
                  reserva.estado === 'pendiente' ? 'Pendiente' : 
                  reserva.estado === 'cancelada' ? 'Cancelada' : 
                  reserva.estado === 'no-show' ? 'No Show' : reserva.estado,
        'Precio (€)': reserva.precio.toFixed(2),
        'Pagado': reserva.pagado ? 'Sí' : 'No',
        'Duración (min)': reserva.duracionMinutos || '-',
        ...(reserva.enlaceVideollamada ? { 'Enlace Videollamada': reserva.enlaceVideollamada } : {}),
        ...(reserva.bonoNombre ? { 'Bono Aplicado': reserva.bonoNombre } : {}),
        ...(nota ? { 
          'Nota - Qué Trabajamos': nota.queTrabajamos || '-',
          'Nota - Rendimiento': nota.rendimiento || '-',
          'Nota - Observaciones': nota.observaciones || '-'
        } : {}),
        'Observaciones': reserva.observaciones || '-',
        'Fecha Creación': reserva.createdAt.toLocaleDateString('es-ES'),
        'Última Actualización': reserva.updatedAt.toLocaleDateString('es-ES'),
      };
    });

    // Crear workbook y worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datos);

    // Ajustar ancho de columnas
    const columnWidths = [
      { wch: 12 }, // Fecha
      { wch: 10 }, // Hora Inicio
      { wch: 10 }, // Hora Fin
      { wch: 25 }, // Cliente
      ...(role === 'gimnasio' ? [{ wch: 20 }] : []), // Clase (si aplica)
      { wch: 15 }, // Tipo Sesión
      { wch: 12 }, // Estado
      { wch: 12 }, // Precio
      { wch: 10 }, // Pagado
      { wch: 15 }, // Duración
      { wch: 30 }, // Enlace Videollamada (si aplica)
      { wch: 20 }, // Bono Aplicado (si aplica)
      { wch: 30 }, // Nota - Qué Trabajamos (si aplica)
      { wch: 30 }, // Nota - Rendimiento (si aplica)
      { wch: 30 }, // Nota - Observaciones (si aplica)
      { wch: 30 }, // Observaciones
      { wch: 15 }, // Fecha Creación
      { wch: 15 }, // Última Actualización
    ];
    ws['!cols'] = columnWidths;

    // Agregar worksheet al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Historial Reservas');

    // Generar nombre de archivo con rango de fechas si está aplicado
    let nombreArchivo = `Historial_Reservas_${new Date().toISOString().split('T')[0]}`;
    if (usarFiltroFechas) {
      nombreArchivo = `Historial_Reservas_${fechaInicio}_${fechaFin}`;
    }
    nombreArchivo += '.xlsx';

    // Guardar archivo
    XLSX.writeFile(wb, nombreArchivo);
  };

  return (
    <>
      <Card className="bg-white shadow-sm">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Historial de Reservas
              </h3>
              {(filtroEstado !== 'todas' || filtroCliente !== 'todos' || filtroTipoSesion !== 'todos' || usarFiltroFechas) && (
                <p className="text-sm text-gray-600 mt-1">
                  Mostrando {reservasOrdenadas.length} de {reservas.length} reservas
                </p>
              )}
            </div>
            {role === 'entrenador' && (
              <Button
                variant="primary"
                onClick={handleExportarAExcel}
                leftIcon={<Download className="w-4 h-4" />}
                disabled={reservasOrdenadas.length === 0}
              >
                Exportar a Excel
              </Button>
            )}
          </div>

          {/* Filtros */}
          <div className="space-y-4">
            {/* Filtro por rango de fechas - Solo para entrenadores */}
            {role === 'entrenador' && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarRange className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Filtrar por rango de fechas:</span>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Desde:</label>
                    <input
                      type="date"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Hasta:</label>
                    <input
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAplicarFiltroFechas}
                      leftIcon={<Filter className="w-4 h-4" />}
                    >
                      Aplicar Filtro
                    </Button>
                    {usarFiltroFechas && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLimpiarFiltroFechas}
                        className="text-sm"
                      >
                        Limpiar Filtro
                      </Button>
                    )}
                  </div>
                  {usarFiltroFechas && (
                    <div className="flex items-center gap-2">
                      <Badge variant="blue">
                        Filtro activo: {new Date(fechaInicio).toLocaleDateString('es-ES')} - {new Date(fechaFin).toLocaleDateString('es-ES')}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Filtro por cliente - Solo para entrenadores */}
            {role === 'entrenador' && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Filtrar por cliente:</span>
                </div>
                <div className="w-64">
                  <Select
                    value={filtroCliente}
                    onChange={(e) => setFiltroCliente(e.target.value)}
                    options={[
                      { value: 'todos', label: 'Todos los clientes' },
                      ...clientesUnicos.map((cliente) => ({
                        value: cliente.id,
                        label: cliente.nombre,
                      })),
                    ]}
                    placeholder="Selecciona un cliente"
                    fullWidth={false}
                    className="w-full"
                  />
                </div>
                {filtroCliente !== 'todos' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFiltroCliente('todos')}
                    className="text-sm"
                  >
                    Limpiar filtro
                  </Button>
                )}
              </div>
            )}

            {/* Filtro por tipo de sesión */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filtrar por tipo de sesión:</span>
              </div>
              <div className="w-64">
                <Select
                  value={filtroTipoSesion}
                  onChange={(e) => setFiltroTipoSesion(e.target.value as 'todos' | 'presencial' | 'videollamada')}
                  options={[
                    { value: 'todos', label: 'Todos los tipos' },
                    { value: 'presencial', label: 'Presencial' },
                    { value: 'videollamada', label: 'Videollamada' },
                  ]}
                  placeholder="Selecciona un tipo"
                  fullWidth={false}
                  className="w-full"
                />
              </div>
              {filtroTipoSesion !== 'todos' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFiltroTipoSesion('todos')}
                  className="text-sm"
                >
                  Limpiar filtro
                </Button>
              )}
            </div>

            {/* Filtros de estado */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filtrar por estado:</span>
              </div>
              <button
                onClick={() => setFiltroEstado('todas')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filtroEstado === 'todas'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas ({reservas.length})
              </button>
              <button
                onClick={() => setFiltroEstado('completadas')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filtroEstado === 'completadas'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completadas ({reservas.filter(r => r.estado === 'completada').length})
              </button>
              <button
                onClick={() => setFiltroEstado('confirmadas')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filtroEstado === 'confirmadas'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Confirmadas ({reservas.filter(r => r.estado === 'confirmada').length})
              </button>
              <button
                onClick={() => setFiltroEstado('pendientes')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filtroEstado === 'pendientes'
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pendientes ({reservas.filter(r => r.estado === 'pendiente').length})
              </button>
              <button
                onClick={() => setFiltroEstado('canceladas')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filtroEstado === 'canceladas'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Canceladas ({reservas.filter(r => r.estado === 'cancelada').length})
              </button>
              <button
                onClick={() => setFiltroEstado('no-show')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filtroEstado === 'no-show'
                    ? 'bg-slate-200 text-slate-800 border-2 border-slate-400'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                No Show ({reservas.filter(r => r.estado === 'no-show').length})
              </button>
              {(filtroEstado !== 'todas' || filtroCliente !== 'todos' || filtroTipoSesion !== 'todos' || usarFiltroFechas) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFiltroEstado('todas');
                    setFiltroCliente('todos');
                    setFiltroTipoSesion('todos');
                    handleLimpiarFiltroFechas();
                  }}
                  className="text-sm ml-2"
                >
                  Limpiar todos los filtros
                </Button>
              )}
            </div>
          </div>

          <Table
            data={reservasOrdenadas}
            columns={columns}
            loading={loading}
            emptyMessage="No hay reservas registradas"
            getRowProps={(row: Reserva) => {
              // Destacar las sesiones completadas
              if (row.estado === 'completada') {
                return {
                  className: 'bg-blue-50 border-l-4 border-l-blue-500',
                };
              }
              return {};
            }}
          />
        </div>
      </Card>

      {reservaReprogramar && (
        <ReprogramarReserva
          reserva={reservaReprogramar}
          isOpen={!!reservaReprogramar}
          onClose={() => setReservaReprogramar(null)}
          onReprogramar={handleReprogramar}
          entrenadorId={role === 'entrenador' ? user?.id : undefined}
          role={role}
        />
      )}

      {reservaNota && role === 'entrenador' && (
        <AgregarNotaSesion
          reserva={reservaNota}
          isOpen={!!reservaNota}
          onClose={() => setReservaNota(null)}
          onNotaGuardada={handleNotaGuardada}
        />
      )}

      {reservaMarcarPago && role === 'entrenador' && (
        <Modal
          isOpen={!!reservaMarcarPago}
          onClose={() => setReservaMarcarPago(null)}
          title="Marcar Reserva como Pagada"
          size="md"
          footer={
            <div className="flex space-x-3">
              <Button 
                variant="secondary" 
                onClick={() => setReservaMarcarPago(null)}
                disabled={marcandoPago}
              >
                Cancelar
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Cliente:</strong> {reservaMarcarPago.clienteNombre}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Fecha:</strong> {reservaMarcarPago.fecha.toLocaleDateString('es-ES')}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Hora:</strong> {reservaMarcarPago.horaInicio} - {reservaMarcarPago.horaFin}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Importe:</strong> <span className="font-semibold text-green-600">€{reservaMarcarPago.precio.toFixed(2)}</span>
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Selecciona el método de pago recibido:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleMarcarComoPagado('efectivo')}
                  disabled={marcandoPago}
                  className="flex flex-col items-center justify-center p-4 border-2 border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Banknote className="w-8 h-8 text-gray-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Efectivo</span>
                </button>
                <button
                  onClick={() => handleMarcarComoPagado('transferencia')}
                  disabled={marcandoPago}
                  className="flex flex-col items-center justify-center p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCard className="w-8 h-8 text-gray-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Transferencia</span>
                </button>
              </div>
            </div>

            {marcandoPago && (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-600">Procesando...</span>
              </div>
            )}
          </div>
        </Modal>
      )}

      {reservaMarcarNoShow && role === 'entrenador' && (
        <Modal
          isOpen={!!reservaMarcarNoShow}
          onClose={() => setReservaMarcarNoShow(null)}
          title="Marcar Reserva como No Show"
          size="md"
          footer={
            <div className="flex space-x-3">
              <Button 
                variant="secondary" 
                onClick={() => setReservaMarcarNoShow(null)}
                disabled={marcandoNoShow}
              >
                Cancelar
              </Button>
              <Button 
                variant="primary" 
                onClick={() => handleMarcarComoNoShow(false)}
                disabled={marcandoNoShow}
                loading={marcandoNoShow}
                leftIcon={<UserX className="w-4 h-4" />}
              >
                Marcar No Show
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Cliente:</strong> {reservaMarcarNoShow.clienteNombre}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Fecha:</strong> {reservaMarcarNoShow.fecha.toLocaleDateString('es-ES')}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Hora:</strong> {reservaMarcarNoShow.horaInicio} - {reservaMarcarNoShow.horaFin}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Tipo:</strong> {reservaMarcarNoShow.tipoSesion === 'videollamada' ? 'Videollamada' : 'Presencial'}
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900 mb-1">
                    ¿Aplicar penalización?
                  </p>
                  <p className="text-sm text-yellow-700">
                    Si el cliente tiene políticas de penalización por no-show, puedes aplicarlas. Esto puede incluir multas, pérdida de bono, o restricciones futuras.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Opciones:
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => handleMarcarComoNoShow(false)}
                  disabled={marcandoNoShow}
                  className="w-full flex items-center justify-between p-4 border-2 border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <UserX className="w-5 h-5 text-gray-600" />
                    <div className="text-left">
                      <span className="text-sm font-medium text-gray-700 block">Marcar No Show</span>
                      <span className="text-xs text-gray-500">Sin aplicar penalización</span>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleMarcarComoNoShow(true)}
                  disabled={marcandoNoShow}
                  className="w-full flex items-center justify-between p-4 border-2 border-orange-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <div className="text-left">
                      <span className="text-sm font-medium text-gray-700 block">Marcar No Show con Penalización</span>
                      <span className="text-xs text-gray-500">Aplicar políticas de penalización</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {marcandoNoShow && (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                <span className="ml-2 text-sm text-gray-600">Procesando...</span>
              </div>
            )}
          </div>
        </Modal>
      )}

      {reservaMarcarCompletada && role === 'entrenador' && (
        <Modal
          isOpen={!!reservaMarcarCompletada}
          onClose={() => setReservaMarcarCompletada(null)}
          title="Marcar Reserva como Completada"
          size="md"
          footer={
            <div className="flex space-x-3">
              <Button 
                variant="secondary" 
                onClick={() => setReservaMarcarCompletada(null)}
                disabled={marcandoCompletada}
              >
                Cancelar
              </Button>
              <Button 
                variant="primary" 
                onClick={() => handleMarcarComoCompletada()}
                disabled={marcandoCompletada}
                loading={marcandoCompletada}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Marcar Completada
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Cliente:</strong> {reservaMarcarCompletada.clienteNombre}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Fecha:</strong> {reservaMarcarCompletada.fecha.toLocaleDateString('es-ES')}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Hora:</strong> {reservaMarcarCompletada.horaInicio} - {reservaMarcarCompletada.horaFin}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Tipo:</strong> {reservaMarcarCompletada.tipoSesion === 'videollamada' ? 'Videollamada' : 'Presencial'}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    ¿Confirmar completación de sesión?
                  </p>
                  <p className="text-sm text-blue-700">
                    Al marcar esta sesión como completada, se actualizará el historial y se diferenciará de las sesiones pendientes.
                  </p>
                </div>
              </div>
            </div>

            {marcandoCompletada && (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <span className="ml-2 text-sm text-gray-600">Procesando...</span>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};
