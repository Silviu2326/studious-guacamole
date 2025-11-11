import React, { useState, useEffect } from 'react';
import { Card, Table, TableColumn, Badge, Button, Tooltip } from '../../../components/componentsreutilizables';
import { expensesAPI } from '../api/expenses';
import { CategoriaGasto, CATEGORIAS_GASTO, GastoDeducible } from '../types/expenses';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ChevronRight, 
  HelpCircle,
  Eye,
  Calendar
} from 'lucide-react';

interface MonthlyExpenseComparisonTableProps {
  onViewDetails?: (categoria: CategoriaGasto, mes: string, año: number) => void;
  initialMonths?: number; // Número de meses a mostrar (por defecto 6)
}

interface MonthlyCategoryData {
  mes: string;
  año: number;
  mesNumero: number;
  categorias: {
    categoria: CategoriaGasto;
    total: number;
    cantidad: number;
  }[];
}

interface CategoryComparison {
  categoria: CategoriaGasto;
  meses: {
    mes: string;
    año: number;
    mesNumero: number;
    total: number;
    cantidad: number;
  }[];
  totalGeneral: number;
  promedioMensual: number;
  tendencia: 'up' | 'down' | 'stable';
  variacionPorcentual: number;
}

export const MonthlyExpenseComparisonTable: React.FC<MonthlyExpenseComparisonTableProps> = ({
  onViewDetails,
  initialMonths = 6
}) => {
  const [datosMensuales, setDatosMensuales] = useState<MonthlyCategoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaGasto | null>(null);
  const [mesesSeleccionados, setMesesSeleccionados] = useState<number>(initialMonths);

  useEffect(() => {
    cargarDatos();
  }, [mesesSeleccionados]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const hoy = new Date();
      const fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth() - (mesesSeleccionados - 1), 1);
      const fechaFin = hoy;
      
      const datos = await expensesAPI.obtenerGastosMensualesPorCategoria(fechaInicio, fechaFin);
      setDatosMensuales(datos);
    } catch (error) {
      console.error('Error al cargar datos mensuales:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const formatearMes = (mes: string) => {
    const [año, mesNum] = mes.split('-');
    const fecha = new Date(parseInt(año), parseInt(mesNum) - 1, 1);
    return fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
  };

  // Calcular comparación por categoría
  const calcularComparacion = (): CategoryComparison[] => {
    const categoriasMap = new Map<CategoriaGasto, CategoryComparison>();

    datosMensuales.forEach(datosMes => {
      datosMes.categorias.forEach(catData => {
        if (!categoriasMap.has(catData.categoria)) {
          categoriasMap.set(catData.categoria, {
            categoria: catData.categoria,
            meses: [],
            totalGeneral: 0,
            promedioMensual: 0,
            tendencia: 'stable',
            variacionPorcentual: 0
          });
        }

        const comparacion = categoriasMap.get(catData.categoria)!;
        comparacion.meses.push({
          mes: datosMes.mes,
          año: datosMes.año,
          mesNumero: datosMes.mesNumero,
          total: catData.total,
          cantidad: catData.cantidad
        });
        comparacion.totalGeneral += catData.total;
      });
    });

    // Calcular promedios, tendencias y variaciones
    const comparaciones = Array.from(categoriasMap.values());
    
    comparaciones.forEach(comp => {
      comp.promedioMensual = comp.meses.length > 0 ? comp.totalGeneral / comp.meses.length : 0;
      
      // Calcular tendencia comparando los últimos 2 meses
      if (comp.meses.length >= 2) {
        const mesesOrdenados = [...comp.meses].sort((a, b) => {
          if (a.año !== b.año) return a.año - b.año;
          return a.mesNumero - b.mesNumero;
        });
        
        const ultimoMes = mesesOrdenados[mesesOrdenados.length - 1];
        const penultimoMes = mesesOrdenados[mesesOrdenados.length - 2];
        
        if (penultimoMes.total > 0) {
          comp.variacionPorcentual = ((ultimoMes.total - penultimoMes.total) / penultimoMes.total) * 100;
          
          if (comp.variacionPorcentual > 10) {
            comp.tendencia = 'up';
          } else if (comp.variacionPorcentual < -10) {
            comp.tendencia = 'down';
          } else {
            comp.tendencia = 'stable';
          }
        }
      }
    });

    return comparaciones.sort((a, b) => b.totalGeneral - a.totalGeneral);
  };

  const comparaciones = calcularComparacion();

  // Obtener todas las categorías únicas y ordenar meses
  const todasLasCategorias = Array.from(new Set(
    datosMensuales.flatMap(d => d.categorias.map(c => c.categoria))
  ));

  const mesesOrdenados = [...datosMensuales].sort((a, b) => {
    if (a.año !== b.año) return a.año - b.año;
    return a.mesNumero - b.mesNumero;
  });

  // Crear matriz de datos para la tabla
  const datosTabla = todasLasCategorias.map(categoria => {
    const comparacion = comparaciones.find(c => c.categoria === categoria);
    const fila: any = {
      categoria,
      totalGeneral: comparacion?.totalGeneral || 0,
      promedioMensual: comparacion?.promedioMensual || 0,
      tendencia: comparacion?.tendencia || 'stable',
      variacionPorcentual: comparacion?.variacionPorcentual || 0
    };

    mesesOrdenados.forEach(datosMes => {
      const categoriaData = datosMes.categorias.find(c => c.categoria === categoria);
      fila[datosMes.mes] = categoriaData?.total || 0;
    });

    return fila;
  });

  const columnas: TableColumn<any>[] = [
    {
      key: 'categoria',
      header: 'Categoría',
      render: (fila) => (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {CATEGORIAS_GASTO[fila.categoria].nombre}
          </Badge>
        </div>
      )
    },
    ...mesesOrdenados.map(datosMes => ({
      key: datosMes.mes,
      header: formatearMes(datosMes.mes),
      render: (fila: any) => {
        const valor = fila[datosMes.mes] || 0;
        const comparacion = comparaciones.find(c => c.categoria === fila.categoria);
        const mesAnterior = mesesOrdenados[mesesOrdenados.indexOf(datosMes) - 1];
        
        if (!mesAnterior) {
          return (
            <span className="font-medium text-gray-900">
              {valor > 0 ? formatearMoneda(valor) : '-'}
            </span>
          );
        }

        const valorAnterior = fila[mesAnterior.mes] || 0;
        const variacion = valorAnterior > 0 ? ((valor - valorAnterior) / valorAnterior) * 100 : 0;
        const esAumentoSignificativo = variacion > 15;
        const esDisminucion = variacion < -15;

        return (
          <div className="flex items-center gap-2">
            <span className={`font-medium ${
              esAumentoSignificativo ? 'text-red-600' : 
              esDisminucion ? 'text-green-600' : 
              'text-gray-900'
            }`}>
              {valor > 0 ? formatearMoneda(valor) : '-'}
            </span>
            {valor > 0 && valorAnterior > 0 && (
              <div className="flex items-center gap-1">
                {esAumentoSignificativo && (
                  <Tooltip content={`Aumento del ${variacion.toFixed(1)}% respecto al mes anterior`} position="top">
                    <div>
                      <TrendingUp className="w-4 h-4 text-red-600" />
                    </div>
                  </Tooltip>
                )}
                {esDisminucion && (
                  <Tooltip content={`Disminución del ${Math.abs(variacion).toFixed(1)}% respecto al mes anterior`} position="top">
                    <div>
                      <TrendingDown className="w-4 h-4 text-green-600" />
                    </div>
                  </Tooltip>
                )}
                {!esAumentoSignificativo && !esDisminucion && valorAnterior > 0 && (
                  <Tooltip content={`Variación del ${variacion > 0 ? '+' : ''}${variacion.toFixed(1)}% respecto al mes anterior`} position="top">
                    <div>
                      <Minus className="w-4 h-4 text-gray-400" />
                    </div>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
        );
      }
    })),
    {
      key: 'promedioMensual',
      header: 'Promedio Mensual',
      render: (fila) => (
        <span className="font-semibold text-gray-900">
          {formatearMoneda(fila.promedioMensual)}
        </span>
      )
    },
    {
      key: 'totalGeneral',
      header: 'Total General',
      render: (fila) => (
        <span className="font-bold text-blue-600">
          {formatearMoneda(fila.totalGeneral)}
        </span>
      )
    },
    {
      key: 'tendencia',
      header: 'Tendencia',
      render: (fila) => {
        const { tendencia, variacionPorcentual } = fila;
        return (
          <div className="flex items-center gap-2">
            {tendencia === 'up' && (
              <Tooltip content={`Aumento significativo: ${variacionPorcentual.toFixed(1)}%`} position="top">
                <div className="flex items-center gap-1 text-red-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+{variacionPorcentual.toFixed(1)}%</span>
                </div>
              </Tooltip>
            )}
            {tendencia === 'down' && (
              <Tooltip content={`Disminución: ${variacionPorcentual.toFixed(1)}%`} position="top">
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm font-medium">{variacionPorcentual.toFixed(1)}%</span>
                </div>
              </Tooltip>
            )}
            {tendencia === 'stable' && (
              <Tooltip content="Tendencia estable" position="top">
                <div className="flex items-center gap-1 text-gray-400">
                  <Minus className="w-4 h-4" />
                  <span className="text-sm">Estable</span>
                </div>
              </Tooltip>
            )}
          </div>
        );
      }
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (fila) => {
        const ultimoMes = mesesOrdenados[mesesOrdenados.length - 1];
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (onViewDetails) {
                onViewDetails(fila.categoria, ultimoMes.mes, ultimoMes.año);
              }
            }}
          >
            <Eye className="w-4 h-4 mr-1" />
            Ver Detalle
          </Button>
        );
      }
    }
  ];

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Comparación Mensual de Gastos por Categoría
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Compara tus gastos mes a mes para identificar tendencias y controlar mejor tu presupuesto
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip 
              content={
                <div className="max-w-xs">
                  <p className="font-semibold mb-2">Comparación Mensual:</p>
                  <p className="text-xs mb-2">Esta tabla muestra tus gastos desglosados por categoría y mes. Los aumentos significativos (más del 15%) se resaltan en rojo.</p>
                  <p className="text-xs font-semibold mt-2">Características:</p>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    <li>Comparación mes a mes por categoría</li>
                    <li>Resaltado de aumentos significativos</li>
                    <li>Cálculo de promedios y tendencias</li>
                    <li>Drill-down al detalle de cada categoría</li>
                  </ul>
                </div>
              }
              position="left"
              delay={100}
            >
              <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-help" />
            </Tooltip>
            <select
              value={mesesSeleccionados}
              onChange={(e) => setMesesSeleccionados(parseInt(e.target.value))}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={3}>Últimos 3 meses</option>
              <option value={6}>Últimos 6 meses</option>
              <option value={12}>Últimos 12 meses</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Cargando datos...
          </div>
        ) : datosMensuales.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay datos disponibles para el periodo seleccionado
          </div>
        ) : (
          <>
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>💡 Consejo:</strong> Los gastos con aumentos significativos (más del 15%) se resaltan en rojo. 
                Haz clic en "Ver Detalle" para ver los gastos específicos de una categoría.
              </p>
            </div>
            <Table
              data={datosTabla}
              columns={columnas}
              loading={loading}
              emptyMessage="No hay gastos registrados"
            />
          </>
        )}
      </div>
    </Card>
  );
};

