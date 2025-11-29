// Tipos para importación de transacciones bancarias desde CSV

/**
 * ============================================================================
 * TIPOS BASE DEL MÓDULO DE TRANSACCIONES BANCARIAS
 * ============================================================================
 * Estos tipos son utilizados principalmente en:
 * - BankCSVImport: Componente para importar transacciones desde CSV
 * - GestorGastosDeducibles: Para relacionar gastos con transacciones bancarias
 * - FinancialDashboard: Para visualización de movimientos bancarios
 * - TaxCalculator: Para cálculos fiscales basados en transacciones
 * ============================================================================
 */

import { ExpenseCategory } from './expenses';

/**
 * Tipo de transacción bancaria
 * Utilizado en: BankCSVImport, FinancialDashboard
 */
export type TransactionType = 
  | 'ingreso'              // Ingreso de dinero
  | 'gasto'                // Gasto/pago
  | 'transferencia_interna' // Transferencia entre cuentas propias
  | 'comision'             // Comisión bancaria
  | 'otro';                // Otro tipo de transacción

/**
 * Cuenta bancaria
 * Utilizado en: BankCSVImport, FinancialDashboard
 */
export interface BankAccount {
  id: string; // ID único de la cuenta
  alias: string; // Nombre descriptivo de la cuenta (ej: "Cuenta Principal", "Cuenta Nómina")
  ibanOpcional?: string; // IBAN de la cuenta (opcional)
  entidad: string; // Nombre de la entidad bancaria
  ultimoSaldoConocidoOpcional?: number; // Último saldo conocido (opcional, para conciliación)
}

/**
 * Transacción bancaria parseada del CSV (tipo intermedio)
 * Utilizado en: csvParser.ts para transacciones parseadas antes de normalización
 */
export interface ParsedBankTransaction {
  fecha: Date;
  concepto: string; // Concepto/descripción de la transacción
  importe: number; // Importe (siempre positivo, normalizado)
  tipo: 'ingreso' | 'egreso'; // Tipo simplificado
  referencia?: string;
  saldo?: number;
  banco?: string;
  cuenta?: string;
  notas?: string;
  categoria?: ExpenseCategory; // Categoría sugerida (añadida durante el parsing)
  deducible?: boolean; // Si es deducible (añadido durante el parsing)
}

/**
 * Transacción bancaria completa
 * Utilizado en: BankCSVImport, GestorGastosDeducibles, FinancialDashboard, TaxCalculator
 */
export interface BankTransaction {
  id: string; // ID único de la transacción
  bankAccountId: string; // ID de la cuenta bancaria asociada
  fecha: Date; // Fecha de la transacción
  descripcion: string; // Descripción/concepto de la transacción
  importe: number; // Importe (positivo para ingresos, negativo para gastos)
  transactionType: TransactionType; // Tipo de transacción
  categoriaSugeridaOpcional?: ExpenseCategory; // Categoría sugerida para el gasto (si aplica)
  conciliada: boolean; // Indica si la transacción ha sido conciliada con un gasto
  expenseIdRelacionadoOpcional?: string; // ID del gasto relacionado (si existe)
  // Campos adicionales para compatibilidad y funcionalidad extendida
  referencia?: string; // Referencia bancaria
  saldo?: number; // Saldo después de la transacción
  notas?: string; // Notas adicionales
  banco?: string; // Nombre del banco (legacy, usar bankAccountId)
  cuenta?: string; // Nombre de la cuenta (legacy, usar bankAccountId)
  // Campos legacy para compatibilidad con código existente
  concepto?: string; // Alias de descripcion (legacy)
  tipo?: 'ingreso' | 'egreso'; // Alias de transactionType (legacy)
}

export interface CSVColumnMapping {
  fecha: string | null; // Nombre de la columna en el CSV
  concepto: string | null;
  importe: string | null;
  tipo: string | null; // Opcional, puede inferirse del signo del importe
  referencia: string | null;
  saldo: string | null;
  banco: string | null;
  cuenta: string | null;
}

export interface CSVParseResult {
  rows: Record<string, any>[]; // Filas parseadas del CSV
  columns: string[]; // Nombres de columnas detectadas
  errors: string[]; // Errores de parsing
}

export interface TransactionImportPreview {
  transaction: BankTransaction | ParsedBankTransaction; // Acepta ambos tipos para compatibilidad
  isDuplicate: boolean;
  duplicateReason?: string;
  suggestedCategory?: string;
  confidence?: number; // 0-1, confianza en la categorización
  errors?: string[];
  warnings?: string[];
}

export interface ImportResult {
  imported: number;
  duplicates: number;
  errors: number;
  transactions: BankTransaction[];
  errorsDetails: Array<{
    row: number;
    error: string;
  }>;
}

export interface CategorySuggestion {
  categoria: string;
  confidence: number;
  reason: string; // Por qué se sugiere esta categoría
}

// Configuración guardada de mapeo de columnas para bancos específicos
export interface BankMappingConfig {
  id: string;
  bankName: string;
  mapping: CSVColumnMapping;
  dateFormat?: string; // Formato de fecha esperado (ej: 'DD/MM/YYYY', 'YYYY-MM-DD')
  decimalSeparator?: ',' | '.'; // Separador decimal
  thousandsSeparator?: ',' | '.' | ' '; // Separador de miles
  encoding?: string; // Codificación del archivo (ej: 'utf-8', 'latin1')
}

