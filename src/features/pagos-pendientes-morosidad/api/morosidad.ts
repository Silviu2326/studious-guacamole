import { PagoPendiente, FiltroMorosidad, EstadisticasMorosidad, MetodoPago, EnlacePago, PlataformaPago, AjusteDeudaData } from '../types';
import { getHistorialSesionesCliente } from '../../agenda-calendario/api/sesiones';
import { seguimientoAPI } from './seguimiento';

// Mock data para desarrollo
const mockPagosPendientes: PagoPendiente[] = [
  {
    id: '1',
    facturaId: 'factura1',
    numeroFactura: 'FAC-2024-001',
    cliente: {
      id: 'cliente1',
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      telefono: '+57 300 123 4567',
      metodoPagoPreferido: 'nequi'
    },
    fechaEmision: new Date('2024-01-15'),
    fechaVencimiento: new Date('2024-01-30'),
    fechaVencida: new Date('2024-02-02'),
    diasRetraso: 3,
    montoTotal: 238000,
    montoPendiente: 238000,
    nivelMorosidad: 'verde',
    estado: 'vencido',
    recordatoriosEnviados: 1,
    ultimoRecordatorio: new Date('2024-02-01'),
    riesgo: 'bajo',
    historialAcciones: [
      {
        id: 'acc1',
        fecha: new Date('2024-02-01'),
        tipo: 'recordatorio',
        descripcion: 'Recordatorio amigable enviado',
        usuario: 'sistema'
      }
    ],
    fechaCreacion: new Date('2024-01-15'),
    fechaActualizacion: new Date('2024-02-01'),
    membresiaId: 'membresia1',
    clienteDeConfianza: true // Ejemplo de cliente de confianza
  },
  {
    id: '2',
    facturaId: 'factura2',
    numeroFactura: 'FAC-2024-005',
    cliente: {
      id: 'cliente2',
      nombre: 'María García',
      email: 'maria@example.com',
      telefono: '+57 300 234 5678',
      metodoPagoPreferido: 'transferencia'
    },
    fechaEmision: new Date('2024-01-10'),
    fechaVencimiento: new Date('2024-01-25'),
    fechaVencida: new Date('2024-01-26'),
    diasRetraso: 12,
    montoTotal: 357000,
    montoPendiente: 357000,
    nivelMorosidad: 'amarillo',
    estado: 'vencido',
    recordatoriosEnviados: 2,
    ultimoRecordatorio: new Date('2024-02-04'),
    proximoRecordatorio: new Date('2024-02-06'),
    riesgo: 'medio',
    estrategiaCobro: 'recordatorio_automatico',
    historialAcciones: [
      {
        id: 'acc2',
        fecha: new Date('2024-01-28'),
        tipo: 'recordatorio',
        descripcion: 'Recordatorio amigable enviado',
        usuario: 'sistema'
      },
      {
        id: 'acc3',
        fecha: new Date('2024-02-04'),
        tipo: 'recordatorio',
        descripcion: 'Recordatorio firme enviado',
        usuario: 'sistema'
      }
    ],
    fechaCreacion: new Date('2024-01-10'),
    fechaActualizacion: new Date('2024-02-04'),
    membresiaId: 'membresia2'
  },
  {
    id: '3',
    facturaId: 'factura3',
    numeroFactura: 'FAC-2024-003',
    cliente: {
      id: 'cliente3',
      nombre: 'Carlos Rodríguez',
      email: 'carlos@example.com',
      telefono: '+57 300 345 6789',
      metodoPagoPreferido: 'efectivo'
    },
    fechaEmision: new Date('2024-01-05'),
    fechaVencimiento: new Date('2024-01-20'),
    fechaVencida: new Date('2024-01-21'),
    diasRetraso: 25,
    montoTotal: 95200,
    montoPendiente: 95200,
    nivelMorosidad: 'naranja',
    estado: 'vencido',
    recordatoriosEnviados: 3,
    ultimoRecordatorio: new Date('2024-02-05'),
    proximoRecordatorio: new Date('2024-02-07'),
    riesgo: 'alto',
    estrategiaCobro: 'contacto_directo',
    notas: 'Cliente ha sido contactado, esperando respuesta',
    historialAcciones: [
      {
        id: 'acc4',
        fecha: new Date('2024-01-22'),
        tipo: 'recordatorio',
        descripcion: 'Recordatorio urgente enviado',
        usuario: 'sistema'
      },
      {
        id: 'acc5',
        fecha: new Date('2024-02-01'),
        tipo: 'contacto',
        descripcion: 'Llamada telefónica realizada',
        usuario: 'admin1',
        resultado: 'Cliente prometió pagar esta semana'
      }
    ],
    fechaCreacion: new Date('2024-01-05'),
    fechaActualizacion: new Date('2024-02-05'),
    membresiaId: 'membresia3'
  },
  {
    id: '4',
    facturaId: 'factura4',
    numeroFactura: 'FAC-2023-045',
    cliente: {
      id: 'cliente4',
      nombre: 'Ana Martínez',
      email: 'ana@example.com',
      telefono: '+57 300 456 7890'
    },
    fechaEmision: new Date('2023-12-01'),
    fechaVencimiento: new Date('2023-12-15'),
    fechaVencida: new Date('2023-12-16'),
    diasRetraso: 58,
    montoTotal: 180000,
    montoPendiente: 180000,
    nivelMorosidad: 'negro',
    estado: 'vencido',
    recordatoriosEnviados: 8,
    ultimoRecordatorio: new Date('2024-01-15'),
    riesgo: 'critico',
    estrategiaCobro: 'legal',
    notas: 'Caso escalado a gestión legal',
    historialAcciones: [
      {
        id: 'acc6',
        fecha: new Date('2024-01-10'),
        tipo: 'legal',
        descripcion: 'Documentación enviada a asesor legal',
        usuario: 'admin1'
      }
    ],
    fechaCreacion: new Date('2023-12-01'),
    fechaActualizacion: new Date('2024-01-15'),
    membresiaId: 'membresia4'
  },
  {
    id: '5',
    facturaId: 'factura5',
    numeroFactura: 'FAC-2024-008',
    cliente: {
      id: 'cliente5',
      nombre: 'Luis Hernández',
      email: 'luis@example.com',
      telefono: '+57 300 567 8901'
    },
    fechaEmision: new Date('2024-01-20'),
    fechaVencimiento: new Date('2024-02-05'),
    fechaVencida: new Date('2024-02-06'),
    diasRetraso: 35,
    montoTotal: 420000,
    montoPendiente: 420000,
    nivelMorosidad: 'rojo',
    estado: 'vencido',
    recordatoriosEnviados: 5,
    ultimoRecordatorio: new Date('2024-02-08'),
    proximoRecordatorio: new Date('2024-02-10'),
    riesgo: 'critico',
    estrategiaCobro: 'negociacion',
    notas: 'Cliente solicita plan de pagos',
    historialAcciones: [
      {
        id: 'acc7',
        fecha: new Date('2024-02-08'),
        tipo: 'negociacion',
        descripcion: 'Reunión para negociar plan de pagos',
        usuario: 'admin1',
        resultado: 'Pendiente de respuesta del cliente'
      }
    ],
    fechaCreacion: new Date('2024-01-20'),
    fechaActualizacion: new Date('2024-02-08'),
    membresiaId: 'membresia5'
  }
];

