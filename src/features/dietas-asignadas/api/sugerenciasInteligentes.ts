import { RecursoBiblioteca, Dieta } from '../types';
import { getListasCompra, IngredienteLista } from '../../lista-de-la-compra-supermercado/api/lista-compra';
import { getRecursos } from './recursos';
import { getPerfilPreferencias } from './preferenciasDietista';
import { analizarCumplimientoRecetas, AnalisisCumplimientoReceta } from './analisisCumplimiento';

export interface SugerenciaInteligente {
  id: string;
  tipo: 'receta-ingredientes-comprados' | 'receta-popular' | 'receta-similar' | 'receta-tendencia';
  titulo: string;
  descripcion: string;
  recurso: RecursoBiblioteca;
  razon: string; // Explicación de por qué se sugiere
  relevancia: number; // 0-100
  ingredientesCoincidentes?: string[]; // Ingredientes que el cliente ya tiene
}

/**
 * Obtiene ingredientes comprados por un cliente (marcados como comprados en listas de compra)
 */
export async function getIngredientesCompradosCliente(clienteId: string): Promise<string[]> {
  try {
    const listas = await getListasCompra(clienteId);
    const ingredientesComprados: string[] = [];

    listas.forEach(lista => {
      lista.ingredientes.forEach(ing => {
        if (ing.marcado && !ingredientesComprados.includes(ing.nombre.toLowerCase())) {
          ingredientesComprados.push(ing.nombre.toLowerCase());
        }
      });
    });

    return ingredientesComprados;
  } catch (error) {
    console.error('Error obteniendo ingredientes comprados:', error);
    return [];
  }
}

/**
 * Busca recetas que contengan ingredientes que el cliente ya compró
 */
function buscarRecetasConIngredientes(
  recursos: RecursoBiblioteca[],
  ingredientesComprados: string[]
): RecursoBiblioteca[] {
  if (ingredientesComprados.length === 0) return [];

  return recursos
    .filter(recurso => recurso.tipo === 'receta')
    .map(recurso => {
      // Buscar coincidencias en los alimentos de la receta
      const alimentos = recurso.alimentos || [];
      const ingredientesReceta = alimentos.map(a => a.nombre.toLowerCase());
      
      const coincidencias = ingredientesComprados.filter(ingComprado =>
        ingredientesReceta.some(ingReceta =>
          ingReceta.includes(ingComprado) || ingComprado.includes(ingReceta)
        )
      );

      return {
        recurso,
        coincidencias,
        porcentajeCoincidencia: (coincidencias.length / Math.max(ingredientesReceta.length, 1)) * 100,
      };
    })
    .filter(item => item.coincidencias.length > 0)
    .sort((a, b) => b.porcentajeCoincidencia - a.porcentajeCoincidencia)
    .slice(0, 5)
    .map(item => item.recurso);
}

/**
 * Obtiene sugerencias inteligentes para un cliente
 */
