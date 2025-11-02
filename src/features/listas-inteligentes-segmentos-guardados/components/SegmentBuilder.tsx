import React, { useState } from 'react';
import { Card, Button, Input, Select, Badge } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { SegmentRule } from '../types';
import { Plus, X, Trash2 } from 'lucide-react';

export const SegmentBuilder: React.FC = () => {
  const [rules, setRules] = useState<SegmentRule[]>([]);
  const [segmentName, setSegmentName] = useState('');
  const [description, setDescription] = useState('');

  const fieldOptions = [
    { value: 'age', label: 'Edad' },
    { value: 'gender', label: 'Género' },
    { value: 'membership_type', label: 'Tipo de Membresía' },
    { value: 'membership_expires', label: 'Caducidad Membresía' },
    { value: 'attendance_rate', label: 'Tasa de Asistencia' },
    { value: 'lifetime_value', label: 'Valor de Por Vida' },
    { value: 'days_since_last_visit', label: 'Días Desde Última Visita' },
    { value: 'active_months', label: 'Meses Activos' },
    { value: 'purchase_frequency', label: 'Frecuencia de Compra' }
  ];

  const operatorOptions = [
    { value: 'equals', label: 'Igual a' },
    { value: 'not_equals', label: 'Diferente de' },
    { value: 'contains', label: 'Contiene' },
    { value: 'not_contains', label: 'No contiene' },
    { value: 'greater_than', label: 'Mayor que' },
    { value: 'less_than', label: 'Menor que' },
    { value: 'between', label: 'Entre' },
    { value: 'in', label: 'En lista' },
    { value: 'not_in', label: 'No en lista' }
  ];

  const addRule = () => {
    const newRule: SegmentRule = {
      id: `rule-${Date.now()}`,
      field: 'age',
      operator: 'equals',
      value: '',
      logicalOperator: rules.length > 0 ? 'AND' : undefined
    };
    setRules([...rules, newRule]);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const updateRule = (id: string, updates: Partial<SegmentRule>) => {
    setRules(rules.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const handleSubmit = () => {
    if (!segmentName || rules.length === 0) {
      alert('Por favor completa el nombre y añade al menos una regla');
      return;
    }
    console.log('Creando segmento:', { name: segmentName, description, rules });
    alert('Segmento creado exitosamente (simulado)');
  };

  return (
    <Card padding="lg">
      <div className="space-y-6">
        <div>
          <h3 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
            Constructor de Segmentos
          </h3>
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Crea reglas de segmentación complejas usando múltiples criterios
          </p>
        </div>

        <div className="space-y-4">
          <Input
            label="Nombre del Segmento"
            value={segmentName}
            onChange={(e) => setSegmentName(e.target.value)}
            placeholder="Ej: Mujeres 30-45 con bono a punto de caducar"
          />

          <Input
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción opcional del segmento"
          />

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Reglas de Segmentación
              </label>
              <Button variant="secondary" size="sm" onClick={addRule}>
                <Plus className="w-4 h-4 mr-2" />
                Añadir Regla
              </Button>
            </div>

            <div className="space-y-4">
              {rules.map((rule, index) => (
                <div key={rule.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start gap-3">
                    {index > 0 && (
                      <div className="pt-3">
                        <Select
                          options={[
                            { value: 'AND', label: 'Y (AND)' },
                            { value: 'OR', label: 'O (OR)' }
                          ]}
                          value={rule.logicalOperator || 'AND'}
                          onChange={(e) => updateRule(rule.id, { logicalOperator: e.target.value as 'AND' | 'OR' })}
                          className="w-32"
                          fullWidth={false}
                        />
                      </div>
                    )}

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                      <Select
                        options={fieldOptions}
                        value={rule.field}
                        onChange={(e) => updateRule(rule.id, { field: e.target.value })}
                        placeholder="Campo"
                      />
                      
                      <Select
                        options={operatorOptions}
                        value={rule.operator}
                        onChange={(e) => updateRule(rule.id, { operator: e.target.value as any })}
                        placeholder="Operador"
                      />
                      
                      <Input
                        value={rule.value}
                        onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                        placeholder="Valor"
                        className="col-span-1 md:col-span-2"
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRule(rule.id)}
                      className="mt-1"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}

              {rules.length === 0 && (
                <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
                    No hay reglas definidas. Añade la primera regla para comenzar.
                  </p>
                  <Button variant="secondary" size="md" onClick={addRule}>
                    <Plus className="w-4 h-4 mr-2" />
                    Añadir Primera Regla
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={() => {
              setSegmentName('');
              setDescription('');
              setRules([]);
            }}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Crear Segmento
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

