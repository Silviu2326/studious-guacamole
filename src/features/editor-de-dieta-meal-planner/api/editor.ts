export interface Dieta {
  id: string;
  nombre: string;
  descripcion?: string;
  objetivo: 'perdida-peso' | 'ganancia-muscular' | 'mantenimiento' | 'rendimiento' | 'salud-general';
  macros?: {
    proteinas: number;
    carbohidratos: number;
    grasas: number;
    calorias: number;
  };
  comidas: Comida[];
  horarios: HorarioComida[];
  sustituciones: Sustitucion[];
  clienteId?: string;
  planId?: string;
  esPlantilla: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
}

export interface Comida {
  id: string;
  nombre: string;
  tipo: 'desayuno' | 'media-manana' | 'almuerzo' | 'merienda' | 'cena' | 'post-entreno';
  alimentos: AlimentoComida[];
  horario?: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
}

export interface AlimentoComida {
  id: string;
  alimentoId: string;
  nombre: string;
  cantidad: number;
  unidad: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
}

export interface HorarioComida {
  id: string;
  comidaId: string;
  hora: string;
  dias: number[]; // 0-6 (domingo a sábado)
}

export interface Sustitucion {
  id: string;
  alimentoOriginalId: string;
  alimentoSustitutoId: string;
  motivo: string;
  ratio?: number; // ratio de conversión si es necesario
}

export interface Alimento {
  id: string;
  nombre: string;
  categoria: string;
  caloriasPor100g: number;
  proteinasPor100g: number;
  carbohidratosPor100g: number;
  grasasPor100g: number;
  fibraPor100g?: number;
  azucarPor100g?: number;
}

export async function getDietas(): Promise<Dieta[]> {
  const res = await fetch('/api/nutricion/editor');
  if (!res.ok) return [];
  return res.json();
}

export async function getDieta(id: string): Promise<Dieta | null> {
  const res = await fetch(`/api/nutricion/editor/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function crearDieta(data: Omit<Dieta, 'id' | 'creadoEn' | 'actualizadoEn'>): Promise<Dieta | null> {
  const res = await fetch('/api/nutricion/dietas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function actualizarDieta(id: string, data: Partial<Dieta>): Promise<boolean> {
  const res = await fetch(`/api/nutricion/dietas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.ok;
}

export async function eliminarDieta(id: string): Promise<boolean> {
  const res = await fetch(`/api/nutricion/dietas/${id}`, { method: 'DELETE' });
  return res.ok;
}

export async function getAlimentos(): Promise<Alimento[]> {
  const res = await fetch('/api/nutricion/alimentos');
  if (!res.ok) return [];
  return res.json();
}

export async function buscarAlimentos(query: string): Promise<Alimento[]> {
  const res = await fetch(`/api/nutricion/alimentos?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  return res.json();
}

export async function getPlantillas(): Promise<Dieta[]> {
  const res = await fetch('/api/nutricion/editor/plantillas');
  if (!res.ok) return [];
  return res.json();
}

export async function validarDieta(dieta: Dieta): Promise<{ valida: boolean; errores: string[]; advertencias: string[] }> {
  const res = await fetch('/api/nutricion/editor/validar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dieta),
  });
  if (!res.ok) return { valida: false, errores: ['Error al validar'], advertencias: [] };
  return res.json();
}

