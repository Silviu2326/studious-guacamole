import {
  RestriccionAlimentaria,
  AlertaSeguridad,
  ValidacionIngrediente,
  SustitucionSegura,
  ReporteCompliance,
  FormularioRestriccion,
  FiltrosRestricciones,
  FiltrosAlertas,
  Ingrediente,
  Alergeno,
  TipoRestriccion,
  SeveridadRestriccion,
  EstadoAlerta
} from '../types';

// Datos mock para desarrollo
const RESTRICCIONES_MOCK: RestriccionAlimentaria[] = [
  {
    id: '1',
    clienteId: 'cliente-1',
    tipo: 'alergia',
    nombre: 'Alergia al maní',
    descripcion: 'Alergia severa a los cacahuetes y derivados',
    severidad: 'severa',
    ingredientesProhibidos: ['maní', 'cacahuete', 'aceite de maní', 'mantequilla de maní'],
    ingredientesPermitidos: ['almendras', 'nueces', 'avellanas'],
    fechaCreacion: new Date('2024-01-15'),
    fechaActualizacion: new Date('2024-01-15'),
    activa: true,
    notas: 'Requiere epinefrina en caso de exposición'
  },
  {
    id: '2',
    clienteId: 'cliente-1',
    tipo: 'intolerancia',
    nombre: 'Intolerancia a la lactosa',
    descripcion: 'Dificultad para digerir productos lácteos',
    severidad: 'moderada',
    ingredientesProhibidos: ['leche', 'queso', 'mantequilla', 'yogur', 'crema'],
    ingredientesPermitidos: ['leche de almendras', 'leche de avena', 'queso vegano'],
    fechaCreacion: new Date('2024-01-10'),
    fechaActualizacion: new Date('2024-01-10'),
    activa: true
  },
  {
    id: '3',
    clienteId: 'cliente-2',
    tipo: 'religiosa',
    nombre: 'Halal',
    descripcion: 'Restricciones alimentarias según la ley islámica',
    severidad: 'critica',
    ingredientesProhibidos: ['cerdo', 'alcohol', 'gelatina de cerdo'],
    fechaCreacion: new Date('2024-01-05'),
    fechaActualizacion: new Date('2024-01-05'),
    activa: true
  }
];

const ALERTAS_MOCK: AlertaSeguridad[] = [
  {
    id: 'alerta-1',
    clienteId: 'cliente-1',
    restriccionId: '1',
    ingredienteId: 'ing-001',
    tipo: 'alergia',
    severidad: 'severa',
    mensaje: 'Ingrediente prohibido detectado',
    descripcion: 'Se detectó maní en la receta asignada al cliente',
    estado: 'activa',
    fechaCreacion: new Date(),
    accionesTomadas: [],
    responsable: 'Sistema automático'
  }
];

const INGREDIENTES_MOCK: Ingrediente[] = [
  {
    id: 'ing-001',
    nombre: 'Maní',
    categoria: 'Frutos secos',
    alergenos: ['frutos secos'],
    descripcion: 'Cacahuete común',
    alternativas: ['almendras', 'semillas de girasol'],
    esVegano: true,
    esVegetariano: true,
    esHalal: true,
    esKosher: true,
    sinGluten: true,
    sinLactosa: true
  },
  {
    id: 'ing-002',
    nombre: 'Leche',
    categoria: 'Lácteos',
    alergenos: ['lactosa'],
    descripcion: 'Leche de vaca',
    alternativas: ['leche de almendras', 'leche de avena', 'leche de soja'],
    esVegano: false,
    esVegetariano: true,
    esHalal: true,
    esKosher: true,
    sinGluten: true,
    sinLactosa: false
  }
];

const SUSTITUCIONES_MOCK: SustitucionSegura[] = [
  {
    id: 'sust-1',
    ingredienteOriginal: 'Maní',
    ingredienteSustituto: 'Almendras',
    tipoRestriccion: 'alergia',
    compatibilidad: 85,
    descripcion: 'Sustitución segura para alergia al maní',
    notas: 'Mantiene perfil nutricional similar'
  },
  {
    id: 'sust-2',
    ingredienteOriginal: 'Leche',
    ingredienteSustituto: 'Leche de almendras',
    tipoRestriccion: 'intolerancia',
    compatibilidad: 90,
    descripcion: 'Alternativa sin lactosa',
    notas: 'Fortificada con calcio y vitamina D'
  }
];

class RestriccionesService {
  // Gestión de restricciones
  async obtenerRestricciones(filtros?: FiltrosRestricciones): Promise<RestriccionAlimentaria[]> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let restricciones = [...RESTRICCIONES_MOCK];
    
