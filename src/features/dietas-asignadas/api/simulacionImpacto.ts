import { Dieta, Comida, RecomendacionIA, SimulacionImpactoIA, MacrosNutricionales, RecursoBiblioteca } from '../types';
import { getDieta } from './dietas';
import { getRecursoPorId } from './recursos';

/**
 * Calcula el coste total de una dieta
 */
function calcularCosteTotal(comidas: Comida[]): number {
  return comidas.reduce((total, comida) => {
    // Calcular coste de la comida basado en sus alimentos
    // En producción, esto vendría de una base de datos de precios
    const costeComida = comida.alimentos.reduce((sum, alimento) => {
      // Estimación: ~0.05€ por 100g de alimento
      return sum + (alimento.cantidad / 100) * 0.05;
    }, 0);
    
    // Si la comida tiene un coste estimado en el recurso, usarlo
    // Por ahora, usamos la estimación
    return total + costeComida;
  }, 0);
}

/**
 * Calcula el tiempo total de preparación de una dieta
 */
function calcularTiempoPreparacionTotal(comidas: Comida[]): number {
  return comidas.reduce((total, comida) => {
    // Si la comida tiene tiempo de preparación, usarlo
    if (comida.tempoCulinario) {
      return total + comida.tempoCulinario;
    }
    // Estimación por defecto: 20 minutos por comida
    return total + 20;
  }, 0);
}

/**
 * Calcula los macros totales de una dieta
 */
