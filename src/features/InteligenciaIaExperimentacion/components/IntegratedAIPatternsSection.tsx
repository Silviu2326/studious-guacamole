import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Select } from '../../../components/componentsreutilizables';
import { IntegratedAIView, IntegratedPattern } from '../types';
import { getIntegratedAIViewService } from '../services/intelligenceService';
import {
  Sparkles,
  TrendingUp,
  AlertCircle,
  Loader2,
  RefreshCw,
  Eye,
  MessageSquare,
  FileText,
  ShoppingCart,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Target,
} from 'lucide-react';

interface IntegratedAIPatternsSectionProps {
  period?: '7d' | '30d' | '90d';
  onPeriodChange?: (period: '7d' | '30d' | '90d') => void;
  trainerId?: string;
}

const patternTypeIcons = {
  'feedback-content': MessageSquare,
  'content-sales': ShoppingCart,
  'feedback-sales': TrendingUp,
  'feedback-content-sales': Sparkles,
};

const patternTypeLabels = {
  'feedback-content': 'Feedback → Contenido',
  'content-sales': 'Contenido → Ventas',
  'feedback-sales': 'Feedback → Ventas',
  'feedback-content-sales': 'Feedback → Contenido → Ventas',
};

const significanceColors = {
  high: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  medium: 'text-amber-600 bg-amber-50 border-amber-200',
  low: 'text-slate-600 bg-slate-50 border-slate-200',
};

