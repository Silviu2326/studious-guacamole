import React, { useState, useEffect } from 'react';
import { Target, Save, CheckCircle2, TrendingUp, Users, Heart } from 'lucide-react';
import { Button, Card, Badge } from '../../../components/componentsreutilizables';
import { QuarterlyObjectives, QuarterlyObjective } from '../types';
import { ds } from '../../adherencia/ui/ds';

interface QuarterlyObjectivesSelectorProps {
  objectives?: QuarterlyObjectives;
  onSave: (objectives: QuarterlyObjectives) => Promise<void>;
  className?: string;
}

const getColorClasses = (color: string, isSelected: boolean) => {
  const colorMap: Record<string, { bg: string; bgDark: string; text: string; textDark: string }> = {
    blue: {
      bg: 'bg-blue-100',
      bgDark: 'dark:bg-blue-900/30',
      text: 'text-blue-600',
      textDark: 'dark:text-blue-400',
    },
    green: {
      bg: 'bg-green-100',
      bgDark: 'dark:bg-green-900/30',
      text: 'text-green-600',
      textDark: 'dark:text-green-400',
    },
    purple: {
      bg: 'bg-purple-100',
      bgDark: 'dark:bg-purple-900/30',
      text: 'text-purple-600',
      textDark: 'dark:text-purple-400',
    },
  };

  if (!isSelected) {
    return {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-500 dark:text-gray-400',
    };
  }

  const colors = colorMap[color] || colorMap.blue;
  return {
    bg: `${colors.bg} ${colors.bgDark}`,
    text: `${colors.text} ${colors.textDark}`,
  };
};

const objectiveOptions: {
  value: QuarterlyObjective;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    value: 'captar_leads',
    label: 'Captar Leads',
    description: 'Aumentar el número de contactos calificados',
    icon: TrendingUp,
    color: 'blue',
  },
  {
    value: 'vender_packs',
    label: 'Vender Packs',
    description: 'Incrementar ventas de paquetes y servicios',
    icon: Target,
    color: 'green',
  },
  {
    value: 'fidelizar',
    label: 'Fidelizar',
    description: 'Mejorar retención y satisfacción de clientes',
    icon: Heart,
    color: 'purple',
  },
];

const getCurrentQuarter = (): string => {
  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3) + 1;
  return `Q${quarter}-${now.getFullYear()}`;
};

export const QuarterlyObjectivesSelector: React.FC<QuarterlyObjectivesSelectorProps> = ({
  objectives,
  onSave,
  className = '',
}) => {
  const [selectedObjectives, setSelectedObjectives] = useState<QuarterlyObjective[]>(
    objectives?.objectives || []
  );
  const [period, setPeriod] = useState(objectives?.period || getCurrentQuarter());
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleObjective = (objective: QuarterlyObjective) => {
    setSelectedObjectives((prev) =>
      prev.includes(objective) ? prev.filter((o) => o !== objective) : [...prev, objective]
    );
  };

  const handleSave = async () => {
    if (selectedObjectives.length === 0) {
      return;
    }

    setIsSaving(true);
    try {
      const updatedObjectives: QuarterlyObjectives = {
        objectives: selectedObjectives,
        period,
        completed: true,
      };
      await onSave(updatedObjectives);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error guardando objetivos trimestrales:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/40 dark:to-emerald-900/30 flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600 dark:text-green-300" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Objetivos Trimestrales
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Elige tus objetivos para que el dashboard priorice métricas y alertas relevantes.
          </p>
        </div>
        {objectives?.completed && (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Configurado
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        {/* Periodo */}
        <div>
          <label className={`block ${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Período
          </label>
          <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-lg inline-block">
            {period}
          </div>
        </div>

        {/* Objetivos */}
        <div>
          <label className={`block ${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-3`}>
            Selecciona tus objetivos (puedes elegir varios)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {objectiveOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedObjectives.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleObjective(option.value)}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all text-left
                    ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md'
                        : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-700'
                    }
                  `}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getColorClasses(option.color, isSelected).bg}`}>
                      <Icon className={`w-5 h-5 ${getColorClasses(option.color, isSelected).text}`} />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`
                        font-semibold mb-1
                        ${
                          isSelected
                            ? 'text-indigo-900 dark:text-indigo-100'
                            : 'text-gray-900 dark:text-gray-100'
                        }
                      `}
                      >
                        {option.label}
                      </h3>
                      <p
                        className={`
                        text-sm
                        ${
                          isSelected
                            ? 'text-indigo-700 dark:text-indigo-300'
                            : 'text-gray-600 dark:text-gray-400'
                        }
                      `}
                      >
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Información sobre impacto */}
        {selectedObjectives.length > 0 && (
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className={`text-sm font-medium text-blue-900 dark:text-blue-100 mb-1`}>
              Impacto en el Dashboard:
            </p>
            <ul className={`text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside`}>
              {selectedObjectives.includes('captar_leads') && (
                <li>KPIs de leads y conversión serán priorizados</li>
              )}
              {selectedObjectives.includes('vender_packs') && (
                <li>Métricas de ventas y revenue serán destacadas</li>
              )}
              {selectedObjectives.includes('fidelizar') && (
                <li>Alertas de retención y engagement serán visibles</li>
              )}
            </ul>
          </div>
        )}

        {/* Botón Guardar */}
        <div className="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={selectedObjectives.length === 0 || isSaving}
            className="inline-flex items-center gap-2"
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Guardado
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isSaving ? 'Guardando...' : 'Guardar Objetivos'}
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

