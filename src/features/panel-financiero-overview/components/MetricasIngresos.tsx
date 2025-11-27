/**
 * Componente MetricasIngresos
 * 
 * Muestra el desglose detallado de ingresos según el rol del usuario.
 * Este componente se utiliza en el tab "Ingresos/Facturación" del panel financiero.
 * 
 * @remarks
 * - Para entrenadores: muestra sesiones 1 a 1, paquetes, consultas online
 * - Para gimnasios: muestra cuotas socios, entrenamiento personal, tienda, servicios adicionales
 * - Incluye comparación con el período anterior mostrando variación porcentual
 * - Presenta gráficos de barras y distribución para visualización de datos
 */

import React from 'react';
import { Card, MetricCards, MetricCardData, Table, TableColumn } from '../../../components/componentsreutilizables';
import { DollarSign, TrendingUp, TrendingDown, Package, Video, Users, Loader2, ShoppingBag, Activity } from 'lucide-react';
import { ingresosApi } from '../api';
import { IngresosEntrenador, FacturacionGimnasio, RolFinanciero, MetricasFinancieras } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Props del componente MetricasIngresos
 */
export interface MetricasIngresosProps {
  /** Rol financiero del usuario ('entrenador' o 'gimnasio') */
  rol: RolFinanciero;
  /** Período a mostrar (mes y año). Si no se proporciona, usa el mes actual */
  periodo?: {
    mes: number;
    anio: number;
  };
  /** Filtros de fecha alternativos (fechaInicio y fechaFin). Si se proporcionan, se usan en lugar de periodo */
  filtrosFecha?: {
    fechaInicio: Date;
    fechaFin: Date;
  };
}

/**
 * Componente que muestra métricas de ingresos detalladas según el rol
 * 
 * @param props - Props del componente
 * @returns Componente React con el desglose de ingresos
 */
