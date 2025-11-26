import React, { useState } from 'react';
import { Card, Button, Input, Select, Modal } from '../../../components/componentsreutilizables';
import { DatosAsignacion, PlanNutricional } from '../types';

interface AsignacionDietaProps {
  clientes: Array<{ id: string; nombre: string }>;
  planes?: PlanNutricional[];
  esEntrenador?: boolean;
  onSubmit: (datos: DatosAsignacion) => Promise<void>;
  onCancel: () => void;
}

export const AsignacionDieta: React.FC<AsignacionDietaProps> = ({
  clientes,
  planes = [],
  esEntrenador = false,
  onSubmit,
  onCancel,
}) => {
  const [datos, setDatos] = useState<DatosAsignacion>({
    clienteId: '',
    tipo: esEntrenador ? 'individual' : 'plan-estandar',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: '',
    ajustarMacros: false,
  });
  const [mostrarMacros, setMostrarMacros] = useState(false);
  const [macros, setMacros] = useState({
    calorias: '',
    proteinas: '',
    carbohidratos: '',
    grasas: '',
  });
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const datosEnvio: DatosAsignacion = {
        ...datos,
        ...(mostrarMacros && datos.ajustarMacros && {
          macrosAjustados: {
            calorias: parseFloat(macros.calorias) || 0,
            proteinas: parseFloat(macros.proteinas) || 0,
            carbohidratos: parseFloat(macros.carbohidratos) || 0,
            grasas: parseFloat(macros.grasas) || 0,
          },
        }),
      };
      await onSubmit(datosEnvio);
    } catch (error) {
      console.error('Error al asignar dieta:', error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={esEntrenador ? 'Asignar Dieta Individual' : 'Asignar Plan Nutricional'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Cliente
          </label>
          <Select
            value={datos.clienteId}
            onChange={(e) => setDatos({ ...datos, clienteId: e.target.value })}
            options={clientes.map((c) => ({ value: c.id, label: c.nombre }))}
            placeholder="Selecciona un cliente"
            required
          />
        </div>

        {!esEntrenador && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipo de Asignación
            </label>
            <Select
              value={datos.tipo}
              onChange={(e) => setDatos({ ...datos, tipo: e.target.value as DatosAsignacion['tipo'] })}
              options={[
                { value: 'plan-estandar', label: 'Plan Estándar' },
                { value: 'pack-semanal', label: 'Pack Semanal' },
              ]}
              required
            />
          </div>
        )}

        {!esEntrenador && datos.tipo === 'plan-estandar' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Plan Nutricional
            </label>
            <Select
              value={datos.planId || ''}
              onChange={(e) => setDatos({ ...datos, planId: e.target.value })}
              options={planes.map((p) => ({ value: p.id, label: `${p.nombre} - ${p.nivel}` }))}
              placeholder="Selecciona un plan"
              required
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Fecha Inicio
            </label>
            <Input
              type="date"
              value={datos.fechaInicio}
              onChange={(e) => setDatos({ ...datos, fechaInicio: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Fecha Fin (opcional)
            </label>
            <Input
              type="date"
              value={datos.fechaFin || ''}
              onChange={(e) => setDatos({ ...datos, fechaFin: e.target.value || undefined })}
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={datos.ajustarMacros || false}
              onChange={(e) => {
                const checked = e.target.checked;
                setDatos({ ...datos, ajustarMacros: checked });
                setMostrarMacros(checked);
              }}
              className="rounded"
            />
            <span className="text-base text-gray-900">
              Ajustar macros personalizados
            </span>
          </label>
        </div>

        {mostrarMacros && datos.ajustarMacros && (
          <Card className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Calorías
                </label>
                <Input
                  type="number"
                  value={macros.calorias}
                  onChange={(e) => setMacros({ ...macros, calorias: e.target.value })}
                  placeholder="kcal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Proteínas (g)
                </label>
                <Input
                  type="number"
                  value={macros.proteinas}
                  onChange={(e) => setMacros({ ...macros, proteinas: e.target.value })}
                  placeholder="gramos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Carbohidratos (g)
                </label>
                <Input
                  type="number"
                  value={macros.carbohidratos}
                  onChange={(e) => setMacros({ ...macros, carbohidratos: e.target.value })}
                  placeholder="gramos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Grasas (g)
                </label>
                <Input
                  type="number"
                  value={macros.grasas}
                  onChange={(e) => setMacros({ ...macros, grasas: e.target.value })}
                  placeholder="gramos"
                />
              </div>
            </div>
          </Card>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="ghost" onClick={onCancel} disabled={enviando}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" loading={enviando}>
            Asignar Dieta
          </Button>
        </div>
      </form>
    </Modal>
  );
};

