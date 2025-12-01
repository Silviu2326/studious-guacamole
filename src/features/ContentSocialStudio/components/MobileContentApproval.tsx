import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Smartphone,
  Sparkles,
  Image as ImageIcon,
  Video,
  Clock,
  User,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Edit,
  Eye,
} from 'lucide-react';
import { Badge, Button, Card, Modal, Textarea } from '../../../components/componentsreutilizables';
import type {
  ContentApproval,
  AIPreviewResponse,
} from '../types';
import {
  getPendingApprovals,
  generateAIPreview,
  approveContent,
  getApprovalStats,
} from '../api/contentApprovals';

interface MobileContentApprovalProps {
  loading?: boolean;
}

export function MobileContentApproval({ loading: externalLoading }: MobileContentApprovalProps) {
  const [approvals, setApprovals] = useState<ContentApproval[]>([]);
  const [selectedApproval, setSelectedApproval] = useState<ContentApproval | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatingPreview, setGeneratingPreview] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approved' | 'rejected' | 'needs-revision' | null>(null);
  const [notes, setNotes] = useState('');
  const [preview, setPreview] = useState<AIPreviewResponse | null>(null);
  const [stats, setStats] = useState({
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    needsRevisionCount: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [approvalsData, statsData] = await Promise.all([
        getPendingApprovals(),
        getApprovalStats(),
      ]);

      setApprovals(approvalsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewApproval = async (approval: ContentApproval) => {
    setSelectedApproval(approval);
    setIsDetailModalOpen(true);
    setPreview(null);
    setGeneratingPreview(true);

    try {
      // Generar preview de IA
      const aiPreview = await generateAIPreview({
        contentId: approval.contentId,
        contentType: approval.type,
        platform: approval.platform,
        content: approval.content,
      });

      setPreview(aiPreview);

      // Actualizar la aprobación con el preview de IA
      if (approval) {
        approval.aiPreview = aiPreview;
      }
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      setGeneratingPreview(false);
    }
  };

  const handleApproveAction = (action: 'approved' | 'rejected' | 'needs-revision') => {
    setApprovalAction(action);
    setIsDetailModalOpen(false); // Cerrar modal de detalle primero
    setIsApprovalModalOpen(true);
    setNotes('');
  };

  const handleConfirmApproval = async () => {
    if (!selectedApproval) return;

    try {
      await approveContent({
        approvalId: selectedApproval.id,
        status: approvalAction!,
        notes: approvalAction === 'rejected' || approvalAction === 'needs-revision' ? notes : undefined,
        revisionNotes: approvalAction === 'needs-revision' ? notes : undefined,
      });

      await loadData();
      setIsApprovalModalOpen(false);
      setIsDetailModalOpen(false);
      setSelectedApproval(null);
      setApprovalAction(null);
      setNotes('');
      setPreview(null);
    } catch (error) {
      console.error('Error approving content:', error);
      alert('Error al procesar la aprobación. Intenta nuevamente.');
    }
  };

  const getQualityScoreColor = (score?: number) => {
    if (!score) return 'text-slate-400';
    if (score >= 80) return 'text-green-600';
    if (score >= 65) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityScoreBg = (score?: number) => {
    if (!score) return 'bg-slate-50 border-slate-200';
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 65) return 'bg-blue-50 border-blue-200';
    if (score >= 50) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  if (externalLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-slate-200 rounded" />
          <div className="h-24 bg-slate-100 rounded-2xl" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-0 shadow-sm border border-slate-100">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <Smartphone className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl font-semibold text-slate-900">Aprobación Móvil con Preview IA</h2>
          </div>
          <p className="text-sm text-slate-500">
            Aprueba contenido desde el móvil con preview de IA para mantener la cadencia
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="text-center">
                <p className="text-sm text-yellow-700 font-medium">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.pendingCount}</p>
              </div>
            </Card>
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-center">
                <p className="text-sm text-green-700 font-medium">Aprobados</p>
                <p className="text-2xl font-bold text-green-900">{stats.approvedCount}</p>
              </div>
            </Card>
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="text-center">
                <p className="text-sm text-red-700 font-medium">Rechazados</p>
                <p className="text-2xl font-bold text-red-900">{stats.rejectedCount}</p>
              </div>
            </Card>
            <Card className="p-4 bg-orange-50 border-orange-200">
              <div className="text-center">
                <p className="text-sm text-orange-700 font-medium">Revisión</p>
                <p className="text-2xl font-bold text-orange-900">{stats.needsRevisionCount}</p>
              </div>
            </Card>
          </div>

          {/* Lista de aprobaciones pendientes */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : approvals.length === 0 ? (
            <Card className="p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-slate-500">No hay aprobaciones pendientes</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {approvals.map((approval) => (
                <Card
                  key={approval.id}
                  className="p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="yellow" size="sm">
                          Pendiente
                        </Badge>
                        {approval.type === 'reel' || approval.type === 'video' ? (
                          <Video className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-slate-400" />
                        )}
                        <span className="text-xs text-slate-500">{approval.type}</span>
                        {approval.platform && (
                          <Badge variant="gray" size="sm">
                            {approval.platform}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1">{approval.title}</h3>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                        {approval.content.caption || approval.content.script || 'Sin contenido'}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {approval.submittedBy.userName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(approval.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleViewApproval(approval)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Modal de detalle con preview IA */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedApproval(null);
          setPreview(null);
        }}
        title={selectedApproval?.title || 'Aprobar Contenido'}
        size="lg"
        footer={
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={() => handleApproveAction('approved')}
              className="flex-1 min-w-[120px]"
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Aprobar
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleApproveAction('rejected')}
              className="flex-1 min-w-[120px]"
            >
              <ThumbsDown className="w-4 h-4 mr-2" />
              Rechazar
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleApproveAction('needs-revision')}
              className="flex-1 min-w-[120px] bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Revisión
            </Button>
          </div>
        }
      >
        {selectedApproval && (
          <div className="space-y-6">
            {/* Información del contenido */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Contenido</h3>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">
                    {selectedApproval.content.caption || selectedApproval.content.script || 'Sin contenido'}
                  </p>
                </div>
              </div>

              {selectedApproval.content.mediaUrls && selectedApproval.content.mediaUrls.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Medios</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedApproval.content.mediaUrls.map((url, index) => (
                      <div key={index} className="bg-slate-100 rounded-lg p-4 text-center">
                        <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 truncate">{url}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span>
                  <strong>Enviado por:</strong> {selectedApproval.submittedBy.userName}
                </span>
                <span>
                  <strong>Fecha:</strong> {new Date(selectedApproval.submittedAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Preview de IA */}
            {generatingPreview ? (
              <Card className="p-6">
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                  <span className="text-slate-600">Generando preview de IA...</span>
                </div>
              </Card>
            ) : preview ? (
              <Card className={`p-6 ${getQualityScoreBg(preview.qualityScore)}`}>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  <h3 className="font-semibold text-slate-900">Preview de IA</h3>
                </div>

                {preview.previewImage && (
                  <div className="mb-4">
                    <img
                      src={preview.previewImage}
                      alt="Preview"
                      className="w-full rounded-lg border border-slate-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Engagement Estimado</p>
                    <p className="text-lg font-bold text-slate-900">{preview.estimatedEngagement || 0}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Alcance Estimado</p>
                    <p className="text-lg font-bold text-slate-900">{preview.estimatedReach || 0}</p>
                  </div>
                </div>

                {preview.qualityScore !== undefined && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-700">Puntuación de Calidad</span>
                      <span className={`text-lg font-bold ${getQualityScoreColor(preview.qualityScore)}`}>
                        {preview.qualityScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${preview.qualityScore >= 80
                          ? 'bg-green-500'
                          : preview.qualityScore >= 65
                            ? 'bg-blue-500'
                            : preview.qualityScore >= 50
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                        style={{ width: `${preview.qualityScore}%` }}
                      />
                    </div>
                  </div>
                )}

                {preview.feedback && (
                  <div className="mb-4">
                    <p className="text-sm text-slate-700">{preview.feedback}</p>
                  </div>
                )}

                {preview.suggestions && preview.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Sugerencias</h4>
                    <div className="space-y-2">
                      {preview.suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded ${suggestion.priority === 'high'
                            ? 'bg-red-50 border border-red-200'
                            : suggestion.priority === 'medium'
                              ? 'bg-yellow-50 border border-yellow-200'
                              : 'bg-blue-50 border border-blue-200'
                            }`}
                        >
                          <p className="text-sm text-slate-700">{suggestion.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ) : null}

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
          approvalAction === 'approved'
            ? 'Aprobar Contenido'
            : approvalAction === 'rejected'
              ? 'Rechazar Contenido'
              : 'Solicitar Revisión'
        }
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsApprovalModalOpen(false);
                setApprovalAction(null);
                setNotes('');
              }}
            >
              Cancelar
            </Button>
            <Button
              variant={approvalAction === 'approved' ? 'primary' : approvalAction === 'rejected' ? 'destructive' : 'secondary'}
              onClick={handleConfirmApproval}
              disabled={!notes && (approvalAction === 'rejected' || approvalAction === 'needs-revision')}
              className={approvalAction === 'needs-revision' ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}
            >
              {approvalAction === 'approved'
                ? 'Aprobar'
                : approvalAction === 'rejected'
                  ? 'Rechazar'
                  : 'Solicitar Revisión'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {(approvalAction === 'rejected' || approvalAction === 'needs-revision') && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {approvalAction === 'rejected' ? 'Razón del rechazo' : 'Notas de revisión'} *
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder={
                  approvalAction === 'rejected'
                    ? 'Explica por qué se rechaza el contenido...'
                    : 'Describe qué necesita ser revisado...'
                }
              />
            </div>
          )}
          {approvalAction === 'approved' && (
            <p className="text-slate-600">
              ¿Estás seguro de que quieres aprobar este contenido? Se publicará según la programación establecida.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}

