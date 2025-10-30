import React, { useState } from 'react';
import { Card, Button, Input, Select } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Campaign, CampaignStatus, CampaignType, CampaignObjective } from '../types';

interface CampaignsListProps {
  campaigns: Campaign[];
  loading: boolean;
  onDelete: (id: string) => void;
  onViewAnalytics: (campaign: Campaign) => void;
}

export const CampaignsList: React.FC<CampaignsListProps> = ({
  campaigns,
  loading,
  onDelete,
  onViewAnalytics
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<CampaignType | 'all'>('all');

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'draft', label: 'Borrador' },
    { value: 'scheduled', label: 'Programada' },
    { value: 'active', label: 'Activa' },
    { value: 'paused', label: 'Pausada' },
    { value: 'completed', label: 'Completada' },
    { value: 'cancelled', label: 'Cancelada' }
  ];

  const typeOptions = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'one_time', label: 'Campaña única' },
    { value: 'recurring', label: 'Recurrente' },
    { value: 'automated', label: 'Automatizada' },
    { value: 'drip', label: 'Secuencia de goteo' }
  ];

  const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'draft':
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: CampaignStatus) => {
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

  const getObjectiveLabel = (objective: CampaignObjective) => {
    switch (objective) {
      case 'captacion': return 'Captación';
      case 'retencion': return 'Retención';
      case 'promocion': return 'Promoción';
      case 'reactivacion': return 'Reactivación';
      case 'upselling': return 'Upselling';
      case 'nurturing': return 'Nurturing';
      default: return objective;
    }
  };

  const getChannelIcons = (channels: string[]) => {
    const iconMap: Record<string, string> = {
      whatsapp: '💬',
      email: '📧',
      sms: '📱',
      push_notification: '🔔',
      in_app: '📲'
    };
    
    return channels.map(channel => iconMap[channel] || '📢').join(' ');
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesType = typeFilter === 'all' || campaign.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`${ds.shimmer} rounded-2xl h-32`} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Buscar campañas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value as CampaignStatus | 'all')}
          placeholder="Filtrar por estado"
        />
        <Select
          options={typeOptions}
          value={typeFilter}
          onChange={(value) => setTypeFilter(value as CampaignType | 'all')}
          placeholder="Filtrar por tipo"
        />
      </div>

      {/* Lista de campañas */}
      {filteredCampaigns.length === 0 ? (
        <Card className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📊</span>
          </div>
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} mb-2`}>
            No hay campañas
          </h3>
          <p className={`${ds.typography.body} ${ds.color.textSecondary}`}>
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'No se encontraron campañas con los filtros aplicados'
              : 'Crea tu primera campaña para comenzar'
            }
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} variant="hover" className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`${ds.typography.h3} ${ds.color.textPrimary}`}>
                      {campaign.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(campaign.status)}`}>
                      {getStatusLabel(campaign.status)}
                    </span>
                  </div>
                  
                  {campaign.description && (
                    <p className={`${ds.typography.body} ${ds.color.textSecondary} mb-3`}>
                      {campaign.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎯</span>
                      <span className={ds.color.textSecondary}>
                        {getObjectiveLabel(campaign.objective)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👥</span>
                      <span className={ds.color.textSecondary}>
                        {campaign.audience.size} contactos
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getChannelIcons(campaign.channels)}</span>
                      <span className={ds.color.textSecondary}>
                        {campaign.channels.length} canal{campaign.channels.length !== 1 ? 'es' : ''}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                  {/* Métricas rápidas */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className={`${ds.typography.h4} ${ds.color.textPrimary}`}>
                        {campaign.metrics.sent}
                      </div>
                      <div className={`${ds.typography.caption} ${ds.color.textMuted}`}>
                        Enviados
                      </div>
                    </div>
                    
                    <div>
                      <div className={`${ds.typography.h4} ${ds.color.textPrimary}`}>
                        {campaign.metrics.openRate.toFixed(1)}%
                      </div>
                      <div className={`${ds.typography.caption} ${ds.color.textMuted}`}>
                        Apertura
                      </div>
                    </div>
                    
                    <div>
                      <div className={`${ds.typography.h4} ${ds.color.textPrimary}`}>
                        {campaign.metrics.conversionRate.toFixed(1)}%
                      </div>
                      <div className={`${ds.typography.caption} ${ds.color.textMuted}`}>
                        Conversión
                      </div>
                    </div>
                    
                    <div>
                      <div className={`${ds.typography.h4} text-green-600 dark:text-green-400`}>
                        ${(campaign.metrics.revenue || 0).toLocaleString()}
                      </div>
                      <div className={`${ds.typography.caption} ${ds.color.textMuted}`}>
                        Ingresos
                      </div>
                    </div>
                  </div>
                  
                  {/* Acciones */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onViewAnalytics(campaign)}
                      variant="ghost"
                      size="sm"
                    >
                      <span className="mr-1">📈</span>
                      Analytics
                    </Button>
                    
                    <Button
                      onClick={() => onDelete(campaign.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                    >
                      <span className="mr-1">🗑️</span>
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};