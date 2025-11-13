import {
  Dieta,
  ListaCompra,
  ItemListaCompra,
  FiltrosGeneracionListaCompra,
  AjusteRaciones,
  CategoriaAlimento,
  TipoComida,
  Alimento,
  Comida,
  SugerenciaMealPrep,
  CalculoCosteSemanal,
  PresupuestoCliente,
} from '../types';
import { getDieta } from './dietas';

// Base de datos de categorización de alimentos (simplificado)
const categoriasAlimentos: Record<string, CategoriaAlimento> = {
  // Frutas
  'manzana': 'frutas',
  'plátano': 'frutas',
  'banana': 'frutas',
  'naranja': 'frutas',
  'fresa': 'frutas',
  'frutos rojos': 'frutas',
  'uvas': 'frutas',
  'piña': 'frutas',
  'mango': 'frutas',
  'pera': 'frutas',
  'kiwi': 'frutas',
  'limón': 'frutas',
  'lima': 'frutas',
  'aguacate': 'frutas',
  'tomate': 'frutas',
  
  // Verduras
  'lechuga': 'verduras',
  'espinaca': 'verduras',
  'brócoli': 'verduras',
  'brocoli': 'verduras',
  'zanahoria': 'verduras',
  'pepino': 'verduras',
  'pimiento': 'verduras',
  'cebolla': 'verduras',
  'ajo': 'verduras',
  'calabacín': 'verduras',
  'calabaza': 'verduras',
  'berenjena': 'verduras',
  'apio': 'verduras',
  'col': 'verduras',
  'coliflor': 'verduras',
  'judías verdes': 'verduras',
  'guisantes': 'verduras',
  
  // Proteínas
  'pollo': 'proteinas',
  'pavo': 'proteinas',
  'ternera': 'proteinas',
  'cerdo': 'proteinas',
  'pescado': 'proteinas',
  'salmón': 'proteinas',
  'atún': 'proteinas',
  'huevo': 'proteinas',
  'huevos': 'proteinas',
  'tofu': 'proteinas',
  'seitán': 'proteinas',
  'tempeh': 'proteinas',
  'legumbres': 'proteinas',
  'lentejas': 'proteinas',
  'garbanzos': 'proteinas',
  'judías': 'proteinas',
  'alubias': 'proteinas',
  
  // Carbohidratos
  'arroz': 'carbohidratos',
  'pasta': 'carbohidratos',
  'pan': 'carbohidratos',
  'avena': 'carbohidratos',
  'quinoa': 'carbohidratos',
  'patata': 'carbohidratos',
  'patatas': 'carbohidratos',
  'boniato': 'carbohidratos',
  'batata': 'carbohidratos',
  'maíz': 'carbohidratos',
  'cereales': 'carbohidratos',
  'trigo': 'carbohidratos',
  
  // Lácteos
  'leche': 'lacteos',
  'yogur': 'lacteos',
  'yogurt': 'lacteos',
  'queso': 'lacteos',
  'requesón': 'lacteos',
  'mantequilla': 'lacteos',
  'nata': 'lacteos',
  'crema': 'lacteos',
  
  // Despensa
  'sal': 'despensa',
  'azúcar': 'despensa',
  'harina': 'despensa',
  'levadura': 'despensa',
  'canela': 'despensa',
  'vainilla': 'despensa',
  'cacao': 'despensa',
  'chocolate': 'despensa',
  'miel': 'despensa',
  'almidón': 'despensa',
  'maicena': 'despensa',
  
  // Condimentos
  'pimienta': 'condimentos',
  'orégano': 'condimentos',
  'albahaca': 'condimentos',
  'perejil': 'condimentos',
  'cilantro': 'condimentos',
  'comino': 'condimentos',
  'curry': 'condimentos',
  'pimentón': 'condimentos',
  'cúrcuma': 'condimentos',
  'jengibre': 'condimentos',
  'vinagre': 'condimentos',
  'salsa': 'condimentos',
  'mostaza': 'condimentos',
  
  // Bebidas
  'agua': 'bebidas',
  'zumo': 'bebidas',
  'jugo': 'bebidas',
  'café': 'bebidas',
  'té': 'bebidas',
  'infusión': 'bebidas',
  
  // Frutos secos
  'almendras': 'frutos-secos',
  'nueces': 'frutos-secos',
  'avellanas': 'frutos-secos',
  'cacahuetes': 'frutos-secos',
  'anacardos': 'frutos-secos',
  'pistachos': 'frutos-secos',
  'pipas': 'frutos-secos',
  'semillas': 'frutos-secos',
  
  // Aceites y grasas
  'aceite': 'aceites-grasas',
  'aceite de oliva': 'aceites-grasas',
  'aceite de girasol': 'aceites-grasas',
  'margarina': 'aceites-grasas',
};

