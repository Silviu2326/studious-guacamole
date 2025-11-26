import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Input, Tooltip } from '../../../components/componentsreutilizables';
import { FiscalProfile, TaxSummary, TaxCalculationSettings, TaxCalculation } from '../api/types';
import { calculateTaxes, getDefaultTaxSettings } from '../utils/taxCalculator';
import { Calculator, Info, TrendingDown, DollarSign, AlertCircle, RefreshCw } from 'lucide-react';

interface TaxCalculatorProps {
  fiscalProfile: FiscalProfile | null;
  taxSummary: TaxSummary | null;
  isLoading?: boolean;
}

// Componente helper para términos con tooltip
interface TermWithTooltipProps {
  term: string;
  simpleTerm: string;
  tooltip: string;
  showTechnical?: boolean;
}

const TermWithTooltip: React.FC<TermWithTooltipProps> = ({
  term,
  simpleTerm,
  tooltip,
  showTechnical = true
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="font-medium">{simpleTerm}</span>
      {showTechnical && (
        <span className="text-xs text-gray-500 font-normal">({term})</span>
      )}
      <Tooltip content={tooltip} position="top">
        <Info size={14} className="text-gray-400 hover:text-gray-600 cursor-help" />
      </Tooltip>
    </div>
  );
};

export const TaxCalculator: React.FC<TaxCalculatorProps> = ({
  fiscalProfile,
  taxSummary,
  isLoading = false
}) => {
  // Estado de configuración de impuestos
  const [settings, setSettings] = useState<TaxCalculationSettings>(() => {
    if (fiscalProfile) {
      return getDefaultTaxSettings(fiscalProfile.taxRegime);
    }
    return getDefaultTaxSettings('General');
  });

  // Actualizar configuración cuando cambie el perfil fiscal
  useEffect(() => {
    if (fiscalProfile) {
      const defaultSettings = getDefaultTaxSettings(fiscalProfile.taxRegime);
      setSettings(prev => ({
        ...prev,
        taxRegime: defaultSettings.taxRegime,
        vatEnabled: defaultSettings.vatEnabled,
        irpfEnabled: defaultSettings.irpfEnabled
      }));
    }
  }, [fiscalProfile]);

  // Calcular impuestos cuando cambien los datos o la configuración
  const calculation = useMemo<TaxCalculation | null>(() => {
    if (!taxSummary) return null;
    
    return calculateTaxes(
      taxSummary.totalGross,
      taxSummary.totalExpenses,
      settings
    );
  }, [taxSummary, settings]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: taxSummary?.currency || 'EUR'
    }).format(amount);
  };

  const handleSettingChange = (field: keyof TaxCalculationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const resetToDefaults = () => {
    if (fiscalProfile) {
      setSettings(getDefaultTaxSettings(fiscalProfile.taxRegime));
    }
  };

  if (!taxSummary || !calculation) {
    return (
      <Card className="p-6 bg-white shadow-sm">
        <div className="text-center text-gray-500">
          {isLoading ? 'Cargando datos...' : 'No hay datos disponibles para calcular impuestos'}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <Calculator size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Calculadora de Impuestos
              </h3>
              <p className="text-sm text-gray-600">
                Estimación de IRPF e IVA según tu régimen fiscal
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={resetToDefaults}
            className="text-sm"
          >
            <RefreshCw size={16} className="mr-2" />
            Restaurar valores por defecto
          </Button>
        </div>

        {/* Configuración de impuestos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 p-4 bg-gray-50 rounded-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <TermWithTooltip
                term="IVA"
                simpleTerm="IVA (Impuesto sobre el Valor Añadido)"
                tooltip="Impuesto que se aplica sobre las ventas. Lo cobras a tus clientes y luego lo pagas a Hacienda, descontando el IVA que has pagado en tus gastos."
                showTechnical={true}
              />
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.vatEnabled}
                  onChange={(e) => handleSettingChange('vatEnabled', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Estoy sujeto a IVA</span>
              </div>
              {settings.vatEnabled && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={settings.vatRate}
                    onChange={(e) => handleSettingChange('vatRate', parseFloat(e.target.value) || 0)}
                    className="w-24"
                    min="0"
                    max="100"
                  />
                  <span className="text-sm text-gray-600">%</span>
                  <Tooltip content="Porcentaje de IVA que aplicas a tus servicios. En España, el tipo general es 21%." position="right">
                    <Info size={14} className="text-gray-400 hover:text-gray-600 cursor-help" />
                  </Tooltip>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <TermWithTooltip
                term="IRPF"
                simpleTerm="IRPF (Impuesto sobre la Renta de las Personas Físicas)"
                tooltip="Impuesto que pagas sobre tus beneficios (ingresos menos gastos). Es un porcentaje de tus ganancias que se paga anualmente en la declaración de la renta."
                showTechnical={true}
              />
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.irpfEnabled}
                  onChange={(e) => handleSettingChange('irpfEnabled', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Estoy sujeto a IRPF</span>
              </div>
              {settings.irpfEnabled && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={settings.irpfRate}
                    onChange={(e) => handleSettingChange('irpfRate', parseFloat(e.target.value) || 0)}
                    className="w-24"
                    min="0"
                    max="100"
                  />
                  <span className="text-sm text-gray-600">%</span>
                  <Tooltip content="Porcentaje estimado de IRPF sobre tus beneficios. Varía según tus ingresos anuales. Para autónomos suele estar entre 15% y 30%." position="right">
                    <Info size={14} className="text-gray-400 hover:text-gray-600 cursor-help" />
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Resultados del cálculo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resumen general */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Resumen de Impuestos
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <TermWithTooltip
                term="Total Impuestos"
                simpleTerm="Total a pagar en impuestos"
                tooltip="Suma de todos los impuestos que tendrás que pagar: IVA + IRPF"
              />
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(calculation.totalTaxes)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <TermWithTooltip
                term="Ingresos Netos"
                simpleTerm="Lo que te quedará después de impuestos"
                tooltip="Ingresos brutos menos gastos menos impuestos. Es lo que realmente ganarás."
              />
              <span className="text-xl font-semibold text-blue-600">
                {formatCurrency(calculation.netIncome)}
              </span>
            </div>
          </div>
        </Card>

        {/* Desglose de IVA */}
        {settings.vatEnabled && (
          <Card className="p-6 bg-white shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-green-600" />
              Desglose de IVA
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <TermWithTooltip
                  term="IVA Repercutido"
                  simpleTerm="IVA que cobras a clientes"
                  tooltip="IVA que incluyes en tus facturas y que cobras a tus clientes. Debes ingresarlo a Hacienda."
                />
                <span className="font-medium text-gray-900">
                  {formatCurrency(calculation.vatCollected)}
                </span>
              </div>
              <div className="flex justify-between">
                <TermWithTooltip
                  term="IVA Deducible"
                  simpleTerm="IVA que puedes descontar"
                  tooltip="IVA que has pagado en tus gastos y que puedes descontar del IVA que debes pagar."
                />
                <span className="font-medium text-green-600">
                  -{formatCurrency(calculation.vatDeductible)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <TermWithTooltip
                  term="IVA Neto"
                  simpleTerm="IVA a pagar a Hacienda"
                  tooltip="IVA que finalmente tendrás que pagar a Hacienda (IVA cobrado menos IVA deducible)."
                />
                <span className="font-bold text-gray-900">
                  {formatCurrency(calculation.vatNet)}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Desglose de IRPF */}
        {settings.irpfEnabled && (
          <Card className="p-6 bg-white shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingDown size={20} className="text-orange-600" />
              Desglose de IRPF
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <TermWithTooltip
                  term="Base Imponible"
                  simpleTerm="Beneficios sobre los que se calcula el impuesto"
                  tooltip="Ingresos menos gastos. Es la cantidad sobre la que se calcula el IRPF. En algunos regímenes se aplican coeficientes reductores."
                />
                <span className="font-medium text-gray-900">
                  {formatCurrency(calculation.taxableBase)}
                </span>
              </div>
              <div className="flex justify-between">
                <TermWithTooltip
                  term="Tipo de IRPF"
                  simpleTerm="Porcentaje aplicado"
                  tooltip="Porcentaje de IRPF que se aplica sobre tus beneficios. Puedes ajustarlo manualmente según tu situación."
                />
                <span className="font-medium text-gray-600">
                  {settings.irpfRate}%
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <TermWithTooltip
                  term="IRPF Estimado"
                  simpleTerm="IRPF a pagar (estimado)"
                  tooltip="Cantidad estimada de IRPF que tendrás que pagar en tu declaración anual. Es una estimación basada en el porcentaje configurado."
                />
                <span className="font-bold text-gray-900">
                  {formatCurrency(calculation.irpfAmount)}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Información adicional */}
        <Card className="p-6 bg-amber-50 border border-amber-200 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-2">⚠️ Importante</p>
              <p className="mb-2">
                Esta es una <strong>estimación</strong> basada en los datos y porcentajes que has configurado.
              </p>
              <p>
                Los cálculos reales pueden variar según tu situación específica, deducciones aplicables y normativa fiscal vigente. 
                Te recomendamos consultar con un gestor para una estimación más precisa.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detalles del cálculo */}
      <Card className="p-6 bg-white shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Detalles del Cálculo
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Ingresos Brutos:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(calculation.grossIncome)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Gastos Deducibles:</span>
              <span className="text-sm font-medium text-red-600">
                -{formatCurrency(calculation.deductibleExpenses)}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <span className="text-sm font-medium text-gray-700">Beneficio Bruto:</span>
              <span className="text-sm font-bold text-gray-900">
                {formatCurrency(calculation.grossIncome - calculation.deductibleExpenses)}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Régimen Fiscal:</span>
              <span className="text-sm font-medium text-gray-900">
                {fiscalProfile?.taxRegime || 'General'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">IVA ({settings.vatRate}%):</span>
              <span className="text-sm font-medium text-gray-900">
                {settings.vatEnabled ? formatCurrency(calculation.vatNet) : 'No aplicable'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">IRPF ({settings.irpfRate}%):</span>
              <span className="text-sm font-medium text-gray-900">
                {settings.irpfEnabled ? formatCurrency(calculation.irpfAmount) : 'No aplicable'}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};


