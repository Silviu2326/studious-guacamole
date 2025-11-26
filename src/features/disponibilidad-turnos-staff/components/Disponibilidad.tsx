import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Input } from '../../../components/componentsreutilizables';
import { Personal } from '../types';
import { getPersonal } from '../api/personal';
import { getTurnos } from '../api/turnos';
import { User, CheckCircle, XCircle, Clock, Loader2, Calendar } from 'lucide-react';

export const Disponibilidad: React.FC = () => {
  const [personal, setPersonal] = useState<Personal[]>([]);
  const [loading, setLoading] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    cargarDatos();
  }, [fechaSeleccionada]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [personalData, turnosData] = await Promise.all([
        getPersonal(),
        getTurnos({ fechaDesde: fechaSeleccionada, fechaHasta: fechaSeleccionada }),
      ]);
      setPersonal(personalData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const verificarDisponibilidad = async (personalId: string) => {
    const turnos = await getTurnos({
      personalId,
      fechaDesde: fechaSeleccionada,
      fechaHasta: fechaSeleccionada,
    });
    return turnos.length === 0;
  };

  const columns = [
    {
      key: 'nombre',
      label: 'Personal',
      render: (value: string, row: Personal) => (
        <div className="flex items-center gap-2">
          <User size={16} className="text-slate-500" />
          <div>
            <div className="font-medium text-sm text-slate-900">{value} {row.apellidos}</div>
            <div className="text-xs text-slate-600">{row.tipo}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: string, row: Personal) => {
        const disponible = row.estado === 'activo';
        return (
          <div className="flex items-center gap-2">
            {disponible ? (
              <>
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm text-green-600">Disponible</span>
              </>
            ) : (
              <>
                <XCircle size={16} className="text-red-500" />
                <span className="text-sm text-red-600">No disponible</span>
              </>
            )}
          </div>
        );
      },
    },
    {
      key: 'especialidad',
      label: 'Especialidad',
      render: (value: string) => (
        <span className="text-sm text-slate-600">{value || '-'}</span>
      ),
    },
  ];

  if (loading && personal.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando disponibilidad...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar Superior */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Fecha:</label>
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
            <input
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              className="pl-10 pr-3 py-2 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Tabla de Disponibilidad */}
      <Card className="bg-white shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock size={16} />
            <span>Mostrando disponibilidad para {new Date(fechaSeleccionada).toLocaleDateString('es-ES')}</span>
          </div>
        </div>
        {personal.length === 0 && !loading ? (
          <div className="p-8 text-center">
            <User size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay personal registrado</h3>
            <p className="text-gray-600">No se encontró personal para mostrar la disponibilidad</p>
          </div>
        ) : (
          <Table
            data={personal}
            columns={columns}
            loading={loading}
            emptyMessage="No hay personal registrado"
          />
        )}
      </Card>
    </div>
  );
};

