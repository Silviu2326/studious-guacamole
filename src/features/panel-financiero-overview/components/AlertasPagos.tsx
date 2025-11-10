import React, { useState } from 'react';
import { Card, Table, TableColumn, Badge, Button, Modal, Select, Textarea } from '../../../components/componentsreutilizables';
import { AlertTriangle, Clock, Bell, DollarSign, MessageSquare, Mail, Edit2, History, CheckCircle2, XCircle, Loader2, FileText, Settings } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { alertasApi } from '../api';
import { AlertaPago, ClientePagoPendiente, HistorialGestionPago } from '../types';
import { ConfiguracionRecordatorios } from './ConfiguracionRecordatorios';

export const AlertasPagos: React.FC = () => {
  const { user } = useAuth();
  const [alertas, setAlertas] = useState<AlertaPago[]>([]);
  const [pendientes, setPendientes] = useState<ClientePagoPendiente[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabActiva, setTabActiva] = useState('alertas');
  
  // Estados para modales
  const [modalEstado, setModalEstado] = useState<{ isOpen: boolean; pago: ClientePagoPendiente | null }>({ isOpen: false, pago: null });
  const [modalNotas, setModalNotas] = useState<{ isOpen: boolean; pago: ClientePagoPendiente | null }>({ isOpen: false, pago: null });
  const [modalHistorial, setModalHistorial] = useState<{ isOpen: boolean; pago: ClientePagoPendiente | null; historial: HistorialGestionPago[] }>({ isOpen: false, pago: null, historial: [] });
  const [nuevoEstado, setNuevoEstado] = useState<string>('');
  const [nuevasNotas, setNuevasNotas] = useState<string>('');
  const [guardando, setGuardando] = useState(false);

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

  const getEstadoBadge = (estado?: string) => {
    if (!estado) estado = 'pendiente';
    const variants = {
      pendiente: { variant: 'yellow' as const, label: 'Pendiente', icon: <Clock className="w-3 h-3" /> },
      en_gestion: { variant: 'blue' as const, label: 'En Gestión', icon: <Loader2 className="w-3 h-3" /> },
      resuelto: { variant: 'green' as const, label: 'Resuelto', icon: <CheckCircle2 className="w-3 h-3" /> },
      cancelado: { variant: 'gray' as const, label: 'Cancelado', icon: <XCircle className="w-3 h-3" /> }
    };
    const config = variants[estado as keyof typeof variants] || variants.pendiente;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
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

  // Generar mensaje preconfigurado para recordatorio de pago (sin codificar)
  const generarMensajeRecordatorio = (cliente: ClientePagoPendiente): string => {
    return `Hola ${cliente.nombre}, 

Te recordamos que tienes un pago pendiente de €${cliente.monto.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} por el servicio "${cliente.servicio}".

Fecha de vencimiento: ${new Date(cliente.fechaVencimiento).toLocaleDateString('es-ES')}
Días vencidos: ${cliente.diasVencidos}

Por favor, realiza el pago a la mayor brevedad posible. Si ya lo has realizado, ignora este mensaje.

Gracias por tu atención.`;
  };

  // Generar asunto y cuerpo para email
  const generarEmailRecordatorio = (cliente: ClientePagoPendiente) => {
    const asunto = encodeURIComponent(`Recordatorio de pago pendiente - ${cliente.servicio}`);
    const cuerpo = encodeURIComponent(generarMensajeRecordatorio(cliente));
    return { asunto, cuerpo };
  };

  // Abrir WhatsApp con mensaje preconfigurado
  const enviarWhatsApp = (cliente: ClientePagoPendiente) => {
    if (!cliente.telefono) {
      alert('No hay número de teléfono disponible para este cliente');
      return;
    }
    const mensaje = encodeURIComponent(generarMensajeRecordatorio(cliente));
    const telefono = cliente.telefono.replace(/[^0-9]/g, ''); // Limpiar formato
    const url = `https://wa.me/${telefono}?text=${mensaje}`;
    window.open(url, '_blank');
  };

  // Abrir cliente de email con mensaje preconfigurado
  const enviarEmail = (cliente: ClientePagoPendiente) => {
    if (!cliente.email) {
      alert('No hay dirección de email disponible para este cliente');
      return;
    }
    const { asunto, cuerpo } = generarEmailRecordatorio(cliente);
    const url = `mailto:${cliente.email}?subject=${asunto}&body=${cuerpo}`;
    window.open(url);
  };

  // Abrir modal para cambiar estado
  const abrirModalEstado = (pago: ClientePagoPendiente) => {
    setNuevoEstado(pago.estado || 'pendiente');
    setModalEstado({ isOpen: true, pago });
  };

  // Guardar cambio de estado
  const guardarEstado = async () => {
    if (!modalEstado.pago || !nuevoEstado) return;
    
    try {
      setGuardando(true);
      const pagoActualizado = await alertasApi.actualizarEstadoPago(
        modalEstado.pago.id,
        nuevoEstado as 'pendiente' | 'en_gestion' | 'resuelto' | 'cancelado',
        nuevasNotas || undefined
      );
      
      // Actualizar la lista de pendientes
      setPendientes(prev => prev.map(p => p.id === pagoActualizado.id ? pagoActualizado : p));
      setModalEstado({ isOpen: false, pago: null });
      setNuevoEstado('');
      setNuevasNotas('');
    } catch (error) {
      console.error('Error actualizando estado:', error);
      alert('Error al actualizar el estado del pago');
    } finally {
      setGuardando(false);
    }
  };

  // Abrir modal para editar notas
  const abrirModalNotas = (pago: ClientePagoPendiente) => {
    setNuevasNotas(pago.notas || '');
    setModalNotas({ isOpen: true, pago });
  };

  // Guardar notas
  const guardarNotas = async () => {
    if (!modalNotas.pago) return;
    
    try {
      setGuardando(true);
      const pagoActualizado = await alertasApi.actualizarNotasPago(
        modalNotas.pago.id,
        nuevasNotas
      );
      
      // Actualizar la lista de pendientes
      setPendientes(prev => prev.map(p => p.id === pagoActualizado.id ? pagoActualizado : p));
      setModalNotas({ isOpen: false, pago: null });
      setNuevasNotas('');
    } catch (error) {
      console.error('Error actualizando notas:', error);
      alert('Error al actualizar las notas');
    } finally {
      setGuardando(false);
    }
  };

  // Abrir modal de historial
  const abrirModalHistorial = async (pago: ClientePagoPendiente) => {
    try {
      const historial = await alertasApi.obtenerHistorialPago(pago.id);
      setModalHistorial({ isOpen: true, pago, historial });
    } catch (error) {
      console.error('Error cargando historial:', error);
      alert('Error al cargar el historial');
    }
  };

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
      key: 'estado', 
      label: 'Estado', 
      render: (val) => getEstadoBadge(val)
    },
    { 
      key: 'riesgo', 
      label: 'Riesgo', 
      render: (val) => getRiesgoBadge(val)
    },
    {
      key: 'notas',
      label: 'Notas',
      render: (val, row) => (
        <div className="max-w-xs">
          {row.notas ? (
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 truncate" title={row.notas}>
                {row.notas.length > 30 ? `${row.notas.substring(0, 30)}...` : row.notas}
              </span>
            </div>
          ) : (
            <span className="text-sm text-gray-400">Sin notas</span>
          )}
        </div>
      )
    },
    {
      key: 'acciones',
      label: 'Acciones',
      align: 'center',
      render: (val, row) => (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => abrirModalEstado(row)}
            leftIcon={<Edit2 className="w-4 h-4" />}
            title="Cambiar estado"
          >
            Estado
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => abrirModalNotas(row)}
            leftIcon={<FileText className="w-4 h-4" />}
            title="Añadir/Editar notas"
          >
            Notas
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => abrirModalHistorial(row)}
            leftIcon={<History className="w-4 h-4" />}
            title="Ver historial"
          >
            Historial
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => enviarWhatsApp(row)}
            disabled={!row.telefono}
            leftIcon={<MessageSquare className="w-4 h-4" />}
            title="Enviar WhatsApp"
          >
            WA
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => enviarEmail(row)}
            disabled={!row.email}
            leftIcon={<Mail className="w-4 h-4" />}
            title="Enviar Email"
          >
            Email
          </Button>
        </div>
      )
    }
  ];

  const opcionesEstado = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en_gestion', label: 'En Gestión' },
    { value: 'resuelto', label: 'Resuelto' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  const tabs: Array<{ id: string; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = [
    {
      id: 'alertas',
      label: 'Alertas y Pagos Pendientes',
      icon: AlertTriangle,
    },
    {
      id: 'configuracion',
      label: 'Configuración de Recordatorios',
      icon: Settings,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs para alternar entre alertas y configuración */}
      <Card className="bg-white shadow-sm p-0">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            {tabs.map((tab) => {
              const activo = tabActiva === tab.id;
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTabActiva(tab.id)}
                  className={[
                    'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                    activo
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                  ].join(' ')}
                >
                  <IconComponent size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Contenido de las tabs */}
      {tabActiva === 'alertas' && (
        <>
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

      {/* Modal para cambiar estado */}
      <Modal
        isOpen={modalEstado.isOpen}
        onClose={() => {
          setModalEstado({ isOpen: false, pago: null });
          setNuevoEstado('');
          setNuevasNotas('');
        }}
        title="Cambiar Estado del Pago"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setModalEstado({ isOpen: false, pago: null });
                setNuevoEstado('');
                setNuevasNotas('');
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={guardarEstado}
              loading={guardando}
            >
              Guardar
            </Button>
          </div>
        }
      >
        {modalEstado.pago && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Cliente:</strong> {modalEstado.pago.nombre}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Servicio:</strong> {modalEstado.pago.servicio}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Monto:</strong> €{modalEstado.pago.monto.toLocaleString()}
              </p>
            </div>
            <Select
              label="Nuevo Estado"
              options={opcionesEstado}
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
            />
            <Textarea
              label="Notas (opcional)"
              value={nuevasNotas}
              onChange={(e) => setNuevasNotas(e.target.value)}
              placeholder="Añade notas sobre el cambio de estado..."
              rows={3}
            />
          </div>
        )}
      </Modal>

      {/* Modal para editar notas */}
      <Modal
        isOpen={modalNotas.isOpen}
        onClose={() => {
          setModalNotas({ isOpen: false, pago: null });
          setNuevasNotas('');
        }}
        title="Añadir/Editar Notas"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setModalNotas({ isOpen: false, pago: null });
                setNuevasNotas('');
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={guardarNotas}
              loading={guardando}
            >
              Guardar Notas
            </Button>
          </div>
        }
      >
        {modalNotas.pago && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Cliente:</strong> {modalNotas.pago.nombre}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Servicio:</strong> {modalNotas.pago.servicio}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Monto:</strong> €{modalNotas.pago.monto.toLocaleString()}
              </p>
            </div>
            <Textarea
              label="Notas"
              value={nuevasNotas}
              onChange={(e) => setNuevasNotas(e.target.value)}
              placeholder="Añade notas sobre la gestión de este pago..."
              rows={5}
            />
          </div>
        )}
      </Modal>

      {/* Modal para ver historial */}
      <Modal
        isOpen={modalHistorial.isOpen}
        onClose={() => setModalHistorial({ isOpen: false, pago: null, historial: [] })}
        title="Historial de Gestión"
        size="lg"
        footer={
          <Button
            variant="secondary"
            onClick={() => setModalHistorial({ isOpen: false, pago: null, historial: [] })}
          >
            Cerrar
          </Button>
        }
      >
        {modalHistorial.pago && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">
                <strong>Cliente:</strong> {modalHistorial.pago.nombre}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Servicio:</strong> {modalHistorial.pago.servicio}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Monto:</strong> €{modalHistorial.pago.monto.toLocaleString()}
              </p>
            </div>
            
            {modalHistorial.historial.length > 0 ? (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Registro de Actividades</h3>
                {modalHistorial.historial.map((item) => (
                  <div key={item.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{item.accion}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.fecha).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {item.estadoAnterior && item.estadoNuevo && (
                      <p className="text-sm text-gray-600 mb-1">
                        Estado: <span className="font-medium">{item.estadoAnterior}</span> → <span className="font-medium">{item.estadoNuevo}</span>
                      </p>
                    )}
                    {item.notas && (
                      <p className="text-sm text-gray-600 mt-1">{item.notas}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">Por: {item.usuario}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay historial disponible para este pago</p>
              </div>
            )}
          </div>
        )}
      </Modal>
        </>
      )}

      {tabActiva === 'configuracion' && <ConfiguracionRecordatorios />}
    </div>
  );
};
