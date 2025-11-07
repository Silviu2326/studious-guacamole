import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { PreferenceCategoryRow } from '../components/PreferenceCategoryRow';
import {
  getClientPreferences,
  updateClientPreferences,
  unsubscribeAll,
  getCategoryInfo,
  Preference,
  PreferenceCategoryInfo,
  CommunicationChannel
} from '../api/preferences';
import { Save, CheckCircle, AlertTriangle, Mail, Shield, Power, Loader2 } from 'lucide-react';
import { Card, Button, Modal } from '../../../components/componentsreutilizables';

export default function SmsemailPreferenceCenterPage() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<PreferenceCategoryInfo[]>([]);
  const [clientName, setClientName] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showUnsubscribeConfirm, setShowUnsubscribeConfirm] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // En producción, obtener el token de la URL
      const token = new URLSearchParams(window.location.search).get('token') || 'demo_token';
      const data = await getClientPreferences(token);
      
      setClientName(data.clientName);
      setPreferences(data.preferences);
      setLastUpdated(data.last_updated_at || null);
      setCategoryInfo(getCategoryInfo());
    } catch (err: any) {
      setError('No se pudieron cargar tus preferencias. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (category: string, isSubscribed: boolean) => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.category === category
          ? { ...pref, is_subscribed: isSubscribed, channel: isSubscribed ? pref.channel : 'none' }
          : pref
      )
    );
  };

  const handleChannelChange = (category: string, channel: CommunicationChannel) => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.category === category ? { ...pref, channel } : pref
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = new URLSearchParams(window.location.search).get('token') || 'demo_token';
      await updateClientPreferences(token, preferences);
      setSuccessMessage('Tus preferencias han sido actualizadas correctamente.');
      setLastUpdated(new Date().toISOString());
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setError('No se pudieron guardar tus preferencias. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnsubscribeAll = async () => {
    try {
      const token = new URLSearchParams(window.location.search).get('token') || 'demo_token';
      await unsubscribeAll(token);
      setSuccessMessage('Has sido dado de baja de todas nuestras comunicaciones.');
      setPreferences(prev =>
        prev.map(pref => ({ ...pref, is_subscribed: false, channel: 'none' }))
      );
      setShowUnsubscribeConfirm(false);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setError('No se pudo procesar tu solicitud. Por favor, intenta de nuevo.');
      console.error(err);
    }
  };

  const getPreferenceForCategory = (category: string) => {
    return preferences.find(p => p.category === category);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
            <Card padding="none" className="p-8 text-center bg-white shadow-sm">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando...</p>
            </Card>
          </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Mail size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Preferencias de Comunicación
                  </h1>
                  <p className="text-gray-600">
                    Controla los tipos de mensajes que recibes y el canal preferido
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-6 py-8">

          {/* Success Message */}
          {successMessage && (
            <Card padding="none" className="mb-6 bg-green-100 border border-green-400 text-green-700 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-green-600" />
                <span className="font-medium">{successMessage}</span>
              </div>
            </Card>
          )}

          {/* Error Message */}
          {error && (
            <Card padding="none" className="mb-6 bg-red-100 border border-red-400 text-red-700 p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-600" />
                <span className="font-medium">{error}</span>
              </div>
            </Card>
          )}

          {/* Info Card */}
          <Card padding="none" className="mb-6 bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Tu privacidad es importante</h3>
                <p className="text-sm text-gray-700">
                  Puedes cambiar tus preferencias en cualquier momento. Solo recibirás los mensajes que selecciones.
                </p>
              </div>
            </div>
          </Card>

          {/* Preferences List */}
          <div className="space-y-4 mb-8">
            {categoryInfo.map((info) => {
              const pref = getPreferenceForCategory(info.category);
              if (!pref) return null;

              return (
                <PreferenceCategoryRow
                  key={info.category}
                  categoryName={info.label}
                  description={info.description}
                  isSubscribed={pref.is_subscribed}
                  selectedChannel={pref.channel}
                  availableChannels={info.availableChannels}
                  onToggle={(isSubscribed) => handleToggle(info.category, isSubscribed)}
                  onChannelChange={(channel) => handleChannelChange(info.category, channel)}
                />
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="space-y-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              loading={isSaving}
              fullWidth
              size="lg"
              leftIcon={<Save size={20} />}
            >
              Guardar Preferencias
            </Button>

            <Button
              onClick={() => setShowUnsubscribeConfirm(true)}
              variant="secondary"
              fullWidth
              size="lg"
              leftIcon={<Power size={20} />}
            >
              Anular Suscripción a Todo
            </Button>
          </div>

          {/* Last Updated */}
          {lastUpdated && (
            <p className="text-center text-sm text-gray-500 mt-6">
              Última actualización: {new Date(lastUpdated).toLocaleDateString('es-ES')}
            </p>
          )}
        </div>

        {/* Unsubscribe Confirmation Modal */}
        <Modal
          isOpen={showUnsubscribeConfirm}
          onClose={() => setShowUnsubscribeConfirm(false)}
          title="¿Anular todas las suscripciones?"
          size="sm"
          footer={
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowUnsubscribeConfirm(false)}
                fullWidth
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleUnsubscribeAll}
                fullWidth
              >
                Confirmar
              </Button>
            </div>
          }
        >
          <p className="text-gray-600">
            Esto te dará de baja de todas las comunicaciones no esenciales. Las notificaciones importantes sobre tu cuenta y servicios continuarán llegando.
          </p>
        </Modal>
      </div>
  );
}

