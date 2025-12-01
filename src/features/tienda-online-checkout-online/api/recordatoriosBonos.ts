import { Bono } from '../../catalogo-planes/types';
import { getBonosByClientes } from './bonos';
import { getClients } from '../../gestión-de-clientes/api/clients';
import { Bono as BonoCheckout } from '../types';

/**
 * Tipo de canal de comunicación para recordatorios
 */
export type CanalRecordatorio = 'email' | 'sms' | 'whatsapp' | 'todos';

/**
 * Configuración de recordatorios automáticos
 */
export interface ConfiguracionRecordatorios {
  activo: boolean;
  diasAntesVencimiento: number[]; // Días antes del vencimiento para enviar recordatorios (ej: [7, 3, 1])
  frecuenciaRecordatorio: 'diario' | 'semanal'; // Frecuencia de verificación
  canal: CanalRecordatorio;
  incluirBonosSinUso: boolean; // Si se envían recordatorios a bonos sin usar aunque no estén cerca de vencer
  diasSinUsoParaRecordatorio: number; // Días sin uso para considerar envío de recordatorio (ej: 30)
}

/**
 * Información de recordatorio enviado
 */
export interface RecordatorioEnviado {
  id: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  bonoId: string;
  fechaEnvio: Date;
  canal: CanalRecordatorio;
  motivo: 'vencimiento_proximo' | 'sin_uso' | 'sesiones_restantes';
  mensaje: string;
  estado: 'enviado' | 'entregado' | 'fallido';
  fechaVencimiento?: Date;
  sesionesRestantes?: number;
  diasRestantes?: number;
}

/**
 * Cliente con bonos que requieren recordatorio
 */
export interface ClienteConBonosRecordatorio {
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string;
  bonos: Array<{
    bono: Bono;
    motivo: 'vencimiento_proximo' | 'sin_uso' | 'sesiones_restantes';
    diasRestantes?: number;
    diasSinUso?: number;
  }>;
}

/**
 * Configuración por defecto de recordatorios
 */
export const crearConfiguracionRecordatoriosPorDefecto = (): ConfiguracionRecordatorios => {
  return {
    activo: true,
    diasAntesVencimiento: [7, 3, 1], // Recordatorios 7, 3 y 1 día antes del vencimiento
    frecuenciaRecordatorio: 'diario',
    canal: 'email',
    incluirBonosSinUso: true,
    diasSinUsoParaRecordatorio: 30, // Recordatorio si no se usa en 30 días
  };
};

/**
 * Obtiene clientes con bonos activos que requieren recordatorio
 */
export async function obtenerClientesConBonosParaRecordatorio(
  entrenadorId?: string,
  configuracion?: ConfiguracionRecordatorios
): Promise<ClienteConBonosRecordatorio[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const config = configuracion || crearConfiguracionRecordatoriosPorDefecto();

  if (!config.activo) {
    return [];
  }

  // Obtener todos los bonos agrupados por cliente
  const bonosPorCliente = await getBonosByClientes(entrenadorId);
  
  // Obtener información de clientes
  const clientes = await getClients('entrenador', entrenadorId);
  
  const ahora = new Date();
  const clientesConRecordatorios: ClienteConBonosRecordatorio[] = [];

  for (const clienteBonoInfo of bonosPorCliente) {
    const cliente = clientes.find((c) => c.id === clienteBonoInfo.clienteId);
    if (!cliente) continue;

    const bonosParaRecordatorio: Array<{
      bono: Bono;
      motivo: 'vencimiento_proximo' | 'sin_uso' | 'sesiones_restantes';
      diasRestantes?: number;
      diasSinUso?: number;
    }> = [];

    for (const bono of clienteBonoInfo.bonos) {
      // Solo procesar bonos activos
      if (bono.estado !== 'activo') continue;

      // Verificar si hay sesiones restantes
      if (bono.sesionesRestantes === 0) continue;

      const fechaVencimiento = new Date(bono.fechaVencimiento);
      const diasRestantes = Math.ceil((fechaVencimiento.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24));
      
      // Verificar si está próximo a vencer
      if (diasRestantes > 0 && config.diasAntesVencimiento.includes(diasRestantes)) {
        bonosParaRecordatorio.push({
          bono,
          motivo: 'vencimiento_proximo',
          diasRestantes,
        });
        continue;
      }

      // Verificar si no se ha usado y ha pasado el tiempo configurado
      if (config.incluirBonosSinUso && bono.sesionesUsadas === 0) {
        const diasDesdeCompra = Math.floor((ahora.getTime() - new Date(bono.fechaCompra).getTime()) / (1000 * 60 * 60 * 24));
        if (diasDesdeCompra >= config.diasSinUsoParaRecordatorio) {
          bonosParaRecordatorio.push({
            bono,
            motivo: 'sin_uso',
            diasSinUso: diasDesdeCompra,
          });
          continue;
        }
      }

      // Verificar si tiene sesiones restantes y no se ha usado recientemente
      if (bono.sesionesRestantes > 0 && bono.sesionesUsadas > 0) {
        // Si tiene sesiones pero no se ha usado en los últimos días configurados
        const diasDesdeCompra = Math.floor((ahora.getTime() - new Date(bono.fechaCompra).getTime()) / (1000 * 60 * 60 * 24));
        if (diasDesdeCompra >= config.diasSinUsoParaRecordatorio) {
          bonosParaRecordatorio.push({
            bono,
            motivo: 'sesiones_restantes',
            diasSinUso: diasDesdeCompra,
            diasRestantes,
          });
        }
      }
    }

    if (bonosParaRecordatorio.length > 0) {
      clientesConRecordatorios.push({
        clienteId: clienteBonoInfo.clienteId,
        clienteNombre: clienteBonoInfo.clienteNombre,
        clienteEmail: clienteBonoInfo.clienteEmail,
        clienteTelefono: cliente.phone,
        bonos: bonosParaRecordatorio,
      });
    }
  }

  return clientesConRecordatorios;
}

