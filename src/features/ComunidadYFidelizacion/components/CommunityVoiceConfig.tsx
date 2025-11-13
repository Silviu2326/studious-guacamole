import { useState, useEffect } from 'react';
import { Settings, Plus, Trash2, Save, Sparkles, Heart, MessageSquare } from 'lucide-react';
import { Card, Button, Input, Textarea, Select, Badge, Modal } from '../../../components/componentsreutilizables';
import { CommunityVoiceConfig, CommunityRitual, RecognitionStyle, CommunityRitualType } from '../types';
import { CommunityFidelizacionService } from '../services/communityFidelizacionService';
import { useAuth } from '../../../context/AuthContext';

interface CommunityVoiceConfigProps {
  loading?: boolean;
}

const RECOGNITION_STYLES: { value: RecognitionStyle; label: string }[] = [
  { value: 'formal', label: 'Formal' },
  { value: 'cercano', label: 'Cercano' },
  { value: 'motivacional', label: 'Motivacional' },
  { value: 'celebratorio', label: 'Celebratorio' },
  { value: 'personalizado', label: 'Personalizado' },
];

const RITUAL_TYPES: { value: CommunityRitualType; label: string }[] = [
  { value: 'bienvenida', label: 'Bienvenida' },
  { value: 'hito', label: 'Hito/Logro' },
  { value: 'reconocimiento', label: 'Reconocimiento' },
  { value: 'despedida', label: 'Despedida' },
  { value: 'personalizado', label: 'Personalizado' },
];

const COMMON_EMOJIS = ['💪', '🔥', '✨', '🎯', '🏆', '🌟', '💯', '🚀', '❤️', '🙌', '👏', '🎉'];

