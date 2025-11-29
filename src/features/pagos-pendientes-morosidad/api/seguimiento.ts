import { 
  SeguimientoPago, 
  AccionCobro, 
  NivelRiesgo, 
  FiltrosAccionesCobro
} from '../types';

// Mock data para desarrollo
const mockSeguimientos: SeguimientoPago[] = [
  {
    id: 'seg1',
    pagoPendienteId: '3',
    fecha: new Date('2024-02-01'),
    accion: 'Llamada telefónica realizada',
    tipo: 'contacto',
    usuario: 'admin1',
    notas: 'Cliente prometió pagar esta semana. Mencionó problemas de flujo de caja temporales.',
    proximaSeguimiento: new Date('2024-02-08')
  },
  {
    id: 'seg2',
    pagoPendienteId: '5',
    fecha: new Date('2024-02-08'),
    accion: 'Reunión para negociar plan de pagos',
    tipo: 'negociacion',
    usuario: 'admin1',
    notas: 'Cliente solicitó plan de pagos en 3 cuotas. Pendiente aprobación.',
    proximaSeguimiento: new Date('2024-02-10')
  },
  {
    id: 'seg3',
    pagoPendienteId: '4',
    fecha: new Date('2024-01-10'),
    accion: 'Documentación enviada a asesor legal',
    tipo: 'legal',
    usuario: 'admin1',
    notas: 'Caso escalado a gestión legal debido a extenso período de morosidad (58 días).'
  }
];

export const seguimientoAPI = {
  // Obtener seguimientos de un pago pendiente
  async obtenerSeguimientos(pagoPendienteId: string): Promise<SeguimientoPago[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockSeguimientos
      .filter(s => s.pagoPendienteId === pagoPendienteId)
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  },

  // Obtener todos los seguimientos
  async obtenerTodosSeguimientos(): Promise<SeguimientoPago[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockSeguimientos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  },

  // Crear nuevo seguimiento
  async crearSeguimiento(seguimiento: Omit<SeguimientoPago, 'id' | 'fecha'>): Promise<SeguimientoPago> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const nuevoSeguimiento: SeguimientoPago = {
      ...seguimiento,
      id: Date.now().toString(),
      fecha: new Date()
    };
    
    mockSeguimientos.push(nuevoSeguimiento);
    return nuevoSeguimiento;
  },

  // Actualizar seguimiento
  async actualizarSeguimiento(id: string, datos: Partial<SeguimientoPago>): Promise<SeguimientoPago> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockSeguimientos.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Seguimiento no encontrado');
    }
    
    mockSeguimientos[index] = {
      ...mockSeguimientos[index],
      ...datos
    };
    
    return mockSeguimientos[index];
  }
};

// ============================================================================
// SEGUIMIENTO DETALLADO DE ACCIONES DE COBRO
// ============================================================================
// 
// Este módulo implementa la lógica mock para el seguimiento detallado de 
// acciones de cobro realizadas con clientes morosos.
// 
// Las funciones aquí implementadas alimentan:
// - EstrategiasCobro.tsx: Para visualizar y analizar las acciones de cobro 
//   aplicadas según diferentes estrategias y niveles de riesgo
// - SeguimientoPagos.tsx: Para mostrar el historial completo de acciones de 
//   cobro realizadas con cada cliente
// - Reportes de efectividad: Para medir el éxito de las diferentes acciones 
//   de cobro y optimizar las estrategias de recuperación
//
// ============================================================================

// Mock data para acciones de cobro
// Nota: En producción, estas acciones estarían asociadas a clientes con 
// diferentes niveles de riesgo para permitir análisis de efectividad
const mockAccionesCobro: AccionCobro[] = [
  {
    id: 'acc-cobro-1',
    clienteId: 'cliente1',
    tipoAccion: 'llamada',
    fecha: new Date('2024-02-01'),
    resultado: 'compromisoPago',
    notas: 'Llamada realizada. Cliente prometió pagar esta semana. Mencionó problemas de flujo de caja temporales.'
  },
  {
    id: 'acc-cobro-2',
    clienteId: 'cliente2',
    tipoAccion: 'email',
    fecha: new Date('2024-02-03'),
    resultado: 'contactado',
    notas: 'Email enviado con recordatorio de pago pendiente. Cliente confirmó recepción.'
  },
  {
    id: 'acc-cobro-3',
    clienteId: 'cliente3',
    tipoAccion: 'whatsapp',
    fecha: new Date('2024-02-05'),
    resultado: 'pagoRealizado',
    notas: 'Mensaje enviado por WhatsApp. Cliente respondió y realizó el pago completo.'
  },
  {
    id: 'acc-cobro-4',
    clienteId: 'cliente4',
    tipoAccion: 'visita',
    fecha: new Date('2024-02-08'),
    resultado: 'compromisoPago',
    notas: 'Visita realizada al domicilio. Cliente acordó plan de pagos en 3 cuotas.'
  },
  {
    id: 'acc-cobro-5',
    clienteId: 'cliente5',
    tipoAccion: 'llamada',
    fecha: new Date('2024-02-10'),
    resultado: 'sinContacto',
    notas: 'Llamada realizada pero no se pudo establecer contacto. Dejado mensaje en buzón de voz.'
  },
  {
    id: 'acc-cobro-6',
    clienteId: 'cliente2',
    tipoAccion: 'llamada',
    fecha: new Date('2024-02-12'),
    resultado: 'compromisoPago',
    notas: 'Seguimiento de llamada anterior. Cliente confirmó que realizará el pago en los próximos días.'
  },
  {
    id: 'acc-cobro-7',
    clienteId: 'cliente6',
    tipoAccion: 'derivacionExterna',
    fecha: new Date('2024-02-15'),
    resultado: 'pendienteRespuesta',
    notas: 'Caso derivado a agencia externa de cobro debido a extenso período de morosidad (90+ días).'
  },
  {
    id: 'acc-cobro-8',
    clienteId: 'cliente1',
    tipoAccion: 'email',
    fecha: new Date('2024-02-18'),
    resultado: 'pagoRealizado',
    notas: 'Email de seguimiento enviado. Cliente cumplió con el compromiso y realizó el pago.'
  }
];

