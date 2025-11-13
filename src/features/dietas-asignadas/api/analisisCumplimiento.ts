import { RecursoBiblioteca, FeedbackCliente, AdherenciaHistoricaRecurso } from '../types';
import { getFeedbackCliente } from './feedback';
import { getAdherenciaHistoricaRecurso } from './recursos';
import { getEtiquetasAdherencia } from './etiquetasAdherencia';

/**
 * Análisis de cumplimiento de una receta para un cliente específico
 */
export interface AnalisisCumplimientoReceta {
  recursoId: string;
  recurso: RecursoBiblioteca;
  probabilidadCumplimiento: number; // 0-100
  factores: {
    adherenciaHistorica: {
      puntuacion: number; // 0-100
      vecesUsado: number;
      adherenciaPromedio: number;
      tendencia: 'mejora' | 'estable' | 'empeora';
      peso: number; // Peso del factor en el cálculo final (0-1)
    };
    preferencias: {
      puntuacion: number; // 0-100
      razones: string[];
      peso: number;
    };
    feedback: {
      puntuacion: number; // 0-100
      feedbackPromedio: {
        sensacion: number; // 1-5
        saciedad: number; // 1-5
        completada: number; // Porcentaje de veces completada
      };
      totalFeedback: number;
      peso: number;
    };
    compatibilidadNutricional: {
      puntuacion: number; // 0-100
      razones: string[];
      peso: number;
    };
  };
  recomendacion: 'alta' | 'media' | 'baja';
  razonesPriorizacion: string[];
}

/**
 * Analiza el historial del cliente (adherencia, preferencias, feedback) 
 * para calcular la probabilidad de cumplimiento de recetas
 */
