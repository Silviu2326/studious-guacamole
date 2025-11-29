import React, { useState } from 'react';
import { Card, Button, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { Plus, X } from 'lucide-react';
import { PlantillaDieta, CategoriaNutricional, ObjetivoNutricional } from '../types';
import { ds } from '../../adherencia/ui/ds';
import { getCategorias, CategoriaInfo } from '../api/categorias';

interface CreadorPlantillaProps {
  plantilla?: PlantillaDieta;
  onGuardar: (plantilla: Omit<PlantillaDieta, 'id' | 'creadoEn' | 'actualizadoEn' | 'version' | 'usoCount'>) => void;
  onCancelar: () => void;
}

export const CreadorPlantilla: React.FC<CreadorPlantillaProps> = ({
  plantilla,
  onGuardar,
  onCancelar,
}) => {
  const [nombre, setNombre] = useState(plantilla?.nombre || '');
  const [descripcion, setDescripcion] = useState(plantilla?.descripcion || '');
  const [categoria, setCategoria] = useState<CategoriaNutricional>(
    plantilla?.categoria || 'balanceada'
  );
  const [objetivo, setObjetivo] = useState<ObjetivoNutricional>(
    plantilla?.objetivo || 'mantenimiento'
  );
  const [calorias, setCalorias] = useState(plantilla?.calorias || 2000);
  const [proteinas, setProteinas] = useState(plantilla?.macros.proteinas || 150);
  const [carbohidratos, setCarbohidratos] = useState(plantilla?.macros.carbohidratos || 200);
  const [grasas, setGrasas] = useState(plantilla?.macros.grasas || 65);
  const [tags, setTags] = useState<string[]>(plantilla?.tags || []);
  const [nuevoTag, setNuevoTag] = useState('');
  const [categorias, setCategorias] = useState<CategoriaInfo[]>([]);

  React.useEffect(() => {
    getCategorias().then(setCategorias).catch(console.error);
  }, []);

  const categoriasOptions = categorias.map(cat => ({
    value: cat.id,
    label: cat.nombre,
  }));

  const objetivosOptions: { value: ObjetivoNutricional; label: string }[] = [
    { value: 'perdida-peso', label: 'Pérdida de Peso' },
    { value: 'ganancia-muscular', label: 'Ganancia Muscular' },
    { value: 'mantenimiento', label: 'Mantenimiento' },
    { value: 'rendimiento', label: 'Rendimiento' },
    { value: 'salud-general', label: 'Salud General' },
    { value: 'deficit-suave', label: 'Déficit Suave' },
    { value: 'superavit-calorico', label: 'Superávit Calórico' },
  ];

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
      alert('El nombre es requerido');
      return;
    }

    onGuardar({
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || undefined,
      categoria,
      objetivo,
      calorias,
      macros: {
        proteinas,
        carbohidratos,
        grasas,
      },
      comidas: plantilla?.comidas || [],
      horarios: plantilla?.horarios || [],
      publicada: false,
      creadoPor: 'current-user',
      tags: tags.length > 0 ? tags : undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre de la Plantilla"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Vegetariana 1800 kcal"
          required
        />

        <Select
          label="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value as CategoriaNutricional)}
          options={categoriasOptions}
        />
      </div>

      <Textarea
        label="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción de la plantilla..."
        rows={3}
      />

      <Select
        label="Objetivo Nutricional"
        value={objetivo}
        onChange={(e) => setObjetivo(e.target.value as ObjetivoNutricional)}
        options={objetivosOptions}
      />

      <Card className="p-4">
        <h3 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
          Macros Nutricionales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </Card>

      <Card className="p-4">
        <h3 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
          Tags
        </h3>
        <div className="flex gap-2 mb-3">
          <Input
            value={nuevoTag}
            onChange={(e) => setNuevoTag(e.target.value)}
            placeholder="Agregar tag..."
            onKeyPress={(e) => e.key === 'Enter' && handleAgregarTag()}
            fullWidth={false}
            className="flex-1"
          />
          <Button onClick={handleAgregarTag}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
              >
                {tag}
                <button
                  onClick={() => handleEliminarTag(tag)}
                  className="hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleGuardar}>
          Guardar Plantilla
        </Button>
      </div>
    </div>
  );
};

