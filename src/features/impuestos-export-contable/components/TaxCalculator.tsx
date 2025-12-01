import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Input, Tooltip } from '../../../components/componentsreutilizables';
import { PerfilFiscal, ParametrosCalculoImpuestos, ResumenFiscalAnual, TramoIRPF } from '../api/types';
import { calcularImpuestos, getPerfilFiscal } from '../api/api';
import { calcularIRPF } from '../utils/taxCalculator';
import { Calculator, Info, TrendingDown, DollarSign, AlertCircle, RefreshCw, Calendar } from 'lucide-react';

interface TaxCalculatorProps {
  fiscalProfile: PerfilFiscal | null;
  isLoading?: boolean;
}

// Tramos IRPF estándar para España (2024)
const TRAMOS_IRPF_ESTANDAR: TramoIRPF[] = [
  { desde: 0, hasta: 12450, porcentaje: 19 },
  { desde: 12450, hasta: 20200, porcentaje: 24 },
  { desde: 20200, hasta: 35200, porcentaje: 30 },
  { desde: 35200, hasta: 60000, porcentaje: 37 },
  { desde: 60000, porcentaje: 45 }
];

export const TaxCalculator: React.FC<TaxCalculatorProps> = ({
  fiscalProfile,
  isLoading = false
}) => {
  const currentYear = new Date().getFullYear();
  const currentQuarter = Math.floor((new Date().getMonth() + 3) / 3);

  // Estado del formulario
  const [anio, setAnio] = useState<number>(currentYear);
  const [trimestre, setTrimestre] = useState<number | undefined>(currentQuarter);
  const [ingresos, setIngresos] = useState<number>(0);
  const [gastos, setGastos] = useState<number>(0);
  const [usarPerfilFiscal, setUsarPerfilFiscal] = useState<boolean>(true);

  // Estado del perfil fiscal local (para cuando no se usa el prop)
  const [perfilFiscalLocal, setPerfilFiscalLocal] = useState<PerfilFiscal | null>(null);
  const [loadingPerfil, setLoadingPerfil] = useState<boolean>(false);

  // Estado de cálculo
  const [resultado, setResultado] = useState<ResumenFiscalAnual | null>(null);
  const [calculando, setCalculando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar perfil fiscal si no se proporciona
  useEffect(() => {
    if (!fiscalProfile && usarPerfilFiscal) {
      setLoadingPerfil(true);
      getPerfilFiscal()
        .then(perfil => {
          setPerfilFiscalLocal(perfil);
        })
        .catch(err => {
          console.error('Error loading fiscal profile:', err);
          setError('Error al cargar el perfil fiscal');
        })
        .finally(() => {
          setLoadingPerfil(false);
        });
    }
  }, [fiscalProfile, usarPerfilFiscal]);

  // Perfil fiscal a usar (prop o local)
  const perfilFiscalActivo = fiscalProfile || perfilFiscalLocal;

  // Obtener porcentaje de IVA según tipo
  const obtenerPorcentajeIVA = (tipoIVA: string): number => {
    switch (tipoIVA) {
      case 'general': return 21;
      case 'reducido': return 10;
      case 'superreducido': return 4;
      default: return 0;
    }
  };

  // Calcular impuestos
  const handleCalcular = async () => {
    if (!perfilFiscalActivo) {
      setError('Por favor, configura tu perfil fiscal primero');
      return;
    }

    if (ingresos < 0 || gastos < 0) {
      setError('Los ingresos y gastos deben ser valores positivos');
      return;
    }

    setCalculando(true);
    setError(null);

    try {
      const parametros: ParametrosCalculoImpuestos = {
        anio,
        trimestreOpcional: trimestre,
        ingresos,
        gastos,
        regimen: perfilFiscalActivo.regimenFiscal,
        tipoIVA: perfilFiscalActivo.tipoIVA,
        tramosIRPF: TRAMOS_IRPF_ESTANDAR
      };

      const resultadoCalculo = await calcularImpuestos(parametros);
      setResultado(resultadoCalculo);
    } catch (err: any) {
      console.error('Error calculating taxes:', err);
      setError(err.message || 'Error al calcular los impuestos');
    } finally {
      setCalculando(false);
    }
  };

  // Calcular detalle por tramos IRPF
  const detalleTramosIRPF = useMemo(() => {
    if (!resultado) return null;

    const baseImponible = resultado.baseImponible;
    const tramosOrdenados = [...TRAMOS_IRPF_ESTANDAR].sort((a, b) => a.desde - b.desde);
    const detalle: Array<{
      tramo: string;
      base: number;
      porcentaje: number;
      impuesto: number;
    }> = [];

    let baseRestante = baseImponible;

    for (let i = 0; i < tramosOrdenados.length && baseRestante > 0; i++) {
      const tramo = tramosOrdenados[i];
      
      if (baseImponible > tramo.desde) {
        const limiteInferior = tramo.desde;
        const limiteSuperior = tramo.hasta !== undefined 
          ? Math.min(tramo.hasta, baseImponible)
          : baseImponible;
        
        const baseEnTramo = limiteSuperior - limiteInferior;
        
        if (baseEnTramo > 0) {
          const impuestoTramo = (baseEnTramo * tramo.porcentaje) / 100;
          
          detalle.push({
            tramo: tramo.hasta !== undefined 
              ? `${formatearMoneda(limiteInferior)} - ${formatearMoneda(limiteSuperior)}`
              : `Más de ${formatearMoneda(limiteInferior)}`,
            base: baseEnTramo,
            porcentaje: tramo.porcentaje,
            impuesto: impuestoTramo
          });
          
          baseRestante -= baseEnTramo;
        }
      }
    }

    return detalle;
  }, [resultado]);

  // Calcular IVA neto
  const ivaNeto = useMemo(() => {
    if (!resultado) return null;
    return resultado.ivaRepercutido - resultado.ivaSoportado;
  }, [resultado]);

  // Calcular cuota trimestral estimada
  const cuotaTrimestral = useMemo(() => {
    if (!resultado) return null;
    // Estimación: dividir el IRPF anual entre 4 trimestres
    return {
      irpf: resultado.irpfEstimado / 4,
      iva: ivaNeto !== null ? ivaNeto / 4 : 0,
      total: (resultado.irpfEstimado / 4) + (ivaNeto !== null ? ivaNeto / 4 : 0)
    };
  }, [resultado, ivaNeto]);

  // Formatear moneda
  const formatearMoneda = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Cargar datos del perfil fiscal en el formulario
  const handleCargarPerfilFiscal = () => {
    if (perfilFiscalActivo) {
      // Los datos del perfil fiscal ya están cargados, solo mostramos un mensaje
      // En una implementación real, podrías cargar ingresos/gastos históricos aquí
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <Calculator size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Calculadora de Impuestos
              </h3>
              <p className="text-sm text-gray-600">
                Calcula tus impuestos estimados (IRPF e IVA) para un período específico
              </p>
            </div>
          </div>
        </div>

        {/* Formulario de entrada */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Año
            </label>
            <Input
              type="number"
              value={anio}
              onChange={(e) => setAnio(parseInt(e.target.value) || currentYear)}
              min="2020"
              max={currentYear + 1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <span>Trimestre (Opcional)</span>
              <Tooltip content="Selecciona el trimestre si quieres calcular para un período específico. Déjalo vacío para cálculo anual.">
                <Info size={14} className="text-gray-400 hover:text-gray-600 cursor-help" />
              </Tooltip>
            </label>
            <select
              value={trimestre || ''}
              onChange={(e) => setTrimestre(e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
            >
              <option value="">Anual</option>
              <option value="1">1T (Enero - Marzo)</option>
              <option value="2">2T (Abril - Junio)</option>
              <option value="3">3T (Julio - Septiembre)</option>
              <option value="4">4T (Octubre - Diciembre)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <span>Ingresos (€)</span>
              <Tooltip content="Total de ingresos brutos del período (antes de impuestos y gastos).">
                <Info size={14} className="text-gray-400 hover:text-gray-600 cursor-help" />
              </Tooltip>
            </label>
            <Input
              type="number"
              value={ingresos || ''}
              onChange={(e) => setIngresos(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <span>Gastos Deducibles (€)</span>
              <Tooltip content="Total de gastos deducibles del período (gastos que puedes descontar de tus ingresos para calcular la base imponible).">
                <Info size={14} className="text-gray-400 hover:text-gray-600 cursor-help" />
              </Tooltip>
            </label>
            <Input
              type="number"
              value={gastos || ''}
              onChange={(e) => setGastos(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Información del perfil fiscal */}
        {perfilFiscalActivo && (
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-3">
              <Info size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Perfil Fiscal Activo:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Régimen: <strong>{perfilFiscalActivo.regimenFiscal}</strong></li>
                  <li>• Tipo de Actividad: <strong>{perfilFiscalActivo.tipoActividad}</strong></li>
                  <li>• Tipo de IVA: <strong>{perfilFiscalActivo.tipoIVA}</strong> ({obtenerPorcentajeIVA(perfilFiscalActivo.tipoIVA)}%)</li>
                  <li>• Retención IRPF: <strong>{perfilFiscalActivo.retencionIRPF}%</strong></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {!perfilFiscalActivo && !loadingPerfil && (
          <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-900">
                <p className="font-semibold mb-1">Perfil Fiscal no disponible</p>
                <p className="text-xs">Por favor, configura tu perfil fiscal antes de calcular impuestos.</p>
              </div>
            </div>
          </div>
        )}

        {/* Botón Calcular */}
        <div className="mt-6 flex justify-end">
          <Button
            variant="primary"
            onClick={handleCalcular}
            loading={calculando}
            disabled={calculando || !perfilFiscalActivo || ingresos <= 0}
          >
            <Calculator size={20} className="mr-2" />
            Calcular Impuestos
          </Button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-900">{error}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Resultados */}
      {resultado && (
        <div className="space-y-6">
          {/* Resumen Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign size={20} className="text-blue-600" />
                Resumen de Impuestos
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">IRPF Estimado:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatearMoneda(resultado.irpfEstimado)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">IVA Neto:</span>
                  <span className="text-xl font-semibold text-gray-900">
                    {ivaNeto !== null && ivaNeto >= 0 
                      ? formatearMoneda(ivaNeto)
                      : `Devolución: ${formatearMoneda(Math.abs(ivaNeto || 0))}`
                    }
                  </span>
                </div>
                <div className="border-t border-blue-200 pt-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total Impuestos:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatearMoneda(resultado.irpfEstimado + (ivaNeto !== null && ivaNeto > 0 ? ivaNeto : 0))}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-green-600" />
                Cuota Trimestral Estimada
              </h4>
              {cuotaTrimestral && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">IRPF Trimestral:</span>
                    <span className="font-medium text-gray-900">
                      {formatearMoneda(cuotaTrimestral.irpf)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">IVA Trimestral:</span>
                    <span className="font-medium text-gray-900">
                      {cuotaTrimestral.iva >= 0 
                        ? formatearMoneda(cuotaTrimestral.iva)
                        : `Devolución: ${formatearMoneda(Math.abs(cuotaTrimestral.iva))}`
                      }
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Total Trimestral:</span>
                    <span className="font-bold text-gray-900">
                      {formatearMoneda(cuotaTrimestral.total)}
                    </span>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Desglose de IVA */}
          <Card className="p-6 bg-white shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-green-600" />
              Desglose de IVA
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">IVA Repercutido</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatearMoneda(resultado.ivaRepercutido)}
                </p>
                <p className="text-xs text-gray-500 mt-1">IVA cobrado a clientes</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">IVA Soportado</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatearMoneda(resultado.ivaSoportado)}
                </p>
                <p className="text-xs text-gray-500 mt-1">IVA deducible de gastos</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">IVA Neto</p>
                <p className={`text-lg font-bold ${ivaNeto !== null && ivaNeto >= 0 ? 'text-gray-900' : 'text-green-600'}`}>
                  {ivaNeto !== null && ivaNeto >= 0 
                    ? formatearMoneda(ivaNeto)
                    : `Devolución: ${formatearMoneda(Math.abs(ivaNeto))}`
                  }
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {ivaNeto !== null && ivaNeto >= 0 ? 'A pagar' : 'A devolver'}
                </p>
              </div>
            </div>
          </Card>

          {/* Desglose por Tramos IRPF */}
          {detalleTramosIRPF && detalleTramosIRPF.length > 0 && (
            <Card className="p-6 bg-white shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingDown size={20} className="text-orange-600" />
                Desglose por Tramos IRPF
              </h4>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  Base Imponible: <strong className="text-gray-900">{formatearMoneda(resultado.baseImponible)}</strong>
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-gray-700">Tramo</th>
                        <th className="text-right py-2 text-gray-700">Base en Tramo</th>
                        <th className="text-right py-2 text-gray-700">% IRPF</th>
                        <th className="text-right py-2 text-gray-700">Impuesto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detalleTramosIRPF.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-2 text-gray-900">{item.tramo}</td>
                          <td className="text-right py-2 text-gray-700">{formatearMoneda(item.base)}</td>
                          <td className="text-right py-2 text-gray-700">{item.porcentaje}%</td>
                          <td className="text-right py-2 font-semibold text-gray-900">{formatearMoneda(item.impuesto)}</td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-gray-300 font-semibold">
                        <td className="py-2 text-gray-900">Total IRPF</td>
                        <td className="text-right py-2 text-gray-700">{formatearMoneda(resultado.baseImponible)}</td>
                        <td className="text-right py-2 text-gray-700">—</td>
                        <td className="text-right py-2 text-gray-900">{formatearMoneda(resultado.irpfEstimado)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          )}

          {/* Resumen Anual Estimado */}
          <Card className="p-6 bg-white shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Resumen Anual Estimado
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ingresos Totales:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatearMoneda(resultado.ingresosTotales)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Gastos Totales:</span>
                  <span className="text-sm font-medium text-red-600">
                    -{formatearMoneda(resultado.gastosTotales)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="text-sm font-medium text-gray-700">Base Imponible:</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatearMoneda(resultado.baseImponible)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">IRPF Estimado:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatearMoneda(resultado.irpfEstimado)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">IVA Neto:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {ivaNeto !== null && ivaNeto >= 0 
                      ? formatearMoneda(ivaNeto)
                      : `Devolución: ${formatearMoneda(Math.abs(ivaNeto || 0))}`
                    }
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="text-sm font-medium text-gray-700">Beneficio Neto:</span>
                  <span className="text-sm font-bold text-green-600">
                    {formatearMoneda(resultado.beneficio)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Mensaje de Aviso */}
          <Card className="p-6 bg-amber-50 border border-amber-200 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-2">⚠️ Importante: Esto no sustituye al consejo de tu asesor</p>
                <p className="mb-2">
                  Los cálculos mostrados son <strong>estimaciones</strong> basadas en los datos proporcionados y 
                  el perfil fiscal configurado. Los valores reales pueden variar según:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs mb-2">
                  <li>Deducciones específicas aplicables a tu caso</li>
                  <li>Normativa fiscal vigente del período</li>
                  <li>Cambios en la legislación fiscal</li>
                  <li>Circunstancias particulares de tu actividad</li>
                </ul>
                <p className="text-xs italic">
                  Te recomendamos consultar con un gestor o asesor fiscal para una estimación más precisa 
                  y para asegurarte de cumplir con todas tus obligaciones fiscales.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
