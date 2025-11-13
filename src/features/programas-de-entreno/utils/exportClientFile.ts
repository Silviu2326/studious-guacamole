import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

interface ClientProfile {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  genero?: string;
  altura?: number;
  peso?: number;
  objetivoPrincipal?: string;
  estado: 'activo' | 'inactivo' | 'pausado';
  fechaInicio?: string;
  entrenador?: string;
}

interface ClientObjective {
  id: string;
  titulo: string;
  descripcion?: string;
  progreso: number;
  estado: 'not_started' | 'in_progress' | 'achieved' | 'at_risk' | 'failed';
  fechaInicio: string;
  fechaLimite?: string;
}

interface ClientHistoryItem {
  id: string;
  fecha: string;
  tipo: 'entrenamiento' | 'checkin' | 'medicion' | 'nota' | 'objetivo';
  titulo: string;
  descripcion?: string;
}

interface ClientAlert {
  id: string;
  tipo: 'warning' | 'error' | 'info';
  titulo: string;
  descripcion: string;
  fecha: string;
  leida: boolean;
}

interface Mention {
  userId: string;
  userName: string;
  userEmail?: string;
  position: number;
  length: number;
}

interface ClientNote {
  id: string;
  fecha: string;
  autor: string;
  autorId?: string;
  contenido: string;
  tipo?: 'general' | 'entrenamiento' | 'nutricion' | 'medico';
  menciones?: Mention[];
  editadoPor?: string;
  fechaEdicion?: string;
}

interface ClientFileData {
  profile: ClientProfile | null;
  objectives: ClientObjective[];
  history: ClientHistoryItem[];
  alerts: ClientAlert[];
  notes: ClientNote[];
}

/**
 * Exporta la ficha del cliente a PDF
 */
