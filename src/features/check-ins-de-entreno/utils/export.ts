export interface ExportCheckInRow {
  fecha: string;
  serie?: number;
  semaforo: 'rojo' | 'amarillo' | 'verde';
  sensaciones?: string;
  dolorLumbar: boolean;
  rpe?: number;
  observaciones?: string;
}

function descargarArchivo(contenido: string, nombreArchivo: string, tipoMime: string) {
  const blob = new Blob([contenido], { type: tipoMime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function aCSV(rows: ExportCheckInRow[]): string {
  const encabezados = [
    'Fecha',
    'Serie',
    'Semaforo',
    'Sensaciones',
    'DolorLumbar',
    'RPE',
    'Observaciones',
  ];
  const lineas: string[] = [];
  lineas.push(encabezados.join(','));
  rows.forEach((r) => {
    const valores = [
      r.fecha,
      r.serie != null ? String(r.serie) : '',
      r.semaforo,
      r.sensaciones ? `"${r.sensaciones.replace(/"/g, '""')}"` : '',
      r.dolorLumbar ? 'Si' : 'No',
      r.rpe != null ? String(r.rpe) : '',
      r.observaciones ? `"${r.observaciones.replace(/"/g, '""')}"` : '',
    ];
    lineas.push(valores.join(','));
  });
  return lineas.join('\n');
}

function aTextoPDF(rows: ExportCheckInRow[], titulo: string): string {
  const lineas: string[] = [];
  lineas.push(titulo);
  lineas.push('==============================');
  lineas.push('');
  rows.forEach((r) => {
    lineas.push(`Fecha: ${r.fecha}${r.serie ? ` (Serie ${r.serie})` : ''}`);
    lineas.push(`Semáforo: ${r.semaforo.toUpperCase()}`);
    if (r.rpe != null) lineas.push(`RPE: ${r.rpe}`);
    if (r.sensaciones) lineas.push(`Sensaciones: ${r.sensaciones}`);
    if (r.observaciones) lineas.push(`Obs: ${r.observaciones}`);
    if (r.dolorLumbar) lineas.push(`Dolor lumbar: SI`);
    lineas.push(''); 
  });
  return lineas.join('\n');
}

export function exportCheckInsExcel(rows: ExportCheckInRow[], nombreBase = 'checkins'): void {
  const fecha = new Date().toISOString().split('T')[0];
  const contenido = aCSV(rows);
  descargarArchivo(contenido, `${nombreBase}_${fecha}.csv`, 'text/csv;charset=utf-8;');
}

export function exportCheckInsPDF(rows: ExportCheckInRow[], nombreBase = 'checkins'): void {
  const fecha = new Date().toISOString().split('T')[0];
  const contenido = aTextoPDF(rows, 'REPORTE DE CHECK-INS DE ENTRENO');
  descargarArchivo(contenido, `${nombreBase}_${fecha}.txt`, 'text/plain');
}


