export type SeccionSupermercado =
  | 'frutas-verduras'
  | 'carnes-pescados'
  | 'lacteos-huevos'
  | 'panaderia-cereales'
  | 'condimentos-especias'
  | 'congelados'
  | 'conservas'
  | 'bebidas'
  | 'limpieza'
  | 'otros';

export interface ListaCompra {
  id: string;
  clienteId: string;
  clienteNombre: string;
  dietaId?: string;
  dietaNombre?: string;
  ingredientes: IngredienteLista[];
  secciones: { nombre: SeccionSupermercado; ingredientes: IngredienteLista[] }[];
  numeroPersonas: number;
  ingredientesBase: IngredienteLista[];
  supermercadoPreferido?: string;
  fechaCreacion: Date;
  fechaUltimaActualizacion: Date;
  recordatoriosActivos: boolean;
  proximoRecordatorio?: Date;
}

export type SeccionSupermercado =
  | 'frutas-verduras'
  | 'carnes-pescados'
  | 'lacteos-huevos'
  | 'panaderia-cereales'
  | 'condimentos-especias'
  | 'congelados'
  | 'conservas'
  | 'bebidas'
  | 'limpieza'
  | 'otros';

export interface IngredienteLista {
  id: string;
  nombre: string;
  cantidad: number;
  unidad: string;
  seccion: SeccionSupermercado;
  categoria: string;
  precioAproximado?: number;
  marcado: boolean;
  ingredienteId?: string;
  recetaId?: string;
  notas?: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  email?: string;
  dietaAsignada?: {
    id: string;
    nombre: string;
    comidas: Comida[];
  };
  numeroPersonasHogar?: number;
  restriccionesAlimentarias?: string[];
  supermercadoPreferido?: string;
}

export interface Comida {
  id: string;
  nombre: string;
  alimentos: AlimentoComida[];
}

export interface AlimentoComida {
  id: string;
  alimentoId: string;
  nombre: string;
  cantidad: number;
  unidad: string;
}

export interface CalculoData {
  ingredientes: IngredienteLista[];
  numeroPersonas: number;
  multiplicador: number;
}

export interface PersonalizacionLista {
  incluirIngredientesBase: boolean;
  organizarPorSeccion: boolean;
  supermercadoPreferido?: string;
  mostrarPrecios: boolean;
  formatoExportacion: 'pdf' | 'email' | 'app' | 'impresion';
}

