/**
 * API para generar ideas de contenido interno para clientes
 * US-CSS-012: Sistema que genere ideas de contenido interno (tips de nutrición, ejercicios complementarios, motivación)
 */

export type InternalContentCategory = 'nutricion' | 'ejercicio' | 'motivacion' | 'bienestar' | 'recuperacion';

export interface InternalContentIdea {
  id: string;
  category: InternalContentCategory;
  title: string;
  content: string;
  format: 'text' | 'image' | 'video' | 'carousel';
  suggestedPlatforms: Array<'whatsapp' | 'instagram' | 'facebook' | 'email'>;
  targetAudience: 'all_clients' | 'new_clients' | 'active_clients' | 'inactive_clients';
  tags: string[];
  estimatedEngagement: 'high' | 'medium' | 'low';
  canShareDirectly: boolean;
  createdAt: string;
}

export interface InternalContentGenerationRequest {
  category?: InternalContentCategory;
  targetAudience?: 'all_clients' | 'new_clients' | 'active_clients' | 'inactive_clients';
  format?: 'text' | 'image' | 'video' | 'carousel';
  count?: number;
  topics?: string[];
}

/**
 * Genera ideas de contenido interno para compartir con clientes
 */
export const generateInternalContentIdeas = async (
  request: InternalContentGenerationRequest = {}
): Promise<InternalContentIdea[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  const {
    category,
    targetAudience = 'all_clients',
    format,
    count = 5,
    topics = [],
  } = request;

  const ideas: InternalContentIdea[] = [];

  // Ideas de nutrición
  const nutritionIdeas = [
    {
      title: '5 alimentos que te ayudan a recuperarte después del entrenamiento',
      content: 'Después de entrenar, tu cuerpo necesita reponer energía y reparar músculos. Aquí tienes 5 alimentos clave:\n\n1. Plátano: Rico en potasio y carbohidratos de rápida absorción\n2. Huevos: Proteína completa para la recuperación muscular\n3. Avena: Carbohidratos complejos y fibra\n4. Salmón: Omega-3 y proteína de alta calidad\n5. Batido de proteína: Recuperación rápida y práctica\n\n💡 Tip: Consume estos alimentos dentro de la ventana de 30-60 minutos post-entrenamiento para maximizar la recuperación.',
      tags: ['nutrición', 'recuperación', 'post-entrenamiento', 'alimentos'],
    },
    {
      title: 'La importancia de la hidratación en el rendimiento',
      content: '¿Sabías que una deshidratación del 2% puede reducir tu rendimiento hasta en un 10%?\n\n💧 Bebe agua antes, durante y después del entrenamiento\n💧 Calcula: 35ml por kg de peso corporal al día\n💧 Añade electrolitos si entrenas más de 1 hora\n💧 Observa el color de tu orina (debe ser clara)\n\n¡Mantente hidratado para rendir al máximo! 💪',
      tags: ['hidratación', 'rendimiento', 'salud', 'consejos'],
    },
    {
      title: 'Desayunos ricos en proteína para empezar el día con energía',
      content: 'Un buen desayuno puede marcar la diferencia en tu día. Opciones ricas en proteína:\n\n🥚 Tortilla de claras con espinacas y aguacate\n🥛 Batido de proteína con frutas y avena\n🍳 Huevos revueltos con pan integral\n🥑 Tostada de aguacate con huevo pochado\n\nLa proteína en el desayuno te ayuda a mantenerte saciado y con energía estable durante la mañana.',
      tags: ['desayuno', 'proteína', 'nutrición', 'energía'],
    },
  ];

  // Ideas de ejercicio
  const exerciseIdeas = [
    {
      title: 'Ejercicios complementarios para hacer en casa',
      content: 'No siempre puedes ir al gimnasio, pero puedes mantenerte activo en casa:\n\n🏋️ Sentadillas: 3 series de 15 repeticiones\n💪 Flexiones: 3 series hasta el fallo\n🔥 Plancha: 3 series de 30-60 segundos\n🏃 Burpees: 3 series de 10 repeticiones\n\nEstos ejercicios trabajan todo el cuerpo y no necesitas equipamiento. ¡Perfectos para días ocupados!',
      tags: ['ejercicio', 'casa', 'sin equipamiento', 'rutina rápida'],
    },
    {
      title: 'Movilidad matutina: 5 minutos para empezar bien el día',
      content: 'Dedica solo 5 minutos cada mañana a estos movimientos:\n\n1. Rotaciones de cuello (30 segundos)\n2. Estiramiento de hombros (30 segundos)\n3. Gatos-vaca (30 segundos)\n4. Estiramiento de cadera (1 minuto cada lado)\n5. Estiramiento de isquiotibiales (1 minuto cada lado)\n\nEsto mejorará tu movilidad y reducirá tensiones del día anterior.',
      tags: ['movilidad', 'estiramiento', 'mañana', 'bienestar'],
    },
    {
      title: 'Progresión de sentadillas: del básico al avanzado',
      content: 'Domina la sentadilla paso a paso:\n\n📊 Nivel 1: Sentadilla asistida (con apoyo)\n📊 Nivel 2: Sentadilla al aire (sin peso)\n📊 Nivel 3: Sentadilla con peso corporal profunda\n📊 Nivel 4: Sentadilla con peso (barra o mancuernas)\n\nCada nivel prepara tu cuerpo para el siguiente. ¡No te saltes pasos!',
      tags: ['sentadillas', 'progresión', 'técnica', 'fuerza'],
    },
  ];

  // Ideas de motivación
  const motivationIdeas = [
    {
      title: 'La constancia supera la perfección',
      content: 'No necesitas ser perfecto, solo constante.\n\n✨ 3 entrenamientos a la semana durante 3 meses > entrenar 7 días una semana y luego nada\n✨ Pequeños cambios sostenibles > cambios drásticos que no puedes mantener\n✨ Progreso lento y constante > resultados rápidos que desaparecen\n\nRecuerda: cada pequeño paso cuenta. ¡Sigue adelante! 💪',
      tags: ['motivación', 'constancia', 'mentalidad', 'progreso'],
    },
    {
      title: 'Celebra tus pequeñas victorias',
      content: 'Cada logro merece ser reconocido:\n\n🎉 Completaste tu entrenamiento aunque no tenías ganas\n🎉 Elegiste una comida saludable cuando tenías antojo\n🎉 Dormiste 8 horas para recuperarte mejor\n🎉 Bebiste suficiente agua durante el día\n\nEstas "pequeñas" victorias son las que construyen grandes transformaciones. ¡Reconócelas!',
      tags: ['motivación', 'logros', 'mentalidad positiva', 'auto-reconocimiento'],
    },
    {
      title: 'El progreso no es lineal: es normal tener altibajos',
      content: 'Tu viaje de transformación tendrá días buenos y días difíciles. Es normal.\n\n📈 Algunos días te sentirás invencible\n📉 Otros días será difícil encontrar motivación\n🔄 Lo importante es no rendirse\n\nLos días difíciles son parte del proceso. Lo que importa es que sigas adelante. ¡Tú puedes! 💪',
      tags: ['motivación', 'mentalidad', 'progreso', 'resiliencia'],
    },
  ];

  // Ideas de bienestar
  const wellnessIdeas = [
    {
      title: 'La importancia del descanso en tu progreso',
      content: 'El descanso no es tiempo perdido, es tiempo invertido en tu recuperación:\n\n😴 Duerme 7-9 horas cada noche\n🧘 Dedica tiempo a la relajación\n🛁 Date un baño caliente después de entrenar\n📱 Desconéctate de las pantallas antes de dormir\n\nTu cuerpo se repara y se fortalece durante el descanso. ¡No lo subestimes!',
      tags: ['descanso', 'recuperación', 'bienestar', 'sueño'],
    },
    {
      title: 'Gestión del estrés: técnicas simples y efectivas',
      content: 'El estrés puede afectar tu progreso. Aquí tienes técnicas simples:\n\n🌬️ Respiración profunda: 4 segundos inhalar, 4 mantener, 4 exhalar\n🚶 Caminata de 10 minutos al aire libre\n📝 Escribe 3 cosas por las que estás agradecido\n🎵 Escucha música relajante\n\nIncorpora estas técnicas en tu rutina diaria para manejar mejor el estrés.',
      tags: ['estrés', 'bienestar mental', 'técnicas', 'salud'],
    },
  ];

  // Combinar todas las ideas
  const allIdeas = [
    ...nutritionIdeas.map((idea, i) => ({ ...idea, category: 'nutricion' as const })),
    ...exerciseIdeas.map((idea, i) => ({ ...idea, category: 'ejercicio' as const })),
    ...motivationIdeas.map((idea, i) => ({ ...idea, category: 'motivacion' as const })),
    ...wellnessIdeas.map((idea, i) => ({ ...idea, category: 'bienestar' as const })),
  ];

  // Filtrar por categoría si se especifica
  let filteredIdeas = category 
    ? allIdeas.filter(idea => idea.category === category)
    : allIdeas;

  // Filtrar por temas si se especifican
  if (topics.length > 0) {
    filteredIdeas = filteredIdeas.filter(idea =>
      topics.some(topic => 
        idea.title.toLowerCase().includes(topic.toLowerCase()) ||
        idea.content.toLowerCase().includes(topic.toLowerCase()) ||
        idea.tags.some(tag => tag.toLowerCase().includes(topic.toLowerCase()))
      )
    );
  }

  // Seleccionar ideas aleatorias
  const selectedIdeas = filteredIdeas
    .sort(() => Math.random() - 0.5)
    .slice(0, count);

  // Generar objetos InternalContentIdea
  selectedIdeas.forEach((idea, index) => {
    const ideaFormat = format || (Math.random() > 0.7 ? 'image' : 'text');
    const platforms: Array<'whatsapp' | 'instagram' | 'facebook' | 'email'> = 
      ideaFormat === 'text' 
        ? ['whatsapp', 'email']
        : ['instagram', 'facebook', 'whatsapp'];

    ideas.push({
      id: `internal_idea_${Date.now()}_${index}`,
      category: idea.category,
      title: idea.title,
      content: idea.content,
      format: ideaFormat,
      suggestedPlatforms: platforms,
      targetAudience,
      tags: idea.tags,
      estimatedEngagement: Math.random() > 0.5 ? 'high' : 'medium',
      canShareDirectly: true,
      createdAt: new Date().toISOString(),
    });
  });

  return ideas;
};

/**
 * Obtiene ideas de contenido interno guardadas
 */
export const getSavedInternalContentIdeas = async (): Promise<InternalContentIdea[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  // En una implementación real, esto vendría de una base de datos
  return [];
};

