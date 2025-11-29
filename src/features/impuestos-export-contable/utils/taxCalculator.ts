import { TaxCalculation, TaxCalculationSettings, TramoIRPF } from '../api/types';

/**
 * Calcula los impuestos (IRPF e IVA) según el régimen fiscal y los ingresos/gastos
 */
export function calculateTaxes(
  grossIncome: number,
  deductibleExpenses: number,
  settings: TaxCalculationSettings
): TaxCalculation {
  let vatCollected = 0;
  let vatDeductible = 0;
  let vatNet = 0;
  let taxableBase = 0;
  let irpfAmount = 0;
  let netIncome = 0;
  let totalTaxes = 0;

  // Cálculo de IVA
  if (settings.vatEnabled && settings.vatRate > 0) {
    // IVA repercutido (cobrado a clientes)
    // Si los ingresos brutos ya incluyen IVA, lo extraemos
    // Asumimos que grossIncome ya incluye IVA si está habilitado
    vatCollected = grossIncome - (grossIncome / (1 + settings.vatRate / 100));
    
    // IVA deducible (de gastos)
    // Asumimos que los gastos pueden tener IVA deducible
    // Estimación: 70% de los gastos tienen IVA (ajustable según realidad)
    const expensesWithVat = deductibleExpenses * 0.7;
    vatDeductible = expensesWithVat - (expensesWithVat / (1 + settings.vatRate / 100));
    
    // IVA neto (a pagar o devolver)
    vatNet = vatCollected - vatDeductible;
  }

  // Base imponible para IRPF
  // Para régimen general: ingresos - gastos
  // Para simplificado: se aplica un coeficiente reductor
  if (settings.taxRegime === 'Simplificado') {
    // En régimen simplificado, se aplica un coeficiente reductor (ej: 5% para actividades físicas)
    const reductionCoefficient = 0.05; // 5% de reducción
    taxableBase = (grossIncome - deductibleExpenses) * (1 - reductionCoefficient);
  } else if (settings.taxRegime === 'EstimacionObjetiva') {
    // En estimación objetiva, se usa un módulo base
    // Simplificado: base = ingresos * coeficiente
    const moduleCoefficient = 0.15; // 15% de coeficiente (variable según actividad)
    taxableBase = grossIncome * moduleCoefficient;
  } else if (settings.taxRegime === 'Exento') {
    taxableBase = 0;
  } else {
    // Régimen General
    taxableBase = grossIncome - deductibleExpenses;
  }

  // Cálculo de IRPF
  if (settings.irpfEnabled && settings.irpfRate > 0 && taxableBase > 0) {
    irpfAmount = (taxableBase * settings.irpfRate) / 100;
  }

  // Total de impuestos
  totalTaxes = Math.max(0, vatNet) + irpfAmount;

  // Ingresos netos después de impuestos
  netIncome = grossIncome - deductibleExpenses - totalTaxes;

  return {
    grossIncome,
    deductibleExpenses,
    vatToPay: Math.max(0, vatNet),
    vatCollected,
    vatDeductible,
    vatNet,
    taxableBase,
    irpfAmount,
    netIncome,
    totalTaxes,
    settings
  };
}

/**
 * Obtiene la configuración predeterminada según el régimen fiscal
 */
export function getDefaultTaxSettings(
  taxRegime: string
): TaxCalculationSettings {
  const baseSettings: TaxCalculationSettings = {
    vatRate: 21, // IVA general en España
    vatEnabled: true,
    irpfRate: 15, // IRPF estimado para autónomos (variable según ingresos)
    irpfEnabled: true,
    taxRegime: taxRegime as TaxCalculationSettings['taxRegime']
  };

  // Ajustes según régimen fiscal
  switch (taxRegime) {
    case 'Exento':
      baseSettings.vatEnabled = false;
      baseSettings.irpfEnabled = false;
      break;
    case 'Simplificado':
      // En simplificado, el IVA suele ser el mismo pero hay coeficientes reductores
      baseSettings.vatRate = 21;
      baseSettings.irpfRate = 15;
      break;
    case 'EstimacionObjetiva':
      baseSettings.vatRate = 21;
      baseSettings.irpfRate = 15;
      break;
    default:
      // General
      baseSettings.vatRate = 21;
      baseSettings.irpfRate = 15;
  }

  return baseSettings;
}

