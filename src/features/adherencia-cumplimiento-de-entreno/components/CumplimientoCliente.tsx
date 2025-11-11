import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Select, Button, Textarea, Modal } from '../../../components/componentsreutilizables';
import { CheckCircle, XCircle, Clock, TrendingUp, Calendar, Filter, Plus, FileText, Edit2, Trash2 } from 'lucide-react';
import type { SelectOption } from '../../../components/componentsreutilizables';
import { getNotasPorCliente, crearNota, eliminarNota, actualizarNota, type NotaCumplimiento } from '../api/notas';

export const CumplimientoCliente: React.FC = () => {
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>('todos');
  const [notas, setNotas] = useState<NotaCumplimiento[]>([]);
  const [mostrarModalNota, setMostrarModalNota] = useState(false);
  const [notaEditando, setNotaEditando] = useState<NotaCumplimiento | null>(null);
  const [nuevaNota, setNuevaNota] = useState({
    tipo: 'nota-rapida' as 'nota-rapida' | 'compromiso' | 'observacion',
    titulo: '',
    contenido: '',
  });
  const [cargandoNotas, setCargandoNotas] = useState(false);

  const estados: SelectOption[] = [
    { value: 'todos', label: 'Todos los estados' },
    { value: 'completada', label: 'Completadas' },
    { value: 'no-completada', label: 'No completadas' },
    { value: 'pendiente', label: 'Pendientes' },
  ];

  const clientes: SelectOption[] = [
    { value: 'todos', label: 'Todos los clientes' },
    { value: 'maria', label: 'María Pérez' },
    { value: 'carlos', label: 'Carlos Ruiz' },
    { value: 'ana', label: 'Ana Martínez' },
    { value: 'luis', label: 'Luis García' },
    { value: 'sofia', label: 'Sofia López' },
  ];

  // Cargar notas cuando se selecciona un cliente
  useEffect(() => {
    if (clienteSeleccionado && clienteSeleccionado !== 'todos') {
      cargarNotas(clienteSeleccionado);
    } else {
      setNotas([]);
    }
  }, [clienteSeleccionado]);

  const cargarNotas = async (clienteId: string) => {
    setCargandoNotas(true);
    try {
      const notasCliente = await getNotasPorCliente(clienteId);
      setNotas(notasCliente);
    } catch (error) {
      console.error('Error al cargar notas:', error);
    } finally {
      setCargandoNotas(false);
    }
  };

  const handleGuardarNota = async () => {
    if (!nuevaNota.contenido.trim() || clienteSeleccionado === 'todos') {
      alert('Por favor, selecciona un cliente y escribe el contenido de la nota.');
      return;
    }

    try {
      const cliente = clientes.find(c => c.value === clienteSeleccionado);
      if (!cliente) return;

      if (notaEditando) {
        // Actualizar nota existente
        await actualizarNota(notaEditando.id, {
          tipo: nuevaNota.tipo,
          titulo: nuevaNota.titulo || undefined,
          contenido: nuevaNota.contenido,
          clienteId: clienteSeleccionado,
          clienteNombre: cliente.label,
        });
      } else {
        // Crear nueva nota
        await crearNota({
          tipo: nuevaNota.tipo,
          titulo: nuevaNota.titulo || undefined,
          contenido: nuevaNota.contenido,
          clienteId: clienteSeleccionado,
          clienteNombre: cliente.label,
        });
      }

      // Recargar notas
      await cargarNotas(clienteSeleccionado);
      
      // Limpiar formulario
      setNuevaNota({ tipo: 'nota-rapida', titulo: '', contenido: '' });
      setNotaEditando(null);
      setMostrarModalNota(false);
    } catch (error) {
      console.error('Error al guardar nota:', error);
      alert('Error al guardar la nota. Por favor, inténtalo de nuevo.');
    }
  };

  const handleEliminarNota = async (notaId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      return;
    }

    try {
      await eliminarNota(notaId);
      await cargarNotas(clienteSeleccionado);
    } catch (error) {
      console.error('Error al eliminar nota:', error);
      alert('Error al eliminar la nota. Por favor, inténtalo de nuevo.');
    }
  };

  const handleEditarNota = (nota: NotaCumplimiento) => {
    setNotaEditando(nota);
    setNuevaNota({
      tipo: nota.tipo,
      titulo: nota.titulo || '',
      contenido: nota.contenido,
    });
    setMostrarModalNota(true);
  };

  const handleNuevaNota = () => {
    if (clienteSeleccionado === 'todos') {
      alert('Por favor, selecciona un cliente primero para agregar una nota.');
      return;
    }
    setNotaEditando(null);
    setNuevaNota({ tipo: 'nota-rapida', titulo: '', contenido: '' });
    setMostrarModalNota(true);
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'compromiso':
        return <Badge variant="blue">Compromiso</Badge>;
      case 'observacion':
        return <Badge variant="yellow">Observación</Badge>;
      default:
        return <Badge variant="gray">Nota Rápida</Badge>;
    }
  };

  const todasLasSesiones = [
    { id: 1, cliente: 'María Pérez', fecha: '2025-01-15', sesion: 'Fuerza Tren Superior', estado: 'Completada', duracion: '55 min', observaciones: 'Excelente progreso' },
    { id: 2, cliente: 'María Pérez', fecha: '2025-01-17', sesion: 'Cardio HIIT', estado: 'Completada', duracion: '45 min', observaciones: '-' },
    { id: 3, cliente: 'Carlos Ruiz', fecha: '2025-01-15', sesion: 'Full Body Strength', estado: 'Completada', duracion: '60 min', observaciones: 'Personal record' },
    { id: 4, cliente: 'Ana Martínez', fecha: '2025-01-16', sesion: 'Yoga Flow', estado: 'No completada', duracion: '-', observaciones: 'Cliente enfermo' },
    { id: 5, cliente: 'Ana Martínez', fecha: '2025-01-18', sesion: 'Core & Flexibilidad', estado: 'Completada', duracion: '50 min', observaciones: 'Buena forma' },
    { id: 6, cliente: 'Luis García', fecha: '2025-01-15', sesion: 'Spinning Intensivo', estado: 'No completada', duracion: '-', observaciones: 'Sin justificación' },
    { id: 7, cliente: 'Luis García', fecha: '2025-01-17', sesion: 'Pesas Tren Inferior', estado: 'Completada', duracion: '48 min', observaciones: 'Dolor leve' },
    { id: 8, cliente: 'Sofia López', fecha: '2025-01-16', sesion: 'Pilates Mat', estado: 'Completada', duracion: '40 min', observaciones: '-' },
    { id: 9, cliente: 'Diego Fernández', fecha: '2025-01-15', sesion: 'Cross Training', estado: 'Completada', duracion: '55 min', observaciones: 'Muy motivado' },
    { id: 10, cliente: 'Diego Fernández', fecha: '2025-01-18', sesion: 'Boxeo Funcional', estado: 'Completada', duracion: '50 min', observaciones: 'Excelente técnica' },
    { id: 11, cliente: 'Elena Sánchez', fecha: '2025-01-16', sesion: 'Stretching', estado: 'Pendiente', duracion: '-', observaciones: 'Programada' },
    { id: 12, cliente: 'Roberto Martín', fecha: '2025-01-17', sesion: 'TRX Training', estado: 'Completada', duracion: '45 min', observaciones: '-' },
    { id: 13, cliente: 'Roberto Martín', fecha: '2025-01-18', sesion: 'Functional Movement', estado: 'Completada', duracion: '52 min', observaciones: 'Mejora notable' },
    { id: 14, cliente: 'Laura Torres', fecha: '2025-01-15', sesion: 'Body Pump', estado: 'No completada', duracion: '-', observaciones: 'Cancelación de último minuto' },
    { id: 15, cliente: 'Miguel Vargas', fecha: '2025-01-16', sesion: 'Circuit Training', estado: 'Completada', duracion: '48 min', observaciones: '-' },
    { id: 16, cliente: 'Miguel Vargas', fecha: '2025-01-18', sesion: 'Athletic Conditioning', estado: 'Pendiente', duracion: '-', observaciones: 'Programada' },
  ];

  const sesionesFiltradas = todasLasSesiones.filter(sesion => {
    const estadoMatch = filtroEstado === 'todos' || 
      (filtroEstado === 'completada' && sesion.estado === 'Completada') ||
      (filtroEstado === 'no-completada' && sesion.estado === 'No completada') ||
      (filtroEstado === 'pendiente' && sesion.estado === 'Pendiente');
    
    const clienteMatch = clienteSeleccionado === 'todos' || 
      sesion.cliente.toLowerCase().includes(clienteSeleccionado);
    
    return estadoMatch && clienteMatch;
  });

  const resumen = {
    total: todasLasSesiones.length,
    completadas: todasLasSesiones.filter(s => s.estado === 'Completada').length,
    noCompletadas: todasLasSesiones.filter(s => s.estado === 'No completada').length,
    pendientes: todasLasSesiones.filter(s => s.estado === 'Pendiente').length,
    tasaCumplimiento: Math.round((todasLasSesiones.filter(s => s.estado === 'Completada').length / todasLasSesiones.length) * 100),
  };

  const columns = [
    { key: 'cliente', label: 'Cliente' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'sesion', label: 'Sesión' },
    { key: 'duracion', label: 'Duración' },
    { key: 'estado', label: 'Estado' },
    { key: 'observaciones', label: 'Observaciones' },
  ];

  const data = sesionesFiltradas.map(sesion => ({
    ...sesion,
    estado: sesion.estado === 'Completada'
      ? <Badge variant="green"><CheckCircle size={14} className="mr-1" />Completada</Badge>
      : sesion.estado === 'No completada'
      ? <Badge variant="red"><XCircle size={14} className="mr-1" />No Completada</Badge>
      : <Badge variant="yellow"><Clock size={14} className="mr-1" />Pendiente</Badge>
  }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Cumplimiento del Cliente</h3>
        <p className="text-sm text-gray-600 mt-2">
          Detalle completo de sesiones programadas vs completadas por cliente
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm p-4 border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-blue-600" size={20} />
            <span className="text-sm text-gray-600">Total</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{resumen.total}</div>
        </Card>
        <Card className="bg-white shadow-sm p-4 border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="text-green-600" size={20} />
            <span className="text-sm text-gray-600">Completadas</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{resumen.completadas}</div>
        </Card>
        <Card className="bg-white shadow-sm p-4 border-l-4 border-red-500">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="text-red-600" size={20} />
            <span className="text-sm text-gray-600">No Completadas</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{resumen.noCompletadas}</div>
        </Card>
        <Card className="bg-white shadow-sm p-4 border-l-4 border-yellow-500">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-yellow-600" size={20} />
            <span className="text-sm text-gray-600">Tasa Cumplimiento</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{resumen.tasaCumplimiento}%</div>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Filter size={20} className="text-gray-600" />
        <Select
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          options={estados}
          className="w-48"
        />
        <Select
          value={clienteSeleccionado}
          onChange={e => setClienteSeleccionado(e.target.value)}
          options={clientes}
          className="w-56"
        />
        <span className="text-sm text-gray-600">
          Mostrando {data.length} de {resumen.total} sesiones
        </span>
      </div>

      <Card className="bg-white shadow-sm p-6">
        <Table columns={columns} data={data} />
      </Card>

      {/* Sección de Notas y Compromisos */}
      {clienteSeleccionado !== 'todos' && (
        <Card className="bg-white shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText size={20} className="text-blue-600" />
                Notas y Compromisos
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Historial cualitativo de seguimiento para {clientes.find(c => c.value === clienteSeleccionado)?.label}
              </p>
            </div>
            <Button variant="primary" onClick={handleNuevaNota}>
              <Plus size={16} className="mr-2" />
              Nueva Nota
            </Button>
          </div>

          {cargandoNotas ? (
            <div className="text-center py-8 text-gray-500">Cargando notas...</div>
          ) : notas.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FileText className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-600 text-sm">No hay notas registradas para este cliente.</p>
              <p className="text-gray-500 text-xs mt-1">Agrega una nota para mantener un historial cualitativo.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notas.map(nota => (
                <div
                  key={nota.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTipoBadge(nota.tipo)}
                      <span className="text-xs text-gray-500">
                        {new Date(nota.fecha).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditarNota(nota)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Editar nota"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleEliminarNota(nota.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Eliminar nota"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {nota.titulo && (
                    <h4 className="font-semibold text-gray-900 mb-1">{nota.titulo}</h4>
                  )}
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{nota.contenido}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Modal para crear/editar nota */}
      <Modal
        isOpen={mostrarModalNota}
        onClose={() => {
          setMostrarModalNota(false);
          setNotaEditando(null);
          setNuevaNota({ tipo: 'nota-rapida', titulo: '', contenido: '' });
        }}
        title={notaEditando ? 'Editar Nota' : 'Nueva Nota o Compromiso'}
        size="md"
        footer={
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModalNota(false);
                setNotaEditando(null);
                setNuevaNota({ tipo: 'nota-rapida', titulo: '', contenido: '' });
              }}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleGuardarNota}>
              {notaEditando ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <Select
              value={nuevaNota.tipo}
              onChange={(e) => setNuevaNota({ ...nuevaNota, tipo: e.target.value as any })}
              options={[
                { value: 'nota-rapida', label: 'Nota Rápida' },
                { value: 'compromiso', label: 'Compromiso' },
                { value: 'observacion', label: 'Observación' },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título (opcional)
            </label>
            <input
              type="text"
              value={nuevaNota.titulo}
              onChange={(e) => setNuevaNota({ ...nuevaNota, titulo: e.target.value })}
              placeholder="Ej: Compromiso de asistencia, Observación sobre progreso..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={nuevaNota.contenido}
              onChange={(e) => setNuevaNota({ ...nuevaNota, contenido: e.target.value })}
              placeholder="Escribe la nota, compromiso o observación..."
              rows={6}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Tip:</strong> Las notas se guardan junto a los datos cuantitativos de adherencia para mantener un historial completo del seguimiento del cliente.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};


