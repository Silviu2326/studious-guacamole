import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Tooltip } from '../../../components/componentsreutilizables';
import { MarketTrendAlert, CompetitorMovementAlert } from '../types';
import { getMarketTrendsAlertsService } from '../services/intelligenceService';
import { useAuth } from '../../../context/AuthContext';
import {
  TrendingUp,
  AlertTriangle,
  Users,
  Loader2,
  Clock,
  Target,
  ArrowRight,
  Bell,
  Eye,
  Zap,
  Shield,
  Lightbulb,
} from 'lucide-react';

interface MarketTrendsAlertsSectionProps {
  period?: '7d' | '30d' | '90d';
  onPeriodChange?: (period: '7d' | '30d' | '90d') => void;
  trainerId?: string;
}

const relevanceColors: Record<MarketTrendAlert['relevance'], string> = {
  alta: 'red',
  media: 'yellow',
  baja: 'blue',
};

const urgencyColors: Record<MarketTrendAlert['urgency'], string> = {
  urgente: 'red',
  alta: 'orange',
  media: 'yellow',
  baja: 'blue',
};

const threatColors: Record<CompetitorMovementAlert['threatLevel'], string> = {
  alto: 'red',
  medio: 'yellow',
  bajo: 'blue',
};

const opportunityColors: Record<CompetitorMovementAlert['opportunityLevel'], string> = {
  alto: 'green',
  medio: 'yellow',
  bajo: 'blue',
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
  return `Hace ${Math.floor(diffDays / 30)} meses`;
};

