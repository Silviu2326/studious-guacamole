import React, { useState, useEffect } from 'react';
import { Card, Button, MetricCards, Table, TableColumn, Badge, Modal, Textarea } from '../../../components/componentsreutilizables';
import { Factura, EstadoFactura, TipoFactura, EstadisticasFacturacion } from '../types';
import { facturasAPI } from '../api/facturas';
import { CreadorFactura } from './CreadorFactura';
import { GestorCobros } from './GestorCobros';
import { RecordatoriosPago } from './RecordatoriosPago';
import { SeguimientoEstados } from './SeguimientoEstados';
import { ReportesFacturacion } from './ReportesFacturacion';
import { DashboardWidget } from './DashboardWidget';
import { GestorSuscripcionesRecurrentes } from './GestorSuscripcionesRecurrentes';
import { EnviarLinkPago } from './EnviarLinkPago';
import { ConfigurarCobrosRecurrentes } from './ConfigurarCobrosRecurrentes';
import { CalendarioIngresos } from './CalendarioIngresos';
import { ModalPagoRapido } from './ModalPagoRapido';
import { FacturasVencidas } from './FacturasVencidas';
import { ReporteIngresosPorServicio } from './ReporteIngresosPorServicio';
import { 
  FileText, 
  DollarSign, 
  Bell, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Plus,
  Download,
  Eye,
  Repeat,
  Send,
  CreditCard,
  Calendar,
  Zap,
  FileText as FileTextIcon,
  Edit,
  BarChart3
} from 'lucide-react';

