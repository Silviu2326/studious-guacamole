import React from 'react';
import { Card, MetricCards, MetricCardData, Table, TableColumn } from '../../../components/componentsreutilizables';
import { Building2, Users, Wrench, Zap, DollarSign } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { gastosApi } from '../api';
import { CostesEstructurales } from '../types';

export const GastosEstructurales: React.FC = () => {
  const { user } = useAuth();
  const [costes, setCostes] = React.useState<CostesEstructurales | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const cargarCostes = async () => {
      try {
        setLoading(true);
        if (user?.role === 'gimnasio') {
          const data = await gastosApi.obtenerCostesEstructurales();
          setCostes(data);
        }
      } catch (error) {
        console.error('Error cargando costes:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarCostes();
  }, [user?.role]);

  if (user?.role === 'entrenador') {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-8 text-center">
          <p className="text-gray-600">
            Los costes estructurales solo están disponibles para gimnasios.
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
    { concepto: 'Servicios Básicos', monto: costes.serviciosBasicos, porcentaje: (costes.serviciosBasicos / costes.total * 100).toFixed(1) }
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

