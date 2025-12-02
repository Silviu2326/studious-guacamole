import { Cuadrante } from '../types';
import { getTurnos } from './turnos';

// Datos mock para desarrollo
const mockCuadrantes: Cuadrante[] = [];

export const getCuadrantes = async (): Promise<Cuadrante[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const turnos = await getTurnos();
    
    // Agrupar turnos por semana y año
    const cuadrantesMap = new Map<string, Cuadrante>();
    
    turnos.forEach(turno => {
      const fecha = new Date(turno.fecha);
      const año = fecha.getFullYear();
      const fechaInicio = new Date(año, 0, 1);
      const dias = Math.floor((fecha.getTime() - fechaInicio.getTime()) / (24 * 60 * 60 * 1000));
      const semana = Math.ceil((dias + fechaInicio.getDay() + 1) / 7);
      const mes = fecha.getMonth() + 1;
      
      const key = `${año}-${semana}`;
      
      if (!cuadrantesMap.has(key)) {
        cuadrantesMap.set(key, {
          id: key,
          semana,
          año,
          mes,
          turnos: [],
          personal: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      
      const cuadrante = cuadrantesMap.get(key)!;
      cuadrante.turnos.push(turno);
    });
    
    return Array.from(cuadrantesMap.values());
  } catch (error) {
    console.error('Error fetching cuadrantes:', error);
    return [];
  }
};

export const getCuadrante = async (semana: number, año: number): Promise<Cuadrante | null> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const cuadrantes = await getCuadrantes();
    return cuadrantes.find(c => c.semana === semana && c.año === año) || null;
  } catch (error) {
    console.error('Error fetching cuadrante:', error);
    return null;
  }
};


