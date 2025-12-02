// API para generación creativa con IA

export type ContentTemplate = 
  | 'instagram_post' 
  | 'email_promocional' 
  | 'blog_idea' 
  | 'video_script' 
  | 'caption_motivacional'
  | 'sales_email'
  | 'challenge_description'
  | 'other';

export type ToneOfVoice = 
  | 'motivational' 
  | 'educational' 
  | 'energetic' 
  | 'empathetic' 
  | 'scientific' 
  | 'direct' 
  | 'custom';

export interface ContentTemplateOption {
  id: ContentTemplate;
  name: string;
  description: string;
  icon?: string;
}

export interface GenerationSettings {
  tone?: ToneOfVoice;
  customTone?: string;
  targetAudience?: string;
  length?: 'short' | 'medium' | 'long';
  language?: string;
  callToAction?: string;
  keywords?: string[];
}

export interface GenerationRequest {
  templateId: ContentTemplate;
  prompt: string;
  settings?: GenerationSettings;
}

export interface GenerationResult {
  id: string;
  text: string;
}

export interface GenerationResponse {
  generationId: string;
  results: GenerationResult[];
  tokensUsed: number;
  createdAt: string;
}

export interface GenerationHistoryItem {
  generationId: string;
  templateId: ContentTemplate;
  templateName: string;
  prompt: string;
  createdAt: string;
  savedResult?: string;
}

export interface GenerationHistoryResponse {
  page: number;
  totalPages: number;
  totalResults: number;
  results: GenerationHistoryItem[];
}

export interface BrandProfile {
  trainerId: string;
  toneOfVoice: string;
  customTone?: string;
  targetAudience?: string;
  keywords?: string[];
  updatedAt?: string;
}

// Funciones API simuladas (a implementar con backend real)
export const generateContent = async (
  request: GenerationRequest
): Promise<GenerationResponse> => {
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simular delay de IA
  
  // Generar resultados simulados basados en la plantilla y prompt
  const results: GenerationResult[] = [
    {
      id: 'res_001',
      text: generateMockContent(request.templateId, request.prompt, request.settings)
    },
    {
      id: 'res_002',
      text: generateMockContent(request.templateId, request.prompt, request.settings, 2)
    },
    {
      id: 'res_003',
      text: generateMockContent(request.templateId, request.prompt, request.settings, 3)
    }
  ];

  return {
    generationId: `gen_${Date.now()}`,
    results,
    tokensUsed: 150,
    createdAt: new Date().toISOString()
  };
};

function generateMockContent(
  templateId: ContentTemplate,
  prompt: string,
  settings?: GenerationSettings,
  variant: number = 1
): string {
  // Generar contenido simulado basado en la plantilla
  const tones: Record<string, string[]> = {
    motivational: ['¡Transforma tu cuerpo y mente!', 'Supera tus límites', 'Tu mejor versión te espera'],
    educational: ['Basado en evidencia científica', 'Estudios demuestran que', 'La investigación muestra'],
    energetic: ['¡Vamos!', '¡Ahora es el momento!', '¡Haz que suceda!'],
    empathetic: ['Entendemos tu situación', 'Estamos aquí para apoyarte', 'Cada paso cuenta'],
    scientific: ['Según los últimos estudios', 'Los datos indican', 'La evidencia sugiere'],
    direct: ['Sin rodeos', 'Directo al grano', 'Aquí está lo que necesitas saber']
  };

  const tone = settings?.tone || 'motivational';
  const tonePhrases = tones[tone] || tones.motivational;

  switch (templateId) {
    case 'instagram_post':
      return `${tonePhrases[variant % tonePhrases.length]} 🔥\n\n${prompt}\n\n${settings?.callToAction || '#fitness #entrenadorpersonal #motivacion'}`;
    
    case 'email_promocional':
      return `Asunto: ${prompt}\n\nEstimado/a cliente,\n\n${tonePhrases[variant % tonePhrases.length]}. ${prompt}\n\n${settings?.callToAction || '¡No te lo pierdas!'}\n\nUn saludo,\nTu entrenador`;
    
    case 'blog_idea':
      return `# ${prompt}\n\n## Introducción\n${tonePhrases[variant % tonePhrases.length]}. Este artículo explora...\n\n## Puntos clave:\n1. Primero...\n2. Segundo...\n3. Tercero...\n\n## Conclusión\nEn resumen...`;
    
    case 'video_script':
      return `[0:00-0:05] Hook: ${tonePhrases[variant % tonePhrases.length]}\n[0:05-0:30] Desarrollo: ${prompt}\n[0:30-0:45] CTA: ${settings?.callToAction || 'Suscríbete para más consejos'}`;
    
    case 'caption_motivacional':
      return `${tonePhrases[variant % tonePhrases.length]} 💪\n\n${prompt}\n\nRecuerda: cada pequeño paso te acerca a tu meta. ¡Sigue adelante! ✨`;
    
    case 'sales_email':
      return `Asunto: ${prompt} - Oferta Especial\n\nHola,\n\n${tonePhrases[variant % tonePhrases.length]}. ${prompt}\n\nBeneficios:\n• Resultados garantizados\n• Soporte personalizado\n• Comunidad exclusiva\n\n${settings?.callToAction || 'Reserva tu lugar ahora →'}`;
    
    case 'challenge_description':
      return `# ${prompt}\n\n${tonePhrases[variant % tonePhrases.length]}! Este reto está diseñado para...\n\n## ¿Qué incluye?\n- Plan de entrenamiento\n- Seguimiento personalizado\n- Grupo de apoyo\n\n${settings?.callToAction || '¡Únete ahora!'}`;
    
    default:
      return `Contenido generado para: ${prompt}\n\n${tonePhrases[variant % tonePhrases.length]}. ${prompt}`;
  }
}

