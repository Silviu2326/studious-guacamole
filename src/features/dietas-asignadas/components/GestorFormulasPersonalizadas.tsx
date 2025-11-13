import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Badge } from '../../../components/componentsreutilizables';
import {
  Calculator,
  Plus,
  Edit,
  Trash2,
  RefreshCcw,
  CheckCircle2,
  X,
  Info,
  Zap,
} from 'lucide-react';
import type {
  FormulaPersonalizada,
  ConfiguracionFormulasPersonalizadas,
  TipoFormulaPersonalizada,
  Dieta,
} from '../types';
import {
  getFormulasPersonalizadas,
  guardarFormulasPersonalizadas,
  crearFormulaPersonalizada,
  actualizarFormulaPersonalizada,
  eliminarFormulaPersonalizada,
  getFormulasPredefinidas,
  calcularFormula,
} from '../api/formulasPersonalizadas';

interface GestorFormulasPersonalizadasProps {
  dietistaId: string;
  dieta?: Dieta; // Para calcular valores en tiempo real
  onFormulasCambiadas?: (formulas: FormulaPersonalizada[]) => void;
}

export const GestorFormulasPersonalizadas: React.FC<GestorFormulasPersonalizadasProps> = ({
  dietistaId,
  dieta,
  onFormulasCambiadas,
}) => {
  const [configuracion, setConfiguracion] = useState<ConfiguracionFormulasPersonalizadas | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formulaEditando, setFormulaEditando] = useState<FormulaPersonalizada | null>(null);
  const [formulasPredefinidas] = useState(getFormulasPredefinidas());

  useEffect(() => {
    cargarFormulas();
  }, [dietistaId]);

  const cargarFormulas = async () => {
    setCargando(true);
    try {
      const config = await getFormulasPersonalizadas(dietistaId);
      if (config) {
        setConfiguracion(config);
        if (onFormulasCambiadas) {
          onFormulasCambiadas(config.formulas.filter((f) => f.activa));
        }
      } else {
        // Crear configuración inicial vacía
        const nuevaConfig: ConfiguracionFormulasPersonalizadas = {
          dietistaId,
          formulas: [],
          version: 1,
          actualizadoEn: new Date().toISOString(),
        };
        setConfiguracion(nuevaConfig);
      }
    } catch (error) {
      console.error('Error cargando fórmulas:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleAgregarPredefinida = async (predefinida: typeof formulasPredefinidas[0]) => {
    try {
      const orden = configuracion?.formulas.length || 0;
      const nuevaFormula = await crearFormulaPersonalizada(dietistaId, {
        ...predefinida,
        activa: true,
        orden,
      });
      await cargarFormulas();
      setMostrarModal(false);
    } catch (error) {
      console.error('Error agregando fórmula:', error);
      alert('Error al agregar la fórmula. Por favor, intenta de nuevo.');
    }
  };

  const handleToggleActiva = async (formula: FormulaPersonalizada) => {
    try {
      await actualizarFormulaPersonalizada(dietistaId, formula.id, {
        activa: !formula.activa,
      });
      await cargarFormulas();
    } catch (error) {
      console.error('Error actualizando fórmula:', error);
    }
  };

  const handleEliminar = async (formulaId: string) => {
    if (!confirm('¿Eliminar esta fórmula personalizada?')) return;

    try {
      await eliminarFormulaPersonalizada(dietistaId, formulaId);
      await cargarFormulas();
    } catch (error) {
      console.error('Error eliminando fórmula:', error);
      alert('Error al eliminar la fórmula. Por favor, intenta de nuevo.');
    }
  };

  const getTipoLabel = (tipo: TipoFormulaPersonalizada): string => {
    const labels: Record<TipoFormulaPersonalizada, string> = {
      tonelaje: 'Tonelaje',
      'densidad-energetica': 'Densidad Energética',
      'porcentaje-vegetariano': '% Vegetariano',
      'ratio-carbohidratos-proteina': 'Ratio CH/Prot',
      'indice-saciedad': 'Índice Saciedad',
      'carga-glicemica': 'Carga Glicémica',
      custom: 'Personalizada',
    };
    return labels[tipo] || tipo;
  };

  const getFormatoLabel = (formato: string): string => {
    const labels: Record<string, string> = {
      numero: 'Número',
      porcentaje: 'Porcentaje',
      moneda: 'Moneda',
      texto: 'Texto',
    };
    return labels[formato] || formato;
  };

  if (cargando) {
    return (
      <Card>
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-gray-500">Cargando fórmulas...</div>
        </div>
      </Card>
    );
  }

  const formulasActivas = configuracion?.formulas.filter((f) => f.activa) || [];
  const formulasInactivas = configuracion?.formulas.filter((f) => !f.activa) || [];

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Fórmulas Personalizadas
            </h3>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setMostrarModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Agregar Fórmula
          </Button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Crea fórmulas personalizadas que se recalcularán automáticamente al editar la dieta.
          Ejemplos: tonelaje, densidad energética, % vegetariano, etc.
        </p>

        {/* Fórmulas activas */}
        {formulasActivas.length > 0 && (
          <div className="space-y-3 mb-4">
            <div className="text-sm font-medium text-gray-700">Fórmulas Activas</div>
            {formulasActivas.map((formula) => (
              <FormulaCard
                key={formula.id}
                formula={formula}
                dieta={dieta}
                onToggleActiva={() => handleToggleActiva(formula)}
                onEliminar={() => handleEliminar(formula.id)}
                getTipoLabel={getTipoLabel}
                getFormatoLabel={getFormatoLabel}
              />
            ))}
          </div>
        )}

        {/* Fórmulas inactivas */}
        {formulasInactivas.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-500">Fórmulas Inactivas</div>
            {formulasInactivas.map((formula) => (
              <FormulaCard
                key={formula.id}
                formula={formula}
                dieta={dieta}
                onToggleActiva={() => handleToggleActiva(formula)}
                onEliminar={() => handleEliminar(formula.id)}
                getTipoLabel={getTipoLabel}
                getFormatoLabel={getFormatoLabel}
              />
            ))}
          </div>
        )}

        {formulasActivas.length === 0 && formulasInactivas.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calculator className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No hay fórmulas personalizadas aún.</p>
            <p className="text-xs mt-1">Agrega una fórmula para comenzar.</p>
          </div>
        )}
      </Card>

      {/* Modal para agregar fórmulas */}
      {mostrarModal && (
        <Modal
          isOpen={true}
          onClose={() => setMostrarModal(false)}
          title="Agregar Fórmula Personalizada"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Fórmulas Predefinidas</h4>
              <p className="text-sm text-gray-600 mb-3">
                Selecciona una fórmula predefinida para agregarla a tu configuración:
              </p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {formulasPredefinidas.map((predefinida) => {
                  const yaExiste = configuracion?.formulas.some(
                    (f) => f.tipo === predefinida.tipo
                  );
                  return (
                    <div
                      key={predefinida.tipo}
                      className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {predefinida.nombre}
                            </span>
                            {predefinida.recalculoAutomatico && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                <Zap className="w-3 h-3 mr-1" />
                                Auto
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {predefinida.descripcion}
                          </p>
                          <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
                            {predefinida.formula}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end">
                        {yaExiste ? (
                          <Badge variant="secondary" className="text-xs">
                            Ya agregada
                          </Badge>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleAgregarPredefinida(predefinida)}
                            leftIcon={<Plus className="w-3 h-3" />}
                          >
                            Agregar
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-start gap-2 text-sm text-blue-900 bg-blue-50 p-3 rounded-lg">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Nota:</strong> Las fórmulas se recalcularán automáticamente cuando
                  edites la dieta. Puedes activar o desactivar fórmulas según necesites.
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

interface FormulaCardProps {
  formula: FormulaPersonalizada;
  dieta?: Dieta;
  onToggleActiva: () => void;
  onEliminar: () => void;
  getTipoLabel: (tipo: TipoFormulaPersonalizada) => string;
  getFormatoLabel: (formato: string) => string;
}

const FormulaCard: React.FC<FormulaCardProps> = ({
  formula,
  dieta,
  onToggleActiva,
  onEliminar,
  getTipoLabel,
  getFormatoLabel,
}) => {
  const [valorCalculado, setValorCalculado] = useState<string | number>('-');

  useEffect(() => {
    if (dieta && formula.activa && formula.recalculoAutomatico) {
      const valor = calcularFormula(formula, { dieta });
      setValorCalculado(valor);
    }
  }, [formula, dieta]);

  return (
    <div
      className={`p-4 border-2 rounded-lg transition-all ${
        formula.activa
          ? 'border-blue-200 bg-blue-50'
          : 'border-gray-200 bg-gray-50 opacity-60'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900">{formula.nombre}</span>
            <Badge variant="secondary" className="text-xs">
              {getTipoLabel(formula.tipo)}
            </Badge>
            {formula.recalculoAutomatico && (
              <Badge className="bg-green-100 text-green-800 text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Auto
              </Badge>
            )}
            {!formula.activa && (
              <Badge variant="secondary" className="text-xs">
                Inactiva
              </Badge>
            )}
          </div>
          {formula.descripcion && (
            <p className="text-sm text-gray-600 mb-2">{formula.descripcion}</p>
          )}
          <div className="text-xs text-gray-500 font-mono bg-white p-2 rounded border border-gray-200 mb-2">
            {formula.formula}
          </div>
          {dieta && formula.activa && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Valor calculado:</span>
              <span className="font-semibold text-blue-600">{valorCalculado}</span>
              {formula.unidad && (
                <span className="text-gray-500 text-xs">{formula.unidad}</span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleActiva}
            leftIcon={formula.activa ? <X className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          >
            {formula.activa ? 'Desactivar' : 'Activar'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEliminar}
            leftIcon={<Trash2 className="w-4 h-4" />}
            className="text-red-600 hover:text-red-700"
          >
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
};

