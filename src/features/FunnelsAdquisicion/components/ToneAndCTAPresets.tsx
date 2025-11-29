import { useState, useEffect, useCallback } from 'react';
import { Bookmark, Plus, Trash2, Save, X, Sparkles, Copy, Type } from 'lucide-react';
import { Button, Card, Input, Select, Textarea, Badge } from '../../../components/componentsreutilizables';
import {
  FavoriteToneConfig,
  FavoriteCTAConfig,
  ToneAndCTAPreset,
  ToneOfVoice,
} from '../types';
import {
  getFavoriteToneConfigs,
  saveFavoriteToneConfig,
  deleteFavoriteToneConfig,
  getFavoriteCTAConfigs,
  saveFavoriteCTAConfig,
  deleteFavoriteCTAConfig,
  getToneAndCTAPresets,
  saveToneAndCTAPreset,
} from '../api';

interface ToneAndCTAPresetsProps {
  onSelectPreset?: (preset: ToneAndCTAPreset) => void;
  onSelectTone?: (tone: FavoriteToneConfig) => void;
  onSelectCTA?: (cta: FavoriteCTAConfig) => void;
}

const toneOptions: { value: ToneOfVoice; label: string }[] = [
  { value: 'motivacional', label: 'Motivacional' },
  { value: 'educativo', label: 'Educativo' },
  { value: 'enérgico', label: 'Enérgico' },
  { value: 'empático', label: 'Empático' },
  { value: 'profesional', label: 'Profesional' },
  { value: 'directo', label: 'Directo' },
  { value: 'inspirador', label: 'Inspirador' },
  { value: 'cercano', label: 'Cercano' },
];

const ctaStyleOptions = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'outline', label: 'Outline' },
  { value: 'ghost', label: 'Ghost' },
];

const contextOptions = [
  { value: 'Landing page', label: 'Landing page' },
  { value: 'Email', label: 'Email' },
  { value: 'WhatsApp', label: 'WhatsApp' },
  { value: 'Redes sociales', label: 'Redes sociales' },
  { value: 'Popup', label: 'Popup' },
];