// Función para detectar la categoría de un alimento
function detectarCategoriaAlimento(nombre: string): CategoriaAlimento {
  const nombreLower = nombre.toLowerCase().trim();
  
  // Buscar coincidencia exacta
  if (categoriasAlimentos[nombreLower]) {
    return categoriasAlimentos[nombreLower];
  }
  
  // Buscar coincidencia parcial
  for (const [key, categoria] of Object.entries(categoriasAlimentos)) {
    if (nombreLower.includes(key) || key.includes(nombreLower)) {
      return categoria;
    }
  }
  
  // Detección por palabras clave
  if (nombreLower.includes('fruta') || nombreLower.includes('berry')) {
    return 'frutas';
  }
  if (nombreLower.includes('verdura') || nombreLower.includes('vegetal') || nombreLower.includes('hoja')) {
    return 'verduras';
  }
  if (nombreLower.includes('carne') || nombreLower.includes('pollo') || nombreLower.includes('pescado') || nombreLower.includes('huevo') || nombreLower.includes('proteína')) {
    return 'proteinas';
  }
  if (nombreLower.includes('arroz') || nombreLower.includes('pasta') || nombreLower.includes('pan') || nombreLower.includes('cereal') || nombreLower.includes('patata')) {
    return 'carbohidratos';
  }
  if (nombreLower.includes('leche') || nombreLower.includes('queso') || nombreLower.includes('yogur')) {
    return 'lacteos';
  }
  if (nombreLower.includes('aceite') || nombreLower.includes('grasa')) {
    return 'aceites-grasas';
  }
  if (nombreLower.includes('nuez') || nombreLower.includes('almendra') || nombreLower.includes('fruto seco')) {
    return 'frutos-secos';
  }
  
  return 'otros';
}

// Función para obtener comidas filtradas según los filtros
function obtenerComidasFiltradas(
  dieta: Dieta,
  filtros: FiltrosGeneracionListaCompra
): Comida[] {
  let comidas = [...dieta.comidas];
  
  // Filtrar por tipo de comida
  if (filtros.tiposComida && filtros.tiposComida.length > 0) {
    comidas = comidas.filter(c => 
      filtros.tiposComida!.includes(c.tipo)
    );
  }
  
  // Filtrar por semana (si aplica)
  if (filtros.tipoFiltro === 'semana' && filtros.fechaInicio && filtros.fechaFin) {
    // En una implementación real, se filtrarían las comidas por fecha
    // Por ahora, asumimos que todas las comidas están en el rango
  }
  
  return comidas;
}

