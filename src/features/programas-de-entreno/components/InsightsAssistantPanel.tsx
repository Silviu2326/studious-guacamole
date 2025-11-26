import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import {
  Brain,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Loader2,
  RefreshCw,
  Info,
  Target,
  Activity,
  Calendar,
  Users,
  BarChart3,
  ArrowRight,
  X,
} from 'lucide-react';
import type {
  DayPlan,
  DaySession,
  ContextoCliente,
  ResumenObjetivosProgreso,
  TimelineSesiones,
  DatosSueño,
  DatosMeteorologicos,
  FeedbackCliente,
} from '../types';
import * as datosExternosApi from '../api/datos-externos';

interface Insight {
  id: string;
  tipo: 'oportunidad' | 'alerta' | 'logro' | 'recomendacion' | 'tendencia';
  prioridad: 'alta' | 'media' | 'baja';
  titulo: string;
  descripcion: string;
  contexto: string;
  accion?: {
    tipo: string;
    label: string;
    detalle?: string;
  };
  metricas?: {
    nombre: string;
    valor: string | number;
    unidad?: string;
    tendencia?: 'up' | 'down' | 'neutral';
  }[];
  relevancia: number; // 0-100
  timestamp: Date;
}

interface InsightsAssistantPanelProps {
  weeklyPlan: Record<string, DayPlan>;
  weekDays: readonly string[];
  contextoCliente?: ContextoCliente;
  objetivosProgreso?: ResumenObjetivosProgreso;
  timelineSesiones?: TimelineSesiones;
  weeklyTargets?: {
    duration: number;
    calories: number;
  };
  clienteId?: string; // Para obtener feedback y datos externos
  onInsightAction?: (insightId: string, action: Insight['accion']) => void;
  autoRefresh?: boolean;
  refreshInterval?: number; // en milisegundos
}

