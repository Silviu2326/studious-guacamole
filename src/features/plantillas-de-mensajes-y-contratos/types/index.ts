export type TemplateType = 'EMAIL' | 'SMS' | 'CONTRACT';

export interface Template {
  id: string;
  name: string;
  type: TemplateType;
  subject?: string;
  bodyHtml: string;
  requiresSignature?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface TemplatePagination {
  total: number;
  page: number;
  limit: number;
}

export interface TemplateResponse {
  data: Template[];
  pagination: TemplatePagination;
}

export interface CreateTemplateRequest {
  name: string;
  type: TemplateType;
  subject?: string;
  bodyHtml: string;
  requiresSignature?: boolean;
}

export interface UpdateTemplateRequest {
  name?: string;
  type?: TemplateType;
  subject?: string;
  bodyHtml?: string;
  requiresSignature?: boolean;
  isActive?: boolean;
}

export const AVAILABLE_VARIABLES = [
  { value: '{{client_name}}', label: 'Nombre del Cliente', description: 'Nombre completo del cliente' },
  { value: '{{client_first_name}}', label: 'Nombre (sin apellido)', description: 'Solo el primer nombre' },
  { value: '{{client_last_name}}', label: 'Apellido', description: 'Solo el apellido' },
  { value: '{{client_email}}', label: 'Email del Cliente', description: 'Dirección de correo electrónico' },
  { value: '{{client_phone}}', label: 'Teléfono del Cliente', description: 'Número de teléfono' },
  { value: '{{join_date}}', label: 'Fecha de Ingreso', description: 'Fecha en que se registró' },
  { value: '{{membership_plan}}', label: 'Plan de Membresía', description: 'Nombre del plan contratado' },
  { value: '{{plan_name}}', label: 'Nombre del Plan', description: 'Sinónimo de membership_plan' },
  { value: '{{next_session_date}}', label: 'Próxima Sesión', description: 'Fecha de la próxima sesión agendada' },
  { value: '{{gym_name}}', label: 'Nombre del Gimnasio', description: 'Nombre del centro o gimnasio' },
  { value: '{{gym_address}}', label: 'Dirección del Gimnasio', description: 'Dirección física del centro' },
  { value: '{{gym_phone}}', label: 'Teléfono del Gimnasio', description: 'Teléfono de contacto' },
  { value: '{{today_date}}', label: 'Fecha Actual', description: 'Fecha del día de hoy' },
];

export interface TemplateFormData {
  name: string;
  type: TemplateType;
  subject: string;
  bodyHtml: string;
  requiresSignature: boolean;
  isActive: boolean;
}

