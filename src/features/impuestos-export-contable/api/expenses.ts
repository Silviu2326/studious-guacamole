import { 
  GastoDeducible, 
  FiltroGastos, 
  CrearGastoRequest, 
  ActualizarGastoRequest,
  ResumenGastos,
  CATEGORIAS_GASTO
} from '../types/expenses';

// Mock data para desarrollo
const mockGastos: GastoDeducible[] = [
  {
    id: '1',
    fecha: new Date('2024-01-15'),
    concepto: 'Compra de pesas y mancuernas',
    importe: 150000,
    categoria: 'equipamiento',
    deducible: true,
    notas: 'Pesas de 5kg, 10kg y 15kg',
    archivosAdjuntos: [],
    fechaCreacion: new Date('2024-01-15'),
    fechaActualizacion: new Date('2024-01-15'),
    usuarioCreacion: 'user1'
  },
  {
    id: '2',
    fecha: new Date('2024-01-20'),
    concepto: 'Certificación NASM',
    importe: 350000,
    categoria: 'certificaciones',
    deducible: true,
    notas: 'Renovación de certificación anual',
    archivosAdjuntos: [],
    fechaCreacion: new Date('2024-01-20'),
    fechaActualizacion: new Date('2024-01-20'),
    usuarioCreacion: 'user1'
  },
  {
    id: '3',
    fecha: new Date('2024-02-01'),
    concepto: 'Publicidad en Instagram',
    importe: 50000,
    categoria: 'marketing',
    deducible: true,
    archivosAdjuntos: [],
    fechaCreacion: new Date('2024-02-01'),
    fechaActualizacion: new Date('2024-02-01'),
    usuarioCreacion: 'user1'
  },
  {
    id: '4',
    fecha: new Date('2024-02-05'),
    concepto: 'Combustible para desplazamientos',
    importe: 80000,
    categoria: 'transporte',
    deducible: true,
    notas: 'Combustible del mes de febrero',
    archivosAdjuntos: [],
    fechaCreacion: new Date('2024-02-05'),
    fechaActualizacion: new Date('2024-02-05'),
    usuarioCreacion: 'user1'
  }
];

