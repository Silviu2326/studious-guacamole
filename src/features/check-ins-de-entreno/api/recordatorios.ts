export interface ConfigRecordatoriosCheckIn {
  enabled: boolean;
  minutosAnticipacion: number; // minutos antes de la sesión
  canal: 'push' | 'email' | 'ambos';
  dias: Array<'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom'>; // días activos
  horasSilenciosas?: { start: string; end: string; enabled: boolean };
}

export interface SesionAgendada {
  id: string;
  clienteId: string;
  entrenadorId: string;
  fechaInicio: string; // ISO
  titulo?: string;
}

const STORAGE_KEYS = {
  CONFIG_ENTRENADOR: 'checkins_recordatorios_config_por_entrenador',
  HISTORIAL_ENVIOS: 'checkins_recordatorios_historial',
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export async function getConfigRecordatorios(entrenadorId: string): Promise<ConfigRecordatoriosCheckIn> {
  const map = read<Record<string, ConfigRecordatoriosCheckIn>>(STORAGE_KEYS.CONFIG_ENTRENADOR, {});
  return (
    map[entrenadorId] || {
      enabled: false,
      minutosAnticipacion: 60,
      canal: 'ambos',
      dias: ['lun', 'mar', 'mie', 'jue', 'vie'],
      horasSilenciosas: { start: '22:00', end: '08:00', enabled: true },
    }
  );
}

export async function setConfigRecordatorios(entrenadorId: string, config: ConfigRecordatoriosCheckIn): Promise<void> {
  const map = read<Record<string, ConfigRecordatoriosCheckIn>>(STORAGE_KEYS.CONFIG_ENTRENADOR, {});
  map[entrenadorId] = config;
  write(STORAGE_KEYS.CONFIG_ENTRENADOR, map);
}

// Mock de obtención de próximas sesiones (en producción vendría de agenda/calendario)
export async function getProximasSesionesCliente(clienteId: string, desde: Date, hasta: Date): Promise<SesionAgendada[]> {
  const base = new Date();
  const in2h = new Date(base.getTime() + 2 * 60 * 60 * 1000);
  const in26h = new Date(base.getTime() + 26 * 60 * 60 * 1000);
  const candidatas: SesionAgendada[] = [
    {
      id: 'ses_' + Math.random().toString(36).slice(2, 8),
      clienteId,
      entrenadorId: 'entrenador_demo',
      fechaInicio: in2h.toISOString(),
      titulo: 'Sesión de fuerza',
    },
    {
      id: 'ses_' + Math.random().toString(36).slice(2, 8),
      clienteId,
      entrenadorId: 'entrenador_demo',
      fechaInicio: in26h.toISOString(),
      titulo: 'Sesión de movilidad',
    },
  ];
  return Promise.resolve(
    candidatas.filter((s) => {
      const f = new Date(s.fechaInicio);
      return f >= desde && f <= hasta;
    })
  );
}

function estaEnHorasSilenciosas(conf?: ConfigRecordatoriosCheckIn['horasSilenciosas']): boolean {
  if (!conf?.enabled) return false;
  const now = new Date();
  const hh = now.getHours().toString().padStart(2, '0');
  const mm = now.getMinutes().toString().padStart(2, '0');
  const current = `${hh}:${mm}`;
  const start = conf.start;
  const end = conf.end;
  if (start <= end) {
    return current >= start && current <= end;
  }
  // ventana cruza medianoche
  return current >= start || current <= end;
}

export async function verificarYProgramarRecordatoriosCheckIn(
  entrenadorId: string,
  clienteId: string
): Promise<number> {
  const config = await getConfigRecordatorios(entrenadorId);
  if (!config.enabled) return 0;
  if (estaEnHorasSilenciosas(config.horasSilenciosas)) return 0;
  const ahora = new Date();
  const horizonte = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
  const sesiones = await getProximasSesionesCliente(clienteId, ahora, horizonte);
  const historial = read<Record<string, string[]>>(STORAGE_KEYS.HISTORIAL_ENVIOS, {});
  const enviadosCliente = new Set(historial[clienteId] || []);
  let count = 0;
  for (const sesion of sesiones) {
    const inicio = new Date(sesion.fechaInicio);
    const fechaNotificacion = new Date(inicio.getTime() - config.minutosAnticipacion * 60 * 1000);
    if (fechaNotificacion <= ahora) {
      // Evitar duplicados por sesión
      if (enviadosCliente.has(sesion.id)) continue;
      // Simular envío
      console.log(
        `[checkins] Recordatorio de check-in para cliente ${clienteId} (sesión ${sesion.titulo}) via ${config.canal}`
      );
      enviadosCliente.add(sesion.id);
      count++;
    }
  }
  historial[clienteId] = Array.from(enviadosCliente);
  write(STORAGE_KEYS.HISTORIAL_ENVIOS, historial);
  return count;
}

export function iniciarVerificacionRecordatoriosCheckIn(
  entrenadorId: string,
  clienteId: string
): NodeJS.Timeout {
  // Verificar cada 10 minutos
  return setInterval(async () => {
    try {
      await verificarYProgramarRecordatoriosCheckIn(entrenadorId, clienteId);
    } catch (e) {
      console.error('[checkins] Error verificando recordatorios de check-in', e);
    }
  }, 10 * 60 * 1000);
}


