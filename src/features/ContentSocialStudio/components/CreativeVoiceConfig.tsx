import { useState, useEffect } from 'react';
import { Save, Mic, CheckCircle2, X, Plus, Trash2 } from 'lucide-react';
import { Button, Card, Input, Select, Textarea, Badge } from '../../../components/componentsreutilizables';
import type { CreativeVoiceConfig, CreativeTone, ThematicPillar } from '../types';
import {
  getCreativeVoiceConfig,
  saveCreativeVoiceConfig,
  getAvailableCreativeTones,
  getSuggestedThematicPillars,
} from '../api/creativeVoice';

interface CreativeVoiceConfigProps {
  loading?: boolean;
}

export function CreativeVoiceConfig({ loading: externalLoading }: CreativeVoiceConfigProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState<Partial<CreativeVoiceConfig>>({
    tone: 'motivacional',
    forbiddenWords: [],
    thematicPillars: [],
  });

  const [customForbiddenWord, setCustomForbiddenWord] = useState('');
  const [newPillar, setNewPillar] = useState<Partial<ThematicPillar>>({
    name: '',
    description: '',
    keywords: [],
    priority: 'medium',
  });
  const [newKeyword, setNewKeyword] = useState('');

  const tones = getAvailableCreativeTones();
  const suggestedPillars = getSuggestedThematicPillars();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const savedConfig = await getCreativeVoiceConfig();
      if (savedConfig) {
        setConfig(savedConfig);
      }
    } catch (error) {
      console.error('Error loading creative voice config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config.tone) {
      alert('Por favor, selecciona un tono');
      return;
    }

    setSaving(true);
    try {
      await saveCreativeVoiceConfig({
        tone: config.tone as CreativeTone,
        customToneDescription: config.customToneDescription,
        forbiddenWords: config.forbiddenWords || [],
        thematicPillars: config.thematicPillars || [],
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving creative voice config:', error);
      alert('Error al guardar la configuración. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  const addForbiddenWord = () => {
    if (customForbiddenWord.trim() && !config.forbiddenWords?.includes(customForbiddenWord.trim())) {
      setConfig({
        ...config,
        forbiddenWords: [...(config.forbiddenWords || []), customForbiddenWord.trim()],
      });
      setCustomForbiddenWord('');
    }
  };

  const removeForbiddenWord = (word: string) => {
    setConfig({
      ...config,
      forbiddenWords: config.forbiddenWords?.filter((w) => w !== word) || [],
    });
  };

  const addSuggestedPillar = (pillar: Omit<ThematicPillar, 'id'>) => {
    const newPillarWithId: ThematicPillar = {
      ...pillar,
      id: `pillar-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setConfig({
      ...config,
      thematicPillars: [...(config.thematicPillars || []), newPillarWithId],
    });
  };

  const addCustomPillar = () => {
    if (newPillar.name?.trim() && newPillar.description?.trim()) {
      const pillarWithId: ThematicPillar = {
        ...newPillar,
        id: `pillar-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: newPillar.name.trim(),
        description: newPillar.description.trim(),
        keywords: newPillar.keywords || [],
        priority: newPillar.priority || 'medium',
      } as ThematicPillar;

      setConfig({
        ...config,
        thematicPillars: [...(config.thematicPillars || []), pillarWithId],
      });
      setNewPillar({ name: '', description: '', keywords: [], priority: 'medium' });
    }
  };

  const removePillar = (pillarId: string) => {
    setConfig({
      ...config,
      thematicPillars: config.thematicPillars?.filter((p) => p.id !== pillarId) || [],
    });
  };

  const addKeywordToPillar = (pillarId: string) => {
    if (newKeyword.trim()) {
      setConfig({
        ...config,
        thematicPillars: config.thematicPillars?.map((p) =>
          p.id === pillarId
            ? { ...p, keywords: [...(p.keywords || []), newKeyword.trim()] }
            : p
        ) || [],
      });
      setNewKeyword('');
    }
  };

  const removeKeywordFromPillar = (pillarId: string, keyword: string) => {
    setConfig({
      ...config,
      thematicPillars: config.thematicPillars?.map((p) =>
        p.id === pillarId
          ? { ...p, keywords: p.keywords?.filter((k) => k !== keyword) || [] }
          : p
      ) || [],
    });
  };

  const updatePillar = (pillarId: string, updates: Partial<ThematicPillar>) => {
    setConfig({
      ...config,
      thematicPillars: config.thematicPillars?.map((p) =>
        p.id === pillarId ? { ...p, ...updates } : p
      ) || [],
    });
  };

  if (externalLoading || loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-slate-200 rounded" />
          <div className="h-24 bg-slate-100 rounded-2xl" />
          <div className="h-24 bg-slate-100 rounded-2xl" />
        </div>
      </Card>
    );
  }

  const selectedTone = tones.find((t) => t.value === config.tone);

  return (
    <Card className="p-0 shadow-sm border border-slate-100">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Mic className="w-5 h-5 text-indigo-500" />
            Configuración de Voz Creativa
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Define tu tono, palabras prohibidas y pilares temáticos para que todos los contenidos IA hablen como tú
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          disabled={saving}
          leftIcon={saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        >
          {saved ? 'Guardado' : saving ? 'Guardando...' : 'Guardar configuración'}
        </Button>
      </div>

      <div className="p-6 space-y-6">
        {/* Tono */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Tono de Voz *
          </label>
          <p className="text-xs text-slate-500 mb-3">
            Selecciona el tono que mejor representa cómo quieres que la IA genere contenido
          </p>
          <Select
            options={tones.map((t) => ({ value: t.value, label: `${t.label} - ${t.description}` }))}
            value={config.tone || ''}
            onChange={(e) => setConfig({ ...config, tone: e.target.value as CreativeTone })}
            placeholder="Selecciona un tono de voz"
          />
          {selectedTone && (
            <p className="text-xs text-slate-600 mt-2 italic">{selectedTone.description}</p>
          )}
        </div>

        {/* Descripción personalizada del tono */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Descripción Personalizada del Tono (Opcional)
          </label>
          <p className="text-xs text-slate-500 mb-3">
            Describe tu tono de voz de forma más específica si lo deseas
          </p>
          <Textarea
            placeholder="Ej: Motivacional pero sin exagerar, técnico pero accesible, cercano y profesional..."
            value={config.customToneDescription || ''}
            onChange={(e) => setConfig({ ...config, customToneDescription: e.target.value })}
            rows={3}
          />
        </div>

        {/* Palabras prohibidas */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Palabras Prohibidas
          </label>
          <p className="text-xs text-slate-500 mb-3">
            Agrega palabras o frases que nunca quieres que la IA use en tus contenidos
          </p>
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Ej: milagro, fácil, rápido..."
              value={customForbiddenWord}
              onChange={(e) => setCustomForbiddenWord(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addForbiddenWord();
                }
              }}
            />
            <Button variant="secondary" size="sm" onClick={addForbiddenWord}>
              Agregar
            </Button>
          </div>
          {config.forbiddenWords && config.forbiddenWords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {config.forbiddenWords.map((word, index) => (
                <Badge
                  key={index}
                  variant="red"
                  size="md"
                  className="flex items-center gap-2"
                >
                  {word}
                  <button
                    type="button"
                    onClick={() => removeForbiddenWord(word)}
                    className="ml-1 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Pilares temáticos */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Pilares Temáticos
          </label>
          <p className="text-xs text-slate-500 mb-3">
            Define los temas principales sobre los que quieres que la IA genere contenido
          </p>

          {/* Pilares sugeridos */}
          {suggestedPillars.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-slate-600 mb-2">Pilares sugeridos:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPillars.map((pillar, index) => {
                  const isAdded = config.thematicPillars?.some((p) => p.name === pillar.name);
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => !isAdded && addSuggestedPillar(pillar)}
                      disabled={isAdded}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isAdded
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                      }`}
                    >
                      {isAdded ? '✓ ' : '+ '}
                      {pillar.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Crear pilar personalizado */}
          <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-medium text-slate-700 mb-3">Crear pilar personalizado:</p>
            <div className="space-y-3">
              <Input
                placeholder="Nombre del pilar (ej: Transformación Personal)"
                value={newPillar.name || ''}
                onChange={(e) => setNewPillar({ ...newPillar, name: e.target.value })}
              />
              <Textarea
                placeholder="Descripción del pilar"
                value={newPillar.description || ''}
                onChange={(e) => setNewPillar({ ...newPillar, description: e.target.value })}
                rows={2}
              />
              <div className="flex gap-2">
                <Select
                  options={[
                    { value: 'high', label: 'Alta prioridad' },
                    { value: 'medium', label: 'Media prioridad' },
                    { value: 'low', label: 'Baja prioridad' },
                  ]}
                  value={newPillar.priority || 'medium'}
                  onChange={(e) => setNewPillar({ ...newPillar, priority: e.target.value as 'high' | 'medium' | 'low' })}
                />
                <Button variant="secondary" size="sm" onClick={addCustomPillar}>
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar Pilar
                </Button>
              </div>
            </div>
          </div>

          {/* Lista de pilares configurados */}
          {config.thematicPillars && config.thematicPillars.length > 0 && (
            <div className="space-y-3">
              {config.thematicPillars.map((pillar) => (
                <div key={pillar.id} className="p-4 bg-white rounded-lg border border-slate-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-900">{pillar.name}</h4>
                        <Badge
                          variant={pillar.priority === 'high' ? 'red' : pillar.priority === 'medium' ? 'blue' : 'gray'}
                          size="sm"
                        >
                          {pillar.priority === 'high' ? 'Alta' : pillar.priority === 'medium' ? 'Media' : 'Baja'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{pillar.description}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {pillar.keywords?.map((keyword, idx) => (
                          <Badge key={idx} variant="purple" size="sm" className="flex items-center gap-1">
                            {keyword}
                            <button
                              type="button"
                              onClick={() => removeKeywordFromPillar(pillar.id, keyword)}
                              className="hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Agregar keyword"
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addKeywordToPillar(pillar.id);
                            }
                          }}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addKeywordToPillar(pillar.id)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePillar(pillar.id)}
                      className="ml-2 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

