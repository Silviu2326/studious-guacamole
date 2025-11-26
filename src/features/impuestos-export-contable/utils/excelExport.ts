import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { TaxSummary } from '../api/types';
import { GastoDeducible } from '../types/expenses';
import { expensesAPI } from '../api/expenses';

export interface ExcelExportData {
  taxSummary: TaxSummary;
  expenses: GastoDeducible[];
  dateFrom: Date;
  dateTo: Date;
  fiscalProfile?: {
    legalName: string;
    taxId: string;
    address: string;
  };
}

/**
 * Genera un archivo Excel con múltiples hojas:
 * 1. Ingresos
 * 2. Gastos
 * 3. Resumen Fiscal
 * 4. Desglose Mensual/Trimestral
 */
export async function generateExcelExport(data: ExcelExportData): Promise<void> {
  const workbook = XLSX.utils.book_new();

  // Hoja 1: Ingresos
  const ingresosSheet = createIngresosSheet(data);
  XLSX.utils.book_append_sheet(workbook, ingresosSheet, 'Ingresos');

  // Hoja 2: Gastos
  const gastosSheet = createGastosSheet(data);
  XLSX.utils.book_append_sheet(workbook, gastosSheet, 'Gastos');

  // Hoja 3: Resumen Fiscal
  const resumenSheet = createResumenFiscalSheet(data);
  XLSX.utils.book_append_sheet(workbook, resumenSheet, 'Resumen Fiscal');

  // Hoja 4: Desglose Mensual/Trimestral
  const desgloseSheet = createDesgloseMensualTrimestralSheet(data);
  XLSX.utils.book_append_sheet(workbook, desgloseSheet, 'Desglose Mensual');

  // Generar el archivo Excel
  const excelBuffer = XLSX.write(workbook, { 
    bookType: 'xlsx', 
    type: 'array',
    cellStyles: true
  });
  
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  const fileName = `export-fiscal-${data.dateFrom.toISOString().split('T')[0]}-${data.dateTo.toISOString().split('T')[0]}.xlsx`;
  saveAs(blob, fileName);
}

/**
 * Crea la hoja de Ingresos
 */
function createIngresosSheet(data: ExcelExportData): XLSX.WorkSheet {
  const rows: any[] = [];
  
  // Encabezado
  if (data.fiscalProfile) {
    rows.push(['Datos Fiscales']);
    rows.push(['Nombre/Razón Social:', data.fiscalProfile.legalName]);
    rows.push(['NIF/CIF:', data.fiscalProfile.taxId]);
    rows.push(['Dirección:', data.fiscalProfile.address]);
    rows.push([]);
  }
  
  rows.push(['Período:', `${data.dateFrom.toLocaleDateString('es-ES')} - ${data.dateTo.toLocaleDateString('es-ES')}`]);
  rows.push([]);
  
  // Título
  rows.push(['RESUMEN DE INGRESOS']);
  rows.push([]);
  
  // Datos de ingresos
  rows.push(['Concepto', 'Importe (EUR)', 'IVA (EUR)', 'Neto (EUR)']);
  rows.push([
    'Ingresos Brutos',
    data.taxSummary.totalGross,
    data.taxSummary.totalVat,
    data.taxSummary.totalNet
  ]);
  
  // En una implementación real, aquí irían las transacciones individuales de ingresos
  rows.push([]);
  rows.push(['Nota: Los ingresos detallados se obtendrían de la API de transacciones']);
  rows.push(['Número de transacciones:', data.taxSummary.transactionCount]);
  
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  
  // Ajustar ancho de columnas
  worksheet['!cols'] = [
    { wch: 30 }, // Concepto
    { wch: 15 }, // Importe
    { wch: 15 }, // IVA
    { wch: 15 }  // Neto
  ];
  
  return worksheet;
}

/**
 * Crea la hoja de Gastos
 */
function createGastosSheet(data: ExcelExportData): XLSX.WorkSheet {
  const rows: any[] = [];
  
  // Encabezado
  rows.push(['GASTOS DEDUCIBLES']);
  rows.push(['Período:', `${data.dateFrom.toLocaleDateString('es-ES')} - ${data.dateTo.toLocaleDateString('es-ES')}`]);
  rows.push([]);
  
  // Encabezados de tabla
  rows.push(['Fecha', 'Concepto', 'Categoría', 'Importe (EUR)', 'Notas']);
  
  // Filas de gastos
  data.expenses.forEach(gasto => {
    rows.push([
      gasto.fecha.toLocaleDateString('es-ES'),
      gasto.concepto,
      gasto.categoria,
      gasto.importe,
      gasto.notas || ''
    ]);
  });
  
  // Total
  rows.push([]);
  rows.push(['TOTAL GASTOS', '', '', data.taxSummary.totalExpenses, '']);
  
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  
  // Ajustar ancho de columnas
  worksheet['!cols'] = [
    { wch: 12 }, // Fecha
    { wch: 40 }, // Concepto
    { wch: 20 }, // Categoría
    { wch: 15 }, // Importe
    { wch: 30 }  // Notas
  ];
  
  return worksheet;
}

/**
 * Crea la hoja de Resumen Fiscal
 */
