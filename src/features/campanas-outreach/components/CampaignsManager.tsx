import React, { useState } from 'react';
import { Card, Button, MetricCards, Tabs } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { useCampaigns } from '../hooks/useCampaigns';
import { CampaignsList } from './CampaignsList';
import { OutreachSequencesList } from './OutreachSequencesList';
import { CampaignBuilder } from './CampaignBuilder';
import { CampaignAnalytics } from './CampaignAnalytics';
import { AudienceSegmenter } from './AudienceSegmenter';
import { Campaign, OutreachSequence } from '../types';

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
      icon: <span>📊</span>,
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
      icon: <span>🔄</span>,
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
      icon: <span>🎯</span>,
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
      icon: <span>💰</span>,
      color: 'warning' as const,
      trend: {
        value: 15.8,
        direction: 'up' as const,
        label: 'vs mes anterior'
      }
    }
  ];

  const tabs = [
    { id: 'campaigns', label: 'Campañas', icon: '📊' },
    { id: 'outreach', label: 'Outreach', icon: '🔄' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'segments', label: 'Segmentos', icon: '👥' }
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
      <div className={`${ds.card} ${ds.cardPad} text-center`}>
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl text-white">⚠️</span>
        </div>
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} mb-4`}>
          Error al cargar datos
        </h3>
        <p className={`${ds.typography.body} ${ds.color.textSecondary} mb-6`}>
          {error}
        </p>
        <Button onClick={clearError} variant="primary">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className={`${ds.typography.h1} ${ds.color.textPrimary}`}>
            Campañas y Outreach
          </h1>
          <p className={`${ds.typography.body} ${ds.color.textSecondary} mt-2`}>
            Gestiona campañas coordinadas y automatización de outreach para tu gimnasio
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => setShowSegmenter(true)}
            variant="ghost"
            size="md"
          >
            <span className="mr-2">👥</span>
            Crear Segmento
          </Button>
          <Button
            onClick={() => setShowOutreachBuilder(true)}
            variant="secondary"
            size="md"
          >
            <span className="mr-2">🔄</span>
            Nueva Secuencia
          </Button>
          <Button
            onClick={() => setShowCampaignBuilder(true)}
            variant="primary"
            size="md"
          >
            <span className="mr-2">📊</span>
            Nueva Campaña
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <MetricCards data={metricas} columns={4} />

      {/* Tabs */}
      <Card>
        <Tabs
          items={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
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
      </Card>

      {/* Modals */}
      {showCampaignBuilder && (
        <CampaignBuilder
          onClose={() => setShowCampaignBuilder(false)}
          onSave={handleCreateCampaign}
          audienceSegments={audienceSegments}
        />
      )}

      {showOutreachBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary}`}>
                Nueva Secuencia de Outreach
              </h2>
              <Button
                onClick={() => setShowOutreachBuilder(false)}
                variant="ghost"
                size="sm"
              >
                ✕
              </Button>
            </div>
            <p className={`${ds.typography.body} ${ds.color.textSecondary} text-center py-12`}>
              Constructor de secuencias de outreach en desarrollo...
            </p>
          </Card>
        </div>
      )}

      {showSegmenter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary}`}>
                Crear Segmento de Audiencia
              </h2>
              <Button
                onClick={() => setShowSegmenter(false)}
                variant="ghost"
                size="sm"
              >
                ✕
              </Button>
            </div>
            <p className={`${ds.typography.body} ${ds.color.textSecondary} text-center py-12`}>
              Segmentador de audiencia en desarrollo...
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};