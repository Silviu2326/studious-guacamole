import { 
  Ejercicio, 
  FiltrosEjercicio, 
  ResultadoBusqueda, 
  EjercicioFavorito,
  EstadisticasEjercicio,
  GrupoMuscular,
  Equipamiento
} from '../types';
import { ejerciciosMock, gruposMusculares, equipamientos, favoritosMock } from '../data/mockData';

// Simulación de API - En producción estos serían llamadas HTTP reales
class BibliotecaService {
  private ejercicios: Ejercicio[] = ejerciciosMock;
  private favoritos: string[] = [...favoritosMock];
  private gruposMusculares: GrupoMuscular[] = gruposMusculares;
  private equipamientos: Equipamiento[] = equipamientos;

  // Obtener todos los ejercicios
  async obtenerEjercicios(): Promise<Ejercicio[]> {
    // Simular delay de red
    await this.delay(300);
    return this.ejercicios.filter(ejercicio => ejercicio.activo);
  }

  // Obtener ejercicio por ID
  async obtenerEjercicioPorId(id: string): Promise<Ejercicio | null> {
    await this.delay(200);
    const ejercicio = this.ejercicios.find(e => e.id === id && e.activo);
    return ejercicio || null;
  }

  // Buscar ejercicios con filtros
  async buscarEjercicios(
    filtros: FiltrosEjercicio, 
    pagina: number = 1, 
    limite: number = 20
  ): Promise<ResultadoBusqueda> {
    await this.delay(400);
    
    let ejerciciosFiltrados = this.ejercicios.filter(ejercicio => {
      if (!ejercicio.activo) return false;

      // Filtro por búsqueda
      if (filtros.busqueda) {
        const busqueda = filtros.busqueda.toLowerCase();
        const coincide = 
          ejercicio.nombre.toLowerCase().includes(busqueda) ||
          ejercicio.descripcion.toLowerCase().includes(busqueda) ||
          ejercicio.tags.some(tag => tag.toLowerCase().includes(busqueda));
        if (!coincide) return false;
      }

      // Filtro por grupos musculares
      if (filtros.gruposMusculares && filtros.gruposMusculares.length > 0) {
        const tieneGrupo = ejercicio.grupoMuscular.some(grupo => 
          filtros.gruposMusculares!.includes(grupo.id)
        );
        if (!tieneGrupo) return false;
      }

      // Filtro por equipamiento
      if (filtros.equipamiento && filtros.equipamiento.length > 0) {
        const tieneEquipamiento = ejercicio.equipamiento.some(equipo => 
          filtros.equipamiento!.includes(equipo.id)
        );
        if (!tieneEquipamiento) return false;
      }

      // Filtro por dificultad
      if (filtros.dificultad && filtros.dificultad.length > 0) {
        if (!filtros.dificultad.includes(ejercicio.dificultad)) return false;
      }

      // Filtro por duración
      if (filtros.duracionMin && ejercicio.duracion && ejercicio.duracion < filtros.duracionMin) {
        return false;
      }
      if (filtros.duracionMax && ejercicio.duracion && ejercicio.duracion > filtros.duracionMax) {
        return false;
      }

      // Filtro por favoritos
      if (filtros.soloFavoritos) {
        if (!this.favoritos.includes(ejercicio.id)) return false;
      }

      return true;
    });

    // Paginación
    const total = ejerciciosFiltrados.length;
    const inicio = (pagina - 1) * limite;
    const fin = inicio + limite;
    ejerciciosFiltrados = ejerciciosFiltrados.slice(inicio, fin);

    return {
      ejercicios: ejerciciosFiltrados,
      total,
      pagina,
      totalPaginas: Math.ceil(total / limite)
    };
  }

  // Obtener grupos musculares
  async obtenerGruposMusculares(): Promise<GrupoMuscular[]> {
    await this.delay(200);
    return this.gruposMusculares;
  }

  // Obtener equipamientos
  async obtenerEquipamientos(): Promise<Equipamiento[]> {
    await this.delay(200);
    return this.equipamientos;
  }

  // Gestión de favoritos
  async obtenerFavoritos(usuarioId: string): Promise<string[]> {
    await this.delay(200);
    // En producción, filtrar por usuarioId
    return [...this.favoritos];
  }

