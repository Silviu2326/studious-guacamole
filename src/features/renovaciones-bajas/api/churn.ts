import { ChurnData, PeriodoChurn } from '../types';

// Datos falsos para análisis de churn
const datosFalsosChurnMensual: ChurnData[] = [
  {
    periodo: 'Enero 2024',
    sociosIniciales: 450,
    bajas: 12,
    motivosBaja: ['Precio elevado de la membresía', 'Falta de tiempo', 'Cambio de residencia', 'Problema de salud', 'Horarios no disponibles'],
    tasaChurn: 2.67,
  },
  {
    periodo: 'Febrero 2024',
    sociosIniciales: 438,
    bajas: 8,
    motivosBaja: ['Precio elevado de la membresía', 'Falta de tiempo', 'Cambio de residencia'],
    tasaChurn: 1.83,
  },
  {
    periodo: 'Marzo 2024',
    sociosIniciales: 430,
    bajas: 15,
    motivosBaja: ['Precio elevado de la membresía', 'Falta de motivación', 'Cambio de residencia', 'Problema de salud'],
    tasaChurn: 3.49,
  },
  {
    periodo: 'Abril 2024',
    sociosIniciales: 415,
    bajas: 10,
    motivosBaja: ['Precio elevado de la membresía', 'Falta de tiempo', 'Horarios no disponibles'],
    tasaChurn: 2.41,
  },
  {
    periodo: 'Mayo 2024',
    sociosIniciales: 405,
    bajas: 9,
    motivosBaja: ['Precio elevado de la membresía', 'Falta de tiempo', 'Problema de salud'],
    tasaChurn: 2.22,
  },
  {
    periodo: 'Junio 2024',
    sociosIniciales: 396,
    bajas: 11,
    motivosBaja: ['Precio elevado de la membresía', 'Cambio de residencia', 'Horarios no disponibles', 'Falta de motivación'],
    tasaChurn: 2.78,
  },
];

const datosFalsosChurnTrimestral: ChurnData[] = [
  {
    periodo: 'Q1 2024',
    sociosIniciales: 450,
    bajas: 35,
    motivosBaja: ['Precio elevado de la membresía', 'Falta de tiempo', 'Cambio de residencia', 'Problema de salud', 'Horarios no disponibles', 'Falta de motivación'],
    tasaChurn: 7.78,
  },
  {
    periodo: 'Q2 2024',
    sociosIniciales: 415,
    bajas: 30,
    motivosBaja: ['Precio elevado de la membresía', 'Falta de tiempo', 'Horarios no disponibles', 'Cambio de residencia', 'Falta de motivación'],
    tasaChurn: 7.23,
  },
];

const datosFalsosChurnAnual: ChurnData[] = [
  {
    periodo: '2023',
    sociosIniciales: 420,
    bajas: 145,
    motivosBaja: ['Precio elevado de la membresía', 'Falta de tiempo', 'Cambio de residencia', 'Problema de salud', 'Horarios no disponibles', 'Falta de motivación', 'Instalaciones necesitan mejoras'],
    tasaChurn: 34.52,
  },
  {
    periodo: '2024',
    sociosIniciales: 450,
    bajas: 65,
    motivosBaja: ['Precio elevado de la membresía', 'Falta de tiempo', 'Cambio de residencia', 'Problema de salud', 'Horarios no disponibles', 'Falta de motivación'],
    tasaChurn: 14.44,
  },
];

export async function getAnalisisChurn(periodo: PeriodoChurn): Promise<ChurnData[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  switch (periodo.tipo) {
    case 'mensual':
      return datosFalsosChurnMensual;
    case 'trimestral':
      return datosFalsosChurnTrimestral;
    case 'anual':
      return datosFalsosChurnAnual;
    default:
      return datosFalsosChurnMensual;
  }
}

export async function exportarReporteChurn(periodo: PeriodoChurn): Promise<Blob | null> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const datos = await getAnalisisChurn(periodo);
  
  // Crear un blob CSV simple
  const csv = 'Período,Socios Iniciales,Bajas,Tasa Churn %,Motivos de Baja\n' +
    datos.map(d => 
      `"${d.periodo}",${d.sociosIniciales},${d.bajas},${d.tasaChurn.toFixed(2)},"${d.motivosBaja.join(', ')}"`
    ).join('\n');
  
  return new Blob([csv], { type: 'text/csv' });
}
