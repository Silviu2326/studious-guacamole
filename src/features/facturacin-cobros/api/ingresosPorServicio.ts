import { Factura, TipoFactura } from '../types';

export interface IngresoPorServicio {
  tipoServicio: TipoFactura;
  nombre: string;
  totalIngresos: number;
  cantidadFacturas: number;
  porcentajeDelTotal: number;
  promedioTicket: number;
}

export interface FiltroIngresosPorServicio {
  fechaInicio?: Date;
  fechaFin?: Date;
}

export const ingresosPorServicioAPI = {
  /**
   * Obtiene ingresos desglosados por tipo de servicio
   */
  async obtenerIngresosPorServicio(
    facturas: Factura[],
    filtros?: FiltroIngresosPorServicio
  ): Promise<IngresoPorServicio[]> {
    // Filtrar facturas por rango de fechas si se proporciona
    let facturasFiltradas = [...facturas];
    
    if (filtros) {
      if (filtros.fechaInicio) {
        facturasFiltradas = facturasFiltradas.filter(
          f => f.fechaEmision >= filtros.fechaInicio!
        );
      }
      if (filtros.fechaFin) {
        const fechaFin = new Date(filtros.fechaFin);
        fechaFin.setHours(23, 59, 59);
        facturasFiltradas = facturasFiltradas.filter(
          f => f.fechaEmision <= fechaFin
        );
      }
    }

    // Solo contar facturas pagadas para calcular ingresos reales
    const facturasPagadas = facturasFiltradas.filter(f => f.estado === 'pagada');

    // Agrupar por tipo de servicio
    const ingresosPorTipo = new Map<TipoFactura, {
      total: number;
      cantidad: number;
    }>();

    facturasPagadas.forEach(factura => {
      const actual = ingresosPorTipo.get(factura.tipo) || { total: 0, cantidad: 0 };
      ingresosPorTipo.set(factura.tipo, {
        total: actual.total + factura.total,
        cantidad: actual.cantidad + 1
      });
    });

    // Calcular total general
    const totalGeneral = Array.from(ingresosPorTipo.values())
      .reduce((sum, item) => sum + item.total, 0);

    // Mapeo de nombres de tipos de servicio
    const nombresServicios: Record<TipoFactura, string> = {
      servicios: 'Sesiones Individuales',
      productos: 'Productos',
      recurrente: 'Planes Recurrentes',
      paquetes: 'Paquetes',
      eventos: 'Eventos',
      adicionales: 'Servicios Adicionales',
      correccion: 'Correcciones'
    };

    // Convertir a array y calcular porcentajes
    const resultado: IngresoPorServicio[] = Array.from(ingresosPorTipo.entries())
      .map(([tipo, datos]) => ({
        tipoServicio: tipo,
        nombre: nombresServicios[tipo] || tipo,
        totalIngresos: datos.total,
        cantidadFacturas: datos.cantidad,
        porcentajeDelTotal: totalGeneral > 0 
          ? (datos.total / totalGeneral) * 100 
          : 0,
        promedioTicket: datos.cantidad > 0 
          ? datos.total / datos.cantidad 
          : 0
      }))
      .sort((a, b) => b.totalIngresos - a.totalIngresos); // Ordenar por ingresos descendente

    return resultado;
  }
};


