import React, { useState, useEffect } from 'react';
import { Renovacion } from '../types';
import { Card, Table, Badge, Button } from '../../../components/componentsreutilizables';
import { getRenovaciones, procesarRenovacion, getProximasRenovaciones } from '../api/renovaciones';
import { RefreshCw, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

export const RenovacionesAutomaticas: React.FC = () => {
  const [renovaciones, setRenovaciones] = useState<Renovacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRenovaciones();
  }, []);

  const loadRenovaciones = async () => {
    setLoading(true);
    try {
      const data = await getProximasRenovaciones(30);
      setRenovaciones(data);
    } catch (error) {
      console.error('Error cargando renovaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcesarRenovacion = async (id: string) => {
    try {
      await procesarRenovacion(id);
      await loadRenovaciones();
    } catch (error) {
      console.error('Error procesando renovación:', error);
      alert('Error al procesar la renovación');
    }
  };

  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { label: string; color: 'success' | 'warning' | 'error' | 'info' }> = {
      programada: { label: 'Programada', color: 'info' },
      procesada: { label: 'Procesada', color: 'success' },
      fallida: { label: 'Fallida', color: 'error' },
    };
    
    const estadoData = estados[estado] || estados.programada;
    return <Badge color={estadoData.color}>{estadoData.label}</Badge>;
  };

  const columns = [
    {
      key: 'fechaRenovacion',
      label: 'Fecha Renovación',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-base text-gray-900">
            {new Date(value).toLocaleDateString('es-ES')}
          </span>
        </div>
      ),
    },
    {
      key: 'monto',
      label: 'Monto',
      render: (value: number) => (
        <span className="text-base font-semibold text-gray-900">
          {value} €
        </span>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: string) => getEstadoBadge(value),
    },
    {
      key: 'fechaProcesamiento',
      label: 'Procesamiento',
      render: (value?: string) => (
        value ? (
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-900">
              {new Date(value).toLocaleDateString('es-ES')}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-600">
            Pendiente
          </span>
        )
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (value: any, row: Renovacion) => (
        row.estado === 'programada' ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleProcesarRenovacion(row.id)}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Procesar
          </Button>
        ) : (
          <span className="text-sm text-gray-600">
            {row.estado === 'procesada' ? 'Completada' : 'Fallida'}
          </span>
        )
      ),
    },
  ];

  const renovacionesProgramadas = renovaciones.filter(r => r.estado === 'programada');
  const renovacionesProcesadas = renovaciones.filter(r => r.estado === 'procesada');

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Total Renovaciones
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {renovaciones.length}
              </p>
            </div>
            <RefreshCw className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Programadas
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {renovacionesProgramadas.length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>
        
        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Procesadas
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {renovacionesProcesadas.length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Tabla de renovaciones */}
      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Renovaciones Automáticas
          </h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={loadRenovaciones}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>
        <Table
          data={renovaciones}
          columns={columns}
          loading={loading}
          emptyMessage="No hay renovaciones programadas"
        />
      </Card>
    </div>
  );
};

