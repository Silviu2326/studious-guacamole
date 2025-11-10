import React, { useState } from 'react';
import { Card, MetricCards, MetricCardData, Table, TableColumn, Button, Modal, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { DollarSign, TrendingUp, TrendingDown, Loader2, Plus, Trash2, Edit2, Receipt, GraduationCap, Megaphone, Laptop, Car, Shield, UtensilsCrossed, FolderOpen } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { gastosProfesionalesApi } from '../api';
import { GastoProfesional, ResumenGastos, CategoriaGasto } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444', '#6B7280'];

const CATEGORIAS: Array<{ value: CategoriaGasto; label: string; icon: React.ReactNode }> = [
  { value: 'equipamiento', label: 'Equipamiento', icon: <Receipt className="w-4 h-4" /> },
  { value: 'formacion', label: 'Formación', icon: <GraduationCap className="w-4 h-4" /> },
  { value: 'marketing', label: 'Marketing', icon: <Megaphone className="w-4 h-4" /> },
  { value: 'software', label: 'Software', icon: <Laptop className="w-4 h-4" /> },
  { value: 'transporte', label: 'Transporte', icon: <Car className="w-4 h-4" /> },
  { value: 'seguro', label: 'Seguro', icon: <Shield className="w-4 h-4" /> },
  { value: 'nutricion', label: 'Nutrición', icon: <UtensilsCrossed className="w-4 h-4" /> },
  { value: 'otros', label: 'Otros', icon: <FolderOpen className="w-4 h-4" /> }
];

export const GastosProfesionales: React.FC = () => {
  const { user } = useAuth();
  const [gastos, setGastos] = useState<GastoProfesional[]>([]);
  const [resumen, setResumen] = useState<ResumenGastos | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gastoEditando, setGastoEditando] = useState<GastoProfesional | null>(null);
  
  // Form state
  const [concepto, setConcepto] = useState('');
  const [categoria, setCategoria] = useState<CategoriaGasto>('otros');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [descripcion, setDescripcion] = useState('');
  const [factura, setFactura] = useState('');
  const [guardando, setGuardando] = useState(false);

  React.useEffect(() => {
    if (user?.role === 'entrenador' && user?.id) {
      cargarDatos();
    }
  }, [user?.role, user?.id]);

  const cargarDatos = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const [gastosData, resumenData] = await Promise.all([
        gastosProfesionalesApi.obtenerGastos(user.id),
        gastosProfesionalesApi.obtenerResumenGastos(user.id)
      ]);
      setGastos(gastosData);
      setResumen(resumenData);
    } catch (error) {
      console.error('Error cargando gastos:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNuevo = () => {
    setGastoEditando(null);
    setConcepto('');
    setCategoria('otros');
    setMonto('');
    setFecha(new Date().toISOString().split('T')[0]);
    setDescripcion('');
    setFactura('');
    setIsModalOpen(true);
  };

  const abrirModalEditar = (gasto: GastoProfesional) => {
    setGastoEditando(gasto);
    setConcepto(gasto.concepto);
    setCategoria(gasto.categoria);
    setMonto(gasto.monto.toString());
    setFecha(gasto.fecha);
    setDescripcion(gasto.descripcion || '');
    setFactura(gasto.factura || '');
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setGastoEditando(null);
    setConcepto('');
    setCategoria('otros');
    setMonto('');
    setFecha(new Date().toISOString().split('T')[0]);
    setDescripcion('');
    setFactura('');
  };

  const guardarGasto = async () => {
    if (!user?.id || !concepto || !monto || !fecha) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      setGuardando(true);
      if (gastoEditando) {
        await gastosProfesionalesApi.actualizarGasto(gastoEditando.id, {
          concepto,
          categoria,
          monto: parseFloat(monto),
          fecha,
          descripcion: descripcion || undefined,
          factura: factura || undefined,
          entrenadorId: user.id
        });
      } else {
        await gastosProfesionalesApi.crearGasto({
          concepto,
          categoria,
          monto: parseFloat(monto),
          fecha,
          descripcion: descripcion || undefined,
          factura: factura || undefined,
          entrenadorId: user.id
        });
      }
      await cargarDatos();
      cerrarModal();
    } catch (error) {
      console.error('Error guardando gasto:', error);
      alert('Error al guardar el gasto');
    } finally {
      setGuardando(false);
    }
  };

  const eliminarGasto = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este gasto?')) return;

    try {
      await gastosProfesionalesApi.eliminarGasto(id);
      await cargarDatos();
    } catch (error) {
      console.error('Error eliminando gasto:', error);
      alert('Error al eliminar el gasto');
    }
  };

  if (user?.role !== 'entrenador') {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-8 text-center">
          <p className="text-gray-600">
            Los gastos profesionales solo están disponibles para entrenadores.
          </p>
        </div>
      </Card>
    );
  }

  const metrics: MetricCardData[] = resumen ? [
    {
      id: 'total',
      title: 'Total Gastos',
      value: `€${resumen.total.toLocaleString()}`,
      icon: <DollarSign className="w-5 h-5" />,
      color: 'error',
      loading
    },
    {
      id: 'mes-actual',
      title: 'Mes Actual',
      value: `€${resumen.periodoActual.total.toLocaleString()}`,
      icon: <Receipt className="w-5 h-5" />,
      color: 'primary',
      loading,
      trend: resumen.periodoActual.variacion > 0 
        ? `+${resumen.periodoActual.variacion.toFixed(1)}%` 
        : `${resumen.periodoActual.variacion.toFixed(1)}%`
    },
    {
      id: 'variacion',
      title: 'Variación',
      value: `${resumen.periodoActual.variacion > 0 ? '+' : ''}${resumen.periodoActual.variacion.toFixed(1)}%`,
      icon: resumen.periodoActual.variacion > 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />,
      color: resumen.periodoActual.variacion > 0 ? 'error' : 'success',
      loading
    }
  ] : [];

  const chartDataCategorias = resumen ? Object.entries(resumen.porCategoria)
    .filter(([_, value]) => value > 0)
    .map(([categoria, value]) => ({
      name: CATEGORIAS.find(c => c.value === categoria)?.label || categoria,
      value: value
    })) : [];

  const chartDataPeriodo = resumen ? resumen.porPeriodo.map(p => ({
    mes: p.mes.split(' ')[0], // Solo el mes
    total: p.total
  })) : [];

  const tableData = gastos.map(gasto => ({
    ...gasto,
    categoriaLabel: CATEGORIAS.find(c => c.value === gasto.categoria)?.label || gasto.categoria
  }));

  const columns: TableColumn<typeof tableData[0]>[] = [
    { 
      key: 'fecha', 
      label: 'Fecha', 
      render: (val) => new Date(val).toLocaleDateString('es-ES')
    },
    { key: 'concepto', label: 'Concepto' },
    { 
      key: 'categoriaLabel', 
      label: 'Categoría',
      render: (val, row) => {
        const cat = CATEGORIAS.find(c => c.value === row.categoria);
        return (
          <div className="flex items-center gap-2">
            {cat?.icon}
            <span>{val}</span>
          </div>
        );
      }
    },
    { 
      key: 'monto', 
      label: 'Monto', 
      align: 'right', 
      render: (val) => `€${val.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
    },
    { 
      key: 'descripcion', 
      label: 'Descripción',
      render: (val) => val ? (
        <span className="text-sm text-gray-600 truncate max-w-xs" title={val}>
          {val.length > 40 ? `${val.substring(0, 40)}...` : val}
        </span>
      ) : (
        <span className="text-sm text-gray-400">-</span>
      )
    },
    {
      key: 'acciones',
      label: 'Acciones',
      align: 'center',
      render: (val, row) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => abrirModalEditar(row)}
            leftIcon={<Edit2 className="w-4 h-4" />}
          >
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => eliminarGasto(row.id)}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Eliminar
          </Button>
        </div>
      )
    }
  ];

  const opcionesCategoria = CATEGORIAS.map(cat => ({
    value: cat.value,
    label: cat.label
  }));

  return (
    <div className="space-y-6">
      {/* Header con botón de añadir */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gastos Profesionales</h2>
          <p className="text-gray-600 mt-1">
            Registra y gestiona tus gastos profesionales para calcular tu beneficio neto
          </p>
        </div>
        <Button
          variant="primary"
          onClick={abrirModalNuevo}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Añadir Gasto
        </Button>
      </div>

      {/* Métricas */}
      <MetricCards data={metrics} columns={3} />

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Gastos por Categoría
            </h3>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : chartDataCategorias.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartDataCategorias}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartDataCategorias.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '8px',
                    }}
                    formatter={(value: number) => `€${value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Receipt className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay gastos registrados</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Evolución de Gastos (Últimos 6 Meses)
            </h3>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : chartDataPeriodo.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartDataPeriodo}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="mes" 
                    tick={{ fill: '#64748B', fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fill: '#64748B', fontSize: 12 }}
                    tickFormatter={(value) => `€${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '8px',
                    }}
                    formatter={(value: number) => `€${value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Total Gastos"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay datos disponibles</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Tabla de gastos */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Lista de Gastos
          </h3>
          <Table 
            data={tableData} 
            columns={columns} 
            loading={loading} 
            emptyMessage="No hay gastos registrados. Añade tu primer gasto para comenzar."
          />
        </div>
      </Card>

      {/* Modal para crear/editar gasto */}
      <Modal
        isOpen={isModalOpen}
        onClose={cerrarModal}
        title={gastoEditando ? 'Editar Gasto' : 'Nuevo Gasto Profesional'}
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={cerrarModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={guardarGasto} loading={guardando}>
              {gastoEditando ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Concepto *"
            value={concepto}
            onChange={(e) => setConcepto(e.target.value)}
            placeholder="Ej: Suscripción MyFitnessPal Pro"
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Categoría *"
              options={opcionesCategoria}
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as CategoriaGasto)}
              required
            />
            
            <Input
              label="Monto (€) *"
              type="number"
              step="0.01"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <Input
            label="Fecha *"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />

          <Input
            label="Número de Factura (opcional)"
            value={factura}
            onChange={(e) => setFactura(e.target.value)}
            placeholder="Ej: FAC-2024-001"
          />

          <Textarea
            label="Descripción (opcional)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Añade detalles sobre este gasto..."
            rows={3}
          />
        </div>
      </Modal>
    </div>
  );
};

