import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal } from '../../../components/componentsreutilizables';
import {
  StickyNote,
  CheckCircle2,
  Circle,
  Plus,
  Edit2,
  Trash2,
  Tag,
  Calendar,
  AlertCircle,
  FileText,
  Handshake,
  Bell,
  X,
  Filter,
} from 'lucide-react';
import type { NotaRecordatorio, TipoNotaRecordatorio, EtiquetaRecordatorio } from '../types';

interface NotasRecordatoriosProps {
  dietaId: string;
  notasRecordatorios: NotaRecordatorio[];
  onGuardar: (nota: NotaRecordatorio) => void;
  onEliminar: (id: string) => void;
  onCompletar: (id: string) => void;
}

const etiquetasDisponibles: { value: EtiquetaRecordatorio; label: string; color: string }[] = [
  { value: 'revisar-suplementacion', label: 'Revisar suplementación', color: 'bg-blue-100 text-blue-700' },
  { value: 'coordinar-con-entrenador', label: 'Coordinar con entrenador', color: 'bg-purple-100 text-purple-700' },
  { value: 'seguimiento-cliente', label: 'Seguimiento cliente', color: 'bg-green-100 text-green-700' },
  { value: 'ajuste-macros', label: 'Ajuste macros', color: 'bg-orange-100 text-orange-700' },
  { value: 'revision-semanal', label: 'Revisión semanal', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'feedback-cliente', label: 'Feedback cliente', color: 'bg-pink-100 text-pink-700' },
  { value: 'cambio-objetivo', label: 'Cambio objetivo', color: 'bg-red-100 text-red-700' },
  { value: 'restricciones', label: 'Restricciones', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'otro', label: 'Otro', color: 'bg-gray-100 text-gray-700' },
];

const tiposNota: { value: TipoNotaRecordatorio; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'nota', label: 'Nota', icon: <FileText className="w-4 h-4" />, color: 'bg-blue-50 border-blue-200' },
  { value: 'acuerdo', label: 'Acuerdo', icon: <Handshake className="w-4 h-4" />, color: 'bg-green-50 border-green-200' },
  { value: 'recordatorio', label: 'Recordatorio', icon: <Bell className="w-4 h-4" />, color: 'bg-orange-50 border-orange-200' },
];

