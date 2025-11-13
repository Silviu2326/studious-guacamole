import { useState, useCallback, useEffect } from 'react';
import { Users, X, Plus, Trash2, Save, Sparkles, AlertCircle } from 'lucide-react';
import { Button, Card, Input, Textarea, Badge } from '../../../components/componentsreutilizables';
import { BuyerPersona, PainPoint } from '../types';
import { saveBuyerPersonas, savePainPoints, adaptFunnelCopy } from '../api';

interface BuyerPersonasEditorProps {
  funnelId: string;
  onPersonasChange?: (personas: BuyerPersona[]) => void;
  onPainPointsChange?: (painPoints: PainPoint[]) => void;
  onCopyAdapt?: (stageId: string, adaptedCopy: string) => void;
}

const painPointCategories: { value: PainPoint['category']; label: string }[] = [
  { value: 'fisico', label: 'Físico' },
  { value: 'emocional', label: 'Emocional' },
  { value: 'social', label: 'Social' },
  { value: 'economico', label: 'Económico' },
  { value: 'tiempo', label: 'Tiempo' },
  { value: 'conocimiento', label: 'Conocimiento' },
];

const intensityOptions: { value: PainPoint['intensity']; label: string }[] = [
  { value: 'bajo', label: 'Bajo' },
  { value: 'medio', label: 'Medio' },
  { value: 'alto', label: 'Alto' },
];

