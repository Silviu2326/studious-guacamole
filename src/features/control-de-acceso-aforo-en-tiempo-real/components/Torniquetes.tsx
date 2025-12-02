import React, { useState, useEffect } from 'react';
import { Card, Button, Table } from '../../../components/componentsreutilizables';
import {
  obtenerEstadoAcceso,
  cambiarEstadoTorniquete,
  type EstadoAcceso,
} from '../api';
import { ArrowRightLeft, CheckCircle, XCircle, Wrench, AlertCircle, Power } from 'lucide-react';

interface Torniquete {
  id: string;
  nombre: string;
  tipo: 'entrada' | 'salida';
  estado: 'activo' | 'inactivo' | 'mantenimiento';
  ubicacion: string;
  ultimaAccion?: string;
}

export const Torniquetes: React.FC = () => {
  const [torniquetes, setTorniquetes] = useState<Torniquete[]>([]);
  const [estadoAcceso, setEstadoAcceso] = useState<EstadoAcceso | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarEstado();
    const interval = setInterval(cargarEstado, 5000);
    return () => clearInterval(interval);
  }, []);

  const cargarEstado = async () => {
    try {
      const estado = await obtenerEstadoAcceso();
      setEstadoAcceso(estado);
      
      setTorniquetes([
        {
          id: '1',
          nombre: 'Torniquete Principal Entrada',
          tipo: 'entrada',
          estado: estado.torniquetesActivos > 0 ? 'activo' : 'inactivo',
          ubicacion: 'Entrada Principal',
        },
        {
          id: '2',
          nombre: 'Torniquete Secundario Entrada',
          tipo: 'entrada',
          estado: estado.torniquetesActivos > 1 ? 'activo' : 'inactivo',
          ubicacion: 'Entrada Lateral',
        },
        {
          id: '3',
          nombre: 'Torniquete Salida',
          tipo: 'salida',
          estado: estado.torniquetesActivos > 2 ? 'activo' : 'inactivo',
          ubicacion: 'Salida Principal',
        },
      ]);
    } catch (error) {
      console.error('Error al cargar estado:', error);
    }
  };

  const handleCambiarEstado = async (torniqueteId: string, nuevoEstado: 'activo' | 'inactivo' | 'mantenimiento') => {
    setLoading(true);
    try {
      await cambiarEstadoTorniquete(torniqueteId, nuevoEstado);
      await cargarEstado();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    } finally {
      setLoading(false);
    }
  };

  const columnas = [
    {
      key: 'nombre',
      label: 'Nombre',
      render: (value: string, row: Torniquete) => (
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-blue-600" />
          <span className="font-semibold">{value}</span>
        </div>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          value === 'entrada' 
            ? 'bg-blue-100 text-blue-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {value === 'entrada' ? 'Entrada' : 'Salida'}
        </span>
      ),
    },
    {
      key: 'ubicacion',
      label: 'Ubicación',
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: string, row: Torniquete) => {
        const estados = {
          activo: { icon: <CheckCircle className="w-5 h-5 text-green-600" />, label: 'Activo', color: 'text-green-600' },
          inactivo: { icon: <XCircle className="w-5 h-5 text-red-600" />, label: 'Inactivo', color: 'text-red-600' },
          mantenimiento: { icon: <Wrench className="w-5 h-5 text-yellow-600" />, label: 'Mantenimiento', color: 'text-yellow-600' },
        };
        const estado = estados[value as keyof typeof estados];
        return (
          <div className="flex items-center gap-2">
            {estado.icon}
            <span className={`font-semibold ${estado.color}`}>{estado.label}</span>
          </div>
        );
      },
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: Torniquete) => (
        <div className="flex gap-2">
          {row.estado !== 'activo' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleCambiarEstado(row.id, 'activo')}
              disabled={loading}
            >
              <Power className="w-4 h-4 mr-1" />
              Activar
            </Button>
          )}
          {row.estado !== 'inactivo' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleCambiarEstado(row.id, 'inactivo')}
              disabled={loading}
            >
              Desactivar
            </Button>
          )}
          {row.estado !== 'mantenimiento' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCambiarEstado(row.id, 'mantenimiento')}
              disabled={loading}
            >
              <Wrench className="w-4 h-4 mr-1" />
              Mantenimiento
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Resumen */}
      {estadoAcceso && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Estado de Torniquetes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl ring-1 ring-slate-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Torniquetes Activos
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {estadoAcceso.torniquetesActivos} / {estadoAcceso.torniquetesTotal}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>

              {estadoAcceso.modoEmergencia && (
                <div className="bg-white rounded-xl ring-1 ring-slate-200 p-4 shadow-sm bg-red-50 ring-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Modo Emergencia
                      </p>
                      <p className="text-2xl font-bold text-red-600">
                        Activo
                      </p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                </div>
              )}

              {estadoAcceso.modoMantenimiento && (
                <div className="bg-white rounded-xl ring-1 ring-slate-200 p-4 shadow-sm bg-yellow-50 ring-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Modo Mantenimiento
                      </p>
                      <p className="text-2xl font-bold text-yellow-600">
                        Activo
                      </p>
                    </div>
                    <Wrench className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Lista de torniquetes */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Gestión de Torniquetes
          </h2>
          <Table
            data={torniquetes}
            columns={columnas}
            loading={loading}
            emptyMessage="No hay torniquetes configurados"
          />
        </div>
      </Card>
    </div>
  );
};

