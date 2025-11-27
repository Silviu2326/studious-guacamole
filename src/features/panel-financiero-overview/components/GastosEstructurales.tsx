import React from 'react';
import { Card, MetricCards, MetricCardData, Table, TableColumn } from '../../../components/componentsreutilizables';
import { Building2, Users, Wrench, Zap, DollarSign } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { gastosApi } from '../api';
import { CostesEstructurales } from '../types';

/**
 * Props para el componente GastosEstructurales
 */
export interface GastosEstructuralesProps {
  /**
   * Período específico para obtener los costes estructurales.
   * Si no se proporciona, se usa el mes y año actual.
   */
  periodo?: {
    mes: number; // 1-12
    anio: number;
  };
  /**
   * Filtros de fecha alternativos.
   * Si se proporciona, se extraerá el mes y año de la fecha de inicio.
   */
  filtrosFecha?: {
    fechaInicio?: Date;
    fechaFin?: Date;
  };
}

/**
 * Componente para mostrar los costes fijos (estructurales) del gimnasio.
 * 
 * Este componente muestra un desglose detallado de los costes fijos que tiene
 * un gimnasio, incluyendo:
 * - Alquiler del local
 * - Salarios del personal
 * - Equipamiento y mantenimiento
 * - Servicios básicos (luz, agua, etc.)
 * - Otros costes no categorizados
 * - Total de costes estructurales
 * 
 * IMPORTANTE: Este componente solo es relevante para el rol "gimnasio".
 * Los entrenadores individuales no tienen costes estructurales de este tipo,
 * por lo que se mostrará un mensaje informativo si se accede con rol "entrenador".
 * 
 * El componente puede recibir un período específico o usar el mes/año actual por defecto.
 */
export const GastosEstructurales: React.FC<GastosEstructuralesProps> = ({ 
  periodo,
  filtrosFecha 
}) => {
  const { user } = useAuth();
  const [costes, setCostes] = React.useState<CostesEstructurales | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const cargarCostes = async () => {
      try {
        setLoading(true);
        if (user?.role === 'gimnasio') {
          // Determinar el período a usar
          let periodoAUsar: { mes: number; anio: number };
          
          if (periodo) {
            periodoAUsar = periodo;
          } else if (filtrosFecha?.fechaInicio) {
            const fecha = filtrosFecha.fechaInicio;
            periodoAUsar = {
              mes: fecha.getMonth() + 1,
              anio: fecha.getFullYear()
            };
          } else {
            // Por defecto: mes y año actual
            const ahora = new Date();
            periodoAUsar = {
              mes: ahora.getMonth() + 1,
              anio: ahora.getFullYear()
            };
          }
          
          const data = await gastosApi.getCostesEstructurales(periodoAUsar);
          setCostes(data);
        }
      } catch (error) {
        console.error('Error cargando costes:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarCostes();
  }, [user?.role, periodo, filtrosFecha]);

  // Este componente no es relevante para entrenadores individuales
  // Los entrenadores no tienen costes estructurales como alquiler, salarios, etc.
  if (user?.role === 'entrenador') {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-8 text-center">
          <p className="text-gray-600">
            Los costes estructurales solo están disponibles para gimnasios.
            <br />
            <span className="text-sm text-gray-500 mt-2 block">
              Este componente no es relevante para entrenadores individuales.
            </span>
          </p>
        </div>
      </Card>
    );
  }

  const metrics: MetricCardData[] = costes ? [
    {
      id: 'alquiler',
      title: 'Alquiler',
      value: `€${costes.alquiler.toLocaleString()}`,
      icon: <Building2 className="w-5 h-5" />,
      color: 'primary',
      loading
    },
    {
      id: 'salarios',
      title: 'Salarios',
      value: `€${costes.salarios.toLocaleString()}`,
      icon: <Users className="w-5 h-5" />,
      color: 'info',
      loading
    },
    {
      id: 'equipamiento',
      title: 'Equipamiento',
      value: `€${costes.equipamiento.toLocaleString()}`,
      icon: <Wrench className="w-5 h-5" />,
      color: 'warning',
      loading
    },
    {
      id: 'servicios',
      title: 'Servicios Básicos',
      value: `€${costes.serviciosBasicos.toLocaleString()}`,
      icon: <Zap className="w-5 h-5" />,
      color: 'success',
      loading
    },
    {
      id: 'total',
      title: 'Total Costes',
      value: `€${costes.total.toLocaleString()}`,
      icon: <DollarSign className="w-5 h-5" />,
      color: 'error',
      loading
    }
  ] : [];

  const tableData = costes ? [
    { concepto: 'Alquiler del Local', monto: costes.alquiler, porcentaje: (costes.alquiler / costes.total * 100).toFixed(1) },
    { concepto: 'Salarios del Personal', monto: costes.salarios, porcentaje: (costes.salarios / costes.total * 100).toFixed(1) },
    { concepto: 'Equipamiento y Mantenimiento', monto: costes.equipamiento, porcentaje: (costes.equipamiento / costes.total * 100).toFixed(1) },
    { concepto: 'Servicios Básicos', monto: costes.serviciosBasicos, porcentaje: (costes.serviciosBasicos / costes.total * 100).toFixed(1) },
    { concepto: 'Otros Costes', monto: costes.otros, porcentaje: (costes.otros / costes.total * 100).toFixed(1) }
  ] : [];

  const columns: TableColumn<typeof tableData[0]>[] = [
    { key: 'concepto', label: 'Concepto' },
    { key: 'monto', label: 'Monto', align: 'right', render: (val) => `€${val.toLocaleString()}` },
    { key: 'porcentaje', label: '% del Total', align: 'right', render: (val) => `${val}%` }
  ];

  return (
    <div className="space-y-6">
      <MetricCards data={metrics} columns={5} />
      
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Desglose de Costes
          </h2>
          <Table data={tableData} columns={columns} loading={loading} />
        </div>
      </Card>
    </div>
  );
};

