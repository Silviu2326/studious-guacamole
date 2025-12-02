// Tipos para paquetes prepago

export interface PaquetePrepago {
  id: string;
  clienteId: string;
  clienteNombre: string;
  nombrePaquete: string;
  sesionesTotales: number;
  sesionesUsadas: number;
  sesionesDisponibles: number;
  precioTotal: number;
  precioPorSesion: number;
  fechaCompra: Date;
  fechaVencimiento?: Date;
  estado: 'activo' | 'vencido' | 'agotado' | 'cancelado';
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DescuentoSesion {
  paqueteId: string;
  sesionesAntes: number;
  sesionesDespues: number;
  sesionesDescontadas: number;
  fechaDescuento: Date;
}


