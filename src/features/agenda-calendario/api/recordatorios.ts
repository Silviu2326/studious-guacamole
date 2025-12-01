import {
  ConfiguracionRecordatorios,
  RecordatorioConfiguracion,
  PreferenciasRecordatorioCliente,
  HistorialRecordatorio,
  Cita,
  Recordatorio,
  CanalRecordatorio,
} from '../types';
import { getCitas } from './calendario';

/**
 * Contexto para obtener configuración de recordatorios
 * Permite filtrar o personalizar la configuración según el contexto de uso
 */
export interface ContextoRecordatorios {
  /** ID del usuario/entrenador */
  userId?: string;
  /** ID del centro/gimnasio (si aplica) */
  centroId?: string;
  /** Si incluir configuraciones inactivas */
  incluirInactivos?: boolean;
  /** Filtro por tipo de sesión */
  tipoSesion?: string;
}

// Almacenamiento mock en memoria para la configuración
let mockConfiguracionStorage: ConfiguracionRecordatorios | null = null;

// Obtener configuración de recordatorios
export const getConfiguracionRecordatorios = async (
  contexto?: string | ContextoRecordatorios
): Promise<ConfiguracionRecordatorios> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // En producción, esto haría una llamada real al backend
      // Parsear contexto: puede ser string (userId legacy) o objeto ContextoRecordatorios
      let userId: string | undefined;
      let contextoObj: ContextoRecordatorios | undefined;
      
      if (typeof contexto === 'string') {
        userId = contexto;
      } else if (contexto) {
        contextoObj = contexto;
        userId = contexto.userId;
      }

      // Si hay configuración guardada, usarla; si no, crear una por defecto
      const config: ConfiguracionRecordatorios = mockConfiguracionStorage || {
        id: '1',
        userId,
        activo: true,
        recordatorios: [
          {
            id: 'r1',
            tiempoAnticipacionHoras: 24,
            activo: true,
            canales: ['whatsapp', 'email'],
            orden: 1,
          },
          {
            id: 'r2',
            tiempoAnticipacionHoras: 2,
            activo: true,
            canales: ['whatsapp'],
            orden: 2,
          },
        ],
        plantillaMensaje: 'Hola {nombre}, te recordamos que tienes una sesión el {fecha} a las {hora} en {lugar}. ¡Te esperamos!',
        canalPorDefecto: 'whatsapp',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Filtrar recordatorios inactivos si no se solicitan
      if (contextoObj && !contextoObj.incluirInactivos) {
        config.recordatorios = config.recordatorios.filter(r => r.activo);
      }

      resolve(config);
    }, 300);
  });
};

// Guardar configuración de recordatorios (lista de RecordatorioConfiguracion)
export const saveConfiguracionRecordatorios = async (
  lista: RecordatorioConfiguracion[],
  contexto?: ContextoRecordatorios
): Promise<ConfiguracionRecordatorios> => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      // Obtener configuración existente o crear una nueva
      const configExistente = await getConfiguracionRecordatorios(contexto);
      
      const config: ConfiguracionRecordatorios = {
        ...configExistente,
        recordatorios: lista.map((r, index) => ({
          ...r,
          orden: r.orden || index + 1,
        })),
        updatedAt: new Date(),
      };

      // Guardar en almacenamiento mock
      mockConfiguracionStorage = config;
      
      resolve(config);
    }, 300);
  });
};

// Actualizar configuración de recordatorios
export const actualizarConfiguracionRecordatorios = async (
  configuracion: Partial<ConfiguracionRecordatorios>
): Promise<ConfiguracionRecordatorios> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const config: ConfiguracionRecordatorios = {
        id: configuracion.id || '1',
        userId: configuracion.userId,
        activo: configuracion.activo ?? true,
        recordatorios: configuracion.recordatorios || [
          {
            id: 'r1',
            tiempoAnticipacionHoras: 24,
            activo: true,
            canales: ['whatsapp'],
            orden: 1,
          },
          {
            id: 'r2',
            tiempoAnticipacionHoras: 2,
            activo: true,
            canales: ['whatsapp'],
            orden: 2,
          },
        ],
        plantillaMensaje: configuracion.plantillaMensaje || 'Hola {nombre}, te recordamos que tienes una sesión el {fecha} a las {hora} en {lugar}. ¡Te esperamos!',
        canalPorDefecto: configuracion.canalPorDefecto || 'whatsapp',
        createdAt: configuracion.createdAt || new Date(),
        updatedAt: new Date(),
      };
      
      // Guardar en almacenamiento mock
      mockConfiguracionStorage = config;
      
      resolve(config);
    }, 300);
  });
};

