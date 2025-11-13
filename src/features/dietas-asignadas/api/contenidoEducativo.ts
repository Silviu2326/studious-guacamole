import {
  Dieta,
  SugerenciasContenidoEducativo,
  RetoCliente,
  ContenidoEducativo,
  TipoRetoCliente,
  TipoContenidoEducativo,
} from '../types';

// Base de datos de contenido educativo (mock)
const contenidoEducativoMock: ContenidoEducativo[] = [
  {
    id: 'cont-1',
    tipo: 'articulo',
    titulo: 'Cómo mejorar la adherencia a tu plan nutricional',
    descripcion: 'Guía completa con estrategias prácticas para mantener la consistencia en tu alimentación.',
    url: 'https://ejemplo.com/articulos/adherencia-nutricional',
    imagenUrl: 'https://ejemplo.com/imagenes/adherencia.jpg',
    autor: 'Dr. Nutrición',
    fechaPublicacion: '2024-01-15',
    tags: ['adherencia', 'motivación', 'hábitos'],
    relevancia: 95,
    dificultad: 'basico',
    idioma: 'es',
    fuente: 'Blog Nutrición',
  },
  {
    id: 'cont-2',
    tipo: 'video',
    titulo: '5 recetas rápidas y nutritivas para el día a día',
    descripcion: 'Vídeo con recetas fáciles de preparar que te ayudarán a mantener tu plan nutricional.',
    url: 'https://youtube.com/watch?v=ejemplo',
    duracion: 12,
    imagenUrl: 'https://ejemplo.com/imagenes/recetas.jpg',
    autor: 'Chef Nutricional',
    fechaPublicacion: '2024-02-01',
    tags: ['recetas', 'preparación', 'cocina'],
    relevancia: 90,
    dificultad: 'basico',
    idioma: 'es',
    fuente: 'YouTube',
  },
  {
    id: 'cont-3',
    tipo: 'articulo',
    titulo: 'Alimentos procesados vs naturales: Guía completa',
    descripcion: 'Aprende a identificar y reducir el consumo de alimentos ultra-procesados.',
    url: 'https://ejemplo.com/articulos/procesados',
    imagenUrl: 'https://ejemplo.com/imagenes/procesados.jpg',
    autor: 'Nutricionista Experta',
    fechaPublicacion: '2024-01-20',
    tags: ['procesados', 'salud', 'alimentación'],
    relevancia: 88,
    dificultad: 'intermedio',
    idioma: 'es',
    fuente: 'Blog Nutrición',
  },
  {
    id: 'cont-4',
    tipo: 'video',
    titulo: 'Cómo planificar tu compra semanal de forma económica',
    descripcion: 'Tips y estrategias para optimizar tu presupuesto en alimentación saludable.',
    url: 'https://youtube.com/watch?v=compra-economica',
    duracion: 8,
    imagenUrl: 'https://ejemplo.com/imagenes/compra.jpg',
    autor: 'Economía Doméstica',
    fechaPublicacion: '2024-02-10',
    tags: ['coste', 'presupuesto', 'compra'],
    relevancia: 85,
    dificultad: 'basico',
    idioma: 'es',
    fuente: 'YouTube',
  },
  {
    id: 'cont-5',
    tipo: 'infografia',
    titulo: 'Guía de variedad nutricional: Los 7 grupos alimentarios',
    descripcion: 'Infografía visual que explica cómo incluir todos los grupos alimentarios en tu dieta.',
    url: 'https://ejemplo.com/infografias/variedad-nutricional',
    imagenUrl: 'https://ejemplo.com/imagenes/variedad.jpg',
    autor: 'Equipo Nutrición',
    fechaPublicacion: '2024-01-25',
    tags: ['variedad', 'nutrición', 'grupos alimentarios'],
    relevancia: 92,
    dificultad: 'basico',
    idioma: 'es',
    fuente: 'Blog Nutrición',
  },
  {
    id: 'cont-6',
    tipo: 'podcast',
    titulo: 'Mantener la motivación en tu transformación nutricional',
    descripcion: 'Episodio de podcast con consejos y experiencias sobre cómo mantener la motivación a largo plazo.',
    url: 'https://podcast.com/episodio/motivacion',
    duracion: 25,
    imagenUrl: 'https://ejemplo.com/imagenes/podcast.jpg',
    autor: 'Podcast Nutrición',
    fechaPublicacion: '2024-02-05',
    tags: ['motivación', 'psicología', 'hábitos'],
    relevancia: 87,
    dificultad: 'intermedio',
    idioma: 'es',
    fuente: 'Podcast Nutrición',
  },
  {
    id: 'cont-7',
    tipo: 'video',
    titulo: 'Preparación meal prep para toda la semana',
    descripcion: 'Tutorial paso a paso para preparar tus comidas de la semana en 2 horas.',
    url: 'https://youtube.com/watch?v=meal-prep',
    duracion: 15,
    imagenUrl: 'https://ejemplo.com/imagenes/meal-prep.jpg',
    autor: 'Chef Nutricional',
    fechaPublicacion: '2024-02-12',
    tags: ['meal prep', 'preparación', 'organización'],
    relevancia: 89,
    dificultad: 'intermedio',
    idioma: 'es',
    fuente: 'YouTube',
  },
  {
    id: 'cont-8',
    tipo: 'articulo',
    titulo: 'Cómo adaptar tu dieta con restricciones alimentarias',
    descripcion: 'Guía para mantener una nutrición completa cuando tienes alergias o intolerancias.',
    url: 'https://ejemplo.com/articulos/restricciones',
    imagenUrl: 'https://ejemplo.com/imagenes/restricciones.jpg',
    autor: 'Nutricionista Especializada',
    fechaPublicacion: '2024-01-30',
    tags: ['restricciones', 'alergias', 'intolerancias'],
    relevancia: 91,
    dificultad: 'intermedio',
    idioma: 'es',
    fuente: 'Blog Nutrición',
  },
];

