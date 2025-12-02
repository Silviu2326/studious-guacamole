import { PlanPago, CuotaPlanPago, EstadoCuota, MetodoPago, EstadoPlanPagoGeneral } from '../types';

// Mock data para desarrollo
const mockPlanesPago: PlanPago[] = [
  {
    id: 'plan1',
    pagoPendienteId: '5',
    clienteId: 'cliente5',
    clienteNombre: 'Luis Hernández',
    importeTotal: 420000,
    montoTotal: 420000,
    montoPagado: 140000,
    montoPendiente: 280000,
    numeroCuotas: 3,
    importeCuota: 140000,
    cuotasPagadas: 1,
    cuotasPendientes: 2,
    fechaInicio: new Date('2024-02-15'),
    fechaFinEstimada: new Date('2024-04-15'),
    estadoPlan: 'activo',
    cuotas: [
      {
        id: 'cuota1',
        planPagoId: 'plan1',
        numeroCuota: 1,
        monto: 140000,
        importeCuota: 140000,
        importePagado: 140000,
        fechaVencimiento: new Date('2024-02-15'),
        fechaPago: new Date('2024-02-14'),

        estadoCuota: 'pagada',
        metodoPago: 'transferencia'
      },
      {
        id: 'cuota2',
        planPagoId: 'plan1',
        numeroCuota: 2,
        monto: 140000,
        importeCuota: 140000,
        importePagado: 0,
        fechaVencimiento: new Date('2024-03-15'),

        estadoCuota: 'pendiente'
      },
      {
        id: 'cuota3',
        planPagoId: 'plan1',
        numeroCuota: 3,
        monto: 140000,
        importeCuota: 140000,
        importePagado: 0,
        fechaVencimiento: new Date('2024-04-15'),

        estadoCuota: 'pendiente'
      }
    ],
    fechaCreacion: new Date('2024-02-08'),
    fechaFin: new Date('2024-04-15'),

    notas: 'Cliente solicitó plan de pagos en 3 cuotas debido a dificultades económicas temporales',
    creadoPor: 'admin1',
    fechaActualizacion: new Date('2024-02-14')
  },
  {
    id: 'plan2',
    pagoPendienteId: '2',
    clienteId: 'cliente2',
    clienteNombre: 'María García',
    importeTotal: 500000,
    montoTotal: 500000,
    montoPagado: 500000,
    montoPendiente: 0,
    numeroCuotas: 4,
    importeCuota: 125000,
    cuotasPagadas: 4,
    cuotasPendientes: 0,
    fechaInicio: new Date('2024-01-10'),
    fechaFinEstimada: new Date('2024-04-10'),
    estadoPlan: 'completado',
    cuotas: [
      {
        id: 'cuota4',
        planPagoId: 'plan2',
        numeroCuota: 1,
        monto: 125000,
        importeCuota: 125000,
        importePagado: 125000,
        fechaVencimiento: new Date('2024-01-10'),
        fechaPago: new Date('2024-01-09'),

        estadoCuota: 'pagada',
        metodoPago: 'transferencia'
      },
      {
        id: 'cuota5',
        planPagoId: 'plan2',
        numeroCuota: 2,
        monto: 125000,
        importeCuota: 125000,
        importePagado: 125000,
        fechaVencimiento: new Date('2024-02-10'),
        fechaPago: new Date('2024-02-08'),

        estadoCuota: 'pagada',
        metodoPago: 'nequi'
      },
      {
        id: 'cuota6',
        planPagoId: 'plan2',
        numeroCuota: 3,
        monto: 125000,
        importeCuota: 125000,
        importePagado: 125000,
        fechaVencimiento: new Date('2024-03-10'),
        fechaPago: new Date('2024-03-09'),

        estadoCuota: 'pagada',
        metodoPago: 'transferencia'
      },
      {
        id: 'cuota7',
        planPagoId: 'plan2',
        numeroCuota: 4,
        monto: 125000,
        importeCuota: 125000,
        importePagado: 125000,
        fechaVencimiento: new Date('2024-04-10'),
        fechaPago: new Date('2024-04-08'),

        estadoCuota: 'pagada',
        metodoPago: 'tarjeta'
      }
    ],
    fechaCreacion: new Date('2024-01-05'),
    fechaFin: new Date('2024-04-10'),

    notas: 'Plan completado exitosamente',
    creadoPor: 'admin1',
    fechaActualizacion: new Date('2024-04-08')
  },
  {
    id: 'plan3',
    pagoPendienteId: '3',
    clienteId: 'cliente3',
    clienteNombre: 'Carlos Rodríguez',
    importeTotal: 600000,
    montoTotal: 600000,
    montoPagado: 200000,
    montoPendiente: 400000,
    numeroCuotas: 6,
    importeCuota: 100000,
    cuotasPagadas: 1,
    cuotasPendientes: 5,
    fechaInicio: new Date('2023-12-01'),
    fechaFinEstimada: new Date('2024-05-01'),
    estadoPlan: 'incumplido',
    cuotas: [
      {
        id: 'cuota8',
        planPagoId: 'plan3',
        numeroCuota: 1,
        monto: 100000,
        importeCuota: 100000,
        importePagado: 100000,
        fechaVencimiento: new Date('2023-12-01'),
        fechaPago: new Date('2023-12-05'),

        estadoCuota: 'pagada',
        metodoPago: 'efectivo'
      },
      {
        id: 'cuota9',
        planPagoId: 'plan3',
        numeroCuota: 2,
        monto: 100000,
        importeCuota: 100000,
        importePagado: 100000,
        fechaVencimiento: new Date('2024-01-01'),
        fechaPago: new Date('2024-01-10'),

        estadoCuota: 'pagada',
        metodoPago: 'transferencia'
      },
      {
        id: 'cuota10',
        planPagoId: 'plan3',
        numeroCuota: 3,
        monto: 100000,
        importeCuota: 100000,
        importePagado: 0,
        fechaVencimiento: new Date('2024-02-01'),

        estadoCuota: 'vencida',
        diasRetraso: 45
      },
      {
        id: 'cuota11',
        planPagoId: 'plan3',
        numeroCuota: 4,
        monto: 100000,
        importeCuota: 100000,
        importePagado: 0,
        fechaVencimiento: new Date('2024-03-01'),

        estadoCuota: 'vencida',
        diasRetraso: 15
      },
      {
        id: 'cuota12',
        planPagoId: 'plan3',
        numeroCuota: 5,
        monto: 100000,
        importeCuota: 100000,
        importePagado: 0,
        fechaVencimiento: new Date('2024-04-01'),

        estadoCuota: 'vencida',
        diasRetraso: 5
      },
      {
        id: 'cuota13',
        planPagoId: 'plan3',
        numeroCuota: 6,
        monto: 100000,
        importeCuota: 100000,
        importePagado: 0,
        fechaVencimiento: new Date('2024-05-01'),

        estadoCuota: 'pendiente'
      }
    ],
    fechaCreacion: new Date('2023-11-25'),
    fechaFin: new Date('2024-05-01'),

    notas: 'Cliente con múltiples cuotas vencidas. Requiere seguimiento urgente.',
    creadoPor: 'admin1',
    fechaActualizacion: new Date('2024-04-01')
  },
  {
    id: 'plan4',
    pagoPendienteId: '4',
    clienteId: 'cliente4',
    clienteNombre: 'Ana Martínez',
    importeTotal: 300000,
    montoTotal: 300000,
    montoPagado: 0,
    montoPendiente: 300000,
    numeroCuotas: 3,
    importeCuota: 100000,
    cuotasPagadas: 0,
    cuotasPendientes: 3,
    fechaInicio: new Date('2024-01-20'),
    fechaFinEstimada: new Date('2024-03-20'),
    estadoPlan: 'renegociado',
    cuotas: [
      {
        id: 'cuota14',
        planPagoId: 'plan4',
        numeroCuota: 1,
        monto: 100000,
        importeCuota: 100000,
        importePagado: 0,
        fechaVencimiento: new Date('2024-02-20'),

        estadoCuota: 'pendiente'
      },
      {
        id: 'cuota15',
        planPagoId: 'plan4',
        numeroCuota: 2,
        monto: 100000,
        importeCuota: 100000,
        importePagado: 0,
        fechaVencimiento: new Date('2024-03-20'),

        estadoCuota: 'pendiente'
      },
      {
        id: 'cuota16',
        planPagoId: 'plan4',
        numeroCuota: 3,
        monto: 100000,
        importeCuota: 100000,
        importePagado: 0,
        fechaVencimiento: new Date('2024-04-20'),

        estadoCuota: 'pendiente'
      }
    ],
    fechaCreacion: new Date('2024-01-15'),
    fechaFin: new Date('2024-04-20'),

    notas: 'Plan renegociado el 15 de marzo. Nuevas condiciones acordadas con el cliente.',
    creadoPor: 'admin1',
    fechaActualizacion: new Date('2024-03-15')
  },
  {
    id: 'plan5',
    pagoPendienteId: '6',
    clienteId: 'cliente6',
    clienteNombre: 'Pedro Sánchez',
    importeTotal: 250000,
    montoTotal: 250000,
    montoPagado: 0,
    montoPendiente: 250000,
    numeroCuotas: 2,
    importeCuota: 125000,
    cuotasPagadas: 0,
    cuotasPendientes: 2,
    fechaInicio: new Date('2023-11-01'),
    fechaFinEstimada: new Date('2023-12-01'),
    estadoPlan: 'cancelado',
    cuotas: [
      {
        id: 'cuota17',
        planPagoId: 'plan5',
        numeroCuota: 1,
        monto: 125000,
        importeCuota: 125000,
        importePagado: 0,
        fechaVencimiento: new Date('2023-11-01'),

        estadoCuota: 'cancelada'
      },
      {
        id: 'cuota18',
        planPagoId: 'plan5',
        numeroCuota: 2,
        monto: 125000,
        importeCuota: 125000,
        importePagado: 0,
        fechaVencimiento: new Date('2023-12-01'),

        estadoCuota: 'cancelada'
      }
    ],
    fechaCreacion: new Date('2023-10-25'),
    fechaFin: new Date('2023-12-01'),

    notas: 'Plan cancelado por solicitud del cliente. Deuda derivada a gestión externa.',
    creadoPor: 'admin1',
    fechaActualizacion: new Date('2023-12-15')
  }
];

