import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Lead, LeadInteraction, InteractionType } from '../types';
import { updateLead } from '../api';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  TrendingUp,
  User,
  Clock,
  Plus,
  Instagram,
  MessageCircle,
  Video,
  MapPin
} from 'lucide-react';

interface LeadTimelineProps {
  lead: Lead;
  onUpdate: () => void;
}

export const LeadTimeline: React.FC<LeadTimelineProps> = ({ lead, onUpdate }) => {
  const { user } = useAuth();
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [saving, setSaving] = useState(false);

  const getInteractionIcon = (type: InteractionType) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case 'email_sent':
      case 'email_opened':
      case 'email_clicked':
        return <Mail className={iconClass} />;
      case 'whatsapp_sent':
      case 'whatsapp_replied':
        return <MessageCircle className={iconClass} />;
      case 'call_made':
      case 'call_received':
        return <Phone className={iconClass} />;
      case 'meeting_scheduled':
      case 'meeting_completed':
        return <Calendar className={iconClass} />;
      case 'visit_center':
        return <MapPin className={iconClass} />;
      case 'social_media_interaction':
        return <Instagram className={iconClass} />;
      case 'document_viewed':
        return <FileText className={iconClass} />;
      default:
        return <MessageSquare className={iconClass} />;
    }
  };

  const getInteractionColor = (type: InteractionType, outcome?: string) => {
    if (outcome === 'positive') return 'bg-green-100 text-green-700 border-green-300';
    if (outcome === 'negative') return 'bg-red-100 text-red-700 border-red-300';
    
    if (type.includes('whatsapp')) return 'bg-green-50 text-green-600 border-green-200';
    if (type.includes('email')) return 'bg-blue-50 text-blue-600 border-blue-200';
    if (type.includes('call')) return 'bg-purple-50 text-purple-600 border-purple-200';
    if (type.includes('meeting')) return 'bg-orange-50 text-orange-600 border-orange-200';
    
    return 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const getInteractionLabel = (type: InteractionType) => {
    const labels: Record<InteractionType, string> = {
      email_sent: 'Email enviado',
      email_opened: 'Email abierto',
      email_clicked: 'Link clickeado',
      whatsapp_sent: 'WhatsApp enviado',
      whatsapp_replied: 'Respuesta WhatsApp',
      call_made: 'Llamada realizada',
      call_received: 'Llamada recibida',
      meeting_scheduled: 'Reunión agendada',
      meeting_completed: 'Reunión completada',
      visit_center: 'Visita al centro',
      form_submitted: 'Formulario enviado',
      social_media_interaction: 'Interacción en redes',
      document_viewed: 'Documento visto'
    };
    return labels[type] || type;
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    setSaving(true);
    try {
      const newInteraction: LeadInteraction = {
        id: `note-${Date.now()}`,
        type: 'form_submitted',
        channel: 'other',
        date: new Date(),
        description: newNote,
        outcome: 'neutral',
        userId: user?.id || 'unknown',
        metadata: { isNote: true }
      };

      const updatedInteractions = [...lead.interactions, newInteraction];
      await updateLead(lead.id, { interactions: updatedInteractions });
      
      setNewNote('');
      setShowAddNote(false);
      onUpdate();
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Error al agregar nota');
    } finally {
      setSaving(false);
    }
  };

  const sortedInteractions = [...lead.interactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Historial de Interacciones</h3>
        <button
          onClick={() => setShowAddNote(!showAddNote)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Agregar nota
        </button>
      </div>

      {showAddNote && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-3">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Escribe una nota sobre esta interacción..."
            rows={3}
            className="w-full px-4 py-3 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setShowAddNote(false);
                setNewNote('');
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddNote}
              disabled={!newNote.trim() || saving}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando...' : 'Guardar nota'}
            </button>
          </div>
        </div>
      )}

      {sortedInteractions.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No hay interacciones registradas aún</p>
          <p className="text-sm text-gray-500 mt-2">Las interacciones aparecerán aquí cuando contactes con este lead</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="space-y-4">
            {sortedInteractions.map((interaction, index) => {
              const isNote = interaction.metadata?.isNote;
              const colors = getInteractionColor(interaction.type, interaction.outcome);
              
              return (
                <div key={interaction.id} className="relative pl-14 pb-4">
                  {/* Icon */}
                  <div className={`absolute left-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${colors}`}>
                    {isNote ? <FileText className="w-5 h-5" /> : getInteractionIcon(interaction.type)}
                  </div>

                  {/* Content */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {isNote ? 'Nota agregada' : getInteractionLabel(interaction.type)}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{interaction.description}</p>
                      </div>
                      
                      {interaction.outcome && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          interaction.outcome === 'positive' ? 'bg-green-100 text-green-700' :
                          interaction.outcome === 'negative' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {interaction.outcome === 'positive' ? 'Positivo' : 
                           interaction.outcome === 'negative' ? 'Negativo' : 'Neutral'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(interaction.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium capitalize">{interaction.channel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