export const NotasRecordatorios: React.FC<NotasRecordatoriosProps> = ({
  dietaId,
  notasRecordatorios,
  onGuardar,
  onEliminar,
  onCompletar,
}) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [notaEditando, setNotaEditando] = useState<NotaRecordatorio | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<TipoNotaRecordatorio | 'todos'>('todos');
  const [filtroCompletado, setFiltroCompletado] = useState<'todos' | 'pendientes' | 'completados'>('pendientes');
  const [filtroEtiqueta, setFiltroEtiqueta] = useState<EtiquetaRecordatorio | 'todas'>('todas');

  // Estados del formulario
  const [tipo, setTipo] = useState<TipoNotaRecordatorio>('nota');
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [etiquetas, setEtiquetas] = useState<EtiquetaRecordatorio[]>([]);
  const [prioridad, setPrioridad] = useState<'alta' | 'media' | 'baja'>('media');
  const [fechaRecordatorio, setFechaRecordatorio] = useState('');

  useEffect(() => {
    if (notaEditando) {
      setTipo(notaEditando.tipo);
      setTitulo(notaEditando.titulo);
      setContenido(notaEditando.contenido);
      setEtiquetas(notaEditando.etiquetas);
      setPrioridad(notaEditando.prioridad || 'media');
      setFechaRecordatorio(notaEditando.fechaRecordatorio || '');
    } else {
      resetFormulario();
    }
  }, [notaEditando]);

  const resetFormulario = () => {
    setTipo('nota');
    setTitulo('');
    setContenido('');
    setEtiquetas([]);
    setPrioridad('media');
    setFechaRecordatorio('');
  };

  const handleAbrirNuevo = () => {
    setNotaEditando(null);
    resetFormulario();
    setMostrarModal(true);
  };

  const handleEditar = (nota: NotaRecordatorio) => {
    setNotaEditando(nota);
    setMostrarModal(true);
  };

  const handleGuardar = () => {
    if (!titulo.trim() || !contenido.trim()) {
      return;
    }

    const nota: NotaRecordatorio = {
      id: notaEditando?.id || `nota-${Date.now()}`,
      dietaId,
      tipo,
      titulo: titulo.trim(),
      contenido: contenido.trim(),
      etiquetas,
      fechaCreacion: notaEditando?.fechaCreacion || new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      creadoPor: 'current-user', // En producción, obtener del contexto de autenticación
      completado: notaEditando?.completado || false,
      fechaCompletado: notaEditando?.fechaCompletado,
      prioridad,
      fechaRecordatorio: fechaRecordatorio || undefined,
    };

    onGuardar(nota);
    setMostrarModal(false);
    setNotaEditando(null);
    resetFormulario();
  };

  const handleToggleEtiqueta = (etiqueta: EtiquetaRecordatorio) => {
    if (etiquetas.includes(etiqueta)) {
      setEtiquetas(etiquetas.filter(e => e !== etiqueta));
    } else {
      setEtiquetas([...etiquetas, etiqueta]);
    }
  };

  const notasFiltradas = notasRecordatorios.filter(nota => {
    if (filtroTipo !== 'todos' && nota.tipo !== filtroTipo) return false;
    if (filtroCompletado === 'pendientes' && nota.completado) return false;
    if (filtroCompletado === 'completados' && !nota.completado) return false;
    if (filtroEtiqueta !== 'todas' && !nota.etiquetas.includes(filtroEtiqueta)) return false;
    return true;
  });

  const getTipoInfo = (tipo: TipoNotaRecordatorio) => {
    return tiposNota.find(t => t.value === tipo) || tiposNota[0];
  };

  const getPrioridadColor = (prioridad?: 'alta' | 'media' | 'baja') => {
    switch (prioridad) {
      case 'alta':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'baja':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const notasPendientes = notasRecordatorios.filter(n => !n.completado).length;
  const recordatoriosProximos = notasRecordatorios.filter(n => 
    n.tipo === 'recordatorio' && 
    !n.completado && 
    n.fechaRecordatorio && 
    new Date(n.fechaRecordatorio) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="space-y-4">
      {/* Header con estadísticas y botón de añadir */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Notas y Recordatorios</h3>
          </div>
          {notasPendientes > 0 && (
            <Badge className="bg-orange-100 text-orange-700">
              {notasPendientes} pendiente{notasPendientes !== 1 ? 's' : ''}
            </Badge>
          )}
          {recordatoriosProximos > 0 && (
            <Badge className="bg-red-100 text-red-700">
              {recordatoriosProximos} recordatorio{recordatoriosProximos !== 1 ? 's' : ''} próximos
            </Badge>
          )}
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleAbrirNuevo}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Nueva Nota
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Filtros:</span>
        </div>
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value as TipoNotaRecordatorio | 'todos')}
          className="text-sm border border-gray-300 rounded px-2 py-1"
        >
          <option value="todos">Todos los tipos</option>
          {tiposNota.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <select
          value={filtroCompletado}
          onChange={(e) => setFiltroCompletado(e.target.value as 'todos' | 'pendientes' | 'completados')}
          className="text-sm border border-gray-300 rounded px-2 py-1"
        >
          <option value="pendientes">Pendientes</option>
          <option value="completados">Completados</option>
          <option value="todos">Todos</option>
        </select>
        <select
          value={filtroEtiqueta}
          onChange={(e) => setFiltroEtiqueta(e.target.value as EtiquetaRecordatorio | 'todas')}
          className="text-sm border border-gray-300 rounded px-2 py-1"
        >
          <option value="todas">Todas las etiquetas</option>
          {etiquetasDisponibles.map(e => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>
      </div>

      {/* Lista de notas */}
      {notasFiltradas.length === 0 ? (
        <Card className="p-8 text-center">
          <StickyNote className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">
            {notasRecordatorios.length === 0 
              ? 'No hay notas, acuerdos o recordatorios. Crea uno para tener contexto cuando vuelvas al editor.'
              : 'No hay notas que coincidan con los filtros seleccionados.'}
          </p>
          {notasRecordatorios.length === 0 && (
            <Button variant="primary" size="sm" onClick={handleAbrirNuevo}>
              Crear primera nota
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {notasFiltradas.map(nota => {
            const tipoInfo = getTipoInfo(nota.tipo);
            const esRecordatorioProximo = nota.tipo === 'recordatorio' && 
              !nota.completado && 
              nota.fechaRecordatorio && 
              new Date(nota.fechaRecordatorio) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

            return (
              <Card
                key={nota.id}
                className={`${tipoInfo.color} border ${nota.completado ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-2">
                      <button
                        onClick={() => onCompletar(nota.id)}
                        className="flex-shrink-0 mt-0.5"
                      >
                        {nota.completado ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400 hover:text-green-600" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {tipoInfo.icon}
                          <h4 className={`font-semibold text-sm ${nota.completado ? 'line-through' : ''}`}>
                            {nota.titulo}
                          </h4>
                          {nota.prioridad && (
                            <Badge className={`${getPrioridadColor(nota.prioridad)} text-xs`}>
                              {nota.prioridad}
                            </Badge>
                          )}
                          {esRecordatorioProximo && (
                            <Badge className="bg-red-100 text-red-700 text-xs flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Próximo
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-2 whitespace-pre-wrap">
                          {nota.contenido}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {nota.etiquetas.map(etiqueta => {
                            const etiquetaInfo = etiquetasDisponibles.find(e => e.value === etiqueta);
                            return (
                              <Badge
                                key={etiqueta}
                                className={`${etiquetaInfo?.color || 'bg-gray-100 text-gray-700'} text-xs`}
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {etiquetaInfo?.label || etiqueta}
                              </Badge>
                            );
                          })}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {nota.fechaRecordatorio && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(nota.fechaRecordatorio).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          )}
                          <span>
                            {new Date(nota.fechaActualizacion).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditar(nota)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEliminar(nota.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal para crear/editar nota */}
      <Modal
        isOpen={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          setNotaEditando(null);
          resetFormulario();
        }}
        title={notaEditando ? 'Editar Nota' : 'Nueva Nota'}
        size="lg"
      >
        <div className="space-y-4">
          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <div className="grid grid-cols-3 gap-2">
              {tiposNota.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTipo(t.value)}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 ${
                    tipo === t.value
                      ? `${t.color} border-indigo-500`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {t.icon}
                  <span className="text-xs font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Revisar suplementación del cliente"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          {/* Contenido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contenido *
            </label>
            <textarea
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Describe la nota, acuerdo o recordatorio..."
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none"
            />
          </div>

          {/* Etiquetas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiquetas
            </label>
            <div className="flex flex-wrap gap-2">
              {etiquetasDisponibles.map(etiqueta => (
                <button
                  key={etiqueta.value}
                  type="button"
                  onClick={() => handleToggleEtiqueta(etiqueta.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    etiquetas.includes(etiqueta.value)
                      ? `${etiqueta.color} border-current`
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <Tag className="w-3 h-3 inline mr-1" />
                  {etiqueta.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prioridad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioridad
            </label>
            <div className="flex gap-2">
              {(['alta', 'media', 'baja'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPrioridad(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border-2 ${
                    prioridad === p
                      ? `${getPrioridadColor(p)} border-current`
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Fecha recordatorio (solo para recordatorios) */}
          {tipo === 'recordatorio' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha y hora del recordatorio
              </label>
              <input
                type="datetime-local"
                value={fechaRecordatorio}
                onChange={(e) => setFechaRecordatorio(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => {
                setMostrarModal(false);
                setNotaEditando(null);
                resetFormulario();
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleGuardar}
              disabled={!titulo.trim() || !contenido.trim()}
            >
              {notaEditando ? 'Guardar cambios' : 'Crear nota'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

