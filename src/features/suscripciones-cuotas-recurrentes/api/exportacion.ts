import {
  ExportarDatosRequest,
  DatosExportacion,
  FormatoExportacion,
  ExportarSuscripcionesRequest,
  ExportarCuotasRequest,
  ExportarMetricasRequest,
  ExportacionResponse,
  Suscripcion,
  Cuota,
} from '../types';
import { getSuscripciones } from './suscripciones';
import { getCuotas } from './cuotas';

/**
 * Exporta datos de suscripciones y pagos en el formato especificado
 */
export const exportarDatos = async (
  request: ExportarDatosRequest
): Promise<DatosExportacion> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const entrenadorId = request.entrenadorId;
  
  // Obtener suscripciones
  let suscripciones = await getSuscripciones('entrenador', entrenadorId);
  
  // Filtrar por fecha si se especifica
  if (request.fechaInicio || request.fechaFin) {
    suscripciones = suscripciones.filter(s => {
      const fechaInicio = new Date(s.fechaInicio);
      if (request.fechaInicio && fechaInicio < new Date(request.fechaInicio)) {
        return false;
      }
      if (request.fechaFin && fechaInicio > new Date(request.fechaFin)) {
        return false;
      }
      return true;
    });
  }

  // Filtrar por estado
  if (!request.incluirCanceladas) {
    suscripciones = suscripciones.filter(s => s.estado !== 'cancelada');
  }
  if (!request.incluirPausadas) {
    suscripciones = suscripciones.filter(s => s.estado !== 'pausada');
  }

  // Obtener cuotas
  let cuotas = await getCuotas();
  
  // Filtrar cuotas por suscripciones seleccionadas
  const suscripcionIds = suscripciones.map(s => s.id);
  cuotas = cuotas.filter(c => suscripcionIds.includes(c.suscripcionId));

  // Preparar datos de exportación
  const datosExportacion: DatosExportacion = {
    metadata: {
      fechaExportacion: new Date().toISOString(),
      periodo: request.fechaInicio && request.fechaFin
        ? `${request.fechaInicio} a ${request.fechaFin}`
        : 'Todos los datos',
    },
  };

  // Agregar suscripciones si se solicita
  if (request.incluirSuscripciones) {
    datosExportacion.suscripciones = suscripciones.map(s => ({
      id: s.id,
      clienteId: s.clienteId,
      clienteNombre: s.clienteNombre,
      clienteEmail: s.clienteEmail,
      clienteTelefono: s.clienteTelefono,
      tipo: s.tipo,
      planNombre: s.planNombre,
      precio: s.precio,
      precioOriginal: s.precioOriginal,
      frecuenciaPago: s.frecuenciaPago,
      fechaInicio: s.fechaInicio,
      fechaVencimiento: s.fechaVencimiento,
      estado: s.estado,
      sesionesIncluidas: s.sesionesIncluidas,
      sesionesUsadas: s.sesionesUsadas,
      fechaCreacion: s.fechaCreacion,
      fechaCancelacion: s.fechaCancelacion,
      motivoCancelacion: s.motivoCancelacion,
    }));

    datosExportacion.metadata.totalSuscripciones = datosExportacion.suscripciones.length;
  }

  // Agregar pagos si se solicita
  if (request.incluirPagos) {
    // Obtener información de cliente para cada cuota
    datosExportacion.pagos = cuotas.map(c => {
      const suscripcion = suscripciones.find(s => s.id === c.suscripcionId);
      return {
        id: c.id,
        suscripcionId: c.suscripcionId,
        clienteId: suscripcion?.clienteId || '',
        clienteNombre: suscripcion?.clienteNombre || '',
        monto: c.monto,
        fechaVencimiento: c.fechaVencimiento,
        fechaPago: c.fechaPago,
        estado: c.estado,
        metodoPago: c.metodoPago,
        referencia: c.referencia,
      };
    });

    datosExportacion.metadata.totalPagos = datosExportacion.pagos.length;
    datosExportacion.metadata.ingresosTotales = datosExportacion.pagos
      .filter(p => p.estado === 'pagada')
      .reduce((sum, p) => sum + p.monto, 0);
  }

  return datosExportacion;
};

