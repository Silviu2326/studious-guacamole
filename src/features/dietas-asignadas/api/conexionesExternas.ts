import {
  ConexionExterna,
  TipoConexionExterna,
  IngredienteInventario,
  DatosSincronizacionExterna,
  ResultadoActualizacionValores,
  Dieta,
  MacrosNutricionales,
} from '../types';
import { getDieta } from './dietas';

// Mock de conexiones externas - en producción vendría de la API
const conexionesMock: ConexionExterna[] = [
  {
    id: 'conexion-1',
    tipo: 'myfitnesspal',
    nombre: 'MyFitnessPal',
    descripcion: 'Conexión con MyFitnessPal para sincronizar datos nutricionales',
    activa: true,
    sincronizacionAutomatica: true,
    frecuenciaSincronizacion: 'diaria',
    ultimaSincronizacion: '2024-12-20T10:00:00Z',
    ingredientesSincronizados: 150,
    recetasSincronizadas: 45,
    creadoEn: '2024-01-15T10:00:00Z',
    actualizadoEn: '2024-12-20T10:00:00Z',
    creadoPor: 'user-1',
  },
  {
    id: 'conexion-2',
    tipo: 'cronometer',
    nombre: 'Cronometer',
    descripcion: 'Conexión con Cronometer para datos nutricionales precisos',
    activa: true,
    sincronizacionAutomatica: false,
    frecuenciaSincronizacion: 'manual',
    ultimaSincronizacion: '2024-12-19T15:30:00Z',
    ingredientesSincronizados: 200,
    recetasSincronizadas: 30,
    creadoEn: '2024-02-10T10:00:00Z',
    actualizadoEn: '2024-12-19T15:30:00Z',
    creadoPor: 'user-1',
  },
  {
    id: 'conexion-3',
    tipo: 'inventario-ingredientes',
    nombre: 'Mi Inventario',
    descripcion: 'Inventario personal de ingredientes',
    activa: true,
    sincronizacionAutomatica: true,
    frecuenciaSincronizacion: 'diaria',
    ultimaSincronizacion: '2024-12-20T08:00:00Z',
    ingredientesSincronizados: 80,
    creadoEn: '2024-03-20T10:00:00Z',
    actualizadoEn: '2024-12-20T08:00:00Z',
    creadoPor: 'user-1',
  },
];

// Mock de ingredientes del inventario
const ingredientesInventarioMock: IngredienteInventario[] = [
  {
    id: 'ing-1',
    nombre: 'Pechuga de pollo',
    categoria: 'proteínas',
    macros: { calorias: 165, proteinas: 31, carbohidratos: 0, grasas: 3.6 },
    fibra: 0,
    sodio: 74,
    unidadBase: 'g',
    costePorUnidad: 0.012,
    stock: 500,
    stockMinimo: 200,
    creadoEn: '2024-01-15T10:00:00Z',
    actualizadoEn: '2024-12-20T10:00:00Z',
  },
  {
    id: 'ing-2',
    nombre: 'Arroz integral',
    categoria: 'carbohidratos',
    macros: { calorias: 111, proteinas: 2.6, carbohidratos: 23, grasas: 0.9 },
    fibra: 1.8,
    sodio: 5,
    unidadBase: 'g',
    costePorUnidad: 0.003,
    stock: 1000,
    stockMinimo: 500,
    creadoEn: '2024-01-15T10:00:00Z',
    actualizadoEn: '2024-12-20T10:00:00Z',
  },
  {
    id: 'ing-3',
    nombre: 'Brócoli',
    categoria: 'verduras',
    macros: { calorias: 34, proteinas: 2.8, carbohidratos: 7, grasas: 0.4 },
    fibra: 2.6,
    sodio: 33,
    unidadBase: 'g',
    costePorUnidad: 0.002,
    stock: 300,
    stockMinimo: 100,
    creadoEn: '2024-01-15T10:00:00Z',
    actualizadoEn: '2024-12-20T10:00:00Z',
  },
];

/**
 * Obtiene todas las conexiones externas configuradas
 */
export async function getConexionesExternas(): Promise<ConexionExterna[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...conexionesMock];
}

/**
 * Obtiene una conexión externa por ID
 */
export async function getConexionExternaPorId(id: string): Promise<ConexionExterna | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return conexionesMock.find((c) => c.id === id) || null;
}

