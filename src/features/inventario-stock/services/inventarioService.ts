// Servicio de Inventario con datos mock para desarrollo
import {
  Producto,
  MovimientoStock,
  AlertaStock,
  FiltroProductos,
  FiltroMovimientos,
  FiltroAlertas,
} from '../types';

// Mock data
const mockProductos: Producto[] = [
  {
    id: '1',
    nombre: 'Proteína Whey 1kg',
    codigo: 'SUP-001',
    categoria: 'Suplementos',
    stockActual: 45,
    stockMinimo: 30,
    stockMaximo: 100,
    unidad: 'unidad',
    precioCompra: 85000,
    precioVenta: 120000,
    proveedor: 'Proveedor ABC',
    ubicacion: 'Almacén A',
    tieneCaducidad: true,
    fechaCaducidad: new Date('2025-12-31'),
    fechaUltimaEntrada: new Date('2024-10-15'),
    fechaUltimaSalida: new Date('2024-10-20'),
    estado: 'disponible',
  },
  {
    id: '2',
    nombre: 'Creatina Monohidrato 300g',
    codigo: 'SUP-002',
    categoria: 'Suplementos',
    stockActual: 12,
    stockMinimo: 20,
    stockMaximo: 50,
    unidad: 'unidad',
    precioCompra: 45000,
    precioVenta: 65000,
    proveedor: 'Proveedor ABC',
    ubicacion: 'Almacén A',
    tieneCaducidad: true,
    fechaCaducidad: new Date('2026-06-30'),
    fechaUltimaEntrada: new Date('2024-09-10'),
    fechaUltimaSalida: new Date('2024-10-18'),
    estado: 'bajo_stock',
  },
  {
    id: '3',
    nombre: 'Camiseta Deportiva M',
    codigo: 'ROPA-001',
    categoria: 'Ropa Deportiva',
    stockActual: 25,
    stockMinimo: 10,
    stockMaximo: 80,
    unidad: 'unidad',
    precioCompra: 35000,
    precioVenta: 55000,
    proveedor: 'Moda Deportiva S.A.',
    ubicacion: 'Almacén B',
    tieneCaducidad: false,
    fechaUltimaEntrada: new Date('2024-09-25'),
    fechaUltimaSalida: new Date('2024-10-19'),
    estado: 'disponible',
  },
  {
    id: '4',
    nombre: 'Botella Agua 500ml',
    codigo: 'BEB-001',
    categoria: 'Bebidas',
    stockActual: 5,
    stockMinimo: 50,
    stockMaximo: 200,
    unidad: 'unidad',
    precioCompra: 2000,
    precioVenta: 3500,
    proveedor: 'Agua Premium',
    ubicacion: 'Almacén A',
    tieneCaducidad: true,
    fechaCaducidad: new Date('2025-08-15'),
    fechaUltimaEntrada: new Date('2024-10-01'),
    fechaUltimaSalida: new Date('2024-10-21'),
    estado: 'bajo_stock',
  },
  {
    id: '5',
    nombre: 'Shaker Protein 500ml',
    codigo: 'ACC-001',
    categoria: 'Accesorios',
    stockActual: 0,
    stockMinimo: 15,
    stockMaximo: 50,
    unidad: 'unidad',
    precioCompra: 15000,
    precioVenta: 25000,
    proveedor: 'Accesorios Fitness',
    ubicacion: 'Almacén B',
    tieneCaducidad: false,
    fechaUltimaEntrada: new Date('2024-08-20'),
    fechaUltimaSalida: new Date('2024-10-15'),
    estado: 'agotado',
  },
];

const mockMovimientos: MovimientoStock[] = [
  {
    id: '1',
    fecha: new Date('2024-10-15T10:30:00'),
    productoId: '1',
    productoNombre: 'Proteína Whey 1kg',
    tipo: 'entrada',
    cantidad: 50,
    cantidadAnterior: 20,
    cantidadNueva: 70,
    motivo: 'Compra proveedor',
    referencia: 'FAC-2024-001',
    usuario: 'admin1',
    costoUnitario: 85000,
    observaciones: 'Lote nuevo',
  },
  {
    id: '2',
    fecha: new Date('2024-10-20T14:15:00'),
    productoId: '1',
    productoNombre: 'Proteína Whey 1kg',
    tipo: 'salida',
    cantidad: 25,
    cantidadAnterior: 70,
    cantidadNueva: 45,
    motivo: 'Venta',
    referencia: 'VENT-2024-045',
    usuario: 'vendedor1',
  },
  {
    id: '3',
    fecha: new Date('2024-10-18T11:20:00'),
    productoId: '2',
    productoNombre: 'Creatina Monohidrato 300g',
    tipo: 'salida',
    cantidad: 5,
    cantidadAnterior: 17,
    cantidadNueva: 12,
    motivo: 'Venta',
    referencia: 'VENT-2024-042',
    usuario: 'vendedor1',
  },
];

