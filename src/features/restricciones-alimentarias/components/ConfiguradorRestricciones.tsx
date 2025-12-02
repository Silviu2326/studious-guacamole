import React, { useState, useEffect } from 'react';
import { Button, Input, Select, Textarea, Card } from '../../../components/componentsreutilizables';
import { RestriccionAlimentaria, FormularioRestriccion, TipoRestriccion, SeveridadRestriccion } from '../types';
import { useRestricciones } from '../hooks/useRestricciones';
import { 
  validarFormularioRestriccion,
  obtenerTiposRestriccion,
  obtenerSeveridades,
  obtenerIconoTipo,
  obtenerIconoSeveridad
} from '../utils/validaciones';

interface ConfiguradorRestriccionesProps {
  restriccion?: RestriccionAlimentaria;
  clienteId?: string;
  onGuardar: () => void;
  onCancelar: () => void;
}

export const ConfiguradorRestricciones: React.FC<ConfiguradorRestriccionesProps> = ({
  restriccion,
  clienteId,
  onGuardar,
  onCancelar
}) => {
  const { crearRestriccion, actualizarRestriccion, loading } = useRestricciones();
  
  // Estado del formulario
  const [formulario, setFormulario] = useState<FormularioRestriccion>({
    tipo: 'alergia',
    nombre: '',
    descripcion: '',
    severidad: 'moderada',
    ingredientesProhibidos: [''],
    ingredientesPermitidos: [''],
    notas: ''
  });
  
  const [errores, setErrores] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);

  // Cargar datos si estamos editando
  useEffect(() => {
    if (restriccion) {
      setFormulario({
        tipo: restriccion.tipo,
        nombre: restriccion.nombre,
        descripcion: restriccion.descripcion || '',
        severidad: restriccion.severidad,
        ingredientesProhibidos: restriccion.ingredientesProhibidos,
        ingredientesPermitidos: restriccion.ingredientesPermitidos || [''],
        notas: restriccion.notas || ''
      });
    }
  }, [restriccion]);

  // Manejar cambios en el formulario
  const handleChange = (campo: keyof FormularioRestriccion, valor: any) => {
    setFormulario(prev => ({
      ...prev,
      [campo]: valor
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errores.length > 0) {
      setErrores([]);
    }
  };

  // Manejar ingredientes prohibidos
  const handleIngredientesProhibidos = (index: number, valor: string) => {
    const nuevosIngredientes = [...formulario.ingredientesProhibidos];
    nuevosIngredientes[index] = valor;
    handleChange('ingredientesProhibidos', nuevosIngredientes);
  };

  const agregarIngredienteProhibido = () => {
    handleChange('ingredientesProhibidos', [...formulario.ingredientesProhibidos, '']);
  };

  const eliminarIngredienteProhibido = (index: number) => {
    if (formulario.ingredientesProhibidos.length > 1) {
      const nuevosIngredientes = formulario.ingredientesProhibidos.filter((_, i) => i !== index);
      handleChange('ingredientesProhibidos', nuevosIngredientes);
    }
  };

  // Manejar ingredientes permitidos
  const handleIngredientesPermitidos = (index: number, valor: string) => {
    const nuevosIngredientes = [...formulario.ingredientesPermitidos];
    nuevosIngredientes[index] = valor;
    handleChange('ingredientesPermitidos', nuevosIngredientes);
  };

  const agregarIngredientePermitido = () => {
    handleChange('ingredientesPermitidos', [...formulario.ingredientesPermitidos, '']);
  };

  const eliminarIngredientePermitido = (index: number) => {
    if (formulario.ingredientesPermitidos.length > 1) {
      const nuevosIngredientes = formulario.ingredientesPermitidos.filter((_, i) => i !== index);
      handleChange('ingredientesPermitidos', nuevosIngredientes);
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario
    const erroresValidacion = validarFormularioRestriccion(formulario);
    if (erroresValidacion.length > 0) {
      setErrores(erroresValidacion);
      return;
    }

    if (!clienteId && !restriccion) {
      setErrores(['ID de cliente requerido']);
      return;
    }

    try {
      setGuardando(true);
      
      // Limpiar ingredientes vacíos
      const formularioLimpio = {
        ...formulario,
        ingredientesProhibidos: formulario.ingredientesProhibidos.filter(ing => ing.trim() !== ''),
        ingredientesPermitidos: formulario.ingredientesPermitidos.filter(ing => ing.trim() !== '')
      };

      if (restriccion) {
        // Actualizar restricción existente
        await actualizarRestriccion(restriccion.id, formularioLimpio);
      } else {
        // Crear nueva restricción
        await crearRestriccion(formularioLimpio, clienteId!);
      }
      
      onGuardar();
    } catch (error) {
      setErrores(['Error al guardar la restricción. Por favor, inténtalo de nuevo.']);
    } finally {
      setGuardando(false);
    }
  };

  const tiposRestriccion = obtenerTiposRestriccion();
  const severidades = obtenerSeveridades();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Errores */}
      {errores.length > 0 && (
        <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-start space-x-3">
            <span className="text-red-500 text-xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                Errores en el formulario:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-red-700 dark:text-red-300">
                {errores.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Información básica */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Información Básica
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Tipo de Restricción"
            value={formulario.tipo}
            onChange={(e) => handleChange('tipo', e.target.value as TipoRestriccion)}
            options={tiposRestriccion.map(tipo => ({
              value: tipo.value,
              label: `${obtenerIconoTipo(tipo.value)} ${tipo.label}`
            }))}
            required
          />
          
          <Select
            label="Severidad"
            value={formulario.severidad}
            onChange={(e) => handleChange('severidad', e.target.value as SeveridadRestriccion)}
            options={severidades.map(sev => ({
              value: sev.value,
              label: `${obtenerIconoSeveridad(sev.value)} ${sev.label}`
            }))}
            required
          />
        </div>
        
        <div className="mt-4">
          <Input
            label="Nombre de la Restricción"
            value={formulario.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            placeholder="Ej: Alergia al maní, Intolerancia a la lactosa..."
            required
          />
        </div>
        
        <div className="mt-4">
          <Textarea
            label="Descripción"
            value={formulario.descripcion}
            onChange={(e) => handleChange('descripcion', e.target.value)}
            placeholder="Describe los síntomas, reacciones o detalles importantes..."
            rows={3}
          />
        </div>
      </Card>

      {/* Ingredientes prohibidos */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Ingredientes Prohibidos
          </h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={agregarIngredienteProhibido}
          >
            ➕ Agregar
          </Button>
        </div>
        
        <div className="space-y-3">
          {formulario.ingredientesProhibidos.map((ingrediente, index) => (
            <div key={index} className="flex space-x-2">
              <Input
                value={ingrediente}
                onChange={(e) => handleIngredientesProhibidos(index, e.target.value)}
                placeholder="Nombre del ingrediente prohibido"
                fullWidth
              />
              {formulario.ingredientesProhibidos.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => eliminarIngredienteProhibido(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  🗑️
                </Button>
              )}
            </div>
          ))}
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Lista todos los ingredientes que deben evitarse completamente
        </p>
      </Card>

      {/* Ingredientes permitidos */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Ingredientes Permitidos (Opcional)
          </h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={agregarIngredientePermitido}
          >
            ➕ Agregar
          </Button>
        </div>
        
        <div className="space-y-3">
          {formulario.ingredientesPermitidos.map((ingrediente, index) => (
            <div key={index} className="flex space-x-2">
              <Input
                value={ingrediente}
                onChange={(e) => handleIngredientesPermitidos(index, e.target.value)}
                placeholder="Ingrediente alternativo seguro"
                fullWidth
              />
              {formulario.ingredientesPermitidos.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => eliminarIngredientePermitido(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  🗑️
                </Button>
              )}
            </div>
          ))}
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Alternativas seguras que pueden usarse como sustitutos
        </p>
      </Card>

      {/* Notas adicionales */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Notas Adicionales
        </h3>
        
        <Textarea
          value={formulario.notas}
          onChange={(e) => handleChange('notas', e.target.value)}
          placeholder="Información adicional, medicamentos necesarios, contactos de emergencia..."
          rows={4}
        />
      </Card>

      {/* Información de severidad */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <span className="text-blue-500 text-xl">💡</span>
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Guía de Severidad:
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li><strong>Leve:</strong> Molestias menores, no requiere intervención inmediata</li>
              <li><strong>Moderada:</strong> Síntomas notables, requiere atención</li>
              <li><strong>Severa:</strong> Síntomas graves, requiere intervención médica</li>
              <li><strong>Crítica:</strong> Riesgo vital, requiere atención médica inmediata</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancelar}
          disabled={guardando}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={guardando}
          disabled={loading}
        >
          {restriccion ? 'Actualizar' : 'Crear'} Restricción
        </Button>
      </div>
    </form>
  );
};