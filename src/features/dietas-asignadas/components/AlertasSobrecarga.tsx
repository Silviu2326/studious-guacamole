import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from '../../../components/componentsreutilizables';
import {
  AlertTriangle,
  X,
  CheckCircle2,
  Plus,
  Droplets,
  Apple,
  Zap,
  Loader2,
  Info,
  Package,
} from 'lucide-react';
import type { AlertaSobrecarga, BloquePreventivo, Dieta } from '../types';
import {
  detectarSobrecargas,
  marcarAlertaVista,
  aplicarBloquePreventivo,
} from '../api/alertasSobrecarga';

interface AlertasSobrecargaProps {
  dieta: Dieta;
  onBloqueAplicado?: () => void;
}

export const AlertasSobrecarga: React.FC<AlertasSobrecargaProps> = ({
  dieta,
  onBloqueAplicado,
}) => {
  const [alertas, setAlertas] = useState<AlertaSobrecarga[]>([]);
  const [cargando, setCargando] = useState(false);
  const [alertaSeleccionada, setAlertaSeleccionada] = useState<AlertaSobrecarga | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [aplicandoBloque, setAplicandoBloque] = useState<string | null>(null);

  useEffect(() => {
    cargarAlertas();
  }, [dieta.id]);

  const cargarAlertas = async () => {
    setCargando(true);
    try {
      const alertasData = await detectarSobrecargas(dieta);
      setAlertas(alertasData.filter(a => !a.bloqueAplicado));
    } catch (error) {
      console.error('Error cargando alertas:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleMarcarVista = async (alertaId: string) => {
    try {
      await marcarAlertaVista(alertaId);
      setAlertas(prev =>
        prev.map(a => (a.id === alertaId ? { ...a, vista: true } : a))
      );
    } catch (error) {
      console.error('Error marcando alerta como vista:', error);
    }
  };

  const handleAplicarBloque = async (bloque: BloquePreventivo) => {
    setAplicandoBloque(bloque.id);
    try {
      await aplicarBloquePreventivo(bloque.id, dieta.id);
      setAlertas(prev =>
        prev.map(a =>
          a.id === bloque.alertaId ? { ...a, bloqueAplicado: true } : a
        )
      );
      setMostrarModal(false);
      setAlertaSeleccionada(null);
      onBloqueAplicado?.();
    } catch (error) {
      console.error('Error aplicando bloque:', error);
    } finally {
      setAplicandoBloque(null);
    }
  };

  const getIconoTipo = (tipo: AlertaSobrecarga['tipo']) => {
    switch (tipo) {
      case 'exceso-fibra':
        return <Apple className="h-5 w-5 text-orange-500" />;
      case 'deficiencia-fibra':
        return <Apple className="h-5 w-5 text-red-500" />;
      case 'baja-hidratacion':
        return <Droplets className="h-5 w-5 text-blue-500" />;
      case 'exceso-procesados':
        return <Package className="h-5 w-5 text-yellow-500" />;
      case 'exceso-proteina':
      case 'exceso-carbohidratos':
      case 'exceso-grasas':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Zap className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getColorSeveridad = (severidad: AlertaSobrecarga['severidad']) => {
    switch (severidad) {
      case 'alta':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'media':
        return 'bg-orange-50 border-orange-200 text-orange-900';
      case 'baja':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
    }
  };

  if (cargando) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <span className="ml-2 text-sm text-gray-600">Analizando dieta...</span>
        </div>
      </Card>
    );
  }

  if (alertas.length === 0) {
    return (
      <Card className="p-4 border-green-200 bg-green-50">
        <div className="flex items-center gap-2 text-sm text-green-800">
          <CheckCircle2 className="h-4 w-4" />
          <span>No se detectaron sobrecargas en la dieta</span>
        </div>
      </Card>
    );
  }

  // Ordenar por severidad
  const alertasOrdenadas = [...alertas].sort((a, b) => {
    const orden = { alta: 0, media: 1, baja: 2 };
    return orden[a.severidad] - orden[b.severidad];
  });

  return (
    <>
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold text-gray-900">
              Alertas de Sobrecarga ({alertas.length})
            </h3>
          </div>
          <button
            onClick={cargarAlertas}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Actualizar
          </button>
        </div>

        <div className="space-y-2">
          {alertasOrdenadas.map((alerta) => (
            <div
              key={alerta.id}
              className={`p-3 rounded-lg border ${getColorSeveridad(alerta.severidad)} ${
                !alerta.vista ? 'ring-2 ring-offset-2 ring-red-300' : ''
              }`}
            >
                  <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getIconoTipo(alerta.tipo)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{alerta.titulo}</h4>
                      <p className="text-xs opacity-90 mb-2">{alerta.descripcion}</p>
                      {alerta.detalles.valores && (
                        <div className="text-xs opacity-75 mb-2">
                          {Object.entries(alerta.detalles.valores).map(([key, value]) => (
                            <span key={key} className="mr-3">
                              {key === 'fibra' || key === 'objetivo' ? `${key}: ${value}g` :
                               key === 'hidratacion' || key === 'agua' ? `${key}: ${value}ml` :
                               `${key}: ${value}`}
                            </span>
                          ))}
                        </div>
                      )}
                      {/* Soluciones concretas */}
                      {alerta.soluciones && alerta.soluciones.length > 0 && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <h5 className="text-xs font-semibold text-blue-900 mb-2 flex items-center gap-1">
                            <Info className="h-3 w-3" />
                            Soluciones concretas:
                          </h5>
                          <ul className="space-y-1.5">
                            {alerta.soluciones.map((solucion, index) => (
                              <li key={index} className="text-xs text-blue-800 flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">•</span>
                                <span>{solucion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    {!alerta.vista && (
                      <button
                        onClick={() => handleMarcarVista(alerta.id)}
                        className="flex-shrink-0 p-1 hover:bg-white/50 rounded"
                        title="Marcar como vista"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {alerta.bloquePreventivo && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => {
                        setAlertaSeleccionada(alerta);
                        setMostrarModal(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Añadir Bloque Preventivo
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Modal para aplicar bloque preventivo */}
      {mostrarModal && alertaSeleccionada && alertaSeleccionada.bloquePreventivo && (
        <Modal
          isOpen={mostrarModal}
          onClose={() => {
            setMostrarModal(false);
            setAlertaSeleccionada(null);
          }}
          title="Aplicar Bloque Preventivo"
          size="md"
        >
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm text-blue-900 mb-1">
                    {alertaSeleccionada.bloquePreventivo.nombre}
                  </h4>
                  <p className="text-sm text-blue-800">
                    {alertaSeleccionada.bloquePreventivo.descripcion}
                  </p>
                </div>
              </div>
            </div>

            {alertaSeleccionada.bloquePreventivo.ajusteMacros && (
              <div>
                <h5 className="text-sm font-semibold text-gray-900 mb-2">Ajustes propuestos:</h5>
                <div className="space-y-1 text-sm text-gray-700">
                  {alertaSeleccionada.bloquePreventivo.ajusteMacros.calorias && (
                    <div>Calorías: {alertaSeleccionada.bloquePreventivo.ajusteMacros.calorias > 0 ? '+' : ''}{alertaSeleccionada.bloquePreventivo.ajusteMacros.calorias} kcal</div>
                  )}
                  {alertaSeleccionada.bloquePreventivo.ajusteMacros.proteinas && (
                    <div>Proteínas: {alertaSeleccionada.bloquePreventivo.ajusteMacros.proteinas > 0 ? '+' : ''}{alertaSeleccionada.bloquePreventivo.ajusteMacros.proteinas}g</div>
                  )}
                  {alertaSeleccionada.bloquePreventivo.ajusteMacros.carbohidratos && (
                    <div>Carbohidratos: {alertaSeleccionada.bloquePreventivo.ajusteMacros.carbohidratos > 0 ? '+' : ''}{alertaSeleccionada.bloquePreventivo.ajusteMacros.carbohidratos}g</div>
                  )}
                  {alertaSeleccionada.bloquePreventivo.ajusteMacros.grasas && (
                    <div>Grasas: {alertaSeleccionada.bloquePreventivo.ajusteMacros.grasas > 0 ? '+' : ''}{alertaSeleccionada.bloquePreventivo.ajusteMacros.grasas}g</div>
                  )}
                  {alertaSeleccionada.bloquePreventivo.ajusteMacros.fibra && (
                    <div>Fibra: {alertaSeleccionada.bloquePreventivo.ajusteMacros.fibra > 0 ? '+' : ''}{alertaSeleccionada.bloquePreventivo.ajusteMacros.fibra}g</div>
                  )}
                  {alertaSeleccionada.bloquePreventivo.ajusteMacros.agua && (
                    <div>Agua: +{alertaSeleccionada.bloquePreventivo.ajusteMacros.agua}ml</div>
                  )}
                </div>
              </div>
            )}

            <div>
              <h5 className="text-sm font-semibold text-gray-900 mb-2">Días a aplicar:</h5>
              <div className="flex flex-wrap gap-2">
                {alertaSeleccionada.bloquePreventivo.diasAplicar.map((dia) => (
                  <span
                    key={dia}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {dia.charAt(0).toUpperCase() + dia.slice(1)}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t">
              <Button
                variant="ghost"
                onClick={() => {
                  setMostrarModal(false);
                  setAlertaSeleccionada(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => handleAplicarBloque(alertaSeleccionada.bloquePreventivo!)}
                disabled={aplicandoBloque === alertaSeleccionada.bloquePreventivo!.id}
              >
                {aplicandoBloque === alertaSeleccionada.bloquePreventivo!.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Aplicando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Aplicar Bloque
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

