import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CheckInNutricional, getCheckInsNutricionales, getHistorialNutricional } from './checkins';
import { getAnalyticsNutricional, getAdherenciaNutricional, getTendenciasAdherencia } from './adherencia';
import { getRegistrosPeso, getTendenciaPeso, RegistroPeso } from './peso';

export interface DatosExportacion {
  clienteId: string;
  nombreCliente?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

/**
 * Exporta un reporte completo de check-ins nutricionales a Excel
 */
export async function exportarReporteExcel(datos: DatosExportacion): Promise<void> {
  try {
    // Obtener todos los datos necesarios
    const [
      checkIns,
      historial,
      analytics,
      adherencia,
      tendencias,
      registrosPeso,
      tendenciaPeso,
    ] = await Promise.all([
      getCheckInsNutricionales(datos.clienteId),
      getHistorialNutricional(datos.clienteId, 365),
      getAnalyticsNutricional(datos.clienteId),
      getAdherenciaNutricional(datos.clienteId, 'mes'),
      getTendenciasAdherencia(datos.clienteId, 30),
      getRegistrosPeso(datos.clienteId),
      getTendenciaPeso(datos.clienteId, 30),
    ]);

    const workbook = XLSX.utils.book_new();

    // Hoja 1: Resumen Ejecutivo
    const resumenData = [
      ['REPORTE NUTRICIONAL - RESUMEN EJECUTIVO'],
      [''],
      ['Cliente:', datos.nombreCliente || datos.clienteId],
      ['Fecha de Generación:', new Date().toLocaleDateString('es-ES')],
      [''],
      ['MÉTRICAS PRINCIPALES'],
      ['Total Check-ins:', analytics.totalCheckIns],
      ['Adherencia Promedio:', `${analytics.promedioAdherencia.toFixed(1)}%`],
      ['Fotos Evaluadas:', analytics.fotosEvaluadas],
      ['Cumplimiento Macros:', `${analytics.cumplimientoMacros.toFixed(1)}%`],
      [''],
      ['SEGUIMIENTO DE PESO'],
      ['Peso Actual:', `${tendenciaPeso.pesoActual.toFixed(1)} kg`],
      ['Peso Inicial:', `${tendenciaPeso.pesoInicial.toFixed(1)} kg`],
      ['Diferencia:', `${tendenciaPeso.diferencia > 0 ? '+' : ''}${tendenciaPeso.diferencia.toFixed(1)} kg`],
      ['Tendencia:', tendenciaPeso.tendencia],
      [''],
      ['ADHERENCIA NUTRICIONAL'],
      ['Porcentaje Adherencia:', `${adherencia?.porcentajeAdherencia.toFixed(1)}%`],
      ['Check-ins Completados:', `${adherencia?.checkInsCompletados}/${adherencia?.checkInsTotales}`],
      ['Cumplimiento Horarios:', `${adherencia?.cumplimientoHorarios.toFixed(1)}%`],
      ['Fotos Subidas:', adherencia?.fotosSubidas || 0],
    ];

    const resumenSheet = XLSX.utils.aoa_to_sheet(resumenData);
    XLSX.utils.book_append_sheet(workbook, resumenSheet, 'Resumen');

    // Hoja 2: Check-ins Detallados
    const checkInsData = [
      ['Fecha', 'Tipo Comida', 'Hambre Antes', 'Hambre Después', 'Saciedad', 'Peso (kg)', 'Cumplimiento Macros (%)', 'Observaciones', 'Feedback Entrenador'],
    ];

    checkIns.forEach((ci) => {
      checkInsData.push([
        ci.fecha,
        ci.tipoComida,
        ci.hambreAntes,
        ci.hambreDespues || '',
        ci.saciedad,
        ci.peso || '',
        ci.cumplimientoMacros || '',
        ci.observaciones || '',
        ci.feedbackEntrenador || '',
      ]);
    });

    const checkInsSheet = XLSX.utils.aoa_to_sheet(checkInsData);
    XLSX.utils.book_append_sheet(workbook, checkInsSheet, 'Check-ins');

    // Hoja 3: Historial Nutricional
    const historialData = [
      ['Fecha', 'Tipo Comida', 'Hambre Antes', 'Saciedad', 'Peso (kg)', 'Adherencia (%)', 'Tendencia'],
    ];

    historial.forEach((h) => {
      historialData.push([
        h.fecha,
        h.checkIn.tipoComida,
        h.checkIn.hambreAntes,
        h.checkIn.saciedad,
        h.checkIn.peso || '',
        h.adherencia.toFixed(1),
        h.tendencia || 'estable',
      ]);
    });

    const historialSheet = XLSX.utils.aoa_to_sheet(historialData);
    XLSX.utils.book_append_sheet(workbook, historialSheet, 'Historial');

    // Hoja 4: Seguimiento de Peso
    const pesoData = [
      ['Fecha', 'Peso (kg)', 'Observaciones'],
    ];

    registrosPeso.forEach((r) => {
      pesoData.push([
        r.fecha,
        r.peso,
        r.observaciones || '',
      ]);
    });

    const pesoSheet = XLSX.utils.aoa_to_sheet(pesoData);
    XLSX.utils.book_append_sheet(workbook, pesoSheet, 'Seguimiento Peso');

    // Hoja 5: Tendencias de Adherencia
    const tendenciasData = [
      ['Fecha', 'Adherencia (%)'],
    ];

    tendencias.forEach((t) => {
      tendenciasData.push([
        t.fecha,
        t.adherencia.toFixed(1),
      ]);
    });

    const tendenciasSheet = XLSX.utils.aoa_to_sheet(tendenciasData);
    XLSX.utils.book_append_sheet(workbook, tendenciasSheet, 'Tendencias');

    // Hoja 6: Macronutrientes
    if (adherencia?.macronutrientes && adherencia.macronutrientes.length > 0) {
      const macrosData = [
        ['Macronutriente', 'Consumo Real (g)', 'Objetivo Diario (g)', 'Cumplimiento (%)'],
      ];

      adherencia.macronutrientes.forEach((macro) => {
        macrosData.push([
          macro.nombre,
          macro.consumoReal,
          macro.objetivoDiario,
          macro.porcentajeCumplimiento.toFixed(1),
        ]);
      });

      const macrosSheet = XLSX.utils.aoa_to_sheet(macrosData);
      XLSX.utils.book_append_sheet(workbook, macrosSheet, 'Macronutrientes');
    }

    // Generar nombre de archivo
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `Reporte_Nutricional_${datos.nombreCliente || datos.clienteId}_${fecha}.xlsx`;

    // Escribir archivo
    XLSX.writeFile(workbook, nombreArchivo);
  } catch (error) {
    console.error('Error al exportar reporte a Excel:', error);
    throw error;
  }
}

/**
 * Exporta un reporte completo de check-ins nutricionales a PDF
 */
export async function exportarReportePDF(datos: DatosExportacion): Promise<void> {
  try {
    // Obtener todos los datos necesarios
    const [
      checkIns,
      historial,
      analytics,
      adherencia,
      tendencias,
      registrosPeso,
      tendenciaPeso,
    ] = await Promise.all([
      getCheckInsNutricionales(datos.clienteId),
      getHistorialNutricional(datos.clienteId, 365),
      getAnalyticsNutricional(datos.clienteId),
      getAdherenciaNutricional(datos.clienteId, 'mes'),
      getTendenciasAdherencia(datos.clienteId, 30),
      getRegistrosPeso(datos.clienteId),
      getTendenciaPeso(datos.clienteId, 30),
    ]);

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Función para agregar nueva página si es necesario
    const checkNewPage = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
        return true;
      }
      return false;
    };

