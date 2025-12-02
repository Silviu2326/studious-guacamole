import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Modal, Input, Select } from '../../../components/componentsreutilizables';
import { ControlHorario } from '../types';
import { getControlHorarios, registrarEntrada, registrarSalida, registrarIncidencia } from '../api/controlHorarios';
import { getPersonal } from '../api/personal';
import { Clock, CheckCircle, XCircle, AlertTriangle, User } from 'lucide-react';

export const ControlHorarios: React.FC = () => {
  const [controlHorarios, setControlHorarios] = useState<ControlHorario[]>([]);
  const [personal, setPersonal] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalIncidencia, setModalIncidencia] = useState<string | null>(null);
  const [incidenciaForm, setIncidenciaForm] = useState<{ tipo: string; descripcion: string; hora?: string }>({
    tipo: 'retraso',
    descripcion: '',
    hora: '',
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [controlData, personalData] = await Promise.all([
        getControlHorarios(),
        getPersonal(),
      ]);
      setControlHorarios(controlData);
      setPersonal(personalData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarEntrada = async (personalId: string) => {
    const fecha = new Date().toISOString().split('T')[0];
    const hora = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    try {
      await registrarEntrada(personalId, fecha, hora);
      cargarDatos();
    } catch (error) {
      console.error('Error registrando entrada:', error);
    }
  };

  const handleRegistrarSalida = async (id: string) => {
    const hora = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    try {
      await registrarSalida(id, hora);
      cargarDatos();
    } catch (error) {
      console.error('Error registrando salida:', error);
    }
  };

  const handleRegistrarIncidencia = async () => {
    if (!modalIncidencia) return;
    try {
      await registrarIncidencia(modalIncidencia, incidenciaForm);
      setModalIncidencia(null);
      setIncidenciaForm({ tipo: 'retraso', descripcion: '', hora: '' });
      cargarDatos();
    } catch (error) {
      console.error('Error registrando incidencia:', error);
    }
  };

  const columns = [
    {
      key: 'personalId',
      label: 'Personal',
      render: (value: string, row: ControlHorario) => {
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
      key: 'fecha',
      label: 'Fecha',
      render: (value: string) => new Date(value).toLocaleDateString('es-ES'),
    },
    {
      key: 'horaInicioPlanificada',
      label: 'Horario Planificado',
      render: (value: string, row: ControlHorario) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span>{value} - {row.horaFinPlanificada}</span>
        </div>
      ),
    },
    {
      key: 'horaEntrada',
      label: 'Entrada Real',
      render: (value: string | null | undefined) => value || (
        <span className="text-gray-400">No registrada</span>
      ),
    },
    {
      key: 'horaSalida',
      label: 'Salida Real',
      render: (value: string | null | undefined) => value || (
        <span className="text-gray-400">No registrada</span>
      ),
    },
    {
      key: 'cumplido',
      label: 'Estado',
      render: (value: boolean, row: ControlHorario) => {
        if (value) {
          return (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Cumplido
            </span>
          );
        } else {
          const tieneIncidencias = row.incidencias && row.incidencias.length > 0;
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${tieneIncidencias ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
              <XCircle className="w-3 h-3" />
              {tieneIncidencias ? 'Con Incidencias' : 'Pendiente'}
            </span>
          );
        }
      },
    },
    {
      key: 'incidencias',
      label: 'Incidencias',
      render: (value: ControlHorario['incidencias']) => {
        if (!value || value.length === 0) return '-';
        return (
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm">{value.length} incidencia(s)</span>
          </div>
        );
      },
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: ControlHorario) => {
        const hoy = new Date().toISOString().split('T')[0];
        const esHoy = row.fecha === hoy;
        
        return (
          <div className="flex gap-2">
            {esHoy && !row.horaEntrada && (
              <button
                onClick={() => handleRegistrarEntrada(row.personalId)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Entrada
              </button>
            )}
            {esHoy && row.horaEntrada && !row.horaSalida && (
              <button
                onClick={() => handleRegistrarSalida(row.id)}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Salida
              </button>
            )}
            {!row.cumplido && (
              <button
                onClick={() => setModalIncidencia(row.id)}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Incidencia
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const estadisticas = {
    cumplidos: controlHorarios.filter(ch => ch.cumplido).length,
    incidencias: controlHorarios.filter(ch => ch.incidencias && ch.incidencias.length > 0).length,
    pendientes: controlHorarios.filter(ch => !ch.cumplido && (!ch.incidencias || ch.incidencias.length === 0)).length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Horarios Cumplidos</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.cumplidos}</p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Con Incidencias</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.incidencias}</p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.pendientes}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Table
        data={controlHorarios}
        columns={columns}
        loading={loading}
        emptyMessage="No hay registros de control de horarios"
      />

      <Modal
        isOpen={!!modalIncidencia}
        onClose={() => {
          setModalIncidencia(null);
          setIncidenciaForm({ tipo: 'retraso', descripcion: '', hora: '' });
        }}
        title="Registrar Incidencia"
        size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => {
              setModalIncidencia(null);
              setIncidenciaForm({ tipo: 'retraso', descripcion: '', hora: '' });
            }}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleRegistrarIncidencia}>
              Registrar Incidencia
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Select
            label="Tipo de Incidencia"
            options={[
              { value: 'retraso', label: 'Retraso' },
              { value: 'ausencia', label: 'Ausencia' },
              { value: 'horario_incumplido', label: 'Horario Incumplido' },
              { value: 'falta', label: 'Falta' },
            ]}
            value={incidenciaForm.tipo}
            onChange={(e) => setIncidenciaForm({ ...incidenciaForm, tipo: e.target.value })}
          />
          
          <Input
            label="Hora de la Incidencia"
            type="time"
            value={incidenciaForm.hora}
            onChange={(e) => setIncidenciaForm({ ...incidenciaForm, hora: e.target.value })}
          />
          
          <Input
            label="Descripción"
            value={incidenciaForm.descripcion}
            onChange={(e) => setIncidenciaForm({ ...incidenciaForm, descripcion: e.target.value })}
            placeholder="Describe la incidencia"
          />
        </div>
      </Modal>
    </div>
  );
};

