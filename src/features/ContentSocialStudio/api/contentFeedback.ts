import type {
  ContentFeedbackRequest,
  ContentAIFeedback,
  ContentFeedbackScore,
  PlannerContentType,
  SocialPlatform,
} from '../types';

// Mock storage - en producción vendría del backend
const feedbackHistory: ContentAIFeedback[] = [];

/**
 * Analiza contenido y proporciona retroalimentación IA sobre claridad, CTA y coherencia
 */
export const analyzeContentFeedback = async (
  request: ContentFeedbackRequest
): Promise<ContentAIFeedback> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const { content, contentType = 'post', platform } = request;

  // Simulación de análisis IA
  const claridadScore = calculateClarityScore(content);
  const ctaScore = calculateCTAScore(content);
  const coherenciaScore = calculateCoherenceScore(content);

  const claridad: ContentFeedbackScore = {
    score: claridadScore,
    level: getScoreLevel(claridadScore),
    feedback: getClarityFeedback(claridadScore, content),
    suggestions: getClaritySuggestions(claridadScore, content),
  };

  const cta: ContentFeedbackScore = {
    score: ctaScore,
    level: getScoreLevel(ctaScore),
    feedback: getCTAFeedback(ctaScore, content),
    suggestions: getCTASuggestions(ctaScore, content),
  };

  const coherencia: ContentFeedbackScore = {
    score: coherenciaScore,
    level: getScoreLevel(coherenciaScore),
    feedback: getCoherenceFeedback(coherenciaScore, content),
    suggestions: getCoherenceSuggestions(coherenciaScore, content),
  };

  const overallScore = Math.round((claridadScore + ctaScore + coherenciaScore) / 3);

  const feedback: ContentAIFeedback = {
    id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    originalContent: content,
    contentType,
    platform,
    feedback: {
      claridad,
      cta,
      coherencia,
      overall: {
        score: overallScore,
        level: getScoreLevel(overallScore),
        summary: generateOverallSummary(claridad, cta, coherencia),
      },
    },
    suggestions: generateSuggestions(claridad, cta, coherencia),
    improvedVersion: generateImprovedVersion(content, claridad, cta, coherencia),
    createdAt: new Date().toISOString(),
  };

  feedbackHistory.push(feedback);

  return feedback;
};

/**
 * Obtiene el historial de retroalimentaciones
 */
export const getFeedbackHistory = async (limit: number = 10): Promise<ContentAIFeedback[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return feedbackHistory
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

/**
 * Obtiene una retroalimentación específica por ID
 */
export const getFeedbackById = async (id: string): Promise<ContentAIFeedback | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return feedbackHistory.find((f) => f.id === id) || null;
};

// Funciones auxiliares para simular análisis IA

