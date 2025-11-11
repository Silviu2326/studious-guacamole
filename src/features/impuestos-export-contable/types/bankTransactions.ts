// Tipos para importación de transacciones bancarias desde CSV

export interface BankTransaction {
  id?: string; // ID temporal antes de importar
  fecha: Date;
  concepto: string;
  importe: number; // Puede ser positivo (ingreso) o negativo (egreso)
  tipo: 'ingreso' | 'egreso';
  referencia?: string;
  saldo?: number;
  categoria?: string; // Categoría sugerida o asignada
  deducible?: boolean; // Si es un gasto deducible
  notas?: string;
  banco?: string;
  cuenta?: string;
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
  transaction: BankTransaction;
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

