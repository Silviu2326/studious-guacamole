import React, { useState, useEffect } from 'react';
import { Card, Table } from '../../../components/componentsreutilizables';
import { Calendar, Clock, Image, Scale } from 'lucide-react';
import { getHistorialNutricional, HistorialCheckInNutricional } from '../api/checkins';
import { Badge } from '../../../components/componentsreutilizables';

interface HistorialNutricionalProps {
  clienteId: string;
  dias?: number;
}

export const HistorialNutricional: React.FC<HistorialNutricionalProps> = ({
  clienteId,
  dias = 30,
}) => {
  const [historial, setHistorial] = useState<HistorialCheckInNutricional[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarHistorial();
  }, [clienteId, dias]);

  const cargarHistorial = async () => {
    setCargando(true);
    try {
      const data = await getHistorialNutricional(clienteId, dias);
      setHistorial(data);
    } catch (error) {
      console.error('Error al cargar historial:', error);
    } finally {
      setCargando(false);
    }
  };

  const getTipoComidaLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      desayuno: 'Desayuno',
      almuerzo: 'Almuerzo',
      merienda: 'Merienda',
      cena: 'Cena',
      snack: 'Snack',
    };
    return labels[tipo] || tipo;
  };

  const getTendenciaBadge = (tendencia?: string) => {
    if (!tendencia) return null;
    switch (tendencia) {
      case 'mejora':
        return <Badge variant="success">Mejora</Badge>;
      case 'empeora':
        return <Badge variant="error">Empeora</Badge>;
      default:
        return <Badge variant="warning">Estable</Badge>;
    }
  };

  const columns = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <span className="text-sm text-gray-900">
            {new Date(value).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
      ),
    },
    {
      key: 'checkIn',
      label: 'Comida',
      render: (checkIn: any) => (
        <div>
          <span className="text-sm font-semibold text-gray-900">
            {getTipoComidaLabel(checkIn.tipoComida)}
          </span>
          {checkIn.fotoComida && (
            <div className="flex items-center gap-1 mt-1">
              <Image size={12} className="text-gray-400" />
              <span className="text-xs text-gray-500">
                Foto disponible
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'checkIn',
      label: 'Hambre / Saciedad',
      render: (checkIn: any) => (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-900">
            {checkIn.hambreAntes}/10
          </span>
          <span className="text-gray-400">→</span>
          <span className="text-sm text-gray-900">
            {checkIn.saciedad}/10
          </span>
        </div>
      ),
    },
    {
      key: 'checkIn',
      label: 'Peso',
      render: (checkIn: any) => (
        checkIn.peso ? (
          <div className="flex items-center gap-1">
            <Scale size={16} className="text-gray-400" />
            <span className="text-sm text-gray-900">
              {checkIn.peso.toFixed(1)} kg
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-500">
            No registrado
          </span>
        )
      ),
    },
    {
      key: 'adherencia',
      label: 'Adherencia',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${
            value >= 80 ? 'text-green-600' :
            value >= 60 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {value.toFixed(0)}%
          </span>
        </div>
      ),
    },
    {
      key: 'tendencia',
      label: 'Tendencia',
      render: (tendencia: string) => getTendenciaBadge(tendencia),
    },
  ];

  return (
    <Card className="p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-xl ring-1 ring-purple-200/70">
            <Clock size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Historial Nutricional
            </h3>
            <p className="text-xs text-gray-500">
              Últimos {dias} días
            </p>
          </div>
        </div>
      </div>

      <Table
        data={historial.map((h) => ({
          ...h.checkIn,
          fecha: h.fecha,
          adherencia: h.adherencia,
          tendencia: h.tendencia,
        }))}
        columns={columns}
        loading={cargando}
        emptyMessage="No hay historial nutricional disponible"
      />
    </Card>
  );
};

