import { useState, useEffect } from 'react';
import { Save, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button, Card, Input, Select, Textarea, Badge } from '../../../components/componentsreutilizables';
import type { BrandProfileConfig, Specialization, ToneOfVoice } from '../types';
import {
  getBrandProfileConfig,
  saveBrandProfileConfig,
  getAvailableSpecializations,
  getAvailableTones,
} from '../api/brandProfile';

interface BrandProfileConfigProps {
  loading?: boolean;
}

export function BrandProfileConfig({ loading: externalLoading }: BrandProfileConfigProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState<Partial<BrandProfileConfig>>({
    specializations: [],
    toneOfVoice: 'motivacional',
    values: [],
    targetAudience: '',
    keywords: [],
  });

  const [customValue, setCustomValue] = useState('');
  const [customKeyword, setCustomKeyword] = useState('');

  const specializations = getAvailableSpecializations();
  const tones = getAvailableTones();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const savedConfig = await getBrandProfileConfig();
      if (savedConfig) {
        setConfig(savedConfig);
      }
    } catch (error) {
      console.error('Error loading brand profile config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config.specializations || config.specializations.length === 0) {
      alert('Por favor, selecciona al menos una especialización');
      return;
    }

    if (!config.toneOfVoice) {
      alert('Por favor, selecciona un tono de voz');
      return;
    }

    setSaving(true);
    try {
      await saveBrandProfileConfig({
        specializations: config.specializations as Specialization[],
        toneOfVoice: config.toneOfVoice as ToneOfVoice,
        customTone: config.customTone,
        values: config.values || [],
        targetAudience: config.targetAudience,
        keywords: config.keywords || [],
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving brand profile config:', error);
      alert('Error al guardar la configuración. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  const toggleSpecialization = (spec: Specialization) => {
    const current = config.specializations || [];
    if (current.includes(spec)) {
      setConfig({ ...config, specializations: current.filter((s) => s !== spec) });
    } else {
      setConfig({ ...config, specializations: [...current, spec] });
    }
  };

  const addValue = () => {
    if (customValue.trim()) {
      setConfig({
        ...config,
        values: [...(config.values || []), customValue.trim()],
      });
      setCustomValue('');
    }
  };

  const removeValue = (index: number) => {
    const newValues = [...(config.values || [])];
    newValues.splice(index, 1);
    setConfig({ ...config, values: newValues });
  };

  const addKeyword = () => {
    if (customKeyword.trim()) {
      setConfig({
        ...config,
        keywords: [...(config.keywords || []), customKeyword.trim()],
      });
      setCustomKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    const newKeywords = [...(config.keywords || [])];
    newKeywords.splice(index, 1);
    setConfig({ ...config, keywords: newKeywords });
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

  const selectedTone = tones.find((t) => t.value === config.toneOfVoice);

  return (
    <Card className="p-0 shadow-sm border border-slate-100">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-500" />
            Configuración de Perfil de Marca Personal
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Define tu especialización, tono y valores para que la IA genere copy que suene como tú
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
        {/* Especializaciones */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Especializaciones *
          </label>
          <p className="text-xs text-slate-500 mb-3">
            Selecciona todas las áreas en las que te especializas
          </p>
          <div className="flex flex-wrap gap-2">
            {specializations.map((spec) => {
              const isSelected = config.specializations?.includes(spec.value);
              return (
                <button
                  key={spec.value}
                  type="button"
                  onClick={() => toggleSpecialization(spec.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {spec.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tono de voz */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Tono de Voz *
          </label>
          <p className="text-xs text-slate-500 mb-3">
            Selecciona el tono que mejor representa tu estilo de comunicación
          </p>
          <Select
            options={tones.map((t) => ({ value: t.value, label: `${t.label} - ${t.description}` }))}
            value={config.toneOfVoice || ''}
            onChange={(e) => setConfig({ ...config, toneOfVoice: e.target.value as ToneOfVoice })}
            placeholder="Selecciona un tono de voz"
          />
          {selectedTone && (
            <p className="text-xs text-slate-600 mt-2 italic">{selectedTone.description}</p>
          )}
        </div>

        {/* Tono personalizado */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Tono Personalizado (Opcional)
          </label>
          <p className="text-xs text-slate-500 mb-3">
            Describe tu tono de voz de forma más específica si lo deseas
          </p>
          <Textarea
            placeholder="Ej: Motivacional pero sin exagerar, técnico pero accesible, cercano y profesional..."
            value={config.customTone || ''}
            onChange={(e) => setConfig({ ...config, customTone: e.target.value })}
            rows={3}
          />
        </div>

        {/* Valores */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Valores de tu Marca
          </label>
          <p className="text-xs text-slate-500 mb-3">
            Define los valores clave que quieres transmitir en tu contenido
          </p>
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Ej: Constancia, Progreso, Bienestar..."
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addValue();
                }
              }}
            />
            <Button variant="secondary" size="sm" onClick={addValue}>
              Agregar
            </Button>
          </div>
          {config.values && config.values.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {config.values.map((value, index) => (
                <Badge
                  key={index}
                  variant="blue"
                  size="md"
                  className="flex items-center gap-2"
                >
                  {value}
                  <button
                    type="button"
                    onClick={() => removeValue(index)}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Audiencia objetivo */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Audiencia Objetivo (Opcional)
          </label>
          <p className="text-xs text-slate-500 mb-3">
            Describe tu cliente ideal para personalizar mejor el contenido
          </p>
          <Input
            placeholder="Ej: Mujeres de 30-45 años que quieren recuperar su forma física después del embarazo"
            value={config.targetAudience || ''}
            onChange={(e) => setConfig({ ...config, targetAudience: e.target.value })}
          />
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Palabras Clave / Hashtags (Opcional)
          </label>
          <p className="text-xs text-slate-500 mb-3">
            Agrega palabras clave o hashtags que quieras que la IA use frecuentemente
          </p>
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Ej: fitness, transformacion, salud..."
              value={customKeyword}
              onChange={(e) => setCustomKeyword(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addKeyword();
                }
              }}
            />
            <Button variant="secondary" size="sm" onClick={addKeyword}>
              Agregar
            </Button>
          </div>
          {config.keywords && config.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {config.keywords.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="purple"
                  size="md"
                  className="flex items-center gap-2"
                >
                  #{keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(index)}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Preview */}
        {config.specializations && config.specializations.length > 0 && config.toneOfVoice && (
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-semibold text-indigo-900">Vista Previa</span>
            </div>
            <p className="text-sm text-slate-700">
              La IA generará contenido con un tono <strong>{selectedTone?.label.toLowerCase()}</strong>{' '}
              enfocado en:{' '}
              <strong>
                {config.specializations
                  ?.map((s) => specializations.find((sp) => sp.value === s)?.label)
                  .join(', ')}
              </strong>
              {config.values && config.values.length > 0 && (
                <>
                  {' '}
                  transmitiendo valores como:{' '}
                  <strong>{config.values.join(', ')}</strong>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

