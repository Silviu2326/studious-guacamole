import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { 
  MessageSquare, 
  Clock, 
  Smile, 
  Heart, 
  CheckCircle2, 
  XCircle,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Loader2,
  Send,
  Stomach,
  UtensilsCrossed,
  Reply,
  Edit,
} from 'lucide-react';
import type { FeedbackCliente, SugerenciaAjusteAutomatico, Comida, RespuestaFeedbackCliente } from '../types';
import { 
  getFeedbackCliente, 
  getSugerenciasAjusteAutomatico, 
  aplicarSugerenciaAjuste,
  getRespuestasFeedback,
  crearRespuestaFeedback,
  aplicarAjustePropuesto,
} from '../api/feedback';
import { useAuth } from '../../../context/AuthContext';

interface FeedbackClienteComidaProps {
  comida: Comida;
  dietaId: string;
  clienteId: string;
  onAjusteAplicado?: () => void;
}

export const FeedbackClienteComida: React.FC<FeedbackClienteComidaProps> = ({
  comida,
  dietaId,
  clienteId,
  onAjusteAplicado,
}) => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<FeedbackCliente | null>(null);
  const [sugerencias, setSugerencias] = useState<SugerenciaAjusteAutomatico[]>([]);
  const [respuestas, setRespuestas] = useState<RespuestaFeedbackCliente[]>([]);
  const [cargando, setCargando] = useState(false);
  const [cargandoSugerencias, setCargandoSugerencias] = useState(false);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [mostrarFormularioRespuesta, setMostrarFormularioRespuesta] = useState(false);
  const [respuestaTexto, setRespuestaTexto] = useState('');
  const [incluyeAjuste, setIncluyeAjuste] = useState(false);
  const [tipoAjuste, setTipoAjuste] = useState<'modificar-comida' | 'sustituir-comida' | 'ajustar-macros' | 'cambiar-horario' | 'otro'>('modificar-comida');
  const [descripcionAjuste, setDescripcionAjuste] = useState('');

  useEffect(() => {
    cargarFeedback();
  }, [comida.id, dietaId, clienteId]);

  const cargarFeedback = async () => {
    setCargando(true);
    try {
      const feedbacks = await getFeedbackCliente(dietaId, clienteId);
      const feedbackComida = feedbacks.find(f => f.comidaId === comida.id);
      setFeedback(feedbackComida || null);
      
      if (feedbackComida) {
        cargarSugerencias(feedbackComida.id);
        cargarRespuestas(feedbackComida.id);
      }
    } catch (error) {
      console.error('Error cargando feedback:', error);
    } finally {
      setCargando(false);
    }
  };

  const cargarRespuestas = async (feedbackId: string) => {
    try {
      const respuestasData = await getRespuestasFeedback(feedbackId);
      setRespuestas(respuestasData);
    } catch (error) {
      console.error('Error cargando respuestas:', error);
    }
  };

  const cargarSugerencias = async (feedbackId: string) => {
    setCargandoSugerencias(true);
    try {
      const sugerenciasData = await getSugerenciasAjusteAutomatico(feedbackId);
      setSugerencias(sugerenciasData);
    } catch (error) {
      console.error('Error cargando sugerencias:', error);
    } finally {
      setCargandoSugerencias(false);
    }
  };

  const handleAplicarSugerencia = async (sugerencia: SugerenciaAjusteAutomatico) => {
    try {
      await aplicarSugerenciaAjuste(sugerencia.id, dietaId);
      setSugerencias(prev => 
        prev.map(s => s.id === sugerencia.id ? { ...s, aplicada: true } : s)
      );
      onAjusteAplicado?.();
    } catch (error) {
      console.error('Error aplicando sugerencia:', error);
    }
  };

  const handleEnviarRespuesta = async () => {
    if (!feedback || !respuestaTexto.trim()) return;

    try {
      await crearRespuestaFeedback({
        feedbackId: feedback.id,
        dietaId,
        clienteId,
        contenido: respuestaTexto,
        incluyeAjuste,
        ajustePropuesto: incluyeAjuste ? {
          tipo: tipoAjuste,
          descripcion: descripcionAjuste,
          aplicado: false,
        } : undefined,
        creadoPor: user?.id || 'dietista-1',
        creadoPorNombre: user?.name || 'Dietista',
      });

      setRespuestaTexto('');
      setIncluyeAjuste(false);
      setDescripcionAjuste('');
      setMostrarFormularioRespuesta(false);
      await cargarRespuestas(feedback.id);
    } catch (error) {
      console.error('Error enviando respuesta:', error);
    }
  };

  const handleAplicarAjuste = async (respuestaId: string) => {
    try {
      await aplicarAjustePropuesto(respuestaId);
      await cargarRespuestas(feedback!.id);
      onAjusteAplicado?.();
    } catch (error) {
      console.error('Error aplicando ajuste:', error);
    }
  };

  const getIconoSensacion = (sensacion: number) => {
    if (sensacion >= 4) return <Smile className="h-5 w-5 text-green-500" />;
    if (sensacion >= 3) return <Smile className="h-5 w-5 text-yellow-500" />;
    return <Smile className="h-5 w-5 text-red-500" />;
  };

  const getColorSaciedad = (saciedad: number) => {
    if (saciedad >= 4) return 'text-green-600';
    if (saciedad >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getColorDigestion = (digestion?: number) => {
    if (!digestion) return 'text-gray-400';
    if (digestion >= 4) return 'text-green-600';
    if (digestion >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getColorGusto = (gusto?: number) => {
    if (!gusto) return 'text-gray-400';
    if (gusto >= 4) return 'text-green-600';
    if (gusto >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (cargando) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <span className="ml-2 text-sm text-gray-600">Cargando feedback...</span>
        </div>
      </Card>
    );
  }

  if (!feedback) {
    return (
      <Card className="p-4 border-dashed border-gray-300">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MessageSquare className="h-4 w-4" />
          <span>No hay feedback disponible para esta comida</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm text-gray-900">Feedback del Cliente</h4>
        <div className="flex items-center gap-2">
          {feedback.completada ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
          <span className="text-xs text-gray-500">
            {new Date(feedback.fecha).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Sensación */}
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
          <div className="mb-2">{getIconoSensacion(feedback.sensacion)}</div>
          <div className="text-xs text-gray-600 mb-1">Sensación</div>
          <div className="flex items-center gap-1">
            <span className="text-lg font-semibold text-gray-900">{feedback.sensacion}</span>
            <span className="text-xs text-gray-500">/5</span>
          </div>
        </div>

        {/* Saciedad */}
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
          <Heart className={`h-5 w-5 mb-2 ${getColorSaciedad(feedback.saciedad)}`} />
          <div className="text-xs text-gray-600 mb-1">Saciedad</div>
          <div className="flex items-center gap-1">
            <span className={`text-lg font-semibold ${getColorSaciedad(feedback.saciedad)}`}>
              {feedback.saciedad}
            </span>
            <span className="text-xs text-gray-500">/5</span>
          </div>
        </div>

        {/* Gusto */}
        {feedback.gusto !== undefined && (
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <UtensilsCrossed className={`h-5 w-5 mb-2 ${getColorGusto(feedback.gusto)}`} />
            <div className="text-xs text-gray-600 mb-1">Gusto</div>
            <div className="flex items-center gap-1">
              <span className={`text-lg font-semibold ${getColorGusto(feedback.gusto)}`}>
                {feedback.gusto}
              </span>
              <span className="text-xs text-gray-500">/5</span>
            </div>
          </div>
        )}

        {/* Digestión */}
        {feedback.digestion !== undefined && (
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <Stomach className={`h-5 w-5 mb-2 ${getColorDigestion(feedback.digestion)}`} />
            <div className="text-xs text-gray-600 mb-1">Digestión</div>
            <div className="flex items-center gap-1">
              <span className={`text-lg font-semibold ${getColorDigestion(feedback.digestion)}`}>
                {feedback.digestion}
              </span>
              <span className="text-xs text-gray-500">/5</span>
            </div>
          </div>
        )}

        {/* Tiempo Real */}
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
          <Clock className="h-5 w-5 mb-2 text-blue-500" />
          <div className="text-xs text-gray-600 mb-1">Tiempo Real</div>
          <div className="text-lg font-semibold text-gray-900">
            {feedback.tiempoRealConsumido} min
          </div>
        </div>
      </div>

      {/* Porcentaje consumido */}
      {feedback.porcentajeConsumido !== undefined && (
        <div>
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Porcentaje consumido</span>
            <span>{feedback.porcentajeConsumido}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                feedback.porcentajeConsumido >= 80
                  ? 'bg-green-500'
                  : feedback.porcentajeConsumido >= 50
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${feedback.porcentajeConsumido}%` }}
            />
          </div>
        </div>
      )}

      {/* Comentarios */}
      {feedback.comentarios && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-900">{feedback.comentarios}</p>
          </div>
        </div>
      )}

      {/* Respuestas del dietista */}
      {respuestas.length > 0 && (
        <div className="border-t pt-4">
          <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Reply className="h-4 w-4 text-blue-500" />
            Respuestas
          </h5>
          <div className="space-y-3">
            {respuestas.map((respuesta) => (
              <div
                key={respuesta.id}
                className="p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-900">
                        {respuesta.creadoPorNombre || 'Dietista'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(respuesta.creadoEn).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{respuesta.contenido}</p>
                    
                    {/* Ajuste propuesto */}
                    {respuesta.ajustePropuesto && (
                      <div className="mt-2 p-2 bg-white rounded border border-blue-300">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-blue-900">
                            Ajuste propuesto: {respuesta.ajustePropuesto.tipo.replace('-', ' ')}
                          </span>
                          {respuesta.ajustePropuesto.aplicado ? (
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                              Aplicado
                            </span>
                          ) : (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleAplicarAjuste(respuesta.id)}
                            >
                              Aplicar ajuste
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-gray-700">{respuesta.ajustePropuesto.descripcion}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulario de respuesta */}
      {mostrarFormularioRespuesta ? (
        <div className="border-t pt-4 space-y-3">
          <h5 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Reply className="h-4 w-4 text-blue-500" />
            Responder al feedback
          </h5>
          <textarea
            value={respuestaTexto}
            onChange={(e) => setRespuestaTexto(e.target.value)}
            placeholder="Escribe tu respuesta al cliente..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="incluirAjuste"
              checked={incluyeAjuste}
              onChange={(e) => setIncluyeAjuste(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="incluirAjuste" className="text-sm text-gray-700">
              Incluir ajuste propuesto
            </label>
          </div>

          {incluyeAjuste && (
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tipo de ajuste
                </label>
                <select
                  value={tipoAjuste}
                  onChange={(e) => setTipoAjuste(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="modificar-comida">Modificar comida</option>
                  <option value="sustituir-comida">Sustituir comida</option>
                  <option value="ajustar-macros">Ajustar macros</option>
                  <option value="cambiar-horario">Cambiar horario</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Descripción del ajuste
                </label>
                <textarea
                  value={descripcionAjuste}
                  onChange={(e) => setDescripcionAjuste(e.target.value)}
                  placeholder="Describe el ajuste que propones..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleEnviarRespuesta}
              disabled={!respuestaTexto.trim() || (incluyeAjuste && !descripcionAjuste.trim())}
            >
              <Send className="h-4 w-4 mr-1" />
              Enviar respuesta
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setMostrarFormularioRespuesta(false);
                setRespuestaTexto('');
                setIncluyeAjuste(false);
                setDescripcionAjuste('');
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-t pt-4">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setMostrarFormularioRespuesta(true)}
            className="w-full"
          >
            <Reply className="h-4 w-4 mr-1" />
            Responder al feedback
          </Button>
        </div>
      )}

      {/* Sugerencias de ajuste automático */}
      {sugerencias.length > 0 && (
        <div className="border-t pt-4">
          <button
            onClick={() => setMostrarSugerencias(!mostrarSugerencias)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <span className="text-sm font-semibold text-gray-900">
                Sugerencias de Ajuste Automático ({sugerencias.length})
              </span>
            </div>
            {mostrarSugerencias ? (
              <TrendingUp className="h-4 w-4 text-gray-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-gray-400" />
            )}
          </button>

          {mostrarSugerencias && (
            <div className="mt-3 space-y-2">
              {cargandoSugerencias ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                </div>
              ) : (
                sugerencias.map((sugerencia) => (
                  <div
                    key={sugerencia.id}
                    className={`p-3 rounded-lg border ${
                      sugerencia.aplicada
                        ? 'bg-green-50 border-green-200'
                        : 'bg-indigo-50 border-indigo-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-indigo-900">
                            {sugerencia.tipo === 'aumentar' ? 'Aumentar' : 
                             sugerencia.tipo === 'reducir' ? 'Reducir' :
                             sugerencia.tipo === 'sustituir' ? 'Sustituir' :
                             sugerencia.tipo === 'ajustar-horario' ? 'Ajustar horario' :
                             'Modificar cantidad'}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            sugerencia.impacto === 'alto'
                              ? 'bg-red-100 text-red-700'
                              : sugerencia.impacto === 'medio'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {sugerencia.impacto}
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 mb-1">{sugerencia.descripcion}</p>
                        <p className="text-xs text-gray-600 italic">{sugerencia.razon}</p>
                      </div>
                    </div>
                    {!sugerencia.aplicada && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() => handleAplicarSugerencia(sugerencia)}
                      >
                        {sugerencia.accion}
                      </Button>
                    )}
                    {sugerencia.aplicada && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-green-700">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Ajuste aplicado</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

