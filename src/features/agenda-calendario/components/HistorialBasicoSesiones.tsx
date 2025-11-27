import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { Card, Table, Badge } from '../../../components/componentsreutilizables';
import { getCitas } from '../api/calendario';
import { Cita } from '../types';
import { useAuth } from '../../../context/AuthContext';

export const HistorialBasicoSesiones: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sesionesCompletadas, setSesionesCompletadas] = useState<Cita[]>([]);

  useEffect(() => {
    if (user?.id) {
      cargarSesionesCompletadas();
    }
  }, [user?.id]);

  const cargarSesionesCompletadas = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Obtener sesiones completadas de los últimos 30 días
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - 30);
      const fechaFin = new Date();

      const citas = await getCitas({
        fechaInicio,
        fechaFin,
        entrenadorId: user.id,
        estado: 'completada',
      });

      // Ordenar por fecha más reciente primero
      const citasOrdenadas = citas.sort((a, b) => 
        b.fechaInicio.getTime() - a.fechaInicio.getTime()
      );

      // Limitar a las últimas 20 sesiones
      setSesionesCompletadas(citasOrdenadas.slice(0, 20));
    } catch (error) {
      console.error('Error cargando sesiones completadas:', error);
    } finally {
      setLoading(false);
    }
  };

  const columnas = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (cita: Cita) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>
            {new Date(cita.fechaInicio).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </span>
        </div>
      ),
    },
    {
      key: 'hora',
      label: 'Hora',
      render: (cita: Cita) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>
            {new Date(cita.fechaInicio).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      ),
    },
    {
      key: 'cliente',
      label: 'Cliente',
      render: (cita: Cita) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span>{cita.cliente?.nombre || cita.clienteNombre || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo de Sesión',
      render: (cita: Cita) => {
        const tipos: Record<string, string> = {
          'sesion-1-1': 'Sesión 1:1',
          'videollamada': 'Videollamada',
          'evaluacion': 'Evaluación',
          'clase-colectiva': 'Clase Colectiva',
        };
        const tipo = cita.tipo || cita.tipoSesionId || 'otro';
        return <Badge variant="secondary">{tipos[tipo] || tipo}</Badge>;
      },
    },
    {
      key: 'duracion',
      label: 'Duración',
      render: (cita: Cita) => {
        const duracionMs = cita.fechaFin.getTime() - cita.fechaInicio.getTime();
        const minutos = Math.round(duracionMs / (1000 * 60));
        return `${minutos} min`;
      },
    },
  ];

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Historial de Sesiones Completadas</h2>
        <p className="text-sm text-gray-600 mb-4">
          Últimas sesiones completadas (últimos 30 días)
        </p>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Cargando...</div>
        ) : sesionesCompletadas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay sesiones completadas en los últimos 30 días
          </div>
        ) : (
          <Table data={sesionesCompletadas} columns={columnas} />
        )}
      </div>
    </Card>
  );
};

