import React, { useState } from 'react';
import { Modal, Button, Textarea } from '../../../components/componentsreutilizables';
import { Transfer } from '../types';

interface TransferActionModalProps {
  transfer: Transfer | null;
  onClose: () => void;
  onApprove: (transferId: string) => Promise<void>;
  onReject: (transferId: string, reason: string) => Promise<void>;
}

export const TransferActionModal: React.FC<TransferActionModalProps> = ({
  transfer,
  onClose,
  onApprove,
  onReject,
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!transfer) return null;

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await onApprove(transfer.id);
      onClose();
    } catch (error) {
      console.error('Error al aprobar transferencia:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Por favor, proporcione un motivo para el rechazo.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onReject(transfer.id, rejectionReason);
      onClose();
      setRejectionReason('');
    } catch (error) {
      console.error('Error al rechazar transferencia:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canApprove = transfer.status === 'PENDING';
  const canReject = transfer.status === 'PENDING';

  return (
    <Modal
      isOpen={!!transfer}
      onClose={onClose}
      title="Detalles de Transferencia"
      size="lg"
      footer={
        (canApprove || canReject) ? (
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            {canReject && (
              <Button variant="destructive" onClick={handleReject} disabled={isSubmitting}>
                Rechazar
              </Button>
            )}
            {canApprove && (
              <Button variant="primary" onClick={handleApprove} disabled={isSubmitting}>
                Aprobar
              </Button>
            )}
          </div>
        ) : null
      }
    >
      <div className="space-y-6">
        {/* Información del Socio */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información del Socio
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-700 mb-2">
                Nombre
              </p>
              <p className="text-base text-gray-900 font-medium">
                {transfer.member.name}
              </p>
            </div>
            {transfer.member.email && (
              <div>
                <p className="text-sm text-slate-700 mb-2">
                  Email
                </p>
                <p className="text-base text-gray-900">
                  {transfer.member.email}
                </p>
              </div>
            )}
            {transfer.member.phone && (
              <div>
                <p className="text-sm text-slate-700 mb-2">
                  Teléfono
                </p>
                <p className="text-base text-gray-900">
                  {transfer.member.phone}
                </p>
              </div>
            )}
            {transfer.member.membershipType && (
              <div>
                <p className="text-sm text-slate-700 mb-2">
                  Tipo de Membresía
                </p>
                <p className="text-base text-gray-900">
                  {transfer.member.membershipType}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Información de Sedes */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sedes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-700 mb-2">
                Sede Origen
              </p>
              <p className="text-base text-gray-900 font-medium">
                {transfer.originLocation.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-700 mb-2">
                Sede Destino
              </p>
              <p className="text-base text-gray-900 font-medium">
                {transfer.destinationLocation.name}
              </p>
            </div>
          </div>
        </div>

        {/* Fechas */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Fechas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-700 mb-2">
                Fecha de Solicitud
              </p>
              <p className="text-base text-gray-900">
                {formatDate(transfer.requestedDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-700 mb-2">
                Fecha Efectiva
              </p>
              <p className="text-base text-gray-900">
                {formatDate(transfer.effectiveDate)}
              </p>
            </div>
            {transfer.approvedDate && (
              <div>
                <p className="text-sm text-slate-700 mb-2">
                  Fecha de Aprobación
                </p>
                <p className="text-base text-gray-900">
                  {formatDate(transfer.approvedDate)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Notas */}
        {transfer.notes && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Notas
            </h3>
            <p className="text-base text-gray-600">
              {transfer.notes}
            </p>
          </div>
        )}

        {/* Motivo de Rechazo */}
        {transfer.rejectionReason && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Motivo de Rechazo
            </h3>
            <p className="text-base text-red-700">
              {transfer.rejectionReason}
            </p>
          </div>
        )}

        {/* Campo para motivo de rechazo si está pendiente */}
        {canReject && (
          <div>
            <Textarea
              label="Motivo del Rechazo (Requerido)"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Proporcione el motivo por el cual está rechazando esta transferencia..."
              rows={4}
              error={isSubmitting && !rejectionReason.trim() ? 'El motivo del rechazo es requerido' : undefined}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

