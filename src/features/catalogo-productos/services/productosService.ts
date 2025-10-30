import { 
  Producto, 
  Categoria, 
  ProductosResponse, 
  CategoriasResponse, 
  EstadisticasResponse,
  FiltrosProductos,
  OrdenProductos,
  ProductoFormData,
  CategoriaFormData,
  MovimientoStock,
  AlertaStock
} from '../types';
import { 
  productosMock, 
  categoriasMock, 
  movimientosStockMock, 
  alertasStockMock 
} from '../data/mockData';

class ProductosService {
  private productos: Producto[] = [...productosMock];
  private categorias: Categoria[] = [...categoriasMock];
  private movimientosStock: MovimientoStock[] = [...movimientosStockMock];
  private alertasStock: AlertaStock[] = [...alertasStockMock];

  // Productos
  async obtenerProductos(
    filtros: FiltrosProductos = {},
    orden: OrdenProductos = { campo: 'nombre', direccion: 'asc' },
    pagina: number = 1,
    limite: number = 10
  ): Promise<ProductosResponse> {
    let productosFiltrados = [...this.productos];

    // Aplicar filtros
    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      productosFiltrados = productosFiltrados.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.descripcion.toLowerCase().includes(busqueda) ||
        producto.sku.toLowerCase().includes(busqueda) ||
        producto.tags.some(tag => tag.toLowerCase().includes(busqueda))
      );
    }

    if (filtros.categoria) {
      productosFiltrados = productosFiltrados.filter(producto =>
        producto.categoria === filtros.categoria
      );
    }

    if (filtros.subcategoria) {
      productosFiltrados = productosFiltrados.filter(producto =>
        producto.subcategoria === filtros.subcategoria
      );
    }

    if (filtros.precioMin !== undefined) {
      productosFiltrados = productosFiltrados.filter(producto =>
        producto.precio >= filtros.precioMin!
      );
    }

    if (filtros.precioMax !== undefined) {
      productosFiltrados = productosFiltrados.filter(producto =>
        producto.precio <= filtros.precioMax!
      );
    }

    if (filtros.enStock !== undefined) {
      productosFiltrados = productosFiltrados.filter(producto =>
        filtros.enStock ? producto.stock > 0 : producto.stock === 0
      );
    }

    if (filtros.activos !== undefined) {
      productosFiltrados = productosFiltrados.filter(producto =>
        producto.activo === filtros.activos
      );
    }

    if (filtros.destacados !== undefined) {
      productosFiltrados = productosFiltrados.filter(producto =>
        producto.destacado === filtros.destacados
      );
    }

    if (filtros.marca) {
      productosFiltrados = productosFiltrados.filter(producto =>
        producto.marca?.toLowerCase().includes(filtros.marca!.toLowerCase())
      );
    }

    if (filtros.tags && filtros.tags.length > 0) {
      productosFiltrados = productosFiltrados.filter(producto =>
        filtros.tags!.some(tag => producto.tags.includes(tag))
      );
    }

    // Aplicar ordenamiento
    productosFiltrados.sort((a, b) => {
      let valorA: any = a[orden.campo];
      let valorB: any = b[orden.campo];

      if (orden.campo === 'categoria') {
        const categoriaA = this.categorias.find(c => c.id === a.categoria);
        const categoriaB = this.categorias.find(c => c.id === b.categoria);
        valorA = categoriaA?.nombre || '';
        valorB = categoriaB?.nombre || '';
      }

      if (typeof valorA === 'string') {
        valorA = valorA.toLowerCase();
        valorB = valorB.toLowerCase();
      }

      if (valorA < valorB) return orden.direccion === 'asc' ? -1 : 1;
      if (valorA > valorB) return orden.direccion === 'asc' ? 1 : -1;
      return 0;
    });

    // Paginación
    const inicio = (pagina - 1) * limite;
    const fin = inicio + limite;
    const productosPaginados = productosFiltrados.slice(inicio, fin);

    return {
      productos: productosPaginados,
      total: productosFiltrados.length,
      pagina,
      totalPaginas: Math.ceil(productosFiltrados.length / limite)
    };
  }

  async obtenerProductoPorId(id: string): Promise<Producto | null> {
    return this.productos.find(producto => producto.id === id) || null;
  }

  async crearProducto(datos: ProductoFormData): Promise<Producto> {
    const nuevoProducto: Producto = {
      id: Date.now().toString(),
      ...datos,
      imagenes: datos.imagenes.map(file => `/uploads/${file.name}`), // Simular upload
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      especificaciones: datos.especificaciones || {}
    };

    this.productos.push(nuevoProducto);
    await this.actualizarContadorCategorias();
    return nuevoProducto;
  }

  async actualizarProducto(id: string, datos: Partial<ProductoFormData>): Promise<Producto | null> {
    const indice = this.productos.findIndex(producto => producto.id === id);
    if (indice === -1) return null;

    const productoActualizado = {
      ...this.productos[indice],
      ...datos,
      fechaActualizacion: new Date(),
      imagenes: datos.imagenes ? datos.imagenes.map(file => `/uploads/${file.name}`) : this.productos[indice].imagenes
    };

    this.productos[indice] = productoActualizado;
    await this.actualizarContadorCategorias();
    return productoActualizado;
  }

  async eliminarProducto(id: string): Promise<boolean> {
    const indice = this.productos.findIndex(producto => producto.id === id);
    if (indice === -1) return false;

    this.productos.splice(indice, 1);
    await this.actualizarContadorCategorias();
    return true;
  }

  async duplicarProducto(id: string): Promise<Producto | null> {
    const producto = await this.obtenerProductoPorId(id);
    if (!producto) return null;

    const productoDuplicado: Producto = {
      ...producto,
      id: Date.now().toString(),
      nombre: `${producto.nombre} (Copia)`,
      sku: `${producto.sku}-COPY`,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    };

    this.productos.push(productoDuplicado);
    await this.actualizarContadorCategorias();
    return productoDuplicado;
  }

  // Categorías
  async obtenerCategorias(): Promise<CategoriasResponse> {
    return {
      categorias: this.categorias,
      total: this.categorias.length
    };
  }

  async crearCategoria(datos: CategoriaFormData): Promise<Categoria> {
    const nuevaCategoria: Categoria = {
      id: Date.now().toString(),
      ...datos,
      orden: this.categorias.length + 1,
      cantidadProductos: 0
    };

    this.categorias.push(nuevaCategoria);
    return nuevaCategoria;
  }

  async actualizarCategoria(id: string, datos: Partial<CategoriaFormData>): Promise<Categoria | null> {
    const indice = this.categorias.findIndex(categoria => categoria.id === id);
    if (indice === -1) return null;

    this.categorias[indice] = { ...this.categorias[indice], ...datos };
    return this.categorias[indice];
  }

  async eliminarCategoria(id: string): Promise<boolean> {
    const indice = this.categorias.findIndex(categoria => categoria.id === id);
    if (indice === -1) return false;

    // Verificar que no tenga productos asociados
    const productosEnCategoria = this.productos.filter(producto => 
      producto.categoria === id || producto.subcategoria === id
    );
    
    if (productosEnCategoria.length > 0) {
      throw new Error('No se puede eliminar una categoría que tiene productos asociados');
    }

    this.categorias.splice(indice, 1);
    return true;
  }

  // Stock
  async actualizarStock(productoId: string, nuevaCantidad: number, motivo: string): Promise<MovimientoStock | null> {
    const producto = await this.obtenerProductoPorId(productoId);
    if (!producto) return null;

    const cantidadAnterior = producto.stock;
    const diferencia = nuevaCantidad - cantidadAnterior;
    
    const movimiento: MovimientoStock = {
      id: Date.now().toString(),
      productoId,
      tipo: diferencia > 0 ? 'entrada' : diferencia < 0 ? 'salida' : 'ajuste',
      cantidad: Math.abs(diferencia),
      cantidadAnterior,
      cantidadNueva: nuevaCantidad,
      motivo,
      fecha: new Date(),
      usuario: 'admin' // En una app real, obtener del contexto de usuario
    };

    // Actualizar stock del producto
    const indiceProducto = this.productos.findIndex(p => p.id === productoId);
    this.productos[indiceProducto].stock = nuevaCantidad;
    this.productos[indiceProducto].fechaActualizacion = new Date();

    // Registrar movimiento
    this.movimientosStock.push(movimiento);

    // Verificar alertas de stock bajo
    await this.verificarAlertasStock(productoId);

    return movimiento;
  }

  async obtenerMovimientosStock(productoId?: string): Promise<MovimientoStock[]> {
    if (productoId) {
      return this.movimientosStock.filter(mov => mov.productoId === productoId);
    }
    return this.movimientosStock.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  }

  // Alertas
  async obtenerAlertas(): Promise<AlertaStock[]> {
    return this.alertasStock.filter(alerta => !alerta.leida);
  }

  async marcarAlertaComoLeida(alertaId: string): Promise<boolean> {
    const indice = this.alertasStock.findIndex(alerta => alerta.id === alertaId);
    if (indice === -1) return false;

    this.alertasStock[indice].leida = true;
    return true;
  }

  // Estadísticas
  async obtenerEstadisticas(): Promise<EstadisticasResponse> {
    const productosActivos = this.productos.filter(p => p.activo);
    const productosSinStock = this.productos.filter(p => p.stock === 0);
    const productosStockBajo = this.productos.filter(p => p.stock > 0 && p.stock <= p.stockMinimo);
    
    const valorTotalInventario = this.productos.reduce((total, producto) => 
      total + (producto.precio * producto.stock), 0
    );

    const promedioPrecios = this.productos.length > 0 
      ? this.productos.reduce((sum, p) => sum + p.precio, 0) / this.productos.length 
      : 0;

    // Encontrar categoría con más productos
    const contadorCategorias = this.productos.reduce((contador, producto) => {
      contador[producto.categoria] = (contador[producto.categoria] || 0) + 1;
      return contador;
    }, {} as Record<string, number>);

    const categoriaConMasProductosId = Object.keys(contadorCategorias).reduce((a, b) => 
      contadorCategorias[a] > contadorCategorias[b] ? a : b, ''
    );

    const categoriaConMasProductos = this.categorias.find(c => c.id === categoriaConMasProductosId)?.nombre || '';

    return {
      estadisticas: {
        totalProductos: this.productos.length,
        productosActivos: productosActivos.length,
        productosInactivos: this.productos.length - productosActivos.length,
        productosSinStock: productosSinStock.length,
        productosStockBajo: productosStockBajo.length,
        valorTotalInventario,
        categoriaConMasProductos,
        promedioPrecios
      },
      alertas: await this.obtenerAlertas(),
      movimientosRecientes: this.movimientosStock.slice(-10)
    };
  }

  // Métodos privados
  private async actualizarContadorCategorias(): Promise<void> {
    this.categorias.forEach(categoria => {
      categoria.cantidadProductos = this.productos.filter(producto => 
        producto.categoria === categoria.id || producto.subcategoria === categoria.id
      ).length;
    });
  }

  private async verificarAlertasStock(productoId: string): Promise<void> {
    const producto = await this.obtenerProductoPorId(productoId);
    if (!producto) return;

    // Eliminar alertas existentes para este producto
    this.alertasStock = this.alertasStock.filter(alerta => alerta.productoId !== productoId);

    // Crear nueva alerta si es necesario
    if (producto.stock === 0) {
      this.alertasStock.push({
        id: Date.now().toString(),
        productoId,
        tipo: 'sin_stock',
        mensaje: `El producto "${producto.nombre}" está sin stock`,
        fecha: new Date(),
        leida: false,
        accionRequerida: true
      });
    } else if (producto.stock <= producto.stockMinimo) {
      this.alertasStock.push({
        id: Date.now().toString(),
        productoId,
        tipo: 'stock_bajo',
        mensaje: `El producto "${producto.nombre}" tiene stock bajo (${producto.stock} unidades)`,
        fecha: new Date(),
        leida: false,
        accionRequerida: true
      });
    }
  }
}

export const productosService = new ProductosService();