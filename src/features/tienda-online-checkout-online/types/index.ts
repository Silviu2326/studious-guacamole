export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen?: string;
  categoria: string;
  tipo: 'servicio' | 'producto-fisico' | 'producto-digital';
  stock?: number;
  disponible: boolean;
  rolPermitido: 'entrenador' | 'gimnasio' | 'ambos';
  metadatos?: {
    duracion?: string;
    planMensual?: boolean;
    envio?: boolean;
    accesoDigital?: boolean;
  };
}

export interface CarritoItem {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

export interface Carrito {
  items: CarritoItem[];
  subtotal: number;
  impuestos: number;
  total: number;
}

export interface MetodoPago {
  id: string;
  nombre: string;
  tipo: 'tarjeta' | 'paypal' | 'transferencia';
  disponible: boolean;
  icono?: string;
}

export interface DatosCheckout {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  pais: string;
  metodoPago: string;
  terminosAceptados: boolean;
}

export interface Venta {
  id: string;
  fecha: Date;
  cliente: {
    nombre: string;
    email: string;
  };
  productos: CarritoItem[];
  subtotal: number;
  impuestos: number;
  total: number;
  metodoPago: string;
  estado: 'pendiente' | 'completada' | 'cancelada' | 'reembolsada';
  facturaId?: string;
  tracking?: string;
}

export interface FiltrosProductos {
  categoria?: string;
  tipo?: 'servicio' | 'producto-fisico' | 'producto-digital';
  busqueda?: string;
  precioMin?: number;
  precioMax?: number;
  disponible?: boolean;
}

