import type { FAQQuestion, FAQContentIdea } from '../types';
import { getLeads } from '../../LeadInboxUnificadoYSla/api/inbox';
import { ConversationService } from '../../LeadInboxUnificadoYSla/services/conversationService';

// Analizar mensajes para identificar preguntas frecuentes
export const analyzeFrequentlyAskedQuestions = async (): Promise<FAQQuestion[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Obtener leads y conversaciones
  const leadsResponse = await getLeads(1, 50);
  const questions: Map<string, FAQQuestion> = new Map();

  // Analizar mensajes de cada lead
  for (const lead of leadsResponse.data) {
    try {
      const messages = await ConversationService.getConversation(lead.id);
      
      // Buscar preguntas en los mensajes entrantes
      messages
        .filter((msg) => msg.direction === 'inbound')
        .forEach((msg) => {
          const questionText = extractQuestion(msg.content);
          if (questionText) {
            const normalized = normalizeQuestion(questionText);
            const existing = questions.get(normalized);
            
            if (existing) {
              existing.frequency += 1;
              if (new Date(msg.timestamp) > new Date(existing.lastAsked)) {
                existing.lastAsked = msg.timestamp;
              }
            } else {
              questions.set(normalized, {
                id: `faq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                question: questionText,
                frequency: 1,
                source: lead.sourceChannel === 'whatsapp' ? 'whatsapp' : 
                        lead.sourceChannel === 'instagram' ? 'instagram' :
                        lead.sourceChannel === 'email' ? 'email' : 'inbox',
                lastAsked: msg.timestamp,
                category: categorizeQuestion(questionText),
              });
            }
          }
        });
    } catch (error) {
      console.error(`Error analizando conversación de lead ${lead.id}:`, error);
    }
  }

  // Ordenar por frecuencia y devolver las top 10
  return Array.from(questions.values())
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);
};

// Extraer pregunta de un mensaje
const extractQuestion = (text: string): string | null => {
  // Buscar patrones de preguntas
  const questionPatterns = [
    /(?:^|\n|\.\s)([¿?]?[^.!?]*[?¿])/gi,
    /(?:^|\n|\.\s)(qué|cuál|cuáles|cuándo|dónde|quién|quiénes|cómo|por qué|cuánto|cuánta|cuántos|cuántas)\s+[^.!?]*[.!?]?/gi,
  ];

  for (const pattern of questionPatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      return matches[0].trim().replace(/^[¿?]/, '').replace(/[?¿]$/, '').trim();
    }
  }

  // Si no hay signos de interrogación, buscar frases que parezcan preguntas
  const questionWords = ['qué', 'cuál', 'cuándo', 'dónde', 'cómo', 'por qué', 'cuánto'];
  const lowerText = text.toLowerCase();
  for (const word of questionWords) {
    if (lowerText.includes(word) && text.length < 200) {
      return text.trim();
    }
  }

  return null;
};

// Normalizar pregunta para agrupar similares
const normalizeQuestion = (question: string): string => {
  return question
    .toLowerCase()
    .trim()
    .replace(/[¿?]/g, '')
    .replace(/\s+/g, ' ')
    .substring(0, 100);
};

// Categorizar pregunta
const categorizeQuestion = (question: string): string => {
  const lower = question.toLowerCase();
  
  if (lower.includes('precio') || lower.includes('costo') || lower.includes('cuánto cuesta')) {
    return 'Precios';
  }
  if (lower.includes('horario') || lower.includes('disponibilidad') || lower.includes('cuándo')) {
    return 'Horarios';
  }
  if (lower.includes('plan') || lower.includes('programa') || lower.includes('servicio')) {
    return 'Planes y Servicios';
  }
  if (lower.includes('nutrición') || lower.includes('dieta') || lower.includes('alimentación')) {
    return 'Nutrición';
  }
  if (lower.includes('ejercicio') || lower.includes('entrenamiento') || lower.includes('rutina')) {
    return 'Entrenamiento';
  }
  if (lower.includes('resultado') || lower.includes('tiempo') || lower.includes('cuánto tarda')) {
    return 'Resultados';
  }
  
  return 'General';
};

// Generar ideas de contenido basadas en preguntas frecuentes
export const generateFAQContentIdeas = async (): Promise<FAQContentIdea[]> => {
  const questions = await analyzeFrequentlyAskedQuestions();
  
  const ideas: FAQContentIdea[] = questions.map((faq) => {
    const formats = determineBestFormats(faq.question, faq.category);
    const contentIdeas = formats.map((format) => generateContentIdeaForFormat(faq, format));
    
    return {
      id: `idea_${faq.id}`,
      question: faq.question,
      suggestedFormats: formats,
      contentIdeas,
      priority: faq.frequency >= 5 ? 'high' : faq.frequency >= 3 ? 'medium' : 'low',
    };
  });

  return ideas;
};

// Determinar mejores formatos según la pregunta
const determineBestFormats = (question: string, category?: string): Array<'post' | 'reel' | 'carousel' | 'story'> => {
  const lower = question.toLowerCase();
  const formats: Array<'post' | 'reel' | 'carousel' | 'story'> = ['post'];
  
  // Reels para contenido educativo visual
  if (category === 'Entrenamiento' || category === 'Nutrición' || lower.includes('cómo')) {
    formats.push('reel');
  }
  
  // Carruseles para contenido educativo con múltiples puntos
  if (category === 'Planes y Servicios' || lower.includes('cuáles') || lower.includes('tipos')) {
    formats.push('carousel');
  }
  
  // Stories para contenido rápido y directo
  if (category === 'Precios' || category === 'Horarios') {
    formats.push('story');
  }
  
  return formats.slice(0, 3); // Máximo 3 formatos
};

// Generar idea de contenido para un formato específico
const generateContentIdeaForFormat = (
  faq: FAQQuestion,
  format: 'post' | 'reel' | 'carousel' | 'story'
): FAQContentIdea['contentIdeas'][0] => {
  const hooks: Record<string, string> = {
    post: `¿${faq.question}? Te lo explico aquí 👇`,
    reel: `La respuesta a: "${faq.question}"`,
    carousel: `Todo lo que necesitas saber sobre: ${faq.question}`,
    story: `Pregunta frecuente: ${faq.question}`,
  };

  const keyPoints = generateKeyPoints(faq.question, faq.category);
  
  const ctas: Record<string, string> = {
    post: '¿Tienes más dudas? Escríbeme en DM',
    reel: 'Guarda este reel para no olvidarlo',
    carousel: 'Comparte si te resultó útil',
    story: 'Responde a esta story con tu pregunta',
  };

  return {
    format,
    title: `Contenido educativo: ${faq.question.substring(0, 50)}${faq.question.length > 50 ? '...' : ''}`,
    hook: hooks[format] || hooks.post,
    keyPoints,
    cta: ctas[format] || ctas.post,
  };
};

// Generar puntos clave según la pregunta
const generateKeyPoints = (question: string, category?: string): string[] => {
  const lower = question.toLowerCase();
  const points: string[] = [];

  if (category === 'Precios') {
    points.push('Planes flexibles adaptados a tu presupuesto');
    points.push('Consulta gratuita para evaluar tus necesidades');
    points.push('Opciones de pago mensual, trimestral o anual');
  } else if (category === 'Horarios') {
    points.push('Horarios flexibles de lunes a domingo');
    points.push('Sesiones presenciales y online disponibles');
    points.push('Agenda tu sesión según tu disponibilidad');
  } else if (category === 'Planes y Servicios') {
    points.push('Entrenamiento personalizado según tus objetivos');
    points.push('Seguimiento nutricional incluido');
    points.push('Ajustes continuos del plan según tu progreso');
  } else if (category === 'Nutrición') {
    points.push('Plan nutricional personalizado');
    points.push('Educación sobre alimentación saludable');
    points.push('Seguimiento y ajustes semanales');
  } else if (category === 'Entrenamiento') {
    points.push('Rutinas adaptadas a tu nivel');
    points.push('Técnica correcta en cada ejercicio');
    points.push('Progresión constante y segura');
  } else {
    points.push('Respuesta directa y clara');
    points.push('Información basada en experiencia');
    points.push('Soporte continuo para tus dudas');
  }

  return points.slice(0, 3);
};

