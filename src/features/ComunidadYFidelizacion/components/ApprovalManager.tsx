import { useState, useMemo, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Star,
  FileText,
  Filter,
  Search,
  Eye,
  AlertCircle,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { Card, Badge, Button, Modal, Tabs, Textarea, Select } from '../../../components/componentsreutilizables';
import { ApprovalRequest, ApprovalConfig, ApprovalStatus, ApprovalType } from '../types';
import { useAuth } from '../../../context/AuthContext';

interface ApprovalManagerProps {
  pendingApprovals?: ApprovalRequest[];
  config?: ApprovalConfig;
  loading?: boolean;
  onApprove?: (approvalId: string) => Promise<void>;
  onReject?: (approvalId: string, reason: string) => Promise<void>;
  onConfigUpdate?: (config: ApprovalConfig) => Promise<void>;
  onRefresh?: () => void;
}

const STATUS_LABELS: Record<ApprovalStatus, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  'auto-approved': 'Auto-aprobado',
};

const STATUS_COLORS: Record<ApprovalStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200',
  approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200',
  rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-200',
  'auto-approved': 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200',
};

const TYPE_LABELS: Record<ApprovalType, string> = {
  testimonial: 'Testimonio',
  message: 'Mensaje',
  content: 'Contenido',
};

const TYPE_ICONS: Record<ApprovalType, React.ReactNode> = {
  testimonial: <Star className="w-4 h-4" />,
  message: <MessageSquare className="w-4 h-4" />,
  content: <FileText className="w-4 h-4" />,
};

