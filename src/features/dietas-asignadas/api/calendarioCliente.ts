import type {
  RecordatorioCalendario,
  EventoCalendarioCliente,
  ConfiguracionCalendario,
  TipoRecordatorioCalendario,
  Dieta,
  Comida,
  TipoComida,
} from '../types';
import { getDieta } from './dietas';

// Mock storage
const recordatoriosStorage: Record<string, RecordatorioCalendario[]> = {};
const eventosStorage: Record<string, EventoCalendarioCliente[]> = {};
const configuracionesStorage: Record<string, ConfiguracionCalendario> = {};

/**
 * Obtiene la configuración de calendario para una dieta
 */
export async function getConfiguracionCalendario(
  dietaId: string,
  clienteId: string
): Promise<ConfiguracionCalendario | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const key = `${dietaId}-${clienteId}`;
  if (!configuracionesStorage[key]) {
    // Crear configuración por defecto
    const configDefault: ConfiguracionCalendario = {
      clienteId,
      dietaId,
      recordatoriosAutomaticos: {
        preparacionComidas: {
          activo: false,
          antelacionDias: 2,
          horaRecordatorio: '08:00',
        },
        listaCompra: {
          activo: false,
          antelacionDias: 1,
          horaRecordatorio: '09:00',
        },
        suplementos: {
          activo: false,
          recordarConComidas: true,
        },
      },
      notificaciones: {
        email: true,
        push: true,
        inApp: true,
      },
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    };
    configuracionesStorage[key] = configDefault;
  }
  return configuracionesStorage[key];
}

/**
 * Guarda o actualiza la configuración de calendario
 */
export async function guardarConfiguracionCalendario(
  config: ConfiguracionCalendario
): Promise<ConfiguracionCalendario> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const key = `${config.dietaId}-${config.clienteId}`;
  configuracionesStorage[key] = {
    ...config,
    actualizadoEn: new Date().toISOString(),
  };
  return configuracionesStorage[key];
}

/**
 * Crea un recordatorio de calendario
 */
export async function crearRecordatorioCalendario(
  recordatorio: Omit<RecordatorioCalendario, 'id' | 'creadoEn' | 'actualizadoEn'>
): Promise<RecordatorioCalendario> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const nuevoRecordatorio: RecordatorioCalendario = {
    ...recordatorio,
    id: `recordatorio-${Date.now()}`,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };

  const key = `${recordatorio.dietaId}-${recordatorio.clienteId}`;
  if (!recordatoriosStorage[key]) {
    recordatoriosStorage[key] = [];
  }
  recordatoriosStorage[key].push(nuevoRecordatorio);

  return nuevoRecordatorio;
}

/**
 * Obtiene todos los recordatorios para una dieta
 */
export async function getRecordatoriosCalendario(
  dietaId: string,
  clienteId: string,
  activos?: boolean
): Promise<RecordatorioCalendario[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const key = `${dietaId}-${clienteId}`;
  const recordatorios = recordatoriosStorage[key] || [];

  if (activos !== undefined) {
    return recordatorios.filter((r) => r.activo === activos);
  }

  return recordatorios;
}

/**
 * Actualiza un recordatorio
 */
export async function actualizarRecordatorioCalendario(
  recordatorioId: string,
  dietaId: string,
  clienteId: string,
  actualizaciones: Partial<RecordatorioCalendario>
): Promise<RecordatorioCalendario | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const key = `${dietaId}-${clienteId}`;
  const recordatorios = recordatoriosStorage[key] || [];

  const index = recordatorios.findIndex((r) => r.id === recordatorioId);
  if (index === -1) return null;

  recordatorios[index] = {
    ...recordatorios[index],
    ...actualizaciones,
    actualizadoEn: new Date().toISOString(),
  };

  return recordatorios[index];
}

/**
 * Elimina un recordatorio
 */
export async function eliminarRecordatorioCalendario(
  recordatorioId: string,
  dietaId: string,
  clienteId: string
): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const key = `${dietaId}-${clienteId}`;
  const recordatorios = recordatoriosStorage[key] || [];

  const index = recordatorios.findIndex((r) => r.id === recordatorioId);
  if (index === -1) return false;

  recordatorios.splice(index, 1);
  return true;
}

/**
 * Genera recordatorios automáticos basados en la configuración
 */
