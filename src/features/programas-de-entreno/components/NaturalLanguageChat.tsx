import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Input } from '../../../components/componentsreutilizables';
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  BarChart3,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { DayPlan, ContextoCliente, ResumenObjetivosProgreso } from '../types';
import { Programa } from '../api/programas';

interface NaturalLanguageChatProps {
  programa: Programa;
  weeklyPlan?: Record<string, DayPlan>;
  contextoCliente?: ContextoCliente;
  objetivosProgreso?: ResumenObjetivosProgreso;
  weekDays?: readonly string[];
  className?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any; // Datos adicionales para respuestas con gráficos o métricas
}

export const NaturalLanguageChat: React.FC<NaturalLanguageChatProps> = ({
  programa,
  weeklyPlan = {},
  contextoCliente,
  objetivosProgreso,
  weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
  className = '',
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de programas de entrenamiento. Puedes preguntarme sobre ejercicios, cargas, distribución semanal, objetivos y más. ¿En qué te puedo ayudar?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const analizarPregunta = (pregunta: string): string => {
    const preguntaLower = pregunta.toLowerCase();

    // Preguntas sobre ejercicios más cargados
    if (
      preguntaLower.includes('ejercicio') &&
      (preguntaLower.includes('más cargado') ||
        preguntaLower.includes('mayor carga') ||
        preguntaLower.includes('más peso') ||
        preguntaLower.includes('más intenso'))
    ) {
      return analizarEjercicioMasCargado();
    }

    // Preguntas sobre distribución semanal
    if (
      preguntaLower.includes('distribución') ||
      preguntaLower.includes('seman') ||
      preguntaLower.includes('días')
    ) {
      return analizarDistribucionSemanal();
    }

    // Preguntas sobre grupos musculares
    if (
      preguntaLower.includes('grupo') ||
      preguntaLower.includes('músculo') ||
      preguntaLower.includes('muscular')
    ) {
      return analizarGruposMusculares();
    }

    // Preguntas sobre objetivos
    if (
      preguntaLower.includes('objetivo') ||
      preguntaLower.includes('progreso') ||
      preguntaLower.includes('meta')
    ) {
      return analizarObjetivos();
    }

    // Preguntas sobre volumen total
    if (
      preguntaLower.includes('volumen') ||
      preguntaLower.includes('series') ||
      preguntaLower.includes('repeticiones')
    ) {
      return analizarVolumen();
    }

    // Preguntas sobre intensidad
    if (
      preguntaLower.includes('intensidad') ||
      preguntaLower.includes('rpe') ||
      preguntaLower.includes('esfuerzo')
    ) {
      return analizarIntensidad();
    }

    // Preguntas sobre lesiones o restricciones
    if (
      preguntaLower.includes('lesión') ||
      preguntaLower.includes('restricción') ||
      preguntaLower.includes('limitación')
    ) {
      return analizarLesiones();
    }

    // Respuesta por defecto
    return 'Entiendo tu pregunta. Puedo ayudarte con información sobre ejercicios, cargas, distribución semanal, objetivos, volumen, intensidad y restricciones. ¿Puedes reformular tu pregunta de manera más específica?';
  };

  const analizarEjercicioMasCargado = (): string => {
    let maxPeso = 0;
    let ejercicioMasCargado: { nombre: string; peso: number; dia: string } | null = null;

    Object.entries(weeklyPlan).forEach(([dia, dayPlan]) => {
      dayPlan.sessions.forEach((session) => {
        if (session.peso && session.peso > maxPeso) {
          maxPeso = session.peso;
          ejercicioMasCargado = {
            nombre: session.block,
            peso: session.peso,
            dia: dia,
          };
        }
      });
    });

    if (ejercicioMasCargado) {
      return `El ejercicio más cargado esta semana es **${ejercicioMasCargado.nombre}** con ${ejercicioMasCargado.peso} kg, programado para el ${ejercicioMasCargado.dia}.`;
    }

    // Si no hay peso, buscar por series y repeticiones
    let maxVolumen = 0;
    let ejercicioMasVolumen: { nombre: string; series: number; repeticiones: string; dia: string } | null = null;

    Object.entries(weeklyPlan).forEach(([dia, dayPlan]) => {
      dayPlan.sessions.forEach((session) => {
        const volumen = (session.series || 0) * parseInt(session.repeticiones?.split('-')[0] || '0');
        if (volumen > maxVolumen) {
          maxVolumen = volumen;
          ejercicioMasVolumen = {
            nombre: session.block,
            series: session.series || 0,
            repeticiones: session.repeticiones || '0',
            dia: dia,
          };
        }
      });
    });

    if (ejercicioMasVolumen) {
      return `El ejercicio con mayor volumen esta semana es **${ejercicioMasVolumen.nombre}** con ${ejercicioMasVolumen.series} series de ${ejercicioMasVolumen.repeticiones} repeticiones, programado para el ${ejercicioMasVolumen.dia}.`;
    }

    return 'No he encontrado información sobre cargas o volúmenes en el programa actual. Asegúrate de que los ejercicios tengan peso o series definidas.';
  };

  const analizarDistribucionSemanal = (): string => {
    const diasConEjercicios = Object.entries(weeklyPlan).filter(
      ([_, dayPlan]) => dayPlan.sessions.length > 0
    );

    if (diasConEjercicios.length === 0) {
      return 'No hay sesiones programadas esta semana.';
    }

    const distribucion = diasConEjercicios.map(([dia, dayPlan]) => {
      const numSesiones = dayPlan.sessions.length;
      const duracionTotal = dayPlan.sessions.reduce((acc, s) => {
        const match = s.duration?.match(/\d+/);
        return acc + (match ? parseInt(match[0]) : 0);
      }, 0);
      return `- **${dia}**: ${numSesiones} sesión(es), ${duracionTotal} minutos`;
    }).join('\n');

    return `Distribución semanal del programa:\n\n${distribucion}\n\nTotal: ${diasConEjercicios.length} días con entrenamiento.`;
  };

  const analizarGruposMusculares = (): string => {
    const gruposTrabajados: Record<string, { dias: Set<string>; sesiones: number }> = {};

    Object.entries(weeklyPlan).forEach(([dia, dayPlan]) => {
      dayPlan.sessions.forEach((session) => {
        if (session.gruposMusculares) {
          session.gruposMusculares.forEach((grupo) => {
            if (!gruposTrabajados[grupo]) {
              gruposTrabajados[grupo] = { dias: new Set(), sesiones: 0 };
            }
            gruposTrabajados[grupo].dias.add(dia);
            gruposTrabajados[grupo].sesiones++;
          });
        }
      });
    });

    if (Object.keys(gruposTrabajados).length === 0) {
      return 'No se han especificado grupos musculares en las sesiones del programa.';
    }

    const resumen = Object.entries(gruposTrabajados)
      .map(([grupo, data]) => {
        return `- **${grupo}**: ${data.sesiones} sesión(es) en ${data.dias.size} día(s)`;
      })
      .join('\n');

    return `Grupos musculares trabajados esta semana:\n\n${resumen}`;
  };

  const analizarObjetivos = (): string => {
    if (!objetivosProgreso || objetivosProgreso.objetivos.length === 0) {
      return 'No hay objetivos definidos para este programa.';
    }

    const objetivosActivos = objetivosProgreso.objetivos.filter(
      (o) => o.estado === 'in_progress'
    );
    const objetivosCompletados = objetivosProgreso.objetivos.filter(
      (o) => o.estado === 'completed'
    );
    const objetivosEnRiesgo = objetivosProgreso.objetivos.filter(
      (o) => o.estado === 'at_risk'
    );

    let respuesta = `**Resumen de Objetivos:**\n\n`;
    respuesta += `- En progreso: ${objetivosActivos.length}\n`;
    respuesta += `- Completados: ${objetivosCompletados.length}\n`;
    respuesta += `- En riesgo: ${objetivosEnRiesgo.length}\n\n`;

    if (objetivosEnRiesgo.length > 0) {
      respuesta += `**Objetivos que requieren atención:**\n`;
      objetivosEnRiesgo.forEach((obj) => {
        respuesta += `- ${obj.titulo}: ${obj.progreso}% (${obj.valorActual} ${obj.unidad} / ${obj.valorObjetivo} ${obj.unidad})\n`;
      });
    }

    return respuesta;
  };

  const analizarVolumen = (): string => {
    let totalSeries = 0;
    let totalRepeticiones = 0;
    const seriesPorDia: Record<string, number> = {};

    Object.entries(weeklyPlan).forEach(([dia, dayPlan]) => {
      let seriesDia = 0;
      dayPlan.sessions.forEach((session) => {
        const series = session.series || 0;
        seriesDia += series;
        totalSeries += series;
        const reps = parseInt(session.repeticiones?.split('-')[0] || '0');
        totalRepeticiones += series * reps;
      });
      if (seriesDia > 0) {
        seriesPorDia[dia] = seriesDia;
      }
    });

    if (totalSeries === 0) {
      return 'No se ha registrado volumen (series) en el programa actual.';
    }

    const distribucion = Object.entries(seriesPorDia)
      .map(([dia, series]) => `- **${dia}**: ${series} series`)
      .join('\n');

    return `**Volumen semanal total:**\n\n- Total de series: ${totalSeries}\n- Total de repeticiones estimadas: ${totalRepeticiones}\n\n**Distribución por día:**\n${distribucion}`;
  };

  const analizarIntensidad = (): string => {
    const intensidades: number[] = [];
    const intensidadesPorDia: Record<string, number[]> = {};

    Object.entries(weeklyPlan).forEach(([dia, dayPlan]) => {
      const intensidadesDia: number[] = [];
      dayPlan.sessions.forEach((session) => {
        const intensityMatch = session.intensity?.match(/RPE\s*(\d+\.?\d*)/i);
        if (intensityMatch) {
          const rpe = parseFloat(intensityMatch[1]);
          intensidades.push(rpe);
          intensidadesDia.push(rpe);
        }
      });
      if (intensidadesDia.length > 0) {
        intensidadesPorDia[dia] = intensidadesDia;
      }
    });

    if (intensidades.length === 0) {
      return 'No se ha registrado intensidad (RPE) en el programa actual.';
    }

    const promedio = intensidades.reduce((a, b) => a + b, 0) / intensidades.length;
    const max = Math.max(...intensidades);
    const min = Math.min(...intensidades);

    const distribucion = Object.entries(intensidadesPorDia)
      .map(([dia, rpes]) => {
        const promedioDia = rpes.reduce((a, b) => a + b, 0) / rpes.length;
        return `- **${dia}**: RPE promedio ${promedioDia.toFixed(1)}`;
      })
      .join('\n');

    return `**Análisis de Intensidad (RPE):**\n\n- Promedio semanal: ${promedio.toFixed(1)}/10\n- Máxima: ${max}/10\n- Mínima: ${min}/10\n\n**Distribución por día:**\n${distribucion}`;
  };

  const analizarLesiones = (): string => {
    if (!contextoCliente || contextoCliente.lesiones.length === 0) {
      return 'No hay lesiones registradas para este cliente.';
    }

    const lesionesActivas = contextoCliente.lesiones.filter((l) => l.estado === 'activa');

    if (lesionesActivas.length === 0) {
      return 'No hay lesiones activas registradas.';
    }

    let respuesta = `**Lesiones activas:**\n\n`;
    lesionesActivas.forEach((lesion) => {
      respuesta += `- **${lesion.nombre}** (${lesion.ubicacion}): ${lesion.severidad}\n`;
      if (lesion.restricciones.length > 0) {
        respuesta += `  Restricciones: ${lesion.restricciones.join(', ')}\n`;
      }
    });

    return respuesta;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simular delay de procesamiento
    await new Promise((resolve) => setTimeout(resolve, 800));

    const respuesta = analizarPregunta(input);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: respuesta,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className={`p-0 flex flex-col h-[600px] ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <MessageCircle className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Asistente de Conversación</h3>
            <p className="text-sm text-gray-600">
              Pregunta sobre ejercicios, cargas, distribución y más
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="p-2 bg-indigo-100 rounded-full">
                <Bot className="w-4 h-4 text-indigo-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              <div
                className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
            {message.role === 'user' && (
              <div className="p-2 bg-indigo-100 rounded-full">
                <User className="w-4 h-4 text-indigo-600" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="p-2 bg-indigo-100 rounded-full">
              <Bot className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pregunta algo... (ej: ¿Cuál es el ejercicio más cargado esta semana?)"
            className="flex-1"
          />
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            leftIcon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          >
            Enviar
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="text-xs text-gray-500">Ejemplos:</span>
          <button
            onClick={() => setInput('¿Cuál es el ejercicio más cargado esta semana?')}
            className="text-xs text-indigo-600 hover:text-indigo-700 underline"
          >
            Ejercicio más cargado
          </button>
          <button
            onClick={() => setInput('¿Cómo está distribuida la semana?')}
            className="text-xs text-indigo-600 hover:text-indigo-700 underline"
          >
            Distribución semanal
          </button>
          <button
            onClick={() => setInput('¿Qué grupos musculares se trabajan?')}
            className="text-xs text-indigo-600 hover:text-indigo-700 underline"
          >
            Grupos musculares
          </button>
        </div>
      </div>
    </Card>
  );
};

