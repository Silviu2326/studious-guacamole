import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, X, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Modal, Button, Card } from '../../../components/componentsreutilizables';
import type { Dieta, Comida, MacrosNutricionales } from '../types';

interface SugerenciaIA {
  tipo: 'optimizacion' | 'advertencia' | 'sugerencia' | 'exito';
  titulo: string;
  descripcion: string;
  accion?: string;
  impacto?: 'alto' | 'medio' | 'bajo';
}

interface AIAssistantProps {
  dieta: Dieta | null;
  isOpen: boolean;
  onClose: () => void;
  onAplicarSugerencia?: (sugerencia: SugerenciaIA) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  dieta,
  isOpen,
  onClose,
  onAplicarSugerencia,
}) => {
  const [analizando, setAnalizando] = useState(false);
  const [sugerencias, setSugerencias] = useState<SugerenciaIA[]>([]);

  useEffect(() => {
    if (isOpen && dieta) {
      analizarSemana();
    }
  }, [isOpen, dieta]);

  const analizarSemana = async () => {
    setAnalizando(true);
    setSugerencias([]);

    // Simular análisis IA (en producción sería una llamada a la API)
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (!dieta) {
      setAnalizando(false);
      return;
    }

    // Análisis de macros semanales
    const sugerenciasGeneradas: SugerenciaIA[] = [];
    
    // Calcular promedios de macros por día
    // Si no hay comidas, usar macros objetivo directamente
    if (!dieta.comidas || dieta.comidas.length === 0) {
      sugerenciasGeneradas.push({
        tipo: 'advertencia',
        titulo: 'Sin comidas asignadas',
        descripcion: 'No se han asignado comidas a la semana. Añade comidas para comenzar el análisis.',
        impacto: 'alto',
        accion: 'Añadir comidas',
      });
      setSugerencias(sugerenciasGeneradas);
      setAnalizando(false);
      return;
    }

    const diasSemana = 7;
    const totalCalorias = dieta.comidas.reduce((sum, comida) => sum + comida.calorias, 0);
    const totalProteinas = dieta.comidas.reduce((sum, comida) => sum + comida.proteinas, 0);
    const totalCarbohidratos = dieta.comidas.reduce((sum, comida) => sum + comida.carbohidratos, 0);
    const totalGrasas = dieta.comidas.reduce((sum, comida) => sum + comida.grasas, 0);

    const promedioCalorias = totalCalorias / Math.max(diasSemana, 1);
    const promedioProteinas = totalProteinas / Math.max(diasSemana, 1);
    const promedioCarbohidratos = totalCarbohidratos / Math.max(diasSemana, 1);
    const promedioGrasas = totalGrasas / Math.max(diasSemana, 1);

    // Verificar si las calorias están dentro del objetivo
    const diferenciaCalorias = Math.abs(promedioCalorias - dieta.macros.calorias);
    const porcentajeDiferenciaCal = (diferenciaCalorias / dieta.macros.calorias) * 100;

    if (porcentajeDiferenciaCal > 10) {
      sugerenciasGeneradas.push({
        tipo: 'advertencia',
        titulo: 'Desviación significativa en calorías',
        descripcion: `El promedio diario de calorías (${Math.round(promedioCalorias)}) se desvía ${porcentajeDiferenciaCal.toFixed(1)}% del objetivo (${dieta.macros.calorias} kcal).`,
        impacto: 'alto',
        accion: 'Ajustar distribución calórica',
      });
    } else {
      sugerenciasGeneradas.push({
        tipo: 'exito',
        titulo: 'Calorías dentro del objetivo',
        descripcion: `El promedio diario (${Math.round(promedioCalorias)} kcal) está alineado con el objetivo de ${dieta.macros.calorias} kcal.`,
        impacto: 'bajo',
      });
    }

    // Verificar proteínas
    const diferenciaProteinas = dieta.macros.proteinas - promedioProteinas;
    if (diferenciaProteinas > 20) {
      sugerenciasGeneradas.push({
        tipo: 'optimizacion',
        titulo: 'Proteína por debajo del objetivo',
        descripcion: `El promedio diario de proteínas (${Math.round(promedioProteinas)}g) está ${Math.round(diferenciaProteinas)}g por debajo del objetivo (${dieta.macros.proteinas}g). Considera añadir más fuentes de proteína.`,
        impacto: 'medio',
        accion: 'Aumentar fuentes de proteína',
      });
    } else if (diferenciaProteinas < -20) {
      sugerenciasGeneradas.push({
        tipo: 'advertencia',
        titulo: 'Exceso de proteína',
        descripcion: `El promedio diario de proteínas (${Math.round(promedioProteinas)}g) supera el objetivo en ${Math.round(Math.abs(diferenciaProteinas))}g.`,
        impacto: 'medio',
        accion: 'Reequilibrar macros',
      });
    }

    // Verificar distribución de comidas
    const comidasPorTipo: Record<string, Comida[]> = {};
    dieta.comidas.forEach(comida => {
      if (!comidasPorTipo[comida.tipo]) {
        comidasPorTipo[comida.tipo] = [];
      }
      comidasPorTipo[comida.tipo].push(comida);
    });

    const tiposComida = ['desayuno', 'almuerzo', 'cena'];
    tiposComida.forEach(tipo => {
      if (!comidasPorTipo[tipo] || comidasPorTipo[tipo].length < 5) {
        sugerenciasGeneradas.push({
          tipo: 'sugerencia',
          titulo: `Faltan comidas de ${tipo}`,
          descripcion: `Se recomienda tener al menos 5 comidas de ${tipo} en la semana para mejor distribución.`,
          impacto: 'medio',
          accion: `Añadir más ${tipo}`,
        });
      }
    });

    // Verificar variedad
    const nombresComidasUnicas = new Set(dieta.comidas.map(c => c.nombre));
    if (nombresComidasUnicas.size < dieta.comidas.length * 0.5) {
      sugerenciasGeneradas.push({
        tipo: 'sugerencia',
        titulo: 'Baja variedad de comidas',
        descripcion: 'Se detecta poca variedad en las comidas. Aumentar la variedad mejora la adherencia del cliente.',
        impacto: 'bajo',
        accion: 'Variar recetas',
      });
    }

    // Sugerencia de optimización general
    if (sugerenciasGeneradas.filter(s => s.tipo === 'exito').length >= 2) {
      sugerenciasGeneradas.push({
        tipo: 'exito',
        titulo: 'Planificación equilibrada',
        descripcion: 'La semana está bien estructurada. Los macros están equilibrados y la distribución es adecuada.',
        impacto: 'bajo',
      });
    }

    setSugerencias(sugerenciasGeneradas);
    setAnalizando(false);
  };

  const getIconoSugerencia = (tipo: SugerenciaIA['tipo']) => {
    switch (tipo) {
      case 'optimizacion':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'advertencia':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'sugerencia':
        return <Sparkles className="h-5 w-5 text-indigo-500" />;
      case 'exito':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      default:
        return <Brain className="h-5 w-5 text-slate-500" />;
    }
  };

  const getColorFondo = (tipo: SugerenciaIA['tipo']) => {
    switch (tipo) {
      case 'optimizacion':
        return 'bg-blue-50 border-blue-200';
      case 'advertencia':
        return 'bg-amber-50 border-amber-200';
      case 'sugerencia':
        return 'bg-indigo-50 border-indigo-200';
      case 'exito':
        return 'bg-emerald-50 border-emerald-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const getColorTexto = (tipo: SugerenciaIA['tipo']) => {
    switch (tipo) {
      case 'optimizacion':
        return 'text-blue-900';
      case 'advertencia':
        return 'text-amber-900';
      case 'sugerencia':
        return 'text-indigo-900';
      case 'exito':
        return 'text-emerald-900';
      default:
        return 'text-slate-900';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Asistente IA - Análisis de la Semana"
      size="lg"
    >
      <div className="space-y-4">
        {analizando ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-4" />
            <p className="text-sm text-slate-600">Analizando la semana...</p>
            <p className="text-xs text-slate-500 mt-2">Revisando macros, distribución y equilibrio</p>
          </div>
        ) : sugerencias.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Brain className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <p>No se encontraron sugerencias</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
              <Brain className="h-4 w-4 text-indigo-500" />
              <span>Se encontraron <strong>{sugerencias.length}</strong> sugerencias para optimizar la semana</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {sugerencias.map((sugerencia, index) => (
                <Card
                  key={index}
                  className={`${getColorFondo(sugerencia.tipo)} border ${getColorTexto(sugerencia.tipo)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIconoSugerencia(sugerencia.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{sugerencia.titulo}</h4>
                          <p className="text-sm opacity-90">{sugerencia.descripcion}</p>
                        </div>
                        {sugerencia.impacto && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            sugerencia.impacto === 'alto' 
                              ? 'bg-red-100 text-red-700' 
                              : sugerencia.impacto === 'medio'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {sugerencia.impacto === 'alto' ? 'Alto' : sugerencia.impacto === 'medio' ? 'Medio' : 'Bajo'}
                          </span>
                        )}
                      </div>
                      {sugerencia.accion && onAplicarSugerencia && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-3 text-xs"
                          onClick={() => onAplicarSugerencia(sugerencia)}
                        >
                          {sugerencia.accion}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                Las sugerencias se basan en el análisis de macros, distribución y mejores prácticas nutricionales.
              </p>
              <Button variant="primary" size="sm" onClick={onClose}>
                Cerrar
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

