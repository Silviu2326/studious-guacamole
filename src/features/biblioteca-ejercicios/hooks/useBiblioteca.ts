import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Ejercicio, 
  FiltrosEjercicio, 
  BibliotecaState, 
  GrupoMuscular, 
  Equipamiento,
  ResultadoBusqueda 
} from '../types';
import { bibliotecaService } from '../services/bibliotecaService';

// Hook principal para la biblioteca de ejercicios
export const useBiblioteca = () => {
  const [state, setState] = useState<BibliotecaState>({
    ejercicios: [],
    ejercicioSeleccionado: null,
    favoritos: [],
    filtros: {
      busqueda: '',
      gruposMusculares: [],
      equipamiento: [],
      dificultad: [],
      soloFavoritos: false
    },
    cargando: false,
    error: null,
    gruposMusculares: [],
    equipamientos: []
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    setState(prev => ({ ...prev, cargando: true, error: null }));
    
    try {
      const [ejercicios, gruposMusculares, equipamientos, favoritos] = await Promise.all([
        bibliotecaService.obtenerEjercicios(),
        bibliotecaService.obtenerGruposMusculares(),
        bibliotecaService.obtenerEquipamientos(),
        bibliotecaService.obtenerFavoritos('usuario-actual') // En producción usar ID real
      ]);

      setState(prev => ({
        ...prev,
        ejercicios,
        gruposMusculares,
        equipamientos,
        favoritos,
        cargando: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Error al cargar los datos de la biblioteca',
        cargando: false
      }));
    }
  };

  // Buscar ejercicios con filtros
  const buscarEjercicios = useCallback(async (
    filtros: FiltrosEjercicio, 
    pagina: number = 1
  ): Promise<ResultadoBusqueda | null> => {
    setState(prev => ({ ...prev, cargando: true, error: null }));
    
    try {
      const resultado = await bibliotecaService.buscarEjercicios(filtros, pagina);
      setState(prev => ({ ...prev, cargando: false }));
      return resultado;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Error al buscar ejercicios',
        cargando: false
      }));
      return null;
    }
  }, []);

  // Actualizar filtros
  const actualizarFiltros = useCallback((nuevosFiltros: Partial<FiltrosEjercicio>) => {
    setState(prev => ({
      ...prev,
      filtros: { ...prev.filtros, ...nuevosFiltros }
    }));
  }, []);

  // Limpiar filtros
  const limpiarFiltros = useCallback(() => {
    setState(prev => ({
      ...prev,
      filtros: {
        busqueda: '',
        gruposMusculares: [],
        equipamiento: [],
        dificultad: [],
        soloFavoritos: false
      }
    }));
  }, []);

  // Seleccionar ejercicio
  const seleccionarEjercicio = useCallback((ejercicio: Ejercicio | null) => {
    setState(prev => ({ ...prev, ejercicioSeleccionado: ejercicio }));
  }, []);

  // Gestión de favoritos
  const agregarFavorito = useCallback(async (ejercicioId: string) => {
    try {
      await bibliotecaService.agregarFavorito('usuario-actual', ejercicioId);
      setState(prev => ({
        ...prev,
        favoritos: [...prev.favoritos, ejercicioId]
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Error al agregar a favoritos'
      }));
    }
  }, []);

  const removerFavorito = useCallback(async (ejercicioId: string) => {
    try {
      await bibliotecaService.removerFavorito('usuario-actual', ejercicioId);
      setState(prev => ({
        ...prev,
        favoritos: prev.favoritos.filter(id => id !== ejercicioId)
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Error al remover de favoritos'
      }));
    }
  }, []);

  const toggleFavorito = useCallback(async (ejercicioId: string) => {
    if (state.favoritos.includes(ejercicioId)) {
      await removerFavorito(ejercicioId);
    } else {
      await agregarFavorito(ejercicioId);
    }
  }, [state.favoritos, agregarFavorito, removerFavorito]);

  // Ejercicios filtrados (memoizado para performance)
  const ejerciciosFiltrados = useMemo(() => {
    return state.ejercicios.filter(ejercicio => {
      // Filtro por búsqueda
      if (state.filtros.busqueda) {
        const busqueda = state.filtros.busqueda.toLowerCase();
        const coincide = 
          ejercicio.nombre.toLowerCase().includes(busqueda) ||
          ejercicio.descripcion.toLowerCase().includes(busqueda) ||
          ejercicio.tags.some(tag => tag.toLowerCase().includes(busqueda));
        if (!coincide) return false;
      }

      // Filtro por grupos musculares
      if (state.filtros.gruposMusculares && state.filtros.gruposMusculares.length > 0) {
        const tieneGrupo = ejercicio.grupoMuscular.some(grupo => 
          state.filtros.gruposMusculares!.includes(grupo.id)
        );
        if (!tieneGrupo) return false;
      }

      // Filtro por equipamiento
      if (state.filtros.equipamiento && state.filtros.equipamiento.length > 0) {
        const tieneEquipamiento = ejercicio.equipamiento.some(equipo => 
          state.filtros.equipamiento!.includes(equipo.id)
        );
        if (!tieneEquipamiento) return false;
      }

      // Filtro por dificultad
      if (state.filtros.dificultad && state.filtros.dificultad.length > 0) {
        if (!state.filtros.dificultad.includes(ejercicio.dificultad)) return false;
      }

      // Filtro por favoritos
      if (state.filtros.soloFavoritos) {
        if (!state.favoritos.includes(ejercicio.id)) return false;
      }

      return true;
    });
  }, [state.ejercicios, state.filtros, state.favoritos]);

  // Ejercicios favoritos
  const ejerciciosFavoritos = useMemo(() => {
    return state.ejercicios.filter(ejercicio => state.favoritos.includes(ejercicio.id));
  }, [state.ejercicios, state.favoritos]);

  // Estadísticas
  const estadisticas = useMemo(() => {
    return {
      totalEjercicios: state.ejercicios.length,
      totalFavoritos: state.favoritos.length,
      ejerciciosFiltrados: ejerciciosFiltrados.length,
      gruposMusculares: state.gruposMusculares.length,
      equipamientos: state.equipamientos.length
    };
  }, [state.ejercicios, state.favoritos, ejerciciosFiltrados, state.gruposMusculares, state.equipamientos]);

  return {
    // Estado
    ...state,
    ejerciciosFiltrados,
    ejerciciosFavoritos,
    estadisticas,
    
    // Acciones
    cargarDatosIniciales,
    buscarEjercicios,
    actualizarFiltros,
    limpiarFiltros,
    seleccionarEjercicio,
    agregarFavorito,
    removerFavorito,
    toggleFavorito
  };
};

