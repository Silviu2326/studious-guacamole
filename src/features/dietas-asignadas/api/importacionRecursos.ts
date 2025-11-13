import { RecursoBiblioteca, TipoRecurso, MacrosNutricionales, Alimento } from '../types';
import { agregarRecurso } from './recursos';

export interface RecursoImportado {
  nombre: string;
  tipo: TipoRecurso;
  descripcion?: string;
  macros?: MacrosNutricionales;
  imagenUrl?: string;
  enlace?: string;
  datosCSV?: Record<string, any>;
}

/**
 * Parsea un archivo CSV y extrae información de recursos
 */
export async function parsearCSVRecursos(archivo: File): Promise<RecursoImportado[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lineas = text.split('\n').filter(linea => linea.trim());
        
        if (lineas.length < 2) {
          reject(new Error('El CSV debe tener al menos una fila de encabezados y una fila de datos'));
          return;
        }

        const encabezados = lineas[0].split(',').map(h => h.trim().toLowerCase());
        const recursos: RecursoImportado[] = [];

        for (let i = 1; i < lineas.length; i++) {
          const valores = lineas[i].split(',').map(v => v.trim());
          const datos: Record<string, any> = {};

          encabezados.forEach((encabezado, index) => {
            datos[encabezado] = valores[index] || '';
          });

          // Intentar inferir el tipo de recurso
          let tipo: TipoRecurso = 'receta';
          if (datos.tipo) {
            tipo = datos.tipo.toLowerCase() as TipoRecurso;
          }

          // Extraer macros si están disponibles
          let macros: MacrosNutricionales | undefined;
          if (datos.calorias || datos.proteinas || datos.carbohidratos || datos.grasas) {
            macros = {
              calorias: parseFloat(datos.calorias) || 0,
              proteinas: parseFloat(datos.proteinas) || 0,
              carbohidratos: parseFloat(datos.carbohidratos) || 0,
              grasas: parseFloat(datos.grasas) || 0,
            };
          }

          recursos.push({
            nombre: datos.nombre || `Recurso ${i}`,
            tipo,
            descripcion: datos.descripcion,
            macros,
            datosCSV: datos,
          });
        }

        resolve(recursos);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Error leyendo el archivo CSV'));
    reader.readAsText(archivo);
  });
}

/**
 * Importa un recurso desde una URL
 */
export async function importarRecursoDesdeEnlace(
  enlace: string,
  nombre?: string
): Promise<RecursoImportado> {
  // En producción, esto haría una llamada a la API para extraer información del enlace
  // Por ahora, creamos un recurso básico
  return {
    nombre: nombre || 'Recurso importado',
    tipo: 'receta',
    descripcion: `Recurso importado desde: ${enlace}`,
    enlace,
  };
}

/**
 * Importa una imagen y la convierte en un recurso
 */
export async function importarRecursoDesdeImagen(
  archivo: File,
  nombre?: string
): Promise<RecursoImportado> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const imagenUrl = e.target?.result as string;
      resolve({
        nombre: nombre || archivo.name.replace(/\.[^/.]+$/, ''),
        tipo: 'receta',
        descripcion: 'Receta importada desde imagen',
        imagenUrl,
      });
    };

    reader.onerror = () => reject(new Error('Error leyendo la imagen'));
    reader.readAsDataURL(archivo);
  });
}

/**
 * Guarda un recurso importado en la biblioteca
 */
export async function guardarRecursoImportado(
  recurso: RecursoImportado,
  creadoPor?: string
): Promise<RecursoBiblioteca> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const nuevoRecurso: RecursoBiblioteca = {
    id: `importado-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    tipo: recurso.tipo,
    nombre: recurso.nombre,
    descripcion: recurso.descripcion,
    macros: recurso.macros || {
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0,
    },
    imagenUrl: recurso.imagenUrl,
    favorito: false,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
    creadoPor: creadoPor || 'user-import',
    tags: ['Importado'],
  };

  // En producción, esto guardaría en la base de datos
  // Por ahora, lo agregamos al mock
  await agregarRecurso(nuevoRecurso);
  return nuevoRecurso;
}

/**
 * Valida un archivo CSV antes de importarlo
 */
export function validarCSV(archivo: File): { valido: boolean; error?: string } {
  if (!archivo.name.endsWith('.csv')) {
    return { valido: false, error: 'El archivo debe ser un CSV' };
  }

  if (archivo.size > 5 * 1024 * 1024) { // 5MB
    return { valido: false, error: 'El archivo no puede ser mayor a 5MB' };
  }

  return { valido: true };
}

/**
 * Valida una imagen antes de importarla
 */
export function validarImagen(archivo: File): { valido: boolean; error?: string } {
  const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!tiposPermitidos.includes(archivo.type)) {
    return { valido: false, error: 'El archivo debe ser una imagen (JPG, PNG o WEBP)' };
  }

  if (archivo.size > 10 * 1024 * 1024) { // 10MB
    return { valido: false, error: 'La imagen no puede ser mayor a 10MB' };
  }

  return { valido: true };
}

/**
 * Valida una URL antes de importarla
 */
export function validarURL(url: string): { valido: boolean; error?: string } {
  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valido: false, error: 'La URL debe usar HTTP o HTTPS' };
    }
    return { valido: true };
  } catch {
    return { valido: false, error: 'La URL no es válida' };
  }
}