  async agregarFavorito(usuarioId: string, ejercicioId: string): Promise<void> {
    await this.delay(300);
    if (!this.favoritos.includes(ejercicioId)) {
      this.favoritos.push(ejercicioId);
    }
  }

  async removerFavorito(usuarioId: string, ejercicioId: string): Promise<void> {
    await this.delay(300);
    this.favoritos = this.favoritos.filter(id => id !== ejercicioId);
  }

  // Obtener ejercicios favoritos completos
  async obtenerEjerciciosFavoritos(usuarioId: string): Promise<Ejercicio[]> {
    await this.delay(400);
    const favoritosIds = await this.obtenerFavoritos(usuarioId);
    return this.ejercicios.filter(ejercicio => 
      favoritosIds.includes(ejercicio.id) && ejercicio.activo
    );
  }

  // Estadísticas de ejercicios
  async obtenerEstadisticasEjercicio(ejercicioId: string): Promise<EstadisticasEjercicio | null> {
    await this.delay(300);
    
    // Datos mock de estadísticas
    const estadisticasMock: EstadisticasEjercicio = {
      ejercicioId,
      vecesUsado: Math.floor(Math.random() * 100) + 1,
      ultimoUso: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Último mes
      promedioCalificacion: Math.round((Math.random() * 2 + 3) * 10) / 10, // Entre 3.0 y 5.0
      totalCalificaciones: Math.floor(Math.random() * 50) + 5
    };

    return estadisticasMock;
  }

  // Ejercicios recomendados basados en historial
  async obtenerEjerciciosRecomendados(usuarioId: string, limite: number = 6): Promise<Ejercicio[]> {
    await this.delay(500);
    
    // Lógica simple de recomendación: ejercicios populares que no están en favoritos
    const ejerciciosNoFavoritos = this.ejercicios.filter(ejercicio => 
      !this.favoritos.includes(ejercicio.id) && ejercicio.activo
    );
    
    // Ordenar aleatoriamente y tomar los primeros
    const recomendados = ejerciciosNoFavoritos
      .sort(() => Math.random() - 0.5)
      .slice(0, limite);
    
    return recomendados;
  }

  // Ejercicios similares
  async obtenerEjerciciosSimilares(ejercicioId: string, limite: number = 4): Promise<Ejercicio[]> {
    await this.delay(400);
    
    const ejercicioBase = this.ejercicios.find(e => e.id === ejercicioId);
    if (!ejercicioBase) return [];

    // Encontrar ejercicios con grupos musculares similares
    const similares = this.ejercicios.filter(ejercicio => {
      if (ejercicio.id === ejercicioId || !ejercicio.activo) return false;
      
      // Verificar si comparten al menos un grupo muscular
      return ejercicio.grupoMuscular.some(grupo => 
        ejercicioBase.grupoMuscular.some(grupoBase => grupoBase.id === grupo.id)
      );
    });

    return similares.slice(0, limite);
  }

  // Crear nuevo ejercicio (para administradores)
  async crearEjercicio(ejercicio: Omit<Ejercicio, 'id' | 'fechaCreacion' | 'fechaActualizacion'>): Promise<Ejercicio> {
    await this.delay(500);
    
    const nuevoEjercicio: Ejercicio = {
      ...ejercicio,
      id: Date.now().toString(),
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    };

    this.ejercicios.push(nuevoEjercicio);
    return nuevoEjercicio;
  }

  // Actualizar ejercicio
  async actualizarEjercicio(id: string, datosActualizados: Partial<Ejercicio>): Promise<Ejercicio | null> {
    await this.delay(500);
    
    const indice = this.ejercicios.findIndex(e => e.id === id);
    if (indice === -1) return null;

    this.ejercicios[indice] = {
      ...this.ejercicios[indice],
      ...datosActualizados,
      fechaActualizacion: new Date()
    };

    return this.ejercicios[indice];
  }

  // Eliminar ejercicio (soft delete)
  async eliminarEjercicio(id: string): Promise<boolean> {
    await this.delay(400);
    
    const indice = this.ejercicios.findIndex(e => e.id === id);
    if (indice === -1) return false;

    this.ejercicios[indice].activo = false;
    this.ejercicios[indice].fechaActualizacion = new Date();
    
    return true;
  }

  // Método auxiliar para simular delay de red
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Instancia singleton del servicio
export const bibliotecaService = new BibliotecaService();