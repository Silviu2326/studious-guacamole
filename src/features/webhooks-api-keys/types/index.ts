export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  secretKey?: string;
  scopes: string[];
  createdAt: string;
  revokedAt?: string;
  status: 'active' | 'revoked';
}

export interface Webhook {
  id: string;
  name: string;
  targetUrl: string;
  events: string[];
  secret: string;
  status: 'active' | 'disabled' | 'failed';
  createdAt: string;
}

export interface WebhookDeliveryLog {
  id: string;
  eventType: string;
  status: 'success' | 'failed' | 'pending_retry';
  responseCode: number;
  attemptCount: number;
  timestamp: string;
  errorMessage?: string;
}

export interface WebhookFormData {
  name: string;
  targetUrl: string;
  events: string[];
}

export interface ApiKeyFormData {
  name: string;
  scopes: string[];
}

export const AVAILABLE_SCOPES = [
  { value: 'members:read', label: 'Leer miembros' },
  { value: 'members:write', label: 'Modificar miembros' },
  { value: 'checkins:read', label: 'Leer check-ins' },
  { value: 'checkins:write', label: 'Crear check-ins' },
  { value: 'payments:read', label: 'Leer pagos' },
  { value: 'payments:write', label: 'Crear pagos' },
  { value: 'bookings:read', label: 'Leer reservas' },
  { value: 'bookings:write', label: 'Modificar reservas' },
  { value: 'classes:read', label: 'Leer clases' },
  { value: 'classes:write', label: 'Modificar clases' },
];

export const AVAILABLE_EVENTS = [
  { value: 'member.created', label: 'Miembro creado' },
  { value: 'member.updated', label: 'Miembro actualizado' },
  { value: 'member.deleted', label: 'Miembro eliminado' },
  { value: 'payment.completed', label: 'Pago completado' },
  { value: 'payment.failed', label: 'Pago fallido' },
  { value: 'payment.refunded', label: 'Pago reembolsado' },
  { value: 'booking.created', label: 'Reserva creada' },
  { value: 'booking.cancelled', label: 'Reserva cancelada' },
  { value: 'checkin.created', label: 'Check-in creado' },
  { value: 'membership.created', label: 'Membresía creada' },
  { value: 'membership.expired', label: 'Membresía expirada' },
];

