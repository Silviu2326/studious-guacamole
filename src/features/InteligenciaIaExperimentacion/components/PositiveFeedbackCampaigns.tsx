import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Tabs } from '../../../components/componentsreutilizables';
import {
  PositiveFeedbackCampaign,
  CampaignSuggestion,
  CustomerFeedbackData,
  GeneratePositiveFeedbackCampaignRequest,
  CampaignType,
} from '../types';
import {
  generatePositiveFeedbackCampaignService,
  autoActivateCampaignService,
  getPositiveFeedbackCampaignsService,
} from '../services/intelligenceService';
import { Sparkles, Rocket, TrendingUp, Mail, MessageSquare, Zap, CheckCircle, Clock } from 'lucide-react';

interface PositiveFeedbackCampaignsProps {
  trainerId?: string;
}

const statusColors: Record<PositiveFeedbackCampaign['status'], string> = {
  draft: 'bg-slate-100 text-slate-700',
  active: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-blue-100 text-blue-700',
};

const campaignTypeLabels: Record<CampaignType, string> = {
  'premium-invitation': 'Invitación Premium',
  'referral-program': 'Programa de Referidos',
  'upsell': 'Upsell',
  'testimonial-request': 'Solicitud de Testimonio',
  'loyalty-program': 'Programa de Lealtad',
  'custom': 'Personalizada',
};

const channelIcons: Record<string, React.ReactNode> = {
  email: <Mail size={16} />,
  whatsapp: <MessageSquare size={16} />,
  sms: <MessageSquare size={16} />,
  'in-app': <MessageSquare size={16} />,
  social: <MessageSquare size={16} />,
};

