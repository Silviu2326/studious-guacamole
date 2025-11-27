import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Input } from '../../../components/componentsreutilizables';
import { getBonosByClientes, ClienteBonoInfo } from '../api/bonos';
import { Users, Calendar, AlertCircle, CheckCircle, Clock, Search } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface GestorBonosClientesProps {
  entrenadorId?: string;
}

export const GestorBonosClientes: React.FC<GestorBonosClientesProps> = ({
  entrenadorId,
}) => {
  const { user } = useAuth();
  const [clientesBonos, setClientesBonos] = useState<ClienteBonoInfo[]>([]);
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [clienteExpandido, setClienteExpandido] = useState<string | null>(null);

  useEffect(() => {
    cargarBonos();
  }, [entrenadorId]);

  const cargarBonos = async () => {
    setCargando(true);
    try {
      const idEntrenador = entrenadorId || user?.id;
      const data = await getBonosByClientes(idEntrenador);
      setClientesBonos(data);
    } catch (error) {
      console.error('Error cargando bonos:', error);
    } finally {
      setCargando(false);
    }
  };

  const clientesFiltrados = clientesBonos.filter((cliente) => {
    // Filtro de búsqueda
    const coincideBusqueda =
      cliente.clienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.clienteEmail.toLowerCase().includes(busqueda.toLowerCase());

    // Filtro de estado
    if (filtroEstado === 'todos') {
      return coincideBusqueda;
    }

    const tieneBonosConEstado = cliente.bonos.some((b) => b.estado === filtroEstado);
    return coincideBusqueda && tieneBonosConEstado;
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'success';
      case 'vencido':
        return 'error';
      case 'agotado':
        return 'warning';
      case 'suspendido':
        return 'info';
      default:
        return 'info';
    }
  };

  const formatoFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(fecha));
  };

  const diasHastaVencimiento = (fechaVencimiento: Date): number => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const vencimiento = new Date(fechaVencimiento);
    vencimiento.setHours(0, 0, 0, 0);
    const diffTime = vencimiento.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getAlertaVencimiento = (fechaVencimiento: Date, estado: string) => {
    if (estado !== 'activo') return null;
    const dias = diasHastaVencimiento(fechaVencimiento);
    if (dias < 0) return { tipo: 'vencido', mensaje: 'Bono vencido' };
    if (dias <= 7) return { tipo: 'urgente', mensaje: `Vence en ${dias} días` };
    if (dias <= 30) return { tipo: 'advertencia', mensaje: `Vence en ${dias} días` };
    return null;
  };

  const columnas = [
    {
      key: 'cliente',
      label: 'Cliente',
      render: (_: any, cliente: ClienteBonoInfo) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{cliente.clienteNombre}</p>
          <p className="text-xs text-gray-600">{cliente.clienteEmail}</p>
        </div>
      ),
    },
    {
      key: 'bonos',
      label: 'Bonos Activos',
      render: (_: any, cliente: ClienteBonoInfo) => (
        <span className="text-sm text-gray-900">
          {cliente.bonos.filter((b) => b.estado === 'activo').length}
        </span>
      ),
    },
    {
      key: 'sesiones',
      label: 'Sesiones Totales',
      render: (_: any, cliente: ClienteBonoInfo) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{cliente.totalSesiones}</p>
          <p className="text-xs text-gray-600">
            {cliente.sesionesUsadas} usadas / {cliente.sesionesRestantes} restantes
          </p>
        </div>
      ),
    },
    {
      key: 'progreso',
      label: 'Progreso',
      render: (_: any, cliente: ClienteBonoInfo) => {
        const porcentaje = cliente.totalSesiones > 0
          ? Math.round((cliente.sesionesUsadas / cliente.totalSesiones) * 100)
          : 0;
        return (
          <div className="w-full max-w-[120px]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">{porcentaje}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, cliente: ClienteBonoInfo) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            setClienteExpandido(
              clienteExpandido === cliente.clienteId ? null : cliente.clienteId
            )
          }
        >
          {clienteExpandido === cliente.clienteId ? 'Ocultar' : 'Ver Detalles'}
        </Button>
      ),
      align: 'right' as const,
    },
  ];

  const resumen = {
    totalClientes: clientesBonos.length,
    bonosActivos: clientesBonos.reduce(
      (sum, c) => sum + c.bonos.filter((b) => b.estado === 'activo').length,
      0
    ),
    sesionesPendientes: clientesBonos.reduce((sum, c) => sum + c.sesionesRestantes, 0),
    bonosPorVencer: clientesBonos.reduce((sum, c) => {
      return (
        sum +
        c.bonos.filter((b) => {
          if (b.estado !== 'activo') return false;
          const dias = diasHastaVencimiento(b.fechaVencimiento);
          return dias > 0 && dias <= 30;
        }).length
      );
    }, 0),
  };

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{resumen.totalClientes}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Bonos Activos</p>
              <p className="text-2xl font-bold text-gray-900">{resumen.bonosActivos}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Sesiones Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">
                {resumen.sesionesPendientes}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Por Vencer (30 días)</p>
              <p className="text-2xl font-bold text-gray-900">
                {resumen.bonosPorVencer}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <AlertCircle size={24} className="text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Búsqueda y Filtros */}
      <Card className="p-4 bg-white shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search size={20} className="text-gray-400" />
            <Input
              placeholder="Buscar por nombre o email del cliente..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filtrar por estado:</label>
            <Select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              options={[
                { value: 'todos', label: 'Todos' },
                { value: 'activo', label: 'Activos' },
                { value: 'vencido', label: 'Vencidos' },
                { value: 'agotado', label: 'Agotados' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Tabla de clientes */}
      <Card className="p-0 bg-white shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <Users size={20} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Bonos y Sesiones por Cliente
            </h2>
          </div>
        </div>
        <Table
          data={clientesFiltrados}
          columns={columnas}
          loading={cargando}
          emptyMessage="No hay clientes con bonos registrados"
        />

        {/* Detalles expandidos de bonos por cliente */}
        {clientesFiltrados.map((cliente) => {
          if (clienteExpandido !== cliente.clienteId) return null;

          return (
            <div key={cliente.clienteId} className="p-6 border-t border-slate-200 bg-slate-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Bonos de {cliente.clienteNombre}
              </h3>
              <div className="space-y-3">
                {cliente.bonos.map((bono) => {
                  const alerta = getAlertaVencimiento(bono.fechaVencimiento, bono.estado);
                  const porcentaje = Math.round(
                    (bono.sesionesUsadas / bono.sesionesTotal) * 100
                  );

                  return (
                    <Card key={bono.id} className="p-4 bg-white shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-base font-semibold text-gray-900">
                              Bono de {bono.sesionesTotal} sesiones
                            </h4>
                            <Badge variant={getEstadoBadge(bono.estado) as any}>
                              {bono.estado.charAt(0).toUpperCase() + bono.estado.slice(1)}
                            </Badge>
                            {alerta && (
                              <Badge
                                variant={
                                  alerta.tipo === 'urgente'
                                    ? 'error'
                                    : alerta.tipo === 'advertencia'
                                    ? 'warning'
                                    : 'info'
                                }
                              >
                                {alerta.mensaje}
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-gray-600">Sesiones Usadas</p>
                              <p className="text-lg font-bold text-blue-600">
                                {bono.sesionesUsadas} / {bono.sesionesTotal}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Sesiones Restantes</p>
                              <p className="text-lg font-bold text-gray-900">
                                {bono.sesionesRestantes}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Fecha Vencimiento</p>
                              <div className="flex items-center gap-1">
                                <Calendar size={14} className="text-gray-400" />
                                <p className="text-sm font-medium text-gray-900">
                                  {formatoFecha(bono.fechaVencimiento)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${porcentaje}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>Comprado: {formatoFecha(bono.fechaCompra)}</span>
                            <span>Precio: €{bono.precio.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
};

