import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Switch } from '../../../components/componentsreutilizables';
import { Settings, GripVertical, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { PreferenciasMetricas, ConfiguracionMetrica, TipoMetrica } from '../types';
import { 
  getPreferenciasMetricas, 
  guardarPreferenciasMetricas, 
  inicializarMetricas,
  resetearPreferencias 
} from '../utils/preferenciasMetricas';

interface ConfiguracionMetricasProps {
  clienteId?: string;
  clienteNombre?: string;
  onSave?: (preferencias: PreferenciasMetricas) => void;
}

export const ConfiguracionMetricas: React.FC<ConfiguracionMetricasProps> = ({
  clienteId,
  clienteNombre,
  onSave,
}) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [metricas, setMetricas] = useState<ConfiguracionMetrica[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (mostrarModal) {
      cargarPreferencias();
    }
  }, [mostrarModal, clienteId]);

  const cargarPreferencias = () => {
    const preferencias = getPreferenciasMetricas(clienteId);
    if (preferencias.metricas && preferencias.metricas.length > 0) {
      setMetricas([...preferencias.metricas]);
    } else {
      setMetricas(inicializarMetricas());
    }
    setHasChanges(false);
  };

  const handleToggleVisibilidad = (id: TipoMetrica) => {
    setMetricas(prev => 
      prev.map(m => 
        m.id === id ? { ...m, visible: !m.visible } : m
      )
    );
    setHasChanges(true);
  };

  const handleMoverArriba = (index: number) => {
    if (index === 0) return;
    setMetricas(prev => {
      const nuevas = [...prev];
      [nuevas[index - 1], nuevas[index]] = [nuevas[index], nuevas[index - 1]];
      // Actualizar orden
      return nuevas.map((m, i) => ({ ...m, orden: i + 1 }));
    });
    setHasChanges(true);
  };

  const handleMoverAbajo = (index: number) => {
    if (index === metricas.length - 1) return;
    setMetricas(prev => {
      const nuevas = [...prev];
      [nuevas[index], nuevas[index + 1]] = [nuevas[index + 1], nuevas[index]];
      // Actualizar orden
      return nuevas.map((m, i) => ({ ...m, orden: i + 1 }));
    });
    setHasChanges(true);
  };

  const handleGuardar = () => {
    const preferencias: PreferenciasMetricas = {
      metricas: metricas.map((m, i) => ({ ...m, orden: i + 1 })),
      clienteId,
    };
    
    guardarPreferenciasMetricas(preferencias, clienteId);
    setHasChanges(false);
    
    if (onSave) {
      onSave(preferencias);
    }
    
    setMostrarModal(false);
  };

  const handleCancelar = () => {
    cargarPreferencias();
    setMostrarModal(false);
  };

  const handleResetear = () => {
    if (confirm('¿Estás seguro de que quieres resetear las preferencias a los valores por defecto?')) {
      resetearPreferencias(clienteId);
      cargarPreferencias();
      setHasChanges(true);
    }
  };

  const getMetricaLabel = (id: TipoMetrica): string => {
    const labels: Record<TipoMetrica, string> = {
      'kcal': 'Kcal Objetivo',
      'macronutrientes': 'Macronutrientes',
      'ratio-proteina': 'Ratio Proteína/kg',
      'vasos-agua': 'Vasos de Agua',
      'fibra': 'Fibra',
    };
    return labels[id] || id;
  };

  const metricasOrdenadas = [...metricas].sort((a, b) => a.orden - b.orden);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMostrarModal(true)}
        className="flex items-center gap-2"
      >
        <Settings className="w-4 h-4" />
        <span>Configurar Métricas</span>
      </Button>

      <Modal
        isOpen={mostrarModal}
        onClose={handleCancelar}
        title={`Configurar Métricas${clienteNombre ? ` - ${clienteNombre}` : ''}`}
        size="lg"
      >
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            {clienteId 
              ? 'Personaliza qué métricas aparecen y su orden para este cliente específico.'
              : 'Personaliza qué métricas aparecen y su orden por defecto para todos los clientes.'
            }
          </div>

          <div className="space-y-2">
            {metricasOrdenadas.map((metrica, index) => (
              <Card
                key={metrica.id}
                className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2 flex-shrink-0">
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                  <span className="text-sm font-medium text-gray-500 w-8 text-center">
                    {metrica.orden}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    {getMetricaLabel(metrica.id)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={metrica.visible}
                    onChange={(checked) => {
                      if (checked !== metrica.visible) {
                        handleToggleVisibilidad(metrica.id);
                      }
                    }}
                  />
                  {metrica.visible ? (
                    <Eye className="w-5 h-5 text-green-600" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleMoverArriba(index)}
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Mover arriba"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoverAbajo(index)}
                    disabled={index === metricasOrdenadas.length - 1}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Mover abajo"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="ghost"
              onClick={handleResetear}
              className="text-red-600 hover:text-red-700"
            >
              Resetear a valores por defecto
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={handleCancelar}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleGuardar}
                disabled={!hasChanges}
              >
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

