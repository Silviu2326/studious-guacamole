import type {
  PromotionalContentTemplate,
  ServicePlan,
  PromotionalOffer,
  GeneratedPromotionalContent,
  PromotionalTemplateType,
  SocialPlatform,
} from '../types';

/**
 * Obtiene las plantillas de contenido promocional disponibles
 */
export const getPromotionalTemplates = async (): Promise<PromotionalContentTemplate[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [
    {
      id: 'promo_001',
      name: 'Presentación de Plan de Entrenamiento',
      description: 'Presenta un plan de entrenamiento de forma educativa y atractiva',
      type: 'plan-entrenamiento',
      format: 'post',
      structure: {
        hook: '¿Buscas un plan de entrenamiento que se adapte a tus objetivos? 💪',
        body: 'Te presento el {plan_nombre}, diseñado específicamente para {objetivo}.\n\n✨ Incluye:\n{caracteristicas}\n\n📅 {sesiones} sesiones al mes\n💰 {precio}€/mes\n\nEste plan te ayudará a {beneficio_principal} de forma {enfoque} y {metodologia}.',
        cta: '¿Te interesa? Escríbeme y te cuento más detalles. ¡Empecemos juntos tu transformación! 👇',
      },
      variables: [
        { key: 'plan_nombre', label: 'Nombre del Plan', type: 'plan' },
        { key: 'objetivo', label: 'Objetivo principal', type: 'text', defaultValue: 'alcanzar tus metas' },
        { key: 'caracteristicas', label: 'Características (una por línea)', type: 'text' },
        { key: 'sesiones', label: 'Sesiones por mes', type: 'number', defaultValue: '4' },
        { key: 'precio', label: 'Precio mensual', type: 'number' },
        { key: 'beneficio_principal', label: 'Beneficio principal', type: 'text' },
        { key: 'enfoque', label: 'Enfoque (ej: progresiva, personalizada)', type: 'text' },
        { key: 'metodologia', label: 'Metodología', type: 'text', defaultValue: 'segura' },
      ],
      suggestedHashtags: ['entrenamientopersonal', 'fitness', 'salud', 'transformacion', 'personaltrainer'],
      educational: true,
      platforms: ['instagram', 'facebook'],
    },
    {
      id: 'promo_002',
      name: 'Oferta Especial con Descuento',
      description: 'Anuncia una oferta especial de forma educativa',
      type: 'oferta-especial',
      format: 'post',
      structure: {
        hook: '🎉 ¡Oferta especial limitada!',
        body: 'Por tiempo limitado, te ofrezco un {descuento}% de descuento en {plan_oferta}.\n\nEsta oferta es perfecta si {para_quien}.\n\n✨ Lo que incluye:\n{incluye}\n\n⏰ Válido hasta {fecha_limite}\n💰 Precio original: {precio_original}€\n💎 Precio con descuento: {precio_final}€\n\n{por_que_ahora}',
        cta: 'No dejes pasar esta oportunidad. Escríbeme para reservar tu plaza o agendar una consulta gratuita. 👇',
      },
      variables: [
        { key: 'descuento', label: 'Porcentaje de descuento', type: 'number' },
        { key: 'plan_oferta', label: 'Plan o servicio', type: 'plan' },
        { key: 'para_quien', label: 'Para quién es ideal', type: 'text' },
        { key: 'incluye', label: 'Qué incluye (una por línea)', type: 'text' },
        { key: 'fecha_limite', label: 'Fecha límite', type: 'date' },
        { key: 'precio_original', label: 'Precio original', type: 'number' },
        { key: 'precio_final', label: 'Precio con descuento', type: 'number' },
        { key: 'por_que_ahora', label: 'Por qué aprovechar ahora', type: 'text' },
      ],
      suggestedHashtags: ['oferta', 'descuento', 'fitness', 'entrenamiento', 'oportunidad'],
      educational: true,
      platforms: ['instagram', 'facebook', 'tiktok'],
    },
    {
      id: 'promo_003',
      name: 'Bono de Sesiones',
      description: 'Promociona un bono de sesiones de forma atractiva',
      type: 'bono-sesiones',
      format: 'carousel',
      structure: {
        hook: '💎 Bonos de sesiones disponibles',
        body: '¿Quieres maximizar tus resultados? Los bonos de sesiones son la opción perfecta.\n\n📦 Bono {sesiones} sesiones\n💰 {precio}€ (Ahorro de {ahorro}€)\n⏰ Válido por {validez} meses\n\n✨ Ventajas:\n{ventajas}\n\nIdeal para {para_quien} que busca {objetivo}.',
        cta: 'Reserva tu bono ahora y comienza tu transformación. Escríbeme para más información. 👇',
      },
      variables: [
        { key: 'sesiones', label: 'Número de sesiones', type: 'number' },
        { key: 'precio', label: 'Precio del bono', type: 'number' },
        { key: 'ahorro', label: 'Ahorro total', type: 'number' },
        { key: 'validez', label: 'Validez en meses', type: 'number', defaultValue: '3' },
        { key: 'ventajas', label: 'Ventajas del bono (una por línea)', type: 'text' },
        { key: 'para_quien', label: 'Para quién es ideal', type: 'text' },
        { key: 'objetivo', label: 'Objetivo principal', type: 'text' },
      ],
      suggestedHashtags: ['bono', 'sesiones', 'ahorro', 'fitness', 'entrenamiento'],
      educational: true,
      platforms: ['instagram', 'facebook'],
    },
    {
      id: 'promo_004',
      name: 'Nuevo Servicio',
      description: 'Anuncia un nuevo servicio de forma educativa',
      type: 'nuevo-servicio',
      format: 'reel',
      structure: {
        hook: '🚀 ¡Nuevo servicio disponible!',
        body: 'Estoy emocionado de presentarte {servicio_nombre}.\n\n{descripcion_servicio}\n\n✨ Beneficios:\n{beneficios}\n\n👥 Ideal para:\n{ideal_para}\n\n{por_que_ahora}',
        cta: '¿Quieres saber más? Escríbeme y te cuento todos los detalles. ¡No te lo pierdas! 👇',
      },
      variables: [
        { key: 'servicio_nombre', label: 'Nombre del servicio', type: 'text' },
        { key: 'descripcion_servicio', label: 'Descripción del servicio', type: 'text' },
        { key: 'beneficios', label: 'Beneficios (una por línea)', type: 'text' },
        { key: 'ideal_para', label: 'Ideal para (una por línea)', type: 'text' },
        { key: 'por_que_ahora', label: 'Por qué lanzarlo ahora', type: 'text' },
      ],
      suggestedHashtags: ['nuevoservicio', 'fitness', 'innovacion', 'salud', 'bienestar'],
      educational: true,
      platforms: ['instagram', 'tiktok'],
    },
    {
      id: 'promo_005',
      name: 'Evento o Clase Grupal',
      description: 'Promociona un evento o clase grupal',
      type: 'evento-clase',
      format: 'post',
      structure: {
        hook: '📅 ¡Únete a nuestra próxima clase!',
        body: 'Te invito a {evento_nombre}.\n\n📆 Fecha: {fecha}\n⏰ Hora: {hora}\n📍 Lugar: {lugar}\n👥 Plazas: {plazas}\n\n{descripcion_evento}\n\n✨ Qué aprenderás:\n{aprenderas}\n\n{por_que_asistir}',
        cta: 'Reserva tu plaza ahora. Las plazas son limitadas. Escríbeme para inscribirte. 👇',
      },
      variables: [
        { key: 'evento_nombre', label: 'Nombre del evento', type: 'text' },
        { key: 'fecha', label: 'Fecha', type: 'date' },
        { key: 'hora', label: 'Hora', type: 'text' },
        { key: 'lugar', label: 'Lugar', type: 'text' },
        { key: 'plazas', label: 'Plazas disponibles', type: 'number' },
        { key: 'descripcion_evento', label: 'Descripción del evento', type: 'text' },
        { key: 'aprenderas', label: 'Qué aprenderás (una por línea)', type: 'text' },
        { key: 'por_que_asistir', label: 'Por qué asistir', type: 'text' },
      ],
      suggestedHashtags: ['evento', 'clase', 'fitness', 'comunidad', 'aprendizaje'],
      educational: true,
      platforms: ['instagram', 'facebook'],
    },
  ];
};

