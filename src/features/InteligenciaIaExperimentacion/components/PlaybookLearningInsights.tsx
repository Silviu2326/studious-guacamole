import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from '../../../components/componentsreutilizables';
import { PlaybookLearningInsights, PlaybookLearningProfile } from '../types';
import { getPlaybookLearningInsightsService, getPlaybookLearningProfileService } from '../services/intelligenceService';
import { useAuth } from '../../../context/AuthContext';
import { Brain, TrendingUp, TrendingDown, Target, Loader2, RefreshCw } from 'lucide-react';

interface PlaybookLearningInsightsProps {
  trainerId?: string;
}

export const PlaybookLearningInsights: React.FC<PlaybookLearningInsightsProps> = ({ trainerId }) => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<PlaybookLearningInsights | null>(null);
  const [profile, setProfile] = useState<PlaybookLearningProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [trainerId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [insightsResponse, profileResponse] = await Promise.all([
        getPlaybookLearningInsightsService({ trainerId: trainerId || user?.id }),
        getPlaybookLearningProfileService({ trainerId: trainerId || user?.id }),
      ]);

      if (insightsResponse.success) {
        setInsights(insightsResponse.insights);
      }
      if (profileResponse.success && profileResponse.profile) {
        setProfile(profileResponse.profile);
      }
    } catch (error) {
      console.error('Error cargando insights de aprendizaje:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="animate-spin text-indigo-600" />
          <span className="ml-2 text-sm text-slate-600">Cargando insights de aprendizaje...</span>
        </div>
      </Card>
    );
  }

  if (!insights || insights.totalDecisions === 0) {
    return (
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
            <Brain size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              La IA está aprendiendo de tus decisiones
            </h3>
            <p className="text-sm text-slate-600">
              Cuando aceptes o rechaces playbooks, la IA aprenderá de tus decisiones para refinar futuras recomendaciones.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
            <Brain size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              La IA está aprendiendo de tus decisiones
            </h3>
            <p className="text-sm text-slate-600">
              Basado en {insights.totalDecisions} decisiones registradas
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<RefreshCw size={16} />}
          onClick={loadData}
        >
          Actualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-emerald-600" />
            <span className="text-sm font-medium text-slate-700">Tasa de Aceptación</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{insights.acceptanceRate.toFixed(1)}%</p>
          <p className="text-xs text-slate-500 mt-1">
            {profile?.accuracyScore ? `Precisión IA: ${profile.accuracyScore.toFixed(0)}%` : 'Sin datos suficientes'}
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={16} className="text-rose-600" />
            <span className="text-sm font-medium text-slate-700">Tasa de Rechazo</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{insights.rejectionRate.toFixed(1)}%</p>
          <p className="text-xs text-slate-500 mt-1">
            {insights.commonRejectionReasons.length} razones comunes
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-indigo-600" />
            <span className="text-sm font-medium text-slate-700">Total Decisiones</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{insights.totalDecisions}</p>
          <p className="text-xs text-slate-500 mt-1">
            {insights.topAcceptedPatterns.length} patrones identificados
          </p>
        </div>
      </div>

      {insights.topAcceptedPatterns.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Patrones más aceptados</h4>
          <div className="flex flex-wrap gap-2">
            {insights.topAcceptedPatterns.map((pattern, idx) => (
              <Badge key={idx} variant="success" size="sm" className="flex items-center gap-1">
                {pattern.pattern}
                <span className="text-xs opacity-75">({pattern.count})</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {insights.commonRejectionReasons.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Razones de rechazo más comunes</h4>
          <div className="space-y-2">
            {insights.commonRejectionReasons.map((reason, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-3 border border-slate-200">
                <span className="text-sm text-slate-700">{reason.reason}</span>
                <Badge variant="secondary" size="sm">
                  {reason.count} veces ({reason.percentage.toFixed(0)}%)
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {insights.improvementSuggestions.length > 0 && (
        <div className="bg-white rounded-lg p-4 border border-indigo-300">
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Sugerencias de mejora</h4>
          <ul className="space-y-1">
            {insights.improvementSuggestions.map((suggestion, idx) => (
              <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default PlaybookLearningInsights;

