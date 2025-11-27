// API para importación de transacciones bancarias

import { BankTransaction, ImportResult, CSVColumnMapping, TransactionType, ParsedBankTransaction } from '../types/bankTransactions';
import { GastoDeducible, CrearGastoRequest, ExpenseCategory } from '../types/expenses';
import { expensesAPI } from './expenses';
import { mapCSVToTransactions } from '../utils/csvParser';
import { suggestCategory } from '../utils/csvParser';

const API_BASE_URL = '/api/v1/finance';

// Almacenamiento temporal de transacciones importadas (en producción, esto sería en la BD)
let importedTransactions: BankTransaction[] = [];

/**
 * Filtros para obtener transacciones bancarias
 */
export interface BankTransactionFilters {
  bankAccountId?: string;
  from?: Date;
  to?: Date;
  tipo?: TransactionType;
  conciliada?: boolean; // true = solo conciliadas, false = solo no conciliadas, undefined = todas
}

/**
 * Obtiene transacciones bancarias con filtros opcionales
 * 
 * @param filtros - Filtros opcionales para buscar transacciones
 * @returns Promise con array de transacciones bancarias
 * 
 * Ejemplo de uso:
 * ```typescript
 * // Obtener todas las transacciones
 * const todas = await getBankTransactions();
 * 
 * // Filtrar por cuenta y rango de fechas
 * const filtradas = await getBankTransactions({
 *   bankAccountId: 'account-123',
 *   from: new Date('2024-01-01'),
 *   to: new Date('2024-12-31')
 * });
 * 
 * // Solo transacciones no conciliadas
 * const pendientes = await getBankTransactions({ conciliada: false });
 * ```
 */
export async function getBankTransactions(
  filtros?: BankTransactionFilters
): Promise<BankTransaction[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let transactions = [...importedTransactions];
  
  // Filtrar por cuenta bancaria
  if (filtros?.bankAccountId) {
    transactions = transactions.filter(t => t.bankAccountId === filtros.bankAccountId);
  }
  
  // Filtrar por rango de fechas
  if (filtros?.from) {
    transactions = transactions.filter(t => t.fecha >= filtros.from!);
  }
  
  if (filtros?.to) {
    const toDate = new Date(filtros.to);
    toDate.setHours(23, 59, 59, 999);
    transactions = transactions.filter(t => t.fecha <= toDate);
  }
  
  // Filtrar por tipo de transacción
  if (filtros?.tipo) {
    transactions = transactions.filter(t => t.transactionType === filtros.tipo);
  }
  
  // Filtrar por estado de conciliación
  if (filtros?.conciliada !== undefined) {
    transactions = transactions.filter(t => t.conciliada === filtros.conciliada);
  }
  
  return transactions.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
}

/**
 * Importa transacciones bancarias desde filas CSV parseadas
 * 
 * @param csvRows - Array de objetos parseados del CSV (filas con columnas mapeadas)
 * @param bankAccountId - ID de la cuenta bancaria asociada
 * @returns Promise con array de transacciones bancarias importadas
 * 
 * Ejemplo de uso:
 * ```typescript
 * const csvRows = [
 *   { fecha: '01/01/2024', concepto: 'Compra Amazon', importe: '150.00' },
 *   { fecha: '02/01/2024', concepto: 'Pago cliente', importe: '500.00' }
 * ];
 * const transactions = await importBankTransactions(csvRows, 'account-123');
 * ```
 * 
 * Nota: Esta función usa el parser de CSV para normalizar los datos.
 * Las transacciones se categorizan automáticamente según su descripción.
 */
