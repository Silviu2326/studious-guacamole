import React, { useState } from 'react';
import { Card, Modal, Select } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Lead, PipelineStage, LeadStatus } from '../types';
import { LeadHistory } from './LeadHistory';
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
  Clock
} from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  onUpdate: (updates: Partial<Lead>) => void;
  onStageChange?: (newStage: PipelineStage) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onUpdate, onStageChange }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

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

  return (
    <>
      <Card
        variant="hover"
        padding="sm"
        onClick={() => setShowDetails(true)}
        className="cursor-pointer"
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
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
              <div className={`flex items-center gap-2 ${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                <Mail className="w-4 h-4" />
                <span className="truncate">{lead.email}</span>
              </div>
            )}
            {lead.phone && (
              <div className={`flex items-center gap-2 ${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                <Phone className="w-4 h-4" />
                <span>{lead.phone}</span>
              </div>
            )}
          </div>

          {/* Source */}
          <div className={`flex items-center justify-between ${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
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
            <div className={`flex items-center gap-2 ${ds.typography.caption} ${ds.color.info}`}>
              <Calendar className="w-3 h-3" />
              <span>Próximo seguimiento: {new Date(lead.nextFollowUpDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </Card>

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
    </>
  );
};

