import React, { useState } from 'react';
import { useDynamicPricingRules } from '../hooks/useDynamicPricingRules';
import { RuleListItem } from './RuleListItem';
import { RuleBuilderForm } from './RuleBuilderForm';
import { DynamicPricingRule } from '../api/pricingRules';
import { Plus, TrendingUp, DollarSign, Target, Loader2 } from 'lucide-react';

/**
 * Componente principal que orquesta la página de precios dinámicos.
 * Utiliza el hook useDynamicPricingRules para obtener los datos y gestionar el estado.
 */
export const DynamicPricingDashboardContainer: React.FC = () => {
  const {
    rules,
    isLoading,
    error,
    createRule,
    updateRule,
    removeRule,
    toggleRule,
    refreshRules
  } = useDynamicPricingRules();

  const [isRuleBuilderOpen, setIsRuleBuilderOpen] = useState<boolean>(false);
  const [selectedRuleForEdit, setSelectedRuleForEdit] = useState<DynamicPricingRule | null>(null);

  const handleCreateRule = async (ruleData: Omit<DynamicPricingRule, 'id' | 'createdAt' | 'stats'>) => {
    try {
      await createRule(ruleData);
      setIsRuleBuilderOpen(false);
      setSelectedRuleForEdit(null);
    } catch (error) {
      console.error('Error creando regla:', error);
      alert('Error al crear la regla. Por favor, intenta nuevamente.');
    }
  };

  const handleEditRule = (rule: DynamicPricingRule) => {
    setSelectedRuleForEdit(rule);
    setIsRuleBuilderOpen(true);
  };

  const handleUpdateRule = async (ruleData: Omit<DynamicPricingRule, 'id' | 'createdAt' | 'stats'>) => {
    if (!selectedRuleForEdit) return;
    
    try {
      await updateRule(selectedRuleForEdit.id, ruleData);
      setIsRuleBuilderOpen(false);
      setSelectedRuleForEdit(null);
    } catch (error) {
      console.error('Error actualizando regla:', error);
      alert('Error al actualizar la regla. Por favor, intenta nuevamente.');
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta regla?')) return;
    
    try {
      await removeRule(ruleId);
    } catch (error) {
      console.error('Error eliminando regla:', error);
      alert('Error al eliminar la regla. Por favor, intenta nuevamente.');
    }
  };

  const handleToggleStatus = async (ruleId: string, isActive: boolean) => {
    try {
      await toggleRule(ruleId, isActive);
    } catch (error) {
      console.error('Error cambiando estado de regla:', error);
    }
  };

  const handleDuplicate = async (rule: DynamicPricingRule) => {
    const duplicatedRule: Omit<DynamicPricingRule, 'id' | 'createdAt' | 'stats'> = {
      name: `${rule.name} (Copia)`,
      description: rule.description,
      isActive: false,
      priority: rule.priority + 1,
      conditions: rule.conditions,
      action: rule.action,
      targetAudience: rule.targetAudience,
      serviceIds: rule.serviceIds
    };
    
    try {
      await createRule(duplicatedRule);
    } catch (error) {
      console.error('Error duplicando regla:', error);
    }
  };

  const activeRules = rules.filter(r => r.isActive);
  const totalRevenue = rules.reduce((sum, r) => sum + (r.stats?.additionalRevenue || 0), 0);
  const totalConversions = rules.reduce((sum, r) => sum + (r.stats?.conversions || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reglas de Precios Dinámicos</h2>
          <p className="text-gray-600 mt-1">
            {rules.length} {rules.length === 1 ? 'regla configurada' : 'reglas configuradas'}
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedRuleForEdit(null);
            setIsRuleBuilderOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Crear Nueva Regla
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reglas Activas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{activeRules.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ingresos Adicionales</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalRevenue.toLocaleString()}€</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Conversiones</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalConversions}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p>Error: {error.message}</p>
        </div>
      )}

      {/* Lista de reglas */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      ) : rules.length > 0 ? (
        <div className="space-y-4">
          {rules.map(rule => (
            <RuleListItem
              key={rule.id}
              rule={rule}
              onToggleStatus={handleToggleStatus}
              onEdit={handleEditRule}
              onDelete={handleDeleteRule}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No tienes reglas configuradas todavía
          </h3>
          <p className="text-gray-600 mb-6">
            Crea tu primera regla de precios dinámicos para optimizar tus ingresos y ocupación
          </p>
          <button
            onClick={() => {
              setSelectedRuleForEdit(null);
              setIsRuleBuilderOpen(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Crear Primera Regla
          </button>
        </div>
      )}

      {/* Modal de creación/edición */}
      {isRuleBuilderOpen && (
        <RuleBuilderForm
          initialRuleData={selectedRuleForEdit || undefined}
          onSubmit={selectedRuleForEdit ? handleUpdateRule : handleCreateRule}
          onCancel={() => {
            setIsRuleBuilderOpen(false);
            setSelectedRuleForEdit(null);
          }}
        />
      )}
    </div>
  );
};


