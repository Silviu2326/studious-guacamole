import { useState, useEffect, useCallback } from 'react';
import { 
  Producto, 
  Categoria, 
  FiltrosProductos, 
  OrdenProductos, 
  ProductoFormData,
  EstadisticasResponse,
  MovimientoStock,
  AlertaStock
} from '../types';
import { productosService } from '../services/productosService';

export const useProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalProductos, setTotalProductos] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);

  // Estados para filtros y ordenamiento
  const [filtros, setFiltros] = useState<FiltrosProductos>({});
  const [orden, setOrden] = useState<OrdenProductos>({ campo: 'nombre', direccion: 'asc' });

  // Cargar productos
  const cargarProductos = useCallback(async (
    filtrosPersonalizados?: FiltrosProductos,
    ordenPersonalizado?: OrdenProductos,
    pagina: number = 1,
    limite: number = 10
  ) => {
    try {
      setLoading(true);
      setError(null);

      const filtrosFinales = filtrosPersonalizados || filtros;
      const ordenFinal = ordenPersonalizado || orden;

      const response = await productosService.obtenerProductos(
        filtrosFinales,
        ordenFinal,
        pagina,
        limite
      );

      setProductos(response.productos);
      setTotalProductos(response.total);
      setTotalPaginas(response.totalPaginas);
      setPaginaActual(response.pagina);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, [filtros, orden]);

  // Cargar categorías
  const cargarCategorias = useCallback(async () => {
    try {
      const response = await productosService.obtenerCategorias();
      setCategorias(response.categorias);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar categorías');
    }
  }, []);

  // Crear producto
  const crearProducto = useCallback(async (datos: ProductoFormData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await productosService.crearProducto(datos);
      await cargarProductos(); // Recargar lista
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear producto');
      return false;
    } finally {
      setLoading(false);
    }
  }, [cargarProductos]);

  // Actualizar producto
  const actualizarProducto = useCallback(async (id: string, datos: Partial<ProductoFormData>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const productoActualizado = await productosService.actualizarProducto(id, datos);
      if (productoActualizado) {
        await cargarProductos(); // Recargar lista
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar producto');
      return false;
    } finally {
      setLoading(false);
    }
  }, [cargarProductos]);

  // Eliminar producto
  const eliminarProducto = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const eliminado = await productosService.eliminarProducto(id);
      if (eliminado) {
        await cargarProductos(); // Recargar lista
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar producto');
      return false;
    } finally {
      setLoading(false);
    }
  }, [cargarProductos]);

  // Duplicar producto
  const duplicarProducto = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const productoDuplicado = await productosService.duplicarProducto(id);
      if (productoDuplicado) {
        await cargarProductos(); // Recargar lista
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al duplicar producto');
      return false;
    } finally {
      setLoading(false);
    }
  }, [cargarProductos]);

  // Obtener producto por ID
  const obtenerProducto = useCallback(async (id: string): Promise<Producto | null> => {
    try {
      return await productosService.obtenerProductoPorId(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener producto');
      return null;
    }
  }, []);

  // Aplicar filtros
  const aplicarFiltros = useCallback((nuevosFiltros: FiltrosProductos) => {
    setFiltros(nuevosFiltros);
    setPaginaActual(1); // Resetear a primera página
    cargarProductos(nuevosFiltros, orden, 1);
  }, [cargarProductos, orden]);

  // Aplicar ordenamiento
  const aplicarOrden = useCallback((nuevoOrden: OrdenProductos) => {
    setOrden(nuevoOrden);
    setPaginaActual(1); // Resetear a primera página
    cargarProductos(filtros, nuevoOrden, 1);
  }, [cargarProductos, filtros]);

  // Cambiar página
  const cambiarPagina = useCallback((nuevaPagina: number) => {
    setPaginaActual(nuevaPagina);
    cargarProductos(filtros, orden, nuevaPagina);
  }, [cargarProductos, filtros, orden]);

  // Limpiar filtros
  const limpiarFiltros = useCallback(() => {
    const filtrosVacios: FiltrosProductos = {};
    setFiltros(filtrosVacios);
    setPaginaActual(1);
    cargarProductos(filtrosVacios, orden, 1);
  }, [cargarProductos, orden]);

  // Efecto inicial
  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  return {
    // Estados
    productos,
    categorias,
    loading,
    error,
    totalProductos,
    totalPaginas,
    paginaActual,
    filtros,
    orden,

    // Acciones
    cargarProductos,
    cargarCategorias,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    duplicarProducto,
    obtenerProducto,
    aplicarFiltros,
    aplicarOrden,
    cambiarPagina,
    limpiarFiltros,

    // Utilidades
    setError: (error: string | null) => setError(error)
  };
};

export const useEstadisticasProductos = () => {
  const [estadisticas, setEstadisticas] = useState<EstadisticasResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarEstadisticas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productosService.obtenerEstadisticas();
      setEstadisticas(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarEstadisticas();
  }, [cargarEstadisticas]);

  return {
    estadisticas,
    loading,
    error,
    cargarEstadisticas
  };
};

export const useStock = () => {
  const [movimientos, setMovimientos] = useState<MovimientoStock[]>([]);
  const [alertas, setAlertas] = useState<AlertaStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarMovimientos = useCallback(async (productoId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const movimientosData = await productosService.obtenerMovimientosStock(productoId);
      setMovimientos(movimientosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar movimientos');
    } finally {
      setLoading(false);
    }
  }, []);

  const cargarAlertas = useCallback(async () => {
    try {
      const alertasData = await productosService.obtenerAlertas();
      setAlertas(alertasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar alertas');
    }
  }, []);

  const actualizarStock = useCallback(async (
    productoId: string, 
    nuevaCantidad: number, 
    motivo: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const movimiento = await productosService.actualizarStock(productoId, nuevaCantidad, motivo);
      if (movimiento) {
        await cargarMovimientos();
        await cargarAlertas();
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar stock');
      return false;
    } finally {
      setLoading(false);
    }
  }, [cargarMovimientos, cargarAlertas]);

  const marcarAlertaLeida = useCallback(async (alertaId: string): Promise<boolean> => {
    try {
      const marcada = await productosService.marcarAlertaComoLeida(alertaId);
      if (marcada) {
        await cargarAlertas();
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al marcar alerta');
      return false;
    }
  }, [cargarAlertas]);

  useEffect(() => {
    cargarMovimientos();
    cargarAlertas();
  }, [cargarMovimientos, cargarAlertas]);

  return {
    movimientos,
    alertas,
    loading,
    error,
    cargarMovimientos,
    cargarAlertas,
    actualizarStock,
    marcarAlertaLeida
  };
};