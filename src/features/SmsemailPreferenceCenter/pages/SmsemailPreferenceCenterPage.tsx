import React, { useState, useEffect } from 'react';
import { Layout } from '../../../components/layout';
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
import { Save, CheckCircle, AlertTriangle, Mail, Shield, Power } from 'lucide-react';

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
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-6 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Mail className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Preferencias de Comunicación
            </h1>
            <p className="text-gray-600 mb-1">
              Hola, {clientName}
            </p>
            <p className="text-sm text-gray-500">
              Controla los tipos de mensajes que recibes y el canal preferido
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Info Card */}
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Tu privacidad es importante</h3>
                <p className="text-sm text-gray-700">
                  Puedes cambiar tus preferencias en cualquier momento. Solo recibirás los mensajes que selecciones.
                </p>
              </div>
            </div>
          </div>

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
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Guardando...' : 'Guardar Preferencias'}
            </button>

            <button
              onClick={() => setShowUnsubscribeConfirm(true)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
            >
              <Power className="w-5 h-5" />
              Anular Suscripción a Todo
            </button>
          </div>

          {/* Last Updated */}
          {lastUpdated && (
            <p className="text-center text-sm text-gray-500 mt-6">
              Última actualización: {new Date(lastUpdated).toLocaleDateString('es-ES')}
            </p>
          )}
        </div>

        {/* Unsubscribe Confirmation Modal */}
        {showUnsubscribeConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ¿Anular todas las suscripciones?
              </h2>
              <p className="text-gray-700 mb-6">
                Esto te dará de baja de todas las comunicaciones no esenciales. Las notificaciones importantes sobre tu cuenta y servicios continuarán llegando.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowUnsubscribeConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUnsubscribeAll}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

