export interface CalculoMacrosParams {
  edad: number;
  sexo: 'masculino' | 'femenino';
  peso: number;
  altura: number;
  nivelActividad: 'sedentario' | 'ligero' | 'moderado' | 'intenso' | 'muy-intenso';
  objetivo: 'perdida-peso' | 'ganancia-muscular' | 'mantenimiento' | 'rendimiento' | 'salud-general';
  deficitCalorico?: number; // porcentaje de déficit
  superavitCalorico?: number; // porcentaje de superávit
}

export interface MacrosCalculados {
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  fibra?: number;
  agua?: number;
  distribucionProteinas?: {
    desayuno: number;
    comida: number;
    cena: number;
    postEntreno?: number;
  };
  distribucionCarbohidratos?: {
    preEntreno?: number;
    postEntreno?: number;
    restoDia: number;
  };
}

export async function calcularMacros(params: CalculoMacrosParams): Promise<MacrosCalculados | null> {
  const res = await fetch('/api/nutricion/calcular-macros', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) return null;
  return res.json();
}

export function calcularTMB(edad: number, sexo: 'masculino' | 'femenino', peso: number, altura: number): number {
  // Fórmula de Mifflin-St Jeor
  const factorSexo = sexo === 'masculino' ? 5 : -161;
  const tmb = 10 * peso + 6.25 * altura - 5 * edad + factorSexo;
  return Math.round(tmb);
}

export function calcularGET(tmb: number, nivelActividad: CalculoMacrosParams['nivelActividad']): number {
  const factores = {
    sedentario: 1.2,
    ligero: 1.375,
    moderado: 1.55,
    intenso: 1.725,
    'muy-intenso': 1.9,
  };
  return Math.round(tmb * factores[nivelActividad]);
}

export function ajustarPorObjetivo(get: number, objetivo: CalculoMacrosParams['objetivo'], deficit?: number, superavit?: number): number {
  let calorias = get;
  
  switch (objetivo) {
    case 'perdida-peso':
      const deficitValor = deficit || 20;
      calorias = get * (1 - deficitValor / 100);
      break;
    case 'ganancia-muscular':
      const superavitValor = superavit || 10;
      calorias = get * (1 + superavitValor / 100);
      break;
    case 'mantenimiento':
      calorias = get;
      break;
    case 'rendimiento':
      const superavitRendimiento = superavit || 15;
      calorias = get * (1 + superavitRendimiento / 100);
      break;
    case 'salud-general':
      calorias = get;
      break;
  }
  
  return Math.round(calorias);
}

export function distribuirMacros(calorias: number, objetivo: CalculoMacrosParams['objetivo']): { proteinas: number; carbohidratos: number; grasas: number } {
  let ratioProteinas = 0.3; // 30% por defecto
  let ratioCarbohidratos = 0.4; // 40% por defecto
  let ratioGrasas = 0.3; // 30% por defecto
  
  switch (objetivo) {
    case 'perdida-peso':
      ratioProteinas = 0.35;
      ratioCarbohidratos = 0.35;
      ratioGrasas = 0.30;
      break;
    case 'ganancia-muscular':
      ratioProteinas = 0.30;
      ratioCarbohidratos = 0.45;
      ratioGrasas = 0.25;
      break;
    case 'rendimiento':
      ratioProteinas = 0.25;
      ratioCarbohidratos = 0.50;
      ratioGrasas = 0.25;
      break;
  }
  
  // 1g proteína = 4 cal, 1g carbohidrato = 4 cal, 1g grasa = 9 cal
  const proteinas = Math.round((calorias * ratioProteinas) / 4);
  const carbohidratos = Math.round((calorias * ratioCarbohidratos) / 4);
  const grasas = Math.round((calorias * ratioGrasas) / 9);
  
  return { proteinas, carbohidratos, grasas };
}

