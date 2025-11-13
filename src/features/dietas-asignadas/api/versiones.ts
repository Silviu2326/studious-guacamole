import {
  VersionPlan,
  ComparacionVersiones,
  OpcionesCrearVersion,
  OpcionesRecuperarVersion,
  Dieta,
} from '../types';
import { getDieta, actualizarDieta, registrarCambioDieta } from './dietas';

// Mock storage para versiones
const versionesMock: VersionPlan[] = [];

/**
 * Crea una nueva versión del plan
 */
export async function crearVersionPlan(
  opciones: OpcionesCrearVersion
): Promise<VersionPlan> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const dieta = await getDieta(opciones.dietaId);
  if (!dieta) {
    throw new Error('Dieta no encontrada');
  }

  // Obtener el número de versión siguiente
  const versionesExistentes = versionesMock.filter(v => v.dietaId === opciones.dietaId);
  const numeroVersion = versionesExistentes.length > 0
    ? Math.max(...versionesExistentes.map(v => v.numeroVersion)) + 1
    : 1;

  // Marcar todas las versiones anteriores como no actuales
  versionesExistentes.forEach(v => {
    v.esVersionActual = false;
  });

  // Crear snapshot de la dieta actual
  const snapshot: Dieta = opciones.incluirSnapshot
    ? JSON.parse(JSON.stringify(dieta)) // Deep copy
    : dieta;

  // Detectar cambios comparando con la versión anterior
  const versionAnterior = versionesExistentes.find(v => v.esVersionActual);
  const cambios = versionAnterior
    ? detectarCambios(versionAnterior.snapshot, dieta)
    : [
        {
          campo: 'creacion',
          valorNuevo: 'Nueva versión inicial',
          descripcion: 'Versión inicial del plan',
        },
      ];

  const nuevaVersion: VersionPlan = {
    id: `version-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    dietaId: opciones.dietaId,
    numeroVersion,
    nombre: opciones.nombre,
    descripcion: opciones.descripcion,
    snapshot,
    cambios,
    creadoEn: new Date().toISOString(),
    creadoPor: 'dietista1', // En producción vendría del contexto de autenticación
    esVersionActual: true,
    etiquetas: opciones.etiquetas || [],
  };

  versionesMock.push(nuevaVersion);
  return nuevaVersion;
}

/**
 * Obtiene todas las versiones de un plan
 */
export async function getVersionesPlan(dietaId: string): Promise<VersionPlan[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return versionesMock
    .filter(v => v.dietaId === dietaId)
    .sort((a, b) => b.numeroVersion - a.numeroVersion);
}

/**
 * Obtiene una versión específica
 */
export async function getVersion(versionId: string): Promise<VersionPlan | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return versionesMock.find(v => v.id === versionId) || null;
}

/**
 * Obtiene la versión actual de un plan
 */
export async function getVersionActual(dietaId: string): Promise<VersionPlan | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return versionesMock.find(v => v.dietaId === dietaId && v.esVersionActual) || null;
}

/**
 * Compara dos versiones de un plan
 */
export async function compararVersiones(
  versionIdOrigen: string,
  versionIdDestino: string
): Promise<ComparacionVersiones> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const versionOrigen = versionesMock.find(v => v.id === versionIdOrigen);
  const versionDestino = versionesMock.find(v => v.id === versionIdDestino);

  if (!versionOrigen || !versionDestino) {
    throw new Error('Una o ambas versiones no encontradas');
  }

  const diferencias = detectarCambios(versionOrigen.snapshot, versionDestino.snapshot);

  const cambiosMacros = diferencias.filter(d => 
    d.campo.includes('calorias') || 
    d.campo.includes('proteinas') || 
    d.campo.includes('carbohidratos') || 
    d.campo.includes('grasas')
  ).length;

  const cambiosComidas = diferencias.filter(d => 
    d.campo.includes('comidas') || 
    d.campo.includes('comida')
  ).length;

  const cambiosOtros = diferencias.length - cambiosMacros - cambiosComidas;

  // Estimar impacto
  let nivelImpacto: 'bajo' | 'medio' | 'alto' = 'bajo';
  let descripcionImpacto = 'Cambios menores sin impacto significativo';

  if (cambiosMacros > 0 || cambiosComidas > 3) {
    nivelImpacto = 'medio';
    descripcionImpacto = 'Cambios moderados que pueden afectar el plan nutricional';
  }

  if (cambiosMacros > 2 || cambiosComidas > 5) {
    nivelImpacto = 'alto';
    descripcionImpacto = 'Cambios significativos que requieren revisión del plan completo';
  }

  return {
    versionOrigen,
    versionDestino,
    diferencias,
    resumen: {
      totalCambios: diferencias.length,
      cambiosMacros,
      cambiosComidas,
      cambiosOtros,
    },
    impactoEstimado: {
      nivel: nivelImpacto,
      descripcion: descripcionImpacto,
    },
  };
}

/**
 * Recupera una versión anterior del plan
 */
export async function recuperarVersion(
  opciones: OpcionesRecuperarVersion
): Promise<Dieta> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const version = versionesMock.find(v => v.id === opciones.versionId);
  if (!version) {
    throw new Error('Versión no encontrada');
  }

  // Si se solicita, crear una nueva versión con el estado actual antes de recuperar
  if (opciones.crearNuevaVersion) {
    const dietaActual = await getDieta(opciones.dietaId);
    if (dietaActual) {
      await crearVersionPlan({
        dietaId: opciones.dietaId,
        nombre: 'Backup antes de recuperar versión',
        descripcion: `Backup automático antes de recuperar versión ${version.numeroVersion}`,
        etiquetas: ['backup', 'auto'],
        incluirSnapshot: true,
      });
    }
  }

  // Restaurar la versión
  const dietaRestaurada = JSON.parse(JSON.stringify(version.snapshot));
  dietaRestaurada.actualizadoEn = new Date().toISOString();

  // Actualizar la dieta en el sistema
  await actualizarDieta(opciones.dietaId, dietaRestaurada);

  // Marcar esta versión como actual
  versionesMock.forEach(v => {
    v.esVersionActual = v.id === opciones.versionId;
  });

  // Registrar el cambio
  registrarCambioDieta(
    opciones.dietaId,
    'otro',
    `Recuperación de versión ${version.numeroVersion}${version.nombre ? `: ${version.nombre}` : ''}`,
    [
      {
        campo: 'version',
        valorAnterior: 'versión actual',
        valorNuevo: `versión ${version.numeroVersion}`,
        descripcion: `Plan recuperado a versión ${version.numeroVersion}`,
      },
    ],
    dietaRestaurada
  );

  return dietaRestaurada;
}

/**
 * Elimina una versión (solo si no es la actual)
 */
export async function eliminarVersion(versionId: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const version = versionesMock.find(v => v.id === versionId);
  if (!version) return false;

  if (version.esVersionActual) {
    throw new Error('No se puede eliminar la versión actual');
  }

  const index = versionesMock.findIndex(v => v.id === versionId);
  if (index === -1) return false;

  versionesMock.splice(index, 1);
  return true;
}

/**
 * Actualiza metadatos de una versión (nombre, descripción, etiquetas)
 */
export async function actualizarVersion(
  versionId: string,
  actualizacion: {
    nombre?: string;
    descripcion?: string;
    etiquetas?: string[];
  }
): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const version = versionesMock.find(v => v.id === versionId);
  if (!version) return false;

  if (actualizacion.nombre !== undefined) {
    version.nombre = actualizacion.nombre;
  }
  if (actualizacion.descripcion !== undefined) {
    version.descripcion = actualizacion.descripcion;
  }
  if (actualizacion.etiquetas !== undefined) {
    version.etiquetas = actualizacion.etiquetas;
  }

  return true;
}

// Función auxiliar para detectar cambios entre dos dietas
function detectarCambios(dietaAnterior: Dieta, dietaNueva: Dieta): Array<{
  campo: string;
  valorAnterior?: any;
  valorNuevo?: any;
  descripcion?: string;
}> {
  const cambios: Array<{
    campo: string;
    valorAnterior?: any;
    valorNuevo?: any;
    descripcion?: string;
  }> = [];

  // Comparar macros
  if (dietaAnterior.macros.calorias !== dietaNueva.macros.calorias) {
    cambios.push({
      campo: 'macros.calorias',
      valorAnterior: dietaAnterior.macros.calorias,
      valorNuevo: dietaNueva.macros.calorias,
      descripcion: `Calorías cambiadas de ${dietaAnterior.macros.calorias} a ${dietaNueva.macros.calorias}`,
    });
  }

  if (dietaAnterior.macros.proteinas !== dietaNueva.macros.proteinas) {
    cambios.push({
      campo: 'macros.proteinas',
      valorAnterior: dietaAnterior.macros.proteinas,
      valorNuevo: dietaNueva.macros.proteinas,
      descripcion: `Proteínas cambiadas de ${dietaAnterior.macros.proteinas}g a ${dietaNueva.macros.proteinas}g`,
    });
  }

  if (dietaAnterior.macros.carbohidratos !== dietaNueva.macros.carbohidratos) {
    cambios.push({
      campo: 'macros.carbohidratos',
      valorAnterior: dietaAnterior.macros.carbohidratos,
      valorNuevo: dietaNueva.macros.carbohidratos,
      descripcion: `Carbohidratos cambiados de ${dietaAnterior.macros.carbohidratos}g a ${dietaNueva.macros.carbohidratos}g`,
    });
  }

  if (dietaAnterior.macros.grasas !== dietaNueva.macros.grasas) {
    cambios.push({
      campo: 'macros.grasas',
      valorAnterior: dietaAnterior.macros.grasas,
      valorNuevo: dietaNueva.macros.grasas,
      descripcion: `Grasas cambiadas de ${dietaAnterior.macros.grasas}g a ${dietaNueva.macros.grasas}g`,
    });
  }

  // Comparar objetivo
  if (dietaAnterior.objetivo !== dietaNueva.objetivo) {
    cambios.push({
      campo: 'objetivo',
      valorAnterior: dietaAnterior.objetivo,
      valorNuevo: dietaNueva.objetivo,
      descripcion: `Objetivo cambiado de ${dietaAnterior.objetivo} a ${dietaNueva.objetivo}`,
    });
  }

  // Comparar número de comidas
  if (dietaAnterior.comidas.length !== dietaNueva.comidas.length) {
    cambios.push({
      campo: 'comidas.cantidad',
      valorAnterior: dietaAnterior.comidas.length,
      valorNuevo: dietaNueva.comidas.length,
      descripcion: `Número de comidas cambiado de ${dietaAnterior.comidas.length} a ${dietaNueva.comidas.length}`,
    });
  }

  // Comparar restricciones
  const restriccionesAnteriores = (dietaAnterior.restricciones || []).sort().join(', ');
  const restriccionesNuevas = (dietaNueva.restricciones || []).sort().join(', ');
  if (restriccionesAnteriores !== restriccionesNuevas) {
    cambios.push({
      campo: 'restricciones',
      valorAnterior: restriccionesAnteriores || 'ninguna',
      valorNuevo: restriccionesNuevas || 'ninguna',
      descripcion: `Restricciones modificadas`,
    });
  }

  return cambios;
}

