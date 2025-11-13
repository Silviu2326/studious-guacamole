import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Badge, Input } from '../../../components/componentsreutilizables';
import {
  Link2,
  Search,
  Plus,
  CheckCircle2,
  Leaf,
  DollarSign,
  Loader2,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Filter,
  X,
} from 'lucide-react';
import {
  ProveedorExterno,
  RecursoProveedorExterno,
  RecursoBiblioteca,
} from '../types';
import {
  getProveedoresExternos,
  buscarRecursosEnProveedor,
  importarRecursoDesdeProveedor,
  sincronizarProveedor,
} from '../api/proveedoresExternos';
import { useAuth } from '../../../context/AuthContext';

interface ConectorProveedoresExternosProps {
  onRecursoImportado?: (recurso: RecursoBiblioteca) => void;
  onCerrar?: () => void;
}

export const ConectorProveedoresExternos: React.FC<ConectorProveedoresExternosProps> = ({
  onRecursoImportado,
  onCerrar,
}) => {
  const { user } = useAuth();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [proveedores, setProveedores] = useState<ProveedorExterno[]>([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<ProveedorExterno | null>(null);
  const [recursos, setRecursos] = useState<RecursoProveedorExterno[]>([]);
  const [cargando, setCargando] = useState(false);
  const [cargandoRecursos, setCargandoRecursos] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [soloCertificados, setSoloCertificados] = useState(false);
  const [soloTemporada, setSoloTemporada] = useState(false);
  const [importando, setImportando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [sincronizando, setSincronizando] = useState<string | null>(null);

  useEffect(() => {
    if (mostrarModal) {
      cargarProveedores();
    }
  }, [mostrarModal]);

  useEffect(() => {
    if (proveedorSeleccionado) {
      buscarRecursos();
    }
  }, [proveedorSeleccionado, busqueda, soloCertificados, soloTemporada]);

  const cargarProveedores = async () => {
    setCargando(true);
    try {
      const data = await getProveedoresExternos();
      setProveedores(data.filter((p) => p.activo));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando proveedores');
    } finally {
      setCargando(false);
    }
  };

  const buscarRecursos = async () => {
    if (!proveedorSeleccionado) return;

    setCargandoRecursos(true);
    setError(null);
    try {
      const resultado = await buscarRecursosEnProveedor(
        proveedorSeleccionado.id,
        busqueda || undefined,
        soloCertificados || undefined,
        soloTemporada || undefined
      );
      setRecursos(resultado.recursos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error buscando recursos');
    } finally {
      setCargandoRecursos(false);
    }
  };

  const handleImportar = async (recurso: RecursoProveedorExterno) => {
    if (!proveedorSeleccionado) return;

    setImportando(recurso.id);
    setError(null);
    setExito(null);

    try {
      const recursoImportado = await importarRecursoDesdeProveedor(
        proveedorSeleccionado.id,
        recurso.id,
        user?.id
      );
      onRecursoImportado?.(recursoImportado);
      setExito(`"${recurso.nombre}" importado exitosamente`);
      
      // Remover el recurso de la lista
      setRecursos((prev) => prev.filter((r) => r.id !== recurso.id));
      
      setTimeout(() => setExito(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error importando recurso');
    } finally {
      setImportando(null);
    }
  };

  const handleSincronizar = async (proveedor: ProveedorExterno) => {
    setSincronizando(proveedor.id);
    setError(null);

    try {
      const resultado = await sincronizarProveedor(proveedor.id);
      setExito(
        `Sincronizado: ${resultado.recursosNuevos} nuevos, ${resultado.recursosActualizados} actualizados`
      );
      setTimeout(() => setExito(null), 3000);
      
      // Recargar proveedores
      await cargarProveedores();
      
      // Si este proveedor está seleccionado, recargar recursos
      if (proveedorSeleccionado?.id === proveedor.id) {
        await buscarRecursos();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error sincronizando proveedor');
    } finally {
      setSincronizando(null);
    }
  };

  const abrirModal = () => {
    setMostrarModal(true);
    setProveedorSeleccionado(null);
    setRecursos([]);
    setBusqueda('');
    setSoloCertificados(false);
    setSoloTemporada(false);
    setError(null);
    setExito(null);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setProveedorSeleccionado(null);
    setRecursos([]);
    setBusqueda('');
    setSoloCertificados(false);
    setSoloTemporada(false);
    setError(null);
    setExito(null);
    onCerrar?.();
  };

  const renderRecurso = (recurso: RecursoProveedorExterno) => {
    return (
      <Card
        key={recurso.id}
        className="p-4 bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-semibold text-slate-900">{recurso.nombre}</h4>
                {recurso.certificado && (
                  <Badge className="bg-green-50 text-green-600 text-[10px] py-0.5 px-2 rounded-full">
                    <CheckCircle2 className="h-3 w-3 mr-1 inline" />
                    Certificado
                  </Badge>
                )}
                {recurso.ingredientesTemporada && (
                  <Badge className="bg-blue-50 text-blue-600 text-[10px] py-0.5 px-2 rounded-full">
                    <Leaf className="h-3 w-3 mr-1 inline" />
                    Temporada
                  </Badge>
                )}
              </div>
              {recurso.descripcion && (
                <p className="text-xs text-slate-500 line-clamp-2 mb-2">{recurso.descripcion}</p>
              )}
            </div>
          </div>

          {/* Macros */}
          {recurso.macros && (
            <div className="grid grid-cols-4 gap-2 text-xs text-slate-600">
              <div className="flex flex-col">
                <span className="font-medium text-slate-500 uppercase tracking-wide text-[10px]">
                  Kcal
                </span>
                <span className="font-semibold text-slate-900">{recurso.macros.calorias}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-slate-500 uppercase tracking-wide text-[10px]">
                  P
                </span>
                <span className="font-semibold text-slate-900">{recurso.macros.proteinas}g</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-slate-500 uppercase tracking-wide text-[10px]">
                  H
                </span>
                <span className="font-semibold text-slate-900">
                  {recurso.macros.carbohidratos}g
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-slate-500 uppercase tracking-wide text-[10px]">
                  G
                </span>
                <span className="font-semibold text-slate-900">{recurso.macros.grasas}g</span>
              </div>
            </div>
          )}

          {/* Coste y huella de carbono */}
          <div className="flex items-center gap-4 text-xs">
            {recurso.costeEstimado !== undefined && (
              <div className="flex items-center gap-1 text-slate-600">
                <DollarSign className="h-3 w-3 text-green-500" />
                <span className="font-semibold text-slate-900">
                  {recurso.costeEstimado.toFixed(2)} €
                </span>
              </div>
            )}
            {recurso.huellaCarbono !== undefined && (
              <div className="flex items-center gap-1 text-slate-600">
                <Leaf className="h-3 w-3 text-green-500" />
                <span className="font-semibold text-slate-900">
                  {recurso.huellaCarbono.toFixed(2)} kg CO₂
                </span>
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
            <Button
              size="sm"
              variant="primary"
              leftIcon={
                importando === recurso.id ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Plus className="h-3 w-3" />
                )
              }
              onClick={() => handleImportar(recurso)}
              disabled={importando === recurso.id}
              className="flex-1"
            >
              {importando === recurso.id ? 'Importando...' : 'Añadir con un clic'}
            </Button>
            {recurso.enlace && (
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<ExternalLink className="h-3 w-3" />}
                onClick={() => window.open(recurso.enlace, '_blank')}
                title="Ver en el proveedor"
              >
                Ver
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <>
      {/* Botón principal */}
      <Button
        variant="secondary"
        size="sm"
        leftIcon={<Link2 className="h-4 w-4" />}
        onClick={abrirModal}
      >
        Conectar Proveedores
      </Button>

      {/* Modal */}
      <Modal
        isOpen={mostrarModal}
        onClose={cerrarModal}
        title="Conectar con Proveedores Externos"
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

          {/* Selección de proveedor */}
          {!proveedorSeleccionado ? (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Selecciona un proveedor
              </h3>
              {cargando ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                </div>
              ) : proveedores.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-500">
                  No hay proveedores activos disponibles
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {proveedores.map((proveedor) => (
                    <Card
                      key={proveedor.id}
                      className="p-4 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
                      onClick={() => setProveedorSeleccionado(proveedor)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">{proveedor.nombre}</h4>
                          {proveedor.descripcion && (
                            <p className="text-xs text-slate-500 mt-1">{proveedor.descripcion}</p>
                          )}
                        </div>
                        <Badge
                          className={`${
                            proveedor.activo
                              ? 'bg-green-50 text-green-600'
                              : 'bg-slate-50 text-slate-600'
                          } text-[10px]`}
                        >
                          {proveedor.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
                        <div className="text-xs text-slate-500">
                          {proveedor.recursosImportados || 0} recursos importados
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          leftIcon={
                            sincronizando === proveedor.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <RefreshCw className="h-3 w-3" />
                            )
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSincronizar(proveedor);
                          }}
                          disabled={sincronizando === proveedor.id}
                        >
                          Sincronizar
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header con botón volver */}
              <div className="flex items-center justify-between">
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<X className="h-4 w-4" />}
                    onClick={() => {
                      setProveedorSeleccionado(null);
                      setRecursos([]);
                      setBusqueda('');
                      setSoloCertificados(false);
                      setSoloTemporada(false);
                    }}
                  >
                    Volver
                  </Button>
                  <h3 className="text-sm font-semibold text-slate-900 mt-2">
                    {proveedorSeleccionado.nombre}
                  </h3>
                </div>
              </div>

              {/* Búsqueda y filtros */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Buscar recetas o ingredientes..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button
                  variant={soloCertificados ? 'secondary' : 'ghost'}
                  size="sm"
                  leftIcon={<CheckCircle2 className="h-4 w-4" />}
                  onClick={() => setSoloCertificados(!soloCertificados)}
                >
                  Solo Certificados
                </Button>
                <Button
                  variant={soloTemporada ? 'secondary' : 'ghost'}
                  size="sm"
                  leftIcon={<Leaf className="h-4 w-4" />}
                  onClick={() => setSoloTemporada(!soloTemporada)}
                >
                  Solo Temporada
                </Button>
              </div>

              {/* Lista de recursos */}
              {cargandoRecursos ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                </div>
              ) : recursos.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-500">
                  No se encontraron recursos
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {recursos.map(renderRecurso)}
                </div>
              )}
            </div>
          )}

          {/* Botón cerrar */}
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <Button variant="ghost" onClick={cerrarModal}>
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

