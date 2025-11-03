import React from 'react';
import { ReferralCampaign, getStatusLabel, getStatusColor, getRewardTypeLabel } from '../api/referrals';
import { MoreVertical, Play, Pause, Eye, Edit, Copy } from 'lucide-react';

interface CampaignStatusCardProps {
  campaign: ReferralCampaign;
  onViewDetails: (campaignId: string) => void;
  onToggleStatus: (campaignId: string) => void;
  onEdit?: (campaignId: string) => void;
  onDuplicate?: (campaignId: string) => void;
}

export const CampaignStatusCard: React.FC<CampaignStatusCardProps> = ({
  campaign,
  onViewDetails,
  onToggleStatus,
  onEdit,
  onDuplicate
}) => {
  const statusLabel = getStatusLabel(campaign.status);
  const statusColor = getStatusColor(campaign.status);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{campaign.name}</h3>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-1 rounded ${statusColor}`}>
              {statusLabel}
            </span>
            <span className="text-sm text-gray-600">
              {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
            </span>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button className="p-1 text-gray-500 hover:bg-gray-100 rounded">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      {campaign.stats && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Referidos</p>
            <p className="text-2xl font-bold text-blue-700">{campaign.stats.referrals}</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Conversiones</p>
            <p className="text-2xl font-bold text-green-700">{campaign.stats.conversions}</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Tasa</p>
            <p className="text-2xl font-bold text-purple-700">
              {campaign.stats.conversionRate?.toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {/* Rewards */}
      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Referente</p>
            <p className="text-sm font-semibold text-gray-900">
              {getRewardTypeLabel(campaign.referrerReward.type)}
            </p>
            <p className="text-xs text-gray-600">
              {campaign.referrerReward.value}
              {campaign.referrerReward.type.includes('discount') && '%'}
              {campaign.referrerReward.type === 'free_sessions' && ' sesiones'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Referido</p>
            <p className="text-sm font-semibold text-gray-900">
              {getRewardTypeLabel(campaign.referredReward.type)}
            </p>
            <p className="text-xs text-gray-600">
              {campaign.referredReward.value}
              {campaign.referredReward.type.includes('discount') && '%'}
              {campaign.referredReward.type === 'free_sessions' && ' sesiones'}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails(campaign.id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <Eye className="w-4 h-4" />
          Ver Detalles
        </button>
        <button
          onClick={() => onToggleStatus(campaign.id)}
          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition ${
            campaign.status === 'active'
              ? 'text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
              : 'text-green-700 bg-green-50 hover:bg-green-100'
          }`}
        >
          {campaign.status === 'active' ? (
            <>
              <Pause className="w-4 h-4" />
              Pausar
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Activar
            </>
          )}
        </button>
      </div>

      {/* Additional Actions */}
      {(onEdit || onDuplicate) && (
        <div className="flex gap-2 mt-2">
          {onEdit && (
            <button
              onClick={() => onEdit(campaign.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>
          )}
          {onDuplicate && (
            <button
              onClick={() => onDuplicate(campaign.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <Copy className="w-4 h-4" />
              Duplicar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

