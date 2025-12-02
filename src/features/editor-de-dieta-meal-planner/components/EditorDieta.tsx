import React, { useState } from 'react';
import { Card, Button, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { Edit, Save, Trash2, Plus } from 'lucide-react';
import { type Dieta, type Comida, crearDieta, actualizarDieta, eliminarDieta } from '../api/editor';
import { CalculadoraMacros } from './CalculadoraMacros';
import { SelectorAlimentos } from './SelectorAlimentos';
import { ds } from '../../adherencia/ui/ds';

interface EditorDietaProps {
  dieta?: Dieta;
  onGuardar: (dieta: Dieta) => void;
  onCancelar?: () => void;
}

export const EditorDieta: React.FC<EditorDietaProps> = ({ dieta, onGuardar, onCancelar }) => {
  const [nombre, setNombre] = useState(dieta?.nombre || '');
  const [descripcion, setDescripcion] = useState(dieta?.descripcion || '');
  const [objetivo, setObjetivo] = useState<Dieta['objetivo']>(dieta?.objetivo || 'mantenimiento');
  const [comidas, setComidas] = useState<Comida[]>(dieta?.comidas || []);
  const [mostrarCalculadora, setMostrarCalculadora] = useState(false);
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      alert('El nombre de la dieta es requerido');
      return;
    }

    setLoading(true);
    try {
      const dietaData: Omit<Dieta, 'id' | 'creadoEn' | 'actualizadoEn'> = {
        nombre,
        descripcion,
        objetivo,
        comidas,
        horarios: dieta?.horarios || [],
        sustituciones: dieta?.sustituciones || [],
        macros: dieta?.macros,
        esPlantilla: dieta?.esPlantilla || false,
        clienteId: dieta?.clienteId,
        planId: dieta?.planId,
      };

      if (dieta?.id) {
        const actualizado = await actualizarDieta(dieta.id, dietaData);
        if (actualizado && dieta) {
          onGuardar({ ...dieta, ...dietaData, actualizadoEn: new Date() });
        }
      } else {
        const nueva = await crearDieta(dietaData);
        if (nueva) {
          onGuardar(nueva);
        }
      }
    } catch (error) {
      console.error('Error guardando dieta:', error);
      alert('Error al guardar la dieta');
    } finally {
      setLoading(false);
    }
  };

  const agregarComida = () => {
    const nuevaComida: Comida = {
      id: Date.now().toString(),
      nombre: '',
      tipo: 'desayuno',
      alimentos: [],
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0,
    };
    setComidas([...comidas, nuevaComida]);
  };

  const eliminarComida = (id: string) => {
    setComidas(comidas.filter((c) => c.id !== id));
  };

  const tiposComida = [
    { value: 'desayuno', label: 'Desayuno' },
    { value: 'media-manana', label: 'Media Mañana' },
    { value: 'almuerzo', label: 'Almuerzo' },
    { value: 'merienda', label: 'Merienda' },
    { value: 'cena', label: 'Cena' },
    { value: 'post-entreno', label: 'Post Entreno' },
  ];

  const objetivos = [
    { value: 'perdida-peso', label: 'Pérdida de Peso' },
    { value: 'ganancia-muscular', label: 'Ganancia Muscular' },
    { value: 'mantenimiento', label: 'Mantenimiento' },
    { value: 'rendimiento', label: 'Rendimiento Deportivo' },
    { value: 'salud-general', label: 'Salud General' },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Edit size={24} className="text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">
            {dieta ? 'Editar Dieta' : 'Nueva Dieta'}
          </h2>
        </div>

        <div className="space-y-4">
          <Input
            label="Nombre de la Dieta"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Dieta de Definición"
          />

          <Textarea
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe los objetivos y características de esta dieta"
            rows={3}
          />

          <Select
            label="Objetivo"
            options={objetivos}
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value as Dieta['objetivo'])}
          />

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setMostrarCalculadora(!mostrarCalculadora)}
            >
              {mostrarCalculadora ? 'Ocultar' : 'Mostrar'} Calculadora de Macros
            </Button>
            <Button
              variant="secondary"
              onClick={() => setMostrarSelector(!mostrarSelector)}
            >
              {mostrarSelector ? 'Ocultar' : 'Mostrar'} Selector de Alimentos
            </Button>
          </div>
        </div>
      </Card>

      {mostrarCalculadora && <CalculadoraMacros />}
      {mostrarSelector && (
        <SelectorAlimentos
          onSeleccionarAlimento={(alimento) => {
            console.log('Alimento seleccionado:', alimento);
          }}
        />
      )}

      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Comidas
          </h3>
          <Button onClick={agregarComida} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Comida
          </Button>
        </div>

        <div className="space-y-4">
          {comidas.map((comida) => (
            <Card key={comida.id} className="p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <Input
                    label="Nombre"
                    value={comida.nombre}
                    onChange={(e) => {
                      setComidas(
                        comidas.map((c) =>
                          c.id === comida.id ? { ...c, nombre: e.target.value } : c
                        )
                      );
                    }}
                    placeholder="Nombre de la comida"
                  />
                  <Select
                    label="Tipo"
                    options={tiposComida}
                    value={comida.tipo}
                    onChange={(e) => {
                      setComidas(
                        comidas.map((c) =>
                          c.id === comida.id
                            ? { ...c, tipo: e.target.value as Comida['tipo'] }
                            : c
                        )
                      );
                    }}
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => eliminarComida(comida.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                {comida.calorias} kcal | {comida.proteinas}g P | {comida.carbohidratos}g C | {comida.grasas}g G
              </div>
            </Card>
          ))}

          {comidas.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              No hay comidas agregadas. Haz clic en "Agregar Comida" para comenzar.
            </div>
          )}
        </div>
      </Card>

      <div className="flex gap-2 justify-end">
        {onCancelar && (
          <Button variant="secondary" onClick={onCancelar}>
            Cancelar
          </Button>
        )}
        <Button onClick={handleGuardar} loading={loading}>
          <Save className="w-4 h-4 mr-2" />
          Guardar Dieta
        </Button>
      </div>
    </div>
  );
};