export function exportToPDF(data: ClientFileData, clientName: string): void {
  const doc = new jsPDF();
  let yPosition = 20;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const maxWidth = doc.internal.pageSize.width - 2 * margin;

  // Función para agregar nueva página si es necesario
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Título
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`Ficha del Cliente: ${clientName}`, margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, margin, yPosition);
  yPosition += 15;

  // PERFIL
  if (data.profile) {
    checkNewPage(30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PERFIL', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const profileData = [
      ['Nombre:', data.profile.nombre || 'N/A'],
      ['Email:', data.profile.email || 'N/A'],
      ['Teléfono:', data.profile.telefono || 'N/A'],
      ['Fecha de Nacimiento:', data.profile.fechaNacimiento || 'N/A'],
      ['Género:', data.profile.genero || 'N/A'],
      ['Altura:', data.profile.altura ? `${data.profile.altura} cm` : 'N/A'],
      ['Peso:', data.profile.peso ? `${data.profile.peso} kg` : 'N/A'],
      ['Objetivo Principal:', data.profile.objetivoPrincipal || 'N/A'],
      ['Estado:', data.profile.estado || 'N/A'],
      ['Entrenador:', data.profile.entrenador || 'N/A'],
      ['Fecha de Inicio:', data.profile.fechaInicio || 'N/A'],
    ];

    profileData.forEach(([label, value]) => {
      checkNewPage(7);
      doc.setFont('helvetica', 'bold');
      doc.text(label, margin, yPosition);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(value, maxWidth - 60);
      doc.text(lines, margin + 50, yPosition);
      yPosition += lines.length * 5 + 2;
    });
    yPosition += 10;
  }

  // OBJETIVOS
  if (data.objectives.length > 0) {
    checkNewPage(20);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('OBJETIVOS', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    data.objectives.forEach((obj) => {
      checkNewPage(25);
      doc.setFont('helvetica', 'bold');
      doc.text(obj.titulo, margin, yPosition);
      yPosition += 6;

      if (obj.descripcion) {
        doc.setFont('helvetica', 'normal');
        const descLines = doc.splitTextToSize(obj.descripcion, maxWidth);
        doc.text(descLines, margin, yPosition);
        yPosition += descLines.length * 5;
      }

      doc.text(`Progreso: ${obj.progreso}%`, margin, yPosition);
      yPosition += 5;
      doc.text(`Estado: ${obj.estado}`, margin, yPosition);
      yPosition += 5;
      doc.text(`Fecha Inicio: ${new Date(obj.fechaInicio).toLocaleDateString('es-ES')}`, margin, yPosition);
      yPosition += 5;
      if (obj.fechaLimite) {
        doc.text(`Fecha Límite: ${new Date(obj.fechaLimite).toLocaleDateString('es-ES')}`, margin, yPosition);
        yPosition += 5;
      }
      yPosition += 5;
    });
    yPosition += 5;
  }

  // HISTORIAL
  if (data.history.length > 0) {
    checkNewPage(20);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('HISTORIAL', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    data.history.forEach((item) => {
      checkNewPage(20);
      doc.setFont('helvetica', 'bold');
      doc.text(`${item.titulo} (${item.tipo})`, margin, yPosition);
      yPosition += 5;
      doc.setFont('helvetica', 'normal');
      doc.text(`Fecha: ${new Date(item.fecha).toLocaleDateString('es-ES')}`, margin, yPosition);
      yPosition += 5;
      if (item.descripcion) {
        const descLines = doc.splitTextToSize(item.descripcion, maxWidth);
        doc.text(descLines, margin, yPosition);
        yPosition += descLines.length * 5;
      }
      yPosition += 5;
    });
    yPosition += 5;
  }

  // ALERTAS
  if (data.alerts.length > 0) {
    checkNewPage(20);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('ALERTAS', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    data.alerts.forEach((alert) => {
      checkNewPage(20);
      doc.setFont('helvetica', 'bold');
      doc.text(`${alert.titulo} [${alert.tipo}]`, margin, yPosition);
      yPosition += 5;
      doc.setFont('helvetica', 'normal');
      doc.text(`Fecha: ${new Date(alert.fecha).toLocaleDateString('es-ES')}`, margin, yPosition);
      yPosition += 5;
      const descLines = doc.splitTextToSize(alert.descripcion, maxWidth);
      doc.text(descLines, margin, yPosition);
      yPosition += descLines.length * 5 + 5;
    });
    yPosition += 5;
  }

  // NOTAS
  if (data.notes.length > 0) {
    checkNewPage(20);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('NOTAS', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    data.notes.forEach((note) => {
      checkNewPage(30);
      doc.setFont('helvetica', 'bold');
      doc.text(`Por: ${note.autor}`, margin, yPosition);
      yPosition += 5;
      doc.setFont('helvetica', 'normal');
      doc.text(`Fecha: ${new Date(note.fecha).toLocaleDateString('es-ES')}`, margin, yPosition);
      yPosition += 5;
      if (note.tipo) {
        doc.text(`Tipo: ${note.tipo}`, margin, yPosition);
        yPosition += 5;
      }
      if (note.menciones && note.menciones.length > 0) {
        const mentionsText = note.menciones.map(m => m.userName).join(', ');
        doc.text(`Menciones: ${mentionsText}`, margin, yPosition);
        yPosition += 5;
      }
      if (note.editadoPor) {
        doc.text(`Editado por: ${note.editadoPor} el ${note.fechaEdicion ? new Date(note.fechaEdicion).toLocaleDateString('es-ES') : ''}`, margin, yPosition);
        yPosition += 5;
      }
      const contentLines = doc.splitTextToSize(note.contenido, maxWidth);
      doc.text(contentLines, margin, yPosition);
      yPosition += contentLines.length * 5 + 5;
    });
  }

  // Guardar PDF
  const fileName = `ficha_cliente_${clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

/**
 * Exporta la ficha del cliente a CSV
 */
export function exportToCSV(data: ClientFileData, clientName: string): void {
  const rows: string[][] = [];

  // Encabezado
  rows.push(['FICHA DEL CLIENTE', clientName]);
  rows.push(['Generado el', new Date().toLocaleDateString('es-ES')]);
  rows.push([]);

  // PERFIL
  if (data.profile) {
    rows.push(['=== PERFIL ===']);
    rows.push(['Campo', 'Valor']);
    rows.push(['Nombre', data.profile.nombre || '']);
    rows.push(['Email', data.profile.email || '']);
    rows.push(['Teléfono', data.profile.telefono || '']);
    rows.push(['Fecha de Nacimiento', data.profile.fechaNacimiento || '']);
    rows.push(['Género', data.profile.genero || '']);
    rows.push(['Altura', data.profile.altura ? `${data.profile.altura} cm` : '']);
    rows.push(['Peso', data.profile.peso ? `${data.profile.peso} kg` : '']);
    rows.push(['Objetivo Principal', data.profile.objetivoPrincipal || '']);
    rows.push(['Estado', data.profile.estado || '']);
    rows.push(['Entrenador', data.profile.entrenador || '']);
    rows.push(['Fecha de Inicio', data.profile.fechaInicio || '']);
    rows.push([]);
  }

  // OBJETIVOS
  if (data.objectives.length > 0) {
    rows.push(['=== OBJETIVOS ===']);
    rows.push(['Título', 'Descripción', 'Progreso (%)', 'Estado', 'Fecha Inicio', 'Fecha Límite']);
    data.objectives.forEach((obj) => {
      rows.push([
        obj.titulo,
        obj.descripcion || '',
        obj.progreso.toString(),
        obj.estado,
        new Date(obj.fechaInicio).toLocaleDateString('es-ES'),
        obj.fechaLimite ? new Date(obj.fechaLimite).toLocaleDateString('es-ES') : '',
      ]);
    });
    rows.push([]);
  }

  // HISTORIAL
  if (data.history.length > 0) {
    rows.push(['=== HISTORIAL ===']);
    rows.push(['Fecha', 'Tipo', 'Título', 'Descripción']);
    data.history.forEach((item) => {
      rows.push([
        new Date(item.fecha).toLocaleDateString('es-ES'),
        item.tipo,
        item.titulo,
        item.descripcion || '',
      ]);
    });
    rows.push([]);
  }

  // ALERTAS
  if (data.alerts.length > 0) {
    rows.push(['=== ALERTAS ===']);
    rows.push(['Fecha', 'Tipo', 'Título', 'Descripción', 'Leída']);
    data.alerts.forEach((alert) => {
      rows.push([
        new Date(alert.fecha).toLocaleDateString('es-ES'),
        alert.tipo,
        alert.titulo,
        alert.descripcion,
        alert.leida ? 'Sí' : 'No',
      ]);
    });
    rows.push([]);
  }

  // NOTAS
  if (data.notes.length > 0) {
    rows.push(['=== NOTAS ===']);
    rows.push(['Fecha', 'Autor', 'Tipo', 'Contenido', 'Menciones', 'Editado Por', 'Fecha Edición']);
    data.notes.forEach((note) => {
      const mentionsText = note.menciones && note.menciones.length > 0
        ? note.menciones.map(m => m.userName).join('; ')
        : '';
      rows.push([
        new Date(note.fecha).toLocaleDateString('es-ES'),
        note.autor,
        note.tipo || '',
        note.contenido.replace(/\n/g, ' '),
        mentionsText,
        note.editadoPor || '',
        note.fechaEdicion ? new Date(note.fechaEdicion).toLocaleDateString('es-ES') : '',
      ]);
    });
  }

  // Convertir a CSV
  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => {
          // Escapar comillas y envolver en comillas si contiene comas, saltos de línea o comillas
          const cellStr = String(cell || '');
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        })
        .join(',')
    )
    .join('\n');

  // Agregar BOM para Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const fileName = `ficha_cliente_${clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
  saveAs(blob, fileName);
}

