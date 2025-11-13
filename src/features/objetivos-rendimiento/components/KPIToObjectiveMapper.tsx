import React, { useState, useEffect } from 'react';
import { KPI, Objective, KPIToObjectiveMapping } from '../types';
import { getKPIs } from '../api/metrics';
import { getObjectives } from '../api/objectives';
import { mapKPIToObjective, unmapKPIFromObjective, getObjectivesForKPI, getKPIsForObjective } from '../api/metrics';
import { Card, Button, Modal, Select, Input, Textarea, Badge, Table } from '../../../components/componentsreutilizables';
import { Target, Link2, X, Plus, Loader2, AlertCircle } from 'lucide-react';

interface KPIToObjectiveMapperProps {
  kpiId?: string;
  objectiveId?: string;
  role: 'entrenador' | 'gimnasio';
  onClose?: () => void;
}

export const KPIToObjectiveMapper: React.FC<KPIToObjectiveMapperProps> = ({
  kpiId,
  objectiveId,
  role,
  onClose,
}) => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [mappings, setMappings] = useState<KPIToObjectiveMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState<string>(kpiId || '');
  const [selectedObjective, setSelectedObjective] = useState<string>(objectiveId || '');
  const [weight, setWeight] = useState<number>(50);
  const [notes, setNotes] = useState('');
  const [viewMode, setViewMode] = useState<'by-kpi' | 'by-objective'>('by-kpi');

  useEffect(() => {
    loadData();
  }, [kpiId, objectiveId, role]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [kpisData, objectivesData] = await Promise.all([
        getKPIs(role),
        getObjectives(undefined, role),
      ]);
      setKpis(kpisData);
      setObjectives(objectivesData);

      // Cargar mapeos según el modo
      if (kpiId) {
        const kpiMappings = await getObjectivesForKPI(kpiId);
        setMappings(kpiMappings);
        setViewMode('by-kpi');
      } else if (objectiveId) {
        const objectiveMappings = await getKPIsForObjective(objectiveId);
        setMappings(objectiveMappings);
        setViewMode('by-objective');
      } else {
        // Cargar todos los mapeos
        const allMappings = await Promise.all(
          kpisData.map(kpi => getObjectivesForKPI(kpi.id))
        );
        setMappings(allMappings.flat());
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMapping = async () => {
    if (!selectedKPI || !selectedObjective) {
      alert('Por favor, selecciona un KPI y un objetivo');
      return;
    }

    try {
      await mapKPIToObjective(selectedKPI, selectedObjective, weight, notes);
      setIsModalOpen(false);
      setSelectedKPI('');
      setSelectedObjective('');
      setWeight(50);
      setNotes('');
      loadData();
    } catch (error) {
      console.error('Error creating mapping:', error);
      alert('Error al crear el mapeo');
    }
  };

  const handleDeleteMapping = async (mapping: KPIToObjectiveMapping) => {
    if (!window.confirm('¿Estás seguro de desvincular este KPI del objetivo?')) {
      return;
    }

    try {
      await unmapKPIFromObjective(mapping.kpiId, mapping.objectiveId);
      loadData();
    } catch (error) {
      console.error('Error deleting mapping:', error);
      alert('Error al desvincular');
    }
  };

  const columns = viewMode === 'by-kpi' ? [
    {
      key: 'objectiveTitle',
      label: 'Objetivo',
      render: (value: string, row: KPIToObjectiveMapping) => (
        <div>
          <div className="font-semibold text-gray-900">{value}</div>
          {row.notes && (
            <div className="text-xs text-gray-500 mt-1">{row.notes}</div>
          )}
        </div>
      ),
    },
    {
      key: 'weight',
      label: 'Peso',
      render: (value: number | undefined) => (
        <Badge variant="blue">{value || 50}%</Badge>
      ),
    },
    {
      key: 'linkedAt',
      label: 'Vinculado',
      render: (value: string) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString('es-ES')}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: KPIToObjectiveMapping) => (
        <Button
          variant="danger"
          size="sm"
          onClick={() => handleDeleteMapping(row)}
        >
          <X size={16} className="mr-1" />
          Desvincular
        </Button>
      ),
    },
  ] : [
    {
      key: 'kpiName',
      label: 'KPI',
      render: (value: string, row: KPIToObjectiveMapping) => (
        <div>
          <div className="font-semibold text-gray-900">{value}</div>
          {row.notes && (
            <div className="text-xs text-gray-500 mt-1">{row.notes}</div>
          )}
        </div>
      ),
    },
    {
      key: 'weight',
      label: 'Peso',
      render: (value: number | undefined) => (
        <Badge variant="blue">{value || 50}%</Badge>
      ),
    },
    {
      key: 'linkedAt',
      label: 'Vinculado',
      render: (value: string) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString('es-ES')}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: KPIToObjectiveMapping) => (
        <Button
          variant="danger"
          size="sm"
          onClick={() => handleDeleteMapping(row)}
        >
          <X size={16} className="mr-1" />
          Desvincular
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando mapeos...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Mapeo de KPIs a Objetivos
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Mapea cada KPI a objetivos concretos y visualiza qué indicadores sustentan cada meta
          </p>
        </div>
        <div className="flex items-center gap-3">
          {onClose && (
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
          )}
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            Nuevo Mapeo
          </Button>
        </div>
      </div>

      <Card className="p-4 bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <Link2 className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 mb-1">
              Mapeo KPI-Objetivo
            </h3>
            <p className="text-sm text-blue-700">
              Los mapeos te permiten ver qué KPIs sustentan cada objetivo y asegurar la alineación 
              entre indicadores y metas. Puedes asignar un peso a cada KPI para indicar su importancia 
              relativa en el logro del objetivo.
            </p>
          </div>
        </div>
      </Card>

      {mappings.length === 0 ? (
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">No hay mapeos configurados</p>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            Crear Primer Mapeo
          </Button>
        </Card>
      ) : (
        <Table
          data={mappings}
          columns={columns}
          loading={false}
          emptyMessage="No hay mapeos"
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedKPI('');
          setSelectedObjective('');
          setWeight(50);
          setNotes('');
        }}
        title="Nuevo Mapeo KPI-Objetivo"
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedKPI('');
                setSelectedObjective('');
                setWeight(50);
                setNotes('');
              }}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreateMapping}>
              Crear Mapeo
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Select
            label="KPI"
            value={selectedKPI}
            onChange={(e) => setSelectedKPI(e.target.value)}
            required
          >
            <option value="">Selecciona un KPI</option>
            {kpis.map((kpi) => (
              <option key={kpi.id} value={kpi.id}>
                {kpi.name}
              </option>
            ))}
          </Select>

          <Select
            label="Objetivo"
            value={selectedObjective}
            onChange={(e) => setSelectedObjective(e.target.value)}
            required
          >
            <option value="">Selecciona un objetivo</option>
            {objectives.map((objective) => (
              <option key={objective.id} value={objective.id}>
                {objective.title}
              </option>
            ))}
          </Select>

          <Input
            label="Peso (0-100)"
            type="number"
            min="0"
            max="100"
            value={weight}
            onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
            placeholder="50"
          />

          <Textarea
            label="Notas (opcional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe cómo este KPI sustenta el objetivo..."
            rows={3}
          />
        </div>
      </Modal>
    </div>
  );
};

