export interface Macronutriente {
  nombre: 'proteínas' | 'carbohidratos' | 'grasas';
  consumoReal: number; // gramos
  objetivoDiario: number; // gramos
  porcentajeCumplimiento: number;
}

export interface AdherenciaNutricional {
  clienteId: string;
  periodo: string;
  porcentajeAdherencia: number;
  checkInsCompletados: number;
  checkInsTotales: number;
  cumplimientoMacros: number;
  cumplimientoHorarios: number;
  fotosSubidas: number;
  pesoRegistrado: boolean;
  macronutrientes?: Macronutriente[]; // Datos de macronutrientes para el gráfico
}

export async function getAdherenciaNutricional(clienteId: string, periodo?: 'dia' | 'semana' | 'mes'): Promise<AdherenciaNutricional | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Datos de macronutrientes: consumo real vs objetivo diario
  const macronutrientes: Macronutriente[] = [
    {
      nombre: 'proteínas',
      consumoReal: 145, // gramos consumidos
      objetivoDiario: 160, // gramos objetivo
      porcentajeCumplimiento: 90.6, // (145/160) * 100
    },
    {
      nombre: 'carbohidratos',
      consumoReal: 280, // gramos consumidos
      objetivoDiario: 300, // gramos objetivo
      porcentajeCumplimiento: 93.3, // (280/300) * 100
    },
    {
      nombre: 'grasas',
      consumoReal: 65, // gramos consumidos
      objetivoDiario: 80, // gramos objetivo
      porcentajeCumplimiento: 81.3, // (65/80) * 100
    },
  ];
  
  return {
    clienteId,
    periodo: periodo || 'semana',
    porcentajeAdherencia: 82,
    checkInsCompletados: 12,
    checkInsTotales: 14,
    cumplimientoMacros: 85,
    cumplimientoHorarios: 78,
    fotosSubidas: 35,
    pesoRegistrado: true,
    macronutrientes,
  };
}

export async function getTendenciasAdherencia(clienteId: string, dias?: number): Promise<{
  fecha: string;
  adherencia: number;
}[]> {
  await new Promise(resolve => setTimeout(resolve, 250));
  
  const ahora = new Date();
  const tendencias: { fecha: string; adherencia: number }[] = [];
  
  const diasGenerar = dias || 30;
  for (let i = diasGenerar - 1; i >= 0; i--) {
    const fecha = new Date(ahora);
    fecha.setDate(fecha.getDate() - i);
    
    const adherencia = 70 + Math.random() * 20 + (diasGenerar - i) * 0.3;
    tendencias.push({
      fecha: fecha.toISOString().split('T')[0],
      adherencia: Math.min(100, Math.max(50, Math.round(adherencia))),
    });
  }
  
  return tendencias;
}

export async function getAnalyticsNutricional(clienteId?: string): Promise<{
  promedioAdherencia: number;
  totalCheckIns: number;
  fotosEvaluadas: number;
  pesoRegistrado: number;
  cumplimientoMacros: number;
  tendencias: Array<{ fecha: string; adherencia: number }>;
}> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return {
    promedioAdherencia: 82,
    totalCheckIns: 45,
    fotosEvaluadas: 35,
    pesoRegistrado: 40,
    cumplimientoMacros: 85,
    tendencias: await getTendenciasAdherencia(clienteId || '', 30),
  };
}

