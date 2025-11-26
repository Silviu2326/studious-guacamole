import React from 'react';
import { Card, MetricCards, MetricCardData, Table, TableColumn, Button, Modal, Input, Select } from '../../../components/componentsreutilizables';
import { DollarSign, TrendingUp, Package, Video, Users, Loader2, Plus } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { ingresosApi } from '../api';
import { IngresosEntrenador, FacturacionGimnasio } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const MetricasIngresos: React.FC = () => {
  const { user } = useAuth();
  const [ingresosEntrenador, setIngresosEntrenador] = React.useState<IngresosEntrenador | null>(null);
  const [facturacionGimnasio, setFacturacionGimnasio] = React.useState<FacturacionGimnasio | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [monto, setMonto] = React.useState('');
  const [categoria, setCategoria] = React.useState('');

  React.useEffect(() => {
    const cargarIngresos = async () => {
      try {
        setLoading(true);
        if (user?.role === 'entrenador') {
          const data = await ingresosApi.obtenerIngresosDetalladosEntrenador();
          setIngresosEntrenador(data);
        } else {
          const data = await ingresosApi.obtenerFacturacionDetalladaGimnasio();
          setFacturacionGimnasio(data);
        }
      } catch (error) {
        console.error('Error cargando ingresos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarIngresos();
  }, [user?.role]);

  const COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

  if (user?.role === 'entrenador') {
    const metrics: MetricCardData[] = ingresosEntrenador ? [
      {
        id: 'sesiones',
        title: 'Sesiones 1 a 1',
        value: `€${ingresosEntrenador.sesiones1a1.toLocaleString()}`,
        icon: <Users className="w-5 h-5" />,
        color: 'primary',
        loading
      },
      {
        id: 'paquetes',
        title: 'Paquetes Entrenamiento',
        value: `€${ingresosEntrenador.paquetesEntrenamiento.toLocaleString()}`,
        icon: <Package className="w-5 h-5" />,
        color: 'info',
        loading
      },
      {
        id: 'consultas',
        title: 'Consultas Online',
        value: `€${ingresosEntrenador.consultasOnline.toLocaleString()}`,
        icon: <Video className="w-5 h-5" />,
        color: 'success',
        loading
      },
      {
        id: 'total',
        title: 'Total Ingresos',
        value: `€${ingresosEntrenador.total.toLocaleString()}`,
        icon: <DollarSign className="w-5 h-5" />,
        color: 'primary',
        loading
      }
    ] : [];

    const tableData = ingresosEntrenador ? [
      { fuente: 'Sesiones 1 a 1', monto: ingresosEntrenador.sesiones1a1, porcentaje: (ingresosEntrenador.sesiones1a1 / ingresosEntrenador.total * 100).toFixed(1) },
      { fuente: 'Paquetes Entrenamiento', monto: ingresosEntrenador.paquetesEntrenamiento, porcentaje: (ingresosEntrenador.paquetesEntrenamiento / ingresosEntrenador.total * 100).toFixed(1) },
      { fuente: 'Consultas Online', monto: ingresosEntrenador.consultasOnline, porcentaje: (ingresosEntrenador.consultasOnline / ingresosEntrenador.total * 100).toFixed(1) }
    ] : [];

    const chartData = ingresosEntrenador ? [
      { name: 'Sesiones 1 a 1', value: ingresosEntrenador.sesiones1a1 },
      { name: 'Paquetes', value: ingresosEntrenador.paquetesEntrenamiento },
      { name: 'Online', value: ingresosEntrenador.consultasOnline }
    ] : [];

    const columns: TableColumn<typeof tableData[0]>[] = [
      { key: 'fuente', label: 'Fuente de Ingreso' },
      { key: 'monto', label: 'Monto', align: 'right', render: (val) => `€${val.toLocaleString()}` },
      { key: 'porcentaje', label: '% del Total', align: 'right', render: (val) => `${val}%` }
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
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
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
                    <Bar dataKey="value" fill="#3B82F6">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : null}
            </div>
          </Card>
        </div>

        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Desglose de Ingresos
              </h2>
              <Button 
                variant="primary" 
                onClick={() => setIsModalOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Añadir Ingreso
              </Button>
            </div>
            <Table data={tableData} columns={columns} loading={loading} />
          </div>
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Añadir Nuevo Ingreso"
          size="md"
          footer={
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={() => {
                console.log('Guardar ingreso:', { monto, categoria });
                setIsModalOpen(false);
                setMonto('');
                setCategoria('');
              }}>
                Guardar
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Select
              label="Categoría"
              options={[
                { value: 'sesiones1a1', label: 'Sesiones 1 a 1' },
                { value: 'paquetes', label: 'Paquetes Entrenamiento' },
                { value: 'online', label: 'Consultas Online' }
              ]}
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Selecciona una categoría"
            />
            
            <Input
              label="Monto"
              type="number"
              placeholder="0.00"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              leftIcon={<DollarSign className="w-5 h-5" />}
            />
          </div>
        </Modal>
      </div>
    );
  }

  // Gimnasio
  const metrics: MetricCardData[] = facturacionGimnasio ? [
    {
      id: 'cuotas',
      title: 'Cuotas Socios',
      value: `€${facturacionGimnasio.cuotasSocios.toLocaleString()}`,
      icon: <Users className="w-5 h-5" />,
      color: 'primary',
      loading
    },
    {
      id: 'pt',
      title: 'Entrenamiento Personal',
      value: `€${facturacionGimnasio.entrenamientoPersonal.toLocaleString()}`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'info',
      loading
    },
    {
      id: 'tienda',
      title: 'Tienda',
      value: `€${facturacionGimnasio.tienda.toLocaleString()}`,
      icon: <Package className="w-5 h-5" />,
      color: 'success',
      loading
    },
    {
      id: 'servicios',
      title: 'Servicios Adicionales',
      value: `€${facturacionGimnasio.serviciosAdicionales.toLocaleString()}`,
      icon: <DollarSign className="w-5 h-5" />,
      color: 'warning',
      loading
    }
  ] : [];

  const tableData = facturacionGimnasio ? [
    { linea: 'Cuotas Socios', monto: facturacionGimnasio.cuotasSocios, porcentaje: (facturacionGimnasio.cuotasSocios / facturacionGimnasio.total * 100).toFixed(1) },
    { linea: 'Entrenamiento Personal', monto: facturacionGimnasio.entrenamientoPersonal, porcentaje: (facturacionGimnasio.entrenamientoPersonal / facturacionGimnasio.total * 100).toFixed(1) },
    { linea: 'Tienda', monto: facturacionGimnasio.tienda, porcentaje: (facturacionGimnasio.tienda / facturacionGimnasio.total * 100).toFixed(1) },
    { linea: 'Servicios Adicionales', monto: facturacionGimnasio.serviciosAdicionales, porcentaje: (facturacionGimnasio.serviciosAdicionales / facturacionGimnasio.total * 100).toFixed(1) }
  ] : [];

  const gimnasioChartData = facturacionGimnasio ? [
    { name: 'Cuotas Socios', value: facturacionGimnasio.cuotasSocios },
    { name: 'Entren. Personal', value: facturacionGimnasio.entrenamientoPersonal },
    { name: 'Tienda', value: facturacionGimnasio.tienda },
    { name: 'Servicios', value: facturacionGimnasio.serviciosAdicionales }
  ] : [];

  const columns: TableColumn<typeof tableData[0]>[] = [
    { key: 'linea', label: 'Línea de Negocio' },
    { key: 'monto', label: 'Monto', align: 'right', render: (val) => `€${val.toLocaleString()}` },
    { key: 'porcentaje', label: '% del Total', align: 'right', render: (val) => `${val}%` }
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
      <MetricCards data={metrics} columns={4} />
      
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
                <PieChart>
                  <Pie
                    data={gimnasioChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {gimnasioChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltipGym />} />
                </PieChart>
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
                  <Bar dataKey="value" fill="#3B82F6">
                    {gimnasioChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </Card>
      </div>

      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Reparto por Líneas
            </h2>
            <Button 
              variant="primary" 
              onClick={() => setIsModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Añadir Ingreso
            </Button>
          </div>
          <Table data={tableData} columns={columns} loading={loading} />
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Añadir Nuevo Ingreso"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => {
              console.log('Guardar ingreso:', { monto, categoria });
              setIsModalOpen(false);
              setMonto('');
              setCategoria('');
            }}>
              Guardar
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Select
            label="Categoría"
            options={
              user?.role === 'entrenador' 
                ? [
                    { value: 'sesiones1a1', label: 'Sesiones 1 a 1' },
                    { value: 'paquetes', label: 'Paquetes Entrenamiento' },
                    { value: 'online', label: 'Consultas Online' }
                  ]
                : [
                    { value: 'cuotas', label: 'Cuotas Socios' },
                    { value: 'entrenamiento', label: 'Entrenamiento Personal' },
                    { value: 'tienda', label: 'Tienda' },
                    { value: 'servicios', label: 'Servicios Adicionales' }
                  ]
            }
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Selecciona una categoría"
          />
          
          <Input
            label="Monto"
            type="number"
            placeholder="0.00"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            leftIcon={<DollarSign className="w-5 h-5" />}
          />
        </div>
      </Modal>
    </div>
  );
};

