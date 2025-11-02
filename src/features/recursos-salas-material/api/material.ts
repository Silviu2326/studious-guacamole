// API para gestión de material

export interface Material {
  id: string;
  nombre: string;
  tipo: 'maquina' | 'peso_libre' | 'accesorio' | 'esterilla' | 'bicicleta' | 'equipamiento_especializado';
  estado: 'disponible' | 'en_uso' | 'mantenimiento' | 'reservado' | 'fuera_servicio';
  ubicacion: string;
  salaId?: string;
  salaNombre?: string;
  cantidad: number;
  cantidadDisponible: number;
  cantidadEnUso: number;
  ultimaRevision: string;
  proximaRevision?: string;
  estadoCalidad: 'excelente' | 'bueno' | 'regular' | 'requiere_atencion';
  marca?: string;
  modelo?: string;
  observaciones?: string;
}

export interface BloqueoMantenimiento {
  id: string;
  recursoId: string;
  recursoNombre: string;
  recursoTipo: 'sala' | 'material';
  motivo: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'programado' | 'en_curso' | 'completado' | 'cancelado';
  responsableId?: string;
  responsableNombre?: string;
  observaciones?: string;
}

export interface MantenimientoPreventivo {
  id: string;
  materialId: string;
  materialNombre: string;
  tipo: 'limpieza' | 'revision' | 'calibracion' | 'reparacion' | 'sustitucion';
  frecuencia: 'diaria' | 'semanal' | 'mensual' | 'trimestral' | 'semestral' | 'anual';
  fechaUltima: string;
  fechaProxima: string;
  estado: 'programado' | 'completado' | 'atrasado';
  responsableId?: string;
  responsableNombre?: string;
  checklist?: string[];
}

const API_BASE = '/api/operaciones';
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockMaterial: Material[] = [
  {
    id: '1',
    nombre: 'Bicicletas de Spinning',
    tipo: 'bicicleta',
    estado: 'disponible',
    ubicacion: 'Sala de Spinning',
    salaId: '2',
    salaNombre: 'Sala de Spinning',
    cantidad: 20,
    cantidadDisponible: 18,
    cantidadEnUso: 2,
    ultimaRevision: '2024-11-01',
    proximaRevision: '2024-12-01',
    estadoCalidad: 'bueno'
  },
  {
    id: '2',
    nombre: 'Esterillas de Yoga',
    tipo: 'esterilla',
    estado: 'disponible',
    ubicacion: 'Sala de Yoga',
    salaId: '3',
    salaNombre: 'Sala de Yoga',
    cantidad: 25,
    cantidadDisponible: 25,
    cantidadEnUso: 0,
    ultimaRevision: '2024-10-15',
    estadoCalidad: 'excelente'
  },
  {
    id: '3',
    nombre: 'Guantes de Boxeo',
    tipo: 'accesorio',
    estado: 'disponible',
    ubicacion: 'Sala de Boxeo',
    salaId: '4',
    salaNombre: 'Sala de Boxeo',
    cantidad: 30,
    cantidadDisponible: 28,
    cantidadEnUso: 2,
    ultimaRevision: '2024-11-05',
    estadoCalidad: 'bueno'
  },
  {
    id: '4',
    nombre: 'Máquina de Cardio TR-500',
    tipo: 'maquina',
    estado: 'mantenimiento',
    ubicacion: 'Sala de Musculación Principal',
    salaId: '1',
    salaNombre: 'Sala de Musculación Principal',
    cantidad: 1,
    cantidadDisponible: 0,
    cantidadEnUso: 0,
    ultimaRevision: '2024-11-20',
    proximaRevision: '2024-11-25',
    estadoCalidad: 'requiere_atencion',
    observaciones: 'En reparación'
  }
];

export const materialApi = {
  obtenerMaterial: async (filtros?: {
    tipo?: string;
    estado?: string;
    ubicacion?: string;
    salaId?: string;
  }): Promise<Material[]> => {
    await delay(500);
    let material = [...mockMaterial];
    
    if (filtros?.tipo) {
      material = material.filter(m => m.tipo === filtros.tipo);
    }
    if (filtros?.estado) {
      material = material.filter(m => m.estado === filtros.estado);
    }
    if (filtros?.salaId) {
      material = material.filter(m => m.salaId === filtros.salaId);
    }
    
    return material;
  },

  obtenerMaterialPorId: async (id: string): Promise<Material | null> => {
    await delay(500);
    return mockMaterial.find(m => m.id === id) || null;
  },

  crearMaterial: async (material: Partial<Material>): Promise<Material> => {
    await delay(500);
    return {
      id: Date.now().toString(),
      nombre: material.nombre || '',
      tipo: material.tipo || 'accesorio',
      estado: 'disponible',
      ubicacion: material.ubicacion || '',
      cantidad: material.cantidad || 0,
      cantidadDisponible: material.cantidad || 0,
      cantidadEnUso: 0,
      ultimaRevision: new Date().toISOString(),
      estadoCalidad: 'bueno',
      ...material
    };
  },

  actualizarMaterial: async (id: string, datos: Partial<Material>): Promise<Material> => {
    await delay(500);
    const index = mockMaterial.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Material no encontrado');
    mockMaterial[index] = { ...mockMaterial[index], ...datos };
    return mockMaterial[index];
  },

  eliminarMaterial: async (id: string): Promise<void> => {
    await delay(500);
  },

  obtenerBloqueos: async (filtros?: {
    recursoTipo?: string;
    estado?: string;
  }): Promise<BloqueoMantenimiento[]> => {
    await delay(500);
    return [];
  },

  crearBloqueo: async (bloqueo: Partial<BloqueoMantenimiento>): Promise<BloqueoMantenimiento> => {
    await delay(500);
    return {
      id: Date.now().toString(),
      recursoId: bloqueo.recursoId || '',
      recursoNombre: bloqueo.recursoNombre || '',
      recursoTipo: bloqueo.recursoTipo || 'material',
      motivo: bloqueo.motivo || '',
      fechaInicio: bloqueo.fechaInicio || new Date().toISOString(),
      fechaFin: bloqueo.fechaFin || new Date().toISOString(),
      estado: 'programado',
      ...bloqueo
    };
  },

  obtenerMantenimientosPreventivos: async (filtros?: {
    estado?: string;
    materialId?: string;
  }): Promise<MantenimientoPreventivo[]> => {
    await delay(500);
    return [];
  },

  crearMantenimientoPreventivo: async (mantenimiento: Partial<MantenimientoPreventivo>): Promise<MantenimientoPreventivo> => {
    await delay(500);
    return {
      id: Date.now().toString(),
      materialId: mantenimiento.materialId || '',
      materialNombre: mantenimiento.materialNombre || '',
      tipo: mantenimiento.tipo || 'revision',
      frecuencia: mantenimiento.frecuencia || 'mensual',
      fechaUltima: mantenimiento.fechaUltima || new Date().toISOString(),
      fechaProxima: mantenimiento.fechaProxima || new Date().toISOString(),
      estado: 'programado',
      ...mantenimiento
    };
  },

  obtenerDisponibilidad: async (fecha: string, salaId?: string): Promise<{
    salas: Array<{ id: string; nombre: string; disponible: boolean; ocupacion: number; capacidad: number }>;
    material: Array<{ id: string; nombre: string; disponible: number; total: number }>;
  }> => {
    await delay(500);
    return {
      salas: [],
      material: []
    };
  }
};

