import React, { useState, useEffect } from 'react';
import { Objective, EconomicImpact, OperationalImpact } from '../types';
import { getEconomicImpact, calculateEconomicImpact, getOperationalImpact, calculateOperationalImpact } from '../api/economicImpact';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { DollarSign, TrendingUp, TrendingDown, Users, Clock, Calculator, RefreshCw, Loader2, BarChart3, Target, Zap, CheckCircle2 } from 'lucide-react';

interface EconomicImpactViewProps {
  objective: Objective;
  onClose?: () => void;
}

export const EconomicImpactView: React.FC<EconomicImpactViewProps> = ({ objective, onClose }) => {
  const [economicImpact, setEconomicImpact] = useState<EconomicImpact | null>(null);
  const [operationalImpact, setOperationalImpact] = useState<OperationalImpact | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    loadImpacts();
  }, [objective.id]);

  const loadImpacts = async () => {
    setLoading(true);
    try {
      const [economic, operational] = await Promise.all([
        getEconomicImpact(objective.id),
        getOperationalImpact(objective.id),
      ]);

      setEconomicImpact(economic);
      setOperationalImpact(operational);
    } catch (error) {
      console.error('Error loading impacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    setCalculating(true);
    try {
      const [economic, operational] = await Promise.all([
        calculateEconomicImpact(objective),
        calculateOperationalImpact(objective),
      ]);

      setEconomicImpact(economic);
      setOperationalImpact(operational);
    } catch (error) {
      console.error('Error calculating impacts:', error);
    } finally {
      setCalculating(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </Card>
    );
  }

  if (!economicImpact && !operationalImpact) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Impacto no calculado
          </h3>
          <p className="text-gray-600 mb-4">
            Calcula el impacto económico y operativo de este objetivo para justificar inversiones.
          </p>
          <Button onClick={handleCalculate} disabled={calculating}>
            {calculating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Calculando...
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4 mr-2" />
                Calcular Impacto
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Impacto del Objetivo</h2>
          <p className="text-gray-600 mt-1">{objective.title}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCalculate} disabled={calculating}>
            {calculating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Calculando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Recalcular
              </>
            )}
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          )}
        </div>
      </div>

      {/* Impacto Económico */}
      {economicImpact && (
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Impacto Económico</h3>
              <p className="text-sm text-gray-600">
                Período: {new Date(economicImpact.analysisPeriod.startDate).toLocaleDateString()} - {new Date(economicImpact.analysisPeriod.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Inversión */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Inversión</span>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {economicImpact.investment.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </p>
              {economicImpact.investmentBreakdown && (
                <div className="mt-3 space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Recursos:</span>
                    <span>{economicImpact.investmentBreakdown.resources?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Herramientas:</span>
                    <span>{economicImpact.investmentBreakdown.tools?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marketing:</span>
                    <span>{economicImpact.investmentBreakdown.marketing?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Ingresos Incrementales */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Ingresos Incrementales</span>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {economicImpact.incrementalRevenue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </p>
              {economicImpact.revenueBreakdown && (
                <div className="mt-3 space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Nuevos clientes:</span>
                    <span>{economicImpact.revenueBreakdown.newCustomers?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Upsells:</span>
                    <span>{economicImpact.revenueBreakdown.upsells?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retención:</span>
                    <span>{economicImpact.revenueBreakdown.retention?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                </div>
              )}
            </div>

            {/* ROI */}
            <div className={`rounded-lg p-4 ${economicImpact.roi >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">ROI</span>
                {economicImpact.roi >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </div>
              <p className={`text-2xl font-bold ${economicImpact.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {economicImpact.roi.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {economicImpact.roiAmount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </p>
            </div>

            {/* Período de Recuperación */}
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Recuperación</span>
                <Clock className="h-4 w-4 text-purple-600" />
              </div>
              {economicImpact.paybackPeriod ? (
                <>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(economicImpact.paybackPeriod)} días
                  </p>
                  {economicImpact.breakevenDate && (
                    <p className="text-xs text-gray-600 mt-1">
                      Equilibrio: {new Date(economicImpact.breakevenDate).toLocaleDateString()}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-600">No calculado</p>
              )}
            </div>
          </div>

          {/* Proyecciones */}
          {economicImpact.projectedRevenue && (
            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold text-gray-900 mb-3">Proyecciones</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Ingresos Proyectados:</span>
                  <p className="text-lg font-semibold text-gray-900">
                    {economicImpact.projectedRevenue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">ROI Proyectado:</span>
                  <p className="text-lg font-semibold text-gray-900">
                    {economicImpact.projectedROI?.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Incremento vs Línea Base */}
          {economicImpact.revenueLift !== undefined && (
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Incremento vs Línea Base:</span>
                <Badge variant={economicImpact.revenueLift >= 0 ? 'green' : 'red'}>
                  {economicImpact.revenueLift >= 0 ? '+' : ''}{economicImpact.revenueLift.toFixed(1)}%
                </Badge>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Impacto Operativo */}
      {operationalImpact && (
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Impacto Operativo</h3>
              <p className="text-sm text-gray-600">
                Período: {new Date(operationalImpact.analysisPeriod.startDate).toLocaleDateString()} - {new Date(operationalImpact.analysisPeriod.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Clientes Retenidos */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Clientes Retenidos</span>
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {operationalImpact.retainedCustomers}
              </p>
              {operationalImpact.retentionRate !== undefined && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Tasa de retención:</span>
                    <span>{operationalImpact.retentionRate.toFixed(1)}%</span>
                  </div>
                  {operationalImpact.retentionLift !== undefined && (
                    <Badge variant="green" className="text-xs">
                      +{operationalImpact.retentionLift.toFixed(1)}% vs línea base
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Eficiencia */}
            {operationalImpact.efficiencyGains && (
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Ganancias de Eficiencia</span>
                  <Zap className="h-4 w-4 text-purple-600" />
                </div>
                <div className="space-y-2">
                  {operationalImpact.efficiencyGains.timeSaved !== undefined && (
                    <div>
                      <span className="text-xs text-gray-600">Tiempo ahorrado:</span>
                      <p className="text-lg font-semibold text-gray-900">
                        {operationalImpact.efficiencyGains.timeSaved} horas
                      </p>
                    </div>
                  )}
                  {operationalImpact.efficiencyGains.costReduction !== undefined && (
                    <div>
                      <span className="text-xs text-gray-600">Reducción de costos:</span>
                      <p className="text-lg font-semibold text-gray-900">
                        {operationalImpact.efficiencyGains.costReduction.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </p>
                    </div>
                  )}
                  {operationalImpact.efficiencyGains.productivityIncrease !== undefined && (
                    <div>
                      <span className="text-xs text-gray-600">Incremento productividad:</span>
                      <p className="text-lg font-semibold text-gray-900">
                        +{operationalImpact.efficiencyGains.productivityIncrease}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Satisfacción */}
            {operationalImpact.satisfactionImpact && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Satisfacción</span>
                  <CheckCircle2 className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="space-y-2">
                  {operationalImpact.satisfactionImpact.customerSatisfaction !== undefined && (
                    <div>
                      <span className="text-xs text-gray-600">Cliente:</span>
                      <p className="text-lg font-semibold text-gray-900">
                        {operationalImpact.satisfactionImpact.customerSatisfaction.toFixed(1)}/100
                      </p>
                    </div>
                  )}
                  {operationalImpact.satisfactionImpact.employeeSatisfaction !== undefined && (
                    <div>
                      <span className="text-xs text-gray-600">Equipo:</span>
                      <p className="text-lg font-semibold text-gray-900">
                        {operationalImpact.satisfactionImpact.employeeSatisfaction.toFixed(1)}/100
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Métricas Operativas */}
          {operationalImpact.operationalMetrics && operationalImpact.operationalMetrics.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold text-gray-900 mb-3">Métricas Operativas</h4>
              <div className="space-y-3">
                {operationalImpact.operationalMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{metric.metricName}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-600">
                          {metric.baselineValue} {metric.unit} → {metric.currentValue} {metric.unit}
                        </span>
                      </div>
                    </div>
                    <Badge variant={metric.improvement >= 0 ? 'green' : 'red'}>
                      {metric.improvement >= 0 ? '+' : ''}{metric.improvement.toFixed(1)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

