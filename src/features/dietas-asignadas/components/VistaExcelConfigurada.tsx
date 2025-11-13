import React, { useMemo, useState, useRef, useCallback } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { FileSpreadsheet, Download, Settings, RefreshCcw } from 'lucide-react';
import type { Dieta, ConfiguracionColumnaExcel, RespuestaCuestionarioMetodologia } from '../types';
import { ResumenAutomatico, type RangoSeleccionado, type CeldaSeleccionada } from './ResumenAutomatico';
import { AnalizadorIA } from './AnalizadorIA';
import { GestorPlantillasPersonalizadas } from './GestorPlantillasPersonalizadas';

interface VistaExcelConfiguradaProps {
  dieta: Dieta;
  configuracion: RespuestaCuestionarioMetodologia;
  onReabrirCuestionario?: () => void;
  onExportar?: () => void;
  dietistaId?: string;
  onConfiguracionCambiada?: (configuracion: RespuestaCuestionarioMetodologia) => void;
}

const diasSemana = [
  { id: 'lunes', label: 'Lunes', nombre: 'Lunes' },
  { id: 'martes', label: 'Martes', nombre: 'Martes' },
  { id: 'miercoles', label: 'Miércoles', nombre: 'Miércoles' },
  { id: 'jueves', label: 'Jueves', nombre: 'Jueves' },
  { id: 'viernes', label: 'Viernes', nombre: 'Viernes' },
  { id: 'sabado', label: 'Sábado', nombre: 'Sábado' },
  { id: 'domingo', label: 'Domingo', nombre: 'Domingo' },
];

const tiposComida = [
  { id: 'desayuno', label: 'Desayuno' },
  { id: 'media-manana', label: 'Media Mañana' },
  { id: 'almuerzo', label: 'Almuerzo' },
  { id: 'merienda', label: 'Merienda' },
  { id: 'cena', label: 'Cena' },
  { id: 'post-entreno', label: 'Post-Entreno' },
];

// Rangos de referencia para formato condicional
const RANGOS_REFERENCIA: Record<string, { min?: number; max?: number; tipo: 'exceso' | 'deficit' | 'ambos' }> = {
  sodio: { max: 2300, tipo: 'exceso' }, // mg por día (recomendación OMS)
  proteinas: { min: 0.8, tipo: 'deficit' }, // g por kg de peso (mínimo recomendado)
  'ratio-proteina': { min: 1.2, tipo: 'deficit' }, // g por kg de peso (para atletas)
  fibra: { min: 25, tipo: 'deficit' }, // g por día (mínimo recomendado)
  azucares: { max: 50, tipo: 'exceso' }, // g por día (recomendación OMS)
};