// Función para extraer ingredientes del nombre de la comida
function extraerIngredientesDelNombre(nombreComida: string): Alimento[] {
  const nombreLower = nombreComida.toLowerCase();
  const ingredientes: Alimento[] = [];
  
  // Palabras clave comunes y sus categorías
  const palabrasClave: Record<string, { nombre: string; cantidad: number; unidad: string }> = {
    'avena': { nombre: 'Avena', cantidad: 50, unidad: 'g' },
    'pollo': { nombre: 'Pollo', cantidad: 150, unidad: 'g' },
    'pescado': { nombre: 'Pescado', cantidad: 150, unidad: 'g' },
    'merluza': { nombre: 'Merluza', cantidad: 150, unidad: 'g' },
    'salmón': { nombre: 'Salmón', cantidad: 150, unidad: 'g' },
    'atún': { nombre: 'Atún', cantidad: 120, unidad: 'g' },
    'arroz': { nombre: 'Arroz', cantidad: 80, unidad: 'g' },
    'pasta': { nombre: 'Pasta', cantidad: 80, unidad: 'g' },
    'patata': { nombre: 'Patata', cantidad: 150, unidad: 'g' },
    'patatas': { nombre: 'Patatas', cantidad: 150, unidad: 'g' },
    'huevo': { nombre: 'Huevo', cantidad: 2, unidad: 'unidades' },
    'huevos': { nombre: 'Huevos', cantidad: 2, unidad: 'unidades' },
    'yogur': { nombre: 'Yogur', cantidad: 200, unidad: 'g' },
    'yogurt': { nombre: 'Yogur', cantidad: 200, unidad: 'g' },
    'fruta': { nombre: 'Fruta', cantidad: 150, unidad: 'g' },
    'frutos secos': { nombre: 'Frutos secos', cantidad: 30, unidad: 'g' },
    'aguacate': { nombre: 'Aguacate', cantidad: 100, unidad: 'g' },
    'verduras': { nombre: 'Verduras', cantidad: 200, unidad: 'g' },
    'ensalada': { nombre: 'Ensalada', cantidad: 150, unidad: 'g' },
    'proteína': { nombre: 'Proteína en polvo', cantidad: 30, unidad: 'g' },
    'proteico': { nombre: 'Proteína en polvo', cantidad: 30, unidad: 'g' },
  };
  
  // Buscar palabras clave en el nombre
  for (const [palabra, info] of Object.entries(palabrasClave)) {
    if (nombreLower.includes(palabra)) {
      ingredientes.push({
        id: `ing-${palabra}-${Date.now()}`,
        nombre: info.nombre,
        cantidad: info.cantidad,
        unidad: info.unidad,
        calorias: 0, // Se calcularían en producción
        proteinas: 0,
        carbohidratos: 0,
        grasas: 0,
      });
    }
  }
  
  return ingredientes;
}

// Función para agrupar alimentos y calcular cantidades
function procesarAlimentos(
  comidas: Comida[],
  multiplicador: number = 1
): ItemListaCompra[] {
  const itemsMap = new Map<string, ItemListaCompra>();
  
  comidas.forEach(comida => {
    // Si la comida tiene alimentos definidos, usarlos
    // Si no, extraer del nombre
    const alimentos = comida.alimentos.length > 0
      ? comida.alimentos
      : extraerIngredientesDelNombre(comida.nombre);
    
    alimentos.forEach(alimento => {
      const key = alimento.nombre.toLowerCase().trim();
      const categoria = detectarCategoriaAlimento(alimento.nombre);
      
      if (itemsMap.has(key)) {
        const itemExistente = itemsMap.get(key)!;
        // Sumar cantidades (asumiendo misma unidad)
        itemExistente.cantidad += alimento.cantidad * multiplicador;
        
        // Agregar origen de la comida
        if (!itemExistente.origenComidas) {
          itemExistente.origenComidas = [];
        }
        itemExistente.origenComidas.push({
          comidaId: comida.id,
          comidaNombre: comida.nombre,
          tipoComida: comida.tipo,
          dia: comida.dia,
        });
      } else {
        const nuevoItem: ItemListaCompra = {
          id: `${alimento.id}-${Date.now()}`,
          nombre: alimento.nombre,
          cantidad: alimento.cantidad * multiplicador,
          unidad: alimento.unidad,
          categoria,
          adquirido: false,
          prioridad: 'media',
          origenComidas: [{
            comidaId: comida.id,
            comidaNombre: comida.nombre,
            tipoComida: comida.tipo,
            dia: comida.dia,
          }],
        };
        itemsMap.set(key, nuevoItem);
      }
    });
  });
  
  return Array.from(itemsMap.values());
}

// Función para agrupar items por categoría
function agruparPorCategoria(items: ItemListaCompra[]): Record<CategoriaAlimento, ItemListaCompra[]> {
  const agrupados: Record<CategoriaAlimento, ItemListaCompra[]> = {
    'frutas': [],
    'verduras': [],
    'proteinas': [],
    'carbohidratos': [],
    'lacteos': [],
    'despensa': [],
    'condimentos': [],
    'bebidas': [],
    'frutos-secos': [],
    'aceites-grasas': [],
    'otros': [],
  };
  
  items.forEach(item => {
    agrupados[item.categoria].push(item);
  });
  
  // Eliminar categorías vacías
  Object.keys(agrupados).forEach(categoria => {
    if (agrupados[categoria as CategoriaAlimento].length === 0) {
      delete agrupados[categoria as CategoriaAlimento];
    }
  });
  
  return agrupados;
}

