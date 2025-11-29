import { Factura, Cobro, IngresoDia, ProyeccionFinMes } from '../types';
import { facturasAPI } from './facturas';
import { cobrosAPI } from './cobros';

export const ingresosAPI = {
  // Obtener ingresos por día del mes
  async obtenerIngresosPorMes(ano: number, mes: number): Promise<IngresoDia[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const inicioMes = new Date(ano, mes - 1, 1);
    inicioMes.setHours(0, 0, 0, 0);
    const finMes = new Date(ano, mes, 0);
    finMes.setHours(23, 59, 59, 999);
    
    // Obtener todas las facturas (necesitamos un rango más amplio para incluir facturas que vencen en el mes)
    // pero fueron emitidas antes
    const inicioBusqueda = new Date(ano, mes - 1, 1);
    inicioBusqueda.setMonth(inicioBusqueda.getMonth() - 3); // Buscar 3 meses atrás para facturas que vencen este mes
    const finBusqueda = new Date(ano, mes, 0);
    finBusqueda.setMonth(finBusqueda.getMonth() + 1); // Y un mes adelante
    
    const todasLasFacturas = await facturasAPI.obtenerFacturas({
      fechaInicio: inicioBusqueda,
      fechaFin: finBusqueda
    });
    
    // Filtrar facturas pendientes o vencidas que vencen en el mes actual
    const facturasPendientes = todasLasFacturas.filter(f => {
      const fechaVenc = new Date(f.fechaVencimiento);
      fechaVenc.setHours(0, 0, 0, 0);
      return (
        (f.estado === 'pendiente' || f.estado === 'vencida' || f.estado === 'parcial') &&
        fechaVenc >= inicioMes &&
        fechaVenc <= finMes &&
        f.montoPendiente > 0
      );
    });
    
    // Obtener todos los cobros del mes
    const cobros = await cobrosAPI.obtenerCobros({
      fechaInicio: inicioMes,
      fechaFin: finMes
    });
    
    // Crear mapa de ingresos por día
    const ingresosPorDia: Map<string, IngresoDia> = new Map();
    
    // Inicializar todos los días del mes
    const diasEnMes = finMes.getDate();
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fecha = new Date(ano, mes - 1, dia);
      const clave = fecha.toISOString().split('T')[0];
      ingresosPorDia.set(clave, {
        fecha,
        ingresosEsperados: 0,
        ingresosReales: 0,
        facturasPendientes: [],
        cobrosConfirmados: []
      });
    }
    
    // Agregar facturas pendientes (ingresos esperados) por fecha de vencimiento
    facturasPendientes.forEach(factura => {
      const fechaVencimiento = new Date(factura.fechaVencimiento);
      fechaVencimiento.setHours(0, 0, 0, 0);
      const clave = fechaVencimiento.toISOString().split('T')[0];
      
      const ingresoDia = ingresosPorDia.get(clave);
      if (ingresoDia) {
        ingresoDia.ingresosEsperados += factura.montoPendiente;
        ingresoDia.facturasPendientes.push(factura);
      }
    });
    
    // Agregar cobros confirmados (ingresos reales) por fecha de cobro
    // También incluir facturas pagadas del mes como ingresos reales
    const facturasPagadasMes = todasLasFacturas.filter(f => {
      if (f.estado !== 'pagada') return false;
      // Buscar pagos en el mes actual
      const pagosEnMes = f.pagos.filter(p => {
        const fechaPago = new Date(p.fecha);
        return fechaPago >= inicioMes && fechaPago <= finMes;
      });
      return pagosEnMes.length > 0;
    });
    
    // Agregar pagos de facturas pagadas
    facturasPagadasMes.forEach(factura => {
      const pagosEnMes = factura.pagos.filter(p => {
        const fechaPago = new Date(p.fecha);
        return fechaPago >= inicioMes && fechaPago <= finMes;
      });
      
      pagosEnMes.forEach(pago => {
        const fechaPago = new Date(pago.fecha);
        fechaPago.setHours(0, 0, 0, 0);
        const clave = fechaPago.toISOString().split('T')[0];
        
        const ingresoDia = ingresosPorDia.get(clave);
        if (ingresoDia) {
          ingresoDia.ingresosReales += pago.monto;
        }
      });
    });
    
    // Agregar cobros confirmados
    const cobrosConfirmados = cobros.filter(c => c.estado === 'confirmado');
    cobrosConfirmados.forEach(cobro => {
      const fechaCobro = new Date(cobro.fechaCobro);
      fechaCobro.setHours(0, 0, 0, 0);
      const clave = fechaCobro.toISOString().split('T')[0];
      
      const ingresoDia = ingresosPorDia.get(clave);
      if (ingresoDia) {
        ingresoDia.ingresosReales += cobro.monto;
        ingresoDia.cobrosConfirmados.push(cobro);
      }
    });
    
    // Convertir mapa a array y ordenar por fecha
    return Array.from(ingresosPorDia.values()).sort((a, b) => 
      a.fecha.getTime() - b.fecha.getTime()
    );
  },

  // Calcular proyección de fin de mes
  async calcularProyeccionFinMes(ano: number, mes: number): Promise<ProyeccionFinMes> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const ahora = new Date();
    const inicioMes = new Date(ano, mes - 1, 1);
    const finMes = new Date(ano, mes, 0);
    const diaActual = ahora.getDate();
    
    // Obtener ingresos del mes hasta ahora
    const ingresosDias = await this.obtenerIngresosPorMes(ano, mes);
    
    // Calcular acumulados hasta hoy
    const ingresosHastaHoy = ingresosDias.filter(ingreso => 
      ingreso.fecha <= ahora
    );
    
    const ingresosEsperadosAcumulados = ingresosHastaHoy.reduce(
      (sum, ingreso) => sum + ingreso.ingresosEsperados, 
      0
    );
    
    const ingresosRealesAcumulados = ingresosHastaHoy.reduce(
      (sum, ingreso) => sum + ingreso.ingresosReales, 
      0
    );
    
    // Calcular ingresos esperados pendientes (facturas que aún no vencen)
    const ingresosEsperadosPendientes = ingresosDias
      .filter(ingreso => ingreso.fecha > ahora)
      .reduce((sum, ingreso) => sum + ingreso.ingresosEsperados, 0);
    
    // Calcular proyección basada en tendencia
    // Si hay días transcurridos, calcular promedio diario y proyectar
    let proyeccionFinMes = ingresosRealesAcumulados;
    
    if (diaActual > 0 && diaActual < finMes.getDate()) {
      const promedioDiario = ingresosRealesAcumulados / diaActual;
      const diasRestantes = finMes.getDate() - diaActual;
      proyeccionFinMes = ingresosRealesAcumulados + (promedioDiario * diasRestantes);
    }
    
    // También considerar los ingresos esperados pendientes
    proyeccionFinMes = Math.max(proyeccionFinMes, ingresosRealesAcumulados + ingresosEsperadosPendientes);
    
    // Calcular total esperado del mes
    const totalEsperadoMes = ingresosDias.reduce(
      (sum, ingreso) => sum + ingreso.ingresosEsperados, 
      0
    );
    
    const diferencia = ingresosRealesAcumulados - ingresosEsperadosAcumulados;
    const porcentajeCumplimiento = ingresosEsperadosAcumulados > 0
      ? (ingresosRealesAcumulados / ingresosEsperadosAcumulados) * 100
      : 0;
    
    return {
      ingresosEsperadosAcumulados,
      ingresosRealesAcumulados,
      ingresosEsperadosPendientes,
      proyeccionFinMes,
      diferencia,
      porcentajeCumplimiento
    };
  }
};

