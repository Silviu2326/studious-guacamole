import { useState, useEffect } from 'react';
import { Sparkles, Plus, Brain, Lightbulb, Target, FileText, Copy, Download, X } from 'lucide-react';
import { Card, Button, Modal, Input, Textarea, Select, Badge } from '../../../components/componentsreutilizables';
import { WowMoment, WowMomentType, ReplicationStrategy } from '../types';
import { CommunityFidelizacionService } from '../services/communityFidelizacionService';
import { useAuth } from '../../../context/AuthContext';

interface WowMomentsCaptureProps {
  wowMoments?: WowMoment[];
  loading?: boolean;
  onMomentCaptured?: () => void;
}

const WOW_MOMENT_TYPES: { value: WowMomentType; label: string }[] = [
  { value: 'sesion-especial', label: 'Sesión Especial' },
  { value: 'ritual', label: 'Ritual' },
  { value: 'logro-cliente', label: 'Logro de Cliente' },
  { value: 'evento-comunidad', label: 'Evento de Comunidad' },
  { value: 'personalizado', label: 'Personalizado' },
];

export function WowMomentsCapture({ wowMoments = [], loading, onMomentCaptured }: WowMomentsCaptureProps) {
  const { user } = useAuth();
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [selectedMoment, setSelectedMoment] = useState<WowMoment | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);
  const [selectedMomentForStrategy, setSelectedMomentForStrategy] = useState<WowMoment | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    type: 'sesion-especial' as WowMomentType,
    description: '',
    clientId: '',
    clientName: '',
    sessionId: '',
    eventDetails: '',
    tags: [] as string[],
    notes: '',
  });
  const [tagInput, setTagInput] = useState('');

  const handleCaptureMoment = async () => {
    if (!formData.title || !formData.description) {
      alert('Por favor completa el título y la descripción');
      return;
    }

    try {
      await CommunityFidelizacionService.captureWowMoment({
        title: formData.title,
        type: formData.type,
        description: formData.description,
        capturedBy: user?.id,
        clientId: formData.clientId || undefined,
        clientName: formData.clientName || undefined,
        sessionId: formData.sessionId || undefined,
        eventDetails: formData.eventDetails || undefined,
        tags: formData.tags,
        notes: formData.notes || undefined,
      });

      // Reset form
      setFormData({
        title: '',
        type: 'sesion-especial',
        description: '',
        clientId: '',
        clientName: '',
        sessionId: '',
        eventDetails: '',
        tags: [],
        notes: '',
      });
      setIsCaptureModalOpen(false);
      onMomentCaptured?.();
    } catch (error) {
      console.error('Error capturando momento:', error);
      alert('Error al capturar el momento. Intenta nuevamente.');
    }
  };

  const handleAnalyzeWithAI = async (moment: WowMoment) => {
    setIsAnalyzing(true);
    try {
      await CommunityFidelizacionService.analyzeWowMomentWithAI(moment.id);
      onMomentCaptured?.();
    } catch (error) {
      console.error('Error analizando momento:', error);
      alert('Error al analizar el momento. Intenta nuevamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const openStrategyModal = (moment: WowMoment) => {
    setSelectedMomentForStrategy(moment);
    setIsStrategyModalOpen(true);
  };

  return (
    <>
      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-900/40 dark:to-pink-900/30 rounded-xl">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Captura tus "Momentos Wow"
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                La IA captura y analiza tus momentos especiales (sesiones, rituales) para replicarlos en estrategias de fidelización
              </p>
            </div>
          </div>
          <Button onClick={() => setIsCaptureModalOpen(true)} className="inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Capturar momento
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-32 bg-slate-200/70 dark:bg-slate-700/60 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : wowMoments.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay momentos wow capturados aún.</p>
            <p className="text-sm mt-2">Captura tu primer momento especial para empezar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {wowMoments.map((moment) => (
              <div
                key={moment.id}
                className="rounded-lg border border-slate-200/60 dark:border-slate-800/60 p-5 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{moment.title}</h4>
                      <Badge variant="blue" size="sm">
                        {WOW_MOMENT_TYPES.find((t) => t.value === moment.type)?.label}
                      </Badge>
                      <StatusBadge status={moment.status} />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{moment.description}</p>
                    {moment.clientName && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Cliente: {moment.clientName} · {new Date(moment.capturedAt).toLocaleDateString()}
                      </p>
                    )}
                    {moment.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {moment.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {moment.aiAnalysis && (
                  <div className="mt-4 p-4 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-200/50 dark:border-indigo-800/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                      <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">
                        Análisis IA
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">Elementos clave:</p>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                          {moment.aiAnalysis.keyElements.slice(0, 3).map((el, i) => (
                            <li key={i}>{el}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">Acciones replicables:</p>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                          {moment.aiAnalysis.replicableActions.slice(0, 3).map((action, i) => (
                            <li key={i}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {moment.replicationStrategies && moment.replicationStrategies.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Estrategias de replicación:
                    </p>
                    <div className="space-y-2">
                      {moment.replicationStrategies.map((strategy) => (
                        <div
                          key={strategy.id}
                          className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {strategy.name}
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">{strategy.description}</p>
                            </div>
                            {strategy.isActive && (
                              <Badge variant="green" size="sm">
                                Activa
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  {!moment.aiAnalysis && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAnalyzeWithAI(moment)}
                      disabled={isAnalyzing}
                      className="inline-flex items-center gap-2"
                    >
                      <Brain className="w-4 h-4" />
                      {isAnalyzing ? 'Analizando...' : 'Analizar con IA'}
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openStrategyModal(moment)}
                    className="inline-flex items-center gap-2"
                  >
                    <Target className="w-4 h-4" />
                    Crear estrategia
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMoment(moment)}
                    className="inline-flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Ver detalles
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal para capturar momento */}
      <Modal
        isOpen={isCaptureModalOpen}
        onClose={() => setIsCaptureModalOpen(false)}
        title="Capturar Momento Wow"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCaptureModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCaptureMoment} className="inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Capturar y analizar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Título del momento *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ej: Ritual de bienvenida personalizado"
          />
          <Select
            label="Tipo de momento"
            value={formData.type}
            onChange={(value) => setFormData({ ...formData, type: value as WowMomentType })}
            options={WOW_MOMENT_TYPES}
          />
          <Textarea
            label="Descripción *"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe qué hizo especial este momento..."
            rows={4}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombre del cliente (opcional)"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              placeholder="Ej: María Fernández"
            />
            <Input
              label="ID del cliente (opcional)"
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              placeholder="cliente_001"
            />
          </div>
          <Input
            label="ID de sesión (opcional)"
            value={formData.sessionId}
            onChange={(e) => setFormData({ ...formData, sessionId: e.target.value })}
            placeholder="ses_001"
          />
          <Textarea
            label="Detalles del evento (opcional)"
            value={formData.eventDetails}
            onChange={(e) => setFormData({ ...formData, eventDetails: e.target.value })}
            placeholder="Detalles adicionales sobre el evento o contexto..."
            rows={2}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Etiquetas</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Agregar etiqueta..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button variant="secondary" onClick={handleAddTag} size="sm">
                Agregar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="blue" size="sm" className="flex items-center gap-1">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          <Textarea
            label="Notas adicionales (opcional)"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Notas adicionales..."
            rows={2}
          />
        </div>
      </Modal>

      {/* Modal para crear estrategia de replicación */}
      <ReplicationStrategyModal
        isOpen={isStrategyModalOpen}
        onClose={() => {
          setIsStrategyModalOpen(false);
          setSelectedMomentForStrategy(null);
        }}
        moment={selectedMomentForStrategy}
        onStrategyCreated={() => {
          setIsStrategyModalOpen(false);
          setSelectedMomentForStrategy(null);
          onMomentCaptured?.();
        }}
      />

      {/* Modal para ver detalles */}
      {selectedMoment && (
        <MomentDetailsModal
          moment={selectedMoment}
          onClose={() => setSelectedMoment(null)}
        />
      )}
    </>
  );
}

function StatusBadge({ status }: { status: WowMoment['status'] }) {
  const map = {
    capturado: { label: 'Capturado', className: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' },
    'en-analisis': { label: 'En análisis', className: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300' },
    replicado: { label: 'Replicado', className: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300' },
    archivado: { label: 'Archivado', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300' },
  } as const;

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${map[status].className}`}>
      {map[status].label}
    </span>
  );
}

function ReplicationStrategyModal({
  isOpen,
  onClose,
  moment,
  onStrategyCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  moment: WowMoment | null;
  onStrategyCreated: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAudience: '',
    suggestedActions: [] as string[],
    suggestedScript: '',
    suggestedFollowUp: '',
    isActive: true,
  });
  const [actionInput, setActionInput] = useState('');

  const handleSave = async () => {
    if (!moment || !formData.name || !formData.description || !formData.targetAudience) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      await CommunityFidelizacionService.createReplicationStrategy(moment.id, {
        name: formData.name,
        description: formData.description,
        targetAudience: formData.targetAudience,
        suggestedActions: formData.suggestedActions,
        suggestedScript: formData.suggestedScript || undefined,
        suggestedFollowUp: formData.suggestedFollowUp || undefined,
        isActive: formData.isActive,
      });
      onStrategyCreated();
    } catch (error) {
      console.error('Error creando estrategia:', error);
      alert('Error al crear la estrategia. Intenta nuevamente.');
    }
  };

  const handleAddAction = () => {
    if (actionInput.trim() && !formData.suggestedActions.includes(actionInput.trim())) {
      setFormData({ ...formData, suggestedActions: [...formData.suggestedActions, actionInput.trim()] });
      setActionInput('');
    }
  };

  const handleRemoveAction = (action: string) => {
    setFormData({ ...formData, suggestedActions: formData.suggestedActions.filter((a) => a !== action) });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Estrategia de Replicación"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Crear estrategia</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Nombre de la estrategia *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Bienvenida Premium"
        />
        <Textarea
          label="Descripción *"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe la estrategia de replicación..."
          rows={3}
        />
        <Input
          label="Audiencia objetivo *"
          value={formData.targetAudience}
          onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
          placeholder="Ej: Nuevos clientes premium"
        />
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Acciones sugeridas
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={actionInput}
              onChange={(e) => setActionInput(e.target.value)}
              placeholder="Agregar acción..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddAction();
                }
              }}
            />
            <Button variant="secondary" onClick={handleAddAction} size="sm">
              Agregar
            </Button>
          </div>
          <div className="space-y-1">
            {formData.suggestedActions.map((action, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded">
                <span className="text-sm text-slate-700 dark:text-slate-300">{action}</span>
                <button onClick={() => handleRemoveAction(action)} className="text-red-500 hover:text-red-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <Textarea
          label="Guión sugerido (opcional)"
          value={formData.suggestedScript}
          onChange={(e) => setFormData({ ...formData, suggestedScript: e.target.value })}
          placeholder="Guión para replicar el momento..."
          rows={3}
        />
        <Textarea
          label="Follow-up sugerido (opcional)"
          value={formData.suggestedFollowUp}
          onChange={(e) => setFormData({ ...formData, suggestedFollowUp: e.target.value })}
          placeholder="Acción de seguimiento sugerida..."
          rows={2}
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Estrategia activa
          </label>
        </div>
      </div>
    </Modal>
  );
}

function MomentDetailsModal({ moment, onClose }: { moment: WowMoment; onClose: () => void }) {
  return (
    <Modal isOpen={!!moment} onClose={onClose} title={moment.title} size="lg" footer={<Button onClick={onClose}>Cerrar</Button>}>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descripción</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">{moment.description}</p>
        </div>
        {moment.aiAnalysis && (
          <div className="p-4 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/20">
            <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-100 mb-3">Análisis IA Completo</p>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">Elementos clave:</p>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400">
                  {moment.aiAnalysis.keyElements.map((el, i) => (
                    <li key={i}>{el}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">Triggers emocionales:</p>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400">
                  {moment.aiAnalysis.emotionalTriggers.map((trigger, i) => (
                    <li key={i}>{trigger}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">Acciones replicables:</p>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400">
                  {moment.aiAnalysis.replicableActions.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

