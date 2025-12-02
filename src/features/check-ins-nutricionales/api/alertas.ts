export interface ConfigAlertasCheckInNutricional {
  enabled: boolean;
  clienteId: string;
  entrenadorId: string;
  // Alerta por días sin check-ins
  diasSinCheckIns: {
    enabled: boolean;
    umbralDias: number; // Número de días sin check-ins para activar alerta
  };
  // Alerta por umbral de adherencia
  umbralAdherencia: {
    enabled: boolean;
    umbralPorcentaje: number; // Porcentaje mínimo de adherencia (ej: 60%)
  };
  // Canal de notificación
  canal: 'push' | 'email' | 'ambos';
}

export interface AlertaCheckInNutricional {
  id: string;
  tipo: 'dias_sin_checkins' | 'umbral_adherencia';
  clienteId: string;
  entrenadorId: string;
  mensaje: string;
  severidad: 'baja' | 'media' | 'alta';
  fechaCreacion: Date;
  leida: boolean;
  fechaResolucion?: Date;
  datos?: {
    diasSinCheckIns?: number;
    adherenciaActual?: number;
    umbralConfigurado?: number;
  };
}

const STORAGE_KEYS = {
  CONFIG_ALERTAS: 'checkins_nutricionales_alertas_config',
  ALERTAS_ACTIVAS: 'checkins_nutricionales_alertas_activas',
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

export async function getConfigAlertas(
  entrenadorId: string,
  clienteId: string
): Promise<ConfigAlertasCheckInNutricional> {
  const map = read<Record<string, ConfigAlertasCheckInNutricional>>(
    STORAGE_KEYS.CONFIG_ALERTAS,
    {}
  );
  const key = `${entrenadorId}_${clienteId}`;
  return (
    map[key] || {
      enabled: false,
      clienteId,
      entrenadorId,
      diasSinCheckIns: {
        enabled: true,
        umbralDias: 3, // Por defecto: alerta después de 3 días sin check-ins
      },
      umbralAdherencia: {
        enabled: true,
        umbralPorcentaje: 60, // Por defecto: alerta si adherencia < 60%
      },
      canal: 'ambos',
    }
  );
}

export async function setConfigAlertas(
  entrenadorId: string,
  clienteId: string,
  config: ConfigAlertasCheckInNutricional
): Promise<void> {
  const map = read<Record<string, ConfigAlertasCheckInNutricional>>(
    STORAGE_KEYS.CONFIG_ALERTAS,
    {}
  );
  const key = `${entrenadorId}_${clienteId}`;
  map[key] = config;
  write(STORAGE_KEYS.CONFIG_ALERTAS, map);
}

export async function getAlertas(
  entrenadorId?: string,
  clienteId?: string,
  leidas?: boolean
): Promise<AlertaCheckInNutricional[]> {
  const alertas = read<AlertaCheckInNutricional[]>(
    STORAGE_KEYS.ALERTAS_ACTIVAS,
    []
  );

  let resultado = alertas;

  if (entrenadorId) {
    resultado = resultado.filter((a) => a.entrenadorId === entrenadorId);
  }
  if (clienteId) {
    resultado = resultado.filter((a) => a.clienteId === clienteId);
  }
  if (leidas !== undefined) {
    resultado = resultado.filter((a) => a.leida === leidas);
  }

  // Convertir fechas de string a Date
  return resultado.map((a) => ({
    ...a,
    fechaCreacion: new Date(a.fechaCreacion),
    fechaResolucion: a.fechaResolucion ? new Date(a.fechaResolucion) : undefined,
  }));
}

export async function crearAlerta(
  alerta: Omit<AlertaCheckInNutricional, 'id' | 'fechaCreacion'>
): Promise<AlertaCheckInNutricional> {
  const alertas = read<AlertaCheckInNutricional[]>(
    STORAGE_KEYS.ALERTAS_ACTIVAS,
    []
  );

  const nuevaAlerta: AlertaCheckInNutricional = {
    ...alerta,
    id: `alerta_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
    fechaCreacion: new Date(),
  };

  alertas.push(nuevaAlerta);
  write(STORAGE_KEYS.ALERTAS_ACTIVAS, alertas);

  return nuevaAlerta;
}

export async function marcarAlertaLeida(
  alertaId: string
): Promise<boolean> {
  const alertas = read<AlertaCheckInNutricional[]>(
    STORAGE_KEYS.ALERTAS_ACTIVAS,
    []
  );

  const index = alertas.findIndex((a) => a.id === alertaId);
  if (index === -1) return false;

  alertas[index] = {
    ...alertas[index],
    leida: true,
    fechaResolucion: new Date(),
  };

  write(STORAGE_KEYS.ALERTAS_ACTIVAS, alertas);
  return true;
}

// Función para verificar y crear alertas automáticas
export async function verificarYCrearAlertas(
  entrenadorId: string,
  clienteId: string,
  datos: {
    diasSinCheckIns?: number;
    adherenciaActual?: number;
  }
): Promise<AlertaCheckInNutricional[]> {
  const config = await getConfigAlertas(entrenadorId, clienteId);
  if (!config.enabled) return [];

  const alertasCreadas: AlertaCheckInNutricional[] = [];
  const alertasExistentes = await getAlertas(entrenadorId, clienteId, false);

  // Verificar alerta por días sin check-ins
  if (
    config.diasSinCheckIns.enabled &&
    datos.diasSinCheckIns !== undefined &&
    datos.diasSinCheckIns >= config.diasSinCheckIns.umbralDias
  ) {
    // Verificar si ya existe una alerta activa de este tipo
    const existeAlerta = alertasExistentes.some(
      (a) => a.tipo === 'dias_sin_checkins' && !a.leida
    );

    if (!existeAlerta) {
      const severidad =
        datos.diasSinCheckIns >= config.diasSinCheckIns.umbralDias * 2
          ? 'alta'
          : datos.diasSinCheckIns >= config.diasSinCheckIns.umbralDias * 1.5
          ? 'media'
          : 'baja';

      const alerta = await crearAlerta({
        tipo: 'dias_sin_checkins',
        clienteId,
        entrenadorId,
        mensaje: `El cliente lleva ${datos.diasSinCheckIns} días sin realizar check-ins nutricionales. Es recomendable contactarlo para evitar el abandono del plan.`,
        severidad,
        leida: false,
        datos: {
          diasSinCheckIns: datos.diasSinCheckIns,
        },
      });

      alertasCreadas.push(alerta);

      // Simular envío de notificación
      console.log(
        `[checkins-nutricionales] Alerta enviada: ${alerta.mensaje} (canal: ${config.canal})`
      );
    }
  }

  // Verificar alerta por umbral de adherencia
  if (
    config.umbralAdherencia.enabled &&
    datos.adherenciaActual !== undefined &&
    datos.adherenciaActual < config.umbralAdherencia.umbralPorcentaje
  ) {
    // Verificar si ya existe una alerta activa de este tipo
    const existeAlerta = alertasExistentes.some(
      (a) => a.tipo === 'umbral_adherencia' && !a.leida
    );

    if (!existeAlerta) {
      const diferencia = config.umbralAdherencia.umbralPorcentaje - datos.adherenciaActual;
      const severidad =
        diferencia > 30 ? 'alta' : diferencia > 15 ? 'media' : 'baja';

      const alerta = await crearAlerta({
        tipo: 'umbral_adherencia',
        clienteId,
        entrenadorId,
        mensaje: `La adherencia nutricional del cliente (${datos.adherenciaActual.toFixed(1)}%) está por debajo del umbral configurado (${config.umbralAdherencia.umbralPorcentaje}%). Se recomienda intervenir para evitar el abandono del plan.`,
        severidad,
        leida: false,
        datos: {
          adherenciaActual: datos.adherenciaActual,
          umbralConfigurado: config.umbralAdherencia.umbralPorcentaje,
        },
      });

      alertasCreadas.push(alerta);

      // Simular envío de notificación
      console.log(
        `[checkins-nutricionales] Alerta enviada: ${alerta.mensaje} (canal: ${config.canal})`
      );
    }
  }

  return alertasCreadas;
}

// Función para iniciar verificación periódica de alertas
export function iniciarVerificacionAlertas(
  entrenadorId: string,
  clienteId: string,
  obtenerDatos: () => Promise<{
    diasSinCheckIns?: number;
    adherenciaActual?: number;
  }>
): NodeJS.Timeout {
  // Verificar cada hora
  return setInterval(async () => {
    try {
      const datos = await obtenerDatos();
      await verificarYCrearAlertas(entrenadorId, clienteId, datos);
    } catch (e) {
      console.error('[checkins-nutricionales] Error verificando alertas', e);
    }
  }, 60 * 60 * 1000); // Cada hora
}

