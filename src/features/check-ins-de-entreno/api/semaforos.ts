export type Semaforo = 'verde' | 'amarillo' | 'rojo';

export interface ConfigSemaforos {
  entrenadorId: string;
  // Umbrales de RPE para rojo/amarillo. Verde es < umbralAmarillo
  umbralAmarilloRPE: number; // inclusive
  umbralRojoRPE: number; // inclusive
  // Reglas adicionales
  dolorLumbarEsRojo: boolean;
  palabrasClaveAmarillo: string[]; // sensaciones que disparan amarillo
  palabrasClaveRojo: string[]; // sensaciones que disparan rojo
  actualizadoEn: string;
}

const DEFAULT_CONFIG: Omit<ConfigSemaforos, 'entrenadorId' | 'actualizadoEn'> = {
  umbralAmarilloRPE: 12,
  umbralRojoRPE: 16,
  dolorLumbarEsRojo: true,
  palabrasClaveAmarillo: ['regular', 'mal', 'pesado', 'fatiga'],
  palabrasClaveRojo: ['dolor', 'lesión', 'parar'],
};

const memoria: Record<string, ConfigSemaforos> = {};

export async function getConfigSemaforos(entrenadorId: string): Promise<ConfigSemaforos> {
  if (!memoria[entrenadorId]) {
    memoria[entrenadorId] = {
      entrenadorId,
      ...DEFAULT_CONFIG,
      actualizadoEn: new Date().toISOString(),
    };
  }
  return Promise.resolve(memoria[entrenadorId]);
}

export async function setConfigSemaforos(
  entrenadorId: string,
  configParcial: Partial<Omit<ConfigSemaforos, 'entrenadorId' | 'actualizadoEn'>>
): Promise<ConfigSemaforos> {
  const actual = await getConfigSemaforos(entrenadorId);
  const nuevo: ConfigSemaforos = {
    ...actual,
    ...configParcial,
    actualizadoEn: new Date().toISOString(),
  };
  memoria[entrenadorId] = nuevo;
  return Promise.resolve(nuevo);
}

export function evaluarSemaforo(
  entrada: { rpe?: number; dolorLumbar?: boolean; sensaciones?: string },
  config: ConfigSemaforos
): Semaforo {
  if (entrada.dolorLumbar && config.dolorLumbarEsRojo) return 'rojo';

  const texto = (entrada.sensaciones || '').toLowerCase();
  const hayRojo = config.palabrasClaveRojo.some((p) => texto.includes(p.toLowerCase()));
  if (hayRojo) return 'rojo';
  const hayAmarillo = config.palabrasClaveAmarillo.some((p) => texto.includes(p.toLowerCase()));

  if (typeof entrada.rpe === 'number') {
    if (entrada.rpe >= config.umbralRojoRPE) return 'rojo';
    if (entrada.rpe >= config.umbralAmarilloRPE) return 'amarillo';
  }

  if (hayAmarillo) return 'amarillo';
  return 'verde';
}