// Mock data
const listasCompraMock: ListaCompra[] = [
  {
    id: '1',
    clienteId: 'cliente1',
    clienteNombre: 'Juan Pérez',
    dietaId: 'dieta1',
    dietaNombre: 'Plan Déficit Calórico',
    numeroPersonas: 2,
    ingredientes: [
      { id: '1', nombre: 'Pechuga de pollo', cantidad: 1000, unidad: 'gramos', seccion: 'carnes-pescados', categoria: 'Proteína', precioAproximado: 8.50, marcado: false },
      { id: '2', nombre: 'Arroz integral', cantidad: 500, unidad: 'gramos', seccion: 'panaderia-cereales', categoria: 'Carbohidrato', precioAproximado: 2.20, marcado: false },
      { id: '3', nombre: 'Brócoli', cantidad: 500, unidad: 'gramos', seccion: 'frutas-verduras', categoria: 'Verdura', precioAproximado: 2.50, marcado: true },
      { id: '4', nombre: 'Huevos', cantidad: 12, unidad: 'unidades', seccion: 'lacteos-huevos', categoria: 'Proteína', precioAproximado: 3.20, marcado: false },
      { id: '5', nombre: 'Avena', cantidad: 1000, unidad: 'gramos', seccion: 'panaderia-cereales', categoria: 'Cereal', precioAproximado: 3.50, marcado: false },
    ],
    secciones: [],
    ingredientesBase: [
      { id: 'base1', nombre: 'Sal', cantidad: 1, unidad: 'paquete', seccion: 'condimentos-especias', categoria: 'Condimento', precioAproximado: 0.50, marcado: false },
      { id: 'base2', nombre: 'Aceite de oliva', cantidad: 1, unidad: 'botella', seccion: 'condimentos-especias', categoria: 'Grasa', precioAproximado: 4.50, marcado: false },
    ],
    supermercadoPreferido: 'Mercadona',
    fechaCreacion: new Date(Date.now() - 2 * 86400000),
    fechaUltimaActualizacion: new Date(Date.now() - 86400000),
    recordatoriosActivos: true,
    proximoRecordatorio: new Date(Date.now() + 5 * 86400000),
  },
  {
    id: '2',
    clienteId: 'cliente2',
    clienteNombre: 'María González',
    dietaId: 'dieta2',
    dietaNombre: 'Plan Vegetariano',
    numeroPersonas: 1,
    ingredientes: [
      { id: '6', nombre: 'Quinoa', cantidad: 500, unidad: 'gramos', seccion: 'panaderia-cereales', categoria: 'Cereal', precioAproximado: 5.20, marcado: false },
      { id: '7', nombre: 'Lentejas', cantidad: 500, unidad: 'gramos', seccion: 'conservas', categoria: 'Legumbre', precioAproximado: 1.80, marcado: false },
      { id: '8', nombre: 'Espinacas', cantidad: 500, unidad: 'gramos', seccion: 'frutas-verduras', categoria: 'Verdura', precioAproximado: 2.80, marcado: true },
      { id: '9', nombre: 'Aguacate', cantidad: 4, unidad: 'unidades', seccion: 'frutas-verduras', categoria: 'Fruta', precioAproximado: 4.50, marcado: false },
      { id: '10', nombre: 'Tofu', cantidad: 400, unidad: 'gramos', seccion: 'carnes-pescados', categoria: 'Proteína Vegetal', precioAproximado: 3.20, marcado: false },
    ],
    secciones: [],
    ingredientesBase: [
      { id: 'base3', nombre: 'Curry', cantidad: 1, unidad: 'paquete', seccion: 'condimentos-especias', categoria: 'Especia', precioAproximado: 1.50, marcado: false },
      { id: 'base4', nombre: 'Limón', cantidad: 1, unidad: 'kilo', seccion: 'frutas-verduras', categoria: 'Fruta', precioAproximado: 2.20, marcado: false },
    ],
    supermercadoPreferido: 'Carrefour',
    fechaCreacion: new Date(Date.now() - 5 * 86400000),
    fechaUltimaActualizacion: new Date(Date.now() - 2 * 86400000),
    recordatoriosActivos: false,
  },
  {
    id: '3',
    clienteId: 'cliente3',
    clienteNombre: 'Carlos Rodríguez',
    dietaId: 'dieta3',
    dietaNombre: 'Plan Hipercalórico',
    numeroPersonas: 1,
    ingredientes: [
      { id: '11', nombre: 'Salmón', cantidad: 800, unidad: 'gramos', seccion: 'carnes-pescados', categoria: 'Pescado', precioAproximado: 15.60, marcado: false },
      { id: '12', nombre: 'Batata', cantidad: 1000, unidad: 'gramos', seccion: 'frutas-verduras', categoria: 'Tubérculo', precioAproximado: 2.80, marcado: false },
      { id: '13', nombre: 'Aguacate', cantidad: 6, unidad: 'unidades', seccion: 'frutas-verduras', categoria: 'Grasa', precioAproximado: 6.75, marcado: false },
      { id: '14', nombre: 'Arroz blanco', cantidad: 1000, unidad: 'gramos', seccion: 'panaderia-cereales', categoria: 'Carbohidrato', precioAproximado: 2.00, marcado: false },
      { id: '15', nombre: 'Requesón', cantidad: 500, unidad: 'gramos', seccion: 'lacteos-huevos', categoria: 'Proteína', precioAproximado: 2.50, marcado: false },
    ],
    secciones: [],
    ingredientesBase: [
      { id: 'base5', nombre: 'Ajo', cantidad: 1, unidad: 'unidad', seccion: 'frutas-verduras', categoria: 'Verdura', precioAproximado: 1.50, marcado: false },
      { id: 'base6', nombre: 'Pimienta negra', cantidad: 1, unidad: 'paquete', seccion: 'condimentos-especias', categoria: 'Especia', precioAproximado: 1.20, marcado: false },
    ],
    fechaCreacion: new Date(Date.now() - 7 * 86400000),
    fechaUltimaActualizacion: new Date(Date.now() - 3 * 86400000),
    recordatoriosActivos: true,
    proximoRecordatorio: new Date(Date.now() + 7 * 86400000),
  },
];