/**
 * Genera el mensaje de recordatorio para un bono
 */
export function generarMensajeRecordatorio(
  clienteNombre: string,
  bono: Bono,
  motivo: 'vencimiento_proximo' | 'sin_uso' | 'sesiones_restantes',
  diasRestantes?: number,
  diasSinUso?: number
): string {
  let mensaje = `Hola ${clienteNombre},\n\n`;
  
  if (motivo === 'vencimiento_proximo') {
    mensaje += `Te recordamos que tienes un bono de ${bono.sesionesTotal} sesiones con ${bono.sesionesRestantes} sesiones restantes.\n\n`;
    mensaje += `⚠️ Tu bono vence en ${diasRestantes} ${diasRestantes === 1 ? 'día' : 'días'} (${new Date(bono.fechaVencimiento).toLocaleDateString('es-ES')}).\n\n`;
    mensaje += `No dejes que caduquen tus sesiones. Reserva ahora para aprovechar al máximo tu bono.\n\n`;
  } else if (motivo === 'sin_uso') {
    mensaje += `Tienes un bono de ${bono.sesionesTotal} sesiones que aún no has comenzado a usar.\n\n`;
    mensaje += `Hace ${diasSinUso} días que compraste este bono y aún no has reservado ninguna sesión.\n\n`;
    mensaje += `¡Es el momento perfecto para comenzar! Tu bono vence el ${new Date(bono.fechaVencimiento).toLocaleDateString('es-ES')}.\n\n`;
  } else if (motivo === 'sesiones_restantes') {
    mensaje += `Tienes ${bono.sesionesRestantes} sesiones restantes en tu bono.\n\n`;
    if (diasRestantes && diasRestantes > 0) {
      mensaje += `Tu bono vence en ${diasRestantes} ${diasRestantes === 1 ? 'día' : 'días'} (${new Date(bono.fechaVencimiento).toLocaleDateString('es-ES')}).\n\n`;
    }
    mensaje += `No dejes que caduquen. Reserva tus sesiones ahora para mantener tu rutina de entrenamiento.\n\n`;
  }

  mensaje += `Puedes reservar tus sesiones a través de nuestra plataforma o contactándonos directamente.\n\n`;
  mensaje += `¡Esperamos verte pronto!\n\n`;
  mensaje += `Saludos,\n`;
  mensaje += `Tu Equipo de Entrenamiento`;

  return mensaje;
}

/**
 * Envía recordatorio a un cliente sobre sus bonos
 */