export const planesPagoAPI = {
  // Obtener todos los planes de pago
  async obtenerTodosPlanes(): Promise<PlanPago[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPlanesPago.map(plan => ({
      ...plan,
      cuotas: plan.cuotas.map(cuota => ({
        ...cuota,
        fechaVencimiento: new Date(cuota.fechaVencimiento),
        fechaPago: cuota.fechaPago ? new Date(cuota.fechaPago) : undefined
      })),
      fechaCreacion: new Date(plan.fechaCreacion),
      fechaInicio: new Date(plan.fechaInicio),
      fechaFin: plan.fechaFin ? new Date(plan.fechaFin) : undefined,
      fechaActualizacion: new Date(plan.fechaActualizacion)
    }));
  },

  // Obtener planes de pago de un pago pendiente
  async obtenerPlanesPorPagoPendiente(pagoPendienteId: string): Promise<PlanPago[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPlanesPago
      .filter(plan => plan.pagoPendienteId === pagoPendienteId)
      .map(plan => ({
        ...plan,
        cuotas: plan.cuotas.map(cuota => ({
          ...cuota,
          fechaVencimiento: new Date(cuota.fechaVencimiento),
          fechaPago: cuota.fechaPago ? new Date(cuota.fechaPago) : undefined
        })),
        fechaCreacion: new Date(plan.fechaCreacion),
        fechaInicio: new Date(plan.fechaInicio),
        fechaFin: plan.fechaFin ? new Date(plan.fechaFin) : undefined,
        fechaFinEstimada: plan.fechaFinEstimada ? new Date(plan.fechaFinEstimada) : plan.fechaFin ? new Date(plan.fechaFin) : new Date(),
        fechaActualizacion: new Date(plan.fechaActualizacion)
      }));
  },

  // Obtener un plan de pago por ID
  async obtenerPlanPago(id: string): Promise<PlanPago | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const plan = mockPlanesPago.find(p => p.id === id);
    if (!plan) return null;

    return {
      ...plan,
      cuotas: plan.cuotas.map(cuota => ({
        ...cuota,
        fechaVencimiento: new Date(cuota.fechaVencimiento),
        fechaPago: cuota.fechaPago ? new Date(cuota.fechaPago) : undefined
      })),
      fechaCreacion: new Date(plan.fechaCreacion),
      fechaInicio: new Date(plan.fechaInicio),
      fechaFin: plan.fechaFin ? new Date(plan.fechaFin) : undefined,
      fechaActualizacion: new Date(plan.fechaActualizacion)
    };
  },

  // Crear un nuevo plan de pago
  async crearPlanPago(datos: {
    pagoPendienteId: string;
    clienteId: string;
    clienteNombre: string;
    montoTotal: number;
    cuotas: {
      monto: number;
      fechaVencimiento: Date;
    }[];
    notas?: string;
    creadoPor: string;
  }): Promise<PlanPago> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const cuotas: CuotaPlanPago[] = datos.cuotas.map((cuota, index) => ({
      id: `cuota-${Date.now()}-${index}`,
      planPagoId: `plan-${Date.now()}`,
      numeroCuota: index + 1,
      monto: cuota.monto,
      fechaVencimiento: cuota.fechaVencimiento,
      estadoCuota: 'pendiente' as EstadoCuota
    }));

    const nuevoPlan: PlanPago = {
      id: `plan-${Date.now()}`,
      pagoPendienteId: datos.pagoPendienteId,
      clienteId: datos.clienteId,
      clienteNombre: datos.clienteNombre,
      montoTotal: datos.montoTotal,
      montoPagado: 0,
      montoPendiente: datos.montoTotal,
      numeroCuotas: datos.cuotas.length,
      cuotas,
      fechaCreacion: new Date(),
      fechaInicio: datos.cuotas[0]?.fechaVencimiento || new Date(),
      estadoPlan: 'activo',
      notas: datos.notas,
      creadoPor: datos.creadoPor,
      fechaActualizacion: new Date()
    };

    // Actualizar IDs de cuotas
    nuevoPlan.cuotas = nuevoPlan.cuotas.map(cuota => ({
      ...cuota,
      planPagoId: nuevoPlan.id
    }));

    mockPlanesPago.push(nuevoPlan);
    return nuevoPlan;
  },

  // Marcar una cuota como pagada
  async marcarCuotaComoPagada(
    planPagoId: string,
    cuotaId: string,
    metodoPago: MetodoPago,
    nota?: string
  ): Promise<PlanPago> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const planIndex = mockPlanesPago.findIndex(p => p.id === planPagoId);
    if (planIndex === -1) {
      throw new Error('Plan de pago no encontrado');
    }

    const plan = mockPlanesPago[planIndex];
    const cuotaIndex = plan.cuotas.findIndex(c => c.id === cuotaId);
    if (cuotaIndex === -1) {
      throw new Error('Cuota no encontrada');
    }

    const cuota = plan.cuotas[cuotaIndex];
    if (cuota.estado === 'pagada') {
      throw new Error('La cuota ya está marcada como pagada');
    }

    // Actualizar cuota
    plan.cuotas[cuotaIndex] = {
      ...cuota,
      estadoCuota: 'pagada' as EstadoCuota,
      fechaPago: new Date(),
      metodoPago,
      nota
    };

    // Actualizar montos del plan
    plan.montoPagado = plan.cuotas
      .filter(c => c.estado === 'pagada' || c.estadoCuota === 'pagada')
      .reduce((sum, c) => sum + (c.monto || c.importeCuota || 0), 0);
    plan.montoPendiente = (plan.montoTotal || plan.importeTotal || 0) - plan.montoPagado;

    // Calcular cuotas pagadas y actualizar estado del plan
    const cuotasPagadas = plan.cuotas.filter(
      c => c.estado === 'pagada' || c.estadoCuota === 'pagada'
    ).length;
    const totalCuotas = plan.cuotas.length;

    plan.cuotasPagadas = cuotasPagadas;
    plan.cuotasPendientes = totalCuotas - cuotasPagadas;
    plan.estadoPlan = calcularEstadoPlan(cuotasPagadas, totalCuotas);

    // Actualizar estado legacy y fecha fin si está completado
    if (plan.montoPendiente === 0 || cuotasPagadas === totalCuotas) {
      plan.estadoPlan = 'completado';
      plan.fechaFin = new Date();
      plan.fechaFinEstimada = new Date();
    } else {
      plan.estadoPlan = plan.estadoPlan;
    }

    plan.fechaActualizacion = new Date();

    return {
      ...plan,
      cuotas: plan.cuotas.map(cuota => ({
        ...cuota,
        fechaVencimiento: new Date(cuota.fechaVencimiento),
        fechaPago: cuota.fechaPago ? new Date(cuota.fechaPago) : undefined
      })),
      fechaCreacion: new Date(plan.fechaCreacion),
      fechaInicio: new Date(plan.fechaInicio),
      fechaFin: plan.fechaFin ? new Date(plan.fechaFin) : undefined,
      fechaActualizacion: new Date(plan.fechaActualizacion)
    };
  },

  // Actualizar estado de cuotas vencidas
  async actualizarCuotasVencidas(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    mockPlanesPago.forEach(plan => {
      if (plan.estado === 'activo') {
        plan.cuotas.forEach(cuota => {
          if (cuota.estado === 'pendiente') {
            const fechaVencimiento = new Date(cuota.fechaVencimiento);
            fechaVencimiento.setHours(0, 0, 0, 0);
            if (fechaVencimiento < hoy) {
              cuota.estadoCuota = 'vencida';
            }
          }
        });

        // Verificar si todas las cuotas están vencidas
        const todasVencidas = plan.cuotas.every(c => c.estadoCuota === 'vencida' || c.estadoCuota === 'pagada');
        if (todasVencidas && plan.cuotas.some(c => c.estadoCuota === 'vencida')) {
          plan.estadoPlan = 'vencido';
        }

        plan.fechaActualizacion = new Date();
      }
    });
  },

  // ============================================================================
  // FUNCIONES PARA PLANES DE PAGO PERSONALIZADOS
  // Estos métodos alimentan PlanPagos.tsx y SeguimientoPagos.tsx
  // ============================================================================

  /**
   * Obtiene todos los planes de pago de un cliente específico.
   * Alimenta: PlanPagos.tsx, SeguimientoPagos.tsx
   */
  async getPlanesPagoPorCliente(clienteId: string): Promise<PlanPago[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPlanesPago
      .filter(plan => plan.clienteId === clienteId)
      .map(plan => ({
        ...plan,
        cuotas: plan.cuotas?.map(cuota => ({
          ...cuota,
          fechaVencimiento: new Date(cuota.fechaVencimiento),
          fechaPago: cuota.fechaPago ? new Date(cuota.fechaPago) : undefined
        })) || [],
        fechaCreacion: plan.fechaCreacion ? new Date(plan.fechaCreacion) : new Date(),
        fechaInicio: plan.fechaInicio ? new Date(plan.fechaInicio) : new Date(),
        fechaFin: plan.fechaFin ? new Date(plan.fechaFin) : undefined,
        fechaFin: plan.fechaFin ? new Date(plan.fechaFin) : undefined,
        fechaFinEstimada: plan.fechaFinEstimada ? new Date(plan.fechaFinEstimada) : plan.fechaFin ? new Date(plan.fechaFin) : new Date(),
        fechaActualizacion: plan.fechaActualizacion ? new Date(plan.fechaActualizacion) : new Date()
      }));
  },

  /**
   * Obtiene un plan de pago por su ID.
   * Alimenta: PlanPagos.tsx, SeguimientoPagos.tsx
   */
  async getPlanPagoById(planId: string): Promise<PlanPago | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const plan = mockPlanesPago.find(p => p.id === planId);
    if (!plan) return null;

    return {
      ...plan,
      cuotas: plan.cuotas?.map(cuota => ({
        ...cuota,
        fechaVencimiento: new Date(cuota.fechaVencimiento),
        fechaPago: cuota.fechaPago ? new Date(cuota.fechaPago) : undefined
      })) || [],
      fechaCreacion: plan.fechaCreacion ? new Date(plan.fechaCreacion) : new Date(),
      fechaInicio: plan.fechaInicio ? new Date(plan.fechaInicio) : new Date(),
      fechaFin: plan.fechaFin ? new Date(plan.fechaFin) : undefined,
      fechaFin: plan.fechaFin ? new Date(plan.fechaFin) : undefined,
      fechaFinEstimada: plan.fechaFinEstimada ? new Date(plan.fechaFinEstimada) : plan.fechaFin ? new Date(plan.fechaFin) : new Date(),
      fechaActualizacion: plan.fechaActualizacion ? new Date(plan.fechaActualizacion) : new Date()
    };
  },

  /**
   * Crea un nuevo plan de pago generando cuotas automáticamente basado en importeTotal y numeroCuotas.
   * Alimenta: PlanPagos.tsx
   */
  async generarPlanPago(data: {
    clienteId: string;
    importeTotal: number;
    numeroCuotas: number;
    fechaInicio?: Date;
    pagoPendienteId?: string;
    clienteNombre?: string;
    notas?: string;
    creadoPor?: string;
  }): Promise<{ plan: PlanPago; cuotas: CuotaPlanPago[] }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const planId = `plan-${Date.now()}`;
    const fechaInicio = data.fechaInicio || new Date();
    const importeCuota = Math.floor(data.importeTotal / data.numeroCuotas);
    const diferencia = data.importeTotal - (importeCuota * data.numeroCuotas); // Ajuste para redondeo

    // Generar cuotas mock
    const cuotas: CuotaPlanPago[] = [];
    for (let i = 0; i < data.numeroCuotas; i++) {
      const fechaVencimiento = new Date(fechaInicio);
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + i);

      // Agregar la diferencia al monto de la última cuota para ajustar redondeos
      const monto = i === data.numeroCuotas - 1
        ? importeCuota + diferencia
        : importeCuota;

      cuotas.push({
        id: `cuota-${planId}-${i + 1}`,
        planPagoId: planId,
        numeroCuota: i + 1,
        fechaVencimiento,
        importeCuota: monto,
        importePagado: 0,
        estadoCuota: 'pendiente',
        // Campos de compatibilidad
        monto,
        estado: 'pendiente' as EstadoCuota
      });
    }

    // Calcular estado inicial del plan
    const cuotasPagadas = cuotas.filter(c => c.estadoCuota === 'pagada').length;
    const estadoPlan = calcularEstadoPlan(cuotasPagadas, data.numeroCuotas);

    const fechaFinEstimada = new Date(fechaInicio);
    fechaFinEstimada.setMonth(fechaFinEstimada.getMonth() + data.numeroCuotas - 1);

    const nuevoPlan: PlanPago = {
      id: planId,
      clienteId: data.clienteId,
      importeTotal: data.importeTotal,
      numeroCuotas: data.numeroCuotas,
      importeCuota,
      fechaInicio,
      fechaFinEstimada,
      cuotasPagadas,
      cuotasPendientes: data.numeroCuotas - cuotasPagadas,
      estadoPlan,
      notas: data.notas,
      // Campos adicionales para compatibilidad
      pagoPendienteId: data.pagoPendienteId,
      clienteNombre: data.clienteNombre,
      montoTotal: data.importeTotal,
      montoPagado: 0,
      montoPendiente: data.importeTotal,
      cuotas,
      fechaCreacion: new Date(),
      fechaFin: fechaFinEstimada,
      creadoPor: data.creadoPor || 'system',
      fechaActualizacion: new Date(),
      // Campo de compatibilidad legacy
      estado: estadoPlan as any
    };

    mockPlanesPago.push(nuevoPlan);
    return { plan: nuevoPlan, cuotas };
  },

  /**
   * Actualiza un plan de pago existente.
   * Alimenta: PlanPagos.tsx, SeguimientoPagos.tsx
   */
  async actualizarPlanPago(
    id: string,
    cambios: Partial<PlanPago>
  ): Promise<PlanPago> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const planIndex = mockPlanesPago.findIndex(p => p.id === id);
    if (planIndex === -1) {
      throw new Error('Plan de pago no encontrado');
    }

    const plan = mockPlanesPago[planIndex];

    // Actualizar campos
    const planActualizado: PlanPago = {
      ...plan,
      ...cambios,
      fechaActualizacion: new Date()
    };

    // Si hay cuotas, recalcular estado del plan
    if (plan.cuotas && plan.cuotas.length > 0) {
      const cuotasPagadas = plan.cuotas.filter(
        c => c.estadoCuota === 'pagada' || c.estado === 'pagada'
      ).length;
      const totalCuotas = plan.cuotas.length;

      planActualizado.cuotasPagadas = cuotasPagadas;
      planActualizado.cuotasPendientes = totalCuotas - cuotasPagadas;
      planActualizado.estadoPlan = calcularEstadoPlan(cuotasPagadas, totalCuotas);
      // planActualizado.estado = planActualizado.estadoPlan as any;

      // Recalcular montos
      planActualizado.montoPagado = plan.cuotas
        .filter(c => c.estadoCuota === 'pagada' || c.estado === 'pagada')
        .reduce((sum, c) => sum + (c.monto || c.importeCuota || 0), 0);
      planActualizado.montoPendiente = (planActualizado.importeTotal || planActualizado.montoTotal || 0) - planActualizado.montoPagado;
    }

    mockPlanesPago[planIndex] = planActualizado;

    return {
      ...planActualizado,
      cuotas: planActualizado.cuotas?.map(cuota => ({
        ...cuota,
        fechaVencimiento: new Date(cuota.fechaVencimiento),
        fechaPago: cuota.fechaPago ? new Date(cuota.fechaPago) : undefined
      })) || [],
      fechaCreacion: planActualizado.fechaCreacion ? new Date(planActualizado.fechaCreacion) : new Date(),
      fechaInicio: planActualizado.fechaInicio ? new Date(planActualizado.fechaInicio) : new Date(),
      fechaFin: planActualizado.fechaFin ? new Date(planActualizado.fechaFin) : undefined,
      fechaFin: planActualizado.fechaFin ? new Date(planActualizado.fechaFin) : undefined,
      fechaFinEstimada: planActualizado.fechaFinEstimada ? new Date(planActualizado.fechaFinEstimada) : planActualizado.fechaFin ? new Date(planActualizado.fechaFin) : new Date(),
      fechaActualizacion: new Date(planActualizado.fechaActualizacion)
    };
  },

  /**
   * Renegocia un plan de pago existente con una nueva configuración.
   * Genera nuevas cuotas basadas en la nueva configuración.
   * Alimenta: PlanPagos.tsx, SeguimientoPagos.tsx
   */
  async renegociarPlanPago(
    id: string,
    nuevaConfig: {
      importeTotal?: number;
      numeroCuotas?: number;
      fechaInicio?: Date;
      notas?: string;
    }
  ): Promise<{ plan: PlanPago; cuotas: CuotaPlanPago[] }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const planIndex = mockPlanesPago.findIndex(p => p.id === id);
    if (planIndex === -1) {
      throw new Error('Plan de pago no encontrado');
    }

    const planAnterior = mockPlanesPago[planIndex];
    const importeTotal = nuevaConfig.importeTotal ?? planAnterior.importeTotal ?? planAnterior.montoTotal ?? 0;
    const numeroCuotas = nuevaConfig.numeroCuotas ?? planAnterior.numeroCuotas;
    const fechaInicio = nuevaConfig.fechaInicio ?? planAnterior.fechaInicio ?? new Date();

    const importeCuota = Math.floor(importeTotal / numeroCuotas);
    const diferencia = importeTotal - (importeCuota * numeroCuotas);

    // Generar nuevas cuotas
    const nuevasCuotas: CuotaPlanPago[] = [];
    for (let i = 0; i < numeroCuotas; i++) {
      const fechaVencimiento = new Date(fechaInicio);
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + i);

      const monto = i === numeroCuotas - 1
        ? importeCuota + diferencia
        : importeCuota;

      nuevasCuotas.push({
        id: `cuota-${id}-reneg-${i + 1}`,
        planPagoId: id,
        numeroCuota: i + 1,
        fechaVencimiento,
        importeCuota: monto,
        importePagado: 0,
        estadoCuota: 'pendiente',
        // Campos de compatibilidad
        monto,
        estado: 'pendiente' as EstadoCuota
      });
    }

    const fechaFinEstimada = new Date(fechaInicio);
    fechaFinEstimada.setMonth(fechaFinEstimada.getMonth() + numeroCuotas - 1);

    const planRenegociado: PlanPago = {
      ...planAnterior,
      importeTotal,
      numeroCuotas,
      importeCuota,
      fechaInicio,
      fechaFinEstimada,
      cuotasPagadas: 0,
      cuotasPendientes: numeroCuotas,
      estadoPlan: 'activo',
      cuotas: nuevasCuotas,
      fechaActualizacion: new Date(),
      fechaFin: fechaFinEstimada,
      montoTotal: importeTotal,
      montoPagado: 0,
      montoPendiente: importeTotal,
      notas: nuevaConfig.notas || `Plan renegociado el ${new Date().toLocaleDateString()}. ${planAnterior.notas || ''}`,
      // Campo de compatibilidad legacy
      estado: 'activo' as any
    };

    mockPlanesPago[planIndex] = planRenegociado;

    return {
      plan: {
        ...planRenegociado,
        cuotas: nuevasCuotas.map(cuota => ({
          ...cuota,
          fechaVencimiento: new Date(cuota.fechaVencimiento),
          fechaPago: cuota.fechaPago ? new Date(cuota.fechaPago) : undefined
        })),
        fechaCreacion: planRenegociado.fechaCreacion ? new Date(planRenegociado.fechaCreacion) : new Date(),
        fechaInicio: new Date(planRenegociado.fechaInicio),
        fechaFin: new Date(planRenegociado.fechaFin),
        fechaFinEstimada: new Date(planRenegociado.fechaFinEstimada),
        fechaActualizacion: new Date(planRenegociado.fechaActualizacion)
      },
      cuotas: nuevasCuotas
    };
  },

  /**
   * Obtiene todas las cuotas de un plan de pago específico.
   * Alimenta: PlanPagos.tsx, SeguimientoPagos.tsx
   */
  async getCuotasPlan(planId: string): Promise<CuotaPlanPago[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const plan = mockPlanesPago.find(p => p.id === planId);
    if (!plan || !plan.cuotas) {
      return [];
    }

    return plan.cuotas.map(cuota => ({
      ...cuota,
      fechaVencimiento: new Date(cuota.fechaVencimiento),
      fechaPago: cuota.fechaPago ? new Date(cuota.fechaPago) : undefined
    }));
  }
};

/**
 * Calcula el estado del plan basado en las cuotas pagadas vs totales.
 * Utilizado internamente por las funciones de crear/actualizar plan.
 */
function calcularEstadoPlan(cuotasPagadas: number, totalCuotas: number): EstadoPlanPagoGeneral {
  if (cuotasPagadas === 0) {
    return 'activo';
  } else if (cuotasPagadas === totalCuotas) {
    return 'completado';
  } else {
    return 'activo';
  }
}

