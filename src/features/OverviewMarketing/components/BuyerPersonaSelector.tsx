import React from 'react';
import { Users, Briefcase, Baby, Dumbbell, CheckCircle2 } from 'lucide-react';
import { Select, Badge } from '../../../components/componentsreutilizables';
import { DefaultBuyerPersonaType } from '../types';
import { ds } from '../../adherencia/ui/ds';

interface BuyerPersonaSelectorProps {
  selectedPersona: DefaultBuyerPersonaType;
  onPersonaChange: (persona: DefaultBuyerPersonaType) => void;
  className?: string;
}

const personaOptions: {
  value: DefaultBuyerPersonaType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    value: 'all',
    label: 'Todas las Personas',
    description: 'Ver métricas generales sin segmentación',
    icon: <Users className="w-5 h-5" />,
    color: 'blue',
  },
  {
    value: 'ejecutivos',
    label: 'Ejecutivos',
    description: 'Profesionales ocupados, alto poder adquisitivo',
    icon: <Briefcase className="w-5 h-5" />,
    color: 'purple',
  },
  {
    value: 'madres',
    label: 'Madres',
    description: 'Madres activas buscando equilibrio y bienestar',
    icon: <Baby className="w-5 h-5" />,
    color: 'pink',
  },
  {
    value: 'atletas',
    label: 'Atletas',
    description: 'Deportistas y entusiastas del fitness',
    icon: <Dumbbell className="w-5 h-5" />,
    color: 'green',
  },
];

export const BuyerPersonaSelector: React.FC<BuyerPersonaSelectorProps> = ({
  selectedPersona,
  onPersonaChange,
  className = '',
}) => {
  const selectedOption = personaOptions.find((opt) => opt.value === selectedPersona);

  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
          <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            Segmentar por Buyer Persona
          </h3>
          <p className={`text-sm ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Filtra los KPIs para detectar oportunidades específicas por segmento
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {personaOptions.map((option) => {
          const isSelected = selectedPersona === option.value;
          const colorClasses = {
            blue: isSelected
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-800 hover:border-blue-300',
            purple: isSelected
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
              : 'border-gray-200 dark:border-gray-800 hover:border-purple-300',
            pink: isSelected
              ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
              : 'border-gray-200 dark:border-gray-800 hover:border-pink-300',
            green: isSelected
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
              : 'border-gray-200 dark:border-gray-800 hover:border-green-300',
          };

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onPersonaChange(option.value)}
              className={`
                relative p-4 rounded-xl border-2 transition-all text-left
                ${colorClasses[option.color as keyof typeof colorClasses]}
                ${isSelected ? 'shadow-md' : 'hover:shadow-sm'}
              `}
            >
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              )}
              <div className="flex items-start gap-3">
                <div
                  className={`
                  p-2 rounded-lg
                  ${
                    isSelected
                      ? option.color === 'blue'
                        ? 'bg-blue-100 dark:bg-blue-900/30'
                        : option.color === 'purple'
                        ? 'bg-purple-100 dark:bg-purple-900/30'
                        : option.color === 'pink'
                        ? 'bg-pink-100 dark:bg-pink-900/30'
                        : 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }
                `}
                >
                  <div
                    className={
                      isSelected
                        ? option.color === 'blue'
                          ? 'text-blue-600 dark:text-blue-400'
                          : option.color === 'purple'
                          ? 'text-purple-600 dark:text-purple-400'
                          : option.color === 'pink'
                          ? 'text-pink-600 dark:text-pink-400'
                          : 'text-green-600 dark:text-green-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }
                  >
                    {option.icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4
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
                  </h4>
                  <p
                    className={`
                    text-xs
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

      {selectedOption && selectedPersona !== 'all' && (
        <div className="mt-4 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
          <p className={`text-sm ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            <strong>KPIs segmentados:</strong> Los indicadores ahora muestran métricas específicas para{' '}
            <strong>{selectedOption.label.toLowerCase()}</strong>. Esto te ayuda a detectar oportunidades específicas
            para este segmento.
          </p>
        </div>
      )}
    </div>
  );
};