function calcularMacrosTotales(comidas: Comida[]): MacrosNutricionales {
  return comidas.reduce(
    (total, comida) => ({
      calorias: total.calorias + comida.calorias,
      proteinas: total.proteinas + comida.proteinas,
      carbohidratos: total.carbohidratos + comida.carbohidratos,
      grasas: total.grasas + comida.grasas,
    }),
    { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
  );
}

/**
 * Simula el impacto de una recomendación IA antes de aplicarla
 */
export async function simularImpactoRecomendacion(
  dietaId: string,
  recomendacion: RecomendacionIA
): Promise<SimulacionImpactoIA> {
  // Obtener la dieta actual
  const dieta = await getDieta(dietaId);
  if (!dieta) {
    throw new Error('Dieta no encontrada');
  }

  // Calcular estado antes
  const macrosAntes = calcularMacrosTotales(dieta.comidas);
  const costeAntes = calcularCosteTotal(dieta.comidas);
  const tiempoAntes = calcularTiempoPreparacionTotal(dieta.comidas);

  // Crear una copia de las comidas para simular el cambio
  let comidasSimuladas = [...dieta.comidas];

  // Aplicar la recomendación a la copia
  switch (recomendacion.tipo) {
    case 'sustitucion-receta': {
      if (recomendacion.detalles.comidaId && recomendacion.detalles.recursoId) {
        const recurso = await getRecursoPorId(recomendacion.detalles.recursoId);
        if (recurso && recurso.alimentos) {
          const indice = comidasSimuladas.findIndex(c => c.id === recomendacion.detalles.comidaId);
          if (indice !== -1) {
            // Crear nueva comida basada en el recurso
            const nuevaComida: Comida = {
              ...comidasSimuladas[indice],
              nombre: recurso.nombre,
              alimentos: recurso.alimentos,
              calorias: recurso.macros.calorias,
              proteinas: recurso.macros.proteinas,
              carbohidratos: recurso.macros.carbohidratos,
              grasas: recurso.macros.grasas,
              tempoCulinario: recurso.tiempoPreparacion,
            };
            comidasSimuladas[indice] = nuevaComida;
          }
        }
      }
      break;
    }
    case 'ajuste-macros': {
      if (recomendacion.detalles.comidaId && recomendacion.detalles.ajusteMacros) {
        const indice = comidasSimuladas.findIndex(c => c.id === recomendacion.detalles.comidaId);
        if (indice !== -1) {
          const comida = comidasSimuladas[indice];
          const ajuste = recomendacion.detalles.ajusteMacros;
          comidasSimuladas[indice] = {
            ...comida,
            calorias: comida.calorias + (ajuste.calorias || 0),
            proteinas: comida.proteinas + (ajuste.proteinas || 0),
            carbohidratos: comida.carbohidratos + (ajuste.carbohidratos || 0),
            grasas: comida.grasas + (ajuste.grasas || 0),
          };
        }
      }
      break;
    }
    case 'añadir-comida': {
      if (recomendacion.detalles.recursoId && recomendacion.detalles.tipoComida) {
        const recurso = await getRecursoPorId(recomendacion.detalles.recursoId);
        if (recurso && recurso.alimentos) {
          const nuevaComida: Comida = {
            id: `nueva-${Date.now()}`,
            nombre: recurso.nombre,
            tipo: recomendacion.detalles.tipoComida,
            alimentos: recurso.alimentos,
            calorias: recurso.macros.calorias,
            proteinas: recurso.macros.proteinas,
            carbohidratos: recurso.macros.carbohidratos,
            grasas: recurso.macros.grasas,
            tempoCulinario: recurso.tiempoPreparacion,
          };
          comidasSimuladas.push(nuevaComida);
        }
      }
      break;
    }
    case 'eliminar-comida': {
      if (recomendacion.detalles.comidaId) {
        comidasSimuladas = comidasSimuladas.filter(c => c.id !== recomendacion.detalles.comidaId);
      }
      break;
    }
    case 'modificar-cantidad': {
      if (recomendacion.detalles.comidaId && recomendacion.detalles.cantidad) {
        const indice = comidasSimuladas.findIndex(c => c.id === recomendacion.detalles.comidaId);
        if (indice !== -1) {
          const comida = comidasSimuladas[indice];
          const factor = recomendacion.detalles.cantidad / 100; // Asumiendo que cantidad es porcentaje
          comidasSimuladas[indice] = {
            ...comida,
            calorias: comida.calorias * factor,
            proteinas: comida.proteinas * factor,
            carbohidratos: comida.carbohidratos * factor,
            grasas: comida.grasas * factor,
            alimentos: comida.alimentos.map(a => ({
              ...a,
              cantidad: a.cantidad * factor,
              calorias: a.calorias * factor,
              proteinas: a.proteinas * factor,
              carbohidratos: a.carbohidratos * factor,
              grasas: a.grasas * factor,
            })),
          };
        }
      }
      break;
    }
  }

  // Calcular estado después
  const macrosDespues = calcularMacrosTotales(comidasSimuladas);
  const costeDespues = calcularCosteTotal(comidasSimuladas);
  const tiempoDespues = calcularTiempoPreparacionTotal(comidasSimuladas);

  // Calcular variaciones
  const variacionCalorias = macrosDespues.calorias - macrosAntes.calorias;
  const variacionCoste = costeDespues - costeAntes;
  const variacionTiempo = tiempoDespues - tiempoAntes;

  const variacionProteinas = macrosDespues.proteinas - macrosAntes.proteinas;
  const variacionCarbohidratos = macrosDespues.carbohidratos - macrosAntes.carbohidratos;
  const variacionGrasas = macrosDespues.grasas - macrosAntes.grasas;

  // Calcular porcentajes
  const porcentajeCalorias = macrosAntes.calorias > 0 
    ? (variacionCalorias / macrosAntes.calorias) * 100 
    : 0;
  const porcentajeCoste = costeAntes > 0 
    ? (variacionCoste / costeAntes) * 100 
    : 0;
  const porcentajeTiempo = tiempoAntes > 0 
    ? (variacionTiempo / tiempoAntes) * 100 
    : 0;

  const porcentajeProteinas = macrosAntes.proteinas > 0 
    ? (variacionProteinas / macrosAntes.proteinas) * 100 
    : 0;
  const porcentajeCarbohidratos = macrosAntes.carbohidratos > 0 
    ? (variacionCarbohidratos / macrosAntes.carbohidratos) * 100 
    : 0;
  const porcentajeGrasas = macrosAntes.grasas > 0 
    ? (variacionGrasas / macrosAntes.grasas) * 100 
    : 0;

  // Calcular cumplimiento de objetivos (simplificado)
  const cumplimientoAntes = calcularCumplimientoObjetivos(dieta, macrosAntes);
  const cumplimientoDespues = calcularCumplimientoObjetivos(dieta, macrosDespues);

  const simulacion: SimulacionImpactoIA = {
    id: `sim-${Date.now()}`,
    recomendacionId: recomendacion.id,
    tipoRecomendacion: recomendacion.tipo,
    descripcion: recomendacion.descripcion,
    estadoAntes: {
      calorias: macrosAntes.calorias,
      proteinas: macrosAntes.proteinas,
      carbohidratos: macrosAntes.carbohidratos,
      grasas: macrosAntes.grasas,
      costeTotal: costeAntes,
      tiempoPreparacionTotal: tiempoAntes,
      numeroComidas: dieta.comidas.length,
    },
    estadoDespues: {
      calorias: macrosDespues.calorias,
      proteinas: macrosDespues.proteinas,
      carbohidratos: macrosDespues.carbohidratos,
      grasas: macrosDespues.grasas,
      costeTotal: costeDespues,
      tiempoPreparacionTotal: tiempoDespues,
      numeroComidas: comidasSimuladas.length,
    },
    variaciones: {
      calorias: {
        valor: variacionCalorias,
        porcentaje: porcentajeCalorias,
        tendencia: variacionCalorias > 0 ? 'aumento' : variacionCalorias < 0 ? 'disminucion' : 'sin-cambio',
      },
      coste: {
        valor: variacionCoste,
        porcentaje: porcentajeCoste,
        tendencia: variacionCoste > 0 ? 'aumento' : variacionCoste < 0 ? 'disminucion' : 'sin-cambio',
      },
      tiempoPreparacion: {
        valor: variacionTiempo,
        porcentaje: porcentajeTiempo,
        tendencia: variacionTiempo > 0 ? 'aumento' : variacionTiempo < 0 ? 'disminucion' : 'sin-cambio',
      },
      macros: {
        proteinas: {
          valor: variacionProteinas,
          porcentaje: porcentajeProteinas,
          tendencia: variacionProteinas > 0 ? 'aumento' : variacionProteinas < 0 ? 'disminucion' : 'sin-cambio',
        },
        carbohidratos: {
          valor: variacionCarbohidratos,
          porcentaje: porcentajeCarbohidratos,
          tendencia: variacionCarbohidratos > 0 ? 'aumento' : variacionCarbohidratos < 0 ? 'disminucion' : 'sin-cambio',
        },
        grasas: {
          valor: variacionGrasas,
          porcentaje: porcentajeGrasas,
          tendencia: variacionGrasas > 0 ? 'aumento' : variacionGrasas < 0 ? 'disminucion' : 'sin-cambio',
        },
      },
    },
    impactoObjetivos: {
      objetivo: dieta.objetivo,
      cumplimientoAntes,
      cumplimientoDespues,
      mejora: cumplimientoDespues - cumplimientoAntes,
    },
    aplicada: false,
    fechaSimulacion: new Date().toISOString(),
  };

  return simulacion;
}

/**
 * Calcula el cumplimiento de objetivos nutricionales (simplificado)
 */
function calcularCumplimientoObjetivos(dieta: Dieta, macros: MacrosNutricionales): number {
  // Calcular qué tan cerca están los macros actuales de los objetivos
  const diferenciaCalorias = Math.abs(macros.calorias - dieta.macros.calorias) / dieta.macros.calorias;
  const diferenciaProteinas = Math.abs(macros.proteinas - dieta.macros.proteinas) / dieta.macros.proteinas;
  const diferenciaCarbohidratos = Math.abs(macros.carbohidratos - dieta.macros.carbohidratos) / dieta.macros.carbohidratos;
  const diferenciaGrasas = Math.abs(macros.grasas - dieta.macros.grasas) / dieta.macros.grasas;

  // Calcular cumplimiento promedio (invertido: menor diferencia = mayor cumplimiento)
  const cumplimiento = 100 - ((diferenciaCalorias + diferenciaProteinas + diferenciaCarbohidratos + diferenciaGrasas) / 4) * 100;
  
  return Math.max(0, Math.min(100, cumplimiento));
}

/**
 * Simula múltiples recomendaciones y devuelve comparación
 */
export async function simularMultiplesRecomendaciones(
  dietaId: string,
  recomendaciones: RecomendacionIA[]
): Promise<SimulacionImpactoIA[]> {
  return Promise.all(
    recomendaciones.map(rec => simularImpactoRecomendacion(dietaId, rec))
  );
}