// API: Generar lista de compra
export async function generarListaCompra(
  filtros: FiltrosGeneracionListaCompra
): Promise<ListaCompra | null> {
  try {
    if (!filtros.dietaId) {
      throw new Error('Se requiere dietaId para generar la lista de compra');
    }
    
    const dieta = await getDieta(filtros.dietaId);
    if (!dieta) {
      throw new Error('Dieta no encontrada');
    }
    
    // Calcular multiplicador según número de personas/raciones
    const numeroPersonas = filtros.numeroPersonas || 1;
    const numeroRaciones = filtros.numeroRaciones || 1;
    const multiplicador = numeroPersonas * numeroRaciones;
    
    // Obtener comidas filtradas
    const comidasFiltradas = obtenerComidasFiltradas(dieta, filtros);
    
    // Procesar alimentos
    const items = procesarAlimentos(comidasFiltradas, multiplicador);
    
    // Agrupar por categoría
    const itemsPorCategoria = agruparPorCategoria(items);
    
    // Contar categorías no vacías
    const totalCategorias = Object.values(itemsPorCategoria).filter(
      cat => cat.length > 0
    ).length;
    
    const listaCompra: ListaCompra = {
      id: `lista-${Date.now()}`,
      clienteId: filtros.clienteId || dieta.clienteId,
      clienteNombre: dieta.clienteNombre,
      dietaId: dieta.id,
      dietaNombre: dieta.nombre,
      filtros: {
        tipoFiltro: filtros.tipoFiltro,
        semanaNumero: filtros.semanaNumero,
        fechaInicio: filtros.fechaInicio,
        fechaFin: filtros.fechaFin,
        tiposComida: filtros.tiposComida,
      },
      itemsPorCategoria,
      items,
      ajustes: {
        numeroPersonas,
        numeroRaciones,
        multiplicador,
      },
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      creadoPor: dieta.creadoPor,
      totalItems: items.length,
      totalCategorias,
    };
    
    // User Story 1: Generar sugerencias de meal prep automáticamente
    listaCompra.sugerenciasMealPrep = generarSugerenciasMealPrep(listaCompra);
    
    // User Story 2: Calcular coste semanal y comparar con presupuesto
    const presupuestoSemanal = dieta.presupuestoSemanal;
    listaCompra.calculoCoste = calcularCosteSemanal(listaCompra, presupuestoSemanal);
    
    return listaCompra;
  } catch (error) {
    console.error('Error generando lista de compra:', error);
    return null;
  }
}

// API: Ajustar lista de compra según número de raciones/personas
export async function ajustarRacionesListaCompra(
  ajuste: AjusteRaciones
): Promise<ListaCompra | null> {
  try {
    // En una implementación real, se obtendría la lista desde la base de datos
    // Por ahora, simulamos que necesitamos regenerar la lista con los nuevos ajustes
    
    // Obtener la lista original (en producción vendría de la BD)
    // Por ahora, retornamos null y el componente deberá regenerar la lista
    
    // Esta función debería:
    // 1. Obtener la lista original
    // 2. Calcular el nuevo multiplicador
    // 3. Aplicar el multiplicador a todas las cantidades
    // 4. Actualizar los ajustes
    
    return null;
  } catch (error) {
    console.error('Error ajustando raciones:', error);
    return null;
  }
}

// Función auxiliar para aplicar multiplicador a una lista existente
export function aplicarMultiplicadorLista(
  listaCompra: ListaCompra,
  multiplicador: number
): ListaCompra {
  const itemsAjustados = listaCompra.items.map(item => ({
    ...item,
    cantidad: item.cantidad * multiplicador,
  }));
  
  const itemsPorCategoriaAjustados: Record<CategoriaAlimento, ItemListaCompra[]> = {} as Record<CategoriaAlimento, ItemListaCompra[]>;
  
  Object.entries(listaCompra.itemsPorCategoria).forEach(([categoria, items]) => {
    itemsPorCategoriaAjustados[categoria as CategoriaAlimento] = items.map(item => ({
      ...item,
      cantidad: item.cantidad * multiplicador,
    }));
  });
  
  const numeroPersonas = listaCompra.ajustes?.numeroPersonas || 1;
  const numeroRaciones = listaCompra.ajustes?.numeroRaciones || 1;
  const nuevoMultiplicador = multiplicador;
  
  return {
    ...listaCompra,
    items: itemsAjustados,
    itemsPorCategoria: itemsPorCategoriaAjustados,
    ajustes: {
      numeroPersonas: Math.round(numeroPersonas * multiplicador),
      numeroRaciones,
      multiplicador: nuevoMultiplicador,
    },
    fechaActualizacion: new Date().toISOString(),
  };
}