export async function importBankTransactions(
  csvRows: any[],
  bankAccountId: string
): Promise<BankTransaction[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!csvRows || csvRows.length === 0) {
    return [];
  }
  
  // Crear un mapeo básico desde las claves de la primera fila
  // En producción, esto debería venir del componente de mapeo
  const firstRow = csvRows[0];
  const mapping: CSVColumnMapping = {
    fecha: Object.keys(firstRow).find(k => 
      k.toLowerCase().includes('fecha') || k.toLowerCase().includes('date')
    ) || null,
    concepto: Object.keys(firstRow).find(k => 
      k.toLowerCase().includes('concepto') || 
      k.toLowerCase().includes('descripcion') || 
      k.toLowerCase().includes('description')
    ) || null,
    importe: Object.keys(firstRow).find(k => 
      k.toLowerCase().includes('importe') || 
      k.toLowerCase().includes('amount') || 
      k.toLowerCase().includes('cantidad')
    ) || null,
    tipo: Object.keys(firstRow).find(k => 
      k.toLowerCase().includes('tipo') || k.toLowerCase().includes('type')
    ) || null,
    referencia: Object.keys(firstRow).find(k => 
      k.toLowerCase().includes('referencia') || k.toLowerCase().includes('reference')
    ) || null,
    saldo: null,
    banco: null,
    cuenta: null
  };
  
  // Usar el parser para convertir CSV rows a transacciones
  const parsedTransactions = mapCSVToTransactions(csvRows, mapping);
  
  // Obtener transacciones existentes para detectar duplicados
  const existingTransactions = await getBankTransactions({ bankAccountId });
  
  const imported: BankTransaction[] = [];
  
  for (let i = 0; i < parsedTransactions.length; i++) {
    const parsed = parsedTransactions[i];
    
    try {
      // Verificar duplicados
      const isDuplicate = existingTransactions.some(existing => {
        const dateDiff = Math.abs(parsed.fecha.getTime() - existing.fecha.getTime());
        const amountDiff = Math.abs(Math.abs(parsed.importe) - Math.abs(existing.importe));
        return dateDiff < 24 * 60 * 60 * 1000 && amountDiff < 0.01;
      });
      
      if (isDuplicate) {
        continue; // Saltar duplicados
      }
      
      // Determinar tipo de transacción
      const transactionType: TransactionType = 
        parsed.tipo === 'ingreso' || parsed.importe >= 0 
          ? 'ingreso' 
          : 'gasto';
      
      // Aplicar categorización automática para egresos
      let categoriaSugerida: ExpenseCategory | undefined;
      if (transactionType === 'gasto') {
        const suggestion = suggestCategory(
          parsed.concepto || parsed.descripcion || '',
          Math.abs(parsed.importe),
          'egreso'
        );
        if (suggestion.categoria !== 'otros' && suggestion.confidence > 0.5) {
          categoriaSugerida = suggestion.categoria as ExpenseCategory;
        }
      }
      
      // Crear transacción bancaria normalizada
      const transaction: BankTransaction = {
        id: `bank-txn-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
        bankAccountId,
        fecha: parsed.fecha,
        descripcion: parsed.concepto || 'Sin descripción',
        importe: transactionType === 'ingreso' 
          ? Math.abs(parsed.importe) 
          : -Math.abs(parsed.importe), // Negativo para gastos
        transactionType,
        categoriaSugeridaOpcional: categoriaSugerida,
        conciliada: false,
        expenseIdRelacionadoOpcional: undefined,
        referencia: parsed.referencia,
        saldo: parsed.saldo,
        banco: parsed.banco,
        cuenta: parsed.cuenta,
        notas: parsed.notas,
        // Campos legacy para compatibilidad
        concepto: parsed.concepto,
        tipo: parsed.tipo
      };
      
      importedTransactions.push(transaction);
      imported.push(transaction);
    } catch (err) {
      console.warn(`Error al importar transacción ${i + 1}:`, err);
      // Continuar con la siguiente transacción
    }
  }
  
  return imported;
}

/**
 * Concilia una transacción bancaria con un gasto deducible
 * 
 * @param transactionId - ID de la transacción bancaria a conciliar
 * @param expenseId - ID del gasto deducible con el que se concilia
 * @returns Promise con la transacción bancaria actualizada
 * 
 * Ejemplo de uso:
 * ```typescript
 * const transaction = await conciliarTransaccion('bank-txn-123', 'expense-456');
 * console.log(transaction.conciliada); // true
 * console.log(transaction.expenseIdRelacionadoOpcional); // 'expense-456'
 * ```
 */
export async function conciliarTransaccion(
  transactionId: string,
  expenseId: string
): Promise<BankTransaction> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const transactionIndex = importedTransactions.findIndex(t => t.id === transactionId);
  
  if (transactionIndex === -1) {
    throw new Error(`Transacción con ID ${transactionId} no encontrada`);
  }
  
  // Verificar que el gasto existe
  try {
    const gasto = await expensesAPI.obtenerGasto(expenseId);
    if (!gasto) {
      throw new Error(`Gasto con ID ${expenseId} no encontrado`);
    }
  } catch (err) {
    throw new Error(`Error al verificar el gasto: ${err instanceof Error ? err.message : 'Error desconocido'}`);
  }
  
  // Actualizar la transacción
  const updatedTransaction: BankTransaction = {
    ...importedTransactions[transactionIndex],
    conciliada: true,
    expenseIdRelacionadoOpcional: expenseId
  };
  
  importedTransactions[transactionIndex] = updatedTransaction;
  
  return updatedTransaction;
}

/**
 * Detecta posibles transacciones duplicadas en un array de transacciones
 * 
 * @param transacciones - Array de transacciones a analizar
 * @returns Array de transacciones que son posibles duplicados
 * 
 * Ejemplo de uso:
 * ```typescript
 * const transacciones = await getBankTransactions();
 * const duplicados = detectarDuplicados(transacciones);
 * console.log(`Se encontraron ${duplicados.length} posibles duplicados`);
 * ```
 * 
 * Criterios de detección:
 * - Misma fecha (mismo día)
 * - Mismo importe (con tolerancia de 0.01)
 * - Descripción similar (contiene palabras clave comunes)
 */
export function detectarDuplicados(
  transacciones: BankTransaction[]
): BankTransaction[] {
  const duplicados: BankTransaction[] = [];
  const procesadas = new Set<string>();
  
  for (let i = 0; i < transacciones.length; i++) {
    const t1 = transacciones[i];
    const t1Key = `${t1.id}`;
    
    if (procesadas.has(t1Key)) {
      continue;
    }
    
    for (let j = i + 1; j < transacciones.length; j++) {
      const t2 = transacciones[j];
      const t2Key = `${t2.id}`;
      
      if (procesadas.has(t2Key)) {
        continue;
      }
      
      // Comparar fechas (mismo día)
      const dateDiff = Math.abs(t1.fecha.getTime() - t2.fecha.getTime());
      const mismoDia = dateDiff < 24 * 60 * 60 * 1000;
      
      // Comparar importes (con tolerancia)
      const amountDiff = Math.abs(Math.abs(t1.importe) - Math.abs(t2.importe));
      const mismoImporte = amountDiff < 0.01;
      
      // Comparar descripciones (similitud básica)
      const desc1 = (t1.descripcion || '').toLowerCase();
      const desc2 = (t2.descripcion || '').toLowerCase();
      const descripcionSimilar = 
        desc1.includes(desc2.substring(0, 10)) ||
        desc2.includes(desc1.substring(0, 10)) ||
        (t1.referencia && t2.referencia && t1.referencia === t2.referencia);
      
      // Si cumple los criterios, es un posible duplicado
      if (mismoDia && mismoImporte && descripcionSimilar) {
        if (!duplicados.find(d => d.id === t1.id)) {
          duplicados.push(t1);
          procesadas.add(t1Key);
        }
        if (!duplicados.find(d => d.id === t2.id)) {
          duplicados.push(t2);
          procesadas.add(t2Key);
        }
      }
    }
  }
  
  return duplicados;
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

