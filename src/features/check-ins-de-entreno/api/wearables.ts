export type WearableSource = 'garmin' | 'fitbit' | 'apple' | 'whoop' | 'otro';

export interface WearableMetricSample {
  source: WearableSource;
  capturedAt: string;
  heartRateBpm?: number;
  hrvMs?: number;
  raw?: Record<string, any>;
}

export interface WearableLinkStatus {
  linked: boolean;
  source?: WearableSource;
  lastSyncAt?: string;
}

export async function getWearableLinkStatus(clienteId: string): Promise<WearableLinkStatus> {
  // Mock: alterna entre vinculado/no vinculado
  const linked = clienteId.length % 2 === 0;
  return {
    linked,
    source: linked ? 'garmin' : undefined,
    lastSyncAt: linked ? new Date(Date.now() - 30 * 60 * 1000).toISOString() : undefined,
  };
}

export async function linkWearableSource(clienteId: string, source: WearableSource): Promise<boolean> {
  // Mock: siempre ok
  return Promise.resolve(true);
}

export async function fetchRecentWearableMetrics(
  clienteId: string,
  sinceIso?: string
): Promise<WearableMetricSample[]> {
  // Mock de 5 muestras en la última hora
  const now = Date.now();
  const base = sinceIso ? new Date(sinceIso).getTime() : now - 60 * 60 * 1000;
  const source: WearableSource = 'garmin';
  const samples: WearableMetricSample[] = [];
  for (let i = 5; i >= 1; i--) {
    const t = base + (i * (now - base)) / 6;
    samples.push({
      source,
      capturedAt: new Date(t).toISOString(),
      heartRateBpm: 70 + Math.floor(Math.random() * 70),
      hrvMs: 40 + Math.floor(Math.random() * 35),
      raw: { mock: true },
    });
  }
  return Promise.resolve(samples);
}

export function correlateSensationsWithMetrics(
  sensacion?: string,
  samples?: WearableMetricSample[]
): { correlationHint?: string } {
  if (!sensacion || !samples || samples.length === 0) return {};
  const avgHr =
    samples.reduce((s, v) => s + (v.heartRateBpm || 0), 0) /
    samples.filter((v) => v.heartRateBpm).length;
  const avgHrv =
    samples.reduce((s, v) => s + (v.hrvMs || 0), 0) /
    samples.filter((v) => v.hrvMs).length;
  let hint = '';
  const sensacionLower = sensacion.toLowerCase();
  if (avgHr && avgHr > 110 && sensacionLower.includes('mal')) {
    hint = 'FC alta y sensaciones negativas: posible fatiga.';
  } else if (avgHrv && avgHrv > 55 && sensacionLower.includes('excelente')) {
    hint = 'HRV favorable alineada con sensaciones positivas.';
  }
  return hint ? { correlationHint: hint } : {};
}


