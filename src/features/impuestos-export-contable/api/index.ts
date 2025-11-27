/**
 * ============================================================================
 * ARCHIVO BARREL DE LA API DEL MÓDULO IMPUESTOS-EXPORT-CONTABLE
 * ============================================================================
 * 
 * Este archivo centraliza todas las exportaciones de la API del módulo,
 * facilitando las importaciones desde otros módulos y componentes.
 * 
 * Uso recomendado:
 * ```typescript
 * import { 
 *   generarExportContable, 
 *   getExportHistory,
 *   expensesAPI,
 *   getBankTransactions 
 * } from '../api';
 * ```
 * ============================================================================
 */

// Exportar todos los tipos
export * from './types';

// Exportar funciones y APIs desde api.ts
export {
  // APIs principales
  fiscalProfileApi,
  taxSummaryApi,
  accountingExportApi,
  fiscalCalendarApi,
  annualSummaryApi,
  incomeExpenseChartApi,
  incomeBySourceApi,
  financialDashboardApi,
  perfilFiscalApi,
  resumenFiscalApi,
  
  // Funciones de exportación contable
  generarExportContable,
  getExportHistory,
  
  // Funciones directas de perfil fiscal
  getPerfilFiscal,
  updatePerfilFiscal,
  getResumenFiscalAnual,
  calcularImpuestos,
  
  // Funciones de guía educativa
  getGuiaGastosDeducibles,
  
  // Tipos de exportación contable
  type ExportContableFiltros,
  
  // Tipos de guía educativa
  type GuiaGastosDeducibles,
  type LimiteFiscal,
  type CategoriaEducativa
} from './api';

// Exportar funciones y API desde expenses.ts
export {
  // Funciones individuales de gastos
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  validateExpense,
  
  // API legacy de gastos (compatibilidad)
  expensesAPI
} from './expenses';

// Exportar funciones y tipos desde bankTransactions.ts
export {
  // Funciones de transacciones bancarias
  getBankTransactions,
  importBankTransactions,
  conciliarTransaccion,
  detectarDuplicados,
  saveBankMappingConfig,
  getBankMappingConfigs,
  deleteBankMappingConfig,
  
  // Tipos de transacciones bancarias
  type BankTransactionFilters
} from './bankTransactions';

