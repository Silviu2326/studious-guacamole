import { AlertaCheckIn } from './alertas';
import { aplicarAjusteAutomatico } from './patrones';

export type TipoAjuste =
  | 'reducir_intensidad'
  | 'cambiar_ejercicio'
  | 'aumentar_descanso'
  | 'mantener';

export interface ReglaAutomatica {
  id: string;
  enabled: boolean;
  coincidencia: {
    tipo: AlertaCheckIn['tipo'] | 'cualquiera';
    severidad: AlertaCheckIn['severidad'] | 'cualquiera';
  };
  ajuste: TipoAjuste;
  nota?: string;
}

export interface ConfigReglasAutomaticas {
  clienteId: string;
  reglas: ReglaAutomatica[];
  autoResolverAlerta: boolean;
}

export async function getConfigReglas(clienteId: string): Promise<ConfigReglasAutomaticas> {
  // Mock: conjunto por defecto
  const reglas: ReglaAutomatica[] = [
    {
      id: 'r1',
      enabled: true,
      coincidencia: { tipo: 'dolor_lumbar', severidad: 'alta' },
      ajuste: 'cambiar_ejercicio',
      nota: 'Dolor lumbar alto -> sustituir ejercicio',
    },
    {
      id: 'r2',
      enabled: true,
      coincidencia: { tipo: 'fatiga_extrema', severidad: 'cualquiera' },
      ajuste: 'aumentar_descanso',
    },
    {
      id: 'r3',
      enabled: false,
      coincidencia: { tipo: 'patron_negativo', severidad: 'media' },
      ajuste: 'reducir_intensidad',
    },
  ];
  return {
    clienteId,
    reglas,
    autoResolverAlerta: true,
  };
}

export async function setConfigReglas(
  clienteId: string,
  config: ConfigReglasAutomaticas
): Promise<ConfigReglasAutomaticas> {
  // Mock: devolver lo recibido
  return Promise.resolve({ ...config, clienteId });
}

export async function evaluarYAplicarReglas(
  clienteId: string,
  alerta: AlertaCheckIn,
  checkInId: string
): Promise<{ aplicado: boolean; ajuste?: TipoAjuste }> {
  const cfg = await getConfigReglas(clienteId);
  const regla = cfg.reglas.find((r) => {
    if (!r.enabled) return false;
    const tipoOk = r.coincidencia.tipo === 'cualquiera' || r.coincidencia.tipo === alerta.tipo;
    const sevOk =
      r.coincidencia.severidad === 'cualquiera' || r.coincidencia.severidad === alerta.severidad;
    return tipoOk && sevOk;
  });
  if (!regla) return { aplicado: false };
  const ok = await aplicarAjusteAutomatico(clienteId, checkInId, regla.ajuste);
  return { aplicado: ok, ajuste: regla.ajuste };
}


