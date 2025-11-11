import React, { useState, useEffect } from 'react';
import { CalendarX, Plus, Trash2, Edit2, Clock } from 'lucide-react';
import { Card, Button, Input, Select, Modal, Textarea } from '../../../components/componentsreutilizables';
import { BloqueoAgenda } from '../types';
import { getBloqueos, crearBloqueo, actualizarBloqueo, eliminarBloqueo } from '../api/disponibilidad';

export const BloqueosAgenda: React.FC = () => {
  const [bloqueos, setBloqueos] = useState<BloqueoAgenda[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [bloqueoEditando, setBloqueoEditando] = useState<BloqueoAgenda | null>(null);
  const [nuevoBloqueo, setNuevoBloqueo] = useState<Partial<BloqueoAgenda>>({
    titulo: '',
    tipo: 'vacaciones',
    fechaInicio: new Date(),
    fechaFin: new Date(),
    recurrente: false,
    bloqueoCompleto: true,
    motivo: '',
  });

  useEffect(() => {
    cargarBloqueos();
  }, []);

  const cargarBloqueos = async () => {
    setLoading(true);
    const inicio = new Date();
    const fin = new Date();
    fin.setMonth(fin.getMonth() + 6); // Cargar bloqueos futuros (6 meses)
    const bloqueosData = await getBloqueos(inicio, fin);
    // Filtrar solo bloqueos futuros
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const bloqueosFuturos = bloqueosData.filter(b => {
      const fechaFin = new Date(b.fechaFin);
      fechaFin.setHours(23, 59, 59, 999);
      return fechaFin >= hoy;
    });
    setBloqueos(bloqueosFuturos.sort((a, b) => 
      new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
    ));
    setLoading(false);
  };

  const tiposBloqueo = [
    { value: 'vacaciones', label: 'Vacaciones' },
    { value: 'mantenimiento', label: 'Mantenimiento' },
    { value: 'feriado', label: 'Feriado' },
    { value: 'otro', label: 'Otro' },
  ];

  const abrirModalCrear = () => {
    setBloqueoEditando(null);
    setNuevoBloqueo({
      titulo: '',
      tipo: 'vacaciones',
      fechaInicio: new Date(),
      fechaFin: new Date(),
      recurrente: false,
      bloqueoCompleto: true,
      motivo: '',
    });
    setMostrarModal(true);
  };

  const abrirModalEditar = (bloqueo: BloqueoAgenda) => {
    setBloqueoEditando(bloqueo);
    setNuevoBloqueo({
      titulo: bloqueo.titulo,
      tipo: bloqueo.tipo,
      fechaInicio: bloqueo.fechaInicio,
      fechaFin: bloqueo.fechaFin,
      recurrente: bloqueo.recurrente,
      bloqueoCompleto: bloqueo.bloqueoCompleto,
      horaInicio: bloqueo.horaInicio,
      horaFin: bloqueo.horaFin,
      motivo: bloqueo.motivo,
      descripcion: bloqueo.descripcion,
    });
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setBloqueoEditando(null);
    setNuevoBloqueo({
      titulo: '',
      tipo: 'vacaciones',
      fechaInicio: new Date(),
      fechaFin: new Date(),
      recurrente: false,
      bloqueoCompleto: true,
      motivo: '',
    });
  };

  const guardarBloqueo = async () => {
    if (!nuevoBloqueo.titulo || !nuevoBloqueo.fechaInicio || !nuevoBloqueo.fechaFin) {
      return;
    }

    // Validar que si es bloqueo parcial, tenga horas
    if (!nuevoBloqueo.bloqueoCompleto && (!nuevoBloqueo.horaInicio || !nuevoBloqueo.horaFin)) {
      return;
    }

    // Ajustar fechas para bloqueos completos (inicio a las 00:00, fin a las 23:59)
    let fechaInicio = new Date(nuevoBloqueo.fechaInicio);
    let fechaFin = new Date(nuevoBloqueo.fechaFin);

    if (nuevoBloqueo.bloqueoCompleto) {
      fechaInicio.setHours(0, 0, 0, 0);
      fechaFin.setHours(23, 59, 59, 999);
    } else {
      // Para bloqueos parciales, combinar fecha con hora
      const [horaInicio, minutoInicio] = nuevoBloqueo.horaInicio!.split(':').map(Number);
      const [horaFin, minutoFin] = nuevoBloqueo.horaFin!.split(':').map(Number);
      fechaInicio.setHours(horaInicio, minutoInicio, 0, 0);
      fechaFin.setHours(horaFin, minutoFin, 0, 0);
    }

    if (bloqueoEditando) {
      // Actualizar bloqueo existente
      const bloqueoActualizado = await actualizarBloqueo(bloqueoEditando.id, {
        ...nuevoBloqueo,
        fechaInicio,
        fechaFin,
      });
      setBloqueos(bloqueos.map(b => b.id === bloqueoEditando.id ? bloqueoActualizado : b));
    } else {
      // Crear nuevo bloqueo
      const bloqueo = await crearBloqueo({
        ...nuevoBloqueo,
        fechaInicio,
        fechaFin,
      } as Omit<BloqueoAgenda, 'id'>);
      setBloqueos([...bloqueos, bloqueo]);
    }
    cerrarModal();
    cargarBloqueos(); // Recargar para asegurar sincronización
  };

  const handleEliminarBloqueo = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este bloqueo?')) {
      await eliminarBloqueo(id);
      setBloqueos(bloqueos.filter(b => b.id !== id));
    }
  };

  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatearFechaHora = (bloqueo: BloqueoAgenda) => {
    if (bloqueo.bloqueoCompleto) {
      const inicio = formatearFecha(bloqueo.fechaInicio);
      const fin = formatearFecha(bloqueo.fechaFin);
      if (inicio === fin) {
        return inicio;
      }
      return `${inicio} - ${fin}`;
    } else {
      const fecha = formatearFecha(bloqueo.fechaInicio);
      return `${fecha} (${bloqueo.horaInicio} - ${bloqueo.horaFin})`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Bloqueos de Agenda
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Bloquea días completos o rangos de horas para evitar agendamiento
          </p>
        </div>
        <Button onClick={abrirModalCrear}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Bloqueo
        </Button>
      </div>

      <Card className="bg-white shadow-sm">
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando bloqueos...</p>
            </div>
          ) : bloqueos.length === 0 ? (
            <div className="text-center py-8">
              <CalendarX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No hay bloqueos futuros configurados
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bloqueos.map((bloqueo) => (
                <div
                  key={bloqueo.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <CalendarX className={`w-5 h-5 ${
                      bloqueo.bloqueoCompleto ? 'text-red-600' : 'text-orange-600'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-semibold text-gray-900">
                          {bloqueo.titulo}
                        </div>
                        {!bloqueo.bloqueoCompleto && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700">
                            <Clock className="w-3 h-3" />
                            Parcial
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {formatearFechaHora(bloqueo)}
                      </div>
                      {bloqueo.motivo && (
                        <p className="text-sm text-gray-500 mt-1">
                          <strong>Motivo:</strong> {bloqueo.motivo}
                        </p>
                      )}
                      {bloqueo.descripcion && (
                        <p className="text-sm text-gray-500 mt-1">
                          {bloqueo.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-700">
                      {tiposBloqueo.find(t => t.value === bloqueo.tipo)?.label || bloqueo.tipo}
                    </span>
                    {bloqueo.recurrente && (
                      <span className="px-3 py-1 rounded-lg text-sm font-medium bg-purple-100 text-purple-700">
                        Recurrente
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => abrirModalEditar(bloqueo)}
                      title="Editar bloqueo"
                    >
                      <Edit2 className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEliminarBloqueo(bloqueo.id)}
                      title="Eliminar bloqueo"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Modal
        isOpen={mostrarModal}
        onClose={cerrarModal}
        title={bloqueoEditando ? "Editar Bloqueo" : "Agregar Bloqueo"}
        footer={
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={cerrarModal}>
              Cancelar
            </Button>
            <Button onClick={guardarBloqueo}>
              {bloqueoEditando ? "Guardar Cambios" : "Agregar"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Título *"
            value={nuevoBloqueo.titulo || ''}
            onChange={(e) => setNuevoBloqueo({ ...nuevoBloqueo, titulo: e.target.value })}
            placeholder="Ej: Vacaciones, Mantenimiento, etc."
          />
          
          <Select
            label="Tipo de Bloqueo"
            options={tiposBloqueo}
            value={nuevoBloqueo.tipo || 'vacaciones'}
            onChange={(e) => setNuevoBloqueo({ ...nuevoBloqueo, tipo: e.target.value as any })}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Tipo de bloqueo
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="bloqueoCompleto"
                  checked={nuevoBloqueo.bloqueoCompleto === true}
                  onChange={() => setNuevoBloqueo({ ...nuevoBloqueo, bloqueoCompleto: true })}
                  className="mr-2"
                />
                Día completo
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="bloqueoCompleto"
                  checked={nuevoBloqueo.bloqueoCompleto === false}
                  onChange={() => setNuevoBloqueo({ ...nuevoBloqueo, bloqueoCompleto: false })}
                  className="mr-2"
                />
                Rango de horas
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fecha de Inicio *"
              type="date"
              value={nuevoBloqueo.fechaInicio instanceof Date ? nuevoBloqueo.fechaInicio.toISOString().split('T')[0] : ''}
              onChange={(e) => setNuevoBloqueo({ ...nuevoBloqueo, fechaInicio: new Date(e.target.value) })}
            />
            <Input
              label="Fecha de Fin *"
              type="date"
              value={nuevoBloqueo.fechaFin instanceof Date ? nuevoBloqueo.fechaFin.toISOString().split('T')[0] : ''}
              onChange={(e) => setNuevoBloqueo({ ...nuevoBloqueo, fechaFin: new Date(e.target.value) })}
            />
          </div>

          {!nuevoBloqueo.bloqueoCompleto && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Hora de Inicio *"
                type="time"
                value={nuevoBloqueo.horaInicio || ''}
                onChange={(e) => setNuevoBloqueo({ ...nuevoBloqueo, horaInicio: e.target.value })}
              />
              <Input
                label="Hora de Fin *"
                type="time"
                value={nuevoBloqueo.horaFin || ''}
                onChange={(e) => setNuevoBloqueo({ ...nuevoBloqueo, horaFin: e.target.value })}
              />
            </div>
          )}

          <Textarea
            label="Motivo del bloqueo (opcional)"
            value={nuevoBloqueo.motivo || ''}
            onChange={(e) => setNuevoBloqueo({ ...nuevoBloqueo, motivo: e.target.value })}
            placeholder="Ej: Vacaciones personales, Mantenimiento del gimnasio, etc."
            rows={2}
          />

          <Textarea
            label="Descripción (opcional)"
            value={nuevoBloqueo.descripcion || ''}
            onChange={(e) => setNuevoBloqueo({ ...nuevoBloqueo, descripcion: e.target.value })}
            placeholder="Información adicional sobre el bloqueo"
            rows={2}
          />
        </div>
      </Modal>
    </div>
  );
};