// Obtener preferencias de recordatorios de un cliente
export const getPreferenciasRecordatorioCliente = async (
  clienteId: string
): Promise<PreferenciasRecordatorioCliente | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // En producción, esto haría una llamada real al backend
      // Por defecto, todos los clientes aceptan recordatorios
      const preferencias: PreferenciasRecordatorioCliente = {
        id: `pref-${clienteId}`,
        clienteId,
        recordatoriosDesactivados: false,
        canalPreferido: 'whatsapp',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      resolve(preferencias);
    }, 300);
  });
};

// Actualizar preferencias de recordatorios de un cliente
export const actualizarPreferenciasRecordatorioCliente = async (
  preferencias: Partial<PreferenciasRecordatorioCliente>
): Promise<PreferenciasRecordatorioCliente> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const prefs: PreferenciasRecordatorioCliente = {
        id: preferencias.id || `pref-${preferencias.clienteId}`,
        clienteId: preferencias.clienteId!,
        clienteNombre: preferencias.clienteNombre,
        recordatoriosDesactivados: preferencias.recordatoriosDesactivados ?? false,
        canalPreferido: preferencias.canalPreferido,
        telefono: preferencias.telefono,
        email: preferencias.email,
        createdAt: preferencias.createdAt || new Date(),
        updatedAt: new Date(),
      };
      resolve(prefs);
    }, 300);
  });
};

// Obtener historial de recordatorios
export const getHistorialRecordatorios = async (
  fechaInicio?: Date,
  fechaFin?: Date
): Promise<HistorialRecordatorio[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // En producción, esto haría una llamada real al backend
      const historial: HistorialRecordatorio[] = [];
      resolve(historial);
    }, 300);
  });
};

// Enviar recordatorio manualmente (para testing)
export const enviarRecordatorio = async (
  cita: Cita,
  configuracion: RecordatorioConfiguracion
): Promise<HistorialRecordatorio> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Personalizar mensaje con variables
      const mensaje = personalizarMensaje(
        'Hola {nombre}, te recordamos que tienes una sesión el {fecha} a las {hora} en {lugar}. ¡Te esperamos!',
        cita
      );

      const historial: HistorialRecordatorio = {
        id: `hist-${Date.now()}`,
        citaId: cita.id,
        clienteId: cita.clienteId || '',
        tipo: configuracion.canales[0] || 'whatsapp',
        tiempoAnticipacionHoras: configuracion.tiempoAnticipacionHoras,
        mensaje,
        enviado: true,
        fechaEnvio: new Date(),
        leido: false,
        createdAt: new Date(),
      };

      console.log('[recordatorios.ts] Recordatorio enviado:', historial);
      resolve(historial);
    }, 300);
  });
};

