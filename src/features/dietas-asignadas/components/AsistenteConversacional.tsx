import React, { useState, useRef, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import {
  Brain,
  Send,
  Loader2,
  MessageSquare,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import type { Dieta, Comida, Alimento } from '../types';

interface Mensaje {
  id: string;
  tipo: 'usuario' | 'asistente';
  contenido: string;
  timestamp: Date;
}

interface AsistenteConversacionalProps {
  dieta: Dieta;
  isOpen: boolean;
  onClose: () => void;
}

export const AsistenteConversacional: React.FC<AsistenteConversacionalProps> = ({
  dieta,
  isOpen,
  onClose,
}) => {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [inputMensaje, setInputMensaje] = useState('');
  const [procesando, setProcesando] = useState(false);
  const mensajesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && mensajes.length === 0) {
      // Mensaje de bienvenida
      const mensajeBienvenida: Mensaje = {
        id: 'bienvenida',
        tipo: 'asistente',
        contenido: `¡Hola! Soy tu asistente de nutrición. Puedes preguntarme sobre el plan de ${dieta.nombre}. Por ejemplo:\n\n• "¿Qué comidas tienen más sodio?"\n• "¿Cuántas calorías tiene el desayuno?"\n• "¿Qué días tienen más proteína?"\n• "Muéstrame las comidas con más carbohidratos"\n\n¿En qué puedo ayudarte?`,
        timestamp: new Date(),
      };
      setMensajes([mensajeBienvenida]);
    }
  }, [isOpen, dieta.nombre]);

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const procesarConsulta = async (consulta: string): Promise<string> => {
    // Simular procesamiento (en producción sería una llamada a API de IA)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const consultaLower = consulta.toLowerCase();
    
    // Análisis de datos del plan
    const comidas = dieta.comidas || [];
    const alimentos: Alimento[] = [];
    comidas.forEach(comida => {
      if (comida.alimentos) {
        alimentos.push(...comida.alimentos);
      }
    });

    // Detectar tipo de consulta y responder
    if (consultaLower.includes('sodio') || consultaLower.includes('sodio')) {
      return analizarSodio(comidas, alimentos);
    }
    
    if (consultaLower.includes('caloría') || consultaLower.includes('calorias') || consultaLower.includes('kcal')) {
      return analizarCalorias(comidas, consultaLower);
    }
    
    if (consultaLower.includes('proteína') || consultaLower.includes('proteina') || consultaLower.includes('proteínas')) {
      return analizarProteinas(comidas, consultaLower);
    }
    
    if (consultaLower.includes('carbohidrato') || consultaLower.includes('carbos') || consultaLower.includes('hidratos')) {
      return analizarCarbohidratos(comidas, consultaLower);
    }
    
    if (consultaLower.includes('grasa') || consultaLower.includes('lípidos') || consultaLower.includes('lipidos')) {
      return analizarGrasas(comidas, consultaLower);
    }
    
    if (consultaLower.includes('desayuno')) {
      return analizarTipoComida(comidas, 'desayuno');
    }
    
    if (consultaLower.includes('almuerzo') || consultaLower.includes('comida')) {
      return analizarTipoComida(comidas, 'almuerzo');
    }
    
    if (consultaLower.includes('cena')) {
      return analizarTipoComida(comidas, 'cena');
    }
    
    if (consultaLower.includes('día') || consultaLower.includes('dia') || consultaLower.includes('días')) {
      return analizarPorDias(comidas);
    }
    
    if (consultaLower.includes('resumen') || consultaLower.includes('resume') || consultaLower.includes('resúmen')) {
      return generarResumen(dieta, comidas);
    }
    
    if (consultaLower.includes('objetivo') || consultaLower.includes('meta')) {
      return analizarObjetivos(dieta);
    }
    
    // Respuesta por defecto
    return `He analizado tu consulta sobre "${consulta}". Basándome en el plan "${dieta.nombre}":\n\n` +
      `• Total de comidas: ${comidas.length}\n` +
      `• Objetivo calórico: ${dieta.macros.calorias} kcal\n` +
      `• Objetivo de proteínas: ${dieta.macros.proteinas}g\n` +
      `• Objetivo de carbohidratos: ${dieta.macros.carbohidratos}g\n` +
      `• Objetivo de grasas: ${dieta.macros.grasas}g\n\n` +
      `¿Puedes ser más específico? Por ejemplo, pregunta sobre sodio, calorías, proteínas, o un tipo de comida específico.`;
  };

  const analizarSodio = (comidas: Comida[], alimentos: Alimento[]): string => {
    // Calcular sodio por comida (simulado - en producción vendría de los datos)
    const comidasConSodio = comidas.map(comida => {
      // Simular cálculo de sodio basado en alimentos
      const sodioEstimado = comida.alimentos?.reduce((sum, alimento) => {
        // Valores estimados de sodio por tipo de alimento
        const sodioPorAlimento = alimento.nombre.toLowerCase().includes('sal') ? 1000 :
          alimento.nombre.toLowerCase().includes('queso') ? 200 :
          alimento.nombre.toLowerCase().includes('pan') ? 150 :
          alimento.nombre.toLowerCase().includes('pollo') ? 50 :
          alimento.nombre.toLowerCase().includes('pescado') ? 100 : 20;
        return sum + (sodioEstimado * alimento.cantidad / 100);
      }, 0) || 0;
      
      return { comida, sodio: sodioEstimado };
    });

    comidasConSodio.sort((a, b) => b.sodio - a.sodio);
    const top5 = comidasConSodio.slice(0, 5);

    let respuesta = `📊 **Comidas con más sodio en el plan:**\n\n`;
    top5.forEach((item, index) => {
      respuesta += `${index + 1}. **${item.comida.nombre}** (${item.comida.tipo})\n`;
      respuesta += `   Sodio estimado: ~${Math.round(item.sodio)}mg\n\n`;
    });

    const promedioSodio = comidasConSodio.reduce((sum, item) => sum + item.sodio, 0) / comidasConSodio.length;
    respuesta += `📈 Promedio de sodio por comida: ~${Math.round(promedioSodio)}mg\n\n`;
    respuesta += `💡 La ingesta diaria recomendada de sodio es de 2000-2300mg.`;

    return respuesta;
  };

  const analizarCalorias = (comidas: Comida[], consulta: string): string => {
    if (consulta.includes('desayuno')) {
      const desayunos = comidas.filter(c => c.tipo === 'desayuno');
      const total = desayunos.reduce((sum, c) => sum + c.calorias, 0);
      const promedio = total / desayunos.length || 0;
      return `🍳 **Calorías en desayunos:**\n\n` +
        `• Total de desayunos: ${desayunos.length}\n` +
        `• Promedio por desayuno: ${Math.round(promedio)} kcal\n` +
        `• Total semanal: ${Math.round(total)} kcal\n\n` +
        `Objetivo diario: ${dieta.macros.calorias} kcal`;
    }

    const comidasOrdenadas = [...comidas].sort((a, b) => b.calorias - a.calorias);
    const top5 = comidasOrdenadas.slice(0, 5);
    const total = comidas.reduce((sum, c) => sum + c.calorias, 0);
    const promedio = total / comidas.length || 0;

    let respuesta = `🔥 **Análisis de calorías:**\n\n`;
    respuesta += `📊 **Top 5 comidas con más calorías:**\n\n`;
    top5.forEach((comida, index) => {
      respuesta += `${index + 1}. **${comida.nombre}** (${comida.tipo}): ${comida.calorias} kcal\n`;
    });

    respuesta += `\n📈 Estadísticas:\n`;
    respuesta += `• Total de calorías en el plan: ${Math.round(total)} kcal\n`;
    respuesta += `• Promedio por comida: ${Math.round(promedio)} kcal\n`;
    respuesta += `• Objetivo diario: ${dieta.macros.calorias} kcal\n`;
    respuesta += `• Diferencia: ${Math.round(total / 7 - dieta.macros.calorias)} kcal/día`;

    return respuesta;
  };

  const analizarProteinas = (comidas: Comida[], consulta: string): string => {
    const comidasOrdenadas = [...comidas].sort((a, b) => b.proteinas - a.proteinas);
    const top5 = comidasOrdenadas.slice(0, 5);
    const total = comidas.reduce((sum, c) => sum + c.proteinas, 0);
    const promedio = total / comidas.length || 0;
    const promedioDiario = total / 7;

    let respuesta = `💪 **Análisis de proteínas:**\n\n`;
    respuesta += `📊 **Top 5 comidas con más proteínas:**\n\n`;
    top5.forEach((comida, index) => {
      respuesta += `${index + 1}. **${comida.nombre}** (${comida.tipo}): ${comida.proteinas}g\n`;
    });

    respuesta += `\n📈 Estadísticas:\n`;
    respuesta += `• Total de proteínas en el plan: ${Math.round(total)}g\n`;
    respuesta += `• Promedio por comida: ${Math.round(promedio)}g\n`;
    respuesta += `• Promedio diario: ${Math.round(promedioDiario)}g\n`;
    respuesta += `• Objetivo diario: ${dieta.macros.proteinas}g\n`;
    const diferencia = promedioDiario - dieta.macros.proteinas;
    respuesta += `• Diferencia: ${diferencia > 0 ? '+' : ''}${Math.round(diferencia)}g/día`;

    return respuesta;
  };

  const analizarCarbohidratos = (comidas: Comida[], consulta: string): string => {
    const comidasOrdenadas = [...comidas].sort((a, b) => b.carbohidratos - a.carbohidratos);
    const top5 = comidasOrdenadas.slice(0, 5);
    const total = comidas.reduce((sum, c) => sum + c.carbohidratos, 0);
    const promedioDiario = total / 7;

    let respuesta = `🍞 **Análisis de carbohidratos:**\n\n`;
    respuesta += `📊 **Top 5 comidas con más carbohidratos:**\n\n`;
    top5.forEach((comida, index) => {
      respuesta += `${index + 1}. **${comida.nombre}** (${comida.tipo}): ${comida.carbohidratos}g\n`;
    });

    respuesta += `\n📈 Estadísticas:\n`;
    respuesta += `• Total de carbohidratos: ${Math.round(total)}g\n`;
    respuesta += `• Promedio diario: ${Math.round(promedioDiario)}g\n`;
    respuesta += `• Objetivo diario: ${dieta.macros.carbohidratos}g\n`;
    const diferencia = promedioDiario - dieta.macros.carbohidratos;
    respuesta += `• Diferencia: ${diferencia > 0 ? '+' : ''}${Math.round(diferencia)}g/día`;

    return respuesta;
  };

  const analizarGrasas = (comidas: Comida[], consulta: string): string => {
    const comidasOrdenadas = [...comidas].sort((a, b) => b.grasas - a.grasas);
    const top5 = comidasOrdenadas.slice(0, 5);
    const total = comidas.reduce((sum, c) => sum + c.grasas, 0);
    const promedioDiario = total / 7;

    let respuesta = `🥑 **Análisis de grasas:**\n\n`;
    respuesta += `📊 **Top 5 comidas con más grasas:**\n\n`;
    top5.forEach((comida, index) => {
      respuesta += `${index + 1}. **${comida.nombre}** (${comida.tipo}): ${comida.grasas}g\n`;
    });

    respuesta += `\n📈 Estadísticas:\n`;
    respuesta += `• Total de grasas: ${Math.round(total)}g\n`;
    respuesta += `• Promedio diario: ${Math.round(promedioDiario)}g\n`;
    respuesta += `• Objetivo diario: ${dieta.macros.grasas}g\n`;
    const diferencia = promedioDiario - dieta.macros.grasas;
    respuesta += `• Diferencia: ${diferencia > 0 ? '+' : ''}${Math.round(diferencia)}g/día`;

    return respuesta;
  };

  const analizarTipoComida = (comidas: Comida[], tipo: string): string => {
    const comidasTipo = comidas.filter(c => c.tipo === tipo);
    if (comidasTipo.length === 0) {
      return `No hay comidas de tipo "${tipo}" en el plan actual.`;
    }

    const totalCalorias = comidasTipo.reduce((sum, c) => sum + c.calorias, 0);
    const totalProteinas = comidasTipo.reduce((sum, c) => sum + c.proteinas, 0);
    const promedioCalorias = totalCalorias / comidasTipo.length;

    let respuesta = `🍽️ **Análisis de ${tipo}s:**\n\n`;
    respuesta += `• Total de ${tipo}s: ${comidasTipo.length}\n`;
    respuesta += `• Promedio de calorías: ${Math.round(promedioCalorias)} kcal\n`;
    respuesta += `• Total de proteínas: ${Math.round(totalProteinas)}g\n\n`;
    respuesta += `📋 **Lista de ${tipo}s:**\n\n`;
    comidasTipo.forEach((comida, index) => {
      respuesta += `${index + 1}. **${comida.nombre}**\n`;
      respuesta += `   ${comida.calorias} kcal | ${comida.proteinas}g prot | ${comida.carbohidratos}g carb | ${comida.grasas}g grasas\n\n`;
    });

    return respuesta;
  };

  const analizarPorDias = (comidas: Comida[]): string => {
    const comidasPorDia: Record<string, Comida[]> = {};
    comidas.forEach(comida => {
      const dia = comida.dia || 'sin-dia';
      if (!comidasPorDia[dia]) {
        comidasPorDia[dia] = [];
      }
      comidasPorDia[dia].push(comida);
    });

    let respuesta = `📅 **Análisis por días:**\n\n`;
    Object.entries(comidasPorDia).forEach(([dia, comidasDia]) => {
      const totalCal = comidasDia.reduce((sum, c) => sum + c.calorias, 0);
      const totalProt = comidasDia.reduce((sum, c) => sum + c.proteinas, 0);
      respuesta += `**${dia.charAt(0).toUpperCase() + dia.slice(1)}:**\n`;
      respuesta += `• Comidas: ${comidasDia.length}\n`;
      respuesta += `• Calorías: ${Math.round(totalCal)} kcal\n`;
      respuesta += `• Proteínas: ${Math.round(totalProt)}g\n\n`;
    });

    return respuesta;
  };

  const generarResumen = (dieta: Dieta, comidas: Comida[]): string => {
    const totalCal = comidas.reduce((sum, c) => sum + c.calorias, 0);
    const totalProt = comidas.reduce((sum, c) => sum + c.proteinas, 0);
    const totalCarb = comidas.reduce((sum, c) => sum + c.carbohidratos, 0);
    const totalGras = comidas.reduce((sum, c) => sum + c.grasas, 0);

    const promedioDiario = {
      calorias: totalCal / 7,
      proteinas: totalProt / 7,
      carbohidratos: totalCarb / 7,
      grasas: totalGras / 7,
    };

    return `📊 **Resumen del plan "${dieta.nombre}":**\n\n` +
      `🎯 **Objetivos:**\n` +
      `• Calorías: ${dieta.macros.calorias} kcal/día\n` +
      `• Proteínas: ${dieta.macros.proteinas}g/día\n` +
      `• Carbohidratos: ${dieta.macros.carbohidratos}g/día\n` +
      `• Grasas: ${dieta.macros.grasas}g/día\n\n` +
      `📈 **Promedios diarios del plan:**\n` +
      `• Calorías: ${Math.round(promedioDiario.calorias)} kcal (${Math.round((promedioDiario.calorias / dieta.macros.calorias - 1) * 100)}%)\n` +
      `• Proteínas: ${Math.round(promedioDiario.proteinas)}g (${Math.round((promedioDiario.proteinas / dieta.macros.proteinas - 1) * 100)}%)\n` +
      `• Carbohidratos: ${Math.round(promedioDiario.carbohidratos)}g (${Math.round((promedioDiario.carbohidratos / dieta.macros.carbohidratos - 1) * 100)}%)\n` +
      `• Grasas: ${Math.round(promedioDiario.grasas)}g (${Math.round((promedioDiario.grasas / dieta.macros.grasas - 1) * 100)}%)\n\n` +
      `🍽️ **Total de comidas:** ${comidas.length}\n` +
      `📅 **Objetivo:** ${dieta.objetivo}`;
  };

  const analizarObjetivos = (dieta: Dieta): string => {
    return `🎯 **Objetivos del plan "${dieta.nombre}":**\n\n` +
      `• **Objetivo nutricional:** ${dieta.objetivo}\n` +
      `• **Calorías diarias:** ${dieta.macros.calorias} kcal\n` +
      `• **Proteínas diarias:** ${dieta.macros.proteinas}g\n` +
      `• **Carbohidratos diarios:** ${dieta.macros.carbohidratos}g\n` +
      `• **Grasas diarias:** ${dieta.macros.grasas}g\n\n` +
      `📅 **Estado:** ${dieta.estado}\n` +
      (dieta.descripcion ? `📝 **Descripción:** ${dieta.descripcion}\n` : '');
  };

  const handleEnviar = async () => {
    if (!inputMensaje.trim() || procesando) return;

    const mensajeUsuario: Mensaje = {
      id: `msg-${Date.now()}`,
      tipo: 'usuario',
      contenido: inputMensaje.trim(),
      timestamp: new Date(),
    };

    setMensajes(prev => [...prev, mensajeUsuario]);
    setInputMensaje('');
    setProcesando(true);

    try {
      const respuesta = await procesarConsulta(inputMensaje.trim());
      const mensajeAsistente: Mensaje = {
        id: `msg-${Date.now() + 1}`,
        tipo: 'asistente',
        contenido: respuesta,
        timestamp: new Date(),
      };
      setMensajes(prev => [...prev, mensajeAsistente]);
    } catch (error) {
      const mensajeError: Mensaje = {
        id: `msg-${Date.now() + 1}`,
        tipo: 'asistente',
        contenido: 'Lo siento, hubo un error al procesar tu consulta. Por favor, intenta de nuevo.',
        timestamp: new Date(),
      };
      setMensajes(prev => [...prev, mensajeError]);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Brain className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Asistente Conversacional</h3>
              <p className="text-sm text-gray-600">Pregunta sobre el plan en lenguaje natural</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {mensajes.map(mensaje => (
            <div
              key={mensaje.id}
              className={`flex ${mensaje.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  mensaje.tipo === 'usuario'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {mensaje.tipo === 'asistente' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-medium">Asistente</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap text-sm">{mensaje.contenido}</div>
                <div className={`text-xs mt-2 ${mensaje.tipo === 'usuario' ? 'text-indigo-200' : 'text-gray-500'}`}>
                  {mensaje.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {procesando && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              </div>
            </div>
          )}
          <div ref={mensajesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMensaje}
              onChange={(e) => setInputMensaje(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Pregunta sobre el plan... (ej: ¿Qué comidas tienen más sodio?)"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          <p className="text-xs text-gray-500 mt-2">
            Ejemplos: "¿Qué comidas tienen más sodio?", "¿Cuántas calorías tiene el desayuno?", "Resumen del plan"
          </p>
        </div>
      </Card>
    </div>
  );
};