export async function getListasCompra(clienteId?: string): Promise<ListaCompra[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let resultado = [...listasCompraMock];
  
  if (clienteId) {
    resultado = resultado.filter(lista => lista.clienteId === clienteId);
  }
  
  return resultado;
}

export async function getListaCompra(id: string): Promise<ListaCompra | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return listasCompraMock.find(lista => lista.id === id) || null;
}

export async function generarListaCompra(
  clienteId: string,
  dietaId?: string,
  numeroPersonas?: number
): Promise<ListaCompra | null> {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const nuevaLista: ListaCompra = {
    id: Date.now().toString(),
    clienteId,
    clienteNombre: `Cliente ${clienteId}`,
    dietaId,
    dietaNombre: dietaId ? `Dieta ${dietaId}` : undefined,
    numeroPersonas: numeroPersonas || 1,
    ingredientes: [],
    secciones: [],
    ingredientesBase: [],
    fechaCreacion: new Date(),
    fechaUltimaActualizacion: new Date(),
    recordatoriosActivos: false,
  };
  listasCompraMock.push(nuevaLista);
  return nuevaLista;
}

export async function actualizarListaCompra(
  id: string,
  data: Partial<ListaCompra>
): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = listasCompraMock.findIndex(lista => lista.id === id);
  if (index === -1) return false;
  
  listasCompraMock[index] = {
    ...listasCompraMock[index],
    ...data,
    fechaUltimaActualizacion: new Date(),
  };
  return true;
}

export async function eliminarListaCompra(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = listasCompraMock.findIndex(lista => lista.id === id);
  if (index === -1) return false;
  
  listasCompraMock.splice(index, 1);
  return true;
}

export async function calcularCantidades(
  data: CalculoData
): Promise<IngredienteLista[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return data.ingredientes.map(ing => ({
    ...ing,
    cantidad: ing.cantidad * data.multiplicador,
  }));
}

export async function personalizarLista(
  listaId: string,
  personalizacion: PersonalizacionLista
): Promise<ListaCompra | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = listasCompraMock.findIndex(lista => lista.id === listaId);
  if (index === -1) return null;
  
  const listaActualizada = { ...listasCompraMock[index] };
  
  if (personalizacion.supermercadoPreferido) {
    listaActualizada.supermercadoPreferido = personalizacion.supermercadoPreferido;
  }
  
  listasCompraMock[index] = listaActualizada;
  return listaActualizada;
}

export async function getHistorialListas(clienteId: string): Promise<ListaCompra[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return listasCompraMock.filter(lista => lista.clienteId === clienteId);
}

export async function configurarRecordatorio(
  listaId: string,
  activo: boolean,
  frecuencia?: 'semanal' | 'quincenal' | 'mensual'
): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = listasCompraMock.findIndex(lista => lista.id === listaId);
  if (index === -1) return false;
  
  listasCompraMock[index].recordatoriosActivos = activo;
  if (activo && frecuencia) {
    const dias = frecuencia === 'semanal' ? 7 : frecuencia === 'quincenal' ? 15 : 30;
    listasCompraMock[index].proximoRecordatorio = new Date(Date.now() + dias * 86400000);
  }
  return true;
}

