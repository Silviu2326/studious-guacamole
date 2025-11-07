import React, { useState, useEffect } from 'react';
import { CalendarX, Plus, Trash2 } from 'lucide-react';
import { Card, Button, Input, Select, Modal } from '../../../components/componentsreutilizables';
import { BloqueoAgenda } from '../types';
import { getBloqueos, crearBloqueo } from '../api/disponibilidad';

export const BloqueosAgenda: React.FC = () => {
  const [bloqueos, setBloqueos] = useState<BloqueoAgenda[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoBloqueo, setNuevoBloqueo] = useState<Partial<BloqueoAgenda>>({
    titulo: '',
    tipo: 'vacaciones',
    fechaInicio: new Date(),
    fechaFin: new Date(),
    recurrente: false,
  });

  useEffect(() => {
    cargarBloqueos();
  }, []);

  const cargarBloqueos = async () => {
    setLoading(true);
    const inicio = new Date();
    const fin = new Date();
    fin.setMonth(fin.getMonth() + 3);
    const bloqueosData = await getBloqueos(inicio, fin);
    setBloqueos(bloqueosData);
    setLoading(false);
  };

  const tiposBloqueo = [
    { value: 'vacaciones', label: 'Vacaciones' },
    { value: 'mantenimiento', label: 'Mantenimiento' },
    { value: 'feriado', label: 'Feriado' },
    { value: 'otro', label: 'Otro' },
  ];

  const agregarBloqueo = async () => {
    if (nuevoBloqueo.titulo && nuevoBloqueo.fechaInicio && nuevoBloqueo.fechaFin) {
      const bloqueo = await crearBloqueo(nuevoBloqueo as Omit<BloqueoAgenda, 'id'>);
      setBloqueos([...bloqueos, bloqueo]);
      setMostrarModal(false);
      setNuevoBloqueo({
        titulo: '',
        tipo: 'vacaciones',
        fechaInicio: new Date(),
        fechaFin: new Date(),
        recurrente: false,
      });
    }
  };

  const eliminarBloqueo = (id: string) => {
    setBloqueos(bloqueos.filter(b => b.id !== id));
  };

  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Bloqueos de Agenda
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Gestiona días libres, vacaciones y mantenimiento
          </p>
        </div>
        <Button onClick={() => setMostrarModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Bloqueo
        </Button>
      </div>

      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="space-y-4">
            {bloqueos.length === 0 ? (
              <div className="text-center py-8">
                <CalendarX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No hay bloqueos configurados
                </p>
              </div>
            ) : (
              bloqueos.map((bloqueo) => (
                <div
                  key={bloqueo.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <CalendarX className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {bloqueo.titulo}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatearFecha(bloqueo.fechaInicio)} - {formatearFecha(bloqueo.fechaFin)}
                      </div>
                      {bloqueo.descripcion && (
                        <p className="text-sm text-gray-500 mt-1">
                          {bloqueo.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-lg text-sm font-medium bg-orange-100 text-orange-700">
                      {bloqueo.tipo}
                    </span>
                    {bloqueo.recurrente && (
                      <span className="px-3 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-700">
                        Recurrente
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => eliminarBloqueo(bloqueo.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>

      <Modal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        title="Agregar Bloqueo"
        footer={
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={() => setMostrarModal(false)}>
              Cancelar
            </Button>
            <Button onClick={agregarBloqueo}>
              Agregar
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Título"
            value={nuevoBloqueo.titulo}
            onChange={(e) => setNuevoBloqueo({ ...nuevoBloqueo, titulo: e.target.value })}
          />
          <Select
            label="Tipo de Bloqueo"
            options={tiposBloqueo}
            value={nuevoBloqueo.tipo}
            onChange={(e) => setNuevoBloqueo({ ...nuevoBloqueo, tipo: e.target.value as any })}
          />
          <Input
            label="Fecha de Inicio"
            type="date"
            value={nuevoBloqueo.fechaInicio instanceof Date ? nuevoBloqueo.fechaInicio.toISOString().split('T')[0] : ''}
            onChange={(e) => setNuevoBloqueo({ ...nuevoBloqueo, fechaInicio: new Date(e.target.value) })}
          />
          <Input
            label="Fecha de Fin"
            type="date"
            value={nuevoBloqueo.fechaFin instanceof Date ? nuevoBloqueo.fechaFin.toISOString().split('T')[0] : ''}
            onChange={(e) => setNuevoBloqueo({ ...nuevoBloqueo, fechaFin: new Date(e.target.value) })}
          />
        </div>
      </Modal>
    </div>
  );
};
