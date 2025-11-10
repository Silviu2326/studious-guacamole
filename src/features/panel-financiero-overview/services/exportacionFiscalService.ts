// Servicio de exportación fiscal para asesores fiscales
// Categoriza ingresos y gastos según normativa española

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ingresosApi, gastosProfesionalesApi, alertasApi } from '../api';
import { transaccionesApi } from '../api/transacciones';

// Categorías fiscales españolas para autónomos (entrenadores personales)
export type CategoriaFiscalIngreso = 
  | 'servicios_profesionales' // Servicios profesionales (sesiones 1 a 1, consultas)
  | 'venta_productos' // Venta de productos (paquetes)
  | 'otras_actividades'; // Otras actividades

export type CategoriaFiscalGasto = 
  | 'adquisicion_inmovilizado' // Equipamiento
  | 'arrendamientos' // Alquileres
  | 'servicios_profesionales_independientes' // Formación, asesorías
  | 'trabajos_realizados_empresas' // Subcontrataciones
  | 'primas_seguros' // Seguros
  | 'servicios' // Software, marketing, transporte
  | 'suministros' // Suministros varios
  | 'otras_deducciones'; // Otras deducciones

export interface IngresoFiscal {
  fecha: Date;
  concepto: string;
  categoria: CategoriaFiscalIngreso;
  baseImponible: number;
  iva?: number; // Si aplica (generalmente 0% para servicios profesionales de entrenamiento)
  total: number;
  cliente?: string;
  numeroFactura?: string;
}

export interface GastoFiscal {
  fecha: Date;
  concepto: string;
  categoria: CategoriaFiscalGasto;
  baseImponible: number;
  iva?: number;
  total: number;
  proveedor?: string;
  numeroFactura?: string;
}

export interface ResumenFiscal {
  periodo: {
    inicio: Date;
    fin: Date;
  };
  ingresos: {
    total: number;
    porCategoria: Record<CategoriaFiscalIngreso, number>;
    detalles: IngresoFiscal[];
  };
  gastos: {
    total: number;
    porCategoria: Record<CategoriaFiscalGasto, number>;
    detalles: GastoFiscal[];
  };
  beneficio: number;
  informacionFiscal: {
    nombre: string;
    nif?: string;
    actividad: string;
    epigrafeIAE?: string; // Epígrafe IAE si aplica
  };
}

// Mapear categorías de servicio a categorías fiscales
const mapearCategoriaIngreso = (tipoServicio: string): CategoriaFiscalIngreso => {
  if (tipoServicio === 'sesion-1-1' || tipoServicio === 'videollamada' || tipoServicio === 'evaluacion') {
    return 'servicios_profesionales';
  }
  if (tipoServicio === 'paquete') {
    return 'venta_productos';
  }
  return 'otras_actividades';
};

// Mapear categorías de gasto a categorías fiscales
const mapearCategoriaGasto = (categoria: string): CategoriaFiscalGasto => {
  const mapeo: Record<string, CategoriaFiscalGasto> = {
    'equipamiento': 'adquisicion_inmovilizado',
    'formacion': 'servicios_profesionales_independientes',
    'marketing': 'servicios',
    'software': 'servicios',
    'transporte': 'servicios',
    'seguro': 'primas_seguros',
    'nutricion': 'suministros',
    'otros': 'otras_deducciones'
  };
  return mapeo[categoria] || 'otras_deducciones';
};

// Etiquetas en español para las categorías
export const etiquetasCategoriasIngreso: Record<CategoriaFiscalIngreso, string> = {
  'servicios_profesionales': 'Servicios Profesionales',
  'venta_productos': 'Venta de Productos',
  'otras_actividades': 'Otras Actividades'
};

export const etiquetasCategoriasGasto: Record<CategoriaFiscalGasto, string> = {
  'adquisicion_inmovilizado': 'Adquisición de Inmovilizado',
  'arrendamientos': 'Arrendamientos',
  'servicios_profesionales_independientes': 'Servicios Profesionales Independientes',
  'trabajos_realizados_empresas': 'Trabajos Realizados por Empresas',
  'primas_seguros': 'Primas de Seguros',
  'servicios': 'Servicios',
  'suministros': 'Suministros',
  'otras_deducciones': 'Otras Deducciones'
};

