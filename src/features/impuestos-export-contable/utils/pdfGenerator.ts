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