export const IntegratedAIPatternsSection: React.FC<IntegratedAIPatternsSectionProps> = ({
  period = '30d',
  onPeriodChange,
  trainerId,
}) => {
  const [data, setData] = useState<IntegratedAIView | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [selectedPattern, setSelectedPattern] = useState<IntegratedPattern | null>(null);

  useEffect(() => {
    loadData();
  }, [period, trainerId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const response = await getIntegratedAIViewService({
        period,
        trainerId,
        includePatterns: true,
        minConfidence: 70,
      });
      setData(response.view);
    } catch (error) {
      console.error('Error cargando vista integrada IA', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-12 flex items-center justify-center bg-white shadow-sm border border-slate-200/70">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="animate-spin" size={20} />
          <span>Analizando feedback, contenido y ventas...</span>
        </div>
      </Card>
    );
  }

  if (hasError || !data) {
    return (
      <Card className="p-8 bg-white shadow-sm border border-red-200">
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle size={20} />
          <div>
            <p className="font-semibold">Error al cargar datos</p>
            <p className="text-sm text-red-500 mt-1">
              No se pudieron cargar los datos de la vista integrada. Intenta de nuevo.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadData}
            leftIcon={<RefreshCw size={16} />}
            className="ml-auto"
          >
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-white shadow-sm border border-slate-200/70">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
              <Sparkles size={20} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-slate-900">
                Vista Integrada IA: Feedback, Contenido y Ventas
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Integra feedback de clientes, contenido y ventas en una sola vista IA para detectar patrones.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={period}
              onChange={(e) => onPeriodChange?.(e.target.value as any)}
              className="w-32"
            >
              <option value="7d">7 días</option>
              <option value="30d">30 días</option>
              <option value="90d">90 días</option>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadData}
              leftIcon={<RefreshCw size={16} />}
            >
              Actualizar
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 p-4 rounded-lg bg-indigo-50 border border-indigo-200">
          <p className="text-sm text-indigo-900">{data.summary}</p>
        </div>
      </Card>

      {/* Correlations */}
      <Card className="p-6 bg-white shadow-sm border border-slate-200/70">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
            <TrendingUp size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Correlaciones Detectadas</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={16} className="text-blue-600" />
              <p className="text-sm font-semibold text-slate-900">Feedback → Ventas</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">{data.correlations.feedbackToSales}%</p>
            <p className="text-xs text-slate-500 mt-1">Correlación entre feedback positivo y ventas</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-purple-600" />
              <p className="text-sm font-semibold text-slate-900">Contenido → Ventas</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">{data.correlations.contentToSales}%</p>
            <p className="text-xs text-slate-500 mt-1">Correlación entre contenido y ventas</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={16} className="text-indigo-600" />
              <p className="text-sm font-semibold text-slate-900">Feedback → Contenido</p>
            </div>
            <p className="text-2xl font-bold text-indigo-600">{data.correlations.feedbackToContent}%</p>
            <p className="text-xs text-slate-500 mt-1">Correlación entre feedback y contenido</p>
          </div>
        </div>
      </Card>

      {/* Patterns */}
      {data.patterns && data.patterns.length > 0 && (
        <Card className="p-6 bg-white shadow-sm border border-slate-200/70">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
              <Lightbulb size={20} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Patrones Detectados</h3>
            <Badge variant="blue" size="sm">
              {data.patterns.length} patrones
            </Badge>
          </div>
          <div className="space-y-4">
            {data.patterns.map((pattern) => {
              const PatternIcon = patternTypeIcons[pattern.patternType] || Sparkles;
              return (
                <div
                  key={pattern.patternId}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white transition-colors cursor-pointer"
                  onClick={() => setSelectedPattern(pattern)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                        <PatternIcon size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-base font-semibold text-slate-900">{pattern.title}</h4>
                          <Badge
                            variant={
                              pattern.significance === 'high'
                                ? 'green'
                                : pattern.significance === 'medium'
                                ? 'yellow'
                                : 'blue'
                            }
                            size="sm"
                          >
                            {pattern.significance}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{pattern.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>{patternTypeLabels[pattern.patternType]}</span>
                          <span>•</span>
                          <span>Confianza: {pattern.confidence}%</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPattern(pattern);
                      }}
                      leftIcon={<Eye size={16} />}
                    >
                      Ver detalles
                    </Button>
                  </div>
                  {pattern.insights && pattern.insights.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <p className="text-xs font-semibold text-slate-700 mb-2">Insights clave:</p>
                      <ul className="space-y-1">
                        {pattern.insights.slice(0, 2).map((insight, index) => (
                          <li key={index} className="flex items-start gap-2 text-xs text-slate-600">
                            <CheckCircle2 size={12} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Pattern Detail Modal */}
      {selectedPattern && (
        <Card className="p-6 bg-white shadow-lg border border-indigo-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                {React.createElement(patternTypeIcons[selectedPattern.patternType] || Sparkles, { size: 20 })}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900">{selectedPattern.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{selectedPattern.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedPattern(null)}
            >
              Cerrar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 mb-1">Tipo de patrón</p>
              <p className="text-sm font-semibold text-slate-900">
                {patternTypeLabels[selectedPattern.patternType]}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 mb-1">Confianza</p>
              <p className="text-sm font-semibold text-slate-900">{selectedPattern.confidence}%</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 mb-1">Significancia</p>
              <Badge
                variant={
                  selectedPattern.significance === 'high'
                    ? 'green'
                    : selectedPattern.significance === 'medium'
                    ? 'yellow'
                    : 'blue'
                }
                size="sm"
              >
                {selectedPattern.significance}
              </Badge>
            </div>
          </div>

          {selectedPattern.insights && selectedPattern.insights.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <Lightbulb size={16} className="text-amber-600" />
                Insights
              </h4>
              <ul className="space-y-2">
                {selectedPattern.insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedPattern.recommendations && selectedPattern.recommendations.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <Target size={16} className="text-indigo-600" />
                Recomendaciones
              </h4>
              <ul className="space-y-2">
                {selectedPattern.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-700 p-2 rounded-lg bg-indigo-50 border border-indigo-200">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </div>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Data */}
          {selectedPattern.relatedData && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Datos Relacionados</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedPattern.relatedData.feedback && selectedPattern.relatedData.feedback.length > 0 && (
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-xs font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <MessageSquare size={14} />
                      Feedback ({selectedPattern.relatedData.feedback.length})
                    </p>
                    {selectedPattern.relatedData.feedback.slice(0, 2).map((fb) => (
                      <div key={fb.feedbackId} className="text-xs text-blue-700 mb-1">
                        <p className="font-semibold">{fb.customerName}</p>
                        <p className="text-blue-600 truncate">{fb.content.substring(0, 50)}...</p>
                      </div>
                    ))}
                  </div>
                )}
                {selectedPattern.relatedData.content && selectedPattern.relatedData.content.length > 0 && (
                  <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                    <p className="text-xs font-semibold text-purple-900 mb-2 flex items-center gap-2">
                      <FileText size={14} />
                      Contenido ({selectedPattern.relatedData.content.length})
                    </p>
                    {selectedPattern.relatedData.content.slice(0, 2).map((cont) => (
                      <div key={cont.contentId} className="text-xs text-purple-700 mb-1">
                        <p className="font-semibold">{cont.title || cont.content.substring(0, 30)}</p>
                        <p className="text-purple-600">{cont.engagement.engagementRate.toFixed(1)}% engagement</p>
                      </div>
                    ))}
                  </div>
                )}
                {selectedPattern.relatedData.sales && selectedPattern.relatedData.sales.length > 0 && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <p className="text-xs font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                      <ShoppingCart size={14} />
                      Ventas ({selectedPattern.relatedData.sales.length})
                    </p>
                    {selectedPattern.relatedData.sales.slice(0, 2).map((sale) => (
                      <div key={sale.saleId} className="text-xs text-emerald-700 mb-1">
                        <p className="font-semibold">{sale.customerName}</p>
                        <p className="text-emerald-600">€{sale.amount.toFixed(2)} - {sale.product}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Key Insights */}
      {data.keyInsights && data.keyInsights.length > 0 && (
        <Card className="p-6 bg-white shadow-sm border border-slate-200/70">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
              <Lightbulb size={20} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Insights Clave</h3>
          </div>
          <ul className="space-y-2">
            {data.keyInsights.map((insight, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-700">{insight}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Actionable Recommendations */}
      {data.actionableRecommendations && data.actionableRecommendations.length > 0 && (
        <Card className="p-6 bg-white shadow-sm border border-indigo-200 bg-indigo-50/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
              <Target size={20} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Recomendaciones Accionables</h3>
          </div>
          <ul className="space-y-3">
            {data.actionableRecommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white border border-indigo-200">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-semibold">
                  {index + 1}
                </div>
                <p className="text-sm text-slate-700">{recommendation}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

