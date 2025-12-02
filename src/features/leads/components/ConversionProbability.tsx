import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Lead, ConversionPrediction } from '../types';
import { PredictionService } from '../services/predictionService';
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  BarChart3
} from 'lucide-react';

interface ConversionProbabilityProps {
  lead: Lead;
  compact?: boolean;
}

export const ConversionProbability: React.FC<ConversionProbabilityProps> = ({ lead, compact = false }) => {
  const [prediction, setPrediction] = useState<ConversionPrediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrediction();
  }, [lead.id]);

  const loadPrediction = async () => {
    setLoading(true);
    try {
      const data = await PredictionService.getPrediction(lead.id);
      setPrediction(data);
    } catch (error) {
      console.error('Error cargando predicción:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className={`animate-spin ${ds.radius.full} h-5 w-5 border-b-2 ${ds.color.primaryBg}`}></div>
      </div>
    );
  }

  if (!prediction) {
    return null;
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'text-green-600 dark:text-green-400';
    if (probability >= 50) return 'text-yellow-600 dark:text-yellow-400';
    if (probability >= 30) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProbabilityBg = (probability: number) => {
    if (probability >= 70) return 'bg-green-100 dark:bg-green-900/30';
    if (probability >= 50) return 'bg-yellow-100 dark:bg-yellow-900/30';
    if (probability >= 30) return 'bg-orange-100 dark:bg-orange-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  const getConfidenceBadge = (confidence: 'low' | 'medium' | 'high') => {
    const badges = {
      low: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      high: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    };
    return badges[confidence];
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`px-2 py-1 rounded-lg ${getProbabilityBg(prediction.probability)}`}>
          <div className="flex items-center gap-1">
            {prediction.probability >= 50 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span className={`text-xs font-semibold ${getProbabilityColor(prediction.probability)}`}>
              {prediction.probability.toFixed(0)}%
            </span>
          </div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded ${getConfidenceBadge(prediction.confidence)}`}>
          {prediction.confidence === 'high' ? 'Alta confianza' : 
           prediction.confidence === 'medium' ? 'Media confianza' : 'Baja confianza'}
        </span>
      </div>
    );
  }

  return (
    <Card padding="md">
      <div className="space-y-4">
        {/* Header con probabilidad */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#F1F5F9]">
              Probabilidad de Conversión
            </h3>
            <p className="text-sm text-gray-600 dark:text-[#94A3B8]">
              Basado en análisis de datos históricos
            </p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getProbabilityColor(prediction.probability)}`}>
              {prediction.probability.toFixed(1)}%
            </div>
            <span className={`text-xs px-2 py-1 rounded ${getConfidenceBadge(prediction.confidence)}`}>
              {prediction.confidence === 'high' ? 'Alta confianza' : 
               prediction.confidence === 'medium' ? 'Media confianza' : 'Baja confianza'}
            </span>
          </div>
        </div>

        {/* Barra de probabilidad */}
        <div className="w-full bg-gray-200 dark:bg-[#334155] rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              prediction.probability >= 70 ? 'bg-green-500' :
              prediction.probability >= 50 ? 'bg-yellow-500' :
              prediction.probability >= 30 ? 'bg-orange-500' :
              'bg-red-500'
            }`}
            style={{ width: `${prediction.probability}%` }}
          />
        </div>

        {/* Factores que influyen */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-[#F1F5F9] mb-2 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Factores que Influyen
          </h4>
          <div className="space-y-2">
            {prediction.factors.slice(0, 5).map((factor, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between p-2 bg-gray-50 dark:bg-[#1E1E2E] rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-[#F1F5F9]">
                      {factor.name}
                    </span>
                    {factor.impact > 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                    ) : factor.impact < 0 ? (
                      <TrendingDown className="w-3 h-3 text-red-600 dark:text-red-400" />
                    ) : null}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-[#94A3B8]">
                    {factor.description}
                  </p>
                  {factor.suggestion && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                      💡 {factor.suggestion}
                    </p>
                  )}
                </div>
                <div className={`text-sm font-semibold ml-2 ${
                  factor.impact > 0 ? 'text-green-600 dark:text-green-400' :
                  factor.impact < 0 ? 'text-red-600 dark:text-red-400' :
                  'text-gray-600 dark:text-[#94A3B8]'
                }`}>
                  {factor.impact > 0 ? '+' : ''}{factor.impact.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recomendaciones */}
        {prediction.recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-[#F1F5F9] mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Recomendaciones
            </h4>
            <div className="space-y-1">
              {prediction.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                >
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 dark:text-[#94A3B8]">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Última actualización */}
        <div className="text-xs text-gray-500 dark:text-gray-500 pt-2 border-t border-gray-200 dark:border-[#334155]">
          Última actualización: {new Date(prediction.lastCalculated).toLocaleString()}
        </div>
      </div>
    </Card>
  );
};

