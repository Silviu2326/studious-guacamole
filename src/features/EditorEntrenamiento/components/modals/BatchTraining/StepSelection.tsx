import React from 'react';
import { Card } from '../../../../../components/componentsreutilizables/Card';

interface StepSelectionProps {
  onSelect: (option: string) => void;
  selectedOption: string | null;
}

export const StepSelection: React.FC<StepSelectionProps> = ({ onSelect, selectedOption }) => {
  const options = [
    {
      id: 'duplicate',
      icon: '📋',
      title: 'DUPLICAR SEMANA',
      description: 'Copiar una semana completa a otra posición',
      subtext: 'Ideal para: Repetir estructura exitosa',
      time: '5 segundos'
    },
    {
      id: 'progression',
      icon: '🔄',
      title: 'PROGRESIÓN LINEAL',
      description: 'Aumentar series/reps/carga progresivamente',
      subtext: 'Ideal para: Programas de fuerza, hipertrofia',
      time: '15 segundos'
    },
    {
      id: 'template',
      icon: '🎯',
      title: 'APLICAR PLANTILLA',
      description: 'Aplicar una estructura de plantilla a múltiples semanas',
      subtext: 'Ideal para: Crear mesociclos rápidamente',
      time: '20 segundos'
    },
    {
      id: 'adjust',
      icon: '📊',
      title: 'AJUSTE MASIVO',
      description: 'Cambiar RPE, duración, o tags en múltiples días',
      subtext: 'Ideal para: Ajustes rápidos de intensidad',
      time: '10 segundos'
    },
    {
      id: 'reorganize',
      icon: '🔀',
      title: 'REORGANIZAR DÍAS',
      description: 'Mover días entre semanas o cambiar orden',
      subtext: 'Ideal para: Ajustar calendario del cliente',
      time: '10 segundos'
    }
  ];

  return (
    <div className="space-y-3">
      <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">¿Qué quieres hacer?</p>
      <div className="grid gap-3">
        {options.map((option) => (
          <Card
            key={option.id}
            variant="hover"
            className={`border-2 transition-all duration-200 ${selectedOption === option.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent'}`}
            onClick={() => onSelect(option.id)}
            padding="md"
          >
            <div className="flex items-start space-x-4">
              <div className={`text-2xl p-3 rounded-full ${selectedOption === option.id ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-800'}`}>
                {option.icon}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-gray-900 dark:text-white">{option.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">{option.description}</p>
                <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400 space-x-4">
                  <span>{option.subtext}</span>
                  <span className="flex items-center text-gray-400">
                    <span className="mr-1">⏱️</span> {option.time}
                  </span>
                </div>
              </div>
              <div className="mt-1">
                 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedOption === option.id ? 'border-blue-500' : 'border-gray-300'}`}>
                    {selectedOption === option.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                 </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