/**
 * Personalizar mensaje con variables de la cita
 * 
 * CAMPOS DE CITA UTILIZADOS PARA GENERAR RECORDATORIOS:
 * 
 * La función utiliza los siguientes campos de la interfaz `Cita`:
 * 
 * 1. **fechaInicio** (Date) - REQUERIDO
 *    - Se usa para calcular el tiempo de anticipación del recordatorio
 *    - Se formatea como fecha y hora en el mensaje
 *    - Ejemplo: "lunes, 15 de enero de 2024" y "10:00"
 * 
 * 2. **clienteNombre** (string) - OPCIONAL pero recomendado
 *    - Se usa para personalizar el saludo: "Hola {nombre}"
 *    - Si no está disponible, se usa "Cliente" como valor por defecto
 *    - También disponible como: cita.cliente?.nombre
 * 
 * 3. **ubicacion** (string) - OPCIONAL
 *    - Se usa para indicar dónde será la sesión: "en {lugar}"
 *    - Si no está disponible, se usa "el lugar acordado" como valor por defecto
 * 
 * 4. **titulo** (string) - OPCIONAL
 *    - Se usa para incluir el título de la sesión en el mensaje
 *    - Variable disponible: {titulo}
 * 
 * 5. **id** (string) - REQUERIDO
 *    - Se usa para generar enlaces de confirmación/cancelación
 *    - Se incluye en las URLs: /confirmar-sesion?citaId={id}
 * 
 * 6. **clienteId** (string) - OPCIONAL pero recomendado
 *    - Se usa para obtener preferencias del cliente (canal preferido, idioma)
 *    - También disponible como: cita.cliente?.id
 *    - Se usa para filtrar clientes que tienen recordatorios desactivados
 * 
 * 7. **estado** (EstadoCita) - REQUERIDO
 *    - Se usa para filtrar citas válidas para recordatorios
 *    - Solo se envían recordatorios a citas con estado: 'confirmada' o 'reservada'
 *    - No se envían a citas: 'cancelada', 'completada', 'noShow'
 * 
 * 8. **cliente.email** (string) - OPCIONAL
 *    - Se usa cuando el canal de recordatorio es 'email'
 *    - Necesario para enviar recordatorios por correo electrónico
 * 
 * 9. **cliente.telefono** (string) - OPCIONAL
 *    - Se usa cuando el canal de recordatorio es 'sms' o 'whatsapp'
 *    - Necesario para enviar recordatorios por SMS o WhatsApp
 * 
 * NOTAS ADICIONALES:
 * - El sistema respeta las preferencias del cliente (PreferenciasRecordatorioCliente)
 * - Si el cliente tiene recordatorios desactivados, no se generan recordatorios
 * - El canal preferido del cliente tiene prioridad sobre la configuración global
 * - El idioma del mensaje se puede determinar desde las preferencias del cliente (futuro)
 */
export const personalizarMensaje = (plantilla: string, cita: Cita): string => {
  const fechaInicio = new Date(cita.fechaInicio);
  const fechaFormateada = fechaInicio.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const horaFormateada = fechaInicio.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Usar cliente.nombre si está disponible, sino clienteNombre (legacy), sino 'Cliente'
  const nombreCliente = cita.cliente?.nombre || cita.clienteNombre || 'Cliente';
  
  let mensaje = plantilla
    .replace(/{nombre}/g, nombreCliente)
    .replace(/{fecha}/g, fechaFormateada)
    .replace(/{hora}/g, horaFormateada)
    .replace(/{lugar}/g, cita.ubicacion || 'el lugar acordado')
    .replace(/{titulo}/g, cita.titulo || 'Sesión');

  // Agregar enlaces de confirmación si el recordatorio lo requiere
  // En WhatsApp, esto se mostraría como botones interactivos
  // En SMS/Email, se mostrarían como enlaces
  const baseUrl = window.location.origin;
  const confirmarUrl = `${baseUrl}/confirmar-sesion?citaId=${cita.id}&accion=confirmar`;
  const cancelarUrl = `${baseUrl}/confirmar-sesion?citaId=${cita.id}&accion=cancelar`;

  // Para WhatsApp (se agregarían botones interactivos en producción)
  mensaje += `\n\n¿Confirmas tu asistencia?\n`;
  mensaje += `✅ Confirmo: ${confirmarUrl}\n`;
  mensaje += `❌ No puedo ir: ${cancelarUrl}`;

  return mensaje;
};

// Obtener todas las preferencias de clientes
export const getTodasPreferenciasClientes = async (): Promise<PreferenciasRecordatorioCliente[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // En producción, esto haría una llamada real al backend
      const preferencias: PreferenciasRecordatorioCliente[] = [];
      resolve(preferencias);
    }, 300);
  });
};

/**
 * Simula recordatorios pendientes que se habrían enviado en un momento dado
 * 
 * Esta función es útil para:
 * - Debug: ver qué recordatorios se habrían enviado en un momento específico
 * - Analítica: analizar el comportamiento del sistema de recordatorios
 * - Testing: probar la lógica de recordatorios sin enviarlos realmente
 * 
 * @param fechaActual - Fecha y hora para la cual simular los recordatorios pendientes
 * @param contexto - Contexto opcional para filtrar citas (userId, centroId, etc.)
 * @returns Lista de recordatorios que se habrían enviado en esa fecha/hora
 * 
 * @example
 * ```typescript
 * // Simular recordatorios pendientes para ahora
 * const recordatorios = await simularRecordatoriosPendientes(new Date());
 * 
 * // Simular para una fecha específica (útil para debug)
 * const fechaSimulacion = new Date('2024-01-15T10:00:00');
 * const recordatorios = await simularRecordatoriosPendientes(fechaSimulacion, { userId: 'user123' });
 * ```
 */