// User Story 1: Generar sugerencias de meal prep automáticamente
export function generarSugerenciasMealPrep(listaCompra: ListaCompra): SugerenciaMealPrep[] {
  const sugerencias: SugerenciaMealPrep[] = [];
  
  // Agrupar items por categoría para generar sugerencias
  const proteinas = listaCompra.items.filter(item => 
    item.categoria === 'proteinas' && 
    (item.nombre.toLowerCase().includes('pollo') || 
     item.nombre.toLowerCase().includes('pavo') ||
     item.nombre.toLowerCase().includes('ternera') ||
     item.nombre.toLowerCase().includes('pescado'))
  );
  
  const carbohidratos = listaCompra.items.filter(item => 
    item.categoria === 'carbohidratos' &&
    (item.nombre.toLowerCase().includes('arroz') ||
     item.nombre.toLowerCase().includes('pasta') ||
     item.nombre.toLowerCase().includes('patata'))
  );
  
  // Sugerencia para preparar proteínas el lunes
  if (proteinas.length > 0) {
    const proteinasPrincipales = proteinas.slice(0, 2);
    const cantidadTotal = proteinasPrincipales.reduce((sum, item) => {
      // Calcular raciones aproximadas (asumiendo 150g por ración)
      const raciones = Math.ceil(item.cantidad / 150);
      return sum + raciones;
    }, 0);
    
    if (cantidadTotal > 0) {
      sugerencias.push({
        id: `meal-prep-${Date.now()}-1`,
        listaCompraId: listaCompra.id,
        dia: 'lunes',
        descripcion: `Prepara ${cantidadTotal} raciones de ${proteinasPrincipales.map(p => p.nombre).join(' y ')} el lunes`,
        itemsRelacionados: proteinasPrincipales.map(p => p.id),
        prioridad: 'alta',
        completada: false,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
      });
    }
  }
  
  // Sugerencia para preparar carbohidratos el lunes
  if (carbohidratos.length > 0) {
    const carbosPrincipales = carbohidratos.slice(0, 2);
    const cantidadTotal = carbosPrincipales.reduce((sum, item) => {
      const raciones = Math.ceil(item.cantidad / 200);
      return sum + raciones;
    }, 0);
    
    if (cantidadTotal > 0) {
      sugerencias.push({
        id: `meal-prep-${Date.now()}-2`,
        listaCompraId: listaCompra.id,
        dia: 'lunes',
        descripcion: `Prepara ${cantidadTotal} raciones de ${carbosPrincipales.map(c => c.nombre).join(' y ')} el lunes`,
        itemsRelacionados: carbosPrincipales.map(c => c.id),
        prioridad: 'media',
        completada: false,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
      });
    }
  }
  
  // Sugerencia para cortar verduras el domingo
  const verduras = listaCompra.items.filter(item => item.categoria === 'verduras');
  if (verduras.length > 0) {
    sugerencias.push({
      id: `meal-prep-${Date.now()}-3`,
      listaCompraId: listaCompra.id,
      dia: 'domingo',
      descripcion: `Lava y corta las verduras (${verduras.slice(0, 3).map(v => v.nombre).join(', ')}) el domingo para la semana`,
      itemsRelacionados: verduras.slice(0, 3).map(v => v.id),
      prioridad: 'media',
      completada: false,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    });
  }
  
  return sugerencias;
}

// User Story 1: Añadir sugerencia de meal prep manualmente
export function añadirSugerenciaMealPrep(
  listaCompra: ListaCompra,
  sugerencia: Omit<SugerenciaMealPrep, 'id' | 'listaCompraId' | 'fechaCreacion' | 'fechaActualizacion'>
): ListaCompra {
  const nuevaSugerencia: SugerenciaMealPrep = {
    ...sugerencia,
    id: `meal-prep-${Date.now()}`,
    listaCompraId: listaCompra.id,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
  };
  
  const sugerenciasExistentes = listaCompra.sugerenciasMealPrep || [];
  
  return {
    ...listaCompra,
    sugerenciasMealPrep: [...sugerenciasExistentes, nuevaSugerencia],
    fechaActualizacion: new Date().toISOString(),
  };
}

