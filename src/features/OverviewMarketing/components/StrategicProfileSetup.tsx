import React, { useState, useEffect } from 'react';
import { User, Sparkles, Plus, X, Save, CheckCircle2 } from 'lucide-react';
import { Button, Card, Input, Select, Textarea, Badge } from '../../../components/componentsreutilizables';
import { StrategicProfile, ToneType, SpecialtyType, StrengthType, ContentPillar, BuyerPersona } from '../types';
import { ds } from '../../adherencia/ui/ds';

interface StrategicProfileSetupProps {
  profile?: StrategicProfile;
  onSave: (profile: StrategicProfile) => Promise<void>;
  className?: string;
}

const toneOptions: { value: ToneType; label: string; description: string }[] = [
  { value: 'profesional', label: 'Profesional', description: 'Formal y basado en evidencia' },
  { value: 'motivacional', label: 'Motivacional', description: 'Energético y alentador' },
  { value: 'cercano', label: 'Cercano', description: 'Amigable y accesible' },
  { value: 'educativo', label: 'Educativo', description: 'Informativo y didáctico' },
  { value: 'inspirador', label: 'Inspirador', description: 'Transformador y visionario' },
  { value: 'directo', label: 'Directo', description: 'Claro y sin rodeos' },
];

const specialtyOptions: { value: SpecialtyType; label: string }[] = [
  { value: 'fuerza', label: 'Fuerza y Musculación' },
  { value: 'cardio', label: 'Cardio y Resistencia' },
  { value: 'pérdida_peso', label: 'Pérdida de Peso' },
  { value: 'ganancia_masa', label: 'Ganancia de Masa Muscular' },
  { value: 'rehabilitación', label: 'Rehabilitación y Lesiones' },
  { value: 'deportes_específicos', label: 'Deportes Específicos' },
  { value: 'bienestar_general', label: 'Bienestar General' },
  { value: 'nutrición_deportiva', label: 'Nutrición Deportiva' },
];

const strengthOptions: { value: StrengthType; label: string; description: string }[] = [
  { value: 'HIIT', label: 'HIIT', description: 'Entrenamiento de alta intensidad por intervalos' },
  { value: 'fuerza_funcional', label: 'Fuerza Funcional', description: 'Movimientos funcionales y fuerza aplicada' },
  { value: 'nutrición_holística', label: 'Nutrición Holística', description: 'Enfoque integral de la alimentación' },
  { value: 'yoga', label: 'Yoga', description: 'Práctica de yoga y mindfulness' },
  { value: 'pilates', label: 'Pilates', description: 'Control y fortalecimiento del core' },
  { value: 'crossfit', label: 'CrossFit', description: 'Entrenamiento funcional de alta intensidad' },
  { value: 'running', label: 'Running', description: 'Carrera y resistencia' },
  { value: 'ciclismo', label: 'Ciclismo', description: 'Entrenamiento en bicicleta' },
  { value: 'natación', label: 'Natación', description: 'Entrenamiento acuático' },
  { value: 'rehabilitación', label: 'Rehabilitación', description: 'Recuperación y prevención de lesiones' },
  { value: 'nutrición_deportiva', label: 'Nutrición Deportiva', description: 'Alimentación para rendimiento' },
  { value: 'coaching_mindset', label: 'Coaching Mindset', description: 'Mentalidad y motivación' },
  { value: 'entrenamiento_personalizado', label: 'Entrenamiento Personalizado', description: 'Programas adaptados individualmente' },
];

