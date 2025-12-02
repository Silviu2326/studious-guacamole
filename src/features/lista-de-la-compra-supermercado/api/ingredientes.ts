import { IngredienteLista, SeccionSupermercado } from './lista-compra';

// Re-export SeccionSupermercado for convenience
export type { SeccionSupermercado };

export interface Ingrediente {
  id: string;
  nombre: string;
  categoria: string;
  seccionSupermercado: SeccionSupermercado;
  unidadBase: string;
  precioAproximado?: number;
  esBase: boolean;
}

// Mock data
const ingredientesMock: Ingrediente[] = [
  { id: '1', nombre: 'Pechuga de pollo', categoria: 'Proteína', seccionSupermercado: 'carnes-pescados', unidadBase: 'gramos', precioAproximado: 8.50, esBase: false },
  { id: '2', nombre: 'Arroz integral', categoria: 'Carbohidrato', seccionSupermercado: 'panaderia-cereales', unidadBase: 'gramos', precioAproximado: 2.20, esBase: false },
  { id: '3', nombre: 'Brócoli', categoria: 'Verdura', seccionSupermercado: 'frutas-verduras', unidadBase: 'gramos', precioAproximado: 2.50, esBase: false },
  { id: '4', nombre: 'Huevos', categoria: 'Proteína', seccionSupermercado: 'lacteos-huevos', unidadBase: 'unidades', precioAproximado: 3.20, esBase: false },
  { id: '5', nombre: 'Avena', categoria: 'Cereal', seccionSupermercado: 'panaderia-cereales', unidadBase: 'gramos', precioAproximado: 3.50, esBase: false },
  { id: '6', nombre: 'Quinoa', categoria: 'Cereal', seccionSupermercado: 'panaderia-cereales', unidadBase: 'gramos', precioAproximado: 5.20, esBase: false },
  { id: '7', nombre: 'Lentejas', categoria: 'Legumbre', seccionSupermercado: 'conservas', unidadBase: 'gramos', precioAproximado: 1.80, esBase: false },
  { id: '8', nombre: 'Espinacas', categoria: 'Verdura', seccionSupermercado: 'frutas-verduras', unidadBase: 'gramos', precioAproximado: 2.80, esBase: false },
  { id: '9', nombre: 'Aguacate', categoria: 'Fruta', seccionSupermercado: 'frutas-verduras', unidadBase: 'unidades', precioAproximado: 4.50, esBase: false },
  { id: '10', nombre: 'Tofu', categoria: 'Proteína Vegetal', seccionSupermercado: 'carnes-pescados', unidadBase: 'gramos', precioAproximado: 3.20, esBase: false },
  { id: '11', nombre: 'Salmón', categoria: 'Pescado', seccionSupermercado: 'carnes-pescados', unidadBase: 'gramos', precioAproximado: 15.60, esBase: false },
  { id: '12', nombre: 'Batata', categoria: 'Tubérculo', seccionSupermercado: 'frutas-verduras', unidadBase: 'gramos', precioAproximado: 2.80, esBase: false },
  { id: '13', nombre: 'Arroz blanco', categoria: 'Carbohidrato', seccionSupermercado: 'panaderia-cereales', unidadBase: 'gramos', precioAproximado: 2.00, esBase: false },
  { id: '14', nombre: 'Requesón', categoria: 'Proteína', seccionSupermercado: 'lacteos-huevos', unidadBase: 'gramos', precioAproximado: 2.50, esBase: false },
  { id: '15', nombre: 'Sal', categoria: 'Condimento', seccionSupermercado: 'condimentos-especias', unidadBase: 'paquete', precioAproximado: 0.50, esBase: true },
  { id: '16', nombre: 'Aceite de oliva', categoria: 'Grasa', seccionSupermercado: 'condimentos-especias', unidadBase: 'botella', precioAproximado: 4.50, esBase: true },
  { id: '17', nombre: 'Curry', categoria: 'Especia', seccionSupermercado: 'condimentos-especias', unidadBase: 'paquete', precioAproximado: 1.50, esBase: true },
  { id: '18', nombre: 'Limón', categoria: 'Fruta', seccionSupermercado: 'frutas-verduras', unidadBase: 'kilo', precioAproximado: 2.20, esBase: true },
  { id: '19', nombre: 'Ajo', categoria: 'Verdura', seccionSupermercado: 'frutas-verduras', unidadBase: 'unidad', precioAproximado: 1.50, esBase: true },
  { id: '20', nombre: 'Pimienta negra', categoria: 'Especia', seccionSupermercado: 'condimentos-especias', unidadBase: 'paquete', precioAproximado: 1.20, esBase: true },
];

export async function getIngredientes(): Promise<Ingrediente[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return ingredientesMock;
}

export async function buscarIngredientes(query: string): Promise<Ingrediente[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const queryLower = query.toLowerCase();
  return ingredientesMock.filter(ing => ing.nombre.toLowerCase().includes(queryLower));
}

export async function getIngredientesBase(): Promise<Ingrediente[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return ingredientesMock.filter(ing => ing.esBase);
}

export function organizarPorSecciones(
  ingredientes: IngredienteLista[]
): Record<SeccionSupermercado, IngredienteLista[]> {
  const organizados: Record<SeccionSupermercado, IngredienteLista[]> = {
    'frutas-verduras': [],
    'carnes-pescados': [],
    'lacteos-huevos': [],
    'panaderia-cereales': [],
    'condimentos-especias': [],
    'congelados': [],
    'conservas': [],
    'bebidas': [],
    'limpieza': [],
    'otros': [],
  };

  ingredientes.forEach((ingrediente) => {
    if (organizados[ingrediente.seccion]) {
      organizados[ingrediente.seccion].push(ingrediente);
    } else {
      organizados['otros'].push(ingrediente);
    }
  });

  return organizados;
}

export function getNombreSeccion(seccion: SeccionSupermercado): string {
  const nombres: Record<SeccionSupermercado, string> = {
    'frutas-verduras': 'Frutas y Verduras',
    'carnes-pescados': 'Carnes y Pescados',
    'lacteos-huevos': 'Lácteos y Huevos',
    'panaderia-cereales': 'Panadería y Cereales',
    'condimentos-especias': 'Condimentos y Especias',
    'congelados': 'Congelados',
    'conservas': 'Conservas',
    'bebidas': 'Bebidas',
    'limpieza': 'Limpieza',
    'otros': 'Otros',
  };
  return nombres[seccion] || seccion;
}

