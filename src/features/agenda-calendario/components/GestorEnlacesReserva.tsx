import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, Plus, Edit, Trash2, Copy, ExternalLink, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, Button, Modal, Input, Switch, Select, Textarea, Badge } from '../../../components/componentsreutilizables';
import { useAuth } from '../../../context/AuthContext';
import { EnlaceReservaPublica, TipoCita } from '../types';
import {
  getEnlacesReserva,
  crearEnlaceReserva,
  actualizarEnlaceReserva,
  eliminarEnlaceReserva,
  generarSlug,
  verificarSlugDisponible,
} from '../api/enlacesReserva';

const TIPOS_SESION_OPTIONS: Array<{ value: TipoCita; label: string }> = [
  { value: 'sesion-1-1', label: 'Sesión 1:1' },
  { value: 'videollamada', label: 'Videollamada' },
  { value: 'evaluacion', label: 'Evaluación' },
  { value: 'clase-colectiva', label: 'Clase Colectiva' },
  { value: 'fisioterapia', label: 'Fisioterapia' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'otro', label: 'Otro' },
];

export const GestorEnlacesReserva: React.FC = () => {
  const { user } = useAuth();
  const [enlaces, setEnlaces] = useState<EnlaceReservaPublica[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [enlaceEditando, setEnlaceEditando] = useState<EnlaceReservaPublica | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [copiado, setCopiado] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    slug: '',
    nombrePersonalizado: '',
    activo: true,
    tiposSesionDisponibles: [] as TipoCita[],
    mensajeBienvenida: '',
    requiereConfirmacion: false,
    mostrarHorariosDisponibles: true,
  });

  useEffect(() => {
    if (user?.id) {
      cargarEnlaces();
    }
  }, [user?.id]);

  const cargarEnlaces = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const enlacesData = await getEnlacesReserva(user.id);
      setEnlaces(enlacesData);
    } catch (error) {
      setError('Error al cargar los enlaces de reserva');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirModal = (enlace?: EnlaceReservaPublica) => {
    if (enlace) {
      setEnlaceEditando(enlace);
      setFormData({
        slug: enlace.slug,
        nombrePersonalizado: enlace.nombrePersonalizado || '',
        activo: enlace.activo,
        tiposSesionDisponibles: enlace.tiposSesionDisponibles,
        mensajeBienvenida: enlace.mensajeBienvenida || '',
        requiereConfirmacion: enlace.requiereConfirmacion,
        mostrarHorariosDisponibles: enlace.mostrarHorariosDisponibles,
      });
    } else {
      setEnlaceEditando(null);
      setFormData({
        slug: '',
        nombrePersonalizado: '',
        activo: true,
        tiposSesionDisponibles: [],
        mensajeBienvenida: '',
        requiereConfirmacion: false,
        mostrarHorariosDisponibles: true,
      });
    }
    setMostrarModal(true);
  };

  const handleGenerarSlug = async () => {
    if (!formData.nombrePersonalizado && !user?.name) return;
    
    try {
      const nombre = formData.nombrePersonalizado || user?.name || '';
      const slug = await generarSlug(nombre, user?.id || '');
      const disponible = await verificarSlugDisponible(slug);
      
      if (disponible) {
        setFormData({ ...formData, slug });
      } else {
        setError('El slug generado no está disponible. Por favor, modifícalo manualmente.');
      }
    } catch (error) {
      setError('Error al generar el slug');
      console.error(error);
    }
  };

  const handleGuardar = async () => {
    if (!user?.id) return;

    if (!formData.slug) {
      setError('El slug es requerido');
      return;
    }

    if (formData.tiposSesionDisponibles.length === 0) {
      setError('Debes seleccionar al menos un tipo de sesión');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (enlaceEditando) {
        await actualizarEnlaceReserva(enlaceEditando.id, {
          ...formData,
          entrenadorId: user.id,
        });
        setExito('Enlace actualizado correctamente');
      } else {
        await crearEnlaceReserva({
          ...formData,
          entrenadorId: user.id,
        });
        setExito('Enlace creado correctamente');
      }
      setTimeout(() => setExito(null), 3000);
      setMostrarModal(false);
      cargarEnlaces();
    } catch (error) {
      setError('Error al guardar el enlace');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este enlace de reserva?')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await eliminarEnlaceReserva(id);
      setExito('Enlace eliminado correctamente');
      setTimeout(() => setExito(null), 3000);
      cargarEnlaces();
    } catch (error) {
      setError('Error al eliminar el enlace');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopiarEnlace = (slug: string) => {
    const url = `${window.location.origin}/reservar/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiado(slug);
    setTimeout(() => setCopiado(null), 2000);
  };

  const handleToggleActivo = async (enlace: EnlaceReservaPublica) => {
    setLoading(true);
    try {
      await actualizarEnlaceReserva(enlace.id, {
        ...enlace,
        activo: !enlace.activo,
      });
      cargarEnlaces();
    } catch (error) {
      setError('Error al actualizar el estado del enlace');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getUrlEnlace = (slug: string) => {
    return `${window.location.origin}/reservar/${slug}`;
  };

  return (
    <div className="space-y-6">
      {/* Mensajes de error/éxito */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-800">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-800">
            ✕
          </button>
        </div>
      )}

      {exito && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2 text-green-800">
          <CheckCircle className="w-5 h-5" />
          <span>{exito}</span>
          <button onClick={() => setExito(null)} className="ml-auto text-green-600 hover:text-green-800">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <LinkIcon className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Enlaces de Reserva Pública</h2>
                <p className="text-sm text-gray-600">Crea enlaces para que tus clientes agenden sesiones directamente</p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => handleAbrirModal()}
              disabled={loading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Enlace
            </Button>
          </div>
        </div>
      </Card>

      {/* Lista de Enlaces */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          {loading && enlaces.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-600">Cargando enlaces...</div>
            </div>
          ) : enlaces.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No tienes enlaces de reserva creados</p>
              <p className="text-sm text-gray-500 mb-6">
                Crea un enlace público para que tus clientes puedan agendar sesiones fácilmente
              </p>
              <Button variant="primary" onClick={() => handleAbrirModal()}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Enlace
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {enlaces.map((enlace) => (
                <div
                  key={enlace.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {enlace.nombrePersonalizado || enlace.slug}
                        </h3>
                        <Badge variant={enlace.activo ? 'success' : 'secondary'}>
                          {enlace.activo ? (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              Activo
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 mr-1" />
                              Inactivo
                            </>
                          )}
                        </Badge>
                      </div>
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">URL:</span>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {getUrlEnlace(enlace.slug)}
                          </code>
                        </div>
                        {enlace.mensajeBienvenida && (
                          <p className="text-sm text-gray-600">{enlace.mensajeBienvenida}</p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>
                            Tipos de sesión: {enlace.tiposSesionDisponibles.length}
                          </span>
                          <span>
                            {enlace.requiereConfirmacion ? 'Requiere confirmación' : 'Confirmación automática'}
                          </span>
                          <span>
                            {enlace.mostrarHorariosDisponibles ? 'Muestra horarios' : 'No muestra horarios'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {enlace.tiposSesionDisponibles.map((tipo) => {
                          const option = TIPOS_SESION_OPTIONS.find(o => o.value === tipo);
                          return (
                            <Badge key={tipo} variant="outline">
                              {option?.label || tipo}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopiarEnlace(enlace.slug)}
                        title="Copiar enlace"
                      >
                        {copiado === enlace.slug ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(getUrlEnlace(enlace.slug), '_blank')}
                        title="Abrir enlace"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Switch
                        checked={enlace.activo}
                        onChange={() => handleToggleActivo(enlace)}
                        label=""
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAbrirModal(enlace)}
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEliminar(enlace.id)}
                        title="Eliminar"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Modal de Crear/Editar Enlace */}
      <Modal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        title={enlaceEditando ? 'Editar Enlace de Reserva' : 'Crear Enlace de Reserva'}
        size="lg"
        footer={
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={() => setMostrarModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleGuardar} disabled={loading}>
              {enlaceEditando ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <Input
              label="Nombre Personalizado"
              value={formData.nombrePersonalizado}
              onChange={(e) => setFormData({ ...formData, nombrePersonalizado: e.target.value })}
              placeholder="Ej: Juan Pérez - Entrenador Personal"
              helperText="Nombre que se mostrará en la página de reserva"
            />
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex-1">
                <Input
                  label="Slug (URL)"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                  placeholder="nombre-entrenador"
                  helperText="URL amigable para tu enlace de reserva"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGenerarSlug}
                className="mt-6"
                disabled={!formData.nombrePersonalizado && !user?.name}
              >
                Generar
              </Button>
            </div>
            {formData.slug && (
              <div className="text-sm text-gray-600 mt-1">
                URL completa: <code className="bg-gray-100 px-2 py-1 rounded">{getUrlEnlace(formData.slug)}</code>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipos de Sesión Disponibles *
            </label>
            <div className="space-y-2 border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto">
              {TIPOS_SESION_OPTIONS.map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.tiposSesionDisponibles.includes(option.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          tiposSesionDisponibles: [...formData.tiposSesionDisponibles, option.value],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          tiposSesionDisponibles: formData.tiposSesionDisponibles.filter(t => t !== option.value),
                        });
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Textarea
              label="Mensaje de Bienvenida (opcional)"
              value={formData.mensajeBienvenida}
              onChange={(e) => setFormData({ ...formData, mensajeBienvenida: e.target.value })}
              placeholder="¡Reserva tu sesión conmigo!"
              rows={3}
              helperText="Mensaje que verán los clientes al acceder al enlace"
            />
          </div>

          <div className="space-y-4">
            <div>
              <Switch
                label="Mostrar horarios disponibles"
                checked={formData.mostrarHorariosDisponibles}
                onChange={(checked) => setFormData({ ...formData, mostrarHorariosDisponibles: checked })}
              />
              <p className="text-sm text-gray-600 mt-1 ml-12">Los clientes verán los horarios disponibles en tiempo real</p>
            </div>
            <div>
              <Switch
                label="Requiere confirmación"
                checked={formData.requiereConfirmacion}
                onChange={(checked) => setFormData({ ...formData, requiereConfirmacion: checked })}
              />
              <p className="text-sm text-gray-600 mt-1 ml-12">Las reservas requerirán tu confirmación antes de ser creadas</p>
            </div>
            <div>
              <Switch
                label="Activo"
                checked={formData.activo}
                onChange={(checked) => setFormData({ ...formData, activo: checked })}
              />
              <p className="text-sm text-gray-600 mt-1 ml-12">El enlace estará disponible para uso público</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

