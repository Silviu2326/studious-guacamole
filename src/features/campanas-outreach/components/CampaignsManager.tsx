import React, { useState } from 'react';
import { Card, Button, MetricCards, Tabs, Modal } from '../../../components/componentsreutilizables';
import { useCampaigns } from '../hooks/useCampaigns';
import { CampaignsList } from './CampaignsList';
import { OutreachSequencesList } from './OutreachSequencesList';
import { CampaignBuilder } from './CampaignBuilder';
import { CampaignAnalytics } from './CampaignAnalytics';
import { AudienceSegmenter } from './AudienceSegmenter';
import { Campaign, OutreachSequence } from '../types';
import { 
  BarChart3, 
  RefreshCw, 
  Target, 
  DollarSign, 
  Users, 
  X,
  AlertTriangle,
  TrendingUp,
  LineChart
} from 'lucide-react';

export const CampaignsManager: React.FC = () => {
  const {
    campaigns,
    outreachSequences,
    audienceSegments,
    loading,
    error,
    createCampaign,
    createOutreachSequence,
    deleteCampaign,
    clearError
  } = useCampaigns();

  const [activeTab, setActiveTab] = useState('campaigns');
  const [showCampaignBuilder, setShowCampaignBuilder] = useState(false);
  const [showOutreachBuilder, setShowOutreachBuilder] = useState(false);
  const [showSegmenter, setShowSegmenter] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Calcular métricas generales
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalSequences = outreachSequences.length;
  const activeSequences = outreachSequences.filter(s => s.status === 'active').length;

  const totalSent = campaigns.reduce((sum, c) => sum + c.metrics.sent, 0);
  const totalConverted = campaigns.reduce((sum, c) => sum + c.metrics.converted, 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + (c.metrics.revenue || 0), 0);
  const averageConversionRate = totalSent > 0 ? (totalConverted / totalSent) * 100 : 0;

  const metricas = [
    {
      id: 'total-campaigns',
      title: 'Total Campañas',
      value: totalCampaigns,
      subtitle: `${activeCampaigns} activas`,
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'primary' as const,
      trend: {
        value: 12,
        direction: 'up' as const,
        label: 'vs mes anterior'
      }
    },
    {
      id: 'total-sequences',
      title: 'Secuencias Outreach',
      value: totalSequences,
      subtitle: `${activeSequences} activas`,
      icon: <RefreshCw className="w-5 h-5" />,
      color: 'info' as const,
      trend: {
        value: 8,
        direction: 'up' as const,
        label: 'vs mes anterior'
      }
    },
    {
      id: 'conversion-rate',
      title: 'Tasa Conversión',
      value: `${averageConversionRate.toFixed(1)}%`,
      subtitle: `${totalConverted} conversiones`,
      icon: <Target className="w-5 h-5" />,
      color: 'success' as const,
      trend: {
        value: 3.2,
        direction: 'up' as const,
        label: 'vs mes anterior'
      }
    },
    {
      id: 'total-revenue',
      title: 'Ingresos Generados',
      value: `$${totalRevenue.toLocaleString()}`,
      subtitle: 'Total campañas',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'warning' as const,
      trend: {
        value: 15.8,
        direction: 'up' as const,
        label: 'vs mes anterior'
      }
    }
  ];

  const tabs = [
    { id: 'campaigns', label: 'Campañas', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'outreach', label: 'Outreach', icon: <RefreshCw className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <LineChart className="w-4 h-4" /> },
    { id: 'segments', label: 'Segmentos', icon: <Users className="w-4 h-4" /> }
  ];

  const handleCreateCampaign = async (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => {
    const success = await createCampaign(campaignData);
    if (success) {
      setShowCampaignBuilder(false);
    }
  };

  const handleCreateSequence = async (sequenceData: Omit<OutreachSequence, 'id' | 'createdAt' | 'updatedAt'>) => {
    const success = await createOutreachSequence(sequenceData);
    if (success) {
      setShowOutreachBuilder(false);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta campaña?')) {
      await deleteCampaign(id);
    }
  };

  const handleViewAnalytics = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setActiveTab('analytics');
  };

  if (error) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={clearError}>Reintentar</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => setShowSegmenter(true)}
            variant="ghost"
            size="md"
          >
            <Users size={20} className="mr-2" />
            Crear Segmento
          </Button>
          <Button
            onClick={() => setShowOutreachBuilder(true)}
            variant="secondary"
            size="md"
          >
            <RefreshCw size={20} className="mr-2" />
            Nueva Secuencia
          </Button>
          <Button
            onClick={() => setShowCampaignBuilder(true)}
            variant="primary"
            size="md"
          >
            <BarChart3 size={20} className="mr-2" />
            Nueva Campaña
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <MetricCards data={metricas} columns={4} />

      {/* Tabs */}
      <Card className="p-0 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div
            role="tablist"
            aria-label="Secciones"
            className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
          >
            {tabs.map((tab) => {
              const activo = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activo}
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                    activo
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  ].join(' ')}
                >
                  {React.cloneElement(tab.icon, {
                    size: 18,
                    className: activo ? 'opacity-100' : 'opacity-70'
                  })}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>
        
      {/* Contenido de la pestaña activa */}
      <div className="mt-6">
        {activeTab === 'campaigns' && (
          <CampaignsList
            campaigns={campaigns}
            loading={loading}
            onDelete={handleDeleteCampaign}
            onViewAnalytics={handleViewAnalytics}
          />
        )}
        
        {activeTab === 'outreach' && (
          <OutreachSequencesList
            sequences={outreachSequences}
            loading={loading}
          />
        )}
        
        {activeTab === 'analytics' && (
          <CampaignAnalytics
            campaign={selectedCampaign}
            onBack={() => setActiveTab('campaigns')}
          />
        )}
        
        {activeTab === 'segments' && (
          <AudienceSegmenter
            segments={audienceSegments}
            loading={loading}
          />
        )}
      </div>

      {/* Modals */}
      {showCampaignBuilder && (
        <CampaignBuilder
          onClose={() => setShowCampaignBuilder(false)}
          onSave={handleCreateCampaign}
          audienceSegments={audienceSegments}
        />
      )}

      {showOutreachBuilder && (
        <Modal
          isOpen={showOutreachBuilder}
          onClose={() => setShowOutreachBuilder(false)}
          title="Nueva Secuencia de Outreach"
          size="lg"
        >
          <p className="text-gray-600 text-center py-12">
            Constructor de secuencias de outreach en desarrollo...
          </p>
        </Modal>
      )}

      {showSegmenter && (
        <Modal
          isOpen={showSegmenter}
          onClose={() => setShowSegmenter(false)}
          title="Crear Segmento de Audiencia"
          size="lg"
        >
          <p className="text-gray-600 text-center py-12">
            Segmentador de audiencia en desarrollo...
          </p>
        </Modal>
      )}
    </div>
  );
};