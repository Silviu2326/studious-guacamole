import React, { useState, useEffect, useMemo } from 'react';
import { ApprovalRequest, ApprovalStatus, ApprovalType } from '../types';
import {
  getApprovalRequests,
  approveRequest,
  rejectRequest,
  requestChanges,
  addApprovalComment,
  cancelRequest,
  getApprovalRequest,
} from '../api/approvals';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Badge, Modal, Textarea, Input } from '../../../components/componentsreutilizables';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  FileText,
  MessageSquare,
  Send,
  Eye,
  X,
  ArrowRight,
  User,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

interface ApprovalManagerProps {
  role: 'entrenador' | 'gimnasio';
  onApprovalChange?: () => void;
}

export const ApprovalManager: React.FC<ApprovalManagerProps> = ({ role, onApprovalChange }) => {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'changes'>('approve');
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [changesRequested, setChangesRequested] = useState('');
  const [filter, setFilter] = useState<ApprovalStatus | 'all'>('all');
  const [processing, setProcessing] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadApprovals();
  }, [filter]);

  const loadApprovals = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (filter !== 'all') {
        filters.status = filter;
      }
      const data = await getApprovalRequests(filters);
      setApprovals(data);
    } catch (error) {
      console.error('Error loading approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const pendingApprovals = useMemo(
    () => approvals.filter(a => a.status === 'pending'),
    [approvals]
  );

  const getApprovalTypeLabel = (type: ApprovalType): string => {
    const labels: Record<ApprovalType, string> = {
      critical_objective: 'Objetivo Crítico',
      significant_change: 'Cambio Significativo',
      target_modification: 'Modificación de Target',
      deadline_extension: 'Extensión de Deadline',
      budget_change: 'Cambio de Presupuesto',
      other: 'Otro',
    };
    return labels[type] || type;
  };

  const getPriorityBadge = (priority: ApprovalRequest['priority']) => {
    const variants: Record<string, 'red' | 'yellow' | 'blue' | 'green'> = {
      urgent: 'red',
      high: 'yellow',
      medium: 'blue',
      low: 'green',
    };
    return (
      <Badge variant={variants[priority] || 'blue'}>
        {priority === 'urgent' ? 'Urgente' : priority === 'high' ? 'Alta' : priority === 'medium' ? 'Media' : 'Baja'}
      </Badge>
    );
  };

  const getStatusBadge = (status: ApprovalStatus) => {
    const variants: Record<ApprovalStatus, 'red' | 'yellow' | 'blue' | 'green' | 'purple'> = {
      pending: 'yellow',
      approved: 'green',
      rejected: 'red',
      needs_changes: 'blue',
      cancelled: 'purple',
    };
    const labels: Record<ApprovalStatus, string> = {
      pending: 'Pendiente',
      approved: 'Aprobado',
      rejected: 'Rechazado',
      needs_changes: 'Requiere Cambios',
      cancelled: 'Cancelado',
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const handleViewDetails = (approval: ApprovalRequest) => {
    setSelectedApproval(approval);
    setIsDetailModalOpen(true);
  };

  const handleApprove = (approval: ApprovalRequest) => {
    setSelectedApproval(approval);
    setActionType('approve');
    setNotes('');
    setIsActionModalOpen(true);
  };

  const handleReject = (approval: ApprovalRequest) => {
    setSelectedApproval(approval);
    setActionType('reject');
    setRejectionReason('');
    setIsActionModalOpen(true);
  };

  const handleRequestChanges = (approval: ApprovalRequest) => {
    setSelectedApproval(approval);
    setActionType('changes');
    setChangesRequested('');
    setIsActionModalOpen(true);
  };

  const handleSubmitAction = async () => {
    if (!selectedApproval || !user) return;

    setProcessing(true);
    try {
      if (actionType === 'approve') {
        await approveRequest(selectedApproval.id, user.id, user.name || 'Usuario', notes || undefined);
      } else if (actionType === 'reject') {
        if (!rejectionReason.trim()) {
          alert('Por favor, proporciona una razón para el rechazo');
          setProcessing(false);
          return;
        }
        await rejectRequest(selectedApproval.id, user.id, user.name || 'Usuario', rejectionReason);
      } else if (actionType === 'changes') {
        if (!changesRequested.trim()) {
          alert('Por favor, describe los cambios requeridos');
          setProcessing(false);
          return;
        }
        await requestChanges(selectedApproval.id, user.id, user.name || 'Usuario', changesRequested);
      }

      setIsActionModalOpen(false);
      setIsDetailModalOpen(false);
      setSelectedApproval(null);
      setNotes('');
      setRejectionReason('');
      setChangesRequested('');
      await loadApprovals();
      if (onApprovalChange) {
        onApprovalChange();
      }
    } catch (error) {
      console.error('Error processing approval:', error);
      alert('Error al procesar la aprobación. Intenta nuevamente.');
    } finally {
      setProcessing(false);
    }
  };

  const handleAddComment = async () => {
    if (!selectedApproval || !newComment.trim() || !user) return;

    try {
      await addApprovalComment(
        selectedApproval.id,
        newComment,
        user.id,
        user.name || 'Usuario',
        false
      );
      setNewComment('');
      await loadApprovals();
      // Reload selected approval
      const updated = await getApprovalRequests({});
      const updatedApproval = updated.find(a => a.id === selectedApproval.id);
      if (updatedApproval) {
        setSelectedApproval(updatedApproval);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error al agregar comentario');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Card>
        <div className="p-8 text-center">
          <div className="text-gray-500">Cargando aprobaciones...</div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Solicitudes de Aprobación</h2>
              <p className="text-sm text-gray-600 mt-1">
                Gestiona las aprobaciones de objetivos críticos y cambios significativos
              </p>
            </div>
            {pendingApprovals.length > 0 && (
              <Badge variant="red" className="text-lg px-4 py-2">
                {pendingApprovals.length} Pendiente{pendingApprovals.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          {/* Filtros */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas ({approvals.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pendientes ({pendingApprovals.length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Aprobadas ({approvals.filter(a => a.status === 'approved').length})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rechazadas ({approvals.filter(a => a.status === 'rejected').length})
            </button>
          </div>
        </div>
      </Card>

      {/* Lista de aprobaciones */}
      {approvals.length === 0 ? (
        <Card>
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay solicitudes de aprobación</h3>
            <p className="text-sm text-gray-600">
              {filter === 'all'
                ? 'No hay solicitudes de aprobación registradas'
                : `No hay solicitudes con estado "${filter}"`}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {approvals.map((approval) => (
            <Card key={approval.id} className="hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{approval.objectiveTitle}</h3>
                      {getStatusBadge(approval.status)}
                      {getPriorityBadge(approval.priority)}
                      <Badge variant="blue">{getApprovalTypeLabel(approval.type)}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>Solicitado por: {approval.requestedByName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(approval.requestedAt)}</span>
                      </div>
                    </div>

                    {approval.notes && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{approval.notes}</p>
                      </div>
                    )}

                    {/* Cambios solicitados */}
                    {approval.changes && approval.changes.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Cambios solicitados:</h4>
                        <div className="space-y-2">
                          {approval.changes.map((change, idx) => (
                            <div key={idx} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-blue-900">{change.fieldLabel}</span>
                              </div>
                              <div className="mt-2 flex items-center gap-2 text-sm">
                                <span className="text-gray-600 line-through">{String(change.oldValue)}</span>
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                                <span className="text-blue-700 font-semibold">{String(change.newValue)}</span>
                              </div>
                              {change.reason && (
                                <p className="text-xs text-gray-600 mt-1">{change.reason}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {approval.rejectionReason && (
                      <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center gap-2 mb-1">
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-semibold text-red-900">Razón del rechazo:</span>
                        </div>
                        <p className="text-sm text-red-700">{approval.rejectionReason}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleViewDetails(approval)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalles
                    </Button>
                    {approval.status === 'pending' && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApprove(approval)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Aprobar
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleRequestChanges(approval)}
                        >
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Solicitar Cambios
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleReject(approval)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Rechazar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de detalles */}
      {selectedApproval && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedApproval(null);
            setNewComment('');
          }}
          title={`Detalles de Aprobación: ${selectedApproval.objectiveTitle}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Información general */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Estado</label>
                <div className="mt-1">{getStatusBadge(selectedApproval.status)}</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Prioridad</label>
                <div className="mt-1">{getPriorityBadge(selectedApproval.priority)}</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Tipo</label>
                <div className="mt-1 text-sm text-gray-900">{getApprovalTypeLabel(selectedApproval.type)}</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Solicitado por</label>
                <div className="mt-1 text-sm text-gray-900">{selectedApproval.requestedByName}</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Fecha de solicitud</label>
                <div className="mt-1 text-sm text-gray-900">{formatDate(selectedApproval.requestedAt)}</div>
              </div>
              {selectedApproval.approvedAt && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Fecha de aprobación</label>
                  <div className="mt-1 text-sm text-gray-900">{formatDate(selectedApproval.approvedAt)}</div>
                </div>
              )}
            </div>

            {/* Cambios */}
            {selectedApproval.changes && selectedApproval.changes.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Cambios solicitados</h4>
                <div className="space-y-3">
                  {selectedApproval.changes.map((change, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{change.fieldLabel}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex-1 p-2 bg-white rounded border border-gray-200">
                          <span className="text-gray-600">Valor anterior:</span>
                          <div className="mt-1 font-mono">{String(change.oldValue)}</div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                        <div className="flex-1 p-2 bg-blue-50 rounded border border-blue-200">
                          <span className="text-blue-700">Nuevo valor:</span>
                          <div className="mt-1 font-mono font-semibold text-blue-900">{String(change.newValue)}</div>
                        </div>
                      </div>
                      {change.reason && (
                        <p className="text-xs text-gray-600 mt-2">{change.reason}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notas */}
            {selectedApproval.notes && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Notas</h4>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{selectedApproval.notes}</p>
                </div>
              </div>
            )}

            {/* Comentarios */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Comentarios</h4>
              {selectedApproval.comments && selectedApproval.comments.length > 0 ? (
                <div className="space-y-3 mb-4">
                  {selectedApproval.comments.map((comment) => (
                    <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{comment.createdByName}</span>
                        <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-4">No hay comentarios</p>
              )}

              {selectedApproval.status === 'pending' && (
                <div className="flex gap-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Agregar un comentario..."
                    rows={2}
                    className="flex-1"
                  />
                  <Button
                    variant="primary"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de acción */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => {
          setIsActionModalOpen(false);
          setNotes('');
          setRejectionReason('');
          setChangesRequested('');
        }}
        title={
          actionType === 'approve'
            ? 'Aprobar Solicitud'
            : actionType === 'reject'
            ? 'Rechazar Solicitud'
            : 'Solicitar Cambios'
        }
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsActionModalOpen(false);
                setNotes('');
                setRejectionReason('');
                setChangesRequested('');
              }}
              disabled={processing}
            >
              Cancelar
            </Button>
            <Button
              variant={actionType === 'reject' ? 'secondary' : 'primary'}
              onClick={handleSubmitAction}
              disabled={processing || (actionType === 'reject' && !rejectionReason.trim()) || (actionType === 'changes' && !changesRequested.trim())}
              className={actionType === 'reject' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
            >
              {processing
                ? 'Procesando...'
                : actionType === 'approve'
                ? 'Aprobar'
                : actionType === 'reject'
                ? 'Rechazar'
                : 'Solicitar Cambios'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {actionType === 'approve' && (
            <>
              <p className="text-sm text-gray-600">
                ¿Estás seguro de que deseas aprobar esta solicitud? Puedes agregar notas opcionales.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notas (opcional)</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Agregar notas sobre la aprobación..."
                  rows={4}
                />
              </div>
            </>
          )}

          {actionType === 'reject' && (
            <>
              <p className="text-sm text-gray-600">
                Por favor, proporciona una razón para rechazar esta solicitud.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Razón del rechazo <span className="text-red-600">*</span>
                </label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explica por qué se rechaza esta solicitud..."
                  rows={4}
                  required
                />
              </div>
            </>
          )}

          {actionType === 'changes' && (
            <>
              <p className="text-sm text-gray-600">
                Describe los cambios que se requieren antes de aprobar esta solicitud.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cambios requeridos <span className="text-red-600">*</span>
                </label>
                <Textarea
                  value={changesRequested}
                  onChange={(e) => setChangesRequested(e.target.value)}
                  placeholder="Describe los cambios necesarios..."
                  rows={4}
                  required
                />
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

