import React, { useState, useMemo } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { ChevronDown, ChevronRight, Clock, ChefHat, UtensilsCrossed, Apple, Flame, TrendingUp, Edit, Copy } from 'lucide-react';
import { Dieta, Comida, TipoComida } from '../types';
import { RecordatoriosSuplementos } from './RecordatoriosSuplementos';
import { ImpactoEjercicio } from './ImpactoEjercicio';

interface VistaAgendaProps {
  dieta: Dieta;
  onComidaClick?: (comida: Comida) => void;
  onComidaEdit?: (comida: Comida) => void;
  onComidaDuplicate?: (comida: Comida) => void;
}

const diasSemana = [
  { id: 'lunes', nombre: 'Lunes' },
  { id: 'martes', nombre: 'Martes' },
  { id: 'miercoles', nombre: 'Miércoles' },
  { id: 'jueves', nombre: 'Jueves' },
  { id: 'viernes', nombre: 'Viernes' },
  { id: 'sabado', nombre: 'Sábado' },
  { id: 'domingo', nombre: 'Domingo' },
];

const bloquesComida = [
  { id: 'desayuno' as TipoComida, nombre: 'Desayuno', icono: <ChefHat className="w-4 h-4 text-amber-500" />, horario: '08:00' },
  { id: 'media-manana' as TipoComida, nombre: 'Snack mañana', icono: <Clock className="w-4 h-4 text-sky-500" />, horario: '11:00' },
  { id: 'almuerzo' as TipoComida, nombre: 'Comida', icono: <UtensilsCrossed className="w-4 h-4 text-emerald-500" />, horario: '14:00' },
  { id: 'merienda' as TipoComida, nombre: 'Snack tarde', icono: <Apple className="w-4 h-4 text-rose-500" />, horario: '17:00' },
  { id: 'cena' as TipoComida, nombre: 'Cena', icono: <Flame className="w-4 h-4 text-indigo-500" />, horario: '20:00' },
  { id: 'post-entreno' as TipoComida, nombre: 'Post-entreno', icono: <TrendingUp className="w-4 h-4 text-purple-500" />, horario: 'Variable' },
];