export async function enviarRecordatorioBono(
  clienteId: string,
  clienteNombre: string,
  clienteEmail: string,
  clienteTelefono: string | undefined,
  bono: Bono,
  motivo: 'vencimiento_proximo' | 'sin_uso' | 'sesiones_restantes',
  canal: CanalRecordatorio,
  diasRestantes?: number,
  diasSinUso?: number
): Promise<RecordatorioEnviado> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const mensaje = generarMensajeRecordatorio(clienteNombre, bono, motivo, diasRestantes, diasSinUso);

  const recordatorio: RecordatorioEnviado = {
    id: `recordatorio-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    clienteId,
    clienteNombre,
    clienteEmail,
    bonoId: bono.id,
    fechaEnvio: new Date(),
    canal,
    motivo,
    mensaje,
    estado: 'enviado',
    fechaVencimiento: bono.fechaVencimiento,
    sesionesRestantes: bono.sesionesRestantes,
    diasRestantes,
  };

  // Simular envío de notificación
  console.log('[RecordatoriosBonos] Enviando recordatorio de bono:', {
    cliente: clienteNombre,
    clienteEmail,
    clienteTelefono,
    bonoId: bono.id,
    motivo,
    canal,
    sesionesRestantes: bono.sesionesRestantes,
    diasRestantes,
    mensaje: mensaje.substring(0, 100) + '...',
  });

  // En producción, aquí se enviaría el mensaje real por el canal correspondiente
  // Por ejemplo:
  // if (canal === 'email' || canal === 'todos') {
  //   await emailService.send(clienteEmail, 'Recordatorio de Bono Activo', mensaje);
  // }
  // if (canal === 'sms' || canal === 'whatsapp' || canal === 'todos') {
  //   await smsService.send(clienteTelefono, mensaje);
  // }

  // Simular entrega después de un tiempo
  setTimeout(() => {
    recordatorio.estado = 'entregado';
  }, 1000);

  return recordatorio;
}

/**
 * Envía recordatorios automáticos a todos los clientes que lo requieren
 */
export async function enviarRecordatoriosAutomaticos(
  entrenadorId?: string,
  configuracion?: ConfiguracionRecordatorios
): Promise<RecordatorioEnviado[]> {
  const config = configuracion || crearConfiguracionRecordatoriosPorDefecto();

  if (!config.activo) {
    return [];
  }

  const clientesConRecordatorios = await obtenerClientesConBonosParaRecordatorio(entrenadorId, config);
  const recordatoriosEnviados: RecordatorioEnviado[] = [];

  for (const cliente of clientesConRecordatorios) {
    for (const bonoInfo of cliente.bonos) {
      try {
        const recordatorio = await enviarRecordatorioBono(
          cliente.clienteId,
          cliente.clienteNombre,
          cliente.clienteEmail,
          cliente.clienteTelefono,
          bonoInfo.bono,
          bonoInfo.motivo,
          config.canal,
          bonoInfo.diasRestantes,
          bonoInfo.diasSinUso
        );
        recordatoriosEnviados.push(recordatorio);
      } catch (error) {
        console.error(`Error enviando recordatorio a ${cliente.clienteNombre}:`, error);
      }
    }
  }

  return recordatoriosEnviados;
}

/**
 * Programa la verificación periódica de recordatorios
 */
export function iniciarVerificacionRecordatorios(
  entrenadorId?: string,
  configuracion?: ConfiguracionRecordatorios
): NodeJS.Timeout {
  const config = configuracion || crearConfiguracionRecordatoriosPorDefecto();
  
  if (!config.activo) {
    return setInterval(() => {}, 24 * 60 * 60 * 1000); // No hacer nada
  }

  const intervalo = config.frecuenciaRecordatorio === 'diario' 
    ? 24 * 60 * 60 * 1000 // 24 horas
    : 7 * 24 * 60 * 60 * 1000; // 7 días

  return setInterval(async () => {
    try {
      const recordatorios = await enviarRecordatoriosAutomaticos(entrenadorId, config);
      if (recordatorios.length > 0) {
        console.log(`[RecordatoriosBonos] Se enviaron ${recordatorios.length} recordatorios automáticos`);
      }
    } catch (error) {
      console.error('[RecordatoriosBonos] Error en verificación periódica:', error);
    }
  }, intervalo);
}

/**
 * Obtiene el historial de recordatorios enviados
 */
export async function obtenerHistorialRecordatorios(
  entrenadorId?: string,
  clienteId?: string,
  bonoId?: string
): Promise<RecordatorioEnviado[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  
  // En producción, esto obtendría el historial de la base de datos
  // Por ahora retornamos un array vacío
  console.log('[RecordatoriosBonos] Obteniendo historial de recordatorios:', {
    entrenadorId,
    clienteId,
    bonoId,
  });
  
  return [];
}

// ============================================================================
// API MOCK DE RECORDATORIOS DE BONOS (CHECKOUT)
// ============================================================================

/**
 * Obtiene bonos próximos a caducar dentro de un número de días
 */
export async function getBonosProximosACaducar(dias: number): Promise<BonoCheckout[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Obtener todos los bonos del mock
  const { getAllBonosCheckout } = await import('./bonos');
  const todosLosBonos = await getAllBonosCheckout();
  
  const ahora = new Date();

  return todosLosBonos
    .filter((bono) => {
      if (!bono.fechaCaducidadOpcional) return false;
      if (bono.saldoRestante <= 0) return false; // Solo bonos con saldo
      
      const fechaCaducidad = new Date(bono.fechaCaducidadOpcional);
      const diasRestantes = Math.ceil((fechaCaducidad.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24));
      
      return diasRestantes > 0 && diasRestantes <= dias;
    })
    .map(({ clienteIdOpcional, empresaOpcional, fechaCreacion, ...bono }) => bono);
}

/**
 * Obtiene bonos sin usar desde hace un número de días
 */
export async function getBonosSinUsar(desdeDias: number): Promise<BonoCheckout[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Obtener todos los bonos del mock
  const { getAllBonosCheckout } = await import('./bonos');
  const todosLosBonos = await getAllBonosCheckout();
  
  const ahora = new Date();

  return todosLosBonos
    .filter((bono) => {
      // Solo bonos que no se han usado (saldo completo)
      if (bono.saldoRestante !== bono.saldoInicial) return false;
      
      // Verificar que tenga fecha de creación
      if (!bono.fechaCreacion) return false;
      
      // Calcular días desde la creación
      const diasDesdeCreacion = Math.floor((ahora.getTime() - bono.fechaCreacion.getTime()) / (1000 * 60 * 60 * 24));
      return diasDesdeCreacion >= desdeDias;
    })
    .map(({ clienteIdOpcional, empresaOpcional, fechaCreacion, ...bono }) => bono);
}