export function CommunityVoiceConfig({ loading: externalLoading }: CommunityVoiceConfigProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState<Partial<CommunityVoiceConfig>>({
    values: [],
    tone: '',
    recognitionStyle: 'motivacional',
    preferredEmojis: [],
    keywords: [],
    rituals: [],
  });
  const [isRitualModalOpen, setIsRitualModalOpen] = useState(false);
  const [editingRitual, setEditingRitual] = useState<CommunityRitual | null>(null);
  const [newValue, setNewValue] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newEmoji, setNewEmoji] = useState('');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const savedConfig = await CommunityFidelizacionService.getCommunityVoiceConfig(user?.id);
      if (savedConfig) {
        setConfig(savedConfig);
      }
    } catch (error) {
      console.error('Error cargando configuración de voz de comunidad:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await CommunityFidelizacionService.saveCommunityVoiceConfig(config);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error guardando configuración:', error);
      alert('Error al guardar la configuración. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  const addValue = () => {
    if (newValue.trim()) {
      setConfig({
        ...config,
        values: [...(config.values || []), newValue.trim()],
      });
      setNewValue('');
    }
  };

  const removeValue = (index: number) => {
    setConfig({
      ...config,
      values: config.values?.filter((_, i) => i !== index) || [],
    });
  };

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setConfig({
        ...config,
        keywords: [...(config.keywords || []), newKeyword.trim()],
      });
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setConfig({
      ...config,
      keywords: config.keywords?.filter((_, i) => i !== index) || [],
    });
  };

  const addEmoji = (emoji: string) => {
    if (!config.preferredEmojis?.includes(emoji)) {
      setConfig({
        ...config,
        preferredEmojis: [...(config.preferredEmojis || []), emoji],
      });
    }
  };

  const removeEmoji = (emoji: string) => {
    setConfig({
      ...config,
      preferredEmojis: config.preferredEmojis?.filter((e) => e !== emoji) || [],
    });
  };

  const openRitualModal = (ritual?: CommunityRitual) => {
    setEditingRitual(ritual || null);
    setIsRitualModalOpen(true);
  };

  const closeRitualModal = () => {
    setIsRitualModalOpen(false);
    setEditingRitual(null);
  };

  const saveRitual = (ritualData: Omit<CommunityRitual, 'id'>) => {
    if (editingRitual) {
      // Actualizar ritual existente
      setConfig({
        ...config,
        rituals: config.rituals?.map((r) => (r.id === editingRitual.id ? { ...editingRitual, ...ritualData } : r)) || [],
      });
    } else {
      // Agregar nuevo ritual
      const newRitual: CommunityRitual = {
        ...ritualData,
        id: `ritual_${Date.now()}`,
      };
      setConfig({
        ...config,
        rituals: [...(config.rituals || []), newRitual],
      });
    }
    closeRitualModal();
  };

  const deleteRitual = (ritualId: string) => {
    if (confirm('¿Estás seguro de eliminar este ritual?')) {
      setConfig({
        ...config,
        rituals: config.rituals?.filter((r) => r.id !== ritualId) || [],
      });
    }
  };

  if (externalLoading || loading) {
    return (
      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="p-6">
          <div className="h-8 w-48 bg-slate-200/70 dark:bg-slate-700/60 rounded-md animate-pulse mb-4" />
          <div className="h-32 bg-slate-200/70 dark:bg-slate-700/60 rounded-md animate-pulse" />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-indigo-900/40 dark:to-purple-900/30 rounded-xl">
              <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Voz de Comunidad</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Configura tus valores, rituales y tono para que las comunicaciones reflejen tu estilo auténtico
              </p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            leftIcon={saving ? undefined : <Save className="w-4 h-4" />}
            className={saved ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar configuración'}
          </Button>
        </div>

        <div className="space-y-8">
          {/* Valores de la comunidad */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">Valores de la Comunidad</h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Define los valores que quieres que reflejen tus comunicaciones y retos
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {config.values?.map((value, index) => (
                <Badge key={index} variant="blue" size="md" className="flex items-center gap-2">
                  {value}
                  <button
                    onClick={() => removeValue(index)}
                    className="hover:text-red-500 transition-colors"
                    aria-label={`Eliminar ${value}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Ej: Disciplina, Apoyo mutuo..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addValue();
                  }
                }}
                className="flex-1"
              />
              <Button variant="secondary" onClick={addValue} leftIcon={<Plus className="w-4 h-4" />}>
                Agregar
              </Button>
            </div>
          </section>

          {/* Tono y estilo */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">Tono y Estilo</h4>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Descripción del tono
                </label>
                <Textarea
                  value={config.tone || ''}
                  onChange={(e) => setConfig({ ...config, tone: e.target.value })}
                  placeholder="Ej: Motivacional pero cercano, con un toque de celebración en los logros"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Estilo de reconocimiento
                </label>
                <Select
                  value={config.recognitionStyle || 'motivacional'}
                  onChange={(value) => setConfig({ ...config, recognitionStyle: value as RecognitionStyle })}
                  options={RECOGNITION_STYLES}
                />
                {config.recognitionStyle === 'personalizado' && (
                  <Input
                    value={config.customRecognitionStyle || ''}
                    onChange={(e) => setConfig({ ...config, customRecognitionStyle: e.target.value })}
                    placeholder="Describe tu estilo personalizado"
                    className="mt-2"
                  />
                )}
              </div>
            </div>
          </section>

          {/* Emojis preferidos */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">Emojis Preferidos</h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Selecciona los emojis que quieres usar frecuentemente en tus comunicaciones
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {config.preferredEmojis?.map((emoji) => (
                <Badge key={emoji} variant="blue" size="md" className="flex items-center gap-2 text-lg">
                  {emoji}
                  <button
                    onClick={() => removeEmoji(emoji)}
                    className="hover:text-red-500 transition-colors"
                    aria-label={`Eliminar ${emoji}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {COMMON_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => addEmoji(emoji)}
                  disabled={config.preferredEmojis?.includes(emoji)}
                  className={`p-2 rounded-lg text-2xl transition-all ${
                    config.preferredEmojis?.includes(emoji)
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                  }`}
                  aria-label={`Agregar ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </section>

          {/* Palabras clave */}
          <section>
            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">Palabras Clave</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Palabras que definen tu estilo y que quieres que aparezcan en tus comunicaciones
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {config.keywords?.map((keyword, index) => (
                <Badge key={index} variant="secondary" size="md" className="flex items-center gap-2">
                  {keyword}
                  <button
                    onClick={() => removeKeyword(index)}
                    className="hover:text-red-500 transition-colors"
                    aria-label={`Eliminar ${keyword}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Ej: transformación, progreso, comunidad..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addKeyword();
                  }
                }}
                className="flex-1"
              />
              <Button variant="secondary" onClick={addKeyword} leftIcon={<Plus className="w-4 h-4" />}>
                Agregar
              </Button>
            </div>
          </section>

          {/* Rituales */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">Rituales de Comunidad</h4>
              <Button variant="secondary" size="sm" onClick={() => openRitualModal()} leftIcon={<Plus className="w-4 h-4" />}>
                Agregar ritual
              </Button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Define rituales que se activan automáticamente en momentos clave (bienvenida, logros, etc.)
            </p>
            <div className="space-y-3">
              {config.rituals?.map((ritual) => (
                <div
                  key={ritual.id}
                  className="p-4 rounded-lg border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="blue" size="sm">
                          {RITUAL_TYPES.find((t) => t.value === ritual.type)?.label}
                        </Badge>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{ritual.name}</span>
                        {ritual.isActive ? (
                          <Badge variant="green" size="sm">
                            Activo
                          </Badge>
                        ) : (
                          <Badge variant="secondary" size="sm">
                            Inactivo
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{ritual.description}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                        <strong>Trigger:</strong> {ritual.trigger}
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-200 italic">"{ritual.message}"</p>
                      {ritual.emojis && ritual.emojis.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {ritual.emojis.map((emoji, idx) => (
                            <span key={idx} className="text-lg">
                              {emoji}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openRitualModal(ritual)}>
                        Editar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteRitual(ritual.id)} className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {(!config.rituals || config.rituals.length === 0) && (
                <p className="text-sm text-slate-500 dark:text-slate-400 italic text-center py-4">
                  No hay rituales configurados. Agrega uno para empezar.
                </p>
              )}
            </div>
          </section>
        </div>
      </Card>

      <RitualModal
        isOpen={isRitualModalOpen}
        onClose={closeRitualModal}
        onSave={saveRitual}
        ritual={editingRitual}
      />
    </>
  );
}

interface RitualModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ritual: Omit<CommunityRitual, 'id'>) => void;
  ritual?: CommunityRitual | null;
}

function RitualModal({ isOpen, onClose, onSave, ritual }: RitualModalProps) {
  const [formData, setFormData] = useState<Omit<CommunityRitual, 'id'>>({
    type: 'bienvenida',
    name: '',
    description: '',
    trigger: '',
    message: '',
    emojis: [],
    isActive: true,
  });
  const [newEmoji, setNewEmoji] = useState('');

  useEffect(() => {
    if (ritual) {
      setFormData({
        type: ritual.type,
        name: ritual.name,
        description: ritual.description,
        trigger: ritual.trigger,
        message: ritual.message,
        emojis: ritual.emojis || [],
        isActive: ritual.isActive,
      });
    } else {
      setFormData({
        type: 'bienvenida',
        name: '',
        description: '',
        trigger: '',
        message: '',
        emojis: [],
        isActive: true,
      });
    }
  }, [ritual, isOpen]);

  const handleSave = () => {
    if (!formData.name || !formData.trigger || !formData.message) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
    onSave(formData);
  };

  const addEmoji = () => {
    if (newEmoji.trim() && !formData.emojis?.includes(newEmoji.trim())) {
      setFormData({
        ...formData,
        emojis: [...(formData.emojis || []), newEmoji.trim()],
      });
      setNewEmoji('');
    }
  };

  const removeEmoji = (emoji: string) => {
    setFormData({
      ...formData,
      emojis: formData.emojis?.filter((e) => e !== emoji) || [],
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={ritual ? 'Editar Ritual' : 'Nuevo Ritual'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar ritual</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tipo de ritual</label>
          <Select
            value={formData.type}
            onChange={(value) => setFormData({ ...formData, type: value as CommunityRitualType })}
            options={RITUAL_TYPES}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nombre *</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Bienvenida a nuevos miembros"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Descripción</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe cuándo y cómo se usa este ritual"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Trigger (Cuándo se activa) *</label>
          <Input
            value={formData.trigger}
            onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
            placeholder="Ej: Primera sesión completada"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Mensaje *</label>
          <Textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Mensaje que se enviará cuando se active el ritual"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Emojis</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.emojis?.map((emoji, idx) => (
              <Badge key={idx} variant="blue" size="md" className="flex items-center gap-2 text-lg">
                {emoji}
                <button
                  onClick={() => removeEmoji(emoji)}
                  className="hover:text-red-500 transition-colors"
                  aria-label={`Eliminar ${emoji}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newEmoji}
              onChange={(e) => setNewEmoji(e.target.value)}
              placeholder="Agregar emoji"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addEmoji();
                }
              }}
              className="flex-1"
            />
            <Button variant="secondary" size="sm" onClick={addEmoji} leftIcon={<Plus className="w-4 h-4" />}>
              Agregar
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Ritual activo
          </label>
        </div>
      </div>
    </Modal>
  );
}

