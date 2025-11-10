// API service para Configuración de Recordatorios Automáticos de Pagos
// Implementa recordatorios automáticos configurables (1, 3, 7 días antes) que se envían por WhatsApp o Email

import { ConfiguracionRecordatoriosPagos, RecordatorioEnviado } from '../types';

const API_BASE_URL = '/api/finanzas/recordatorios';

// Mock delay para simular llamadas API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock storage (en producción sería una base de datos)
let configuracionRecordatorios: ConfiguracionRecordatoriosPagos | null = null;
let recordatoriosEnviados: RecordatorioEnviado[] = [];

export const recordatoriosAutomaticosApi = {
  // Obtener configuración actual de recordatorios
  async obtenerConfiguracion(): Promise<ConfiguracionRecordatoriosPagos> {
    await delay(300);
    
    // Si no hay configuración, retornar valores por defecto
    if (!configuracionRecordatorios) {
      return {
        activo: false,
        diasAnticipacion: [1, 3, 7],
        canalesEnvio: ['whatsapp', 'email'],
        plantillaWhatsApp: `Hola {{nombre}}, 

Te recordamos que tienes un pago pendiente de €{{monto}} por el servicio "{{servicio}}".

Fecha de vencimiento: {{fechaVencimiento}}
Días restantes: {{diasRestantes}}

Por favor, realiza el pago a la mayor brevedad posible. Si ya lo has realizado, ignora este mensaje.

Gracias por tu atención.`,
        plantillaEmail: {
          asunto: 'Recordatorio de pago pendiente - {{servicio}}',
          cuerpo: `Hola {{nombre}},

Te recordamos que tienes un pago pendiente de €{{monto}} por el servicio "{{servicio}}".

Fecha de vencimiento: {{fechaVencimiento}}
Días restantes: {{diasRestantes}}

Por favor, realiza el pago a la mayor brevedad posible. Si ya lo has realizado, ignora este mensaje.

Gracias por tu atención.`,
        },
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
      };
    }
    
    return configuracionRecordatorios;
  },

  // Guardar configuración de recordatorios
  async guardarConfiguracion(
    configuracion: ConfiguracionRecordatoriosPagos
  ): Promise<ConfiguracionRecordatoriosPagos> {
    await delay(400);
    
    const configActualizada: ConfiguracionRecordatoriosPagos = {
      ...configuracion,
      id: configuracion.id || `config-${Date.now()}`,
      fechaActualizacion: new Date().toISOString(),
      fechaCreacion: configuracion.fechaCreacion || new Date().toISOString(),
    };
    
    configuracionRecordatorios = configActualizada;
    
    // En producción: POST/PUT ${API_BASE_URL}/configuracion
    // return await fetch(...).then(res => res.json());
    
    return configActualizada;
  },

  // Obtener historial de recordatorios enviados
  async obtenerHistorialRecordatorios(
    fechaInicio?: string,
    fechaFin?: string
  ): Promise<RecordatorioEnviado[]> {
    await delay(300);
    
    let historial = [...recordatoriosEnviados];
    
    if (fechaInicio) {
      historial = historial.filter(r => r.fechaEnvio >= fechaInicio);
    }
    
    if (fechaFin) {
      historial = historial.filter(r => r.fechaEnvio <= fechaFin);
    }
    
    // Ordenar por fecha de envío (más recientes primero)
    historial.sort((a, b) => new Date(b.fechaEnvio).getTime() - new Date(a.fechaEnvio).getTime());
    
    return historial;
  },

  // Simular envío de recordatorio (en producción, esto se haría automáticamente con un cron job)
  async enviarRecordatorio(
    clienteId: string,
    clienteNombre: string,
    clienteEmail: string | undefined,
    clienteTelefono: string | undefined,
    pagoId: string,
    monto: number,
    fechaVencimiento: string,
    diasAnticipacion: number,
    canal: 'whatsapp' | 'email',
    configuracion: ConfiguracionRecordatoriosPagos
  ): Promise<RecordatorioEnviado> {
    await delay(500);
    
    // Calcular días restantes
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diasRestantes = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    
    // Generar mensaje usando plantilla
    let mensaje = '';
    if (canal === 'whatsapp' && configuracion.plantillaWhatsApp) {
      mensaje = configuracion.plantillaWhatsApp
        .replace(/{{nombre}}/g, clienteNombre)
        .replace(/{{monto}}/g, monto.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
        .replace(/{{servicio}}/g, 'Servicio')
        .replace(/{{fechaVencimiento}}/g, new Date(fechaVencimiento).toLocaleDateString('es-ES'))
        .replace(/{{diasRestantes}}/g, diasRestantes.toString());
    } else if (canal === 'email' && configuracion.plantillaEmail) {
      mensaje = configuracion.plantillaEmail.cuerpo
        .replace(/{{nombre}}/g, clienteNombre)
        .replace(/{{monto}}/g, monto.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
        .replace(/{{servicio}}/g, 'Servicio')
        .replace(/{{fechaVencimiento}}/g, new Date(fechaVencimiento).toLocaleDateString('es-ES'))
        .replace(/{{diasRestantes}}/g, diasRestantes.toString());
    }
    
    // En producción, aquí se enviaría realmente el mensaje por WhatsApp o Email
    // Por ahora, solo simulamos el envío
    
    const recordatorio: RecordatorioEnviado = {
      id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      clienteId,
      clienteNombre,
      clienteEmail,
      clienteTelefono,
      pagoId,
      monto,
      fechaVencimiento,
      diasAnticipacion,
      canal,
      estado: 'enviado', // En producción, esto dependería del resultado real del envío
      fechaEnvio: new Date().toISOString(),
      mensaje,
    };
    
    recordatoriosEnviados.push(recordatorio);
    
    return recordatorio;
  },

  // Procesar recordatorios automáticos (esto normalmente se ejecutaría en un cron job)
  async procesarRecordatoriosAutomaticos(
    pagosPendientes: Array<{
      id: string;
      clienteId: string;
      clienteNombre: string;
      clienteEmail?: string;
      clienteTelefono?: string;
      monto: number;
      fechaVencimiento: string;
    }>
  ): Promise<RecordatorioEnviado[]> {
    await delay(1000);
    
    const configuracion = await this.obtenerConfiguracion();
    
    if (!configuracion.activo) {
      return [];
    }
    
    const hoy = new Date();
    const recordatoriosEnviados: RecordatorioEnviado[] = [];
    
    for (const pago of pagosPendientes) {
      const vencimiento = new Date(pago.fechaVencimiento);
      const diasRestantes = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
      
      // Verificar si hay que enviar recordatorio para este pago
      for (const diasAnticipacion of configuracion.diasAnticipacion) {
        if (diasRestantes === diasAnticipacion) {
          // Enviar recordatorio por cada canal configurado
          for (const canal of configuracion.canalesEnvio) {
            // Verificar que el cliente tenga el canal disponible
            if (canal === 'whatsapp' && !pago.clienteTelefono) continue;
            if (canal === 'email' && !pago.clienteEmail) continue;
            
            const recordatorio = await this.enviarRecordatorio(
              pago.clienteId,
              pago.clienteNombre,
              pago.clienteEmail,
              pago.clienteTelefono,
              pago.id,
              pago.monto,
              pago.fechaVencimiento,
              diasAnticipacion,
              canal,
              configuracion
            );
            
            recordatoriosEnviados.push(recordatorio);
          }
        }
      }
    }
    
    return recordatoriosEnviados;
  },
};

