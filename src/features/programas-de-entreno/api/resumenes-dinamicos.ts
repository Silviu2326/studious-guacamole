/**
 * API para obtener resúmenes dinámicos con comparación de semanas anteriores
 * User Story: Como coach quiero ver resúmenes dinámicos (tendencias de volumen, intensidad, adherencia, calorías) 
 * con comparación respecto a semanas anteriores, para detectar cambios significativos.
 */

export interface TendenciaSemanal {
  semana: string; // Formato: "2024-W01" o fecha inicio
  fechaInicio: string;
  fechaFin: string;
  volumen: number; // Volumen total de entrenamiento
  intensidad: {
    promedio: number; // 0-10
    baja: number; // Porcentaje de sesiones de baja intensidad
    media: number;
    alta: number;
  };
  adherencia: number; // 0-100
  calorias: number; // Calorías totales estimadas
  sesionesCompletadas: number;
  sesionesProgramadas: number;
}

export interface ComparacionSemanal {
  semanaActual: TendenciaSemanal;
  semanaAnterior: TendenciaSemanal;
  cambios: {
    volumen: {
      valor: number;
      porcentaje: number;
      significativo: boolean; // Cambio > 15%
    };
    intensidad: {
      valor: number;
      porcentaje: number;
      significativo: boolean; // Cambio > 10%
    };
    adherencia: {
      valor: number;
      porcentaje: number;
      significativo: boolean; // Cambio > 10%
    };
    calorias: {
      valor: number;
      porcentaje: number;
      significativo: boolean; // Cambio > 15%
    };
  };
  tendencia: 'mejorando' | 'empeorando' | 'estable';
}

export interface ResumenDinamico {
  clienteId: string;
  clienteNombre: string;
  comparaciones: ComparacionSemanal[];
  historico: TendenciaSemanal[]; // Últimas 8 semanas
  alertas: {
    tipo: 'volumen' | 'intensidad' | 'adherencia' | 'calorias';
    mensaje: string;
    severidad: 'alta' | 'media' | 'baja';
  }[];
  ultimaActualizacion: string;
}

// Mock data storage
const MOCK_RESUMENES: Map<string, ResumenDinamico> = new Map();

/**
 * Genera datos mock para un cliente
 */
