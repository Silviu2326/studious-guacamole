import { ListaCompra, Receta } from '../types';
import { getRecetas } from './recetas';

const API_BASE = '/api/nutricion/recetas/lista-compra';

export async function generarListaCompra(recetasIds: string[]): Promise<ListaCompra> {
  try {
    // En producción: const response = await fetch(API_BASE, { 
    //   method: 'POST', 
    //   body: JSON.stringify({ recetasIds }) 
    // });
    
    const recetas = await getRecetas();
    const recetasSeleccionadas = recetas.filter(r => recetasIds.includes(r.id));
    
    const ingredientesMap = new Map<string, { cantidad: number; unidad: string; recetas: string[] }>();
    
    recetasSeleccionadas.forEach(receta => {
      receta.ingredientes.forEach(ingrediente => {
        const key = ingrediente.nombre.toLowerCase();
        const existente = ingredientesMap.get(key);
        
        if (existente) {
          if (existente.unidad === ingrediente.unidad) {
            existente.cantidad += ingrediente.cantidad;
            if (!existente.recetas.includes(receta.nombre)) {
              existente.recetas.push(receta.nombre);
            }
          } else {
            // Si las unidades son diferentes, agregar como entrada separada
            ingredientesMap.set(`${key}-${ingrediente.unidad}`, {
              cantidad: ingrediente.cantidad,
              unidad: ingrediente.unidad,
              recetas: [receta.nombre],
            });
          }
        } else {
          ingredientesMap.set(key, {
            cantidad: ingrediente.cantidad,
            unidad: ingrediente.unidad,
            recetas: [receta.nombre],
          });
        }
      });
    });
    
    const ingredientes = Array.from(ingredientesMap.entries()).map(([nombre, data]) => ({
      nombre: nombre.split('-')[0], // Remover sufijo de unidad si existe
      cantidadTotal: data.cantidad,
      unidad: data.unidad,
      recetas: data.recetas,
    }));
    
    return {
      ingredientes,
      fechaCreacion: new Date(),
      recetas: recetasSeleccionadas.map(r => r.nombre),
    };
  } catch (error) {
    console.error('Error generando lista de compra:', error);
    throw error;
  }
}

