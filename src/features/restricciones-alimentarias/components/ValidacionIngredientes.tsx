import React, { useState } from 'react';
import { Card, Button, Input, Select } from '../../../components/componentsreutilizables';
import { ValidacionIngrediente, SustitucionSegura } from '../types';
import { useRestricciones } from '../hooks/useRestricciones';
import { 
  formatearTipoRestriccion, 
  formatearSeveridad, 
  obtenerColorSeveridad,
  obtenerIconoTipo,
  obtenerIconoSeveridad
} from '../utils/validaciones';

interface ValidacionIngredientesProps {
  clienteId?: string;
  onValidacionCompleta?: (resultado: ValidacionIngrediente) => void;
}

export const ValidacionIngredientes: React.FC<ValidacionIngredientesProps> = ({
  clienteId,
  onValidacionCompleta
}) => {
  const { validarIngrediente, obtenerSustituciones, loading } = useRestricciones();
  
  const [ingredienteId, setIngredienteId] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(clienteId || '');
  const [validando, setValidando] = useState(false);
  const [resultado, setResultado] = useState<ValidacionIngrediente | null>(null);
  const [sustituciones, setSustituciones] = useState<SustitucionSegura[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Datos mock para ingredientes (en una implementación real vendría de una API)
  const ingredientesDisponibles = [
    { value: 'ing-001', label: 'Maní' },
    { value: 'ing-002', label: 'Leche' },
    { value: 'ing-003', label: 'Huevo' },
    { value: 'ing-004', label: 'Trigo (Gluten)' },
    { value: 'ing-005', label: 'Soja' },
    { value: 'ing-006', label: 'Pescado' },
    { value: 'ing-007', label: 'Mariscos' },
    { value: 'ing-008', label: 'Almendras' },
    { value: 'ing-009', label: 'Avena' },
    { value: 'ing-010', label: 'Pollo' }
  ];

  // Datos mock para clientes
  const clientesDisponibles = [
    { value: 'cliente-1', label: 'Juan Pérez' },
    { value: 'cliente-2', label: 'María García' },
    { value: 'cliente-3', label: 'Carlos López' },
    { value: 'cliente-4', label: 'Ana Martínez' }
  ];

  const handleValidar = async () => {
    if (!ingredienteId || !clienteSeleccionado) {
      setError('Debe seleccionar un ingrediente y un cliente');
      return;
    }

    try {
      setValidando(true);
      setError(null);
      
      const resultadoValidacion = await validarIngrediente(ingredienteId, clienteSeleccionado);
      setResultado(resultadoValidacion);
      
      // Si hay violaciones, obtener sustituciones
      if (!resultadoValidacion.esSeguro && resultadoValidacion.restriccionesVioladas.length > 0) {
        const tipoRestriccion = resultadoValidacion.restriccionesVioladas[0].tipo;
        const sustitucionesSeguras = await obtenerSustituciones(ingredienteId, tipoRestriccion);
        setSustituciones(sustitucionesSeguras);
      } else {
        setSustituciones([]);
      }
      
      if (onValidacionCompleta) {
        onValidacionCompleta(resultadoValidacion);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al validar ingrediente');
    } finally {
      setValidando(false);
    }
  };

  const limpiarResultados = () => {
    setResultado(null);
    setSustituciones([]);
    setError(null);
  };

  const ResultadoValidacion: React.FC<{ resultado: ValidacionIngrediente }> = ({ resultado }) => (
    <Card className={`p-6 border-l-4 ${
      resultado.esSeguro ? 'border-l-green-500' : 'border-l-red-500'
    }`}>
      <div className="flex items-start space-x-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
          resultado.esSeguro 
            ? 'bg-green-100 dark:bg-green-900/30' 
            : 'bg-red-100 dark:bg-red-900/30'
        }`}>
          <span className="text-3xl">
            {resultado.esSeguro ? '✅' : '❌'}
          </span>
        </div>
        
        <div className="flex-1">
          <h3 className={`text-xl font-bold mb-2 ${
            resultado.esSeguro 
              ? 'text-green-800 dark:text-green-200' 
              : 'text-red-800 dark:text-red-200'
          }`}>
            {resultado.esSeguro ? 'Ingrediente Seguro' : 'Ingrediente No Seguro'}
          </h3>
          
          {resultado.razonRechazo && (
            <p className="text-red-700 dark:text-red-300 mb-4">
              {resultado.razonRechazo}
            </p>
          )}
          
          {/* Restricciones violadas */}
          {resultado.restriccionesVioladas.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Restricciones Violadas:
              </h4>
              <div className="space-y-2">
                {resultado.restriccionesVioladas.map(restriccion => (
                  <div key={restriccion.id} className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <span className="text-lg">{obtenerIconoTipo(restriccion.tipo)}</span>
                    <div className="flex-1">
                      <div className="font-medium text-red-800 dark:text-red-200">
                        {restriccion.nombre}
                      </div>
                      <div className="text-sm text-red-600 dark:text-red-400">
                        {formatearTipoRestriccion(restriccion.tipo)} - {formatearSeveridad(restriccion.severidad)}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${obtenerColorSeveridad(restriccion.severidad)}`}>
                      {obtenerIconoSeveridad(restriccion.severidad)} {formatearSeveridad(restriccion.severidad)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Alertas generadas */}
          {resultado.alertasGeneradas.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Alertas Generadas:
              </h4>
              <div className="space-y-2">
                {resultado.alertasGeneradas.map(alerta => (
                  <div key={alerta.id} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">🚨</span>
                      <span className="font-medium text-yellow-800 dark:text-yellow-200">
                        {alerta.mensaje}
                      </span>
                    </div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 ml-6">
                      {alerta.descripcion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  const SustitucionesSeguras: React.FC<{ sustituciones: SustitucionSegura[] }> = ({ sustituciones }) => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Sustituciones Seguras Recomendadas
      </h3>
      
      {sustituciones.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No se encontraron sustituciones disponibles para este ingrediente.
        </p>
      ) : (
        <div className="space-y-3">
          {sustituciones.map(sustitucion => (
            <div key={sustitucion.id} className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-lg">🔄</span>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {sustitucion.ingredienteSustituto}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      (reemplaza a {sustitucion.ingredienteOriginal})
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                  {sustitucion.descripcion}
                </p>
                {sustitucion.notas && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 ml-6 mt-1">
                    Nota: {sustitucion.notas}
                  </p>
                )}
              </div>
              <div className="ml-4">
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {sustitucion.compatibilidad}% compatible
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatearTipoRestriccion(sustitucion.tipoRestriccion)}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <span className="text-xl">✅</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Validación de Ingredientes
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Verifica la seguridad de ingredientes contra restricciones alimentarias
        </p>
      </div>

      {/* Formulario de validación */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Validar Ingrediente
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Select
            label="Ingrediente a validar"
            value={ingredienteId}
            onChange={(e) => setIngredienteId(e.target.value)}
            options={[
              { value: '', label: 'Seleccionar ingrediente...' },
              ...ingredientesDisponibles
            ]}
            required
          />
          
          {!clienteId && (
            <Select
              label="Cliente"
              value={clienteSeleccionado}
              onChange={(e) => setClienteSeleccionado(e.target.value)}
              options={[
                { value: '', label: 'Seleccionar cliente...' },
                ...clientesDisponibles
              ]}
              required
            />
          )}
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-red-500">⚠️</span>
              <span className="text-red-700 dark:text-red-300">{error}</span>
            </div>
          </div>
        )}
        
        <div className="flex space-x-3">
          <Button
            variant="primary"
            onClick={handleValidar}
            loading={validando}
            disabled={!ingredienteId || !clienteSeleccionado || loading}
          >
            🔍 Validar Ingrediente
          </Button>
          
          {resultado && (
            <Button
              variant="secondary"
              onClick={limpiarResultados}
            >
              🗑️ Limpiar Resultados
            </Button>
          )}
        </div>
      </Card>

      {/* Resultado de la validación */}
      {resultado && <ResultadoValidacion resultado={resultado} />}

      {/* Sustituciones seguras */}
      {sustituciones.length > 0 && <SustitucionesSeguras sustituciones={sustituciones} />}

      {/* Información adicional */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <span className="text-blue-500 text-xl">💡</span>
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Información sobre la Validación:
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• La validación verifica automáticamente todas las restricciones activas del cliente</li>
              <li>• Se generan alertas automáticas para ingredientes no seguros</li>
              <li>• Las sustituciones se ordenan por compatibilidad nutricional</li>
              <li>• Los resultados se registran para auditorías de compliance</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};