const mockAlertas: AlertaStock[] = [
  {
    id: '1',
    tipo: 'stock_bajo',
    productoId: '2',
    productoNombre: 'Creatina Monohidrato 300g',
    severidad: 'media',
    mensaje: 'Stock por debajo del mínimo (12/20)',
    fechaGeneracion: new Date('2024-10-18T10:00:00'),
    stockActual: 12,
    stockMinimo: 20,
    resuelta: false,
  },
  {
    id: '2',
    tipo: 'stock_bajo',
    productoId: '4',
    productoNombre: 'Botella Agua 500ml',
    severidad: 'alta',
    mensaje: 'Stock crítico por debajo del mínimo (5/50)',
    fechaGeneracion: new Date('2024-10-19T08:00:00'),
    stockActual: 5,
    stockMinimo: 50,
    resuelta: false,
  },
  {
    id: '3',
    tipo: 'stock_agotado',
    productoId: '5',
    productoNombre: 'Shaker Protein 500ml',
    severidad: 'critica',
    mensaje: 'Producto agotado',
    fechaGeneracion: new Date('2024-10-15T16:00:00'),
    stockActual: 0,
    stockMinimo: 15,
    resuelta: false,
  },
];

export class InventarioService {
  // Productos
  static async obtenerProductos(filtros?: FiltroProductos): Promise<Producto[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let productos = [...mockProductos];
    
    if (filtros) {
      if (filtros.busqueda) {
        const busqueda = filtros.busqueda.toLowerCase();
        productos = productos.filter(p => 
          p.nombre.toLowerCase().includes(busqueda) ||
          p.codigo.toLowerCase().includes(busqueda)
        );
      }
      if (filtros.categoria) {
        productos = productos.filter(p => p.categoria === filtros.categoria);
      }
      if (filtros.estado) {
        productos = productos.filter(p => p.estado === filtros.estado);
      }
      if (filtros.stockBajo) {
        productos = productos.filter(p => p.stockActual < p.stockMinimo);
      }
      if (filtros.proximosVencer) {
        const hoy = new Date();
        const en30Dias = new Date();
        en30Dias.setDate(hoy.getDate() + 30);
        productos = productos.filter(p => 
          p.tieneCaducidad &&
          p.fechaCaducidad &&
          p.fechaCaducidad >= hoy &&
          p.fechaCaducidad <= en30Dias
        );
      }
      if (filtros.ubicacion) {
        productos = productos.filter(p => p.ubicacion === filtros.ubicacion);
      }
      if (filtros.proveedor) {
        productos = productos.filter(p => p.proveedor === filtros.proveedor);
      }
    }
    
    return productos;
  }

  static async obtenerProducto(id: string): Promise<Producto> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const producto = mockProductos.find(p => p.id === id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    
    return producto;
  }

  static async crearProducto(producto: Omit<Producto, 'id'>): Promise<Producto> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const nuevoProducto: Producto = {
      ...producto,
      id: Date.now().toString(),
    };
    
