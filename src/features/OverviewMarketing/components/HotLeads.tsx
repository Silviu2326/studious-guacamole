import React, { useState } from 'react';
import { MessageSquare, Phone, Mail, Instagram, AlertCircle, TrendingUp, Clock, User, ArrowRight } from 'lucide-react';
import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { HotLeadsSnapshot, HotLead } from '../types';

interface HotLeadsProps {
  snapshot: HotLeadsSnapshot | null;
  loading?: boolean;
  className?: string;
  onStartConversation?: (lead: HotLead) => void;
}

const sourceIcon: Record<string, React.ReactNode> = {
  instagram: <Instagram className="w-4 h-4" />,
  whatsapp: <MessageSquare className="w-4 h-4" />,
  referido: <User className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  phone: <Phone className="w-4 h-4" />,
};

const sourceLabel: Record<string, string> = {
  instagram: 'Instagram',
  whatsapp: 'WhatsApp',
  referido: 'Referido',
  email: 'Email',
  phone: 'Teléfono',
};

const urgencyColor: Record<HotLead['urgency'], string> = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  medium: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  low: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
};

const urgencyLabel: Record<HotLead['urgency'], string> = {
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
};

function formatTimeAgo(dateString?: string): string {
  if (!dateString) return 'Sin interacción';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Hace menos de 1 hora';
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays === 1) return 'Hace 1 día';
  return `Hace ${diffDays} días`;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-orange-600 dark:text-orange-400';
}

export const HotLeads: React.FC<HotLeadsProps> = ({
  snapshot,
  loading = false,
  className = '',
  onStartConversation,
}) => {
  const [selectedLead, setSelectedLead] = useState<HotLead | null>(null);

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`${ds.shimmer} w-8 h-8 rounded-lg`} />
          <div className={`${ds.shimmer} h-6 w-48`} />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`${ds.shimmer} h-20 rounded-lg`} />
          ))}
        </div>
      </Card>
    );
  }

  if (!snapshot || snapshot.leads.length === 0) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-red-100 to-orange-200 dark:from-red-900/40 dark:to-orange-900/30 rounded-xl">
            <TrendingUp className="w-5 h-5 text-red-600 dark:text-red-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              Leads Calientes
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              No hay leads calientes en este momento
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const handleStartConversation = (lead: HotLead) => {
    if (onStartConversation) {
      onStartConversation(lead);
    } else {
      // Default behavior: navigate to leads page with conversation
      const channel = lead.preferredChannel || 'whatsapp';
      window.location.href = `/leads?leadId=${lead.id}&channel=${channel}`;
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-100 to-orange-200 dark:from-red-900/40 dark:to-orange-900/30 rounded-xl">
            <TrendingUp className="w-5 h-5 text-red-600 dark:text-red-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              Leads Calientes
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              {snapshot.totalCount} lead{snapshot.totalCount !== 1 ? 's' : ''} con alta probabilidad de conversión
              {snapshot.highUrgencyCount > 0 && (
                <span className="ml-2 text-red-600 dark:text-red-400 font-medium">
                  · {snapshot.highUrgencyCount} requieren atención urgente
                </span>
              )}
            </p>
          </div>
        </div>
        {snapshot.highUrgencyCount > 0 && (
          <Badge variant="error" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {snapshot.highUrgencyCount} Urgente{snapshot.highUrgencyCount !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        {snapshot.leads.map((lead) => (
          <div
            key={lead.id}
            className="group p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 hover:shadow-md transition-all bg-white dark:bg-gray-800/50"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-100 to-orange-200 dark:from-red-900/40 dark:to-orange-900/30 flex items-center justify-center">
                      <span className="text-sm font-semibold text-red-700 dark:text-red-300">
                        {lead.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">
                        {lead.name}
                      </h4>
                      <Badge className={urgencyColor[lead.urgency]} size="sm">
                        {urgencyLabel[lead.urgency]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-slate-400">
                      {lead.source && (
                        <span className="flex items-center gap-1">
                          {sourceIcon[lead.source] || <User className="w-3 h-3" />}
                          {sourceLabel[lead.source] || lead.source}
                        </span>
                      )}
                      {lead.lastInteraction && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(lead.lastInteraction)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 dark:text-slate-400">Score:</span>
                    <span className={`text-sm font-semibold ${getScoreColor(lead.score)}`}>
                      {lead.score}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 dark:text-slate-400">Probabilidad:</span>
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                      {lead.probability}%
                    </span>
                  </div>
                  {lead.tags && lead.tags.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      {lead.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0 flex flex-col gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleStartConversation(lead)}
                  className="inline-flex items-center gap-2 whitespace-nowrap"
                >
                  {lead.preferredChannel === 'instagram' ? (
                    <Instagram className="w-4 h-4" />
                  ) : lead.preferredChannel === 'whatsapp' ? (
                    <MessageSquare className="w-4 h-4" />
                  ) : lead.preferredChannel === 'email' ? (
                    <Mail className="w-4 h-4" />
                  ) : (
                    <MessageSquare className="w-4 h-4" />
                  )}
                  Iniciar conversación
                  <ArrowRight className="w-3 h-3" />
                </Button>
                {lead.phone && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => window.location.href = `tel:${lead.phone}`}
                    className="inline-flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Llamar
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {snapshot.leads.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/leads?filter=hot'}
            className="w-full inline-flex items-center justify-center gap-2 text-sm"
          >
            Ver todos los leads calientes
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </Card>
  );
};

