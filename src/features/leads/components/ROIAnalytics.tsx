import React, { useState, useEffect } from 'react';
import { Card, MetricCards, Button, Select, Tabs } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { ROIMetrics, ROIAlert, LeadSource } from '../types';
import { ROIService } from '../services/roiService';
import { CampaignCostManager } from './CampaignCostManager';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  BarChart3,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface ROIAnalyticsProps {
  businessType: 'entrenador' | 'gimnasio';
}

export const ROIAnalytics: React.FC<ROIAnalyticsProps> = ({ businessType }) => {
  const [metrics, setMetrics] = useState<ROIMetrics[]>([]);
  const [alerts, setAlerts] = useState<ROIAlert[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'30' | '60' | '90' | 'all'>('30');
  const [activeTab, setActiveTab] = useState<'analytics' | 'costs'>('analytics');

  useEffect(() => {
    loadROIData();
  }, [businessType, selectedPeriod]);

  const loadROIData = async () => {
    setLoading(true);
    try {
      const period = selectedPeriod !== 'all' ? {
        start: new Date(Date.now() - parseInt(selectedPeriod) * 24 * 60 * 60 * 1000),
        end: new Date()
      } : undefined;

      const [roiMetrics, roiAlerts, roiSummary] = await Promise.all([
        ROIService.calculateROIBySource(businessType, period),
        ROIService.checkROIAlerts(businessType),
        ROIService.getROISummary(businessType, period)
      ]);

      setMetrics(roiMetrics);
      setAlerts(roiAlerts);
      setSummary(roiSummary);
    } catch (error) {
      console.error('Error cargando ROI:', error);
    } finally {
      setLoading(false);
    }
  };

  const sourceLabels: Record<LeadSource, string> = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    tiktok: 'TikTok',
    whatsapp: 'WhatsApp',
    referido: 'Referido',
    landing_page: 'Landing Page',
    google_ads: 'Google Ads',
    evento: 'Evento',
    visita_centro: 'Visita al Centro',
    campaña_pagada: 'Campaña Pagada',
    contenido_organico: 'Contenido Orgánico',
    otro: 'Otro'
  };

  const getROIColor = (roi: number) => {
    if (roi < 0) return 'text-red-600 dark:text-red-400';
    if (roi < 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getROIBadge = (roi: number) => {
    if (roi < 0) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    if (roi < 50) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className={`animate-spin ${ds.radius.full} h-8 w-8 border-b-2 ${ds.color.primaryBg}`}></div>
      </div>
    );
  }

  const summaryMetrics = summary ? [
    {
      id: 'totalCost',
      title: 'Inversión Total',
      value: `${summary.totalCost.toFixed(2)} EUR`,
      icon: <DollarSign className="w-5 h-5" />,
      color: 'primary' as const
    },
    {
      id: 'totalRevenue',
      title: 'Ingresos Generados',
      value: `${summary.totalRevenue.toFixed(2)} EUR`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'success' as const
    },
    {
      id: 'averageROI',
      title: 'ROI Promedio',
      value: `${summary.averageROI.toFixed(1)}%`,
      icon: <Target className="w-5 h-5" />,
      color: summary.averageROI > 0 ? 'success' as const : 'error' as const,
      trend: {
        value: Math.abs(summary.averageROI),
        direction: summary.averageROI > 0 ? 'up' as const : 'down' as const,
        label: 'vs período anterior'
      }
    },
    {
      id: 'conversions',
      title: 'Conversiones',
      value: summary.totalConversions,
      subtitle: `de ${summary.totalLeads} leads`,
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'info' as const
    }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-[#F1F5F9]">
          ROI y Atribución por Fuente
        </h2>
        <p className="text-gray-600 dark:text-[#94A3B8] mt-1">
          Analiza el retorno de inversión de tus campañas de marketing
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        items={[
          { id: 'analytics', label: 'Analytics ROI', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'costs', label: 'Gestionar Costos', icon: <DollarSign className="w-4 h-4" /> }
        ]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as 'analytics' | 'costs')}
        variant="pills"
      />

      {activeTab === 'costs' ? (
        <CampaignCostManager businessType={businessType} />
      ) : (
        <>
          {/* Selector de período */}
          <div className="flex items-center justify-end">
            <Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as '30' | '60' | '90' | 'all')}
              options={[
                { value: '30', label: 'Últimos 30 días' },
                { value: '60', label: 'Últimos 60 días' },
                { value: '90', label: 'Últimos 90 días' },
                { value: 'all', label: 'Todo el período' }
              ]}
            />
          </div>

      {/* Alertas */}
      {alerts.length > 0 && (
        <Card>
          <div className={ds.spacing.md}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-[#F1F5F9]">
                Alertas de ROI
              </h3>
            </div>
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg ${
                    alert.severity === 'critical'
                      ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                      : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-[#F1F5F9]">
                        {sourceLabels[alert.source]}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-[#94A3B8] mt-1">
                        {alert.message}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      alert.severity === 'critical'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {alert.severity === 'critical' ? 'Crítico' : 'Advertencia'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Métricas resumen */}
      {summary && (
        <MetricCards data={summaryMetrics} columns={4} />
      )}

      {/* Tabla de ROI por fuente */}
      <Card>
        <div className={ds.spacing.xl}>
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-6`}>
            ROI por Fuente
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-[#334155]">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-[#F1F5F9]">
                    Fuente
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-[#F1F5F9]">
                    Inversión
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-[#F1F5F9]">
                    Leads
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-[#F1F5F9]">
                    Conversiones
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-[#F1F5F9]">
                    Costo/Lead
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-[#F1F5F9]">
                    Costo/Conversión
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-[#F1F5F9]">
                    Ingresos
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-[#F1F5F9]">
                    ROI
                  </th>
                </tr>
              </thead>
              <tbody>
                {metrics.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-600 dark:text-[#94A3B8]">
                      No hay datos de ROI disponibles. Registra costos de campañas para ver métricas.
                    </td>
                  </tr>
                ) : (
                  metrics.map((metric) => (
                    <tr
                      key={metric.source}
                      className="border-b border-gray-100 dark:border-[#334155] hover:bg-gray-50 dark:hover:bg-[#1E1E2E]"
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900 dark:text-[#F1F5F9]">
                          {sourceLabels[metric.source]}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          {metric.conversionRate.toFixed(1)}% conversión
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 text-gray-900 dark:text-[#F1F5F9]">
                        {metric.totalCost.toFixed(2)} EUR
                      </td>
                      <td className="text-right py-3 px-4 text-gray-900 dark:text-[#F1F5F9]">
                        {metric.totalLeads}
                      </td>
                      <td className="text-right py-3 px-4 text-gray-900 dark:text-[#F1F5F9]">
                        {metric.convertedLeads}
                      </td>
                      <td className="text-right py-3 px-4 text-gray-900 dark:text-[#F1F5F9]">
                        {metric.costPerLead.toFixed(2)} EUR
                      </td>
                      <td className="text-right py-3 px-4 text-gray-900 dark:text-[#F1F5F9]">
                        {metric.costPerConversion > 0 ? `${metric.costPerConversion.toFixed(2)} EUR` : '-'}
                      </td>
                      <td className="text-right py-3 px-4 text-gray-900 dark:text-[#F1F5F9]">
                        {metric.totalRevenue.toFixed(2)} EUR
                      </td>
                      <td className="text-right py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          {metric.roi >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                          )}
                          <span className={`font-semibold ${getROIColor(metric.roi)}`}>
                            {metric.roi.toFixed(1)}%
                          </span>
                        </div>
                        <div className={`text-xs mt-1 px-2 py-0.5 rounded inline-block ${getROIBadge(metric.roi)}`}>
                          {metric.roiRatio.toFixed(2)}x
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Mejores y peores fuentes */}
      {summary && (summary.bestSource || summary.worstSource) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {summary.bestSource && (
            <Card>
              <div className={ds.spacing.md}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h4 className="font-semibold text-gray-900 dark:text-[#F1F5F9]">
                    Mejor Fuente
                  </h4>
                </div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {sourceLabels[summary.bestSource]}
                </p>
                <p className="text-sm text-gray-600 dark:text-[#94A3B8] mt-1">
                  Mayor ROI en el período seleccionado
                </p>
              </div>
            </Card>
          )}
          {summary.worstSource && (
            <Card>
              <div className={ds.spacing.md}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <h4 className="font-semibold text-gray-900 dark:text-[#F1F5F9]">
                    Fuente a Revisar
                  </h4>
                </div>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {sourceLabels[summary.worstSource]}
                </p>
                <p className="text-sm text-gray-600 dark:text-[#94A3B8] mt-1">
                  Menor ROI - Considera optimizar o pausar
                </p>
              </div>
            </Card>
          )}
        </div>
      )}
        </>
      )}
    </div>
  );
};

