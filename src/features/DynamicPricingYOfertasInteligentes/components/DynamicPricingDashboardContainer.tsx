import React, { useState } from 'react';
import { useDynamicPricingRules } from '../hooks/useDynamicPricingRules';
import { RuleListItem } from './RuleListItem';
import { RuleBuilderForm } from './RuleBuilderForm';
import { DynamicPricingRule } from '../api/pricingRules';
import { Plus, TrendingUp, DollarSign, Target, Loader2, Package, AlertCircle } from 'lucide-react';
import { Button, Card, MetricCards } from '../../../components/componentsreutilizables';

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
      <div className="flex items-center justify-end">
        <Button
          onClick={() => {
            setSelectedRuleForEdit(null);
            setIsRuleBuilderOpen(true);
          }}
          leftIcon={<Plus size={20} />}
        >
          Crear Nueva Regla
        </Button>
      </div>

      {/* Estadísticas */}
      <MetricCards
        data={[
          {
            id: 'active-rules',
            title: 'Reglas Activas',
            value: activeRules.length,
            color: 'success',
            icon: <Target size={20} />,
          },
          {
            id: 'revenue',
            title: 'Ingresos Adicionales',
            value: `${totalRevenue.toLocaleString()}€`,
            color: 'info',
            icon: <DollarSign size={20} />,
          },
          {
            id: 'conversions',
            title: 'Total Conversiones',
            value: totalConversions,
            color: 'success',
            icon: <TrendingUp size={20} />,
          },
        ]}
        columns={3}
      />

      {/* Error */}
      {error && (
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">Error: {error.message}</p>
          </div>
        </Card>
      )}

      {/* Lista de reglas */}
      {isLoading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </Card>
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
        <Card className="p-8 text-center bg-white shadow-sm">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No tienes reglas configuradas todavía
          </h3>
          <p className="text-gray-600 mb-4">
            Crea tu primera regla de precios dinámicos para optimizar tus ingresos y ocupación
          </p>
          <Button
            onClick={() => {
              setSelectedRuleForEdit(null);
              setIsRuleBuilderOpen(true);
            }}
            leftIcon={<Plus size={20} />}
          >
            Crear Primera Regla
          </Button>
        </Card>
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