export class ExportacionFiscalService {
  // Obtener datos fiscales para un período
  static async obtenerDatosFiscales(
    fechaInicio: Date,
    fechaFin: Date,
    userId?: string,
    userRole: 'entrenador' | 'gimnasio' = 'entrenador',
    informacionFiscal?: {
      nombre: string;
      nif?: string;
      actividad?: string;
      epigrafeIAE?: string;
    }
  ): Promise<ResumenFiscal> {
    // Obtener ingresos (transacciones pagadas)
    const transaccionesPagadas = await transaccionesApi.obtenerTransaccionesPagadas(
      fechaInicio,
      fechaFin,
      userId
    );

    // Convertir transacciones a ingresos fiscales
    const ingresosFiscales: IngresoFiscal[] = transaccionesPagadas.map(trans => ({
      fecha: trans.fecha,
      concepto: trans.concepto,
      categoria: mapearCategoriaIngreso(trans.tipoServicio),
      baseImponible: trans.monto, // Para servicios profesionales de entrenamiento, generalmente exentos de IVA
      iva: 0, // Los servicios de entrenamiento personal suelen estar exentos de IVA o con IVA reducido
      total: trans.monto,
      cliente: trans.cliente,
      numeroFactura: trans.id // Usar ID de transacción como referencia
    }));

    // Calcular totales por categoría de ingreso
    const ingresosPorCategoria: Record<CategoriaFiscalIngreso, number> = {
      'servicios_profesionales': 0,
      'venta_productos': 0,
      'otras_actividades': 0
    };

    ingresosFiscales.forEach(ing => {
      ingresosPorCategoria[ing.categoria] += ing.total;
    });

    const totalIngresos = ingresosFiscales.reduce((sum, ing) => sum + ing.total, 0);

    // Obtener gastos (solo para entrenadores)
    let gastosFiscales: GastoFiscal[] = [];
    let gastosPorCategoria: Record<CategoriaFiscalGasto, number> = {
      'adquisicion_inmovilizado': 0,
      'arrendamientos': 0,
      'servicios_profesionales_independientes': 0,
      'trabajos_realizados_empresas': 0,
      'primas_seguros': 0,
      'servicios': 0,
      'suministros': 0,
      'otras_deducciones': 0
    };

    if (userRole === 'entrenador' && userId) {
      const gastos = await gastosProfesionalesApi.obtenerGastos(userId);
      
      // Filtrar gastos por período
      const gastosPeriodo = gastos.filter(g => {
        const fechaGasto = new Date(g.fecha);
        return fechaGasto >= fechaInicio && fechaGasto <= fechaFin;
      });

      // Convertir gastos a gastos fiscales
      gastosFiscales = gastosPeriodo.map(gasto => {
        const categoria = mapearCategoriaGasto(gasto.categoria);
        return {
          fecha: new Date(gasto.fecha),
          concepto: gasto.concepto,
          categoria,
          baseImponible: gasto.monto, // Asumimos que el monto ya incluye IVA si aplica
          iva: 0, // Se puede calcular si se tiene la información
          total: gasto.monto,
          proveedor: gasto.concepto,
          numeroFactura: gasto.factura
        };
      });

      // Calcular totales por categoría de gasto
      gastosFiscales.forEach(gasto => {
        gastosPorCategoria[gasto.categoria] += gasto.total;
      });
    }

    const totalGastos = gastosFiscales.reduce((sum, gasto) => sum + gasto.total, 0);
    const beneficio = totalIngresos - totalGastos;

    return {
      periodo: {
        inicio: fechaInicio,
        fin: fechaFin
      },
      ingresos: {
        total: totalIngresos,
        porCategoria: ingresosPorCategoria,
        detalles: ingresosFiscales.sort((a, b) => a.fecha.getTime() - b.fecha.getTime())
      },
      gastos: {
        total: totalGastos,
        porCategoria: gastosPorCategoria,
        detalles: gastosFiscales.sort((a, b) => a.fecha.getTime() - b.fecha.getTime())
      },
      beneficio,
      informacionFiscal: {
        nombre: informacionFiscal?.nombre || 'Entrenador Personal',
        nif: informacionFiscal?.nif || '',
        actividad: informacionFiscal?.actividad || 'Actividades de entrenamiento personal',
        epigrafeIAE: informacionFiscal?.epigrafeIAE || '932.1 - Actividades de gimnasios y centros de fitness'
      }
    };
  }