export const InsightsAssistantPanel: React.FC<InsightsAssistantPanelProps> = ({
  weeklyPlan,
  weekDays,
  contextoCliente,
  objetivosProgreso,
  timelineSesiones,
  weeklyTargets,
  clienteId,
  onInsightAction,
  autoRefresh = true,
  refreshInterval = 30000, // 30 segundos por defecto
}) => {
  const [datosSueño, setDatosSueño] = useState<DatosSueño[]>([]);
  const [datosMeteorologicos, setDatosMeteorologicos] = useState<DatosMeteorologicos[]>([]);
  const [feedbackCliente, setFeedbackCliente] = useState<FeedbackCliente[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [dismissedInsights, setDismissedInsights] = useState<Set<string>>(new Set());

  useEffect(() => {
    cargarDatosExternos();
  }, [clienteId]);

  useEffect(() => {
    generateInsights();
  }, [weeklyPlan, contextoCliente, objetivosProgreso, timelineSesiones, weeklyTargets, datosSueño, datosMeteorologicos, feedbackCliente]);

  const cargarDatosExternos = async () => {
    if (!clienteId) return;

    try {
      const [sueño, meteorologia, feedback] = await Promise.all([
        datosExternosApi.obtenerDatosSueño(clienteId, 7), // Últimos 7 días
        datosExternosApi.obtenerDatosMeteorologicos(undefined, 7),
        datosExternosApi.obtenerFeedbackCliente(clienteId, 7),
      ]);

      setDatosSueño(sueño);
      setDatosMeteorologicos(meteorologia);
      setFeedbackCliente(feedback);
    } catch (error) {
      console.error('Error cargando datos externos:', error);
    }
  };

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      generateInsights();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, weeklyPlan, contextoCliente, objetivosProgreso, timelineSesiones, datosSueño, datosMeteorologicos, feedbackCliente]);

  const generateInsights = async () => {
    setLoading(true);
    try {
      // Simular análisis de IA (en producción sería una llamada a API)
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));
      
      const newInsights = analyzePlanAndClientData(
        weeklyPlan,
        weekDays,
        contextoCliente,
        objetivosProgreso,
        timelineSesiones,
        weeklyTargets,
        datosSueño,
        datosMeteorologicos,
        feedbackCliente
      );
      
      // Filtrar insights descartados
      const filteredInsights = newInsights.filter(
        (insight) => !dismissedInsights.has(insight.id)
      );
      
      setInsights(filteredInsights);
    } catch (error) {
      console.error('Error generando insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzePlanAndClientData = (
    plan: Record<string, DayPlan>,
    days: readonly string[],
    contexto?: ContextoCliente,
    objetivos?: ResumenObjetivosProgreso,
    timeline?: TimelineSesiones,
    targets?: { duration: number; calories: number },
    sueno?: DatosSueño[],
    meteorologia?: DatosMeteorologicos[],
    feedback?: FeedbackCliente[]
  ): Insight[] => {
    const insights: Insight[] = [];

    // 1. Análisis de distribución de volumen por grupos musculares
    const volumenPorGrupo: Record<string, { series: number; dias: Set<string> }> = {};
    const gruposMusculares: Set<string> = new Set();

    days.forEach((day) => {
      const dayPlan = plan[day];
      dayPlan?.sessions.forEach((session) => {
        if (session.gruposMusculares) {
          session.gruposMusculares.forEach((grupo) => {
            gruposMusculares.add(grupo);
            if (!volumenPorGrupo[grupo]) {
              volumenPorGrupo[grupo] = { series: 0, dias: new Set() };
            }
            volumenPorGrupo[grupo].series += session.series || 0;
            volumenPorGrupo[grupo].dias.add(day);
          });
        }
      });
    });

    // Detectar grupos musculares subdesarrollados
    const volumenes = Object.values(volumenPorGrupo).map(v => v.series);
    if (volumenes.length > 0) {
      const promedioVolumen = volumenes.reduce((a, b) => a + b, 0) / volumenes.length;
      const gruposBajos = Object.entries(volumenPorGrupo).filter(
        ([_, v]) => v.series < promedioVolumen * 0.7
      );

      gruposBajos.forEach(([grupo, data]) => {
        insights.push({
          id: `insight-volumen-${grupo}`,
          tipo: 'oportunidad',
          prioridad: 'media',
          titulo: `Oportunidad: Aumentar volumen de ${grupo}`,
          descripcion: `El grupo muscular ${grupo} tiene ${data.series} series/semana, por debajo del promedio. Para hipertrofia equilibrada, considera aumentar a al menos ${Math.ceil(promedioVolumen * 0.8)} series.`,
          contexto: `Distribución actual: ${data.series} series en ${data.dias.size} día(s). Promedio semanal: ${promedioVolumen.toFixed(1)} series por grupo.`,
          accion: {
            tipo: 'aumentar_volumen_grupo',
            label: 'Ver ejercicios recomendados',
            detalle: `Aumentar series de ${grupo}`,
          },
          metricas: [
            {
              nombre: 'Series actuales',
              valor: data.series,
              unidad: 'series/semana',
              tendencia: 'down',
            },
            {
              nombre: 'Recomendado',
              valor: Math.ceil(promedioVolumen * 0.8),
              unidad: 'series/semana',
            },
          ],
          relevancia: 75,
          timestamp: new Date(),
        });
      });
    }

    // 2. Análisis de objetivos del cliente
    if (objetivos) {
      const objetivosEnRiesgo = objetivos.objetivos.filter(
        (o) => o.estado === 'at_risk' || (o.estado === 'in_progress' && o.progreso < 30)
      );

      objetivosEnRiesgo.forEach((objetivo) => {
        insights.push({
          id: `insight-objetivo-${objetivo.id}`,
          tipo: 'alerta',
          prioridad: objetivo.estado === 'at_risk' ? 'alta' : 'media',
          titulo: `Objetivo en riesgo: ${objetivo.titulo}`,
          descripcion: `El objetivo "${objetivo.titulo}" tiene un progreso del ${objetivo.progreso}% y está ${objetivo.estado === 'at_risk' ? 'en riesgo' : 'por debajo del esperado'}. Considera ajustar el plan de entrenamiento.`,
          contexto: `Objetivo: ${objetivo.valorObjetivo} ${objetivo.unidad}. Actual: ${objetivo.valorActual} ${objetivo.unidad}. Fecha límite: ${new Date(objetivo.fechaLimite).toLocaleDateString('es-ES')}.`,
          accion: {
            tipo: 'revisar_objetivo',
            label: 'Revisar plan para este objetivo',
            detalle: `Ajustar plan para ${objetivo.titulo}`,
          },
          metricas: [
            {
              nombre: 'Progreso',
              valor: objetivo.progreso,
              unidad: '%',
              tendencia: objetivo.progreso < 30 ? 'down' : 'neutral',
            },
            {
              nombre: 'Días restantes',
              valor: Math.ceil(
                (new Date(objetivo.fechaLimite).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              ),
              unidad: 'días',
            },
          ],
          relevancia: objetivo.estado === 'at_risk' ? 95 : 70,
          timestamp: new Date(),
        });
      });

      // Objetivos con buen progreso
      const objetivosDestacados = objetivos.objetivos.filter(
        (o) => o.estado === 'in_progress' && o.progreso >= 70
      );

      if (objetivosDestacados.length > 0) {
        insights.push({
          id: 'insight-logro-objetivos',
          tipo: 'logro',
          prioridad: 'baja',
          titulo: `¡Excelente progreso en ${objetivosDestacados.length} objetivo(s)!`,
          descripcion: `El cliente está mostrando un progreso destacado en ${objetivosDestacados.length} objetivo(s). Considera celebrar estos logros y ajustar los objetivos si es necesario.`,
          contexto: objetivosDestacados.map(o => `${o.titulo} (${o.progreso}%)`).join(', '),
          metricas: objetivosDestacados.map((o) => ({
            nombre: o.titulo,
            valor: o.progreso,
            unidad: '%',
            tendencia: 'up' as const,
          })),
          relevancia: 60,
          timestamp: new Date(),
        });
      }
    }

    // 3. Análisis de adherencia y patrones
    if (timeline) {
      const adherencia = timeline.resumen.promedioAdherencia;
      
      if (adherencia < 70) {
        insights.push({
          id: 'insight-adherencia-baja',
          tipo: 'alerta',
          prioridad: 'alta',
          titulo: 'Adherencia por debajo del objetivo',
          descripcion: `La adherencia del cliente es del ${adherencia}%, por debajo del objetivo recomendado (70%+). Considera ajustar la dificultad o frecuencia del plan.`,
          contexto: `Sesiones completadas: ${timeline.resumen.sesionesCompletadas} de ${timeline.resumen.totalSesiones}. Última sesión: ${timeline.resumen.ultimaSesion ? new Date(timeline.resumen.ultimaSesion).toLocaleDateString('es-ES') : 'N/A'}.`,
          accion: {
            tipo: 'revisar_adherencia',
            label: 'Analizar causas de baja adherencia',
            detalle: 'Revisar plan y ajustar según necesidades del cliente',
          },
          metricas: [
            {
              nombre: 'Adherencia',
              valor: adherencia,
              unidad: '%',
              tendencia: 'down',
            },
            {
              nombre: 'Sesiones completadas',
              valor: timeline.resumen.sesionesCompletadas,
              unidad: 'sesiones',
            },
          ],
          relevancia: 90,
          timestamp: new Date(),
        });
      }

      // Patrones detectados
      if (timeline.resumen.patronesDetectados && timeline.resumen.patronesDetectados.length > 0) {
        timeline.resumen.patronesDetectados.forEach((patron, idx) => {
          if (patron.severidad === 'alta') {
            insights.push({
              id: `insight-patron-${idx}`,
              tipo: patron.tipo === 'riesgo' ? 'alerta' : 'recomendacion',
              prioridad: 'alta',
              titulo: `Patrón detectado: ${patron.descripcion}`,
              descripcion: `Se ha detectado un patrón de ${patron.tipo} que requiere atención. ${patron.descripcion}`,
              contexto: `Severidad: ${patron.severidad}. Basado en análisis de ${timeline.resumen.totalSesiones} sesiones.`,
              accion: {
                tipo: 'revisar_patron',
                label: 'Ver detalles del patrón',
                detalle: `Analizar patrón de ${patron.tipo}`,
              },
              relevancia: 85,
              timestamp: new Date(),
            });
          }
        });
      }
    }

    // 4. Análisis de objetivos semanales
    if (targets) {
      const totalDuration = days.reduce((sum, day) => {
        const dayPlan = plan[day];
        return sum + (dayPlan?.sessions.reduce((acc, s) => {
          const match = s.duration.match(/\d+/);
          return acc + (match ? Number(match[0]) : 0);
        }, 0) || 0);
      }, 0);

      const totalCalories = Math.round(totalDuration * 8);
      const diferenciaDuracion = totalDuration - targets.duration;
      const diferenciaCalorias = totalCalories - targets.calories;

      if (Math.abs(diferenciaDuracion) > targets.duration * 0.1) {
        insights.push({
          id: 'insight-duracion-semanal',
          tipo: diferenciaDuracion > 0 ? 'alerta' : 'recomendacion',
          prioridad: Math.abs(diferenciaDuracion) > targets.duration * 0.2 ? 'alta' : 'media',
          titulo: diferenciaDuracion > 0 
            ? 'Duración semanal excede el objetivo'
            : 'Duración semanal por debajo del objetivo',
          descripcion: diferenciaDuracion > 0
            ? `La duración total semanal (${totalDuration} min) excede el objetivo (${targets.duration} min) en ${diferenciaDuracion} minutos. Considera redistribuir o reducir algunas sesiones.`
            : `La duración total semanal (${totalDuration} min) está por debajo del objetivo (${targets.duration} min) en ${Math.abs(diferenciaDuracion)} minutos. Considera añadir más sesiones o aumentar la duración.`,
          contexto: `Objetivo: ${targets.duration} min. Actual: ${totalDuration} min. Diferencia: ${diferenciaDuracion > 0 ? '+' : ''}${diferenciaDuracion} min.`,
          metricas: [
            {
              nombre: 'Duración actual',
              valor: totalDuration,
              unidad: 'min',
              tendencia: diferenciaDuracion > 0 ? 'up' : 'down',
            },
            {
              nombre: 'Objetivo',
              valor: targets.duration,
              unidad: 'min',
            },
          ],
          relevancia: 80,
          timestamp: new Date(),
        });
      }
    }

    // 5. Análisis de lesiones y restricciones
    if (contexto && contexto.lesiones.some(l => l.estado === 'activa')) {
      const lesionesActivas = contexto.lesiones.filter(l => l.estado === 'activa');
      const gruposAfectados = new Set<string>();

      lesionesActivas.forEach(lesion => {
        if (lesion.ubicacion.toLowerCase().includes('rodilla')) gruposAfectados.add('piernas');
        if (lesion.ubicacion.toLowerCase().includes('hombro')) gruposAfectados.add('hombros');
        if (lesion.ubicacion.toLowerCase().includes('espalda') || lesion.ubicacion.toLowerCase().includes('lumbar')) {
          gruposAfectados.add('espalda');
        }
      });

      // Verificar si hay ejercicios de riesgo en el plan
      let ejerciciosRiesgo = 0;
      days.forEach((day) => {
        const dayPlan = plan[day];
        dayPlan?.sessions.forEach((session) => {
          if (session.gruposMusculares) {
            session.gruposMusculares.forEach((grupo) => {
              if (gruposAfectados.has(grupo)) {
                ejerciciosRiesgo++;
              }
            });
          }
        });
      });

      if (ejerciciosRiesgo > 0) {
        insights.push({
          id: 'insight-lesiones-activas',
          tipo: 'alerta',
          prioridad: 'alta',
          titulo: `Atención: Ejercicios que pueden afectar lesiones activas`,
          descripcion: `El plan incluye ${ejerciciosRiesgo} sesión(es) que trabajan grupos musculares relacionados con lesiones activas del cliente. Revisa y adapta estos ejercicios según las restricciones.`,
          contexto: `Lesiones activas: ${lesionesActivas.map(l => l.nombre).join(', ')}. Grupos afectados: ${Array.from(gruposAfectados).join(', ')}.`,
          accion: {
            tipo: 'revisar_lesiones',
            label: 'Ver restricciones y adaptaciones',
            detalle: 'Revisar ejercicios según lesiones activas',
          },
          metricas: [
            {
              nombre: 'Lesiones activas',
              valor: lesionesActivas.length,
              unidad: 'lesiones',
            },
            {
              nombre: 'Sesiones con riesgo',
              valor: ejerciciosRiesgo,
              unidad: 'sesiones',
            },
          ],
          relevancia: 95,
          timestamp: new Date(),
        });
      }
    }

    // 6. Análisis de distribución de intensidad
    const intensidades: number[] = [];
    days.forEach((day) => {
      const dayPlan = plan[day];
      dayPlan?.sessions.forEach((session) => {
        const intensityMatch = session.intensity?.match(/RPE\s*(\d+\.?\d*)/i);
        if (intensityMatch) {
          intensidades.push(parseFloat(intensityMatch[1]));
        }
      });
    });

    if (intensidades.length > 0) {
      const promedioIntensidad = intensidades.reduce((a, b) => a + b, 0) / intensidades.length;
      const maxIntensidad = Math.max(...intensidades);
      const minIntensidad = Math.min(...intensidades);

      if (promedioIntensidad > 8) {
        insights.push({
          id: 'insight-intensidad-alta',
          tipo: 'alerta',
          prioridad: 'media',
          titulo: 'Intensidad promedio muy alta',
          descripcion: `La intensidad promedio (RPE ${promedioIntensidad.toFixed(1)}) es muy alta. Considera incluir más días de recuperación activa para evitar sobreentrenamiento.`,
          contexto: `RPE promedio: ${promedioIntensidad.toFixed(1)}. Rango: ${minIntensidad.toFixed(1)} - ${maxIntensidad.toFixed(1)}.`,
          accion: {
            tipo: 'ajustar_intensidad',
            label: 'Ajustar distribución de intensidad',
            detalle: 'Incluir más días de recuperación',
          },
          metricas: [
            {
              nombre: 'RPE Promedio',
              valor: promedioIntensidad.toFixed(1),
              unidad: '/10',
              tendencia: 'up',
            },
          ],
          relevancia: 75,
          timestamp: new Date(),
        });
      }
    }

    // 7. Análisis combinado: Feedback del cliente, datos de sueño y meteorología
    if (feedback && feedback.length > 0) {
      const promedioFatiga = feedback.reduce((sum, f) => sum + (f.nivelFatiga || 0), 0) / feedback.length;
      const promedioSatisfaccion = feedback.reduce((sum, f) => sum + (f.satisfaccion || 0), 0) / feedback.length;
      const promedioDolor = feedback.reduce((sum, f) => sum + (f.nivelDolor || 0), 0) / feedback.length;

      // Análisis de fatiga alta
      if (promedioFatiga > 7) {
        insights.push({
          id: 'insight-fatiga-alta',
          tipo: 'alerta',
          prioridad: 'alta',
          titulo: 'Fatiga elevada detectada en feedback del cliente',
          descripcion: `El cliente reporta un nivel promedio de fatiga de ${promedioFatiga.toFixed(1)}/10 en las últimas sesiones. Considera ajustar la intensidad o añadir más días de recuperación.`,
          contexto: `Basado en ${feedback.length} feedback(s) reciente(s). Nivel promedio de fatiga: ${promedioFatiga.toFixed(1)}/10.`,
          accion: {
            tipo: 'ajustar_intensidad',
            label: 'Revisar plan y ajustar intensidad',
            detalle: 'Reducir intensidad o aumentar recuperación',
          },
          metricas: [
            {
              nombre: 'Fatiga promedio',
              valor: promedioFatiga.toFixed(1),
              unidad: '/10',
              tendencia: 'up',
            },
            {
              nombre: 'Feedback analizados',
              valor: feedback.length,
              unidad: 'feedback',
            },
          ],
          relevancia: 90,
          timestamp: new Date(),
        });
      }

      // Correlación fatiga-dolor
      if (promedioFatiga > 6 && promedioDolor > 4) {
        insights.push({
          id: 'insight-fatiga-dolor',
          tipo: 'alerta',
          prioridad: 'alta',
          titulo: 'Correlación detectada: Fatiga alta y dolor',
          descripcion: `El cliente muestra niveles elevados tanto de fatiga (${promedioFatiga.toFixed(1)}/10) como de dolor (${promedioDolor.toFixed(1)}/10). Esto sugiere posible sobreentrenamiento o necesidad de revisar técnica de ejercicios.`,
          contexto: `Fatiga: ${promedioFatiga.toFixed(1)}/10. Dolor: ${promedioDolor.toFixed(1)}/10. Esta combinación puede indicar sobrecarga.`,
          accion: {
            tipo: 'revisar_plan',
            label: 'Revisar plan completo',
            detalle: 'Evaluar volumen, intensidad y técnica',
          },
          metricas: [
            {
              nombre: 'Fatiga',
              valor: promedioFatiga.toFixed(1),
              unidad: '/10',
              tendencia: 'up',
            },
            {
              nombre: 'Dolor',
              valor: promedioDolor.toFixed(1),
              unidad: '/10',
              tendencia: 'up',
            },
          ],
          relevancia: 95,
          timestamp: new Date(),
        });
      }

      // Satisfacción baja
      if (promedioSatisfaccion < 3) {
        insights.push({
          id: 'insight-satisfaccion-baja',
          tipo: 'oportunidad',
          prioridad: 'media',
          titulo: 'Satisfacción del cliente por debajo del objetivo',
          descripcion: `La satisfacción promedio del cliente es de ${promedioSatisfaccion.toFixed(1)}/5. Considera revisar el plan para mejorarlo según las preferencias del cliente.`,
          contexto: `Satisfacción promedio: ${promedioSatisfaccion.toFixed(1)}/5 basado en ${feedback.length} feedback(s).`,
          accion: {
            tipo: 'mejorar_satisfaccion',
            label: 'Revisar feedback detallado',
            detalle: 'Ajustar plan según comentarios del cliente',
          },
          metricas: [
            {
              nombre: 'Satisfacción',
              valor: promedioSatisfaccion.toFixed(1),
              unidad: '/5',
              tendencia: 'down',
            },
          ],
          relevancia: 75,
          timestamp: new Date(),
        });
      }
    }

    // Análisis de datos de sueño
    if (sueno && sueno.length > 0) {
      const promedioHorasSueno = sueno.reduce((sum, s) => sum + s.horasSueño, 0) / sueno.length;
      const promedioCalidadSueno = sueno.reduce((sum, s) => sum + s.calidadSueño, 0) / sueno.length;

      // Sueño insuficiente
      if (promedioHorasSueno < 7) {
        insights.push({
          id: 'insight-sueno-insuficiente',
          tipo: 'alerta',
          prioridad: 'media',
          titulo: 'Sueño insuficiente detectado',
          descripcion: `El cliente duerme un promedio de ${promedioHorasSueno.toFixed(1)} horas por noche, por debajo de las 7-9 horas recomendadas. Esto puede afectar la recuperación y el rendimiento.`,
          contexto: `Promedio de sueño: ${promedioHorasSueno.toFixed(1)} horas en los últimos ${sueno.length} días. Calidad promedio: ${promedioCalidadSueno.toFixed(1)}/10.`,
          accion: {
            tipo: 'recomendar_sueno',
            label: 'Recomendar mejorar hábitos de sueño',
            detalle: 'Sugerir técnicas de higiene del sueño',
          },
          metricas: [
            {
              nombre: 'Horas de sueño',
              valor: promedioHorasSueno.toFixed(1),
              unidad: 'horas',
              tendencia: 'down',
            },
            {
              nombre: 'Calidad de sueño',
              valor: promedioCalidadSueno.toFixed(1),
              unidad: '/10',
            },
          ],
          relevancia: 80,
          timestamp: new Date(),
        });
      }

      // Correlación sueño-fatiga
      if (feedback && feedback.length > 0 && promedioHorasSueno < 7) {
        const promedioFatiga = feedback.reduce((sum, f) => sum + (f.nivelFatiga || 0), 0) / feedback.length;
        if (promedioFatiga > 6) {
          insights.push({
            id: 'insight-sueno-fatiga-correlacion',
            tipo: 'correlacion',
            prioridad: 'alta',
            titulo: 'Correlación detectada: Sueño insuficiente y fatiga alta',
            descripcion: `El cliente duerme ${promedioHorasSueno.toFixed(1)} horas promedio y reporta fatiga de ${promedioFatiga.toFixed(1)}/10. La falta de sueño probablemente está contribuyendo a la fatiga.`,
            contexto: `Horas de sueño: ${promedioHorasSueno.toFixed(1)}h. Fatiga: ${promedioFatiga.toFixed(1)}/10. La correlación entre sueño y fatiga es fuerte.`,
            accion: {
              tipo: 'ajustar_plan_sueno',
              label: 'Ajustar plan considerando sueño',
              detalle: 'Reducir carga hasta mejorar sueño',
            },
            metricas: [
              {
                nombre: 'Horas de sueño',
                valor: promedioHorasSueno.toFixed(1),
                unidad: 'horas',
                tendencia: 'down',
              },
              {
                nombre: 'Fatiga',
                valor: promedioFatiga.toFixed(1),
                unidad: '/10',
                tendencia: 'up',
              },
            ],
            relevancia: 92,
            timestamp: new Date(),
          });
        }
      }
    }

    // Análisis de datos meteorológicos
    if (meteorologia && meteorologia.length > 0 && feedback && feedback.length > 0) {
      // Buscar correlaciones entre clima y rendimiento
      const sesionesConClima = feedback.map((f) => {
        const fechaFeedback = new Date(f.fecha).toISOString().split('T')[0];
        const datosClima = meteorologia.find((m) => m.fecha === fechaFeedback);
        return { feedback: f, clima: datosClima };
      }).filter((item) => item.clima);

      if (sesionesConClima.length > 0) {
        const sesionesLluvia = sesionesConClima.filter((item) => 
          item.clima?.condiciones.toLowerCase().includes('lluvia')
        );
        const sesionesSoleado = sesionesConClima.filter((item) =>
          item.clima?.condiciones.toLowerCase().includes('soleado')
        );

        if (sesionesLluvia.length > 0 && sesionesSoleado.length > 0) {
          const satisfaccionLluvia = sesionesLluvia.reduce((sum, s) => sum + (s.feedback.satisfaccion || 0), 0) / sesionesLluvia.length;
          const satisfaccionSoleado = sesionesSoleado.reduce((sum, s) => sum + (s.feedback.satisfaccion || 0), 0) / sesionesSoleado.length;

          if (satisfaccionLluvia < satisfaccionSoleado - 1) {
            insights.push({
              id: 'insight-clima-impacto',
              tipo: 'recomendacion',
              prioridad: 'baja',
              titulo: 'Impacto del clima en la satisfacción detectado',
              descripcion: `El cliente muestra menor satisfacción en días lluviosos (${satisfaccionLluvia.toFixed(1)}/5) vs días soleados (${satisfaccionSoleado.toFixed(1)}/5). Considera ajustar el tipo de entrenamiento en días con mal tiempo.`,
              contexto: `Satisfacción en lluvia: ${satisfaccionLluvia.toFixed(1)}/5. Satisfacción en sol: ${satisfaccionSoleado.toFixed(1)}/5.`,
              accion: {
                tipo: 'ajustar_segun_clima',
                label: 'Revisar alternativas para días lluviosos',
                detalle: 'Proponer ejercicios indoor o de menor intensidad',
              },
              metricas: [
                {
                  nombre: 'Satisfacción (lluvia)',
                  valor: satisfaccionLluvia.toFixed(1),
                  unidad: '/5',
                },
                {
                  nombre: 'Satisfacción (sol)',
                  valor: satisfaccionSoleado.toFixed(1),
                  unidad: '/5',
                },
              ],
              relevancia: 60,
              timestamp: new Date(),
            });
          }
        }
      }
    }

    // Ordenar por relevancia y prioridad
    return insights.sort((a, b) => {
      const prioridadOrder = { alta: 3, media: 2, baja: 1 };
      if (prioridadOrder[b.prioridad] !== prioridadOrder[a.prioridad]) {
        return prioridadOrder[b.prioridad] - prioridadOrder[a.prioridad];
      }
      return b.relevancia - a.relevancia;
    });
  };

  const handleDismissInsight = (insightId: string) => {
    setDismissedInsights((prev) => new Set([...prev, insightId]));
    setInsights((prev) => prev.filter((i) => i.id !== insightId));
  };

  const handleInsightAction = (insight: Insight) => {
    if (insight.accion && onInsightAction) {
      onInsightAction(insight.id, insight.accion);
    }
  };

  const getInsightIcon = (tipo: Insight['tipo']) => {
    switch (tipo) {
      case 'oportunidad':
        return <Lightbulb className="w-5 h-5" />;
      case 'alerta':
        return <AlertTriangle className="w-5 h-5" />;
      case 'logro':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'recomendacion':
        return <Target className="w-5 h-5" />;
      case 'tendencia':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getInsightColor = (tipo: Insight['tipo'], prioridad: Insight['prioridad']) => {
    if (tipo === 'alerta' || prioridad === 'alta') {
      return 'error';
    }
    if (tipo === 'oportunidad' || tipo === 'recomendacion' || prioridad === 'media') {
      return 'warning';
    }
    if (tipo === 'logro') {
      return 'success';
    }
    return 'info';
  };

  const visibleInsights = useMemo(() => {
    return insights.slice(0, 5); // Mostrar solo los 5 más relevantes
  }, [insights]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Brain className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Asistente de Insights</h3>
            <p className="text-sm text-gray-600">
              Interpretación automática de datos del plan y cliente
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={generateInsights}
            leftIcon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
            disabled={loading}
          >
            Actualizar
          </Button>
        </div>
      </div>

      {loading && insights.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          <span className="ml-2 text-sm text-gray-600">Analizando datos...</span>
        </div>
      ) : visibleInsights.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-sm text-gray-600">
            No hay insights críticos en este momento. El plan parece estar bien estructurado.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleInsights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border ${
                insight.prioridad === 'alta'
                  ? 'border-red-200 bg-red-50'
                  : insight.prioridad === 'media'
                  ? 'border-yellow-200 bg-yellow-50'
                  : insight.tipo === 'logro'
                  ? 'border-green-200 bg-green-50'
                  : 'border-blue-200 bg-blue-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-1">
                  <div className={`text-${
                    getInsightColor(insight.tipo, insight.prioridad) === 'error'
                      ? 'red'
                      : getInsightColor(insight.tipo, insight.prioridad) === 'warning'
                      ? 'yellow'
                      : getInsightColor(insight.tipo, insight.prioridad) === 'success'
                      ? 'green'
                      : 'blue'
                  }-600`}>
                    {getInsightIcon(insight.tipo)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{insight.titulo}</h4>
                    <p className="text-xs text-gray-600 mt-1">{insight.contexto}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={
                    insight.prioridad === 'alta'
                      ? 'bg-red-100 text-red-700'
                      : insight.prioridad === 'media'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                  }>
                    {insight.prioridad}
                  </Badge>
                  <button
                    onClick={() => handleDismissInsight(insight.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm mb-3 opacity-90">{insight.descripcion}</p>

              {insight.metricas && insight.metricas.length > 0 && (
                <div className="mb-3 p-3 bg-white rounded border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-gray-600" />
                    <span className="text-xs font-semibold text-gray-700">Métricas</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {insight.metricas.map((metrica, idx) => (
                      <div key={idx}>
                        <span className="text-gray-600">{metrica.nombre}:</span>
                        <span className={`ml-1 font-semibold ${
                          metrica.tendencia === 'up' && insight.tipo === 'alerta'
                            ? 'text-red-600'
                            : metrica.tendencia === 'down' && insight.tipo === 'alerta'
                            ? 'text-red-600'
                            : metrica.tendencia === 'up'
                            ? 'text-green-600'
                            : 'text-gray-900'
                        }`}>
                          {metrica.valor} {metrica.unidad}
                        </span>
                        {metrica.tendencia && (
                          metrica.tendencia === 'up' ? (
                            <TrendingUp className="w-3 h-3 inline ml-1 text-gray-400" />
                          ) : metrica.tendencia === 'down' ? (
                            <TrendingDown className="w-3 h-3 inline ml-1 text-gray-400" />
                          ) : null
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setExpandedInsight(
                  expandedInsight === insight.id ? null : insight.id
                )}
                className="text-xs text-indigo-600 hover:text-indigo-700 mb-3 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                {expandedInsight === insight.id ? 'Ocultar detalles' : 'Ver más detalles'}
              </button>

              {expandedInsight === insight.id && (
                <div className="mb-3 p-3 bg-white rounded border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-gray-600" />
                    <span className="text-xs font-semibold text-gray-700">Análisis</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">{insight.contexto}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="text-gray-600">Relevancia:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full"
                        style={{ width: `${insight.relevancia}%` }}
                      />
                    </div>
                    <span className="text-indigo-600 font-semibold">{insight.relevancia}%</span>
                  </div>
                </div>
              )}

              {insight.accion && (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => handleInsightAction(insight)}
                  leftIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {insight.accion.label}
                </Button>
              )}
            </div>
          ))}

          {insights.length > 5 && (
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                Mostrando 5 de {insights.length} insights. Actualiza para ver más.
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