function calculateClarityScore(content: string): number {
  let score = 70; // Base score

  // Verificar longitud adecuada
  const wordCount = content.split(/\s+/).length;
  if (wordCount >= 50 && wordCount <= 300) score += 10;
  if (wordCount < 30) score -= 15;
  if (wordCount > 500) score -= 10;

  // Verificar estructura (párrafos, listas)
  if (content.includes('\n') || content.includes('•') || content.includes('-')) score += 5;

  // Verificar uso de emojis moderado
  const emojiCount = (content.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
  if (emojiCount > 0 && emojiCount <= 5) score += 5;
  if (emojiCount > 10) score -= 5;

  // Verificar palabras complejas
  const complexWords = content.match(/\b\w{12,}\b/g) || [];
  if (complexWords.length > 3) score -= 10;

  return Math.max(0, Math.min(100, score));
}

function calculateCTAScore(content: string): number {
  let score = 50; // Base score más bajo porque muchos posts no tienen CTA claro

  const ctaPatterns = [
    /\b(comenta|dime|escribe|envía|contacta|reserva|agenda|consulta|visita|sigue|suscríbete|únete|descarga|obtén|consigue|aprovecha|apunta|inscríbete)\b/gi,
    /\?/g, // Preguntas que invitan a la acción
    /!+/g, // Exclamaciones
    /👉|👇|⬇️|💬|📩|🔗/g, // Emojis de acción
  ];

  let hasCTA = false;
  ctaPatterns.forEach((pattern) => {
    if (pattern.test(content)) {
      hasCTA = true;
      score += 15;
    }
  });

  // Verificar si el CTA está al final (mejor práctica)
  const lastParagraph = content.split('\n').pop() || '';
  if (ctaPatterns.some((pattern) => pattern.test(lastParagraph))) {
    score += 10;
  }

  // Verificar claridad del CTA
  if (hasCTA && content.length > 0) {
    const ctaClarity = /(qué|cuál|cuándo|dónde|cómo|por qué)/gi.test(content);
    if (ctaClarity) score += 10;
  }

  return Math.max(0, Math.min(100, score));
}

function calculateCoherenceScore(content: string): number {
  let score = 75; // Base score

  // Verificar coherencia temática
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  if (sentences.length < 2) {
    score -= 20; // Contenido muy corto puede ser menos coherente
  }

  // Verificar transiciones
  const transitionWords = [
    'además',
    'también',
    'por otro lado',
    'sin embargo',
    'por lo tanto',
    'en conclusión',
    'finalmente',
    'primero',
    'segundo',
    'luego',
  ];
  const hasTransitions = transitionWords.some((word) =>
    content.toLowerCase().includes(word)
  );
  if (hasTransitions && sentences.length > 3) score += 10;

  // Verificar repetición excesiva de palabras
  const words = content.toLowerCase().split(/\s+/);
  const wordFreq: Record<string, number> = {};
  words.forEach((word) => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  const maxFreq = Math.max(...Object.values(wordFreq));
  if (maxFreq > words.length * 0.1) score -= 15; // Más del 10% de repetición

  return Math.max(0, Math.min(100, score));
}

function getScoreLevel(score: number): 'excelente' | 'bueno' | 'regular' | 'necesita_mejora' {
  if (score >= 80) return 'excelente';
  if (score >= 65) return 'bueno';
  if (score >= 50) return 'regular';
  return 'necesita_mejora';
}

function getClarityFeedback(score: number, content: string): string {
  if (score >= 80) {
    return 'Tu contenido es claro y fácil de entender. El mensaje se comunica efectivamente.';
  }
  if (score >= 65) {
    return 'El contenido es generalmente claro, pero hay algunas áreas que podrían simplificarse.';
  }
  if (score >= 50) {
    return 'El contenido necesita más claridad. Considera simplificar el lenguaje y estructurar mejor las ideas.';
  }
  return 'El contenido es difícil de entender. Simplifica el mensaje y usa un lenguaje más directo.';
}

function getClaritySuggestions(score: number, content: string): string[] {
  const suggestions: string[] = [];
  const wordCount = content.split(/\s+/).length;

  if (wordCount < 30) {
    suggestions.push('Añade más contexto para que el mensaje sea más completo');
  }
  if (wordCount > 500) {
    suggestions.push('Considera dividir el contenido en partes más pequeñas o usar formato carousel');
  }
  if (!content.includes('\n') && wordCount > 100) {
    suggestions.push('Usa saltos de línea o viñetas para mejorar la legibilidad');
  }
  if ((content.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length > 10) {
    suggestions.push('Reduce el número de emojis para mantener profesionalismo');
  }

  return suggestions;
}

function getCTAFeedback(score: number, content: string): string {
  if (score >= 80) {
    return 'Tienes un llamado a la acción claro y efectivo que invita a la interacción.';
  }
  if (score >= 65) {
    return 'Hay un CTA presente, pero podría ser más específico o estar mejor posicionado.';
  }
  if (score >= 50) {
    return 'El CTA es débil o poco claro. Considera hacerlo más directo y específico.';
  }
  return 'Falta un llamado a la acción claro. Añade una invitación específica para que tu audiencia sepa qué hacer.';
}

function getCTASuggestions(score: number, content: string): string[] {
  const suggestions: string[] = [];

  if (score < 65) {
    suggestions.push('Añade un CTA específico al final del contenido (ej: "Comenta TIPS para recibir más contenido")');
    suggestions.push('Usa verbos de acción claros: comenta, reserva, agenda, consulta');
    suggestions.push('Haz el CTA relevante al contenido del post');
  }

  const lastParagraph = content.split('\n').pop() || '';
  if (!/(comenta|dime|escribe|reserva|agenda|consulta)/gi.test(lastParagraph)) {
    suggestions.push('Coloca el CTA al final del contenido para mayor impacto');
  }

  return suggestions;
}

function getCoherenceFeedback(score: number, content: string): string {
  if (score >= 80) {
    return 'El contenido fluye de manera coherente y las ideas están bien conectadas.';
  }
  if (score >= 65) {
    return 'El contenido es coherente en general, pero algunas transiciones podrían mejorarse.';
  }
  if (score >= 50) {
    return 'El contenido necesita mejor estructura y conexión entre ideas.';
  }
  return 'El contenido carece de coherencia. Reorganiza las ideas para que fluyan lógicamente.';
}

function getCoherenceSuggestions(score: number, content: string): string[] {
  const suggestions: string[] = [];
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  if (sentences.length > 3) {
    const transitionWords = ['además', 'también', 'por otro lado', 'sin embargo', 'finalmente'];
    const hasTransitions = transitionWords.some((word) =>
      content.toLowerCase().includes(word)
    );
    if (!hasTransitions) {
      suggestions.push('Usa palabras de transición para conectar mejor las ideas');
    }
  }

  if (sentences.length < 2) {
    suggestions.push('Desarrolla más el tema para crear un contenido más completo');
  }

  return suggestions;
}

function generateOverallSummary(
  claridad: ContentFeedbackScore,
  cta: ContentFeedbackScore,
  coherencia: ContentFeedbackScore
): string {
  const scores = [claridad.score, cta.score, coherencia.score];
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  if (avgScore >= 80) {
    return 'Excelente contenido. Está bien estructurado, tiene un CTA claro y es coherente.';
  }
  if (avgScore >= 65) {
    return 'Buen contenido con áreas de mejora. Revisa las sugerencias específicas para optimizarlo.';
  }
  if (avgScore >= 50) {
    return 'El contenido necesita mejoras significativas. Enfócate especialmente en claridad y CTA.';
  }
  return 'El contenido requiere una revisión importante. Considera reescribirlo aplicando todas las sugerencias.';
}

function generateSuggestions(
  claridad: ContentFeedbackScore,
  cta: ContentFeedbackScore,
  coherencia: ContentFeedbackScore
): Array<{
  category: 'claridad' | 'cta' | 'coherencia' | 'general';
  priority: 'high' | 'medium' | 'low';
  suggestion: string;
  example?: string;
}> {
  const suggestions: Array<{
    category: 'claridad' | 'cta' | 'coherencia' | 'general';
    priority: 'high' | 'medium' | 'low';
    suggestion: string;
    example?: string;
  }> = [];

  // Agregar sugerencias de claridad
  if (claridad.score < 65) {
    claridad.suggestions.forEach((s) => {
      suggestions.push({
        category: 'claridad',
        priority: claridad.score < 50 ? 'high' : 'medium',
        suggestion: s,
      });
    });
  }

  // Agregar sugerencias de CTA
  if (cta.score < 65) {
    cta.suggestions.forEach((s) => {
      suggestions.push({
        category: 'cta',
        priority: cta.score < 50 ? 'high' : 'medium',
        suggestion: s,
        example: cta.score < 50 ? 'Ejemplo: "¿Quieres más tips? Comenta TIPS y te enviaré contenido exclusivo"' : undefined,
      });
    });
  }

  // Agregar sugerencias de coherencia
  if (coherencia.score < 65) {
    coherencia.suggestions.forEach((s) => {
      suggestions.push({
        category: 'coherencia',
        priority: coherencia.score < 50 ? 'high' : 'medium',
        suggestion: s,
      });
    });
  }

  return suggestions;
}

function generateImprovedVersion(
  content: string,
  claridad: ContentFeedbackScore,
  cta: ContentFeedbackScore,
  coherencia: ContentFeedbackScore
): string {
  // Versión simplificada - en producción esto sería generado por IA
  let improved = content;

  // Mejorar CTA si es necesario
  if (cta.score < 65 && !/(comenta|dime|escribe|reserva|agenda|consulta)/gi.test(improved)) {
    improved += '\n\n💬 ¿Quieres más contenido como este? Comenta "MÁS" y te enviaré tips exclusivos.';
  }

  // Mejorar estructura si es necesario
  if (claridad.score < 65 && !improved.includes('\n') && improved.split(/\s+/).length > 100) {
    const sentences = improved.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    improved = sentences.join('.\n\n');
  }

  return improved;
}