export function ApprovalManager({
  pendingApprovals = [],
  config,
  loading = false,
  onApprove,
  onReject,
  onConfigUpdate,
  onRefresh,
}: ApprovalManagerProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'config'>('pending');
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<ApprovalType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<ApprovalStatus | 'all'>('all');
  const [configState, setConfigState] = useState<ApprovalConfig | null>(config || null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (config) {
      setConfigState(config);
    }
  }, [config]);

  const filteredApprovals = useMemo(() => {
    let filtered = pendingApprovals;

    if (activeTab === 'pending') {
      filtered = filtered.filter((a) => a.status === 'pending');
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.content.text.toLowerCase().includes(query) ||
          a.content.title?.toLowerCase().includes(query) ||
          a.itemId.toLowerCase().includes(query),
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((a) => a.type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((a) => a.status === filterStatus);
    }

    return filtered.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  }, [pendingApprovals, activeTab, searchQuery, filterType, filterStatus]);

  const handleApprove = async (approval: ApprovalRequest) => {
    if (onApprove) {
      await onApprove(approval.id);
      setIsDetailModalOpen(false);
      onRefresh?.();
    }
  };

  const handleReject = async () => {
    if (selectedApproval && rejectionReason.trim()) {
      if (onReject) {
        await onReject(selectedApproval.id, rejectionReason);
        setIsRejectModalOpen(false);
        setIsDetailModalOpen(false);
        setRejectionReason('');
        onRefresh?.();
      }
    }
  };

  const handleSaveConfig = async () => {
    if (!configState) return;
    setSaving(true);
    try {
      if (onConfigUpdate) {
        await onConfigUpdate(configState);
      }
    } catch (error) {
      console.error('Error guardando configuración:', error);
    } finally {
      setSaving(false);
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

  const pendingCount = pendingApprovals.filter((a) => a.status === 'pending').length;

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Gestión de Aprobaciones</h2>
          <p className="text-gray-600 dark:text-slate-400 mt-1">
            Aprobar testimonios y mensajes antes de publicar para asegurar que reflejen tu marca
          </p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="amber" size="lg" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      <Tabs
        items={[
          {
            id: 'pending',
            label: `Pendientes ${pendingCount > 0 ? `(${pendingCount})` : ''}`,
            icon: <Clock className="w-4 h-4" />,
          },
          {
            id: 'all',
            label: 'Todos',
            icon: <FileText className="w-4 h-4" />,
          },
          {
            id: 'config',
            label: 'Configuración',
            icon: <TrendingUp className="w-4 h-4" />,
          },
        ]}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as 'pending' | 'all' | 'config')}
        variant="pills"
      />

      {activeTab === 'config' && configState ? (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Aprobación de Testimonios</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  Configura cómo se aprueban los testimonios antes de publicar
                </p>
              </div>
            </div>

            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={configState.testimonialApproval.enabled}
                  onChange={(e) =>
                    setConfigState({
                      ...configState,
                      testimonialApproval: { ...configState.testimonialApproval, enabled: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                  Requerir aprobación antes de publicar testimonios
                </span>
              </label>

              {configState.testimonialApproval.enabled && (
                <div className="ml-7 space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configState.testimonialApproval.autoApproveHighScore || false}
                      onChange={(e) =>
                        setConfigState({
                          ...configState,
                          testimonialApproval: {
                            ...configState.testimonialApproval,
                            autoApproveHighScore: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-slate-300">
                      Auto-aprobar testimonios con puntuación alta
                    </span>
                  </label>

                  {configState.testimonialApproval.autoApproveHighScore && (
                    <div className="ml-7">
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Umbral de puntuación para auto-aprobación
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        value={configState.testimonialApproval.autoApproveScoreThreshold || 4.5}
                        onChange={(e) =>
                          setConfigState({
                            ...configState,
                            testimonialApproval: {
                              ...configState.testimonialApproval,
                              autoApproveScoreThreshold: parseFloat(e.target.value),
                            },
                          })
                        }
                        className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-slate-100"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Aprobación de Mensajes</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  Configura cómo se aprueban los mensajes automatizados antes de enviar
                </p>
              </div>
            </div>

            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={configState.messageApproval.enabled}
                  onChange={(e) =>
                    setConfigState({
                      ...configState,
                      messageApproval: { ...configState.messageApproval, enabled: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                  Requerir aprobación antes de enviar mensajes
                </span>
              </label>

              {configState.messageApproval.enabled && (
                <div className="ml-7 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configState.messageApproval.autoApproveTemplates || false}
                      onChange={(e) =>
                        setConfigState({
                          ...configState,
                          messageApproval: {
                            ...configState.messageApproval,
                            autoApproveTemplates: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-slate-300">
                      Auto-aprobar mensajes de plantillas aprobadas
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setConfigState(config || null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveConfig} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar configuración'}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar aprobaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-slate-100"
              />
            </div>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as ApprovalType | 'all')}
              className="w-48"
            >
              <option value="all">Todos los tipos</option>
              <option value="testimonial">Testimonios</option>
              <option value="message">Mensajes</option>
              <option value="content">Contenido</option>
            </Select>
            {activeTab === 'all' && (
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as ApprovalStatus | 'all')}
                className="w-48"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="approved">Aprobado</option>
                <option value="rejected">Rechazado</option>
                <option value="auto-approved">Auto-aprobado</option>
              </Select>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600 dark:text-slate-400">Cargando aprobaciones...</p>
            </div>
          ) : filteredApprovals.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-slate-400">
                {activeTab === 'pending' ? 'No hay aprobaciones pendientes' : 'No se encontraron aprobaciones'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedApproval(approval);
                    setIsDetailModalOpen(true);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        {TYPE_ICONS[approval.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-slate-100">
                            {approval.content.title || TYPE_LABELS[approval.type]}
                          </h3>
                          <Badge className={STATUS_COLORS[approval.status]}>{STATUS_LABELS[approval.status]}</Badge>
                          <Badge variant="secondary">{TYPE_LABELS[approval.type]}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2">
                          {approval.content.text}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(approval.requestedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {approval.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApproval(approval);
                            setIsRejectModalOpen(true);
                          }}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Rechazar
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(approval);
                          }}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Aprobar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal de detalle */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedApproval ? `${TYPE_LABELS[selectedApproval.type]} - Detalle` : 'Detalle'}
        size="lg"
        footer={
          selectedApproval?.status === 'pending' ? (
            <>
              <Button variant="secondary" onClick={() => setIsDetailModalOpen(false)}>
                Cerrar
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsRejectModalOpen(true);
                }}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Rechazar
              </Button>
              <Button onClick={() => handleApprove(selectedApproval)}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Aprobar
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={() => setIsDetailModalOpen(false)}>
              Cerrar
            </Button>
          )
        }
      >
        {selectedApproval && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Tipo</label>
              <Badge className={STATUS_COLORS[selectedApproval.status]}>{TYPE_LABELS[selectedApproval.type]}</Badge>
            </div>
            {selectedApproval.content.title && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Título</label>
                <p className="text-gray-900 dark:text-slate-100">{selectedApproval.content.title}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Contenido</label>
              <p className="text-gray-900 dark:text-slate-100 whitespace-pre-wrap">{selectedApproval.content.text}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Estado</label>
              <Badge className={STATUS_COLORS[selectedApproval.status]}>{STATUS_LABELS[selectedApproval.status]}</Badge>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Solicitado el
              </label>
              <p className="text-gray-600 dark:text-slate-400">{formatDate(selectedApproval.requestedAt)}</p>
            </div>
            {selectedApproval.approvedAt && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Aprobado el</label>
                <p className="text-gray-600 dark:text-slate-400">{formatDate(selectedApproval.approvedAt)}</p>
              </div>
            )}
            {selectedApproval.rejectionReason && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Razón de rechazo
                </label>
                <p className="text-gray-600 dark:text-slate-400">{selectedApproval.rejectionReason}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal de rechazo */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setRejectionReason('');
        }}
        title="Rechazar aprobación"
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsRejectModalOpen(false);
                setRejectionReason('');
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="secondary"
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Rechazar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-slate-400">
            Por favor, proporciona una razón para rechazar esta aprobación:
          </p>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Ej: El contenido no refleja la marca, lenguaje inapropiado, etc."
            rows={4}
            className="w-full"
          />
        </div>
      </Modal>
    </Card>
  );
}