/**
 * Crea una nueva conexión externa
 */
export async function crearConexionExterna(
  datos: Omit<ConexionExterna, 'id' | 'creadoEn' | 'actualizadoEn'>
): Promise<ConexionExterna> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const nuevaConexion: ConexionExterna = {
    ...datos,
    id: `conexion-${Date.now()}`,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };

  conexionesMock.push(nuevaConexion);
  return nuevaConexion;
}

/**
 * Actualiza una conexión externa
 */
export async function actualizarConexionExterna(
  id: string,
  datos: Partial<ConexionExterna>
): Promise<ConexionExterna | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const conexion = conexionesMock.find((c) => c.id === id);
  if (!conexion) return null;

  Object.assign(conexion, {
    ...datos,
    actualizadoEn: new Date().toISOString(),
  });

  return conexion;
}

/**
 * Elimina una conexión externa
 */
export async function eliminarConexionExterna(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const index = conexionesMock.findIndex((c) => c.id === id);
  if (index === -1) return false;

  conexionesMock.splice(index, 1);
  return true;
}

/**
 * Sincroniza datos desde una conexión externa
 */
export async function sincronizarConexionExterna(
  conexionId: string
): Promise<DatosSincronizacionExterna> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const conexion = conexionesMock.find((c) => c.id === conexionId);
  if (!conexion) {
    throw new Error('Conexión no encontrada');
  }

  // Simular sincronización
  let ingredientes: IngredienteInventario[] = [];
  let macrosActualizados: DatosSincronizacionExterna['macrosActualizados'] = [];

  if (conexion.tipo === 'inventario-ingredientes') {
    ingredientes = [...ingredientesInventarioMock];
  } else if (conexion.tipo === 'myfitnesspal' || conexion.tipo === 'cronometer') {
    // Simular datos de apps externas
    ingredientes = [
      {
        id: 'ext-ing-1',
        nombre: 'Salmón',
        categoria: 'proteínas',
        macros: { calorias: 208, proteinas: 20, carbohidratos: 0, grasas: 12 },
        fibra: 0,
        sodio: 44,
        unidadBase: 'g',
        creadoEn: new Date().toISOString(),
        actualizadoEn: new Date().toISOString(),
      },
      {
        id: 'ext-ing-2',
        nombre: 'Quinoa',
        categoria: 'carbohidratos',
        macros: { calorias: 120, proteinas: 4.4, carbohidratos: 22, grasas: 1.9 },
        fibra: 2.8,
        sodio: 7,
        unidadBase: 'g',
        creadoEn: new Date().toISOString(),
        actualizadoEn: new Date().toISOString(),
      },
    ];

    // Simular macros actualizados desde la app externa
    macrosActualizados = [
      {
        alimentoId: 'alimento-1',
        macros: { calorias: 165, proteinas: 31, carbohidratos: 0, grasas: 3.6 },
        fuente: conexion.tipo,
      },
    ];
  }

  // Actualizar última sincronización
  conexion.ultimaSincronizacion = new Date().toISOString();
  conexion.ingredientesSincronizados = ingredientes.length;

  const resultado: DatosSincronizacionExterna = {
    conexionId,
    tipo: conexion.tipo,
    ingredientes,
    macrosActualizados,
    fechaSincronizacion: new Date().toISOString(),
    exito: true,
    resumen: {
      ingredientesNuevos: Math.floor(Math.random() * 5),
      ingredientesActualizados: Math.floor(Math.random() * 3),
      recetasNuevas: 0,
      recetasActualizadas: 0,
      macrosActualizados: macrosActualizados.length,
    },
  };

  return resultado;
}

/**
 * Obtiene ingredientes del inventario
 */
export async function getIngredientesInventario(): Promise<IngredienteInventario[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...ingredientesInventarioMock];
}

/**
 * Actualiza valores nutricionales de una dieta usando datos de conexiones externas
 */