// Mapeo de retos a contenido relevante
const mapeoRetosContenido: Record<TipoRetoCliente, string[]> = {
  'adherencia-baja': ['cont-1', 'cont-6'],
  'falta-variedad': ['cont-5'],
  'exceso-procesados': ['cont-3'],
  'coste-alto': ['cont-4'],
  'falta-motivacion': ['cont-1', 'cont-6'],
  'dificultad-preparacion': ['cont-2', 'cont-7'],
  'restricciones-alimentarias': ['cont-8'],
  'objetivos-no-cumplidos': ['cont-1', 'cont-6'],
  'falta-conocimiento-nutricional': ['cont-3', 'cont-5'],
  'horarios-irregulares': ['cont-7'],
  'otro': ['cont-1'],
};

function detectarRetosCliente(dieta: Dieta): RetoCliente[] {
  const retos: RetoCliente[] = [];
  
  // Reto 1: Adherencia baja
  if (dieta.adherencia !== undefined && dieta.adherencia < 70) {
    retos.push({
      id: 'reto-1',
      tipo: 'adherencia-baja',
      titulo: 'Adherencia Baja al Plan',
      descripcion: `La adherencia actual es del ${dieta.adherencia}%, lo cual está por debajo del objetivo recomendado.`,
      severidad: 'alta',
      detectadoEn: new Date().toISOString(),
      evidencias: [`Adherencia del ${dieta.adherencia}% (objetivo: 80%+)`],
      contenidoRecomendado: [],
    });
  }
  
  // Reto 2: Falta de variedad (detectar si hay pocos alimentos únicos)
  const alimentosUnicos = new Set<string>();
  dieta.comidas.forEach((comida) => {
    if (comida.alimentos && comida.alimentos.length > 0) {
      comida.alimentos.forEach((a) => alimentosUnicos.add(a.nombre.toLowerCase()));
    } else {
      alimentosUnicos.add(comida.nombre.toLowerCase());
    }
  });
  
  if (alimentosUnicos.size < 15) {
    retos.push({
      id: 'reto-2',
      tipo: 'falta-variedad',
      titulo: 'Falta de Variedad Nutricional',
      descripcion: `La dieta incluye solo ${alimentosUnicos.size} alimentos únicos. Se recomienda mayor variedad para un perfil nutricional completo.`,
      severidad: 'media',
      detectadoEn: new Date().toISOString(),
      evidencias: [`Solo ${alimentosUnicos.size} alimentos únicos en la dieta`],
      contenidoRecomendado: [],
    });
  }
  
  // Reto 3: Exceso de procesados (simplificado - en producción se usaría análisis más detallado)
  const alimentosUltraProcesados = dieta.comidas.filter((comida) => {
    const nombre = comida.nombre.toLowerCase();
    return nombre.includes('ultra') || nombre.includes('precocinado') || nombre.includes('snack');
  });
  
  if (alimentosUltraProcesados.length > dieta.comidas.length * 0.2) {
    retos.push({
      id: 'reto-3',
      tipo: 'exceso-procesados',
      titulo: 'Exceso de Alimentos Ultra-Procesados',
      descripcion: `Se detectaron ${alimentosUltraProcesados.length} comidas con alimentos ultra-procesados. Se recomienda reducir su consumo.`,
      severidad: 'alta',
      detectadoEn: new Date().toISOString(),
      evidencias: [`${alimentosUltraProcesados.length} comidas con alimentos ultra-procesados`],
      contenidoRecomendado: [],
    });
  }
  
  // Reto 4: Coste alto (si el coste estimado es alto)
  let costeTotal = 0;
  dieta.comidas.forEach((comida) => {
    if (comida.alimentos && comida.alimentos.length > 0) {
      costeTotal += comida.alimentos.reduce((sum, a) => sum + ((a as any).coste || 0), 0);
    } else {
      costeTotal += (comida.calorias / 100) * 0.10; // Estimación
    }
  });
  
  if (costeTotal > 12) {
    retos.push({
      id: 'reto-4',
      tipo: 'coste-alto',
      titulo: 'Coste Diario Elevado',
      descripcion: `El coste diario estimado es de ${costeTotal.toFixed(2)}€, por encima del promedio del mercado.`,
      severidad: 'media',
      detectadoEn: new Date().toISOString(),
      evidencias: [`Coste diario de ${costeTotal.toFixed(2)}€ (promedio: 10€)`],
      contenidoRecomendado: [],
    });
  }
  
  // Reto 5: Dificultad de preparación (si hay muchas comidas sin tiempo de preparación o con tiempo alto)
  const comidasSinTiempo = dieta.comidas.filter((c) => !c.tempoCulinario || c.tempoCulinario === 0);
  const comidasLargas = dieta.comidas.filter((c) => c.tempoCulinario && c.tempoCulinario > 45);
  
  if (comidasSinTiempo.length > dieta.comidas.length * 0.5 || comidasLargas.length > dieta.comidas.length * 0.3) {
    retos.push({
      id: 'reto-5',
      tipo: 'dificultad-preparacion',
      titulo: 'Dificultad en la Preparación',
      descripcion: 'Muchas comidas requieren tiempo de preparación o no tienen instrucciones claras.',
      severidad: 'media',
      detectadoEn: new Date().toISOString(),
      evidencias: [
        `${comidasSinTiempo.length} comidas sin tiempo de preparación definido`,
        `${comidasLargas.length} comidas con tiempo de preparación > 45 min`,
      ],
      contenidoRecomendado: [],
    });
  }
  
  // Asignar contenido recomendado a cada reto
  retos.forEach((reto) => {
    const idsContenido = mapeoRetosContenido[reto.tipo] || [];
    reto.contenidoRecomendado = contenidoEducativoMock
      .filter((c) => idsContenido.includes(c.id))
      .sort((a, b) => b.relevancia - a.relevancia);
  });
  
  return retos;
}

