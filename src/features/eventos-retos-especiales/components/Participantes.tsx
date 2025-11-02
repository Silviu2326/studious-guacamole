import React from 'react';
import { Participante } from '../types';
import { Table, Card, Button } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { ds } from '../../adherencia/ui/ds';
import { Users, Trophy, Trash2, TrendingUp, Calendar } from 'lucide-react';

interface ParticipantesProps {
  participantes: Participante[];
  loading?: boolean;
  onEliminar?: (participante: Participante) => void;
}

export const Participantes: React.FC<ParticipantesProps> = ({
  participantes,
  loading = false,
  onEliminar,
}) => {
  const formatFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getMedalla = (posicion: number) => {
    if (posicion === 1) return '🥇';
    if (posicion === 2) return '🥈';
    if (posicion === 3) return '🥉';
    return '';
  };

  const columns = [
    {
      key: 'posicion',
      label: 'Pos.',
      render: (value: number) => (
        <div className="flex items-center space-x-2">
          <span className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} font-bold`}>
            {value}
          </span>
          <span className="text-lg">{getMedalla(value)}</span>
        </div>
      ),
      width: '80px',
      align: 'center' as const,
    },
    {
      key: 'nombre',
      label: 'Participante',
      render: (value: string, row: Participante) => (
        <div className="flex items-center space-x-3">
          {row.avatar ? (
            <img src={row.avatar} alt={value} className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366F1] to-[#818CF8] flex items-center justify-center text-white font-semibold">
              {value.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {value}
            </p>
            <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              {row.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'progreso',
      label: 'Progreso',
      render: (value: number) => (
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            {value}%
          </span>
        </div>
      ),
      align: 'center' as const,
    },
    {
      key: 'puntos',
      label: 'Puntos',
      render: (value: number) => (
        <div className="flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            {value}
          </span>
        </div>
      ),
      align: 'center' as const,
    },
    {
      key: 'ultimoCheckIn',
      label: 'Último Check-in',
      render: (value: Date | undefined) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className={ds.typography.bodySmall}>
            {value ? formatFecha(value) : 'N/A'}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (value: any, row: Participante) => (
        onEliminar && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEliminar(row)}
            title="Eliminar participante"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        )
      ),
      align: 'center' as const,
    },
  ];

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <p className="text-gray-600 mt-4">Cargando...</p>
      </Card>
    );
  }

  if (participantes.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Users size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay participantes inscritos</h3>
        <p className="text-gray-600">Los participantes aparecerán aquí una vez se inscriban al evento</p>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-gray-500" />
          <h3 className="text-xl font-bold text-gray-900">
            Participantes ({participantes.length})
          </h3>
        </div>
        <Table
          data={participantes}
          columns={columns}
          loading={loading}
          emptyMessage="No hay participantes inscritos"
        />
      </div>
    </Card>
  );
};

