import type {
  AITemplate,
  AITemplatePurpose,
  AITemplateFormat,
  AITemplateBalance,
  AITemplateUsage,
  SocialPlatform,
} from '../types';

// Mock AI Templates Data
const mockAITemplates: AITemplate[] = [
  // Educar Templates
  {
    id: 'template_educar_001',
    name: 'Tip de Ejercicio',
    description: 'Explica una técnica o ejercicio específico con beneficios y pasos claros',
    purpose: 'educar',
    format: 'post',
    category: 'Ejercicio',
    structure: {
      hook: '💪 {tema} que cambiará tu rutina',
      body: [
        '¿Sabías que {dato_interesante}?',
        'Aquí te explico cómo hacerlo correctamente:',
        '1. {paso_1}',
        '2. {paso_2}',
        '3. {paso_3}',
        'Beneficios: {beneficios}',
      ],
      cta: '¿Quieres más tips como este? ¡Comenta "TIPS" y te enviaré contenido exclusivo!',
    },
    variables: [
      { key: 'tema', label: 'Tema del ejercicio', type: 'text', required: true },
      { key: 'dato_interesante', label: 'Dato interesante', type: 'text', required: true },
      { key: 'paso_1', label: 'Paso 1', type: 'text', required: true },
      { key: 'paso_2', label: 'Paso 2', type: 'text', required: true },
      { key: 'paso_3', label: 'Paso 3', type: 'text', required: true },
      { key: 'beneficios', label: 'Beneficios', type: 'text', required: true },
    ],
    suggestedHashtags: ['#fitness', '#ejercicio', '#tips', '#salud', '#entrenamiento'],
    platforms: ['instagram', 'facebook', 'linkedin'],
    usageCount: 12,
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    enabled: true,
  },
  {
    id: 'template_educar_002',
    name: 'Mito vs Realidad',
    description: 'Desmiente mitos comunes del fitness con evidencia',
    purpose: 'educar',
    format: 'carousel',
    category: 'Nutrición',
    structure: {
      hook: '🚫 Mito: {mito} | ✅ Realidad: {realidad}',
      body: [
        '¿Cuántas veces has escuchado que {mito}?',
        'La verdad es que {explicacion_realidad}',
        'Estudios muestran que {evidencia}',
        'Conclusión: {conclusion}',
      ],
      cta: '¿Tienes dudas sobre fitness? ¡Déjame un comentario y te ayudo!',
    },
    variables: [
      { key: 'mito', label: 'Mito a desmentir', type: 'text', required: true },
      { key: 'realidad', label: 'Realidad', type: 'text', required: true },
      { key: 'explicacion_realidad', label: 'Explicación', type: 'text', required: true },
      { key: 'evidencia', label: 'Evidencia científica', type: 'text', required: true },
      { key: 'conclusion', label: 'Conclusión', type: 'text', required: true },
    ],
    suggestedHashtags: ['#mitos', '#realidad', '#fitness', '#salud', '#evidencia'],
    platforms: ['instagram', 'facebook'],
    usageCount: 8,
    lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    enabled: true,
  },
  {
    id: 'template_educar_003',
    name: 'Tutorial en Reel',
    description: 'Guía paso a paso en formato video corto',
    purpose: 'educar',
    format: 'reel',
    category: 'Ejercicio',
    structure: {
      hook: 'Aprende {ejercicio} en 30 segundos',
      body: [
        'Paso 1: {paso_1}',
        'Paso 2: {paso_2}',
        'Paso 3: {paso_3}',
        'Consejo pro: {consejo}',
      ],
      cta: 'Guarda este reel para no olvidarlo 💾',
    },
    variables: [
      { key: 'ejercicio', label: 'Nombre del ejercicio', type: 'text', required: true },
      { key: 'paso_1', label: 'Paso 1', type: 'text', required: true },
      { key: 'paso_2', label: 'Paso 2', type: 'text', required: true },
      { key: 'paso_3', label: 'Paso 3', type: 'text', required: true },
      { key: 'consejo', label: 'Consejo profesional', type: 'text', required: true },
    ],
    suggestedHashtags: ['#reel', '#tutorial', '#ejercicio', '#fitness', '#aprende'],
    platforms: ['instagram', 'tiktok'],
    usageCount: 15,
    lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    enabled: true,
  },
  // Inspirar Templates
  {
    id: 'template_inspirar_001',
    name: 'Historia de Transformación',
    description: 'Comparte el viaje de un cliente con resultados',
    purpose: 'inspirar',
    format: 'post',
    category: 'Motivación',
    structure: {
      hook: '✨ La transformación de {nombre_cliente} te inspirará',
      body: [
        'Hace {tiempo} {nombre_cliente} comenzó su viaje con {objetivo}',
        'El camino no fue fácil: {desafio}',
        'Pero con dedicación y constancia, logró {resultado}',
        'Mensaje de {nombre_cliente}: "{mensaje_inspirador}"',
        '¿Estás listo para empezar tu transformación?',
      ],
      cta: 'Comparte tu historia en los comentarios. ¡Cada viaje es único!',
    },
    variables: [
      { key: 'nombre_cliente', label: 'Nombre del cliente', type: 'text', required: true },
      { key: 'tiempo', label: 'Tiempo transcurrido', type: 'text', required: true },
      { key: 'objetivo', label: 'Objetivo inicial', type: 'text', required: true },
      { key: 'desafio', label: 'Desafío enfrentado', type: 'text', required: true },
      { key: 'resultado', label: 'Resultado alcanzado', type: 'text', required: true },
      { key: 'mensaje_inspirador', label: 'Mensaje del cliente', type: 'text', required: true },
    ],
    suggestedHashtags: ['#transformacion', '#motivacion', '#exito', '#fitness', '#inspiracion'],
    platforms: ['instagram', 'facebook', 'linkedin'],
    usageCount: 20,
    lastUsed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    enabled: true,
  },
  {
    id: 'template_inspirar_002',
    name: 'Cita Motivacional',
    description: 'Comparte una frase inspiradora con contexto personal',
    purpose: 'inspirar',
    format: 'story',
    category: 'Motivación',
    structure: {
      hook: '💭 "{cita}"',
      body: [
        'Esta frase me recuerda que {reflexion_personal}',
        'En el fitness, como en la vida, {aplicacion}',
        'Recuerda: {mensaje_final}',
      ],
      cta: 'Guarda esta historia y compártela cuando necesites motivación',
    },
    variables: [
      { key: 'cita', label: 'Cita motivacional', type: 'text', required: true },
      { key: 'reflexion_personal', label: 'Tu reflexión', type: 'text', required: true },
      { key: 'aplicacion', label: 'Aplicación en fitness', type: 'text', required: true },
      { key: 'mensaje_final', label: 'Mensaje final', type: 'text', required: true },
    ],
    suggestedHashtags: ['#motivacion', '#inspiracion', '#fitness', '#mindset', '#mentalidad'],
    platforms: ['instagram', 'facebook'],
    usageCount: 25,
    lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    enabled: true,
  },
  {
    id: 'template_inspirar_003',
    name: 'Reto Semanal',
    description: 'Lanza un reto que motive a tu audiencia',
    purpose: 'inspirar',
    format: 'carousel',
    category: 'Retos',
    structure: {
      hook: '🔥 Reto de la semana: {reto}',
      body: [
        'Este reto te ayudará a {beneficio}',
        'Cómo participar:',
        '1. {paso_1}',
        '2. {paso_2}',
        '3. Comparte tu progreso con #{hashtag_reto}',
        '¡Vamos juntos! 💪',
      ],
      cta: '¿Te unes al reto? Comenta "RETO" y te doy todos los detalles',
    },
    variables: [
      { key: 'reto', label: 'Nombre del reto', type: 'text', required: true },
      { key: 'beneficio', label: 'Beneficio del reto', type: 'text', required: true },
      { key: 'paso_1', label: 'Paso 1', type: 'text', required: true },
      { key: 'paso_2', label: 'Paso 2', type: 'text', required: true },
      { key: 'hashtag_reto', label: 'Hashtag del reto', type: 'hashtag', required: true },
    ],
    suggestedHashtags: ['#reto', '#fitness', '#desafio', '#motivacion', '#comunidad'],
    platforms: ['instagram', 'facebook'],
    usageCount: 10,
    lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    enabled: true,
  },
  // Vender Templates
  {
    id: 'template_vender_001',
    name: 'Lanzamiento de Plan',
    description: 'Anuncia un nuevo plan o servicio con valor claro',
    purpose: 'vender',
    format: 'post',
    category: 'Servicios',
    structure: {
      hook: '🎯 Nuevo plan: {nombre_plan}',
      body: [
        '¿Quieres {beneficio_principal}?',
        'Te presento {nombre_plan}, diseñado para {objetivo}',
        'Incluye:',
        '✓ {beneficio_1}',
        '✓ {beneficio_2}',
        '✓ {beneficio_3}',
        'Precio especial: {precio} (antes {precio_anterior})',
        'Plazas limitadas: {plazas_disponibles}',
      ],
      cta: 'Reserva tu plaza ahora → {link_inscripcion}',
    },
    variables: [
      { key: 'nombre_plan', label: 'Nombre del plan', type: 'text', required: true },
      { key: 'beneficio_principal', label: 'Beneficio principal', type: 'text', required: true },
      { key: 'objetivo', label: 'Objetivo del plan', type: 'text', required: true },
      { key: 'beneficio_1', label: 'Beneficio 1', type: 'text', required: true },
      { key: 'beneficio_2', label: 'Beneficio 2', type: 'text', required: true },
      { key: 'beneficio_3', label: 'Beneficio 3', type: 'text', required: true },
      { key: 'precio', label: 'Precio', type: 'text', required: true },
      { key: 'precio_anterior', label: 'Precio anterior', type: 'text', required: false },
      { key: 'plazas_disponibles', label: 'Plazas disponibles', type: 'number', required: true },
      { key: 'link_inscripcion', label: 'Link de inscripción', type: 'url', required: true },
    ],
    suggestedHashtags: ['#planes', '#servicios', '#fitness', '#oferta', '#entrenamiento'],
    platforms: ['instagram', 'facebook', 'linkedin'],
    usageCount: 5,
    lastUsed: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    enabled: true,
  },
  {
    id: 'template_vender_002',
    name: 'Oferta Limitada',
    description: 'Crea urgencia con una oferta por tiempo limitado',
    purpose: 'vender',
    format: 'story',
    category: 'Promociones',
    structure: {
      hook: '⏰ OFERTA FLASH: {descuento}% OFF',
      body: [
        'Solo hoy: {oferta}',
        'Válido hasta: {fecha_limite}',
        'Incluye: {beneficios}',
        'No te lo pierdas 🎁',
      ],
      cta: 'Reserva ahora → {link}',
    },
    variables: [
      { key: 'descuento', label: 'Porcentaje de descuento', type: 'number', required: true },
      { key: 'oferta', label: 'Descripción de la oferta', type: 'text', required: true },
      { key: 'fecha_limite', label: 'Fecha límite', type: 'date', required: true },
      { key: 'beneficios', label: 'Beneficios incluidos', type: 'text', required: true },
      { key: 'link', label: 'Link de compra', type: 'url', required: true },
    ],
    suggestedHashtags: ['#oferta', '#descuento', '#flash', '#fitness', '#promocion'],
    platforms: ['instagram', 'facebook'],
    usageCount: 8,
    lastUsed: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    enabled: true,
  },
  {
    id: 'template_vender_003',
    name: 'Testimonio con CTA',
    description: 'Combina testimonio de cliente con llamada a la acción',
    purpose: 'vender',
    format: 'carousel',
    category: 'Testimonios',
    structure: {
      hook: '💬 "{testimonio_cita}" - {nombre_cliente}',
      body: [
        'Conoce la historia de {nombre_cliente}',
        'Antes: {situacion_inicial}',
        'Después: {resultado}',
        'Cómo lo logró: {proceso}',
        '¿Quieres resultados similares?',
      ],
      cta: 'Agenda una consulta gratis → {link_consulta}',
    },
    variables: [
      { key: 'testimonio_cita', label: 'Cita del testimonio', type: 'text', required: true },
      { key: 'nombre_cliente', label: 'Nombre del cliente', type: 'text', required: true },
      { key: 'situacion_inicial', label: 'Situación inicial', type: 'text', required: true },
      { key: 'resultado', label: 'Resultado alcanzado', type: 'text', required: true },
      { key: 'proceso', label: 'Proceso seguido', type: 'text', required: true },
      { key: 'link_consulta', label: 'Link de consulta', type: 'url', required: true },
    ],
    suggestedHashtags: ['#testimonio', '#resultados', '#fitness', '#exito', '#consulta'],
    platforms: ['instagram', 'facebook', 'linkedin'],
    usageCount: 12,
    lastUsed: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    enabled: true,
  },
];

