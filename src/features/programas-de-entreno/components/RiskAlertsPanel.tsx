import { useState, useMemo } from 'react';
import { AlertTriangle, Zap, ChevronDown, ChevronUp, Plus, CheckCircle2, Info } from 'lucide-react';
import { Button, Badge, Card } from '../../../components/componentsreutilizables';
import type { DayPlan, DaySession } from '../types';
import { detectarRiesgos, type RiesgoDetectado } from '../utils/riskDetection';

type RiskAlertsPanelProps = {
  weeklyPlan: Record<string, DayPlan>;
  weekDays: readonly string[];
  onInsertPlan?: (day: string, sessions: DaySession[]) => void;
  onUpdateDayPlan?: (day: string, updates: Partial<DayPlan>) => void;
};

export function RiskAlertsPanel({
  weeklyPlan,
  weekDays,
  onInsertPlan,
  onUpdateDayPlan,
}: RiskAlertsPanelProps) {
  const [expandedRisks, setExpandedRisks] = useState<Set<string>>(new Set());
  const [insertedPlans, setInsertedPlans] = useState<Set<string>>(new Set());

  const riesgos = useMemo(() => {
    return detectarRiesgos(weeklyPlan, weekDays);
  }, [weeklyPlan, weekDays]);

  const toggleExpand = (riskId: string) => {
    setExpandedRisks(prev => {
      const next = new Set(prev);
      if (next.has(riskId)) {
        next.delete(riskId);
      } else {
        next.add(riskId);
      }
      return next;
    });
  };

  const handleInsertPlan = (riesgo: RiesgoDetectado, targetDay: string) => {
    if (!riesgo.planSugerido || !onInsertPlan) return;

    // Insertar las sesiones en el día objetivo
    onInsertPlan(targetDay, riesgo.planSugerido.sesiones);

    // Marcar como insertado
    setInsertedPlans(prev => new Set(prev).add(`${riesgo.id}-${targetDay}`));
  };

  const getSeverityColor = (severidad: RiesgoDetectado['severidad']) => {
    switch (severidad) {
      case 'alta':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'media':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'baja':
        return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const getSeverityIcon = (severidad: RiesgoDetectado['severidad']) => {
    switch (severidad) {
      case 'alta':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'media':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'baja':
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  if (riesgos.length === 0) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/50">
        <div className="flex items-center gap-3 p-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <div>
            <h3 className="font-semibold text-emerald-900">Sin riesgos detectados</h3>
            <p className="text-sm text-emerald-700">
              Tu plan de entrenamiento está bien balanceado. No se han detectado riesgos de lesión.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Alertas de Riesgo
          </h3>
          <Badge variant="secondary" size="sm">
            {riesgos.length}
          </Badge>
        </div>
      </div>

      {riesgos.map(riesgo => {
        const isExpanded = expandedRisks.has(riesgo.id);
        const hasPlan = !!riesgo.planSugerido;
        const diasDisponibles = weekDays.filter(day => {
          // Para riesgos de días consecutivos, sugerir el día entre ellos o el siguiente
          if (riesgo.tipo === 'consecutive_muscle_group' && riesgo.diasAfectados.length === 2) {
            const [dia1, dia2] = riesgo.diasAfectados;
            const idx1 = weekDays.indexOf(dia1 as any);
            const idx2 = weekDays.indexOf(dia2 as any);
            if (idx1 !== -1 && idx2 !== -1 && idx2 === idx1 + 1) {
              // Si son consecutivos, sugerir el día siguiente al segundo
              return day === dia2;
            }
          }
          // Para otros casos, sugerir el primer día afectado o el siguiente disponible
          return day === riesgo.diasAfectados[0] || 
                 (riesgo.diasAfectados.length > 1 && day === riesgo.diasAfectados[1]);
        });

        return (
          <Card
            key={riesgo.id}
            className={`border-l-4 ${getSeverityColor(riesgo.severidad)}`}
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  {getSeverityIcon(riesgo.severidad)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900">{riesgo.titulo}</h4>
                      <Badge 
                        variant={riesgo.severidad === 'alta' ? 'red' : riesgo.severidad === 'media' ? 'secondary' : 'green'}
                        size="xs"
                      >
                        {riesgo.severidad.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-700 mb-2">{riesgo.descripcion}</p>
                    
                    {riesgo.gruposMusculares && riesgo.gruposMusculares.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {riesgo.gruposMusculares.map(grupo => (
                          <Badge key={grupo} variant="secondary" size="xs">
                            {grupo}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="text-xs text-slate-600">Días afectados:</span>
                      {riesgo.diasAfectados.map(dia => (
                        <Badge key={dia} variant="secondary" size="xs">
                          {dia}
                        </Badge>
                      ))}
                    </div>

                    {isExpanded && (
                      <div className="mt-3 space-y-3 pt-3 border-t border-slate-200">
                        <div>
                          <p className="text-sm font-medium text-slate-900 mb-1">
                            Recomendación:
                          </p>
                          <p className="text-sm text-slate-700">{riesgo.recomendacion}</p>
                        </div>

                        {hasPlan && (
                          <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                              <Zap className="h-4 w-4 text-indigo-600" />
                              <span className="text-sm font-semibold text-slate-900">
                                Plan sugerido: {riesgo.planSugerido.nombre}
                              </span>
                            </div>
                            
                            <div className="space-y-2">
                              {riesgo.planSugerido.sesiones.map((sesion, idx) => (
                                <div
                                  key={idx}
                                  className="bg-white rounded-md p-2 border border-slate-200"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <div className="font-medium text-sm text-slate-900">
                                        {sesion.block}
                                      </div>
                                      <div className="text-xs text-slate-600 mt-1">
                                        {sesion.duration} · {sesion.modality} · {sesion.intensity}
                                      </div>
                                      {sesion.notes && (
                                        <div className="text-xs text-slate-500 mt-1">
                                          {sesion.notes}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                              {diasDisponibles.map(dia => {
                                const insertKey = `${riesgo.id}-${dia}`;
                                const isInserted = insertedPlans.has(insertKey);
                                
                                return (
                                  <Button
                                    key={dia}
                                    variant={isInserted ? 'green' : 'primary'}
                                    size="sm"
                                    leftIcon={isInserted ? <CheckCircle2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                    onClick={() => handleInsertPlan(riesgo, dia)}
                                    disabled={isInserted}
                                  >
                                    {isInserted ? 'Insertado en ' : 'Insertar en '}{dia}
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleExpand(riesgo.id)}
                  className="flex-shrink-0 text-slate-500 hover:text-slate-700"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

