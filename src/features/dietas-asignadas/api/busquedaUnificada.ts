import { getPlantillas, FiltrosPlantillas } from '../../plantillas-de-dieta/api/plantillas';
import { buscarRecetas, getRecetas } from '../../recetario-comidas-guardadas/api/recetas';
import { PlantillaDieta } from '../../plantillas-de-dieta/types';
import { Receta } from '../../recetario-comidas-guardadas/types';

// Tipos para recursos de búsqueda
export type TipoRecurso = 'plantilla' | 'receta' | 'alimento' | 'bloque' | 'snack';

export interface ResultadoBusqueda {
  id: string;
  tipo: TipoRecurso;
  titulo: string;
  descripcion?: string;
  metadata?: {
    calorias?: number;
    proteinas?: number;
    carbohidratos?: number;
    grasas?: number;
    categoria?: string;
    tags?: string[];
    [key: string]: any;
  };
  relevancia: number; // 0-100, para ordenar resultados
}

// Mock de alimentos
const alimentosMock = [
  { id: 'a1', nombre: 'Pechuga de pollo', calorias: 165, proteinas: 31, carbohidratos: 0, grasas: 3.6, categoria: 'proteina' },
  { id: 'a2', nombre: 'Salmón', calorias: 208, proteinas: 20, carbohidratos: 0, grasas: 12, categoria: 'proteina' },
  { id: 'a3', nombre: 'Arroz integral', calorias: 111, proteinas: 2.6, carbohidratos: 23, grasas: 0.9, categoria: 'carbohidrato' },
  { id: 'a4', nombre: 'Avena', calorias: 389, proteinas: 17, carbohidratos: 66, grasas: 7, categoria: 'carbohidrato' },
  { id: 'a5', nombre: 'Aguacate', calorias: 160, proteinas: 2, carbohidratos: 9, grasas: 15, categoria: 'grasa' },
  { id: 'a6', nombre: 'Almendras', calorias: 579, proteinas: 21, carbohidratos: 22, grasas: 50, categoria: 'grasa' },
  { id: 'a7', nombre: 'Plátano', calorias: 89, proteinas: 1.1, carbohidratos: 23, grasas: 0.3, categoria: 'fruta' },
  { id: 'a8', nombre: 'Brócoli', calorias: 34, proteinas: 2.8, carbohidratos: 7, grasas: 0.4, categoria: 'verdura' },
  { id: 'a9', nombre: 'Huevo', calorias: 155, proteinas: 13, carbohidratos: 1.1, grasas: 11, categoria: 'proteina' },
  { id: 'a10', nombre: 'Quinoa', calorias: 368, proteinas: 14, carbohidratos: 64, grasas: 6, categoria: 'carbohidrato' },
];

// Mock de bloques
const bloquesMock = [
  { id: 'b1', nombre: 'Desayuno rápido 400 kcal', descripcion: 'Desayuno completo y rápido', calorias: 400, proteinas: 25, carbohidratos: 45, grasas: 12, tipo: 'desayuno' },
  { id: 'b2', nombre: 'Comida alta en proteína', descripcion: 'Comida principal rica en proteínas', calorias: 550, proteinas: 50, carbohidratos: 50, grasas: 15, tipo: 'almuerzo' },
  { id: 'b3', nombre: 'Cena ligera', descripcion: 'Cena ligera y nutritiva', calorias: 350, proteinas: 30, carbohidratos: 30, grasas: 12, tipo: 'cena' },
  { id: 'b4', nombre: 'Snack post-entreno', descripcion: 'Recuperación post-entrenamiento', calorias: 280, proteinas: 25, carbohidratos: 35, grasas: 5, tipo: 'post-entreno' },
  { id: 'b5', nombre: 'Merienda saludable', descripcion: 'Merienda equilibrada', calorias: 200, proteinas: 10, carbohidratos: 25, grasas: 8, tipo: 'merienda' },
];

// Mock de snacks
const snacksMock = [
  { id: 's1', nombre: 'Yogur griego con frutos rojos', descripcion: 'Snack proteico y antioxidante', calorias: 150, proteinas: 15, carbohidratos: 15, grasas: 3, categoria: 'proteico' },
  { id: 's2', nombre: 'Frutos secos mixtos', descripcion: 'Energía y grasas saludables', calorias: 200, proteinas: 6, carbohidratos: 8, grasas: 16, categoria: 'grasa' },
  { id: 's3', nombre: 'Batido de proteína', descripcion: 'Recuperación rápida', calorias: 180, proteinas: 25, carbohidratos: 10, grasas: 3, categoria: 'proteico' },
  { id: 's4', nombre: 'Manzana con mantequilla de almendras', descripcion: 'Combinación equilibrada', calorias: 220, proteinas: 8, carbohidratos: 25, grasas: 12, categoria: 'balanceado' },
  { id: 's5', nombre: 'Barrita energética casera', descripcion: 'Energía sostenida', calorias: 190, proteinas: 5, carbohidratos: 28, grasas: 7, categoria: 'energetico' },
];

