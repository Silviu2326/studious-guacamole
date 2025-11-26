import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Modal, Input, Select } from '../../../components/componentsreutilizables';
import { AsignacionTurno, Turno } from '../types';
import { getTurnos, createTurno } from '../api/turnos';
import { getPersonal } from '../api/personal';
import { Plus, CheckCircle, XCircle, Clock, User } from 'lucide-react';

export const AsignacionTurnos: React.FC = () => {
  const [asignaciones, setAsignaciones] = useState<AsignacionTurno[]>([]);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [personal, setPersonal] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Turno>>({
    personalId: '',
    fecha: '',
    tipo: 'mañana',
    horaInicio: '',
    horaFin: '',
    estado: 'asignado',
    notas: '',
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [turnosData, personalData] = await Promise.all([
        getTurnos(),
        getPersonal(),
      ]);
      setTurnos(turnosData);
      setPersonal(personalData);
      
      // Generar asignaciones desde turnos
      const asignacionesData: AsignacionTurno[] = turnosData.map(turno => ({
        id: `asig-${turno.id}`,
        turnoId: turno.id,
        turno,
        personalId: turno.personalId,
        fechaAsignacion: turno.fecha,
        estado: turno.estado === 'asignado' ? 'asignado' : turno.estado === 'confirmado' ? 'confirmado' : 'rechazado',
        notificado: turno.estado !== 'asignado',
        createdAt: turno.createdAt,
      }));
      setAsignaciones(asignacionesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirModal = () => {
    setFormData({
      personalId: '',
      fecha: '',
      tipo: 'mañana',
      horaInicio: '',
      horaFin: '',
      estado: 'asignado',
      notas: '',
    });
    setModalAbierto(true);
  };

  const handleGuardar = async () => {
    try {
      await createTurno(formData as Omit<Turno, 'id' | 'createdAt' | 'updatedAt'>);
      setModalAbierto(false);
      cargarDatos();
    } catch (error) {
      console.error('Error saving asignacion:', error);
    }
  };

  const verificarDisponibilidad = (personalId: string, fecha: string, horaInicio: string, horaFin: string): boolean => {
    const conflictos = turnos.filter(turno => 
      turno.personalId === personalId &&
      turno.fecha === fecha &&
      turno.estado !== 'cancelado' &&
      (
        (turno.horaInicio <= horaInicio && turno.horaFin > horaInicio) ||
        (turno.horaInicio < horaFin && turno.horaFin >= horaFin) ||
        (turno.horaInicio >= horaInicio && turno.horaFin <= horaFin)
      )
    );
    return conflictos.length === 0;
  };

  const columns = [
    {
      key: 'personalId',
      label: 'Personal',
      render: (value: string, row: AsignacionTurno) => {
        const persona = personal.find(p => p.id === value);
        return (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span>{persona ? `${persona.nombre} ${persona.apellidos}` : value}</span>
          </div>
        );
      },
    },
    {
      key: 'turnoId',
      label: 'Turno',
      render: (value: string, row: AsignacionTurno) => {
        const turno = turnos.find(t => t.id === value);
        if (!turno) return '-';
        return (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{turno.horaInicio} - {turno.horaFin}</span>
          </div>
        );
      },
    },
    {
      key: 'fechaAsignacion',
      label: 'Fecha',
      render: (value: string) => new Date(value).toLocaleDateString('es-ES'),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: string) => {
        const estados = {
          asignado: { bg: 'bg-gray-100', text: 'text-gray-800', icon: <Clock className="w-3 h-3" /> },
          confirmado: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle className="w-3 h-3" /> },
          rechazado: { bg: 'bg-red-100', text: 'text-red-800', icon: <XCircle className="w-3 h-3" /> },
        };
        const estadoStyle = estados[value as keyof typeof estados] || estados.asignado;
        return (
          <span className={`px-2 py-1 ${estadoStyle.bg} ${estadoStyle.text} rounded-full text-xs font-medium flex items-center gap-1`}>
            {estadoStyle.icon}
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        );
      },
    },
    {
      key: 'notificado',
      label: 'Notificado',
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {value ? 'Sí' : 'No'}
        </span>
      ),
    },
  ];

  const personalDisponible = formData.personalId && formData.fecha && formData.horaInicio && formData.horaFin
    ? verificarDisponibilidad(formData.personalId, formData.fecha, formData.horaInicio, formData.horaFin)
    : true;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button onClick={handleAbrirModal}>
          <Plus size={20} className="mr-2" />
          Nueva Asignación
        </Button>
      </div>

      <Table
        data={asignaciones}
        columns={columns}
        loading={loading}
        emptyMessage="No hay asignaciones de turnos registradas"
      />

      <Modal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title="Nueva Asignación de Turno"
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setModalAbierto(false)}>
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              onClick={handleGuardar}
              disabled={!personalDisponible}
            >
              Asignar Turno
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Select
            label="Personal"
            options={personal.map(p => ({
              value: p.id,
              label: `${p.nombre} ${p.apellidos} - ${p.tipo}`,
            }))}
            value={formData.personalId}
            onChange={(e) => setFormData({ ...formData, personalId: e.target.value })}
          />
          
          <Input
            label="Fecha"
            type="date"
            value={formData.fecha}
            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
          />
          
          <Select
            label="Tipo de Turno"
            options={[
              { value: 'mañana', label: 'Mañana (6:00 - 14:00)' },
              { value: 'tarde', label: 'Tarde (14:00 - 22:00)' },
              { value: 'noche', label: 'Noche (22:00 - 6:00)' },
              { value: 'completo', label: 'Completo' },
              { value: 'parcial', label: 'Parcial' },
            ]}
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Hora Inicio"
              type="time"
              value={formData.horaInicio}
              onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
            />
            <Input
              label="Hora Fin"
              type="time"
              value={formData.horaFin}
              onChange={(e) => setFormData({ ...formData, horaFin: e.target.value })}
            />
          </div>

          {formData.personalId && formData.fecha && formData.horaInicio && formData.horaFin && (
            <div className={`p-3 rounded-lg ${personalDisponible ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {personalDisponible ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Personal disponible en este horario</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Conflicto: El personal ya tiene un turno asignado en este horario</span>
                </div>
              )}
            </div>
          )}
          
          <Input
            label="Notas"
            value={formData.notas}
            onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
            placeholder="Notas adicionales sobre la asignación"
          />
        </div>
      </Modal>
    </div>
  );
};


