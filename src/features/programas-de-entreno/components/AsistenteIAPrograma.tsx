import React, { useState, useRef, useEffect } from 'react';
import { Button, Tabs } from '../../../components/componentsreutilizables';
import {
  Brain,
  Send,
  Loader2,
  Sparkles,
  MessageSquare,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Plus,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Save,
  Bookmark,
  BarChart3,
  Info,
} from 'lucide-react';
import type { DayPlan, DaySession, ContextoCliente, ResumenObjetivosProgreso, TimelineSesiones } from '../types';

type DayKey = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';

interface RazonamientoSugerencia {
  metricas?: {
    nombre: string;
    valor: string | number;
    unidad?: string;
    tendencia?: 'up' | 'down' | 'neutral';
  }[];
  razonamiento?: string;
  factoresConsiderados?: string[];
  confianza?: number; // 0-100
}

interface Mensaje {
  id: string;
  tipo: 'usuario' | 'asistente';
  contenido: string;
  timestamp: Date;
  bloquesGenerados?: BloqueGenerado[];
  razonamiento?: RazonamientoSugerencia;
  guardado?: boolean;
}

interface BloqueGenerado {
  id: string;
  block: string;
  duration: string;
  modality: string;
  intensity: string;
  time?: string;
  notes?: string;
}

interface AsistenteIAProgramaProps {
  weeklyPlan: Record<DayKey, DayPlan>;
  selectedDay: DayKey;
  selectedDayPlan: DayPlan;
  clientInfo?: {
    nombre: string;
    objetivos: string[];
    restricciones: string[];
    notas?: string;
  };
  weeklyTargets?: {
    sessions: number;
    duration: number;
    calories: number;
  };
  contextoCliente?: ContextoCliente;
  objetivosProgreso?: ResumenObjetivosProgreso;
  timelineSesiones?: TimelineSesiones;
  onAddBlock?: (block: DaySession) => void;
}

type ModoAsistente = 'asistente' | 'chat';

