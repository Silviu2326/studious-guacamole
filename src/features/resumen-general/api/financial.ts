/**
 * API para resumen financiero del dashboard
 * 
 * Proporciona un resumen financiero completo con métricas clave del mes actual,
 * variaciones comparativas y datos históricos para visualización en gráficos.
 */

/**
 * Datos financieros de un mes específico para gráficos históricos
 */
export interface MonthFinancialData {
  monthLabel: string; // Ej: "Ene 2024", "Feb 2024"
  revenue: number;    // Ingresos del mes
  expenses: number;  // Gastos del mes
}

/**
 * Resumen financiero del dashboard
 */
export interface FinancialSummary {
  // Métricas del mes actual
  revenueMonth: number;      // Ingresos del mes actual
  expensesMonth: number;     // Gastos del mes actual
  profitMonth: number;        // Beneficio del mes actual (revenue - expenses)
  
  // Variaciones porcentuales vs mes anterior
  revenueVariation: number;   // Variación % de ingresos vs mes anterior (puede ser positivo o negativo)
  profitVariation: number;    // Variación % de beneficio vs mes anterior (puede ser positivo o negativo)
  
  // Datos históricos para gráficos (últimos 6 meses)
  lastMonths?: MonthFinancialData[];
}

/**
 * Obtiene el resumen financiero del usuario
 * 
 * @param role - Rol del usuario ('entrenador' o 'gimnasio')
 * @param userId - ID opcional del usuario
 * @returns Promise con el resumen financiero
 */
export async function getFinancialSummary(
  role: 'entrenador' | 'gimnasio',
  userId?: string
): Promise<FinancialSummary> {
  // Simulación de API - reemplazar con llamada real
  return new Promise((resolve) => {
    setTimeout(() => {
      if (role === 'entrenador') {
        // Datos para entrenador personal
        const revenueMonth = 4850.00;
        const expensesMonth = 850.00;
        const profitMonth = revenueMonth - expensesMonth; // 4000.00
        
        // Mes anterior (simulado)
        const previousRevenue = 4200.00;
        const previousExpenses = 800.00;
        const previousProfit = previousRevenue - previousExpenses; // 3400.00
        
        // Cálculo de variaciones
        const revenueVariation = ((revenueMonth - previousRevenue) / previousRevenue) * 100; // ~15.48%
        const profitVariation = ((profitMonth - previousProfit) / previousProfit) * 100; // ~17.65%
        
        // Generar datos de los últimos 6 meses para gráfico
        const lastMonths: MonthFinancialData[] = [];
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const currentMonth = new Date().getMonth();
        
        for (let i = 5; i >= 0; i--) {
          const monthIndex = (currentMonth - i + 12) % 12;
          const monthLabel = monthNames[monthIndex];
          
          // Simular datos históricos con variación gradual
          const baseRevenue = previousRevenue * (1 - (5 - i) * 0.02);
          const baseExpenses = previousExpenses * (1 - (5 - i) * 0.01);
          
          lastMonths.push({
            monthLabel,
            revenue: Math.round(baseRevenue * (0.95 + Math.random() * 0.1) * 100) / 100,
            expenses: Math.round(baseExpenses * (0.95 + Math.random() * 0.1) * 100) / 100,
          });
        }
        
        // El último mes debe ser el mes actual
        lastMonths[lastMonths.length - 1] = {
          monthLabel: monthNames[currentMonth],
          revenue: revenueMonth,
          expenses: expensesMonth,
        };
        
        resolve({
          revenueMonth,
          expensesMonth,
          profitMonth,
          revenueVariation: Math.round(revenueVariation * 100) / 100,
          profitVariation: Math.round(profitVariation * 100) / 100,
          lastMonths,
        });
      } else {
        // Datos para gimnasio
        const revenueMonth = 125000.00;
        const expensesMonth = 45000.00;
        const profitMonth = revenueMonth - expensesMonth; // 80000.00
        
        // Mes anterior (simulado)
        const previousRevenue = 118000.00;
        const previousExpenses = 43000.00;
        const previousProfit = previousRevenue - previousExpenses; // 75000.00
        
        // Cálculo de variaciones
        const revenueVariation = ((revenueMonth - previousRevenue) / previousRevenue) * 100; // ~5.93%
        const profitVariation = ((profitMonth - previousProfit) / previousProfit) * 100; // ~6.67%
        
        // Generar datos de los últimos 6 meses para gráfico
        const lastMonths: MonthFinancialData[] = [];
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const currentMonth = new Date().getMonth();
        
        for (let i = 5; i >= 0; i--) {
          const monthIndex = (currentMonth - i + 12) % 12;
          const monthLabel = monthNames[monthIndex];
          
          // Simular datos históricos con variación gradual
          const baseRevenue = previousRevenue * (1 - (5 - i) * 0.015);
          const baseExpenses = previousExpenses * (1 - (5 - i) * 0.01);
          
          lastMonths.push({
            monthLabel,
            revenue: Math.round(baseRevenue * (0.96 + Math.random() * 0.08) * 100) / 100,
            expenses: Math.round(baseExpenses * (0.96 + Math.random() * 0.08) * 100) / 100,
          });
        }
        
        // El último mes debe ser el mes actual
        lastMonths[lastMonths.length - 1] = {
          monthLabel: monthNames[currentMonth],
          revenue: revenueMonth,
          expenses: expensesMonth,
        };
        
        resolve({
          revenueMonth,
          expensesMonth,
          profitMonth,
          revenueVariation: Math.round(revenueVariation * 100) / 100,
          profitVariation: Math.round(profitVariation * 100) / 100,
          lastMonths,
        });
      }
    }, 400);
  });
}

