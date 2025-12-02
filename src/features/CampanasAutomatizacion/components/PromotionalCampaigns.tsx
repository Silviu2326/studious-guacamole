import React, { useState } from 'react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { Mail, MessageCircle, Smartphone, Target, Calendar, TrendingUp, Users, DollarSign, BarChart3, Sparkles, FileText, Image, Video, Download, Eye, Filter } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import { PromotionalCampaign, MessagingChannel, SpecializedTemplate, SpecializedTemplateCategory } from '../types';

const channelLabel: Record<MessagingChannel, { label: string; variant: React.ComponentProps<typeof Badge>['variant']; icon: React.ReactNode }> = {
  email: { label: 'Email', variant: 'blue', icon: <Mail className="w-3.5 h-3.5" /> },
  whatsapp: { label: 'WhatsApp', variant: 'green', icon: <MessageCircle className="w-3.5 h-3.5" /> },
  sms: { label: 'SMS', variant: 'purple', icon: <Smartphone className="w-3.5 h-3.5" /> },
  push: { label: 'Push', variant: 'orange', icon: <Smartphone className="w-3.5 h-3.5" /> },
  'in-app': { label: 'In-App', variant: 'indigo', icon: <Smartphone className="w-3.5 h-3.5" /> },
};

const statusLabel: Record<string, { label: string; variant: React.ComponentProps<typeof Badge>['variant'] }> = {
  draft: { label: 'Borrador', variant: 'gray' },
  scheduled: { label: 'Programada', variant: 'blue' },
  running: { label: 'En curso', variant: 'green' },
  paused: { label: 'Pausada', variant: 'yellow' },
  completed: { label: 'Completada', variant: 'purple' },
};

const recipientTypeLabel: Record<string, string> = {
  all: 'Todos los clientes',
  segment: 'Segmento específico',
  'inactive-clients': 'Clientes inactivos',
  custom: 'Clientes personalizados',
};

interface PromotionalCampaignsProps {
  campaigns: PromotionalCampaign[];
  specializedTemplates?: SpecializedTemplate[];
  loading?: boolean;
  className?: string;
  onCampaignCreate?: () => void;
  onCampaignEdit?: (campaign: PromotionalCampaign) => void;
  onCampaignDelete?: (campaignId: string) => void;
  onCampaignSend?: (campaignId: string) => void;
  onCampaignSchedule?: (campaignId: string) => void;
  onViewResults?: (campaignId: string) => void;
  onTemplateUse?: (template: SpecializedTemplate) => void;
  onTemplatePreview?: (template: SpecializedTemplate) => void;
}

const categoryLabels: Record<SpecializedTemplateCategory, { label: string; description: string; color: string }> = {
  'retos-30-dias': { label: 'Retos 30 Días', description: 'Plantillas para desafíos y retos de 30 días', color: 'purple' },
  'upsell-packs': { label: 'Upsell Packs', description: 'Plantillas para ofertas de upsell y packs', color: 'green' },
  'recuperacion-inactivos': { label: 'Recuperación Inactivos', description: 'Plantillas para reactivar clientes inactivos', color: 'orange' },
};

