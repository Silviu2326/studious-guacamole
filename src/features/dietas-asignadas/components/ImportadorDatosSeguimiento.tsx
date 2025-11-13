import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Select, Input } from '../../../components/componentsreutilizables';
import {
  Download,
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Calendar,
  Stomach,
  Flame,
  Apple,
  UtensilsCrossed,
  Settings,
  RefreshCw,
} from 'lucide-react';
import type {
  DatosSeguimientoImportados,
  ComparacionPlanRealidad,
  ConfiguracionImportacion,
  TipoAppSeguimiento,
  Dieta,
} from '../types';
import {
  importarDatosSeguimiento,
  compararPlanRealidad,
  getDatosImportados,
  getComparaciones,
  getConfiguracionImportacion,
  guardarConfiguracionImportacion,
  sincronizarDatosAutomaticos,
} from '../api/importacionSeguimiento';

interface ImportadorDatosSeguimientoProps {
  dieta: Dieta;
  clienteId: string;
  onDatosImportados?: () => void;
}

const appsSeguimiento: { value: TipoAppSeguimiento; label: string; icon: string }[] = [
  { value: 'myfitnesspal', label: 'MyFitnessPal', icon: '📱' },
  { value: 'cronometer', label: 'Cronometer', icon: '📊' },
  { value: 'fatsecret', label: 'FatSecret', icon: '🍎' },
  { value: 'lifesum', label: 'Lifesum', icon: '💚' },
  { value: 'yazio', label: 'Yazio', icon: '⚡' },
  { value: 'otro', label: 'Otra app', icon: '📲' },
];

