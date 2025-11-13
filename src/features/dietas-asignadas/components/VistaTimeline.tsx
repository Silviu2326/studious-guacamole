import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Clock,
  ChefHat,
  UtensilsCrossed,
  Apple,
  Flame,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Dieta, Comida, TipoComida } from '../types';
import { RecordatoriosSuplementos } from './RecordatoriosSuplementos';
import { ImpactoEjercicio } from './ImpactoEjercicio';

interface VistaTimelineProps {
  dieta: Dieta;
  onComidaClick?: (comida: Comida) => void;
  onComidaEdit?: (comida: Comida) => void;
}

const bloquesComida = [
  { id: 'desayuno' as TipoComida, nombre: 'Desayuno', icono: <ChefHat className="w-4 h-4 text-amber-500" />, horario: '08:00', orden: 1 },
  { id: 'media-manana' as TipoComida, nombre: 'Snack mañana', icono: <Clock className="w-4 h-4 text-sky-500" />, horario: '11:00', orden: 2 },
  { id: 'almuerzo' as TipoComida, nombre: 'Almuerzo', icono: <UtensilsCrossed className="w-4 h-4 text-emerald-500" />, horario: '14:00', orden: 3 },
  { id: 'merienda' as TipoComida, nombre: 'Snack tarde', icono: <Apple className="w-4 h-4 text-rose-500" />, horario: '17:00', orden: 4 },
  { id: 'cena' as TipoComida, nombre: 'Cena', icono: <Flame className="w-4 h-4 text-indigo-500" />, horario: '20:00', orden: 5 },
  { id: 'post-entreno' as TipoComida, nombre: 'Post-entreno', icono: <TrendingUp className="w-4 h-4 text-purple-500" />, horario: 'Variable', orden: 6 },
];

type VistaModo = 'detalle' | 'resumen';
type ZoomLevel = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;

