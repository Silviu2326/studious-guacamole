import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { UgcContent } from '../api/ugc';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  User,
  Calendar,
  Tag,
  ExternalLink,
  Image as ImageIcon,
  Video as VideoIcon,
  Mail
} from 'lucide-react';

interface ContentCardProps {
  content: UgcContent;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRequestConsent: (id: string) => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  content,
  onApprove,
  onReject,
  onRequestConsent
}) => {
  const getStatusBadge = () => {
    const statusConfig = {
      pending_moderation: {
        label: 'Pendiente',
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock
      },
      approved: {
        label: 'Aprobado',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle
      },
      rejected: {
        label: 'Rechazado',
        color: 'bg-red-100 text-red-800',
        icon: XCircle
      }
    };
    
    const config = statusConfig[content.status];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getConsentBadge = () => {
    if (content.consentStatus === 'not_requested') return null;
    
    const consentConfig = {
      pending_response: {
        label: 'Esperando Consentimiento',
        color: 'bg-blue-100 text-blue-800',
        icon: Clock
      },
      granted: {
        label: 'Consentimiento Otorgado',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle
      },
      denied: {
        label: 'Consentimiento Denegado',
        color: 'bg-red-100 text-red-800',
        icon: XCircle
      }
    };
    
    const config = consentConfig[content.consentStatus];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const showActions = content.status === 'pending_moderation' || 
                     (content.status === 'approved' && content.consentStatus === 'not_requested');

  return (
    <Card variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={content.storageUrl}
          alt={`Contenido de ${content.client.name}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2">
          {getStatusBadge()}
        </div>
        <div className="absolute top-2 right-2">
          {content.type === 'image' ? (
            <ImageIcon className="w-5 h-5 text-white bg-black bg-opacity-50 rounded p-1" />
          ) : (
            <VideoIcon className="w-5 h-5 text-white bg-black bg-opacity-50 rounded p-1" />
          )}
        </div>
        {getConsentBadge() && (
          <div className="absolute bottom-2 left-2">
            {getConsentBadge()}
          </div>
        )}
      </div>

      {/* Content Info */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Client Info */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{content.client.name}</p>
              {content.client.email && (
                <p className="text-xs text-gray-500">{content.client.email}</p>
              )}
            </div>
          </div>
          <a
            href={content.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-600 transition"
            title="Ver en la red social"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(content.createdAt)}</span>
        </div>

        {/* Tags */}
        {content.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {content.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
            {content.status === 'pending_moderation' && (
              <>
                <button
                  onClick={() => onApprove(content.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Aprobar
                </button>
                <button
                  onClick={() => onReject(content.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                >
                  <XCircle className="w-4 h-4" />
                  Rechazar
                </button>
              </>
            )}
            {content.status === 'approved' && content.consentStatus === 'not_requested' && (
              <button
                onClick={() => onRequestConsent(content.id)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
              >
                <Mail className="w-4 h-4" />
                Solicitar Consentimiento
              </button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