// Hook para obtener un ejercicio específico
export const useEjercicio = (ejercicioId: string | null) => {
  const [ejercicio, setEjercicio] = useState<Ejercicio | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ejercicioId) {
      setEjercicio(null);
      return;
    }

    const cargarEjercicio = async () => {
      setCargando(true);
      setError(null);
      
      try {
        const ejercicioObtenido = await bibliotecaService.obtenerEjercicioPorId(ejercicioId);
        setEjercicio(ejercicioObtenido);
      } catch (error) {
        setError('Error al cargar el ejercicio');
      } finally {
        setCargando(false);
      }
    };

    cargarEjercicio();
  }, [ejercicioId]);

  return { ejercicio, cargando, error };
};

// Hook para ejercicios recomendados
export const useEjerciciosRecomendados = (limite: number = 6) => {
  const [recomendados, setRecomendados] = useState<Ejercicio[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarRecomendados = useCallback(async () => {
    setCargando(true);
    setError(null);
    
    try {
      const ejerciciosRecomendados = await bibliotecaService.obtenerEjerciciosRecomendados('usuario-actual', limite);
      setRecomendados(ejerciciosRecomendados);
    } catch (error) {
      setError('Error al cargar ejercicios recomendados');
    } finally {
      setCargando(false);
    }
  }, [limite]);

  useEffect(() => {
    cargarRecomendados();
  }, [cargarRecomendados]);

  return { recomendados, cargando, error, recargar: cargarRecomendados };
};

// Hook para ejercicios similares
export const useEjerciciosSimilares = (ejercicioId: string | null, limite: number = 4) => {
  const [similares, setSimilares] = useState<Ejercicio[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ejercicioId) {
      setSimilares([]);
      return;
    }

    const cargarSimilares = async () => {
      setCargando(true);
      setError(null);
      
      try {
        const ejerciciosSimilares = await bibliotecaService.obtenerEjerciciosSimilares(ejercicioId, limite);
        setSimilares(ejerciciosSimilares);
      } catch (error) {
        setError('Error al cargar ejercicios similares');
      } finally {
        setCargando(false);
      }
    };

    cargarSimilares();
  }, [ejercicioId, limite]);

  return { similares, cargando, error };
};