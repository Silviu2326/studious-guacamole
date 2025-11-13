import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Badge } from '../../../components/componentsreutilizables';
import {
  History,
  GitBranch,
  RotateCcw,
  Eye,
  GitCompare,
  Tag,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle2,
  X,
  Plus,
} from 'lucide-react';
import {
  Dieta,
  VersionPlan,
  ComparacionVersiones,
  OpcionesCrearVersion,
  OpcionesRecuperarVersion,
} from '../types';
import {
  crearVersionPlan,
  getVersionesPlan,
  getVersion,
  compararVersiones,
  recuperarVersion,
  eliminarVersion,
  actualizarVersion,
} from '../api';

interface GestorVersionesProps {
  dieta: Dieta;
  onVersionRecuperada?: () => void;
}

export const GestorVersiones: React.FC<GestorVersionesProps> = ({
  dieta,
  onVersionRecuperada,
}) => {
  const [versiones, setVersiones] = useState<VersionPlan[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarComparar, setMostrarComparar] = useState(false);
  const [mostrarRecuperar, setMostrarRecuperar] = useState(false);
  const [versionSeleccionada, setVersionSeleccionada] = useState<VersionPlan | null>(null);
  const [comparacion, setComparacion] = useState<ComparacionVersiones | null>(null);
  const [versionOrigenId, setVersionOrigenId] = useState<string>('');
  const [versionDestinoId, setVersionDestinoId] = useState<string>('');
  const [nombreVersion, setNombreVersion] = useState('');
  const [descripcionVersion, setDescripcionVersion] = useState('');
  const [etiquetasVersion, setEtiquetasVersion] = useState<string[]>([]);
  const [recuperando, setRecuperando] = useState(false);

  useEffect(() => {
    cargarVersiones();
  }, [dieta.id]);

  const cargarVersiones = async () => {
    setCargando(true);
    try {
      const versionesData = await getVersionesPlan(dieta.id);
      setVersiones(versionesData);
    } catch (error) {
      console.error('Error al cargar versiones:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleCrearVersion = async () => {
    try {
      const opciones: OpcionesCrearVersion = {
        dietaId: dieta.id,
        nombre: nombreVersion || undefined,
        descripcion: descripcionVersion || undefined,
        etiquetas: etiquetasVersion.length > 0 ? etiquetasVersion : undefined,
        incluirSnapshot: true,
      };

      await crearVersionPlan(opciones);
      await cargarVersiones();
      setMostrarCrear(false);
      setNombreVersion('');
      setDescripcionVersion('');
      setEtiquetasVersion([]);
      alert('Versión creada exitosamente');
    } catch (error) {
      console.error('Error al crear versión:', error);
      alert('Error al crear la versión. Por favor, inténtalo de nuevo.');
    }
  };

  const handleComparar = async () => {
    if (!versionOrigenId || !versionDestinoId) {
      alert('Por favor, selecciona ambas versiones para comparar');
      return;
    }

    try {
      const comparacionData = await compararVersiones(versionOrigenId, versionDestinoId);
      setComparacion(comparacionData);
    } catch (error) {
      console.error('Error al comparar versiones:', error);
      alert('Error al comparar las versiones.');
    }
  };

  const handleRecuperar = async () => {
    if (!versionSeleccionada) return;

    const confirmar = window.confirm(
      `¿Estás seguro de que quieres recuperar la versión ${versionSeleccionada.numeroVersion}? ` +
      `Esto reemplazará la versión actual del plan.`
    );

    if (!confirmar) return;

    setRecuperando(true);
    try {
      const opciones: OpcionesRecuperarVersion = {
        versionId: versionSeleccionada.id,
        dietaId: dieta.id,
        crearNuevaVersion: true, // Crear backup de la versión actual
        mantenerVersionActual: false,
      };

      await recuperarVersion(opciones);
      await cargarVersiones();
      setMostrarRecuperar(false);
      setVersionSeleccionada(null);
      alert('Versión recuperada exitosamente');
      if (onVersionRecuperada) {
        onVersionRecuperada();
      }
    } catch (error) {
      console.error('Error al recuperar versión:', error);
      alert('Error al recuperar la versión.');
    } finally {
      setRecuperando(false);
    }
  };

  const handleEliminar = async (versionId: string) => {
    const confirmar = window.confirm(
      '¿Estás seguro de que quieres eliminar esta versión? Esta acción no se puede deshacer.'
    );

    if (!confirmar) return;

    try {
      await eliminarVersion(versionId);
      await cargarVersiones();
      alert('Versión eliminada exitosamente');
    } catch (error: any) {
      console.error('Error al eliminar versión:', error);
      alert(error.message || 'Error al eliminar la versión.');
    }
  };

  const agregarEtiqueta = () => {
    const etiqueta = prompt('Ingresa una etiqueta:');
    if (etiqueta && !etiquetasVersion.includes(etiqueta)) {
      setEtiquetasVersion([...etiquetasVersion, etiqueta]);
    }
  };

  const quitarEtiqueta = (etiqueta: string) => {
    setEtiquetasVersion(etiquetasVersion.filter(e => e !== etiqueta));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Gestión de Versiones</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setMostrarComparar(true)}
            className="flex items-center gap-2"
          >
            <GitCompare className="w-4 h-4" />
            Comparar
          </Button>
          <Button
            onClick={() => setMostrarCrear(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Crear Versión
          </Button>
        </div>
      </div>

      {versiones.length > 0 ? (
        <div className="space-y-3">
          {versiones.map((version) => (
            <Card key={version.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold">
                      Versión {version.numeroVersion}
                      {version.esVersionActual && (
                        <Badge variant="green" className="ml-2">
                          Actual
                        </Badge>
                      )}
                    </span>
                    {version.nombre && (
                      <span className="text-sm text-gray-600">- {version.nombre}</span>
                    )}
                  </div>
                  {version.descripcion && (
                    <p className="text-sm text-gray-600 mb-2">{version.descripcion}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(version.creadoEn).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {version.creadoPorNombre || version.creadoPor}
                    </div>
                    {version.cambios.length > 0 && (
                      <span>{version.cambios.length} cambios</span>
                    )}
                  </div>
                  {version.etiquetas && version.etiquetas.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {version.etiquetas.map((etiqueta, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {etiqueta}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {version.cambios.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-600 mb-1">Cambios principales:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {version.cambios.slice(0, 3).map((cambio, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-purple-500">•</span>
                            <span>{cambio.descripcion || cambio.campo}</span>
                          </li>
                        ))}
                        {version.cambios.length > 3 && (
                          <li className="text-gray-400">
                            +{version.cambios.length - 3} cambios más
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  {!version.esVersionActual && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setVersionSeleccionada(version);
                          setMostrarRecuperar(true);
                        }}
                        className="flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Recuperar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setVersionOrigenId(version.id);
                          setVersionDestinoId(versiones.find(v => v.esVersionActual)?.id || '');
                          setMostrarComparar(true);
                        }}
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEliminar(version.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                        Eliminar
                      </Button>
                    </>
                  )}
                  {version.esVersionActual && (
                    <Badge variant="green">
                      Versión Actual
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <History className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No hay versiones guardadas aún</p>
          <p className="text-sm text-gray-400 mt-1">
            Crea una versión para poder recuperar cambios anteriores si es necesario
          </p>
        </Card>
      )}

      {/* Modal para crear versión */}
      {mostrarCrear && (
        <Modal
          isOpen={mostrarCrear}
          onClose={() => setMostrarCrear(false)}
          title="Crear Nueva Versión"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre (opcional)
              </label>
              <input
                type="text"
                value={nombreVersion}
                onChange={(e) => setNombreVersion(e.target.value)}
                placeholder="Ej: Versión con ajuste de macros"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción (opcional)
              </label>
              <textarea
                value={descripcionVersion}
                onChange={(e) => setDescripcionVersion(e.target.value)}
                placeholder="Describe los cambios principales en esta versión"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Etiquetas
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {etiquetasVersion.map((etiqueta, idx) => (
                  <Badge key={idx} variant="outline" className="flex items-center gap-1">
                    {etiqueta}
                    <button
                      onClick={() => quitarEtiqueta(etiqueta)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={agregarEtiqueta}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Agregar
                </Button>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setMostrarCrear(false);
                  setNombreVersion('');
                  setDescripcionVersion('');
                  setEtiquetasVersion([]);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleCrearVersion}>
                Crear Versión
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal para comparar versiones */}
      {mostrarComparar && (
        <Modal
          isOpen={mostrarComparar}
          onClose={() => {
            setMostrarComparar(false);
            setComparacion(null);
            setVersionOrigenId('');
            setVersionDestinoId('');
          }}
          title="Comparar Versiones"
          size="lg"
        >
          <div className="space-y-4">
            {!comparacion ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Versión Origen
                  </label>
                  <select
                    value={versionOrigenId}
                    onChange={(e) => setVersionOrigenId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Selecciona una versión</option>
                    {versiones.map((v) => (
                      <option key={v.id} value={v.id}>
                        Versión {v.numeroVersion} {v.nombre ? `- ${v.nombre}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Versión Destino
                  </label>
                  <select
                    value={versionDestinoId}
                    onChange={(e) => setVersionDestinoId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Selecciona una versión</option>
                    {versiones.map((v) => (
                      <option key={v.id} value={v.id}>
                        Versión {v.numeroVersion} {v.nombre ? `- ${v.nombre}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMostrarComparar(false);
                      setVersionOrigenId('');
                      setVersionDestinoId('');
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleComparar}
                    disabled={!versionOrigenId || !versionDestinoId}
                  >
                    Comparar
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GitCompare className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Resumen de Comparación</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Cambios</p>
                      <p className="font-semibold text-lg">{comparacion.resumen.totalCambios}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Cambios Macros</p>
                      <p className="font-semibold text-lg">{comparacion.resumen.cambiosMacros}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Cambios Comidas</p>
                      <p className="font-semibold text-lg">{comparacion.resumen.cambiosComidas}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Otros Cambios</p>
                      <p className="font-semibold text-lg">{comparacion.resumen.cambiosOtros}</p>
                    </div>
                  </div>
                  {comparacion.impactoEstimado && (
                    <div className="mt-3 flex items-center gap-2">
                      <AlertTriangle
                        className={`w-4 h-4 ${
                          comparacion.impactoEstimado.nivel === 'alto'
                            ? 'text-red-500'
                            : comparacion.impactoEstimado.nivel === 'medio'
                            ? 'text-yellow-500'
                            : 'text-green-500'
                        }`}
                      />
                      <span className="text-sm font-medium">
                        Impacto {comparacion.impactoEstimado.nivel}:{' '}
                        {comparacion.impactoEstimado.descripcion}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Diferencias Detalladas</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {comparacion.diferencias.map((diferencia, idx) => (
                      <Card key={idx} className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{diferencia.campo}</p>
                            {diferencia.descripcion && (
                              <p className="text-xs text-gray-600 mt-1">
                                {diferencia.descripcion}
                              </p>
                            )}
                            <div className="flex gap-4 mt-2 text-xs">
                              {diferencia.valorOrigen !== undefined && (
                                <div>
                                  <span className="text-gray-500">Antes: </span>
                                  <span className="font-medium">
                                    {typeof diferencia.valorOrigen === 'object'
                                      ? JSON.stringify(diferencia.valorOrigen)
                                      : String(diferencia.valorOrigen)}
                                  </span>
                                </div>
                              )}
                              {diferencia.valorDestino !== undefined && (
                                <div>
                                  <span className="text-gray-500">Después: </span>
                                  <span className="font-medium">
                                    {typeof diferencia.valorDestino === 'object'
                                      ? JSON.stringify(diferencia.valorDestino)
                                      : String(diferencia.valorDestino)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              diferencia.tipoCambio === 'añadido'
                                ? 'bg-green-50 text-green-700'
                                : diferencia.tipoCambio === 'eliminado'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-blue-50 text-blue-700'
                            }
                          >
                            {diferencia.tipoCambio}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMostrarComparar(false);
                      setComparacion(null);
                      setVersionOrigenId('');
                      setVersionDestinoId('');
                    }}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal para recuperar versión */}
      {mostrarRecuperar && versionSeleccionada && (
        <Modal
          isOpen={mostrarRecuperar}
          onClose={() => {
            setMostrarRecuperar(false);
            setVersionSeleccionada(null);
          }}
          title={`Recuperar Versión ${versionSeleccionada.numeroVersion}`}
          size="md"
        >
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900 mb-1">Advertencia</p>
                  <p className="text-sm text-yellow-800">
                    Esta acción reemplazará la versión actual del plan con la versión{' '}
                    {versionSeleccionada.numeroVersion}. Se creará automáticamente un backup
                    de la versión actual antes de recuperar.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Versión a recuperar:</strong> Versión {versionSeleccionada.numeroVersion}
                {versionSeleccionada.nombre && ` - ${versionSeleccionada.nombre}`}
              </p>
              {versionSeleccionada.descripcion && (
                <p className="text-sm text-gray-600 mb-2">
                  {versionSeleccionada.descripcion}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Creada el {new Date(versionSeleccionada.creadoEn).toLocaleString()}
              </p>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setMostrarRecuperar(false);
                  setVersionSeleccionada(null);
                }}
                disabled={recuperando}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleRecuperar}
                disabled={recuperando}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {recuperando ? 'Recuperando...' : 'Recuperar Versión'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

