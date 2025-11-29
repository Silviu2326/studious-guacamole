import { RecordatorioContacto, ContactoCobro, TipoContactoCobro, ResultadoContactoCobro } from '../types';

// Mock data para recordatorios de contacto programados
const mockRecordatoriosContacto: RecordatorioContacto[] = [
  {
    id: 'rec-cont-1',
    pagoPendienteId: '3',
    clienteId: 'cliente3',
    clienteNombre: 'Carlos Rodríguez',
    fechaRecordatorio: new Date('2024-02-20'),
    nota: 'Cliente prometió pagar esta semana, recordar contactar',
    completado: false,
    fechaCreacion: new Date('2024-02-08'),
    creadoPor: 'usuario_actual'
  },
  {
    id: 'rec-cont-2',
    pagoPendienteId: '5',
    clienteId: 'cliente5',
    clienteNombre: 'Luis Hernández',
    fechaRecordatorio: new Date('2024-02-18'),
    nota: 'Revisar respuesta sobre plan de pagos',
    completado: false,
    fechaCreacion: new Date('2024-02-10'),
    creadoPor: 'usuario_actual'
  }
];

export const recordatoriosContactoAPI = {
  // Obtener todos los recordatorios de contacto
  async obtenerTodos(): Promise<RecordatorioContacto[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockRecordatoriosContacto.filter(r => !r.completado);
  },

  // Obtener recordatorios pendientes (no completados y con fecha <= hoy)
  async obtenerPendientes(): Promise<RecordatorioContacto[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return mockRecordatoriosContacto.filter(r => {
      const fechaRec = new Date(r.fechaRecordatorio);
      fechaRec.setHours(0, 0, 0, 0);
      return !r.completado && fechaRec <= hoy;
    });
  },

  // Crear nuevo recordatorio de contacto
  async crear(recordatorio: Omit<RecordatorioContacto, 'id' | 'fechaCreacion' | 'completado'>): Promise<RecordatorioContacto> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const nuevoRecordatorio: RecordatorioContacto = {
      ...recordatorio,
      id: `rec-cont-${Date.now()}`,
      fechaCreacion: new Date(),
      completado: false
    };
    
    mockRecordatoriosContacto.push(nuevoRecordatorio);
    return nuevoRecordatorio;
  },

  // Marcar recordatorio como completado
  async marcarCompletado(id: string): Promise<RecordatorioContacto> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockRecordatoriosContacto.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Recordatorio no encontrado');
    }
    
    mockRecordatoriosContacto[index] = {
      ...mockRecordatoriosContacto[index],
      completado: true,
      fechaCompletado: new Date()
    };
    
    return mockRecordatoriosContacto[index];
  },

  // Eliminar recordatorio
  async eliminar(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockRecordatoriosContacto.findIndex(r => r.id === id);
    if (index !== -1) {
      mockRecordatoriosContacto.splice(index, 1);
    }
  }
};

// ============================================================================
// REGISTRO DE INTENTOS DE CONTACTO (CONTACTOS DE COBRO)
// ============================================================================

/**
 * Mock data para registros de intentos de contacto realizados con clientes.
 * Estos datos se visualizan en:
 * - RecordatoriosContacto.tsx: Para mostrar el historial de contactos realizados
 * - SeguimientoPagos.tsx: Para el seguimiento de contactos por cliente en la gestión de cobros
 */
const mockContactosCobro: ContactoCobro[] = [
  {
    id: 'cont-cobro-1',
    clienteId: 'cliente3',
    pagoPendienteId: '3',
    tipoContacto: 'llamada',
    fecha: new Date('2024-02-15T10:30:00'),
    resultado: 'contactado',
    notas: 'Cliente atendió la llamada. Mencionó que tiene problemas de liquidez pero prometió pagar esta semana.',
    usuario: 'usuario_actual',
    fechaCreacion: new Date('2024-02-15T10:35:00')
  },
  {
    id: 'cont-cobro-2',
    clienteId: 'cliente3',
    pagoPendienteId: '3',
    tipoContacto: 'email',
    fecha: new Date('2024-02-12T14:20:00'),
    resultado: 'pendienteRespuesta',
    notas: 'Se envió recordatorio de pago pendiente por email. Esperando respuesta.',
    usuario: 'usuario_actual',
    fechaCreacion: new Date('2024-02-12T14:20:00')
  },
  {
    id: 'cont-cobro-3',
    clienteId: 'cliente5',
    pagoPendienteId: '5',
    tipoContacto: 'whatsapp',
    fecha: new Date('2024-02-18T09:15:00'),
    resultado: 'compromisoPago',
    notas: 'Cliente respondió por WhatsApp. Acordó realizar pago parcial el próximo viernes.',
    usuario: 'usuario_actual',
    fechaCreacion: new Date('2024-02-18T09:20:00')
  },
  {
    id: 'cont-cobro-4',
    clienteId: 'cliente5',
    pagoPendienteId: '5',
    tipoContacto: 'llamada',
    fecha: new Date('2024-02-10T16:45:00'),
    resultado: 'sinContacto',
    notas: 'No contestó la llamada. Dejó mensaje en buzón de voz.',
    usuario: 'usuario_actual',
    fechaCreacion: new Date('2024-02-10T16:50:00')
  },
  {
    id: 'cont-cobro-5',
    clienteId: 'cliente1',
    pagoPendienteId: '1',
    tipoContacto: 'visita',
    fecha: new Date('2024-02-20T11:00:00'),
    resultado: 'contactado',
    notas: 'Visita realizada al domicilio. Cliente no estaba presente, se dejó aviso con vecino.',
    usuario: 'usuario_actual',
    fechaCreacion: new Date('2024-02-20T11:30:00')
  }
];

