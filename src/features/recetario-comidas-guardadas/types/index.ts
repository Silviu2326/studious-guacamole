export interface Receta {
  id: string;
  nombre: string;
  descripcion?: string;
  categoria: CategoriaReceta;
  tipoComida: TipoComida;
  dificultad: DificultadReceta;
  tiempoPreparacion: number; // minutos
  tiempoCoccion?: number; // minutos
  porciones: number;
  ingredientes: IngredienteReceta[];
  instrucciones: string[];
  valorNutricional: ValorNutricional;
  imagen?: string;
  esFavorita: boolean;
  creadoPor: string;
  creadoEn: Date;
  actualizadoEn: Date;
  tags?: string[];
  compartida: boolean;
  usoCount?: number;
  caloriasPorPorcion: number;
}

export interface IngredienteReceta {
  id: string;
  alimentoId?: string;
  nombre: string;
  cantidad: number;
  unidad: string;
  notas?: string;
  valorNutricional?: {
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
    fibra?: number;
    azucares?: number;
    sodio?: number;
  };
}

export interface ValorNutricional {
  calorias: number;
  proteinas: number; // gramos
  carbohidratos: number; // gramos
  grasas: number; // gramos
  fibra?: number; // gramos
  azucares?: number; // gramos
  sodio?: number; // miligramos
  vitaminas?: {
    vitaminaA?: number;
    vitaminaC?: number;
    vitaminaD?: number;
    vitaminaE?: number;
    vitaminaK?: number;
    tiamina?: number;
    riboflavina?: number;
    niacina?: number;
    vitaminaB6?: number;
    folato?: number;
    vitaminaB12?: number;
  };
  minerales?: {
    calcio?: number;
    hierro?: number;
    magnesio?: number;
    fosforo?: number;
    potasio?: number;
    zinc?: number;
    cobre?: number;
    manganeso?: number;
    selenio?: number;
  };
}

export type CategoriaReceta =
  | 'desayuno'
  | 'almuerzo'
  | 'cena'
  | 'snack'
  | 'postre'
  | 'bebida'
  | 'smoothie'
  | 'ensalada'
  | 'sopa'
  | 'plato-principal'
  | 'acompanamiento'
  | 'personalizada';

export type TipoComida =
  | 'desayuno'
  | 'media-manana'
  | 'almuerzo'
  | 'merienda'
  | 'cena'
  | 'post-entreno';

export type DificultadReceta = 'facil' | 'media' | 'dificil';

export interface FiltrosRecetas {
  categoria?: CategoriaReceta;
  tipoComida?: TipoComida;
  dificultad?: DificultadReceta;
  caloriasMin?: number;
  caloriasMax?: number;
  proteinasMin?: number;
  carbohidratosMin?: number;
  tiempoMax?: number;
  texto?: string;
  favoritas?: boolean;
  ingredientes?: string[];
  tags?: string[];
}

export interface ListaCompra {
  ingredientes: IngredienteListaCompra[];
  fechaCreacion: Date;
  recetas: string[];
}

export interface IngredienteListaCompra {
  nombre: string;
  cantidadTotal: number;
  unidad: string;
  recetas: string[];
  categoria?: string;
}

export interface EstadisticasRecetas {
  totalRecetas: number;
  recetasFavoritas: number;
  recetasCreadas: number;
  categoriaMasUsada: CategoriaReceta | null;
  recetaMasUsada: Receta | null;
  tiempoPromedioPreparacion: number;
}

