import React, { useState, useEffect } from 'react';
import { Card, Button, MetricCards, Table, TableColumn, Badge } from '../../../components/componentsreutilizables';
import { Factura, EstadoFactura, TipoFactura, EstadisticasFacturacion } from '../types';
import { facturasAPI } from '../api/facturas';
import { CreadorFactura } from './CreadorFactura';
import { GestorCobros } from './GestorCobros';
import { RecordatoriosPago } from './RecordatoriosPago';
import { SeguimientoEstados } from './SeguimientoEstados';
import { ReportesFacturacion } from './ReportesFacturacion';
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
  Eye
} from 'lucide-react';

export const FacturacionManager: React.FC = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(false);
  const [tabActiva, setTabActiva] = useState('facturas');
  const [mostrarCreador, setMostrarCreador] = useState(false);
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
      id: 'facturas',
      label: 'Facturas',
      icon: <FileText className="w-4 h-4" />
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
      id: 'seguimiento',
      label: 'Seguimiento',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: <TrendingUp className="w-4 h-4" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-end">
        <Button
          variant="primary"
          onClick={() => setMostrarCreador(true)}
        >
          <Plus size={20} className="mr-2" />
          Nueva Factura
        </Button>
      </div>

      {/* Métricas */}
      <MetricCards data={metricas} columns={4} />

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

        <div className="px-6 pb-6">
          <div className="mt-6">
            {tabActiva === 'facturas' && (
              <Table
                data={facturas}
                columns={columnasFacturas}
                loading={loading}
                emptyMessage="No hay facturas disponibles"
              />
            )}
            
            {tabActiva === 'cobros' && (
              <GestorCobros facturas={facturas} onRefresh={cargarFacturas} />
            )}
            
            {tabActiva === 'recordatorios' && (
              <RecordatoriosPago facturas={facturas} onRefresh={cargarFacturas} />
            )}
            
            {tabActiva === 'seguimiento' && (
              <SeguimientoEstados facturas={facturas} onRefresh={cargarFacturas} />
            )}
            
            {tabActiva === 'reportes' && (
              <ReportesFacturacion facturas={facturas} />
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
    </div>
  );
};

