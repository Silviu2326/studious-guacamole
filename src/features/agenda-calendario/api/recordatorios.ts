import {
  ConfiguracionRecordatorios,
  RecordatorioConfiguracion,
  PreferenciasRecordatorioCliente,
  HistorialRecordatorio,
  Cita,
} from '../types';

// Obtener configuración de recordatorios
export const getConfiguracionRecordatorios = async (userId?: string): Promise<ConfiguracionRecordatorios> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // En producción, esto haría una llamada real al backend
      const config: ConfiguracionRecordatorios = {
        id: '1',
        userId,
        activo: true,
        recordatorios: [
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
        plantillaMensaje: 'Hola {nombre}, te recordamos que tienes una sesión el {fecha} a las {hora} en {lugar}. ¡Te esperamos!',
        canalPorDefecto: 'whatsapp',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
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

// Personalizar mensaje con variables
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

  let mensaje = plantilla
    .replace(/{nombre}/g, cita.clienteNombre || 'Cliente')
    .replace(/{fecha}/g, fechaFormateada)
    .replace(/{hora}/g, horaFormateada)
    .replace(/{lugar}/g, cita.ubicacion || 'el lugar acordado')
    .replace(/{titulo}/g, cita.titulo);

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

