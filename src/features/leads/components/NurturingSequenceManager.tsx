import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Modal, Input, Select, Tabs, Textarea } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import {
  NurturingSequence,
  NurturingStep,
  NurturingTrigger,
  MessageTemplate,
  TriggerEvent,
  InteractionChannel,
  LeadSource
} from '../types';
import {
  getNurturingSequences,
  createNurturingSequence,
  updateNurturingSequence,
  deleteNurturingSequence,
  toggleNurturingSequenceStatus,
  getSequenceMetrics,
  getActiveLeadsInSequence
} from '../api/nurturing';
import {
  Play,
  Pause,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Mail,
  MessageCircle,
  Phone,
  Clock,
  Users,
  TrendingUp,
  Target,
  AlertCircle,
  Zap,
  Bot
} from 'lucide-react';

interface NurturingSequenceManagerProps {
  businessType: 'entrenador' | 'gimnasio';
}

export const NurturingSequenceManager: React.FC<NurturingSequenceManagerProps> = ({ businessType }) => {
  const { user } = useAuth();
  const [sequences, setSequences] = useState<NurturingSequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedSequence, setSelectedSequence] = useState<NurturingSequence | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sequenceToDelete, setSequenceToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadSequences();
  }, [businessType]);

  const loadSequences = async () => {
    setLoading(true);
    try {
      const data = await getNurturingSequences(businessType);
      setSequences(data);
    } catch (error) {
      console.error('Error cargando secuencias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleNurturingSequenceStatus(id);
      await loadSequences();
    } catch (error) {
      console.error('Error cambiando estado:', error);
    }
  };

  const handleDelete = async () => {
    if (!sequenceToDelete) return;
    try {
      await deleteNurturingSequence(sequenceToDelete);
      setShowDeleteModal(false);
      setSequenceToDelete(null);
      await loadSequences();
    } catch (error) {
      console.error('Error eliminando secuencia:', error);
    }
  };

  const getChannelIcon = (channel: InteractionChannel) => {
    switch (channel) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const formatDelay = (delay: { value: number; unit: 'minutes' | 'hours' | 'days' }) => {
    const unitLabels = {
      minutes: 'min',
      hours: 'h',
      days: 'd'
    };
    return `${delay.value} ${unitLabels[delay.unit]}`;
  };

  const getStatusBadge = (status: 'active' | 'paused' | 'draft') => {
    const badges = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    };
    return badges[status];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className={`animate-spin ${ds.radius.full} h-8 w-8 border-b-2 ${ds.color.primaryBg}`}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-[#F1F5F9]">
              {businessType === 'entrenador' ? 'Respuestas Automáticas' : 'Secuencias de Nurturing'}
            </h2>
          </div>
          <p className="text-gray-600 dark:text-[#94A3B8] mt-1 ml-14">
            {businessType === 'entrenador' 
              ? 'Configura mensajes automáticos que se envían a tus leads cuando llegan. Nunca pierdas una oportunidad por no responder a tiempo.'
              : 'Automatiza el seguimiento de tus leads con secuencias personalizadas'}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedSequence(null);
            setActiveTab('create');
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          {businessType === 'entrenador' ? 'Nueva Respuesta Automática' : 'Nueva Secuencia'}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        items={[
          { 
            id: 'list', 
            label: businessType === 'entrenador' ? 'Mis Respuestas Automáticas' : 'Mis Secuencias', 
            icon: <BarChart3 className="w-4 h-4" /> 
          },
          { 
            id: 'create', 
            label: selectedSequence 
              ? (businessType === 'entrenador' ? 'Editar Respuesta Automática' : 'Editar Secuencia')
              : (businessType === 'entrenador' ? 'Crear Respuesta Automática' : 'Crear Secuencia'), 
            icon: <Plus className="w-4 h-4" /> 
          }
        ]}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab as 'list' | 'create' | 'edit');
          if (tab === 'list') {
            setSelectedSequence(null);
          }
        }}
        variant="pills"
      />

      {/* Content */}
      {activeTab === 'list' && (
        <div className="space-y-6">
          {/* Info Card para entrenadores */}
          {businessType === 'entrenador' && sequences.length === 0 && (
            <Card variant="outlined" padding="lg" className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                  <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-[#F1F5F9] mb-2">
                    ¿Qué son las Respuestas Automáticas?
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-[#94A3B8] mb-3">
                    Cuando un lead te contacta desde Instagram o WhatsApp, el sistema puede responder automáticamente en menos de 1 hora, incluso si estás ocupado con clientes.
                  </p>
                  <ul className="text-sm text-gray-700 dark:text-[#94A3B8] space-y-1 list-disc list-inside">
                    <li>Envía un mensaje de bienvenida automático</li>
                    <li>Si no responden, envía un seguimiento después de 2 días</li>
                    <li>Programa una llamada si aún no hay respuesta</li>
                  </ul>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mt-3">
                    💡 <strong>Resultado:</strong> Nunca pierdes un lead por no responder a tiempo
                  </p>
                </div>
              </div>
            </Card>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sequences.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Bot className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-[#94A3B8] mb-2">
                  {businessType === 'entrenador' 
                    ? 'Aún no has creado ninguna respuesta automática.'
                    : 'No hay secuencias creadas.'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {businessType === 'entrenador'
                    ? 'Crea tu primera respuesta automática para empezar a no perder leads.'
                    : 'Crea tu primera secuencia para empezar.'}
                </p>
              </div>
            ) : (
            sequences.map((sequence) => (
              <Card key={sequence.id} variant="hover" padding="md">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-[#F1F5F9]">
                        {sequence.name}
                      </h3>
                      {sequence.description && (
                        <p className="text-sm text-gray-600 dark:text-[#94A3B8] mt-1">
                          {sequence.description}
                        </p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(sequence.status)}`}>
                      {sequence.status === 'active' ? 'Activa' : sequence.status === 'paused' ? 'Pausada' : 'Borrador'}
                    </span>
                  </div>

                  {/* Steps Preview */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700 dark:text-[#94A3B8]">
                      Pasos ({sequence.steps.length}):
                    </p>
                    {sequence.steps.slice(0, 3).map((step, idx) => (
                      <div key={step.id} className="flex items-center gap-2 text-sm text-gray-600 dark:text-[#94A3B8]">
                        <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-semibold">
                          {idx + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          {getChannelIcon(step.channel)}
                          <span>{step.name}</span>
                        </div>
                        <span className="ml-auto text-xs text-gray-500 dark:text-gray-500">
                          +{formatDelay(step.delay)}
                        </span>
                      </div>
                    ))}
                    {sequence.steps.length > 3 && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        +{sequence.steps.length - 3} pasos más
                      </p>
                    )}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 dark:border-[#334155]">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Leads Totales</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-[#F1F5F9]">
                        {sequence.metrics.totalLeads}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Tasa Respuesta</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-[#F1F5F9]">
                        {sequence.metrics.responseRate.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Conversión</p>
                      <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {sequence.metrics.conversionRate.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Activos</p>
                      <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {sequence.metrics.activeSequences}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-[#334155]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(sequence.id)}
                      className="flex-1"
                    >
                      {sequence.status === 'active' ? (
                        <>
                          <Pause className="w-4 h-4 mr-1" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-1" />
                          Activar
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedSequence(sequence);
                        setActiveTab('create');
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSequenceToDelete(sequence.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <SequenceEditor
          sequence={selectedSequence}
          businessType={businessType}
          onSave={async () => {
            await loadSequences();
            setActiveTab('list');
            setSelectedSequence(null);
          }}
          onCancel={() => {
            setActiveTab('list');
            setSelectedSequence(null);
          }}
        />
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSequenceToDelete(null);
        }}
        title="Eliminar Secuencia"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSequenceToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Eliminar
            </Button>
          </div>
        }
      >
        <p className="text-gray-600 dark:text-[#94A3B8]">
          ¿Estás seguro de que quieres eliminar esta secuencia? Esta acción no se puede deshacer.
        </p>
      </Modal>
    </div>
  );
};

// Componente para crear/editar secuencias
interface SequenceEditorProps {
  sequence: NurturingSequence | null;
  businessType: 'entrenador' | 'gimnasio';
  onSave: () => void;
  onCancel: () => void;
}

const SequenceEditor: React.FC<SequenceEditorProps> = ({ sequence, businessType, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: sequence?.name || '',
    description: sequence?.description || '',
    status: (sequence?.status || 'draft') as 'active' | 'paused' | 'draft',
    steps: (sequence?.steps || []) as NurturingStep[],
    triggers: (sequence?.triggers || []) as NurturingTrigger[]
  });
  const [saving, setSaving] = useState(false);
  const [showStepEditor, setShowStepEditor] = useState(false);
  const [editingStep, setEditingStep] = useState<NurturingStep | null>(null);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('El nombre es requerido');
      return;
    }

    setSaving(true);
    try {
      if (sequence) {
        await updateNurturingSequence(sequence.id, formData);
      } else {
        await createNurturingSequence({
          ...formData,
          businessType
        });
      }
      onSave();
    } catch (error) {
      console.error('Error guardando secuencia:', error);
      alert('Error al guardar la secuencia');
    } finally {
      setSaving(false);
    }
  };

  const handleAddStep = () => {
    setEditingStep(null);
    setShowStepEditor(true);
  };

  const handleEditStep = (step: NurturingStep) => {
    setEditingStep(step);
    setShowStepEditor(true);
  };

  const handleSaveStep = (step: NurturingStep) => {
    if (editingStep) {
      // Editar paso existente
      const index = formData.steps.findIndex(s => s.id === editingStep.id);
      const newSteps = [...formData.steps];
      newSteps[index] = step;
      setFormData({ ...formData, steps: newSteps });
    } else {
      // Agregar nuevo paso
      const newStep: NurturingStep = {
        ...step,
        id: Date.now().toString(),
        order: formData.steps.length + 1
      };
      setFormData({ ...formData, steps: [...formData.steps, newStep] });
    }
    setShowStepEditor(false);
    setEditingStep(null);
  };

  const handleDeleteStep = (stepId: string) => {
    const newSteps = formData.steps.filter(s => s.id !== stepId).map((s, idx) => ({
      ...s,
      order: idx + 1
    }));
    setFormData({ ...formData, steps: newSteps });
  };

  return (
    <Card padding="lg">
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-[#F1F5F9]">
            Información Básica
          </h3>
          <Input
            label="Nombre de la Secuencia *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Seguimiento Instagram"
            required
          />
          <Input
            label="Descripción"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe el propósito de esta secuencia"
          />
          <Select
            label="Estado"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'paused' | 'draft' })}
            options={[
              { value: 'draft', label: 'Borrador' },
              { value: 'paused', label: 'Pausada' },
              { value: 'active', label: 'Activa' }
            ]}
          />
        </div>

        {/* Steps */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-[#F1F5F9]">
              Pasos de la Secuencia ({formData.steps.length})
            </h3>
            <Button variant="secondary" size="sm" onClick={handleAddStep}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Paso
            </Button>
          </div>

          {formData.steps.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-[#334155] rounded-lg">
              <p className="text-gray-500 dark:text-gray-500">
                No hay pasos configurados. Agrega el primer paso para empezar.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {formData.steps.map((step, idx) => (
                <Card key={step.id} variant="hover" padding="md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-semibold">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {step.channel === 'email' && <Mail className="w-4 h-4 text-gray-600 dark:text-[#94A3B8]" />}
                          {step.channel === 'whatsapp' && <MessageCircle className="w-4 h-4 text-gray-600 dark:text-[#94A3B8]" />}
                          {step.channel === 'phone' && <Phone className="w-4 h-4 text-gray-600 dark:text-[#94A3B8]" />}
                          <span className="font-medium text-gray-900 dark:text-[#F1F5F9]">{step.name}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-[#94A3B8] mt-1">
                          Delay: {formatDelay(step.delay)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditStep(step)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteStep(step.id)}>
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-[#334155]">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} loading={saving}>
            Guardar Secuencia
          </Button>
        </div>
      </div>

      {/* Step Editor Modal */}
      {showStepEditor && (
        <StepEditorModal
          step={editingStep}
          onSave={handleSaveStep}
          onCancel={() => {
            setShowStepEditor(false);
            setEditingStep(null);
          }}
        />
      )}
    </Card>
  );
};

// Modal para editar un paso
interface StepEditorModalProps {
  step: NurturingStep | null;
  onSave: (step: NurturingStep) => void;
  onCancel: () => void;
}

const StepEditorModal: React.FC<StepEditorModalProps> = ({ step, onSave, onCancel }) => {
  const [stepData, setStepData] = useState({
    name: step?.name || '',
    channel: (step?.channel || 'email') as InteractionChannel,
    delayValue: step?.delay.value || 1,
    delayUnit: (step?.delay.unit || 'hours') as 'minutes' | 'hours' | 'days',
    templateBody: step?.template.body || '',
    templateSubject: step?.template.subject || ''
  });

  const handleSave = () => {
    if (!stepData.name.trim() || !stepData.templateBody.trim()) {
      alert('El nombre y el mensaje son requeridos');
      return;
    }

    const newStep: NurturingStep = {
      id: step?.id || Date.now().toString(),
      order: step?.order || 1,
      name: stepData.name,
      channel: stepData.channel,
      delay: {
        value: stepData.delayValue,
        unit: stepData.delayUnit
      },
      template: {
        id: step?.template.id || Date.now().toString(),
        subject: stepData.channel === 'email' ? stepData.templateSubject : undefined,
        body: stepData.templateBody,
        variables: ['name'],
        personalizations: [
          {
            variable: 'name',
            source: 'lead_data',
            field: 'name',
            defaultValue: 'amigo/a'
          }
        ]
      }
    };

    onSave(newStep);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={step ? 'Editar Paso' : 'Nuevo Paso'}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar Paso
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          label="Nombre del Paso *"
          value={stepData.name}
          onChange={(e) => setStepData({ ...stepData, name: e.target.value })}
          placeholder="Ej: Email de bienvenida"
          required
        />

        <Select
          label="Canal *"
          value={stepData.channel}
          onChange={(e) => setStepData({ ...stepData, channel: e.target.value as InteractionChannel })}
          options={[
            { value: 'email', label: 'Email' },
            { value: 'whatsapp', label: 'WhatsApp' },
            { value: 'phone', label: 'Llamada' }
          ]}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Delay (Valor) *"
            type="number"
            value={stepData.delayValue}
            onChange={(e) => setStepData({ ...stepData, delayValue: parseInt(e.target.value) || 1 })}
            min={1}
            required
          />
          <Select
            label="Unidad *"
            value={stepData.delayUnit}
            onChange={(e) => setStepData({ ...stepData, delayUnit: e.target.value as 'minutes' | 'hours' | 'days' })}
            options={[
              { value: 'minutes', label: 'Minutos' },
              { value: 'hours', label: 'Horas' },
              { value: 'days', label: 'Días' }
            ]}
            required
          />
        </div>

        {stepData.channel === 'email' && (
          <Input
            label="Asunto del Email"
            value={stepData.templateSubject}
            onChange={(e) => setStepData({ ...stepData, templateSubject: e.target.value })}
            placeholder="Ej: ¡Hola {{name}}!"
          />
        )}

        <Textarea
          label="Mensaje * (Usa {{name}} para personalizar)"
          value={stepData.templateBody}
          onChange={(e) => setStepData({ ...stepData, templateBody: e.target.value })}
          rows={6}
          placeholder="Ej: Hola {{name}}, vi que te interesó nuestro contenido..."
          required
        />
      </div>
    </Modal>
  );
};

// Helper function
const formatDelay = (delay: { value: number; unit: 'minutes' | 'hours' | 'days' }) => {
  const unitLabels = {
    minutes: 'min',
    hours: 'h',
    days: 'd'
  };
  return `${delay.value} ${unitLabels[delay.unit]}`;
};