export const ImportadorDatosSeguimiento: React.FC<ImportadorDatosSeguimientoProps> = ({
  dieta,
  clienteId,
  onDatosImportados,
}) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [appSeleccionada, setAppSeleccionada] = useState<TipoAppSeguimiento>('myfitnesspal');
  const [fechaImportacion, setFechaImportacion] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [importando, setImportando] = useState(false);
  const [datosImportados, setDatosImportados] = useState<DatosSeguimientoImportados[]>([]);
  const [comparaciones, setComparaciones] = useState<ComparacionPlanRealidad[]>([]);
  const [comparacionSeleccionada, setComparacionSeleccionada] =
    useState<ComparacionPlanRealidad | null>(null);
  const [configuracion, setConfiguracion] = useState<ConfiguracionImportacion | null>(null);
  const [sincronizando, setSincronizando] = useState(false);

  useEffect(() => {
    cargarDatos();
    cargarConfiguracion();
  }, [dieta.id, clienteId]);

  const cargarDatos = async () => {
    try {
      const datos = await getDatosImportados(dieta.id);
      setDatosImportados(datos);
      const comps = await getComparaciones(dieta.id);
      setComparaciones(comps);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const cargarConfiguracion = async () => {
    try {
      const config = await getConfiguracionImportacion(dieta.id, clienteId);
      setConfiguracion(config);
    } catch (error) {
      console.error('Error cargando configuración:', error);
    }
  };

  const handleImportar = async () => {
    setImportando(true);
    try {
      await importarDatosSeguimiento(dieta.id, clienteId, appSeleccionada, fechaImportacion);
      await cargarDatos();
      setMostrarModal(false);
      onDatosImportados?.();
    } catch (error) {
      console.error('Error importando datos:', error);
      alert('Error al importar datos. Por favor, intenta de nuevo.');
    } finally {
      setImportando(false);
    }
  };

  const handleComparar = async (fecha: string) => {
    try {
      const comparacion = await compararPlanRealidad(dieta.id, clienteId, fecha);
      setComparacionSeleccionada(comparacion);
      await cargarDatos();
    } catch (error) {
      console.error('Error comparando:', error);
      alert('Error al comparar plan vs realidad. Asegúrate de tener datos importados para esta fecha.');
    }
  };

  const handleSincronizar = async () => {
    setSincronizando(true);
    try {
      await sincronizarDatosAutomaticos(dieta.id, clienteId);
      await cargarDatos();
      alert('Datos sincronizados correctamente');
    } catch (error) {
      console.error('Error sincronizando:', error);
      alert('Error al sincronizar. Verifica la configuración.');
    } finally {
      setSincronizando(false);
    }
  };

  const handleGuardarConfiguracion = async () => {
    if (!configuracion) return;
    try {
      await guardarConfiguracionImportacion(configuracion);
      setMostrarConfiguracion(false);
      alert('Configuración guardada');
    } catch (error) {
      console.error('Error guardando configuración:', error);
    }
  };

  const getCumplimientoColor = (cumplimiento: number) => {
    if (cumplimiento >= 90) return 'text-green-600';
    if (cumplimiento >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCumplimientoIcon = (cumplimiento: number) => {
    if (cumplimiento >= 90) return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    if (cumplimiento >= 70) return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    return <AlertCircle className="w-4 h-4 text-red-600" />;
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Importar Datos de Apps de Seguimiento
            </h3>
          </div>
          <div className="flex gap-2">
            {configuracion?.sincronizacionAutomatica && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSincronizar}
                disabled={sincronizando}
              >
                {sincronizando ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Sincronizar
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setMostrarConfiguracion(true)}>
              <Settings className="w-4 h-4" />
              Configurar
            </Button>
            <Button size="sm" onClick={() => setMostrarModal(true)}>
              <Download className="w-4 h-4" />
              Importar Datos
            </Button>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Importa datos de apps de seguimiento (calorías consumidas, síntomas digestivos) para
          comparar el plan vs. la realidad.
        </p>

        {/* Lista de datos importados */}
        {datosImportados.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Datos Importados Recientes</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {datosImportados.slice(0, 5).map((dato) => (
                <div
                  key={dato.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(dato.fecha).toLocaleDateString('es-ES')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {dato.caloriasConsumidas?.total || 0} kcal • {dato.appOrigen}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleComparar(dato.fecha)}
                  >
                    Comparar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {datosImportados.length === 0 && (
          <div className="text-center py-8 text-sm text-gray-500">
            <Download className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No hay datos importados aún</p>
            <p className="text-xs text-gray-400 mt-1">Importa datos para comenzar a comparar</p>
          </div>
        )}
      </Card>

      {/* Comparación seleccionada */}
      {comparacionSeleccionada && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Comparación Plan vs. Realidad</h3>
            <Button variant="outline" size="sm" onClick={() => setComparacionSeleccionada(null)}>
              Cerrar
            </Button>
          </div>

          <div className="space-y-4">
            {/* Comparación de calorías */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Calorías</span>
                </div>
                {getCumplimientoIcon(comparacionSeleccionada.comparacionCalorias.cumplimiento)}
              </div>
              <div className="grid grid-cols-3 gap-4 mt-3">
                <div>
                  <p className="text-xs text-gray-500">Plan</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {comparacionSeleccionada.comparacionCalorias.plan} kcal
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Realidad</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {comparacionSeleccionada.comparacionCalorias.realidad} kcal
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Diferencia</p>
                  <div className="flex items-center gap-1">
                    {comparacionSeleccionada.comparacionCalorias.diferencia > 0 ? (
                      <TrendingUp className="w-4 h-4 text-red-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-green-600" />
                    )}
                    <p
                      className={`text-lg font-semibold ${
                        comparacionSeleccionada.comparacionCalorias.diferencia > 0
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}
                    >
                      {Math.abs(comparacionSeleccionada.comparacionCalorias.diferencia)} kcal
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Cumplimiento</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        comparacionSeleccionada.comparacionCalorias.cumplimiento >= 90
                          ? 'bg-green-500'
                          : comparacionSeleccionada.comparacionCalorias.cumplimiento >= 70
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{
                        width: `${comparacionSeleccionada.comparacionCalorias.cumplimiento}%`,
                      }}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${getCumplimientoColor(
                      comparacionSeleccionada.comparacionCalorias.cumplimiento
                    )}`}
                  >
                    {comparacionSeleccionada.comparacionCalorias.cumplimiento.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Comparación de macros */}
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(comparacionSeleccionada.comparacionMacros).map(([macro, datos]) => (
                <div key={macro} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 mb-2 capitalize">{macro}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Plan:</span>
                      <span className="font-medium">{datos.plan.toFixed(1)}g</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Real:</span>
                      <span className="font-medium">{datos.realidad.toFixed(1)}g</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Diff:</span>
                      <span
                        className={`font-medium ${
                          datos.diferencia > 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {datos.diferencia > 0 ? '+' : ''}
                        {datos.diferencia.toFixed(1)}g
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Síntomas digestivos */}
            {comparacionSeleccionada.sintomasDigestivos.length > 0 && (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-3">
                  <Stomach className="w-5 h-5 text-orange-600" />
                  <span className="font-medium text-gray-900">Síntomas Digestivos</span>
                </div>
                <div className="space-y-2">
                  {comparacionSeleccionada.sintomasDigestivos.map((sintoma) => (
                    <div
                      key={sintoma.id}
                      className="flex items-center justify-between p-2 bg-white rounded border border-orange-100"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {sintoma.tipo.replace('-', ' ')}
                        </p>
                        <p className="text-xs text-gray-500">
                          Intensidad: {sintoma.intensidad} {sintoma.hora && `• ${sintoma.hora}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Análisis y recomendaciones */}
            {comparacionSeleccionada.analisis && (
              <div className="space-y-3">
                {comparacionSeleccionada.analisis.puntosFuertes.length > 0 && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-900 mb-2">Puntos Fuertes</p>
                    <ul className="space-y-1">
                      {comparacionSeleccionada.analisis.puntosFuertes.map((punto, idx) => (
                        <li key={idx} className="text-sm text-green-800">
                          • {punto}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {comparacionSeleccionada.analisis.areasMejora.length > 0 && (
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm font-medium text-yellow-900 mb-2">Áreas de Mejora</p>
                    <ul className="space-y-1">
                      {comparacionSeleccionada.analisis.areasMejora.map((area, idx) => (
                        <li key={idx} className="text-sm text-yellow-800">
                          • {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {comparacionSeleccionada.analisis.recomendaciones.length > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-900 mb-2">Recomendaciones</p>
                    <ul className="space-y-1">
                      {comparacionSeleccionada.analisis.recomendaciones.map((rec, idx) => (
                        <li key={idx} className="text-sm text-blue-800">
                          • {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Modal de importación */}
      <Modal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        title="Importar Datos de App de Seguimiento"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              App de Seguimiento
            </label>
            <Select
              value={appSeleccionada}
              onChange={(e) => setAppSeleccionada(e.target.value as TipoAppSeguimiento)}
              options={appsSeguimiento.map((app) => ({
                value: app.value,
                label: `${app.icon} ${app.label}`,
              }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
            <Input
              type="date"
              value={fechaImportacion}
              onChange={(e) => setFechaImportacion(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setMostrarModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleImportar} disabled={importando}>
              {importando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Importando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Importar
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de configuración */}
      <Modal
        isOpen={mostrarConfiguracion}
        onClose={() => setMostrarConfiguracion(false)}
        title="Configuración de Importación"
        size="lg"
      >
        {configuracion && (
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={configuracion.sincronizacionAutomatica}
                  onChange={(e) =>
                    setConfiguracion({ ...configuracion, sincronizacionAutomatica: e.target.checked })
                  }
                />
                <span className="text-sm font-medium text-gray-700">
                  Sincronización automática
                </span>
              </label>
            </div>
            {configuracion.sincronizacionAutomatica && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frecuencia
                </label>
                <Select
                  value={configuracion.frecuenciaSincronizacion || 'diaria'}
                  onChange={(e) =>
                    setConfiguracion({
                      ...configuracion,
                      frecuenciaSincronizacion: e.target.value as 'diaria' | 'semanal' | 'manual',
                    })
                  }
                  options={[
                    { value: 'diaria', label: 'Diaria' },
                    { value: 'semanal', label: 'Semanal' },
                    { value: 'manual', label: 'Manual' },
                  ]}
                />
              </div>
            )}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setMostrarConfiguracion(false)}>
                Cancelar
              </Button>
              <Button onClick={handleGuardarConfiguracion}>Guardar</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

