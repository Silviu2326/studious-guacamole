import type { Dieta, DistribucionBloquesDia, TipoComida, MacrosNutricionales, Comida } from '../types';

const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as const;
const bloquesComidaDisponibles: TipoComida[] = ['desayuno', 'media-manana', 'almuerzo', 'merienda', 'cena', 'post-entreno'];

/**
 * Obtiene la distribución de bloques para un día específico
 */
export function getDistribucionBloquesDia(
  dieta: Dieta,
  dia: string
): DistribucionBloquesDia {
  const distribucion = dieta.distribucionBloques?.find(d => d.dia === dia);
  
  if (distribucion) {
    return distribucion;
  }

  // Por defecto, todos los bloques están activos
  return {
    dia,
    bloquesActivos: [...bloquesComidaDisponibles],
    macrosObjetivo: dieta.macros,
  };
}

/**
 * Obtiene todos los bloques activos para un día
 */
export function getBloquesActivosDia(dieta: Dieta, dia: string): TipoComida[] {
  const distribucion = getDistribucionBloquesDia(dieta, dia);
  return distribucion.bloquesActivos;
}

/**
 * Añade un bloque a un día específico
 */
export function añadirBloqueDia(
  dieta: Dieta,
  dia: string,
  tipoBloque: TipoComida
): Dieta {
  const distribucionActual = getDistribucionBloquesDia(dieta, dia);
  
  // Si el bloque ya está activo, no hacer nada
  if (distribucionActual.bloquesActivos.includes(tipoBloque)) {
    return dieta;
  }

  // Añadir el bloque
  const nuevaDistribucion: DistribucionBloquesDia = {
    ...distribucionActual,
    bloquesActivos: [...distribucionActual.bloquesActivos, tipoBloque],
  };

  // Actualizar la distribución en la dieta
  const distribucionesActualizadas = dieta.distribucionBloques 
    ? dieta.distribucionBloques.map(d => d.dia === dia ? nuevaDistribucion : d)
    : [];

  // Si no existía distribución para este día, añadirla
  if (!distribucionesActualizadas.find(d => d.dia === dia)) {
    distribucionesActualizadas.push(nuevaDistribucion);
  }

  // Recalcular macros automáticamente
  const macrosAjustados = calcularMacrosAjustados(dieta, dia, nuevaDistribucion);

  return {
    ...dieta,
    distribucionBloques: distribucionesActualizadas,
    macros: macrosAjustados,
  };
}

/**
 * Quita un bloque de un día específico
 */
export function quitarBloqueDia(
  dieta: Dieta,
  dia: string,
  tipoBloque: TipoComida
): Dieta {
  const distribucionActual = getDistribucionBloquesDia(dieta, dia);
  
  // Si el bloque no está activo, no hacer nada
  if (!distribucionActual.bloquesActivos.includes(tipoBloque)) {
    return dieta;
  }

  // No permitir quitar todos los bloques (mínimo 1)
  if (distribucionActual.bloquesActivos.length <= 1) {
    return dieta;
  }

  // Quitar el bloque
  const nuevaDistribucion: DistribucionBloquesDia = {
    ...distribucionActual,
    bloquesActivos: distribucionActual.bloquesActivos.filter(b => b !== tipoBloque),
  };

  // Actualizar la distribución en la dieta
  const distribucionesActualizadas = dieta.distribucionBloques 
    ? dieta.distribucionBloques.map(d => d.dia === dia ? nuevaDistribucion : d)
    : [];

  // Si no existía distribución para este día, añadirla
  if (!distribucionesActualizadas.find(d => d.dia === dia)) {
    distribucionesActualizadas.push(nuevaDistribucion);
  }

  // Recalcular macros automáticamente
  const macrosAjustados = calcularMacrosAjustados(dieta, dia, nuevaDistribucion);

  return {
    ...dieta,
    distribucionBloques: distribucionesActualizadas,
    macros: macrosAjustados,
  };
}

/**
 * Calcula los macros ajustados cuando se añaden/quitan bloques
 * Distribuye los macros objetivo proporcionalmente entre los bloques activos
 */
function calcularMacrosAjustados(
  dieta: Dieta,
  dia: string,
  distribucion: DistribucionBloquesDia
): MacrosNutricionales {
  // Obtener macros objetivo del día (si existe) o usar los macros generales
  const macrosObjetivoDia = distribucion.macrosObjetivo || dieta.macros;
  
  // Calcular macros actuales del día (suma de todas las comidas del día)
  const comidasDelDia = dieta.comidas.filter(c => c.dia === dia);
  const macrosActualesDia = comidasDelDia.reduce(
    (acc, comida) => ({
      calorias: acc.calorias + comida.calorias,
      proteinas: acc.proteinas + comida.proteinas,
      carbohidratos: acc.carbohidratos + comida.carbohidratos,
      grasas: acc.grasas + comida.grasas,
    }),
    { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
  );

  // Si no hay comidas asignadas al día, usar los macros objetivo
  if (comidasDelDia.length === 0) {
    return macrosObjetivoDia;
  }

  // Calcular número de bloques activos
  const numBloquesActivos = distribucion.bloquesActivos.length;
  
  // Distribución proporcional de macros por bloque
  // Cada bloque recibe una parte proporcional del total
  const macrosPorBloque = {
    calorias: macrosObjetivoDia.calorias / numBloquesActivos,
    proteinas: macrosObjetivoDia.proteinas / numBloquesActivos,
    carbohidratos: macrosObjetivoDia.carbohidratos / numBloquesActivos,
    grasas: macrosObjetivoDia.grasas / numBloquesActivos,
  };

  // Ajustar macros de las comidas existentes proporcionalmente
  // Si se añadió un bloque, redistribuir; si se quitó, consolidar
  const factorAjuste = numBloquesActivos / (distribucion.bloquesActivos.length || 1);

  // Retornar los macros objetivo ajustados (no modificamos las comidas aquí,
  // solo calculamos los objetivos)
  return {
    calorias: Math.round(macrosObjetivoDia.calorias),
    proteinas: Math.round(macrosObjetivoDia.proteinas * 100) / 100,
    carbohidratos: Math.round(macrosObjetivoDia.carbohidratos * 100) / 100,
    grasas: Math.round(macrosObjetivoDia.grasas * 100) / 100,
  };
}

/**
 * Obtiene los macros objetivo para un día específico
 */
export function getMacrosObjetivoDia(dieta: Dieta, dia: string): MacrosNutricionales {
  const distribucion = getDistribucionBloquesDia(dieta, dia);
  return distribucion.macrosObjetivo || dieta.macros;
}

/**
 * Calcula los macros actuales de un día (suma de todas las comidas del día)
 */
export function calcularMacrosActualesDia(dieta: Dieta, dia: string): MacrosNutricionales {
  const comidasDelDia = dieta.comidas.filter(c => c.dia === dia);
  
  return comidasDelDia.reduce(
    (acc, comida) => ({
      calorias: acc.calorias + comida.calorias,
      proteinas: acc.proteinas + comida.proteinas,
      carbohidratos: acc.carbohidratos + comida.carbohidratos,
      grasas: acc.grasas + comida.grasas,
    }),
    { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
  );
}

/**
 * Obtiene todos los bloques disponibles
 */
export function getBloquesDisponibles(): TipoComida[] {
  return [...bloquesComidaDisponibles];
}

