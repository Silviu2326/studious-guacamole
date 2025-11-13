import { Testimonial, SuccessStory, SuccessStoryTemplate, ContentType, SuccessStoryFormat } from '../types';

// Simulación de delay
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Clonar datos para evitar mutaciones
function cloneData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

// Mock data para historias de éxito
const MOCK_SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 'story_001',
    title: 'De sedentario a corredor de 10K en 3 meses',
    description: 'Historia de transformación completa de un cliente que logró su objetivo de correr 10K',
    sourceTestimonialId: 'test_001',
    clientId: 'cliente_001',
    clientName: 'Carlos Martínez',
    clientRole: 'Ejecutivo',
    storyContent: {
      headline: 'De 0 a 10K: Cómo Carlos transformó su vida en 90 días',
      challenge: 'Carlos llevaba años sin hacer ejercicio, trabajaba 12 horas al día y tenía sobrepeso. Su objetivo era correr 10K pero no sabía por dónde empezar.',
      solution: 'Creamos un plan personalizado que se adaptaba a su horario laboral, combinando entrenamientos de fuerza y cardio progresivos, con seguimiento constante y ajustes semanales.',
      results: 'En solo 3 meses, Carlos no solo completó su primer 10K, sino que perdió 8kg, mejoró su energía y ahora corre regularmente. Su testimonio refleja la transformación completa.',
      quote: '"Nunca pensé que podría lograrlo. El apoyo constante y el plan personalizado hicieron la diferencia. Ahora el ejercicio es parte de mi vida."',
      metrics: [
        { label: 'Pérdida de peso', value: '8 kg', improvement: '12%' },
        { label: 'Tiempo en 10K', value: '52 min', improvement: 'Nuevo logro' },
        { label: 'Energía diaria', value: '+85%', improvement: 'Medido por auto-reporte' },
      ],
    },
    format: 'case-study',
    tags: ['pérdida de peso', 'running', 'transformación', 'ejecutivos'],
    category: 'pérdida de peso',
    status: 'published',
    usedInContent: [
      {
        contentType: 'funnel',
        contentId: 'funnel_premium',
        contentName: 'Funnel Premium',
        publishedAt: '2025-10-01T00:00:00Z',
      },
      {
        contentType: 'landing-page',
        contentId: 'lp_running',
        contentName: 'Landing Running',
        publishedAt: '2025-10-05T00:00:00Z',
      },
    ],
    createdAt: '2025-09-15T00:00:00Z',
    publishedAt: '2025-09-20T00:00:00Z',
    performance: {
      views: 1250,
      conversions: 45,
      engagementRate: 3.6,
      shares: 23,
    },
    aiGenerated: true,
    aiMetadata: {
      generatedAt: '2025-09-15T00:00:00Z',
      model: 'gpt-4',
      confidenceScore: 92,
    },
  },
];

