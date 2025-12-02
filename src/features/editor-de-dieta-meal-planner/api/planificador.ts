import { Dieta, Comida } from './editor';

export interface PlanSemanal {
  id: string;
  dietaId: string;
  semanaInicio: Date;
  semanaFin: Date;
  dias: DiaPlan[];
}

export interface DiaPlan {
  fecha: Date;
  comidas: Comida[];
  totalCalorias: number;
  totalProteinas: number;
  totalCarbohidratos: number;
  totalGrasas: number;
}

export interface ListaCompra {
  id: string;
  dietaId?: string;
  planSemanalId?: string;
  items: ItemListaCompra[];
  fechaCreacion: Date;
  fechaCompra?: Date;
}

export interface ItemListaCompra {
  alimento: string;
  cantidad: number;
  unidad: string;
  categoria: string;
  prioridad?: 'alta' | 'media' | 'baja';
  adquirido?: boolean;
}

export async function crearPlanSemanal(dietaId: string, semanaInicio: Date): Promise<PlanSemanal | null> {
  const res = await fetch('/api/nutricion/planificador', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dietaId, semanaInicio }),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getPlanSemanal(id: string): Promise<PlanSemanal | null> {
  const res = await fetch(`/api/nutricion/planificador/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function generarListaCompra(dietaId?: string, planSemanalId?: string): Promise<ListaCompra | null> {
  const res = await fetch('/api/nutricion/editor/lista-compra', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dietaId, planSemanalId }),
  });
  if (!res.ok) return null;
  return res.json();
}

export function calcularTotalesDia(comidas: Comida[]): {
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
} {
  return comidas.reduce(
    (totales, comida) => ({
      calorias: totales.calorias + comida.calorias,
      proteinas: totales.proteinas + comida.proteinas,
      carbohidratos: totales.carbohidratos + comida.carbohidratos,
      grasas: totales.grasas + comida.grasas,
    }),
    { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
  );
}

export function validarBalanceNutricional(
  totales: { calorias: number; proteinas: number; carbohidratos: number; grasas: number },
  objetivos: { calorias: number; proteinas: number; carbohidratos: number; grasas: number },
  tolerancia = 5
): { balanceado: boolean; diferencias: { [key: string]: number }; porcentajes: { [key: string]: number } } {
  const diferencias = {
    calorias: totales.calorias - objetivos.calorias,
    proteinas: totales.proteinas - objetivos.proteinas,
    carbohidratos: totales.carbohidratos - objetivos.carbohidratos,
    grasas: totales.grasas - objetivos.grasas,
  };

  const porcentajes = {
    calorias: (diferencias.calorias / objetivos.calorias) * 100,
    proteinas: (diferencias.proteinas / objetivos.proteinas) * 100,
    carbohidratos: (diferencias.carbohidratos / objetivos.carbohidratos) * 100,
    grasas: (diferencias.grasas / objetivos.grasas) * 100,
  };

  const balanceado =
    Math.abs(porcentajes.calorias) <= tolerancia &&
    Math.abs(porcentajes.proteinas) <= tolerancia &&
    Math.abs(porcentajes.carbohidratos) <= tolerancia &&
    Math.abs(porcentajes.grasas) <= tolerancia;

  return { balanceado, diferencias, porcentajes };
}

