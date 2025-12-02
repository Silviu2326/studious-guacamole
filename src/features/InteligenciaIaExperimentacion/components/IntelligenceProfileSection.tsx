import React, { useEffect, useState } from 'react';
import { StrategicPillarsForm, DecisionStyleSelector } from './';
import { getIntelligenceProfile, saveIntelligenceProfileService } from '../services/intelligenceService';
import { IntelligenceProfile, StrategicPillars, DecisionStyle } from '../types';
import { useAuth } from '../../../context/AuthContext';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';

interface IntelligenceProfileSectionProps {
  onProfileUpdated?: () => void;
}

export const IntelligenceProfileSection: React.FC<IntelligenceProfileSectionProps> = ({
  onProfileUpdated,
}) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<IntelligenceProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const loadedProfile = await getIntelligenceProfile(user?.id);
      setProfile(loadedProfile);
    } catch (err) {
      console.error('Error cargando perfil:', err);
      setError('No se pudo cargar el perfil de inteligencia');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePillars = async (strategicPillars: StrategicPillars) => {
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);
    
    try {
      const currentDecisionStyle = profile?.decisionStyle || 'rapido';
      const savedProfile = await saveIntelligenceProfileService(
        strategicPillars,
        currentDecisionStyle,
        user?.id
      );
      setProfile(savedProfile);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      onProfileUpdated?.();
    } catch (err) {
      console.error('Error guardando pilares:', err);
      setError('No se pudo guardar los pilares estratégicos');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStyleChange = async (decisionStyle: DecisionStyle) => {
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);
    
    try {
      const currentPillars = profile?.strategicPillars || {
        mission: '',
        differentiators: [],
        availableResources: [],
      };
      const savedProfile = await saveIntelligenceProfileService(
        currentPillars,
        decisionStyle,
        user?.id
      );
      setProfile(savedProfile);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      onProfileUpdated?.();
    } catch (err) {
      console.error('Error guardando estilo:', err);
      setError('No se pudo guardar el estilo de decisión');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-12 flex items-center justify-center bg-white shadow-sm border border-slate-200/70">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="animate-spin" size={20} />
          Cargando perfil de inteligencia...
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Card className="p-4 bg-red-50 border border-red-200">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle size={18} />
            <p className="text-sm">{error}</p>
          </div>
        </Card>
      )}

      {saveSuccess && (
        <Card className="p-4 bg-green-50 border border-green-200">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle2 size={18} />
            <p className="text-sm">Perfil guardado correctamente</p>
          </div>
        </Card>
      )}

      <StrategicPillarsForm
        initialData={profile?.strategicPillars}
        onSave={handleSavePillars}
        isLoading={isSaving}
      />

      <DecisionStyleSelector
        currentStyle={profile?.decisionStyle}
        onStyleChange={handleStyleChange}
        isLoading={isSaving}
      />
    </div>
  );
};

export default IntelligenceProfileSection;