export const VistaTimeline: React.FC<VistaTimelineProps> = ({
  dieta,
  onComidaClick,
  onComidaEdit,
}) => {
  const [zoom, setZoom] = useState<ZoomLevel>(1);
  const [modoVista, setModoVista] = useState<VistaModo>('detalle');
  const [bloquesExpandidos, setBloquesExpandidos] = useState<Set<TipoComida>>(new Set(bloquesComida.map(b => b.id)));
  const timelineRef = useRef<HTMLDivElement>(null);

  // Organizar comidas por tipo y ordenar por horario
  const comidasPorTipo = useMemo(() => {
    const resultado: Record<TipoComida, Comida[]> = {} as Record<TipoComida, Comida[]>;
    
    bloquesComida.forEach(bloque => {
      resultado[bloque.id] = [];
    });

    dieta.comidas.forEach(comida => {
      if (resultado[comida.tipo]) {
        resultado[comida.tipo].push(comida);
      }
    });

    // Ordenar comidas dentro de cada tipo por horario si está disponible
    Object.keys(resultado).forEach(tipo => {
      resultado[tipo as TipoComida].sort((a, b) => {
        if (a.horario && b.horario) {
          return a.horario.localeCompare(b.horario);
        }
        return 0;
      });
    });

    return resultado;
  }, [dieta.comidas]);

  // Calcular totales por bloque
  const calcularTotalesBloque = (tipo: TipoComida) => {
    const comidas = comidasPorTipo[tipo] || [];
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

  const zoomIn = () => {
    const niveles: ZoomLevel[] = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const indiceActual = niveles.indexOf(zoom);
    if (indiceActual < niveles.length - 1) {
      setZoom(niveles[indiceActual + 1]);
    }
  };

  const zoomOut = () => {
    const niveles: ZoomLevel[] = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const indiceActual = niveles.indexOf(zoom);
    if (indiceActual > 0) {
      setZoom(niveles[indiceActual - 1]);
    }
  };

  const resetZoom = () => {
    setZoom(1);
  };

  const toggleBloque = (tipo: TipoComida) => {
    setBloquesExpandidos(prev => {
      const nuevo = new Set(prev);
      if (nuevo.has(tipo)) {
        nuevo.delete(tipo);
      } else {
        nuevo.add(tipo);
      }
      return nuevo;
    });
  };

  const expandirTodos = () => {
    setBloquesExpandidos(new Set(bloquesComida.map(b => b.id)));
  };

  const colapsarTodos = () => {
    setBloquesExpandidos(new Set());
  };

  const renderComidaDetalle = (comida: Comida) => {
    return (
      <Card
        key={comida.id}
        className="mb-3 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
        onClick={() => onComidaClick?.(comida)}
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">{comida.nombre}</h4>
              {comida.horario && (
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                  <Clock className="w-3 h-3" />
                  <span>{comida.horario}</span>
                </div>
              )}
            </div>
            {onComidaEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onComidaEdit(comida);
                }}
                className="h-7 w-7 p-0"
              >
                <UtensilsCrossed className="w-3 h-3" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="bg-amber-50 rounded-lg p-2 text-center">
              <div className="font-semibold text-amber-900">{comida.calorias}</div>
              <div className="text-amber-600">kcal</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-2 text-center">
              <div className="font-semibold text-blue-900">{comida.proteinas}g</div>
              <div className="text-blue-600">Proteína</div>
            </div>
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <div className="font-semibold text-green-900">{comida.carbohidratos}g</div>
              <div className="text-green-600">Carbs</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-2 text-center">
              <div className="font-semibold text-purple-900">{comida.grasas}g</div>
              <div className="text-purple-600">Grasas</div>
            </div>
          </div>
          {comida.notas && (
            <p className="text-xs text-gray-500 mt-2 italic">{comida.notas}</p>
          )}
        </div>
      </Card>
    );
  };

  const renderComidaResumen = (comida: Comida) => {
    return (
      <div
        key={comida.id}
        className="flex items-center justify-between p-2 mb-1 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
        onClick={() => onComidaClick?.(comida)}
      >
        <span className="text-sm font-medium text-gray-900">{comida.nombre}</span>
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span>{comida.calorias} kcal</span>
          <span>P: {comida.proteinas}g</span>
        </div>
      </div>
    );
  };

  const renderBloque = (bloque: typeof bloquesComida[0]) => {
    const comidas = comidasPorTipo[bloque.id] || [];
    const expandido = bloquesExpandidos.has(bloque.id);
    const totales = calcularTotalesBloque(bloque.id);

    if (comidas.length === 0 && modoVista === 'resumen') {
      return null;
    }

    return (
      <div key={bloque.id} className="relative">
        {/* Línea vertical del timeline */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300" />
        
        {/* Punto del timeline */}
        <div className="absolute left-4 top-6 w-4 h-4 rounded-full bg-white border-4 border-blue-500 z-10" />

        {/* Contenido del bloque */}
        <div className="ml-16 mb-6">
          <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
            <button
              onClick={() => toggleBloque(bloque.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-t-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {bloque.icono}
                  <h3 className="text-base font-semibold text-gray-900">{bloque.nombre}</h3>
                </div>
                <Badge className="bg-gray-100 text-gray-600 text-xs">
                  {bloque.horario}
                </Badge>
                {comidas.length > 0 && (
                  <Badge className="bg-blue-50 text-blue-700 text-xs">
                    {comidas.length} {comidas.length === 1 ? 'comida' : 'comidas'}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4">
                {comidas.length > 0 && (
                  <div className="text-right text-sm">
                    <div className="font-semibold text-gray-900">{totales.calorias} kcal</div>
                    <div className="text-xs text-gray-500">
                      P: {totales.proteinas}g · H: {totales.carbohidratos}g · G: {totales.grasas}g
                    </div>
                  </div>
                )}
                {expandido ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </button>

            {expandido && comidas.length > 0 && (
              <div className="p-4 pt-2 border-t border-gray-200">
                {modoVista === 'detalle' ? (
                  <div>
                    {comidas.map((comida) => (
                      <div key={comida.id}>
                        {renderComidaDetalle(comida)}
                        {dieta.recordatorios && dieta.recordatorios.length > 0 && (
                          <div className="mt-2 ml-2">
                            <RecordatoriosSuplementos
                              recordatorios={dieta.recordatorios}
                              tipoComida={bloque.id}
                              comidaId={comida.id}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>{comidas.map(renderComidaResumen)}</div>
                )}
              </div>
            )}

            {expandido && comidas.length === 0 && (
              <div className="p-4 pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-400 text-center py-4">
                  No hay comidas asignadas a este bloque
                </p>
                {dieta.recordatorios && dieta.recordatorios.length > 0 && (
                  <div className="mt-2">
                    <RecordatoriosSuplementos
                      recordatorios={dieta.recordatorios}
                      tipoComida={bloque.id}
                    />
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">Timeline de Comidas</h2>
          <Badge className="bg-blue-50 text-blue-600">
            {dieta.macros.calorias} kcal objetivo
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {/* Control de zoom */}
          <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomOut}
              disabled={zoom === 0.5}
              className="h-8 w-8 p-0"
              title="Alejar"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs font-medium text-gray-700 px-2 min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomIn}
              disabled={zoom === 2}
              className="h-8 w-8 p-0"
              title="Acercar"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={resetZoom}
              className="h-8 w-8 p-0"
              title="Resetear zoom"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Control de vista */}
          <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
            <Button
              variant={modoVista === 'detalle' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setModoVista('detalle')}
              className="h-8 px-3"
              leftIcon={<Eye className="w-4 h-4" />}
            >
              Detalle
            </Button>
            <Button
              variant={modoVista === 'resumen' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setModoVista('resumen')}
              className="h-8 px-3"
              leftIcon={<EyeOff className="w-4 h-4" />}
            >
              Resumen
            </Button>
          </div>

          {/* Expandir/Colapsar */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={expandirTodos}
              className="h-8 px-3 text-xs"
            >
              Expandir
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={colapsarTodos}
              className="h-8 px-3 text-xs"
            >
              Colapsar
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div
        ref={timelineRef}
        className="relative bg-white rounded-lg border border-gray-200 p-6 overflow-auto"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
          minHeight: `${100 / zoom}%`,
        }}
      >
        <div className="space-y-0">
          {bloquesComida.map(renderBloque)}
        </div>
        
        {/* Impacto de ejercicio adicional */}
        {dieta.actividadesEjercicio && dieta.actividadesEjercicio.length > 0 && (
          <div className="mt-6 pt-6 border-t-2 border-gray-300">
            <ImpactoEjercicio
              actividades={dieta.actividadesEjercicio}
              onAjustarIngesta={(actividadId, ajuste) => {
                // Callback para ajustar la ingesta basado en el ejercicio
                console.log('Ajustar ingesta para actividad:', actividadId, ajuste);
                // Aquí se podría implementar la lógica para ajustar las comidas
              }}
            />
          </div>
        )}
      </div>

      {/* Resumen total */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Resumen Total</h3>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-xs text-gray-500 mb-1">Total Calorías</div>
              <div className="font-semibold text-gray-900">
                {bloquesComida.reduce((acc, bloque) => {
                  const totales = calcularTotalesBloque(bloque.id);
                  return acc + totales.calorias;
                }, 0)} / {dieta.macros.calorias} kcal
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Total Proteínas</div>
              <div className="font-semibold text-gray-900">
                {Math.round(
                  bloquesComida.reduce((acc, bloque) => {
                    const totales = calcularTotalesBloque(bloque.id);
                    return acc + totales.proteinas;
                  }, 0)
                )} / {dieta.macros.proteinas} g
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Total Carbohidratos</div>
              <div className="font-semibold text-gray-900">
                {Math.round(
                  bloquesComida.reduce((acc, bloque) => {
                    const totales = calcularTotalesBloque(bloque.id);
                    return acc + totales.carbohidratos;
                  }, 0)
                )} / {dieta.macros.carbohidratos} g
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Total Grasas</div>
              <div className="font-semibold text-gray-900">
                {Math.round(
                  bloquesComida.reduce((acc, bloque) => {
                    const totales = calcularTotalesBloque(bloque.id);
                    return acc + totales.grasas;
                  }, 0)
                )} / {dieta.macros.grasas} g
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

