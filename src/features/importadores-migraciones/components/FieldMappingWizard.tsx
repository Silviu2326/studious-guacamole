import React, { useState, useEffect } from 'react';
import { Card, Button, Select } from '../../../components/componentsreutilizables';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { TargetField } from '../types';

export interface FieldMappingWizardProps {
  sourceColumns: string[];
  targetFields: TargetField[];
  onSubmit: (mappings: Record<string, string>) => void;
  initialMappings?: Record<string, string>;
}

export const FieldMappingWizard: React.FC<FieldMappingWizardProps> = ({
  sourceColumns,
  targetFields,
  onSubmit,
  initialMappings = {},
}) => {
  const [mappings, setMappings] = useState<Record<string, string>>(initialMappings);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Auto-mapeo inteligente basado en nombres similares
    const autoMappings: Record<string, string> = {};
    
    sourceColumns.forEach(sourceCol => {
      const lowerSource = sourceCol.toLowerCase();
      const targetField = targetFields.find(tf => {
        const lowerTarget = tf.label.toLowerCase();
        return lowerSource.includes(lowerTarget) || lowerTarget.includes(lowerSource) ||
               lowerSource.includes(tf.key.toLowerCase()) || tf.key.toLowerCase().includes(lowerSource);
      });
      
      if (targetField) {
        autoMappings[targetField.key] = sourceCol;
      }
    });
    
    setMappings({ ...autoMappings, ...initialMappings });
  }, [sourceColumns, targetFields]);

  const handleMappingChange = (targetKey: string, sourceColumn: string) => {
    const newMappings = { ...mappings, [targetKey]: sourceColumn };
    setMappings(newMappings);
    
    // Validar campos requeridos
    validateMappings(newMappings);
  };

  const validateMappings = (mappingsToValidate: Record<string, string>) => {
    const newErrors: Record<string, string> = {};
    
    targetFields.forEach(field => {
      if (field.required && !mappingsToValidate[field.key]) {
        newErrors[field.key] = `${field.label} es requerido`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateMappings(mappings)) {
      onSubmit(mappings);
    }
  };

  const requiredFieldsCount = targetFields.filter(f => f.required).length;
  const mappedRequiredFieldsCount = targetFields.filter(f => f.required && mappings[f.key]).length;

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Mapeo de Campos
          </h3>
          <p className="text-gray-600">
            Asocia las columnas de tu archivo con los campos del sistema. Los campos marcados con * son obligatorios.
          </p>
          
          {mappedRequiredFieldsCount < requiredFieldsCount && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">
                  Campos requeridos pendientes
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Debes mapear {requiredFieldsCount - mappedRequiredFieldsCount} campo(s) requerido(s) más antes de continuar.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {targetFields.map(field => {
            const mappedColumn = mappings[field.key];
            const hasError = !!errors[field.key];
            
            return (
              <div key={field.key} className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <Select
                    value={mappedColumn || ''}
                    onChange={(e) => handleMappingChange(field.key, e.target.value)}
                    options={[
                      { value: '', label: 'Selecciona una columna...' },
                      ...sourceColumns.map(col => ({
                        value: col,
                        label: col,
                      })),
                    ]}
                    error={hasError ? errors[field.key] : undefined}
                  />
                </div>
                
                <div className="pt-6">
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Campo del Sistema
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg ring-1 ring-slate-200">
                    <p className="text-sm text-gray-600">
                      {field.key}
                    </p>
                    {field.type && (
                      <p className="text-xs text-gray-500 mt-1">
                        Tipo: {field.type}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={mappedRequiredFieldsCount < requiredFieldsCount}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Confirmar Mapeo
          </Button>
        </div>
      </div>
    </Card>
  );
};

