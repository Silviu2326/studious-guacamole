import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { Dieta, Comida, TipoComida, RecursoBiblioteca, MacrosNutricionales } from '../types';
import { getRecursos } from '../api/recursos';
import { 
  Lightbulb, 
  Plus, 
  Target, 
  TrendingUp,
  Apple,
  ChefHat,
  Coffee,
  UtensilsCrossed,
  Flame,
  Clock
} from 'lucide-react';

interface SugerenciaContextual {
  id: string;
  tipo: TipoComida;
  dia?: string;
  titulo: string;
  descripcion: string;
  recurso?: RecursoBiblioteca;
  razon: string;
  prioridad: 'alta' | 'media' | 'baja';
  macrosSugeridos?: MacrosNutricionales;
}

interface SugerenciasContextualesProps {
  dieta: Dieta;
  onSugerenciaDragStart?: (sugerencia: SugerenciaContextual, event: React.DragEvent) => void;
  onAplicarSugerencia?: (sugerencia: SugerenciaContextual) => void;
}

const bloquesComida = [
  { id: 'desayuno', nombre: 'Desayuno', icono: <Coffee className="w-4 h-4" /> },
  { id: 'media-manana', nombre: 'Snack mañana', icono: <Apple className="w-4 h-4" /> },
  { id: 'almuerzo', nombre: 'Comida', icono: <UtensilsCrossed className="w-4 h-4" /> },
  { id: 'merienda', nombre: 'Snack tarde', icono: <Apple className="w-4 h-4" /> },
  { id: 'cena', nombre: 'Cena', icono: <Flame className="w-4 h-4" /> },
  { id: 'post-entreno', nombre: 'Extra opcional', icono: <TrendingUp className="w-4 h-4" /> },
] as const;

const diasSemana = [
  { id: 'lunes', nombre: 'Lunes' },
  { id: 'martes', nombre: 'Martes' },
  { id: 'miercoles', nombre: 'Miércoles' },
  { id: 'jueves', nombre: 'Jueves' },
  { id: 'viernes', nombre: 'Viernes' },
  { id: 'sabado', nombre: 'Sábado' },
  { id: 'domingo', nombre: 'Domingo' },
] as const;

