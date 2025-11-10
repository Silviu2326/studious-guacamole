import { ReporteMensualSimple, PagoPendiente } from '../types';
import { morosidadAPI } from './morosidad';

// Mock data para pagos pagados (en producción vendría de la base de datos)
const mockPagosPagados: Array<{
  id: string;
  facturaId: string;
  numeroFactura: string;
  clienteId: string;
  clienteNombre: string;
  monto: number;
  fechaPago: Date;
  metodoPago?: string;
}> = [
  {
    id: 'pago1',
    facturaId: 'factura1',
    numeroFactura: 'FAC-2024-001',
    clienteId: 'cliente1',
    clienteNombre: 'Juan Pérez',
    monto: 238000,
    fechaPago: new Date('2024-02-05'),
    metodoPago: 'nequi'
  },
  {
    id: 'pago2',
    facturaId: 'factura6',
    numeroFactura: 'FAC-2024-010',
    clienteId: 'cliente6',
    clienteNombre: 'Pedro López',
    monto: 150000,
    fechaPago: new Date('2024-02-10'),
    metodoPago: 'transferencia'
  },
  {
    id: 'pago3',
    facturaId: 'factura7',
    numeroFactura: 'FAC-2024-011',
    clienteId: 'cliente7',
    clienteNombre: 'Laura Sánchez',
    monto: 300000,
    fechaPago: new Date('2024-02-15'),
    metodoPago: 'efectivo'
  }
];

export const reportesMensualesAPI = {
  // Obtener reporte mensual simple
  async obtenerReporteMensual(mes: number, año: number): Promise<ReporteMensualSimple> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Calcular fechas del mes
    const fechaInicio = new Date(año, mes - 1, 1);
    const fechaFin = new Date(año, mes, 0, 23, 59, 59, 999);
    
    // Obtener pagos pagados en el mes
    const pagosRecibidos = mockPagosPagados.filter(pago => {
      const fechaPago = new Date(pago.fechaPago);
      return fechaPago >= fechaInicio && fechaPago <= fechaFin;
    });
    
    // Obtener pagos pendientes que deberían haberse pagado en el mes
    const todosLosPagos = await morosidadAPI.obtenerPagosPendientes();
    
    // Pagos que vencen en el mes o están pendientes
    const pagosFaltantes = todosLosPagos
      .filter(pago => {
        const fechaVenc = new Date(pago.fechaVencimiento);
        // Incluir pagos que vencieron en el mes o antes
        return fechaVenc <= fechaFin && pago.estado !== 'pagado';
      })
      .map(pago => ({
        id: pago.id,
        facturaId: pago.facturaId,
        numeroFactura: pago.numeroFactura,
        clienteNombre: pago.cliente.nombre,
        montoPendiente: pago.montoPendiente,
        fechaVencimiento: pago.fechaVencimiento,
        diasRetraso: pago.diasRetraso
      }));
    
    const totalCobrado = pagosRecibidos.reduce((sum, p) => sum + p.monto, 0);
    const totalPendiente = pagosFaltantes.reduce((sum, p) => sum + p.montoPendiente, 0);
    
    return {
      mes,
      año,
      totalCobrado,
      totalPendiente,
      pagosRecibidos: pagosRecibidos.map(p => ({
        id: p.id,
        facturaId: p.facturaId,
        numeroFactura: p.numeroFactura,
        clienteNombre: p.clienteNombre,
        monto: p.monto,
        fechaPago: p.fechaPago,
        metodoPago: p.metodoPago as any
      })),
      pagosFaltantes
    };
  }
};

