import React from 'react';
import { Target, Users, UserPlus, TrendingUp } from 'lucide-react';
import { Objective } from '../types';

interface ObjectivesSectionProps {
  objectives?: Objective[];
}

export const ObjectivesSection: React.FC<ObjectivesSectionProps> = ({ objectives = [] }) => {
  if (!objectives || objectives.length === 0) {
    return null;
  }

  const getObjectiveIcon = (name: string) => {
    if (name.toLowerCase().includes('nuevo')) {
      return <UserPlus size={18} className="text-indigo-600" />;
    }
    if (name.toLowerCase().includes('reactivado')) {
      return <Users size={18} className="text-emerald-600" />;
    }
    if (name.toLowerCase().includes('lead')) {
      return <TrendingUp size={18} className="text-blue-600" />;
    }
    return <Target size={18} className="text-slate-600" />;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-emerald-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-indigo-500';
    if (percentage >= 25) return 'bg-amber-500';
    return 'bg-slate-400';
  };

  return (
    <div className="mt-6 pt-6 border-t border-slate-200/70">
      <div className="flex items-center gap-2 mb-4">
        <Target size={20} className="text-indigo-600" />
        <h3 className="text-lg font-semibold text-slate-900">Objetivos del Mes</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {objectives.map((objective) => {
          const percentage = Math.min((objective.currentValue / objective.targetValue) * 100, 100);
          const remaining = Math.max(0, objective.targetValue - objective.currentValue);

          return (
            <div
              key={objective.id}
              className="p-4 rounded-lg bg-gradient-to-br from-slate-50 to-white border border-slate-200/70 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getObjectiveIcon(objective.name)}
                  <h4 className="text-sm font-semibold text-slate-900">{objective.name}</h4>
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  {percentage.toFixed(0)}%
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900">
                    {objective.currentValue.toLocaleString('es-ES')}
                  </span>
                  <span className="text-sm text-slate-500">
                    / {objective.targetValue.toLocaleString('es-ES')} {objective.unit || ''}
                  </span>
                </div>
                
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                {remaining > 0 && (
                  <p className="text-xs text-slate-500">
                    Faltan {remaining.toLocaleString('es-ES')} {objective.unit || ''} para alcanzar la meta
                  </p>
                )}
                {remaining <= 0 && (
                  <p className="text-xs text-emerald-600 font-medium">
                    ¡Meta alcanzada! 🎉
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ObjectivesSection;