export const PromotionalCampaigns: React.FC<PromotionalCampaignsProps> = ({
  campaigns,
  specializedTemplates = [],
  loading = false,
  className = '',
  onCampaignCreate,
  onCampaignEdit,
  onCampaignDelete,
  onCampaignSend,
  onCampaignSchedule,
  onViewResults,
  onTemplateUse,
  onTemplatePreview,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SpecializedTemplateCategory | 'all'>('all');
  const [showTemplates, setShowTemplates] = useState(true);
  if (loading && campaigns.length === 0) {
    return (
      <Card className={className}>
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className={`${ds.shimmer} h-32`} />
          ))}
        </div>
      </Card>
    );
  }

  const formatRecipients = (recipients: PromotionalCampaign['recipients']) => {
    if (recipients.type === 'all') {
      return 'Todos los clientes';
    }
    if (recipients.type === 'segment' && recipients.segmentName) {
      return recipients.segmentName;
    }
    if (recipients.type === 'inactive-clients') {
      return 'Clientes inactivos';
    }
    if (recipients.type === 'custom' && recipients.clientNames) {
      return `${recipients.clientNames.length} cliente(s) seleccionado(s)`;
    }
    return recipientTypeLabel[recipients.type] || 'Sin destinatarios';
  };

  const filteredTemplates = selectedCategory === 'all' 
    ? specializedTemplates 
    : specializedTemplates.filter(t => t.category === selectedCategory);

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'form': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center">
              <Target className="w-5 h-5 text-pink-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Campañas Promocionales
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Crea campañas promocionales con mensajes personalizados, selecciona destinatarios (todos, segmentos específicos, clientes inactivos), programa envío y mide resultados
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="pink" size="md">
            {campaigns.length} campañas
          </Badge>
          {onCampaignCreate && (
            <button
              onClick={onCampaignCreate}
              className="px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Nueva campaña
            </button>
          )}
        </div>
      </div>

      {/* Biblioteca de Plantillas IA Especializadas - US-CA-04 */}
      {specializedTemplates.length > 0 && (
        <div className="mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Plantillas IA Especializadas
              </h3>
              <Badge variant="purple" size="sm">
                {specializedTemplates.length} plantillas
              </Badge>
            </div>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            >
              {showTemplates ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
            Biblioteca categorizada con copy multi canal, assets sugeridos y formularios. Reutiliza plantillas probadas con tasas históricas de éxito.
          </p>

          {showTemplates && (
            <>
              {/* Filtros por categoría */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Todas
                </button>
                {Object.entries(categoryLabels).map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key as SpecializedTemplateCategory)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      selectedCategory === key
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Lista de plantillas */}
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
                  <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    No hay plantillas en esta categoría
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map((template) => {
                    const categoryInfo = categoryLabels[template.category];
                    return (
                      <div
                        key={template.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-gradient-to-br from-white to-slate-50 dark:from-[#0f192c] dark:to-[#101b30] hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={categoryInfo.color as any} size="sm">
                                {template.categoryLabel}
                              </Badge>
                              {template.successRate && (
                                <Badge variant="green" size="sm">
                                  {template.successRate.toFixed(0)}% éxito
                                </Badge>
                              )}
                            </div>
                            <h4 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                              {template.name}
                            </h4>
                            <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-2`}>
                              {template.description}
                            </p>
                          </div>
                        </div>

                        {/* Canales disponibles */}
                        <div className="mb-3">
                          <p className={`${ds.typography.caption} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                            Canales:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {template.channels.map((channel) => {
                              const channelInfo = channelLabel[channel];
                              return (
                                <Badge key={channel} variant={channelInfo.variant} size="sm">
                                  <span className="flex items-center gap-1">
                                    {channelInfo.icon}
                                    {channelInfo.label}
                                  </span>
                                </Badge>
                              );
                            })}
                          </div>
                        </div>

                        {/* Assets sugeridos */}
                        {template.assets.length > 0 && (
                          <div className="mb-3">
                            <p className={`${ds.typography.caption} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                              Assets sugeridos:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {template.assets.slice(0, 3).map((asset) => (
                                <div
                                  key={asset.id}
                                  className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-600 dark:text-slate-400"
                                >
                                  {getAssetIcon(asset.type)}
                                  <span>{asset.name}</span>
                                </div>
                              ))}
                              {template.assets.length > 3 && (
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  +{template.assets.length - 3} más
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Estadísticas */}
                        <div className="mb-3 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-slate-600 dark:text-slate-400">Usos:</span>
                              <span className="ml-1 font-semibold text-slate-900 dark:text-slate-100">
                                {template.usageCount}
                              </span>
                            </div>
                            {template.estimatedConversionRate && (
                              <div>
                                <span className="text-slate-600 dark:text-slate-400">Conversión:</span>
                                <span className="ml-1 font-semibold text-green-600 dark:text-green-400">
                                  {template.estimatedConversionRate.toFixed(1)}%
                                </span>
                              </div>
                            )}
                          </div>
                          {template.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {template.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                          {onTemplateUse && (
                            <button
                              onClick={() => onTemplateUse(template)}
                              className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                            >
                              Usar plantilla
                            </button>
                          )}
                          {onTemplatePreview && (
                            <button
                              onClick={() => onTemplatePreview(template)}
                              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {campaigns.length === 0 ? (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
            No hay campañas promocionales creadas
          </p>
          {onCampaignCreate && (
            <button
              onClick={onCampaignCreate}
              className="px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Crear primera campaña
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => {
            const channelInfo = channelLabel[campaign.channel];
            const statusInfo = statusLabel[campaign.status] || statusLabel.draft;
            const tracking = campaign.tracking;

            return (
              <div
                key={campaign.id}
                className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4 bg-gradient-to-br from-white to-slate-50 dark:from-[#0f192c] dark:to-[#101b30]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {campaign.name}
                      </h3>
                      <Badge variant={statusInfo.variant} size="sm">
                        {statusInfo.label}
                      </Badge>
                      <Badge variant={channelInfo.variant} size="sm">
                        <span className="flex items-center gap-1">
                          {channelInfo.icon}
                          {channelInfo.label}
                        </span>
                      </Badge>
                    </div>
                    <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-3`}>
                      {campaign.description}
                    </p>

                    {/* Destinatarios */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span className={`${ds.typography.caption} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          Destinatarios:
                        </span>
                        <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                          {formatRecipients(campaign.recipients)}
                        </span>
                      </div>
                    </div>

                    {/* Fechas */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                          {campaign.status === 'scheduled' && campaign.scheduledDate
                            ? `Programada para: ${new Date(campaign.scheduledDate).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}`
                            : campaign.sentDate
                              ? `Enviada: ${new Date(campaign.sentDate).toLocaleDateString('es-ES', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}`
                              : 'Sin fecha programada'}
                        </span>
                      </div>
                    </div>

                    {/* Mensaje */}
                    <div className="mb-3">
                      <p className={`${ds.typography.caption} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                        Mensaje promocional:
                      </p>
                      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                        <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} whitespace-pre-wrap`}>
                          {campaign.messageTemplate}
                        </p>
                      </div>
                    </div>

                    {/* Resultados / Tracking */}
                    {tracking && (
                      <div className="mb-3 p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-2">
                          <BarChart3 className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className={`${ds.typography.caption} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                            Resultados:
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Enviados</div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {tracking.sentCount.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Apertura</div>
                            <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                              {tracking.openRate.toFixed(1)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Clics</div>
                            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                              {tracking.clickRate.toFixed(1)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Conversión</div>
                            <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                              {tracking.conversionRate.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        {tracking.revenueGenerated && (
                          <div className="mt-2 pt-2 border-t border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                              <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                                Ingresos generados: {new Intl.NumberFormat('es-ES', {
                                  style: 'currency',
                                  currency: 'EUR',
                                }).format(tracking.revenueGenerated)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-700 flex-wrap">
                  {campaign.status === 'draft' && onCampaignSend && (
                    <button
                      onClick={() => onCampaignSend(campaign.id)}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      Enviar ahora
                    </button>
                  )}
                  {campaign.status === 'draft' && onCampaignSchedule && (
                    <button
                      onClick={() => onCampaignSchedule(campaign.id)}
                      className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      Programar envío
                    </button>
                  )}
                  {tracking && onViewResults && (
                    <button
                      onClick={() => onViewResults(campaign.id)}
                      className="px-3 py-1.5 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                    >
                      Ver resultados
                    </button>
                  )}
                  {onCampaignEdit && (
                    <button
                      onClick={() => onCampaignEdit(campaign)}
                      className="px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                    >
                      Editar
                    </button>
                  )}
                  {onCampaignDelete && (
                    <button
                      onClick={() => onCampaignDelete(campaign.id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

