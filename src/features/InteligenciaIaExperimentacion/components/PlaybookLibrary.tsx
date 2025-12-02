import React, { useState } from 'react';
import {
  TableWithActions,
  Badge,
  Tooltip,
  Button,
  Card,
  Modal,
  Input,
  Textarea,
} from '../../../components/componentsreutilizables';
import { PlaybookRecord, TeamMember } from '../types';
import { 
  BookOpenCheck, 
  Eye, 
  CopyPlus, 
  PauseCircle, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Image, 
  BarChart3,
  Loader2,
  X,
  Share2,
  Check,
  XCircle,
} from 'lucide-react';
import { generateCompletePlaybookService, sharePlaybookService, getTeamMembersService, recordPlaybookDecisionService } from '../services/intelligenceService';
import { useAuth } from '../../../context/AuthContext';
import { SharePlaybook } from './SharePlaybook';
import { PlaybookDecisionAction } from '../types';

interface PlaybookLibraryProps {
  playbooks: PlaybookRecord[];
  onPlaybookCreated?: (playbook: PlaybookRecord) => void;
  onPlaybookShared?: (playbookId: string) => void;
}

const statusVariant: Record<PlaybookRecord['status'], 'success' | 'secondary' | 'yellow' | 'red'> = {
  active: 'success',
  draft: 'secondary',
  paused: 'yellow',
  archived: 'red',
};

