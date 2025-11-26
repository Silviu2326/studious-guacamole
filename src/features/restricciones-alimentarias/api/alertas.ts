export interface Alerta {
  id: string;
  mensaje: string;
  nivel: 'info' | 'warning' | 'critical';
  fecha: string;
}

export async function getAlertas(): Promise<Alerta[]> {
  const res = await fetch('/api/nutricion/alertas');
  if (!res.ok) return [];
  return res.json();
}

export async function generarReporteCompliance(payload: Record<string, unknown>): Promise<Blob | null> {
  const res = await fetch('/api/nutricion/compliance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return null;
  return res.blob();
}

export async function getReportesSeguridad(): Promise<unknown[]> {
  const res = await fetch('/api/nutricion/reportes-seguridad');
  if (!res.ok) return [];
  return res.json();
}


