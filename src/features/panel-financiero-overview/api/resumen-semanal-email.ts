// API para resumen semanal automático por email
// Envía cada lunes un email con métricas clave y alertas importantes

import { ResumenSemanalEmail, ContenidoResumenSemanal } from '../types';
import { overviewApi } from './overview';
import { alertasApi } from './alertas';
import { retencionClientesApi } from './retencion-clientes';
import { getCitas } from '../../agenda-calendario/api/calendario';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Almacenamiento en memoria (en producción sería una base de datos)
const configuracionesEmail: Map<string, ResumenSemanalEmail> = new Map();
const historialEnvios: Map<string, Array<{ fecha: string; contenido: ContenidoResumenSemanal }>> = new Map();

export const resumenSemanalEmailApi = {
  /**
   * Obtiene la configuración del resumen semanal para un entrenador
   */
  async obtenerConfiguracion(entrenadorId: string): Promise<ResumenSemanalEmail | null> {
    await delay(300);
    return configuracionesEmail.get(entrenadorId) || null;
  },

  /**
   * Guarda o actualiza la configuración del resumen semanal
   */
  async guardarConfiguracion(config: ResumenSemanalEmail): Promise<ResumenSemanalEmail> {
    await delay(500);
    
    const configActualizada: ResumenSemanalEmail = {
      ...config,
      fechaActualizacion: new Date().toISOString(),
      fechaCreacion: config.fechaCreacion || new Date().toISOString()
    };

    configuracionesEmail.set(config.entrenadorId, configActualizada);
    return configActualizada;
  },

  /**
   * Genera el contenido del resumen semanal
   */
  async generarContenidoResumen(
    entrenadorId: string,
    role: 'entrenador' | 'gimnasio'
  ): Promise<ContenidoResumenSemanal> {
    await delay(500);

    try {
      const hoy = new Date();
      const inicioSemana = new Date(hoy);
      inicioSemana.setDate(hoy.getDate() - hoy.getDay() + 1); // Lunes de esta semana
      inicioSemana.setHours(0, 0, 0, 0);
      
      const finSemana = new Date(inicioSemana);
      finSemana.setDate(inicioSemana.getDate() + 6);
      finSemana.setHours(23, 59, 59, 999);

      const proximaSemanaInicio = new Date(finSemana);
      proximaSemanaInicio.setDate(finSemana.getDate() + 1);
      const proximaSemanaFin = new Date(proximaSemanaInicio);
      proximaSemanaFin.setDate(proximaSemanaInicio.getDate() + 6);
      proximaSemanaFin.setHours(23, 59, 59, 999);

      // Obtener ingresos
      const overview = await overviewApi.obtenerOverview(role, entrenadorId);
      const overviewAnterior = {
        total: overview.total * 0.9, // Simulación de mes anterior
        variacion: overview.variacion || 0
      };

      // Obtener pagos pendientes
      const pagosPendientes = await alertasApi.obtenerClientesPendientes();
      const pagosPendientesFiltrados = pagosPendientes
        .filter(p => p.estado === 'pendiente' || p.estado === 'en_gestion')
        .slice(0, 5); // Top 5

      // Obtener próximas sesiones
      const citas = await getCitas(inicioSemana, proximaSemanaFin, role);
      const citasConfirmadas = citas.filter(c => 
        c.estado === 'confirmada' && 
        c.fechaInicio >= inicioSemana
      );

      const sesionesEstaSemana = citasConfirmadas.filter(c => 
        c.fechaInicio <= finSemana
      );
      const sesionesProximaSemana = citasConfirmadas.filter(c => 
        c.fechaInicio >= proximaSemanaInicio && c.fechaInicio <= proximaSemanaFin
      );

      // Obtener métricas de retención (opcional)
      const metricasRetencion = await retencionClientesApi.obtenerMetricasRetencion(role, entrenadorId);

      const periodoTexto = `Semana del ${inicioSemana.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long' 
      })} al ${finSemana.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
      })}`;

      return {
        periodo: periodoTexto,
        ingresos: {
          total: overview.total,
          periodoAnterior: overviewAnterior.total,
          variacion: overview.variacion || 0,
          tendencia: overview.tendencia
        },
        pagosPendientes: {
          total: pagosPendientesFiltrados.reduce((sum, p) => sum + p.monto, 0),
          cantidad: pagosPendientes.length,
          clientes: pagosPendientesFiltrados.map(p => ({
            nombre: p.nombre,
            monto: p.monto,
            diasVencidos: p.diasVencidos
          }))
        },
        proximasSesiones: {
          total: citasConfirmadas.length,
          estaSemana: sesionesEstaSemana.length,
          proximaSemana: sesionesProximaSemana.length,
          sesiones: citasConfirmadas.slice(0, 10).map(c => ({
            fecha: c.fechaInicio.toLocaleDateString('es-ES', { 
              day: 'numeric', 
              month: 'long',
              weekday: 'long'
            }),
            hora: c.fechaInicio.toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            cliente: c.clienteNombre || 'Cliente',
            tipo: c.tipo || 'Sesión'
          }))
        },
        metricasRetencion: {
          antiguedadPromedio: metricasRetencion.antiguedadPromedio.texto,
          tasaRetencion: metricasRetencion.tasaRetencion.porcentaje,
          altas: metricasRetencion.altasBajasPeriodo.altas,
          bajas: metricasRetencion.altasBajasPeriodo.bajas
        }
      };
    } catch (error) {
      console.error('Error generando contenido del resumen:', error);
      throw error;
    }
  },

  /**
   * Envía el resumen semanal por email
   * En producción, esto se ejecutaría mediante un cron job cada lunes
   */
  async enviarResumenSemanal(entrenadorId: string, role: 'entrenador' | 'gimnasio'): Promise<{
    success: boolean;
    error?: string;
  }> {
    await delay(1000);

    try {
      const config = await this.obtenerConfiguracion(entrenadorId);
      
      if (!config || !config.activo) {
        return {
          success: false,
          error: 'El resumen semanal no está configurado o está desactivado'
        };
      }

      const contenido = await this.generarContenidoResumen(entrenadorId, role);

      // Generar el email HTML
      const emailHtml = this.generarEmailHTML(contenido, config);

      // En producción, aquí se enviaría el email usando un servicio como SendGrid, AWS SES, etc.
      console.log('[Resumen Semanal Email] Enviando email a:', config.emailDestinatario);
      console.log('[Resumen Semanal Email] Contenido:', contenido);

      // Guardar en historial
      const historial = historialEnvios.get(entrenadorId) || [];
      historial.push({
        fecha: new Date().toISOString(),
        contenido
      });
      historialEnvios.set(entrenadorId, historial);

      // Actualizar última fecha de envío
      const configActualizada = {
        ...config,
        ultimoEnvio: new Date().toISOString()
      };
      configuracionesEmail.set(entrenadorId, configActualizada);

      return { success: true };
    } catch (error) {
      console.error('Error enviando resumen semanal:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  },

  /**
   * Genera el HTML del email
   */
  generarEmailHTML(contenido: ContenidoResumenSemanal, config: ResumenSemanalEmail): string {
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .metric { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .metric:last-child { border-bottom: none; }
          .metric-label { font-weight: 600; color: #6b7280; }
          .metric-value { font-weight: 700; color: #111827; }
          .positive { color: #10b981; }
          .negative { color: #ef4444; }
          .list-item { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .list-item:last-child { border-bottom: none; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Resumen Semanal</h1>
            <p>${contenido.periodo}</p>
          </div>
          <div class="content">
    `;

    // Ingresos
    if (config.incluirIngresos) {
      html += `
        <div class="section">
          <h2>💰 Ingresos</h2>
          <div class="metric">
            <span class="metric-label">Total del mes:</span>
            <span class="metric-value">€${contenido.ingresos.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Variación:</span>
            <span class="metric-value ${contenido.ingresos.variacion >= 0 ? 'positive' : 'negative'}">
              ${contenido.ingresos.variacion >= 0 ? '+' : ''}${contenido.ingresos.variacion.toFixed(1)}%
            </span>
          </div>
        </div>
      `;
    }

    // Pagos pendientes
    if (config.incluirPagosPendientes) {
      html += `
        <div class="section">
          <h2>⚠️ Pagos Pendientes</h2>
          <div class="metric">
            <span class="metric-label">Total pendiente:</span>
            <span class="metric-value">€${contenido.pagosPendientes.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Cantidad de pagos:</span>
            <span class="metric-value">${contenido.pagosPendientes.cantidad}</span>
          </div>
          ${contenido.pagosPendientes.clientes.length > 0 ? `
            <h3 style="margin-top: 15px; font-size: 14px; color: #6b7280;">Principales pendientes:</h3>
            ${contenido.pagosPendientes.clientes.map(cliente => `
              <div class="list-item">
                <strong>${cliente.nombre}</strong> - €${cliente.monto.toLocaleString('es-ES', { minimumFractionDigits: 2 })} 
                (${cliente.diasVencidos} días vencidos)
              </div>
            `).join('')}
          ` : ''}
        </div>
      `;
    }

    // Próximas sesiones
    if (config.incluirProximasSesiones) {
      html += `
        <div class="section">
          <h2>📅 Próximas Sesiones</h2>
          <div class="metric">
            <span class="metric-label">Total:</span>
            <span class="metric-value">${contenido.proximasSesiones.total}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Esta semana:</span>
            <span class="metric-value">${contenido.proximasSesiones.estaSemana}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Próxima semana:</span>
            <span class="metric-value">${contenido.proximasSesiones.proximaSemana}</span>
          </div>
          ${contenido.proximasSesiones.sesiones.length > 0 ? `
            <h3 style="margin-top: 15px; font-size: 14px; color: #6b7280;">Próximas sesiones:</h3>
            ${contenido.proximasSesiones.sesiones.slice(0, 5).map(sesion => `
              <div class="list-item">
                <strong>${sesion.fecha}</strong> a las ${sesion.hora}<br>
                ${sesion.cliente} - ${sesion.tipo}
              </div>
            `).join('')}
          ` : ''}
        </div>
      `;
    }

    // Métricas de retención
    if (config.incluirMetricasRetencion && contenido.metricasRetencion) {
      html += `
        <div class="section">
          <h2>👥 Métricas de Retención</h2>
          <div class="metric">
            <span class="metric-label">Antigüedad promedio:</span>
            <span class="metric-value">${contenido.metricasRetencion.antiguedadPromedio}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Tasa de retención:</span>
            <span class="metric-value">${contenido.metricasRetencion.tasaRetencion.toFixed(1)}%</span>
          </div>
          <div class="metric">
            <span class="metric-label">Altas este mes:</span>
            <span class="metric-value positive">+${contenido.metricasRetencion.altas}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Bajas este mes:</span>
            <span class="metric-value negative">-${contenido.metricasRetencion.bajas}</span>
          </div>
        </div>
      `;
    }

    html += `
          </div>
          <div class="footer">
            <p>Este es un resumen automático generado por tu sistema de gestión.</p>
            <p>Puedes configurar o desactivar estos emails desde tu panel financiero.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return html;
  },

  /**
   * Obtiene el historial de envíos
   */
  async obtenerHistorialEnvios(entrenadorId: string): Promise<Array<{
    fecha: string;
    contenido: ContenidoResumenSemanal;
  }>> {
    await delay(300);
    return historialEnvios.get(entrenadorId) || [];
  }
};

