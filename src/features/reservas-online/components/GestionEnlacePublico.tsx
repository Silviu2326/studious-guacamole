import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Modal } from '../../../components/componentsreutilizables';
import { 
  Link2, 
  Copy, 
  Check, 
  Share2, 
  Eye, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Save,
  Edit2,
  Trash2
} from 'lucide-react';
import { 
  getEnlacePublico, 
  crearOActualizarEnlacePublico, 
  regenerarTokenEnlace 
} from '../api/enlacePublico';
import { EnlacePublico } from '../types';

interface GestionEnlacePublicoProps {
  entrenadorId: string;
}

export const GestionEnlacePublico: React.FC<GestionEnlacePublicoProps> = ({ entrenadorId }) => {
  const [enlace, setEnlace] = useState<EnlacePublico | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nombrePersonalizado, setNombrePersonalizado] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    cargarEnlace();
  }, [entrenadorId]);

  const cargarEnlace = async () => {
    setLoading(true);
    try {
      const enlaceData = await getEnlacePublico(entrenadorId);
      if (enlaceData) {
        setEnlace(enlaceData);
        setNombrePersonalizado(enlaceData.nombrePersonalizado || '');
        setDescripcion(enlaceData.descripcion || '');
      }
    } catch (error) {
      console.error('Error cargando enlace público:', error);
    } finally {
      setLoading(false);
    }
  };

  const generarEnlace = async () => {
    setGuardando(true);
    try {
      const nuevoEnlace = await crearOActualizarEnlacePublico(entrenadorId, {
        activo: true,
        nombrePersonalizado: nombrePersonalizado || undefined,
        descripcion: descripcion || undefined,
      });
      setEnlace(nuevoEnlace);
      setEditando(false);
      setMensajeExito('Enlace público generado correctamente');
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (error) {
      console.error('Error generando enlace:', error);
    } finally {
      setGuardando(false);
    }
  };

  const actualizarEnlace = async () => {
    if (!enlace) return;
    
    setGuardando(true);
    try {
      const enlaceActualizado = await crearOActualizarEnlacePublico(entrenadorId, {
        activo: enlace.activo,
        nombrePersonalizado: nombrePersonalizado || undefined,
        descripcion: descripcion || undefined,
      });
      setEnlace(enlaceActualizado);
      setEditando(false);
      setMensajeExito('Enlace público actualizado correctamente');
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (error) {
      console.error('Error actualizando enlace:', error);
    } finally {
      setGuardando(false);
    }
  };

  const toggleActivo = async () => {
    if (!enlace) return;
    
    setGuardando(true);
    try {
      const enlaceActualizado = await crearOActualizarEnlacePublico(entrenadorId, {
        activo: !enlace.activo,
        nombrePersonalizado: enlace.nombrePersonalizado,
        descripcion: enlace.descripcion,
      });
      setEnlace(enlaceActualizado);
      setMensajeExito(enlaceActualizado.activo ? 'Enlace activado' : 'Enlace desactivado');
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (error) {
      console.error('Error cambiando estado del enlace:', error);
    } finally {
      setGuardando(false);
    }
  };

  const regenerarToken = async () => {
    if (!window.confirm('¿Estás seguro de regenerar el enlace? El enlace anterior dejará de funcionar.')) {
      return;
    }
    
    setGuardando(true);
    try {
      const enlaceActualizado = await regenerarTokenEnlace(entrenadorId);
      setEnlace(enlaceActualizado);
      setMensajeExito('Enlace regenerado correctamente');
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (error) {
      console.error('Error regenerando enlace:', error);
    } finally {
      setGuardando(false);
    }
  };

  const copiarEnlace = () => {
    if (!enlace) return;
    
    const url = `${window.location.origin}/reservar/${enlace.token}`;
    navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const compartirEnlace = async () => {
    if (!enlace) return;
    
    const url = `${window.location.origin}/reservar/${enlace.token}`;
    const texto = nombrePersonalizado || 'Reserva tu sesión conmigo';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: texto,
          text: descripcion || 'Haz tu reserva directamente desde este enlace',
          url: url,
        });
      } catch (error) {
        // Usuario canceló el share o hubo un error
        console.log('Error compartiendo:', error);
      }
    } else {
      // Fallback: copiar al portapapeles
      copiarEnlace();
    }
  };

  const obtenerUrlEnlace = (): string => {
    if (!enlace) return '';
    return `${window.location.origin}/reservar/${enlace.token}`;
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando enlace público...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link2 className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">Enlace Público de Reservas</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Genera un enlace personalizado para que tus clientes puedan reservar sesiones directamente
                </p>
              </div>
            </div>
            {enlace && (
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enlace.activo}
                    onChange={toggleActivo}
                    disabled={guardando}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {enlace.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </label>
              </div>
            )}
          </div>

          {mensajeExito && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-800">{mensajeExito}</p>
            </div>
          )}

          {!enlace ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 mb-4">
                  Genera un enlace público que puedes compartir con tus clientes. Ellos podrán ver tu disponibilidad y reservar sesiones sin necesidad de que intervengas manualmente.
                </p>
              </div>

              <Input
                label="Nombre Personalizado (opcional)"
                value={nombrePersonalizado}
                onChange={(e) => setNombrePersonalizado(e.target.value)}
                placeholder="Ej: Sesiones con Juan"
                leftIcon={<Edit2 className="w-5 h-5" />}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Añade una descripción que aparecerá en la página de reservas..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <Button
                variant="primary"
                onClick={generarEnlace}
                disabled={guardando}
                loading={guardando}
                iconLeft={Link2}
                fullWidth
              >
                Generar Enlace Público
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {editando ? (
                <>
                  <Input
                    label="Nombre Personalizado (opcional)"
                    value={nombrePersonalizado}
                    onChange={(e) => setNombrePersonalizado(e.target.value)}
                    placeholder="Ej: Sesiones con Juan"
                    leftIcon={<Edit2 className="w-5 h-5" />}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción (opcional)
                    </label>
                    <textarea
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      placeholder="Añade una descripción que aparecerá en la página de reservas..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setEditando(false);
                        setNombrePersonalizado(enlace.nombrePersonalizado || '');
                        setDescripcion(enlace.descripcion || '');
                      }}
                      fullWidth
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="primary"
                      onClick={actualizarEnlace}
                      disabled={guardando}
                      loading={guardando}
                      iconLeft={Save}
                      fullWidth
                    >
                      Guardar Cambios
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Tu Enlace Público</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditando(true)}
                        iconLeft={Edit2}
                      >
                        Editar
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={obtenerUrlEnlace()}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={copiarEnlace}
                        iconLeft={copiado ? Check : Copy}
                      >
                        {copiado ? 'Copiado' : 'Copiar'}
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={compartirEnlace}
                        iconLeft={Share2}
                      >
                        Compartir
                      </Button>
                    </div>
                  </div>

                  {nombrePersonalizado && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-900">Nombre:</p>
                      <p className="text-sm text-blue-700">{nombrePersonalizado}</p>
                    </div>
                  )}

                  {descripcion && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-900">Descripción:</p>
                      <p className="text-sm text-blue-700">{descripcion}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-5 h-5 text-gray-600" />
                        <p className="text-sm font-medium text-gray-700">Visitas</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{enlace.visitas}</p>
                    </div>
                    <div className="p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-sm font-medium text-gray-700">Reservas</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{enlace.reservasDesdeEnlace}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={regenerarToken}
                      disabled={guardando}
                      loading={guardando}
                      iconLeft={RefreshCw}
                      fullWidth
                    >
                      Regenerar Enlace
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => window.open(obtenerUrlEnlace(), '_blank')}
                      iconLeft={Eye}
                      fullWidth
                    >
                      Ver Página Pública
                    </Button>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium mb-1">Consejos para compartir:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Comparte este enlace en tus redes sociales</li>
                          <li>Inclúyelo en tu firma de email</li>
                          <li>Compártelo directamente con tus clientes por WhatsApp o SMS</li>
                          <li>Puedes regenerar el enlace si necesitas cambiarlo</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};


