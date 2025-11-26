import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, SelectOption, Table, TableColumn, Modal, Textarea, Badge, Tooltip } from '../../../components/componentsreutilizables';
import { 
  GastoDeducible, 
  CategoriaGasto, 
  FiltroGastos, 
  CATEGORIAS_GASTO,
  ResumenGastos,
  ArchivoAdjunto
} from '../types/expenses';
import { expensesAPI } from '../api/expenses';
import { ExpenseFileUpload } from './ExpenseFileUpload';
import { MonthlyExpenseComparisonTable } from './MonthlyExpenseComparisonTable';
import { MobileExpenseForm } from './MobileExpenseForm';
import { ExpenseAlertModal } from './ExpenseAlertModal';
import { ExpenseEducationSection } from './ExpenseEducationSection';
import { useExpenseAlerts } from '../hooks/useExpenseAlerts';
import { 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign, 
  FileText,
  TrendingDown,
  Download,
  X,
  Paperclip,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Camera,
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';

const COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#14B8A6', '#F97316', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#EC4899', '#64748B'];

interface GestorGastosDeduciblesProps {
  onExpensesChange?: () => void;
}

export const GestorGastosDeducibles: React.FC<GestorGastosDeduciblesProps> = ({ 
  onExpensesChange 
}) => {
  const [gastos, setGastos] = useState<GastoDeducible[]>([]);
  const [resumen, setResumen] = useState<ResumenGastos | null>(null);
  const [loading, setLoading] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFormularioMovil, setMostrarFormularioMovil] = useState(false);
  const [gastoEditando, setGastoEditando] = useState<GastoDeducible | null>(null);
  const [filtros, setFiltros] = useState<FiltroGastos>({});
  const [isMobile, setIsMobile] = useState(false);
  
  // Sistema de alertas de gastos
  const { verificarAlerta, recalcularEstadisticas } = useExpenseAlerts();
  const [alertaActual, setAlertaActual] = useState<any>(null);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [gastoPendiente, setGastoPendiente] = useState<any>(null);
  
  // Sección educativa
  const [mostrarSeccionEducativa, setMostrarSeccionEducativa] = useState(false);

  // Detect mobile device
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    concepto: '',
    importe: '',
    categoria: '' as CategoriaGasto | '',
    deducible: true, // Por defecto, los gastos son deducibles
    notas: '',
    archivosAdjuntos: [] as ArchivoAdjunto[]
  });

  useEffect(() => {
    cargarGastos();
    cargarResumen();
  }, [filtros]);

  const cargarGastos = async () => {
    setLoading(true);
    try {
      const datos = await expensesAPI.obtenerGastos(filtros);
      setGastos(datos);
    } catch (error) {
      console.error('Error al cargar gastos:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarResumen = async () => {
    try {
      const datos = await expensesAPI.obtenerResumenGastos(filtros);
      setResumen(datos);
    } catch (error) {
      console.error('Error al cargar resumen:', error);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const formatearFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(fecha);
  };

  const handleAbrirFormulario = (gasto?: GastoDeducible) => {
    if (isMobile) {
      // Use mobile form on mobile devices
      setGastoEditando(gasto || null);
      setMostrarFormularioMovil(true);
    } else {
      // Use desktop form on desktop
      if (gasto) {
        setGastoEditando(gasto);
        setFormData({
          fecha: new Date(gasto.fecha).toISOString().split('T')[0],
          concepto: gasto.concepto,
          importe: gasto.importe.toString(),
          categoria: gasto.categoria,
          deducible: gasto.deducible,
          notas: gasto.notas || '',
          archivosAdjuntos: gasto.archivosAdjuntos || []
        });
      } else {
        setGastoEditando(null);
        setFormData({
          fecha: new Date().toISOString().split('T')[0],
          concepto: '',
          importe: '',
          categoria: '' as CategoriaGasto | '',
          deducible: true,
          notas: '',
          archivosAdjuntos: []
        });
      }
      setMostrarFormulario(true);
    }
  };

  const handleSaveMobileForm = async (gastoData: any) => {
    try {
      // Si es un nuevo gasto, verificar alertas
      if (!gastoEditando) {
        const nuevoGasto: GastoDeducible = {
          id: 'temp',
          fecha: gastoData.fecha,
          concepto: gastoData.concepto,
          importe: gastoData.importe,
          categoria: gastoData.categoria,
          deducible: gastoData.deducible,
          notas: gastoData.notas,
          archivosAdjuntos: gastoData.archivosAdjuntos || [],
          fechaCreacion: new Date(),
          fechaActualizacion: new Date(),
          usuarioCreacion: 'current-user'
        };

        const alerta = verificarAlerta(nuevoGasto);
        if (alerta) {
          // Mostrar modal de alerta
          setAlertaActual(alerta);
          setGastoPendiente(gastoData);
          setMostrarAlerta(true);
          // Mantener el formulario móvil abierto hasta que se confirme
          return;
        }
      }

      // Si no hay alerta o es una edición, guardar directamente
      if (gastoEditando) {
        await expensesAPI.actualizarGasto(gastoEditando.id, gastoData);
      } else {
        await expensesAPI.crearGasto(gastoData);
      }
      await cargarGastos();
      await cargarResumen();
      await recalcularEstadisticas();
      if (onExpensesChange) {
        onExpensesChange();
      }
      setMostrarFormularioMovil(false);
      setGastoEditando(null);
    } catch (error) {
      console.error('Error saving expense:', error);
      throw error;
    }
  };

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false);
    setGastoEditando(null);
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      concepto: '',
      importe: '',
      categoria: '' as CategoriaGasto | '',
      deducible: true,
      notas: '',
      archivosAdjuntos: []
    });
  };

  const handleGuardar = async () => {
    if (!formData.concepto || !formData.importe || !formData.categoria) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const nuevoGasto: GastoDeducible = {
      id: gastoEditando?.id || 'temp',
      fecha: new Date(formData.fecha),
      concepto: formData.concepto,
      importe: parseFloat(formData.importe),
      categoria: formData.categoria,
      deducible: formData.deducible,
      notas: formData.notas || undefined,
      archivosAdjuntos: formData.archivosAdjuntos.length > 0 ? formData.archivosAdjuntos : undefined,
      fechaCreacion: gastoEditando?.fechaCreacion || new Date(),
      fechaActualizacion: new Date(),
      usuarioCreacion: gastoEditando?.usuarioCreacion || 'current-user'
    };

    // Verificar si es un nuevo gasto (no edición) y si hay alerta
    if (!gastoEditando) {
      const alerta = verificarAlerta(nuevoGasto);
      if (alerta) {
        // Mostrar modal de alerta
        setAlertaActual(alerta);
        setGastoPendiente({
          fecha: new Date(formData.fecha),
          concepto: formData.concepto,
          importe: parseFloat(formData.importe),
          categoria: formData.categoria,
          deducible: formData.deducible,
          notas: formData.notas || undefined,
          archivosAdjuntos: formData.archivosAdjuntos.length > 0 ? formData.archivosAdjuntos : undefined
        });
        setMostrarAlerta(true);
        return; // No guardar aún, esperar confirmación del usuario
      }
    }

    // Si no hay alerta o es una edición, guardar directamente
    await guardarGastoDirectamente(nuevoGasto);
  };

  const guardarGastoDirectamente = async (gastoData: any) => {
    try {
      if (gastoEditando) {
        await expensesAPI.actualizarGasto(gastoEditando.id, {
          fecha: gastoData.fecha,
          concepto: gastoData.concepto,
          importe: gastoData.importe,
          categoria: gastoData.categoria,
          deducible: gastoData.deducible,
          notas: gastoData.notas || undefined,
          archivosAdjuntos: gastoData.archivosAdjuntos || undefined
        });
      } else {
        await expensesAPI.crearGasto({
          fecha: gastoData.fecha,
          concepto: gastoData.concepto,
          importe: gastoData.importe,
          categoria: gastoData.categoria,
          deducible: gastoData.deducible,
          notas: gastoData.notas || undefined,
          archivosAdjuntos: gastoData.archivosAdjuntos || undefined
        });
      }
      handleCerrarFormulario();
      await cargarGastos();
      await cargarResumen();
      // Recalcular estadísticas para futuras alertas
      await recalcularEstadisticas();
      // Notificar cambio de gastos para actualizar el resumen fiscal
      if (onExpensesChange) {
        onExpensesChange();
      }
    } catch (error) {
      console.error('Error al guardar gasto:', error);
      alert('Error al guardar el gasto');
    }
  };

  const handleConfirmarAlerta = async () => {
    if (gastoPendiente) {
      await guardarGastoDirectamente(gastoPendiente);
      setMostrarAlerta(false);
      setAlertaActual(null);
      setGastoPendiente(null);
      // Cerrar formulario móvil si está abierto
      setMostrarFormularioMovil(false);
      setGastoEditando(null);
    }
  };

  const handleCancelarAlerta = () => {
    setMostrarAlerta(false);
    setAlertaActual(null);
    setGastoPendiente(null);
    // No cerrar el formulario, permitir que el usuario edite
  };

  const handleEditarGastoDesdeAlerta = () => {
    // Cerrar la alerta y volver al formulario
    setMostrarAlerta(false);
    // El formulario ya está abierto con los datos, solo necesitamos que el usuario los modifique
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este gasto?')) {
      return;
    }

    try {
      await expensesAPI.eliminarGasto(id);
      await cargarGastos();
      await cargarResumen();
      // Notificar cambio de gastos para actualizar el resumen fiscal
      if (onExpensesChange) {
        onExpensesChange();
      }
    } catch (error) {
      console.error('Error al eliminar gasto:', error);
      alert('Error al eliminar el gasto');
    }
  };

  const handleExportar = () => {
    const datosExportacion = gastos.map(gasto => ({
      'Fecha': formatearFecha(gasto.fecha),
      'Concepto': gasto.concepto,
      'Categoría': CATEGORIAS_GASTO[gasto.categoria].nombre,
      'Importe': gasto.importe,
      'Deducible': gasto.deducible ? 'Sí' : 'No',
      'Notas': gasto.notas || '',
      'Archivos Adjuntos': gasto.archivosAdjuntos && gasto.archivosAdjuntos.length > 0 
        ? gasto.archivosAdjuntos.map(a => a.nombre).join(', ')
        : ''
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datosExportacion);

    ws['!cols'] = [
      { wch: 15 }, // Fecha
      { wch: 40 }, // Concepto
      { wch: 20 }, // Categoría
      { wch: 15 }, // Importe
      { wch: 50 }  // Notas
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Gastos Deducibles');
    
    const nombreArchivo = `Gastos_Deducibles_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
  };

  const opcionesCategorias: SelectOption[] = Object.values(CATEGORIAS_GASTO).map(cat => ({
    value: cat.id,
    label: cat.nombre
  }));

  const rangosPredefinidos: SelectOption[] = [
    { value: 'mes-actual', label: 'Mes Actual' },
    { value: 'mes-anterior', label: 'Mes Anterior' },
    { value: 'trimestre', label: 'Último Trimestre' },
    { value: 'semestre', label: 'Último Semestre' },
    { value: 'anio', label: 'Año Actual' }
  ];

  const handleRangoChange = (valor: string) => {
    const hoy = new Date();
    let fechaInicio: Date;
    let fechaFin: Date = new Date();

    switch (valor) {
      case 'mes-actual':
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        break;
      case 'mes-anterior':
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
        fechaFin = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
        break;
      case 'trimestre':
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth() - 3, 1);
        break;
      case 'semestre':
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth() - 6, 1);
        break;
      case 'anio':
        fechaInicio = new Date(hoy.getFullYear(), 0, 1);
        break;
      default:
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    }

    setFiltros({
      ...filtros,
      fechaInicio,
      fechaFin
    });
  };

  const columnas: TableColumn<GastoDeducible>[] = [
    {
      key: 'fecha',
      header: 'Fecha',
      render: (gasto) => formatearFecha(gasto.fecha)
    },
    {
      key: 'concepto',
      header: 'Concepto',
      render: (gasto) => (
        <div>
          <div className="font-medium text-gray-900 flex items-center gap-2">
            {gasto.concepto}
            {gasto.archivosAdjuntos && gasto.archivosAdjuntos.length > 0 && (
              <span className="flex items-center gap-1 text-blue-600" title={`${gasto.archivosAdjuntos.length} archivo(s) adjunto(s)`}>
                <Paperclip className="w-4 h-4" />
                <span className="text-xs">{gasto.archivosAdjuntos.length}</span>
              </span>
            )}
          </div>
          {gasto.notas && (
            <div className="text-sm text-gray-500">{gasto.notas}</div>
          )}
        </div>
      )
    },
    {
      key: 'categoria',
      header: 'Categoría',
      render: (gasto) => (
        <Badge variant="secondary">
          {CATEGORIAS_GASTO[gasto.categoria].nombre}
        </Badge>
      )
    },
    {
      key: 'importe',
      header: 'Importe',
      render: (gasto) => (
        <span className="font-semibold text-red-600">
          {formatearMoneda(gasto.importe)}
        </span>
      )
    },
    {
      key: 'deducible',
      header: 'Deducible',
      render: (gasto) => (
        <Badge variant={gasto.deducible ? 'success' : 'warning'}>
          {gasto.deducible ? 'Sí' : 'No'}
        </Badge>
      )
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (gasto) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAbrirFormulario(gasto)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEliminar(gasto.id)}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  const datosGrafico = resumen?.gastosPorCategoria.map(item => ({
    name: CATEGORIAS_GASTO[item.categoria].nombre,
    value: item.total,
    cantidad: item.cantidad
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                <TrendingDown className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Gastos Deducibles
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Registra y gestiona todos tus gastos deducibles para la declaración de impuestos
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {isMobile && (
                <Button
                  variant="primary"
                  onClick={() => handleAbrirFormulario()}
                  className="flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span className="hidden sm:inline">Nuevo Gasto</span>
                  <span className="sm:hidden">Nuevo</span>
                </Button>
              )}
              {!isMobile && (
                <Button
                  variant="primary"
                  onClick={() => handleAbrirFormulario()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Gasto
                </Button>
              )}
              {/* Always show mobile form option for quick access */}
              <Button
                variant="secondary"
                onClick={() => {
                  setGastoEditando(null);
                  setMostrarFormularioMovil(true);
                }}
                className="flex items-center gap-2"
                title="Formulario rápido con foto"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden lg:inline">Rápido con Foto</span>
              </Button>
            </div>
          </div>
          
          {/* Botón para mostrar/ocultar sección educativa */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={() => setMostrarSeccionEducativa(!mostrarSeccionEducativa)}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              {mostrarSeccionEducativa ? 'Ocultar' : 'Mostrar'} Guía de Gastos Deducibles
              {mostrarSeccionEducativa ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Sección Educativa */}
      {mostrarSeccionEducativa && (
        <ExpenseEducationSection />
      )}

      {/* Resumen de Gastos */}
      {resumen && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Total Gastos</div>
                    <div className="text-3xl font-bold text-red-600">
                      {formatearMoneda(resumen.totalGastos)}
                    </div>
                  </div>
                  <DollarSign className="w-10 h-10 text-red-600 opacity-20" />
                </div>
              </div>
            </Card>
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Cantidad de Gastos</div>
                    <div className="text-3xl font-bold text-purple-600">
                      {resumen.cantidadGastos}
                    </div>
                  </div>
                  <FileText className="w-10 h-10 text-purple-600 opacity-20" />
                </div>
              </div>
            </Card>
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Promedio por Gasto</div>
                    <div className="text-3xl font-bold text-blue-600">
                      {formatearMoneda(resumen.promedioGasto)}
                    </div>
                  </div>
                  <TrendingDown className="w-10 h-10 text-blue-600 opacity-20" />
                </div>
              </div>
            </Card>
          </div>
          
          {/* Totales Separados: Deducibles vs No Deducibles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2 border-green-200 bg-green-50/50">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-700 mb-1 font-medium">Gastos Deducibles</div>
                    <div className="text-2xl font-bold text-green-700 mb-1">
                      {formatearMoneda(resumen.totalGastosDeducibles)}
                    </div>
                    <div className="text-xs text-gray-600">
                      {resumen.cantidadGastosDeducibles} {resumen.cantidadGastosDeducibles === 1 ? 'gasto' : 'gastos'} • 
                      {resumen.totalGastos > 0 ? ` ${((resumen.totalGastosDeducibles / resumen.totalGastos) * 100).toFixed(1)}% del total` : ' 0%'}
                    </div>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </div>
            </Card>
            <Card className="border-2 border-orange-200 bg-orange-50/50">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-700 mb-1 font-medium">Gastos No Deducibles</div>
                    <div className="text-2xl font-bold text-orange-700 mb-1">
                      {formatearMoneda(resumen.totalGastosNoDeducibles)}
                    </div>
                    <div className="text-xs text-gray-600">
                      {resumen.cantidadGastosNoDeducibles} {resumen.cantidadGastosNoDeducibles === 1 ? 'gasto' : 'gastos'} • 
                      {resumen.totalGastos > 0 ? ` ${((resumen.totalGastosNoDeducibles / resumen.totalGastos) * 100).toFixed(1)}% del total` : ' 0%'}
                    </div>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <AlertCircle className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Gráfico de Gastos por Categoría */}
      {resumen && resumen.gastosPorCategoria.length > 0 && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Distribución de Gastos por Categoría
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
                    return `$${value}`;
                  }}
                />
                <RechartsTooltip
                  formatter={(value: number) => formatearMoneda(value)}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="value" fill="#3B82F6" name="Total Gastos" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Tabla de Comparación Mensual */}
      <MonthlyExpenseComparisonTable
        onViewDetails={(categoria, mes, año) => {
          // Filtrar gastos por categoría y mes seleccionado
          const [añoStr, mesStr] = mes.split('-');
          const fechaInicio = new Date(parseInt(añoStr), parseInt(mesStr) - 1, 1);
          const fechaFin = new Date(parseInt(añoStr), parseInt(mesStr), 0);
          
          setFiltros({
            categoria,
            fechaInicio,
            fechaFin
          });
          
          // Scroll to table
          setTimeout(() => {
            const tableElement = document.getElementById('gastos-table');
            if (tableElement) {
              tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }}
        initialMonths={6}
      />

      {/* Filtros */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h3>
            <Tooltip 
              content={
                <div className="max-w-xs">
                  <p className="font-semibold mb-2">Filtros de Búsqueda:</p>
                  <p className="text-xs mb-2">Usa los filtros para encontrar gastos específicos. Puedes combinar varios filtros para una búsqueda más precisa.</p>
                  <p className="text-xs font-semibold mt-2">Consejos:</p>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    <li>Usa rangos predefinidos para búsquedas rápidas</li>
                    <li>Combina fecha y categoría para análisis específicos</li>
                    <li>Deja los filtros vacíos para ver todos los gastos</li>
                  </ul>
                </div>
              }
              position="right"
              delay={100}
            >
              <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
            </Tooltip>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <span>Rango de Fechas</span>
                <Tooltip 
                  content={
                    <div className="max-w-xs">
                      <p className="font-semibold mb-2">Rango de Fechas Predefinido:</p>
                      <p className="text-xs mb-2">Selecciona un rango predefinido para filtrar gastos rápidamente. Esto establecerá automáticamente las fechas de inicio y fin.</p>
                      <p className="text-xs font-semibold mt-2">Opciones:</p>
                      <ul className="text-xs space-y-1 list-disc list-inside">
                        <li><strong>Mes Actual:</strong> Desde el primer día del mes hasta hoy</li>
                        <li><strong>Mes Anterior:</strong> Todo el mes pasado</li>
                        <li><strong>Último Trimestre:</strong> Últimos 3 meses</li>
                        <li><strong>Último Semestre:</strong> Últimos 6 meses</li>
                        <li><strong>Año Actual:</strong> Desde enero hasta hoy</li>
                      </ul>
                    </div>
                  }
                  position="right"
                  delay={100}
                >
                  <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                </Tooltip>
              </label>
              <Select
                label=""
                options={rangosPredefinidos}
                value=""
                onChange={(e) => handleRangoChange(e.target.value)}
                placeholder="Seleccionar rango"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <span>Fecha Inicio</span>
                <Tooltip 
                  content={
                    <div className="max-w-xs">
                      <p className="font-semibold mb-2">Fecha de Inicio:</p>
                      <p className="text-xs mb-2">Selecciona la fecha desde la que quieres ver los gastos. Los gastos desde esta fecha (inclusive) serán mostrados.</p>
                      <p className="text-xs mt-2 italic">Puedes usar un rango predefinido o establecer fechas personalizadas.</p>
                    </div>
                  }
                  position="right"
                  delay={100}
                >
                  <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                </Tooltip>
              </label>
              <Input
                label=""
                type="date"
                value={filtros.fechaInicio ? new Date(filtros.fechaInicio).toISOString().split('T')[0] : ''}
                onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value ? new Date(e.target.value) : undefined })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <span>Fecha Fin</span>
                <Tooltip 
                  content={
                    <div className="max-w-xs">
                      <p className="font-semibold mb-2">Fecha de Fin:</p>
                      <p className="text-xs mb-2">Selecciona la fecha hasta la que quieres ver los gastos. Los gastos hasta esta fecha (inclusive) serán mostrados.</p>
                      <p className="text-xs mt-2 italic">Puedes usar un rango predefinido o establecer fechas personalizadas.</p>
                    </div>
                  }
                  position="right"
                  delay={100}
                >
                  <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                </Tooltip>
              </label>
              <Input
                label=""
                type="date"
                value={filtros.fechaFin ? new Date(filtros.fechaFin).toISOString().split('T')[0] : ''}
                onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value ? new Date(e.target.value) : undefined })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <span>Categoría</span>
                <Tooltip 
                  content={
                    <div className="max-w-xs">
                      <p className="font-semibold mb-2">Filtrar por Categoría:</p>
                      <p className="text-xs mb-2">Selecciona una categoría específica para ver solo los gastos de esa categoría. Selecciona "Todas las categorías" para ver todos.</p>
                      <p className="text-xs mt-2 italic">Útil para analizar gastos por tipo, por ejemplo, ver todos los gastos de marketing o equipamiento.</p>
                    </div>
                  }
                  position="right"
                  delay={100}
                >
                  <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                </Tooltip>
              </label>
              <Select
                label=""
                options={[
                  { value: '', label: 'Todas las categorías' },
                  ...opcionesCategorias
                ]}
                value={filtros.categoria || ''}
                onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value as CategoriaGasto || undefined })}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setFiltros({})}
                fullWidth
              >
                <X className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
              <Button
                variant="primary"
                onClick={handleExportar}
                fullWidth
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabla de Gastos */}
      <Card id="gastos-table" className="bg-white shadow-sm">
        <div className="p-6">
          <Table
            data={gastos}
            columns={columnas}
            loading={loading}
            emptyMessage="No hay gastos registrados"
          />
        </div>
      </Card>

      {/* Modal de Formulario */}
      <Modal
        isOpen={mostrarFormulario}
        onClose={handleCerrarFormulario}
        title={gastoEditando ? 'Editar Gasto' : 'Nuevo Gasto'}
        size="md"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleCerrarFormulario}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleGuardar}>
              {gastoEditando ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <span>Fecha</span>
              <Tooltip 
                content={
                  <div className="max-w-xs">
                    <p className="font-semibold mb-2">Fecha del Gasto:</p>
                    <p className="text-xs mb-2">Selecciona la fecha en la que realizaste el gasto. Esta fecha es importante para la declaración de impuestos ya que los gastos deben corresponder al ejercicio fiscal correcto.</p>
                    <p className="text-xs font-semibold mt-2">Ejemplo:</p>
                    <p className="text-xs">Si compraste equipamiento el 15 de enero de 2024, selecciona esa fecha.</p>
                  </div>
                }
                position="right"
                delay={100}
              >
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
              </Tooltip>
            </label>
            <Input
              label=""
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <span>Concepto</span>
              <Tooltip 
                content={
                  <div className="max-w-xs">
                    <p className="font-semibold mb-2">Concepto del Gasto:</p>
                    <p className="text-xs mb-2">Describe brevemente en qué consistió el gasto. Sé específico para facilitar la identificación y clasificación.</p>
                    <p className="text-xs font-semibold mt-2">Ejemplos:</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      <li>"Compra de pesas y mancuernas"</li>
                      <li>"Certificación NASM 2024"</li>
                      <li>"Publicidad en Instagram"</li>
                      <li>"Combustible para desplazamientos"</li>
                      <li>"Alquiler de espacio de entrenamiento"</li>
                    </ul>
                  </div>
                }
                position="right"
                delay={100}
              >
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
              </Tooltip>
            </label>
            <Input
              label=""
              value={formData.concepto}
              onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
              placeholder="Ej: Compra de equipamiento, Certificación, etc."
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <span>Importe</span>
                <Tooltip 
                  content={
                    <div className="max-w-xs">
                      <p className="font-semibold mb-2">Importe del Gasto:</p>
                      <p className="text-xs mb-2">Ingresa el importe total del gasto en la moneda de tu país (COP). Asegúrate de incluir el IVA si está incluido en el precio.</p>
                      <p className="text-xs font-semibold mt-2">Ejemplos:</p>
                      <ul className="text-xs space-y-1 list-disc list-inside">
                        <li>150.000 (pesos colombianos)</li>
                        <li>350.000 (pesos colombianos)</li>
                      </ul>
                      <p className="text-xs mt-2 italic">Tip: Si tienes factura, usa el importe total que aparece en ella.</p>
                    </div>
                  }
                  position="right"
                  delay={100}
                >
                  <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                </Tooltip>
              </label>
              <Input
                label=""
                type="number"
                value={formData.importe}
                onChange={(e) => setFormData({ ...formData, importe: e.target.value })}
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <span>Categoría</span>
                <Tooltip 
                  content={
                    <div className="max-w-xs">
                      <p className="font-semibold mb-2">Categoría del Gasto:</p>
                      <p className="text-xs mb-2">Selecciona la categoría que mejor describe tu gasto. Esto ayuda a organizar tus gastos y facilita el análisis y la declaración de impuestos.</p>
                      <p className="text-xs font-semibold mt-2">Categorías disponibles:</p>
                      <ul className="text-xs space-y-1 list-disc list-inside">
                        <li><strong>Equipamiento:</strong> Material de entrenamiento, máquinas, pesas</li>
                        <li><strong>Certificaciones:</strong> Cursos y licencias profesionales</li>
                        <li><strong>Marketing:</strong> Publicidad, redes sociales, promoción</li>
                        <li><strong>Transporte:</strong> Combustible, mantenimiento, peajes</li>
                        <li>Y más categorías disponibles...</li>
                      </ul>
                    </div>
                  }
                  position="right"
                  delay={100}
                >
                  <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                </Tooltip>
              </label>
              <Select
                label=""
                options={opcionesCategorias}
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value as CategoriaGasto })}
                required
              />
            </div>
          </div>
          {formData.categoria && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>{CATEGORIAS_GASTO[formData.categoria].nombre}:</strong>{' '}
                {CATEGORIAS_GASTO[formData.categoria].descripcion}
              </p>
            </div>
          )}
          
          {/* Campo Deducible con ayuda contextual */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="block text-sm font-medium text-gray-700">
                ¿Es deducible?
              </label>
              <Tooltip
                content={
                  <div className="max-w-xs">
                    <p className="font-semibold mb-2">Criterios de Deducibilidad:</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      <li>Gastos necesarios para la actividad profesional</li>
                      <li>Gastos directamente relacionados con la generación de ingresos</li>
                      <li>Gastos justificados con factura o comprobante</li>
                      <li>Gastos no personales o de uso privado</li>
                    </ul>
                    <p className="text-xs mt-2 font-semibold">Ejemplos deducibles:</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      <li>Equipamiento profesional</li>
                      <li>Formación y certificaciones</li>
                      <li>Marketing y publicidad</li>
                      <li>Transporte por trabajo</li>
                    </ul>
                    <p className="text-xs mt-2 font-semibold">Ejemplos NO deducibles:</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      <li>Gastos personales</li>
                      <li>Multas y sanciones</li>
                      <li>Gastos sin justificación</li>
                    </ul>
                    <p className="text-xs mt-2 italic">
                      Consulta con tu gestor para casos específicos.
                    </p>
                  </div>
                }
                position="right"
                delay={100}
              >
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
              </Tooltip>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="deducible"
                  checked={formData.deducible === true}
                  onChange={() => setFormData({ ...formData, deducible: true })}
                  className="w-4 h-4 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Sí, es deducible
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="deducible"
                  checked={formData.deducible === false}
                  onChange={() => setFormData({ ...formData, deducible: false })}
                  className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  No, no es deducible
                </span>
              </label>
            </div>
            <div className={`p-3 rounded-lg border ${
              formData.deducible 
                ? 'bg-green-50 border-green-200' 
                : 'bg-orange-50 border-orange-200'
            }`}>
              <p className={`text-xs ${
                formData.deducible ? 'text-green-800' : 'text-orange-800'
              }`}>
                {formData.deducible ? (
                  <>
                    <strong>✓ Gastos deducibles</strong> pueden incluirse en tu declaración de impuestos y reducir tu base imponible.
                  </>
                ) : (
                  <>
                    <strong>⚠ Gastos no deducibles</strong> no pueden incluirse en tu declaración de impuestos. Se mostrarán por separado en los informes.
                  </>
                )}
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <span>Notas (opcional)</span>
              <Tooltip 
                content={
                  <div className="max-w-xs">
                    <p className="font-semibold mb-2">Notas Adicionales:</p>
                    <p className="text-xs mb-2">Añade cualquier información adicional que pueda ser útil para recordar detalles del gasto o para tu gestor.</p>
                    <p className="text-xs font-semibold mt-2">Ejemplos de información útil:</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      <li>Número de factura o referencia</li>
                      <li>Proveedor o vendedor</li>
                      <li>Detalles específicos del producto/servicio</li>
                      <li>Razón del gasto si no es obvia</li>
                      <li>Información sobre garantías o mantenimiento</li>
                    </ul>
                  </div>
                }
                position="right"
                delay={100}
              >
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
              </Tooltip>
            </label>
            <Textarea
              label=""
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              placeholder="Información adicional sobre el gasto..."
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <span>Archivos Adjuntos</span>
              <Tooltip 
                content={
                  <div className="max-w-xs">
                    <p className="font-semibold mb-2">Archivos Adjuntos:</p>
                    <p className="text-xs mb-2">Sube facturas, recibos o comprobantes del gasto. Esto es importante para justificar el gasto ante Hacienda.</p>
                    <p className="text-xs font-semibold mt-2">Formato aceptado:</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      <li>Imágenes (JPG, PNG): Máx. 10 MB</li>
                      <li>PDFs: Máx. 10 MB</li>
                      <li>Máximo 10 archivos por gasto</li>
                    </ul>
                    <p className="text-xs font-semibold mt-2">Importante:</p>
                    <p className="text-xs">Guarda siempre las facturas originales. Los archivos aquí son para referencia rápida.</p>
                  </div>
                }
                position="right"
                delay={100}
              >
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
              </Tooltip>
            </label>
            <ExpenseFileUpload
              archivos={formData.archivosAdjuntos}
              onFilesChange={(archivos) => setFormData({ ...formData, archivosAdjuntos: archivos })}
              maxFiles={10}
              maxSizeMB={10}
            />
          </div>
        </div>
      </Modal>

      {/* Modal de Formulario Móvil */}
      <MobileExpenseForm
        isOpen={mostrarFormularioMovil}
        onClose={() => {
          setMostrarFormularioMovil(false);
          setGastoEditando(null);
        }}
        onSave={handleSaveMobileForm}
        initialGasto={gastoEditando}
      />

      {/* Modal de Alerta de Gasto Anómalo */}
      <ExpenseAlertModal
        isOpen={mostrarAlerta}
        alert={alertaActual}
        onConfirm={handleConfirmarAlerta}
        onCancel={handleCancelarAlerta}
        onEdit={handleEditarGastoDesdeAlerta}
      />
    </div>
  );
};

