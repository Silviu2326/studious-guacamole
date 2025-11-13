import type { AlertaSobrecarga, BloquePreventivo, Dieta, TipoSobrecarga } from '../types';

// Detectar sobrecargas en una dieta
export async function detectarSobrecargas(
  dieta: Dieta
): Promise<AlertaSobrecarga[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const alertas: AlertaSobrecarga[] = [];
  
  // Analizar comidas por día
  const comidasPorDia: Record<string, typeof dieta.comidas> = {};
  dieta.comidas.forEach(comida => {
    const dia = comida.dia || 'lunes';
    if (!comidasPorDia[dia]) {
      comidasPorDia[dia] = [];
    }
    comidasPorDia[dia].push(comida);
  });

  // Calcular fibra por día y detectar alimentos procesados
  const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  const fibraPorDia: Record<string, number> = {};
  const hidratacionPorDia: Record<string, number> = {};
  const procesadosPorDia: Record<string, number> = {}; // Contador de alimentos procesados por día
  
  // Palabras clave para identificar alimentos procesados
  const palabrasProcesados = [
    'pan blanco', 'pan de molde', 'cereales azucarados', 'bollería', 'galletas',
    'embutidos', 'salchichas', 'nuggets', 'pizza', 'hamburguesa',
    'refrescos', 'zumos envasados', 'snacks', 'patatas fritas', 'precocinado',
    'conservas', 'latas', 'congelado procesado', 'sopas instantáneas', 'comida rápida'
  ];
  
  diasSemana.forEach(dia => {
    if (comidasPorDia[dia]) {
      let fibraTotal = 0;
      let hidratacionTotal = 0;
      let procesadosCount = 0;
      
      comidasPorDia[dia].forEach(comida => {
        // Calcular fibra de los alimentos
        comida.alimentos.forEach(alimento => {
          // Simulación: algunos alimentos tienen más fibra que otros
          const nombreAlimento = alimento.nombre.toLowerCase();
          if (nombreAlimento.includes('fibra') || nombreAlimento.includes('integral') || 
              nombreAlimento.includes('avena') || nombreAlimento.includes('legumbres') ||
              nombreAlimento.includes('brócoli') || nombreAlimento.includes('espinacas')) {
            fibraTotal += alimento.cantidad * 3; // 3g de fibra por porción
          } else if (nombreAlimento.includes('fruta') || nombreAlimento.includes('verdura')) {
            fibraTotal += alimento.cantidad * 2; // 2g de fibra por porción
          } else {
            fibraTotal += alimento.cantidad * 0.5; // 0.5g de fibra por porción
          }
          
          // Detectar alimentos procesados
          if (palabrasProcesados.some(palabra => nombreAlimento.includes(palabra))) {
            procesadosCount++;
          }
        });
        
        // Simular hidratación (el agua vendría de bebidas registradas)
        if (comida.tipo === 'desayuno' || comida.tipo === 'almuerzo' || comida.tipo === 'cena') {
          hidratacionTotal += 250; // 250ml por comida principal
        }
      });
      
      fibraPorDia[dia] = fibraTotal;
      hidratacionPorDia[dia] = hidratacionTotal;
      procesadosPorDia[dia] = procesadosCount;
    }
  });

  // Detectar exceso de fibra dos días seguidos
  const objetivoFibra = dieta.fibra || 30;
  let diasConExcesoFibra: string[] = [];
  let diasConDeficienciaFibra: string[] = [];
  
  diasSemana.forEach(dia => {
    if (fibraPorDia[dia] !== undefined) {
      // Exceso de fibra (>130% del objetivo)
      if (fibraPorDia[dia] > objetivoFibra * 1.3) {
        diasConExcesoFibra.push(dia);
      }
      // Deficiencia de fibra (<70% del objetivo)
      if (fibraPorDia[dia] < objetivoFibra * 0.7) {
        diasConDeficienciaFibra.push(dia);
      }
    }
  });

  // Alertar si hay exceso de fibra en 2+ días consecutivos
  let diasConExcesoConsecutivos: string[] = [];
  for (let i = 0; i < diasSemana.length - 1; i++) {
    const dia1 = diasSemana[i];
    const dia2 = diasSemana[i + 1];
    if (diasConExcesoFibra.includes(dia1) && diasConExcesoFibra.includes(dia2)) {
      if (!diasConExcesoConsecutivos.includes(dia1)) diasConExcesoConsecutivos.push(dia1);
      if (!diasConExcesoConsecutivos.includes(dia2)) diasConExcesoConsecutivos.push(dia2);
    }
  }

  if (diasConExcesoConsecutivos.length >= 2) {
    alertas.push({
      id: `alerta-${Date.now()}-1`,
      dietaId: dieta.id,
      clienteId: dieta.clienteId,
      tipo: 'exceso-fibra',
      severidad: 'media',
      titulo: 'Exceso de fibra detectado',
      descripcion: `Se detectó exceso de fibra (más del 130% del objetivo) en ${diasConExcesoConsecutivos.length} días consecutivos. Esto puede causar molestias digestivas.`,
      detalles: {
        diasAfectados: diasConExcesoConsecutivos,
        valores: {
          fibra: Math.max(...diasConExcesoConsecutivos.map(d => fibraPorDia[d])),
          objetivo: objetivoFibra,
        },
        patron: 'Dos días consecutivos con exceso de fibra',
      },
      soluciones: [
        'Reducir alimentos ricos en fibra como legumbres y cereales integrales en los días afectados',
        'Incrementar gradualmente la ingesta de agua para facilitar la digestión',
        'Sustituir algunas fuentes de fibra por opciones más suaves temporalmente',
        'Espaciar las comidas con alto contenido de fibra a lo largo del día'
      ],
      bloquePreventivo: {
        id: `bloque-${Date.now()}-1`,
        alertaId: `alerta-${Date.now()}-1`,
        tipo: 'ajuste-macros',
        nombre: 'Reducir fibra',
        descripcion: 'Ajustar comidas para reducir contenido de fibra en los días afectados',
        ajusteMacros: {
          fibra: -5, // Reducir 5g de fibra
        },
        diasAplicar: diasConExcesoConsecutivos,
        creadoEn: new Date().toISOString(),
      },
      vista: false,
      bloqueAplicado: false,
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    });
  }

  // Alertar si hay deficiencia de fibra en 3+ días
  if (diasConDeficienciaFibra.length >= 3) {
    alertas.push({
      id: `alerta-${Date.now()}-deficiencia-fibra`,
      dietaId: dieta.id,
      clienteId: dieta.clienteId,
      tipo: 'deficiencia-fibra',
      severidad: 'alta',
      titulo: 'Deficiencia de fibra detectada',
      descripcion: `Se detectó deficiencia de fibra (menos del 70% del objetivo de ${objetivoFibra}g) en ${diasConDeficienciaFibra.length} días. La fibra es esencial para la digestión y salud intestinal.`,
      detalles: {
        diasAfectados: diasConDeficienciaFibra,
        valores: {
          fibra: Math.min(...diasConDeficienciaFibra.map(d => fibraPorDia[d])),
          objetivo: objetivoFibra,
        },
        patron: 'Déficit de fibra en múltiples días',
      },
      soluciones: [
        'Añadir 1-2 porciones de frutas frescas (manzana, pera, fresas) en el desayuno o media mañana',
        'Incluir legumbres (lentejas, garbanzos, alubias) 2-3 veces por semana en el almuerzo',
        'Sustituir pan blanco por pan integral o añadir avena al desayuno',
        'Incrementar consumo de verduras: brócoli, espinacas, zanahorias en las comidas principales',
        'Añadir frutos secos (almendras, nueces) como snack saludable',
        'Incluir quinoa, arroz integral o pasta integral en lugar de versiones refinadas'
      ],
      bloquePreventivo: {
        id: `bloque-${Date.now()}-deficiencia-fibra`,
        alertaId: `alerta-${Date.now()}-deficiencia-fibra`,
        tipo: 'comida',
        nombre: 'Aumentar fibra',
        descripcion: 'Añadir comidas ricas en fibra en los días afectados',
        ajusteMacros: {
          fibra: 10, // Aumentar 10g de fibra
        },
        diasAplicar: diasConDeficienciaFibra,
        creadoEn: new Date().toISOString(),
      },
      vista: false,
      bloqueAplicado: false,
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    });
  }

  // Detectar baja ingesta de agua
  const objetivoHidratacion = (dieta.vasosAgua || 8) * 250; // 250ml por vaso (objetivo: 2000ml)
  const diasConBajaHidratacion: string[] = [];
  
  Object.entries(hidratacionPorDia).forEach(([dia, ml]) => {
    if (ml < objetivoHidratacion * 0.7) {
      diasConBajaHidratacion.push(dia);
    }
  });

  if (diasConBajaHidratacion.length > 0) {
    alertas.push({
      id: `alerta-${Date.now()}-2`,
      dietaId: dieta.id,
      clienteId: dieta.clienteId,
      tipo: 'baja-hidratacion',
      severidad: 'alta',
      titulo: 'Baja ingesta de agua detectada',
      descripcion: `Se detectó baja ingesta de agua (menos del 70% del objetivo de ${objetivoHidratacion}ml) en ${diasConBajaHidratacion.length} día(s). La hidratación adecuada es esencial para la salud.`,
      detalles: {
        diasAfectados: diasConBajaHidratacion,
        valores: {
          hidratacion: Math.min(...diasConBajaHidratacion.map(d => hidratacionPorDia[d])),
          objetivo: objetivoHidratacion,
        },
        patron: 'Hidratación por debajo del objetivo',
      },
      soluciones: [
        'Beber 1-2 vasos de agua (250-500ml) al despertar antes del desayuno',
        'Establecer recordatorios cada 2 horas para beber agua durante el día',
        'Llevar una botella de agua reutilizable y mantenerla visible en el escritorio',
        'Beber un vaso de agua antes de cada comida principal (desayuno, almuerzo, cena)',
        'Añadir infusiones sin azúcar (té verde, manzanilla) como alternativa al agua',
        'Incluir alimentos ricos en agua: pepino, tomate, sandía, melón en las comidas',
        'Beber agua durante el ejercicio: 250ml antes, durante y después del entrenamiento'
      ],
      bloquePreventivo: {
        id: `bloque-${Date.now()}-2`,
        alertaId: `alerta-${Date.now()}-2`,
        tipo: 'bebida',
        nombre: 'Recordatorio de hidratación',
        descripcion: 'Añadir recordatorios de hidratación en los días afectados',
        ajusteMacros: {
          agua: 500, // Añadir 500ml de agua
        },
        diasAplicar: diasConBajaHidratacion,
        creadoEn: new Date().toISOString(),
      },
      vista: false,
      bloqueAplicado: false,
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    });
  }

  // Detectar exceso de alimentos procesados
  const diasConExcesoProcesados: string[] = [];
  const umbralProcesados = 3; // Más de 3 alimentos procesados por día se considera exceso
  
  Object.entries(procesadosPorDia).forEach(([dia, count]) => {
    if (count > umbralProcesados) {
      diasConExcesoProcesados.push(dia);
    }
  });

  if (diasConExcesoProcesados.length >= 2) {
    alertas.push({
      id: `alerta-${Date.now()}-procesados`,
      dietaId: dieta.id,
      clienteId: dieta.clienteId,
      tipo: 'exceso-procesados',
      severidad: 'media',
      titulo: 'Exceso de alimentos procesados detectado',
      descripcion: `Se detectó un exceso de alimentos procesados (más de ${umbralProcesados} por día) en ${diasConExcesoProcesados.length} días. Los alimentos procesados suelen tener alto contenido de sodio, azúcares añadidos y conservantes.`,
      detalles: {
        diasAfectados: diasConExcesoProcesados,
        valores: {
          procesados: Math.max(...diasConExcesoProcesados.map(d => procesadosPorDia[d])),
          umbral: umbralProcesados,
        },
        patron: 'Alto consumo de alimentos procesados',
      },
      soluciones: [
        'Sustituir pan blanco por pan integral casero o de panadería artesanal',
        'Reemplazar embutidos por proteínas frescas: pollo, pavo, atún natural, huevos',
        'Preparar snacks saludables caseros: frutos secos, fruta fresca, yogur natural',
        'Cocinar comidas desde cero usando ingredientes frescos en lugar de precocinados',
        'Leer etiquetas nutricionales y evitar productos con más de 5 ingredientes o azúcares añadidos',
        'Planificar las comidas con antelación para evitar recurrir a opciones procesadas',
        'Tener siempre opciones saludables a mano: frutas, verduras cortadas, yogur natural'
      ],
      bloquePreventivo: {
        id: `bloque-${Date.now()}-procesados`,
        alertaId: `alerta-${Date.now()}-procesados`,
        tipo: 'comida',
        nombre: 'Sustituir procesados',
        descripcion: 'Sustituir alimentos procesados por opciones frescas y naturales',
        diasAplicar: diasConExcesoProcesados,
        creadoEn: new Date().toISOString(),
      },
      vista: false,
      bloqueAplicado: false,
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    });
  }

  return alertas;
}

// Obtener alertas de sobrecarga para una dieta
export async function getAlertasSobrecarga(
  dietaId: string
): Promise<AlertaSobrecarga[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción, obtendría las alertas de la base de datos
  return [];
}

// Marcar alerta como vista
export async function marcarAlertaVista(
  alertaId: string
): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // En producción, actualizaría el estado en la base de datos
  return true;
}

// Aplicar bloque preventivo
export async function aplicarBloquePreventivo(
  bloqueId: string,
  dietaId: string
): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción, aplicaría el bloque preventivo a la dieta
  return true;
}

