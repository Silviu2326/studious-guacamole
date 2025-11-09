import React, { useState, useEffect } from 'react';
import { Card, Modal, Select, Tabs } from '../../../components/componentsreutilizables';
import { useAuth } from '../../../context/AuthContext';
import { ds } from '../../adherencia/ui/ds';
import { Lead, PipelineStage, LeadStatus, LeadInteraction, InteractionType, InteractionChannel } from '../types';
import { LeadHistory } from './LeadHistory';
import { ConversionProbability } from './ConversionProbability';
import { QuickMessageComposer } from './QuickMessageComposer';
import { LeadTasks } from './LeadTasks';
import { AppointmentScheduler } from './AppointmentScheduler';
import { LeadChat } from './LeadChat';
import { QuoteManager } from './QuoteManager';
import { getUnreadCount } from '../api/chat';
import { updateLead } from '../api';
import { 
  User, 
  Mail, 
  Phone, 
  TrendingUp, 
  MoreVertical,
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  FileText
} from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  onUpdate: (updates: Partial<Lead>) => void;
  onStageChange?: (newStage: PipelineStage) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onUpdate, onStageChange }) => {
  const { user } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showMessageComposer, setShowMessageComposer] = useState(false);
  const [showAppointmentScheduler, setShowAppointmentScheduler] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'info' | 'tasks' | 'chat' | 'quotes'>('info');
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const count = await getUnreadCount(lead.id);
        setUnreadChatCount(count);
      } catch (error) {
        console.error('Error cargando mensajes no leídos:', error);
      }
    };
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 10000); // Actualizar cada 10 segundos
    return () => clearInterval(interval);
  }, [lead.id]);

  const getStatusBadge = (status: LeadStatus) => {
    const badges: Record<LeadStatus, string> = {
      new: `${ds.badge.base} ${ds.badge.info}`,
      contacted: `${ds.badge.base} ${ds.badge.info}`,
      qualified: `${ds.badge.base} ${ds.badge.success}`,
      nurturing: `${ds.badge.base} ${ds.badge.warning}`,
      meeting_scheduled: `${ds.badge.base} ${ds.badge.primary}`,
      proposal_sent: `${ds.badge.base} ${ds.badge.primary}`,
      negotiation: `${ds.badge.base} ${ds.badge.warning}`,
      converted: `${ds.badge.base} ${ds.badge.success}`,
      lost: `${ds.badge.base} ${ds.badge.error}`,
      unqualified: `${ds.badge.base} ${ds.color.textMuted} ${ds.color.textMutedDark}`,
    };
    return badges[status] || `${ds.badge.base} ${ds.color.textMuted} ${ds.color.textMutedDark}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return ds.color.success;
    if (score >= 50) return ds.color.warning;
    return ds.color.error;
  };

  const handleQuickAction = async (action: 'whatsapp' | 'call' | 'email') => {
    let url = '';
    let interactionType: InteractionType;
    let interactionChannel: InteractionChannel;

    if (action === 'whatsapp' && lead.phone) {
      // Formatear número para WhatsApp (eliminar + y espacios)
      const phoneNumber = lead.phone.replace(/[+\s]/g, '');
      url = `https://wa.me/${phoneNumber}`;
      interactionType = 'whatsapp_sent';
      interactionChannel = 'whatsapp';
    } else if (action === 'call' && lead.phone) {
      url = `tel:${lead.phone}`;
      interactionType = 'call_made';
      interactionChannel = 'phone';
    } else if (action === 'email' && lead.email) {
      url = `mailto:${lead.email}`;
      interactionType = 'email_sent';
      interactionChannel = 'email';
    } else {
      return; // No hay contacto disponible
    }

    // Registrar interacción
    const newInteraction: LeadInteraction = {
      id: Date.now().toString(),
      type: interactionType,
      channel: interactionChannel,
      date: new Date(),
      description: `Acción rápida: ${action === 'whatsapp' ? 'WhatsApp' : action === 'call' ? 'Llamada' : 'Email'}`,
      outcome: 'neutral',
      userId: user?.id || 'unknown'
    };

    const updatedInteractions = [...lead.interactions, newInteraction];
    
    try {
      await updateLead(lead.id, {
        interactions: updatedInteractions,
        lastContactDate: new Date(),
        status: lead.status === 'new' ? 'contacted' : lead.status,
      });
      
      // Actualizar el lead localmente
      onUpdate({
        interactions: updatedInteractions,
        lastContactDate: new Date(),
        status: lead.status === 'new' ? 'contacted' : lead.status,
      });

      // Abrir la acción
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error registrando interacción:', error);
      // Abrir la acción de todas formas
      window.open(url, '_blank');
    }
  };

  // Verificar si necesita seguimiento urgente
  const needsUrgentFollowUp = () => {
    if (!lead.lastContactDate) return true;
    const lastContact = new Date(lead.lastContactDate);
    const now = new Date();
    const hoursSinceContact = (now.getTime() - lastContact.getTime()) / (1000 * 60 * 60);
    return hoursSinceContact > 24;
  };

  // Verificar si tiene seguimiento hoy
  const hasFollowUpToday = () => {
    if (!lead.nextFollowUpDate) return false;
    const followUpDate = new Date(lead.nextFollowUpDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const followUp = new Date(followUpDate);
    followUp.setHours(0, 0, 0, 0);
    return followUp.getTime() === today.getTime();
  };

  return (
    <>
      <div
        onClick={() => setShowDetails(true)}
        className="cursor-pointer"
      >
        <Card
          variant="hover"
          padding="sm"
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-[#F1F5F9] mb-1">
                  {lead.name}
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`${ds.typography.caption} ${getStatusBadge(lead.status)}`}>
                    {lead.status}
                  </span>
                  <div className={`${ds.typography.caption} flex items-center gap-1 ${getScoreColor(lead.score)}`}>
                    <TrendingUp className="w-3 h-3" />
                    {lead.score}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact info */}
            <div className="space-y-1">
              {lead.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-[#94A3B8]">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{lead.email}</span>
                </div>
              )}
              {lead.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-[#94A3B8]">
                  <Phone className="w-4 h-4" />
                  <span>{lead.phone}</span>
                </div>
              )}
            </div>

            {/* Source */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-[#64748B]">
              <span>Origen: {lead.source}</span>
              {lead.interactions.length > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>{lead.interactions.length}</span>
                </div>
              )}
            </div>

            {/* Next follow up */}
            {lead.nextFollowUpDate && (
              <div className={`flex items-center gap-2 ${ds.typography.caption} ${hasFollowUpToday() ? 'text-orange-600 font-semibold' : ds.color.info}`}>
                <Calendar className="w-3 h-3" />
                <span>
                  {hasFollowUpToday() ? 'Seguimiento HOY' : `Próximo: ${new Date(lead.nextFollowUpDate).toLocaleDateString()}`}
                </span>
              </div>
            )}

            {/* Badge urgente */}
            {needsUrgentFollowUp() && lead.status !== 'converted' && lead.status !== 'lost' && (
              <div className={`flex items-center gap-2 ${ds.typography.caption} text-red-600 font-semibold`}>
                <Clock className="w-3 h-3" />
                <span>Requiere atención urgente</span>
              </div>
            )}

            {/* Probabilidad de conversión (compacta) */}
            {lead.status !== 'converted' && lead.status !== 'lost' && (
              <div className="pt-2 border-t border-gray-200 dark:border-[#334155]">
                <ConversionProbability lead={lead} compact />
              </div>
            )}

            {/* Acciones rápidas */}
            <div className={`pt-3 border-t ${ds.color.borderLight} ${ds.color.borderLightDark} space-y-2`} onClick={(e) => e.stopPropagation()}>
              {/* Acciones principales */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMessageComposer(true);
                  }}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow"
                  title="Enviar mensaje"
                >
                  <MessageSquare className="w-4 h-4 mr-1.5" />
                  Mensaje
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAppointmentScheduler(true);
                  }}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2.5 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow"
                  title="Agendar consulta"
                >
                  <Calendar className="w-4 h-4 mr-1.5" />
                  Agendar
                </button>
              </div>
              
              {/* Acciones de contacto rápido */}
              {(lead.phone || lead.email) && (
                <div className="flex items-center gap-1.5 justify-center">
                  {lead.phone && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAction('whatsapp');
                        }}
                        className="inline-flex items-center justify-center p-2 rounded-lg text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 border border-green-200 dark:border-green-800"
                        title="Contactar por WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAction('call');
                        }}
                        className="inline-flex items-center justify-center p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 border border-blue-200 dark:border-blue-800"
                        title="Llamar"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {lead.email && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickAction('email');
                      }}
                      className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 border border-gray-200 dark:border-gray-700"
                      title="Enviar email"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Modal de detalles */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title={`Lead: ${lead.name}`}
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => {
                setShowDetails(false);
                setShowHistory(true);
              }}
              className={`${ds.typography.bodySmall} ${ds.color.primary} ${ds.color.primaryHover}`}
            >
              Ver Historial
            </button>
            <button
              onClick={() => setShowDetails(false)}
              className={`${ds.btn.secondary} ${ds.typography.bodySmall}`}
            >
              Cerrar
            </button>
          </div>
        }
      >
        <Tabs
          items={[
            { id: 'info', label: 'Información', icon: <User className="w-4 h-4" /> },
            { id: 'tasks', label: 'Tareas', icon: <Clock className="w-4 h-4" /> },
            { 
              id: 'chat', 
              label: (
                <span className="flex items-center gap-2">
                  Chat
                  {unreadChatCount > 0 && (
                    <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadChatCount}
                    </span>
                  )}
                </span>
              ), 
              icon: <MessageSquare className="w-4 h-4" /> 
            },
            { id: 'quotes', label: 'Presupuestos', icon: <FileText className="w-4 h-4" /> }
          ]}
          activeTab={activeDetailTab}
          onTabChange={(tab) => setActiveDetailTab(tab as 'info' | 'tasks' | 'chat' | 'quotes')}
          variant="pills"
        />
        
        <div className="mt-6">
          {activeDetailTab === 'info' && (
            <div className="space-y-6">
              {/* Información básica */}
              <div>
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
              Información Básica
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`${ds.typography.bodySmall} ${ds.color.textSecondary} mb-1 block`}>
                  Email
                </label>
                <p className={ds.typography.body}>{lead.email || 'N/A'}</p>
              </div>
              <div>
                <label className={`${ds.typography.bodySmall} ${ds.color.textSecondary} mb-1 block`}>
                  Teléfono
                </label>
                <p className={ds.typography.body}>{lead.phone || 'N/A'}</p>
              </div>
              <div>
                <label className={`${ds.typography.bodySmall} ${ds.color.textSecondary} mb-1 block`}>
                  Origen
                </label>
                <p className={ds.typography.body}>{lead.source}</p>
              </div>
              <div>
                <label className={`${ds.typography.bodySmall} ${ds.color.textSecondary} mb-1 block`}>
                  Score
                </label>
                <p className={`${ds.typography.body} ${getScoreColor(lead.score)} font-semibold`}>
                  {lead.score}
                </p>
              </div>
            </div>
          </div>

          {/* Estado y Etapa */}
          <div>
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
              Estado y Progreso
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Estado"
                value={lead.status}
                onChange={(e) => onUpdate({ status: e.target.value as LeadStatus })}
                options={[
                  { value: 'new', label: 'Nuevo' },
                  { value: 'contacted', label: 'Contactado' },
                  { value: 'qualified', label: 'Calificado' },
                  { value: 'nurturing', label: 'En Nurturing' },
                  { value: 'meeting_scheduled', label: 'Reunión Agendada' },
                  { value: 'proposal_sent', label: 'Propuesta Enviada' },
                  { value: 'negotiation', label: 'En Negociación' },
                  { value: 'converted', label: 'Convertido' },
                  { value: 'lost', label: 'Perdido' },
                ]}
              />
              <Select
                label="Etapa"
                value={lead.stage}
                onChange={(e) => {
                  const newStage = e.target.value as PipelineStage;
                  onUpdate({ stage: newStage });
                  if (onStageChange) {
                    onStageChange(newStage);
                  }
                }}
                options={[
                  { value: 'captacion', label: 'Captación' },
                  { value: 'interes', label: 'Interés' },
                  { value: 'calificacion', label: 'Calificación' },
                  { value: 'oportunidad', label: 'Oportunidad' },
                  { value: 'cierre', label: 'Cierre' },
                ]}
              />
            </div>
          </div>

          {/* Notas */}
          {lead.notes.length > 0 && (
            <div>
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
              Notas
            </h3>
            <div className="space-y-2">
              {lead.notes.map((note, index) => (
                <p key={index} className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} ${ds.spacing.md} ${ds.color.surface} ${ds.color.surfaceDark} ${ds.radius.md}`}>
                  {note}
                </p>
              ))}
            </div>
            </div>
          )}

          {/* Interacciones recientes */}
          {lead.interactions.length > 0 && (
            <div>
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
              Interacciones Recientes
            </h3>
            <div className="space-y-2">
              {lead.interactions.slice(-3).map((interaction) => (
                <div
                  key={interaction.id}
                  className={`flex items-center gap-3 ${ds.spacing.md} ${ds.color.surface} ${ds.color.surfaceDark} ${ds.radius.md}`}
                >
                  <div className={`w-2 h-2 ${ds.radius.full} ${
                    interaction.outcome === 'positive' ? ds.color.successBg :
                    interaction.outcome === 'negative' ? ds.color.errorBg :
                    ds.color.textMuted + ' bg-opacity-50'
                  }`} />
                  <div className="flex-1">
                    <p className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {interaction.description}
                    </p>
                    <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                      {new Date(interaction.date).toLocaleDateString()} - {interaction.channel}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            </div>
          )}

              {/* Probabilidad de conversión (detallada) */}
              {lead.status !== 'converted' && lead.status !== 'lost' && (
                <div>
                  <ConversionProbability lead={lead} />
                </div>
              )}
            </div>
          )}

          {activeDetailTab === 'tasks' && (
            <div>
              <LeadTasks lead={lead} onTaskUpdate={() => onUpdate({})} />
            </div>
          )}

          {activeDetailTab === 'chat' && (
            <div className="h-[500px]">
              <LeadChat lead={lead} onMessageSent={() => onUpdate({})} />
            </div>
          )}

          {activeDetailTab === 'quotes' && (
            <div>
              <QuoteManager lead={lead} businessType={lead.businessType} />
            </div>
          )}
        </div>
      </Modal>

      {/* Modal de historial */}
      <Modal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        title={`Historial: ${lead.name}`}
        size="lg"
      >
        <LeadHistory leadId={lead.id} />
      </Modal>

      {/* Modal de compositor de mensajes */}
      <QuickMessageComposer
        lead={lead}
        isOpen={showMessageComposer}
        onClose={() => setShowMessageComposer(false)}
        onSent={() => {
          // Recargar lead para actualizar interacciones
          onUpdate({});
        }}
      />
    </>
  );
};
