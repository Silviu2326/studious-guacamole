// API para gestión del SMS/Email Preference Center

export type CommunicationChannel = 'email' | 'sms' | 'none';
export type CommunicationCategory = 
  | 'session_reminders' 
  | 'workout_updates' 
  | 'nutrition_tips' 
  | 'motivation' 
  | 'promotions';

export interface Preference {
  category: CommunicationCategory;
  is_subscribed: boolean;
  channel: CommunicationChannel;
}

export interface ClientPreferences {
  clientName: string;
  preferences: Preference[];
  last_updated_at?: string;
}

export interface PreferenceCategoryInfo {
  category: CommunicationCategory;
  label: string;
  description: string;
  availableChannels: ('email' | 'sms')[];
}

export const getCategoryInfo = (): PreferenceCategoryInfo[] => [
  {
    category: 'session_reminders',
    label: 'Recordatorios de Sesiones',
    description: 'Notificaciones antes de tu próxima sesión de entrenamiento',
    availableChannels: ['email', 'sms']
  },
  {
    category: 'workout_updates',
    label: 'Actualizaciones del Plan',
    description: 'Cambios en tu plan de entrenamiento y seguimiento de progreso',
    availableChannels: ['email', 'sms']
  },
  {
    category: 'nutrition_tips',
    label: 'Consejos de Nutrición',
    description: 'Consejos semanales sobre alimentación y recetas saludables',
    availableChannels: ['email']
  },
  {
    category: 'motivation',
    label: 'Mensajes Motivacionales',
    description: 'Inspiring messages diarios para mantenerte motivado',
    availableChannels: ['email', 'sms']
  },
  {
    category: 'promotions',
    label: 'Ofertas y Promociones',
    description: 'Descuentos exclusivos en programas, retos y servicios',
    availableChannels: ['email', 'sms']
  }
];

// Funciones API simuladas
export const getClientPreferences = async (token: string): Promise<ClientPreferences> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  return {
    clientName: 'Ana García',
    last_updated_at: '2024-01-15T10:00:00Z',
    preferences: [
      { category: 'session_reminders', is_subscribed: true, channel: 'sms' },
      { category: 'workout_updates', is_subscribed: true, channel: 'email' },
      { category: 'nutrition_tips', is_subscribed: true, channel: 'email' },
      { category: 'motivation', is_subscribed: false, channel: 'none' },
      { category: 'promotions', is_subscribed: false, channel: 'none' }
    ]
  };
};

export const updateClientPreferences = async (
  token: string,
  preferences: Preference[]
): Promise<{ status: string; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  return {
    status: 'success',
    message: 'Tus preferencias han sido actualizadas correctamente.'
  };
};

export const unsubscribeAll = async (token: string): Promise<{ status: string; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    status: 'success',
    message: 'Has sido dado de baja de todas nuestras comunicaciones.'
  };
};

export const getTrainerClientPreferences = async (clientId: string): Promise<ClientPreferences> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  return {
    clientName: 'Cliente Demo',
    last_updated_at: '2024-01-20T14:00:00Z',
    preferences: [
      { category: 'session_reminders', is_subscribed: true, channel: 'sms' },
      { category: 'workout_updates', is_subscribed: true, channel: 'email' },
      { category: 'nutrition_tips', is_subscribed: false, channel: 'none' },
      { category: 'motivation', is_subscribed: true, channel: 'email' },
      { category: 'promotions', is_subscribed: false, channel: 'none' }
    ]
  };
};

export const getCategoryLabel = (category: CommunicationCategory): string => {
  const labels = {
    session_reminders: 'Recordatorios de Sesiones',
    workout_updates: 'Actualizaciones del Plan',
    nutrition_tips: 'Consejos de Nutrición',
    motivation: 'Mensajes Motivacionales',
    promotions: 'Ofertas y Promociones'
  };
  return labels[category];
};

export const getChannelLabel = (channel: CommunicationChannel): string => {
  const labels = {
    email: 'Email',
    sms: 'SMS/WhatsApp',
    none: 'Ninguno'
  };
  return labels[channel];
};













