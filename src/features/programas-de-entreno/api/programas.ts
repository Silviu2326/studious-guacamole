export interface Programa {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: 'personalizado' | 'grupal' | 'plan-sala';
  categoria: string;
  duracionSemanas?: number;
  frecuencia?: number;
  ejercicios: EjercicioPrograma[];
  clienteId?: string;
  grupoId?: string;
  activo: boolean;
  estado: 'borrador' | 'publicado'; // User Story: Guardar borrador sin publicar
  fechaCreacion: string;
  fechaActualizacion: string;
  fechaPublicacion?: string; // Fecha en que se publicó el programa
  creadoPor: string;
  // Datos del plan semanal para borradores (opcional, puede estar en otro lugar)
  planSemanal?: Record<string, any>; // Estructura del plan semanal completo
}

export interface EjercicioPrograma {
  ejercicioId: string;
  nombre: string;
  series: number;
  repeticiones: string;
  peso?: number;
  descanso?: number;
  notas?: string;
  orden: number;
}

export interface FiltrosProgramas {
  tipo?: 'personalizado' | 'grupal' | 'plan-sala';
  categoria?: string;
  clienteId?: string;
  grupoId?: string;
  activo?: boolean;
  estado?: 'borrador' | 'publicado'; // Filtrar por estado
  busqueda?: string;
}

