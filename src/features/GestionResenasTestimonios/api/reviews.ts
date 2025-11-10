export interface ReviewChannel {
  id: 'whatsapp' | 'sms' | 'email';
  label: string;
  description: string;
  averageResponseTime: string;
}

export interface RatingSummary {
  average: number;
  totalReviews: number;
  last30Days: number;
  distribution: Array<{ score: number; count: number }>;
}

export interface UnhappyClient {
  id: string;
  name: string;
  lastVisit: string;
  membership: string;
  note: string;
  nps?: number;
}

export const fetchReviewChannels = async (): Promise<ReviewChannel[]> => {
  return [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      description: 'Mensaje directo con link a Google / Trustpilot',
      averageResponseTime: '4h',
    },
    {
      id: 'sms',
      label: 'SMS',
      description: 'Texto breve con CTA a la encuesta',
      averageResponseTime: '6h',
    },
    {
      id: 'email',
      label: 'Email',
      description: 'Plantilla de email con recordatorios automáticos',
      averageResponseTime: '12h',
    },
  ];
};

export const fetchRatingSummary = async (): Promise<RatingSummary> => {
  return {
    average: 4.6,
    totalReviews: 482,
    last30Days: 57,
    distribution: [
      { score: 5, count: 310 },
      { score: 4, count: 110 },
      { score: 3, count: 38 },
      { score: 2, count: 16 },
      { score: 1, count: 8 },
    ],
  };
};

export const fetchUnhappyClients = async (): Promise<UnhappyClient[]> => {
  return [
    {
      id: 'client-1023',
      name: 'Laura Gómez',
      lastVisit: '2025-10-28',
      membership: 'Membresía Premium',
      note: 'Comentó molestias con los vestuarios en su última visita.',
      nps: 4,
    },
    {
      id: 'client-0875',
      name: 'Carlos Pérez',
      lastVisit: '2025-10-25',
      membership: 'Plan mensual',
      note: 'Marcado como riesgo de baja por inactividad y valoraciones negativas.',
      nps: 3,
    },
    {
      id: 'client-0661',
      name: 'Andrea López',
      lastVisit: '2025-10-31',
      membership: 'Plan corporativo',
      note: 'Feedback en encuesta interna con puntuación baja en atención al cliente.',
    },
  ];
};




