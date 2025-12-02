import { 
  ResumenFinanciero, 
  ProyeccionFinanciera, 
  AlertaPagoPendiente, 
  PagoSesion,
  FiltrosFinancieros,
  EstadisticasFinancierasCliente,
  Cita,
  EstadoPago
} from '../types';
import { getCitas } from './calendario';

// Mock data para pagos de sesiones
const mockPagos: PagoSesion[] = [
  {
    id: 'p1',
    citaId: 'e1',
    clienteId: '1',
    clienteNombre: 'Juan Pérez',
    fechaSesion: new Date(),
    tipoSesion: 'sesion-1-1',
    monto: 50,
    estado: 'pagado',
    fechaPago: new Date(),
    metodoPago: 'tarjeta',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'p2',
    citaId: 'e2',
    clienteId: '2',
    clienteNombre: 'María García',
    fechaSesion: new Date(Date.now() + 86400000),
    tipoSesion: 'videollamada',
    monto: 30,
    estado: 'pendiente',
    fechaVencimiento: new Date(Date.now() + 86400000 * 7),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'p3',
    citaId: 'e3',
    clienteId: '3',
    clienteNombre: 'Carlos Ruiz',
    fechaSesion: new Date(Date.now() + 86400000 * 2),
    tipoSesion: 'sesion-1-1',
    monto: 50,
    estado: 'pendiente',
    fechaVencimiento: new Date(Date.now() + 86400000 * 3),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * Obtiene el resumen financiero del mes actual
 */
export const getResumenFinanciero = async (
  mes?: number,
  anio?: number,
  userId?: string
): Promise<ResumenFinanciero> => {
  return new Promise(async (resolve) => {
    try {
      const fecha = new Date();
      const mesActual = mes || fecha.getMonth() + 1;
      const anioActual = anio || fecha.getFullYear();
      
      // Obtener todas las citas del mes
      const fechaInicio = new Date(anioActual, mesActual - 1, 1);
      const fechaFin = new Date(anioActual, mesActual, 0, 23, 59, 59);
      
      const citas = await getCitas(fechaInicio, fechaFin, 'entrenador');
      
      // Obtener pagos del mes (en producción, esto vendría de la base de datos)
      const pagosMes = mockPagos.filter(p => {
        const fechaPago = new Date(p.fechaSesion);
        return fechaPago.getMonth() + 1 === mesActual && fechaPago.getFullYear() === anioActual;
      });
      
      // Calcular métricas
      const ingresosTotales = pagosMes
        .filter(p => p.estado === 'pagado')
        .reduce((sum, p) => sum + p.monto, 0);
      
      const ingresosPendientes = pagosMes
        .filter(p => p.estado === 'pendiente' || p.estado === 'vencido')
        .reduce((sum, p) => sum + p.monto, 0);
      
      const sesionesCobradas = pagosMes.filter(p => p.estado === 'pagado').length;
      const sesionesPendientes = pagosMes.filter(p => p.estado === 'pendiente').length;
      const sesionesVencidas = pagosMes.filter(p => p.estado === 'vencido').length;
      
      // Calcular proyección mensual
      const diasTranscurridos = fecha.getDate();
      const diasTotales = new Date(anioActual, mesActual, 0).getDate();
      const ingresoPromedioDiario = diasTranscurridos > 0 ? ingresosTotales / diasTranscurridos : 0;
      const proyeccionMensual = ingresoPromedioDiario * diasTotales;
      
      // Precio promedio por sesión
      const promedioSesion = sesionesCobradas > 0 
        ? ingresosTotales / sesionesCobradas 
        : 0;
      
      // Obtener datos del mes anterior para calcular crecimiento
      const mesAnterior = mesActual === 1 ? 12 : mesActual - 1;
      const anioAnterior = mesActual === 1 ? anioActual - 1 : anioActual;
      
      // En producción, aquí se obtendrían los datos del mes anterior
      const ingresosMesAnterior = ingresosTotales * 0.9; // Mock
      const crecimientoPorcentaje = ingresosMesAnterior > 0
        ? ((ingresosTotales - ingresosMesAnterior) / ingresosMesAnterior) * 100
        : 0;
      
      const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                     'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      
      const resumen: ResumenFinanciero = {
        mes: meses[mesActual - 1] + ' ' + anioActual,
        mesNumero: mesActual,
        anio: anioActual,
        ingresosTotales,
        ingresosPendientes,
        sesionesCobradas,
        sesionesPendientes,
        sesionesVencidas,
        proyeccionMensual,
        promedioSesion,
        crecimientoPorcentaje: Math.round(crecimientoPorcentaje * 100) / 100,
      };
      
      setTimeout(() => {
        resolve(resumen);
      }, 300);
    } catch (error) {
      console.error('Error obteniendo resumen financiero:', error);
      const fecha = new Date();
      setTimeout(() => {
        resolve({
          mes: 'Error',
          mesNumero: fecha.getMonth() + 1,
          anio: fecha.getFullYear(),
          ingresosTotales: 0,
          ingresosPendientes: 0,
          sesionesCobradas: 0,
          sesionesPendientes: 0,
          sesionesVencidas: 0,
          proyeccionMensual: 0,
          promedioSesion: 0,
        });
      }, 300);
    }
  });
};

/**
 * Obtiene la proyección financiera del mes actual
 */
export const getProyeccionFinanciera = async (
  userId?: string
): Promise<ProyeccionFinanciera> => {
  return new Promise(async (resolve) => {
    try {
      const fecha = new Date();
      const mes = fecha.getMonth() + 1;
      const anio = fecha.getFullYear();
      
      // Obtener resumen financiero
      const resumen = await getResumenFinanciero(mes, anio, userId);
      
      // Obtener sesiones programadas restantes
      const fechaInicio = new Date();
      const fechaFin = new Date(anio, mes, 0, 23, 59, 59);
      const citas = await getCitas(fechaInicio, fechaFin, 'entrenador');
      
      // Filtrar sesiones futuras
      const sesionesFuturas = citas.filter(c => {
        const fechaCita = new Date(c.fechaInicio);
        return fechaCita > fecha && (c.estado === 'confirmada' || c.estado === 'pendiente');
      });
      
      // Calcular ingresos proyectados de sesiones futuras
      const ingresosFuturos = sesionesFuturas.length * resumen.promedioSesion;
      
      // Días restantes en el mes
      const diasRestantes = fechaFin.getDate() - fecha.getDate();
      
      // Ingreso promedio diario
      const diasTranscurridos = fecha.getDate();
      const ingresoPromedioDiario = diasTranscurridos > 0 
        ? resumen.ingresosTotales / diasTranscurridos 
        : 0;
      
      // Ingresos proyectados
      const ingresosProyectados = resumen.ingresosTotales + (ingresoPromedioDiario * diasRestantes);
      
      // Determinar tendencia
      const tendencia = resumen.crecimientoPorcentaje 
        ? (resumen.crecimientoPorcentaje > 5 ? 'subiendo' : resumen.crecimientoPorcentaje < -5 ? 'bajando' : 'estable')
        : 'estable';
      
      const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                     'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      
      const proyeccion: ProyeccionFinanciera = {
        periodo: meses[mes - 1] + ' ' + anio,
        ingresosActuales: resumen.ingresosTotales,
        ingresosProyectados: Math.round(ingresosProyectados),
        sesionesProgramadas: sesionesFuturas.length,
        sesionesCobradas: resumen.sesionesCobradas,
        ingresoPromedioDiario: Math.round(ingresoPromedioDiario * 100) / 100,
        diasRestantes,
        tendencia,
      };
      
      setTimeout(() => {
        resolve(proyeccion);
      }, 300);
    } catch (error) {
      console.error('Error obteniendo proyección financiera:', error);
      const fecha = new Date();
      setTimeout(() => {
        resolve({
          periodo: 'Error',
          ingresosActuales: 0,
          ingresosProyectados: 0,
          sesionesProgramadas: 0,
          sesionesCobradas: 0,
          ingresoPromedioDiario: 0,
          diasRestantes: 0,
          tendencia: 'estable',
        });
      }, 300);
    }
  });
};

/**
 * Obtiene las alertas de pagos pendientes
 */
export const getAlertasPagosPendientes = async (
  userId?: string
): Promise<AlertaPagoPendiente[]> => {
  return new Promise(async (resolve) => {
    try {
      // Obtener todas las citas
      const fechaInicio = new Date();
      fechaInicio.setMonth(fechaInicio.getMonth() - 1);
      const fechaFin = new Date();
      fechaFin.setMonth(fechaFin.getMonth() + 1);
      
      const citas = await getCitas(fechaInicio, fechaFin, 'entrenador');
      
      // Obtener pagos pendientes
      const pagosPendientes = mockPagos.filter(p => 
        p.estado === 'pendiente' || p.estado === 'vencido'
      );
      
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      const alertas: AlertaPagoPendiente[] = pagosPendientes.map(pago => {
        const fechaVencimiento = pago.fechaVencimiento || new Date(pago.fechaSesion);
        const diasVencido = Math.floor((hoy.getTime() - fechaVencimiento.getTime()) / (1000 * 60 * 60 * 24));
        
        let estado: 'pendiente' | 'vencido' | 'urgente' = 'pendiente';
        let prioridad: 'baja' | 'media' | 'alta' | 'critica' = 'baja';
        
        if (diasVencido > 7) {
          estado = 'urgente';
          prioridad = 'critica';
        } else if (diasVencido > 0) {
          estado = 'vencido';
          prioridad = diasVencido > 3 ? 'alta' : 'media';
        } else if (diasVencido === 0) {
          estado = 'pendiente';
          prioridad = 'media';
        } else {
          estado = 'pendiente';
          prioridad = 'baja';
        }
        
        // Encontrar la cita correspondiente
        const cita = citas.find(c => c.id === pago.citaId);
        
        return {
          id: pago.id,
          citaId: pago.citaId,
          clienteId: pago.clienteId,
          clienteNombre: pago.clienteNombre,
          fechaSesion: pago.fechaSesion,
          monto: pago.monto,
          diasVencido: Math.max(0, diasVencido),
          estado,
          fechaVencimiento: pago.fechaVencimiento,
          prioridad,
        };
      });
      
      // Ordenar por prioridad y días vencidos
      alertas.sort((a, b) => {
        const prioridadOrden = { critica: 4, alta: 3, media: 2, baja: 1 };
        if (prioridadOrden[b.prioridad] !== prioridadOrden[a.prioridad]) {
          return prioridadOrden[b.prioridad] - prioridadOrden[a.prioridad];
        }
        return b.diasVencido - a.diasVencido;
      });
      
      setTimeout(() => {
        resolve(alertas);
      }, 300);
    } catch (error) {
      console.error('Error obteniendo alertas de pagos pendientes:', error);
      setTimeout(() => {
        resolve([]);
      }, 300);
    }
  });
};

/**
 * Obtiene los pagos de sesiones con filtros
 */
export const getPagosSesiones = async (
  filtros?: FiltrosFinancieros,
  userId?: string
): Promise<PagoSesion[]> => {
  return new Promise(async (resolve) => {
    try {
      let pagos = [...mockPagos];
      
      // Aplicar filtros
      if (filtros?.fechaInicio) {
        pagos = pagos.filter(p => {
          const fecha = new Date(p.fechaSesion);
          return fecha >= filtros.fechaInicio!;
        });
      }
      
      if (filtros?.fechaFin) {
        pagos = pagos.filter(p => {
          const fecha = new Date(p.fechaSesion);
          return fecha <= filtros.fechaFin!;
        });
      }
      
      if (filtros?.clienteId) {
        pagos = pagos.filter(p => p.clienteId === filtros.clienteId);
      }
      
      if (filtros?.estadoPago) {
        pagos = pagos.filter(p => p.estado === filtros.estadoPago);
      }
      
      if (filtros?.tipoSesion) {
        pagos = pagos.filter(p => p.tipoSesion === filtros.tipoSesion);
      }
      
      // Ordenar por fecha de sesión (más recientes primero)
      pagos.sort((a, b) => b.fechaSesion.getTime() - a.fechaSesion.getTime());
      
      setTimeout(() => {
        resolve(pagos);
      }, 300);
    } catch (error) {
      console.error('Error obteniendo pagos de sesiones:', error);
      setTimeout(() => {
        resolve([]);
      }, 300);
    }
  });
};

/**
 * Obtiene las estadísticas financieras por cliente
 */
export const getEstadisticasFinancierasCliente = async (
  clienteId?: string,
  userId?: string
): Promise<EstadisticasFinancierasCliente[]> => {
  return new Promise(async (resolve) => {
    try {
      // Obtener todos los pagos
      const pagos = await getPagosSesiones(undefined, userId);
      
      // Agrupar por cliente
      const pagosPorCliente = new Map<string, PagoSesion[]>();
      
      pagos.forEach(pago => {
        if (!clienteId || pago.clienteId === clienteId) {
          const clientePagos = pagosPorCliente.get(pago.clienteId) || [];
          clientePagos.push(pago);
          pagosPorCliente.set(pago.clienteId, clientePagos);
        }
      });
      
      // Calcular estadísticas por cliente
      const estadisticas: EstadisticasFinancierasCliente[] = [];
      
      pagosPorCliente.forEach((pagosCliente, clienteId) => {
        const clienteNombre = pagosCliente[0].clienteNombre;
        
        const sesionesPagadas = pagosCliente.filter(p => p.estado === 'pagado');
        const sesionesPendientes = pagosCliente.filter(p => 
          p.estado === 'pendiente' || p.estado === 'vencido'
        );
        
        const totalIngresos = sesionesPagadas.reduce((sum, p) => sum + p.monto, 0);
        const montoPendiente = sesionesPendientes.reduce((sum, p) => sum + p.monto, 0);
        
        const promedioSesion = sesionesPagadas.length > 0
          ? totalIngresos / sesionesPagadas.length
          : 0;
        
        const ultimoPago = sesionesPagadas.length > 0
          ? sesionesPagadas.sort((a, b) => 
              (b.fechaPago || b.fechaSesion).getTime() - (a.fechaPago || a.fechaSesion).getTime()
            )[0].fechaPago
          : undefined;
        
        estadisticas.push({
          clienteId,
          clienteNombre,
          totalIngresos,
          sesionesPagadas: sesionesPagadas.length,
          sesionesPendientes: sesionesPendientes.length,
          montoPendiente,
          promedioSesion: Math.round(promedioSesion * 100) / 100,
          ultimoPago,
          deudaTotal: montoPendiente,
        });
      });
      
      // Ordenar por total de ingresos (mayor a menor)
      estadisticas.sort((a, b) => b.totalIngresos - a.totalIngresos);
      
      setTimeout(() => {
        resolve(estadisticas);
      }, 300);
    } catch (error) {
      console.error('Error obteniendo estadísticas financieras por cliente:', error);
      setTimeout(() => {
        resolve([]);
      }, 300);
    }
  });
};

/**
 * Marca un pago como pagado
 */
export const marcarPagoComoPagado = async (
  pagoId: string,
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia' | 'otro',
  notas?: string,
  userId?: string
): Promise<PagoSesion> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // En producción, esto actualizaría la base de datos
      const pago = mockPagos.find(p => p.id === pagoId);
      if (pago) {
        pago.estado = 'pagado';
        pago.fechaPago = new Date();
        pago.metodoPago = metodoPago;
        pago.notas = notas;
        pago.updatedAt = new Date();
        resolve(pago);
      } else {
        throw new Error('Pago no encontrado');
      }
    }, 300);
  });
};

/**
 * Obtiene el estado de pago de una cita
 */
export const getEstadoPagoCita = async (
  citaId: string,
  userId?: string
): Promise<EstadoPago | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pago = mockPagos.find(p => p.citaId === citaId);
      resolve(pago?.estado || null);
    }, 300);
  });
};