// Mock data para desarrollo
const mockProgramas: Programa[] = [
  {
    id: '1',
    nombre: 'Rutina de Fuerza para Principiantes',
    descripcion: 'Programa básico para introducirse en el entrenamiento de fuerza',
    tipo: 'personalizado',
    categoria: '1', // ID de categoría "Fuerza"
    duracionSemanas: 8,
    frecuencia: 3,
    ejercicios: [
      {
        ejercicioId: 'ej1',
        nombre: 'Sentadillas',
        series: 3,
        repeticiones: '10-12',
        peso: 20,
        descanso: 90,
        orden: 1
      },
      {
        ejercicioId: 'ej2',
        nombre: 'Press de banca',
        series: 3,
        repeticiones: '8-10',
        peso: 15,
        descanso: 90,
        orden: 2
      },
      {
        ejercicioId: 'ej3',
        nombre: 'Remo con barra',
        series: 3,
        repeticiones: '10-12',
        peso: 12,
        descanso: 90,
        orden: 3
      }
    ],
    clienteId: 'cliente1',
    activo: true,
    estado: 'publicado',
    fechaCreacion: new Date('2024-01-15').toISOString(),
    fechaActualizacion: new Date('2024-01-20').toISOString(),
    fechaPublicacion: new Date('2024-01-20').toISOString(),
    creadoPor: 'entrenador1'
  },
  {
    id: '2',
    nombre: 'Hipertrofia Avanzada',
    descripcion: 'Programa intensivo para ganancia muscular',
    tipo: 'personalizado',
    categoria: '2', // ID de categoría "Hipertrofia"
    duracionSemanas: 12,
    frecuencia: 4,
    ejercicios: [
      {
        ejercicioId: 'ej4',
        nombre: 'Press militar',
        series: 4,
        repeticiones: '8-10',
        peso: 25,
        descanso: 120,
        orden: 1
      },
      {
        ejercicioId: 'ej5',
        nombre: 'Peso muerto',
        series: 4,
        repeticiones: '5-8',
        peso: 40,
        descanso: 180,
        orden: 2
      }
    ],
    clienteId: 'cliente2',
    activo: true,
    estado: 'publicado',
    fechaCreacion: new Date('2024-01-10').toISOString(),
    fechaActualizacion: new Date('2024-01-10').toISOString(),
    fechaPublicacion: new Date('2024-01-10').toISOString(),
    creadoPor: 'entrenador1'
  },
  {
    id: '3',
    nombre: 'Clase de Spinning',
    descripcion: 'Entrenamiento grupal cardiovascular',
    tipo: 'grupal',
    categoria: '3', // ID de categoría "Cardio"
    duracionSemanas: undefined,
    frecuencia: 2,
    ejercicios: [
      {
        ejercicioId: 'ej6',
        nombre: 'Intervalos alta intensidad',
        series: 1,
        repeticiones: '30min',
        descanso: 60,
        orden: 1
      }
    ],
    grupoId: 'grupo1',
    activo: true,
    estado: 'publicado',
    fechaCreacion: new Date('2024-01-01').toISOString(),
    fechaActualizacion: new Date('2024-01-01').toISOString(),
    fechaPublicacion: new Date('2024-01-01').toISOString(),
    creadoPor: 'admin1'
  },
  {
    id: '4',
    nombre: 'Plan de Sala Básico',
    descripcion: 'Rutina estándar para socios del gimnasio',
    tipo: 'plan-sala',
    categoria: '8', // ID de categoría "Plan Sala"
    duracionSemanas: 4,
    frecuencia: 3,
    ejercicios: [
      {
        ejercicioId: 'ej7',
        nombre: 'Máquina de pecho',
        series: 3,
        repeticiones: '12-15',
        descanso: 60,
        orden: 1
      },
      {
        ejercicioId: 'ej8',
        nombre: 'Máquina de pierna',
        series: 3,
        repeticiones: '12-15',
        descanso: 60,
        orden: 2
      }
    ],
    activo: true,
    estado: 'publicado',
    fechaCreacion: new Date('2024-01-05').toISOString(),
    fechaActualizacion: new Date('2024-01-05').toISOString(),
    fechaPublicacion: new Date('2024-01-05').toISOString(),
    creadoPor: 'admin1'
  },
  {
    id: '5',
    nombre: 'Rehabilitación Rodilla',
    descripcion: 'Programa terapéutico post-lesión',
    tipo: 'personalizado',
    categoria: '4', // ID de categoría "Rehabilitación"
    duracionSemanas: 6,
    frecuencia: 2,
    ejercicios: [
      {
        ejercicioId: 'ej9',
        nombre: 'Extensión de rodilla',
        series: 3,
        repeticiones: '12-15',
        descanso: 45,
        orden: 1
      },
      {
        ejercicioId: 'ej10',
        nombre: 'Cuádriceps isométrico',
        series: 3,
        repeticiones: '30seg',
        descanso: 45,
        orden: 2
      }
    ],
    clienteId: 'cliente3',
    activo: true,
    estado: 'publicado',
    fechaCreacion: new Date('2024-02-01').toISOString(),
    fechaActualizacion: new Date('2024-02-01').toISOString(),
    fechaPublicacion: new Date('2024-02-01').toISOString(),
    creadoPor: 'entrenador2'
  },
  {
    id: '6',
    nombre: 'Boxeo Grupal',
    descripcion: 'Entrenamiento de boxeo en grupo',
    tipo: 'grupal',
    categoria: '6', // ID de categoría "Combat"
    duracionSemanas: undefined,
    frecuencia: 3,
    ejercicios: [
      {
        ejercicioId: 'ej11',
        nombre: 'Combinaciones básicas',
        series: 1,
        repeticiones: '20min',
        descanso: 60,
        orden: 1
      },
      {
        ejercicioId: 'ej12',
        nombre: 'Saco heavy bag',
        series: 5,
        repeticiones: '3min',
        descanso: 60,
        orden: 2
      }
    ],
    grupoId: 'grupo2',
    activo: true,
    estado: 'publicado',
    fechaCreacion: new Date('2024-01-15').toISOString(),
    fechaActualizacion: new Date('2024-01-15').toISOString(),
    fechaPublicacion: new Date('2024-01-15').toISOString(),
    creadoPor: 'admin1'
  }
];

let programasData = [...mockProgramas];

export async function getProgramas(filtros?: FiltrosProgramas): Promise<Programa[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let programas = [...programasData];
  
  if (filtros) {
    if (filtros.tipo) {
      programas = programas.filter(p => p.tipo === filtros.tipo);
    }
    if (filtros.categoria) {
      programas = programas.filter(p => p.categoria === filtros.categoria);
    }
    if (filtros.clienteId) {
      programas = programas.filter(p => p.clienteId === filtros.clienteId);
    }
    if (filtros.grupoId) {
      programas = programas.filter(p => p.grupoId === filtros.grupoId);
    }
    if (filtros.activo !== undefined) {
      programas = programas.filter(p => p.activo === filtros.activo);
    }
    if (filtros.estado) {
      programas = programas.filter(p => p.estado === filtros.estado);
    }
    if (filtros.busqueda) {
      const search = filtros.busqueda.toLowerCase();
      programas = programas.filter(p => 
        p.nombre.toLowerCase().includes(search) || 
        p.descripcion.toLowerCase().includes(search)
      );
    }
  }
  
  return programas;
}