export const simularRecordatoriosPendientes = async (
  fechaActual: Date,
  contexto?: ContextoRecordatorios
): Promise<Recordatorio[]> => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      try {
        // Obtener configuración de recordatorios
        const config = await getConfiguracionRecordatorios(contexto);
        
        // Si la configuración está desactivada, no hay recordatorios pendientes
        if (!config.activo) {
          resolve([]);
          return;
        }

        // Obtener citas futuras (próximas 48 horas para cubrir recordatorios de hasta 48h antes)
        const fechaInicio = new Date(fechaActual);
        const fechaFin = new Date(fechaActual);
        fechaFin.setHours(fechaFin.getHours() + 48);

        const citas = await getCitas({
          fechaInicio,
          fechaFin,
          entrenadorId: contexto?.userId,
          centroId: contexto?.centroId,
          incluirCanceladas: false,
        });

        // Filtrar solo citas confirmadas o reservadas (no canceladas)
        const citasValidas = citas.filter(
          cita => cita.estado === 'confirmada' || cita.estado === 'reservada'
        );

        const recordatoriosPendientes: Recordatorio[] = [];

        // Para cada cita válida, verificar si debería tener recordatorios pendientes
        for (const cita of citasValidas) {
          const fechaInicioCita = new Date(cita.fechaInicio);
          const tiempoRestanteMs = fechaInicioCita.getTime() - fechaActual.getTime();
          const tiempoRestanteHoras = tiempoRestanteMs / (1000 * 60 * 60);

          // Obtener preferencias del cliente (si existen)
          const preferenciasCliente = cita.clienteId
            ? await getPreferenciasRecordatorioCliente(cita.clienteId)
            : null;

          // Si el cliente tiene recordatorios desactivados, saltar
          if (preferenciasCliente?.recordatoriosDesactivados) {
            continue;
          }

          // Para cada configuración de recordatorio activa
          for (const configRecordatorio of config.recordatorios) {
            if (!configRecordatorio.activo) continue;

            // Verificar si el tiempo de anticipación coincide (con margen de ±1 hora)
            const tiempoAnticipacion = configRecordatorio.tiempoAnticipacionHoras;
            const margen = 1; // 1 hora de margen
            const tiempoMinimo = tiempoAnticipacion - margen;
            const tiempoMaximo = tiempoAnticipacion + margen;

            if (
              tiempoRestanteHoras >= tiempoMinimo &&
              tiempoRestanteHoras <= tiempoMaximo &&
              tiempoRestanteHoras > 0 // Solo recordatorios futuros
            ) {
              // Determinar canal a usar (preferencia del cliente o configuración)
              const canalPreferido = preferenciasCliente?.canalPreferido || config.canalPorDefecto;
              const canalesDisponibles = configRecordatorio.canales.length > 0
                ? configRecordatorio.canales
                : [canalPreferido];

              // Crear un recordatorio por cada canal configurado
              for (const canal of canalesDisponibles) {
                const offsetMinutos = tiempoAnticipacion * 60;
                
                // Personalizar mensaje
                const mensaje = personalizarMensaje(config.plantillaMensaje, cita);

                const recordatorio: Recordatorio = {
                  id: `rem-${cita.id}-${configRecordatorio.id}-${canal}-${Date.now()}`,
                  citaId: cita.id,
                  tipo: canal as CanalRecordatorio,
                  offsetMinutos,
                  plantilla: config.plantillaMensaje,
                  canalActivo: true,
                  activo: true,
                  enviado: false, // En simulación, no están enviados
                  leido: false,
                };

                recordatoriosPendientes.push(recordatorio);
              }
            }
          }
        }

        // Ordenar por tiempo de anticipación (mayor a menor)
        recordatoriosPendientes.sort((a, b) => b.offsetMinutos - a.offsetMinutos);

        resolve(recordatoriosPendientes);
      } catch (error) {
        console.error('[recordatorios.ts] Error simulando recordatorios pendientes:', error);
        resolve([]);
      }
    }, 300);
  });
};