export const PlaybookLibrary: React.FC<PlaybookLibraryProps> = ({ playbooks, onPlaybookCreated, onPlaybookShared }) => {
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlaybook, setSelectedPlaybook] = useState<PlaybookRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [sharingPlaybook, setSharingPlaybook] = useState<PlaybookRecord | null>(null);
  const [formData, setFormData] = useState({
    objective: '',
    targetAudience: '',
    channels: [] as string[],
  });
  const [processingDecision, setProcessingDecision] = useState<string | null>(null);
  const [decisionModal, setDecisionModal] = useState<{
    playbook: PlaybookRecord;
    action: PlaybookDecisionAction;
  } | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // User Story 1: Generar playbook IA completo
  const handleGeneratePlaybook = async () => {
    if (!formData.objective.trim()) {
      return;
    }

    setIsGenerating(true);
    try {
      const response = await generateCompletePlaybookService({
        objective: formData.objective,
        targetAudience: formData.targetAudience || undefined,
        channels: formData.channels.length > 0 ? formData.channels : undefined,
        trainerId: user?.id,
      });

      if (response.success && response.playbook) {
        if (onPlaybookCreated) {
          onPlaybookCreated(response.playbook);
        }
        setIsCreateModalOpen(false);
        setFormData({ objective: '', targetAudience: '', channels: [] });
      }
    } catch (error) {
      console.error('Error generando playbook', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewDetail = (playbook: PlaybookRecord) => {
    setSelectedPlaybook(playbook);
    setIsDetailModalOpen(true);
  };

  // User Story 1: Compartir playbook con equipo
  const handleSharePlaybook = async (
    playbookId: string,
    recipients: TeamMember[],
    message?: string,
    accessLevel?: 'view' | 'edit' | 'execute'
  ) => {
    try {
      const response = await sharePlaybookService({
        playbookId,
        teamMemberIds: recipients.map((r) => r.id),
        message,
        accessLevel,
      });

      if (response.success) {
        if (onPlaybookShared) {
          onPlaybookShared(playbookId);
        }
        setSharingPlaybook(null);
      }
    } catch (error) {
      console.error('Error compartiendo playbook:', error);
      throw error;
    }
  };

  const handleLoadTeamMembers = async (): Promise<TeamMember[]> => {
    try {
      return await getTeamMembersService();
    } catch (error) {
      console.error('Error cargando miembros del equipo:', error);
      return [];
    }
  };

  // Verificar si un playbook está completo (tiene estrategia, copy, assets, medición)
  const isPlaybookComplete = (playbook: PlaybookRecord): boolean => {
    return !!(
      playbook.strategy &&
      playbook.copies &&
      playbook.copies.length > 0 &&
      playbook.assets &&
      playbook.assets.length > 0 &&
      playbook.measurement
    );
  };

  // User Story 1: Registrar decisión de playbook (aceptar/rechazar)
  const handlePlaybookDecision = async (playbook: PlaybookRecord, action: PlaybookDecisionAction) => {
    if (action === 'reject' && !rejectionReason.trim()) {
      setDecisionModal({ playbook, action });
      return;
    }

    setProcessingDecision(playbook.id);
    try {
      const response = await recordPlaybookDecisionService({
        playbookId: playbook.id,
        action,
        reason: action === 'reject' ? rejectionReason : undefined,
        context: {
          objective: playbook.objective,
          channels: playbook.channels,
          targetAudience: playbook.adaptedToTrainer?.targetAudience,
        },
      });

      if (response.success) {
        setDecisionModal(null);
        setRejectionReason('');
        // Opcional: mostrar notificación de éxito
      }
    } catch (error) {
      console.error('Error registrando decisión:', error);
    } finally {
      setProcessingDecision(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-900/5 text-slate-700">
            <BookOpenCheck size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Librería de Campañas (Playbooks)</h2>
            <p className="text-sm text-slate-600">
              Diseña, evalúa y recicla playbooks multicanal impulsados por IA. Playbooks completos con estrategia, copy, assets y medición adaptados a tu estilo y audiencia.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* User Story 1: Botón para crear playbook IA completo */}
          <Button 
            variant="default" 
            size="sm" 
            leftIcon={<Sparkles size={16} />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Crear playbook IA
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<CopyPlus size={16} />}>
            Importar playbook
          </Button>
        </div>
      </div>

      <TableWithActions<PlaybookRecord>
        data={playbooks}
        emptyMessage="Crea tu primer playbook para empezar a orquestar campañas inteligentes."
        columns={[
          {
            key: 'name',
            label: 'Playbook',
            render: (_, row) => (
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{row.name}</p>
                    {isPlaybookComplete(row) && (
                      <Tooltip content="Playbook completo con estrategia, copy, assets y medición">
                        <Badge variant="success" size="sm" className="flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          Completo
                        </Badge>
                      </Tooltip>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{row.objective}</p>
                  {row.adaptedToTrainer && (
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="secondary" size="sm">
                        Adaptado a tu estilo
                      </Badge>
                      {row.sourceInsightId && (
                        <Badge variant="purple" size="sm">
                          Desde insight
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ),
          },
          {
            key: 'channels',
            label: 'Canales',
            render: (value: string[]) => (
              <div className="flex flex-wrap gap-2">
                {value.map((channel) => (
                  <Badge key={channel} variant="secondary" size="sm">
                    {channel}
                  </Badge>
                ))}
              </div>
            ),
          },
          {
            key: 'owner',
            label: 'Propietario',
          },
          {
            key: 'status',
            label: 'Estado',
            render: (value: PlaybookRecord['status']) => (
              <Badge variant={statusVariant[value]} size="sm">
                {value === 'active' && 'Activo'}
                {value === 'draft' && 'Borrador'}
                {value === 'paused' && 'Pausado'}
                {value === 'archived' && 'Archivado'}
              </Badge>
            ),
          },
          {
            key: 'impact',
            label: 'Impacto',
            render: (value: PlaybookRecord['impact']) => (
              <Badge variant={value === 'Alto' ? 'purple' : value === 'Medio' ? 'blue' : 'secondary'} size="sm">
                {value}
              </Badge>
            ),
          },
        ]}
        actions={[
          {
            label: 'Aceptar',
            icon: <Check size={16} />,
            onClick: (row) => handlePlaybookDecision(row, 'accept'),
            disabled: (row) => processingDecision === row.id,
          },
          {
            label: 'Rechazar',
            icon: <XCircle size={16} />,
            onClick: (row) => setDecisionModal({ playbook: row, action: 'reject' }),
            disabled: (row) => processingDecision === row.id,
          },
          {
            label: 'Ver detalle',
            icon: <Eye size={16} />,
            onClick: (row) => handleViewDetail(row),
          },
          {
            label: 'Compartir con equipo',
            icon: <Share2 size={16} />,
            onClick: (row) => setSharingPlaybook(row),
          },
          {
            label: 'Duplicar',
            icon: <CopyPlus size={16} />,
            onClick: () => undefined,
          },
          {
            label: 'Pausar',
            icon: <PauseCircle size={16} />,
            onClick: () => undefined,
            disabled: (row) => row.status !== 'active',
          },
        ]}
      />

      {/* User Story 1: Modal para crear playbook IA completo */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Crear Playbook IA Completo"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Genera un playbook completo con estrategia, copy, assets y medición adaptados a tu estilo y audiencia.
          </p>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Objetivo del playbook *
            </label>
            <Textarea
              value={formData.objective}
              onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
              placeholder="Ej: Aumentar retención de clientes premium"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Audiencia objetivo (opcional)
            </label>
            <Input
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              placeholder="Ej: Clientes premium activos"
            />
            <p className="text-xs text-slate-500 mt-1">
              Si no especificas, se usará la audiencia de tu perfil
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <Button
              variant="ghost"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={isGenerating}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              onClick={handleGeneratePlaybook}
              disabled={!formData.objective.trim() || isGenerating}
              leftIcon={
                isGenerating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )
              }
            >
              {isGenerating ? 'Generando playbook...' : 'Generar playbook IA'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* User Story 1: Share Playbook Modal */}
      {sharingPlaybook && (
        <SharePlaybook
          playbook={sharingPlaybook}
          onShare={handleSharePlaybook}
          onLoadTeamMembers={handleLoadTeamMembers}
          onClose={() => setSharingPlaybook(null)}
        />
      )}

      {/* User Story 1: Modal para rechazar playbook con razón */}
      {decisionModal && decisionModal.action === 'reject' && (
        <Modal
          isOpen={!!decisionModal}
          onClose={() => {
            setDecisionModal(null);
            setRejectionReason('');
          }}
          title="Rechazar Playbook"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              ¿Por qué rechazas este playbook? Esta información ayudará a la IA a mejorar futuras recomendaciones.
            </p>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Razón del rechazo *
              </label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Ej: No se ajusta a mi audiencia, canales no disponibles, objetivo no alineado..."
                rows={4}
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <Button
                variant="ghost"
                onClick={() => {
                  setDecisionModal(null);
                  setRejectionReason('');
                }}
                disabled={processingDecision === decisionModal.playbook.id}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => handlePlaybookDecision(decisionModal.playbook, 'reject')}
                disabled={!rejectionReason.trim() || processingDecision === decisionModal.playbook.id}
                leftIcon={
                  processingDecision === decisionModal.playbook.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <XCircle size={16} />
                  )
                }
              >
                {processingDecision === decisionModal.playbook.id ? 'Rechazando...' : 'Rechazar'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de detalle del playbook completo */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedPlaybook?.name || 'Detalle del Playbook'}
        size="xl"
      >
        {selectedPlaybook && (
          <div className="space-y-6">
            {/* Estrategia */}
            {selectedPlaybook.strategy && (
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={18} className="text-indigo-600" />
                  <h3 className="font-semibold text-slate-900">Estrategia</h3>
                </div>
                <p className="text-sm text-slate-600 mb-3">{selectedPlaybook.strategy.overview}</p>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-700">Audiencia: {selectedPlaybook.strategy.targetAudience}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlaybook.strategy.goals.map((goal, idx) => (
                      <Badge key={idx} variant="secondary" size="sm">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Copy */}
            {selectedPlaybook.copies && selectedPlaybook.copies.length > 0 && (
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={18} className="text-emerald-600" />
                  <h3 className="font-semibold text-slate-900">Copy</h3>
                </div>
                <div className="space-y-3">
                  {selectedPlaybook.copies.map((copy, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-lg p-3">
                      <Badge variant="blue" size="sm" className="mb-2">
                        {copy.channel}
                      </Badge>
                      {copy.subject && (
                        <p className="text-sm font-medium text-slate-900 mb-1">
                          Asunto: {copy.subject}
                        </p>
                      )}
                      <p className="text-sm text-slate-600 whitespace-pre-wrap">
                        {copy.body}
                      </p>
                      {copy.cta && (
                        <p className="text-xs text-slate-500 mt-2">CTA: {copy.cta}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Assets */}
            {selectedPlaybook.assets && selectedPlaybook.assets.length > 0 && (
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Image size={18} className="text-amber-600" />
                  <h3 className="font-semibold text-slate-900">Assets</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedPlaybook.assets.map((asset) => (
                    <div key={asset.id} className="border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" size="sm">
                          {asset.type}
                        </Badge>
                        {asset.generated && (
                          <Badge variant="purple" size="sm">
                            IA Generado
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-900">{asset.name}</p>
                      <p className="text-xs text-slate-600">{asset.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Medición */}
            {selectedPlaybook.measurement && (
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 size={18} className="text-rose-600" />
                  <h3 className="font-semibold text-slate-900">Medición</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">
                    Métrica principal: {selectedPlaybook.measurement.primaryMetric}
                  </p>
                  <div>
                    <p className="text-xs font-medium text-slate-700 mb-2">KPIs:</p>
                    <div className="space-y-2">
                      {selectedPlaybook.measurement.kpis.map((kpi, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">{kpi.name}</span>
                          <Badge variant="blue" size="sm">
                            Meta: {kpi.target} {kpi.unit}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Adaptación al entrenador */}
            {selectedPlaybook.adaptedToTrainer && (
              <Card className="p-4 bg-indigo-50">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={18} className="text-indigo-600" />
                  <h3 className="font-semibold text-slate-900">Adaptado a tu estilo</h3>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <p><strong>Estilo:</strong> {selectedPlaybook.adaptedToTrainer.trainerStyle}</p>
                  <p><strong>Audiencia:</strong> {selectedPlaybook.adaptedToTrainer.targetAudience}</p>
                  <p><strong>Tono:</strong> {selectedPlaybook.adaptedToTrainer.tone}</p>
                  {selectedPlaybook.adaptedToTrainer.differentiation.length > 0 && (
                    <div>
                      <strong>Diferenciadores:</strong>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedPlaybook.adaptedToTrainer.differentiation.map((diff, idx) => (
                          <Badge key={idx} variant="secondary" size="sm">
                            {diff}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}
      </Modal>

      <div className="rounded-2xl border border-dashed border-slate-200 p-6 bg-slate-50/70">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-900">¿Buscas inspiración?</p>
            <p className="text-sm text-slate-600">
              Conecta con la base de Playbooks IA recomendados según tus objetivos del mes.
            </p>
          </div>
          <Tooltip content="Disponible en la próxima actualización de la plataforma.">
            <span>
              <Button variant="secondary" size="sm" disabled>
                Explorar biblioteca global
              </Button>
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default PlaybookLibrary;