function generarDatosMock(clienteId: string, clienteNombre: string): ResumenDinamico {
  const ahora = new Date();
  const historico: TendenciaSemanal[] = [];
  
  // Generar datos para las últimas 8 semanas
  for (let i = 7; i >= 0; i--) {
    const fechaInicio = new Date(ahora);
    fechaInicio.setDate(fechaInicio.getDate() - (i * 7) - 7);
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + 6);
    
    // Simular variación realista
    const baseVolumen = 1200;
    const variacion = (Math.random() - 0.5) * 400;
    const volumen = Math.max(500, baseVolumen + variacion);
    
    const baseIntensidad = 6.5;
    const variacionIntensidad = (Math.random() - 0.5) * 1.5;
    const intensidadPromedio = Math.max(4, Math.min(9, baseIntensidad + variacionIntensidad));
    
    const baseAdherencia = 75;
    const variacionAdherencia = (Math.random() - 0.5) * 20;
    const adherencia = Math.max(50, Math.min(100, baseAdherencia + variacionAdherencia));
    
    const calorias = Math.round(volumen * 0.8);
    const sesionesProgramadas = 4 + Math.floor(Math.random() * 3);
    const sesionesCompletadas = Math.round(sesionesProgramadas * (adherencia / 100));
    
    historico.push({
      semana: `Semana ${8 - i}`,
      fechaInicio: fechaInicio.toISOString().split('T')[0],
      fechaFin: fechaFin.toISOString().split('T')[0],
      volumen,
      intensidad: {
        promedio: intensidadPromedio,
        baja: 30 + Math.random() * 20,
        media: 40 + Math.random() * 20,
        alta: 30 + Math.random() * 20,
      },
      adherencia,
      calorias,
      sesionesCompletadas,
      sesionesProgramadas,
    });
  }
  
  // Calcular comparaciones
  const comparaciones: ComparacionSemanal[] = [];
  for (let i = 1; i < historico.length; i++) {
    const actual = historico[i];
    const anterior = historico[i - 1];
    
    const cambioVolumen = actual.volumen - anterior.volumen;
    const cambioIntensidad = actual.intensidad.promedio - anterior.intensidad.promedio;
    const cambioAdherencia = actual.adherencia - anterior.adherencia;
    const cambioCalorias = actual.calorias - anterior.calorias;
    
    const cambios = {
      volumen: {
        valor: cambioVolumen,
        porcentaje: anterior.volumen > 0 ? (cambioVolumen / anterior.volumen) * 100 : 0,
        significativo: Math.abs(cambioVolumen / anterior.volumen) > 0.15,
      },
      intensidad: {
        valor: cambioIntensidad,
        porcentaje: anterior.intensidad.promedio > 0 ? (cambioIntensidad / anterior.intensidad.promedio) * 100 : 0,
        significativo: Math.abs(cambioIntensidad) > 1.0,
      },
      adherencia: {
        valor: cambioAdherencia,
        porcentaje: cambioAdherencia,
        significativo: Math.abs(cambioAdherencia) > 10,
      },
      calorias: {
        valor: cambioCalorias,
        porcentaje: anterior.calorias > 0 ? (cambioCalorias / anterior.calorias) * 100 : 0,
        significativo: Math.abs(cambioCalorias / anterior.calorias) > 0.15,
      },
    };
    
    // Determinar tendencia general
    const mejoras = [
      cambios.volumen.porcentaje > 0,
      cambios.intensidad.porcentaje > 0,
      cambios.adherencia.porcentaje > 0,
    ].filter(Boolean).length;
    
    const empeoramientos = [
      cambios.volumen.porcentaje < 0,
      cambios.intensidad.porcentaje < 0,
      cambios.adherencia.porcentaje < 0,
    ].filter(Boolean).length;
    
    let tendencia: 'mejorando' | 'empeorando' | 'estable' = 'estable';
    if (mejoras > empeoramientos) {
      tendencia = 'mejorando';
    } else if (empeoramientos > mejoras) {
      tendencia = 'empeorando';
    }
    
    comparaciones.push({
      semanaActual: actual,
      semanaAnterior: anterior,
      cambios,
      tendencia,
    });
  }
  
  // Generar alertas basadas en cambios significativos
  const alertas: ResumenDinamico['alertas'] = [];
  const ultimaComparacion = comparaciones[comparaciones.length - 1];
  
  if (ultimaComparacion) {
    if (ultimaComparacion.cambios.volumen.significativo && ultimaComparacion.cambios.volumen.porcentaje < -15) {
      alertas.push({
        tipo: 'volumen',
        mensaje: `Reducción significativa de volumen: ${ultimaComparacion.cambios.volumen.porcentaje.toFixed(1)}%`,
        severidad: 'alta',
      });
    }
    
    if (ultimaComparacion.cambios.adherencia.significativo && ultimaComparacion.cambios.adherencia.porcentaje < -10) {
      alertas.push({
        tipo: 'adherencia',
        mensaje: `Caída significativa en adherencia: ${ultimaComparacion.cambios.adherencia.porcentaje.toFixed(1)}%`,
        severidad: 'alta',
      });
    }
    
    if (ultimaComparacion.cambios.intensidad.significativo && ultimaComparacion.cambios.intensidad.valor > 1.5) {
      alertas.push({
        tipo: 'intensidad',
        mensaje: `Aumento significativo de intensidad: +${ultimaComparacion.cambios.intensidad.valor.toFixed(1)} puntos`,
        severidad: 'media',
      });
    }
  }
  
  return {
    clienteId,
    clienteNombre,
    comparaciones,
    historico,
    alertas,
    ultimaActualizacion: ahora.toISOString(),
  };
}

/**
 * Obtiene el resumen dinámico para un cliente
 */
export const getResumenDinamico = async (clienteId: string): Promise<ResumenDinamico> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Si no existe, generar datos mock
  if (!MOCK_RESUMENES.has(clienteId)) {
    // Obtener nombre del cliente (mock)
    const clientes: Record<string, string> = {
      '1': 'Carla',
      '2': 'Miguel',
      '3': 'Ana',
    };
    const clienteNombre = clientes[clienteId] || `Cliente ${clienteId}`;
    
    const resumen = generarDatosMock(clienteId, clienteNombre);
    MOCK_RESUMENES.set(clienteId, resumen);
  }
  
  return MOCK_RESUMENES.get(clienteId)!;
};

/**
 * Obtiene resúmenes dinámicos para todos los clientes del entrenador
 */
export const getResumenesDinamicos = async (): Promise<ResumenDinamico[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const clientes = [
    { id: '1', nombre: 'Carla' },
    { id: '2', nombre: 'Miguel' },
    { id: '3', nombre: 'Ana' },
  ];
  
  const resumenes = await Promise.all(
    clientes.map(cliente => getResumenDinamico(cliente.id))
  );
  
  return resumenes;
};