const MOCK_TEMPLATES: SuccessStoryTemplate[] = [
  {
    id: 'template_001',
    name: 'Template Funnel de Ventas',
    description: 'Template optimizado para funnels de ventas premium',
    contentType: 'funnel',
    template: {
      headlineTemplate: '{cliente} logró {objetivo} en {tiempo}',
      challengeTemplate: '{cliente} enfrentaba {desafío}. {contexto adicional}',
      solutionTemplate: 'Creamos {solución personalizada} que se adaptaba a {situación específica}',
      resultsTemplate: 'En {tiempo}, {cliente} no solo {logro principal}, sino que {beneficios adicionales}',
    },
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'template_002',
    name: 'Template Social Media',
    description: 'Template para posts en redes sociales',
    contentType: 'social-media',
    template: {
      headlineTemplate: '🔥 {cliente} transformó su vida: {logro}',
      challengeTemplate: 'Antes: {desafío}',
      solutionTemplate: 'Solución: {solución breve}',
      resultsTemplate: 'Ahora: {resultados impactantes}',
    },
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
];

export const SuccessStoriesAPI = {
  /**
   * Obtiene todas las historias de éxito
   */
  async getSuccessStories(): Promise<SuccessStory[]> {
    await delay(200);
    return cloneData(MOCK_SUCCESS_STORIES);
  },

  /**
   * Obtiene una historia de éxito por ID
   */
  async getSuccessStory(storyId: string): Promise<SuccessStory | null> {
    await delay(150);
    const story = MOCK_SUCCESS_STORIES.find((s) => s.id === storyId);
    return story ? cloneData(story) : null;
  },

  /**
   * Convierte un testimonio positivo en una historia de éxito
   */
  async convertTestimonialToSuccessStory(
    testimonial: Testimonial,
    options?: {
      format?: SuccessStoryFormat;
      contentType?: ContentType;
      templateId?: string;
    },
  ): Promise<SuccessStory> {
    await delay(800); // Simular generación IA

    const format = options?.format || 'case-study';
    const contentType = options?.contentType || 'funnel';

    // Generar contenido de la historia basado en el testimonio
    const storyContent = generateStoryContent(testimonial, options?.templateId);

    // Extraer categoría y tags del testimonio
    const category = extractCategory(testimonial);
    const tags = extractTags(testimonial);

    // Generar título
    const title = generateTitle(testimonial, category);

    const successStory: SuccessStory = {
      id: `story_${Date.now()}`,
      title,
      description: `Historia de éxito generada del testimonio de ${testimonial.customerName}`,
      sourceTestimonialId: testimonial.id,
      sourceTestimonial: testimonial,
      clientId: testimonial.customerId || `client_${Date.now()}`,
      clientName: testimonial.customerName,
      clientRole: testimonial.role,
      storyContent,
      format,
      tags,
      category,
      status: 'draft',
      usedInContent: [],
      createdAt: new Date().toISOString(),
      aiGenerated: true,
      aiMetadata: {
        generatedAt: new Date().toISOString(),
        model: 'gpt-4',
        confidenceScore: 88,
      },
    };

    return cloneData(successStory);
  },

  /**
   * Actualiza una historia de éxito
   */
  async updateSuccessStory(
    storyId: string,
    updates: Partial<SuccessStory>,
  ): Promise<SuccessStory> {
    await delay(300);
    const story = MOCK_SUCCESS_STORIES.find((s) => s.id === storyId);
    if (!story) {
      throw new Error(`Historia de éxito no encontrada: ${storyId}`);
    }
    const updated = { ...story, ...updates, updatedAt: new Date().toISOString() };
    return cloneData(updated);
  },

  /**
   * Publica una historia de éxito
   */
  async publishSuccessStory(storyId: string): Promise<SuccessStory> {
    await delay(200);
    const story = await this.updateSuccessStory(storyId, {
      status: 'published',
      publishedAt: new Date().toISOString(),
    });
    return story;
  },

  /**
   * Agrega una historia de éxito a un contenido (funnel, landing page, etc.)
   */
  async addToContent(
    storyId: string,
    contentType: ContentType,
    contentId?: string,
    contentName?: string,
  ): Promise<SuccessStory> {
    await delay(200);
    const story = await this.getSuccessStory(storyId);
    if (!story) {
      throw new Error(`Historia de éxito no encontrada: ${storyId}`);
    }

    const newUsage = {
      contentType,
      contentId,
      contentName,
      publishedAt: new Date().toISOString(),
    };

    const updatedUsedInContent = [...(story.usedInContent || []), newUsage];

    return this.updateSuccessStory(storyId, {
      usedInContent: updatedUsedInContent,
    });
  },

  /**
   * Obtiene los templates disponibles
   */
  async getTemplates(): Promise<SuccessStoryTemplate[]> {
    await delay(150);
    return cloneData(MOCK_TEMPLATES);
  },

  /**
   * Obtiene historias de éxito por categoría
   */
  async getStoriesByCategory(category: string): Promise<SuccessStory[]> {
    await delay(200);
    const stories = await this.getSuccessStories();
    return stories.filter((s) => s.category === category);
  },

  /**
   * Obtiene historias de éxito usadas en un tipo de contenido específico
   */
  async getStoriesByContentType(contentType: ContentType): Promise<SuccessStory[]> {
    await delay(200);
    const stories = await this.getSuccessStories();
    return stories.filter((s) =>
      s.usedInContent.some((usage) => usage.contentType === contentType),
    );
  },
};

// Funciones auxiliares

function generateStoryContent(
  testimonial: Testimonial,
  templateId?: string,
): SuccessStory['storyContent'] {
  // Si hay template, usar sus plantillas
  const template = templateId
    ? MOCK_TEMPLATES.find((t) => t.id === templateId)
    : MOCK_TEMPLATES[0];

  // Extraer información del testimonio
  const quote = testimonial.quote;
  const clientName = testimonial.customerName.split(' ')[0]; // Primer nombre

  // Generar desafío basado en tags y contenido
  const challenge = generateChallenge(testimonial);

  // Generar solución
  const solution = generateSolution(testimonial);

  // Generar resultados
  const results = generateResults(testimonial);

  // Generar headline
  const headline = generateHeadline(testimonial, template);

  // Extraer métricas si están disponibles en tags
  const metrics = extractMetrics(testimonial);

  return {
    headline,
    challenge,
    solution,
    results,
    quote,
    metrics,
  };
}

function generateChallenge(testimonial: Testimonial): string {
  const tags = testimonial.tags || [];
  const quote = testimonial.quote.toLowerCase();

  if (tags.includes('pérdida de peso') || quote.includes('peso') || quote.includes('sobrepeso')) {
    return `${testimonial.customerName.split(' ')[0]} tenía dificultades con su peso y no encontraba una rutina que funcionara para su estilo de vida.`;
  }
  if (tags.includes('ganancia muscular') || quote.includes('músculo') || quote.includes('fuerza')) {
    return `${testimonial.customerName.split(' ')[0]} quería ganar masa muscular pero no veía resultados con sus entrenamientos anteriores.`;
  }
  if (tags.includes('running') || quote.includes('correr') || quote.includes('carrera')) {
    return `${testimonial.customerName.split(' ')[0]} quería empezar a correr pero no sabía por dónde comenzar.`;
  }
  if (tags.includes('rehabilitación') || quote.includes('lesión') || quote.includes('dolor')) {
    return `${testimonial.customerName.split(' ')[0]} necesitaba recuperarse de una lesión y volver a hacer ejercicio de forma segura.`;
  }

  return `${testimonial.customerName.split(' ')[0]} buscaba mejorar su condición física y alcanzar sus objetivos de entrenamiento.`;
}

function generateSolution(testimonial: Testimonial): string {
  const tags = testimonial.tags || [];
  const quote = testimonial.quote.toLowerCase();

  if (quote.includes('personalizado') || quote.includes('adaptado')) {
    return `Creamos un plan completamente personalizado que se adaptaba a sus necesidades específicas, con seguimiento constante y ajustes regulares.`;
  }
  if (quote.includes('apoyo') || quote.includes('motivación')) {
    return `Desarrollamos un programa que combinaba entrenamiento efectivo con el apoyo y motivación necesarios para mantener la consistencia.`;
  }
  if (tags.includes('nutrición') || quote.includes('alimentación')) {
    return `Implementamos un enfoque integral que combinaba entrenamiento personalizado con asesoramiento nutricional.`;
  }

  return `Diseñamos un programa de entrenamiento específico para sus objetivos, con un enfoque progresivo y sostenible.`;
}

function generateResults(testimonial: Testimonial): string {
  const score = testimonial.score;
  const quote = testimonial.quote;
  const clientName = testimonial.customerName.split(' ')[0];

  let results = `Con una puntuación de ${score}/5, ${clientName} logró resultados significativos. `;

  if (quote.length > 100) {
    // Si el testimonio es largo, probablemente tiene detalles
    results += `Su testimonio refleja una transformación completa no solo física, sino también en su confianza y bienestar general.`;
  } else {
    results += `El testimonio destaca los cambios positivos y la satisfacción con el proceso.`;
  }

  return results;
}

function generateHeadline(
  testimonial: Testimonial,
  template?: SuccessStoryTemplate,
): string {
  const clientName = testimonial.customerName.split(' ')[0];
  const tags = testimonial.tags || [];

  if (template) {
    // Usar template si está disponible
    let headline = template.template.headlineTemplate;
    headline = headline.replace('{cliente}', clientName);

    // Extraer objetivo de tags o testimonio
    const objective = extractObjective(testimonial);
    headline = headline.replace('{objetivo}', objective);

    // Extraer tiempo si está disponible
    const time = extractTime(testimonial);
    headline = headline.replace('{tiempo}', time);

    return headline;
  }

  // Generar headline sin template
  if (tags.includes('pérdida de peso')) {
    return `Cómo ${clientName} transformó su cuerpo y su vida`;
  }
  if (tags.includes('ganancia muscular')) {
    return `${clientName} logró ganar masa muscular y fuerza`;
  }
  if (tags.includes('running')) {
    return `De principiante a corredor: La historia de ${clientName}`;
  }

  return `La transformación de ${clientName}: De testimonio a historia de éxito`;
}

function extractObjective(testimonial: Testimonial): string {
  const tags = testimonial.tags || [];
  const quote = testimonial.quote.toLowerCase();

  if (tags.includes('pérdida de peso')) return 'perder peso';
  if (tags.includes('ganancia muscular')) return 'ganar masa muscular';
  if (tags.includes('running')) return 'completar su primera carrera';
  if (tags.includes('rehabilitación')) return 'recuperarse de su lesión';
  if (quote.includes('objetivo')) {
    // Intentar extraer del quote
    const match = quote.match(/objetivo[^.]*\./);
    if (match) return match[0].replace('objetivo', '').trim();
  }

  return 'alcanzar sus objetivos';
}

function extractTime(testimonial: Testimonial): string {
  const quote = testimonial.quote.toLowerCase();
  const timeMatch = quote.match(/(\d+)\s*(mes|meses|semana|semanas|día|días)/);
  if (timeMatch) {
    return `${timeMatch[1]} ${timeMatch[2]}`;
  }
  return 'pocos meses';
}

function extractCategory(testimonial: Testimonial): string | undefined {
  const tags = testimonial.tags || [];
  const quote = testimonial.quote.toLowerCase();

  if (tags.includes('pérdida de peso') || quote.includes('peso')) return 'pérdida de peso';
  if (tags.includes('ganancia muscular') || quote.includes('músculo')) return 'ganancia muscular';
  if (tags.includes('running') || quote.includes('correr')) return 'running';
  if (tags.includes('rehabilitación') || quote.includes('lesión')) return 'rehabilitación';
  if (tags.includes('flexibilidad') || quote.includes('flexibilidad')) return 'flexibilidad';

  return undefined;
}

function extractTags(testimonial: Testimonial): string[] {
  const tags = [...(testimonial.tags || [])];
  const quote = testimonial.quote.toLowerCase();

  // Agregar tags basados en el contenido si no existen
  if (!tags.some((t) => t.includes('transformación')) && quote.includes('transform')) {
    tags.push('transformación');
  }
  if (!tags.some((t) => t.includes('éxito')) && testimonial.score >= 4.5) {
    tags.push('historia de éxito');
  }

  return tags;
}

function extractMetrics(testimonial: Testimonial): SuccessStory['storyContent']['metrics'] {
  const quote = testimonial.quote;
  const metrics: SuccessStory['storyContent']['metrics'] = [];

  // Buscar números que puedan ser métricas
  const weightMatch = quote.match(/(\d+)\s*kg/);
  if (weightMatch) {
    metrics.push({
      label: 'Pérdida/Ganancia de peso',
      value: `${weightMatch[1]} kg`,
    });
  }

  const percentMatch = quote.match(/(\d+)%/);
  if (percentMatch) {
    metrics.push({
      label: 'Mejora',
      value: `${percentMatch[1]}%`,
    });
  }

  // Si hay score alto, agregar como métrica
  if (testimonial.score >= 4.5) {
    metrics.push({
      label: 'Satisfacción',
      value: `${testimonial.score}/5`,
      improvement: 'Excelente',
    });
  }

  return metrics.length > 0 ? metrics : undefined;
}

function generateTitle(testimonial: Testimonial, category?: string): string {
  const clientName = testimonial.customerName.split(' ')[0];
  const tags = testimonial.tags || [];

  if (category === 'pérdida de peso') {
    return `Cómo ${clientName} transformó su cuerpo y perdió peso`;
  }
  if (category === 'ganancia muscular') {
    return `${clientName}: De principiante a atleta`;
  }
  if (category === 'running') {
    return `La historia de ${clientName}: De 0 a corredor`;
  }

  if (tags.includes('transformación')) {
    return `La transformación de ${clientName}`;
  }

  return `Historia de éxito: ${clientName}`;
}