export const MetricasIngresos: React.FC<MetricasIngresosProps> = ({ 
  rol, 
  periodo,
  filtrosFecha 
}) => {
  const [ingresosEntrenador, setIngresosEntrenador] = React.useState<IngresosEntrenador | null>(null);
  const [facturacionGimnasio, setFacturacionGimnasio] = React.useState<FacturacionGimnasio | null>(null);
  const [ingresosAnterior, setIngresosAnterior] = React.useState<IngresosEntrenador | null>(null);
  const [facturacionAnterior, setFacturacionAnterior] = React.useState<FacturacionGimnasio | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [variacionTotal, setVariacionTotal] = React.useState<MetricasFinancieras | null>(null);

  // Determinar el período a usar
  const periodoActual = React.useMemo(() => {
    if (filtrosFecha) {
      // Si hay filtros de fecha, extraer mes y año de la fecha de inicio
      const fechaInicio = filtrosFecha.fechaInicio;
      return {
        mes: fechaInicio.getMonth() + 1,
        anio: fechaInicio.getFullYear()
      };
    }
    if (periodo) {
      return periodo;
    }
    // Por defecto, usar el mes actual
    const ahora = new Date();
    return {
      mes: ahora.getMonth() + 1,
      anio: ahora.getFullYear()
    };
  }, [periodo, filtrosFecha]);

  // Calcular período anterior
  const periodoAnterior = React.useMemo(() => {
    const fechaAnterior = new Date(periodoActual.anio, periodoActual.mes - 1, 1);
    fechaAnterior.setMonth(fechaAnterior.getMonth() - 1);
    return {
      mes: fechaAnterior.getMonth() + 1,
      anio: fechaAnterior.getFullYear()
    };
  }, [periodoActual]);

  React.useEffect(() => {
    const cargarIngresos = async () => {
      try {
        setLoading(true);
        
        if (rol === 'entrenador') {
          // Cargar ingresos del período actual y anterior
          const [dataActual, dataAnterior] = await Promise.all([
            ingresosApi.getIngresosEntrenador(periodoActual),
            ingresosApi.getIngresosEntrenador(periodoAnterior)
          ]);
          
          setIngresosEntrenador(dataActual);
          setIngresosAnterior(dataAnterior);
          
          // Calcular variación
          const variacion = calcularVariacion(dataActual.total, dataAnterior.total);
          setVariacionTotal({
            valorActual: dataActual.total,
            valorAnterior: dataAnterior.total,
            variacionAbsoluta: dataActual.total - dataAnterior.total,
            variacionPorcentual: variacion,
            tendencia: variacion > 2 ? 'up' : variacion < -2 ? 'down' : 'neutral',
            etiqueta: `Ingresos ${dataActual.periodo}`,
            descripcionOpcional: `Comparado con ${dataAnterior.periodo}`,
            total: dataActual.total,
            periodoActual: dataActual.periodo,
            periodoAnterior: dataAnterior.periodo,
            variacion: variacion
          });
        } else {
          // Cargar facturación del período actual y anterior
          const [dataActual, dataAnterior] = await Promise.all([
            ingresosApi.getFacturacionGimnasio(periodoActual),
            ingresosApi.getFacturacionGimnasio(periodoAnterior)
          ]);
          
          setFacturacionGimnasio(dataActual);
          setFacturacionAnterior(dataAnterior);
          
          // Calcular variación
          const variacion = calcularVariacion(dataActual.total, dataAnterior.total);
          setVariacionTotal({
            valorActual: dataActual.total,
            valorAnterior: dataAnterior.total,
            variacionAbsoluta: dataActual.total - dataAnterior.total,
            variacionPorcentual: variacion,
            tendencia: variacion > 2 ? 'up' : variacion < -2 ? 'down' : 'neutral',
            etiqueta: `Facturación ${dataActual.periodo}`,
            descripcionOpcional: `Comparado con ${dataAnterior.periodo}`,
            total: dataActual.total,
            periodoActual: dataActual.periodo,
            periodoAnterior: dataAnterior.periodo,
            variacion: variacion
          });
        }
      } catch (error) {
        console.error('Error cargando ingresos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarIngresos();
  }, [rol, periodoActual, periodoAnterior]);

  /**
   * Calcula la variación porcentual entre dos valores
   */
  const calcularVariacion = (actual: number, anterior: number): number => {
    if (anterior === 0) return actual > 0 ? 100 : 0;
    return Math.round(((actual - anterior) / anterior) * 100 * 100) / 100;
  };

  /**
   * Obtiene el icono de tendencia según la dirección
   */
  const getTrendIcon = (tendencia: 'up' | 'down' | 'neutral') => {
    switch (tendencia) {
      case 'up':
        return <TrendingUp className="w-5 h-5" />;
      case 'down':
        return <TrendingDown className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

  // Renderizado para entrenador
  if (rol === 'entrenador') {
    if (!ingresosEntrenador) {
      return (
        <Card className="bg-white shadow-sm">
          <div className="p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando ingresos...</p>
          </div>
        </Card>
      );
    }

    // Calcular variaciones por categoría
    const variacionSesiones = ingresosAnterior 
      ? calcularVariacion(ingresosEntrenador.sesiones1a1, ingresosAnterior.sesiones1a1)
      : 0;
    const variacionPaquetes = ingresosAnterior 
      ? calcularVariacion(
          ingresosEntrenador.paquetesEntrenamiento || ingresosEntrenador.paquetes,
          ingresosAnterior.paquetesEntrenamiento || ingresosAnterior.paquetes
        )
      : 0;
    const variacionConsultas = ingresosAnterior
      ? calcularVariacion(ingresosEntrenador.consultasOnline, ingresosAnterior.consultasOnline)
      : 0;

    const metrics: MetricCardData[] = [
      {
        id: 'sesiones',
        title: 'Sesiones 1 a 1',
        value: `€${ingresosEntrenador.sesiones1a1.toLocaleString()}`,
        subtitle: ingresosAnterior ? `vs. €${ingresosAnterior.sesiones1a1.toLocaleString()} (${ingresosAnterior.periodo})` : undefined,
        icon: <Users className="w-5 h-5" />,
        color: 'primary',
        loading,
        trend: ingresosAnterior ? {
          value: Math.abs(variacionSesiones),
          direction: variacionSesiones > 2 ? 'up' : variacionSesiones < -2 ? 'down' : 'neutral',
          label: 'vs período anterior'
        } : undefined
      },
      {
        id: 'paquetes',
        title: 'Paquetes Entrenamiento',
        value: `€${(ingresosEntrenador.paquetesEntrenamiento || ingresosEntrenador.paquetes).toLocaleString()}`,
        subtitle: ingresosAnterior ? `vs. €${(ingresosAnterior.paquetesEntrenamiento || ingresosAnterior.paquetes).toLocaleString()} (${ingresosAnterior.periodo})` : undefined,
        icon: <Package className="w-5 h-5" />,
        color: 'info',
        loading,
        trend: ingresosAnterior ? {
          value: Math.abs(variacionPaquetes),
          direction: variacionPaquetes > 2 ? 'up' : variacionPaquetes < -2 ? 'down' : 'neutral',
          label: 'vs período anterior'
        } : undefined
      },
      {
        id: 'consultas',
        title: 'Consultas Online',
        value: `€${ingresosEntrenador.consultasOnline.toLocaleString()}`,
        subtitle: ingresosAnterior ? `vs. €${ingresosAnterior.consultasOnline.toLocaleString()} (${ingresosAnterior.periodo})` : undefined,
        icon: <Video className="w-5 h-5" />,
        color: 'success',
        loading,
        trend: ingresosAnterior ? {
          value: Math.abs(variacionConsultas),
          direction: variacionConsultas > 2 ? 'up' : variacionConsultas < -2 ? 'down' : 'neutral',
          label: 'vs período anterior'
        } : undefined
      },
      {
        id: 'total',
        title: 'Total Ingresos',
        value: `€${ingresosEntrenador.total.toLocaleString()}`,
        subtitle: variacionTotal ? `vs. €${variacionTotal.valorAnterior.toLocaleString()} (${variacionTotal.periodoAnterior})` : undefined,
        icon: <DollarSign className="w-5 h-5" />,
        color: variacionTotal?.tendencia === 'up' ? 'success' : variacionTotal?.tendencia === 'down' ? 'error' : 'primary',
        loading,
        trend: variacionTotal ? {
          value: Math.abs(variacionTotal.variacionPorcentual),
          direction: variacionTotal.tendencia,
          label: 'vs período anterior'
        } : undefined
      }
    ];

    const tableData = [
      { 
        fuente: 'Sesiones 1 a 1', 
        monto: ingresosEntrenador.sesiones1a1, 
        porcentaje: (ingresosEntrenador.sesiones1a1 / ingresosEntrenador.total * 100).toFixed(1),
        variacion: ingresosAnterior ? `${variacionSesiones > 0 ? '+' : ''}${variacionSesiones.toFixed(1)}%` : '-'
      },
      { 
        fuente: 'Paquetes Entrenamiento', 
        monto: ingresosEntrenador.paquetesEntrenamiento || ingresosEntrenador.paquetes, 
        porcentaje: ((ingresosEntrenador.paquetesEntrenamiento || ingresosEntrenador.paquetes) / ingresosEntrenador.total * 100).toFixed(1),
        variacion: ingresosAnterior ? `${variacionPaquetes > 0 ? '+' : ''}${variacionPaquetes.toFixed(1)}%` : '-'
      },
      { 
        fuente: 'Consultas Online', 
        monto: ingresosEntrenador.consultasOnline, 
        porcentaje: (ingresosEntrenador.consultasOnline / ingresosEntrenador.total * 100).toFixed(1),
        variacion: ingresosAnterior ? `${variacionConsultas > 0 ? '+' : ''}${variacionConsultas.toFixed(1)}%` : '-'
      }
    ];

    const chartData = [
      { name: 'Sesiones 1 a 1', value: ingresosEntrenador.sesiones1a1 },
      { name: 'Paquetes', value: ingresosEntrenador.paquetesEntrenamiento || ingresosEntrenador.paquetes },
      { name: 'Online', value: ingresosEntrenador.consultasOnline }
    ];

    const columns: TableColumn<typeof tableData[0]>[] = [
      { key: 'fuente', label: 'Fuente de Ingreso' },
      { key: 'monto', label: 'Monto', align: 'right', render: (val) => `€${val.toLocaleString()}` },
      { key: 'porcentaje', label: '% del Total', align: 'right', render: (val) => `${val}%` },
      { key: 'variacion', label: 'Variación', align: 'right', render: (val) => val }
    ];

    const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
            <p className="font-semibold mb-2 text-gray-900">{payload[0].name}</p>
            <p style={{ color: payload[0].color }} className="text-sm">
              €{payload[0].value.toLocaleString('es-ES')}
            </p>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="space-y-6">
        <MetricCards data={metrics} columns={4} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white shadow-sm">
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Distribución de Ingresos
              </h2>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : null}
            </div>
          </Card>

          <Card className="bg-white shadow-sm">
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Comparación de Fuentes
              </h2>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : null}
            </div>
          </Card>
        </div>

        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Desglose de Ingresos
            </h2>
            <Table data={tableData} columns={columns} loading={loading} />
          </div>
        </Card>
      </div>
    );
  }

  // Renderizado para gimnasio
  if (!facturacionGimnasio) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-8 text-center">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando facturación...</p>
        </div>
      </Card>
    );
  }

  // Calcular variaciones por línea de negocio
  const variacionCuotas = facturacionAnterior
    ? calcularVariacion(facturacionGimnasio.cuotasSocios, facturacionAnterior.cuotasSocios)
    : 0;
  const variacionPT = facturacionAnterior
    ? calcularVariacion(facturacionGimnasio.entrenamientoPersonal, facturacionAnterior.entrenamientoPersonal)
    : 0;
  const variacionTienda = facturacionAnterior
    ? calcularVariacion(facturacionGimnasio.tienda, facturacionAnterior.tienda)
    : 0;
  const variacionServicios = facturacionAnterior
    ? calcularVariacion(facturacionGimnasio.serviciosAdicionales, facturacionAnterior.serviciosAdicionales)
    : 0;

  const metrics: MetricCardData[] = [
    {
      id: 'cuotas',
      title: 'Cuotas Socios',
      value: `€${facturacionGimnasio.cuotasSocios.toLocaleString()}`,
      subtitle: facturacionAnterior ? `vs. €${facturacionAnterior.cuotasSocios.toLocaleString()} (${facturacionAnterior.periodo})` : undefined,
      icon: <Users className="w-5 h-5" />,
      color: 'primary',
      loading,
      trend: facturacionAnterior ? {
        value: Math.abs(variacionCuotas),
        direction: variacionCuotas > 2 ? 'up' : variacionCuotas < -2 ? 'down' : 'neutral',
        label: 'vs período anterior'
      } : undefined
    },
    {
      id: 'pt',
      title: 'Entrenamiento Personal',
      value: `€${facturacionGimnasio.entrenamientoPersonal.toLocaleString()}`,
      subtitle: facturacionAnterior ? `vs. €${facturacionAnterior.entrenamientoPersonal.toLocaleString()} (${facturacionAnterior.periodo})` : undefined,
      icon: <Activity className="w-5 h-5" />,
      color: 'info',
      loading,
      trend: facturacionAnterior ? {
        value: Math.abs(variacionPT),
        direction: variacionPT > 2 ? 'up' : variacionPT < -2 ? 'down' : 'neutral',
        label: 'vs período anterior'
      } : undefined
    },
    {
      id: 'tienda',
      title: 'Tienda',
      value: `€${facturacionGimnasio.tienda.toLocaleString()}`,
      subtitle: facturacionAnterior ? `vs. €${facturacionAnterior.tienda.toLocaleString()} (${facturacionAnterior.periodo})` : undefined,
      icon: <ShoppingBag className="w-5 h-5" />,
      color: 'success',
      loading,
      trend: facturacionAnterior ? {
        value: Math.abs(variacionTienda),
        direction: variacionTienda > 2 ? 'up' : variacionTienda < -2 ? 'down' : 'neutral',
        label: 'vs período anterior'
      } : undefined
    },
    {
      id: 'servicios',
      title: 'Servicios Adicionales',
      value: `€${facturacionGimnasio.serviciosAdicionales.toLocaleString()}`,
      subtitle: facturacionAnterior ? `vs. €${facturacionAnterior.serviciosAdicionales.toLocaleString()} (${facturacionAnterior.periodo})` : undefined,
      icon: <Package className="w-5 h-5" />,
      color: 'warning',
      loading,
      trend: facturacionAnterior ? {
        value: Math.abs(variacionServicios),
        direction: variacionServicios > 2 ? 'up' : variacionServicios < -2 ? 'down' : 'neutral',
        label: 'vs período anterior'
      } : undefined
    },
    {
      id: 'total',
      title: 'Total Facturación',
      value: `€${facturacionGimnasio.total.toLocaleString()}`,
      subtitle: variacionTotal ? `vs. €${variacionTotal.valorAnterior.toLocaleString()} (${variacionTotal.periodoAnterior})` : undefined,
      icon: <DollarSign className="w-5 h-5" />,
      color: variacionTotal?.tendencia === 'up' ? 'success' : variacionTotal?.tendencia === 'down' ? 'error' : 'primary',
      loading,
      trend: variacionTotal ? {
        value: Math.abs(variacionTotal.variacionPorcentual),
        direction: variacionTotal.tendencia,
        label: 'vs período anterior'
      } : undefined
    }
  ];

  const tableData = [
    { 
      linea: 'Cuotas Socios', 
      monto: facturacionGimnasio.cuotasSocios, 
      porcentaje: (facturacionGimnasio.cuotasSocios / facturacionGimnasio.total * 100).toFixed(1),
      variacion: facturacionAnterior ? `${variacionCuotas > 0 ? '+' : ''}${variacionCuotas.toFixed(1)}%` : '-'
    },
    { 
      linea: 'Entrenamiento Personal', 
      monto: facturacionGimnasio.entrenamientoPersonal, 
      porcentaje: (facturacionGimnasio.entrenamientoPersonal / facturacionGimnasio.total * 100).toFixed(1),
      variacion: facturacionAnterior ? `${variacionPT > 0 ? '+' : ''}${variacionPT.toFixed(1)}%` : '-'
    },
    { 
      linea: 'Tienda', 
      monto: facturacionGimnasio.tienda, 
      porcentaje: (facturacionGimnasio.tienda / facturacionGimnasio.total * 100).toFixed(1),
      variacion: facturacionAnterior ? `${variacionTienda > 0 ? '+' : ''}${variacionTienda.toFixed(1)}%` : '-'
    },
    { 
      linea: 'Servicios Adicionales', 
      monto: facturacionGimnasio.serviciosAdicionales, 
      porcentaje: (facturacionGimnasio.serviciosAdicionales / facturacionGimnasio.total * 100).toFixed(1),
      variacion: facturacionAnterior ? `${variacionServicios > 0 ? '+' : ''}${variacionServicios.toFixed(1)}%` : '-'
    }
  ];

  const gimnasioChartData = [
    { name: 'Cuotas Socios', value: facturacionGimnasio.cuotasSocios },
    { name: 'Entren. Personal', value: facturacionGimnasio.entrenamientoPersonal },
    { name: 'Tienda', value: facturacionGimnasio.tienda },
    { name: 'Servicios', value: facturacionGimnasio.serviciosAdicionales }
  ];

  const columns: TableColumn<typeof tableData[0]>[] = [
    { key: 'linea', label: 'Línea de Negocio' },
    { key: 'monto', label: 'Monto', align: 'right', render: (val) => `€${val.toLocaleString()}` },
    { key: 'porcentaje', label: '% del Total', align: 'right', render: (val) => `${val}%` },
    { key: 'variacion', label: 'Variación', align: 'right', render: (val) => val }
  ];

  const CustomTooltipGym = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold mb-2 text-gray-900">{payload[0].name}</p>
          <p style={{ color: payload[0].color }} className="text-sm">
            €{payload[0].value.toLocaleString('es-ES')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <MetricCards data={metrics} columns={5} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Distribución por Líneas
            </h2>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : gimnasioChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gimnasioChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltipGym />} />
                  <Legend />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </Card>

        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Comparación de Líneas
            </h2>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : gimnasioChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gimnasioChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltipGym />} />
                  <Legend />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </Card>
      </div>

      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Reparto por Líneas
          </h2>
          <Table data={tableData} columns={columns} loading={loading} />
        </div>
      </Card>
    </div>
  );
};
