import { PlanPago, CuotaPlanPago, EstadoCuota, MetodoPago } from '../types';

// Mock data para desarrollo
const mockPlanesPago: PlanPago[] = [
  {
    id: 'plan1',
    pagoPendienteId: '5',
    clienteId: 'cliente5',
    clienteNombre: 'Luis Hernández',
    montoTotal: 420000,
    montoPagado: 140000,
    montoPendiente: 280000,
    numeroCuotas: 3,
    cuotas: [
      {
        id: 'cuota1',
        planPagoId: 'plan1',
        numeroCuota: 1,
        monto: 140000,
        fechaVencimiento: new Date('2024-02-15'),
        fechaPago: new Date('2024-02-14'),
        estado: 'pagada',
        metodoPago: 'transferencia'
      },
      {
        id: 'cuota2',
        planPagoId: 'plan1',
        numeroCuota: 2,
        monto: 140000,
        fechaVencimiento: new Date('2024-03-15'),
        estado: 'pendiente'
      },
      {
        id: 'cuota3',
        planPagoId: 'plan1',
        numeroCuota: 3,
        monto: 140000,
        fechaVencimiento: new Date('2024-04-15'),
        estado: 'pendiente'
      }
    ],
    fechaCreacion: new Date('2024-02-08'),
    fechaInicio: new Date('2024-02-15'),
    estado: 'activo',
    notas: 'Cliente solicitó plan de pagos en 3 cuotas debido a dificultades económicas temporales',
    creadoPor: 'admin1',
    fechaActualizacion: new Date('2024-02-14')
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
      estado: 'pendiente' as EstadoCuota
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
      estado: 'activo',
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
      estado: 'pagada' as EstadoCuota,
      fechaPago: new Date(),
      metodoPago,
      nota
    };

    // Actualizar montos del plan
    plan.montoPagado = plan.cuotas
      .filter(c => c.estado === 'pagada')
      .reduce((sum, c) => sum + c.monto, 0);
    plan.montoPendiente = plan.montoTotal - plan.montoPagado;

    // Actualizar estado del plan
    if (plan.montoPendiente === 0) {
      plan.estado = 'completado';
      plan.fechaFin = new Date();
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
              cuota.estado = 'vencida';
            }
          }
        });

        // Verificar si todas las cuotas están vencidas
        const todasVencidas = plan.cuotas.every(c => c.estado === 'vencida' || c.estado === 'pagada');
        if (todasVencidas && plan.cuotas.some(c => c.estado === 'vencida')) {
          plan.estado = 'vencido';
        }

        plan.fechaActualizacion = new Date();
      }
    });
  }
};

