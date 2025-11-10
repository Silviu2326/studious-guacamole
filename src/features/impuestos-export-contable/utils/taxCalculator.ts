import { TaxCalculation, TaxCalculationSettings } from '../api/types';

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


