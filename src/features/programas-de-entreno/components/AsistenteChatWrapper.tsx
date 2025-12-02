import { useState, useEffect } from 'react';
import { Card, Select } from '../../../components/componentsreutilizables';
import { NaturalLanguageChat } from './NaturalLanguageChat';
import * as programasApi from '../api/programas';
import { DayPlan, ContextoCliente, ResumenObjetivosProgreso } from '../types';
import * as contextoApi from '../api/contexto-cliente';
import * as objetivosApi from '../api/objetivos-progreso';

export function AsistenteChatWrapper() {
  const [programas, setProgramas] = useState<programasApi.Programa[]>([]);
  const [programaSeleccionado, setProgramaSeleccionado] = useState<programasApi.Programa | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<Record<string, DayPlan>>({});
  const [contextoCliente, setContextoCliente] = useState<ContextoCliente | undefined>();
  const [objetivosProgreso, setObjetivosProgreso] = useState<ResumenObjetivosProgreso | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProgramas();
  }, []);

  useEffect(() => {
    if (programaSeleccionado) {
      loadProgramaData();
    }
  }, [programaSeleccionado]);

  const loadProgramas = async () => {
    setLoading(true);
    try {
      const progs = await programasApi.getProgramas({ activo: true });
      setProgramas(progs);
      if (progs.length > 0 && !programaSeleccionado) {
        setProgramaSeleccionado(progs[0]);
      }
    } catch (error) {
      console.error('Error loading programas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgramaData = async () => {
    if (!programaSeleccionado) return;

    // Simular carga del plan semanal (en producción vendría de la API)
    const mockWeeklyPlan: Record<string, DayPlan> = {
      Lunes: {
        microCycle: 'Semana 1',
        focus: 'Fuerza',
        volume: 'Alto',
        intensity: 'Media',
        restorative: 'No',
        summary: ['Entrenamiento de fuerza'],
        sessions: [
          {
            id: '1',
            time: '10:00',
            block: 'Press banca',
            duration: '45 min',
            modality: 'Fuerza',
            intensity: 'RPE 7',
            notes: '3 series de 8-10 repeticiones',
            series: 3,
            repeticiones: '8-10',
            peso: 60,
            gruposMusculares: ['pecho', 'hombros'],
          },
        ],
      },
      Miércoles: {
        microCycle: 'Semana 1',
        focus: 'Fuerza',
        volume: 'Alto',
        intensity: 'Media',
        restorative: 'No',
        summary: ['Entrenamiento de piernas'],
        sessions: [
          {
            id: '2',
            time: '10:00',
            block: 'Sentadillas',
            duration: '50 min',
            modality: 'Fuerza',
            intensity: 'RPE 8',
            notes: '4 series de 6-8 repeticiones',
            series: 4,
            repeticiones: '6-8',
            peso: 80,
            gruposMusculares: ['piernas', 'gluteos'],
          },
        ],
      },
    };

    setWeeklyPlan(mockWeeklyPlan);

    // Cargar contexto del cliente si existe
    if (programaSeleccionado.clienteId) {
      try {
        const contexto = await contextoApi.getContextoCliente(programaSeleccionado.clienteId);
        setContextoCliente(contexto);
      } catch (error) {
        console.error('Error loading contexto:', error);
      }

      try {
        const objetivos = await objetivosApi.getObjetivosProgreso(programaSeleccionado.clienteId);
        setObjetivosProgreso(objetivos);
      } catch (error) {
        console.error('Error loading objetivos:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <div className="p-4 text-center text-gray-600">Cargando programas...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona un programa
          </label>
          <Select
            value={programaSeleccionado?.id || ''}
            onChange={(value) => {
              const programa = programas.find((p) => p.id === value);
              setProgramaSeleccionado(programa || null);
            }}
            options={[
              { label: 'Selecciona un programa', value: '' },
              ...programas.map((p) => ({ label: p.nombre, value: p.id })),
            ]}
          />
        </div>
      </Card>

      {programaSeleccionado && (
        <NaturalLanguageChat
          programa={programaSeleccionado}
          weeklyPlan={weeklyPlan}
          contextoCliente={contextoCliente}
          objetivosProgreso={objetivosProgreso}
          weekDays={['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']}
        />
      )}

      {!programaSeleccionado && programas.length === 0 && (
        <Card className="p-6">
          <div className="text-center text-gray-600">
            No hay programas activos disponibles. Crea un programa primero.
          </div>
        </Card>
      )}
    </div>
  );
}

