import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Lead } from '../api/inbox';
import { 
  Instagram, 
  Facebook, 
  Mail, 
  MessageCircle, 
  Globe,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  User,
  ArrowRight,
  Flame,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';

interface LeadCardProps {
  lead: Lead;
  onSelect?: (leadId: string, channel: 'instagram' | 'whatsapp') => void;
  onAssign?: (leadId: string) => void;
  hoursWithoutResponse?: number;
}

const getChannelIcon = (channel: Lead['sourceChannel']) => {
  const iconClass = "w-4 h-4";
  switch (channel) {
    case 'instagram':
      return <Instagram className={iconClass} />;
    case 'facebook':
      return <Facebook className={iconClass} />;
    case 'whatsapp':
      return <MessageCircle className={iconClass} />;
    case 'email':
      return <Mail className={iconClass} />;
    case 'web_form':
      return <Globe className={iconClass} />;
    default:
      return <MessageCircle className={iconClass} />;
  }
};

const getChannelColor = (channel: Lead['sourceChannel']) => {
  switch (channel) {
    case 'instagram':
      return 'bg-pink-100 text-pink-700 border-pink-200';
    case 'facebook':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'whatsapp':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'email':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'web_form':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getStatusBadge = (status: Lead['status']) => {
  switch (status) {
    case 'new':
      return (
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          Nuevo
        </span>
      );
    case 'contacted':
      return (
        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
          Contactado
        </span>
      );
    case 'converted':
      return (
        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
          Convertido
        </span>
      );
    case 'discarded':
      return (
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
          Descartado
        </span>
      );
  }
};

const getSLAStatus = (slaStatus: Lead['slaStatus'], slaDueTimestamp: string) => {
  const now = new Date();
  const due = new Date(slaDueTimestamp);
  const minutesLeft = Math.floor((due.getTime() - now.getTime()) / 1000 / 60);

  switch (slaStatus) {
    case 'on_time':
      return (
        <div className="flex items-center gap-1 text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs font-medium">A tiempo</span>
        </div>
      );
    case 'at_risk':
      return (
        <div className="flex items-center gap-1 text-orange-600">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-medium">{minutesLeft}m restantes</span>
        </div>
      );
    case 'overdue':
      return (
        <div className="flex items-center gap-1 text-red-600">
          <XCircle className="w-4 h-4" />
          <span className="text-xs font-medium">Vencido</span>
        </div>
      );
  }
};

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onSelect, onAssign, hoursWithoutResponse = 0 }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 1000 / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    return `Hace ${diffDays}d`;
  };

  // US-03: Determine urgency based on hours without response
  const getUrgencyStatus = () => {
    if (lead.status !== 'new') return null;
    
    if (hoursWithoutResponse >= 24) {
      return {
        level: 'critical',
        color: 'border-red-500 bg-red-50',
        ringColor: 'ring-red-500',
        badge: (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-100 border-2 border-red-500 text-red-800 rounded-lg animate-pulse">
            <Flame className="w-4 h-4" />
            <span className="text-xs font-bold">¡URGENTE! +{hoursWithoutResponse}h sin respuesta</span>
          </div>
        )
      };
    }
    
    if (hoursWithoutResponse >= 8) {
      return {
        level: 'warning',
        color: 'border-orange-400 bg-orange-50',
        ringColor: 'ring-orange-400',
        badge: (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-100 border border-orange-400 text-orange-800 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-semibold">Requiere atención ({hoursWithoutResponse}h sin respuesta)</span>
          </div>
        )
      };
    }
    
    return null;
  };

  const urgencyStatus = getUrgencyStatus();
  const isUrgent = urgencyStatus !== null;

  // Determine channel for conversation
  const channel = (lead.sourceChannel === 'instagram' || lead.sourceChannel === 'whatsapp') 
    ? lead.sourceChannel 
    : 'whatsapp'; // Default to whatsapp for other channels

  return (
    <Card 
      className={`bg-white shadow-sm hover:shadow-lg transition-all cursor-pointer relative overflow-hidden ${
        isUrgent ? `border-2 ${urgencyStatus.color} ring-2 ${urgencyStatus.ringColor}` : ''
      }`}
      padding="md"
    >
      {/* Urgent indicator stripe */}
      {urgencyStatus?.level === 'critical' && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse" />
      )}
      
      <div className="space-y-4">
        {/* Urgency Badge - US-03 */}
        {isUrgent && urgencyStatus.badge && (
          <div className="pt-1">
            {urgencyStatus.badge}
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className={`font-semibold ${isUrgent ? 'text-gray-900 text-lg' : 'text-gray-900'}`}>
                {lead.name}
              </h3>
              {getStatusBadge(lead.status)}
            </div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-md border ${getChannelColor(lead.sourceChannel)}`}>
                {getChannelIcon(lead.sourceChannel)}
                <span className="text-xs font-medium capitalize">{lead.sourceChannel.replace('_', ' ')}</span>
              </div>
              {getSLAStatus(lead.slaStatus, lead.slaDueTimestamp)}
            </div>
          </div>
        </div>

        {/* Mensaje */}
        <p className={`text-sm text-gray-600 line-clamp-2 ${isUrgent ? 'font-medium' : ''}`}>
          {lead.lastMessageSnippet}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatTime(lead.updatedAt)}</span>
            </div>
            {lead.assignedTo && (
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{lead.assignedTo.name}</span>
              </div>
            )}
          </div>
          <Button
            variant={isUrgent ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onSelect?.(lead.id, channel)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {isUrgent ? 'Responder ahora' : 'Ver conversación'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

