import type { Integration } from '../types';

export const integrationData: Integration[] = [
  {
    id: 'int_stripe',
    name: 'Stripe',
    description: 'Procesa pagos y suscripciones de forma automática y segura.',
    logoUrl: '',
    category: 'payments',
    status: 'disconnected',
  },
  {
    id: 'int_paypal',
    name: 'PayPal',
    description: 'Acepta pagos con PayPal en todo el mundo.',
    logoUrl: '',
    category: 'payments',
    status: 'disconnected',
  },
  {
    id: 'int_google_calendar',
    name: 'Google Calendar',
    description: 'Sincroniza tus clases y sesiones con tu calendario de Google.',
    logoUrl: '',
    category: 'calendars',
    status: 'disconnected',
  },
  {
    id: 'int_outlook_calendar',
    name: 'Outlook Calendar',
    description: 'Integra tu agenda con Microsoft Outlook.',
    logoUrl: '',
    category: 'calendars',
    status: 'disconnected',
  },
  {
    id: 'int_whatsapp',
    name: 'WhatsApp Business',
    description: 'Envía recordatorios automáticos y notificaciones a tus clientes.',
    logoUrl: '',
    category: 'communication',
    status: 'disconnected',
  },
  {
    id: 'int_mailchimp',
    name: 'Mailchimp',
    description: 'Gestiona tus campañas de email marketing y newsletters.',
    logoUrl: '',
    category: 'marketing',
    status: 'disconnected',
  },
  {
    id: 'int_apple_health',
    name: 'Apple Health',
    description: 'Sincroniza datos de actividad física y salud con Apple Health.',
    logoUrl: '',
    category: 'health',
    status: 'disconnected',
  },
  {
    id: 'int_google_fit',
    name: 'Google Fit',
    description: 'Conecta con Google Fit para trackear el progreso de tus clientes.',
    logoUrl: '',
    category: 'health',
    status: 'disconnected',
  },
];