export function ToneAndCTAPresets({
  onSelectPreset,
  onSelectTone,
  onSelectCTA,
}: ToneAndCTAPresetsProps) {
  const [activeTab, setActiveTab] = useState<'presets' | 'tones' | 'ctas'>('presets');
  const [presets, setPresets] = useState<ToneAndCTAPreset[]>([]);
  const [toneConfigs, setToneConfigs] = useState<FavoriteToneConfig[]>([]);
  const [ctaConfigs, setCTAConfigs] = useState<FavoriteCTAConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTone, setEditingTone] = useState<FavoriteToneConfig | null>(null);
  const [editingCTA, setEditingCTA] = useState<FavoriteCTAConfig | null>(null);
  const [editingPreset, setEditingPreset] = useState<ToneAndCTAPreset | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [presetsData, tonesData, ctasData] = await Promise.all([
        getToneAndCTAPresets(),
        getFavoriteToneConfigs(),
        getFavoriteCTAConfigs(),
      ]);
      setPresets(presetsData);
      setToneConfigs(tonesData);
      setCTAConfigs(ctasData);
    } catch (error) {
      console.error('Error cargando configuraciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTone = async (tone: Omit<FavoriteToneConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
    setSaving(true);
    try {
      const saved = await saveFavoriteToneConfig(tone);
      await loadData();
      setEditingTone(null);
    } catch (error) {
      console.error('Error guardando tono:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTone = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta configuración de tono?')) return;
    try {
      await deleteFavoriteToneConfig(id);
      await loadData();
    } catch (error) {
      console.error('Error eliminando tono:', error);
    }
  };

  const handleSaveCTA = async (cta: Omit<FavoriteCTAConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
    setSaving(true);
    try {
      const saved = await saveFavoriteCTAConfig(cta);
      await loadData();
      setEditingCTA(null);
    } catch (error) {
      console.error('Error guardando CTA:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCTA = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta configuración de CTA?')) return;
    try {
      await deleteFavoriteCTAConfig(id);
      await loadData();
    } catch (error) {
      console.error('Error eliminando CTA:', error);
    }
  };

  const handleSavePreset = async (
    preset: Omit<ToneAndCTAPreset, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    setSaving(true);
    try {
      await saveToneAndCTAPreset(preset);
      await loadData();
      setEditingPreset(null);
    } catch (error) {
      console.error('Error guardando preset:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="border border-gray-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/60">
        <p className="text-sm text-gray-600 dark:text-slate-400">Cargando configuraciones...</p>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/60">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            Configuraciones Favoritas de Tono y CTA
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('presets')}
            className={[
              'rounded-lg px-4 py-2 text-sm font-medium transition-all',
              activeTab === 'presets'
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200'
                : 'text-gray-600 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800',
            ].join(' ')}
          >
            Presets
          </button>
          <button
            onClick={() => setActiveTab('tones')}
            className={[
              'rounded-lg px-4 py-2 text-sm font-medium transition-all',
              activeTab === 'tones'
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200'
                : 'text-gray-600 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800',
            ].join(' ')}
          >
            Tonos
          </button>
          <button
            onClick={() => setActiveTab('ctas')}
            className={[
              'rounded-lg px-4 py-2 text-sm font-medium transition-all',
              activeTab === 'ctas'
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200'
                : 'text-gray-600 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800',
            ].join(' ')}
          >
            CTAs
          </button>
        </div>
      </div>

      {activeTab === 'presets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Guarda combinaciones de tono y CTA para reutilizarlas rápidamente en nuevos funnels.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                setEditingPreset({
                  id: '',
                  name: '',
                  description: '',
                  toneConfig: toneConfigs[0] || ({} as FavoriteToneConfig),
                  ctaConfig: ctaConfigs[0] || ({} as FavoriteCTAConfig),
                  tags: [],
                  createdAt: '',
                  updatedAt: '',
                })
              }
              className="inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nuevo Preset
            </Button>
          </div>

          {editingPreset && (
            <PresetForm
              preset={editingPreset}
              toneConfigs={toneConfigs}
              ctaConfigs={ctaConfigs}
              onSave={handleSavePreset}
              onCancel={() => setEditingPreset(null)}
              saving={saving}
            />
          )}

          <div className="space-y-3">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className="rounded-lg border border-gray-200/60 bg-white p-4 dark:border-slate-800/60 dark:bg-slate-800/60"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-slate-100">
                      {preset.name}
                    </h4>
                    {preset.description && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                        {preset.description}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-slate-300">Tono: </span>
                        <span className="text-gray-600 dark:text-slate-400">{preset.toneConfig.name}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-slate-300">CTA: </span>
                        <span className="text-gray-600 dark:text-slate-400">{preset.ctaConfig.ctaText}</span>
                      </div>
                    </div>
                    {preset.tags && preset.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {preset.tags.map((tag, idx) => (
                          <Badge key={idx} size="sm" variant="blue">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {onSelectPreset && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectPreset(preset)}
                        className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
                      >
                        <Copy className="h-4 w-4" />
                        Usar
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCTA(preset.id)}
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

      {activeTab === 'tones' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Guarda tus configuraciones de tono favoritas para reutilizarlas.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                setEditingTone({
                  id: '',
                  name: '',
                  tone: 'motivacional',
                  description: '',
                  examples: [],
                  createdAt: '',
                  updatedAt: '',
                })
              }
              className="inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nuevo Tono
            </Button>
          </div>

          {editingTone && (
            <ToneForm
              tone={editingTone}
              onSave={handleSaveTone}
              onCancel={() => setEditingTone(null)}
              saving={saving}
            />
          )}

          <div className="space-y-3">
            {toneConfigs.map((tone) => (
              <div
                key={tone.id}
                className="rounded-lg border border-gray-200/60 bg-white p-4 dark:border-slate-800/60 dark:bg-slate-800/60"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Type className="h-4 w-4 text-indigo-500" />
                      <h4 className="text-base font-semibold text-gray-900 dark:text-slate-100">
                        {tone.name}
                      </h4>
                      <Badge size="sm" variant="purple">
                        {tone.tone}
                      </Badge>
                    </div>
                    {tone.description && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">{tone.description}</p>
                    )}
                    {tone.examples && tone.examples.length > 0 && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium text-gray-700 dark:text-slate-300">Ejemplos: </span>
                        <span className="text-gray-600 dark:text-slate-400">
                          {tone.examples.slice(0, 2).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {onSelectTone && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectTone(tone)}
                        className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
                      >
                        <Copy className="h-4 w-4" />
                        Usar
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTone(tone.id)}
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

      {activeTab === 'ctas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Guarda tus CTAs favoritos para reutilizarlos en diferentes contextos.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                setEditingCTA({
                  id: '',
                  name: '',
                  ctaText: '',
                  ctaStyle: 'primary',
                  context: 'Landing page',
                  description: '',
                  createdAt: '',
                  updatedAt: '',
                })
              }
              className="inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nuevo CTA
            </Button>
          </div>

          {editingCTA && (
            <CTAForm
              cta={editingCTA}
              onSave={handleSaveCTA}
              onCancel={() => setEditingCTA(null)}
              saving={saving}
            />
          )}

          <div className="space-y-3">
            {ctaConfigs.map((cta) => (
              <div
                key={cta.id}
                className="rounded-lg border border-gray-200/60 bg-white p-4 dark:border-slate-800/60 dark:bg-slate-800/60"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-indigo-500" />
                      <h4 className="text-base font-semibold text-gray-900 dark:text-slate-100">
                        {cta.name}
                      </h4>
                      {cta.context && (
                        <Badge size="sm" variant="blue">
                          {cta.context}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-2 text-lg font-medium text-indigo-600 dark:text-indigo-300">
                      {cta.ctaText}
                    </p>
                    {cta.description && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">{cta.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {onSelectCTA && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectCTA(cta)}
                        className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
                      >
                        <Copy className="h-4 w-4" />
                        Usar
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCTA(cta.id)}
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
    </Card>
  );
}

interface ToneFormProps {
  tone: FavoriteToneConfig;
  onSave: (tone: Omit<FavoriteToneConfig, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  saving: boolean;
}

function ToneForm({ tone, onSave, onCancel, saving }: ToneFormProps) {
  const [formData, setFormData] = useState(tone);
  const [newExample, setNewExample] = useState('');

  const handleSave = () => {
    if (!formData.name || !formData.tone) return;
    onSave({
      name: formData.name,
      tone: formData.tone,
      description: formData.description,
      examples: formData.examples || [],
    });
  };

  const addExample = () => {
    if (newExample.trim()) {
      setFormData({
        ...formData,
        examples: [...(formData.examples || []), newExample.trim()],
      });
      setNewExample('');
    }
  };

  const removeExample = (index: number) => {
    setFormData({
      ...formData,
      examples: formData.examples?.filter((_, i) => i !== index) || [],
    });
  };

  return (
    <div className="rounded-lg border border-indigo-200/70 bg-indigo-50/30 p-4 dark:border-indigo-500/40 dark:bg-indigo-500/10">
      <h4 className="mb-4 text-base font-semibold text-gray-900 dark:text-slate-100">
        {tone.id ? 'Editar' : 'Nueva'} Configuración de Tono
      </h4>
      <div className="space-y-4">
        <Input
          label="Nombre"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Tono Motivacional"
        />
        <Select
          label="Tono"
          options={toneOptions}
          value={formData.tone}
          onChange={(e) => setFormData({ ...formData, tone: e.target.value as ToneOfVoice })}
        />
        <Textarea
          label="Descripción"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
          placeholder="Describe cuándo usar este tono..."
        />
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
            Ejemplos
          </label>
          <div className="flex gap-2">
            <Input
              value={newExample}
              onChange={(e) => setNewExample(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addExample()}
              placeholder="Añadir ejemplo..."
            />
            <Button variant="secondary" size="sm" onClick={addExample}>
              Añadir
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.examples?.map((example, idx) => (
              <Badge key={idx} size="sm" variant="blue" className="cursor-pointer" onClick={() => removeExample(idx)}>
                {example} <X className="ml-1 inline h-3 w-3" />
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onCancel} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving || !formData.name || !formData.tone}>
            <Save className="mr-2 h-4 w-4" />
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
}

interface CTAFormProps {
  cta: FavoriteCTAConfig;
  onSave: (cta: Omit<FavoriteCTAConfig, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  saving: boolean;
}

function CTAForm({ cta, onSave, onCancel, saving }: CTAFormProps) {
  const [formData, setFormData] = useState(cta);

  const handleSave = () => {
    if (!formData.name || !formData.ctaText) return;
    onSave({
      name: formData.name,
      ctaText: formData.ctaText,
      ctaStyle: formData.ctaStyle,
      context: formData.context,
      description: formData.description,
    });
  };

  return (
    <div className="rounded-lg border border-indigo-200/70 bg-indigo-50/30 p-4 dark:border-indigo-500/40 dark:bg-indigo-500/10">
      <h4 className="mb-4 text-base font-semibold text-gray-900 dark:text-slate-100">
        {cta.id ? 'Editar' : 'Nuevo'} CTA
      </h4>
      <div className="space-y-4">
        <Input
          label="Nombre"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: CTA Reto 7 Días"
        />
        <Input
          label="Texto del CTA"
          value={formData.ctaText}
          onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
          placeholder="Ej: ¡Únete gratis al reto!"
        />
        <Select
          label="Estilo"
          options={ctaStyleOptions}
          value={formData.ctaStyle || 'primary'}
          onChange={(e) => setFormData({ ...formData, ctaStyle: e.target.value as any })}
        />
        <Select
          label="Contexto"
          options={contextOptions}
          value={formData.context || 'Landing page'}
          onChange={(e) => setFormData({ ...formData, context: e.target.value })}
        />
        <Textarea
          label="Descripción"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
          placeholder="Describe cuándo usar este CTA..."
        />
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onCancel} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving || !formData.name || !formData.ctaText}>
            <Save className="mr-2 h-4 w-4" />
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
}

interface PresetFormProps {
  preset: ToneAndCTAPreset;
  toneConfigs: FavoriteToneConfig[];
  ctaConfigs: FavoriteCTAConfig[];
  onSave: (preset: Omit<ToneAndCTAPreset, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  saving: boolean;
}

function PresetForm({ preset, toneConfigs, ctaConfigs, onSave, onCancel, saving }: PresetFormProps) {
  const [formData, setFormData] = useState(preset);
  const [newTag, setNewTag] = useState('');

  const handleSave = () => {
    if (!formData.name || !formData.toneConfig.id || !formData.ctaConfig.id) return;
    onSave({
      name: formData.name,
      description: formData.description,
      toneConfig: formData.toneConfig,
      ctaConfig: formData.ctaConfig,
      tags: formData.tags || [],
    });
  };

  const addTag = () => {
    if (newTag.trim()) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), newTag.trim()],
      });
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((_, i) => i !== index) || [],
    });
  };

  return (
    <div className="rounded-lg border border-indigo-200/70 bg-indigo-50/30 p-4 dark:border-indigo-500/40 dark:bg-indigo-500/10">
      <h4 className="mb-4 text-base font-semibold text-gray-900 dark:text-slate-100">
        {preset.id ? 'Editar' : 'Nuevo'} Preset
      </h4>
      <div className="space-y-4">
        <Input
          label="Nombre del preset"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Reto 7 Días"
        />
        <Textarea
          label="Descripción"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
          placeholder="Describe cuándo usar este preset..."
        />
        <Select
          label="Tono"
          options={toneConfigs.map((t) => ({ value: t.id, label: t.name }))}
          value={formData.toneConfig.id}
          onChange={(e) => {
            const selected = toneConfigs.find((t) => t.id === e.target.value);
            if (selected) setFormData({ ...formData, toneConfig: selected });
          }}
        />
        <Select
          label="CTA"
          options={ctaConfigs.map((c) => ({ value: c.id, label: c.name }))}
          value={formData.ctaConfig.id}
          onChange={(e) => {
            const selected = ctaConfigs.find((c) => c.id === e.target.value);
            if (selected) setFormData({ ...formData, ctaConfig: selected });
          }}
        />
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">Tags</label>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              placeholder="Añadir tag..."
            />
            <Button variant="secondary" size="sm" onClick={addTag}>
              Añadir
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags?.map((tag, idx) => (
              <Badge key={idx} size="sm" variant="blue" className="cursor-pointer" onClick={() => removeTag(idx)}>
                {tag} <X className="ml-1 inline h-3 w-3" />
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onCancel} disabled={saving}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving || !formData.name || !formData.toneConfig.id || !formData.ctaConfig.id}
          >
            <Save className="mr-2 h-4 w-4" />
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
}

