import React, { useState, useEffect } from 'react';
import { Clock, Users, Building2, Briefcase, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, Button, Select } from '../../../components/componentsreutilizables';
import { HorarioTrabajo, AplicableA } from '../types';
import { getHorariosTrabajo, ContextoHorariosTrabajo } from '../api/horariosTrabajo';

interface PerfilHorario {
  id: string;
  nombre: string;
  tipo: 'entrenador' | 'sala' | 'tipo-servicio';
  aplicableA: AplicableA;
  aplicableAId?: string;
  icono: React.ReactNode;
}

export const GestorHorarios: React.FC = () => {
  const [perfilSeleccionado, setPerfilSeleccionado] = useState<string>('');
  const [horarios, setHorarios] = useState<HorarioTrabajo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Perfiles de horarios disponibles
  const perfiles: PerfilHorario[] = [
    {
      id: 'entrenador-1',
      nombre: 'Entrenador 1',
      tipo: 'entrenador',
      aplicableA: 'entrenador',
      aplicableAId: 'entrenador-1',
      icono: <Users className="w-5 h-5" />,
    },
    {
      id: 'entrenador-2',
      nombre: 'Entrenador 2',
      tipo: 'entrenador',
      aplicableA: 'entrenador',
      aplicableAId: 'entrenador-2',
      icono: <Users className="w-5 h-5" />,
    },
    {
      id: 'sala-1',
      nombre: 'Sala Principal',
      tipo: 'sala',
      aplicableA: 'centro',
      aplicableAId: 'centro-1',
      icono: <Building2 className="w-5 h-5" />,
    },
    {
      id: 'sala-2',
      nombre: 'Sala de Yoga',
      tipo: 'sala',
      aplicableA: 'centro',
      aplicableAId: 'centro-2',
      icono: <Building2 className="w-5 h-5" />,
    },
    {
      id: 'servicio-pt',
      nombre: 'Personal Training',
      tipo: 'tipo-servicio',
      aplicableA: 'entrenador',
      icono: <Briefcase className="w-5 h-5" />,
    },
    {
      id: 'servicio-grupal',
      nombre: 'Clases Grupales',
      tipo: 'tipo-servicio',
      aplicableA: 'centro',
      icono: <Briefcase className="w-5 h-5" />,
    },
  ];

  useEffect(() => {
    if (perfilSeleccionado) {
      cargarHorarios();
    } else {
      setHorarios([]);
    }
  }, [perfilSeleccionado]);

  const cargarHorarios = async () => {
    const perfil = perfiles.find(p => p.id === perfilSeleccionado);
    if (!perfil) return;

    setLoading(true);
    setError(null);
    try {
      const contexto: ContextoHorariosTrabajo = {
        aplicableA: perfil.aplicableA,
        aplicableAId: perfil.aplicableAId,
        soloActivos: true,
      };
      const horariosData = await getHorariosTrabajo(contexto);
      setHorarios(horariosData);
    } catch (error) {
      console.error('Error cargando horarios:', error);
      setError('No se pudieron cargar los horarios. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const diasSemana = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
  ];

  const agruparHorariosPorDia = () => {
    const agrupados: Record<number, HorarioTrabajo[]> = {};
    horarios.forEach(horario => {
      if (!agrupados[horario.diaSemana]) {
        agrupados[horario.diaSemana] = [];
      }
      agrupados[horario.diaSemana].push(horario);
    });
    return agrupados;
  };

  const perfilActual = perfiles.find(p => p.id === perfilSeleccionado);
  const horariosAgrupados = agruparHorariosPorDia();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Gestor de Horarios
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Selecciona un perfil para ver y gestionar sus horarios de trabajo
          </p>
        </div>
      </div>

      {/* Selector de perfil */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Perfil de Horario
              </label>
              <Select
                options={perfiles.map(p => ({
                  value: p.id,
                  label: `${p.nombre} (${p.tipo === 'entrenador' ? 'Entrenador' : p.tipo === 'sala' ? 'Sala' : 'Tipo de Servicio'})`,
                }))}
                value={perfilSeleccionado}
                onChange={(e) => setPerfilSeleccionado(e.target.value)}
                placeholder="Selecciona un perfil..."
              />
            </div>

            {perfilActual && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                {perfilActual.icono}
                <div>
                  <div className="font-semibold text-gray-900">{perfilActual.nombre}</div>
                  <div className="text-sm text-gray-600">
                    {perfilActual.tipo === 'entrenador' ? 'Entrenador' : 
                     perfilActual.tipo === 'sala' ? 'Sala' : 'Tipo de Servicio'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Lista de horarios */}
      {perfilSeleccionado && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            {error ? (
              <div className="flex items-start gap-3 py-4">
                <div className="flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-red-900 mb-1">
                    Error al cargar horarios
                  </h3>
                  <p className="text-sm text-red-700 mb-4">
                    {error}
                  </p>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={cargarHorarios}
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reintentar
                  </Button>
                </div>
              </div>
            ) : loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-sm text-gray-600">Cargando horarios...</p>
              </div>
            ) : horarios.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm font-medium text-gray-600 mb-1">
                  No hay horarios configurados para este perfil
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Usa el Configurador de Horarios de Trabajo para crear horarios
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.keys(horariosAgrupados)
                  .sort((a, b) => parseInt(a) - parseInt(b))
                  .map(diaSemanaStr => {
                    const diaSemana = parseInt(diaSemanaStr);
                    const horariosDelDia = horariosAgrupados[diaSemana];
                    const diaInfo = diasSemana.find(d => d.value === diaSemana);

                    return (
                      <div
                        key={diaSemana}
                        className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <h4 className="text-lg font-semibold text-gray-900">
                              {diaInfo?.label}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {horariosDelDia.length} {horariosDelDia.length === 1 ? 'horario' : 'horarios'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {horariosDelDia.map((horario) => (
                            <div
                              key={horario.id}
                              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                {horario.activo ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-gray-400" />
                                )}
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {horario.horaInicio} - {horario.horaFin}
                                  </div>
                                  {horario.pausas && horario.pausas.length > 0 && (
                                    <div className="text-sm text-gray-600 mt-1">
                                      Pausas: {horario.pausas.map(p => `${p.horaInicio}-${p.horaFin}`).join(', ')}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                  horario.activo
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {horario.activo ? 'Activo' : 'Inactivo'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

