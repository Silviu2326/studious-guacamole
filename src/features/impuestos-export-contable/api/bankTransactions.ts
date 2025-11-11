// API para importación de transacciones bancarias

import { BankTransaction, ImportResult, CSVColumnMapping } from '../types/bankTransactions';
import { GastoDeducible, CrearGastoRequest } from '../types/expenses';
import { expensesAPI } from './expenses';

const API_BASE_URL = '/api/v1/finance';

// Almacenamiento temporal de transacciones importadas (en producción, esto sería en la BD)
let importedTransactions: BankTransaction[] = [];

/**
 * Obtiene todas las transacciones bancarias importadas
 */
export async function getBankTransactions(
  from?: Date,
  to?: Date
): Promise<BankTransaction[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let transactions = [...importedTransactions];
  
  if (from) {
    transactions = transactions.filter(t => t.fecha >= from);
  }
  
  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59);
    transactions = transactions.filter(t => t.fecha <= toDate);
  }
  
  return transactions.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
}

/**
 * Importa transacciones bancarias
 */
export async function importBankTransactions(
  transactions: BankTransaction[]
): Promise<ImportResult> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Obtener transacciones existentes para detectar duplicados
  const existingTransactions = await getBankTransactions();
  
  const result: ImportResult = {
    imported: 0,
    duplicates: 0,
    errors: 0,
    transactions: [],
    errorsDetails: []
  };
  
  for (let i = 0; i < transactions.length; i++) {
    const transaction = transactions[i];
    
    try {
      // Verificar duplicados
      const isDuplicate = existingTransactions.some(existing => {
        const dateDiff = Math.abs(transaction.fecha.getTime() - existing.fecha.getTime());
        const amountDiff = Math.abs(transaction.importe - existing.importe);
        return dateDiff < 24 * 60 * 60 * 1000 && amountDiff < 0.01;
      });
      
      if (isDuplicate) {
        result.duplicates++;
        continue;
      }
      
      // Crear ID único
      const id = `bank-txn-${Date.now()}-${i}`;
      const transactionWithId: BankTransaction = {
        ...transaction,
        id
      };
      
      // Si es un egreso y tiene categoría, crear un gasto deducible
      if (transaction.tipo === 'egreso' && transaction.categoria && transaction.deducible) {
        try {
          const gasto: CrearGastoRequest = {
            fecha: transaction.fecha,
            concepto: transaction.concepto,
            importe: transaction.importe,
            categoria: transaction.categoria as any,
            deducible: transaction.deducible,
            notas: transaction.notas || `Importado desde CSV bancario${transaction.referencia ? ` - Ref: ${transaction.referencia}` : ''}`,
            archivosAdjuntos: []
          };
          
          await expensesAPI.crearGasto(gasto);
        } catch (err) {
          console.warn(`Error al crear gasto para transacción ${id}:`, err);
          // Continuar aunque falle la creación del gasto
        }
      }
      
      // Agregar a la lista de transacciones importadas
      importedTransactions.push(transactionWithId);
      result.transactions.push(transactionWithId);
      result.imported++;
    } catch (err) {
      result.errors++;
      result.errorsDetails.push({
        row: i + 1,
        error: err instanceof Error ? err.message : 'Error desconocido'
      });
    }
  }
  
  return result;
}

/**
 * Guarda una configuración de mapeo de columnas para un banco
 */
export async function saveBankMappingConfig(
  bankName: string,
  mapping: CSVColumnMapping
): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción, esto guardaría en la base de datos
  // Por ahora, guardamos en localStorage
  const configs = getBankMappingConfigs();
  const existingIndex = configs.findIndex(c => c.bankName === bankName);
  
  const config = {
    id: existingIndex >= 0 ? configs[existingIndex].id : `config-${Date.now()}`,
    bankName,
    mapping,
    dateFormat: 'DD/MM/YYYY',
    decimalSeparator: ',' as const,
    thousandsSeparator: '.' as const,
    encoding: 'utf-8'
  };
  
  if (existingIndex >= 0) {
    configs[existingIndex] = config;
  } else {
    configs.push(config);
  }
  
  localStorage.setItem('bankMappingConfigs', JSON.stringify(configs));
}

/**
 * Obtiene las configuraciones de mapeo guardadas
 */
export function getBankMappingConfigs() {
  try {
    const stored = localStorage.getItem('bankMappingConfigs');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.warn('Error al cargar configuraciones de mapeo:', err);
  }
  
  return [];
}

/**
 * Elimina una configuración de mapeo
 */
export async function deleteBankMappingConfig(configId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const configs = getBankMappingConfigs();
  const filtered = configs.filter((c: any) => c.id !== configId);
  localStorage.setItem('bankMappingConfigs', JSON.stringify(filtered));
}

