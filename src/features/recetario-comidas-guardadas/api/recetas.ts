import { Receta, FiltrosRecetas } from '../types';

const API_BASE = '/api/nutricion/recetas';

// Mock data temporal
const recetasMock: Receta[] = [
  {
    id: '1',
    nombre: 'Ensalada de Pollo y Aguacate',
    descripcion: 'Ensalada nutritiva y saciante perfecta para el almuerzo',
    categoria: 'ensalada',
    tipoComida: 'almuerzo',
    dificultad: 'facil',
    tiempoPreparacion: 15,
    porciones: 2,
    ingredientes: [
      {
        id: 'i1',
        nombre: 'Pechuga de pollo',
        cantidad: 200,
        unidad: 'g',
        valorNutricional: {
          calorias: 330,
          proteinas: 62,
          carbohidratos: 0,
          grasas: 7,
        },
      },
      {
        id: 'i2',
        nombre: 'Aguacate',
        cantidad: 1,
        unidad: 'unidad',
        valorNutricional: {
          calorias: 234,
          proteinas: 3,
          carbohidratos: 12,
          grasas: 21,
          fibra: 10,
        },
      },
      {
        id: 'i3',
        nombre: 'Lechuga',
        cantidad: 100,
        unidad: 'g',
      },
      {
        id: 'i4',
        nombre: 'Tomate',
        cantidad: 1,
        unidad: 'unidad mediana',
      },
    ],
    instrucciones: [
      'Cocinar la pechuga de pollo a la plancha hasta que esté dorada',
      'Cortar el aguacate y el tomate en cubos',
      'Mezclar todos los ingredientes con la lechuga',
      'Añadir aliño al gusto',
    ],
    valorNutricional: {
      calorias: 564,
      proteinas: 65,
      carbohidratos: 12,
      grasas: 28,
      fibra: 10,
      sodio: 150,
    },
    caloriasPorPorcion: 282,
    esFavorita: true,
    creadoPor: 'system',
    creadoEn: new Date('2024-01-15'),
    actualizadoEn: new Date('2024-01-15'),
    tags: ['proteico', 'saludable', 'rapido'],
    compartida: true,
    usoCount: 45,
  },
  {
    id: '2',
    nombre: 'Avena con Frutas',
    descripcion: 'Desayuno nutritivo y energético',
    categoria: 'desayuno',
    tipoComida: 'desayuno',
    dificultad: 'facil',
    tiempoPreparacion: 10,
    porciones: 1,
    ingredientes: [
      {
        id: 'i5',
        nombre: 'Avena',
        cantidad: 50,
        unidad: 'g',
        valorNutricional: {
          calorias: 194,
          proteinas: 7,
          carbohidratos: 33,
          grasas: 4,
          fibra: 5,
        },
      },
      {
        id: 'i6',
        nombre: 'Plátano',
        cantidad: 1,
        unidad: 'unidad mediana',
      },
      {
        id: 'i7',
        nombre: 'Arándanos',
        cantidad: 50,
        unidad: 'g',
      },
    ],
    instrucciones: [
      'Cocinar la avena con agua o leche',
      'Cortar el plátano en rodajas',
      'Añadir las frutas a la avena',
      'Endulzar al gusto (opcional)',
    ],
    valorNutricional: {
      calorias: 320,
      proteinas: 10,
      carbohidratos: 55,
      grasas: 6,
      fibra: 8,
    },
    caloriasPorPorcion: 320,
    esFavorita: false,
    creadoPor: 'system',
    creadoEn: new Date('2024-01-10'),
    actualizadoEn: new Date('2024-01-10'),
    tags: ['desayuno', 'carbohidratos', 'fibra'],
    compartida: true,
    usoCount: 78,
  },
];