  // Exportar a Excel
  static async exportarAExcel(
    resumenFiscal: ResumenFiscal,
    nombreArchivo: string = 'resumen-fiscal'
  ): Promise<Blob> {
    const workbook = XLSX.utils.book_new();

    // Hoja 1: Resumen
    const resumenData = [
      ['RESUMEN FISCAL'],
      [''],
      ['Información Fiscal'],
      ['Nombre:', resumenFiscal.informacionFiscal.nombre],
      ['NIF:', resumenFiscal.informacionFiscal.nif || 'N/A'],
      ['Actividad:', resumenFiscal.informacionFiscal.actividad],
      ['Epígrafe IAE:', resumenFiscal.informacionFiscal.epigrafeIAE || 'N/A'],
      [''],
      ['Período'],
      ['Desde:', resumenFiscal.periodo.inicio.toLocaleDateString('es-ES')],
      ['Hasta:', resumenFiscal.periodo.fin.toLocaleDateString('es-ES')],
      [''],
      ['RESUMEN ECONÓMICO'],
      ['Ingresos Totales:', `€${resumenFiscal.ingresos.total.toFixed(2)}`],
      ['Gastos Totales:', `€${resumenFiscal.gastos.total.toFixed(2)}`],
      ['Beneficio Neto:', `€${resumenFiscal.beneficio.toFixed(2)}`],
      [''],
      ['INGRESOS POR CATEGORÍA'],
      ...Object.entries(resumenFiscal.ingresos.porCategoria).map(([cat, total]) => [
        etiquetasCategoriasIngreso[cat as CategoriaFiscalIngreso],
        `€${total.toFixed(2)}`
      ]),
      [''],
      ['GASTOS POR CATEGORÍA'],
      ...Object.entries(resumenFiscal.gastos.porCategoria)
        .filter(([_, total]) => total > 0)
        .map(([cat, total]) => [
          etiquetasCategoriasGasto[cat as CategoriaFiscalGasto],
          `€${total.toFixed(2)}`
        ])
    ];

    const resumenSheet = XLSX.utils.aoa_to_sheet(resumenData);
    XLSX.utils.book_append_sheet(workbook, resumenSheet, 'Resumen');

    // Hoja 2: Ingresos Detallados
    const ingresosData = [
      ['Fecha', 'Concepto', 'Categoría', 'Base Imponible', 'IVA', 'Total', 'Cliente', 'Nº Factura'],
      ...resumenFiscal.ingresos.detalles.map(ing => [
        ing.fecha.toLocaleDateString('es-ES'),
        ing.concepto,
        etiquetasCategoriasIngreso[ing.categoria],
        ing.baseImponible.toFixed(2),
        (ing.iva || 0).toFixed(2),
        ing.total.toFixed(2),
        ing.cliente || '',
        ing.numeroFactura || ''
      ])
    ];

    const ingresosSheet = XLSX.utils.aoa_to_sheet(ingresosData);
    XLSX.utils.book_append_sheet(workbook, ingresosSheet, 'Ingresos');

    // Hoja 3: Gastos Detallados
    const gastosData = [
      ['Fecha', 'Concepto', 'Categoría', 'Base Imponible', 'IVA', 'Total', 'Proveedor', 'Nº Factura'],
      ...resumenFiscal.gastos.detalles.map(gasto => [
        gasto.fecha.toLocaleDateString('es-ES'),
        gasto.concepto,
        etiquetasCategoriasGasto[gasto.categoria],
        gasto.baseImponible.toFixed(2),
        (gasto.iva || 0).toFixed(2),
        gasto.total.toFixed(2),
        gasto.proveedor || '',
        gasto.numeroFactura || ''
      ])
    ];

    const gastosSheet = XLSX.utils.aoa_to_sheet(gastosData);
    XLSX.utils.book_append_sheet(workbook, gastosSheet, 'Gastos');

    // Generar archivo Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  // Exportar a PDF
  static async exportarAPDF(
    resumenFiscal: ResumenFiscal,
    nombreArchivo: string = 'resumen-fiscal'
  ): Promise<Blob> {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.text('RESUMEN FISCAL', 14, 20);
    
    // Información Fiscal
    doc.setFontSize(12);
    let yPos = 35;
    doc.text('Información Fiscal', 14, yPos);
    yPos += 7;
    doc.setFontSize(10);
    doc.text(`Nombre: ${resumenFiscal.informacionFiscal.nombre}`, 14, yPos);
    yPos += 6;
    if (resumenFiscal.informacionFiscal.nif) {
      doc.text(`NIF: ${resumenFiscal.informacionFiscal.nif}`, 14, yPos);
      yPos += 6;
    }
    doc.text(`Actividad: ${resumenFiscal.informacionFiscal.actividad}`, 14, yPos);
    yPos += 6;
    if (resumenFiscal.informacionFiscal.epigrafeIAE) {
      doc.text(`Epígrafe IAE: ${resumenFiscal.informacionFiscal.epigrafeIAE}`, 14, yPos);
      yPos += 6;
    }
    yPos += 3;
    doc.text(`Período: ${resumenFiscal.periodo.inicio.toLocaleDateString('es-ES')} - ${resumenFiscal.periodo.fin.toLocaleDateString('es-ES')}`, 14, yPos);
    yPos += 10;

    // Resumen Económico
    doc.setFontSize(12);
    doc.text('Resumen Económico', 14, yPos);
    yPos += 7;
    doc.setFontSize(10);
    doc.text(`Ingresos Totales: €${resumenFiscal.ingresos.total.toFixed(2)}`, 14, yPos);
    yPos += 6;
    doc.text(`Gastos Totales: €${resumenFiscal.gastos.total.toFixed(2)}`, 14, yPos);
    yPos += 6;
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(`Beneficio Neto: €${resumenFiscal.beneficio.toFixed(2)}`, 14, yPos);
    doc.setFont(undefined, 'normal');
    yPos += 10;

    // Ingresos por Categoría
    doc.setFontSize(12);
    doc.text('Ingresos por Categoría', 14, yPos);
    yPos += 7;
    
    const ingresosTableData = Object.entries(resumenFiscal.ingresos.porCategoria)
      .map(([cat, total]) => [
        etiquetasCategoriasIngreso[cat as CategoriaFiscalIngreso],
        `€${total.toFixed(2)}`
      ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Categoría', 'Total']],
      body: ingresosTableData,
      theme: 'striped',
      headStyles: { fillColor: [66, 139, 202] },
      margin: { left: 14, right: 14 }
    });

    yPos = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 10 : yPos + 30;

    // Gastos por Categoría
    doc.setFontSize(12);
    doc.text('Gastos por Categoría', 14, yPos);
    yPos += 7;

    const gastosTableData = Object.entries(resumenFiscal.gastos.porCategoria)
      .filter(([_, total]) => total > 0)
      .map(([cat, total]) => [
        etiquetasCategoriasGasto[cat as CategoriaFiscalGasto],
        `€${total.toFixed(2)}`
      ]);

    if (gastosTableData.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [['Categoría', 'Total']],
        body: gastosTableData,
        theme: 'striped',
        headStyles: { fillColor: [220, 53, 69] },
        margin: { left: 14, right: 14 }
      });
    } else {
      doc.setFontSize(10);
      doc.text('No hay gastos registrados en este período', 14, yPos);
    }

