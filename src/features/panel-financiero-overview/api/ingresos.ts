// API service para Ingresos
// Integra con los pagos de la agenda para obtener datos reales

import { IngresosEntrenador, FacturacionGimnasio, IngresoMensual, ComparacionAnual, ComparacionMensual, IngresosConTiempo } from '../types';
import { transaccionesApi } from './transacciones';
import { getCitas } from '../../agenda-calendario/api/calendario';

const API_BASE_URL = '/api/finanzas';

// Mock delay para simular llamadas API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ingresosApi = {
  // Ingresos detallados para entrenadores (ahora integrado con pagos de agenda)
  async obtenerIngresosDetalladosEntrenador(userId?: string): Promise<IngresosEntrenador> {
    await delay(500);
    
    try {
      // Obtener transacciones pagadas del mes actual
      const fechaActual = new Date();
      const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
      const ultimoDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0, 23, 59, 59);
      
      const transaccionesPagadas = await transaccionesApi.obtenerTransaccionesPagadas(
        primerDiaMes,
        ultimoDiaMes,
        userId
      );
      
      // Agrupar por tipo de servicio
      const sesiones1a1 = transaccionesPagadas
        .filter(t => t.tipoServicio === 'sesion-1-1')
        .reduce((sum, t) => sum + t.monto, 0);
      
      const paquetesEntrenamiento = transaccionesPagadas
        .filter(t => t.tipoServicio === 'paquete' || t.concepto.toLowerCase().includes('paquete'))
        .reduce((sum, t) => sum + t.monto, 0);
      
      const consultasOnline = transaccionesPagadas
        .filter(t => t.tipoServicio === 'videollamada' || t.concepto.toLowerCase().includes('videollamada') || t.concepto.toLowerCase().includes('online'))
        .reduce((sum, t) => sum + t.monto, 0);
      
      const total = transaccionesPagadas.reduce((sum, t) => sum + t.monto, 0);
      
      return {
        sesiones1a1,
        paquetesEntrenamiento,
        consultasOnline,
        total
      };
    } catch (error) {
      console.error('Error obteniendo ingresos desde transacciones:', error);
      // Fallback a valores mock si hay error
      return {
        sesiones1a1: 3420,
        paquetesEntrenamiento: 1500,
        consultasOnline: 500,
        total: 5420
      };
    }
  },

  // Facturación detallada para gimnasios
  async obtenerFacturacionDetalladaGimnasio(): Promise<FacturacionGimnasio> {
    await delay(500);
    return {
      total: 187500,
      cuotasSocios: 128000,
      entrenamientoPersonal: 35000,
      tienda: 18500,
      serviciosAdicionales: 6000
    };
  },

  // Obtener ingresos por período
  async obtenerIngresosPorPeriodo(
    rol: 'entrenador' | 'gimnasio',
    periodo: string
  ): Promise<number> {
    await delay(400);
    return rol === 'entrenador' ? 5420 : 187500;
  },

  // Obtener evolución mensual de ingresos (últimos 12 meses)
  async obtenerEvolucionMensualIngresos(
    rol: 'entrenador' | 'gimnasio',
    userId?: string
  ): Promise<IngresoMensual[]> {
    await delay(500);
    
    if (rol === 'entrenador') {
      try {
        const ingresosMensuales: IngresoMensual[] = [];
        const hoy = new Date();
        
        // Obtener ingresos de los últimos 12 meses
        for (let i = 11; i >= 0; i--) {
          const fecha = new Date(hoy);
          fecha.setMonth(fecha.getMonth() - i);
          const primerDiaMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
          const ultimoDiaMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0, 23, 59, 59);
          
          const transaccionesPagadas = await transaccionesApi.obtenerTransaccionesPagadas(
            primerDiaMes,
            ultimoDiaMes,
            userId
          );
          
          const totalMes = transaccionesPagadas.reduce((sum, t) => sum + t.monto, 0);
          
          ingresosMensuales.push({
            mes: fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' }),
            mesCorto: fecha.toLocaleDateString('es-ES', { month: 'short' }),
            año: fecha.getFullYear(),
            ingresos: totalMes,
            fecha: new Date(fecha.getFullYear(), fecha.getMonth(), 1)
          });
        }
        
        return ingresosMensuales;
      } catch (error) {
        console.error('Error obteniendo evolución mensual:', error);
        // Fallback a datos mock
        return this._generarDatosMockMensuales();
      }
    } else {
      // Para gimnasios, usar datos mock por ahora
      return this._generarDatosMockMensualesGimnasio();
    }
  },

  // Generar datos mock para entrenadores
  _generarDatosMockMensuales(): IngresoMensual[] {
    const datos: IngresoMensual[] = [];
    const hoy = new Date();
    const baseIngreso = 5000;
    
    for (let i = 11; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setMonth(fecha.getMonth() - i);
      // Simular variación aleatoria entre -20% y +30%
      const variacion = (Math.random() * 0.5 - 0.2);
      const ingresos = baseIngreso * (1 + variacion);
      
      datos.push({
        mes: fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' }),
        mesCorto: fecha.toLocaleDateString('es-ES', { month: 'short' }),
        año: fecha.getFullYear(),
        ingresos: Math.round(ingresos),
        fecha: new Date(fecha.getFullYear(), fecha.getMonth(), 1)
      });
    }
    
    return datos;
  },

  // Generar datos mock para gimnasios
  _generarDatosMockMensualesGimnasio(): IngresoMensual[] {
    const datos: IngresoMensual[] = [];
    const hoy = new Date();
    const baseIngreso = 180000;
    
    for (let i = 11; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setMonth(fecha.getMonth() - i);
      // Simular variación aleatoria entre -15% y +25%
      const variacion = (Math.random() * 0.4 - 0.15);
      const ingresos = baseIngreso * (1 + variacion);
      
      datos.push({
        mes: fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' }),
        mesCorto: fecha.toLocaleDateString('es-ES', { month: 'short' }),
        año: fecha.getFullYear(),
        ingresos: Math.round(ingresos),
        fecha: new Date(fecha.getFullYear(), fecha.getMonth(), 1)
      });
    }
    
    return datos;
  },

  // Obtener comparación año actual vs año anterior
  async obtenerComparacionAnual(
    rol: 'entrenador' | 'gimnasio',
    userId?: string
  ): Promise<ComparacionAnual> {
    await delay(500);
    
    try {
      const hoy = new Date();
      const añoActual = hoy.getFullYear();
      const añoAnterior = añoActual - 1;
      
      const datosComparacion: ComparacionMensual[] = [];
      let totalActual = 0;
      let totalAnterior = 0;
      
      // Obtener datos mes a mes para ambos años
      for (let mes = 0; mes < 12; mes++) {
        // Año actual
        const fechaActual = new Date(añoActual, mes, 1);
        const primerDiaMesActual = new Date(añoActual, mes, 1);
        const ultimoDiaMesActual = new Date(añoActual, mes + 1, 0, 23, 59, 59);
        
        // Año anterior
        const primerDiaMesAnterior = new Date(añoAnterior, mes, 1);
        const ultimoDiaMesAnterior = new Date(añoAnterior, mes + 1, 0, 23, 59, 59);
        
        let ingresosActual = 0;
        let ingresosAnterior = 0;
        
        if (rol === 'entrenador') {
          // Obtener transacciones del año actual
          const transaccionesActual = await transaccionesApi.obtenerTransaccionesPagadas(
            primerDiaMesActual,
            ultimoDiaMesActual,
            userId
          );
          ingresosActual = transaccionesActual.reduce((sum, t) => sum + t.monto, 0);
          
          // Obtener transacciones del año anterior
          const transaccionesAnterior = await transaccionesApi.obtenerTransaccionesPagadas(
            primerDiaMesAnterior,
            ultimoDiaMesAnterior,
            userId
          );
          ingresosAnterior = transaccionesAnterior.reduce((sum, t) => sum + t.monto, 0);
        } else {
          // Para gimnasios, usar datos mock
          ingresosActual = 180000 * (1 + (Math.random() * 0.4 - 0.15));
          ingresosAnterior = 165000 * (1 + (Math.random() * 0.4 - 0.15));
        }
        
        totalActual += ingresosActual;
        totalAnterior += ingresosAnterior;
        
        const diferencia = ingresosActual - ingresosAnterior;
        const diferenciaPorcentaje = ingresosAnterior > 0 
          ? (diferencia / ingresosAnterior) * 100 
          : 0;
        
        datosComparacion.push({
          mes: fechaActual.toLocaleDateString('es-ES', { month: 'long' }),
          mesCorto: fechaActual.toLocaleDateString('es-ES', { month: 'short' }),
          mesNumero: mes + 1,
          añoActual: Math.round(ingresosActual),
          añoAnterior: Math.round(ingresosAnterior),
          diferencia: Math.round(diferencia),
          diferenciaPorcentaje: Math.round(diferenciaPorcentaje * 100) / 100
        });
      }
      
      const crecimientoTotal = totalActual - totalAnterior;
      const crecimientoPorcentaje = totalAnterior > 0 
        ? (crecimientoTotal / totalAnterior) * 100 
        : 0;
      
      return {
        añoActual,
        añoAnterior,
        datos: datosComparacion,
        crecimientoTotal: Math.round(crecimientoTotal),
        crecimientoPorcentaje: Math.round(crecimientoPorcentaje * 100) / 100
      };
    } catch (error) {
      console.error('Error obteniendo comparación anual:', error);
      // Fallback a datos mock
      return this._generarComparacionAnualMock();
    }
  },

  // Generar datos mock para comparación anual
  _generarComparacionAnualMock(): ComparacionAnual {
    const hoy = new Date();
    const añoActual = hoy.getFullYear();
    const añoAnterior = añoActual - 1;
    const baseActual = 5000;
    const baseAnterior = 4500;
    
    const datos: ComparacionMensual[] = [];
    let totalActual = 0;
    let totalAnterior = 0;
    
    for (let mes = 0; mes < 12; mes++) {
      const fecha = new Date(añoActual, mes, 1);
      const variacionActual = (Math.random() * 0.5 - 0.2);
      const variacionAnterior = (Math.random() * 0.4 - 0.15);
      
      const ingresosActual = baseActual * (1 + variacionActual);
      const ingresosAnterior = baseAnterior * (1 + variacionAnterior);
      
      totalActual += ingresosActual;
      totalAnterior += ingresosAnterior;
      
      const diferencia = ingresosActual - ingresosAnterior;
      const diferenciaPorcentaje = ingresosAnterior > 0 
        ? (diferencia / ingresosAnterior) * 100 
        : 0;
      
      datos.push({
        mes: fecha.toLocaleDateString('es-ES', { month: 'long' }),
        mesCorto: fecha.toLocaleDateString('es-ES', { month: 'short' }),
        mesNumero: mes + 1,
        añoActual: Math.round(ingresosActual),
        añoAnterior: Math.round(ingresosAnterior),
        diferencia: Math.round(diferencia),
        diferenciaPorcentaje: Math.round(diferenciaPorcentaje * 100) / 100
      });
    }
    
    const crecimientoTotal = totalActual - totalAnterior;
    const crecimientoPorcentaje = totalAnterior > 0 
      ? (crecimientoTotal / totalAnterior) * 100 
      : 0;
    
    return {
      añoActual,
      añoAnterior,
      datos,
      crecimientoTotal: Math.round(crecimientoTotal),
      crecimientoPorcentaje: Math.round(crecimientoPorcentaje * 100) / 100
    };
  },

  // Obtener ingresos con métricas de tiempo e ingreso por hora
  async obtenerIngresosConTiempo(userId?: string): Promise<IngresosConTiempo[]> {
    await delay(500);
    
    try {
      const fechaActual = new Date();
      const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
      const ultimoDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0, 23, 59, 59);
      
      // Obtener transacciones pagadas
      const transaccionesPagadas = await transaccionesApi.obtenerTransaccionesPagadas(
        primerDiaMes,
        ultimoDiaMes,
        userId
      );
      
      // Obtener citas para calcular duración
      const citas = await getCitas(primerDiaMes, ultimoDiaMes, 'entrenador');
      
      // Mapear citas por ID para obtener duración
      const citasMap = new Map(citas.map(c => [c.id, c]));
      
      // Duración promedio por tipo de servicio (en minutos)
      const duracionesPromedio: Record<string, number> = {
        'sesion-1-1': 60,
        'videollamada': 45,
        'paquete': 60, // Promedio por sesión en paquete
        'evaluacion': 90,
        'otro': 60
      };
      
      // Agrupar por tipo de servicio
      const servicios: Record<string, { transacciones: typeof transaccionesPagadas, citas: typeof citas }> = {
        'sesion-1-1': { transacciones: [], citas: [] },
        'paquetesEntrenamiento': { transacciones: [], citas: [] },
        'consultasOnline': { transacciones: [], citas: [] }
      };
      
      transaccionesPagadas.forEach(trans => {
        const cita = trans.citaId ? citasMap.get(trans.citaId) : null;
        const duracion = cita 
          ? Math.round((cita.fechaFin.getTime() - cita.fechaInicio.getTime()) / (1000 * 60))
          : duracionesPromedio[trans.tipoServicio] || 60;
        
        if (trans.tipoServicio === 'sesion-1-1') {
          servicios['sesion-1-1'].transacciones.push(trans);
          if (cita) servicios['sesion-1-1'].citas.push(cita);
        } else if (trans.tipoServicio === 'paquete' || trans.concepto.toLowerCase().includes('paquete')) {
          servicios['paquetesEntrenamiento'].transacciones.push(trans);
          if (cita) servicios['paquetesEntrenamiento'].citas.push(cita);
        } else if (trans.tipoServicio === 'videollamada' || trans.concepto.toLowerCase().includes('videollamada') || trans.concepto.toLowerCase().includes('online')) {
          servicios['consultasOnline'].transacciones.push(trans);
          if (cita) servicios['consultasOnline'].citas.push(cita);
        }
      });
      
      // Calcular métricas por servicio
      const ingresosConTiempo: IngresosConTiempo[] = [];
      
      Object.entries(servicios).forEach(([tipoServicio, datos]) => {
        const transacciones = datos.transacciones;
        const citas = datos.citas;
        
        if (transacciones.length === 0) return;
        
        const ingresos = transacciones.reduce((sum, t) => sum + t.monto, 0);
        const numeroSesiones = transacciones.length;
        
        // Calcular tiempo total
        let tiempoTotalMinutos = 0;
        if (citas.length > 0) {
          tiempoTotalMinutos = citas.reduce((sum, c) => {
            const duracion = Math.round((c.fechaFin.getTime() - c.fechaInicio.getTime()) / (1000 * 60));
            return sum + duracion;
          }, 0);
        } else {
          // Usar duración promedio si no hay citas
          const duracionPromedio = duracionesPromedio[tipoServicio === 'sesion-1-1' ? 'sesion-1-1' : 
                                                      tipoServicio === 'consultasOnline' ? 'videollamada' : 
                                                      'paquete'] || 60;
          tiempoTotalMinutos = numeroSesiones * duracionPromedio;
        }
        
        const tiempoInvertidoHoras = tiempoTotalMinutos / 60;
        const duracionPromedioMinutos = numeroSesiones > 0 ? tiempoTotalMinutos / numeroSesiones : 0;
        const ingresoPorHora = tiempoInvertidoHoras > 0 ? ingresos / tiempoInvertidoHoras : 0;
        const promedioPorSesion = numeroSesiones > 0 ? ingresos / numeroSesiones : 0;
        
        const nombresServicios: Record<string, string> = {
          'sesion-1-1': 'Sesiones 1 a 1',
          'paquetesEntrenamiento': 'Paquetes Entrenamiento',
          'consultasOnline': 'Consultas Online'
        };
        
        ingresosConTiempo.push({
          tipoServicio: tipoServicio as any,
          nombreServicio: nombresServicios[tipoServicio] || tipoServicio,
          ingresos: Math.round(ingresos * 100) / 100,
          tiempoInvertidoHoras: Math.round(tiempoInvertidoHoras * 100) / 100,
          tiempoInvertidoMinutos: tiempoTotalMinutos,
          ingresoPorHora: Math.round(ingresoPorHora * 100) / 100,
          numeroSesiones,
          promedioPorSesion: Math.round(promedioPorSesion * 100) / 100,
          duracionPromedioMinutos: Math.round(duracionPromedioMinutos)
        });
      });
      
      return ingresosConTiempo;
    } catch (error) {
      console.error('Error obteniendo ingresos con tiempo:', error);
      // Fallback a datos mock
      return [
        {
          tipoServicio: 'sesion-1-1',
          nombreServicio: 'Sesiones 1 a 1',
          ingresos: 3420,
          tiempoInvertidoHoras: 57,
          tiempoInvertidoMinutos: 3420,
          ingresoPorHora: 60,
          numeroSesiones: 57,
          promedioPorSesion: 60,
          duracionPromedioMinutos: 60
        },
        {
          tipoServicio: 'paquetesEntrenamiento',
          nombreServicio: 'Paquetes Entrenamiento',
          ingresos: 1500,
          tiempoInvertidoHoras: 25,
          tiempoInvertidoMinutos: 1500,
          ingresoPorHora: 60,
          numeroSesiones: 25,
          promedioPorSesion: 60,
          duracionPromedioMinutos: 60
        },
        {
          tipoServicio: 'consultasOnline',
          nombreServicio: 'Consultas Online',
          ingresos: 500,
          tiempoInvertidoHoras: 11.25,
          tiempoInvertidoMinutos: 675,
          ingresoPorHora: 44.44,
          numeroSesiones: 15,
          promedioPorSesion: 33.33,
          duracionPromedioMinutos: 45
        }
      ];
    }
  },
};

