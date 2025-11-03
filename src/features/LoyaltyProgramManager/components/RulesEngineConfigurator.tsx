import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { LoyaltyRule } from '../api/loyalty';
import { Edit, Check, X, ToggleLeft, ToggleRight, Calendar, Gift, User, Star, Target, ShoppingCart } from 'lucide-react';

interface RulesEngineConfiguratorProps {
  rules: LoyaltyRule[];
  onUpdateRule: (ruleId: string, updates: { points?: number; isActive?: boolean }) => void;
}

export const RulesEngineConfigurator: React.FC<RulesEngineConfiguratorProps> = ({
  rules,
  onUpdateRule
}) => {
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [editingPoints, setEditingPoints] = useState<number>(0);

  const handleStartEdit = (rule: LoyaltyRule) => {
    setEditingRuleId(rule.id);
    setEditingPoints(rule.points);
  };

  const handleSaveEdit = (ruleId: string) => {
    onUpdateRule(ruleId, { points: editingPoints });
    setEditingRuleId(null);
  };

  const handleCancelEdit = () => {
    setEditingRuleId(null);
  };

  const handleToggleActive = (ruleId: string, currentState: boolean) => {
    onUpdateRule(ruleId, { isActive: !currentState });
  };

  const getActionIcon = (actionType: LoyaltyRule['actionType']) => {
    const icons = {
      session_attendance: Calendar,
      referral_signup: User,
      review_posted: Star,
      milestone_reached: Target,
      birthday: Gift,
      purchase: ShoppingCart
    };
    return icons[actionType];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Reglas de Acumulación de Puntos</h2>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => {
          const ActionIcon = getActionIcon(rule.actionType);
          const isEditing = editingRuleId === rule.id;

          return (
            <Card key={rule.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${
                    rule.isActive ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <ActionIcon className={`w-5 h-5 ${
                      rule.isActive ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{rule.description}</h3>
                    <p className="text-sm text-gray-600">Acción: {rule.actionType.replace('_', ' ')}</p>
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editingPoints}
                        onChange={(e) => setEditingPoints(parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded"
                        min="0"
                      />
                      <button
                        onClick={() => handleSaveEdit(rule.id)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600">{rule.points}</p>
                        <p className="text-xs text-gray-600">puntos</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStartEdit(rule)}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <Edit className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => handleToggleActive(rule.id, rule.isActive)}
                          className="p-1"
                        >
                          {rule.isActive ? (
                            <ToggleRight className="w-6 h-6 text-green-600" />
                          ) : (
                            <ToggleLeft className="w-6 h-6 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