    // Página 2: Ingresos Detallados
    doc.addPage();
    doc.setFontSize(12);
    doc.text('Ingresos Detallados', 14, 20);
    
    const ingresosDetalleData = resumenFiscal.ingresos.detalles.map(ing => [
      ing.fecha.toLocaleDateString('es-ES'),
      ing.concepto.substring(0, 30),
      etiquetasCategoriasIngreso[ing.categoria].substring(0, 25),
      `€${ing.total.toFixed(2)}`,
      ing.cliente?.substring(0, 20) || ''
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['Fecha', 'Concepto', 'Categoría', 'Total', 'Cliente']],
      body: ingresosDetalleData,
      theme: 'striped',
      headStyles: { fillColor: [66, 139, 202] },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 8 }
    });

    // Página 3: Gastos Detallados (si hay)
    if (resumenFiscal.gastos.detalles.length > 0) {
      doc.addPage();
      doc.setFontSize(12);
      doc.text('Gastos Detallados', 14, 20);
      
      const gastosDetalleData = resumenFiscal.gastos.detalles.map(gasto => [
        gasto.fecha.toLocaleDateString('es-ES'),
        gasto.concepto.substring(0, 30),
        etiquetasCategoriasGasto[gasto.categoria].substring(0, 25),
        `€${gasto.total.toFixed(2)}`,
        gasto.proveedor?.substring(0, 20) || ''
      ]);

      autoTable(doc, {
        startY: 30,
        head: [['Fecha', 'Concepto', 'Categoría', 'Total', 'Proveedor']],
        body: gastosDetalleData,
        theme: 'striped',
        headStyles: { fillColor: [220, 53, 69] },
        margin: { left: 14, right: 14 },
        styles: { fontSize: 8 }
      });
    }

    // Generar PDF
    return doc.output('blob');
  }

  // Descargar archivo
  static descargarArchivo(blob: Blob, nombreArchivo: string, extension: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${nombreArchivo}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