export function BuyerPersonasEditor({
  funnelId,
  onPersonasChange,
  onPainPointsChange,
  onCopyAdapt,
}: BuyerPersonasEditorProps) {
  const [personas, setPersonas] = useState<BuyerPersona[]>([]);
  const [painPoints, setPainPoints] = useState<PainPoint[]>([]);
  const [activeTab, setActiveTab] = useState<'personas' | 'pain-points'>('personas');
  const [editingPersona, setEditingPersona] = useState<BuyerPersona | null>(null);
  const [editingPainPoint, setEditingPainPoint] = useState<PainPoint | null>(null);
  const [saving, setSaving] = useState(false);

  const handleAddPersona = useCallback(() => {
    const newPersona: BuyerPersona = {
      id: `persona-${Date.now()}`,
      name: '',
      description: '',
      demographics: {},
      goals: [],
      painPoints: [],
      motivations: [],
      preferredChannels: [],
      objections: [],
      toneOfVoice: '',
      keywords: [],
    };
    setEditingPersona(newPersona);
  }, []);

  const handleSavePersona = useCallback(
    async (persona: BuyerPersona) => {
      setSaving(true);
      try {
        const updatedPersonas = editingPersona?.id && personas.find((p) => p.id === editingPersona.id)
          ? personas.map((p) => (p.id === editingPersona.id ? persona : p))
          : [...personas, persona];

        setPersonas(updatedPersonas);
        setEditingPersona(null);
        await saveBuyerPersonas(funnelId, updatedPersonas);
        if (onPersonasChange) {
          onPersonasChange(updatedPersonas);
        }
      } catch (error) {
        console.error('Error guardando buyer persona:', error);
      } finally {
        setSaving(false);
      }
    },
    [funnelId, personas, editingPersona, onPersonasChange],
  );

  const handleDeletePersona = useCallback(
    async (personaId: string) => {
      const updatedPersonas = personas.filter((p) => p.id !== personaId);
      setPersonas(updatedPersonas);
      await saveBuyerPersonas(funnelId, updatedPersonas);
      if (onPersonasChange) {
        onPersonasChange(updatedPersonas);
      }
    },
    [funnelId, personas, onPersonasChange],
  );

  const handleAddPainPoint = useCallback(() => {
    const newPainPoint: PainPoint = {
      id: `pain-${Date.now()}`,
      title: '',
      description: '',
      category: 'fisico',
      intensity: 'medio',
      frequency: '',
      impact: '',
    };
    setEditingPainPoint(newPainPoint);
  }, []);

  const handleSavePainPoint = useCallback(
    async (painPoint: PainPoint) => {
      setSaving(true);
      try {
        const updatedPainPoints =
          editingPainPoint?.id && painPoints.find((p) => p.id === editingPainPoint.id)
            ? painPoints.map((p) => (p.id === editingPainPoint.id ? painPoint : p))
            : [...painPoints, painPoint];

        setPainPoints(updatedPainPoints);
        setEditingPainPoint(null);
        await savePainPoints(funnelId, updatedPainPoints);
        if (onPainPointsChange) {
          onPainPointsChange(updatedPainPoints);
        }
      } catch (error) {
        console.error('Error guardando pain point:', error);
      } finally {
        setSaving(false);
      }
    },
    [funnelId, painPoints, editingPainPoint, onPainPointsChange],
  );

  const handleDeletePainPoint = useCallback(
    async (painPointId: string) => {
      const updatedPainPoints = painPoints.filter((p) => p.id !== painPointId);
      setPainPoints(updatedPainPoints);
      await savePainPoints(funnelId, updatedPainPoints);
      if (onPainPointsChange) {
        onPainPointsChange(updatedPainPoints);
      }
    },
    [funnelId, painPoints, onPainPointsChange],
  );

  const handleAdaptCopy = useCallback(
    async (stageId: string, originalCopy: string, personaId: string, painPointIds: string[]) => {
      try {
        const adaptation = await adaptFunnelCopy(funnelId, stageId, originalCopy, personaId, painPointIds);
        if (onCopyAdapt) {
          onCopyAdapt(stageId, adaptation.adaptedCopy);
        }
      } catch (error) {
        console.error('Error adaptando copy:', error);
      }
    },
    [funnelId, onCopyAdapt],
  );

  return (
    <Card className="border border-gray-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/60">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            Buyer Personas y Dolores Principales
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('personas')}
            className={[
              'rounded-lg px-4 py-2 text-sm font-medium transition-all',
              activeTab === 'personas'
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200'
                : 'text-gray-600 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800',
            ].join(' ')}
          >
            Buyer Personas
          </button>
          <button
            onClick={() => setActiveTab('pain-points')}
            className={[
              'rounded-lg px-4 py-2 text-sm font-medium transition-all',
              activeTab === 'pain-points'
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200'
                : 'text-gray-600 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800',
            ].join(' ')}
          >
            Dolores Principales
          </button>
        </div>
      </div>

      {activeTab === 'personas' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Define los perfiles de tus clientes ideales. El sistema adaptará automáticamente el copy y assets
              según estas definiciones.
            </p>
            <Button variant="primary" size="sm" onClick={handleAddPersona} className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Añadir Persona
            </Button>
          </div>

          {personas.length === 0 && !editingPersona && (
            <div className="rounded-xl border border-dashed border-gray-300/70 bg-gray-50/60 p-8 text-center dark:border-slate-700/70 dark:bg-slate-900/40">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-sm font-medium text-gray-900 dark:text-slate-100">
                No hay buyer personas definidas
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                Añade tu primera buyer persona para personalizar automáticamente tus funnels
              </p>
            </div>
          )}

          {editingPersona && (
            <PersonaForm
              persona={editingPersona}
              existingPersonas={personas}
              onSave={handleSavePersona}
              onCancel={() => setEditingPersona(null)}
              saving={saving}
            />
          )}

          <div className="space-y-3">
            {personas
              .filter((p) => p.id !== editingPersona?.id)
              .map((persona) => (
                <div
                  key={persona.id}
                  className="rounded-lg border border-gray-200/60 bg-white p-4 dark:border-slate-800/60 dark:bg-slate-800/60"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-900 dark:text-slate-100">{persona.name}</h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">{persona.description}</p>
                      {persona.goals.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {persona.goals.map((goal, idx) => (
                            <Badge key={idx} size="sm" variant="blue">
                              {goal}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingPersona(persona)}
                        className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePersona(persona.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Define los principales dolores y problemas que enfrentan tus clientes. Esto ayudará a adaptar el copy
              para que resuene mejor con ellos.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddPainPoint}
              className="inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Añadir Dolor
            </Button>
          </div>

          {painPoints.length === 0 && !editingPainPoint && (
            <div className="rounded-xl border border-dashed border-gray-300/70 bg-gray-50/60 p-8 text-center dark:border-slate-700/70 dark:bg-slate-900/40">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-sm font-medium text-gray-900 dark:text-slate-100">
                No hay dolores principales definidos
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                Añade los principales problemas que enfrentan tus clientes para personalizar mejor tu comunicación
              </p>
            </div>
          )}

          {editingPainPoint && (
            <PainPointForm
              painPoint={editingPainPoint}
              existingPainPoints={painPoints}
              onSave={handleSavePainPoint}
              onCancel={() => setEditingPainPoint(null)}
              saving={saving}
            />
          )}

          <div className="space-y-3">
            {painPoints
              .filter((p) => p.id !== editingPainPoint?.id)
              .map((painPoint) => (
                <div
                  key={painPoint.id}
                  className="rounded-lg border border-gray-200/60 bg-white p-4 dark:border-slate-800/60 dark:bg-slate-800/60"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h4 className="text-base font-semibold text-gray-900 dark:text-slate-100">
                          {painPoint.title}
                        </h4>
                        <Badge size="sm" variant="purple">
                          {painPoint.category}
                        </Badge>
                        <Badge
                          size="sm"
                          className={
                            painPoint.intensity === 'alto'
                              ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200'
                              : painPoint.intensity === 'medio'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200'
                              : 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-200'
                          }
                        >
                          {painPoint.intensity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-slate-400">{painPoint.description}</p>
                      {painPoint.frequency && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-slate-500">
                          Frecuencia: {painPoint.frequency}
                        </p>
                      )}
                      {painPoint.impact && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-slate-500">Impacto: {painPoint.impact}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingPainPoint(painPoint)}
                        className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePainPoint(painPoint.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {personas.length > 0 && painPoints.length > 0 && (
        <div className="mt-6 rounded-xl border border-indigo-200/70 bg-indigo-50/50 p-4 dark:border-indigo-500/40 dark:bg-indigo-500/10">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
            <div>
              <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                Personalización automática activa
              </p>
              <p className="mt-1 text-xs text-indigo-700 dark:text-indigo-200">
                El copy y assets de cada etapa del funnel se adaptarán automáticamente según las buyer personas y
                dolores principales definidos. Usa el botón "Adaptar Copy" en cada etapa para generar versiones
                personalizadas.
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

interface PersonaFormProps {
  persona: BuyerPersona;
  existingPersonas: BuyerPersona[];
  onSave: (persona: BuyerPersona) => void;
  onCancel: () => void;
  saving: boolean;
}

function PersonaForm({ persona, existingPersonas, onSave, onCancel, saving }: PersonaFormProps) {
  const [formData, setFormData] = useState<BuyerPersona>(persona);
  const [newGoal, setNewGoal] = useState('');
  const [newMotivation, setNewMotivation] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  const handleSave = () => {
    if (!formData.name || !formData.description) {
      return;
    }
    onSave(formData);
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setFormData({ ...formData, goals: [...formData.goals, newGoal.trim()] });
      setNewGoal('');
    }
  };

  const removeGoal = (index: number) => {
    setFormData({ ...formData, goals: formData.goals.filter((_, i) => i !== index) });
  };

  const addMotivation = () => {
    if (newMotivation.trim()) {
      setFormData({ ...formData, motivations: [...formData.motivations, newMotivation.trim()] });
      setNewMotivation('');
    }
  };

  const removeMotivation = (index: number) => {
    setFormData({ ...formData, motivations: formData.motivations.filter((_, i) => i !== index) });
  };

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setFormData({ ...formData, keywords: [...formData.keywords, newKeyword.trim()] });
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData({ ...formData, keywords: formData.keywords.filter((_, i) => i !== index) });
  };

  return (
    <div className="rounded-lg border border-indigo-200/70 bg-indigo-50/30 p-4 dark:border-indigo-500/40 dark:bg-indigo-500/10">
      <h4 className="mb-4 text-base font-semibold text-gray-900 dark:text-slate-100">
        {persona.id && existingPersonas.find((p) => p.id === persona.id) ? 'Editar' : 'Nueva'} Buyer Persona
      </h4>
      <div className="space-y-4">
        <Input
          label="Nombre de la persona"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Ejecutivo ocupado de 35-45 años"
        />
        <Textarea
          label="Descripción"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          placeholder="Describe a esta buyer persona en detalle..."
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Rango de edad"
            value={formData.demographics.ageRange || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                demographics: { ...formData.demographics, ageRange: e.target.value },
              })
            }
            placeholder="Ej: 35-45 años"
          />
          <Input
            label="Ocupación"
            value={formData.demographics.occupation || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                demographics: { ...formData.demographics, occupation: e.target.value },
              })
            }
            placeholder="Ej: Ejecutivo, Emprendedor..."
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">Objetivos</label>
          <div className="flex gap-2">
            <Input
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addGoal()}
              placeholder="Añadir objetivo..."
            />
            <Button variant="secondary" size="sm" onClick={addGoal}>
              Añadir
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.goals.map((goal, idx) => (
              <Badge key={idx} size="sm" variant="blue" className="cursor-pointer" onClick={() => removeGoal(idx)}>
                {goal} <X className="ml-1 inline h-3 w-3" />
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">Motivaciones</label>
          <div className="flex gap-2">
            <Input
              value={newMotivation}
              onChange={(e) => setNewMotivation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addMotivation()}
              placeholder="Añadir motivación..."
            />
            <Button variant="secondary" size="sm" onClick={addMotivation}>
              Añadir
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.motivations.map((motivation, idx) => (
              <Badge
                key={idx}
                size="sm"
                variant="purple"
                className="cursor-pointer"
                onClick={() => removeMotivation(idx)}
              >
                {motivation} <X className="ml-1 inline h-3 w-3" />
              </Badge>
            ))}
          </div>
        </div>
        <Input
          label="Tono de voz"
          value={formData.toneOfVoice}
          onChange={(e) => setFormData({ ...formData, toneOfVoice: e.target.value })}
          placeholder="Ej: Empático, profesional, motivador..."
        />
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onCancel} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving || !formData.name || !formData.description}>
            <Save className="mr-2 h-4 w-4" />
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
}

interface PainPointFormProps {
  painPoint: PainPoint;
  existingPainPoints: PainPoint[];
  onSave: (painPoint: PainPoint) => void;
  onCancel: () => void;
  saving: boolean;
}

function PainPointForm({ painPoint, existingPainPoints, onSave, onCancel, saving }: PainPointFormProps) {
  const [formData, setFormData] = useState<PainPoint>(painPoint);

  const handleSave = () => {
    if (!formData.title || !formData.description) {
      return;
    }
    onSave(formData);
  };

  return (
    <div className="rounded-lg border border-indigo-200/70 bg-indigo-50/30 p-4 dark:border-indigo-500/40 dark:bg-indigo-500/10">
      <h4 className="mb-4 text-base font-semibold text-gray-900 dark:text-slate-100">
        {painPoint.id && existingPainPoints.find((p) => p.id === painPoint.id) ? 'Editar' : 'Nuevo'} Dolor Principal
      </h4>
      <div className="space-y-4">
        <Input
          label="Título del dolor"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Ej: Falta de tiempo para entrenar"
        />
        <Textarea
          label="Descripción"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          placeholder="Describe el dolor en detalle..."
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">Categoría</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as PainPoint['category'] })}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {painPointCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">Intensidad</label>
            <select
              value={formData.intensity}
              onChange={(e) => setFormData({ ...formData, intensity: e.target.value as PainPoint['intensity'] })}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {intensityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Input
          label="Frecuencia"
          value={formData.frequency}
          onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
          placeholder="Ej: Diario, Semanal, Ocasional..."
        />
        <Input
          label="Impacto"
          value={formData.impact}
          onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
          placeholder="Ej: Afecta su motivación, impide alcanzar objetivos..."
        />
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onCancel} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving || !formData.title || !formData.description}>
            <Save className="mr-2 h-4 w-4" />
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
}

