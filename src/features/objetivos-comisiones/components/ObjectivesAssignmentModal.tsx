// Modal para asignar objetivos a empleados
import React, { useState } from 'react';
import { Modal, Button, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import type { ObjectiveAssignmentData } from '../types';

interface ObjectivesAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onObjectiveAssigned: () => void;
  employees: Array<{ id: string; name: string }>;
  onAssign: (data: ObjectiveAssignmentData) => Promise<void>;
}

export const ObjectivesAssignmentModal: React.FC<ObjectivesAssignmentModalProps> = ({
  isOpen,
  onClose,
  onObjectiveAssigned,
  employees,
  onAssign,
}) => {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [metric, setMetric] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const employeeOptions = employees.map((emp) => ({
    value: emp.id,
    label: emp.name,
  }));

  const metricOptions = [
    { value: 'pt_package_sales', label: 'Ventas de Paquetes PT' },
    { value: 'membership_sales', label: 'Ventas de Membresías' },
    { value: 'nps_score', label: 'Puntuación NPS' },
    { value: 'retention_rate', label: 'Tasa de Retención' },
    { value: 'client_evaluations', label: 'Evaluaciones Físicas' },
    { value: 'revenue', label: 'Ingresos Generados' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedEmployees.length === 0) {
      setError('Debes seleccionar al menos un empleado');
      return;
    }

    if (!description || !metric || !targetValue || !dueDate) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setIsSubmitting(true);

    try {
      // Asignar objetivo a cada empleado seleccionado
      for (const employeeId of selectedEmployees) {
        await onAssign({
          employee_ids: [employeeId],
          description,
          metric,
          target_value: Number(targetValue),
          due_date: new Date(dueDate).toISOString(),
        });
      }

      // Resetear formulario
      setSelectedEmployees([]);
      setDescription('');
      setMetric('');
      setTargetValue('');
      setDueDate('');
      setError(null);

      onObjectiveAssigned();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al asignar objetivo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedEmployees([]);
      setDescription('');
      setMetric('');
      setTargetValue('');
      setDueDate('');
      setError(null);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Asignar Objetivo"
      size="lg"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isSubmitting}
            type="submit"
          >
            Asignar Objetivo
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Empleados *
          </label>
          <div className="border border-gray-300 rounded-lg p-3 min-h-[100px] max-h-[200px] overflow-y-auto">
            {employees.map((emp) => {
              const isSelected = selectedEmployees.includes(emp.id);
              return (
                <label
                  key={emp.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEmployees((prev) => [...prev, emp.id]);
                      } else {
                        setSelectedEmployees((prev) => prev.filter((id) => id !== emp.id));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-gray-900">
                    {emp.name}
                  </span>
                </label>
              );
            })}
          </div>
          {selectedEmployees.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedEmployees.map((empId) => {
                const emp = employees.find((e) => e.id === empId);
                return emp ? (
                  <span
                    key={empId}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                  >
                    {emp.name}
                    <button
                      type="button"
                      onClick={() => setSelectedEmployees((prev) => prev.filter((id) => id !== empId))}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>

        <Textarea
          label="Descripción del Objetivo"
          placeholder="Ej: Vender 20 paquetes de entrenamiento personal de 10 sesiones"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
        />

        <Select
          label="Métrica"
          options={metricOptions}
          placeholder="Selecciona la métrica a medir"
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
          required
        />

        <Input
          label="Valor Objetivo"
          type="number"
          placeholder="20"
          value={targetValue}
          onChange={(e) => setTargetValue(e.target.value)}
          required
          min="1"
        />

        <Input
          label="Fecha Límite"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          min={new Date().toISOString().split('T')[0]}
        />
      </form>
    </Modal>
  );
};