export const SugerenciasContextuales: React.FC<SugerenciasContextualesProps> = ({
  dieta,
  onSugerenciaDragStart,
  onAplicarSugerencia,
}) => {
  const [sugerencias, setSugerencias] = useState<SugerenciaContextual[]>([]);
  const [recursos, setRecursos] = useState<RecursoBiblioteca[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarRecursos();
  }, []);

  useEffect(() => {
    if (recursos.length > 0) {
      generarSugerencias();
    }
  }, [dieta, recursos]);

  const cargarRecursos = async () => {
    setCargando(true);
    try {
      const todosRecursos = await getRecursos();
      setRecursos(todosRecursos);
    } catch (error) {
      console.error('Error cargando recursos:', error);
    } finally {
      setCargando(false);
    }
  };

  const calcularMacrosDia = (comidas: Comida[]): MacrosNutricionales => {
    return comidas.reduce(
      (acc, comida) => ({
        calorias: acc.calorias + comida.calorias,
        proteinas: acc.proteinas + comida.proteinas,
        carbohidratos: acc.carbohidratos + comida.carbohidratos,
        grasas: acc.grasas + comida.grasas,
      }),
      { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
    );
  };

  const detectarHuecosLibres = (): Array<{ tipo: TipoComida; dia?: string; macrosFaltantes: MacrosNutricionales }> => {
    const huecos: Array<{ tipo: TipoComida; dia?: string; macrosFaltantes: MacrosNutricionales }> = [];
    
    // Calcular macros objetivo por comida (distribución aproximada)
    const objetivoPorComida = {
      desayuno: { calorias: dieta.macros.calorias * 0.25, proteinas: dieta.macros.proteinas * 0.25, carbohidratos: dieta.macros.carbohidratos * 0.25, grasas: dieta.macros.grasas * 0.25 },
      'media-manana': { calorias: dieta.macros.calorias * 0.10, proteinas: dieta.macros.proteinas * 0.10, carbohidratos: dieta.macros.carbohidratos * 0.10, grasas: dieta.macros.grasas * 0.10 },
      almuerzo: { calorias: dieta.macros.calorias * 0.30, proteinas: dieta.macros.proteinas * 0.30, carbohidratos: dieta.macros.carbohidratos * 0.30, grasas: dieta.macros.grasas * 0.30 },
      merienda: { calorias: dieta.macros.calorias * 0.10, proteinas: dieta.macros.proteinas * 0.10, carbohidratos: dieta.macros.carbohidratos * 0.10, grasas: dieta.macros.grasas * 0.10 },
      cena: { calorias: dieta.macros.calorias * 0.20, proteinas: dieta.macros.proteinas * 0.20, carbohidratos: dieta.macros.carbohidratos * 0.20, grasas: dieta.macros.grasas * 0.20 },
      'post-entreno': { calorias: dieta.macros.calorias * 0.05, proteinas: dieta.macros.proteinas * 0.05, carbohidratos: dieta.macros.carbohidratos * 0.05, grasas: dieta.macros.grasas * 0.05 },
    };

    // Agrupar comidas por tipo
    const comidasPorTipo: Record<TipoComida, Comida[]> = {
      desayuno: [],
      'media-manana': [],
      almuerzo: [],
      merienda: [],
      cena: [],
      'post-entreno': [],
    };

    dieta.comidas.forEach(comida => {
      if (comidasPorTipo[comida.tipo]) {
        comidasPorTipo[comida.tipo].push(comida);
      }
    });

    // Detectar huecos
    Object.entries(comidasPorTipo).forEach(([tipo, comidas]) => {
      const macrosActuales = calcularMacrosDia(comidas);
      const objetivo = objetivoPorComida[tipo as TipoComida];
      
      const macrosFaltantes = {
        calorias: Math.max(0, objetivo.calorias - macrosActuales.calorias),
        proteinas: Math.max(0, objetivo.proteinas - macrosActuales.proteinas),
        carbohidratos: Math.max(0, objetivo.carbohidratos - macrosActuales.carbohidratos),
        grasas: Math.max(0, objetivo.grasas - macrosActuales.grasas),
      };

      // Si falta más del 20% del objetivo, es un hueco significativo
      if (macrosFaltantes.calorias > objetivo.calorias * 0.2) {
        huecos.push({
          tipo: tipo as TipoComida,
          macrosFaltantes,
        });
      }
    });

    return huecos;
  };

  const generarSugerencias = () => {
    const huecos = detectarHuecosLibres();
    const nuevasSugerencias: SugerenciaContextual[] = [];

    huecos.forEach((hueco, index) => {
      // Buscar recursos que se ajusten al hueco
      const recursosAdecuados = recursos.filter(recurso => {
        const macros = recurso.macros;
        const diferenciaCalorias = Math.abs(macros.calorias - hueco.macrosFaltantes.calorias);
        const diferenciaProteinas = Math.abs(macros.proteinas - hueco.macrosFaltantes.proteinas);
        
        // Aceptar si está dentro del 30% del objetivo
        return diferenciaCalorias < hueco.macrosFaltantes.calorias * 0.3 && 
               diferenciaProteinas < hueco.macrosFaltantes.proteinas * 0.5;
      });

      if (recursosAdecuados.length > 0) {
        const recurso = recursosAdecuados[0]; // Tomar el primero más adecuado
        const bloqueInfo = bloquesComida.find(b => b.id === hueco.tipo);
        
        let titulo = '';
        let descripcion = '';
        let razon = '';
        let prioridad: 'alta' | 'media' | 'baja' = 'media';

        if (hueco.tipo === 'media-manana' || hueco.tipo === 'merienda') {
          titulo = `Añadir snack proteico`;
          descripcion = recurso.nombre;
          razon = `Faltan ${Math.round(hueco.macrosFaltantes.proteinas)}g de proteína en ${bloqueInfo?.nombre.toLowerCase()}`;
          prioridad = hueco.macrosFaltantes.proteinas > 15 ? 'alta' : 'media';
        } else if (hueco.tipo === 'desayuno') {
          titulo = `Completar desayuno`;
          descripcion = recurso.nombre;
          razon = `Faltan ${Math.round(hueco.macrosFaltantes.calorias)} kcal para alcanzar el objetivo`;
          prioridad = hueco.macrosFaltantes.calorias > 200 ? 'alta' : 'media';
        } else if (hueco.tipo === 'almuerzo' || hueco.tipo === 'cena') {
          titulo = `Añadir ${bloqueInfo?.nombre.toLowerCase()}`;
          descripcion = recurso.nombre;
          razon = `Comida principal incompleta. Faltan ${Math.round(hueco.macrosFaltantes.calorias)} kcal`;
          prioridad = 'alta';
        } else {
          titulo = `Añadir ${bloqueInfo?.nombre.toLowerCase()}`;
          descripcion = recurso.nombre;
          razon = `Faltan ${Math.round(hueco.macrosFaltantes.calorias)} kcal`;
          prioridad = 'media';
        }

        nuevasSugerencias.push({
          id: `sug-${hueco.tipo}-${index}`,
          tipo: hueco.tipo,
          titulo,
          descripcion,
          recurso,
          razon,
          prioridad,
          macrosSugeridos: recurso.macros,
        });
      } else {
        // Si no hay recurso exacto, crear sugerencia genérica
        const bloqueInfo = bloquesComida.find(b => b.id === hueco.tipo);
        nuevasSugerencias.push({
          id: `sug-${hueco.tipo}-${index}`,
          tipo: hueco.tipo,
          titulo: `Añadir ${bloqueInfo?.nombre.toLowerCase()}`,
          descripcion: `Buscar recurso con ~${Math.round(hueco.macrosFaltantes.calorias)} kcal`,
          razon: `Faltan ${Math.round(hueco.macrosFaltantes.calorias)} kcal y ${Math.round(hueco.macrosFaltantes.proteinas)}g de proteína`,
          prioridad: hueco.macrosFaltantes.calorias > 200 ? 'alta' : 'media',
          macrosSugeridos: hueco.macrosFaltantes,
        });
      }
    });

    setSugerencias(nuevasSugerencias);
  };

  const handleDragStart = (sugerencia: SugerenciaContextual, event: React.DragEvent) => {
    if (sugerencia.recurso) {
      const dragData = {
        tipo: sugerencia.recurso.tipo,
        recurso: sugerencia.recurso,
        origen: 'sugerencias-contextuales' as const,
        sugerencia: {
          tipoComida: sugerencia.tipo,
          dia: sugerencia.dia,
        },
      };
      event.dataTransfer.setData('application/json', JSON.stringify(dragData));
      event.dataTransfer.effectAllowed = 'move';
      onSugerenciaDragStart?.(sugerencia, event);
    }
  };

  const getPrioridadColor = (prioridad: 'alta' | 'media' | 'baja') => {
    switch (prioridad) {
      case 'alta':
        return 'border-red-200 bg-red-50';
      case 'media':
        return 'border-amber-200 bg-amber-50';
      case 'baja':
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getPrioridadBadge = (prioridad: 'alta' | 'media' | 'baja') => {
    switch (prioridad) {
      case 'alta':
        return <Badge className="bg-red-100 text-red-700 text-xs">Alta</Badge>;
      case 'media':
        return <Badge className="bg-amber-100 text-amber-700 text-xs">Media</Badge>;
      case 'baja':
        return <Badge className="bg-blue-100 text-blue-700 text-xs">Baja</Badge>;
    }
  };

  if (cargando) {
    return (
      <Card className="border border-slate-200 bg-white p-4">
        <div className="text-center text-sm text-slate-500">Cargando sugerencias...</div>
      </Card>
    );
  }

  if (sugerencias.length === 0) {
    return (
      <Card className="border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-slate-900">Sugerencias contextuales</h3>
        </div>
        <p className="text-xs text-slate-500">No hay huecos libres detectados. ¡Tu dieta está completa!</p>
      </Card>
    );
  }

  return (
    <Card className="border border-slate-200 bg-white p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-semibold text-slate-900">Sugerencias contextuales</h3>
        <Badge className="bg-amber-100 text-amber-700 text-xs">{sugerencias.length}</Badge>
      </div>
      
      <p className="text-xs text-slate-500">
        Arrastra las sugerencias a los huecos libres para completar tu dieta
      </p>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {sugerencias.map((sugerencia) => {
          const bloqueInfo = bloquesComida.find(b => b.id === sugerencia.tipo);
          
          return (
            <Card
              key={sugerencia.id}
              draggable={!!sugerencia.recurso}
              onDragStart={(e) => handleDragStart(sugerencia, e)}
              className={`border-2 cursor-move transition-all hover:shadow-md ${getPrioridadColor(sugerencia.prioridad)}`}
            >
              <div className="p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {bloqueInfo?.icono}
                      <span className="text-xs font-semibold text-slate-900">{sugerencia.titulo}</span>
                      {getPrioridadBadge(sugerencia.prioridad)}
                    </div>
                    <p className="text-xs text-slate-700 font-medium mb-1">{sugerencia.descripcion}</p>
                    <p className="text-xs text-slate-500">{sugerencia.razon}</p>
                  </div>
                </div>
                
                {sugerencia.macrosSugeridos && (
                  <div className="flex items-center gap-3 text-xs text-slate-600 pt-2 border-t border-slate-200">
                    <span>{Math.round(sugerencia.macrosSugeridos.calorias)} kcal</span>
                    <span>P: {Math.round(sugerencia.macrosSugeridos.proteinas)}g</span>
                    <span>H: {Math.round(sugerencia.macrosSugeridos.carbohidratos)}g</span>
                    <span>G: {Math.round(sugerencia.macrosSugeridos.grasas)}g</span>
                  </div>
                )}

                {sugerencia.recurso && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-xs"
                    onClick={() => onAplicarSugerencia?.(sugerencia)}
                    leftIcon={<Plus className="w-3 h-3" />}
                  >
                    Aplicar sugerencia
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </Card>
  );
};

