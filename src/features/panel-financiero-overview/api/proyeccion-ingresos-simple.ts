// API service para Proyección de Ingresos Simple
// Calcula ingreso esperado con número de clientes activos, precio medio y frecuencia

import { ProyeccionIngresosSimple } from '../types';
import { getActiveClients } from '../../gestión-de-clientes/api/clients';

const API_BASE_URL = '/api/finanzas';

// Mock delay para simular llamadas API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper para obtener suscripciones activas (mock por ahora)
const obtenerSuscripcionesActivas = async (userId?: string) => {
  // En producción, esto vendría de la API de suscripciones
  await delay(200);
  
  // Mock data - simula suscripciones activas con diferentes frecuencias
  return [
    { clienteId: 'c1', precio: 150, frecuencia: 'mensual' as const },
    { clienteId: 'c2', precio: 200, frecuencia: 'mensual' as const },
    { clienteId: 'c3', precio: 180, frecuencia: 'mensual' as const },
    { clienteId: 'c4', precio: 500, frecuencia: 'trimestral' as const },
    { clienteId: 'c5', precio: 120, frecuencia: 'mensual' as const },
    { clienteId: 'c6', precio: 900, frecuencia: 'semestral' as const },
    { clienteId: 'c7', precio: 150, frecuencia: 'mensual' as const },
    { clienteId: 'c8', precio: 1600, frecuencia: 'anual' as const },
  ];
};

export const proyeccionIngresosSimpleApi = {
  // Obtener proyección de ingresos simple para el próximo mes
  async obtenerProyeccionIngresosSimple(userId?: string): Promise<ProyeccionIngresosSimple> {
    await delay(500);
    
    try {
      // Obtener clientes activos
      const clientesActivos = await getActiveClients('entrenador', userId);
      
      // Obtener suscripciones activas (en producción, esto vendría de la API real)
      const suscripciones = await obtenerSuscripcionesActivas(userId);
      
      // Calcular el próximo mes
      const hoy = new Date();
      const proximoMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1);
      const nombreMes = proximoMes.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      
      // Agrupar por frecuencia de pago
      const desglosePorFrecuencia: Record<string, { clientes: number; totalPrecio: number }> = {
        mensual: { clientes: 0, totalPrecio: 0 },
        trimestral: { clientes: 0, totalPrecio: 0 },
        semestral: { clientes: 0, totalPrecio: 0 },
        anual: { clientes: 0, totalPrecio: 0 },
      };
      
      suscripciones.forEach(sub => {
        const freq = sub.frecuencia;
        if (desglosePorFrecuencia[freq]) {
          desglosePorFrecuencia[freq].clientes++;
          desglosePorFrecuencia[freq].totalPrecio += sub.precio;
        }
      });
      
      // Calcular ingresos esperados para el próximo mes
      // Para mensual: se cobra completo
      // Para trimestral: se cobra 1/3
      // Para semestral: se cobra 1/6
      // Para anual: se cobra 1/12
      let ingresosEsperados = 0;
      const desglose = Object.entries(desglosePorFrecuencia).map(([freq, data]) => {
        let ingresosFreq = 0;
        const precioPromedio = data.clientes > 0 ? data.totalPrecio / data.clientes : 0;
        
        switch (freq) {
          case 'mensual':
            ingresosFreq = data.totalPrecio;
            break;
          case 'trimestral':
            ingresosFreq = data.totalPrecio / 3;
            break;
          case 'semestral':
            ingresosFreq = data.totalPrecio / 6;
            break;
          case 'anual':
            ingresosFreq = data.totalPrecio / 12;
            break;
        }
        
        ingresosEsperados += ingresosFreq;
        
        return {
          frecuencia: freq as 'mensual' | 'trimestral' | 'semestral' | 'anual',
          numeroClientes: data.clientes,
          precioPromedio: Math.round(precioPromedio * 100) / 100,
          ingresosEsperados: Math.round(ingresosFreq * 100) / 100,
        };
      }).filter(d => d.numeroClientes > 0);
      
      // Calcular precio medio general
      const totalPrecio = suscripciones.reduce((sum, sub) => sum + sub.precio, 0);
      const precioMedio = suscripciones.length > 0 ? totalPrecio / suscripciones.length : 0;
      
      // Determinar frecuencia más común
      const frecuencias = suscripciones.map(sub => sub.frecuencia);
      const frecuenciaMasComun = frecuencias.reduce((a, b, _, arr) =>
        arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
      , 'mensual' as 'mensual' | 'trimestral' | 'semestral' | 'anual');
      
      return {
        mesProyeccion: nombreMes,
        numeroClientesActivos: clientesActivos.length,
        precioMedio: Math.round(precioMedio * 100) / 100,
        frecuenciaPago: frecuenciaMasComun,
        ingresosEsperados: Math.round(ingresosEsperados * 100) / 100,
        desglosePorFrecuencia: desglose,
        fechaCalculo: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error obteniendo proyección de ingresos:', error);
      // Fallback a datos mock
      return {
        mesProyeccion: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
          .toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
        numeroClientesActivos: 8,
        precioMedio: 200,
        frecuenciaPago: 'mensual',
        ingresosEsperados: 1600,
        desglosePorFrecuencia: [
          {
            frecuencia: 'mensual',
            numeroClientes: 5,
            precioPromedio: 160,
            ingresosEsperados: 800,
          },
          {
            frecuencia: 'trimestral',
            numeroClientes: 1,
            precioPromedio: 500,
            ingresosEsperados: 166.67,
          },
        ],
        fechaCalculo: new Date().toISOString(),
      };
    }
  },
};