/**
 * Convierte los datos a CSV
 */
export const convertirACSV = (datos: DatosExportacion): string => {
  const lineas: string[] = [];
  
  if (datos.suscripciones && datos.suscripciones.length > 0) {
    lineas.push('=== SUSCRIPCIONES ===');
    lineas.push('ID,Cliente ID,Cliente Nombre,Cliente Email,Cliente Teléfono,Tipo,Plan,Precio,Precio Original,Frecuencia Pago,Fecha Inicio,Fecha Vencimiento,Estado,Sesiones Incluidas,Sesiones Usadas,Fecha Creación,Fecha Cancelación,Motivo Cancelación');
    
    datos.suscripciones.forEach(s => {
      lineas.push([
        s.id,
        s.clienteId,
        `"${s.clienteNombre}"`,
        s.clienteEmail,
        s.clienteTelefono || '',
        s.tipo,
        `"${s.planNombre}"`,
        s.precio,
        s.precioOriginal || '',
        s.frecuenciaPago,
        s.fechaInicio,
        s.fechaVencimiento,
        s.estado,
        s.sesionesIncluidas || '',
        s.sesionesUsadas || '',
        s.fechaCreacion,
        s.fechaCancelacion || '',
        s.motivoCancelacion ? `"${s.motivoCancelacion}"` : '',
      ].join(','));
    });
    
    lineas.push('');
  }

  if (datos.pagos && datos.pagos.length > 0) {
    lineas.push('=== PAGOS ===');
    lineas.push('ID,Suscripción ID,Cliente ID,Cliente Nombre,Monto,Fecha Vencimiento,Fecha Pago,Estado,Método Pago,Referencia');
    
    datos.pagos.forEach(p => {
      lineas.push([
        p.id,
        p.suscripcionId,
        p.clienteId,
        `"${p.clienteNombre}"`,
        p.monto,
        p.fechaVencimiento,
        p.fechaPago || '',
        p.estado,
        p.metodoPago || '',
        p.referencia || '',
      ].join(','));
    });
  }

  return lineas.join('\n');
};

/**
 * Descarga un archivo
 */
