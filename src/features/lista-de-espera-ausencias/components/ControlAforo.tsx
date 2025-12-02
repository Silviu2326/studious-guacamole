import React, { useState, useEffect } from 'react';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import { getClase } from '../api';
import { ControlAforo as ControlAforoType, Clase } from '../types';
import { Users, AlertCircle, CheckCircle } from 'lucide-react';

export const ControlAforo: React.FC<{ claseId?: string }> = ({ claseId }) => {
  const [controlAforo, setControlAforo] = useState<ControlAforoType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarControlAforo();
  }, [claseId]);

  const cargarControlAforo = async () => {
    try {
      setLoading(true);
      
      // Simular datos de control de aforo
      const clases: ControlAforoType[] = [];
      
      if (claseId) {
        const clase = await getClase(claseId);
        if (clase) {
          clases.push({
            claseId: clase.id,
            capacidadMaxima: clase.capacidadMaxima,
            reservasConfirmadas: clase.reservasConfirmadas,
            listaEsperaActiva: 3,
            ocupacionPorcentaje: (clase.reservasConfirmadas / clase.capacidadMaxima) * 100,
            estado: clase.reservasConfirmadas >= clase.capacidadMaxima ? 'llena' : 'disponible',
          });
        }
      } else {
        // Datos mock para múltiples clases
        clases.push(
          {
            claseId: 'clase-1',
            capacidadMaxima: 15,
            reservasConfirmadas: 15,
            listaEsperaActiva: 3,
            ocupacionPorcentaje: 100,
            estado: 'llena',
          },
          {
            claseId: 'clase-2',
            capacidadMaxima: 20,
            reservasConfirmadas: 12,
            listaEsperaActiva: 0,
            ocupacionPorcentaje: 60,
            estado: 'disponible',
          }
        );
      }
      
      setControlAforo(clases);
    } catch (error) {
      console.error('Error al cargar control de aforo:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const colors = {
      disponible: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      llena: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      sobrevendida: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[estado as keyof typeof colors] || colors.disponible;
  };

  const metricas = controlAforo.map((control) => ({
    id: control.claseId,
    title: `Clase ${control.claseId}`,
    value: `${control.reservasConfirmadas} / ${control.capacidadMaxima}`,
    subtitle: `${control.ocupacionPorcentaje.toFixed(0)}% ocupación`,
    icon: <Users className="w-6 h-6" />,
    color: control.estado === 'llena' ? 'warning' : control.estado === 'sobrevendida' ? 'error' : 'success' as const,
    loading,
  }));

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Control de Aforo
        </h3>

        <MetricCards data={metricas} columns={3} />

        <div className="mt-6 space-y-4">
          {controlAforo.map((control) => (
            <div
              key={control.claseId}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Clase {control.claseId}
                  </h4>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getEstadoBadge(control.estado)}`}>
                    {control.estado}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {control.estado === 'llena' && (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  {control.estado === 'disponible' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Capacidad
                  </p>
                  <p className="text-xl font-semibold text-gray-900">
                    {control.capacidadMaxima}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Reservadas
                  </p>
                  <p className="text-xl font-semibold text-gray-900">
                    {control.reservasConfirmadas}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Lista Espera
                  </p>
                  <p className="text-xl font-semibold text-gray-900">
                    {control.listaEsperaActiva}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Ocupación
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {control.ocupacionPorcentaje.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      control.ocupacionPorcentaje >= 100
                        ? 'bg-yellow-500'
                        : control.ocupacionPorcentaje >= 80
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(control.ocupacionPorcentaje, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

