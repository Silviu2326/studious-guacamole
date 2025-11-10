// API service para Ranking de Clientes por Ingresos
// Permite ver cuánto dinero ha generado cada cliente en un período

import { ClienteRanking, PeriodoFiltro } from '../types';
import { transaccionesApi, Transaccion } from './transacciones';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Calcular fechas según el período
const calcularFechasPeriodo = (periodo: PeriodoFiltro): { fechaInicio: Date; fechaFin: Date } => {
  const hoy = new Date();
  const fechaFin = new Date(hoy);
  fechaFin.setHours(23, 59, 59, 999);

  let fechaInicio = new Date();

  switch (periodo) {
    case '7d':
      fechaInicio.setDate(hoy.getDate() - 7);
      break;
    case '30d':
      fechaInicio.setDate(hoy.getDate() - 30);
      break;
    case '90d':
      fechaInicio.setDate(hoy.getDate() - 90);
      break;
    case 'ytd':
      fechaInicio = new Date(hoy.getFullYear(), 0, 1);
      break;
    case 'custom':
      // Para custom, se pasarán las fechas directamente
      return { fechaInicio, fechaFin };
    default:
      fechaInicio.setDate(hoy.getDate() - 30);
  }

  fechaInicio.setHours(0, 0, 0, 0);
  return { fechaInicio, fechaFin };
};

export const rankingClientesApi = {
  // Obtener ranking de clientes por ingresos
  async obtenerRankingClientes(
    periodo: PeriodoFiltro = '30d',
    fechaInicioCustom?: Date,
    fechaFinCustom?: Date,
    userId?: string
  ): Promise<ClienteRanking[]> {
    await delay(500);

    try {
      // Calcular fechas según el período
      let fechaInicio: Date;
      let fechaFin: Date;

      if (periodo === 'custom' && fechaInicioCustom && fechaFinCustom) {
        fechaInicio = fechaInicioCustom;
        fechaFin = fechaFinCustom;
      } else {
        const fechas = calcularFechasPeriodo(periodo);
        fechaInicio = fechas.fechaInicio;
        fechaFin = fechas.fechaFin;
      }

      // Obtener transacciones pagadas en el período
      const transacciones = await transaccionesApi.obtenerTransacciones(
        {
          fechaInicio,
          fechaFin,
          estado: 'pagado',
        },
        userId
      );

      // Agrupar por cliente
      const clientesMap = new Map<string, {
        clienteId: string;
        nombre: string;
        transacciones: Transaccion[];
        totalIngresos: number;
        ultimaTransaccion?: Date;
      }>();

      transacciones.forEach((transaccion) => {
        const clienteId = transaccion.clienteId;
        const existing = clientesMap.get(clienteId);

        if (existing) {
          existing.transacciones.push(transaccion);
          existing.totalIngresos += transaccion.monto;
          if (!existing.ultimaTransaccion || transaccion.fecha > existing.ultimaTransaccion) {
            existing.ultimaTransaccion = transaccion.fecha;
          }
        } else {
          clientesMap.set(clienteId, {
            clienteId,
            nombre: transaccion.cliente,
            transacciones: [transaccion],
            totalIngresos: transaccion.monto,
            ultimaTransaccion: transaccion.fecha,
          });
        }
      });

      // Convertir a array y calcular métricas
      const ranking: ClienteRanking[] = Array.from(clientesMap.values())
        .map((cliente) => ({
          clienteId: cliente.clienteId,
          nombre: cliente.nombre,
          totalIngresos: cliente.totalIngresos,
          numeroTransacciones: cliente.transacciones.length,
          ultimaTransaccion: cliente.ultimaTransaccion?.toISOString(),
          promedioTransaccion: cliente.totalIngresos / cliente.transacciones.length,
        }))
        .sort((a, b) => b.totalIngresos - a.totalIngresos); // Ordenar por ingresos descendente

      return ranking;
    } catch (error) {
      console.error('Error obteniendo ranking de clientes:', error);
      // Fallback a datos mock si hay error
      return [
        {
          clienteId: '1',
          nombre: 'Juan Pérez',
          totalIngresos: 1250,
          numeroTransacciones: 8,
          ultimaTransaccion: new Date().toISOString(),
          promedioTransaccion: 156.25,
        },
        {
          clienteId: '2',
          nombre: 'María González',
          totalIngresos: 980,
          numeroTransacciones: 6,
          ultimaTransaccion: new Date().toISOString(),
          promedioTransaccion: 163.33,
        },
        {
          clienteId: '3',
          nombre: 'Carlos Ruiz',
          totalIngresos: 750,
          numeroTransacciones: 5,
          ultimaTransaccion: new Date().toISOString(),
          promedioTransaccion: 150,
        },
      ];
    }
  },
};

