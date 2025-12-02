import React, { useState } from 'react';
import { Button, Input, Select, Textarea, Card } from '../../../components/componentsreutilizables';
import { Receta, IngredienteReceta, CategoriaReceta, TipoComida, DificultadReceta } from '../types';
import { CalculadoraNutricional } from './CalculadoraNutricional';
import { Plus, Trash2, X } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';

interface CreadorRecetaProps {
  receta?: Receta;
  onGuardar: (receta: Omit<Receta, 'id' | 'creadoEn' | 'actualizadoEn' | 'usoCount'>) => void;
  onCancelar: () => void;
}

export const CreadorReceta: React.FC<CreadorRecetaProps> = ({
  receta,
  onGuardar,
  onCancelar,
}) => {
  const [nombre, setNombre] = useState(receta?.nombre || '');
  const [descripcion, setDescripcion] = useState(receta?.descripcion || '');
  const [categoria, setCategoria] = useState<CategoriaReceta>(receta?.categoria || 'personalizada');
  const [tipoComida, setTipoComida] = useState<TipoComida>(receta?.tipoComida || 'almuerzo');
  const [dificultad, setDificultad] = useState<DificultadReceta>(receta?.dificultad || 'media');
  const [tiempoPreparacion, setTiempoPreparacion] = useState(receta?.tiempoPreparacion.toString() || '');
  const [tiempoCoccion, setTiempoCoccion] = useState(receta?.tiempoCoccion?.toString() || '');
  const [porciones, setPorciones] = useState(receta?.porciones.toString() || '1');
  const [ingredientes, setIngredientes] = useState<IngredienteReceta[]>(receta?.ingredientes || []);
  const [instrucciones, setInstrucciones] = useState<string[]>(receta?.instrucciones || ['']);
  const [tags, setTags] = useState<string[]>(receta?.tags || []);
  const [nuevoTag, setNuevoTag] = useState('');
  const [valorNutricional, setValorNutricional] = useState(receta?.valorNutricional);

  const categoriasOptions: { value: CategoriaReceta; label: string }[] = [
    { value: 'desayuno', label: 'Desayuno' },
    { value: 'almuerzo', label: 'Almuerzo' },
    { value: 'cena', label: 'Cena' },
    { value: 'snack', label: 'Snack' },
    { value: 'postre', label: 'Postre' },
    { value: 'bebida', label: 'Bebida' },
    { value: 'smoothie', label: 'Smoothie' },
    { value: 'ensalada', label: 'Ensalada' },
    { value: 'sopa', label: 'Sopa' },
    { value: 'plato-principal', label: 'Plato Principal' },
    { value: 'acompanamiento', label: 'Acompañamiento' },
    { value: 'personalizada', label: 'Personalizada' },
  ];

  const tiposComidaOptions: { value: TipoComida; label: string }[] = [
    { value: 'desayuno', label: 'Desayuno' },
    { value: 'media-manana', label: 'Media Mañana' },
    { value: 'almuerzo', label: 'Almuerzo' },
    { value: 'merienda', label: 'Merienda' },
    { value: 'cena', label: 'Cena' },
    { value: 'post-entreno', label: 'Post Entreno' },
  ];

  const dificultadOptions: { value: DificultadReceta; label: string }[] = [
    { value: 'facil', label: 'Fácil' },
    { value: 'media', label: 'Media' },
    { value: 'dificil', label: 'Difícil' },
  ];

  const handleAgregarIngrediente = () => {
    setIngredientes([
      ...ingredientes,
      {
        id: Date.now().toString(),
        nombre: '',
        cantidad: 0,
        unidad: 'g',
      },
    ]);
  };

  const handleActualizarIngrediente = (index: number, campo: keyof IngredienteReceta, valor: any) => {
    const nuevos = [...ingredientes];
    nuevos[index] = { ...nuevos[index], [campo]: valor };
    setIngredientes(nuevos);
  };

  const handleEliminarIngrediente = (index: number) => {
    setIngredientes(ingredientes.filter((_, i) => i !== index));
  };

  const handleAgregarInstruccion = () => {
    setInstrucciones([...instrucciones, '']);
  };

  const handleActualizarInstruccion = (index: number, valor: string) => {
    const nuevas = [...instrucciones];
    nuevas[index] = valor;
    setInstrucciones(nuevas);
  };

  const handleEliminarInstruccion = (index: number) => {
    setInstrucciones(instrucciones.filter((_, i) => i !== index));
  };

  const handleAgregarTag = () => {
    if (nuevoTag.trim() && !tags.includes(nuevoTag.trim())) {
      setTags([...tags, nuevoTag.trim()]);
      setNuevoTag('');
    }
  };

  const handleEliminarTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleGuardar = () => {
    if (!nombre.trim()) {
      alert('El nombre de la receta es obligatorio');
      return;
    }
    if (ingredientes.length === 0) {
      alert('Debe agregar al menos un ingrediente');
      return;
    }
    if (instrucciones.length === 0 || instrucciones.every(i => !i.trim())) {
      alert('Debe agregar al menos una instrucción');
      return;
    }
    if (!valorNutricional) {
      alert('Debe calcular el valor nutricional');
      return;
    }

    const nuevaReceta: Omit<Receta, 'id' | 'creadoEn' | 'actualizadoEn' | 'usoCount'> = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || undefined,
      categoria,
      tipoComida,
      dificultad,
      tiempoPreparacion: parseInt(tiempoPreparacion) || 0,
      tiempoCoccion: tiempoCoccion ? parseInt(tiempoCoccion) : undefined,
      porciones: parseInt(porciones) || 1,
      ingredientes: ingredientes.filter(i => i.nombre.trim()),
      instrucciones: instrucciones.filter(i => i.trim()),
      valorNutricional: valorNutricional,
      caloriasPorPorcion: valorNutricional.calorias,
      esFavorita: receta?.esFavorita || false,
      creadoPor: receta?.creadoPor || 'current-user',
      compartida: receta?.compartida || false,
      tags: tags.length > 0 ? tags : undefined,
    };

    onGuardar(nuevaReceta);
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre de la Receta"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Ensalada de Pollo"
          required
        />
        <Select
          label="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value as CategoriaReceta)}
          options={categoriasOptions}
        />
        <Select
          label="Tipo de Comida"
          value={tipoComida}
          onChange={(e) => setTipoComida(e.target.value as TipoComida)}
          options={tiposComidaOptions}
        />
        <Select
          label="Dificultad"
          value={dificultad}
          onChange={(e) => setDificultad(e.target.value as DificultadReceta)}
          options={dificultadOptions}
        />
        <Input
          label="Tiempo de Preparación (minutos)"
          type="number"
          value={tiempoPreparacion}
          onChange={(e) => setTiempoPreparacion(e.target.value)}
          placeholder="30"
        />
        <Input
          label="Tiempo de Cocción (minutos, opcional)"
          type="number"
          value={tiempoCoccion}
          onChange={(e) => setTiempoCoccion(e.target.value)}
          placeholder="15"
        />
        <Input
          label="Porciones"
          type="number"
          value={porciones}
          onChange={(e) => setPorciones(e.target.value)}
          placeholder="2"
        />
      </div>

      <Textarea
        label="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Describe brevemente la receta..."
        rows={3}
      />

      {/* Ingredientes */}
      <Card variant="hover" padding="md">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            Ingredientes
          </h3>
          <Button variant="secondary" size="sm" onClick={handleAgregarIngrediente}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar
          </Button>
        </div>
        <div className="space-y-3">
          {ingredientes.map((ingrediente, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <Input
                  placeholder="Nombre del ingrediente"
                  value={ingrediente.nombre}
                  onChange={(e) => handleActualizarIngrediente(index, 'nombre', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Cantidad"
                  value={ingrediente.cantidad.toString()}
                  onChange={(e) => handleActualizarIngrediente(index, 'cantidad', parseFloat(e.target.value) || 0)}
                />
                <Input
                  placeholder="Unidad (g, ml, unidad)"
                  value={ingrediente.unidad}
                  onChange={(e) => handleActualizarIngrediente(index, 'unidad', e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEliminarIngrediente(index)}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Calculadora Nutricional */}
      <CalculadoraNutricional
        ingredientes={ingredientes}
        porciones={parseInt(porciones) || 1}
        onCalcular={setValorNutricional}
      />

      {/* Instrucciones */}
      <Card variant="hover" padding="md">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            Instrucciones
          </h3>
          <Button variant="secondary" size="sm" onClick={handleAgregarInstruccion}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar
          </Button>
        </div>
        <div className="space-y-3">
          {instrucciones.map((instruccion, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm mt-1">
                {index + 1}
              </div>
              <Textarea
                value={instruccion}
                onChange={(e) => handleActualizarInstruccion(index, e.target.value)}
                placeholder={`Paso ${index + 1}...`}
                rows={2}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEliminarInstruccion(index)}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Tags */}
      <Card variant="hover" padding="md">
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
          Tags
        </h3>
        <div className="flex gap-2 mb-4">
          <Input
            value={nuevoTag}
            onChange={(e) => setNuevoTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAgregarTag()}
            placeholder="Agregar tag (presiona Enter)"
            fullWidth={false}
            className="flex-1"
          />
          <Button onClick={handleAgregarTag}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm"
            >
              {tag}
              <button
                onClick={() => handleEliminarTag(tag)}
                className="hover:text-blue-900 dark:hover:text-blue-100"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </Card>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="secondary" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button onClick={handleGuardar}>
          {receta ? 'Actualizar' : 'Crear'} Receta
        </Button>
      </div>
    </div>
  );
};

