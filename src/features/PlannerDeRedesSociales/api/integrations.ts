// API para integraciones con agenda y otros módulos

export interface AgendaEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  type: 'class' | 'event' | 'workshop' | 'challenge' | 'appointment';
  location?: string;
  instructor?: string;
  capacity?: number;
  enrolled?: number;
}

export interface EventPostTemplate {
  eventType: string;
  template: string;
  variables: string[];
  suggestedHashtags: string[];
  autoGenerate: boolean;
}

export interface IntegrationSettings {
  agenda: {
    enabled: boolean;
    autoGeneratePosts: boolean;
    postBeforeEvent: number; // horas antes del evento
    postAfterEvent: boolean;
    templates: EventPostTemplate[];
  };
  clients: {
    enabled: boolean;
    autoPostTransformations: boolean;
    autoPostAchievements: boolean;
  };
}

export const getAgendaEvents = async (startDate: string, endDate: string): Promise<AgendaEvent[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: 'event_001',
      title: 'Clase de HIIT',
      description: 'Entrenamiento de alta intensidad para todos los niveles',
      startDate: '2024-01-29T10:00:00Z',
      endDate: '2024-01-29T11:00:00Z',
      type: 'class',
      location: 'Gimnasio Principal',
      instructor: 'Laura García',
      capacity: 20,
      enrolled: 15
    },
    {
      id: 'event_002',
      title: 'Reto 30 Días',
      description: 'Únete a nuestro reto de transformación',
      startDate: '2024-02-01T00:00:00Z',
      endDate: '2024-03-01T23:59:59Z',
      type: 'challenge',
      location: 'Online',
      capacity: 100,
      enrolled: 45
    },
    {
      id: 'event_003',
      title: 'Workshop de Nutrición',
      description: 'Aprende los fundamentos de la nutrición deportiva',
      startDate: '2024-02-05T18:00:00Z',
      endDate: '2024-02-05T20:00:00Z',
      type: 'workshop',
      location: 'Sala de Conferencias',
      instructor: 'Laura García',
      capacity: 30,
      enrolled: 22
    }
  ];
};

export const getIntegrationSettings = async (): Promise<IntegrationSettings> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    agenda: {
      enabled: true,
      autoGeneratePosts: true,
      postBeforeEvent: 24, // 24 horas antes
      postAfterEvent: true,
      templates: [
        {
          eventType: 'class',
          template: '📅 ¡No te pierdas nuestra clase de {titulo}!\n\n📆 Fecha: {fecha}\n⏰ Hora: {hora}\n📍 Lugar: {lugar}\n👤 Instructor: {instructor}\n\n{descripcion}\n\n¡Reserva tu lugar! 👇\n\n#Fitness #Clase #Entrenamiento',
          variables: ['titulo', 'fecha', 'hora', 'lugar', 'instructor', 'descripcion'],
          suggestedHashtags: ['fitness', 'clase', 'entrenamiento', 'hiit'],
          autoGenerate: true
        },
        {
          eventType: 'challenge',
          template: '🔥 ¡Únete al {titulo}!\n\n📅 Inicio: {fecha_inicio}\n⏱️ Duración: {duracion}\n\n{descripcion}\n\n¡No te lo pierdas! 👇\n\n#Reto #Fitness #Transformacion',
          variables: ['titulo', 'fecha_inicio', 'duracion', 'descripcion'],
          suggestedHashtags: ['reto', 'fitness', 'transformacion', 'challenge'],
          autoGenerate: true
        },
        {
          eventType: 'workshop',
          template: '🎓 Workshop: {titulo}\n\n📆 Fecha: {fecha}\n⏰ Hora: {hora}\n📍 Lugar: {lugar}\n\n{descripcion}\n\n¡Inscríbete ahora! 👇\n\n#Workshop #Aprendizaje #Fitness',
          variables: ['titulo', 'fecha', 'hora', 'lugar', 'descripcion'],
          suggestedHashtags: ['workshop', 'aprendizaje', 'fitness', 'educacion'],
          autoGenerate: true
        }
      ]
    },
    clients: {
      enabled: true,
      autoPostTransformations: true,
      autoPostAchievements: true
    }
  };
};

export const generatePostFromEvent = async (eventId: string): Promise<any> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const events = await getAgendaEvents('2024-01-01', '2024-12-31');
  const event = events.find(e => e.id === eventId);
  
  if (!event) {
    throw new Error('Evento no encontrado');
  }
  
  const settings = await getIntegrationSettings();
  const template = settings.agenda.templates.find(t => t.eventType === event.type);
  
  if (!template) {
    throw new Error('Plantilla no encontrada para este tipo de evento');
  }
  
  let content = template.template;
  
  // Reemplazar variables
  const variables: Record<string, string> = {
    titulo: event.title,
    fecha: new Date(event.startDate).toLocaleDateString('es-ES'),
    hora: new Date(event.startDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    lugar: event.location || 'Gimnasio',
    instructor: event.instructor || 'Laura García',
    descripcion: event.description || '',
    fecha_inicio: new Date(event.startDate).toLocaleDateString('es-ES'),
    duracion: calculateDuration(event.startDate, event.endDate)
  };
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    content = content.replace(regex, value);
  });
  
  return {
    content,
    hashtags: template.suggestedHashtags,
    scheduledAt: new Date(new Date(event.startDate).getTime() - (settings.agenda.postBeforeEvent * 60 * 60 * 1000)).toISOString(),
    eventId: event.id
  };
};

function calculateDuration(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    return `${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
  }
  
  if (diffDays === 30) {
    return '30 días';
  }
  
  return `${diffDays} día${diffDays !== 1 ? 's' : ''}`;
}

export const updateIntegrationSettings = async (settings: Partial<IntegrationSettings>): Promise<IntegrationSettings> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const current = await getIntegrationSettings();
  return {
    ...current,
    ...settings
  };
};

