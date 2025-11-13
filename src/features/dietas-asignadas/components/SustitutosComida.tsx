import React, { useState } from 'react';
import { Card, Button, Modal } from '../../../components/componentsreutilizables';
import type { SustitutoComida as SustitutoComidaType, MacrosNutricionales } from '../types';
import { RefreshCw, Plus, X, Edit, Check } from 'lucide-react';

interface SustitutosComidaProps {
  sustitutos: SustitutoComidaType[];
  onSustitutosChange?: (sustitutos: SustitutoComidaType[]) => void;
  modoEdicion?: boolean;
  soloLectura?: boolean;
}

export const SustitutosComida: React.FC<SustitutosComidaProps> = ({
  sustitutos = [],
  onSustitutosChange,
  modoEdicion = false,
  soloLectura = false,
}) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [sustitutoEditando, setSustitutoEditando] = useState<SustitutoComidaType | null>(null);
  const [formData, setFormData] = useState<Partial<SustitutoComidaType>>({
    nombre: '',
    razon: '',
    macros: { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 },
    alimentos: [],
  });

  const abrirModalNuevo = () => {
    setSustitutoEditando(null);
    setFormData({
      nombre: '',
      razon: '',
      macros: { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 },
      alimentos: [],
    });
    setMostrarModal(true);
  };

  const abrirModalEditar = (sustituto: SustitutoComidaType) => {
    setSustitutoEditando(sustituto);
    setFormData(sustituto);
    setMostrarModal(true);
  };

  const guardarSustituto = () => {
    if (!formData.nombre || !formData.razon) return;

    const nuevoSustituto: SustitutoComidaType = {
      id: sustitutoEditando?.id || `sustituto-${Date.now()}`,
      nombre: formData.nombre,
      razon: formData.razon,
      macros: formData.macros || { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 },
      alimentos: formData.alimentos || [],
    };

    if (sustitutoEditando) {
      // Editar existente
      const actualizados = sustitutos.map((s) =>
        s.id === sustitutoEditando.id ? nuevoSustituto : s
      );
      onSustitutosChange?.(actualizados);
    } else {
      // Nuevo
      onSustitutosChange?.([...sustitutos, nuevoSustituto]);
    }

    setMostrarModal(false);
    setSustitutoEditando(null);
  };

  const eliminarSustituto = (id: string) => {
    const actualizados = sustitutos.filter((s) => s.id !== id);
    onSustitutosChange?.(actualizados);
  };

  if (soloLectura && sustitutos.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mt-3 space-y-2">
        {sustitutos.length > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="w-3 h-3 text-slate-500" />
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Sustitutos sugeridos
            </span>
          </div>
        )}
        <div className="space-y-2">
          {sustitutos.map((sustituto) => (
            <Card
              key={sustituto.id}
              className="border border-blue-200 bg-blue-50/50 p-2.5 rounded-lg"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-900">{sustituto.nombre}</span>
                    {sustituto.razon && (
                      <span className="text-xs text-slate-500 italic">({sustituto.razon})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <span>{sustituto.macros.calorias} kcal</span>
                    <span>P: {sustituto.macros.proteinas}g</span>
                    <span>H: {sustituto.macros.carbohidratos}g</span>
                    <span>G: {sustituto.macros.grasas}g</span>
                  </div>
                </div>
                {modoEdicion && !soloLectura && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => abrirModalEditar(sustituto)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      onClick={() => eliminarSustituto(sustituto.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
        {modoEdicion && !soloLectura && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={abrirModalNuevo}
            leftIcon={<Plus className="h-3 w-3" />}
          >
            Añadir sustituto sugerido
          </Button>
        )}
      </div>

      {/* Modal para crear/editar sustituto */}
      <Modal
        isOpen={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          setSustitutoEditando(null);
        }}
        title={sustitutoEditando ? 'Editar sustituto' : 'Nuevo sustituto sugerido'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre del sustituto
            </label>
            <input
              type="text"
              value={formData.nombre || ''}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              placeholder="Ej: Pollo a la plancha sin lactosa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Razón del sustituto
            </label>
            <input
              type="text"
              value={formData.razon || ''}
              onChange={(e) => setFormData({ ...formData, razon: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              placeholder="Ej: Sin lactosa, Versión rápida, Sin gluten"
            />
            <p className="text-xs text-slate-500 mt-1">
              Describe cuándo usar este sustituto (ej: "si no hay pollo", "versión vegana")
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Macros nutricionales
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Calorías (kcal)</label>
                <input
                  type="number"
                  value={formData.macros?.calorias || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      macros: {
                        ...(formData.macros || { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }),
                        calorias: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Proteínas (g)</label>
                <input
                  type="number"
                  value={formData.macros?.proteinas || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      macros: {
                        ...(formData.macros || { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }),
                        proteinas: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Carbohidratos (g)</label>
                <input
                  type="number"
                  value={formData.macros?.carbohidratos || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      macros: {
                        ...(formData.macros || { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }),
                        carbohidratos: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Grasas (g)</label>
                <input
                  type="number"
                  value={formData.macros?.grasas || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      macros: {
                        ...(formData.macros || { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }),
                        grasas: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setMostrarModal(false);
                setSustitutoEditando(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={guardarSustituto}
              disabled={!formData.nombre || !formData.razon}
              leftIcon={<Check className="h-4 w-4" />}
            >
              {sustitutoEditando ? 'Guardar cambios' : 'Añadir sustituto'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

