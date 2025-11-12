import React from 'react';
import { Button, Card, Badge } from '../../../components/componentsreutilizables';
import { Brain, Sparkles, Wand2, Clock, Pause, Edit } from 'lucide-react';
import { IntelligentRecommendations } from './IntelligentRecommendations';
import { TopCampaignsDropdown } from './TopCampaignsDropdown';
import { ExperimentsIndicator } from './ExperimentsIndicator';
import { ObjectivesSection } from './ObjectivesSection';
import { CampaignExperimentSearch } from './CampaignExperimentSearch';
import { HighlightedMetric } from './HighlightedMetric';
import { SectorTrendsLink } from './SectorTrendsLink';
import { IntelligenceOverviewResponse } from '../types';

interface IntelligenceHeaderProps {
  overview?: IntelligenceOverviewResponse | null;
  onCreatePlaybook?: () => void;
  onLaunchExperiment?: () => void;
  onViewFeedback?: () => void;
  onViewCampaignDetails?: (campaignId: string) => void;
  onDuplicateCampaign?: (campaignId: string) => void;
  onViewExperimentResults?: () => void;
  onPauseSend?: (sendId: string) => void;
  onEditSend?: (sendId: string) => void;
}

export const IntelligenceHeader: React.FC<IntelligenceHeaderProps> = ({
  overview,
  onCreatePlaybook,
  onLaunchExperiment,
  onViewFeedback,
  onViewCampaignDetails,
  onDuplicateCampaign,
  onViewExperimentResults,
  onPauseSend,
  onEditSend,
}) => {
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays === 0) {
      if (diffHours < 1) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return `En ${diffMins} min`;
      }
      return `Hoy a las ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Mañana a las ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${date.toLocaleDateString('es-ES', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    }
  };

  const upcomingSends = overview?.upcomingSends?.slice(0, 3) || [];
  return (
    <Card className="p-8 bg-white/90 backdrop-blur shadow-sm border border-slate-200/70">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-start gap-4 flex-1">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-sky-100 text-indigo-600">
            <Brain size={28} />
          </div>
          <div className="flex-1">
            <Badge className="mb-3 inline-flex items-center gap-2 bg-indigo-50 text-indigo-700">
              <Sparkles size={16} />
              Centro de Comunicación Inteligente
            </Badge>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Inteligencia, IA & Experimentación
            </h1>
            <p className="mt-3 text-base text-slate-600 max-w-2xl">
              Coordina un hub inteligente para decidir el siguiente mejor paso. Orquesta playbooks,
              personalización avanzada y experimentos de alto impacto con una sola vista.
            </p>
          </div>
        </div>

        {/* Highlighted Metric - ROI/Customers */}
        {overview?.campaignPerformanceMetric && (
          <div className="lg:max-w-xs w-full">
            <HighlightedMetric metric={overview.campaignPerformanceMetric} />
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <CampaignExperimentSearch
            campaigns={overview?.topCampaigns}
            experiments={overview?.experiments}
            onCampaignClick={onViewCampaignDetails}
            onExperimentClick={(experimentId) => {
              onViewExperimentResults?.();
              // TODO: Navigate to specific experiment or highlight it
              console.log('View experiment:', experimentId);
            }}
          />
          
          {/* Header Actions Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {overview?.topCampaigns && overview.topCampaigns.length > 0 && (
              <TopCampaignsDropdown
                campaigns={overview.topCampaigns}
                onViewDetails={onViewCampaignDetails}
                onDuplicate={onDuplicateCampaign}
              />
            )}
            {overview?.experiments && overview.experiments.length > 0 && (
              <ExperimentsIndicator
                experiments={overview.experiments}
                onViewResults={onViewExperimentResults}
              />
            )}
            {overview?.sectorTrends && (
              <SectorTrendsLink sectorTrends={overview.sectorTrends} />
            )}
            <div className="flex flex-col sm:flex-row gap-3 ml-auto">
              <Button onClick={onCreatePlaybook} leftIcon={<Wand2 size={18} />} variant="secondary">
                Nuevo Playbook IA
              </Button>
              <Button onClick={onLaunchExperiment} leftIcon={<Sparkles size={18} />}>
                Lanzar Experimento
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Objectives Section */}
      {overview?.objectives && overview.objectives.length > 0 && (
        <ObjectivesSection objectives={overview.objectives} />
      )}

      {/* Próximos Envíos Section */}
      {upcomingSends.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-200/70">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Clock size={20} className="text-indigo-600" />
              Próximos Envíos
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {upcomingSends.map((send) => (
              <div
                key={send.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/70 hover:bg-slate-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {send.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-slate-600">
                      {formatDateTime(send.scheduledDate)}
                    </p>
                    <span className="text-xs text-slate-400">•</span>
                    <p className="text-xs text-slate-600">
                      {send.recipientCount} destinatarios
                    </p>
                  </div>
                  <Badge variant="outline" size="sm" className="mt-1.5">
                    {send.channel}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 ml-3">
                  <button
                    onClick={() => onPauseSend?.(send.id)}
                    className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
                    title="Pausar"
                  >
                    <Pause size={16} className="text-slate-600" />
                  </button>
                  <button
                    onClick={() => onEditSend?.(send.id)}
                    className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
                    title="Editar"
                  >
                    <Edit size={16} className="text-slate-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {overview && (
        <IntelligentRecommendations
          overview={overview}
          onCreatePlaybook={onCreatePlaybook}
          onLaunchExperiment={onLaunchExperiment}
          onViewFeedback={onViewFeedback}
        />
      )}
    </Card>
  );
};

export default IntelligenceHeader;









