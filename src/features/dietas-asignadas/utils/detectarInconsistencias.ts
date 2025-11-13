import { Dieta, Comida, MacrosNutricionales } from '../types';

export interface Inconsistencia {
  id: string;
  tipo: 'dia-sin-comidas' | 'macros-fuera-rango';
  severidad: 'alta' | 'media' | 'baja';
  mensaje: string;
  dia?: string;
  detalles?: {
    macro?: 'calorias' | 'proteinas' | 'carbohidratos' | 'grasas';
    valorActual?: number;
    valorObjetivo?: number;
    diferencia?: number;
    porcentajeDiferencia?: number;
  };
}

const TOLERANCIA_MACROS = 10; // 10% de tolerancia para macros fuera de rango

/**
 * Detecta días sin comidas asignadas
 */
function detectarDiasSinComidas(dieta: Dieta): Inconsistencia[] {
  const inconsistencias: Inconsistencia[] = [];
  const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  
  // Agrupar comidas por día (asumiendo que las comidas tienen un campo de día o se distribuyen semanalmente)
  // Por ahora, verificamos si hay comidas en general
  if (!dieta.comidas || dieta.comidas.length === 0) {
    diasSemana.forEach((dia, index) => {
      inconsistencias.push({
        id: `dia-sin-comidas-${dia}`,
        tipo: 'dia-sin-comidas',
        severidad: 'alta',
        mensaje: `${dia.charAt(0).toUpperCase() + dia.slice(1)} sin comidas asignadas`,
        dia: dia,
      });
    });
  } else {
    // Si hay comidas, verificar distribución por días
    // Por simplicidad, asumimos que si hay menos de 7 días con comidas, hay días sin comidas
    const comidasPorDia = Math.floor(dieta.comidas.length / 7);
    if (comidasPorDia < 3) {
      // Menos de 3 comidas por día en promedio
      inconsistencias.push({
        id: 'dias-sin-comidas-suficientes',
        tipo: 'dia-sin-comidas',
        severidad: 'media',
        mensaje: 'Algunos días tienen muy pocas comidas asignadas',
      });
    }
  }

  return inconsistencias;
}

/**
 * Detecta macros fuera de rango en las comidas
 */
function detectarMacrosFueraRango(dieta: Dieta): Inconsistencia[] {
  const inconsistencias: Inconsistencia[] = [];
  
  if (!dieta.comidas || dieta.comidas.length === 0) {
    return inconsistencias;
  }

  // Calcular totales de macros de todas las comidas
  const totales = dieta.comidas.reduce(
    (acc, comida) => ({
      calorias: acc.calorias + comida.calorias,
      proteinas: acc.proteinas + comida.proteinas,
      carbohidratos: acc.carbohidratos + comida.carbohidratos,
      grasas: acc.grasas + comida.grasas,
    }),
    { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
  );

  // Calcular promedios diarios (asumiendo 7 días)
  const promedioDiario = {
    calorias: totales.calorias / 7,
    proteinas: totales.proteinas / 7,
    carbohidratos: totales.carbohidratos / 7,
    grasas: totales.grasas / 7,
  };

  // Verificar cada macro
  const macros: Array<keyof MacrosNutricionales> = ['calorias', 'proteinas', 'carbohidratos', 'grasas'];
  
  macros.forEach((macro) => {
    const objetivo = dieta.macros[macro];
    const actual = promedioDiario[macro];
    const diferencia = actual - objetivo;
    const porcentajeDiferencia = objetivo > 0 ? (diferencia / objetivo) * 100 : 0;

    if (Math.abs(porcentajeDiferencia) > TOLERANCIA_MACROS) {
      const severidad = Math.abs(porcentajeDiferencia) > 20 ? 'alta' : 
                       Math.abs(porcentajeDiferencia) > 15 ? 'media' : 'baja';
      
      inconsistencias.push({
        id: `macro-fuera-rango-${macro}`,
        tipo: 'macros-fuera-rango',
        severidad,
        mensaje: `${macro === 'calorias' ? 'Calorías' : macro.charAt(0).toUpperCase() + macro.slice(1)} fuera de rango: ${actual.toFixed(0)} vs ${objetivo} objetivo (${porcentajeDiferencia > 0 ? '+' : ''}${porcentajeDiferencia.toFixed(1)}%)`,
        detalles: {
          macro,
          valorActual: actual,
          valorObjetivo: objetivo,
          diferencia,
          porcentajeDiferencia,
        },
      });
    }
  });

  return inconsistencias;
}

/**
 * Detecta todas las inconsistencias en una dieta
 */
export function detectarInconsistencias(dieta: Dieta): Inconsistencia[] {
  const inconsistencias: Inconsistencia[] = [];

  // Detectar días sin comidas
  inconsistencias.push(...detectarDiasSinComidas(dieta));

  // Detectar macros fuera de rango
  inconsistencias.push(...detectarMacrosFueraRango(dieta));

  return inconsistencias;
}

/**
 * Obtiene el resumen de inconsistencias
 */
export function obtenerResumenInconsistencias(inconsistencias: Inconsistencia[]): {
  total: number;
  altas: number;
  medias: number;
  bajas: number;
} {
  return {
    total: inconsistencias.length,
    altas: inconsistencias.filter(i => i.severidad === 'alta').length,
    medias: inconsistencias.filter(i => i.severidad === 'media').length,
    bajas: inconsistencias.filter(i => i.severidad === 'baja').length,
  };
}

