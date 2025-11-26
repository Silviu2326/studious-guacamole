import React, { useState } from 'react';
import { Card, Table, TableColumn, Button, Badge, Modal, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { FileText, Download, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { reportesApi } from '../api';
import { ReportePersonalizado } from '../types';

export const ReportesPersonalizados: React.FC = () => {
  const { user } = useAuth();
  const [reportes, setReportes] = React.useState<ReportePersonalizado[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombreReporte, setNombreReporte] = useState('');
  const [tipoReporte, setTipoReporte] = useState('resumen');
  const [descripcion, setDescripcion] = useState('');

  React.useEffect(() => {
    const cargarReportes = async () => {
      try {
        setLoading(true);
        const data = await reportesApi.obtenerReportesGuardados();
        setReportes(data);
      } catch (error) {
        console.error('Error cargando reportes:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarReportes();
  }, []);

  const handleGenerarReporte = async () => {
    try {
      const nuevoReporte = await reportesApi.generarReporte(
        user?.role || 'entrenador',
        tipoReporte,
        { nombre: nombreReporte, descripcion }
      );
      setReportes([...reportes, nuevoReporte]);
      setIsModalOpen(false);
      setNombreReporte('');
      setTipoReporte('resumen');
      setDescripcion('');
    } catch (error) {
      console.error('Error generando reporte:', error);
    }
  };

  const handleAbrirModal = () => {
    setIsModalOpen(true);
  };

  const handleCerrarModal = () => {
    setIsModalOpen(false);
    setNombreReporte('');
    setTipoReporte('resumen');
    setDescripcion('');
  };

  const handleEliminar = async (id: string) => {
    try {
      await reportesApi.eliminarReporte(id);
      setReportes(reportes.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error eliminando reporte:', error);
    }
  };

  const columns: TableColumn<ReportePersonalizado>[] = [
    { key: 'nombre', label: 'Nombre del Reporte' },
    { 
      key: 'tipo', 
      label: 'Tipo', 
      render: (val) => <Badge variant="blue">{val}</Badge>
    },
    { 
      key: 'fechaGeneracion', 
      label: 'Fecha Generación', 
      render: (val) => new Date(val).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log('Descargar:', row.id)}
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEliminar(row.id)}
          >
            <Trash2 className="w-4 h-4" />
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

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Reportes Personalizados
              </h2>
            </div>
            <Button onClick={handleAbrirModal} leftIcon={<Plus className="w-4 h-4" />}>
              Generar Nuevo Reporte
            </Button>
          </div>
          <Table data={reportes} columns={columns} loading={loading} emptyMessage="No hay reportes guardados" />
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCerrarModal}
        title="Crear Nuevo Reporte"
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleCerrarModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleGenerarReporte}>
              Generar Reporte
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
          />
          
          <Select
            label="Tipo de Reporte"
            options={tipoReporteOptions}
            value={tipoReporte}
            onChange={(e) => setTipoReporte(e.target.value)}
          />
          
          <Textarea
            label="Descripción (Opcional)"
            placeholder="Añade una descripción para este reporte..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={4}
          />
        </div>
      </Modal>
    </div>
  );
};

