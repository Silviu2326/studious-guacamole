import React, { useState, useEffect } from 'react';
import { Cuota } from '../types';
import { 
  Card, 
  Table, 
  Badge, 
  Button, 
  Modal, 
  Input, 
  Select,
  Textarea
} from '../../../components/componentsreutilizables';
import { 
  getCuotas, 
  getCuotasPorSuscripcion,
  getCuotasPorCliente,
  registrarPagoCuota, 
  marcarCuotaComoFallida,
  getCuotasPendientes, 
  getCuotasVencidas 
} from '../api/cuotas';
import { 
  Calendar, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  Filter,
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface GestorCuotasProps {
  suscripcionId?: string;
  clienteId?: string;
  soloFallidasVencidas?: boolean; // Para integración con tab "Pagos fallidos"
  mostrarFiltros?: boolean; // Controlar visibilidad de filtros
  compacto?: boolean; // Vista compacta para integración en VistaClienteSuscripcion
}

export const GestorCuotas: React.FC<GestorCuotasProps> = ({ 
  suscripcionId,
  clienteId,
  soloFallidasVencidas = false,
  mostrarFiltros = true,
  compacto = false
}) => {
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [cuotasFiltradas, setCuotasFiltradas] = useState<Cuota[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para modales
  const [modalPago, setModalPago] = useState(false);
  const [modalFallida, setModalFallida] = useState(false);
  const [modalDetalles, setModalDetalles] = useState(false);
  const [cuotaSeleccionada, setCuotaSeleccionada] = useState<Cuota | null>(null);
  
  // Estados para formularios
  const [metodoPago, setMetodoPago] = useState<string>('tarjeta');
  const [referencia, setReferencia] = useState<string>('');
  const [motivoFallida, setMotivoFallida] = useState<string>('');
  
  // Estados para filtros
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroPeriodoDesde, setFiltroPeriodoDesde] = useState<string>('');
  const [filtroPeriodoHasta, setFiltroPeriodoHasta] = useState<string>('');
  const [filtroSuscripcion, setFiltroSuscripcion] = useState<string>(suscripcionId || '');
  const [filtroCliente, setFiltroCliente] = useState<string>(clienteId || '');

  useEffect(() => {
    loadCuotas();
  }, [suscripcionId, clienteId, soloFallidasVencidas]);

  useEffect(() => {
    aplicarFiltros();
  }, [cuotas, filtroEstado, filtroPeriodoDesde, filtroPeriodoHasta, filtroSuscripcion, filtroCliente]);

  const loadCuotas = async () => {
    setLoading(true);
    try {
      let data: Cuota[] = [];
      
      if (soloFallidasVencidas) {
        // Para tab "Pagos fallidos": solo cuotas fallidas y vencidas
        const pendientes = await getCuotasPendientes();
        const vencidas = await getCuotasVencidas();
        data = [...pendientes, ...vencidas].filter(
          c => c.estado === 'fallida' || c.estado === 'vencida'
        );
      } else if (suscripcionId) {
        data = await getCuotasPorSuscripcion(suscripcionId);
      } else if (clienteId) {
        data = await getCuotasPorCliente(clienteId);
      } else {
        data = await getCuotas();
      }
      
      setCuotas(data);
    } catch (error) {
      console.error('Error cargando cuotas:', error);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtradas = [...cuotas];

    // Filtro por estado
    if (filtroEstado !== 'todos') {
      filtradas = filtradas.filter(c => c.estado === filtroEstado);
    }

    // Filtro por período
    if (filtroPeriodoDesde) {
      filtradas = filtradas.filter(c => c.fechaVencimiento >= filtroPeriodoDesde);
    }
    if (filtroPeriodoHasta) {
      filtradas = filtradas.filter(c => c.fechaVencimiento <= filtroPeriodoHasta);
    }

    // Filtro por suscripción
    if (filtroSuscripcion) {
      filtradas = filtradas.filter(c => c.suscripcionId === filtroSuscripcion);
    }

    // Filtro por cliente
    if (filtroCliente) {
      filtradas = filtradas.filter(c => c.clienteId === filtroCliente);
    }

    setCuotasFiltradas(filtradas);
  };

  const handleRegistrarPago = async () => {
    if (!cuotaSeleccionada) return;
    
    try {
      await registrarPagoCuota(
        cuotaSeleccionada.id, 
        metodoPago, 
        referencia
      );
      await loadCuotas();
      setModalPago(false);
      resetFormularios();
    } catch (error) {
      console.error('Error registrando pago:', error);
      alert('Error al registrar el pago');
    }
  };

  const handleMarcarFallida = async () => {
    if (!cuotaSeleccionada) return;
    
    try {
      await marcarCuotaComoFallida(cuotaSeleccionada.id, motivoFallida);
      await loadCuotas();
      setModalFallida(false);
      resetFormularios();
    } catch (error) {
      console.error('Error marcando cuota como fallida:', error);
      alert('Error al marcar la cuota como fallida');
    }
  };

  const resetFormularios = () => {
    setCuotaSeleccionada(null);
    setMetodoPago('tarjeta');
    setReferencia('');
    setMotivoFallida('');
  };

  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { label: string; color: 'success' | 'warning' | 'error' | 'info' }> = {
      pagada: { label: 'Pagada', color: 'success' },
      pendiente: { label: 'Pendiente', color: 'warning' },
      vencida: { label: 'Vencida', color: 'error' },
      fallida: { label: 'Fallida', color: 'error' },
    };
    
    const estadoData = estados[estado] || estados.pendiente;
    return <Badge color={estadoData.color}>{estadoData.label}</Badge>;
  };

  // Cálculos de resumen
  const cuotasPendientes = cuotasFiltradas.filter(c => c.estado === 'pendiente');
  const cuotasVencidas = cuotasFiltradas.filter(c => c.estado === 'vencida');
  const cuotasFallidas = cuotasFiltradas.filter(c => c.estado === 'fallida');
  const cuotasPagadas = cuotasFiltradas.filter(c => c.estado === 'pagada');
  
  const totalAdeudado = cuotasFiltradas
    .filter(c => c.estado !== 'pagada')
    .reduce((sum, c) => sum + (c.importe || c.monto || 0), 0);

  const totalPagado = cuotasPagadas
    .reduce((sum, c) => sum + (c.importe || c.monto || 0), 0);

  const columns = [
    {
      key: 'importe',
      label: 'Importe',
      render: (value: number, row: Cuota) => (
        <span className="text-base font-semibold text-gray-900">
          {(row.importe || row.monto || 0).toFixed(2)} €
        </span>
      ),
    },
    {
      key: 'fechaVencimiento',
      label: 'Fecha Vencimiento',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-base text-gray-900">
            {new Date(value).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
      ),
    },
    {
      key: 'fechaPagoOpcional',
      label: 'Fecha Pago',
      render: (value: string | undefined, row: Cuota) => {
        const fechaPago = row.fechaPagoOpcional || row.fechaPago;
        return fechaPago ? (
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-base text-gray-900">
              {new Date(fechaPago).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-600">Pendiente</span>
        );
      },
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: string) => getEstadoBadge(value),
    },
    {
      key: 'metodoPago',
      label: 'Método Pago',
      render: (value?: string) => (
        value ? (
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-900 capitalize">
              {value}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-600">-</span>
        )
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (value: any, row: Cuota) => (
        <div className="flex items-center gap-2">
          {row.estado !== 'pagada' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setCuotaSeleccionada(row);
                setModalPago(true);
              }}
            >
              Registrar Pago
            </Button>
          )}
          {(row.estado === 'pendiente' || row.estado === 'vencida') && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCuotaSeleccionada(row);
                setModalFallida(true);
              }}
            >
              Marcar Fallida
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCuotaSeleccionada(row);
              setModalDetalles(true);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Indicadores de resumen */}
      {!compacto && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-white shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cuotas</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {cuotasFiltradas.length}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          
          <Card className="bg-white shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-semibold text-yellow-600 mt-1">
                  {cuotasPendientes.length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </Card>
          
          <Card className="bg-white shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vencidas</p>
                <p className="text-2xl font-semibold text-red-600 mt-1">
                  {cuotasVencidas.length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </Card>

          <Card className="bg-white shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pagadas</p>
                <p className="text-2xl font-semibold text-green-600 mt-1">
                  {cuotasPagadas.length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="bg-white shadow-sm p-4 border-2 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Adeudado</p>
                <p className="text-2xl font-semibold text-red-600 mt-1">
                  {totalAdeudado.toFixed(2)} €
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-red-600" />
            </div>
          </Card>
        </div>
      )}

      {/* Filtros */}
      {mostrarFiltros && !compacto && (
        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select
              label="Estado"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              options={[
                { value: 'todos', label: 'Todos' },
                { value: 'pendiente', label: 'Pendientes' },
                { value: 'vencida', label: 'Vencidas' },
                { value: 'fallida', label: 'Fallidas' },
                { value: 'pagada', label: 'Pagadas' },
              ]}
            />
            
            <Input
              type="date"
              label="Desde"
              value={filtroPeriodoDesde}
              onChange={(e) => setFiltroPeriodoDesde(e.target.value)}
            />
            
            <Input
              type="date"
              label="Hasta"
              value={filtroPeriodoHasta}
              onChange={(e) => setFiltroPeriodoHasta(e.target.value)}
            />
            
            <Input
              label="ID Suscripción"
              value={filtroSuscripcion}
              onChange={(e) => setFiltroSuscripcion(e.target.value)}
              placeholder="Filtrar por suscripción"
            />
            
            <Input
              label="ID Cliente"
              value={filtroCliente}
              onChange={(e) => setFiltroCliente(e.target.value)}
              placeholder="Filtrar por cliente"
            />
          </div>
        </Card>
      )}

      {/* Tabla de cuotas */}
      <Card className="bg-white shadow-sm">
        <Table
          data={cuotasFiltradas}
          columns={columns}
          loading={loading}
          emptyMessage="No hay cuotas registradas"
        />
      </Card>

      {/* Modal Registrar Pago */}
      <Modal
        isOpen={modalPago}
        onClose={() => {
          setModalPago(false);
          resetFormularios();
        }}
        title="Registrar Pago de Cuota"
        size="md"
      >
        {cuotaSeleccionada && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Importe</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(cuotaSeleccionada.importe || cuotaSeleccionada.monto || 0).toFixed(2)} €
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Vencimiento: {new Date(cuotaSeleccionada.fechaVencimiento).toLocaleDateString('es-ES')}
              </p>
            </div>
            
            <Select
              label="Método de Pago"
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              options={[
                { value: 'tarjeta', label: 'Tarjeta' },
                { value: 'transferencia', label: 'Transferencia' },
                { value: 'domiciliacion', label: 'Domiciliación' },
                { value: 'efectivo', label: 'Efectivo' },
              ]}
            />
            
            <Input
              label="Referencia (opcional)"
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              placeholder="Ej: REF-2024-001"
            />
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setModalPago(false);
                  resetFormularios();
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleRegistrarPago}
              >
                Registrar Pago
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Marcar como Fallida */}
      <Modal
        isOpen={modalFallida}
        onClose={() => {
          setModalFallida(false);
          resetFormularios();
        }}
        title="Marcar Cuota como Fallida"
        size="md"
      >
        {cuotaSeleccionada && (
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-gray-600 mb-1">Importe</p>
              <p className="text-2xl font-semibold text-red-600">
                {(cuotaSeleccionada.importe || cuotaSeleccionada.monto || 0).toFixed(2)} €
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Vencimiento: {new Date(cuotaSeleccionada.fechaVencimiento).toLocaleDateString('es-ES')}
              </p>
            </div>
            
            <Textarea
              label="Motivo del fallo"
              value={motivoFallida}
              onChange={(e) => setMotivoFallida(e.target.value)}
              placeholder="Ej: Tarjeta rechazada, fondos insuficientes..."
              rows={3}
            />
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setModalFallida(false);
                  resetFormularios();
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="error"
                onClick={handleMarcarFallida}
              >
                Marcar como Fallida
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Ver Detalles */}
      <Modal
        isOpen={modalDetalles}
        onClose={() => {
          setModalDetalles(false);
          setCuotaSeleccionada(null);
        }}
        title="Detalles de la Cuota"
        size="md"
      >
        {cuotaSeleccionada && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">ID Cuota</p>
                <p className="text-base font-semibold text-gray-900">{cuotaSeleccionada.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <div className="mt-1">{getEstadoBadge(cuotaSeleccionada.estado)}</div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Importe</p>
                <p className="text-base font-semibold text-gray-900">
                  {(cuotaSeleccionada.importe || cuotaSeleccionada.monto || 0).toFixed(2)} €
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha Vencimiento</p>
                <p className="text-base text-gray-900">
                  {new Date(cuotaSeleccionada.fechaVencimiento).toLocaleDateString('es-ES')}
                </p>
              </div>
              {cuotaSeleccionada.fechaPagoOpcional || cuotaSeleccionada.fechaPago ? (
                <div>
                  <p className="text-sm text-gray-600">Fecha Pago</p>
                  <p className="text-base text-gray-900">
                    {new Date(cuotaSeleccionada.fechaPagoOpcional || cuotaSeleccionada.fechaPago!).toLocaleDateString('es-ES')}
                  </p>
                </div>
              ) : null}
              {cuotaSeleccionada.metodoPago && (
                <div>
                  <p className="text-sm text-gray-600">Método de Pago</p>
                  <p className="text-base text-gray-900 capitalize">{cuotaSeleccionada.metodoPago}</p>
                </div>
              )}
              {cuotaSeleccionada.referencia && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Referencia</p>
                  <p className="text-base text-gray-900">{cuotaSeleccionada.referencia}</p>
                </div>
              )}
              {cuotaSeleccionada.notas && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Notas</p>
                  <p className="text-base text-gray-900">{cuotaSeleccionada.notas}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setModalDetalles(false);
                  setCuotaSeleccionada(null);
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
