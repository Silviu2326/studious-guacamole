import React from 'react';
import { Card, Table, TableColumn } from '../../../components/componentsreutilizables';
import { BarChart3, Loader2, AlertCircle, Info } from 'lucide-react';
import { getProyeccionesFinancieras, FiltrosProyecciones } from '../api';
import { ProyeccionFinanciera, RolFinanciero, NivelConfianza } from '../types';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

/**
 * Props para el componente ProyeccionesFinancieras
 */
export interface ProyeccionesFinancierasProps {
  /** Rol financiero del usuario que determina qué proyecciones mostrar */
  rol: RolFinanciero;
  /** Filtros opcionales para el horizonte temporal de las proyecciones */
  filtrosHorizonteTemporal?: FiltrosProyecciones;
}

/**
 * Componente para mostrar proyecciones financieras futuras
 * 
 * Este componente muestra proyecciones de ingresos, costes y beneficios para períodos futuros,
 * basándose en datos históricos y tendencias actuales. Las proyecciones son estimaciones
 * y se indican claramente como tales.
 * 
 * @remarks
 * Este componente se usa en el tab "Proyecciones" del panel financiero.
 * Las proyecciones se calculan usando modelos financieros basados en datos históricos.
 */
export const ProyeccionesFinancieras: React.FC<ProyeccionesFinancierasProps> = ({ 
  rol,
  filtrosHorizonteTemporal 
}) => {
  const [proyecciones, setProyecciones] = React.useState<ProyeccionFinanciera[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const isEntrenador = rol === 'entrenador';

  React.useEffect(() => {
    const cargarProyecciones = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProyeccionesFinancieras(rol, filtrosHorizonteTemporal);
        setProyecciones(data);
      } catch (error) {
        console.error('Error cargando proyecciones:', error);
        setError('Error al cargar las proyecciones financieras. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    cargarProyecciones();
  }, [rol, filtrosHorizonteTemporal]);

  // Función helper para obtener el valor numérico de ingresos (compatibilidad legacy)
  const getIngresos = (proj: ProyeccionFinanciera): number => {
    return proj.ingresosEsperados ?? proj.ingresos ?? 0;
  };

  // Función helper para obtener el valor numérico de costes (compatibilidad legacy)
  const getCostes = (proj: ProyeccionFinanciera): number => {
    return proj.costesEsperados ?? proj.gastos ?? 0;
  };

  // Función helper para obtener el valor numérico de beneficio (compatibilidad legacy)
  const getBeneficio = (proj: ProyeccionFinanciera): number => {
    return proj.beneficioEsperado ?? proj.beneficio ?? 0;
  };

  // Función helper para obtener el nivel de confianza como número (compatibilidad legacy)
  const getConfianzaNumero = (nivelConfianza: NivelConfianza | undefined, confianzaLegacy?: number): number => {
    if (confianzaLegacy !== undefined) return confianzaLegacy;
    if (nivelConfianza === 'alto') return 85;
    if (nivelConfianza === 'medio') return 75;
    if (nivelConfianza === 'bajo') return 65;
    return 70;
  };

  // Función helper para obtener el color del badge de confianza
  const getConfianzaColor = (nivelConfianza: NivelConfianza | undefined): string => {
    if (nivelConfianza === 'alto') return 'bg-green-100 text-green-800';
    if (nivelConfianza === 'medio') return 'bg-yellow-100 text-yellow-800';
    if (nivelConfianza === 'bajo') return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Función helper para obtener el texto del nivel de confianza
  const getConfianzaTexto = (nivelConfianza: NivelConfianza | undefined): string => {
    if (nivelConfianza === 'alto') return 'Alto';
    if (nivelConfianza === 'medio') return 'Medio';
    if (nivelConfianza === 'bajo') return 'Bajo';
    return 'N/A';
  };

  const columns: TableColumn<ProyeccionFinanciera>[] = [
    { key: 'periodo', label: 'Período' },
    { 
      key: 'ingresosEsperados', 
      label: 'Ingresos Esperados', 
      align: 'right', 
      render: (val, row) => {
        const ingresos = getIngresos(row);
        return `€${ingresos.toLocaleString('es-ES')}`;
      }
    },
    { 
      key: 'costesEsperados', 
      label: isEntrenador ? '-' : 'Costes Esperados', 
      align: 'right', 
      render: (val, row) => {
        if (isEntrenador) return '-';
        const costes = getCostes(row);
        return `€${costes.toLocaleString('es-ES')}`;
      }
    },
    { 
      key: 'beneficioEsperado', 
      label: isEntrenador ? 'Ingresos Netos Esperados' : 'Beneficio Esperado', 
      align: 'right', 
      render: (val, row) => {
        const beneficio = getBeneficio(row);
        return `€${beneficio.toLocaleString('es-ES')}`;
      }
    },
    { 
      key: 'nivelConfianza', 
      label: 'Nivel de Confianza', 
      align: 'center', 
      render: (val, row) => {
        const nivelConfianza = row.nivelConfianza;
        const confianzaNumero = getConfianzaNumero(nivelConfianza, row.confianza);
        return (
          <div className="flex flex-col items-center gap-1">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getConfianzaColor(nivelConfianza)}`}>
              {getConfianzaTexto(nivelConfianza)}
            </span>
            <span className="text-xs text-gray-500">
              {confianzaNumero.toFixed(0)}%
            </span>
          </div>
        );
      }
    }
  ];

  // Datos para el gráfico (usando nuevos campos con compatibilidad legacy)
  const chartData = proyecciones.map(proj => ({
    periodo: proj.periodo,
    ingresos: getIngresos(proj),
    gastos: isEntrenador ? null : getCostes(proj),
    beneficio: getBeneficio(proj)
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold mb-2 text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: €{entry.value.toLocaleString('es-ES')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Alerta informativa sobre estimaciones */}
      <Card className="bg-amber-50 border-amber-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-amber-900 mb-1">
                Información Importante
              </h3>
              <p className="text-sm text-amber-800">
                Las siguientes proyecciones son <strong>estimaciones</strong> basadas en datos históricos y tendencias actuales. 
                Los valores reales pueden variar según condiciones del mercado, cambios en la demanda y otros factores externos. 
                Estas proyecciones deben utilizarse como referencia y no como garantía de resultados futuros.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Gráfico de proyecciones */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                Proyecciones Financieras
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Estimaciones de ingresos y beneficios futuros
              </p>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : proyecciones.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBeneficio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  {!isEntrenador && (
                    <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  )}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="periodo" stroke="#6b7280" />
                <YAxis 
                  stroke="#6b7280" 
                  tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="ingresos" 
                  name="Ingresos Proyectados" 
                  stroke="#3B82F6" 
                  fillOpacity={1} 
                  fill="url(#colorIngresos)" 
                />
                {!isEntrenador && (
                  <Area 
                    type="monotone" 
                    dataKey="gastos" 
                    name="Gastos Proyectados" 
                    stroke="#EF4444" 
                    fillOpacity={1} 
                    fill="url(#colorGastos)" 
                  />
                )}
                <Area 
                  type="monotone" 
                  dataKey="beneficio" 
                  name={isEntrenador ? "Ingresos Netos" : "Beneficio Neto"} 
                  stroke="#10B981" 
                  fillOpacity={1} 
                  fill="url(#colorBeneficio)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12">
              <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No hay proyecciones disponibles</p>
            </div>
          )}
        </div>
      </Card>

      {/* Tabla detallada */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Detalles por Período
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Info className="w-4 h-4" />
              <span>Valores estimados basados en tendencias históricas</span>
            </div>
          </div>
          <Table 
            data={proyecciones} 
            columns={columns} 
            loading={loading} 
            emptyMessage="No hay proyecciones disponibles" 
          />
        </div>
      </Card>
    </div>
  );
};

