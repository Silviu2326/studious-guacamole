// API service para Gastos Profesionales (Entrenadores)
// En producción, estas llamadas se harían a un backend real

import { GastoProfesional, ResumenGastos, CategoriaGasto } from '../types';

const API_BASE_URL = '/api/finanzas';

// Mock delay para simular llamadas API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const gastosProfesionalesApi = {
  // Obtener todos los gastos profesionales del entrenador
  async obtenerGastos(entrenadorId: string): Promise<GastoProfesional[]> {
    await delay(500);
    
    const hoy = new Date();
    const addDays = (days: number) => {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() + days);
      return fecha.toISOString().split('T')[0];
    };
    
    return [
      {
        id: '1',
        concepto: 'Suscripción MyFitnessPal Pro',
        categoria: 'software',
        monto: 49.99,
        fecha: addDays(-10),
        descripcion: 'Suscripción anual para seguimiento nutricional',
        factura: 'FAC-2024-001',
        entrenadorId
      },
      {
        id: '2',
        concepto: 'Curso de Nutrición Deportiva',
        categoria: 'formacion',
        monto: 299.00,
        fecha: addDays(-25),
        descripcion: 'Curso online certificado',
        factura: 'FAC-2024-002',
        entrenadorId
      },
      {
        id: '3',
        concepto: 'Material de Entrenamiento',
        categoria: 'equipamiento',
        monto: 450.00,
        fecha: addDays(-5),
        descripcion: 'Kettlebells, bandas de resistencia',
        factura: 'FAC-2024-003',
        entrenadorId
      },
      {
        id: '4',
        concepto: 'Publicidad en Instagram',
        categoria: 'marketing',
        monto: 150.00,
        fecha: addDays(-15),
        descripcion: 'Campaña promocional',
        entrenadorId
      },
      {
        id: '5',
        concepto: 'Seguro de Responsabilidad Civil',
        categoria: 'seguro',
        monto: 350.00,
        fecha: addDays(-60),
        descripcion: 'Seguro anual',
        factura: 'FAC-2024-004',
        entrenadorId
      },
      {
        id: '6',
        concepto: 'Combustible',
        categoria: 'transporte',
        monto: 120.00,
        fecha: addDays(-3),
        descripcion: 'Desplazamientos a domicilios',
        entrenadorId
      },
      {
        id: '7',
        concepto: 'Suplementos para demostraciones',
        categoria: 'nutricion',
        monto: 85.50,
        fecha: addDays(-7),
        descripcion: 'Muestras para clientes',
        entrenadorId
      },
      {
        id: '8',
        concepto: 'Certificación FEDA',
        categoria: 'formacion',
        monto: 450.00,
        fecha: addDays(-90),
        descripcion: 'Renovación certificación',
        factura: 'FAC-2024-005',
        entrenadorId
      }
    ];
  },

  // Obtener resumen de gastos
  async obtenerResumenGastos(entrenadorId: string, periodo: 'mes' | 'trimestre' | 'año' = 'mes'): Promise<ResumenGastos> {
    await delay(400);
    const gastos = await this.obtenerGastos(entrenadorId);
    
    // Calcular totales por categoría
    const porCategoria: Record<CategoriaGasto, number> = {
      equipamiento: 0,
      formacion: 0,
      marketing: 0,
      software: 0,
      transporte: 0,
      seguro: 0,
      nutricion: 0,
      otros: 0
    };
    
    gastos.forEach(gasto => {
      porCategoria[gasto.categoria] = (porCategoria[gasto.categoria] || 0) + gasto.monto;
    });
    
    // Calcular por período (últimos 6 meses)
    const porPeriodo: { mes: string; total: number }[] = [];
    const hoy = new Date();
    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setMonth(fecha.getMonth() - i);
      const mesKey = fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
      const mesInicio = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
      const mesFin = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
      
      const totalMes = gastos
        .filter(g => {
          const fechaGasto = new Date(g.fecha);
          return fechaGasto >= mesInicio && fechaGasto <= mesFin;
        })
        .reduce((sum, g) => sum + g.monto, 0);
      
      porPeriodo.push({ mes: mesKey, total: totalMes });
    }
    
    // Calcular período actual
    const mesActual = new Date();
    const mesActualInicio = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1);
    const mesActualFin = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0);
    const mesAnteriorInicio = new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1);
    const mesAnteriorFin = new Date(mesActual.getFullYear(), mesActual.getMonth(), 0);
    
    const totalActual = gastos
      .filter(g => {
        const fechaGasto = new Date(g.fecha);
        return fechaGasto >= mesActualInicio && fechaGasto <= mesActualFin;
      })
      .reduce((sum, g) => sum + g.monto, 0);
    
    const totalAnterior = gastos
      .filter(g => {
        const fechaGasto = new Date(g.fecha);
        return fechaGasto >= mesAnteriorInicio && fechaGasto <= mesAnteriorFin;
      })
      .reduce((sum, g) => sum + g.monto, 0);
    
    const variacion = totalAnterior > 0 
      ? ((totalActual - totalAnterior) / totalAnterior) * 100 
      : 0;
    
    const total = gastos.reduce((sum, g) => sum + g.monto, 0);
    
    return {
      total,
      porCategoria,
      porPeriodo,
      periodoActual: {
        mes: mesActual.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' }),
        total: totalActual,
        variacion
      }
    };
  },

  // Crear nuevo gasto
  async crearGasto(gasto: Omit<GastoProfesional, 'id'>): Promise<GastoProfesional> {
    await delay(300);
    // En producción: POST ${API_BASE_URL}/gastos-profesionales
    // return await fetch(...).then(res => res.json());
    
    return {
      id: `gasto-${Date.now()}`,
      ...gasto
    };
  },

  // Actualizar gasto
  async actualizarGasto(id: string, gasto: Partial<GastoProfesional>): Promise<GastoProfesional> {
    await delay(300);
    // En producción: PATCH ${API_BASE_URL}/gastos-profesionales/${id}
    // return await fetch(...).then(res => res.json());
    
    const gastos = await this.obtenerGastos(gasto.entrenadorId || '');
    const gastoExistente = gastos.find(g => g.id === id);
    if (!gastoExistente) throw new Error('Gasto no encontrado');
    
    return {
      ...gastoExistente,
      ...gasto
    };
  },

  // Eliminar gasto
  async eliminarGasto(id: string): Promise<void> {
    await delay(300);
    // En producción: DELETE ${API_BASE_URL}/gastos-profesionales/${id}
    // await fetch(...);
  }
};

