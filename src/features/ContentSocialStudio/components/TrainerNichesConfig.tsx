import { useState, useEffect } from 'react';
import { Save, Target, Sparkles, CheckCircle2, X } from 'lucide-react';
import { Button, Card, Badge } from '../../../components/componentsreutilizables';
import type { TrainerNichesConfig, TrainerNiche, NicheAngle } from '../types';
import {
  getTrainerNichesConfig,
  saveTrainerNichesConfig,
  getAvailableNiches,
  generateNicheAngles,
} from '../api/trainerNiches';

interface TrainerNichesConfigProps {
  loading?: boolean;
}

export function TrainerNichesConfig({ loading: externalLoading }: TrainerNichesConfigProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState<Partial<TrainerNichesConfig>>({
    primaryNiches: [],
    nicheAngles: [],
  });

  const availableNiches = getAvailableNiches();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const savedConfig = await getTrainerNichesConfig();
      if (savedConfig) {
        setConfig(savedConfig);
      }
    } catch (error) {
      console.error('Error loading trainer niches config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config.primaryNiches || config.primaryNiches.length === 0) {
      alert('Por favor, selecciona al menos un nicho principal');
      return;
    }

    setSaving(true);
    try {
      // Generar ángulos para cada nicho seleccionado
      const nicheAngles: NicheAngle[] = (config.primaryNiches || []).map((niche) => {
        const existingAngle = config.nicheAngles?.find((na) => na.niche === niche);
        return existingAngle || generateNicheAngles(niche);
      });

      await saveTrainerNichesConfig({
        primaryNiches: config.primaryNiches as TrainerNiche[],
        nicheAngles,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving trainer niches config:', error);
      alert('Error al guardar la configuración. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  const toggleNiche = (niche: TrainerNiche) => {
    const current = config.primaryNiches || [];
    if (current.includes(niche)) {
      const newNiches = current.filter((n) => n !== niche);
      setConfig({
        ...config,
        primaryNiches: newNiches,
        nicheAngles: config.nicheAngles?.filter((na) => na.niche !== niche),
      });
    } else {
      const newNiches = [...current, niche];
      const newAngle = generateNicheAngles(niche);
      setConfig({
        ...config,
        primaryNiches: newNiches,
        nicheAngles: [...(config.nicheAngles || []), newAngle],
      });
    }
  };

  const updateNicheAngle = (niche: TrainerNiche, field: keyof NicheAngle, value: any) => {
    const updatedAngles = (config.nicheAngles || []).map((angle) => {
      if (angle.niche === niche) {
        if (field === 'angles' || field === 'keywords' || field === 'painPoints' || field === 'benefits') {
          return { ...angle, [field]: value };
        }
        return { ...angle, [field]: value };
      }
      return angle;
    });
    setConfig({ ...config, nicheAngles: updatedAngles });
  };

  const addAngleItem = (niche: TrainerNiche, field: 'angles' | 'keywords' | 'painPoints' | 'benefits', value: string) => {
    if (!value.trim()) return;
    const angle = config.nicheAngles?.find((na) => na.niche === niche);
    if (angle) {
      const updated = { ...angle, [field]: [...angle[field], value.trim()] };
      updateNicheAngle(niche, field, updated[field]);
    }
  };

  const removeAngleItem = (niche: TrainerNiche, field: 'angles' | 'keywords' | 'painPoints' | 'benefits', index: number) => {
    const angle = config.nicheAngles?.find((na) => na.niche === niche);
    if (angle) {
      const updated = { ...angle, [field]: angle[field].filter((_, i) => i !== index) };
      updateNicheAngle(niche, field, updated[field]);
    }
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

  return (
    <Card className="p-0 shadow-sm border border-slate-100">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" />
            Configuración de Nichos Principales
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Especifica tus nichos principales para que cada idea incluya ángulos adaptados
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
        {/* Selección de Nichos */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Nichos Principales *
          </label>
          <p className="text-xs text-slate-500 mb-3">
            Selecciona los nichos en los que te especializas. Cada idea de contenido se adaptará a estos nichos.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableNiches.map((niche) => {
              const isSelected = config.primaryNiches?.includes(niche.value);
              return (
                <button
                  key={niche.value}
                  type="button"
                  onClick={() => toggleNiche(niche.value)}
                  className={`p-4 rounded-lg text-left transition-colors border-2 ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1">{niche.label}</h3>
                      <p className="text-xs text-slate-600">{niche.description}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-500 ml-2 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ángulos por Nicho */}
        {config.primaryNiches && config.primaryNiches.length > 0 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                Ángulos Adaptados por Nicho
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Personaliza los ángulos, palabras clave, puntos de dolor y beneficios para cada nicho. 
                Estos se usarán para generar contenido adaptado.
              </p>
            </div>

            {config.primaryNiches.map((niche) => {
              const angle = config.nicheAngles?.find((na) => na.niche === niche);
              const nicheInfo = availableNiches.find((n) => n.value === niche);

              if (!angle) return null;

              return (
                <div key={niche} className="border border-slate-200 rounded-lg p-5 bg-slate-50">
                  <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Target className="w-4 h-4 text-indigo-500" />
                    {nicheInfo?.label}
                  </h4>

                  <div className="space-y-4">
                    {/* Ángulos */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Ángulos de Contenido
                      </label>
                      <div className="space-y-2">
                        {angle.angles.map((ang, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Badge variant="blue" size="md" className="flex-1 justify-between">
                              <span>{ang}</span>
                              <button
                                type="button"
                                onClick={() => removeAngleItem(niche, 'angles', idx)}
                                className="ml-2 hover:text-red-500"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Keywords */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Palabras Clave
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {angle.keywords.map((keyword, idx) => (
                          <Badge
                            key={idx}
                            variant="purple"
                            size="md"
                            className="flex items-center gap-1"
                          >
                            #{keyword}
                            <button
                              type="button"
                              onClick={() => removeAngleItem(niche, 'keywords', idx)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Pain Points */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Puntos de Dolor
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {angle.painPoints.map((pain, idx) => (
                          <Badge
                            key={idx}
                            variant="red"
                            size="md"
                            className="flex items-center gap-1"
                          >
                            {pain}
                            <button
                              type="button"
                              onClick={() => removeAngleItem(niche, 'painPoints', idx)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Beneficios
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {angle.benefits.map((benefit, idx) => (
                          <Badge
                            key={idx}
                            variant="green"
                            size="md"
                            className="flex items-center gap-1"
                          >
                            {benefit}
                            <button
                              type="button"
                              onClick={() => removeAngleItem(niche, 'benefits', idx)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Preview */}
        {config.primaryNiches && config.primaryNiches.length > 0 && (
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-semibold text-indigo-900">Vista Previa</span>
            </div>
            <p className="text-sm text-slate-700">
              Las ideas de contenido se adaptarán automáticamente a tus nichos principales:{' '}
              <strong>
                {config.primaryNiches
                  .map((n) => availableNiches.find((an) => an.value === n)?.label)
                  .join(', ')}
              </strong>
              . Cada idea incluirá ángulos, palabras clave y mensajes específicos para estos nichos.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

