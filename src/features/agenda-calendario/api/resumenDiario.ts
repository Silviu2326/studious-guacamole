import {
  ConfiguracionResumenDiario,
  ResumenDiario,
  ResumenSesion,
  Cita,
} from '../types';
import { getCitas } from './calendario';

// Obtener configuración de resumen diario
export const getConfiguracionResumenDiario = async (userId?: string): Promise<ConfiguracionResumenDiario> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // En producción, esto haría una llamada real al backend
      const config: ConfiguracionResumenDiario = {
        id: '1',
        userId,
        activo: true,
        horaEnvio: '20:00', // 8 PM por defecto
        canal: 'email',
        incluirHorarios: true,
        incluirClientes: true,
        incluirTiposSesion: true,
        incluirNotas: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      resolve(config);
    }, 300);
  });
};

// Actualizar configuración de resumen diario
export const actualizarConfiguracionResumenDiario = async (
  configuracion: Partial<ConfiguracionResumenDiario>
): Promise<ConfiguracionResumenDiario> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const config: ConfiguracionResumenDiario = {
        id: configuracion.id || '1',
        userId: configuracion.userId,
        activo: configuracion.activo ?? true,
        horaEnvio: configuracion.horaEnvio || '20:00',
        canal: configuracion.canal || 'email',
        incluirHorarios: configuracion.incluirHorarios ?? true,
        incluirClientes: configuracion.incluirClientes ?? true,
        incluirTiposSesion: configuracion.incluirTiposSesion ?? true,
        incluirNotas: configuracion.incluirNotas ?? true,
        email: configuracion.email,
        createdAt: configuracion.createdAt || new Date(),
        updatedAt: new Date(),
      };
      resolve(config);
    }, 300);
  });
};

// Generar resumen diario para una fecha específica
export const generarResumenDiario = async (
  fecha: Date,
  userId?: string,
  role: 'entrenador' | 'gimnasio' = 'entrenador'
): Promise<ResumenDiario> => {
  return new Promise(async (resolve) => {
    // Obtener citas del día siguiente
    const fechaInicio = new Date(fecha);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date(fecha);
    fechaFin.setHours(23, 59, 59, 999);

    const citas = await getCitas(fechaInicio, fechaFin, role);

    // Filtrar solo citas confirmadas y convertir a ResumenSesion
    const sesiones: ResumenSesion[] = citas
      .filter((cita) => cita.estado === 'confirmada' || cita.estado === 'pendiente')
      .map((cita) => ({
        id: `res-${cita.id}`,
        citaId: cita.id,
        titulo: cita.titulo,
        tipo: cita.tipo,
        fechaInicio: cita.fechaInicio,
        fechaFin: cita.fechaFin,
        clienteNombre: cita.clienteNombre,
        clienteId: cita.clienteId,
        ubicacion: cita.ubicacion,
        notas: cita.notas,
        estado: cita.estado,
      }))
      .sort((a, b) => a.fechaInicio.getTime() - b.fechaInicio.getTime());

    const resumen: ResumenDiario = {
      id: `resumen-${fecha.getTime()}`,
      userId,
      fechaResumen: fecha,
      sesiones,
      enviado: false,
      leido: false,
      createdAt: new Date(),
    };

    resolve(resumen);
  });
};

// Obtener resumen diario por fecha
export const getResumenDiario = async (
  fecha: Date,
  userId?: string
): Promise<ResumenDiario | null> => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      // En producción, esto buscaría en la base de datos
      // Por ahora, generamos el resumen dinámicamente
      const resumen = await generarResumenDiario(fecha, userId);
      resolve(resumen);
    }, 300);
  });
};

// Obtener resúmenes diarios recientes
export const getResumenesDiarios = async (
  limite: number = 7,
  userId?: string
): Promise<ResumenDiario[]> => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      const resumenes: ResumenDiario[] = [];
      const hoy = new Date();
      
      // Generar resúmenes para los próximos 7 días
      for (let i = 0; i < limite; i++) {
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() + i);
        const resumen = await generarResumenDiario(fecha, userId);
        resumenes.push(resumen);
      }

      resolve(resumenes);
    }, 300);
  });
};

// Marcar resumen como leído
export const marcarResumenLeido = async (resumenId: string): Promise<ResumenDiario> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // En producción, esto actualizaría la base de datos
      const resumen: ResumenDiario = {
        id: resumenId,
        fechaResumen: new Date(),
        sesiones: [],
        enviado: false,
        leido: true,
        fechaLectura: new Date(),
        createdAt: new Date(),
      };
      resolve(resumen);
    }, 300);
  });
};

// Enviar resumen diario (simulado)
export const enviarResumenDiario = async (
  resumen: ResumenDiario,
  configuracion: ConfiguracionResumenDiario
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // En producción, esto enviaría el email o notificación real
      console.log('[resumenDiario.ts] Resumen diario enviado:', {
        fecha: resumen.fechaResumen,
        sesiones: resumen.sesiones.length,
        canal: configuracion.canal,
        email: configuracion.email,
      });
      resolve();
    }, 300);
  });
};

