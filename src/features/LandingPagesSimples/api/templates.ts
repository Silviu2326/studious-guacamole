export interface LandingTemplate {
  id: string;
  name: string;
  goal: string;
  description: string;
  headline: string;
  cta: string;
}

export interface LeadMetric {
  id: string;
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'stable';
}

export const fetchLandingTemplates = async (): Promise<LandingTemplate[]> => {
  return [
    {
      id: 'free-trial',
      name: 'Prueba gratis',
      goal: 'Generar leads interesados en entrenar 7 días gratis',
      description: 'Landing enfocada a captar leads con pase de prueba gratuito.',
      headline: 'Activa tu pase de prueba gratuito de 7 días',
      cta: 'Quiero mi pase de prueba',
    },
    {
      id: 'open-day',
      name: 'Día abierto',
      goal: 'Registrar asistentes al open day del gimnasio',
      description: 'Ideal para eventos puntuales y jornadas de puertas abiertas.',
      headline: 'Reserva tu lugar para nuestro Día Abierto',
      cta: 'Reservar asistencia',
    },
    {
      id: '30-day-challenge',
      name: 'Reto 30 días',
      goal: 'Captar clientes para un reto intensivo de 30 días',
      description: 'Promoción orientada a generar compromiso y seguimiento.',
      headline: 'Únete al reto 30 días y transforma tu cuerpo',
      cta: 'Me apunto al reto',
    },
  ];
};

export const fetchLeadMetrics = async (): Promise<LeadMetric[]> => {
  return [
    { id: 'leads-captured', label: 'Leads captados', value: '124', trend: 'up' },
    { id: 'conversion-rate', label: 'Conversión formulario', value: '18%', trend: 'up' },
    { id: 'crm-pipeline', label: 'En CRM (pipeline)', value: '97', trend: 'stable' },
  ];
};