    mockProductos.push(nuevoProducto);
    return nuevoProducto;
  }

  static async actualizarProducto(id: string, datos: Partial<Producto>): Promise<Producto> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = mockProductos.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Producto no encontrado');
    }
    
    mockProductos[index] = { ...mockProductos[index], ...datos };
    return mockProductos[index];
  }

  static async actualizarStock(
    id: string, 
    cantidad: number, 
    motivo: string,
    tipo: MovimientoStock['tipo'] = 'ajuste'
  ): Promise<{ producto: Producto; movimiento: MovimientoStock }> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const producto = await this.obtenerProducto(id);
    const cantidadAnterior = producto.stockActual;
    const cantidadNueva = cantidad;
    
    // Actualizar producto
    producto.stockActual = cantidadNueva;
    
    // Actualizar estado según stock
    if (cantidadNueva === 0) {
      producto.estado = 'agotado';
    } else if (cantidadNueva < producto.stockMinimo) {
      producto.estado = 'bajo_stock';
    } else {
      producto.estado = 'disponible';
    }
    
    // Crear movimiento
    const movimiento: MovimientoStock = {
      id: Date.now().toString(),
      fecha: new Date(),
      productoId: id,
      productoNombre: producto.nombre,
      tipo,
      cantidad: Math.abs(cantidadNueva - cantidadAnterior),
      cantidadAnterior,
      cantidadNueva,
      motivo,
      usuario: 'admin1', // En producción, obtener del contexto de usuario
    };
    
    mockMovimientos.unshift(movimiento);
    
    return { producto, movimiento };
  }

  // Movimientos
  static async obtenerMovimientos(filtros?: FiltroMovimientos): Promise<MovimientoStock[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let movimientos = [...mockMovimientos];
    
    if (filtros) {
      if (filtros.fechaInicio) {
        movimientos = movimientos.filter(m => m.fecha >= filtros.fechaInicio!);
      }
      if (filtros.fechaFin) {
        movimientos = movimientos.filter(m => m.fecha <= filtros.fechaFin!);
      }
      if (filtros.productoId) {
        movimientos = movimientos.filter(m => m.productoId === filtros.productoId);
      }
      if (filtros.tipo) {
        movimientos = movimientos.filter(m => m.tipo === filtros.tipo);
      }
      if (filtros.usuario) {
        movimientos = movimientos.filter(m => m.usuario === filtros.usuario);
      }
    }
    
    return movimientos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  }

  // Caducidades
  static async obtenerCaducidades(dias: number = 30): Promise<Producto[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const hoy = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(hoy.getDate() + dias);
    
    return mockProductos.filter(p => 
      p.tieneCaducidad &&
      p.fechaCaducidad &&
      p.fechaCaducidad >= hoy &&
      p.fechaCaducidad <= fechaLimite
    );
  }

  // Alertas
  static async obtenerAlertas(filtros?: FiltroAlertas): Promise<AlertaStock[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let alertas = [...mockAlertas];
    
    if (filtros) {
      if (filtros.tipo) {
        alertas = alertas.filter(a => a.tipo === filtros.tipo);
      }
      if (filtros.severidad) {
        alertas = alertas.filter(a => a.severidad === filtros.severidad);
      }
      if (filtros.resuelta !== undefined) {
        alertas = alertas.filter(a => a.resuelta === filtros.resuelta);
      }
      if (filtros.productoId) {
        alertas = alertas.filter(a => a.productoId === filtros.productoId);
      }
    }
    
    return alertas.sort((a, b) => {
      const severidadOrder = { critica: 0, alta: 1, media: 2, baja: 3 };
      return severidadOrder[a.severidad] - severidadOrder[b.severidad];
    });
  }

  static async resolverAlerta(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const alerta = mockAlertas.find(a => a.id === id);
    if (alerta) {
      alerta.resuelta = true;
      alerta.fechaResolucion = new Date();
    }
  }

  // Estadísticas
  static async obtenerEstadisticas() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const totalProductos = mockProductos.length;
    const productosBajoStock = mockProductos.filter(p => p.stockActual < p.stockMinimo).length;
    const productosAgotados = mockProductos.filter(p => p.stockActual === 0).length;
    
    const hoy = new Date();
    const en30Dias = new Date();
    en30Dias.setDate(hoy.getDate() + 30);
    const productosProximosVencer = mockProductos.filter(p => 
      p.tieneCaducidad &&
      p.fechaCaducidad &&
      p.fechaCaducidad >= hoy &&
      p.fechaCaducidad <= en30Dias
    ).length;
    
    const valorTotal = mockProductos.reduce((sum, p) => 
      sum + (p.stockActual * (p.precioCompra || 0)), 0
    );
    
    const movimientosUltimos7Dias = mockMovimientos.filter(m => {
      const fecha = new Date(m.fecha);
      const hace7Dias = new Date();
      hace7Dias.setDate(hace7Dias.getDate() - 7);
      return fecha >= hace7Dias;
    }).length;
    
    return {
      totalProductos,
      productosBajoStock,
      productosAgotados,
      productosProximosVencer,
      valorTotal,
      movimientosUltimos7Dias,
    };
  }
}
