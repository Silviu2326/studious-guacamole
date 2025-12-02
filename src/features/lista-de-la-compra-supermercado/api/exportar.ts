import { ListaCompra } from './lista-compra';

export type FormatoExportacion = 'pdf' | 'email' | 'app' | 'impresion';

export interface OpcionesExportacion {
  formato: FormatoExportacion;
  incluirPrecios?: boolean;
  incluirSecciones?: boolean;
  incluirNotas?: boolean;
  emailDestino?: string;
}

export async function exportarLista(
  listaId: string,
  opciones: OpcionesExportacion
): Promise<Blob | string | null> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (opciones.formato === 'email') {
    return `Lista exportada exitosamente a ${opciones.emailDestino || 'correo'}`;
  }
  
  if (opciones.formato === 'pdf') {
    return new Blob(['Lista de compra generada'], { type: 'application/pdf' });
  }
  
  return 'Lista exportada exitosamente';
}

export function generarPDF(lista: ListaCompra): void {
  // Implementación simulada de generación de PDF
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const contenido = generarContenidoHTML(lista);
  printWindow.document.write(contenido);
  printWindow.document.close();
  printWindow.print();
}

function generarContenidoHTML(lista: ListaCompra): string {
  const seccionesHTML = lista.secciones
    .map(
      (seccion) => `
    <div style="margin-bottom: 20px;">
      <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">
        ${seccion.nombre}
      </h3>
      <ul>
        ${seccion.ingredientes
          .map(
            (ing) => `
          <li style="margin-bottom: 5px;">
            ${ing.cantidad} ${ing.unidad} - ${ing.nombre}
            ${ing.notas ? ` (${ing.notas})` : ''}
          </li>
        `
          )
          .join('')}
      </ul>
    </div>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Lista de Compra - ${lista.clienteNombre}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; }
          h3 { color: #666; }
        </style>
      </head>
      <body>
        <h1>Lista de Compra - ${lista.clienteNombre}</h1>
        <p><strong>Número de personas:</strong> ${lista.numeroPersonas}</p>
        ${seccionesHTML}
      </body>
    </html>
  `;
}

export function copiarAlPortapapeles(texto: string): Promise<boolean> {
  return navigator.clipboard
    .writeText(texto)
    .then(() => true)
    .catch(() => false);
}