export const morosidadAPI = {
  // Obtener todos los pagos pendientes
  async obtenerPagosPendientes(filtros?: FiltroMorosidad, incluirAsistencia: boolean = true): Promise<PagoPendiente[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let pagos = [...mockPagosPendientes];
    
    if (filtros) {
      if (filtros.fechaInicio) {
        pagos = pagos.filter(p => p.fechaVencida >= filtros.fechaInicio!);
      }
      if (filtros.fechaFin) {
        pagos = pagos.filter(p => p.fechaVencida <= filtros.fechaFin!);
      }
      if (filtros.clienteId) {
        pagos = pagos.filter(p => p.cliente.id === filtros.clienteId);
      }
      if (filtros.nivelMorosidad && filtros.nivelMorosidad.length > 0) {
        pagos = pagos.filter(p => filtros.nivelMorosidad!.includes(p.nivelMorosidad));
      }
      if (filtros.riesgo && filtros.riesgo.length > 0) {
        pagos = pagos.filter(p => filtros.riesgo!.includes(p.riesgo));
      }
      if (filtros.diasRetrasoMin) {
        pagos = pagos.filter(p => p.diasRetraso >= filtros.diasRetrasoMin!);
      }
      if (filtros.diasRetrasoMax) {
        pagos = pagos.filter(p => p.diasRetraso <= filtros.diasRetrasoMax!);
      }
      if (filtros.montoMin) {
        pagos = pagos.filter(p => p.montoPendiente >= filtros.montoMin!);
      }
      if (filtros.montoMax) {
        pagos = pagos.filter(p => p.montoPendiente <= filtros.montoMax!);
      }
      // Nuevos filtros simples
      if (filtros.vencidosMasDe15Dias) {
        pagos = pagos.filter(p => p.diasRetraso > 15);
      }
      if (filtros.montoMayorA !== undefined) {
        pagos = pagos.filter(p => p.montoPendiente > filtros.montoMayorA!);
      }
      if (filtros.sinContactoReciente) {
        const hoy = new Date();
        const hace7Dias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
        pagos = pagos.filter(p => {
          if (!p.ultimoContacto) return true; // Sin contacto = sin contacto reciente
          return p.ultimoContacto < hace7Dias;
        });
      }
      if (filtros.excluirClientesDeConfianza) {
        pagos = pagos.filter(p => !p.clienteDeConfianza);
      }
    }
    
    const pagosOrdenados = pagos.sort((a, b) => b.diasRetraso - a.diasRetraso);
    
    // Enriquecer con información de asistencia y último contacto si se solicita
    if (incluirAsistencia) {
      const pagosConAsistencia = await morosidadAPI.enriquecerConAsistencia(pagosOrdenados);
      return morosidadAPI.enriquecerConUltimoContacto(pagosConAsistencia);
    }
    
    return morosidadAPI.enriquecerConUltimoContacto(pagosOrdenados);
  },

  // Obtener un pago pendiente por ID
  async obtenerPagoPendiente(id: string): Promise<PagoPendiente | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPagosPendientes.find(p => p.id === id) || null;
  },

  // Obtener estadísticas de morosidad
  async obtenerEstadisticas(): Promise<EstadisticasMorosidad> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const pagos = mockPagosPendientes;
    const totalPendientes = pagos.length;
    const montoTotalPendiente = pagos.reduce((sum, p) => sum + p.montoPendiente, 0);
    const vencidos = pagos.filter(p => p.diasRetraso > 0);
    const totalVencidos = vencidos.length;
    const montoTotalVencido = vencidos.reduce((sum, p) => sum + p.montoPendiente, 0);
    
    const porNivel = {
      verde: { cantidad: 0, monto: 0 },
      amarillo: { cantidad: 0, monto: 0 },
      naranja: { cantidad: 0, monto: 0 },
      rojo: { cantidad: 0, monto: 0 },
      negro: { cantidad: 0, monto: 0 }
    };
    
    pagos.forEach(p => {
      porNivel[p.nivelMorosidad].cantidad++;
      porNivel[p.nivelMorosidad].monto += p.montoPendiente;
    });
    
    const promedioDiasRetraso = pagos.length > 0
      ? pagos.reduce((sum, p) => sum + p.diasRetraso, 0) / pagos.length
      : 0;
    
    const casosCriticos = pagos.filter(p => p.riesgo === 'critico').length;
    
    return {
      totalPendientes,
      montoTotalPendiente,
      totalVencidos,
      montoTotalVencido,
      porNivel,
      promedioDiasRetraso,
      tasaRecuperacion: 0.75, // Mock
      casosCriticos
    };
  },

  // Actualizar estado de pago
  async actualizarEstado(id: string, estado: string, notas?: string): Promise<PagoPendiente> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockPagosPendientes.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Pago pendiente no encontrado');
    }
    
    mockPagosPendientes[index] = {
      ...mockPagosPendientes[index],
      estado: estado as any,
      notas: notas || mockPagosPendientes[index].notas,
      fechaActualizacion: new Date()
    };
    
    return mockPagosPendientes[index];
  },

  // Marcar como pagado
  async marcarComoPagado(id: string): Promise<PagoPendiente> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockPagosPendientes.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Pago pendiente no encontrado');
    }
    
    mockPagosPendientes[index] = {
      ...mockPagosPendientes[index],
      estado: 'pagado',
      montoPendiente: 0,
      fechaActualizacion: new Date()
    };
    
    return mockPagosPendientes[index];
  },

  // Marcar como pagado con método de pago y nota
  async marcarComoPagadoConMetodo(
    id: string,
    metodoPago: MetodoPago,
    nota?: string
  ): Promise<PagoPendiente> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockPagosPendientes.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Pago pendiente no encontrado');
    }
    
    mockPagosPendientes[index] = {
      ...mockPagosPendientes[index],
      estado: 'pagado',
      montoPendiente: 0,
      metodoPago,
      fechaPago: new Date(),
      notaPago: nota,
      fechaActualizacion: new Date(),
      historialAcciones: [
        ...mockPagosPendientes[index].historialAcciones,
        {
          id: `acc-${Date.now()}`,
          fecha: new Date(),
          tipo: 'pago_completo',
          descripcion: `Pago recibido mediante ${metodoPago}${nota ? `: ${nota}` : ''}`,
          usuario: 'usuario_actual',
          resultado: 'Pago completado exitosamente'
        }
      ]
    };
    
    return mockPagosPendientes[index];
  },

  // Generar enlace de pago
  async generarEnlacePago(
    pagoPendienteId: string,
    plataforma: PlataformaPago = 'wompi'
  ): Promise<EnlacePago> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const pago = mockPagosPendientes.find(p => p.id === pagoPendienteId);
    if (!pago) {
      throw new Error('Pago pendiente no encontrado');
    }

    // Generar referencia única
    const referencia = `PAY-${pago.numeroFactura}-${Date.now()}`;
    
    // Simular URL de pago según la plataforma
    let urlBase = '';
    if (plataforma === 'wompi') {
      urlBase = 'https://checkout.wompi.co/l/';
    } else if (plataforma === 'payu') {
      urlBase = 'https://checkout.payulatam.com/l/';
    } else {
      urlBase = 'https://payment.example.com/';
    }
    
    const enlacePago: EnlacePago = {
      id: `enlace-${Date.now()}`,
      pagoPendienteId,
      url: `${urlBase}${referencia}`,
      plataforma,
      estado: 'activo',
      fechaCreacion: new Date(),
      fechaExpiracion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      monto: pago.montoPendiente,
      referencia
    };
    
    // En una implementación real, aquí se haría la llamada a la API de Wompi/PayU
    // para generar el enlace real
    
    return enlacePago;
  },

  // Obtener enlaces de pago de un pago pendiente
  async obtenerEnlacesPago(pagoPendienteId: string): Promise<EnlacePago[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // En una implementación real, esto consultaría la base de datos
    // Por ahora retornamos un array vacío
    return [];
  },

  // Pausar membresía de un cliente con deuda
  async pausarMembresia(
    pagoPendienteId: string,
    fechaReactivacion?: Date,
    motivoPausa?: string
  ): Promise<PagoPendiente> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockPagosPendientes.findIndex(p => p.id === pagoPendienteId);
    if (index === -1) {
      throw new Error('Pago pendiente no encontrado');
    }
    
    const fechaPausa = new Date();
    const fechaReactivacionFinal = fechaReactivacion || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 días por defecto
    
    mockPagosPendientes[index] = {
      ...mockPagosPendientes[index],
      membresiaPausada: {
        pausada: true,
        fechaPausa,
        fechaReactivacion: fechaReactivacionFinal,
        motivoPausa: motivoPausa || 'Pausada temporalmente por deuda pendiente'
      },
      fechaActualizacion: new Date(),
      historialAcciones: [
        ...mockPagosPendientes[index].historialAcciones,
        {
          id: `acc-${Date.now()}`,
          fecha: new Date(),
          tipo: 'pausa_membresia',
          descripcion: `Membresía pausada hasta ${fechaReactivacionFinal.toLocaleDateString('es-ES')}. Motivo: ${motivoPausa || 'Deuda pendiente'}`,
          usuario: 'usuario_actual',
          resultado: 'Membresía pausada exitosamente'
        }
      ]
    };
    
    // En una implementación real, aquí se actualizaría también el estado de la membresía
    // para evitar nuevos cobros mientras esté pausada
    
    return mockPagosPendientes[index];
  },

  // Reanudar membresía de un cliente
  async reanudarMembresia(pagoPendienteId: string): Promise<PagoPendiente> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockPagosPendientes.findIndex(p => p.id === pagoPendienteId);
    if (index === -1) {
      throw new Error('Pago pendiente no encontrado');
    }
    
    const pago = mockPagosPendientes[index];
    if (!pago.membresiaPausada?.pausada) {
      throw new Error('La membresía no está pausada');
    }
    
    mockPagosPendientes[index] = {
      ...mockPagosPendientes[index],
      membresiaPausada: {
        pausada: false,
        fechaPausa: pago.membresiaPausada.fechaPausa,
        fechaReactivacion: new Date(),
        motivoPausa: pago.membresiaPausada.motivoPausa
      },
      fechaActualizacion: new Date(),
      historialAcciones: [
        ...mockPagosPendientes[index].historialAcciones,
        {
          id: `acc-${Date.now()}`,
          fecha: new Date(),
          tipo: 'reanudar_membresia',
          descripcion: 'Membresía reanudada',
          usuario: 'usuario_actual',
          resultado: 'Membresía reanudada exitosamente'
        }
      ]
    };
    
    // En una implementación real, aquí se reactivaría la membresía
    // para reanudar los cobros
    
    return mockPagosPendientes[index];
  },

  // Actualizar notas privadas
  async actualizarNotasPrivadas(
    id: string,
    notasPrivadas: string
  ): Promise<PagoPendiente> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockPagosPendientes.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Pago pendiente no encontrado');
    }
    
    mockPagosPendientes[index] = {
      ...mockPagosPendientes[index],
      notasPrivadas: notasPrivadas.trim() || undefined,
      fechaActualizacion: new Date()
    };
    
    return mockPagosPendientes[index];
  },

  // Ajustar monto de deuda (aplicar descuento o condonación)
  async ajustarMontoDeuda(
    id: string,
    ajuste: AjusteDeudaData
  ): Promise<PagoPendiente> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockPagosPendientes.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Pago pendiente no encontrado');
    }
    
    const pago = mockPagosPendientes[index];
    const montoOriginal = pago.montoPendiente;
    const nuevoMonto = ajuste.nuevoMonto;
    
    if (nuevoMonto < 0) {
      throw new Error('El nuevo monto no puede ser negativo');
    }
    
    if (nuevoMonto > montoOriginal) {
      throw new Error('El nuevo monto no puede ser mayor al monto pendiente actual');
    }
    
    if (!ajuste.motivo || ajuste.motivo.trim().length === 0) {
      throw new Error('El motivo del ajuste es obligatorio');
    }
    
    const descuentoAplicado = montoOriginal - nuevoMonto;
    const ajusteDeuda = {
      montoOriginal,
      montoAjustado: nuevoMonto,
      descuentoAplicado,
      motivo: ajuste.motivo.trim(),
      fechaAjuste: new Date(),
      usuarioAjuste: 'usuario_actual'
    };
    
    mockPagosPendientes[index] = {
      ...pago,
      montoPendiente: nuevoMonto,
      montoTotal: pago.montoTotal - descuentoAplicado, // Ajustar también el monto total
      ajustesDeuda: [
        ...(pago.ajustesDeuda || []),
        ajusteDeuda
      ],
      fechaActualizacion: new Date(),
      historialAcciones: [
        ...pago.historialAcciones,
        {
          id: `acc-${Date.now()}`,
          fecha: new Date(),
          tipo: descuentoAplicado === montoOriginal ? 'condonacion' : 'descuento',
          descripcion: `Ajuste de deuda: ${descuentoAplicado === montoOriginal ? 'Condonación total' : `Descuento de ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(descuentoAplicado)}`}. Motivo: ${ajuste.motivo.trim()}`,
          usuario: 'usuario_actual',
          resultado: `Monto ajustado de ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(montoOriginal)} a ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(nuevoMonto)}`
        }
      ]
    };
    
    return mockPagosPendientes[index];
  },

  // Enriquecer pagos con información de asistencia
  async enriquecerConAsistencia(pagos: PagoPendiente[]): Promise<PagoPendiente[]> {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0, 23, 59, 59, 999);

    const pagosEnriquecidos = await Promise.all(
      pagos.map(async (pago) => {
        try {
          // Obtener historial de sesiones del cliente
          const { sesiones } = await getHistorialSesionesCliente(
            pago.cliente.id,
            {
              fechaInicio: inicioMes,
              fechaFin: finMes,
              asistencia: 'asistio'
            }
          );

          // Obtener todas las sesiones para encontrar la última asistencia
          const { sesiones: todasLasSesiones } = await getHistorialSesionesCliente(
            pago.cliente.id,
            {
              asistencia: 'asistio'
            }
          );

          // Última sesión asistida
          const ultimaAsistencia = todasLasSesiones.length > 0
            ? todasLasSesiones[0].fechaInicio
            : undefined;

          // Sesiones del mes actual
          const sesionesEsteMes = sesiones.length;

          return {
            ...pago,
            asistencia: {
              ultimaAsistencia,
              sesionesEsteMes
            }
          };
        } catch (error) {
          console.error(`Error obteniendo asistencia para cliente ${pago.cliente.id}:`, error);
          // Si hay error, retornar el pago sin información de asistencia
          return {
            ...pago,
            asistencia: {
              sesionesEsteMes: 0
            }
          };
        }
      })
    );

    return pagosEnriquecidos;
  },

  // Enriquecer pagos con información de último contacto
  async enriquecerConUltimoContacto(pagos: PagoPendiente[]): Promise<PagoPendiente[]> {
    try {
      const todosSeguimientos = await seguimientoAPI.obtenerTodosSeguimientos();
      
      return pagos.map(pago => {
        // Buscar el último seguimiento de tipo 'contacto' para este pago
        const contactos = todosSeguimientos
          .filter(s => s.pagoPendienteId === pago.id && s.tipo === 'contacto')
          .sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
        
        const ultimoContacto = contactos.length > 0 ? contactos[0].fecha : undefined;
        
        return {
          ...pago,
          ultimoContacto
        };
      });
    } catch (error) {
      console.error('Error obteniendo último contacto:', error);
      return pagos;
    }
  },

  // Marcar/desmarcar cliente como de confianza
  async toggleClienteDeConfianza(id: string, esDeConfianza: boolean): Promise<PagoPendiente> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockPagosPendientes.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Pago pendiente no encontrado');
    }
    
    mockPagosPendientes[index] = {
      ...mockPagosPendientes[index],
      clienteDeConfianza: esDeConfianza,
      fechaActualizacion: new Date(),
      historialAcciones: [
        ...mockPagosPendientes[index].historialAcciones,
        {
          id: `acc-${Date.now()}`,
          fecha: new Date(),
          tipo: 'marcar_cliente_confianza',
          descripcion: esDeConfianza 
            ? 'Cliente marcado como de confianza' 
            : 'Cliente desmarcado como de confianza',
          usuario: 'usuario_actual',
          resultado: esDeConfianza 
            ? 'Las alertas para este cliente se reducirán' 
            : 'Las alertas para este cliente se restaurarán'
        }
      ]
    };
    
    return mockPagosPendientes[index];
  }
};