/**
 * ============================================================================
 * FUNCIONES PURAS DE CÁLCULO FISCAL
 * ============================================================================
 * Estas funciones implementan la lógica de cálculo de impuestos de forma pura.
 * 
 * NOTA: En producción, estas funciones se conectarían con:
 * - La lógica real del backend que aplica la normativa fiscal vigente
 * - Servicios de cálculo fiscal actualizados según la legislación española
 * - Validación de tramos IRPF según normativa Hacienda
 * - Cálculos de IVA según tipo de actividad y normativa vigente
 * ============================================================================
 */

/**
 * Calcula el IRPF aplicando tramos progresivos
 * 
 * @param ingresos - Total de ingresos del período
 * @param gastos - Total de gastos deducibles del período
 * @param tramos - Array de tramos IRPF con porcentajes progresivos
 * @returns Cantidad de IRPF a pagar
 * 
 * NOTA: En producción, esta función se conectaría con:
 * - La normativa fiscal vigente de Hacienda
 * - Los tramos IRPF oficiales actualizados anualmente
 * - Cálculos específicos según tipo de actividad y régimen fiscal
 */
export function calcularIRPF(
  ingresos: number,
  gastos: number,
  tramos: TramoIRPF[]
): number {
  // Calcular base imponible (ingresos - gastos)
  const baseImponible = Math.max(0, ingresos - gastos);
  
  if (baseImponible <= 0 || tramos.length === 0) {
    return 0;
  }
  
  // Ordenar tramos por 'desde' de menor a mayor
  const tramosOrdenados = [...tramos].sort((a, b) => a.desde - b.desde);
  
  let irpfTotal = 0;
  let baseRestante = baseImponible;
  
  // Aplicar cada tramo progresivamente
  for (let i = 0; i < tramosOrdenados.length && baseRestante > 0; i++) {
    const tramo = tramosOrdenados[i];
    
    // Verificar si la base imponible alcanza este tramo
    if (baseImponible > tramo.desde) {
      // Calcular el rango de este tramo
      const limiteInferior = tramo.desde;
      const limiteSuperior = tramo.hasta !== undefined 
        ? Math.min(tramo.hasta, baseImponible)
        : baseImponible;
      
      // Calcular la base a la que se aplica este tramo
      const baseEnTramo = limiteSuperior - limiteInferior;
      
      if (baseEnTramo > 0) {
        // Aplicar el porcentaje del tramo
        const irpfTramo = (baseEnTramo * tramo.porcentaje) / 100;
        irpfTotal += irpfTramo;
        baseRestante -= baseEnTramo;
      }
    }
  }
  
  return Math.max(0, irpfTotal);
}

/**
 * Calcula el IVA neto a pagar o devolver
 * 
 * @param ivaRepercutido - IVA cobrado a clientes (repercutido)
 * @param ivaSoportado - IVA pagado en gastos (soportado/deducible)
 * @returns Objeto con el resultado del IVA y si es a ingresar o devolver
 * 
 * NOTA: En producción, esta función se conectaría con:
 * - La normativa de IVA vigente según tipo de actividad
 * - Validación de facturas y justificantes
 * - Cálculos específicos según régimen de IVA (general, simplificado, etc.)
 * - Límites y condiciones de deducibilidad según normativa
 */
export function calcularIVA(
  ivaRepercutido: number,
  ivaSoportado: number
): { resultado: number; aIngresar: boolean } {
  const resultado = ivaRepercutido - ivaSoportado;
  
  // Si el resultado es positivo, hay que ingresar IVA
  // Si es negativo, hay derecho a devolución (a ingresar = false)
  return {
    resultado: Math.abs(resultado),
    aIngresar: resultado >= 0
  };
}

/**
 * Calcula las retenciones aplicadas sobre ingresos
 * 
 * @param ingresos - Total de ingresos sobre los que aplicar retención
 * @param porcentaje - Porcentaje de retención a aplicar (ej: 15 para 15%)
 * @returns Cantidad retenida
 * 
 * NOTA: En producción, esta función se conectaría con:
 * - La normativa de retenciones según tipo de actividad
 * - Porcentajes oficiales según normativa vigente
 * - Validación de límites y excepciones según tipo de cliente
 */
export function calcularRetenciones(
  ingresos: number,
  porcentaje: number
): number {
  if (ingresos <= 0 || porcentaje <= 0) {
    return 0;
  }
  
  // Calcular retención: ingresos * porcentaje / 100
  const retencion = (ingresos * porcentaje) / 100;
  
  return Math.max(0, retencion);
}

