import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import {
  Clock,
  ChefHat,
  ShoppingCart,
  UtensilsCrossed,
  CheckCircle2,
  AlertCircle,
  Info,
  Lightbulb,
  Calendar,
} from 'lucide-react';
import type { Dieta, Comida, Alimento, TipoComida } from '../types';

interface ProximaComidaPanelProps {
  dieta: Dieta;
  clienteId?: string;
}

interface ProximaComidaInfo {
  comida: Comida;
  tiempoRestante: string; // Tiempo hasta la comida (ej: "2 horas", "mañana")
  esHoy: boolean;
  dia: string;
  horario?: string;
}

// Mapeo de días de la semana
const diasSemana = [
  'domingo',
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
] as const;

// Orden de tipos de comida por hora típica
const ordenComidas: TipoComida[] = [
  'desayuno',
  'media-manana',
  'almuerzo',
  'merienda',
  'cena',
  'post-entreno',
];

// Horarios típicos por tipo de comida (en formato HH:mm)
const horariosTipicos: Record<TipoComida, string> = {
  desayuno: '08:00',
  'media-manana': '11:00',
  almuerzo: '14:00',
  merienda: '17:00',
  cena: '20:00',
  'post-entreno': '19:00',
};

export const ProximaComidaPanel: React.FC<ProximaComidaPanelProps> = ({
  dieta,
  clienteId,
}) => {
  const [proximaComida, setProximaComida] = useState<ProximaComidaInfo | null>(null);
  const [ingredientesPendientes, setIngredientesPendientes] = useState<Alimento[]>([]);

  // Calcular la próxima comida relevante
  useEffect(() => {
    if (!dieta.comidas || dieta.comidas.length === 0) {
      setProximaComida(null);
      return;
    }

    const ahora = new Date();
    const diaActual = diasSemana[ahora.getDay()];
    const horaActual = ahora.getHours();
    const minutoActual = ahora.getMinutes();
    const tiempoActual = horaActual * 60 + minutoActual; // Minutos desde medianoche

    // Buscar la próxima comida de hoy
    let proximaComidaHoy: Comida | null = null;
    let menorTiempoRestante = Infinity;
    let comidaReciente: Comida | null = null; // Comida que ya pasó pero hace menos de 2 horas
    let menorTiempoPasado = -Infinity; // Tiempo más cercano a ahora (menos negativo)

    dieta.comidas.forEach((comida) => {
      const diaComida = comida.dia || 'lunes';
      
      // Si la comida es de hoy
      if (diaComida === diaActual) {
        const horarioComida = comida.horario || horariosTipicos[comida.tipo];
        const [horaComida, minutoComida] = horarioComida.split(':').map(Number);
        const tiempoComida = horaComida * 60 + minutoComida;

        // Calcular tiempo restante
        const tiempoRestante = tiempoComida - tiempoActual;
        
        // Si la comida es en el futuro (prioridad)
        if (tiempoRestante > 0) {
          // Comida futura: buscar la más cercana
          if (tiempoRestante < menorTiempoRestante) {
            menorTiempoRestante = tiempoRestante;
            proximaComidaHoy = comida;
          }
        } else if (tiempoRestante >= -120) {
          // Si ya pasó pero hace menos de 2 horas, guardarla como alternativa
          // Buscar la más reciente (tiempoRestante menos negativo = más cercano)
          if (tiempoRestante > menorTiempoPasado) {
            menorTiempoPasado = tiempoRestante;
            comidaReciente = comida;
          }
        }
      }
    });

    // Si no hay comida futura, usar la más reciente (si existe)
    if (!proximaComidaHoy && comidaReciente) {
      proximaComidaHoy = comidaReciente;
    }

    // Si no hay comida hoy, buscar la próxima de mañana
    if (!proximaComidaHoy) {
      // Buscar el índice del día de mañana
      const indiceHoy = diasSemana.indexOf(diaActual);
      const indiceManana = (indiceHoy + 1) % 7;
      const diaManana = diasSemana[indiceManana];

      // Buscar la primera comida de mañana (ordenada por tipo)
      const comidasManana = dieta.comidas
        .filter((c) => (c.dia || 'lunes') === diaManana)
        .sort((a, b) => {
          const ordenA = ordenComidas.indexOf(a.tipo);
          const ordenB = ordenComidas.indexOf(b.tipo);
          return ordenA - ordenB;
        });

      if (comidasManana.length > 0) {
        proximaComidaHoy = comidasManana[0];
      }
    }

    // Si aún no hay comida, buscar la próxima disponible en la semana
    if (!proximaComidaHoy) {
      const todasComidas = dieta.comidas
        .filter((c) => c.dia)
        .sort((a, b) => {
          const diaA = diasSemana.indexOf(a.dia as any);
          const diaB = diasSemana.indexOf(b.dia as any);
          if (diaA !== diaB) return diaA - diaB;
          const ordenA = ordenComidas.indexOf(a.tipo);
          const ordenB = ordenComidas.indexOf(b.tipo);
          return ordenA - ordenB;
        });

      if (todasComidas.length > 0) {
        proximaComidaHoy = todasComidas[0];
      }
    }

    if (proximaComidaHoy) {
      const diaComida = proximaComidaHoy.dia || 'lunes';
      const esHoy = diaComida === diaActual;
      const horarioComida = proximaComidaHoy.horario || horariosTipicos[proximaComidaHoy.tipo];

      let tiempoRestanteStr = '';
      if (esHoy) {
        const [horaComida, minutoComida] = horarioComida.split(':').map(Number);
        const tiempoComida = horaComida * 60 + minutoComida;
        const tiempoRestante = tiempoComida - tiempoActual;

        if (tiempoRestante < 0) {
          // Ya pasó
          const minutosPasados = Math.abs(tiempoRestante);
          if (minutosPasados < 60) {
            tiempoRestanteStr = `Hace ${minutosPasados} minutos`;
          } else {
            const horas = Math.floor(minutosPasados / 60);
            const minutos = minutosPasados % 60;
            tiempoRestanteStr = minutos > 0 ? `Hace ${horas}h ${minutos}m` : `Hace ${horas}h`;
          }
        } else if (tiempoRestante < 60) {
          tiempoRestanteStr = `En ${tiempoRestante} minutos`;
        } else {
          const horas = Math.floor(tiempoRestante / 60);
          const minutos = tiempoRestante % 60;
          tiempoRestanteStr = minutos > 0 ? `En ${horas}h ${minutos}m` : `En ${horas}h`;
        }
      } else {
        tiempoRestanteStr = 'Mañana';
      }

      setProximaComida({
        comida: proximaComidaHoy,
        tiempoRestante: tiempoRestanteStr,
        esHoy,
        dia: diaComida,
        horario: horarioComida,
      });

      // Calcular ingredientes pendientes (simulado - en producción vendría de la lista de compra)
      setIngredientesPendientes(proximaComidaHoy.alimentos || []);
    } else {
      setProximaComida(null);
      setIngredientesPendientes([]);
    }
  }, [dieta.comidas]);

  // Generar tips de preparación
  const tipsPreparacion = useMemo(() => {
    if (!proximaComida) return [];

    const tips: string[] = [];

    // Tip basado en el tipo de comida
    if (proximaComida.comida.tipo === 'desayuno') {
      tips.push('Prepara los ingredientes la noche anterior para ahorrar tiempo');
      tips.push('Calienta el agua/hervidor 10 minutos antes de la hora');
    } else if (proximaComida.comida.tipo === 'almuerzo') {
      tips.push('Prepara los ingredientes por la mañana antes de salir');
      tips.push('Lava y corta las verduras con antelación');
    } else if (proximaComida.comida.tipo === 'cena') {
      tips.push('Descongela las proteínas por la mañana en el refrigerador');
      tips.push('Prepara una lista de ingredientes antes de cocinar');
    }

    // Tip basado en el tiempo de preparación
    if (proximaComida.comida.tempoCulinario) {
      if (proximaComida.comida.tempoCulinario > 30) {
        tips.push(`Esta comida requiere ${proximaComida.comida.tempoCulinario} minutos de preparación. Planifica con tiempo.`);
      } else if (proximaComida.comida.tempoCulinario <= 15) {
        tips.push('Comida rápida de preparar. Ideal para días ocupados.');
      }
    }

    // Tip basado en instrucciones detalladas
    if (proximaComida.comida.instruccionesDetalladas) {
      // Extraer el primer tip de las instrucciones
      const primerasInstrucciones = proximaComida.comida.instruccionesDetalladas.split('\n')[0];
      if (primerasInstrucciones.length < 100) {
        tips.push(primerasInstrucciones);
      }
    }

    // Tips generales basados en ingredientes
    const tieneProteina = proximaComida.comida.alimentos.some(
      (a) =>
        a.nombre.toLowerCase().includes('pollo') ||
        a.nombre.toLowerCase().includes('pescado') ||
        a.nombre.toLowerCase().includes('carne') ||
        a.nombre.toLowerCase().includes('huevo') ||
        a.nombre.toLowerCase().includes('tofu')
    );

    if (tieneProteina) {
      tips.push('Asegúrate de tener la proteína descongelada antes de cocinar');
    }

    const tieneVerduras = proximaComida.comida.alimentos.some(
      (a) =>
        a.nombre.toLowerCase().includes('verdura') ||
        a.nombre.toLowerCase().includes('ensalada') ||
        a.nombre.toLowerCase().includes('brócoli') ||
        a.nombre.toLowerCase().includes('espinacas')
    );

    if (tieneVerduras) {
      tips.push('Lava y seca las verduras antes de usar');
    }

    return tips.slice(0, 4); // Máximo 4 tips
  }, [proximaComida]);

  if (!proximaComida) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Info className="h-5 w-5" />
          <p className="text-sm">No hay comidas programadas próximamente</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <UtensilsCrossed className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Próxima Comida</h3>
            <p className="text-xs text-gray-600">
              {proximaComida.esHoy ? 'Hoy' : 'Mañana'} • {proximaComida.tiempoRestante}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{proximaComida.horario}</span>
        </div>
      </div>

      {/* Información de la comida */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-900">{proximaComida.comida.nombre}</h4>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
            {proximaComida.comida.tipo.replace('-', ' ')}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-xs text-gray-600 mt-3">
          <div>
            <span className="font-medium">{proximaComida.comida.calorias}</span> kcal
          </div>
          <div>
            <span className="font-medium">{proximaComida.comida.proteinas}g</span> prot
          </div>
          <div>
            <span className="font-medium">{proximaComida.comida.carbohidratos}g</span> carb
          </div>
          <div>
            <span className="font-medium">{proximaComida.comida.grasas}g</span> grasas
          </div>
        </div>
      </div>

      {/* Tips de preparación */}
      {tipsPreparacion.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            <h5 className="text-sm font-semibold text-gray-900">Tips de Preparación</h5>
          </div>
          <ul className="space-y-2">
            {tipsPreparacion.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-gray-700">
                <ChefHat className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ingredientes pendientes */}
      {ingredientesPendientes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-green-500" />
            <h5 className="text-sm font-semibold text-gray-900">Ingredientes Necesarios</h5>
          </div>
          <div className="space-y-1.5">
            {ingredientesPendientes.slice(0, 6).map((ingrediente, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-3 h-3 text-orange-500" />
                  <span className="text-xs text-gray-700 font-medium">
                    {ingrediente.nombre}
                  </span>
                </div>
                <span className="text-xs text-gray-600">
                  {ingrediente.cantidad} {ingrediente.unidad}
                </span>
              </div>
            ))}
            {ingredientesPendientes.length > 6 && (
              <p className="text-xs text-gray-500 text-center pt-1">
                +{ingredientesPendientes.length - 6} ingredientes más
              </p>
            )}
          </div>
        </div>
      )}

      {/* Notas adicionales */}
      {proximaComida.comida.notas && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-800">{proximaComida.comida.notas}</p>
          </div>
        </div>
      )}
    </Card>
  );
};