export async function getSugerenciasInteligentes(
  clienteId?: string,
  dietistaId?: string,
  dietaId?: string
): Promise<SugerenciaInteligente[]> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const sugerencias: SugerenciaInteligente[] = [];
  const todosRecursos = await getRecursos();
  
  // Obtener perfil de preferencias del dietista si está disponible
  let perfilPreferencias = null;
  if (dietistaId) {
    perfilPreferencias = await getPerfilPreferencias(dietistaId);
  }

  // Si hay un clienteId, buscar recetas con ingredientes que ya compró
  if (clienteId) {
    const ingredientesComprados = await getIngredientesCompradosCliente(clienteId);
    
    if (ingredientesComprados.length > 0) {
      const recetasConIngredientes = buscarRecetasConIngredientes(
        todosRecursos,
        ingredientesComprados
      );

      recetasConIngredientes.forEach((receta, index) => {
        const alimentos = receta.alimentos || [];
        const ingredientesReceta = alimentos.map(a => a.nombre.toLowerCase());
        const coincidencias = ingredientesComprados.filter(ingComprado =>
          ingredientesReceta.some(ingReceta =>
            ingReceta.includes(ingComprado) || ingComprado.includes(ingReceta)
          )
        );

        sugerencias.push({
          id: `sug-${receta.id}-${index}`,
          tipo: 'receta-ingredientes-comprados',
          titulo: `Recetas con ingredientes que ya compraste`,
          descripcion: `${receta.nombre} - Usa ingredientes que ya tienes`,
          recurso: receta,
          razon: `Esta receta utiliza ${coincidencias.length} ingrediente(s) que ya compraste: ${coincidencias.slice(0, 3).join(', ')}`,
          relevancia: Math.min(90, 60 + coincidencias.length * 10),
          ingredientesCoincidentes: coincidencias,
        });
      });
    }
  }

  // Agregar recetas populares si no hay suficientes sugerencias
  if (sugerencias.length < 3) {
    const recetasPopulares = todosRecursos
      .filter(r => r.tipo === 'receta')
      .slice(0, 3 - sugerencias.length);

    recetasPopulares.forEach((receta, index) => {
      sugerencias.push({
        id: `sug-popular-${receta.id}-${index}`,
        tipo: 'receta-popular',
        titulo: 'Recetas populares',
        descripcion: receta.nombre,
        recurso: receta,
        razon: 'Receta popular entre nuestros usuarios',
        relevancia: 70,
      });
    });
  }

  // Aplicar preferencias del dietista si están disponibles
  let sugerenciasFiltradas = sugerencias;
  
  if (perfilPreferencias) {
    // Aumentar relevancia de recursos aceptados frecuentemente
    sugerenciasFiltradas = sugerencias.map(sug => {
      let relevanciaAjustada = sug.relevancia;
      
      if (perfilPreferencias!.preferencias.recursosAceptados.includes(sug.recurso.id)) {
        relevanciaAjustada += 20; // Aumentar relevancia de recursos aceptados
      }
      
      if (perfilPreferencias!.preferencias.recursosRechazados.includes(sug.recurso.id)) {
        relevanciaAjustada -= 30; // Reducir relevancia de recursos rechazados
      }
      
      // Preferir tipos de recurso que el dietista acepta más
      const tipoAceptaciones = perfilPreferencias!.patrones.aceptacionesPorTipo[sug.recurso.tipo] || 0;
      const tipoRechazos = perfilPreferencias!.patrones.rechazosPorTipo[sug.recurso.tipo] || 0;
      
      if (tipoAceptaciones > tipoRechazos) {
        relevanciaAjustada += 10;
      } else if (tipoRechazos > tipoAceptaciones) {
        relevanciaAjustada -= 15;
      }
      
      return {
        ...sug,
        relevancia: Math.max(0, Math.min(100, relevanciaAjustada)),
      };
    });
    
    // Filtrar recursos rechazados frecuentemente (solo si hay muchas sugerencias)
    if (sugerenciasFiltradas.length > 5) {
      sugerenciasFiltradas = sugerenciasFiltradas.filter(
        sug => !perfilPreferencias!.preferencias.recursosRechazados.includes(sug.recurso.id)
      );
    }
  }

  // USER STORY 1: Analizar historial del cliente para priorizar recetas con mayor probabilidad de cumplimiento
  if (clienteId && dietaId) {
    try {
      const recursosParaAnalizar = sugerenciasFiltradas.map(s => s.recurso);
      const analisisCumplimiento = await analizarCumplimientoRecetas(
        clienteId,
        dietaId,
        recursosParaAnalizar
      );

      // Crear un mapa de probabilidad de cumplimiento por recurso
      const mapaCumplimiento = new Map<string, AnalisisCumplimientoReceta>();
      analisisCumplimiento.forEach(analisis => {
        mapaCumplimiento.set(analisis.recursoId, analisis);
      });

      // Ajustar relevancia basada en probabilidad de cumplimiento
      sugerenciasFiltradas = sugerenciasFiltradas.map(sug => {
        const analisis = mapaCumplimiento.get(sug.recurso.id);
        if (analisis) {
          // Combinar relevancia original con probabilidad de cumplimiento
          // 60% relevancia original, 40% probabilidad de cumplimiento
          const relevanciaCombinada = (sug.relevancia * 0.6) + (analisis.probabilidadCumplimiento * 0.4);
          
          return {
            ...sug,
            relevancia: Math.round(relevanciaCombinada),
            // Agregar información de cumplimiento a la razón
            razon: `${sug.razon} | Probabilidad de cumplimiento: ${analisis.probabilidadCumplimiento}%`,
          };
        }
        return sug;
      });

      // Reordenar por relevancia combinada
      sugerenciasFiltradas.sort((a, b) => b.relevancia - a.relevancia);
    } catch (error) {
      console.error('Error analizando cumplimiento:', error);
      // Continuar sin el análisis si hay error
    }
  }

  // Ordenar por relevancia y limitar a 5
  return sugerenciasFiltradas
    .sort((a, b) => b.relevancia - a.relevancia)
    .slice(0, 5);
}