export const VistaExcelConfigurada: React.FC<VistaExcelConfiguradaProps> = ({
  dieta,
  configuracion,
  onReabrirCuestionario,
  onExportar,
  dietistaId,
  onConfiguracionCambiada,
}) => {
  const [celdaInicioSeleccion, setCeldaInicioSeleccion] = useState<{ dia: string; tipoComida: string; columna: string } | null>(null);
  const [celdaFinSeleccion, setCeldaFinSeleccion] = useState<{ dia: string; tipoComida: string; columna: string } | null>(null);
  const [rangoSeleccionado, setRangoSeleccionado] = useState<RangoSeleccionado | null>(null);
  const [estaSeleccionando, setEstaSeleccionando] = useState(false);
  const [mostrarAnalizadorIA, setMostrarAnalizadorIA] = useState(false);
  const [mostrarGestorPlantillas, setMostrarGestorPlantillas] = useState(false);
  const [configuracionActual, setConfiguracionActual] = useState<RespuestaCuestionarioMetodologia>(configuracion);
  const tablaRef = useRef<HTMLTableElement>(null);

  // Ordenar columnas según la configuración
  const columnasOrdenadas = useMemo(() => {
    return [...configuracionActual.columnasExcel]
      .filter((col) => col.visible)
      .sort((a, b) => a.orden - b.orden);
  }, [configuracionActual.columnasExcel]);

  // Organizar comidas por día y tipo
  const comidasPorDiaYTipo = useMemo(() => {
    const organizadas: Record<string, Record<string, typeof dieta.comidas[0]>> = {};
    
    diasSemana.forEach((dia) => {
      organizadas[dia.id] = {};
      tiposComida.forEach((tipo) => {
        const comida = dieta.comidas.find(
          (c) => c.dia === dia.id && c.tipo === tipo.id
        );
        if (comida) {
          organizadas[dia.id][tipo.id] = comida;
        }
      });
    });

    return organizadas;
  }, [dieta.comidas]);

  // Obtener valor de una métrica para una comida
  const obtenerValorMetrica = useCallback((
    comida: typeof dieta.comidas[0] | undefined,
    metricaId: string
  ): string | number => {
    if (!comida) return '-';

    switch (metricaId) {
      case 'calorias':
        return comida.calorias;
      case 'proteinas':
        return comida.proteinas;
      case 'carbohidratos':
        return comida.carbohidratos;
      case 'grasas':
        return comida.grasas;
      case 'fibra':
        return comida.alimentos?.reduce((sum, a) => sum + (a as any).fibra || 0, 0) || '-';
      case 'azucares':
        return comida.alimentos?.reduce((sum, a) => sum + (a as any).azucares || 0, 0) || '-';
      case 'sodio':
        return comida.alimentos?.reduce((sum, a) => sum + (a as any).sodio || 0, 0) || '-';
      case 'ratio-proteina':
        if (dieta.pesoCliente && dieta.pesoCliente > 0) {
          return (comida.proteinas / dieta.pesoCliente).toFixed(2);
        }
        return '-';
      case 'vasos-agua':
        return dieta.vasosAgua || '-';
      case 'adherencia':
        return dieta.adherencia !== undefined ? `${dieta.adherencia}%` : '-';
      case 'tiempo-preparacion':
        return comida.tempoCulinario || '-';
      case 'coste':
        return comida.alimentos?.reduce((sum, a) => sum + (a as any).coste || 0, 0).toFixed(2) || '-';
      case 'satisfaccion-prevista':
        return comida.satisfaccionPrevista !== undefined ? comida.satisfaccionPrevista : '-';
      default:
        return '-';
    }
  }, [dieta.pesoCliente, dieta.vasosAgua, dieta.adherencia]);

  // Formatear valor según el formato de la columna
  const formatearValor = (valor: string | number, formato?: string): string => {
    if (valor === '-') return '-';
    
    const num = typeof valor === 'string' ? parseFloat(valor) : valor;
    if (isNaN(num)) return '-';

    switch (formato) {
      case 'porcentaje':
        return `${num}%`;
      case 'moneda':
        return `€${num.toFixed(2)}`;
      case 'numero':
      default:
        return num.toString();
    }
  };

  // Calcular total diario de una métrica para un día específico
  const calcularTotalDiario = (diaId: string, metricaId: string): number => {
    let total = 0;
    tiposComida.forEach((tipo) => {
      const comida = comidasPorDiaYTipo[diaId]?.[tipo.id];
      if (comida) {
        const valor = obtenerValorMetrica(comida, metricaId);
        const num = typeof valor === 'string' ? parseFloat(valor) : valor;
        if (!isNaN(num)) {
          total += num;
        }
      }
    });
    return total;
  };

  // Verificar si un valor está fuera de rango y obtener el estilo condicional
  const obtenerEstiloCondicional = (
    metricaId: string,
    valor: string | number,
    diaId?: string
  ): { backgroundColor?: string; color?: string; fontWeight?: string; border?: string } => {
    const rango = RANGOS_REFERENCIA[metricaId];
    if (!rango || valor === '-') return {};

    const num = typeof valor === 'string' ? parseFloat(valor) : valor;
    if (isNaN(num)) return {};

    // Para métricas que se evalúan por día (como sodio), calcular el total diario
    let valorComparar = num;
    if (metricaId === 'sodio' && diaId) {
      valorComparar = calcularTotalDiario(diaId, metricaId);
      // Si estamos en una celda individual, solo resaltar si el total diario excede
      // Para mejor UX, también resaltamos si esta comida individual es muy alta
      const umbralIndividual = rango.max ? rango.max * 0.5 : 0; // 50% del máximo diario
      if (num > umbralIndividual) {
        // Resaltar con menor intensidad si es alto pero no excede el total diario
        if (valorComparar <= (rango.max || Infinity)) {
          return {
            backgroundColor: '#fef3c7', // amarillo claro (advertencia)
            color: '#92400e',
            fontWeight: '500',
            border: '1px solid #f59e0b',
          };
        }
      }
    } else if (metricaId === 'proteinas' && dieta.pesoCliente && dieta.pesoCliente > 0) {
      // Para proteínas, comparar por kg de peso si tenemos el peso del cliente
      // Pero solo si estamos viendo el total diario o ratio
      if (metricaId === 'proteinas' && diaId) {
        const totalDiario = calcularTotalDiario(diaId, metricaId);
        valorComparar = totalDiario / dieta.pesoCliente; // g/kg por día
      } else {
        valorComparar = num / dieta.pesoCliente; // g/kg para esta comida
      }
    }

    // Verificar exceso
    if (rango.max !== undefined && valorComparar > rango.max) {
      return {
        backgroundColor: '#fee2e2', // rojo claro
        color: '#991b1b', // rojo oscuro
        fontWeight: '600',
        border: '2px solid #dc2626',
      };
    }

    // Verificar déficit (solo para valores diarios o ratios)
    if (rango.min !== undefined) {
      // Para déficit, evaluamos el total diario si es una métrica acumulativa
      if (metricaId === 'proteinas' && diaId && dieta.pesoCliente && dieta.pesoCliente > 0) {
        const totalDiario = calcularTotalDiario(diaId, metricaId);
        valorComparar = totalDiario / dieta.pesoCliente;
      } else if (metricaId === 'fibra' && diaId) {
        valorComparar = calcularTotalDiario(diaId, metricaId);
      }
      
      if (valorComparar < rango.min) {
        return {
          backgroundColor: '#fef3c7', // amarillo claro
          color: '#92400e', // amarillo oscuro
          fontWeight: '600',
          border: '2px solid #f59e0b',
        };
      }
    }

    return {};
  };

  // Manejar inicio de selección
  const handleMouseDown = (dia: string, tipoComida: string, columna: string) => {
    setEstaSeleccionando(true);
    setCeldaInicioSeleccion({ dia, tipoComida, columna });
    setCeldaFinSeleccion({ dia, tipoComida, columna });
    setRangoSeleccionado(null);
  };

  // Manejar arrastre de selección
  const handleMouseEnter = (dia: string, tipoComida: string, columna: string) => {
    if (estaSeleccionando && celdaInicioSeleccion) {
      setCeldaFinSeleccion({ dia, tipoComida, columna });
    }
  };

  // Manejar fin de selección
  const handleMouseUp = useCallback(() => {
    if (estaSeleccionando && celdaInicioSeleccion && celdaFinSeleccion) {
      // Calcular rango seleccionado
      const celdas: CeldaSeleccionada[] = [];
      
      // Obtener índices de días y tipos de comida
      const diasIndices = diasSemana.map((d, i) => ({ ...d, index: i }));
      const tiposIndices = tiposComida.map((t, i) => ({ ...t, index: i }));
      
      const diaInicio = diasIndices.find((d) => d.id === celdaInicioSeleccion.dia);
      const diaFin = diasIndices.find((d) => d.id === celdaFinSeleccion.dia);
      const tipoInicio = tiposIndices.find((t) => t.id === celdaInicioSeleccion.tipoComida);
      const tipoFin = tiposIndices.find((t) => t.id === celdaFinSeleccion.tipoComida);
      const colInicio = columnasOrdenadas.findIndex((c) => c.id === celdaInicioSeleccion.columna);
      const colFin = columnasOrdenadas.findIndex((c) => c.id === celdaFinSeleccion.columna);

      if (diaInicio && diaFin && tipoInicio && tipoFin && colInicio >= 0 && colFin >= 0) {
        const diaMin = Math.min(diaInicio.index, diaFin.index);
        const diaMax = Math.max(diaInicio.index, diaFin.index);
        const tipoMin = Math.min(tipoInicio.index, tipoFin.index);
        const tipoMax = Math.max(tipoInicio.index, tipoFin.index);
        const colMin = Math.min(colInicio, colFin);
        const colMax = Math.max(colInicio, colFin);

        for (let d = diaMin; d <= diaMax; d++) {
          for (let t = tipoMin; t <= tipoMax; t++) {
            for (let c = colMin; c <= colMax; c++) {
              const dia = diasSemana[d];
              const tipo = tiposComida[t];
              const columna = columnasOrdenadas[c];
              const comida = comidasPorDiaYTipo[dia.id]?.[tipo.id];
              const valor = obtenerValorMetrica(comida, columna.id);
              
              celdas.push({
                dia: dia.id,
                tipoComida: tipo.id,
                columna: columna.id,
                valor,
              });
            }
          }
        }

        if (celdas.length > 0) {
          setRangoSeleccionado({
            celdas,
            inicio: celdaInicioSeleccion,
            fin: celdaFinSeleccion,
          });
        }
      }
    }
    setEstaSeleccionando(false);
  }, [estaSeleccionando, celdaInicioSeleccion, celdaFinSeleccion, columnasOrdenadas, comidasPorDiaYTipo, obtenerValorMetrica]);

  // Efecto para manejar mouse up global
  React.useEffect(() => {
    if (estaSeleccionando) {
      const handleGlobalMouseUp = () => {
        handleMouseUp();
      };
      document.addEventListener('mouseup', handleGlobalMouseUp);
      return () => {
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [estaSeleccionando, handleMouseUp]);

  // Verificar si una celda está seleccionada
  const esCeldaSeleccionada = (dia: string, tipoComida: string, columna: string): boolean => {
    if (!celdaInicioSeleccion || !celdaFinSeleccion) return false;

    const diasIndices = diasSemana.map((d, i) => ({ ...d, index: i }));
    const tiposIndices = tiposComida.map((t, i) => ({ ...t, index: i }));
    
    const diaActual = diasIndices.find((d) => d.id === dia);
    const diaInicio = diasIndices.find((d) => d.id === celdaInicioSeleccion.dia);
    const diaFin = diasIndices.find((d) => d.id === celdaFinSeleccion.dia);
    const tipoActual = tiposIndices.find((t) => t.id === tipoComida);
    const tipoInicio = tiposIndices.find((t) => t.id === celdaInicioSeleccion.tipoComida);
    const tipoFin = tiposIndices.find((t) => t.id === celdaFinSeleccion.tipoComida);
    const colActual = columnasOrdenadas.findIndex((c) => c.id === columna);
    const colInicio = columnasOrdenadas.findIndex((c) => c.id === celdaInicioSeleccion.columna);
    const colFin = columnasOrdenadas.findIndex((c) => c.id === celdaFinSeleccion.columna);

    if (!diaActual || !diaInicio || !diaFin || !tipoActual || !tipoInicio || !tipoFin || colActual < 0 || colInicio < 0 || colFin < 0) {
      return false;
    }

    const diaMin = Math.min(diaInicio.index, diaFin.index);
    const diaMax = Math.max(diaInicio.index, diaFin.index);
    const tipoMin = Math.min(tipoInicio.index, tipoFin.index);
    const tipoMax = Math.max(tipoInicio.index, tipoFin.index);
    const colMin = Math.min(colInicio, colFin);
    const colMax = Math.max(colInicio, colFin);

    return (
      diaActual.index >= diaMin &&
      diaActual.index <= diaMax &&
      tipoActual.index >= tipoMin &&
      tipoActual.index <= tipoMax &&
      colActual >= colMin &&
      colActual <= colMax
    );
  };

  // Generar datos para exportación Excel
  const generarDatosExcel = () => {
    const datos: any[][] = [];
    
    // Encabezados
    const encabezados = ['Día', 'Comida', ...columnasOrdenadas.map((col) => col.label)];
    datos.push(encabezados);

    // Filas de datos
    diasSemana.forEach((dia) => {
      tiposComida.forEach((tipo) => {
        const comida = comidasPorDiaYTipo[dia.id]?.[tipo.id];
        const fila = [
          dia.nombre,
          tipo.label,
          ...columnasOrdenadas.map((col) => {
            const valor = obtenerValorMetrica(comida, col.id);
            return formatearValor(valor, col.formato);
          }),
        ];
        datos.push(fila);
      });
    });

    return datos;
  };

  const handleExportar = () => {
    if (onExportar) {
      onExportar();
      return;
    }

    // Exportación básica a CSV (en producción usaría xlsx)
    const datos = generarDatosExcel();
    const csv = datos.map((fila) => fila.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `dieta_${dieta.nombre}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="bg-white border border-slate-200 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
          <span>Vista Excel configurada según tu metodología</span>
        </div>
        <div className="flex items-center gap-2">
          {dietistaId && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setMostrarGestorPlantillas(true)}
              leftIcon={<FileSpreadsheet className="w-4 h-4" />}
            >
              Plantillas
            </Button>
          )}
          {onReabrirCuestionario && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onReabrirCuestionario}
              leftIcon={<Settings className="w-4 h-4" />}
            >
              Reabrir Cuestionario
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportar}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Exportar .xlsx
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table ref={tablaRef} className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3 sticky left-0 bg-slate-50 z-10">Día</th>
              <th className="px-4 py-3 sticky left-20 bg-slate-50 z-10">Comida</th>
              {columnasOrdenadas.map((columna) => (
                <th
                  key={columna.id}
                  className="px-4 py-3"
                  style={{ minWidth: columna.ancho || 100 }}
                >
                  {columna.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {diasSemana.map((dia) =>
              tiposComida.map((tipo, tipoIndex) => {
                const comida = comidasPorDiaYTipo[dia.id]?.[tipo.id];
                const esPrimeraFilaDia = tipoIndex === 0;
                
                return (
                  <tr
                    key={`${dia.id}-${tipo.id}`}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    {esPrimeraFilaDia ? (
                      <td
                        className="px-4 py-3 font-medium text-slate-700 sticky left-0 bg-white z-10"
                        rowSpan={tiposComida.length}
                      >
                        {dia.nombre}
                      </td>
                    ) : null}
                    <td className="px-4 py-3 text-slate-600 sticky left-20 bg-white z-10">
                      {tipo.label}
                    </td>
                    {columnasOrdenadas.map((columna) => {
                      const valor = obtenerValorMetrica(comida, columna.id);
                      const valorFormateado = formatearValor(valor, columna.formato);
                      const estiloCondicional = obtenerEstiloCondicional(columna.id, valor, dia.id);
                      const seleccionada = esCeldaSeleccionada(dia.id, tipo.id, columna.id);
                      
                      return (
                        <td
                          key={columna.id}
                          className={`px-4 py-3 text-slate-700 cursor-cell select-none ${
                            seleccionada ? 'bg-blue-100 ring-2 ring-blue-500' : ''
                          }`}
                          style={estiloCondicional}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleMouseDown(dia.id, tipo.id, columna.id);
                          }}
                          onMouseEnter={() => handleMouseEnter(dia.id, tipo.id, columna.id)}
                          title={
                            estiloCondicional.backgroundColor
                              ? `Valor fuera de rango: ${valorFormateado}`
                              : undefined
                          }
                        >
                          {valorFormateado}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
          {/* Fila de totales si hay fórmulas */}
          {configuracionActual.formulasPersonalizadas &&
            Object.keys(configuracionActual.formulasPersonalizadas).length > 0 && (
              <tfoot className="bg-slate-100 font-semibold">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-slate-700">
                    Totales
                  </td>
                  {columnasOrdenadas.map((columna) => {
                    const formula = configuracionActual.formulasPersonalizadas?.[`total_${columna.id}`];
                    return (
                      <td key={columna.id} className="px-4 py-3 text-slate-700">
                        {formula ? `=${formula}` : '-'}
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            )}
        </table>
      </div>

      {/* Información sobre fórmulas */}
      {configuracionActual.formulasPersonalizadas &&
        Object.keys(configuracionActual.formulasPersonalizadas).length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-900">
              <strong>Fórmulas personalizadas:</strong> Las fórmulas se aplicarán automáticamente
              al exportar a Excel. Revisa la configuración si necesitas ajustarlas.
            </div>
          </div>
        )}

      {/* Leyenda de formato condicional */}
      <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
        <div className="text-xs font-semibold text-gray-700 mb-2">Leyenda de Formato Condicional:</div>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2" style={{ backgroundColor: '#fee2e2', borderColor: '#dc2626' }} />
            <span className="text-gray-600">Exceso (fuera de rango máximo)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2" style={{ backgroundColor: '#fef3c7', borderColor: '#f59e0b' }} />
            <span className="text-gray-600">Déficit (fuera de rango mínimo)</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <strong>Tip:</strong> Selecciona un rango de celdas arrastrando el mouse para ver resúmenes automáticos.
        </div>
      </div>

      {/* Resumen Automático y Analizador IA */}
      {rangoSeleccionado && rangoSeleccionado.celdas.length > 0 && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-end mb-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setMostrarAnalizadorIA(!mostrarAnalizadorIA)}
              leftIcon={<FileSpreadsheet className="w-4 h-4" />}
            >
              {mostrarAnalizadorIA ? 'Ocultar' : 'Mostrar'} Análisis IA
            </Button>
          </div>
          
          <ResumenAutomatico
            dieta={dieta}
            rangoSeleccionado={rangoSeleccionado}
            onCerrar={() => {
              setRangoSeleccionado(null);
              setCeldaInicioSeleccion(null);
              setCeldaFinSeleccion(null);
              setMostrarAnalizadorIA(false);
            }}
          />
          
          {/* Analizador IA */}
          {mostrarAnalizadorIA && (
            <AnalizadorIA
              dieta={dieta}
              rangoSeleccionado={rangoSeleccionado}
              onCerrar={() => setMostrarAnalizadorIA(false)}
              onAplicarAjuste={(sugerencia) => {
                console.log('Aplicar ajuste:', sugerencia);
                // TODO: Implementar lógica para aplicar el ajuste
                alert(`Ajuste aplicado: ${sugerencia.descripcion}`);
              }}
            />
          )}
        </div>
      )}

      {/* Gestor de Plantillas Personalizadas */}
      {dietistaId && (
        <GestorPlantillasPersonalizadas
          isOpen={mostrarGestorPlantillas}
          onClose={() => setMostrarGestorPlantillas(false)}
          dietistaId={dietistaId}
          configuracionActual={configuracionActual}
          onAplicarPlantilla={(nuevaConfiguracion) => {
            setConfiguracionActual(nuevaConfiguracion);
            if (onConfiguracionCambiada) {
              onConfiguracionCambiada(nuevaConfiguracion);
            }
          }}
        />
      )}
    </Card>
  );
};