// Mapeo de clientes a niveles de riesgo (para simulación)
// En producción, esto vendría de la base de datos de ClienteMoroso
const clienteNivelRiesgo: Record<string, NivelRiesgo> = {
  'cliente1': 'bajo',
  'cliente2': 'medio',
  'cliente3': 'bajo',
  'cliente4': 'alto',
  'cliente5': 'medio',
  'cliente6': 'critico'
};

/**
 * API para el seguimiento detallado de acciones de cobro.
 * 
 * Este módulo proporciona funciones para registrar y consultar acciones de 
 * cobro realizadas con clientes morosos, permitiendo:
 * - Seguimiento detallado de cada acción de cobro
 * - Análisis de efectividad por tipo de acción y resultado
 * - Filtrado por cliente, nivel de riesgo y otros criterios
 * - Integración con componentes de visualización y reportes
 */
export const accionesCobroAPI = {
  /**
   * Registra una nueva acción de cobro realizada con un cliente.
   * 
   * Esta función es utilizada por:
   * - EstrategiasCobro.tsx: Para registrar acciones aplicadas según estrategias
   * - SeguimientoPagos.tsx: Para registrar contactos y acciones realizadas
   * - Reportes de efectividad: Para alimentar métricas de éxito de acciones
   * 
   * @param datos - Datos de la acción de cobro (sin id, que se genera automáticamente)
   * @returns Promise con la acción de cobro registrada incluyendo su id
   */
  async registrarAccionCobro(datos: Omit<AccionCobro, 'id'>): Promise<AccionCobro> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const nuevaAccion: AccionCobro = {
      ...datos,
      id: `acc-cobro-${Date.now()}`
    };
    
    mockAccionesCobro.push(nuevaAccion);
    return nuevaAccion;
  },

  /**
   * Obtiene todas las acciones de cobro realizadas con un cliente específico.
   * 
   * Esta función es utilizada por:
   * - SeguimientoPagos.tsx: Para mostrar el historial completo de acciones 
   *   de cobro de un cliente
   * - EstrategiasCobro.tsx: Para analizar el historial de acciones por cliente
   * - Reportes de efectividad: Para evaluar el éxito de acciones por cliente
   * 
   * @param clienteId - ID del cliente del cual se desean obtener las acciones
   * @returns Promise con el array de acciones de cobro del cliente, ordenadas 
   *          por fecha (más recientes primero)
   */
  async getAccionesCobroPorCliente(clienteId: string): Promise<AccionCobro[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockAccionesCobro
      .filter(accion => accion.clienteId === clienteId)
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  },

  /**
   * Obtiene acciones de cobro filtradas por nivel de riesgo del cliente.
   * 
   * Esta función es utilizada por:
   * - EstrategiasCobro.tsx: Para analizar acciones aplicadas según nivel de 
   *   riesgo y evaluar efectividad de estrategias por nivel
   * - Reportes de efectividad: Para comparar resultados de acciones entre 
   *   diferentes niveles de riesgo y optimizar estrategias
   * - Dashboard de morosidad: Para visualizar distribución de acciones por riesgo
   * 
   * @param nivel - Nivel de riesgo del cliente ('bajo' | 'medio' | 'alto' | 'critico')
   * @param filtros - Filtros opcionales para refinar la búsqueda:
   *                  - tipoAccion: Filtrar por tipo de acción específico
   *                  - resultado: Filtrar por resultado de la acción
   *                  - fechaInicio/fechaFin: Rango de fechas
   *                  - clienteId: Cliente específico (opcional)
   * @returns Promise con el array de acciones de cobro que coinciden con los 
   *          criterios, ordenadas por fecha (más recientes primero)
   */
  async getAccionesCobroPorNivelRiesgo(
    nivel: NivelRiesgo, 
    filtros?: Partial<FiltrosAccionesCobro>
  ): Promise<AccionCobro[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Filtrar acciones por nivel de riesgo del cliente
    let accionesFiltradas = mockAccionesCobro.filter(accion => {
      const nivelCliente = clienteNivelRiesgo[accion.clienteId];
      return nivelCliente === nivel;
    });

    // Aplicar filtros adicionales si se proporcionan
    if (filtros) {
      if (filtros.tipoAccion && filtros.tipoAccion.length > 0) {
        accionesFiltradas = accionesFiltradas.filter(accion =>
          filtros.tipoAccion!.includes(accion.tipoAccion)
        );
      }

      if (filtros.resultado && filtros.resultado.length > 0) {
        accionesFiltradas = accionesFiltradas.filter(accion =>
          filtros.resultado!.includes(accion.resultado)
        );
      }

      if (filtros.fechaInicio) {
        accionesFiltradas = accionesFiltradas.filter(accion =>
          accion.fecha >= filtros.fechaInicio!
        );
      }

      if (filtros.fechaFin) {
        accionesFiltradas = accionesFiltradas.filter(accion =>
          accion.fecha <= filtros.fechaFin!
        );
      }

      if (filtros.clienteId) {
        accionesFiltradas = accionesFiltradas.filter(accion =>
          accion.clienteId === filtros.clienteId
        );
      }
    }

    // Ordenar por fecha (más recientes primero)
    return accionesFiltradas.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  }
};

