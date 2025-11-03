import React, { useState, useEffect } from 'react';
import { Layout } from '../../../components/layout';
import { AISuggestionCard } from '../components/AISuggestionCard';
import { PersonalizationEngineDashboard } from '../components/PersonalizationEngineDashboard';
import { EngineSettingsModule } from '../components/EngineSettingsModule';
import {
  getAISuggestions,
  performSuggestionAction,
  getEngineSettings,
  updateEngineSettings,
  AISuggestion,
  SuggestionType,
  SuggestionStatus,
  EngineSettings,
  GlobalObjective
} from '../api/personalization';
import { Brain, Settings, Lightbulb, AlertCircle, Zap, MessageSquare, BookOpen, Gift } from 'lucide-react';

export default function PersonalizationEngineIaAvanzadaPage() {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [engineSettings, setEngineSettings] = useState<EngineSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | SuggestionType>('all');
  const [activeTab, setActiveTab] = useState<'suggestions' | 'settings'>('suggestions');

  useEffect(() => {
    loadData();
  }, [filterType]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const type = filterType === 'all' ? undefined : filterType;
      const [suggestionsData, settingsData] = await Promise.all([
        getAISuggestions('PENDING_REVIEW', type),
        getEngineSettings()
      ]);

      setSuggestions(suggestionsData);
      setEngineSettings(settingsData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (suggestionId: string) => {
    try {
      const result = await performSuggestionAction(suggestionId, 'ACCEPT');
      setSuggestions(prev => prev.filter(s => s.suggestionId !== suggestionId));
      console.log('Sugerencia aceptada:', result);
    } catch (err: any) {
      alert('Error al aceptar la sugerencia: ' + err.message);
    }
  };

  const handleReject = async (suggestionId: string, reason?: string) => {
    try {
      const result = await performSuggestionAction(suggestionId, 'REJECT', reason);
      setSuggestions(prev => prev.filter(s => s.suggestionId !== suggestionId));
      console.log('Sugerencia rechazada:', result);
    } catch (err: any) {
      alert('Error al rechazar la sugerencia: ' + err.message);
    }
  };

  const handleSettingsUpdate = async (moduleName: keyof EngineSettings['modules'], newConfig: any) => {
    if (!engineSettings) return;

    try {
      const updatedSettings = await updateEngineSettings({
        modules: {
          ...engineSettings.modules,
          [moduleName]: newConfig
        }
      });
      setEngineSettings(updatedSettings);
    } catch (err: any) {
      alert('Error al actualizar configuración: ' + err.message);
    }
  };

  const getFilterCount = (type: typeof filterType) => {
    if (type === 'all') return suggestions.length;
    return suggestions.filter(s => s.type === type).length;
  };

  if (error && suggestions.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Brain className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Motor de Personalización IA</h1>
          </div>
          <p className="text-gray-600 mt-2">
            Co-piloto inteligente para ofrecer experiencias personalizadas a escala
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition
                ${
                  activeTab === 'suggestions'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Lightbulb className="w-5 h-5" />
              Sugerencias
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition
                ${
                  activeTab === 'settings'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Settings className="w-5 h-5" />
              Configuración
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'suggestions' ? (
          <div className="space-y-6">
            {/* KPI Dashboard */}
            <PersonalizationEngineDashboard isLoading={isLoading} />

            {/* Filters */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Sugerencias Pendientes</h2>
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'Todas', icon: Lightbulb },
                  { id: 'WORKOUT_ADJUSTMENT', label: 'Entrenamiento', icon: Zap },
                  { id: 'ADAPTIVE_COMMUNICATION', label: 'Comunicación', icon: MessageSquare },
                  { id: 'CONTENT_RECOMMENDATION', label: 'Contenido', icon: BookOpen },
                  { id: 'INTELLIGENT_OFFER', label: 'Ofertas', icon: Gift }
                ].map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setFilterType(filter.id as any)}
                      className={`flex items-center gap-1 px-3 py-1 rounded transition ${
                        filterType === filter.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {filter.label} ({getFilterCount(filter.id as any)})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Suggestions List */}
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : suggestions.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">¡Todo al día!</h3>
                <p className="text-gray-600">
                  No hay sugerencias pendientes de revisar en este momento.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {suggestions.map((suggestion) => (
                  <AISuggestionCard
                    key={suggestion.suggestionId}
                    suggestion={suggestion}
                    onAccept={handleAccept}
                    onReject={handleReject}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Configuración del Motor</h2>

            {engineSettings && (
              <div className="space-y-6">
                {/* Global Objective */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Objetivo Principal</h3>
                  <div className="flex gap-3">
                    {[
                      { value: 'MAXIMIZE_RETENTION', label: 'Maximizar Retención' },
                      { value: 'MAXIMIZE_LTV', label: 'Maximizar LTV' },
                      { value: 'IMPROVE_ADHERENCE', label: 'Mejorar Adherencia' }
                    ].map((obj) => (
                      <button
                        key={obj.value}
                        onClick={() => {
                          const updated = { ...engineSettings, globalObjective: obj.value as GlobalObjective };
                          setEngineSettings(updated);
                          updateEngineSettings(updated).catch(err => alert('Error: ' + err.message));
                        }}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${
                          engineSettings.globalObjective === obj.value
                            ? 'border-purple-600 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {obj.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Module Settings */}
                <div className="grid grid-cols-1 gap-6">
                  <EngineSettingsModule
                    title="Ajustes de Entrenamiento"
                    config={engineSettings.modules.workoutAdjustments}
                    onConfigChange={(config) => handleSettingsUpdate('workoutAdjustments', config)}
                  />
                  <EngineSettingsModule
                    title="Comunicación Adaptativa"
                    config={engineSettings.modules.adaptiveCommunication}
                    onConfigChange={(config) => handleSettingsUpdate('adaptiveCommunication', config)}
                  />
                  <EngineSettingsModule
                    title="Recomendación de Contenido"
                    config={engineSettings.modules.contentRecommendation}
                    onConfigChange={(config) => handleSettingsUpdate('contentRecommendation', config)}
                  />
                  <EngineSettingsModule
                    title="Ofertas Inteligentes"
                    config={engineSettings.modules.intelligentOffers}
                    onConfigChange={(config) => handleSettingsUpdate('intelligentOffers', config)}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

