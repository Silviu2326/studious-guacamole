import React, { useState, useEffect } from 'react';
import { useAdherencia } from '../hooks/useAdherencia';
import { FiltrosAdherencia, OcupacionClase as OcupacionType } from '../types';

interface Props {
  filtros: FiltrosAdherencia;
  onFiltrosChange: (filtros: FiltrosAdherencia) => void;
}

export const OcupacionClase: React.FC<Props> = ({ filtros, onFiltrosChange }) => {
  const {
    ocupaciones,
    obtenerOcupacionClase,
    registrarAsistenciaClase,
    loading
  } = useAdherencia();

  const [claseSeleccionada, setClaseSeleccionada] = useState<string>('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [asistentes, setAsistentes] = useState<string[]>([]);
  const [nuevoAsistente, setNuevoAsistente] = useState('');

  // Datos simulados de clases - en producción vendría de una API
  const clases = [
    {
      id: 'clase1',
      nombre: 'Yoga Matutino',
      fecha: '2024-01-15',
      hora: '08:00',
      instructor: 'Ana García',
      sala: 'Sala 1',
      tipo: 'yoga',
      plazasDisponibles: 20,
      plazasOcupadas: 15,
      asistentesRegistrados: ['Juan Pérez', 'María López', 'Carlos Ruiz']
    },
    {
      id: 'clase2',
      nombre: 'Spinning Intenso',
      fecha: '2024-01-15',
      hora: '19:00',
      instructor: 'Pedro Martín',
      sala: 'Sala 2',
      tipo: 'spinning',
      plazasDisponibles: 25,
      plazasOcupadas: 8,
      asistentesRegistrados: ['Laura Sánchez', 'Miguel Torres']
    },
    {
      id: 'clase3',
      nombre: 'CrossFit Avanzado',
      fecha: '2024-01-16',
      hora: '18:30',
      instructor: 'Roberto Silva',
      sala: 'Sala 3',
      tipo: 'crossfit',
      plazasDisponibles: 15,
      plazasOcupadas: 12,
      asistentesRegistrados: ['Andrea Vega', 'Luis Morales', 'Carmen Díaz']
    }
  ];

  useEffect(() => {
    if (claseSeleccionada) {
      obtenerOcupacionClase(claseSeleccionada);
      const clase = clases.find(c => c.id === claseSeleccionada);
      if (clase) {
        setAsistentes(clase.asistentesRegistrados);
      }
    }
  }, [claseSeleccionada, obtenerOcupacionClase]);

  const handleRegistrarAsistencia = async () => {
    if (!claseSeleccionada) return;

    try {
      await registrarAsistenciaClase(claseSeleccionada, asistentes);
      setMostrarModal(false);
      
      // Recargar ocupación de la clase
      obtenerOcupacionClase(claseSeleccionada);
    } catch (error) {
      console.error('Error al registrar asistencia:', error);
    }
  };

  const agregarAsistente = () => {
    if (nuevoAsistente.trim() && !asistentes.includes(nuevoAsistente.trim())) {
      setAsistentes([...asistentes, nuevoAsistente.trim()]);
      setNuevoAsistente('');
    }
  };

  const eliminarAsistente = (nombre: string) => {
    setAsistentes(asistentes.filter(a => a !== nombre));
  };

  const ocupacionClase = ocupaciones.find(o => o.claseId === claseSeleccionada);
  const claseInfo = clases.find(c => c.id === claseSeleccionada);

  const getColorOcupacion = (porcentaje: number) => {
    if (porcentaje >= 80) return 'text-green-600 bg-green-100';
    if (porcentaje >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getIconoTendencia = (tendencia: string) => {
    switch (tendencia) {
      case 'creciente': return '📈';
      case 'decreciente': return '📉';
      default: return '➡️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de Clase */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Seleccionar Clase</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clase
            </label>
            <select
              value={claseSeleccionada}
              onChange={(e) => setClaseSeleccionada(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Seleccionar clase...</option>
              {clases.map((clase) => (
                <option key={clase.id} value={clase.id}>
                  {clase.nombre} - {clase.fecha} {clase.hora}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Información de la Clase Seleccionada */}
      {claseSeleccionada && claseInfo && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{claseInfo.nombre}</h3>
              <p className="text-sm text-gray-500">
                {claseInfo.fecha} a las {claseInfo.hora} - {claseInfo.sala}
              </p>
              <p className="text-sm text-gray-500">
                Instructor: {claseInfo.instructor}
              </p>
            </div>
            <button
              onClick={() => setMostrarModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              📝 Registrar Asistencia
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">📊</span>
                <div>
                  <p className="text-sm font-medium text-blue-600">Ocupación</p>
                  <p className={`text-xl font-bold ${getColorOcupacion((claseInfo.plazasOcupadas / claseInfo.plazasDisponibles) * 100).split(' ')[0]}`}>
                    {((claseInfo.plazasOcupadas / claseInfo.plazasDisponibles) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">👥</span>
                <div>
                  <p className="text-sm font-medium text-green-600">Asistentes</p>
                  <p className="text-xl font-bold text-green-900">
                    {claseInfo.plazasOcupadas}/{claseInfo.plazasDisponibles}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{ocupacionClase ? getIconoTendencia(ocupacionClase.tendenciaOcupacion) : '➡️'}</span>
                <div>
                  <p className="text-sm font-medium text-purple-600">Tendencia</p>
                  <p className="text-xl font-bold text-purple-900 capitalize">
                    {ocupacionClase?.tendenciaOcupacion || 'Estable'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🏃‍♂️</span>
                <div>
                  <p className="text-sm font-medium text-gray-600">Tipo</p>
                  <p className="text-xl font-bold text-gray-900 capitalize">
                    {claseInfo.tipo}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Alerta de Baja Ocupación */}
          {((claseInfo.plazasOcupadas / claseInfo.plazasDisponibles) * 100) < 50 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <span className="text-red-400 text-xl mr-3">⚠️</span>
                <div>
                  <h4 className="text-sm font-medium text-red-800">Alerta de Baja Ocupación</h4>
                  <p className="mt-1 text-sm text-red-700">
                    Esta clase tiene una ocupación por debajo del 50%. 
                    Considera promocionar la clase o revisar el horario.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Progreso Visual */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Ocupación de la clase</span>
              <span>{claseInfo.plazasOcupadas} de {claseInfo.plazasDisponibles} plazas</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  ((claseInfo.plazasOcupadas / claseInfo.plazasDisponibles) * 100) >= 80
                    ? 'bg-green-500'
                    : ((claseInfo.plazasOcupadas / claseInfo.plazasDisponibles) * 100) >= 50
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{
                  width: `${(claseInfo.plazasOcupadas / claseInfo.plazasDisponibles) * 100}%`
                }}
              ></div>
            </div>
          </div>

          {/* Lista de Asistentes */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Asistentes Registrados</h4>
            {claseInfo.asistentesRegistrados.length === 0 ? (
              <p className="text-gray-500 text-sm">No hay asistentes registrados aún.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {claseInfo.asistentesRegistrados.map((asistente, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2"
                  >
                    <span className="text-green-500">✅</span>
                    <span className="text-sm text-gray-700">{asistente}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resumen de Todas las Clases */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de Clases</h3>
        <div className="space-y-4">
          {clases.map((clase) => {
            const ocupacionPorcentaje = (clase.plazasOcupadas / clase.plazasDisponibles) * 100;
            return (
              <div
                key={clase.id}
                className={`border rounded-lg p-4 ${
                  ocupacionPorcentaje >= 80 
                    ? 'border-green-200 bg-green-50' 
                    : ocupacionPorcentaje >= 50
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {ocupacionPorcentaje >= 80 ? '🟢' : ocupacionPorcentaje >= 50 ? '🟡' : '🔴'}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">
                          {clase.nombre}
                        </p>
                        <p className="text-sm text-gray-500">
                          {clase.fecha} {clase.hora} - {clase.instructor} - {clase.sala}
                        </p>
                        <p className="text-sm text-gray-600">
                          Ocupación: {clase.plazasOcupadas}/{clase.plazasDisponibles} ({ocupacionPorcentaje.toFixed(1)}%)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorOcupacion(ocupacionPorcentaje)}`}>
                      {ocupacionPorcentaje.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal para Registrar Asistencia */}
      {mostrarModal && claseInfo && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Registrar Asistencia - {claseInfo.nombre}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agregar Asistente
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={nuevoAsistente}
                      onChange={(e) => setNuevoAsistente(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && agregarAsistente()}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Nombre del asistente..."
                    />
                    <button
                      onClick={agregarAsistente}
                      className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asistentes ({asistentes.length}/{claseInfo.plazasDisponibles})
                  </label>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {asistentes.map((asistente, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 rounded p-2"
                      >
                        <span className="text-sm">{asistente}</span>
                        <button
                          onClick={() => eliminarAsistente(asistente)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ❌
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setMostrarModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRegistrarAsistencia}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Registrar Asistencia
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};