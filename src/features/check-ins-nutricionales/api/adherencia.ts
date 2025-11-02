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
}

export async function getAdherenciaNutricional(clienteId: string, periodo?: 'dia' | 'semana' | 'mes'): Promise<AdherenciaNutricional | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
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