// User Story 1: Actualizar sugerencia de meal prep
export function actualizarSugerenciaMealPrep(
  listaCompra: ListaCompra,
  sugerenciaId: string,
  actualizacion: Partial<SugerenciaMealPrep>
): ListaCompra {
  const sugerencias = (listaCompra.sugerenciasMealPrep || []).map(sug => 
    sug.id === sugerenciaId
      ? { ...sug, ...actualizacion, fechaActualizacion: new Date().toISOString() }
      : sug
  );
  
  return {
    ...listaCompra,
    sugerenciasMealPrep: sugerencias,
    fechaActualizacion: new Date().toISOString(),
  };
}

// User Story 1: Eliminar sugerencia de meal prep
export function eliminarSugerenciaMealPrep(
  listaCompra: ListaCompra,
  sugerenciaId: string
): ListaCompra {
  const sugerencias = (listaCompra.sugerenciasMealPrep || []).filter(
    sug => sug.id !== sugerenciaId
  );
  
  return {
    ...listaCompra,
    sugerenciasMealPrep: sugerencias,
    fechaActualizacion: new Date().toISOString(),
  };
}

// User Story 2: Base de datos de precios estimados (simplificado)
const preciosEstimados: Record<string, { precioPorUnidad: number; unidad: string }> = {
  'pollo': { precioPorUnidad: 6.5, unidad: 'kg' },
  'pavo': { precioPorUnidad: 7.0, unidad: 'kg' },
  'ternera': { precioPorUnidad: 12.0, unidad: 'kg' },
  'cerdo': { precioPorUnidad: 8.0, unidad: 'kg' },
  'pescado': { precioPorUnidad: 10.0, unidad: 'kg' },
  'salmón': { precioPorUnidad: 15.0, unidad: 'kg' },
  'atún': { precioPorUnidad: 8.0, unidad: 'kg' },
  'huevo': { precioPorUnidad: 0.25, unidad: 'unidades' },
  'huevos': { precioPorUnidad: 0.25, unidad: 'unidades' },
  'arroz': { precioPorUnidad: 1.5, unidad: 'kg' },
  'pasta': { precioPorUnidad: 1.2, unidad: 'kg' },
  'pan': { precioPorUnidad: 2.0, unidad: 'kg' },
  'avena': { precioPorUnidad: 2.5, unidad: 'kg' },
  'quinoa': { precioPorUnidad: 6.0, unidad: 'kg' },
  'patata': { precioPorUnidad: 1.0, unidad: 'kg' },
  'patatas': { precioPorUnidad: 1.0, unidad: 'kg' },
  'leche': { precioPorUnidad: 0.9, unidad: 'l' },
  'yogur': { precioPorUnidad: 0.5, unidad: 'unidades' },
  'yogurt': { precioPorUnidad: 0.5, unidad: 'unidades' },
  'queso': { precioPorUnidad: 8.0, unidad: 'kg' },
  'manzana': { precioPorUnidad: 2.0, unidad: 'kg' },
  'plátano': { precioPorUnidad: 1.8, unidad: 'kg' },
  'banana': { precioPorUnidad: 1.8, unidad: 'kg' },
  'naranja': { precioPorUnidad: 1.5, unidad: 'kg' },
  'aguacate': { precioPorUnidad: 4.0, unidad: 'kg' },
  'lechuga': { precioPorUnidad: 2.5, unidad: 'kg' },
  'espinaca': { precioPorUnidad: 3.0, unidad: 'kg' },
  'brócoli': { precioPorUnidad: 2.8, unidad: 'kg' },
  'brocoli': { precioPorUnidad: 2.8, unidad: 'kg' },
  'zanahoria': { precioPorUnidad: 1.2, unidad: 'kg' },
  'aceite': { precioPorUnidad: 4.0, unidad: 'l' },
  'aceite de oliva': { precioPorUnidad: 5.0, unidad: 'l' },
};

