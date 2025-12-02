/**
 * MorosidadList.tsx
 * 
 * Componente principal de listado de clientes morosos.
 * 
 * Este componente corresponde al tab "Listado" de la página principal de Pagos Pendientes & Morosidad.
 * Muestra una tabla/listado con los clientes morosos, permitiendo filtrar, ordenar y realizar acciones rápidas.
 * 
 * Funcionalidades:
 * - Visualización de clientes morosos con campos clave: nombre, importe total adeudado, importe vencido,
 *   días máximo de retraso, nivel de riesgo, estado de morosidad
 * - Filtros por: nivel de riesgo, estado de morosidad, rango de días de retraso, rango de importe
 * - Ordenamiento por días de retraso y monto adeudado
 * - Acciones rápidas por fila: ver detalle del cliente, crear/abrir plan de pago, registrar acción de cobro,
 *   abrir historial de contactos
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableColumn, Button, Modal, Textarea, Select, Input, Badge } from '../../../components/componentsreutilizables';
import { ClienteMoroso, NivelRiesgo, EstadoMorosidad, FiltrosClienteMoroso } from '../types';
import { clientesMorososAPI } from '../api/morosidad';
import { seguimientoAPI } from '../api/seguimiento';
import { planesPagoAPI } from '../api/planesPago';
import { 
  DollarSign, 
  Calendar, 
  AlertCircle, 
  Filter, 
  X, 
  Eye, 
  FileText, 
  MessageSquare, 
  Phone,
  ArrowUpDown,
  Download,
  Plus,
  Shield,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface MorosidadListProps {
  onRefresh?: () => void;
}

export const MorosidadList: React.FC<MorosidadListProps> = ({ onRefresh }) => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<ClienteMoroso[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  
  // Estados de filtros
  const [filtros, setFiltros] = useState<FiltrosClienteMoroso>({});
  const [nivelRiesgoSeleccionados, setNivelRiesgoSeleccionados] = useState<NivelRiesgo[]>([]);
  const [estadoMorosidadSeleccionados, setEstadoMorosidadSeleccionados] = useState<EstadoMorosidad[]>([]);
  const [diasRetrasoMin, setDiasRetrasoMin] = useState<number | undefined>();
  const [diasRetrasoMax, setDiasRetrasoMax] = useState<number | undefined>();
  const [importeMin, setImporteMin] = useState<string>('');
  const [importeMax, setImporteMax] = useState<string>('');
  
  // Estados de ordenamiento
  const [campoOrdenamiento, setCampoOrdenamiento] = useState<'diasMaximoRetraso' | 'importeTotalAdeudado' | null>(null);
  const [direccionOrdenamiento, setDireccionOrdenamiento] = useState<'asc' | 'desc'>('desc');
  
  // Estados para modales de acciones
  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteMoroso | null>(null);
  const [mostrarModalPlanPago, setMostrarModalPlanPago] = useState(false);
  const [mostrarModalAccionCobro, setMostrarModalAccionCobro] = useState(false);
  const [mostrarModalHistorial, setMostrarModalHistorial] = useState(false);
  const [notaAccionCobro, setNotaAccionCobro] = useState('');
  const [tipoAccionCobro, setTipoAccionCobro] = useState<'llamada' | 'email' | 'whatsapp' | 'visita'>('llamada');

  // Cargar datos cuando cambien los filtros
  useEffect(() => {
    cargarClientes();
  }, [filtros]);

  const cargarClientes = async () => {
    setLoading(true);
    try {
      const datos = await clientesMorososAPI.getClientesMorosos(Object.keys(filtros).length > 0 ? filtros : undefined);
      setClientes(datos);
    } catch (error) {
      console.error('Error al cargar clientes morosos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros cuando cambien las selecciones
  useEffect(() => {
    const nuevosFiltros: FiltrosClienteMoroso = {};
    
    if (nivelRiesgoSeleccionados.length > 0) {
      nuevosFiltros.nivelRiesgo = nivelRiesgoSeleccionados;
    }
    
    if (estadoMorosidadSeleccionados.length > 0) {
      nuevosFiltros.estadoMorosidad = estadoMorosidadSeleccionados;
    }
    
    if (diasRetrasoMin !== undefined) {
      nuevosFiltros.diasRetrasoMin = diasRetrasoMin;
    }
    
    if (diasRetrasoMax !== undefined) {
      nuevosFiltros.diasRetrasoMax = diasRetrasoMax;
    }
    
    if (importeMin) {
      const monto = parseFloat(importeMin.replace(/[^\d.-]/g, '').replace(/\./g, '').replace(',', '.'));
      if (!isNaN(monto)) {
        nuevosFiltros.importeMin = monto;
      }
    }
    
    if (importeMax) {
      const monto = parseFloat(importeMax.replace(/[^\d.-]/g, '').replace(/\./g, '').replace(',', '.'));
      if (!isNaN(monto)) {
        nuevosFiltros.importeMax = monto;
      }
    }
    
    setFiltros(nuevosFiltros);
  }, [nivelRiesgoSeleccionados, estadoMorosidadSeleccionados, diasRetrasoMin, diasRetrasoMax, importeMin, importeMax]);

  // Ordenar clientes según el campo seleccionado
  const clientesOrdenados = useMemo(() => {
    if (!campoOrdenamiento) return clientes;
    
    return [...clientes].sort((a, b) => {
      let valorA: number, valorB: number;
      
      if (campoOrdenamiento === 'diasMaximoRetraso') {
        valorA = a.diasMaximoRetraso;
        valorB = b.diasMaximoRetraso;
      } else {
        valorA = a.importeTotalAdeudado;
        valorB = b.importeTotalAdeudado;
      }
      
      return direccionOrdenamiento === 'asc' ? valorA - valorB : valorB - valorA;
    });
  }, [clientes, campoOrdenamiento, direccionOrdenamiento]);

  const handleOrdenar = (campo: 'diasMaximoRetraso' | 'importeTotalAdeudado') => {
    if (campoOrdenamiento === campo) {
      setDireccionOrdenamiento(direccionOrdenamiento === 'asc' ? 'desc' : 'asc');
    } else {
      setCampoOrdenamiento(campo);
      setDireccionOrdenamiento('desc');
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const obtenerBadgeNivelRiesgo = (nivel: NivelRiesgo) => {
    const configs: Record<NivelRiesgo, { label: string; variant: 'blue' | 'yellow' | 'red' }> = {
      bajo: { label: 'Bajo', variant: 'blue' },
      medio: { label: 'Medio', variant: 'yellow' },
      alto: { label: 'Alto', variant: 'yellow' },
      critico: { label: 'Crítico', variant: 'red' }
    };
    
    const config = configs[nivel];
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
  };

  const obtenerBadgeEstadoMorosidad = (estado: EstadoMorosidad) => {
    const configs: Record<EstadoMorosidad, { label: string; variant: 'blue' | 'yellow' | 'purple' | 'green' | 'red' }> = {
      en_revision: { label: 'En Revisión', variant: 'blue' },
      en_gestion: { label: 'En Gestión', variant: 'yellow' },
      plan_de_pago: { label: 'Plan de Pago', variant: 'purple' },
      derivado_externo: { label: 'Derivado Externo', variant: 'red' },
      resuelto: { label: 'Resuelto', variant: 'green' }
    };
    
    const config = configs[estado];
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
  };

  const limpiarFiltros = () => {
    setNivelRiesgoSeleccionados([]);
    setEstadoMorosidadSeleccionados([]);
    setDiasRetrasoMin(undefined);
    setDiasRetrasoMax(undefined);
    setImporteMin('');
    setImporteMax('');
  };

  const tieneFiltrosActivos = 
    nivelRiesgoSeleccionados.length > 0 ||
    estadoMorosidadSeleccionados.length > 0 ||
    diasRetrasoMin !== undefined ||
    diasRetrasoMax !== undefined ||
    importeMin !== '' ||
    importeMax !== '';

  // Acciones rápidas
  const handleVerDetalle = (cliente: ClienteMoroso) => {
    navigate(`/crm/cliente-360/${cliente.idCliente}`);
  };

  const handleAbrirModalPlanPago = async (cliente: ClienteMoroso) => {
    setClienteSeleccionado(cliente);
    
    // Buscar si ya existe un plan de pago activo para este cliente
    try {
      const planes = await planesPagoAPI.obtenerTodosPlanes();
      const planActivo = planes.find(p => 
        p.clienteId === cliente.idCliente && p.estadoPlan === 'activo'
      );
      
      if (planActivo) {
        // Si ya existe un plan, informar al usuario
        alert(`Ya existe un plan de pago activo para ${cliente.nombreCliente}. Revisa la sección "Planes de Pago" para más detalles.`);
        return;
      }
    } catch (error) {
      console.error('Error al buscar planes de pago:', error);
    }
    
    setMostrarModalPlanPago(true);
  };

  const handleAbrirModalAccionCobro = (cliente: ClienteMoroso) => {
    setClienteSeleccionado(cliente);
    setNotaAccionCobro('');
    setTipoAccionCobro('llamada');
    setMostrarModalAccionCobro(true);
  };

  const handleRegistrarAccionCobro = async () => {
    if (!clienteSeleccionado || !notaAccionCobro.trim()) return;
    
    try {
      // Registrar acción de cobro como seguimiento
      // Nota: En una implementación real, esto se registraría en el historial de morosidad del cliente
      // Por ahora, usamos el seguimiento API para mantener consistencia
      await seguimientoAPI.crearSeguimiento({
        pagoPendienteId: clienteSeleccionado.idCliente, // Usar ID de cliente como referencia
        accion: `Acción de cobro: ${tipoAccionCobro}`,
        tipo: 'contacto',
        usuario: 'usuario_actual', // TODO: obtener del contexto de auth
        notas: notaAccionCobro.trim()
      });
      
      // Actualizar estado de morosidad si es necesario
      if (clienteSeleccionado.estadoMorosidad === 'en_revision') {
        await clientesMorososAPI.actualizarEstadoMorosidad(clienteSeleccionado.idCliente, 'en_gestion');
      }
      
      setMostrarModalAccionCobro(false);
      setClienteSeleccionado(null);
      setNotaAccionCobro('');
      cargarClientes();
      onRefresh?.();
    } catch (error) {
      console.error('Error al registrar acción de cobro:', error);
      alert('Error al registrar la acción de cobro. Por favor, intenta nuevamente.');
    }
  };

  const handleAbrirModalHistorial = async (cliente: ClienteMoroso) => {
    setClienteSeleccionado(cliente);
    setMostrarModalHistorial(true);
  };

  const handleExportarExcel = () => {
    try {
      const datosExportacion = clientesOrdenados.map(cliente => ({
        'Nombre': cliente.nombreCliente,
        'Email': cliente.email,
        'Teléfono': cliente.telefono || '',
        'Importe Total Adeudado': cliente.importeTotalAdeudado,
        'Importe Total Adeudado (Formato)': formatearMoneda(cliente.importeTotalAdeudado),
        'Importe Vencido': cliente.importeVencido,
        'Importe Vencido (Formato)': formatearMoneda(cliente.importeVencido),
        'Días Máximo Retraso': cliente.diasMaximoRetraso,
        'Nivel de Riesgo': cliente.nivelRiesgo,
        'Estado Morosidad': cliente.estadoMorosidad,
        'Número Facturas Vencidas': cliente.numeroFacturasVencidas,
        'Fecha Último Pago': cliente.fechaUltimoPago?.toLocaleDateString('es-ES') || '',
        'Fecha Último Contacto': cliente.fechaUltimoContacto?.toLocaleDateString('es-ES') || '',
        'Gestor Asignado': cliente.gestorAsignado || ''
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(datosExportacion);

      const columnWidths = [
        { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 18 }, { wch: 20 },
        { wch: 18 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 18 },
        { wch: 15 }, { wch: 18 }, { wch: 18 }, { wch: 18 }
      ];
      ws['!cols'] = columnWidths;

      XLSX.utils.book_append_sheet(wb, ws, 'Clientes Morosos');

      const fecha = new Date().toISOString().split('T')[0];
      const nombreArchivo = `Clientes_Morosos_${fecha}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      alert('Error al exportar la lista a Excel. Por favor, intenta nuevamente.');
    }
  };

  const columnas: TableColumn<ClienteMoroso>[] = [
    {
      key: 'nombreCliente',
      label: 'Cliente',
      render: (_, row) => (
        <div>
          <div className="font-medium text-gray-900">{row.nombreCliente}</div>
          <div className="text-sm text-gray-500 mt-0.5">{row.email}</div>
          {row.telefono && (
            <div className="text-xs text-gray-400 mt-0.5">{row.telefono}</div>
          )}
        </div>
      )
    },
    {
      key: 'importeTotalAdeudado',
      label: (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleOrdenar('importeTotalAdeudado')}>
          <span>Importe Total Adeudado</span>
          {campoOrdenamiento === 'importeTotalAdeudado' && (
            direccionOrdenamiento === 'desc' ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />
          )}
        </div>
      ),
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-900">{formatearMoneda(row.importeTotalAdeudado)}</span>
        </div>
      ),
      align: 'right'
    },
    {
      key: 'importeVencido',
      label: 'Importe Vencido',
      render: (_, row) => (
        <div className="text-gray-700">{formatearMoneda(row.importeVencido)}</div>
      ),
      align: 'right'
    },
    {
      key: 'diasMaximoRetraso',
      label: (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleOrdenar('diasMaximoRetraso')}>
          <span>Días de Retraso</span>
          {campoOrdenamiento === 'diasMaximoRetraso' && (
            direccionOrdenamiento === 'desc' ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />
          )}
        </div>
      ),
      render: (_, row) => {
        const color = row.diasMaximoRetraso <= 15 ? 'text-yellow-600' : 
                      row.diasMaximoRetraso <= 30 ? 'text-orange-600' : 'text-red-600';
        return (
          <div className="flex items-center gap-2">
            <Calendar className={`w-4 h-4 ${color}`} />
            <span className={`font-medium ${color}`}>
              {row.diasMaximoRetraso} días
            </span>
          </div>
        );
      },
      align: 'right'
    },
    {
      key: 'nivelRiesgo',
      label: 'Nivel de Riesgo',
      render: (_, row) => obtenerBadgeNivelRiesgo(row.nivelRiesgo)
    },
    {
      key: 'estadoMorosidad',
      label: 'Estado',
      render: (_, row) => obtenerBadgeEstadoMorosidad(row.estadoMorosidad)
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVerDetalle(row)}
            title="Ver detalle del cliente"
            leftIcon={<Eye className="w-4 h-4" />}
          >
            Detalle
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAbrirModalPlanPago(row)}
            title="Crear o abrir plan de pago"
            leftIcon={<FileText className="w-4 h-4" />}
          >
            Plan
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAbrirModalAccionCobro(row)}
            title="Registrar acción de cobro"
            leftIcon={<Phone className="w-4 h-4" />}
          >
            Cobro
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAbrirModalHistorial(row)}
            title="Abrir historial de contactos"
            leftIcon={<MessageSquare className="w-4 h-4" />}
          >
            Historial
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Listado de Clientes Morosos
          </h2>
          <p className="text-gray-600">
            Gestión completa de clientes con deudas pendientes
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Total: <span className="font-semibold text-gray-900">{clientesOrdenados.length}</span> clientes
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExportarExcel}
            leftIcon={<Download className="w-4 h-4" />}
            disabled={clientesOrdenados.length === 0}
          >
            Exportar
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            leftIcon={<Filter className="w-4 h-4" />}
          >
            Filtros
            {tieneFiltrosActivos && (
              <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                {[
                  nivelRiesgoSeleccionados.length,
                  estadoMorosidadSeleccionados.length,
                  diasRetrasoMin !== undefined ? 1 : 0,
                  diasRetrasoMax !== undefined ? 1 : 0,
                  importeMin ? 1 : 0,
                  importeMax ? 1 : 0
                ].reduce((a, b) => a + b, 0)}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Panel de filtros */}
      {mostrarFiltros && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Filtros</h3>
            {tieneFiltrosActivos && (
              <Button
                variant="ghost"
                size="sm"
                onClick={limpiarFiltros}
                leftIcon={<X className="w-4 h-4" />}
              >
                Limpiar filtros
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de Riesgo
              </label>
              <div className="space-y-2">
                {(['bajo', 'medio', 'alto', 'critico'] as NivelRiesgo[]).map(nivel => (
                  <label key={nivel} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={nivelRiesgoSeleccionados.includes(nivel)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNivelRiesgoSeleccionados([...nivelRiesgoSeleccionados, nivel]);
                        } else {
                          setNivelRiesgoSeleccionados(nivelRiesgoSeleccionados.filter(n => n !== nivel));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{nivel}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado de Morosidad
              </label>
              <div className="space-y-2">
                {(['en_revision', 'en_gestion', 'plan_de_pago', 'derivado_externo', 'resuelto'] as EstadoMorosidad[]).map(estado => (
                  <label key={estado} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={estadoMorosidadSeleccionados.includes(estado)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEstadoMorosidadSeleccionados([...estadoMorosidadSeleccionados, estado]);
                        } else {
                          setEstadoMorosidadSeleccionados(estadoMorosidadSeleccionados.filter(e => e !== estado));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {estado === 'en_revision' ? 'En Revisión' :
                       estado === 'en_gestion' ? 'En Gestión' :
                       estado === 'plan_de_pago' ? 'Plan de Pago' :
                       estado === 'derivado_externo' ? 'Derivado Externo' :
                       'Resuelto'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Input
                  label="Días Retraso Mínimo"
                  type="number"
                  value={diasRetrasoMin?.toString() || ''}
                  onChange={(e) => setDiasRetrasoMin(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Ej: 15"
                  min={0}
                />
              </div>
              <div>
                <Input
                  label="Días Retraso Máximo"
                  type="number"
                  value={diasRetrasoMax?.toString() || ''}
                  onChange={(e) => setDiasRetrasoMax(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Ej: 30"
                  min={0}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Input
                  label="Importe Mínimo"
                  type="text"
                  value={importeMin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d.,]/g, '');
                    setImporteMin(value);
                  }}
                  placeholder="Ej: 100000"
                />
              </div>
              <div>
                <Input
                  label="Importe Máximo"
                  type="text"
                  value={importeMax}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d.,]/g, '');
                    setImporteMax(value);
                  }}
                  placeholder="Ej: 500000"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <Table
        data={clientesOrdenados}
        columns={columnas}
        loading={loading}
        emptyMessage="No hay clientes morosos que coincidan con los filtros"
      />

      {/* Modal para plan de pago */}
      <Modal
        isOpen={mostrarModalPlanPago}
        onClose={() => {
          setMostrarModalPlanPago(false);
          setClienteSeleccionado(null);
        }}
        title="Gestión de Plan de Pago"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModalPlanPago(false);
                setClienteSeleccionado(null);
              }}
            >
              Cerrar
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                // Navegar a la sección de planes de pago con el cliente pre-seleccionado
                // O implementar creación directa aquí
                alert('Navega a la sección "Planes de Pago" para crear un plan para este cliente.');
                setMostrarModalPlanPago(false);
              }}
            >
              Crear Plan
            </Button>
          </div>
        }
      >
        {clienteSeleccionado && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">Cliente: {clienteSeleccionado.nombreCliente}</p>
              <p className="text-sm text-gray-600">Importe Adeudado: {formatearMoneda(clienteSeleccionado.importeTotalAdeudado)}</p>
            </div>
            <p className="text-sm text-gray-600">
              Para crear un plan de pago, navega a la sección "Planes de Pago" donde podrás configurar las cuotas y fechas de vencimiento.
            </p>
          </div>
        )}
      </Modal>

      {/* Modal para acción de cobro */}
      <Modal
        isOpen={mostrarModalAccionCobro}
        onClose={() => {
          setMostrarModalAccionCobro(false);
          setClienteSeleccionado(null);
          setNotaAccionCobro('');
        }}
        title="Registrar Acción de Cobro"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModalAccionCobro(false);
                setClienteSeleccionado(null);
                setNotaAccionCobro('');
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleRegistrarAccionCobro}
              disabled={!notaAccionCobro.trim()}
            >
              Registrar
            </Button>
          </div>
        }
      >
        {clienteSeleccionado && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">Cliente: {clienteSeleccionado.nombreCliente}</p>
              <p className="text-sm text-gray-600">Importe Adeudado: {formatearMoneda(clienteSeleccionado.importeTotalAdeudado)}</p>
            </div>
            <Select
              label="Tipo de Acción"
              value={tipoAccionCobro}
              onChange={(e) => setTipoAccionCobro(e.target.value as typeof tipoAccionCobro)}
              options={[
                { value: 'llamada', label: 'Llamada' },
                { value: 'email', label: 'Email' },
                { value: 'whatsapp', label: 'WhatsApp' },
                { value: 'visita', label: 'Visita' }
              ]}
            />
            <Textarea
              label="Notas del Contacto"
              value={notaAccionCobro}
              onChange={(e) => setNotaAccionCobro(e.target.value)}
              rows={4}
              placeholder="Ej: Llamé al cliente, prometió pagar esta semana. Mencionó problemas de flujo de caja temporales..."
              required
            />
          </div>
        )}
      </Modal>

      {/* Modal para historial de contactos */}
      <Modal
        isOpen={mostrarModalHistorial}
        onClose={() => {
          setMostrarModalHistorial(false);
          setClienteSeleccionado(null);
        }}
        title="Historial de Contactos"
        size="lg"
        footer={
          <Button
            variant="secondary"
            onClick={() => {
              setMostrarModalHistorial(false);
              setClienteSeleccionado(null);
            }}
          >
            Cerrar
          </Button>
        }
      >
        {clienteSeleccionado && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">Cliente: {clienteSeleccionado.nombreCliente}</p>
              <p className="text-sm text-gray-600">Email: {clienteSeleccionado.email}</p>
            </div>
            
            {clienteSeleccionado.historialMorosidad && clienteSeleccionado.historialMorosidad.length > 0 ? (
              <div className="space-y-3">
                {clienteSeleccionado.historialMorosidad
                  .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
                  .map((registro) => (
                    <div key={registro.id} className="border-l-2 border-blue-500 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-500">
                          {registro.fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {registro.usuario && (
                          <span className="text-xs text-gray-400">por {registro.usuario}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">{registro.valorNuevo}</p>
                      {registro.notas && (
                        <p className="text-xs text-gray-500 mt-1">{registro.notas}</p>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No hay historial de contactos registrado.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
