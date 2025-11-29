import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  User,
  Loader2,
  Eye,
  FlaskConical,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  Edit,
} from 'lucide-react';
import { Card, Button, Badge, Modal, Textarea } from '../../../components/componentsreutilizables';
import {
  MobileApproval,
  ApprovalStatus,
  ApprovalItemType,
  AISummary,
} from '../types';
import {
  getPendingApprovalsService,
  generateAISummaryService,
  approveItemService,
} from '../services/intelligenceService';
import { useAuth } from '../../../context/AuthContext';

interface MobileApprovalSectionProps {
  trainerId?: string;
  onApprovalChange?: () => void;
}

const statusLabel: Record<ApprovalStatus, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  'needs-changes': 'Necesita cambios',
};

const priorityVariant: Record<MobileApproval['priority'], 'destructive' | 'warning' | 'secondary'> = {
  urgent: 'destructive',
  high: 'warning',
  medium: 'secondary',
  low: 'secondary',
};

const itemTypeIcons: Record<ApprovalItemType, React.ReactNode> = {
  experiment: <FlaskConical className="w-4 h-4" />,
  playbook: <BookOpen className="w-4 h-4" />,
};

export const MobileApprovalSection: React.FC<MobileApprovalSectionProps> = ({
  trainerId,
  onApprovalChange,
}) => {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState<MobileApproval[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<MobileApproval | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approved' | 'rejected' | 'needs-changes' | null>(null);
  const [notes, setNotes] = useState('');
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadApprovals();
  }, [trainerId]);

  const loadApprovals = async () => {
    setLoading(true);
    try {
      const response = await getPendingApprovalsService({
        trainerId: trainerId || user?.id,
        limit: 10,
      });
      setApprovals(response.approvals);
    } catch (error) {
      console.error('Error cargando aprobaciones pendientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewApproval = async (approval: MobileApproval) => {
    setSelectedApproval(approval);
    setIsDetailModalOpen(true);
    setAiSummary(null);
    setGeneratingSummary(true);

    try {
      // Generar resumen IA
      const response = await generateAISummaryService({
        itemType: approval.itemType,
        itemId: approval.itemId,
      });
      setAiSummary(response.summary);
    } catch (error) {
      console.error('Error generando resumen IA:', error);
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleApproveAction = (action: 'approved' | 'rejected' | 'needs-changes') => {
    setApprovalAction(action);
    setIsDetailModalOpen(false);
    setIsApprovalModalOpen(true);
    setNotes('');
  };

  const handleConfirmApproval = async () => {
    if (!selectedApproval) return;

    setProcessing(true);
    try {
      await approveItemService({
        approvalId: selectedApproval.id,
        status: approvalAction!,
        notes: approvalAction === 'rejected' || approvalAction === 'needs-changes' ? notes : undefined,
        rejectionReason: approvalAction === 'rejected' ? notes : undefined,
        requestedChanges: approvalAction === 'needs-changes' ? notes : undefined,
      });

      await loadApprovals();
      setIsApprovalModalOpen(false);
      setIsDetailModalOpen(false);
      setSelectedApproval(null);
      setApprovalAction(null);
      setNotes('');
      setAiSummary(null);

      if (onApprovalChange) {
        onApprovalChange();
      }
    } catch (error) {
      console.error('Error procesando aprobación:', error);
      alert('Error al procesar la aprobación. Intenta nuevamente.');
    } finally {
      setProcessing(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6">
      <Card className="p-0 shadow-sm border border-slate-200/70">
        <div className="px-6 py-5 border-b border-slate-200/60">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
              <Smartphone size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Aprobación Móvil con Resumen IA
              </h2>
              <p className="text-sm text-slate-600">
                Aprueba experimentos y playbooks desde móvil con resumen IA para mantener velocidad
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-indigo-600" />
              <span className="ml-2 text-sm text-slate-600">Cargando aprobaciones...</span>
            </div>
          ) : approvals.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 size={48} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-600 font-medium">No hay aprobaciones pendientes</p>
              <p className="text-sm text-slate-500 mt-1">
                Todos los experimentos y playbooks están al día
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {approvals.map((approval) => (
                <Card
                  key={approval.id}
                  className="p-4 border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer"
                  onClick={() => handleViewApproval(approval)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1 text-indigo-600">
                          {itemTypeIcons[approval.itemType]}
                        </div>
                        <Badge variant="secondary" size="sm">
                          {approval.itemType === 'experiment' ? 'Experimento' : 'Playbook'}
                        </Badge>
                        <Badge variant={priorityVariant[approval.priority]} size="sm">
                          {approval.priority === 'urgent' ? 'Urgente' : 
                           approval.priority === 'high' ? 'Alta' : 
                           approval.priority === 'medium' ? 'Media' : 'Baja'}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1">{approval.itemName}</h3>
                      {approval.itemObjective && (
                        <p className="text-sm text-slate-600 mb-2">{approval.itemObjective}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <User size={12} />
                          <span>{approval.submittedByName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{formatTimeAgo(approval.submittedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Eye size={16} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewApproval(approval);
                      }}
                    >
                      Ver
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Modal de detalle con resumen IA */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedApproval(null);
          setAiSummary(null);
        }}
        title={selectedApproval?.itemName || 'Detalle de Aprobación'}
        size="xl"
      >
        {selectedApproval && (
          <div className="space-y-6">
            {/* Información básica */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {itemTypeIcons[selectedApproval.itemType]}
                <Badge variant="secondary" size="sm">
                  {selectedApproval.itemType === 'experiment' ? 'Experimento' : 'Playbook'}
                </Badge>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{selectedApproval.itemName}</h3>
              {selectedApproval.itemObjective && (
                <p className="text-sm text-slate-600">{selectedApproval.itemObjective}</p>
              )}
              <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <User size={14} />
                  <span>Enviado por: {selectedApproval.submittedByName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{formatTimeAgo(selectedApproval.submittedAt)}</span>
                </div>
              </div>
            </div>

            {/* Resumen IA */}
            {generatingSummary ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-indigo-600" />
                <span className="ml-2 text-sm text-slate-600">Generando resumen IA...</span>
              </div>
            ) : aiSummary ? (
              <Card className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={18} className="text-indigo-600" />
                  <h3 className="font-semibold text-slate-900">Resumen IA</h3>
                  <Badge variant="purple" size="sm">
                    {aiSummary.confidence}% confianza
                  </Badge>
                </div>
                <p className="text-sm text-slate-700 mb-4">{aiSummary.summary}</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-700 mb-2">Puntos clave:</h4>
                    <ul className="space-y-1">
                      {aiSummary.keyPoints.map((point, idx) => (
                        <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {aiSummary.risks.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-red-700 mb-2">Riesgos:</h4>
                      <ul className="space-y-1">
                        {aiSummary.risks.map((risk, idx) => (
                          <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                            <AlertCircle size={12} className="text-red-600 mt-0.5 flex-shrink-0" />
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiSummary.opportunities.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-green-700 mb-2">Oportunidades:</h4>
                      <ul className="space-y-1">
                        {aiSummary.opportunities.map((opp, idx) => (
                          <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                            <span className="text-green-600 mt-1">•</span>
                            <span>{opp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-semibold text-indigo-700 mb-2">Recomendaciones:</h4>
                    <ul className="space-y-1">
                      {aiSummary.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                          <Sparkles size={12} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ) : null}

            {/* Acciones */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedApproval(null);
                  setAiSummary(null);
                }}
              >
                Cerrar
              </Button>
              <Button
                variant="destructive"
                leftIcon={<XCircle size={16} />}
                onClick={() => handleApproveAction('rejected')}
              >
                Rechazar
              </Button>
              <Button
                variant="warning"
                leftIcon={<Edit size={16} />}
                onClick={() => handleApproveAction('needs-changes')}
              >
                Solicitar cambios
              </Button>
              <Button
                variant="primary"
                leftIcon={<CheckCircle2 size={16} />}
                onClick={() => handleApproveAction('approved')}
              >
                Aprobar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de confirmación de aprobación */}
      <Modal
        isOpen={isApprovalModalOpen}
        onClose={() => {
          setIsApprovalModalOpen(false);
          setApprovalAction(null);
          setNotes('');
        }}
        title={
          approvalAction === 'approved' ? 'Confirmar Aprobación' :
          approvalAction === 'rejected' ? 'Confirmar Rechazo' :
          'Solicitar Cambios'
        }
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            {approvalAction === 'approved' 
              ? '¿Estás seguro de que deseas aprobar este item?'
              : approvalAction === 'rejected'
              ? '¿Estás seguro de que deseas rechazar este item?'
              : '¿Qué cambios necesitas que se realicen?'}
          </p>

          {(approvalAction === 'rejected' || approvalAction === 'needs-changes') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {approvalAction === 'rejected' ? 'Razón del rechazo' : 'Cambios solicitados'} *
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  approvalAction === 'rejected'
                    ? 'Explica por qué se rechaza este item...'
                    : 'Describe los cambios que necesitas...'
                }
                rows={4}
              />
            </div>
          )}

          {approvalAction === 'approved' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notas (opcional)
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Agrega notas adicionales..."
                rows={3}
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <Button
              variant="ghost"
              onClick={() => {
                setIsApprovalModalOpen(false);
                setApprovalAction(null);
                setNotes('');
              }}
              disabled={processing}
            >
              Cancelar
            </Button>
            <Button
              variant={approvalAction === 'approved' ? 'primary' : approvalAction === 'rejected' ? 'destructive' : 'warning'}
              onClick={handleConfirmApproval}
              disabled={processing || (approvalAction !== 'approved' && !notes.trim())}
              leftIcon={processing ? <Loader2 size={16} className="animate-spin" /> : undefined}
            >
              {processing ? 'Procesando...' : 
               approvalAction === 'approved' ? 'Confirmar Aprobación' :
               approvalAction === 'rejected' ? 'Confirmar Rechazo' :
               'Solicitar Cambios'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MobileApprovalSection;

