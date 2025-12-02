import React, { useState } from 'react';
import { Modal, Button, Select, Textarea } from '../../../components/componentsreutilizables';
import { RetentionActionType, RetentionActionOutcome } from '../types';
import { ds } from '../../adherencia/ui/ds';
import { Phone, Mail, MessageSquare, Calendar, Gift } from 'lucide-react';

interface ClientRetentionModalProps {
  isOpen: boolean;
  clientId: string;
  clientName: string;
  onClose: () => void;
  onSuccess?: () => void;
  onSubmit: (data: {
    actionType: RetentionActionType;
    notes: string;
    outcome?: RetentionActionOutcome;
  }) => Promise<void>;
}

export const ClientRetentionModal: React.FC<ClientRetentionModalProps> = ({
  isOpen,
  clientId,
  clientName,
  onClose,
  onSuccess,
  onSubmit,
}) => {
  const [actionType, setActionType] = useState<RetentionActionType>('call');
  const [notes, setNotes] = useState('');
  const [outcome, setOutcome] = useState<RetentionActionOutcome>('pending');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!notes.trim()) {
      setError('Las notas son obligatorias');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        actionType,
        notes: notes.trim(),
        outcome,
      });
      setNotes('');
      setActionType('call');
      setOutcome('pending');
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar la acción');
    } finally {
      setIsSubmitting(false);
    }
  };

  const actionTypeOptions = [
    { value: 'call', label: 'Llamada', icon: <Phone className="w-4 h-4" /> },
    { value: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
    { value: 'sms', label: 'SMS', icon: <MessageSquare className="w-4 h-4" /> },
    { value: 'meeting', label: 'Reunión', icon: <Calendar className="w-4 h-4" /> },
    { value: 'offer', label: 'Oferta', icon: <Gift className="w-4 h-4" /> },
  ];

  const outcomeOptions = [
    { value: 'positive', label: 'Positivo' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'negative', label: 'Negativo' },
    { value: 'pending', label: 'Pendiente' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Registrar Acción de Retención - ${clientName}`}
      size="lg"
      footer={
        <div className="flex items-center justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={isSubmitting}>
            Registrar Acción
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Select
          label="Tipo de Acción"
          value={actionType}
          onChange={(e) => setActionType(e.target.value as RetentionActionType)}
          options={actionTypeOptions.map(opt => ({
            value: opt.value,
            label: opt.label,
          }))}
        />

        <Select
          label="Resultado"
          value={outcome}
          onChange={(e) => setOutcome(e.target.value as RetentionActionOutcome)}
          options={outcomeOptions}
        />

        <Textarea
          label="Notas"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Describe la interacción y el resultado..."
          rows={6}
          required
          showCount
          maxLength={1000}
        />

        {error && (
          <div className={`p-4 rounded-xl ${ds.color.errorBg} ${ds.color.errorBgDark}`}>
            <p className={`${ds.typography.body} ${ds.color.error}`}>
              {error}
            </p>
          </div>
        )}
      </form>
    </Modal>
  );
};

