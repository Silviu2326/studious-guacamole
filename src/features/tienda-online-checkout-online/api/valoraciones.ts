import { Valoracion, EstadisticasValoraciones } from '../types';

// Mock data para valoraciones usando el tipo Valoracion
const VALORACIONES_MOCK: Valoracion[] = [
  {
    id: 'val-1',
    productoId: 'prod-sesion-individual-60',
    clienteIdOpcional: 'cliente-1',
    nombreMostradoOpcional: 'Juan Pérez',
    rating: 5,
    comentarioOpcional: 'Excelente servicio, muy profesional y adaptado a mis necesidades. Definitivamente lo recomiendo.',
    verificado: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'val-2',
    productoId: 'prod-sesion-individual-60',
    clienteIdOpcional: 'cliente-2',
    nombreMostradoOpcional: 'María García',
    rating: 5,
    comentarioOpcional: 'Increíble experiencia. El entrenador es muy dedicado y los resultados se notan rápidamente.',
    verificado: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'val-3',
    productoId: 'prod-sesion-individual-60',
    clienteIdOpcional: 'cliente-3',
    nombreMostradoOpcional: 'Carlos Rodríguez',
    rating: 4,
    comentarioOpcional: 'Muy buen servicio. La única pega es que a veces es difícil conseguir horario.',
    verificado: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'val-4',
    productoId: 'prod-bono-5-sesiones',
    clienteIdOpcional: 'cliente-4',
    nombreMostradoOpcional: 'Ana López',
    rating: 5,
    comentarioOpcional: 'El bono de 5 sesiones es perfecto. Ahorras dinero y el servicio es excelente.',
    verificado: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'val-5',
    productoId: 'prod-bono-5-sesiones',
    clienteIdOpcional: 'cliente-5',
    nombreMostradoOpcional: 'Pedro Martínez',
    rating: 5,
    comentarioOpcional: 'Muy recomendable. El entrenador personal es muy profesional y te ayuda a alcanzar tus objetivos.',
    verificado: true,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'val-6',
    productoId: 'prod-clase-grupal-funcional',
    clienteIdOpcional: 'cliente-6',
    nombreMostradoOpcional: 'Laura Sánchez',
    rating: 4,
    comentarioOpcional: 'Las clases grupales son muy dinámicas y el ambiente es excelente. Muy buen precio.',
    verificado: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'val-7',
    productoId: 'prod-consulta-nutricional',
    clienteIdOpcional: 'cliente-7',
    nombreMostradoOpcional: 'Miguel Torres',
    rating: 5,
    comentarioOpcional: 'La consulta nutricional fue muy completa. El plan de alimentación está perfectamente adaptado a mis necesidades.',
    verificado: true,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
];

/**
 * Obtiene las valoraciones de un producto
 * @param productoId ID del producto
 * @returns Lista de valoraciones del producto
 */
export async function getValoracionesProducto(
  productoId: string
): Promise<Valoracion[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let valoraciones = VALORACIONES_MOCK.filter(
    (v) => v.productoId === productoId
  );

  // Ordenar por fecha (más recientes primero)
  valoraciones.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return valoraciones;
}

/**
 * Crea una nueva valoración para un producto
 * @param data Datos de la valoración (sin id y createdAt, se generan automáticamente)
 * @returns Promise con la valoración creada
 */
export async function crearValoracion(
  data: Omit<Valoracion, 'id' | 'createdAt'>
): Promise<Valoracion> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Generar ID único
  const nuevoId = `val-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Crear la valoración con el ID y fecha generados
  const nuevaValoracion: Valoracion = {
    ...data,
    id: nuevoId,
    createdAt: new Date(),
  };

  // Agregar a la colección en memoria
  VALORACIONES_MOCK.push(nuevaValoracion);

  return nuevaValoracion;
}

/**
 * Obtiene las estadísticas de valoraciones de un producto
 * @param productoId ID del producto
 * @returns Estadísticas de valoraciones
 */
export async function getEstadisticasValoraciones(
  productoId: string
): Promise<EstadisticasValoraciones> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const valoraciones = VALORACIONES_MOCK.filter(
    (v) => v.productoId === productoId
  );

  if (valoraciones.length === 0) {
    return {
      promedio: 0,
      totalValoraciones: 0,
      distribucion: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    };
  }

  const distribucion = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  let sumaRatings = 0;

  valoraciones.forEach((valoracion) => {
    if (valoracion.rating >= 1 && valoracion.rating <= 5) {
      distribucion[valoracion.rating as keyof typeof distribucion]++;
      sumaRatings += valoracion.rating;
    }
  });

  const promedio = sumaRatings / valoraciones.length;

  return {
    promedio,
    totalValoraciones: valoraciones.length,
    distribucion,
  };
}

/**
 * Obtiene las valoraciones destacadas (rating >= 4) de un producto
 * @param productoId ID del producto
 * @param limite Número máximo de valoraciones a retornar (opcional)
 * @returns Lista de valoraciones destacadas
 */
export async function getValoracionesDestacadas(
  productoId: string,
  limite?: number
): Promise<Valoracion[]> {
  const valoraciones = await getValoracionesProducto(productoId);
  const destacadas = valoraciones.filter((v) => v.rating >= 4);
  
  if (limite) {
    return destacadas.slice(0, limite);
  }
  
  return destacadas;
}

