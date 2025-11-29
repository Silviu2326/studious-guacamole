import type { DatosSueño, DatosMeteorologicos, FeedbackCliente } from '../types';

// Simulación de base de datos en memoria
let datosSueñoDB: DatosSueño[] = [
  {
    fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    horasSueño: 7.5,
    calidadSueño: 8,
    horasProfundo: 2.5,
    horasREM: 1.8,
    latenciaSueño: 15,
    vecesDespertado: 1,
    fuente: 'wearable',
  },
  {
    fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    horasSueño: 6.5,
    calidadSueño: 6,
    horasProfundo: 2.0,
    horasREM: 1.5,
    latenciaSueño: 25,
    vecesDespertado: 3,
    fuente: 'wearable',
  },
];

let datosMeteorologicosDB: DatosMeteorologicos[] = [
  {
    fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    temperatura: 22,
    humedad: 65,
    condiciones: 'soleado',
    velocidadViento: 10,
    presionAtmosferica: 1013,
    indiceUV: 6,
  },
  {
    fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    temperatura: 18,
    humedad: 80,
    condiciones: 'lluvia',
    velocidadViento: 15,
    presionAtmosferica: 1008,
    indiceUV: 2,
  },
];

let feedbackDB: FeedbackCliente[] = [
  {
    id: 'feedback-1',
    clienteId: 'cliente-1',
    fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    tipo: 'post-sesion',
    puntuacion: 8,
    comentarios: 'Me sentí bien durante la sesión, aunque noté algo de fatiga al final.',
    nivelFatiga: 6,
    nivelDolor: 2,
    motivacion: 8,
    cumplimiento: 90,
    dificultad: 'adecuado',
    satisfaccion: 4,
  },
  {
    id: 'feedback-2',
    clienteId: 'cliente-1',
    fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    tipo: 'post-sesion',
    puntuacion: 7,
    comentarios: 'La sesión fue un poco más dura de lo esperado.',
    nivelFatiga: 8,
    nivelDolor: 4,
    motivacion: 7,
    cumplimiento: 85,
    dificultad: 'duro',
    satisfaccion: 3,
  },
];

export async function obtenerDatosSueño(
  clienteId: string,
  dias?: number
): Promise<DatosSueño[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let datos = datosSueñoDB;

  if (dias) {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - dias);
    datos = datos.filter(
      (d) => new Date(d.fecha).getTime() >= fechaLimite.getTime()
    );
  }

  return datos.sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
}

export async function obtenerDatosMeteorologicos(
  fecha?: string,
  dias?: number
): Promise<DatosMeteorologicos[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let datos = datosMeteorologicosDB;

  if (fecha && dias) {
    const fechaLimite = new Date(fecha);
    fechaLimite.setDate(fechaLimite.getDate() - dias);
    datos = datos.filter(
      (d) => new Date(d.fecha).getTime() >= fechaLimite.getTime()
    );
  }

  return datos.sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
}

export async function obtenerFeedbackCliente(
  clienteId: string,
  dias?: number
): Promise<FeedbackCliente[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let feedback = feedbackDB.filter((f) => f.clienteId === clienteId);

  if (dias) {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - dias);
    feedback = feedback.filter(
      (f) => new Date(f.fecha).getTime() >= fechaLimite.getTime()
    );
  }

  return feedback.sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
}

