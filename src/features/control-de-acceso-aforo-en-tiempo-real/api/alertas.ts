export interface AlertaAforo {
  id?: string;
  tipo: 'proximidad_limite' | 'aforo_completo' | 'emergencia' | 'mantenimiento' | 'sensor_fallo';
  nivel: 'info' | 'warning' | 'error' | 'critical';
  titulo: string;
  mensaje: string;
  zona?: string;
  fechaHora: string;
  leida: boolean;
  accionRequerida?: string;
  createdAt?: string;
}

export interface EstadisticasAlertas {
  totalAlertas: number;
  alertasNoLeidas: number;
  alertasCriticas: number;
  alertasHoy: number;
}

export async function obtenerAlertasAforo(filtro?: {
  nivel?: 'info' | 'warning' | 'error' | 'critical';
  leida?: boolean;
  fechaDesde?: string;
}): Promise<AlertaAforo[]> {
  const params = new URLSearchParams();
  if (filtro?.nivel) params.append('nivel', filtro.nivel);
  if (filtro?.leida !== undefined) params.append('leida', filtro.leida.toString());
  if (filtro?.fechaDesde) params.append('fechaDesde', filtro.fechaDesde);
  
  const res = await fetch(`/api/operaciones/alertas?${params.toString()}`);
  if (!res.ok) return [];
  return res.json();
}

export async function marcarAlertaLeida(alertaId: string): Promise<boolean> {
  const res = await fetch(`/api/operaciones/alertas/${alertaId}/leida`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.ok;
}

export async function marcarTodasLeidas(): Promise<boolean> {
  const res = await fetch('/api/operaciones/alertas/marcar-todas', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.ok;
}

export async function obtenerEstadisticasAlertas(): Promise<EstadisticasAlertas> {
  const res = await fetch('/api/operaciones/alertas/estadisticas');
  if (!res.ok) {
    return {
      totalAlertas: 0,
      alertasNoLeidas: 0,
      alertasCriticas: 0,
      alertasHoy: 0,
    };
  }
  return res.json();
}

export async function crearAlertaPersonalizada(
  alerta: Omit<AlertaAforo, 'id' | 'createdAt' | 'leida'>
): Promise<AlertaAforo | null> {
  const res = await fetch('/api/operaciones/alertas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...alerta,
      leida: false,
    }),
  });
  if (!res.ok) return null;
  return res.json();
}

