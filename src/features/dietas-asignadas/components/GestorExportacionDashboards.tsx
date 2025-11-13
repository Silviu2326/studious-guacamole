import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Badge, Input, Select } from '../../../components/componentsreutilizables';
import {
  BarChart3,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  X,
  ExternalLink,
  Trash2,
  Settings,
  Download,
  Power,
  Eye,
} from 'lucide-react';
import type {
  ConfiguracionExportacionDashboard,
  TipoDashboardExterno,
  ResultadoExportacionDashboard,
  Dieta,
} from '../types';
import {
  getConfiguracionesExportacion,
  crearConfiguracionExportacion,
  actualizarConfiguracionExportacion,
  eliminarConfiguracionExportacion,
  exportarADashboard,
  prepararDatosExportacion,
} from '../api/exportacionDashboards';
import { useAuth } from '../../../context/AuthContext';

interface GestorExportacionDashboardsProps {
  dieta?: Dieta;
  onExportacionExitosa?: (resultado: ResultadoExportacionDashboard) => void;
}

export const GestorExportacionDashboards: React.FC<GestorExportacionDashboardsProps> = ({
  dieta,
  onExportacionExitosa,
}) => {
  const { user } = useAuth();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [configuraciones, setConfiguraciones] = useState<ConfiguracionExportacionDashboard[]>([]);
  const [cargando, setCargando] = useState(false);
  const [exportando, setExportando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [configuracionSeleccionada, setConfiguracionSeleccionada] = useState<ConfiguracionExportacionDashboard | null>(null);

  // Formulario
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<TipoDashboardExterno>('power-bi');
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [workspaceId, setWorkspaceId] = useState('');
  const [datasetId, setDatasetId] = useState('');
  const [reportId, setReportId] = useState('');
  const [exportarMacros, setExportarMacros] = useState(true);
  const [exportarCoste, setExportarCoste] = useState(true);
  const [exportarAdherencia, setExportarAdherencia] = useState(true);
  const [sincronizacionAutomatica, setSincronizacionAutomatica] = useState(false);
  const [frecuencia, setFrecuencia] = useState<'diaria' | 'semanal' | 'mensual' | 'manual'>('manual');

  useEffect(() => {
    if (mostrarModal && dieta) {
      cargarConfiguraciones();
    }
  }, [mostrarModal, dieta]);

  const cargarConfiguraciones = async () => {
    if (!user?.id) return;
    setCargando(true);
    try {
      const data = await getConfiguracionesExportacion(user.id);
      // Filtrar por dieta si está especificada
      const filtradas = dieta ? data.filter(c => c.dietaId === dieta.id) : data;
      setConfiguraciones(filtradas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando configuraciones');
    } finally {
      setCargando(false);
    }
  };

  const handleCrearConfiguracion = async () => {
    if (!dieta || !user?.id) {
      setError('Dieta o usuario no disponible');
      return;
    }

    setError(null);
    try {
      const nuevaConfiguracion = await crearConfiguracionExportacion({
        nombre,
        tipo,
        dietaId: dieta.id,
        clienteId: dieta.clienteId,
        conexion: {
          url: tipo === 'custom' ? url : undefined,
          apiKey: apiKey || undefined,
          workspaceId: tipo === 'power-bi' ? workspaceId : undefined,
          datasetId: tipo === 'power-bi' ? datasetId : undefined,
          reportId: tipo === 'looker' || tipo === 'tableau' ? reportId : undefined,
        },
        datosExportar: {
          macros: exportarMacros,
          coste: exportarCoste,
          adherencia: exportarAdherencia,
        },
        sincronizacion: {
          automatica: sincronizacionAutomatica,
          frecuencia: sincronizacionAutomatica ? frecuencia : undefined,
        },
        activa: true,
        creadoPor: user.id,
      });

      setExito('Configuración creada exitosamente');
      setTimeout(() => setExito(null), 3000);
      setMostrarFormulario(false);
      resetearFormulario();
      await cargarConfiguraciones();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando configuración');
    }
  };

  const handleExportar = async (configuracion: ConfiguracionExportacionDashboard) => {
    setExportando(configuracion.id);
    setError(null);
    setExito(null);

    try {
      const resultado = await exportarADashboard(configuracion.id);
      if (resultado.exito) {
        setExito('Exportación realizada exitosamente');
        if (onExportacionExitosa) {
          onExportacionExitosa(resultado);
        }
      } else {
        setError(resultado.mensaje || 'Error en la exportación');
      }
      setTimeout(() => {
        setExito(null);
        setError(null);
      }, 5000);
      await cargarConfiguraciones();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error exportando datos');
    } finally {
      setExportando(null);
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Eliminar esta configuración de exportación?')) return;

    try {
      await eliminarConfiguracionExportacion(id);
      setExito('Configuración eliminada');
      setTimeout(() => setExito(null), 3000);
      await cargarConfiguraciones();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error eliminando configuración');
    }
  };

  const handleToggleActiva = async (configuracion: ConfiguracionExportacionDashboard) => {
    try {
      await actualizarConfiguracionExportacion(configuracion.id, {
        activa: !configuracion.activa,
      });
      await cargarConfiguraciones();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando configuración');
    }
  };

  const resetearFormulario = () => {
    setNombre('');
    setTipo('power-bi');
    setUrl('');
    setApiKey('');
    setWorkspaceId('');
    setDatasetId('');
    setReportId('');
    setExportarMacros(true);
    setExportarCoste(true);
    setExportarAdherencia(true);
    setSincronizacionAutomatica(false);
    setFrecuencia('manual');
  };

  const getTipoIcon = (tipo: TipoDashboardExterno) => {
    switch (tipo) {
      case 'power-bi':
        return <Power size={18} />;
      case 'looker':
      case 'tableau':
        return <BarChart3 size={18} />;
      default:
        return <ExternalLink size={18} />;
    }
  };

  const getTipoLabel = (tipo: TipoDashboardExterno) => {
    switch (tipo) {
      case 'power-bi':
        return 'Power BI';
      case 'looker':
        return 'Looker';
      case 'tableau':
        return 'Tableau';
      default:
        return 'Personalizado';
    }
  };

  return (
    <>
      <Button
        onClick={() => setMostrarModal(true)}
        variant="outline"
        className="flex items-center gap-2"
      >
        <BarChart3 size={18} />
        Exportar a Dashboards
      </Button>

      <Modal
        isOpen={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          setMostrarFormulario(false);
          resetearFormulario();
        }}
        title="Exportar a Dashboards Externos"
        size="lg"
      >
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {exito && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {exito}
            </div>
          )}

          {!mostrarFormulario ? (
            <>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Configura exportaciones automáticas de datos del plan (macros, coste, adherencia) a dashboards externos.
                </p>
                <Button onClick={() => setMostrarFormulario(true)} className="flex items-center gap-2">
                  <Plus size={18} />
                  Nueva Configuración
                </Button>
              </div>

              {cargando ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin" size={24} />
                </div>
              ) : configuraciones.length === 0 ? (
                <Card className="p-8 text-center text-gray-500">
                  <BarChart3 size={48} className="mx-auto mb-4 text-gray-400" />
                  <p>No hay configuraciones de exportación</p>
                  <p className="text-sm mt-2">Crea una nueva configuración para comenzar</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {configuraciones.map((config) => (
                    <Card key={config.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getTipoIcon(config.tipo)}
                            <h3 className="font-semibold">{config.nombre}</h3>
                            <Badge variant={config.activa ? 'success' : 'secondary'}>
                              {config.activa ? 'Activa' : 'Inactiva'}
                            </Badge>
                            <Badge variant="outline">{getTipoLabel(config.tipo)}</Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>
                              <strong>Datos:</strong>{' '}
                              {[
                                config.datosExportar.macros && 'Macros',
                                config.datosExportar.coste && 'Coste',
                                config.datosExportar.adherencia && 'Adherencia',
                              ]
                                .filter(Boolean)
                                .join(', ')}
                            </p>
                            {config.sincronizacion.automatica && (
                              <p>
                                <strong>Sincronización:</strong> {config.sincronizacion.frecuencia}
                              </p>
                            )}
                            {config.ultimaSincronizacion && (
                              <p>
                                <strong>Última sincronización:</strong>{' '}
                                {new Date(config.ultimaSincronizacion).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleExportar(config)}
                            disabled={!config.activa || exportando === config.id}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            {exportando === config.id ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <Download size={16} />
                            )}
                            Exportar
                          </Button>
                          <Button
                            onClick={() => handleToggleActiva(config)}
                            variant="outline"
                            size="sm"
                          >
                            {config.activa ? 'Desactivar' : 'Activar'}
                          </Button>
                          <Button
                            onClick={() => handleEliminar(config.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Nueva Configuración</h3>
                <Button
                  onClick={() => {
                    setMostrarFormulario(false);
                    resetearFormulario();
                  }}
                  variant="outline"
                  size="sm"
                >
                  <X size={18} />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre</label>
                  <Input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Power BI - Plan Nutricional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de Dashboard</label>
                  <Select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as TipoDashboardExterno)}
                  >
                    <option value="power-bi">Power BI</option>
                    <option value="looker">Looker</option>
                    <option value="tableau">Tableau</option>
                    <option value="custom">Personalizado</option>
                  </Select>
                </div>

                {tipo === 'power-bi' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Workspace ID</label>
                      <Input
                        value={workspaceId}
                        onChange={(e) => setWorkspaceId(e.target.value)}
                        placeholder="ID del workspace"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Dataset ID</label>
                      <Input
                        value={datasetId}
                        onChange={(e) => setDatasetId(e.target.value)}
                        placeholder="ID del dataset"
                      />
                    </div>
                  </>
                )}

                {(tipo === 'looker' || tipo === 'tableau') && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Report ID</label>
                    <Input
                      value={reportId}
                      onChange={(e) => setReportId(e.target.value)}
                      placeholder="ID del reporte"
                    />
                  </div>
                )}

                {tipo === 'custom' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">URL del Endpoint</label>
                      <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://api.example.com/dashboard"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">API Key</label>
                      <Input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="API Key"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Datos a Exportar</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={exportarMacros}
                        onChange={(e) => setExportarMacros(e.target.checked)}
                      />
                      Macros (calorías, proteínas, carbohidratos, grasas)
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={exportarCoste}
                        onChange={(e) => setExportarCoste(e.target.checked)}
                      />
                      Coste (semanal, mensual, por día)
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={exportarAdherencia}
                        onChange={(e) => setExportarAdherencia(e.target.checked)}
                      />
                      Adherencia (cumplimiento del plan)
                    </label>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={sincronizacionAutomatica}
                      onChange={(e) => setSincronizacionAutomatica(e.target.checked)}
                    />
                    Sincronización automática
                  </label>
                  {sincronizacionAutomatica && (
                    <div className="mt-2 ml-6">
                      <Select
                        value={frecuencia}
                        onChange={(e) =>
                          setFrecuencia(e.target.value as 'diaria' | 'semanal' | 'mensual' | 'manual')
                        }
                      >
                        <option value="diaria">Diaria</option>
                        <option value="semanal">Semanal</option>
                        <option value="mensual">Mensual</option>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => {
                      setMostrarFormulario(false);
                      resetearFormulario();
                    }}
                    variant="outline"
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleCrearConfiguracion} disabled={!nombre}>
                    Crear Configuración
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

