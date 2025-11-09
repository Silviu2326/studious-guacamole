import { useState, useEffect, useCallback } from 'react';
import {
  DynamicPricingRule,
  getDynamicPricingRules,
  createDynamicPricingRule,
  updateDynamicPricingRule,
  deleteDynamicPricingRule,
  toggleRuleStatus
} from '../api/pricingRules';

interface UseDynamicPricingRulesReturn {
  rules: DynamicPricingRule[];
  isLoading: boolean;
  error: Error | null;
  createRule: (ruleData: Omit<DynamicPricingRule, 'id' | 'createdAt' | 'stats'>) => Promise<DynamicPricingRule>;
  updateRule: (ruleId: string, updates: Partial<DynamicPricingRule>) => Promise<DynamicPricingRule>;
  removeRule: (ruleId: string) => Promise<void>;
  toggleRule: (ruleId: string, isActive: boolean) => Promise<DynamicPricingRule>;
  refreshRules: () => Promise<void>;
}

/**
 * Hook personalizado que encapsula toda la lógica de comunicación
 * con la API para las reglas de precios dinámicos.
 */
export const useDynamicPricingRules = (): UseDynamicPricingRulesReturn => {
  const [rules, setRules] = useState<DynamicPricingRule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getDynamicPricingRules();
      setRules(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar reglas'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const createRule = async (
    ruleData: Omit<DynamicPricingRule, 'id' | 'createdAt' | 'stats'>
  ): Promise<DynamicPricingRule> => {
    try {
      const newRule = await createDynamicPricingRule(ruleData);
      await fetchRules();
      return newRule;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al crear regla');
    }
  };

  const updateRule = async (
    ruleId: string,
    updates: Partial<DynamicPricingRule>
  ): Promise<DynamicPricingRule> => {
    try {
      const updated = await updateDynamicPricingRule(ruleId, updates);
      await fetchRules();
      return updated;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al actualizar regla');
    }
  };

  const removeRule = async (ruleId: string): Promise<void> => {
    try {
      await deleteDynamicPricingRule(ruleId);
      await fetchRules();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al eliminar regla');
    }
  };

  const toggleRule = async (
    ruleId: string,
    isActive: boolean
  ): Promise<DynamicPricingRule> => {
    try {
      const updated = await toggleRuleStatus(ruleId, isActive);
      await fetchRules();
      return updated;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al cambiar estado de regla');
    }
  };

  return {
    rules,
    isLoading,
    error,
    createRule,
    updateRule,
    removeRule,
    toggleRule,
    refreshRules: fetchRules
  };
};













