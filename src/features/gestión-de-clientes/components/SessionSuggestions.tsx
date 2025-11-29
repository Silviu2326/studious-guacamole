import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import {
  generateSessionSuggestions,
  getSessionSuggestions,
  acceptSuggestion,
  rejectSuggestion,
  getSuggestionConfig,
  updateSuggestionConfig,
} from '../api/session-suggestions';
import {
  SessionSuggestion,
  SessionSuggestionResponse,
  SessionSuggestionConfig,
} from '../types/session-suggestions';
import {
  Lightbulb,
  CheckCircle,
  XCircle,
  Zap,
  Clock,
  Target,
  TrendingUp,
  Activity,
  Settings,
  RefreshCw,
  Loader2,
  AlertCircle,
  Dumbbell,
  Calendar,
  Info,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface SessionSuggestionsProps {
  clienteId: string;
  onSuggestionAccepted?: (suggestion: SessionSuggestion) => void;
}

export const SessionSuggestions: React.FC<SessionSuggestionsProps> = ({
  clienteId,
  onSuggestionAccepted,
}) => {
  const { user } = useAuth();
  const [suggestionsData, setSuggestionsData] = useState<SessionSuggestionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<SessionSuggestionConfig | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadSuggestions();
      loadConfig();
    }
  }, [clienteId, user?.id]);

  const loadSuggestions = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const data = await generateSessionSuggestions(clienteId, user.id);
      setSuggestionsData(data);
    } catch (error) {
      console.error('Error cargando sugerencias:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConfig = async () => {
    if (!user?.id) return;

    try {
      const configData = await getSuggestionConfig(user.id);
      setConfig(configData);
    } catch (error) {
      console.error('Error cargando configuración:', error);
    }
  };

  const handleAccept = async (suggestion: SessionSuggestion) => {
    try {
      await acceptSuggestion(suggestion.id, clienteId);
      onSuggestionAccepted?.(suggestion);
      await loadSuggestions(); // Recargar sugerencias
    } catch (error) {
      console.error('Error aceptando sugerencia:', error);
    }
  };

  const handleReject = async (suggestion: SessionSuggestion) => {
    try {
      await rejectSuggestion(suggestion.id, clienteId);
      await loadSuggestions(); // Recargar sugerencias
    } catch (error) {
      console.error('Error rechazando sugerencia:', error);
    }
  };

  const handleUpdateConfig = async (updates: Partial<SessionSuggestionConfig>) => {
    if (!user?.id) return;

    try {
      const updatedConfig = await updateSuggestionConfig(user.id, updates);
      setConfig(updatedConfig);
      await loadSuggestions(); // Recargar sugerencias con nueva configuración
    } catch (error) {
      console.error('Error actualizando configuración:', error);
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Generando sugerencias...</p>
      </Card>
    );
  }

  if (!suggestionsData || !config) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-600">No se pudieron cargar las sugerencias</p>
      </Card>
    );
  }

  const { sugerencias, factores, resumen } = suggestionsData;

  // Si las sugerencias automáticas están desactivadas
  if (!config.activarSugerenciasAutomaticas) {
    return (
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            <h3 className="text-xl font-bold text-gray-900">Sugerencias de Sesiones</h3>
          </div>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800 mb-3">
            Las sugerencias automáticas están desactivadas. Actívalas en la configuración para recibir sugerencias inteligentes de sesiones.
          </p>
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleUpdateConfig({ activarSugerenciasAutomaticas: true })}
          >
            Activar Sugerencias
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lightbulb className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Sugerencias Automáticas de Sesiones</h3>
              <p className="text-sm text-gray-600">Sesiones ideales basadas en progreso y objetivos</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowConfig(!showConfig)}
              leftIcon={<Settings size={16} />}
            >
              Configuración
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={loadSuggestions}
              leftIcon={<RefreshCw size={16} />}
            >
              Actualizar
            </Button>
          </div>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-white rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{resumen.totalSugerencias}</p>
            <p className="text-xs text-gray-600">Total sugerencias</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <p className="text-2xl font-bold text-orange-600">{resumen.prioridadAlta}</p>
            <p className="text-xs text-gray-600">Prioridad alta</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <p className="text-2xl font-bold text-green-600">{Math.round(factores.progreso.tendencia === 'mejorando' ? 85 : 70)}%</p>
            <p className="text-xs text-gray-600">Confianza promedio</p>
          </div>
        </div>
      </Card>

      {/* Configuración */}
      {showConfig && (
        <Card className="p-6 bg-white shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuración de Sugerencias
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Sugerencias automáticas</p>
                <p className="text-xs text-gray-600">Generar sugerencias automáticamente</p>
              </div>
              <Button
                size="sm"
                variant={config.activarSugerenciasAutomaticas ? 'primary' : 'secondary'}
                onClick={() => handleUpdateConfig({ activarSugerenciasAutomaticas: !config.activarSugerenciasAutomaticas })}
              >
                {config.activarSugerenciasAutomaticas ? 'Activado' : 'Desactivado'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Considerar progreso</p>
                <p className="text-xs text-gray-600">Incluir progreso en las sugerencias</p>
              </div>
              <Button
                size="sm"
                variant={config.considerarProgreso ? 'primary' : 'secondary'}
                onClick={() => handleUpdateConfig({ considerarProgreso: !config.considerarProgreso })}
              >
                {config.considerarProgreso ? 'Sí' : 'No'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Considerar descanso</p>
                <p className="text-xs text-gray-600">Incluir días de descanso en las sugerencias</p>
              </div>
              <Button
                size="sm"
                variant={config.considerarDescanso ? 'primary' : 'secondary'}
                onClick={() => handleUpdateConfig({ considerarDescanso: !config.considerarDescanso })}
              >
                {config.considerarDescanso ? 'Sí' : 'No'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Sugerencias */}
      {sugerencias.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Sparkles className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-2">No hay sugerencias disponibles en este momento</p>
          <p className="text-xs text-gray-500">
            Las sugerencias se generan automáticamente basándose en el progreso y objetivos del cliente
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {sugerencias.map((suggestion) => (
            <Card key={suggestion.id} variant="hover" className="p-6 bg-white shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge
                      variant={
                        suggestion.prioridad === 'alta'
                          ? 'red'
                          : suggestion.prioridad === 'media'
                          ? 'yellow'
                          : 'blue'
                      }
                      size="sm"
                    >
                      {suggestion.prioridad.toUpperCase()}
                    </Badge>
                    <Badge variant="blue" size="sm">
                      {suggestion.tipo.charAt(0).toUpperCase() + suggestion.tipo.slice(1)}
                    </Badge>
                    <Badge variant="green" size="sm">
                      {suggestion.confianza}% confianza
                    </Badge>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{suggestion.nombre}</h4>
                  <p className="text-sm text-gray-600 mb-3">{suggestion.descripcion}</p>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{suggestion.duracionMinutos} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {new Date(suggestion.fechaSugerida).toLocaleDateString('es-ES', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg mb-3">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 mb-1">¿Por qué esta sesión?</p>
                        <p className="text-xs text-blue-800">{suggestion.razon}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Factores que influyeron */}
              {suggestion.factores.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Factores considerados:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestion.factores.map((factor, idx) => (
                      <Badge
                        key={idx}
                        variant={
                          factor.impacto === 'alto' ? 'red' : factor.impacto === 'medio' ? 'yellow' : 'blue'
                        }
                        size="sm"
                      >
                        {factor.descripcion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Ejercicios */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Ejercicios sugeridos:</p>
                <div className="space-y-2">
                  {suggestion.ejercicios.slice(0, 3).map((ejercicio, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <Dumbbell className="w-3 h-3 text-gray-400" />
                      <span>
                        {ejercicio.nombre}
                        {ejercicio.series && ` - ${ejercicio.series}x${ejercicio.repeticiones || '?'}`}
                        {ejercicio.duracion && ` - ${ejercicio.duracion} min`}
                        {ejercicio.notas && ` (${ejercicio.notas})`}
                      </span>
                    </div>
                  ))}
                  {suggestion.ejercicios.length > 3 && (
                    <p className="text-xs text-gray-500">
                      +{suggestion.ejercicios.length - 3} ejercicios más
                    </p>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleAccept(suggestion)}
                  leftIcon={<CheckCircle size={16} />}
                >
                  Aceptar Sugerencia
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleReject(suggestion)}
                  leftIcon={<XCircle size={16} />}
                >
                  Rechazar
                </Button>
                <div className="flex-1" />
                <Button size="sm" variant="secondary" leftIcon={<Activity size={16} />}>
                  Ver Detalles
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Información de factores */}
      <Card className="p-6 bg-gray-50 border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Factores Analizados
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <p className="text-gray-600 mb-1">Última sesión</p>
            <p className="font-semibold text-gray-900">
              {factores.ultimaSesion
                ? `${factores.descanso.diasDesdeUltimaSesion} días atrás`
                : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Sesiones esta semana</p>
            <p className="font-semibold text-gray-900">
              {factores.frecuencia.sesionesEstaSemana}/{factores.frecuencia.sesionesObjetivoSemana}
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Progreso</p>
            <p className="font-semibold text-gray-900 capitalize">{factores.progreso.tendencia}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Objetivos activos</p>
            <p className="font-semibold text-gray-900">{factores.objetivos.length}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

