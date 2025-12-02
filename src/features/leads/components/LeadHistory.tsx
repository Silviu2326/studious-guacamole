import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { LeadHistory as LeadHistoryType } from '../types';
import { getLeadHistory } from '../api';
import { Clock, User, MessageSquare, TrendingUp, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface LeadHistoryProps {
  leadId: string;
}

export const LeadHistory: React.FC<LeadHistoryProps> = ({ leadId }) => {
  const [history, setHistory] = useState<LeadHistoryType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [leadId]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getLeadHistory(leadId);
      setHistory(data);
    } catch (error) {
      console.error('Error cargando historial:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'created':
        return <CheckCircle className={`w-4 h-4 ${ds.color.success}`} />;
      case 'status_changed':
      case 'stage_changed':
        return <ArrowRight className={`w-4 h-4 ${ds.color.info}`} />;
      case 'assigned':
        return <User className={`w-4 h-4 ${ds.color.primary}`} />;
      case 'interaction_added':
        return <MessageSquare className={`w-4 h-4 ${ds.color.primary}`} />;
      case 'score_updated':
        return <TrendingUp className={`w-4 h-4 ${ds.color.warning}`} />;
      case 'converted':
        return <CheckCircle className={`w-4 h-4 ${ds.color.success}`} />;
      case 'lost':
        return <XCircle className={`w-4 h-4 ${ds.color.error}`} />;
      default:
        return <Clock className={`w-4 h-4 ${ds.color.textMuted} ${ds.color.textMutedDark}`} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className={`animate-spin ${ds.radius.full} h-8 w-8 border-b-2 ${ds.color.primaryBg}`}></div>
      </div>
    );
  }

  if (!history || history.events.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className={`w-12 h-12 ${ds.color.textMuted} ${ds.color.textMutedDark} mx-auto mb-4`} />
        <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
          No hay historial disponible para este lead
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Línea vertical */}
        <div className={`absolute left-5 top-0 bottom-0 w-0.5 ${ds.color.border} ${ds.color.borderDark}`}></div>
        
        {/* Eventos */}
        <div className="space-y-6">
          {history.events.map((event, index) => (
            <div key={event.id} className="relative flex gap-4">
              {/* Icono */}
              <div className={`flex-shrink-0 w-10 h-10 ${ds.color.background} ${ds.color.backgroundDark} ${ds.radius.full} flex items-center justify-center border-2 ${ds.color.border} ${ds.color.borderDark}`}>
                {getEventIcon(event.type)}
              </div>
              
              {/* Contenido */}
              <div className="flex-1 pb-6">
                <Card variant="hover" padding="sm">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                        {event.description}
                      </p>
                      <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                        {event.userName} • {new Date(event.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {event.metadata && Object.keys(event.metadata).length > 0 && (
                    <div className={`mt-2 pt-2 border-t ${ds.color.border} ${ds.color.borderDark}`}>
                      <pre className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} text-xs overflow-x-auto`}>
                        {JSON.stringify(event.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

