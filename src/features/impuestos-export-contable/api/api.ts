import { FiscalProfile, TaxSummary, AccountingExport, ExportRequest, ExportJob, TaxDeadline, FiscalCalendar, TaxReminder, AnnualSummary, QuarterlySummary, MonthlyIncomeExpense, IncomeExpenseChartData, IncomeBySourceSummary, IncomeBySource, IncomeSourceType, FinancialDashboard, FinancialAlert, TaxCalculation, PerfilFiscal, ResumenFiscalAnual, ParametrosCalculoImpuestos, RegimenFiscal, TipoIVAFiscal } from './types';
import { expensesAPI } from './expenses';
import { CategoriaGasto } from '../types/expenses';
import { calculateTaxes, getDefaultTaxSettings, calcularIRPF, calcularIVA, calcularRetenciones } from '../utils/taxCalculator';

// Mock API para Impuestos & Export Contable
// En producción, estas llamadas irían a un backend real

const API_BASE_URL = '/api/v1/finance';

export const fiscalProfileApi = {
  // GET /api/v1/finance/fiscal-profile
  getProfile: async (): Promise<FiscalProfile> => {
    // Simulación de delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      legalName: 'Fit Center S.L.',
      taxId: 'B12345678',
      address: 'Calle Falsa 123, 28080 Madrid',
      taxRegime: 'General',
      country: 'ES'
    };
  },

  // PUT /api/v1/finance/fiscal-profile
  updateProfile: async (profileData: Partial<FiscalProfile>): Promise<FiscalProfile> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      legalName: profileData.legalName || 'Fit Center S.L.',
      taxId: profileData.taxId || 'B12345678',
      address: profileData.address || 'Calle Falsa 123, 28080 Madrid',
      taxRegime: profileData.taxRegime || 'General',
      country: profileData.country || 'ES'
    };
  }
};

export const taxSummaryApi = {
  // GET /api/v1/finance/tax-summary
  getSummary: async (from: string, to: string): Promise<TaxSummary> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Obtener gastos del mismo periodo
    const fechaInicio = new Date(from);
    const fechaFin = new Date(to);
    fechaFin.setHours(23, 59, 59); // Incluir todo el día
    
    const gastos = await expensesAPI.obtenerGastos({
      fechaInicio,
      fechaFin
    });
    
    const totalExpenses = gastos.reduce((sum, gasto) => sum + gasto.importe, 0);
    
    // Datos mock según el periodo (en producción, esto vendría de la API de ingresos)
    const totalGross = 15250.75;
    const totalNet = 12603.92;
    const totalVat = 2646.83;
    const netProfit = totalGross - totalExpenses;
    
    return {
      totalGross,
      totalNet,
      totalVat,
      totalExpenses,
      netProfit,
      transactionCount: 350,
      currency: 'EUR'
    };
  }
};

export const accountingExportApi = {
  // POST /api/v1/finance/exports/accounting
  createExport: async (request: ExportRequest): Promise<ExportJob> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      jobId: `export-job-${Date.now()}`,
      status: 'pending',
      message: 'La exportación se está procesando y estará disponible en breve.',
      statusUrl: `${API_BASE_URL}/exports/jobs/export-job-${Date.now()}`
    };
  },

  // GET /api/v1/finance/exports/history
  getHistory: async (page = 1, limit = 10): Promise<{ pagination: any; data: AccountingExport[] }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockExports: AccountingExport[] = [
      {
        id: 'exp-12345',
        createdAt: '2023-10-15T10:30:00Z',
        generatedBy: 'admin@gimnasio.com',
        dateRange: '2023-07-01 - 2023-09-30',
        format: 'csv',
        status: 'completed',
        downloadUrl: '/downloads/export-q3-2023.csv'
      },
      {
        id: 'exp-12346',
        createdAt: '2023-09-10T14:20:00Z',
        generatedBy: 'admin@gimnasio.com',
        dateRange: '2023-07-01 - 2023-07-31',
        format: 'pdf',
        status: 'completed',
        downloadUrl: '/downloads/export-julio-2023.pdf'
      },
      {
        id: 'exp-12347',
        createdAt: '2023-08-05T09:15:00Z',
        generatedBy: 'admin@gimnasio.com',
        dateRange: '2023-04-01 - 2023-06-30',
        format: 'a3',
        status: 'completed',
        downloadUrl: '/downloads/export-q2-2023.a3'
      }
    ];
    
    return {
      pagination: {
        totalItems: mockExports.length,
        totalPages: 1,
        currentPage: page
      },
      data: mockExports.slice((page - 1) * limit, page * limit)
    };
  }
};

/**
 * ============================================================================
 * FUNCIONES DE EXPORTACIÓN CONTABLE
 * ============================================================================
 * Funciones mock para generar exportaciones contables en diferentes formatos.
 * 
 * NOTA: En producción, estas funciones se ejecutarían en el backend y:
 * - Procesarían los datos reales de ingresos y gastos
 * - Generarían archivos en el formato solicitado
 * - Almacenarían los archivos en un sistema de almacenamiento (S3, etc.)
 * - Devolverían URLs reales de descarga o streams
 * ============================================================================
 */

/**
 * Filtros para exportación contable
 */
export interface ExportContableFiltros {
  fechaInicio?: Date | string;
  fechaFin?: Date | string;
  incluirIngresos?: boolean;
  incluirGastos?: boolean;
  categoriaGastos?: string[];
  formatoDetalle?: 'simple' | 'detallado';
}

/**
 * Genera una exportación contable en el formato especificado
 * 
 * @param formato - Formato de exportación: "excel", "csv", "contaplus", "a3", o string personalizado
 * @param filtros - Filtros opcionales para la exportación (fechas, categorías, etc.)
 * @returns Promise con información de la exportación generada (id, URL de descarga, formato, fecha)
 * 
 * NOTA: En producción, esta función:
 * - Se ejecutaría en el backend
 * - Procesaría datos reales de ingresos y gastos según los filtros
 * - Generaría el archivo en el formato solicitado usando las utilidades correspondientes
 * - Almacenaría el archivo en un sistema de almacenamiento (S3, Azure Blob, etc.)
 * - Registraría la exportación en la base de datos
 * - Devolvería una URL real de descarga con token de autenticación
 * 
 * Ejemplo de uso:
 * ```typescript
 * const exportacion = await generarExportContable('excel', {
 *   fechaInicio: new Date('2024-01-01'),
 *   fechaFin: new Date('2024-12-31'),
 *   incluirIngresos: true,
 *   incluirGastos: true
 * });
 * console.log(exportacion.urlDescarga); // URL para descargar el archivo
 * ```
 */