    if (filtros) {
      if (filtros.tipo && filtros.tipo.length > 0) {
        restricciones = restricciones.filter(r => filtros.tipo!.includes(r.tipo));
      }
      
      if (filtros.severidad && filtros.severidad.length > 0) {
        restricciones = restricciones.filter(r => filtros.severidad!.includes(r.severidad));
      }
      
      if (filtros.clienteId) {
        restricciones = restricciones.filter(r => r.clienteId === filtros.clienteId);
      }
      
      if (filtros.activa !== undefined) {
        restricciones = restricciones.filter(r => r.activa === filtros.activa);
      }
      
      if (filtros.busqueda) {
        const busqueda = filtros.busqueda.toLowerCase();
        restricciones = restricciones.filter(r => 
          r.nombre.toLowerCase().includes(busqueda) ||
          r.descripcion?.toLowerCase().includes(busqueda) ||
          r.ingredientesProhibidos.some(ing => ing.toLowerCase().includes(busqueda))
        );
      }
    }
    
    return restricciones;
  }

  async obtenerRestriccionPorId(id: string): Promise<RestriccionAlimentaria | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return RESTRICCIONES_MOCK.find(r => r.id === id) || null;
  }

  async crearRestriccion(restriccion: FormularioRestriccion, clienteId: string): Promise<RestriccionAlimentaria> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const nuevaRestriccion: RestriccionAlimentaria = {
      id: `restriccion-${Date.now()}`,
      clienteId,
      ...restriccion,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      activa: true
    };
    
    RESTRICCIONES_MOCK.push(nuevaRestriccion);
    return nuevaRestriccion;
  }

  async actualizarRestriccion(id: string, datos: Partial<FormularioRestriccion>): Promise<RestriccionAlimentaria> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = RESTRICCIONES_MOCK.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Restricción no encontrada');
    }
    
    RESTRICCIONES_MOCK[index] = {
      ...RESTRICCIONES_MOCK[index],
      ...datos,
      fechaActualizacion: new Date()
    };
    
    return RESTRICCIONES_MOCK[index];
  }

  async eliminarRestriccion(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = RESTRICCIONES_MOCK.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Restricción no encontrada');
    }
    
    RESTRICCIONES_MOCK.splice(index, 1);
  }

  // Validación de ingredientes
  async validarIngrediente(ingredienteId: string, clienteId: string): Promise<ValidacionIngrediente> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const ingrediente = INGREDIENTES_MOCK.find(i => i.id === ingredienteId);
    if (!ingrediente) {
      throw new Error('Ingrediente no encontrado');
    }
    
    const restriccionesCliente = RESTRICCIONES_MOCK.filter(r => r.clienteId === clienteId && r.activa);
    const restriccionesVioladas: RestriccionAlimentaria[] = [];
    const alertasGeneradas: AlertaSeguridad[] = [];
    
    // Verificar cada restricción
    for (const restriccion of restriccionesCliente) {
      const esProhibido = restriccion.ingredientesProhibidos.some(prohibido => 
        ingrediente.nombre.toLowerCase().includes(prohibido.toLowerCase()) ||
        ingrediente.alergenos.some(alergeno => alergeno.toLowerCase().includes(prohibido.toLowerCase()))
      );
      
      if (esProhibido) {
        restriccionesVioladas.push(restriccion);
        
        // Generar alerta
        const alerta: AlertaSeguridad = {
          id: `alerta-${Date.now()}-${Math.random()}`,
          clienteId,
          restriccionId: restriccion.id,
          ingredienteId,
          tipo: restriccion.tipo,
          severidad: restriccion.severidad,
          mensaje: `Ingrediente prohibido: ${ingrediente.nombre}`,
          descripcion: `El ingrediente ${ingrediente.nombre} está prohibido debido a ${restriccion.nombre}`,
          estado: 'activa',
          fechaCreacion: new Date(),
          responsable: 'Sistema automático'
        };
        
        alertasGeneradas.push(alerta);
        ALERTAS_MOCK.push(alerta);
      }
    }
    
    // Buscar alternativas si hay violaciones
    const alternativasSugeridas: Ingrediente[] = [];
    if (restriccionesVioladas.length > 0) {
      alternativasSugeridas.push(...INGREDIENTES_MOCK.filter(i => 
        i.id !== ingredienteId && 
        ingrediente.alternativas?.includes(i.nombre)
      ));
    }
    
    return {
      ingredienteId,
      clienteId,
      esSeguro: restriccionesVioladas.length === 0,
      restriccionesVioladas,
      alertasGeneradas,
      alternativasSugeridas,
      razonRechazo: restriccionesVioladas.length > 0 
        ? `Viola ${restriccionesVioladas.length} restricción(es): ${restriccionesVioladas.map(r => r.nombre).join(', ')}`
        : undefined
    };
  }

  // Gestión de alertas
  async obtenerAlertas(filtros?: FiltrosAlertas): Promise<AlertaSeguridad[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let alertas = [...ALERTAS_MOCK];
    
    if (filtros) {
      if (filtros.estado && filtros.estado.length > 0) {
        alertas = alertas.filter(a => filtros.estado!.includes(a.estado));
      }
      
      if (filtros.tipo && filtros.tipo.length > 0) {
        alertas = alertas.filter(a => filtros.tipo!.includes(a.tipo));
      }
      
      if (filtros.severidad && filtros.severidad.length > 0) {
        alertas = alertas.filter(a => filtros.severidad!.includes(a.severidad));
      }
      
      if (filtros.clienteId) {
        alertas = alertas.filter(a => a.clienteId === filtros.clienteId);
      }
    }
    
    return alertas.sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime());
  }

  async marcarAlertaComoResuelta(alertaId: string, accion: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const alerta = ALERTAS_MOCK.find(a => a.id === alertaId);
    if (!alerta) {
      throw new Error('Alerta no encontrada');
    }
    
    alerta.estado = 'resuelta';
    alerta.fechaResolucion = new Date();
    alerta.accionesTomadas = [...(alerta.accionesTomadas || []), accion];
  }

  async ignorarAlerta(alertaId: string, razon: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const alerta = ALERTAS_MOCK.find(a => a.id === alertaId);
    if (!alerta) {
      throw new Error('Alerta no encontrada');
    }
    
    alerta.estado = 'ignorada';
    alerta.accionesTomadas = [...(alerta.accionesTomadas || []), `Ignorada: ${razon}`];
  }

  // Sustituciones seguras
  async obtenerSustituciones(ingredienteId: string, tipoRestriccion?: TipoRestriccion): Promise<SustitucionSegura[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const ingrediente = INGREDIENTES_MOCK.find(i => i.id === ingredienteId);
    if (!ingrediente) {
      return [];
    }
    
    let sustituciones = SUSTITUCIONES_MOCK.filter(s => 
      s.ingredienteOriginal.toLowerCase() === ingrediente.nombre.toLowerCase()
    );
    
    if (tipoRestriccion) {
      sustituciones = sustituciones.filter(s => s.tipoRestriccion === tipoRestriccion);
    }
    
    return sustituciones.sort((a, b) => b.compatibilidad - a.compatibilidad);
  }

  // Reportes de compliance
  async generarReporteCompliance(periodo: { inicio: Date; fin: Date }): Promise<ReporteCompliance> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const alertasEnPeriodo = ALERTAS_MOCK.filter(a => 
      a.fechaCreacion >= periodo.inicio && a.fechaCreacion <= periodo.fin
    );
    
    const alertasPorTipo = alertasEnPeriodo.reduce((acc, alerta) => {
      acc[alerta.tipo] = (acc[alerta.tipo] || 0) + 1;
      return acc;
    }, {} as Record<TipoRestriccion, number>);
    
    const alertasPorSeveridad = alertasEnPeriodo.reduce((acc, alerta) => {
      acc[alerta.severidad] = (acc[alerta.severidad] || 0) + 1;
      return acc;
    }, {} as Record<SeveridadRestriccion, number>);
    
    const clientesAfectados = new Set(alertasEnPeriodo.map(a => a.clienteId)).size;
    
    const alertasResueltas = alertasEnPeriodo.filter(a => a.estado === 'resuelta' && a.fechaResolucion);
    const tiempoPromedioResolucion = alertasResueltas.length > 0
      ? alertasResueltas.reduce((acc, alerta) => {
          const tiempo = alerta.fechaResolucion!.getTime() - alerta.fechaCreacion.getTime();
          return acc + tiempo;
        }, 0) / alertasResueltas.length / (1000 * 60) // en minutos
      : 0;
    
    const cumplimientoNormativo = alertasEnPeriodo.length > 0
      ? (alertasResueltas.length / alertasEnPeriodo.length) * 100
      : 100;
    
    return {
      id: `reporte-${Date.now()}`,
      fechaGeneracion: new Date(),
      periodo,
      totalAlertas: alertasEnPeriodo.length,
      alertasPorTipo,
      alertasPorSeveridad,
      clientesAfectados,
      tiempoPromedioResolucion,
      cumplimientoNormativo,
      recomendaciones: [
        'Implementar validación automática en tiempo real',
        'Capacitar al personal en manejo de restricciones alimentarias',
        'Actualizar base de datos de ingredientes regularmente'
      ],
      detalles: alertasEnPeriodo.map(alerta => ({
        id: alerta.id,
        clienteId: alerta.clienteId,
        fecha: alerta.fechaCreacion,
        tipo: alerta.tipo,
        severidad: alerta.severidad,
        descripcion: alerta.descripcion,
        accion: alerta.accionesTomadas?.join(', ') || 'Sin acción',
        resultado: alerta.estado,
        responsable: alerta.responsable || 'No asignado'
      }))
    };
  }
}

export const restriccionesService = new RestriccionesService();