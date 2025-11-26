// US-15: Servicio de seguimiento de leads

import { Sale } from '../types';

export interface FollowUpAlert {
  saleId: string;
  leadName: string;
  daysWithoutContact: number;
  suggestedMessage: string;
  phase: string;
}

// Mensajes de seguimiento sugeridos por fase
const FOLLOW_UP_MESSAGES: Record<string, string[]> = {
  'contacto_nuevo': [
    'Hola {{name}}, te escribo para ver si tienes alguna pregunta sobre nuestros servicios de entrenamiento personal. ¿Te gustaría agendar una llamada para conocer más?',
    '¡Hola {{name}}! Gracias por tu interés. Me encantaría conocer tus objetivos de entrenamiento. ¿Cuándo te viene bien para hablar?',
  ],
  'primera_charla': [
    'Hola {{name}}, espero que todo bien. ¿Has tenido oportunidad de revisar la información que te compartí? Estoy aquí para cualquier duda.',
    '¡Hola {{name}}! Te escribo para seguir con nuestra conversación. ¿Te gustaría avanzar con el plan que comentamos?',
  ],
  'enviado_precio': [
    'Hola {{name}}, te escribo para ver si recibiste la propuesta que te envié. ¿Tienes alguna pregunta sobre el plan o el precio?',
    '¡Hola {{name}}! Quería saber si tienes alguna duda sobre la propuesta. Estoy disponible para ajustarla a tus necesidades.',
  ],
  'llamada': [
    'Hola {{name}}, confirmando nuestra llamada de mañana. ¿Sigue bien el horario que acordamos?',
    '¡Hola {{name}}! Recordatorio de nuestra llamada programada. Hablamos pronto.',
  ],
  'default': [
    'Hola {{name}}, te escribo para seguir en contacto. ¿Cómo va todo?',
    '¡Hola {{name}}! Espero que estés bien. ¿Te gustaría continuar con nuestra conversación?',
  ],
};

export class FollowUpService {
  static getDaysWithoutContact(sale: Sale): number {
    const lastContact = sale.lastContact || sale.lastActivity || sale.updatedAt;
    if (!lastContact) return 0;

    const now = new Date();
    const lastContactDate = new Date(lastContact);
    const diffTime = now.getTime() - lastContactDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  }

  static getFollowUpColor(days: number): { bg: string; text: string; border: string } {
    if (days === 0) {
      return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' };
    } else if (days <= 2) {
      return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' };
    } else if (days <= 3) {
      return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' };
    } else {
      return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
    }
  }

  static getLeadsNeedingFollowUp(sales: Sale[], thresholdDays: number = 3): FollowUpAlert[] {
    return sales
      .filter(sale => {
        // Solo leads activos (no descartados ni clientes cerrados)
        if (sale.phase === 'descartado' || sale.phase === 'cliente') return false;
        
        const days = this.getDaysWithoutContact(sale);
        return days >= thresholdDays && !sale.followUpNotificationSent;
      })
      .map(sale => {
        const days = this.getDaysWithoutContact(sale);
        const messages = FOLLOW_UP_MESSAGES[sale.phase] || FOLLOW_UP_MESSAGES.default;
        const suggestedMessage = messages[0].replace('{{name}}', sale.leadName.split(' ')[0]);

        return {
          saleId: sale.id,
          leadName: sale.leadName,
          daysWithoutContact: days,
          suggestedMessage,
          phase: sale.phase,
        };
      });
  }

  static getSuggestedMessage(sale: Sale): string {
    const messages = FOLLOW_UP_MESSAGES[sale.phase] || FOLLOW_UP_MESSAGES.default;
    const firstName = sale.leadName.split(' ')[0];
    return messages[Math.floor(Math.random() * messages.length)].replace('{{name}}', firstName);
  }
}

