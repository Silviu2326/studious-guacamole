export type TipoComida = 'desayuno' | 'almuerzo' | 'merienda' | 'cena' | 'snack';

export interface HorarioComida {
  tipoComida: TipoComida;
  hora: string; // Formato HH:mm
  activo: boolean;
}

export interface ConfigRecordatoriosCheckInNutricional {
  enabled: boolean;
  clienteId: string;
  entrenadorId: string;
  horariosComidas: HorarioComida[];
  minutosAnticipacion: number; // minutos antes de la hora de la comida
  canal: 'push' | 'email' | 'ambos';
  dias: Array<'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom'>; // días activos
  horasSilenciosas?: { start: string; end: string; enabled: boolean };
}

const STORAGE_KEYS = {
  CONFIG_POR_CLIENTE: 'checkins_nutricionales_recordatorios_config_por_cliente',
  HISTORIAL_ENVIOS: 'checkins_nutricionales_recordatorios_historial',
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

const HORARIOS_DEFAULT: HorarioComida[] = [
  { tipoComida: 'desayuno', hora: '08:00', activo: false },
  { tipoComida: 'almuerzo', hora: '13:00', activo: false },
  { tipoComida: 'merienda', hora: '17:00', activo: false },
  { tipoComida: 'cena', hora: '20:00', activo: false },
  { tipoComida: 'snack', hora: '11:00', activo: false },
];

export async function getConfigRecordatorios(
  entrenadorId: string,
  clienteId: string
): Promise<ConfigRecordatoriosCheckInNutricional> {
  const map = read<Record<string, ConfigRecordatoriosCheckInNutricional>>(
    STORAGE_KEYS.CONFIG_POR_CLIENTE,
    {}
  );
  const key = `${entrenadorId}_${clienteId}`;
  return (
    map[key] || {
      enabled: false,
      clienteId,
      entrenadorId,
      minutosAnticipacion: 15,
      canal: 'ambos',
      dias: ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'],
      horariosComidas: HORARIOS_DEFAULT,
      horasSilenciosas: { start: '22:00', end: '08:00', enabled: true },
    }
  );
}

export async function setConfigRecordatorios(
  entrenadorId: string,
  clienteId: string,
  config: ConfigRecordatoriosCheckInNutricional
): Promise<void> {
  const map = read<Record<string, ConfigRecordatoriosCheckInNutricional>>(
    STORAGE_KEYS.CONFIG_POR_CLIENTE,
    {}
  );
  const key = `${entrenadorId}_${clienteId}`;
  map[key] = config;
  write(STORAGE_KEYS.CONFIG_POR_CLIENTE, map);
}

function estaEnHorasSilenciosas(conf?: ConfigRecordatoriosCheckInNutricional['horasSilenciosas']): boolean {
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

function esDiaActivo(dia: string, diasActivos: Array<'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom'>): boolean {
  const diasMap: Record<string, 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom'> = {
    '0': 'dom',
    '1': 'lun',
    '2': 'mar',
    '3': 'mie',
    '4': 'jue',
    '5': 'vie',
    '6': 'sab',
  };
  const diaActual = diasMap[new Date().getDay().toString()];
  return diasActivos.includes(diaActual);
}

export async function verificarYProgramarRecordatoriosCheckInNutricional(
  entrenadorId: string,
  clienteId: string
): Promise<number> {
  const config = await getConfigRecordatorios(entrenadorId, clienteId);
  if (!config.enabled) return 0;
  if (estaEnHorasSilenciosas(config.horasSilenciosas)) return 0;
  if (!esDiaActivo(new Date().getDay().toString(), config.dias)) return 0;

  const ahora = new Date();
  const historial = read<Record<string, string[]>>(STORAGE_KEYS.HISTORIAL_ENVIOS, {});
  const enviadosCliente = new Set(historial[clienteId] || []);
  let count = 0;

  for (const horario of config.horariosComidas) {
    if (!horario.activo) continue;

    const [hora, minuto] = horario.hora.split(':').map(Number);
    const horaRecordatorio = new Date(ahora);
    horaRecordatorio.setHours(hora, minuto - config.minutosAnticipacion, 0, 0);

    // Si la hora de recordatorio ya pasó hoy, programar para mañana
    if (horaRecordatorio < ahora) {
      horaRecordatorio.setDate(horaRecordatorio.getDate() + 1);
    }

    const fechaKey = `${horaRecordatorio.toISOString().split('T')[0]}_${horario.tipoComida}`;
    
    // Verificar si ya se envió el recordatorio para esta comida hoy
    if (enviadosCliente.has(fechaKey)) continue;

    // Verificar si es el momento de enviar (dentro de un margen de 5 minutos)
    const diffMinutos = (horaRecordatorio.getTime() - ahora.getTime()) / (1000 * 60);
    if (diffMinutos >= 0 && diffMinutos <= 5) {
      // Simular envío
      console.log(
        `[checkins-nutricionales] Recordatorio de check-in para ${horario.tipoComida} (${horario.hora}) para cliente ${clienteId} via ${config.canal}`
      );
      enviadosCliente.add(fechaKey);
      count++;
    }
  }

  historial[clienteId] = Array.from(enviadosCliente);
  write(STORAGE_KEYS.HISTORIAL_ENVIOS, historial);
  return count;
}

export function iniciarVerificacionRecordatoriosCheckInNutricional(
  entrenadorId: string,
  clienteId: string
): NodeJS.Timeout {
  // Verificar cada 5 minutos
  return setInterval(async () => {
    try {
      await verificarYProgramarRecordatoriosCheckInNutricional(entrenadorId, clienteId);
    } catch (e) {
      console.error('[checkins-nutricionales] Error verificando recordatorios de check-in', e);
    }
  }, 5 * 60 * 1000);
}

