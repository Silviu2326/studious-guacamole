import type {
  ReglaBalanceoMacros,
  ResultadoBalanceoMacros,
  AlcanceBalanceo,
  Dieta,
  MacrosNutricionales,
  Comida,
} from '../types';
import { getDieta, actualizarDieta } from './dietas';

// Mock storage para reglas de balanceo
const reglasBalanceoMock: ReglaBalanceoMacros[] = [
  {
    id: '1',
    dietistaId: 'dietista1',
    nombre: 'Regla Proteína Mínima',
    descripcion: 'Asegurar mínimo de proteína diaria',
    activa: true,
    proteinaMinima: 120,
    prioridadAjuste: ['proteinas', 'carbohidratos', 'grasas', 'calorias'],
    aplicarATodos: true,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  },
  {
    id: '2',
    dietistaId: 'dietista1',
    nombre: 'Límite Azúcares',
    descripcion: 'Limitar azúcares a máximo 50g diarios',
    activa: true,
    azucaresMaximos: 50,
    prioridadAjuste: ['carbohidratos', 'proteinas', 'grasas', 'calorias'],
    aplicarATodos: true,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  },
];

/**
 * Obtiene todas las reglas de balanceo de un dietista
 */
export async function getReglasBalanceo(dietistaId: string): Promise<ReglaBalanceoMacros[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return reglasBalanceoMock.filter(r => r.dietistaId === dietistaId && r.activa);
}

/**
 * Obtiene una regla de balanceo por ID
 */
export async function getReglaBalanceo(id: string): Promise<ReglaBalanceoMacros | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return reglasBalanceoMock.find(r => r.id === id) || null;
}

/**
 * Crea una nueva regla de balanceo
 */