export const MarketTrendsAlertsSection: React.FC<MarketTrendsAlertsSectionProps> = ({
  period = '30d',
  onPeriodChange,
  trainerId,
}) => {
  const { user } = useAuth();
  const [marketTrends, setMarketTrends] = useState<MarketTrendAlert[]>([]);
  const [competitorMovements, setCompetitorMovements] = useState<CompetitorMovementAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'trends' | 'competitors' | 'all'>('all');
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);

  useEffect(() => {
    loadAlerts();
  }, [period, trainerId || user?.id]);

  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      const response = await getMarketTrendsAlertsService({
        trainerId: trainerId || user?.id,
        period,
        minRelevance: 'media', // Solo alertas de relevancia media o alta
      });
      if (response.success) {
        setMarketTrends(response.marketTrends || []);
        setCompetitorMovements(response.competitorMovements || []);
      }
    } catch (error) {
      console.error('Error cargando alertas de mercado', error);
    } finally {
      setIsLoading(false);
    }
  };

  const allAlerts = [
    ...marketTrends.map((t) => ({ ...t, type: 'trend' as const, id: `trend-${t.id}` })),
    ...competitorMovements.map((m) => ({ ...m, type: 'movement' as const, id: `movement-${m.id}` })),
  ].sort((a, b) => {
    // Ordenar por urgencia y relevancia
    const urgencyOrder = { urgente: 4, alta: 3, media: 2, baja: 1 };
    const aUrgency = 'urgency' in a ? urgencyOrder[a.urgency] : urgencyOrder[a.relevance === 'alta' ? 'alta' : 'media'];
    const bUrgency = 'urgency' in b ? urgencyOrder[b.urgency] : urgencyOrder[b.relevance === 'alta' ? 'alta' : 'media'];
    return bUrgency - aUrgency;
  });

  const filteredAlerts = activeTab === 'all'
    ? allAlerts
    : activeTab === 'trends'
    ? allAlerts.filter((a) => a.type === 'trend')
    : allAlerts.filter((a) => a.type === 'movement');

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-white shadow-sm border border-slate-200/70">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
              <Bell size={20} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-slate-900">Alertas de Mercado y Competencia</h2>
              <p className="text-sm text-slate-600 mt-1">
                Tendencias de mercado y movimientos competidores relevantes para anticiparte
              </p>
            </div>
          </div>
          {onPeriodChange && (
            <div className="flex items-center gap-2">
              <select
                value={period}
                onChange={(e) => onPeriodChange(e.target.value as '7d' | '30d' | '90d')}
                className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="7d">7 días</option>
                <option value="30d">30 días</option>
                <option value="90d">90 días</option>
              </select>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'all' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('all')}
          >
            Todas ({allAlerts.length})
          </Button>
          <Button
            variant={activeTab === 'trends' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('trends')}
          >
            Tendencias ({marketTrends.length})
          </Button>
          <Button
            variant={activeTab === 'competitors' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('competitors')}
          >
            Competidores ({competitorMovements.length})
          </Button>
        </div>
      </Card>

      {/* Loading state */}
      {isLoading ? (
        <Card className="p-12 flex items-center justify-center bg-white shadow-sm border border-slate-200/70">
          <div className="flex items-center gap-3 text-slate-500">
            <Loader2 className="animate-spin" size={24} />
            <span>Analizando mercado y competencia...</span>
          </div>
        </Card>
      ) : filteredAlerts.length === 0 ? (
        <Card className="p-8 bg-white shadow-sm border border-slate-200/70">
          <p className="text-center text-slate-500">
            No se encontraron alertas para el período seleccionado.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const isExpanded = expandedAlertId === alert.id;
            const isTrend = alert.type === 'trend';
            const trendAlert = isTrend ? (alert as MarketTrendAlert & { type: 'trend' }) : null;
            const movementAlert = !isTrend ? (alert as CompetitorMovementAlert & { type: 'movement' }) : null;

            return (
              <Card
                key={alert.id}
                className={`p-6 bg-white shadow-sm border ${
                  isTrend
                    ? 'border-blue-200'
                    : movementAlert?.threatLevel === 'alto'
                    ? 'border-red-200'
                    : 'border-amber-200'
                } transition-all`}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {isTrend ? (
                          <>
                            <Badge variant="blue" size="sm">
                              <TrendingUp size={12} className="mr-1" />
                              Tendencias
                            </Badge>
                            <Badge variant={relevanceColors[trendAlert!.relevance] as any} size="sm">
                              Relevancia {trendAlert!.relevance}
                            </Badge>
                            <Badge variant={urgencyColors[trendAlert!.urgency] as any} size="sm">
                              {trendAlert!.urgency === 'urgente' ? 'Urgente' : `Urgencia ${trendAlert!.urgency}`}
                            </Badge>
                          </>
                        ) : (
                          <>
                            <Badge variant="orange" size="sm">
                              <Users size={12} className="mr-1" />
                              Competidor
                            </Badge>
                            <Badge variant={relevanceColors[movementAlert!.relevance] as any} size="sm">
                              Relevancia {movementAlert!.relevance}
                            </Badge>
                            <Badge variant={urgencyColors[movementAlert!.urgency] as any} size="sm">
                              {movementAlert!.urgency === 'urgente' ? 'Urgente' : `Urgencia ${movementAlert!.urgency}`}
                            </Badge>
                            <Badge variant={threatColors[movementAlert!.threatLevel] as any} size="sm">
                              <Shield size={12} className="mr-1" />
                              Amenaza {movementAlert!.threatLevel}
                            </Badge>
                            <Badge variant={opportunityColors[movementAlert!.opportunityLevel] as any} size="sm">
                              <Lightbulb size={12} className="mr-1" />
                              Oportunidad {movementAlert!.opportunityLevel}
                            </Badge>
                          </>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        {isTrend ? trendAlert!.title : movementAlert!.title}
                      </h3>
                      <p className="text-sm text-slate-600 mb-2">
                        {isTrend ? trendAlert!.description : movementAlert!.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {formatDate(isTrend ? trendAlert!.detectedAt : movementAlert!.detectedAt)}
                        </span>
                        <span>Fuente: {isTrend ? trendAlert!.source : movementAlert!.source}</span>
                      </div>
                    </div>
                  </div>

                  {/* Detalles específicos */}
                  {isTrend && trendAlert && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Potencial de Impacto</p>
                          <Badge variant={trendAlert.impact.potential === 'alto' ? 'red' : 'yellow'} size="sm">
                            {trendAlert.impact.potential}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Plazo</p>
                          <Badge variant="blue" size="sm">
                            {trendAlert.impact.timeframe.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      {trendAlert.impact.affectedChannels && trendAlert.impact.affectedChannels.length > 0 && (
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Canales afectados:</p>
                          <div className="flex flex-wrap gap-1">
                            {trendAlert.impact.affectedChannels.map((channel) => (
                              <Badge key={channel} variant="blue" size="sm">
                                {channel === 'ads' ? 'Ads' : channel === 'organico' ? 'Orgánico' : 'Referidos'}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {!isTrend && movementAlert && (
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-slate-700 mb-1">Competidor:</p>
                          <p className="text-sm text-slate-900">{movementAlert.competitorName}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-700 mb-1">Qué hizo:</p>
                          <p className="text-sm text-slate-900">{movementAlert.details.what}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-700 mb-1">Cuándo:</p>
                          <p className="text-sm text-slate-900">{movementAlert.details.when}</p>
                        </div>
                        {movementAlert.details.where && (
                          <div>
                            <p className="text-xs font-medium text-slate-700 mb-1">Dónde:</p>
                            <p className="text-sm text-slate-900">{movementAlert.details.where}</p>
                          </div>
                        )}
                        {movementAlert.details.impact && (
                          <div>
                            <p className="text-xs font-medium text-slate-700 mb-1">Impacto potencial:</p>
                            <p className="text-sm text-slate-900">{movementAlert.details.impact}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Insights accionables (solo para trends) */}
                  {isTrend && trendAlert && trendAlert.actionableInsights && trendAlert.actionableInsights.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">Insights Accionables</h4>
                      <ul className="space-y-1">
                        {trendAlert.actionableInsights.map((insight, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                            <Lightbulb size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Acciones recomendadas */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-slate-900">
                        Acciones Recomendadas (
                        {isTrend
                          ? trendAlert!.recommendedActions.length
                          : movementAlert!.recommendedResponse.length}
                        )
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedAlertId(isExpanded ? null : alert.id)}
                      >
                        {isExpanded ? 'Ocultar' : 'Ver todas'}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {(isTrend
                        ? trendAlert!.recommendedActions
                        : movementAlert!.recommendedResponse
                      )
                        .slice(0, isExpanded ? undefined : 2)
                        .map((action, idx) => (
                          <div
                            key={idx}
                            className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-start gap-2">
                              <ArrowRight size={14} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm text-slate-900 font-medium mb-1">{action.action}</p>
                                <div className="flex items-center gap-3 text-xs text-slate-600">
                                  <div className="flex items-center gap-1">
                                    <Clock size={12} />
                                    <span>{action.timeframe}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Target size={12} />
                                    <span>Prioridad: {action.priority}/10</span>
                                  </div>
                                </div>
                                {'rationale' in action && (
                                  <p className="text-xs text-slate-500 mt-1 italic">{action.rationale}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MarketTrendsAlertsSection;

