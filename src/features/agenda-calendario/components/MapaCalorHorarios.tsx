import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { AnalisisHorarios, getAnalisisHorariosUltimas4Semanas } from '../api/analisisHorarios';
import { useAuth } from '../../../context/AuthContext';

export const MapaCalorHorarios: React.FC = () => {
  const { user } = useAuth();
  const [analisis, setAnalisis] = useState<AnalisisHorarios | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const analisisData = await getAnalisisHorariosUltimas4Semanas(user?.id);
      setAnalisis(analisisData);
    } catch (error) {
      console.error('Error cargando análisis de horarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIntensidadColor = (intensidad: number): string => {
    if (intensidad >= 70) return 'bg-red-500';
    if (intensidad >= 50) return 'bg-orange-400';
    if (intensidad >= 30) return 'bg-yellow-400';
    if (intensidad >= 10) return 'bg-blue-300';
    return 'bg-gray-100';
  };

  const getIntensidadTextColor = (intensidad: number): string => {
    if (intensidad >= 30) return 'text-white';
    return 'text-gray-700';
  };

  if (loading && !analisis) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600">Cargando análisis de horarios...</div>
      </div>
    );
  }

  if (!analisis) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay datos de análisis de horarios disponibles</p>
          </div>
        </div>
      </Card>
    );
  }

  // Generar horas para el mapa de calor (6:00 a 22:00, cada 30 minutos)
  const horas: string[] = [];
  for (let hora = 6; hora < 22; hora++) {
    horas.push(`${hora.toString().padStart(2, '0')}:00`);
    horas.push(`${hora.toString().padStart(2, '0')}:30`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Análisis de Horarios Demandados</h2>
              <p className="text-gray-600 mt-1">Optimiza tu disponibilidad basándote en la demanda real</p>
            </div>
            <Button variant="secondary" size="sm" onClick={cargarDatos}>
              Actualizar
            </Button>
          </div>
        </div>
      </Card>

      {/* Mapa de calor semanal */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Mapa de Calor Semanal</h3>
          <p className="text-sm text-gray-600 mb-4">
            Intensidad de demanda por día y horario (últimas 4 semanas)
          </p>
          
          {/* Leyenda */}
          <div className="flex items-center gap-4 mb-4 text-sm">
            <span className="text-gray-600">Intensidad:</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 bg-gray-100 rounded"></div>
              <span className="text-gray-600">Baja (0-10%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 bg-blue-300 rounded"></div>
              <span className="text-gray-600">Media-Baja (10-30%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 bg-yellow-400 rounded"></div>
              <span className="text-gray-600">Media (30-50%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 bg-orange-400 rounded"></div>
              <span className="text-gray-600">Media-Alta (50-70%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 bg-red-500 rounded"></div>
              <span className="text-gray-600">Alta (70%+)</span>
            </div>
          </div>

          {/* Tabla de mapa de calor */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left text-sm font-semibold text-gray-700 border border-gray-200 bg-gray-50">
                    Hora
                  </th>
                  {analisis.mapaCalorSemanal.map(dia => (
                    <th
                      key={dia.diaSemana}
                      className="p-2 text-center text-sm font-semibold text-gray-700 border border-gray-200 bg-gray-50 min-w-[100px]"
                    >
                      {dia.nombreDia}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {horas.map((hora, index) => {
                  // Mostrar cada hora (no cada 30 minutos para simplificar)
                  if (hora.endsWith(':30') && index % 2 === 1) {
                    return null;
                  }
                  
                  return (
                    <tr key={hora}>
                      <td className="p-2 text-sm font-medium text-gray-700 border border-gray-200 bg-gray-50">
                        {hora}
                      </td>
                      {analisis.mapaCalorSemanal.map(dia => {
                        const horario00 = dia.horarios.find(h => h.horario === hora);
                        const horario30 = dia.horarios.find(h => {
                          const [horaNum] = hora.split(':').map(Number);
                          return h.horario === `${horaNum.toString().padStart(2, '0')}:30`;
                        });
                        
                        // Combinar intensidad de ambos slots de 30 minutos
                        const intensidad00 = horario00?.intensidad || 0;
                        const intensidad30 = horario30?.intensidad || 0;
                        const intensidadPromedio = Math.round((intensidad00 + intensidad30) / 2);
                        const cantidadTotal = (horario00?.cantidadSesiones || 0) + (horario30?.cantidadSesiones || 0);
                        
                        return (
                          <td
                            key={dia.diaSemana}
                            className={`p-2 text-center text-xs border border-gray-200 ${getIntensidadColor(intensidadPromedio)} ${getIntensidadTextColor(intensidadPromedio)}`}
                            title={`${dia.nombreDia} ${hora}: ${cantidadTotal} sesiones (${intensidadPromedio}% intensidad)`}
                          >
                            {cantidadTotal > 0 ? cantidadTotal : ''}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Estadísticas por franja horaria */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Estadísticas por Franja Horaria</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {analisis.estadisticasPorFranja
              .filter(e => e.cantidadSesiones > 0)
              .sort((a, b) => b.cantidadSesiones - a.cantidadSesiones)
              .map(estadistica => (
                <div
                  key={estadistica.horario}
                  className={`p-4 rounded-lg border-2 ${
                    estadistica.demanda === 'alta'
                      ? 'bg-red-50 border-red-200'
                      : estadistica.demanda === 'media'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">{estadistica.horario}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      estadistica.demanda === 'alta'
                        ? 'bg-red-200 text-red-800'
                        : estadistica.demanda === 'media'
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-blue-200 text-blue-800'
                    }`}>
                      {estadistica.demanda.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>{estadistica.cantidadSesiones} sesiones</div>
                    <div>{estadistica.porcentajeOcupacion}% ocupación</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Card>

      {/* Horarios con mayor demanda */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Top 10 Horarios con Mayor Demanda</h3>
          <div className="space-y-2">
            {analisis.horariosMayorDemanda.map((horario, index) => (
              <div
                key={horario.horario}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{horario.horario}</div>
                    <div className="text-sm text-gray-600">
                      {horario.cantidadSesiones} sesiones • {horario.porcentajeOcupacion}% ocupación
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  horario.demanda === 'alta'
                    ? 'bg-red-200 text-red-800'
                    : horario.demanda === 'media'
                    ? 'bg-yellow-200 text-yellow-800'
                    : 'bg-blue-200 text-blue-800'
                }`}>
                  {horario.demanda.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Sugerencias de apertura */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="text-xl font-bold text-gray-900">Sugerencias de Apertura de Nuevos Horarios</h3>
          </div>
          {analisis.sugerenciasApertura.length > 0 ? (
            <div className="space-y-3">
              {analisis.sugerenciasApertura.map((sugerencia, index) => (
                <div
                  key={`${sugerencia.diaSemana}-${sugerencia.horario}`}
                  className={`p-4 rounded-lg border-2 ${
                    sugerencia.prioridad === 'alta'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-gray-900">
                          {sugerencia.nombreDia} {sugerencia.horario}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          sugerencia.demandaEsperada === 'alta'
                            ? 'bg-green-200 text-green-800'
                            : 'bg-yellow-200 text-yellow-800'
                        }`}>
                          {sugerencia.demandaEsperada.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          sugerencia.prioridad === 'alta'
                            ? 'bg-red-200 text-red-800'
                            : 'bg-blue-200 text-blue-800'
                        }`}>
                          {sugerencia.prioridad.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{sugerencia.razon}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No hay sugerencias de apertura en este momento</p>
            </div>
          )}
        </div>
      </Card>

      {/* Análisis de tendencias */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Tendencias de Horarios</h3>
          <div className="space-y-2">
            {analisis.tendenciaHorarios.map(tendencia => (
              <div
                key={tendencia.horario}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900">{tendencia.horario}</span>
                </div>
                <div className="flex items-center gap-2">
                  {tendencia.tendencia === 'subiendo' && (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-semibold text-green-600">
                        +{Math.abs(tendencia.cambioPorcentual)}%
                      </span>
                    </>
                  )}
                  {tendencia.tendencia === 'bajando' && (
                    <>
                      <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                      <span className="text-sm font-semibold text-red-600">
                        {tendencia.cambioPorcentual}%
                      </span>
                    </>
                  )}
                  {tendencia.tendencia === 'estable' && (
                    <>
                      <span className="text-sm font-semibold text-gray-600">
                        {tendencia.cambioPorcentual}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};


