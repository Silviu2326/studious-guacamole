// Componente para la sección post-evento con mini resumen y acciones

import React from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Star, MessageSquare, BarChart3, Send, Settings, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { Evento } from '../api/events';
import { obtenerEncuestaPorEvento, calcularEstadisticasFeedback } from '../services/feedbackService';
import { Badge } from '../../../components/componentsreutilizables/Badge';

interface PostEventSectionProps {
  evento: Evento;
  onConfigurarEncuesta: () => void;
  onEnviarEncuesta: () => void;
  onVerFeedback: () => void;
  onVerAnalytics: () => void;
}

export const PostEventSection: React.FC<PostEventSectionProps> = ({
  evento,
  onConfigurarEncuesta,
  onEnviarEncuesta,
  onVerFeedback,
  onVerAnalytics,
}) => {
  const encuesta = obtenerEncuestaPorEvento(evento.id);
  const participantes = evento.participantesDetalle || [];
  const participantesActivos = participantes.filter(p => !p.fechaCancelacion);
  const totalParticipantes = participantesActivos.length;
  
  // Obtener estadísticas de feedback si existe encuesta
  let estadisticas = null;
  let tieneRespuestas = false;
  
  if (encuesta) {
    estadisticas = calcularEstadisticasFeedback(encuesta);
    tieneRespuestas = estadisticas.totalRespuestas > 0;
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-bold text-gray-900">Análisis Post-Evento</h3>
        </div>
        <Badge variant="success">Evento Finalizado</Badge>
      </div>

      {/* Mini resumen de métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-600" />
            <p className="text-xs text-gray-500">Participantes</p>
          </div>
          <p className="text-xl font-bold text-gray-900">{totalParticipantes}</p>
        </div>

        {estadisticas ? (
          <>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <p className="text-xs text-gray-500">Satisfacción</p>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {estadisticas.satisfaccionPromedio > 0 
                  ? estadisticas.satisfaccionPromedio.toFixed(1) 
                  : 'N/A'}
              </p>
            </div>

            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <p className="text-xs text-gray-500">Tasa Respuesta</p>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {estadisticas.tasaRespuesta.toFixed(1)}%
              </p>
            </div>

            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <p className="text-xs text-gray-500">Respuestas</p>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {estadisticas.totalRespuestas}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-500">Satisfacción</p>
              </div>
              <p className="text-sm text-gray-400">Sin datos</p>
            </div>

            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-500">Tasa Respuesta</p>
              </div>
              <p className="text-sm text-gray-400">Sin datos</p>
            </div>

            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-500">Respuestas</p>
              </div>
              <p className="text-sm text-gray-400">Sin datos</p>
            </div>
          </>
        )}
      </div>

      {/* Acciones post-evento */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Settings className="w-4 h-4" />
          <span className="font-medium">Gestión de Encuestas</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {!encuesta ? (
            <Button
              variant="primary"
              size="sm"
              onClick={onConfigurarEncuesta}
              iconLeft={<Settings className="w-4 h-4" />}
            >
              Configurar Encuesta
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={onConfigurarEncuesta}
                iconLeft={<Settings className="w-4 h-4" />}
              >
                {encuesta.estado === 'enviada' ? 'Revisar Encuesta' : 'Editar Encuesta'}
              </Button>
              
              {encuesta.estado === 'pendiente' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onEnviarEncuesta}
                  iconLeft={<Send className="w-4 h-4" />}
                >
                  Enviar Encuesta
                </Button>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mt-4 mb-3">
          <BarChart3 className="w-4 h-4" />
          <span className="font-medium">Análisis y Resultados</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {tieneRespuestas && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onVerFeedback}
              iconLeft={<Star className="w-4 h-4" />}
            >
              Ver Feedback Completo
            </Button>
          )}
          
          <Button
            variant="secondary"
            size="sm"
            onClick={onVerAnalytics}
            iconLeft={<BarChart3 className="w-4 h-4" />}
          >
            Ver Analytics
          </Button>
        </div>

        {encuesta && encuesta.estado === 'pendiente' && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Encuesta configurada:</strong> Lista para enviar a {totalParticipantes} participantes.
            </p>
          </div>
        )}

        {encuesta && encuesta.estado === 'enviada' && !tieneRespuestas && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Encuesta enviada:</strong> Esperando respuestas de los participantes.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

