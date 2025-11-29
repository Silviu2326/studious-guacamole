import React, { useState, useEffect } from 'react';
import { Card, Button, MetricCards, Table, Modal, Input, Select } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { getGastos, createGasto, updateGasto, deleteGasto, aprobarGasto, pagarGasto } from '../api/gastos';
import { getCategorias } from '../api/categorias';
import { getProveedores } from '../api/proveedores';
import { Gasto, CategoriaGasto, Proveedor } from '../types';
import { Receipt, Plus, CheckCircle, XCircle, DollarSign, ArrowUp, ArrowDown, Search } from 'lucide-react';

export const GastosManager: React.FC = () => {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [categorias, setCategorias] = useState<CategoriaGasto[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [gastoSeleccionado, setGastoSeleccionado] = useState<Gasto | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('');

  const [formData, setFormData] = useState({
    concepto: '',
    categoria: '',
    monto: '',
    tipo: 'operativo' as const,
    proveedorId: '',
    metodoPago: 'transferencia' as const,
    descripcion: '',
    factura: '',
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [gastosData, categoriasData, proveedoresData] = await Promise.all([
        getGastos(),
        getCategorias(),
        getProveedores({ activo: true }),
      ]);
      setGastos(gastosData);
      setCategorias(categoriasData);
      setProveedores(proveedoresData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearGasto = () => {
    setGastoSeleccionado(null);
    setFormData({
      concepto: '',
      categoria: '',
      monto: '',
      tipo: 'operativo',
      proveedorId: '',
      metodoPago: 'transferencia',
      descripcion: '',
      factura: '',
    });
    setMostrarModal(true);
  };

  const handleEditarGasto = (gasto: Gasto) => {
    setGastoSeleccionado(gasto);
    setFormData({
      concepto: gasto.concepto,
      categoria: gasto.categoria,
      monto: gasto.monto.toString(),
      tipo: gasto.tipo,
      proveedorId: gasto.proveedorId || '',
      metodoPago: gasto.metodoPago,
      descripcion: gasto.descripcion || '',
      factura: gasto.factura || '',
    });
    setMostrarModal(true);
  };

  const handleGuardarGasto = async () => {
    try {
      const gastoData = {
        ...formData,
        monto: parseFloat(formData.monto),
        fecha: gastoSeleccionado?.fecha || new Date(),
        estado: gastoSeleccionado?.estado || 'pendiente',
        usuario: 'admin',
      };

      if (gastoSeleccionado) {
        await updateGasto(gastoSeleccionado.id, gastoData);
      } else {
        await createGasto(gastoData as Omit<Gasto, 'id'>);
      }
      await cargarDatos();
      setMostrarModal(false);
    } catch (error) {
      console.error('Error al guardar gasto:', error);
    }
  };

  const handleAprobarGasto = async (id: string) => {
    try {
      await aprobarGasto(id);
      await cargarDatos();
    } catch (error) {
      console.error('Error al aprobar gasto:', error);
    }
  };

  const handlePagarGasto = async (id: string) => {
    try {
      await pagarGasto(id);
      await cargarDatos();
    } catch (error) {
      console.error('Error al pagar gasto:', error);
    }
  };

  const handleEliminarGasto = async (id: string) => {
    if (confirm('¿Está seguro de eliminar este gasto?')) {
      try {
        await deleteGasto(id);
        await cargarDatos();
      } catch (error) {
        console.error('Error al eliminar gasto:', error);
      }
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { color: string; label: string }> = {
      pendiente: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendiente' },
      aprobado: { color: 'bg-blue-100 text-blue-800', label: 'Aprobado' },
      pagado: { color: 'bg-green-100 text-green-800', label: 'Pagado' },
      rechazado: { color: 'bg-red-100 text-red-800', label: 'Rechazado' },
    };
    const estadoInfo = estados[estado] || estados.pendiente;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoInfo.color}`}>
        {estadoInfo.label}
      </span>
    );
  };

  const gastosFiltrados = gastos.filter(gasto => {
    const matchBusqueda = busqueda === '' || 
      gasto.concepto.toLowerCase().includes(busqueda.toLowerCase()) ||
      gasto.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
      gasto.proveedor?.toLowerCase().includes(busqueda.toLowerCase());
    const matchEstado = filtroEstado === '' || gasto.estado === filtroEstado;
    return matchBusqueda && matchEstado;
  });

  const totalGastos = gastosFiltrados.reduce((sum, g) => sum + g.monto, 0);
  const gastosPendientes = gastosFiltrados.filter(g => g.estado === 'pendiente').length;
  const gastosPagados = gastosFiltrados.filter(g => g.estado === 'pagado').reduce((sum, g) => sum + g.monto, 0);

  const metricas = [
    {
      id: 'total-gastos',
      title: 'Total Gastos',
      value: formatearMoneda(totalGastos),
      subtitle: `${gastosFiltrados.length} registros`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'primary' as const,
    },
    {
      id: 'gastos-pendientes',
      title: 'Pendientes',
      value: gastosPendientes.toString(),
      subtitle: 'Por aprobar',
      icon: <ArrowUp className="w-6 h-6" />,
      color: 'warning' as const,
    },
    {
      id: 'gastos-pagados',
      title: 'Pagados',
      value: formatearMoneda(gastosPagados),
      subtitle: 'Este período',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'success' as const,
    },
  ];

  const columnas = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value: Date) => value.toLocaleDateString('es-CO'),
    },
    {
      key: 'concepto',
      label: 'Concepto',
    },
    {
      key: 'categoria',
      label: 'Categoría',
    },
    {
      key: 'proveedor',
      label: 'Proveedor',
      render: (value: string | undefined) => value || 'N/A',
    },
    {
      key: 'monto',
      label: 'Monto',
      render: (value: number) => formatearMoneda(value),
      align: 'right' as const,
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: string) => getEstadoBadge(value),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: Gasto) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditarGasto(row)}
            className="text-blue-600 hover:text-blue-800"
            title="Editar"
          >
            Editar
          </button>
          {row.estado === 'pendiente' && (
            <button
              onClick={() => handleAprobarGasto(row.id)}
              className="text-green-600 hover:text-green-800"
              title="Aprobar"
            >
              Aprobar
            </button>
          )}
          {row.estado === 'aprobado' && (
            <button
              onClick={() => handlePagarGasto(row.id)}
              className="text-purple-600 hover:text-purple-800"
              title="Marcar como Pagado"
            >
              Pagar
            </button>
          )}
          <button
            onClick={() => handleEliminarGasto(row.id)}
            className="text-red-600 hover:text-red-800"
            title="Eliminar"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar Superior */}
      <div className="flex items-center justify-end">
        <Button onClick={handleCrearGasto}>
          <Plus size={20} className="mr-2" />
          Nuevo Gasto
        </Button>
      </div>

      {/* Métricas/KPIs */}
      <MetricCards data={metricas} columns={3} />

      {/* Sistema de Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
                  <div className="flex-1 relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search size={20} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar gastos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
              <div className="w-48">
                <Select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  options={[
                    { value: '', label: 'Todos los estados' },
                    { value: 'pendiente', label: 'Pendiente' },
                    { value: 'aprobado', label: 'Aprobado' },
                    { value: 'pagado', label: 'Pagado' },
                    { value: 'rechazado', label: 'Rechazado' },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabla de Gastos */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <Table
            data={gastosFiltrados}
            columns={columnas}
            loading={loading}
            emptyMessage="No hay gastos registrados"
          />
        </div>
      </Card>

      <Modal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        title={gastoSeleccionado ? 'Editar Gasto' : 'Nuevo Gasto'}
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setMostrarModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleGuardarGasto}>
              {gastoSeleccionado ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Concepto"
            value={formData.concepto}
            onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Categoría"
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              options={categorias.map(c => ({ value: c.nombre, label: c.nombre }))}
              required
            />
            <Select
              label="Tipo"
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
              options={[
                { value: 'operativo', label: 'Operativo' },
                { value: 'inversion', label: 'Inversión' },
                { value: 'mantenimiento', label: 'Mantenimiento' },
              ]}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Monto"
              type="number"
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
              required
            />
            <Select
              label="Método de Pago"
              value={formData.metodoPago}
              onChange={(e) => setFormData({ ...formData, metodoPago: e.target.value as any })}
              options={[
                { value: 'efectivo', label: 'Efectivo' },
                { value: 'transferencia', label: 'Transferencia' },
                { value: 'tarjeta', label: 'Tarjeta' },
                { value: 'cheque', label: 'Cheque' },
              ]}
              required
            />
          </div>
          <Select
            label="Proveedor (Opcional)"
            value={formData.proveedorId}
            onChange={(e) => setFormData({ ...formData, proveedorId: e.target.value })}
            options={[
              { value: '', label: 'Sin proveedor' },
              ...proveedores.map(p => ({ value: p.id, label: p.nombre })),
            ]}
          />
          <Input
            label="Número de Factura (Opcional)"
            value={formData.factura}
            onChange={(e) => setFormData({ ...formData, factura: e.target.value })}
          />
          <Input
            label="Descripción"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            fullWidth
          />
        </div>
      </Modal>
    </div>
  );
};