/**
 * Busca en todos los recursos (plantillas, recetas, alimentos, bloques, snacks)
 */
export async function buscarRecursosUnificada(
  query: string,
  filtros?: {
    tipos?: TipoRecurso[];
    categoria?: string;
    caloriasMin?: number;
    caloriasMax?: number;
  }
): Promise<ResultadoBusqueda[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const queryLower = query.toLowerCase().trim();
  const resultados: ResultadoBusqueda[] = [];

  // Buscar en plantillas
  if (!filtros?.tipos || filtros.tipos.includes('plantilla')) {
    try {
      const plantillas = await getPlantillas();
      const plantillasFiltradas = plantillas.filter(p => {
        const matchNombre = p.nombre.toLowerCase().includes(queryLower);
        const matchDescripcion = p.descripcion?.toLowerCase().includes(queryLower);
        const matchTags = p.tags?.some(tag => tag.toLowerCase().includes(queryLower));
        const matchCategoria = !filtros?.categoria || p.categoria === filtros.categoria;
        const matchCalorias = (!filtros?.caloriasMin || p.calorias >= filtros.caloriasMin) &&
                              (!filtros?.caloriasMax || p.calorias <= filtros.caloriasMax);
        
        return (matchNombre || matchDescripcion || matchTags) && matchCategoria && matchCalorias;
      });

      plantillasFiltradas.forEach(p => {
        const relevancia = calcularRelevancia(queryLower, p.nombre, p.descripcion, p.tags);
        resultados.push({
          id: p.id,
          tipo: 'plantilla',
          titulo: p.nombre,
          descripcion: p.descripcion,
          metadata: {
            calorias: p.calorias,
            proteinas: p.macros.proteinas,
            carbohidratos: p.macros.carbohidratos,
            grasas: p.macros.grasas,
            categoria: p.categoria,
            tags: p.tags,
          },
          relevancia,
        });
      });
    } catch (error) {
      console.error('Error buscando plantillas:', error);
    }
  }

  // Buscar en recetas
  if (!filtros?.tipos || filtros.tipos.includes('receta')) {
    try {
      const recetas = await buscarRecetas(query);
      const recetasFiltradas = recetas.filter(r => {
        const matchCategoria = !filtros?.categoria || r.categoria === filtros.categoria;
        const matchCalorias = (!filtros?.caloriasMin || r.caloriasPorPorcion >= filtros.caloriasMin) &&
                              (!filtros?.caloriasMax || r.caloriasPorPorcion <= filtros.caloriasMax);
        return matchCategoria && matchCalorias;
      });

      recetasFiltradas.forEach(r => {
        const relevancia = calcularRelevancia(queryLower, r.nombre, r.descripcion, r.tags);
        resultados.push({
          id: r.id,
          tipo: 'receta',
          titulo: r.nombre,
          descripcion: r.descripcion,
          metadata: {
            calorias: r.caloriasPorPorcion,
            proteinas: r.valorNutricional.proteinas,
            carbohidratos: r.valorNutricional.carbohidratos,
            grasas: r.valorNutricional.grasas,
            categoria: r.categoria,
            tags: r.tags,
            tiempoPreparacion: r.tiempoPreparacion,
          },
          relevancia,
        });
      });
    } catch (error) {
      console.error('Error buscando recetas:', error);
    }
  }

  // Buscar en alimentos
  if (!filtros?.tipos || filtros.tipos.includes('alimento')) {
    const alimentosFiltrados = alimentosMock.filter(a => {
      const matchNombre = a.nombre.toLowerCase().includes(queryLower);
      const matchCategoria = !filtros?.categoria || a.categoria === filtros.categoria;
      return matchNombre && matchCategoria;
    });

    alimentosFiltrados.forEach(a => {
      const relevancia = calcularRelevancia(queryLower, a.nombre);
      resultados.push({
        id: a.id,
        tipo: 'alimento',
        titulo: a.nombre,
        descripcion: `Alimento - ${a.categoria}`,
        metadata: {
          calorias: a.calorias,
          proteinas: a.proteinas,
          carbohidratos: a.carbohidratos,
          grasas: a.grasas,
          categoria: a.categoria,
        },
        relevancia,
      });
    });
  }

  // Buscar en bloques
  if (!filtros?.tipos || filtros.tipos.includes('bloque')) {
    const bloquesFiltrados = bloquesMock.filter(b => {
      const matchNombre = b.nombre.toLowerCase().includes(queryLower);
      const matchDescripcion = b.descripcion?.toLowerCase().includes(queryLower);
      const matchCategoria = !filtros?.categoria || b.tipo === filtros.categoria;
      const matchCalorias = (!filtros?.caloriasMin || b.calorias >= filtros.caloriasMin) &&
                            (!filtros?.caloriasMax || b.calorias <= filtros.caloriasMax);
      return (matchNombre || matchDescripcion) && matchCategoria && matchCalorias;
    });

    bloquesFiltrados.forEach(b => {
      const relevancia = calcularRelevancia(queryLower, b.nombre, b.descripcion);
      resultados.push({
        id: b.id,
        tipo: 'bloque',
        titulo: b.nombre,
        descripcion: b.descripcion,
        metadata: {
          calorias: b.calorias,
          proteinas: b.proteinas,
          carbohidratos: b.carbohidratos,
          grasas: b.grasas,
          categoria: b.tipo,
        },
        relevancia,
      });
    });
  }

  // Buscar en snacks
  if (!filtros?.tipos || filtros.tipos.includes('snack')) {
    const snacksFiltrados = snacksMock.filter(s => {
      const matchNombre = s.nombre.toLowerCase().includes(queryLower);
      const matchDescripcion = s.descripcion?.toLowerCase().includes(queryLower);
      const matchCategoria = !filtros?.categoria || s.categoria === filtros.categoria;
      const matchCalorias = (!filtros?.caloriasMin || s.calorias >= filtros.caloriasMin) &&
                            (!filtros?.caloriasMax || s.calorias <= filtros.caloriasMax);
      return (matchNombre || matchDescripcion) && matchCategoria && matchCalorias;
    });

    snacksFiltrados.forEach(s => {
      const relevancia = calcularRelevancia(queryLower, s.nombre, s.descripcion);
      resultados.push({
        id: s.id,
        tipo: 'snack',
        titulo: s.nombre,
        descripcion: s.descripcion,
        metadata: {
          calorias: s.calorias,
          proteinas: s.proteinas,
          carbohidratos: s.carbohidratos,
          grasas: s.grasas,
          categoria: s.categoria,
        },
        relevancia,
      });
    });
  }

  // Ordenar por relevancia (mayor a menor)
  return resultados.sort((a, b) => b.relevancia - a.relevancia);
}

