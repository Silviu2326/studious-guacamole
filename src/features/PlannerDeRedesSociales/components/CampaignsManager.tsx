import React, { useState } from 'react';
import { Campaign } from '../api/social';
import { Card, Button, Modal } from '../../../components/componentsreutilizables';
import { Target, TrendingUp, Calendar, Plus, Edit2, Trash2 } from 'lucide-react';

interface CampaignsManagerProps {
  campaigns: Campaign[];
  onCampaignCreate?: (campaign: Omit<Campaign, 'id'>) => void;
  onCampaignEdit?: (id: string, campaign: Partial<Campaign>) => void;
}

export const CampaignsManager: React.FC<CampaignsManagerProps> = ({
  campaigns,
  onCampaignCreate,
  onCampaignEdit
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'completed':
        return 'Completada';
      case 'draft':
        return 'Borrador';
      default:
        return status;
    }
  };

  const calculateProgress = (current: number, goal?: number) => {
    if (!goal || goal === 0) return 0;
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Campañas de Marketing</h3>
        <Button
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus size={18} />}
          size="sm"
        >
          Nueva Campaña
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map((campaign) => (
          <Card
            key={campaign.id}
            variant="hover"
            className="p-4 ring-1 ring-gray-200 hover:ring-blue-400 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{campaign.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{campaign.description}</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                    {getStatusLabel(campaign.status)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(campaign.startDate).toLocaleDateString('es-ES')} - {new Date(campaign.endDate).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setSelectedCampaign(campaign)}>
                  <Edit2 size={16} />
                </Button>
              </div>
            </div>

            {/* Métricas */}
            <div className="space-y-3 mt-4">
              {campaign.goals.reach && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">Alcance</span>
                    <span className="text-xs text-gray-600">
                      {campaign.currentMetrics.reach.toLocaleString()} / {campaign.goals.reach.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${calculateProgress(campaign.currentMetrics.reach, campaign.goals.reach)}%` }}
                    />
                  </div>
                </div>
              )}

              {campaign.goals.engagement && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">Engagement</span>
                    <span className="text-xs text-gray-600">
                      {campaign.currentMetrics.engagement} / {campaign.goals.engagement}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${calculateProgress(campaign.currentMetrics.engagement, campaign.goals.engagement)}%` }}
                    />
                  </div>
                </div>
              )}

              {campaign.goals.conversions && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">Conversiones</span>
                    <span className="text-xs text-gray-600">
                      {campaign.currentMetrics.conversions} / {campaign.goals.conversions}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${calculateProgress(campaign.currentMetrics.conversions, campaign.goals.conversions)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                <Target size={14} className="inline mr-1" />
                {campaign.posts.length} publicación{campaign.posts.length !== 1 ? 'es' : ''} vinculada{campaign.posts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {campaigns.length === 0 && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Target size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay campañas</h3>
          <p className="text-gray-600 mb-4">Crea tu primera campaña para organizar y medir tus publicaciones</p>
          <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus size={18} />}>
            Crear Campaña
          </Button>
        </Card>
      )}
    </div>
  );
};

