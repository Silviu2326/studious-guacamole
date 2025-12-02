import React from 'react';
import { Influencer } from '../api/influencers';
import { Plus, ExternalLink, Mail, Phone, Edit, Trash2, Package } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';
import { Button } from '../../../components/componentsreutilizables';

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
    <Card className="p-0 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Influencer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Nicho
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Seguidores
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Engagement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Campañas Activas
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {influencers.map((influencer) => (
              <tr
                key={influencer.id}
                onClick={() => onSelectInfluencer(influencer.id)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
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
                            className="hover:text-blue-600 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {influencer.email && (
                          <a
                            href={`mailto:${influencer.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-blue-600 transition-colors"
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
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    {influencer.activeCampaigns}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      onClick={() => onAddNewCampaign(influencer.id)}
                      size="sm"
                      leftIcon={<Plus size={14} />}
                    >
                      Campaña
                    </Button>
                    {onEdit && (
                      <Button
                        onClick={() => onEdit(influencer.id)}
                        variant="ghost"
                        size="sm"
                      >
                        <Edit size={16} />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        onClick={() => onDelete(influencer.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {influencers.length === 0 && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay influencers registrados</h3>
          <p className="text-gray-600">Comienza agregando tu primer influencer para gestionar colaboraciones.</p>
        </Card>
      )}
    </Card>
  );
};


