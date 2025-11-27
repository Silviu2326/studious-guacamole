/**
 * FacturasVencidas - Componente para gestión de facturas vencidas
 * 
 * Este componente lista facturas vencidas con filtros por antigüedad y riesgo.
 * Acciones disponibles:
 * - Abrir ficha de la factura
 * - Registrar pago rápido
 * - Marcar en seguimiento
 * 
 * INTEGRACIÓN CON FacturacionManager:
 * - Se puede usar como tab independiente dentro de FacturacionManager
 * - Utiliza las mismas APIs y tipos que el resto del sistema
 * - Permite acciones rápidas sin salir del contexto de facturas vencidas
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Table, Badge, Input, Select, Modal } from '../../../components/componentsreutilizables';
import { Factura, EstadoFactura } from '../types';
import { getFacturasVencidas, marcarComoEnSeguimiento } from '../api/facturasVencidas';
import { esFacturaVencida } from '../utils/paymentStatus';
import { GestorCobros } from './GestorCobros';
import { ModalPagoRapido } from './ModalPagoRapido';
import { 
  AlertCircle, 
  DollarSign, 
  Clock, 
  Eye, 
  Filter,
  Calendar,
  TrendingUp,
  FileText,
  Zap
} from 'lucide-react';

interface FacturasVencidasProps {
  onFacturaSeleccionada?: (factura: Factura) => void;
  onRefresh?: () => void;
}

type FiltroAntiguedad = 'todas' | 'menos7' | '7-15' | '15-30' | 'mas30';
type FiltroRiesgo = 'todos' | 'bajo' | 'medio' | 'alto';

export const FacturasVencidas: React.FC<FacturasVencidasProps> = ({
  onFacturaSeleccionada,
  onRefresh
}) => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtroAntiguedad, setFiltroAntiguedad] = useState<FiltroAntiguedad>('todas');
  const [filtroRiesgo, setFiltroRiesgo] = useState<FiltroRiesgo>('todos');
  const [busqueda, setBusqueda] = useState('');
  
  // Estados para modales y acciones
  const [facturaParaDetalle, setFacturaParaDetalle] = useState<Factura | null>(null);
  const [facturaParaPago, setFacturaParaPago] = useState<Factura | null>(null);
  const [facturaParaCobros, setFacturaParaCobros] = useState<Factura | null>(null);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [mostrarModalCobros, setMostrarModalCobros] = useState(false);

  useEffect(() => {
    cargarFacturasVencidas();
  }, []);

  const cargarFacturasVencidas = async () => {
    setLoading(true);
    try {
      const facturasData = await getFacturasVencidas();
      setFacturas(facturasData);
    } catch (error) {
      console.error('Error al cargar facturas vencidas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular días vencidos para una factura
  const calcularDiasVencidos = (factura: Factura): number => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaVencimiento = new Date(factura.fechaVencimiento);
    fechaVencimiento.setHours(0, 0, 0, 0);
    
    if (fechaVencimiento >= hoy) {
      return 0;
    }
    
    const diferenciaMs = hoy.getTime() - fechaVencimiento.getTime();
    return Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
  };

  // Calcular nivel de riesgo basado en días vencidos y monto
  const calcularRiesgo = (factura: Factura): 'bajo' | 'medio' | 'alto' => {
    const diasVencidos = calcularDiasVencidos(factura);
    const monto = factura.saldoPendiente;
    
    if (diasVencidos >= 30 || monto > 10000) {
      return 'alto';
    } else if (diasVencidos >= 15 || monto > 5000) {
      return 'medio';
    }
    return 'bajo';
  };

  // Filtrar facturas según los filtros aplicados
  const facturasFiltradas = useMemo(() => {
    let filtered = [...facturas];

    // Filtro por antigüedad
    if (filtroAntiguedad !== 'todas') {
      filtered = filtered.filter(factura => {
        const dias = calcularDiasVencidos(factura);
        switch (filtroAntiguedad) {
          case 'menos7':
            return dias < 7;
          case '7-15':
            return dias >= 7 && dias < 15;
          case '15-30':
            return dias >= 15 && dias < 30;
          case 'mas30':
            return dias >= 30;
          default:
            return true;
        }
      });
    }

    // Filtro por riesgo
    if (filtroRiesgo !== 'todos') {
      filtered = filtered.filter(factura => {
        const riesgo = calcularRiesgo(factura);
        return riesgo === filtroRiesgo;
      });
    }

    // Filtro por búsqueda
    if (busqueda) {
      const query = busqueda.toLowerCase();
      filtered = filtered.filter(factura =>
        factura.numero.toLowerCase().includes(query) ||
        factura.nombreCliente.toLowerCase().includes(query) ||
        factura.clienteId.toLowerCase().includes(query)
      );
    }

    // Ordenar por días vencidos (mayor a menor) y luego por monto (mayor a menor)
    return filtered.sort((a, b) => {
      const diasA = calcularDiasVencidos(a);
      const diasB = calcularDiasVencidos(b);
      if (diasB !== diasA) {
        return diasB - diasA;
      }
      return b.saldoPendiente - a.saldoPendiente;
    });
  }, [facturas, filtroAntiguedad, filtroRiesgo, busqueda]);

  const handleAbrirFicha = (factura: Factura) => {
    setFacturaParaDetalle(factura);
    setMostrarModalDetalle(true);
    if (onFacturaSeleccionada) {
      onFacturaSeleccionada(factura);
    }
  };

  const handlePagoRapido = (factura: Factura) => {
    setFacturaParaPago(factura);
    setMostrarModalPago(true);
  };

  const handleMarcarSeguimiento = async (factura: Factura) => {
    try {
      await marcarComoEnSeguimiento(factura.id);
      await cargarFacturasVencidas();
      if (onRefresh) {
        onRefresh();
      }
      alert('Factura marcada como en seguimiento');
    } catch (error) {
      console.error('Error al marcar en seguimiento:', error);
      alert('Error al marcar la factura en seguimiento');
    }
  };

  const handleAbrirGestorCobros = (factura: Factura) => {
    setFacturaParaCobros(factura);
    setMostrarModalCobros(true);
  };

  const formatearMoneda = (valor: number, moneda: string = 'EUR') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: moneda,
      minimumFractionDigits: 2
    }).format(valor);
  };

  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const obtenerBadgeDiasVencidos = (dias: number) => {
    if (dias >= 30) {
      return <Badge variant="red">+{dias} días</Badge>;
    } else if (dias >= 15) {
      return <Badge variant="yellow">+{dias} días</Badge>;
    } else {
      return <Badge variant="orange">+{dias} días</Badge>;
    }
  };

  const obtenerBadgeRiesgo = (riesgo: 'bajo' | 'medio' | 'alto') => {
    const config = {
      bajo: { label: 'Bajo', variant: 'green' as const },
      medio: { label: 'Medio', variant: 'yellow' as const },
      alto: { label: 'Alto', variant: 'red' as const }
    };
    const c = config[riesgo];
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  // Estadísticas
  const estadisticas = useMemo(() => {
    const total = facturasFiltradas.length;
    const montoTotal = facturasFiltradas.reduce((sum, f) => sum + f.saldoPendiente, 0);
    const promedioDias = facturasFiltradas.length > 0
      ? facturasFiltradas.reduce((sum, f) => sum + calcularDiasVencidos(f), 0) / facturasFiltradas.length
      : 0;
    const altoRiesgo = facturasFiltradas.filter(f => calcularRiesgo(f) === 'alto').length;

    return { total, montoTotal, promedioDias, altoRiesgo };
  }, [facturasFiltradas]);

  // Columnas de la tabla
  const columns = [
    {
      key: 'numero',
      label: 'Número',
      render: (value: string, row: Factura) => (
        <div className="font-semibold text-gray-900">{value}</div>
      ),
    },
    {
      key: 'nombreCliente',
      label: 'Cliente',
      render: (value: string, row: Factura) => (
        <div className="text-sm text-gray-700">{value}</div>
      ),
    },
    {
      key: 'diasVencidos',
      label: 'Días Vencidos',
      render: (_: any, row: Factura) => obtenerBadgeDiasVencidos(calcularDiasVencidos(row)),
    },
    {
      key: 'saldoPendiente',
      label: 'Saldo Pendiente',
      render: (value: number, row: Factura) => (
        <div className="text-sm font-medium text-red-600">
          {formatearMoneda(value, row.moneda)}
        </div>
      ),
    },
    {
      key: 'fechaVencimiento',
      label: 'Fecha Vencimiento',
      render: (_: any, row: Factura) => (
        <div className="text-sm text-gray-700">{formatearFecha(row.fechaVencimiento)}</div>
      ),
    },
    {
      key: 'riesgo',
      label: 'Riesgo',
      render: (_: any, row: Factura) => obtenerBadgeRiesgo(calcularRiesgo(row)),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: Factura) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleAbrirFicha(row)}
            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all"
            title="Ver detalle"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handlePagoRapido(row)}
            className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-all"
            title="Pago rápido"
          >
            <Zap className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAbrirGestorCobros(row)}
            className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 transition-all"
            title="Gestión de cobros"
          >
            <DollarSign className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleMarcarSeguimiento(row)}
            className="p-2 rounded-lg text-orange-600 hover:bg-orange-50 transition-all"
            title="Marcar en seguimiento"
          >
            <Clock className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Facturas Vencidas</h2>
            <p className="text-sm text-gray-600 mt-1">
              Gestión prioritaria de facturas con pagos pendientes
            </p>
          </div>
        </div>
        <Button variant="secondary" onClick={cargarFacturasVencidas}>
          <TrendingUp className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white shadow-sm border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Vencidas</p>
              <p className="text-2xl font-bold text-red-600">{estadisticas.total}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Monto Total</p>
              <p className="text-lg font-bold text-orange-600">
                {formatearMoneda(estadisticas.montoTotal)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Promedio Días</p>
              <p className="text-2xl font-bold text-yellow-600">
                {Math.round(estadisticas.promedioDias)}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm border-l-4 border-l-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Alto Riesgo</p>
              <p className="text-2xl font-bold text-red-600">{estadisticas.altoRiesgo}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="p-4 bg-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter size={16} className="inline mr-1" />
              Búsqueda
            </label>
            <Input
              placeholder="Buscar por número, cliente..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              leftIcon={<FileText size={18} />}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Antigüedad
            </label>
            <Select
              options={[
                { value: 'todas', label: 'Todas' },
                { value: 'menos7', label: 'Menos de 7 días' },
                { value: '7-15', label: '7-15 días' },
                { value: '15-30', label: '15-30 días' },
                { value: 'mas30', label: 'Más de 30 días' },
              ]}
              value={filtroAntiguedad}
              onChange={(e) => setFiltroAntiguedad(e.target.value as FiltroAntiguedad)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <TrendingUp size={16} className="inline mr-1" />
              Nivel de Riesgo
            </label>
            <Select
              options={[
                { value: 'todos', label: 'Todos' },
                { value: 'bajo', label: 'Bajo' },
                { value: 'medio', label: 'Medio' },
                { value: 'alto', label: 'Alto' },
              ]}
              value={filtroRiesgo}
              onChange={(e) => setFiltroRiesgo(e.target.value as FiltroRiesgo)}
            />
          </div>
        </div>
      </Card>

      {/* Tabla de facturas vencidas */}
      {loading ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500">Cargando facturas vencidas...</div>
        </Card>
      ) : facturasFiltradas.length === 0 ? (
        <Card className="p-12 text-center bg-white shadow-sm">
          <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay facturas vencidas
          </h3>
          <p className="text-gray-600">
            {busqueda || filtroAntiguedad !== 'todas' || filtroRiesgo !== 'todos'
              ? 'No se encontraron facturas con los filtros aplicados'
              : 'Todas las facturas están al día'}
          </p>
        </Card>
      ) : (
        <Table
          data={facturasFiltradas}
          columns={columns}
          loading={false}
          emptyMessage="No hay facturas vencidas que mostrar"
        />
      )}

      {/* Modal de detalle de factura */}
      {facturaParaDetalle && (
        <Modal
          isOpen={mostrarModalDetalle}
          onClose={() => {
            setMostrarModalDetalle(false);
            setFacturaParaDetalle(null);
          }}
          title={`Detalle: ${facturaParaDetalle.numero}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Cliente</label>
                <p className="text-gray-900 mt-1">{facturaParaDetalle.nombreCliente}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Estado</label>
                <div className="mt-1">
                  <Badge variant="red">Vencida</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Fecha de Vencimiento</label>
                <p className="text-gray-900 mt-1">{formatearFecha(facturaParaDetalle.fechaVencimiento)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Días Vencidos</label>
                <p className="text-gray-900 mt-1">{calcularDiasVencidos(facturaParaDetalle)} días</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Total</label>
                <p className="text-gray-900 mt-1 font-semibold">
                  {formatearMoneda(facturaParaDetalle.total, facturaParaDetalle.moneda)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Saldo Pendiente</label>
                <p className="text-red-600 mt-1 font-semibold">
                  {formatearMoneda(facturaParaDetalle.saldoPendiente, facturaParaDetalle.moneda)}
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="primary"
                onClick={() => {
                  setMostrarModalDetalle(false);
                  handlePagoRapido(facturaParaDetalle);
                }}
              >
                <Zap className="w-4 h-4 mr-2" />
                Pago Rápido
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setMostrarModalDetalle(false);
                  handleAbrirGestorCobros(facturaParaDetalle);
                }}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Gestión de Cobros
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de pago rápido */}
      {facturaParaPago && (
        <ModalPagoRapido
          isOpen={mostrarModalPago}
          onClose={() => {
            setMostrarModalPago(false);
            setFacturaParaPago(null);
          }}
          factura={facturaParaPago}
          onPagoRegistrado={() => {
            setMostrarModalPago(false);
            setFacturaParaPago(null);
            cargarFacturasVencidas();
            if (onRefresh) {
              onRefresh();
            }
          }}
        />
      )}

      {/* Modal de gestión de cobros */}
      {facturaParaCobros && (
        <GestorCobros
          factura={facturaParaCobros}
          isOpen={mostrarModalCobros}
          onClose={() => {
            setMostrarModalCobros(false);
            setFacturaParaCobros(null);
          }}
          onCobroRegistrado={(facturaActualizada) => {
            setFacturaParaCobros(facturaActualizada);
            cargarFacturasVencidas();
            if (onRefresh) {
              onRefresh();
            }
          }}
        />
      )}
    </div>
  );
};

