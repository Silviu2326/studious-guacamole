import { Cita } from '../types';
import { saveAs } from 'file-saver';

export interface OpcionesExportacion {
  fechaInicio: Date;
  fechaFin: Date;
  ocultarInformacionSensible: boolean;
  incluirHorarios: boolean;
  incluirClientes: boolean;
  incluirTiposSesion: boolean;
  incluirNotas: boolean;
  formato: 'pdf' | 'imprimir';
  emailDestino?: string;
}

export interface DatosAgendaExportacion {
  citas: Cita[];
  opciones: OpcionesExportacion;
  nombreEntrenador?: string;
  fechaGeneracion: Date;
}

/**
 * Filtra las citas según el rango de fechas
 */
export function filtrarCitasPorRango(citas: Cita[], fechaInicio: Date, fechaFin: Date): Cita[] {
  return citas.filter(cita => {
    const fechaCita = new Date(cita.fechaInicio);
    return fechaCita >= fechaInicio && fechaCita <= fechaFin;
  }).sort((a, b) => 
    new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
  );
}

/**
 * Genera el contenido HTML para el PDF/impresión
 */
export function generarHTMLAgenda(datos: DatosAgendaExportacion): string {
  const { citas, opciones, nombreEntrenador, fechaGeneracion } = datos;
  const citasFiltradas = filtrarCitasPorRango(citas, opciones.fechaInicio, opciones.fechaFin);

  // Agrupar citas por día
  const citasPorDia = new Map<string, Cita[]>();
  citasFiltradas.forEach(cita => {
    const fecha = new Date(cita.fechaInicio);
    const claveDia = fecha.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    if (!citasPorDia.has(claveDia)) {
      citasPorDia.set(claveDia, []);
    }
    citasPorDia.get(claveDia)!.push(cita);
  });

  const formatoFecha = (fecha: Date): string => {
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatoHora = (fecha: Date): string => {
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const obtenerNombreTipo = (tipo: string): string => {
    const tipos: Record<string, string> = {
      'sesion-1-1': 'Sesión 1-1',
      'videollamada': 'Videollamada',
      'evaluacion': 'Evaluación',
      'clase-colectiva': 'Clase Colectiva',
      'fisioterapia': 'Fisioterapia',
      'mantenimiento': 'Mantenimiento',
      'otro': 'Otro'
    };
    return tipos[tipo] || tipo;
  };

  let html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Agenda Semanal - ${formatoFecha(opciones.fechaInicio)} a ${formatoFecha(opciones.fechaFin)}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          color: #1a1a1a;
          line-height: 1.6;
          padding: 40px;
          background: #fff;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #3b82f6;
        }
        .header h1 {
          font-size: 28px;
          color: #1e40af;
          margin-bottom: 10px;
        }
        .header .subtitle {
          font-size: 16px;
          color: #6b7280;
          margin-bottom: 5px;
        }
        .header .range {
          font-size: 18px;
          color: #374151;
          font-weight: 600;
          margin-top: 10px;
        }
        .dia-section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .dia-header {
          background: #3b82f6;
          color: white;
          padding: 12px 20px;
          font-size: 18px;
          font-weight: 600;
          border-radius: 6px 6px 0 0;
        }
        .sesiones-container {
          border: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 6px 6px;
          overflow: hidden;
        }
        .sesion-item {
          padding: 15px 20px;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }
        .sesion-item:last-child {
          border-bottom: none;
        }
        .sesion-hora {
          font-weight: 600;
          color: #1e40af;
          min-width: 100px;
          font-size: 16px;
        }
        .sesion-info {
          flex: 1;
          min-width: 200px;
        }
        .sesion-titulo {
          font-weight: 600;
          font-size: 16px;
          color: #1f2937;
          margin-bottom: 5px;
        }
        .sesion-details {
          font-size: 14px;
          color: #6b7280;
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }
        .sesion-detail-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .badge-tipo {
          background: #dbeafe;
          color: #1e40af;
        }
        .badge-estado {
          background: #f3f4f6;
          color: #374151;
        }
        .notas {
          margin-top: 10px;
          padding: 10px;
          background: #f9fafb;
          border-left: 3px solid #3b82f6;
          font-size: 14px;
          color: #4b5563;
          font-style: italic;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          font-size: 12px;
          color: #9ca3af;
        }
        .empty-state {
          text-align: center;
          padding: 40px;
          color: #9ca3af;
          font-size: 16px;
        }
        @media print {
          body {
            padding: 20px;
          }
          .dia-section {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Agenda Semanal</h1>
        ${nombreEntrenador ? `<div class="subtitle">${nombreEntrenador}</div>` : ''}
        <div class="range">
          ${formatoFecha(opciones.fechaInicio)} - ${formatoFecha(opciones.fechaFin)}
        </div>
      </div>
  `;

  if (citasPorDia.size === 0) {
    html += `
      <div class="empty-state">
        No hay sesiones programadas para este período.
      </div>
    `;
  } else {
    citasPorDia.forEach((citasDelDia, fecha) => {
      html += `
        <div class="dia-section">
          <div class="dia-header">${fecha}</div>
          <div class="sesiones-container">
      `;

      citasDelDia.forEach(cita => {
        html += `
          <div class="sesion-item">
            <div class="sesion-hora">
              ${formatoHora(new Date(cita.fechaInicio))} - ${formatoHora(new Date(cita.fechaFin))}
            </div>
            <div class="sesion-info">
              <div class="sesion-titulo">${cita.titulo}</div>
              <div class="sesion-details">
        `;

        if (opciones.incluirTiposSesion) {
          html += `
            <div class="sesion-detail-item">
              <span class="badge badge-tipo">${obtenerNombreTipo(cita.tipo)}</span>
            </div>
          `;
        }

        if (opciones.incluirClientes && cita.clienteNombre && !opciones.ocultarInformacionSensible) {
          html += `
            <div class="sesion-detail-item">
              <strong>Cliente:</strong> ${cita.clienteNombre}
            </div>
          `;
        } else if (opciones.incluirClientes && opciones.ocultarInformacionSensible) {
          html += `
            <div class="sesion-detail-item">
              <strong>Cliente:</strong> [Oculto]
            </div>
          `;
        }

        if (cita.ubicacion && !opciones.ocultarInformacionSensible) {
          html += `
            <div class="sesion-detail-item">
              <strong>Ubicación:</strong> ${cita.ubicacion}
            </div>
          `;
        }

        html += `
                <div class="sesion-detail-item">
                  <span class="badge badge-estado">${cita.estado}</span>
                </div>
              </div>
        `;

        if (opciones.incluirNotas && cita.notas && !opciones.ocultarInformacionSensible) {
          html += `
            <div class="notas">
              <strong>Notas:</strong> ${cita.notas}
            </div>
          `;
        } else if (opciones.incluirNotas && opciones.ocultarInformacionSensible) {
          html += `
            <div class="notas">
              <strong>Notas:</strong> [Información oculta]
            </div>
          `;
        }

        html += `
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });
  }

  html += `
      <div class="footer">
        Generado el ${formatoFecha(fechaGeneracion)} a las ${formatoHora(fechaGeneracion)}
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Genera y descarga un PDF de la agenda
 */
export async function exportarAgendaPDF(datos: DatosAgendaExportacion): Promise<void> {
  const html = generarHTMLAgenda(datos);
  
  // Crear un blob del HTML
  const blob = new Blob([html], { type: 'text/html' });
  
  // Para PDF real, aquí usaríamos jsPDF o html2pdf
  // Por ahora, abrimos una ventana de impresión que permite guardar como PDF
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('No se pudo abrir la ventana de impresión');
  }
  
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Esperar a que se cargue el contenido y luego imprimir
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
}

/**
 * Imprime la agenda directamente
 */
export function imprimirAgenda(datos: DatosAgendaExportacion): void {
  const html = generarHTMLAgenda(datos);
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('No se pudo abrir la ventana de impresión');
  }
  
  printWindow.document.write(html);
  printWindow.document.close();
  
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
}

/**
 * Envía la agenda por email (mock - en producción llamaría a un API real)
 */
export async function enviarAgendaPorEmail(
  datos: DatosAgendaExportacion,
  emailDestino: string
): Promise<void> {
  // En producción, esto haría una llamada a una API para enviar el email
  // Por ahora, simulamos el envío
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Enviando agenda a ${emailDestino}`);
      console.log('Datos:', datos);
      resolve();
    }, 1000);
  });
}


