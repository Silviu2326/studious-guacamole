import React, { useState } from 'react';
import { Card, Button, Select, Input } from '../../../components/componentsreutilizables';
import { Settings, ShoppingBag } from 'lucide-react';
import { 
  type ListaCompra,
  personalizarLista,
  type PersonalizacionLista
} from '../api';

interface PersonalizadorListaProps {
  lista: ListaCompra;
  onPersonalizada?: (lista: ListaCompra) => void;
}

export const PersonalizadorLista: React.FC<PersonalizadorListaProps> = ({
  lista,
  onPersonalizada,
}) => {
  const [personalizacion, setPersonalizacion] = useState<PersonalizacionLista>({
    incluirIngredientesBase: lista.ingredientesBase.length > 0,
    organizarPorSeccion: true,
    supermercadoPreferido: lista.supermercadoPreferido,
    mostrarPrecios: false,
    formatoExportacion: 'pdf',
  });
  const [guardando, setGuardando] = useState(false);

  const supermercados = [
    { value: 'carrefour', label: 'Carrefour' },
    { value: 'mercadona', label: 'Mercadona' },
    { value: 'el-corte-ingles', label: 'El Corte Inglés' },
    { value: 'eroski', label: 'Eroski' },
    { value: 'alcampo', label: 'Alcampo' },
    { value: 'hipercor', label: 'Hipercor' },
    { value: 'otro', label: 'Otro' },
  ];

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      const listaPersonalizada = await personalizarLista(lista.id, personalizacion);
      if (listaPersonalizada) {
        onPersonalizada?.(listaPersonalizada);
        alert('Lista personalizada guardada correctamente');
      } else {
        alert('Error al personalizar la lista');
      }
    } catch (error) {
      console.error('Error personalizando lista:', error);
      alert('Error al personalizar la lista');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-900">
          Personalizar Lista
        </h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="incluirBase"
            checked={personalizacion.incluirIngredientesBase}
            onChange={(e) =>
              setPersonalizacion({
                ...personalizacion,
                incluirIngredientesBase: e.target.checked,
              })
            }
            className="w-4 h-4 text-blue-600 rounded"
          />
          <label
            htmlFor="incluirBase"
            className="text-sm text-gray-900"
          >
            Incluir ingredientes base de despensa
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="organizarSeccion"
            checked={personalizacion.organizarPorSeccion}
            onChange={(e) =>
              setPersonalizacion({
                ...personalizacion,
                organizarPorSeccion: e.target.checked,
              })
            }
            className="w-4 h-4 text-blue-600 rounded"
          />
          <label
            htmlFor="organizarSeccion"
            className="text-sm text-gray-900"
          >
            Organizar por secciones del supermercado
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="mostrarPrecios"
            checked={personalizacion.mostrarPrecios}
            onChange={(e) =>
              setPersonalizacion({
                ...personalizacion,
                mostrarPrecios: e.target.checked,
              })
            }
            className="w-4 h-4 text-blue-600 rounded"
          />
          <label
            htmlFor="mostrarPrecios"
            className="text-sm text-gray-900"
          >
            Mostrar precios aproximados
          </label>
        </div>

        <Select
          label="Supermercado Preferido"
          options={supermercados}
          value={personalizacion.supermercadoPreferido || ''}
          onChange={(e) =>
            setPersonalizacion({
              ...personalizacion,
              supermercadoPreferido: e.target.value,
            })
          }
          placeholder="Selecciona un supermercado"
        />

        <Select
          label="Formato de Exportación por Defecto"
          options={[
            { value: 'pdf', label: 'PDF' },
            { value: 'email', label: 'Email' },
            { value: 'app', label: 'App Móvil' },
            { value: 'impresion', label: 'Impresión' },
          ]}
          value={personalizacion.formatoExportacion}
          onChange={(e) =>
            setPersonalizacion({
              ...personalizacion,
              formatoExportacion: e.target.value as 'pdf' | 'email' | 'app' | 'impresion',
            })
          }
        />

        <Button onClick={handleGuardar} loading={guardando} fullWidth>
          <Settings className="w-4 h-4 mr-2" />
          Guardar Personalización
        </Button>
      </div>
    </Card>
  );
};