export async function getSugerenciasContenidoEducativo(
  dietaId: string
): Promise<SugerenciasContenidoEducativo | null> {
  // En producción, esto vendría de la API
  // Por ahora, simulamos con datos mock
  
  // Obtener la dieta
  const { getDietas } = await import('./dietas');
  const dietas = await getDietas({});
  const dieta = dietas.find((d) => d.id === dietaId);
  
  if (!dieta) {
    return null;
  }
  
  // Detectar retos del cliente
  const retos = detectarRetosCliente(dieta);
  
  // Obtener contenido prioritario (top 5-10 más relevantes)
  const todosContenidos = retos.flatMap((reto) => reto.contenidoRecomendado);
  const contenidoUnico = Array.from(
    new Map(todosContenidos.map((c) => [c.id, c])).values()
  );
  const contenidoPrioritario = contenidoUnico
    .sort((a, b) => b.relevancia - a.relevancia)
    .slice(0, 10);
  
  // Generar resumen
  const resumen = `Se detectaron ${retos.length} reto(s) principales. Se recomiendan ${contenidoPrioritario.length} contenidos educativos para reforzar la adherencia y mejorar los resultados.`;
  
  return {
    dietaId: dieta.id,
    clienteId: dieta.clienteId,
    retos,
    contenidoPrioritario,
    resumen,
    generadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };
}

