export interface RiskMember {
  id: string;
  name: string;
  status: 'inactivo' | 'moroso' | 'alerta';
  lastVisit: string;
  lastPayment?: string;
  membership: string;
  riskScore: number;
  notes: string;
}

export interface SimpleAutomation {
  id: string;
  title: string;
  description: string;
  type: 'recordatorio' | 'oferta' | 'contacto';
  channel: 'email' | 'sms' | 'whatsapp' | 'llamada';
  recommendedTrigger: string;
}

export const fetchRiskMembers = async (): Promise<RiskMember[]> => {
  return [
    {
      id: 'member-201',
      name: 'María Hernández',
      status: 'inactivo',
      lastVisit: '2025-09-30',
      lastPayment: '2025-10-01',
      membership: 'Plan anual',
      riskScore: 82,
      notes: 'No ha asistido en 30 días. Último feedback: falta de motivación.',
    },
    {
      id: 'member-145',
      name: 'Sergio Romero',
      status: 'moroso',
      lastVisit: '2025-10-12',
      lastPayment: '2025-08-30',
      membership: 'Plan mensual',
      riskScore: 91,
      notes: 'Pago atrasado 45 días. Interesado en pausa temporal.',
    },
    {
      id: 'member-324',
      name: 'Isabel Torres',
      status: 'alerta',
      lastVisit: '2025-10-25',
      lastPayment: '2025-10-20',
      membership: 'Membresía Premium',
      riskScore: 74,
      notes: 'Reportó molestias en sesión pasada. Comunicación pendiente.',
    },
    {
      id: 'member-299',
      name: 'Miguel Álvarez',
      status: 'inactivo',
      lastVisit: '2025-09-15',
      lastPayment: '2025-09-01',
      membership: 'Plan corporativo',
      riskScore: 88,
      notes: 'Marca de riesgo por dos ausencias a clases reservadas.',
    },
  ];
};

export const fetchSimpleAutomations = async (): Promise<SimpleAutomation[]> => {
  return [
    {
      id: 'reminder-checkin',
      title: 'Recordatorio de check-in',
      description: 'Envía un email y SMS invitando a agendar una sesión de seguimiento.',
      type: 'recordatorio',
      channel: 'email',
      recommendedTrigger: 'Inactividad > 21 días',
    },
    {
      id: 'offer-back',
      title: 'Oferta regreso inteligente',
      description: 'Ofrece 50% en sesión personal + acceso a clase exclusiva.',
      type: 'oferta',
      channel: 'whatsapp',
      recommendedTrigger: 'Inactividad > 30 días o cancelación inminente',
    },
    {
      id: 'human-touch',
      title: 'Contacto humano prioritario',
      description: 'Asignar task al equipo para llamada personal y seguimiento.',
      type: 'contacto',
      channel: 'llamada',
      recommendedTrigger: 'Riesgo > 80 o morosidad',
    },
  ];
};




