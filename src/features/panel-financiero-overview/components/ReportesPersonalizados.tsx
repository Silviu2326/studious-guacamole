/**
 * Componente ReportesPersonalizados
 * 
 * Permite crear y listar reportes financieros personalizados con filtros configurables.
 * Este componente se utiliza en el tab "Reportes" del panel financiero.
 * 
 * @remarks
 * - Permite configurar filtros básicos (rango de fechas, rol, tipo de reporte)
 * - Llama a `generarReporteFinanciero` para crear reportes mock
 * - Muestra el listado de reportes existentes usando `getReportesGenerados`
 * - Incluye una tabla con nombre, tipo, fecha de generación y botón de descarga
 */

import React, { useState, useEffect } from 'react';
import { Card, Table, TableColumn, Button, Badge, Modal, Input, Select } from '../../../components/componentsreutilizables';
import { FileText, Download, Plus, Calendar, Filter } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { generarReporteFinanciero, getReportesGenerados } from '../api';
import { ReportePersonalizado, RolFinanciero, ConfigGeneracionReporte, FiltrosReportesGenerados } from '../types';

export const ReportesPersonalizados: React.FC = () => {
  const { user } = useAuth();
  const [reportes, setReportes] = useState<ReportePersonalizado[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generando, setGenerando] = useState(false);
  
  // Filtros para crear reporte
  const [nombreReporte, setNombreReporte] = useState('');
  const [tipoReporte, setTipoReporte] = useState('resumen');
  const [rolFiltro, setRolFiltro] = useState<RolFinanciero>((user?.role === 'entrenador' || user?.role === 'gimnasio') ? user.role : 'entrenador');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  
  // Filtros para listar reportes
  const [filtrosListado, setFiltrosListado] = useState<FiltrosReportesGenerados>({});

  // Cargar reportes al montar el componente y cuando cambien los filtros
  useEffect(() => {
    cargarReportes();
  }, [filtrosListado]);

  const cargarReportes = async () => {
    try {
      setLoading(true);
      const data = await getReportesGenerados(filtrosListado);
      setReportes(data);
    } catch (error) {
      console.error('Error cargando reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerarReporte = async () => {
    if (!nombreReporte.trim()) {
      alert('Por favor, ingresa un nombre para el reporte');
      return;
    }

    try {
      setGenerando(true);
      
      const config: ConfigGeneracionReporte = {
        rol: rolFiltro,
        tipoReporte: tipoReporte,
        nombre: nombreReporte,
        descripcion: '',
        formato: 'PDF',
        filtrosAdicionales: {
          fechaInicio: fechaInicio || undefined,
          fechaFin: fechaFin || undefined,
        }
      };

      const nuevoReporte = await generarReporteFinanciero(config);
      
      // Recargar la lista de reportes
      await cargarReportes();
      
      setIsModalOpen(false);
      resetearFormulario();
    } catch (error) {
      console.error('Error generando reporte:', error);
      alert('Error al generar el reporte. Por favor, intenta nuevamente.');
    } finally {
      setGenerando(false);
    }
  };

  const resetearFormulario = () => {
    setNombreReporte('');
    setTipoReporte('resumen');
    setFechaInicio('');
    setFechaFin('');
  };

  const handleAbrirModal = () => {
    setIsModalOpen(true);
  };

  const handleCerrarModal = () => {
    setIsModalOpen(false);
    resetearFormulario();
  };

  const handleDescargar = (reporte: ReportePersonalizado) => {
    // Usar urlDescargaMock para la descarga
    if (reporte.urlDescargaMock) {
      // En producción, esto sería una URL real del backend
      // Por ahora, simulamos la descarga
      const link = document.createElement('a');
      link.href = reporte.urlDescargaMock;
      link.download = `${reporte.nombre}.${reporte.formato.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('URL de descarga no disponible');
    }
  };

  const handleAplicarFiltrosListado = () => {
    // Los filtros ya están en el estado filtrosListado
    // Se recargarán automáticamente por el useEffect
    cargarReportes();
  };

  const columns: TableColumn<ReportePersonalizado>[] = [
    { 
      key: 'nombre', 
      label: 'Nombre del Reporte',
      render: (val) => <span className="font-medium text-gray-900">{val}</span>
    },
    { 
      key: 'filtrosAplicados', 
      label: 'Tipo', 
      render: (val, row) => {
        const tipo = row.filtrosAplicados?.tipoReporte || 'N/A';
        return <Badge variant="blue">{tipo}</Badge>;
      }
    },
    { 
      key: 'generadoEn', 
      label: 'Fecha Generación', 
      render: (val, row) => {
        const fecha = row.generadoEn || row.fechaGeneracion;
        return fecha ? new Date(fecha).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : 'N/A';
      }
    },
    {
      key: 'formato',
      label: 'Formato',
      render: (val) => <Badge variant="gray">{val || 'PDF'}</Badge>
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDescargar(row)}
            title="Descargar reporte"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  const tipoReporteOptions = [
    { value: 'resumen', label: 'Resumen Financiero' },
    { value: 'ingresos', label: 'Análisis de Ingresos' },
    { value: 'gastos', label: 'Análisis de Gastos' },
    { value: 'rendimiento', label: 'Rendimiento Mensual' },
    { value: 'proyecciones', label: 'Proyecciones Futuras' }
  ];

  const rolOptions = [
    { value: 'entrenador', label: 'Entrenador' },
    { value: 'gimnasio', label: 'Gimnasio' }
  ];

  return (
    <div className="space-y-6">
      {/* Sección de creación de reportes */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Reportes Personalizados
              </h2>
            </div>
            <Button 
              onClick={handleAbrirModal} 
              leftIcon={<Plus className="w-4 h-4" />}
              variant="primary"
            >
              Generar Nuevo Reporte
            </Button>
          </div>

          {/* Filtros para el listado de reportes */}
          <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-slate-600" />
              <h3 className="text-sm font-semibold text-slate-700">Filtros de Búsqueda</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Rol"
                options={rolOptions}
                value={filtrosListado.rol || ''}
                onChange={(e) => setFiltrosListado({ ...filtrosListado, rol: e.target.value as RolFinanciero || undefined })}
              />
              <Input
                label="Tipo de Reporte"
                placeholder="Ej: resumen, ingresos..."
                value={filtrosListado.tipoReporte || ''}
                onChange={(e) => setFiltrosListado({ ...filtrosListado, tipoReporte: e.target.value || undefined })}
              />
              <div className="flex items-end">
                <Button 
                  onClick={handleAplicarFiltrosListado}
                  variant="secondary"
                  leftIcon={<Filter className="w-4 h-4" />}
                  fullWidth
                >
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </div>

          {/* Tabla de reportes */}
          <Table 
            data={reportes} 
            columns={columns} 
            loading={loading} 
            emptyMessage="No hay reportes guardados. Genera tu primer reporte para comenzar." 
          />
        </div>
      </Card>

      {/* Modal para crear nuevo reporte */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCerrarModal}
        title="Crear Nuevo Reporte Financiero"
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleCerrarModal} disabled={generando}>
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              onClick={handleGenerarReporte}
              loading={generando}
              disabled={generando || !nombreReporte.trim()}
            >
              {generando ? 'Generando...' : 'Generar Reporte'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nombre del Reporte"
            placeholder="Ej: Resumen Mensual Octubre 2024"
            value={nombreReporte}
            onChange={(e) => setNombreReporte(e.target.value)}
            required
          />
          
          <Select
            label="Tipo de Reporte"
            options={tipoReporteOptions}
            value={tipoReporte}
            onChange={(e) => setTipoReporte(e.target.value)}
          />

          <Select
            label="Rol"
            options={rolOptions}
            value={rolFiltro}
            onChange={(e) => setRolFiltro(e.target.value as RolFinanciero)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha Inicio (Opcional)
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha Fin (Opcional)
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

