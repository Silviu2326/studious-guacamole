import React, { useState, useEffect } from 'react';
import { Card, Button, MetricCards } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Campaign, CampaignAnalytics as CampaignAnalyticsType, ROIData } from '../types';
import { useCampaigns } from '../hooks/useCampaigns';

interface CampaignAnalyticsProps {
  campaign: Campaign | null;
  onBack: () => void;
}

export const CampaignAnalytics: React.FC<CampaignAnalyticsProps> = ({
  campaign,
  onBack
}) => {
  const { loadCampaignAnalytics, loadROIData, loading } = useCampaigns();
  const [analytics, setAnalytics] = useState<CampaignAnalyticsType | null>(null);
  const [roiData, setROIData] = useState<ROIData | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'channels' | 'roi'>('overview');

  useEffect(() => {
    if (campaign) {
      loadAnalyticsData();
    }
  }, [campaign]);

  const loadAnalyticsData = async () => {
    if (!campaign) return;

    try {
      const [analyticsResult, roiResult] = await Promise.all([
        loadCampaignAnalytics(campaign.id),
        loadROIData(campaign.id)
      ]);
      
      setAnalytics(analyticsResult);
      setROIData(roiResult);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  if (!campaign) {
    return (
      <Card className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">📈</span>
        </div>
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} mb-2`}>
          Selecciona una campaña
        </h3>
        <p className={`${ds.typography.body} ${ds.color.textSecondary} mb-6`}>
          Elige una campaña de la lista para ver sus analytics detallados
        </p>
        <Button onClick={onBack} variant="primary">
          Volver a Campañas
        </Button>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 dark:text-green-400';
      case 'completed': return 'text-blue-600 dark:text-blue-400';
      case 'paused': return 'text-yellow-600 dark:text-yellow-400';
      case 'cancelled': return 'text-red-600 dark:text-red-400';
      default: return ds.color.textSecondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Borrador';
      case 'scheduled': return 'Programada';
      case 'active': return 'Activa';
      case 'paused': return 'Pausada';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const overviewMetrics = [
    {
      id: 'sent',
      title: 'Mensajes Enviados',
      value: campaign.metrics.sent.toLocaleString(),
      subtitle: 'Total de envíos',
      icon: <span>📤</span>,
      color: 'primary' as const
    },
    {
      id: 'delivered',
      title: 'Tasa de Entrega',
      value: `${campaign.metrics.deliveryRate.toFixed(1)}%`,
      subtitle: `${campaign.metrics.delivered} entregados`,
      icon: <span>✅</span>,
      color: 'success' as const,
      trend: {
        value: 2.1,
        direction: 'up' as const,
        label: 'vs promedio'
      }
    },
    {
      id: 'opened',
      title: 'Tasa de Apertura',
      value: `${campaign.metrics.openRate.toFixed(1)}%`,
      subtitle: `${campaign.metrics.opened} aperturas`,
      icon: <span>👁️</span>,
      color: 'info' as const,
      trend: {
        value: 5.3,
        direction: 'up' as const,
        label: 'vs promedio'
      }
    },
    {
      id: 'converted',
      title: 'Conversiones',
      value: campaign.metrics.converted,
      subtitle: `${campaign.metrics.conversionRate.toFixed(1)}% tasa`,
      icon: <span>🎯</span>,
      color: 'warning' as const,
      trend: {
        value: 8.7,
        direction: 'up' as const,
        label: 'vs promedio'
      }
    }
  ];

  const channelMetrics = analytics ? Object.entries(analytics.channelBreakdown).map(([channel, metrics]) => {
    const channelIcons: Record<string, string> = {
      whatsapp: '💬',
      email: '📧',
      sms: '📱',
      push_notification: '🔔',
      in_app: '📲'
    };

    const channelNames: Record<string, string> = {
      whatsapp: 'WhatsApp',
      email: 'Email',
      sms: 'SMS',
      push_notification: 'Push',
      in_app: 'In-App'
    };

    return {
      id: channel,
      title: channelNames[channel] || channel,
      value: metrics.sent,
      subtitle: `${metrics.conversionRate.toFixed(1)}% conversión`,
      icon: <span>{channelIcons[channel] || '📢'}</span>,
      color: 'primary' as const
    };
  }).filter(metric => metric.value > 0) : [];

  const roiMetrics = roiData ? [
    {
      id: 'total-revenue',
      title: 'Ingresos Totales',
      value: `$${roiData.totalRevenue.toLocaleString()}`,
      subtitle: 'Generados por la campaña',
      icon: <span>💰</span>,
      color: 'success' as const
    },
    {
      id: 'total-cost',
      title: 'Costo Total',
      value: `$${roiData.totalCost.toLocaleString()}`,
      subtitle: 'Inversión en la campaña',
      icon: <span>💸</span>,
      color: 'warning' as const
    },
    {
      id: 'roi',
      title: 'ROI',
      value: `${roiData.roi.toFixed(0)}%`,
      subtitle: 'Retorno de inversión',
      icon: <span>📈</span>,
      color: roiData.roi > 0 ? 'success' as const : 'error' as const,
      trend: {
        value: roiData.roi,
        direction: roiData.roi > 0 ? 'up' as const : 'down' as const,
        label: 'retorno'
      }
    },
    {
      id: 'cpa',
      title: 'Costo por Adquisición',
      value: `$${roiData.costPerAcquisition.toFixed(0)}`,
      subtitle: 'Por conversión',
      icon: <span>🎯</span>,
      color: 'info' as const
    }
  ] : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className={`${ds.shimmer} rounded-2xl h-20`} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`${ds.shimmer} rounded-2xl h-32`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button onClick={onBack} variant="ghost" size="sm">
              ← Volver
            </Button>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary}`}>
              Analytics: {campaign.name}
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(campaign.status)}`}>
              {getStatusLabel(campaign.status)}
            </span>
          </div>
          <p className={`${ds.typography.body} ${ds.color.textSecondary}`}>
            Análisis detallado del rendimiento de la campaña
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveView('overview')}
            variant={activeView === 'overview' ? 'primary' : 'ghost'}
            size="sm"
          >
            📊 Resumen
          </Button>
          <Button
            onClick={() => setActiveView('channels')}
            variant={activeView === 'channels' ? 'primary' : 'ghost'}
            size="sm"
          >
            📱 Canales
          </Button>
          <Button
            onClick={() => setActiveView('roi')}
            variant={activeView === 'roi' ? 'primary' : 'ghost'}
            size="sm"
          >
            💰 ROI
          </Button>
        </div>
      </div>

      {/* Información de la campaña */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} mb-2`}>
              Objetivo
            </h4>
            <p className={ds.color.textSecondary}>
              {campaign.objective === 'captacion' && 'Captación de nuevos socios'}
              {campaign.objective === 'retencion' && 'Retención de socios'}
              {campaign.objective === 'promocion' && 'Promoción de servicios'}
              {campaign.objective === 'reactivacion' && 'Reactivación de socios'}
              {campaign.objective === 'upselling' && 'Venta cruzada'}
              {campaign.objective === 'nurturing' && 'Nutrición de leads'}
            </p>
          </div>
          
          <div>
            <h4 className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} mb-2`}>
              Audiencia
            </h4>
            <p className={ds.color.textSecondary}>
              {campaign.audience.name} ({campaign.audience.size} contactos)
            </p>
          </div>
          
          <div>
            <h4 className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} mb-2`}>
              Canales
            </h4>
            <div className="flex gap-2">
              {campaign.channels.map(channel => (
                <span key={channel} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                  {channel === 'whatsapp' && '💬 WhatsApp'}
                  {channel === 'email' && '📧 Email'}
                  {channel === 'sms' && '📱 SMS'}
                  {channel === 'push_notification' && '🔔 Push'}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Métricas según la vista activa */}
      {activeView === 'overview' && (
        <MetricCards data={overviewMetrics} columns={4} />
      )}

      {activeView === 'channels' && channelMetrics.length > 0 && (
        <MetricCards data={channelMetrics} columns={Math.min(channelMetrics.length, 4)} />
      )}

      {activeView === 'roi' && roiMetrics.length > 0 && (
        <MetricCards data={roiMetrics} columns={4} />
      )}

      {/* Detalles adicionales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} mb-4`}>
            Rendimiento por Métrica
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className={ds.color.textSecondary}>Tasa de Entrega</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${campaign.metrics.deliveryRate}%` }}
                  />
                </div>
                <span className={`${ds.typography.bodySmall} font-semibold`}>
                  {campaign.metrics.deliveryRate.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={ds.color.textSecondary}>Tasa de Apertura</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${campaign.metrics.openRate}%` }}
                  />
                </div>
                <span className={`${ds.typography.bodySmall} font-semibold`}>
                  {campaign.metrics.openRate.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={ds.color.textSecondary}>Tasa de Clics</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${campaign.metrics.clickRate}%` }}
                  />
                </div>
                <span className={`${ds.typography.bodySmall} font-semibold`}>
                  {campaign.metrics.clickRate.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={ds.color.textSecondary}>Tasa de Conversión</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${campaign.metrics.conversionRate}%` }}
                  />
                </div>
                <span className={`${ds.typography.bodySmall} font-semibold`}>
                  {campaign.metrics.conversionRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} mb-4`}>
            Información de la Campaña
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className={ds.color.textSecondary}>Fecha de creación:</span>
              <span className={ds.color.textPrimary}>
                {campaign.createdAt.toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className={ds.color.textSecondary}>Última actualización:</span>
              <span className={ds.color.textPrimary}>
                {campaign.updatedAt.toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className={ds.color.textSecondary}>Tipo de campaña:</span>
              <span className={ds.color.textPrimary}>
                {campaign.type === 'one_time' && 'Única'}
                {campaign.type === 'recurring' && 'Recurrente'}
                {campaign.type === 'automated' && 'Automatizada'}
                {campaign.type === 'drip' && 'Goteo'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className={ds.color.textSecondary}>Creado por:</span>
              <span className={ds.color.textPrimary}>
                {campaign.createdBy}
              </span>
            </div>
            
            {campaign.metrics.revenue && (
              <div className="flex justify-between">
                <span className={ds.color.textSecondary}>Ingresos generados:</span>
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  ${campaign.metrics.revenue.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};