// Mock Usage Data
const mockUsage: AITemplateUsage[] = [
  {
    templateId: 'template_educar_001',
    purpose: 'educar',
    format: 'post',
    usedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    platform: 'instagram',
  },
  {
    templateId: 'template_inspirar_001',
    purpose: 'inspirar',
    format: 'post',
    usedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    platform: 'instagram',
  },
  {
    templateId: 'template_vender_001',
    purpose: 'vender',
    format: 'post',
    usedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    platform: 'facebook',
  },
];

export const getAITemplates = async (): Promise<AITemplate[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockAITemplates.filter((t) => t.enabled);
};

export const getAITemplate = async (id: string): Promise<AITemplate | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockAITemplates.find((t) => t.id === id) || null;
};

export const getAITemplatesByPurpose = async (purpose: AITemplatePurpose): Promise<AITemplate[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockAITemplates.filter((t) => t.purpose === purpose && t.enabled);
};

export const getAITemplatesByFormat = async (format: AITemplateFormat): Promise<AITemplate[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockAITemplates.filter((t) => t.format === format && t.enabled);
};

export const getAITemplateBalance = async (): Promise<AITemplateBalance> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  
  const usage = mockUsage;
  const educar = usage.filter((u) => u.purpose === 'educar').length;
  const inspirar = usage.filter((u) => u.purpose === 'inspirar').length;
  const vender = usage.filter((u) => u.purpose === 'vender').length;
  const total = educar + inspirar + vender;

  return {
    educar,
    inspirar,
    vender,
    total,
  };
};