function obtenerPrecioEstimado(nombre: string, unidad: string): number {
  const nombreLower = nombre.toLowerCase().trim();
  
  // Buscar coincidencia exacta
  if (preciosEstimados[nombreLower]) {
    const precio = preciosEstimados[nombreLower];
    // Convertir a la unidad solicitada si es necesario
    if (precio.unidad === unidad) {
      return precio.precioPorUnidad;
    }
    // Conversiones básicas (simplificado)
    if (precio.unidad === 'kg' && unidad === 'g') {
      return precio.precioPorUnidad / 1000;
    }
    if (precio.unidad === 'l' && unidad === 'ml') {
      return precio.precioPorUnidad / 1000;
    }
    return precio.precioPorUnidad;
  }
  
  // Buscar coincidencia parcial
  for (const [key, precio] of Object.entries(preciosEstimados)) {
    if (nombreLower.includes(key) || key.includes(nombreLower)) {
      if (precio.unidad === unidad) {
        return precio.precioPorUnidad;
      }
      // Conversiones básicas
      if (precio.unidad === 'kg' && unidad === 'g') {
        return precio.precioPorUnidad / 1000;
      }
      if (precio.unidad === 'l' && unidad === 'ml') {
        return precio.precioPorUnidad / 1000;
      }
      return precio.precioPorUnidad;
    }
  }
  
  // Precio por defecto si no se encuentra
  return 0.05; // 5 céntimos por unidad por defecto
}

// User Story 2: Calcular coste semanal de la lista de compra
export function calcularCosteSemanal(
  listaCompra: ListaCompra,
  presupuestoSemanal?: number
): CalculoCosteSemanal {
  const itemsConCoste = listaCompra.items.map(item => {
    const costeUnitario = obtenerPrecioEstimado(item.nombre, item.unidad);
    
    // Calcular coste total del item
    let costeTotal = 0;
    if (item.unidad === 'g' || item.unidad === 'ml') {
      // Convertir a kg o l para calcular
      const cantidadEnKg = item.unidad === 'g' ? item.cantidad / 1000 : item.cantidad / 1000;
      const precioPorKg = obtenerPrecioEstimado(item.nombre, item.unidad === 'g' ? 'kg' : 'l');
      costeTotal = cantidadEnKg * precioPorKg;
    } else if (item.unidad === 'kg' || item.unidad === 'l') {
      costeTotal = item.cantidad * costeUnitario;
    } else {
      // Para unidades, asumir que costeUnitario ya está por unidad
      costeTotal = item.cantidad * costeUnitario;
    }
    
    return {
      itemId: item.id,
      nombre: item.nombre,
      cantidad: item.cantidad,
      unidad: item.unidad,
      costeUnitario,
      costeTotal: Math.round(costeTotal * 100) / 100,
    };
  });
  
  const costeTotal = itemsConCoste.reduce((sum, item) => sum + item.costeTotal, 0);
  const costePorDia = costeTotal / 7;
  
  // Calcular comidas promedio (asumiendo 5 comidas por día)
  const costePorComida = costePorDia / 5;
  
  const calculo: CalculoCosteSemanal = {
    costeTotal: Math.round(costeTotal * 100) / 100,
    costePorDia: Math.round(costePorDia * 100) / 100,
    costePorComida: Math.round(costePorComida * 100) / 100,
    itemsConCoste,
  };
  
  // Comparar con presupuesto si está disponible
  if (presupuestoSemanal !== undefined && presupuestoSemanal > 0) {
    const diferencia = costeTotal - presupuestoSemanal;
    const porcentaje = (costeTotal / presupuestoSemanal) * 100;
    const excedePresupuesto = costeTotal > presupuestoSemanal;
    
    calculo.comparacionPresupuesto = {
      presupuesto: presupuestoSemanal,
      diferencia: Math.round(diferencia * 100) / 100,
      porcentaje: Math.round(porcentaje * 100) / 100,
      excedePresupuesto,
    };
  }
  
  return calculo;
}

// User Story 2: Obtener presupuesto del cliente (desde la dieta o por defecto)
export async function obtenerPresupuestoCliente(
  clienteId: string,
  dietaId?: string
): Promise<number | undefined> {
  try {
    if (dietaId) {
      const dieta = await getDieta(dietaId);
      if (dieta && dieta.presupuestoSemanal) {
        return dieta.presupuestoSemanal;
      }
    }
    
    // En producción, aquí se consultaría la base de datos del cliente
    // Por ahora, retornamos undefined para que se pueda configurar manualmente
    return undefined;
  } catch (error) {
    console.error('Error obteniendo presupuesto:', error);
    return undefined;
  }
}

