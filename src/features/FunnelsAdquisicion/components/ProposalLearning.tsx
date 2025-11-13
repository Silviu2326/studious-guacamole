import React, { useState, useCallback, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, Target, Sparkles, Award, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { FunnelsAdquisicionService } from '../services/funnelsAdquisicionService';
import { ProposalLearningResponse, ProposalPerformance, ProposalPrioritization, FunnelsAcquisitionPeriod } from '../types';

interface ProposalLearningProps {
  period?: FunnelsAcquisitionPeriod;
  className?: string;
}

const proposalTypeLabels: Record<string, string> = {
  oferta_descuento: 'Oferta con descuento',
  trial_gratis: 'Trial gratis',
  bonus_incluido: 'Bonus incluido',
  pago_unico: 'Pago único',
  pago_recurrente: 'Pago recurrente',
  pack_multiple: 'Pack múltiple',
  consulta_gratis: 'Consulta gratis',
  webinar_exclusivo: 'Webinar exclusivo',
  challenge_gratis: 'Challenge gratis',
  garantia_extendida: 'Garantía extendida',
  pago_flexible: 'Pago flexible',
  otro: 'Otro',
};

const impactColors = {
  high: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export const ProposalLearning: React.FC<ProposalLearningProps> = ({
  period = '30d',
  className = '',
}) => {
  const [learning, setLearning] = useState<ProposalLearningResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'top' | 'insights' | 'priorities'>('overview');

  const loadLearning = useCallback(async () => {
    setLoading(true);
    try {
      const data = await FunnelsAdquisicionService.getProposalLearning(period);
      setLearning(data);
    } catch (error) {
      console.error('[ProposalLearning] Error cargando aprendizaje:', error);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    loadLearning();
  }, [loadLearning]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading && !learning) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!learning) {
    return null;
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
            Aprendizaje de Propuestas - IA
          </h2>
        </div>
        <Badge variant="blue" size="md">
          {learning.totalProposalsTracked} propuestas analizadas
        </Badge>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200 dark:border-gray-800">
        {[
          { id: 'overview', label: 'Resumen' },
          { id: 'top', label: 'Top Performers' },
          { id: 'insights', label: 'Insights IA' },
          { id: 'priorities', label: 'Prioridades' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              selectedTab === tab.id
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Tasa de cierre promedio</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {learning.averageClosingRate.toFixed(1)}%
              </p>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Mejorando</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {learning.trends.improvingProposals.length}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Declinando</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {learning.trends.decliningProposals.length}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
              Performance de Propuestas
            </h3>
            <div className="space-y-3">
              {learning.proposalPerformances.slice(0, 5).map((proposal) => (
                <div
                  key={proposal.proposalType}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900/50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-slate-100">{proposal.proposalName}</h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        {proposalTypeLabels[proposal.proposalType] || proposal.proposalType}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {proposal.trendDirection === 'up' ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : proposal.trendDirection === 'down' ? (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      ) : null}
                      <span className="text-lg font-bold text-gray-900 dark:text-slate-100">
                        {proposal.performanceScore}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-slate-400">Cierre:</span>
                      <span className="ml-2 font-semibold text-gray-900 dark:text-slate-100">
                        {proposal.closingRate.toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-slate-400">Revenue:</span>
                      <span className="ml-2 font-semibold text-gray-900 dark:text-slate-100">
                        {formatCurrency(proposal.totalRevenue)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-slate-400">Presentadas:</span>
                      <span className="ml-2 font-semibold text-gray-900 dark:text-slate-100">
                        {proposal.totalPresented}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top Performers Tab */}
      {selectedTab === 'top' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Mejores Propuestas
            </h3>
            <div className="space-y-3">
              {learning.topPerformingProposals.map((proposal, index) => (
                <div
                  key={proposal.proposalType}
                  className="p-4 rounded-xl border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-slate-100">{proposal.proposalName}</h4>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          {proposalTypeLabels[proposal.proposalType] || proposal.proposalType}
                        </p>
                      </div>
                    </div>
                    <Badge variant="success">{proposal.performanceScore} puntos</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-slate-400">Tasa de cierre:</span>
                      <span className="ml-2 font-semibold text-green-600 dark:text-green-400">
                        {proposal.closingRate.toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-slate-400">Revenue total:</span>
                      <span className="ml-2 font-semibold text-gray-900 dark:text-slate-100">
                        {formatCurrency(proposal.totalRevenue)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-slate-400">Revenue promedio:</span>
                      <span className="ml-2 font-semibold text-gray-900 dark:text-slate-100">
                        {formatCurrency(proposal.averageRevenue)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-slate-400">Cerradas:</span>
                      <span className="ml-2 font-semibold text-gray-900 dark:text-slate-100">
                        {proposal.totalClosed}
                      </span>
                    </div>
                  </div>
                  {proposal.successFactors && proposal.successFactors.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                      <p className="text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                        Factores de éxito:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {proposal.successFactors.map((factor, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          >
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {selectedTab === 'insights' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Insights de IA
          </h3>
          {learning.insights.map((insight) => (
            <div
              key={insight.id}
              className="p-4 rounded-xl border border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                      {proposalTypeLabels[insight.proposalType] || insight.proposalType}
                    </span>
                    <Badge className={impactColors[insight.expectedImpact]}>
                      {insight.expectedImpact === 'high' ? 'Alto impacto' : insight.expectedImpact === 'medium' ? 'Medio impacto' : 'Bajo impacto'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-slate-300 mb-2">{insight.insight}</p>
                  <div className="p-3 rounded-lg bg-white/50 dark:bg-black/20 mt-2">
                    <p className="text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Recomendación:</p>
                    <p className="text-sm text-gray-900 dark:text-slate-100">{insight.recommendation}</p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xs text-gray-600 dark:text-slate-400">Confianza</p>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{insight.confidence}%</p>
                  <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">
                    {insight.basedOnDataPoints} datos
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Priorities Tab */}
      {selectedTab === 'priorities' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" />
            Propuestas Prioritarias
          </h3>
          {learning.prioritizations
            .sort((a, b) => b.priorityScore - a.priorityScore)
            .map((prioritization) => (
              <div
                key={prioritization.proposalType}
                className="p-4 rounded-xl border-2 border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-slate-100">
                        {prioritization.proposalName}
                      </h4>
                      <Badge variant="blue">Prioridad: {prioritization.priorityScore}</Badge>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-slate-300 mb-3">{prioritization.reasoning}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-slate-400">Conversión esperada:</span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-slate-100">
                          {prioritization.expectedConversionRate.toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-slate-400">Revenue esperado:</span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-slate-100">
                          {formatCurrency(prioritization.expectedRevenue)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-slate-400">Confianza:</span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-slate-100">
                          {prioritization.confidence}%
                        </span>
                      </div>
                    </div>
                    {prioritization.recommendedForFunnels && prioritization.recommendedForFunnels.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-indigo-200 dark:border-indigo-800">
                        <p className="text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                          Recomendada para funnels:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {prioritization.recommendedForFunnels.map((funnelId, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                            >
                              {funnelId}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {prioritization.recommendedForAudiences && prioritization.recommendedForAudiences.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                          Audiencias objetivo:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {prioritization.recommendedForAudiences.map((audience, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            >
                              {audience}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </Card>
  );
};

