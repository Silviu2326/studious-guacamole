import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Badge, Input } from '../../../components/componentsreutilizables';
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Leaf,
  Zap,
  Eye,
  Copy,
} from 'lucide-react';
import {
  PlanAlternativo,
  ConfiguracionPlanAlternativo,
  TipoPlanAlternativo,
  OpcionesGeneracionPlanAlternativo,
  Dieta,
} from '../types';
import {
  generarPlanAlternativo,
  getPlanesAlternativosPorDieta,
  aplicarPlanAlternativo,
} from '../api/planesAlternativos';

interface GeneradorPlanesAlternativosProps {
  dieta: Dieta;
  onPlanAplicado?: (planAlternativo: PlanAlternativo) => void;
}

export const GeneradorPlanesAlternativos: React.FC<GeneradorPlanesAlternativosProps> = ({
  dieta,
  onPlanAplicado,
}) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [planesAlternativos, setPlanesAlternativos] = useState<PlanAlternativo[]>([]);
  const [generando, setGenerando] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoPlanAlternativo>('vegetariano');
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [configuracion, setConfiguracion] = useState<ConfiguracionPlanAlternativo>({
    tipo: 'vegetariano',
    mantenerEstructura: true,
  });
  const [planGenerado, setPlanGenerado] = useState<PlanAlternativo | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  useEffect(() => {
    if (mostrarModal) {
      cargarPlanesAlternativos();
    }
  }, [mostrarModal, dieta.id]);

  const cargarPlanesAlternativos = async () => {
    setCargando(true);
    try {
      const planes = await getPlanesAlternativosPorDieta(dieta.id);
      setPlanesAlternativos(planes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando planes alternativos');
    } finally {
      setCargando(false);
    }
  };

  const handleGenerar = async () => {
    setGenerando(true);
    setError(null);
    setExito(null);
    setPlanGenerado(null);

    try {
      const opciones: OpcionesGeneracionPlanAlternativo = {
        dietaId: dieta.id,
        configuracion,
        usarIA: true,
        mantenerMacrosObjetivo: true,
      };

      const plan = await generarPlanAlternativo(opciones);
      setPlanGenerado(plan);
      setPlanesAlternativos((prev) => [plan, ...prev]);
      setExito('Plan alternativo generado exitosamente');
      setTimeout(() => setExito(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generando plan alternativo');
    } finally {
      setGenerando(false);
    }
  };

  const handleAplicar = async (plan: PlanAlternativo) => {
    if (!confirm('¿Estás seguro de aplicar este plan alternativo? Reemplazará el plan actual.')) {
      return;
    }

    setError(null);
    try {
      await aplicarPlanAlternativo(plan.id);
      setExito('Plan alternativo aplicado exitosamente');
      setTimeout(() => setExito(null), 3000);
      onPlanAplicado?.(plan);
      await cargarPlanesAlternativos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error aplicando plan alternativo');
    }
  };

  const tiposPlanes: { tipo: TipoPlanAlternativo; nombre: string; icono: React.ReactNode; descripcion: string }[] = [
    {
      tipo: 'vegetariano',
      nombre: 'Versión Vegetariana',
      icono: <Leaf className="h-5 w-5" />,
      descripcion: 'Sin carne ni pescado',
    },
    {
      tipo: 'vegano',
      nombre: 'Versión Vegana',
      icono: <Leaf className="h-5 w-5" />,
      descripcion: '100% basado en plantas',
    },
    {
      tipo: 'presupuesto-reducido',
      nombre: 'Presupuesto Reducido',
      icono: <DollarSign className="h-5 w-5" />,
      descripcion: 'Optimizado para ahorrar',
    },
    {
      tipo: 'alto-presupuesto',
      nombre: 'Alto Presupuesto',
      icono: <DollarSign className="h-5 w-5" />,
      descripcion: 'Ingredientes premium',
    },
    {
      tipo: 'sin-gluten',
      nombre: 'Sin Gluten',
      icono: <Zap className="h-5 w-5" />,
      descripcion: 'Para celíacos',
    },
    {
      tipo: 'sin-lactosa',
      nombre: 'Sin Lactosa',
      icono: <Zap className="h-5 w-5" />,
      descripcion: 'Sin productos lácteos',
    },
    {
      tipo: 'keto',
      nombre: 'Keto',
      icono: <TrendingDown className="h-5 w-5" />,
      descripcion: 'Bajo en carbohidratos',
    },
    {
      tipo: 'paleo',
      nombre: 'Paleo',
      icono: <Leaf className="h-5 w-5" />,
      descripcion: 'Dieta paleolítica',
    },
  ];

  const renderComparacion = (plan: PlanAlternativo) => {
    const { macros, coste, cambios } = plan.comparacion;

    return (
      <div className="space-y-3">
        {/* Macros */}
        <div>
          <h4 className="text-xs font-semibold text-slate-700 mb-2">Macros Nutricionales</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500">Calorías:</span>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{macros.calorias.alternativo}</span>
                {macros.calorias.diferencia !== 0 && (
                  <Badge
                    className={`text-[10px] ${
                      macros.calorias.diferencia > 0
                        ? 'bg-green-50 text-green-600'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {macros.calorias.diferencia > 0 ? '+' : ''}
                    {macros.calorias.diferencia} ({macros.calorias.porcentaje > 0 ? '+' : ''}
                    {macros.calorias.porcentaje.toFixed(1)}%)
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <span className="text-slate-500">Proteínas:</span>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{macros.proteinas.alternativo.toFixed(1)}g</span>
                {macros.proteinas.diferencia !== 0 && (
                  <Badge
                    className={`text-[10px] ${
                      macros.proteinas.diferencia > 0
                        ? 'bg-green-50 text-green-600'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {macros.proteinas.diferencia > 0 ? '+' : ''}
                    {macros.proteinas.diferencia.toFixed(1)}g
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Coste */}
        {coste && (
          <div>
            <h4 className="text-xs font-semibold text-slate-700 mb-2">Coste Semanal</h4>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{coste.alternativo.toFixed(2)} €</span>
              {coste.diferencia !== 0 && (
                <Badge
                  className={`text-[10px] ${
                    coste.diferencia < 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}
                >
                  {coste.diferencia > 0 ? '+' : ''}
                  {coste.diferencia.toFixed(2)} € ({coste.porcentaje > 0 ? '+' : ''}
                  {coste.porcentaje.toFixed(1)}%)
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Cambios */}
        <div>
          <h4 className="text-xs font-semibold text-slate-700 mb-2">Cambios</h4>
          <div className="text-xs text-slate-600">
            {cambios.comidasSustituidas > 0 && <div>{cambios.comidasSustituidas} comidas sustituidas</div>}
            {cambios.comidasModificadas > 0 && <div>{cambios.comidasModificadas} comidas modificadas</div>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        leftIcon={<Sparkles className="h-4 w-4" />}
        onClick={() => setMostrarModal(true)}
      >
        Generar Plan Alternativo
      </Button>

      <Modal
        isOpen={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          setError(null);
          setExito(null);
          setPlanGenerado(null);
          setMostrarConfiguracion(false);
        }}
        title="Generar Plan Alternativo"
        size="xl"
      >
        <div className="space-y-6">
          {/* Mensajes de error y éxito */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {exito && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-700">{exito}</p>
            </div>
          )}

          {/* Selección de tipo */}
          {!mostrarConfiguracion && !planGenerado && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Selecciona el tipo de plan alternativo
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {tiposPlanes.map((tipo) => (
                  <Card
                    key={tipo.tipo}
                    className={`p-4 cursor-pointer transition-all ${
                      tipoSeleccionado === tipo.tipo
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                    }`}
                    onClick={() => {
                      setTipoSeleccionado(tipo.tipo);
                      setConfiguracion({
                        tipo: tipo.tipo,
                        mantenerEstructura: true,
                      });
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          tipoSeleccionado === tipo.tipo ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {tipo.icono}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-900">{tipo.nombre}</h4>
                        <p className="text-xs text-slate-500 mt-1">{tipo.descripcion}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={generando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  onClick={handleGenerar}
                  disabled={generando}
                >
                  {generando ? 'Generando...' : 'Generar Plan'}
                </Button>
              </div>
            </div>
          )}

          {/* Plan generado */}
          {planGenerado && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{planGenerado.nombre}</h3>
                  <p className="text-xs text-slate-500 mt-1">{planGenerado.descripcion}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<X className="h-4 w-4" />}
                  onClick={() => {
                    setPlanGenerado(null);
                    setMostrarConfiguracion(false);
                  }}
                >
                  Cerrar
                </Button>
              </div>

              {/* Comparación */}
              <Card className="p-4 bg-slate-50">
                {renderComparacion(planGenerado)}
              </Card>

              {/* Razones de cambios */}
              {planGenerado.razonesCambios.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 mb-2">Razones de los cambios</h4>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {planGenerado.razonesCambios.map((razon, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>{razon}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Acciones */}
              <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<CheckCircle2 className="h-4 w-4" />}
                  onClick={() => handleAplicar(planGenerado)}
                  className="flex-1"
                >
                  Aplicar Plan
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Eye className="h-4 w-4" />}
                  onClick={() => {
                    // En producción, aquí se abriría una vista detallada del plan
                    alert('Vista detallada del plan (funcionalidad pendiente)');
                  }}
                >
                  Ver Detalles
                </Button>
              </div>
            </div>
          )}

          {/* Planes alternativos generados anteriormente */}
          {!planGenerado && planesAlternativos.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Planes Alternativos Generados</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {planesAlternativos.map((plan) => (
                  <Card key={plan.id} className="p-4 bg-white border border-slate-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-sm font-semibold text-slate-900">{plan.nombre}</h4>
                          {plan.aplicado && (
                            <Badge className="bg-green-50 text-green-600 text-[10px]">
                              Aplicado
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mb-3">{plan.descripcion}</p>
                        {renderComparacion(plan)}
                      </div>
                      <div className="flex flex-col gap-2">
                        {!plan.aplicado && (
                          <Button
                            variant="primary"
                            size="sm"
                            leftIcon={<CheckCircle2 className="h-3 w-3" />}
                            onClick={() => handleAplicar(plan)}
                          >
                            Aplicar
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Eye className="h-3 w-3" />}
                          onClick={() => {
                            setPlanGenerado(plan);
                          }}
                        >
                          Ver
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Botón cerrar */}
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <Button
              variant="ghost"
              onClick={() => {
                setMostrarModal(false);
                setError(null);
                setExito(null);
                setPlanGenerado(null);
                setMostrarConfiguracion(false);
              }}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

