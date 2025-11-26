import { useState, useEffect } from 'react';
import { Save, Star, CheckCircle2, Slider, X } from 'lucide-react';
import { Button, Card, Input, Select, Badge, Switch } from '../../../components/componentsreutilizables';
import type { StarFormatsConfig, StarFormat, ContentFormat, ExtendedSocialPlatform } from '../types';
import {
  getStarFormatsConfig,
  saveStarFormatsConfig,
  getAvailableContentFormats,
  getDefaultStarFormats,
} from '../api/starFormats';

interface StarFormatsConfigProps {
  loading?: boolean;
}

const platformOptions: Array<{ value: ExtendedSocialPlatform; label: string }> = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'youtube', label: 'YouTube' },
];

export function StarFormatsConfig({ loading: externalLoading }: StarFormatsConfigProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [starFormats, setStarFormats] = useState<StarFormat[]>([]);

  const availableFormats = getAvailableContentFormats();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const savedConfig = await getStarFormatsConfig();
      if (savedConfig && savedConfig.starFormats.length > 0) {
        setStarFormats(savedConfig.starFormats);
      } else {
        // Si no hay configuración guardada, usar valores por defecto
        setStarFormats(getDefaultStarFormats());
      }
    } catch (error) {
      console.error('Error loading star formats config:', error);
      setStarFormats(getDefaultStarFormats());
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const enabledFormats = starFormats.filter((f) => f.enabled);
    if (enabledFormats.length === 0) {
      alert('Por favor, habilita al menos un formato estrella');
      return;
    }

    setSaving(true);
    try {
      await saveStarFormatsConfig({
        starFormats,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving star formats config:', error);
      alert('Error al guardar la configuración. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  const updateFormat = (format: ContentFormat, updates: Partial<StarFormat>) => {
    setStarFormats(
      starFormats.map((f) => (f.format === format ? { ...f, ...updates } : f))
    );
  };

  const toggleFormat = (format: ContentFormat) => {
    const currentFormat = starFormats.find((f) => f.format === format);
    if (currentFormat) {
      updateFormat(format, { enabled: !currentFormat.enabled });
    }
  };

  const updatePriority = (format: ContentFormat, priority: number) => {
    const clampedPriority = Math.max(1, Math.min(10, priority));
    updateFormat(format, { priority: clampedPriority });
  };

  const togglePlatform = (format: ContentFormat, platform: ExtendedSocialPlatform) => {
    const currentFormat = starFormats.find((f) => f.format === format);
    if (!currentFormat) return;

    const currentPlatforms = currentFormat.preferredPlatforms || [];
    const hasPlatform = currentPlatforms.includes(platform);
    
    updateFormat(format, {
      preferredPlatforms: hasPlatform
        ? currentPlatforms.filter((p) => p !== platform)
        : [...currentPlatforms, platform],
    });
  };

  const updateNotes = (format: ContentFormat, notes: string) => {
    updateFormat(format, { notes });
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

  const enabledFormats = starFormats.filter((f) => f.enabled);
  const sortedFormats = [...starFormats].sort((a, b) => {
    if (a.enabled !== b.enabled) return a.enabled ? -1 : 1;
    return b.priority - a.priority;
  });

  return (
    <Card className="p-0 shadow-sm border border-slate-100">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            Formatos Estrella
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Define tus formatos preferidos para que la IA los priorice en ideas y planning
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
        {/* Resumen */}
        {enabledFormats.length > 0 && (
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-900">
                Formatos activos: {enabledFormats.length}
              </span>
            </div>
            <p className="text-xs text-amber-700">
              La IA priorizará estos formatos al generar ideas y contenido:{' '}
              <strong>
                {enabledFormats
                  .sort((a, b) => b.priority - a.priority)
                  .map((f) => {
                    const formatInfo = availableFormats.find((af) => af.value === f.format);
                    return formatInfo?.label;
                  })
                  .filter(Boolean)
                  .join(', ')}
              </strong>
            </p>
          </div>
        )}

        {/* Lista de formatos */}
        <div className="space-y-4">
          {sortedFormats.map((starFormat) => {
            const formatInfo = availableFormats.find((af) => af.value === starFormat.format);
            if (!formatInfo) return null;

            return (
              <div
                key={starFormat.format}
                className={`p-4 rounded-lg border-2 transition-all ${
                  starFormat.enabled
                    ? 'bg-white border-amber-200 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Switch
                        checked={starFormat.enabled}
                        onChange={() => toggleFormat(starFormat.format)}
                      />
                      <div>
                        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                          {starFormat.enabled && (
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          )}
                          {formatInfo.label}
                        </h3>
                        <p className="text-xs text-slate-500">{formatInfo.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {starFormat.enabled && (
                  <div className="ml-10 space-y-3">
                    {/* Prioridad */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-2">
                        Prioridad: {starFormat.priority}/10
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={starFormat.priority}
                          onChange={(e) => updatePriority(starFormat.format, parseInt(e.target.value))}
                          className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                        <span className="text-sm font-semibold text-slate-700 w-8 text-right">
                          {starFormat.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {starFormat.priority >= 8
                          ? 'Muy alta prioridad - La IA los sugerirá frecuentemente'
                          : starFormat.priority >= 5
                          ? 'Prioridad media - La IA los considerará regularmente'
                          : 'Prioridad baja - La IA los usará ocasionalmente'}
                      </p>
                    </div>

                    {/* Plataformas preferidas */}
                    {formatInfo.defaultPlatforms.length > 0 && (
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-2">
                          Plataformas preferidas (opcional)
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {platformOptions
                            .filter((p) => {
                              return formatInfo.defaultPlatforms.includes(p.value) || 
                                     (p.value === 'twitter' || p.value === 'youtube');
                            })
                            .map((platform) => {
                              const isSelected = starFormat.preferredPlatforms?.includes(platform.value);
                              return (
                                <button
                                  key={platform.value}
                                  type="button"
                                  onClick={() => togglePlatform(starFormat.format, platform.value)}
                                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                    isSelected
                                      ? 'bg-amber-500 text-white'
                                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                  }`}
                                >
                                  {platform.label}
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    )}

                    {/* Notas */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-2">
                        Notas (opcional)
                      </label>
                      <Input
                        placeholder="Ej: Prefiero reels educativos de 30-60 segundos"
                        value={starFormat.notes || ''}
                        onChange={(e) => updateNotes(starFormat.format, e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Información adicional */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-600">
            <strong>💡 Consejo:</strong> Los formatos con mayor prioridad serán sugeridos más frecuentemente por la IA
            al generar ideas de contenido y al planificar tu calendario editorial. Puedes ajustar las prioridades según
            tus preferencias y resultados.
          </p>
        </div>
      </div>
    </Card>
  );
}