export async function generarExportContable(
  formato: "excel" | "csv" | "contaplus" | "a3" | string,
  filtros?: ExportContableFiltros
): Promise<{ id: string; urlDescarga: string; formato: string; fecha: string }> {
  // Simular delay de procesamiento (en producción sería el tiempo real de generación)
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generar ID único para la exportación
  const exportId = `export-contable-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Determinar extensión del archivo según formato
  const extensionMap: Record<string, string> = {
    excel: 'xlsx',
    csv: 'csv',
    contaplus: 'txt',
    a3: 'a3',
    sage50: 'csv'
  };
  
  const extension = extensionMap[formato.toLowerCase()] || 'xlsx';
  
  // Construir nombre de archivo con rango de fechas si está disponible
  let nombreArchivo = `export-contable-${new Date().toISOString().split('T')[0]}`;
  if (filtros?.fechaInicio && filtros?.fechaFin) {
    const fechaInicio = typeof filtros.fechaInicio === 'string' 
      ? filtros.fechaInicio.split('T')[0] 
      : filtros.fechaInicio.toISOString().split('T')[0];
    const fechaFin = typeof filtros.fechaFin === 'string' 
      ? filtros.fechaFin.split('T')[0] 
      : filtros.fechaFin.toISOString().split('T')[0];
    nombreArchivo = `export-contable-${fechaInicio}-${fechaFin}`;
  }
  
  // En producción, aquí se llamaría a las utilidades de generación:
  // - generarExcelDesdeDatos() para formato excel
  // - generarPDFReporteFiscal() para formato pdf (si se añade)
  // - Funciones específicas para contaplus, a3, etc.
  
  // Simular URL de descarga (en producción sería una URL real con token de autenticación)
  const urlDescarga = `/api/v1/finance/exports/${exportId}/download?token=${Math.random().toString(36).substr(2, 16)}`;
  
  return {
    id: exportId,
    urlDescarga,
    formato: formato.toLowerCase(),
    fecha: new Date().toISOString()
  };
}

/**
 * Obtiene el historial de exportaciones contables
 * 
 * @returns Promise con array de exportaciones históricas (id, formato, rango de fechas, fecha, usuario)
 * 
 * NOTA: En producción, esta función:
 * - Consultaría la base de datos para obtener el historial real
 * - Filtraría por usuario autenticado
 * - Incluiría información de estado (pendiente, completada, fallida)
 * - Ordenaría por fecha de creación descendente
 * 
 * Ejemplo de uso:
 * ```typescript
 * const historial = await getExportHistory();
 * historial.forEach(exp => {
 *   console.log(`${exp.formato} - ${exp.rangoFechas} - ${exp.fecha}`);
 * });
 * ```
 */
export async function getExportHistory(): Promise<{ 
  id: string; 
  formato: string; 
  rangoFechas: string; 
  fecha: string; 
  usuario: string;
}[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Datos mock del historial
  // En producción, esto vendría de la base de datos:
  // SELECT id, formato, fecha_inicio, fecha_fin, fecha_creacion, usuario_creacion
  // FROM accounting_exports
  // WHERE usuario_id = :current_user_id
  // ORDER BY fecha_creacion DESC
  // LIMIT 50;
  
  const mockHistory = [
    {
      id: 'exp-hist-001',
      formato: 'excel',
      rangoFechas: '2024-01-01 - 2024-03-31',
      fecha: '2024-04-01T10:30:00Z',
      usuario: 'admin@gimnasio.com'
    },
    {
      id: 'exp-hist-002',
      formato: 'csv',
      rangoFechas: '2024-01-01 - 2024-01-31',
      fecha: '2024-02-01T14:20:00Z',
      usuario: 'admin@gimnasio.com'
    },
    {
      id: 'exp-hist-003',
      formato: 'a3',
      rangoFechas: '2023-10-01 - 2023-12-31',
      fecha: '2024-01-15T09:15:00Z',
      usuario: 'admin@gimnasio.com'
    },
    {
      id: 'exp-hist-004',
      formato: 'contaplus',
      rangoFechas: '2023-07-01 - 2023-09-30',
      fecha: '2023-10-05T11:45:00Z',
      usuario: 'admin@gimnasio.com'
    },
    {
      id: 'exp-hist-005',
      formato: 'excel',
      rangoFechas: '2023-04-01 - 2023-06-30',
      fecha: '2023-07-10T16:00:00Z',
      usuario: 'admin@gimnasio.com'
    }
  ];
  
  return mockHistory;
}

// Utilidad para calcular fechas de vencimiento fiscales (trimestrales, anuales, pagos fraccionados)
function calculateFiscalDeadlines(year: number): TaxDeadline[] {
  const deadlines: TaxDeadline[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Fechas de vencimiento trimestrales en España (Modelo 130 y 303)
  // Q1: Enero-Marzo - vence 20 de abril
  // Q2: Abril-Junio - vence 20 de julio
  // Q3: Julio-Septiembre - vence 20 de octubre
  // Q4: Octubre-Diciembre - vence 30 de enero del año siguiente
  
  const quarterlyDates = [
    { quarter: 1 as const, month: 3, day: 20, name: '1T', period: 'Enero - Marzo' },
    { quarter: 2 as const, month: 6, day: 20, name: '2T', period: 'Abril - Junio' },
    { quarter: 3 as const, month: 9, day: 20, name: '3T', period: 'Julio - Septiembre' },
    { quarter: 4 as const, month: 0, day: 30, name: '4T', period: 'Octubre - Diciembre', nextYear: true },
  ];
  
  quarterlyDates.forEach(({ quarter, month, day, name, period, nextYear }) => {
    const deadlineYear = nextYear ? year + 1 : year;
    const deadline = new Date(deadlineYear, month, day, 23, 59, 59);
    const reminderDate = new Date(deadline);
    reminderDate.setDate(reminderDate.getDate() - 15);
    
    // Determinar estado y si está presentado (mock: algunos trimestres pasados están completados)
    const isPast = deadline < today;
    const isSubmitted = isPast && (quarter === 1 || quarter === 2); // Mock: Q1 y Q2 del año pasado están presentados
    const status = isSubmitted ? 'completed' : (isPast ? 'overdue' : 'pending');
    
    // Modelo 130 (IRPF trimestral para autónomos - Pagos fraccionados)
    deadlines.push({
      id: `130-${year}-${quarter}`,
      model: '130',
      modelName: 'Modelo 130',
      description: `Pago fraccionado IRPF - ${period} ${year}`,
      obligationType: 'irpf_trimestral',
      quarter,
      year,
      deadline,
      reminderDate,
      status,
      isReminderSent: false,
      isSubmitted
    });
    
    // Modelo 303 (IVA trimestral)
    deadlines.push({
      id: `303-${year}-${quarter}`,
      model: '303',
      modelName: 'Modelo 303',
      description: `Declaración trimestral IVA - ${period} ${year}`,
      obligationType: 'iva_trimestral',
      quarter,
      year,
      deadline,
      reminderDate,
      status,
      isReminderSent: false,
      isSubmitted
    });
  });
  
  // Declaración anual (Modelo 100/390) - vence 30 de junio del año siguiente
  const annualDeadline = new Date(year + 1, 5, 30, 23, 59, 59); // 30 de junio
  const annualReminderDate = new Date(annualDeadline);
  annualReminderDate.setDate(annualReminderDate.getDate() - 30); // 30 días antes
  
  const isAnnualPast = annualDeadline < today;
  const isAnnualSubmitted = isAnnualPast && year < today.getFullYear() - 1; // Mock: años anteriores están presentados
  
  deadlines.push({
    id: `100-${year}`,
    model: '100',
    modelName: 'Modelo 100',
    description: `Declaración anual IRPF - Ejercicio ${year}`,
    obligationType: 'declaracion_anual',
    year,
    deadline: annualDeadline,
    reminderDate: annualReminderDate,
    status: isAnnualSubmitted ? 'completed' : (isAnnualPast ? 'overdue' : 'pending'),
    isReminderSent: false,
    isSubmitted: isAnnualSubmitted
  });
  
  // Pagos fraccionados adicionales (si aplica)
  // Ejemplo: Pago fraccionado de julio (primer pago del segundo semestre)
  const installmentDeadline = new Date(year, 6, 20, 23, 59, 59); // 20 de julio
  const installmentReminderDate = new Date(installmentDeadline);
  installmentReminderDate.setDate(installmentReminderDate.getDate() - 15);
  
  const isInstallmentPast = installmentDeadline < today;
  const isInstallmentSubmitted = isInstallmentPast && year < today.getFullYear();
  
  deadlines.push({
    id: `fraccionado-${year}-julio`,
    model: '130',
    modelName: 'Pago Fraccionado',
    description: `Pago fraccionado IRPF - Julio ${year}`,
    obligationType: 'pago_fraccionado',
    year,
    deadline: installmentDeadline,
    reminderDate: installmentReminderDate,
    status: isInstallmentSubmitted ? 'completed' : (isInstallmentPast ? 'overdue' : 'pending'),
    isReminderSent: false,
    isSubmitted: isInstallmentSubmitted
  });
  
  return deadlines;
}

export const fiscalCalendarApi = {
  // GET /api/v1/finance/fiscal-calendar/:year
  getCalendar: async (year: number): Promise<FiscalCalendar> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const deadlines = calculateFiscalDeadlines(year);
    
    return {
      year,
      deadlines
    };
  },
  
  // GET /api/v1/finance/fiscal-calendar/current
  getCurrentYearCalendar: async (): Promise<FiscalCalendar> => {
    const currentYear = new Date().getFullYear();
    return fiscalCalendarApi.getCalendar(currentYear);
  },
  
  // GET /api/v1/finance/tax-reminders
  getReminders: async (userId: string): Promise<TaxReminder[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const currentYear = new Date().getFullYear();
    const calendar = await fiscalCalendarApi.getCalendar(currentYear);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const reminders: TaxReminder[] = [];
    
    calendar.deadlines.forEach(deadline => {
      const reminderDate = new Date(deadline.reminderDate);
      reminderDate.setHours(0, 0, 0, 0);
      const deadlineDate = new Date(deadline.deadline);
      deadlineDate.setHours(0, 0, 0, 0);
      
      // Crear recordatorio si estamos dentro del rango de recordatorio y no está completado
      // También incluir vencimientos próximos (hasta 30 días antes)
      const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const shouldRemind = (reminderDate <= today && deadlineDate >= today) || (daysUntilDeadline > 0 && daysUntilDeadline <= 30);
      
      if (shouldRemind && deadline.status !== 'completed' && !deadline.isSubmitted) {
        // Determinar tipo de recordatorio
        let reminderType: 'quarterly_deadline' | 'annual_declaration' | 'installment_payment' = 'quarterly_deadline';
        if (deadline.obligationType === 'declaracion_anual') {
          reminderType = 'annual_declaration';
        } else if (deadline.obligationType === 'pago_fraccionado') {
          reminderType = 'installment_payment';
        }
        
        // Crear mensaje personalizado según días restantes
        let message = '';
        if (daysUntilDeadline <= 0) {
          message = `¡VENCIDO! Debes presentar ${deadline.modelName} urgentemente. Fecha límite: ${deadline.deadline.toLocaleDateString('es-ES')}`;
        } else if (daysUntilDeadline === 1) {
          message = `¡Mañana vence! Debes presentar ${deadline.modelName} antes de las 23:59.`;
        } else if (daysUntilDeadline <= 7) {
          message = `Te quedan ${daysUntilDeadline} días para presentar ${deadline.modelName}. Fecha límite: ${deadline.deadline.toLocaleDateString('es-ES')}`;
        } else if (daysUntilDeadline <= 15) {
          message = `Quedan ${daysUntilDeadline} días para presentar ${deadline.modelName}. Fecha límite: ${deadline.deadline.toLocaleDateString('es-ES')}`;
        } else {
          message = `Próxima fecha: ${deadline.modelName} - ${deadline.description}. Vence el ${deadline.deadline.toLocaleDateString('es-ES')}`;
        }
        
        reminders.push({
          id: `reminder-${deadline.id}`,
          deadlineId: deadline.id,
          userId,
          title: `${deadline.modelName} - ${deadline.description}`,
          message,
          deadlineDate: deadline.deadline,
          reminderDate: deadline.reminderDate,
          isRead: false,
          createdAt: new Date(),
          type: reminderType,
          priority: daysUntilDeadline <= 3 ? 'high' : daysUntilDeadline <= 7 ? 'medium' : 'low',
          obligationType: deadline.obligationType,
          daysUntilDeadline
        });
      }
    });
    
    return reminders.sort((a, b) => a.deadlineDate.getTime() - b.deadlineDate.getTime());
  },
  
  // POST /api/v1/finance/tax-deadlines/:id/complete
  markDeadlineAsComplete: async (deadlineId: string): Promise<TaxDeadline> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // En producción, esto actualizaría el estado en la base de datos
    const currentYear = new Date().getFullYear();
    const calendar = await fiscalCalendarApi.getCalendar(currentYear);
    const deadline = calendar.deadlines.find(d => d.id === deadlineId);
    
    if (!deadline) {
      throw new Error('Deadline not found');
    }
    
    return {
      ...deadline,
      status: 'completed',
      isSubmitted: true
    };
  }
};

export const annualSummaryApi = {
  // GET /api/v1/finance/annual-summary/:year
  getAnnualSummary: async (year: number): Promise<AnnualSummary> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Obtener datos trimestrales
    const quarterlyBreakdown: QuarterlySummary[] = [];
    let totalGross = 0;
    let totalNet = 0;
    let totalVat = 0;
    let totalExpenses = 0;
    let totalTransactions = 0;
    let totalTaxes = 0;
    
    // Generar datos mock para cada trimestre
    for (let quarter = 1; quarter <= 4; quarter++) {
      const quarterStartMonth = (quarter - 1) * 3;
      const quarterStartDate = new Date(year, quarterStartMonth, 1);
      const quarterEndDate = new Date(year, quarterStartMonth + 3, 0);
      
      // Obtener gastos del trimestre
      const expenses = await expensesAPI.obtenerGastos({
        fechaInicio: quarterStartDate,
        fechaFin: quarterEndDate
      });
      
      const quarterExpenses = expenses.reduce((sum, gasto) => sum + gasto.importe, 0);
      
      // Datos mock por trimestre (en producción, esto vendría de la API de ingresos)
      // Usar un valor determinista basado en el trimestre para consistencia
      const quarterMultiplier = quarter * 1.1; // Pequeña variación por trimestre
      const quarterGross = 15000 + (quarterMultiplier * 1000);
      const quarterNet = quarterGross * 0.82;
      const quarterVat = quarterGross * 0.17;
      const quarterProfit = quarterGross - quarterExpenses;
      const quarterTransactions = 80 + (quarter * 10);
      
      quarterlyBreakdown.push({
        quarter: quarter as 1 | 2 | 3 | 4,
        year,
        totalGross: quarterGross,
        totalNet: quarterNet,
        totalVat: quarterVat,
        totalExpenses: quarterExpenses,
        netProfit: quarterProfit,
        transactionCount: quarterTransactions,
        currency: 'EUR'
      });
      
      totalGross += quarterGross;
      totalNet += quarterNet;
      totalVat += quarterVat;
      totalExpenses += quarterExpenses;
      totalTransactions += quarterTransactions;
    }
    
    const netProfit = totalGross - totalExpenses;
    totalTaxes = totalVat + (netProfit * 0.15); // Estimación de impuestos
    
    // Encontrar mejor y peor trimestre
    const profits = quarterlyBreakdown.map(q => q.netProfit);
    const bestQuarterIndex = profits.indexOf(Math.max(...profits));
    const worstQuarterIndex = profits.indexOf(Math.min(...profits));
    
    return {
      year,
      totalGross,
      totalNet,
      totalVat,
      totalExpenses,
      netProfit,
      totalTaxes,
      quarterlyBreakdown,
      transactionCount: totalTransactions,
      currency: 'EUR',
      averageMonthlyIncome: totalGross / 12,
      averageMonthlyExpenses: totalExpenses / 12,
      bestQuarter: bestQuarterIndex + 1,
      worstQuarter: worstQuarterIndex + 1
    };
  },
  
  // GET /api/v1/finance/annual-summary/current
  getCurrentYearSummary: async (): Promise<AnnualSummary> => {
    const currentYear = new Date().getFullYear();
    return annualSummaryApi.getAnnualSummary(currentYear);
  },
  
  // POST /api/v1/finance/annual-summary/:year/export
  exportAnnualReport: async (year: number, format: 'pdf' | 'csv' | 'excel'): Promise<{ downloadUrl: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // En producción, esto generaría el informe y devolvería la URL de descarga
    return {
      downloadUrl: `/downloads/annual-report-${year}.${format === 'excel' ? 'xlsx' : format}`
    };
  }
};

/**
 * API para obtener datos de ingresos vs gastos para gráficos
 */
export const incomeExpenseChartApi = {
  // GET /api/v1/finance/income-expense-chart
  getChartData: async (
    from: string,
    to: string,
    category?: CategoriaGasto
  ): Promise<IncomeExpenseChartData> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const fechaInicio = new Date(from);
    const fechaFin = new Date(to);
    fechaFin.setHours(23, 59, 59);
    
    // Obtener gastos del período
    const gastosFiltros: any = {
      fechaInicio,
      fechaFin
    };
    if (category) {
      gastosFiltros.categoria = category;
    }
    
    const gastos = await expensesAPI.obtenerGastos(gastosFiltros);
    
    // Agrupar gastos por mes
    const gastosPorMes = new Map<string, number>();
    gastos.forEach(gasto => {
      const month = gasto.fecha.getMonth() + 1;
      const mesKey = `${gasto.fecha.getFullYear()}-${month.toString().padStart(2, '0')}`;
      const total = gastosPorMes.get(mesKey) || 0;
      gastosPorMes.set(mesKey, total + gasto.importe);
    });
    
    // Generar datos mensuales
    const monthlyData: MonthlyIncomeExpense[] = [];
    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);
    
    // Iterar por cada mes en el rango
    const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const mesKey = `${year}-${month.toString().padStart(2, '0')}`;
      
      // Gastos del mes
      const expenses = gastosPorMes.get(mesKey) || 0;
      
      // Ingresos del mes (mock data - en producción vendría de la API de ingresos)
      // Distribuir ingresos totales proporcionalmente entre los meses
      // En una implementación real, esto sería datos reales de ingresos por mes
      const totalMonths = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)) || 1;
      const mockMonthlyIncome = 15250.75 / totalMonths; // Valor mock basado en taxSummary
      
      const quarter = Math.ceil(month / 3) as 1 | 2 | 3 | 4;
      const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      
      monthlyData.push({
        month: monthName,
        monthNumber: month,
        year,
        income: mockMonthlyIncome,
        expenses,
        balance: mockMonthlyIncome - expenses,
        quarter
      });
      
      // Avanzar al siguiente mes
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    // Agrupar por categoría si es necesario
    const categoryBreakdown: { category: string; income: number; expenses: number }[] = [];
    if (!category) {
      const gastosPorCategoria = new Map<string, number>();
      gastos.forEach(gasto => {
        const total = gastosPorCategoria.get(gasto.categoria) || 0;
        gastosPorCategoria.set(gasto.categoria, total + gasto.importe);
      });
      
      gastosPorCategoria.forEach((total, cat) => {
        categoryBreakdown.push({
          category: cat,
          income: 0, // En producción, esto vendría de datos reales de ingresos por categoría
          expenses: total
        });
      });
    }
    
    return {
      monthlyData,
      categoryBreakdown: categoryBreakdown.length > 0 ? categoryBreakdown : undefined
    };
  }
};

/**
 * API para obtener ingresos agrupados por tipo de servicio/fuente
 */
export const incomeBySourceApi = {
  // GET /api/v1/finance/income-by-source
  getIncomeBySource: async (
    from: string,
    to: string
  ): Promise<IncomeBySourceSummary> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const fechaInicio = new Date(from);
    const fechaFin = new Date(to);
    fechaFin.setHours(23, 59, 59);
    
    // Datos mock para desarrollo
    // En producción, esto vendría de la API de facturación/invoices
    // agrupando por tipo de servicio y categoría
    const mockIncomeData: IncomeBySource[] = [
      {
        sourceType: 'sesiones-presenciales',
        sourceName: 'Sesiones Presenciales',
        totalIncome: 6500.00,
        percentage: 42.6,
        transactionCount: 130,
        averageAmount: 50.00,
        currency: 'EUR'
      },
      {
        sourceType: 'sesiones-online',
        sourceName: 'Sesiones Online',
        totalIncome: 2250.00,
        percentage: 14.8,
        transactionCount: 50,
        averageAmount: 45.00,
        currency: 'EUR'
      },
      {
        sourceType: 'planes-nutricionales',
        sourceName: 'Planes Nutricionales',
        totalIncome: 3599.60,
        percentage: 23.6,
        transactionCount: 40,
        averageAmount: 89.99,
        currency: 'EUR'
      },
      {
        sourceType: 'consultas',
        sourceName: 'Consultas',
        totalIncome: 1200.00,
        percentage: 7.9,
        transactionCount: 24,
        averageAmount: 50.00,
        currency: 'EUR'
      },
      {
        sourceType: 'membresias',
        sourceName: 'Membresías',
        totalIncome: 1200.00,
        percentage: 7.9,
        transactionCount: 12,
        averageAmount: 100.00,
        currency: 'EUR'
      },
      {
        sourceType: 'productos',
        sourceName: 'Productos',
        totalIncome: 450.00,
        percentage: 2.9,
        transactionCount: 15,
        averageAmount: 30.00,
        currency: 'EUR'
      },
      {
        sourceType: 'otros',
        sourceName: 'Otros Servicios',
        totalIncome: 50.15,
        percentage: 0.3,
        transactionCount: 2,
        averageAmount: 25.08,
        currency: 'EUR'
      }
    ];
    
    // Calcular total y ajustar porcentajes
    const totalIncome = mockIncomeData.reduce((sum, source) => sum + source.totalIncome, 0);
    const adjustedSources = mockIncomeData.map(source => ({
      ...source,
      percentage: totalIncome > 0 ? (source.totalIncome / totalIncome) * 100 : 0
    }));
    
    return {
      totalIncome,
      sources: adjustedSources.sort((a, b) => b.totalIncome - a.totalIncome),
      period: {
        from: fechaInicio,
        to: fechaFin
      },
      currency: 'EUR'
    };
  }
};

/**
 * API para obtener datos del Dashboard financiero
 */
export const financialDashboardApi = {
  // GET /api/v1/finance/dashboard
  getDashboard: async (userId?: string): Promise<FinancialDashboard> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Obtener período del mes actual
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    lastDayOfMonth.setHours(23, 59, 59);
    
    // Obtener gastos del mes actual
    const gastos = await expensesAPI.obtenerGastos({
      fechaInicio: firstDayOfMonth,
      fechaFin: lastDayOfMonth
    });
    
    const monthlyExpenses = gastos.reduce((sum, gasto) => sum + gasto.importe, 0);
    
    // Obtener ingresos del mes (mock data - en producción vendría de la API de ingresos)
    const monthlyIncome = 15250.75; // Valor mock
    const grossProfit = monthlyIncome - monthlyExpenses;
    
    // Obtener perfil fiscal para cálculos
    const fiscalProfile = await fiscalProfileApi.getProfile();
    const taxSettings = getDefaultTaxSettings(fiscalProfile.taxRegime);
    
    // Calcular impuestos
    const taxCalculation = calculateTaxes(
      monthlyIncome,
      monthlyExpenses,
      taxSettings
    );
    
    // Calcular KPIs
    const monthlyNetProfit = taxCalculation.netIncome;
    const profitMargin = monthlyIncome > 0 
      ? (grossProfit / monthlyIncome) * 100 
      : 0;
    const estimatedPendingTaxes = taxCalculation.totalTaxes;
    const availableAfterTaxes = monthlyNetProfit;
    
    // Generar alertas
    const alerts: FinancialAlert[] = [];
    
    // Alerta si el margen es bajo
    if (profitMargin < 20) {
      alerts.push({
        id: 'low-margin',
        type: 'warning',
        title: 'Margen de beneficio bajo',
        message: `Tu margen de beneficio es del ${profitMargin.toFixed(1)}%. Considera revisar tus gastos o aumentar tus precios.`,
        priority: profitMargin < 10 ? 'high' : 'medium',
        actionUrl: '#gastos',
        actionLabel: 'Ver gastos'
      });
    }
    
    // Alerta si hay gastos sin categorizar
    const gastosSinCategoria = gastos.filter(g => !g.categoria || g.categoria === 'otros');
    if (gastosSinCategoria.length > 0) {
      alerts.push({
        id: 'uncategorized-expenses',
        type: 'info',
        title: 'Gastos sin categorizar',
        message: `Tienes ${gastosSinCategoria.length} gasto(s) sin categorizar. Organízalos para un mejor control.`,
        priority: 'low',
        actionUrl: '#gastos',
        actionLabel: 'Organizar gastos'
      });
    }
    
    // Alerta si hay impuestos pendientes próximos
    const taxReminders = await fiscalCalendarApi.getReminders(userId || '');
    const upcomingDeadlines = taxReminders.filter(r => !r.isRead);
    if (upcomingDeadlines.length > 0) {
      const highPriorityDeadlines = upcomingDeadlines.filter(r => r.priority === 'high');
      if (highPriorityDeadlines.length > 0) {
        alerts.push({
          id: 'upcoming-tax-deadline',
          type: 'error',
          title: 'Plazo fiscal próximo',
          message: `Tienes ${highPriorityDeadlines.length} plazo(s) fiscal(es) próximo(s). No olvides presentarlos a tiempo.`,
          priority: 'high',
          actionUrl: '#calendar',
          actionLabel: 'Ver calendario fiscal'
        });
      }
    }
    
    // Alerta si el beneficio es negativo
    if (monthlyNetProfit < 0) {
      alerts.push({
        id: 'negative-profit',
        type: 'error',
        title: 'Beneficio negativo',
        message: 'Tus gastos superan tus ingresos este mes. Revisa tus finanzas urgentemente.',
        priority: 'high',
        actionUrl: '#gastos',
        actionLabel: 'Revisar gastos'
      });
    }
    
    // Alerta si no hay gastos registrados
    if (gastos.length === 0) {
      alerts.push({
        id: 'no-expenses',
        type: 'info',
        title: 'Sin gastos registrados',
        message: 'No has registrado gastos este mes. Recuerda registrar todos los gastos deducibles.',
        priority: 'low',
        actionUrl: '#gastos',
        actionLabel: 'Registrar gasto'
      });
    }
    
    return {
      monthlyNetProfit,
      profitMargin,
      estimatedPendingTaxes,
      availableAfterTaxes,
      currency: 'EUR',
      monthlyIncome,
      monthlyExpenses,
      grossProfit,
      alerts: alerts.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }),
      period: {
        from: firstDayOfMonth,
        to: lastDayOfMonth
      },
      taxCalculation
    };
  }
};

/**
 * ============================================================================
 * API PRINCIPAL DE GESTIÓN FISCAL
 * ============================================================================
 * Funciones para gestionar perfil fiscal, datos fiscales del usuario y
 * cálculos base de impuestos.
 * 
 * NOTA: En producción, estas funciones se conectarían con:
 * - Backend real que gestiona datos fiscales del usuario
 * - Base de datos de perfiles fiscales
 * - Servicios de cálculo fiscal actualizados según normativa vigente
 * - Integración con sistemas de Hacienda cuando sea necesario
 * ============================================================================
 */

/**
 * API para gestión del perfil fiscal
 */
export const perfilFiscalApi = {
  /**
   * Obtiene el perfil fiscal del usuario actual
   * 
   * @returns Promise con el perfil fiscal del usuario
   * 
   * NOTA: En producción, esta función se conectaría con:
   * - Backend que almacena el perfil fiscal del usuario
   * - Validación de datos fiscales según normativa vigente
   * - Sincronización con datos de Hacienda si está disponible
   */
  getPerfilFiscal: async (): Promise<PerfilFiscal> => {
    // Simulación de delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Datos mock - en producción vendrían del backend
    return {
      regimenFiscal: 'general',
      tipoActividad: 'autonomo',
      tipoIVA: 'general',
      retencionIRPF: 15,
      pais: 'España',
      comunidadAutonomaOpcional: 'Madrid',
      observaciones: 'Perfil fiscal configurado para autónomo en régimen general'
    };
  },

  /**
   * Actualiza el perfil fiscal del usuario
   * 
   * @param data - Datos parciales del perfil fiscal a actualizar
   * @returns Promise con el perfil fiscal actualizado
   * 
   * NOTA: En producción, esta función se conectaría con:
   * - Backend que actualiza el perfil fiscal en la base de datos
   * - Validación de cambios según normativa fiscal vigente
   * - Notificaciones si el cambio afecta a cálculos fiscales existentes
   */
  updatePerfilFiscal: async (data: Partial<PerfilFiscal>): Promise<PerfilFiscal> => {
    // Simulación de delay de red
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Obtener perfil actual y aplicar cambios
    const perfilActual = await perfilFiscalApi.getPerfilFiscal();
    
    // En producción, esto actualizaría en la base de datos
    return {
      ...perfilActual,
      ...data
    };
  }
};

/**
 * API para resúmenes fiscales anuales
 */
export const resumenFiscalApi = {
  /**
   * Obtiene el resumen fiscal anual para un año específico
   * 
   * @param anio - Año fiscal para el que se solicita el resumen
   * @returns Promise con el resumen fiscal anual completo
   * 
   * NOTA: En producción, esta función se conectaría con:
   * - Backend que agrega datos de ingresos y gastos del año
   * - Cálculos basados en normativa fiscal vigente del año correspondiente
   * - Validación de datos fiscales históricos
   */
  getResumenFiscalAnual: async (anio: number): Promise<ResumenFiscalAnual> => {
    // Simulación de delay de red
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Obtener gastos del año
    const fechaInicio = new Date(anio, 0, 1);
    const fechaFin = new Date(anio, 11, 31, 23, 59, 59);
    
    const gastos = await expensesAPI.obtenerGastos({
      fechaInicio,
      fechaFin
    });
    
    const gastosTotales = gastos.reduce((sum, gasto) => sum + gasto.importe, 0);
    
    // Datos mock de ingresos - en producción vendrían de la API de ingresos
    const ingresosTotales = 60000; // Valor mock anual
    const baseImponible = Math.max(0, ingresosTotales - gastosTotales);
    
    // Calcular IVA soportado (estimación: 70% de gastos tienen IVA al 21%)
    const gastosConIVA = gastosTotales * 0.7;
    const ivaSoportado = gastosConIVA - (gastosConIVA / 1.21);
    
    // Calcular IVA repercutido (estimación: ingresos con IVA al 21%)
    const ivaRepercutido = ingresosTotales - (ingresosTotales / 1.21);
    
    // Calcular IRPF estimado usando tramos estándar
    const tramosIRPF: Array<{ desde: number; hasta?: number; porcentaje: number }> = [
      { desde: 0, hasta: 12450, porcentaje: 19 },
      { desde: 12450, hasta: 20200, porcentaje: 24 },
      { desde: 20200, hasta: 35200, porcentaje: 30 },
      { desde: 35200, hasta: 60000, porcentaje: 37 },
      { desde: 60000, porcentaje: 45 }
    ];
    
    const irpfEstimado = calcularIRPF(ingresosTotales, gastosTotales, tramosIRPF);
    
    // Calcular beneficio neto
    const beneficio = baseImponible - irpfEstimado;
    
    // Calcular ratio de deducibilidad
    const ratioDeducibilidad = gastosTotales > 0 
      ? (gastosTotales / ingresosTotales) * 100 
      : 0;
    
    return {
      anio,
      ingresosTotales,
      gastosTotales,
      baseImponible,
      ivaSoportado,
      ivaRepercutido,
      irpfEstimado,
      beneficio,
      ratioDeducibilidad
    };
  },

  /**
   * Calcula los impuestos para un período específico usando los parámetros proporcionados
   * 
   * @param parametros - Parámetros de cálculo de impuestos
   * @returns Promise con el resumen fiscal calculado
   * 
   * NOTA: En producción, esta función se conectaría con:
   * - Backend que valida parámetros según normativa fiscal vigente
   * - Servicios de cálculo fiscal actualizados
   * - Validación de tramos IRPF según año fiscal
   * - Cálculos específicos según régimen fiscal y tipo de actividad
   */
  calcularImpuestos: async (
    parametros: ParametrosCalculoImpuestos
  ): Promise<ResumenFiscalAnual> => {
    // Simulación de delay de red
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const { anio, ingresos, gastos, regimen, tipoIVA, tramosIRPF } = parametros;
    
    // Calcular base imponible según régimen fiscal
    let baseImponible = Math.max(0, ingresos - gastos);
    
    // Aplicar coeficientes reductores según régimen
    if (regimen === 'simplificado') {
      // En régimen simplificado, se aplica un coeficiente reductor
      const coeficienteReductor = 0.05; // 5% de reducción (variable según actividad)
      baseImponible = baseImponible * (1 - coeficienteReductor);
    } else if (regimen === 'estimacion_objetiva') {
      // En estimación objetiva, se usa un módulo base
      const coeficienteModulo = 0.15; // 15% de coeficiente (variable según actividad)
      baseImponible = ingresos * coeficienteModulo;
    } else if (regimen === 'exento') {
      baseImponible = 0;
    }
    
    // Calcular IVA según tipo de IVA aplicable
    let ivaSoportado = 0;
    let ivaRepercutido = 0;
    
    if (tipoIVA !== 'exento' && tipoIVA !== 'no_sujeto') {
      // Determinar porcentaje de IVA según tipo
      let porcentajeIVA = 21; // General por defecto
      if (tipoIVA === 'reducido') {
        porcentajeIVA = 10;
      } else if (tipoIVA === 'superreducido') {
        porcentajeIVA = 4;
      }
      
      // Calcular IVA repercutido (de ingresos)
      ivaRepercutido = ingresos - (ingresos / (1 + porcentajeIVA / 100));
      
      // Calcular IVA soportado (de gastos - estimación: 70% de gastos tienen IVA)
      const gastosConIVA = gastos * 0.7;
      ivaSoportado = gastosConIVA - (gastosConIVA / (1 + porcentajeIVA / 100));
    }
    
    // Calcular IVA neto usando función pura
    const calculoIVA = calcularIVA(ivaRepercutido, ivaSoportado);
    const ivaNeto = calculoIVA.aIngresar ? calculoIVA.resultado : -calculoIVA.resultado;
    
    // Calcular IRPF usando función pura con tramos proporcionados
    const irpfEstimado = calcularIRPF(ingresos, gastos, tramosIRPF);
    
    // Calcular beneficio neto (después de impuestos)
    const beneficio = baseImponible - irpfEstimado - (calculoIVA.aIngresar ? ivaNeto : 0);
    
    // Calcular ratio de deducibilidad
    const ratioDeducibilidad = gastos > 0 
      ? (gastos / ingresos) * 100 
      : 0;
    
    return {
      anio,
      ingresosTotales: ingresos,
      gastosTotales: gastos,
      baseImponible,
      ivaSoportado,
      ivaRepercutido,
      irpfEstimado,
      beneficio,
      ratioDeducibilidad
    };
  }
};

/**
 * ============================================================================
 * EXPORTACIONES DIRECTAS DE FUNCIONES (para uso directo)
 * ============================================================================
 * Estas funciones pueden importarse directamente para facilitar su uso
 * en componentes y otros módulos.
 * ============================================================================
 */

/**
 * Obtiene el perfil fiscal del usuario actual
 * 
 * NOTA: En producción, esta función se conectaría con el backend real
 * que gestiona los datos fiscales del usuario.
 */
export const getPerfilFiscal = (): Promise<PerfilFiscal> => {
  return perfilFiscalApi.getPerfilFiscal();
};

/**
 * Actualiza el perfil fiscal del usuario
 * 
 * NOTA: En producción, esta función se conectaría con el backend real
 * que actualiza los datos fiscales en la base de datos.
 */
export const updatePerfilFiscal = (data: Partial<PerfilFiscal>): Promise<PerfilFiscal> => {
  return perfilFiscalApi.updatePerfilFiscal(data);
};

/**
 * Obtiene el resumen fiscal anual para un año específico
 * 
 * NOTA: En producción, esta función se conectaría con el backend real
 * que agrega y calcula los datos fiscales del año.
 */
export const getResumenFiscalAnual = (anio: number): Promise<ResumenFiscalAnual> => {
  return resumenFiscalApi.getResumenFiscalAnual(anio);
};

/**
 * Calcula los impuestos para un período específico
 * 
 * NOTA: En producción, esta función se conectaría con servicios de cálculo
 * fiscal actualizados según la normativa vigente y validación de parámetros.
 */
export const calcularImpuestos = (
  parametros: ParametrosCalculoImpuestos
): Promise<ResumenFiscalAnual> => {
  return resumenFiscalApi.calcularImpuestos(parametros);
};

/**
 * ============================================================================
 * API DE GUÍA EDUCATIVA DE GASTOS DEDUCIBLES
 * ============================================================================
 * Funciones para obtener contenido educativo sobre gastos deducibles
 * y buenas prácticas fiscales.
 * 
 * NOTA: En producción, estas funciones se conectarían con:
 * - Sistema de gestión de contenido educativo
 * - Actualizaciones según normativa fiscal vigente
 * - Personalización según tipo de actividad del usuario
 * ============================================================================
 */

/**
 * Tipos para la guía educativa de gastos deducibles
 */
export interface LimiteFiscal {
  concepto: string;
  limite?: string;
  porcentaje?: string;
  descripcion: string;
  importante: boolean;
}

export interface CategoriaEducativa {
  categoriaId: string;
  nombre: string;
  descripcion: string;
  ejemplos: string[];
  porcentajeDeducible: string;
  tips: string[];
  limites?: LimiteFiscal[];
}

export interface GuiaGastosDeducibles {
  introduccion: {
    titulo: string;
    descripcion: string;
    advertencia: string;
  };
  queEsDeducible: {
    titulo: string;
    definicion: string;
    criterios: string[];
    ejemplos: string[];
  };
  categorias: CategoriaEducativa[];
  limitesComunes: {
    titulo: string;
    limites: LimiteFiscal[];
    notaImportante: string;
  };
  buenasPracticas: {
    titulo: string;
    practicas: Array<{
      titulo: string;
      descripcion: string;
      importancia: 'alta' | 'media' | 'baja';
    }>;
  };
}

/**
 * Obtiene la guía educativa completa de gastos deducibles
 * 
 * @returns Promise con la guía educativa estructurada
 * 
 * NOTA: En producción, esta función se conectaría con:
 * - Sistema de gestión de contenido (CMS) que mantiene la guía actualizada
 * - Personalización según tipo de actividad (entrenador, gimnasio, etc.)
 * - Versiones específicas según normativa fiscal por país/región
 * 
 * Ejemplo de uso:
 * ```typescript
 * const guia = await getGuiaGastosDeducibles();
 * console.log(guia.categorias); // Array de categorías con ejemplos
 * ```
 */
export const getGuiaGastosDeducibles = async (): Promise<GuiaGastosDeducibles> => {
  // Simulación de delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Contenido educativo estructurado
  // NOTA: Este es contenido de ejemplo/simulación. En producción,
  // estos datos vendrían de una base de datos o CMS que los mantiene
  // actualizados según la normativa fiscal vigente.
  
  return {
    introduccion: {
      titulo: 'Guía de Gastos Deducibles para Entrenadores Personales',
      descripcion: 'Descubre qué gastos puedes deducir según tu actividad profesional y asegúrate de no perder oportunidades de deducción fiscal. Esta guía incluye ejemplos concretos y consejos prácticos para cada categoría de gasto.',
      advertencia: 'IMPORTANTE: Consulta siempre con tu gestor o asesor fiscal para casos específicos. La normativa puede variar según tu situación fiscal y la normativa vigente en tu país/región. Esta guía es de carácter informativo y educativo.'
    },
    queEsDeducible: {
      titulo: '¿Qué es un Gasto Deducible?',
      definicion: 'Un gasto deducible es aquel que está directamente relacionado con tu actividad profesional y que puedes restar de tus ingresos para calcular tu base imponible en la declaración de impuestos.',
      criterios: [
        'Debe ser necesario para el desarrollo de tu actividad profesional',
        'Debe estar justificado con factura o comprobante válido',
        'No puede ser de uso personal o privado',
        'Debe estar directamente relacionado con la generación de ingresos'
      ],
      ejemplos: [
        'Compra de equipamiento profesional (pesas, máquinas, material de entrenamiento)',
        'Certificaciones y cursos de formación continua',
        'Gastos de marketing y publicidad para conseguir clientes',
        'Combustible y mantenimiento para desplazamientos de trabajo',
        'Alquiler de espacio profesional para entrenamientos',
        'Software y suscripciones necesarias para tu actividad'
      ]
    },
    categorias: [
      {
        categoriaId: 'equipamiento',
        nombre: 'Equipamiento',
        descripcion: 'Compra de equipos, máquinas, pesas, material de entrenamiento',
        ejemplos: [
          'Pesas, mancuernas y barras',
          'Máquinas de ejercicio (cintas, bicicletas estáticas)',
          'Colchonetas y material de yoga',
          'Material de resistencia (bandas elásticas, kettlebells)',
          'Equipamiento de medición (balanzas, calibradores)'
        ],
        porcentajeDeducible: '100%',
        tips: [
          'Guarda las facturas de compra para justificar la inversión',
          'El equipamiento debe ser necesario para tu actividad profesional',
          'Puedes deducir hasta el 100% si es de uso exclusivo profesional'
        ]
      },
      {
        categoriaId: 'certificaciones',
        nombre: 'Certificaciones',
        descripcion: 'Cursos, certificaciones profesionales, renovaciones de licencias',
        ejemplos: [
          'Certificaciones profesionales (NASM, ACE, NSCA, etc.)',
          'Cursos de formación continua',
          'Renovaciones de licencias profesionales',
          'Seminarios y workshops especializados',
          'Certificaciones de primeros auxilios'
        ],
        porcentajeDeducible: '100%',
        tips: [
          'Las certificaciones deben estar relacionadas con tu actividad',
          'Conserva los certificados y facturas',
          'La formación continua es 100% deducible'
        ]
      },
      {
        categoriaId: 'marketing',
        nombre: 'Marketing',
        descripcion: 'Publicidad, redes sociales, material promocional, fotografía profesional',
        ejemplos: [
          'Publicidad en redes sociales (Facebook, Instagram, Google Ads)',
          'Material promocional (flyers, tarjetas de visita)',
          'Fotografía profesional para marketing',
          'Diseño gráfico y branding',
          'Suscripciones a plataformas de marketing digital'
        ],
        porcentajeDeducible: '100%',
        tips: [
          'Los gastos de marketing son 100% deducibles',
          'Mantén registros de campañas publicitarias',
          'Incluye gastos de diseño y creación de contenido'
        ]
      },
      {
        categoriaId: 'transporte',
        nombre: 'Transporte',
        descripcion: 'Combustible, mantenimiento de vehículo, peajes, parking',
        ejemplos: [
          'Combustible para desplazamientos a clientes',
          'Peajes y parking relacionados con trabajo',
          'Mantenimiento del vehículo (solo parte profesional)',
          'Seguro del vehículo (proporcional al uso profesional)',
          'Desplazamientos a formaciones y eventos profesionales'
        ],
        porcentajeDeducible: 'Proporcional al uso profesional',
        tips: [
          'Lleva un registro de kilómetros profesionales',
          'Solo se deduce la parte proporcional al uso profesional',
          'Guarda los tickets de gasolina y peajes',
          'Considera usar la fórmula de kilometraje si es más ventajosa'
        ],
        limites: [
          {
            concepto: 'Uso profesional del vehículo',
            porcentaje: 'Máximo proporcional al % de uso profesional',
            descripcion: 'Solo puedes deducir la parte proporcional del uso profesional del vehículo. Si tu vehículo tiene un 60% de uso profesional, solo podrás deducir el 60% de los gastos.',
            importante: true
          }
        ]
      },
      {
        categoriaId: 'dietas',
        nombre: 'Dietas',
        descripcion: 'Comidas de trabajo cuando se trabaja fuera de casa',
        ejemplos: [
          'Comidas fuera de casa cuando trabajas con clientes',
          'Dietas cuando trabajas fuera de tu localidad habitual',
          'Comidas durante formaciones o eventos profesionales',
          'Dietas durante desplazamientos de trabajo'
        ],
        porcentajeDeducible: 'Hasta límites establecidos por Hacienda',
        tips: [
          'Solo se deducen dietas justificadas por trabajo',
          'Debe haber un desplazamiento o trabajo fuera de casa',
          'Guarda los tickets y justifica el motivo',
          'Hay límites diarios establecidos por Hacienda'
        ],
        limites: [
          {
            concepto: 'Límite diario de dietas',
            limite: 'Variable según normativa (consultar límites actuales)',
            descripcion: 'Existen límites diarios para dietas según la normativa fiscal. Consulta con tu gestor los límites aplicables para tu situación.',
            importante: true
          }
        ]
      },
      {
        categoriaId: 'alquiler',
        nombre: 'Alquiler',
        descripcion: 'Alquiler de espacio, sala de entrenamiento, oficina',
        ejemplos: [
          'Alquiler de espacio de entrenamiento',
          'Alquiler de sala de yoga o pilates',
          'Alquiler de oficina o espacio administrativo',
          'Alquiler de equipamiento (si no es compra)',
          'Alquiler de espacio para eventos o talleres'
        ],
        porcentajeDeducible: '100% si es exclusivo profesional',
        tips: [
          'El alquiler debe ser necesario para la actividad profesional',
          'Si trabajas desde casa, solo se deduce la parte proporcional',
          'Guarda los contratos de alquiler y recibos'
        ]
      },
      {
        categoriaId: 'vestimenta',
        nombre: 'Vestimenta',
        descripcion: 'Ropa de trabajo específica, calzado deportivo profesional',
        ejemplos: [
          'Ropa de trabajo específica (uniforme con logo)',
          'Calzado deportivo profesional',
          'Ropa técnica para entrenamientos',
          'Vestimenta con identificación profesional'
        ],
        porcentajeDeducible: '100% si es exclusiva de trabajo',
        tips: [
          'Solo se deduce si es vestimenta específica de trabajo',
          'La ropa de uso personal no es deducible',
          'Debe ser claramente identificable como profesional',
          'Guarda las facturas'
        ]
      },
      {
        categoriaId: 'software',
        nombre: 'Software',
        descripcion: 'Suscripciones a software, aplicaciones, plataformas online',
        ejemplos: [
          'Suscripciones a apps de entrenamiento (MyFitnessPal, Trainerize)',
          'Software de gestión de clientes',
          'Plataformas de videollamadas para entrenamientos online',
          'Software de contabilidad y facturación',
          'Aplicaciones de nutrición y planificación de dietas'
        ],
        porcentajeDeducible: '100% si es exclusivo profesional',
        tips: [
          'Las suscripciones profesionales son 100% deducibles',
          'Si usas software personal y profesional, deduce solo la parte profesional',
          'Conserva los recibos de suscripción'
        ]
      }
    ],
    limitesComunes: {
      titulo: 'Límites y Advertencias Fiscales Importantes',
      limites: [
        {
          concepto: 'Dietas y gastos de manutención',
          limite: 'Límites diarios según normativa',
          descripcion: 'Los gastos en dietas tienen límites diarios establecidos por la normativa fiscal. Debes justificar el desplazamiento y el motivo del gasto.',
          importante: true
        },
        {
          concepto: 'Uso de vehículo propio',
          porcentaje: 'Proporcional al uso profesional',
          descripcion: 'Solo puedes deducir la parte proporcional del vehículo que corresponda al uso profesional. Mantén un registro de kilómetros profesionales.',
          importante: true
        },
        {
          concepto: 'Trabajo desde casa (home office)',
          porcentaje: 'Proporcional al espacio utilizado',
          descripcion: 'Si trabajas desde casa, solo puedes deducir la parte proporcional de los gastos (alquiler, luz, internet) correspondiente al espacio de trabajo.',
          importante: true
        },
        {
          concepto: 'Gastos de representación',
          limite: 'Límites según normativa',
          descripcion: 'Los gastos de representación y relaciones públicas tienen límites específicos. Consulta con tu gestor para tu caso particular.',
          importante: false
        }
      ],
      notaImportante: 'Estos límites pueden variar según la normativa fiscal vigente y tu situación particular. Siempre consulta con tu gestor o asesor fiscal para casos específicos.'
    },
    buenasPracticas: {
      titulo: 'Buenas Prácticas Fiscales',
      practicas: [
        {
          titulo: 'Guarda todas las facturas y comprobantes',
          descripcion: 'Conserva todas las facturas, recibos y comprobantes de tus gastos deducibles. Hacienda puede solicitarlos en cualquier momento y son esenciales para justificar tus deducciones.',
          importancia: 'alta'
        },
        {
          titulo: 'Registra los gastos inmediatamente',
          descripcion: 'No esperes al final del año para registrar tus gastos. Hazlo mensualmente para no olvidar nada y tener un control mejor de tus finanzas.',
          importancia: 'alta'
        },
        {
          titulo: 'Mantén un registro de kilómetros profesionales',
          descripcion: 'Si usas tu vehículo para trabajo, lleva un registro detallado de los kilómetros profesionales. Esto te ayudará a justificar la deducción proporcional de los gastos del vehículo.',
          importancia: 'alta'
        },
        {
          titulo: 'Separa gastos personales y profesionales',
          descripcion: 'Mantén separados tus gastos personales de los profesionales. Esto facilitará la declaración y evitará confusiones o problemas con Hacienda.',
          importancia: 'alta'
        },
        {
          titulo: 'Consulta con un profesional para casos específicos',
          descripcion: 'La normativa fiscal puede ser compleja. Consulta con tu gestor o asesor fiscal para casos específicos o dudas sobre la deducibilidad de un gasto.',
          importancia: 'media'
        },
        {
          titulo: 'Revisa regularmente tus gastos',
          descripcion: 'Revisa tus gastos mensualmente para asegurarte de no perder ninguna deducción y mantener un control adecuado de tus finanzas.',
          importancia: 'media'
        },
        {
          titulo: 'Documenta el motivo profesional de cada gasto',
          descripcion: 'Añade notas o documentación que justifique por qué un gasto es profesional. Esto será útil si Hacienda solicita aclaraciones.',
          importancia: 'baja'
        }
      ]
    }
  };
};