/**
 * Obtiene los planes de servicio disponibles
 */
export const getServicePlans = async (): Promise<ServicePlan[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return [
    {
      id: 'plan_001',
      name: 'Plan Básico',
      description: 'Plan de entrenamiento personal básico',
      price: 240,
      currency: 'EUR',
      sessionsPerMonth: 4,
      features: ['Sesiones personalizadas', 'Plan de entrenamiento', 'Seguimiento mensual'],
      isActive: true,
    },
    {
      id: 'plan_002',
      name: 'Plan Premium',
      description: 'Plan completo con nutrición',
      price: 480,
      currency: 'EUR',
      sessionsPerMonth: 8,
      features: [
        'Sesiones personalizadas',
        'Plan de entrenamiento',
        'Plan nutricional',
        'Seguimiento semanal',
        'Acceso a app',
      ],
      isActive: true,
    },
    {
      id: 'plan_003',
      name: 'Plan Pro',
      description: 'Plan avanzado con seguimiento completo',
      price: 720,
      currency: 'EUR',
      sessionsPerMonth: 12,
      features: [
        'Sesiones personalizadas',
        'Plan de entrenamiento',
        'Plan nutricional',
        'Seguimiento diario',
        'Acceso a app',
        'Consultas ilimitadas',
      ],
      isActive: true,
    },
  ];
};

