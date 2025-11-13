import { useState, useMemo } from 'react';
import { Card, Button, Modal } from '../../../components/componentsreutilizables';
import {
  FileStack,
  CheckCircle2,
  X,
  Sparkles,
  Dumbbell,
  Activity,
  Flame,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  obtenerPlantillasPorRol,
  convertirAPlantillaRecomendada,
  type PlantillaPredisenada,
  type RolTemplate,
} from '../utils/plantillasPredisenadas';
import { useAuth } from '../../../context/AuthContext';

interface SelectorPlantillasProps {
  isOpen: boolean;
  onClose: () => void;
  onSeleccionarPlantilla: (plantilla: PlantillaPredisenada) => void;
  rolSeleccionado?: RolTemplate;
}

export function SelectorPlantillas({
  isOpen,
  onClose,
  onSeleccionarPlantilla,
  rolSeleccionado,
}: SelectorPlantillasProps) {
  const { user } = useAuth();
  const [rolFiltro, setRolFiltro] = useState<RolTemplate | 'todos'>(
    rolSeleccionado || 'todos'
  );
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<PlantillaPredisenada | null>(null);

  const roles: { value: RolTemplate | 'todos'; label: string; icon: JSX.Element }[] = [
    { value: 'todos', label: 'Todas', icon: <FileStack className="w-5 h-5" /> },
    { value: 'fuerza', label: 'Fuerza', icon: <Dumbbell className="w-5 h-5" /> },
    { value: 'maraton', label: 'Maratón', icon: <Activity className="w-5 h-5" /> },
    { value: 'hiit', label: 'HIIT', icon: <Flame className="w-5 h-5" /> },
  ];

  const plantillasFiltradas = useMemo(() => {
    if (rolFiltro === 'todos') {
      return obtenerPlantillasPorRol('fuerza')
        .concat(obtenerPlantillasPorRol('maraton'))
        .concat(obtenerPlantillasPorRol('hiit'));
    }
    return obtenerPlantillasPorRol(rolFiltro);
  }, [rolFiltro]);

  const handleSeleccionar = () => {
    if (plantillaSeleccionada) {
      onSeleccionarPlantilla(plantillaSeleccionada);
      setPlantillaSeleccionada(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Plantillas Prediseñadas"
      size="xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Sparkles className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Selecciona una Plantilla
            </h2>
            <p className="text-sm text-gray-600">
              Elige una plantilla prediseñada según tu rol para empezar con la estructura adecuada
            </p>
          </div>
        </div>

        {/* Filtros por rol */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700">Filtrar por rol:</span>
          {roles.map((rol) => (
            <button
              key={rol.value}
              onClick={() => setRolFiltro(rol.value)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                rolFiltro === rol.value
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-indigo-300 text-gray-700'
              }`}
            >
              {rol.icon}
              <span className="text-sm font-medium">{rol.label}</span>
            </button>
          ))}
        </div>

        {/* Lista de plantillas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
          {plantillasFiltradas.map((plantilla) => {
            const isSelected = plantillaSeleccionada?.id === plantilla.id;
            return (
              <Card
                key={plantilla.id}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? 'ring-2 ring-indigo-500 bg-indigo-50'
                    : 'hover:shadow-md'
                }`}
                onClick={() => setPlantillaSeleccionada(plantilla)}
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {plantilla.nombre}
                        </h3>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {plantilla.descripcion}
                      </p>
                    </div>
                  </div>

                  {/* Columnas */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-gray-500">
                        Columnas:
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {plantilla.columnas.slice(0, 6).map((col) => (
                        <span
                          key={col}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {col}
                        </span>
                      ))}
                      {plantilla.columnas.length > 6 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          +{plantilla.columnas.length - 6}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Fórmulas */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-gray-500">
                        Fórmulas incluidas:
                      </span>
                    </div>
                    <div className="space-y-1">
                      {plantilla.formulas.map((formula) => (
                        <div
                          key={formula.id}
                          className="flex items-center gap-2 text-xs text-gray-600"
                        >
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                          <span>{formula.nombre}</span>
                          <span className="text-gray-400">({formula.unidad})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resúmenes */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-gray-500">
                        Resúmenes:
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {plantilla.resumenes.map((resumen) => (
                        <span
                          key={resumen}
                          className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded"
                        >
                          {resumen.replace('resumen', '').replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {plantillasFiltradas.length === 0 && (
          <div className="text-center py-8">
            <FileStack className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No hay plantillas disponibles para este rol</p>
          </div>
        )}

        {/* Footer con acciones */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <div className="flex items-center gap-2">
            {plantillaSeleccionada && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Info className="w-4 h-4" />
                <span>Plantilla seleccionada: {plantillaSeleccionada.nombre}</span>
              </div>
            )}
            <Button
              variant="primary"
              onClick={handleSeleccionar}
              disabled={!plantillaSeleccionada}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Usar Plantilla
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

