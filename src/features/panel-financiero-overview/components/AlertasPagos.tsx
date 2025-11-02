import React from 'react';
import { Card, Table, TableColumn, Badge } from '../../../components/componentsreutilizables';
import { AlertTriangle, Clock, Bell, DollarSign } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { alertasApi } from '../api';
import { AlertaPago, ClientePagoPendiente } from '../types';

export const AlertasPagos: React.FC = () => {
  const { user } = useAuth();
  const [alertas, setAlertas] = React.useState<AlertaPago[]>([]);
  const [pendientes, setPendientes] = React.useState<ClientePagoPendiente[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const cargarAlertas = async () => {
      try {
        setLoading(true);
        const [alertasData, pendientesData] = await Promise.all([
          alertasApi.obtenerAlertas(),
          alertasApi.obtenerClientesPendientes()
        ]);
        setAlertas(alertasData);
        setPendientes(pendientesData);
      } catch (error) {
        console.error('Error cargando alertas:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarAlertas();
  }, []);

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'vencido':
        return <AlertTriangle className="w-4 h-4" />;
      case 'por_vencer':
        return <Clock className="w-4 h-4" />;
      case 'recordatorio':
        return <Bell className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getPrioridadBadge = (prioridad: string) => {
    const variants = {
      alta: 'red' as const,
      media: 'yellow' as const,
      baja: 'blue' as const
    };
    return <Badge variant={variants[prioridad as keyof typeof variants] || 'gray'}>{prioridad}</Badge>;
  };

  const getRiesgoBadge = (riesgo: string) => {
    const variants = {
      alto: 'red' as const,
      medio: 'yellow' as const,
      bajo: 'green' as const
    };
    return <Badge variant={variants[riesgo as keyof typeof variants] || 'gray'}>{riesgo}</Badge>;
  };

  const alertasColumns: TableColumn<AlertaPago>[] = [
    { 
      key: 'tipo', 
      label: 'Tipo', 
      render: (val) => (
        <div className="flex items-center gap-2">
          {getTipoIcon(val)}
          <span className="capitalize">{val.replace('_', ' ')}</span>
        </div>
      )
    },
    { key: 'cliente', label: 'Cliente' },
    { 
      key: 'monto', 
      label: 'Monto', 
      align: 'right', 
      render: (val) => `€${val.toLocaleString()}` 
    },
    { 
      key: 'fecha', 
      label: 'Fecha', 
      render: (val) => new Date(val).toLocaleDateString('es-ES')
    },
    { 
      key: 'prioridad', 
      label: 'Prioridad', 
      render: (val) => getPrioridadBadge(val)
    }
  ];

  const pendientesColumns: TableColumn<ClientePagoPendiente>[] = [
    { key: 'nombre', label: 'Cliente' },
    { key: 'servicio', label: 'Servicio' },
    { 
      key: 'monto', 
      label: 'Monto', 
      align: 'right', 
      render: (val) => `€${val.toLocaleString()}` 
    },
    { 
      key: 'diasVencidos', 
      label: 'Días Vencidos', 
      align: 'right',
      render: (val) => `${val} días`
    },
    { 
      key: 'fechaVencimiento', 
      label: 'Fecha Vencimiento', 
      render: (val) => new Date(val).toLocaleDateString('es-ES')
    },
    { 
      key: 'riesgo', 
      label: 'Riesgo', 
      render: (val) => getRiesgoBadge(val)
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Alertas de Pagos
            </h2>
          </div>
          <Table data={alertas} columns={alertasColumns} loading={loading} emptyMessage="No hay alertas disponibles" />
        </div>
      </Card>

      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-amber-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {user?.role === 'entrenador' ? 'Quién No Ha Pagado' : 'Pagos Pendientes'}
            </h2>
          </div>
          <Table data={pendientes} columns={pendientesColumns} loading={loading} emptyMessage="No hay pagos pendientes" />
        </div>
      </Card>
    </div>
  );
};