/**
 * Obtiene las ofertas activas
 */
export const getActiveOffers = async (): Promise<PromotionalOffer[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return [
    {
      id: 'offer_001',
      title: 'Descuento 20% Plan Premium',
      description: 'Oferta especial para nuevos clientes',
      discount: 20,
      discountType: 'percentage',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      applicablePlans: ['plan_002'],
      isActive: true,
    },
    {
      id: 'offer_002',
      title: 'Bono 10 Sesiones',
      description: 'Bono especial con descuento',
      discount: 100,
      discountType: 'fixed',
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
    },
  ];
};

/**
 * Genera contenido promocional a partir de una plantilla
 */
export const generatePromotionalContent = async (
  templateId: string,
  variables: Record<string, string | number>,
  platform: SocialPlatform
): Promise<GeneratedPromotionalContent> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const templates = await getPromotionalTemplates();
  const template = templates.find((t) => t.id === templateId);

  if (!template) {
    throw new Error('Plantilla no encontrada');
  }

  // Reemplazar variables en el contenido
  let caption = `${template.structure.hook}\n\n${template.structure.body}\n\n${template.structure.cta}`;

  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{${key}}`, 'g');
    caption = caption.replace(regex, String(value));
  });

  return {
    id: `promo_gen_${Date.now()}`,
    templateId,
    content: {
      caption,
      hashtags: template.suggestedHashtags,
    },
    platform,
    status: 'draft',
    createdAt: new Date().toISOString(),
  };
};

/**
 * Programa contenido promocional en el calendario
 */
export const schedulePromotionalContent = async (
  contentId: string,
  scheduledAt: string
): Promise<GeneratedPromotionalContent> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // En producción, esto actualizaría el contenido en el backend
  // y lo programaría en el Planner de Redes Sociales
  return {
    id: contentId,
    templateId: 'promo_001',
    content: {
      caption: '',
      hashtags: [],
    },
    scheduledAt,
    platform: 'instagram',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  };
};

