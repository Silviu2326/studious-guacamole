import React, { useState, useEffect } from 'react';
import { DynamicPricingRule, PricingCondition, PricingAction, TargetAudience } from '../api/pricingRules';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '../../../components/componentsreutilizables';
import { Button } from '../../../components/componentsreutilizables';
import { Card } from '../../../components/componentsreutilizables';

interface RuleBuilderFormProps {
  initialRuleData?: Partial<DynamicPricingRule>;
  onSubmit: (ruleData: Omit<DynamicPricingRule, 'id' | 'createdAt' | 'stats'>) => void;
  onCancel: () => void;
}

/**
 * Formulario complejo y modular para crear o editar una regla de precios dinámicos.
 */
export const RuleBuilderForm: React.FC<RuleBuilderFormProps> = ({
  initialRuleData,
  onSubmit,
  onCancel
}) => {
  const [ruleName, setRuleName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<number>(10);
  const [conditions, setConditions] = useState<PricingCondition[]>([]);
  const [action, setAction] = useState<PricingAction>({
    type: 'percentage_discount',
    value: 10
  });
  const [targetAudience, setTargetAudience] = useState<TargetAudience>({
    type: 'all'
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialRuleData) {
      setRuleName(initialRuleData.name || '');
      setDescription(initialRuleData.description || '');
      setPriority(initialRuleData.priority || 10);
      setConditions(initialRuleData.conditions || []);
      setAction(initialRuleData.action || { type: 'percentage_discount', value: 10 });
      setTargetAudience(initialRuleData.targetAudience || { type: 'all' });
    }
  }, [initialRuleData]);

  const handleAddCondition = () => {
    setConditions([...conditions, {
      type: 'time_of_day',
      from: '10:00',
      to: '14:00',
      days: []
    }]);
  };

  const handleUpdateCondition = (index: number, updates: Partial<PricingCondition>) => {
    setConditions(conditions.map((cond, i) =>
      i === index ? { ...cond, ...updates } : cond
    ));
  };

  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ruleName.trim() || conditions.length === 0) {
      alert('Por favor, completa el nombre y añade al menos una condición');
      return;
    }
    
    setIsLoading(true);
    try {
      const ruleData: Omit<DynamicPricingRule, 'id' | 'createdAt' | 'stats'> = {
        name: ruleName,
        description: description || undefined,
        isActive: true,
        priority,
        conditions,
        action,
        targetAudience
      };
      
      onSubmit(ruleData);
    } catch (error) {
      console.error('Error guardando regla:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={initialRuleData?.id ? 'Editar Regla' : 'Nueva Regla de Precios Dinámicos'}
      size="xl"
      className="max-h-[90vh] overflow-y-auto"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="rule-form"
            disabled={isLoading}
            loading={isLoading}
          >
            Guardar Regla
          </Button>
        </div>
      }
    >
      <form id="rule-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre y Descripción */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre de la Regla *
              </label>
              <input
                type="text"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                placeholder="Ej: Descuento Horas Valle"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Prioridad (menor = mayor prioridad)
              </label>
              <input
                type="number"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
              rows={2}
              placeholder="Describe el objetivo de esta regla..."
            />
          </div>

          {/* Condiciones (SI...) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-slate-700">
                Condiciones (SI...)
              </label>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddCondition}
                leftIcon={<Plus size={16} />}
              >
                Añadir Condición
              </Button>
            </div>
            
            <div className="space-y-3">
              {conditions.map((condition, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <select
                      value={condition.type}
                      onChange={(e) => handleUpdateCondition(index, { type: e.target.value as any })}
                      className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm"
                    >
                      <option value="time_of_day">Horario del Día</option>
                      <option value="day_of_week">Día de la Semana</option>
                      <option value="client_inactivity">Cliente Inactivo</option>
                      <option value="seasonal">Temporada</option>
                      <option value="client_loyalty">Lealtad del Cliente</option>
                      <option value="demand_level">Nivel de Demanda</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveCondition(index)}
                      className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Campos específicos según el tipo de condición */}
                  {condition.type === 'time_of_day' && (
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="time"
                        value={condition.from || ''}
                        onChange={(e) => handleUpdateCondition(index, { from: e.target.value })}
                        className="rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm"
                        placeholder="Desde"
                      />
                      <input
                        type="time"
                        value={condition.to || ''}
                        onChange={(e) => handleUpdateCondition(index, { to: e.target.value })}
                        className="rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm"
                        placeholder="Hasta"
                      />
                      <div className="text-sm text-slate-600 flex items-center">
                        Días de la semana
                      </div>
                    </div>
                  )}
                  
                  {condition.type === 'client_inactivity' && (
                    <input
                      type="number"
                      value={condition.daysInactive || ''}
                      onChange={(e) => handleUpdateCondition(index, { daysInactive: Number(e.target.value) })}
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm"
                      placeholder="Días de inactividad"
                    />
                  )}
                  
                  {condition.type === 'seasonal' && (
                    <select
                      value={condition.season || ''}
                      onChange={(e) => handleUpdateCondition(index, { season: e.target.value as any })}
                      className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm"
                    >
                      <option value="spring">Primavera</option>
                      <option value="summer">Verano</option>
                      <option value="fall">Otoño</option>
                      <option value="winter">Invierno</option>
                    </select>
                  )}
                </Card>
              ))}
              
              {conditions.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">
                  No hay condiciones añadidas. Haz clic en "Añadir Condición" para agregar una.
                </p>
              )}
            </div>
          </div>

          {/* Acción (ENTONCES...) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Acción (ENTONCES...)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Tipo de Acción</label>
                <select
                  value={action.type}
                  onChange={(e) => setAction({ ...action, type: e.target.value as any })}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                >
                  <option value="percentage_discount">Descuento Porcentual</option>
                  <option value="fixed_discount">Descuento Fijo</option>
                  <option value="fixed_price">Precio Fijo</option>
                  <option value="percentage_increase">Aumento Porcentual</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Valor</label>
                <input
                  type="number"
                  value={action.value}
                  onChange={(e) => setAction({ ...action, value: Number(e.target.value) })}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Audiencia Objetivo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Audiencia Objetivo
            </label>
            <select
              value={targetAudience.type}
              onChange={(e) => setTargetAudience({ type: e.target.value as any })}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
            >
              <option value="all">Todos los clientes</option>
              <option value="segment">Segmento específico</option>
              <option value="specific_clients">Clientes específicos</option>
            </select>
          </div>
        </form>
    </Modal>
  );
};


