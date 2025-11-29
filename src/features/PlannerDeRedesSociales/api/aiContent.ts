// API para generación de contenido con IA

import { SocialPlatform } from './social';

export interface AIContentRequest {
  topic: string;
  type: 'post' | 'story' | 'reel' | 'video';
  platform: SocialPlatform;
  tone: 'professional' | 'casual' | 'motivational' | 'educational' | 'friendly';
  length: 'short' | 'medium' | 'long';
  includeHashtags: boolean;
  includeCallToAction: boolean;
  context?: string;
}

export interface AIContentResponse {
  id: string;
  content: string;
  hashtags: string[];
  suggestions: string[];
  variations: string[];
  confidence: number;
  generatedAt: string;
}

export interface AIContentHistory {
  id: string;
  request: AIContentRequest;
  response: AIContentResponse;
  used: boolean;
  createdAt: string;
}

export const generateAIContent = async (request: AIContentRequest): Promise<AIContentResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulación de generación de contenido con IA
  const toneMessages: Record<AIContentRequest['tone'], string> = {
    professional: 'Como entrenador personal certificado, te comparto que',
    casual: '¡Hola! Te cuento que',
    motivational: '💪 ¡Tú puedes lograrlo!',
    educational: '¿Sabías que',
    friendly: 'Hola amig@s! 😊'
  };
  
  const topicContent: Record<string, string> = {
    'ejercicio': 'el ejercicio regular es fundamental para mantener un estilo de vida saludable. No se trata solo de estética, sino de bienestar general.',
    'nutricion': 'la nutrición adecuada es el 70% del éxito en cualquier objetivo fitness. Los alimentos son tu combustible.',
    'motivacion': 'cada día es una nueva oportunidad para ser mejor que ayer. La constancia supera la perfección.',
    'transformacion': 'las transformaciones reales toman tiempo, pero cada pequeño paso cuenta. ¡Sigue adelante!',
    'entrenamiento': 'un buen entrenamiento no se mide por cuánto sudas, sino por qué tan bien ejecutas cada movimiento.'
  };
  
  let content = `${toneMessages[request.tone]} ${topicContent[request.topic] || request.topic}.\n\n`;
  
  if (request.length === 'medium' || request.length === 'long') {
    content += 'Recuerda que la clave está en la constancia y la dedicación. Cada pequeño esfuerzo suma hacia tu objetivo final.\n\n';
  }
  
  if (request.includeCallToAction) {
    content += '¿Listo para comenzar tu transformación? ¡Contáctame y empecemos juntos! 💪';
  }
  
  // Ajustar longitud según plataforma
  if (request.platform === 'tiktok') {
    content = content.substring(0, 150);
  } else if (request.platform === 'instagram' && request.length === 'short') {
    content = content.substring(0, 200);
  }
  
  const hashtags = generateHashtags(request.topic, request.platform);
  const variations = generateVariations(content, request.tone);
  
  return {
    id: `ai_${Date.now()}`,
    content,
    hashtags,
    suggestions: [
      'Añade una imagen o video para mayor engagement',
      'Publica en horario de mayor actividad (18:00-20:00)',
      'Responde a los primeros comentarios rápidamente'
    ],
    variations,
    confidence: 85,
    generatedAt: new Date().toISOString()
  };
};

function generateHashtags(topic: string, platform: SocialPlatform): string[] {
  const baseHashtags: Record<string, string[]> = {
    'ejercicio': ['fitness', 'ejercicio', 'entrenamiento', 'salud', 'gym'],
    'nutricion': ['nutricion', 'alimentacion', 'salud', 'fitness', 'dieta'],
    'motivacion': ['motivacion', 'fitnessmotivation', 'exito', 'disciplina', 'metas'],
    'transformacion': ['transformacion', 'resultados', 'antesydespues', 'fitnessmotivation', 'personaltrainer'],
    'entrenamiento': ['entrenamiento', 'fitness', 'gym', 'fuerza', 'ejercicio']
  };
  
  const hashtags = baseHashtags[topic] || ['fitness', 'salud', 'entrenamiento'];
  
  // Añadir hashtags específicos por plataforma
  if (platform === 'instagram') {
    hashtags.push('instafitness', 'fitnesslifestyle');
  } else if (platform === 'tiktok') {
    hashtags.push('fyp', 'fitnessviral');
  }
  
  return hashtags.slice(0, 10);
}

function generateVariations(content: string, tone: AIContentRequest['tone']): string[] {
  const variations: string[] = [];
  
  // Variación 1: Más corta
  variations.push(content.substring(0, Math.floor(content.length * 0.7)) + '...');
  
  // Variación 2: Con emojis diferentes
  const withEmojis = content.replace(/💪/g, '🔥').replace(/😊/g, '✨');
  variations.push(withEmojis);
  
  // Variación 3: Tono ligeramente diferente
  if (tone === 'motivational') {
    variations.push(content.replace('💪', '🚀').replace('puedes', 'vas a'));
  } else {
    variations.push(content);
  }
  
  return variations;
}

export const getAIContentHistory = async (): Promise<AIContentHistory[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: 'hist_001',
      request: {
        topic: 'transformacion',
        type: 'post',
        platform: 'instagram',
        tone: 'motivational',
        length: 'medium',
        includeHashtags: true,
        includeCallToAction: true
      },
      response: {
        id: 'ai_001',
        content: '💪 ¡Tú puedes lograrlo! las transformaciones reales toman tiempo, pero cada pequeño paso cuenta. ¡Sigue adelante!',
        hashtags: ['transformacion', 'resultados', 'fitnessmotivation'],
        suggestions: [],
        variations: [],
        confidence: 85,
        generatedAt: '2024-01-27T10:00:00Z'
      },
      used: true,
      createdAt: '2024-01-27T10:00:00Z'
    }
  ];
};

export const optimizeContentWithAI = async (content: string, platform: SocialPlatform): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simulación de optimización
  let optimized = content;
  
  // Añadir emojis si no hay
  if (!optimized.match(/[\u{1F300}-\u{1F9FF}]/u)) {
    optimized = '💪 ' + optimized;
  }
  
  // Ajustar longitud según plataforma
  if (platform === 'tiktok' && optimized.length > 150) {
    optimized = optimized.substring(0, 147) + '...';
  }
  
  // Mejorar formato
  optimized = optimized.replace(/\n{3,}/g, '\n\n');
  
  return optimized;
};

