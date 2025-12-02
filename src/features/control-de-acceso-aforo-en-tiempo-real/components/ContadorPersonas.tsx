import React, { useState, useEffect } from 'react';
import { Card, Button, Table } from '../../../components/componentsreutilizables';
import {
  obtenerAforoActual,
  actualizarContadorAforo,
  obtenerHistorialAforo,
  type ConteoPersona,
  type AforoActual,
} from '../api';
import { Users, TrendingUp, RefreshCw, ArrowUp, ArrowDown } from 'lucide-react';

export const ContadorPersonas: React.FC = () => {
  const [aforoActual, setAforoActual] = useState<AforoActual | null>(null);
  const [historial, setHistorial] = useState<Array<{ fecha: string; personas: number; porcentaje: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarAforo, 3000);
    return () => clearInterval(interval);
  }, []);

  const cargarDatos = async () => {
    await cargarAforo();
    await cargarHistorial();
  };

  const cargarAforo = async () => {
    try {
      const aforo = await obtenerAforoActual();
      setAforoActual(aforo);
    } catch (error) {
      console.error('Error al cargar aforo:', error);
    }
  };

  const cargarHistorial = async () => {
    try {
      const hoy = new Date().toISOString().split('T')[0];
      const historialData = await obtenerHistorialAforo(hoy);
      setHistorial(historialData);
    } catch (error) {
      console.error('Error al cargar historial:', error);
    }
  };

  const handleRegistrarEntrada = async () => {
    setLoading(true);
    try {
      const registro: Omit<ConteoPersona, 'id' | 'createdAt'> = {
        tipo: 'entrada',
        fechaHora: new Date().toISOString(),
      };
      await actualizarContadorAforo(registro);
      await cargarAforo();
    } catch (error) {
      console.error('Error al registrar entrada:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarSalida = async () => {
    setLoading(true);
    try {
      const registro: Omit<ConteoPersona, 'id' | 'createdAt'> = {
        tipo: 'salida',
        fechaHora: new Date().toISOString(),
      };
      await actualizarContadorAforo(registro);
      await cargarAforo();
    } catch (error) {
      console.error('Error al registrar salida:', error);
    } finally {
      setLoading(false);
    }
  };

  const columnasHistorial = [
    {
      key: 'fecha',
      label: 'Hora',
      render: (value: string) => new Date(value).toLocaleTimeString('es-ES'),
    },
    {
      key: 'personas',
      label: 'Personas',
      render: (value: number) => (
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">{value}</span>
                  </div>
                ),
              },
              {
                key: 'porcentaje',
                label: 'Ocupación',
                render: (value: number) => (
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2 max-w-32">
                      <div
                        className={`h-full rounded-full ${
                          value >= 100 ? 'bg-red-500' : value >= 90 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, value)}%` }}
                      />
                    </div>
                    <span className={`font-semibold ${
                      value >= 100 ? 'text-red-600' : value >= 90 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {value.toFixed(1)}%
                    </span>
                  </div>
                ),
              },
  ];

  return (
    <div className="space-y-6">
      {/* Contador principal */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6" />
              Contador de Personas
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={cargarAforo}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>

          {aforoActual && (
            <div className="text-center mb-6">
              <div className="inline-block p-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl mb-4">
                <Users className="w-16 h-16 text-white mx-auto mb-2" />
                <div className="text-6xl font-bold text-white mb-2">
                  {aforoActual.personasDentro}
                </div>
                <div className="text-xl text-white/90">
                  personas dentro
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="bg-white rounded-xl ring-1 ring-slate-200 p-4 shadow-sm">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-slate-700">
                      Capacidad
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 text-center">
                    {aforoActual.capacidadMaxima}
                  </div>
                </div>

                <div className="bg-white rounded-xl ring-1 ring-slate-200 p-4 shadow-sm">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">
                      Disponible
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 text-center">
                    {Math.max(0, aforoActual.capacidadMaxima - aforoActual.personasDentro)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Controles manuales */}
          <div className="flex gap-4 justify-center">
            <Button
              variant="primary"
              onClick={handleRegistrarEntrada}
              disabled={loading || !aforoActual}
              size="lg"
            >
              <ArrowUp className="w-5 h-5 mr-2" />
              Registrar Entrada
            </Button>
            <Button
              variant="secondary"
              onClick={handleRegistrarSalida}
              disabled={loading || !aforoActual || aforoActual.personasDentro === 0}
              size="lg"
            >
              <ArrowDown className="w-5 h-5 mr-2" />
              Registrar Salida
            </Button>
          </div>
        </div>
      </Card>

      {/* Historial */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Historial de Aforo
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMostrarHistorial(!mostrarHistorial)}
            >
              {mostrarHistorial ? 'Ocultar' : 'Mostrar'}
            </Button>
          </div>

          {mostrarHistorial && (
            <Table
              data={historial}
              columns={columnasHistorial}
              loading={loading}
              emptyMessage="No hay datos de historial"
            />
          )}
        </div>
      </Card>
    </div>
  );
};

