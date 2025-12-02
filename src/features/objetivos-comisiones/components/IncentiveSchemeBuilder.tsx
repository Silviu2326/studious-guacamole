// Componente para crear y editar esquemas de incentivos
import React, { useState } from 'react';
import { Card, Button, Input, Select, Modal } from '../../../components/componentsreutilizables';
import { Plus, X } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import type { IncentiveScheme, IncentiveSchemeType, CalculationType, KPIType, PeriodType } from '../types';

interface IncentiveSchemeBuilderProps {
  schemeId?: string | null;
  onSave: () => void;
  initialData?: IncentiveScheme;
  onCancel?: () => void;
}

export const IncentiveSchemeBuilder: React.FC<IncentiveSchemeBuilderProps> = ({
  schemeId,
  onSave,
  initialData,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [schemeType, setSchemeType] = useState<IncentiveSchemeType | ''>(
    initialData?.type || ''
  );
  const [name, setName] = useState(initialData?.name || '');
  const [status, setStatus] = useState<'active' | 'inactive'>(
    initialData?.status || 'active'
  );
  const [calculationType, setCalculationType] = useState<CalculationType>(
    (initialData?.rules.calculation.type as CalculationType) || 'percentage'
  );
  const [calculationValue, setCalculationValue] = useState<string>(
    initialData?.rules.calculation.value?.toString() || ''
  );
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    initialData?.applies_to_roles || []
  );
  const [productId, setProductId] = useState<string>(
    'target_product_id' in (initialData?.rules || {}) ? (initialData.rules as any).target_product_id : ''
  );
  const [kpiType, setKpiType] = useState<KPIType>(
    'target_kpi' in (initialData?.rules || {}) ? (initialData.rules as any).target_kpi : 'nps_avg'
  );
  const [kpiThreshold, setKpiThreshold] = useState<string>(
    'target_kpi' in (initialData?.rules || {})
      ? (initialData.rules as any).threshold?.value?.toString() || ''
      : ''
  );
  const [kpiOperator, setKpiOperator] = useState<'gte' | 'lte' | 'eq'>(
    'target_kpi' in (initialData?.rules || {})
      ? (initialData.rules as any).threshold?.operator || 'gte'
      : 'gte'
  );
  const [period, setPeriod] = useState<PeriodType>(
    'target_kpi' in (initialData?.rules || {}) ? (initialData.rules as any).period : 'monthly'
  );
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = [
    { value: 'sales', label: 'Ventas' },
    { value: 'front-desk', label: 'Recepción' },
    { value: 'trainer', label: 'Entrenador' },
    { value: 'manager', label: 'Gerente' },
  ];

  const kpiOptions = [
    { value: 'nps_avg', label: 'NPS Promedio' },
    { value: 'retention_rate', label: 'Tasa de Retención' },
    { value: 'team_performance', label: 'Rendimiento de Equipo' },
  ];

  const periodOptions = [
    { value: 'monthly', label: 'Mensual' },
    { value: 'quarterly', label: 'Trimestral' },
    { value: 'yearly', label: 'Anual' },
  ];

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!name.trim()) errors.name = 'El nombre es obligatorio';
      if (!schemeType) errors.type = 'Debes seleccionar un tipo de esquema';
    }

    if (step === 2) {
      if (!calculationValue || Number(calculationValue) <= 0) {
        errors.calculationValue = 'El valor debe ser mayor a 0';
      }
      if (calculationType === 'percentage' && Number(calculationValue) > 100) {
        errors.calculationValue = 'El porcentaje no puede ser mayor a 100';
      }
    }

    if (step === 3) {
      if (schemeType === 'commission' && !productId.trim()) {
        errors.productId = 'Debes seleccionar un producto';
      }
      if (schemeType === 'bonus') {
        if (!kpiThreshold || Number(kpiThreshold) <= 0) {
          errors.kpiThreshold = 'El umbral debe ser mayor a 0';
        }
      }
      if (selectedRoles.length === 0) {
        errors.roles = 'Debes seleccionar al menos un rol';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSave = async () => {
    if (!validateStep(3)) return;

    setIsLoading(true);

    try {
      // El onSave se llama desde la página principal que maneja la API
      onSave();
    } catch (error) {
      console.error('Error al guardar esquema:', error);
      setIsLoading(false);
    }
  };

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  return (
    <div className="space-y-6">
      {/* Indicador de pasos */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step === currentStep
                  ? 'bg-blue-600 text-white'
                  : step < currentStep
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step < currentStep ? '✓' : step}
            </div>
            {step < 3 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Paso 1: Información básica */}
      {currentStep === 1 && (
        <Card padding="lg" className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">
            Información Básica
          </h3>

          <Input
            label="Nombre del Esquema"
            placeholder="Ej: Comisión Membresía Anual"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={validationErrors.name}
            required
          />

          <Select
            label="Tipo de Esquema"
            options={[
              { value: 'commission', label: 'Comisión por Venta' },
              { value: 'bonus', label: 'Bonus por KPI' },
            ]}
            value={schemeType}
            onChange={(e) => setSchemeType(e.target.value as IncentiveSchemeType)}
            error={validationErrors.type}
            required
          />

          <Select
            label="Estado"
            options={[
              { value: 'active', label: 'Activo' },
              { value: 'inactive', label: 'Inactivo' },
            ]}
            value={status}
            onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
          />
        </Card>
      )}

      {/* Paso 2: Cálculo */}
      {currentStep === 2 && (
        <Card padding="lg" className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">
            Regla de Cálculo
          </h3>

          <Select
            label="Tipo de Cálculo"
            options={[
              { value: 'percentage', label: 'Porcentaje (%)' },
              { value: 'fixed', label: 'Monto Fijo (€)' },
            ]}
            value={calculationType}
            onChange={(e) => setCalculationType(e.target.value as CalculationType)}
            required
          />

          <Input
            label={calculationType === 'percentage' ? 'Porcentaje (%)' : 'Monto Fijo (€)'}
            type="number"
            placeholder={calculationType === 'percentage' ? '10' : '250'}
            value={calculationValue}
            onChange={(e) => setCalculationValue(e.target.value)}
            error={validationErrors.calculationValue}
            required
            min="0"
            max={calculationType === 'percentage' ? '100' : undefined}
          />
        </Card>
      )}

      {/* Paso 3: Configuración específica */}
      {currentStep === 3 && (
        <Card padding="lg" className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">
            {schemeType === 'commission' ? 'Producto y Roles' : 'KPI y Roles'}
          </h3>

          {schemeType === 'commission' ? (
            <Input
              label="ID del Producto"
              placeholder="prod_abc"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              error={validationErrors.productId}
              helperText="ID del producto o servicio al que aplica la comisión"
              required
            />
          ) : (
            <>
              <Select
                label="KPI a Medir"
                options={kpiOptions}
                value={kpiType}
                onChange={(e) => setKpiType(e.target.value as KPIType)}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Operador"
                  options={[
                    { value: 'gte', label: 'Mayor o igual (≥)' },
                    { value: 'lte', label: 'Menor o igual (≤)' },
                    { value: 'eq', label: 'Igual a (=)' },
                  ]}
                  value={kpiOperator}
                  onChange={(e) => setKpiOperator(e.target.value as 'gte' | 'lte' | 'eq')}
                  required
                />

                <Input
                  label="Umbral"
                  type="number"
                  placeholder="90"
                  value={kpiThreshold}
                  onChange={(e) => setKpiThreshold(e.target.value)}
                  error={validationErrors.kpiThreshold}
                  required
                  min="0"
                />
              </div>

              <Select
                label="Período de Evaluación"
                options={periodOptions}
                value={period}
                onChange={(e) => setPeriod(e.target.value as PeriodType)}
                required
              />
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Roles Aplicables {validationErrors.roles && (
                <span className="text-red-600 ml-1">*</span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {roleOptions.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => toggleRole(role.value)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedRoles.includes(role.value)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
            {validationErrors.roles && (
              <p className="text-sm text-red-600 mt-1">{validationErrors.roles}</p>
            )}
          </div>
        </Card>
      )}

      {/* Botones de navegación */}
      <div className="flex justify-between">
        <div>
          {currentStep > 1 && (
            <Button variant="secondary" onClick={handlePrevious}>
              Anterior
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          {currentStep < 3 ? (
            <Button variant="primary" onClick={handleNext}>
              Siguiente
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSave} loading={isLoading}>
              {schemeId ? 'Actualizar' : 'Crear'} Esquema
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

