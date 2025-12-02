import { TipoRestriccion, SeveridadRestriccion, FormularioRestriccion } from '../types';

// Validaciones para formularios
export const validarFormularioRestriccion = (datos: Partial<FormularioRestriccion>): string[] => {
  const errores: string[] = [];

  if (!datos.tipo) {
    errores.push('El tipo de restricción es obligatorio');
  }

  if (!datos.nombre || datos.nombre.trim().length === 0) {
    errores.push('El nombre de la restricción es obligatorio');
  }

  if (!datos.severidad) {
    errores.push('La severidad es obligatoria');
  }

  if (!datos.ingredientesProhibidos || datos.ingredientesProhibidos.length === 0) {
    errores.push('Debe especificar al menos un ingrediente prohibido');
  }

  if (datos.ingredientesProhibidos) {
    const ingredientesVacios = datos.ingredientesProhibidos.some(ing => !ing.trim());
    if (ingredientesVacios) {
      errores.push('Los ingredientes prohibidos no pueden estar vacíos');
    }
  }

  return errores;
};

// Utilidades para tipos de restricción
export const obtenerTiposRestriccion = (): Array<{ value: TipoRestriccion; label: string; descripcion: string }> => [
  {
    value: 'alergia',
    label: 'Alergia',
    descripcion: 'Reacción inmunológica adversa a un alimento específico'
  },
  {
    value: 'intolerancia',
    label: 'Intolerancia',
    descripcion: 'Dificultad para digerir ciertos alimentos'
  },
  {
    value: 'religiosa',
    label: 'Religiosa',
    descripcion: 'Restricciones basadas en creencias religiosas'
  },
  {
    value: 'cultural',
    label: 'Cultural',
    descripcion: 'Preferencias alimentarias culturales o éticas'
  }
];

export const obtenerSeveridades = (): Array<{ value: SeveridadRestriccion; label: string; descripcion: string; color: string }> => [
  {
    value: 'leve',
    label: 'Leve',
    descripcion: 'Molestias menores, no requiere intervención inmediata',
    color: 'text-green-600 bg-green-100'
  },
  {
    value: 'moderada',
    label: 'Moderada',
    descripcion: 'Síntomas notables, requiere atención',
    color: 'text-yellow-600 bg-yellow-100'
  },
  {
    value: 'severa',
    label: 'Severa',
    descripción: 'Síntomas graves, requiere intervención médica',
    color: 'text-orange-600 bg-orange-100'
  },
  {
    value: 'critica',
    label: 'Crítica',
    descripcion: 'Riesgo vital, requiere atención médica inmediata',
    color: 'text-red-600 bg-red-100'
  }
];

// Utilidades para formateo
export const formatearTipoRestriccion = (tipo: TipoRestriccion): string => {
  const tipos = obtenerTiposRestriccion();
  return tipos.find(t => t.value === tipo)?.label || tipo;
};

export const formatearSeveridad = (severidad: SeveridadRestriccion): string => {
  const severidades = obtenerSeveridades();
  return severidades.find(s => s.value === severidad)?.label || severidad;
};

export const obtenerColorSeveridad = (severidad: SeveridadRestriccion): string => {
  const severidades = obtenerSeveridades();
  return severidades.find(s => s.value === severidad)?.color || 'text-gray-600 bg-gray-100';
};

// Utilidades para iconos
export const obtenerIconoTipo = (tipo: TipoRestriccion): string => {
  const iconos = {
    alergia: '⚠️',
    intolerancia: '🚫',
    religiosa: '🕌',
    cultural: '🌱'
  };
  return iconos[tipo] || '📋';
};

export const obtenerIconoSeveridad = (severidad: SeveridadRestriccion): string => {
  const iconos = {
    leve: '🟢',
    moderada: '🟡',
    severa: '🟠',
    critica: '🔴'
  };
  return iconos[severidad] || '⚪';
};

// Utilidades para filtrado y búsqueda
export const filtrarPorTexto = <T extends Record<string, any>>(
  items: T[],
  texto: string,
  campos: (keyof T)[]
): T[] => {
  if (!texto.trim()) return items;
  
  const textoBusqueda = texto.toLowerCase().trim();
  
  return items.filter(item =>
    campos.some(campo => {
      const valor = item[campo];
      if (typeof valor === 'string') {
        return valor.toLowerCase().includes(textoBusqueda);
      }
      if (Array.isArray(valor)) {
        return valor.some(v => 
          typeof v === 'string' && v.toLowerCase().includes(textoBusqueda)
        );
      }
      return false;
    })
  );
};

// Utilidades para fechas
export const formatearFecha = (fecha: Date): string => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(fecha);
};

export const formatearFechaCorta = (fecha: Date): string => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(fecha);
};

export const calcularTiempoTranscurrido = (fecha: Date): string => {
  const ahora = new Date();
  const diferencia = ahora.getTime() - fecha.getTime();
  
  const minutos = Math.floor(diferencia / (1000 * 60));
  const horas = Math.floor(diferencia / (1000 * 60 * 60));
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  
  if (minutos < 60) {
    return `hace ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
  } else if (horas < 24) {
    return `hace ${horas} hora${horas !== 1 ? 's' : ''}`;
  } else if (dias < 30) {
    return `hace ${dias} día${dias !== 1 ? 's' : ''}`;
  } else {
    return formatearFechaCorta(fecha);
  }
};

// Utilidades para validación de ingredientes
export const normalizarIngrediente = (ingrediente: string): string => {
  return ingrediente.toLowerCase().trim().replace(/\s+/g, ' ');
};

export const compararIngredientes = (ingrediente1: string, ingrediente2: string): boolean => {
  return normalizarIngrediente(ingrediente1) === normalizarIngrediente(ingrediente2);
};

export const buscarIngredienteEnLista = (ingrediente: string, lista: string[]): boolean => {
  const ingredienteNormalizado = normalizarIngrediente(ingrediente);
  return lista.some(item => 
    normalizarIngrediente(item).includes(ingredienteNormalizado) ||
    ingredienteNormalizado.includes(normalizarIngrediente(item))
  );
};

// Utilidades para reportes
export const calcularPorcentaje = (parte: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((parte / total) * 100);
};

export const formatearPorcentaje = (porcentaje: number): string => {
  return `${porcentaje}%`;
};

export const generarResumenEstadisticas = (datos: any) => {
  const total = Object.values(datos).reduce((sum: number, value: any) => sum + (typeof value === 'number' ? value : 0), 0);
  
  return Object.entries(datos).map(([clave, valor]) => ({
    clave,
    valor: valor as number,
    porcentaje: calcularPorcentaje(valor as number, total)
  }));
};

// Utilidades para exportación
export const exportarACSV = (datos: any[], nombreArchivo: string) => {
  if (datos.length === 0) return;
  
  const headers = Object.keys(datos[0]);
  const csvContent = [
    headers.join(','),
    ...datos.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escapar comillas y envolver en comillas si contiene comas
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${nombreArchivo}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};