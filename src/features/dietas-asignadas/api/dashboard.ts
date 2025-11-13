import type { MacrosNutricionales, Dieta } from '../types';

export interface DatosMacrosDiarias {
  fecha: string;
  macrosObjetivo: MacrosNutricionales;
  macrosConsumidos: MacrosNutricionales;
  enRango: boolean;
}

export interface TendenciaSemanal {
  semana: string; // Formato: "2024-W01"
  promedioAdherencia: number;
  diasEnRango: number;
  totalDias: number;
  macrosPromedio: MacrosNutricionales;
  tendencia: 'mejora' | 'estable' | 'empeora';
}

export interface ObjetivoMicronutriente {
  nombre: string;
  unidad: string;
  objetivo: number;
  consumido: number;
  porcentaje: number;
  estado: 'deficiente' | 'adecuado' | 'optimo';
}

export interface DashboardCompactoData {
  macrosDiarias: DatosMacrosDiarias;
  tendenciaSemanal: TendenciaSemanal;
  porcentajeDiasEnRango: number;
  objetivosMicronutrientes: ObjetivoMicronutriente[];
}

/**
 * Obtiene los datos del dashboard compacto para una dieta
 */
export async function getDashboardCompacto(
  dietaId: string,
  clienteId: string
): Promise<DashboardCompactoData> {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Simular datos basados en el clienteId
  const seed = clienteId.charCodeAt(0) % 10;
  const hoy = new Date();
  const fechaHoy = hoy.toISOString().split('T')[0];

  // Macros diarias (hoy)
  const macrosObjetivo: MacrosNutricionales = {
    calorias: 2000 + (seed * 100),
    proteinas: 150 + (seed * 10),
    carbohidratos: 200 + (seed * 15),
    grasas: 65 + (seed * 5),
  };

  const factorConsumo = 0.85 + (seed * 0.02); // 85-95% de consumo
  const macrosConsumidos: MacrosNutricionales = {
    calorias: Math.round(macrosObjetivo.calorias * factorConsumo),
    proteinas: Math.round(macrosObjetivo.proteinas * factorConsumo),
    carbohidratos: Math.round(macrosObjetivo.carbohidratos * factorConsumo),
    grasas: Math.round(macrosObjetivo.grasas * factorConsumo),
  };

  const enRango = factorConsumo >= 0.90 && factorConsumo <= 1.10;

  // Tendencia semanal
  const semanaActual = getSemanaISO(hoy);
  const promedioAdherencia = 75 + (seed * 3);
  const diasEnRango = 4 + (seed % 3);
  const totalDias = 7;

  // Calcular tendencia basada en seed
  let tendencia: 'mejora' | 'estable' | 'empeora' = 'estable';
  if (seed < 3) tendencia = 'mejora';
  else if (seed > 7) tendencia = 'empeora';

  // Objetivos de micronutrientes
  const objetivosMicronutrientes: ObjetivoMicronutriente[] = [
    {
      nombre: 'Vitamina D',
      unidad: 'UI',
      objetivo: 2000,
      consumido: 1500 + (seed * 100),
      porcentaje: 0,
      estado: 'adecuado',
    },
    {
      nombre: 'Hierro',
      unidad: 'mg',
      objetivo: 18,
      consumido: 12 + (seed * 0.5),
      porcentaje: 0,
      estado: seed < 4 ? 'deficiente' : 'adecuado',
    },
    {
      nombre: 'Calcio',
      unidad: 'mg',
      objetivo: 1000,
      consumido: 800 + (seed * 30),
      porcentaje: 0,
      estado: seed < 3 ? 'deficiente' : 'adecuado',
    },
    {
      nombre: 'Magnesio',
      unidad: 'mg',
      objetivo: 400,
      consumido: 320 + (seed * 10),
      porcentaje: 0,
      estado: 'adecuado',
    },
    {
      nombre: 'Vitamina B12',
      unidad: 'μg',
      objetivo: 2.4,
      consumido: 2.0 + (seed * 0.1),
      porcentaje: 0,
      estado: 'adecuado',
    },
    {
      nombre: 'Ácido Fólico',
      unidad: 'μg',
      objetivo: 400,
      consumido: 350 + (seed * 10),
      porcentaje: 0,
      estado: 'adecuado',
    },
    {
      nombre: 'Zinc',
      unidad: 'mg',
      objetivo: 11,
      consumido: 8 + (seed * 0.5),
      porcentaje: 0,
      estado: seed < 5 ? 'deficiente' : 'adecuado',
    },
  ].map((obj) => ({
    ...obj,
    porcentaje: (obj.consumido / obj.objetivo) * 100,
    estado: obj.porcentaje >= 100 ? 'optimo' : obj.porcentaje >= 80 ? 'adecuado' : 'deficiente',
  }));

  return {
    macrosDiarias: {
      fecha: fechaHoy,
      macrosObjetivo,
      macrosConsumidos,
      enRango,
    },
    tendenciaSemanal: {
      semana: semanaActual,
      promedioAdherencia,
      diasEnRango,
      totalDias,
      macrosPromedio: macrosObjetivo,
      tendencia,
    },
    porcentajeDiasEnRango: (diasEnRango / totalDias) * 100,
    objetivosMicronutrientes,
  };
}

/**
 * Obtiene la tendencia semanal de las últimas semanas
 */
export async function getTendenciasSemanales(
  clienteId: string,
  semanas: number = 4
): Promise<TendenciaSemanal[]> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const tendencias: TendenciaSemanal[] = [];
  const hoy = new Date();

  for (let i = semanas - 1; i >= 0; i--) {
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() - (i * 7));
    const semana = getSemanaISO(fecha);

    const seed = (clienteId.charCodeAt(0) + i) % 10;
    const promedioAdherencia = 70 + (seed * 3) + (i * 2); // Mejora progresiva
    const diasEnRango = 3 + (seed % 4) + (i > 1 ? 1 : 0);

    let tendencia: 'mejora' | 'estable' | 'empeora' = 'estable';
    if (i === semanas - 1) tendencia = 'mejora';
    else if (i === 0 && seed > 7) tendencia = 'empeora';

    tendencias.push({
      semana,
      promedioAdherencia,
      diasEnRango,
      totalDias: 7,
      macrosPromedio: {
        calorias: 2000,
        proteinas: 150,
        carbohidratos: 200,
        grasas: 65,
      },
      tendencia,
    });
  }

  return tendencias;
}

/**
 * Obtiene el número de semana ISO
 */
function getSemanaISO(fecha: Date): string {
  const d = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
}

