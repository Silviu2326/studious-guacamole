import React from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { DecisionStyle } from '../types';
import { Zap, BarChart3, RefreshCw, Check } from 'lucide-react';

interface DecisionStyleSelectorProps {
  currentStyle?: DecisionStyle;
  onStyleChange: (style: DecisionStyle) => void;
  isLoading?: boolean;
}

const decisionStyles: {
  value: DecisionStyle;
  label: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
}[] = [
  {
    value: 'rapido',
    label: 'Rápido',
    description: 'Prefiero decisiones rápidas y acción inmediata',
    icon: <Zap size={24} className="text-amber-600" />,
    details: [
      'Recomendaciones concisas y directas',
      'Resúmenes ejecutivos de máximo 3 puntos',
      'CTAs claros y accionables de inmediato',
      'Menos análisis, más propuestas concretas',
    ],
  },
  {
    value: 'basado-en-datos',
    label: 'Basado en Datos',
    description: 'Necesito datos, métricas y análisis detallado',
    icon: <BarChart3 size={24} className="text-blue-600" />,
    details: [
      'Recomendaciones con métricas y KPIs',
      'Análisis comparativo de opciones',
      'Evidencia y casos de éxito',
      'Proyecciones de impacto cuantificables',
    ],
  },
  {
    value: 'iterativo',
    label: 'Iterativo',
    description: 'Prefiero probar, ajustar y mejorar gradualmente',
    icon: <RefreshCw size={24} className="text-green-600" />,
    details: [
      'Recomendaciones en fases o sprints',
      'Plan de implementación paso a paso',
      'Puntos de revisión y ajuste',
      'Enfoque en mejora continua',
    ],
  },
];

export const DecisionStyleSelector: React.FC<DecisionStyleSelectorProps> = ({
  currentStyle,
  onStyleChange,
  isLoading = false,
}) => {
  return (
    <Card className="p-6 bg-white border border-slate-200/80 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
          <BarChart3 size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Estilo de Decisión</h2>
          <p className="text-sm text-slate-600 mt-1">
            Indica tu estilo de decisión para que la IA adapte la forma de presentar recomendaciones
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {decisionStyles.map((style) => {
          const isSelected = currentStyle === style.value;
          return (
            <button
              key={style.value}
              type="button"
              onClick={() => !isLoading && onStyleChange(style.value)}
              disabled={isLoading}
              className={`
                relative p-5 rounded-xl border-2 transition-all text-left
                ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="p-1.5 rounded-full bg-indigo-600 text-white">
                    <Check size={16} />
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 mb-3">
                <div
                  className={`p-2 rounded-lg ${
                    isSelected ? 'bg-indigo-100' : 'bg-slate-100'
                  }`}
                >
                  {style.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">{style.label}</h3>
                  <p className="text-sm text-slate-600">{style.description}</p>
                </div>
              </div>

              <ul className="space-y-2 mt-4">
                {style.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      {currentStyle && (
        <div className="mt-6 p-4 rounded-lg bg-indigo-50 border border-indigo-200">
          <p className="text-sm text-indigo-900">
            <strong>Estilo seleccionado:</strong> La IA adaptará las recomendaciones según tu preferencia por decisiones{' '}
            {currentStyle === 'rapido'
              ? 'rápidas'
              : currentStyle === 'basado-en-datos'
              ? 'basadas en datos'
              : 'iterativas'}
            .
          </p>
        </div>
      )}
    </Card>
  );
};

export default DecisionStyleSelector;