export const AsistenteIAPrograma: React.FC<AsistenteIAProgramaProps> = ({
  weeklyPlan,
  selectedDay,
  selectedDayPlan,
  clientInfo,
  weeklyTargets,
  contextoCliente,
  objetivosProgreso,
  timelineSesiones,
  onAddBlock,
}) => {
  const [modo, setModo] = useState<ModoAsistente>('asistente');
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [inputMensaje, setInputMensaje] = useState('');
  const [procesando, setProcesando] = useState(false);
  const mensajesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Inicializar mensaje de bienvenida cuando se cambia a modo chat
  useEffect(() => {
    if (modo === 'chat' && mensajes.length === 0) {
      const mensajeBienvenida: Mensaje = {
        id: 'bienvenida',
        tipo: 'asistente',
        contenido: `¡Hola! Soy tu asistente de entrenamiento. Puedo ayudarte con ajustes y sugerencias sobre el programa actual.\n\nPuedes preguntarme sobre:\n• Ajustes de intensidad o volumen\n• Sugerencias de ejercicios\n• Optimización del plan semanal\n• Análisis de carga de trabajo\n• Adaptaciones por restricciones\n\n¿En qué puedo ayudarte?`,
        timestamp: new Date(),
      };
      setMensajes([mensajeBienvenida]);
    }
  }, [modo]);

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  useEffect(() => {
    if (modo === 'chat') {
      inputRef.current?.focus();
    }
  }, [modo]);

  const procesarConsulta = async (consulta: string): Promise<{ respuesta: string; bloques?: BloqueGenerado[] }> => {
    // Simular procesamiento (en producción sería una llamada a API de IA)
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const consultaLower = consulta.toLowerCase();

    // Análisis del programa actual
    const weekDays: DayKey[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const totalSessions = weekDays.reduce((acc, day) => acc + weeklyPlan[day].sessions.length, 0);
    const totalDuration = weekDays.reduce((acc, day) => {
      return (
        acc +
        weeklyPlan[day].sessions.reduce((sum, session) => {
          const match = session.duration.match(/\d+/);
          return sum + (match ? Number(match[0]) : 0);
        }, 0)
      );
    }, 0);

    // Detectar si la consulta solicita generar bloques específicos
    const patronesBloques = [
      { pattern: /añade?\s+(?:un\s+)?calentamiento\s+(?:de\s+)?(\d+)\s*min/i, tipo: 'calentamiento' },
      { pattern: /añade?\s+(?:un\s+)?enfriamiento\s+(?:de\s+)?(\d+)\s*min/i, tipo: 'enfriamiento' },
      { pattern: /añade?\s+(?:un\s+)?bloque\s+(?:de\s+)?(fuerza|cardio|mobility|core|metcon|recuperación|recovery)\s+(?:de\s+)?(\d+)\s*min/i, tipo: 'bloque' },
      { pattern: /crea?\s+(?:un\s+)?(?:bloque\s+)?(?:de\s+)?(calentamiento|enfriamiento|fuerza|cardio|mobility|core|metcon|recuperación|recovery)\s+(?:de\s+)?(\d+)\s*min/i, tipo: 'bloque' },
      { pattern: /genera?\s+(?:un\s+)?(?:bloque\s+)?(?:de\s+)?(calentamiento|enfriamiento|fuerza|cardio|mobility|core|metcon|recuperación|recovery)\s+(?:de\s+)?(\d+)\s*min/i, tipo: 'bloque' },
    ];

    for (const { pattern, tipo } of patronesBloques) {
      const match = consulta.match(pattern);
      if (match) {
        const bloques = generarBloquesDesdeConsulta(consulta, match, tipo, contextoCliente, objetivosProgreso);
        if (bloques && bloques.length > 0) {
          const razonamiento = generarRazonamientoBloques(bloques, contextoCliente, objetivosProgreso);
          return {
            respuesta: `He generado ${bloques.length} bloque(s) listo(s) para añadir al plan. Puedes arrastrarlos al día correspondiente.`,
            bloques,
            razonamiento,
          };
        }
      }
    }

    // Detectar tipo de consulta y responder
    if (consultaLower.includes('intensidad') || consultaLower.includes('rpe')) {
      const respuesta = analizarIntensidad(weeklyPlan, weekDays, selectedDayPlan, contextoCliente, objetivosProgreso);
      const razonamiento = generarRazonamientoIntensidad(weeklyPlan, weekDays, selectedDayPlan, contextoCliente, objetivosProgreso);
      return { respuesta, razonamiento };
    }

    if (consultaLower.includes('volumen') || consultaLower.includes('series')) {
      const respuesta = analizarVolumen(weeklyPlan, weekDays, selectedDayPlan, contextoCliente);
      const razonamiento = generarRazonamientoVolumen(weeklyPlan, weekDays, selectedDayPlan, contextoCliente);
      return { respuesta, razonamiento };
    }

    if (consultaLower.includes('duración') || consultaLower.includes('tiempo') || consultaLower.includes('minutos')) {
      const respuesta = analizarDuracion(weeklyPlan, weekDays, selectedDayPlan, totalDuration, contextoCliente);
      const razonamiento = generarRazonamientoDuracion(weeklyPlan, weekDays, selectedDayPlan, totalDuration, weeklyTargets);
      return { respuesta, razonamiento };
    }

    if (consultaLower.includes('sugerencia') || consultaLower.includes('mejora') || consultaLower.includes('optimizar')) {
      const respuesta = generarSugerencias(selectedDayPlan, clientInfo, weeklyTargets, contextoCliente, objetivosProgreso, timelineSesiones);
      const razonamiento = generarRazonamientoSugerencias(selectedDayPlan, clientInfo, weeklyTargets, contextoCliente, objetivosProgreso);
      return { respuesta, razonamiento };
    }

    if (consultaLower.includes('restricción') || consultaLower.includes('lesión') || consultaLower.includes('limitación')) {
      const respuesta = analizarRestricciones(weeklyPlan, weekDays, clientInfo, contextoCliente);
      const razonamiento = generarRazonamientoRestricciones(clientInfo, contextoCliente);
      return { respuesta, razonamiento };
    }

    if (consultaLower.includes('día') || consultaLower.includes('dia') || consultaLower.includes('semana')) {
      return { respuesta: analizarDistribucionSemanal(weeklyPlan, weekDays, contextoCliente) };
    }

    if (consultaLower.includes('resumen') || consultaLower.includes('resume')) {
      return { respuesta: generarResumenEstructurado(weeklyPlan, weekDays, selectedDayPlan, weeklyTargets, contextoCliente, objetivosProgreso) };
    }

    if (consultaLower.includes('objetivo') || consultaLower.includes('meta')) {
      return { respuesta: analizarObjetivos(selectedDayPlan, clientInfo, weeklyTargets, objetivosProgreso) };
    }

    if (consultaLower.includes('modificar') || consultaLower.includes('cambiar') || consultaLower.includes('ajustar')) {
      const respuesta = generarSugerenciasAjuste(selectedDayPlan, clientInfo, contextoCliente);
      const razonamiento = generarRazonamientoAjustes(selectedDayPlan, clientInfo, contextoCliente);
      return { respuesta, razonamiento };
    }

    // Respuesta por defecto
    return {
      respuesta: `He analizado tu consulta sobre "${consulta}". Basándome en el programa actual${contextoCliente ? ` y los datos de ${contextoCliente.clienteNombre}` : ''}:\n\n` +
        `• Total de sesiones semanales: ${totalSessions}\n` +
        `• Duración total semanal: ${totalDuration} min\n` +
        `• Día actual: ${selectedDay} - ${selectedDayPlan.focus}\n` +
        `• Sesiones del día: ${selectedDayPlan.sessions.length}\n\n` +
        `¿Puedes ser más específico? Por ejemplo:\n` +
        `• "Añade calentamiento de 10 min" - Genera un bloque listo para arrastrar\n` +
        `• "Añade bloque de fuerza de 30 min" - Crea un bloque de entrenamiento\n` +
        `• Pregunta sobre intensidad, volumen, duración, sugerencias o restricciones`,
    };
  };

  // Función para generar bloques desde consultas específicas
  const generarBloquesDesdeConsulta = (
    consulta: string,
    match: RegExpMatchArray,
    tipo: string,
    contextoCliente?: ContextoCliente,
    objetivosProgreso?: ResumenObjetivosProgreso
  ): BloqueGenerado[] => {
    const bloques: BloqueGenerado[] = [];
    const duracion = parseInt(match[1] || match[2] || '10', 10);
    const tipoBloque = match[2] || match[1] || tipo;

    // Considerar restricciones del cliente al generar bloques
    const tieneLesionRodilla = contextoCliente?.lesiones.some(
      (l) => l.estado === 'activa' && (l.ubicacion.toLowerCase().includes('rodilla') || l.nombre.toLowerCase().includes('rodilla'))
    );
    const tieneLesionLumbar = contextoCliente?.lesiones.some(
      (l) => l.estado === 'activa' && (l.ubicacion.toLowerCase().includes('lumbar') || l.ubicacion.toLowerCase().includes('espalda'))
    );

    if (tipo === 'calentamiento' || tipoBloque.toLowerCase().includes('calentamiento')) {
      const ejercicios = tieneLesionRodilla
        ? 'Movilidad articular + activación sin impacto'
        : tieneLesionLumbar
        ? 'Movilidad torácica + activación core'
        : 'Movilidad dinámica completa';
      
      bloques.push({
        id: `block-${Date.now()}-1`,
        block: 'Calentamiento dinámico',
        duration: `${duracion} min`,
        modality: 'Mobility',
        intensity: 'Ligera',
        time: '08:00',
        notes: ejercicios,
      });
    } else if (tipo === 'enfriamiento' || tipoBloque.toLowerCase().includes('enfriamiento')) {
      bloques.push({
        id: `block-${Date.now()}-1`,
        block: 'Enfriamiento y estiramiento',
        duration: `${duracion} min`,
        modality: 'Recovery',
        intensity: 'Ligera',
        time: '18:00',
        notes: 'Estiramientos estáticos + respiración',
      });
    } else if (tipoBloque.toLowerCase().includes('fuerza') || tipoBloque.toLowerCase().includes('strength')) {
      const ejercicios = tieneLesionRodilla
        ? 'Ejercicios de tren superior + trabajo unilateral tren inferior'
        : tieneLesionLumbar
        ? 'Ejercicios de fuerza con foco en estabilidad core'
        : 'Bloque de fuerza completo';
      
      bloques.push({
        id: `block-${Date.now()}-1`,
        block: 'Bloque de fuerza',
        duration: `${duracion} min`,
        modality: 'Strength',
        intensity: 'RPE 7',
        time: '10:00',
        notes: ejercicios,
      });
    } else if (tipoBloque.toLowerCase().includes('cardio')) {
      const ejercicios = tieneLesionRodilla
        ? 'Cardio de bajo impacto (bike, elíptica)'
        : 'Cardio zona 2-3';
      
      bloques.push({
        id: `block-${Date.now()}-1`,
        block: 'Bloque de cardio',
        duration: `${duracion} min`,
        modality: 'Cardio',
        intensity: 'Moderada',
        time: '12:00',
        notes: ejercicios,
      });
    } else if (tipoBloque.toLowerCase().includes('mobility')) {
      bloques.push({
        id: `block-${Date.now()}-1`,
        block: 'Movilidad y flexibilidad',
        duration: `${duracion} min`,
        modality: 'Mobility',
        intensity: 'Ligera',
        time: '09:00',
        notes: 'Movilidad articular + estiramientos dinámicos',
      });
    } else if (tipoBloque.toLowerCase().includes('core')) {
      bloques.push({
        id: `block-${Date.now()}-1`,
        block: 'Core y estabilidad',
        duration: `${duracion} min`,
        modality: 'Core',
        intensity: 'Moderada',
        time: '11:00',
        notes: 'Trabajo de core funcional y estabilidad',
      });
    } else if (tipoBloque.toLowerCase().includes('metcon')) {
      const ejercicios = tieneLesionRodilla
        ? 'MetCon de bajo impacto'
        : 'MetCon de alta intensidad';
      
      bloques.push({
        id: `block-${Date.now()}-1`,
        block: 'MetCon',
        duration: `${duracion} min`,
        modality: 'MetCon',
        intensity: 'Alta',
        time: '18:00',
        notes: ejercicios,
      });
    } else if (tipoBloque.toLowerCase().includes('recuperación') || tipoBloque.toLowerCase().includes('recovery')) {
      bloques.push({
        id: `block-${Date.now()}-1`,
        block: 'Recuperación activa',
        duration: `${duracion} min`,
        modality: 'Recovery',
        intensity: 'Ligera',
        time: '19:00',
        notes: 'Movilidad suave + respiración',
      });
    }

    return bloques;
  };

  const analizarIntensidad = (
    weeklyPlan: Record<DayKey, DayPlan>,
    weekDays: DayKey[],
    selectedDayPlan: DayPlan,
    contextoCliente?: ContextoCliente,
    objetivosProgreso?: ResumenObjetivosProgreso
  ): string => {
    const intensidades: string[] = [];
    weekDays.forEach((day) => {
      weeklyPlan[day].sessions.forEach((session) => {
        if (session.intensity) {
          intensidades.push(session.intensity);
        }
      });
    });

    const rpeValues = intensidades
      .map((i) => {
        const match = i.match(/RPE\s*(\d+\.?\d*)/i);
        return match ? parseFloat(match[1]) : null;
      })
      .filter((v): v is number => v !== null);

    const promedioRPE = rpeValues.length > 0 ? rpeValues.reduce((a, b) => a + b, 0) / rpeValues.length : 0;

    let respuesta = `📊 **Análisis de intensidad:**\n\n`;
    if (contextoCliente) {
      respuesta += `**Cliente:** ${contextoCliente.clienteNombre}\n`;
      if (contextoCliente.lesiones.some((l) => l.estado === 'activa')) {
        respuesta += `⚠️ **Atención:** Cliente con lesiones activas. Considera intensidades moderadas.\n\n`;
      }
    }
    respuesta += `• Intensidad del día actual (${selectedDay}): ${selectedDayPlan.intensity}\n`;
    respuesta += `• Promedio RPE semanal: ${promedioRPE > 0 ? promedioRPE.toFixed(1) : 'N/A'}\n\n`;

    if (promedioRPE > 8) {
      respuesta += `⚠️ **Observación:** El RPE promedio es alto (${promedioRPE.toFixed(1)}). Considera incluir días de recuperación activa.\n\n`;
    } else if (promedioRPE < 6) {
      respuesta += `💡 **Sugerencia:** El RPE promedio es moderado. Podrías aumentar la intensidad en días clave para mayor estímulo.\n\n`;
    }
    
    if (objetivosProgreso) {
      const objetivosFuerza = objetivosProgreso.objetivos.filter((o) => o.categoria === 'fuerza');
      if (objetivosFuerza.length > 0 && promedioRPE < 7) {
        respuesta += `💪 **Nota:** Tienes objetivos de fuerza activos. Considera aumentar la intensidad en días de fuerza.\n\n`;
      }
    }

    respuesta += `📈 **Distribución de intensidades:**\n`;
    const intensidadCounts: Record<string, number> = {};
    intensidades.forEach((i) => {
      intensidadCounts[i] = (intensidadCounts[i] || 0) + 1;
    });
    Object.entries(intensidadCounts).forEach(([intensidad, count]) => {
      respuesta += `• ${intensidad}: ${count} sesión(es)\n`;
    });

    return respuesta;
  };

  const analizarVolumen = (
    weeklyPlan: Record<DayKey, DayPlan>,
    weekDays: DayKey[],
    selectedDayPlan: DayPlan,
    contextoCliente?: ContextoCliente
  ): string => {
    const volumenes: string[] = [];
    weekDays.forEach((day) => {
      if (weeklyPlan[day].volume) {
        volumenes.push(weeklyPlan[day].volume);
      }
    });

    let respuesta = `📊 **Análisis de volumen:**\n\n`;
    if (contextoCliente) {
      respuesta += `**Cliente:** ${contextoCliente.clienteNombre}\n`;
      const habitosRutina = contextoCliente.habitos.find((h) => h.tipo === 'rutina-semanal');
      if (habitosRutina) {
        respuesta += `• Objetivo de sesiones semanales del cliente: ${habitosRutina.objetivo} sesiones\n`;
        respuesta += `• Cumplimiento actual: ${habitosRutina.cumplimiento}%\n\n`;
      }
    }
    respuesta += `• Volumen del día actual (${selectedDay}): ${selectedDayPlan.volume}\n`;
    respuesta += `• Sesiones del día: ${selectedDayPlan.sessions.length}\n\n`;

    respuesta += `📈 **Volumen por día:**\n`;
    weekDays.forEach((day) => {
      const plan = weeklyPlan[day];
      if (plan.volume) {
        respuesta += `• ${day}: ${plan.volume} (${plan.sessions.length} sesiones)\n`;
      }
    });

    const totalSessions = weekDays.reduce((acc, day) => acc + weeklyPlan[day].sessions.length, 0);
    respuesta += `\n• Total semanal: ${totalSessions} sesiones\n`;

    return respuesta;
  };

  const analizarDuracion = (
    weeklyPlan: Record<DayKey, DayPlan>,
    weekDays: DayKey[],
    selectedDayPlan: DayPlan,
    totalDuration: number,
    contextoCliente?: ContextoCliente
  ): string => {
    const duracionesPorDia: Record<string, number> = {};
    weekDays.forEach((day) => {
      const duracionDia = weeklyPlan[day].sessions.reduce((sum, session) => {
        const match = session.duration.match(/\d+/);
        return sum + (match ? Number(match[0]) : 0);
      }, 0);
      duracionesPorDia[day] = duracionDia;
    });

    const duracionDiaActual = duracionesPorDia[selectedDay];

    let respuesta = `⏱️ **Análisis de duración:**\n\n`;
    if (contextoCliente) {
      respuesta += `**Cliente:** ${contextoCliente.clienteNombre}\n`;
      if (contextoCliente.cronotipo === 'matutino') {
        respuesta += `🌅 Cliente matutino - Mejor rendimiento en las primeras horas del día\n\n`;
      } else if (contextoCliente.cronotipo === 'vespertino') {
        respuesta += `🌙 Cliente vespertino - Mejor rendimiento en la tarde/noche\n\n`;
      }
    }
    respuesta += `• Duración del día actual (${selectedDay}): ${duracionDiaActual} min\n`;
    respuesta += `• Duración total semanal: ${totalDuration} min\n`;
    respuesta += `• Promedio diario: ${Math.round(totalDuration / 7)} min\n\n`;

    if (weeklyTargets) {
      const diferencia = totalDuration - weeklyTargets.duration;
      respuesta += `• Objetivo semanal: ${weeklyTargets.duration} min\n`;
      respuesta += `• Diferencia: ${diferencia > 0 ? '+' : ''}${diferencia} min\n\n`;
    }

    respuesta += `📈 **Duración por día:**\n`;
    weekDays.forEach((day) => {
      respuesta += `• ${day}: ${duracionesPorDia[day]} min\n`;
    });

    return respuesta;
  };

  const generarSugerencias = (
    selectedDayPlan: DayPlan,
    clientInfo?: AsistenteIAProgramaProps['clientInfo'],
    weeklyTargets?: AsistenteIAProgramaProps['weeklyTargets'],
    contextoCliente?: ContextoCliente,
    objetivosProgreso?: ResumenObjetivosProgreso,
    timelineSesiones?: TimelineSesiones
  ): string => {
    let respuesta = `💡 **Sugerencias para optimizar el programa:**\n\n`;

    const totalMin = selectedDayPlan.sessions.reduce((acc, s) => {
      const match = s.duration.match(/\d+/);
      return acc + (match ? Number(match[0]) : 0);
    }, 0);

    if (totalMin > 60) {
      respuesta += `• ⚠️ La duración del día es alta (${totalMin} min). Considera dividir en dos sesiones o reducir tiempos.\n\n`;
    }

    if (selectedDayPlan.sessions.length > 3) {
      respuesta += `• 💪 Tienes ${selectedDayPlan.sessions.length} sesiones en el día. Asegúrate de tener suficiente recuperación entre ellas.\n\n`;
    }

    const modalities = selectedDayPlan.sessions.map((s) => s.modality);
    if (!modalities.includes('Mobility') && !modalities.includes('Recovery')) {
      respuesta += `• 🧘 Considera añadir un bloque de movilidad o recuperación para completar el día.\n\n`;
    }

    if (contextoCliente) {
      respuesta += `**Contexto del cliente (${contextoCliente.clienteNombre}):**\n`;
      if (contextoCliente.lesiones.some((l) => l.estado === 'activa')) {
        const lesionesActivas = contextoCliente.lesiones.filter((l) => l.estado === 'activa');
        respuesta += `• ⚠️ Lesiones activas: ${lesionesActivas.map((l) => l.nombre).join(', ')}\n`;
        lesionesActivas.forEach((l) => {
          if (l.restricciones.length > 0) {
            respuesta += `  - ${l.nombre}: ${l.restricciones.join(', ')}\n`;
          }
        });
        respuesta += `\n`;
      }
      if (contextoCliente.disponibilidadMaterial.length > 0) {
        const materialDisponible = contextoCliente.disponibilidadMaterial.filter((m) => m.disponible);
        respuesta += `• 💪 Material disponible: ${materialDisponible.map((m) => m.material).join(', ')}\n\n`;
      }
    }

    if (objetivosProgreso) {
      const objetivosActivos = objetivosProgreso.objetivos.filter((o) => o.estado === 'in_progress');
      if (objetivosActivos.length > 0) {
        respuesta += `**Objetivos activos del cliente:**\n`;
        objetivosActivos.slice(0, 3).forEach((obj) => {
          respuesta += `• ${obj.titulo}: ${obj.progreso}% completado\n`;
        });
        respuesta += `\n`;
      }
    }

    if (timelineSesiones) {
      const patrones = timelineSesiones.resumen.patronesDetectados;
      if (patrones.length > 0) {
        respuesta += `**Patrones detectados:**\n`;
        patrones.forEach((p) => {
          respuesta += `• ${p.tipo}: ${p.descripcion} (${p.severidad})\n`;
        });
        respuesta += `\n`;
      }
    }

    if (clientInfo?.restricciones && clientInfo.restricciones.length > 0) {
      respuesta += `• ⚠️ Restricciones: ${clientInfo.restricciones.join(', ')}\n\n`;
    }

    if (weeklyTargets) {
      respuesta += `• 🎯 Objetivos semanales: ${weeklyTargets.sessions} sesiones, ${weeklyTargets.duration} min, ${weeklyTargets.calories} kcal\n\n`;
    }

    respuesta += `• 📊 Revisa la distribución de intensidades. Alterna días pesados con días ligeros.`;

    return respuesta;
  };

  const analizarRestricciones = (
    weeklyPlan: Record<DayKey, DayPlan>,
    weekDays: DayKey[],
    clientInfo?: AsistenteIAProgramaProps['clientInfo']
  ): string => {
    if (!clientInfo?.restricciones || clientInfo.restricciones.length === 0) {
      return `✅ No hay restricciones registradas para este cliente.`;
    }

    let respuesta = `⚠️ **Análisis de restricciones:**\n\n`;
    respuesta += `**Restricciones del cliente:**\n`;
    clientInfo.restricciones.forEach((r) => {
      respuesta += `• ${r}\n`;
    });

    respuesta += `\n**Recomendaciones:**\n`;
    if (clientInfo.restricciones.some((r) => r.toLowerCase().includes('rodilla') || r.toLowerCase().includes('rotuliana'))) {
      respuesta += `• Evita ejercicios de impacto alto (saltos, sentadillas profundas)\n`;
      respuesta += `• Sustituye por ejercicios de bajo impacto (bike erg, sled push)\n`;
    }
    if (clientInfo.restricciones.some((r) => r.toLowerCase().includes('lumbar') || r.toLowerCase().includes('espalda'))) {
      respuesta += `• Evita hiperextensión lumbar\n`;
      respuesta += `• Enfócate en core estabilidad y movilidad torácica\n`;
    }

    return respuesta;
  };

  const analizarDistribucionSemanal = (weeklyPlan: Record<DayKey, DayPlan>, weekDays: DayKey[]): string => {
    let respuesta = `📅 **Distribución semanal:**\n\n`;

    weekDays.forEach((day) => {
      const plan = weeklyPlan[day];
      const totalMin = plan.sessions.reduce((acc, s) => {
        const match = s.duration.match(/\d+/);
        return acc + (match ? Number(match[0]) : 0);
      }, 0);

      respuesta += `**${day}:**\n`;
      respuesta += `• Foco: ${plan.focus}\n`;
      respuesta += `• Sesiones: ${plan.sessions.length}\n`;
      respuesta += `• Duración: ${totalMin} min\n`;
      respuesta += `• Intensidad: ${plan.intensity}\n\n`;
    });

    return respuesta;
  };

  const generarResumenEstructurado = (
    weeklyPlan: Record<DayKey, DayPlan>,
    weekDays: DayKey[],
    selectedDayPlan: DayPlan,
    weeklyTargets?: AsistenteIAProgramaProps['weeklyTargets']
  ): string => {
    const totalSessions = weekDays.reduce((acc, day) => acc + weeklyPlan[day].sessions.length, 0);
    const totalDuration = weekDays.reduce((acc, day) => {
      return (
        acc +
        weeklyPlan[day].sessions.reduce((sum, session) => {
          const match = session.duration.match(/\d+/);
          return sum + (match ? Number(match[0]) : 0);
        }, 0)
      );
    }, 0);

    let respuesta = `📊 **Resumen estructurado del programa:**\n\n`;
    respuesta += `**Día actual (${selectedDay}):**\n`;
    respuesta += `• Foco: ${selectedDayPlan.focus}\n`;
    respuesta += `• Volumen: ${selectedDayPlan.volume}\n`;
    respuesta += `• Intensidad: ${selectedDayPlan.intensity}\n`;
    respuesta += `• Sesiones: ${selectedDayPlan.sessions.length}\n\n`;

    respuesta += `**Resumen semanal:**\n`;
    respuesta += `• Total de sesiones: ${totalSessions}\n`;
    respuesta += `• Duración total: ${totalDuration} min\n`;
    respuesta += `• Promedio diario: ${Math.round(totalDuration / 7)} min\n\n`;

    if (weeklyTargets) {
      respuesta += `**Objetivos semanales:**\n`;
      respuesta += `• Sesiones: ${weeklyTargets.sessions} (actual: ${totalSessions})\n`;
      respuesta += `• Duración: ${weeklyTargets.duration} min (actual: ${totalDuration} min)\n`;
      respuesta += `• Calorías: ${weeklyTargets.calories} kcal\n`;
    }

    return respuesta;
  };

  const analizarObjetivos = (
    selectedDayPlan: DayPlan,
    clientInfo?: AsistenteIAProgramaProps['clientInfo'],
    weeklyTargets?: AsistenteIAProgramaProps['weeklyTargets']
  ): string => {
    let respuesta = `🎯 **Análisis de objetivos:**\n\n`;

    if (clientInfo?.objetivos && clientInfo.objetivos.length > 0) {
      respuesta += `**Objetivos del cliente:**\n`;
      clientInfo.objetivos.forEach((obj) => {
        respuesta += `• ${obj}\n`;
      });
      respuesta += `\n`;
    }

    if (weeklyTargets) {
      respuesta += `**Objetivos semanales del programa:**\n`;
      respuesta += `• Sesiones: ${weeklyTargets.sessions}\n`;
      respuesta += `• Duración: ${weeklyTargets.duration} min\n`;
      respuesta += `• Calorías: ${weeklyTargets.calories} kcal\n\n`;
    }

    respuesta += `**Objetivo del día actual:**\n`;
    respuesta += `• Foco: ${selectedDayPlan.focus}\n`;
    respuesta += `• Microciclo: ${selectedDayPlan.microCycle}\n`;

    return respuesta;
  };

  const generarSugerenciasAjuste = (
    selectedDayPlan: DayPlan,
    clientInfo?: AsistenteIAProgramaProps['clientInfo']
  ): string => {
    let respuesta = `🔧 **Sugerencias de ajuste:**\n\n`;

    const totalMin = selectedDayPlan.sessions.reduce((acc, s) => {
      const match = s.duration.match(/\d+/);
      return acc + (match ? Number(match[0]) : 0);
    }, 0);

    if (totalMin > 60) {
      respuesta += `• Reduce la duración de algunos bloques para mantener el día en ~50-55 min\n`;
    }

    if (selectedDayPlan.sessions.filter((s) => s.modality === 'Strength').length > 2) {
      respuesta += `• Considera redistribuir los bloques de fuerza para evitar fatiga acumulada\n`;
    }

    if (clientInfo?.restricciones && clientInfo.restricciones.length > 0) {
      respuesta += `• Revisa que todos los ejercicios sean compatibles con las restricciones del cliente\n`;
    }

    respuesta += `• Asegúrate de incluir calentamiento y enfriamiento adecuados\n`;
    respuesta += `• Mantén un equilibrio entre intensidad y volumen`;

    return respuesta;
  };

  // Funciones para generar razonamiento/métricas
  const generarRazonamientoIntensidad = (
    weeklyPlan: Record<DayKey, DayPlan>,
    weekDays: DayKey[],
    selectedDayPlan: DayPlan,
    contextoCliente?: ContextoCliente,
    objetivosProgreso?: ResumenObjetivosProgreso
  ): RazonamientoSugerencia => {
    const intensidades: string[] = [];
    weekDays.forEach((day) => {
      weeklyPlan[day].sessions.forEach((session) => {
        if (session.intensity) intensidades.push(session.intensity);
      });
    });

    const rpeValues = intensidades
      .map((i) => {
        const match = i.match(/RPE\s*(\d+\.?\d*)/i);
        return match ? parseFloat(match[1]) : null;
      })
      .filter((v): v is number => v !== null);

    const promedioRPE = rpeValues.length > 0 ? rpeValues.reduce((a, b) => a + b, 0) / rpeValues.length : 0;
    const maxRPE = rpeValues.length > 0 ? Math.max(...rpeValues) : 0;
    const minRPE = rpeValues.length > 0 ? Math.min(...rpeValues) : 0;

    return {
      metricas: [
        { nombre: 'RPE Promedio Semanal', valor: promedioRPE.toFixed(1), unidad: '/10', tendencia: promedioRPE > 7.5 ? 'up' : promedioRPE < 6 ? 'down' : 'neutral' },
        { nombre: 'RPE Máximo', valor: maxRPE.toFixed(1), unidad: '/10' },
        { nombre: 'RPE Mínimo', valor: minRPE.toFixed(1), unidad: '/10' },
        { nombre: 'Sesiones Analizadas', valor: intensidades.length, unidad: 'sesiones' },
      ],
      razonamiento: `El análisis se basa en ${intensidades.length} sesiones de la semana. El RPE promedio de ${promedioRPE.toFixed(1)} indica ${promedioRPE > 8 ? 'una carga de alta intensidad que requiere días de recuperación' : promedioRPE < 6 ? 'una carga moderada con margen para aumentar intensidad' : 'una distribución equilibrada de intensidades'}.`,
      factoresConsiderados: [
        'Distribución de RPE en todas las sesiones semanales',
        contextoCliente?.lesiones.some((l) => l.estado === 'activa') ? 'Lesiones activas del cliente' : undefined,
        objetivosProgreso?.objetivos.some((o) => o.categoria === 'fuerza') ? 'Objetivos de fuerza activos' : undefined,
      ].filter(Boolean) as string[],
      confianza: 85,
    };
  };

  const generarRazonamientoVolumen = (
    weeklyPlan: Record<DayKey, DayPlan>,
    weekDays: DayKey[],
    selectedDayPlan: DayPlan,
    contextoCliente?: ContextoCliente
  ): RazonamientoSugerencia => {
    const totalSessions = weekDays.reduce((acc, day) => acc + weeklyPlan[day].sessions.length, 0);
    const habitosRutina = contextoCliente?.habitos.find((h) => h.tipo === 'rutina-semanal');

    return {
      metricas: [
        { nombre: 'Sesiones Totales Semanales', valor: totalSessions, unidad: 'sesiones' },
        { nombre: 'Sesiones del Día Actual', valor: selectedDayPlan.sessions.length, unidad: 'sesiones' },
        habitosRutina ? { nombre: 'Cumplimiento Objetivo Cliente', valor: habitosRutina.cumplimiento, unidad: '%', tendencia: habitosRutina.cumplimiento > 80 ? 'up' : 'down' } : undefined,
      ].filter(Boolean) as RazonamientoSugerencia['metricas'],
      razonamiento: `El volumen semanal de ${totalSessions} sesiones ${habitosRutina ? `representa un ${habitosRutina.cumplimiento}% del objetivo del cliente (${habitosRutina.objetivo} sesiones)` : 'está distribuido a lo largo de la semana'}.`,
      factoresConsiderados: [
        'Número total de sesiones programadas',
        habitosRutina ? 'Objetivo de sesiones del cliente' : undefined,
        'Distribución por día de la semana',
      ].filter(Boolean) as string[],
      confianza: 90,
    };
  };

  const generarRazonamientoDuracion = (
    weeklyPlan: Record<DayKey, DayPlan>,
    weekDays: DayKey[],
    selectedDayPlan: DayPlan,
    totalDuration: number,
    weeklyTargets?: { sessions: number; duration: number; calories: number }
  ): RazonamientoSugerencia => {
    const duracionDiaActual = selectedDayPlan.sessions.reduce((sum, session) => {
      const match = session.duration.match(/\d+/);
      return sum + (match ? Number(match[0]) : 0);
    }, 0);
    const diferencia = weeklyTargets ? totalDuration - weeklyTargets.duration : 0;

    return {
      metricas: [
        { nombre: 'Duración Total Semanal', valor: totalDuration, unidad: 'min' },
        { nombre: 'Duración Día Actual', valor: duracionDiaActual, unidad: 'min' },
        { nombre: 'Promedio Diario', valor: Math.round(totalDuration / 7), unidad: 'min' },
        weeklyTargets ? { nombre: 'Diferencia vs Objetivo', valor: diferencia, unidad: 'min', tendencia: diferencia > 0 ? 'up' : diferencia < 0 ? 'down' : 'neutral' } : undefined,
      ].filter(Boolean) as RazonamientoSugerencia['metricas'],
      razonamiento: `La duración total semanal de ${totalDuration} minutos ${weeklyTargets ? `está ${diferencia > 0 ? `${diferencia} minutos por encima` : diferencia < 0 ? `${Math.abs(diferencia)} minutos por debajo` : 'exactamente en'} del objetivo de ${weeklyTargets.duration} minutos` : 'está distribuida a lo largo de la semana'}.`,
      factoresConsiderados: [
        'Duración acumulada de todas las sesiones',
        weeklyTargets ? 'Objetivo semanal de duración' : undefined,
        'Distribución temporal por día',
      ].filter(Boolean) as string[],
      confianza: 88,
    };
  };

  const generarRazonamientoSugerencias = (
    selectedDayPlan: DayPlan,
    clientInfo?: AsistenteIAProgramaProps['clientInfo'],
    weeklyTargets?: AsistenteIAProgramaProps['weeklyTargets'],
    contextoCliente?: ContextoCliente,
    objetivosProgreso?: ResumenObjetivosProgreso
  ): RazonamientoSugerencia => {
    const totalMin = selectedDayPlan.sessions.reduce((acc, s) => {
      const match = s.duration.match(/\d+/);
      return acc + (match ? Number(match[0]) : 0);
    }, 0);
    const lesionesActivas = contextoCliente?.lesiones.filter((l) => l.estado === 'activa') || [];
    const objetivosActivos = objetivosProgreso?.objetivos.filter((o) => o.estado === 'in_progress') || [];

    return {
      metricas: [
        { nombre: 'Duración Total del Día', valor: totalMin, unidad: 'min', tendencia: totalMin > 60 ? 'up' : 'neutral' },
        { nombre: 'Número de Sesiones', valor: selectedDayPlan.sessions.length, unidad: 'sesiones' },
        lesionesActivas.length > 0 ? { nombre: 'Lesiones Activas', valor: lesionesActivas.length, unidad: 'lesiones' } : undefined,
        objetivosActivos.length > 0 ? { nombre: 'Objetivos Activos', valor: objetivosActivos.length, unidad: 'objetivos' } : undefined,
      ].filter(Boolean) as RazonamientoSugerencia['metricas'],
      razonamiento: `Las sugerencias consideran ${totalMin > 60 ? 'la alta duración del día que puede beneficiarse de división' : 'la duración actual del día'}, ${lesionesActivas.length > 0 ? `${lesionesActivas.length} lesión(es) activa(s) que requieren adaptaciones` : 'sin lesiones activas'}, y ${objetivosActivos.length > 0 ? `${objetivosActivos.length} objetivo(s) en progreso` : 'los objetivos del programa'}.`,
      factoresConsiderados: [
        'Duración y número de sesiones del día',
        lesionesActivas.length > 0 ? 'Restricciones por lesiones activas' : undefined,
        objetivosActivos.length > 0 ? 'Objetivos del cliente en progreso' : undefined,
        weeklyTargets ? 'Objetivos semanales del programa' : undefined,
        'Distribución de modalidades',
      ].filter(Boolean) as string[],
      confianza: 82,
    };
  };

  const generarRazonamientoRestricciones = (
    clientInfo?: AsistenteIAProgramaProps['clientInfo'],
    contextoCliente?: ContextoCliente
  ): RazonamientoSugerencia => {
    const lesionesActivas = contextoCliente?.lesiones.filter((l) => l.estado === 'activa') || [];
    const restriccionesGenerales = clientInfo?.restricciones || [];
    const todasLasRestricciones = [
      ...restriccionesGenerales,
      ...lesionesActivas.flatMap((l) => l.restricciones),
    ];

    return {
      metricas: [
        { nombre: 'Lesiones Activas', valor: lesionesActivas.length, unidad: 'lesiones' },
        { nombre: 'Restricciones Totales', valor: todasLasRestricciones.length, unidad: 'restricciones' },
      ],
      razonamiento: `Se identificaron ${lesionesActivas.length} lesión(es) activa(s) y ${todasLasRestricciones.length} restricción(es) total(es) que deben considerarse al diseñar el programa de entrenamiento.`,
      factoresConsiderados: [
        'Lesiones activas del cliente',
        'Restricciones generales',
        'Severidad de las lesiones',
        'Recomendaciones médicas o de fisioterapia',
      ],
      confianza: 95,
    };
  };

  const generarRazonamientoAjustes = (
    selectedDayPlan: DayPlan,
    clientInfo?: AsistenteIAProgramaProps['clientInfo'],
    contextoCliente?: ContextoCliente
  ): RazonamientoSugerencia => {
    const totalMin = selectedDayPlan.sessions.reduce((acc, s) => {
      const match = s.duration.match(/\d+/);
      return acc + (match ? Number(match[0]) : 0);
    }, 0);
    const bloquesFuerza = selectedDayPlan.sessions.filter((s) => s.modality === 'Strength').length;

    return {
      metricas: [
        { nombre: 'Duración Total', valor: totalMin, unidad: 'min', tendencia: totalMin > 60 ? 'up' : 'neutral' },
        { nombre: 'Bloques de Fuerza', valor: bloquesFuerza, unidad: 'bloques', tendencia: bloquesFuerza > 2 ? 'up' : 'neutral' },
      ],
      razonamiento: `Los ajustes sugeridos se basan en ${totalMin > 60 ? 'la duración elevada del día' : 'la duración actual'}, ${bloquesFuerza > 2 ? 'la presencia de múltiples bloques de fuerza que pueden causar fatiga' : 'la distribución de modalidades'}, y las restricciones del cliente.`,
      factoresConsiderados: [
        'Duración total del día',
        'Número de bloques por modalidad',
        clientInfo?.restricciones && clientInfo.restricciones.length > 0 ? 'Restricciones del cliente' : undefined,
        'Equilibrio entre intensidad y volumen',
      ].filter(Boolean) as string[],
      confianza: 80,
    };
  };

  const generarRazonamientoBloques = (
    bloques: BloqueGenerado[],
    contextoCliente?: ContextoCliente,
    objetivosProgreso?: ResumenObjetivosProgreso
  ): RazonamientoSugerencia => {
    const lesionesActivas = contextoCliente?.lesiones.filter((l) => l.estado === 'activa') || [];
    const totalDuracion = bloques.reduce((acc, b) => {
      const match = b.duration.match(/\d+/);
      return acc + (match ? Number(match[0]) : 0);
    }, 0);

    return {
      metricas: [
        { nombre: 'Bloques Generados', valor: bloques.length, unidad: 'bloques' },
        { nombre: 'Duración Total', valor: totalDuracion, unidad: 'min' },
        lesionesActivas.length > 0 ? { nombre: 'Adaptaciones por Lesiones', valor: lesionesActivas.length, unidad: 'lesiones' } : undefined,
      ].filter(Boolean) as RazonamientoSugerencia['metricas'],
      razonamiento: `Se generaron ${bloques.length} bloque(s) con una duración total de ${totalDuracion} minutos. ${lesionesActivas.length > 0 ? `Los bloques han sido adaptados considerando ${lesionesActivas.length} lesión(es) activa(s).` : 'Los bloques están optimizados para el programa actual.'}`,
      factoresConsiderados: [
        'Tipo de bloque solicitado',
        lesionesActivas.length > 0 ? 'Restricciones por lesiones' : undefined,
        objetivosProgreso ? 'Objetivos del cliente' : undefined,
        'Duración solicitada',
      ].filter(Boolean) as string[],
      confianza: 88,
    };
  };

  // Función para guardar conversación
  const guardarConversacion = (mensajeId: string) => {
    const mensaje = mensajes.find((m) => m.id === mensajeId);
    if (!mensaje || mensaje.tipo !== 'asistente') return;

    const conversacionGuardada = {
      id: `saved-${Date.now()}`,
      clienteId: clientInfo?.nombre || 'Sin cliente',
      clienteNombre: clientInfo?.nombre || 'Sin cliente',
      mensaje: mensaje.contenido,
      razonamiento: mensaje.razonamiento,
      timestamp: mensaje.timestamp.toISOString(),
      fechaGuardado: new Date().toISOString(),
      tipo: 'conversacion' as const,
    };

    try {
      const guardadas = JSON.parse(localStorage.getItem('conversacionesGuardadas') || '[]');
      guardadas.push(conversacionGuardada);
      localStorage.setItem('conversacionesGuardadas', JSON.stringify(guardadas));
      
      // Marcar mensaje como guardado
      setMensajes((prev) =>
        prev.map((m) => (m.id === mensajeId ? { ...m, guardado: true } : m))
      );
    } catch (error) {
      console.error('Error al guardar conversación:', error);
    }
  };

  const toggleRazonamiento = (mensajeId: string) => {
    setRazonamientoExpandido((prev) => {
      const nuevo = new Set(prev);
      if (nuevo.has(mensajeId)) {
        nuevo.delete(mensajeId);
      } else {
        nuevo.add(mensajeId);
      }
      return nuevo;
    });
  };

  const handleEnviar = async () => {
    if (!inputMensaje.trim() || procesando) return;

    const mensajeUsuario: Mensaje = {
      id: `msg-${Date.now()}`,
      tipo: 'usuario',
      contenido: inputMensaje.trim(),
      timestamp: new Date(),
    };

    setMensajes((prev) => [...prev, mensajeUsuario]);
    setInputMensaje('');
    setProcesando(true);

    try {
      const resultado = await procesarConsulta(inputMensaje.trim());
      const mensajeAsistente: Mensaje = {
        id: `msg-${Date.now() + 1}`,
        tipo: 'asistente',
        contenido: resultado.respuesta,
        timestamp: new Date(),
        bloquesGenerados: resultado.bloques,
        razonamiento: resultado.razonamiento,
      };
      setMensajes((prev) => [...prev, mensajeAsistente]);
    } catch (error) {
      const mensajeError: Mensaje = {
        id: `msg-${Date.now() + 1}`,
        tipo: 'asistente',
        contenido: 'Lo siento, hubo un error al procesar tu consulta. Por favor, intenta de nuevo.',
        timestamp: new Date(),
      };
      setMensajes((prev) => [...prev, mensajeError]);
    } finally {
      setProcesando(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  // Generar resumen estructurado para modo Asistente
  const generarResumenModoAsistente = (): string => {
    const weekDays: DayKey[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const totalSessions = weekDays.reduce((acc, day) => acc + weeklyPlan[day].sessions.length, 0);
    const totalDuration = weekDays.reduce((acc, day) => {
      return (
        acc +
        weeklyPlan[day].sessions.reduce((sum, session) => {
          const match = session.duration.match(/\d+/);
          return sum + (match ? Number(match[0]) : 0);
        }, 0)
      );
    }, 0);

    let resumen = `📊 **Resumen del programa - ${selectedDay}**\n\n`;
    resumen += `**Día actual:**\n`;
    resumen += `• Foco: ${selectedDayPlan.focus}\n`;
    resumen += `• Microciclo: ${selectedDayPlan.microCycle}\n`;
    resumen += `• Volumen: ${selectedDayPlan.volume}\n`;
    resumen += `• Intensidad: ${selectedDayPlan.intensity}\n`;
    resumen += `• Sesiones: ${selectedDayPlan.sessions.length}\n\n`;

    resumen += `**Resumen semanal:**\n`;
    resumen += `• Total de sesiones: ${totalSessions}\n`;
    resumen += `• Duración total: ${totalDuration} min\n`;
    resumen += `• Promedio diario: ${Math.round(totalDuration / 7)} min\n\n`;

    if (weeklyTargets) {
      resumen += `**Objetivos:**\n`;
      resumen += `• Sesiones: ${weeklyTargets.sessions} (${totalSessions} actuales)\n`;
      resumen += `• Duración: ${weeklyTargets.duration} min (${totalDuration} actuales)\n`;
      resumen += `• Calorías: ${weeklyTargets.calories} kcal\n\n`;
    }

    resumen += `**Sesiones del día:**\n`;
    selectedDayPlan.sessions.forEach((session, idx) => {
      resumen += `${idx + 1}. ${session.block} (${session.time}) - ${session.duration} - ${session.modality} - ${session.intensity}\n`;
    });

    return resumen;
  };

  return (
    <div className="space-y-4">
      {/* Selector de modo */}
      <div className="flex items-center justify-center">
        <Tabs
          items={[
            {
              id: 'asistente',
              label: 'Asistente',
              icon: <FileText className="h-4 w-4" />,
            },
            {
              id: 'chat',
              label: 'Chat',
              icon: <MessageSquare className="h-4 w-4" />,
            },
          ]}
          activeTab={modo}
          onTabChange={(tabId) => {
            setModo(tabId as ModoAsistente);
            if (tabId === 'chat' && mensajes.length === 0) {
              // El useEffect se encargará de añadir el mensaje de bienvenida
            }
          }}
          variant="pills"
          size="sm"
        />
      </div>

      {/* Contenido según el modo */}
      {modo === 'asistente' ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-sm dark:border-slate-800/70 dark:bg-slate-900/40">
            <p className="text-slate-700 dark:text-slate-300">
              Plan del día: <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedDayPlan.focus}</span> ·{' '}
              {selectedDayPlan.volume} · {selectedDayPlan.intensity}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white/95 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/60">
            <div className="flex items-start gap-3 mb-4">
              <Sparkles className="h-5 w-5 text-indigo-500 mt-0.5" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Resumen estructurado</h3>
            </div>
            <div className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
              {generarResumenModoAsistente()}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-[600px] border border-slate-200/70 rounded-2xl bg-white/95 dark:border-slate-800/70 dark:bg-slate-950/60 overflow-hidden">
          {/* Header del chat */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-200/70 dark:border-slate-800/70">
            <div className="p-2 bg-indigo-100 rounded-lg dark:bg-indigo-500/20">
              <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Asistente de IA</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Conversación sobre ajustes del programa</p>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mensajes.map((mensaje) => (
              <div
                key={mensaje.id}
                className={`flex ${mensaje.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    mensaje.tipo === 'usuario'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-900 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  {mensaje.tipo === 'asistente' && (
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xs font-medium">Asistente</span>
                      </div>
                      {mensaje.razonamiento && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleRazonamiento(mensaje.id)}
                            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            <BarChart3 className="w-3 h-3" />
                            {razonamientoExpandido.has(mensaje.id) ? 'Ocultar métricas' : 'Ver métricas'}
                            {razonamientoExpandido.has(mensaje.id) ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>
                          {!mensaje.guardado && (
                            <button
                              onClick={() => guardarConversacion(mensaje.id)}
                              className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                              title="Guardar como nota o plantilla"
                            >
                              <Bookmark className="w-3 h-3" />
                              Guardar
                            </button>
                          )}
                          {mensaje.guardado && (
                            <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" />
                              Guardado
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-sm">{mensaje.contenido}</div>
                  
                  {/* Razonamiento expandido */}
                  {mensaje.tipo === 'asistente' && mensaje.razonamiento && razonamientoExpandido.has(mensaje.id) && (
                    <div className="mt-3 pt-3 border-t border-gray-300 dark:border-slate-600">
                      <div className="space-y-3">
                        {mensaje.razonamiento.metricas && mensaje.razonamiento.metricas.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                              <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">Métricas clave</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {mensaje.razonamiento.metricas.map((metrica, idx) => (
                                <div
                                  key={idx}
                                  className="rounded-lg bg-indigo-50 dark:bg-indigo-500/10 p-2"
                                >
                                  <div className="text-xs text-gray-600 dark:text-slate-400">{metrica.nombre}</div>
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                                      {metrica.valor}
                                    </span>
                                    {metrica.unidad && (
                                      <span className="text-xs text-gray-500 dark:text-slate-400">{metrica.unidad}</span>
                                    )}
                                    {metrica.tendencia && (
                                      <TrendingUp
                                        className={`w-3 h-3 ${
                                          metrica.tendencia === 'up'
                                            ? 'text-red-500'
                                            : metrica.tendencia === 'down'
                                            ? 'text-green-500'
                                            : 'text-gray-400'
                                        }`}
                                      />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {mensaje.razonamiento.razonamiento && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                              <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">Razonamiento</span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                              {mensaje.razonamiento.razonamiento}
                            </p>
                          </div>
                        )}
                        
                        {mensaje.razonamiento.factoresConsiderados && mensaje.razonamiento.factoresConsiderados.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                              <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">Factores considerados</span>
                            </div>
                            <ul className="space-y-1">
                              {mensaje.razonamiento.factoresConsiderados.map((factor, idx) => (
                                <li key={idx} className="text-xs text-gray-600 dark:text-slate-400 flex items-start gap-2">
                                  <span className="text-indigo-500 mt-0.5">•</span>
                                  <span>{factor}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {mensaje.razonamiento.confianza !== undefined && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-600 dark:text-slate-400">Confianza:</span>
                            <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-indigo-500 h-2 rounded-full"
                                style={{ width: `${mensaje.razonamiento.confianza}%` }}
                              />
                            </div>
                            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                              {mensaje.razonamiento.confianza}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div
                    className={`text-xs mt-2 ${
                      mensaje.tipo === 'usuario' ? 'text-indigo-200' : 'text-gray-500 dark:text-slate-400'
                    }`}
                  >
                    {mensaje.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {procesando && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 dark:bg-slate-800">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            )}
            <div ref={mensajesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200/70 dark:border-slate-800/70">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMensaje}
                onChange={(e) => setInputMensaje(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Pregunta sobre ajustes del programa..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                disabled={procesando}
              />
              <Button
                variant="primary"
                onClick={handleEnviar}
                disabled={!inputMensaje.trim() || procesando}
                leftIcon={procesando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              >
                Enviar
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
              Ejemplos: "¿Cómo ajustar la intensidad?", "Sugerencias para optimizar el volumen", "Análisis de restricciones"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

