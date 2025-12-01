import { 
  AlertaVencimiento, 
  FiltrosAlertasVencimiento,
  ConfiguracionAlertas 
} from '../types';

// ============================================================================
// DATOS MOCK Y CONFIGURACIÓN
// ============================================================================

// Configuración por defecto de alertas
let configuracionAlertas: ConfiguracionAlertas = {
  diasAnticipacion: 30,
  prioridadAltaUmbral: 7,
  prioridadMediaUmbral: 15,
};

// Datos mock de alertas de vencimiento
// Generamos alertas con distintos niveles de prioridad y días restantes
const generarAlertasMock = (): AlertaVencimiento[] => {
  const ahora = new Date();
  const canales: Array<'email' | 'whatsapp' | 'sms' | 'ninguno'> = ['email', 'whatsapp', 'sms', 'ninguno'];
  
  // Generamos alertas con diferentes escenarios
  const escenarios = [
    // Alertas urgentes (alta prioridad, pocos días)
    { diasRestantes: 1, prioridad: 'alta' as const, leida: false },
    { diasRestantes: 2, prioridad: 'alta' as const, leida: false },
    { diasRestantes: 3, prioridad: 'alta' as const, leida: true },
    { diasRestantes: 5, prioridad: 'alta' as const, leida: false },
    { diasRestantes: 7, prioridad: 'alta' as const, leida: false },
    
    // Alertas de prioridad media
    { diasRestantes: 8, prioridad: 'media' as const, leida: false },
    { diasRestantes: 10, prioridad: 'media' as const, leida: true },
    { diasRestantes: 12, prioridad: 'media' as const, leida: false },
    { diasRestantes: 15, prioridad: 'media' as const, leida: true },
    { diasRestantes: 18, prioridad: 'media' as const, leida: false },
    
    // Alertas de prioridad baja
    { diasRestantes: 20, prioridad: 'baja' as const, leida: true },
    { diasRestantes: 25, prioridad: 'baja' as const, leida: false },
    { diasRestantes: 28, prioridad: 'baja' as const, leida: true },
    { diasRestantes: 30, prioridad: 'baja' as const, leida: false },
  ];

  const nombresClientes = [
    'Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 'Luis Rodríguez',
    'Laura Sánchez', 'Pedro Fernández', 'Carmen Torres', 'Miguel Díaz', 'Isabel Ruiz',
    'Francisco Jiménez', 'Elena Moreno', 'Javier Gómez', 'Sofía Martín', 'Diego Hernández',
  ];

  return escenarios.map((escenario, index) => {
    const fechaVencimiento = new Date(ahora);
    fechaVencimiento.setDate(ahora.getDate() + escenario.diasRestantes);
    
    const fechaCreacion = new Date(ahora);
    fechaCreacion.setDate(ahora.getDate() - Math.floor(Math.random() * 10)); // Creada hace 0-10 días
    
    const clienteNombre = nombresClientes[index % nombresClientes.length];
    const clienteId = `cliente-${String(index + 1).padStart(3, '0')}`;
    
    // Generar mensaje según prioridad
    let mensaje = '';
    if (escenario.prioridad === 'alta') {
      mensaje = `Suscripción vence en ${escenario.diasRestantes} ${escenario.diasRestantes === 1 ? 'día' : 'días'}. Acción requerida urgentemente.`;
    } else if (escenario.prioridad === 'media') {
      mensaje = `Suscripción vence en ${escenario.diasRestantes} días. Planificar renovación.`;
    } else {
      mensaje = `Suscripción vence en ${escenario.diasRestantes} días. Revisar próximamente.`;
    }
    
    return {
      id: `alerta-${String(index + 1).padStart(3, '0')}`,
      suscripcionId: `susc-${String(index + 1).padStart(3, '0')}`,
      clienteId,
      fechaVencimiento: fechaVencimiento.toISOString(),
      diasRestantes: escenario.diasRestantes,
      prioridad: escenario.prioridad,
      leida: escenario.leida,
      canalPreferido: canales[Math.floor(Math.random() * canales.length)],
      creadoEn: fechaCreacion.toISOString(),
      cliente: {
        id: clienteId,
        nombre: clienteNombre,
        email: `${clienteNombre.toLowerCase().replace(' ', '.')}@example.com`,
        telefono: `+34 6${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
      },
      mensaje,
    };
  });
};

// Almacenamiento en memoria de las alertas
let alertasMock: AlertaVencimiento[] = generarAlertasMock();

// ============================================================================
// FUNCIONES DE API
// ============================================================================

/**
 * Obtiene las alertas de vencimiento aplicando los filtros especificados
 * @param filtros - Filtros opcionales para filtrar las alertas (o UserType para compatibilidad)
 * @returns Promise con el array de alertas filtradas
 */
export async function getAlertasVencimiento(
  filtros?: FiltrosAlertasVencimiento | 'entrenador' | 'gimnasio'
): Promise<AlertaVencimiento[]> {
  // Si se pasa un UserType, convertir a filtros vacíos
  const filtrosReales = typeof filtros === 'string' ? undefined : filtros;
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let alertasFiltradas = [...alertasMock];
  
  // Aplicar filtros
  if (filtrosReales) {
    if (filtrosReales.prioridad !== undefined) {
      alertasFiltradas = alertasFiltradas.filter(
        alerta => alerta.prioridad === filtrosReales.prioridad
      );
    }
    
    if (filtrosReales.diasRestantesMin !== undefined) {
      alertasFiltradas = alertasFiltradas.filter(
        alerta => alerta.diasRestantes >= filtrosReales.diasRestantesMin!
      );
    }
    
    if (filtrosReales.diasRestantesMax !== undefined) {
      alertasFiltradas = alertasFiltradas.filter(
        alerta => alerta.diasRestantes <= filtrosReales.diasRestantesMax!
      );
    }
    
    if (filtrosReales.leida !== undefined) {
      alertasFiltradas = alertasFiltradas.filter(
        alerta => alerta.leida === filtrosReales.leida
      );
    }
  }
  
  // Ordenar por prioridad (alta > media > baja) y luego por días restantes (ascendente)
  const ordenPrioridad = { alta: 1, media: 2, baja: 3 };
  alertasFiltradas.sort((a, b) => {
    const diffPrioridad = ordenPrioridad[a.prioridad] - ordenPrioridad[b.prioridad];
    if (diffPrioridad !== 0) return diffPrioridad;
    return a.diasRestantes - b.diasRestantes;
  });
  
  return alertasFiltradas;
}

/**
 * Marca una alerta como leída
 * @param id - Identificador de la alerta
 * @returns Promise con la alerta actualizada
 * @throws Error si la alerta no existe
 */
export async function marcarAlertaComoLeida(
  id: string
): Promise<AlertaVencimiento> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const alertaIndex = alertasMock.findIndex(alerta => alerta.id === id);
  
  if (alertaIndex === -1) {
    throw new Error(`Alerta con id ${id} no encontrada`);
  }
  
  // Actualizar la alerta
  alertasMock[alertaIndex] = {
    ...alertasMock[alertaIndex],
    leida: true,
  };
  
  return alertasMock[alertaIndex];
}

/**
 * Configura los días de anticipación y umbrales de prioridad para las alertas
 * @param config - Configuración de días de anticipación y umbrales
 * @returns Promise con la configuración actualizada (solo diasAnticipacion según especificación)
 */
export async function configurarDiasAnticipacion(config: {
  diasAnticipacion: number;
  prioridadAltaUmbral: number;
  prioridadMediaUmbral: number;
}): Promise<{ diasAnticipacion: number }> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Validar valores
  if (config.diasAnticipacion < 1 || config.diasAnticipacion > 365) {
    throw new Error('Los días de anticipación deben estar entre 1 y 365');
  }
  
  if (config.prioridadAltaUmbral < 0 || config.prioridadAltaUmbral > config.prioridadMediaUmbral) {
    throw new Error('El umbral de prioridad alta debe ser menor o igual al umbral de prioridad media');
  }
  
  if (config.prioridadMediaUmbral < config.prioridadAltaUmbral || config.prioridadMediaUmbral > config.diasAnticipacion) {
    throw new Error('El umbral de prioridad media debe estar entre el umbral de prioridad alta y los días de anticipación');
  }
  
  // Actualizar configuración
  configuracionAlertas = {
    diasAnticipacion: config.diasAnticipacion,
    prioridadAltaUmbral: config.prioridadAltaUmbral,
    prioridadMediaUmbral: config.prioridadMediaUmbral,
  };
  
  // Regenerar alertas con la nueva configuración
  // En una implementación real, esto se haría en el backend
  alertasMock = generarAlertasMock();
  
  return {
    diasAnticipacion: configuracionAlertas.diasAnticipacion,
  };
}

/**
 * Obtiene la configuración actual de alertas
 * @returns Promise con la configuración completa de alertas
 */
export async function getConfiguracionAlertas(): Promise<ConfiguracionAlertas> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return { ...configuracionAlertas };
}

/**
 * Procesa una alerta con una acción específica
 * @param id - Identificador de la alerta
 * @param accion - Acción a realizar sobre la alerta
 * @returns Promise con la alerta procesada
 * @throws Error si la alerta no existe
 */
export async function procesarAlerta(
  id: string,
  accion: 'renovar' | 'contactar' | 'posponer'
): Promise<AlertaVencimiento> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const alertaIndex = alertasMock.findIndex(alerta => alerta.id === id);
  
  if (alertaIndex === -1) {
    throw new Error(`Alerta con id ${id} no encontrada`);
  }
  
  // En una implementación real, aquí se procesaría la acción
  // Por ahora, solo marcamos como leída y retornamos
  alertasMock[alertaIndex] = {
    ...alertasMock[alertaIndex],
    leida: true,
  };
  
  return alertasMock[alertaIndex];
}

/**
 * Descarta/desecha una alerta
 * @param id - Identificador de la alerta
 * @returns Promise con true si se descartó correctamente
 * @throws Error si la alerta no existe
 */
export async function descartarAlerta(id: string): Promise<boolean> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const alertaIndex = alertasMock.findIndex(alerta => alerta.id === id);
  
  if (alertaIndex === -1) {
    throw new Error(`Alerta con id ${id} no encontrada`);
  }
  
  // Eliminar la alerta del array
  alertasMock.splice(alertaIndex, 1);
  
  return true;
}

/**
 * Alias para marcarAlertaComoLeida (compatibilidad con código existente)
 * @param id - Identificador de la alerta
 * @returns Promise con la alerta actualizada
 */
export async function marcarAlertaLeida(
  id: string
): Promise<AlertaVencimiento> {
  return marcarAlertaComoLeida(id);
}
