import React, { useState } from 'react';
import { Card, Button, Select } from '../../../components/componentsreutilizables';
import { Campaign, CampaignStatus, CampaignType, CampaignObjective } from '../types';
import { MessageSquare, Mail, Smartphone, Bell, Smartphone as InApp, Target, Users, LineChart, Trash2, BarChart3, Search, X, Loader2, Package } from 'lucide-react';

// Componente LightInput para inputs según guía de estilos
type LightInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const LightInput: React.FC<LightInputProps> = ({ leftIcon, rightIcon, className = '', ...props }) => (
  <div className={`relative ${className}`}>
    {leftIcon && (
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <span className="text-slate-400">{leftIcon}</span>
      </span>
    )}
    <input
      {...props}
      className={[
        'w-full rounded-xl bg-white text-slate-900 placeholder-slate-400',
        'ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400',
        leftIcon ? 'pl-10' : 'pl-3',
        rightIcon ? 'pr-10' : 'pr-3',
        'py-2.5'
      ].join(' ')}
    />
    {rightIcon && (
      <span className="absolute inset-y-0 right-0 flex items-center pr-3">
        {rightIcon}
      </span>
    )}
  </div>
);

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
    const iconMap: Record<string, React.ReactNode> = {
      whatsapp: <MessageSquare className="w-4 h-4 inline" />,
      email: <Mail className="w-4 h-4 inline" />,
      sms: <Smartphone className="w-4 h-4 inline" />,
      push_notification: <Bell className="w-4 h-4 inline" />,
      in_app: <InApp className="w-4 h-4 inline" />
    };
    
    return channels.map((channel, idx) => (
      <span key={idx} className="mx-1">{iconMap[channel] || null}</span>
    ));
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
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  const filtrosActivos = (searchTerm ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0) + (typeFilter !== 'all' ? 1 : 0);
  const hayFiltrosActivos = filtrosActivos > 0;

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1">
                <LightInput
                  placeholder="Buscar campañas por nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search size={20} />}
                  rightIcon={
                    searchTerm ? (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X size={16} />
                      </button>
                    ) : undefined
                  }
                />
              </div>
            </div>
          </div>

          {/* Panel de filtros */}
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado
                </label>
                <Select
                  options={statusOptions}
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value as CampaignStatus | 'all')}
                  placeholder="Filtrar por estado"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo
                </label>
                <Select
                  options={typeOptions}
                  value={typeFilter}
                  onChange={(value) => setTypeFilter(value as CampaignType | 'all')}
                  placeholder="Filtrar por tipo"
                />
              </div>
            </div>
          </div>

          {/* Resumen de resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{filteredCampaigns.length} {filteredCampaigns.length === 1 ? 'campaña encontrada' : 'campañas encontradas'}</span>
            {hayFiltrosActivos && (
              <span>{filtrosActivos} {filtrosActivos === 1 ? 'filtro aplicado' : 'filtros aplicados'}</span>
            )}
          </div>
        </div>
      </Card>

      {/* Lista de campañas */}
      {filteredCampaigns.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay campañas</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'No se encontraron campañas con los filtros aplicados'
              : 'Crea tu primera campaña para comenzar'
            }
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden p-6 bg-white shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {campaign.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(campaign.status)}`}>
                      {getStatusLabel(campaign.status)}
                    </span>
                  </div>
                  
                  {campaign.description && (
                    <p className="text-gray-600 mb-3">
                      {campaign.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span className="text-slate-600">
                        {getObjectiveLabel(campaign.objective)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👥</span>
                      <span className="text-slate-600">
                        {campaign.audience.size} contactos
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getChannelIcons(campaign.channels)}</span>
                      <span className="text-slate-600">
                        {campaign.channels.length} canal{campaign.channels.length !== 1 ? 'es' : ''}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                  {/* Métricas rápidas */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {campaign.metrics.sent}
                      </div>
                      <div className="text-xs text-gray-500">
                        Enviados
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {campaign.metrics.openRate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        Apertura
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {campaign.metrics.conversionRate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        Conversión
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-lg font-semibold text-green-600">
                        ${(campaign.metrics.revenue || 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
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
                      <LineChart className="w-4 h-4 mr-1" />
                      Analytics
                    </Button>
                    
                    <Button
                      onClick={() => onDelete(campaign.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
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