export const PositiveFeedbackCampaigns: React.FC<PositiveFeedbackCampaignsProps> = ({ trainerId }) => {
  const [campaigns, setCampaigns] = useState<PositiveFeedbackCampaign[]>([]);
  const [suggestions, setSuggestions] = useState<CampaignSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'active' | 'completed'>('all');

  useEffect(() => {
    loadCampaigns();
  }, [activeTab]);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const response = await getPositiveFeedbackCampaignsService({
        status: activeTab !== 'all' ? activeTab : undefined,
        trainerId,
        limit: 20,
      });
      setCampaigns(response.campaigns);
    } catch (error) {
      console.error('Error cargando campañas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCampaign = async (autoActivate: boolean = false) => {
    setGenerating(true);
    try {
      // Ejemplo de feedback positivo simulado
      const positiveFeedback: CustomerFeedbackData = {
        feedbackId: `feedback-${Date.now()}`,
        customerId: 'customer-001',
        customerName: 'Cliente Ejemplo',
        feedbackType: 'survey',
        content: '¡Excelente servicio! Las sesiones son muy efectivas y el entrenador es muy profesional.',
        sentiment: 'positive',
        sentimentScore: 95,
        topics: ['servicio', 'profesionalismo', 'efectividad'],
        rating: 5,
        date: new Date().toISOString(),
        source: 'Encuesta NPS',
      };

      const request: GeneratePositiveFeedbackCampaignRequest = {
        feedback: positiveFeedback,
        customerHistory: {
          totalSessions: 10,
          lastSessionDate: new Date().toISOString(),
          averageRating: 4.8,
          currentPlan: 'Básico',
          previousCampaigns: [],
        },
        campaignTypes: ['premium-invitation', 'referral-program', 'upsell'],
        trainerId,
        autoActivate,
      };

      const response = await generatePositiveFeedbackCampaignService(request);
      if (response.campaign) {
        setCampaigns([response.campaign, ...campaigns]);
      }
      if (response.suggestions) {
        setSuggestions([...suggestions, ...response.suggestions]);
      }
    } catch (error) {
      console.error('Error generando campaña:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleActivateCampaign = async (campaignId: string, feedbackId: string, customerId: string) => {
    try {
      const response = await autoActivateCampaignService({
        campaignId,
        feedbackId,
        customerId,
        trainerId,
      });
      setCampaigns(campaigns.map((c) => (c.id === campaignId ? response.campaign : c)));
    } catch (error) {
      console.error('Error activando campaña:', error);
    }
  };

  const filteredCampaigns = activeTab === 'all' 
    ? campaigns 
    : campaigns.filter((c) => c.status === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Campañas Automatizadas de Feedback Positivo</h3>
          <p className="text-sm text-slate-600 mt-1">
            Automatiza campañas basadas en feedback positivo (ej: invitar a programa premium) para aprovechar momentum.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => handleGenerateCampaign(false)}
            disabled={generating}
            leftIcon={<Sparkles size={16} />}
            variant="secondary"
            size="sm"
          >
            {generating ? 'Generando...' : 'Generar campaña'}
          </Button>
          <Button
            onClick={() => handleGenerateCampaign(true)}
            disabled={generating}
            leftIcon={<Rocket size={16} />}
            size="sm"
          >
            {generating ? 'Generando...' : 'Generar y activar'}
          </Button>
        </div>
      </div>

      <Tabs
        items={[
          { id: 'all', label: 'Todas' },
          { id: 'draft', label: 'Borradores' },
          { id: 'active', label: 'Activas' },
          { id: 'completed', label: 'Completadas' },
        ]}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as typeof activeTab)}
        variant="underline"
      />

      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-700">Sugerencias de campañas</h4>
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="p-4 border border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="info" size="sm">
                      {campaignTypeLabels[suggestion.suggestionType]}
                    </Badge>
                    <span className="text-sm font-semibold text-slate-900">{suggestion.name}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{suggestion.description}</p>
                  <p className="text-xs text-slate-600 mb-2">{suggestion.rationale}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <span>Conversión esperada: <strong>{suggestion.expectedConversionRate}%</strong></span>
                    <span>Ingresos esperados: <strong>€{suggestion.expectedRevenue}</strong></span>
                    <span>Confianza: <strong>{suggestion.confidenceScore}%</strong></span>
                  </div>
                </div>
                {suggestion.canAutoActivate && (
                  <Button
                    onClick={() => handleGenerateCampaign(true)}
                    size="sm"
                    leftIcon={<Zap size={14} />}
                  >
                    Activar
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-slate-500">Cargando campañas...</div>
      ) : filteredCampaigns.length === 0 ? (
        <Card className="p-8 text-center bg-slate-50 border border-slate-200">
          <Rocket className="mx-auto text-slate-400 mb-4" size={32} />
          <p className="text-sm text-slate-600">
            No hay campañas {activeTab !== 'all' ? `con status "${activeTab}"` : ''}. 
            {activeTab === 'all' && ' Genera una para comenzar.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="p-6 border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={campaign.status === 'active' ? 'success' : 'secondary'} size="sm">
                      {campaign.status}
                    </Badge>
                    <Badge variant="info" size="sm">
                      {campaignTypeLabels[campaign.campaignType]}
                    </Badge>
                    <Badge variant={campaign.priority === 'high' ? 'warning' : 'secondary'} size="sm">
                      {campaign.priority}
                    </Badge>
                    <h4 className="text-base font-semibold text-slate-900">{campaign.name}</h4>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{campaign.description}</p>
                  <p className="text-xs text-slate-600 mb-2">
                    <strong>Objetivo:</strong> {campaign.objective}
                  </p>
                </div>
                {campaign.status === 'draft' && (
                  <Button
                    onClick={() => handleActivateCampaign(campaign.id, campaign.feedbackId, campaign.customerId)}
                    size="sm"
                    leftIcon={<Rocket size={14} />}
                  >
                    Activar
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Contenido de la campaña */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    {channelIcons[campaign.channel] || <Mail size={16} />}
                    <span className="text-sm font-semibold text-slate-900">Contenido</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">
                    Canal: {campaign.channel} • Cliente: {campaign.customerName}
                  </p>
                  {campaign.content.subject && (
                    <p className="text-sm font-semibold text-slate-900 mb-1">
                      Asunto: {campaign.content.subject}
                    </p>
                  )}
                  <p className="text-sm text-slate-700 line-clamp-4 mb-2">{campaign.content.message}</p>
                  {campaign.content.cta && (
                    <Badge variant="primary" size="sm">
                      {campaign.content.cta}
                    </Badge>
                  )}
                </div>

                {/* Métricas y timing */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} />
                    <span className="text-sm font-semibold text-slate-900">Métricas y Timing</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Conversión esperada:</span>
                      <span className="font-semibold text-slate-900">{campaign.expectedConversionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Ingresos esperados:</span>
                      <span className="font-semibold text-slate-900">€{campaign.expectedRevenue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Timing:</span>
                      <span className="font-semibold text-slate-900">{campaign.timing.delay}</span>
                    </div>
                    {campaign.timing.bestTime && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Hora óptima:</span>
                        <span className="font-semibold text-slate-900">{campaign.timing.bestTime}</span>
                      </div>
                    )}
                    {campaign.metrics && (
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <p className="text-xs font-semibold text-slate-700 mb-1">Métricas actuales:</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {campaign.metrics.sent !== undefined && (
                            <div>
                              <span className="text-slate-600">Enviados:</span>
                              <span className="ml-1 font-semibold">{campaign.metrics.sent}</span>
                            </div>
                          )}
                          {campaign.metrics.opened !== undefined && (
                            <div>
                              <span className="text-slate-600">Abiertos:</span>
                              <span className="ml-1 font-semibold">{campaign.metrics.opened}</span>
                            </div>
                          )}
                          {campaign.metrics.converted !== undefined && (
                            <div>
                              <span className="text-slate-600">Convertidos:</span>
                              <span className="ml-1 font-semibold">{campaign.metrics.converted}</span>
                            </div>
                          )}
                          {campaign.metrics.revenue !== undefined && (
                            <div>
                              <span className="text-slate-600">Ingresos:</span>
                              <span className="ml-1 font-semibold">€{campaign.metrics.revenue}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {campaign.trigger && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs font-semibold text-slate-700 mb-2">Trigger de activación:</p>
                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <span>
                      Condición: <strong>{campaign.trigger.condition}</strong>
                    </span>
                    {campaign.trigger.minRating && (
                      <span>
                        Rating mínimo: <strong>{campaign.trigger.minRating}/5</strong>
                      </span>
                    )}
                    {campaign.trigger.sentimentScore && (
                      <span>
                        Sentimiento mínimo: <strong>{campaign.trigger.sentimentScore}/100</strong>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PositiveFeedbackCampaigns;