export async function actualizarValoresConDatosReales(
  dietaId: string,
  conexionId?: string
): Promise<ResultadoActualizacionValores> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const dieta = await getDieta(dietaId);
  if (!dieta) {
    throw new Error('Dieta no encontrada');
  }

  // Obtener datos de la conexión si se especifica
  let macrosActualizados: DatosSincronizacionExterna['macrosActualizados'] = [];
  let fuente = 'inventario';

  if (conexionId) {
    const sincronizacion = await sincronizarConexionExterna(conexionId);
    macrosActualizados = sincronizacion.macrosActualizados || [];
    fuente = sincronizacion.tipo;
  } else {
    // Usar inventario por defecto
    const ingredientes = await getIngredientesInventario();
    macrosActualizados = ingredientes.map((ing) => ({
      alimentoId: ing.id,
      macros: ing.macros,
      fuente: 'inventario',
    }));
  }

  // Calcular macros antes
  const macrosAntes: MacrosNutricionales = dieta.comidas.reduce(
    (acc, comida) => ({
      calorias: acc.calorias + comida.calorias,
      proteinas: acc.proteinas + comida.proteinas,
      carbohidratos: acc.carbohidratos + comida.carbohidratos,
      grasas: acc.grasas + comida.grasas,
    }),
    { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
  );

  // Actualizar valores de alimentos en las comidas
  const alimentosActualizados: ResultadoActualizacionValores['alimentosActualizados'] = [];
  const comidasAfectadas = new Set<string>();

  dieta.comidas.forEach((comida) => {
    comida.alimentos.forEach((alimento) => {
      // Buscar si hay datos actualizados para este alimento
      const datosActualizados = macrosActualizados.find(
        (ma) => ma.alimentoId === alimento.id || ma.alimentoId === alimento.nombre.toLowerCase()
      );

      if (datosActualizados) {
        const valoresAnteriores: MacrosNutricionales = {
          calorias: alimento.calorias,
          proteinas: alimento.proteinas,
          carbohidratos: alimento.carbohidratos,
          grasas: alimento.grasas,
        };

        // Calcular nuevos valores basados en la cantidad
        const factor = alimento.cantidad / 100; // Asumiendo que los macros son por 100g
        const valoresNuevos: MacrosNutricionales = {
          calorias: Math.round(datosActualizados.macros.calorias * factor),
          proteinas: Math.round(datosActualizados.macros.proteinas * factor * 10) / 10,
          carbohidratos: Math.round(datosActualizados.macros.carbohidratos * factor * 10) / 10,
          grasas: Math.round(datosActualizados.macros.grasas * factor * 10) / 10,
        };

        // Actualizar alimento
        alimento.calorias = valoresNuevos.calorias;
        alimento.proteinas = valoresNuevos.proteinas;
        alimento.carbohidratos = valoresNuevos.carbohidratos;
        alimento.grasas = valoresNuevos.grasas;

        // Actualizar comida
        comida.calorias = comida.alimentos.reduce((sum, a) => sum + a.calorias, 0);
        comida.proteinas = comida.alimentos.reduce((sum, a) => sum + a.proteinas, 0);
        comida.carbohidratos = comida.alimentos.reduce((sum, a) => sum + a.carbohidratos, 0);
        comida.grasas = comida.alimentos.reduce((sum, a) => sum + a.grasas, 0);

        alimentosActualizados.push({
          alimentoId: alimento.id,
          nombre: alimento.nombre,
          valoresAnteriores,
          valoresNuevos,
          diferencia: {
            calorias: valoresNuevos.calorias - valoresAnteriores.calorias,
            proteinas: valoresNuevos.proteinas - valoresAnteriores.proteinas,
            carbohidratos: valoresNuevos.carbohidratos - valoresAnteriores.carbohidratos,
            grasas: valoresNuevos.grasas - valoresAnteriores.grasas,
          },
          fuente,
        });

        comidasAfectadas.add(comida.id);
      }
    });
  });

  // Calcular macros después
  const macrosDespues: MacrosNutricionales = dieta.comidas.reduce(
    (acc, comida) => ({
      calorias: acc.calorias + comida.calorias,
      proteinas: acc.proteinas + comida.proteinas,
      carbohidratos: acc.carbohidratos + comida.carbohidratos,
      grasas: acc.grasas + comida.grasas,
    }),
    { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
  );

  // En producción, aquí se guardaría la dieta actualizada
  // await guardarDieta(dieta);

  return {
    dietaId,
    alimentosActualizados,
    comidasAfectadas: Array.from(comidasAfectadas),
    macrosDietaAntes: macrosAntes,
    macrosDietaDespues: macrosDespues,
    fechaActualizacion: new Date().toISOString(),
  };
}