export async function getProgramaPorId(id: string): Promise<Programa | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const programa = programasData.find(p => p.id === id);
  return programa || null;
}

export async function crearPrograma(data: Omit<Programa, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'fechaPublicacion'>): Promise<Programa | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const ahora = new Date().toISOString();
  const nuevoPrograma: Programa = {
    ...data,
    id: `prog-${Date.now()}`,
    estado: data.estado || 'borrador', // Por defecto borrador
    fechaCreacion: ahora,
    fechaActualizacion: ahora,
    fechaPublicacion: data.estado === 'publicado' ? ahora : undefined,
  };
  
  programasData.push(nuevoPrograma);
  return nuevoPrograma;
}

export async function actualizarPrograma(id: string, data: Partial<Programa>): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = programasData.findIndex(p => p.id === id);
  if (index === -1) return false;
  
  const ahora = new Date().toISOString();
  const programaActual = programasData[index];
  
  // Si cambia de borrador a publicado, establecer fechaPublicacion
  const fechaPublicacion = 
    data.estado === 'publicado' && programaActual.estado !== 'publicado'
      ? ahora
      : programaActual.fechaPublicacion;
  
  programasData[index] = {
    ...programaActual,
    ...data,
    fechaActualizacion: ahora,
    fechaPublicacion,
  };
  
  return true;
}

/**
 * Guardar programa como borrador
 * User Story: Como coach quiero guardar un borrador del programa sin publicarlo
 */
export async function guardarBorrador(
  programaId: string | null,
  data: {
    nombre: string;
    descripcion: string;
    tipo: 'personalizado' | 'grupal' | 'plan-sala';
    categoria: string;
    planSemanal?: Record<string, any>;
    clienteId?: string;
    grupoId?: string;
    creadoPor: string;
  }
): Promise<Programa | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (programaId) {
    // Actualizar borrador existente
    const actualizado = await actualizarPrograma(programaId, {
      ...data,
      estado: 'borrador',
      planSemanal: data.planSemanal,
    });
    if (actualizado) {
      return programasData.find(p => p.id === programaId) || null;
    }
    return null;
  } else {
    // Crear nuevo borrador
    return await crearPrograma({
      ...data,
      ejercicios: [],
      activo: false, // Los borradores no están activos hasta publicarse
      estado: 'borrador',
      planSemanal: data.planSemanal,
    });
  }
}

/**
 * Publicar un programa (cambiar de borrador a publicado)
 */
export async function publicarPrograma(programaId: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return await actualizarPrograma(programaId, {
    estado: 'publicado',
    activo: true,
  });
}

/**
 * Obtener borradores de un usuario
 */
export async function obtenerBorradores(creadoPor: string): Promise<Programa[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return programasData.filter(p => 
    p.estado === 'borrador' && p.creadoPor === creadoPor
  );
}

export async function eliminarPrograma(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const index = programasData.findIndex(p => p.id === id);
  if (index === -1) return false;
  programasData.splice(index, 1);
  return true;
}

export async function duplicarPrograma(id: string, nuevoNombre?: string): Promise<Programa | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const programa = programasData.find(p => p.id === id);
  if (!programa) return null;
  
  const nuevoPrograma: Programa = {
    ...programa,
    id: `prog-${Date.now()}`,
    nombre: nuevoNombre || `${programa.nombre} (copia)`,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString()
  };
  
  programasData.push(nuevoPrograma);
  return nuevoPrograma;
}

export async function getProgramasPorCliente(clienteId: string): Promise<Programa[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return programasData.filter(p => p.clienteId === clienteId);
}

export async function getProgramasPorGrupo(grupoId: string): Promise<Programa[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return programasData.filter(p => p.grupoId === grupoId);
}