export const getGenerationHistory = async (params?: {
  page?: number;
  limit?: number;
}): Promise<GenerationHistoryResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const templates: ContentTemplateOption[] = getContentTemplates();
  
  const mockHistory: GenerationHistoryItem[] = [
    {
      generationId: 'gen_a1b2c3d4',
      templateId: 'instagram_post',
      templateName: 'Post de Instagram',
      prompt: 'Post sobre beneficios de la creatina',
      createdAt: '2024-08-15T10:00:00Z',
      savedResult: 'La creatina es uno de los suplementos más estudiados y efectivos...'
    },
    {
      generationId: 'gen_b2c3d4e5',
      templateId: 'email_promocional',
      templateName: 'Email Promocional',
      prompt: 'Anunciar nuevo programa de entrenamiento',
      createdAt: '2024-08-14T14:30:00Z'
    },
    {
      generationId: 'gen_c3d4e5f6',
      templateId: 'blog_idea',
      templateName: 'Idea para Blog',
      prompt: '5 beneficios del entrenamiento funcional',
      createdAt: '2024-08-13T09:15:00Z'
    }
  ];
  
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const totalPages = Math.ceil(mockHistory.length / limit);
  
  return {
    page,
    totalPages,
    totalResults: mockHistory.length,
    results: mockHistory.slice((page - 1) * limit, page * limit)
  };
};

export const getContentTemplates = (): ContentTemplateOption[] => {
  return [
    {
      id: 'instagram_post',
      name: 'Post de Instagram',
      description: 'Captions atractivos para posts de Instagram',
      icon: '📱'
    },
    {
      id: 'email_promocional',
      name: 'Email Promocional',
      description: 'Emails persuasivos para promocionar servicios',
      icon: '📧'
    },
    {
      id: 'blog_idea',
      name: 'Idea para Blog',
      description: 'Esquemas y estructuras para artículos de blog',
      icon: '✍️'
    },
    {
      id: 'video_script',
      name: 'Guión para Video',
      description: 'Guiones para Reels, TikToks y videos cortos',
      icon: '🎬'
    },
    {
      id: 'caption_motivacional',
      name: 'Caption Motivacional',
      description: 'Textos inspiradores para celebrar logros',
      icon: '💪'
    },
    {
      id: 'sales_email',
      name: 'Email de Venta',
      description: 'Emails optimizados para conversión',
      icon: '💰'
    },
    {
      id: 'challenge_description',
      name: 'Descripción de Reto',
      description: 'Descripciones atractivas para retos y desafíos',
      icon: '🎯'
    }
  ];
};

export const getBrandProfile = async (): Promise<BrandProfile | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock data - en producción vendría del backend
  return {
    trainerId: 'trn_current',
    toneOfVoice: 'Motivacional, enérgico y directo',
    targetAudience: 'Mujeres de 30-45 años que quieren recuperar su forma física',
    keywords: ['fitness', 'transformación', 'salud'],
    updatedAt: '2024-08-01T10:00:00Z'
  };
};

export const updateBrandProfile = async (
  profile: Omit<BrandProfile, 'trainerId' | 'updatedAt'>
): Promise<BrandProfile> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    trainerId: 'trn_current',
    ...profile,
    updatedAt: new Date().toISOString()
  };
};

export const saveGeneratedContent = async (
  generationId: string,
  resultId: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log('Guardando contenido:', generationId, resultId);
};