export const FacturacionManager: React.FC = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(false);
  const [tabActiva, setTabActiva] = useState('dashboard');
  const [mostrarCreador, setMostrarCreador] = useState(false);
  const [mostrarModalSuscripcion, setMostrarModalSuscripcion] = useState(false);
  const [facturaParaLinkPago, setFacturaParaLinkPago] = useState<Factura | null>(null);
  const [facturaParaPagoRapido, setFacturaParaPagoRapido] = useState<Factura | null>(null);
  const [facturaParaNotasInternas, setFacturaParaNotasInternas] = useState<Factura | null>(null);
  const [notasInternasEditando, setNotasInternasEditando] = useState('');
  const [estadisticas, setEstadisticas] = useState<EstadisticasFacturacion>({
    facturasPendientes: 0,
    montoPendiente: 0,
    facturasVencidas: 0,
    montoVencido: 0,
    facturasMesActual: 0,
    montoFacturadoMes: 0,
    facturasPagadasMes: 0,
    montoCobradoMes: 0,
    promedioDiasCobro: 0
  });

  useEffect(() => {
    cargarFacturas();
    cargarEstadisticas();
  }, []);

  const cargarFacturas = async () => {
    setLoading(true);
    try {
      const facturasData = await facturasAPI.obtenerFacturas();
      setFacturas(facturasData);
    } catch (error) {
      console.error('Error al cargar facturas:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const facturasData = await facturasAPI.obtenerFacturas();
      
      const ahora = new Date();
      const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      
      const facturasPendientes = facturasData.filter(f => f.estado === 'pendiente');
      const facturasVencidas = facturasData.filter(f => f.estado === 'vencida');
      const facturasMes = facturasData.filter(f => f.fechaEmision >= inicioMes);
      const facturasPagadasMes = facturasMes.filter(f => f.estado === 'pagada');
      
      const nuevaEstadistica: EstadisticasFacturacion = {
        facturasPendientes: facturasPendientes.length,
        montoPendiente: facturasPendientes.reduce((sum, f) => sum + f.montoPendiente, 0),
        facturasVencidas: facturasVencidas.length,
        montoVencido: facturasVencidas.reduce((sum, f) => sum + f.montoPendiente, 0),
        facturasMesActual: facturasMes.length,
        montoFacturadoMes: facturasMes.reduce((sum, f) => sum + f.total, 0),
        facturasPagadasMes: facturasPagadasMes.length,
        montoCobradoMes: facturasPagadasMes.reduce((sum, f) => sum + f.total, 0),
        promedioDiasCobro: 5 // Mock
      };
      
      setEstadisticas(nuevaEstadistica);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const obtenerBadgeEstado = (estado: EstadoFactura) => {
    const estados: Record<EstadoFactura, { label: string; variant: 'gray' | 'blue' | 'green' | 'yellow' | 'red' }> = {
      pendiente: { label: 'Pendiente', variant: 'yellow' },
      parcial: { label: 'Parcial', variant: 'blue' },
      pagada: { label: 'Pagada', variant: 'green' },
      vencida: { label: 'Vencida', variant: 'red' },
      cancelada: { label: 'Cancelada', variant: 'gray' }
    };
    
    const estadoInfo = estados[estado];
    return (
      <Badge variant={estadoInfo.variant} size="sm">
        {estadoInfo.label}
      </Badge>
    );
  };

  const obtenerTipoFactura = (tipo: TipoFactura) => {
    const tipos: Record<TipoFactura, string> = {
      servicios: 'Servicios',
      productos: 'Productos',
      recurrente: 'Recurrente',
      paquetes: 'Paquetes',
      eventos: 'Eventos',
      adicionales: 'Adicionales',
      correccion: 'Corrección'
    };
    return tipos[tipo] || tipo;
  };

  const handleEnviarLinkPago = (factura: Factura) => {
    setFacturaParaLinkPago(factura);
  };

  const handlePagoRapido = (factura: Factura) => {
    setFacturaParaPagoRapido(factura);
  };

  const columnasFacturas: TableColumn<Factura>[] = [
    {
      key: 'numeroFactura',
      label: 'Número',
      sortable: true
    },
    {
      key: 'cliente',
      label: 'Cliente',
      render: (_, row) => (
        <div>
          <div className="font-medium">{row.cliente.nombre}</div>
          <div className="text-sm text-gray-500">{row.cliente.email}</div>
        </div>
      )
    },
    {
      key: 'fechaEmision',
      label: 'Fecha Emisión',
      render: (_, row) => row.fechaEmision.toLocaleDateString('es-ES'),
      sortable: true
    },
    {
      key: 'fechaVencimiento',
      label: 'Fecha Vencimiento',
      render: (_, row) => row.fechaVencimiento.toLocaleDateString('es-ES'),
      sortable: true
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (_, row) => obtenerTipoFactura(row.tipo)
    },
    {
      key: 'total',
      label: 'Total',
      render: (_, row) => formatearMoneda(row.total),
      align: 'right',
      sortable: true
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_, row) => obtenerBadgeEstado(row.estado)
    },
    {
      key: 'notasInternas',
      label: 'Notas',
      width: 80,
      render: (_, row) => {
        if (row.notasInternas) {
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFacturaParaNotasInternas(row);
                setNotasInternasEditando(row.notasInternas || '');
              }}
              title="Ver/Editar notas internas"
              className="text-amber-600 hover:text-amber-700"
            >
              <FileTextIcon className="w-4 h-4" />
            </Button>
          );
        }
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFacturaParaNotasInternas(row);
              setNotasInternasEditando('');
            }}
            title="Agregar notas internas"
            className="text-gray-400 hover:text-gray-600"
          >
            <Edit className="w-4 h-4" />
          </Button>
        );
      }
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVerFactura(row.id)}
            title="Ver factura"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDescargarPDF(row.id)}
            title="Descargar PDF"
          >
            <Download className="w-4 h-4" />
          </Button>
          {(row.estado === 'pendiente' || row.estado === 'parcial' || row.estado === 'vencida') && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handlePagoRapido(row)}
                title="Registrar Pago Rápido"
                className="flex items-center gap-1"
              >
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Pago Rápido</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEnviarLinkPago(row)}
                title="Enviar link de pago"
              >
                <Send className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  const handleVerFactura = (id: string) => {
    // TODO: Implementar vista detallada
    console.log('Ver factura:', id);
  };

  const handleDescargarPDF = async (id: string) => {
    try {
      const blob = await facturasAPI.exportarPDF(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `factura-${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar PDF:', error);
    }
  };

  const metricas = [
    {
      id: 'facturas-pendientes',
      title: 'Facturas Pendientes',
      value: estadisticas.facturasPendientes.toString(),
      subtitle: formatearMoneda(estadisticas.montoPendiente),
      icon: <Clock className="w-6 h-6" />,
      color: 'warning' as const
    },
    {
      id: 'facturas-vencidas',
      title: 'Facturas Vencidas',
      value: estadisticas.facturasVencidas.toString(),
      subtitle: formatearMoneda(estadisticas.montoVencido),
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'error' as const
    },
    {
      id: 'facturado-mes',
      title: 'Facturado este Mes',
      value: formatearMoneda(estadisticas.montoFacturadoMes),
      subtitle: `${estadisticas.facturasMesActual} facturas`,
      icon: <FileText className="w-6 h-6" />,
      color: 'primary' as const
    },
    {
      id: 'cobrado-mes',
      title: 'Cobrado este Mes',
      value: formatearMoneda(estadisticas.montoCobradoMes),
      subtitle: `${estadisticas.facturasPagadasMes} facturas`,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'success' as const
    }
  ];

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 'calendario',
      label: 'Calendario de Ingresos',
      icon: <Calendar className="w-4 h-4" />
    },
    {
      id: 'facturas',
      label: 'Facturas',
      icon: <FileText className="w-4 h-4" />
    },
    {
      id: 'suscripciones',
      label: 'Suscripciones',
      icon: <Repeat className="w-4 h-4" />
    },
    {
      id: 'cobros',
      label: 'Cobros',
      icon: <DollarSign className="w-4 h-4" />
    },
    {
      id: 'recordatorios',
      label: 'Recordatorios',
      icon: <Bell className="w-4 h-4" />
    },
    {
      id: 'facturas-vencidas',
      label: 'Facturas Vencidas',
      icon: <AlertCircle className="w-4 h-4" />
    },
    {
      id: 'seguimiento',
      label: 'Seguimiento',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 'ingresos-servicio',
      label: 'Ingresos por Servicio',
      icon: <BarChart3 className="w-4 h-4" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {tabActiva === 'suscripciones' && (
            <Button
              variant="primary"
              onClick={() => setMostrarModalSuscripcion(true)}
            >
              <Plus size={20} className="mr-2" />
              Nueva Suscripción
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={() => setMostrarCreador(true)}
          >
            <Plus size={20} className="mr-2" />
            Nueva Factura
          </Button>
        </div>
      </div>

      {/* Métricas - Solo mostrar si no estamos en dashboard */}
      {tabActiva !== 'dashboard' && (
        <MetricCards data={metricas} columns={4} />
      )}

      {/* Contenido principal */}
      <Card className="p-0 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div
            role="tablist"
            aria-label="Secciones facturación"
            className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
          >
            {tabs.map(({ id, label, icon }) => {
              const activo = tabActiva === id;
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={activo}
                  onClick={() => setTabActiva(id)}
                  className={[
                    'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                    activo
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  ].join(' ')}
                >
                  <div className={activo ? 'opacity-100' : 'opacity-70'}>
                    {icon}
                  </div>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={tabActiva === 'dashboard' || tabActiva === 'calendario' ? 'p-6' : 'px-6 pb-6'}>
          <div className={tabActiva === 'dashboard' || tabActiva === 'calendario' ? '' : 'mt-6'}>
            {tabActiva === 'dashboard' && (
              <DashboardWidget facturas={facturas} onRefresh={cargarFacturas} />
            )}
            
            {tabActiva === 'calendario' && (
              <CalendarioIngresos />
            )}
            
            {tabActiva === 'facturas' && (
              <Table
                data={facturas}
                columns={columnasFacturas}
                loading={loading}
                emptyMessage="No hay facturas disponibles"
              />
            )}
            
            {tabActiva === 'suscripciones' && (
              <GestorSuscripcionesRecurrentes />
            )}
            
            {tabActiva === 'cobros' && (
              <GestorCobros facturas={facturas} onRefresh={cargarFacturas} />
            )}
            
            {tabActiva === 'recordatorios' && (
              <RecordatoriosPago facturas={facturas} onRefresh={cargarFacturas} />
            )}
            
            {tabActiva === 'facturas-vencidas' && (
              <FacturasVencidas onRefresh={() => {
                cargarFacturas();
                cargarEstadisticas();
              }} />
            )}
            
            {tabActiva === 'seguimiento' && (
              <SeguimientoEstados facturas={facturas} onRefresh={cargarFacturas} />
            )}
            
            {tabActiva === 'reportes' && (
              <ReportesFacturacion facturas={facturas} />
            )}
            
            {tabActiva === 'ingresos-servicio' && (
              <ReporteIngresosPorServicio facturas={facturas} />
            )}
          </div>
        </div>
      </Card>

      {/* Modal de creación */}
      {mostrarCreador && (
        <CreadorFactura
          onClose={() => setMostrarCreador(false)}
          onFacturaCreada={() => {
            setMostrarCreador(false);
            cargarFacturas();
            cargarEstadisticas();
          }}
        />
      )}

      {/* Modal de suscripción */}
      {mostrarModalSuscripcion && (
        <ConfigurarCobrosRecurrentes
          isOpen={mostrarModalSuscripcion}
          onClose={() => setMostrarModalSuscripcion(false)}
          onSuscripcionCreada={() => {
            setMostrarModalSuscripcion(false);
          }}
        />
      )}

      {/* Modal de envío de link de pago */}
      {facturaParaLinkPago && (
        <EnviarLinkPago
          isOpen={!!facturaParaLinkPago}
          onClose={() => setFacturaParaLinkPago(null)}
          factura={facturaParaLinkPago}
          onLinkEnviado={() => {
            setFacturaParaLinkPago(null);
            cargarFacturas();
          }}
        />
      )}

      {/* Modal de pago rápido */}
      {facturaParaPagoRapido && (
        <ModalPagoRapido
          isOpen={!!facturaParaPagoRapido}
          onClose={() => setFacturaParaPagoRapido(null)}
          factura={facturaParaPagoRapido}
          onPagoRegistrado={() => {
            setFacturaParaPagoRapido(null);
            cargarFacturas();
            cargarEstadisticas();
          }}
        />
      )}

      {/* Modal de notas internas */}
      {facturaParaNotasInternas && (
        <Modal
          isOpen={!!facturaParaNotasInternas}
          onClose={() => {
            setFacturaParaNotasInternas(null);
            setNotasInternasEditando('');
          }}
          title={`Notas Internas - ${facturaParaNotasInternas.numeroFactura}`}
          size="md"
          footer={
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setFacturaParaNotasInternas(null);
                  setNotasInternasEditando('');
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={async () => {
                  if (!facturaParaNotasInternas) return;
                  try {
                    await facturasAPI.actualizarFactura(facturaParaNotasInternas.id, {
                      notasInternas: notasInternasEditando || undefined
                    });
                    setFacturaParaNotasInternas(null);
                    setNotasInternasEditando('');
                    cargarFacturas();
                  } catch (error) {
                    console.error('Error al guardar notas internas:', error);
                    alert('Error al guardar las notas internas');
                  }
                }}
              >
                Guardar
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Notas Privadas:</strong> Estas notas son solo visibles para ti y no se mostrarán al cliente.
                Útiles para recordar acuerdos de pago, situaciones especiales o cualquier información importante.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Cliente: {facturaParaNotasInternas.cliente.nombre}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Monto: {formatearMoneda(facturaParaNotasInternas.total)} | 
                Estado: {obtenerBadgeEstado(facturaParaNotasInternas.estado)}
              </p>
            </div>
            <Textarea
              label="Notas Internas"
              value={notasInternasEditando}
              onChange={(e) => setNotasInternasEditando(e.target.value)}
              rows={6}
              placeholder="Escribe aquí tus notas privadas sobre esta factura..."
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

