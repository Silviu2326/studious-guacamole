import { useState, useEffect } from 'react';
import { Card, Select } from '../../../components/componentsreutilizables';
import { QuickActionsPanel } from './QuickActionsPanel';
import * as programasApi from '../api/programas';
import { DayPlan } from '../types';

export function AccionesRapidasWrapper() {
  const [programas, setProgramas] = useState<programasApi.Programa[]>([]);
  const [programaSeleccionado, setProgramaSeleccionado] = useState<programasApi.Programa | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<Record<string, DayPlan>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProgramas();
  }, []);

  useEffect(() => {
    if (programaSeleccionado) {
      loadWeeklyPlan();
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

  const loadWeeklyPlan = async () => {
    if (!programaSeleccionado) return;
    
    // Simular carga del plan semanal (en producción vendría de la API)
    // Por ahora usamos datos mock
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
    };
    
    setWeeklyPlan(mockWeeklyPlan);
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
        <QuickActionsPanel
          programa={programaSeleccionado}
          weeklyPlan={weeklyPlan}
          onAccionCompletada={() => {
            // Recargar programas después de una acción
            loadProgramas();
          }}
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