export const getAITemplateUsage = async (limit?: number): Promise<AITemplateUsage[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const sorted = [...mockUsage].sort((a, b) => new Date(b.usedAt).getTime() - new Date(a.usedAt).getTime());
  return limit ? sorted.slice(0, limit) : sorted;
};

export const useAITemplate = async (
  templateId: string,
  variables: Record<string, string>,
  platform: SocialPlatform
): Promise<{
  content: string;
  hashtags: string[];
  format: AITemplateFormat;
}> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const template = mockAITemplates.find((t) => t.id === templateId);
  if (!template) {
    throw new Error('Template not found');
  }

  // Replace variables in structure
  let content = template.structure.hook;
  template.structure.body.forEach((line) => {
    content += '\n\n' + line;
  });
  content += '\n\n' + template.structure.cta;

  // Replace variables
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    content = content.replace(regex, value);
  });

  return {
    content,
    hashtags: template.suggestedHashtags,
    format: template.format,
  };
};

export const updateAITemplateUsage = async (
  templateId: string,
  purpose: AITemplatePurpose,
  format: AITemplateFormat,
  platform: SocialPlatform
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  // In production, this would update the database
  mockUsage.unshift({
    templateId,
    purpose,
    format,
    usedAt: new Date().toISOString(),
    platform,
  });
};