/**
 * Calcula la relevancia de un resultado basado en la query
 */
function calcularRelevancia(
  query: string,
  titulo: string,
  descripcion?: string,
  tags?: string[]
): number {
  let relevancia = 0;
  const tituloLower = titulo.toLowerCase();
  const descripcionLower = descripcion?.toLowerCase() || '';

  // Coincidencia exacta en título: 100 puntos
  if (tituloLower === query) {
    relevancia += 100;
  }
  // Título comienza con query: 80 puntos
  else if (tituloLower.startsWith(query)) {
    relevancia += 80;
  }
  // Título contiene query: 60 puntos
  else if (tituloLower.includes(query)) {
    relevancia += 60;
  }

  // Descripción contiene query: 30 puntos
  if (descripcionLower.includes(query)) {
    relevancia += 30;
  }

  // Tags contienen query: 20 puntos por tag
  if (tags) {
    tags.forEach(tag => {
      if (tag.toLowerCase().includes(query)) {
        relevancia += 20;
      }
    });
  }

  return Math.min(relevancia, 100);
}

/**
 * Obtiene estadísticas de búsqueda (cuántos resultados hay por tipo)
 */
export async function obtenerEstadisticasBusqueda(query: string): Promise<Record<TipoRecurso, number>> {
  const resultados = await buscarRecursosUnificada(query);
  
  const estadisticas: Record<TipoRecurso, number> = {
    plantilla: 0,
    receta: 0,
    alimento: 0,
    bloque: 0,
    snack: 0,
  };

  resultados.forEach(r => {
    estadisticas[r.tipo]++;
  });

  return estadisticas;
}

