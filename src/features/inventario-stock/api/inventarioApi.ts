// API service para Inventario & Stock
// En producción, estas llamadas se harían a un backend real

import {
  Producto,
  MovimientoStock,
  AlertaStock,
  ReporteInventario,
  AuditoriaInventario,
  FiltroProductos,
  FiltroMovimientos,
  FiltroAlertas,
} from '../types';

const API_BASE_URL = '/api/ventas';

// Mock delay para simular llamadas API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const inventarioApi = {
  // Productos
  async obtenerProductos(filtros?: FiltroProductos): Promise<Producto[]> {
    await delay(500);
    // En producción: GET ${API_BASE_URL}/inventario?...
    return [];
  },

  async obtenerProducto(id: string): Promise<Producto> {
    await delay(300);
    // En producción: GET ${API_BASE_URL}/inventario/${id}
    throw new Error('Not implemented');
  },

  async crearProducto(producto: Omit<Producto, 'id'>): Promise<Producto> {
    await delay(400);
    // En producción: POST ${API_BASE_URL}/inventario
    throw new Error('Not implemented');
  },

  async actualizarProducto(id: string, producto: Partial<Producto>): Promise<Producto> {
    await delay(400);
    // En producción: PUT ${API_BASE_URL}/inventario/${id}
    throw new Error('Not implemented');
  },

  async eliminarProducto(id: string): Promise<void> {
    await delay(300);
    // En producción: DELETE ${API_BASE_URL}/inventario/${id}
    throw new Error('Not implemented');
  },

  async actualizarStock(id: string, cantidad: number, motivo: string): Promise<Producto> {
    await delay(400);
    // En producción: POST ${API_BASE_URL}/stock
    throw new Error('Not implemented');
  },

  // Movimientos de stock
  async obtenerMovimientos(filtros?: FiltroMovimientos): Promise<MovimientoStock[]> {
    await delay(500);
    // En producción: GET ${API_BASE_URL}/movimientos?...
    return [];
  },

  async crearMovimiento(movimiento: Omit<MovimientoStock, 'id'>): Promise<MovimientoStock> {
    await delay(400);
    // En producción: POST ${API_BASE_URL}/movimientos
    throw new Error('Not implemented');
  },

  // Caducidades
  async obtenerCaducidades(dias?: number): Promise<Producto[]> {
    await delay(400);
    // En producción: GET ${API_BASE_URL}/caducidades?dias=${dias}
    return [];
  },

  // Alertas
  async obtenerAlertas(filtros?: FiltroAlertas): Promise<AlertaStock[]> {
    await delay(400);
    // En producción: GET ${API_BASE_URL}/alertas?...
    return [];
  },

  async resolverAlerta(id: string): Promise<void> {
    await delay(300);
    // En producción: POST ${API_BASE_URL}/alertas/${id}/resolver
    throw new Error('Not implemented');
  },

  // Reportes
  async generarReporte(tipo: string, periodo: string): Promise<ReporteInventario> {
    await delay(800);
    // En producción: POST ${API_BASE_URL}/reportes
    throw new Error('Not implemented');
  },

  // Auditoría
  async crearAuditoria(auditoria: Omit<AuditoriaInventario, 'id'>): Promise<AuditoriaInventario> {
    await delay(600);
    // En producción: POST ${API_BASE_URL}/auditoria
    throw new Error('Not implemented');
  },
};