    // Título
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE NUTRICIONAL', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Cliente: ${datos.nombreCliente || datos.clienteId}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Fecha de Generación: ${new Date().toLocaleDateString('es-ES')}`, 20, yPosition);
    yPosition += 15;

    // Resumen Ejecutivo
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('RESUMEN EJECUTIVO', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const resumenText = [
      `Total Check-ins: ${analytics.totalCheckIns}`,
      `Adherencia Promedio: ${analytics.promedioAdherencia.toFixed(1)}%`,
      `Fotos Evaluadas: ${analytics.fotosEvaluadas}`,
      `Cumplimiento Macros: ${analytics.cumplimientoMacros.toFixed(1)}%`,
      '',
      `Peso Actual: ${tendenciaPeso.pesoActual.toFixed(1)} kg`,
      `Peso Inicial: ${tendenciaPeso.pesoInicial.toFixed(1)} kg`,
      `Diferencia: ${tendenciaPeso.diferencia > 0 ? '+' : ''}${tendenciaPeso.diferencia.toFixed(1)} kg`,
      `Tendencia: ${tendenciaPeso.tendencia}`,
      '',
      `Adherencia Nutricional: ${adherencia?.porcentajeAdherencia.toFixed(1)}%`,
      `Check-ins Completados: ${adherencia?.checkInsCompletados}/${adherencia?.checkInsTotales}`,
      `Cumplimiento Horarios: ${adherencia?.cumplimientoHorarios.toFixed(1)}%`,
    ];

    resumenText.forEach((line) => {
      checkNewPage(7);
      if (line) {
        doc.text(line, 20, yPosition);
      }
      yPosition += 7;
    });

    yPosition += 5;

    // Tabla de Check-ins (últimos 20)
    checkNewPage(30);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('CHECK-INS RECIENTES', 20, yPosition);
    yPosition += 10;

    const checkInsTableData = checkIns.slice(0, 20).map((ci) => [
      ci.fecha,
      ci.tipoComida,
      ci.hambreAntes.toString(),
      ci.saciedad.toString(),
      ci.peso ? ci.peso.toFixed(1) : '-',
      ci.cumplimientoMacros ? ci.cumplimientoMacros.toFixed(0) + '%' : '-',
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Fecha', 'Comida', 'Hambre', 'Saciedad', 'Peso (kg)', 'Adherencia']],
      body: checkInsTableData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 20, right: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;

    // Tabla de Seguimiento de Peso
    checkNewPage(30);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SEGUIMIENTO DE PESO', 20, yPosition);
    yPosition += 10;

    const pesoTableData = registrosPeso.slice(0, 15).map((r) => [
      r.fecha,
      r.peso.toFixed(1),
      r.observaciones || '-',
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Fecha', 'Peso (kg)', 'Observaciones']],
      body: pesoTableData,
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] },
      margin: { left: 20, right: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;

    // Tendencias de Adherencia
    checkNewPage(30);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('TENDENCIAS DE ADHERENCIA (Últimos 30 días)', 20, yPosition);
    yPosition += 10;

    const tendenciasTableData = tendencias.slice(-15).map((t) => [
      t.fecha,
      t.adherencia.toFixed(1) + '%',
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Fecha', 'Adherencia']],
      body: tendenciasTableData,
      theme: 'striped',
      headStyles: { fillColor: [139, 92, 246] },
      margin: { left: 20, right: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;

    // Observaciones y Feedback
    if (checkIns.some((ci) => ci.observaciones || ci.feedbackEntrenador)) {
      checkNewPage(30);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('OBSERVACIONES Y FEEDBACK', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      checkIns
        .filter((ci) => ci.observaciones || ci.feedbackEntrenador)
        .slice(0, 10)
        .forEach((ci) => {
          checkNewPage(20);
          doc.setFont('helvetica', 'bold');
          doc.text(`${ci.fecha} - ${ci.tipoComida}`, 20, yPosition);
          yPosition += 5;
          doc.setFont('helvetica', 'normal');
          if (ci.observaciones) {
            doc.text(`Observación: ${ci.observaciones}`, 25, yPosition, { maxWidth: pageWidth - 45 });
            yPosition += doc.getTextDimensions(ci.observaciones, { maxWidth: pageWidth - 45 }).h + 3;
          }
          if (ci.feedbackEntrenador) {
            doc.text(`Feedback: ${ci.feedbackEntrenador}`, 25, yPosition, { maxWidth: pageWidth - 45 });
            yPosition += doc.getTextDimensions(ci.feedbackEntrenador, { maxWidth: pageWidth - 45 }).h + 3;
          }
          yPosition += 5;
        });
    }

    // Generar nombre de archivo
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `Reporte_Nutricional_${datos.nombreCliente || datos.clienteId}_${fecha}.pdf`;

    // Guardar PDF
    doc.save(nombreArchivo);
  } catch (error) {
    console.error('Error al exportar reporte a PDF:', error);
    throw error;
  }
}

