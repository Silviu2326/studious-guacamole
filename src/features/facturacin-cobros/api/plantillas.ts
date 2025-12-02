import { PlantillaServicio, PLANTILLAS_PREDEFINIDAS } from '../types/plantillas';

// Mock data para desarrollo (inicializar con plantillas predefinidas)
const mockPlantillas: PlantillaServicio[] = PLANTILLAS_PREDEFINIDAS.map((plantilla, index) => ({
  ...plantilla,
  id: `plantilla-${index + 1}`,
  createdAt: new Date(),
  updatedAt: new Date(),
  usoFrecuente: 0,
}));

export const plantillasAPI = {
  // Obtener todas las plantillas
  async obtenerPlantillas(): Promise<PlantillaServicio[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPlantillas
      .filter(p => p.activa)
      .sort((a, b) => a.orden - b.orden);
  },

  // Obtener plantillas por categoría
  async obtenerPlantillasPorCategoria(categoria: string): Promise<PlantillaServicio[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPlantillas
      .filter(p => p.activa && p.categoria === categoria)
      .sort((a, b) => a.orden - b.orden);
  },

  // Obtener una plantilla por ID
  async obtenerPlantilla(id: string): Promise<PlantillaServicio | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPlantillas.find(p => p.id === id) || null;
  },

  // Crear una nueva plantilla
  async crearPlantilla(plantilla: Omit<PlantillaServicio, 'id' | 'createdAt' | 'updatedAt' | 'usoFrecuente'>): Promise<PlantillaServicio> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const nuevaPlantilla: PlantillaServicio = {
      ...plantilla,
      id: `plantilla-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      usoFrecuente: 0,
    };
    
    mockPlantillas.push(nuevaPlantilla);
    return nuevaPlantilla;
  },

  // Actualizar una plantilla
  async actualizarPlantilla(id: string, datos: Partial<PlantillaServicio>): Promise<PlantillaServicio> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockPlantillas.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Plantilla no encontrada');
    }
    
    mockPlantillas[index] = {
      ...mockPlantillas[index],
      ...datos,
      updatedAt: new Date(),
    };
    
    return mockPlantillas[index];
  },

  // Incrementar uso de una plantilla
  async incrementarUso(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = mockPlantillas.findIndex(p => p.id === id);
    if (index !== -1) {
      mockPlantillas[index].usoFrecuente += 1;
      mockPlantillas[index].updatedAt = new Date();
    }
  },

  // Eliminar una plantilla
  async eliminarPlantilla(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockPlantillas.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Plantilla no encontrada');
    }
    
    // Marcar como inactiva en lugar de eliminar
    mockPlantillas[index].activa = false;
    mockPlantillas[index].updatedAt = new Date();
  },
};


