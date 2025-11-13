import { useEffect, useState } from 'react';
import { Card } from '../../../components/componentsreutilizables/Card';
import { Select } from '../../../components/componentsreutilizables/Select';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Dumbbell,
  Heart,
  Ruler,
  Scale,
  TrendingDown,
  TrendingUp,
  Minus,
  User,
} from 'lucide-react';
import * as contextoApi from '../api/contexto-cliente';
import { ContextoCliente as ContextoClienteType } from '../types';

export function ContextoCliente() {
  const [clientes, setClientes] = useState<Array<{ id: string; nombre: string }>>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>('');
  const [contexto, setContexto] = useState<ContextoClienteType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadClientes();
  }, []);

  useEffect(() => {
    if (clienteSeleccionado) {
      loadContexto();
    } else {
      setContexto(null);
    }
  }, [clienteSeleccionado]);

  const loadClientes = async () => {
    try {
      const clientesData = await contextoApi.getClientes();
      setClientes(clientesData);
      if (clientesData.length > 0) {
        setClienteSeleccionado(clientesData[0].id);
      }
    } catch (error) {
      console.error('Error loading clientes:', error);
    }
  };

  const loadContexto = async () => {
    setLoading(true);
    try {
      const contextoData = await contextoApi.getContextoCliente(clienteSeleccionado);
      setContexto(contextoData);
    } catch (error) {
      console.error('Error loading contexto:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeveridadColor = (severidad: string) => {
    switch (severidad) {
      case 'leve':
        return 'default';
      case 'moderada':
        return 'secondary';
      case 'grave':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activa':
        return 'destructive';
      case 'recuperada':
        return 'default';
      case 'cronica':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getCronotipoIcon = (cronotipo: string) => {
    switch (cronotipo) {
      case 'matutino':
        return '🌅';
      case 'vespertino':
        return '🌙';
      default:
        return '⏰';
    }
  };

  const getTendenciaIcon = (tendencia?: string) => {
    switch (tendencia) {
      case 'subiendo':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'bajando':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-500">Cargando contexto del cliente...</div>
      </Card>
    );
  }

  if (!contexto) {
    return (
      <div className="space-y-4">
        <Card className="p-6">
          <Select
            label="Seleccionar Cliente"
            value={clienteSeleccionado}
            onChange={(v) => setClienteSeleccionado(v)}
            options={[
              { label: 'Selecciona un cliente', value: '' },
              ...clientes.map((c) => ({ label: c.nombre, value: c.id })),
            ]}
          />
        </Card>
        <Card className="p-8 text-center text-gray-500">
          Selecciona un cliente para ver su contexto
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selector de Cliente */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Select
              label="Cliente"
              value={clienteSeleccionado}
              onChange={(v) => setClienteSeleccionado(v)}
              options={[
                { label: 'Selecciona un cliente', value: '' },
                ...clientes.map((c) => ({ label: c.nombre, value: c.id })),
              ]}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span className="font-medium">{contexto.clienteNombre}</span>
          </div>
        </div>
      </Card>

      {/* Datos Biométricos */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Datos Biométricos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contexto.datosBiometricos.peso && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Peso</span>
                </div>
                {getTendenciaIcon(contexto.datosBiometricos.peso.tendencia)}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {contexto.datosBiometricos.peso.valor} kg
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(contexto.datosBiometricos.peso.fecha).toLocaleDateString()}
              </div>
            </div>
          )}

          {contexto.datosBiometricos.altura && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Ruler className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Altura</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {contexto.datosBiometricos.altura} cm
              </div>
            </div>
          )}

          {contexto.datosBiometricos.imc && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">IMC</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {contexto.datosBiometricos.imc.toFixed(1)}
              </div>
            </div>
          )}

          {contexto.datosBiometricos.grasaCorporal && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Grasa Corporal</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {contexto.datosBiometricos.grasaCorporal.porcentaje}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(contexto.datosBiometricos.grasaCorporal.fecha).toLocaleDateString()}
              </div>
            </div>
          )}

          {contexto.datosBiometricos.masaMuscular && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Dumbbell className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Masa Muscular</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {contexto.datosBiometricos.masaMuscular.kg} kg
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(contexto.datosBiometricos.masaMuscular.fecha).toLocaleDateString()}
              </div>
            </div>
          )}

          {contexto.datosBiometricos.frecuenciaCardiaca && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Frecuencia Cardíaca</span>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-semibold text-gray-900">
                  Reposo: {contexto.datosBiometricos.frecuenciaCardiaca.reposo} bpm
                </div>
                <div className="text-sm text-gray-600">
                  Máxima: {contexto.datosBiometricos.frecuenciaCardiaca.maxima} bpm
                </div>
              </div>
            </div>
          )}

          {contexto.datosBiometricos.vo2Max && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">VO₂ Max</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {contexto.datosBiometricos.vo2Max}
              </div>
            </div>
          )}

          {contexto.datosBiometricos.medidas && (
            <div className="p-4 bg-gray-50 rounded-lg md:col-span-2 lg:col-span-3">
              <div className="flex items-center gap-2 mb-3">
                <Ruler className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Medidas Corporales</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {contexto.datosBiometricos.medidas.cintura && (
                  <div>
                    <div className="text-xs text-gray-500">Cintura</div>
                    <div className="text-lg font-semibold">{contexto.datosBiometricos.medidas.cintura} cm</div>
                  </div>
                )}
                {contexto.datosBiometricos.medidas.cadera && (
                  <div>
                    <div className="text-xs text-gray-500">Cadera</div>
                    <div className="text-lg font-semibold">{contexto.datosBiometricos.medidas.cadera} cm</div>
                  </div>
                )}
                {contexto.datosBiometricos.medidas.pecho && (
                  <div>
                    <div className="text-xs text-gray-500">Pecho</div>
                    <div className="text-lg font-semibold">{contexto.datosBiometricos.medidas.pecho} cm</div>
                  </div>
                )}
                {contexto.datosBiometricos.medidas.brazo && (
                  <div>
                    <div className="text-xs text-gray-500">Brazo</div>
                    <div className="text-lg font-semibold">{contexto.datosBiometricos.medidas.brazo} cm</div>
                  </div>
                )}
                {contexto.datosBiometricos.medidas.muslo && (
                  <div>
                    <div className="text-xs text-gray-500">Muslo</div>
                    <div className="text-lg font-semibold">{contexto.datosBiometricos.medidas.muslo} cm</div>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {new Date(contexto.datosBiometricos.medidas.fecha).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Lesiones */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <h2 className="text-xl font-semibold text-gray-900">Lesiones</h2>
        </div>
        {contexto.lesiones.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
            <p>No hay lesiones registradas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contexto.lesiones.map((lesion) => (
              <div key={lesion.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{lesion.nombre}</h3>
                    <p className="text-sm text-gray-600">{lesion.ubicacion}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getSeveridadColor(lesion.severidad)}>{lesion.severidad}</Badge>
                    <Badge variant={getEstadoColor(lesion.estado)}>{lesion.estado}</Badge>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <span>Inicio: {new Date(lesion.fechaInicio).toLocaleDateString()}</span>
                  {lesion.fechaRecuperacion && (
                    <span className="ml-4">
                      Recuperación: {new Date(lesion.fechaRecuperacion).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {lesion.restricciones.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs font-medium text-gray-700 mb-1">Restricciones:</div>
                    <div className="flex flex-wrap gap-1">
                      {lesion.restricciones.map((rest, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {rest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {lesion.notas && (
                  <div className="text-sm text-gray-600 italic">{lesion.notas}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Hábitos */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">Hábitos</h2>
        </div>
        {contexto.habitos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay hábitos registrados</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contexto.habitos.map((habito) => (
              <div key={habito.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{habito.nombre}</h3>
                  {habito.activo ? (
                    <Badge variant="default">Activo</Badge>
                  ) : (
                    <Badge variant="outline">Inactivo</Badge>
                  )}
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  Objetivo: {habito.objetivo} {habito.unidad}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Cumplimiento</span>
                    <span className="font-semibold">{habito.cumplimiento}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        habito.cumplimiento >= 80
                          ? 'bg-green-500'
                          : habito.cumplimiento >= 50
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${habito.cumplimiento}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Disponibilidad de Material */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Dumbbell className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Disponibilidad de Material</h2>
        </div>
        {contexto.disponibilidadMaterial.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay información de material</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contexto.disponibilidadMaterial.map((material, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{material.material}</h3>
                  {material.disponible ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                {material.ubicacion && (
                  <div className="text-sm text-gray-600 mb-1">Ubicación: {material.ubicacion}</div>
                )}
                {material.notas && (
                  <div className="text-sm text-gray-500 italic">{material.notas}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Cronotipo */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">Cronotipo</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-4xl">{getCronotipoIcon(contexto.cronotipo)}</div>
          <div>
            <div className="text-lg font-semibold text-gray-900 capitalize">
              {contexto.cronotipo}
            </div>
            <div className="text-sm text-gray-600">
              {contexto.cronotipo === 'matutino' &&
                'Mejor rendimiento en las primeras horas del día'}
              {contexto.cronotipo === 'vespertino' &&
                'Mejor rendimiento en las horas de la tarde/noche'}
              {contexto.cronotipo === 'indiferente' &&
                'Rendimiento constante a lo largo del día'}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

