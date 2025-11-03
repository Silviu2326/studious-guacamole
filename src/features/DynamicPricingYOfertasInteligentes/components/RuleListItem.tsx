import React from 'react';
import { DynamicPricingRule } from '../api/pricingRules';
import { Edit, Trash2, Copy, TrendingUp, TrendingDown } from 'lucide-react';

interface RuleListItemProps {
  rule: DynamicPricingRule;
  onToggleStatus: (ruleId: string, isActive: boolean) => void;
  onEdit: (rule: DynamicPricingRule) => void;
  onDelete?: (ruleId: string) => void;
  onDuplicate?: (rule: DynamicPricingRule) => void;
}

/**
 * Componente que renderiza una fila en la lista de reglas.
 * Muestra el nombre, resumen de condición/acción, interruptor y botones de acción.
 */
export const RuleListItem: React.FC<RuleListItemProps> = ({
  rule,
  onToggleStatus,
  onEdit,
  onDelete,
  onDuplicate
}) => {
  const getConditionSummary = () => {
    if (rule.conditions.length === 0) return 'Sin condiciones';
    
    const condition = rule.conditions[0];
    switch (condition.type) {
      case 'time_of_day':
        return `Horario: ${condition.from} - ${condition.to}`;
      case 'client_inactivity':
        return `Cliente inactivo > ${condition.daysInactive} días`;
      case 'seasonal':
        return `Temporada: ${condition.season}`;
      case 'client_loyalty':
        return `Cliente fiel > ${condition.minMonthsAsClient} meses`;
      default:
        return condition.type;
    }
  };

  const getActionSummary = () => {
    switch (rule.action.type) {
      case 'percentage_discount':
        return `Descuento ${rule.action.value}%`;
      case 'fixed_discount':
        return `Descuento ${rule.action.value}${rule.action.currency || '€'}`;
      case 'fixed_price':
        return `Precio fijo: ${rule.action.value}${rule.action.currency || '€'}`;
      case 'percentage_increase':
        return `Aumento ${rule.action.value}%`;
      default:
        return rule.action.type;
    }
  };

  return (
    <div className={`bg-white rounded-lg border ${
      rule.isActive ? 'border-green-200 bg-green-50/50' : 'border-gray-200'
    } p-4 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              rule.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {rule.isActive ? 'Activa' : 'Inactiva'}
            </span>
            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
              Prioridad: {rule.priority}
            </span>
          </div>
          
          {rule.description && (
            <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div className="flex items-start gap-2">
              <span className="text-xs font-medium text-gray-500 mt-0.5">SI:</span>
              <span className="text-sm text-gray-700">{getConditionSummary()}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs font-medium text-gray-500 mt-0.5">ENTONCES:</span>
              <span className="text-sm text-gray-700 font-medium">{getActionSummary()}</span>
            </div>
          </div>
          
          {/* Estadísticas */}
          {rule.stats && (
            <div className="flex items-center gap-4 text-sm">
              {rule.stats.offersGenerated !== undefined && (
                <div className="flex items-center gap-1 text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>{rule.stats.offersGenerated} ofertas generadas</span>
                </div>
              )}
              {rule.stats.conversions !== undefined && (
                <div className="flex items-center gap-1 text-green-600">
                  <span>{rule.stats.conversions} conversiones</span>
                </div>
              )}
              {rule.stats.additionalRevenue !== undefined && (
                <div className="flex items-center gap-1 text-blue-600">
                  <span>+{rule.stats.additionalRevenue}€ ingresos</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Acciones */}
        <div className="flex items-center gap-2 ml-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={rule.isActive}
              onChange={(e) => onToggleStatus(rule.id, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
          
          <button
            onClick={() => onEdit(rule)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          {onDuplicate && (
            <button
              onClick={() => onDuplicate(rule)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
              title="Duplicar"
            >
              <Copy className="w-4 h-4" />
            </button>
          )}
          
          {onDelete && (
            <button
              onClick={() => onDelete(rule.id)}
              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