/**
 * API para gestión de registros de intentos de contacto de cobro.
 * 
 * Los contactos registrados aquí se utilizan para:
 * - RecordatoriosContacto.tsx: Visualizar el historial completo de contactos realizados
 *   con cada cliente, permitiendo ver la efectividad de los diferentes tipos de contacto.
 * 
 * - SeguimientoPagos.tsx: Mostrar el historial de contactos en el seguimiento de pagos,
 *   ayudando a identificar patrones y determinar próximas acciones de cobro.
 */
export const contactosCobroAPI = {
  /**
   * Registra un nuevo intento de contacto realizado con un cliente.
   * 
   * @param datos - Datos del contacto a registrar (sin id y fechaCreacion, se generan automáticamente)
   * @returns Promise<ContactoCobro> - El contacto registrado con id y fechaCreacion asignados
   * 
   * @example
   * const contacto = await contactosCobroAPI.registrarContacto({
   *   clienteId: 'cliente3',
   *   pagoPendienteId: '3',
   *   tipoContacto: 'llamada',
   *   fecha: new Date(),
   *   resultado: 'contactado',
   *   notas: 'Cliente atendió y prometió pagar',
   *   usuario: 'usuario_actual'
   * });
   */
  async registrarContacto(
    datos: Omit<ContactoCobro, 'id' | 'fechaCreacion'>
  ): Promise<ContactoCobro> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const nuevoContacto: ContactoCobro = {
      ...datos,
      id: `cont-cobro-${Date.now()}`,
      fechaCreacion: new Date()
    };
    
    mockContactosCobro.push(nuevoContacto);
    return nuevoContacto;
  },

  /**
   * Obtiene todos los contactos registrados para un cliente específico.
   * 
   * @param clienteId - ID del cliente del cual se desean obtener los contactos
   * @returns Promise<ContactoCobro[]> - Lista de contactos ordenados por fecha (más recientes primero)
   * 
   * @example
   * const contactos = await contactosCobroAPI.getContactosPorCliente('cliente3');
   * // Retorna todos los contactos (llamadas, emails, whatsapp, visitas) realizados con cliente3
   */
  async getContactosPorCliente(clienteId: string): Promise<ContactoCobro[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const contactos = mockContactosCobro
      .filter(contacto => contacto.clienteId === clienteId)
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime()); // Más recientes primero
    
    return contactos;
  },

  /**
   * Obtiene todos los contactos registrados (útil para reportes y análisis).
   * 
   * @returns Promise<ContactoCobro[]> - Lista completa de contactos ordenados por fecha
   */
  async obtenerTodos(): Promise<ContactoCobro[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [...mockContactosCobro].sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  },

  /**
   * Obtiene contactos filtrados por tipo de contacto.
   * 
   * @param tipoContacto - Tipo de contacto a filtrar
   * @returns Promise<ContactoCobro[]> - Lista de contactos del tipo especificado
   */
  async obtenerPorTipo(tipoContacto: TipoContactoCobro): Promise<ContactoCobro[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockContactosCobro
      .filter(contacto => contacto.tipoContacto === tipoContacto)
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  },

  /**
   * Obtiene contactos filtrados por resultado.
   * 
   * @param resultado - Resultado del contacto a filtrar
   * @returns Promise<ContactoCobro[]> - Lista de contactos con el resultado especificado
   */
  async obtenerPorResultado(resultado: ResultadoContactoCobro): Promise<ContactoCobro[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockContactosCobro
      .filter(contacto => contacto.resultado === resultado)
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  }
};