export async function generarRecordatoriosAutomaticos(
  dietaId: string,
  clienteId: string
): Promise<RecordatorioCalendario[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const config = await getConfiguracionCalendario(dietaId, clienteId);
  if (!config) {
    throw new Error('Configuración de calendario no encontrada');
  }

  const dieta = await getDieta(dietaId);
  if (!dieta) {
    throw new Error('Dieta no encontrada');
  }

  const recordatoriosGenerados: RecordatorioCalendario[] = [];
  const hoy = new Date();
  const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

  // Generar recordatorios de preparación de comidas
  if (config.recordatoriosAutomaticos.preparacionComidas.activo) {
    dieta.comidas.forEach((comida) => {
      if (comida.dia) {
        const diaIndex = diasSemana.indexOf(comida.dia);
        if (diaIndex !== -1) {
          const fechaComida = new Date(hoy);
          const diasHastaComida = (diaIndex - hoy.getDay() + 7) % 7;
          fechaComida.setDate(fechaComida.getDate() + diasHastaComida);

          const fechaRecordatorio = new Date(fechaComida);
          fechaRecordatorio.setDate(
            fechaRecordatorio.getDate() - config.recordatoriosAutomaticos.preparacionComidas.antelacionDias
          );

          const recordatorio: Omit<RecordatorioCalendario, 'id' | 'creadoEn' | 'actualizadoEn'> = {
            dietaId,
            clienteId,
            tipo: 'preparacion',
            titulo: `Preparar ${comida.nombre}`,
            descripcion: `Recuerda preparar ${comida.nombre} para ${comida.dia}`,
            fechaRecordatorio: fechaRecordatorio.toISOString(),
            horaRecordatorio: config.recordatoriosAutomaticos.preparacionComidas.horaRecordatorio,
            antelacionDias: config.recordatoriosAutomaticos.preparacionComidas.antelacionDias,
            relacionadoCon: {
              tipo: 'comida',
              id: comida.id,
              nombre: comida.nombre,
            },
            activo: true,
            enviado: false,
            completado: false,
            creadoPor: 'sistema',
          };

          recordatoriosGenerados.push(
            await crearRecordatorioCalendario(recordatorio)
          );
        }
      }
    });
  }

  // Generar recordatorio de lista de compra
  if (config.recordatoriosAutomaticos.listaCompra.activo) {
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay() + 1); // Lunes de esta semana
    inicioSemana.setDate(
      inicioSemana.getDate() + 7 - config.recordatoriosAutomaticos.listaCompra.antelacionDias
    );

    const recordatorio: Omit<RecordatorioCalendario, 'id' | 'creadoEn' | 'actualizadoEn'> = {
      dietaId,
      clienteId,
      tipo: 'compra',
      titulo: 'Lista de compra semanal',
      descripcion: 'Recuerda hacer la compra para la próxima semana',
      fechaRecordatorio: inicioSemana.toISOString(),
      horaRecordatorio: config.recordatoriosAutomaticos.listaCompra.horaRecordatorio,
      antelacionDias: config.recordatoriosAutomaticos.listaCompra.antelacionDias,
      relacionadoCon: {
        tipo: 'semana',
        nombre: 'Semana próxima',
      },
      repeticion: {
        activa: true,
        tipo: 'semanal',
        diasSemana: ['domingo'], // Recordar cada domingo
      },
      activo: true,
      enviado: false,
      completado: false,
      creadoPor: 'sistema',
    };

    recordatoriosGenerados.push(await crearRecordatorioCalendario(recordatorio));
  }

  return recordatoriosGenerados;
}

/**
 * Sincroniza eventos desde un calendario externo
 */
export async function sincronizarCalendarioExterno(
  dietaId: string,
  clienteId: string
): Promise<EventoCalendarioCliente[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const config = await getConfiguracionCalendario(dietaId, clienteId);
  if (!config || !config.calendarioExterno?.activo) {
    throw new Error('Calendario externo no configurado');
  }

  // Simular sincronización de eventos
  const eventos: EventoCalendarioCliente[] = [
    {
      id: `evento-${Date.now()}`,
      clienteId,
      titulo: 'Viaje de trabajo',
      descripcion: 'Viaje de 3 días a Madrid',
      fechaInicio: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      fechaFin: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      tipo: 'viaje',
      dietaId,
      impactoNutricional: {
        requiereAjuste: true,
        tipoAjuste: 'sustituir-comidas',
        recomendaciones: [
          'Preparar comidas portátiles',
          'Identificar restaurantes con opciones saludables',
        ],
      },
      sincronizadoDesde: config.calendarioExterno.tipo,
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    },
  ];

  const key = `${dietaId}-${clienteId}`;
  if (!eventosStorage[key]) {
    eventosStorage[key] = [];
  }
  eventosStorage[key].push(...eventos);

  // Actualizar última sincronización
  if (config.calendarioExterno) {
    config.calendarioExterno.ultimaSincronizacion = new Date().toISOString();
    await guardarConfiguracionCalendario(config);
  }

  return eventos;
}

/**
 * Obtiene eventos del calendario del cliente
 */
export async function getEventosCalendario(
  dietaId: string,
  clienteId: string,
  fechaInicio?: string,
  fechaFin?: string
): Promise<EventoCalendarioCliente[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const key = `${dietaId}-${clienteId}`;
  const eventos = eventosStorage[key] || [];

  if (fechaInicio || fechaFin) {
    return eventos.filter((e) => {
      const fecha = new Date(e.fechaInicio);
      if (fechaInicio && fecha < new Date(fechaInicio)) return false;
      if (fechaFin && fecha > new Date(fechaFin)) return false;
      return true;
    });
  }

  return eventos;
}

