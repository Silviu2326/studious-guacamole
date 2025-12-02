import { EstadisticasPlantillas, PlantillaDieta } from '../types';
import { getPlantillas } from './plantillas';

const API_BASE = '/api/nutricion/plantillas/analytics';

export async function getEstadisticasPlantillas(): Promise<EstadisticasPlantillas> {
  await new Promise(resolve => setTimeout(resolve, 200));
    
  const plantillas = await getPlantillas();
  const publicadas = plantillas.filter(p => p.publicada).length;
  const privadas = plantillas.filter(p => !p.publicada).length;
  const usoTotal = plantillas.reduce((sum, p) => sum + p.usoCount, 0);
  const masUsada = plantillas.length > 0 ? plantillas.reduce((max, p) => 
    p.usoCount > (max?.usoCount || 0) ? p : max, 
    plantillas[0]
  ) : null;
  
  // Calcular efectividad promedio
  const plantillasConEfectividad = plantillas.filter(p => p.efectividad);
  const efectividadPromedio = plantillasConEfectividad.length > 0
    ? plantillasConEfectividad.reduce((sum, p) => sum + (p.efectividad?.tasaExito || 0), 0) / plantillasConEfectividad.length
    : 0;
  
  // Categoría más popular
  const categoriasCount: Record<string, number> = {};
  plantillas.forEach(p => {
    categoriasCount[p.categoria] = (categoriasCount[p.categoria] || 0) + 1;
  });
  const categoriaMasPopular = Object.entries(categoriasCount).reduce((max, [cat, count]) =>
    count > (max[1] || 0) ? [cat, count] : max,
    ['balanceada', 0] as [string, number]
  )[0] as any;
  
  return {
    totalPlantillas: plantillas.length,
    plantillasPublicadas: publicadas,
    plantillasPrivadas: privadas,
    usoTotal,
    plantillaMasUsada: masUsada,
    categoriaMasPopular,
    efectividadPromedio: Math.round(efectividadPromedio),
  };
}

export async function getMetricasPlantilla(id: string): Promise<PlantillaDieta['efectividad']> {
  await new Promise(resolve => setTimeout(resolve, 200));
    
  return {
    tasaExito: 85,
    satisfaccionPromedio: 4.2,
    seguimientoPromedio: 78,
  };
}

