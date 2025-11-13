import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Moon,
  Activity,
  MessageSquare,
  Target,
  Loader2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import type { Dieta, DatosExternosCliente, FeedbackCliente } from '../types';
import { getDatosExternosCliente } from '../api/dietas';
import { getFeedbackCliente } from '../api/feedback';

interface Insight {
  id: string;
  tipo: 'adherencia' | 'feedback' | 'externo' | 'combinado';
  prioridad: 'alta' | 'media' | 'baja';
  titulo: string;
  descripcion: string;
  accion?: string;
  accionLabel?: string;
  icono: React.ReactNode;
  color: 'success' | 'warning' | 'error' | 'info';
}

interface AsistenteInteligentePanelProps {
  dieta: Dieta;
  onAccion?: (insightId: string, accion: string) => void;
}

export const AsistenteInteligentePanel: React.FC<AsistenteInteligentePanelProps> = ({
  dieta,
  onAccion,
}) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [cargando, setCargando] = useState(true);
  const [datosExternos, setDatosExternos] = useState<DatosExternosCliente | null>(null);
  const [feedback, setFeedback] = useState<FeedbackCliente[]>([]);

  useEffect(() => {
    cargarDatos();
  }, [dieta.id, dieta.clienteId]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      let externos: DatosExternosCliente | null = null;
      let feedbacks: FeedbackCliente[] = [];

      // Cargar datos externos
      if (dieta.clienteId) {
        externos = await getDatosExternosCliente(dieta.clienteId);
        setDatosExternos(externos);

        // Cargar feedback
        feedbacks = await getFeedbackCliente(dieta.id, dieta.clienteId);
        setFeedback(feedbacks);
      }

      // Generar insights con los datos cargados
      generarInsightsConDatos(externos, feedbacks);
    } catch (error) {
      console.error('Error cargando datos para asistente:', error);
    } finally {
      setCargando(false);
    }
  };

  const generarInsightsConDatos = (
    externos: DatosExternosCliente | null,
    feedbacks: FeedbackCliente[]
  ) => {
    const nuevosInsights: Insight[] = [];

    // 1. Insights de adherencia
    if (dieta.adherencia !== undefined) {
      if (dieta.adherencia < 70) {
        nuevosInsights.push({
          id: 'adherencia-baja',
          tipo: 'adherencia',
          prioridad: 'alta',
          titulo: 'Adherencia Baja Detectada',
          descripcion: `La adherencia actual es del ${dieta.adherencia}%, lo cual está por debajo del objetivo recomendado (80%+). Esto puede afectar los resultados del cliente.`,
          accion: 'revisar-dieta',
          accionLabel: 'Revisar y Ajustar Dieta',
          icono: <AlertTriangle className="w-5 h-5" />,
          color: 'error',
        });
      } else if (dieta.adherencia >= 80) {
        nuevosInsights.push({
          id: 'adherencia-excelente',
          tipo: 'adherencia',
          prioridad: 'baja',
          titulo: 'Excelente Adherencia',
          descripcion: `El cliente mantiene una adherencia del ${dieta.adherencia}%, lo cual es excelente. Considera mantener el plan actual o ajustar objetivos si es necesario.`,
          icono: <CheckCircle2 className="w-5 h-5" />,
          color: 'success',
        });
      }
    }

    // 2. Insights de feedback
    if (feedbacks.length > 0) {
      const feedbackPromedio = feedbacks.reduce((acc, f) => acc + f.sensacion, 0) / feedbacks.length;
      const saciedadPromedio = feedbacks.reduce((acc, f) => acc + f.saciedad, 0) / feedbacks.length;

      if (saciedadPromedio < 3) {
        nuevosInsights.push({
          id: 'saciedad-baja',
          tipo: 'feedback',
          prioridad: 'alta',
          titulo: 'Baja Saciedad Reportada',
          descripcion: `El cliente reporta baja saciedad (${saciedadPromedio.toFixed(1)}/5) en varias comidas. Considera aumentar proteínas o fibra para mejorar la sensación de saciedad.`,
          accion: 'aumentar-saciedad',
          accionLabel: 'Ajustar para Mejorar Saciedad',
          icono: <Target className="w-5 h-5" />,
          color: 'warning',
        });
      }

      if (feedbackPromedio < 3) {
        nuevosInsights.push({
          id: 'satisfaccion-baja',
          tipo: 'feedback',
          prioridad: 'media',
          titulo: 'Satisfacción Mejorable',
          descripcion: `La satisfacción promedio con las comidas es ${feedbackPromedio.toFixed(1)}/5. Considera variar recetas o ajustar preferencias del cliente.`,
          accion: 'variar-recetas',
          accionLabel: 'Ver Sugerencias de Variación',
          icono: <MessageSquare className="w-5 h-5" />,
          color: 'warning',
        });
      }

      // Feedback positivo
      if (feedbackPromedio >= 4 && saciedadPromedio >= 4) {
        nuevosInsights.push({
          id: 'feedback-positivo',
          tipo: 'feedback',
          prioridad: 'baja',
          titulo: 'Feedback Muy Positivo',
          descripcion: `El cliente está muy satisfecho con las comidas (${feedbackPromedio.toFixed(1)}/5) y reporta buena saciedad (${saciedadPromedio.toFixed(1)}/5).`,
          icono: <CheckCircle2 className="w-5 h-5" />,
          color: 'success',
        });
      }
    }

    // 3. Insights de datos externos
    if (externos) {
      // Sueño
      if (externos.sueño) {
        if (externos.sueño.calidad === 'poor' || externos.sueño.horasSueño < 6) {
          nuevosInsights.push({
            id: 'sueño-pobre',
            tipo: 'externo',
            prioridad: 'alta',
            titulo: 'Calidad de Sueño Baja',
            descripcion: `El cliente reporta ${externos.sueño.horasSueño.toFixed(1)}h de sueño con calidad ${externos.sueño.calidad === 'poor' ? 'pobre' : 'regular'}. El sueño afecta el apetito y la adherencia. Considera ajustar horarios de comidas o recomendar alimentos que favorezcan el sueño.`,
            accion: 'ajustar-horarios',
            accionLabel: 'Ver Recomendaciones de Sueño',
            icono: <Moon className="w-5 h-5" />,
            color: 'warning',
          });
        }
      }

      // Estrés
      if (externos.estres) {
        if (externos.estres.nivel > 60) {
          nuevosInsights.push({
            id: 'estres-alto',
            tipo: 'externo',
            prioridad: 'alta',
            titulo: 'Nivel de Estrés Elevado',
            descripcion: `El cliente tiene un nivel de estrés alto (${externos.estres.nivel}/100). El estrés puede afectar el apetito, la elección de alimentos y la adherencia. Considera alimentos ricos en magnesio y adaptar la dieta para reducir el estrés.`,
            accion: 'dieta-antiestres',
            accionLabel: 'Ver Alimentos Anti-Estrés',
            icono: <AlertTriangle className="w-5 h-5" />,
            color: 'error',
          });
        } else if (externos.estres.nivel < 30) {
          nuevosInsights.push({
            id: 'estres-bajo',
            tipo: 'externo',
            prioridad: 'baja',
            titulo: 'Nivel de Estrés Controlado',
            descripcion: `El cliente mantiene un nivel de estrés bajo (${externos.estres.nivel}/100), lo cual favorece la adherencia y los resultados.`,
            icono: <CheckCircle2 className="w-5 h-5" />,
            color: 'success',
          });
        }
      }

      // Actividad
      if (externos.actividad) {
        if (externos.actividad.entrenamientos > 2) {
          nuevosInsights.push({
            id: 'actividad-alta',
            tipo: 'externo',
            prioridad: 'media',
            titulo: 'Alta Actividad Física',
            descripcion: `El cliente realiza ${externos.actividad.entrenamientos} entrenamientos esta semana. Considera ajustar las calorías o carbohidratos post-entreno para optimizar la recuperación.`,
            accion: 'ajustar-post-entreno',
            accionLabel: 'Ajustar Nutrición Post-Entreno',
            icono: <Activity className="w-5 h-5" />,
            color: 'info',
          });
        }
      }
    }

    // 4. Insights combinados
    if (externos && feedbacks.length > 0) {
      const estresAlto = externos.estres && externos.estres.nivel > 60;
      const adherenciaBaja = dieta.adherencia !== undefined && dieta.adherencia < 70;
      const saciedadBaja = feedbacks.reduce((acc, f) => acc + f.saciedad, 0) / feedbacks.length < 3;

      if (estresAlto && adherenciaBaja) {
        nuevosInsights.push({
          id: 'estres-adherencia',
          tipo: 'combinado',
          prioridad: 'alta',
          titulo: 'Estrés y Adherencia: Intervención Necesaria',
          descripcion: 'El alto nivel de estrés está correlacionado con baja adherencia. Considera una estrategia integral: ajustar la dieta para reducir estrés, simplificar el plan y aumentar el apoyo al cliente.',
          accion: 'estrategia-integral',
          accionLabel: 'Ver Estrategia Recomendada',
          icono: <Brain className="w-5 h-5" />,
          color: 'error',
        });
      }

      if (saciedadBaja && externos.actividad && externos.actividad.entrenamientos > 2) {
        nuevosInsights.push({
          id: 'actividad-saciedad',
          tipo: 'combinado',
          prioridad: 'media',
          titulo: 'Ajuste Necesario: Actividad y Saciedad',
          descripcion: 'El cliente tiene alta actividad física pero reporta baja saciedad. Considera aumentar proteínas y carbohidratos complejos para mejorar la recuperación y saciedad.',
          accion: 'ajustar-macros-actividad',
          accionLabel: 'Ajustar Macros',
          icono: <Target className="w-5 h-5" />,
          color: 'warning',
        });
      }
    }

    // Ordenar por prioridad
    const ordenPrioridad = { alta: 0, media: 1, baja: 2 };
    nuevosInsights.sort((a, b) => ordenPrioridad[a.prioridad] - ordenPrioridad[b.prioridad]);

    setInsights(nuevosInsights);
  };

  const getColorClasses = (color: Insight['color']) => {
    switch (color) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getBadgeColor = (prioridad: Insight['prioridad']) => {
    switch (prioridad) {
      case 'alta':
        return 'bg-red-100 text-red-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'baja':
        return 'bg-green-100 text-green-800';
    }
  };

  if (cargando) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-sm text-gray-600">Analizando datos...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Brain className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Asistente Inteligente</h3>
          <p className="text-sm text-gray-600">Insights basados en adherencia, feedback y datos externos</p>
        </div>
      </div>

      {insights.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-sm text-gray-600">
            No hay insights críticos en este momento. Todo parece estar en orden.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border ${getColorClasses(insight.color)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {insight.icono}
                  <h4 className="font-semibold text-sm">{insight.titulo}</h4>
                </div>
                <Badge className={getBadgeColor(insight.prioridad)}>
                  {insight.prioridad}
                </Badge>
              </div>
              <p className="text-sm mb-3 opacity-90">{insight.descripcion}</p>
              {insight.accion && insight.accionLabel && (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => onAccion?.(insight.id, insight.accion!)}
                >
                  {insight.accionLabel}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Resumen de datos analizados */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {dieta.adherencia !== undefined ? `${dieta.adherencia}%` : 'N/A'}
            </div>
            <div className="text-xs text-gray-600">Adherencia</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{feedback.length}</div>
            <div className="text-xs text-gray-600">Feedbacks</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {datosExternos ? '✓' : '✗'}
            </div>
            <div className="text-xs text-gray-600">Datos Externos</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