export const descargarArchivo = (contenido: string, nombreArchivo: string, tipoMime: string) => {
  const blob = new Blob([contenido], { type: tipoMime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exporta datos en el formato especificado y los descarga
 */
export const exportarYDescargar = async (request: ExportarDatosRequest) => {
  const datos = await exportarDatos(request);
  
  const fechaActual = new Date().toISOString().split('T')[0];
  let nombreArchivo = `exportacion_suscripciones_${fechaActual}`;
  let contenido = '';
  let tipoMime = '';

  switch (request.formato) {
    case 'csv':
      contenido = convertirACSV(datos);
      nombreArchivo += '.csv';
      tipoMime = 'text/csv;charset=utf-8;';
      break;
    
    case 'json':
      contenido = JSON.stringify(datos, null, 2);
      nombreArchivo += '.json';
      tipoMime = 'application/json';
      break;
    
    case 'excel':
      // Para Excel, generamos CSV (en producción se usaría una librería como xlsx)
      contenido = convertirACSV(datos);
      nombreArchivo += '.csv';
      tipoMime = 'text/csv;charset=utf-8;';
      break;
    
    case 'pdf':
      // Para PDF, generamos un texto formateado (en producción se usaría una librería como jsPDF)
      contenido = generarTextoPDF(datos);
      nombreArchivo += '.txt';
      tipoMime = 'text/plain';
      break;
  }

  descargarArchivo(contenido, nombreArchivo, tipoMime);
};

/**
 * Genera texto formateado para PDF (versión simplificada)
 */
function generarTextoPDF(datos: DatosExportacion): string {
  const lineas: string[] = [];
  
  lineas.push('REPORTE DE SUSCRIPCIONES Y PAGOS');
  lineas.push('==================================');
  lineas.push('');
  lineas.push(`Fecha de Exportación: ${datos.metadata.fechaExportacion}`);
  lineas.push(`Período: ${datos.metadata.periodo}`);
  lineas.push('');

  if (datos.suscripciones && datos.suscripciones.length > 0) {
    lineas.push('SUSCRIPCIONES');
    lineas.push('-------------');
    lineas.push(`Total: ${datos.metadata.totalSuscripciones}`);
    lineas.push('');
    
    datos.suscripciones.forEach(s => {
      lineas.push(`ID: ${s.id}`);
      lineas.push(`Cliente: ${s.clienteNombre} (${s.clienteEmail})`);
      lineas.push(`Plan: ${s.planNombre}`);
      lineas.push(`Precio: ${s.precio}€ (${s.frecuenciaPago})`);
      lineas.push(`Estado: ${s.estado}`);
      lineas.push(`Fecha Inicio: ${s.fechaInicio}`);
      lineas.push(`Fecha Vencimiento: ${s.fechaVencimiento}`);
      if (s.sesionesIncluidas) {
        lineas.push(`Sesiones: ${s.sesionesUsadas || 0}/${s.sesionesIncluidas}`);
      }
      if (s.fechaCancelacion) {
        lineas.push(`Cancelada: ${s.fechaCancelacion}`);
        if (s.motivoCancelacion) {
          lineas.push(`Motivo: ${s.motivoCancelacion}`);
        }
      }
      lineas.push('');
    });
  }

  if (datos.pagos && datos.pagos.length > 0) {
    lineas.push('PAGOS');
    lineas.push('-----');
    lineas.push(`Total: ${datos.metadata.totalPagos}`);
    lineas.push(`Ingresos Totales: ${datos.metadata.ingresosTotales?.toFixed(2)}€`);
    lineas.push('');
    
    datos.pagos.forEach(p => {
      lineas.push(`ID: ${p.id}`);
      lineas.push(`Cliente: ${p.clienteNombre}`);
      lineas.push(`Monto: ${p.monto}€`);
      lineas.push(`Estado: ${p.estado}`);
      lineas.push(`Fecha Vencimiento: ${p.fechaVencimiento}`);
      if (p.fechaPago) {
        lineas.push(`Fecha Pago: ${p.fechaPago}`);
      }
      if (p.metodoPago) {
        lineas.push(`Método: ${p.metodoPago}`);
      }
      lineas.push('');
    });
  }

  return lineas.join('\n');
}

/**
 * Exporta solo suscripciones en formato CSV o Excel
 */
export const exportarSuscripciones = async (
  request: ExportarSuscripcionesRequest
): Promise<ExportacionResponse> => {
  // Simular delay de procesamiento
  await new Promise(resolve => setTimeout(resolve, 800));

  // Obtener suscripciones con filtros
  let suscripciones = await getSuscripciones('entrenador', request.entrenadorId);
  
  // Filtrar por fecha si se especifica
  if (request.fechaInicio || request.fechaFin) {
    suscripciones = suscripciones.filter(s => {
      const fechaInicio = new Date(s.fechaInicio);
      if (request.fechaInicio && fechaInicio < new Date(request.fechaInicio)) {
        return false;
      }
      if (request.fechaFin && fechaInicio > new Date(request.fechaFin)) {
        return false;
      }
      return true;
    });
  }

  // Filtrar por plan si se especifica
  if (request.planId) {
    suscripciones = suscripciones.filter(s => s.planId === request.planId);
  }

  // Convertir a CSV
  const lineas: string[] = [];
  lineas.push('ID,Cliente ID,Cliente Nombre,Cliente Email,Cliente Teléfono,Tipo,Plan ID,Plan Nombre,Precio,Precio Original,Frecuencia Pago,Fecha Inicio,Fecha Vencimiento,Estado,Sesiones Incluidas,Sesiones Usadas,Sesiones Disponibles,Fecha Creación,Fecha Cancelación,Motivo Cancelación');
  
  suscripciones.forEach(s => {
    lineas.push([
      s.id,
      s.clienteId,
      `"${s.clienteNombre}"`,
      s.clienteEmail,
      s.clienteTelefono || '',
      s.tipo,
      s.planId,
      `"${s.planNombre}"`,
      s.precio,
      s.precioOriginal || '',
      s.frecuenciaPago,
      s.fechaInicio,
      s.fechaVencimiento,
      s.estado,
      s.sesionesIncluidas || '',
      s.sesionesUsadas || '',
      s.sesionesDisponibles || '',
      s.fechaCreacion,
      s.fechaCancelacion || '',
      s.motivoCancelacion ? `"${s.motivoCancelacion}"` : '',
    ].join(','));
  });

  const contenido = lineas.join('\n');
  const fechaActual = new Date().toISOString().split('T')[0];
  const extension = request.formato === 'excel' ? '.csv' : '.csv';
  const nombreArchivo = `suscripciones_${fechaActual}${extension}`;
  
  // Crear blob y URL
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  return {
    url,
    blob,
    nombreArchivo,
  };
};

/**
 * Exporta solo cuotas en formato CSV o Excel
 */
export const exportarCuotas = async (
  request: ExportarCuotasRequest
): Promise<ExportacionResponse> => {
  // Simular delay de procesamiento
  await new Promise(resolve => setTimeout(resolve, 800));

  // Obtener suscripciones para filtrar cuotas
  let suscripciones = await getSuscripciones('entrenador', request.entrenadorId);
  
  // Filtrar por plan si se especifica
  if (request.planId) {
    suscripciones = suscripciones.filter(s => s.planId === request.planId);
  }

  const suscripcionIds = suscripciones.map(s => s.id);

  // Obtener cuotas
  let cuotas = await getCuotas();
  cuotas = cuotas.filter(c => suscripcionIds.includes(c.suscripcionId));
  
  // Filtrar por fecha si se especifica
  if (request.fechaInicio || request.fechaFin) {
    cuotas = cuotas.filter(c => {
      const fechaVencimiento = new Date(c.fechaVencimiento);
      if (request.fechaInicio && fechaVencimiento < new Date(request.fechaInicio)) {
        return false;
      }
      if (request.fechaFin && fechaVencimiento > new Date(request.fechaFin)) {
        return false;
      }
      return true;
    });
  }

  // Convertir a CSV
  const lineas: string[] = [];
  lineas.push('ID,Suscripción ID,Cliente ID,Cliente Nombre,Importe,Fecha Vencimiento,Fecha Pago,Estado,Método Pago,Referencia,Notas');
  
  cuotas.forEach(c => {
    const suscripcion = suscripciones.find(s => s.id === c.suscripcionId);
    lineas.push([
      c.id,
      c.suscripcionId,
      c.clienteId,
      `"${suscripcion?.clienteNombre || ''}"`,
      c.importe || c.monto || 0,
      c.fechaVencimiento,
      c.fechaPagoOpcional || c.fechaPago || '',
      c.estado,
      c.metodoPago || '',
      c.referencia || '',
      c.notas ? `"${c.notas}"` : '',
    ].join(','));
  });

  const contenido = lineas.join('\n');
  const fechaActual = new Date().toISOString().split('T')[0];
  const extension = request.formato === 'excel' ? '.csv' : '.csv';
  const nombreArchivo = `cuotas_${fechaActual}${extension}`;
  
  // Crear blob y URL
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  return {
    url,
    blob,
    nombreArchivo,
  };
};

/**
 * Exporta métricas de suscripciones en formato CSV o Excel
 */
export const exportarMetricasSuscripciones = async (
  request: ExportarMetricasRequest
): Promise<ExportacionResponse> => {
  // Simular delay de procesamiento
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Obtener suscripciones
  let suscripciones = await getSuscripciones('entrenador', request.entrenadorId);
  
  // Filtrar por fecha si se especifica
  if (request.fechaInicio || request.fechaFin) {
    suscripciones = suscripciones.filter(s => {
      const fechaInicio = new Date(s.fechaInicio);
      if (request.fechaInicio && fechaInicio < new Date(request.fechaInicio)) {
        return false;
      }
      if (request.fechaFin && fechaInicio > new Date(request.fechaFin)) {
        return false;
      }
      return true;
    });
  }

  // Filtrar por plan si se especifica
  if (request.planId) {
    suscripciones = suscripciones.filter(s => s.planId === request.planId);
  }

  // Obtener cuotas para calcular métricas
  const todasCuotas = await getCuotas();
  const suscripcionIds = suscripciones.map(s => s.id);
  const cuotas = todasCuotas.filter(c => suscripcionIds.includes(c.suscripcionId));

  // Calcular métricas por suscripción
  const metricas = suscripciones.map(s => {
    const cuotasSuscripcion = cuotas.filter(c => c.suscripcionId === s.id);
    const cuotasPagadas = cuotasSuscripcion.filter(c => c.estado === 'pagada');
    const cuotasPendientes = cuotasSuscripcion.filter(c => c.estado === 'pendiente');
    const cuotasVencidas = cuotasSuscripcion.filter(c => c.estado === 'vencida');
    const cuotasFallidas = cuotasSuscripcion.filter(c => c.estado === 'fallida');
    
    const ingresosTotales = cuotasPagadas.reduce((sum, c) => sum + (c.importe || c.monto || 0), 0);
    const tasaUsoSesiones = s.sesionesIncluidas && s.sesionesIncluidas > 0
      ? ((s.sesionesUsadas || 0) / s.sesionesIncluidas) * 100
      : 0;
    
    const diasActiva = Math.floor(
      (new Date().getTime() - new Date(s.fechaInicio).getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      suscripcionId: s.id,
      clienteNombre: s.clienteNombre,
      clienteEmail: s.clienteEmail,
      planNombre: s.planNombre,
      estado: s.estado,
      precio: s.precio,
      frecuenciaPago: s.frecuenciaPago,
      fechaInicio: s.fechaInicio,
      fechaVencimiento: s.fechaVencimiento,
      diasActiva,
      sesionesIncluidas: s.sesionesIncluidas || 0,
      sesionesUsadas: s.sesionesUsadas || 0,
      tasaUsoSesiones: tasaUsoSesiones.toFixed(2),
      totalCuotas: cuotasSuscripcion.length,
      cuotasPagadas: cuotasPagadas.length,
      cuotasPendientes: cuotasPendientes.length,
      cuotasVencidas: cuotasVencidas.length,
      cuotasFallidas: cuotasFallidas.length,
      ingresosTotales: ingresosTotales.toFixed(2),
      tasaPagoPuntual: cuotasSuscripcion.length > 0
        ? ((cuotasPagadas.length / cuotasSuscripcion.length) * 100).toFixed(2)
        : '0.00',
    };
  });

  // Convertir a CSV
  const lineas: string[] = [];
  lineas.push('Suscripción ID,Cliente Nombre,Cliente Email,Plan,Estado,Precio,Frecuencia Pago,Fecha Inicio,Fecha Vencimiento,Días Activa,Sesiones Incluidas,Sesiones Usadas,Tasa Uso Sesiones (%),Total Cuotas,Cuotas Pagadas,Cuotas Pendientes,Cuotas Vencidas,Cuotas Fallidas,Ingresos Totales,Tasa Pago Puntual (%)');
  
  metricas.forEach(m => {
    lineas.push([
      m.suscripcionId,
      `"${m.clienteNombre}"`,
      m.clienteEmail,
      `"${m.planNombre}"`,
      m.estado,
      m.precio,
      m.frecuenciaPago,
      m.fechaInicio,
      m.fechaVencimiento,
      m.diasActiva,
      m.sesionesIncluidas,
      m.sesionesUsadas,
      m.tasaUsoSesiones,
      m.totalCuotas,
      m.cuotasPagadas,
      m.cuotasPendientes,
      m.cuotasVencidas,
      m.cuotasFallidas,
      m.ingresosTotales,
      m.tasaPagoPuntual,
    ].join(','));
  });

  const contenido = lineas.join('\n');
  const fechaActual = new Date().toISOString().split('T')[0];
  const extension = request.formato === 'excel' ? '.csv' : '.csv';
  const nombreArchivo = `metricas_suscripciones_${fechaActual}${extension}`;
  
  // Crear blob y URL
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  return {
    url,
    blob,
    nombreArchivo,
  };
};

