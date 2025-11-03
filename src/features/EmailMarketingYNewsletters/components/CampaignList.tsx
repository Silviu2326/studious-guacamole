import React from 'react';
import { EmailCampaign } from '../api/campaigns';
import { Mail, Calendar, Send, Edit, Trash2, BarChart3, Eye } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';

interface CampaignListProps {
  campaigns: EmailCampaign[];
  onView: (campaignId: string) => void;
  onEdit: (campaignId: string) => void;
  onDelete: (campaignId: string) => void;
  onViewAnalytics: (campaignId: string) => void;
}

/**
 * Lista de campañas de email con acciones
 */
export const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  onView,
  onEdit,
  onDelete,
  onViewAnalytics
}) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      sending: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Borrador',
      scheduled: 'Programada',
      sending: 'Enviando',
      sent: 'Enviada',
      cancelled: 'Cancelada'
    };
    return labels[status] || status;
  };

  if (campaigns.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Mail size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No tienes campañas creadas todavía
        </h3>
        <p className="text-gray-600">
          Crea tu primera campaña de email para empezar a comunicarte con tus clientes
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <Card
          key={campaign.id}
          variant="hover"
          className="h-full flex flex-col transition-shadow overflow-hidden"
        >
          <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                  {getStatusLabel(campaign.status)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{campaign.subject}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {campaign.segment && (
                  <span>Segmento: {campaign.segment.name} ({campaign.segment.contactCount} contactos)</span>
                )}
                {campaign.scheduledAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Programada: {new Date(campaign.scheduledAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
                {campaign.sentAt && (
                  <div className="flex items-center gap-1">
                    <Send className="w-3 h-3" />
                    <span>
                      Enviada: {new Date(campaign.sentAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              {campaign.status === 'sent' && (
                <button
                  onClick={() => onViewAnalytics(campaign.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition"
                  title="Ver Analíticas"
                >
                  <BarChart3 className="w-4 h-4" />
                  Analíticas
                </button>
              )}
              
              {campaign.status === 'draft' && (
                <button
                  onClick={() => onEdit(campaign.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded transition"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
              )}
              
              <button
                onClick={() => onView(campaign.id)}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
                title="Vista Previa"
              >
                <Eye className="w-4 h-4" />
              </button>
              
              {campaign.status === 'draft' && (
                <button
                  onClick={() => onDelete(campaign.id)}
                  className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          </div>
        </Card>
      ))}
    </div>
  );
};


