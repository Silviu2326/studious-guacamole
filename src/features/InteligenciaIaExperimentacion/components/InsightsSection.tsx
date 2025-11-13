import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Tooltip } from '../../../components/componentsreutilizables';
import { IntelligenceInsight, MicroSegment, OfferSuggestion } from '../types';
import { Radar, LineChart, ShieldQuestion, ExternalLink, Sparkles, Loader2, CheckCircle2, TrendingUp, Users, Gift, ArrowUpRight } from 'lucide-react';
import { convertInsightToPlaybookService, detectMicroSegmentsService, getOfferSuggestionsService } from '../services/intelligenceService';
import { useAuth } from '../../../context/AuthContext';

interface InsightsSectionProps {
  insights: IntelligenceInsight[];
  onPlaybookCreated?: (playbookId: string) => void; // Callback cuando se crea un playbook
}

const severityVariant: Record<IntelligenceInsight['severity'], 'purple' | 'yellow' | 'red'> = {
  low: 'purple',
  medium: 'yellow',
  high: 'red',
};

export const InsightsSection: React.FC<InsightsSectionProps> = ({ insights, onPlaybookCreated }) => {
  const { user } = useAuth();
  const [convertingInsightId, setConvertingInsightId] = useState<string | null>(null);
  const [convertedInsightIds, setConvertedInsightIds] = useState<Set<string>>(new Set());
  
  // User Story 2: Estado para micro-segmentos y ofertas
  const [microSegments, setMicroSegments] = useState<MicroSegment[]>([]);
  const [offerSuggestions, setOfferSuggestions] = useState<OfferSuggestion[]>([]);
  const [isLoadingSegments, setIsLoadingSegments] = useState(false);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  const [showMicroSegments, setShowMicroSegments] = useState(false);

  // Cargar micro-segmentos al montar el componente
  useEffect(() => {
    loadMicroSegments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMicroSegments = async () => {
    setIsLoadingSegments(true);
    try {
      const response = await detectMicroSegmentsService({ trainerId: user?.id });
      if (response.success && response.segments) {
        setMicroSegments(response.segments);
        // Cargar ofertas automáticamente
        loadOfferSuggestions(response.segments.map(s => s.id));
      }
    } catch (error) {
      console.error('Error cargando micro-segmentos', error);
    } finally {
      setIsLoadingSegments(false);
    }
  };

  const loadOfferSuggestions = async (segmentIds?: string[]) => {
    setIsLoadingOffers(true);
    try {
      const response = await getOfferSuggestionsService({ 
        trainerId: user?.id,
        segmentId: segmentIds && segmentIds.length === 1 ? segmentIds[0] : undefined,
      });
      if (response.success && response.suggestions) {
        setOfferSuggestions(response.suggestions);
      }
    } catch (error) {
      console.error('Error cargando sugerencias de ofertas', error);
    } finally {
      setIsLoadingOffers(false);
    }
  };

  // User Story 2: Transformar insight en playbook con un clic
  const handleConvertToPlaybook = async (insight: IntelligenceInsight) => {
    setConvertingInsightId(insight.id);
    try {
      const response = await convertInsightToPlaybookService({
        insight: insight,
        trainerId: user?.id,
      });

      if (response.success && response.playbook) {
        setConvertedInsightIds((prev) => new Set([...prev, insight.id]));
        
        // Llamar al callback si existe (la página manejará la navegación)
        if (onPlaybookCreated) {
          onPlaybookCreated(response.playbook.id);
        }
      }
    } catch (error) {
      console.error('Error convirtiendo insight en playbook', error);
    } finally {
      setConvertingInsightId(null);
    }
  };

  const getTrendBadgeVariant = (trend: MicroSegment['trend']) => {
    switch (trend) {
      case 'emerging':
        return 'purple';
      case 'growing':
        return 'green';
      case 'stable':
        return 'blue';
      case 'declining':
        return 'yellow';
      default:
        return 'blue';
    }
  };

  const getPriorityBadgeVariant = (priority: OfferSuggestion['priority']) => {
    switch (priority) {
      case 'alta':
        return 'red';
      case 'media':
        return 'yellow';
      case 'baja':
        return 'blue';
      default:
        return 'blue';
    }
  };

  return (
    <div className="space-y-6">
      {/* User Story 2: Sección de Micro-segmentos Emergentes */}
      <Card className="p-6 bg-white shadow-sm border border-slate-200/70">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <TrendingUp size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-slate-900">Micro-segmentos Emergentes</h2>
                <Badge variant="purple" size="sm">
                  IA Detectado
                </Badge>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                La IA detecta micro-segmentos emergentes (ej: ejecutivos remotos) y sugiere ofertas para capitalizar tendencias.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowMicroSegments(!showMicroSegments);
              if (!showMicroSegments && microSegments.length === 0) {
                loadMicroSegments();
              }
            }}
          >
            {showMicroSegments ? 'Ocultar' : 'Ver segmentos'}
          </Button>
        </div>

        {isLoadingSegments ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-slate-400" size={24} />
            <span className="ml-2 text-sm text-slate-600">Detectando micro-segmentos...</span>
          </div>
        ) : showMicroSegments && microSegments.length > 0 ? (
          <div className="space-y-4">
            {microSegments.map((segment) => (
              <div key={segment.id} className="rounded-xl border border-slate-200 p-4 bg-slate-50/60">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">{segment.name}</h3>
                      <Badge variant={getTrendBadgeVariant(segment.trend)} size="sm">
                        {segment.trend === 'emerging' ? 'Emergente' : 
                         segment.trend === 'growing' ? 'Creciendo' :
                         segment.trend === 'stable' ? 'Estable' : 'Declinando'}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{segment.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {segment.size} leads/clientes
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp size={12} />
                        +{segment.growthRate}% crecimiento
                      </span>
                      <span>Confianza: {segment.confidence}%</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-medium text-slate-700 mb-1">Características:</p>
                      <div className="flex flex-wrap gap-1">
                        {segment.characteristics.slice(0, 3).map((char, idx) => (
                          <Badge key={idx} variant="blue" size="sm">
                            {char}
                          </Badge>
                        ))}
                        {segment.characteristics.length > 3 && (
                          <Badge variant="blue" size="sm">
                            +{segment.characteristics.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : showMicroSegments ? (
          <div className="text-center py-8 text-slate-500">
            <p className="text-sm">No se detectaron micro-segmentos en este momento.</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={loadMicroSegments}
            >
              Reintentar
            </Button>
          </div>
        ) : null}
      </Card>

      {/* User Story 2: Sección de Sugerencias de Ofertas */}
      {showMicroSegments && offerSuggestions.length > 0 && (
        <Card className="p-6 bg-white shadow-sm border border-slate-200/70">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
              <Gift size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-slate-900">Sugerencias de Ofertas</h2>
                <Badge variant="green" size="sm">
                  {offerSuggestions.length} sugerencias
                </Badge>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Ofertas personalizadas sugeridas por IA para capitalizar los micro-segmentos detectados.
              </p>
            </div>
          </div>

          {isLoadingOffers ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-slate-400" size={24} />
              <span className="ml-2 text-sm text-slate-600">Generando sugerencias...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {offerSuggestions.map((offer) => (
                <div key={offer.id} className="rounded-xl border border-slate-200 p-4 bg-gradient-to-r from-emerald-50/50 to-white">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900">{offer.offerName}</h3>
                        <Badge variant={getPriorityBadgeVariant(offer.priority)} size="sm">
                          Prioridad {offer.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{offer.offerDescription}</p>
                      <p className="text-xs text-slate-500 mb-3">
                        <strong>Segmento:</strong> {offer.segmentName}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-slate-500">Conversión esperada</p>
                          <p className="text-sm font-semibold text-slate-900">{offer.expectedConversionRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Ingresos esperados</p>
                          <p className="text-sm font-semibold text-emerald-600">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(offer.expectedRevenue)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Tipo de oferta</p>
                          <Badge variant="blue" size="sm" className="mt-1">
                            {offer.offerType}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Canales sugeridos</p>
                          <p className="text-xs font-medium text-slate-700 mt-1">
                            {offer.suggestedChannels.join(', ')}
                          </p>
                        </div>
                      </div>
                      {offer.offerDetails.discount && (
                        <div className="mb-2">
                          <Badge variant="green" size="sm">
                            {offer.offerDetails.discount}% de descuento
                          </Badge>
                        </div>
                      )}
                      {offer.offerDetails.packageDetails && (
                        <div className="mb-2 p-2 bg-slate-50 rounded text-xs text-slate-600">
                          {offer.offerDetails.packageDetails}
                        </div>
                      )}
                      <p className="text-xs text-slate-600 italic mb-3">
                        <strong>Razón:</strong> {offer.rationale}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {offer.canCreateCampaign && (
                      <Button
                        size="sm"
                        variant="secondary"
                        leftIcon={<Sparkles size={14} />}
                        className="flex-1"
                      >
                        Crear campaña
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      rightIcon={<ArrowUpRight size={14} />}
                    >
                      Ver detalles
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Sección original de Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6 bg-white shadow-sm border border-slate-200/70">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-sky-100 text-sky-600">
            <LineChart size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-slate-900">Trend Analyzer</h2>
              <Badge variant="blue" size="sm">
                Señales emergentes
              </Badge>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Identifica patrones de crecimiento y comportamientos emergentes antes que la competencia. Conecta cada insight con playbooks y experimentos.
            </p>
            <div className="mt-4 space-y-3">
              {insights.slice(0, 2).map((insight) => (
                <div key={insight.id} className="rounded-xl border border-slate-200 p-4 bg-slate-50/60">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-slate-900">{insight.title}</p>
                    <Badge variant={severityVariant[insight.severity]} size="sm">
                      {insight.severity === 'high' ? 'Alerta' : insight.severity === 'medium' ? 'Atención' : 'Idea'}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{insight.description}</p>
                  <p className="text-xs text-slate-500 mt-2">Fuente: {insight.source}</p>
                  {/* User Story 2: Botón para transformar insight en playbook */}
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      leftIcon={
                        convertingInsightId === insight.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : convertedInsightIds.has(insight.id) ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <Sparkles size={14} />
                        )
                      }
                      onClick={() => handleConvertToPlaybook(insight)}
                      disabled={convertingInsightId === insight.id || convertedInsightIds.has(insight.id)}
                      className="flex-1"
                    >
                      {convertingInsightId === insight.id
                        ? 'Creando playbook...'
                        : convertedInsightIds.has(insight.id)
                        ? 'Playbook creado'
                        : 'Transformar en playbook'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-4" variant="secondary" leftIcon={<Radar size={16} />}>
              Abrir Trend Analyzer
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white shadow-sm border border-slate-200/70">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
            <ShieldQuestion size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-slate-900">Competitive Analysis & Market Intelligence</h2>
              <Badge variant="orange" size="sm">
                Benchmark continuo
              </Badge>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Centraliza señales de la competencia, monitorea lanzamientos clave y acciona respuestas rápidas.
            </p>
            <div className="mt-4 space-y-3">
              {insights.slice(2).map((insight) => (
                <div key={insight.id} className="rounded-xl border border-slate-200 p-4 bg-slate-50/60">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-slate-900">{insight.title}</p>
                    <Badge variant={severityVariant[insight.severity]} size="sm">
                      {insight.severity === 'high' ? 'Riesgo' : insight.severity === 'medium' ? 'Observación' : 'Nota'}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{insight.description}</p>
                  <p className="text-xs text-slate-500 mt-2">Fuente: {insight.source}</p>
                  {/* User Story 2: Botón para transformar insight en playbook */}
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      leftIcon={
                        convertingInsightId === insight.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : convertedInsightIds.has(insight.id) ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <Sparkles size={14} />
                        )
                      }
                      onClick={() => handleConvertToPlaybook(insight)}
                      disabled={convertingInsightId === insight.id || convertedInsightIds.has(insight.id)}
                      className="flex-1"
                    >
                      {convertingInsightId === insight.id
                        ? 'Creando playbook...'
                        : convertedInsightIds.has(insight.id)
                        ? 'Playbook creado'
                        : 'Transformar en playbook'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Button variant="secondary" leftIcon={<ExternalLink size={16} />}>
                Ver tablero competitivo
              </Button>
              <Tooltip content="Activa alertas inteligentes para recibir notificaciones en tiempo real.">
                <span className="text-sm text-slate-500 cursor-help">Alertas inteligentes</span>
              </Tooltip>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InsightsSection;