export const VistaAgenda: React.FC<VistaAgendaProps> = ({
  dieta,
  onComidaClick,
  onComidaEdit,
  onComidaDuplicate,
}) => {
  const [diasExpandidos, setDiasExpandidos] = useState<Set<string>>(new Set(['lunes'])); // Por defecto, lunes expandido
  const [comidasExpandidas, setComidasExpandidas] = useState<Set<string>>(new Set());

  // Organizar comidas por día y tipo
  const comidasPorDiaYTipo = useMemo(() => {
    const resultado: Record<string, Record<TipoComida, Comida[]>> = {};
    
    diasSemana.forEach((dia) => {
      resultado[dia.id] = {} as Record<TipoComida, Comida[]>;
      bloquesComida.forEach((bloque) => {
        resultado[dia.id][bloque.id] = [];
      });
    });

    // Por ahora, asignamos las comidas a días según su tipo
    // En producción, esto vendría de la estructura de datos de la dieta
    dieta.comidas.forEach((comida) => {
      // Por defecto, asignamos las comidas al primer día disponible
      const dia = diasSemana[0].id;
      if (resultado[dia] && resultado[dia][comida.tipo]) {
        resultado[dia][comida.tipo].push(comida);
      }
    });

    return resultado;
  }, [dieta.comidas]);

  // Toggle expandir/colapsar día
  const toggleDia = (diaId: string) => {
    setDiasExpandidos((prev) => {
      const nuevo = new Set(prev);
      if (nuevo.has(diaId)) {
        nuevo.delete(diaId);
      } else {
        nuevo.add(diaId);
      }
      return nuevo;
    });
  };

  // Toggle expandir/colapsar comidas de un tipo
  const toggleComidas = (diaId: string, tipoComida: TipoComida) => {
    const key = `${diaId}-${tipoComida}`;
    setComidasExpandidas((prev) => {
      const nuevo = new Set(prev);
      if (nuevo.has(key)) {
        nuevo.delete(key);
      } else {
        nuevo.add(key);
      }
      return nuevo;
    });
  };

  // Expandir/colapsar todos los días
  const toggleTodosLosDias = () => {
    if (diasExpandidos.size === diasSemana.length) {
      setDiasExpandidos(new Set());
    } else {
      setDiasExpandidos(new Set(diasSemana.map((d) => d.id)));
    }
  };

  // Calcular totales por día
  const calcularTotalesDia = (diaId: string) => {
    const comidas = comidasPorDiaYTipo[diaId] || {};
    let totalCalorias = 0;
    let totalProteinas = 0;
    let totalCarbohidratos = 0;
    let totalGrasas = 0;

    Object.values(comidas).forEach((comidasTipo) => {
      comidasTipo.forEach((comida) => {
        totalCalorias += comida.calorias;
        totalProteinas += comida.proteinas;
        totalCarbohidratos += comida.carbohidratos;
        totalGrasas += comida.grasas;
      });
    });

    return { totalCalorias, totalProteinas, totalCarbohidratos, totalGrasas };
  };

  // Renderizar comidas de un tipo
  const renderComidas = (diaId: string, tipoComida: TipoComida, comidas: Comida[]) => {
    if (comidas.length === 0) {
      return (
        <div className="text-sm text-gray-500 py-2 px-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
          Sin comidas asignadas
        </div>
      );
    }

    const key = `${diaId}-${tipoComida}`;
    const expandido = comidasExpandidas.has(key);

    return (
      <div className="space-y-2">
        <button
          onClick={() => toggleComidas(diaId, tipoComida)}
          className="flex items-center justify-between w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2">
            {expandido ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
            <span className="text-sm font-medium text-gray-700">
              {comidas.length} {comidas.length === 1 ? 'comida' : 'comidas'}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {comidas.reduce((acc, c) => acc + c.calorias, 0)} kcal
          </div>
        </button>
        
        {expandido && (
          <div className="space-y-2 pl-6">
            {comidas.map((comida) => (
              <div key={comida.id}>
                <Card
                  className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3 p-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm font-semibold text-gray-900">{comida.nombre}</h4>
                        {comida.horario && (
                          <Badge className="bg-blue-50 text-blue-600 text-xs py-0.5 px-2">
                            {comida.horario}
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs text-gray-600 mb-2">
                        <div>
                          <span className="font-medium">Kcal:</span> {comida.calorias}
                        </div>
                        <div>
                          <span className="font-medium">P:</span> {comida.proteinas}g
                        </div>
                        <div>
                          <span className="font-medium">H:</span> {comida.carbohidratos}g
                        </div>
                        <div>
                          <span className="font-medium">G:</span> {comida.grasas}g
                        </div>
                      </div>
                      {comida.notas && (
                        <p className="text-xs text-gray-500">{comida.notas}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {onComidaEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onComidaEdit(comida)}
                          className="h-7 w-7 p-0"
                          title="Editar comida"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                      {onComidaDuplicate && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onComidaDuplicate(comida)}
                          className="h-7 w-7 p-0"
                          title="Duplicar comida"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
                {dieta.recordatorios && dieta.recordatorios.length > 0 && (
                  <div className="mt-2 ml-2">
                    <RecordatoriosSuplementos
                      recordatorios={dieta.recordatorios}
                      tipoComida={tipoComida}
                      comidaId={comida.id}
                      dia={diaId}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Renderizar día
  const renderDia = (dia: typeof diasSemana[0]) => {
    const expandido = diasExpandidos.has(dia.id);
    const comidas = comidasPorDiaYTipo[dia.id] || {};
    const totales = calcularTotalesDia(dia.id);
    const totalComidas = Object.values(comidas).reduce((acc, comidasTipo) => acc + comidasTipo.length, 0);

    return (
      <Card
        key={dia.id}
        className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
      >
        <button
          onClick={() => toggleDia(dia.id)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-t-lg transition-colors"
        >
          <div className="flex items-center gap-3">
            {expandido ? (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            )}
            <div className="text-left">
              <h3 className="text-base font-semibold text-gray-900">{dia.nombre}</h3>
              <p className="text-xs text-gray-500">
                {totalComidas} {totalComidas === 1 ? 'comida' : 'comidas'} · {totales.totalCalorias} kcal
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="text-right">
              <div className="font-semibold text-gray-900">{totales.totalCalorias} / {dieta.macros.calorias} kcal</div>
              <div className="text-xs text-gray-500">
                P: {totales.totalProteinas}g · H: {totales.totalCarbohidratos}g · G: {totales.totalGrasas}g
              </div>
            </div>
          </div>
        </button>

        {expandido && (
          <div className="p-4 pt-2 space-y-4 border-t border-gray-200">
            {bloquesComida.map((bloque) => {
              const comidasDelTipo = comidas[bloque.id] || [];
              if (comidasDelTipo.length === 0 && totalComidas === 0) {
                // Solo mostrar bloques vacíos si no hay comidas en ningún bloque
                return null;
              }

              return (
                <div key={bloque.id} className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    {bloque.icono}
                    <h4 className="text-sm font-semibold text-gray-700">{bloque.nombre}</h4>
                    <Badge className="bg-gray-100 text-gray-600 text-xs py-0.5 px-2">
                      {bloque.horario}
                    </Badge>
                  </div>
                  {renderComidas(dia.id, bloque.id, comidasDelTipo)}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header con controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">Vista Agenda</h2>
          <Badge className="bg-blue-50 text-blue-600">
            {dieta.macros.calorias} kcal objetivo
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTodosLosDias}
          className="text-xs"
        >
          {diasExpandidos.size === diasSemana.length ? 'Colapsar todo' : 'Expandir todo'}
        </Button>
      </div>

      {/* Lista de días */}
      <div className="space-y-3">
        {diasSemana.map(renderDia)}
      </div>

      {/* Resumen semanal */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Resumen Semanal</h3>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-xs text-gray-500 mb-1">Calorías promedio</div>
              <div className="font-semibold text-gray-900">
                {Math.round(
                  diasSemana.reduce((acc, dia) => {
                    const totales = calcularTotalesDia(dia.id);
                    return acc + totales.totalCalorias;
                  }, 0) / diasSemana.length
                )} kcal
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Proteínas promedio</div>
              <div className="font-semibold text-gray-900">
                {Math.round(
                  diasSemana.reduce((acc, dia) => {
                    const totales = calcularTotalesDia(dia.id);
                    return acc + totales.totalProteinas;
                  }, 0) / diasSemana.length
                )} g
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Carbohidratos promedio</div>
              <div className="font-semibold text-gray-900">
                {Math.round(
                  diasSemana.reduce((acc, dia) => {
                    const totales = calcularTotalesDia(dia.id);
                    return acc + totales.totalCarbohidratos;
                  }, 0) / diasSemana.length
                )} g
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Grasas promedio</div>
              <div className="font-semibold text-gray-900">
                {Math.round(
                  diasSemana.reduce((acc, dia) => {
                    const totales = calcularTotalesDia(dia.id);
                    return acc + totales.totalGrasas;
                  }, 0) / diasSemana.length
                )} g
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Impacto de ejercicio adicional */}
      {dieta.actividadesEjercicio && dieta.actividadesEjercicio.length > 0 && (
        <div className="mt-4">
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
  );
};

