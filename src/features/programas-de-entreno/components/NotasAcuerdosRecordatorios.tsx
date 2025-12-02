import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge, Input, Textarea, Select, Modal } from '../../../components/componentsreutilizables';
import {
  StickyNote,
  CheckCircle2,
  AlertCircle,
  Bell,
  Plus,
  Edit2,
  Trash2,
  Tag,
  Filter,
  X,
  Clock,
  Calendar,
} from 'lucide-react';
import * as notasApi from '../api/notas-acuerdos-recordatorios';
import type { NotaAcuerdoRecordatorio, TipoNota } from '../types';
import { useAuth } from '../../../context/AuthContext';

interface NotasAcuerdosRecordatoriosProps {
  programaId?: string;
  clienteId?: string;
}

export function NotasAcuerdosRecordatorios({
  programaId,
  clienteId,
}: NotasAcuerdosRecordatoriosProps) {
  const { user } = useAuth();
  const [notas, setNotas] = useState<NotaAcuerdoRecordatorio[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [notaEditando, setNotaEditando] = useState<NotaAcuerdoRecordatorio | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroTag, setFiltroTag] = useState<string>('todos');
  const [filtroCompletado, setFiltroCompletado] = useState<string>('todos');
  const [tagsDisponibles, setTagsDisponibles] = useState<string[]>([]);
  const [buscador, setBuscador] = useState('');

  const [formData, setFormData] = useState({
    tipo: 'nota' as TipoNota,
    titulo: '',
    contenido: '',
    tags: [] as string[],
    prioridad: 'media' as 'alta' | 'media' | 'baja',
    fechaRecordatorio: '',
  });

  useEffect(() => {
    cargarNotas();
    cargarTags();
  }, [programaId, clienteId]);

  const cargarNotas = async () => {
    setLoading(true);
    try {
      const notasData = await notasApi.obtenerNotas(programaId, clienteId);
      setNotas(notasData);
    } catch (error) {
      console.error('Error cargando notas:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarTags = async () => {
    try {
      const tags = await notasApi.obtenerTagsDisponibles();
      setTagsDisponibles(tags);
    } catch (error) {
      console.error('Error cargando tags:', error);
    }
  };

  const notasFiltradas = useMemo(() => {
    let filtradas = [...notas];

    // Filtro por tipo
    if (filtroTipo !== 'todos') {
      filtradas = filtradas.filter((n) => n.tipo === filtroTipo);
    }

    // Filtro por tag
    if (filtroTag !== 'todos') {
      filtradas = filtradas.filter((n) => n.tags.includes(filtroTag));
    }

    // Filtro por completado
    if (filtroCompletado === 'completados') {
      filtradas = filtradas.filter((n) => n.completado);
    } else if (filtroCompletado === 'pendientes') {
      filtradas = filtradas.filter((n) => !n.completado);
    }

    // Buscador
    if (buscador.trim()) {
      const busqueda = buscador.toLowerCase();
      filtradas = filtradas.filter(
        (n) =>
          n.titulo.toLowerCase().includes(busqueda) ||
          n.contenido.toLowerCase().includes(busqueda) ||
          n.tags.some((tag) => tag.toLowerCase().includes(busqueda))
      );
    }

    return filtradas;
  }, [notas, filtroTipo, filtroTag, filtroCompletado, buscador]);

  const handleAbrirModal = (nota?: NotaAcuerdoRecordatorio) => {
    if (nota) {
      setNotaEditando(nota);
      setFormData({
        tipo: nota.tipo,
        titulo: nota.titulo,
        contenido: nota.contenido,
        tags: nota.tags,
        prioridad: nota.prioridad || 'media',
        fechaRecordatorio: nota.fechaRecordatorio
          ? new Date(nota.fechaRecordatorio).toISOString().slice(0, 16)
          : '',
      });
    } else {
      setNotaEditando(null);
      setFormData({
        tipo: 'nota',
        titulo: '',
        contenido: '',
        tags: [],
        prioridad: 'media',
        fechaRecordatorio: '',
      });
    }
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setNotaEditando(null);
    setFormData({
      tipo: 'nota',
      titulo: '',
      contenido: '',
      tags: [],
      prioridad: 'media',
      fechaRecordatorio: '',
    });
  };

  const handleGuardar = async () => {
    if (!formData.titulo.trim() || !formData.contenido.trim()) {
      return;
    }

    try {
      if (notaEditando) {
        await notasApi.actualizarNota(notaEditando.id, {
          tipo: formData.tipo,
          titulo: formData.titulo,
          contenido: formData.contenido,
          tags: formData.tags,
          prioridad: formData.prioridad,
          fechaRecordatorio: formData.fechaRecordatorio
            ? new Date(formData.fechaRecordatorio).toISOString()
            : undefined,
        });
      } else {
        await notasApi.crearNota({
          tipo: formData.tipo,
          titulo: formData.titulo,
          contenido: formData.contenido,
          tags: formData.tags,
          prioridad: formData.prioridad,
          fechaRecordatorio: formData.fechaRecordatorio
            ? new Date(formData.fechaRecordatorio).toISOString()
            : undefined,
          programaId,
          clienteId,
          completado: false,
          creadoPor: user?.id || 'entrenador-1',
        });
      }
      await cargarNotas();
      await cargarTags();
      handleCerrarModal();
    } catch (error) {
      console.error('Error guardando nota:', error);
    }
  };

  const handleToggleCompletado = async (id: string, completado: boolean) => {
    try {
      await notasApi.actualizarNota(id, { completado: !completado });
      await cargarNotas();
    } catch (error) {
      console.error('Error actualizando nota:', error);
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      return;
    }

    try {
      await notasApi.eliminarNota(id);
      await cargarNotas();
      await cargarTags();
    } catch (error) {
      console.error('Error eliminando nota:', error);
    }
  };

  const handleAgregarTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag.trim()],
      });
    }
  };

  const handleEliminarTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const getTipoIcon = (tipo: TipoNota) => {
    switch (tipo) {
      case 'nota':
        return <StickyNote className="w-5 h-5" />;
      case 'acuerdo':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'recordatorio':
        return <Bell className="w-5 h-5" />;
    }
  };

  const getTipoColor = (tipo: TipoNota) => {
    switch (tipo) {
      case 'nota':
        return 'bg-blue-100 text-blue-700';
      case 'acuerdo':
        return 'bg-green-100 text-green-700';
      case 'recordatorio':
        return 'bg-orange-100 text-orange-700';
    }
  };

  const getPrioridadColor = (prioridad?: string) => {
    switch (prioridad) {
      case 'alta':
        return 'bg-red-100 text-red-700';
      case 'media':
        return 'bg-yellow-100 text-yellow-700';
      case 'baja':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading && notas.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-500">Cargando notas...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header y acciones */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <StickyNote className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Notas, Acuerdos y Recordatorios
              </h2>
              <p className="text-sm text-gray-600">
                Registra notas, acuerdos y recordatorios directamente en el panel y etiquétalos
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => handleAbrirModal()}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nueva Nota
          </Button>
        </div>

        {/* Filtros y búsqueda */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div>
            <Input
              placeholder="Buscar..."
              value={buscador}
              onChange={(e) => setBuscador(e.target.value)}
            />
          </div>
          <Select
            value={filtroTipo}
            onChange={(v) => setFiltroTipo(v)}
            options={[
              { label: 'Todos los tipos', value: 'todos' },
              { label: 'Notas', value: 'nota' },
              { label: 'Acuerdos', value: 'acuerdo' },
              { label: 'Recordatorios', value: 'recordatorio' },
            ]}
          />
          <Select
            value={filtroTag}
            onChange={(v) => setFiltroTag(v)}
            options={[
              { label: 'Todas las etiquetas', value: 'todos' },
              ...tagsDisponibles.map((tag) => ({ label: tag, value: tag })),
            ]}
          />
          <Select
            value={filtroCompletado}
            onChange={(v) => setFiltroCompletado(v)}
            options={[
              { label: 'Todas', value: 'todos' },
              { label: 'Pendientes', value: 'pendientes' },
              { label: 'Completados', value: 'completados' },
            ]}
          />
        </div>
      </Card>

      {/* Lista de notas */}
      {notasFiltradas.length === 0 ? (
        <Card className="p-8 text-center">
          <StickyNote className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">
            {notas.length === 0
              ? 'No hay notas registradas. Crea una nueva nota para empezar.'
              : 'No se encontraron notas con los filtros seleccionados.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notasFiltradas.map((nota) => (
            <Card
              key={nota.id}
              className={`p-4 border-2 ${
                nota.completado ? 'opacity-60 border-gray-200' : 'border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={getTipoColor(nota.tipo)}>{getTipoIcon(nota.tipo)}</div>
                  <Badge className={getPrioridadColor(nota.prioridad)}>
                    {nota.prioridad || 'media'}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleAbrirModal(nota)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEliminar(nota.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3
                className={`font-semibold mb-2 ${
                  nota.completado ? 'line-through text-gray-500' : 'text-gray-900'
                }`}
              >
                {nota.titulo}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">{nota.contenido}</p>

              {nota.fechaRecordatorio && (
                <div className="flex items-center gap-1 text-xs text-orange-600 mb-2">
                  <Bell className="w-3 h-3" />
                  <span>
                    Recordatorio: {new Date(nota.fechaRecordatorio).toLocaleString('es-ES')}
                  </span>
                </div>
              )}

              <div className="flex flex-wrap gap-1 mb-3">
                {nota.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{new Date(nota.fechaCreacion).toLocaleDateString('es-ES')}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleCompletado(nota.id, nota.completado)}
                  leftIcon={
                    nota.completado ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    )
                  }
                >
                  {nota.completado ? 'Completado' : 'Marcar como completado'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de creación/edición */}
      <Modal
        isOpen={mostrarModal}
        onClose={handleCerrarModal}
        title={notaEditando ? 'Editar Nota' : 'Nueva Nota'}
        size="lg"
      >
        <div className="space-y-4">
          <Select
            label="Tipo"
            value={formData.tipo}
            onChange={(v) => setFormData({ ...formData, tipo: v as TipoNota })}
            options={[
              { label: 'Nota', value: 'nota' },
              { label: 'Acuerdo', value: 'acuerdo' },
              { label: 'Recordatorio', value: 'recordatorio' },
            ]}
          />

          <Input
            label="Título"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            placeholder="Ej: Revisar fatiga, Enviar vídeo..."
          />

          <Textarea
            label="Contenido"
            value={formData.contenido}
            onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
            placeholder="Escribe los detalles aquí..."
            rows={4}
          />

          <Select
            label="Prioridad"
            value={formData.prioridad}
            onChange={(v) =>
              setFormData({ ...formData, prioridad: v as 'alta' | 'media' | 'baja' })
            }
            options={[
              { label: 'Alta', value: 'alta' },
              { label: 'Media', value: 'media' },
              { label: 'Baja', value: 'baja' },
            ]}
          />

          {formData.tipo === 'recordatorio' && (
            <Input
              label="Fecha y hora del recordatorio"
              type="datetime-local"
              value={formData.fechaRecordatorio}
              onChange={(e) => setFormData({ ...formData, fechaRecordatorio: e.target.value })}
            />
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiquetas
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="default" className="flex items-center gap-1">
                  {tag}
                  <button
                    onClick={() => handleEliminarTag(tag)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Nueva etiqueta..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.target as HTMLInputElement;
                    handleAgregarTag(input.value);
                    input.value = '';
                  }
                }}
              />
              <Select
                value=""
                onChange={(v) => {
                  if (v && !formData.tags.includes(v)) {
                    handleAgregarTag(v);
                  }
                }}
                options={[
                  { label: 'Etiquetas existentes', value: '' },
                  ...tagsDisponibles
                    .filter((tag) => !formData.tags.includes(tag))
                    .map((tag) => ({ label: tag, value: tag })),
                ]}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Sugerencias: Revisar fatiga, Enviar vídeo, Técnica, Ajuste, Revisión
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={handleCerrarModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleGuardar}>
              {notaEditando ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