export async function analizarCumplimientoRecetas(
  clienteId: string,
  dietaId: string,
  recursos: RecursoBiblioteca[]
): Promise<AnalisisCumplimientoReceta[]> {
  await new Promise(resolve => setTimeout(resolve, 500));

  // Obtener feedback del cliente
  const feedbacks = await getFeedbackCliente(dietaId, clienteId);
  
  // Obtener etiquetas de adherencia del cliente
  const etiquetasAdherencia = await getEtiquetasAdherencia(clienteId);

  // Analizar cada recurso
  const analisis: AnalisisCumplimientoReceta[] = await Promise.all(
    recursos.map(async (recurso) => {
      // 1. Análisis de adherencia histórica
      const adherenciaHistorica = await getAdherenciaHistoricaRecurso(clienteId, recurso.id);
      
      let puntuacionAdherencia = 50; // Puntuación base
      let vecesUsado = 0;
      let adherenciaPromedio = 0;
      let tendencia: 'mejora' | 'estable' | 'empeora' = 'estable';

      if (adherenciaHistorica) {
        vecesUsado = adherenciaHistorica.vecesUsado;
        adherenciaPromedio = adherenciaHistorica.adherenciaPromedio;
        tendencia = adherenciaHistorica.tendencia || 'estable';
        
        // Calcular puntuación basada en adherencia promedio
        puntuacionAdherencia = adherenciaHistorica.adherenciaPromedio;
        
        // Bonus por tendencia positiva
        if (tendencia === 'mejora') {
          puntuacionAdherencia = Math.min(100, puntuacionAdherencia + 10);
        } else if (tendencia === 'empeora') {
          puntuacionAdherencia = Math.max(0, puntuacionAdherencia - 10);
        }
        
        // Bonus por uso frecuente (más de 5 veces)
        if (vecesUsado > 5) {
          puntuacionAdherencia = Math.min(100, puntuacionAdherencia + 5);
        }
      }

      // 2. Análisis de preferencias (etiquetas de adherencia)
      let puntuacionPreferencias = 50;
      const razonesPreferencias: string[] = [];
      
      const etiquetaCliente = etiquetasAdherencia.find(e => e.recursoId === recurso.id);
      if (etiquetaCliente) {
        // Si tiene etiqueta de adherencia positiva
        if (etiquetaCliente.nivelAdherencia === 'excelente') {
          puntuacionPreferencias = 95;
          razonesPreferencias.push('Adherencia excelente histórica');
        } else if (etiquetaCliente.nivelAdherencia === 'muy-bueno') {
          puntuacionPreferencias = 85;
          razonesPreferencias.push('Adherencia muy buena histórica');
        } else if (etiquetaCliente.nivelAdherencia === 'bueno') {
          puntuacionPreferencias = 75;
          razonesPreferencias.push('Adherencia buena histórica');
        } else if (etiquetaCliente.nivelAdherencia === 'regular') {
          puntuacionPreferencias = 60;
          razonesPreferencias.push('Adherencia regular histórica');
        } else if (etiquetaCliente.nivelAdherencia === 'bajo') {
          puntuacionPreferencias = 30;
          razonesPreferencias.push('Adherencia baja histórica');
        }

        // Considerar satisfacción
        if (etiquetaCliente.nivelSatisfaccion === 'muy-alto') {
          puntuacionPreferencias = Math.min(100, puntuacionPreferencias + 10);
          razonesPreferencias.push('Alta satisfacción del cliente');
        } else if (etiquetaCliente.nivelSatisfaccion === 'alto') {
          puntuacionPreferencias = Math.min(100, puntuacionPreferencias + 5);
          razonesPreferencias.push('Buena satisfacción del cliente');
        } else if (etiquetaCliente.nivelSatisfaccion === 'bajo' || etiquetaCliente.nivelSatisfaccion === 'muy-bajo') {
          puntuacionPreferencias = Math.max(0, puntuacionPreferencias - 15);
          razonesPreferencias.push('Baja satisfacción del cliente');
        }
      }

      // 3. Análisis de feedback
      const feedbacksReceta = feedbacks.filter(f => {
        // Buscar feedbacks que mencionen esta receta o sean similares
        // En producción, esto se haría comparando IDs de comidas con recursos
        return true; // Por ahora, usamos todos los feedbacks
      });

      let puntuacionFeedback = 50;
      let totalFeedback = feedbacksReceta.length;
      let sensacionPromedio = 0;
      let saciedadPromedio = 0;
      let completadaPromedio = 0;

      if (feedbacksReceta.length > 0) {
        sensacionPromedio = feedbacksReceta.reduce((sum, f) => sum + f.sensacion, 0) / feedbacksReceta.length;
        saciedadPromedio = feedbacksReceta.reduce((sum, f) => sum + f.saciedad, 0) / feedbacksReceta.length;
        completadaPromedio = feedbacksReceta.filter(f => f.completada).length / feedbacksReceta.length * 100;

        // Calcular puntuación basada en feedback
        // Sensación (1-5) -> 0-40 puntos
        puntuacionFeedback = (sensacionPromedio / 5) * 40;
        // Saciedad (1-5) -> 0-30 puntos
        puntuacionFeedback += (saciedadPromedio / 5) * 30;
        // Completada -> 0-30 puntos
        puntuacionFeedback += (completadaPromedio / 100) * 30;
      }

      // 4. Análisis de compatibilidad nutricional
      // Por ahora, damos una puntuación base
      // En producción, se compararía con objetivos nutricionales del cliente
      let puntuacionCompatibilidad = 70;
      const razonesCompatibilidad: string[] = [];
      
      // Si la receta tiene buena adherencia histórica, es más compatible
      if (adherenciaPromedio > 80) {
        puntuacionCompatibilidad = 90;
        razonesCompatibilidad.push('Alta compatibilidad nutricional histórica');
      } else if (adherenciaPromedio > 60) {
        puntuacionCompatibilidad = 75;
        razonesCompatibilidad.push('Buena compatibilidad nutricional');
      }

      // Calcular probabilidad de cumplimiento ponderada
      const pesos = {
        adherenciaHistorica: 0.4, // 40% - más importante
        preferencias: 0.3, // 30%
        feedback: 0.2, // 20%
        compatibilidadNutricional: 0.1, // 10%
      };

      const probabilidadCumplimiento = 
        puntuacionAdherencia * pesos.adherenciaHistorica +
        puntuacionPreferencias * pesos.preferencias +
        puntuacionFeedback * pesos.feedback +
        puntuacionCompatibilidad * pesos.compatibilidadNutricional;

      // Determinar recomendación
      let recomendacion: 'alta' | 'media' | 'baja';
      if (probabilidadCumplimiento >= 75) {
        recomendacion = 'alta';
      } else if (probabilidadCumplimiento >= 50) {
        recomendacion = 'media';
      } else {
        recomendacion = 'baja';
      }

      // Generar razones de priorización
      const razonesPriorizacion: string[] = [];
      if (puntuacionAdherencia > 70) {
        razonesPriorizacion.push(`Adherencia histórica del ${adherenciaPromedio.toFixed(0)}%`);
      }
      if (puntuacionPreferencias > 70) {
        razonesPriorizacion.push('Preferencias del cliente favorables');
      }
      if (puntuacionFeedback > 70) {
        razonesPriorizacion.push('Feedback positivo del cliente');
      }
      if (vecesUsado > 3) {
        razonesPriorizacion.push(`Usada ${vecesUsado} veces anteriormente`);
      }
      if (tendencia === 'mejora') {
        razonesPriorizacion.push('Tendencia de mejora en adherencia');
      }

      return {
        recursoId: recurso.id,
        recurso,
        probabilidadCumplimiento: Math.round(probabilidadCumplimiento),
        factores: {
          adherenciaHistorica: {
            puntuacion: Math.round(puntuacionAdherencia),
            vecesUsado,
            adherenciaPromedio,
            tendencia,
            peso: pesos.adherenciaHistorica,
          },
          preferencias: {
            puntuacion: Math.round(puntuacionPreferencias),
            razones: razonesPreferencias,
            peso: pesos.preferencias,
          },
          feedback: {
            puntuacion: Math.round(puntuacionFeedback),
            feedbackPromedio: {
              sensacion: sensacionPromedio,
              saciedad: saciedadPromedio,
              completada: completadaPromedio,
            },
            totalFeedback,
            peso: pesos.feedback,
          },
          compatibilidadNutricional: {
            puntuacion: Math.round(puntuacionCompatibilidad),
            razones: razonesCompatibilidad,
            peso: pesos.compatibilidadNutricional,
          },
        },
        recomendacion,
        razonesPriorizacion,
      };
    })
  );

  // Ordenar por probabilidad de cumplimiento (mayor a menor)
  return analisis.sort((a, b) => b.probabilidadCumplimiento - a.probabilidadCumplimiento);
}

/**
 * Obtiene las recetas priorizadas según análisis de cumplimiento
 */
export async function getRecetasPriorizadasPorCumplimiento(
  clienteId: string,
  dietaId: string,
  recursos: RecursoBiblioteca[],
  limite?: number
): Promise<AnalisisCumplimientoReceta[]> {
  const analisis = await analizarCumplimientoRecetas(clienteId, dietaId, recursos);
  
  if (limite) {
    return analisis.slice(0, limite);
  }
  
  return analisis;
}

