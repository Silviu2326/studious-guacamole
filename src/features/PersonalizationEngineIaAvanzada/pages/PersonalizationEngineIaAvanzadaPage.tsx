import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
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
  EngineSettings,
  GlobalObjective
} from '../api/personalization';
import { Brain, Settings, Lightbulb, AlertCircle, Zap, MessageSquare, BookOpen, Gift, Loader2, Package } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
            <Card className="p-8 text-center">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
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
                  <Brain size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Motor de Personalización IA
                  </h1>
                  <p className="text-gray-600">
                    Co-piloto inteligente para ofrecer experiencias personalizadas a escala
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenedor Principal */}
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="space-y-6">
            {/* Tabs */}
            <Card className="p-0 bg-white shadow-sm">
              <div className="px-4 py-3">
                <div
                  role="tablist"
                  aria-label="Secciones"
                  className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
                >
                  <button
                    onClick={() => setActiveTab('suggestions')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      activeTab === 'suggestions'
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Lightbulb size={18} className={activeTab === 'suggestions' ? 'opacity-100' : 'opacity-70'} />
                    <span>Sugerencias</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      activeTab === 'settings'
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Settings size={18} className={activeTab === 'settings' ? 'opacity-100' : 'opacity-70'} />
                    <span>Configuración</span>
                  </button>
                </div>
              </div>
            </Card>

            {/* Tab Content */}
            {activeTab === 'suggestions' ? (
              <div className="space-y-6 mt-6">
                {/* KPI Dashboard */}
                <PersonalizationEngineDashboard isLoading={isLoading} />

                {/* Filters */}
                <Card className="p-4 bg-white shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Sugerencias Pendientes</h2>
                    <div className="flex flex-wrap gap-2">
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
                            className={`inline-flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                              filterType === filter.id
                                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-200'
                                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 ring-1 ring-slate-200'
                            }`}
                          >
                            <Icon size={16} />
                            {filter.label} ({getFilterCount(filter.id as any)})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </Card>

                {/* Suggestions List */}
                {isLoading ? (
                  <Card className="p-8 text-center bg-white shadow-sm">
                    <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
                    <p className="text-gray-600">Cargando...</p>
                  </Card>
                ) : suggestions.length === 0 ? (
                  <Card className="p-8 text-center bg-white shadow-sm">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">¡Todo al día!</h3>
                    <p className="text-gray-600">
                      No hay sugerencias pendientes de revisar en este momento.
                    </p>
                  </Card>
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
              <div className="space-y-6 mt-6">
                <h2 className="text-xl font-bold text-gray-900">Configuración del Motor</h2>

                {engineSettings && (
                  <div className="space-y-6">
                    {/* Global Objective */}
                    <Card className="p-6 bg-white shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Objetivo Principal</h3>
                      <div className="flex flex-col gap-3 sm:flex-row">
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
                                ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            {obj.label}
                          </button>
                        ))}
                      </div>
                    </Card>

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
        </div>
      </div>
  );
}

