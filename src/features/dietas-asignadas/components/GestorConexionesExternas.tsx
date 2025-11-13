import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Badge, Input } from '../../../components/componentsreutilizables';
import {
  Link2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  X,
  Database,
  Smartphone,
  Trash2,
  Settings,
  Download,
} from 'lucide-react';
import {
  ConexionExterna,
  TipoConexionExterna,
  DatosSincronizacionExterna,
  ResultadoActualizacionValores,
  Dieta,
} from '../types';
import {
  getConexionesExternas,
  crearConexionExterna,
  actualizarConexionExterna,
  eliminarConexionExterna,
  sincronizarConexionExterna,
  actualizarValoresConDatosReales,
} from '../api/conexionesExternas';
import { useAuth } from '../../../context/AuthContext';

interface GestorConexionesExternasProps {
  dieta?: Dieta;
  onValoresActualizados?: (resultado: ResultadoActualizacionValores) => void;
}

export const GestorConexionesExternas: React.FC<GestorConexionesExternasProps> = ({
  dieta,
  onValoresActualizados,
}) => {
  const { user } = useAuth();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [conexiones, setConexiones] = useState<ConexionExterna[]>([]);
  const [cargando, setCargando] = useState(false);
  const [sincronizando, setSincronizando] = useState<string | null>(null);
  const [actualizandoValores, setActualizandoValores] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tipoNuevaConexion, setTipoNuevaConexion] = useState<TipoConexionExterna>('myfitnesspal');

  useEffect(() => {
    if (mostrarModal) {
      cargarConexiones();
    }
  }, [mostrarModal]);

  const cargarConexiones = async () => {
    setCargando(true);
    try {
      const data = await getConexionesExternas();
      setConexiones(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando conexiones');
    } finally {
      setCargando(false);
    }
  };

  const handleSincronizar = async (conexion: ConexionExterna) => {
    setSincronizando(conexion.id);
    setError(null);
    setExito(null);

    try {
      const resultado = await sincronizarConexionExterna(conexion.id);
      setExito(
        `Sincronizado: ${resultado.resumen?.ingredientesNuevos || 0} nuevos, ${resultado.resumen?.ingredientesActualizados || 0} actualizados`
      );
      setTimeout(() => setExito(null), 3000);
      await cargarConexiones();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error sincronizando conexión');
    } finally {
      setSincronizando(null);
    }
  };

  const handleActualizarValores = async (conexionId?: string) => {
    if (!dieta) {
      setError('No hay dieta seleccionada');
      return;
    }

    setActualizandoValores(true);
    setError(null);
    setExito(null);

    try {
      const resultado = await actualizarValoresConDatosReales(dieta.id, conexionId);
      setExito(
        `Valores actualizados: ${resultado.alimentosActualizados.length} alimentos, ${resultado.comidasAfectadas.length} comidas afectadas`
      );
      setTimeout(() => setExito(null), 3000);
      onValoresActualizados?.(resultado);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando valores');
    } finally {
      setActualizandoValores(false);
    }
  };

  const handleCrearConexion = async () => {
    setError(null);
    try {
      const nuevaConexion: Omit<ConexionExterna, 'id' | 'creadoEn' | 'actualizadoEn'> = {
        tipo: tipoNuevaConexion,
        nombre: tipoNuevaConexion === 'myfitnesspal' ? 'MyFitnessPal' : tipoNuevaConexion === 'cronometer' ? 'Cronometer' : 'Mi Inventario',
        descripcion: `Conexión con ${tipoNuevaConexion}`,
        activa: true,
        sincronizacionAutomatica: false,
        frecuenciaSincronizacion: 'manual',
        creadoPor: user?.id || 'user-1',
      };

      await crearConexionExterna(nuevaConexion);
      setMostrarFormulario(false);
      setTipoNuevaConexion('myfitnesspal');
      await cargarConexiones();
      setExito('Conexión creada exitosamente');
      setTimeout(() => setExito(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando conexión');
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta conexión?')) return;

    setError(null);
    try {
      await eliminarConexionExterna(id);
      await cargarConexiones();
      setExito('Conexión eliminada exitosamente');
      setTimeout(() => setExito(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error eliminando conexión');
    }
  };

  const getIconoTipo = (tipo: TipoConexionExterna) => {
    switch (tipo) {
      case 'myfitnesspal':
      case 'cronometer':
        return <Smartphone className="h-5 w-5" />;
      case 'inventario-ingredientes':
        return <Database className="h-5 w-5" />;
      default:
        return <Link2 className="h-5 w-5" />;
    }
  };

  const getNombreTipo = (tipo: TipoConexionExterna) => {
    switch (tipo) {
      case 'myfitnesspal':
        return 'MyFitnessPal';
      case 'cronometer':
        return 'Cronometer';
      case 'inventario-ingredientes':
        return 'Inventario';
      default:
        return tipo;
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        leftIcon={<Link2 className="h-4 w-4" />}
        onClick={() => setMostrarModal(true)}
      >
        Conectar Apps Externas
      </Button>

      <Modal
        isOpen={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          setError(null);
          setExito(null);
          setMostrarFormulario(false);
        }}
        title="Conectar con Apps Externas e Inventario"
        size="xl"
      >
        <div className="space-y-6">
          {/* Mensajes de error y éxito */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {exito && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-700">{exito}</p>
            </div>
          )}

          {/* Acciones principales */}
          {dieta && (
            <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Download className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900">Actualizar valores con datos reales</p>
                <p className="text-xs text-blue-700">Sincroniza los valores nutricionales de la dieta con datos de apps externas o inventario</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                leftIcon={actualizandoValores ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                onClick={() => handleActualizarValores()}
                disabled={actualizandoValores}
              >
                {actualizandoValores ? 'Actualizando...' : 'Actualizar Valores'}
              </Button>
            </div>
          )}

          {/* Botón crear nueva conexión */}
          {!mostrarFormulario && (
            <div className="flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => setMostrarFormulario(true)}
              >
                Nueva Conexión
              </Button>
            </div>
          )}

          {/* Formulario nueva conexión */}
          {mostrarFormulario && (
            <Card className="p-4 bg-slate-50">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">Nueva Conexión</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<X className="h-4 w-4" />}
                    onClick={() => {
                      setMostrarFormulario(false);
                      setTipoNuevaConexion('myfitnesspal');
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Tipo de conexión</label>
                  <select
                    value={tipoNuevaConexion}
                    onChange={(e) => setTipoNuevaConexion(e.target.value as TipoConexionExterna)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="myfitnesspal">MyFitnessPal</option>
                    <option value="cronometer">Cronometer</option>
                    <option value="inventario-ingredientes">Inventario de Ingredientes</option>
                  </select>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCrearConexion}
                  className="w-full"
                >
                  Crear Conexión
                </Button>
              </div>
            </Card>
          )}

          {/* Lista de conexiones */}
          {cargando ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : conexiones.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-500">
              No hay conexiones configuradas. Crea una nueva conexión para empezar.
            </div>
          ) : (
            <div className="space-y-3">
              {conexiones.map((conexion) => (
                <Card
                  key={conexion.id}
                  className="p-4 bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        {getIconoTipo(conexion.tipo)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-slate-900">{conexion.nombre}</h4>
                          <Badge
                            className={`${
                              conexion.activa
                                ? 'bg-green-50 text-green-600'
                                : 'bg-slate-50 text-slate-600'
                            } text-[10px]`}
                          >
                            {conexion.activa ? 'Activa' : 'Inactiva'}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{conexion.descripcion}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-600">
                          {conexion.ingredientesSincronizados !== undefined && (
                            <span>{conexion.ingredientesSincronizados} ingredientes</span>
                          )}
                          {conexion.ultimaSincronizacion && (
                            <span>
                              Última sync: {new Date(conexion.ultimaSincronizacion).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {dieta && (
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={actualizandoValores ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                          onClick={() => handleActualizarValores(conexion.id)}
                          disabled={actualizandoValores}
                          title="Actualizar valores de la dieta con esta conexión"
                        >
                          Actualizar
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={
                          sincronizando === conexion.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3 w-3" />
                          )
                        }
                        onClick={() => handleSincronizar(conexion)}
                        disabled={sincronizando === conexion.id}
                        title="Sincronizar datos"
                      >
                        Sync
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Trash2 className="h-3 w-3" />}
                        onClick={() => handleEliminar(conexion.id)}
                        title="Eliminar conexión"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Botón cerrar */}
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <Button variant="ghost" onClick={() => setMostrarModal(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