export const expensesAPI = {
  /**
   * Obtener todos los gastos con filtros opcionales
   */
  async obtenerGastos(filtros?: FiltroGastos): Promise<GastoDeducible[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let gastos = [...mockGastos];
    
    if (filtros) {
      if (filtros.fechaInicio) {
        gastos = gastos.filter(g => g.fecha >= filtros.fechaInicio!);
      }
      if (filtros.fechaFin) {
        const fechaFin = new Date(filtros.fechaFin);
        fechaFin.setHours(23, 59, 59);
        gastos = gastos.filter(g => g.fecha <= fechaFin);
      }
      if (filtros.categoria) {
        gastos = gastos.filter(g => g.categoria === filtros.categoria);
      }
      if (filtros.concepto) {
        gastos = gastos.filter(g => 
          g.concepto.toLowerCase().includes(filtros.concepto!.toLowerCase())
        );
      }
      if (filtros.importeMin !== undefined) {
        gastos = gastos.filter(g => g.importe >= filtros.importeMin!);
      }
      if (filtros.importeMax !== undefined) {
        gastos = gastos.filter(g => g.importe <= filtros.importeMax!);
      }
    }
    
    return gastos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  },

  /**
   * Obtener un gasto por ID
   */
  async obtenerGasto(id: string): Promise<GastoDeducible | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockGastos.find(g => g.id === id) || null;
  },

  /**
   * Crear un nuevo gasto
   */
  async crearGasto(gasto: CrearGastoRequest): Promise<GastoDeducible> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const nuevoGasto: GastoDeducible = {
      ...gasto,
      deducible: gasto.deducible !== undefined ? gasto.deducible : true, // Por defecto, los gastos son deducibles
      id: Date.now().toString(),
      archivosAdjuntos: gasto.archivosAdjuntos || [],
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      usuarioCreacion: 'current-user' // En producción, obtener del contexto de autenticación
    };
    
    mockGastos.push(nuevoGasto);
    return nuevoGasto;
  },

  /**
   * Actualizar un gasto existente
   */
  async actualizarGasto(id: string, datos: ActualizarGastoRequest): Promise<GastoDeducible> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockGastos.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Gasto no encontrado');
    }
    
    mockGastos[index] = {
      ...mockGastos[index],
      ...datos,
      archivosAdjuntos: datos.archivosAdjuntos !== undefined ? datos.archivosAdjuntos : mockGastos[index].archivosAdjuntos,
      fechaActualizacion: new Date()
    };
    
    return mockGastos[index];
  },

  /**
   * Eliminar un gasto
   */
  async eliminarGasto(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockGastos.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Gasto no encontrado');
    }
    
    mockGastos.splice(index, 1);
  },

  /**
   * Obtener resumen de gastos
   */
  async obtenerResumenGastos(filtros?: FiltroGastos): Promise<ResumenGastos> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const gastos = await this.obtenerGastos(filtros);
    
    const totalGastos = gastos.reduce((sum, g) => sum + g.importe, 0);
    const totalGastosDeducibles = gastos.filter(g => g.deducible).reduce((sum, g) => sum + g.importe, 0);
    const totalGastosNoDeducibles = gastos.filter(g => !g.deducible).reduce((sum, g) => sum + g.importe, 0);
    const cantidadGastos = gastos.length;
    const cantidadGastosDeducibles = gastos.filter(g => g.deducible).length;
    const cantidadGastosNoDeducibles = gastos.filter(g => !g.deducible).length;
    const promedioGasto = cantidadGastos > 0 ? totalGastos / cantidadGastos : 0;
    
    // Agrupar por categoría
    const gastosPorCategoria = new Map<string, { total: number; totalDeducible: number; totalNoDeducible: number; cantidad: number }>();
    
    gastos.forEach(gasto => {
      const actual = gastosPorCategoria.get(gasto.categoria) || { total: 0, totalDeducible: 0, totalNoDeducible: 0, cantidad: 0 };
      gastosPorCategoria.set(gasto.categoria, {
        total: actual.total + gasto.importe,
        totalDeducible: actual.totalDeducible + (gasto.deducible ? gasto.importe : 0),
        totalNoDeducible: actual.totalNoDeducible + (!gasto.deducible ? gasto.importe : 0),
        cantidad: actual.cantidad + 1
      });
    });
    
    // Convertir a array y calcular porcentajes
    const gastosPorCategoriaArray = Array.from(gastosPorCategoria.entries())
      .map(([categoria, datos]) => ({
        categoria: categoria as any,
        total: datos.total,
        totalDeducible: datos.totalDeducible,
        totalNoDeducible: datos.totalNoDeducible,
        cantidad: datos.cantidad,
        porcentaje: totalGastos > 0 ? (datos.total / totalGastos) * 100 : 0
      }))
      .sort((a, b) => b.total - a.total);
    
    return {
      totalGastos,
      totalGastosDeducibles,
      totalGastosNoDeducibles,
      cantidadGastos,
      cantidadGastosDeducibles,
      cantidadGastosNoDeducibles,
      gastosPorCategoria: gastosPorCategoriaArray,
      promedioGasto,
      periodo: {
        fechaInicio: filtros?.fechaInicio || new Date(new Date().getFullYear(), 0, 1),
        fechaFin: filtros?.fechaFin || new Date()
      }
    };
  },

  /**
   * Obtener gastos agrupados por mes y categoría para comparación
   */
  async obtenerGastosMensualesPorCategoria(fechaInicio?: Date, fechaFin?: Date): Promise<{
    mes: string;
    año: number;
    mesNumero: number;
    categorias: {
      categoria: CategoriaGasto;
      total: number;
      cantidad: number;
    }[];
  }[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Si no se proporcionan fechas, usar los últimos 6 meses
    const hoy = new Date();
    const fechaInicioDefault = fechaInicio || new Date(hoy.getFullYear(), hoy.getMonth() - 5, 1);
    const fechaFinDefault = fechaFin || hoy;
    
    const filtros: FiltroGastos = {
      fechaInicio: fechaInicioDefault,
      fechaFin: fechaFinDefault
    };
    
    const gastos = await this.obtenerGastos(filtros);
    
    // Agrupar por mes y categoría
    const gastosPorMes = new Map<string, {
      año: number;
      mesNumero: number;
      categorias: Map<CategoriaGasto, { total: number; cantidad: number }>;
    }>();
    
    gastos.forEach(gasto => {
      const fecha = new Date(gasto.fecha);
      const año = fecha.getFullYear();
      const mes = fecha.getMonth();
      const claveMes = `${año}-${String(mes + 1).padStart(2, '0')}`;
      
      if (!gastosPorMes.has(claveMes)) {
        gastosPorMes.set(claveMes, {
          año,
          mesNumero: mes + 1,
          categorias: new Map()
        });
      }
      
      const datosMes = gastosPorMes.get(claveMes)!;
      const datosCategoria = datosMes.categorias.get(gasto.categoria) || { total: 0, cantidad: 0 };
      
      datosMes.categorias.set(gasto.categoria, {
        total: datosCategoria.total + gasto.importe,
        cantidad: datosCategoria.cantidad + 1
      });
    });
    
    // Convertir a array y ordenar por fecha
    const meses = Array.from(gastosPorMes.entries())
      .map(([claveMes, datos]) => ({
        mes: claveMes,
        año: datos.año,
        mesNumero: datos.mesNumero,
        categorias: Array.from(datos.categorias.entries())
          .map(([categoria, datosCategoria]) => ({
            categoria,
            total: datosCategoria.total,
            cantidad: datosCategoria.cantidad
          }))
          .sort((a, b) => b.total - a.total)
      }))
      .sort((a, b) => {
        if (a.año !== b.año) return a.año - b.año;
        return a.mesNumero - b.mesNumero;
      });
    
    return meses;
  }
};

