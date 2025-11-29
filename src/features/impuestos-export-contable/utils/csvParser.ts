// Utilidades para parsear CSV bancario

import { CSVParseResult, CSVColumnMapping, BankTransaction, TransactionImportPreview, ParsedBankTransaction } from '../types/bankTransactions';
import { CategoriaGasto } from '../types/expenses';

/**
 * Parsea un archivo CSV y extrae las filas y columnas
 */
export async function parseCSV(file: File): Promise<CSVParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const errors: string[] = [];

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim().length > 0);

        if (lines.length === 0) {
          errors.push('El archivo CSV está vacío');
          resolve({ rows: [], columns: [], errors });
          return;
        }

        // Detectar delimitador (coma o punto y coma)
        const firstLine = lines[0];
        const commaCount = (firstLine.match(/,/g) || []).length;
        const semicolonCount = (firstLine.match(/;/g) || []).length;
        const delimiter = semicolonCount > commaCount ? ';' : ',';

        // Parsear headers
        const headers = parseCSVLine(lines[0], delimiter).map(h => h.trim());

        if (headers.length === 0) {
          errors.push('No se pudieron detectar las columnas del CSV');
          resolve({ rows: [], columns: [], errors });
          return;
        }

        // Parsear filas
        const rows: Record<string, any>[] = [];
        for (let i = 1; i < lines.length; i++) {
          try {
            const values = parseCSVLine(lines[i], delimiter);
            if (values.length !== headers.length) {
              errors.push(`Fila ${i + 1}: número de columnas no coincide con los headers`);
              continue;
            }

            const row: Record<string, any> = {};
            headers.forEach((header, index) => {
              row[header] = values[index]?.trim() || '';
            });

            // Solo agregar filas que no estén completamente vacías
            if (Object.values(row).some(v => v && v.toString().trim().length > 0)) {
              rows.push(row);
            }
          } catch (err) {
            errors.push(`Fila ${i + 1}: ${err instanceof Error ? err.message : 'Error desconocido'}`);
          }
        }

        resolve({
          rows,
          columns: headers,
          errors
        });
      } catch (err) {
        reject(new Error(`Error al parsear CSV: ${err instanceof Error ? err.message : 'Error desconocido'}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };

    reader.readAsText(file, 'UTF-8');
  });
}

/**
 * Parsea una línea CSV manejando comillas y delimitadores
 */
function parseCSVLine(line: string, delimiter: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Comilla escapada
        current += '"';
        i++; // Saltar la siguiente comilla
      } else {
        // Inicio o fin de campo entre comillas
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      // Fin del campo
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  // Agregar el último campo
  values.push(current);

  return values;
}

/**
 * Mapea las filas del CSV a transacciones bancarias usando el mapeo de columnas
 * 
 * @param rows - Filas parseadas del CSV
 * @param mapping - Mapeo de columnas CSV a campos de transacción
 * @param dateFormat - Formato de fecha opcional (ej: 'DD/MM/YYYY')
 * @returns Array de transacciones parseadas (tipo intermedio, no BankTransaction completo)
 * 
 * Nota: Esta función devuelve ParsedBankTransaction, que luego debe convertirse
 * a BankTransaction usando importBankTransactions() o similar.
 */
export function mapCSVToTransactions(
  rows: Record<string, any>[],
  mapping: CSVColumnMapping,
  dateFormat?: string
): ParsedBankTransaction[] {
  const transactions: ParsedBankTransaction[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    try {
      // Extraer fecha
      let fecha: Date;
      if (mapping.fecha && row[mapping.fecha]) {
        fecha = parseDate(row[mapping.fecha], dateFormat);
      } else {
        throw new Error('Fecha no encontrada');
      }

      // Extraer concepto
      const concepto = mapping.concepto && row[mapping.concepto]
        ? String(row[mapping.concepto]).trim()
        : 'Sin concepto';

      // Extraer importe
      let importe: number;
      if (mapping.importe && row[mapping.importe]) {
        importe = parseAmount(row[mapping.importe]);
      } else {
        throw new Error('Importe no encontrado');
      }

      // Determinar tipo (ingreso o egreso)
      let tipo: 'ingreso' | 'egreso';
      if (mapping.tipo && row[mapping.tipo]) {
        const tipoStr = String(row[mapping.tipo]).toLowerCase().trim();
        tipo = tipoStr.includes('ingreso') || tipoStr.includes('credito') || tipoStr.includes('abono') || tipoStr === '+' || importe > 0
          ? 'ingreso'
          : 'egreso';
      } else {
        // Inferir del signo del importe
        tipo = importe >= 0 ? 'ingreso' : 'egreso';
        importe = Math.abs(importe); // Normalizar a positivo
      }

      // Extraer campos opcionales
      const referencia = mapping.referencia && row[mapping.referencia]
        ? String(row[mapping.referencia]).trim()
        : undefined;

      const saldo = mapping.saldo && row[mapping.saldo]
        ? parseAmount(row[mapping.saldo])
        : undefined;

      const banco = mapping.banco && row[mapping.banco]
        ? String(row[mapping.banco]).trim()
        : undefined;

      const cuenta = mapping.cuenta && row[mapping.cuenta]
        ? String(row[mapping.cuenta]).trim()
        : undefined;

      transactions.push({
        fecha,
        concepto,
        importe,
        tipo,
        referencia,
        saldo,
        banco,
        cuenta
      });
    } catch (err) {
      console.warn(`Error al mapear fila ${i + 1}:`, err);
      // Continuar con la siguiente fila
    }
  }

  return transactions;
}

/**
 * Parsea una fecha desde un string con varios formatos comunes
 */
function parseDate(dateStr: string, format?: string): Date {
  const str = dateStr.trim();

  // Intentar parsear con formatos comunes
  const formats = format
    ? [format]
    : [
      'DD/MM/YYYY',
      'DD-MM-YYYY',
      'YYYY-MM-DD',
      'YYYY/MM/DD',
      'DD.MM.YYYY',
      'YYYY.MM.DD'
    ];

  for (const fmt of formats) {
    try {
      if (fmt === 'DD/MM/YYYY' || fmt === 'DD-MM-YYYY' || fmt === 'DD.MM.YYYY') {
        const parts = str.split(/[-\/.]/);
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const year = parseInt(parts[2], 10);
          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            const date = new Date(year, month, day);
            if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
              return date;
            }
          }
        }
      } else if (fmt === 'YYYY-MM-DD' || fmt === 'YYYY/MM/DD' || fmt === 'YYYY.MM.DD') {
        const parts = str.split(/[-\/.]/);
        if (parts.length === 3) {
          const year = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const day = parseInt(parts[2], 10);
          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            const date = new Date(year, month, day);
            if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
              return date;
            }
          }
        }
      }
    } catch (err) {
      // Continuar con el siguiente formato
    }
  }

  // Intentar parseo directo como último recurso
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }

  throw new Error(`No se pudo parsear la fecha: ${str}`);
}

/**
 * Parsea un importe desde un string, manejando separadores decimales y de miles
 */
function parseAmount(amountStr: string): number {
  const str = String(amountStr).trim().replace(/[€$]/g, ''); // Eliminar símbolos de moneda

  // Detectar formato: si tiene punto y coma, asumir formato europeo (coma decimal)
  // Si solo tiene coma o punto, intentar detectar
  const hasComma = str.includes(',');
  const hasDot = str.includes('.');

  let cleaned: string;
  if (hasComma && hasDot) {
    // Tiene ambos: el último es el decimal
    const lastComma = str.lastIndexOf(',');
    const lastDot = str.lastIndexOf('.');
    if (lastComma > lastDot) {
      // Coma es decimal, punto es miles
      cleaned = str.replace(/\./g, '').replace(',', '.');
    } else {
      // Punto es decimal, coma es miles
      cleaned = str.replace(/,/g, '');
    }
  } else if (hasComma) {
    // Solo coma: puede ser decimal o miles
    // Si hay más de una coma, es separador de miles
    const commaCount = (str.match(/,/g) || []).length;
    if (commaCount > 1 || (commaCount === 1 && str.split(',')[1].length !== 2 && str.split(',')[1].length !== 3)) {
      // Probablemente separador de miles o formato no estándar
      cleaned = str.replace(/,/g, '');
    } else {
      // Probablemente decimal
      cleaned = str.replace(',', '.');
    }
  } else if (hasDot) {
    // Solo punto: puede ser decimal o miles
    const dotCount = (str.match(/\./g) || []).length;
    if (dotCount > 1) {
      // Probablemente separador de miles
      cleaned = str.replace(/\./g, '');
    } else {
      // Probablemente decimal
      cleaned = str;
    }
  } else {
    // Sin separadores
    cleaned = str;
  }

  const amount = parseFloat(cleaned);
  if (isNaN(amount)) {
    throw new Error(`No se pudo parsear el importe: ${amountStr}`);
  }

  return amount;
}

/**
 * Detecta duplicados comparando transacciones con las existentes
 */
export function detectDuplicates(
  newTransactions: BankTransaction[],
  existingTransactions: BankTransaction[]
): TransactionImportPreview[] {
  const previews: TransactionImportPreview[] = [];

  for (const transaction of newTransactions) {
    const isDuplicate = existingTransactions.some(existing => {
      // Comparar por fecha, importe y concepto (con tolerancia)
      const dateDiff = Math.abs(transaction.fecha.getTime() - existing.fecha.getTime());
      const amountDiff = Math.abs(transaction.importe - existing.importe);
      const conceptSimilar = transaction.concepto.toLowerCase().includes(existing.concepto.toLowerCase().substring(0, 10)) ||
        existing.concepto.toLowerCase().includes(transaction.concepto.toLowerCase().substring(0, 10));

      // Considerar duplicado si:
      // - Misma fecha (mismo día)
      // - Mismo importe (con tolerancia de 0.01)
      // - Concepto similar
      return dateDiff < 24 * 60 * 60 * 1000 && // Mismo día
        amountDiff < 0.01 &&
        (conceptSimilar || transaction.referencia === existing.referencia);
    });

    previews.push({
      transaction,
      isDuplicate,
      duplicateReason: isDuplicate
        ? 'Transacción similar encontrada (misma fecha, importe y concepto)'
        : undefined
    });
  }

  return previews;
}

/**
 * Parsea texto CSV y devuelve un array de objetos normalizados
 * 
 * @param csvText - Texto CSV completo
 * @param delimiter - Separador de columnas (por defecto: ',' o ';' detectado automáticamente)
 * @returns Array de objetos con las filas parseadas
 * 
 * Ejemplo de uso:
 * ```typescript
 * const csvText = `fecha,concepto,importe
 * 01/01/2024,Compra Amazon,150.00
 * 02/01/2024,Pago cliente,500.00`;
 * 
 * const rows = parseCSVText(csvText);
 * // Resultado: [
 * //   { fecha: '01/01/2024', concepto: 'Compra Amazon', importe: '150.00' },
 * //   { fecha: '02/01/2024', concepto: 'Pago cliente', importe: '500.00' }
 * // ]
 * ```
 */
export function parseCSVText(
  csvText: string,
  delimiter?: string
): Record<string, any>[] {
  const lines = csvText.split('\n').filter(line => line.trim().length > 0);

  if (lines.length === 0) {
    return [];
  }

  // Detectar delimitador si no se proporciona
  if (!delimiter) {
    const firstLine = lines[0];
    const commaCount = (firstLine.match(/,/g) || []).length;
    const semicolonCount = (firstLine.match(/;/g) || []).length;
    delimiter = semicolonCount > commaCount ? ';' : ',';
  }

  // Parsear headers
  const headers = parseCSVLine(lines[0], delimiter).map(h => h.trim());

  if (headers.length === 0) {
    return [];
  }

  // Parsear filas
  const rows: Record<string, any>[] = [];
  for (let i = 1; i < lines.length; i++) {
    try {
      let values = parseCSVLine(lines[i], delimiter);
      if (values.length !== headers.length) {
        // Intentar ajustar si hay diferencia menor
        if (Math.abs(values.length - headers.length) <= 1) {
          // Rellenar o truncar según sea necesario
          while (values.length < headers.length) {
            values.push('');
          }
          values = values.slice(0, headers.length);
        } else {
          console.warn(`Fila ${i + 1}: número de columnas no coincide (${values.length} vs ${headers.length})`);
          continue;
        }
      }

      const row: Record<string, any> = {};
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim() || '';
      });

      // Solo agregar filas que no estén completamente vacías
      if (Object.values(row).some(v => v && v.toString().trim().length > 0)) {
        rows.push(row);
      }
    } catch (err) {
      console.warn(`Error al parsear fila ${i + 1}:`, err);
    }
  }

  return rows;
}

/**
 * Sugiere categorías para transacciones basándose en palabras clave y patrones conocidos
 * 
 * Incluye lógica mock de categorización automática con ejemplos específicos:
 * - Amazon → software/material según el contexto
 * - Tiendas conocidas → categorías apropiadas
 * - Servicios digitales → software
 * 
 * @param concepto - Descripción/concepto de la transacción
 * @param importe - Importe de la transacción
 * @param tipo - Tipo de transacción ('ingreso' o 'egreso')
 * @returns Objeto con categoría sugerida, confianza y razón
 * 
 * Ejemplo de uso:
 * ```typescript
 * const suggestion = suggestCategory('Compra Amazon Prime', 99.99, 'egreso');
 * // Resultado: { categoria: 'software', confidence: 0.9, reason: 'Amazon Prime detectado' }
 * ```
 */
export function suggestCategory(concepto: string, importe: number, tipo: 'ingreso' | 'egreso'): {
  categoria: CategoriaGasto | 'ingreso';
  confidence: number;
  reason: string;
} {
  const conceptoLower = concepto.toLowerCase();

  // Si es un ingreso, no necesita categoría de gasto
  if (tipo === 'ingreso') {
    return {
      categoria: 'ingreso' as any,
      confidence: 1.0,
      reason: 'Es un ingreso, no requiere categoría de gasto'
    };
  }

  // Patrones específicos de empresas/servicios conocidos (alta confianza)
  const specificPatterns: Array<{
    pattern: RegExp | string;
    categoria: CategoriaGasto;
    confidence: number;
    reason: string;
  }> = [
      // Amazon - puede ser software (suscripciones) o materiales (compras físicas)
      {
        pattern: /amazon\s*(prime|aws|cloud|web\s*services)/i,
        categoria: 'software',
        confidence: 0.95,
        reason: 'Amazon Prime/AWS detectado → categoría software'
      },
      {
        pattern: /amazon/i,
        categoria: 'materiales', // Por defecto, compras físicas
        confidence: 0.85,
        reason: 'Amazon detectado → categoría materiales (compra física)'
      },
      // Servicios de software y suscripciones
      {
        pattern: /(netflix|spotify|adobe|microsoft|office\s*365|google\s*workspace|slack|zoom|teams)/i,
        categoria: 'software',
        confidence: 0.9,
        reason: 'Servicio de suscripción digital detectado'
      },
      // Plataformas de marketing
      {
        pattern: /(facebook|instagram|linkedin|twitter|tiktok|youtube|ads|adwords|advertising)/i,
        categoria: 'marketing',
        confidence: 0.9,
        reason: 'Plataforma de marketing/publicidad detectada'
      },
      // Servicios de transporte
      {
        pattern: /(uber|taxi|cabify|bolt|lyft|parking|peaje|gasolina|combustible|repostaje)/i,
        categoria: 'transporte',
        confidence: 0.9,
        reason: 'Servicio de transporte detectado'
      },
      // Certificaciones y formación
      {
        pattern: /(certificación|certificado|nasm|ace|acsm|curso|workshop|seminario|formación)/i,
        categoria: 'certificaciones',
        confidence: 0.85,
        reason: 'Certificación o formación detectada'
      },
      // Equipamiento deportivo
      {
        pattern: /(decatlon|nike|adidas|reebok|pesa|mancuerna|máquina|equipo|gym|fitness)/i,
        categoria: 'equipamiento',
        confidence: 0.85,
        reason: 'Equipamiento deportivo detectado'
      }
    ];

  // Verificar patrones específicos primero (mayor prioridad)
  for (const pattern of specificPatterns) {
    const regex = typeof pattern.pattern === 'string'
      ? new RegExp(pattern.pattern, 'i')
      : pattern.pattern;

    if (regex.test(conceptoLower)) {
      return {
        categoria: pattern.categoria,
        confidence: pattern.confidence,
        reason: pattern.reason
      };
    }
  }

  // Palabras clave por categoría (búsqueda general)
  const keywords: Record<CategoriaGasto, string[]> = {
    equipamiento: ['pesa', 'mancuerna', 'máquina', 'equipo', 'material', 'aparato', 'gym', 'fitness', 'dumbbell', 'barbell'],
    certificaciones: ['certificación', 'certificado', 'curso', 'formación', 'licencia', 'acreditación', 'nasm', 'ace'],
    marketing: ['publicidad', 'marketing', 'instagram', 'facebook', 'anuncio', 'promoción', 'foto', 'fotografía', 'ads', 'adwords'],
    transporte: ['gasolina', 'combustible', 'parking', 'peaje', 'taxi', 'uber', 'transporte', 'viaje', 'repostaje'],
    materiales: ['material', 'consumible', 'toalla', 'suplemento', 'proteína', 'bebida', 'suplementos'],
    software: ['software', 'suscripción', 'app', 'aplicación', 'sistema', 'plataforma', 'saas', 'cloud', 'aws', 'azure'],
    seguros: ['seguro', 'póliza', 'aseguranza', 'insurance'],
    alquiler: ['alquiler', 'renta', 'arriendo', 'local', 'espacio', 'oficina', 'rent'],
    servicios_profesionales: ['contabilidad', 'gestor', 'abogado', 'asesor', 'consultor', 'diseño', 'abogacía'],
    formacion: ['curso', 'workshop', 'seminario', 'congreso', 'formación', 'educación', 'training'],
    comunicaciones: ['teléfono', 'internet', 'wifi', 'fibra', 'móvil', 'comunicación', 'phone', 'mobile'],
    dietas: ['comida', 'restaurante', 'dieta', 'almuerzo', 'cena', 'desayuno', 'restaurant'],
    vestimenta: ['ropa', 'camiseta', 'pantalón', 'zapatilla', 'calzado', 'uniforme', 'clothing'],
    otros: []
  };

  // Buscar coincidencias por palabras clave
  let bestMatch: CategoriaGasto = 'otros';
  let bestScore = 0;
  let bestReason = 'No se encontraron coincidencias';

  for (const [categoria, palabras] of Object.entries(keywords)) {
    const matches = palabras.filter(palabra => conceptoLower.includes(palabra));
    if (matches.length > 0) {
      const score = matches.length / palabras.length;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = categoria as CategoriaGasto;
        bestReason = `Coincidencias encontradas: ${matches.join(', ')}`;
      }
    }
  }

  // Ajustar confianza basándose en el número de coincidencias
  let confidence = bestMatch === 'otros' ? 0.3 : Math.min(0.9, 0.5 + bestScore * 0.4);

  // Aumentar confianza si hay múltiples palabras clave
  if (bestMatch !== 'otros' && bestScore > 0.3) {
    confidence = Math.min(0.95, confidence + 0.1);
  }

  return {
    categoria: bestMatch,
    confidence,
    reason: bestReason
  };
}

