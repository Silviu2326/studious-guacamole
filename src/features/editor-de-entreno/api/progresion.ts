import { ProgresionConfig } from './editor';

export interface ProgresionAplicada {
  sesionId: string;
  configuracion: ProgresionConfig;
  fechaAplicacion: string;
  resultado?: {
    ejerciciosActualizados: number;
    cambios: Array<{
      ejercicioId: string;
      cambios: {
        peso?: number;
        repeticiones?: number;
        rpe?: number;
      };
    }>;
  };
}

export async function aplicarProgresion(sesionId: string, config: ProgresionConfig): Promise<ProgresionAplicada | null> {
  const res = await fetch('/api/entrenamiento/progresion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sesionId, config }),
  });
  if (!res.ok) return null;
  return res.json();
}

