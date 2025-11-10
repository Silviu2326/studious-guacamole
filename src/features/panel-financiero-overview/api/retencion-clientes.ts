// API para métricas de retención de clientes
// Calcula antigüedad promedio, tasa de retención y altas/bajas del período

import { MetricasRetencionClientes } from '../types';
import { getClients } from '../../gestión-de-clientes/api/clients';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calcula la antigüedad promedio de los clientes en días
 */
const calcularAntiguedadPromedio = (fechasRegistro: string[]): {
  dias: number;
  meses: number;
  años: number;
  texto: string;
} => {
  if (fechasRegistro.length === 0) {
    return { dias: 0, meses: 0, años: 0, texto: 'Sin datos' };
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const antiguedades = fechasRegistro.map(fechaStr => {
    const fechaRegistro = new Date(fechaStr);
    fechaRegistro.setHours(0, 0, 0, 0);
    const diffTime = hoy.getTime() - fechaRegistro.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  });

  const promedioDias = Math.round(
    antiguedades.reduce((sum, dias) => sum + dias, 0) / antiguedades.length
  );

  const años = Math.floor(promedioDias / 365);
  const meses = Math.floor((promedioDias % 365) / 30);
  const dias = promedioDias % 30;

  let texto = '';
  if (años > 0) {
    texto += `${años} ${años === 1 ? 'año' : 'años'}`;
  }
  if (meses > 0) {
    if (texto) texto += ', ';
    texto += `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
  }
  if (dias > 0 && años === 0) {
    if (texto) texto += ' y ';
    texto += `${dias} ${dias === 1 ? 'día' : 'días'}`;
  }
  if (!texto) texto = 'Menos de un día';

  return { dias: promedioDias, meses, años, texto };
};

/**
 * Calcula la tasa de retención
 */
const calcularTasaRetencion = (
  clientesActivos: number,
  clientesTotales: number,
  clientesActivosPeriodoAnterior?: number
): {
  porcentaje: number;
  clientesActivos: number;
  clientesTotales: number;
  tendencia: 'up' | 'down' | 'neutral';
  variacionPeriodoAnterior: number;
} => {
  const porcentaje = clientesTotales > 0
    ? Math.round((clientesActivos / clientesTotales) * 100 * 100) / 100
    : 0;

  let tendencia: 'up' | 'down' | 'neutral' = 'neutral';
  let variacionPeriodoAnterior = 0;

  if (clientesActivosPeriodoAnterior !== undefined) {
    variacionPeriodoAnterior = clientesActivos - clientesActivosPeriodoAnterior;
    if (variacionPeriodoAnterior > 0) {
      tendencia = 'up';
    } else if (variacionPeriodoAnterior < 0) {
      tendencia = 'down';
    }
  }

  return {
    porcentaje,
    clientesActivos,
    clientesTotales,
    tendencia,
    variacionPeriodoAnterior
  };
};

/**
 * Calcula altas y bajas del período actual
 */
const calcularAltasBajas = (
  clientes: any[],
  periodoInicio: Date,
  periodoFin: Date
): {
  periodo: string;
  altas: number;
  bajas: number;
  saldoNeto: number;
  tendencia: 'up' | 'down' | 'neutral';
} => {
  const altas = clientes.filter(c => {
    if (!c.registrationDate) return false;
    const fechaRegistro = new Date(c.registrationDate);
    return fechaRegistro >= periodoInicio && fechaRegistro <= periodoFin;
  }).length;

  // Consideramos bajas a los clientes que están marcados como "perdido" o "inactivo"
  // y cuya última sesión o check-in fue en el período
  const bajas = clientes.filter(c => {
    if (c.status === 'perdido' || c.status === 'inactivo') {
      const ultimaActividad = c.lastSession || c.lastCheckIn || c.registrationDate;
      if (!ultimaActividad) return false;
      const fechaUltimaActividad = new Date(ultimaActividad);
      return fechaUltimaActividad >= periodoInicio && fechaUltimaActividad <= periodoFin;
    }
    return false;
  }).length;

  const saldoNeto = altas - bajas;
  const tendencia: 'up' | 'down' | 'neutral' = saldoNeto > 0 ? 'up' : saldoNeto < 0 ? 'down' : 'neutral';

  const mesActual = periodoInicio.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const primeraLetraMayuscula = mesActual.charAt(0).toUpperCase() + mesActual.slice(1);

  return {
    periodo: primeraLetraMayuscula,
    altas,
    bajas,
    saldoNeto,
    tendencia
  };
};

/**
 * Calcula la distribución de antigüedad de clientes
 */
const calcularDistribucionAntiguedad = (fechasRegistro: string[]): {
  menos3Meses: number;
  entre3y6Meses: number;
  entre6y12Meses: number;
  mas12Meses: number;
} => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  let menos3Meses = 0;
  let entre3y6Meses = 0;
  let entre6y12Meses = 0;
  let mas12Meses = 0;

  fechasRegistro.forEach(fechaStr => {
    const fechaRegistro = new Date(fechaStr);
    fechaRegistro.setHours(0, 0, 0, 0);
    const diffTime = hoy.getTime() - fechaRegistro.getTime();
    const dias = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const meses = dias / 30;

    if (meses < 3) {
      menos3Meses++;
    } else if (meses < 6) {
      entre3y6Meses++;
    } else if (meses < 12) {
      entre6y12Meses++;
    } else {
      mas12Meses++;
    }
  });

  return {
    menos3Meses,
    entre3y6Meses,
    entre6y12Meses,
    mas12Meses
  };
};

export const retencionClientesApi = {
  /**
   * Obtiene las métricas de retención de clientes
   */
  async obtenerMetricasRetencion(
    role: 'entrenador' | 'gimnasio',
    userId?: string
  ): Promise<MetricasRetencionClientes> {
    await delay(500);

    try {
      // Obtener todos los clientes
      const clientes = await getClients(role, userId);

      // Filtrar clientes activos
      const clientesActivos = clientes.filter(c => c.status === 'activo');
      const clientesTotales = clientes.length;

      // Calcular antigüedad promedio
      const fechasRegistro = clientes
        .filter(c => c.registrationDate)
        .map(c => c.registrationDate!);
      
      const antiguedadPromedio = calcularAntiguedadPromedio(fechasRegistro);

      // Calcular tasa de retención
      // Para simular variación, calculamos clientes activos del mes anterior
      // (en producción esto vendría de datos históricos)
      const clientesActivosPeriodoAnterior = Math.max(0, clientesActivos.length - 2);
      const tasaRetencion = calcularTasaRetencion(
        clientesActivos.length,
        clientesTotales,
        clientesActivosPeriodoAnterior
      );

      // Calcular altas y bajas del mes actual
      const hoy = new Date();
      const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0, 23, 59, 59);
      
      const altasBajasPeriodo = calcularAltasBajas(
        clientes,
        primerDiaMes,
        ultimoDiaMes
      );

      // Calcular distribución de antigüedad
      const distribucionAntiguedad = calcularDistribucionAntiguedad(fechasRegistro);

      return {
        antiguedadPromedio,
        tasaRetencion,
        altasBajasPeriodo,
        distribucionAntiguedad
      };
    } catch (error) {
      console.error('Error obteniendo métricas de retención:', error);
      // Retornar datos mock en caso de error
      return {
        antiguedadPromedio: {
          dias: 180,
          meses: 6,
          años: 0,
          texto: '6 meses'
        },
        tasaRetencion: {
          porcentaje: 75.5,
          clientesActivos: 15,
          clientesTotales: 20,
          tendencia: 'up',
          variacionPeriodoAnterior: 2
        },
        altasBajasPeriodo: {
          periodo: new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
          altas: 3,
          bajas: 1,
          saldoNeto: 2,
          tendencia: 'up'
        },
        distribucionAntiguedad: {
          menos3Meses: 5,
          entre3y6Meses: 4,
          entre6y12Meses: 6,
          mas12Meses: 5
        }
      };
    }
  }
};

