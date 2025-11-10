import { FiscalProfile, TaxSummary, AccountingExport, ExportRequest, ExportJob, TaxDeadline, FiscalCalendar, TaxReminder, AnnualSummary, QuarterlySummary, MonthlyIncomeExpense, IncomeExpenseChartData, IncomeBySourceSummary, IncomeBySource, IncomeSourceType, FinancialDashboard, FinancialAlert, TaxCalculation } from './types';
import { expensesAPI } from './expenses';
import { CategoriaGasto } from '../types/expenses';
import { calculateTaxes, getDefaultTaxSettings } from '../utils/taxCalculator';

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

// Utilidad para calcular fechas de vencimiento trimestrales
function calculateQuarterlyDeadlines(year: number): TaxDeadline[] {
  const deadlines: TaxDeadline[] = [];
  
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
    
    // Modelo 130 (IRPF trimestral para autónomos)
    deadlines.push({
      id: `130-${year}-${quarter}`,
      model: '130',
      modelName: 'Modelo 130',
      description: `Pago fraccionado IRPF - ${period} ${year}`,
      quarter,
      year,
      deadline,
      reminderDate,
      status: deadline < new Date() ? 'overdue' : 'pending',
      isReminderSent: false
    });
    
    // Modelo 303 (IVA trimestral)
    deadlines.push({
      id: `303-${year}-${quarter}`,
      model: '303',
      modelName: 'Modelo 303',
      description: `Declaración trimestral IVA - ${period} ${year}`,
      quarter,
      year,
      deadline,
      reminderDate,
      status: deadline < new Date() ? 'overdue' : 'pending',
      isReminderSent: false
    });
  });
  
  return deadlines;
}

export const fiscalCalendarApi = {
  // GET /api/v1/finance/fiscal-calendar/:year
  getCalendar: async (year: number): Promise<FiscalCalendar> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const deadlines = calculateQuarterlyDeadlines(year);
    
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
      
      // Crear recordatorio si estamos dentro del rango de 15 días antes
      if (reminderDate <= today && deadlineDate >= today && deadline.status !== 'completed') {
        const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        reminders.push({
          id: `reminder-${deadline.id}`,
          deadlineId: deadline.id,
          userId,
          title: `Recordatorio: ${deadline.modelName} - ${deadline.description}`,
          message: `Quedan ${daysUntilDeadline} días para presentar ${deadline.modelName}. Fecha límite: ${deadline.deadline.toLocaleDateString('es-ES')}`,
          deadlineDate: deadline.deadline,
          reminderDate: deadline.reminderDate,
          isRead: false,
          createdAt: new Date(),
          type: 'quarterly_deadline',
          priority: daysUntilDeadline <= 3 ? 'high' : daysUntilDeadline <= 7 ? 'medium' : 'low'
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
      status: 'completed'
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

