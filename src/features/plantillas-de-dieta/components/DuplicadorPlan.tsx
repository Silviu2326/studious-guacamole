import React, { useState } from 'react';
import { Card, Button, Input } from '../../../components/componentsreutilizables';
import { Copy, Check } from 'lucide-react';
import { PlantillaDieta, DatosDuplicacion } from '../types';
import { ds } from '../../adherencia/ui/ds';

interface DuplicadorPlanProps {
  plantilla: PlantillaDieta;
  onDuplicar: (datos: DatosDuplicacion) => void;
  onCancelar: () => void;
}

export const DuplicadorPlan: React.FC<DuplicadorPlanProps> = ({
  plantilla,
  onDuplicar,
  onCancelar,
}) => {
  const [nombreNueva, setNombreNueva] = useState(`Copia de ${plantilla.nombre}`);
  const [personalizarMacros, setPersonalizarMacros] = useState(false);
  const [mantenerHorarios, setMantenerHorarios] = useState(true);
  const [calorias, setCalorias] = useState(plantilla.calorias);
  const [proteinas, setProteinas] = useState(plantilla.macros.proteinas);
  const [carbohidratos, setCarbohidratos] = useState(plantilla.macros.carbohidratos);
  const [grasas, setGrasas] = useState(plantilla.macros.grasas);

  const handleDuplicar = () => {
    if (!nombreNueva.trim()) {
      alert('El nombre es requerido');
      return;
    }

    onDuplicar({
      nombreNueva: nombreNueva.trim(),
      personalizarMacros,
      macrosAjustados: personalizarMacros
        ? {
            calorias,
            proteinas,
            carbohidratos,
            grasas,
          }
        : undefined,
      mantenerHorarios,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Copy className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className={`font-semibold text-blue-800 dark:text-blue-200 mb-1 ${ds.typography.h4}`}>
              Duplicar Plantilla
            </h4>
            <p className={`text-sm text-blue-700 dark:text-blue-300 ${ds.typography.bodySmall}`}>
              Crea una copia de "{plantilla.nombre}" que podrás personalizar según tus necesidades.
            </p>
          </div>
        </div>
      </Card>

      <Input
        label="Nombre de la Nueva Plantilla"
        value={nombreNueva}
        onChange={(e) => setNombreNueva(e.target.value)}
        placeholder="Nombre de la plantilla duplicada"
        required
      />

      <Card className="p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={mantenerHorarios}
            onChange={(e) => setMantenerHorarios(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300"
          />
          <span className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            Mantener horarios de comidas
          </span>
        </label>
      </Card>

      <Card className="p-4">
        <label className="flex items-center gap-3 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={personalizarMacros}
            onChange={(e) => setPersonalizarMacros(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300"
          />
          <span className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            Personalizar macros nutricionales
          </span>
        </label>

        {personalizarMacros && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <Input
              label="Calorías (kcal)"
              type="number"
              value={calorias.toString()}
              onChange={(e) => setCalorias(parseInt(e.target.value) || 0)}
            />
            <Input
              label="Proteínas (g)"
              type="number"
              value={proteinas.toString()}
              onChange={(e) => setProteinas(parseInt(e.target.value) || 0)}
            />
            <Input
              label="Carbohidratos (g)"
              type="number"
              value={carbohidratos.toString()}
              onChange={(e) => setCarbohidratos(parseInt(e.target.value) || 0)}
            />
            <Input
              label="Grasas (g)"
              type="number"
              value={grasas.toString()}
              onChange={(e) => setGrasas(parseInt(e.target.value) || 0)}
            />
          </div>
        )}
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleDuplicar}>
          <Copy className="w-4 h-4 mr-2" />
          Duplicar Plantilla
        </Button>
      </div>
    </div>
  );
};

