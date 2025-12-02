import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { GeneralProfile, GeneralProfileFormData, ProfileType, PaymentStatus } from '../types';
import { profileApi } from '../api/profileApi';
import { BusinessProfileCard } from './BusinessProfileCard';
import { LogoUploader } from './LogoUploader';
import { BusinessHoursCard } from './BusinessHoursCard';
import { PaymentIntegrationCard } from './PaymentIntegrationCard';
import { Button, Card } from '../../../components/componentsreutilizables';
import { Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export const GeneralSettingsContainer: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<GeneralProfile | null>(null);
  const [formData, setFormData] = useState<GeneralProfileFormData>({
    name: '',
    description: '',
    address: '',
    phone: '',
    maxCapacity: undefined,
    specialties: [],
    businessHours: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);

  // Determinar el tipo de perfil basado en el rol del usuario
  const profileType: ProfileType = user?.role === 'entrenador' ? 'trainer' : 'gym';

  // Cargar perfil inicial
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await profileApi.getGeneralProfile();
      setProfile(data);
      setFormData({
        name: data.name,
        description: data.description || '',
        address: data.address || '',
        phone: data.phone || '',
        maxCapacity: data.maxCapacity,
        specialties: data.specialties || [],
        businessHours: data.businessHours,
      });
      setLogoUrl(data.logoUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = useCallback((fieldName: keyof GeneralProfileFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    setSuccess(false);
  }, []);

  const handleHoursChange = useCallback((hours: GeneralProfile['businessHours']) => {
    handleFieldChange('businessHours', hours);
  }, [handleFieldChange]);

  const handleLogoUploadSuccess = useCallback((newLogoUrl: string) => {
    setLogoUrl(newLogoUrl);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }, []);

  const handlePaymentStatusChange = useCallback((status: PaymentStatus) => {
    if (profile) {
      setProfile({ ...profile, paymentStatus: status });
    }
  }, [profile]);

  const calculateCompleteness = (): number => {
    let completedFields = 0;
    const totalFields = profileType === 'gym' ? 7 : 6;

    if (formData.name) completedFields++;
    if (formData.description) completedFields++;
    if (logoUrl) completedFields++;
    if (formData.businessHours.length > 0 && formData.businessHours.some(h => !h.isClosed && h.slots.length > 0)) completedFields++;
    if (profile?.paymentStatus === 'connected') completedFields++;
    if (profileType === 'gym' && formData.address) completedFields++;
    if (profileType === 'gym' && formData.maxCapacity) completedFields++;
    if (profileType === 'trainer' && formData.specialties && formData.specialties.length > 0) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await profileApi.updateGeneralProfile(formData);
      setSuccess(true);
      
      // Actualizar perfil local
      if (profile) {
        setProfile({
          ...profile,
          ...formData,
          logoUrl,
          lastUpdated: new Date().toISOString(),
        });
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar los cambios');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card padding="lg" className="text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  const completeness = calculateCompleteness();

  return (
    <div className="space-y-6">
      {/* Indicador de completitud */}
      <Card padding="none">
        <div className="p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Progreso del Perfil
            </h3>
            <p className="text-sm text-gray-600">
              {completeness}% completado
            </p>
          </div>
          <div className="w-24 h-24 relative">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="44"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="48"
                cy="48"
                r="44"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(completeness / 100) * 276.46} 276.46`}
                className="text-blue-600 transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">
                {completeness}%
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Mensajes de éxito/error */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-600">
            Cambios guardados exitosamente
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Componentes del formulario */}
      <LogoUploader
        currentLogoUrl={logoUrl}
        onUploadSuccess={handleLogoUploadSuccess}
      />

      <BusinessProfileCard
        formData={formData}
        onFieldChange={handleFieldChange}
        profileType={profileType}
      />

      <BusinessHoursCard
        hours={formData.businessHours}
        onHoursChange={handleHoursChange}
      />

      <PaymentIntegrationCard
        paymentStatus={profile?.paymentStatus || 'not_connected'}
        onStatusChange={handlePaymentStatusChange}
      />

      {/* Botón de guardar */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={handleSave}
          loading={isSaving}
          size="lg"
        >
          <Save className="w-5 h-5 mr-2" />
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
};

