/**
 * Componente para mostrar resúmenes dinámicos con comparación de semanas anteriores
 * User Story: Como coach quiero ver resúmenes dinámicos (tendencias de volumen, intensidad, adherencia, calorías) 
 * con comparación respecto a semanas anteriores, para detectar cambios significativos.
 */

import { useEffect, useState } from 'react';
import { Card } from '../../../components/componentsreutilizables/Card';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { Select } from '../../../components/componentsreutilizables/Select';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Activity,
  Target,
  Flame,
  AlertTriangle,
  Calendar,
  User,
} from 'lucide-react';
import * as resumenesApi from '../api/resumenes-dinamicos';
import type { ResumenDinamico, ComparacionSemanal } from '../api/resumenes-dinamicos';
import * as contextoApi from '../api/contexto-cliente';

export function ResumenesDinamicos() {
  const [clientes, setClientes] = useState<Array<{ id: string; nombre: string }>>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>('');
  const [resumen, setResumen] = useState<ResumenDinamico | null>(null);
  const [loading, setLoading] = useState(false);
  const [comparacionSeleccionada, setComparacionSeleccionada] = useState<number>(0);

  useEffect(() => {
    loadClientes();
  }, []);

  useEffect(() => {
    if (clienteSeleccionado) {
      loadResumen();
    }
  }, [clienteSeleccionado]);

  const loadClientes = async () => {
    try {
      const clientesData = await contextoApi.getClientes();
      setClientes(clientesData);
      if (clientesData.length > 0 && !clienteSeleccionado) {
        setClienteSeleccionado(clientesData[0].id);
      }
    } catch (error) {
      console.error('Error loading clientes:', error);
    }
  };

  const loadResumen = async () => {
    if (!clienteSeleccionado) return;
    
    setLoading(true);
    try {
      const resumenData = await resumenesApi.getResumenDinamico(clienteSeleccionado);
      setResumen(resumenData);
      // Seleccionar la última comparación por defecto
      if (resumenData.comparaciones.length > 0) {
        setComparacionSeleccionada(resumenData.comparaciones.length - 1);
      }
    } catch (error) {
      console.error('Error loading resumen:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCambio = (valor: number, porcentaje: number, significativo: boolean) => {
    const isPositive = valor > 0;
    const isNegative = valor < 0;
    const isNeutral = valor === 0;

    return (
      <div className="flex items-center gap-2">
        {isPositive && <TrendingUp className="w-4 h-4 text-green-600" />}
        {isNegative && <TrendingDown className="w-4 h-4 text-red-600" />}
        {isNeutral && <Minus className="w-4 h-4 text-gray-400" />}
        <span
          className={`font-medium ${
            isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
          }`}
        >
          {isPositive ? '+' : ''}
          {porcentaje.toFixed(1)}%
        </span>
        {significativo && (
          <Badge variant="outline" className="text-xs">
            Significativo
          </Badge>
        )}
      </div>
    );
  };

  const renderMetrica = (
    titulo: string,
    valorActual: number,
    valorAnterior: number,
    unidad: string,
    cambio: ComparacionSemanal['cambios'][keyof ComparacionSemanal['cambios']],
    icon: React.ReactNode
  ) => {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-semibold text-gray-900">{titulo}</h3>
          </div>
          {renderCambio(cambio.valor, cambio.porcentaje, cambio.significativo)}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">Semana actual</div>
            <div className="text-2xl font-bold text-gray-900">
              {valorActual.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
              <span className="text-sm font-normal text-gray-600 ml-1">{unidad}</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Semana anterior</div>
            <div className="text-xl font-semibold text-gray-600">
              {valorAnterior.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
              <span className="text-sm font-normal text-gray-500 ml-1">{unidad}</span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-500">Cargando resúmenes dinámicos...</div>
      </Card>
    );
  }

  if (!resumen) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-500">Selecciona un cliente para ver los resúmenes dinámicos</div>
      </Card>
    );
  }

  const comparacionActual = resumen.comparaciones[comparacionSeleccionada];

  return (
    <div className="space-y-6">
      {/* Header con selector */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <Select
              label="Cliente"
              value={clienteSeleccionado}
              onChange={(v) => setClienteSeleccionado(v)}
              options={clientes.map((c) => ({ label: c.nombre, value: c.id }))}
            />
          </div>
          {resumen.comparaciones.length > 0 && (
            <div className="flex-1">
              <Select
                label="Comparación"
                value={comparacionSeleccionada.toString()}
                onChange={(v) => setComparacionSeleccionada(parseInt(v, 10))}
                options={resumen.comparaciones.map((comp, idx) => ({
                  label: `${comp.semanaActual.semana} vs ${comp.semanaAnterior.semana}`,
                  value: idx.toString(),
                }))}
              />
            </div>
          )}
        </div>

        {/* Indicador de tendencia general */}
        {comparacionActual && (
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              {comparacionActual.tendencia === 'mejorando' && (
                <TrendingUp className="w-5 h-5 text-green-600" />
              )}
              {comparacionActual.tendencia === 'empeorando' && (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
              {comparacionActual.tendencia === 'estable' && (
                <Minus className="w-5 h-5 text-gray-600" />
              )}
              <span className="font-semibold text-gray-900">
                Tendencia general: {comparacionActual.tendencia === 'mejorando' ? 'Mejorando' : comparacionActual.tendencia === 'empeorando' ? 'Empeorando' : 'Estable'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {new Date(comparacionActual.semanaActual.fechaInicio).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
              })}{' '}
              -{' '}
              {new Date(comparacionActual.semanaActual.fechaFin).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Alertas */}
      {resumen.alertas.length > 0 && (
        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-orange-900">Cambios significativos detectados</h3>
          </div>
          <div className="space-y-2">
            {resumen.alertas.map((alerta, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <Badge
                  variant={alerta.severidad === 'alta' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {alerta.severidad}
                </Badge>
                <span className="text-orange-800">{alerta.mensaje}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Métricas principales */}
      {comparacionActual && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderMetrica(
            'Volumen',
            comparacionActual.semanaActual.volumen,
            comparacionActual.semanaAnterior.volumen,
            'unidades',
            comparacionActual.cambios.volumen,
            <BarChart3 className="w-5 h-5 text-blue-600" />
          )}

          {renderMetrica(
            'Intensidad promedio',
            comparacionActual.semanaActual.intensidad.promedio,
            comparacionActual.semanaAnterior.intensidad.promedio,
            '/10',
            comparacionActual.cambios.intensidad,
            <Activity className="w-5 h-5 text-purple-600" />
          )}

          {renderMetrica(
            'Adherencia',
            comparacionActual.semanaActual.adherencia,
            comparacionActual.semanaAnterior.adherencia,
            '%',
            comparacionActual.cambios.adherencia,
            <Target className="w-5 h-5 text-green-600" />
          )}

          {renderMetrica(
            'Calorías',
            comparacionActual.semanaActual.calorias,
            comparacionActual.semanaAnterior.calorias,
            'kcal',
            comparacionActual.cambios.calorias,
            <Flame className="w-5 h-5 text-orange-600" />
          )}
        </div>
      )}

      {/* Distribución de intensidad */}
      {comparacionActual && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Distribución de Intensidad</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-2">Semana actual</div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Baja</span>
                    <span className="font-medium">{comparacionActual.semanaActual.intensidad.baja.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${comparacionActual.semanaActual.intensidad.baja}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Media</span>
                    <span className="font-medium">{comparacionActual.semanaActual.intensidad.media.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${comparacionActual.semanaActual.intensidad.media}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Alta</span>
                    <span className="font-medium">{comparacionActual.semanaActual.intensidad.alta.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${comparacionActual.semanaActual.intensidad.alta}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">Semana anterior</div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Baja</span>
                    <span className="font-medium">{comparacionActual.semanaAnterior.intensidad.baja.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${comparacionActual.semanaAnterior.intensidad.baja}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Media</span>
                    <span className="font-medium">{comparacionActual.semanaAnterior.intensidad.media.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${comparacionActual.semanaAnterior.intensidad.media}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Alta</span>
                    <span className="font-medium">{comparacionActual.semanaAnterior.intensidad.alta.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${comparacionActual.semanaAnterior.intensidad.alta}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Histórico de sesiones */}
      {comparacionActual && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Sesiones</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Semana actual</div>
              <div className="text-2xl font-bold text-gray-900">
                {comparacionActual.semanaActual.sesionesCompletadas} / {comparacionActual.semanaActual.sesionesProgramadas}
              </div>
              <div className="text-xs text-gray-500">sesiones completadas</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Semana anterior</div>
              <div className="text-2xl font-bold text-gray-600">
                {comparacionActual.semanaAnterior.sesionesCompletadas} / {comparacionActual.semanaAnterior.sesionesProgramadas}
              </div>
              <div className="text-xs text-gray-500">sesiones completadas</div>
            </div>
          </div>
        </Card>
      )}

      {/* Gráfico de tendencias históricas */}
      {resumen.historico.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Tendencias (últimas 8 semanas)</h3>
          <div className="space-y-4">
            {/* Volumen */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Volumen</span>
                <span className="text-gray-500">
                  {resumen.historico[resumen.historico.length - 1].volumen.toLocaleString('es-ES')} unidades
                </span>
              </div>
              <div className="flex items-end gap-1 h-32">
                {resumen.historico.map((semana, idx) => {
                  const maxVolumen = Math.max(...resumen.historico.map((s) => s.volumen));
                  const altura = (semana.volumen / maxVolumen) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                        style={{ height: `${altura}%` }}
                        title={`${semana.semana}: ${semana.volumen.toLocaleString('es-ES')}`}
                      />
                      <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-top-left whitespace-nowrap">
                        {idx + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Adherencia */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Adherencia</span>
                <span className="text-gray-500">
                  {resumen.historico[resumen.historico.length - 1].adherencia.toFixed(0)}%
                </span>
              </div>
              <div className="flex items-end gap-1 h-32">
                {resumen.historico.map((semana, idx) => {
                  const altura = semana.adherencia;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-green-500 rounded-t transition-all hover:bg-green-600"
                        style={{ height: `${altura}%` }}
                        title={`${semana.semana}: ${semana.adherencia.toFixed(0)}%`}
                      />
                      <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-top-left whitespace-nowrap">
                        {idx + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