function createResumenFiscalSheet(data: ExcelExportData): XLSX.WorkSheet {
  const rows: any[] = [];
  
  // Encabezado
  rows.push(['RESUMEN FISCAL']);
  rows.push(['Período:', `${data.dateFrom.toLocaleDateString('es-ES')} - ${data.dateTo.toLocaleDateString('es-ES')}`]);
  rows.push([]);
  
  // Resumen
  rows.push(['Concepto', 'Importe (EUR)']);
  rows.push(['Ingresos Brutos', data.taxSummary.totalGross]);
  rows.push(['Ingresos Netos', data.taxSummary.totalNet]);
  rows.push(['IVA Repercutido', data.taxSummary.totalVat]);
  rows.push([]);
  rows.push(['Gastos Deducibles', data.taxSummary.totalExpenses]);
  rows.push([]);
  rows.push(['BENEFICIO NETO', data.taxSummary.netProfit]);
  rows.push([]);
  rows.push(['Número de Transacciones', data.taxSummary.transactionCount]);
  rows.push(['Moneda', data.taxSummary.currency]);
  
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  
  // Ajustar ancho de columnas
  worksheet['!cols'] = [
    { wch: 25 }, // Concepto
    { wch: 20 }  // Importe
  ];
  
  // Estilizar la fila de beneficio neto
  const profitRow = rows.findIndex(row => row[0] === 'BENEFICIO NETO');
  if (profitRow >= 0) {
    // Nota: XLSX no soporta estilos directamente, pero podemos hacer que la celda sea más visible
    // mediante formato de número o añadiendo una fila de resumen después
  }
  
  return worksheet;
}

/**
 * Crea la hoja de Desglose Mensual/Trimestral
 */
function createDesgloseMensualTrimestralSheet(data: ExcelExportData): XLSX.WorkSheet {
  const rows: any[] = [];
  
  // Encabezado
  rows.push(['DESGLOSE MENSUAL Y TRIMESTRAL']);
  rows.push(['Período:', `${data.dateFrom.toLocaleDateString('es-ES')} - ${data.dateTo.toLocaleDateString('es-ES')}`]);
  rows.push([]);
  
  // Agrupar gastos por mes
  const gastosPorMes = new Map<string, { gastos: GastoDeducible[]; total: number }>();
  
  data.expenses.forEach(gasto => {
    const month = gasto.fecha.getMonth() + 1;
    const mesKey = `${gasto.fecha.getFullYear()}-${month.toString().padStart(2, '0')}`;
    const mesData = gastosPorMes.get(mesKey) || { gastos: [], total: 0 };
    mesData.gastos.push(gasto);
    mesData.total += gasto.importe;
    gastosPorMes.set(mesKey, mesData);
  });
  
  // Crear datos mensuales
  const meses = Array.from(gastosPorMes.keys()).sort();
  
  // Encabezados
  rows.push(['Mes', 'Ingresos (EUR)', 'Gastos (EUR)', 'Balance (EUR)', 'Trimestre']);
  
  // Calcular ingresos mensuales (distribución proporcional del total)
  // En una implementación real, esto vendría de datos reales de ingresos por mes
  const totalMeses = meses.length || 1;
  const ingresosMensuales = data.taxSummary.totalGross / totalMeses;
  
  meses.forEach(mes => {
    const [year, month] = mes.split('-');
    const monthNumber = parseInt(month, 10);
    const quarter = Math.ceil(monthNumber / 3) as 1 | 2 | 3 | 4;
    const monthData = gastosPorMes.get(mes)!;
    const balance = ingresosMensuales - monthData.total;
    const monthName = new Date(parseInt(year, 10), monthNumber - 1, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    
    rows.push([
      monthName,
      ingresosMensuales.toFixed(2),
      monthData.total.toFixed(2),
      balance.toFixed(2),
      `T${quarter}`
    ]);
  });
  
  // Resumen trimestral
  rows.push([]);
  rows.push(['RESUMEN TRIMESTRAL']);
  rows.push(['Trimestre', 'Ingresos (EUR)', 'Gastos (EUR)', 'Balance (EUR)']);
  
  const trimestres = new Map<number, { ingresos: number; gastos: number }>();
  
  meses.forEach(mes => {
    const [year, month] = mes.split('-');
    const monthNumber = parseInt(month, 10);
    const quarter = Math.ceil(monthNumber / 3);
    const monthData = gastosPorMes.get(mes)!;
    
    const trimestreData = trimestres.get(quarter) || { ingresos: 0, gastos: 0 };
    trimestreData.ingresos += ingresosMensuales;
    trimestreData.gastos += monthData.total;
    trimestres.set(quarter, trimestreData);
  });
  
  // Ordenar trimestres
  Array.from(trimestres.entries())
    .sort((a, b) => a[0] - b[0])
    .forEach(([quarter, data]) => {
      rows.push([
        `T${quarter}`,
        data.ingresos.toFixed(2),
        data.gastos.toFixed(2),
        (data.ingresos - data.gastos).toFixed(2)
      ]);
    });
  
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  
  // Ajustar ancho de columnas
  worksheet['!cols'] = [
    { wch: 20 }, // Mes
    { wch: 18 }, // Ingresos
    { wch: 18 }, // Gastos
    { wch: 18 }, // Balance
    { wch: 12 }  // Trimestre
  ];
  
  return worksheet;
}