export const StrategicProfileSetup: React.FC<StrategicProfileSetupProps> = ({
  profile,
  onSave,
  className = '',
}) => {
  const [tone, setTone] = useState<ToneType | ''>(profile?.tone || '');
  const [specialty, setSpecialty] = useState<SpecialtyType | ''>(profile?.specialty || '');
  const [strengths, setStrengths] = useState<StrengthType[]>(profile?.strengths || []);
  const [contentPillars, setContentPillars] = useState<ContentPillar[]>(profile?.contentPillars || []);
  const [buyerPersonas, setBuyerPersonas] = useState<BuyerPersona[]>(profile?.buyerPersonas || []);
  const [newPillarName, setNewPillarName] = useState('');
  const [newPillarDesc, setNewPillarDesc] = useState('');
  const [newPersonaName, setNewPersonaName] = useState('');
  const [newPersonaAge, setNewPersonaAge] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleAddPillar = () => {
    if (newPillarName.trim()) {
      const newPillar: ContentPillar = {
        id: `pillar-${Date.now()}`,
        name: newPillarName.trim(),
        description: newPillarDesc.trim() || undefined,
      };
      setContentPillars([...contentPillars, newPillar]);
      setNewPillarName('');
      setNewPillarDesc('');
    }
  };

  const handleRemovePillar = (id: string) => {
    setContentPillars(contentPillars.filter((p) => p.id !== id));
  };

  const handleAddPersona = () => {
    if (newPersonaName.trim()) {
      const newPersona: BuyerPersona = {
        id: `persona-${Date.now()}`,
        name: newPersonaName.trim(),
        ageRange: newPersonaAge.trim() || undefined,
      };
      setBuyerPersonas([...buyerPersonas, newPersona]);
      setNewPersonaName('');
      setNewPersonaAge('');
    }
  };

  const handleRemovePersona = (id: string) => {
    setBuyerPersonas(buyerPersonas.filter((p) => p.id !== id));
  };

  const handleToggleStrength = (strength: StrengthType) => {
    if (strengths.includes(strength)) {
      setStrengths(strengths.filter((s) => s !== strength));
    } else {
      setStrengths([...strengths, strength]);
    }
  };

  const handleSave = async () => {
    if (!tone || !specialty) {
      return;
    }

    setIsSaving(true);
    try {
      const updatedProfile: StrategicProfile = {
        tone: tone as ToneType,
        specialty: specialty as SpecialtyType,
        strengths: strengths.length > 0 ? strengths : undefined,
        contentPillars,
        buyerPersonas,
        completed: true,
      };
      await onSave(updatedProfile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error guardando perfil estratégico:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const isComplete = tone && specialty;

  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-indigo-900/40 dark:to-purple-900/30 flex items-center justify-center">
              <User className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Perfil Estratégico
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Completa tu perfil para que todas las recomendaciones se adapten automáticamente a tu estilo.
          </p>
        </div>
        {profile?.completed && (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Completado
          </Badge>
        )}
      </div>

      <div className="space-y-6">
        {/* Tono */}
        <div>
          <label className={`block ${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Tono de Comunicación *
          </label>
          <Select
            value={tone}
            onChange={(e) => setTone(e.target.value as ToneType)}
            options={toneOptions.map((opt) => ({
              value: opt.value,
              label: `${opt.label} - ${opt.description}`,
            }))}
            placeholder="Selecciona tu tono de comunicación"
          />
        </div>

        {/* Especialidad */}
        <div>
          <label className={`block ${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Especialidad *
          </label>
          <Select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value as SpecialtyType)}
            options={specialtyOptions.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
            placeholder="Selecciona tu especialidad"
          />
        </div>

        {/* Fortalezas */}
        <div>
          <label className={`block ${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Mis Fortalezas
          </label>
          <p className={`text-sm ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-3`}>
            Selecciona tus áreas de especialización. Esto ayudará a que las campañas sugeridas reflejen lo que mejor sabes hacer.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {strengthOptions.map((strength) => {
              const isSelected = strengths.includes(strength.value);
              return (
                <button
                  key={strength.value}
                  type="button"
                  onClick={() => handleToggleStrength(strength.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-400'
                      : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:border-indigo-300 dark:hover:border-indigo-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className={`font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                        {strength.label}
                      </p>
                      <p className={`text-xs ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                        {strength.description}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          {strengths.length > 0 && (
            <p className={`text-sm ${ds.color.textMuted} ${ds.color.textMutedDark} mt-2`}>
              {strengths.length} fortaleza{strengths.length !== 1 ? 's' : ''} seleccionada{strengths.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Pilares de Contenido */}
        <div>
          <label className={`block ${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Pilares de Contenido
          </label>
          <div className="space-y-3">
            {contentPillars.map((pillar) => (
              <div
                key={pillar.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50"
              >
                <div className="flex-1">
                  <p className={`font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>{pillar.name}</p>
                  {pillar.description && (
                    <p className={`text-sm ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-1`}>
                      {pillar.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemovePillar(pillar.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                value={newPillarName}
                onChange={(e) => setNewPillarName(e.target.value)}
                placeholder="Nombre del pilar"
                className="flex-1"
              />
              <Input
                value={newPillarDesc}
                onChange={(e) => setNewPillarDesc(e.target.value)}
                placeholder="Descripción (opcional)"
                className="flex-1"
              />
              <Button variant="secondary" onClick={handleAddPillar} disabled={!newPillarName.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Buyer Personas */}
        <div>
          <label className={`block ${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Buyer Personas
          </label>
          <div className="space-y-3">
            {buyerPersonas.map((persona) => (
              <div
                key={persona.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50"
              >
                <div className="flex-1">
                  <p className={`font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>{persona.name}</p>
                  {persona.ageRange && (
                    <p className={`text-sm ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-1`}>
                      Edad: {persona.ageRange}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemovePersona(persona.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                value={newPersonaName}
                onChange={(e) => setNewPersonaName(e.target.value)}
                placeholder="Nombre de la persona"
                className="flex-1"
              />
              <Input
                value={newPersonaAge}
                onChange={(e) => setNewPersonaAge(e.target.value)}
                placeholder="Rango de edad (opcional)"
                className="flex-1"
              />
              <Button variant="secondary" onClick={handleAddPersona} disabled={!newPersonaName.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
          <p className={`text-sm ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
            * Campos obligatorios
          </p>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!isComplete || isSaving}
            className="inline-flex items-center gap-2"
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Guardado
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isSaving ? 'Guardando...' : 'Guardar Perfil'}
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

