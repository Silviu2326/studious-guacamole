import React from 'react';
import { Influencer } from '../api/influencers';
import { Plus, ExternalLink, Mail, Phone, Edit, Trash2 } from 'lucide-react';

interface InfluencerListTableProps {
  influencers: Influencer[];
  onSelectInfluencer: (influencerId: string) => void;
  onAddNewCampaign: (influencerId: string) => void;
  onEdit?: (influencerId: string) => void;
  onDelete?: (influencerId: string) => void;
}

/**
 * Muestra una tabla con la lista de influencers.
 * Cada fila muestra datos clave y permite acciones.
 */
export const InfluencerListTable: React.FC<InfluencerListTableProps> = ({
  influencers,
  onSelectInfluencer,
  onAddNewCampaign,
  onEdit,
  onDelete
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Influencer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nicho
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seguidores
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Engagement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Campañas Activas
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {influencers.map((influencer) => (
              <tr
                key={influencer.id}
                onClick={() => onSelectInfluencer(influencer.id)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-sm">
                        {influencer.name.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {influencer.name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        {influencer.socialLinks.instagram && (
                          <a
                            href={influencer.socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-purple-600"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {influencer.email && (
                          <a
                            href={`mailto:${influencer.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-purple-600"
                          >
                            <Mail className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {influencer.niche}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatNumber(influencer.followerCount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {influencer.engagementRate ? `${influencer.engagementRate}%` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    influencer.activeCampaigns > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {influencer.activeCampaigns}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onAddNewCampaign(influencer.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                    >
                      <Plus className="w-3 h-3" />
                      Campaña
                    </button>
                    {onEdit && (
                      <button
                        onClick={() => onEdit(influencer.id)}
                        className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(influencer.id)}
                        className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {influencers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No hay influencers registrados</p>
        </div>
      )}
    </div>
  );
};