export async function getRecetas(filtros?: FiltrosRecetas): Promise<Receta[]> {
  try {
    // En producción: const response = await fetch(`${API_BASE}?${new URLSearchParams(filtros as any)}`);
    // return await response.json();
    
    let filtered = [...recetasMock];
    
    if (filtros?.categoria) {
      filtered = filtered.filter(r => r.categoria === filtros.categoria);
    }
    if (filtros?.tipoComida) {
      filtered = filtered.filter(r => r.tipoComida === filtros.tipoComida);
    }
    if (filtros?.dificultad) {
      filtered = filtered.filter(r => r.dificultad === filtros.dificultad);
    }
    if (filtros?.caloriasMin) {
      filtered = filtered.filter(r => r.caloriasPorPorcion >= filtros.caloriasMin!);
    }
    if (filtros?.caloriasMax) {
      filtered = filtered.filter(r => r.caloriasPorPorcion <= filtros.caloriasMax!);
    }
    if (filtros?.tiempoMax) {
      filtered = filtered.filter(r => r.tiempoPreparacion <= filtros.tiempoMax!);
    }
    if (filtros?.texto) {
      const texto = filtros.texto.toLowerCase();
      filtered = filtered.filter(r => 
        r.nombre.toLowerCase().includes(texto) ||
        r.descripcion?.toLowerCase().includes(texto) ||
        r.tags?.some(tag => tag.toLowerCase().includes(texto)) ||
        r.ingredientes.some(i => i.nombre.toLowerCase().includes(texto))
      );
    }
    if (filtros?.favoritas !== undefined) {
      filtered = filtered.filter(r => r.esFavorita === filtros.favoritas);
    }
    if (filtros?.ingredientes && filtros.ingredientes.length > 0) {
      filtered = filtered.filter(r => 
        filtros.ingredientes!.some(ing => 
          r.ingredientes.some(i => i.nombre.toLowerCase().includes(ing.toLowerCase()))
        )
      );
    }
    
    return filtered;
  } catch (error) {
    console.error('Error obteniendo recetas:', error);
    throw error;
  }
}

export async function getReceta(id: string): Promise<Receta | null> {
  try {
    // En producción: const response = await fetch(`${API_BASE}/${id}`);
    // return await response.json();
    
    const receta = recetasMock.find(r => r.id === id);
    return receta || null;
  } catch (error) {
    console.error('Error obteniendo receta:', error);
    throw error;
  }
}

export async function buscarRecetas(query: string, filtros?: FiltrosRecetas): Promise<Receta[]> {
  try {
    // En producción: const response = await fetch(`${API_BASE}/buscar?q=${query}`, { ... });
    
    const recetas = await getRecetas(filtros);
    if (!query) return recetas;
    
    const queryLower = query.toLowerCase();
    return recetas.filter(r => 
      r.nombre.toLowerCase().includes(queryLower) ||
      r.descripcion?.toLowerCase().includes(queryLower) ||
      r.ingredientes.some(i => i.nombre.toLowerCase().includes(queryLower))
    );
  } catch (error) {
    console.error('Error buscando recetas:', error);
    throw error;
  }
}

export async function crearReceta(receta: Omit<Receta, 'id' | 'creadoEn' | 'actualizadoEn' | 'usoCount'>): Promise<Receta> {
  try {
    // En producción: const response = await fetch(API_BASE, { method: 'POST', body: JSON.stringify(receta) });
    
    const nuevaReceta: Receta = {
      ...receta,
      id: Date.now().toString(),
      creadoEn: new Date(),
      actualizadoEn: new Date(),
      usoCount: 0,
    };
    
    recetasMock.push(nuevaReceta);
    return nuevaReceta;
  } catch (error) {
    console.error('Error creando receta:', error);
    throw error;
  }
}

export async function actualizarReceta(id: string, receta: Partial<Receta>): Promise<Receta> {
  try {
    // En producción: const response = await fetch(`${API_BASE}/${id}`, { method: 'PUT', body: JSON.stringify(receta) });
    
    const index = recetasMock.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Receta no encontrada');
    
    const recetaActualizada: Receta = {
      ...recetasMock[index],
      ...receta,
      actualizadoEn: new Date(),
    };
    
    recetasMock[index] = recetaActualizada;
    return recetaActualizada;
  } catch (error) {
    console.error('Error actualizando receta:', error);
    throw error;
  }
}

export async function eliminarReceta(id: string): Promise<boolean> {
  try {
    // En producción: const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    // return response.ok;
    
    const index = recetasMock.findIndex(r => r.id === id);
    if (index === -1) return false;
    
    recetasMock.splice(index, 1);
    return true;
  } catch (error) {
    console.error('Error eliminando receta:', error);
    throw error;
  }
}

export async function compartirReceta(id: string, usuariosIds: string[]): Promise<boolean> {
  try {
    // En producción: const response = await fetch(`${API_BASE}/compartir`, { 
    //   method: 'POST', 
    //   body: JSON.stringify({ recetaId: id, usuariosIds }) 
    // });
    
    const receta = await getReceta(id);
    if (!receta) return false;
    
    await actualizarReceta(id, { compartida: true });
    return true;
  } catch (error) {
    console.error('Error compartiendo receta:', error);
    throw error;
  }
}

