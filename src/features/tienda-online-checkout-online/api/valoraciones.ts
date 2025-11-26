import { ValoracionProducto, EstadisticasValoraciones } from '../types';

// Mock data para valoraciones
const VALORACIONES_MOCK: ValoracionProducto[] = [
  {
    id: 'val-1',
    productoId: '1',
    clienteNombre: 'Juan Pérez',
    clienteEmail: 'juan@example.com',
    rating: 5,
    comentario: 'Excelente servicio, muy profesional y adaptado a mis necesidades. Definitivamente lo recomiendo.',
    fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    verificada: true,
    ventaId: 'VENTA-1',
  },
  {
    id: 'val-2',
    productoId: '1',
    clienteNombre: 'María García',
    clienteEmail: 'maria@example.com',
    rating: 5,
    comentario: 'Increíble experiencia. El entrenador es muy dedicado y los resultados se notan rápidamente.',
    fecha: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    verificada: true,
    ventaId: 'VENTA-2',
  },
  {
    id: 'val-3',
    productoId: '1',
    clienteNombre: 'Carlos Rodríguez',
    clienteEmail: 'carlos@example.com',
    rating: 4,
    comentario: 'Muy buen servicio. La única pega es que a veces es difícil conseguir horario.',
    fecha: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    verificada: true,
  },
  {
    id: 'val-4',
    productoId: '2',
    clienteNombre: 'Ana López',
    clienteEmail: 'ana@example.com',
    rating: 5,
    comentario: 'El bono de 5 sesiones es perfecto. Ahorras dinero y el servicio es excelente.',
    fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    verificada: true,
  },
  {
    id: 'val-5',
    productoId: '2',
    clienteNombre: 'Pedro Martínez',
    clienteEmail: 'pedro@example.com',
    rating: 5,
    comentario: 'Muy recomendable. El entrenador personal es muy profesional y te ayuda a alcanzar tus objetivos.',
    fecha: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    verificada: true,
  },
  {
    id: 'val-6',
    productoId: '4',
    clienteNombre: 'Laura Sánchez',
    clienteEmail: 'laura@example.com',
    rating: 4,
    comentario: 'Las clases grupales son muy dinámicas y el ambiente es excelente. Muy buen precio.',
    fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    verificada: true,
  },
  {
    id: 'val-7',
    productoId: '6',
    clienteNombre: 'Miguel Torres',
    clienteEmail: 'miguel@example.com',
    rating: 5,
    comentario: 'La consulta nutricional fue muy completa. El plan de alimentación está perfectamente adaptado a mis necesidades.',
    fecha: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    verificada: true,
  },
];

/**
 * Obtiene las valoraciones de un producto
 * @param productoId ID del producto
 * @param limite Número máximo de valoraciones a retornar (opcional)
 * @returns Lista de valoraciones del producto
 */
export async function getValoracionesProducto(
  productoId: string,
  limite?: number
): Promise<ValoracionProducto[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let valoraciones = VALORACIONES_MOCK.filter(
    (v) => v.productoId === productoId
  );

  // Ordenar por fecha (más recientes primero)
  valoraciones.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());

  if (limite) {
    valoraciones = valoraciones.slice(0, limite);
  }

  return valoraciones;
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
): Promise<ValoracionProducto[]> {
  const valoraciones = await getValoracionesProducto(productoId, limite);
  return valoraciones.filter((v) => v.rating >= 4);
}

