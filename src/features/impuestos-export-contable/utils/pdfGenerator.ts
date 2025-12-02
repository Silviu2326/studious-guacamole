// Utilidades para generar PDF fiscal

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FiscalProfile, TaxSummary, TaxCalculation } from '../api/types';
import { GastoDeducible } from '../types/expenses';
import { CATEGORIAS_GASTO } from '../types/expenses';

interface PDFReportData {
  fiscalProfile: FiscalProfile;
  taxSummary: TaxSummary;
  taxCalculation?: TaxCalculation;
  expenses: GastoDeducible[];
  dateRange: {
    from: Date;
    to: Date;
  };
  monthlyBreakdown?: Array<{
    month: string;
    income: number;
    expenses: number;
    balance: number;
  }>;
}

/**
 * Genera un informe PDF fiscal completo
 */
export async function generateTaxPDFReport(data: PDFReportData): Promise<Blob> {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // Colores
  const primaryColor = [41, 128, 185]; // Azul
  const secondaryColor = [52, 73, 94]; // Gris oscuro
  const successColor = [39, 174, 96]; // Verde
  const dangerColor = [231, 76, 60]; // Rojo
  const warningColor = [241, 196, 15]; // Amarillo

  // Función helper para agregar página nueva
  const addNewPage = () => {
    doc.addPage();
    yPosition = margin;
    addHeader();
  };

  // Agregar header en cada página
  const addHeader = () => {
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Informe Fiscal', margin, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Período: ${data.dateRange.from.toLocaleDateString('es-ES')} - ${data.dateRange.to.toLocaleDateString('es-ES')}`,
      pageWidth - margin,
      20,
      { align: 'right' }
    );
    
    yPosition = 40;
    doc.setTextColor(0, 0, 0);
  };

  // Agregar header inicial
  addHeader();

  // ========== RESUMEN EJECUTIVO ==========
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumen Ejecutivo', margin, yPosition);
  yPosition += 10;

  // Información fiscal
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Razón Social: ${data.fiscalProfile.legalName}`, margin, yPosition);
  yPosition += 6;
  doc.text(`NIF/CIF: ${data.fiscalProfile.taxId}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Dirección: ${data.fiscalProfile.address}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Régimen Fiscal: ${data.fiscalProfile.taxRegime}`, margin, yPosition);
  yPosition += 10;

  // KPIs principales
  const kpiData = [
    ['Ingresos Brutos', formatCurrency(data.taxSummary.totalGross), successColor],
    ['Gastos Deducibles', formatCurrency(data.taxSummary.totalExpenses), dangerColor],
    ['Beneficio Neto', formatCurrency(data.taxSummary.netProfit), primaryColor],
    ['IVA Total', formatCurrency(data.taxSummary.totalVat), warningColor],
  ];

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Indicadores Principales', margin, yPosition);
  yPosition += 8;

  kpiData.forEach(([label, value, color]) => {
    doc.setFillColor(...color);
    doc.rect(margin, yPosition - 4, pageWidth - 2 * margin, 8, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin + 2, yPosition + 2);
    
    doc.text(value, pageWidth - margin - 2, yPosition + 2, { align: 'right' });
    yPosition += 10;
  });

  doc.setTextColor(0, 0, 0);
  yPosition += 5;

  // Verificar si necesitamos nueva página
  if (yPosition > pageHeight - 60) {
    addNewPage();
  }

  // ========== CÁLCULOS FISCALES ==========
  if (data.taxCalculation) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Cálculos Fiscales', margin, yPosition);
    yPosition += 10;

    const taxData = [
      ['Base Imponible', formatCurrency(data.taxCalculation.taxableBase)],
      ['IVA Repercutido', formatCurrency(data.taxCalculation.vatCollected)],
      ['IVA Deducible', formatCurrency(data.taxCalculation.vatDeductible)],
      ['IVA Neto a Pagar', formatCurrency(data.taxCalculation.vatNet)],
      ['IRPF Estimado', formatCurrency(data.taxCalculation.irpfAmount)],
      ['Total Impuestos', formatCurrency(data.taxCalculation.totalTaxes)],
      ['Ingresos Netos', formatCurrency(data.taxCalculation.netIncome)],
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [['Concepto', 'Importe']],
      body: taxData,
      theme: 'striped',
      headStyles: { fillColor: primaryColor, textColor: 255 },
      margin: { left: margin, right: margin },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // Verificar si necesitamos nueva página
  if (yPosition > pageHeight - 60) {
    addNewPage();
  }

  // ========== INGRESOS DETALLADOS ==========
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Ingresos Detallados', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total de Ingresos: ${formatCurrency(data.taxSummary.totalGross)}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Número de Transacciones: ${data.taxSummary.transactionCount}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Promedio por Transacción: ${formatCurrency(data.taxSummary.totalGross / data.taxSummary.transactionCount)}`, margin, yPosition);
  yPosition += 10;

  // Desglose mensual si está disponible
  if (data.monthlyBreakdown && data.monthlyBreakdown.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Desglose Mensual', margin, yPosition);
    yPosition += 8;

    const monthlyData = data.monthlyBreakdown.map(month => [
      month.month,
      formatCurrency(month.income),
      formatCurrency(month.expenses),
      formatCurrency(month.balance),
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Mes', 'Ingresos', 'Gastos', 'Balance']],
      body: monthlyData,
      theme: 'striped',
      headStyles: { fillColor: successColor, textColor: 255 },
      margin: { left: margin, right: margin },
      columnStyles: {
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right' },
      },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // Verificar si necesitamos nueva página
  if (yPosition > pageHeight - 60) {
    addNewPage();
  }

  // ========== GASTOS DEDUCIBLES ==========
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Gastos Deducibles', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total de Gastos: ${formatCurrency(data.taxSummary.totalExpenses)}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Número de Gastos: ${data.expenses.length}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Promedio por Gasto: ${formatCurrency(data.expenses.length > 0 ? data.taxSummary.totalExpenses / data.expenses.length : 0)}`, margin, yPosition);
  yPosition += 10;

  // Agrupar gastos por categoría
  const expensesByCategory = new Map<string, { total: number; count: number; expenses: GastoDeducible[] }>();
  data.expenses.forEach(expense => {
    const category = expense.categoria;
    const existing = expensesByCategory.get(category) || { total: 0, count: 0, expenses: [] };
    existing.total += expense.importe;
    existing.count += 1;
    existing.expenses.push(expense);
    expensesByCategory.set(category, existing);
  });

  // Tabla de gastos por categoría
  const categoryData = Array.from(expensesByCategory.entries())
    .sort((a, b) => b[1].total - a[1].total)
    .map(([category, data]) => [
      CATEGORIAS_GASTO[category as keyof typeof CATEGORIAS_GASTO]?.nombre || category,
      data.count.toString(),
      formatCurrency(data.total),
      formatCurrency(data.total / data.count),
    ]);

  autoTable(doc, {
    startY: yPosition,
    head: [['Categoría', 'Cantidad', 'Total', 'Promedio']],
    body: categoryData,
    theme: 'striped',
    headStyles: { fillColor: dangerColor, textColor: 255 },
    margin: { left: margin, right: margin },
    columnStyles: {
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right' },
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Verificar si necesitamos nueva página
  if (yPosition > pageHeight - 100) {
    addNewPage();
  }

  // Lista detallada de gastos (primeros 30)
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Detalle de Gastos', margin, yPosition);
  yPosition += 8;

  const expensesData = data.expenses
    .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
    .slice(0, 30)
    .map(expense => [
      expense.fecha.toLocaleDateString('es-ES'),
      expense.concepto.substring(0, 40),
      CATEGORIAS_GASTO[expense.categoria]?.nombre || expense.categoria,
      formatCurrency(expense.importe),
      expense.deducible ? 'Sí' : 'No',
    ]);

  autoTable(doc, {
    startY: yPosition,
    head: [['Fecha', 'Concepto', 'Categoría', 'Importe', 'Deducible']],
    body: expensesData,
    theme: 'striped',
    headStyles: { fillColor: secondaryColor, textColor: 255 },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 60 },
      2: { cellWidth: 40 },
      3: { halign: 'right', cellWidth: 25 },
      4: { halign: 'center', cellWidth: 20 },
    },
    styles: { fontSize: 8 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  if (data.expenses.length > 30) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text(
      `* Mostrando 30 de ${data.expenses.length} gastos. Consulta el sistema para ver el listado completo.`,
      margin,
      yPosition
    );
    yPosition += 6;
    doc.setTextColor(0, 0, 0);
  }

  // Verificar si necesitamos nueva página
  if (yPosition > pageHeight - 40) {
    addNewPage();
  }

  // ========== GRÁFICOS EXPLICATIVOS ==========
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Análisis Visual', margin, yPosition);
  yPosition += 10;

  // Gráfico de barras simple (ingresos vs gastos)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Ingresos vs Gastos', margin, yPosition);
  yPosition += 8;

  const maxValue = Math.max(data.taxSummary.totalGross, data.taxSummary.totalExpenses);
  const barWidth = (pageWidth - 2 * margin) / 2 - 10;
  const barHeight = 40;
  const scale = barHeight / maxValue;

  // Barra de ingresos
  const incomeBarHeight = data.taxSummary.totalGross * scale;
  doc.setFillColor(...successColor);
  doc.rect(margin, yPosition, barWidth, incomeBarHeight, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Ingresos', margin + barWidth / 2, yPosition + incomeBarHeight / 2, { align: 'center' });
  doc.text(formatCurrency(data.taxSummary.totalGross), margin + barWidth / 2, yPosition + incomeBarHeight + 5, { align: 'center' });

  // Barra de gastos
  const expenseBarHeight = data.taxSummary.totalExpenses * scale;
  doc.setFillColor(...dangerColor);
  doc.rect(margin + barWidth + 20, yPosition, barWidth, expenseBarHeight, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Gastos', margin + barWidth + 20 + barWidth / 2, yPosition + expenseBarHeight / 2, { align: 'center' });
  doc.text(formatCurrency(data.taxSummary.totalExpenses), margin + barWidth + 20 + barWidth / 2, yPosition + expenseBarHeight + 5, { align: 'center' });

  doc.setTextColor(0, 0, 0);
  yPosition += barHeight + 20;

  // Verificar si necesitamos nueva página
  if (yPosition > pageHeight - 60) {
    addNewPage();
  }

  // Gráfico de pastel de gastos por categoría (simplificado)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Distribución de Gastos por Categoría', margin, yPosition);
  yPosition += 8;

  // Mostrar top 5 categorías
  const topCategories = Array.from(expensesByCategory.entries())
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5);

  topCategories.forEach(([category, data], index) => {
    const percentage = (data.total / data.taxSummary.totalExpenses) * 100;
    doc.setFontSize(9);
    doc.text(
      `${index + 1}. ${CATEGORIAS_GASTO[category as keyof typeof CATEGORIAS_GASTO]?.nombre || category}: ${formatCurrency(data.total)} (${percentage.toFixed(1)}%)`,
      margin,
      yPosition
    );
    yPosition += 5;
  });

  yPosition += 10;

  // Verificar si necesitamos nueva página
  if (yPosition > pageHeight - 40) {
    addNewPage();
  }

  // ========== NOTAS Y OBSERVACIONES ==========
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Notas y Observaciones', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  
  const notes = [
    'Este informe ha sido generado automáticamente y contiene información fiscal para el período indicado.',
    'Los cálculos de impuestos son estimaciones basadas en la configuración fiscal del perfil.',
    'Se recomienda revisar todos los datos con un gestor fiscal antes de presentar declaraciones.',
    'Los gastos deben contar con comprobantes y justificantes para ser deducibles.',
    `Fecha de generación: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}`,
  ];

  notes.forEach(note => {
    doc.text(`• ${note}`, margin, yPosition, { maxWidth: pageWidth - 2 * margin });
    yPosition += 6;
  });

  // Footer en cada página
  const addFooter = () => {
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Página ${i} de ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
      doc.text(
        `Generado por ${data.fiscalProfile.legalName}`,
        margin,
        pageHeight - 10
      );
    }
  };

  addFooter();

  // Generar blob
  const pdfBlob = doc.output('blob');
  return pdfBlob;
}

/**
 * Formatea un número como moneda
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * ============================================================================
 * FUNCIÓN UTILITARIA PARA GENERACIÓN DE PDF DE REPORTE FISCAL
 * ============================================================================
 * 
 * NOTA IMPORTANTE: En producción, esta función se ejecutaría en el backend
 * y devolvería una URL real o un stream del archivo generado.
 * 
 * La generación de archivos PDF grandes o con muchos datos debe hacerse
 * en el servidor para:
 * - Evitar sobrecargar el navegador del cliente
 * - Procesar grandes volúmenes de datos eficientemente
 * - Aplicar validaciones y transformaciones complejas
 * - Gestionar la memoria de forma adecuada
 * - Proporcionar URLs seguras con tokens de autenticación
 * - Generar PDFs con mejor calidad y rendimiento
 * ============================================================================
 */

/**
 * Opciones para la generación de PDF fiscal
 */
export interface PDFReporteFiscalOpciones {
  nombreArchivo?: string;
  incluirIngresos?: boolean;
  incluirGastos?: boolean;
  incluirCalculosFiscales?: boolean;
  incluirGraficos?: boolean;
  incluirDesgloseMensual?: boolean;
  formatoFecha?: string;
  formatoMoneda?: string;
  idioma?: 'es' | 'en' | 'ca' | 'eu' | 'gl';
  plantilla?: 'simple' | 'detallado' | 'completo';
}

/**
 * Genera un PDF de reporte fiscal desde datos proporcionados
 * 
 * @param datos - Datos a exportar (puede ser cualquier estructura de datos)
 * @param opciones - Opciones de configuración para la exportación
 * @returns Blob del archivo PDF o string con URL de descarga (en producción)
 * 
 * NOTA: En producción, esta función:
 * - Se ejecutaría en el backend (Node.js con bibliotecas como pdfkit, puppeteer, etc.)
 * - Procesaría los datos reales de ingresos y gastos desde la base de datos
 * - Generaría el PDF con formato profesional según las opciones
 * - Aplicaría estilos, gráficos y tablas según sea necesario
 * - Almacenaría el archivo en un sistema de almacenamiento (S3, Azure Blob, etc.)
 * - Devolvería una URL real de descarga con token de autenticación temporal
 * - O devolvería un stream del archivo para descarga directa
 * 
 * Ejemplo de uso (mock):
 * ```typescript
 * const datos = {
 *   fiscalProfile: {...},
 *   taxSummary: {...},
 *   expenses: [...],
 *   dateRange: { from: ..., to: ... }
 * };
 * const url = await generarPDFReporteFiscal(datos, {
 *   nombreArchivo: 'reporte-fiscal-2024.pdf',
 *   plantilla: 'completo',
 *   incluirGraficos: true
 * });
 * // En producción: url sería una URL real como '/api/exports/abc123/download?token=xyz'
 * ```
 * 
 * Ejemplo de uso en backend (producción):
 * ```typescript
 * // En el backend (Node.js)
 * async function generarPDFReporteFiscal(datos, opciones) {
 *   const doc = new PDFDocument();
 *   // ... generar contenido del PDF ...
 *   const buffer = await doc.end();
 *   const url = await storageService.upload(buffer, `exports/${opciones.nombreArchivo}`);
 *   return url; // URL real de descarga
 * }
 * ```
 */
export async function generarPDFReporteFiscal(
  datos: any,
  opciones?: PDFReporteFiscalOpciones
): Promise<Blob | string> {
  // Simular delay de procesamiento (en producción sería el tiempo real de generación)
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // En producción, aquí se generaría el PDF real usando bibliotecas como:
  // - PDFKit (Node.js)
  // - Puppeteer (Node.js) para renderizar HTML a PDF
  // - jsPDF (si se ejecuta en servidor)
  // - Otras bibliotecas de generación de PDF
  
  // Por ahora, simulamos generando un PDF básico usando la función existente
  // si los datos tienen la estructura esperada
  if (datos.fiscalProfile && datos.taxSummary && datos.expenses && datos.dateRange) {
    try {
      // Usar la función existente generateTaxPDFReport si los datos coinciden
      const pdfBlob = await generateTaxPDFReport(datos as PDFReportData);
      
      // En producción, aquí subiríamos el blob al almacenamiento y devolveríamos la URL
      // Por ahora, devolvemos una URL simulada
      const nombreArchivo = opciones?.nombreArchivo || 
        `reporte-fiscal-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // En producción, devolveríamos una URL real:
      // return `/api/v1/finance/exports/${exportId}/download?token=${token}`;
      
      // Por ahora, devolvemos una URL simulada
      return `/api/v1/finance/exports/download/${nombreArchivo}?token=mock-token-${Date.now()}`;
    } catch (error) {
      console.warn('Error al generar PDF con función existente, usando mock:', error);
    }
  }
  
  // Si no coincide la estructura, generar un PDF básico mock
  // En producción, esto se haría con una biblioteca de PDF real
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // Agregar contenido básico
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Reporte Fiscal', 20, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha de generación: ${new Date().toLocaleString('es-ES')}`, 20, 30);
  
  if (opciones?.nombreArchivo) {
    doc.text(`Archivo: ${opciones.nombreArchivo}`, 20, 40);
  }
  
  // Agregar datos básicos si están disponibles
  let yPosition = 50;
  if (typeof datos === 'object' && !Array.isArray(datos)) {
    Object.entries(datos).slice(0, 20).forEach(([key, value]) => {
      if (value !== null && value !== undefined && yPosition < 280) {
        doc.text(`${key}: ${String(value).substring(0, 80)}`, 20, yPosition);
        yPosition += 7;
      }
    });
  }
  
  // Generar blob
  const pdfBlob = doc.output('blob');
  
  // En producción, aquí subiríamos el blob al almacenamiento y devolveríamos la URL
  // Por ahora, devolvemos el blob directamente o una URL simulada según el contexto
  if (opciones?.nombreArchivo) {
    // Simular URL de descarga (en producción sería real)
    return `/api/v1/finance/exports/download/${opciones.nombreArchivo}?token=mock-token-${Date.now()}`;
  }
  
  return pdfBlob;
}