export async function crearReglaBalanceo(
  regla: Omit<ReglaBalanceoMacros, 'id' | 'creadoEn' | 'actualizadoEn'>
): Promise<ReglaBalanceoMacros> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const nuevaRegla: ReglaBalanceoMacros = {
    ...regla,
    id: `regla-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };
  reglasBalanceoMock.push(nuevaRegla);
  return nuevaRegla;
}

/**
 * Actualiza una regla de balanceo
 */
export async function actualizarReglaBalanceo(
  id: string,
  regla: Partial<ReglaBalanceoMacros>
): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = reglasBalanceoMock.findIndex(r => r.id === id);
  if (index === -1) return false;
  reglasBalanceoMock[index] = {
    ...reglasBalanceoMock[index],
    ...regla,
    actualizadoEn: new Date().toISOString(),
  };
  return true;
}

/**
 * Elimina una regla de balanceo
 */
export async function eliminarReglaBalanceo(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = reglasBalanceoMock.findIndex(r => r.id === id);
  if (index === -1) return false;
  reglasBalanceoMock.splice(index, 1);
  return true;
}

/**
 * Calcula los macros actuales de una dieta (por día o semana)
 */
function calcularMacrosActuales(
  dieta: Dieta,
  alcance: AlcanceBalanceo,
  dia?: string
): MacrosNutricionales {
  let comidasRelevantes: Comida[] = [];

  if (alcance === 'dia' && dia) {
    comidasRelevantes = dieta.comidas.filter(c => c.dia === dia);
  } else {
    comidasRelevantes = dieta.comidas;
  }

  return comidasRelevantes.reduce(
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
 * Aplica las reglas de balanceo a los macros
 */
function aplicarReglas(
  macros: MacrosNutricionales,
  reglas: ReglaBalanceoMacros[]
): { macrosAjustados: MacrosNutricionales; advertencias: string[] } {
  const macrosAjustados = { ...macros };
  const advertencias: string[] = [];

  for (const regla of reglas) {
    // Aplicar reglas de proteína
    if (regla.proteinaMinima && macrosAjustados.proteinas < regla.proteinaMinima) {
      const diferencia = regla.proteinaMinima - macrosAjustados.proteinas;
      macrosAjustados.proteinas = regla.proteinaMinima;
      // Ajustar calorías proporcionalmente (1g proteína = 4 kcal)
      macrosAjustados.calorias += diferencia * 4;
      advertencias.push(`Proteína ajustada a mínimo: ${regla.proteinaMinima}g`);
    }
    if (regla.proteinaMaxima && macrosAjustados.proteinas > regla.proteinaMaxima) {
      const diferencia = macrosAjustados.proteinas - regla.proteinaMaxima;
      macrosAjustados.proteinas = regla.proteinaMaxima;
      macrosAjustados.calorias -= diferencia * 4;
      advertencias.push(`Proteína ajustada a máximo: ${regla.proteinaMaxima}g`);
    }

    // Aplicar reglas de carbohidratos
    if (regla.carbohidratosMinimos && macrosAjustados.carbohidratos < regla.carbohidratosMinimos) {
      const diferencia = regla.carbohidratosMinimos - macrosAjustados.carbohidratos;
      macrosAjustados.carbohidratos = regla.carbohidratosMinimos;
      macrosAjustados.calorias += diferencia * 4;
      advertencias.push(`Carbohidratos ajustados a mínimo: ${regla.carbohidratosMinimos}g`);
    }
    if (regla.carbohidratosMaximos && macrosAjustados.carbohidratos > regla.carbohidratosMaximos) {
      const diferencia = macrosAjustados.carbohidratos - regla.carbohidratosMaximos;
      macrosAjustados.carbohidratos = regla.carbohidratosMaximos;
      macrosAjustados.calorias -= diferencia * 4;
      advertencias.push(`Carbohidratos ajustados a máximo: ${regla.carbohidratosMaximos}g`);
    }

    // Aplicar reglas de grasas
    if (regla.grasasMinimas && macrosAjustados.grasas < regla.grasasMinimas) {
      const diferencia = regla.grasasMinimas - macrosAjustados.grasas;
      macrosAjustados.grasas = regla.grasasMinimas;
      macrosAjustados.calorias += diferencia * 9;
      advertencias.push(`Grasas ajustadas a mínimo: ${regla.grasasMinimas}g`);
    }
    if (regla.grasasMaximas && macrosAjustados.grasas > regla.grasasMaximas) {
      const diferencia = macrosAjustados.grasas - regla.grasasMaximas;
      macrosAjustados.grasas = regla.grasasMaximas;
      macrosAjustados.calorias -= diferencia * 9;
      advertencias.push(`Grasas ajustadas a máximo: ${regla.grasasMaximas}g`);
    }

    // Aplicar reglas de calorías
    if (regla.caloriasMinimas && macrosAjustados.calorias < regla.caloriasMinimas) {
      macrosAjustados.calorias = regla.caloriasMinimas;
      advertencias.push(`Calorías ajustadas a mínimo: ${regla.caloriasMinimas} kcal`);
    }
    if (regla.caloriasMaximas && macrosAjustados.calorias > regla.caloriasMaximas) {
      macrosAjustados.calorias = regla.caloriasMaximas;
      advertencias.push(`Calorías ajustadas a máximo: ${regla.caloriasMaximas} kcal`);
    }
  }

  return { macrosAjustados, advertencias };
}

/**
 * Distribuye los ajustes de macros entre las comidas proporcionalmente
 */
function distribuirAjustes(
  comidas: Comida[],
  macrosObjetivo: MacrosNutricionales,
  macrosActuales: MacrosNutricionales
): Comida[] {
  if (comidas.length === 0) return comidas;

  const factorCalorias = macrosObjetivo.calorias / Math.max(macrosActuales.calorias, 1);
  const factorProteinas = macrosObjetivo.proteinas / Math.max(macrosActuales.proteinas, 1);
  const factorCarbohidratos =
    macrosObjetivo.carbohidratos / Math.max(macrosActuales.carbohidratos, 1);
  const factorGrasas = macrosObjetivo.grasas / Math.max(macrosActuales.grasas, 1);

  return comidas.map(comida => ({
    ...comida,
    calorias: Math.round(comida.calorias * factorCalorias),
    proteinas: Math.round(comida.proteinas * factorProteinas * 10) / 10,
    carbohidratos: Math.round(comida.carbohidratos * factorCarbohidratos * 10) / 10,
    grasas: Math.round(comida.grasas * factorGrasas * 10) / 10,
  }));
}

/**
 * Equilibra automáticamente los macros de una dieta usando IA respetando las reglas
 */
export async function equilibrarMacrosIA(
  dietaId: string,
  alcance: AlcanceBalanceo,
  dia?: string,
  reglasIds?: string[]
): Promise<ResultadoBalanceoMacros> {
  const inicioTiempo = Date.now();

  // Obtener la dieta
  const dieta = await getDieta(dietaId);
  if (!dieta) {
    throw new Error('Dieta no encontrada');
  }

  // Obtener reglas aplicables
  let reglas: ReglaBalanceoMacros[] = [];
  if (reglasIds && reglasIds.length > 0) {
    reglas = await Promise.all(
      reglasIds.map(id => getReglaBalanceo(id))
    ).then(reglas => reglas.filter((r): r is ReglaBalanceoMacros => r !== null));
  } else {
    // Obtener todas las reglas activas del dietista
    reglas = await getReglasBalanceo(dieta.creadoPor);
  }

  if (reglas.length === 0) {
    return {
      dietaId,
      alcance,
      diasAfectados: dia ? [dia] : undefined,
      macrosAntes: dieta.macros,
      macrosDespues: dieta.macros,
      cambios: [],
      reglasAplicadas: [],
      tiempoEjecucion: Date.now() - inicioTiempo,
      exito: false,
      mensaje: 'No hay reglas de balanceo configuradas',
    };
  }

  // Calcular macros actuales
  const macrosActuales = calcularMacrosActuales(dieta, alcance, dia);

  // Aplicar reglas para obtener macros objetivo ajustados
  const { macrosAjustados, advertencias } = aplicarReglas(macrosActuales, reglas);

  // Determinar comidas a ajustar
  let comidasAAjustar: Comida[] = [];
  if (alcance === 'dia' && dia) {
    comidasAAjustar = dieta.comidas.filter(c => c.dia === dia && !c.bloqueado);
  } else {
    comidasAAjustar = dieta.comidas.filter(c => !c.bloqueado);
  }

  // Distribuir ajustes proporcionalmente
  const comidasAjustadas = distribuirAjustes(comidasAAjustar, macrosAjustados, macrosActuales);

  // USER STORY 1: Generar explicaciones para cada regla aplicada
  const explicacionesReglas = reglas.map(regla => {
    let explicacion = '';
    let impacto = '';

    if (regla.proteinaMinima && macrosActuales.proteinas < regla.proteinaMinima) {
      const diferencia = regla.proteinaMinima - macrosActuales.proteinas;
      explicacion = `La dieta tenía ${macrosActuales.proteinas.toFixed(1)}g de proteína, que está por debajo del mínimo establecido de ${regla.proteinaMinima}g. Se necesita aumentar ${diferencia.toFixed(1)}g para cumplir con la regla.`;
      impacto = `Este ajuste asegura que el cliente reciba suficiente proteína diaria para mantener la masa muscular y promover la síntesis proteica, especialmente importante en dietas de pérdida de peso o ganancia muscular.`;
    } else if (regla.azucaresMaximos && macrosActuales.carbohidratos > regla.azucaresMaximos * 2) {
      explicacion = `La dieta tiene un alto contenido de carbohidratos (${macrosActuales.carbohidratos.toFixed(1)}g), lo que puede resultar en exceso de azúcares. La regla limita los azúcares a máximo ${regla.azucaresMaximos}g.`;
      impacto = `Reducir los azúcares ayuda a mantener niveles estables de glucosa en sangre, previene picos de insulina y favorece la pérdida de grasa, especialmente en dietas de control de peso.`;
    } else if (regla.caloriasMinimas && macrosActuales.calorias < regla.caloriasMinimas) {
      const diferencia = regla.caloriasMinimas - macrosActuales.calorias;
      explicacion = `La dieta tenía ${macrosActuales.calorias} kcal, que está por debajo del mínimo establecido de ${regla.caloriasMinimas} kcal. Se necesita aumentar ${diferencia} kcal para cumplir con la regla.`;
      impacto = `Mantener un mínimo calórico adecuado es esencial para preservar la masa muscular, mantener el metabolismo activo y asegurar que el cuerpo tenga suficiente energía para las funciones básicas.`;
    } else {
      explicacion = `Esta regla se aplicó para mantener el equilibrio nutricional dentro de los rangos establecidos.`;
      impacto = `El ajuste asegura que la dieta cumpla con los objetivos nutricionales y las restricciones definidas.`;
    }

    return {
      reglaId: regla.id,
      nombreRegla: regla.nombre,
      explicacion,
      impacto,
    };
  });

  // Calcular cambios con explicaciones (USER STORY 1)
  const cambios = comidasAjustadas.map((comidaAjustada, index) => {
    const comidaOriginal = comidasAAjustar[index];
    const cambiosComida: ResultadoBalanceoMacros['cambios'][0]['cambios'] = [];

    if (comidaAjustada.calorias !== comidaOriginal.calorias) {
      const diferencia = comidaAjustada.calorias - comidaOriginal.calorias;
      const porcentaje = ((diferencia / comidaOriginal.calorias) * 100).toFixed(1);
      cambiosComida.push({
        campo: 'calorias',
        valorAnterior: comidaOriginal.calorias,
        valorNuevo: comidaAjustada.calorias,
        diferencia,
        explicacion: diferencia > 0
          ? `Se aumentaron las calorías en ${Math.abs(diferencia)} kcal (${porcentaje}%) para alcanzar el objetivo calórico diario/semanal. Esto asegura que el cliente reciba suficiente energía para sus actividades y funciones metabólicas.`
          : `Se redujeron las calorías en ${Math.abs(diferencia)} kcal (${porcentaje}%) para mantener el déficit calórico objetivo y evitar exceder el límite máximo establecido.`,
      });
    }
    if (comidaAjustada.proteinas !== comidaOriginal.proteinas) {
      const diferencia = comidaAjustada.proteinas - comidaOriginal.proteinas;
      const porcentaje = comidaOriginal.proteinas > 0 ? ((diferencia / comidaOriginal.proteinas) * 100).toFixed(1) : '0';
      cambiosComida.push({
        campo: 'proteinas',
        valorAnterior: comidaOriginal.proteinas,
        valorNuevo: comidaAjustada.proteinas,
        diferencia,
        explicacion: diferencia > 0
          ? `Se aumentaron las proteínas en ${Math.abs(diferencia).toFixed(1)}g (${porcentaje}%) para cumplir con el mínimo diario requerido. Las proteínas son esenciales para mantener la masa muscular, especialmente importante en dietas de pérdida de peso o durante el entrenamiento.`
          : `Se redujeron las proteínas en ${Math.abs(diferencia).toFixed(1)}g (${porcentaje}%) para equilibrar la distribución de macronutrientes y evitar exceder el máximo establecido.`,
      });
    }
    if (comidaAjustada.carbohidratos !== comidaOriginal.carbohidratos) {
      const diferencia = comidaAjustada.carbohidratos - comidaOriginal.carbohidratos;
      const porcentaje = comidaOriginal.carbohidratos > 0 ? ((diferencia / comidaOriginal.carbohidratos) * 100).toFixed(1) : '0';
      cambiosComida.push({
        campo: 'carbohidratos',
        valorAnterior: comidaOriginal.carbohidratos,
        valorNuevo: comidaAjustada.carbohidratos,
        diferencia,
        explicacion: diferencia > 0
          ? `Se aumentaron los carbohidratos en ${Math.abs(diferencia).toFixed(1)}g (${porcentaje}%) para proporcionar energía adecuada y mantener los niveles de glucógeno muscular, especialmente importante si el cliente realiza actividad física regular.`
          : `Se redujeron los carbohidratos en ${Math.abs(diferencia).toFixed(1)}g (${porcentaje}%) para controlar el aporte calórico y mantener el equilibrio de macronutrientes según los objetivos de la dieta.`,
      });
    }
    if (comidaAjustada.grasas !== comidaOriginal.grasas) {
      const diferencia = comidaAjustada.grasas - comidaOriginal.grasas;
      const porcentaje = comidaOriginal.grasas > 0 ? ((diferencia / comidaOriginal.grasas) * 100).toFixed(1) : '0';
      cambiosComida.push({
        campo: 'grasas',
        valorAnterior: comidaOriginal.grasas,
        valorNuevo: comidaAjustada.grasas,
        diferencia,
        explicacion: diferencia > 0
          ? `Se aumentaron las grasas en ${Math.abs(diferencia).toFixed(1)}g (${porcentaje}%) para asegurar un aporte adecuado de ácidos grasos esenciales y facilitar la absorción de vitaminas liposolubles. Las grasas también proporcionan saciedad y mejoran el sabor de las comidas.`
          : `Se redujeron las grasas en ${Math.abs(diferencia).toFixed(1)}g (${porcentaje}%) para controlar el aporte calórico total, ya que las grasas aportan 9 kcal por gramo, el doble que proteínas y carbohidratos.`,
      });
    }

    // Explicación general del cambio en esta comida (USER STORY 1)
    const cambioTotal = cambiosComida.length;
    const explicacionGeneral = cambioTotal > 0
      ? `Esta comida fue ajustada para cumplir con ${cambioTotal > 1 ? 'los objetivos nutricionales establecidos' : 'el objetivo nutricional establecido'}. Los cambios se distribuyeron proporcionalmente para mantener el equilibrio de la dieta sin alterar significativamente el sabor o la composición de los alimentos.`
      : undefined;

    return {
      comidaId: comidaOriginal.id,
      nombreComida: comidaOriginal.nombre,
      cambios: cambiosComida,
      explicacionGeneral,
    };
  }).filter(c => c.cambios.length > 0);

  // Explicación general del balanceo (USER STORY 1)
  const explicacionGeneral = `El balanceo automático de macros se realizó aplicando ${reglas.length} regla(s) de balanceo. ` +
    `Se ajustaron ${cambios.length} comida(s) para alcanzar los objetivos nutricionales establecidos. ` +
    `Los cambios se distribuyeron proporcionalmente entre las comidas para mantener el equilibrio de la dieta. ` +
    `Este proceso asegura que la dieta cumpla con los requisitos mínimos y máximos de cada macronutriente, optimizando así los resultados del plan nutricional.`;

  // Actualizar la dieta con los cambios
  const comidasActualizadas = dieta.comidas.map(comida => {
    const comidaAjustada = comidasAjustadas.find(c => c.id === comida.id);
    return comidaAjustada || comida;
  });

  const actualizado = await actualizarDieta(dietaId, {
    comidas: comidasActualizadas,
    macros: macrosAjustados,
  });

  if (!actualizado) {
    return {
      dietaId,
      alcance,
      diasAfectados: dia ? [dia] : undefined,
      macrosAntes: macrosActuales,
      macrosDespues: macrosActuales,
      cambios: [],
      reglasAplicadas: [],
      tiempoEjecucion: Date.now() - inicioTiempo,
      exito: false,
      mensaje: 'Error al actualizar la dieta',
    };
  }

  const tiempoEjecucion = Date.now() - inicioTiempo;

  return {
    dietaId,
    alcance,
    diasAfectados: dia ? [dia] : undefined,
    macrosAntes: macrosActuales,
    macrosDespues: macrosAjustados,
    cambios,
    reglasAplicadas: reglas.map(r => r.id),
    explicacionesReglas: explicacionesReglas.length > 0 ? explicacionesReglas : undefined,
    explicacionGeneral,
    tiempoEjecucion,
    exito: true,
    mensaje: `Macros equilibrados exitosamente en ${tiempoEjecucion}ms`,
    advertencias: advertencias.length > 0 ? advertencias : undefined,
  };
}

