import React, { useState, useMemo } from 'react';
import {
  Badge,
  Button,
  Card,
  Modal,
} from '../../../components/componentsreutilizables';
import {
  Check,
  X,
  Eye,
  Smartphone,
  Mail,
  MessageCircle,
  Send,
  Clock,
  Users,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Video,
  File,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import type {
  CampaignApproval,
  CampaignApprovalStatus,
  MobileCampaignApprovalDashboard,
  MessagingChannel,
} from '../types';

interface MobileCampaignApprovalProps {
  dashboard: MobileCampaignApprovalDashboard | undefined;
  loading?: boolean;
  className?: string;
  onApprovalApprove: (approvalId: string, notes?: string) => void;
  onApprovalReject: (approvalId: string, reason: string) => void;
  onApprovalRequestChanges: (approvalId: string, changes: string) => void;
  onApprovalView: (approval: CampaignApproval) => void;
}

const priorityColors: Record<string, string> = {
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

const statusColors: Record<CampaignApprovalStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  'needs-changes': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};

const channelIcons: Record<MessagingChannel, React.ReactNode> = {
  email: <Mail className="w-4 h-4" />,
  whatsapp: <MessageCircle className="w-4 h-4" />,
  sms: <Send className="w-4 h-4" />,
  push: <Send className="w-4 h-4" />,
  'in-app': <Smartphone className="w-4 h-4" />,
};

export const MobileCampaignApproval: React.FC<MobileCampaignApprovalProps> = ({
  dashboard,
  loading = false,
  className = '',
  onApprovalApprove,
  onApprovalReject,
  onApprovalRequestChanges,
  onApprovalView,
}) => {
  const [selectedApproval, setSelectedApproval] = useState<CampaignApproval | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'changes'>('approve');
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [requestedChanges, setRequestedChanges] = useState('');

  const pendingApprovals = useMemo(
    () => dashboard?.pendingApprovals || [],
    [dashboard]
  );

  const sortedApprovals = useMemo(() => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return [...pendingApprovals].sort((a, b) => {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [pendingApprovals]);

  const handlePreview = (approval: CampaignApproval) => {
    setSelectedApproval(approval);
    setIsPreviewModalOpen(true);
    onApprovalView(approval);
  };

  const handleApprove = (approval: CampaignApproval) => {
    setSelectedApproval(approval);
    setActionType('approve');
    setNotes('');
    setIsActionModalOpen(true);
  };

  const handleReject = (approval: CampaignApproval) => {
    setSelectedApproval(approval);
    setActionType('reject');
    setRejectionReason('');
    setIsActionModalOpen(true);
  };

  const handleRequestChanges = (approval: CampaignApproval) => {
    setSelectedApproval(approval);
    setActionType('changes');
    setRequestedChanges('');
    setIsActionModalOpen(true);
  };

  const handleSubmitAction = () => {
    if (!selectedApproval) return;

    if (actionType === 'approve') {
      onApprovalApprove(selectedApproval.id, notes);
    } else if (actionType === 'reject') {
      if (!rejectionReason.trim()) {
        alert('Por favor, proporciona un motivo de rechazo');
        return;
      }
      onApprovalReject(selectedApproval.id, rejectionReason);
    } else if (actionType === 'changes') {
      if (!requestedChanges.trim()) {
        alert('Por favor, describe los cambios solicitados');
        return;
      }
      onApprovalRequestChanges(selectedApproval.id, requestedChanges);
    }

    setIsActionModalOpen(false);
    setSelectedApproval(null);
    setNotes('');
    setRejectionReason('');
    setRequestedChanges('');
  };

  const renderChannelPreview = (channel: MessagingChannel, content: any) => {
    switch (channel) {
      case 'email':
        return (
          <div className="space-y-3 border border-slate-200 rounded-lg p-4 bg-white">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </div>
            {content.email && (
              <>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Asunto:</p>
                  <p className="text-sm font-semibold text-slate-900">{content.email.subject}</p>
                </div>
                {content.email.previewText && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Vista previa:</p>
                    <p className="text-sm text-slate-600">{content.email.previewText}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-500 mb-1">Contenido:</p>
                  <div className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 rounded p-3 max-h-40 overflow-y-auto">
                    {content.email.body}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case 'whatsapp':
        return (
          <div className="space-y-3 border border-slate-200 rounded-lg p-4 bg-white">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </div>
            {content.whatsapp && (
              <>
                {content.whatsapp.mediaUrl && (
                  <div className="relative rounded-lg overflow-hidden bg-slate-100">
                    {content.whatsapp.mediaType === 'image' && (
                      <img
                        src={content.whatsapp.mediaUrl}
                        alt="Media"
                        className="w-full h-auto max-h-48 object-cover"
                      />
                    )}
                    {content.whatsapp.mediaType === 'video' && (
                      <div className="flex items-center justify-center h-48 bg-slate-200">
                        <Video className="w-12 h-12 text-slate-400" />
                        <span className="ml-2 text-sm text-slate-600">Video</span>
                      </div>
                    )}
                    {content.whatsapp.mediaType === 'document' && (
                      <div className="flex items-center justify-center h-24 bg-slate-200">
                        <File className="w-8 h-8 text-slate-400" />
                        <span className="ml-2 text-sm text-slate-600">Documento</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="text-sm text-slate-700 whitespace-pre-wrap bg-green-50 rounded-lg p-3">
                  {content.whatsapp.message}
                </div>
              </>
            )}
          </div>
        );
      case 'sms':
        return (
          <div className="space-y-3 border border-slate-200 rounded-lg p-4 bg-white">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Send className="w-4 h-4" />
              <span>SMS</span>
            </div>
            {content.sms && (
              <div className="text-sm text-slate-700 whitespace-pre-wrap bg-blue-50 rounded-lg p-3">
                {content.sms.message}
              </div>
            )}
          </div>
        );
      case 'push':
        return (
          <div className="space-y-3 border border-slate-200 rounded-lg p-4 bg-white">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Send className="w-4 h-4" />
              <span>Push Notification</span>
            </div>
            {content.push && (
              <>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Título:</p>
                  <p className="text-sm font-semibold text-slate-900">{content.push.title}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Mensaje:</p>
                  <p className="text-sm text-slate-700">{content.push.body}</p>
                </div>
                {content.push.imageUrl && (
                  <img
                    src={content.push.imageUrl}
                    alt="Push image"
                    className="w-full h-auto max-h-32 object-cover rounded"
                  />
                )}
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card className={className} padding="lg">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </Card>
    );
  }

  if (!dashboard || pendingApprovals.length === 0) {
    return (
      <Card className={className} padding="lg">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Smartphone className="w-12 h-12 text-slate-400 mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">No hay campañas pendientes de aprobación</p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
            Las campañas enviadas para aprobación aparecerán aquí
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <Card className="mb-6" padding="lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
              <Smartphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Aprobación de Campañas
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {dashboard.totalPending} campaña{dashboard.totalPending !== 1 ? 's' : ''} pendiente{dashboard.totalPending !== 1 ? 's' : ''} de aprobación
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {dashboard.byPriority.urgent > 0 && (
              <Badge variant="red" size="sm">
                {dashboard.byPriority.urgent} Urgente{dashboard.byPriority.urgent !== 1 ? 's' : ''}
              </Badge>
            )}
            {dashboard.byPriority.high > 0 && (
              <Badge variant="orange" size="sm">
                {dashboard.byPriority.high} Alta{dashboard.byPriority.high !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Mobile-optimized approval list */}
      <div className="space-y-4">
        {sortedApprovals.map((approval) => (
          <Card key={approval.id} className="overflow-hidden" padding="none">
            <div className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {approval.campaignName}
                    </h3>
                    <Badge className={priorityColors[approval.priority]} size="sm">
                      {approval.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                    {approval.campaignType}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusColors[approval.status]} size="sm">
                    {approval.status}
                  </Badge>
                </div>
              </div>

              {/* Channels */}
              <div className="flex flex-wrap gap-2">
                {approval.channels.map((channel) => (
                  <div
                    key={channel}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
                  >
                    {channelIcons[channel]}
                    <span className="capitalize">{channel}</span>
                  </div>
                ))}
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Users className="w-4 h-4" />
                  <span>{approval.targetAudience.clientCount.toLocaleString()} destinatarios</span>
                </div>
                {approval.scheduledDate && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(approval.scheduledDate).toLocaleDateString('es-ES')}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Eye className="w-4 h-4" />}
                  onClick={() => handlePreview(approval)}
                  className="flex-1 sm:flex-initial"
                >
                  Vista previa
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  leftIcon={<Check className="w-4 h-4" />}
                  onClick={() => handleApprove(approval)}
                  className="flex-1 sm:flex-initial"
                >
                  Aprobar
                </Button>
                <Button
                  variant="error"
                  size="sm"
                  leftIcon={<X className="w-4 h-4" />}
                  onClick={() => handleReject(approval)}
                  className="flex-1 sm:flex-initial"
                >
                  Rechazar
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  leftIcon={<AlertCircle className="w-4 h-4" />}
                  onClick={() => handleRequestChanges(approval)}
                  className="flex-1 sm:flex-initial"
                >
                  Solicitar cambios
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedApproval && (
        <Modal
          isOpen={isPreviewModalOpen}
          onClose={() => {
            setIsPreviewModalOpen(false);
            setSelectedApproval(null);
          }}
          title={`Vista previa: ${selectedApproval.campaignName}`}
          size="lg"
        >
          <div className="space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Campaign Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className={priorityColors[selectedApproval.priority]} size="sm">
                  {selectedApproval.priority}
                </Badge>
                <Badge className={statusColors[selectedApproval.status]} size="sm">
                  {selectedApproval.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 mb-1">Tipo:</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100 capitalize">
                    {selectedApproval.campaignType}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 mb-1">Destinatarios:</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {selectedApproval.targetAudience.clientCount.toLocaleString()}
                  </p>
                </div>
                {selectedApproval.scheduledDate && (
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 mb-1">Fecha programada:</p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {new Date(selectedApproval.scheduledDate).toLocaleString('es-ES')}
                    </p>
                  </div>
                )}
                {selectedApproval.estimatedReach > 0 && (
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 mb-1">Alcance estimado:</p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {selectedApproval.estimatedReach.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Content Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Vista previa del contenido
              </h3>
              {selectedApproval.channels.map((channel) => (
                <div key={channel}>
                  {renderChannelPreview(channel, selectedApproval.content)}
                </div>
              ))}
            </div>

            {/* Notes */}
            {selectedApproval.notes && (
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Notas:</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap bg-slate-50 dark:bg-slate-800 rounded p-3">
                  {selectedApproval.notes}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Action Modal */}
      {selectedApproval && (
        <Modal
          isOpen={isActionModalOpen}
          onClose={() => {
            setIsActionModalOpen(false);
            setSelectedApproval(null);
            setNotes('');
            setRejectionReason('');
            setRequestedChanges('');
          }}
          title={
            actionType === 'approve'
              ? 'Aprobar campaña'
              : actionType === 'reject'
              ? 'Rechazar campaña'
              : 'Solicitar cambios'
          }
          size="md"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {actionType === 'approve' &&
                `¿Estás seguro de que deseas aprobar la campaña "${selectedApproval.campaignName}"?`}
              {actionType === 'reject' &&
                `¿Por qué motivo rechazas la campaña "${selectedApproval.campaignName}"?`}
              {actionType === 'changes' &&
                `¿Qué cambios solicitas para la campaña "${selectedApproval.campaignName}"?`}
            </p>

            {actionType === 'approve' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Notas (opcional):
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Añade notas sobre tu decisión..."
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {actionType === 'reject' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Motivo de rechazo: *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explica por qué rechazas esta campaña..."
                  rows={4}
                  required
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            )}

            {actionType === 'changes' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Cambios solicitados: *
                </label>
                <textarea
                  value={requestedChanges}
                  onChange={(e) => setRequestedChanges(e.target.value)}
                  placeholder="Describe los cambios que necesitas..."
                  rows={4}
                  required
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsActionModalOpen(false);
                  setNotes('');
                  setRejectionReason('');
                  setRequestedChanges('');
                }}
                className="flex-1 sm:flex-initial"
              >
                Cancelar
              </Button>
              <Button
                variant={actionType === 'approve' ? 'success' : actionType === 'reject' ? 'error' : 'warning'}
                onClick={handleSubmitAction}
                className="flex-1 sm:flex-initial"
              >
                {actionType === 'approve' ? 'Aprobar' : actionType === 'reject' ? 'Rechazar' : 'Solicitar cambios'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

